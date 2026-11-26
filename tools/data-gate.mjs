// data-gate.mjs - before run-card starts Playwright: is this card's test data reset and READY?
// Design: docs/superpowers/specs/2026-11-20-card-test-data-design.md (section 5).
// A card with a data file (<PW_REPO>/scripts/seed/cards/<KEY>.data.cjs) runs only when
//   (a) <PW_REPO>/output/seed/<KEY>.json has a resetAt newer than the card's last run folder, and
//   (b) `node scripts/seed/card-data.cjs <KEY> check` says READY, and
//   (c) no lock is held on the card.
// A card without a data file is not touched (old way). --no-data-check opens the gate and says so.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const STALE_MIN = 120; // same as the Playwright repo's scripts/seed/card/lock.cjs
const lockFile = (pwRepo, key) => path.join(pwRepo, 'output', 'seed', `${key}.lock`);
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };

/** `exclude`: a run folder name not to count (the manual runner's own folder, made before its gate). Start time of the card's last run folder (output/runs/<YYYY-MM-DD>_<HHMMSS>_<KEY>, or ..._<KEY>_manual of the manual runner; local time), or null. */
export function lastRunTime(pwRepo, key, { exclude = null } = {}) {
  let dirs = [];
  try { dirs = fs.readdirSync(path.join(pwRepo, 'output', 'runs')); } catch { return null; }
  const re = new RegExp(`^(\\d{4})-(\\d{2})-(\\d{2})_(\\d{2})(\\d{2})(\\d{2})_${key}(?:_manual)?$`);
  const times = dirs.filter((d) => d !== exclude).map((d) => d.match(re)).filter(Boolean).map((m) => new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  return times.length ? new Date(Math.max(...times.map((t) => t.getTime()))) : null;
}

/** Same file and format as card-data.cjs (lock.cjs): { owner, pid, at }. */
export function takeLock(pwRepo, key, owner, now = new Date()) {
  const f = lockFile(pwRepo, key);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  try { fs.writeFileSync(f, JSON.stringify({ owner, pid: process.pid, at: now.toISOString() }), { flag: 'wx' }); return { ok: true }; }
  catch { return { ok: false, lock: readJson(f) }; }
}
export function releaseLock(pwRepo, key) { try { fs.unlinkSync(lockFile(pwRepo, key)); } catch { /* gone */ } }

/**
 * Take the card lock for a run and free it however the run ends: process exit, Ctrl+C, SIGTERM, SIGHUP (terminal closed),
 * or a child (Playwright) that fails to start. `attach(child)` adds the child's 'error' after it is spawned.
 * @returns {{ ok: boolean, lock?: object, release: () => void, attach: (child: import('node:events').EventEmitter) => void }}
 */
export function holdLock(pwRepo, key, { proc = process, child = null, now = new Date(), owner = 'run-card' } = {}) {
  const t = takeLock(pwRepo, key, owner, now);
  let held = t.ok;
  const release = () => { if (held) { held = false; releaseLock(pwRepo, key); } };
  if (!t.ok) return { ok: false, lock: t.lock, release: () => {}, attach: () => {} };
  proc.on('exit', release);
  for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) proc.on(sig, () => { release(); proc.exit(code); });
  const attach = (c) => c.on('error', (err) => { release(); console.error(`[run-card] Playwright did not start: ${err.message}`); proc.exit(1); });
  if (child) attach(child);
  return { ok: true, release, attach };
}

function defaultCheck(pwRepo, key) {
  const r = spawnSync(process.execPath, [path.join('scripts', 'seed', 'card-data.cjs'), key, 'check'], { cwd: pwRepo, encoding: 'utf8' });
  return { code: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}` };
}

/**
 * @returns {Promise<{ ok: boolean, message: string, check?: { status: string, code: number, out: string } }>}
 */
export async function dataGate({ pwRepo, key, now = new Date(), skip = false, runCheck = async () => defaultCheck(pwRepo, key), lastRun }) {
  if (!fs.existsSync(path.join(pwRepo, 'scripts', 'seed', 'cards', `${key}.data.cjs`))) return { ok: true, message: `${key}: no data file (old way)` };
  if (skip) return { ok: true, message: `${key}: data not reset (--no-data-check)`, check: { status: 'NOT CHECKED', code: -1, out: '' } };
  const reset = `node scripts/seed/card-data.cjs ${key} reset (dry run), then --apply after the user's yes`;
  const lock = readJson(lockFile(pwRepo, key));
  if (lock) {
    const age = Math.round((now.getTime() - new Date(lock.at).getTime()) / 60_000);
    return { ok: false, message: age > STALE_MIN
      ? `${key}: lock ${lockFile(pwRepo, key)} is stale (${lock.owner}, ${age} min old): check nothing runs for this card, then delete the file`
      : `${key}: lock held by ${lock.owner} (${age} min): wait for it to finish` };
  }
  const result = readJson(path.join(pwRepo, 'output', 'seed', `${key}.json`));
  const last = lastRun === undefined ? lastRunTime(pwRepo, key) : lastRun;
  if (!result?.resetAt) return { ok: false, message: `${key}: data never reset. Run in ${pwRepo}: ${reset}` };
  if (last && new Date(result.resetAt) <= last) return { ok: false, message: `${key}: data last reset ${result.resetAt}, before the last run (${last.toISOString()}). Run in ${pwRepo}: ${reset}` };
  const c = await runCheck();
  const status = (c.out.match(/^(READY|NEEDS RESET|NEEDS SETUP|NEEDS MANUAL)\s*$/m) || [])[1] || (c.code === 0 ? 'READY' : 'UNKNOWN');
  const check = { status, code: c.code, out: c.out };
  if (c.code !== 0 || status !== 'READY') return { ok: false, message: `${key}: data check says ${status}:\n${c.out.trim()}\nRun in ${pwRepo}: node scripts/seed/card-data.cjs ${key} check`, check };
  return { ok: true, message: `${key}: data reset ${result.resetAt} and READY`, check };
}

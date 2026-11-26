#!/usr/bin/env node
// gate.mjs - card data rules for the manual runner (spec section 7), same as run-card:
//   node tools/manual/gate.mjs <KEY> take [--run <run folder>]  data gate first when the card has a data file (scripts/seed/cards/<KEY>.data.cjs),
//                                               then the card lock <PW_REPO>/output/seed/<KEY>.lock with owner "manual-runner"
//   node tools/manual/gate.mjs <KEY> release   removes the lock, only when manual-runner owns it
// Exit 2 with the reason (and the lock owner) when refused. The agent releases the lock at the end of the Test, also on error.
import { isKey } from '../profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dataGate, takeLock, releaseLock, lastRunTime } from '../data-gate.mjs';
import { resolveRepos } from '../heal/config.mjs';

export const OWNER = 'manual-runner';
const lockFile = (pwRepo, key) => path.join(pwRepo, 'output', 'seed', `${key}.lock`);
const readLock = (pwRepo, key) => { try { return JSON.parse(fs.readFileSync(lockFile(pwRepo, key), 'utf8')); } catch { return null; } };

/** @returns {Promise<{ code: 0|2, message: string }>} */
export async function gate({ pwRepo, key, action, runCheck, run = null, now = new Date() }) {
  if (action === 'release') {
    const l = readLock(pwRepo, key);
    if (!l) return { code: 0, message: `${key}: no lock` };
    if (l.owner !== OWNER) return { code: 2, message: `${key}: lock held by ${l.owner} since ${l.at}, not by ${OWNER}: left alone` };
    releaseLock(pwRepo, key);
    return { code: 0, message: `${key}: lock released` };
  }
  if (action !== 'take') return { code: 2, message: `unknown action "${action}" (take | release)` };
  // the run folder of this manual run is made before the gate: it is not a run that used the data
  const lastRun = lastRunTime(pwRepo, key, { exclude: run ? path.basename(path.resolve(run)) : null });
  const g = await dataGate({ pwRepo, key, now, lastRun, ...(runCheck ? { runCheck } : {}) });
  if (!g.ok) return { code: 2, message: g.message };
  const t = takeLock(pwRepo, key, OWNER, now);
  if (!t.ok) return { code: 2, message: `${key}: lock held by ${t.lock?.owner ?? '?'} since ${t.lock?.at ?? '?'}: wait for it to finish` };
  return { code: 0, message: `${g.message}; lock taken by ${OWNER} (${lockFile(pwRepo, key)})` };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [key, action, ...rest] = process.argv.slice(2);
  const run = rest.includes('--run') ? rest[rest.indexOf('--run') + 1] : null;
  if (!isKey(key || '') || !['take', 'release'].includes(action)) {
    console.error('Usage: node tools/manual/gate.mjs <KEY> take [--run <run folder>] | release');
    process.exit(2);
  }
  const r = await gate({ pwRepo: resolveRepos().pwRepo, key, action, run });
  (r.code ? console.error : console.log)(`[manual gate] ${r.message}`);
  process.exit(r.code);
}

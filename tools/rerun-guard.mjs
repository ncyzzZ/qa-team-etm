#!/usr/bin/env node
// rerun-guard.mjs - do not run a test again when nothing that can change its result has changed (user, chat 2026-11-26: "ลดรันซ้ำ",
// "บล็อก ยกเว้น --force"). Runs 24-26 Nov: 1,243 test runs; 270 failed again with the same error and nothing changed,
// 177 re-ran a test that had already passed, 72 tests ran 7+ times (ETM-8655: 23).
//
// run-card calls plan() before any data step. Per selected test:
//   drop  "same result": its last run passed / was skipped / failed with error X, and since that run nothing changed:
//         not the spec or a file it imports, not the card data file, not stms-fe origin/develop.
//   drop  "N failed rounds today": failed in 3 runs today (first run + 2 fixes, TEAM.md fix rounds): offer it as manual.
//   keep  everything else, and always a failure whose cause was env or flaky (auto-next re-runs those once a day).
// The lead overrides with `run-card ... --force-rerun "<why>"`; each override goes to work/<KEY>/rerun-log.jsonl.
//
//   node tools/rerun-guard.mjs <KEY> <spec ...> [-g "<filter>"]     print what run-card would run and drop (read only)
import { isKey } from './profile.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rowsFromResults } from './run-results.mjs';
import { scanSpec } from './live-check.mjs';

const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
export const FAILED_ROUNDS_LIMIT = 3;
const ALIASES = { '@pages/': 'pages/', '@fixtures/': 'fixtures/', '@appConfig/': 'appConfig/', '@components/': 'pages/sharedComponent/', '@utils/': 'utils/', '@dataTests/': 'dataTests/' };

/**
 * Hash per test key: the test's own body plus the spec text outside every test body (shared helpers, beforeEach ...).
 * Editing one test changes only its hash. run-card saves them as test-hashes.json in each run folder.
 */
export function testHashes(text) {
  const re = /\btest(?:\.(?:only|skip|fixme))?\(\s*(['"`])([^'"`]+)\1/g;
  const marks = [...text.matchAll(re)].map((m) => ({ title: m[2], at: m.index }));
  const bodies = marks.map((t, i) => text.slice(t.at, i + 1 < marks.length ? marks[i + 1].at : text.length));
  const common = marks.length ? text.slice(0, marks[0].at) : text;
  const out = {};
  marks.forEach((t, i) => { const k = (t.title.match(/^\[?(ETM-\d+)\b/) || [])[1]; if (k) out[k] = crypto.createHash('sha1').update(common).update(bodies[i]).digest('hex').slice(0, 12); });
  return out;
}

/** Test keys of a spec text, with titles (skipped tests too). */
export function testsOf(text) { return scanSpec(text).filter((t) => t.key).map((t) => ({ key: t.key, title: t.title })); }

/** Keys selected by a -g filter (Playwright: regex over the title); null when the filter matches no title (cannot map it). */
export function selected(tests, grep) {
  if (!grep) return tests.map((t) => t.key);
  let re; try { re = new RegExp(grep); } catch { return null; }
  const keys = tests.filter((t) => re.test(t.title)).map((t) => t.key);
  return keys.length ? [...new Set(keys)] : null;
}

/** Newest-first history of one test over the card's run folders: [{run, start, end, status, msg, cause}] */
export function history(runsDir, card, testKey) {
  const out = [];
  const runs = (fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : []).filter((d) => d.endsWith(`_${card}`)).sort().reverse();
  for (const run of runs) {
    const j = readJson(path.join(runsDir, run, 'results.json'), null);
    if (!j) continue;
    const row = rowsFromResults(j, () => '').find((x) => x.title.startsWith(testKey + ' ') || x.title === testKey);
    if (!row) continue;
    const start = j.stats?.startTime ? new Date(j.stats.startTime).getTime() : null;
    const tri = readJson(path.join(runsDir, run, 'triage.json'), []).find((t) => t.key === testKey);
    const hash = readJson(path.join(runsDir, run, 'test-hashes.json'), {})[testKey] || null;
    out.push({ run, start, end: start == null ? null : start + (j.stats.duration || 0), status: row.status, msg: row.msg || '', cause: tri?.cause || null, hash });
  }
  return out;
}

/** Local files a spec depends on: itself, its relative / alias imports (two levels), and the card data file. */
export function inputsOf(specAbs, pwRepo, card) {
  const seen = new Set();
  const visit = (f, depth) => {
    if (seen.has(f) || !fs.existsSync(f)) return; seen.add(f);
    if (depth >= 2) return;
    const t = fs.readFileSync(f, 'utf8');
    for (const m of t.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      let p = m[1]; let base = null;
      if (p.startsWith('.')) base = path.resolve(path.dirname(f), p);
      else { const a = Object.keys(ALIASES).find((k) => p.startsWith(k)); if (a) base = path.join(pwRepo, ALIASES[a] + p.slice(a.length)); }
      if (!base) continue;
      for (const c of [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) { visit(c, depth + 1); break; }
    }
  };
  visit(specAbs, 0);
  const data = path.join(pwRepo, 'scripts', 'seed', 'cards', `${card}.data.cjs`);
  if (fs.existsSync(data)) seen.add(data);
  return [...seen];
}
export const newestMtime = (files) => Math.max(0, ...files.map((f) => { try { return fs.statSync(f).mtimeMs; } catch { return 0; } }));

/**
 * Decision for one test. @param h history newest first; @param changedAt ms of the newest change to its inputs (files or stms-fe);
 * @param now ms; @param c { hash: the test's hash now, specAt: mtime of the spec, otherAt: newest of the other inputs and stms-fe }.
 * When the last run saved the test's hash, an edit of the spec counts only if this test's hash changed. Returns { keep, why }.
 */
export function decide(h, changedAt, now = Date.now(), c = null) {
  if (!h.length) return { keep: true, why: 'never ran' };
  const last = h[0];
  const day = new Date(now).toDateString();
  const failedToday = h.filter((x) => x.start && new Date(x.start).toDateString() === day && (x.status === 'failed' || x.status === 'timedOut')).length;
  if (['env', 'flaky'].includes(last.cause) || last.status === 'flaky' || last.status === 'interrupted') return { keep: true, why: `last result ${last.cause || last.status}: a re-run can differ` };
  if (failedToday >= FAILED_ROUNDS_LIMIT) return { keep: false, why: `failed in ${failedToday} runs today (limit ${FAILED_ROUNDS_LIMIT}): stop and offer it as manual (TEAM.md fix rounds)` };
  if (c && last.hash && last.end) {
    if (c.hash !== last.hash) return { keep: true, why: 'this test changed since its last run' };
    if (c.otherAt > last.end) return { keep: true, why: 'an import, the card data or stms-fe changed since its last run' };
  } else if (last.end && changedAt > last.end) return { keep: true, why: 'changed since its last run' };
  const was = last.status === 'passed' ? 'passed' : last.status === 'skipped' ? 'was skipped' : `failed with "${last.msg.slice(0, 50)}"`;
  return { keep: false, why: `same result expected: ${was} in ${last.run.slice(0, 17)} and nothing changed since (spec, its imports, card data, stms-fe)` };
}

/**
 * The whole plan for one run-card call.
 * @param o { key, pwRepo, specs: [relative spec paths], grep, now, feChangedAt: ms of the newest stms-fe origin/develop commit or 0 }
 * @returns { mapped, keep:[key], drop:[{key, why}], keepWhy:{key: why}, hashes:{key: hash}, grep: new -g or null }
 */
export function plan({ key, pwRepo, specs, grep, now = Date.now(), feChangedAt = 0 }) {
  const runsDir = path.join(pwRepo, 'output', 'runs');
  const keep = [], drop = [], keepWhy = {}, hashes = {};
  let mapped = true;
  for (const spec of specs) {
    const abs = path.join(pwRepo, spec);
    const text = fs.readFileSync(abs, 'utf8');
    const tests = testsOf(text);
    Object.assign(hashes, testHashes(text));
    const sel = selected(tests, grep);
    if (!sel) { mapped = false; continue; }
    const inputs = inputsOf(abs, pwRepo, key);
    const changedAt = Math.max(newestMtime(inputs), feChangedAt);
    const otherAt = Math.max(newestMtime(inputs.filter((f) => f !== abs)), feChangedAt);
    for (const k of sel) {
      const d = decide(history(runsDir, key, k), changedAt, now, { hash: hashes[k], otherAt });
      if (d.keep) { keep.push(k); keepWhy[k] = d.why; } else drop.push({ key: k, why: d.why });
    }
  }
  return { mapped, keep, drop, keepWhy, hashes, grep: drop.length && keep.length ? keep.map((k) => `${k}\\b`).join('|') : null };
}

/** ms of the newest commit on stms-fe origin/develop (read only, fe-git allow-list); 0 when it cannot be read. */
export async function feChangedAt() {
  try {
    const { resolveRepos } = await import('./heal/config.mjs');
    const { git } = await import('./heal/fe-git.mjs');
    const { feRepo } = resolveRepos();
    if (!fs.existsSync(path.join(feRepo, '.git'))) return 0;
    try { git(feRepo, ['fetch', '--quiet', 'origin']); } catch { /* offline */ }
    const iso = git(feRepo, ['log', '-1', '--format=%cI', 'origin/develop']);
    return iso ? new Date(iso).getTime() : 0;
  } catch { return 0; }
}

export function logForce(root, key, entry) {
  const dir = path.join(root, 'work', key); fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, 'rerun-log.jsonl'), JSON.stringify({ t: new Date().toISOString(), ...entry }) + '\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [key, ...rest] = process.argv.slice(2);
  if (!isKey(key || '')) { console.error('Usage: node tools/rerun-guard.mjs <KEY> <spec ...> [-g "<filter>"]'); process.exit(2); }
  const { resolveRepos } = await import('./heal/config.mjs');
  const { specFilesFrom } = await import('./heal/run-plan.mjs');
  const { pwRepo } = resolveRepos();
  const gi = rest.findIndex((a) => a === '-g' || a === '--grep');
  const p = plan({ key, pwRepo, specs: specFilesFrom(rest, pwRepo), grep: gi >= 0 ? rest[gi + 1] : null, feChangedAt: await feChangedAt() });
  if (!p.mapped) console.log('[rerun-guard] the -g filter matches no test title: guard not applied');
  for (const k of p.keep) console.log(`RUN   ${k}  (${p.keepWhy[k]})`);
  for (const d of p.drop) console.log(`DROP  ${d.key}  ${d.why}`);
}

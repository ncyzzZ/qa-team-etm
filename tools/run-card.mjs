// run-card.mjs - run Playwright for ONE ETM card and build its evidence report straight away.
// Each run gets its own result folder and its own report file, so two or more cards can run at
// the same time without wiping each other's pictures or overwriting each other's report.
//
//   node tools/run-card.mjs ETM-7879 etm7879/verifyMobPlanNoColumn.spec -g "ETM-8086|ETM-8087"
//   node tools/run-card.mjs ETM-7879 <spec> -g "<filter>" --workers=2        (extra flags go to Playwright)
//   node tools/run-card.mjs ETM-7879 --build-only output/runs/2026-11-17_111500_ETM-7879   (report from a saved folder)
//
// Env: PW_REPO = folder of the Playwright repo ep-etm-fe-qa (or PW_REPO=... in the git-ignored .env at the repo root; default: the folder `ep-etm-fe-qa` next to this repo)
// Optional: <os tmp>/tc-manifest-<KEY>.json  (same shape as the skill's tc-manifest.json)
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { retriesFor, specFilesFrom, canAdvanceBaseline } from './heal/run-plan.mjs';
import { triageRun, countByCause } from './heal/triage.mjs';
import { pagesUsedBy, advanceBaseline } from './heal/baseline.mjs';
import { git as feGit } from './heal/fe-git.mjs';
import { dataGate, takeLock, releaseLock } from './data-gate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const GEN = path.join(HERE, 'evidence-report-v4.mjs');
// PW_REPO: environment variable, else `PW_REPO=...` in the git-ignored `.env` at the repo root, else ../ep-etm-fe-qa
function envFileValue(name) {
  try {
    const m = fs.readFileSync(path.join(ROOT, '.env'), 'utf8').match(new RegExp('^\s*' + name + '\s*=\s*(.+?)\s*$', 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}
const REPO = process.env.PW_REPO || envFileValue('PW_REPO') || path.resolve(ROOT, '..', 'ep-etm-fe-qa');

const [key, ...argsIn] = process.argv.slice(2);
// --no-data-check: run without the card data gate (the user asked for it on purpose); not passed to Playwright
const NO_DATA_CHECK = argsIn.includes('--no-data-check');
const rest = argsIn.filter((a) => a !== '--no-data-check');
if (!key || !/^ETM-\d+$/.test(key)) {
  console.error('Usage: node tools/run-card.mjs ETM-1234 <spec> [-g "ETM-1|ETM-2"] [--no-data-check] [playwright flags]\n   or: node tools/run-card.mjs ETM-1234 --build-only <result-folder>');
  process.exit(2);
}
if (!fs.existsSync(GEN)) { console.error(`Generator not found: ${GEN}`); process.exit(2); }

const pad = (n) => String(n).padStart(2, '0');
const d = new Date();
const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

function buildReport(resultsDir) {
  const input = path.join(resultsDir, 'results.json');
  if (!fs.existsSync(input)) { console.error(`No results.json in ${resultsDir} - no report built.`); return null; }
  // build in a private folder, then move: two builds in the same minute cannot collide
  const tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), `evrep-${key}-`));
  const manifest = path.join(os.tmpdir(), `tc-manifest-${key}.json`);
  const args = [GEN, '--input', input, '--out', tmpOut, '--title', `${key} run ${stamp}`];
  if (fs.existsSync(manifest)) args.push('--manifest', manifest);
  const review = path.join(resultsDir, `review-${key}.json`); // optional per-step verdicts, see evidence-report-v4.mjs
  if (fs.existsSync(review)) args.push('--review', review);
  const triage = path.join(resultsDir, 'triage.json'); // cause per failed test (tools/heal/triage.mjs)
  if (fs.existsSync(triage)) args.push('--triage', triage);
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) { console.error(`Report generator failed:\n${r.stderr || r.stdout}`); return null; }
  const built = fs.readdirSync(tmpOut).find((f) => /^evidence-report-.*\.html$/.test(f));
  if (!built) { console.error('Generator produced no report file.'); return null; }
  // the report lives in the run folder next to results.json; only the "latest" shortcuts sit one level up
  const finalName = `evidence-report-${key}-${stamp}.html`;
  const runsRoot = path.dirname(path.resolve(resultsDir));
  fs.copyFileSync(path.join(tmpOut, built), path.join(resultsDir, finalName));
  fs.copyFileSync(path.join(tmpOut, built), path.join(runsRoot, `latest-${key}.html`));
  fs.copyFileSync(path.join(tmpOut, built), path.join(runsRoot, 'latest.html'));
  fs.rmSync(tmpOut, { recursive: true, force: true });
  return path.join(resultsDir, finalName);
}

let counts = null;

// ---- quality of the scripts (proven rate), one line per run in .claude/team/quality.jsonl ----
// A skipped test is one of: "not-proven" (reached the end but a part was not checked, from notProvenGuard),
// "fixme" (feature or decision missing), "precondition" (.env / test data missing before it started).
function skipKind(ann) {
  const s = ann.filter((a) => a.type === 'skip' || a.type === 'fixme');
  if (s.some((a) => /^Not proven/.test(a.description || ''))) return 'not-proven';
  if (s.some((a) => a.type === 'fixme')) return 'fixme';
  return 'precondition';
}
function recordQuality(rows) {
  const by = (f) => rows.filter(f).length;
  const q = {
    t: new Date().toISOString(), card: key, ran: rows.length,
    passed: by((x) => x.status === 'passed'), failed: by((x) => x.status === 'failed' || x.status === 'timedOut'), flaky: by((x) => x.status === 'flaky'),
    notProven: by((x) => x.status === 'skipped' && x.why === 'not-proven'), fixme: by((x) => x.status === 'skipped' && x.why === 'fixme'),
    precondition: by((x) => x.status === 'skipped' && x.why === 'precondition'),
  };
  q.provenRate = q.ran ? Math.round((q.passed / q.ran) * 100) : 0;
  console.log(`  proven ${q.passed}/${q.ran} (${q.provenRate}%) | not proven ${q.notProven} | fixme ${q.fixme} | precondition missing ${q.precondition}`);
  try { fs.appendFileSync(path.join(ROOT, '.claude', 'team', 'quality.jsonl'), JSON.stringify(q) + '\n'); } catch { /* optional */ }
  counts = { ...(counts || {}), proven: q.provenRate };
}
function summarise(resultsDir) {
  try {
    const r = JSON.parse(fs.readFileSync(path.join(resultsDir, 'results.json'), 'utf8'));
    const rows = [];
    (function walk(s) {
      (s.specs || []).forEach((sp) => sp.tests.forEach((t) => {
        const x = t.results[t.results.length - 1];
        const flaky = x.status === 'passed' && t.results.some((y) => y.status === 'failed' || y.status === 'timedOut');
        rows.push({ title: sp.title, status: flaky ? 'flaky' : x.status, why: skipKind(t.annotations || x.annotations || []), msg: ((x.error && x.error.message) || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 160) });
      }));
      (s.suites || []).forEach(walk);
    })(r);
    const n = (st) => rows.filter((x) => x.status === st).length;
    counts = { ran: rows.length, pass: n('passed'), fail: n('failed') + n('timedOut') + n('flaky') };
    console.log(`\n== ${key}: ran ${rows.length} | passed ${n('passed')} | failed ${n('failed') + n('timedOut')} | flaky ${n('flaky')} | skipped ${n('skipped')}`);
    rows.filter((x) => x.status === 'flaky').forEach((x) => console.log(`  FLAKY ${x.title.slice(0, 70)} (failed, then passed on retry: not a clean pass)`));
    rows.filter((x) => x.status === 'failed' || x.status === 'timedOut').forEach((x) => console.log(`  FAIL ${x.title.slice(0, 70)} :: ${x.msg}`));
    recordQuality(rows);
    recordRunResults(rows, resultsDir);
  } catch (e) { console.error(`Could not read results.json: ${e.message}`); }
}

// ---- result per Xray test key, merged over runs: work/<KEY>/run-results.json (read by `qa-check strength` for "AC proven") ----
// A key keeps its newest result; a run with -g only updates the keys it ran. Worst result wins inside one run.
const RANK = { failed: 0, timedOut: 0, interrupted: 0, flaky: 1, skipped: 2, passed: 3 };
function recordRunResults(rows, resultsDir) {
  const file = path.join(ROOT, 'work', key, 'run-results.json');
  let j = { card: key, tests: {} };
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); j.tests = j.tests || {}; } catch { /* first run */ }
  const t = new Date().toISOString(), run = path.basename(path.resolve(resultsDir)), now = {};
  for (const x of rows) {
    for (const k of new Set(x.title.match(/\bETM-\d+\b/g) || [])) {
      if (k === key) continue;
      const r = { status: x.status, why: x.status === 'skipped' ? x.why : undefined, t, run };
      if (!now[k] || (RANK[r.status] ?? 0) < (RANK[now[k].status] ?? 0)) now[k] = r;
    }
  }
  Object.assign(j.tests, now);
  j.card = key; j.updated = t;
  try { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(j, null, 1) + '\n'); console.log(`  run results: ${Object.keys(now).length} test key(s) -> ${path.relative(ROOT, file)}`); }
  catch (e) { console.log(`  run results not saved: ${e.message}`); }
}

// Put the new report on the QA status board (pass or fail). Never stops the run if the board is missing.
const TEAM_MJS = path.join(ROOT, '.claude', 'team', 'team.mjs');
function pushToBoard(report) {
  if (!report || !fs.existsSync(TEAM_MJS)) return;
  const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const res = counts ? ` | ${counts.pass} pass / ${counts.fail} fail | proven ${counts.proven ?? '?'}%` : '';
  const r = spawnSync(process.execPath, [TEAM_MJS, 'link', `Evidence report ${key} (${hhmm})${res}`, report, '--kind', 'report', '--job', key], { cwd: path.dirname(TEAM_MJS), encoding: 'utf8' });
  console.log(r.status === 0 ? '[run-card] Report link sent to the board.' : '[run-card] Board link skipped.');
}

// ---- build-only mode
if (rest[0] === '--build-only') {
  const dir = path.resolve(REPO, rest[1] || '');
  try { if (fs.existsSync(path.join(dir, 'results.json'))) triageRun(dir); } catch (e) { console.log(`[triage] skipped: ${e.message}`); }
  summarise(dir);
  const out = buildReport(dir);
  console.log(out ? `Report: ${out}` : 'No report.');
  pushToBoard(out);
  process.exit(out ? 0 : 1);
}

// ---- run mode
// everything of one run goes under output/runs/ in the Playwright repo (one folder per run)
const resultsDirName = path.join('output', 'runs', `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${stamp.split('-')[1]}_${key}`);
const resultsDir = path.join(REPO, resultsDirName);
// call Playwright's own CLI with node, no shell: a "|" in -g "A|B" must reach Playwright untouched
const PW_CLI = path.join(REPO, 'node_modules', '@playwright', 'test', 'cli.js');
if (!fs.existsSync(PW_CLI)) { console.error(`Playwright CLI not found: ${PW_CLI}\nSet PW_REPO to the folder of ep-etm-fe-qa (now: ${REPO}) and run npm install there.`); process.exit(2); }
// Card test data (scripts/seed/cards/<KEY>.data.cjs): reset and READY before every run, card locked while it runs
const gate = await dataGate({ pwRepo: REPO, key, skip: NO_DATA_CHECK });
console.log(`[data] ${gate.message}`);
if (!gate.ok) process.exit(2);
const locked = gate.check ? takeLock(REPO, key, 'run-card') : { ok: true };
if (!locked.ok) { console.error(`[data] ${key} is locked by ${locked.lock?.owner ?? '?'} since ${locked.lock?.at ?? '?'}: wait for it to finish`); process.exit(2); }
const unlock = () => { if (gate.check) releaseLock(REPO, key); };
process.on('SIGINT', () => { unlock(); process.exit(130); });
if (gate.check) { fs.mkdirSync(resultsDir, { recursive: true }); fs.writeFileSync(path.join(resultsDir, 'data-check.json'), JSON.stringify({ key, ...gate.check, message: gate.message }, null, 1)); }
const pwArgs = [PW_CLI, 'test', ...retriesFor(rest, REPO), '--output', resultsDirName, '--reporter=list,json'];
if (!rest.some((a) => a.startsWith('--workers'))) pwArgs.push('--workers=1');
console.log(`[run-card] ${key} -> ${resultsDirName}\n[run-card] playwright test ${rest.join(' ')}`);

const child = spawn(process.execPath, pwArgs, {
  cwd: REPO,
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(resultsDirName, 'results.json') },
});
// Self-healing: sort failures by cause; after an all-green run move the stms-fe baseline of the pages it used.
function healAfterRun(dir, exitCode) {
  if (!fs.existsSync(path.join(dir, 'results.json'))) return;
  try {
    const rows = triageRun(dir);
    if (rows.length) console.log(`[triage] ${Object.entries(countByCause(rows)).map(([k, v]) => `${k} ${v}`).join(', ')}  (${path.join(dir, 'triage.md')})`);
    const results = JSON.parse(fs.readFileSync(path.join(dir, 'results.json'), 'utf8'));
    const fe = process.env.FE_REPO || envFileValue('FE_REPO') || path.resolve(REPO, '..', 'stms-fe');
    if (canAdvanceBaseline(rest, exitCode, results) && fs.existsSync(path.join(fe, '.git'))) {
      const units = pagesUsedBy(REPO, specFilesFrom(rest, REPO));
      const commit = feGit(fe, ['rev-parse', '--verify', '-q', 'origin/develop']);
      advanceBaseline(REPO, units, commit);
      if (units.length) console.log(`[heal] all passed: stms-fe baseline ${commit.slice(0, 8)} recorded for ${units.join(', ')}`);
    }
  } catch (e) { console.log(`[heal] skipped: ${e.message}`); }
}

child.on('exit', (code) => {
  unlock();
  healAfterRun(resultsDir, code);
  summarise(resultsDir);
  const out = buildReport(resultsDir);
  pushToBoard(out);
  console.log(out ? `\n[run-card] Report: ${out}\n[run-card] Pictures and results kept in: ${resultsDir}` : '\n[run-card] No report was built.');
  process.exit(code ?? 1);
});

// run-card.mjs - run Playwright for ONE ETM card and build its evidence report straight away.
// Each run gets its own result folder and its own report file, so two or more cards can run at
// the same time without wiping each other's pictures or overwriting each other's report.
//
//   node tools/run-card.mjs <KEY>-7879 <folder>/verifyNoColumn.spec -g "<KEY>-8086|<KEY>-8087"
//   node tools/run-card.mjs <KEY>-7879 <spec> -g "<filter>" --workers=2        (extra flags go to Playwright)
//   node tools/run-card.mjs <KEY>-7879 <spec> --force-rerun "<why>"            (run tests the rerun guard drops; logged)
//   node tools/run-card.mjs <KEY>-7879 --build-only output/runs/2026-11-17_111500_<KEY>-7879   (report from a saved folder)
//
// Env: PW_REPO = folder of the Playwright repo (profile repos.pwRepoDir; or PW_REPO=... in the git-ignored .env at the repo root; default: that folder next to this repo)
// Optional: <os tmp>/tc-manifest-<KEY>.json  (same shape as the skill's tc-manifest.json)
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { retriesFor, specFilesFrom, canAdvanceBaseline } from './heal/run-plan.mjs';
import { triageRun, countByCause } from './heal/triage.mjs';
import { propose as proposeHeals, summaryLine } from './heal/auto-heal.mjs';
import { pagesUsedBy, advanceBaseline } from './heal/baseline.mjs';
import { git as feGit } from './heal/fe-git.mjs';
import { resolveRepos } from './heal/config.mjs';
import { isKey, profile } from './profile.mjs';
import { dataGate, holdLock } from './data-gate.mjs';
import { hasCreate, ledgerEmpty, planFlow, runStep, lockHeld } from './card-data-flow.mjs';
import { recordRunResults, sourceOf, rowsFromResults } from './run-results.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const GEN = path.join(HERE, 'evidence-report-v4.mjs');
// PW_REPO: environment variable, else `PW_REPO=...` in the git-ignored `.env` at the repo root, else ../<repos.pwRepoDir of the profile>
const { pwRepo: REPO } = resolveRepos();
const PROFILE = profile();

const [key, ...argsIn] = process.argv.slice(2);
// --no-data-check: run without the card data gate (the user asked for it on purpose); not passed to Playwright
const NO_DATA_CHECK = argsIn.includes('--no-data-check');
// --keep-data: a `create: true` card keeps the data this run made (to look at it); the next run's sweep deletes it
const KEEP_DATA = argsIn.includes('--keep-data');
// --force-rerun "<why>": run even the tests the rerun guard drops (logged in work/<KEY>/rerun-log.jsonl)
const fi = argsIn.indexOf('--force-rerun');
const FORCE_RERUN = fi >= 0 ? (argsIn[fi + 1] || '') : null;
const rest = argsIn.filter((a, i) => a !== '--no-data-check' && a !== '--keep-data' && i !== fi && !(fi >= 0 && i === fi + 1));
if (!key || !isKey(key)) {
  console.error(`Usage: node tools/run-card.mjs ${profile().jira.projectKey}-1234 <spec> [-g "${profile().jira.projectKey}-1|${profile().jira.projectKey}-2"] [--no-data-check] [--keep-data] [playwright flags]\n   or: node tools/run-card.mjs ${profile().jira.projectKey}-1234 --build-only <result-folder>`);
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
function recordQuality(rows, resultsDir) {
  const by = (f) => rows.filter(f).length;
  const q = {
    t: new Date().toISOString(), card: key, ran: rows.length,
    passed: by((x) => x.status === 'passed'), failed: by((x) => x.status === 'failed' || x.status === 'timedOut'), flaky: by((x) => x.status === 'flaky'),
    notProven: by((x) => x.status === 'skipped' && x.why === 'not-proven'), fixme: by((x) => x.status === 'skipped' && x.why === 'fixme'),
    precondition: by((x) => x.status === 'skipped' && x.why === 'precondition'),
  };
  q.provenRate = q.ran ? Math.round((q.passed / q.ran) * 100) : 0;
  if (sourceOf(resultsDir)) q.source = sourceOf(resultsDir);
  console.log(`  proven ${q.passed}/${q.ran} (${q.provenRate}%) | not proven ${q.notProven} | fixme ${q.fixme} | precondition missing ${q.precondition}`);
  try { fs.appendFileSync(path.join(ROOT, '.claude', 'team', 'quality.jsonl'), JSON.stringify(q) + '\n'); } catch { /* optional */ }
  counts = { ...(counts || {}), proven: q.provenRate };
}
function summarise(resultsDir) {
  try {
    const r = JSON.parse(fs.readFileSync(path.join(resultsDir, 'results.json'), 'utf8'));
    const rows = rowsFromResults(r, skipKind);
    const n = (st) => rows.filter((x) => x.status === st).length;
    counts = { ran: rows.length, pass: n('passed'), fail: n('failed') + n('timedOut') + n('flaky') };
    console.log(`\n== ${key}: ran ${rows.length} | passed ${n('passed')} | failed ${n('failed') + n('timedOut')} | flaky ${n('flaky')} | skipped ${n('skipped')}`);
    rows.filter((x) => x.status === 'flaky').forEach((x) => console.log(`  FLAKY ${x.title.slice(0, 70)} (failed, then passed on retry: not a clean pass)`));
    rows.filter((x) => x.status === 'failed' || x.status === 'timedOut').forEach((x) => console.log(`  FAIL ${x.title.slice(0, 70)} :: ${x.msg}`));
    recordQuality(rows, resultsDir);
    recordRunResults({ root: ROOT, key, rows, resultsDir });
  } catch (e) { console.error(`Could not read results.json: ${e.message}`); }
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
if (!fs.existsSync(PW_CLI)) { console.error(`Playwright CLI not found: ${PW_CLI}\nSet PW_REPO to the folder of ${PROFILE.repos.pwRepoDir} (now: ${REPO}) and run npm install there.`); process.exit(2); }
// Rerun guard (tools/rerun-guard.mjs): drop tests whose result cannot change, before any data step
let testHashes = null;
{
  const rg = await import('./rerun-guard.mjs');
  const gi = rest.findIndex((a) => a === '-g' || a === '--grep');
  const specs = specFilesFrom(rest, REPO);
  const g = specs.length ? rg.plan({ key, pwRepo: REPO, specs, grep: gi >= 0 ? rest[gi + 1] : null, feChangedAt: await rg.feChangedAt() }) : null;
  if (g) testHashes = g.hashes;
  if (g && !g.mapped) console.log('[rerun-guard] the -g filter matches no test title: guard not applied');
  if (g && g.drop.length) {
    for (const x of g.drop) console.log(`[rerun-guard] DROP ${x.key}: ${x.why}`);
    if (FORCE_RERUN !== null) {
      if (FORCE_RERUN.trim().length < 5) { console.error('[rerun-guard] --force-rerun needs a reason, e.g. --force-rerun "QA data was reset by hand"'); process.exit(2); }
      rg.logForce(ROOT, key, { forced: g.drop.map((x) => x.key), why: FORCE_RERUN, args: rest.join(' ') });
      console.log(`[rerun-guard] --force-rerun: running them anyway (${FORCE_RERUN}), logged in work/${key}/rerun-log.jsonl`);
    } else if (!g.keep.length) {
      console.error(`[rerun-guard] nothing to run: every selected test would give the same result. Change the spec / data, wait for a new FE build, offer it as manual, or add --force-rerun "<why>".`);
      process.exit(3);
    } else {
      if (gi >= 0) rest[gi + 1] = g.grep; else rest.push('-g', g.grep);
      console.log(`[rerun-guard] running ${g.keep.length} of ${g.keep.length + g.drop.length}: ${g.keep.join(', ')}`);
    }
  }
}
// Cards with `create: true`: the data is made by script for this run and deleted after it (card-data-flow.mjs)
const FLOW = NO_DATA_CHECK ? ['run'] : planFlow({ hasCreate: hasCreate(REPO, key), ledgerEmpty: ledgerEmpty(REPO, key), keepData: KEEP_DATA });
let cleaned = !FLOW.includes('cleanup');
const cleanupOnce = () => {
  if (cleaned) return;
  cleaned = true;
  const c = runStep(REPO, key, 'cleanup');
  console.log(c === 0 ? `[card-data] ${key}: data of this run deleted` : `[card-data] ${key}: cleanup FAILED (exit ${c}): ids stay in output/seed/${key}.ledger.json, the next run's sweep deletes them`);
};
if (FLOW.includes('create')) {
  // another run of this card holds the lock: its data must not be swept from under it
  const held = lockHeld(REPO, key);
  if (held) { console.error(`[card-data] ${key} is locked by ${held.owner ?? '?'} since ${held.at ?? '?'}: wait for that run to finish`); process.exit(2); }
  process.on('exit', cleanupOnce);   // also when a step fails, the gate refuses or the lock is held
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => process.exit(130));   // Ctrl+C before Playwright starts: exit -> cleanupOnce
  for (const step of FLOW.filter((s) => ['sweep', 'create', 'reset'].includes(s))) {
    const c = runStep(REPO, key, step);
    if (c !== 0) {
      console.error(`[card-data] ${key}: ${step} failed (exit ${c}); tests not run`);
      if (step === 'sweep') cleaned = true;   // the sweep itself failed: do not try the same delete again on exit
      process.exit(2);
    }
  }
  if (KEEP_DATA) console.log(`[card-data] ${key}: --keep-data: the data stays after the run (output/seed/${key}.ledger.json)`);
}
// Card test data (scripts/seed/cards/<KEY>.data.cjs): reset and READY before every run, card locked while it runs
const gate = await dataGate({ pwRepo: REPO, key, skip: NO_DATA_CHECK });
console.log(`[data] ${gate.message}`);
if (!gate.ok) process.exit(2);
// the lock is freed on exit, Ctrl+C, SIGTERM, SIGHUP and when Playwright fails to start (data-gate.mjs holdLock)
const locked = gate.check ? holdLock(REPO, key) : { ok: true, release: () => {}, attach: () => {} };
if (!locked.ok) { console.error(`[data] ${key} is locked by ${locked.lock?.owner ?? '?'} since ${locked.lock?.at ?? '?'}: wait for it to finish`); process.exit(2); }
const unlock = locked.release;
if (gate.check) { fs.mkdirSync(resultsDir, { recursive: true }); fs.writeFileSync(path.join(resultsDir, 'data-check.json'), JSON.stringify({ key, ...gate.check, message: gate.message }, null, 1)); }
const pwArgs = [PW_CLI, 'test', ...retriesFor(rest, REPO), '--output', resultsDirName, '--reporter=list,json'];
if (!rest.some((a) => a.startsWith('--workers'))) pwArgs.push('--workers=1');
console.log(`[run-card] ${key} -> ${resultsDirName}\n[run-card] playwright test ${rest.join(' ')}`);

const child = spawn(process.execPath, pwArgs, {
  cwd: REPO,
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(resultsDirName, 'results.json') },
});
locked.attach(child);
// Self-healing: sort failures by cause; after an all-green run move the FE repo baseline of the pages it used.
function healAfterRun(dir, exitCode) {
  if (!fs.existsSync(path.join(dir, 'results.json'))) return;
  try {
    const rows = triageRun(dir);
    if (rows.length) console.log(`[triage] ${Object.entries(countByCause(rows)).map(([k, v]) => `${k} ${v}`).join(', ')}  (${path.join(dir, 'triage.md')})`);
    if (rows.some((r) => r.cause === 'locator')) {
      try {
        const d = proposeHeals(dir);
        console.log(`[auto-heal] ${summaryLine(d)}  (${path.join(dir, 'heal-proposals.md')})\n[auto-heal] NEXT: lead starts the heal loop now (TEAM.md Phase 7), no need to be asked`);
      } catch (e) { console.log(`[auto-heal] skipped: ${e.message}`); }
    }
    const results = JSON.parse(fs.readFileSync(path.join(dir, 'results.json'), 'utf8'));
    const { feRepo: fe, feBranch } = resolveRepos();
    if (canAdvanceBaseline(rest, exitCode, results) && fs.existsSync(path.join(fe, '.git'))) {
      const units = pagesUsedBy(REPO, specFilesFrom(rest, REPO));
      const commit = feGit(fe, ['rev-parse', '--verify', '-q', `origin/${feBranch}`]);
      advanceBaseline(REPO, units, commit);
      if (units.length) console.log(`[heal] all passed: ${PROFILE.repos.feRepoDir} baseline ${commit.slice(0, 8)} recorded for ${units.join(', ')}`);
    }
  } catch (e) { console.log(`[heal] skipped: ${e.message}`); }
}

child.on('exit', (code) => {
  // after the run: Playwright empties --output when it starts (rerun guard reads this next time)
  if (testHashes) { try { fs.mkdirSync(resultsDir, { recursive: true }); fs.writeFileSync(path.join(resultsDir, 'test-hashes.json'), JSON.stringify(testHashes, null, 1)); } catch { /* optional */ } }
  unlock();
  cleanupOnce();
  healAfterRun(resultsDir, code);
  summarise(resultsDir);
  const out = buildReport(resultsDir);
  pushToBoard(out);
  console.log(out ? `\n[run-card] Report: ${out}\n[run-card] Pictures and results kept in: ${resultsDir}` : '\n[run-card] No report was built.');
  process.exit(code ?? 1);
});

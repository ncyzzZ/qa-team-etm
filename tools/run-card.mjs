// run-card.mjs - run Playwright for ONE ETM card and build its evidence report straight away.
// Each run gets its own result folder and its own report file, so two or more cards can run at
// the same time without wiping each other's pictures or overwriting each other's report.
//
//   node tools/run-card.mjs ETM-7879 etm7879/verifyMobPlanNoColumn.spec -g "ETM-8086|ETM-8087"
//   node tools/run-card.mjs ETM-7879 <spec> -g "<filter>" --workers=2        (extra flags go to Playwright)
//   node tools/run-card.mjs ETM-7879 --build-only test-results-ETM-7879-111500   (report from a saved folder)
//
// Env: PW_REPO = folder of the Playwright repo ep-etm-fe-qa (or PW_REPO=... in the git-ignored .env at the repo root; default: the folder `ep-etm-fe-qa` next to this repo)
// Optional: <os tmp>/tc-manifest-<KEY>.json  (same shape as the skill's tc-manifest.json)
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const GEN = path.join(HERE, 'evidence-report-v4.mjs');
const REPORTS = path.join(ROOT, 'Evidence', '_reports');
// PW_REPO: environment variable, else `PW_REPO=...` in the git-ignored `.env` at the repo root, else ../ep-etm-fe-qa
function envFileValue(name) {
  try {
    const m = fs.readFileSync(path.join(ROOT, '.env'), 'utf8').match(new RegExp('^\s*' + name + '\s*=\s*(.+?)\s*$', 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}
const REPO = process.env.PW_REPO || envFileValue('PW_REPO') || path.resolve(ROOT, '..', 'ep-etm-fe-qa');

const [key, ...rest] = process.argv.slice(2);
if (!key || !/^ETM-\d+$/.test(key)) {
  console.error('Usage: node tools/run-card.mjs ETM-1234 <spec> [-g "ETM-1|ETM-2"] [playwright flags]\n   or: node tools/run-card.mjs ETM-1234 --build-only <result-folder>');
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
  const review = path.join(REPORTS, `review-${key}.json`); // optional per-step verdicts, see evidence-report-v4.mjs
  if (fs.existsSync(review)) args.push('--review', review);
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) { console.error(`Report generator failed:\n${r.stderr || r.stdout}`); return null; }
  const built = fs.readdirSync(tmpOut).find((f) => /^evidence-report-.*\.html$/.test(f));
  if (!built) { console.error('Generator produced no report file.'); return null; }
  fs.mkdirSync(REPORTS, { recursive: true });
  const finalName = `evidence-report-${key}-${stamp}.html`;
  fs.copyFileSync(path.join(tmpOut, built), path.join(REPORTS, finalName));
  fs.copyFileSync(path.join(tmpOut, built), path.join(REPORTS, `latest-${key}.html`));
  fs.copyFileSync(path.join(tmpOut, built), path.join(REPORTS, 'latest.html'));
  fs.rmSync(tmpOut, { recursive: true, force: true });
  return path.join(REPORTS, finalName);
}

let counts = null;
function summarise(resultsDir) {
  try {
    const r = JSON.parse(fs.readFileSync(path.join(resultsDir, 'results.json'), 'utf8'));
    const rows = [];
    (function walk(s) {
      (s.specs || []).forEach((sp) => sp.tests.forEach((t) => {
        const x = t.results[t.results.length - 1];
        rows.push({ title: sp.title, status: x.status, msg: ((x.error && x.error.message) || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 160) });
      }));
      (s.suites || []).forEach(walk);
    })(r);
    const n = (st) => rows.filter((x) => x.status === st).length;
    counts = { ran: rows.length, pass: n('passed'), fail: n('failed') + n('timedOut') };
    console.log(`\n== ${key}: ran ${rows.length} | passed ${n('passed')} | failed ${n('failed') + n('timedOut')} | skipped ${n('skipped')}`);
    rows.filter((x) => x.status === 'failed' || x.status === 'timedOut').forEach((x) => console.log(`  FAIL ${x.title.slice(0, 70)} :: ${x.msg}`));
  } catch (e) { console.error(`Could not read results.json: ${e.message}`); }
}

// Put the new report on the QA status board (pass or fail). Never stops the run if the board is missing.
const TEAM_MJS = path.join(ROOT, '.claude', 'team', 'team.mjs');
function pushToBoard(report) {
  if (!report || !fs.existsSync(TEAM_MJS)) return;
  const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const res = counts ? ` | ${counts.pass} pass / ${counts.fail} fail` : '';
  const r = spawnSync(process.execPath, [TEAM_MJS, 'link', `Evidence report ${key} (${hhmm})${res}`, report, '--kind', 'report', '--job', key], { cwd: path.dirname(TEAM_MJS), encoding: 'utf8' });
  console.log(r.status === 0 ? '[run-card] Report link sent to the board.' : '[run-card] Board link skipped.');
}

// ---- build-only mode
if (rest[0] === '--build-only') {
  const dir = path.resolve(REPO, rest[1] || '');
  summarise(dir);
  const out = buildReport(dir);
  console.log(out ? `Report: ${out}` : 'No report.');
  pushToBoard(out);
  process.exit(out ? 0 : 1);
}

// ---- run mode
const resultsDirName = `test-results-${key}-${stamp.split('-')[1]}`;
const resultsDir = path.join(REPO, resultsDirName);
// call Playwright's own CLI with node, no shell: a "|" in -g "A|B" must reach Playwright untouched
const PW_CLI = path.join(REPO, 'node_modules', '@playwright', 'test', 'cli.js');
if (!fs.existsSync(PW_CLI)) { console.error(`Playwright CLI not found: ${PW_CLI}\nSet PW_REPO to the folder of ep-etm-fe-qa (now: ${REPO}) and run npm install there.`); process.exit(2); }
const pwArgs = [PW_CLI, 'test', ...rest, '--output', resultsDirName, '--reporter=list,json'];
if (!rest.some((a) => a.startsWith('--workers'))) pwArgs.push('--workers=1');
console.log(`[run-card] ${key} -> ${resultsDirName}\n[run-card] playwright test ${rest.join(' ')}`);

const child = spawn(process.execPath, pwArgs, {
  cwd: REPO,
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: path.join(resultsDirName, 'results.json') },
});
child.on('exit', (code) => {
  summarise(resultsDir);
  const out = buildReport(resultsDir);
  pushToBoard(out);
  console.log(out ? `\n[run-card] Report: ${out}\n[run-card] Pictures and results kept in: ${resultsDir}` : '\n[run-card] No report was built.');
  process.exit(code ?? 1);
});

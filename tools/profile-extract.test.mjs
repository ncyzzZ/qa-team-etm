import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pe-'));
fs.mkdirSync(path.join(tmp, 'profiles', 'ab2'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'profiles', 'ab2', 'profile.json'), JSON.stringify({
  jira: { site: 'ab2.atlassian.net', projectKey: 'AB2' },
  repos: { pwRepoDir: 'pw', feRepoDir: 'fe' },
  ui: { libraryTokenRe: '^(zz|yy)-' },
}));
const noRepo = path.join(tmp, 'no-such-repo');
const env = { ...process.env, QA_PROFILE_ROOT: tmp, QA_PROFILE: 'ab2', PW_REPO: noRepo, FE_REPO: noRepo };
Object.assign(process.env, { QA_PROFILE_ROOT: tmp, QA_PROFILE: 'ab2', PW_REPO: noRepo, FE_REPO: noRepo });

// modules are imported AFTER the env is set; none may pin ETM at load time
const { parseManualSteps, xrayStepCounts } = await import('./manual/steps.mjs');
const { isLibraryToken } = await import('./heal/selectors.mjs');
const { parseAssessment } = await import('./sprint-report.mjs');
const { record } = await import('./verdicts.mjs');
const { readVerdicts } = await import('./manual/results.mjs');
const { recordRunResults } = await import('./run-results.mjs');
const { testsOf } = await import('./rerun-guard.mjs');
const { scanSpec } = await import('./live-check.mjs');

test('evidence report links use the profile site and key', () => {
  const out = path.join(tmp, 'out');
  const res = { suites: [{ title: 'a.spec.ts', specs: [{ title: 'AB2-7 TC-01 shows list', file: 'a.spec.ts', line: 1,
    tests: [{ status: 'expected', results: [{ status: 'passed', duration: 5, steps: [], attachments: [] }] }] }] }] };
  const input = path.join(tmp, 'results.json');
  fs.writeFileSync(input, JSON.stringify(res));
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'evidence-report-v4.mjs'), '--input', input, '--out', out, '--story', 'AB2-7'],
    { cwd: tmp, encoding: 'utf8', env, timeout: 60000 });
  assert.equal(r.status, 0, r.stderr);
  const html = fs.readFileSync(path.join(out, 'latest.html'), 'utf8');
  assert.match(html, /href="https:\/\/ab2\.atlassian\.net\/browse\/AB2-7"/);
  assert.doesNotMatch(html, /pttep\.atlassian/);
});

test('manual steps heading and xray counts use the profile key', () => {
  const md = '## AB2-3 - Do it (1 step)\n| # | Do | Expected | Picture |\n|---|---|---|---|\n| 1 | a | b | c |\n\n## ETM-4 - Other (1 step)\n';
  assert.deepEqual(parseManualSteps(md).map((t) => t.key), ['AB2-3']);
  assert.deepEqual(xrayStepCounts('## AB2-3 (TC-1)\n1. a -> b\n## ETM-4\n1. x -> y\n'), { 'AB2-3': 1 });
});

test('library token pattern comes from the profile', () => {
  assert.equal(isLibraryToken('zz-grid'), true);
  assert.equal(isLibraryToken('ag-grid'), false);
});

test('assessment rows, verdict pairs, verdict files', () => {
  assert.deepEqual(parseAssessment('| AB2-1 t | a | b | c | 3 | 2 |\n| ETM-2 t | a | b | c | 3 | 2 |\n').map((x) => x.key), ['AB2-1']);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pe-v-'));
  const all = record('AB2-1', ['AB2-1=app:AB2-9'], { source: 'chat', evidence: 'x' }, root);
  assert.equal(all['AB2-1'].defect, 'AB2-9');
  assert.throws(() => record('AB2-1', ['ETM-1=app'], { source: 'chat', evidence: 'x' }, root), /bad answer/);
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'pe-r-'));
  fs.writeFileSync(path.join(run, 'verdict-AB2-1.json'), '{"key":"AB2-1"}');
  fs.writeFileSync(path.join(run, 'verdict-ETM-1.json'), '{"key":"ETM-1"}');
  assert.deepEqual(readVerdicts(run).map((v) => v.key), ['AB2-1']);
});

test('title keys: run results, rerun guard, live check', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pe-rr-'));
  recordRunResults({ root, key: 'AB2-1', rows: [{ title: 'AB2-2 TC-1 x ETM-3', status: 'passed' }], resultsDir: path.join(root, 'run'), log: () => {} });
  const j = JSON.parse(fs.readFileSync(path.join(root, 'work', 'AB2-1', 'run-results.json'), 'utf8'));
  assert.deepEqual(Object.keys(j.tests), ['AB2-2']);
  const spec = "test('AB2-5 TC-1 a', async () => {});\ntest('ETM-6 TC-1 b', async () => {});";
  assert.deepEqual(testsOf(spec).map((t) => t.key), ['AB2-5']);
  assert.deepEqual(scanSpec(spec).map((t) => t.key), ['AB2-5', '']);
});

test('regress/core cardKeys follows the profile key', async () => {
  const { cardKeys } = await import('./regress/core.mjs');
  assert.deepEqual(cardKeys('feature/AB2-8666,8664-fix'), ['AB2-8666', 'AB2-8664']);
  assert.deepEqual(cardKeys('feature/ETM-8666'), []);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { retriesFor, specFilesFrom, allPassed } from './run-plan.mjs';

test('the evidence report shows the triage cause next to a failed test', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const { triageRun } = await import('./triage.mjs');
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-rep-'));
  fs.copyFileSync(path.join(ROOT, 'evals', 'heal', 'results-mixed.json'), path.join(run, 'results.json'));
  triageRun(run);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-out-'));
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'evidence-report-v4.mjs'), '--input', path.join(run, 'results.json'), '--out', out, '--title', 't', '--triage', path.join(run, 'triage.json')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const html = fs.readFileSync(path.join(out, fs.readdirSync(out).find((f) => f.endsWith('.html'))), 'utf8');
  assert.match(html, /class="cause cause-locator"/);
  assert.match(html, /class="cause cause-assertion"/);
  const flaky = html.slice(html.indexOf('id="t-ETM-5"'), html.indexOf('</details>', html.indexOf('id="t-ETM-5"')));
  assert.match(flaky, /รอ 30 วินาที/, 'a flaky test shows the error of its failed attempt');
});

test('one retry by default for a list of existing spec files', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-'));
  fs.mkdirSync(path.join(pw, 'tests', 'fe'), { recursive: true });
  fs.writeFileSync(path.join(pw, 'tests', 'fe', 'a.spec.ts'), "test('a', () => {});");
  assert.deepEqual(retriesFor(['a.spec'], pw), ['a.spec', '--retries=1']);
});
test('a retries flag from the user is kept as is', () => assert.deepEqual(retriesFor(['a.spec', '--retries=0']), ['a.spec', '--retries=0']));
test('@dailyreport runs get no retry (shared data)', () => {
  assert.deepEqual(retriesFor(['-g', '@dailyreport']), ['-g', '@dailyreport', '--retries=0']);
  assert.deepEqual(retriesFor(['--grep=@dailyreport|x']), ['--grep=@dailyreport|x', '--retries=0']);
});
test('@dailyreport specs found by file content get no retry either', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-'));
  fs.mkdirSync(path.join(pw, 'tests', 'fe', 'dr'), { recursive: true });
  fs.writeFileSync(path.join(pw, 'tests', 'fe', 'dr', 'x.spec.ts'), "test('a @dailyreport', () => {});");
  assert.deepEqual(retriesFor(['dr/x.spec'], pw), ['dr/x.spec', '--retries=0']);
});

test('specFilesFrom resolves run-card spec arguments under tests/fe and skips flags and their values', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-'));
  fs.mkdirSync(path.join(pw, 'tests', 'fe', 'etm1'), { recursive: true });
  fs.writeFileSync(path.join(pw, 'tests', 'fe', 'etm1', 'a.spec.ts'), '');
  assert.deepEqual(specFilesFrom(['etm1/a.spec', '-g', 'ETM-1|ETM-2', '--workers=2'], pw), [path.join('tests', 'fe', 'etm1', 'a.spec.ts')]);
});

test('allPassed is true only when every test ended passed with nothing failed, flaky or skipped-for-failure', () => {
  const r = (results) => ({ suites: [{ specs: [{ title: 't', tests: [{ results }] }] }] });
  assert.equal(allPassed(r([{ status: 'passed' }])), true);
  assert.equal(allPassed(r([{ status: 'failed' }, { status: 'passed' }])), false, 'flaky is not a clean pass');
  assert.equal(allPassed(r([{ status: 'failed' }])), false);
  assert.equal(allPassed({ suites: [] }), false, 'an empty run proves nothing');
  const mixed = { suites: [{ specs: [{ tests: [{ results: [{ status: 'passed' }] }] }, { tests: [{ results: [{ status: 'skipped' }] }] }] }] };
  assert.equal(allPassed(mixed), true, 'a skipped test (test.skip) does not block the baseline');
  assert.equal(allPassed(r([{ status: 'skipped' }])), false, 'only skipped proves nothing');
});

test('canAdvanceBaseline refuses filtered or partial runs', async () => {
  const { canAdvanceBaseline } = await import('./run-plan.mjs');
  const green = { suites: [{ specs: [{ tests: [{ results: [{ status: 'passed' }] }] }] }] };
  assert.equal(canAdvanceBaseline(['a.spec'], 0, green), true);
  for (const f of [['-g', 'TC3'], ['--grep=TC3'], ['--grep-invert', 'x'], ['--last-failed'], ['--only-changed'], ['--shard=1/2'], ['--max-failures=1']]) {
    assert.equal(canAdvanceBaseline(['a.spec', ...f], 0, green), false, f.join(' '));
  }
  assert.equal(canAdvanceBaseline(['a.spec'], 1, green), false, 'non-zero exit');
});

test('runs that are not a plain list of spec files get no retry (could include @dailyreport)', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-'));
  fs.mkdirSync(path.join(pw, 'tests', 'fe', 'e2e', 'dailyReport'), { recursive: true });
  fs.writeFileSync(path.join(pw, 'tests', 'fe', 'e2e', 'dailyReport', 'x.spec.ts'), "test('a', () => {});");
  assert.deepEqual(retriesFor(['e2e/dailyReport'], pw), ['e2e/dailyReport', '--retries=0'], 'a directory');
  assert.deepEqual(retriesFor([], pw), ['--retries=0'], 'no spec argument');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { appendHeal, summarize } from './heal-log.mjs';

// a run folder: passed = titles that passed, fails = [{ title, cause, locator }] for triage.json
function addRun(pw, name, { passed = [], fails = [] } = {}) {
  const run = path.join(pw, 'output', 'runs', name);
  fs.mkdirSync(run, { recursive: true });
  const spec = (title, status) => ({ title, file: 'a.spec.ts', tests: [{ results: [{ status }] }] });
  const results = { suites: [{ specs: [...passed.map((t) => spec(t, 'passed')), ...fails.map((f) => spec(f.title, 'failed'))] }] };
  fs.writeFileSync(path.join(run, 'results.json'), JSON.stringify(results));
  fs.writeFileSync(path.join(run, 'triage.json'), JSON.stringify(fails.map((f) => ({ key: f.title, title: f.title, file: 'a.spec.ts', cause: f.cause || 'locator', locator: f.locator || '.x' }))));
}
// n tests that passed on 2026-11-19 and broke on their locator on 2026-11-20, plus one assertion failure
function repoWith(locatorFailures) {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  const titles = Array.from({ length: locatorFailures }, (_, i) => `ETM-${i} t`);
  addRun(pw, '2026-11-19_101010_ETM-1', { passed: [...titles, 'ETM-99 t'] });
  addRun(pw, '2026-11-20_101010_ETM-1', { fails: [...titles.map((title) => ({ title })), { title: 'ETM-99 t', cause: 'assertion' }] });
  return pw;
}
const e = (o) => ({ date: '2026-11-20', card: 'ETM-1', test: 'ETM-2', page: 'pages/a.ts:1', old: '.a', new: '.b', source: 'fe', approved: true, rerunPassed: true, ...o });

test('healed counts only approved heals whose re-run passed', () => {
  const pw = repoWith(3);
  appendHeal(pw, e({}));
  appendHeal(pw, e({ source: 'live', rerunPassed: false }));
  appendHeal(pw, e({ approved: false }));
  const s = summarize(pw, {});
  assert.equal(s.locatorFailures, 3);
  assert.equal(s.healed, 1);
  assert.deepEqual(s.bySource, { fe: 1, live: 0 });
  assert.equal(s.rate, 1 / 3);
});

test('no log and no failures gives rate null', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  assert.deepEqual(summarize(pw, {}), { locatorFailures: 0, newScriptFailures: 0, healed: 0, bySource: { fe: 0, live: 0 }, rate: null });
});

test('date range filters both heals and run folders', () => {
  const pw = repoWith(2);
  appendHeal(pw, e({ date: '2026-10-01' }));
  const s = summarize(pw, { from: '2026-11-01', to: '2026-11-30' });
  assert.equal(s.healed, 0);
  assert.equal(s.locatorFailures, 2);
  assert.equal(summarize(pw, { from: '2026-12-01' }).locatorFailures, 0);
});

test('string booleans and a bad date are refused', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  assert.throws(() => appendHeal(pw, e({ approved: 'false' })), /boolean/);
  assert.throws(() => appendHeal(pw, e({ rerunPassed: 'no' })), /boolean/);
  assert.throws(() => appendHeal(pw, e({ date: '20/11/2026' })), /date/);
});

test('a corrupt log line is skipped, not the whole log', () => {
  const pw = repoWith(2);
  appendHeal(pw, e({}));
  fs.appendFileSync(path.join(pw, 'output', 'heal', 'heal-log.jsonl'), '{not json\n');
  appendHeal(pw, e({ test: 'ETM-3' }));
  assert.equal(summarize(pw, {}).healed, 2);
});

test('the same heal logged twice counts once', () => {
  const pw = repoWith(1);
  appendHeal(pw, e({}));
  appendHeal(pw, e({}));
  assert.equal(summarize(pw, {}).healed, 1);
});

test('a triage.json that is not an array does not crash the count', () => {
  const pw = repoWith(0);
  const run = path.join(pw, 'output', 'runs', '2026-11-21_101010_ETM-2');
  fs.mkdirSync(run, { recursive: true });
  fs.writeFileSync(path.join(run, 'triage.json'), '{"x":1}');
  assert.equal(summarize(pw, {}).locatorFailures, 0);
});

test('an entry missing a field is refused', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  assert.throws(() => appendHeal(pw, { card: 'ETM-1' }), /missing/);
});

test('a locator failure of a test that never passed is a new script, not a heal case', () => {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  addRun(pw, '2026-11-20_090000_ETM-1', { fails: [{ title: 'ETM-1 t', locator: '.a' }] });
  addRun(pw, '2026-11-20_091000_ETM-1', { fails: [{ title: 'ETM-1 t', locator: '.b' }] });
  const s = summarize(pw, {});
  assert.equal(s.locatorFailures, 0);
  assert.equal(s.newScriptFailures, 2, 'two different locators while writing the script');
  assert.equal(s.rate, null);
});

test('the same break failing again on the same locator counts once', () => {
  const pw = repoWith(1);
  addRun(pw, '2026-11-20_111111_ETM-1', { fails: [{ title: 'ETM-0 t' }] });
  addRun(pw, '2026-11-20_121212_ETM-1', { fails: [{ title: 'ETM-0 t' }] });
  assert.equal(summarize(pw, {}).locatorFailures, 1);
});

test('a new locator in the same break counts, and a break after the test passed again counts again', () => {
  const pw = repoWith(1);
  addRun(pw, '2026-11-20_111111_ETM-1', { fails: [{ title: 'ETM-0 t', locator: '.next' }] });
  addRun(pw, '2026-11-20_121212_ETM-1', { passed: ['ETM-0 t'] });
  addRun(pw, '2026-11-21_101010_ETM-1', { fails: [{ title: 'ETM-0 t' }] });
  assert.equal(summarize(pw, {}).locatorFailures, 3);
});

test('a pass before the date range still makes a later break count', () => {
  const pw = repoWith(2);
  assert.equal(summarize(pw, { from: '2026-11-20' }).locatorFailures, 2);
});

test('rate never goes above 100%', () => {
  const pw = repoWith(1);
  appendHeal(pw, e({}));
  appendHeal(pw, e({ test: 'ETM-3' }));
  assert.equal(summarize(pw, {}).rate, 1);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { appendHeal, summarize } from './heal-log.mjs';

function repoWith(locatorFailures) {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'heallog-'));
  const run = path.join(pw, 'output', 'runs', '2026-11-20_101010_ETM-1');
  fs.mkdirSync(run, { recursive: true });
  const rows = Array.from({ length: locatorFailures }, (_, i) => ({ key: `ETM-${i}`, cause: 'locator' }));
  fs.writeFileSync(path.join(run, 'triage.json'), JSON.stringify([...rows, { key: 'ETM-99', cause: 'assertion' }]));
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
  assert.deepEqual(summarize(pw, {}), { locatorFailures: 0, healed: 0, bySource: { fe: 0, live: 0 }, rate: null });
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

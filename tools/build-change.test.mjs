import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lastPassBefore, annotate, buildSuggest, sinceCell, readyHealsOf } from './build-change.mjs';

const res = (start, tests) => ({ stats: { startTime: start, duration: 60000 }, suites: [{ specs: tests.map(([title, status, msg]) => ({ title, tests: [{ results: [{ status, ...(msg ? { error: { message: msg } } : {}) }] }] })) }] });
function runs() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'runs-'));
  const put = (name, json) => { fs.mkdirSync(path.join(d, name)); fs.writeFileSync(path.join(d, name, 'results.json'), JSON.stringify(json)); };
  put('2026-11-24_100000_ETM-1', res('2026-11-24T03:00:00Z', [['ETM-11 a', 'passed'], ['ETM-12 b', 'failed', 'Error: expect paste']]));
  put('2026-11-25_100000_ETM-1', res('2026-11-25T03:00:00Z', [['ETM-11 a', 'failed', 'Timeout menu'], ['ETM-12 b', 'failed', 'Timeout menu']]));
  put('2026-11-25_120000_ETM-2', res('2026-11-25T05:00:00Z', [['ETM-11 a', 'passed']])); // other card: ignored
  return d;
}

test('lastPassBefore: newest earlier pass, or a different failure when the current error is given', () => {
  const d = runs();
  const a = lastPassBefore(d, 'ETM-1', 'ETM-11', '2026-11-25_190000_ETM-1', 'Timeout menu');
  assert.equal(a.run, '2026-11-24_100000_ETM-1'); assert.equal(a.how, 'passed');
  assert.equal(a.end, '2026-11-24T03:01:00.000Z');
  const b = lastPassBefore(d, 'ETM-1', 'ETM-12', '2026-11-25_190000_ETM-1', 'Timeout menu');
  assert.equal(b.how, 'failed differently'); assert.equal(b.run, '2026-11-24_100000_ETM-1');
  assert.equal(lastPassBefore(d, 'ETM-1', 'ETM-12', '2026-11-25_190000_ETM-1'), null); // no error given: only passes count
  assert.equal(lastPassBefore(d, 'ETM-1', 'ETM-99', '2026-11-25_190000_ETM-1', 'x'), null);
});

const M = (c, branch, keys = []) => ({ commit: c.padEnd(40, '0'), branch, keys });
const rows = [
  { key: 'ETM-11', cause: 'locator', locator: '.b-menu', firstLine: 'Timeout', file: 'a.spec.ts' },
  { key: 'ETM-12', cause: 'locator', locator: '.b-menu', firstLine: 'Timeout', file: 'a.spec.ts' },
  { key: 'ETM-13', cause: 'assertion', firstLine: 'expect x', file: 'b.spec.ts' },
];

test('annotate caches stms-fe per window and survives a git error', () => {
  let calls = 0;
  const lp = () => ({ run: 'R1', end: '2026-11-24T03:01:00Z', how: 'passed' });
  const out = annotate(rows, { lastPass: lp, failStart: '2026-11-25T03:00:00Z', feMerges: () => { calls++; return [M('aa', 'fix/x')]; } });
  assert.equal(calls, 1);
  assert.match(out[0].since.note, /passed in R1; 1 stms-fe merge/);
  const bad = annotate(rows.slice(0, 1), { lastPass: lp, failStart: 'x', feMerges: () => { throw new Error('no repo'); } });
  assert.match(bad[0].since.note, /stms-fe not read \(no repo\)/);
  const none = annotate(rows.slice(0, 1), { lastPass: () => null, failStart: 'x', feMerges: () => [] });
  assert.match(none[0].since.note, /same way in every earlier run/);
});

test('buildSuggest: a group of 2+ or a merge naming the card turns into app?', () => {
  const lp = () => ({ run: '2026-11-24_100000_ETM-1', end: 'e', how: 'passed' });
  const ann = annotate(rows, { lastPass: lp, failStart: 's', feMerges: () => [M('aa', 'fix/other', ['ETM-7']), M('bb', 'feature/ETM-1', ['ETM-1'])] });
  const out = buildSuggest(ann.map((r) => ({ ...r, suggest: 'script', why: 'heal first' })), { card: 'ETM-1' });
  assert.equal(out[0].suggest, 'app?'); assert.match(out[0].why, /2 tests broke the same way \(ETM-11, ETM-12\)/);
  assert.match(out[0].why, /bb000000 feature\/ETM-1 \(names ETM-1\)/);
  assert.equal(out[2].suggest, 'app?'); // alone, but a merge names the card
  assert.match(sinceCell(out[0]), /: bb000000 feature\/ETM-1, aa000000/); // the named merge first
});

test('buildSuggest leaves it alone: no merges, ready heal, env, or our own spec edit with no named merge', () => {
  const lp = () => ({ run: 'R', end: 'e', how: 'failed differently' });
  const base = (merges, extra = {}) => annotate(rows, { lastPass: lp, failStart: 's', feMerges: () => merges, ...extra }).map((r) => ({ ...r, suggest: 'script', why: 'w' }));
  assert.ok(buildSuggest(base([]), { card: 'ETM-1' }).every((r) => r.suggest === 'script'));
  assert.equal(buildSuggest(base([M('bb', 'feature/ETM-1', ['ETM-1'])]).map((r) => ({ ...r, suggest: 'app' })), { card: 'ETM-1' })[0].why, 'w'); // finding wins
  const other = [M('aa', 'fix/other', ['ETM-7'])];
  assert.deepEqual(buildSuggest(base(other), { card: 'ETM-1', readyHeals: new Set(['ETM-11']) }).map((r) => r.suggest), ['script', 'app?', 'script']);
  assert.ok(buildSuggest(base(other, { scriptChanged: () => true }), { card: 'ETM-1' }).every((r) => r.suggest === 'script'));
  assert.ok(buildSuggest(base(other).map((r) => ({ ...r, cause: 'env' })), { card: 'ETM-1' }).every((r) => r.suggest === 'script'));
});

test('readyHealsOf reads ready rows only', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'run-'));
  fs.writeFileSync(path.join(d, 'heal-proposals.json'), JSON.stringify({ proposals: [{ test: 'ETM-1', status: 'ready' }, { test: 'ETM-2', status: 'needs-live' }] }));
  assert.deepEqual([...readyHealsOf(d)], ['ETM-1']);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { latestResults, checkPush, blockMessage } from './push-guard.mjs';

function root(cards) {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'pguard-'));
  for (const [card, tests] of Object.entries(cards)) {
    fs.mkdirSync(path.join(r, 'work', card), { recursive: true });
    fs.writeFileSync(path.join(r, 'work', card, 'run-results.json'), JSON.stringify({ card, tests }));
  }
  return r;
}

test('skipped, failed and awaiting results block PASSED; passed and flaky do not', () => {
  const res = latestResults(root({ 'ETM-1': {
    'ETM-10': { status: 'skipped', why: 'Not proven', t: '2026-11-20T01:00:00Z', run: 'r1' },
    'ETM-11': { status: 'failed', t: '2026-11-20T01:00:00Z' },
    'ETM-12': { status: 'passed', t: '2026-11-20T01:00:00Z' },
    'ETM-13': { status: 'flaky', t: '2026-11-20T01:00:00Z' },
    'ETM-14': { status: 'skipped', why: 'awaiting-confirmation', t: '2026-11-20T01:00:00Z' },
  } }));
  const { blocked, noResult } = checkPush(['10', '11', '12', '13', '14', '15'].map((n) => ({ testKey: `ETM-${n}`, status: 'PASSED' })), res);
  assert.deepEqual(blocked.map((b) => b.testKey), ['ETM-10', 'ETM-11', 'ETM-14']);
  assert.equal(blocked[0].result, 'skipped (Not proven)');
  assert.deepEqual(noResult, ['ETM-15']);
  assert.match(blockMessage(blocked), /ETM-10: skipped \(Not proven\) in run r1 \[ETM-1\]/);
});

test('FAILED and TODO are never blocked, status case does not matter', () => {
  const res = { 'ETM-10': { status: 'skipped' } };
  assert.equal(checkPush([{ testKey: 'ETM-10', status: 'FAILED' }, { testKey: 'ETM-10', status: 'TODO' }], res).blocked.length, 0);
  assert.equal(checkPush([{ testKey: 'ETM-10', status: 'passed' }], res).blocked.length, 1);
});

test('newest result over all cards wins', () => {
  const res = latestResults(root({
    'ETM-1': { 'ETM-10': { status: 'skipped', t: '2026-11-19T00:00:00Z' } },
    'ETM-2': { 'ETM-10': { status: 'passed', t: '2026-11-20T00:00:00Z' } },
  }));
  assert.equal(res['ETM-10'].status, 'passed');
  assert.equal(checkPush([{ testKey: 'ETM-10', status: 'PASSED' }], res).blocked.length, 0);
});

test('no work folder means no results', () => {
  assert.deepEqual(latestResults(path.join(os.tmpdir(), 'no-such-root-xyz')), {});
});

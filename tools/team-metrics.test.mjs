import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asks, summary } from './team-metrics.mjs';

const M = 60000;
const ev = [
  { t: 0, job: 'ETM-1', type: 'ask', kind: 'approve' },
  { t: 10 * M, job: 'ETM-1', type: 'answer', askAt: 0 },
  { t: 20 * M, job: 'ETM-2', type: 'ask', kind: 'info' },
  { t: 25 * M, job: 'ETM-1', type: 'link', kind: 'report' },
  { t: 50 * M, job: 'ETM-2', type: 'chat', text: 'yes' },
  { t: 60 * M, job: 'ETM-1', type: 'ask', kind: 'approve' },
  { t: 61 * M, job: 'ETM-1', type: 'clear' },
  { t: 70 * M, job: 'ETM-2', type: 'ask', kind: 'approve' },
  { t: 80 * M, job: 'ETM-2', type: 'ask', kind: 'approve' },
  { t: 90 * M, job: 'ETM-2', type: 'link', kind: 'report' },
  { t: 95 * M, job: 'ETM-2', type: 'link', kind: 'report' },
];

test('asks: board, chat, cleared, replaced and open endings with waits', () => {
  const a = asks(ev);
  assert.deepEqual(a.map(x => x.how), ['board', 'chat', 'cleared', 'replaced', 'open']);
  assert.deepEqual(a.map(x => x.waitMin), [10, 30, null, null, null]);
});

test('an answer of another card does not end the ask', () => {
  const a = asks([{ t: 0, job: 'A', type: 'ask' }, { t: M, job: 'B', type: 'chat' }]);
  assert.equal(a[0].how, 'open');
});

test('summary splits by time window', () => {
  const before = summary(ev, 0, 60 * M), after = summary(ev, 60 * M, 100 * M);
  assert.equal(before.asks, 2); assert.equal(after.asks, 3);
  assert.equal(before.waitMedianMin, 20);
  assert.equal(before.runs, 1); assert.equal(after.runs, 2); assert.equal(after.runsPerCard, 2);
  assert.equal(after.approveAsks, 3);
});

import { topic } from './team-metrics.mjs';
test('topic: a question is sorted by its first matching topic', () => {
  assert.equal(topic('ETM-8391: รัน 8649 กับ 8651 ใหม่ได้ไหม'), 'run');
  assert.equal(topic('ลบ work W20 แล้วรัน 8649 ใหม่ ได้ไหม'), 'delete');
  assert.equal(topic('push 5 Tests PASSED to Xray?'), 'push');
  assert.equal(topic('log defect สีใน build ไม่ตรง Figma?'), 'defect');
  assert.equal(topic('แก้ script 8866 แล้วรัน 8866 ซ้ำ?'), 'heal');
  assert.equal(topic('แถวใหม่ไม่แดง ตัดสินเป็นอะไร?'), 'decide');
});

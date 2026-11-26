import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { add, plan, approve, isApproved, done } from './delete-plan.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'dp-'));
const K = 'ETM-8049';

test('ETM-8049 case: 4 leftovers queued one by one become ONE question that names count and undo', () => {
  const r = tmp();
  add(r, K, { what: 'leftover work WK-19x6-285311', where: 'QA Plan ETM-8049 Scratch' });
  add(r, K, { what: 'leftover works WK-19a/19b-068743', where: 'QA Plan ETM-8049 Scratch', ids: ['WK-19a-068743', 'WK-19b-068743'] });
  add(r, K, { what: 'stray Test Execution', where: 'Jira ETM', ids: ['ETM-10101'], permanent: true });
  assert.equal(add(r, K, { what: 'leftover work WK-19x6-285311', where: 'QA Plan ETM-8049 Scratch' }).dup, true);
  const p = plan(r, K);
  assert.equal(p.items.length, 3);
  assert.match(p.line, /ลบ 4 รายการ, ถาวร 1 \(กู้คืนไม่ได้\), soft 3/);
  assert.equal(p.urgent, false); assert.match(p.ask, /ask --later --job ETM-8049/);
  assert.ok(fs.existsSync(path.join(r, 'work', K, 'delete-plan.md')));
});

test('an item that blocks work makes the question urgent; shared data is named', () => {
  const r = tmp();
  add(r, K, { what: 'old Daily Report of Plan Ext', where: 'QA S26 Ramp', shared: true, blocks: true });
  const p = plan(r, K);
  assert.equal(p.urgent, true); assert.match(p.ask, /ask --approve/); assert.match(p.line, /ข้อมูลที่คนอื่นใช้ 1/);
});

test('approve: all, or only some (rest declined); refused when the queue changed after the plan', () => {
  const r = tmp();
  add(r, K, { what: 'leftover work A1', where: 'Scratch' });
  add(r, K, { what: 'leftover work B2', where: 'Scratch' });
  plan(r, K);
  add(r, K, { what: 'leftover work C3', where: 'Scratch' });
  assert.throws(() => approve(r, K, { answer: 'ลบทั้งหมด' }), /queue changed after the plan/);
  plan(r, K);
  const a = approve(r, K, { answer: 'ลบเฉพาะ D-1,D-3', only: ['D-1', 'D-3'] });
  assert.deepEqual(a.approved.map((x) => x.id), ['D-1', 'D-3']);
  assert.deepEqual(a.declined.map((x) => x.id), ['D-2']);
  assert.equal(isApproved(r, K, 'D-2'), false);
  assert.throws(() => done(r, K, 'D-2'), /not approved/);
  assert.equal(done(r, K, 'D-1').status, 'deleted');
  assert.throws(() => approve(r, K, { answer: 'x' }), /no delete plan/);   // a plan is used once
  assert.equal(plan(r, K), null);                                         // nothing queued any more
});

test('CLI: add, plan, approve --no-state, ok', () => {
  const r = tmp();
  const cli = fileURLToPath(new URL('./delete-plan.mjs', import.meta.url));
  const run = (...a) => execFileSync(process.execPath, [cli, ...a], { env: { ...process.env, DELETE_PLAN_ROOT: r }, encoding: 'utf8' });
  assert.match(run('add', K, 'leftover work WK-1', '--where', 'Scratch', '--ids', 'WK-1'), /queued D-1/);
  assert.match(run('plan', K), /QUESTION: ETM-8049 ลบ 1 รายการ/);
  assert.match(run('approve', K, '--answer', 'ลบทั้งหมด', '--source', 'chat', '--evidence', 'chat: ลบทั้งหมด', '--no-state'), /APPROVED D-1/);
  assert.match(run('ok', K, 'D-1'), /OK D-1/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planFlow, hasCreate, stepCommand, ledgerEmpty } from './card-data-flow.mjs';

const repo = (dataText, ledger) => {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-'));
  fs.mkdirSync(path.join(r, 'scripts', 'seed', 'cards'), { recursive: true });
  if (dataText !== null) fs.writeFileSync(path.join(r, 'scripts', 'seed', 'cards', 'ETM-1.data.cjs'), dataText);
  if (ledger) { fs.mkdirSync(path.join(r, 'output', 'seed'), { recursive: true }); fs.writeFileSync(path.join(r, 'output', 'seed', 'ETM-1.ledger.json'), JSON.stringify(ledger)); }
  return r;
};

test('planFlow: create cards sweep (only with leftovers), create, reset, run, cleanup', () => {
  assert.deepEqual(planFlow({ hasCreate: true, ledgerEmpty: false }), ['sweep', 'create', 'reset', 'run', 'cleanup']);
  assert.deepEqual(planFlow({ hasCreate: true, ledgerEmpty: true }), ['create', 'reset', 'run', 'cleanup']);
  assert.deepEqual(planFlow({ hasCreate: true, ledgerEmpty: true, keepData: true }), ['create', 'reset', 'run']);
  assert.deepEqual(planFlow({ hasCreate: false, ledgerEmpty: true }), ['run']);
});

test('hasCreate reads "create: true" from the data file; no file or no flag -> false', () => {
  assert.equal(hasCreate(repo("module.exports = {\n  key: 'ETM-1',\n  create: true,\n};"), 'ETM-1'), true);
  assert.equal(hasCreate(repo("module.exports = { key: 'ETM-1', plans: {} };"), 'ETM-1'), false);
  assert.equal(hasCreate(repo("// create: true is the new way\nmodule.exports = { key: 'ETM-1' };"), 'ETM-1'), false);
  assert.equal(hasCreate(repo(null), 'ETM-1'), false);
});

test('ledgerEmpty: no file, or only an event the run used -> true; a plan or a made event -> false', () => {
  assert.equal(ledgerEmpty(repo(null), 'ETM-1'), true);
  assert.equal(ledgerEmpty(repo(null, { event: { id: 'E', made: false }, plans: {} }), 'ETM-1'), true);
  assert.equal(ledgerEmpty(repo(null, { event: { id: 'E', made: false }, plans: { a: { id: 'P' } } }), 'ETM-1'), false);
  assert.equal(ledgerEmpty(repo(null, { event: { id: 'E', made: true }, plans: {} }), 'ETM-1'), false);
});

test('stepCommand: setup specs through the Playwright CLI with CARD, reset through card-data.cjs --apply', () => {
  const c = stepCommand('/pw', 'ETM-1', 'create');
  assert.deepEqual(c.args.slice(1), ['test', 'tests/fe/setup/cardCreate.spec.ts', '--workers=1', '--reporter=line', '--retries=0']);
  assert.equal(c.env.CARD, 'ETM-1');
  assert.equal(stepCommand('/pw', 'ETM-1', 'sweep').args[2], 'tests/fe/setup/cardCleanup.spec.ts');
  assert.equal(stepCommand('/pw', 'ETM-1', 'cleanup').args[2], 'tests/fe/setup/cardCleanup.spec.ts');
  assert.deepEqual(stepCommand('/pw', 'ETM-1', 'reset').args, [path.join('scripts', 'seed', 'card-data.cjs'), 'ETM-1', 'reset', '--apply']);
  assert.throws(() => stepCommand('/pw', 'ETM-1', 'run'), /not a data step/);
});

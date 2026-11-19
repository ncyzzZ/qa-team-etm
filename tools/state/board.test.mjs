import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { emptyState, save, statePath, phaseOf } from './core.mjs';

const K = 'ETM-1';
const root = () => fs.mkdtempSync(path.join(os.tmpdir(), 'stateboard-'));

test('phaseOf reads phase and next', () => {
  const r = root(); const s = emptyState(K); s.phase = 'scripts'; s.next = 'user runs the specs';
  save(K, s, 'x', r);
  assert.deepEqual(phaseOf(K, r), { phase: 'scripts', next: 'user runs the specs' });
});
test('phaseOf gives nulls for a missing file', () => assert.deepEqual(phaseOf(K, root()), { phase: null, next: null }));
test('phaseOf gives nulls for broken JSON and never throws', () => {
  const r = root(); fs.mkdirSync(path.dirname(statePath(K, r)), { recursive: true }); fs.writeFileSync(statePath(K, r), '{oops');
  assert.deepEqual(phaseOf(K, r), { phase: null, next: null });
});

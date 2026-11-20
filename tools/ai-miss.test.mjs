import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { add, show, list, stats, retire, load } from './ai-miss.mjs';

const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'aimiss-')), 'm.jsonl');
const base = { agent: 'designer', kind: 'invented', wrong: 'made up a Cancel button', right: 'screen has only Close', rule: 'use only buttons in inspector.md' };

test('add numbers entries and show filters by agent plus all', () => {
  const f = tmp();
  assert.equal(add({ ...base, card: 'ETM-1' }, f).id, 'M-1');
  add({ ...base, agent: 'all', rule: 'never mark skipped as PASSED' }, f);
  add({ ...base, agent: 'automator', rule: 'no nth() locators' }, f);
  const s = show('designer', f);
  assert.match(s, /M-1 \[ETM-1\] use only buttons/);
  assert.match(s, /M-2 never mark skipped/);
  assert.doesNotMatch(s, /nth\(\)/);
});

test('add rejects missing fields, unknown agent and kind', () => {
  const f = tmp();
  assert.throws(() => add({ agent: 'designer' }, f), /missing --kind, --wrong, --right, --rule/);
  assert.throws(() => add({ ...base, agent: 'bob' }, f), /--agent must be/);
  assert.throws(() => add({ ...base, kind: 'oops' }, f), /--kind must be/);
  assert.throws(() => add({ ...base, card: '1234' }, f), /--card/);
});

test('retire hides a rule from show and list, keeps it in list --all', () => {
  const f = tmp();
  add(base, f);
  add({ ...base, rule: 'second rule' }, f);
  retire('M-1', 'Figma changed', f);
  assert.doesNotMatch(show('designer', f), /M-1/);
  assert.doesNotMatch(list(false, f), /M-1/);
  assert.match(list(true, f), /retired: Figma changed/);
  assert.equal(add(base, f).id, 'M-3');
  assert.throws(() => retire('M-9', 'x', f), /not found/);
  assert.throws(() => retire('M-2', '', f), /reason/);
});

test('stats counts active misses and empty file is fine', () => {
  const f = tmp();
  assert.equal(load(f).length, 0);
  assert.match(show('designer', f), /No AI-miss rules/);
  add(base, f);
  add({ ...base, kind: 'verdict' }, f);
  assert.match(stats(f), /Active misses: 2\nBy agent: designer 2/);
});

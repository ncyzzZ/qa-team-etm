import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { emptyState, validate, save, load, statePath, resolveFile, PHASES, APPROVAL_KINDS } from './core.mjs';

const K = 'ETM-1';
const tmpRoot = () => { const r = fs.mkdtempSync(path.join(os.tmpdir(), 'state-')); fs.mkdirSync(path.join(r, '.claude', 'team', 'work', K), { recursive: true }); return r; };

test('the enums hold the agreed values', () => {
  assert.ok(PHASES.includes('heal') && PHASES.includes('done') && PHASES.length === 14);
  assert.deepEqual(APPROVAL_KINDS, ['run-tests', 'xray-push', 'defect', 'jira-write', 'delete', 'heal-apply', 'data-reset']);
});

test('save then load round-trips with a checksum', () => {
  const root = tmpRoot();
  const s = emptyState(K); s.phase = 'design';
  save(K, s, 'phase start -> design', root);
  const r = load(K, root);
  assert.deepEqual(r.errors, []);
  assert.equal(r.state.phase, 'design');
  assert.match(r.state.checksum, /^[0-9a-f]{64}$/);
});

test('a hand edit breaks the checksum', () => {
  const root = tmpRoot();
  save(K, emptyState(K), 'init', root);
  const f = statePath(K, root);
  const j = JSON.parse(fs.readFileSync(f, 'utf8')); j.phase = 'done';
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
  assert.match(load(K, root).errors.join(), /checksum mismatch/);
});

test('validate rejects bad values and accepts sub-numbered AC', () => {
  const bad = (mut) => { const s = emptyState(K); mut(s); return validate(s, K); };
  assert.ok(bad((s) => { s.phase = 'testing'; }).length);
  assert.ok(bad((s) => { s.approvals.push({ kind: 'push', what: 'x', answer: 'y', source: 'chat', evidence: 'y', at: 'z' }); }).length);
  assert.ok(bad((s) => { s.approvals.push({ kind: 'xray-push', what: 'x', answer: 'y', source: 'board', evidence: 'user said yes', at: 'z' }); }).join().includes('ANSWER:'));
  assert.ok(bad((s) => { s.approvals.push({ kind: 'xray-push', what: 'x', answer: 'y', source: 'chat', evidence: '', at: 'z' }); }).length);
  assert.ok(bad((s) => { s.ac.push({ id: 'AC-x', text: 't', status: 'active', source: 'analyst.md' }); }).length);
  assert.deepEqual(bad((s) => { s.ac.push({ id: 'AC-3.1', text: 't', status: 'active', source: 'analyst.md' }); }), []);
  assert.ok(bad((s) => { s.card = 'ETM-2'; }).length, 'card must match the folder');
});

test('history keeps the last 50 entries, all by lead', () => {
  const root = tmpRoot();
  let s = emptyState(K);
  for (let i = 0; i < 60; i++) s = save(K, s, `change ${i}`, root);
  const h = load(K, root).state.history;
  assert.equal(h.length, 50);
  assert.ok(h.every((e) => e.by === 'lead'));
  assert.equal(h[49].change, 'change 59');
});

test('no temp file is left, and a refused save keeps the previous file', () => {
  const root = tmpRoot();
  save(K, emptyState(K), 'init', root);
  const before = fs.readFileSync(statePath(K, root), 'utf8');
  const s = emptyState(K); s.phase = 'nope';
  assert.throws(() => save(K, s, 'bad', root), /phase/);
  assert.equal(fs.readFileSync(statePath(K, root), 'utf8'), before);
  assert.deepEqual(fs.readdirSync(path.dirname(statePath(K, root))).filter((f) => f.endsWith('.tmp')), []);
});

test('resolveFile keeps paths inside the card folders, normalises backslashes and resolves pw:', () => {
  const root = '/r', pwRepo = '/pw';
  const a = resolveFile(K, '.claude\\team\\work\\ETM-1\\a.md', { root, pwRepo });
  assert.equal(a.allowed, true);
  assert.equal(a.stored, '.claude/team/work/ETM-1/a.md');
  assert.equal(resolveFile(K, 'work/ETM-1/findings.json', { root, pwRepo }).allowed, true);
  const p = resolveFile(K, 'pw:tests/x.spec.ts', { root, pwRepo });
  assert.equal(p.allowed, true);
  assert.equal(p.abs, path.join('/pw', 'tests', 'x.spec.ts'));
  assert.equal(resolveFile(K, '../../etc/passwd', { root, pwRepo }).allowed, false);
  assert.equal(resolveFile(K, 'work/ETM-2/a.md', { root, pwRepo }).allowed, false);
  assert.equal(resolveFile(K, 'pw:../outside.txt', { root, pwRepo }).allowed, false);
});

test('pw: paths outside PW_REPO are refused, names starting with .. inside are fine, a missing PW_REPO is named', () => {
  assert.equal(resolveFile(K, 'pw:../x.ts', { root: '/r', pwRepo: '/pw' }).allowed, false);
  assert.equal(resolveFile(K, 'pw:..foo.ts', { root: '/r', pwRepo: '/pw' }).allowed, true);
  assert.match(resolveFile(K, 'pw:a.ts', { root: '/r', pwRepo: '' }).why, /PW_REPO not found/);
});

test('validate checks extra paths, gate entries and open questions', () => {
  const s = emptyState(K);
  s.files.extra.x = 5; s.gates.G1 = null; s.open.push({ id: 'Q-1', text: 7, owner: 'BA', since: 'x' });
  const e = validate(s, K).join('\n');
  assert.match(e, /files\.extra\.x/); assert.match(e, /gates\.G1/); assert.match(e, /open\[0\]/);
});

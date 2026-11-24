import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as C from './commands.mjs';
import { load } from './core.mjs';

const K = 'ETM-1';
function card({ analyst = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'statecli-'));
  const pwRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'statepw-'));
  const w = path.join(root, '.claude', 'team', 'work', K), w2 = path.join(root, 'work', K);
  fs.mkdirSync(w, { recursive: true }); fs.mkdirSync(w2, { recursive: true });
  fs.writeFileSync(path.join(w, 'story.md'), '# story\n');
  if (analyst) {
    fs.writeFileSync(path.join(w, 'analyst.md'), '# Analyst\n\n## AC items\n- AC-1: Plan shows\n- AC-2: Weekly cells\n- AC-2.1: one decimal\n\n## Open questions\n');
    fs.writeFileSync(path.join(w, 'draft-tc.md'), '# draft\n');
    fs.writeFileSync(path.join(w, 'draft-tc.7cases.bak.md'), '# old\n');
    fs.writeFileSync(path.join(w2, 'questions-for-BA.md'), 'q1\n');
    fs.writeFileSync(path.join(w2, 'questions-for-BA-round2.md'), 'q2\n');
  }
  fs.mkdirSync(path.join(pwRepo, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(pwRepo, 'tests', 'a.spec.ts'), '');
  return { root, pwRepo, opt: { root, pwRepo } };
}

test('init reads AC, the current draft (not .bak) and every question round in order', () => {
  const { opt } = card();
  const s = C.init(K, [], opt);
  assert.deepEqual(s.ac.map((a) => a.id), ['AC-1', 'AC-2.1']);
  assert.ok(s.ac.every((a) => a.status === 'active'));
  assert.equal(s.files.draft, `.claude/team/work/${K}/draft-tc.md`);
  assert.deepEqual(s.files.questions, [`work/${K}/questions-for-BA.md`, `work/${K}/questions-for-BA-round2.md`]);
});

test('init on an older card with only story.md works and has no AC', () => {
  const { opt } = card({ analyst: false });
  const s = C.init(K, [], opt);
  assert.deepEqual(s.ac, []);
  assert.equal(s.files.story, `.claude/team/work/${K}/story.md`);
});

test('init a second time keeps decisions and approvals', () => {
  const { opt } = card();
  C.init(K, [], opt);
  C.decide(K, ['Weekly keeps 1 decimal', '--source', 'BA round 2 F-7', '--ac', 'AC-2.1'], opt);
  const s = C.init(K, [], opt);
  assert.equal(s.decisions.length, 1);
  assert.deepEqual(s.decisions[0].ac, ['AC-2.1']);
});

test('phase push needs an xray-push approval, closeout needs jira-write, order is free', () => {
  const { opt } = card();
  C.init(K, [], opt);
  assert.throws(() => C.phase(K, ['push', 'push tests'], opt), /xray-push approval/);
  C.approve(K, ['push 3 Tests', '--kind', 'xray-push', '--answer', 'ใช่ push', '--source', 'chat', '--evidence', 'ใช่ push'], opt);
  assert.equal(C.phase(K, ['push', 'push tests'], opt).phase, 'push');
  assert.throws(() => C.phase(K, ['closeout', 'close'], opt), /jira-write approval/);
  C.phase(K, ['failures', 'ask user'], opt);
  C.phase(K, ['heal', 'heal locators'], opt);
  assert.equal(C.phase(K, ['failures', 'back'], opt).phase, 'failures');
});

test('file refuses missing or foreign paths, stores slashes, adds specs once', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  assert.throws(() => C.file(K, ['review', `.claude/team/work/${K}/review.md`], opt), /not found/);
  fs.mkdirSync(path.join(root, 'work', 'ETM-2'), { recursive: true }); fs.writeFileSync(path.join(root, 'work', 'ETM-2', 'x.md'), '');
  assert.throws(() => C.file(K, ['review', 'work/ETM-2/x.md'], opt), /outside/);
  fs.writeFileSync(path.join(root, '.claude', 'team', 'work', K, 'review.md'), 'r');
  assert.equal(C.file(K, ['review', `.claude\\team\\work\\${K}\\review.md`], opt).files.review, `.claude/team/work/${K}/review.md`);
  C.file(K, ['specs', 'pw:tests/a.spec.ts'], opt);
  assert.deepEqual(C.file(K, ['specs', 'pw:tests/a.spec.ts'], opt).files.specs, ['pw:tests/a.spec.ts']);
});

test('ac sync adds new AC and marks removed ones dropped', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  fs.writeFileSync(path.join(root, '.claude', 'team', 'work', K, 'analyst.md'), '## AC items\n- AC-2.1: one decimal\n- AC-3: new rule\n');
  const s = C.acSync(K, [], opt);
  const st = Object.fromEntries(s.ac.map((a) => [a.id, a.status]));
  assert.deepEqual(st, { 'AC-1': 'dropped', 'AC-2.1': 'active', 'AC-3': 'active' });
  assert.equal(C.acChanged(K, ['AC-3', 'BA answer round 3'], opt).ac.find((a) => a.id === 'AC-3').status, 'changed');
});

test('a board approval needs the ANSWER: line', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  events(root, [{ t: 1, job: K, type: 'answer', askAt: 0, text: 'ใช่ push', sig: 'x' }]);
  assert.throws(() => C.approve(K, ['push', '--kind', 'xray-push', '--answer', 'yes', '--source', 'board', '--evidence', 'user said yes'], opt), /ANSWER:/);
  assert.equal(C.approve(K, ['push', '--kind', 'xray-push', '--answer', 'ใช่ push', '--source', 'board', '--evidence', 'ANSWER: ใช่ push'], opt).approvals.length, 1);
});

test('open and close questions, gate results, and a short show', () => {
  const { opt } = card();
  C.init(K, [], opt);
  C.openQ(K, ['Is week 53 shown?', '--owner', 'BA'], opt);
  C.gate(K, ['G3', 'fail', '--errors', '2'], opt);
  let s = C.closeQ(K, ['Q-1', 'No, only 52'], opt);
  assert.equal(s.open.length, 0);
  assert.equal(s.decisions.at(-1).source, 'answer to Q-1');
  assert.deepEqual(load(K, opt.root).state.gates.G3.result, 'fail');
  const out = C.show(K, [], opt);
  assert.ok(out.split('\n').length <= 25);
  assert.match(out, /phase/); assert.match(out, /AC/);
});

test('the CLI exits 1 with the reason on a refused command', () => {
  const { root } = card();
  const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'state.mjs');
  spawnSync(process.execPath, [cli, 'init', K], { encoding: 'utf8', env: { ...process.env, STATE_ROOT: root } });
  const r = spawnSync(process.execPath, [cli, 'phase', K, 'bogus', 'x'], { encoding: 'utf8', env: { ...process.env, STATE_ROOT: root } });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown phase/);
});

test('a round saved in both card folders is listed once, the newer copy', () => {
  const { root, opt } = card();
  const team = path.join(root, '.claude', 'team', 'work', K);
  fs.writeFileSync(path.join(team, 'questions-for-BA.md'), 'newer copy');
  const old = new Date(Date.now() - 60_000);
  fs.utimesSync(path.join(root, 'work', K, 'questions-for-BA.md'), old, old);
  const s = C.init(K, [], opt);
  assert.deepEqual(s.files.questions, [`.claude/team/work/${K}/questions-for-BA.md`, `work/${K}/questions-for-BA-round2.md`]);
});

// ---- checkpoint review fixes
const sf = (root) => path.join(root, '.claude', 'team', 'work', K, 'state.json');
const events = (root, lines) => { fs.mkdirSync(path.join(root, '.claude', 'team'), { recursive: true }); fs.writeFileSync(path.join(root, '.claude', 'team', 'events.jsonl'), lines.map((l) => JSON.stringify(l)).join('\n') + '\n'); };

test('init on a broken state.json refuses; --rebuild keeps a backup and says REBUILD', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  C.decide(K, ['keep me', '--source', 'BA'], opt);
  fs.writeFileSync(sf(root), '{bad');
  assert.throws(() => C.init(K, [], opt), /not valid JSON|--rebuild/);
  const s = C.init(K, ['--rebuild'], opt);
  assert.match(s.history.at(-1).change, /^REBUILD/);
  assert.ok(fs.readdirSync(path.dirname(sf(root))).some((f) => /^state\.json\.bak-/.test(f)));
});

test('init on a state.json that fails validation refuses without --rebuild', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  const j = JSON.parse(fs.readFileSync(sf(root), 'utf8')); j.phase = 'bogus';
  const { computeChecksum } = awaitImport();
  j.checksum = computeChecksum(j); fs.writeFileSync(sf(root), JSON.stringify(j, null, 2));
  assert.throws(() => C.init(K, [], opt), /--rebuild/);
});
function awaitImport() { return CORE; }
import * as CORE from './core.mjs';

test('a board approval must match an answer the board recorded for this card', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  events(root, [{ t: 1, job: K, type: 'answer', askAt: 0, text: 'ใช่ push', sig: 'x' }, { t: 2, job: 'ETM-9', type: 'answer', askAt: 0, text: 'ok', sig: 'y' }]);
  assert.throws(() => C.approve(K, ['push', '--kind', 'xray-push', '--answer', 'ok', '--source', 'board', '--evidence', 'ANSWER: ok'], opt), /no answer "ok" on the board/);
  assert.equal(C.approve(K, ['push', '--kind', 'xray-push', '--answer', 'ใช่ push', '--source', 'board', '--evidence', 'ANSWER: ใช่ push'], opt).approvals[0].verified, true);
});

test('a chat approval is marked unverified and show lists it for the user', () => {
  const { opt } = card();
  C.init(K, [], opt);
  const s = C.approve(K, ['close card', '--kind', 'jira-write', '--answer', 'yes', '--source', 'chat', '--evidence', 'yes go'], opt);
  assert.equal(s.approvals[0].verified, false);
  assert.match(C.show(K, [], opt), /chat, not verified/);
});

test('phase run needs a run-tests approval', () => {
  const { opt } = card();
  C.init(K, [], opt);
  assert.throws(() => C.phase(K, ['run', 'run specs'], opt), /run-tests approval/);
});

test('a flag never takes another flag as its value, and words after a flag value stay positional', () => {
  const { opt } = card();
  C.init(K, [], opt);
  assert.throws(() => C.approve(K, ['x', '--kind', 'jira-write', '--source', 'chat', '--evidence', '--answer', 'y'], opt), /evidence/);
  const s = C.decide(K, ['--source', 'BA', 'weekly', 'keeps', '1', 'decimal'], opt);
  assert.equal(s.decisions.at(-1).text, 'weekly keeps 1 decimal');
});

test('a symlink out of the card folder is refused', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'outside-')); fs.writeFileSync(path.join(outside, 's.txt'), 'x');
  fs.symlinkSync(outside, path.join(root, '.claude', 'team', 'work', K, 'link'));
  assert.throws(() => C.file(K, ['tests', `.claude/team/work/${K}/link/s.txt`], opt), /outside/);
});

test('a folder is refused for a file kind', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  fs.mkdirSync(path.join(root, '.claude', 'team', 'work', K, 'dir'));
  assert.throws(() => C.file(K, ['tests', `.claude/team/work/${K}/dir`], opt), /not a file/);
});

test('ac sync with a missing analyst file gives a plain message', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  fs.rmSync(path.join(root, '.claude', 'team', 'work', K, 'analyst.md'));
  assert.throws(() => C.acSync(K, [], opt), /analyst file .* not found/);
});

test('the first history entry (init) survives the 50-entry cap', () => {
  const { opt } = card();
  C.init(K, [], opt);
  let s; for (let i = 0; i < 60; i++) s = C.gate(K, ['G1', 'pass'], opt);
  assert.equal(s.history.length, 50);
  assert.match(s.history[0].change, /^init/);
});

test('a round re-discovered in the other folder replaces the old path instead of adding a second one', () => {
  const { root, opt } = card();
  C.init(K, [], opt);
  const team = path.join(root, '.claude', 'team', 'work', K);
  fs.writeFileSync(path.join(team, 'questions-for-BA-round2.md'), 'newer');
  const s = C.init(K, [], opt);
  assert.equal(s.files.questions.filter((p) => p.endsWith('questions-for-BA-round2.md')).length, 1);
});

test('policy approval: only run-tests with the RUN-POLICY line', () => {
  const opt = { root: fs.mkdtempSync(path.join(os.tmpdir(), 'state-policy-')) };
  C.init('ETM-77', [], opt);
  assert.throws(() => C.approve('ETM-77', ['push', '--kind', 'xray-push', '--source', 'policy', '--evidence', 'RUN-POLICY: auto ETM-77'], opt), /only for --kind run-tests/);
  assert.throws(() => C.approve('ETM-77', ['run', '--kind', 'run-tests', '--source', 'policy', '--evidence', 'lead says ok'], opt), /RUN-POLICY/);
  const s = C.approve('ETM-77', ['run 2 tests', '--kind', 'run-tests', '--source', 'policy', '--evidence', 'RUN-POLICY: auto ETM-77 tests=ETM-1 | C: re-run'], opt);
  assert.equal(s.approvals.at(-1).verified, true);
  assert.equal(C.phase('ETM-77', ['run'], opt).phase, 'run');
});

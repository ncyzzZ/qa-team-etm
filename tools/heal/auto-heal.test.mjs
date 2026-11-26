import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { propose, apply, skip } from './auto-heal.mjs';

function setup(pageLine, triage) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'autoheal-'));
  const pw = path.join(root, 'pw'), fe = path.join(root, 'fe'), run = path.join(root, 'run');
  fs.mkdirSync(path.join(pw, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(pw, 'tests'), { recursive: true });
  fs.mkdirSync(path.join(fe, '.git'), { recursive: true });
  fs.mkdirSync(run);
  fs.writeFileSync(path.join(pw, 'pages', 'plan.ts'), `export class P {\n${pageLine}\n}\n`);
  fs.writeFileSync(path.join(run, 'triage.json'), JSON.stringify(triage));
  return { pw, fe, run };
}
const row = (over = {}) => ({ key: 'ETM-1', title: 't', cause: 'locator', locator: "locator('.save-btn')", pageRef: 'pages/plan.ts:2', ...over });
const removed = (cand) => () => ({ present: false, library: false, removedIn: { commit: 'abcdef1234' }, candidates: cand });

test('a removed class with one replacement becomes a ready diff that passes the guard', () => {
  const { pw, fe, run } = setup("  save = () => this.page.locator('.save-btn');", [row()]);
  const d = propose(run, { pwRepo: pw, feRepo: fe, lookup: removed(['plan-save']) });
  assert.equal(d.proposals[0].status, 'ready');
  assert.match(d.proposals[0].new, /\.plan-save'/);
  assert.ok(fs.existsSync(path.join(run, 'heal-1.diff')));
  assert.ok(fs.existsSync(path.join(run, 'heal-proposals.md')));
});

test('apply rewrites only that line, and only when the line is unchanged', () => {
  const { pw, fe, run } = setup("  save = () => this.page.locator('.save-btn');", [row()]);
  propose(run, { pwRepo: pw, feRepo: fe, lookup: removed(['plan-save']) });
  assert.equal(apply(run, 'all', { pwRepo: pw }).length, 1);
  assert.match(fs.readFileSync(path.join(pw, 'pages', 'plan.ts'), 'utf8'), /locator\('\.plan-save'\)/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(run, 'heal-proposals.json'))).proposals[0].status, 'applied');
});

test('a changed line is not applied', () => {
  const { pw, fe, run } = setup("  save = () => this.page.locator('.save-btn');", [row()]);
  propose(run, { pwRepo: pw, feRepo: fe, lookup: removed(['plan-save']) });
  fs.writeFileSync(path.join(pw, 'pages', 'plan.ts'), "export class P {\n  save = () => this.page.locator('.other');\n}\n");
  assert.equal(apply(run, 'all', { pwRepo: pw }).length, 0);
});

test('still present in stms-fe, or several candidates -> needs-live', () => {
  let s = setup("  save = () => this.page.locator('.save-btn');", [row()]);
  assert.equal(propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: () => ({ present: true, candidates: [] }) }).proposals[0].status, 'needs-live');
  s = setup("  save = () => this.page.locator('.save-btn');", [row()]);
  assert.equal(propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['a', 'b']) }).proposals[0].status, 'needs-live');
});

test('library class -> needs-live', () => {
  const s = setup("  row = () => this.page.locator('.b-grid-row');", [row({ locator: "locator('.b-grid-row')" })]);
  assert.equal(propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['x']) }).proposals[0].status, 'needs-live');
});

test('a locator written in tests/ gets a ready diff and can be applied', () => {
  const s = setup('  x = 1;', [row({ pageRef: null, locator: "locator('.only-in-spec')" })]);
  fs.writeFileSync(path.join(s.pw, 'tests', 'a.spec.ts'), "  await page.locator('.only-in-spec').click();\n");
  const p = propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['new-cls']) }).proposals[0];
  assert.equal(p.status, 'ready');
  assert.equal(p.page, 'tests/a.spec.ts:1');
  apply(s.run, 'all', { pwRepo: s.pw });
  assert.match(fs.readFileSync(path.join(s.pw, 'tests', 'a.spec.ts'), 'utf8'), /\.new-cls/);
});

test('several lines in tests/: the failing spec file wins, else manual', () => {
  const s = setup('  x = 1;', [row({ pageRef: null, locator: "locator('.dup')", file: 'b.spec.ts' })]);
  fs.writeFileSync(path.join(s.pw, 'tests', 'a.spec.ts'), "  await page.locator('.dup').click();\n");
  fs.writeFileSync(path.join(s.pw, 'tests', 'b.spec.ts'), "  await page.locator('.dup').click();\n");
  assert.equal(propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['n']) }).proposals[0].page, 'tests/b.spec.ts:1');
  const s2 = setup('  x = 1;', [row({ pageRef: null, locator: "locator('.dup')", file: 'c.spec.ts' })]);
  fs.writeFileSync(path.join(s2.pw, 'tests', 'a.spec.ts'), "  await page.locator('.dup').click();\n");
  fs.writeFileSync(path.join(s2.pw, 'tests', 'b.spec.ts'), "  await page.locator('.dup').click();\n");
  assert.equal(propose(s2.run, { pwRepo: s2.pw, feRepo: s2.fe, lookup: removed(['n']) }).proposals[0].status, 'manual');
});

test('a locator inside an expect line in tests/ is refused by the guard -> manual', () => {
  const s = setup('  x = 1;', [row({ pageRef: null, locator: "locator('.hdr')" })]);
  fs.writeFileSync(path.join(s.pw, 'tests', 'a.spec.ts'), "  await expect(page.locator('.hdr')).toBeVisible();\n");
  const p = propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['hdr2']) }).proposals[0];
  assert.equal(p.status, 'manual');
  assert.match(p.reason, /guard refused/);
});

test('skip marks open proposals skipped; non-locator rows are ignored', () => {
  const s = setup("  save = () => this.page.locator('.save-btn');", [row(), row({ key: 'ETM-2', cause: 'assertion' })]);
  const d = propose(s.run, { pwRepo: s.pw, feRepo: s.fe, lookup: removed(['plan-save']) });
  assert.equal(d.proposals.length, 1);
  skip(s.run, 'all');
  assert.equal(JSON.parse(fs.readFileSync(path.join(s.run, 'heal-proposals.json'))).proposals[0].status, 'skipped');
});

// Live healer answers (user, chat 2026-11-26: "อยากให้มันแก้เอง"): needs-live -> ready when the healer's one-line diff passes the guard.
import { fromLive } from './auto-heal.mjs';
const BRYNTUM = "  bar = () => this.page.locator('.b-gantt-task-old');";
const liveSetup = () => { const s = setup(BRYNTUM, [row({ locator: "locator('.b-gantt-task-old')" })]); propose(s.run, { pwRepo: s.pw, feRepo: s.fe }); return s; };
const answer = (newLine, extra = '') => `test: ETM-1   page: pages/plan.ts:2   source: live
old: .b-gantt-task-old
new: .b-gantt-task
cause: locator
why: the bar class is b-gantt-task on the live page
- a prose bullet that is not part of the diff
diff:
\`\`\`
--- a/pages/plan.ts
+++ b/pages/plan.ts
@@ -2,1 +2,1 @@
-${BRYNTUM}
+${newLine}
${extra}\`\`\`
`;

test('live: a guarded one-line heal becomes ready and auto-next can apply it', async () => {
  const { pw, run } = liveSetup();
  assert.equal(JSON.parse(fs.readFileSync(path.join(run, 'heal-proposals.json'))).proposals[0].status, 'needs-live');
  const p = fromLive(run, 1, answer("  bar = () => this.page.locator('.b-gantt-task');"), { pwRepo: pw });
  assert.equal(p.status, 'ready'); assert.equal(p.source, 'live'); assert.equal(p.page, 'pages/plan.ts:2');
  assert.equal(apply(run, '1', { pwRepo: pw }).length, 1);
  assert.match(fs.readFileSync(path.join(pw, 'pages', 'plan.ts'), 'utf8'), /'\.b-gantt-task'\)/);
});

test('live: widening, structure change, extra lines and not-a-locator go to a person', () => {
  let s = liveSetup();
  assert.equal(fromLive(s.run, 1, answer("  bar = () => this.page.locator('.b-gantt-task').first();"), { pwRepo: s.pw }).status, 'manual');
  s = liveSetup();
  assert.match(fromLive(s.run, 1, answer("  bar = () => this.page.locator('.b-gantt-task');", "+  extra = 1;\n"), { pwRepo: s.pw }).reason, /not one changed line/);
  s = liveSetup();
  assert.match(fromLive(s.run, 1, 'test: ETM-1\ncause: not-a-locator\nwhy: the bar is gone\ndiff:\nnone', { pwRepo: s.pw }).reason, /not-a-locator/);
  s = liveSetup();
  assert.throws(() => fromLive(s.run, 1, answer('x').replace('test: ETM-1', 'test: ETM-2'), { pwRepo: s.pw }), /for ETM-2/);
});

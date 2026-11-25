import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { score, tcBlocks } from './defect-exam.mjs';
const EX = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'evals', 'exams');
const load = d => ({ sig: JSON.parse(fs.readFileSync(path.join(EX, d, 'exam.json'), 'utf8')).catch, txt: fs.readFileSync(path.join(EX, d, 'baseline-draft-tc.md'), 'utf8') });
const drop = (txt, re) => txt.split('\n').filter(l => !re.test(l)).join('\n');

test('tcBlocks splits on ### TC- and stops at ## headings', () => {
  const b = tcBlocks('# x\n### TC-001 a\n1. s\n## Map\nrow\n### TC-002 b\n2. t');
  assert.deepEqual(b.map(x => [x.id, x.lines.length]), [['TC-001', 2], ['TC-002', 2]]);
});
test('ETM-9229: the original draft is caught by TC-011 only', () => {
  const { sig, txt } = load('ETM-9229');
  assert.deepEqual(score(txt, sig).caught_by.map(c => c.tc), ['TC-011']);
});
test('ETM-9229: without the "clear the search box, filters stay" step it is MISSED', () => {
  const { sig, txt } = load('ETM-9229');
  assert.equal(score(drop(txt, /Clear the search box/), sig).caught_by.length, 0);
});
test('ETM-8877: the original draft is caught by TC-018 only', () => {
  const { sig, txt } = load('ETM-8877');
  assert.deepEqual(score(txt, sig).caught_by.map(c => c.tc), ['TC-018']);
});
test('ETM-8877: without the multi-row weekly paste steps it is MISSED', () => {
  const { sig, txt } = load('ETM-8877');
  assert.equal(score(drop(txt, /two lines `10\.0<TAB>20\.0`|`70\.0` and `80\.0` were ignored/), sig).caught_by.length, 0);
});
test('a heading alone never counts as a step', () => {
  const sig = { block: [], steps: [[['first row only']]] };
  assert.equal(score('### TC-001 first row only\n1. paste', sig).caught_by.length, 0);
});
test('ETM-8877: other wording of the same check is still caught (exam run 2026-11-25, TC-040)', () => {
  const { sig } = load('ETM-8877');
  const txt = '### TC-040 multi-row paste (BND)\nPrecondition: common, Edit Plan open.\n1. Record the weekly Plan (%) values of activities 1 to 3. -> Written down.\n2. Set the clipboard to 3 rows of 3 values. -> The clipboard holds 3 rows.\n3. Paste into the first weekly cell of activity 1. -> Only the first row is written.\n4. Compare activities 2 and 3 with the record. -> They are unchanged.';
  assert.deepEqual(score(txt, sig).caught_by.map(c => c.tc), ['TC-040']);
});
test('ETM-8877: a multi-row paste on the Timeline (no Edit Plan) is not counted', () => {
  const { sig } = load('ETM-8877');
  const txt = '### TC-022 Timeline weekly\n1. Set the clipboard to 3 rows of weekly Plan (%) values. -> Holds 3 rows.\n2. Look at activities 2 and 3. -> They are unchanged.';
  assert.equal(score(txt, sig).caught_by.length, 0);
});

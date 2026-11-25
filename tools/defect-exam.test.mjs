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

const sigOf = d => JSON.parse(fs.readFileSync(path.join(EX, d, 'exam.json'), 'utf8')).catch;
const ids = (txt, d) => score(txt, sigOf(d)).caught_by.map(c => c.tc);
const cases = {
  'ETM-8902': ['### TC-1 Blank filter\n1. Tick only `-` in the Remark filter. -> Blank rows.\n2. Open a work\'s edit page. -> Edit page.\n3. Click the worklist link in the breadcrumb. -> The worklist shows the same rows with `-` still ticked.',
               '### TC-1 Blank filter\n1. Tick only `-` in the Remark filter. -> Blank rows.\n2. Open another page and go back with the browser Back button. -> The worklist shows the same rows.'],
  'ETM-8664': ['### TC-1 Update Progress\n1. Collapse group A. -> Update Progress is enabled.\n2. Expand group A again. -> Update Progress is disabled again (no net change).',
               '### TC-1 Update Progress\n1. Look at Update Progress. -> It is disabled.\n2. Collapse group A. -> Update Progress is enabled.\n3. Expand group B. -> Group B rows show.'],
  'ETM-8666': ['### TC-1 Job Owner view\n1. As Job Owner collapse and expand a group. -> Rows hide and show.\n2. Click the breadcrumb to leave the page. -> The next page opens with no Unsaved Change modal.',
               '### TC-1 Job Owner view\n1. As Job Owner collapse a group. -> Rows hide.\n2. Expand it. -> Rows show.'],
  'ETM-8412': ['### TC-1 Edit Plan\n1. Collapse group A on the Timeline tab. -> Collapsed.\n2. Click Edit Plan. -> All groups are expanded.',
               '### TC-1 Edit Plan\n1. On Edit Plan collapse group A. -> Rows hide.\n2. Expand it. -> Rows show.'],
  'ETM-8497': ['### TC-1 Edit Plan dates\n1. Type 03 Jun 2026 in Start Date and press Tab. -> Focus moves to End Date.',
               '### TC-1 Edit Plan dates\n1. Type 03 Jun 2026 in Start Date. -> Shown.\n2. Open the Timeline tab. -> End Date unchanged.'],
  'ETM-8429': ['### TC-1 Edit Plan conflict\n1. User B types Actual (%) on the Timeline and clicks Update Progress. -> Update Success.\n2. User A clicks Save on Edit Plan. -> The modal Progress has been updated opens; OK reloads.',
               '### TC-1 Edit Plan save\n1. Click Update Progress. -> Update Success.\n2. Click Save on Edit Plan. -> Save Success.'],
  'ETM-8430': ['### TC-1 Edit Plan two users\nLast-Write-Wins between two users.\n1. User A clicks Save. -> Save Success.\n2. User B clicks Save. -> Save Success, no conflict modal; B\'s name is kept.',
               '### TC-1 Edit Plan\n1. Click Save. -> Save Success.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(cases)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('ETM-8902: the original ETM-8391 draft has no case for it', () => {
  assert.equal(score(fs.readFileSync(path.join(EX, 'ETM-9229', 'baseline-draft-tc.md'), 'utf8'), sigOf('ETM-8902')).caught_by.length, 0);
});
test('ETM-8429: a Last-Write-Wins case that expects NO dialog is not counted (exam run 2026-11-25, TC-047)', () => {
  const txt = '### TC-047 two sessions on Edit Plan\n3. Click `Save` in session A. -> A saves with the success toast.\n4. Click `Save` in session B. -> B saves without being blocked (no progress was changed on the Timeline, so no conflict dialog).';
  assert.deepEqual(ids(txt, 'ETM-8429'), []);
  assert.deepEqual(ids(txt.replace('### TC-047 two sessions on Edit Plan', '### TC-047 two sessions on Edit Plan, Last-Write-Wins'), 'ETM-8430'), ['TC-047']);
});
test('ETM-8664: the same steps with the wrong expected result are MISSED (exam run 2026-11-25, TC-033)', () => {
  const txt = '### TC-033 Update Progress after collapse\n1. Look at `Update Progress`. -> It is disabled.\n2. Collapse one group. -> `Update Progress` is enabled.\n3. Expand the same group. -> `Update Progress` stays enabled (no compare-back to the saved state).';
  assert.deepEqual(ids(txt, 'ETM-8664'), []);
});

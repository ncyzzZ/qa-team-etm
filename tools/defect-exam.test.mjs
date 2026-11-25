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
test('ETM-8877: the short form EP and "equal step 1" are understood (re-exam 2026-11-25, TC-031)', () => {
  const txt = '### TC-031 more than one pasted row (BND)\nPrecondition: common. EP. Clipboard = 3 rows of 2 columns.\n1. Record the weekly Plan (%) of the anchor activity and the next two activities. -> Values written down.\n3. Press Ctrl+V. -> The anchor row shows `10.0` and `20.0`.\n4. Look at the next two activities. -> Their weekly Plan (%) equal step 1.';
  assert.deepEqual(ids(txt, 'ETM-8877'), ['TC-031']);
  assert.deepEqual(ids(txt.replace('EP.', 'TL.'), 'ETM-8877'), []);
});
test('regex words do not match inside other words', () => {
  assert.equal(score('### TC-1 x\n1. Next step. -> ok', { block: [['re:\\bEP\\b']], steps: [] }).caught_by.length, 0);
});
test('ETM-8664: "does not go back to disabled" and "disabled again after the save" are not counted (re-exam 2026-11-25, TC-034, TC-012)', () => {
  const wrong = '### TC-034 collapse\n2. Collapse group 1. -> Update Progress is enabled.\n3. Click the chevron of the same group. -> The group expands again.\n4. Look at `Update Progress`. -> The button is still enabled (it does not go back to disabled).';
  const save = '### TC-012 button\n2. Collapse group 1. -> Update Progress is enabled.\n3. Click Update Progress. -> Saved.\n4. Wait until the save response is back and look at the button. -> `Update Progress` is disabled again (no unsaved change).\nClean up: expand the group again and Update Progress.';
  assert.deepEqual(ids(wrong, 'ETM-8664'), []);
  assert.deepEqual(ids(save, 'ETM-8664'), []);
});
test('ETM-8429: "TM-B" names the second user (re-exam 2026-11-25, TC-052)', () => {
  const txt = '### TC-052 conflict modal\n2. TM-B updates the Actual (%) of any activity on the Timeline and clicks `Update Progress`. -> TM-B sees `Update Success`.\n3. TM-A clicks `Save`. -> A modal opens with the title `Progress has been updated`.';
  assert.deepEqual(ids(txt.replace('### TC-052 conflict modal', '### TC-052 conflict modal on Edit Plan'), 'ETM-8429'), ['TC-052']);
});

// Equipment Mob Plan exams (ETM-7311, ETM-7306): one hit and one near miss each
const emp = {
  'ETM-7913': ['### TC-1 Deck\n1. Double-click a Deck cell and type `Pump Room 9` (not in the list). -> The list offers `Pump Room 9` as a new option.\n2. Press Enter. -> The cell shows `Pump Room 9`.',
               '### TC-1 Deck\n1. Double-click a Deck cell and pick `Main Deck`. -> The cell shows `Main Deck`.'],
  'ETM-7915': ['### TC-1 Area\n1. Type Width `1.15` and Length `1.10`. -> Area (m2) shows `1.27` (1.265 rounded half up).',
               '### TC-1 Area\n1. Type Width `2.00` and Length `3.00`. -> Area (m2) shows `6.00`.'],
  'ETM-7922': ['### TC-1 Gross Wt.\n1. Type `1234567` in Gross Wt. (Tons) and click outside. -> It shows `1,234,567`.',
               '### TC-1 Gross Wt.\n1. Type `12` in Gross Wt. (Tons). -> It shows `12`.'],
  'ETM-7936': ['### TC-1 Paste into mandatory cells\n1. Put `abc` on the clipboard and paste (Ctrl+V) into Width (m). -> The modal Paste Validation Failed shows.\n2. Close the modal and look at the Width cell. -> The cell has a red background.',
               '### TC-1 Paste dates\n1. Put an invalid date on the clipboard and paste (Ctrl+V) into Require at Offshore. -> The modal shows; the cell is blank, not red.'],
  'ETM-7938': ['### TC-1 Paste in edit mode\n1. Double-click Remark with `ABC`, put the cursor at the end and press Ctrl+V with `123` on the clipboard. -> The cell shows `ABC123`; the existing text is kept.',
               '### TC-1 Paste in focus mode\n1. Select the Remark cell and press Ctrl+V with `123`. -> The cell shows `123`.'],
  'ETM-7940': ['### TC-1 Platform dropdown\n1. Open the Platform dropdown and type `WP`. -> Only platforms containing `WP` are listed.',
               '### TC-1 Deck\n1. Open the Deck combo-box and type `Main`. -> Only options containing `Main` are listed.'],
  'ETM-7947': ['### TC-1 Date picker\n1. Click Require at Offshore. -> The date picker opens on the month of the Event Start.',
               '### TC-1 Date picker\n1. Click Require at Offshore. -> The date picker opens.'],
  'ETM-8073': ['### TC-1 Dropdowns in lower rows\n1. Scroll down to the last row and click its Transportation cell. -> The list opens with Supply Vessel, Crew Boat, MSB, Helicopter.',
               '### TC-1 Dropdowns\n1. Click the Transportation cell of the first row. -> The list opens.'],
  'ETM-7857': ['### TC-1 Empty plan with no Work Header\n1. Open the plan. -> `No results found` shows with no sub-text and no table header.',
               '### TC-1 Empty plan with no Work Header\n1. Open the plan. -> The open box picture shows.'],
  'ETM-7801': ['### TC-1 Column width\n1. Drag the right border of Gross Wt. (Tons) to widen it. -> The column is wider.\n2. Look at the values. -> They stay right aligned in the column.',
               '### TC-1 Column width\n1. Drag the right border of Gross Wt. (Tons) to widen it. -> The column is wider.'],
  'ETM-7799': ['### TC-1 Deleted plan\n1. In another session delete the plan. -> Deleted.\n2. In the first session click Save. -> The already deleted modal shows; OK goes to the Plan page.',
               '### TC-1 Delete\n1. Delete the plan. -> It is gone from the Plan Card.'],
  'ETM-7886': ['### TC-1 Add Equipment in a long list\n1. Click Add Equipment on a Work Header with 40 rows. -> The new row is added at the end.\n2. Look at both panels. -> The page scrolls to the new row and both panels stay aligned.',
               '### TC-1 Add Equipment\n1. Click Add Equipment. -> A new row is added.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(emp)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('ETM-7936: a hedged result ("either ... or red") is not counted (exam 2026-11-25, TC-017)', () => {
  const txt = '### TC-017 paste numbers\n5. Paste `-4.5` into the Width cell. -> The result is not a negative number: either the cell does not take the minus sign or the value is rejected with a red background.';
  assert.deepEqual(ids(txt, 'ETM-7936'), []);
});
test('ETM-7940: typing into a text cell next to a note about dropdowns is not counted (exam 2026-11-25, TC-024)', () => {
  const txt = '### TC-024 Contact Person\nNote: Platform is a dropdown.\n5. Type a space only in Contact Person. -> The cell is treated as blank (red) or accepted; record the result.';
  assert.deepEqual(ids(txt, 'ETM-7940'), []);
});

// Date input (ETM-7902) and filter panel (ETM-7314) exams
const set3 = {
  'ETM-8501': ['### TC-1 Invalid date\n1. Double-click Start Date (record it), clear it, type `32/01/2026` and press Tab. -> The cell is blank and red.\n2. Double-click the same cell again. -> The box is pre-filled with the recorded prior valid date.',
               '### TC-1 Invalid date\n1. Double-click Start Date, clear it, type `32/01/2026` and press Tab. -> The cell is blank and red.'],
  'ETM-8462': ['### TC-1 Clear a date\n1. Double-click Mob Date and delete all text so the date is empty. -> The box is empty.\n2. Press Tab. -> The cell stays empty (red); the old date is not restored.',
               '### TC-1 Change a date\n1. Double-click Mob Date and type `5/6/26`. -> Typed.\n2. Press Tab. -> The cell shows `05 Jun 2026`.'],
  'ETM-8460': ['### TC-1 Convert then re-enter\n1. Paste `5/6/26 1430` and click outside. -> It is converted to `05 Jun 2026, 14:30`.\n2. Click back into the same field. -> It shows the converted value `05 Jun 2026, 14:30`.',
               '### TC-1 Convert\n1. Paste `5/6/26 1430` and click outside. -> It is converted to `05 Jun 2026, 14:30`.'],
  'ETM-8456': ['### TC-1 Tab commits\n1. Double-click Mob Date, type `5/6/26` and press Tab. -> The cell shows `05 Jun 2026` and the next cell is focused.',
               '### TC-1 Tab\n1. Double-click Mob Date, type `5/6/26` and press Enter. -> The cell shows `05 Jun 2026`.'],
  'ETM-7957': ['### TC-1 Filter Panel sections\n1. Open the filter panel and read the sections. -> Exactly these 23 fields in this order: Material Description, WIN# No. (CCU No.), ...',
               '### TC-1 Filter Panel\n1. Open the filter panel. -> It slides in from the right.'],
  'ETM-7949': ['### TC-1 Date filter\n1. Click the From box of Require at Offshore. -> The date picker opens on the earliest month found in the table data.',
               '### TC-1 Date filter\n1. Pick 01 Jun 2026 in the From box. -> Rows from 01 Jun 2026 show.'],
  'ETM-7945': ['### TC-1 No match\n1. Tick a Status that matches no record and apply. -> The table body is empty, only the table header stays; no message.',
               '### TC-1 Match\n1. Tick Status `Received` and apply. -> Only received rows show.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(set3)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('ETM-7957: "23 sections show as collapsed" without the field list is not counted (exam 2026-11-25, TC-004)', () => {
  assert.deepEqual(ids('### TC-004 Filter Panel\n1. Open the Filter Panel for the first time. -> All 23 sections show as collapsed, with only their headers visible.', 'ETM-7957'), []);
});
test('ETM-7902 set: other wording is understood, "table" is not "Tab", Tab on another page does not count (exam 2026-11-25)', () => {
  assert.deepEqual(ids('### TC-020 red cell\n1. Record value A of the cell. -> Written down.\n2. Type `31/02/2026` and press `Enter`. -> The cell is blank and red.\n3. Double-click the red cell. -> The edit field shows value A, not blank.', 'ETM-8501'), ['TC-020']);
  assert.deepEqual(ids('### TC-022 clear\n1. Double-click the cell, select all text and press `Delete`. -> The edit field is empty.\n2. Press `Enter`. -> The cell is blank with a red background.', 'ETM-8462'), ['TC-022']);
  assert.deepEqual(ids('### TC-029 Manpower Mob Plan dates\n1. For each row of the table type the input into Mobilization Date and press `Enter`. -> The cell shows the expected value.', 'ETM-8456'), []);
  assert.deepEqual(ids('### TC-002 Shutdown Logic\n5. Type `6/6/26 08:00`. -> Typed.\n6. Press `Tab`. -> The End cell shows `06 Jun 2026 08:00`.', 'ETM-8456'), []);
});

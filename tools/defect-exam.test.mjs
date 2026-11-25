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

// Shutdown Logic filters (ETM-7899), Key Milestones (ETM-7350) and Equipment Mob Plan export (ETM-7315) exams
const set4 = {
  'ETM-8433': ['### TC-1 Work Header order\n1. Open the Filter Panel and expand Work Header. -> The Work Header options follow the Master Data sequence (Mechanical (PM), Mechanical (CM), ...), not the row order.',
               '### TC-1 Work Header list\n1. Open the Filter Panel and expand Work Header. -> All Work Headers of the plan are listed with Select All checked.'],
  'ETM-8437': ['### TC-1 Work Header and Date\n1. In the Filter Panel keep only Work Header `Valve Greasing` (the only one under Platform `WP-A`). -> Set.\n2. Set the Date filter to a range in which that Work Header has no task. -> Platform `WP-A` row and the Work Header row are both hidden.',
               '### TC-1 Work Header and Date\n1. In the Filter Panel keep only Work Header `Valve Greasing` (the only one under Platform `WP-A`). -> Set.\n2. Set the Date filter to a range that covers its tasks. -> Platform `WP-A`, the Work Header and its tasks show.'],
  'ETM-8439': ['### TC-1 New values from the Worklist\n1. On the Worklist page create a Work with a new Platform `WP-NEW` and a new Work Header, save. -> Saved.\n2. Open Shutdown Logic and the Filter Panel. -> `WP-NEW` and the new Work Header are listed in the Platform and Work Header filters.',
               '### TC-1 New values\n1. On the Worklist page create a Work with a new Platform `WP-NEW`, save. -> Saved.\n2. Open Shutdown Logic. -> The new row shows in the Gantt table.'],
  'ETM-8295': ['### TC-1 Notes outside a shortened range\n1. Add a note in the last week and save. -> Icon shows.\n2. Edit Plan: shorten the plan so that week is outside the range, Save. -> The week is gone.\n3. Edit Plan: extend the range back to the original end date, Save. -> The Key Milestones cell of that week is empty (+ on hover); the note does not reappear.',
               '### TC-1 Notes outside a shortened range\n1. Add a note in the last week and save. -> Icon shows.\n2. Edit Plan: shorten the plan so that week is outside the range, Save. -> The note is deleted without a prompt.'],
  'ETM-8328': ['### TC-1 Shutdown Type shrinks the range\n1. Add a note in the last week. -> Icon shows.\n2. Edit Plan: change Shutdown Type to Minor SD so that week falls out, Save. -> The week is gone.\n3. Edit Plan: change the Shutdown Type back to the original, Save. -> The Key Milestones cell of that week is empty; the note does not reappear.',
               '### TC-1 Shutdown Type shrinks the range\n1. Add a note in the last week. -> Icon shows.\n2. Edit Plan: change Shutdown Type to Minor SD so that week falls out, Save. -> The note is deleted.'],
  'ETM-8361': ['### TC-1 Dates after Save\n1. Note Start Date and End Date of the plan, open Edit Plan, rename one activity and click Save. -> Saved.\n2. Look at the plan Start Date and End Date. -> Both are unchanged (same as noted in step 1).',
               '### TC-1 Save\n1. Open Edit Plan, rename one activity and click Save. -> Toast `Edit Success`.'],
  'ETM-7892': ['### TC-1 Export alignment\n1. Export the plan and open the .xlsx. -> Opened.\n2. Look at Premob Inspection. -> `Yes` / `No` values are center-aligned.',
               '### TC-1 Export values\n1. Export the plan and open the .xlsx. -> Opened.\n2. Look at Premob Inspection. -> It shows `Yes` / `No`.'],
  'ETM-7869': ['### TC-1 Export No.\n1. Export the plan and open the .xlsx. -> Opened.\n2. Look at column `No.`. -> 1, 2, 3 ... continuous, center-aligned.',
               '### TC-1 Export MMR\n1. Export the plan and open the .xlsx. -> Opened.\n2. Look at `MMR No.`. -> Text, center-aligned.'],
  'ETM-7863': ['### TC-1 Empty Work Header in Excel\n1. Export a plan with an empty Work Header and open the .xlsx. -> Opened.\n2. Look at the row under it. -> `No equipment assigned.` merged A-X, italic gray #8C8C8C on white.',
               '### TC-1 Empty Work Header in Excel\n1. Export a plan with an empty Work Header and open the .xlsx. -> Opened.\n2. Look at the row under it. -> `No equipment assigned.` merged A-X.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(set4)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('ETM-7899/7350/7315 set: cases that expect the bug are not counted, other wording is', () => {
  // Platform row expected to stay = the bug
  assert.deepEqual(ids('### TC-1 x\n1. In the Filter Panel keep one Work Header and set a Date range with no task for it. -> The Work Header row is hidden; the Platform row stays visible.', 'ETM-8437'), []);
  // empty-table wording catches too
  assert.deepEqual(ids('### TC-2 x\n1. Keep Work Header `MFL` only and set the Date filter outside all its tasks. -> Only the table header shows, all rows hidden incl. Platform.', 'ETM-8437'), ['TC-2']);
  // a note that comes back is the bug
  assert.deepEqual(ids('### TC-3 x\n1. Edit Plan: shorten the range so the note week is outside, Save. -> Week gone.\n2. Edit Plan: extend back to the original range, Save. -> The note reappears with its icon.', 'ETM-8295'), []);
  // ETM-8328 needs the Shutdown Type or Actual/Update Progress path, the plain date path is ETM-8295
  assert.deepEqual(ids('### TC-4 x\n1. Edit Plan: shorten the range so the note week is outside, Save. -> Week gone.\n2. Edit Plan: extend back to the original range, Save. -> The cell is empty; the note does not reappear.', 'ETM-8328'), []);
  assert.deepEqual(ids('### TC-5 x\n1. Clear the Actual (%) of the outer week and click Update Progress so the note week falls out. -> Grid contracts.\n2. Edit Plan: extend the range back to cover that week, Save. -> No icon in that week.', 'ETM-8328'), ['TC-5']);
  // a date shifted by one day expected = the bug; "No equipment" placeholder in the "No." regex is not the No. column
  assert.deepEqual(ids('### TC-6 x\n1. Open Edit Plan and click Save. -> Start Date stays one day earlier than before (day earlier).', 'ETM-8361'), []);
  assert.deepEqual(ids('### TC-7 x\n1. Export the plan (.xlsx). -> Opened.\n2. Look at the empty header row. -> `No equipment assigned.` center of the merged row.', 'ETM-7869'), []);
});
test('ETM-7899/7350 set: signature fixes from the first draft (read by hand)', () => {
  // ETM-8433: the draft never says "filter" inside the case, only "Expand `Work Header`" (TC-008 of the 2026-11-25 draft)
  assert.deepEqual(ids('### TC-008 x\nPrecondition: common\n1. Expand `Work Header`. -> The options are listed in the Master Data sequence.', 'ETM-8433'), ['TC-008']);
  // ETM-8295: "move the End Date to a date inside an earlier week" is a shortening (TC-033)
  assert.deepEqual(ids('### TC-033 x\nPrecondition: a note in the last week\n2. Edit Plan, move the End Date of the last activity to a date inside an earlier week, click `Save`. -> Edit Plan saves.\n5. (Check) Go back and extend the dates to the old End Date. -> The deleted note does not come back; the week cell is empty.', 'ETM-8295'), ['TC-033']);
  // ETM-8361: "End Date ... inside the same week" is not a check that the dates did not move (TC-034)
  assert.deepEqual(ids('### TC-034 x\n1. In Edit Plan, change the last End Date by a few days inside the same week, click `Save`. -> Save completes; no warning.\n2. Open the Timeline. -> The grid End week is the same; the note in that week is still there.', 'ETM-8361'), []);
});
test('ETM-7350 set: wording of the check-5 fix round (read by hand)', () => {
  // ETM-8328: Actual typed back after the shrink, note must not return (TC-036 steps 2 and 6)
  assert.deepEqual(ids('### TC-036 x\nPrecondition: a note in the outer week\n2. Delete the Actual (%) of that outer week and click `Update Progress`. -> The progress saves.\n6. (Undo) Type the deleted Actual (%) value back in that outer week and click `Update Progress`. -> The outer week shows again; the deleted note does not come back; its cell is empty.', 'ETM-8328'), ['TC-036']);
  // ETM-8361: every untouched activity date equals the recorded value after Save (TC-052 step 3)
  assert.deepEqual(ids('### TC-052 x\n2. In Edit Plan move only the End Date of the last activity to an earlier week, click `Save`. -> Edit Plan saves.\n3. Reload the Edit Plan page. -> Every other activity date equals the recorded value; no date moved by a day.', 'ETM-8361'), ['TC-052']);
});

// Fifth set: ETM-7900 (Shutdown Logic PDF timeframe), ETM-7349 (Timeline progress), ETM-7351 (Equipment Mob Plan paste), ETM-7310 (Add Equipment)
const set5 = {
  'ETM-8398': ['### TC-1 Export closes the drawer\n1. Open the Export drawer, pick PDF File > Daily Plan > Focus Timeframe. -> Selected.\n2. Click `Export`. -> The drawer closes at once; the file downloads.',
               '### TC-1 Cancel closes the drawer\n1. Open the Export drawer, pick Focus Timeframe. -> Selected.\n2. Click `Cancel`. -> The Export drawer closes.'],
  'ETM-8513': ['### TC-1 Daily Plan parent rows\n1. Export PDF File > Daily Plan > Full Shutdown Timeframe for a plan where Work Header `Modification` has no task active on Day 3. -> PDFs download.\n2. Open the Day 3 PDF. -> The `Modification` Work Header row and its Platform row are hidden.',
               '### TC-1 Daily Plan rows\n1. Export PDF File > Daily Plan > Full Shutdown Timeframe. -> PDFs download.\n2. Open the Day 3 PDF. -> Tasks active on Day 3 show with their Work Header and Platform rows.'],
  'ETM-8370': ['### TC-1 Status on Edit Plan\n1. Set one Activity to Close on the Timeline and click `Update Progress`. -> Saved.\n2. Click `Edit Plan` and look at Status. -> Status pills show `Open` / `Close` (same text as the Timeline), read-only.',
               '### TC-1 Status on Edit Plan\n1. Click `Edit Plan`. -> Edit Plan opens.\n2. Click a Status pill. -> Nothing opens; Status is read-only.'],
  'ETM-8403': ['### TC-1 Actual over 100\n1. Type actuals so Total Progress Actual (%) is 105.0. -> The total cell turns red; Update Progress disabled.\n2. Hover the red total cell. -> Tooltip `The overall progress must not exceed 100%.` in red.',
               '### TC-1 Actual over 100\n1. Type actuals so Total Progress Actual (%) is 105.0. -> The total cell turns red; `Update Progress` is disabled.'],
  'ETM-7951': ['### TC-1 Date order on paste\n1. Paste `10 Jan 2026` into Material Ready at SKL of row 1. -> Kept.\n2. Paste `05 Jan 2026` into Require at Offshore (earlier than Material Ready). -> The Require at Offshore cell is cleared to blank and the Paste Validation Failed modal shows once.',
               '### TC-1 Date format on paste\n1. Paste `abc` into Require at Offshore of row 1. -> The cell is cleared to blank and the Paste Validation Failed modal shows.'],
  'ETM-7979': ['### TC-1 Empty paste into mandatory\n1. Copy an empty cell from Excel and paste it into Contact Person of row 1. -> The Paste Validation Failed modal shows; the cell is blank with a red background; Save is disabled.',
               '### TC-1 Invalid paste into mandatory\n1. Paste `abc` into Width (m) of row 1. -> The Paste Validation Failed modal shows; the cell is cleared to blank with a red background.'],
  'ETM-7860': ['### TC-1 WIN# free text\n1. In WIN# No. (CCU No.) type `CCU@12 #-9` and press Enter. -> The value is kept exactly as typed.',
               '### TC-1 WIN# max length\n1. In WIN# No. (CCU No.) type 101 characters and press Enter. -> Only 100 characters are kept.'],
  'ETM-7846': ['### TC-1 Popup while scrolling\n1. Open the Deck dropdown of row 1. -> The list opens under the cell.\n2. Scroll the table horizontally to the right. -> The list moves with its cell or closes; it does not float over other columns.',
               '### TC-1 Dropdown in last row\n1. Scroll down to the last row and open its Deck dropdown. -> The list opens and all options can be chosen.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(set5)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('fifth set: cases that expect the bug are not counted', () => {
  assert.deepEqual(ids('### TC-1 x\n2. Click `Export`. -> The file downloads; the drawer stays open until Cancel.', 'ETM-8398'), []);
  assert.deepEqual(ids('### TC-1 x\n1. In WIN# No. (CCU No.) type `CCU@12`. -> The `@` is removed; `CCU12` kept.', 'ETM-7860'), []);
  assert.deepEqual(ids('### TC-1 x\n1. Hover the red Total Actual (%) cell. -> Tooltip `The overall actual progress must not exceed 100%.`', 'ETM-8403'), []);
});
test('fifth set: signature fixes from the first drafts (read by hand)', () => {
  // ETM-8513: setup lives in the Precondition, the step names the header only as "W2" (TC-013 of the ETM-7900 first draft)
  assert.deepEqual(ids('### TC-013 Verify a WBS parent row shows only when a child is active on D\nPrecondition: common; Work Header W1 has children active on D, Work Header W2 has children only on other days.\n1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.\n2. Open the PDF for date D. -> W1 and its active children are listed.\n3. Look for W2. -> W2 is not listed and none of its children are.', 'ETM-8513'), ['TC-013']);
  assert.deepEqual(ids('### TC-013 x\nPrecondition: Work Header W2 has children only on other days.\n1. Export Daily Plan PDF. -> Done.\n2. Look for W2. -> W2 is listed with its children.', 'ETM-8513'), []);
});

const set6 = {
  'ETM-6888': ['### TC-1 Constraint Type names\n1. Set Constraint Type `Must start on` on WB row 3 and Save. -> Saved.\n2. Export Excel and read column BN of row 3. -> BN shows `Must start on` (full name).',
               '### TC-1 Constraint Type default\n1. Export Excel and read column BN of a row with no constraint. -> BN shows `None`.'],
  'ETM-6889': ['### TC-1 Constraint Date value\n1. Set Constraint Date 21 May 2026, 06:00 on WB row 3 and Save. -> Saved.\n2. Export Excel and read column BO of row 3. -> BO shows `21 May 2026, 06:00`, the same as set on screen.',
               '### TC-1 Constraint Date format\n1. Export Excel and read column BO of a row with a constraint. -> BO uses the format dd Mmm yyyy, hh:mm.'],
  'ETM-6890': ['### TC-1 Hot Bed\n1. Export Excel and read column L of Work row 3 (Hot Bed off). -> Column L shows `No`.',
               '### TC-1 Hot Bed\n1. Export Excel and read column L of Work row 3. -> Column L is filled.'],
  'ETM-6871': ['### TC-1 Shift names\n1. Export Excel and read column BQ of a WB row with two shifts. -> BQ lists the shift names in the same order as shown on screen, comma separated.',
               '### TC-1 Shift names\n1. Export Excel and read column BQ of a WB row with two shifts. -> BQ lists both shift names, comma separated.'],
  'ETM-6907': ['### TC-1 SIMOP Prohibit\n1. Give WB 7 and WB 10 the same time, the same Working Location and Work Conflicted pair marked P in the matrix; Save. -> Saved.\n2. Export Excel and read column R of WB 7. -> R shows `Prohibit` in red, as the matrix conflict gives.',
               '### TC-1 SIMOP colour\n1. Set SIMOP of WB 7 to Prohibit with Override Conflict and Save. -> Saved.\n2. Export Excel and read column R of WB 7. -> R shows `Prohibit` in red; work conflicted override kept.'],
  'ETM-7300': ['### TC-1 Sent setting\n1. Open Optimization Setting and uncheck `Fix Maximum Duration`, check `Fix Resource Capacity`. -> Changed.\n2. Run Optimize, then click `View Detail`. -> Optimization Setting shows the changed Hard Constraint (Fix Resource Capacity on).',
               '### TC-1 Setting shown\n1. Run Optimize, then click `View Detail`. -> Optimization Setting section is shown.'],
  'ETM-7316': ['### TC-1 Summary dates\n1. Run Optimize, click `View Detail`. -> Summary opens.\n2. Read Schedule Start and Schedule End. -> They equal the earliest task start and the latest task finish on the Gantt.',
               '### TC-1 Summary dates\n1. Run Optimize, click `View Detail`. -> Summary shows Duration, Gap, Schedule Start and Schedule End.'],
  'ETM-7328': ['### TC-1 Default tab\n1. Click `View Diagnosis`, then the `Optimization Setting` tab. -> Settings shown.\n2. Click Back, then `View Diagnosis` again. -> The panel opens on the Diagnosis tab.',
               '### TC-1 Default tab\n1. Click `View Diagnosis`. -> The panel opens on the Diagnosis tab.'],
  'ETM-7565': ['### TC-1 Saved result\n1. Run Optimize, then click Save and confirm. -> Saved.\n2. Refresh the page. -> The optimized Start / End dates are still shown.',
               '### TC-1 Unsaved result\n1. Run Optimize, then click Save. -> Saved.\n2. Run Optimize again and refresh without saving. -> The unsaved result is gone.'],
  'ETM-7450': ['### TC-1 Blank mandatory\n1. Import a file with Action C5 left blank. -> Invalid Detail lists only "This field is mandatory." for C5 (one error).',
               '### TC-1 Blank mandatory\n1. Import a file with Action C5 left blank. -> Invalid Detail shows "This field is mandatory." for C5.'],
  'ETM-7456': ['### TC-1 Text in Duration\n1. Import a file with `abc` in Duration W6. -> Only the input format error is listed for W6.',
               '### TC-1 Text in Duration\n1. Import a file with `abc` in Duration W6. -> The input format error is listed for W6.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(set6)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('sixth set: signature fixes from the first drafts (read by hand)', () => {
  // ETM-6538 first draft TC-023: expected values in a table, the step says "They equal the table"
  const tc023 = '### TC-023 Constraint values\nPrecondition: the `Must start on` row has the date `02 Jan 2025, 15:30`.\n1. Click `Export` and open the sheet. -> The sheet opens.\n2. Read columns BN and BO of each row. -> They equal the table.\n\n| Constraint Type in the app | BN | BO |\n|---|---|---|\n| Must start on | `Must start on` | `02 Jan 2025, 15:30` |';
  assert.deepEqual(ids(tc023, 'ETM-6888'), ['TC-023']);
  assert.deepEqual(ids(tc023, 'ETM-6889'), ['TC-023']);
  // format-only table, and "bo" inside other words ("both", "bold"), do not count
  assert.deepEqual(ids('### TC-1 x\n1. Export Excel. -> Opens.\n2. Read BO of each row. -> They equal the table.\n\n| Must start on | `dd Mmm yyyy, hh:mm` |', 'ETM-6889'), []);
  assert.deepEqual(ids('### TC-1 x\n1. Export with filter and search both off. -> Row count equals the saved count (same file content).', 'ETM-6889'), []);
});
test('sixth set: a failed run saved and reloaded is not ETM-7565', () => {
  // ETM-6373 fix-round TC-004 step 7: expects the dates from before the run, which is what the bug shows
  assert.deepEqual(ids('### TC-004 Failed run\n6. Click `Save`. -> Saved.\n7. Reload the page. -> The plan shows the same task dates and times as before the run, with no day shift.', 'ETM-7565'), []);
});

const set7 = {
  'ETM-8470': ['### TC-1 Edits survive a size change\n1. Edit the Activity text of task 2 to `QA edited` and drag task 1 to position 3. -> Shown.\n2. Change Shutdown Size to Medium SD and confirm. -> Dates recalculated.\n3. Look at task 2 and the order. -> The edited Activity text and the dragged order are kept.',
               '### TC-1 Size change recalculates\n1. Change Shutdown Size to Medium SD and confirm. -> Start and End Dates of default tasks are recalculated.'],
  'ETM-8471': ['### TC-1 Deleted items come back at the bottom\n1. Delete task `Estimate Manpower` and confirm. -> Removed.\n2. Change Shutdown Size and confirm. -> Recalculated.\n3. Look at the group. -> `Estimate Manpower` is back as the last task of its group.',
               '### TC-1 Deleted items come back\n1. Delete task `Estimate Manpower` and confirm. -> Removed.\n2. Change Shutdown Size and confirm. -> `Estimate Manpower` is back in its group.'],
  'ETM-8490': ['### TC-1 Total not 100\n1. Add a custom activity with Plan (%) 5.0 and change Shutdown Size. -> Total Plan (%) is 105.0, red.\n2. Hover the red Total Plan (%) cell. -> Tooltip `Overall planned progress must equal 100%.`',
               '### TC-1 Total not 100\n1. Add a custom activity with Plan (%) 5.0 and change Shutdown Size. -> The Total Plan (%) cell is red and Save is disabled.'],
  'ETM-7272': ['### TC-1 Work order\n1. Note the Work order on the Worklist page and click Export. -> File downloads.\n2. Read the Work rows of the file. -> The Work rows are in the same order as the Worklist page.',
               '### TC-1 Breakdowns follow their Work\n1. Click Export and read the rows. -> Each Work row is followed by its Work Breakdown rows.'],
  'ETM-7281': ['### TC-1 Dropdowns on a large export\n1. Export a plan with 3,500 rows and open the file. -> Opens.\n2. Click the Priority cell of the last data row. -> The dropdown list is there, the same as on row 4.',
               '### TC-1 Dropdowns kept\n1. Export and open the file. -> Opens.\n2. Click the Priority cell of row 4. -> The dropdown list opens.'],
  'ETM-7294': ['### TC-1 Same active-cell look\n1. Click one cell on Shutdown Logic, Create Work, Edit Work Breakdown and Manpower Mob Plan. -> The selected cell has the same border and background on every page.',
               '### TC-1 Active cell\n1. Click one cell on Create Work. -> The cell is selected.'],
  'ETM-7352': ['### TC-1 PDF shows the tasks\n1. Export Current Execution Date and open the PDF. -> Opens.\n2. Look at the Gantt pages. -> Every task row and bar of the Daily Report page is listed in the PDF.',
               '### TC-1 PDF headers\n1. Export Current Execution Date and open the PDF. -> The Gantt header row has background #E3EFF3.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(set7)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('seventh set: column-header order is not the Work order (ETM-7272)', () => {
  assert.deepEqual(ids('### TC-005 Template\n3. Open `Worklist_Data`. -> The column headers are the same as in the Import template V2 (same names and same order).', 'ETM-7272'), []);
});
test('seventh set: "Key Activities" in a precondition is not a task row (ETM-7352)', () => {
  assert.deepEqual(ids('### TC-010 Strange text\nPrecondition: values typed in Key Activities and Note; each one on separate rows.\n2. Check each field in the PDF. -> Every value is shown exactly as on screen.', 'ETM-7352'), []);
});

// Manpower Mob Plan set (ETM-5614 / 5615 / 6378), read-only screens for the planner
const setMmp = {
  'ETM-6366': ['### TC-1 Collapse Reservation\n1. Click the chevron of the `Reservation` group header. -> The group collapses; only `Dlog Status` stays visible, `Booking No.` is hidden.',
               '### TC-1 Collapse Reservation\n1. Click the chevron of the `Reservation` group header. -> The group collapses to one column.'],
  'ETM-6852': ['### TC-1 Empty Resource\nPrecondition: Resource `Production` has no personnel.\n1. Look under the `Production` category row. -> A placeholder row shows `No personnel assigned`.',
               '### TC-1 Empty Resource\nPrecondition: Resource `Production` has no personnel.\n1. Look under the `Production` category row. -> A placeholder row is shown.'],
  'ETM-6664': ['### TC-1 Filter to nothing\n1. Open the Filter Panel, expand `Company` and untick `Select All`. -> 0 selected.\n2. Look at the grid. -> The empty state `No data available.` is shown.',
               '### TC-1 Filter to nothing\n1. Open the Filter Panel, expand `Company` and untick `Select All`. -> The grid shows no personnel rows.'],
  'ETM-6666': ['### TC-1 Mob Date picker\n1. Open the Filter Panel, expand `Mob Date` and click the date input. -> The calendar opens on the month of the first schedule day (earliest Task Start - 7 days), not the current month.',
               '### TC-1 Mob Date picker\n1. Open the Filter Panel, expand `Mob Date` and click the date input. -> A calendar opens.\n2. Pick a date. -> Rows with that Mob Date are shown.'],
  'ETM-6634': ['### TC-1 Name options order\nPrecondition: names `Apple`, `apple`, `BANANA`, `banana`.\n1. Open the Filter Panel and expand `Name`. -> Options are in A-Z dictionary order, upper and lower case mixed (`apple` next to `Apple`).',
               '### TC-1 Name search\n1. Open the Filter Panel and type `APP` in the Name search. -> `Apple` and `apple` show (search ignores case, list order A-Z).'],
  'ETM-6765': ['### TC-1 Table under chart\n1. Look at the POB Chart and the Data Table below. -> Each table date column lines up directly under the same date on the chart X-axis.',
               '### TC-1 Scroll\n1. Scroll the POB Chart sideways. -> The Data Table scrolls with it.'],
  'ETM-6772': ['### TC-1 Ten graphs\nPrecondition: the POB Chart has 10 graphs (maximum of 10).\n1. Look at `Add Data`. -> It is disabled (greyed out).',
               '### TC-1 Ten graphs\nPrecondition: the POB Chart has 10 graphs (maximum of 10).\n1. Look at the legend. -> 10 entries.'],
  'ETM-6774': ['### TC-1 Tooltip with 10 graphs\nPrecondition: 10 graphs ticked.\n1. Hover a date low in the chart. -> The tooltip is fully visible with one line per ticked graph.',
               '### TC-1 Tooltip\nPrecondition: 2 graphs ticked.\n1. Hover a date. -> The tooltip shows the values.'],
};
for (const [d, [hitTxt, nearTxt]] of Object.entries(setMmp)) {
  test(`${d}: the right case is caught, a near miss is not`, () => {
    assert.deepEqual(ids(hitTxt, d), ['TC-1']);
    assert.deepEqual(ids(nearTxt, d), []);
  });
}
test('Manpower Mob Plan set: cases that expect the bug are not counted', () => {
  assert.deepEqual(ids('### TC-1 x\nPrecondition: Resource `Production` has personnel.\n1. Look under `Production`. -> `No personnel assigned` is not shown.', 'ETM-6852'), []);
  assert.deepEqual(ids('### TC-1 x\n1. Untick every Company option in the filter. -> `No data found matching your filter.` is shown.', 'ETM-6664'), []);
  assert.deepEqual(ids('### TC-1 x\nPrecondition: 10 graphs.\n1. Hover a date. -> The legend lists every graph.', 'ETM-6774'), []);
});
test('seventh set: "change to another size" counts as the size change (ETM-8470 / ETM-8471)', () => {
  assert.deepEqual(ids('### TC-023 Text kept\n1. Change the Action By of row 18 to `Offshore team A` (edited text). -> Shown.\n3. Confirm a change to another size. -> Applied.\n4. Read the Activity, Action By and Focal Point of row 18. -> The cells still show `Offshore team A`.', 'ETM-8470'), ['TC-023']);
  assert.deepEqual(ids('### TC-027 Deleted task back\n1. Click the trash icon on row 18. -> The row is removed.\n2. Confirm a change to Medium SD. -> Applied.\n3. Look at the group. -> Row 18 is shown again as the last task of the group.', 'ETM-8471'), ['TC-027']);
});
test('Manpower Mob Plan set: signature fixes from the first ETM-5614 draft (read by hand)', () => {
  // TC-010 step 4 says "chevron", not "collapse"; TC-026 names a category (`Scaffolder`), not the word "resource"
  assert.deepEqual(ids('### TC-010 Collapse each group\n4. Click the chevron of the `Reservation` group. -> Only `Dlog Status` stays; `Booking No.` is hidden.', 'ETM-6366'), ['TC-010']);
  assert.deepEqual(ids('### TC-026 [FE][MT] Verify "No personnel assigned" placeholder (POS) [Auto]\nPrecondition: common; snapshotted `Scaffolder` with no personnel\n1. Look under `Scaffolder`. -> The `Required Manpower` row is shown and the row `No personnel assigned` is directly beneath it.', 'ETM-6852'), ['TC-026']);
});
test('seventh set: "Look at ... same line" is not a style check (ETM-7294)', () => {
  assert.deepEqual(ids('### TC-055 Two panels\n1. Click a cell and scroll. -> Scrolls.\n2. Look at the daily schedule beside the table. -> Each schedule row is on the same line as its personnel row.', 'ETM-7294'), []);
});
test('Manpower Mob Plan set: the Filter Panel is often called "the Panel" (ETM-5615 first draft, read by hand)', () => {
  assert.deepEqual(ids('### TC-022 [FE][MT] Verify unchecking everything gives zero rows and the empty message (NEG) [Auto]\n1. Open `Name` and uncheck `Select All`. -> No checkbox is checked.\n2. Look at the grid. -> No personnel rows are shown in the left table and right schedule; the grid shows `No data available`.', 'ETM-6664'), ['TC-022']);
  assert.deepEqual(ids('### TC-015 [FE][MT] Verify free-text sections list distinct values sorted A-Z (POS) [Auto]\nPrecondition: common; the plan has values such as `Crew 2`, `Crew 10`, `crew 3`, `Crew 3` in the text fields\n1. Open the Panel and expand `Name`. -> The names are listed once each, A-Z dictionary style.\n7. Expand `Booking No.`. -> Distinct, A-Z; the order is compared with the dictionary rule in the Story (case variants next to each other, not split).', 'ETM-6634'), ['TC-015']);
});

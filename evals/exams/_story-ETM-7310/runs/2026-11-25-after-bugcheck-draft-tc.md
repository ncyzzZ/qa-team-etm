# Draft test cases - ETM-7310 Equipment Mob Plan - Add Equipment

Story: ETM-7310 (frozen description, no comments). Source: story.md, docs/modules/equipment-mob-plan-validation.md, equipment-mob-plan-figma.md, knowledge/. No analyst.md or inspector.md in this exam run: AC ids below are numbered from the Story's own list (AC-1.1 = item 1.1 of the Acceptance Criteria; AC-3.x = rows of the field table, named in the map). Existing [QA] subtasks: none known.

Common precondition: Turnaround Manager (TM) is logged in, with the Edit Equipment Mob Plan permission, and is on the Equipment Mob Plan page of a plan with these Work Headers in this order: `Operation` (equipment `Pump`, `Crane`), `Scaffolding` (equipment `Tube set`, `Clamp box`), `Electrical and Instrument (PM)` (shows `No equipment added.`). The Story's Pre-Conditions say TM or JO; module notes say JO is view only (see Open questions).
Notation: `->` separates action and expected result. Mandatory fields: Material Description, WIN# No. (CCU No.), Contact Person, Width (m), Length (m), Height (m), Gross Wt. (Tons).

## Think like the user (3 lines)
- Who: a Turnaround Manager or Job Owner preparing the equipment list for a shutdown, many rows in one sitting, often pasting from Excel, often on a long table with several Work Headers.
- Wants: add a row fast under the right header, fill 25 columns, and get a correct No., Area and date order without a pop-up.
- Careless user: clicks Add Equipment twice, leaves a row half filled, clicks outside, types minus signs, pastes 3.456, picks dates in the wrong order, closes the tab with unsaved rows.

## Coverage map
| Requirement / screen state | Technique | Risk | Planned cases |
| --- | --- | --- | --- |
| AC-1.1 Add Equipment button on every Work Header row | Screen state | Button missing on empty or collapsed header | TC-002, TC-004 |
| AC-1.2 Expand collapsed header, empty row inserted below header or last item, no modal | State change | Row hidden inside collapsed header; wrong position; modal opens | TC-002, TC-003 |
| AC-1.3 No toast | Error guessing | Toast shown by mistake | TC-002 |
| AC-1.4 `No equipment added.` replaced | Screen state (empty) | Placeholder stays beside new row; comes back after row deleted | TC-004, TC-024 |
| AC-2.1 Header order (Master Data sequence, manual headers at bottom) | Linked data | Add Equipment changes header order | TC-005 |
| AC-2.2 New row at bottom of its header, order of addition kept | Error guessing | Row goes to top or to another header | TC-003, TC-006 |
| AC-2.3 Continuous No. across headers, skip header and placeholder rows, re-index | Boundary (first, middle, last header) | Number restarts per header; header gets a number; later rows not re-indexed | TC-007, TC-008 |
| AC-3.1 No. read-only | Field interaction | User can type in No. | TC-007 |
| AC-3.2 Text fields and max lengths (Material Description 250, WIN# 100, Contact Person 150, Department 100, Item No. 100, MMR No. 30, Vessel Name 100, Remark 500) | Boundary, strange input | Limit off by one; strange characters break the row | TC-009, TC-010, TC-011 |
| AC-3.3 Mandatory text fields cannot be blank | Input groups | Blank or spaces only accepted | TC-017, TC-018 |
| AC-3.4 Width, Length, Height, Gross Wt. rules (blocked minus, blocked 3rd decimal, paste rounds to 2, <=0 or empty red) | Boundary, matrix | Negative saved; rounding wrong; pop-up shown | TC-012, TC-013, TC-014 |
| AC-3.5 Area = Width x Length, read-only, 2 decimals, half-up | Decision table | Wrong rounding; Height used; Area editable; stale after edit | TC-015, TC-016 |
| AC-3.6 Dropdowns: Premob Inspection, Platform, Transportation, Priority, Status (lists exactly as written) | Input groups | Missing or extra option | TC-019, TC-020 |
| AC-3.7 Deck combo-box with free text | Equivalence | Custom text rejected or Deck master list differs | TC-021 |
| AC-3.8 Date pickers, format `DD Mon YYYY` | Field interaction | Wrong format; close without pick changes value | TC-022 |
| AC-3.9 Action column delete icon | Screen state | Icon missing; delete leaves wrong numbering | TC-024 |
| AC-4.1 Click outside or Enter with all mandatory valid becomes saved draft | State change | Row not accepted, or accepted with bad value | TC-017 |
| AC-4.2 Missing mandatory: red border, focus on first invalid field | State change, keyboard | Focus on wrong field; row lost | TC-018 |
| AC-4.3 Date order SKL <= Offshore <= Backload, equal allowed, Loading at PSB free, calendar blocks | Boundary, decision table | Equal dates rejected; earlier dates selectable; Loading at PSB constrained | TC-022, TC-023 |
| AC-4.4 Paste of conflicting dates: rejected, cleared, `Paste Validation Failed`, no red | Strange input | Conflicting date kept (rule owned by ETM-7351, only the link is checked here) | TC-025 |
| AC-5.1 Add again: appended, continuous No., re-index | Boundary | Second click replaces first row; double click adds two empty rows | TC-006, TC-026 |
| AC-5.2 Save button enabled (dirty) | Unsaved changes | Save stays grey; stays blue after undo; no warning on leave | TC-027, TC-028 |
| AC-6.1 Isolation from Worklist and Shutdown Logic | Linked data (lesson 6, 8) | Added row changes other modules | TC-029 |
| Permission (Edit Equipment Mob Plan) | Roles | Button visible without permission | TC-001 |
| Save then Refresh keeps values | Field interaction | Date day shift; values lost | TC-030 |
| Leave page with new rows | Leaving and coming back | No `Unsaved Change` pop-up | TC-028 |
| Two users on same plan | Lesson 1 | Overwrite without notice | TC-031 |

Categories (lessons-learned 1-9 and L-1 to L-8):
1 Two users: relevant (TC-031). 2 Filter + Sort + Search: not relevant for this Story (Add Equipment does not change filters); one check that a row added while a filter is on is not hidden is asked in Open questions. 3 Old data after migrations: not relevant, the Story adds new rows only. 4 Strange input: relevant (TC-011). 5 Reordering: not relevant, no reorder in this Story; renumbering covered in TC-007/008. 6 Linked data: relevant (TC-029, TC-024). 7 Charts: not relevant, no chart. 8 Same data on many pages: relevant (TC-029, TC-030). 9 Matrix: relevant (TC-009, TC-012, TC-015, TC-019, TC-022 use expected-values tables). L-1 text sort: not relevant, no sort here. L-2 filter choice kept: not relevant. L-3 wait for response: applies to TC-030 (wait for save response before reading). L-4 multi-row paste: relevant (TC-013, TC-025, one cell only; multi-row paste is not in this Story, see Open questions). L-5 collapse/expand: relevant (TC-002). L-6 case variants: not relevant, Equipment has no uniqueness rule in this Story. L-7 selected state: relevant to dropdown/date picker current value (TC-019, TC-022). L-8 Story text changed: the exam Story is frozen, compare with the changelog before a real run.
Techniques not used: Leaving and coming back by browser Back is covered by TC-028 only.

Counts: High 26 / Medium 14 / Low 3. Auto 35 / Partial 6 / Manual 3 (TC-005, 020, 025, 028, 033, 039 Partial; TC-010, 023, 031 Manual).
Priority comes from damage (Story has none).

## Fixes after bug-check (this round)
TC-006, TC-013, TC-022, TC-024 and TC-029 corrected; TC-032 to TC-043 added for the MISSING rows. Rows not turned into cases are in Open questions 13 to 19.

## Open questions
1. Roles: Pre-Conditions say TM or JO may add equipment, module notes say only TM can add or edit and JO only views the Active plan. Which is right? TC-001 expects JO cannot add until answered.
2. Is `Height (m)` part of Area? AC says Area = Width x Length only (example 1.25 x 3.10 = 3.88); Height is mandatory but not used. Written as in the Story (TC-015).
3. Example 1.25 x 3.10 = 3.875, shown 3.88 (half-up). Is Area computed from the typed values or from values already rounded to 2 decimals? Matters for 1.005 x 1.005 style inputs (TC-016 asks the user's view: rounded of the two shown values).
4. Does clicking outside the row with all fields empty (a fresh empty row, nothing typed) keep the row, remove it, or show red borders? Story only covers "missing mandatory". TC-018 expects red borders and the row kept.
5. When Material Ready at SKL is changed to a later date than an existing Require at Offshore, the calendar blocks it; but what happens to dates typed or pasted, not picked? Is there a keyboard-typed date path at all?
6. Does the Equipment `Status` dropdown or `Priority` have a default value on a new row, or blank?
7. Delete (bin icon): Story only names the icon. Is there a confirm? Figma notes say the bin removes the row at once. TC-024 follows Figma notes (no confirm) and needs BA confirmation.
8. Does the new row's number show while the row is still being edited (before click outside)? TC-007 expects yes, as the Story says it is assigned when added.
9. Platform list: "every platform under the current shutdown asset": is it only active platforms (Data Source says active Asset platforms)? TC-020 expects active platforms only.
10. Row added while a column filter hides it: does it show? (not in Story)
11. Suggestion (not in Story): multi-row paste from Excel into a new row; Ctrl+Z inside a cell; max count of equipment rows per header.
12. What does Enter do in a Dropdown or Date Picker cell (confirm the row or open the list)? AC-4.1 says Enter validates the row.
13. Pasting a negative number (`-1.5`) in Width, Length, Height or Gross Wt.: kept, emptied or red? Story only blocks typing the minus sign. Not asserted in TC-013.
14. After the only change is undone by the trash icon, is Save grey? Written as grey (nothing to save), BA to confirm.
15. Area from typed or already rounded values (`1.005` x `1.005`): the case needs the BA answer first, so no case is written (extends question 3).
16. Platform and Deck lists after the master data changes (platform added or changed in Event Details, Working Location master edited) while the page is open: refreshed on reload only, or live? Not in Story.
17. Someone else deletes the Work Header or the plan while the page is open and the user clicks Save: message not in Story.
18. Do large numbers (Area, Gross Wt.) use a thousand separator? Not in Story; TC-037 only compares with the other number columns.
19. Suggestion (not in Story): header collapse state kept after reload.

## Test cases (43 flows)

### TC-001 [FE][MT] Verify the Add Equipment button follows the Edit Equipment Mob Plan permission (NEG) [Auto]
Precondition: common; a second user without the Edit Equipment Mob Plan permission (JO) has an Active plan.
Priority: High
Trace: AC-1.1
1. Open the Equipment Mob Plan page as the TM. -> Every Work Header row shows the text button `+ Add Equipment`.
2. Log out and log in as JO, then open the same plan. -> The page opens in view mode.
3. Look at the Work Header rows. -> `+ Add Equipment` is not shown or is disabled, and no editable row can be created.
4. Try the page again by direct link without logging in as a permitted user. -> The system does not give edit access.
Automation: Starting data: plan with 3 Work Headers, accounts TM and JO. Check: button visible for TM, not usable for JO. Data set: role table (TM, JO). Clean up: none. Reason: Automate, runs every release and a permission leak is High damage.

### TC-002 [FE][MT] Verify clicking Add Equipment on a collapsed Work Header expands it and inserts an empty row without modal or toast (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.1, AC-1.2, AC-1.3
1. Collapse the `Scaffolding` Work Header. -> Its equipment rows `Tube set` and `Clamp box` are hidden.
2. Click `+ Add Equipment` on `Scaffolding`. -> The Work Header expands; no modal opens.
3. Look at the rows under `Scaffolding`. -> An empty editable row shows below `Clamp box`, with grey placeholders `Material Description`, `Contact Person`, `Width (m)`.
4. Look at the top and bottom of the page. -> No toast notification appears.
5. Click `-` (collapse) and `+` (expand) on `Scaffolding`. -> The new empty row hides and shows together with the other rows of that header.
Automation: Starting data: header with 2 equipment rows, collapsed. Check: dialog count 0, toast count 0, row count +1. Clean up: delete the added row or reload without saving. Reason: Automate, stable result.

### TC-003 [FE][MT] Verify the new row is inserted at the bottom of its own Work Header (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.2, AC-2.2
1. Click `+ Add Equipment` on `Operation`. -> One empty row shows below `Crane`, the last equipment of `Operation`.
2. Look at the `Scaffolding` banner row. -> It sits directly below the new row; `Tube set` and `Clamp box` are unchanged.
3. Click `+ Add Equipment` on `Scaffolding`. -> One empty row shows below `Clamp box`, not under `Operation`.
Automation: Check: position of new row by row order. Clean up: reload, discard.

### TC-004 [FE][MT] Verify the placeholder `No equipment added.` is replaced by the first new row (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.1, AC-1.4
1. Look at `Electrical and Instrument (PM)`. -> It shows `No equipment added.` and a `+ Add Equipment` button.
2. Click `+ Add Equipment` on it. -> `No equipment added.` is gone; one empty editable row shows directly below the Work Header.
3. Click `+ Add Equipment` again on it. -> A second empty row shows below the first; the placeholder does not come back.
Automation: Clean up: reload, discard.

### TC-005 [FE][MT] Verify Work Header order does not change after adding equipment (POS) [Partial: order by Master Data sequence needs the master file]
Precondition: common; plan has also one manually added Work Header `Custom Header A` at the bottom.
Priority: Medium
Trace: AC-2.1
1. Write down the order of all Work Header names. -> The order is recorded: Worklist headers in Master Data order, then `Custom Header A` at the bottom.
2. Click `+ Add Equipment` on the first and then on the last Work Header. -> Two empty rows are added.
3. Compare the Work Header order with the record. -> The order is the same.
Automation: Automate steps 1 to 3 (compare lists); the Master Data order itself is checked by hand.

### TC-006 [FE][MT] Verify several rows added to one Work Header keep the order of addition (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.2, AC-5.1
1. Click `+ Add Equipment` on `Operation` and fill the new row with Material Description `Generator`. -> The row shows `Generator`.
2. Click `+ Add Equipment` on `Operation` again and fill Material Description `Compressor`. -> `Compressor` shows below `Generator`.
3. Click `+ Add Equipment` a third time and fill `Welding set`. -> `Welding set` shows below `Compressor`.
4. Read the order under `Operation`. -> `Pump`, `Crane`, `Generator`, `Compressor`, `Welding set`.
5. Click `Save`, then reload the page and read the order under `Operation` again. -> The order is still `Pump`, `Crane`, `Generator`, `Compressor`, `Welding set` (not sorted alphabetically); the No. values are continuous.
Automation: all other mandatory fields use valid data from TC-017. Clean up: reload, discard.

### TC-007 [FE][MT] Verify No. is a continuous number across Work Headers and read-only (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.3, AC-3.1
1. Read the `No.` column. -> `Pump` = 1, `Crane` = 2, `Tube set` = 3, `Clamp box` = 4; Work Header banners and `No equipment added.` have no number.
2. Click `+ Add Equipment` on `Scaffolding`. -> One empty row shows below `Clamp box`.
3. Read the `No.` column again. -> The new row (below `Clamp box`) shows `5`; numbers stay 1 to 5 in order from top to bottom.
4. Click the `No.` cell of the new row and try to type `9`. -> The cell cannot be edited; the number stays `5`.
Automation: Check: list of No. values equals 1..N. Clean up: reload, discard.

### TC-008 [FE][MT] Verify rows re-index when a row is added above other rows (BND) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.3
1. Click `+ Add Equipment` on `Operation`. -> A new row shows below `Crane` with No. `3`.
2. Read the numbers of `Tube set` and `Clamp box`. -> They changed to `4` and `5`.
3. Click `+ Add Equipment` on `Electrical and Instrument (PM)`. -> The new row shows No. `6`; `Tube set` and `Clamp box` stay `4` and `5`.
4. Click `+ Add Equipment` on `Operation` again. -> The new row shows `4`; the rows below move to `5`, `6`, `7`.
Automation: Check: No. column is continuous 1..N after each add.

### TC-009 [FE][MT] Verify the maximum length of every text field (BND) [Auto]
Precondition: common; one empty row added under `Operation`.
Priority: High
Trace: AC-3.2
1. Type a string of the maximum length in the field, then click outside the cell. -> The whole string is kept.
2. Type a string one character longer than the maximum. -> The input blocks or cuts the extra character; the field holds exactly the maximum.
3. Paste a string far longer (maximum + 100). -> The field holds exactly the maximum.
Expected values (the test loops over every row): Material Description 250 (mandatory); WIN# No. (CCU No.) 100 (mandatory); Contact Person 150 (mandatory); Department 100; Item No. in Plot Plan 100; MMR No. 30 (blocks or truncates); Vessel Name 100; Remark 500.
Automation: Test data set: the table above. Clean up: reload, discard.

### TC-010 [FE][MT] Verify the Story does not state what happens above the limit for text fields except MMR No. (NEG) [Manual: the expected behaviour (block or cut) is unclear, needs BA answer]
Precondition: common; one empty row.
Priority: Low
Trace: AC-3.2
1. Type 251 characters in Material Description. -> The field shows at most 250 characters (the 251st is not kept).
2. Click outside the row. -> The row keeps 250 characters, no red border on the filled field.

### TC-011 [FE][MT] Verify strange input is kept as typed in a text field (Exotic: strange input) [Auto]
Precondition: common; one empty row.
Priority: Medium
Trace: AC-3.2
1. Type the value in `Remark`, click outside, then read the cell. -> The value shows back exactly as typed, and the page does not break.
Expected values (the test loops over every row): `Pump 🔧🔧` (emoji); `ปั๊มน้ำ 泵 مضخة` (Thai, Chinese, Arabic); `A&B <b>x</b> "q" 'p' 50% a/b\c`; spaces before and after `  Pump  `; text with a new line; `   ` (spaces only in Remark, optional).
Automation: loop over the table in Remark and Department. Spaces only in a mandatory field is not accepted (checked in the mandatory-field case).

### TC-012 [FE][MT] Verify Width, Length, Height and Gross Wt. block minus sign and a third decimal (BND) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.4
1. Type the value into the field. -> The field shows the "Shown" column value (typed characters that break the rule are not accepted).
2. Click outside the cell. -> The cell keeps the shown value; no popover notification appears.
Expected values (the test loops over every row and over the 4 fields): `2.5` shows `2.5` then `2.50` after leaving; `2.55` shows `2.55`; `2.555` typed: the 3rd decimal is blocked, field shows `2.55`; `-2` typed: the minus sign is blocked, field shows `2`; `0` shows `0` with red border; `0.01` accepted; `abc` not accepted, field stays empty with red border.
Automation: Test data set: table above x 4 fields.

### TC-013 [FE][MT] Verify pasting a number with more than 2 decimals rounds to 2 decimals (BND) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.4
1. Copy the value from the "Pasted" column and paste into the field. -> The field shows the "Result" value.
Expected values (loop over Width, Length, Height, Gross Wt.): pasted `1.234` result `1.23`; `1.235` result `1.24`; `1.999` result `2.00`; `0.004` result `0.00` with red border (<= 0); `0.005` result `0.01`; every rounding row is checked on all 4 fields. Pasting a negative value is asked in Open question 13, not checked here.
Automation: Test data set: table above.

### TC-014 [FE][MT] Verify red border for zero or empty numeric fields without popover (NEG) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.4
1. Type `0` in `Width (m)`, then click outside the row. -> The `Width (m)` border turns red; no popover or toast shows.
2. Clear `Length (m)` (leave empty) and click outside the row. -> The `Length (m)` border turns red; no popover shows.
3. Type `5.20` in `Gross Wt. (Tons)` and `2.80` in `Height (m)`. -> No red border on these two fields.
4. Type `1` in `Width (m)`. -> The red border on `Width (m)` is gone.
Automation: Check: red border style on the field, popover count 0.

### TC-015 [FE][MT] Verify Area = Width x Length, read-only, 2 decimals, half-up (BND) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.5
1. Type Width and Length from the table. -> The `Area (m2)` cell shows the "Area" value.
2. Try to click and type in the `Area (m2)` cell. -> The cell is disabled and cannot be edited.
Expected values (the test loops over every row): Width 1.25, Length 3.10 -> `3.88` (3.875 rounded half-up); 2.00 x 4.00 -> `8.00`; 0.01 x 0.01 -> `0.00`; 99.99 x 99.99 -> `9998.00`; 0.50 x 0.50 -> `0.25`; Height 2.80 changed to 9.99 -> Area does not change.
Automation: Test data set: table above.

### TC-016 [FE][MT] Verify Area updates and clears when Width or Length changes (BND) [Auto]
Precondition: common; row with Width 2.00 and Length 4.00 (Area `8.00`).
Priority: Medium
Trace: AC-3.5
1. Change `Width (m)` to `3.00` and click outside the cell. -> `Area (m2)` shows `12.00`.
2. Change `Width (m)` back to `2.00`. -> `Area (m2)` shows `8.00`.
3. Clear `Length (m)`. -> `Area (m2)` shows no wrong number (empty or `0.00`; BA to confirm) and `Length (m)` has a red border.

### TC-017 [FE][MT] Verify a row with all mandatory fields valid becomes a saved draft on click outside and on Enter (POS) [Auto]
Precondition: common; two empty rows added under `Operation`.
Priority: High
Trace: AC-4.1, AC-3.3
1. In row A type Material Description `Generator`, WIN# `CCU-0001`, Contact Person `Somchai`, Width `2.50`, Length `4.00`, Height `2.80`, Gross Wt. `5.20`. -> All fields show the values, `Area (m2)` shows `10.00`.
2. Click outside the row. -> The row leaves edit state and shows as a saved draft; no red border.
3. In row B fill the same mandatory fields with different text and press `Enter` in the last field. -> Row B becomes a saved draft; no red border.
4. Click the `Save` button. -> A success toast shows (`Save Success` / `Save Equipment Mob Plan Successfully.`).
Automation: Clean up: delete rows made by the test (card-owned plan).

### TC-018 [FE][MT] Verify a missing mandatory field gives a red border and focus on the first invalid field (NEG) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.3, AC-4.2
1. Fill only Material Description `Generator` and Contact Person `Somchai`; leave WIN# and all sizes empty. -> The fields show the typed values.
2. Click outside the row. -> The empty `WIN# No. (CCU No.)`, `Width (m)`, `Length (m)`, `Height (m)` and `Gross Wt. (Tons)` borders turn red; the row does not become a saved draft.
3. Check where the cursor is. -> Focus is on `WIN# No. (CCU No.)`, the first invalid field from the left.
4. Type `   ` (spaces only) in `WIN# No. (CCU No.)` and press `Enter`. -> The field stays invalid with a red border (a blank value is not accepted).
5. Type `CCU-0002` in `WIN# No. (CCU No.)` and press `Enter`. -> The WIN# border returns to normal; focus moves to the next invalid field `Width (m)`.
Automation: Check: red border list and active element. Clean up: reload.

### TC-019 [FE][MT] Verify the list options of Premob Inspection, Transportation, Priority and Status (POS) [Auto]
Precondition: common; one empty row.
Priority: Medium
Trace: AC-3.6
1. Open the dropdown from the table. -> The list shows exactly the options below, in that order, no extra option.
2. Pick one option, click outside, then open the list again. -> The picked value shows in the cell and is marked as the current value in the list.
Expected values (the test loops over every row): Premob Inspection: `Yes`, `No`; Transportation: `Supply Vessel`, `Crew Boat`, `MSB`, `Helicopter`; Priority: `1`, `2`, `3`; Status: `Inspected`, `Delivered at PSB`, `MMR Issued`, `Vessel Assigned`, `In Transit`, `Received`, `Ready for Backload`, `Backloaded`, `Delay`, `Cancel`.
Automation: Test data set: table above.

### TC-020 [FE][MT] Verify the Platform dropdown lists the active platforms of the shutdown asset (POS) [Partial: expected list depends on master data of the event]
Precondition: common; the event's asset has known active platforms and at least one inactive platform.
Priority: Medium
Trace: AC-3.6
1. Open the `Platform` dropdown in a new row. -> The list shows every active platform of the current shutdown asset.
2. Look for the inactive platform and for a platform of another asset. -> Neither is in the list.
3. Open the dropdown in the last row of a long table after scrolling to the bottom. -> The list opens fully and can be used.

### TC-021 [FE][MT] Verify Deck accepts a master-list value and free text (POS) [Auto]
Precondition: common; one empty row.
Priority: Medium
Trace: AC-3.7
1. Open the `Deck` combo-box. -> The list is the same as the Working Location (Deck) master list.
2. Pick one value and click outside. -> The picked value shows in the cell.
3. Type `Temporary laydown area` and click outside. -> The typed text is kept in the cell.
4. Reopen the Deck cell. -> The typed text shows, and the master list is still available.

### TC-022 [FE][MT] Verify the date format, equal dates and the blocked days in the date pickers (BND) [Auto]
Precondition: common; one empty row.
Priority: High
Trace: AC-3.8, AC-4.3
1. Pick `10 Jan 2026` in `Material Ready at SKL`. -> The cell shows `10 Jan 2026`.
2. Open `Require at Offshore`. -> Days before `10 Jan 2026` are disabled and cannot be picked; no red background shows.
3. Pick `10 Jan 2026`. -> The cell shows `10 Jan 2026` (equal date accepted).
4. Open `Backload to SKL`. -> Days before `10 Jan 2026` are disabled.
5. Pick `20 Jan 2026`. -> The cell shows `20 Jan 2026`.
6. Open `Material Ready at SKL` again. -> Days after `10 Jan 2026` (the Require at Offshore date) are disabled.
7. Open `Loading at PSB` and pick `05 Jan 2026`. -> The date is accepted although it is before the other dates; no red background.
8. Open `Require at Offshore`, then close the calendar without picking. -> The old value `10 Jan 2026` stays.
9. Open `Require at Offshore` again. -> Days after `20 Jan 2026` (the Backload date) are disabled and cannot be picked; `10 Jan 2026` to `20 Jan 2026` can be picked.
10. Clear the `Backload to SKL` date, keep the other two dates, then open `Require at Offshore`. -> No day is blocked by the empty Backload date; the lower limit `10 Jan 2026` still applies.
Expected values (the test loops over every row): SKL / Offshore / Backload `10/10/10` accepted; `10/09/..` Offshore day before SKL not selectable; `10/12/11` Backload day before Offshore not selectable; `12/10/..` SKL day after Offshore not selectable.
Automation: Test data set: table above. Clean up: reload.

### TC-023 [FE][MT] Verify the month a date picker opens on, empty and filled (POS) [Manual: the expected month is not in the Story, needs BA answer]
Precondition: common; one empty row; event start date known.
Priority: Low
Trace: AC-3.8
1. Open `Material Ready at SKL` on an empty row. -> The calendar opens on the month of the event start date or today (BA to confirm).
2. Pick a date, close, and open the picker again. -> The calendar opens on the month of the picked date.

### TC-024 [FE][MT] Verify deleting a row with the trash icon restores `No equipment added.` and numbering (POS) [Auto]
Precondition: common; one new row under `Electrical and Instrument (PM)`.
Priority: High
Trace: AC-1.4, AC-3.9
1. Look at the `Action` column of the new row. -> A trash icon shows.
2. Click the trash icon. -> The row is removed (Figma notes: no confirm; see Open questions).
3. Look at the Work Header. -> `No equipment added.` shows again.
4. Read the `No.` column of the other headers. -> The numbers are continuous again (`1`, `2`, `3`, `4`).
5. Look at the `Save` button. -> It is grey, because the page is back to its start state and nothing is left to save (user's view; BA to confirm, Open question 14).

### TC-025 [FE][MT] Verify pasted conflicting dates are rejected with the Paste Validation Failed modal (NEG) [Partial: modal text is owned by ETM-7351]
Precondition: common; one empty row.
Priority: Medium
Trace: AC-4.4
1. Copy three cells of dates `10 Jan 2026`, `05 Jan 2026`, `20 Jan 2026` and paste them over `Material Ready at SKL`, `Require at Offshore`, `Backload to SKL`. -> The modal `Paste Validation Failed` shows.
2. Close the modal and look at the three cells. -> The conflicting date (`Require at Offshore`) is blank; the other cells follow the left-to-right rule; no red background shows.
3. Paste `10 Jan 2026`, `10 Jan 2026`, `10 Jan 2026`. -> All three accept (equal dates allowed); no modal.
4. Paste `10 Jan 2026` in `Loading at PSB`, with `Material Ready at SKL` = `20 Jan 2026`. -> `Loading at PSB` accepts it.

### TC-026 [FE][MT] Verify double click on Add Equipment (Exotic: double click) [Auto]
Precondition: common.
Priority: Medium
Trace: AC-5.1
1. Double click `+ Add Equipment` on `Operation`. -> Either one or two empty rows show; the number of new rows equals the number of clicks, none overwritten.
2. Read the `No.` column. -> Numbers are continuous without gaps or duplicates.
3. Fill both new rows with valid data and click outside. -> Both rows become saved drafts with different numbers.

### TC-027 [FE][MT] Verify adding a row enables the Save button (POS) [Auto]
Precondition: common; page just opened, no change made.
Priority: High
Trace: AC-5.2
1. Look at the `Save` button. -> It is grey (disabled).
2. Click `+ Add Equipment` on `Operation`. -> The `Save` button turns blue (enabled).
3. Fill the row with valid mandatory data and click `Save`. -> A success toast shows; `Save` goes back to grey.
4. Reload the page. -> The new row is still there with the same values.

### TC-028 [FE][MT] Verify leaving the page after adding a row and undoing it by hand (Exotic: dirty state) [Partial: the Story does not say what Save shows after delete of the only change]
Precondition: common.
Priority: Medium
Trace: AC-5.2
1. Click `+ Add Equipment`, then click the trash icon of the new row. -> The page shows the same rows as at the start.
2. Look at the `Save` button. -> It is grey again, because nothing is left to save (user's view; BA to confirm).
3. Click `+ Add Equipment` again and click the browser Back button. -> The pop-up `Unsaved Change` shows: `Are you sure you want to leave this page? Change you made will not be saved.` with `Continue Editing` and `Discard Change`.
4. Click `Continue Editing`. -> The page stays with the new row kept.
5. Click the browser Back button and click `Discard Change`. -> The page is left and the row is not saved.

### TC-029 [FE][BE][MT] Verify adding equipment does not change Worklist or Shutdown Logic (POS) [Auto]
Precondition: common; record the Worklist and Shutdown Logic row counts and names of the same plan.
Priority: High
Trace: AC-6.1
1. Write down the number of Work Headers and rows in the Worklist and Shutdown Logic. -> The values are recorded.
2. Add a valid equipment row under `Operation` and click `Save`. -> The success toast shows.
3. Open the Worklist and the Shutdown Logic page of the same plan. -> The numbers of rows and all values equal the recorded ones.
4. Reload the Equipment Mob Plan page. -> The saved equipment row is still there.
5. Delete the saved row, click `Save`, then open the Worklist and the Shutdown Logic again. -> The counts and values still equal the recorded ones.
6. In the Worklist create a new Work Header, open the Equipment Mob Plan page and click `+ Add Equipment` on it. -> A new empty row shows under that header; the Worklist and Shutdown Logic stay unchanged.
Automation: Check: counts before and after equal. Clean up: delete the row and Save.

### TC-030 [FE][MT] Verify saved values and dates are unchanged after Save and Refresh (POS) [Auto]
Precondition: common; one row filled with every field, dates `10 Jan 2026`, `12 Jan 2026`, `20 Jan 2026`, Loading at PSB `12 Jan 2026`.
Priority: High
Trace: AC-3.2, AC-3.4, AC-3.8, AC-4.1
1. Click `Save` and wait for the save response. -> The success toast shows.
2. Reload the page. -> The row shows every value as typed: text fields, `Width` `2.50`, `Length` `4.00`, `Height` `2.80`, `Area (m2)` `10.00`, `Gross Wt. (Tons)` `5.20`, Platform, Deck, Transportation, Priority, Status.
3. Read the four dates. -> The dates are the same with no one-day shift.

### TC-031 [FE][MT] Verify two users adding equipment to the same plan at once (Exotic: two users) [Manual: needs two real accounts and the result is not in the Story]
Precondition: common; TM opens the same plan in two browsers.
Priority: Medium
Trace: none (lesson 1, two users)
1. In browser A add a row under `Operation` and Save. -> Save success in A.
2. In browser B, without reloading, add a row under `Operation` and click Save. -> B shows a clear message, or both rows are kept; nothing is overwritten without warning (BA to confirm).
3. Reload both browsers. -> Both browsers show the same rows and the same numbers.

### TC-032 [FE][MT] Verify no leave warning after the added row was removed and after Save (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-5.2
1. Click `+ Add Equipment` on `Operation`, then click the trash icon of the new row. -> The page shows the same rows as at the start.
2. Click the browser Back button. -> The page is left with no `Unsaved Change` pop-up (nothing changed; user's view, BA to confirm).
3. Return to the page, click `+ Add Equipment`, fill the mandatory fields with valid data and click `Save`. -> The success toast shows; `Save` is grey.
4. Click the browser Back button. -> The page is left with no `Unsaved Change` pop-up.
Automation: Check: dialog count 0 after each leave. Clean up: delete the saved row and Save.

### TC-033 [FE][MT] Verify every way of leaving with an unsaved row shows the Unsaved Change pop-up (NEG) [Partial: browser reload prompt is the native dialog]
Precondition: common; one new row added under `Operation`, not saved.
Priority: High
Trace: AC-5.2
1. Click the breadcrumb link above the page title. -> The pop-up `Unsaved Change` shows with `Continue Editing` and `Discard Change`.
2. Click `Continue Editing`, then click the Worklist tab in the page menu. -> The pop-up `Unsaved Change` shows again.
3. Click `Continue Editing`, then click the Shutdown Logic tab. -> The pop-up `Unsaved Change` shows again.
4. Click `Continue Editing`, then press `F5`. -> The browser asks whether to leave the page.
5. Cancel the browser question and look at the row. -> The new row is still on the page.
Automation: automate steps 1 to 3 (pop-up text and buttons); step 4 is the native browser dialog, checked by hand.

### TC-034 [FE][MT] Verify the page can be left without a warning by a role that cannot add rows (POS) [Auto]
Precondition: common; JO has an Active plan.
Priority: Medium
Trace: AC-1.1, AC-5.2
1. Log in as JO and open the Equipment Mob Plan page. -> The page opens in view mode; `Save` is grey or not shown.
2. Click the breadcrumb link. -> The page is left with no `Unsaved Change` pop-up.

### TC-035 [FE][MT] Verify collapsing and expanding a header does not enable Save and an unsaved row survives a visit to another tab (POS) [Auto]
Precondition: common; page just opened, no change made.
Priority: Medium
Trace: AC-1.3, AC-5.2
1. Collapse and expand `Operation`. -> The rows hide and show; `Save` stays grey.
2. Click `+ Add Equipment` on `Operation`, then click the Worklist tab. -> The pop-up `Unsaved Change` shows.
3. Click `Discard Change` and read the Worklist counts. -> The Worklist shows the saved data only; the unsaved row is not counted.
Automation: Check: Save button state after collapse; Worklist count unchanged. Clean up: reload, discard.

### TC-036 [FE][MT] Verify clicking outside a new row with every field empty (NEG) [Auto]
Precondition: common; one new empty row under `Operation`.
Priority: Medium
Trace: AC-4.2, AC-3.3
1. Click outside the row without typing anything. -> The seven mandatory fields (Material Description, WIN# No. (CCU No.), Contact Person, Width, Length, Height, Gross Wt.) show a red border; the row is kept (Open question 4).
2. Check where the cursor is. -> Focus is on `Material Description`, the first mandatory field.

### TC-037 [FE][MT] Verify a large Area value shows in the same number format as the other number columns (BND) [Auto]
Precondition: common; one empty row.
Priority: Low
Trace: AC-3.5
1. Type Width `99.99` and Length `99.99`, then click outside the cell. -> `Area (m2)` shows `9998.00`.
2. Type Gross Wt. `9999.99` and click outside the cell. -> The cell shows `9999.99` with the same separator style as `Area (m2)` (Open question 18).

### TC-038 [FE][MT] Verify typing in a long list filters it (POS) [Auto]
Precondition: common; one empty row; the asset has more than 10 platforms.
Priority: Low
Trace: AC-3.6
1. Open the `Platform` list and type the first letters of a platform name. -> The list shows only platforms that match; picking one puts it in the cell.
2. Type letters that match nothing. -> The list shows no option and the cell keeps its old value after clicking outside.

### TC-039 [FE][MT] Verify paste in the middle of a text, over a selected cell, and auto-scroll to the new row (POS) [Partial: scroll position needs a long plan]
Precondition: common; the plan has more rows than fit on screen; one row with `Contact Person` `Somchai`.
Priority: Medium
Trace: AC-3.2
1. Copy `ABC`, click inside `Somchai` after the third letter and paste. -> The cell shows `SomABCchai`.
2. Select the whole cell, copy `XYZ` and paste over it. -> The cell shows `XYZ` only.
3. Paste a text so long that the total passes the 150 limit at the end of `Contact Person`. -> The cell holds exactly 150 characters.
4. Click `+ Add Equipment` on the last Work Header of the long table. -> The page scrolls to the new row; the frozen left columns and the scrolling columns show the same row.

### TC-040 [FE][MT] Verify after Save and reload the placeholder is replaced and numbers stay continuous (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.4, AC-2.3
1. Add one valid row under `Electrical and Instrument (PM)` and click `Save`. -> The success toast shows.
2. Reload the page. -> The row shows under the header; `No equipment added.` is not shown.
3. Read the `No.` column. -> The numbers are continuous from `1` and the new row shows the number after `Clamp box`.
Automation: Clean up: delete the row and Save.

### TC-041 [FE][MT] Verify deleting a middle saved row re-indexes the numbers and leaves other rows unchanged (BND) [Auto]
Precondition: common; the plan has saved rows `Pump` (1), `Crane` (2), `Tube set` (3), `Clamp box` (4); record every value of the other rows.
Priority: High
Trace: AC-2.3, AC-3.9
1. Click the trash icon of `Crane`. -> The row is removed.
2. Read the `No.` column. -> `Pump` 1, `Tube set` 2, `Clamp box` 3.
3. Click `Save`, reload, and compare the other rows with the record. -> All values and dates of the remaining rows are the same as before.

### TC-042 [FE][MT] Verify Save does not change existing rows or their dates (POS) [Auto]
Precondition: common; record every value and date of the existing rows `Pump`, `Crane`, `Tube set`, `Clamp box`.
Priority: High
Trace: AC-4.1, AC-3.8
1. Add one valid row under `Scaffolding` and click `Save`. -> The success toast shows.
2. Reload the page and compare the four existing rows with the record. -> Every value and date is the same, with no one-day shift.

### TC-043 [FE][MT] Verify Date rules when Offshore is changed after Backload is set (BND) [Auto]
Precondition: common; one row with Material Ready at SKL `10 Jan 2026`, Require at Offshore `12 Jan 2026`, Backload to SKL `20 Jan 2026`.
Priority: High
Trace: AC-4.3
1. Open `Require at Offshore`. -> Days before `10 Jan 2026` and days after `20 Jan 2026` are disabled.
2. Try to pick `21 Jan 2026`. -> The day cannot be picked; the cell keeps `12 Jan 2026`.
3. Pick `20 Jan 2026`. -> The cell shows `20 Jan 2026` (equal to Backload, accepted).

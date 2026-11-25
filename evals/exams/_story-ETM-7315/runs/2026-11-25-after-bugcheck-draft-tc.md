# Draft test cases: ETM-7315 Equipment Mob Plan - Export Plan to Excel

Story: ETM-7315. Source: `story.md` (frozen exam copy), `docs/modules/equipment-mob-plan-validation.md`, `docs/modules/equipment-mob-plan-figma.md`, `knowledge/`. No `analyst.md` or `inspector.md` exists for this exam, so the AC ids below are numbered from the Story outline (AC-1 = Export Action Trigger, AC-2 = File Naming, AC-3 = Template Layout, AC-4 = Work Header Banner Rows, AC-5 = Data Rows, AC-6 = Performance and Notification). Existing `[QA]` subtasks: none known.

Common precondition: user is logged in to QA as Turnaround Manager (TM) and has the `Export Equipment Mob Plan` permission; an Active Equipment Mob Plan is open on the Equipment Mob Plan page (opened from `View Equipment Mob Plan` on the Planning tab); the plan has the work headers `Operation`, `Electrical and Instrument (PM)`, `Mechanical (CM)`, `Electrical and Instrument (CM)` with several saved equipment rows, and one work header without equipment. Browser downloads go to the default folder and the downloaded file can be opened with an Excel reader.

Notation: `->` separates the action from the expected result. Priority is chosen by damage (the Story gives none). `[Auto]` cases read the downloaded .xlsx with a spreadsheet library.

Think-like-the-user notes:
- Who: TM and JO prepare the manifest before the offshore trip, often in a hurry, often with unsaved edits still on screen, sometimes with a filter left on.
- Wants: one file that matches what is saved, with a name they can recognise, to send by email.
- Careless person: exports with a filter on, exports with unsaved changes, double clicks Export, names a plan with `/` or `:`, opens the file and trusts every number.

## AC ids used

| AC | Meaning |
| --- | --- |
| AC-1.1 | Export button placement left of Save |
| AC-1.2 | Permission guard (hidden without permission) |
| AC-1.3 | Empty state: button disabled |
| AC-1.4 | Only persisted data exported |
| AC-1.5 | Active grid filters ignored |
| AC-2.1 | Dynamic file name, date = local export date |
| AC-2.2 | Prohibited characters removed, no replacement spaces |
| AC-2.3 | Worksheet tab name `Equipment Mob Plan` |
| AC-3.1 | Row 1 banner merged A1:X1, text, navy #35455C, bold white |
| AC-3.2 | Row 2 headers, 24 columns, steel blue #526493, bold white, exact order |
| AC-4.1 | Work Header banner rows: merged A:X, colour, exact case, order |
| AC-4.2 | Every equipment under a parent Work Header, no `NON WORK HEADER` |
| AC-4.3 | Empty category placeholder `No equipment assigned.` |
| AC-5.1 | Child rows beneath banner in table order |
| AC-5.2 | Column formats and alignment (No., text, Yes/No, decimals, Area formula, dates, Priority) |
| AC-5.3 | Blank values are empty cells, never null / undefined |
| AC-6.1 | Loading spinner and label `Exporting...` |
| AC-6.2 | Download prompt and toast `Equipment Mob Plan exported successfully.` |

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
| --- | --- | --- | --- |
| AC-1.1 button placement | Screen states | Wrong place, wrong style | TC-003 |
| AC-1.2 permission | Roles and permission | Permission leak | TC-001, TC-002 |
| AC-1.3 empty state | Screen states, edge | Empty file or crash | TC-004, TC-005 |
| AC-1.4 persisted only | Unsaved changes (dirty state) | Wrong data shown in file | TC-009, TC-010 |
| AC-1.5 filters ignored | Lessons 2 (filter + search) | Partial file sent offshore | TC-011 |
| AC-2.1 file name | Edge values, input groups | Wrong name, wrong date | TC-012, TC-013 |
| AC-2.2 sanitizing | Equivalence, boundary, strange input | Invalid file name, extra spaces | TC-014, TC-015, TC-016 |
| AC-2.3 tab name | Direct check | Wrong tab | TC-017 |
| AC-3.1 / AC-3.2 header styling | Direct check, condition table | Wrong layout, wrong column order | TC-018, TC-019 |
| AC-4.1 banners | Order, case | Wrong order, forced uppercase | TC-020 |
| AC-4.2 strict assignment | Direct check | Orphan banner | TC-021 |
| AC-4.3 empty category | Screen state, edge | Missing placeholder | TC-022 |
| AC-5.1 child rows | Order | Rows under wrong header | TC-020, TC-023 |
| AC-5.2 formats | Condition table (expected table) | Wrong numbers, dates | TC-023, TC-024, TC-025, TC-026 |
| AC-5.3 blank values | Equivalence | `null` text in cells | TC-027 |
| AC-6.1 loading | Screen state, double click | Double export | TC-028, TC-029 |
| AC-6.2 download and toast | Direct check | No feedback | TC-030 |
| Deleted plan (Validation sheet row 4) | Two users | Silent failure | TC-031 |
| Strange input in cells | Lesson 4 | Broken file, formula injection | TC-032 |
| Very many rows | Screen state | Slow or cut file | TC-033 |
| Keyboard use | Real-user view | Cannot export without mouse | TC-034 |
| Role JO | Roles | Permission mismatch | TC-002 |
| Export after Save, data same on other pages | Lesson 8 | File differs from screen | TC-035 |
| Unsaved delete, draft kept, reload, role without save, leaving by breadcrumb/menu/tab, view state kept | Unsaved changes and leaving | Draft lost or applied; pop-up on leave | TC-038, TC-039, TC-040, TC-041, TC-042, TC-043, TC-044 |
| Plan Name in banner (open question 7) | Strange input | Banner sanitized by mistake | TC-045 |

Categories of `lessons-learned.md`:
- 1 Two people at once: relevant (TC-031, TC-036).
- 2 Filter + Sort + Search: relevant (TC-011); sort has no control on export, not relevant.
- 3 Old data after migrations: relevant (TC-027, old rows with empty optional fields); no migration is named in the Story, so one case only.
- 4 Strange input: relevant (TC-032, TC-015, TC-016).
- 5 Reordering a list: not relevant, the Story has no reorder; order is checked in TC-020.
- 6 Linked data: relevant (TC-035, Work Header renamed or deleted then exported).
- 7 Charts that depend on each other: not relevant, no chart in this Story.
- 8 Same data on many pages: relevant (TC-035).
- 9 Matrix calculations: relevant (TC-023 expected table for formats, TC-025 for Area).
- L-1 text sort with numbers: not relevant, no sorted list in export.
- L-2 filter choice not kept: not relevant, the Filter Panel is not changed here; filter is only an input of TC-011.
- L-3 result read too early: relevant for automation, wait for the download and toast before reading the file (TC-030).
- L-4 multi-row paste: not relevant, no paste in this Story.
- L-5 collapse / expand: relevant, collapsed Work Header must still export all rows (TC-011).
- L-6 same value different case: relevant (TC-020 case-sensitive Work Header names; TC-014 name case kept).
- L-7 selected is not hover: not relevant, no picker.
- L-8 Story text changed: relevant, `story.md` is a frozen copy and 3 later edits exist; rules to be re-checked against the live Story before a run (see Open questions).

Counts: 45 cases. High 19, Medium 20, Low 6. Auto 35, Partial or Manual 10.

## Open questions

1. Job Owner and Export: the Story says JO has the permission, but the team note says JO is view only and cannot open an Inactive plan. Which is right for QA (Export visible for JO or not)? TC-002 follows the Story.
2. AC "Empty State": is the button disabled when the plan has a work header with no equipment (the Precondition says at least one work header or equipment record, but the empty-category placeholder implies headers without equipment are exportable)? TC-005 expects: enabled.
3. Placeholder text: Story says `No equipment assigned.` but the screen text is `No equipment added.` Both expected where written; please confirm they are meant to differ.
4. "Local export generation date": local to the browser or to Thai time (UTC+7, as the Plan Card)? Near midnight the file name can differ (TC-013).
5. What if the file name is empty or only invalid characters after sanitizing, or longer than the file system allows? Not defined.
6. What if Width or Length is empty: does the Area formula show 0 or blank? TC-025 writes the expectation "blank is not shown as 0" and asks.
7. Plan Name in the Row 1 banner: are invalid file name characters kept there (expected: yes, kept as typed)?
8. After the user clicks OK on the deleted-plan pop-up (Export), does the page stay or go back? Same open question as in the validation notes.
9. Does Export with unsaved changes show the `Unsaved Change` pop-up or a warning? Story says only that drafts are not exported.
10. Priority and Status values: the allowed sets in the file (`1`, `2`, `3`; Status list) need a confirmed order of text vs number for `Priority` (text or number type).
11. Date columns: which time zone is used when the stored date is converted to `d mmm yyyy`?
12. The Story was edited 3 times after the frozen copy; the live Story must be compared before testing (L-8).
13. Suggestion (not in Story): the button tooltip for the disabled state, and a file name length rule. Not written as cases.
14. Suggestion (not in Story): a limit on the number of exported rows and an error toast for a failed export (the Story has only the success toast). Not written as cases; TC-033 and TC-037 cover only what the Story implies.

## Test cases (45 flows)

### TC-001 [FE][MT] Verify Export button is visible and works for a user with the Export permission (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.2
1. Open the Equipment Mob Plan page of the Active plan as Turnaround Manager. -> The page shows the title `Equipment Mob Plan: <plan name>` and the `Export` button is visible.
2. Hover over the `Export` button. -> The button looks clickable (not greyed out).
3. Click `Export`. -> A file download starts.
4. Open the downloaded file. -> The workbook opens with one worksheet `Equipment Mob Plan`; the equipment rows in it are the saved rows of this plan (count equals the saved rows on screen, first row `Material Description` equals the screen) and the file is not empty.
Automate: runs every release, result is always the same.
Starting data: Active plan with at least one work header and one saved equipment row (card-owned data).
What to check: button visible and enabled; one download event; file has this plan's rows.
Test data set: none.
Clean up: delete the downloaded file.

### TC-002 [FE][MT] Verify Export button for Job Owner follows the permission (POS) [Partial: depends on open question 1]
Precondition: common, but signed in as Job Owner; the plan is Active
Priority: High
Trace: AC-1.2
1. Open the Equipment Mob Plan page of the Active plan as Job Owner. -> The page opens in view mode.
2. Look at the top header bar. -> The `Export` button is visible (the Story says JO has the permission).
3. Click `Export`. -> A file download starts.
Note: expected result of step 2 and 3 waits for the answer to open question 1.

### TC-003 [FE][MT] Verify Export button placement and style (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-1.1
1. Open the Equipment Mob Plan page. -> The top header bar shows the title on the left and two buttons on the right.
2. Look at the two buttons. -> `Export` (outlined, with a download arrow icon) is directly to the left of `Save`; no other button is between them.
3. Make a change on the page. -> `Save` turns blue and `Export` keeps its place to the left of `Save`.
Automate: position check by element order, same every release.
Starting data: common plan.
What to check: the `Export` button comes right before `Save` in the header; outlined style.
Clean up: discard the change.

### TC-004 [FE][MT] Verify Export button is disabled when the plan has no work header and no equipment (POS) [Auto]
Precondition: common, but the plan has no saved work headers and no equipment (new empty plan)
Priority: High
Trace: AC-1.3
1. Open the Equipment Mob Plan page of the empty plan. -> The table shows the empty box icon and `No results found`.
2. Look at the `Export` button. -> The button is greyed out.
3. Click the `Export` button. -> Nothing happens: no download starts and no toast appears.
Automate: runs every release, result is always the same.
Starting data: an empty plan owned by the test.
What to check: button disabled; no download event within 3 seconds.
Clean up: delete the empty plan.

### TC-005 [FE][MT] Verify Export button becomes enabled when the first work header is saved, and disabled again when the last one is deleted (POS) [Auto]
Precondition: common, but start with an empty plan
Priority: Medium
Trace: AC-1.3
1. Click `Add Work Header`, type `New Work Header` and click `Save` in the pop-up. -> The new work header shows with `No equipment added.`
2. Click `Save` in the page header. -> The page saves; the success toast `Save Equipment Mob Plan Successfully.` shows.
3. Look at the `Export` button. -> The button is enabled (open question 2: a work header without equipment).
4. Delete the work header with its three-dot menu, then click `Save`. -> The table shows `No results found`.
5. Look at the `Export` button. -> The button is greyed out.
Automate: state change, same every release.
Starting data: empty plan owned by the test.
What to check: button state after every step.
Clean up: delete the plan.

### TC-006 [FE][MT] Verify Export button is not shown for a user without the Export permission (NEG) [Manual: no account without the permission exists on QA (only TM and JO)]
Precondition: a user that does not have the `Export Equipment Mob Plan` permission
Priority: High
Trace: AC-1.2
1. Open the Equipment Mob Plan page as that user. -> The page opens.
2. Look at the top header bar. -> The `Export` button is not in the page at all (hidden, not greyed out); only the buttons the user may use are shown.
Note: cannot be run on QA now. Needs a role without the permission from the BA (open question 1).

### TC-007 [FE][MT] Verify the Export button stays enabled while the page has unsaved changes (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.4
1. Add a new equipment row with `Add Equipment` under `Operation` and do not save. -> The row shows and `Save` turns blue.
2. Look at the `Export` button. -> The button is still enabled.
Automate: simple state check.
Starting data: common plan.
What to check: `Export` enabled while Save is blue.
Clean up: discard the change.

### TC-008 [FE][MT] Verify Export is available after a reload of the page (POS) [Manual: low value as a separate script, covered by TC-001]
Precondition: common
Priority: Low
Trace: none (screen state after reload)
1. Reload the page with the browser Refresh. -> The page reloads and shows the same table.
2. Look at the `Export` button. -> The button is visible and enabled.

### TC-009 [FE][BE][MT] Verify unsaved new equipment is not in the exported file (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4
1. Open the saved file count: export once and record the number of equipment rows in the file. -> The count is written down for comparison.
2. Add a new equipment row under `Operation` with `Material Description` `Unsaved Pump` and do not click `Save`. -> The row shows on screen and `Save` is blue.
3. Click `Export`. -> The file downloads.
4. Open the file and search every row for `Unsaved Pump`. -> `Unsaved Pump` is not found and the number of equipment rows equals the count from step 1.
Automate: runs every release, result is always the same.
Starting data: common plan.
What to check: row count same as before; text `Unsaved Pump` not in the file.
Clean up: discard the change, delete the file.

### TC-010 [FE][BE][MT] Verify an unsaved edit of an existing value is not in the file; the saved value is (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4
1. Record the saved `Remark` of the first equipment row. -> The value is written down.
2. Change that `Remark` to `Draft remark` and do not save. -> The cell shows `Draft remark`.
3. Click `Export`. -> The file downloads.
4. Open the file and read the `Remark` of that row. -> It shows the saved value from step 1, not `Draft remark`.
5. Undo the change by typing the saved value back and look at `Save`. -> `Save` is grey again (nothing to save).
6. Click `Export` and open the file. -> The file downloads and the `Remark` of that row is the saved value; `Save` is still grey and no `Unsaved Change` pop-up shows.
Automate: runs every release.
Starting data: common plan.
What to check: the cell in the file equals the saved value.
Clean up: discard, delete file.

### TC-011 [FE][BE][MT] Verify the export ignores an active filter and a collapsed work header (POS) [Auto]
Precondition: common, the plan has rows with at least two different `Platform` values
Priority: High
Trace: AC-1.5
1. Export once with no filter and record the number of equipment rows and work headers. -> The counts are written down.
2. Open the `Filter Panel`, tick only one `Platform` value and close the panel. -> The table shows only the rows of that platform.
3. Use `Custom View` to collapse the `Work Header` level. -> Only the work header rows show.
4. Click `Export`. -> The file downloads.
5. Open the file and count equipment rows and work headers. -> The counts equal the counts from step 1 (full data set).
6. Set a search text in a text filter that matches nothing, then click `Export`. -> The `Export` button is enabled and the file downloads.
7. Open the file and count equipment rows and work headers. -> The counts equal the counts from step 1 (full data set).
8. Look at the page. -> The filter, the search text and the collapsed `Work Header` level are still set as before the export.
Automate: runs every release; filter combos are fixed.
Starting data: common plan.
What to check: row counts equal; all work headers present.
Clean up: reset filters, delete files.

### TC-012 [FE][BE][MT] Verify the file name format (POS) [Auto]
Precondition: common; Shutdown Event Name `AWP03 FSD`, Plan Name `Plan A`
Priority: High
Trace: AC-2.1
1. Record today's local date. -> For example `20261125` is written down in format YYYYMMDD.
2. Click `Export`. -> The file downloads directly with no extra dialog.
3. Read the file name. -> The name is `AWP03 FSD_Plan A_EquipmentMobPlan_<today YYYYMMDD>.xlsx`.
Automate: runs every release; date is computed by the test.
Starting data: event and plan with known names (card-owned).
What to check: exact file name.
Clean up: delete the file.

### TC-013 [FE][BE][MT] Verify the date in the file name near midnight (BND) [Manual: needs the clock or time zone changed]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Set the computer time zone so that the local date is different from the Thai date, then click `Export`. -> The file downloads.
2. Read the date part of the file name. -> It is the local date of the computer (open question 4 confirms the time zone).

### TC-014 [FE][BE][MT] Verify the names keep upper and lower case and Thai letters (POS) [Auto]
Precondition: common; Plan Name `plan ก Test`
Priority: Medium
Trace: AC-2.1
1. Click `Export`. -> The file downloads.
2. Read the file name. -> The plan part shows `plan ก Test` exactly as typed (case and letters kept).
Automate: data driven, one extra plan name.
Starting data: plan renamed by the test.
What to check: exact name.
Clean up: rename back, delete the file.

### TC-015 [FE][BE][MT] Verify every prohibited character is removed from the Plan Name and the Event Name, with no replacement space (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2
1. Rename the plan to each value in the expected table below (one value at a time) and click `Export`. -> Each export downloads.
2. Read each file name. -> The name equals the expected file name in the table; no `_`, space or other replacement is left at the place of the removed character.

| Plan Name | Expected plan part of the file name |
| --- | --- |
| `A\B` | `AB` |
| `A/B` | `AB` |
| `A:B` | `AB` |
| `A*B` | `AB` |
| `A?B` | `AB` |
| `A"B` | `AB` |
| `A<B` | `AB` |
| `A>B` | `AB` |
| `A\|B` | `AB` |
| `Plan A: Rev 2/3` | `Plan A Rev 23` |

3. Repeat one row with the invalid character in the Shutdown Event Name. -> The event part of the file name has the character removed in the same way.
Automate: matrix, one test loops over every row of the table.
Starting data: plan and event owned by the test (names can be edited).
What to check: exact file names.
Test data set: expected table above.
Clean up: rename the plan and event back, delete files.

### TC-016 [FE][BE][MT] Verify a plan name that has only prohibited characters and one with spaces next to a removed character (BND) [Manual: expected result not defined, open question 5]
Precondition: common
Priority: Low
Trace: AC-2.2
1. Rename the plan to `///` and click `Export`. -> The file name is shown for the team to decide (open question 5): the plan part would be empty.
2. Rename the plan to ` A / B ` and click `Export`. -> The removed character leaves its neighbouring spaces as typed (` A  B `), with no extra space added.

### TC-017 [FE][BE][MT] Verify the worksheet tab name (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.3
1. Click `Export` and open the file. -> The workbook opens.
2. Read the tab names. -> There is one tab named `Equipment Mob Plan`.
Automate: same every release.
Starting data: common plan.
What to check: first sheet name.
Clean up: delete file.

### TC-018 [FE][BE][MT] Verify the title banner in row 1 (POS) [Auto]
Precondition: common; Plan Name `Plan A`
Priority: Medium
Trace: AC-3.1
1. Click `Export` and open the file. -> The workbook opens.
2. Read row 1. -> Cells A1 to X1 are merged (`A1:X1`) and show `Equipment Mob Plan: Plan A`.
3. Check the fill and the font of A1. -> Background is dark navy `#35455C`; text is bold white `#FFFFFF`.
Automate: same every release.
Starting data: common plan.
What to check: merge range, text, fill colour, font colour, bold.
Clean up: delete file.

### TC-019 [FE][BE][MT] Verify the column header row 2 (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2
1. Click `Export` and open the file. -> The workbook opens.
2. Read row 2 from A to X. -> 24 headers in this order: `No.`, `Material Description`, `WIN# No. (CCU No.)`, `Contact Person`, `Department`, `Premob Inspection`, `Width (m)`, `Length (m)`, `Height (m)`, `Area (m2)`, `Gross Wt. (Tons)`, `Platform`, `Deck`, `Item No. in Plot Plan`, `Transportation`, `Material Ready at SKL`, `Require at Offshore`, `Backload to SKL`, `Priority`, `Status`, `MMR No.`, `Vessel Name`, `Loading at PSB`, `Remark`.
3. Check the fill and the font of every header cell. -> Background is steel blue `#526493`; text is bold white `#FFFFFF`.
4. Look at column Y. -> No header and no data in column Y.
Automate: same every release.
Starting data: common plan.
What to check: 24 header texts in order; colours; nothing after X.
Clean up: delete file.

### TC-020 [FE][BE][MT] Verify Work Header banner rows: merge, colour, exact case and order (POS) [Auto]
Precondition: common; work headers `Operation`, `Electrical and Instrument (PM)`, `Mechanical (CM)`, `Electrical and Instrument (CM)` and one added by hand named `my Manual header`
Priority: High
Trace: AC-4.1, AC-5.1
1. Read the order and the names of the work headers on the screen. -> The order is written down (master data order, then the manual one last).
2. Click `Export` and open the file. -> The workbook opens.
3. Find the banner rows. -> Each banner is merged `A{row}:X{row}`, with steel blue `#526493` fill and bold white `#FFFFFF` text.
4. Compare the names. -> Names are exactly as on the screen, case kept (`my Manual header` is not turned into upper case; `Electrical and Instrument (PM)` unchanged).
5. Compare the order. -> The banners are in the same order as the screen; the equipment rows of each header are under their own banner.
Automate: same every release.
Starting data: plan with the headers above (card-owned).
What to check: banner text, merge range, colours, order.
Clean up: delete the manual header and the file.

### TC-021 [FE][BE][MT] Verify no equipment sits outside a Work Header and no `NON WORK HEADER` banner exists (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.2
1. Click `Export` and open the file. -> The workbook opens.
2. Search all cells for `NON WORK HEADER`. -> The text is not found.
3. Check that every row with a number in column A is below a banner row. -> No numbered row comes before the first banner.
Automate: same every release.
Starting data: common plan.
What to check: text search and row order.
Clean up: delete file.

### TC-022 [FE][BE][MT] Verify the placeholder row of a Work Header with no equipment (POS) [Auto]
Precondition: common, with one work header that has no equipment
Priority: Medium
Trace: AC-4.3
1. Click `Export` and open the file. -> The workbook opens.
2. Find the banner of the empty work header. -> The next row directly below it is one merged row `A{row}:X{row}`.
3. Read the text and style of that row. -> `No equipment assigned.` in italic, light gray `#8C8C8C`, on white `#FFFFFF` background.
4. Check the `No.` numbers of the equipment rows after it. -> Numbers continue without a gap (the placeholder row has no number).
Automate: same every release.
Starting data: plan with one empty work header between two filled ones.
What to check: row position, merge, text, font italic, colours.
Clean up: delete file.

### TC-023 [FE][BE][MT] Verify the `No.` column and the row order (POS) [Auto]
Precondition: common, equipment under at least three work headers
Priority: Medium
Trace: AC-5.1, AC-5.2
1. Click `Export` and open the file. -> The workbook opens.
2. Read column A of all equipment rows. -> Numbers are `1`, `2`, `3`... `N` continuously over all headers; banner rows and the placeholder row have no number.
3. Check the format and alignment of column A. -> Number format is `@` (text), horizontal and vertical alignment are center.
4. Compare the order of equipment rows with the screen. -> The order is the same as the screen.
Automate: same every release.
Starting data: common plan.
What to check: sequence 1..N, format `@`, centre alignment, order.
Clean up: delete file.

### TC-024 [FE][BE][MT] Verify the format and alignment of every data column (POS) [Auto]
Precondition: common, one equipment row with every field filled: `Material Description` `Pump P-101`, `WIN# No. (CCU No.)` `CCU-0001`, `Contact Person` `Somchai K.`, `Department` `Operation`, `Premob Inspection` `Yes`, Width `2.5`, Length `3.25`, Height `1.1`, Gross Wt. `1234.5`, Platform `AWP03`, Deck `Main Deck`, Item No. in Plot Plan `P-12`, Transportation `Supply Vessel`, Material Ready at SKL `05 Jun 2026`, Require at Offshore `15 Jun 2026`, Backload to SKL `30 Jun 2026`, Priority `1`, Status `Inspected`, MMR No. `MMR-001`, Vessel Name `Vessel One`, Loading at PSB `10 Jun 2026`, Remark `Handle with care`
Priority: High
Trace: AC-5.2
1. Click `Export` and open the file. -> The workbook opens.
2. Read the row of `Pump P-101` and compare with the expected table below. -> Every cell has the expected value, number format and alignment; `Premob Inspection` shows `Yes` centred and `Priority` shows `1`.

| Column | Expected value | Number format | Alignment |
| --- | --- | --- | --- |
| Material Description, WIN#, Contact Person, Department, Platform, Deck, Item No., Transportation, Status, MMR No., Vessel Name, Remark | as typed | text | left |
| Premob Inspection | `Yes` | text | center |
| Width (m) | `2.50` | `#,##0.00` | right |
| Length (m) | `3.25` | `#,##0.00` | right |
| Height (m) | `1.10` | `#,##0.00` | right |
| Gross Wt. (Tons) | `1,234.50` | `#,##0.00` | right |
| Material Ready at SKL | `5 Jun 2026` | `d mmm yyyy` (date value, not text) | left |
| Require at Offshore | `15 Jun 2026` | `d mmm yyyy` | left |
| Backload to SKL | `30 Jun 2026` | `d mmm yyyy` | left |
| Loading at PSB | `10 Jun 2026` | `d mmm yyyy` | left |
| Priority | `1` | general (cell reads exactly `1`, not `1.00`, not `01`, no quote mark) | left |

Automate: matrix; one test loops over every row of the expected table.
Starting data: the row above, made by the test.
What to check: value, number format, horizontal alignment per column.
Test data set: expected table above.
Clean up: delete row and file.

### TC-025 [FE][BE][MT] Verify the Area formula (POS) [Auto]
Precondition: common, equipment with Width and Length as in the table below
Priority: High
Trace: AC-5.2
1. Click `Export` and open the file. -> The workbook opens.
2. Read the Area cell (column J) of each row in the table below and its formula. -> The formula is `=G{row}*H{row}` and the shown value equals the expected value, format `#,##0.00`, right-aligned.

| Width | Length | Expected Area |
| --- | --- | --- |
| `2.00` | `3.00` | `6.00` |
| `0.01` | `0.01` | `0.00` |
| `1234.56` | `10.00` | `12,345.60` |
| `2.555` (stored value, shown as `2.56`) | `2.00` | `5.11` (stored value times Length, not 5.12) |
| `2.00` | empty | the Area cell is empty or shows no number; it is not `0.00` and not an error text (open question 6) |

3. Change Width in the sheet. -> The Area cell recalculates by itself.
Note: row 4 assumes the screen accepts 3 decimals; if it does not, that row is dropped and the BA is asked (open question 6). The Area is the product of the stored values, never of the rounded display.
Automate: matrix, loop over the table.
Starting data: rows with the values above (made by the test).
What to check: formula text, calculated value.
Test data set: table above.
Clean up: delete rows and file.

### TC-026 [FE][BE][MT] Verify the date columns for edge dates (BND) [Auto]
Precondition: common, an equipment row with dates `1 Jan 2026`, `31 Dec 2026`, `29 Feb 2028`
Priority: Medium
Trace: AC-5.2
1. Click `Export` and open the file. -> The workbook opens.
2. Read the three dates. -> They show `1 Jan 2026`, `31 Dec 2026`, `29 Feb 2028` (single digit day without a leading zero), and the cell holds a date value.
Automate: data driven.
Starting data: row made by the test.
What to check: date value and format.
Test data set: the three dates.
Clean up: delete row and file.

### TC-027 [FE][BE][MT] Verify blank optional fields give empty cells, not `null` or `undefined` (NEG) [Auto]
Precondition: common, one equipment row with only the required fields (Material Description, WIN# No. (CCU No.), Contact Person, Width, Length) filled, and one older row with several empty optional fields
Priority: High
Trace: AC-5.3
1. Click `Export` and open the file. -> The workbook opens.
2. Read the optional cells of those rows (Department, Height, Gross Wt. (Tons), Area, Platform, Deck, dates, Priority, Status, MMR No., Vessel Name, Remark). -> Each cell is empty; `Gross Wt. (Tons)` is not `0.00` and `Height` is not `0.00` (a cell that is empty on screen is empty in the file); `Area` of the older row with an empty Length is not `0.00`.
3. Search the whole workbook for `null` and `undefined`. -> Neither text is found.
Automate: runs every release.
Starting data: rows made by the test.
What to check: empty cells; no `null`/`undefined`.
Clean up: delete rows and file.

### TC-028 [FE][MT] Verify the loading state while the file is made (POS) [Partial: needs a slow network to see the state]
Precondition: common; browser network set to Slow 3G
Priority: Medium
Trace: AC-6.1
1. Click `Export`. -> The button shows a loading spinner and the label `Exporting...`.
2. Click the button again while it shows `Exporting...`. -> No second request starts.
3. Wait for the file. -> The label returns to `Export` and the spinner disappears.

### TC-029 [FE][MT] Verify a fast double click on Export gives one file (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-6.1
1. Double click `Export` quickly. -> The button shows `Exporting...`.
2. Wait until the toast shows. -> Only one file is downloaded and one toast shows.
Automate: runs every release.
Starting data: common plan.
What to check: one download event and one toast.
Clean up: delete files.

### TC-030 [FE][BE][MT] Verify the download and the success toast (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-6.2
1. Click `Export`. -> The button shows `Exporting...`.
2. Wait for the download. -> The browser starts a standard file download of the `.xlsx`.
3. Read the toast. -> The toast shows `Equipment Mob Plan exported successfully.`
4. Look at the button. -> The button shows `Export` again and is enabled.
Automate: wait for the download event and the toast before reading anything (lesson L-3).
Starting data: common plan.
What to check: download event, toast text, button label.
Clean up: delete file.

### TC-031 [FE][BE][MT] Verify Export when the plan was deleted in another tab (NEG) [Manual: needs two tabs and a deleted plan]
Precondition: common; the page is open in tab A
Priority: High
Trace: none (Validation sheet message 4, two users)
1. In tab B delete the Equipment Mob Plan from the Planning tab. -> The plan is deleted.
2. In tab A click `Export`. -> A pop-up shows with the title `Unable to Export Equipment Mob Plan` and the message `The equipment mob plan has already been deleted.` and one `OK` button.
3. Check the downloads. -> No file was downloaded.
4. Click `OK`. -> The pop-up closes (what happens next is open question 8).

### TC-032 [FE][BE][MT] Verify strange text in cells is exported as typed and does not break the file (Technical + Security) [Auto]
Precondition: common, equipment rows whose `Remark` / `Material Description` hold: `=1+1`, `@SUM(A1)`, `"quoted" <b>x</b> & %`, an emoji `🚧`, Thai text `ทดสอบ`, `Ａ１` full width, text with 2 new lines, 500 characters
Priority: Medium
Trace: AC-5.2
1. Click `Export` and open the file. -> The workbook opens without a repair message.
2. Read each strange cell. -> The text is shown exactly as typed; `=1+1` is shown as text and is not calculated; the long text is complete.
Automate: one data set looped over the Remark field.
Starting data: rows made by the test.
What to check: cell text equals the typed text; cell type is text.
Test data set: the values above.
Clean up: delete rows and file.

### TC-033 [FE][BE][MT] Verify the export with very many rows (BND) [Partial: data volume must be prepared by import]
Precondition: common, a plan with about 500 equipment rows over many work headers (made by Import or API with BA confirmation, reachable from the UI)
Priority: Medium
Trace: AC-1.4
1. Click `Export`. -> The button shows `Exporting...`.
2. Wait for the file. -> The file downloads and the toast `Equipment Mob Plan exported successfully.` shows.
3. Count equipment rows in the file. -> The count equals the count on the screen (last row `N` exists, nothing is cut).

### TC-034 [FE][MT] Verify Export can be used with the keyboard only (POS) [Manual: needs a person to follow the focus]
Precondition: common
Priority: Low
Trace: none (real-user view, keyboard)
1. Press Tab until the focus is on `Export`. -> `Export` shows a focus frame; the focus comes before `Save`.
2. Press Enter. -> The export starts and the file downloads.

### TC-035 [FE][BE][MT] Verify the file matches the screen after Save and after editing linked data (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4, AC-4.1
1. Edit a work header name from `Operation` to `Operation 2` with `Edit Work Header` and click `Save` in the page header. -> The success toast shows.
2. Add equipment `Saved Compressor` under it and click `Save`. -> The row stays after the toast.
3. Click `Export` and open the file. -> The banner shows `Operation 2` and the row `Saved Compressor` is under it.
4. Delete the work header with its rows, click `Save`, and export again. -> The new file has no `Operation 2` banner and no `Saved Compressor` row.
Automate: runs every release.
Starting data: card-owned plan.
What to check: banner names and rows follow the saved state.
Clean up: restore data, delete files.

### TC-036 [FE][BE][MT] Verify export while another user saves a change at the same time (NEG) [Manual: two real users at the same moment]
Precondition: common; two users on the same plan
Priority: Low
Trace: none (lesson 1, two people)
1. User 1 clicks `Export` while user 2 clicks `Save` with a new equipment row. -> User 1 gets a complete file.
2. Open the file. -> It shows either all of the saved data from before or all of it after the save, never a half-written row.

### TC-037 [FE][BE][MT] Verify Export does not change the page state (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-6.2
1. Look at `Save`. -> `Save` is grey.
2. Click `Export` and wait for the toast. -> The file downloads.
3. Look at `Save` and click the browser Back button. -> `Save` is still grey and no `Unsaved Change` pop-up shows.
Automate: runs every release.
Starting data: common plan.
What to check: Save state, no leave-page pop-up.
Clean up: delete file.

### TC-038 [FE][BE][MT] Verify an unsaved delete is not applied to the file (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4
1. Click `Export`, open the file and record the number of equipment rows and the work header names. -> The counts and names are written down.
2. Delete one equipment row on screen and do not click `Save`. -> The row is gone from the screen and `Save` is blue.
3. Click `Export` and open the file. -> The deleted equipment row is still in the file, and the equipment count equals the count from step 1.
4. Delete the work header without equipment on screen and do not save, then click `Export` and open the file. -> The work header banner and its placeholder row are still in the file.
5. Look at the page. -> The deleted items are still gone from the screen and `Save` is still blue.
Automate: runs every release.
Starting data: common plan (card-owned data).
What to check: file counts equal saved counts; page keeps the draft.
Clean up: discard the changes, delete the files.

### TC-039 [FE][MT] Verify Export does not clear the unsaved draft (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4, AC-6.2
1. Add a new equipment row under `Operation` with `Material Description` `Draft Pump` and do not save. -> The row shows and `Save` is blue.
2. Click `Export` and wait for the toast. -> The toast `Equipment Mob Plan exported successfully.` shows.
3. Look at the page. -> The row `Draft Pump` is still on screen and `Save` is still blue.
4. Click `Save`. -> The row `Draft Pump` is saved and `Save` turns grey.
Automate: runs every release.
Starting data: common plan.
What to check: row and Save state after export; row saved afterwards.
Clean up: delete the row and the file.

### TC-040 [FE][MT] Verify a role that cannot save can Export and leave the page without a pop-up (POS) [Auto]
Precondition: common, but signed in as Job Owner; the plan is Active
Priority: Medium
Trace: AC-1.2, AC-6.2
1. Open the Equipment Mob Plan page of the Active plan as Job Owner. -> The page opens in view mode and `Save` is not usable.
2. Click `Export` and wait for the toast. -> The file downloads and the toast `Equipment Mob Plan exported successfully.` shows.
3. Click the browser Back button. -> The previous page opens and no `Unsaved Change` pop-up shows.
Automate: runs every release; depends on open question 1 (JO has Export).
Starting data: common plan, JO account.
What to check: no leave-page pop-up.
Clean up: delete the file.

### TC-041 [FE][BE][MT] Verify Export after a reload that dropped unsaved changes (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.4
1. Add a new equipment row under `Operation` with `Material Description` `Lost Pump` and do not save. -> The row shows and `Save` is blue.
2. Reload the page with the browser Refresh and confirm leaving if asked. -> The page reloads, `Lost Pump` is gone and `Save` is grey.
3. Click `Export` and open the file. -> The file contains the saved data and `Lost Pump` is not found.
Automate: runs every release.
Starting data: common plan.
What to check: text not in file; counts equal saved counts.
Clean up: delete the file.

### TC-042 [FE][MT] Verify leaving the page after Export by breadcrumb, menu or Planning tab (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-6.2
1. Click `Export` and wait for the toast. -> The file downloads.
2. Click the breadcrumb link back to the Planning page. -> The Planning page opens and no `Unsaved Change` pop-up shows.
3. Click `View Equipment Mob Plan` on the Planning tab again. -> The page opens with the same plan and `Export` is enabled.
4. Click `Export` again. -> A second file downloads with the same name pattern.
5. Click another item of the side menu. -> The other page opens and no `Unsaved Change` pop-up shows.
Automate: runs every release.
Starting data: common plan.
What to check: no pop-up; export works after coming back.
Clean up: delete the files.

### TC-043 [FE][MT] Verify Export again after going to another in-app tab and back (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-1.3
1. Open the `Manpower Mob Plan` page of the same event, then come back to the Equipment Mob Plan page. -> The Equipment Mob Plan page shows the same table.
2. Click `Export`. -> The file downloads and the toast `Equipment Mob Plan exported successfully.` shows.
Automate: simple flow.
Starting data: common plan.
What to check: download and toast.
Clean up: delete the file.

### TC-044 [FE][BE][MT] Verify Export leaves filter, collapse and other pages unchanged (POS) [Auto]
Precondition: common, the plan has rows with at least two different `Platform` values
Priority: Medium
Trace: AC-1.5
1. Open the `Manpower Mob Plan` page and record the first rows and the count. -> The values are written down; then return to the Equipment Mob Plan page.
2. Filter by one `Platform` value and collapse the `Work Header` level. -> The table shows only the work header rows of that platform.
3. Click `Export` and wait for the toast. -> The file downloads.
4. Look at the table. -> The filter and the collapsed level are still set and the same rows show as in step 2.
5. Open the `Manpower Mob Plan` page. -> The rows and the count equal the values from step 1.
Automate: runs every release.
Starting data: common plan.
What to check: view state kept; other page unchanged.
Clean up: reset the filter, delete the file.

### TC-045 [FE][BE][MT] Verify the Plan Name in the row 1 banner keeps invalid file name characters (NEG) [Auto]
Precondition: common, a plan named `Plan A: Rev 2/3`
Priority: Medium
Trace: AC-2.2, AC-3.1
1. Click `Export` and open the file. -> The file name has the plan name as `Plan A Rev 23` (characters removed, no replacement space).
2. Read cell A1 of the worksheet. -> The banner shows the plan name as typed, `Plan A: Rev 2/3` (the removal applies to the file name only); this follows open question 7.
Automate: runs every release.
Starting data: plan with that name (card-owned data).
What to check: A1 text equals the typed name.
Clean up: rename the plan back, delete the file.

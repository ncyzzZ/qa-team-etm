# Draft test cases: ETM-6538 Export Gantt Table into Excel File

Story: ETM-6538 [Improvement] Export Gantt Table into Excel File (frozen exam copy).
Source: story.md (description and AC items). No analyst.md or inspector.md exists for this exam: `AC-n` ids below follow the numbering of the Story's Acceptance Criteria list (1.1 = first sub-item of item 1, and so on). No Figma was read; wording of the button and messages comes from the Story only.
Existing [QA] subtasks: none known (exam run).
Priority source: the Story has none, so priority is set by damage if it breaks.

Common precondition: User `TM` (Turnaround Manager, has `Edit Shutdown Logic Table and Visualization` and `View All Shutdown Logic Item`) is logged in. The Active plan `Plan A` of event `Event A` has the Shutdown Logic `Logic A` with saved tasks in the 4-level tree: Platform `PLT-A` and `PLT-B`; each has at least one Work Header, Work and Work Breakdown; at least 12 rows in total (so that No. 10 and above exist); some tasks have predecessors and successors; every optional field is filled on at least one row and empty on at least one other row. The user is on the View Shutdown Logic page. The Manpower Resource histogram is collapsed (`Hide histogram` button) after every load. Role `JO` (Job Owner, view only) is the only other account. Notation: `->` separates action and expected result; "the file" = the .xlsx downloaded by Export; "the sheet" = tab `SD Logic_Master`.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1.1 Export button on toolbar, next to visualization tools | Screen state | Button missing or in the wrong place | TC-001 |
| AC-1.2 Button visible and usable only with Edit permission (hidden otherwise) | Roles and permission | Permission leak | TC-001, TC-002 |
| AC-1.3 View-only users read Gantt, no export; no view permission, no module | Roles and permission | Permission leak, wrong access | TC-002, TC-037 |
| AC-1.4 Empty Gantt (`No data available.`) disables Export | State changes, screen state empty | Export of an empty file; button not re-enabled / not disabled again | TC-003, TC-004 |
| AC-1.5 Only saved records exported | State changes (dirty state) | Draft rows or edits leak into the file | TC-005, TC-006 |
| AC-1.6 Filters, search, collapsed nodes ignored; all rows and columns | Combinations, L-2, L-3, L-5 | Rows missing (truncation) | TC-007, TC-008 |
| AC-2.1 File name `[Event]_[Logic]_[YYYYMMDD].xlsx`, local device date | Edge values (date), real-user view | Wrong name; date off by one near midnight / other timezone | TC-009, TC-010 |
| AC-2.2 Forbidden characters removed, no replacement spaces | Condition table, strange input | Wrong or unsafe file name | TC-011 |
| AC-2.3 Tab name `SD Logic_Master` | Equivalence | Wrong tab name | TC-009 |
| AC-3.1.1 Merged cells rows 1-3 (12 columns) | Condition table | Broken header layout | TC-012 |
| AC-3.1.2 Group banners and sub-headers (Details, Scheduled, Dependencies, Location, Specific Requirement, Work Conflicted) | Condition table | Wrong or missing header text | TC-013 |
| AC-4.1 Data Level per row, 4 levels | Equivalence | Wrong level text | TC-014 |
| AC-4.2 Platform column identical on all descendant rows | Equivalence, linked data | Platform blank on children | TC-015 |
| AC-4.3 Work Header column inherited; `Overall` for Platform rows | Equivalence | Wrong parent name | TC-016 |
| AC-4.4 Row order and No. follow the Gantt tree | State changes, L-1 (numbers sort) | No. 10 after 9; wrong order | TC-014 |
| AC-5.1 Column names Data Level, Work Header, D/N Shift (old names gone) | Equivalence | Old names left | TC-017 |
| AC-5.2 Predecessor / Successor list format `4, 14, 56`, blank if none | Condition table, edge | Refers to wrong No.; wrong separator | TC-018 |
| AC-5.3 SIMOP text and font colours | Condition table | Wrong colour / text | TC-019 |
| AC-5.4 Working Location X / Y text with comma | Equivalence | Number instead of text, lost decimals | TC-020 |
| AC-5.5 POB non-negative integer, blank if unset | Edge values | 0 shown as blank | TC-021 |
| AC-5.6 Specific Requirement (15) and Work Conflicted (20) Yes / No | Condition table (matrix) | Wrong flag | TC-022 |
| AC-5.7 Constraint Type (7 values), Constraint Date format, blank if None | Condition table, edge | Wrong date format; date kept when None | TC-023, TC-033 |
| AC-5.8 Working Calendar Type and text per type | Condition table | Wrong text; Manual Adjust not blank | TC-024, TC-033 |
| AC-6.1 Timescale columns from BR, 2-hour, daily banners | Edge values | Wrong column count / labels | TC-025 |
| AC-6.2 Duration bar plotting | Edge values | Bar wrong, shifted by timezone | TC-026 |
| AC-7.1 Blank optional fields: no `null` / `undefined` | Equivalence, strange input | Text `null` in cells | TC-027 |
| AC-7.2 Alignment and gridlines | Screen state | Wrong alignment | TC-028 |
| Field table: Duration, Start, End format; Work Type, Man-hrs by level; Max lengths | Edge values, field interaction | Wrong format, truncation, wrong level | TC-029, TC-030, TC-031 |
| Strange input in every free-text field | Strange input (cat. 4) | Broken file, formula run | TC-032 |
| Screen states: loading / failure / double click | Error guessing | Duplicate downloads, silent failure | TC-034, TC-035 |
| Two users (cat. 1), other tab | Error guessing | Stale or wrong data | TC-036 |
| Keyboard use | Real-user view | Button not reachable | TC-038 |
| Unsaved draft and leaving the page (Back, breadcrumb, tab, edit page, other logic, reload) | Unsaved changes, leaving and coming back | Draft leaks into file or is lost | TC-039, TC-040 |
| Filter / search / collapse kept after leaving and coming back | Leaving and coming back | Export uses the filtered rows | TC-041, TC-007 |
| Empty plan after Back, draft delete, JO on empty plan | Effects and their reverse | Button state wrong | TC-040, TC-042, TC-049 |
| Later changes: rename Platform, move Work, rename Event/Logic, add/move/remove rows and links, clear values, change calendar type | Effects and their reverse | Stale or old values in the file | TC-043, TC-044, TC-045, TC-024 |
| Large numbers, two panels, strange input in more fields | Grid and input habits | Cut digits, wrong rows, unsafe text | TC-046, TC-047, TC-048, TC-050 |
| Plan saved long ago (cat. 3) | Old data | Defaults missing | TC-033 |

Categories and lessons skipped:
- Cat. 2 Filter + Sort + Search together: relevant only as "export ignores them": TC-007, TC-008.
- Cat. 5 Reordering a list: not relevant, the export does not reorder; order follows the grid (TC-014).
- Cat. 7 Charts that depend on each other: not relevant, no chart is exported (the histogram is not part of the file).
- Cat. 9 Matrix: relevant, handled as expected-value tables in TC-011, TC-019, TC-022, TC-023, TC-024.
- Cat. 6 and 8 (linked data, same data on many pages): relevant, TC-016, TC-018, TC-036.
- L-7 (selected state of a picker): not relevant, no picker. L-8 (Story text changed): this Story copy is frozen; later edits are not covered.
- Cat. 3 old data: TC-033. Cat. 4: TC-032. Cat. 1: TC-036.

Counts: see the end of this file.

## Open questions (not repeated from the analyst: none existed)

1. AC-2.2: if a name consists only of forbidden characters, the part before `_` is empty: what is the file name? (TC-011 writes what a user would call correct: the remaining parts stay and the name does not start with a space.)
2. AC-5.8: the Custom Calendar text is described as "separated by comma and line break" but the example has only line breaks between days. Which is right? TC-024 follows the example (line break between days, comma between intervals of one day).
3. AC-6.1: the timescale labels (01:00, 03:00, ...) are 2-hour columns; is a column labelled 01:00 the slot 00:00-02:00 or 01:00-03:00? Which slots count as "active" when a task starts or ends in the middle of a slot? What does "duration indicator values/shading" hold (a fill colour, a number)? TC-026 checks only what is stated.
4. AC-6.1: banner text `TPSD, Day(1), TPSD, Day(2)`: what is `TPSD` (an event phase?) and does it change per day? TC-025 records the banner texts and compares with the plan's days.
5. AC-4.4 / AC-5.2: are tasks that are dropped, hidden by `Focus Dropped Task`, or critical-path-only filtered counted as normal rows? Is a predecessor that points to a row outside the plan possible?
6. Message when export fails (network, server, plan deleted by another user) is not in the Story. TC-034 and TC-036 write the user's view ("a clear message appears, no file is downloaded").
7. Does the page show any progress or message while the file is made? Is the button disabled during that time?
8. Role without any view permission cannot be tested: the QA account list has only TM and JO. TC-037 covers JO only.
9. The Platform column S "Max 100 chars" and the Work Header column Y "Max 100 chars", but the Description limit is 255 and Remark 500: are these the same limits as the screen allows? TC-031 uses the limits of the field table and what the screen accepts.
10. Does Duration come out in decimal hours as the screen shows it (the module notes say Duration is fitted to the working calendar)? TC-029 compares with the value shown on the grid.
11. Suggestion (not in Story): a toast or message after a successful export.
12. Suggestion (not in Story): export of a plan that is not Active (JO cannot open it, TM can?).
13. If a JO sends the export request directly (not by the button), is it refused? Only the button can be tested from the screen; the check by direct request goes to a security check (TC-002 covers the button only).
14. AC-2.2: should leading and trailing spaces of Event or Logic names be trimmed in the file name? TC-011 does not fail either way, it only requires a complete file.
15. Does the Gantt warn the user when leaving with unsaved changes (Back, breadcrumb, other tab)? The Story is silent; TC-039 expects that the draft is never lost silently and that no warning appears when nothing is left to save.
16. Should Export stay enabled after an unsaved delete of the last task? TC-042 writes enabled, because the saved data still has the task (AC-1.5).
17. Should rows 1 to 3 of the sheet be frozen, and are column widths fixed? The Story is silent (TC-047).
18. Rows of table 3 / Open question 7 (button disabled while the file is made): the disabled state is read in TC-034 only through the double click result.

## Test cases (50 flows)

### TC-001 [FE][MT] Verify the Export button is shown and enabled for the Turnaround Manager (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1, AC-1.2
1. Open the View Shutdown Logic page of `Logic A`. -> The page shows the Gantt table with saved tasks.
2. Look at the top toolbar. -> A button `Export` is shown on the top toolbar.
3. Look at the buttons next to `Export`. -> `Export` sits next to the visualization tools of the toolbar.
4. Check the button state. -> The button is enabled and can be clicked.
Auto spec: Starting data: Active plan with saved tasks. What to check: button visible, enabled, same toolbar group as the visualization controls. Clean up: none. Reason: runs every release, result fixed.

### TC-002 [FE][MT] Verify a view-only Job Owner cannot see Export (NEG) [Auto]
Precondition: common, but logged in as `JO` (Job Owner, view only) on the same Active plan.
Priority: High
Trace: AC-1.2, AC-1.3
1. Open the View Shutdown Logic page of `Logic A`. -> The page opens and shows the Gantt schedule.
2. Look at the top toolbar. -> No `Export` button is shown (it is hidden, not greyed out).
3. Try to change a task in the grid. -> The grid does not let the user edit.
4. Reload the page. -> The page shows the same schedule and still has no `Export` button.
5. Press Tab through the whole top toolbar. -> Focus never lands on an export control; no hidden `Export` button takes focus.
6. Log in again as `TM` and open the same page. -> The `Export` button is shown again.
Auto spec: Starting data: both accounts from `.env`. What to check: Export button count in the page is 0 (not only invisible) for JO and 1 for TM; Tab order has no export control for JO. Clean up: none. Direct request of the export address as JO: see Open question 13. Reason: permission leak is High and cheap to repeat.

### TC-003 [FE][MT] Verify Export is disabled when the Gantt is empty (NEG) [Auto]
Precondition: the Active plan has a Shutdown Logic with no saved task; the Gantt shows `No data available.`
Priority: High
Trace: AC-1.4
1. Open the View Shutdown Logic page of the empty Shutdown Logic. -> The Gantt shows `No data available.`
2. Look at the `Export` button. -> The button is shown greyed out.
3. Click the button. -> Nothing happens: no file is downloaded and no message appears.
4. Press Tab until the button has focus, then press Enter. -> Nothing happens: no file is downloaded.
Auto spec: Starting data: card-owned Shutdown Logic with no tasks. What to check: button `disabled`, no download event within 3 seconds. Clean up: none.

### TC-004 [FE][MT] Verify Export follows the data when the first task is saved and when the last is deleted (POS) [Partial: needs write on a card-owned plan]
Precondition: card-owned Shutdown Logic with no saved task (data owned by this card).
Priority: Medium
Trace: AC-1.4
1. Open the empty Shutdown Logic. -> `No data available.` is shown and `Export` is greyed out.
2. Add one Work Header and save. -> The Gantt shows the new row.
3. Look at the `Export` button. -> The button is enabled.
4. Delete the only saved task and save. -> The Gantt shows `No data available.`
5. Look at the `Export` button. -> The button is greyed out again.
6. Reload the page. -> `No data available.` is shown and the button is still greyed out.
Auto spec: Starting data: card-owned empty logic. What to check: button state after each step. Clean up: delete the added row. Partial because it changes data.

### TC-005 [FE][BE][MT] Verify unsaved draft edits and new items are not exported (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-1.5
1. Note down the saved Description of one Work row, `Work 1`, and the total number of rows. -> The values are written down for comparison.
2. Change the Description of `Work 1` to `Draft change` and do not save. -> The grid shows `Draft change` and the page has unsaved changes.
3. Add a new Work row named `Draft new row` and do not save. -> The new row is shown in the grid.
4. Click `Export`. -> One .xlsx file is downloaded.
5. Open the file and find `Work 1`. -> The Description is the saved value written down in step 1, not `Draft change`.
6. Search the sheet for `Draft new row`. -> The text is not found and the row count equals the saved rows written down in step 1.
7. Look at the page. -> The unsaved edits are still shown in the grid, untouched by the export.
Auto spec: Starting data: card-owned plan. What to check: file rows equal DB rows, draft text absent. Clean up: discard the draft, do not save.

### TC-006 [FE][BE][MT] Verify saved edits appear in the next export and undone edits do not (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.5
1. Change the Remark of one row to `Saved remark A` and click Save. -> The grid shows `Saved remark A`.
2. Click `Export` and open the file. -> The Remark column of that row shows `Saved remark A`.
3. Change the Remark to `Undone remark`, then type the old text back by hand and do not save. -> The page returns to the same state as after the last Save.
4. Click `Export` and open the file. -> The Remark still shows `Saved remark A`.
5. Reload the page and click `Export`. -> The file shows `Saved remark A` again and the same row count.
Auto spec: Clean up: restore the original Remark and save.

### TC-007 [FE][BE][MT] Verify column filters, search and the Filter Panel are ignored by the export (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.6
1. Note down the total number of saved rows in the plan. -> The number is written down.
2. Type a search text that matches only one row. -> The grid shows only the matching rows.
3. Set the first filter of the table below. -> The grid shows fewer rows than in step 1.
4. Click `Export`. -> One .xlsx file is downloaded.
5. Count the data rows in the sheet. -> The count equals the number written down in step 1.
6. Look at the grid. -> The search text and the filter are still active and the grid still shows the reduced rows.
7. Clear the filter and the search. -> The grid shows all rows again.
8. Repeat steps 3 to 7 for every filter of the table, then set two filters of different kinds together and click `Export`. -> Every file has the same row count as step 1.
9. Click `Export` with no filter and no search. -> The file content equals the file made with the filters on.

Filters to loop over:

| Filter kind | Example |
|---|---|
| Text filter on a column | a Description text that matches one row |
| List filter on a column | one Job Owner only |
| Number filter | Man-hrs. greater than a value |
| Date-range filter | Start inside a short range |
| Toggle (Focus Dropped Task, critical path only) | switched on |
| Filter that leaves a parent with no child shown | a text that matches only a Work Breakdown row, so its Platform, Work Header and Work parents are not matched |

Auto spec: What to check: row count equals saved count with each filter, with two at once, and with all off (same file content). Clean up: clear filters.

### TC-008 [FE][BE][MT] Verify collapsed branches are fully exported at every level (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.6
1. Collapse every Platform with `-`. -> Only Platform rows are shown.
2. Click `Export`. -> A file is downloaded.
3. Count rows by Data Level in the sheet. -> The counts of Platform, Work Header, Work and Work Breakdown rows equal the counts in the saved plan.
4. Expand all, then collapse only one Work Header and one Work, and click `Export`. -> The counts are the same as in step 3.
5. Look at the grid. -> The collapse state is unchanged by the export.
Auto spec: Data set: collapse states (all Platform, one Work Header, one Work, none). Expected counts are the same for all.

### TC-009 [FE][BE][MT] Verify the file name pattern and the tab name (POS) [Auto]
Precondition: common. `Event A` is named `Event A` and the logic `Logic A`.
Priority: High
Trace: AC-2.1, AC-2.3
1. Record today's date on this device. -> The date is written down as YYYYMMDD.
2. Click `Export`. -> The browser downloads one file directly, with no extra page.
3. Look at the file name. -> The name is `Event A_Logic A_<date written down>.xlsx`.
4. Open the file and look at the tabs. -> The primary tab is named `SD Logic_Master` and no tab is named `Sheet1`.
5. Repeat steps 1 to 3 with the browser timezone set to UTC+14 (`Pacific/Kiritimati`), then with UTC-11 (`Pacific/Pago_Pago`). -> Each name has the local date of that timezone, not the UTC date.
Auto spec: What to check: suggested file name from the download event, tab list from the file; run twice more with Playwright `timezoneId` set to `Pacific/Kiritimati` and `Pacific/Pago_Pago`, so a UTC-date bug is caught by a script too (it differs from the local date for most of the day). Clean up: delete the file.

### TC-010 [BE][MT] Verify the date in the file name follows the device local date near midnight (BND) [Manual: needs the device clock and timezone changed]
Precondition: common
Priority: High
Trace: AC-2.1
1. Set the device timezone to one where the local date is already the next day compared with UTC (for example UTC+7 at 23:30 local). -> The device clock shows 23:30 local time.
2. Click `Export`. -> A file is downloaded.
3. Look at the date in the file name. -> It is the local date of the device, not the UTC date.
4. Set the device timezone to one where the local date is the previous day compared with UTC, and click `Export`. -> The date in the name is again the local date of the device.
5. Wait until the local clock passes 00:00 and click `Export`. -> The date in the name is the new local day.
Reason: needs a changed device clock, rare, a person must judge the result.

### TC-011 [BE][MT] Verify forbidden characters are removed from the file name without spaces (NEG) [Auto]
Precondition: card-owned events and logics named as in the table below (only names the screen lets the user type).
Priority: High
Trace: AC-2.2
1. Open the View Shutdown Logic page for the first row of the table. -> The page shows the Gantt.
2. Click `Export`. -> A file is downloaded.
3. Compare the file name with the table. -> The name equals the expected name of that row.
4. Repeat steps 1 to 3 for every row of the table. -> Every name equals its expected name.

Expected values (the test loops over every row; `YYYYMMDD` = local date):

| Event name | Logic name | Expected file name |
|---|---|---|
| `Event A` | `Logic A` | `Event A_Logic A_YYYYMMDD.xlsx` |
| `Ev\ent` | `Log/ic` | `Event_Logic_YYYYMMDD.xlsx` |
| `Ev:ent` | `Log*ic` | `Event_Logic_YYYYMMDD.xlsx` |
| `Ev?ent` | `Log"ic` | `Event_Logic_YYYYMMDD.xlsx` |
| `Ev<e>nt` | `Log\|ic` | `Event_Logic_YYYYMMDD.xlsx` |
| `Ev<ent` | `Logic>` | `Event_Logic_YYYYMMDD.xlsx` (each of `<` and `>` alone is removed) |
| `  Event A  ` (leading and trailing spaces) | `Logic A` | the name as the screen keeps it, with no empty part and no error; a name that begins with a space is shown to the lead (see Open question 14) |
| An Event name of the longest length the screen accepts | `Logic A` | a file is downloaded and its name is complete, or the user sees a clear message; never a broken file |
| `Event & #1 %2 'x'` | `Logic A` | `Event & #1 %2 'x'_Logic A_YYYYMMDD.xlsx` (allowed characters stay) |
| `A \ B` | `C / D` | `A  B_C  D_YYYYMMDD.xlsx` (only the character is deleted, the spaces around it stay) |
| `Ev.ent 2026` | `Logic-1_v2` | `Ev.ent 2026_Logic-1_v2_YYYYMMDD.xlsx` (allowed characters stay) |
| Thai `เหตุการณ์ A` | `Logic A` | `เหตุการณ์ A_Logic A_YYYYMMDD.xlsx` |
| `:::` | `Logic A` | `_Logic A_YYYYMMDD.xlsx` (only the forbidden characters are removed, the empty Event part stays; see Open question 1) |

Auto spec: Starting data: events and logics created and owned by this card. Clean up: delete them.

### TC-012 [BE][MT] Verify the merged cells of rows 1 to 3 (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1.1
1. Click `Export` and open the sheet `SD Logic_Master`. -> The sheet opens.
2. Read the merged ranges of the sheet. -> Each range in the table below exists.
3. Read the text of the first cell of each range. -> It equals the header name in the table.

Expected values (the test loops over every row):

| Range | Text |
|---|---|
| A1:A3 | `No.` |
| B1:B3 | `Data Level` |
| Y1:Y3 | `Work Header` |
| Z1:Z3 | `Manpower Resource` |
| AA1:AA3 | `POB` |
| AB1:AB3 | `Man-hrs.` |
| AC1:AC3 | `D/N Shift` |
| AD1:AD3 | `Remark` |
| BN1:BN3 | `Constraint Type` |
| BO1:BO3 | `Constraint Date` |
| BP1:BP3 | `Working Calendar Type` |
| BQ1:BQ3 | `Working Calendar` |

Auto spec: What to check: merge ranges and values from the file. Clean up: delete the file.

### TC-013 [BE][MT] Verify group banners and sub-headers (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.1.2
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read row 1 to 2 merged banners and row 3 sub-headers for each group in the table. -> Each banner and each sub-header equals the table.

Expected values (loop):

| Banner (rows 1-2) | Range | Row 3 sub-headers in order |
|---|---|---|
| `Details` | C1:L2 | Description, Work Type, Work Number, Activity Group, Priority, System Condition, Job Owner, Department, Accommodation, Hot Bed |
| `Scheduled` | M1:O2 | Duration, Start Date, End Date |
| `Dependencies` | P1:R2 | Predecessor, Successor, SIMOP |
| `Location` | S1:X2 | Platform, Equipment Number, Functional Location, Working Location (Deck), Working Location (X), Working Location (Y) |
| `Specific Requirement` | AE1:AS2 | 15 sub-headers, from `P/L Pressure Bleeding` to `Crew Boat`, same names and order as the Specific Requirement list of the app |
| `Work Conflicted` | AT1:BM2 | 20 sub-headers, from `Confined Space Entry` to `Run Diesel Engine`, same names and order as the Work Conflict Matrix of the app |

3. Count the sub-headers under `Specific Requirement` and `Work Conflicted`. -> There are 15 and 20.
Auto spec: the 15 and 20 names come from the app's own lists read in the test.

### TC-014 [BE][MT] Verify Data Level, row order and No. follow the Gantt tree (POS) [Auto]
Precondition: common (at least 12 rows)
Priority: High
Trace: AC-4.1, AC-4.4
1. Expand all rows in the Gantt and write down the rows from top to bottom with their level and name. -> The list is written down.
2. Click `Export` and open the sheet. -> The sheet opens.
3. Read columns A, B and C from row 4 down. -> The rows are in the same order as the Gantt: Platform, then its Work Headers, then each Work, then its Work Breakdowns.
4. Check column A. -> No. is 1, 2, 3, ... with no gap and no duplicate, also after 9 (10 comes after 9, not after 1).
5. Check column B. -> Every row shows exactly one of `Platform`, `Work Header`, `Work`, `Work Breakdown`, matching the level of that row in the Gantt.
6. Compare the Description of the first and last row with the Gantt. -> They are the same.
Auto spec: What to check: order and level equal the grid store. Clean up: none.

### TC-015 [BE][MT] Verify the Platform column is the same on every descendant row (POS) [Auto]
Precondition: common (two platforms `PLT-A` and `PLT-B`)
Priority: High
Trace: AC-4.2
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read column S for every row of `PLT-A` (the Platform row and all rows below it). -> Every cell shows `PLT-A`.
3. Read column S for every row of `PLT-B`. -> Every cell shows `PLT-B`.
4. Check that no row of `PLT-A` shows `PLT-B` and the other way round. -> No row is mixed.
5. Check that no cell of column S is blank. -> All cells have a platform name.

### TC-016 [BE][MT] Verify the Work Header column is inherited and the Platform rows show `Overall` (POS) [Auto]
Precondition: common (two Work Headers `WH-1` and `WH-2` under one platform)
Priority: High
Trace: AC-4.3
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read column Y on each Platform row. -> It shows `Overall`.
3. Read column Y on the `WH-1` row and on every Work and Work Breakdown row below it. -> Every cell shows `WH-1`.
4. Read column Y on the `WH-2` row and rows below it. -> Every cell shows `WH-2`.
5. Rename `WH-1` to `WH-1 new` in the Gantt, save and export again. -> Column Y shows `WH-1 new` on the same rows, and the old name no longer appears.
Auto spec: Clean up: rename back and save (card-owned plan).

### TC-017 [BE][MT] Verify the renamed column headers (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-5.1
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read B3, Y3 and AC3. -> B3 shows `Data Level`, Y3 shows `Work Header`, AC3 shows `D/N Shift`.
3. Search row 1 to 3 for `Type`, `Work Group` and `Shift` as whole header names. -> `Type`, `Work Group` and plain `Shift` are not used as header names (`Constraint Type`, `Work Type` and `Working Calendar Type` are fine).

### TC-018 [BE][MT] Verify Predecessor and Successor lists use the No. numbers and the right format (POS) [Auto]
Precondition: common. One task has three predecessors, one has one successor, and one has none.
Priority: High
Trace: AC-5.2
1. Click `Export` and open the sheet. -> The sheet opens.
2. For the task with three predecessors read column P. -> The cell is text like `4, 14, 56`: numbers separated by a comma and one space, no trailing comma.
3. Take the No. in column A of each predecessor in the Gantt tree. -> They equal the numbers in step 2, not the task id of the database.
4. Read column Q of one of those predecessor rows. -> It lists the No. of the task from step 2.
5. Read P and Q for a task with no predecessor and no successor. -> Both cells are blank.
6. Check a list with a number of 10 or more. -> The numbers are in the order the Gantt shows (see Open question 5), with a space after each comma.
Auto spec: What to check: P and Q computed from the dependency store and the exported No. column. Data set: three predecessors, one, none.

### TC-019 [BE][MT] Verify SIMOP text and font colour (POS) [Auto]
Precondition: common. Rows with SIMOP Allow, Restriction, Prohibit and none exist.
Priority: High
Trace: AC-5.3
1. Click `Export` and open the sheet. -> The sheet opens.
2. For each row of the table read the text and the font colour of column R. -> They equal the table.

Expected values (loop):

| SIMOP in the app | Text in column R | Font colour |
|---|---|---|
| Allow | `Allow` | #00B050 (green) |
| Restriction | `Restriction` | #FA8C16 (orange) |
| Prohibit | `Prohibit` | #FF0000 (red) |
| none | blank | no text |

3. Compare the colour of one row in the Gantt grid with the file. -> The colour family is the same as in the app.

### TC-020 [BE][MT] Verify Working Location X and Y are text with comma-separated numbers (POS) [Auto]
Precondition: common. One row has X `12.5, 14.0` and Y `30.2, 45.1`; one row has none.
Priority: Medium
Trace: AC-5.4
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read W and X of the row with values. -> W shows `12.5, 14.0` and X shows `30.2, 45.1` as text (the `.0` is kept, no date or number conversion).
3. Read W and X of the row with none. -> Both cells are blank.

### TC-021 [BE][MT] Verify POB is a non-negative integer and blank when unset (BND) [Auto]
Precondition: common. Rows with POB 0, 1, a large value such as 250, and unset.
Priority: Medium
Trace: AC-5.5
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read column AA for the row with POB 0. -> The cell shows `0` (not blank).
3. Read column AA for POB 1 and for 250. -> The cells show `1` and `250` with no decimals.
4. Read column AA for the row with POB unset. -> The cell is blank.
5. Check that no cell of column AA is negative or has a decimal. -> All cells are whole numbers.

### TC-022 [BE][MT] Verify all 35 requirement and conflict flags show Yes or No (POS) [Auto]
Precondition: common. One Work row with every Specific Requirement and Work Conflicted option set to Yes, one with all set to No, one with a mix (the screen can make all of these).
Priority: High
Trace: AC-5.6
1. Click `Export` and open the sheet. -> The sheet opens.
2. For each of the three rows read columns AE to AS (15) and AT to BM (20). -> Each cell equals the expected value of the table.

Expected values (the test loops over every column):

| Row set in the app | Columns AE to AS and AT to BM |
|---|---|
| All Yes | `Yes` in all 35 cells |
| All No | `No` in all 35 cells |
| Mix (every second option Yes) | `Yes` for the options set, `No` for the others, each column matches the option of the same name in the app |
| Row never edited (default) | `No` in all 35 cells (no blank cell) |

3. Check Platform and Work Header rows. -> They also show `Yes` or `No` in all 35 columns (never blank).

### TC-023 [BE][MT] Verify Constraint Type values and Constraint Date format (POS) [Auto]
Precondition: common. Seven rows, one for each constraint type; the `Must start on` row has the date `02 Jan 2025, 15:30`.
Priority: High
Trace: AC-5.7
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read columns BN and BO of each row. -> They equal the table.

Expected values (loop):

| Constraint Type in the app | BN | BO |
|---|---|---|
| none set (default) | `None` | blank |
| Start no earlier than | `Start no earlier than` | `dd Mmm yyyy, hh:mm` of the saved date |
| Start no later than | `Start no later than` | same format |
| Finish no earlier than | `Finish no earlier than` | same format |
| Finish no later than | `Finish no later than` | same format |
| Must start on | `Must start on` | `02 Jan 2025, 15:30` |
| Must finish on | `Must finish on` | same format |

3. Check one date with a single-digit day and a midnight time such as `05 Jun 2026, 00:00`. -> It shows `05 Jun 2026, 00:00` (two-digit day, 24-hour time, month as three letters).
4. Change a constraint back to `None` in the app, save, and export again. -> BN shows `None` and BO is blank (the old date is not kept).
Auto spec: Clean up: restore the original constraints.

### TC-024 [BE][MT] Verify Working Calendar Type and the text per type (POS) [Auto]
Precondition: common. One row per type: Resource Calendar with shifts `Dayshift` and `Nightshift`; Custom Calendar with Sunday 00:00-18:00 and 20:00-24:00, Wednesday 08:00-16:00, Friday 07:00-24:00; Manual Adjust.
Priority: High
Trace: AC-5.8
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read BP and BQ of each row. -> They equal the table.

Expected values (loop):

| Type | BP | BQ |
|---|---|---|
| Resource Calendar | `Resource Calendar` | `Dayshift, Nightshift` |
| Custom Calendar | `Custom Calendar` | 3 lines in one cell: `SUN 00:00-18:00, 20:00-24:00`, `WED 08:00-16:00`, `FRI 07:00-24:00` (see Open question 2) |
| Manual Adjust | `Manual Adjust` | blank (not `null`) |
| Row never set (default) | `Resource Calendar` | the shift names of the resource |

3. Check that the Custom Calendar cell keeps its line breaks. -> The cell shows the three days on separate lines when wrap is on.
4. In the Gantt change the type of the Custom Calendar row to Manual Adjust, save, click `Export` and read BP and BQ of that row. -> BP shows `Manual Adjust` and BQ is blank, with no old Custom text left.
5. Change the type of the same row back to Custom Calendar with the same days, save, click `Export` and read BQ. -> BQ shows the three-line text again.

### TC-025 [BE][MT] Verify the timescale columns start at BR in 2-hour steps (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-6.1
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read row 3 from column BR. -> The labels run `01:00, 03:00, 05:00, 07:00, 09:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00, 23:00` and then repeat for the next day.
3. Check that every day has 12 columns. -> Each day has 12 columns and the first column of the sheet's timeline is BR (column 70).
4. Read the merged banners above each day. -> A merged banner sits over the 12 columns of each day, in order `TPSD`, `Day(1)`, `TPSD`, `Day(2)`, and so on (see Open question 4).
5. Compare the first and last day with the plan's days. -> The timeline covers every day the tasks use, from the first to the last day, with no day missing.

### TC-026 [BE][MT] Verify the duration bar covers the scheduled time and nothing else (BND) [Partial: slot rule is not fixed in the Story]
Precondition: common. Tasks: one inside one day, one that crosses midnight, one that starts and ends in the same 2-hour slot, one with Start `02 Jan 2025, 15:30` and End `02 Jan 2025, 18:00`.
Priority: Medium
Trace: AC-6.2
1. Click `Export` and open the sheet. -> The sheet opens.
2. For each task find the first and last filled slot in its row. -> The filled slots run without a gap from the slot of the Start to the slot of the End.
3. Check the slots before the start and after the end. -> They are blank.
4. Check the task that crosses midnight. -> The filled slots continue into the next day's columns.
5. Check the task inside one slot. -> At least that slot is filled (see Open question 3).
6. Compare Start and End in columns N and O with the filled slots. -> They match (no shift by hours from a timezone).
Reason for Partial: the slot rule at the edges is not stated.

### TC-027 [BE][MT] Verify empty optional fields are blank cells, never `null` or `undefined` (NEG) [Auto]
Precondition: common. One Work Breakdown with every optional field empty (Work Number, Activity Group, Priority, System Condition, Job Owner, Department, Accommodation, Hot Bed, Predecessor, Successor, SIMOP, Equipment Number, Functional Location, Working Location, Manpower Resource, POB, Man-hrs., D/N Shift, Remark).
Priority: High
Trace: AC-7.1
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read every optional cell of that row. -> Every cell is empty.
3. Search the whole sheet for `null` and `undefined`. -> Neither text is found.
4. Search the whole sheet for `NaN` and `[object Object]`. -> Neither text is found.
5. Check Hot Bed, Priority and Accommodation of that row. -> They are blank, not `No` or a default.
Auto spec: What to check: no cell string equals `null`, `undefined`, `NaN`; empty cells have no value.

### TC-028 [BE][MT] Verify alignment and gridlines (POS) [Partial: alignment read from cell style, gridlines by eye]
Precondition: common
Priority: Medium
Trace: AC-7.2
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read the alignment of Description, Start Date and End Date cells. -> They are left-aligned.
3. Read the alignment of No., POB and the other integer columns. -> They are center-aligned.
4. Read the alignment of Duration and Man-hrs. cells. -> They are right-aligned.
5. Look at the sheet in Excel. -> Gridlines are visible over the whole sheet.

### TC-029 [BE][MT] Verify Duration, Start Date and End Date match the grid and the format (POS) [Auto]
Precondition: common. A task with Start `02 Jan 2025, 15:30`, a task with a decimal duration, a task starting at `00:00` and one ending at `23:59`.
Priority: High
Trace: none (field table: Duration, Start Date, End Date)
1. Write down Duration, Start and End of four rows as the grid shows them. -> The values are written down.
2. Click `Export` and open the sheet. -> The sheet opens.
3. Read M, N and O of the same rows. -> Duration equals the grid value as a number in hours (decimal, right-aligned); Start and End show `dd Mmm yyyy, hh:mm` and equal the grid with no shift of day or hour.
4. Check that N and O are not empty on any row. -> Every row has a Start and an End.
Auto spec: What to check: file cell equals the grid value read in the same test (Duration is fitted to the working calendar, so read the shown value).

### TC-030 [BE][MT] Verify Work Type, Work Number and Man-hrs. by level (POS) [Auto]
Precondition: common. Work and Work Breakdown rows from the Worklist with each Work Type: `Work Order`, `Notification`, `MOD`, `Simple MOD`, `Other`.
Priority: Medium
Trace: AC-4.1
1. Click `Export` and open the sheet. -> The sheet opens.
2. Read column D of Platform and Work Header rows. -> The cells are blank.
3. Read column D of Work and Work Breakdown rows. -> Each shows one of the five types, equal to the Worklist.
4. Read column AB of Platform, Work Header and Work rows. -> The cells are blank.
5. Read column AB of Work Breakdown rows. -> They show the Man-hrs. of the Worklist.
6. Read column E of one Work Order row and one Notification row. -> They show the SAP number of the Worklist.

### TC-031 [BE][MT] Verify long values at the field limits are fully exported (BND) [Auto]
Precondition: common. Values the screen accepts at the limit: Description 255 characters, Remark 500, Job Owner 100, Department 100, Platform name 100, Work Header name 100, Work Number 50.
Priority: Medium
Trace: none (field table: Max Length)
1. Save a row with each value at its limit (exact limit). -> The values are saved.
2. Click `Export` and open the sheet. -> The sheet opens.
3. Read each cell. -> Each cell holds the full value, same length as the grid (no cut-off, no `...`).
4. Try to type one character more than the limit for Description and Remark in the app. -> The screen stops or rejects the extra character, so a longer value is never exported.
Auto spec: Clean up: restore the original values.

### TC-032 [BE][MT] Verify strange text in every free-text field is exported as typed (Exotic: strange input) [Auto]
Precondition: card-owned rows. Values only that the screen lets the user type, one value per field: Platform name, Work Header name, Work name, Work Breakdown name (Description), Work Number, Activity Group, Job Owner, Department, Equipment Number, Functional Location, Working Location (Deck), Remark.
Priority: Medium
Trace: none (strange input in every free-text field)
1. Save each field with one of these values in turn: `a\b/c:d*e?f"g<h>i|j&k#l%m'n`; `  leading and trailing  `; `<b>bold</b>`; `สวัสดี 😀`; `=1+1`; `Line one` then a new line then `Line two` (Remark only). -> The values are saved and shown in the grid.
2. Click `Export` and open the sheet. -> The sheet opens without a repair message.
3. Read each cell. -> The text equals the grid text; `<b>bold</b>` is plain text; Thai and emoji are intact; the new line is kept in the Remark cell.
4. Check the cell with `=1+1`. -> It shows the text `=1+1` and is not calculated as a formula (not `2`).
5. Read column S and Y of rows that carry a special Platform or Work Header name. -> The same special text is shown on all descendant rows.
6. Look at the file name for an Event or Logic with such characters. -> The file name follows the sanitization rule.
Auto spec: Data set: the six values above, looped through every field. Clean up: restore names.

### TC-033 [BE][MT] Verify an old plan with missing optional data exports defaults and blanks (POS) [Manual: needs an old plan on QA]
Precondition: an old plan saved before Constraint and Working Calendar existed (oldest on QA, plus one from the middle).
Priority: Medium
Trace: AC-5.7, AC-5.8
1. Open the old plan and write down the Constraint Type and Working Calendar of three rows. -> The values are written down.
2. Click `Export` and open the sheet. -> The sheet opens without an error.
3. Read BN, BO, BP and BQ of the same rows. -> BN shows `None` with BO blank; BP shows `Resource Calendar`; BQ follows the rule of its type; none shows `null`.
4. Compare the row count and levels with the grid. -> They are equal.
Reason: depends on QA data that cannot be made safely.

### TC-034 [FE][BE][MT] Verify the Export button does not make two files on a double click (Exotic: double click) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Double-click `Export` fast. -> Only one file is downloaded (or the second click is ignored) and the page stays usable.
2. Check the downloads list. -> There is one file for the double click, not two files with the same name and `(1)`.
3. Click `Export` again after the first download. -> A new file is downloaded normally.
Auto spec: What to check: number of download events is 1.

### TC-035 [FE][BE][MT] Verify the user is told when the export fails (Exotic: connection lost) [Manual: needs the network cut at the right moment]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Switch the network off in the browser developer tools. -> The browser is offline.
2. Click `Export`. -> A clear message appears that the export did not work; no half file is downloaded.
3. Switch the network on and click `Export` again. -> The file is downloaded normally and has all rows.
4. Click `Export` on a very slow connection (throttled) and wait. -> The file arrives complete, or the user sees a message; there is no empty file (see Open question 7).

### TC-036 [FE][BE][MT] Verify the export uses the latest saved data when another user changes the plan (Exotic: two users) [Manual: two real sessions]
Precondition: common. `TM` is logged in in two browsers (tab 1 and tab 2) on the same plan.
Priority: Medium
Trace: AC-1.5
1. In tab 2 change the Description of `Work 1` to `Changed by user 2` and save. -> The change is saved.
2. In tab 1, which still shows the old Description, click `Export`. -> A file is downloaded.
3. Read `Work 1` in the file. -> It shows `Changed by user 2` (the saved data), not the old text on the screen of tab 1.
4. In tab 2 delete the whole plan's Shutdown Logic, then click `Export` in tab 1. -> A clear message appears (see Open question 6), no broken file is downloaded.
Reason: two real users and shared data.

### TC-037 [FE][MT] Verify a Job Owner opens the page and reads the Gantt but cannot change or export (NEG) [Manual: only JO exists; no-view user not available]
Precondition: logged in as `JO`; an Active plan and a plan that is not Active.
Priority: Medium
Trace: AC-1.3
1. Open the View Shutdown Logic page of the Active plan. -> The Gantt schedule is shown read-only.
2. Look for `Export`. -> There is no `Export` button.
3. Open the address of a plan that is not Active by a direct link. -> The page does not open the plan (the user cannot open a plan that is not Active).
4. Note down that the case of a user with no view permission is not available. -> The gap is recorded in Open question 8.

### TC-038 [FE][MT] Verify the Export button can be used with the keyboard (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-1.1
1. Press Tab until `Export` has focus. -> The button shows a focus frame.
2. Press Enter. -> One file is downloaded.
3. Press Tab again, then Shift+Tab back to `Export` and press Space. -> A second file is downloaded.

### TC-039 [FE][MT] Verify leaving the page with an unsaved draft warns only when there is something to save, and Export after coming back uses saved data (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-1.5
1. Change the Description of `Work 1` to `Draft away` and do not save. -> The grid shows `Draft away`.
2. Click the browser Back button, then Forward. -> The page asks the user before leaving (the user would call it correct to be warned about unsaved work) or keeps the draft; the draft is never lost silently (see Open question 15).
3. Click `Export` and read `Work 1` in the file. -> The saved Description is exported, not `Draft away`.
4. Change `Work 1` to `Draft away 2`, then type the saved text back by hand. -> The grid shows the saved text and the Save button is disabled again.
5. Click the breadcrumb to the plan and open the Gantt again. -> The page opens with no warning, because nothing is left to save.
6. Change `Work 1` to `Draft away 3`, open another Shutdown Logic tab of the same plan and come back. -> The page opens with the draft or a warning; the draft is not lost silently.
7. Click `Export` and read `Work 1`. -> The saved Description is exported.
8. Reload the page with `Draft away 3` still unsaved, then click `Export`. -> The file holds the saved Description and the page shows the saved value (the draft is gone after reload).
9. Open the edit page of one item, close it without saving and come back to the Gantt. -> The Gantt shows the saved data and `Export` works.
10. Open the Gantt of another logic of the same plan with a draft left in the first, then click `Export`. -> The file is the other logic's saved data, with the file name of that logic.
Auto spec: Starting data: card-owned plan. What to check: file text equals saved text after each navigation; warning dialog seen or not. Clean up: discard drafts.

### TC-040 [FE][MT] Verify a Job Owner is never warned on leaving and sees no Export on an empty plan (NEG) [Auto]
Precondition: logged in as `JO`; one Active plan with saved tasks and one Active plan whose Gantt is empty (`No data available.`).
Priority: Medium
Trace: AC-1.2, AC-1.3, AC-1.4
1. Open the Gantt with tasks, then click the breadcrumb back to the plan. -> No warning or confirm dialog appears.
2. Open the empty Gantt. -> `No data available.` is shown with no `Export` button and no message about export.
3. Press Browser Back to the plan and Forward again. -> The empty Gantt shows again, still with no `Export` button.
Auto spec: What to check: no dialog event; Export button count 0. Clean up: none.

### TC-041 [FE][BE][MT] Verify Export ignores a filter, search or collapse that is kept after leaving and coming back (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.6
1. Note down the total number of saved rows. -> The number is written down.
2. Set a column filter, type a search text and collapse one Platform. -> The grid shows fewer rows.
3. Click the browser Back button, then Forward. -> The page shows again; the filter and search are either still on or reset, as the page decides.
4. Click `Export` and count the data rows. -> The count equals step 1.
5. Click the breadcrumb to the plan and open the Gantt again, then click `Export`. -> The count equals step 1.
6. Open the edit page of one task, close it, and click `Export` on the Gantt. -> The count equals step 1.
7. Reload the page and click `Export`. -> The count equals step 1 whether the filter survived the reload or not.
8. Open the Gantt of another logic of the same plan, with a filter set in the first one, and click `Export`. -> The file holds all rows of that other logic.
9. Only set a filter and leave the page by the breadcrumb. -> No warning about unsaved changes appears, because a filter is not a change.
Auto spec: What to check: row count equals saved count after each navigation. Clean up: clear filters.

### TC-042 [FE][BE][MT] Verify Export state on the empty plan after coming back and after a draft delete (BND) [Auto]
Precondition: card-owned Shutdown Logic with one saved task (data owned by this card).
Priority: Medium
Trace: AC-1.4, AC-1.5
1. Delete the only task and do not save. -> The grid shows no task or `No data available.` and the page has unsaved changes.
2. Look at the `Export` button. -> The button stays enabled, because the saved data still has the task (see Open question 16).
3. Click `Export`. -> The file still holds the saved task at its old place.
4. Move a saved task to another place (indent or move) and do not save, then click `Export`. -> The file shows the task at its saved place.
5. Discard the draft, save the delete, then click the breadcrumb and open the Gantt again. -> `No data available.` is shown and `Export` is greyed out.
6. Click Browser Back and Forward. -> The button is still greyed out.
Auto spec: Starting data: card-owned logic with one task. What to check: button state and file content per step. Clean up: restore the task.

### TC-043 [BE][MT] Verify Platform, Work Header, file name and moved rows follow later changes (POS) [Auto]
Precondition: card-owned plan with the 4-level tree.
Priority: High
Trace: AC-2.1, AC-4.2, AC-4.3
1. Rename Platform `PLT-A` to `PLT-A2`, save and click `Export`. -> Column S shows `PLT-A2` on every descendant row of that Platform.
2. Move one Work to another Work Header, save and click `Export`. -> Column Y of that Work and its Work Breakdown rows shows the new Work Header.
3. Rename the Event on Event Details and click `Export`. -> The file name has the new Event name.
4. Rename the Logic on the plan card and click `Export`. -> The file name has the new Logic name.
Auto spec: What to check: columns S and Y, file name after each change. Clean up: restore names and position.

### TC-044 [BE][MT] Verify No., Predecessor and Successor follow added, moved and removed rows (POS) [Auto]
Precondition: card-owned plan with linked tasks.
Priority: High
Trace: AC-4.4, AC-5.2
1. Add a new row above a linked task, save and click `Export`. -> No. of the following rows is one higher and the Predecessor and Successor columns use the new numbers.
2. Move a linked task to another place, save and click `Export`. -> No., P and Q match the new order.
3. Remove one link in the Gantt, save and click `Export`. -> The Predecessor and Successor cells of both tasks are blank again for that link.
4. Include one dropped task, one task hidden by `Focus Dropped Task` and one task that is critical-path only in the plan, then click `Export`. -> They are exported as normal rows with a No. in the tree order (see Open question 5).
Auto spec: What to check: No., P, Q against the grid after each change. Clean up: remove the added row and restore links.

### TC-045 [BE][MT] Verify a value that is set and then cleared is blank again in the file (POS) [Auto]
Precondition: card-owned row with every value below set and exported once.
Priority: High
Trace: AC-5.3, AC-5.5, AC-5.6, AC-5.8, AC-7.1
1. Clear SIMOP on one row, save and click `Export`. -> The SIMOP cell is blank and has no old colour or text.
2. Clear POB on the same row, save and click `Export`. -> The POB cell is blank, not `0`.
3. Set one Specific Requirement option to Yes, export, then set it back to No, save and export. -> The cell shows `Yes` then `No`.
4. Clear one other optional field, save and export. -> The cell is empty, not a space, `0` or the old value.
5. Change the Start of one task, save, change an unrelated field of the same task, save and reload, then click `Export`. -> Start, End and Duration equal the grid, with no shift of a day or an hour.
6. Change Work Type, Work Number and Man-hrs. in the Worklist for a row that already exists in the Gantt, then click `Export`. -> The file shows the new Worklist values.
Auto spec: What to check: cell values against the grid after each change. Clean up: restore values.

### TC-046 [BE][MT] Verify large Duration and Man-hrs. numbers are exported in the grid format (BND) [Auto]
Precondition: card-owned row. Values only that the screen accepts.
Priority: Medium
Trace: AC-5.5
1. Save a Duration of `1234.5` hours and Man-hrs. of `10000` on one row. -> The grid shows both values after the user leaves the cell.
2. Click `Export` and open the sheet. -> The cells show the same values as the grid, with no cut digits and no `#####`.
3. Look at the cell type. -> The cells are numbers or text as the grid shows them; a value is not changed to a date or to scientific notation.
Auto spec: What to check: cell value equals grid text. Clean up: restore values.

### TC-047 [FE][BE][MT] Verify Export after scrolling or resizing the two Gantt panels, and the sheet header rows stay in place (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-1.6, AC-3.1.1
1. Scroll the Gantt down and to the right and drag the divider between the table and the chart. -> The panels move.
2. Click `Export` and count the data rows. -> The count equals all saved rows, not only the visible ones.
3. Open the sheet and scroll down. -> Rows 1 to 3 (header) stay in place if the sheet freezes them; the Story is silent (see Open question 17), so the lead decides.
Auto spec: What to check: row count equals saved count after scroll and resize. Clean up: none.

### TC-048 [BE][MT] Verify strange text in Manpower Resource name, Working Location X and Y, and in the Event and Logic name is exported safely (Exotic: strange input) [Auto]
Precondition: card-owned rows. Values only that the screen lets the user type.
Priority: Medium
Trace: AC-5.4, AC-2.2
1. Save a Manpower Resource name `a\b/c:d*e?f"g<h>i|j&k#l%m'n`, then `<b>bold</b>`, then `=1+1`, then `สวัสดี 😀`. -> Each value is saved and shown in the grid.
2. Type letters or text with a comma into Working Location X and Y. -> The field accepts or refuses them; the user sees what was saved.
3. Click `Export` and read each cell. -> The text equals the grid; `=1+1` is not calculated; no repair message opens.
4. Save an Event name and a Logic name with `<b>x</b>`, leading and trailing spaces, an emoji, `&`, `#`, `%`, `'`, then click `Export`. -> The file name keeps the allowed characters, loses only the forbidden ones and the file opens.
Auto spec: Data set: the values above. Clean up: restore names.

### TC-049 [FE][MT] Verify the Export button is shown correctly when the empty plan is opened by Back or the breadcrumb (BND) [Auto]
Precondition: card-owned Shutdown Logic with no saved task, and one logic with tasks.
Priority: Low
Trace: AC-1.4
1. Open the logic with tasks, then Back to the plan and open the empty logic. -> `Export` is greyed out.
2. Click Browser Back and Forward. -> The button is still greyed out.
3. Click the breadcrumb to the plan and open the empty logic again. -> The button is greyed out.
Auto spec: What to check: button disabled after each navigation. Clean up: none.

### TC-050 [BE][MT] Verify the Predecessor of a task outside the plan and hidden tasks do not break the file (Exotic: related data) [Manual: needs data the QA plan may not have]
Precondition: a plan whose data contains a link to a task that is not in the plan, if the screen can make it (see Open question 5).
Priority: Low
Trace: AC-5.2
1. Open the Gantt of that plan. -> The Gantt is shown.
2. Click `Export` and open the sheet. -> The sheet opens without a repair message.
3. Read the Predecessor cell of the linked task. -> It holds only numbers of rows in the sheet, or is blank; no `null` or database id.

## Counts

Total 50 cases. High: 25 (TC-001, 002, 003, 005, 007, 008, 009, 010, 011, 012, 014, 015, 016, 018, 019, 022, 023, 024, 027, 029, 039, 041, 043, 044, 045). Medium: 21 (TC-004, 006, 013, 017, 020, 021, 025, 026, 028, 030, 031, 032, 033, 034, 035, 036, 037, 040, 042, 046, 048). Low: 4 (TC-038, 047, 049, 050).
Automation: Auto 41 / Partial 3 (TC-004, 026, 028) / Manual 6 (TC-010, 033, 035, 036, 037, 050).
Reason for Manual only: needs a changed device clock or timezone, a cut network, two real users, or old data that cannot be made safely.

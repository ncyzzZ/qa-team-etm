# Draft test cases - ETM-6843 Import Work and Work Breakdown from Excel

Story: ETM-6843 Import Work and Work Breakdown from Excel (frozen exam copy, description version of 2026-10-08, no comments).
Source: `story.md` of this folder, `docs/modules/core-navigation-worklist.md`, `.claude/team/knowledge/`. No `analyst.md` and no `inspector.md` exist for this exam, so the `AC-n` ids below follow the numbering of the Story's Acceptance Criteria (AC-1 = "Action Column Definition", AC-2 = "Hierarchy Rules", AC-3 = "UUID Field Rules", AC-4 = "Preset Injection", AC-5 = "Rollup", AC-6 = "Retention and Ordering", AC-7 = "Import Validation and Warning Alerts", AC-8 = "Duplicate Work Detection", AC-9 = "Concurrency"), with sub-items as AC-n.m.
Existing `[QA]` subtasks: none given.
Priority: the Story gives none, so priority is set by damage if it breaks (wrong or lost data = High).

Common precondition: logged in as a Turnaround Manager (TM) who has the `Import Work` permission; the Worklist table of an Active plan of a test event is open; the import dialog opens from `Create Work` > `Import Excel`; the tester has the official template `Import_Work_and_Work_Breakdown_Template_V2.xlsx`, sheet `Worklist_Data` (Column B `UUID`, Column C `Action *`), and a sheet `Dropdown Options`. Every test file is built from that template. UUIDs of existing Works and Breakdowns are read from the system before the file is made. `HDR-A` means any Work Header value copied from the sheet `Dropdown Options`. Work Numbers used below are made-up (`WN-100001` style, 9 characters).
Notation: `->` separates the action from the expected result. `(POS)` expected to work, `(NEG)` must be refused, `(BND)` boundary, `(Exotic)` unusual use. Component tags: `[FE]` screen, `[BE]` import processing, `[MT]` manual test tag (copied from the module habit of sibling cases).

## Think like the user (3 lines)
- Who: a Turnaround Manager or Job Owner who maintains hundreds of Works before a shutdown; imports often during planning, in a hurry, from an Excel they edited by hand or copied from another file.
- Wants: add, change and delete many Works and Breakdowns in one go without breaking what is there, and see clearly what is wrong before anything is saved.
- Careless: leaves a UUID on an Add row, deletes a UUID by mistake, renames the sheet, pastes text with spaces, double-clicks Confirm, uploads the same file twice, imports while a colleague edits the same Work.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned cases |
|---|---|---|---|
| AC-1.1 Action dropdown, mandatory | Input groups | Wrong or free-text value accepted | TC-011, TC-012 |
| AC-1.2 Add Work / Add Breakdown | State change | Wrong record created, wrong parent | TC-013 |
| AC-1.3 Revise Work / Breakdown | State change | Wrong record updated, other fields lost | TC-014, TC-015 |
| AC-1.4 Delete Work (soft) / Breakdown (permanent) | State change | Data loss, wrong delete type | TC-016, TC-017 |
| AC-1.5 Blank Action error | Input groups | Row silently skipped | TC-011 |
| AC-2.1 Work Add rules | Decision table | Add Work with bad children saved | TC-018, TC-019 |
| AC-2.2 Work Delete rules | Decision table | Children kept or deleted wrongly | TC-018, TC-016, TC-021 |
| AC-2.3 Work Revise rules | Decision table | Breakdowns lost on revise | TC-018, TC-020 |
| AC-3.1 UUID editable | Screen state | Template locks the column | TC-022 |
| AC-3.2 / 3.4 UUID blank or filled wrongly | Condition table | Wrong record matched | TC-037 (matrix), TC-023 |
| AC-3.3 UUID not found, no level cross-check | Input groups | Cross-level UUID accepted | TC-023, TC-026 |
| AC-3.5 Duplicate UUID in file | Error guessing | Record changed twice | TC-024 |
| AC-3.6 Disabled columns ignored (TM exception) | Roles | Wrong values stored, JO sets status | TC-003, TC-004, TC-025 |
| AC-4.1 / 4.2 Blank preset | Condition table | Work with no breakdown saved | TC-019, TC-027 |
| AC-4.3 Preset generation, inherit, non-inherit, position | Condition table | Wrong inherited values, wrong order | TC-028, TC-029, TC-030, TC-032 |
| AC-5 Rollup | Matrix calc | Wrong totals on parent Work | TC-033 |
| AC-6.1 / 6.2 Retention of omitted UUIDs | State change | Breakdown lost | TC-034 |
| AC-6.3 Explicit actions | State change | Wrong delete or update | TC-016, TC-017, TC-036 |
| AC-6.4 3-tier ordering | Combinations | Wrong order | TC-032, TC-035 |
| AC-7.1 Pre-import validation, banner, grid, Confirm disabled | Screen states | Bad data committed | TC-005, TC-006, TC-007, TC-041 |
| AC-7.2 Empty file | Screen states | Empty import goes ahead | TC-008 |
| AC-7.3 1,000 rows limit | Edge values | Limit off by one | TC-009 |
| AC-7.4 Sheet name | Input groups | Wrong sheet processed | TC-010 |
| AC-7.5 Case sensitivity | Input groups | Valid value rejected or stored in wrong case | TC-038 |
| AC-7.6 / 7.7 Dropdown advisory and validation matrix | Condition table | A rule has no check | TC-037, TC-031, TC-039, TC-040 |
| AC-8.1 Order: validation before duplicates | State change | Duplicate banner while errors exist | TC-041 |
| AC-8.2 Scope (Work without UUID only) | Decision table | Breakdown or UUID rows flagged | TC-050 |
| AC-8.3 Matching rules, 8 characters | Edge values | Wrong duplicates | TC-046, TC-047 |
| AC-8.4 Comparison targets (system, file, soft-deleted) | Combinations | Deleted works flagged | TC-042, TC-043, TC-048, TC-049 |
| AC-8.5 Banner, radio options | Screen states, State change | Wrong rows imported | TC-042, TC-044, TC-045, TC-051 |
| AC-8.6 Duplicate table and messages | Condition table | Wrong message or row number | TC-042, TC-043, TC-049 |
| AC-9.1 Last Write Wins | Two users | Silent overwrite | TC-052, TC-055 |
| AC-9.2 Confirm / Cancel | State change | Double commit, partial commit | TC-053, TC-054, TC-060, TC-061, TC-062 |
| AC-9.3 Empty state exemption | - | Not applicable, no new list or table UI | none (Story says not applicable) |
| Linked data / same data on many pages (lessons 6, 8) | Effects and reverse | Import data differs on other pages | TC-063, TC-064 |
| Strange input (lesson 4) | Strange input | Break on special text | TC-056 |
| Blank rows, re-upload (real user) | Error guessing | Blank rows counted or errors kept | TC-058, TC-059 |
| Permission | Roles | Import without permission | TC-001, TC-002 |
| Bug-check fix round: replace file, radio undo and reset, close icon/Esc, reopen, search active, Excel row number, Revise not skipped, big numbers, spaces, reverse of delete, re-import, other screens, empty rollup | Unsaved changes, Leaving, Grid habits, Effects and reverse | see TC names | TC-066 to TC-084 |
| Screen state: loading of a big valid file | Screen states | Frozen screen | TC-009 |

Screen states: normal (TC-005), error (TC-006), empty file (TC-008), too much data (TC-009), no permission (TC-002), disabled Confirm (TC-006), loading (TC-009). Read-only: not relevant, the import dialog has no read-only state in the Story.

Categories and lessons:
1. Two people at once: relevant (TC-052, TC-054, TC-055).
2. Filter + Sort + Search together: partly, only to find imported rows (TC-065); no new filter UI in the Story.
3. Old data after migrations: not relevant, no migration in the Story.
4. Strange input: relevant (TC-056).
5. Reordering changes calculations: relevant, breakdown order after import (TC-032, TC-035) and rollup (TC-033).
6. Linked data: relevant (TC-016, TC-063).
7. Charts that depend on each other: not relevant, no chart in the Story.
8. Same data on many pages: relevant (TC-063, TC-064).
9. Matrix calculations: relevant (TC-018, TC-037, TC-042 table, TC-033).
L-1 text sort: not relevant, no sorted list added. L-2 filter choice kept: not relevant. L-3 read results after the response: applied in TC-065 (wait for the search response). L-4 multi-row paste: not relevant (file upload, not paste). L-5 collapse per level: not relevant. L-6 same value, different case: relevant (TC-038, Work Header case variants in TC-047). L-7 selected state: not relevant, but the default selected radio is checked in TC-042. L-8 Story changed during sprint: relevant to the run, `story.md` is compared with the Jira changelog before the run (note for lead).
Keyboard Tab/Enter order: not relevant, the only inputs are file upload and two radio buttons (radio keyboard use is in TC-051).

Skipped: none silently.

Counts (see end of file for the final numbers).

## Open questions
1. The matrix has no row with severity Warning, yet AC-7 says "If only Warnings are present, the user may still proceed". Which cases give a Warning? Until answered there is no case for the Warning path.
2. What does the import show when the Action cell holds free text such as `Update` (not Add, Revise or Delete)? The Story only says the engine "strictly enforces acceptable values" and gives no message. TC-012 expects an Error and the message is left open.
3. What does a user without the `Import Work` permission see: is `Import Excel` hidden, disabled, or does the upload fail with a message? (TC-002)
4. Can a Job Owner use the import? The Story says "Turnaround Manager or Job Owner" but only the TM may import Work Status and Breakdown Status. TC-004 assumes the JO has the `Import Work` permission.
5. A UUID cell with leading or trailing spaces, or in upper case: is it matched or is it "not exist in the system"? (TC-057)
6. A Work with `Delete` is also given in a file where another user already deleted it, or where the Revise target was deleted after the preview (Last Write Wins): what is shown on Confirm? (TC-055)
7. Which file types are accepted (only .xlsx)? What happens with .csv, .xls or a password-protected file? Not in the Story.
8. Which Work Status and Breakdown Status values can the TM import and what happens with an invalid one (rule in the matrix: "Field is not in Master Data")? TC-003 uses one valid value from `Dropdown Options`.
9. Is the 1,000-row limit counted on rows that contain data only, or on all used rows including blank ones? (TC-009, TC-058)
10. When a Work is Soft deleted by import, does it appear in the Worklist table with Status `D` as it does for a deleted Work in the Worklist today? TC-016 expects the same as the Worklist's existing delete.
11. Is the Duplicate Detail row number the Excel row number (including the header row) or the data row number? TC-042 expects the Excel row number as seen in the sheet.
12. Does Import without duplicate works also skip the Work when its duplicate is only a Revise row? TC-050 expects: no, a Revise row is never skipped.
13. A Delete or Revise row for the UUID of a Work that is already soft deleted: error, no change, or brought back? TC-078 expects it is never changed or restored silently.

Suggestions (not in Story):
- Suggestion (not in Story): an error message for a wrong file type (.csv, .xls, .pdf).
- Suggestion (not in Story): a progress indicator and a result message after Confirm for a large file (how many works were added, revised, deleted).
- Suggestion (not in Story): a downloadable error report for the validation grid.

## Test cases (84 flows)

### TC-001 [FE][MT] Verify a TM who has the Import Work permission can open the import and upload a valid file (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-7.1
1. Click `Create Work` on the Worklist page. -> A dropdown opens with the options `Manual Create` and `Import Excel`.
2. Click `Import Excel`. -> The import dialog opens with an upload area.
3. Upload a file with one valid Work row (`Action` = Add, blank `UUID`, Work Header `HDR-A`, Work Number `WN-100001`, Work Breakdown Type `Single Task (Inherit from Work)`). -> The file is accepted and the preview grid shows one row.
Starting data: a TM user with the permission; one prepared file. What to check: the three outcomes above. Data set: single file. Clean up: Cancel the dialog; nothing saved. Independent: yes.

### TC-002 [FE][BE][MT] Verify a user without the Import Work permission cannot import (NEG) [Auto]
Precondition: logged in as a user that does not have the `Import Work` permission; the Worklist table is open
Priority: High
Trace: none (permission rule from the Story precondition)
1. Click `Create Work` on the Worklist page. -> The dropdown does not allow starting an import (the `Import Excel` option is hidden or cannot be used); see Open questions 3.
2. Open the Worklist page address of a plan directly and try the same again after a reload. -> Still no way to import.
Starting data: second user without the permission. What to check: no import dialog can be reached. Clean up: none. Independent: yes.

### TC-003 [BE][MT] Verify a TM can import Work Status and Breakdown Status (POS) [Auto]
Precondition: common; an existing Work with UUID, Work Status `Initial` (record the value shown first), and one breakdown with UUID and a known Breakdown Status
Priority: High
Trace: AC-3.6
1. Record the current Work Status of the Work and the Breakdown Status of its breakdown. -> The current values are written down for the comparison later.
2. Build a file with one Work row (`Action` = Revise, the Work's `UUID`, in column `Work Status` another valid value from `Dropdown Options`) and one breakdown row (`Action` = Revise, the breakdown's `UUID`, in column `Breakdown Status` another valid value from `Dropdown Options`). -> The file is ready.
3. Upload the file. -> The preview grid shows the row without errors.
4. Click `Confirm`. -> The import finishes and the dialog closes.
5. Open the Worklist and read the Work Status of that Work. -> The Work Status now shows the imported value, not the recorded one.
6. Open `View Work Details` and read the Breakdown Status of the breakdown. -> The Breakdown Status shows the imported value, not the recorded one.
7. Build a file with one new Work row (Add, blank UUID, `WN-100091`, a valid `Work Status` from `Dropdown Options`, one breakdown Add), upload it and click `Confirm`. -> The import finishes without error.
8. Read the Work Status of the new Work. -> It shows the imported valid value (a TM may set it on an Add row too).
Starting data: card-owned Work. What to check: the status changed. Clean up: set the status back through import or the screen. Independent: yes.

### TC-004 [BE][MT] Verify a Job Owner import ignores Work Status and Breakdown Status (NEG) [Auto]
Precondition: logged in as a Job Owner who has the `Import Work` permission; an existing Work of that Job Owner with a known Work Status
Priority: High
Trace: AC-3.6
1. Record the current Work Status and Breakdown Status of the Work. -> The current values are written down.
2. Build a file with one Work row: `Action` = Revise, the Work's `UUID`, and different values in `Work Status` and `Breakdown Status`. -> The file is ready.
3. Upload the file and click `Confirm`. -> The import finishes without error.
4. Read the Work Status and Breakdown Status again. -> Both are the same as the recorded values; the imported status values were ignored.
Starting data: card-owned Work. Clean up: none needed. Independent: yes.

### TC-005 [FE][MT] Verify the preview grid for a valid file shows no error and Confirm is enabled (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7.1
1. Upload a file with two valid Work rows (Add, blank UUID, Work Numbers `WN-100002` and `WN-100003`, Work Breakdown Type `Single Task (Inherit from Work)`). -> The in-app data preview grid shows the rows.
2. Check the area above the grid. -> No error banner and no duplicate banner are shown.
3. Check the `Confirm` button. -> `Confirm` is enabled.
Clean up: Cancel. Independent: yes.

### TC-006 [FE][MT] Verify the error banner, the error table and the disabled Confirm button (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-7.1, AC-1.5
1. Upload a file with 3 Work rows where the `Action` cell of rows 2, 3 and 4 is blank (Excel row 1 is the header). -> The preview shows a global error banner.
2. Read the banner text. -> It reads `Data Validation Failed. 3 data validation errors were found in the file.`
3. Read the error table headings. -> The columns are `Row`, `Cell`, `Field`, `Invalid Detail`.
4. Read the first error row. -> It shows row 2, the cell of `Action`, the field `Action`, and `This field is mandatory.`
5. Check the `Confirm` button. -> `Confirm` is disabled.
6. Click the disabled `Confirm` button. -> Nothing happens and no duplicate section appears.
Clean up: Cancel. Independent: yes.

### TC-007 [FE][MT] Verify a cell with several errors shows one table row per error (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.1
1. Upload a file with one Work row where `Action` = Add, `UUID` holds a value, and `Work Header` holds a value not in Master Data. -> The error table opens.
2. Count the rows for that one Work row. -> There is one separate row for each error and no row merges two messages.
3. Read the banner count. -> The count equals the number of rows in the error table.
Clean up: Cancel. Independent: yes.

### TC-008 [FE][MT] Verify an empty file is blocked with an inline message (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.2
1. Upload a template file whose sheet `Worklist_Data` has only the header row. -> An inline error message appears below the upload area.
2. Read the message. -> It reads `Cannot upload the selected file - The file contains no records`.
3. Check the preview and `Confirm`. -> No preview grid is shown and the import cannot continue.
Clean up: none. Independent: yes.

### TC-009 [FE][BE][MT] Verify the 1,000 rows limit on the border (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-7.3
1. Upload a valid file with exactly 1,000 data rows (not counting the header). -> The file is accepted and the preview grid shows the rows; the screen stays usable.
2. Cancel the dialog and upload a valid file with 999 data rows. -> The file is accepted.
3. Cancel the dialog and upload a valid file with 1,001 data rows. -> An inline message appears below the upload area: `Cannot upload the selected file - The file exceeds the maximum limit of 1,000 rows`.
4. Check the preview and `Confirm` after step 3. -> No preview grid is shown and the import cannot continue.
Test data set: row counts 999, 1000, 1001 (the test loops over them). Clean up: Cancel. Independent: yes.

### TC-010 [FE][MT] Verify only the sheet named Worklist_Data is processed (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.4
1. Rename the sheet `Worklist_Data` to `Sheet1` in a valid file and upload it. -> An inline message appears below the upload area: `Cannot upload the selected file - The uploaded file must contain a worksheet named 'Worklist_Data'`.
2. Check the preview and `Confirm`. -> No preview is shown and the import cannot continue.
3. Upload a valid file that has the sheet `Worklist_Data` plus a second sheet holding extra valid rows. -> The preview shows only the rows of `Worklist_Data`.
Clean up: none. Independent: yes.

### TC-011 [BE][MT] Verify a blank Action cell is an Error and a valid Action is accepted (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1, AC-1.5
1. Upload a file with a Work row where the `Action` cell is blank. -> The error table shows `This field is mandatory.` for the cell of `Action`.
2. Check `Confirm`. -> `Confirm` is disabled.
3. Fill the cell with `Add` in the file and upload it again. -> The error for `Action` is gone.
Clean up: Cancel. Independent: yes.

### TC-012 [BE][MT] Verify a free-text value in the Action column is refused (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. In the Excel template type `Update` into the `Action` cell although the template shows a warning only. -> The template lets the value stay and shows an advisory alert.
2. Upload the file. -> The preview shows an Error for that row and `Confirm` is disabled (message text: see Open questions 2).
3. Repeat with `add` in lower case. -> The row is accepted, treated as `Add` (case is ignored for Master Data).
Clean up: Cancel. Independent: yes.

### TC-013 [BE][MT] Verify Add creates a new Work and a new Work Breakdown under it (POS) [Auto]
Precondition: common; Work Number `WN-100010` does not exist in the Worklist
Priority: High
Trace: AC-1.2, AC-1.2.1, AC-1.2.2, AC-6.3
1. Record the `Total Results` of the Worklist table. -> The current count is written down.
2. Build a file: Work row (Add, blank UUID, `WN-100010`, Job Description `Replace pump seal A`, Work Breakdown Type blank) and under it 2 Work Breakdown rows (Add, blank UUID, Task Description `Isolate pump`, `Fit new seal`). -> The file is ready.
3. Upload the file and click `Confirm`. -> The import finishes and the dialog closes.
4. Read `Total Results`. -> It is the recorded count plus 1.
5. Open the new Work from the `⋮` menu `View Work Details`. -> The Work Breakdown table lists exactly `Isolate pump` and `Fit new seal` in this order.
Clean up: delete the new Work. Independent: yes.

### TC-014 [BE][MT] Verify Revise updates the existing Work and keeps other data (POS) [Auto]
Precondition: common; an existing Work with UUID, Job Description `Replace pump seal A` and 2 breakdowns
Priority: High
Trace: AC-1.3, AC-1.3.1, AC-6.3
1. Record the Work's Job Description, Priority, POB, Duration, Man-hrs., Manpower Resource, D/N Shift, Remark and its breakdowns. -> The current values are written down.
2. Build a file with one Work row: Revise, the Work's UUID, Job Description `Replace pump seal B`, the other editable cells left blank, no breakdown rows. -> The file is ready.
3. Upload and click `Confirm`. -> The import finishes.
4. Open `View Work Details` of the Work. -> The Job Description is `Replace pump seal B`.
5. Read the Work Breakdown table. -> The same 2 breakdowns as recorded are still there.
6. Read Priority, POB, Duration, Man-hrs., Manpower Resource, D/N Shift and Remark of the Work. -> Every value is the same as recorded; the blank cells in the file did not wipe them.
Clean up: set the Job Description back. Independent: yes.

### TC-015 [BE][MT] Verify Revise updates one existing Work Breakdown (POS) [Auto]
Precondition: common; an existing Work with UUID that has a breakdown with UUID and Task Description `Isolate pump`
Priority: High
Trace: AC-1.3, AC-1.3.2, AC-2.3.2
1. Record the breakdown's Priority, POB, Duration, Man-hrs., Manpower Resource, D/N Shift, its place in the order and the number of breakdowns. -> The current values are written down.
2. Build a file: Work row (Revise, the Work's UUID) and one breakdown row (Revise, the breakdown's UUID, Task Description `Isolate pump line 1`, the other editable cells blank). -> The file is ready.
3. Upload and click `Confirm`. -> The import finishes.
4. Open `View Work Details`. -> The breakdown shows `Isolate pump line 1`; the number of breakdowns is the same as before; the breakdown is in the same place in the order.
5. Read the other values of that breakdown. -> Priority, POB, Duration, Man-hrs., Manpower Resource and D/N Shift are the same as recorded.
Clean up: set the description back. Independent: yes.

### TC-016 [BE][MT] Verify Delete of a Work soft deletes the Work and all its breakdowns (POS) [Auto]
Precondition: common; an existing Work with UUID and 2 breakdowns, created for this test
Priority: High
Trace: AC-1.4, AC-1.4.1, AC-2.2.1, AC-6.3.1
1. Build a file with one Work row: Delete, the Work's UUID, no breakdown rows. -> The file is ready.
2. Upload the file. -> The preview shows the row without errors.
3. Check the database or Worklist before `Confirm`. -> The Work is still active; nothing changed yet.
4. Click `Confirm`. -> The import finishes.
5. Find the Work in the Worklist table. -> The row shows Status `D` as for a deleted Work.
6. Check the breakdowns of that Work in the database. -> Both breakdowns are marked as soft deleted too, not permanently removed.
Clean up: card-owned Work. Independent: yes.

### TC-017 [BE][MT] Verify Delete of a Work Breakdown removes it permanently (POS) [Auto]
Precondition: common; an existing Work with 3 breakdowns, one of them is `Fit new seal` with UUID
Priority: High
Trace: AC-1.4, AC-1.4.2, AC-6.3.2, AC-2.3.3
1. Build a file: Work row (Revise, UUID), one breakdown row (Delete, UUID of `Fit new seal`). -> The file is ready.
2. Upload and click `Confirm`. -> The import finishes.
3. Open `View Work Details`. -> The breakdown table shows 2 breakdowns and `Fit new seal` is not listed.
4. Check the database for the deleted breakdown. -> The record does not exist at all (permanent delete).
Clean up: none. Independent: yes.

### TC-018 [BE][MT] Verify the Work and Breakdown action rules (matrix) (NEG) [Auto]
Precondition: common; one existing Work `WN-100020` with UUID and one existing breakdown with UUID
Priority: High
Trace: AC-2, AC-2.1.2, AC-2.1.3, AC-2.2.2, AC-2.2.3, AC-2.3.2, AC-2.3.3, AC-2.3.4, AC-2.3.5
The test loops over the expected table. For each row it builds one file with one Work row and one child breakdown row, uploads it and compares the result.
Expected table:

| Case | Work action / UUID | Breakdown action / UUID | Expected |
|---|---|---|---|
| A1 | Add / blank | Add / blank | No error |
| A2 | Add / blank | Revise / valid UUID | Error `All Work Breakdowns under a newly added Work must be Add without UUID.` |
| A3 | Add / blank | Delete / valid UUID | Same error as A2 |
| A4 | Add / blank | Add / UUID filled | Same error as A2 |
| D1 | Delete / valid UUID | none | No error |
| D2 | Delete / valid UUID | Delete / valid UUID | No error |
| D3 | Delete / valid UUID | Add / blank | Error `All Work Breakdowns under a deleted Work must be Delete with a valid UUID.` |
| D4 | Delete / valid UUID | Revise / valid UUID | Same error as D3 |
| D5 | Delete / valid UUID | Delete / blank | Same error as D3 |
| R1 | Revise / valid UUID | none | No error |
| R2 | Revise / valid UUID | Add / blank | No error |
| R3 | Revise / valid UUID | Revise / valid UUID | No error |
| R4 | Revise / valid UUID | Delete / valid UUID | No error |
| R5 | Revise / valid UUID | Add / UUID filled | Error `UUID must be empty when Action is Add.` |
| R6 | Revise / valid UUID | Revise / blank | Error `UUID is mandatory when Action is Revise or Delete.` |
| R7 | Revise / valid UUID | Delete / blank | Same error as R6 |

1. Upload the file of each row. -> The preview shows the result in the column `Expected`, and `Confirm` is disabled for every Error row and enabled for every `No error` row.
Clean up: Cancel after each file. Independent: yes.

### TC-019 [BE][MT] Verify a new Work with no breakdown and no preset is refused (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-2.1, AC-2.1.1, AC-4.1, AC-4.2
1. Upload a file with one Work row (Add, blank UUID, `WN-100030`, Work Breakdown Type blank) and no breakdown rows under it. -> The error table shows `The work must contain at least one work breakdown or work breakdown type.`
2. Check `Confirm`. -> `Confirm` is disabled.
3. Fill a valid Work Breakdown Type (for example `Single Task (Inherit from Work)`) and upload again. -> The error is gone.
4. Remove the Work Breakdown Type and add one breakdown row (Add, blank UUID) and upload again. -> The error is gone.
Clean up: Cancel. Independent: yes.

### TC-020 [BE][MT] Verify Revise with zero breakdown rows leaves the existing breakdowns untouched (POS) [Auto]
Precondition: common; an existing Work with 3 breakdowns
Priority: High
Trace: AC-2.3, AC-2.3.1, AC-6.2
1. Record the 3 breakdown descriptions in order. -> The values are written down.
2. Upload a file with one Work row (Revise, UUID, a changed Job Description) and no breakdown rows. -> The preview shows no error.
3. Click `Confirm`. -> The import finishes.
4. Read the breakdowns. -> The same 3 breakdowns, same values, same order.
Clean up: restore Job Description. Independent: yes.

### TC-021 [BE][MT] Verify a Delete Work with its breakdowns all set to Delete removes them together (POS) [Auto]
Precondition: common; an existing Work with 2 breakdowns, created for this test
Priority: Medium
Trace: AC-2.2.2, AC-6.3.1
1. Build a file: Work row (Delete, UUID) and 2 breakdown rows (Delete, their UUIDs). -> The file is ready.
2. Upload it. -> The preview shows no error.
3. Click `Confirm`. -> The import finishes.
4. Check the Work and the breakdowns. -> The Work shows Status `D`; the breakdowns are gone from the Work.
Clean up: card-owned data. Independent: yes.

### TC-022 [FE][MT] Verify the UUID column in the template is active and editable (POS) [Manual: it checks the Excel template file, not the web app]
Precondition: the template file
Priority: Low
Trace: AC-3.1
1. Open the template and click a cell in Column B `UUID`. -> The cell is not locked or greyed out.
2. Type a value. -> The value stays in the cell.
3. Check the system-managed columns (`Functional Location`, `Equipment Number`, `System Condition`, `POB`, `Man-hrs.`, `Work Status`, `Breakdown Status`). -> They carry the `Disable` input hint.

### TC-023 [BE][MT] Verify a UUID that does not exist is refused, also a UUID of another data level (NEG) [Auto]
Precondition: common; a Work UUID `W-UUID` and a breakdown UUID `B-UUID` read from the system
Priority: High
Trace: AC-3.3, AC-3.2, AC-7.7
1. Upload a file with a Work row (Revise) and a made-up UUID that is not in the system. -> The error table shows `The UUID you entered is not exist in the system.`
2. Upload a file with a Work row (Revise) that holds `B-UUID` (a breakdown's UUID). -> The same message `The UUID you entered is not exist in the system.`, not a message about another level.
3. Upload a file with a Work Breakdown row (Delete) that holds `W-UUID`. -> The same message appears.
4. Upload a file with a Work row (Revise) and a blank UUID. -> The error is `UUID is mandatory when Action is Revise or Delete.`
5. Upload a file with a Work row (Add) that holds a UUID. -> The error is `UUID must be empty when Action is Add.`
Clean up: Cancel after each file. Independent: yes.

### TC-024 [BE][MT] Verify the same UUID twice in the file is refused (NEG) [Auto]
Precondition: common; one existing Work UUID
Priority: High
Trace: AC-3.5
1. Upload a file with two rows that hold the same Work UUID (Revise on both). -> The error table shows `The UUID you entered is duplicated within the import file.`
2. Read which rows get the error. -> Both rows with the same UUID are listed.
3. Check `Confirm`. -> `Confirm` is disabled.
Clean up: Cancel. Independent: yes.

### TC-025 [BE][MT] Verify values in disabled system-managed columns are ignored (POS) [Auto]
Precondition: common; an existing Work with known `Functional Location`, `Equipment Number`, `System Condition`, `POB`, `Man-hrs.`
Priority: High
Trace: AC-3.6
1. Record the values of those 5 columns of the Work. -> The current values are written down.
2. Build a file with one Work row (Revise, UUID) and other values in `Functional Location`, `Equipment Number`, `System Condition`, `POB`, `Man-hrs.`. -> The file is ready.
3. Upload it. -> The preview shows no error for those columns.
4. Click `Confirm`. -> The import finishes.
5. Read the 5 values again. -> Every value is the same as the recorded one (a calculated column such as `POB` and `Man-hrs.` equals the rollup of the breakdowns).
6. Build a file with one new Work row (Add, blank UUID, `WN-100090`, other values in `Functional Location`, `Equipment Number`, `System Condition`, `POB`, `Man-hrs.`, Work Breakdown Type `Single Task (Inherit from Work)`), upload it and click `Confirm`. -> The import finishes without error.
7. Open the new Work and read the 5 values. -> The values typed in the disabled columns were not stored; `POB` and `Man-hrs.` equal the rollup of its breakdown.
Clean up: delete the new Work. Independent: yes.

### TC-026 [BE][MT] Verify a Work row with a UUID from another event or plan is refused (NEG) [Manual: needs a second event with data]
Precondition: common; a Work UUID `X-UUID` taken from a Work in another event
Priority: Medium
Trace: AC-3.3
1. Upload a file with a Work row (Revise) holding `X-UUID`. -> If the Story's "UUID must exist for that record's entity type" is the only rule, the row is accepted and changes the other event's Work; the tester records what happens and raises it (the Story is silent about the event scope).
Note: written as a risk check only; the Expected Result is "the user would call correct: a Work of another Worklist is not changed silently" and a question goes to the BA.

### TC-027 [BE][MT] Verify a blank Work Breakdown Type uses only the breakdown rows in the file (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.1
1. Upload a file: Work row (Add, blank UUID, `WN-100040`, Work Breakdown Type blank) and 2 breakdown rows (Add, blank UUID). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Open `View Work Details`. -> Exactly 2 breakdowns exist, the ones from the file; no generated rows.
Clean up: delete the Work. Independent: yes.

### TC-028 [BE][MT] Verify a preset in Work Breakdown Type generates its breakdown rows (POS) [Auto]
Precondition: common; a preset type with several rows in the Work Breakdown Type master data, called `PRESET-N`
Priority: High
Trace: AC-4.3, AC-4.3.1
1. Look up the rows of `PRESET-N` in the master data and write them down in order. -> The list of rows is written down.
2. Upload a file with one Work row (Add, blank UUID, `WN-100041`, Work Breakdown Type `PRESET-N`) and no breakdown rows. -> The preview shows no error.
3. Click `Confirm`. -> The import finishes.
4. Open `View Work Details`. -> The Work Breakdown table has exactly the rows of `PRESET-N`, in the same order.
Clean up: delete the Work. Independent: yes.

### TC-029 [BE][MT] Verify Single Task (Inherit from Work) takes its values from the Work row (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.3.2, AC-6.4.3
1. Build a file with one Work row (Add, blank UUID, `WN-100042`) with Priority `P1`, Manpower Resource 2 names, POB `4`, Duration `3`, Man-hrs. `24`, D/N Shift `Night`, Work Breakdown Type `Single Task (Inherit from Work)`. -> The file is ready.
2. Upload it and click `Confirm`. -> The import finishes.
3. Open `View Work Details`. -> One breakdown row appears.
4. Read Priority, Manpower Resource, POB, Duration, Man-hrs., D/N Shift of that breakdown. -> They are `P1`, the same 2 names, `4`, `3`, `24`, `Night`, as on the Work row.
5. Upload a file with an existing Work whose breakdown is a single inherited task (Revise, its UUID, Priority changed to `Pre SD`, D/N Shift changed to `Day`, Work Breakdown Type `Single Task (Inherit from Work)`), and click `Confirm`. -> The import finishes.
6. Open `View Work Details` and read Priority and D/N Shift of the inherited breakdown. -> They are `Pre SD` and `Day` (the new Work row values), not the old database values.
Test data set: also run with Priority `Pre SD` and D/N Shift `Day` on the Add file. Clean up: delete the Work, restore the revised Work. Independent: yes.

### TC-030 [BE][MT] Verify non-inherit preset rows take their values from the preset master (POS) [Auto]
Precondition: common; a preset that is not `Single Task (Inherit from Work)`, called `PRESET-N`, with known values per row
Priority: High
Trace: AC-4.3.3
1. Upload a file with a Work row (Add, blank UUID, `WN-100043`, Priority `P3`, POB `9`, Work Breakdown Type `PRESET-N`). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Open `View Work Details` and read every generated row. -> Each row's Priority, Manpower Resource, POB, Duration, Man-hrs. and D/N Shift equal the master data of `PRESET-N`, not the Work row's `P3` and `9`.
Clean up: delete the Work. Independent: yes.

### TC-031 [BE][MT] Verify a Work Breakdown Type that is not in Master Data is refused, and a different case is accepted (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4, AC-7.5, AC-7.7
1. Upload a Work row (Add) with Work Breakdown Type `Not A Preset`. -> The error table shows `The value you entered does not match with Master Data. Please check the sheet name “Dropdown Options”.`
2. Upload the same row with a valid type written in other upper and lower case letters. -> No error is shown.
3. Confirm the import. -> The Work is saved with the type written in the format of the master data.
Clean up: delete the Work. Independent: yes.

### TC-032 [BE][MT] Verify preset rows are placed last on a Revise Work (POS) [Auto]
Precondition: common; a Work with 3 existing breakdowns `E1`, `E2`, `E3` (with UUIDs)
Priority: High
Trace: AC-4.3.4, AC-6.4, AC-6.4.3, AC-2.3.2
1. Upload a file: Work row (Revise, UUID, Work Breakdown Type `PRESET-N` with rows `P1`, `P2`) and one breakdown row (Add, blank UUID, `F1`). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Open `View Work Details` and read the breakdown order. -> `E1`, `E2`, `E3`, `F1`, `P1`, `P2`.
Clean up: restore Work. Independent: yes.

### TC-033 [BE][MT] Verify the parent Work summary is recalculated after import without deleted breakdowns (POS) [Auto]
Precondition: common; a Work with 2 breakdowns, known values of Manpower Resource, Duration, POB, Man-hrs., D/N Shift
Priority: High
Trace: AC-5
1. Record the Work's summary values (Manpower Resource, Duration, POB, Man-hrs., D/N Shift) and both breakdown values. -> The values are written down.
2. Upload a file: Work row (Revise, UUID), breakdown 1 (Revise, UUID, a new POB and Man-hrs.), breakdown 2 (Delete, UUID), a new breakdown (Add, blank UUID, known values). -> The preview shows no error.
3. Click `Confirm`. -> The import finishes.
4. Read the Work's summary in the Worklist. -> The totals equal the values of the final active breakdowns only (revised one + new one) and do not include the deleted one.
5. Repeat the calculation in the test with the same rule as the system. -> Manpower Resource, Duration, POB, Man-hrs. and D/N Shift all agree.
Clean up: restore data. Independent: yes.

### TC-034 [BE][MT] Verify breakdowns whose UUID is not in the file are kept (POS) [Auto]
Precondition: common; a Work with breakdowns `E1`, `E2`, `E3` (with UUIDs)
Priority: High
Trace: AC-6.1, AC-6.2
1. Upload a file: Work row (Revise, UUID) and one breakdown row (Revise, UUID of `E2`). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Read the breakdowns. -> `E1`, `E2`, `E3` are all still there; `E1` and `E3` are not changed or deleted.
Clean up: none. Independent: yes.

### TC-035 [BE][MT] Verify the 3-tier order of breakdowns after import (POS) [Auto]
Precondition: common; a Work with `E1`, `E2`, `E3`, `E4` in this order (with UUIDs)
Priority: High
Trace: AC-6.4, AC-6.4.1, AC-6.4.2, AC-6.4.3
1. Upload a file: Work row (Revise, UUID, Work Breakdown Type `PRESET-N` with `P1`, `P2`), then rows in this order: `E3` (Revise), `New-A` (Add), `E1` (Revise), `New-B` (Add). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Read the breakdown order. -> `E2`, `E4` (not mentioned, in original order), then `E3`, `New-A`, `E1`, `New-B` (the file order), then `P1`, `P2` (the preset order).
Clean up: restore data. Independent: yes.

### TC-036 [BE][MT] Verify one file with all three actions on one Work and a second Work (POS) [Auto]
Precondition: common; Work `W1` with 3 breakdowns, Work `W2` with 1 breakdown
Priority: High
Trace: AC-6.3, AC-1
1. Upload a file: `W1` Revise with one breakdown Add, one Revise, one Delete; `W2` Delete; a new Work (Add) with one breakdown (Add). -> The preview shows no error and `Confirm` is enabled.
2. Click `Confirm`. -> The import finishes.
3. Check `W1`, `W2` and the new Work. -> `W1` has the added and revised breakdown and lacks the deleted one; `W2` shows Status `D`; the new Work exists with its breakdown.
Clean up: card-owned data. Independent: yes.

### TC-037 [BE][MT] Verify every row of the validation matrix gives its message (NEG) [Auto]
Precondition: common; real existing Asset, Platform, Functional Location, Equipment Number values and their UUIDs
Priority: High
Trace: AC-7.6, AC-7.7, AC-3.2, AC-3.3, AC-3.4, AC-3.5, AC-2.1.3, AC-2.2.3
The test loops over the table; each row is one file with one wrong value in an otherwise valid Work row, and the test checks the message in `Invalid Detail`, the severity and that `Confirm` is disabled. The messages are exact text.

| Case | What is wrong | Expected Invalid Detail |
|---|---|---|
| V1 | A mandatory field blank (Action) | `This field is mandatory.` |
| V2 | Revise or Delete with blank UUID | `UUID is mandatory when Action is Revise or Delete.` |
| V3 | Add with a UUID | `UUID must be empty when Action is Add.` |
| V4 | UUID not in the system | `The UUID you entered is not exist in the system.` |
| V5 | Same UUID in two rows | `The UUID you entered is duplicated within the import file.` |
| V6 | Add Work with a Revise or UUID breakdown | `All Work Breakdowns under a newly added Work must be Add without UUID.` |
| V7 | Delete Work with a non-Delete or blank-UUID breakdown | `All Work Breakdowns under a deleted Work must be Delete with a valid UUID.` |
| V8 | Add Work with no breakdown and no type | `The work must contain at least one work breakdown or work breakdown type.` |
| V9 | A breakdown row with no Work row above it | `The work breakdown must belong to a work` |
| V10 | Value not in Master Data (for example Priority `P9`) | `The value you entered does not match with Master Data. Please check the sheet name “Dropdown Options”.` |
| V11 | Platform not under the Asset | `The value you entered does not match with data under the Asset/Field in SAP.` |
| V12 | Functional Location not under the Platform | `The value you entered does not match with data under the Platform in SAP.` |
| V13 | Equipment Number not under the Functional Location | `The value you entered does not match with data under the Functional Location in SAP.` |
| V14 | Text longer than the limit in `Dropdown Options` | `The text you entered exceeds the maximum character limit. Please refer to the sheet name “Dropdown Options” for the maximum limit.` |
| V15 | Wrong data type (text in a number field, for example Duration `abc`) | `The input format does not match requirements. Please refer to the sheet name “Dropdown Options” for the allowable format.` |
| V16 | Number outside the boundary (for example POB beyond the limit in `Dropdown Options`) | `The value you entered exceeds the allowed boundary. Please refer to the sheet name “Dropdown Options” for the limits.` |
| V17 | More than 5 Manpower Resources | `The total allocation of Manpower Resources exceeds the maximum limit of 5 resources.` |
| V18 | The same Manpower Resource twice | `The values entered in Manpower Resource contain duplicates. Each resource name must be unique.` |

1. Upload the file of each row. -> The error table shows the message of the row `Expected Invalid Detail`, the cell and field point to the wrong value, and `Confirm` is disabled.
Clean up: Cancel after each file. Independent: yes.

### TC-038 [BE][MT] Verify Master Data values are matched without case and stored in the master format (POS) [Auto]
Precondition: common; a Master Data value `Pre SD` for Priority, a known Work Header `HDR-A`
Priority: Medium
Trace: AC-7.5
1. Upload a file with a Work row (Add, blank UUID, `WN-100050`, Work Header written in lower case, Priority `pre sd`, one breakdown Add). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Open the Work and read Work Header and Priority. -> They show the master format (`HDR-A` as in master, `Pre SD`), not the lower case text of the file.
Test data set: UPPER, lower, mixed case. Clean up: delete the Work. Independent: yes.

### TC-039 [BE][MT] Verify the Manpower Resource limit on the border (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.6, AC-7.7
1. Upload a Work row with 4 different Manpower Resource names. -> No error.
2. Upload a Work row with 5 different names. -> No error.
3. Upload a Work row with 6 different names. -> The error is `The total allocation of Manpower Resources exceeds the maximum limit of 5 resources.`
4. Upload a Work row with 3 names where one name appears twice. -> The error is `The values entered in Manpower Resource contain duplicates. Each resource name must be unique.`
Clean up: Cancel. Independent: yes.

### TC-040 [BE][MT] Verify a breakdown row placed before any Work row is refused (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.7
1. Upload a file where the first data row is a Work Breakdown row (Add) and no Work row is above it. -> The error table shows `The work breakdown must belong to a work`.
2. Check `Confirm`. -> `Confirm` is disabled.
Clean up: Cancel. Independent: yes.

### TC-041 [FE][BE][MT] Verify errors are shown first and the duplicate step only starts after they are fixed (NEG) [Auto]
Precondition: common; an existing active Work with Work Header `HDR-A` and Work Number `WN-100060`
Priority: High
Trace: AC-7.1, AC-8.1
1. Upload a file with a new Work (Add, `HDR-A`, `WN-100060`, one breakdown) and a second Work row that has an error (blank Action). -> The error banner and error table are shown.
2. Check the area above the table. -> No duplicate banner and no duplicate options are shown.
3. Fix the error in the file and upload it again. -> The error banner is gone.
4. Check the duplicate area. -> The duplicate banner and options now appear for the first Work.
Clean up: Cancel. Independent: yes.

### TC-042 [FE][BE][MT] Verify the duplicate banner, default option and table for a Work already in the system (POS) [Auto]
Precondition: common; an existing active Work with Work Header `HDR-A` and Work Number `WN-100061`
Priority: High
Trace: AC-8, AC-8.2, AC-8.3.1, AC-8.4.1, AC-8.5, AC-8.5.1, AC-8.5.2, AC-8.6, AC-8.6.1
1. Upload a file with one new Work (Add, blank UUID, `HDR-A`, `WN-100061`, one breakdown). -> The preview shows a yellow banner above the table.
2. Read the banner. -> It reads `1 duplicate works were found in the file.`
3. Read the prompt below. -> It reads `Do you want to import all works or skip the duplicates?`
4. Check the radio buttons. -> `Import without duplicate works` is selected and `Import all works` is not.
5. Read the duplicate table headings. -> The columns are `Row` and `Duplicate Detail`.
6. Read the row. -> `Row` is the row number of the duplicate in the file and `Duplicate Detail` is `The values in fields Work Header and Work Number already exists in the system`.
7. Check `Confirm`. -> `Confirm` is enabled.
Clean up: Cancel. Independent: yes.

### TC-043 [FE][BE][MT] Verify the duplicate message for a Work repeated inside the file (POS) [Auto]
Precondition: common; no Work with `WN-100062` in the Worklist
Priority: High
Trace: AC-8.3.1, AC-8.4.2, AC-8.6.4
1. Upload a file with 2 new Work rows (Add, blank UUID) that have the same Work Header `HDR-A` and Work Number `WN-100062`, each with one breakdown. -> The duplicate banner is shown.
2. Read the duplicate table. -> The message is `The values in fields Work Header and Work Number are duplicated in the file.`
3. Read the banner count. -> It matches the number of duplicate rows shown in the table.
Clean up: Cancel. Independent: yes.

### TC-044 [BE][MT] Verify Import without duplicate works skips the duplicate Works and their breakdowns (POS) [Auto]
Precondition: common; an existing active Work `WN-100063` with `HDR-A`; no Work `WN-100064`
Priority: High
Trace: AC-8.5.3, AC-9.2.1
1. Record the `Total Results` and the breakdown count of the existing Work. -> The values are written down.
2. Upload a file: duplicate Work (Add, `HDR-A`, `WN-100063`, 2 breakdowns) and a non-duplicate Work (Add, `WN-100064`, 1 breakdown). -> The duplicate banner appears with `Import without duplicate works` selected.
3. Click `Confirm`. -> The import finishes.
4. Read `Total Results`. -> It is the recorded count plus 1 (only `WN-100064` was added).
5. Check the existing Work `WN-100063`. -> It has the same breakdowns as recorded; none of the 2 breakdowns from the file were added anywhere.
Clean up: delete `WN-100064`. Independent: yes.

### TC-045 [BE][MT] Verify Import all works imports the duplicates and their breakdowns (POS) [Auto]
Precondition: common; an existing active Work `WN-100065` with `HDR-A`
Priority: High
Trace: AC-8.5.3, AC-9.2.1
1. Record the `Total Results`. -> The value is written down.
2. Upload a file with a duplicate Work (Add, `HDR-A`, `WN-100065`, 2 breakdowns) and a non-duplicate Work (Add, `WN-100066`, 1 breakdown). -> The duplicate banner is shown.
3. Select `Import all works`. -> The radio button is selected and `Import without duplicate works` is not.
4. Click `Confirm`. -> The import finishes.
5. Read `Total Results`. -> It is the recorded count plus 2.
6. Open the duplicate Work that was added. -> It has its 2 breakdowns.
Clean up: delete the new Works. Independent: yes.

### TC-046 [BE][MT] Verify Work Number is checked only when it has at least 8 characters (BND) [Auto]
Precondition: common; existing active Works with Work Numbers of 7, 8 and 9 characters and the same Work Header `HDR-A` (for example `WN-1007`, `WN-10008`... made up for the test)
Priority: High
Trace: AC-8.3.2, AC-8.3.1
1. Upload a new Work (Add) with the same Work Header and the 7-character Work Number of an existing Work. -> No duplicate banner is shown.
2. Upload a new Work (Add) with the same Work Header and the 8-character Work Number of an existing Work. -> The duplicate banner is shown.
3. Upload a new Work (Add) with the same Work Header and the 9-character Work Number of an existing Work. -> The duplicate banner is shown.
Test data set: lengths 7, 8, 9. Clean up: Cancel. Independent: yes.

### TC-047 [BE][MT] Verify Work Header and Work Number must both match to be a duplicate (NEG) [Auto]
Precondition: common; an existing Work with Work Header `HDR-A` and Work Number `WN-100067`; a second Work Header value `HDR-B`
Priority: Medium
Trace: AC-8.3.1
1. Upload a new Work (Add) with `HDR-A` and a different Work Number `WN-100068`. -> No duplicate banner.
2. Upload a new Work (Add) with `HDR-B` and Work Number `WN-100067`. -> No duplicate banner.
3. Upload a new Work (Add) with `HDR-A` and Work Number `wn-100067` in other case. -> The result is shown as the system treats case in Work Number; the tester records it (Open question: whether case variants are duplicates; see lesson L-6, the Import and Manual Create must agree).
Clean up: Cancel. Independent: yes.

### TC-048 [BE][MT] Verify a soft-deleted Work is not used for duplicate checking (POS) [Auto]
Precondition: common; a Work `WN-100069` with `HDR-A` that was soft deleted (Status `D`)
Priority: Medium
Trace: AC-8.4.1, AC-8.6.3
1. Upload a new Work (Add, `HDR-A`, `WN-100069`, one breakdown). -> No duplicate banner and no duplicate table are shown.
2. Check `Confirm`. -> `Confirm` is enabled.
Clean up: Cancel. Independent: yes.

### TC-049 [FE][BE][MT] Verify a row that duplicates both a system Work and another row is shown as two separate lines (POS) [Auto]
Precondition: common; an existing active Work `WN-100070` with `HDR-A`
Priority: Medium
Trace: AC-8.6.2, AC-8.4
1. Upload a file with 2 new Works (Add, blank UUID) that both have `HDR-A` and `WN-100070`. -> The duplicate banner is shown.
2. Read the duplicate table for the first of these rows. -> It has one line `already exists in the system` and one line `are duplicated in the file`, not one merged line.
3. Read the banner count. -> It matches the number of duplicate Works and agrees with the table.
Clean up: Cancel. Independent: yes.

### TC-050 [BE][MT] Verify the duplicate check applies to new Works only, not to breakdowns or Works with UUID (POS) [Auto]
Precondition: common; an existing Work `WN-100071` with `HDR-A` and UUID; two breakdowns in it with the same Task Description
Priority: High
Trace: AC-8.2.1, AC-8.2.2, AC-8.4.3
1. Upload a file with the Work row (Revise, UUID, `HDR-A`, `WN-100071`) and two breakdown rows (Add, same Task Description). -> No duplicate banner is shown; breakdowns are never flagged.
2. Upload a file with that Work (Revise, UUID) and one other Work row (Revise, other UUID) with the same Work Header and Work Number. -> No duplicate banner for the Revise rows.
3. Upload a file with the same Revise Work (UUID, `HDR-A`, `WN-100071`) and a new Work (Add, blank UUID, `HDR-A`, `WN-100071`). -> The duplicate banner appears for the new Work only, with the message `...are duplicated in the file.`
Clean up: Cancel. Independent: yes.

### TC-051 [FE][MT] Verify the radio buttons can be changed with the mouse and the keyboard (Exotic: keyboard use) [Manual: a person checks the focus and look]
Precondition: common; a file that causes a duplicate banner
Priority: Low
Trace: AC-8.5.3
1. Upload the file. -> The two options show; `Import without duplicate works` is selected.
2. Press `Tab` until the radio group has focus. -> A focus mark is visible on the selected option.
3. Press the down arrow. -> `Import all works` becomes selected and the other one is not.
4. Press the up arrow. -> `Import without duplicate works` is selected again.

### TC-052 [BE][MT] Verify Last Write Wins when another user edits the Work after the preview (Exotic: two users) [Manual: needs two people or two logins and a timed step]
Precondition: common; a Work `W1` open in the preview as Revise (new Job Description `Replace pump seal C`); a second TM logged in on another browser
Priority: High
Trace: AC-9.1
1. In the first browser upload a file that revises `W1` and wait on the preview. -> The preview shows no error.
2. In the second browser open `W1` with `Edit Work Details`, change the Job Description to `Replace pump seal D` and click `Save`. -> The second user's change is saved.
3. In the first browser click `Confirm`. -> The import finishes.
4. Open `W1`. -> The Job Description is `Replace pump seal C`; the file is the source of truth and no error is shown.
Clean up: restore data.

### TC-053 [FE][BE][MT] Verify a double click on Confirm imports once (Exotic: double click) [Auto]
Precondition: common
Priority: High
Trace: AC-9.2
1. Record the `Total Results`. -> The value is written down.
2. Upload a valid file with 3 new Works (Add, one breakdown each). -> The preview shows no error.
3. Double click `Confirm`. -> The dialog closes.
4. Read the `Total Results`. -> It is the recorded count plus 3, not plus 6.
5. Open one new Work. -> It has one breakdown only, no repeated breakdown.
Clean up: delete the new Works. Independent: yes.

### TC-054 [BE][MT] Verify two users importing the same file at the same time create no half-finished data (Exotic: two users) [Manual: needs two logins and a timed step]
Precondition: common; two TM users; a file that adds 2 new Works with a fresh Work Number
Priority: Medium
Trace: AC-9.1, AC-9.2
1. In both browsers upload the same file. -> Both previews show the file; the second preview shows no duplicate yet because nothing is saved.
2. Click `Confirm` in both browsers within a few seconds. -> Both imports finish without a system error.
3. Read the Worklist. -> The Works exist as the user's choice allows (by Last Write Wins, each Work with all its breakdowns, none half-created, none with a missing parent).
Clean up: delete the new Works.

### TC-055 [BE][MT] Verify Confirm when the Revise target was deleted by someone else after the preview (Exotic: two users) [Manual: needs two logins; the message is not in the Story]
Precondition: common; a Work `W1`; a second TM user
Priority: Medium
Trace: AC-9.1
1. Upload a file that revises `W1` and stay on the preview. -> The preview shows no error.
2. In another browser delete `W1` through `⋮` > `Delete Work`. -> `W1` is deleted.
3. Click `Confirm` in the first browser. -> The user gets a clear message and no wrong record is created or half-changed (message text: see Open questions 6).
Clean up: none.

### TC-056 [BE][MT] Verify strange text in every free-text field of the file is stored and shown back as typed (Exotic: strange input) [Auto]
Precondition: common
Priority: High
Trace: AC-7.6, AC-7.7
The test loops over the data set below, for each free-text field of the template (Work Number, Job Description, Task Description, Remark and any other text column the template has). Use only values the Excel cell can hold.

| Value | Example |
|---|---|
| Special characters | `\ / : * ? " < > \| & # % '` inside a text |
| Spaces around | `  Pump A  ` |
| Thai | `ซ่อมปั๊ม` |
| Emoji | `Pump 🔧🔧` |
| HTML-like | `<b>Pump</b>` |
| New line inside the cell | two lines |
| At the limit and one above | text of exactly the maximum length and one more |

1. Upload a file with one new Work (Add, one breakdown) where one field holds the value. -> A value within the limit gives no error; a value above the limit gives `The text you entered exceeds the maximum character limit. Please refer to the sheet name “Dropdown Options” for the maximum limit.`
2. Click `Confirm` for a file without errors. -> The import finishes.
3. Reload the Worklist and open the Work. -> The value is shown as typed (HTML text shown as text, not run), on the Worklist and on `View Work Details`.
4. Search the Work by this value in the table search box and press Enter. -> The Work is found.
Clean up: delete the Works. Independent: yes.

### TC-057 [BE][MT] Verify a UUID with spaces or in another case is handled clearly (Exotic: strange input) [Manual: the expected result is open, see Open questions 5]
Precondition: common; an existing Work UUID
Priority: Low
Trace: AC-3.3
1. Upload a Work row (Revise) with the UUID with a space before and after. -> The row is matched to the existing Work (the user pasted a real UUID) or shows `The UUID you entered is not exist in the system.`; it is never skipped without a message.
2. Upload a Work row (Revise) with the UUID in capital letters. -> The same rule as step 1.

### TC-058 [BE][MT] Verify blank rows between data rows are ignored and not counted as errors (Exotic: real user) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.1, AC-7.3
1. Upload a file with a Work row, then 3 empty rows, then a breakdown row. -> The preview shows 2 rows; no error is shown for the empty rows.
2. Click `Confirm`. -> The import finishes with the Work and its breakdown.
Clean up: delete the Work. Independent: yes.

### TC-059 [FE][MT] Verify uploading a fixed file after an error clears the old errors (Exotic: real user) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.1
1. Upload a file with an error. -> The error banner, table and disabled `Confirm` show.
2. Upload the corrected file in the same dialog. -> The old error banner and table are gone.
3. Check `Confirm`. -> `Confirm` is enabled.
Clean up: Cancel. Independent: yes.

### TC-060 [FE][BE][MT] Verify Cancel discards the import and changes nothing (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-9.2, AC-9.2.2
1. Record the `Total Results` and the values of one Work that the file revises. -> The values are written down.
2. Upload a file that adds one Work and revises that Work. -> The preview shows no error.
3. Click `Cancel`. -> The dialog closes and the Worklist page is shown again.
4. Reload the page and read `Total Results` and the Work values. -> They are the same as recorded; nothing was added or changed.
Clean up: none. Independent: yes.

### TC-061 [FE][MT] Verify closing or leaving the dialog midway saves nothing (Exotic: Back, Refresh) [Auto]
Precondition: common
Priority: Medium
Trace: AC-9.2.2
1. Record the `Total Results`. -> The value is written down.
2. Upload a valid file with 2 new Works and stay on the preview. -> The preview shows the rows.
3. Reload the browser page. -> The dialog is gone and the Worklist is shown.
4. Read `Total Results`. -> It is the recorded count; nothing was imported.
5. Repeat step 2 and press the browser Back button. -> The page leaves the dialog or the page; `Total Results` is still the recorded count.
Clean up: none. Independent: yes.

### TC-062 [FE][BE][MT] Verify Confirm saves everything at once and the result is still there after reload (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-9.2, AC-9.2.1
1. Upload a file with one added Work, one revised Work and one deleted Work. -> The preview shows no error.
2. Click `Confirm`. -> The dialog closes and the Worklist shows the three changes.
3. Reload the page. -> The new Work is listed, the revised Work shows the new values, the deleted Work shows Status `D`.
Clean up: card-owned data. Independent: yes.

### TC-063 [FE][BE][MT] Verify imported data is the same on every screen that shows it (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-5, AC-1.2, AC-6.4
1. Import a file with one new Work (Add, Priority `P1`, POB `4`, Duration `3`, 2 breakdowns). -> The import finishes.
2. Read the Work's row in the Worklist table. -> Priority, POB, Man-hrs., Duration and Manpower Resource are shown.
3. Open `View Work Details`. -> The header and the Work Details show the same values as the row.
4. Open `Edit Breakdown` (the page `Edit Work Breakdown`). -> The 2 breakdowns, their order and their values are the same as in `View Work Details`.
5. Open `Edit Work Details`. -> The values are the same as in the row; nothing was shifted or lost.
Clean up: delete the Work. Independent: yes.

### TC-064 [FE][BE][MT] Verify a Work deleted by import is gone from the places that show active Works (NEG) [Manual: depends on pages that vary by plan]
Precondition: common; a Work with breakdowns used in the plan's other pages (for example the Shutdown Logic page of the same plan)
Priority: Medium
Trace: AC-1.4.1, AC-6.3.1
1. Note where the Work and its breakdowns appear in the plan's other pages. -> The places are written down.
2. Delete the Work by import and click `Confirm`. -> The import finishes.
3. Open each noted place. -> The Work and its breakdowns are not shown as active anywhere, and no page breaks or shows a link to a deleted record.

### TC-065 [FE][MT] Verify imported Works can be found by search together with a filter (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Import one new Work `WN-100080` with Job Description `Replace pump seal E`. -> The import finishes.
2. Type `WN-100080` in the search box `Search work number and job description` and press Enter. -> After the response arrives, one row is shown and `Total Results` is 1.
3. Open a column filter and apply a value that does not match this Work. -> The table is empty and `Total Results` is 0.
4. Click `Reset Table Filter`. -> The Work shows again.
Clean up: delete the Work. Independent: yes.

### TC-066 [FE][MT] Verify replacing a valid file by a bad file brings the errors back and disables Confirm (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.1
1. Upload a valid file with one new Work (Add, `WN-100100`, one breakdown). -> The preview shows no error and `Confirm` is enabled.
2. Upload a second file in the same dialog where the `Action` cell of the Work row is blank. -> The error banner and the error table show; the rows of the first file are gone from the preview.
3. Check `Confirm`. -> `Confirm` is disabled again.
Clean up: Cancel. Independent: yes.

### TC-067 [FE][BE][MT] Verify the duplicate option set back by hand gives the default result on Confirm (POS) [Auto]
Precondition: common; an existing active Work `WN-100101` with `HDR-A`; no Work `WN-100102`
Priority: Medium
Trace: AC-8.5, AC-8.5.3
1. Record the `Total Results`. -> The value is written down.
2. Upload a file with a duplicate Work (Add, `HDR-A`, `WN-100101`, one breakdown) and a non-duplicate Work (Add, `WN-100102`, one breakdown). -> The duplicate banner shows with `Import without duplicate works` selected.
3. Select `Import all works`. -> `Import all works` is selected.
4. Select `Import without duplicate works` again. -> `Import without duplicate works` is selected and `Import all works` is not.
5. Click `Confirm`. -> The import finishes.
6. Read `Total Results`. -> It is the recorded count plus 1; the duplicate Work was skipped.
Clean up: delete `WN-100102`. Independent: yes.

### TC-068 [FE][MT] Verify the duplicate option goes back to the default when another file is uploaded (POS) [Auto]
Precondition: common; an existing active Work `WN-100103` with `HDR-A`
Priority: Low
Trace: AC-8.5.2
1. Upload a file with a duplicate Work (Add, `HDR-A`, `WN-100103`, one breakdown). -> The duplicate banner shows with `Import without duplicate works` selected.
2. Select `Import all works`. -> `Import all works` is selected.
3. Upload the same file again in the same dialog. -> The duplicate banner shows again.
4. Read the radio buttons. -> `Import without duplicate works` is selected and `Import all works` is not.
Clean up: Cancel. Independent: yes.

### TC-069 [FE][MT] Verify the close icon, Esc and a click outside the dialog save nothing (Exotic: leaving midway) [Auto]
Precondition: common
Priority: Medium
Trace: AC-9.2.2
1. Record the `Total Results`. -> The value is written down.
2. Upload a valid file with 2 new Works and stay on the preview. -> The preview shows the rows.
3. Click the close icon of the dialog. -> The dialog closes and the Worklist is shown.
4. Read `Total Results`. -> It is the recorded count; nothing was imported.
5. Open the import again, upload the same file and press `Esc`. -> The dialog closes (or stays open if the design blocks `Esc`); nothing is saved.
6. Open the import again, upload the same file and click outside the dialog. -> The dialog closes (or stays open if the design blocks it); nothing is saved.
7. Read `Total Results`. -> It is still the recorded count.
Clean up: none. Independent: yes.

### TC-070 [FE][MT] Verify the dialog is empty when it is opened again after Cancel or Confirm (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-9.2, AC-9.2.2
1. Upload a file with an error and click `Cancel`. -> The dialog closes.
2. Open `Create Work` > `Import Excel` again. -> The upload area is empty; no old file name, no error banner and no error table are shown.
3. Upload a valid file with one new Work (Add, `WN-100104`, one breakdown) and click `Confirm`. -> The import finishes and the dialog closes.
4. Open `Create Work` > `Import Excel` again. -> The upload area is empty; no old preview, no duplicate banner and `Confirm` is not enabled.
Clean up: delete the Work. Independent: yes.

### TC-071 [FE][BE][MT] Verify a search active on the Worklist when the import is confirmed (Exotic: related screen) [Auto]
Precondition: common
Priority: Medium
Trace: AC-9.2.1
1. Type `WN-100110` in the search box `Search work number and job description` and press Enter. -> After the response arrives, the table shows no row and `Total Results` is 0.
2. Import a file with one new Work `WN-100110` (Add, one breakdown) and click `Confirm`. -> The import finishes and the dialog closes.
3. Read the table and `Total Results`. -> The table is not left in a wrong state: either the new Work is shown with `Total Results` 1 because it matches the search, or the search is cleared and the table is refreshed; no stale empty table is shown.
Clean up: delete the Work, clear the search. Independent: yes.

### TC-072 [FE][MT] Verify the Row number in the duplicate table is the Excel row number (POS) [Auto]
Precondition: common; an existing active Work `WN-100111` with `HDR-A`; no Work `WN-100112`
Priority: Medium
Trace: AC-8.6, AC-8.6.1
1. Build a file where Excel row 1 is the header, row 2 is a new Work `WN-100112` (Add, one breakdown in row 3) and row 4 is a new Work (Add, `HDR-A`, `WN-100111`, one breakdown in row 5). -> The file is ready.
2. Upload the file. -> The duplicate banner shows.
3. Read the `Row` column of the duplicate table. -> It shows `4`, the row number of the duplicate Work as seen in the Excel sheet (see Open questions 11).
Clean up: Cancel. Independent: yes.

### TC-073 [BE][MT] Verify a Revise row is never skipped by Import without duplicate works (POS) [Auto]
Precondition: common; an existing Work `WN-100113` with `HDR-A` and UUID; a second existing Work with UUID
Priority: High
Trace: AC-8.2.1, AC-8.5.3
1. Record the Job Description of both existing Works. -> The values are written down.
2. Upload a file with the first Work (Revise, UUID, new Job Description `Replace pump seal F`) and the second Work (Revise, its UUID, `HDR-A`, `WN-100113`, new Job Description `Replace pump seal G`). -> No duplicate banner is shown (or, if shown, `Import without duplicate works` is selected).
3. Click `Confirm`. -> The import finishes.
4. Read the Job Description of both Works. -> Both show the new values; no Revise row was skipped (see Open questions 12).
Clean up: set the Job Descriptions back. Independent: yes.

### TC-074 [FE][BE][MT] Verify large numbers are shown the same way after import as on the other number columns (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7.7, AC-1.2
1. Look up the maximum of POB, Duration and Man-hrs. in `Dropdown Options`. -> The three limits are written down.
2. Upload a file with a new Work (Add, `WN-100120`, POB, Duration and Man-hrs. at the limits, one breakdown with the same values). -> The preview shows no error.
3. Click `Confirm`. -> The import finishes.
4. Read POB, Duration and Man-hrs. in the Worklist row and in `View Work Details`. -> The values equal the file values, with the same thousand separator and decimals as the other number columns of the Worklist; nothing is cut or rounded.
Clean up: delete the Work. Independent: yes.

### TC-075 [BE][MT] Verify Work Header and Work Number with spaces around them in the duplicate check (Exotic: strange input) [Auto]
Precondition: common; an existing active Work with `HDR-A` and `WN-100121`
Priority: Medium
Trace: AC-8.3.1
1. Upload a new Work (Add, blank UUID, `HDR-A`, Work Number `  WN-100121  ` with spaces before and after, one breakdown). -> The result is clear: either the duplicate banner shows (spaces are ignored) or no banner shows; the tester records which, because the Story is silent.
2. Upload a new Work (Add, `HDR-A`, `WN-100121`, one breakdown). -> The duplicate banner shows, so the plain value and the value with spaces are treated the same way as in step 1 (a difference between the two is raised to the BA).
Clean up: Cancel. Independent: yes.

### TC-076 [BE][MT] Verify an Action cell with only spaces is an Error (Exotic: strange input) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1, AC-1.5
1. Upload a file with a Work row where the `Action` cell holds only spaces. -> The error table shows `This field is mandatory.` for the cell of `Action`.
2. Check `Confirm`. -> `Confirm` is disabled.
Clean up: Cancel. Independent: yes.

### TC-077 [FE][BE][MT] Verify Revise values show on every screen that shows them (POS) [Auto]
Precondition: common; an existing Work with UUID and 2 breakdowns with UUIDs
Priority: High
Trace: AC-1.3, AC-1.3.1, AC-1.3.2, AC-5
1. Upload a file: Work row (Revise, UUID, Priority `P2`, Job Description `Replace pump seal H`), breakdown 1 (Revise, UUID, POB `3`, Task Description `Isolate pump line 2`). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Read the Work's row in the Worklist table. -> Priority `P2`, Job Description `Replace pump seal H` and the recalculated POB are shown.
4. Open `View Work Details`. -> The header and the Work Details show the same values as the row.
5. Open `Edit Work Details`. -> The values are the same as in the row.
6. Open `Edit Breakdown` (the page `Edit Work Breakdown`). -> Breakdown 1 shows `Isolate pump line 2` and POB `3`; both breakdowns are in the same order as before.
Clean up: restore data. Independent: yes.

### TC-078 [BE][MT] Verify a Delete or Revise on the UUID of a Work that is already soft deleted (Exotic: reverse) [Auto]
Precondition: common; a Work with UUID that was soft deleted by import earlier (Status `D`)
Priority: Medium
Trace: AC-3.3, AC-1.4.1
1. Upload a file with that Work (Delete, its UUID). -> The result is clear: an error such as `The UUID you entered is not exist in the system.` or no change; nothing is deleted a second time and the page does not break (see Open questions 13).
2. Upload a file with that Work (Revise, its UUID, new Job Description). -> The Work is not brought back to Active silently; the user sees an error or the row is refused.
3. Read the Work in the Worklist. -> The Work still shows Status `D` and its Job Description is not changed.
Clean up: none. Independent: yes.

### TC-079 [BE][MT] Verify importing the same file twice (Exotic: real user) [Auto]
Precondition: common; no Work `WN-100130` in the Worklist
Priority: High
Trace: AC-8.5.3, AC-9.2.1, AC-4.3
1. Record the `Total Results`. -> The value is written down.
2. Upload a file with one new Work (Add, `HDR-A`, `WN-100130`, Work Breakdown Type `PRESET-N`, one breakdown Add) and click `Confirm`. -> The import finishes.
3. Upload the same file again. -> The duplicate banner shows for the Work.
4. Click `Confirm` with `Import without duplicate works` selected. -> The import finishes.
5. Read `Total Results`. -> It is the recorded count plus 1; no second copy of the Work or of its breakdowns was made.
6. Repeat steps 3 and 4 with `Import all works`. -> A second Work is added with the same breakdowns once (the preset rows are not doubled).
Clean up: delete the new Works. Independent: yes.

### TC-080 [FE][BE][MT] Verify the preset rows on the Edit Work Breakdown page and after a reload (POS) [Auto]
Precondition: common; a preset type `PRESET-N` with several rows
Priority: Medium
Trace: AC-4.3.1, AC-4.3.4, AC-6.4
1. Upload a file with one new Work (Add, `WN-100140`, Work Breakdown Type `PRESET-N`) and click `Confirm`. -> The import finishes.
2. Reload the Worklist and open `Edit Breakdown` (the page `Edit Work Breakdown`). -> The page lists the rows of `PRESET-N` in the preset order.
3. Compare with `View Work Details`. -> The same rows in the same order.
Clean up: delete the Work. Independent: yes.

### TC-081 [BE][MT] Verify the summary of a Work whose breakdowns are all deleted by one Revise file (BND) [Auto]
Precondition: common; a Work with 2 breakdowns with UUIDs
Priority: High
Trace: AC-5, AC-2.3.3
1. Upload a file: Work row (Revise, UUID), breakdown 1 (Delete, UUID), breakdown 2 (Delete, UUID). -> The preview shows no error.
2. Click `Confirm`. -> The import finishes.
3. Read the Work's summary (Manpower Resource, Duration, POB, Man-hrs., D/N Shift) in the Worklist and `View Work Details`. -> The summary shows the empty or zero state of a Work without breakdowns on both screens; the old totals are not kept.
Clean up: card-owned data. Independent: yes.

### TC-082 [FE][BE][MT] Verify the rollup shows the same on every screen after import (POS) [Auto]
Precondition: common; a Work with 2 breakdowns with UUIDs
Priority: High
Trace: AC-5
1. Upload a file with one Work (Revise, UUID) and breakdown 1 (Revise, UUID, new POB and Man-hrs.), and click `Confirm`. -> The import finishes.
2. Read the Work's summary in the Worklist row. -> The recalculated values are shown.
3. Open `View Work Details`. -> The header shows the same summary values.
4. Open `Edit Work Details`. -> The same summary values are shown.
Clean up: restore data. Independent: yes.

### TC-083 [FE][BE][MT] Verify the 3-tier order after reload and on the Edit Work Breakdown page (POS) [Auto]
Precondition: common; a Work with `E1`, `E2`, `E3`, `E4` in this order (with UUIDs)
Priority: Medium
Trace: AC-6.4, AC-6.4.1, AC-6.4.2
1. Upload a file: Work row (Revise, UUID), rows `E3` (Revise), `New-A` (Add), and click `Confirm`. -> The import finishes.
2. Reload the Worklist and open `View Work Details`. -> The order is `E1`, `E2`, `E4`, `E3`, `New-A`.
3. Open `Edit Breakdown` (the page `Edit Work Breakdown`). -> The same order is shown.
Clean up: restore data. Independent: yes.

### TC-084 [FE][BE][MT] Verify Master Data values in other case show in the master format on the Worklist row and Edit pages (POS) [Auto]
Precondition: common; a Master Data Priority `Pre SD`, a known Work Header `HDR-A`
Priority: Medium
Trace: AC-7.5
1. Import a Work (Add, `WN-100150`, Work Header in lower case, Priority `pre sd`, one breakdown Add) and click `Confirm`. -> The import finishes.
2. Read Work Header and Priority in the Worklist row. -> `HDR-A` and `Pre SD` as in master.
3. Open `Edit Work Details`. -> The same master format values.
4. Open `Edit Breakdown`. -> The breakdown shows Priority `Pre SD` in the master format.
Clean up: delete the Work. Independent: yes.

## Final counts

Total 84 cases (65 before the bug-check fix round, 19 added: TC-066 to TC-084).

Priority: High 47, Medium 34, Low 4.
Automation: Auto 76, Manual only or Partial 8 (Excel template check, two real users with timing, keyboard and look judgement, open expected results, pages that vary by plan).

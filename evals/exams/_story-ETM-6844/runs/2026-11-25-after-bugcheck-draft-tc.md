# Draft test cases - ETM-6844 Export Work and Work Breakdown to Excel

Story: ETM-6844 (frozen exam copy). Source: story.md, docs/modules/core-navigation-worklist.md, knowledge/*. No analyst.md or inspector.md exists for this exam: the AC ids below are numbered from the Story's Acceptance Criteria (AC-1.1 = item 1, sub-item 1, and so on). AC-0 = the Pre-Conditions (Export Work permission).
Existing [QA] subtasks: none known.
Common precondition: user is logged in on QA with the Export Work permission, opens an Active plan of a Shutdown Event, and sees the Worklist table (Planning tab > Plan Card > Worklist row, opens a new tab). The export icon sits left of `Create Work`. The plan holds at least one Work with several Work Breakdown rows, one Work with no Work Breakdown typed fields (optional fields empty), and Works with different Hot Bed values (Yes and No), Accommodation values, Priority values.
Notation: step -> expected result. `[Auto]` = Playwright candidate, `[Partial]` = script plus a person reads the Excel look, `[Manual]` = person only. Priority is set by damage (the Story has none).

## Think like the user
- Who: a Turnaround Manager or Job Owner, once or twice per plan, usually to edit many rows in Excel and import them back.
- Wants: one file with everything, ready to edit and re-import with no clean-up.
- Careless version: exports while a filter is on, expects only what he sees (Story says all); fills Action by hand; opens the file in Excel and edits; or exports, a colleague deletes a Work, then he re-imports.

## Coverage map
| Requirement / screen state | Technique | Risk | Planned cases |
|---|---|---|---|
| AC-0 permission to export | Roles | Export shown/allowed to a user without Export Work | TC-001, TC-002, TC-003 |
| AC-1.1 .xlsx generated and downloaded | Screen states | Wrong file type, empty file, nothing downloads | TC-004 |
| AC-1.2 template re-use (Worklist_Data, validations, conditional formatting, helper tabs) | Input groups | Helper tab lost, dropdown lost | TC-005, TC-006 |
| AC-1.3 file name pattern | Edge values, strange input | Wrong date, special characters in names, long names | TC-007, TC-008, TC-035 |
| AC-2.1 selected Work + all Breakdowns | Condition table | Missing breakdown, extra rows | TC-009, TC-012 |
| AC-2.2 hierarchy order | State/order | Breakdown under wrong Work | TC-010 |
| AC-2.3 UUID filled and editable | Real-user view | Blank/duplicate UUID, locked cell | TC-011 |
| AC-3.1 Action blank | Fixed list effect check | Default Revise/Add written | TC-013 |
| AC-3.2 Work Breakdown Type blank at Work level | Fixed list, state | Value leaks, Breakdown rows wrongly blanked | TC-014 |
| AC-3.3 dropdowns with warning style | Input groups | Strict stop style, list lost | TC-006 |
| AC-3.3 fixed-list columns shown as the product shows them (Hot Bed Yes/No, Accommodation, Priority, Day/Night shift, Work Status) | Effects and their reverse | Code written instead of full word (e.g. `N` for `No`) | TC-015 |
| AC-3.4 empty = empty cell, no `null` or `-` | Edge values (empty) | Placeholder text | TC-016 |
| AC-3.5 conditional formatting independence | Condition table | Data hidden for fields styled inactive | TC-017 |
| Disabled/system columns (Functional Location, Equipment Number, System Condition, POB, Man-hrs., Work Status, Breakdown Status) | Same data many pages | Value differs from the screen | TC-018 |
| AC-4.1 complete dataset | Boundary (one, many rows) | Only first page of data, virtual scroll cut | TC-019, TC-020 |
| AC-4.2 filter, search, column visibility have zero effect | Combinations (lesson 2) | Export follows the filter | TC-021, TC-022, TC-036, TC-037 |
| Free-text fields strange input (Work Number, Job Description, Remark, Task Description, Department, Platform, names) | Grid and input habits | Special chars, spaces, emoji, HTML broken or changed in the file | TC-023, TC-024 |
| Date, number and time values shown as on screen | Same data many pages | Day shift, decimals | TC-025 |
| Round trip: exported file re-imported | Real-user view | Re-import rejects its own file | TC-026 |
| Trigger from Gantt Table and Planning Tab | Screen states | Same export, different result | TC-027 |
| Empty worklist | Screen state empty | Crash or file with no header | TC-028 |
| Slow / double click / two tabs / data deleted meanwhile | Error guessing, lesson 1 | Two files, stale data | TC-029, TC-030, TC-031 |
| Exported file after later edit of data | Same data many pages | Old data in export | TC-032 |
| Loading and failure state | Screen states | No feedback, silent failure | TC-033 |

Categories (lessons-learned): 1 two people - TC-031; 2 filter+sort+search - TC-021, TC-022; 3 old migrated data - TC-034; 4 strange input - TC-023, TC-024, TC-008; 5 reorder - not relevant, export has no reorder (row order follows Work then Breakdown, TC-010); 6 linked data - TC-009, TC-032; 7 charts - not relevant, no chart; 8 same data many pages - TC-015, TC-018, TC-025, TC-032; 9 matrix - TC-017 and TC-015 (expected tables). L-1 sorted lists - not relevant, no sorted list (row order TC-010); L-2 special filter choice kept - TC-022; L-3 read after response - applied in TC-021; L-4 paste - not relevant, no paste (but Excel edit then re-import TC-026); L-5 collapse - TC-022, TC-036 (collapsed levels do not change the export); L-6 case variants - TC-024; L-7 selected state - not relevant, no picker; L-8 Story changed - not relevant to a case, the Story is frozen; the lead compares with the changelog.
Skipped: keyboard Tab/Enter order - not relevant, the export is one click with no input fields.

Counts: High 22 / Medium 12 / Low 3 (37 cases). Auto 29 / Partial or Manual 8.

## Open questions
1. Which Works are "selected"? AC-4.1 says all Work in the plan, but the Pre-Conditions and AC-2.1 say "selected Work records". Is there a row selection? Written as all records (AC-4.1 is explicit); confirm.
2. Does the export include Works with Status `D` (deleted, they stay in the grid)? Written as: shown the same as the screen shows them; confirm.
3. Which roles have the Export Work permission? The Story says TM or JO but the permission decides; JO is view only. Is the export icon hidden or disabled without the permission, and is there a message on a direct call?
4. File name when the Event or Plan name has characters not allowed in a file name (`\ / : * ? " < > |`) or is very long: replaced, removed or error? Written as: the download still works and the name has no forbidden character; exact replacement unknown.
5. Which date does `[YYYYMMDD]` use (user's local date or server date, time zone)? Written as the date of the export on the user's computer.
6. What does the screen show when the export fails or takes long (message, spinner)? Not in the Story.
7. Date and time format of date cells in the file (the Import template format) is not written in the Story. Written as the same value as on screen.
8. Hot Bed, Accommodation, Priority and D/N Shift: does the Import template dropdown use the full word (`Yes`, `No`)? Written as the full word, as the Import dropdown lists.
Note after bug-check: open question 1 now has TC-037 (select some rows, export all); question 2 is written as the screen shows `D` (TC-031); question 4 has a step in TC-008; question 5 has TC-035.
Suggestions (not in Story): a message to the user after the file downloads; a limit for very large plans.

## Test cases (37 flows)

### TC-001 [FE][BE][Manual Test] Verify the export action is available with the Export Work permission (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-0
1. Open the Worklist table of the plan. -> The table shows with the export icon left of the `Create Work` button.
2. Click the export icon. -> A file download starts and no error message appears.
3. Open the file and read `Worklist_Data`. -> The file holds the Works of this plan (the Work Numbers on the Worklist are in it), is not empty, and no Work of another plan is in it.
Starting data: TM account with Export Work, plan with works. Data set: roles table (TC-001..003). Clean up: delete the downloaded file. Independent: yes.

### TC-002 [FE][BE][Manual Test] Verify a user without the Export Work permission cannot export (NEG) [Auto]
Precondition: a user whose role has no Export Work permission and who can open the Worklist
Priority: High
Trace: AC-0 (NEG)
1. Open the Worklist table of the plan. -> The table shows; the export icon is hidden or disabled (record which, see open question 3).
2. Try to click the export icon. -> No file is downloaded.
3. Call the export address directly in the browser with the same login. -> The request is refused and no file is downloaded.

### TC-003 [FE][Manual Test] Verify the Job Owner (view only) result matches the permission (BND) [Auto]
Precondition: the Job Owner account; the plan is Active
Priority: Medium
Trace: AC-0
1. Open the Worklist table as Job Owner. -> The table shows.
2. Look at the export icon. -> It follows the permission of the role: usable with Export Work, otherwise hidden or disabled with no download.

### TC-004 [FE][BE][Manual Test] Verify an .xlsx file is generated and downloaded (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1
1. Click the export icon. -> The browser downloads one file.
2. Check the file extension. -> The file ends with `.xlsx`.
3. Open the file in Excel. -> It opens with no repair prompt and no error.
Starting data: plan with works. What to check: extension, size over 0, opens with an xlsx reader. Clean up: delete the file.

### TC-005 [BE][Manual Test] Verify the worksheet and helper tabs of the template are kept (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.2
1. Export the Worklist and open the file. -> The file opens.
2. Read the tab names. -> The tabs `Worklist_Data`, `Instructions`, `Examples`, `Dropdown Options` and `Library - Platform` are all there.
3. Open `Worklist_Data`. -> The column headers are the same as in the Import template V2 (same names and same order).
4. Read the first data row. -> The first data row holds exported data and no example rows from the template remain.
5. Open the conditional formatting rules of `Worklist_Data`. -> The same rules as in the Import template V2 are there (not removed).
6. Open the tab `Dropdown Options`. -> It lists the same values as the Import template V2, none missing and none changed.

### TC-006 [BE][Manual Test] Verify dropdown validation keeps the warning style and the lists (POS) [Partial: a person checks the warning pop-up look in Excel]
Precondition: common
Priority: Medium
Trace: AC-1.2, AC-3.3
1. Open the exported file and click a cell of a dropdown column (for example Priority). -> A dropdown arrow shows with the same list as the Import template.
2. Type a value that is not in the list and press Enter. -> Exactly one warning appears (not a stop, no other message) and the user can keep the value.
3. Check every other dropdown column the same way. -> Each one has its list and warning style.
4. Go to the last exported row and click the same dropdown cell. -> The arrow and the list are there, as in the first rows (the validation covers every exported row).
Data set: list of dropdown columns.

### TC-007 [BE][Manual Test] Verify the file name follows the pattern (POS) [Auto]
Precondition: common; an event named `SD Platform A 2026` with the plan `Plan 01`
Priority: High
Trace: AC-1.3
1. Record today's date as YYYYMMDD. -> The date is noted.
2. Export the Worklist. -> A file downloads.
3. Read the file name. -> The name is `SD Platform A 2026_Plan 01_Worklist_<today YYYYMMDD>.xlsx` (event name, plan name, `Worklist`, date).
Clean up: delete the file.

### TC-008 [BE][Manual Test] Verify the file name when the event or plan name has special characters or is long (Exotic: strange input) [Partial: exact replacement rule not in Story]
Precondition: an event and plan whose names contain `& # % '` and Thai text, and another plan whose name is at its maximum length
Priority: Medium
Trace: AC-1.3
1. Export from the plan with special characters. -> The file downloads and the name keeps the readable text of the names.
2. Export from the plan with the maximum length name. -> The file downloads and opens.
3. Export from a plan whose name has a space at the start and end. -> The file name has no broken part (no double underscore gap) and the file opens.
4. Read each downloaded file name. -> No name holds any of `\ / : * ? " < > |` (the screen may not allow them in a name; if it does, they are replaced or removed, see open question 4).

### TC-009 [BE][Manual Test] Verify every Work and all its Work Breakdown rows are exported (POS) [Auto]
Precondition: common; a Work `W-A` with 3 Work Breakdown rows and a Work `W-B` with 1 row
Priority: High
Trace: AC-2.1, AC-4.1
1. Record the number of Works and the Breakdown count of each Work on screen. -> The numbers are written down.
2. Export and open `Worklist_Data`. -> The file opens.
3. Count the rows with `Data Level` = Work. -> The count equals the Works recorded.
4. Count the Work Breakdown rows under each Work. -> Each Work has the recorded number (3 and 1) and no extra or missing row.

### TC-010 [BE][Manual Test] Verify the hierarchy order: Work, then its Breakdown rows (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2
1. Export and open `Worklist_Data`. -> The file opens.
2. Read the first data row. -> Its `Data Level` is `Work`.
3. Read the rows right under it. -> They are `Work Breakdown` rows that belong to that Work (same Work Number), then the next `Work` row starts.
4. Check the last Work. -> Its Breakdown rows are right under it and no Breakdown row is at the top or separated from its Work.

### TC-011 [BE][Manual Test] Verify the UUID column is filled, unique and editable (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3
1. Export and read column B for every Work and Work Breakdown row. -> Every row has a UUID value, none is empty.
2. Compare the UUIDs. -> No two rows have the same UUID.
3. Compare one Work UUID with the id in the database or API for that Work. -> They are the same.
4. Click a UUID cell in Excel and type a character. -> The cell accepts the edit (not locked, not read-only).

### TC-012 [BE][Manual Test] Verify a Work with no Work Breakdown and a Work with a very large number of Breakdowns (BND) [Auto]
Precondition: a Work with one Breakdown only and a Work with the largest number of Breakdown rows on the plan
Priority: Medium
Trace: AC-2.1
1. Export the Worklist. -> A file downloads.
2. Read the one-Breakdown Work. -> One Work row followed by exactly one Breakdown row.
3. Read the large Work. -> All its Breakdown rows are exported, the count equals the screen.

### TC-013 [BE][Manual Test] Verify the Action column is blank on every row (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1
1. Export and open `Worklist_Data`. -> The file opens.
2. Read column C for every Work row. -> Every cell is empty.
3. Read column C for every Work Breakdown row. -> Every cell is empty; no `Revise`, `Add` or `Delete` anywhere.

### TC-014 [BE][Manual Test] Verify Work Breakdown Type is blank at Work level but kept at Breakdown level (POS) [Auto]
Precondition: a Work whose Work Breakdown Type in the database is not empty (for example the type chosen on the Create Work page)
Priority: High
Trace: AC-3.2
1. Note the Work Breakdown Type of that Work on screen. -> The value is written down.
2. Export and find the Work row. -> Its `Work Breakdown Type` cell is empty.
3. Check every Work row. -> `Work Breakdown Type` is empty on all of them, whatever the type.
4. Check the Work Breakdown rows. -> Their own columns keep their data; only the Work-level type is blank.
5. Open the same Work on the Edit page after the export. -> Its Work Breakdown Type still shows the value written down in step 1 (the export did not clear it).

### TC-015 [BE][Manual Test] Verify every value of each fixed-list column is written as the screen shows it (POS) [Auto]
Precondition: Works that cover every value of the lists: Hot Bed `Yes` and `No`; Accommodation each option; Priority `P1`, `P2`, `P3`, `Pre SD`, `Post SD`; D/N Shift `Day` and `Night`; Work Status each value
Priority: High
Trace: AC-3.3
1. Open the Worklist and note for each prepared Work the value of each fixed-list column. -> The values are written down.
2. Export and open `Worklist_Data`. -> The file opens.
3. Compare each cell with the noted value. -> Each cell has the full text of the screen value, for example `Yes` and `No` (never `Y`, `N`, `1`, `0` or `true`), `Pre SD` with the space.
4. Check that a Work left at the default (Hot Bed `No`, Priority `P2`) is also written in words. -> The default is shown as `No` and `P2`, not blank.
Test data set: expected table (column | screen value | cell text), the test loops over every row of the table; each non-default value is covered.

### TC-016 [BE][Manual Test] Verify empty optional fields are empty cells, with no `null` or `-` (BND) [Auto]
Precondition: a Work with no Remark, no Specific Requirement and empty optional Breakdown fields
Priority: High
Trace: AC-3.4
1. Export and find that Work and its Breakdown rows. -> The rows are found.
2. Read every optional cell that is empty on screen. -> The cell is empty.
3. Search the whole sheet for the text `null`, `NULL`, `undefined` and a cell that holds only `-`. -> None is found.

### TC-017 [BE][Manual Test] Verify data is written even in cells that conditional formatting marks as inactive (NEG) [Auto]
Precondition: a Work and a Breakdown row where a field exists in the system for a level the template greys out (for example Work-level fields filled on a Breakdown row, or the reverse)
Priority: High
Trace: AC-3.5
1. Note which fields have a value in the system for the Work row and the Breakdown row. -> The values are written down.
2. Export and open `Worklist_Data`. -> The file opens.
3. Read those cells even when they look greyed out. -> Every value that exists in the system is in its cell.
4. Change `Data Level` of one row in Excel and look at the cells. -> The greying changes, the values stay.
Data set: expected table (Data Level | column | has value | expected cell).

### TC-018 [BE][Manual Test] Verify system-managed columns hold the same values as the screen (POS) [Auto]
Precondition: two Works, and Breakdown rows that cover every Breakdown Status value and every System Condition value the screen offers
Priority: Medium
Trace: AC-1.2
1. Note on screen the Functional Location, Equipment Number, System Condition, POB, Man-hrs., Work Status and Breakdown Status of two Works. -> The values are written down.
2. Export and read the same cells. -> Each cell has the same value as the screen, with the same number format (decimals as on screen).
3. Check that these cells have a value and are not blank. -> They are filled for every row that has data.
4. Compare Breakdown Status and System Condition of every prepared Breakdown row with the screen. -> Each cell has the full text of the screen value for every value of both lists, not a code.
Test data set: expected table (column | screen value | cell text) for Breakdown Status and System Condition; the test loops over every row.

### TC-019 [BE][Manual Test] Verify a plan with very many Works is exported in full (BND) [Auto]
Precondition: a plan with more Works than fit on one screen (virtual scroll) and than one page of the table
Priority: High
Trace: AC-4.1
1. Read `Total Results` of the table. -> The number is written down.
2. Export the Worklist. -> The file downloads.
3. Count Work rows in the file. -> The count equals `Total Results`; the last Work of the table is also in the file.

### TC-020 [BE][Manual Test] Verify the export of a plan with exactly one Work (BND) [Auto]
Precondition: a plan with one Work
Priority: Low
Trace: AC-4.1
1. Export the Worklist. -> A file downloads.
2. Read the sheet. -> One Work row and its Breakdown rows, nothing else.

### TC-021 [FE][BE][Manual Test] Verify a column filter and search have no effect on the export (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-4.2 (NEG)
1. Record `Total Results` with no filter. -> The number is written down.
2. Type a search text in the search box and press Enter. -> After the response arrives, `Total Results` is smaller.
3. Open a column filter, untick `Select All`, tick one value and Apply. -> The table shows only the filtered rows.
4. Click the export icon. -> A file downloads.
5. Count Work rows in the file. -> The count equals the number recorded in step 1 (all Works), not the filtered count.
6. Clear the search text and press Enter, then export again. -> A file downloads and its Work count still equals the number recorded in step 1.
7. Set a date range filter and a number filter together with the column filter and the search, then export. -> A file downloads and its Work count still equals the number recorded in step 1.

### TC-022 [FE][BE][Manual Test] Verify column visibility, sort, collapsed levels and an empty filter result do not change the export (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-4.2 (NEG)
1. Hide two columns with the column visibility control and sort another column. -> The table changes.
2. Export and open the file. -> All template columns are in the file with data, including the hidden ones.
3. Return to the table, collapse the Work rows so the Breakdown rows are hidden, and apply a saved custom view if the screen has one. -> The table shows only the collapsed Work rows or the view.
4. Export and open the file. -> Every Work row has all its Breakdown rows under it, as when nothing is collapsed.
5. Return to the table, untick every option of one column filter so the table is empty, and click the export icon. -> A file downloads.
6. Count Work rows. -> All Works are in the file, not zero.
7. Use `Reset Table Filter`, reload the page and export again. -> The file has the same rows as before.

### TC-023 [BE][Manual Test] Verify special characters in every free-text field are exported as typed (Exotic: strange input) [Auto]
Precondition: Works created on screen with the values below (only values the screen accepts)
Priority: High
Trace: AC-2.1, AC-3.4
1. Create or edit Works so these fields hold each value of the table: Work Number, Job Description, Remark, Task Description (Breakdown), Department, Platform, Specific Requirement. -> The values are saved and shown the same after reload.
2. Export and open the file. -> The file opens with no repair prompt.
3. Compare each cell with the value on screen. -> Each cell has exactly the text typed, with `\ / : * ? " < > | & # % '`, Thai text, emoji and `<b>x</b>` unchanged (no escaping, no cut).
4. Check each of the seven fields, not one. -> All seven fields are right, one field right does not stand for the others.
Test data set: strange values (special chars; leading and trailing spaces; a very long value at the field limit; Thai; emoji; HTML-looking text; a value starting with `=` or `+`) crossed with the seven fields; the test loops over the table.

### TC-024 [BE][Manual Test] Verify case variants and spaces are kept apart in the file (BND) [Auto]
Precondition: two Works whose Job Description are `Helipad` and `helipad`, one with a trailing space
Priority: Low
Trace: AC-2.1
1. Export and find both Works. -> Both rows are in the file.
2. Compare the text of each. -> Each has its own exact text and neither was merged.

### TC-025 [BE][Manual Test] Verify dates and numbers equal the screen (POS) [Auto]
Precondition: a Work with start and finish dates, Duration, POB and Man-hrs. with decimals
Priority: High
Trace: AC-1.2
1. Note the dates, Duration, POB and Man-hrs. of that Work on screen. -> The values are written down.
2. Export and read the same cells. -> The dates show the same day (no day shift), numbers keep the same decimals and are numbers, not text.
3. Re-open the Work on the Edit page. -> The values on screen did not change after the export.

### TC-026 [BE][Manual Test] Verify the exported file can be edited and re-imported (POS) [Partial: Import Work has its own Story; a person checks the result]
Precondition: common
Priority: High
Trace: AC-2.3, AC-3.1
1. Export the Worklist. -> A file downloads.
2. In the file set Action `Revise` on one Work row and change its Remark to `Edited remark`. -> The file keeps the change.
3. Import the file with `Create Work` > `Import Excel`. -> The import is accepted with no error about UUID or format.
4. Open the Work. -> The Remark shows `Edited remark`; other Works and all Breakdown rows are unchanged.
5. In the exported file add a new row with Action `Add` and a new Work Number, then import it. -> The import is accepted with no error.
6. Export the Worklist again. -> The new Work is in the file with a filled UUID and a blank Action.
Clean up: restore the Remark and delete the added Work.

### TC-027 [FE][BE][Manual Test] Verify the export from the Gantt Table and from the Planning Tab gives the same file content (POS) [Partial: Gantt trigger needs the Bryntum screen]
Precondition: common
Priority: Medium
Trace: AC-0, AC-4.1
1. Set a column filter on the Worklist table and export from it, then keep the file. -> A file downloads.
2. Export from the Gantt Table toolbar trigger with a filter set there. -> A file downloads.
3. Export from the Planning Tab trigger with a filter set there. -> A file downloads.
4. Compare the three files' rows. -> The same Works, Breakdown rows and values (UUID included) in all three, none cut by the filters; names follow the pattern.
5. Compare the dates and values of three Works in the Gantt Table file with the Gantt Table screen. -> They are the same as on the screen.

### TC-028 [FE][BE][Manual Test] Verify the export of a Worklist with no Works (BND) [Auto]
Precondition: a plan whose Worklist shows `No results found`
Priority: Medium
Trace: AC-4.1
1. Click the export icon. -> The user gets a clear result: either a file with the headers and no data rows, or a message (see open question 6); no crash and no half file.
2. If a file is downloaded, open it. -> It opens and all the helper tabs are there.

### TC-029 [FE][Manual Test] Verify a double click on the export icon gives one file (Exotic: double click) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Double-click the export icon quickly. -> Only one file is downloaded, or the second click is ignored.
2. Open the file. -> It is complete and valid.

### TC-030 [FE][Manual Test] Verify the export after the user leaves and comes back, with Refresh and Back (Exotic: navigation) [Manual: native browser Back and download dialog]
Precondition: common
Priority: Low
Trace: AC-4.2
1. Click the export icon and refresh the page while it runs. -> The page reloads with no broken state.
2. Use the browser Back. -> The previous page shows with no broken state.
3. Return to the Worklist and click the export icon again. -> A complete file downloads.

### TC-031 [FE][BE][Manual Test] Verify a Work deleted by another user is handled when exporting (Exotic: two users) [Auto]
Precondition: two browser sessions (two users with the permission) on the same plan
Priority: High
Trace: AC-4.1
1. In session A open the Worklist and note the Works. -> The Works are written down.
2. In session B delete one Work (it shows Status `D`) and add a new Work. -> Session B shows the change.
3. In session A click the export icon without refreshing. -> A file downloads.
4. Read the file. -> It holds the current data of the database (the new Work is in; the deleted Work is in with Status `D`, exactly as the Worklist shows it, see open question 2) and no old copy; no error.
Clean up: restore the data.

### TC-032 [BE][Manual Test] Verify a value changed on screen appears in the next export (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.1
1. Export once and note the Remark of one Work. -> The value is written down.
2. Edit the Remark of the Work and its Work Breakdown Task Description on screen and Save. -> The new values show on the Work page.
3. Export again. -> The second file holds the new values and the old export is not reused.
4. Open the same Work on View Work Details. -> The values on the screen and in the file are the same.
5. Compare every other field and every date of that Work in the second file with the first file. -> They are unchanged (no day shift, nothing lost).
6. Open the same Work on the Edit Work page. -> The values there are the same as in the second file.
7. Remove one Work Breakdown from that Work on the Edit page, Save, and export again. -> The third file has one Breakdown row less under that Work and the removed one is nowhere in the file.

### TC-033 [FE][Manual Test] Verify the user gets feedback during a large export and when the export fails (BND) [Manual: needs a slow or broken connection and a person to judge the message]
Precondition: the plan from TC-019; the network throttled or cut
Priority: Medium
Trace: AC-1.1
1. Click the export icon with a slow connection. -> The screen shows that something is happening (see open question 6); the page is not frozen.
2. Cut the connection and click the export icon. -> Exactly one message tells the user the export did not work and no other message shows; no empty file.
3. Restore the connection and click again. -> A complete file downloads.

### TC-034 [BE][Manual Test] Verify old records (oldest, middle, newest) are exported correctly (POS) [Manual: needs old migrated plans that are not safe to reset]
Precondition: an old plan created long ago and a new plan
Priority: Medium
Trace: AC-2.1
1. Export the old plan. -> A file downloads.
2. Compare three Works (oldest, middle, newest) with the screen. -> Values are in the right columns, empty old values are empty cells, UUID is filled.
3. Export the new plan and compare the same. -> The same rules hold.

### TC-035 [BE][Manual Test] Verify the file name date is the local date near midnight (BND) [Partial: needs the computer time set between 00:00 and 07:00 Thai time]
Precondition: common; the computer time zone is Thai time
Priority: High
Trace: AC-1.3
1. Set the computer clock to 00:30 of a known date and record that date as YYYYMMDD. -> The date is written down.
2. Export the Worklist. -> A file downloads.
3. Read the date in the file name. -> It is the date recorded in step 1, not the day before (see open question 5).
4. Set the clock to 23:50 of the same date, export again and read the file name. -> The date in the name is that date, not the next day.
Clean up: set the clock back to automatic and delete the files.

### TC-036 [FE][BE][Manual Test] Verify the table is unchanged after an export and after returning by breadcrumb (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.2
1. Type a search text, set a column filter, sort one column, hide one column and collapse the Work rows. -> The table shows that state.
2. Click the export icon. -> A file downloads.
3. Look at the table. -> The search text, the filter, the sort, the hidden column and the collapsed rows are all still as set in step 1.
4. Use the breadcrumb to go to the plan page and open the Worklist again. -> The Worklist opens with no broken state.
5. Click the export icon. -> A complete file downloads with all Works of the plan.

### TC-037 [FE][BE][Manual Test] Verify that selecting some rows does not limit the export (NEG) [Auto]
Precondition: common; the Worklist table has rows that can be selected (if it has none, record that and skip steps 1-3, see open question 1)
Priority: Medium
Trace: AC-2.1, AC-4.1 (NEG)
1. Record `Total Results` of the table. -> The number is written down.
2. Select two Work rows and click the export icon. -> A file downloads.
3. Count Work rows in the file. -> The count equals the number recorded in step 1, not 2.

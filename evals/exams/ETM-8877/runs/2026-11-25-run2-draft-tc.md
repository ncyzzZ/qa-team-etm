# ETM-8388 Draft test cases: Shutdown Timeline - Table Copy and Paste Support

Story: ETM-8388 [Improvement] Shutdown Timeline - Table Copy and Paste Support (Deployed to QA after 18 Nov update).
Source: story.md (incl. UPDATE 2026-11-18), analyst.md, docs/modules/shutdown-timeline.md, shutdown-timeline-validation.md, knowledge/ (lesson L-4 multi-row paste).
Existing [QA] subtasks: ETM-8570 Create Test Case (reuse), ETM-8572 Execute Test Case (reuse).
Common precondition (common): QA environment. Event with a Shutdown Timeline plan that has at least two Activity Groups, each with at least 3 activities with Start/End Dates, and the Current Week inside the grid. Account A = Turnaround Manager (View Timeline, Update Progress and Note, Edit Plan). Account B = Job Owner (View Timeline only). Clipboard text is prepared in Excel (tab between columns, new line between rows). Browser: Chrome on Windows (Ctrl) and Mac (Cmd) where a case says so.
Notation: TL = Timeline screen, EP = Edit Shutdown Timeline Plan screen. Priority from damage (Story has none).
Modal text (from Validation&Result): title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK`.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 copy as tab-separated | Equivalence, real-user | Excel gets wrong layout | TC-001, TC-002 |
| AC-2 Focus Mode vs Edit Mode | State change | Two modes behave differently | TC-003 |
| AC-3 paste stays in anchor group | Boundary, L-4 | Data written into another group | TC-004, TC-005 |
| AC-4 copy across groups, headers skipped | Edge | Header text pasted as data | TC-006 |
| AC-5 invalid value, red, Save disabled, one modal | Equivalence, error guessing | Modal repeated or Save enabled | TC-007, TC-008, TC-009 |
| AC-6 dirty state | State change | Unsaved warning missing | TC-010 |
| AC-7 TL Status paste | Input groups | Wrong spelling stored | TC-011, TC-012, TC-013 |
| AC-8 TL extra rows ignored | Boundary, L-4 | Activity added on TL | TC-014 |
| AC-9 TL weekly copy, one row only | Error guessing | Two rows copied | TC-015, TC-016 |
| AC-10 TL paste into Actual only | Roles, state | Plan row changed | TC-017 |
| AC-11 TL Actual input rules | Boundary | Wrong rounding | TC-018 |
| AC-12 TL future week cut off | Boundary | Future week gets a value | TC-019 |
| AC-13 EP NxN copy/paste, Plan (%) excluded | Equivalence | Plan (%) overwritten | TC-020, TC-021 |
| AC-14 EP max length truncation | Boundary | Long text saved | TC-022 |
| AC-15 EP date format, Start <= End, mandatory | Input groups, boundary | Bad date saved | TC-023, TC-024, TC-025 |
| AC-16 EP dates recalculate weekly Plan (%) | Calculation | Weeks stale | TC-026 |
| AC-17 EP automatic activity creation | Boundary, L-4 | Wrong defaults or wrong group | TC-027, TC-028 |
| AC-18 EP weekly copy, one row | Error guessing | Two rows copied | TC-029 |
| AC-19 EP paste into Plan row, rules, 18 Nov rules | Boundary, L-4 | More than first row pasted | TC-030, TC-031, TC-032 |
| AC-20 EP outside Start-End cut off | Boundary | Values outside range stored | TC-033 |
| AC-21 EP Plan (%) = sum of weeks | Calculation | Total wrong, Save wrongly enabled | TC-034 |
| Permission (Pre-conditions) | Roles | Job Owner can paste | TC-035 |
| Screen state: very many rows | Too much data | Slow or lost rows | TC-036 |
| Screen state: empty group | Empty | Error on paste into empty group | TC-037 |
| Real user: Excel with spaces, other date format, Back after paste | Real-user | Hidden data loss | TC-038, TC-039, TC-040 |

Categories not relevant: Popups other than the paste modal (only this modal is new). Close and Cancel: covered by TC-040 (Back after paste). Loading/error states of the Save API: not changed by this Story.

Counts: High 22 / Medium 14 / Low 4. Auto 28 / Partial 4 / Manual 8.

## Open questions
1. Missing - ask: ETM-8550 keyboard navigation (arrows, Tab, Shift+arrow, Enter, Esc, Ctrl+A, Delete) has no AC. Which keys and screens are in scope? TC-003 only uses the keys needed to enter Edit Mode.
2. Missing - ask: Selecting two rows together in weekly cells (AC-9, AC-18): selection blocked, copy blocked or paste blocked, and any message? TC-016 records what happens.
3. Missing - ask: Copy across groups pasted into one group (AC-4): rows from the second group appended into the anchor's group (creating activities on EP)? TC-006 and TC-028 assume the Story text only (headers skipped, paste stays in the anchor group).
4. Missing - ask: Is a Plan (%) row copy pasted into the Actual row on TL allowed (AC-10)? TC-017 expects values go to Actual.
5. Missing - ask: Partial or all-or-nothing paste when valid and invalid values are mixed? TC-009 assumes valid cells applied (AC-5 "not applied and cleared" per cell).
6. Missing - ask: Does Delete/Backspace on a selected range clear cells, and is Ctrl+Z expected to undo a paste?
7. Missing - ask: Is there a maximum number of pasted rows or columns? TC-036 uses 100 rows.
8. Missing - ask: Can TL Status paste change a Close activity? What is the red/not-red state of a mandatory cell after a blank paste on EP?
9. Suggestion (not in Story): confirm the old note "Excel paste not wanted" (ETM-7348, 3 Nov) is replaced by this Story.
10. Suggestion (not in Story): Thai-calendar year and Excel date serial numbers pasted into date cells.

## Test cases (40 flows)

### TC-001 [FE][MT] Verify copy of one Status cell gives text pasteable into Excel (POS) [Auto]
Precondition: common. Logged in as Account A on TL.
Priority: High
Trace: AC-1, AC-7
Automation: starting data = event with Status `Open`; check = clipboard text; data = one cell; clean up = none.
1. Open the Timeline tab of the event. -> The TL table shows activities with a Status column.
2. Click the Status cell of the first activity. -> The cell is selected.
3. Press Ctrl+C (Cmd+C on Mac). -> The selection is copied without an error message.
4. Open a blank Excel sheet and press Ctrl+V into cell A1. -> Excel shows `Open` in A1 only, nothing in B1 or A2.

### TC-002 [FE][MT] Verify copy of several cells gives tab-separated rows (POS) [Auto]
Precondition: common. Logged in as Account A on EP.
Priority: High
Trace: AC-1, AC-13
Automation: check = clipboard text equals expected table; data = 2 rows x 3 columns.
1. Open `Edit Plan` on the Timeline. -> The page `Edit Shutdown Timeline Plan` opens.
2. Select Activity, Action By and Focal Point of the first two activities of one group by dragging. -> A block of 2 rows and 3 columns is selected.
3. Press Ctrl+C. -> The selection is copied.
4. Paste into a blank Excel sheet at A1. -> Excel shows 2 rows and 3 columns, one value per cell, same text as the screen.

### TC-003 [FE][MT] Verify paste in Focus Mode and in Edit Mode gives the same result (POS) [Auto]
Precondition: common. EP. Clipboard = `Alpha<TAB>Team X` (one row, two columns).
Priority: High
Trace: AC-2
Automation: run twice, compare the resulting cells; clean up = Back, Discard Change.
1. Click the Activity cell of the first activity once. -> The cell is focused, not in edit mode.
2. Press Ctrl+V. -> Activity shows `Alpha` and Action By shows `Team X`.
3. Double-click the Activity cell of the second activity. -> The cell is in edit mode.
4. Press Ctrl+V. -> Activity of the second activity shows `Alpha` and Action By of the second activity shows `Team X`, the same mapping as step 2.

### TC-004 [FE][MT] Verify paste larger than the group on TL does not touch the next group (POS) [Auto]
Precondition: common. TL. Group 1 has 3 activities; Group 2 follows. Clipboard = 6 rows of `Open`/`Close` alternating.
Priority: High
Trace: AC-3, AC-8
Automation: record all Status values before and after; check Group 2 unchanged.
1. Record the Status of every activity in Group 1 and Group 2. -> The values are written down.
2. Click the Status cell of the first activity in Group 1. -> The cell is focused.
3. Press Ctrl+V. -> The 3 Status cells of Group 1 show the first 3 pasted values.
4. Look at Group 2 Status cells. -> They show the values recorded in step 1.

### TC-005 [FE][MT] Verify paste anchored in the last activity of a group does not flow to the next group (BND) [Auto]
Precondition: common. TL. Clipboard = 2 rows `Close` and `Close`.
Priority: High
Trace: AC-3
Automation: as TC-004.
1. Record the Status of the last activity of Group 1 and the first activity of Group 2. -> Values written down.
2. Click the Status cell of the last activity of Group 1. -> The cell is focused.
3. Press Ctrl+V. -> The last activity of Group 1 shows `Close`.
4. Look at the first activity of Group 2. -> Its Status is the value recorded in step 1.

### TC-006 [FE][MT] Verify copy across two Activity Groups skips group header rows (POS) [Partial: clipboard content read in Excel]
Precondition: common. TL.
Priority: Medium
Trace: AC-4
1. Drag-select Status cells from the last activity of Group 1 down to the first activity of Group 2, including the Group 2 header row. -> Cells across both groups are selected.
2. Press Ctrl+C. -> The selection is copied.
3. Paste into a blank Excel sheet at A1. -> Excel shows 2 rows only (the two activities); no group header text appears.
4. Click the Status cell of the first activity in Group 1 and press Ctrl+V. -> Values go into Group 1 activities only; Group 2 Status values stay unchanged.

### TC-007 [FE][MT] Verify an invalid Date pasted on EP is cleared, cell is red and Save is disabled (NEG) [Auto]
Precondition: common. EP. Clipboard = `31/13/2026`.
Priority: High
Trace: AC-5, AC-15
Automation: check cell style background #FFCCC7, Save disabled, modal count = 1.
1. Click the Start Date cell of the first activity. -> The cell is focused.
2. Press Ctrl+V. -> The Start Date cell is empty with red background #FFCCC7; `Save` is disabled; modal `Paste Validation Failed` appears.
3. Click `OK`. -> The modal closes.
4. Type `03 Nov 2026` in the cell. -> The red background goes away; `Save` is enabled if Total Progress Plan (%) is 100.0.

### TC-008 [FE][MT] Verify the modal shows once for a paste with many invalid cells (NEG) [Auto]
Precondition: common. EP. Clipboard = 3 rows of `abc` in the Start Date column.
Priority: High
Trace: AC-5
Automation: count modals.
1. Click the Start Date cell of the first activity. -> The cell is focused.
2. Press Ctrl+V. -> Modal `Paste Validation Failed` with `Some pasted values do not meet the validation rules and were not applied.` appears once; three Start Date cells are cleared and red.
3. Click `OK`. -> The modal closes and no second modal appears.

### TC-009 [FE][MT] Verify a paste mixing valid and invalid values (NEG) [Auto]
Precondition: common. EP. Clipboard = `Task One<TAB>Team A<TAB>Mr Somchai<TAB>03 Nov 2026<TAB>99/99/9999`.
Priority: High
Trace: AC-5, AC-13
Automation: check each cell value.
1. Click the Activity cell of the first activity. -> The cell is focused.
2. Press Ctrl+V. -> Activity `Task One`, Action By `Team A`, Focal Point `Mr Somchai`, Start Date `03 Nov 2026` are applied; End Date is empty and red; one modal `Paste Validation Failed` appears.
3. Click `OK`. -> The modal closes.

### TC-010 [FE][MT] Verify a paste marks the screen as changed (POS) [Auto]
Precondition: common. TL and EP, Account A. Clipboard = `Open`.
Priority: Medium
Trace: AC-6
1. On TL, record that `Update Progress` is disabled. -> The button is disabled.
2. Click a Status cell and press Ctrl+V. -> `Update Progress` becomes enabled.
3. Click the side menu item `Shutdown Event List`. -> Modal `Unsaved Change` appears with `Continue Editing` and `Discard Change`.
4. Click `Discard Change`. -> The page leaves and the change is not saved.
5. Open `Edit Plan` and paste `Task Two` into an Activity cell. -> `Save` becomes enabled (Total Progress Plan (%) is 100.0).
6. Click `Back`. -> Modal `Unsaved Change` appears.

### TC-011 [FE][MT] Verify Status paste accepts Open/Close in any letter case and converts spelling (POS) [Auto]
Precondition: common. TL. Clipboard rows: `open`, `CLOSE`, `Open`.
Priority: High
Trace: AC-7
Automation: data table below; check displayed text.
Table: pasted -> shown: `open` -> `Open`; `CLOSE` -> `Close`; `Open` -> `Open`; `cLoSe` -> `Close`.
1. Click the Status cell of the first activity of Group 1. -> The cell is focused.
2. Press Ctrl+V with rows `open`, `CLOSE`, `Open`. -> The three Status cells show `Open`, `Close`, `Open`.
3. Paste a single `cLoSe` into another Status cell. -> The cell shows `Close`.

### TC-012 [FE][MT] Verify blank or non Open/Close Status paste keeps the current Status (NEG) [Auto]
Precondition: common. TL. Activity 1 Status `Close`, activity 2 Status `Open`. Clipboard rows: blank line, `Done`.
Priority: High
Trace: AC-7, AC-5
Automation: check status values, background not red, modal count = 1.
1. Click the Status cell of activity 1. -> The cell is focused.
2. Press Ctrl+V. -> Activity 1 still shows `Close`, activity 2 still shows `Open`; neither cell is cleared or red; modal `Paste Validation Failed` appears once.
3. Click `OK`. -> The modal closes.

### TC-013 [FE][MT] Verify Status paste into other columns on TL is not possible (NEG) [Partial: depends on BA answer on blocked cells]
Precondition: common. TL. Clipboard = `Task Z`.
Priority: Medium
Trace: AC-7
1. Click the Activity cell of the first activity. -> The cell is focused and not editable.
2. Press Ctrl+V. -> The Activity text does not change.
3. Click the Action By cell and press Ctrl+V. -> The Action By text does not change.

### TC-014 [FE][MT] Verify extra pasted rows beyond the group are ignored on TL and no activity is added (BND) [Auto]
Precondition: common. TL. Group 1 has 3 activities. Clipboard = 5 rows `Close`.
Priority: High
Trace: AC-8
Automation: count rows before/after.
1. Record the number of activities in Group 1. -> The count is written down.
2. Click the Status cell of the second activity. -> The cell is focused.
3. Press Ctrl+V. -> The second and third activities show `Close`.
4. Count activities in Group 1. -> The count equals the value of step 1; no new activity row appears.

### TC-015 [FE][MT] Verify copy of a range in one weekly Actual row on TL (POS) [Auto]
Precondition: common. TL. An activity has Actual values in 3 consecutive weeks up to the Current Week.
Priority: Medium
Trace: AC-9
1. Drag-select 3 weekly cells in the Actual (%) row of one activity. -> The 3 cells are selected.
2. Press Ctrl+C. -> The selection is copied.
3. Paste into Excel at A1. -> Excel shows 1 row and 3 values equal to the screen.

### TC-016 [FE][MT] Verify selecting two rows of weekly cells at once is not allowed on TL (NEG) [Manual: behaviour not defined, needs observation]
Precondition: common. TL.
Priority: Medium
Trace: AC-9
1. Drag from a Plan (%) weekly cell to the Actual (%) weekly cell of the same activity. -> Selection does not cover both rows (result noted for BA).
2. Press Ctrl+C. -> Nothing from two rows is copied; Excel paste shows data of at most one row.
3. Drag from the Actual (%) cell of activity 1 to the Actual (%) cell of activity 2. -> Selection does not cover two activities (result noted for BA).

### TC-017 [FE][MT] Verify paste goes into weekly Actual (%) only and Plan (%) row stays read-only on TL (POS) [Auto]
Precondition: common. TL. Clipboard = `10.0<TAB>20.0` copied from a Plan (%) row.
Priority: High
Trace: AC-10
Automation: record Plan row before and after.
1. Record the Plan (%) weekly values of the activity. -> Values written down.
2. Click an Actual (%) weekly cell of a week before the Current Week. -> The cell is focused.
3. Press Ctrl+V. -> The Actual (%) cell and the next cell show `10.0` and `20.0`.
4. Click a Plan (%) weekly cell and press Ctrl+V. -> The Plan (%) value does not change and equals step 1.

### TC-018 [FE][MT] Verify pasted Actual values truncate, clamp and blank per input rules (BND) [Auto]
Precondition: common. TL. Weeks up to Current Week free.
Priority: High
Trace: AC-11, AC-5
Automation: expected-values table loop.
Table: pasted -> shown: `12.36` -> `12.3`; `99.99` -> `99.9`; `100.9` -> `100.0`; `250` -> `100.0`; `abc` -> blank; `-5` -> blank.
1. Click an Actual (%) weekly cell of a past week. -> The cell is focused.
2. For each row of the table, copy the value from Excel and press Ctrl+V. -> The cell shows the "shown" value of the table.
3. Paste `abc`. -> The cell is blank.

### TC-019 [FE][MT] Verify values landing in a future week are not applied on TL (BND) [Auto]
Precondition: common. TL. Current Week = week N. Clipboard = 4 values `5.0` in a row.
Priority: High
Trace: AC-12
Automation: check cells N-1, N, N+1, N+2.
1. Click the Actual (%) cell of week N-1. -> The cell is focused.
2. Press Ctrl+V. -> Weeks N-1 and N show `5.0`; weeks N+1 and N+2 stay empty and locked.

### TC-020 [FE][MT] Verify NxN paste across the five columns on EP (POS) [Auto]
Precondition: common. EP. Clipboard = 2 rows x 5 columns: `Task One, Team A, Mr Somchai, 03 Nov 2026, 07 Nov 2026` and `Task Two, Team B, Ms Malee, 10 Nov 2026, 14 Nov 2026`.
Priority: High
Trace: AC-13, AC-14
1. Click the Activity cell of the first activity of a group. -> The cell is focused.
2. Press Ctrl+V. -> Both rows fill Activity, Action By, Focal Point, Start Date, End Date of the first two activities with the pasted text; `Save` is enabled.
3. Click `Save`. -> Toast `Save Success` appears.
4. Reload the page. -> The saved values are still shown.

### TC-021 [FE][MT] Verify Plan (%) is not changed by a paste over the columns (POS) [Auto]
Precondition: common. EP. Clipboard = 1 row x 6 columns where the 6th value is `55.0`.
Priority: High
Trace: AC-13
1. Record Plan (%) of the first activity. -> Value written down.
2. Click its Activity cell and press Ctrl+V. -> The five columns take the pasted values.
3. Look at the Plan (%) of the activity. -> It does not show `55.0`; it equals the value from step 1 or the value recalculated from the pasted dates.

### TC-022 [FE][MT] Verify text longer than the limit is truncated (BND) [Auto]
Precondition: common. EP. Table: Activity 500 / 501 / 600 characters -> 500 kept; Action By 50 / 51 -> 50 kept; Focal Point 50 / 51 -> 50 kept.
Priority: High
Trace: AC-14
Automation: loop the table; check text length.
1. Paste an Activity of 500 characters. -> All 500 characters are kept.
2. Paste an Activity of 501 characters. -> The cell keeps the first 500 characters; no modal appears.
3. Paste Action By of 51 characters. -> The cell keeps 50 characters.
4. Paste Focal Point of 51 characters. -> The cell keeps 50 characters.

### TC-023 [FE][MT] Verify date formats D Mon YYYY and DD Mon YYYY are accepted (POS) [Auto]
Precondition: common. EP.
Priority: High
Trace: AC-15
Table: `3 Nov 2026` -> `03 Nov 2026`; `03 Nov 2026` -> `03 Nov 2026`.
1. Paste `3 Nov 2026` into Start Date. -> The cell shows the date and is not red.
2. Paste `03 Nov 2026` into End Date of a later date. -> The cell shows the date and is not red.

### TC-024 [FE][MT] Verify other date formats are not applied (NEG) [Auto]
Precondition: common. EP.
Priority: High
Trace: AC-15, AC-5
Table: `2026-11-03`, `03/11/2026`, `3 November 2026`, `45964` (Excel serial), `31 Feb 2026` -> each: cleared, red, `Save` disabled, one modal.
1. Paste each value of the table into Start Date, one at a time. -> The cell is empty and red, modal `Paste Validation Failed` appears, `Save` is disabled.

### TC-025 [FE][MT] Verify Start Date later than End Date after paste (BND) [Auto]
Precondition: common. EP. Activity has End Date `10 Nov 2026`.
Priority: High
Trace: AC-15
1. Paste `11 Nov 2026` into Start Date. -> The result is shown (value applied or cleared) and `Save` state noted; compare with typing the same value by hand.
2. Type the same `11 Nov 2026` by hand in another activity with the same End Date. -> The behaviour is the same as the paste in step 1.
3. Paste `10 Nov 2026` (equal to End Date). -> The value is applied and not red.

### TC-026 [FE][MT] Verify pasting dates recalculates the weekly Plan (%) of that activity (POS) [Auto]
Precondition: common. EP. Activity with dates and weekly Plan (%) values.
Priority: High
Trace: AC-16, AC-21
1. Record weekly Plan (%) values and Plan (%) of the activity. -> Values written down.
2. Paste a new Start Date and End Date (one week longer) into the two date cells. -> Weekly Plan (%) values are recalculated for the new range; manual weekly edits are overwritten.
3. Sum the weekly values. -> The sum equals the activity Plan (%).

### TC-027 [FE][MT] Verify extra pasted rows on EP create new activities at the bottom of the group (BND) [Auto]
Precondition: common. EP. Group 1 has 3 activities. Clipboard = 5 rows with Activity names `New A` to `New E` (only the Activity column).
Priority: High
Trace: AC-17, AC-3
1. Click the Activity cell of the 2nd activity of Group 1. -> The cell is focused.
2. Press Ctrl+V. -> Activities 2 and 3 take `New A`, `New B`; three new activities `New C`, `New D`, `New E` appear at the bottom of Group 1.
3. Look at a new activity row. -> Plan (%) `0.0`, Status `Open`; Action By, Focal Point, Start Date, End Date are empty and the mandatory ones are red; `Save` is disabled.
4. Look at Group 2. -> Group 2 has the same activities as before the paste.

### TC-028 [FE][MT] Verify automatic creation when the clipboard came from two groups (Exotic: copy across groups) [Partial: depends on BA answer]
Precondition: common. EP.
Priority: Medium
Trace: AC-4, AC-17
1. Select Activity cells from the last two activities of Group 1 and the first two activities of Group 2 and press Ctrl+C. -> 4 rows are copied (no header rows).
2. Click the Activity cell of the second last activity in Group 2 and press Ctrl+V. -> Rows stay inside Group 2; extra rows create new activities at the bottom of Group 2; Group 1 does not change.

### TC-029 [FE][MT] Verify copy of a weekly range on EP from Plan or Actual row (POS) [Auto]
Precondition: common. EP. Activity with dates.
Priority: Medium
Trace: AC-18
1. Select 3 weekly cells in the Plan (%) row of one activity and press Ctrl+C. -> The cells are copied.
2. Paste into Excel. -> 1 row and 3 values equal to the screen.
3. Select 3 cells of the Actual (%) row and press Ctrl+C. -> They are copied; Excel shows 1 row and 3 values.

### TC-030 [FE][MT] Verify weekly paste writes only to the Plan (%) row and Actual row stays unchanged (POS) [Auto]
Precondition: common. EP. Activity with dates over 4 weeks. Clipboard copied from an Actual (%) row: `10.0<TAB>20.0`.
Priority: High
Trace: AC-19, AC-21
1. Record Actual (%) weekly values. -> Values written down.
2. Click the first weekly Plan (%) cell inside the date range. -> The cell is focused.
3. Press Ctrl+V. -> The Plan (%) cell and the next show `10.0` and `20.0`.
4. Look at the Actual (%) row. -> It equals step 1.

### TC-031 [FE][MT] Verify more than one pasted row writes only the first row into weekly Plan (%) (BND) [Auto]
Precondition: common. EP. Clipboard = 3 rows of 2 columns: `10.0, 20.0` / `30.0, 40.0` / `50.0, 60.0`.
Priority: High
Trace: AC-19
Automation: check the Plan rows of the anchor activity and the two below it.
1. Record the weekly Plan (%) of the anchor activity and the next two activities. -> Values written down.
2. Click the first weekly Plan (%) cell of the anchor activity. -> The cell is focused.
3. Press Ctrl+V. -> The anchor row shows `10.0` and `20.0`.
4. Look at the next two activities. -> Their weekly Plan (%) equal step 1.

### TC-032 [FE][MT] Verify weekly paste rules: truncate and clamp without modal, negative and text with modal (BND) [Auto]
Precondition: common. EP. Activity with dates over 4 weeks.
Priority: High
Trace: AC-19, AC-5
Table: pasted -> shown, modal: `12.36` -> `12.3`, no; `99.99` -> `99.9`, no; `100.9` -> `100.0`, no; `250` -> `100.0`, no; `-4` -> blank, yes; `abc` -> blank, yes.
1. Paste each value into a weekly Plan (%) cell in range. -> The cell shows the "shown" value; modal `Paste Validation Failed` appears only where the table says yes.

### TC-033 [FE][MT] Verify weekly values outside Start-End Date are cut off (BND) [Auto]
Precondition: common. EP. Activity with 3 weeks in range; clipboard = 5 values `10.0`.
Priority: High
Trace: AC-20
1. Click the last-but-one week cell in the range. -> The cell is focused.
2. Press Ctrl+V. -> The last 2 weeks in range show `10.0`; weeks after the End Date stay empty and read-only.
3. Paste starting in a week before Start Date. -> The cell is read-only and the paste is not applied there.

### TC-034 [FE][MT] Verify Plan (%) equals the sum of weeks and Total Progress controls Save (POS) [Auto]
Precondition: common. EP. Total Progress Plan (%) is 100.0.
Priority: High
Trace: AC-21, AC-6
1. Paste `33.3<TAB>33.3<TAB>33.4` into the weekly Plan (%) of an activity. -> Activity Plan (%) shows the sum of its weeks.
2. Check Total Progress Plan (%). -> It follows the change; if it is not 100.0 it is red #FFCCC7 and `Save` is disabled.
3. Paste values so the Total is 100.0 again. -> The red goes away and `Save` is enabled.

### TC-035 [FE][MT] Verify Job Owner cannot paste on TL and cannot open Edit Plan (NEG) [Auto]
Precondition: common. Logged in as Account B.
Priority: High
Trace: none (permission, Pre-conditions)
1. Open the Timeline tab. -> The page shows without `Edit Plan` and `Update Progress`.
2. Click a Status cell and press Ctrl+V. -> The cell does not change.
3. Select Status cells and press Ctrl+C. -> Copy works or is blocked as the screen does for view-only users (result noted).

### TC-036 [FE][MT] Verify a large paste of 100 rows on EP (Exotic: large data) [Partial: limit not defined]
Precondition: common. EP. Clipboard = 100 rows with Activity `Row 001` to `Row 100`.
Priority: Medium
Trace: AC-17
1. Click an Activity cell of Group 1 and press Ctrl+V. -> The page stays responsive; 100 activities exist in Group 1 with names in order.

### TC-037 [FE][MT] Verify paste into an empty group on TL and EP (BND) [Manual: depends on empty group data]
Precondition: common. A group shows `No activity added.`
Priority: Low
Trace: AC-3
1. On EP click the group row and press Ctrl+V. -> No error appears; no data enters another group.

### TC-038 [FE][MT] Verify values with spaces before and after from Excel (Exotic: Excel text) [Auto]
Precondition: common. EP. Clipboard = `  Task Space  ` with spaces, and a cell with a line break.
Priority: Low
Trace: AC-14
1. Paste into Activity. -> The cell shows the text; behaviour with spaces and line break is noted and the page does not break.

### TC-039 [FE][MT] Verify paste with Cmd+V on Mac and with right-click paste (POS) [Manual: needs a Mac]
Precondition: common. Mac Safari or Chrome.
Priority: Low
Trace: AC-1
1. Select two Status cells and press Cmd+C. -> The cells are copied.
2. Click another Status cell and press Cmd+V. -> The values are pasted.

### TC-040 [FE][MT] Verify Back after a paste on EP does not save the paste (POS) [Auto]
Precondition: common. EP.
Priority: Medium
Trace: AC-6
1. Paste `Temp Name` into an Activity cell. -> The cell shows `Temp Name`.
2. Click `Back`. -> Modal `Unsaved Change` appears.
3. Click `Discard Change`. -> The Timeline opens.
4. Open `Edit Plan` again. -> The Activity shows the old name, not `Temp Name`.

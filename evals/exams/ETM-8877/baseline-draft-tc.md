# ETM-8388 Draft test cases: Table Copy and Paste Support (Timeline and Edit Plan)

Story: ETM-8388 [Improvement] Shutdown Timeline - Table Copy and Paste Support (parent epic ETM-6971). Status Deployed to QA. All 19 BA answers are confirmed (ba-answers.md, 18 Nov 2026) and are written into the Expected Results below.
Source: story.md (incl. the 18 Nov update: AC 2.1 invalid or blank Status, AC 3.2 first row only and negative / not-a-number weekly value), analyst.md (AC-1..AC-21), ba-answers.md, docs/modules/shutdown-timeline*.md. No Figma ("To be provided"), no linked Tests. ETM-8550 (Dev sub-task, keyboard selection) is covered as selection steps inside existing cases.
Existing [QA] subtasks: ETM-8570 [QA] Create Test Case Manual Test (In Progress), ETM-8572 [QA] Execute Test Case Manual Test (Open). Reuse, do not create.
Priority: the Story has no priority per AC, so priority is set by damage if it breaks (stated here): wrong data written or saved = High; copy only, display only, many rows = Medium.
Button names: on the Timeline the commit button is `Update Progress`; on Edit Plan it is `Save`.
Modal (same text on Timeline and Edit Plan): title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, one button `OK`. It is shown once per paste action, only when a pasted value is invalid and was not applied. No modal for a truncated value, a clamped value (above 100.0 becomes `100.0`), a value cut off (future week on Timeline, outside Start-End on Edit Plan), an ignored extra row or an ignored column. The Status column on the Timeline is an exception to "cleared": an invalid or blank Status keeps the current value, the cell is not red, the modal is shown.
Out of scope (BA): Delete / Backspace on a selected range; Undo / Redo (the Shutdown Timeline has none).

Common precondition: environment QA. Spare Shutdown Event, tab `Timeline`, with group `Maintenance Group` (activities `Piping Inspection` Start Date `03 Jun 2026`, End Date `16 Jun 2026`, weeks starting Mon 01 Jun, 08 Jun, 15 Jun 2026, Plan (%) `30.0`; `Valve Overhaul`; `Pump Check` whose dates cover the weeks C-1, C, C+1 and C+2, where C is the Current Week) and group `Electrical Group` (activities `Cable Test` and `Panel Check`). All activities have Status `Open`. Timeline screen: logged in as Turnaround Manager (View Timeline + Update Progress and Note). Edit Plan screen: logged in as Turnaround Manager (View Timeline + Edit Plan), `Edit Plan` clicked, page `Edit Shutdown Timeline Plan` open, the splitter dragged to the right so the columns Start Date and End Date show, Total Progress Plan (%) `100.0`. Save is real: use the spare event and restore after the Save cases. Clipboard text is prepared in a plain text editor (or Excel) before the case.

Notation: -> separates action and expected outcome. `<TAB>` is a tab character between two cells of one row; each new line is a new row. "Record" means write down the value shown, to compare in a later step. Focus Mode = cell selected, not typing in it; Edit Mode = typing inside the cell. "The modal" means the modal described above.

## Think like the user (3 lines)
- Turnaround Manager, every week updates progress and every plan cycle edits many activities; often copies a block from Excel.
- Wants to fill Status, weekly progress and the preparation plan in one paste instead of typing every cell.
- A rushed person pastes a block that is too long, from the wrong row, with a typo in a date or `Done` instead of `Close`, and pastes again right away; selects two rows at once; presses Ctrl+Z hoping to undo; leaves the page with unsaved pasted data.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 Ctrl+C / Cmd+C copies tab-separated values | Equivalence | Wrong clipboard text | TC-002, TC-003, TC-006, TC-021, TC-022 |
| AC-2 Focus and Edit Mode paste same, active cell = anchor | State | Different result per mode, wrong anchor | TC-010, TC-011, TC-013, TC-018 |
| AC-3 paste only inside the anchor's Activity Group (rows beyond: ignored on Timeline, new activities on Edit Plan, no message) | Boundary | Data written into another group | TC-002, TC-003, TC-008, TC-017, TC-023 |
| AC-4 copy across groups skips header rows | Boundary | Header text in clipboard | TC-002, TC-003 |
| AC-5 invalid value: cleared, red #FFCCC7, Save disabled, modal once per paste, partial paste, modal text | Decision table | Bad value kept, many modals, valid values lost | TC-009, TC-012, TC-014, TC-015, TC-016, TC-019 |
| AC-6 paste sets isDirty; no Undo | State | Silent loss, wrong undo expectation | TC-008, TC-020, TC-023 |
| AC-7 Status paste Open/Close, official spelling, spaces trimmed, Status column only, accepted on a Close activity | Data table | Wrong spelling, value in other column | TC-002, TC-007, TC-008, TC-009 |
| AC 2.1 invalid or blank Status keeps current value, not red, modal once | Decision table | Status cleared, Status red | TC-009 |
| AC-8 Timeline extra rows ignored | Boundary | Activity added, next group changed | TC-002, TC-008 |
| AC-9 weekly copy single or one row; two rows blocked, no message | Boundary | Mixed rows copied | TC-004, TC-005, TC-011 |
| AC-10 Timeline paste only into Actual; Plan read-only; anchor on Plan pastes nothing | Role/state | Plan changed from Timeline | TC-011 |
| AC-11 Actual input rules (1 decimal, clamp 100.0, invalid blank + modal) | Data table | Wrong value kept | TC-012 |
| AC-12 future week cut off, no modal | Boundary (C, C+1) | Future actual saved | TC-011 |
| AC-13 NxN across Activity..End Date, Plan (%) and Status columns ignored, not shifted | Equivalence | Columns shifted | TC-003, TC-013 |
| AC-14 Activity 500, Action By 50, Focal Point 50 truncate without modal; strange text; spaces | Boundary, strange input | Too long or changed text saved | TC-014 |
| AC-15 Start/End Date formats, one-digit day shown `DD Mon YYYY`, other formats invalid, Start later than End, mandatory empty red | Data table | Bad date applied | TC-015, TC-016 |
| AC-16 dates paste recalculates weekly Plan (%) | Calculation | Old weeks kept | TC-013 |
| AC-17 auto activity creation, defaults; 100+ rows, no limit | Boundary (last, middle anchor, many rows) | Wrong count, defaults, group, rows lost | TC-017, TC-023 |
| AC-18 Edit Plan weekly copy single or one row; copy from Actual row into Plan row | Equivalence | Wrong clipboard text | TC-003, TC-005, TC-018 |
| AC-19 Edit Plan paste only into Plan (%) weekly; more than one row: first row only | Role/state | Actual row changed, other activity changed | TC-018, TC-019 |
| AC-20 only Start-End weeks editable, cut off, anchor outside range | Boundary | Plan outside range | TC-013, TC-018 |
| AC-21 Plan (%) = sum of weekly after paste | Calculation | Wrong total | TC-018 |
| AC 3.2 negative / not-a-number weekly value cleared + modal; clamp and truncate no modal | Data table | Wrong value, wrong modal | TC-012, TC-019 |
| ETM-8550 keyboard selection (Shift+click, Shift+arrow, drag, up/down between Plan and Actual lines, read-only selectable not editable, Tab/Enter next editable cell) | State | Block over two rows, read-only opened | TC-004, TC-005, TC-018 |
| Ctrl+Z after paste does not revert | State | Wrong undo expectation | TC-008, TC-020 |
| Permission: Timeline needs Update Progress; Edit Plan needs Edit Plan | Role | Permission leak | TC-001 |
| Save / Update Progress persistence | Persistence | Pasted data lost | TC-008, TC-011, TC-020 |
| State: leave page with unsaved paste | Close/Cancel | Silent loss | TC-008, TC-020, TC-023 |
| State: real Excel source | Equivalence | Excel format differs | TC-021, TC-022 |

Merged and added: the first draft had 43 flows, merged to 22 chained flows (same screen, same permission, state carries on). With the BA answers one new flow was added: TC-023 (100+ rows pasted on Edit Plan, no home in the 22). Every other confirmed behaviour went into existing cases as steps or table rows: Q5 TC-002 and TC-003; Q6 TC-004 and TC-005; Q7 TC-011 and TC-018; Q8 TC-007 and TC-009; Q9 TC-008 and TC-013; Q11 TC-004, TC-005, TC-018; Q12 TC-008 and TC-020; Q13 TC-023; Q15 TC-016; Q16 TC-011 and TC-018; Q17 TC-007; Q18 TC-014 and TC-016; Q19 TC-015. Several-value cases are tables the test loops over (TC-007, TC-012, TC-014, TC-015, TC-019). Total 23 flows (limit 24). Added 19 Nov (user decision, steps only, no new case): empty clipboard cell in TC-011, TC-016, TC-018; record-only steps for the blocked selection and Q11 selection steps in TC-004, TC-005; quotes and line-break rows in TC-014; F5 steps in TC-020. Review round 1: TC-008, TC-013, TC-016 steps rewritten; Edit Mode paste on Edit Plan added to TC-013 (AC-2); F-6 option noted in TC-010.

Categories (lessons-learned) considered:
- 1 Two people at once: relevant, Story has no rule for paste; Suggestion S-1.
- 2 Filter+Sort+Search: not relevant, none in this Story.
- 3 Old data after migrations: not relevant, no migration.
- 4 Strange input: relevant, TC-007, TC-009, TC-012, TC-014, TC-015, TC-019.
- 5 Reordering changes calculations: not relevant, no reorder (paste writes by position, TC-008 and TC-013 check the row order).
- 6 Linked data: relevant, TC-013, TC-018 (weekly Plan, Plan (%) and totals).
- 7 Charts depending on each other: not relevant, no bars in the Story's AC.
- 8 Same data on many pages: relevant, TC-008, TC-011, TC-020 (saved paste shows after reload).
- 9 Matrix calculations: relevant, TC-007, TC-012, TC-014, TC-015, TC-019 use value tables.
- 10 Added lessons: none added yet.

Counts: High 16, Medium 7, Low 0. Auto 19, Partial 1, Manual 3. NEG cases 5.

## Open questions
- Suggestion (not in Story) S-1: two users paste into the same plan at the same time (module notes: last write wins on Timeline).
- Suggestion (not in Story) S-2: Excel cells with line breaks, quotes or leading/trailing spaces in text columns (quotes and one line-break cell added to TC-014 on 19 Nov; the line break is record-only).
- Suggestion (not in Story) S-3: browser blocks clipboard permission; paste from the context menu.
- Suggestion (not in Story) S-4: refresh or browser Back after a paste (module notes: F5 and Back are not changes). F5 added to TC-020 on 19 Nov (the warning is record-only); browser Back is not covered.
- Suggestion (not in Story) S-5: an empty clipboard cell pasted into a weekly cell or the Activity cell: is the modal shown or not (the answers cover "spaces only" but not a truly empty cell). Steps added 19 Nov in TC-011, TC-016, TC-018 check only the cell value and colour and record the modal state for BA.

## Test cases (23 flows)

### TC-001 [FE][MT] Verify a user with View Timeline only cannot paste on Timeline and cannot open Edit Plan (NEG) [Auto]
Precondition: common. Logged in as Job Owner (View Timeline only), Timeline tab open. Clipboard text: `Close`.
Priority: High
1. Click the Status cell of `Piping Inspection`. -> No dropdown or input opens; the Status cell shows `Open`.
2. Press Ctrl+V. -> The Status cell still shows `Open`.
3. Look at the top right of the Timeline. -> The buttons `Edit Plan` and `Update Progress` are not shown.
4. Open the address of the page `Edit Shutdown Timeline Plan` directly. -> The page `Access Denied` is shown (address `/unauthorized`) and no plan grid appears.
Automation: Starting data: common, Job Owner login, Edit Plan address. Check: Status unchanged, Access Denied. Clean up: none.

### TC-002 [FE][MT] Verify on Timeline Status copy, copy across two groups, and paste stays in the group of the clicked cell (POS) [Auto]
Precondition: common (Timeline screen).
Priority: High
1. Select the Status cell of `Piping Inspection` and press Ctrl+C. -> The single cell is selected.
2. Paste into a plain text editor. -> The editor shows one value `Open`.
3. Select the Status cells of `Piping Inspection`, `Valve Overhaul` and `Pump Check` and press Ctrl+C. -> The three cells are selected.
4. Paste into a plain text editor. -> The editor shows three lines, each `Open`.
5. Set the Status of `Cable Test` to `Close` and keep `Panel Check` as `Open`. -> `Cable Test` shows `Close`; `Panel Check` shows `Open`.
6. Select the Status cells from `Pump Check` down to `Panel Check` and press Ctrl+C. -> The selection covers three activities and the group header row between them.
7. Paste into a plain text editor. -> The editor shows three lines `Open`, `Close`, `Open`; no line for the group header `Electrical Group`.
8. Click the Status cell of `Valve Overhaul` and press Ctrl+V. -> `Valve Overhaul` shows `Open`; `Pump Check` shows `Close` (second value).
9. Look at `Cable Test` and `Panel Check`. -> `Cable Test` still shows `Close` and `Panel Check` still shows `Open`; the third value was ignored.
10. Look at `Maintenance Group` and at the page. -> No activity row was added; no modal and no message is shown.
Automation: Check: clipboard texts (clipboard read permission granted); second group's cells after the paste. Clean up: Discard Change.

### TC-003 [FE][MT] Verify on Edit Plan copy of cell, block and weekly cells, and paste of rows copied across two groups (POS) [Auto]
Precondition: common (Edit Plan screen). `Piping Inspection` has weekly Plan (%) `10.0`, `10.0`, `10.0` in weeks 01 Jun, 08 Jun, 15 Jun 2026 and Actual (%) `5.0` in week 01 Jun 2026. `Maintenance Group` has 3 activities.
Priority: High
1. Select the Activity cell of `Piping Inspection` and press Ctrl+C. -> The single cell is selected.
2. Paste into a plain text editor. -> The editor shows one value `Piping Inspection`.
3. Select the cells from Activity to End Date of `Piping Inspection` and `Valve Overhaul` and press Ctrl+C. -> The ten cells are selected.
4. Paste into a plain text editor. -> The editor shows two lines; each line has five values separated by tabs: Activity, Action By, Focal Point, Start Date, End Date; the Plan (%) value does not appear.
5. Select the three weekly Plan (%) cells of `Piping Inspection` and press Ctrl+C. -> The three cells are selected.
6. Paste into a plain text editor. -> The editor shows one line `10.0<TAB>10.0<TAB>10.0`.
7. Select the weekly Actual (%) cell of week 01 Jun 2026 and press Ctrl+C. -> The single cell is selected.
8. Paste into a plain text editor. -> The editor shows `5.0`.
9. Select the Activity cells from `Pump Check` down to `Panel Check` and press Ctrl+C. -> The selection covers three activities and the group header row between them.
10. Paste into a plain text editor. -> The editor shows three lines `Pump Check`, `Cable Test`, `Panel Check`; no line for the group header.
11. Click the Activity cell of `Valve Overhaul` and press Ctrl+V. -> `Valve Overhaul` shows `Pump Check`; the next activity row shows `Cable Test`.
12. Look at the bottom of `Maintenance Group`. -> One new activity `Panel Check` appears after the last activity; no modal and no message is shown.
13. Look at `Electrical Group`. -> Its two activities still show `Cable Test` and `Panel Check` and no activity was added there.
Automation: Check: clipboard texts and row/column counts; group row counts (3 then 4 and 2 unchanged). Clean up: Discard Change.

### TC-004 [FE][MT] Verify on Timeline a block of weekly cells stays on one activity and one line, up and down move between Plan and Actual lines, and a read-only cell can be selected but not opened (NEG) [Auto]
Precondition: common (Timeline screen). `Piping Inspection` and `Valve Overhaul` cover weeks 01 Jun, 08 Jun, 15 Jun 2026.
Priority: Medium
1. Click the weekly Actual (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is selected.
2. Press Shift+Right. -> The Actual (%) cells of weeks 08 Jun and 15 Jun 2026 are selected as one block.
3. Press Shift+Down. -> The selection stays on the same activity and the same line; no cell of another line or activity is added; no message is shown.
4. Shift+click the weekly Actual (%) cell of week 01 Jun 2026 of `Piping Inspection`. -> The Actual (%) cells of weeks 01 Jun and 08 Jun 2026 are selected as one block.
5. Click the weekly Actual (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is selected.
6. Shift+click the same week of `Valve Overhaul`. -> The cells of two activities are not selected together; no message is shown.
7. Record how the screen shows the blocked selection (nothing selected / only the first cell / the click is ignored). -> The real behaviour is written down.
8. Drag from the weekly Plan (%) cell of week 08 Jun 2026 to the weekly Actual (%) cell of the same week. -> The Plan (%) and Actual (%) cells are not selected together; no message is shown.
9. Record how the screen shows the blocked selection after the drag. -> The real behaviour is written down.
10. Drag across the weekly Plan (%) cells of weeks 01 Jun and 08 Jun 2026 of `Piping Inspection`. -> The two Plan (%) cells are selected as one block (a read-only cell can be selected).
11. Click the weekly Actual (%) cell of week 08 Jun 2026 and press the Up arrow. -> The weekly Plan (%) cell of the same week is selected.
12. Press Enter on the selected weekly Plan (%) cell. -> No input opens (Plan (%) is read-only on the Timeline); the cell keeps its value.
13. Press the Down arrow. -> The weekly Actual (%) cell of the same week is selected.
Notes: added 19 Nov: steps 4, 7, 9, 10. Keyboard and selection steps follow BA answer Q11 (Dev comment on ETM-8550, 17 Nov).
Automation: Check: selected cell ranges after each key; no modal. Clean up: none.

### TC-005 [FE][MT] Verify on Edit Plan a block of weekly cells stays on one activity and one line, up and down move between Plan and Actual lines, and a read-only cell can be selected but not opened (NEG) [Auto]
Precondition: common (Edit Plan screen). `Piping Inspection` and `Valve Overhaul` cover weeks 01 Jun, 08 Jun, 15 Jun 2026.
Priority: Medium
1. Click the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is selected.
2. Press Shift+Right. -> The Plan (%) cells of weeks 08 Jun and 15 Jun 2026 are selected as one block.
3. Press Shift+Down. -> The selection stays on the same activity and the same line; no cell of another line or activity is added; no message is shown.
4. Shift+click the weekly Plan (%) cell of week 01 Jun 2026 of `Piping Inspection`. -> The Plan (%) cells of weeks 01 Jun and 08 Jun 2026 are selected as one block.
5. Click the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is selected.
6. Shift+click the same week of `Valve Overhaul`. -> The cells of two activities are not selected together; no message is shown.
7. Record how the screen shows the blocked selection (nothing selected / only the first cell / the click is ignored). -> The real behaviour is written down.
8. Drag from the weekly Plan (%) cell of week 08 Jun 2026 to the weekly Actual (%) cell of the same week. -> The Plan (%) and Actual (%) cells are not selected together; no message is shown.
9. Record how the screen shows the blocked selection after the drag. -> The real behaviour is written down.
10. Drag across the weekly Actual (%) cells of weeks 01 Jun and 08 Jun 2026 of `Piping Inspection`. -> The two Actual (%) cells are selected as one block (a read-only cell can be selected).
11. Click the weekly Plan (%) cell of week 08 Jun 2026 and press the Down arrow. -> The weekly Actual (%) cell of the same week is selected.
12. Press Enter on the selected weekly Actual (%) cell. -> No input opens (Actual (%) is read-only on Edit Plan); the cell keeps its value.
13. Press the Up arrow. -> The weekly Plan (%) cell of the same week is selected.
Notes: added 19 Nov: steps 4, 7, 9, 10. Keyboard and selection steps follow BA answer Q11 (Dev comment on ETM-8550, 17 Nov).
Automation: Check: selected cell ranges after each key; no modal. Clean up: none.

### TC-006 [FE][MT] Verify Cmd+C copies selected cells on a Mac (POS) [Manual: needs a Mac]
Precondition: common (Timeline screen), opened on macOS. `Piping Inspection` Actual (%) `10.0` and `20.0` in weeks 01 Jun and 08 Jun 2026; `Valve Overhaul` covers the same weeks and its Actual (%) cells are empty.
Priority: Medium
1. Select the two weekly Actual (%) cells of `Piping Inspection`. -> The two cells are selected.
2. Press Cmd+C. -> The selection stays.
3. Paste into a plain text editor with Cmd+V. -> The editor shows one line `10.0<TAB>20.0`.
4. Click the weekly Actual (%) cell of week 01 Jun 2026 of `Valve Overhaul` and press Cmd+V. -> `Valve Overhaul` shows `10.0` and `20.0` in weeks 01 Jun and 08 Jun 2026.

### TC-007 [FE][MT] Verify a pasted Status value is trimmed, accepted in any letter case, shown in the official spelling and accepted on a Close activity (BND) [Auto]
Precondition: common (Timeline screen).
Priority: High
1. Set the Status of `Piping Inspection` to the value of the column Start Status in the table. -> The Status cell shows that value.
2. Put the Pasted value of the table row on the clipboard, click the Status cell of `Piping Inspection` and press Ctrl+V. -> The Status cell shows the Expected Status of that row.
3. Look at the Status colour. -> `Open` is red text and `Close` is green text.
4. Look at the page. -> No modal is shown.
Expected values the test loops over (a start Status of `Close` means the activity is a Close activity):

| Start Status | Pasted value | Expected Status |
|---|---|---|
| Close | open | Open |
| Close | OPEN | Open |
| Close | Open | Open |
| Open | close | Close |
| Open | CLOSE | Close |
| Open | cLoSe | Close |
| Close | (space)Open(space) | Open |
| Open | (space)close(space) | Close |

Automation: Data set: table above, one case looped. Clean up: Discard Change after each row.

### TC-008 [FE][MT] Verify on Timeline a Status paste: Status column only, not undone by Ctrl+Z, marks the screen as changed, kept after Update Progress (POS) [Auto]
Precondition: common (Timeline screen). All Status cells show `Open`; `Update Progress` is disabled; `Valve Overhaul` Actual (%) of week 01 Jun 2026 is empty.
Priority: High
1. Put `Close` on the clipboard, click the Status cell of `Piping Inspection` (it shows `Open`) and press Ctrl+V. -> The Status cell shows `Close`.
2. Look at the button `Update Progress`. -> The button is enabled (same as manual editing).
3. Reload the page. -> The button `Update Progress` is disabled and all Status cells show `Open`.
4. Put three lines `close`, `Open`, `CLOSE` on the clipboard, click the Status cell of `Piping Inspection` and press Ctrl+V. -> `Piping Inspection` shows `Close`; `Valve Overhaul` shows `Open`; `Pump Check` shows `Close`.
5. Press Ctrl+Z. -> The three Status cells still show `Close`, `Open`, `Close`; the paste is not reverted.
6. Look at the Status cells of `Cable Test` and `Panel Check`. -> Both still show `Open`.
7. Put four lines `Open`, `Open`, `Open`, `Open` on the clipboard, click the Status cell of `Valve Overhaul` and press Ctrl+V. -> `Valve Overhaul` and `Pump Check` show `Open`; `Piping Inspection` still shows `Close`.
8. Look at `Maintenance Group` and `Electrical Group`. -> No activity row was added; `Cable Test` and `Panel Check` still show `Open`; no modal is shown.
9. Record the Plan (%) and Actual (%) totals and the weekly Actual (%) of week 01 Jun 2026 of `Valve Overhaul`. -> The values are written down for comparison.
10. Put `Close<TAB>10.0` on the clipboard. -> The clipboard holds one row with two values.
11. Click the Status cell of `Valve Overhaul` and press Ctrl+V. -> `Valve Overhaul` shows Status `Close`.
12. Look at the Plan (%) and Actual (%) totals and the weekly cells of `Valve Overhaul`. -> All equal the values recorded in step 9; `10.0` was ignored (only Status and weekly Actual (%) take values on the Timeline); no modal is shown.
13. Click a side menu item. -> The modal `Unsaved Change` appears with the text `Are you sure you want to leave this page? Changes you made will not be saved.` and the buttons `Continue Editing` and `Discard Change`.
14. Click `Continue Editing`. -> The modal closes and the Timeline stays with the pasted Status values.
15. Click `Update Progress`. -> The toast `Update Success` with `Update Progress Successfully.` appears.
16. Reload the page. -> `Piping Inspection` shows `Close`, `Valve Overhaul` shows `Close`, `Pump Check` shows `Open`.
Automation: Starting data: common. Check: Status cells per step; no modal count. Clean up: set all Status back to `Open`, Update Progress.

### TC-009 [FE][MT] Verify on Timeline an invalid or blank Status keeps the current value, is not red, and the modal is shown once per paste action (NEG) [Auto]
Precondition: common (Timeline screen). Status of `Piping Inspection` `Open`, `Valve Overhaul` `Close`, `Pump Check` `Open`.
Priority: High
1. Put `Done` on the clipboard, click the Status cell of `Piping Inspection` and press Ctrl+V. -> The Status cell still shows `Open` (the current value is kept).
2. Look at the page. -> The modal is shown once: title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK`.
3. Click `OK`. -> The modal closes; no second modal appears.
4. Look at the Status cell of `Piping Inspection`. -> The cell is not cleared and has no red error background.
5. Put three lines `Done`, `open`, `xyz` on the clipboard, click the Status cell of `Piping Inspection` and press Ctrl+V. -> The modal is shown once.
6. Click `OK`. -> The modal closes; no second modal appears.
7. Look at the Status cells of `Piping Inspection`, `Valve Overhaul` and `Pump Check`. -> `Piping Inspection` shows `Open` (kept); `Valve Overhaul` shows `Open` (the valid value `open` was applied); `Pump Check` shows `Open` (kept); no cell is red.
8. Put one empty cell (copied from an empty Excel cell) on the clipboard, click the Status cell of `Valve Overhaul` and press Ctrl+V. -> The Status cell still shows `Open`; the modal is shown once.
9. Click `OK`. -> The modal closes and the cell has no red background.
10. Press Ctrl+V again on the same anchor cell. -> The modal is shown once more (one per paste action).
Automation: Check: cell text unchanged, modal count 1 per paste, no red colour on the cell. Clean up: Discard Change.

### TC-010 [FE][MT] Verify a paste in Focus Mode and in Edit Mode gives the same result (POS) [Partial: how a Status cell enters Edit Mode is not described, checked by hand]
Precondition: common (Timeline screen).
Priority: Medium
1. Put two lines `Close`, `Close` on the clipboard. -> The clipboard holds two lines.
2. Click the Status cell of `Piping Inspection` (Focus Mode) and press Ctrl+V. -> `Piping Inspection` and `Valve Overhaul` show `Close`; `Pump Check` shows `Open`.
3. Reload the page. -> All three Status cells show `Open`.
4. Put the cell of `Piping Inspection` into Edit Mode and press Ctrl+V. -> `Piping Inspection` and `Valve Overhaul` show `Close`; `Pump Check` shows `Open`.
Notes: Automate the Focus Mode half; the Edit Mode entry is checked by hand. The case can become fully Auto if the Edit Mode half uses a typed weekly Actual (%) cell.

### TC-011 [FE][MT] Verify on Timeline weekly Actual (%) paste, copy from the Plan (%) line into the Actual (%) line, read-only Plan (%), future-week cut-off, Update Progress and reload (POS) [Auto]
Precondition: common (Timeline screen). `Piping Inspection` and `Valve Overhaul` cover weeks 01 Jun, 08 Jun, 15 Jun 2026 (past weeks) with empty Actual (%). `Pump Check` covers weeks C-1, C, C+1 and C+2 with empty Actual (%) in C-1 and C.
Priority: High
1. Record the weekly Plan (%) values of `Piping Inspection`. -> The values are written down for comparison.
2. Put `1.0<TAB>2.0<TAB>3.0` on the clipboard, click the weekly Actual (%) cell of week 01 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The three cells show `1.0`, `2.0`, `3.0` (weeks 01 Jun, 08 Jun, 15 Jun).
3. Look at the Actual (%) row of `Valve Overhaul`. -> It is unchanged.
4. Select the three Actual (%) cells of `Piping Inspection` and press Ctrl+C. -> The three cells are selected.
5. Paste into a plain text editor. -> The editor shows one line `1.0<TAB>2.0<TAB>3.0`.
6. Select the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+C. -> The single cell is selected.
7. Paste into a plain text editor. -> The editor shows the Plan (%) value recorded in step 1 for week 08 Jun.
8. Click the weekly Actual (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The Actual (%) cell shows the Plan (%) value recorded in step 1 for week 08 Jun; no modal is shown.
9. Select the three Actual (%) cells of `Piping Inspection` and press Ctrl+C. -> The three cells are selected.
10. Click the weekly Actual (%) cell of week 01 Jun 2026 of `Valve Overhaul`. -> The cell is selected.
11. Press Ctrl+V. -> `Valve Overhaul` shows the same three values as `Piping Inspection` in the three weeks.
12. Put `55.0` on the clipboard, click the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The cell does not show `55.0`; no input opens; nothing is pasted into another row; no modal is shown.
13. Look at the weekly Plan (%) and Actual (%) values of `Piping Inspection` and `Valve Overhaul`. -> The Plan (%) values equal the values recorded in step 1; the Actual (%) values are the same as after the paste into `Valve Overhaul`.
14. Put `1.0<TAB>2.0<TAB>3.0<TAB>4.0` on the clipboard, click the weekly Actual (%) cell of week C-1 of `Pump Check` and press Ctrl+V. -> Week C-1 shows `1.0` and week C shows `2.0`.
15. Look at the Actual (%) cells of weeks C+1 and C+2 and at the page. -> Both cells are empty; `3.0` and `4.0` are not applied; the week C+1 cell does not open an input; no modal is shown.
16. Put one empty cell (copied from an empty Excel cell) on the clipboard. -> The clipboard holds one empty cell.
17. Click the weekly Actual (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The Actual (%) cell is blank.
18. Look at the Actual (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is blank and has no red background (an empty cell clears the value; weekly Actual is not mandatory). (corrected 24 Nov 2026, BA S-5)
19. Look at the page. -> No modal is shown. (corrected 24 Nov 2026, BA S-5)
20. Click `Update Progress`. -> The toast `Update Success` with `Update Progress Successfully.` appears.
21. Reload the page. -> The Actual (%) values of `Piping Inspection`, `Valve Overhaul` and `Pump Check` are the same as before the reload.
Notes: added 19 Nov: steps 16, 17, 18, 19.
Automation: Starting data: dates derived from the Current Week. Clean up: clear the Actual values, Update Progress.

### TC-012 [FE][MT] Verify pasted weekly Actual (%) values on Timeline follow the input rules and only an invalid value shows the modal (BND) [Auto]
Precondition: common (Timeline screen).
Priority: High
1. Put the Pasted value of the table row on the clipboard, click the weekly Actual (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The cell shows the Expected cell value of that row.
2. Look at the page. -> The modal shown is the one in the Modal column of that row.
3. Close the modal if it is shown (button `OK`). -> The modal is closed and the cell keeps its value.
4. Look at the cell colour and the button `Update Progress`. -> The cell has no red background and the button is not disabled by this cell.
Expected values the test loops over:

| Pasted value | Expected cell value | Modal |
|---|---|---|
| 12.36 | 12.3 | none (truncate) |
| 12.34 | 12.3 | none (truncate) |
| 45.5 | 45.5 | none |
| 30 | 30.0 | none |
| 0.0 | 0.0 | none |
| 100.0 | 100.0 | none |
| 100.9 | 100.0 | none (clamp) |
| 250 | 100.0 | none (clamp) |
| abc | blank | `Paste Validation Failed` |
| -10.0 | blank | `Paste Validation Failed` |

Automation: Data set: table above, one case looped. Check: cell value, modal count 0 or 1, modal title. Clean up: Discard Change after each row.

### TC-013 [FE][MT] Verify on Edit Plan a block paste over Activity to End Date, Edit Mode paste, ignored columns and weekly Plan (%) after a date paste (POS) [Auto]
Precondition: common (Edit Plan screen). `Piping Inspection` Start `03 Jun 2026`, End `16 Jun 2026` (weeks 01 Jun, 08 Jun, 15 Jun); the week starting 22 Jun 2026 is outside the range. Clipboard text of step 1: `Pipe Test<TAB>Team A<TAB>Anan<TAB>05 Jun 2026<TAB>12 Jun 2026` and `Valve Test<TAB>Team B<TAB>Mali<TAB>08 Jun 2026<TAB>15 Jun 2026`.
Priority: High
1. Put the two rows on the clipboard, click the Activity cell of `Piping Inspection` and press Ctrl+V. -> The Activity cell shows `Pipe Test`.
2. Look at the rest of the first row. -> Action By `Team A`; Focal Point `Anan`; Start Date `05 Jun 2026`; End Date `12 Jun 2026`.
3. Look at the second row (`Valve Overhaul`). -> Activity `Valve Test`; Action By `Team B`; Focal Point `Mali`; Start Date `08 Jun 2026`; End Date `15 Jun 2026`.
4. Look at the Status of both rows. -> Both still show `Open`.
5. Look at `Pump Check`. -> It is unchanged.
6. Click the weekly Plan (%) cell of week 15 Jun 2026 of `Pipe Test`. -> No input field opens (the week is after the new End Date).
7. Click the weekly Plan (%) cell of week 08 Jun 2026 of `Pipe Test`. -> An input field opens.
8. Record the Plan (%) of `Pipe Test`. -> The value is written down for comparison.
9. Put `03 Jun 2026<TAB>23 Jun 2026` on the clipboard, click the Start Date cell of `Pipe Test` and press Ctrl+V. -> Start Date shows `03 Jun 2026` and End Date shows `23 Jun 2026`.
10. Click the weekly Plan (%) cell of week 22 Jun 2026. -> An input field opens (the week is now inside the range).
11. Look at the weekly Plan (%) cells of `Pipe Test` from week 01 Jun to week 22 Jun 2026 and at its Plan (%). -> Every week in the range has a value; the weekly values add up to the Plan (%); the Plan (%) equals the value recorded in step 8; no modal is shown.
12. Record the Status and the Plan (%) of `Pump Check`. -> The values are written down for comparison.
13. Put `Pump Test<TAB>Team C<TAB>Nok<TAB>04 Jun 2026<TAB>14 Jun 2026<TAB>Close<TAB>80.0` on the clipboard, click the Activity cell of `Pump Check` and press Ctrl+V. -> Activity `Pump Test`; Action By `Team C`; Focal Point `Nok`; Start Date `04 Jun 2026`; End Date `14 Jun 2026`.
14. Look at the Status and Plan (%) of `Pump Test` and at the page. -> Status equals the value recorded in step 12; Plan (%) equals the value recorded in step 12 (not `80.0`); the values for these two columns were ignored and nothing shifted; no modal is shown.
15. Look at the weekly Plan (%) cells of `Pump Test`. -> The weekly values add up to the Plan (%); weeks outside 04 Jun - 14 Jun 2026 are empty and not editable.
16. Open the Activity cell of `Pipe Test` for typing (Edit Mode). -> The cell shows a text input.
17. Put two lines `Edit One` and `Edit Two` on the clipboard and press Ctrl+V. -> `Pipe Test` row shows Activity `Edit One` and the next row (`Valve Test`) shows Activity `Edit Two`, the same result as a paste in Focus Mode.
Automation: Starting data: common. Check: cell texts by column, weekly sum equals Plan (%), editable or not per week, no modal. Edit Mode entry follows the normal way of the grid. Clean up: Back, Discard Change.

### TC-014 [FE][MT] Verify on Edit Plan pasted text is cut to the field limit, special text is kept, spaces only is empty (BND) [Auto]
Precondition: common (Edit Plan screen).
Priority: High
1. Put the Pasted text of the table row on the clipboard, click the cell of the Column (row `Piping Inspection`) and press Ctrl+V. -> The cell shows the Expected cell of that row.
2. Look at the page. -> The modal shown is the one in the Modal column of that row; for the spaces-only row the cell has red background `#FFCCC7` and the button `Save` is disabled.
3. Close the modal if it is shown (button `OK`). -> The modal is closed and the cell keeps its value.
4. For the line-break row, look at the Activity cell and the activity rows of `Maintenance Group`. -> The cell shows `Pipe Test` on one line (the line break is replaced by one space); no new activity row is added; no modal is shown. (corrected 24 Nov 2026, BA decision S-2)
Expected values the test loops over:

| Column | Pasted text | Expected cell | Modal |
|---|---|---|---|
| Activity | 500 characters | all 500 kept | none |
| Activity | 501 characters | first 500 kept | none (truncate) |
| Action By | 50 characters | all 50 kept | none |
| Action By | 51 characters | first 50 kept | none (truncate) |
| Focal Point | 50 characters | all 50 kept | none |
| Focal Point | 51 characters | first 50 kept | none (truncate) |
| Activity | ตรวจสอบท่อ | `ตรวจสอบท่อ` | none |
| Action By | Team A 🔧 | `Team A 🔧` | none |
| Focal Point | Anan & "Mali" <1> | `Anan & "Mali" <1>` | none |
| Activity | `Pipe  Test` (two spaces inside) | `Pipe  Test` (kept exactly as pasted) | none |
| Activity | (spaces only) | cleared, red background `#FFCCC7` | `Paste Validation Failed` |
| Activity | `Pipe "A" Test` (quotes inside) | `Pipe "A" Test` (kept as pasted) | none |
| Activity | `Pipe`, line break, `Test` (one Excel cell with a line break) | `Pipe Test` (line break replaced by one space, BA 24 Nov 2026) | none |

Notes: added 19 Nov: step 4 and the table rows with quotes and with a line break.
Automation: Data set: table above, long text generated as `A` repeated. Check: cell text length, red colour, Save disabled, modal count. Clean up: Discard Change after each row.

### TC-015 [FE][MT] Verify on Edit Plan a pasted Start Date in a supported format is converted to DD Mon YYYY, and an unsupported or invalid date is cleared with the modal (BND) [Auto]
Precondition: common (Edit Plan screen). `Valve Overhaul` has Start Date `08 Jun 2026` and End Date `15 Jun 2026`.
Priority: High
Date formats follow ETM-7902 (Flexible Date and Time Input Auto-Conversion): day-first formats with slash, hyphen, space or compact digits are converted to DD Mon YYYY; any other value is cleared.
1. Put the Pasted value of the table row on the clipboard, click the Start Date cell of `Valve Overhaul` and press Ctrl+V. -> The cell shows the Expected Start Date cell of that row.
2. Look at the page. -> The modal shown is the one in the Modal column of that row.
3. Close the modal if it is shown (button `OK`). -> The modal is closed.
4. Look at the Start Date cell and the button `Save`. -> The result is the one in the Red and Save column of that row.
Expected values the test loops over:

| Pasted value | Expected Start Date cell | Modal | Red and Save |
|---|---|---|---|
| 3 Jun 2026 | `03 Jun 2026` | none | not red, Save enabled |
| 03 Jun 2026 | `03 Jun 2026` | none | not red, Save enabled |
| 03/06/2026 | `03 Jun 2026` | none | not red, Save enabled |
| 5-6-26 | `05 Jun 2026` | none | not red, Save enabled |
| 05062026 | `05 Jun 2026` | none | not red, Save enabled |
| 2026-06-03 | cleared | `Paste Validation Failed` | red `#FFCCC7`, Save disabled |
| 31 Feb 2026 | cleared | `Paste Validation Failed` | red `#FFCCC7`, Save disabled |
| abc | cleared | `Paste Validation Failed` | red `#FFCCC7`, Save disabled |
| 03.06.2026 | cleared | `Paste Validation Failed` | red `#FFCCC7`, Save disabled |
| 12345 | cleared | `Paste Validation Failed` | red `#FFCCC7`, Save disabled |

Automation: Data set: table above. Check: cell text, colour, Save state, modal count. Clean up: Discard Change after each row.

### TC-016 [FE][MT] Verify on Edit Plan a cleared mandatory cell is red and Save stays disabled until it is filled, for an invalid date, a Start Date later than End Date, a mixed paste and an empty clipboard cell (NEG) [Auto]
Precondition: common (Edit Plan screen). `Valve Overhaul` Start Date `08 Jun 2026`, End Date `15 Jun 2026`.
Priority: High
1. Put `abc` on the clipboard, click the End Date cell of `Valve Overhaul` and press Ctrl+V. -> The End Date cell is cleared.
2. Look at the page. -> The modal is shown once: title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK`.
3. Click `OK`. -> The modal closes.
4. Look at the End Date cell. -> The cell shows red background `#FFCCC7`.
5. Look at the button `Save`. -> The button is disabled.
6. Type `14 Jun 2026` in the End Date cell. -> The red background is gone and `Save` is enabled.
7. Put `20 Jun 2026` on the clipboard, click the Start Date cell of `Valve Overhaul` and press Ctrl+V. -> The Start Date is not applied; the cell is cleared.
8. Click `OK` on the modal. -> The modal was shown once and is now closed.
9. Look at the Start Date cell and the button `Save`. -> The Start Date cell shows red background `#FFCCC7`; `Save` is disabled.
10. Put `20 Jun 2026<TAB>10 Jun 2026` on the clipboard, click the Start Date cell of `Valve Overhaul` and press Ctrl+V. -> Start Date shows `20 Jun 2026`; the End Date cell is cleared.
11. Click `OK` on the modal. -> The modal was shown once and is now closed.
12. Look at the End Date cell and the button `Save`. -> The End Date cell shows red background `#FFCCC7`; `Save` is disabled.
13. Type `25 Jun 2026` in the End Date cell. -> The red background is gone and `Save` is enabled.
14. Put `abc<TAB>xyz` on the clipboard, click the Start Date cell of `Valve Overhaul` and press Ctrl+V. -> The Start Date and End Date cells are both cleared and show red background `#FFCCC7`.
15. Click `OK` on the modal. -> The modal was shown once for the paste with two invalid cells and is now closed.
16. Type `08 Jun 2026` in the Start Date cell and `25 Jun 2026` in the End Date cell. -> The red background is gone on both cells and `Save` is enabled.
17. Put two lines `28 Jun 2026` and `abc` on the clipboard, click the End Date cell of `Piping Inspection` and press Ctrl+V. -> `Piping Inspection` shows End Date `28 Jun 2026`; the End Date cell of `Valve Overhaul` is cleared and shows red background `#FFCCC7`.
18. Click `OK` on the modal. -> The modal was shown once for the whole paste and is now closed.
19. Type `30 Jun 2026` in the End Date cell of `Valve Overhaul`. -> The red background is gone and `Save` is enabled.
20. Put one empty cell (copied from an empty Excel cell) on the clipboard, click the Activity cell of `Valve Overhaul` and press Ctrl+V. -> The Activity cell is cleared.
21. Look at the page. -> The modal is shown once: title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK` (an empty cell is invalid like spaces only, BA Q18). (corrected 24 Nov 2026)
22. Click `OK` on the modal. -> The modal was shown once and is now closed. (corrected 24 Nov 2026)
23. Look at the Activity cell and the button `Save`. -> The cell shows red background `#FFCCC7`; `Save` is disabled.
Notes: added 19 Nov: steps 21.
Automation: Check: colour `#FFCCC7`, button disabled then enabled, which cell is cleared in steps 7, 10 and 14, modal count 1 per paste. Clean up: Discard Change.

### TC-017 [FE][MT] Verify on Edit Plan extra pasted rows add new activities at the bottom of the group of the clicked cell, from the last and from a middle activity (POS) [Auto]
Precondition: common (Edit Plan screen). `Maintenance Group` has 3 activities. Clipboard text (three rows, two columns): `Task 1<TAB>Team A`, `Task 2<TAB>Team B`, `Task 3<TAB>Team C`.
Priority: High
1. Click the Activity cell of `Pump Check` (last of three) and press Ctrl+V. -> `Pump Check` shows `Task 1` and Action By `Team A`.
2. Look at the bottom of `Maintenance Group`. -> Two new activities appear after `Pump Check`: `Task 2` with `Team B`, and `Task 3` with `Team C`; no modal and no message is shown.
3. Look at the new activities. -> Plan (%) `0.0`; Status `Open`; Focal Point, Start Date and End Date are empty.
4. Look at the empty Start Date and End Date cells of the new activities. -> The cells are empty and not red (the paste did not cover the date columns; red applies only when a paste covers them); `Save` is disabled. (corrected 24 Nov 2026, user decision D-5 after a hand test)
5. Look at `Electrical Group`. -> Its activities are unchanged and no activity was added.
6. Reload the page. -> `Maintenance Group` has three activities again with the original names.
7. Click the Activity cell of `Valve Overhaul` (middle of three) and press Ctrl+V. -> `Valve Overhaul` shows `Task 1`; `Pump Check` shows `Task 2`.
8. Look at the bottom of `Maintenance Group`. -> One new activity `Task 3` with `Team C` appears after `Pump Check`; `Piping Inspection` is unchanged.
Automation: Starting data: common. Check: row count 5 then 4 in the group, defaults. Clean up: Discard Change.

### TC-018 [FE][MT] Verify on Edit Plan weekly Plan (%) paste: sum, read-only Actual (%), first row only, cut-off outside Start-End, Tab / Enter (BND) [Auto]
Precondition: common (Edit Plan screen). `Piping Inspection` is editable only in weeks 01 Jun, 08 Jun, 15 Jun 2026 and has Actual (%) `5.0` in week 01 Jun 2026; the week 25 May 2026 is shown in the grid and is outside the range; `Valve Overhaul` has weekly Plan (%) values (record them in step 1).
Priority: High
1. Record the weekly Plan (%) values of `Valve Overhaul`. -> The values are written down for comparison.
2. Put `10.0<TAB>20.0<TAB>30.0` on the clipboard, click the weekly Plan (%) cell of week 01 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The three cells show `10.0`, `20.0`, `30.0`.
3. Look at the Plan (%) field of `Piping Inspection`. -> It shows `60.0`.
4. Put `50.0` on the clipboard, click the weekly Actual (%) cell of week 01 Jun 2026 and press Ctrl+V. -> The Actual (%) cell still shows `5.0`; no modal is shown (paste goes into Plan (%) cells only).
5. Look at the weekly Plan (%) cell of week 01 Jun 2026. -> It still shows `10.0`.
6. Select the weekly Actual (%) cell of week 01 Jun 2026 and press Ctrl+C. -> The single cell is selected.
7. Click the weekly Plan (%) cell of week 08 Jun 2026 and press Ctrl+V. -> The Plan (%) cell of week 08 Jun shows `5.0`; no modal is shown.
8. Put two lines `10.0<TAB>20.0` and `70.0<TAB>80.0` on the clipboard, click the weekly Plan (%) cell of week 01 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> Week 01 Jun shows `10.0` and week 08 Jun shows `20.0`.
9. Look at the weekly Plan (%) values of `Valve Overhaul` and at the page. -> They equal the values recorded in step 1; `70.0` and `80.0` were ignored; no modal is shown.
10. Put `10.0<TAB>20.0<TAB>30.0<TAB>40.0` on the clipboard, click the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> Week 08 Jun shows `10.0` and week 15 Jun shows `20.0`.
11. Look at the weekly cells of weeks 22 Jun and 29 Jun 2026 and at the page. -> Both are empty and not editable; `30.0` and `40.0` are not applied; no modal is shown.
12. Look at the Plan (%) field. -> It shows `40.0` (week 01 Jun `10.0` + week 08 Jun `10.0` + week 15 Jun `20.0`).
13. Put `10.0<TAB>20.0<TAB>30.0` on the clipboard, click the weekly Plan (%) cell of week 25 May 2026 of `Piping Inspection` and press Ctrl+V. -> The week 25 May cell stays empty and not editable; no modal is shown.
14. Look at the weekly cells of weeks 01 Jun and 08 Jun 2026. -> Week 01 Jun shows `20.0` and week 08 Jun shows `30.0` (the values that landed inside the range are applied, the block is not shifted).
15. Put one empty cell (copied from an empty Excel cell) on the clipboard, click the weekly Plan (%) cell of week 08 Jun 2026 and press Ctrl+V. -> The Plan (%) cell of week 08 Jun is blank.
16. Look at the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection`. -> The cell is blank and has no red background (an empty cell clears the value; weekly Plan (%) is not mandatory). (corrected 24 Nov 2026, BA S-5)
17. Look at the page. -> No modal is shown. (corrected 24 Nov 2026, BA S-5)
18. Type `15.0` in the weekly Plan (%) cell of week 01 Jun 2026 and press Tab. -> The next editable cell (week 08 Jun 2026) opens for typing.
19. Press Enter. -> The value in the cell is kept and the weekly Plan (%) cell of week 08 Jun 2026 of `Valve Overhaul` (next row, same week) opens for typing. (corrected 24 Nov 2026: Enter moves down, Tab moves right.)
Notes: added 19 Nov: steps 15, 16, 17. Keyboard and selection steps follow BA answer Q11 (Dev comment on ETM-8550, 17 Nov).
Automation: Starting data: common, one Actual value seeded, week 25 May shown. Check: cell values, Plan (%) sum, which cells are editable, modal count 0. Clean up: Discard Change.

### TC-019 [FE][MT] Verify pasted weekly Plan (%) values on Edit Plan follow the input rules and an invalid value shows the modal (BND) [Auto]
Precondition: common (Edit Plan screen).
Priority: High
1. Put the Pasted value of the table row on the clipboard, click the weekly Plan (%) cell of week 08 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The cell shows the Expected cell value of that row.
2. Look at the page. -> The modal shown is the one in the Modal column of that row.
3. Close the modal if it is shown (button `OK`). -> The modal is closed and the cell keeps its value.
4. Look at the cell colour and the button `Save`. -> The cell has no red background and the button is not disabled by this cell.
Expected values the test loops over:

| Pasted value | Expected cell value | Modal |
|---|---|---|
| 12.36 | 12.3 | none (truncate) |
| 12.34 | 12.3 | none (truncate) |
| 45.5 | 45.5 | none |
| 30 | 30.0 | none |
| 0.0 | 0.0 | none |
| 100.0 | 100.0 | none |
| 100.9 | 100.0 | none (clamp) |
| 250 | 100.0 | none (clamp) |
| abc | blank | `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK` |
| -10.0 | blank | `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK` |

Automation: Data set: table above, one case looped. Check: modal title, message and button text; modal count 0 for clamp and truncate. Clean up: Discard Change after each row.

### TC-020 [FE][MT] Verify on Edit Plan a paste marks the screen as changed, Ctrl+Z does not revert it, Save keeps it, Discard Change drops a later paste (POS) [Auto]
Precondition: common (Edit Plan screen). Total Progress Plan (%) is `100.0` and stays `100.0` (the pastes do not change Plan (%)).
Priority: High
1. Put `Pipe Test<TAB>Team A<TAB>Anan` on the clipboard, click the Activity cell of `Piping Inspection` and press Ctrl+V. -> The three cells show `Pipe Test`, `Team A`, `Anan`.
2. Press Ctrl+Z. -> The three cells still show `Pipe Test`, `Team A`, `Anan`; the paste is not reverted.
3. Click `Back`. -> The modal `Unsaved Change` appears with the text `Are you sure you want to leave this page? Changes you made will not be saved.` and the buttons `Continue Editing` and `Discard Change`.
4. Click `Continue Editing`. -> The modal closes and the Edit Plan screen stays with the pasted values.
5. Click `Save`. -> The toast `Save Success` with `Save Shutdown Timeline Plan Successfully.` appears.
6. Reload the page. -> The row shows Activity `Pipe Test`, Action By `Team A`, Focal Point `Anan`.
7. Put `Temp Name` on the clipboard, click the Activity cell of `Pipe Test` and press Ctrl+V. -> The Activity cell shows `Temp Name`.
8. Click `Back`. -> The modal `Unsaved Change` appears with the same text and buttons.
9. Click `Discard Change`. -> The Timeline opens.
10. Open Edit Plan again. -> The Activity shows `Pipe Test` (the second paste was not saved).
11. Put `Temp Two` on the clipboard, click the Activity cell of `Pipe Test` and press Ctrl+V. -> The Activity cell shows `Temp Two`.
12. Press F5 to reload the page. -> The page reloads; whether a leave warning appears is written down for BA (not defined by the Story).
13. Confirm the reload if a warning is shown. -> The Edit Plan screen reloads.
14. Look at the Activity cell of the first activity. -> It shows `Pipe Test`; the unsaved paste `Temp Two` is not kept.
Notes: added 19 Nov: steps 11, 12, 13, 14.
Automation: Starting data: spare event. Check: modal text and buttons, toast text, values after Ctrl+Z and after reload. Clean up: edit the three cells back to `Piping Inspection` and the old values, Save.

### TC-021 [FE][MT] Verify values copied from a real Excel sheet paste and copy back correctly on Timeline (POS) [Manual: needs Excel and the Excel clipboard format]
Precondition: common (Timeline screen). Excel sheet: three Status cells `close`, `OPEN`, `Close` in one column and three number cells `10`, `20.5`, `30` in one row.
Priority: Medium
1. Copy the three Status cells in Excel with Ctrl+C. -> Excel marks the range as copied.
2. Click the Status cell of `Piping Inspection` and press Ctrl+V. -> Status shows `Close`, `Open`, `Close` for `Piping Inspection`, `Valve Overhaul`, `Pump Check`.
3. Copy the three number cells in Excel with Ctrl+C. -> Excel marks the range as copied.
4. Click the weekly Actual (%) cell of week 01 Jun 2026 of `Piping Inspection` and press Ctrl+V. -> The three weeks show `10.0`, `20.5`, `30.0`.
5. Select the three Status cells of the Timeline and press Ctrl+C. -> The selection stays.
6. Paste into Excel. -> Excel shows three rows `Close`, `Open`, `Close`.

### TC-022 [FE][MT] Verify values copied from a real Excel sheet paste and copy back correctly on Edit Plan, including date cells (POS) [Manual: needs Excel and the Excel clipboard format]
Precondition: common (Edit Plan screen). Excel sheet row: `Pipe Test`, `Team A`, `Anan`, a date cell `05 Jun 2026` and a date cell `12 Jun 2026` (format `dd mmm yyyy`).
Priority: Medium
1. Copy the five cells in Excel with Ctrl+C. -> Excel marks the range as copied.
2. Click the Activity cell of `Piping Inspection` and press Ctrl+V. -> Activity `Pipe Test`; Action By `Team A`; Focal Point `Anan`; Start Date `05 Jun 2026`; End Date `12 Jun 2026`.
3. Select the five cells of that row and press Ctrl+C. -> The selection stays.
4. Paste into Excel. -> Excel shows one row with the same five values in five cells.

### TC-023 [FE][MT] Verify on Edit Plan a paste of 120 rows from Excel completes, fills the group of the clicked cell with new activities in order, and has no row limit (BND) [Auto]
Precondition: common (Edit Plan screen). `Maintenance Group` has 3 activities. Clipboard text: 120 rows, one column, values `Task 001`, `Task 002`, up to `Task 120`.
Priority: Medium
1. Put the 120 rows on the clipboard, click the Activity cell of `Piping Inspection` and press Ctrl+V. -> The paste completes and the page stays usable; no modal and no message is shown.
2. Look at the first three activities of `Maintenance Group`. -> `Piping Inspection` shows `Task 001`, `Valve Overhaul` shows `Task 002`, `Pump Check` shows `Task 003`.
3. Look at the bottom of `Maintenance Group`. -> 117 new activities `Task 004` to `Task 120` appear in the same order; the group has 120 activities.
4. Look at `Electrical Group`. -> Its two activities are unchanged and no activity was added.
5. Click `Back`. -> The modal `Unsaved Change` appears with the text `Are you sure you want to leave this page? Changes you made will not be saved.` and the buttons `Continue Editing` and `Discard Change`.
6. Click `Discard Change`. -> The Timeline opens.
Automation: Starting data: common, 120 generated rows. Check: row count 120 in the group, first and last names, second group unchanged. Clean up: Discard Change (step 6).

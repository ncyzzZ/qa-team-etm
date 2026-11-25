# Draft test cases - ETM-6928 Keyboard Shortcuts for Editable Tables

Story: ETM-6928 [Improvement] Keyboard Shortcuts for Editable Tables (frozen exam copy).
Source: story.md, docs/modules (core-navigation-worklist, manpower-mob-plan, core-architecture), knowledge/. No analyst.md or inspector.md exists for this exam, so AC ids are numbered from the Story outline (see map).
Existing [QA] subtasks: none known.
Common precondition: logged in as Turnaround Manager (TM) with the edit permission of the page (Create Work / Edit Work Breakdown / Edit Manpower Mob Plan / Edit Organic Crew); the table holds at least 3 rows with data; a cell is focused by a click. Dropdown, text, date and chip values are real values of the QA data.
Notation: `->` separates action and expected result. "Row N" is a table row; "same column" means the same field in the next or previous row. Priority is by damage (the Story has none).

## AC numbering used in this draft
- AC-1.1.1 Tab moves right; 1.1.2 Tab at last field wraps to next row; 1.1.3 Tab at last field of last row stays
- AC-1.2.1 / 1.2.2 / 1.2.3 same for Shift+Tab (left, wrap to previous row, stay at first cell of row 1)
- AC-1.3.1 Enter moves down; 1.3.2 Enter on bottom row stays
- AC-1.4.1 Shift+Enter moves up; 1.4.2 stays on top row
- AC-1.5 Action columns and read-only cells are bypassed
- AC-2.1 Auto-commit on Tab, Shift+Tab, Enter, Shift+Enter
- AC-2.2 Text cell: focus lands active with all text selected
- AC-2.3.1 Dropdown / autocomplete / chip cell receives focus closed with visible focus outline
- AC-2.3.2 Open list: Tab / Shift+Tab select highlighted and move; Enter selects and closes, next Enter moves down
- AC-2.4 Date picker cell: focused closed, the four keys move without opening the calendar
- AC-3 Create / Duplicate Work, Work Details (3.1 order, 3.2 Tab Y to Work Type next row, 3.3 Shift+Tab, 3.4 Enter / Shift+Enter)
- AC-4 Edit Work Breakdown (4.1 order, 4.2 handle and Delete bypassed, 4.3 Tab, 4.4 Shift+Tab, 4.5 Enter / Shift+Enter)
- AC-5 Manpower Mob Plan personnel (5.1 order, 5.2 Onboard Date bypassed, 5.3 wrap across rows and groups, 5.4 Enter / Shift+Enter, 5.5 grid, summary rows, Delete excluded)
- AC-6 Edit Organic Crew (6.1 order, 6.2 Tab, 6.3 Shift+Tab, 6.4 Enter / Shift+Enter)
- AC-P Pre-condition: edit permission per page

## Think like the user (short)
- Who: Turnaround Manager and Job Owner filling many rows in one sitting, often 20+ rows, hands stay on the keyboard.
- Want: Tab through a row, Enter down a column, never reach for the mouse.
- Careless user: holds Tab, tabs through without changing anything, types in a dropdown then presses Tab, uses Thai input, leaves a required cell empty, deletes a row in the middle and keeps going.

## Coverage map
| Requirement / state | Technique | Risk | Cases |
|---|---|---|---|
| AC-1.1.1, 1.2.1 Tab / Shift+Tab inside a row | Condition table (expected order per page) | wrong next cell on any of 4 pages | TC-001, TC-002, TC-003, TC-004 |
| AC-1.1.2, 1.2.2 wrap | Edge values (last / first field) | focus jumps to Delete or leaves table | TC-005, TC-006, TC-007, TC-008 |
| AC-1.1.3, 1.2.3 stay at table ends | Edge values | focus escapes to header or browser bar | TC-009, TC-010 |
| AC-1.3.1, 1.4.1 vertical | Condition table | wrong column, wrong row | TC-011, TC-012, TC-013, TC-014 |
| AC-1.3.2, 1.4.2 vertical ends; one row only | Edge values, one item only | focus lost or moved out | TC-015, TC-016, TC-017 |
| AC-1.5, 3.2, 4.2, 5.2, 5.5 bypass | Error guessing | Delete / drag handle / Onboard / schedule grid focused or deleted by Enter | TC-018, TC-019, TC-020 |
| AC-2.1 auto-commit | State change, Effects and reverse | value lost, dirty state, saved value wrong | TC-021, TC-022, TC-023 |
| AC-2.2 text selected | Field interaction (typing, overwrite) | typing appends instead of overwrites | TC-024 |
| AC-2.3.1 closed with outline | Screen state | list opens by itself, no outline | TC-025 |
| AC-2.3.2 open list | Condition table (key x list open/closed) | wrong option saved, list stays open | TC-026, TC-027, TC-028 |
| AC-2.4 date picker | Field interaction (date picker) | calendar opens, value changes | TC-029, TC-030 |
| AC-3 Work Details | Condition table | order wrong on Create vs Duplicate | TC-001, TC-005, TC-031 |
| AC-4 Work Breakdown | Condition table | chips, textarea Enter | TC-002, TC-006, TC-032, TC-033 |
| AC-5 Manpower Mob Plan | Condition table, linked data | group wrap, Onboard Date, locked Demob | TC-003, TC-007, TC-034, TC-035 |
| AC-6 Organic Crew | Condition table | autocomplete, number cell | TC-004, TC-008, TC-036 |
| AC-P permission | Roles and permission | view-only role edits or focuses cells | TC-037 |
| Real user: long table scroll, add / delete row, hold key, Thai input | Real-user view, error guessing | focus off screen, stale row, double move | TC-038, TC-039, TC-040, TC-041 |
| Empty required cell, mixed messages | Error guessing, message check | extra messages, focus trapped | TC-042 |
| Save then reload | Effects and reverse | value changed after Save, date shifted | TC-043, TC-056, TC-057, TC-058 |
| Unsaved changes and leaving (undo by hand, leave, reload, tabs, view page) | State change | edit lost or false warning | TC-044, TC-045, TC-046, TC-047, TC-048 |
| Grid habits (separator, filter, list in last rows, nothing highlighted, date month, paste, two panels, ends) | Field interaction | wrong value or list, misaligned rows | TC-049..TC-055, TC-059 |

## Categories (lessons-learned 1-9 and section 10)
1. Two people at once: not relevant, keyboard movement changes only the local draft until Save (Story: client-side working draft); the Save conflict is not part of this Story.
2. Filter + Sort + Search: not relevant, none of the four tables has them in this Story.
3. Old data after migrations: relevant for Duplicate Work and existing rows, covered in TC-031 and TC-043.
4. Strange input: partly relevant, Thai input and Enter (TC-041), strange text kept by Tab commit (TC-023).
5. Reordering: relevant, Tab order must follow the visual order after a row is deleted or added (TC-039); drag reorder on Work Breakdown (TC-033).
6. Linked data: relevant, Manpower Mob Plan Demob Date locked until Onboard Date exists (TC-035).
7. Charts: not relevant, no chart in scope.
8. Same data on many pages: relevant, committed value must be the one saved and shown after reload (TC-043).
9. Matrix: relevant, the shortcut matrix is one expected table per page (TC-001..TC-004, TC-011..TC-014).
Section 10: L-1 sort (not relevant, no sorted list), L-2 filter choice kept (not relevant), L-3 wait for response (relevant to autocomplete list load, TC-028 waits for the list), L-4 multi-row paste (not relevant, paste not in Story; see Suggestion), L-5 collapse (relevant only for Manpower Mob Plan groups, TC-034 and Open question 7), L-6 case variants (not relevant), L-7 selected is not hover (focus outline is checked with the mouse away, TC-025), L-8 Story text changed (the Story is a frozen copy; re-check the Jira changelog before a real run).
Dirty state (design-techniques): TC-022. Message check (no other message): TC-042.

## Counts
High 33 / Medium 21 / Low 5 (59 cases). Auto 52 / Partial 6 / Manual 1 (TC-041).
Automation reason: key presses and focus position are checked by the computer (`document.activeElement`), the same result every run; Manual only for browser or person-judged items.

## Open questions (not repeated from analyst)
1. Does Enter inside the multi-line Task Description (Textarea) move down, or add a new line? The Story says move down; a textarea normally adds a line. TC-032 assumes move down, as written in the Story.
2. Which key reaches the first editable cell from outside the table, and does Shift+Tab from the first cell of row 1 really stay (the Story says yes: user cannot reach the page header by keyboard from the table)? Accessibility impact, ask BA.
3. Does a Job Owner have Create Work, Edit Work Breakdown, Edit Organic Crew rights, or only Manpower Mob Plan? The Pre-condition names "the appropriate edit permission". TC-037 uses a role without the permission; which role (TM / JO) lacks which right is needed.
4. An autocomplete (Resource Name) with typed text that matches nothing, then Tab: is the typed text kept, cleared, or does a message appear? TC-036 expects, as the user would call correct, that the unlisted text is not kept (assumed, not from the Story).
5. Empty mandatory cell and Tab: does the page show its normal validation message, and when (on leaving the cell or on Save)? TC-042 asserts focus moves and that at most the page's own single message shows.
6. Manpower Mob Plan: when Demob Date is locked (module doc: unlocked only after Onboard Date can be calculated), is the locked Demob Date skipped like a read-only cell, or does focus stop on it? TC-035.
7. Manpower Mob Plan collapsed group: does Tab skip the personnel rows of a collapsed group? Not written in the Story. TC-034 covers expanded groups only.
8. Fast key hold (auto-repeat) and IME composition Enter (Thai): expected result written as the user would call correct (one cell per press; composition Enter does not move), question to BA.
9. Suggestion (not in Story): Esc to cancel an edit, Ctrl+Z, paste behaviour inside a focused cell, Tab on the very first entry into the table from the header, and a visible shortcut hint on the page. Not written as cases.
10. Suggestion (not in Story): the Story says the date picker stays closed on navigation; how does the user open it from the keyboard (Space, Alt+Down)? Not written.
11. Wrap at the end: Create Work Tab on last cell of last row stays; is there a keyboard way to add a new row (user may expect Tab to add a row)? Not written, Story says stay.

## Test cases (59 flows)

### TC-001 [FE] Verify Tab and Shift+Tab move through the Work Details row in the strict order (POS) [Auto]
Precondition: common; Create Work page opened (Create Work > Manual Create), Work Details table has 2 rows filled in.
Priority: High
Trace: AC-1.1.1, AC-1.2.1, AC-3.1
1. Click the `Work Type` cell of row 1. -> The `Work Type` cell of row 1 has the focus.
2. Press Tab. -> Focus moves to `Work Number` of row 1.
3. Press Tab. -> Focus moves to `Job Description` of row 1.
4. Press Tab. -> Focus moves to `Platform` of row 1.
5. Press Tab. -> Focus moves to `Working Location (Deck)` of row 1.
6. Press Tab. -> Focus moves to `Working Location (X)` of row 1.
7. Press Tab. -> Focus moves to `Working Location (Y)` of row 1.
8. Press Shift+Tab. -> Focus moves back to `Working Location (X)` of row 1.
9. Press Shift+Tab. -> Focus moves back to `Working Location (Deck)` of row 1.
Starting data: a Create Work page with 2 rows. What to check: the focused field name after each key. Test data set: expected-order table below, the test loops over it. Clean up: leave the page without saving. 
Expected order table: Key sequence | Start | Expected focus. Tab x1: Work Type -> Work Number; Tab x2 -> Job Description; Tab x3 -> Platform; Tab x4 -> Working Location (Deck); Tab x5 -> Working Location (X); Tab x6 -> Working Location (Y); Shift+Tab from Y -> X.

### TC-002 [FE] Verify Tab and Shift+Tab follow the strict order in the Edit Work Breakdown table (POS) [Auto]
Precondition: common; Edit Work Breakdown page (View Work Details > Edit Breakdown) with 2 breakdown tasks.
Priority: High
Trace: AC-1.1.1, AC-1.2.1, AC-4.1
1. Click the `Task Description` cell of row 1. -> The `Task Description` cell of row 1 has the focus.
2. Press Tab. -> Focus moves to `Priority` of row 1.
3. Press Tab. -> Focus moves to `Working Location (Deck)` of row 1.
4. Press Tab. -> Focus moves to `Working Location (X)` of row 1.
5. Press Tab. -> Focus moves to `Working Location (Y)` of row 1.
6. Press Tab. -> Focus moves to `Manpower Resource` of row 1.
7. Press Shift+Tab. -> Focus moves back to `Working Location (Y)` of row 1.
Starting data: a Work with 2 breakdown tasks. What to check: focused field name after each key. Test data set: order table (Task Description, Priority, Deck, X, Y, Manpower Resource). Clean up: leave without saving.

### TC-003 [FE] Verify Tab and Shift+Tab follow Name, Mob Date, Demob Date in the Manpower Mob Plan personnel row (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active page, a Resource group expanded with 2 personnel rows with `Mob Date` and `Demob Date`.
Priority: High
Trace: AC-1.1.1, AC-1.2.1, AC-5.1, AC-5.2
1. Click the `Name` cell of personnel row 1. -> The `Name` cell has the focus.
2. Press Tab. -> Focus moves to `Mob Date` of the same row.
3. Press Tab. -> Focus moves to `Demob Date` of the same row, `Onboard Date` is not focused.
4. Press Shift+Tab. -> Focus moves back to `Mob Date`, `Onboard Date` is not focused.
Starting data: personnel rows with Mob and Demob dates. What to check: focused field. Clean up: leave without saving.

### TC-004 [FE] Verify Tab and Shift+Tab follow Resource Name, Working Schedule, Quantity in Edit Organic Crew (POS) [Auto]
Precondition: common; Edit Organic Crew page with 2 rows.
Priority: High
Trace: AC-1.1.1, AC-1.2.1, AC-6.1
1. Click the `Resource Name` cell of row 1. -> The `Resource Name` cell has the focus.
2. Press Tab. -> Focus moves to `Working Schedule` of row 1.
3. Press Tab. -> Focus moves to `Quantity` of row 1.
4. Press Shift+Tab. -> Focus moves back to `Working Schedule` of row 1.
Starting data: 2 crew rows. What to check: focused field. Clean up: leave without saving.

### TC-005 [FE] Verify Tab on Working Location (Y) goes to Work Type of the next row and skips Delete (POS) [Auto]
Precondition: common; Create Work page, Work Details table with 2 rows.
Priority: High
Trace: AC-1.1.2, AC-3.2, AC-1.5
1. Click `Working Location (Y)` of row 1. -> The `Working Location (Y)` cell of row 1 has the focus.
2. Press Tab. -> Focus moves to `Work Type` of row 2; the Delete trash icon of row 1 is not focused.
3. Press Shift+Tab. -> Focus moves back to `Working Location (Y)` of row 1.
Starting data: 2 rows. Check: focused element is the cell input, not the Delete button. Clean up: leave without saving.

### TC-006 [FE] Verify Tab on Manpower Resource goes to Task Description of the next task and skips the handle and Delete (POS) [Auto]
Precondition: common; Edit Work Breakdown page with 2 tasks.
Priority: High
Trace: AC-1.1.2, AC-1.2.2, AC-4.2, AC-4.3, AC-4.4
1. Click `Manpower Resource` of task 1. -> The `Manpower Resource` cell of task 1 has the focus.
2. Press Tab. -> Focus moves to `Task Description` of task 2; the Delete icon of task 1 and the drag handle `:::` of task 2 are not focused.
3. Press Shift+Tab. -> Focus moves to `Manpower Resource` of task 1.
Starting data: 2 tasks. Clean up: leave without saving.

### TC-007 [FE] Verify Tab on Demob Date wraps to the next personnel row and to the next Resource group (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, Resource group A with 2 personnel rows, then Resource group B with at least 1 personnel row, both expanded.
Priority: High
Trace: AC-1.1.2, AC-1.2.2, AC-5.3
1. Click `Demob Date` of personnel row 1 in group A. -> That cell has the focus.
2. Press Tab. -> Focus moves to `Name` of personnel row 2 in group A.
3. Click `Demob Date` of the last personnel row in group A. -> That cell has the focus.
4. Press Tab. -> Focus moves to `Name` of the first personnel row in group B; no category summary row is focused.
5. Press Shift+Tab. -> Focus moves back to `Demob Date` of the last personnel row in group A.
Starting data: two groups with personnel. Clean up: leave without saving.

### TC-008 [FE] Verify Tab on Quantity wraps to Resource Name of the next row and Shift+Tab goes back (POS) [Auto]
Precondition: common; Edit Organic Crew with 2 rows.
Priority: High
Trace: AC-1.1.2, AC-1.2.2, AC-6.2, AC-6.3
1. Click `Quantity` of row 1. -> The `Quantity` cell has the focus.
2. Press Tab. -> Focus moves to `Resource Name` of row 2; the Delete icon is not focused.
3. Press Shift+Tab. -> Focus moves to `Quantity` of row 1.
Clean up: leave without saving.

### TC-009 [FE] Verify Tab on the last field of the last row keeps focus in place on all four tables (BND) [Auto]
Precondition: common; each of the four pages opened in turn.
Priority: High
Trace: AC-1.1.3
1. Click the last editable field of the last row (Work Details: `Working Location (Y)`; Work Breakdown: `Manpower Resource`; Manpower Mob Plan: `Demob Date` of the last personnel row of the last group; Organic Crew: `Quantity`). -> That cell has the focus.
2. Press Tab. -> Focus stays on the same cell; it does not move to the page footer, buttons or browser address bar.
3. Press Tab again. -> Focus still stays on the same cell.
Test data set: 4 pages x last cell. Loop over the table. Clean up: leave without saving.

### TC-010 [FE] Verify Shift+Tab on the first field of the first row keeps focus in place on all four tables (BND) [Auto]
Precondition: common; each of the four pages opened in turn.
Priority: High
Trace: AC-1.2.3
1. Click the first editable field of row 1 (`Work Type`, `Task Description`, `Name` of the first personnel row, `Resource Name`). -> That cell has the focus.
2. Press Shift+Tab. -> Focus stays on the same cell; header controls do not get the focus.
3. Press Shift+Tab again. -> Focus still stays on the same cell.
Test data set: 4 pages x first cell. Clean up: leave without saving.

### TC-011 [FE] Verify Enter and Shift+Enter move to the same column in the next and previous row in Work Details (POS) [Auto]
Precondition: common; Create Work page, Work Details with 3 rows.
Priority: High
Trace: AC-1.3.1, AC-1.4.1, AC-3.4
1. Click `Job Description` of row 2. -> The cell has the focus.
2. Press Enter. -> Focus moves to `Job Description` of row 3.
3. Press Shift+Enter. -> Focus moves to `Job Description` of row 2.
4. Press Shift+Enter. -> Focus moves to `Job Description` of row 1.
Test data set: one column per run (Work Type, Work Number, Job Description, Platform, Deck, X, Y); loop. Clean up: leave without saving.

### TC-012 [FE] Verify Enter and Shift+Enter keep the column in Edit Work Breakdown (POS) [Auto]
Precondition: common; Edit Work Breakdown with 3 tasks.
Priority: High
Trace: AC-1.3.1, AC-1.4.1, AC-4.5
1. Click `Task Description` of task 2 and press Tab. -> Focus moves to `Priority` of task 2; the list is closed.
2. Press Enter. -> Focus moves to `Priority` of task 3.
3. Press Shift+Enter. -> Focus moves to `Priority` of task 2.
Test data set: columns Task Description, Priority, Deck, X, Y, Manpower Resource. Clean up: leave without saving.

### TC-013 [FE] Verify Enter and Shift+Enter move between personnel rows in the same column (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, one group with 3 personnel rows.
Priority: High
Trace: AC-1.3.1, AC-1.4.1, AC-5.4
1. Click `Mob Date` of personnel row 2. -> The cell has the focus.
2. Press Enter. -> Focus moves to `Mob Date` of personnel row 3.
3. Press Shift+Enter. -> Focus moves to `Mob Date` of personnel row 2.
Test data set: columns Name, Mob Date, Demob Date. Clean up: leave without saving.

### TC-014 [FE] Verify Enter and Shift+Enter keep the column in Edit Organic Crew (POS) [Auto]
Precondition: common; Edit Organic Crew with 3 rows.
Priority: High
Trace: AC-1.3.1, AC-1.4.1, AC-6.4
1. Click `Working Schedule` of row 2. -> The cell has the focus.
2. Press Enter. -> Focus moves to `Working Schedule` of row 3.
3. Press Shift+Enter. -> Focus moves to `Working Schedule` of row 2.
Test data set: Resource Name, Working Schedule, Quantity. Clean up: leave without saving.

### TC-015 [FE] Verify Enter in the bottom row keeps focus in the same cell (BND) [Auto]
Precondition: common; each of the four pages.
Priority: High
Trace: AC-1.3.2
1. Click any editable field of the bottom row (use `Job Description`, `Priority`, `Mob Date`, `Quantity`). -> That cell has the focus.
2. Press Enter. -> Focus stays on the same cell; no new row is added.
Test data set: 4 pages x one column. Clean up: leave without saving.

### TC-016 [FE] Verify Shift+Enter in the top row keeps focus in the same cell (BND) [Auto]
Precondition: common; each of the four pages.
Priority: High
Trace: AC-1.4.2
1. Click any editable field of row 1 (use `Job Description`, `Priority`, `Mob Date` of the first personnel row, `Quantity`). -> That cell has the focus.
2. Press Shift+Enter. -> Focus stays on the same cell.
Test data set: 4 pages x one column. Clean up: leave without saving.

### TC-017 [FE] Verify a table with one row only: all four keys keep focus where it sensible (BND) [Auto]
Precondition: common; Edit Organic Crew with exactly 1 row.
Priority: Medium
Trace: AC-1.1.3, AC-1.2.3, AC-1.3.2, AC-1.4.2
1. Click `Working Schedule` of the only row. -> The cell has the focus.
2. Press Enter. -> Focus stays on `Working Schedule`.
3. Press Shift+Enter. -> Focus stays on `Working Schedule`.
4. Press Tab. -> Focus moves to `Quantity`.
5. Press Tab. -> Focus stays on `Quantity`.
6. Click `Resource Name`. -> The cell has the focus.
7. Press Shift+Tab. -> Focus stays on `Resource Name`.
Clean up: leave without saving.

### TC-018 [FE] Verify Delete icons are never focused by Tab or Shift+Tab on all four tables (NEG) [Auto]
Precondition: common; each page with 3 rows.
Priority: High
Trace: AC-1.5
1. Press Tab from the first cell through the whole table until the last cell of row 2. -> The focused element is always an editable cell; the trash icon is never the active element.
2. Press Shift+Tab back to the first cell. -> The trash icon is never the active element.
3. Count the rows. -> The row count is the same as before (nothing was deleted).
Clean up: leave without saving.

### TC-019 [FE] Verify the drag handle in Edit Work Breakdown is not reached and rows are not reordered by keys (NEG) [Auto]
Precondition: common; Edit Work Breakdown with 3 tasks. Record the task order.
Priority: Medium
Trace: AC-1.5, AC-4.2
1. Click `Task Description` of task 2. -> The cell has the focus.
2. Press Shift+Tab. -> Focus moves to `Manpower Resource` of task 1; the handle `:::` of task 2 is not focused.
3. Press Enter and Shift+Enter several times. -> Focus moves between cells only; the order of tasks is the same as recorded.
Clean up: leave without saving.

### TC-020 [FE] Verify Onboard Date, the daily schedule cells and category summary rows are skipped (NEG) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, group with 2 personnel rows and a daily schedule grid on the right.
Priority: Medium
Trace: AC-1.5, AC-5.2, AC-5.5
1. Click `Name` of personnel row 1. -> The cell has the focus.
2. Press Tab 6 times. -> Focus goes Mob Date, Demob Date, Name (row 2), Mob Date, Demob Date, then Name of the next row or group; `Onboard Date`, timeline cells and summary rows are never focused.
Clean up: leave without saving.

### TC-021 [FE] Verify a typed value is kept after each of the four keys (POS) [Auto]
Precondition: common; Create Work page, Work Details with 3 rows.
Priority: High
Trace: AC-2.1
1. Click `Job Description` of row 2 and type `Pump check A`. -> The cell shows `Pump check A`.
2. Press Tab. -> Focus moves on; `Job Description` of row 2 shows `Pump check A`.
3. Press Shift+Tab. -> Focus returns to `Job Description`; it shows `Pump check A`.
4. Type `Pump check B` and press Enter. -> Focus moves to row 3; row 2 shows `Pump check B`.
5. Press Shift+Enter, type `Pump check C`, press Shift+Tab. -> Row 2 shows `Pump check C` after focus leaves.
Test data set: 4 keys x text cell. Clean up: leave without saving.

### TC-022 [FE] Verify moving through cells without editing does not make the page changed (NEG) [Auto]
Precondition: common; Edit Organic Crew opened, Save is disabled (or the page shows no change).
Priority: Medium
Trace: AC-2.1
1. Press Tab through all cells of row 1 and Enter to row 2. -> Focus moves.
2. Check the Save button. -> Save stays in the same state as before (disabled).
3. Click the breadcrumb. -> The page leaves without an "unsaved changes" warning.
4. Open the page again and press Tab once. -> Focus moves; Save stays disabled.
5. Click the browser Back button. -> The page leaves without an "unsaved changes" warning.
6. Open the page again, type a character in `Quantity`, delete it by hand, press Tab. -> Save is not enabled by the undone change (user view: nothing to save).
Question: see Open question about undo; the expected result is the user's view.
Clean up: none.

### TC-023 [FE] Verify strange text in a text cell is committed unchanged when leaving by keyboard (BND) [Partial: values checked on screen only]
Precondition: common; Create Work, Work Details row 1.
Priority: Low
Trace: AC-2.1
1. Type `Test & <b>x</b> 100% "q" #1 สวัสดี` into `Job Description`. -> The cell shows the same text.
2. Press Tab. -> Focus moves on; the cell still shows the same text, nothing is cut or changed.
3. Press Shift+Tab. -> The text is still the same and fully selected.
Use only values the screen lets the user type. Clean up: leave without saving.

### TC-024 [FE] Verify focus on a text cell selects all text and typing overwrites it (POS) [Auto]
Precondition: common; Create Work, Work Details with `Work Number` and `Job Description` filled.
Priority: High
Trace: AC-2.2
1. Click `Work Number` of row 1. -> The cell has the focus.
2. Press Tab. -> Focus moves to `Job Description`; all the text in it is highlighted.
3. Type `New text`. -> The old text is gone; the cell shows `New text`.
4. Press Shift+Tab, then Tab. -> Focus returns to `Job Description`; all the text is highlighted again.
5. Press Right arrow. -> The highlight goes and the cursor is at the end; the user can edit in place.
6. Press Enter, then Shift+Enter. -> Focus moves to `Job Description` of the next row, then back to row 1; after each move all the text of the cell is highlighted.
7. Type `Overwrite 2`. -> The old text is gone; the cell shows `Overwrite 2` (selection works after Enter and Shift+Enter, not only after Tab).
Test data set: text cells of all four pages (Job Description, Task Description, Name, Resource Name). Clean up: leave without saving.

### TC-025 [FE] Verify dropdown, autocomplete and chip cells get focus closed with a focus outline (POS) [Partial: outline colour checked by eye]
Precondition: common; the mouse pointer is parked away from the table.
Priority: Medium
Trace: AC-2.3.1
1. Click `Job Description` of Work Details row 1 and press Tab. -> Focus moves to `Platform`.
2. Look at `Platform`. -> The dropdown list is closed; a 2px blue focus outline is visible on the cell.
3. Press Tab. -> `Working Location (Deck)` is focused, list closed, with the outline.
4. Go to Edit Work Breakdown, click `Task Description`, press Tab. -> `Priority` is focused, closed, outline visible.
5. Press Tab 3 times to a Working Location chip cell. -> The chip cell is focused, closed, with the outline.
6. Go to Edit Organic Crew, click `Resource Name`, press Tab. -> `Working Schedule` is focused, closed, with the outline.
Check by script: list not open (`aria-expanded` false); outline by eye. Clean up: leave without saving.

### TC-026 [FE] Verify Tab and Shift+Tab select the highlighted option of an open dropdown and move (POS) [Auto]
Precondition: common; Create Work, Work Details row 1.
Priority: High
Trace: AC-2.3.2, AC-1.1.1, AC-1.2.1
1. Click `Platform` of row 1. -> The list opens.
2. Press Down arrow to highlight the second option. -> That option is highlighted.
3. Press Tab. -> The option is selected and shown in the cell; the list closes; focus moves to `Working Location (Deck)`.
4. Click `Platform` again and highlight another option. -> The list opens, the option is highlighted.
5. Press Shift+Tab. -> The option is selected; the list closes; focus moves to `Job Description`.
Test data set: Platform, Priority, Working Schedule, Resource Name (autocomplete). Clean up: leave without saving.

### TC-027 [FE] Verify Enter selects the option, a second Enter moves down, and Enter on a closed dropdown moves down (POS) [Auto]
Precondition: common; Edit Work Breakdown with 3 tasks.
Priority: High
Trace: AC-2.3.2, AC-1.3.1
1. Click `Priority` of task 1. -> The list opens.
2. Press Down arrow to highlight an option, then press Enter. -> The option is selected and shown; the list closes; focus stays on `Priority` of task 1.
3. Press Enter. -> Focus moves to `Priority` of task 2.
4. Press Enter again while the list of task 2 is closed. -> Focus moves to `Priority` of task 3 (closed list moves down directly).
Clean up: leave without saving.

### TC-028 [FE] Verify an open autocomplete list in Edit Organic Crew commits on Tab and on Enter (POS) [Auto]
Precondition: common; Edit Organic Crew with 3 rows; resource names exist in the master list.
Priority: High
Trace: AC-2.3.2
1. Click `Resource Name` of row 1 and type the first letters of a listed name. -> After the option list has loaded, the list shows matching options.
2. Press Down arrow to highlight an option, then Tab. -> The option is saved in the cell; list closes; focus moves to `Working Schedule`.
3. Click `Resource Name` of row 2, type the first letters, highlight an option and press Enter. -> The option is selected; list closes; focus stays on the cell.
4. Press Enter. -> Focus moves to `Resource Name` of row 3 (exactly one row down, not two).
Wait for the list response before checking the options. Clean up: leave without saving.

### TC-029 [FE] Verify the four keys on a date cell do not open the calendar (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, group with 3 personnel rows with dates.
Priority: High
Trace: AC-2.4, AC-1.1.1, AC-1.2.1, AC-1.3.1, AC-1.4.1
1. Click `Name` of personnel row 2 and press Tab. -> Focus moves to `Mob Date`; the calendar is not open; the cell shows the focus outline.
2. Press Tab. -> Focus moves to `Demob Date`; no calendar opens.
3. Press Shift+Tab. -> Focus moves back to `Mob Date`; no calendar opens.
4. Press Enter. -> Focus moves to `Mob Date` of row 3; no calendar opens.
5. Press Shift+Enter. -> Focus moves to `Mob Date` of row 2; no calendar opens.
Check: no calendar popup in the page. Clean up: leave without saving.

### TC-030 [FE] Verify the date value stays the same after the date cell is passed by keyboard (NEG) [Auto]
Precondition: common; personnel row with `Mob Date` and `Demob Date`. Record both values.
Priority: High
Trace: AC-2.4, AC-2.1
1. Press Tab and Shift+Tab through `Mob Date` and `Demob Date` of the row. -> Focus moves; the calendar does not open.
2. Compare both dates with the recorded values. -> Both dates are exactly the same, no day shift.
Clean up: leave without saving.

### TC-031 [FE] Verify the same order and keys work on Duplicate Work with copied rows (POS) [Auto]
Precondition: common; an existing Work with Work Details data; Worklist > Duplicate Work (page title `Create Work`, address contains `mode=duplicate`).
Priority: Medium
Trace: AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-P
1. Open Duplicate Work for the Work. -> The Create Work page opens with the copied values in Work Details.
2. Click `Work Type` of row 1 and press Tab 7 times. -> Focus goes Work Number, Job Description, Platform, Deck, X, Y, then `Work Type` of the next row (or stays on Y if one row).
3. Press Shift+Tab. -> Focus moves back to `Working Location (Y)` of the previous row, or stays when on row 1.
4. Press Enter. -> Focus moves to the same column in the row below, or stays on the bottom row.
Clean up: leave without saving.

### TC-032 [FE] Verify Enter in the multi-line Task Description moves down (POS) [Manual: Story and browser default may conflict, BA answer needed]
Precondition: common; Edit Work Breakdown with 3 tasks.
Priority: High
Trace: AC-1.3.1, AC-4.5
1. Click `Task Description` of task 1 and type `Line one`. -> The text shows in the cell.
2. Press Enter. -> Focus moves to `Task Description` of task 2; no new line is added in task 1.
3. Press Shift+Enter. -> Focus moves back to `Task Description` of task 1; no new line is added in task 2.
4. Check task 1 text. -> It is still `Line one`.
Clean up: leave without saving.

### TC-033 [FE] Verify Tab, Enter and chips in Manpower Resource and Deck/X/Y chip cells (POS) [Auto]
Precondition: common; Edit Work Breakdown with 2 tasks; task 1 has chips in `Working Location (Deck)` and `Manpower Resource` with quantities.
Priority: High
Trace: AC-4.1, AC-2.3.1, AC-2.3.2, AC-1.3.1
1. Click the `Working Location (Deck)` cell of task 1. -> The chips show.
2. Open the chip list, highlight an option not yet chosen and press Tab. -> The chip is added; the list closes; focus moves to `Working Location (X)`.
3. Click `Manpower Resource` of task 1 and press Enter. -> Focus moves to `Manpower Resource` of task 2; the chips and quantities of task 1 are unchanged.
4. Press Shift+Enter. -> Focus moves back to `Manpower Resource` of task 1.
5. Press Tab. -> Focus moves to `Task Description` of task 2, not into a chip quantity input of task 1; the chips and quantities of task 1 are unchanged.
6. Press Shift+Tab. -> Focus moves to `Manpower Resource` of task 1, not into a chip quantity input.
7. Press Shift+Tab. -> Focus moves to `Working Location (Y)` of task 1; its chips are unchanged.
8. Open the `Working Location (X)` chip list of task 1, highlight an option not yet chosen and press Enter. -> The chip is added and the list closes; focus stays on the cell.
9. Press Enter. -> Focus moves to `Working Location (X)` of task 2; the added chip stays in task 1.
10. Open the chip list of task 2, highlight an option and press Shift+Enter. -> The chip is added to task 2; the list closes; focus moves to `Working Location (X)` of task 1.
Clean up: leave without saving.

### TC-034 [FE] Verify keyboard movement across several Resource groups and group edges (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active with 3 groups; group 2 has exactly 1 personnel row.
Priority: Medium
Trace: AC-5.3, AC-5.4
1. Click `Demob Date` of the only personnel row in group 2. -> The cell has the focus.
2. Press Tab. -> Focus moves to `Name` of the first personnel row of group 3.
3. Press Shift+Tab. -> Focus returns to `Demob Date` of the personnel row in group 2.
4. Press Shift+Tab twice. -> Focus goes to `Mob Date`, then `Name` of the same row.
5. Press Shift+Tab. -> Focus moves to `Demob Date` of the last personnel row in group 1.
6. Click `Name` of the only row in group 2 and press Enter. -> Focus stays in the same cell or moves to the row below as the page defines for a group edge; record the behaviour.
Note: Enter between groups is not defined in the Story (Open question 7); step 6 only records the result.
Clean up: leave without saving.

### TC-035 [FE] Verify Demob Date that is locked does not trap or break the keyboard chain (NEG) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, a personnel row with `Mob Date` empty (`Demob Date` locked, as the module notes show).
Priority: Medium
Trace: AC-5.1, AC-5.2
1. Click `Name` of that row and press Tab. -> Focus moves to `Mob Date`.
2. Press Tab. -> Focus moves to `Name` of the next personnel row; the locked `Demob Date` is skipped like the read-only `Onboard Date`.
3. Press Tab again. -> Focus does not get stuck; it keeps moving along the table.
4. Press Shift+Tab. -> Focus moves back to `Mob Date` of that row (the same cells are skipped backwards).
Expected as the user would call correct: a locked cell cannot be typed in, so Tab skips it; assumed, not from the Story (Open question 6).
Clean up: leave without saving.

### TC-036 [FE] Verify a typed autocomplete text that matches nothing then Tab (NEG) [Auto]
Precondition: common; Edit Organic Crew, row 1.
Priority: Medium
Trace: AC-2.1, AC-2.3.2, AC-6.1
1. Click `Resource Name` and type `zzzz`. -> The list shows no match.
2. Press Tab. -> Focus moves to `Working Schedule`; the `Resource Name` cell shows the value it had before typing (or empty if it was empty); `zzzz` is not kept as a resource name.
3. Press Shift+Tab. -> Focus returns to `Resource Name`; the cell shows the same as in step 2.
Clean up: leave without saving.

### TC-037 [FE] Verify a user without the edit permission cannot edit or move through the cells (NEG) [Auto]
Precondition: login as a role without the edit permission of the page (see Open question 3); open the page view.
Priority: High
Trace: AC-P
1. Open the target page as that role. -> The page is read-only or opens with no editable cells (as the page does today).
2. Press Tab several times. -> No cell becomes editable; no text can be typed; focus does not enter an edit field.
3. Open the Create Work address directly. -> The page shows the page's normal no-access result (no editable table).
Test data set: role x page. Clean up: none.

### TC-038 [FE] Verify focus scrolls the cell into view in a long table (POS) [Partial: look needed to judge scroll]
Precondition: common; table with 30 rows (more than the screen shows).
Priority: Medium
Trace: AC-1.3.1, AC-1.1.2
1. Click the cell in row 1 and press Enter 25 times. -> Focus is on row 26 and the cell is visible on the screen.
2. Press Shift+Enter 25 times. -> Focus is back on row 1 and visible.
3. Press Tab at the end of a visible row near the bottom edge. -> The next row is focused and visible, not hidden under the footer.
Clean up: leave without saving.

### TC-039 [FE] Verify keyboard order after a row is added and after a row in the middle is deleted (NEG) [Auto]
Precondition: common; Create Work Work Details with 3 rows.
Priority: Medium
Trace: AC-1.1.2, AC-1.2.2, AC-3.2
1. Delete row 2 with its Delete icon. -> The table shows 2 rows.
2. Click `Working Location (Y)` of row 1 and press Tab. -> Focus moves to `Work Type` of the old row 3, now row 2.
3. Add a row with `Add Work`. -> The table shows 3 rows.
4. Click `Working Location (Y)` of row 2 and press Tab. -> Focus moves to `Work Type` of the new row 3.
Clean up: leave without saving.

### TC-040 [FE] Verify pressing Tab quickly many times moves exactly one cell per press (BND) [Partial: speed is hard to script]
Precondition: common; Edit Organic Crew with 3 rows.
Priority: Low
Trace: AC-1.1.1, AC-1.1.2
1. Click `Resource Name` of row 1. -> The cell has the focus.
2. Press Tab 7 times as fast as possible. -> Focus is on `Working Schedule` of row 3 (3 cells per row: 7 moves from row 1 cell 1 go to row 3 cell 2); no cell is skipped or visited twice.
Clean up: leave without saving.

### TC-041 [FE] Verify Enter while typing Thai with an input method does not move the cell (NEG) [Manual: needs real Thai input method]
Precondition: common; Create Work, Work Details row 1; Thai input method on.
Priority: Low
Trace: AC-1.3.1
1. Click `Job Description` and type Thai letters with the input method, leaving the text underlined (not finished). -> The underlined text shows.
2. Press Enter to finish the word. -> The word is finished in the cell; focus stays on the same cell.
3. Press Enter again. -> Focus moves to `Job Description` of the next row.
Expected as the user would call correct (Open question 8). Clean up: leave without saving.

### TC-042 [FE] Verify leaving an empty required cell by keyboard shows at most the normal single message and does not trap focus (NEG) [Auto]
Precondition: common; Create Work, Work Details row 1 with `Work Number` empty (required).
Priority: Medium
Trace: AC-1.1.1, AC-2.1
1. Click `Work Number` and press Tab. -> Focus moves to `Job Description`.
2. Look at the `Work Number` cell. -> The cell shows the page's own required-field result, one message only, no second or third message stacked on it.
3. Press Shift+Tab. -> Focus returns to `Work Number`; still one message only.
Question: when the message appears (Open question 5). Clean up: leave without saving.

### TC-043 [FE] Verify values entered with the keyboard are saved and unchanged after reload (POS) [Auto]
Precondition: common; Edit Manpower Mob Plan (Worklist Active) personnel row with `Name`, `Mob Date`, `Demob Date`; record every value of the other rows.
Priority: High
Trace: AC-2.1, AC-5.1, AC-6.1
1. Click `Name`, type `Somchai Test`, press Tab. -> `Name` shows `Somchai Test`; focus on `Mob Date`.
2. Press Tab, press Enter, then Shift+Enter. -> Focus moves with no change to the dates.
3. Click Save. -> The page confirms the save as it does today.
4. Reload the page. -> `Name` shows `Somchai Test`; `Mob Date` and `Demob Date` show the recorded dates; every value of the untouched rows is the same as recorded.
Test data set: also repeat on Edit Organic Crew (`Quantity`) and Work Details. Clean up: restore the original name.

### TC-044 [FE] Verify a dropdown or chip value changed by keyboard and put back by hand leaves nothing to save (NEG) [Auto]
Precondition: common; Edit Organic Crew with a row that has `Working Schedule` set; Save is disabled.
Priority: Medium
Trace: AC-2.1, AC-2.3.2
1. Record the current `Working Schedule` value of row 1. -> The value is written down for comparison.
2. Click `Resource Name` of row 1 and press Tab. -> Focus moves to `Working Schedule`; the list is closed.
3. Open the list, highlight a different option and press Tab. -> The new option is shown in the cell; Save is enabled.
4. Click `Working Schedule` of row 1, choose the recorded value with the mouse. -> The cell shows the recorded value again.
5. Check the Save button. -> Save is disabled again (nothing to save; user view).
Clean up: leave without saving.

### TC-045 [FE] Verify leaving or reloading after a real keyboard edit shows the unsaved-changes warning (NEG) [Auto]
Precondition: common; Edit Organic Crew with 2 rows.
Priority: High
Trace: AC-2.1
1. Click `Quantity` of row 1, type a different number and press Tab. -> The cell shows the new number; Save is enabled.
2. Click the breadcrumb. -> The page shows the unsaved-changes warning; the user can stay.
3. Choose to stay. -> The page stays and the new number is still shown.
4. Click the browser Back button. -> The page shows the unsaved-changes warning or stays on the page; the edit is not lost silently.
5. Reload the page. -> The browser or the page warns before leaving; if the user continues, the page shows the saved (old) number, not the unsaved one.
Test data set: also on Edit Work Breakdown and Create Work. Clean up: leave without saving.

### TC-046 [FE] Verify moving to another Manpower Mob Plan tab after a keyboard edit warns and does not carry the draft (NEG) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active with more than one tab (for example the Manpower Mob Plan tabs).
Priority: Medium
Trace: AC-2.1, AC-5.1
1. Click `Name` of a personnel row, type `Somchai Test` and press Tab. -> `Name` shows `Somchai Test`; Save is enabled.
2. Click another tab of the page. -> The page shows the unsaved-changes warning, or the tab changes and the edit is kept as a draft as the page does today; the edit is not lost silently.
3. Return to the first tab. -> If the user chose to leave, the `Name` shows the saved value, not `Somchai Test`; if the draft was kept, `Name` shows `Somchai Test` and Save is enabled.
Question: which of the two is correct is not in the Story; the check is that no edit is lost without a warning. Clean up: leave without saving.

### TC-047 [FE] Verify a role that cannot save can Tab through and leave without a warning (NEG) [Auto]
Precondition: login as the role without the edit permission (Open question 3); open the page view of Edit Organic Crew data.
Priority: Medium
Trace: AC-P, AC-2.1
1. Press Tab several times. -> No cell becomes editable; no text can be typed.
2. Click the breadcrumb. -> The page leaves with no unsaved-changes warning.
Clean up: none.

### TC-048 [FE] Verify an unsaved keyboard edit in Edit Work Breakdown is not shown on the View Work Details page or when the page is opened again (NEG) [Auto]
Precondition: common; Edit Work Breakdown (View Work Details > Edit Breakdown) with 2 tasks.
Priority: High
Trace: AC-4.1, AC-2.1
1. Record the `Task Description` of task 1. -> The value is written down.
2. Click `Task Description` of task 1, type `Draft text` and press Tab. -> The cell shows `Draft text`; focus moves to `Priority`.
3. Click the breadcrumb to View Work Details and choose to leave. -> View Work Details opens and shows the recorded description, not `Draft text`.
4. Click `Edit Breakdown`. -> Edit Work Breakdown opens and shows the recorded description in task 1.
5. Open `Duplicate Work` for the same Work. -> The Work Details table opens in the Duplicate Work page and Tab follows the order Work Type, Work Number, Job Description from row 1.
Clean up: leave without saving.

### TC-049 [FE] Verify a large Quantity typed by keyboard is shown with the page's thousand separator after leaving the cell (BND) [Auto]
Precondition: common; Edit Organic Crew with 2 rows.
Priority: Low
Trace: AC-2.1, AC-6.1
1. Click `Quantity` of row 1 and type `1234567`. -> The cell shows `1234567` while typing.
2. Press Tab. -> The value is committed; the cell shows the number with the separator the page uses for saved numbers (`1,234,567`); focus moves to `Resource Name` of row 2.
3. Press Shift+Tab. -> Focus returns to `Quantity` of row 1; all of the number is highlighted.
Use only digits the screen lets the user type. Clean up: leave without saving.

### TC-050 [FE] Verify typing in a focused dropdown filters the list and Tab selects the highlighted option (POS) [Auto]
Precondition: common; Create Work Work Details with 1 row, Edit Work Breakdown with 1 task.
Priority: Medium
Trace: AC-2.3.2, AC-2.1
1. Click `Job Description` and press Tab. -> Focus moves to `Platform`; the list is closed.
2. Type the first letters of a known platform. -> The list opens and shows only the options that match the letters.
3. Press Tab. -> The highlighted option is shown in `Platform`; focus moves to `Working Location (Deck)`.
Test data set: Platform, Priority, Working Schedule, Deck, X, Y; loop. Clean up: leave without saving.

### TC-051 [FE] Verify a dropdown list opens correctly in the last rows and after the page is scrolled (BND) [Partial: scroll position judged by eye]
Precondition: common; Edit Work Breakdown with 30 tasks.
Priority: Low
Trace: AC-2.3.2, AC-1.3.1
1. Click `Priority` of task 1 and press Enter 29 times. -> Focus is on `Priority` of task 30 and the cell is visible.
2. Press Down arrow in the cell. -> The list opens next to the cell and all options are visible, not cut off by the bottom of the screen.
3. Highlight an option and press Tab. -> The option is shown; the list closes; focus moves to `Working Location (Deck)` of task 30.
Clean up: leave without saving.

### TC-052 [FE] Verify Tab on an open list with nothing highlighted keeps the old value (NEG) [Auto]
Precondition: common; Edit Work Breakdown with a task whose `Priority` has a value.
Priority: Medium
Trace: AC-2.3.2, AC-2.1
1. Record the `Priority` of task 1. -> The value is written down.
2. Click `Priority` of task 1. -> The list opens with no option highlighted.
3. Press Tab. -> The list closes; `Priority` still shows the recorded value; focus moves to `Working Location (Deck)`.
Clean up: leave without saving.

### TC-053 [FE] Verify the date cell stays closed on keys, still opens by mouse and a picked date is committed (POS) [Auto]
Precondition: common; Manpower Mob Plan: Worklist Active, personnel row 1 with `Mob Date` empty and row 2 with `Mob Date` filled.
Priority: High
Trace: AC-2.4, AC-5.2
1. Click `Name` of row 1 and press Tab. -> Focus on `Mob Date`; the calendar is closed.
2. Click `Mob Date` of row 1 with the mouse. -> The calendar opens on the current month (the cell is empty).
3. Pick a day. -> The date is shown in `Mob Date`; the read-only `Onboard Date` follows the new date; the calendar closes.
4. Click `Mob Date` of row 2. -> The calendar opens on the month of the date in the cell.
5. Press Tab. -> The date in the cell is unchanged; focus moves to `Demob Date` of row 2; the calendar is closed.
Clean up: leave without saving.

### TC-054 [FE] Verify pasting text into a focused cell replaces the selected text and is committed on Tab (POS) [Auto]
Precondition: common; Create Work Work Details with `Job Description` filled.
Priority: Medium
Trace: AC-2.2, AC-2.1
1. Click `Work Number` and press Tab. -> Focus moves to `Job Description`; all text is highlighted.
2. Paste the text `Pasted text 01`. -> The old text is replaced; the cell shows `Pasted text 01`.
3. Place the cursor in the middle of the text and paste `ZZ`. -> The cell shows the text with `ZZ` inserted at the cursor.
4. Press Tab. -> The cell keeps the full text; focus moves to `Platform`.
Test data set: Job Description, Task Description, Name, Resource Name. Clean up: leave without saving.

### TC-055 [FE] Verify the personnel table and the daily schedule stay on the same rows when focus moves down a long list (BND) [Partial: row alignment judged by eye]
Precondition: common; Manpower Mob Plan: Worklist Active with more personnel rows than fit the screen.
Priority: Medium
Trace: AC-5.3, AC-5.5, AC-1.3.1
1. Click `Name` of personnel row 1 and press Enter until the last visible row is passed. -> The table scrolls; the focused row is visible.
2. Look at the daily schedule beside the table. -> The schedule rows scrolled with the table; each schedule row is on the same line as its personnel row.
3. Press Shift+Enter back to row 1. -> The table scrolls back; the schedule rows still match.
Clean up: leave without saving.

### TC-056 [FE] Verify strange text typed in Work Number, Task Description, Name and Resource Name is kept after Save and reload (BND) [Auto]
Precondition: common; Edit pages of Work Details, Work Breakdown, Manpower Mob Plan and Edit Organic Crew, one row each.
Priority: Medium
Trace: AC-2.1
1. Type `A&B <i>x</i> 50% "q" สวัสดี` in the text cell and press Tab. -> The cell shows the same text.
2. Click Save. -> The page confirms the save as it does today.
3. Reload the page. -> The cell shows the same text; nothing is cut, changed or shown as code.
Test data set: Work Number, Task Description, Name, Resource Name; loop. Use values the screen lets the user type. Clean up: restore the original value.

### TC-057 [FE] Verify values untouched by the keyboard in Edit Work Breakdown (chips, quantities) are the same after Save (POS) [Auto]
Precondition: common; Edit Work Breakdown with 2 tasks that have chips and quantities in Deck, X, Y and Manpower Resource; record all values.
Priority: High
Trace: AC-2.1, AC-4.1
1. Press Tab and Enter through every cell of both tasks without typing. -> Focus moves; Save stays disabled.
2. Change only `Task Description` of task 1 by keyboard and press Tab. -> Save is enabled.
3. Click Save. -> The page confirms the save as it does today.
4. Reload the page. -> The new description shows; every chip, quantity and other value is the same as recorded.
Clean up: restore the original description.

### TC-058 [FE] Verify fixed-list values chosen by keyboard are shown where the data is displayed (POS) [Auto]
Precondition: common; Edit Work Breakdown and Create Work with Platform, Priority and Working Schedule lists.
Priority: High
Trace: AC-2.3.2, AC-2.1
1. Choose a value in `Priority` with Down arrow and Tab. -> The value is shown in the cell.
2. Click Save. -> The page confirms the save as it does today.
3. Open View Work Details of the Work. -> `Priority` of the task shows the chosen value.
4. Open the Worklist and find the Work. -> The Worklist shows the same Platform and Work data as saved.
5. Open Event Details of the same event. -> The same value shows where Event Details displays it.
Test data set: Platform, Priority, Working Schedule, one run per option of each list. Clean up: restore the original values.

### TC-059 [FE] Verify after focus stays at a table end the opposite key still moves normally (BND) [Auto]
Precondition: common; Edit Organic Crew with 3 rows.
Priority: Medium
Trace: AC-1.1.3, AC-1.2.3, AC-1.3.2, AC-1.4.2
1. Click `Quantity` of row 3 and press Tab. -> Focus stays on `Quantity` of row 3.
2. Press Shift+Tab. -> Focus moves to `Working Schedule` of row 3.
3. Click `Resource Name` of row 1 and press Shift+Tab. -> Focus stays on `Resource Name` of row 1.
4. Press Tab. -> Focus moves to `Working Schedule` of row 1.
5. Click `Quantity` of row 3 and press Enter. -> Focus stays on `Quantity` of row 3.
6. Press Shift+Enter. -> Focus moves to `Quantity` of row 2.
Clean up: leave without saving.

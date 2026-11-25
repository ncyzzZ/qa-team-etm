# Draft test cases for ETM-7349

Story: ETM-7349 Shutdown Timeline - Weekly Actual Progress Tracking, Cumulative Variance Bars & Progress Commit
Source: `story.md` (frozen description and comments), `docs/modules/shutdown-timeline-validation.md`, `docs/modules/shutdown-timeline-default-plan.md`, `.claude/team/knowledge/`. No `analyst.md`, `inspector.md` or Figma was available for this run: AC ids below are numbered by the Story's own list (AC-1 = Status dropdown, AC-2 = weekly Actual entry, AC-3 = bar colours, AC-4 = validations, AC-5 = commit / concurrency / guard, AC-6 = field table, AC-7 = empty state, AC-8 = role matrix, AC-9 = cross-module isolation). Sub-items follow the Story numbering (AC-2.4 = Formatting rules, and so on).
Existing [QA] subtasks: not checked (no Jira access in this run).
Common precondition: The tester is logged in with a user who has `View Timeline` and `Update Progress and Note`. An active Shutdown Event is open on its `Timeline` tab. The Timeline has at least two Activity Groups, with several Activities that have a Start Date, End Date and weekly Plan (%), and one optional Activity without Start Date and End Date. Today (UTC+7) falls inside the displayed weeks, so there are past, current and future week columns. The tester records the current week column before starting.
Notation: `->` separates an action from its expected result. Texts, colours and messages are copied from the Story. "Current Week" is the week that contains today's date in UTC+7 (Asia/Bangkok).

## Think like the user (3 lines)
- Who: a Turnaround Manager updating progress every week, often several times a week, usually near a reporting deadline.
- Wants: type this week's (and catch-up past weeks') percentages quickly, see red or green, and press Update Progress once.
- Careless / rushed: pastes numbers from Excel with many decimals, types 105, clicks the dropdown by accident, switches tab or presses Refresh before committing, leaves two tabs open, a colleague changes the plan in between.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1.1 Status dropdown only on Activity rows | Screen states | Dropdown on Group or Total row | TC-001 |
| AC-1.2 Open / Close pill colours, Open default | Input groups | Wrong colour or default | TC-008, TC-009 |
| AC-1.3 Direct edit on Timeline, marks draft dirty | State changes, dirty state | Button not enabled | TC-010, TC-011 |
| AC-1.4 Status read-only in Edit Plan, disabled without permission | Roles | Edit possible where not allowed | TC-005, TC-002 |
| AC-2.1 Plan and Actual sub-rows | Screen states | Rows missing or swapped | TC-006 |
| AC-2.2 Past and current weeks editable, independent of plan | Boundary | Cannot record catch-up actual | TC-012, TC-013 |
| AC-2.3 Future weeks disabled and empty | Boundary, roles | Future entry allowed | TC-007, TC-014 |
| AC-2.4 1 decimal block, paste round, clamp 100, clear / invalid, zero anchoring | Input groups, boundary, matrix | Wrong stored value | TC-015 to TC-021 |
| AC-2.5 Editable only on Timeline for permitted users | Roles | Edit in Edit Plan | TC-005, TC-002 |
| AC-2.6 Task total, weekly totals, overall total, read-only, blank rule | Calculation | Wrong totals, blank vs 0.0 | TC-022 to TC-027 |
| AC-3 Bar presence (entry, blank with plan, no plan, future) | Condition table | Missing or extra bar | TC-028, TC-029 |
| AC-3 Cumulative Red / Green, blank as 0.0, equal is Green | Matrix, boundary | Wrong colour | TC-030, TC-031 |
| AC-3 Optional task always Green | Condition table | Red on undated task | TC-032 |
| AC-3 Total Progress row bar, Group rows without bars | Calculation | Wrong colour at total level | TC-033, TC-034 |
| AC-4.1 Over-plan warning, tooltip, non-blocking, both screens | Boundary | Warning missing / blocks save | TC-035, TC-036 |
| AC-4.2 Total over 100 error, tooltip, button disabled | Boundary | Over-limit commit | TC-037, TC-038 |
| AC-5.1 Button states | State changes | Wrong enable / disable | TC-039, TC-011 |
| AC-5.2 Commit persists, toast, dirty reset, failure toast | Effects and reverse | Data not saved | TC-040, TC-041, TC-042 |
| AC-5.2 Grid contraction deletes note without modal | Effects and reverse | Silent data loss or note kept | TC-043, TC-044 |
| AC-5.3 Plan has Been Changed modal | Two users | Overwrite newer plan | TC-045 |
| AC-5.4 Unsaved guard: tabs, Edit Plan, leave page, buttons | Dirty state, leaving and returning | Lost edits / false warning | TC-046 to TC-052 |
| AC-6 Field table (defaults, ranges, read-only) | Input groups | Default wrong | TC-022, TC-024, TC-053 |
| AC-7.1 First-time empty state (blank, not hyphen, total 0.0) | Screen states | Hyphen shown | TC-054 |
| AC-7.2 Group "No activity added." | Screen states | Inputs shown | TC-055 |
| AC-8.1 View Timeline: read-only | Roles | Edit possible | TC-002, TC-003 |
| AC-8.2 Update permission sees button | Roles | Button missing | TC-039 |
| AC-8.3 Hidden button, permission not role | Roles | Role used instead of permission | TC-002, TC-004 |
| AC-9 Cross-module isolation | Linked data | Worklist / Logic changed | TC-056 |
| Lesson L-4 paste: one cell, row, several cells, beyond target | Error guessing | Wrong cells change | TC-057 |
| Keyboard use (Tab, Enter, Esc) | Real-user view | Keyboard flow broken | TC-058 |
| Double click on Update Progress | Error guessing | Double save | TC-059 |
| Floating point sums (0.1 + 0.2) | Calculation | 0.30000000000000004 shown | TC-060 |
| Task total over 100 from several weeks | Boundary | Clamp or error where none exists | TC-061 |
| Same data on many pages (Daily Report, S-curve) | Lesson 8 | See skipped list | not planned (question) |
| Collapse / expand of Group persisted at commit | State changes | Wrong dirty or lost state | TC-062 |

Skipped categories / lessons (never silent):
1. Two people at once: relevant, TC-045 (plan changed) only. Two users both pressing Update Progress on actuals: Story is silent, see questions.
2. Filter + Sort + Search: not relevant, Timeline toolbar in the Story has no filter or search.
3. Old data after migrations: not relevant here, Story adds no migrated field. Open question on rows that exist from before this Story (default Status).
4. Strange input: relevant for number cells, TC-015 to TC-021 (emoji and text are covered as invalid input).
5. Reordering list: not relevant, Story has no reorder.
6. Linked data: partly relevant, TC-043 and TC-044 (milestone note), TC-056 (Worklist, Shutdown Logic).
7. Charts that depend on each other: relevant only for bars versus totals, TC-033.
8. Same data on many pages: Story states isolation only (AC-9), TC-056.
9. Matrix with conditions: relevant, bars (TC-030), rounding (TC-016), invalid input (TC-019).
L-1 text sort, L-2 filter kept, L-3 search wait, L-5 collapse per level, L-6 case variants, L-7 selected vs hover, L-8 Story changed: not relevant (no sort, filter, search or picker in this Story), except L-5 (TC-062) and L-8 (the frozen Story text was used; a rule changed later gets its own check).

Counts: 33 High / 22 Medium / 7 Low for TC-001 to TC-062, plus TC-063 to TC-078 added after bug-check (4 High / 8 Medium / 4 Low). 57 Auto / 15 Partial / 6 Manual in all.
Priority is chosen by damage (the Story gives none).

Automation notes: the weekly values, colours and totals are loop-friendly (data tables under TC-016, TC-019, TC-030). Cases that need a second user, a forced server failure, a date change at midnight UTC+7 or a visual colour judgement are Partial or Manual.

## Open questions (new, not in analyst.md)

1. Dirty state after undo: when the user changes a Status or an Actual value and then changes it back to the original value, should `[ Update Progress ]` return to disabled? TC-011 expects disabled (nothing to save) because that is what a user would call correct. Please confirm.
2. Does collapsing or expanding an Activity Group make the draft dirty (the Story says collapse state is saved at commit)? If yes, a user who only collapses a group gets the Unsaved Change modal on leaving. TC-062 records what is observed and needs the answer.
3. Current Week definition: is the week boundary Monday to Sunday or Sunday to Saturday, and does it follow the Bangkok clock when the user's computer is in another time zone? TC-013 and TC-014 need the boundary.
4. Multi-cell paste: Story only says a pasted value is rounded and clamped. Which cells receive values when several cells are pasted (first cell only, as for Plan % in ETM-8388, or a row, or a block), and are values that would land in future weeks ignored? TC-057 expects that no future week cell is filled.
5. Rounding of a paste with exactly 5 as the next digit (12.25, 12.35): round half up? TC-016 expects 12.3 and 12.4 (half up) as the user would calculate.
6. Pasted invalid values (negative, text): the Story says "reset the cell to blank". Does a pasted invalid value clear a cell that already had a value, or keep the old value? (For Plan % the Paste Validation Failed modal exists, but nothing is written for Actual.) TC-019 expects the cell to become blank.
7. Is `Update Progress` allowed when only the Task has over-plan warning (yes per AC-4.1) and when Total equals exactly 100.0 (yes per AC-5.1: `<= 100.0`)? Confirmed in text; no question, only listed for completeness.
8. Two users commit actual progress at the same time (no plan change): which one wins and does the second see a message? Story only covers "Plan has Been Changed".
9. What if the commit fails after some data was saved (Status saved, actuals not)? Is it all-or-nothing?
10. Activity rows that existed before this Story: is their default Status Open and their Actual blank?
11. Refresh from the toolbar: the Story says "attempting to commit progress (or refreshing) triggers a reload confirmation modal". Is there a Refresh button on the Timeline toolbar, or does this mean the browser refresh? TC-045 covers commit only.
12. (Bug-check round) Assumptions used in TC-063 to TC-078: collapse or expand alone is NOT a change (question 2); the week runs Monday to Sunday on the Bangkok clock (question 3); a pasted invalid value clears the cell (question 6); legacy rows default to Open and blank (question 10); a deleted Activity during editing gives the Plan has Been Changed modal (not stated, question 8 related). Each is flagged in its case.
12b. Where do the Total Progress weekly Plan values come from when an activity has no Start/End Date (blank)? Assumed blank.
13. Suggestion (not in Story): keyboard shortcut for Undo (Ctrl+Z) inside the actual cell. Not written as a case.
14. Suggestion (not in Story): the S-curve in Daily Report may use Actual progress; whether Timeline actuals feed it is not stated. Not written.

## Test cases (78 flows)

### TC-001 [FE][MT] Verify Status dropdown shows only on Activity rows (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Open the `Timeline` tab. -> The Timeline grid shows Activity Groups, Activities and a `Total Progress` row.
2. Look at the pinned `Status` column on one Activity row. -> The row shows a Status dropdown.
3. Look at the `Status` column on an Activity Group header row. -> The cell has no dropdown.
4. Look at the `Status` column on the `Total Progress` row. -> The cell has no dropdown.
Automate: yes, fixed result every run. Starting data: a seeded Timeline with 2 groups. What to check: dropdown count equals Activity row count. Clean up: none. Independent: yes.

### TC-002 [FE][MT] Verify user without Update Progress and Note cannot edit anything (NEG) [Auto]
Precondition: A user with `View Timeline` only (no `Update Progress and Note`) is logged in on the `Timeline` tab.
Priority: High
Trace: AC-1.3, AC-1.4, AC-2.5, AC-8.1, AC-8.3
1. Open the `Timeline` tab. -> The grid, Status values, weekly Actual (%) values, bars and `Total Progress` are visible.
2. Look at the Timeline toolbar. -> The `[ Update Progress ]` button is not shown.
3. Click the Status dropdown of an Activity row. -> The dropdown is disabled and does not open.
4. Click a weekly Actual (%) cell in a past week. -> The cell is read-only and accepts no typing.
5. Try to type `10` using the keyboard. -> The cell stays unchanged.
6. Click the `Total Progress` row cells. -> They are read-only.
Automate: yes, role check. Starting data: second account without the permission. Clean up: none. Independent: yes.

### TC-003 [FE][MT] Verify view-only user sees bars and totals as the editor sees them (POS) [Auto]
Precondition: Same Timeline data, two users: one with `Update Progress and Note`, one with `View Timeline` only.
Priority: Medium
Trace: AC-8.1
1. As the editor, record the bar colour and the number in one past week of an Activity and in the `Total Progress` row. -> The values are written down.
2. Log in as the view-only user and open the same Timeline. -> The same bars, colours and numbers are shown.
Automate: yes. Clean up: none.

### TC-004 [FE][MT] Verify permission, not role, decides editing (Exotic: permission vs role) [Manual: needs a user setup per permission]
Precondition: Two users: a Job Owner role who has `Update Progress and Note`, and a Turnaround Manager role without that permission (set up by the admin).
Priority: High
Trace: AC-8.3
1. Log in as the Job Owner who has the permission and open the `Timeline` tab. -> The `[ Update Progress ]` button is shown and Status and past-week Actual cells are editable.
2. Log in as the Turnaround Manager without the permission and open the `Timeline` tab. -> The button is hidden and the cells are disabled.

### TC-005 [FE][MT] Verify Edit Plan screen keeps Status and Actual read-only and hides bars (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-1.4, AC-2.5, AC-3
1. Click `[ Edit Plan ]` on the Timeline toolbar. -> The Edit Plan screen opens.
2. Click the Status of an Activity row. -> It is read-only and does not change.
3. Click a weekly Actual (%) cell in a past week. -> It is read-only.
4. Look at the Actual row of the weeks. -> No red or green bars are shown.

### TC-006 [FE][MT] Verify each Activity shows a Plan (%) row above an Actual (%) row (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Look at one Activity row in the `Progress` column. -> Two sub-rows are shown: Plan (%) on top and Actual (%) below.
2. Look at the weekly columns of the same Activity. -> The weekly cells follow the same two sub-rows.

### TC-007 [FE][MT] Verify future weeks are empty and cannot be edited (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3
1. Record the Current Week column. -> The column is written down.
2. Click the Actual (%) cell of the first week after the Current Week. -> The cell is disabled and shows empty.
3. Try to type `5`. -> Nothing is entered.
4. Click the Actual (%) cell of the last displayed week. -> The cell is disabled and shows empty.

### TC-008 [FE][MT] Verify Open pill style and default (POS) [Partial: colours judged by eye or computed style]
Precondition: A newly seeded Activity with no change to Status.
Priority: Low
Trace: AC-1.2
1. Look at the Status of an Activity never changed. -> The Status shows `Open`.
2. Check the pill colours. -> Background `#FFF1F0`, border `#FFA39E`, text `#F5222D`.

### TC-009 [FE][MT] Verify Close pill style (POS) [Partial: colours judged by eye or computed style]
Precondition: common
Priority: Low
Trace: AC-1.2
1. Open the Status dropdown of an Activity. -> The options `Open` and `Close` are shown.
2. Select `Close`. -> The pill shows `Close` with background `#F6FFED`, border `#B7EB8F`, text `#52C41A`.

### TC-010 [FE][MT] Verify changing Status marks the page changed (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.3, AC-5.1
1. Look at `[ Update Progress ]` with no change made. -> The button is disabled.
2. Change the Status of one Activity from `Open` to `Close`. -> The pill changes to the Close style at once.
3. Look at `[ Update Progress ]`. -> The button is enabled.

### TC-011 [FE][MT] Verify undoing a change by hand leaves nothing to save (Exotic: undo then leave) [Auto]
Precondition: common
Priority: High
Trace: AC-1.3, AC-5.1, AC-5.4
1. Change the Status of an Activity from `Open` to `Close`. -> `[ Update Progress ]` is enabled.
2. Change the Status back to `Open`. -> The button is disabled again (nothing to save).
3. Click another tab such as `Planning`. -> The tab opens with no `Unsaved Change` modal.
4. Return to `Timeline`, type `5` in a past-week Actual cell, then delete the value. -> The cell is blank and the button is disabled again.
Note: relies on open question 1.

### TC-012 [FE][MT] Verify Actual can be entered in a past week without a plan (POS) [Auto]
Precondition: common. An Activity has a blank Plan (%) in a past week.
Priority: High
Trace: AC-2.2
1. Click the Actual (%) cell of that past week. -> The cell becomes editable.
2. Type `10` and click outside. -> The cell shows `10.0`; the Task Total Actual shows the new sum.

### TC-013 [FE][MT] Verify the Current Week is editable and the next week is not (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2, AC-2.3
1. Click the Actual (%) cell of the Current Week. -> It is editable.
2. Type `5` and click outside. -> The cell shows `5.0`.
3. Click the Actual (%) cell of the following week. -> It is disabled and empty.
4. Click the Actual (%) cell of the week before the Current Week. -> It is editable.

### TC-014 [FE][MT] Verify the week boundary follows UTC+7 at midnight (Exotic: time zone) [Manual: needs the clock around the week change]
Precondition: The tester is near a week change in Bangkok time, with the browser computer set to a different time zone (for example UTC-5).
Priority: Medium
Trace: AC-2.2, AC-2.3
1. Open the Timeline just before the week change in Bangkok. -> The Current Week is the old week.
2. Reload just after the week change in Bangkok. -> The new week becomes editable and the old one stays editable.
Note: relies on open question 3.

### TC-015 [FE][MT] Verify typing a second decimal digit is blocked (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-2.4
1. Click a past-week Actual (%) cell. -> The cell is editable.
2. Type `12.3`. -> The cell shows `12.3`.
3. Type `6`. -> The cell still shows `12.3` (the second decimal digit is not accepted).
4. Click outside. -> The cell shows `12.3`.

### TC-016 [FE][MT] Verify pasted values round to 1 decimal (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.4
1. Copy the first value of the data table below from any text source. -> The value is on the clipboard.
2. Paste it into a past-week Actual (%) cell and click outside. -> The cell shows the Expected value.
3. Repeat for each row of the table. -> Each cell shows the Expected value; the Task Total follows.
3a. Record the Task Total Actual, click `[ Update Progress ]` and reload. -> The success toast shows; after reload each cell still shows its Expected value (for example `12.4`, not `12.36`) and the Task Total equals the recorded one.

| Pasted | Expected |
|---|---|
| 12.36 | 12.4 |
| 12.34 | 12.3 |
| 12.35 | 12.4 |
| 12.25 | 12.3 |
| 99.95 | 100.0 |
| 0.04 | 0.0 |
| 7 | 7.0 |
Automate: yes, the test loops over every row. Starting data: Activity with an empty past week. Clean up: clear the cell, do not commit. Independent: yes.

### TC-017 [FE][MT] Verify values above 100 are cut to exactly 100.0 (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.4
1. Type `100` in a past-week Actual cell and click outside. -> The cell shows `100.0`.
2. Type `100.1` in another past-week cell and click outside. -> The cell shows `100.0`.
3. Type `105` in a third cell. -> The cell shows `100.0`.
4. Paste `120.5` into a fourth cell. -> The cell shows `100.0`.
5. Type `99.9` in a fifth cell. -> The cell shows `99.9` (not changed).
6. Look at the Task Total Actual of the Activity and the weekly Total Progress cell of the first week. -> Each `100.0` cell counts as `100.0`, never `105` or `120.5`.
7. Click `[ Update Progress ]` (if the Overall Total allows it; otherwise lower the other cells first) and reload. -> The cells still show `100.0` and the totals still use `100.0`.
8. Lower the first `100.0` cell to `40`. -> The cell shows `40.0` and the Task Total and weekly total follow the new value.

### TC-018 [FE][MT] Verify 0 and 0.0 count as real values (BND) [Auto]
Precondition: common. An Activity whose weeks are all blank.
Priority: High
Trace: AC-2.4, AC-6
1. Type `0` in a past-week Actual cell and click outside. -> The cell shows `0.0` (not blank).
2. Look at the weekly Total Progress Actual cell of that week. -> It shows `0.0` (not blank).
3. Look at the Actual bar of that week. -> A coloured bar is shown.
4. Commit with `[ Update Progress ]` and reload. -> The week still shows `0.0` and the timeframe grid still includes that week.

### TC-019 [FE][MT] Verify invalid or empty input resets the cell to blank (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4
1. Type each value of the table into a past-week Actual cell and click outside. -> The cell shows the Expected result.

| Input | Expected |
|---|---|
| (clear the cell) | blank |
| -5 | blank |
| abc | blank |
| 😀 | blank |
| `.` | blank |
| 5 followed by spaces | 5.0 |
Automate: yes, loop over the table. Clean up: clear the cell.

### TC-020 [FE][MT] Verify a value cleared after a value existed becomes blank (POS) [Auto]
Precondition: common. A past-week Actual cell has `20.0`.
Priority: Medium
Trace: AC-2.4, AC-2.6
1. Select the cell text and delete it, click outside. -> The cell is blank.
2. Look at the Task Total Actual. -> It no longer includes `20.0`.

### TC-021 [FE][MT] Verify editing a value in the middle of the text (Exotic: cursor) [Manual: cursor handling]
Precondition: common. A cell has `12.3`.
Priority: Low
Trace: AC-2.4
1. Double-click the cell and place the cursor after `1`. -> The cursor stays there.
2. Press Delete once. -> The cell text is `2.3` and the cursor stays in place.
3. Select the whole text and type `45.6`. -> The cell shows `45.6` after leaving it.

### TC-022 [FE][MT] Verify Task Total Actual is the sum of its weeks and is read-only (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.6, AC-6
1. Record the Task Total Actual of an Activity with blank weeks. -> The value `0.0` is written down.
2. Type `10` in week A and `5.5` in week B (both past weeks). -> The cells show `10.0` and `5.5`.
3. Look at the Task Total Actual. -> It shows `15.5`.
4. Click the Task Total Actual cell and type `50`. -> The cell is read-only and stays `15.5`.

### TC-023 [FE][MT] Verify weekly Total Plan shows the sum, and blank only if all plans are blank (BND) [Auto]
Precondition: common. A week where two Activities have Plan `5.0` and `7.5`, and a week where every Activity has a blank Plan.
Priority: High
Trace: AC-2.6, AC-6
1. Look at `Total Progress` Plan cell of the first week. -> It shows `12.5`.
2. Look at `Total Progress` Plan cell of the week where all plans are blank. -> The cell is blank.
3. Try to type in the Total Plan cell. -> The cell is read-only.

### TC-024 [FE][MT] Verify weekly Total Actual sum, blank rule and zero rule (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.6, AC-6
1. Look at the Total Actual of a week where all Activities are blank. -> The cell is blank.
2. Type `0` in the Actual of one Activity in that week. -> The Total Actual of that week shows `0.0`.
3. Type `4` in the Actual of a second Activity in the same week. -> The Total Actual shows `4.0`.
4. Clear both cells. -> The Total Actual of that week is blank again.

### TC-025 [FE][MT] Verify Overall Total Actual is the grand total (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.6
1. Record the Overall Total Actual in `Total Progress` -> `Progress`. -> The value is written down.
2. Add `10` to one Activity in one past week and `20` to another Activity in another past week. -> The cells show `10.0` and `20.0`.
3. Look at the Overall Total Actual. -> It equals the recorded value plus `30.0`.
4. Click the cell and type. -> The cell is read-only.

### TC-026 [FE][MT] Verify Total Progress row does not clamp at 100 (BND) [Auto]
Precondition: common. Activities A, B, C each have a past week W where they can hold Actual.
Priority: High
Trace: AC-2.4, AC-2.6, AC-4.2
1. Type `100` for Activity A, `1` for Activity B, `1` for Activity C in week W. -> Each cell shows `100.0`, `1.0`, `1.0`.
2. Look at the `Total Progress` Actual cell of week W. -> It shows `102.0` (not `100.0`).
3. Look at the Overall Total Actual. -> It shows the true sum, which is above `100.0` (for example `107.0` when other weeks add `5.0`).

### TC-027 [FE][MT] Verify weekly cells and totals use 1 decimal format (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-2.4, AC-6
1. Type `3` in a weekly Actual cell. -> The cell shows `3.0`.
2. Look at the Task Total and the Weekly Total of that week. -> Both show one decimal digit (`3.0`).

### TC-028 [FE][MT] Verify bar presence rules (condition table) (POS) [Auto]
Precondition: common. Activity X has Plan in a past week; Activity Y has no plan in another past week; a future week exists.
Priority: High
Trace: AC-3
1. Enter `5` in a past week where the Plan is blank. -> A coloured bar is shown.
2. Leave the Actual blank in a past week that has a Plan. -> A coloured bar is shown while the cell text stays blank.
3. Look at a past week with blank Actual and blank Plan. -> No bar is shown.
4. Look at a future week. -> No bar is shown.
5. Enter `0` in a past week with no Plan. -> A coloured bar is shown.
Automate: yes. Expected table: rows = (Actual, Plan, Week type) and presence yes or no (entry present: yes; blank with plan in past or current week: yes; blank without plan: no; future week: no).

### TC-029 [FE][MT] Verify bar presence in the Total Progress row (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3
1. Look at the Total Progress Actual of a past week where Actual is blank and some Activity has a Plan. -> A coloured bar is shown while the cell text is blank.
2. Look at a past week where nothing has Plan or Actual. -> No bar.
3. Look at a future week. -> No bar.

### TC-030 [FE][MT] Verify cumulative Red or Green evaluation (BND) [Auto]
Precondition: An Activity with weekly Plan in weeks 1 to 4 = `3.0`, `3.0`, `3.0`, `3.0`, all weeks past or current.
Priority: High
Trace: AC-3
1. Enter the Actual values of the data table, one week at a time. -> Each bar has the Expected colour.

| Week 1 | Week 2 | Week 3 | Week 4 | Bar of week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|---|---|---|
| 3 | 3 | 3 | 3 | Green | Green | Green | Green |
| 2.9 | blank | blank | blank | Red | Red | Red | Red |
| blank | 6 | blank | blank | Red | Green | Green | Green |
| 5 | blank | blank | 1 | Green | Green | Green | Red |
Notes: Green is `#95DE64`, Red is `#F5222D`. Equal cumulative = Green (week 1 of row 1). A blank week counts as 0.0 (row 2). Automate: yes, loop over the rows. Clean up: clear cells, do not commit.

### TC-031 [FE][MT] Verify a bar changes colour when the value changes (Exotic: effect and reverse) [Auto]
Precondition: common. Week 1 Plan `3.0`.
Priority: Medium
Trace: AC-3
1. Enter `2` in week 1. -> The bar is Red.
2. Change the value to `3`. -> The bar is Green.
3. Change the value back to `2`. -> The bar is Red again.
4. Clear the cell. -> The bar stays Red (blank with Plan in a past week).

### TC-032 [FE][MT] Verify bars of an optional task without dates are always Green (POS) [Auto]
Precondition: An optional Activity with no Start Date and End Date exists (for example a Minor SD optional task).
Priority: Medium
Trace: AC-3
1. Enter `1` in a past week of that Activity. -> The bar is Green `#95DE64`.
2. Enter `0` in another past week. -> The bar is Green.
3. Leave a third past week blank. -> No bar is shown (no plan in that week).

### TC-033 [FE][MT] Verify the Total Progress row bar compares cumulative totals (BND) [Auto]
Precondition: Two Activities with Plan in past weeks, cumulative total plan known.
Priority: High
Trace: AC-3
1. Record the cumulative total Plan up to week W. -> The value is written down.
2. Enter Actual values so the cumulative total Actual equals the recorded Plan. -> The Total Progress bar of week W is Green.
3. Lower one Actual by `0.1`. -> The bar of week W is Red.
4. Raise it by `0.2`. -> The bar is Green.

### TC-034 [FE][MT] Verify Activity Group header rows have no Red or Green bars (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3
1. Enter Actual values in Activities of a group. -> Activity rows show bars.
2. Look at the Group header row. -> It shows only the dark navy summary bracket, no Red or Green bars.

### TC-035 [FE][MT] Verify Task over-plan warning and tooltip (BND) [Auto]
Precondition: common. An Activity with Task Total Plan `10.0` and one Actual cell.
Priority: Medium
Trace: AC-4.1
1. Enter Actual totaling `10.0`. -> The Task Total Actual cell has no yellow background.
2. Enter Actual totaling `10.1`. -> The Task Total Actual cell has a yellow background `#FFE7BA` and no icon.
3. Hover the yellow cell. -> A tooltip with orange text `#FA8C16` shows `The actual progress is over the planned progress.`
4. Look at `[ Update Progress ]`. -> It is enabled (the warning does not block).
5. Lower the Actual back to `10.0`. -> The yellow background is gone.

### TC-036 [FE][MT] Verify over-plan warning also shows in Edit Plan and does not block Save (POS) [Auto]
Precondition: common. An Activity with Task Actual above its Plan already saved.
Priority: Medium
Trace: AC-4.1
1. Click `[ Edit Plan ]`. -> The Edit Plan screen opens.
2. Look at the Task Total Actual of that Activity. -> It shows the yellow background.
3. Hover the cell. -> The tooltip text `The actual progress is over the planned progress.` shows.
4. Change a Plan value so `[ Save ]` is enabled. -> The `[ Save ]` button is enabled.

### TC-037 [FE][MT] Verify Total over 100 shows the red cell and tooltip and blocks Update Progress (NEG) [Auto]
Precondition: common. Total Actual is below 100.
Priority: High
Trace: AC-4.2, AC-5.1
1. Enter Actual values so the Overall Total becomes `107.0`. -> The Total Progress Actual cell turns red `#FFCCC7`.
2. Hover the red cell. -> A tooltip with red text `#F5222D` shows `The overall progress must not exceed 100%.`
3. Look at `[ Update Progress ]`. -> The button is disabled.
4. Lower the values so the Overall Total is `100.0`. -> The red background is gone.
5. Look at `[ Update Progress ]`. -> The button is enabled.

### TC-038 [FE][MT] Verify the 100 limit edge: 100.0 passes, 100.1 blocks (BND) [Auto]
Precondition: common. Total Actual is `0.0`.
Priority: High
Trace: AC-4.2, AC-5.1
1. Enter Actual values so the Overall Total is `99.9`. -> No red cell; the button is enabled.
2. Raise the Overall Total to `100.0`. -> No red cell; the button is enabled.
3. Raise the Overall Total to `100.1`. -> The cell is red and the button is disabled.

### TC-039 [FE][MT] Verify Update Progress button states (POS) [Auto]
Precondition: common. The page was just loaded.
Priority: High
Trace: AC-5.1, AC-8.2
1. Look at the toolbar. -> `[ Update Progress ]` is shown and disabled.
2. Type `5` in a past-week Actual cell. -> The button is enabled.
3. Raise the Total above `100.0`. -> The button is disabled.
4. Lower the Total to `100.0` or below. -> The button is enabled.
5. Click the button. -> The commit starts and, after the success toast, the button is disabled again.

### TC-040 [FE][BE][MT] Verify commit saves values and shows the success toast (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-5.2
1. Change the Status of an Activity to `Close`, enter `10` in a past-week Actual cell, and collapse a Group. -> The changes are shown.
2. Click `[ Update Progress ]`. -> A success toast shows title `Update Success` and message `Update Progress Successfully.`
3. Look at `[ Update Progress ]`. -> The button is disabled.
4. Reload the page. -> The Status is `Close`, the cell shows `10.0` and the Group is still collapsed.
5. Click another tab and return. -> No `Unsaved Change` modal appears.
Automate: yes. Clean up: set values back and commit.

### TC-041 [FE][BE][MT] Verify the untouched values stay the same after commit and reload (Exotic: no day shift) [Auto]
Precondition: common
Priority: Medium
Trace: AC-5.2
1. Record all Plan values, Start and End Dates of three Activities. -> The values are written down.
2. Change one Actual value and commit. -> The success toast shows.
3. Reload. -> Plan values and dates are exactly the same as recorded.

### TC-042 [FE][BE][MT] Verify commit failure shows the failed toast and keeps the draft (NEG) [Manual: a server failure must be forced]
Precondition: common. The network is switched off or the request is blocked.
Priority: High
Trace: AC-5.2
1. Enter `5` in a past-week Actual cell. -> The cell shows `5.0`.
2. Click `[ Update Progress ]`. -> A fail toast shows title `Update Failed` and message `Update Progress Failed.`
3. Look at the cell and the button. -> The cell still shows `5.0` and the button is still enabled.
4. Restore the network and click the button again. -> The success toast shows.

### TC-043 [FE][BE][MT] Verify clearing the outer weeks contracts the grid and deletes a note there without a modal (POS) [Partial: needs seeded notes]
Precondition: common. The last week column of the grid exists only because of an Actual value in it. A milestone note exists in that week.
Priority: High
Trace: AC-5.2
1. Record the number of week columns. -> The value is written down.
2. Clear the Actual value in the last week and click `[ Update Progress ]`. -> The success toast shows; no confirmation modal and no warning appears.
3. Look at the grid. -> The obsolete week column is gone.
4. Reload. -> The grid has the new smaller number of columns and the note of that week no longer exists.
5. Repeat steps 1 to 4 for the first (earliest) week column that exists only because of an Actual value. -> The earliest column is also removed and its note is deleted without a modal.

### TC-044 [FE][BE][MT] Verify the note stays if the value is put back before commit (Exotic: effect and reverse) [Partial: needs seeded notes]
Precondition: common. The last week column exists only because of an Actual value in it, and a milestone note exists in that week.
Priority: High
Trace: AC-5.2
1. Clear the Actual value in the last week without committing. -> The cell is blank.
2. Type the value back. -> The cell shows the value.
3. Click `[ Update Progress ]`. -> The success toast shows.
4. Reload. -> The week column and its note are still there.

### TC-045 [FE][BE][MT] Verify the Plan has Been Changed modal when another user changed the plan (NEG) [Partial: needs two users]
Precondition: Two sessions on the same Timeline: user A and user B, both with the permission.
Priority: High
Trace: AC-5.3
1. As user A, type `5` in a past-week Actual cell. -> The cell shows `5.0`.
2. As user B, open `Edit Plan`, change a Plan value and click `[ Save ]`. -> User B sees the save succeed.
3. As user A, click `[ Update Progress ]`. -> A modal shows title `Plan has Been Changed` and message `The shutdown timeline has already been updated. This action will reload the page and update some data.` with the button `[ OK ]`.
4. Click `[ OK ]`. -> The page reloads, shows the new plan, and the draft is clean (button disabled).

### TC-046 [FE][MT] Verify the unsaved guard on changing tabs (matrix) (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-5.4
1. Type `5` in a past-week Actual cell. -> The cell shows `5.0`.
2. Click the tab named in the table below. -> A modal shows title `Unsaved Change` and message `Are you sure you want to leave this page? Changes you made will not be saved.` with `[ Continue Editing ]` and `[ Discard Change ]`.
3. Click `[ Continue Editing ]`. -> The modal closes, the Timeline stays and the cell still shows `5.0`.
Tabs: Planning, Manpower Resource, Details, Shutdown Organization, Shutdown Logic, Worklist, Daily Report. The test loops over every tab.

### TC-047 [FE][MT] Verify Discard Change leaves the page and drops the draft (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-5.4
1. Change a Status and type `5` in a past-week Actual cell. -> The page shows the changes.
2. Click the `Planning` tab. -> The `Unsaved Change` modal shows.
3. Click `[ Discard Change ]`. -> The Planning tab opens.
4. Return to the `Timeline` tab. -> The old Status and a blank Actual cell are shown; the button is disabled.

### TC-048 [FE][MT] Verify the guard on Edit Plan (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-5.4
1. Type `5` in a past-week Actual cell. -> The cell shows `5.0`.
2. Click `[ Edit Plan ]`. -> The `Unsaved Change` modal shows.
3. Click `[ Continue Editing ]`. -> The Timeline stays with `5.0`.
4. Click `[ Edit Plan ]` again and click `[ Discard Change ]`. -> The Edit Plan screen opens.
5. Look at the Status and the Actual cell of the same Activity in Edit Plan. -> They show the saved values, not the discarded `5.0` draft.
6. Return to the `Timeline` tab. -> The cell shows the saved value (blank if it was blank) and `[ Update Progress ]` is disabled.

### TC-049 [FE][MT] Verify the guard on side menu, breadcrumb and browser refresh and Back (NEG) [Partial: browser dialog differs by browser]
Precondition: common. A draft exists (`5` typed in a past week).
Priority: High
Trace: AC-5.4
1. Click an item of the side navigation menu. -> The `Unsaved Change` modal shows.
2. Click `[ Continue Editing ]`, then click a breadcrumb link. -> The `Unsaved Change` modal shows again.
3. Click `[ Continue Editing ]`, then press the browser Refresh. -> The browser or the page asks to confirm leaving.
4. Cancel, then press the browser Back. -> The page asks to confirm leaving and the draft stays when cancelled.
5. Click an item of the side navigation menu, then click `[ Discard Change ]`. -> The chosen page opens; return to the Timeline: the cell is blank again and the button is disabled.
6. Type `5` again, click a breadcrumb link, then click `[ Discard Change ]`. -> The linked page opens; return to the Timeline: the draft is gone.
7. Type `5` again, press the browser Refresh and confirm leaving. -> The Timeline reloads with the saved values and the button is disabled.
8. Type `5` again, press the browser Back and confirm leaving. -> The previous page opens; return to the Timeline: the draft is gone.

### TC-050 [FE][MT] Verify no guard is shown when there is nothing to save (POS) [Auto]
Precondition: common. No change made after load.
Priority: Medium
Trace: AC-5.4
1. Click the `Planning` tab. -> It opens with no modal.
2. Return, change a Status and commit with `[ Update Progress ]`. -> The success toast shows.
3. Click the `Details` tab. -> It opens with no modal.

### TC-051 [FE][MT] Verify the guard is not shown for a user who cannot edit (NEG) [Auto]
Precondition: A user with `View Timeline` only.
Priority: Medium
Trace: AC-5.4, AC-8.3
1. Open the `Timeline` tab, click a disabled Status and a read-only cell. -> Nothing changes.
2. Click the `Worklist` tab. -> It opens with no `Unsaved Change` modal.

### TC-052 [FE][MT] Verify the guard after a commit does not appear for the committed values (Exotic: effect and reverse) [Auto]
Precondition: common
Priority: Medium
Trace: AC-5.1, AC-5.4
1. Type `5` in a past-week Actual cell and click `[ Update Progress ]`. -> The success toast shows.
2. Click `[ Edit Plan ]`. -> The Edit Plan screen opens with no modal.
3. Click `Back` to the Timeline. -> The cell still shows `5.0`.

### TC-053 [FE][MT] Verify field defaults for a new Activity (POS) [Auto]
Precondition: A new Activity (just created in Edit Plan).
Priority: Medium
Trace: AC-6, AC-1.2
1. Open the Timeline and find the new Activity. -> Status shows `Open`.
2. Look at its weekly Actual cells. -> They are blank.
3. Look at its Task Total Actual. -> It shows `0.0`.

### TC-054 [FE][MT] Verify first-time empty state (POS) [Auto]
Precondition: A Timeline with no Actual entered at all.
Priority: Medium
Trace: AC-7.1, AC-6
1. Open the `Timeline` tab. -> All weekly Actual cells are empty (not `-` and not a dash).
2. Look at the Task Totals and the Overall Total. -> They show `0.0`.
3. Look at the weekly Total Actual cells. -> They are blank.

### TC-055 [FE][MT] Verify a Group with "No activity added." shows no inputs (POS) [Auto]
Precondition: An Activity Group with no Activities.
Priority: Low
Trace: AC-7.2
1. Look at the Group. -> The text `No activity added.` is shown.
2. Look at the weekly area of that Group. -> No Actual inputs and no Status dropdown are shown.

### TC-056 [FE][BE][MT] Verify Timeline progress does not change Worklist or Shutdown Logic (POS) [Partial: needs data compare on 2 pages]
Precondition: common. Worklist and Shutdown Logic have tasks with a known progress and status.
Priority: High
Trace: AC-9
1. Record the progress and status of tasks on the `Worklist` tab and the `Shutdown Logic` tab. -> The values are written down.
2. On the Timeline, set an Activity to `Close`, enter `50` in a past week and commit. -> The success toast shows.
3. Open the `Worklist` and `Shutdown Logic` tabs. -> All progress and status values equal the recorded ones.

### TC-057 [FE][MT] Verify pasting one cell, one row, several cells and beyond the target (Exotic: paste) [Partial: depends on answer to question 4]
Precondition: common. Past weeks W1 to W3 are editable, week after Current Week is disabled.
Priority: Medium
Trace: AC-2.3, AC-2.4
1. Copy one value `4.44` and paste it into W1. -> W1 shows `4.4`; other cells are unchanged.
2. Copy three values `1`, `2`, `3` from a spreadsheet row and paste at W1. -> W1 shows `1.0` and W2 and W3 keep their old values (assumed: first value only, as for Plan % in ETM-8388, see question 4); cells in future weeks stay empty.
3. Copy four values and paste into the Current Week cell. -> No future-week cell receives a value.
4. Paste into a future-week cell. -> The cell stays empty.

### TC-058 [FE][MT] Verify keyboard use in the Actual cells (Exotic: keyboard) [Manual: key handling judged by a person]
Precondition: common
Priority: Low
Trace: AC-2.4
1. Click a past-week Actual cell, type `7`, press Tab. -> The value `7.0` is kept and the focus moves to the next editable cell.
2. Type `8`, press Enter. -> The value `8.0` is kept.
3. Type `9`, press Esc. -> The edit is cancelled and the old value stays.

### TC-059 [FE][BE][MT] Verify double click on Update Progress saves once (Exotic: double click) [Partial: timing]
Precondition: common. A draft exists.
Priority: Medium
Trace: AC-5.2
1. Double-click `[ Update Progress ]` quickly. -> One success toast shows and the button becomes disabled.
2. Reload. -> The values are saved once and nothing is duplicated.

### TC-060 [FE][MT] Verify totals do not show floating point noise (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.6, AC-6
1. Enter `0.1` in week A, `0.2` in week B of one Activity. -> The cells show `0.1` and `0.2`.
2. Look at the Task Total Actual. -> It shows `0.3` (not `0.30000000000000004`).
3. Enter `0.1` for another Activity in week A and `0.2` in week B. -> Weekly Totals show `0.2` and `0.4` and the Overall Total shows `0.6`.

### TC-061 [FE][MT] Verify a Task Total above 100 is not cut (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-6, AC-4.2
1. Enter `100` in week A and `50` in week B of one Activity. -> The cells show `100.0` and `50.0`.
2. Look at the Task Total Actual. -> It shows `150.0` (not clamped).
3. Look at `[ Update Progress ]`. -> It is disabled because the Overall Total is above `100.0`.

### TC-062 [FE][MT] Verify collapse and expand of a Group is saved at commit (POS) [Partial: depends on question 2]
Precondition: common
Priority: Low
Trace: AC-5.2, AC-5.4
1. Collapse a Group. -> Its Activities are hidden.
2. Record whether `[ Update Progress ]` is enabled. -> The state is written down.
3. Expand it again. -> Its Activities are shown.
4. Collapse the Group, commit (if enabled), reload. -> The Group is still collapsed.
5. Expand the Group, commit (if enabled) and reload. -> The Group is expanded after reload.

### TC-063 [FE][MT] Verify retyping the original value of an existing Actual keeps the button disabled (BND) [Auto]
Precondition: common. A past-week Actual cell holds a saved value, for example `20.0`.
Priority: High
Trace: AC-1.3, AC-5.1
1. Note the saved value `20.0` and that `[ Update Progress ]` is disabled. -> The state is written down.
2. Change the cell to `30` and click outside. -> The cell shows `30.0` and the button is enabled.
3. Type `20` in the same cell and click outside. -> The cell shows `20.0` and the button is disabled again (nothing to save).
4. Click the `Planning` tab. -> It opens with no modal.

### TC-064 [FE][MT] Verify collapse or expand alone is not an unsaved change and survives navigation (POS) [Partial: depends on question 2]
Precondition: common. No other change made.
Priority: Medium
Trace: AC-5.2, AC-5.4
1. Collapse a Group. -> Its Activities are hidden and `[ Update Progress ]` stays disabled (assumed, question 2).
2. Click the `Planning` tab. -> It opens with no modal (assumed, question 2).
3. Return to the `Timeline` tab. -> The Group is still collapsed in this session.
4. Click `[ Edit Plan ]`, then return to the Timeline. -> The Group state is the same as before leaving.

### TC-065 [FE][MT] Verify leaving while the Overall Total is above 100.0 still shows the guard (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-4.2, AC-5.4
1. Enter values that make the Overall Total `102.0`. -> The total is red and `[ Update Progress ]` is disabled.
2. Click the `Worklist` tab. -> The `Unsaved Change` modal shows.
3. Click `[ Discard Change ]`. -> The Worklist opens; returning to the Timeline shows the saved values.

### TC-066 [FE][MT] Verify the week boundary of Current Week (BND) [Partial: needs date control]
Precondition: common. Question 3 assumes the week runs Monday to Sunday on the Bangkok clock.
Priority: High
Trace: AC-2.2, AC-2.3
1. On a Sunday (UTC+7), look at the week column holding today. -> That column is editable and the next week column is disabled.
2. On the following Monday (UTC+7), look at the grid. -> The new week is editable and the one after it is disabled.
3. Set the computer to another time zone and reload. -> The editable weeks still follow Bangkok time.

### TC-067 [FE][MT] Verify a pasted invalid value clears a cell that had a value (NEG) [Auto]
Precondition: common. A past-week cell holds `20.0`.
Priority: Medium
Trace: AC-2.4
1. Paste `-5` into the cell and click outside. -> The cell is blank (assumed, question 6).
2. Type `20`, then paste `abc` and click outside. -> The cell is blank.

### TC-068 [FE][BE][MT] Verify rows that existed before the Story show Open and blank Actual (POS) [Partial: needs old data]
Precondition: an Activity created before this Story.
Priority: Medium
Trace: AC-1.2, AC-6
1. Open the Timeline. -> The old Activity shows Status `Open` and blank Actual cells (assumed, question 10).

### TC-069 [FE][MT] Verify Total Plan is blank when an Activity has no dates (POS) [Auto]
Precondition: common. The optional Activity without Start Date and End Date.
Priority: Low
Trace: AC-2.6, AC-3
1. Look at the Plan (%) row of that Activity and its contribution to the `Total Progress` Plan row. -> The Plan cells are blank and the totals do not count it (assumed, question 12).

### TC-070 [FE][MT] Verify the Status dropdown on the last Activity rows and after scrolling (POS) [Auto]
Precondition: common. Enough Activities to need vertical scrolling.
Priority: Low
Trace: AC-1.1
1. Scroll to the last Activity row and open its Status dropdown. -> The list shows `Open` and `Close` fully visible and clickable.
2. Choose `Close`. -> The pill shows `Close` and `[ Update Progress ]` is enabled.

### TC-071 [FE][MT] Verify paste in the middle of a value and over a selected cell (Exotic: paste) [Partial: clipboard handling]
Precondition: common. A past-week cell holds `12.5`.
Priority: Low
Trace: AC-2.4
1. Place the cursor in the middle of `12.5`, paste `7` and click outside. -> The cell shows a valid 1-decimal value between 0.0 and 100.0 (for example `127` cut to `100.0`), never text.
2. Select the whole cell and paste `33.33`. -> The cell shows `33.3`.

### TC-072 [FE][MT] Verify pinned Status and Progress columns stay aligned when scrolling (POS) [Manual: visual alignment]
Precondition: common. The grid scrolls horizontally and vertically.
Priority: Low
Trace: none (frozen columns screen state)
1. Scroll the weekly area to the right and down. -> The Status and Progress sub-labels (Plan, Actual) stay aligned with their weekly rows.

### TC-073 [FE][BE][MT] Verify another user deleting the Activity while the page is open (NEG) [Partial: needs two users]
Precondition: Two sessions with the permission.
Priority: Medium
Trace: AC-5.3
1. As user A type `5` in an Actual cell of an Activity. -> The cell shows `5.0`.
2. As user B delete that Activity in Edit Plan and save. -> The save succeeds for B.
3. As user A click `[ Update Progress ]`. -> The `Plan has Been Changed` modal shows (assumed, question 8) and after `[ OK ]` the Activity is gone and no error page appears.

### TC-074 [FE][MT] Verify weekly total and bar follow a lowered value after a clamp (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4, AC-2.6
1. Type `150` in a past-week cell. -> The cell shows `100.0` and the weekly total includes `100.0`.
2. Lower the cell to `60`. -> The cell shows `60.0`; the weekly and Overall Totals drop accordingly.

### TC-075 [FE][MT] Verify a pasted value gets the right bar colour (POS) [Auto]
Precondition: common. An Activity with a Plan of `10.0` in the week.
Priority: Medium
Trace: AC-3
1. Paste `5` in that week. -> The cell shows `5.0`; the bar is Red (cumulative Actual below Plan).
2. Paste `10` in the same week. -> The bar is Green (equal is Green).

### TC-076 [FE][BE][MT] Verify bars, warning and totals after the Plan is changed in Edit Plan and saved (POS) [Auto]
Precondition: common. A committed Actual of `20.0` in a week with Plan `10.0`.
Priority: High
Trace: AC-3, AC-4.1
1. Record the bar colour, warning and totals. -> The state is written down (Green, over-plan warning shown).
2. In Edit Plan raise the Plan of that week to `30` and click `[ Save ]`. -> The Timeline shows; the bar is Red, the over-plan warning is gone and the totals are recalculated.
3. Lower the Plan to `10` again and save. -> The bar is Green and the warning is back.

### TC-077 [FE][BE][MT] Verify Status Close then Open is saved (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2, AC-5.2
1. Set an Activity to `Close` and commit. -> The success toast shows; after reload the pill shows `Close`.
2. Set it to `Open` and commit. -> The success toast shows; after reload the pill shows `Open`.

### TC-078 [FE][MT] Verify undoing one of two changes keeps the button enabled (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.3, AC-5.1
1. Change a Status and type `5` in an Actual cell. -> The button is enabled.
2. Put the Status back to its saved value. -> The button stays enabled because the Actual is still changed.
3. Clear the Actual cell. -> The button is disabled.

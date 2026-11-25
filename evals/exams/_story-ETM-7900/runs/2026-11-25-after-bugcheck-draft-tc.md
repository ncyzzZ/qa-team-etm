# Draft TC - ETM-7900 Export Shutdown Logic PDF Timeframe Selection

Story: ETM-7900 [Improvement] Export Shutdown Logic - PDF Timeframe Selection (Full Shutdown Timeframe vs Focus Timeframe).
Source: `story.md` (description + comments before 2026-11-10), `docs/modules/shutdown-logic.md`, `knowledge/`. No `analyst.md` or `inspector.md` exists for this exam: AC ids below are numbered from the Story's own outline (AC-1.1 = AC 1 item 1, and so on). Exam run, nothing was asked of Jira, Figma or Xray.
Existing [QA] subtasks: none known.
Common precondition: logged in as Turnaround Manager (TM) with a plan that has Shutdown Logic tasks over at least 5 consecutive calendar days, on the Shutdown Logic page, `Hide histogram` collapsed after load; the Export drawer is opened with the `Export` button. Data shape needed: tasks that start/end exactly at 00:00:00 boundaries, a task longer than 4 days, a milestone (0 duration), a Work Header whose children are on different days, a day with no active task, dependencies inside and outside the 4-day window, a plan crossing a month boundary.
Notation: D = execution date of one daily PDF (UTC+7). Priority is from damage (the Story has none).

## AC ids used (from the Story)
- AC-1.1 Timeframe section sits directly under Export Mode
- AC-1.2 Excel / PDF Overall: only `Full Shutdown Timeframe`, selected and locked; PDF Daily Plan: two radios with subtext, Full is default
- AC-2.1 Full mode task inclusion on day D (End >= D 00:00:00, Start < D+1 00:00:00; boundary tasks)
- AC-2.2 Full mode timeline scale = earliest start to latest end of that day's displayed tasks, filters respected
- AC-2.3 Full mode empty day still generates a PDF with headers and 24-hour scale
- AC-2.4 Full mode dependency arrows between visible tasks
- AC-3.1 Focus anchor date D in UTC+7
- AC-3.2 Focus task rows scope (same inclusion rule, empty day keeps headers and 4-day grid)
- AC-3.3 WBS parent row shown only if a child is active on D
- AC-3.4 Focus zoom: Day/Hour = 4 days; Week = full weeks (Sunday start); Month = full months
- AC-3.5 Edge days keep full 4-day span with empty columns
- AC-3.6 Task bars clipped at D-1 00:00:00 and D+2 23:59:59; table dates unclipped
- AC-3.7 Milestones shown as diamonds in the window
- AC-3.8 Focus dependency arrows hidden when outside the day plan or window
- AC-4.1 Clicking a radio updates the selection immediately
- AC-4.2 Focus choice survives Daily Plan -> Overall / Excel -> Daily Plan inside one drawer session
- AC-4.3 Cancel, overlay click or Export closes the drawer; reopening restores Full
- AC-4.4 One daily PDF per calendar day of the filtered visible range
- AC-4.5 Export closes drawer at once, runs in background, error toast on failure
- AC-4.6 File names and monthly ZIP names, no timeframe suffix

## Coverage map
| Requirement / screen state | Technique | Risk | Planned cases |
|---|---|---|---|
| AC-1.1 placement | Screen state | Section in wrong place | TC-001 |
| AC-1.2 Excel / Overall single locked radio | Decision table | Locked radio can be changed; wrong subtext | TC-002, TC-003 |
| AC-1.2 Daily Plan two radios + subtext | Screen state | Wrong default or wording | TC-004 |
| AC-2.1 inclusion + boundaries | Boundary | Task ending at 00:00 lost, task starting at D+1 00:00 leaks in | TC-005, TC-006 |
| AC-2.2 scale | Boundary | Scale wider/narrower than the day's tasks; filters ignored | TC-007 |
| AC-2.3 empty day Full | Empty state | Day file missing or wrong scale | TC-008 |
| AC-2.4 dependency Full | Combination | Arrow missing between visible tasks | TC-009 |
| AC-3.1 anchor UTC+7 | Time zone | Day shifted by one near midnight | TC-010 |
| AC-3.2 Focus task rows | Boundary | Rows differ from Daily Plan rule | TC-011, TC-012 |
| AC-3.3 WBS parent | Decision table | Parent shown with no active child, or hidden with one | TC-013 |
| AC-3.4 zoom Day/Hour/Week/Month | Matrix (data table) | Wrong span at Sunday, month boundary | TC-014, TC-015, TC-016 |
| AC-3.5 edge days | Boundary | Grid shrinks on first/last day | TC-017 |
| AC-3.6 clipping | Boundary | Bar cut wrongly; table dates clipped | TC-018 |
| AC-3.7 milestone | Screen state | Diamond missing | TC-019 |
| AC-3.8 dependency Focus | Combination | Dangling arrows | TC-020 |
| AC-4.1 immediate select | Interaction | Radio needs a second click | TC-021 |
| AC-4.2 persistence | State changes | Choice lost on switch; Excel path | TC-022 |
| AC-4.3 dismissal reset | Leaving and coming back | Focus stays after reopen, via each way of closing | TC-023, TC-024 |
| AC-4.4 range + filters | Filter + export | Days outside filter exported; no filter result | TC-025, TC-026 |
| AC-4.5 trigger, error | Error guessing | Drawer stays open; double click; no error toast | TC-027, TC-028, TC-029 |
| AC-4.6 naming, ZIP | Matrix | Wrong index, suffix, month split | TC-030, TC-031 |
| Permission (Pre-condition) | Roles | Job Owner or no-permission user can export | TC-032, TC-033 |
| Same data on many pages (cat. 8) | Compare | PDF dates differ from screen | TC-034 |
| Real user: Keyboard | Real-user view | Radios not reachable by Tab/arrows | TC-035 |
| Close and Cancel | Leaving | Cancel starts export | TC-024, TC-037, TC-038, TC-039 |
| AC-2.2 long task, filter kinds | Boundary, filter | Scale clipped; filter kind ignored | TC-040, TC-043 |
| AC-3.2 empty day Focus | Empty state | Grid shrinks or file missing | TC-041 |
| AC-3.3 WBS with filter | Combination | Parent stays after filter | TC-042 |
| AC-4.6 renamed event or plan | Linked data | Old name in files | TC-045 |
| Two users with drawer open | Exotic | Broken row | TC-044 |

Lessons / categories:
- 1 Two people at once: relevant, TC-036 (another user changes tasks while the export runs; Story silent, expected result is the user's view, see Q9).
- 2 Filter + sort + search: relevant, TC-025, TC-026 (filters drive the day range and timeline); sort and search do not change exports (not in Story, skipped).
- 3 Old data after migrations: not relevant, no data migration in this Story.
- 4 Strange input: not relevant for radios; names with special characters in event or plan name are covered in TC-030 (made-up name with spaces and `&`).
- 5 Reordering: not relevant, no reorder in this Story.
- 6 Linked data: relevant, dependencies and WBS parent/child, TC-009, TC-013, TC-020.
- 7 Charts that depend on each other: relevant in short, Manpower histogram is not part of the PDF per Story (Q10); not a case.
- 8 Same data on many pages: TC-034.
- 9 Matrix: TC-002/003, TC-014-016, TC-030/031 use expected-value tables.
- L-1 Text sort with numbers: relevant to file naming, `Day10` after `Day9` in the ZIP, TC-030.
- L-2 Filter choice not kept: relevant, the radio choice reload/reopen, TC-023.
- L-3 Result read too early: relevant for automation, wait for the download or toast before reading files, noted in Auto cases.
- L-4 Multi-row paste: not relevant, no paste.
- L-5 Collapse/expand: relevant, collapsed Work Header rows when exporting, TC-013 (Q11).
- L-6 Same value different case: not relevant.
- L-7 Selected vs hover: relevant, the selected radio is marked with the mouse away, TC-004, TC-023.
- L-8 Story text changed: relevant, comments and AC disagree, see Open questions Q1, Q2, Q3.

Counts: High 25, Medium 16, Low 4 (45 flows). Auto 32, Partial 8, Manual 5.

Added after bug-check (fix round): TC-037 to TC-045 (Esc, reload/Back/breadcrumb, Job Owner reset, long task in Full, Focus empty day, WBS with filter, filter kinds, two users with drawer open, renamed plan); extra steps in TC-001, 013, 016, 021, 022, 025, 032, 033.

## Open questions
1. Overall mode / Excel: the 2026-11-05 09:57 comment says the section is hidden; the later comment and AC 1.2 say shown with `Full Shutdown Timeframe` locked. Drafted as AC (shown, locked). Please confirm.
2. Section heading: first comment says `Export Timeframe`, AC and later comment say `Timeframe`. Drafted as `Timeframe`.
3. ZIP name: comment says `..._DailyPlan_[YYYYMMDD].zip`, AC says `[YYYYMM]`. Drafted as AC (`YYYYMM`).
4. Full mode scale: AC 2.2 says earliest start to latest end among the tasks of that day; subtext says "of the currently displayed tasks". Is the scale per day (drafted) or for the whole filtered schedule?
5. Full mode with a task running over several days: is the bar clipped at the PDF scale edge, or is the scale widened to the task's full length? Drafted as widened (scale = earliest start to latest end).
6. The comment says the Export button becomes a disabled loading spinner with a backdrop until done; the later comment says the drawer closes at once. Drafted as closed at once (the later comment). Is any loading state visible in the workspace, and where?
7. Pre-condition says Edit Shutdown Logic Table and Visualization permission, but Job Owner "cannot edit tasks at all" (module doc). Can Job Owner see `Export` and the Timeframe section? Drafted as: JO can export (persona lists JO), TC-032.
8. What does a user with neither role / without the permission see (button hidden or disabled)? Drafted as: no `Export` button, TC-033.
9. Two users: what happens to a running export when someone else changes the tasks? Unknown; TC-036 records what the user would call correct (the file shows the data as it was when Export was clicked).
10. Is the Manpower histogram part of the PDF? Not mentioned in the Story, so no case is written (a case would invent behaviour); reason kept here, the BA may confirm.
11. Focus mode with collapsed rows (Expand Work Header / Work / Breakdown off): does the PDF follow the on-screen collapse state? Drafted as: PDF follows what is displayed, checked in TC-013 step 5.
12. Hour zoom: does the PDF show hour units over the 4 days, same window as Day? Drafted as same window, TC-014.
13. What is the toast text when export fails? Story says "per ETM-3461" only. Cases use "an error toast appears".
14. Does a day's Focus PDF include a task that overlaps only D-1 or D+1 (not D)? AC says no (omitted); confirm it is intended.
15. Suggestion (not in Story): a progress or success indicator after the background export finishes.
17. Day index with a filtered range: Day1 is drafted as the first filtered day; the Story says the index is of "the active range". Please confirm (TC-025 step 5).
16. Suggestion (not in Story): the same Timeframe choice for Overall mode PDF.

## Test cases (45 flows)

### TC-001 [FE][MT] Verify the Timeframe section sits directly under Export Mode (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Click `Export` on the Shutdown Logic page. -> The `Export Shutdown Logic` drawer opens.
2. Select `PDF File` under `File Type`, then `Daily Plan` under `Export Mode`. -> The `Timeframe` section appears.
3. Compare the vertical order of the sections. -> `Timeframe` is directly below `Export Mode` with no other section between them.
4. Read the heading of the section. -> The heading reads exactly `Timeframe` (not `Export Timeframe`).
Starting data: any Active plan with tasks. Check: order of section headings in the drawer. Data set: none. Clean up: close the drawer with `Cancel`.

### TC-002 [FE][MT] Verify Excel File shows only a locked Full Shutdown Timeframe (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Open the Export drawer and select `Excel File` under `File Type`. -> The `Timeframe` section shows one radio `Full Shutdown Timeframe`.
2. Look at the radio state. -> The radio is selected and locked; no subtext about Focus appears.
3. Click the radio. -> Nothing changes; it stays selected.
4. Look for `Focus Timeframe`. -> `Focus Timeframe` is not in the drawer.
Starting data: any plan. Check: radio count 1, checked, disabled. Clean up: close the drawer.

### TC-003 [FE][MT] Verify PDF Overall shows only a locked Full Shutdown Timeframe (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Open the Export drawer and select `PDF File`, then `Overall`. -> The `Timeframe` section shows one radio `Full Shutdown Timeframe`.
2. Look at the radio state. -> The radio is selected and locked.
3. Click the radio. -> It stays selected; the section does not change.
Starting data: any plan. Clean up: close the drawer.

### TC-004 [FE][MT] Verify PDF Daily Plan shows two radios, Full pre-selected, with subtext (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.2
1. Open the Export drawer and select `PDF File`, then `Daily Plan`. -> The `Timeframe` section shows two radios: `Full Shutdown Timeframe` and `Focus Timeframe`.
2. Read the subtext of the first radio. -> It reads `Timeline scale spans from the earliest start date to the latest end date of the currently displayed tasks.`
3. Read the subtext of the second radio. -> It reads `Timeline scale spans from day-1 to day+2 of each plan date.`
4. Move the mouse away and look at the radios. -> `Full Shutdown Timeframe` is marked selected; `Focus Timeframe` is not.
Starting data: any plan. Check: texts exact, checked state with mouse away. Clean up: close the drawer.

### TC-005 [FE][BE][MT] Verify Full mode includes a task that ends exactly at 00:00:00 of day D (BND) [Auto]
Precondition: common; a task A ends at `Date D 00:00:00` and has no other activity on D.
Priority: High
Trace: AC-2.1
1. Select `PDF File`, `Daily Plan`, `Full Shutdown Timeframe`, then click `Export`. -> The drawer closes and the export starts.
2. Open the PDF `Day[N]` for date D. -> The PDF opens.
3. Look for task A in the table. -> Task A is listed.
4. Open the PDF for date D-1. -> Task A is also listed there.
Starting data: task A made by the test on a card-owned plan. Check: row present in both days. Clean up: remove downloaded files.

### TC-006 [FE][BE][MT] Verify Full mode excludes a task that starts exactly at 00:00:00 of day D+1 (BND) [Auto]
Precondition: common; a task B starts at `Date D+1 00:00:00` and ends later.
Priority: High
Trace: AC-2.1
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> Task B is not in the table and not on the timeline.
3. Open the PDF for date D+1. -> Task B is listed.
Starting data: task B that starts at D+1 00:00:00, made by the test. Clean up: remove downloaded files.

### TC-007 [FE][BE][MT] Verify Full mode timeline scale follows that day's tasks and the active filters (POS) [Partial: reading pixels of the PDF scale needs a person]
Precondition: common; day D has tasks starting at known times (earliest start S, latest end E).
Priority: High
Trace: AC-2.2
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> The Gantt scale starts at the date of S and ends at the date of E of the tasks shown on that day.
3. Apply a column filter that hides the task with the earliest start, then export again. -> The new PDF scale starts at the next earliest start; the hidden task is not listed.
4. Compare the first and the second PDF. -> The scale changed only because of the filter.

### TC-008 [FE][BE][MT] Verify Full mode still creates a PDF for a day with no active tasks (POS) [Auto]
Precondition: common; one day inside the range has no active task.
Priority: High
Trace: AC-2.3
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Check the files for the empty day. -> A `Day[N]` PDF exists for that day.
3. Open it. -> It shows the full table headers and a single-day 24-hour scale from 00:00:00 to 23:59:59.
4. Look at the table body. -> The body is empty: no task rows, no bars.
Starting data: a plan with a gap day. Clean up: remove files.

### TC-009 [FE][BE][MT] Verify Full mode draws dependency arrows only between tasks visible in that day's PDF (POS) [Partial: arrows inside a PDF are checked by eye]
Precondition: common; task P and task Q are both active on D and linked; task R is linked to Q but not active on D.
Priority: Medium
Trace: AC-2.4
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> An arrow connects P and Q.
3. Look for R. -> R is not listed and no arrow points to it.

### TC-010 [BE][MT] Verify the day D follows UTC+7 for tasks near midnight (BND) [Manual: needs a person at a different system time zone]
Precondition: common; task near `Date D 23:30` UTC+7, and the browser set to another time zone.
Priority: High
Trace: AC-3.1
1. Set the computer time zone to a zone different from UTC+7. -> The setting is changed.
2. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
3. Open the PDF for date D. -> The task at 23:30 UTC+7 is in Day D, not in the next or previous day.
4. Check the file name date. -> The `YYYYMMDD` equals D in UTC+7.

### TC-011 [FE][BE][MT] Verify Focus mode lists only tasks active on D and omits tasks outside it (POS) [Auto]
Precondition: common; tasks: one ending before D, one starting after D, one spanning D.
Priority: High
Trace: AC-3.2
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> Only the spanning task is in the table and timeline.
3. Check the other two tasks. -> They are not listed and have no bars.
Starting data: three tasks made by the test. Clean up: remove files.

### TC-012 [FE][BE][MT] Verify Focus mode boundaries 00:00:00 match the Daily Plan rule (BND) [Auto]
Precondition: common; task A ends at `Date D 00:00:00`, task B starts at `Date D+1 00:00:00`.
Priority: High
Trace: AC-3.2
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> Task A is listed; task B is not listed.
Check: same rows as the Full mode PDF of the same day. Clean up: remove files.

### TC-013 [FE][BE][MT] Verify a WBS parent row shows only when a child is active on D (POS) [Auto]
Precondition: common; Work Header W1 has children active on D, Work Header W2 has children only on other days; also run once with `Expand Work Header` off.
Priority: High
Trace: AC-3.3
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> W1 and its active children are listed.
3. Look for W2. -> W2 is not listed and none of its children are.
4. Open the PDF for a day where only one of W1's three children is active. -> W1 is listed with that one child only.
5. Turn `Expand Work Header` off on the page, export Daily Plan with `Focus Timeframe` again and open the PDF for date D. -> The PDF follows what is displayed: W1 is listed collapsed (its children are not listed), W2 is still not listed (assumption Q11).
Starting data: two Work Headers with children on set days. Clean up: remove files.

### TC-014 [FE][BE][MT] Verify Focus timeline at Day and Hour zoom spans D-1 00:00:00 to D+2 23:59:59 (POS) [Partial: window check from the PDF needs a person for Hour units]
Precondition: common; zoom `Day`, then `Hour`.
Priority: High
Trace: AC-3.4
1. Set the zoom to `Day`, export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for a middle date D. -> The timeline shows 4 days: D-1, D, D+1, D+2.
3. Repeat with zoom `Hour`. -> The same 4-day window is shown in hour units.
Check: first and last column dates. Expected table: Zoom | Start | End = Day | D-1 00:00:00 | D+2 23:59:59; Hour | D-1 00:00:00 | D+2 23:59:59.

### TC-015 [FE][BE][MT] Verify Focus timeline at Week zoom spans full Sunday-start weeks (BND) [Auto]
Precondition: common; zoom `Week`; dates: D is a Sunday, D is a Wednesday, D is a Saturday.
Priority: High
Trace: AC-3.4
1. Set zoom to `Week`, export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for a Sunday D. -> The timeline shows 2 full weeks: the week with Saturday D-1 and the week with Tuesday D+2.
3. Open the PDF for a Wednesday D. -> The timeline shows 1 full week.
4. Open the PDF for a Saturday D. -> The timeline shows 2 full weeks (D+1 and D+2 fall in the next week).
Expected table (test loops): D weekday | weeks shown = Sunday 2 | Monday-Wednesday 1 | Thursday 1 (D-1 Wed to D+2 Sat) | Friday 2 | Saturday 2. Clean up: remove files.

### TC-016 [FE][BE][MT] Verify Focus timeline at Month zoom spans all full months in the window (BND) [Auto]
Precondition: common; zoom `Month`; a plan crossing 30 June to 3 July style boundary.
Priority: High
Trace: AC-3.4
1. Set zoom to `Month`, export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for the last day of a month D. -> Both the current month and the next month are shown in full.
3. Open the PDF for the first day of a month D. -> Both the previous month and the current month are shown in full.
4. Open the PDF for a mid-month D. -> One full month is shown.
Expected table: D | months shown = last day of month 2; first day 2; day 5-25 1; day 28 of a 31-day month 1; day 29 of a 31-day month 1; day 30 of a 31-day month 2 (D+2 is day 1 of the next month); day 31 of a 31-day month 2.

### TC-017 [FE][BE][MT] Verify the first and last day keep the full 4-day span with empty columns (BND) [Auto]
Precondition: common; plan with known event start and end.
Priority: High
Trace: AC-3.5
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for Day1. -> The timeline spans D-1 to D+2; the column for D-1 (before event start) is empty but present.
3. Open the PDF for the last day. -> The timeline spans D-1 to D+2; the columns after the event end are empty but present.
Check: 4 date columns on both. Clean up: remove files.

### TC-018 [FE][BE][MT] Verify a long task bar is clipped at the window but table dates are not (BND) [Partial: bar clip checked by eye]
Precondition: common; a task starts 6 days before D and ends 6 days after D.
Priority: High
Trace: AC-3.6
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> The bar starts at the left edge (D-1 00:00:00) and ends at the right edge (D+2 23:59:59).
3. Read the Start and End columns of that task. -> They show the true scheduled dates, not the window dates.

### TC-019 [FE][BE][MT] Verify a milestone on D is shown as a diamond at its date and time (POS) [Partial: marker shape checked by eye]
Precondition: common; a 0-duration task on D at a known time.
Priority: Medium
Trace: AC-3.7
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for D. -> The milestone is listed and drawn as a diamond at its scheduled date and time.
3. Open the PDF for D+1. -> The milestone is not listed in the table (it is not active on D+1) but may be inside the window; see Q14.

### TC-020 [FE][BE][MT] Verify Focus mode hides dependency arrows to tasks outside the day plan or window (POS) [Partial: arrows checked by eye]
Precondition: common; P and Q active on D and linked; Q linked to R (not active on D); P linked to S whose bar sits beyond D+2.
Priority: Medium
Trace: AC-3.8
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for D. -> The arrow P to Q is shown.
3. Look for arrows to R and S. -> No arrow to R and no arrow leaving the window to S.

### TC-021 [FE][MT] Verify a click on a radio selects it at once (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.1
1. Select `PDF File` and `Daily Plan`. -> Two radios are shown, Full selected.
2. Click `Focus Timeframe` once. -> `Focus Timeframe` is selected at once; Full is not.
3. Click `Full Shutdown Timeframe` once. -> Full is selected at once; Focus is not.
4. Click `Focus Timeframe`, then click `Full Shutdown Timeframe` again by hand, then click `Export`. -> The drawer closes and the export starts.
5. Open the PDF for a middle date D. -> The file is a Full export: the timeline scale follows that day's tasks, not the fixed 4-day window.
Clean up: remove files.

### TC-022 [FE][MT] Verify Focus choice stays after switching mode and file type inside one drawer session (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.2
1. Select `PDF File`, `Daily Plan`, then `Focus Timeframe`. -> Focus is selected.
2. Switch `Export Mode` to `Overall`. -> One locked radio `Full Shutdown Timeframe` is shown.
3. Switch `Export Mode` back to `Daily Plan`. -> `Focus Timeframe` is still selected.
4. Switch `File Type` to `Excel File`, then back to `PDF File` and `Daily Plan`. -> `Focus Timeframe` is still selected.
5. Switch `Export Mode` to `Overall` and click `Export`. -> The drawer closes and the export starts.
6. Open the Overall PDF. -> It is a normal Overall export of the whole schedule, with no 4-day Focus window.
7. Click `Export`, select `Excel File`, then click `Export`. -> The drawer closes and the Excel file is downloaded with the full data, with no Focus limit.
Clean up: remove files.

### TC-023 [FE][MT] Verify reopening the drawer after Export restores Full Shutdown Timeframe (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.3
1. Select `PDF File`, `Daily Plan`, `Focus Timeframe`. -> Focus is selected.
2. Click `Export`. -> The drawer closes at once.
3. Click `Export` on the page again, select `PDF File` and `Daily Plan`. -> `Full Shutdown Timeframe` is selected, `Focus Timeframe` is not.
4. Reload the page, open the drawer, select `PDF File` and `Daily Plan`. -> `Full Shutdown Timeframe` is selected.

### TC-024 [FE][MT] Verify Cancel and a click on the dimmed overlay close the drawer, start no export and reset the choice (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.3
1. Select `Focus Timeframe` and click `Cancel`. -> The drawer closes; no file is generated and no download starts.
2. Reopen the drawer. -> Full is selected.
3. Select `Focus Timeframe` and click the dimmed background. -> The drawer closes; no export starts.
4. Reopen the drawer. -> Full is selected.

### TC-025 [FE][BE][MT] Verify a narrowed filter exports only the days of the filtered range (POS) [Auto]
Precondition: common; a column filter that leaves tasks on 3 consecutive days of a 10-day plan.
Priority: High
Trace: AC-4.4
1. Apply the filter. -> Only the filtered tasks show; record the earliest start and latest end.
2. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
3. Count the daily PDFs. -> One PDF per calendar day from the earliest to the latest date of the filtered tasks, and none outside.
4. Repeat with `Focus Timeframe`. -> The same number of PDFs.
5. Read the names of the PDFs. -> The first filtered day is `Day1` (assumption: the index follows the exported range) and the dates follow the filtered range.
6. Clear the filter and export Daily Plan with `Full Shutdown Timeframe` again. -> One PDF per day of the whole plan range is made again.

### TC-026 [FE][BE][MT] Verify a filter that leaves no task still exports correctly (BND) [Manual: result when nothing is visible is not defined, see Open questions]
Precondition: common
Priority: Medium
Trace: AC-4.4
1. Apply filters so that no task is displayed. -> The table is empty.
2. Click `Export` with Daily Plan. -> The drawer closes; the user sees either a clear message or no file; the page does not crash.

### TC-027 [FE][BE][MT] Verify Export closes the drawer at once while the file is made in the background (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.5
1. Select `PDF File`, `Daily Plan` and click `Export`. -> The drawer closes at once and the Shutdown Logic workspace is shown.
2. Scroll and click a row while the file is being made. -> The workspace still responds.
3. Wait for the download. -> A ZIP (or PDF) is received. Wait for the file before reading it.

### TC-028 [FE][BE][MT] Verify an error toast appears when the export fails (NEG) [Partial: failure is forced by blocking the request]
Precondition: common
Priority: High
Trace: AC-4.5
1. Block the export request (offline or request blocked). -> The network is blocked.
2. Click `Export` with Daily Plan and Focus. -> The drawer closes.
3. Wait for the result. -> An error toast appears; no partial file is offered.
4. Open the drawer again. -> The drawer opens with Full selected and Export usable.

### TC-029 [FE][MT] Verify a fast double click on Export starts one export (Exotic: double click) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.5
1. Select `PDF File` and `Daily Plan`. -> Two radios are shown.
2. Double-click `Export` quickly. -> The drawer closes.
3. Count the downloads. -> One export file set, not two.

### TC-030 [BE][MT] Verify daily PDF file names have the right Day index and no timeframe suffix (POS) [Auto]
Precondition: common; event `Alpha & Beta` style made-up name, plan `Plan 01`; range with at least 10 days.
Priority: High
Trace: AC-4.6
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Read the names of the PDFs inside the ZIP. -> Each is `[ShutdownEventName]_[PlanName]_ShutdownLogic_Day[N]_[YYYYMMDD].pdf`.
3. Check the index. -> Day1, Day2 ... Day9, Day10 run in order without gaps; N follows the active range, not the month.
4. Look for `_Focus` in any name. -> No name has it.
5. Export again with `Full Shutdown Timeframe`. -> The names are the same as in the Focus export.

### TC-031 [BE][MT] Verify the monthly ZIP names and the split when the range crosses a month (BND) [Auto]
Precondition: common; plan from 28 of one month to 3 of the next.
Priority: High
Trace: AC-4.6
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Read the download names. -> Two ZIPs: `[ShutdownEventName]_[PlanName]_ShutdownLogic_DailyPlan_[YYYYMM].zip`, one per calendar month.
3. Open each ZIP. -> Each holds only the daily PDFs of its own month; Day[N] keeps counting across both ZIPs.
4. Look for `_Focus` in the names. -> No name has `_Focus`.
Expected table: month | ZIP suffix | days inside = first month YYYYMM | its days; second month YYYYMM | its days.

### TC-032 [FE][MT] Verify Job Owner can see the Timeframe radios and export (POS) [Auto]
Precondition: logged in as Job Owner with the permission in Pre-conditions.
Priority: High
Trace: AC-1.2, AC-4.5
1. Open the Shutdown Logic page. -> `Export` is shown.
2. Open the drawer and select `PDF File`, `Daily Plan`. -> Both radios are shown with Full selected.
3. Select `Focus Timeframe` and click `Export`. -> The drawer closes and the export starts.
4. Wait for the export to finish. -> The ZIP is downloaded and no error toast appears.
5. Open a PDF of the ZIP. -> It is a Focus export with the 4-day window, same as for Turnaround Manager.
6. Reopen the drawer, select `PDF File` and `Daily Plan`. -> `Full Shutdown Timeframe` is selected, no warning about unsaved changes appears.

### TC-033 [FE][MT] Verify a user without the permission cannot export (NEG) [Manual: no third account on QA, see Q8]
Precondition: a user without Edit Shutdown Logic Table and Visualization.
Priority: High
Trace: AC-1.1
1. Open the Shutdown Logic page. -> The `Export` button is not shown (assumption Q8: hidden for a user without the permission).
2. Open the page link of the export by hand if one exists. -> No export is made.

### TC-034 [FE][BE][MT] Verify Start and End dates in the PDF match the screen (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.6
1. Record Start and End of three tasks on the screen. -> The values are written down.
2. Export Daily Plan with `Focus Timeframe` and open the PDF of a day with those tasks. -> The PDF Start and End equal the recorded values, with no day shift.

### TC-035 [FE][MT] Verify the radios work with the keyboard only (Exotic: keyboard) [Auto]
Precondition: common
Priority: Low
Trace: none (real-user keyboard use)
1. Select `PDF File` and `Daily Plan`, then press Tab until the radios. -> Focus lands on the Timeframe radios in order.
2. Press the Down arrow. -> `Focus Timeframe` is selected.
3. Press Tab to `Export` and press Enter. -> The drawer closes and the export starts.

### TC-036 [BE][MT] Verify an export is not changed by a colleague editing tasks meanwhile (Exotic: two users) [Manual: two real users at once]
Precondition: common; two users on the same plan.
Priority: Low
Trace: none (two users, Q9)
1. User A clicks `Export` with Daily Plan. -> The drawer closes; the export runs.
2. User B changes the Start of a task at once. -> The change is saved for B.
3. Open the finished PDF of A. -> It shows the data as it was when A clicked Export, and shows no broken or half-updated values.

### TC-037 [FE][MT] Verify the Esc key closes the drawer and the choice is reset (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.3
1. Select `PDF File`, `Daily Plan`, then `Focus Timeframe`. -> Focus is selected.
2. Press the `Esc` key. -> The drawer closes (assumption: Esc dismisses like Cancel); no export starts.
3. Reopen the drawer, select `PDF File` and `Daily Plan`. -> `Full Shutdown Timeframe` is selected.
Clean up: close the drawer.

### TC-038 [FE][MT] Verify reload, browser Back and leaving the page with the drawer open reset the choice (Exotic: leaving midway) [Auto]
Precondition: common
Priority: Medium
Trace: AC-4.3
1. Select `PDF File`, `Daily Plan`, `Focus Timeframe`, then reload the page. -> The page reloads and the drawer is not open; no export starts.
2. Open the drawer, select `PDF File`, `Daily Plan`. -> `Full Shutdown Timeframe` is selected.
3. Select `Focus Timeframe`, then click the browser Back button. -> The page leaves Shutdown Logic; no file is generated.
4. Go forward to Shutdown Logic, open the drawer, select `PDF File`, `Daily Plan`. -> `Full Shutdown Timeframe` is selected.
5. Select `Focus Timeframe`, leave through a breadcrumb or another menu tab, then come back and open the drawer. -> `Full Shutdown Timeframe` is selected after `PDF File` and `Daily Plan`; no export was made.

### TC-039 [FE][MT] Verify Job Owner closing the drawer after choosing Focus gets no warning and a reset (NEG) [Auto]
Precondition: logged in as Job Owner with the permission in Pre-conditions.
Priority: Low
Trace: AC-4.3
1. Open the drawer, select `PDF File`, `Daily Plan`, `Focus Timeframe`. -> Focus is selected.
2. Click `Cancel`. -> The drawer closes at once with no unsaved-changes warning.
3. Reopen the drawer and select `PDF File`, `Daily Plan`. -> `Full Shutdown Timeframe` is selected.

### TC-040 [FE][BE][MT] Verify Full mode with a task longer than the day shows the whole task in the scale (BND) [Partial: scale read by eye]
Precondition: common; a task T runs from D-3 to D+4 and is active on D (assumption Q5: scale is widened, not clipped).
Priority: Medium
Trace: AC-2.2
1. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
2. Open the PDF for date D. -> T is listed.
3. Read the timeline start and end. -> The scale starts at the Start of T and ends at the End of T, so the whole bar is visible.

### TC-041 [FE][BE][MT] Verify Focus mode empty day keeps headers and the 4-day grid (BND) [Auto]
Precondition: common; a day D with no active task, middle of the plan.
Priority: High
Trace: AC-3.2
1. Export Daily Plan with `Focus Timeframe`. -> The export finishes.
2. Open the PDF for the empty date D. -> A `Day[N]` PDF exists with the full table headers and an empty table body.
3. Read the timeline. -> The grid shows 4 date columns D-1, D, D+1, D+2 with no task bars.

### TC-042 [FE][BE][MT] Verify the WBS parent returns when a filter is cleared and hides when a filter removes all its children (POS) [Auto]
Precondition: common; Work Header W1 with children C1 active on D and C2 not active on D.
Priority: Medium
Trace: AC-3.3
1. Apply a column filter that hides C1 and keeps C2, export Daily Plan with `Focus Timeframe`, open the PDF for D. -> W1 is not listed and no child of W1 is listed.
2. Clear the filter and export again. -> The export finishes.
3. Open the PDF for D. -> W1 is listed with C1 again.

### TC-043 [FE][BE][MT] Verify each filter kind limits the exported tasks and clearing it restores them (POS) [Auto]
Precondition: common; a plan of 10 days; filter kinds: column filter, toolbar filter, text search, date range, each used once.
Priority: Medium
Trace: AC-2.2, AC-4.4
1. Apply one filter kind and note the earliest start and latest end shown. -> The values are written down.
2. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
3. Count the PDFs and read the scale of one PDF. -> The PDF count and the scale follow the filtered tasks only.
4. Clear the filter and export again. -> The full range of PDFs is made.
Expected table (test loops): filter kind | PDFs follow the filtered range = column filter yes; toolbar filter yes; text search yes (assumption: the visible tasks on screen decide); date range yes.

### TC-044 [FE][BE][MT] Verify a colleague changing or deleting tasks while the drawer is open does not break the export (Exotic: two users) [Manual: two real users at once]
Precondition: common; two users on the same plan.
Priority: Low
Trace: none (two users while the drawer is open)
1. User A opens the drawer and selects `PDF File`, `Daily Plan`, `Focus Timeframe`. -> Focus is selected.
2. User B deletes a task that is on date D and saves. -> The change is saved for B.
3. User A clicks `Export`. -> The drawer closes; the export finishes with no error toast.
4. Open the PDF for D. -> The deleted task is not listed, or the file shows the data as it was, with no broken row (the user's view, see Q9).

### TC-045 [BE][MT] Verify file and ZIP names follow a renamed event or plan (POS) [Auto]
Precondition: common; event `Alpha & Beta` and plan `Plan 01`.
Priority: Medium
Trace: AC-4.6
1. Rename the plan to `Plan 02` on the plan page, then return to Shutdown Logic. -> The page shows the new plan name.
2. Export Daily Plan with `Full Shutdown Timeframe`. -> The export finishes.
3. Read the PDF and ZIP names. -> They contain `Plan 02` and not `Plan 01`.

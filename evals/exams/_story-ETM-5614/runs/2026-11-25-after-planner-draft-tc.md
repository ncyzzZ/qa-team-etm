# Draft test cases - ETM-5614 Manpower Mob Plan: View Table Columns & Category Hierarchy

Story: ETM-5614 (exam copy, `story.md`). Source: Story description and AC only; no analyst.md, no inspector.md, no Figma. AC ids below are numbered by the designer from the Story text because there is no analyst.md.
Existing [QA] subtasks: none known (exam).
Common precondition: QA environment; user is logged in as Turnaround Manager (TM) with View All Manpower Mob Plan Item; an Active Turnaround Plan whose Shutdown Logic has resources, for example `Welder`, `Scaffolder`, `Rigger`, `Electrician`, `Pipefitter`; the Manpower Mob Plan page is open. Navigation path is not in the Story (see Open questions).
Notation: POS positive, NEG negative, BND boundary, `->` separates action and expected result. Names used in data are made up.

## AC numbering used in Trace lines
- AC-0 Pre-conditions (login, View All / View Active permission, on the dashboard page)
- AC-1.1 Snapshotted vs manually added resources; AC-1.2 (i) tooltip; AC-1.3 Required Manpower sub-row; AC-1.4 peak hour value; AC-1.5 editable value; AC-1.6 red text deficit; AC-1.7 snapshotted not deletable; AC-1.8 manual resource structure
- AC-2.1 category rows dark blue, A-Z sort; AC-2.2 daily POB sum; AC-2.3 POB auto recalculation and read-only; AC-2.4 chevron toggle; AC-2.5 Required Manpower stays when collapsed; AC-2.6 personnel sorted by created time; AC-2.7 "No personnel assigned"
- AC-3.1 group headers and child columns; AC-3.2 toggle; AC-3.3 collapsed shows one field; AC-3.4 Onboard Date always visible (and calculated, Data Source); AC-3.5 re-expand; AC-3.6 default expanded
- AC-4 empty state "No resource available to display."

## Coverage map
| Requirement / screen state | Technique | Risk | Planned cases |
|---|---|---|---|
| AC-0 permission | Roles | wrong role sees or changes data | TC-001, TC-002, TC-003 |
| AC-3.6 default | Screen state | page opens collapsed | TC-004 |
| AC-3.1 group headers | Input groups | missing or wrong child column (AC says Vessel No., Data Source says Route No.) | TC-005 |
| AC-3.2, AC-3.3, AC-3.4, AC-3.5 collapse columns | Condition table | wrong field kept, Onboard Date hidden | TC-006, TC-007, TC-008, TC-009 |
| Leaving and coming back (collapse state) | Leaving and coming back | state lost or kept unexpectedly | TC-010 |
| AC-2.1 sort | Edge values, L-1 | `Rigger 10` before `Rigger 2`, case, manual vs snapshotted mixed | TC-011 |
| AC-1.2, AC-1.3 sub-row and (i) | Screen state | no icon, wrong text | TC-012 |
| AC-1.1, AC-1.8 manual resource | State | sub-row or icon wrongly shown | TC-013 |
| AC-1.4 peak hour | Condition table | wrong max (hour 0, hour 23, equal values) | TC-014 |
| AC-1.5 editable | Field interaction | cannot edit, red not refreshed | TC-015 |
| AC-1.6 red text | Edge values | red at equal, not red below | TC-016, TC-017 |
| AC-1.7 delete lock | Roles / state | delete shown on baseline | TC-018 |
| AC-2.2 daily POB | Edge values | off by one day at Onboard and Demob | TC-019 |
| AC-2.3 recalculation | Effects and their reverse | stale POB after add, delete, date change | TC-020, TC-021 |
| AC-3.4 Onboard Date calculation | Condition table | Vessel +1 wrong at month and year end | TC-022 |
| AC-2.4, AC-2.5 category collapse | State changes | Required row hidden | TC-023, TC-024 |
| AC-2.6 personnel order | Error guessing | edit moves the row | TC-025 |
| AC-2.7 placeholder | Screen state | placeholder missing, stays after add | TC-026 |
| AC-4 empty | Screen state | blank page | TC-027 |
| Fixed-list columns shown (Accommodation, D/N Shift, Hot Bed, Transportation, Dlog Status) | Effects and their reverse | wrong text for non-default value | TC-028 |
| Date format DD Mon YYYY | Input groups | wrong format | TC-029 |
| Strange and long text in Name, Company, Department, Route No., Booking No., Dlog Status | Strange input | layout break, wrong show | TC-030 |
| Very many rows and wide timeline | Screen state | rows of two panels not aligned | TC-031 |
| Column collapse plus category collapse together | Combinations | state clash | TC-032 |
| Two users at once (lesson 1, 8) | Real-user view | stale POB | TC-033 |
| Expand one group at a time, button names, order of child columns | Screen state | wrong child shown, wrong order | TC-039, TC-005 |
| `No.` column, Mob Route and Demob Route rows (not in Story) | Screen state | wrong numbering | TC-034, TC-035 |
| Empty cell placeholders, Demob Date read-only | Screen state | field cannot be filled | TC-036, TC-037 |
| Deleted link, JO on Inactive plan | Permission, state | blank page, data leak | TC-038, TC-002 |
| Left and right panes aligned, timeline range | Screen state | rows off by one | TC-040, TC-031 |
| Page title, breadcrumb, header buttons | Page display | wrong or enabled Save | TC-041 |
| Category row and Required row look, menu contents | Page display, roles | wrong colour, delete shown | TC-042, TC-043, TC-018 |
| Same data on many pages (Resource name, Required vs Shutdown Logic) | Lesson 8 | values differ | TC-014 |

### Categories (lessons-learned 1-9 and section 10)
1 two users: relevant (TC-033). 2 filter + sort + search: not relevant, the Story has no filter or search. 3 old data after migrations: not relevant, new page. 4 strange input: relevant (TC-030; the table is view-only, values come from add/edit of ETM-5835 and similar). 5 reordering changes calculation: relevant, sort A-Z must not change POB (TC-011). 6 linked data: relevant (TC-020, TC-021, TC-014). 7 charts: not relevant, no chart. 8 same data on many pages: relevant (TC-014). 9 matrix: relevant (TC-006, TC-019, TC-022 with tables).
L-1 text sort with numbers: TC-011. L-2 filter choice not kept: not relevant, no filter; collapse state kept covered by TC-010. L-3 search read too early: not relevant. L-4 multi-row paste: not relevant, no paste in this Story. L-5 collapse per level: TC-023, TC-024, TC-032. L-6 case variants: TC-011 (case in sort). L-7 selected state: not relevant, no picker. L-8 Story text changed: no changelog in this exam copy; noted.
Skipped on purpose: keyboard Tab/Enter order, no input fields in this Story (the Required Manpower inline edit is owned by ETM-5616); paste, date picker, number format: not in this Story.

### Counts
High 20, Medium 16, Low 7 (43 cases). Auto 35, Partial 5, Manual 3. Priority is by damage, the Story has no priority.

Revision 2 (after the walk-through plan of the real screen): TC-034 to TC-043 added; TC-002, TC-005, TC-007, TC-011, TC-013, TC-018, TC-019, TC-026 got more steps. Where the screen differs from the Story, the Expected Result stays as the Story says and the difference is in Open questions 12 to 21.

## Test cases (43 flows)

### TC-001 [FE][MT] Verify TM with View All permission sees the Manpower Mob Plan table (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-0
1. Log in as Turnaround Manager and open the Manpower Mob Plan page. -> The page opens with the table pane and the column groups `Resource`, `Mob`, `Onboard Date`, `Demob`, `Reservation`.
2. Look at the rows. -> Resource category rows are shown with their personnel rows.
Automation: Starting data: Active plan with resources. What to check: group header texts and at least one category row. Data set: none. Clean up: none.

### TC-002 [FE][MT] Verify Job Owner with View Active permission sees the table for the Active plan only (POS) [Auto]
Precondition: common, but log in as Job Owner (JO) with View Active Manpower Mob Plan Item
Priority: High
Trace: AC-0
1. Open the Manpower Mob Plan page of the Active plan. -> The table shows the same resource categories and columns as the TM sees.
2. Look for any edit or delete control on category rows. -> JO has no delete action on any category row.
3. Look for the buttons `Add Resource`, `Add Personnel`, `Delete row` and the `Edit Resource` / `Delete Resource` menu items. -> None of them is enabled for JO (JO is view only; the screen was seen with them enabled, see Open questions).
4. Try to open the Manpower Mob Plan of a plan that is not Active (direct link). -> The page shows `Access Denied` and `If you need access to the Application, please send a request with your details.`; no plan data is shown to JO.
Automation: Starting data: one Active and one Inactive plan. What to check: rows visible for Active, not visible for Inactive, exact Access Denied texts. Clean up: none.

### TC-003 [FE][MT] Verify a user without any Manpower Mob Plan permission cannot see the table (NEG) [Auto]
Precondition: a user without View All or View Active Manpower Mob Plan Item (no such QA account exists, see Open questions)
Priority: High
Trace: AC-0
1. Log in as that user and open the direct link of the Manpower Mob Plan page. -> No resource category, personnel row or Required Manpower value is shown to the user.
2. Look at the menu. -> The Manpower Mob Plan entry is not offered to this user.
Automation: depends on an account; mark Manual until an account exists.

### TC-004 [FE][MT] Verify all column groups and categories are expanded on first load (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.6, AC-2.4
1. Open the Manpower Mob Plan page for the first time in a fresh browser session. -> Groups `Resource`, `Mob`, `Demob`, `Reservation` show all their child columns.
2. Look at each category header. -> Each chevron shows the expanded state (v) and the personnel rows are visible.
Automation: Starting data: plan with at least one resource with personnel. Clean up: clear browser storage.

### TC-005 [FE][MT] Verify the child columns of every column group (POS) [Partial: Story conflict, a person confirms the real column names]
Precondition: common
Priority: High
Trace: AC-3.1
1. Look at the `Resource` group header. -> The group shows `* Name`, `Company`, `Department`, and also `Accommodation`, `D/N Shift`, `Hot Bed` if the build keeps them here (see Open questions).
2. Look at the `Mob` group. -> It shows `Transportation`, `Mob Date` and a number column (`Vessel No.` in the AC, `Route No.` in the Data Source).
3. Look between `Mob` and `Demob`. -> The `Onboard Date` column is shown with no group header above it.
4. Look at the `Demob` group. -> It shows `Transportation`, `Demob Date` and a number column (`Vessel No.` / `Route No.`).
5. Look at the `Reservation` group. -> It shows `Dlog Status`, `Booking No.` and, in the AC, `Hot Bed`.
6. Check that every group header has a chevron (>) toggle. -> `Resource`, `Mob`, `Demob` and `Reservation` each show a chevron.
7. Read the header texts of the mandatory columns. -> `* Name` (Story), `* Accommodation`, `* D/N Shift` and `* Hot Bed` carry the `*` mark; `Company`, `Department`, `Transportation`, `Mob Date`, `Demob Date` do not. (The screen shows `Name` without `*` and adds `* Resource Type`; see Open questions.)
8. Read the order of the child columns of each group from left to right. -> `Resource`: Name, Company, Department, Accommodation, D/N Shift, Hot Bed; `Mob`: Transportation, Mob Date, number column; `Onboard Date`; `Demob`: Transportation, Demob Date, number column; `Reservation`: Dlog Status, Booking No.

### TC-006 [FE][MT] Verify collapsing each group keeps exactly one primary field (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2, AC-3.3
1. Click the chevron of the `Resource` group. -> Only `Name` stays; `Company`, `Department`, `Accommodation`, `D/N Shift`, `Hot Bed` are hidden.
2. Click the chevron of the `Mob` group. -> Only `Mob Date` stays; `Transportation` and `Route No.` are hidden.
3. Click the chevron of the `Demob` group. -> Only `Demob Date` stays; `Transportation` and `Route No.` are hidden.
4. Click the chevron of the `Reservation` group. -> Only `Dlog Status` stays; `Booking No.` is hidden.
Automation: Test data set: expected-values table below, the test loops over every row. Starting data: any plan with personnel. Clean up: re-expand or reload.
| Group | Column kept | Columns hidden |
|---|---|---|
| Resource | Name | Company, Department, Accommodation, D/N Shift, Hot Bed |
| Mob | Mob Date | Transportation, Route No. |
| Demob | Demob Date | Transportation, Route No. |
| Reservation | Dlog Status | Booking No. |

### TC-007 [FE][MT] Verify Onboard Date stays visible when every group is collapsed (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.4
1. Collapse `Resource`, `Mob`, `Demob` and `Reservation` one by one. -> After each click the `Onboard Date` column is still visible with its values.
2. Look at the header of `Onboard Date`. -> It has no chevron and is not under any group.
3. Expand all four groups. -> `Onboard Date` is still visible.
4. Collapse only `Mob` and `Reservation`, leave `Resource` and `Demob` expanded. -> `Onboard Date` is still visible.
5. Collapse only `Resource` and `Demob`, leave `Mob` and `Reservation` expanded. -> `Onboard Date` is still visible.
Automation: Starting data: personnel with Mob and Demob dates. What to check: column visible after each step and in every combination of the four groups (16 combinations, the test loops).

### TC-008 [FE][MT] Verify re-expanding a collapsed group restores all child columns (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.5
1. Collapse the `Mob` group. -> Only `Mob Date` is shown for that group.
2. Click the chevron of the `Mob` group again. -> `Transportation`, `Mob Date` and the number column are all visible again.
3. Compare the values in the restored columns with the values before collapsing. -> The values are the same as before.
Automation: loop over all four groups with the same table as the collapse case. Clean up: none.

### TC-009 [FE][MT] Verify collapse and expand pressed many times in a row ends in the right state (BND) [Auto]
Precondition: common
Priority: Low
Trace: AC-3.2, AC-3.5
1. Click the `Demob` chevron five times quickly. -> The group ends collapsed (odd number of clicks) with only `Demob Date` shown.
2. Click it once more. -> The group is expanded with every child column visible.

### TC-010 [FE][MT] Verify the collapse state after reload and after leaving the page (POS) [Manual: the Story does not say if it is kept, a person judges]
Precondition: common
Priority: Medium
Trace: AC-3.6
1. Collapse the `Mob` group and the first category. -> `Mob` shows `Mob Date` only and the category personnel rows are hidden.
2. Reload the page. -> The page opens with all groups and categories expanded (Default State), or keeps the collapse; the result is written down and compared with the BA answer.
3. Open another page of the plan from the menu and come back. -> The state is the same as after the reload in the previous step.

### TC-011 [FE][MT] Verify Resource categories are sorted A to Z, snapshotted and manual together (POS) [Auto]
Precondition: common; Shutdown Logic has resources `Welder`, `scaffolder`, `Rigger 10`, `Rigger 2`; two manual resources `Cleaner` and `Zinc worker` are added
Priority: High
Trace: AC-2.1
1. Open the page and read the category names top to bottom. -> The order is A to Z by name: `Cleaner`, `Rigger 2`, `Rigger 10` or `Rigger 10`, `Rigger 2` (the order of numbers is written down and compared with the BA answer), `scaffolder`, `Welder`, `Zinc worker`.
2. Check that a manual and a snapshotted category are mixed in the list. -> Manual categories are not pushed to the end or the top.
3. Add a manual resource named `Boiler` and look again. -> `Boiler` appears between the neighbours in A to Z order.
4. Compare the POB total of `Rigger 2` before and after the new row is added. -> The POB total of every other category stays the same.
5. Check the dark blue colour of every category header. -> All category headers are dark blue (the screen shows a white row with grey name, see Open questions).
6. Read a list that has names with the same start and different case: `AT`, `AT Sort Order`, `Automatic`, `EI`, `Electrician`, `Empty Resource`, `Schneider`, `SSHE`, `SSHE test`. -> The order is the same as written here (case ignored, shorter name before the longer one with the same start).
7. Add a manual resource whose name differs only in case from an existing one, for example `welder` next to `Welder`. -> The new category is placed next to `Welder` and the order of the other categories does not change.
8. Reload the page. -> The order is the same as before the reload.
Automation: Test data set: names list with expected order above plus the case rules per the BA answer. Clean up: delete `Boiler` and `welder`.

### TC-012 [FE][MT] Verify the Required Manpower sub-row and (i) tooltip of a snapshotted resource (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1, AC-1.2, AC-1.3
1. Look under the header of `Welder`. -> A nested row `Required Manpower` is shown directly beneath the category header.
2. Look right after the label `Required Manpower`. -> An information icon (i) is shown.
3. Hover over (i). -> The tooltip shows `Required manpower sourced from shutdown logic schedule.`
4. Move the mouse away. -> The tooltip closes.
5. Repeat step 2 and 3 on `Rigger 2`. -> The same icon and the same tooltip text are shown.
Automation: loop over every snapshotted category. What to check: sub-row exists once per category, tooltip text exact.

### TC-013 [FE][MT] Verify a manually added resource has no Required Manpower row and no (i) icon (NEG) [Auto]
Precondition: common; one manual resource `Cleaner` with two personnel rows
Priority: High
Trace: AC-1.1, AC-1.8
1. Look at the category `Cleaner`. -> The header shows the POB sum and the personnel rows are nested under it.
2. Look for a `Required Manpower` row under the header. -> No `Required Manpower` row is shown.
3. Look for the (i) icon on this category. -> No (i) icon is shown.
4. Open the action menu of `Cleaner`. -> The menu offers rename (`Edit Resource`) and `Delete Resource`.

### TC-014 [FE][BE][MT] Verify Required Manpower equals the peak hourly headcount of each date (POS) [Partial: needs Shutdown Logic data, expected values come from the histogram]
Precondition: common; the `Welder` utilization in Shutdown Logic differs by hour on the same date
Priority: High
Trace: AC-1.4, AC-1.1
1. Open the Shutdown Logic histogram and write down the hourly headcount of `Welder` for three dates, including one date with the peak at 00:00 and one with the peak at 23:00. -> The hourly values are written down for each date.
2. Open the Manpower Mob Plan page and read the `Required Manpower` value of `Welder` for the same dates. -> Each value equals the highest hourly headcount written down for that date.
3. Read a date where the headcount is the same for all hours. -> The value equals that headcount.
4. Read a date where `Welder` is not used. -> The value is the same as the histogram shows (0 or blank, the BA answer is compared).
5. Compare the resource names on both pages. -> Every resource name matches the Shutdown Logic name exactly.
Automation: Test data set: date / hourly values / expected max, the test loops. Clean up: none (read only).

### TC-015 [FE][MT] Verify a Required Manpower value can be edited and the colour follows (POS) [Auto]
Precondition: common; `Welder` has POB 2 on date D and Required Manpower 2 on date D
Priority: Medium
Trace: AC-1.5, AC-1.6
1. Double-click the `Required Manpower` cell of `Welder` on date D. -> The cell goes into edit mode.
2. Type `3` and confirm. -> The cell shows `3` in red font because POB 2 is less than 3.
3. Change the cell back to `2` and confirm. -> The cell shows `2` in normal font.
4. Press Esc while the cell shows a typed `3`. -> The cell keeps `2`.
5. Reload the page. -> The value on date D is the one confirmed last (`2`).
Automation: Clean up: restore the original value.

### TC-016 [FE][MT] Verify red text appears only when POB is less than Required Manpower (BND) [Auto]
Precondition: common; `Welder` with Required Manpower 3 on dates D1, D2, D3
Priority: High
Trace: AC-1.6
1. Make the POB of `Welder` on D1 = 2 (less than 3). -> The Required Manpower number on D1 is red.
2. Make the POB on D2 = 3 (equal). -> The number on D2 is not red.
3. Make the POB on D3 = 4 (more). -> The number on D3 is not red.
4. Check the Required Manpower numbers of other dates. -> Only D1 is red; the other dates keep normal colour.
5. Check that the POB number in the header on D1 is not red. -> Only the Required Manpower number is red.
Automation: Test data set: POB / Required / expected colour table (2<3 red, 3=3 not red, 4>3 not red, 0<1 red, 0=0 not red). The test loops.

### TC-017 [FE][MT] Verify red text goes away when the deficit is fixed and returns when it is created again (POS) [Auto]
Precondition: common; `Welder` with Required Manpower 3 and POB 2 on date D
Priority: High
Trace: AC-1.6, AC-2.3
1. Look at date D. -> The Required Manpower number is red.
2. Add a worker to `Welder` whose Onboard Date is on or before D and Demob Date is after D. -> POB on D becomes 3 and the number is no longer red.
3. Change the Demob Date of that worker to D. -> POB on D becomes 2 and the number is red again.
4. Delete the worker. -> POB on D is 2 and the number is red.
Automation: Clean up: delete the added worker.

### TC-018 [FE][MT] Verify snapshotted categories show no delete action (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-1.7, AC-1.8
1. Open the action menu of the snapshotted category `Welder`. -> The menu has no delete action.
2. Look at the rest of the row for a delete icon. -> No delete icon is shown.
3. Open the action menu of the manual category `Cleaner`. -> A delete action (`Delete Resource`) is shown.
4. Open the `...` menu of a snapshotted category that has a Required Manpower row (for example `EI`) and read its items. -> The menu does not offer `Delete Resource` (the screen shows `Edit Resource` and `Delete Resource` enabled on snapshotted categories, see Open questions).
Automation: loop over every snapshotted category. Do not click Delete on shared data.

### TC-019 [FE][MT] Verify the daily POB sum counts a worker only from Onboard Date up to the day before Demob Date (BND) [Auto]
Precondition: common; resource `Rigger 2` with a worker `Somchai Test` with Onboard Date 10 Jun 2026 and Demob Date 14 Jun 2026
Priority: High
Trace: AC-2.2
1. Read the `Rigger 2` header POB on 09 Jun 2026, 10 Jun 2026, 13 Jun 2026, 14 Jun 2026, 15 Jun 2026. -> The worker counts on 10, 11, 12, 13 Jun and does not count on 09, 14 and 15 Jun.
2. Add a second worker with the same dates. -> The POB on 10 to 13 Jun is 2 more than the first reading minus one worker, and still 0 on 14 Jun for these workers.
3. Add a worker with Onboard Date equal to Demob Date. -> The worker never counts in the POB.
4. Add a worker who has no Mob Date and no Demob Date and read the POB on every date. -> The worker counts 0 on every date.
5. Read the POB of a category whose workers have staggered dates (worker 1 on 18 to 22 May, worker 2 on 19 to 23 May, worker 3 on 20 to 24 May). -> The POB per date from 17 May is `0 1 2 3 3 2 1 0`: the demob day of each worker is not counted.
Automation: Test data set: date / expected POB table. Clean up: delete the added workers.

### TC-020 [FE][MT] Verify the POB sum recalculates after add, delete and date changes (POS) [Auto]
Precondition: common; resource `Welder` with worker `Somchai Test` (Mob Date 10 Jun 2026, Helicopter, Demob Date 14 Jun 2026)
Priority: High
Trace: AC-2.3, AC-2.2
1. Write down the POB of `Welder` for 10 to 14 Jun 2026. -> The values are written down for comparison.
2. Add a worker with Mob Date 11 Jun 2026 and Demob Date 13 Jun 2026. -> POB on 11 and 12 Jun is one higher than written down; other dates are the same.
3. Change that worker's Mob Date to 12 Jun 2026. -> POB on 11 Jun goes back to the written value; 12 Jun stays one higher.
4. Change that worker's Demob Date to 15 Jun 2026. -> POB is one higher on 12, 13 and 14 Jun.
5. Delete that worker. -> All POB values are the same as the values written down in the first step.
6. Reload the page. -> The values are still the same.
Automation: Clean up: the worker is deleted in step 5.

### TC-021 [FE][MT] Verify the category POB cells cannot be edited (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.3
1. Double-click a POB cell in the dark blue header of `Welder`. -> The cell does not go into edit mode.
2. Press Enter and type a number while the cell is selected. -> The value in the cell does not change.

### TC-022 [FE][MT] Verify Onboard Date is calculated from Transportation and cannot be edited (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.4
1. Set a worker's Mob Date to 10 Jun 2026 with Transportation `Helicopter`. -> Onboard Date shows `10 Jun 2026`.
2. Change Transportation to `MSB`. -> Onboard Date shows `10 Jun 2026`.
3. Change Transportation to `Vessel`. -> Onboard Date shows `11 Jun 2026`.
4. Set Mob Date to 30 Jun 2026 with `Vessel`. -> Onboard Date shows `01 Jul 2026`.
5. Set Mob Date to 31 Dec 2026 with `Vessel`. -> Onboard Date shows `01 Jan 2027`.
6. Change Transportation back to `Helicopter`. -> Onboard Date shows `31 Dec 2026` again.
7. Double-click the Onboard Date cell. -> The cell does not go into edit mode.
8. Check the POB of the category for the worker on 31 Dec 2026 with `Vessel`. -> The worker is not counted on 31 Dec 2026 and is counted from 01 Jan 2027.
Automation: Test data set: Transportation / Mob Date / expected Onboard Date table above. Clean up: restore the worker.

### TC-023 [FE][MT] Verify collapsing a snapshotted category hides personnel but keeps Required Manpower (POS) [Auto]
Precondition: common; `Welder` with two personnel rows
Priority: High
Trace: AC-2.4, AC-2.5
1. Click the chevron of `Welder`. -> The chevron changes to `>`; the personnel rows are hidden.
2. Look beneath the header. -> The `Required Manpower` row with its values and the (i) icon stays visible directly beneath the header.
3. Hover over (i). -> The tooltip text `Required manpower sourced from shutdown logic schedule.` is shown.
4. Click the chevron again. -> The chevron changes to `v`; both personnel rows are visible again in the same order.
5. Collapse and expand twice more. -> The Required Manpower row is visible in every state and its values do not change.
Automation: loop over every snapshotted category.

### TC-024 [FE][MT] Verify collapsing a manual category hides all rows under the header (POS) [Auto]
Precondition: common; manual `Cleaner` with two personnel rows
Priority: Medium
Trace: AC-2.4, AC-1.8
1. Click the chevron of `Cleaner`. -> The personnel rows are hidden and no Required Manpower row is shown.
2. Click the chevron again. -> The two personnel rows are shown again.

### TC-025 [FE][MT] Verify personnel rows are sorted by created time, old to new (POS) [Auto]
Precondition: common; resource `Welder` with workers created in this order: `Anan Test`, `Boon Test`, `Chai Test`
Priority: Medium
Trace: AC-2.6
1. Read the personnel names under `Welder`. -> The order is `Anan Test`, `Boon Test`, `Chai Test`.
2. Add a worker `Aaron Test`. -> `Aaron Test` is shown last (newest), not in A to Z order.
3. Edit the Company of `Anan Test`. -> The row stays first.
4. Reload the page. -> The order is the same as before.
Automation: Clean up: delete `Aaron Test`.

### TC-026 [FE][MT] Verify "No personnel assigned" placeholder (POS) [Auto]
Precondition: common; snapshotted `Scaffolder` with no personnel; manual `Cleaner` with no personnel
Priority: Medium
Trace: AC-2.7
1. Look under `Scaffolder`. -> The `Required Manpower` row is shown and the row `No personnel assigned` is directly beneath it.
2. Look under `Cleaner`. -> The row `No personnel assigned` is directly beneath the header.
3. Add one worker to `Cleaner`. -> The placeholder disappears and the worker row is shown.
4. Delete that worker. -> The placeholder `No personnel assigned` is shown again.
5. Collapse `Scaffolder`. -> The placeholder is hidden or shown as the BA answer says; the `Required Manpower` row stays.
6. Collapse the manual category `Cleaner` while it has no personnel. -> Only the category row stays; whether the placeholder is hidden is written down and compared with the BA answer.
7. Read the placeholder text character by character. -> The text is `No personnel assigned` (the screen shows it with a full stop, see Open questions) and the `No.` column is empty on that row.
Automation: Clean up: none, the added worker is deleted.

### TC-027 [FE][MT] Verify the empty state when Shutdown Logic has no data (NEG) [Auto]
Precondition: a plan whose Shutdown Logic has no resource, and no manual resource added
Priority: High
Trace: AC-4
1. Log in and open the Manpower Mob Plan page of that plan. -> The page shows `No resource available to display.`
2. Check the table body. -> No category row and no empty table frame with column headers only is shown (the BA answer says if headers stay).
3. Check that no other message is shown. -> Only this one message is shown.
4. Add a manual resource if the page allows it. -> The message goes away and the category is shown.
Automation: Starting data: plan with empty Shutdown Logic (own data). Clean up: delete the plan.

### TC-028 [FE][MT] Verify every value of a fixed-list column is shown correctly (POS) [Auto]
Precondition: common; workers set to each value in the table below (through the add/edit of ETM-5835 and neighbours)
Priority: High
Trace: AC-3.1, AC-3.3
1. Set a worker's values to the first row of the table and read the cells. -> The cells show exactly the texts in the table.
2. Repeat for every other row. -> Each row shows exactly its texts; no value is shown as a code or empty.
3. Collapse the `Resource` group. -> Only `Name` stays; the values are not shown anywhere else.
4. Expand again and reload. -> The values are the same.
Automation: Test data set below, the test loops.
| Accommodation | D/N Shift | Hot Bed | Transportation (Mob) | Transportation (Demob) |
|---|---|---|---|---|
| LQ | Day | Yes | Helicopter | Helicopter |
| Barge | Night | No | MSB | MSB |
| FSO | Day | No | Vessel | Vessel |

### TC-029 [FE][MT] Verify dates are shown as DD Mon YYYY (POS) [Auto]
Precondition: common; worker with Mob Date 05 Jun 2026 and Demob Date 20 Jun 2026
Priority: Medium
Trace: AC-3.1, AC-3.4
1. Read Mob Date, Onboard Date and Demob Date of the worker. -> They show `05 Jun 2026`, `05 Jun 2026` and `20 Jun 2026`.
2. Use a date with a one-digit day and a December date. -> `05 Dec 2026` shows with a leading zero and the English month name.

### TC-030 [FE][MT] Verify long and unusual text in the text columns is shown without breaking the table (NEG) [Partial: look of the cell needs a person]
Precondition: common; text values entered through the screen that sets them
Priority: Low
Trace: AC-3.1
1. Set Name to a 256-character value. -> The table shows the cell without breaking the layout; the full text is available (tooltip or wider cell).
2. Set Company to `A&B <Co> "Test" / Ltd`, Department to a 64-character Thai text, Route No. to a 30-character value, Booking No. to a 30-character value, Dlog Status to a 20-character value. -> Each cell shows its text exactly as typed; no HTML is run.
3. Check that the neighbouring columns are in the same place for these rows. -> Columns stay aligned with the other rows.
4. Reload. -> Values are the same.

### TC-031 [FE][MT] Verify a wide timeline with very many rows stays aligned (POS) [Manual: look and scroll feel need a person]
Precondition: common; at least 30 categories and 100 personnel rows
Priority: Low
Trace: none (screen state: very many rows)
1. Scroll down to the last category. -> The left columns and the date columns show the same row at the same height.
2. Scroll right to the last date. -> The `Name` column stays aligned with the date cells.
3. Collapse the `Resource` group. -> The rows still line up with the date columns.

### TC-032 [FE][MT] Verify collapsing columns and categories together (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4, AC-2.5, AC-3.3
1. Collapse the `Resource` group and the category `Welder`. -> Only `Name` is shown; personnel rows of `Welder` are hidden; the `Required Manpower` row stays.
2. Expand the `Resource` group. -> All Resource columns are shown; `Welder` stays collapsed with the Required Manpower row visible.
3. Expand `Welder`. -> Personnel rows are shown again.

### TC-033 [FE][MT] Verify POB is right when a second user changes personnel at the same time (POS) [Manual: needs two real users]
Precondition: common; two users open the same plan in two browsers
Priority: Medium
Trace: AC-2.3
1. User A and user B both open `Welder`. -> Both see the same POB values.
2. User B adds a worker with dates inside the shown range. -> User B sees the POB change.
3. User A reloads the page. -> User A sees the same POB as user B.
4. User A deletes the worker that user B just added. -> A message or the updated data shows and POB matches on both pages after a reload.

### TC-034 [FE][MT] Verify the No. column runs across all categories (POS) [Auto]
Precondition: common; a plan with at least two categories that have personnel (Story is silent about this column, see Open questions)
Priority: Medium
Trace: none (screen state: No. column, not in Story)
1. Read the `No.` column of the first category's personnel rows. -> The numbers start at `1` and go up by one for each person.
2. Read the `No.` column of the next category's personnel rows. -> The numbers continue from the last number of the category above, not from `1` again.
3. Look at the category rows, the `Required Manpower` rows and the `No personnel assigned` rows. -> They have no number.
4. Collapse the first category. -> The numbers of the remaining rows do not change (or are written down and compared with the BA answer).
Automation: Starting data: plan with two categories with personnel. What to check: numbers in display order. Clean up: none.

### TC-035 [FE][MT] Verify the pinned Mob Route and Demob Route rows (POS) [Auto]
Precondition: common (Story is silent about these rows)
Priority: Low
Trace: none (screen state: pinned rows)
1. Look above the first category. -> Two rows `Mob Route` and `Demob Route` are shown.
2. Scroll down through the categories. -> Both rows stay at the top of the table.
3. Scroll right through the dates. -> The row labels stay visible and the rows line up with the date columns.
Automation: What to check: both labels visible after scroll. Clean up: none.

### TC-036 [FE][MT] Verify empty cells show the column name as grey hint text (POS) [Auto]
Precondition: common; one worker with no Company, no Mob Date and no Dlog Status
Priority: Low
Trace: none (screen state: empty cell)
1. Look at the empty `Company`, `Mob Date` and `Dlog Status` cells of that worker. -> Each cell shows its column name (`Company`, `Mob Date`, `Dlog Status`) as grey hint text.
2. Fill the `Company` cell with `Siam Test Co`. -> The hint text is replaced by `Siam Test Co` in normal font.
3. Clear the `Company` cell. -> The grey hint text `Company` is shown again.
Automation: Test data set: column / hint text, the test loops. Clean up: restore the worker.

### TC-037 [FE][MT] Verify only Onboard Date is view-only and Demob Date can be edited (POS) [Auto]
Precondition: common; one worker with a Mob Date and a Demob Date
Priority: Medium
Trace: AC-3.4
1. Double-click the `Onboard Date` cell. -> The cell does not go into edit mode.
2. Double-click the `Demob Date` cell. -> The cell goes into edit mode as the Story lists only Onboard Date as view-only (the screen marks `Demob Date` read-only too, see Open questions).
3. Press Esc. -> The `Demob Date` keeps its value.
Automation: What to check: edit mode per column. Clean up: none.

### TC-038 [FE][MT] Verify the message when the Manpower Mob Plan was deleted (NEG) [Partial: needs a deleted item; Story is silent]
Precondition: the direct link of a Manpower Mob Plan item that was deleted
Priority: Medium
Trace: none (screen state: link to deleted data)
1. Open the direct link. -> A dialog shows the title `Unable to View Manpower Mob Plan` and the text `The manpower mob plan has already been deleted.` with the button `OK`; no plan data is shown behind it.
2. Click `OK`. -> The user goes to the Planning tab of the event.
Automation: Starting data: a card-owned item that the test deletes first. Clean up: none.

### TC-039 [FE][MT] Verify expanding one group at a time adds only that group's columns (POS) [Auto]
Precondition: common; the groups are collapsed
Priority: Medium
Trace: AC-3.2, AC-3.1
1. Read the header while all groups are collapsed. -> The header shows `No.`, `Name`, `Mob Date`, `Onboard Date`, `Demob Date`, `Dlog Status`.
2. Click `Expand Resource`. -> Only the Resource children appear (Company, Department, Accommodation, D/N Shift, Hot Bed); the other groups do not change.
3. Click `Expand Mob`. -> `Transportation` and the number column appear before and after `Mob Date` in this order: Transportation, Mob Date, number column.
4. Click `Expand Demob`. -> `Transportation` and the number column appear: Transportation, Demob Date, number column.
5. Click `Expand Reservation`. -> `Booking No.` appears after `Dlog Status`.
6. Check the buttons. -> Each button is now named `Collapse <group>` and shows the expanded state.
Automation: Test data set: group / columns added / order, the test loops. Clean up: reload.

### TC-040 [FE][MT] Verify left and right panes stay lined up and the timeline starts at the plan range (POS) [Partial: pixel row heights need a person to judge]
Precondition: common; a plan whose dates are not in the current month
Priority: Medium
Trace: none (screen state: two panes)
1. Read the first date column of the timeline. -> It is the first date of the plan range, not the current month.
2. Compare the top of each left row with the same right row (pinned route rows, category, Required Manpower, personnel). -> Each pair has the same top and the same height.
3. Collapse and expand a column group and a category. -> The rows still line up.
4. Scroll down. -> The rows still line up.
Automation: What to check: row tops and heights equal in both panes. Clean up: none.

### TC-041 [FE][MT] Verify the page title, breadcrumb and header buttons (POS) [Auto]
Precondition: common; plan named `eND50` in an event named `Event A`
Priority: Low
Trace: none (page display; Story is silent)
1. Read the page title and the breadcrumb. -> Title `Manpower Mob Plan: eND50`; breadcrumb `Shutdown Event List / Event A / Manpower Mob Plan: eND50`.
2. Look at the header buttons without changing anything. -> `Export` is enabled and `Save` is disabled.
3. Look at the toolbar. -> `Add Resource`, `Set Route` and the two icon buttons are shown; the filter button shows the tooltip `Filter Panel` on hover.
Automation: What to check: texts and Save state. Clean up: none.

### TC-042 [FE][MT] Verify the look of the category row and the Required Manpower row (POS) [Auto]
Precondition: common; a snapshotted category `Welder`
Priority: Low
Trace: AC-2.1, AC-1.3
1. Look at the category row of `Welder`. -> The row is highlighted dark blue (the screen shows white with grey name, see Open questions) and has a chevron, `Add Personnel` and a `...` menu.
2. Look at the `Required Manpower` row. -> The row is a grey nested row directly under the category row, with the label and the (i) icon right after it.
Automation: What to check: background colour value agreed with the BA. Clean up: none.

### TC-043 [FE][MT] Verify the controls of category and personnel rows for TM (POS) [Auto]
Precondition: common; manual category `Cleaner` with one worker
Priority: Medium
Trace: AC-1.8, AC-1.7
1. Open the `...` menu of `Cleaner`. -> The items `Edit Resource` and `Delete Resource` are shown.
2. Look at the worker row. -> A `Delete row` icon is shown next to the name.
3. Click `Add Personnel` on the `Cleaner` row. -> A new personnel row is added under `Cleaner` as the last row.
4. Delete the new row with `Delete row`. -> The row is removed and the order of the others stays.
Automation: Clean up: the added row is deleted in step 4.

## Open questions
1. Navigation path to the Manpower Mob Plan page is not in the Story. Missing - ask.
2. AC-3.1 lists the Resource group as `Name`, `Company`, `Department`, but AC-3.3 says collapsing hides also `Accommodation`, `D/N Shift`, `Hot Bed`; the Data Source puts them in Resource, while AC-3.1 puts `Hot Bed` in Reservation. Which group does Hot Bed belong to? Where are Accommodation and D/N Shift shown?
3. AC-3.1 says `Vessel No.`, the Data Source says `Route No.` for Mob and Demob. Which label does the screen show?
4. Sort A to Z: are `Rigger 10` and `Rigger 2` compared as text or natural numbers? Is upper and lower case ignored?
5. Required Manpower on a date where the resource has no utilization: 0, blank or `-`?
6. Does the collapse state of columns and categories survive reload and leaving the page?
7. A placeholder `No personnel assigned` under a collapsed snapshotted category: hidden or visible?
8. Empty state: the AC says "when logging in"; does the empty message also show when only a manual resource exists, and do the column headers stay?
9. Users without a View permission: what does a direct link show? No QA account exists for this role.
10. When Shutdown Logic changes after the snapshot, does Required Manpower stay as the snapshot or refresh?
11. POB when Onboard Date equals Demob Date (zero days on board): counts as 0? (TC-019 assumes 0.)
12. Screen differs from Story: all column groups open collapsed on QA, the Story says Expanded on first load (TC-004 keeps the Story).
13. Screen differs from Story: the Resource group also shows `* Resource Type`, which is not in the Story; Accommodation, D/N Shift and Hot Bed are in Resource, and Reservation has no `Hot Bed` (TC-005). Which is right?
14. Screen differs from Story: the header shows `Name` without `*`; the Story says `* Name` mandatory (TC-005).
15. Screen differs from Story: the category row is white with grey name; the Story says dark blue (TC-011, TC-042).
16. Screen differs from Story: snapshotted categories have `Edit Resource` and `Delete Resource` enabled; the Story says no delete action (TC-018).
17. Screen differs from Story: `Demob Date` is read-only; the Story makes only `Onboard Date` view-only (TC-037).
18. Screen shows `No personnel assigned.` with a full stop; the Story has none. Exact text?
19. Screen shows Add Resource, Add Personnel, Delete row and Edit/Delete Resource enabled for JO on an Active plan; JO is view only (TC-002).
20. Suggestion (not in Story): the `No.` column, the `Mob Route` / `Demob Route` pinned rows, the page title, breadcrumb and header buttons, the deleted-link dialog and the grey hint text in empty cells are on the screen but not in the Story (TC-034, 035, 036, 038, 041). Confirm they are wanted.
21. Suggestion (not in Story): the first load on QA came back blank until a reload when the layout script was slow; is a loading or error state expected? The empty text `No resource available to display.` was not seen on QA (TC-027 still needs a plan with empty Shutdown Logic). After a filter (ETM-5615) should POB and red stay as they were?

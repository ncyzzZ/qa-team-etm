# Draft test cases - ETM-7899 Shutdown Logic - Dedicated Platform and Work Header Filters in Filter Panel

Story: ETM-7899 [Improvement]. Source: story.md (frozen exam copy, description of 2026-11-04). No analyst.md and no inspector.md for this exam: AC ids below follow the Story numbering (AC-1.1 = placement, AC-1.2 = default collapsed, AC-1.3 = blue dot, AC-2.1 to 2.5, AC-3.1 to 3.3, AC-4.1 to 4.3, AC-5.1 to 5.4).
Existing [QA] subtasks: not read (exam).
Common precondition: logged in as Turnaround Manager (TM) on QA; the Shutdown Logic detail page of the Active Turnaround Plan is open; the Manpower Resource histogram is collapsed (button `Hide histogram`) after every load; the plan has at least 3 Platforms, Work Headers that are not the same on every Platform, and Work Breakdowns under them; the filter panel is opened with the filter toolbar button.
Notation: POS positive, NEG negative, BND boundary. Priority comes from damage (the Story gives none).

## Think like the user
- TM prepares the schedule and saves a view; JO only explores. Both use the filter many times a day, in a hurry, on a big plan.
- They want to see only one platform or one work header and nothing else.
- A careless person unchecks everything, types in search then forgets it, presses Reset, reloads, or edits a task while the panel is open.

## Coverage map
| Requirement / screen state | Technique | Risk | Planned cases |
|---|---|---|---|
| AC-1.1 order of sections | Page display | wrong order, sections missing | TC-001 |
| AC-1.2 default collapsed, expand by header and chevron | State | opens expanded, chevron does not work | TC-002 |
| AC-1.3 blue dot (section, toolbar, disappears) | State | dot missing or stuck | TC-003, TC-004 |
| AC-2.1 lists unique, existing values only | Data scope | master data values shown, duplicates | TC-005, TC-021 |
| AC-2.1 no blank option | Boundary | blank option shown | TC-006 |
| AC-2.2 sort by master data (Platform, Work Header, not row order) | Data rule | wrong order, text sort | TC-007, TC-008 |
| AC-2.3 Select All (default, check, uncheck, indeterminate) | State table | wrong state | TC-009, TC-010 |
| AC-2.4 search, Select only search results, clearing | State table | wrong rows checked | TC-011, TC-012, TC-013, TC-014 |
| AC-2.4 "No option" | Empty state | wrong text, controls shown | TC-015 |
| AC-2.4 strange search text (lesson 4) | Strange input | page breaks | TC-016 |
| AC-3.1 Platform hides descendants | Hierarchy | children stay | TC-017 |
| AC-3.2 Work Header hides descendants, parent stays; auto-hide parent | Hierarchy | wrong rows (lesson L-5) | TC-018, TC-019 |
| AC-3.3 empty table state | Empty state | message shown, header lost | TC-020 |
| AC-4.1 AND with other filters, Custom View, focus toggles | Matrix | OR instead of AND | TC-022, TC-023 |
| AC-4.2 dependency arrows | Linked data | arrow to hidden row | TC-024 |
| AC-4.3 histogram follows filters, Used Resource ON, blank | Dependent charts | histogram counts hidden tasks | TC-025, TC-026 |
| AC-5.1 new / edited / deleted values sync | Linked data | stale option, wrong position | TC-027, TC-028 |
| AC-5.2 Reset | State | search or dots stay | TC-029 |
| AC-5.3 TM Save restores; JO transient | Permission, persistence | JO data written, TM not restored | TC-030, TC-031, TC-032 |
| AC-5.4 permission access | Permission | no access, edit without permission | TC-033, TC-034 |
| Lesson 1 two users | Concurrency | stale list | TC-035 |
| Lesson 2 filter + sort + search together | Combination | wrong list | TC-011, TC-022, TC-016 |
| Lesson 4 strange input | see above | | TC-016 |
| Lesson L-1 text sort with numbers | Data | "10" before "2" | TC-008 |
| Lesson L-2 choice kept after reload / reopen | State | choice lost | TC-030, TC-036 |
| Lesson L-3 wait for result before reading | Automation | false pass | noted in every Auto case |
| AC-1.3 Select All unchecked (zero options) shows the dot | State | dot missing with zero options | TC-046 |
| Unsaved changes: undo by hand, Reset, leave, JO, reload, Back, breadcrumb, return | State | Save or warning wrong | TC-029, TC-030, TC-031, TC-036, TC-038 to TC-043, TC-045 |
| AC-5.3 filter does not carry to another plan | Persistence | wrong filter on plan B | TC-044 |
| AC-5.1 new value while another is unchecked | Linked data | new value unchecked or lost | TC-037 |
| AC-2.4 search is case-insensitive contains; paste; long list scroll | Input habits | match fails or last option unreachable | TC-047, TC-048, TC-049 |
| AC-4.2 rows stay aligned between table and chart | Two panels | chart rows shifted after filter | TC-050 |
| Lesson L-5 collapse per level | see | | TC-018 (Custom View expansion in TC-023) |

Categories not relevant: 3 old data after migrations (no migration in this Story); 5 reorder (no reorder of rows by the user); 9 matrix: covered by TC-022 table. 7 and 8 covered by TC-025, TC-024 and TC-035.

Counts after the fix round: High 24, Medium 22, Low 4 (50 cases). Auto 39, Partial 1, Manual 10.

## Open questions
1. When a Platform is unchecked, do its Work Headers stay in the Work Header list (list is "unique values in the plan dataset")? The AC does not say whether the two lists depend on each other. Expected results here assume the Work Header list stays complete.
2. If a Work Header name exists under several Platforms and is unchecked, all rows with that name are hidden. Is this the intent?
3. The blue dot "appears when one or more options are unchecked": does unchecking Select All (zero options) also show it? Assumed yes.
4. Does the toolbar blue dot also appear for Platform/Work Header filter only (assumed yes: "any filter").
5. Is the filter state kept after F5 for TM without Save, and for JO? AC says only that Save commits for TM and JO is "transient". Assumed: TM unsaved is lost on reload, JO is lost on reload.
6. Does Platform Select All and the individual options stay in sync when a new Platform value appears while others are unchecked (is the new value checked or unchecked by default)? Assumed checked.
7. Role names: the Story says "Edit Shutdown Logic Table and Visualization" saves filters, while JO is view only; how does a user with View permission but not Edit see the Save button (hidden or disabled)?
8. Search: is it case-insensitive and "contains" or "starts with"? Assumed case-insensitive contains.
9. Does Select All state, while a search is active, refer to all options or only visible ones? AC says it reflects the whole section.
10. Figma is "Pending": exact colour and shape of the blue dot and the chevron are not defined.
11. Save button: is `Save` disabled when the filter equals the saved state (before any change, after undoing a change by hand, after Reset to the saved state)? Assumed yes.
12. Leave warning: is a warning shown when a TM leaves with an unsaved filter change? The Story is silent. Assumed: a warning only when something is unsaved, never for JO and never after only opening or closing the panel. Cases TC-039 to TC-041 record what the page does and compare with this assumption.
13. Is the filter state kept when a TM opens another plan or another Shutdown Logic page? Assumed no carry over (TC-044).
Suggestion (not in Story): none.

## Test cases (50 flows)

### TC-001 [FE][MT] Verify the order of the sections at the top of the Filter Panel (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1
1. Click the filter toolbar button. -> The Filter Panel opens on the right side.
2. Read the section names from top to bottom. -> The order is `Platform`, `Work Header`, `Description`, `Activity Group`, `Priority`, `Duration`, `Date`, `Predecessor`, `Successor`, `SIMOP`, `Location`, `Manpower Resource`.
Automation: Starting data: active plan. Check: the list of section labels equals the expected order. Data set: none. Clean up: close the panel.

### TC-002 [FE][MT] Verify Platform and Work Header are collapsed by default and open by header or chevron (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Open the Filter Panel. -> The `Platform` and `Work Header` sections are collapsed; no option list is visible.
2. Click the `Platform` header text. -> The Platform section expands and shows its option list.
3. Click the `Platform` chevron. -> The Platform section collapses.
4. Click the `Work Header` chevron. -> The Work Header section expands and shows its option list.
5. Click the `Work Header` header text. -> The Work Header section collapses.
6. Close the panel and open it again. -> Both sections are collapsed again.
Automation: Check: expanded/collapsed state after each click. Clean up: none.

### TC-003 [FE][MT] Verify the blue dot on the section label and on the toolbar icon when an option is unchecked, and that it goes away when all are checked (POS) [Auto]
Precondition: common; no filter is active (no blue dot anywhere)
Priority: High
Trace: AC-1.3
1. Open the Filter Panel and expand `Platform`. -> The list shows with every option checked and no blue dot next to `Platform`.
2. Uncheck one Platform option. -> A blue dot appears next to the `Platform` label; the `Work Header` label has no dot.
3. Look at the filter toolbar button. -> A blue dot appears on the toolbar filter icon.
4. Check the same option again. -> The blue dot next to `Platform` disappears and the toolbar icon dot disappears.
5. Expand `Work Header` and uncheck one option. -> A blue dot appears next to `Work Header`; none next to `Platform`.
6. Check that option again. -> The dot next to `Work Header` disappears.
Automation: Check: dot visible/hidden at each step. Clean up: Reset.

### TC-004 [FE][MT] Verify the toolbar dot stays while one of two sections is still filtered (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.3
1. Uncheck one option in `Platform` and one option in `Work Header`. -> Both labels show a blue dot and the toolbar icon shows a blue dot.
2. Check the Platform option again. -> The `Platform` dot disappears; the `Work Header` dot and the toolbar dot stay.
3. Check the Work Header option again. -> The `Work Header` dot disappears and the toolbar dot disappears.
Automation: loop over the two sections, check the dot after each click. Clean up: Reset.

### TC-005 [FE][MT] Verify the lists show only values that exist in the plan and no duplicates (POS) [Manual: needs a person or the master data list to compare]
Precondition: common; the Master Data has at least one Platform and one Work Header that no task in the active plan uses
Priority: High
Trace: AC-2.1
1. Record the Platform names that appear on Level 1 rows of the Gantt table. -> The list of existing Platform names is written down.
2. Open the Filter Panel and expand `Platform`. -> The option list shows exactly the written-down names, each once.
3. Check that the unused Master Data Platform is not in the list. -> The unused Platform is not shown.
4. Record the distinct Work Header names on Level 2 rows, then expand `Work Header`. -> The list shows exactly those names, each once, and not the unused Master Data Work Header.

### TC-006 [FE][MT] Verify there is no blank option in either list (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Expand `Platform` and read all options. -> No option has an empty or `null` label.
2. Expand `Work Header` and read all options. -> No option has an empty or `null` label.
Automation: Check: every label is non-empty and not `null`. Clean up: none.

### TC-007 [FE][MT] Verify the Platform list follows the Master Data sequence (POS) [Auto]
Precondition: common; the Master Data Platform order is known and different from alphabetical order
Priority: High
Trace: AC-2.2
1. Expand `Platform`. -> The options are listed in the Master Data sequence.
2. Compare with the Level 1 order in the Gantt table. -> The order is the same.
Automation: expected order from the Master Data. Clean up: none.

### TC-008 [FE][MT] Verify the Work Header list follows the canonical Master Data sequence, not row order, with numbers in names (POS) [Auto]
Precondition: common; one Work Header exists only on a later Platform but sits early in the Master Data sequence; names such as `x 2` and `x 10` exist if the data allows
Priority: High
Trace: AC-2.2
1. Expand `Work Header`. -> The options are listed in the Master Data sequence.
2. Find the Work Header that only the later Platform has. -> It appears at its Master Data position, not at the bottom.
3. Check names that end in numbers (for example 2 and 10). -> They follow the Master Data order, not plain text order.
Automation: expected order from the Master Data. Clean up: none.

### TC-009 [FE][MT] Verify Select All is checked by default and checks or unchecks all options (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3
1. Expand `Platform`. -> `Select All` is at the top, checked, and every option is checked.
2. Uncheck `Select All`. -> Every option is unchecked; the blue dot appears next to `Platform`.
3. Check `Select All`. -> Every option is checked; the blue dot disappears.
4. Repeat steps 1 to 3 in `Work Header`. -> Same results in `Work Header`.
Automation: loop over both sections. Clean up: Reset.

### TC-010 [FE][MT] Verify Select All shows the indeterminate state for a subset (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.3
1. In `Platform` uncheck one option. -> `Select All` shows the indeterminate state `[-]`.
2. Uncheck all other options one by one. -> After the last one `Select All` shows unchecked.
3. Check one option. -> `Select All` shows indeterminate.
4. Check all other options. -> `Select All` shows checked.
Automation: loop over both sections. Clean up: Reset.

### TC-011 [FE][MT] Verify search and Select only search results work on matching options only (POS) [Auto]
Precondition: common; at least 2 options contain the same text (for example part of a name)
Priority: High
Trace: AC-2.4
1. Expand `Work Header` and look at the search box. -> The search box shows the placeholder `Search`; `Select only search results` is hidden.
2. Type text that matches 2 or more options. -> Only the matching options are listed; `Select only search results` shows directly below `Select All`.
3. Uncheck `Select only search results`. -> The matching options are unchecked; `Select All` shows indeterminate.
4. Clear the search text by keyboard. -> The full list returns; the non-matching options are still checked; `Select only search results` is hidden.
5. Type the same text again, then check `Select only search results`. -> All matching options are checked.
6. Clear the search text. -> The full list returns and every option is checked; `Select All` is checked.
Automation: wait for the list to update after each typing before reading rows (L-3). Clean up: Reset.

### TC-012 [FE][MT] Verify non-matching hidden options keep their earlier state (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.4
1. In `Platform` uncheck option A (does not match the search text). -> Option A is unchecked.
2. Type text that matches only option B. -> Only B is listed.
3. Uncheck `Select only search results`. -> B is unchecked.
4. Clear the search. -> A and B are both unchecked; the other options stay checked; `Select All` shows indeterminate.
5. Type text matching B and check `Select only search results`. -> B is checked.
6. Clear the search. -> B is checked, A is still unchecked.
Automation: Clean up: Reset.

### TC-013 [FE][MT] Verify Select All state follows the whole section while a search is active (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4
1. Uncheck all options with `Select All`. -> All options are unchecked.
2. Type text that matches 2 options. -> Only those 2 are listed.
3. Check `Select only search results`. -> The 2 options are checked; `Select All` shows indeterminate.
4. Type text so that all options match (for example one letter all names share), then check `Select only search results`. -> `Select All` shows checked.
Automation: Clean up: Reset.

### TC-014 [FE][MT] Verify the Reset button clears search text and hides Select only search results (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4, AC-5.2
1. Type search text in `Platform` that matches one option. -> The list is filtered and `Select only search results` is visible.
2. Click `Reset` at the top right of the panel. -> The search box is empty and shows `Search`; the full list is shown; `Select only search results` is hidden.
Automation: Clean up: none.

### TC-015 [FE][MT] Verify "No option" when the search matches nothing (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4
1. In `Work Header` type text that matches no option (for example `zzzz`). -> The list area shows exactly `No option`.
2. Look for the controls. -> `Select All` and `Select only search results` are both hidden.
3. Clear the search. -> The full list returns with `Select All`.
4. Repeat steps 1 and 2 in `Platform`. -> Same result in `Platform`.
Automation: Clean up: none.

### TC-016 [FE][MT] Verify strange search text does not break the panel (Exotic: strange input) [Auto]
Precondition: common
Priority: Low
Trace: none (strange input lesson, AC-2.4 search box)
1. Type each value in the `Platform` search box one by one: `%`, `<b>`, `'"\`, 2 emoji, Thai text, 300 characters, 3 spaces. -> After each value the panel stays open and shows either matching options or `No option`; no error message appears.
2. Clear the search. -> The full list returns.
Automation: data set: the 7 values; loop. Clean up: none.
Note: whether 3 spaces count as empty search is in Open question 8 area; record what the page does.

### TC-017 [FE][MT] Verify unchecking a Platform hides the Platform row and all its descendants (POS) [Auto]
Precondition: common; Platform P1 has Work Headers, Works and Work Breakdowns
Priority: High
Trace: AC-3.1
1. Expand all rows of P1 and record the count of rows below it. -> The count is written down.
2. In the Filter Panel uncheck P1 in `Platform`. -> The P1 row and all its Work Header, Work and Work Breakdown rows are gone from the Gantt table.
3. Check the other Platform rows. -> They are still shown with all their descendants.
4. Expand `Work Header` in the Filter Panel. -> The Work Headers of P1 are still listed and checked (the list stays complete, Open question 1).
5. Check P1 again. -> The P1 row and all descendants return.
Automation: compare rows by name from the data. Clean up: Reset.

### TC-018 [FE][MT] Verify unchecking a Work Header hides its descendants and the parent Platform stays (POS) [Auto]
Precondition: common; Platform P1 has at least 2 Work Headers
Priority: High
Trace: AC-3.2
1. In `Work Header` uncheck one Work Header W1 of P1. -> The W1 row and its Work and Work Breakdown rows are hidden.
2. Look at P1 and its other Work Headers. -> P1 is visible; the other Work Headers and their descendants are visible.
3. Look at other Platforms that also have a Work Header named W1. -> Their W1 rows and descendants are hidden too, because the filter works on the name (assumed, Open question 2); the other Work Headers of those Platforms stay visible.
Automation: Clean up: Reset.

### TC-019 [FE][MT] Verify the parent Platform is hidden when all its Work Headers are unchecked (BND) [Auto]
Precondition: common; Platform P1 has exactly the Work Headers W1 and W2
Priority: High
Trace: AC-3.2
1. Uncheck W1 in `Work Header`. -> P1 stays visible with W2.
2. Uncheck W2 in `Work Header`. -> The P1 row is hidden together with everything under it.
3. Check W1 again. -> The P1 row returns with W1 and its descendants.
Automation: Clean up: Reset.

### TC-020 [FE][MT] Verify the empty table state keeps the header and shows no message (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-3.3
1. Uncheck `Select All` in `Platform`. -> All options are unchecked.
2. Look at the Gantt table. -> The table header row with all column titles is still shown; the body under it is empty; no text and no banner is shown.
3. Check `Select All` in `Platform` and uncheck `Select All` in `Work Header`. -> The same empty body appears.
4. Check `Select All` in `Work Header`. -> The rows return.
Automation: Check: header cells visible, row count 0, no empty-state text. Clean up: Reset.

### TC-021 [FE][MT] Verify the lists do not show a Platform or Work Header that exists only in another plan (NEG) [Manual: needs a second plan with different values]
Precondition: another plan exists with a Platform that the active plan does not have
Priority: Medium
Trace: AC-2.1
1. Open the Filter Panel of the active plan and expand `Platform`. -> The Platform of the other plan is not in the list.

### TC-022 [FE][MT] Verify Platform and Work Header filters combine with other filters by AND (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4.1
1. For each row of the table below set the filters, then read the rows shown. -> The rows shown equal the expected column.
Expected-values table (the test loops over every row; real names are taken from the plan data):
| Platform | Work Header | Other filter | Expected rows |
|---|---|---|---|
| P1 only | all | none | only P1 tree |
| all | W1 only | none | only W1 rows, parents shown |
| P1 only | W1 only | none | only W1 under P1 |
| P1 only | W1 only | Priority set so no W1 task under P1 matches | empty table body, header shown |
| P1 only | all | Activity Group set | only P1 tasks of that group |
| P2 only (does not have W1) | W1 only | none | empty table body |
2. Press `Reset`. -> All rows return.
Automation: data set: the table; wait for rows to settle before reading (L-3). Clean up: Reset.

### TC-023 [FE][MT] Verify the filters combine with Custom View expansion and the Focus toggles (POS) [Auto]
Precondition: common; a Custom View with some levels collapsed; critical path and dropped tasks exist
Priority: Medium
Trace: AC-4.1
1. Uncheck a Platform in `Platform`. -> That Platform tree is hidden.
2. Turn on Focus Critical Path. -> Only critical tasks of the remaining Platforms are shown.
3. Turn on Focus Dropped Task. -> Only rows that are both critical (if still required by the toggle) and pass the filters are shown; no row of the hidden Platform appears.
4. Turn both toggles off. -> The rows of the remaining Platforms return; the hidden Platform stays hidden.
5. Select a Custom View that collapses Work Headers. -> Rows shown follow the Custom View; the hidden Platform stays hidden.
Automation: Partial data dependent, rows compared by name. Clean up: Reset, toggles off.

### TC-024 [FE][MT] Verify no dependency arrow is drawn to or from a filtered-out task (POS) [Manual: arrows are drawn on a canvas, a person looks at the picture]
Precondition: common; a predecessor task in P1 and a successor task in P2 with a dependency line between them
Priority: Medium
Trace: AC-4.2
1. Look at the arrow between the two tasks. -> The arrow is drawn.
2. Uncheck P2 in `Platform`. -> The successor row is hidden and the arrow is no longer drawn.
3. Check P2 and uncheck the Work Header of the predecessor. -> The predecessor row is hidden and the arrow is not drawn.
4. Press `Reset`. -> The arrow is drawn again.

### TC-025 [FE][MT] Verify the histogram counts only tasks that pass the filters (POS) [Manual: values compared with a calculation by hand]
Precondition: common; the Manpower Resource histogram is expanded for this case; `Used Resource` toggle is OFF
Priority: High
Trace: AC-4.3
1. Record the value of one resource at one date in the histogram. -> The value is written down.
2. Uncheck a Platform whose tasks use this resource. -> The value at that date is lower by the demand of the hidden tasks.
3. Switch `Used Resource` ON and uncheck all Platforms except one that does not use a resource. -> The resource with zero demand is hidden.
4. Press `Reset`. -> The recorded value returns.

### TC-026 [FE][MT] Verify the histogram shows blank space when no resource has demand (NEG) [Manual: histogram canvas]
Precondition: common; histogram expanded; `Used Resource` ON
Priority: Medium
Trace: AC-4.3
1. Uncheck `Select All` in `Platform`. -> The Gantt body is empty.
2. Look at the histogram. -> It shows blank space under its header; no placeholder text.

### TC-027 [FE][MT] Verify a newly added or edited value appears in the list at its Master Data position (POS) [Auto]
Precondition: common; a Work Header that exists in Master Data but not in the plan; test data owned by this case
Priority: High
Trace: AC-5.1
1. Open the Filter Panel and expand `Work Header`. -> The new Work Header is not in the list.
2. Add a task with that Work Header (or edit one task to use it). -> The task is saved.
3. Open the Filter Panel and expand `Work Header`. -> The new value is in the list, checked, at its Master Data position.
4. Do the same check in `Platform` with a new Platform value. -> The new Platform is in the list at its Master Data position.
Automation: Starting data: the task made by the test. Clean up: delete the task.

### TC-028 [FE][MT] Verify an option disappears when no task has the value any more (POS) [Auto]
Precondition: common; one Work Header W9 used by exactly one task (made by the test)
Priority: High
Trace: AC-5.1
1. Expand `Work Header`. -> W9 is in the list.
2. Delete the only task with W9. -> The task is removed.
3. Open the list again. -> W9 is not in the list.
4. Change the Platform of the only task of another Platform value. -> The old Platform value is gone from `Platform`, the new one is shown.
Automation: Clean up: delete leftovers.

### TC-029 [FE][MT] Verify Reset restores all filters, search boxes, dots and hides the helper checkbox (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-5.2
1. Uncheck one Platform option and one Work Header option; set one other filter (for example Priority). -> The rows change and blue dots appear on the labels and on the toolbar icon.
2. Type search text in both sections. -> Both lists are filtered and `Select only search results` is visible in both.
3. Click `Reset`. -> All options in all sections are checked; `Select All` is checked everywhere; both search boxes are empty with `Search`; `Select only search results` is hidden; no blue dot on any label or on the toolbar icon; all rows return.
4. Look at the page-level `Save` button. -> The page is back to "not changed": `Save` is disabled.
Automation: Clean up: none.

### TC-030 [FE][MT] Verify a Turnaround Manager can Save the filter and it is restored in the next session (POS) [Auto]
Precondition: common; TM; test owns the plan view state
Priority: High
Trace: AC-5.3
1. Open the page and look at the page-level `Save` button before any change. -> `Save` is disabled (nothing to save, Open question 11).
2. Uncheck one Platform option and one Work Header option. -> The Gantt rows are filtered, blue dots show and `Save` is enabled.
3. Check both options again by hand. -> The dots disappear and `Save` is disabled again (nothing differs from the saved state).
4. Uncheck the same two options again, then click the page-level `Save` button. -> The save is accepted without an error message and `Save` is disabled afterwards.
5. Log out, log in as TM and open the same Shutdown Logic page. -> The Platform and Work Header options are unchecked as saved; the Gantt rows match; the blue dots show; `Save` is disabled.
6. Press `Reset`, then `Save`. -> The filter state is saved as no filter.
Automation: Clean up: Reset and Save.

### TC-031 [FE][MT] Verify a Job Owner can use the filters but the state is not saved (POS) [Auto]
Precondition: JO account; the plan is Active
Priority: High
Trace: AC-5.3, AC-5.4
1. Open the Shutdown Logic page and expand `Platform`. -> The list is shown.
2. Uncheck one Platform option. -> The Gantt rows of that Platform are hidden in real time.
3. Reload the page. -> The filter is not kept; all options are checked.
4. Uncheck a Platform option again, click the browser Back button, then go Forward. -> The page opens again with all options checked (JO state is not kept, Open question 5).
5. Uncheck a Platform option again, leave the page by the breadcrumb, then open the Shutdown Logic page again. -> All options are checked; no leave warning appears.
6. Log in as TM and open the page. -> The TM filter state is not changed by the JO action.
Automation: two contexts (JO, TM). Clean up: none.

### TC-032 [FE][MT] Verify the Job Owner has no way to Save a filter (NEG) [Auto]
Precondition: JO account
Priority: Medium
Trace: AC-5.3
1. Change a Platform filter. -> The rows change.
2. Look at the page-level `Save` button. -> The button is not shown or is disabled (see Open question 7).
Automation: record the actual state. Clean up: none.

### TC-033 [FE][MT] Verify a user with View permission can open the page, see the Gantt table and use the filters (POS) [Manual: needs accounts for View All and View Active separately]
Precondition: TM account has View All Shutdown Logic Item; JO account has View Active Shutdown Logic Item
Priority: High
Trace: AC-5.4
1. Log in as TM and open the Shutdown Logic page. -> The Gantt table shows and the filter button opens a panel with `Platform` and `Work Header`.
2. Log in as JO and open the Shutdown Logic page of the Active plan. -> The Gantt table shows and the filter panel works the same way.

### TC-034 [FE][MT] Verify a Job Owner cannot open a plan that is not Active (NEG) [Manual: needs an inactive plan, another tester may use it]
Precondition: JO account; an Inactive plan exists
Priority: Medium
Trace: AC-5.4
1. Try to open the Shutdown Logic page of the Inactive plan as JO. -> The page is not opened and no Gantt data is shown.

### TC-035 [FE][MT] Verify a page left open updates or warns when another user changes the data (Exotic: two users) [Manual: two real sessions]
Precondition: two sessions as TM, same plan; test data owned by this case
Priority: Low
Trace: AC-5.1
1. In session A open the Filter Panel and expand `Work Header`. -> The list is shown.
2. In session B add a task with a new Work Header value. -> The task is saved.
3. In session A reload the page, then open the list. -> The new value is in the list at its Master Data position.
4. In session A, without reload, open the list again and note whether it changed. -> What the page does is written down; no error appears.

### TC-036 [FE][MT] Verify the filter choice stays when the panel is closed and opened, and is lost on reload without Save (BND) [Auto]
Precondition: common; TM
Priority: Medium
Trace: AC-5.3
1. Uncheck one Platform option, then close the panel. -> The Gantt rows stay filtered and the toolbar dot stays.
2. Open the panel again. -> The option is still unchecked and the dot shows next to `Platform`.
3. Look at the page-level `Save` button. -> `Save` is enabled because the filter differs from the saved one.
4. Close and open the panel, and expand and collapse the `Platform` section, without changing any option. -> The option stays unchecked; nothing else changes.
5. Reload the page without Save. -> The page opens with all options checked and no blue dot (unsaved TM filter is lost, Open question 5).
6. Go to another page by an in-app link and come back without Save. -> The filter is as in the last saved state (all options checked if nothing was saved).
Automation: Clean up: Reset.

### TC-037 [FE][MT] Verify a new value is added checked while another option is unchecked (BND) [Auto]
Precondition: common; a Work Header that exists in Master Data but not in the plan; test data owned by this case
Priority: High
Trace: AC-5.1, AC-1.3
1. In `Work Header` uncheck one existing option X. -> X is unchecked and the dot shows next to `Work Header`.
2. Add a task with the new Work Header value. -> The task is saved.
3. Open the `Work Header` list. -> The new value is listed at its Master Data position and checked; X is still unchecked; `Select All` shows indeterminate; the dot stays.
4. Look at the Gantt table. -> The new task row is visible; X rows are still hidden.
Automation: Starting data: the task made by the test. Clean up: delete the task, Reset.

### TC-038 [FE][MT] Verify Reset after only Select All was unchecked and after one option was unchecked (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-5.2, AC-3.3
1. Uncheck `Select All` in `Platform`. -> All Platform options are unchecked; the table body is empty; the dot shows.
2. Click `Reset`. -> All Platform options are checked; `Select All` is checked; no dot; all rows return; `Save` is disabled.
3. Uncheck one option in `Work Header`, then click `Reset`. -> The option is checked again; no dot on the label or on the toolbar icon; `Save` is disabled.
Automation: Clean up: none.

### TC-039 [FE][MT] Verify undoing a change by hand returns the page to "not changed" (BND) [Auto]
Precondition: common; TM; the saved filter equals no filter
Priority: High
Trace: AC-1.3, AC-5.3
1. Uncheck one `Platform` option. -> `Save` is enabled and the dot shows.
2. Check the same option again. -> The dot disappears and `Save` is disabled again.
3. Leave the page by the breadcrumb. -> The page opens the previous page with no leave warning, because nothing is left to save.
Automation: Check: Save enabled state and absence of a leave dialog. Clean up: none.

### TC-040 [FE][MT] Verify a TM who changed a filter is warned when leaving the page (NEG) [Partial: browser leave dialog differs between browsers, the app dialog is checked by the script]
Precondition: common; TM
Priority: High
Trace: AC-5.3
1. Uncheck one `Platform` option and do not Save. -> `Save` is enabled.
2. Leave the page by the breadcrumb. -> A warning about unsaved changes is shown (assumed, Open question 12); the user can stay on the page.
3. Choose to stay. -> The page stays with the option still unchecked.
4. Leave again and confirm leaving. -> The previous page opens; the unsaved filter is not saved.
Automation: record the dialog text and write it into the case.

### TC-041 [FE][MT] Verify a Job Owner is never warned when leaving after a filter change (NEG) [Auto]
Precondition: JO account; the plan is Active
Priority: Medium
Trace: AC-5.3
1. Uncheck one `Platform` option. -> The rows of that Platform are hidden.
2. Leave the page by the breadcrumb. -> The previous page opens at once with no unsaved-changes warning.
3. Return to the Shutdown Logic page. -> All options are checked and no blue dot shows.
Automation: Clean up: none.

### TC-042 [FE][MT] Verify the filter state when using browser Back, Forward and the breadcrumb (BND) [Auto]
Precondition: common; TM, saved filter equals no filter
Priority: Medium
Trace: AC-5.3
1. Uncheck one `Platform` option and click `Save`. -> The save is accepted.
2. Click the browser Back button, then Forward. -> The Shutdown Logic page opens with the saved filter applied and the option unchecked.
3. Uncheck one `Work Header` option without Save, then use the breadcrumb to the previous page and return by the page link. -> The saved Platform filter is shown; the unsaved Work Header change is not kept.
Automation: Clean up: Reset and Save.

### TC-043 [FE][MT] Verify the filter and the option lists after opening a task and returning (POS) [Auto]
Precondition: common; TM; test data owned by this case
Priority: Medium
Trace: AC-5.1, AC-5.3
1. Uncheck one `Platform` option and click `Save`. -> The save is accepted.
2. Open the edit page of a task that is visible, change its Work Header to a value not in the plan, and save it. -> The task is saved.
3. Return to the Shutdown Logic page. -> The saved Platform filter is still applied; the new Work Header value is in the `Work Header` list at its Master Data position and checked.
Automation: Starting data: the task made by the test. Clean up: restore the value, Reset and Save.

### TC-044 [FE][MT] Verify a saved filter of one plan does not appear on another plan (NEG) [Manual: needs a second plan, another tester may use it]
Precondition: TM; two plans; the filter of plan A is saved with one Platform unchecked
Priority: Medium
Trace: AC-5.3
1. Open the Shutdown Logic page of plan B. -> All options in `Platform` and `Work Header` are checked and no blue dot shows.
2. Return to plan A. -> The saved Platform filter of plan A is applied.

### TC-045 [FE][MT] Verify opening, closing and expanding the panel does not mark the page as changed (NEG) [Auto]
Precondition: common; TM; no change made
Priority: Medium
Trace: AC-1.2, AC-5.3
1. Open the Filter Panel, expand and collapse `Platform` and `Work Header`, type then clear a search text, and close the panel. -> Nothing is filtered and no dot shows.
2. Look at the page-level `Save` button. -> `Save` is disabled.
3. Leave the page by the breadcrumb. -> No leave warning appears.
Automation: Check: Save disabled. Clean up: none.

### TC-046 [FE][MT] Verify the blue dot shows when Select All is unchecked (BND) [Auto]
Precondition: common; no filter active
Priority: Medium
Trace: AC-1.3, AC-2.3
1. Expand `Platform` and uncheck `Select All`. -> Every option is unchecked; the dot shows next to `Platform` and on the toolbar icon (Open question 3).
2. Check `Select All`. -> Every option is checked; both dots disappear.
Automation: Clean up: Reset.

### TC-047 [FE][MT] Verify the search ignores upper or lower case and matches text in the middle of a name (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.4
1. In `Work Header` type the middle part of a name in capital letters. -> That option is listed (Open question 8); `Select only search results` is visible.
2. Replace it with the same part in small letters. -> The same option is listed.
Automation: data set: names from the plan. Clean up: Reset.

### TC-048 [FE][MT] Verify a long option list can be scrolled and the last option can be checked (BND) [Auto]
Precondition: common; the list has more options than fit in the panel (resize the browser window smaller if the plan has few values)
Priority: Low
Trace: AC-2.1, AC-2.3
1. Expand `Work Header` and scroll the option list to the bottom. -> The last option is fully visible and not hidden behind the panel edge.
2. Uncheck the last option. -> The last option is unchecked, the rows with that value are hidden and `Select All` shows indeterminate.
Automation: Clean up: Reset.

### TC-049 [FE][MT] Verify pasting text into the search box works like typing (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-2.4
1. Paste the name of one option into the `Platform` search box. -> Only that option is listed; `Select only search results` is visible.
2. Select all text in the box and paste another name over it. -> Only the second option is listed.
3. Clear the box with the keyboard. -> The full list returns and `Select only search results` is hidden.
Automation: use the clipboard paste action. Clean up: none.

### TC-050 [FE][MT] Verify the table rows and the Gantt chart bars stay aligned after filtering, scrolling and expanding (POS) [Manual: alignment of the two panels is judged by eye]
Precondition: common
Priority: Medium
Trace: AC-4.2, AC-3.1
1. Uncheck one Platform option. -> The table rows and the chart bars of the remaining rows are on the same lines.
2. Scroll the Gantt vertically to the bottom. -> The table and chart scroll together and stay aligned.
3. Expand one Platform row. -> The chart bars of its children appear on the same lines as the table rows.

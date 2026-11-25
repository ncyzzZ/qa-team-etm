# Draft test cases: ETM-6378 Manpower Mob Plan - POB Chart Visualization

Story: ETM-6378 (frozen copy, exam run). Source: `story.md`, `docs/UI_Map_ETM.md`, `docs/modules/core-architecture.md`, `knowledge/`. No `analyst.md` and no `inspector.md` exist for this run, so the AC ids below are made by the designer from the Story numbering (AC-1.1 = item 1.1 and so on) and no Figma design was read: every text not in the Story is a question.
Existing `[QA]` subtasks: none given.
Common precondition: the tester is logged in as Turnaround Manager (TM, has View All Manpower Mob Plan Item) on QA; an Active Manpower Mob Plan exists with at least 3 graphs configured (for example `Constant`, `POB Movement`, `POB Onboard`) and the Manpower Mob Plan tab is open. Other roles are named in the case.
Notation: `->` separates action and expected result. Labels POS / NEG / BND / Exotic. Priority is by damage if it breaks (the Story has no priority).
Out of scope here (own Stories): Hide Table behaviour (ETM-6379), Export Chart behaviour (ETM-6380), Add Data behaviour (ETM-6381). Only their position, order and enabled/disabled state are tested.

## AC ids used in `Trace:`

| Id | Story item |
|---|---|
| AC-1.1 | Chart location: directly beneath the Schedule Grid and Table section |
| AC-1.2 | Global visibility: all users of the plan see the chart and its graphs |
| AC-1.3 | Header: title POB Chart left; Hide Table toggle, Export Chart (outlined), Add Data (solid, ⊕) right in this order |
| AC-2.1 | Up to 10 graphs at once |
| AC-2.2 | Legend at the bottom: name, line style, colour of each checked group; unchecked group loses its entry |
| AC-2.3 | Y-axis scales to highest and lowest value of visible graphs |
| AC-2.4 | Negative integers plotted |
| AC-2.5 | Horizontal scroll, chart and Data Table in lockstep, Y-axis sticky |
| AC-3.1 | Graph presentation: values plotted as saved in the database |
| AC-3.2 | Empty state: `No data available.`, no axes, no grid, no table; Hide Table and Export Chart disabled |
| AC-3.3.1 | Deselect all: axes and grid only; X range, Y range 0 to 100 step 10 |
| AC-3.3.2 | Deselect all: legend hidden or empty |
| AC-3.3.3 | Deselect all: Data Table beneath, all rows visible and unchecked |
| AC-3.3.4 | Deselect all: Hide Table enabled, Export Chart disabled |
| AC-P | Pre-condition: logged in, View All or View Active Manpower Mob Plan Item, on the Manpower Mob Plan page |

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-P permission TM (View All) | Roles | Main flow blocked | TC-001 |
| AC-P permission JO (View Active) | Roles | Permission leak / blocked | TC-002, TC-003 |
| AC-P no permission, direct link | Roles | Permission leak | TC-004 |
| AC-1.1 location | Screen state | Chart in wrong place | TC-005 |
| AC-1.2 global visibility | Roles, two users | JO sees different graphs than TM | TC-002, TC-021 |
| AC-1.3 header | Screen state | Wrong order, wrong style | TC-006, TC-022 |
| AC-2.1 limit 10 | Boundary | 10th graph missing, layout breaks | TC-007, TC-023 |
| AC-2.2 legend | State change, effects and reverse | Legend and chart disagree | TC-008, TC-009, TC-024 |
| AC-2.3 Y scaling | Boundary, effects and reverse | Line cut off, old range stays | TC-010 |
| AC-2.4 negative | Boundary | Negative line hidden under axis | TC-011 |
| AC-2.5 scroll | Screen state (very many columns) | Chart and table misaligned | TC-012, TC-025 |
| AC-3.1 accuracy | Condition table | Wrong value shown (High damage) | TC-013 |
| AC-3.2 empty | Screen state | Axes shown, buttons enabled | TC-014, TC-015 |
| AC-3.3.1 axes | Boundary | Wrong default range | TC-016 |
| AC-3.3.2 / .3 legend, table | Screen state | Stale legend entry | TC-017 |
| AC-3.3.4 header states | Decision table (empty vs deselected) | Wrong button state | TC-018, TC-014 |
| Screen state: loading / error / slow | Screen states | Half-finished values | TC-019 |
| Leaving and coming back | Leaving and coming back | State lost or stale | TC-020 |
| Strange input in a free-text field shown here (graph name in legend) | Strange input | Broken legend | TC-026 |
| Keyboard use of header controls | Real-user view | Cannot reach buttons | TC-022 |
| Tooltip on a point (screen shows it) | Condition table | Point shows a value different from the table | TC-027 |
| AC-3.3.1 X range same as schedule and table header | Boundary, linked data | Chart dates differ from schedule | TC-028, TC-031 |
| Tick state and page Save | State change | Page asks to save a view choice | TC-029 |
| Hide Table effect on chart (position and state only) | State change | Rows or ticks lost | TC-030 |
| Grid filter (ETM-5615) next to the chart | Linked data | Chart changes with grid filter | TC-032 |
| AC-1.2 / AC-1.3 header for JO | Roles | Missing button for one role | TC-033 |

Lessons (section 1-9 and L-1..L-8):
- 1 two users: relevant (TC-021). 2 filter + sort + search: relevant only as "grid filter must not change the chart" (TC-032). 3 old data after migration: relevant, TC-013 uses an old plan too (question 9). 4 strange input: TC-026. 5 reordering: not relevant, the Story has no row move on the chart. 6 linked data: relevant, chart follows the Data Table (TC-013, TC-009). 7 charts depending on each other: relevant, chart and Data Table (TC-012, TC-013). 8 same data on many pages: relevant, TC-013 and TC-020. 9 matrix: TC-013 (table loop) and TC-018 (state table).
- L-1 text sort: not relevant, no sorted list in this Story. L-2 filter choice kept: not relevant, no filter. L-3 result read too early: relevant, TC-019 and TC-013 wait for the chart to finish drawing. L-4 paste: not relevant, no input. L-5 collapse per level: not relevant. L-6 case variants: TC-026. L-7 selected is not hover: relevant to the checkbox state, TC-017. L-8 Story text changed: Not relevant for a frozen copy; the QA comment says the page was not yet connected, so run after dev confirms.

Skipped categories and reasons: Filter + Sort + Search, Reordering, Collapse per level, Paste (nothing in this Story). Field interaction list: not relevant, the chart has no input field.

Added after the planner walk (TC-027 to TC-033): tooltip (TC-027), X range against schedule (TC-028), tick state and Save (TC-029), Hide Table effect (TC-030), plan outside current month (TC-031), grid filter does not touch the chart (TC-032), JO header (TC-033). TC-012 and TC-018 also changed.

Counts: High 14 / Medium 15 / Low 4. Auto 20 / Partial 9 / Manual 4 (see each case).

## Open questions (return to the lead)

1. Where exactly is the Manpower Mob Plan page and the tab for the chart (menu path, URL)? Not in the Story. Needed for the precondition.
2. Is the checked / unchecked state of each Data Table row saved for everybody, or only for the current user and session? "Global visibility" says graphs are shared; the Story does not say if the ticks are. This changes TC-020 and TC-021.
3. What happens when a user tries to add an 11th graph (Add Data disabled, or a message)? The limit text is in this Story, the behaviour may be in ETM-6381.
4. What is the line-style set and colour set (solid, dashed, dotted; palette) per graph? The Story says "PTTEP standard colours" only. TC-008 compares legend and line, not exact colours.
5. Y-axis: how are the step and the margin chosen when values are all zero, all equal, or very large? Is 0 always included when all values are above 0?
6. When the highest value is negative only (all graphs below 0), what range is shown?
7. How is "Earliest Task Start Date" and "Latest Task End Date" defined (all tasks of the plan, or only the Manpower Mob Plan)? Needed for TC-016.
8. Are the legend entries at the bottom wrapped to a second line when 10 entries do not fit, or scrolled? TC-024 writes "all 10 names can be read".
9. Is there an old plan (made before this Story) without graph metrics? What should the chart show for it (empty state)?
10. What does a user see while the chart data is loading, or if loading fails (no message in the Story)?
11. Is the "Hide Table" toggle on or off by default, and does the legend / chart height change when the table is hidden? (Maybe ETM-6379.)
12. What do the Y-axis labels look like for large values (thousands separator)? Same as other number columns?
13. Can a graph name be long or hold special characters, and what is its limit? (Maybe ETM-6381.)
14. The screen shows a tooltip (date, `<name>:`, value) on hover; the Story does not mention it. TC-027 checks only that the value equals the Data Table cell. Is the tooltip text format part of the design?
16. Differs from Story: on QA the chart and table run May 12 to May 30 (19 days, 60 px columns) while the schedule grid starts May 14 (27 days, 64 px). Story says the same range as the schedule (earliest start minus 7 days to latest end plus 7 days). Which is right? TC-028 keeps the Story.
17. Differs from Story: JO has no `Add Data` button on QA. Is it meant to be hidden for view-only users? TC-033 keeps the Story (three controls).
18. Chart and Data Table scroll 2 px apart and their visible widths differ (936 px against 954 px). Is that accepted, or must points stay exactly over their columns (TC-012 steps 2 and 6)?
19. Does unticking all graphs have to be remembered per plan or per user? On QA the page `Save` stays disabled after a tick change (TC-029); is that the wanted rule? (Same as question 2.)
15. Suggestion (not in Story): chart on a phone or small window. Only a simple resize case is written (TC-025).

## Test cases (33 flows)

### TC-001 [FE][MT] Verify a user with View All permission sees the POB Chart on the Manpower Mob Plan tab (POS) [Auto]
Precondition: common (TM with View All Manpower Mob Plan Item)
Priority: High
Trace: AC-P
1. Open the Manpower Mob Plan tab of the Active plan. -> The tab opens and the component titled `POB Chart` is visible.
2. Look under the chart. -> The Data Table is shown and at least one graph line is drawn.
Starting data: an Active plan with 3 graphs. Data set: none. Clean up: none. Reason: runs every release, result always the same.

### TC-002 [FE][MT] Verify a Job Owner with View Active permission sees the same POB Chart and graphs as the Turnaround Manager (POS) [Auto]
Precondition: common; a Job Owner (JO) account with View Active Manpower Mob Plan Item; the plan is Active
Priority: High
Trace: AC-1.2, AC-P
1. As TM, open the Manpower Mob Plan tab and write down the legend names and the number of Data Table rows. -> The legend names and the row count are written down.
2. Log out and log in as JO. -> JO is logged in.
3. Open the Manpower Mob Plan tab of the same Active plan. -> The `POB Chart` is visible.
4. Compare the legend names and the number of Data Table rows with step 1. -> They are the same as step 1.
Starting data: Active plan with 3 graphs; both accounts exist. Clean up: none. Reason: permission check, same each run.

### TC-003 [FE][MT] Verify a Job Owner cannot open a plan that is not Active, so no chart shows (NEG) [Auto]
Precondition: common; a plan that is Inactive; JO account
Priority: High
Trace: none (permission rule of the product: JO sees Active plans only)
1. Log in as JO. -> JO is logged in.
2. Try to open the Inactive plan from the Planning tab. -> The plan does not open for JO and no `POB Chart` of that plan is shown.
Reason: permission leak is High damage. Question: exact message not in Story.

### TC-004 [FE][MT] Verify a user with no Manpower Mob Plan permission cannot see the POB Chart by direct link (NEG) [Partial: needs a third account that the team does not have]
Precondition: an account without View All and without View Active Manpower Mob Plan Item (question: none exists on QA, only TM and JO)
Priority: Medium
Trace: AC-P
1. Paste the direct address of the Manpower Mob Plan page. -> The user does not see the `POB Chart`; the system refuses or redirects.
Reason: Partial, no such account on QA.

### TC-005 [FE][MT] Verify the POB Chart sits directly beneath the schedule grid and table section (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Open the Manpower Mob Plan tab. -> The Schedule Grid and Table section is shown.
2. Scroll down to the end of that section. -> The `POB Chart` header follows directly below it, with no other section in between.
3. Check the top of the page. -> The chart is not above the schedule grid.
Reason: Automate, compare vertical positions of two elements.

### TC-006 [FE][MT] Verify the chart header title, the three controls, their order and their style (POS) [Partial: style needs a person to look]
Precondition: common
Priority: Medium
Trace: AC-1.3
1. Look at the left of the chart header. -> The title `POB Chart` is shown.
2. Look at the right of the header from left to right. -> Three controls in this order: `Hide Table` toggle, `Export Chart`, `Add Data`.
3. Look at the Hide Table toggle. -> The toggle switch is to the left of the label `Hide Table`.
4. Look at `Export Chart`. -> It is an outlined button.
5. Look at `Add Data`. -> It is a solid primary button with a ⊕ icon.
Starting data: plan with graphs. Reason: order and text can be scripted, style (outline, solid) is judged by eye.

### TC-007 [FE][MT] Verify 10 graphs are all drawn at the same time (BND) [Auto]
Precondition: a plan with exactly 10 configured graphs, all checked
Priority: High
Trace: AC-2.1
1. Open the Manpower Mob Plan tab. -> The Data Table shows 10 rows, all checked.
2. Count the lines drawn in the chart. -> 10 lines are drawn.
3. Count the legend entries. -> 10 entries are shown, each with a different name.
Starting data: plan with 10 graphs (made through Add Data). Clean up: remove the extra graphs if the plan is shared.

### TC-008 [FE][MT] Verify the legend shows name, line style and colour of every checked group (POS) [Partial: colour compare by eye]
Precondition: common, all rows checked
Priority: High
Trace: AC-2.2
1. Look at the bottom of the chart. -> A legend is shown.
2. Compare the legend names with the Data Table row names. -> Every checked row has one legend entry with the same name.
3. Compare each legend sample (line style and colour) with its line in the chart. -> Style and colour match the line of the same name.
4. Check that no two groups have the same name and colour together. -> Each entry can be told apart.
Reason: names are scriptable; colour match is judged by eye.

### TC-009 [FE][MT] Verify unchecking a group removes its legend entry and checking it again brings it back (POS) [Auto]
Precondition: common, all rows checked
Priority: High
Trace: AC-2.2
1. Write down the legend entries. -> The entries are written down.
2. Uncheck the checkbox of `POB Onboard`. -> The legend entry `POB Onboard` disappears; the other entries stay.
3. Look at the chart. -> The line of `POB Onboard` is gone; the other lines stay.
4. Check the checkbox of `POB Onboard` again. -> The legend entry and the line come back with the same colour and line style as in step 1.
5. Uncheck and check every other row one by one. -> Each row's entry disappears and returns the same way.
Starting data: 3 graphs. Clean up: leave all checked.

### TC-010 [FE][MT] Verify the Y-axis range follows the highest and lowest values of the checked graphs (BND) [Auto]
Precondition: a plan where graph A has the highest value, graph B a middle value, graph C the lowest value (record the values from the Data Table first)
Priority: High
Trace: AC-2.3
1. Open the tab with all graphs checked and read the top and the bottom label of the Y-axis. -> The top label is not lower than the highest value of graph A; the bottom label is not higher than the lowest value of graph C.
2. Uncheck graph A. -> The Y-axis top label changes to fit the highest value left; no line is cut off.
3. Uncheck graph C. -> The bottom label changes to fit the lowest value left.
4. Check graph A and graph C again. -> The Y-axis returns to the range read in step 1.
5. Uncheck all but one graph with one single value in all days. -> The axis still shows that value inside its range and the line is visible.
Data set: values read from the Data Table, nothing hard coded.

### TC-011 [FE][MT] Verify negative integers are plotted below the zero line (BND) [Partial: needs a plan with negative values, which may not be creatable on the screen]
Precondition: a graph that has negative integers on some days (for example `-5`), if the screen allows (question: how are negative values made?)
Priority: High
Trace: AC-2.4
1. Check only the graph with negative values. -> The Y-axis includes values below 0 and the zero line is visible.
2. Look at the days with a negative value. -> The line goes below the zero line to the saved value, for example `-5`.
3. Check another graph with only positive values together. -> The axis covers both; the negative line is not cut off at the bottom.
4. Check a graph with only negative values alone. -> The axis shows its range below 0 (question 6) and the line is visible.
Reason: Partial, data not proven reachable from the UI.

### TC-012 [FE][MT] Verify the chart and the Data Table scroll sideways together and the Y-axis stays on the left (POS) [Partial: lockstep by eye]
Precondition: a plan whose timeline is wider than the screen
Priority: High
Trace: AC-2.5
1. Open the tab. -> A horizontal scroll bar is available for the chart.
2. Scroll the chart to the right. -> The Data Table scrolls by the same amount; the date columns stay under the same date points of the chart.
3. Scroll the Data Table to the right instead. -> The chart scrolls by the same amount.
4. Look at the Y-axis while scrolling. -> The Y-axis labels stay fixed on the left.
5. Scroll back to the start. -> Chart and table return to the first date together.
6. Scroll to the very end. -> The last date point and the last table column are aligned (no offset of a few pixels; question 18).
7. Compare how far the chart and the table moved after one scroll on each. -> Both moved by the same amount.
8. Look at the Y-axis (a separate strip on the left of the chart) at the far right end. -> It has not moved and still shows the same labels.

### TC-013 [FE][BE][MT] Verify every plotted value equals the saved value of its day for each series (POS) [Auto]
Precondition: common; series `Constant`, `POB Movement`, `POB Onboard`, `Manpower Mobilization`, `Manpower Demobilization` configured where available
Priority: High
Trace: AC-3.1
1. Wait until the chart has finished drawing. -> The chart shows lines and no loading sign.
2. For each series read the value of the Data Table on 3 dates: the first, a middle, the last. -> Values are written down per date.
3. Read the plotted point of the same series and dates. -> Each point equals the Data Table value of the same date.
4. Repeat step 3 with an old plan made before this Story, if one exists (question 9). -> Same result, or the empty state if it has no graphs.
Test data set: expected-values table (series, date, value from the saved plan). The test loops over every row. Clean up: none.

### TC-014 [FE][MT] Verify the empty state shows `No data available.` and disables Hide Table and Export Chart (NEG) [Auto]
Precondition: an Active plan with no graph configured
Priority: High
Trace: AC-3.2, AC-3.3.4
1. Open the Manpower Mob Plan tab. -> The `POB Chart` header is shown.
2. Look at the chart area. -> The text `No data available.` is shown in the centre.
3. Look for axes and grid lines. -> No axis, no grid lines are shown.
4. Look beneath the chart. -> No Data Table is shown.
5. Look at the header controls. -> `Hide Table` toggle and `Export Chart` are disabled (greyed out) and cannot be clicked.
6. Look at `Add Data`. -> It stays enabled (Story does not say it is disabled; question 3).
7. Check the legend. -> No legend is shown.
Starting data: an Active plan with no graphs (a new plan).

### TC-015 [FE][MT] Verify the empty state appears again after the last graph is deleted (NEG) [Partial: needs the delete function of another Story]
Precondition: a plan with one graph; the delete control of the Data Table (not described in this Story)
Priority: Medium
Trace: AC-3.2
1. Delete the only graph. -> The chart changes to `No data available.`
2. Check the Data Table, legend, axes. -> They are all gone.
3. Check `Hide Table` and `Export Chart`. -> Both are disabled.
4. Refresh the page. -> The same empty state shows.
5. Open the plan as JO. -> JO sees the same empty state.

### TC-016 [FE][MT] Verify the default axes when all graphs are unchecked (BND) [Auto]
Precondition: common; record the Earliest Task Start Date and the Latest Task End Date of the plan
Priority: High
Trace: AC-3.3.1
1. Uncheck all rows of the Data Table one by one. -> Every checkbox is unchecked and no line is drawn.
2. Read the Y-axis. -> It starts at `0` and ends at `100`, with a step of `10`.
3. Read the first and last date of the X-axis. -> The first date is the Earliest Task Start Date minus 7 days; the last date is the Latest Task End Date plus 7 days.
4. Look at the grid. -> Grid lines are drawn for the axes.
5. Check one row again. -> The axes change to fit that graph (not 0 to 100 unless the data needs it).
6. Uncheck it again. -> The axes go back to `0` to `100`.
Data set: dates read from the plan, never typed in.

### TC-017 [FE][MT] Verify the legend is empty and the Data Table stays with all rows unchecked in the deselect state (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.3.2, AC-3.3.3
1. Write down the number of Data Table rows. -> The row count is written down.
2. Uncheck all rows. -> All checkboxes are unchecked.
3. Look at the legend area. -> No legend entry is shown.
4. Count the rows beneath the chart. -> The row count equals step 1 and every row is visible.
5. Reopen the page from the menu and look at the checkboxes. -> The checkboxes show the state the product keeps (question 2); the checked or unchecked mark is visible without hovering.

### TC-018 [FE][MT] Verify Hide Table and Export Chart states in each of the three chart states (POS) [Auto]
Precondition: three plans: one with no graph, one with graphs all unchecked, one with graphs checked
Priority: High
Trace: AC-3.3.4, AC-3.2
1. Open the plan with no graph and read the two buttons. -> `Hide Table` disabled, `Export Chart` disabled.
2. Open the plan with graphs and uncheck all rows. -> `Hide Table` enabled, `Export Chart` disabled.
3. Check one row. -> `Hide Table` enabled, `Export Chart` enabled.
4. Uncheck that row again. -> `Export Chart` is disabled again.
5. Look at `Hide Table` and `Add Data` in the plan with no graph. -> The `Hide Table` switch and its label are both disabled; `Add Data` is enabled.
Test data set: state table (no graph: off/off; all unchecked: on/off; at least one checked: on/on; columns Hide Table, Export Chart). The test loops over the table.

### TC-019 [FE][MT] Verify the chart shows no half-finished values while loading or after a failed load (Exotic: slow network) [Manual: needs network control and a person to judge]
Precondition: common
Priority: Medium
Trace: none (loading and error screen states)
1. Slow the network to a very slow speed and open the tab. -> A loading state or nothing is shown; no wrong default axis with stale lines.
2. Wait for the load to end. -> The chart shows the saved graphs and the correct legend.
3. Cut the network and reload. -> The page shows an error or nothing; it does not show the text `No data available.` as if the plan had no graphs (question 10).

### TC-020 [FE][MT] Verify the chart is still right after leaving the tab and coming back (POS) [Auto]
Precondition: common
Priority: Medium
Trace: none (leaving and coming back)
1. Uncheck one row and write down the legend entries. -> The entries are written down.
2. Open another tab of the plan and return to the Manpower Mob Plan tab. -> The chart shows the graphs again and the legend matches the checked rows.
3. Press browser Back. -> The previous page shows.
4. Press browser Forward. -> The same chart with the same legend shows.
5. Reload the page. -> The graphs saved in the plan show again; the checked state follows the product rule (question 2).

### TC-021 [FE][MT] Verify a second user sees a change of the graphs after a refresh (Exotic: two users) [Partial: two sessions]
Precondition: common; TM in window 1, JO in window 2, same Active plan
Priority: Medium
Trace: AC-1.2
1. In window 1 add or delete one graph with the Add Data or delete control of the other Stories. -> The chart in window 1 changes.
2. In window 2 refresh the page. -> The chart and legend in window 2 show the same graphs as window 1.
3. In window 2 uncheck a row. -> Window 1 does not show a wrong state; the product rule of question 2 holds.

### TC-022 [FE][MT] Verify the header controls can be reached with the keyboard in order (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-1.3
1. Press Tab from the title `POB Chart`. -> The focus moves to the `Hide Table` toggle.
2. Press Tab. -> The focus moves to `Export Chart`.
3. Press Tab. -> The focus moves to `Add Data`.

### TC-023 [FE][MT] Verify the page stays usable when 10 graphs show at once with many dates (BND) [Manual: layout judged by eye]
Precondition: plan with 10 graphs and a wide timeline
Priority: Low
Trace: AC-2.1
1. Open the tab. -> All 10 lines are drawn and can be told apart by colour or line style.
2. Look at the legend. -> All 10 names can be read, none is cut off (question 8).

### TC-024 [FE][MT] Verify a legend entry removed and restored keeps the legend order (POS) [Manual: order is judged by eye]
Precondition: common, 3 rows checked
Priority: Low
Trace: AC-2.2
1. Write down the legend order. -> The order is written down.
2. Uncheck the first row. -> The first entry disappears.
3. Check the first row again. -> The entry returns and the order equals step 1 (or a rule given by BA, question 8).

### TC-025 [FE][MT] Verify the chart redraws correctly when the window is made narrower (Exotic: resize) [Manual: layout judged by eye]
Precondition: common
Priority: Low
Trace: AC-2.5
1. Make the browser window narrower. -> The horizontal scroll bar for the chart appears; no text overlaps.
2. Scroll sideways. -> Chart and Data Table move together and the Y-axis stays on the left.
3. Make the window wide again. -> The chart fills the width; no leftover empty space.

### TC-026 [FE][MT] Verify a graph name with long text, special characters or HTML-like text shows exactly as saved in the legend (Exotic: strange input) [Partial: names depend on Add Data limits]
Precondition: graphs whose names are made through Add Data with these values, if the screen accepts them: a name at its maximum length (question 13), `Crew & Staff <b>1</b>`, a name with Thai letters, `POB`, `pob` (case variants)
Priority: Medium
Trace: AC-2.2
1. Open the tab. -> The legend lists each name exactly as saved, the HTML-like text is shown as text and not formatted.
2. Look at the page. -> The layout does not break; a long name is cut or wrapped without covering the chart.
3. Reload the page. -> The same names show.
4. Check `POB` and `pob`. -> They are two separate legend entries.

### TC-027 [FE][MT] Verify hovering a date point shows a tooltip with the date, the graph name and the value equal to the Data Table cell (POS) [Auto]
Precondition: common; a plan with at least one graph that has non-zero values on some days
Priority: Medium
Trace: AC-3.1
1. Read the Data Table row of one graph and write down the value of 3 dates (one non-zero, one zero, the last). -> The 3 values are written down.
2. Hover the chart point of the first date. -> A tooltip shows the date (for example `22 May`), the graph name followed by a colon, and the value.
3. Compare the tooltip value with step 1. -> It equals the Data Table cell of the same date.
4. Repeat steps 2 and 3 for the other 2 dates. -> Each tooltip value equals its Data Table cell.
5. Look at the point against the Data Table. -> The point sits over the table column of the same date.
Starting data: a plan with graph data. Data set: values read from the Data Table. Clean up: none. Reason: tooltip is an HTML element, readable by script. Question 14 (tooltip is no longer only a suggestion).

### TC-028 [FE][MT] Verify the first and last dates of the chart, the Data Table header and the schedule grid use the same range (BND) [Partial: axis labels are drawn in a canvas, a picture is needed]
Precondition: common; record the first and last date of the schedule grid and the Earliest Task Start Date and Latest Task End Date of the plan
Priority: High
Trace: AC-3.3.1
1. Read the first and last date column of the Data Table header. -> The two dates are written down.
2. Read the first and last date of the chart X-axis. -> They equal the Data Table dates of step 1.
3. Compare them with the first and last date of the schedule grid above. -> They are the same range as the schedule: the Earliest Task Start Date minus 7 days to the Latest Task End Date plus 7 days (Story).
4. Compare the width of one date column in the chart and in the schedule grid. -> The two show the same dates in the same order; any width difference does not move a point away from its date.
Note: on QA the planner saw the chart and table from May 12 to May 30 (19 days) while the schedule grid started May 14 (27 days). The Story expectation is kept; see question 16.

### TC-029 [FE][MT] Verify ticking and unticking graphs does not make the page ask to save (NEG) [Auto]
Precondition: common; a plan with at least one graph; the page `Save` button is disabled on open
Priority: Medium
Trace: AC-3.3.3, AC-3.3.4
1. Read the state of the page `Save` button. -> It is disabled; the state is written down.
2. Uncheck every row of the Data Table. -> All rows are unchecked; `Save` is still disabled.
3. Check one row again. -> The row is checked; `Save` is still disabled (a view choice leaves nothing to save).
4. Leave to another tab of the plan. -> No "unsaved changes" message is shown.
Clean up: leave the rows checked. Question 2 (are ticks kept per plan or per user?).

### TC-030 [FE][MT] Verify the Hide Table toggle hides the Data Table, gives the space to the chart and brings back the same rows and ticks (POS) [Auto]
Precondition: common; a plan with at least one graph; one row unchecked
Priority: Medium
Trace: AC-1.3, AC-3.3.4
1. Write down the height of the chart and the row names with their tick state. -> The values are written down.
2. Switch `Hide Table` on. -> The Data Table is removed and the chart is taller than in step 1.
3. Switch `Hide Table` off. -> The Data Table returns with the same rows and the same tick state as step 1; the chart height equals step 1.
4. Switch `Hide Table` on again and look at the toggle. -> The toggle stays enabled and the chart still shows the lines of the checked rows.
Note: the full behaviour is ETM-6379; only the effect on the chart is checked. Question 11.

### TC-031 [FE][MT] Verify a plan outside the current month opens on the plan's own dates, with no empty months before (POS) [Auto]
Precondition: a plan whose dates are in a different month from today (record today's month and the plan's first date)
Priority: Medium
Trace: AC-3.3.1
1. Open the Manpower Mob Plan tab of that plan. -> The chart opens.
2. Read the first date of the chart and the Data Table. -> It is the plan's first date minus 7 days, not a date near today.
3. Scroll to the start and the end. -> No empty month before the first date or after the last date.

### TC-032 [FE][MT] Verify the chart and the Data Table do not change when the schedule grid above is filtered (POS) [Auto]
Precondition: common; a plan with graph data; the schedule grid has a filter (from the grid filter Story, for example untick one resource)
Priority: Medium
Trace: AC-3.1
1. Write down the Data Table values of one graph. -> The values are written down.
2. Filter the schedule grid, for example untick one resource. -> The grid rows change.
3. Read the Data Table values and the chart points again. -> They equal step 1.
4. Clear the filter. -> The grid is back and the chart is unchanged.
Clean up: clear the filter.

### TC-033 [FE][MT] Verify a Job Owner sees the same three header controls as the Turnaround Manager (POS) [Auto]
Precondition: common; JO account with View Active Manpower Mob Plan Item; the plan is Active
Priority: Medium
Trace: AC-1.2, AC-1.3
1. As JO, open the Manpower Mob Plan tab of the Active plan. -> The `POB Chart` header is shown.
2. Read the controls on the right of the header. -> The Story says `Hide Table` toggle, `Export Chart` and `Add Data`, in this order; the actual list is written down.
3. Compare with the TM header. -> They are the same as TM (Story: the chart is the same for every user).
Note: on QA the planner saw JO without `Add Data`. The Story expectation is kept; see question 17.

## Automation notes

- Data tables the tests loop over: TC-013 (series, date, value), TC-018 (state, Hide Table, Export Chart), TC-016 (dates read from the plan).
- All Automate cases make or reuse their own plan and wait for the chart to finish drawing before reading it.

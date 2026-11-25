# Draft test cases - ETM-6394 Manpower Mob Plan - POB Chart Edit Data Graph

Story: ETM-6394 (frozen text, no comments). Source: story.md, docs/modules/manpower-mob-plan.md, knowledge/. No analyst.md or inspector.md exists for this exam: AC ids below are numbered from the Story (AC-1.1 = AC 1 item 1, and so on).
Existing [QA] subtasks: none known.
Common precondition: logged in as a Turnaround Manager that has the `Edit POB Chart` permission; the Manpower Mob Plan dashboard of an event is open; the POB Chart Data Table has at least three data graphs: "Graph A" (Summary, POB Onboard, all other filters All, Solid, Dark Blue #1D2A4B, checked), "Graph B" (Constant, Value 10, Dash, checked) and "Graph C" (Summary, unchecked). Names are made up.
Notation: [FE] front end. Priority comes from damage (the Story has none).

AC list (from Story): AC-1.1 right-click shows Edit; AC-1.2 panel title Edit Data on the right; AC-1.3 prefill; AC-1.4 every field editable; AC-1.5 permission guard; AC-2.1 Name (max 50, duplicates allowed), Line, Line Color; AC-2.2 Summary/Constant switch with in-memory retention; AC-2.3 7 Summary filters; AC-3.1 Back (bottom-left, discards); AC-3.2 Save (bottom-right, disabled rules, commits at once); AC-3.3 immediate commit; AC-3.4 chart, legend, table refresh and checkbox preservation; AC-3.5 decoupled from page Save; AC-3.6 Last Write Wins.

## Think like the user
- Who: Turnaround Manager, edits graph lines a few times while preparing the plan, often in a hurry, between other work.
- Wants: change the line name, colour or filters and see the chart change at once, without touching the page Save.
- Careless user: blanks the Name, types a long name, switches mode and back, hits Back by habit, double clicks Save, leaves the panel open while a colleague edits the same graph.

## Coverage map
| Requirement / state | Technique | Risk | Cases |
|---|---|---|---|
| AC-1.1 context menu | Roles, error guessing | Menu missing or on wrong row | TC-001, TC-002, TC-003 |
| AC-1.2 title and side | Screen states | Wrong title or side | TC-004 |
| AC-1.3 prefill | Input groups, fixed list | Wrong or stale values shown | TC-005, TC-006, TC-007, TC-008 |
| AC-1.4 all editable | Field interaction | A field locked | TC-009 |
| AC-1.5 permission | Roles | Permission leak, direct use | TC-010, TC-011 |
| AC-2.1 Name | Edge values, strange input | Limit, duplicate, special text | TC-012, TC-013, TC-014, TC-015 |
| AC-2.1 Line, Colour | Fixed list, L-7 | Selected mark only on hover | TC-016, TC-017 |
| AC-2.2 switching | State changes | Values lost or mixed | TC-018, TC-019, TC-020 |
| AC-2.3 7 filters | Combinations, fixed list | One dimension not saved | TC-021, TC-022 |
| Value field | Edge values | Range, decimals, letters | TC-023, TC-024 |
| AC-3.1 Back | Unsaved changes | Edits saved by mistake | TC-025, TC-026 |
| AC-3.2 Save rules | Condition table | Save enabled with bad data | TC-027, TC-028 |
| AC-3.3 commit | Leaving and coming back | Not stored | TC-029 |
| AC-3.4 refresh | Effects and reverse, many screens | Checkbox lost, old values | TC-030, TC-031, TC-032, TC-033 |
| AC-3.5 decoupling | State changes | Page Save or Unsaved modal wrongly tied | TC-034, TC-035 |
| AC-3.6 concurrency | Two users | Wrong winner, deleted graph | TC-036, TC-037 |
| Keyboard, paste, double click, network | Real-user view | Duplicate save, silent failure | TC-038, TC-039, TC-040 |

Categories (lessons-learned): 1 two people: relevant (TC-036, TC-037). 2 filter+sort+search: not relevant, no list filter in the panel (the 7 filters are data parameters, TC-021). 3 old data after migrations: not relevant, no migration in the Story. 4 strange input: relevant (TC-014, TC-015, TC-024). 5 reordering: not relevant, no reorder in the Story. 6 linked data: relevant (chart, legend, table, TC-030 to TC-033). 7 charts depending on each other: relevant (scale, TC-031). 8 same data on many pages: relevant (name in legend, table, panel, TC-033). 9 matrix: relevant (TC-021 expected-values table). L-1..L-8: L-7 used (TC-017); L-2 used for survival after reload (TC-029); L-6 case variants of Name (TC-013); L-1, L-3, L-4, L-5, L-8 not relevant (no sorted list, search, multi-row paste, collapse levels; Story is frozen).
Skipped on purpose: loading and very-many-rows states of the table are covered only by TC-033 (long name); screen states "no permission" TC-010, "read-only" none in Story.

Counts: see end of file.

## Open questions
1. AC-2.2 says Value default is 0, but the field table says "if previously unset, default value is none". For a graph that was Summary, what does Value show when the user first switches to Constant: empty or 0? TC-020 expects an empty Value and a disabled Save (as the field table says); confirm.
2. Name made of spaces only: is Save disabled (blank) or enabled? TC-028 expects disabled (a user calls this blank); confirm.
3. If the user changes a field and then changes it back by hand, is Save still enabled? The Story is silent. TC-027 expects the Save state to be the same as when nothing was changed (a user calls that nothing to save); the answer decides whether that state is disabled or enabled.
4. Does Back with edits ask for confirmation? Story says it closes without saving; TC-025 expects no prompt.
5. Which message or signal shows after a failed Save (network or server error)? Story has none; TC-040 expects the panel stays open with the data kept and some visible error.
6. When another user deleted the graph while the panel is open, what message appears on Save? Story silent; TC-045 expects a visible message and no ghost row; TC-037 covers the changed-graph half.
7. Value: are decimals refused or rounded? Field table says integer; TC-024 expects a decimal is not accepted as a saved decimal.
8. Does the context menu show other options beside Edit (for example Delete)? Not in the Story; only Edit is checked.
9. Does the edited line and scale recalculate when Data Type changes between Summary and Constant on a checked graph? AC-3.4 says "updated parameters", TC-031 expects yes.
10. Suggestion (not in Story): Esc key and click outside the panel; the Story only names Back, so TC-026 and TC-053 record what happens and check nothing is saved.
11. After a Save as Constant or Summary, what do the other mode's controls show when the user switches back in a reopened panel (TC-046)? Story says retention lasts until saved or discarded; expected here: nothing stale from before the save.
12. Suggestion (not in Story): right-click on the chart legend or the line itself. Suggestion (not in Story): a duplicate-name warning (Story says none). Suggestion (not in Story): a phone or tablet layout of the side panel.

## Test cases (53 flows)

### TC-001 [FE] Verify right-click on a data row shows the Edit option (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1
1. Right-click the row "Graph A" in the POB Chart Data Table. -> A context menu appears next to the row; it has the option `Edit`.
2. Click `Edit`. -> The side panel opens (title in TC-004).
Automate: runs every release, result is fixed. Starting data: three graphs (common). Check: menu text `Edit`, panel visible. Data set: none. Clean up: close panel with Back. Independent: yes.

### TC-002 [FE] Verify the panel is for the row that was right-clicked, for first, middle and last row (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1, AC-1.3
1. Right-click the first row, click `Edit`. -> The panel Name shows the name of the first row.
2. Click `Back`. -> The panel closes.
3. Right-click the last row, click `Edit`. -> The panel Name shows the name of the last row, not the first row.
4. Click `Back`. -> The panel closes.
5. Right-click a middle row, click `Edit`. -> The panel Name shows the name of that middle row.
Automate: loops over rows. Starting data: at least 3 graphs with different names. Clean up: none.

### TC-003 [FE] Verify right-click while a panel is already open and right-click on empty table area (Exotic: wrong target) [Manual: needs a person to judge what the user sees]
Precondition: common
Priority: Low
Trace: AC-1.1
1. Right-click on an empty area of the Data Table (not on a row). -> No context menu with `Edit` for a graph appears.
2. Open the Edit panel for "Graph A". -> The panel opens.
3. Right-click the row "Graph B" and click `Edit`. -> The panel now shows the values of "Graph B", none of the values of "Graph A" are left.

### TC-004 [FE] Verify the panel title and position (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Right-click "Graph A", click `Edit`. -> A panel slides in on the right side of the screen with the title `Edit Data`.
2. Look at the footer. -> `Back` is at the bottom-left and `Save` at the bottom-right.
Automate: text and position check.

### TC-005 [FE] Verify prefill of a Summary graph with all seven filters set (POS) [Auto]
Precondition: common; "Graph A" saved as Name `Graph A`, Line Dash, Line Color the 5th swatch, Data Type Summary, Summary Type Manpower Mobilization, Resource Type Organic Crew, Accommodation Barge, D/N Shift Night, Hot Bed Yes, Transportation (Mob) Vessel, Transportation (Demob) MSB.
Priority: High
Trace: AC-1.3
1. Open Edit for "Graph A". -> Name shows `Graph A`; Line shows Dash; the 5th swatch has a white checkmark; Data Type shows Summary.
2. Read the seven filters. -> Summary Type Manpower Mobilization, Resource Type Organic Crew, Accommodation Barge, D/N Shift Night, Hot Bed Yes, Transportation (Mob) Vessel, Transportation (Demob) MSB.
Automate: Starting data: set by an Edit through the UI or API. Clean up: restore.

### TC-006 [FE] Verify prefill of a Constant graph (POS) [Auto]
Precondition: common; "Graph B" is Constant, Value 10.
Priority: High
Trace: AC-1.3
1. Open Edit for "Graph B". -> Data Type shows Constant; Value shows `10`; Line shows Dash.
2. Look for the Summary filters. -> The seven Summary filters are not shown.
3. Click `Back`, save "Graph B" with Value `0` (set by an Edit), open Edit again. -> Value shows `0`, not empty.
4. Click `Back`, save "Graph B" with Value `-5`, open Edit again. -> Value shows `-5`, not empty and not `0`.
Automate: fixed data, data set 10, 0, -5. Clean up: restore Value 10.

### TC-007 [FE] Verify prefill for each non-default value of every fixed list (Combinations) [Auto]
Precondition: common
Priority: High
Trace: AC-1.3, AC-2.3
1. Save graphs so each value of each list appears at least once in a graph (expected-values table below). -> Graphs are saved.
2. For each graph open Edit and read the filters. -> Each filter shows exactly the saved value, not `All`.
Expected-values table (the test loops over it): Summary Type: POB Movement, POB Onboard, Manpower Mobilization, Manpower Demobilization | Resource Type: All, Organic Crew, Extra Turnaround | Accommodation: All, LQ, Barge, FSO | D/N Shift: All, Day, Night | Hot Bed: All, Yes, No | Transportation (Mob): All, Helicopter, MSB, Vessel | Transportation (Demob): All, Helicopter, MSB, Vessel. Each value is saved alone with the other six at default, then read in the panel.
Automate: loops over the table. Clean up: delete or restore graphs.

### TC-008 [FE] Verify prefill is fresh after a reload and shows the saved value, not an earlier unsaved one (Leaving and coming back) [Auto]
Precondition: common
Priority: High
Trace: AC-1.3
1. Open Edit for "Graph A", type `Temp` in Name, click `Back`. -> The panel closes.
2. Without reloading, open Edit for "Graph A" again. -> Name shows `Graph A`, not `Temp`.
3. Click `Back`, reload the page and open Edit for "Graph A". -> Name shows `Graph A`.

### TC-009 [FE] Verify every prefilled field can be changed (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.4
1. Open Edit for "Graph A". -> The panel opens.
2. Change Name, Line, Line Color and Data Type. -> Each control accepts the change and shows the new value.
3. With Data Type Summary change each of the seven filters. -> Each accepts a new selection; no field is disabled or read-only.
4. Switch to Constant and type `5` in Value. -> Value shows `5`.

### TC-010 [FE] Verify a user without Edit POB Chart permission gets no context menu (NEG) [Auto]
Precondition: logged in with a role that does not have `Edit POB Chart` (the Job Owner account); the dashboard is open.
Priority: High
Trace: AC-1.5
1. Right-click the row "Graph A". -> No custom context menu appears; there is no `Edit` option.
2. Right-click a second row. -> No `Edit` option appears.
3. Look at the page. -> No Edit Data panel is open.
Automate: role fixture. Starting data: a graph exists.

### TC-011 [FE] Verify the Edit option is not reachable by keyboard or by another route without permission (Exotic: permission bypass) [Manual: needs a person to try ways to reach the panel]
Precondition: same as TC-010
Priority: Medium
Trace: AC-1.5
1. Select a row with Tab and press the keyboard context-menu key or Shift+F10. -> No `Edit` option appears.
2. Reload the page. -> No `Edit` option appears after reload either.
3. Log in as a user with the permission in the same browser. -> The `Edit` option appears on right-click.

### TC-012 [FE] Verify Name limit of 50 characters: 49, 50, 51 (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.1
1. Open Edit, type a 49-character name. -> Name shows all 49 characters; Save is enabled.
2. Type a 50-character name. -> Name shows all 50 characters.
3. Type a 51-character name. -> Name shows only the first 50 characters (the 51st is not accepted) or the field shows one clear limit message and no other message; Save never stores 51 characters.
4. Click `Save` with 50 characters and reopen Edit. -> Name shows the same 50 characters.
Automate: data set 49/50/51. Clean up: restore name.

### TC-013 [FE] Verify two graphs may have the same name, and case variants stay apart (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Edit "Graph C" and change its Name to `Graph A`. -> Name shows `Graph A`.
2. Click `Save`. -> The panel saves without any duplicate message; the table shows two rows named `Graph A`.
3. Edit "Graph C" and change its Name to `graph a`. -> Save stores it; the table shows `graph a` with that exact case.
Clean up: restore names.

### TC-014 [FE] Verify strange characters in Name are stored and shown back exactly (Exotic: strange input) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Edit "Graph A" and type each value of the data set in Name, click `Save`. -> The panel closes without error.
2. Look at the table row, the legend and, after reload, the panel Name. -> All three show the value exactly as typed.
Data set (only values the field lets the user type): `A\B/C:D*E?F"G<H>I|J&K#L%M'N`, `  lead and trail  `, `<b>bold</b>`, `ทดสอบ กราฟ`, `Graph 😀😀`, `日本語`. Expected for the spaces value: user sees the name trimmed or as typed, same in all three places (question 2 style: confirm). Automate: loops over the set.

### TC-015 [FE] Verify pasting a name works and a long paste is cut at 50 (Exotic: paste) [Partial: clipboard handling differs by browser]
Precondition: common
Priority: Low
Trace: AC-2.1
1. Copy a 60-character text, paste it in Name. -> Name holds at most 50 characters.
2. Select part of the name and paste a short text. -> The selected part is replaced; the rest stays.
3. Paste a text with leading and trailing spaces. -> The text appears as the earlier TC-014 rule shows it for typed spaces (same result as typing).

### TC-016 [FE] Verify Line style change Solid to Dash and back is saved and drawn (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1, AC-3.4
1. Edit "Graph A" (Solid), select Dash, click `Save`. -> The panel closes; the chart line is dashed.
2. Open the legend entry. -> The legend entry shows a dashed sample.
3. Edit again, select Solid, click `Save`. -> The chart line is solid again; reload keeps it solid.
Only one of Solid and Dash is selected at any moment.

### TC-017 [FE] Verify the Line Color picker has 20 swatches and the current colour is marked without hover (POS) [Manual: needs a person to judge the look]
Precondition: common
Priority: Medium
Trace: AC-1.3, AC-2.1
1. Open Edit for "Graph A" and move the mouse away from the swatches. -> 20 swatches show; the saved colour (Dark Blue #1D2A4B by default) has a white checkmark while the mouse is away.
2. Click another swatch. -> The checkmark moves to it; the old one has none.
3. Click `Save`, reopen Edit, move the mouse away. -> The new colour has the checkmark.
4. Reload and reopen Edit. -> The new colour still has the checkmark.
5. Check the chart line and legend. -> Both use the new colour.

### TC-018 [FE] Verify Data Type switch re-renders the controls (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2
1. Edit "Graph A" (Summary). -> The seven filters are shown; Value is not shown.
2. Select Constant. -> Value is shown; the seven filters are hidden.
3. Select Summary. -> The seven filters are shown; Value is hidden.

### TC-019 [FE] Verify values of both modes are kept while switching, until Save or Back (State changes) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2
1. Edit "Graph A", change Summary Type to POB Movement and Hot Bed to No. -> Both show the new values.
2. Select Constant, type `7` in Value. -> Value shows `7`.
3. Select Summary. -> Summary Type shows POB Movement and Hot Bed shows No (the changes of step 1 are kept).
4. Select Constant. -> Value still shows `7`.
5. Switch Summary, Constant, Summary, Constant three more times. -> Each switch keeps both sets of values.
6. Click `Back`, open Edit again. -> All values are the saved ones; the typed `7` and the changed filters are gone.

### TC-020 [FE] Verify switching a never-constant graph to Constant: Value empty and Save disabled (NEG) [Auto]
Precondition: common; "Graph A" is Summary and never had a Constant value.
Priority: High
Trace: AC-2.2, AC-3.2
1. Edit "Graph A", select Constant. -> Value is empty (no `0` filled in; see question 1); Save is disabled.
2. Type `0`. -> Save is enabled.
3. Clear Value. -> Save is disabled again.

### TC-021 [FE] Verify each Summary filter dimension is changed and saved on its own (Combinations) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3, AC-3.3
1. Edit "Graph A", change only Summary Type, click `Save`, reopen. -> Only Summary Type changed; the other six filters are as before.
2. Repeat for each of the other six filters, one at a time. -> Only that filter changed each time.
3. Change all seven together, Save, reopen. -> All seven show the new values.
4. Change filters in pairs: Accommodation with D/N Shift, Transportation (Mob) with Transportation (Demob). -> Both values of each pair are saved.
Expected-values table: the same table as TC-007. The test loops over every row.

### TC-022 [FE] Verify the chart line follows the filter (Charts) [Manual: needs the expected line numbers to be judged against the data]
Precondition: common; "Graph A" checked.
Priority: High
Trace: AC-2.3, AC-3.4
1. Record the current line values of "Graph A" for two dates. -> Values are written down.
2. Edit "Graph A", change Summary Type from POB Onboard to Manpower Mobilization, Save. -> The panel closes.
3. Read the line values for the same two dates. -> The values changed to the Manpower Mobilization numbers of the plan (compare with the Data Table row values).

### TC-023 [FE] Verify Value limits -999 to 999 (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2, AC-3.2
1. Edit "Graph B", enter the value from each data row: -999, 999, 0, -1, 1 -> Each is accepted; Save is enabled; after Save and reopen the same value shows.
2. Enter -1000 and 1000. -> The value is refused or cut, or Save is disabled; only one range message shows, no second message; it never saves a number outside -999 to 999.
3. Enter -1000 and click Save if Save is enabled, then read the chart. -> No value below -999 is stored.
Data set: -1000, -999, -1, 0, 1, 999, 1000.

### TC-024 [FE] Verify Value refuses non-integers and strange input (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.2, AC-3.2
1. In Value of "Graph B" type each data item. -> Letters `abc`, `1e3`, `12.5`, `--5`, `+`, spaces only, an emoji are not saved as a number; Save is disabled or the field shows only a valid integer.
2. Type `-` only. -> Save is disabled.
3. Type `007`. -> Save stores 7 (or 007 shown as 7); the table shows 7.
Data set: `abc`, `1e3`, `12.5`, `--5`, `-`, `   `, `😀`, `007`. Question 7 open for `12.5`.

### TC-025 [FE] Verify Back closes the panel without saving anything (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1
1. Edit "Graph A": change Name, Line, Line Color, Data Type to Constant and Value `3`. -> All show the changes.
2. Click `Back`. -> The panel closes; no confirmation is asked (question 4).
3. Look at the table row, the legend and the chart. -> Name, line style, colour and values are all the old ones; the checkbox of "Graph A" is as before (checked).
4. Open Edit again. -> All fields show the saved values.

### TC-026 [FE] Verify closing the panel other ways does not save (Exotic: leave midway) [Manual: browser actions]
Precondition: common
Priority: Medium
Trace: AC-3.1
1. Edit "Graph A", change Name, press Esc. -> Record whether the panel closes; the table row, legend and chart still show the old name, nothing was saved.
2. Edit "Graph A", change Name, click outside the panel. -> Record whether the panel closes; the table row, legend and chart still show the old name, nothing was saved; reopening Edit shows the old name.
3. Edit again, change Name, press the browser Refresh. -> The page reloads; "Graph A" keeps its old name.
4. Edit again, change Name, click the breadcrumb to leave the page and return. -> "Graph A" keeps its old name; no edit was saved.

### TC-027 [FE] Verify Save state after undo by hand: nothing changed means nothing to save (State changes) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.2
1. Open Edit for "Graph A" and change nothing. -> Save state is written down (question 3: a user expects Save disabled because there is nothing to save).
2. Type an extra letter in Name, then delete it. -> Name shows `Graph A` again; Save is in the same state as in step 1.
3. Select Dash for Line, then select Solid again. -> Save is in the same state as in step 1.
4. Pick another Line Color swatch, then pick the saved swatch again. -> The saved swatch has the checkmark; Save is in the same state as in step 1.
5. Change Resource Type to Organic Crew, then back to All. -> Save is in the same state as in step 1.
6. Select Constant and then Summary again without typing a Value. -> The filters show the saved values; Save is in the same state as in step 1.
7. Click `Back`. -> The panel closes; "Graph A" is unchanged.

### TC-028 [FE] Verify Save disabled rules: Name blank, Constant with empty Value (Condition table) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2
1. Condition table, the test loops over each row: Name filled + Summary -> Save enabled. Name empty + Summary -> disabled. Name spaces only + Summary -> disabled (question 2). Name filled + Constant + Value filled -> enabled. Name filled + Constant + Value empty -> disabled. Name empty + Constant + Value filled -> disabled. Name empty + Constant + Value empty -> disabled. -> The button state matches each row.
2. Fill the missing field of a disabled row. -> Save becomes enabled at once.
3. Click the disabled Save. -> Nothing is saved and the panel stays; no error message or any other message shows for a disabled button.

### TC-029 [FE] Verify Save commits at once and survives reload (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2, AC-3.3
1. Edit "Graph A", change Name to `Graph A2` and Line Color, click `Save`. -> The panel closes.
2. Reload the page without pressing the page-level Save. -> The table, legend and chart show `Graph A2` and the new colour.
3. Open Edit. -> The panel shows `Graph A2` and the new colour.
4. Log in with another user in a second context and open the page. -> The other user sees `Graph A2` too.

### TC-030 [FE] Verify a checked graph stays checked and recalculates after Save (POS) [Auto]
Precondition: common; "Graph A" is checked.
Priority: High
Trace: AC-3.4
1. Record the line values and the scale maximum. -> Values are written down.
2. Edit "Graph A", select Constant with Value 200, click `Save`. -> The panel closes.
3. Look at the checkbox. -> It is still checked and the line is visible.
4. Read the line and the scale. -> The line shows 200 on every date; the scale covers 200; both differ from step 1.
5. Look at the checkboxes of "Graph B" and "Graph C". -> "Graph B" is still checked and "Graph C" is still unchecked.

### TC-031 [FE] Verify an unchecked graph stays unchecked, hidden and not in the scale (POS) [Auto]
Precondition: common; "Graph C" is unchecked.
Priority: High
Trace: AC-3.4
1. Record the scale maximum. -> The value is written down.
2. Edit "Graph C", select Constant with Value 900, click `Save`. -> The panel closes.
3. Look at the checkbox and the chart. -> The checkbox is unchecked; the line is hidden; the scale maximum is the same as in step 1.
4. Check "Graph C". -> The line appears with the new values and the scale grows to include 900.
5. Uncheck it again, edit it and Save. -> It stays unchecked.

### TC-032 [FE] Verify row, legend and chart update at once after Save, no reload (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.4
1. Edit "Graph A": Name `Alpha`, Line Dash, Line Color a new swatch, a new Summary Type, click `Save`. -> The panel closes.
2. Without reloading, read the legend, the table row and the line. -> Legend entry `Alpha` with a dashed sample in the new colour; the table row shows `Alpha` and the new filter values; the line is dashed in the new colour with new values.
3. Other graphs ("Graph B", "Graph C"). -> Unchanged.

### TC-033 [FE] Verify a 50-character name in the table, legend and panel, and that a name on a narrow view is readable (Screen state: very long content) [Manual: needs a person to judge truncation]
Precondition: common
Priority: Low
Trace: AC-2.1, AC-3.4
1. Save "Graph A" with a 50-character name. -> The save works.
2. Read the Data Table row, the legend and the panel Name. -> The full name is reachable (shown, or in a tooltip) and the layout is not broken in each place; the text is the same everywhere.

### TC-034 [FE] Verify chart edit is independent of the page-level Save, also with a pending page change (POS) [Auto]
Precondition: common; page-level Save is in its starting state (record it).
Priority: High
Trace: AC-3.5
1. Record whether the page `[ Save ]` is enabled. -> The state is written down.
2. Edit "Graph A" and click the panel `Save`. -> The panel closes.
3. Look at the page `[ Save ]`. -> Its state is the same as in step 1 (a chart edit did not enable it).
4. Leave the page by the breadcrumb. -> No `Unsaved Change` message appears because of the chart edit.
5. Return and read "Graph A". -> The edit is still stored.
6. Change another plan field on the page (for example a Mob Date) without saving. -> The page `[ Save ]` is enabled.
7. Edit "Graph A", change Name to `Pending`, click the panel `Save`. -> The panel closes; the page `[ Save ]` is still enabled and the Mob Date change is still on screen, not cleared and not saved.
8. Edit "Graph A", change Name, click `Back`. -> The page `[ Save ]` is still enabled and the Mob Date change is still there.
9. Click the page `[ Save ]`. -> The Mob Date change is saved; "Graph A" still shows `Pending`.

### TC-035 [FE] Verify page-level Save and discard do not touch committed chart edits (State changes) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.5
1. Edit "Graph A" and Save the panel; then change another plan field on the page (for example a Mob Date) without saving. -> The page Save is enabled.
2. Leave the page and choose `Discard Change`. -> The page changes are lost.
3. Return to the page. -> "Graph A" still shows the edit made in the panel.
4. Change a plan field, click the page `Save`. -> The panel edit of "Graph A" is unchanged.

### TC-036 [FE] Verify Last Write Wins when two users edit the same graph (Two users) [Auto]
Precondition: common; user 1 and user 2 both with the permission, two browser contexts.
Priority: High
Trace: AC-3.6
1. User 1 opens Edit for "Graph A" and types Name `From User 1`. -> The panel shows the name.
2. User 2 opens Edit for "Graph A" and types Name `From User 2`. -> The panel shows the name.
3. User 1 clicks `Save`, then User 2 clicks `Save`. -> Both saves finish without a conflict message.
4. Both users reload. -> Both see `From User 2`.
5. Repeat in the other order. -> The name saved last is the one shown.
6. Two users edit different graphs and save. -> Each change is kept for its own graph; neither overwrites the other graph.
Clean up: restore name.

### TC-037 [FE] Verify one user saves a graph another user is editing or has changed (Two users) [Manual: needs two people and a decision on message]
Precondition: common; two users.
Priority: Medium
Trace: AC-3.6
1. User 2 opens Edit for "Graph A" and leaves it open. -> The panel stays open.
2. User 1 changes "Graph A" to Constant 5 and saves. -> Saved.
3. User 2 changes the Line Color only and clicks `Save`. -> The save is accepted; the result is the latest commit (the Story's rule); record whether User 2's panel showed User 1's change before saving (question 6).
4. Reload. -> The latest commit shows. Nothing else breaks.

### TC-038 [FE] Verify Tab and Enter order through the panel (Real-user view) [Manual: keyboard feel]
Precondition: common
Priority: Low
Trace: AC-1.4, AC-3.2
1. Open Edit, click in Name, press Tab repeatedly. -> The focus moves Name, Line, Line Color, Data Type, then the dependent controls, then `Back`, then `Save`, in order, each focus visible.
2. Use arrow keys on a radio group. -> The selection changes.
3. With a valid form focus `Save` and press Enter. -> The panel saves like a click.

### TC-039 [FE] Verify double click on Save stores once (Exotic: double click) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.2, AC-3.3
1. Edit "Graph A", change Name to `Once`, double click `Save`. -> The panel closes once.
2. Check the table. -> One row named `Once`; no duplicate graph; the row count is the same as before.

### TC-040 [FE] Verify Save when the connection drops (Exotic: network) [Manual: needs the network to be cut by hand]
Precondition: common
Priority: Medium
Trace: AC-3.2, AC-3.3
1. Edit "Graph A", change Name to `Offline`, cut the network, click `Save`. -> The panel does not close as if it worked; a visible failure is shown (question 5); the table and chart still show the old data.
2. Restore the network and click `Save` again. -> The save works; reload shows `Offline`.

### TC-041 [FE] Verify leaving the page with unsaved panel edits by browser Back and by an in-app link (Exotic: leave midway) [Manual: browser actions]
Precondition: common
Priority: Medium
Trace: AC-3.1, AC-3.5
1. Edit "Graph A", change Name to `Leave`, press the browser Back button. -> Record whether the panel closes or the page changes; "Graph A" still shows its old name after return; the page-level `Unsaved Change` message does not appear because of the panel edit.
2. Edit "Graph A", change Name to `Leave`, click another tab link of the dashboard, then return. -> "Graph A" still shows the old name; nothing was saved; no warning shows.
3. Edit "Graph A", change nothing, click the breadcrumb. -> No warning shows.
4. Open Edit for "Graph A", change nothing, click `Back`. -> The panel closes; page `[ Save ]` and any `Unsaved Change` state are as before.
5. Save "Graph A" with Name `Kept`, then press the browser Back button. -> "Graph A" still shows `Kept` after returning.

### TC-042 [FE] Verify a view-only action does not count as a change (State changes) [Auto]
Precondition: common; page-level Save in its starting state (record it).
Priority: Medium
Trace: AC-3.5
1. Record whether the page `[ Save ]` is enabled. -> The state is written down.
2. Open Edit for "Graph A" and click `Back`. -> The panel closes; the page `[ Save ]` is as recorded.
3. Untick the checkbox of "Graph B", then tick it again. -> The page `[ Save ]` is as recorded; the line of "Graph B" hides and shows again.

### TC-043 [FE] Verify the context menu on the last rows, near the screen bottom and after scrolling the table (Edge: position) [Auto]
Precondition: common; the table has more graphs than fit on screen (add graphs if needed).
Priority: Medium
Trace: AC-1.1
1. Scroll the Data Table to the end and right-click the last row. -> The menu with `Edit` shows fully inside the screen and is not cut off.
2. Click `Edit`. -> The panel shows the name of the last row.
3. Click `Back`, scroll the table up by some rows and right-click the first visible row. -> The menu shows `Edit`; the panel opened from it shows that row's name.

### TC-044 [FE] Verify pasting into Value (Exotic: paste) [Partial: clipboard handling differs by browser]
Precondition: common
Priority: Low
Trace: AC-2.2, AC-3.2
1. Paste `abc` into Value of "Graph B". -> No letters are kept; Save is disabled or only a valid integer shows.
2. Paste `12.5`. -> Not kept as a decimal.
3. Paste `   `. -> Value counts as empty; Save is disabled.
4. Paste `5000`. -> Not saved as 5000; Save is disabled or the value is refused.
5. Paste `-7` into an empty Value. -> Value shows `-7`; Save is enabled.

### TC-045 [FE] Verify Save when another user deleted the graph while the panel is open (Two users) [Manual: needs two people and a decision on the message]
Precondition: common; two users with the permission; a spare graph "Graph D" exists.
Priority: Medium
Trace: AC-3.6
1. User 2 opens Edit for "Graph D" and leaves it open. -> The panel stays open.
2. User 1 deletes "Graph D". -> The row is gone for User 1.
3. User 2 changes Name to `Ghost` and clicks `Save`. -> A visible message tells that the graph no longer exists (question 6); no row named `Ghost` appears in the table or legend.
4. Reload as User 2. -> The table has no "Graph D" and no `Ghost`; the other graphs are unchanged.

### TC-046 [FE] Verify in-memory retention ends at Save (State changes) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.2, AC-3.2
1. Edit "Graph A", select Constant, type `9`, click `Save`, reopen Edit. -> Data Type shows Constant, Value `9`.
2. Select Summary. -> The seven filters show the defaults of a Summary graph (not the old filters of before the save, record what shows; question 11).
3. Click `Back`, edit "Graph B" (Constant, Value 10), select Summary, set Hot Bed to Yes, click `Save`, reopen. -> Data Type shows Summary, Hot Bed Yes.
4. Select Constant. -> Value shows empty or the saved value (record which; question 11), not a stale unsaved value.

### TC-047 [FE] Verify a graph just created in the Add Data panel can be edited at once (Linked screens) [Auto]
Precondition: common; the Add Data panel is available.
Priority: Medium
Trace: AC-1.1, AC-1.3
1. Create a new graph `Fresh` in the Add Data panel with Line Dash, Constant, Value 4, click its Save. -> The row `Fresh` shows in the table.
2. Without reloading, right-click `Fresh` and click `Edit`. -> The panel shows Name `Fresh`, Line Dash, Constant, Value `4`.
3. Change Name to `Fresh 2`, click `Save`. -> The row, legend and line show `Fresh 2`; no second row `Fresh` is created.

### TC-048 [FE] Verify a filter combination with no matching data (Combinations) [Auto]
Precondition: common; "Graph A" checked.
Priority: Medium
Trace: AC-2.3, AC-3.4
1. Edit "Graph A": Hot Bed Yes, Accommodation Barge, D/N Shift Night, click `Save`. -> The panel closes without error.
2. Look at the line, the table row and the scale. -> The row shows zero or empty values as the data says; the line follows them; the scale is still drawn; the page shows no error or broken chart; the checkbox is still checked.

### TC-049 [FE] Verify Save changes only what was touched (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.1, AC-3.3
1. Edit "Graph B" (Constant, Value 10, Dash, checked), change only Name to `B2`, click `Save`, reload, open Edit. -> Name `B2`; Value `10`, Dash, Constant unchanged; the checkbox is as before.
2. Change only the Line Color, Save, reload, open Edit. -> The new colour; Name `B2`, Value `10`, Dash, Constant unchanged.
3. Edit "Graph A" (Summary), change only Name, Save, reload, open Edit. -> Name changed; the seven filters, Line, Line Color and the checkbox are as before.

### TC-050 [FE] Verify the new name on the chart hover label and in print or export of the chart (Same data, many places) [Manual: needs a person to read hover labels]
Precondition: common
Priority: Low
Trace: AC-3.4
1. Save "Graph A" with Name `Alpha`, then hover over its line on the chart. -> The tooltip or hover label shows `Alpha`.
2. If the page offers print or an export of the chart, use it. -> The output shows `Alpha` with the new style; if there is no such function, write "not available".

### TC-051 [FE] Verify each fixed-list value is shown in the Data Table row after Save (Fixed lists) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.3, AC-3.4
1. For each value in the expected-values table of TC-007, save a graph with that value and read its Data Table row, without reload. -> The row shows exactly that value for that dimension, and the other dimensions show their defaults.
2. For Line Solid and Dash, and Data Type Summary and Constant, read the row and legend. -> The row and legend match the saved choice.
Expected-values table: the same as TC-007, plus Line: Solid, Dash and Data Type: Summary, Constant. The test loops over every row.

### TC-052 [FE] Verify legend and table hold the same graphs in the same order after edits, with many graphs (Screen state: very many rows) [Auto]
Precondition: common; more graphs exist than fit in the table without scrolling.
Priority: Medium
Trace: AC-3.4
1. Read the order of names in the Data Table and the legend. -> Both list the same graphs in the same order.
2. Edit the first, a middle and the last graph (change Name each), Save each. -> After each Save the names in table and legend change on the same graph.
3. Read the order again. -> The order is unchanged and the same in table and legend; the number of graphs is the same as before.

### TC-053 [FE] Verify the Edit Data panel behaves like the Add Data panel (Shared control) [Manual: needs a person to compare two panels]
Precondition: common
Priority: Low
Trace: AC-1.2, AC-3.1
1. Open the Edit Data panel and the Add Data panel one after the other. -> Both slide in from the right, with the same width and the same footer: `Back` bottom-left, `Save` bottom-right.
2. In each panel click `Back`, press Esc, and click outside, with and without typed text. -> Both panels react the same way (record any difference); neither saves anything.
3. In each panel type a 51-character Name. -> Both treat the limit the same way.

## Counts
High: TC-001, 002, 005, 006, 007, 008, 010, 012, 018, 019, 020, 021, 022, 023, 025, 028, 029, 030, 031, 032, 034, 036, 049 = 23. Medium: TC-004, 009, 011, 013, 014, 016, 017, 024, 026, 027, 035, 037, 039, 040, 041, 042, 043, 045, 046, 047, 048, 051, 052 = 23. Low: TC-003, 015, 033, 038, 044, 050, 053 = 7. Total 53.
Auto: 37. Partial: 2 (TC-015, TC-044). Manual only: 14.

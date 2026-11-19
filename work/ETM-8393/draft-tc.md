# ETM-8393 Draft test cases

Story: ETM-8393 [Improvement] Shutdown Logic - Capacity and Consumption Tooltip on Manpower Histogram
Source: story.md, analyst.md (incl. BA answers of 18 Nov 2026), inspector.md (Figma 83:858533), docs/modules/shutdown-logic.md. Figma and Jira were not called.
Existing [QA] subtasks: ETM-8562 [QA] Create Test Case Manual Test, ETM-8563 [QA] Execute Test Case Manual Test.
Common precondition: logged in as a user with permission View All Shutdown Logic Item or View Active Shutdown Logic Item; the Shutdown Logic page of a plan is open and the Manpower Resource histogram (table left, chart right) shows at least one resource row with a bar, and at least one row where the Used Resource value changes along the plan. Build with the tooltip is not yet available (Q5).
Notation: `->` separates the action from the expected result. Priority comes from damage if it breaks (the Story has no priority).
Wording: the second tooltip value is called `Used Resource` (BA answer; the Story AC says Consumption). The tooltip has no date, no unit, whole numbers only, no decimals (BA answer).
Sample data: none from the sources for this feature. Cases use "record the current value, then compare" so they do not age.

## Think like the user
- Who: Turnaround Manager or Job Owner, opens the Shutdown Logic page often and reads the histogram to see if the crew is enough.
- Wants: the Capacity and the Used Resource number without counting the scale.
- Careless or rushed: sweeps the mouse over many bars quickly, hovers on empty chart area, leaves the mouse and scrolls, switches the `Used Resource` toggle or a filter while the tooltip is open.

## Coverage map
| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 hover shows tooltip, leave hides it | State changes | Tooltip never shows or stays stuck | TC-001 |
| AC-1 fast move across bars, scroll, toolbar change | Error guessing | Stuck or two tooltips at once | TC-009 |
| AC-2 two lines, labels, icons | Screen states (Figma 83:858533) | Wrong label, icon or order | TC-002 |
| AC-2 values equal Capacity column and bar | Same data on many pages (lesson 8) | Capacity and Used Resource swapped or wrong | TC-003 |
| AC-2 icon colour red bar | Condition table | Icon colour differs from bar | TC-004 (red when Used Resource is above Capacity) |
| AC-2 icon colour green bar | Condition table | Green bar shows red icon | TC-005 (green when Used Resource equals or is below Capacity, incl. equal) |
| AC-3 same height section = same values | Equivalence | Values differ inside one section | TC-006 |
| AC-3 height changes, next section own values | Boundary | Old values kept after height change | TC-007 |
| AC-3 Capacity changes, Used Resource height same = one section | Boundary | Split into two sections | TC-014 |
| AC-3 Capacity and Used Resource height both change = new section | Boundary | Old Capacity kept in new section | TC-015 |
| AC-3 same height but a gap between = two sections | Boundary | Gap treated as one section | TC-013 |
| AC-4 no Works list | Error guessing | Works list appears | TC-002 (last step) |
| Screen state: no bar (gap, 0) | Screen states, BA answer | Tooltip on empty area | TC-008 |
| Gantt data change (manpower or dates) updates the bar | Linked data (categories 6, 7, 8) | Tooltip keeps the old Used Resource | TC-010 |
| PTTEP crew and Contractor rows (ETM-7898) | Equivalence | Wrong values for one resource type | TC-003 |
| Screen state: filters changed; Used Resource toggle on (if present on the build) | Linked data, charts (categories 6, 7, 8) | Tooltip shows value of filtered-out tasks | TC-010 |
| AC-2 Capacity 0 outside shift Working Time (ETM-15 AC 5.2) | Boundary | Capacity shown wrong outside working time | TC-012 |
| Pre: permission View All / View Active | Roles and permission | Tooltip missing for one role | TC-011 (QA .env has one user of each role, see shutdown-logic.md) |
| Loading, error, slow internet | Screen states | Half-drawn tooltip | Not planned: Story is silent (see Suggestions) |

Considered and covered: 6 Linked data, 7 Charts that depend on each other and 8 Same data on many pages (tooltip values against the table Capacity, the bar and the filters: TC-003, TC-010).
Categories not relevant: 1 Two people at once (read-only hover, nothing is written); 2 Filter, Sort, Search (only filter effect on values, TC-010); 3 Old data (feature is new, no migration); 4 Strange input (no input field); 5 Reordering (no reorder); 9 Matrix (no calculation, two values per hover point).

Counts: High 5 (TC-001, 002, 003, 006, 007), Medium 10 (TC-004, 005, 008, 009, 010, 011, 012, 013, 014, 015), Low 0.
Automation: Auto 9 (TC-001, 002, 003, 006, 007, 008, 013, 014, 015), Partial/Manual 6 (TC-004, 005, 009, 010, 011, 012). Hover and text are scriptable; colour needs a person to judge.

## Open questions
- Q10 Missing - ask: how to leave the Manpower Resource tab without saving or undo the change (docs only say manpower is changed in the Manpower Resource tab of Breakdown Setting), and when the histogram updates (after Save or at once). Assumption, not confirmed: a user who can edit tasks is needed (not a Job Owner) and task dates can be changed the same way. TC-010 steps 4 to 9 use the docs wording only.
- Q5 Which build and environment carries the tooltip? [FE] Implement UI ETM-8534 is Open, so nothing can be run yet.
Skipped on BA answer: tooltip at the right edge of the chart (no clamping required), decimals (whole numbers only).
Suggestion (not in Story): loading and error behaviour of the histogram with the tooltip; touch device behaviour (no hover on a phone).

## Test cases (15 flows)

### TC-001 [FE][MT] Verify hovering a histogram bar shows the tooltip and moving away hides it (POS) [Auto]
Precondition: common; the histogram has at least 2 resource rows that each show a bar
Priority: High
Note: hovering anywhere inside the area of a bar section shows the tooltip, also where the bar is lower than the capacity line (BA answer).
1. Move the mouse over a bar of a resource row in the histogram chart. -> A small white card appears above the mouse pointer.
2. Move the mouse a little along the same bar. -> The card follows the mouse pointer.
3. Move the mouse to an empty area outside the chart. -> The card disappears.
4. Move the mouse over a different bar of another resource row. -> The card appears again for that bar and only one card is shown.
Automation: starting data is any plan with at least two resource rows with bars; check the card is visible after hover and not in the page after leaving; no clean up (read only).

### TC-002 [FE][MT] Verify tooltip content: labels, icons, values and no Works list (POS) [Auto]
Precondition: common
Priority: High
1. Hover over a bar and read the first line of the card. -> The first line shows a line icon, the text `Capacity` and a number on the right.
2. Read the second line of the card. -> The second line shows a box icon, the text `Used Resource` and a number on the right.
3. Check the numbers. -> Both numbers are whole numbers with no unit and the card shows no date.
4. Look for Work names or a list of Works in the card. -> The card shows only the two lines, no Work is listed.
5. Look at the line icon next to `Capacity`. -> The line icon is red.
Automation: check both label texts and their order, the two numbers are integers, the line icon next to `Capacity` is red, and the card contains no other rows.

### TC-003 [FE][MT] Verify Capacity and Used Resource in the tooltip match the table and the bar (POS) [Auto]
Precondition: common; the table lists one PTTEP crew resource and one Contractor resource with different Capacity values, and both rows show a bar.
Priority: High
1. Read the `Capacity` value of the PTTEP crew resource row in the table on the left and write it down. -> The Capacity value of the row is written down for comparison.
2. Hover over a bar of the same row and read `Capacity` in the card. -> The `Capacity` in the card is equal to the value noted from the table.
3. Compare the bar height with the scale on the chart at the hovered point. -> The `Used Resource` number in the card equals the value the bar height shows on the scale.
4. Read the `Capacity` value of the Contractor resource row in the table and write it down. -> The Capacity value of the Contractor row is written down for comparison.
5. Hover over a bar of the Contractor row and read `Capacity` in the card. -> The `Capacity` in the card is equal to the value noted for the Contractor row, not the value of the PTTEP crew row.
6. Compare the bar height of the Contractor row with the scale at the hovered point. -> The `Used Resource` number in the card equals the value the bar height shows on the scale.
Automation: data set is one PTTEP crew row and one Contractor row with different Capacity; expected Capacity is read from the table cell, expected Used Resource from the chart data; loop over the rows.

### TC-004 [FE][MT] Verify box icon is red when Used Resource is above Capacity (POS) [Partial: colour needs a person to judge]
Precondition: common; one bar in the histogram has Used Resource above the Capacity line and is red.
Priority: Medium
1. Hover over the red bar. -> The card appears above the pointer and follows it.
2. Compare the `Used Resource` number with the `Capacity` number. -> `Used Resource` is bigger than `Capacity`.
3. Look at the box icon next to `Used Resource`. -> The box icon is red, the same colour as the bar.
4. Look at the line icon next to `Capacity`. -> The line icon is red.
Automation: compare the icon colour with the bar colour in the page style. Priority Medium: colour is cosmetic.

### TC-005 [FE][MT] Verify box icon is green when Used Resource is equal to or below Capacity (BND) [Partial: colour needs a person to judge]
Precondition: common; one green bar has Used Resource below Capacity and one green bar has Used Resource equal to Capacity.
Priority: Medium
1. Hover over the green bar that is below the capacity line. -> The card appears with the same two lines as for a red bar.
2. Compare the `Used Resource` number with the `Capacity` number. -> `Used Resource` is smaller than `Capacity`.
3. Look at the box icon next to `Used Resource`. -> The box icon is green, the same colour as the bar.
4. Hover over the green bar that is equal to the capacity line. -> The card appears.
5. Compare the `Used Resource` number with the `Capacity` number. -> The two numbers are equal.
6. Look at the box icon next to `Used Resource`. -> The box icon is green, not red.
7. Compare the layout with the card of a red bar. -> Only the icon colour differs; labels, order and number alignment are the same.
Automation: data set is two bars (below, equal); expected icon colour green for both, red for above (TC-004); compare with the bar colour.

### TC-006 [FE][MT] Verify points inside one same-height section show the same values (POS) [Auto]
Precondition: common; one bar has a continuous section of the same height across several days, and the capacity line does not change inside the chosen section.
Priority: High
1. Hover at the left part of the section and write down both numbers in the card. -> Capacity and Used Resource are written down for comparison.
2. Hover at the middle of the section and read the card. -> The numbers are the same as the numbers noted.
3. Hover at the right part of the section and read the card. -> The numbers are the same as the numbers noted.
Automation: three hover points inside the section; assert equal values; no clean up.

### TC-007 [FE][MT] Verify the next section after a height change shows its own values (BND) [Auto]
Precondition: common; one bar changes height at some day (for example a lower section followed by a higher section).
Priority: High
1. Hover on the last point of the first section and note both numbers. -> The numbers of the first section are written down.
2. Hover on the first point of the next section, after the height changes. -> The card shows numbers for the new height, Used Resource is different from the first section.
3. Compare the new Used Resource with the bar height of the new section on the scale. -> The number equals the value the bar height shows.
4. Hover back on the first section. -> The card shows the numbers noted in step 1 again.
Automation: pick the day where Used Resource changes from the chart data; hover one point on each side; compare with the data.

### TC-008 [FE][MT] Verify no tooltip appears where there is no bar (NEG) [Auto]
Precondition: common; a resource row has a gap with no bar (Used Resource 0), or a row with no bar at all.
Priority: Medium
1. Hover over the empty chart area of a row where no bar is drawn. -> No tooltip card appears.
2. Hover over a bar of the same row. -> The card appears on the bar.
3. Move the pointer to the empty area next to the bar. -> The card disappears.
Automation: assert that no card is in the page when hovering an empty area.

### TC-009 [FE][MT] Verify the tooltip does not get stuck or double after fast moves, scroll and toolbar changes (Exotic: careless user) [Partial: timing needs a person to judge]
Precondition: common
Priority: Medium
1. Move the mouse quickly across five bars in one sweep. -> Only one card is shown at the end, for the bar under the pointer.
2. Move the mouse out of the chart quickly. -> No card remains on the page.
3. Hover over a bar and scroll the page with the mouse wheel. -> The card is hidden or shows the bar that is now under the pointer; it is not left showing a bar that is no longer under the pointer.
4. Hover over a bar. -> The card appears.
5. Click the `Expand Work Header` checkbox in the toolbar. -> The checkbox is ticked and the card disappears.
6. Look at the page. -> No card remains on the page.
7. Hover over a bar again. -> The card appears normally.

### TC-010 [FE][MT] Verify tooltip values follow filters, Gantt data changes and the Used Resource toggle (POS) [Partial: steps 4 to 9 are manual pending Q10; the rest can be scripted]
Precondition: common; the histogram bar of one row changes when one Work Header is selected in the Filter Panel. The `Used Resource` toggle may be missing on the QA build; if it is missing, steps 10 and 11 are skipped.
Priority: Medium
Note: steps 4 to 9 (change of manpower) are Manual until Q10 is answered; how to leave without saving is not known.
1. Hover over a bar and write down both numbers. -> The numbers are written down for comparison.
2. Select one Work Header in the Work Header section of the Filter Panel. -> The bar height changes.
3. Hover over the same bar again. -> The `Used Resource` number equals the new bar height and differs from the noted value; the Capacity number is the same as noted.
4. Open the Breakdown Setting of a task of that resource, Manpower Resource tab. -> The Manpower Resource tab is shown.
5. Change the manpower of that resource in the tab. -> The tab shows the new manpower value.
6. Hover over the same bar in the histogram. -> The card appears.
7. Compare the `Used Resource` number with the bar height on the scale. -> The `Used Resource` number equals the value the bar height shows on the scale.
8. Compare the `Capacity` number with the value noted in step 1. -> The `Capacity` is the same as the value noted in step 1.
9. Put the original manpower value back in the Manpower Resource tab. -> The tab shows the original manpower value.
10. Switch the `Used Resource` toggle on, if the page has it. -> Rows with 0 Used Resource are hidden and the other rows stay.
11. Hover over a bar of a remaining row and compare with the scale. -> The `Used Resource` number in the card equals the value the bar height shows on the scale and the `Capacity` equals the Capacity of that row in the table.
Automation: steps 1 to 3 and 10 to 11 need a plan with a filterable Work Header; compare the card with the chart data after each change; reset the filter at the end. Steps 4 to 9 stay manual.

### TC-011 [FE][MT] Verify tooltip is shown for a View All user and a View Active user (POS) [Partial: role mapping not confirmed]
Precondition: one Turnaround Manager user and one Job Owner user, both able to open the same plan.
Priority: Medium
Note: Assumption, not a Fact: the Turnaround Manager test user has View All Shutdown Logic Item and the Job Owner test user has View Active Shutdown Logic Item; the QA users may not allow testing both permissions separately.
1. Log in as the Turnaround Manager. -> The application opens.
2. Open the Shutdown Logic page of the plan. -> The Manpower Resource histogram is shown.
3. Hover over a bar. -> The card appears with `Capacity` and `Used Resource`.
4. Write down both numbers. -> The numbers are written down for comparison.
5. Log out. -> The login page is shown.
6. Log in as the Job Owner. -> The application opens.
7. Open the Shutdown Logic page of the same plan. -> The Manpower Resource histogram is shown.
8. Hover over the same bar. -> The card appears with `Capacity` and `Used Resource`.
9. Compare the numbers with the notes. -> The numbers are the same for both users.
Automation: two logins in turn; same plan; clean up by logging out. Do not automate until the role mapping is confirmed.

### TC-012 [FE][MT] Verify Capacity shows 0 for a bar outside the shift Working Time (BND) [Partial: needs shift data outside Working Time]
Precondition: common; a resource row has a bar at a time outside the shift Working Time, where the capacity line drops to 0.
Priority: Medium
1. Hover over a bar at a time outside the shift Working Time. -> The card appears.
2. Read the `Capacity` number. -> `Capacity` is `0`, the same as the capacity line at that point.
3. Read the `Used Resource` number and the box icon. -> `Used Resource` equals the bar height and is above 0; the box icon is red, the same colour as the bar.
4. Hover over a bar of the same row inside the shift Working Time. -> `Capacity` shows the shift Quantity of the row, not 0.
Automation: pick a time outside Working Time from the shift data; assert Capacity 0 there and the shift Quantity inside.

### TC-013 [FE][MT] Verify two same-height sections separated by a gap are two sections (BND) [Auto]
Precondition: common; one resource row has a bar section, then a gap with no bar, then another section of the same height; the same row also has a section of a different height.
Priority: Medium
1. Hover on the first section and note both numbers. -> Capacity and Used Resource of the first section are written down for comparison.
2. Move the mouse over the gap between the sections. -> No card is shown over the gap.
3. Move the mouse onto the second section. -> A new card appears with `Capacity` and `Used Resource` of the second section.
4. Move the mouse to a section of a different height in the same row. -> The card updates straight away to the numbers of that section.
Automation: pick the gap from the chart data; assert no card over the gap and a card on each side; no clean up.

### TC-014 [FE][MT] Verify a Capacity change with the same Used Resource height stays one section (BND) [Auto]
Precondition: common; one resource row has a bar of the same height over several days while the capacity line changes value inside it (for example at the start of a shift).
Priority: Medium
1. Hover on the bar before the capacity line changes and note both numbers. -> Capacity and Used Resource are written down for comparison.
2. Hover on the same bar after the capacity line changes. -> The card shows the same section: Used Resource is the same as the noted value.
3. Read the `Capacity` number. -> `Capacity` is different from the value noted in step 1 and equals the capacity line value at that point.
Automation: pick the day where Capacity changes from the shift data; assert the same Used Resource before and after; no clean up.

### TC-015 [FE][MT] Verify a change of both Capacity and Used Resource height starts a new section with its own values (BND) [Auto]
Precondition: common; one resource row has a bar where, at one day, the capacity line value and the Used Resource height both change.
Priority: Medium
1. Hover on the bar just before the change and note both numbers. -> Capacity and Used Resource of the first section are written down for comparison.
2. Hover on the bar just after the change. -> The card updates straight away.
3. Read the `Capacity` number. -> `Capacity` is different from the value noted in step 1 and equals the capacity line value at that point.
4. Read the `Used Resource` number. -> `Used Resource` is different from the value noted in step 1 and equals the bar height at that point.
Automation: pick the day where both values change from the chart data; compare both numbers on each side; no clean up.

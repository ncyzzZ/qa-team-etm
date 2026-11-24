# ETM-8393 – Questions for BA (round 3)

Story: [Improvement] Shutdown Logic - Capacity and Consumption Tooltip on Manpower Histogram (Deployed to QA, 23 Nov 2026)

The tooltip is now on QA (ETM-8534 Done). Before we mark the Tests, these points need your answer, because each one decides an Expected Result.

## Q1. AC 2 label: please update the AC text to "Used Resource"
AC 2 still says the tooltip shows **Capacity** and **Consumption**. Earlier you told us (chat) the label is **Used Resource**, as in Figma, and the build shows "Used Resource". All our Tests expect "Used Resource".
Please update AC 2 (and the Story title) to "Used Resource", or tell us if "Consumption" is right. Until the AC is changed, a reader of the AC would say the build is wrong.

## Q2. Capacity change inside one same-height section (AC 3, Test ETM-8826)
AC 3: one tooltip covers a continuous section with the same height; when the height changes, the next section shows its own values.
You confirmed (round 3 in chat) that when Capacity changes but Used Resource keeps the same height, it is still ONE section.
The build shows, inside that one section, the Capacity of the exact point under the pointer: e.g. Capacity 3 before the shift's Working Time ends and Capacity 0 after it, Used Resource the same.
Test ETM-8826 expects exactly this (Capacity changes, Used Resource stays). Please confirm this is the wanted behaviour. If instead the whole section must show one Capacity value, which one (first point, highest, ...)?

## Q3. How to change and roll back manpower for a test (Test ETM-8820 steps 4-9)
To check that the tooltip follows a Gantt data change we change the manpower of one resource in Breakdown Setting > Manpower Resource tab.
- Does the histogram (and the tooltip) update at once, or only after Save?
- We read ETM-2703 (Undo/Redo, AC 2.4, 3.2, 5): we plan to roll back with Undo (Ctrl+Z) or leave with `Discard Change`. Please confirm this keeps the QA plan as it was.

## Q4. Card near the edge of the chart
Earlier we understood the card is not moved at the chart edge. The build keeps the card inside the histogram: near the right edge it stops moving right, and near the top it stays at the top. We think the build is fine and no Test checks this; please only tell us if this is not what you want.

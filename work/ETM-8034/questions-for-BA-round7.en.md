# ETM-8034 - Questions for BA (round 7, 2026-11-26) - Xray Test ETM-8868

Test ETM-8868 checks that a condition colour (red resource cell, dependency red border) stays visible on a highlighted row.
Run on QA 25 Nov 2026 (plan "S26 Row Colour", Turnaround Manager, nothing saved). Pictures: `work/ETM-8034/manual-run-8868-20261125b/evidence/ETM-8868/`.

## Q1. Red cell on a row highlighted with the red swatch (step 6)

The red error cell (for example a task whose only Manpower Resource was deleted) is `#FFCCC7`. The Highlight Row palette also has `#FFCCC7` (the 10th swatch).
When the row is highlighted with that swatch, every cell of the row is `#FFCCC7`, so the error cell cannot be told apart from the rest of the row (picture `step-6.png`).
The current build shows the red as a solid base that replaces the highlight (FE commit 075acc98, design "Layer 2"), so there is no mix that would make it different.

Question: is this accepted?
- a) Yes, accepted as designed: we change step 6 to "the red cell keeps `#FFCCC7` (same as the row colour)" and pass it.
- b) No, the error must stay recognisable on any highlight (for example a red border or icon): we log a defect.

## Q2. "Shown with the highlight colour" (step 4)

Step 4 expects the red cell to be "shown with the highlight colour". On the current build the red cell is plain `#FFCCC7` on a `#FFFB8F` row (no mix), which follows design "Layer 2" (red replaces the highlight).
Question: may we change step 4 to "the red cell stays `#FFCCC7` and is clearly red among the highlighted cells"? (The current behaviour then passes.)

## Q3. Dependency red border (steps 14-15)

Steps 14-15 expect a red border on a row with a dependency conflict. On the current build a conflicting dependency cannot be applied: the app shows "Unable to Apply Dependency" (or "Unable to Apply Constraint") and keeps the old value, so no row ever has a conflict, and we found no red border style for Gantt table rows in the FE.
Question: is there a state where a Gantt table row shows a red border for a dependency?
- If **yes**: please give the steps to make it on screen.
- If **no**: we remove steps 14-15 from ETM-8868.

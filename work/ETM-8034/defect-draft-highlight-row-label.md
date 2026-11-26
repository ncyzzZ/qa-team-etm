# Defect draft (not logged): ETM-8034 row menu shows "Highlight Cell" after the whole row is selected

Status: NOT LOGGED - duplicate of ETM-10077 (found by the lead session 25 Nov 19:26). Kept for reference: live check shows the colour still covers the whole row.
Related finding: F-35 (Highlight Cell is intended only for a single-cell right-click; Highlight Row after a double-click on No.).
Regression: worked on 25 Nov 13:26 (run 2026-11-25_132646, ETM-8856 / ETM-8858 passed this step). Broken from 25 Nov ~15:00 (run 2026-11-25_185600, 5 tests).

**Summary:** `[ETM-8034] Row context menu shows "Highlight Cell" instead of "Highlight Row" after the whole row is selected (double-click on No.)`

**Environment:** QA (https://stms-qa.apps.pttep.com), FE build after stms-fe merge 170f4070 (25 Nov 14:55), Turnaround Manager, Chrome desktop 1920x1080. Event NN TEST QA, Shutdown Logic `S26 Row Colour`, a Work Breakdown row with no colour.

On the Shutdown Logic page, selecting a whole row (double-click its No. cell) and right-clicking it should offer `Highlight Row`. The menu now always offers `Highlight Cell`, even though the whole row is selected. Picking a colour from it still colours every cell of the row, so only the option name is wrong.

### Step to Reproduce
1. Log in as a Turnaround Manager and open the Shutdown Logic `S26 Row Colour` (event NN TEST QA). Collapse the Manpower Resource histogram (hover the splitter, click `Hide histogram`).
2. Double-click the No. cell of a Work Breakdown row. The whole row is selected.
3. Right-click the No. cell of the same row.
4. Read the first option of the context menu.
5. Open it and pick the second colour (D6E4FF).

### Actual Result
- Step 4: the menu reads `Highlight Cell`, `Change Text Color`, `Duplicate Work Breakdown`, `Delete Work Breakdown`. No `Highlight Row`.
- Same result when right-clicking the Description cell of the selected row.
- Step 5: the colour is applied to every cell of the row (No. and all data columns), so the colouring itself works.

Pictures:
- work/ETM-8034/defect-highlight-row/1-row-selected.png
- work/ETM-8034/defect-highlight-row/2-menu-highlight-cell.png
- work/ETM-8034/defect-highlight-row/3-after-pick.png

### Expected Result
- With the whole row selected (double-click on No.), the first option of the context menu is `Highlight Row` (AC 1.1: "Two new options above the existing ones: Highlight Row and Change Text Color"; F-35 behaviour table: Highlight Row after Select Row + right-click, Highlight Cell only when one cell is right-clicked).
- Xray ETM-8854 step 8: "Right-click a Work Breakdown row. -> The menu shows `Highlight Row` and `Change Text Color`."

## Fields (resolved at log time)
- Work type: Defect, Found-in Environment QA (16336). Labels FE, UI. Epic and Sprint copied from ETM-8034. Link: Relates ETM-8034.
- Assignee: [FE] sub-task assignee of ETM-8034 (resolved at log time).
- Xray: Test Execution ETM-8875, ETM-8854 step 8 (FAILED + defect linked). Also blocks ETM-8861, 8862, 8865, 8867, 8871 at their first Highlight Row step.
- [QA] sub-task: `[QA] Fix and verify Highlight Row label on a selected row`, worklog 20m (live check of the cause in the page + source + 3 pictures).
- Dev brief: work/ETM-8034/dev-brief-NEW-highlight-row-label.md (attached when opened).

# ETM-8034 manual retest of Defect ETM-10077 (Highlight Row on a row selected by its No. cell)

Test Execution: ETM-8875 (no Xray push from this file). Environment: QA only. Plan: the ETM-8034 plan (`ep-etm-fe-qa/.env` `ETM8034_PATH`, Shutdown Logic page). Log in as Turnaround Manager.
Before testing, collapse the Manpower Resource histogram (`Hide histogram` on the line between the Gantt and the histogram, shown on hover); collapse it again after every load.
Read only: nothing is chosen from the menu and nothing is saved. Close each menu with Escape. One full-screen picture per step.

## ETM-10077 - Row menu after double-clicking the No. cell (6 steps)
start: ETM8034_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Shutdown Logic page and collapse the histogram | The Gantt table shows with the histogram collapsed | full screen |
| 2 | Double-click the `No.` cell of a Work Breakdown row | The whole row is highlighted as selected | full screen |
| 3 | Right-click the Description cell of that selected row | The context menu shows `Highlight Row` and `Change Text Color` (not `Highlight Cell`) | full screen with the menu |
| 4 | Press Escape, double-click the `No.` cell of a Work row (Work level) and right-click its Description cell | The menu shows `Highlight Row` and `Change Text Color` | full screen with the menu |
| 5 | Press Escape, double-click the `No.` cell of the Platform row and right-click a cell of that row | The menu shows `Highlight Row` and `Change Text Color` | full screen with the menu |
| 6 | Press Escape, click once on a single cell of a row that is not selected (no double-click on No.) and right-click that cell | The menu shows `Highlight Cell` (single cell, not a selected row) | full screen with the menu |

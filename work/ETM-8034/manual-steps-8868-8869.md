# ETM-8034 manual steps: ETM-8868 and ETM-8869 (look of a highlighted row)

Test Execution: ETM-8875. Environment: QA only. Plan: the ETM-8034 plan (`ep-etm-fe-qa/.env` `ETM8034_PATH`, Shutdown Logic page). Log in as Turnaround Manager.
"Right-click the row" here = double-click the No. cell of the row (selects the whole row), then right-click it: the menu then shows `Highlight Row`. A right-click on one cell without a selected row shows `Highlight Cell` instead, which colours that cell only (behaviour table from the user, 2026-11-24).
Before testing, collapse the Manpower Resource histogram (the down arrow `Hide histogram` on the line between the Gantt and the histogram, shown on hover), except in ETM-8868 steps that use the histogram: open it there only for `Delete Resource`, then collapse it again.
Nothing is saved in these two Tests: every colour and every `Delete Resource` is left unsaved and undone by a reload at the end. One picture per step.
The mix of a condition colour or a hover/selected/focus/disabled layer with a highlight has no exact value yet (BA open question 2), so a step that asks "is it still recognised" is a person's call: propose `needs-human` with the picture, never a pass by guess.
ETM-8870 (Export PDF) is not in this file: a person compares the PDF with the screen (`manual-by-hand-8870.md`).

## ETM-8868 - Condition colour stays visible on a highlighted row (15 steps)

writes data: no (colours and Delete Resource are never saved; reload at the end)
start: ETM8034_PATH
Precondition: a task with only one Manpower Resource, shown with no error; use the same task for the whole Test. Steps 1-7 = error first, steps 9-15 = highlight first. At the end reload without Save.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | In the Manpower Resource histogram right-click the resource of the task and choose `Delete Resource` (do not Save) | The resource cell of the task turns red | row + histogram |
| 2 | Record how the red cell looks with no highlight | The look of the red cell is written down for comparison | close-up of the red cell |
| 3 | Right-click the row with the red cell, open `Highlight Row` and choose `FFFB8F` | The row background is `FFFB8F` | row |
| 4 | Look at the red cell | The red colour is still visible on the cell, shown with the highlight colour, and the cell is still recognised as red | close-up of the red cell |
| 5 | Right-click the same row, open `Highlight Row` and choose `FFCCC6` | The row background is `FFCCC6` | row |
| 6 | Look at the red cell | The red colour is still visible on the cell | close-up of the red cell |
| 7 | Right-click the row, open `Highlight Row` and choose `No Color` | The red cell looks as it did in step 2 | close-up of the red cell |
| 8 | Reload the page without Save | The resource is back and the cell is shown with no error | row |
| 9 | Right-click the row of that task, open `Highlight Row` and choose `FFFB8F` | The row background is `FFFB8F` | row |
| 10 | In the Manpower Resource histogram right-click the resource and choose `Delete Resource` (do not Save) | The resource cell of the task turns red | row + histogram |
| 11 | Look at the red cell | The red colour is still visible on the cell and the rest of the row keeps `FFFB8F` | row |
| 12 | Right-click the row, open `Highlight Row` and choose `No Color` | The red cell stays red; the rest of the row returns to the default background | row |
| 13 | Right-click the row again, open `Highlight Row` and choose `FFFB8F` | The row background is `FFFB8F` | row |
| 14 | Make a dependency conflict on the row (no Dev steps yet: if there is no clear way on screen, stop here and mark `needs-human`) | The row gets the red border line | row |
| 15 | Look at the row, then reload without Save | The red border line is still visible on the highlighted row, and the highlight `FFFB8F` is still visible | row |

## ETM-8869 - Hover, selected, focus and disabled layers on a highlighted row (8 steps)

writes data: no (colours and Delete Resource are never saved; reload at the end)
start: ETM8034_PATH
Precondition: right-click a Work row, `Highlight Row` → `FFFB8F` (do not Save). A Platform row (or Work Header row) has a read-only roll-up cell (a column that cannot be edited at that level, ETM-2310) and no highlight. At the end reload without Save.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Move the mouse over the highlighted Work row | The hover layer shows over the row and the highlight `FFFB8F` is still visible under it (not replaced) | row while hovered |
| 2 | Click the row to select it | The selected look shows and the highlight is still visible | row |
| 3 | Click a cell of the row so it has focus | The focus look shows and the highlight is still visible | row |
| 4 | Click an empty area of the page | The row looks like `FFFB8F` again | row |
| 5 | Record how the disabled cell of the Platform row looks with no highlight | The look is written down for comparison | close-up of the disabled cell |
| 6 | Right-click the Platform row, open `Highlight Row` and choose `BAE0FF` | The row background is `BAE0FF` | row |
| 7 | Look at the disabled cell | The disabled look is still visible, mixed with the highlight, and the cell is still recognised as disabled | close-up of the disabled cell |
| 8 | Right-click the Platform row, open `Highlight Row` and choose `No Color`, then reload without Save | The disabled cell looks as in step 5 | close-up of the disabled cell |

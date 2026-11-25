# Dev brief ETM-10058: copy of non-adjacent cells pastes into one column (Shutdown Logic, ETM-8521)

## 1. What is wrong
Copying two non-adjacent cells (Ctrl+click) in the Shutdown Logic Gantt table and pasting them puts the values into one column. The second value lands in the Description of the second target row instead of its Duration.

## 2. Where
- Page: Shutdown Logic (`/shutdown-event-list/events/<event>/planning/<plan>/logics/<logic>`), Gantt grid.
- Environment: QA, build of 24 Nov 2026. Role: Turnaround Manager.
- Data: any two Work Breakdown rows of one Work; Details column group collapsed so Description and Duration are next to each other.

## 3. Steps to reproduce
1. Open the Shutdown Logic page, collapse the Manpower Resource histogram and the Details column group.
2. Click the Description cell of row 1, then Ctrl+click the Duration cell of row 2.
3. Ctrl+C.
4. Click the Description cell of another row and Ctrl+V.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Clipboard after Ctrl+C | 2 lines, 1 column: `Pump overhaul A` / `12` | Keeps the 2 x 2 layout (blank positions for the skipped cells) |
| Target row 1 Description | `Pump overhaul A` | `Pump overhaul A` |
| Target row 1 Duration | unchanged | blank (skipped position) |
| Target row 2 Description | `12` (was `WB-101`) | blank (skipped position) |
| Target row 2 Duration | unchanged (`24.00`) | `12.00` |

## 5. Rule source
- BA answer 25 Nov 2026, question R3-1, option (a): "The layout must be kept" for copied cells that are not next to each other.
- Xray Test ETM-8737 step 7 (Test Execution ETM-8773).

## 6. Hints for the fix (guess)
Guess only: the copy builds the clipboard text from the list of selected cells in selection order, one per line, instead of from the bounding rectangle of the selection (row x column) with empty values for unselected positions. The paste then maps line n to row n of the anchor column. See `shutdown-gantt-paste.service.ts` and the copy handler of the Gantt grid in stms-fe.

## 7. How QA will retest
Run Playwright Test ETM-8737 (spec `verifyShutdownLogicFasterPaste.spec.ts`), steps 6-7, on QA; plus the same by hand: check the clipboard text and the four target cells.

## 8. Out of scope / do not change
Copy / paste of adjacent ranges (ETM-8736, 8739: they pass); paste into parent rows (BA R3-3: correct as is); whole-block undo on a conflicting Start (BA R3-5.2: correct as is).

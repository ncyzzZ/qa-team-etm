# Dev brief: NEW (Story ETM-8034) - "Highlight Cell" shown for a whole selected row

## 1. What is wrong
After a double-click on the No. cell (whole row selected), the right-click menu of the Shutdown Logic table shows `Highlight Cell` instead of `Highlight Row`. The colour still goes on the whole row; only the option name is wrong (from the code, the undo entry name `Highlight Cell` probably follows it; not checked on screen). It started with the build after 25 Nov 14:55.

## 2. Where
- Page: Shutdown Event > Planning > Shutdown Logic (Gantt table, left side). Context menu of a selected row.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA, build containing stms-fe merge `170f4070` (commit `075acc98`). Role: Turnaround Manager.
- Data: event NN TEST QA, Shutdown Logic `S26 Row Colour`, any Work Breakdown row.
- Collapse the Manpower Resource histogram first (hover `sl-splitter-horizontal`, click `Hide histogram`).

## 3. Steps to reproduce
1. Open the Shutdown Logic above as Turnaround Manager.
2. Double-click the No. cell of a Work Breakdown row.
3. Right-click the No. cell (or the Description cell) of the same row.
4. Read the first menu option.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Menu after double-click on No. + right-click | `Highlight Cell` | `Highlight Row` |
| Colour picked from it | Whole row coloured (OK) | Whole row coloured |
| Single cell right-click (no row selection) | `Highlight Cell` (OK) | `Highlight Cell` |

## 5. Rule source
- AC 1.1 of ETM-8034: "Right-click a row in the Gantt table opens the context menu ... Two new options above the existing ones: Highlight Row and Change Text Color."
- Agreed behaviour (24 Nov, finding F-35): Highlight Row after Select Row (double-click No.) + right-click; Highlight Cell when one cell is right-clicked.
- Xray ETM-8854 step 8 (Test Execution ETM-8875).

## 6. Hints for the fix (guess, from stms-fe develop and the live page)
- File: `.../shutdown-gantt-chart/row-color/shutdown-gantt-row-color.service.ts`, commit `075acc98` "highlight hidden columns of a row".
- `wholeRowKeys()` now uses `allDataColumnKeys()` = `gantt.columns.leaves`. On this page `columns.leaves` has **two columns with field `name`** (one hidden, one visible). `wholeRowKeys()` keeps the duplicate (18 keys), while `groupSelectionByRow` builds the row's keys with `new Set(...)` (17 keys).
- `isRowPick` compares `target.keys.length === wholeRowKeys().length` -> 17 !== 18 -> always false -> label `Highlight Cell`.
- Possible fix: de-duplicate in `allDataColumnKeys()` / `wholeRowKeys()` (e.g. `[...new Set(...)]`), or compare by set membership instead of length.
- Live values read in the page (25 Nov 19:15): selected fields after the double-click = name, durationHours, predecessors, equipmentNumber, manpowerResources, remark, _timeAxis3 (all visible data columns).

## 7. How QA will retest
`node tools/run-card.mjs ETM-8034 tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.spec.ts -g "ETM-8861|ETM-8862|ETM-8865|ETM-8867|ETM-8871"` plus ETM-8854 step 8 by hand: double-click No., right-click -> `Highlight Row`; right-click one cell without row selection -> `Highlight Cell`.

## 8. Out of scope / do not change
- Highlight Cell on a single-cell right-click (intended, F-35).
- Painting of hidden columns (the colour reaching the collapsed columns is the intended part of 075acc98).
- Palette hex values and the current-colour frame (ETM-10034 / ETM-9219, retest passed).

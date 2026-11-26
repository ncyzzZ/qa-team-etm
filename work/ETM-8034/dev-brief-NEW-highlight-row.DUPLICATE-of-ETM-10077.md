# Dev brief: NEW (ETM-8034) - "Highlight Cell" shown instead of "Highlight Row" on a fully selected row

## 1. What is wrong
After a whole row is selected (double-click its No. cell), right-click shows "Highlight Cell" instead of "Highlight Row". Regression since the FE build of 25 Nov 2026 (~14:55).

## 2. Where
- Page: Shutdown Event > Shutdown Logic (Gantt table, right-click menu)
- Environment: QA
- Role: Turnaround Manager
- Data: any plan, any row level (seen on plan "S26 Row Colour", event NN TEST QA)

## 3. Steps to reproduce
1. Open Shutdown Logic as Turnaround Manager.
2. Double-click the No. cell of a Work row (whole row selected).
3. Right-click the row.
4. Read the first menu option.

## 4. Actual vs Expected
| | Result |
|---|---|
| Actual | "Highlight Cell", "Change Text Color", "Delete Work" |
| Expected | "Highlight Row", "Change Text Color", "Delete Work" (as on the build before 25 Nov 14:55) |

## 5. Rule source
- ETM-8034 AC 2 (Highlight Row on the row context menu); behaviour confirmed 24 Nov: whole row selected -> Highlight Row, one cell -> Highlight Cell.
- Xray ETM-8854 step 2 "First option is Highlight Row" (Test Execution ETM-8875). Also blocks ETM-8856, 8861, 8862, 8865, 8867, 8871.

## 6. Hints for the fix (guess)
Guess from the live page and the FE source, not confirmed:
- Came in with stms-fe commit 075acc98 "[patch] ETM-8034 - keep validation red ... highlight hidden columns of a row" (`shutdown-gantt-row-color.service.ts`, `allDataColumnKeys()` now reads `gantt.columns.leaves`).
- `gantt.columns.leaves` has two columns with field `name` (one hidden). The whole-row key list keeps the duplicate (18 keys), the row's selected keys are de-duplicated (17), so the "is the whole row picked" check is always false and the menu falls back to "Highlight Cell".
- De-duplicating the column keys (or comparing as sets) would likely fix it. The undo label may have the same cause.

## 7. How QA will retest
Automated: `node tools/run-card.mjs ETM-8034 tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.spec.ts` (ETM-8854 to ETM-8871). By hand: steps in section 3 on every level (Platform, Work Header, Work, Work Breakdown) and check one cell still gives "Highlight Cell".

## 8. Out of scope / do not change
- "Highlight Cell" for a single selected cell (intended, keep it).
- The colour palette values and the blue frame on the current colour (already fixed in ETM-9219 / ETM-10034).

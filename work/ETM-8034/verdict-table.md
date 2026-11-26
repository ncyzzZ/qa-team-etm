# ETM-8034 - failures to decide (run 2026-11-25_185600_ETM-8034)

AI suggestion only. Answer all rows in one reply, e.g. `1=script 2=app 3=tc` (script / tc / app / env / flaky).

| # | Test | Failed with | Cause | AI suggests | Why |
|---|---|---|---|---|---|
| 1 | ETM-8861 | TimeoutError: locator.click: Timeout 30000ms exceeded. | locator | script | locator not found (locator('.b-menu:visible')): heal loop first |
| 2 | ETM-8862 | TimeoutError: locator.click: Timeout 30000ms exceeded. | locator | script | locator not found (locator('.b-menu:visible')): heal loop first |
| 3 | ETM-8865 | TimeoutError: locator.click: Timeout 30000ms exceeded. | locator | app | finding F-33 names this test |
| 4 | ETM-8867 | TimeoutError: locator.click: Timeout 30000ms exceeded. | locator | script | locator not found (locator('.b-menu:visible')): heal loop first |
| 5 | ETM-8871 | TimeoutError: locator.click: Timeout 30000ms exceeded. | locator | script | locator not found (locator('.b-menu:visible')): heal loop first |

## Lead check on the live page (2026-11-25 19:15) - overrides the "script" suggestions above

All 5 stop at the same step: double-click the No. cell, right-click, the menu reads **Highlight Cell** (no Highlight Row). At 13:26 the same step passed (8856, 8858).
- Cause found in the live page: after the double-click every visible data cell is selected, so the row counts as whole. But `gantt.columns.leaves` holds **two columns with field `name`** (one hidden). `wholeRowKeys()` keeps the duplicate (18 keys) while the row's keys are de-duplicated (17), so `isRowPick` is always false and the menu always says "Highlight Cell".
- Came in with stms-fe 075acc98 "[patch] ETM-8034 - keep validation red ... highlight hidden columns of a row" (merged 25 Nov 14:55, `shutdown-gantt-row-color.service.ts`, `allDataColumnKeys()` reads `columns.leaves`).
- Not a locator: the healer found no other item; no script gesture gives Highlight Row (double-click No. + right-click Description also gives Highlight Cell).
- Lead suggestion: **1-5 = app** (one new defect, regression of AC 2 "Highlight Row" on the row menu). The colour itself may still cover the whole row; only the menu label and the undo label are wrong. Not checked yet.

Earlier causes still behind these tests once the menu works (run 2026-11-24_215258):
- 8861 step 2 (paste text does not reach the target row): stms-fe RULES.md lists it as known defect "SL-CP-38, SL-QA-046 (TC-641, 1045) D4: Row copy / paste moves only the No.". App side, already known to dev.
- 8862 step 8 (no toast after Save in the Work Details modal): stms-fe has no toast for this modal and no text "Save Work Successfully" anywhere; the expectation came from `docs/modules/shutdown-logic-validation.md`. TC/BA question, not a defect yet.

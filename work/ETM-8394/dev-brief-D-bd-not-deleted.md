# Dev brief: DEFECT_KEY (Story ETM-8394)

## 1. What is wrong
Import `Action = Delete` on a Work soft-deletes the Work (`sdw_is_delete = 'Y'`) but leaves its Work Breakdowns in `shutdown_activity_breakdown` with no delete flag. The breakdowns of a deleted Work must be flagged deleted together with it.

## 2. Where
- Environment: QA, `https://stms-qa.apps.pttep.com`. Roles: Turnaround Manager and Job Owner (same result).
- Page: Worklist > Create Work > Import Excel, Confirm of a file with Delete rows.
- Data: event `NN TEST QA`, Worklist of Plan 6843; any Worklist works.

## 3. Steps to reproduce
1. Import Work `Z2` with 1 breakdown (`Action = Add`), Confirm.
2. Upload a file: `Z2` Work row `Action = Delete` + its `Work Breakdown` row `Action = Delete` with its UUID. Confirm.
3. Query `shutdown_activity` and `shutdown_activity_breakdown` for `Z2`.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Work `Z2` | `sdw_is_delete = 'Y'`, gone from the Worklist | same |
| Breakdown of `Z2` | Row still in `shutdown_activity_breakdown`, not flagged (the table has no delete column) | Flagged deleted (soft delete with the Work) |

## 5. Rule source
- Import template rules: deleting a Work is a soft delete together with its breakdowns.
- BA answer 25 Nov 2026 (round 4, Q2): the breakdowns must be flagged deleted.
- Xray Test ETM-8767 (Test Execution ETM-8774), step "Read Z2 and its breakdown" (also Z3 as Job Owner).

## 6. Hints for the fix (guess)
- Add a delete flag to `shutdown_activity_breakdown` (or reuse an existing pattern) and set it for every breakdown of a Work deleted by import. Reads of breakdowns (UUID checks, Worklist, Revise validation) should skip flagged rows.

## 7. How QA will retest
- Re-run Playwright test ETM-8767: the check passes when the breakdown row is gone or a column ending in `is_delete` is 'Y'. Also re-run ETM-8766 (likely same cause).

## 8. Out of scope / do not change
- The Work soft delete itself (works today). Status columns on Delete rows stay ignored (AC 7).

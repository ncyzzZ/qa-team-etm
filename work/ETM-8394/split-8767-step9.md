# ETM-8767: split the breakdown delete out (user chose, chat 2026-11-26)

Reason: dev turns defect ETM-10051 (Import Delete leaves the Work Breakdowns not deleted) into an improvement user story. ETM-10051 has no link to a new story yet (read 2026-11-26).

## Xray change (ETM-8767 steps)
| Step | Expected now | Expected after |
|---|---|---|
| 9 | The Work Status is `Deleted` and the breakdown no longer exists in the system (removed permanently). | The Work Status is `Deleted`. (Breakdown removal is covered by the improvement story from ETM-10051.) |
| 13 | The Work Status is `Deleted` and the breakdown no longer exists in the system. | The Work Status is `Deleted`. (Breakdown removal is covered by the improvement story from ETM-10051.) |

Step 13 checks the same thing for the Job Owner, so it goes too, or 8767 still fails.

## Spec change (PW_REPO verifyImportWorkStatus.spec.ts)
Lines 1246 and 1269: drop `expectBreakdownGone(ctx, Z2/Z3, 0)`, keep `expectWork(..., 'Deleted')`.

## Then
Re-run 8767 only (card data). If it passes: Xray ETM-8774 8767 FAILED -> PASSED (status already pushed, needs a yes).
For the new story: its own TC from old step 9/13 (breakdown gone after Delete, TM and JO) when the story key exists.

# Retest failed: ETM-10051 (26 Nov 2026)

**Environment:** QA (https://stms-qa.apps.pttep.com), Turnaround Manager, event NN TEST QA, card-owned Worklist. Defect status before the retest: Deployed to QA.

### Steps followed
Xray ETM-8767 steps 5-9 (Test Execution ETM-8774), run 2026-11-26_124337 with the breakdown check turned on (CHECK_ETM10051=1), 2 attempts:
1. Import Work W-8394-Z2-<tag> with 1 Work Breakdown.
2. Build a file with the Z2 Work row `Action = Delete` (Work Status Approved, Breakdown Status Deleted) and its Work Breakdown row `Action = Delete`.
3. Upload as Somchai Tester (Turnaround Manager): preview has no Error, Confirm enabled.
4. Click Confirm: the import completes.
5. Read Z2 and its breakdown in the database.

### Actual Result
The Work is Deleted, but its Work Breakdown is still a live record (not removed, not flagged deleted). Both attempts: W-8394-Z2-o1qv and W-8394-Z2-pd2y, "Breakdown 1 of W-8394-Z2-pd2y is deleted": the check found the breakdown still there.

### Expected Result
> ETM-8394 AC 7: "The row is deleted as in ETM-6843: the Work becomes Deleted, and a Work Breakdown is removed permanently."

### Pictures
- output/evidence/ETM-8767/step7_s7.png (preview, no Error)
- output/evidence/ETM-8767/step8_s8.png (import completed)
- output/runs/2026-11-26_124337_ETM-8394/...-retry1/test-failed-1.png (end of the failed attempt)

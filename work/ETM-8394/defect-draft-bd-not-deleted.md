# [ETM-8394] Import Action Delete soft-deletes the Work but leaves its Work Breakdowns not flagged as deleted

On the Import Work page, a `Work` row with `Action = Delete` deletes the Work, but its breakdowns stay in the database with no delete flag. BA confirmed on 25 Nov 2026 that the breakdowns of a deleted Work must be flagged deleted together with the Work (template rule: delete is a soft delete together with its breakdowns). This likely also causes the wrong UUID message of the related defect (a breakdown of a deleted Work still counts as "associated with another work").

**Environment:** QA (https://stms-qa.apps.pttep.com), role Turnaround Manager and Job Owner, event NN TEST QA, Worklist of Plan 6843.

### Step to Reproduce
1. Import Work `Z2` with 1 breakdown (Action `Add`), Confirm.
2. Build a file: a `Z2` Work row with `Action = Delete` and one `Work Breakdown` row of `Z2` with `Action = Delete` and its UUID.
3. Upload the file as the Turnaround Manager and click `Confirm`.
4. Check the Work and its breakdown.

### Actual Result
The Work `Z2` is deleted (`shutdown_activity.sdw_is_delete = 'Y'`, gone from the Worklist). Its breakdown row is still in `shutdown_activity_breakdown` and is not flagged as deleted (the table has no delete flag).

### Expected Result
The breakdowns of the deleted Work are flagged deleted too (soft delete together with the Work).
Xray: Test ETM-8767, Test Execution ETM-8774.

Pictures: PICS

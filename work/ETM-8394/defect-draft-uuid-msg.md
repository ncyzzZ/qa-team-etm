# [ETM-8394] Revise with the UUID of a breakdown under a deleted Work shows "already associated with another work" instead of "UUID not exist"

On the Import Work page, a `Work Breakdown` row with `Action = Revise` that uses the UUID of a breakdown whose Work was deleted is rejected with the wrong message. ETM-8394 AC 3.4 says Revise on a deleted Work or on a breakdown under a deleted Work gives the UUID Error "The UUID you entered is not exist in the system." (BA confirmed 25 Nov 2026).

**Environment:** QA (https://stms-qa.apps.pttep.com), role Turnaround Manager, event NN TEST QA, Worklist of Plan 6843.

### Step to Reproduce
1. Import Work `Y1` with 2 breakdowns and Work `Y2` with 1 breakdown (Action `Add`), Confirm.
2. Import a file with a `Y1` Work row, `Action = Delete`, Confirm. `Y1` is deleted.
3. Build a file: a `Y2` Work row with `Action = Revise`, and one `Work Breakdown` row under `Y2` with `Action = Revise` and the UUID of one breakdown of the deleted `Y1`.
4. Upload the file as the Turnaround Manager.

### Actual Result
The breakdown row shows "The work breakdown with the entered UUID is already associated with another work in the system." `Import` is disabled.

### Expected Result
The breakdown row shows "The UUID you entered is not exist in the system." (AC 3.4). `Import` is disabled.
Xray: Test ETM-8766, Test Execution ETM-8774.

Pictures: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_205244_ETM-8394/fe-e2e-importWork-verifyIm-47ec3-d-Work-gives-the-UUID-Error-chromium/test-failed-1.png

# Evidence check defect-draft-uuid-msg (ETM-8394, defect)

sourceHash: ea3aa729f79c

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), role Turnaround Manager, event NN TEST QA, Worklist of Plan 6843.

## Steps
1. Import Work `Y1` with 2 breakdowns and Work `Y2` with 1 breakdown (Action `Add`), Confirm.
2. Import a file with a `Y1` Work row, `Action = Delete`, Confirm. `Y1` is deleted.
3. Build a file: a `Y2` Work row with `Action = Revise`, and one `Work Breakdown` row under `Y2` with `Action = Revise` and the UUID of one breakdown of the deleted `Y1`.
4. Upload the file as the Turnaround Manager.

## Expected Result (as the draft states it: check it has a source)
The breakdown row shows "The UUID you entered is not exist in the system." (AC 3.4). `Import` is disabled.
Xray: Test ETM-8766, Test Execution ETM-8774.

Pictures: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_205244_ETM-8394/fe-e2e-importWork-verifyIm-47ec3-d-Work-gives-the-UUID-Error-chromium/test-failed-1.png

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8394/evidence-check/defect-draft-uuid-msg.pics/pic-1.png

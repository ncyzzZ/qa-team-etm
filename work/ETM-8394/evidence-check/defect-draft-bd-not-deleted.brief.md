# Evidence check defect-draft-bd-not-deleted (ETM-8394, defect)

sourceHash: 9444e040b8bd

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), role Turnaround Manager and Job Owner, event NN TEST QA, Worklist of Plan 6843.

## Steps
1. Import Work `Z2` with 1 breakdown (Action `Add`), Confirm.
2. Build a file: a `Z2` Work row with `Action = Delete` and one `Work Breakdown` row of `Z2` with `Action = Delete` and its UUID.
3. Upload the file as the Turnaround Manager and click `Confirm`.
4. Check the Work and its breakdown.

## Expected Result (as the draft states it: check it has a source)
The breakdowns of the deleted Work are flagged deleted too (soft delete together with the Work).
Xray: Test ETM-8767, Test Execution ETM-8774.

Pictures: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_205244_ETM-8394/fe-e2e-importWork-verifyIm-7c39e-etes-as-in-the-import-rules-chromium/test-failed-1.png

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8394/evidence-check/defect-draft-bd-not-deleted.pics/pic-1.png

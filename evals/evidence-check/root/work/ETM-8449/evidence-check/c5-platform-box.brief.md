# Evidence check c5-platform-box (ETM-8449, defect)

sourceHash: 33657a75add1

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA, 24 Nov 2026, TM

## Steps
1. Log in as Turnaround Manager and open the Shutdown Logic page of PLAN-20K (all rows expanded, every level box shows -).
2. Open the Custom View panel.
3. Click the box of Platform.

## Expected Result (as the draft states it: check it has a source)
Nothing changes: the Platform box cannot switch and still shows -; all 22,442 rows stay visible (user/BA rule 2026-11-24). Xray ETM-8632 step 3.

Pictures: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-9b289-the---boxes-match-the-table-chromium/test-failed-1.png
Xray: TE ETM-8637, Test ETM-8632 step 3.

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8449/evidence-check/c5-platform-box.pics/pic-1.png

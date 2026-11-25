# Defect draft
**Environment:** QA, 24 Nov 2026, TM
**Summary:** [ETM-8449] Custom View: the Platform level box switches to + and hides the Work Header rows

Platform rows can never be hidden, so the Platform box in "Expand/Collapse by Data Level" must not switch. On QA it switches to + when clicked and the Work Header rows disappear.

### Step to Reproduce
1. Log in as Turnaround Manager and open the Shutdown Logic page of PLAN-20K (all rows expanded, every level box shows -).
2. Open the Custom View panel.
3. Click the box of Platform.

### Actual Result
The Platform box switches to +; only the 18 Platform rows stay (Work Header and lower rows hidden).

### Expected Result
Nothing changes: the Platform box cannot switch and still shows -; all 22,442 rows stay visible (user/BA rule 2026-11-24). Xray ETM-8632 step 3.

Pictures: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-9b289-the---boxes-match-the-table-chromium/test-failed-1.png
Xray: TE ETM-8637, Test ETM-8632 step 3.


# ETM-8449 defect drafts (2026-11-24, run 2026-11-24_162751)

Common: Work type Defect, Found-in Environment QA, Epic ETM-4, Sprint 26 (17237), labels FE + UI, Relates ETM-8449, assignee Suphakiat Kiatkunya ([FE] ETM-8537), plan "Shutdown Logic: New Plan 20,000 Work" (PLAN-20K) on stms-qa, Turnaround Manager. Findings: F-6 (D1), F-2 / F-6 (D2).

## D1 [ETM-8449] Custom View: the Platform level box switches to + and hides the Work Header rows

Platform rows can never be hidden, so the Platform box in "Expand/Collapse by Data Level" must not switch. On QA it switches to + when clicked and the Work Header rows disappear.

### Step to Reproduce
1. Log in as Turnaround Manager and open the Shutdown Logic page of PLAN-20K (all rows expanded, every level box shows -).
2. Open the Custom View panel.
3. Click the box of Platform.

### Actual Result
The Platform box switches to +; only the 18 Platform rows stay (Work Header and lower rows hidden).

### Expected Result
Nothing changes: the Platform box cannot switch and still shows -; all 22,442 rows stay visible (user/BA rule 2026-11-24). Xray ETM-8632 step 3.

Evidence: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-9b289-the---boxes-match-the-table-chromium/test-failed-1.png
Xray: TE ETM-8637, Test ETM-8632 step 3.

## D2 [ETM-8449] Custom View: + of Work Header brings back only the Work Header rows; Work rows stay hidden while the Work box shows -

### Step to Reproduce
1. Open PLAN-20K as Turnaround Manager (all rows expanded, every box -). Optional: Platform filter "CBWA" (708 rows).
2. Open the Custom View panel and click - of Work Header: only Platform rows stay (correct).
3. Click + of Work Header.

### Actual Result
Only Platform and Work Header rows come back (filtered: 1 + 7 = 8 rows of 708). The Work and Work Breakdown rows stay hidden, but the Work and Work Breakdown boxes still show - (shown).

### Expected Result
The Work Header rows come back with the rows under them whose level box shows -: all rows (708 with the filter, 22,442 without), as the Work and Work Breakdown boxes were never switched. BA 2026-11-24 (F-2): + of Work Header shows Platform, Work Header and Work. Xray ETM-8633 step 5, ETM-8635 step 5.

Evidence: /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-1506c-e-shows-only-the-right-rows-chromium/test-failed-1.png, /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-02613-ion-holds-on-the-large-plan-chromium/test-failed-1.png
Xray: TE ETM-8637, Test ETM-8633 step 5 (and ETM-8635 step 5).

[QA] sub-task per defect, worklog 20m each (20,000-row plan, filter set-up, AC/BA check).

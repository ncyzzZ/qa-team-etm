# ETM-8449 retest plan: ETM-9175, ETM-9177 (written 2026-11-24)

> Both defects are deleted from Jira: ETM-9175 on 24 Nov 2026 (script error), ETM-9177 on 25 Nov 2026 (not a bug, system correct per user). Nothing to retest.
> - 9175: likely a script error. `levelBox('Platform')` falls back to `all.nth(0)` = the Work Header button, because the locked Platform button's label is "Platform (always expanded)". Fix `LEVEL_RX.Platform` in `collapseExpand.helpers.ts` (ep-etm-fe-qa) and check by hand before the retest.
> - 9177: not a bug, system correct per user 25 Nov 2026 (cascade of ETM-2431). Spec 8633 s5 / 8635 s5, s7 changed to P+H.

Start a retest only when dev moves the defect to Resolved / Deployed to QA. Plan: "Shutdown Logic: New Plan 20,000 Work" (PLAN-20K) on stms-qa, Turnaround Manager.
Rule (user, F-6): box `-` = that level's rows are shown. Click `-` = hide that level (and the rows under it), box turns `+`. Click `+` = show that level again, box `-`. Lower levels keep their own box. The Platform box never switches.

Before every step set: open the plan, wait for the table, **collapse the Manpower Resource histogram** (hover `data-testid="sl-splitter-horizontal"`, click `aria-label="Hide histogram"`). Do it again after every reload.

## ETM-9175: deleted 24 Nov 2026: script error, not reproduced by hand (manual-9175/)
No retest. Script fixed (levelBox has no positional fallback; 8632 step 3 checks the Platform button is disabled). The steps below stay as the ETM-8632 step 3 check.

### ETM-8632 step 3: Platform box must not switch (TE ETM-8637)
1. Open PLAN-20K, collapse the histogram. Count rows: 22,442 (N0), every box `-`.
2. Open the Custom View panel.
3. Click the box of Platform.
Pass: box stays `-`, row count still N0 (no Work Header / Work / Work Breakdown row hidden).
Also check: click Platform several times quickly, then reload: still `-`, N0.

## ETM-9177: deleted 25 Nov 2026: not a bug, system correct per user. Removed from the retest list.

### ETM-9177: NOT A BUG (user 25 Nov 2026, system correct, cascade of ETM-2431). No retest. Kept below for history only; the A/B pass rules are wrong.

### (old) ETM-9177: `+` Work Header brings back the rows under it (Xray ETM-8633 step 5, ETM-8635 step 5, TE ETM-8637)
A. No filter
1. Open PLAN-20K, collapse the histogram. N0 = 22,442, every box `-`.
2. Custom View: click `-` of Work Header. Only the 18 Platform rows stay; Work Header box `+`, Work and Work Breakdown boxes still `-`.
3. Click `+` of Work Header.
Pass: all 22,442 rows back, same order as step 1, every box `-`.
B. Filter Platform "CBWA" (708 rows): same steps. Pass: step 2 = 1 row, step 3 = 708 rows, same order.
C. Regression for the box model (ETM-8632 s4-s9): `-` Work Breakdown -> P+H+W; `-` Work -> P+H; `-` Work Header -> P; `+` Work Header -> P+H (Work box is `+`, so Work stays hidden); `+` Work -> P+H+W; `+` Work Breakdown -> N0.

## Automated re-run (RUN-POLICY: auto, re-run of tests that ran before)
```
node tools/run-card.mjs ETM-8449 tests/fe/e2e/shutdownLogic/verifyShutdownLogicCollapseExpand.spec.ts -g "ETM-8632|ETM-8633|ETM-8635"
```
The spec already expects the fixed behaviour (openPlan collapses the histogram; 8633 s5 expects all F0 rows back).

## After the retest
- Pass: "Retest: Passed" comment on the Defect with the step pictures embedded (full screen, before/after), then Xray. Each needs the user's yes.
- Fail: comment on the Defect with the new picture and the build; keep it Open.

## Note
BA answer F-2 (ba-answers.md) says `+` Work Header shows "Platform, Work Header and Work; Work Breakdown stays hidden". That was given under the old box model. The user's F-6 rule replaced it: with the Work Breakdown box still `-`, its rows come back too (= ETM-9177 Expected). If dev quotes F-2, point to F-6.

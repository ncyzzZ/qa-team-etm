# ETM-8905 regression run, 2026-11-25 10:50-15:00 (QA, run-card, --workers=1, line reporter)

User approved in chat: "รัน 10 spec ไม่รวม security". Reports: PW_REPO/output/runs/2026-11-25_*_ETM-8905/.
QA was unstable during the run: page.goto timeouts, net::ERR_CONNECTION_RESET, 404 on chunk-RHNFYFW7.js (FE redeployed mid-run; develop got 075acc98, a58ce777, a6e29bc2 for ETM-8034/9219/10034/9227/10031 today).

| Spec | Ran | Pass | Fail | Flaky | Skip |
|---|---|---|---|---|---|
| CollapseExpand | 7 | 1 | 5 | 1 | 0 |
| DateInput | 16 | 8 | 8 | 0 | 0 |
| HistogramTooltip | 15 | 12 | 2 | 1 | 0 |
| Priority | 12 | 10 | 1 | 1 | 0 |
| Scrollbar | 8 | 5 | 1 | 1 | 1 |
| Simop | 19 | 15 | 3 | 1 | 0 |
| UsedResource | 36 | 18 | 4 | 0 | 14 |
| UsedResource.manual | 14 | 5 | 0 | 0 | 9 |
| RowColour | 15 | 6 | 7 | 1 | 1 |
| FasterPaste | 0 | - | - | - | - (globalSetup JO login: page.goto timeout) |

## Failures, first reading (not proven; no defect logged)
- Script needs heal, not 8905: ETM-8182/8185/8204 (UsedResource), ETM-7542 (Simop) look for "Focus Critical Path"; commit 9c2af71d (ETM-8852, 24 Nov) renamed the label to "Critical Path" (data-testid sl-toolbar-focus-critical-path unchanged).
- Env / data: CollapseExpand 8629/8630/8631/8632/8635 "Gantt rows should load" or goto timeout on the 20,000-row plan (8449 baseline: 8629/8630/8631/8635 skipped, 8632 passed); FasterPaste 0 run.
- JO view-only (7056 DateInput, 7070 Priority, 8821 Tooltip): Gantt not visible for JO. Rule: JO opens Active plans only; check which plan the spec uses before calling it a bug. 8821 passed for 8393 on 24 Nov.
- Known ETM-8034 work in progress: RowColour 8859/8861/8862/8865/8867/8871 failed in 8034's own runs too; 8857 passed there on 24 Nov (new fail, dev pushed 075acc98 for 8034 at 14:55 during the run).
- Needs a look (possible behavior change, no baseline in work/): DateInput 7046/7047/7049 (assertions: date format, red background, "Unable to Apply Scheduled Time" popup) and 7048/7050/7052/7044 (locator); HistogramTooltip 8820 (`histogramData` undefined in page.evaluate: test hook, may be moved by the 8415 "split logic container into services" commit 67d288e5); Simop 7552/7555 (BE matrix answer: Prohibit vs Allow, data of SIMOP matrix); UsedResource 8196; Scrollbar 7011.

## Re-run 15:07-16:12 (user: "heal + รันซ้ำ")
Heal (not committed, PW_REPO): `usedResource.helpers.ts` focusSwitch and `verifyShutdownLogicSimop.spec.ts` 7542 find the toolbar switch by data-testid `sl-toolbar-focus-critical-path` / `-dropped-task` instead of the old label text.

| Test(s) | Re-run result | Reading |
|---|---|---|
| UsedResource 8182/8185/8204 | skipped | heal works (switch found); switch is disabled in this plan (no critical path): data, not proven |
| UsedResource 8196 | failed again "Only the chosen header is ticked" | needs a look |
| Simop 7542 | not run (globalSetup: no 200 on /configs/v1/credentials/system in 120 s) | env; heal not proven yet |
| Scrollbar 7011 | failed again (.b-grid-row not visible) | needs a look |
| Priority 7070, DateInput 7056 (JO) | failed again (Gantt not visible for JO) | likely data: JO opens Active plans only |
| HistogramTooltip 8821 | passed | was env |
| DateInput 7048 | failed, now assertion (red background CSS) | needs a look, with 7046/7047/7049 |
| DateInput 7050 | page.goto timeout | env |
| DateInput 7052/7044 | failed again (.shared-modal / .shutdown-filter-panel not visible) | needs a look |
| CollapseExpand 8629-8635 | 2 passed (8632, 8633), 4 skipped (timings / check-by-eye, Not proven) | was env; same as 8449 baseline |
| FasterPaste (18) | 7 passed, 2 failed, 9 skipped | 8737 = known defect ETM-10058 (8521); 8751 failed for 8521 too; skips = 8521 data / BA R2 items |

User 2026-11-25 (chat): keep the Critical Path testid heal (usedResource.helpers.ts, verifyShutdownLogicSimop.spec.ts). Not committed.

## Script check ("เช็ค Script ก่อน"), fixes and re-run 16:22-16:51 (runs 2026-11-25_162245.._163915_ETM-8905)
Script fixes (not committed, PW_REPO): DateInput spec, Simop spec + simop.helpers.ts, HistogramTooltip spec, Priority spec, Scrollbar spec, UsedResource spec + usedResource.helpers.ts. Shared pages/shutdownLogicPage/actions/actions.ts NOT changed (needs: RED_CELL_BG -> rgb(255, 204, 199); histogram collapse in goto()/reloadReady()).

| Test | Cause | Fixed? | Re-run |
|---|---|---|---|
| 7542 Simop | script-locator (label "Critical Path", ETM-8852) | yes (testid) | flaky: failed, passed on retry |
| 7552 Simop | data (picked tasks really overlap: Resource-calendar task longer than its bar) | yes (Manual-calendar pick + no-overlap check) | failed: plan has 0 Manual-calendar L4 tasks (SIMOP_LOGIC_PATH) - data |
| 7555 Simop | script (dropdown filters by current value) | yes | passed |
| 8820 Tooltip | script (stale histogram row id after recalculate) | yes | skipped, Not proven: row has no bar in Working Time after filter - data |
| 7070 Priority (JO) | data (plan not Active -> JO 403 inactive) | yes (ETM8034_JO_PATH, read only) | passed |
| 7011 Scrollbar | data (JO on non-Active plan; Empty Plan C deleted) | partly (runs as TM) | not run: needs SCROLLBAR_PLAN_EMPTY_PATH |
| 8196 UsedResource | script-wait (Select All read too early) | yes | passed |
| 8182/8185/8204 | data (eND50 has no critical tasks -> switch disabled) | script ready (ETM7898_CP_PATH) | not run: needs ETM7898_CP_PATH |
| 7044 DateInput | script-locator (Expand Date chevron) | yes | failed later: row count after date filter 13, not < 13 (all rows overlap that day?) - script/data, needs look |
| 7046 DateInput | script/TC (one-digit accepted, ETM-7809) | yes | failed: 13:00 shown 13:30 = RULES.md "start in non-working time commits first working instant" on this task's calendar - script data |
| 7047 DateInput | script (red colour #ffccc7, PM accepted ETM-7902) | yes | passed |
| 7048 DateInput | script (red colour) | yes | passed |
| 7049 DateInput | app, KNOWN: RULES.md KD BUG-06 (End before Start -> M-SCHED popup on Resource Calendar tasks) | no | failed (popup count 1) - not refactor |
| 7052 DateInput | script (history set-up) | yes | passed |
| 7056 DateInput (JO) | data (plan not Active) | yes (ETM8034_JO_PATH) | passed |

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

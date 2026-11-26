# Must regression (stms-fe 99817c2) - resume

Started 25 Nov 23:38. Done: ETM-7343, ETM-8003. Stopped during ETM-8034 (computer shut down at 00:40).
Re-run from ETM-8034 onward (user already approved "รัน Must เลย"):

```
node tools/run-card.mjs ETM-8034 tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.security.spec.ts tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.spec.ts
node tools/run-card.mjs ETM-8042 tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.partial.spec.ts tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.spec.ts
node tools/run-card.mjs ETM-8049 tests/fe/e2e/worklist/verifyWorklistWorkingLocationCells.spec.ts tests/fe/e2e/worklist/verifyWorklistWorkingLocationColumns.spec.ts tests/fe/e2e/worklist/verifyWorklistWorkingLocationEntry.spec.ts tests/fe/e2e/worklist/verifyWorklistWorkingLocationImport.spec.ts
node tools/run-card.mjs ETM-8391 tests/fe/e2e/worklist/verifyWorklistRemarkFilter.spec.ts
node tools/run-card.mjs ETM-8393 tests/fe/e2e/shutdownLogic/verifyShutdownLogicHistogramTooltip.spec.ts
node tools/run-card.mjs ETM-8394 tests/fe/e2e/importWork/verifyImportWorkStatus.spec.ts
node tools/run-card.mjs ETM-8905 tests/fe/e2e/shutdownLogic/verifyShutdownLogicSimop.spec.ts tests/fe/e2e/shutdownLogic/verifyShutdownLogicUsedResource.spec.ts
cd <PW_REPO> && npx playwright test tests/fe/e2e/dailyReport/etm7901/verifyDailyReportExportTimeframe.spec.ts tests/fe/e2e/equipmentMobPlan/verifyEquipmentMobPlanDeleteWorkHeader.spec.ts tests/fe/e2e/importWork/observeImportErrors.spec.ts tests/fe/e2e/importWork/verifyImportRules.spec.ts tests/fe/e2e/importWork/verifyImportWorkBasic.spec.ts --workers=1 --reporter=line
```
Finished reports: output/runs/2026-11-25_23*_ETM-7343, output/runs/2026-11-25_234033_ETM-8003 (PW_REPO).

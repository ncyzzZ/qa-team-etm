# False-pass backlog in older specs (qa-check spec)

Cleared 2026-11-20 (ep-etm-fe-qa b92bd8a): 7 real fixes, 30 lines checked by a person and marked `// qa-check: ok <why>`. `qa-check spec` now shows 0 false-pass errors on these 17 files.

Real fixes (re-run when the card is touched; a test that passed before may now fail or end not proven, which is the point):
- verifyDailyReportScrollbar / verifyShutdownLogicScrollbar: no thumb = NaN thickness (was 0, passed "thin").
- verifyMobPlanDeleteResource ETM-7340: another resource that disappears now fails.
- verifyEquipmentMobPlanCopyPaste.security: notChecked when no Width / Remark field in the Save body.
- verifyImportWorkBasic: notChecked when no System Condition column.
- verifyShutdownLogicUsedResource.manual: notChecked when G is shared; Job Owner editor check asserts the cell is visible first.

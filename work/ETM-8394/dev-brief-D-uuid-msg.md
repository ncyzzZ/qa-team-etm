# Dev brief: DEFECT_KEY (Story ETM-8394)

## 1. What is wrong
On Import Work, a `Work Breakdown` row with `Action = Revise` that uses the UUID of a breakdown whose Work was deleted is rejected with "The work breakdown with the entered UUID is already associated with another work in the system." It must say "The UUID you entered is not exist in the system." (AC 3.4). The row is correctly rejected; only the message is wrong.

## 2. Where
- Environment: QA, `https://stms-qa.apps.pttep.com`. Role: Turnaround Manager.
- Page: Worklist > Create Work > Import Excel ("Import Work and Work Breakdown"), upload validation.
- Data: event `NN TEST QA`, Worklist of Plan 6843; any Worklist works.

## 3. Steps to reproduce
1. Import Work `Y1` with 2 breakdowns and Work `Y2` with 1 breakdown (`Action = Add`), Confirm.
2. Import a `Y1` Work row with `Action = Delete`, Confirm (Y1 is deleted).
3. Upload a file: `Y2` Work row `Action = Revise` + one `Work Breakdown` row under `Y2`, `Action = Revise`, UUID = one breakdown UUID of the deleted `Y1`.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Message on the breakdown row | "The work breakdown with the entered UUID is already associated with another work in the system." | "The UUID you entered is not exist in the system." |
| Import | Disabled | Disabled |

## 5. Rule source
- ETM-8394 AC 3.4: Revise on a deleted Work, or on a Work Breakdown under a deleted Work, gives the UUID Error.
- BA answer 25 Nov 2026 (round 4, Q1): the "not exist" message is correct here.
- Xray Test ETM-8766 (Test Execution ETM-8774), step "Upload the file" of the second file.

## 6. Hints for the fix (guess)
- The breakdown of the deleted Work is not flagged deleted (see the related defect on ETM-8767), so the UUID lookup still finds it and the "belongs to another Work" check fires first. Checking "parent Work deleted / breakdown deleted" before the "associated with another work" check, or fixing the soft delete, likely fixes both.

## 7. How QA will retest
- Re-run Playwright test ETM-8766 (`tests/fe/e2e/importWork/verifyImportWorkStatus.spec.ts`): the breakdown row must show the "not exist" message, Import disabled.

## 8. Out of scope / do not change
- A breakdown UUID that really belongs to another live Work must keep the "already associated with another work" message.

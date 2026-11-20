# Handoff 20 Nov 2026 (afternoon): one new chat per card

Board column "In Testing" on 20 Nov (user screenshot): only ETM-8042 (other chat), ETM-8392, ETM-8405, ETM-8388. ETM-8521 and ETM-8003 are NOT ready for QA: their runs today are early dry runs only; no defect, no new Xray push for them until the Story reaches In Testing / Ready for QA.

Read work/handoff-2026-11-20.md too (morning). Not committed in ep-etm-fe-qa: tests/fe/e2e/shutdownLogic/paste.helpers.ts + verifyShutdownLogicFasterPaste.spec.ts (8521), tests/fe/e2e/dailyReport/etm8392/verifyDailyReportRampLines.spec.ts (8682), pages/dailyReportPage/sCurvePage.ts + etm8003 spec (on purpose). ETM-8042 files: other chat, do not touch.
Xray step-picture push: scratchpad script of the 20 Nov chat (xr.mjs / push.mjs): GraphQL addEvidenceToTestRunStep + updateTestRunStepStatus, pictures read from results.json of the PASSED run only.

## ETM-8521 (Test Execution ETM-8773), spec tests/fe/e2e/shutdownLogic/verifyShutdownLogicFasterPaste.spec.ts
- 8760 was pushed PASSED in the morning, then reset to TO DO on user request (20 Nov, card not in testing): no status, no pictures in Xray now. Passed in a run (pre-QA, re-run when the card is in testing): 8760 (run 2026-11-20_135349), 8752 (run 2026-11-20_150224).
- Fixed today: manpower column = manpowerResources; desc() reads Description without the Activity Group tag; mp() reads only visible Manpower chips (hidden #measurer); paste() clicks OK on "No Working Time Available" (user decision D-1, note ba-confirm).
- Open, user decides: 8759 (6 Manpower resources accepted, AC 4.2 says reject >5: defect or BA); 8748/8749/8750 step 4/8753/8761 (POB, Man-hrs, Work Conflicted are not grid columns: fix TC or ask BA); 8762 (60-row paste lands on a Work Lv2 row: app should skip or script counts wrong); 8751 (150-char Description not cut to 100); 8737 (source row 2 Duration 10.00 not 12); 8741 (paste in Edit Mode does not replace the edited cell); not looked at: 8736, 8740, 8739 (fill handle), 8743 (Gantt task not found).

## ETM-8388 (ETM-8732): PASSED 17, FAILED 8714 (defect ETM-8881, user adds the images to the Description) and 8723 (defect ETM-8877). Manual TO DO: 8711, 8715, 8729, 8730. BA updates AC 2.1 / AC 3.1.

## ETM-8392 (ETM-8825): PASSED 12 (8682 TC steps 2/4 changed to scroll, pushed with pictures). Manual TO DO: 8677, 8688, 8797 (data changes; check the Ramp snapshot logic is on QA), 8690, 8692, 8693 (PDF).

## ETM-8405 (ETM-8647): PASSED 6/9. AC-7 strong (user decision D-1: group row shows no summary), AC-10 strong; AC proven 3/9. 8643 (TC-006 Partial, needs `seedSprint26 --actual --apply`, a QA data write), 8644 (TC-007 Manual), 8646 (TC-009 Manual, could be scripted with a mocked 500): no script.

## ETM-8003: blocked. Colour change only on stms-fe branch feature/ETM-8003_s-curve-colors (QA still #ffd666 / #81a827). S-Curve is a Chart.js canvas, SVG reader in sCurvePage.ts must be rewritten. ETM-8807 cannot run until both are done.

## ETM-8049: no Admin account needed: Job Owner has no View Worklist on a plan that is not active.

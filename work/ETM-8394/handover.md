# ETM-8394 hand-over (2026-11-24)

## Done
- Script rewritten for the AC of 23 Nov and the BA answers of 24 Nov (DEC-076):
  - files: `PW_REPO/tests/fe/e2e/importWork/importStatus.helpers.ts` and `verifyImportWorkStatus.spec.ts`;
  - not committed; tsc and qa-check pass.
- Xray / Jira pushed and read back with 0 diffs:
  - 19 Tests in total. The 3 new ones are ETM-8919, ETM-8920 and ETM-8921;
  - ETM-8768 rewritten to 9 steps, ETM-8919 has 4 steps;
  - Test Execution ETM-8774 and Test Plan ETM-8636 updated;
  - [QA] subtask ETM-8564 updated.
- BA answers saved in `ba-answers.md`; findings F-21 to F-25 are confirmed.

## Run 2026-11-24 14:09 (stopped before the end)
- Folder: `PW_REPO/output/runs/2026-11-24_140902_ETM-8394`.
- There are 17 test folders, and every one also has a `-retry1` folder, so every test failed at least once.
- ETM-8768 and ETM-8919 have no folder: probably skipped (needs a frozen Worklist).
- The report was not built, and `run-results.json` was not written.

## Next
1. `node tools/run-card.mjs ETM-8394 --build-only <run folder>`, then read `triage.md`.
2. Find the common cause first: all failed, so it is probably one shared cause, such as the helper or the import page. Look at `error-context.md` / the error lines, not the screenshots.
3. Fix the script, `tsc` + `qa-check spec`, then ask "พร้อมรันไหม" before running again.

## 2026-11-24 afternoon: causes of run 14:09 (no results.json, so --build-only built nothing)
- Fixed in the script (tsc 0, qa-check spec 0 errors, preflight 0 broken):
  - console guard `watched()` failed 5 tests at the end: 404 of `graph.microsoft.com/.../photos/48x48` (test user has no photo). Now ignored, same way as `remarkFilter.helpers.ts`.
  - banner: app says `1 data validation error were found` (singular for 1, plural for 2+, stms-fe `import-validate-status.component.spec.ts`). `MSG.banner1` / `MSG.banner(n)` follow it. 5 tests.
  - `UNVERIFIED.exportButton` -> `app-worklist-export button` (icon only, no name). `templateDownload` -> button `Download Template`; it uses `window.open`, so new helper `downloadVia()` catches the download in the new tab. 2 tests.
- Not script: QA was slow during the run (page.goto 60 s timeouts 7x, ERR_SOCKET_NOT_CONNECTED). Retry-only failures (7c39e retry: breakdown deleted by the first attempt) follow from that.
- OPEN (user): ETM-8756 steps 6-7 ask for a Work Status dropdown on Work Details; the app has none. Status is changed in the Worklist float menu (select row -> `Change Work Status` disabled for Ready, `Change Breakdown Status` enabled).
- OPEN (later, Jira write): Xray steps with "1 data validation errors" need the singular wording.

## Run 2026-11-24 20:52 (`output/runs/2026-11-24_205244_ETM-8394`): 12 pass / 5 fail / 2 skipped, AC proven 6/14
- ETM-8756: locator; app button names are "swap Change Work Status" / "swap Change Breakdown Status" (Change Work Status IS disabled). Heal diff `heal-8756-live.diff` in the run folder, guard 0 errors, waiting for Apply.
- ETM-8755: the export holds the WHOLE Worklist (306 rows, filter ignored) with Action blank on every row; importing it unchanged gives 308 errors. Decision needed (TC wording vs app bug / BA).
- ETM-8765: Download Template opens SharePoint download.aspx; the test account gets SharePoint access-denied, so no file. Env / permission, not script.
- ETM-8766: part 1 passes (3 UUID errors). Part 2 (Y1's breakdown UUID under live Y2) gets "The work breakdown with the entered UUID is already associated with another work in the system." Decision needed.
- ETM-8767: Delete of Work + its breakdown in one file: Work soft-deleted (sdw_is_delete Y), breakdown row stays in shutdown_activity_breakdown (no delete flag). Template says Work delete = soft delete with its breakdowns. Decision needed.
- 2026-11-24 21:36: Defect ETM-9233 logged for ETM-8755 (assignee Peeranat, [BE] ETM-8602), [QA] ETM-9234 Done 20m, 2 pictures embedded (repro `tests/fe/explore/etm9233Repro.spec.ts`, no save), Xray ETM-8755 FAILED with evidence, step 3 FAILED + defect linked (verified).
- 2026-11-24: ETM-8756 healed (button names "swap Change ...") and passed. Next: user decisions on 8765, 8766, 8767.
- 2026-11-24 (D-5): ETM-8765 reads the template the user downloads by hand: `PW_REPO/output/manual-input/ETM-8394/import-template.xlsx` (or env ETM_8394_TEMPLATE). No file = skipped (Not proven). tsc 0, qa-check 0.

## 2026-11-25: ETM-9233 is NOT a defect (QA lead decision)
- Lead: the system is right. The export leaves `Action` blank on purpose; an unchanged export uploaded again must show "This field is mandatory." The user has to fill `Action` first.
- Lead deletes ETM-9233 in Jira by hand. Files `dev-brief-ETM-9233.md` and `retest-9233.md` are obsolete.
- To do (needs the user's yes, Xray write): ETM-8755 step 3 -> "fill `Action = Revise` on every row, then upload" (expected: no error, Confirm enabled); set ETM-8755 back from FAILED, remove the defect link on step 3; re-run ETM-8755.
- `questions-for-BA-round5.md` Q1 and Q3 closed by this decision; Q2 (export follows the filter?) still open.

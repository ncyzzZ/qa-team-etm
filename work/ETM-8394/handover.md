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
- 2026-11-25 15:10: ETM-9233 deleted in Jira by the lead (checked: issue no longer exists). ETM-8755 PASSED in ETM-8774 (run 2026-11-25_140423), steps 3 and 6 updated.
- 2026-11-25 15:00: 8766/8767 re-run for defect evidence hit "Loading..." (QA busy, 5 cards running); re-run blocked by another session's ETM-8394 run lock. Defects D1/D2 (xray-fix-proposal-3.md) not logged yet.

## 2026-11-25 afternoon: BA R4/R5 applied, two defects logged
- Xray ETM-8755 step 1 updated (export holds the whole Worklist, Action blank); steps 3/6 already said "fill Action = Revise"; 8755 PASSED in ETM-8774, no defect link.
- ETM-10051 (from 8767): breakdowns of a Work deleted by import are not deleted/flagged. DB evidence only. Assignee jif (thanawich klongsard). [QA] ETM-10052 Done 20m. Xray 8767 step 9 FAILED + linked.
- ETM-10060 (from 8766): breakdown UUID of a deleted Work gives "already associated with another work" instead of "UUID not exist". Picture work/ETM-8394/evidence-8766/step6_upload_result.png embedded. Assignee jif. [QA] ETM-10061 Done 20m. Xray 8766 step 6 FAILED + linked. Relates to ETM-10051.
- Spec: 8766 now saves a full-screen picture of the upload result before the check; expectBreakdownGone accepts a delete flag. Not committed.
- ETM-9233 still Open in Jira (lead deletes it by hand).

## 2026-11-25 16:15 re-run 8766/8767 (run 2026-11-25_160526)
- ETM-8766 FAIL step 6: breakdown row with the UUID of a breakdown under deleted Work Y1 shows "The work breakdown with the entered UUID is already associated with another work in the system." (expected "The UUID you entered is not exist in the system."). Evidence: PW_REPO/output/evidence/ETM-8766/step6_upload_result.png (full screen, checked not blank). = D1.
- ETM-8767 FAIL step 9: breakdown 1 of Z2 still live after Delete (not removed, not flagged deleted; BA R4-2). = D2.
- Asked the user on the board whether to log D1 + D2. Nothing logged yet.
- 16:20 both are already logged (by another session, 25 Nov): D1 = ETM-10060, D2 = ETM-10051, both Open. No new defect. Board question closed.

## 2026-11-25 19:20 status of ETM-8774 (15 PASSED, 2 FAILED, 2 TO DO): blockers
| Test | Xray | Blocker / next step |
|---|---|---|
| ETM-8766 | FAILED | Defect ETM-10060 (Open, jif). Retest after the fix. |
| ETM-8767 | FAILED | Defect ETM-10051 (Open, jif). Retest after the fix. |
| ETM-8765 | TO DO | Test account gets SharePoint access-denied on Download Template. Needs the template downloaded by hand to `PW_REPO/output/manual-input/ETM-8394/import-template.xlsx` (folder empty now), then re-run 8765 only. |
| ETM-8919 | TO DO | Not proven: JO sees Active Plans only; the card-owned Plan is not Active, so JO gets Access Denied before the freeze rule. Needs the user's yes to make a frozen Plan Active (only one Active per event, affects other testers), or a hand check by the user. |
- A full-card run by another session (`run-card`, started 18:53, `output/runs/2026-11-25_185329_ETM-8394`) was still running at 19:17; not duplicated. Board question asked (`--job ETM-8394`) on 8765 / 8919.

## 2026-11-25 19:45 runs 185329 (other session, full card) and 192555 (8744/8745/8769/8919)
- 185329: 12 pass / 5 fail / 2 skipped. 8766, 8767 = defects ETM-10060 / ETM-10051 (unchanged).
- 8744, 8745, 8769 (passed 24 Nov) fail in both runs: the Job Owner gets "Access Denied" on Worklist ed771320 of "Wide Plan B - NN". Cause in DB: that Worklist item is switched OFF (`swl_active_status = false`, set 25 Nov 01:31 BKK by the test account, not by this card). Plan itself is still Active. Env/shared data, NOT a locator: the `needs-live` heal rows of run 192555 are not healed.
- 8919: helper `withCardPlanActive` (importStatus.helpers.ts) did not confirm "Change Active Plan" (isVisible() does not wait); fixed with waitFor + it now also switches the card Plan's Worklist item ON (JO needs it). Wide Plan B was put back / stayed Active (checked in DB 19:39). tsc 0.
- Board question (job ETM-8394): yes to switch the Worklist item of Wide Plan B back ON (shared data), then re-run 8744/8745/8769/8919. Note left in the side-session notes folder.

## 2026-11-25 20:05 end state (runs 194643, 195801, 200117)
- User's yes (board 19:44): Worklist item of "Wide Plan B - NN" switched back ON with the one-off `tests/fe/explore/etm8394WidePlanBWorklistOn.spec.ts`. Then 8744, 8745, 8769 PASSED again (run 194643).
- Found: switching the Active Plan switches OFF the Worklist item of the Plan that loses Active, and making it Active again does not switch it back ON. This is the likely cause of the OFF at 25 Nov 01:31 (some card switched Active Plans). `withCardPlanActive` now puts the old Plan's Worklist item back ON when it was ON. Checked after run 200117: Wide Plan B Active, Worklist ON.
- ETM-8919 PASSED (run 200117, 4/4 steps). Step 3: the Import page calls POST /shutdown/validate (isCheckFreeze) and the refusal comes back as HTTP 500 with a subCode, which the FE shows as Access Denied. That 500 is allowed for 8919 only. Observation for BA/dev (not logged): a 500 is used for "access denied" (a 403 would be expected).
- Xray push queued (`ask --later`): only real change ETM-8919 TO DO -> PASSED; push-guard OK.
- Spec/helper changes in PW_REPO (not committed): importStatus.helpers.ts (activePlanOf, withCardPlanActive, turnCardWorklistOn, worklistActive), verifyImportWorkStatus.spec.ts (8919), tests/fe/explore/etm8394WidePlanBWorklistOn.spec.ts. tsc 0. qa-check spec: 6 old errors (live-check.md rows for 8747/8755/8756/8766/8767/8768), not from this change.

| Test | Xray | Blocker / next step |
|---|---|---|
| ETM-8766 | FAILED | Defect ETM-10060 Open: retest after the fix |
| ETM-8767 | FAILED | Defect ETM-10051 Open: retest after the fix |
| ETM-8765 | TO DO | Needs the template downloaded by hand (test account: SharePoint access denied) at PW_REPO/output/manual-input/ETM-8394/import-template.xlsx; then run 8765 only |
| ETM-8919 | TO DO -> PASSED after the queued push | push answer pending |
- 2026-11-25 20:10 Xray push done (user "ได้ทุกข้อ", relayed by the lead session): ETM-8919 PASSED in ETM-8774 with 4 step pictures of run 200117. Read back: 16 PASSED, 2 FAILED (8766, 8767), 1 TO DO (8765).

## 2026-11-25 evening: whole card re-run
- Run 2026-11-25_185329: 12 pass / 5 fail / 2 skipped. 8766/8767 = known defects ETM-10060/ETM-10051.
- 8744/8769 (JO uploads): Worklist never showed Total Results. JO plan "Wide Plan B - NN" (808363e9) was not Active during the run (spl_updated_date 13:02 UTC, set Active again after the run, by another tester). 8745: search box fill timeout, QA slow. Not script.
- Re-run 2026-11-25_210136 (8744/8745/8769): 3/3 passed.
- Push plan: work/ETM-8394/push-plan.md, push-guard 16 OK. Question queued (ask --later), not pushed.
- Open: 8765 needs the template downloaded by hand; BA round5 Q2.
- 2026-11-25 push ตามแผน (user chat): logger read ETM-8774, all 16 already PASSED (push of 20:10), nothing written. 8765 TO DO, 8766/8767 FAILED untouched.

## 2026-11-25 22:20 retest (run 221434), lead: "รีเทส defect ไปละ เทสที่ เฟล ได้เลยนะ"
- ETM-10060: Jira "Ready for UAT". 8766 PASSED (all steps; step 6 now gives the UUID error). Evidence: PW_REPO/output/evidence/ETM-8766/ (10 pictures, 22:16).
- ETM-10051: Jira still Open. 8767 FAILS the same way (step 9: breakdown 1 of Z2 still live after Delete). Blocker unchanged: wait for the fix.
- Asked on the board (job ETM-8394): Xray 8766 FAILED -> PASSED + Retest: Passed comment with pictures on ETM-10060 + [QA] Retest sub-task. Nothing written yet.
- 22:55 user's yes (board 22:51): Xray ETM-8774 ETM-8766 PASSED with 10 pictures; the import reset step results, so all 8 steps set PASSED again and step 6 re-linked to ETM-10060. ETM-10060: "Retest: Passed" comment 600680 (3 pictures, @thanawich). [QA] Retest ETM-10086 already existed (Done, from an earlier retest at 21:30 by another session: comment 600673, run 211646), reused, no new sub-task. Status stays Ready for UAT.
- ETM-10060: old retest comment 600673 deleted (user, chat 25 Nov: "ลบอันเก่า 600673"); only 600680 (3 pictures) remains.

| Test | Xray | Blocker / next step |
|---|---|---|
| ETM-8767 | FAILED | Defect ETM-10051 still Open; retested 22:14, same failure (breakdown not deleted). Retest after the fix. |
| ETM-8765 | TO DO | Template must be downloaded by hand (SharePoint access denied for the test account) to PW_REPO/output/manual-input/ETM-8394/import-template.xlsx. |

## 2026-11-25 23:15 ETM-8765 (run 231347)
- User downloaded the template by hand (own account; screenshot in chat: Import_Work_and_Work_Breakdown_Template_V2.xlsx, 1,150 KB, Done) into PW_REPO/output/manual-input/ETM-8394/; copied to import-template.xlsx.
- All 7 steps pass (sheet Dropdown Options read, Work/Breakdown status lists, 4 Works with case/space variants imported and statuses read back). Run reports it as skipped "Not proven, partial" only because the download step is manual (note 'manual').
- Needs the user's confirmation that the manual download step passed before Xray PASSED (skipped is never PASSED on its own). Asked on the board.
- Sent the user's "too many TO DO" request for ETM-8049 / 8034 / 8391 / 8042 to their own card sessions (each to clear or name blockers).
- 23:33 user on the board: "ยังก่อน" for 8765 PASSED. ETM-8765 stays TO DO in Xray; report run 231347 sent to the user. Blocker: the user's confirmation of the hand-download step.

## 2026-11-26 round 5 Q2 closed
- QA lead decision: export = whole Worklist, filters ignored, correct, no defect. Recorded in ba-answers.md; questions-for-BA-round5.md marks Q2 (and the whole round) closed.
- Xray ETM-8755 step 1 already matched this wording (read back 2026-11-26); no Xray write, 8755 stays PASSED.

## 2026-11-26: 8765 PASSED
- The user confirmed the hand-download step in chat ("ยืนยัน 8765 PASSED push ได้").
- Xray ETM-8774 / ETM-8765: all 7 steps are PASSED and the run is PASSED, with a comment saying the download was done by hand and confirmed.
- ETM-8774 now: 18 PASSED, 1 FAILED (8767, waiting on ETM-10051).

## 2026-11-26: 8767 split and PASSED
- Dev turns ETM-10051 (Delete leaves breakdowns) into an improvement user story. User chose to split it out ("แยก step 9 ไป story ใหม่", "ทำเลย").
- Xray ETM-8767 steps 9 and 13: action "Read W-8394-Z2/Z3.", expected "Work Status Deleted" only, with a note pointing to the story from ETM-10051. Spec: expectBreakdownGone removed for Z2/Z3, step titles "Read Z2/Z3" (PW_REPO, not committed). Plan: work/ETM-8394/split-8767-step9.md.
- Run 2026-11-26_112533: 1/1 passed. User "ผ่านแล้วตั้ง PASSED ได้เลย": ETM-8774 8767 all 13 steps PASSED, run PASSED, comment; ETM-10051 link kept on step 9 for history.
- ETM-8774: 19/19 PASSED.
- Open: when the improvement story has a key, write its TC from the old steps 9/13 (breakdown gone after Delete, TM and JO).
- 2026-11-26: [QA] Execute ETM-8565 -> Done (user "ปิด QA subtask ของ 8394 ได้เลย"). [QA] Create ETM-8564 was already Done. Not done: resolve-tested-by, Test Execution ETM-8774 Done, Story to Ready for UAT (each needs its own yes).
- 2026-11-26 closeout (user "ทำต่อเลย"): 19 Tests Resolved (Done) -> Closed, assignee already the user (JQL count 19). Test Execution ETM-8774 Open -> In Progress -> Done. Story ETM-8394 -> Ready for UAT. BE subtasks ETM-8602/8604 still In Progress (not QA, not touched).
- Note: Story AC 7 still says "a Work Breakdown is removed permanently"; that part now belongs to the improvement story from ETM-10051 (no key yet).
- 2026-11-26 12:43 ETM-10051 check (user "ทั้ง 8042 และ 10051"): ETM-10051 is "Deployed to QA", but run 2026-11-26_124337 (8767 with CHECK_ETM10051=1, which turns the breakdown check of steps 9/13 back on) failed on both attempts: breakdown 1 of Z2 is still there after Delete. Not fixed on QA. Xray 8767 stays PASSED (this run was the defect check only; run-results.json restored). Nothing written to Jira.
- 2026-11-26 12:50 (user "ใส่ comment"): ETM-10051 comment 600973 "Retest: Failed" with @mention of the assignee and 3 pictures (step7, step8, test-failed-1 of run 124337). Draft work/ETM-8394/retest-failed-ETM-10051.md (expected-source 0 errors; AC 7 source saved in work/ETM-8394/source/). Not done (each needs its own yes): [QA] Reopen Defect sub-task, defect back to Open, Xray step FAILED (8767 step 9 no longer checks this).
- 2026-11-26 12:58 (user: dev fixes only the import delete of a breakdown row for now; "ใส่เลย"): ETM-10051 comment 600974 (scope): breakdown-row Delete with the Work kept passes (8747, run 113015); Work + breakdown Delete still leaves breakdowns -> improvement story. Not reopened, no [QA] Reopen sub-task (user).
- 2026-11-26 13:00 (user "ปิด defect ไปได้เลย"): ETM-10051 Deployed to QA -> Ready for UAT (team convention after retest; the workflow has no Closed, only Deployed to UAT / Cancelled as done states).
- 2026-11-26 (user "รอ story มีก่อน"): TC for Work + breakdown Delete (old 8767 steps 9/13, TM Z2 and JO Z3) waits for the improvement story key. Script ready: CHECK_ETM10051=1 on ETM-8767.
- 2026-11-26 15:30 ETM-10051 re-check (user "เช็คใหม่อีกที"): run 2026-11-26_153052 (CHECK_ETM10051=1, 8767 + 8747). 8747 (Delete a breakdown row, Work kept) passed. 8767 failed: "Breakdown 1 of W-8394-Z2-qkoo is deleted": the breakdown of a deleted Work is still live. Same as 12:43. run-results.json 8767 restored to run 112533 (scoped test stays PASSED). Nothing written to Jira/Xray.
- 2026-11-26 (user, chat): no improvement story. Dev and BA say the current behaviour is correct (deleting a Work by import keeps its breakdowns in the table). QA accepts it. Questions for dev on what this design means: work/ETM-8394/questions-for-dev-ETM-10051.md (not sent yet). The "open: TC for the improvement story" item above is dropped.
- 2026-11-26 dev answers (work/ETM-8394/dev-answers-ETM-10051.md, from code reading, not run on QA):
  - Work delete is a soft delete; its breakdowns are hidden via the Work filter and hard-deleted by a daily job after 30 days.
  - A breakdown Delete row under a deleted Work is validated but skipped.
  - A breakdown UUID under a deleted Work gives "UUID does not exist", not the ETM-8766 message.
  - Restore brings the breakdowns back.
  - RISK: a Manpower Mob created from a saved Gantt before it is saved again still counts the deleted Work's breakdowns (not reproduced). Candidate new TC.
  - AC 7 wording proposed by dev: "the Work is deleted and its breakdowns are no longer shown. They are removed for good after 30 days."
- 2026-11-26 16:00-16:25 ("Do both"):
  - Spec 8767 steps 9/13 now also check the Worklist: searching the Work Number finds it once with Status D. QA keeps deleted Works in the grid, which contradicts dev answer 3, "Worklist hidden".
    - Run 161832: step 9 (TM, Z2) passed. Step 11 (JO upload) failed: the Worklist does not load for the JO.
    - Cause: event NN TEST QA has no Active Plan. "Wide Plan B - NN" was set inactive at 12:42 local, and its Worklist item swl_active_status is false. Turning it Active needs the user's yes (shared data).
    - Xray steps not changed yet.
  - New spec tests/fe/e2e/importWork/verifyMobPlanAfterWorkDelete.spec.ts (ETM-8394-MOB, no Xray Test yet). Run 161408 FAILED in the product:
    - the Manpower Mob Plan created after deleting Work DEL (Gantt not saved again) counts DEL: "QA8394 Del" 5/day, total 10;
    - KEEP: 3/day, total 6.
    - This confirms dev's point 3. Defect candidate; needs the user's yes.
  - Data file ETM-8394.data.cjs got a `mob` plan (automator).
- 2026-11-26 16:27:
  - User "Turn it Active": "Wide Plan B - NN" made Active again with its Worklist ON (DB confirmed). turnPlanActive is now exported from importStatus.helpers.
  - Run 162749: 8767 13/13 passed with the new Status D check.
  - Xray step 9/13 update was refused: "Issue 2300071 is not editable" (the Test is Closed after closeout). Text before saved in xray-steps-8767-9-13-before-2026-11-26.json. Reopening the Test needs the user's yes.
- 2026-11-26 16:41 (user: no reopen of 8767, 'ใส่ comment ไว้'): ETM-10051 comment 601208 = final summary (by design, 8747 passed, 8767 13/13 with Status D check, Mob follow-up found). Xray 8767 steps 9/13 left as they are (Test Closed).
- 2026-11-26 (user pasted dev follow-up): the Mob count of a deleted Work stays for good, even after the Gantt is saved (the Mob stores its snapshot in manpower_mob_resource/period). A Mob Plan created after a Gantt save is correct. Recorded in dev-answers-ETM-10051.md. Defect: user 'Not now'.

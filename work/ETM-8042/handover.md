# ETM-8042 handover (2026-11-25 evening, card session "etm-8042-clear")

Test Execution ETM-8873 (Test Plan ETM-8636). Xray live at start: 14 PASSED, 1 FAILED (8849), 9 TO DO.
Nothing pushed to Xray and nothing written to Jira in this session.

## Done in this session
- Script fixes (ep-etm-fe-qa, this card's specs only, not committed):
  - `rampDownUp.helpers.ts` `expectBadge` now polls (`expect.poll`). Root of the 8840 step 8 failure in run 2026-11-25_163311 (PUT/GET had 18-20 Feb, badge read once before the redraw).
  - `verifyPlanRampDownUp.partial.spec.ts`:
    - 8834: `partial()` removed. Xray step 4 expected is "a failure message appears, note down the text": visible is asserted, the text is logged.
    - 8847: `partial()` removed. Steps 6-8 now assert the team rule (CLAUDE.md "Only two roles": JO view only). No Duplicate Plan in the JO menu, Create Plan hidden or disabled, Edit Plan does not open (or Save disabled).
- Runs (run-policy auto, re-runs):
  - `2026-11-25_191831` 8849: steps 1-7 ok, ends **skipped** (step 5 S-Curve end and step 6 PDF are checked by a person).
  - `2026-11-25_191932` 8834 **passed**, 8847 **passed**.
- push-plan.md rebuilt: 15 PASSED (new: 8834, 8847), push-guard OK. Push question queued (`ask --later`).

## Per test (not PASSED in ETM-8873)
| Test | Xray | Latest result | Next step / blocker |
|---|---|---|---|
| 8834 | TO DO | passed 191932 | Push PASSED (queued question, push-plan.md). |
| 8847 | TO DO | passed 191932 | Push PASSED (queued question). |
| 8849 | FAILED | skipped (by eye) 191831 | ETM-9221 fixed (Ready for UAT, retest round 2). Step 5 S-Curve end 15 Jul 2026 is in `retest-9221/round2/scurve-export5000.png`. **Blocker: step 6 PDF** cannot be exported on the read-only shared report "Export 5000" (Export disabled, needs a frozen day with tasks). User decides: freeze a day on Export 5000 (shared data), or accept step 6 by the 8838 PDF on Plan 8836, then FAILED -> PASSED (status change of a pushed test = user yes). |
| 8840 | TO DO | skipped 193645 (all asserts pass, no API error) | User verdict 1=tc (chat): Xray step 19 updated (backup `xray-steps-before-8840-step19-2026-11-25.json`, read back OK), script freezes Plan B report 09-19 Feb (`freezeUpTo`). `watch()` now ignores only the PUT 500 `SHUTDOWN_PLAN_HAVE_ACTIVE_TO_VALIDATE` (FE Change Active Plan flow, retried with force -> 200). Plan A Active again. **Blocker: a person confirms** the S-Curve pictures of steps 7 and 15 (curve ends 25 Feb 2026), report `output/runs/2026-11-25_193645_ETM-8042/`. Then PASSED (question queued). Plan B report now: 09-19 Feb frozen, 20 Feb open. |
| 8838 | TO DO | manual, steps 4-7 + 9 ok on Plan 8836 | **Blocker: step 8 (Day0 = 14 Feb) not proven**: PDF timeline starts 15 Feb, Export disabled on 14 Feb (no tasks). Needs BA: is Day0 shown in the PDF at all? Also user: accept run on Plan 8836 instead of Plan A. |
| 8836 | TO DO | manual new Plan: step 1 pass; lines proven on Plan A in run 2026-11-24_215348 | **Blocker: user confirms** the manual result (Ramp Up line not drawn on an empty Logic = needs-human). Gate `confirm` needs the evidence-checker first. |
| 8851 | TO DO | failed 150236 step 8 | Steps 1-7 pass (BA Q12 = b). **Blocker: Dev answer on ETM-8833** comment 600585 (End earlier than Start accepted, no error). ETM-8833 still Open, no reply at 19:20. |
| 8833 | TO DO | failed 20 Nov | **Blocker: same Dev answer (ETM-8833 / BA Q5)**. Then fix the expected result and re-run. |
| 8846 | TO DO | failed 24 Nov (Excel File disabled on the 3-year Plan) | **Blocker: defect decision** (F-10, BA 24 Nov: QA asks Dev why Excel is disabled for a 3-year range). Needs user yes for a Jira question/defect. |
| 8842 | TO DO | failed 24 Nov (GUESS Delete locator) | **Blocker: TC + script rewrite.** stms-fe (ETM-4125, daily-report CLAUDE.md "Freeze consent"): there is no Delete button. Extended days go away only when every task is 100% and an extended day (not the last) is frozen -> modal "Delete Extended Days" -> Confirm. Xray step 13 wording must change (user yes, Jira write), script needs a "set Actual 100%" step, and the Ext report 7d71e369 must be re-made (setup spec `setupEtm8042ExtReport.spec.ts`, card-owned). Ext report has extra extended days from the 24 Nov x2 run. |

## Still open from before
- Nothing committed (qa-team-etm work files, ep-etm-fe-qa specs).
- Plan 8836 Daily Report: days 14-24 Feb frozen, 25 Feb open (8840 needs that state).

## 2026-11-25 ~20:00 lead relay "ได้ทุกข้อ" (from the top lead session, not typed here)
- ETM-9221: already done earlier (comment 600639 Retest: Passed + pictures, status Ready for UAT, read back now). No new write.
- 8851 Xray expected rewrite (steps 3, 4, 7, 8 per BA Q12=b): NOT written. The Xray write from this session was refused by the auto-mode permission check (approval came via a peer session). Backup ready: `xray-steps-before-8851-q12-2026-11-25.json`. Needs the user's yes typed in this session (or allow the prompt).
- Push 8834 + 8847 PASSED: not done, same reason.
- 8840 PASSED: not pushed. Team rule "Skipped is never PASSED": latest result is skipped (193645, S-Curve by eye) even though the user accepted the pictures. Stays TO DO unless the user changes the rule or the S-Curve end is asserted by the script.
- 2026-11-25 later (user chat "ได้ ทำเลย"): ETM-8851 steps 3, 4, 7, 8 expected rewritten per BA Q12=b (backup xray-steps-before-8851-q12-2026-11-25.json), read back OK. ETM-8873: 8834 PASSED (6 step pictures), 8847 PASSED (8 step pictures, xray-evidence-8834/, xray-evidence-8847/), read back OK. ETM-8873 now 16 PASSED, 1 FAILED (8849), 7 TO DO.
- 2026-11-25 22:15 retest round (lead relay "เทสที่เฟลได้เลย"): 8849 run 221435 skipped as before (steps 1-7 ok, 5-6 by eye). 8833 run 221517 **passed** (picker does not accept an earlier End; value goes back). 8851 run 221517 failed step 10: pasted End 14 Feb 2026 09:00 stays earlier than Start, no error. ETM-8833 Dev question (comment 600585) still unanswered. Question on the board: push 8833 / 8851 verdict app + defect draft / 8849 FAILED -> TO DO.
- 2026-11-25 22:20-22:28 (user chat "ได้ทุกข้อ"): ETM-8833 PASSED in ETM-8873 (16 step pictures mapped from 7 spec steps, read back OK). ETM-8849 FAILED -> TO DO (read back OK). 8851 defect draft WITHDRAWN: blind evidence check = not-proven (picture taken with the picker still open, Start empty). Re-run 222541 read the field after leaving the picker: the earlier End is NOT kept, End goes back to 25 Feb 2026 18:00 (rule met). Script fixed (read after leaving; Clear End uses the clear icon because typing an empty End also puts the previous value back). Run 2026-11-25_222809: 8851 **passed**. Verdict changed app -> script. Push 8851 PASSED needs the user's yes.
- 2026-11-25 (user chat 'reset แล้ว push'): ETM-8873 test run of 8851 reset to the current 13 Xray steps, then PASSED with 13 step pictures (run 222809, xray-evidence-8851/), read back OK. ETM-8873: 18 PASSED, 6 TO DO.

## 2026-11-25 23:15-23:40 (peer request from ETM-8394 session: "todo เยอะเกินไป")
- S-Curve end is now ASSERTED from the chart data (POST .../scurve-summary, last point with plan != null; helper `sCurveCheck` in partial.spec). 8840 steps 7/15 and 8849 step 5 no longer "by eye". 8840 step 5 freeze now scripted (`freezeUpTo`).
- 8849 run 2026-11-25_231718: steps 1-5, 7 asserted, S-Curve last point 2026-07-15 (expected). Still skipped only for step 6 (PDF Day numbering on "Export 5000": Export disabled, no frozen day with tasks; shared data).
- 8846 is NOT the "initial" rule only: the script now saves the new Logic first (Excel then enabled, stms-fe isExcelDisabled$ = isInitial || dirty). The export then fails: GET .../gantts/export-gantts -> 400 `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` "gantt date range of 1097 days exceeds the exportable maximum of 1095 days" (runs 232032, 2026-11-25_233*). No file, nothing shown to the user (no message seen in the page snapshot, to confirm by hand). BA Q6: no upper limit on the range. Defect candidate (silent export failure / BE limit not in the Story) or TC change (use a range <= 1095 days). Needs the user.
- 8840: script ready (freeze + S-Curve asserted); re-run switches Plan B Active on QA S26 Ramp again -> needs the user's yes.

## 2026-11-25 23:45-00:00 (user chat "1=ได้ 2=a 3=b 4=ได้ 5=ได้")
- 8840 run 2026-11-25_234615 **passed** (step 5 freeze scripted, S-Curve end 2026-02-25 asserted at steps 7 and 15). Plan A Active again.
- 8849 run 2026-11-25_235408 **passed**: step 5 S-Curve end 2026-07-15 asserted; step 6 per user "3=b": PDF of the card-owned Plan 8836 report on 24 Feb = `..._DailyReport_Day10_20260224.pdf`, Day10 = counted from Day0 14 Feb 2026 (asserted).
- 8846 verdict app (user "2=a"). Defect draft `defect-draft-8846-excel-export-3-years.md` + dev brief; blind check AGREE-WITH-WARNINGS (API body only in the annotation: attach network proof; BA Q14 open; Xray step number of the export to confirm at link time). Waiting for the user's yes to log.
- 8842: Xray step 12 rewritten (Delete Extended Days via Freeze consent, backup xray-steps-before-8842-step12-2026-11-25.json, read back OK). **Script not rewritten yet**: needs a way to set Actual 100% on every Work Breakdown task in the Daily Report grid (not in the repo; needs a live look) and a re-made Ext report (setup spec setupEtm8042ExtReport.spec.ts, card-owned). Next step for a new session.
- 8838: BA questions 13 (Day0 in the PDF) and 14 (1095-day export limit) written in questions-for-BA.md, to send as a file.
- 8836: manual re-check (manual-8836-lines-recheck/): step 2 pass (both lines, Ramp Up measured at 25 Feb 18:00), step 1 needs-human (Gantt axis starts 14 Feb 22:00, rows start 15 Feb). Blind evidence check running.
- 8836 blind check: CANNOT-TELL (no Start Date column visible; axis starts 14/02 = First Execution Date, may be by design; line times not readable; step overlay covers the Gantt header). Not confirmed. Next: manual re-run with the Scheduled group expanded (Start Date column) and day zoom + line tooltips, overlay off. Stays TO DO.

## 2026-11-26 00:00 (user chat "ทำทั้งสอง")
- ETM-8873: 8840 PASSED (21 step pictures, run 234615), 8849 PASSED (7 step pictures, run 235408), read back OK. Now 20 PASSED, 1 FAILED (8846), 3 TO DO (8836, 8838, 8842).
- Defect **ETM-10092** logged (Defect, QA, Sprint 26, Epic ETM-4865, labels BE/FE/UI, assignee thanawich klongsard from [BE] ETM-8540, Relates ETM-8042). 2 pictures embedded under Actual Result, dev-brief-ETM-10092.md attached. Xray ETM-8873 / ETM-8846: steps 1-3 PASSED, step 4 FAILED with ETM-10092 linked (verified), run FAILED. [QA] sub-task ETM-10093 Done, worklog 30m, no estimate. F-10 later_defect = ETM-10092.

## Open (named blockers)
| Test | Xray | Blocker / next step |
|---|---|---|
| 8846 | FAILED | Defect ETM-10092 (and BA Q14: is the 1095-day limit intended). Retest after the fix. |
| 8842 | TO DO | Xray step 12 rewritten; script not rewritten: needs a way to set Actual 100% on every Work Breakdown task in the Daily Report grid (live look) + re-made Ext report (setup spec, card-owned). |
| 8838 | TO DO | Step 8 Day0: BA question 13 (questions-for-BA.md, send as a file). |
| 8836 | TO DO | Blind check cannot-tell. Manual re-run with the Scheduled group expanded (Start Date column) and day zoom + line tooltips, no overlay over the Gantt header. |

## 2026-11-26 09:20-09:30 (lead relay: ETM-10092 deleted, 1095-day Excel limit by design)
- ba-answers.md Round 8 records the QA lead decision; Q14 removed from questions-for-BA.md; F-10 outcome confirmed, later_defect cleared.
- Spec 8846 now uses 15 Feb 2026 08:00 - **13 Feb 2029 20:15** (within 1095 days; env ETM8042_LONG_END). Run 2026-11-26_092057: steps 1-6 **pass** (Excel export API 200, Ramp Down/Up in the file OK, badge one line at 600 px).
- New finding, step 7-8 (600 px wide): the Plan Name div in the card header gets **width 0** (DIV.min-w-0 font-bold text-xl, 0x252 px, text-overflow clip): the name is not shown at all, no ellipsis, so it cannot be hovered. Xray expects the name cut with an ellipsis and the full name on hover (F-6 / AC 4). Run 2026-11-26_092830_ETM-8042. Needs the user's verdict (app / tc).
- Xray ETM-8873 still shows 8846 FAILED with the deleted ETM-10092 on step 4: status change needs the user's yes.
- Xray Test ETM-8846 data still says 15 Feb 2029 20:15: to change to 13 Feb 2029 20:15 (Jira write, needs the user's yes).

## 2026-11-26 09:35 Q13/Q14 decisions (lead relay of the user's main-chat answers)
- Recorded in ba-answers.md; Round 8 questions removed from questions-for-BA.md (no open BA question left for this card).
- 8838 step 8: Day0 must be exportable (Q13 = b). Re-proved read-only (manual-8838-day0/, clean pictures manual-8838-day0/clean/): 14 Feb frozen, Export disabled; 15 Feb Export enabled. Defect draft `defect-draft-8838-day0-export.md` + dev brief; blind check defect-proven with warnings (rule is the QA lead's, not BA-confirmed; Focus Today's Task was ON in the picture; Dev should say if "no tasks -> no Export" is intended). Waiting for the user's yes to log.

## 2026-11-26 09:50 (user chat: "log ผูก ETM-8042")
- Defect **ETM-10140** (Daily Report Export disabled on Day0 with no tasks): Defect, QA, Sprint 26, Epic ETM-4865, FE/UI, assignee thanawich klongsard ([FE] ETM-8538), Relates ETM-8042. 2 clean pictures embedded under Actual Result, dev-brief-ETM-10140.md attached. Xray ETM-8873 / ETM-8838 step 8 FAILED with ETM-10140 (verified), run FAILED, other steps TODO. [QA] sub-task ETM-10142 Done, worklog 20m, no estimate. F-13 added (later_defect ETM-10140).
- Still open: 8846 step 7-8 (Plan Name 0 px at 600 px: app or tc?), Xray 8846 still FAILED with the deleted ETM-10092 + Test data says 15 Feb 2029 (change to 13 Feb 2029 needs a yes), 8842 script, 8836 manual re-run.

- Correction 26 Nov 10:00 (picture evidence-8846-name-600px/08.png): at 600 px the Plan Name is NOT hidden: the name div has width 0 so the text wraps one word per line and runs into the badge (`Ramp Down/Up Date` text overlaps the name), no ellipsis; the item rows (Worklist, Shutdown Logic, ...) also wrap one letter per line. Verdict still open (app / tc).
- 26 Nov 10:14: user "app minimum is 1366 x 768" -> 600 px out of scope (tc). Spec: viewport 1366 x 768; name check = one line, ellipsis only if cut; hover check only if cut (the 50-char name fits: not cut, 540 px); step 4 Gantt days asserted as dates. Run **2026-11-26_101432 passed**. Waiting for the user's yes: update Xray Test ETM-8846 (summary + steps 1, 6: 13 Feb 2029; step 7: 1366 x 768; steps 8-9 wording), reset the stale test run (8 steps vs 9) and push PASSED with pictures.
- 26 Nov 10:25 (user chat "ทำเลย"): Xray Test ETM-8846 updated (summary, description precondition, steps 1, 6: 13 Feb 2029; step 7: 1366 x 768; steps 8-9: ellipsis/hover only when cut; backup xray-steps-before-8846-2026-11-26.json). ETM-8873 run reset to 9 steps, then **PASSED** with 9 step pictures (run 101432), read back OK.
- ETM-8873 now: 21 PASSED, 1 FAILED (8838, defect ETM-10140), 2 TO DO (8836 manual re-run; 8842 script).
- 26 Nov 10:30: 8836 manual round 2 (manual-8836-round2/): Start Date 15 Feb 2026 09:00 pass; Ramp Down / Ramp Up tooltips show date only (15 Feb / 25 Feb 2026), time by line position (09:00 / ~18:00). Blind check: pass with warnings (time only by position). Waiting for the user to confirm before PASSED.
- 26 Nov 10:40 (user chat "ยืนยัน push"): ETM-8873 / ETM-8836 **PASSED** with 12 step pictures (steps 1-4: new Plan + round 2 manual; steps 5-12: run 2026-11-24_215348 on Plan A), read back OK. ETM-8873: 22 PASSED, 1 FAILED (8838 / ETM-10140), 1 TO DO (8842 script).
- 26 Nov 10:45: 8842 script rewritten (delete via Unfreeze extended day -> every task Actual 100% (ActualColorPage.typeActual) -> Save -> Freeze -> "Delete Extended Days" -> Confirm; S-Curve end asserted). Ext report re-made by the setup spec (card-owned). Run **2026-11-26_104546 passed**. Push PASSED waits for the user's yes.
- 26 Nov 10:55 (user chat "reset แล้ว push"): ETM-8842 run reset to 13 steps, PASSED with 13 pictures (run 104546), read back OK. **ETM-8873 live: 23 PASSED, 1 FAILED (ETM-8838 step 8, defect ETM-10140 open). Only blocker: retest ETM-8838 after ETM-10140 is fixed.**
- 26 Nov 13:05 (user chat "ได้ push", "รันเลย", "a ผ่าน แล้ว push"): ETM-10140 Deployed to QA. ETM-8838 re-run 9 steps on Plan "QA ETM-8042 8836" (manual-8838-full/; step 4 edited to 18-20 Feb, step 9 set back to 15-25 Feb, badge confirmed). Step 3 by user decision (a): first date column 15 Feb = Day 1. Step 4 picture = step-4b.png (badge 18-20 Feb; toast picture lost). Blind checks: evidence-check/ETM-8838.check.json, ETM-8838-steps4-9.check.json. Xray ETM-8873 / ETM-8838 **PASSED** 9 steps with pictures, read back OK. **ETM-8873: 24/24 PASSED.** ETM-10140 comment 600977 "Retest: Passed" with @dev and 4 embedded pictures. Then (user chat "ได้ ทำเลย"): [QA] Retest sub-task ETM-10150 created, worklog 30m, Done; ETM-10140 -> Ready for UAT. Card ETM-8042 has no blocker left.

## Closeout 26 Nov 2026 (user: "ปิดงานได้เลย")
- 24 linked Tests (ETM-8829..8851, ETM-8883): Resolved -> Closed, resolution Done (JQL count 24/24).
- Test Execution ETM-8873 -> Done (24/24 PASSED checked in Xray first). [QA] Execute Test Case ETM-8559 -> Done (no worklog); ETM-8558 already Done. Story ETM-8042 -> Ready for UAT.
- Not touched: dev sub-tasks ETM-8538..8541 (Done), defects ETM-10092 / ETM-10140 (Ready for UAT).

## Regression heal loop 26 Nov 13:40 (run 2026-11-26_125954_ETM-8042, stms-fe 99817c2; Xray not touched)
| Test | Cause | Evidence | Fix (not applied) |
|---|---|---|---|
| 8837 Manpower + Equipment Mob Plan | script | Mob Plan Export has no menu, it downloads .xlsx directly (healer live; same as etm7879 / equipmentMobPlanExport.helpers.ts). These two never passed in a recorded run. | partial.spec.ts:119 drop `else getByText(/Excel/).click()`; the Export click + `dl` already does it (structure change, guard refuses, edit by hand) |
| 8842 | data | Report "Plan Scenario Ext" ends 23 Feb and is frozen (an earlier run extended and froze, delete step did not undo). No Freeze button. | re-run tests/fe/setup/setupEtm8042ExtReport.spec.ts (card-owned), optional data guard step |
| 8831 | data | trace: PUT /shutdown-events -> 500 `SHUTDOWN_EVENT_PLANNED_OVERLAP` for 01-15 Mar 2026 (another ART event uses it); restore then fails because nothing changed | pick a free NEWP range; restore only if step 4 saved |
| 8839 | env / slow | passed 24 Nov 22:22; today retry0 got past Optimization and timed out at 420 s in step 6, retry1 drawer did not open (likely optimization still running). Not shown as an app change. | re-run once alone (auto-next env rule); raise test timeout if slow again |
| 8832 | flaky | passed on retry (Create Success toast) | none |

### Re-runs after the fixes (26 Nov 14:00-14:15, user "แก้แล้วรันใหม่", delete D-1 "ลบทั้งหมด"; Xray not touched)
- 8842: setup setupEtm8042ExtReport re-made the Plan Scenario Ext Daily Report (D-1 done, run 141047); 8842 **passed** (run 141135).
- 8831: 01-15 Mar 2028 also overlapped (event "No NO No"); range now 23-28 Feb 2026 (free gap on ART, DB read). Run 141255 failed at step 1: Plan A badge was 28 Feb 2026 12:30 (changed by someone else before the run, same service account); restore put Plan A back to 15-25 Feb. Run 141451 **passed**. Restore now only Saves when the event changed.
- 8837 Mob Plan x2: Export now downloads (script fixed), but the Manpower and Equipment Mob Plan .xlsx have NO `Ramp Down Date` / `Ramp Up Date` labels and no metadata block (run 140002). Xray 8837 PASSED was proven on Shutdown Logic only. Open: TC scope (Mob Plan should not be in 8837) or app gap -> BA/user question, not a script fix.
- 8839: timed out again at 420 s (run 140041); passed 24 Nov 22:22. Slow Optimization on QA; not retried again today.
- Spec changes not committed: partial.spec.ts (8837 Excel branch), spec.ts (8831 range + restore guard).
- 8837 Mob Plan re-proof (14:40, user "พิสูจน์ซ้ำเลย"): Plan "QA ETM-8042 8836" got its Manpower and Equipment Mob Plans with one row "QA 8042 8837" each (left in place). Both .xlsx have no Ramp Down/Up labels and no Start/End Event Date either (manual-8837-mobplan/). ETM-6396 / ETM-7315 define no metadata row in the sheet, so AC 8.3/8.4 is unclear: BA Q15 written. Xray 8837 is PASSED but was proven on Shutdown Logic only: status change waits for the user.
- 14:50 user "คง PASSED รอ BA": Xray 8837 stays PASSED until BA answers Q15. If BA says the labels must show -> defect + 8837 FAILED (ask user first).
- Q15 answered (QA lead, user main chat 26 Nov, relayed): Mob Plan Excel does NOT show Ramp Down/Up Date. No defect, 8837 stays PASSED. Spec 8837 Mob Plan variants changed to download + no old labels.
- 16:55 8837 re-run after Q15 (run 165517): Manpower + Equipment Mob Plan **passed**; Shutdown Logic failed only because the Plan A Logic showed "Optimization Complete" (the slow 8839 optimization from 14:00 finished) and Export was disabled: data state, not app. Not re-run again today. Spec commit f4a47c7 (ep-etm-fe-qa, wip/sprint26-specs).

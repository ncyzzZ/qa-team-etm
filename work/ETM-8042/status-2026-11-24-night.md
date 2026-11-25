# ETM-8042 status, 24 Nov 2026 night (lead side session)

Runs 21:53-22:22 (run-card, QA). No Xray push, no Jira write, no commit.

| Test | Result | Note |
|---|---|---|
| 8839 | PASSED (run 2026-11-24_222227) | Script fixed: Total Weight 0% on QA -> set Minimize Duration 100% (test data); click Optimize again until the drawer opens; close the "Optimization Complete" dialog before View Detail. Nothing saved. |
| 8848 | PASSED (run 2026-11-24_220320) | |
| 8851 | FAILED | Paste `31 Feb 2026 08:00` into End: End keeps `25 Feb 2026 18:00`, not cleared (BA Q11 / AC 1.2: clear that part, Save disabled). Re-proved by hand (manual-8851-recheck/): paste or type an invalid date in Start or End -> the picker puts back the previous value, not cleared. BA Q11 / AC 1.2 say cleared. Not proven that the app ever cleared it (the 20 Nov script run of 8851 failed too). Pictures show only the end state, no picture of the pasted value before Tab: add one before a defect. Defect candidate, waits for the user. |
| 8834 | skipped (partial) | Network cut by script; text "Network Error No internet connection..." noted, not asserted. Needs a person to judge. |
| 8847 | skipped (partial) | JO: no three-dot menu, no Create Plan, Edit Plan does not open - noted, not asserted (expected JO screen unknown). |
| 8836 | skipped (not proven) | Plan A already has a Logic. User: new QA Plan instead of a delete -> asked, user said "รอก่อน". Steps in manual-steps-8836-newplan.md. |
| 8842 | FAILED | Delete-extended-days button (GUESS locator) not on screen. Ext Daily Report now has extra extended days from this run (x2, retry). Clean up by hand + tell where Delete is. |

Skipped on purpose (defect / data decisions): 8833 (Dev), 8840 (needs Plan B Active), 8846 (Excel defect candidate), 8849 (ETM-9221), 8838 (manual, precondition).
Evidence of the 8839 drawer check: manual-check-8839-drawer/.

## 25 Nov (manual-runner, awaiting confirmation)
- 8838 (manual-8838/): steps 1-4, 9 pass; 5-8 needs-human (Plan A Daily Report has no frozen day, Export disabled; nothing frozen). Plan A put back to 15-25 Feb. Note: Logic PDF grid padded to 28 Feb (whole weeks) - for the user to judge.
- 8836 (manual-8836-newplan/): new card-owned Plan "QA ETM-8042 8836" (Inactive, id 384db0ce-b08c-419e-8aec-b83b62baca23, Logic 81460f63-12e8-47c5-8a10-87553b0a7d39). Create Logic -> Start Date 15 Feb 2026 (Plan Ramp Down, not 08 Feb) = pass. Ramp Up line not drawn on an empty Logic (timeline ends 15 Feb 19:00): needs-human; the lines are already proven on Plan A in run 2026-11-24_215348 (8836 steps 2-10 passed there).

## 25 Nov Xray push (user: "push ผล 8839 กับ 8848 เข้า Xray")
- ETM-8873: 8839 PASSED (6 pictures, xray-evidence-8839/), 8848 PASSED (10 pictures, xray-evidence-8848/). Read back OK.
- Found: ETM-8836 is PASSED in Xray (pushed before), but its latest run result is skipped (not proven, step 1). Rule "skipped is never PASSED": ask the user before changing it. The 25 Nov manual run on the new Plan proved step 1 (awaiting confirmation).
- 25 Nov: ETM-8836 set back to TO DO in ETM-8873 (user: "เปลี่ยนเป็น TO DO"). Read back OK.
- 25 Nov: 8840 run 2026-11-25_103010 (event QA S26 Ramp, card-owned): steps 1-5 ok (Gantt 15..25 Feb), step 6 fails: last execution day needs every day frozen (step 5 is done by a person). Plan B was not touched.
- 25 Nov freeze attempt (freeze-planA-2026-11-25/): Freeze on the FIRST day 14 Feb of the Plan A Daily Report (0d5064c9) already shows "Extend Daily Report"; Cancel pressed, nothing frozen. stms-fe daily-report-gantt freezeConfirmCaseFor: Extend shows only when the selected day >= the report's event range end and a task is < 100%. So this report's range ends on/before 14 Feb although the Gantt shows 15-25 Feb and the snapshot should end 25 Feb. Report last updated 20 Nov (maybe made while the worklist had no work, F-7). Possible defect or old data: needs the user. 8840 and 8838 steps 5-8 blocked on it.
- 25 Nov new Plan "QA ETM-8042 8836": script made 1 work (1 day) + a NEW Daily Report (9eb382d9). First Execution Date 14 Feb, Gantt 15-25 Feb. Freeze on day 1 (14 Feb) again shows "Extend Daily Report" (Cancel, nothing frozen; freeze-newplan-2026-11-25/). So it is not old data: the report's period end (FE getEventRange().end from BE) is on/before 14 Feb = the last task end, not the snapshot Ramp Up 25 Feb (AC 8.2: last execution day = snapshot Ramp Up + extended days). Same root as ETM-9221 (S-Curve ends on the last task end)? Defect decision for the user: 8840 + 8838 steps 5-8 blocked. Spec change kept: 8840 now runs on P8840 = "QA ETM-8042 8836" (ETM8042_PLAN_8840), step 1 adds a work first.
- 25 Nov: comment 600433 added on ETM-9221 (Deployed to QA) with the Extend-on-day-1 finding + 2 embedded pictures (user: "เพิ่มใน 9221").

- 2026-11-25 13:24: ETM-9221 comment 600492 added, @mentions the assignee (thanawich klongsard), points to comment 600433 and the 8840/8838 block.

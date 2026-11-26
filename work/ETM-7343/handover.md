# ETM-7343 handover (written 24 Nov 2026, for a new chat)

Card: ETM-7343 Daily Report, Actual (%) font color from Plan (%). Story status on 23 Nov: In Testing. BA answered all questions on 18 Nov (see `.claude/team/work/ETM-7343/story.md`). Test Execution ETM-8703 (env QA), Test Plan ETM-8636.

## State
- Draft v2: `.claude/team/work/ETM-7343/draft-tc.md` (18 cases, G3 passes). TC-002 and TC-003 were reworded on 23 Nov for the 2 real roles (TM, JO): TC-002 = Job Owner on an Active plan; TC-003 = Job Owner on a plan that is NOT Active (heading changed to "Verify a Job Owner cannot see the Daily Report table of a Plan that is not Active (NEG)").
- Xray: 18 Tests (ETM-8676..8702 = TC-001..015, ETM-8724..8726 = TC-016..018), descriptions rewritten to the template. Xray still holds the OLD text of TC-002 (ETM-8678) and TC-003 (ETM-8681): `node tools/qa-check.mjs diff ETM-7343 work/ETM-7343/xray-readback.json` fails on TC-003 until Xray is updated (needs the user's yes).
- Xray results in ETM-8703 when last read (23 Nov): PASSED 7 = ETM-8676, 8683, 8685, 8689, 8698, 8701 (pushed by us) and ETM-8702 (set by someone else); FAILED 1 = ETM-8726 (TC-018, Total row of the PDF Progress Summary, light blue; defect ETM-8891 already exists, In Progress); TO DO 10. Re-read it before acting (`xray_get_execution_tests ETM-8703`).
- Scripts (PW_REPO = ep-etm-fe-qa): `tests/fe/e2e/dailyReport/etm7343/` (main, permission, security specs), `pages/dailyReportPage/actualColorPage.ts`, `actualColor.helpers.ts`. Not committed. `appConfig/config.ts` has one uncommitted line: `WAIT_FOR_LAYOUT_MFE` reads env `PW_LAYOUT_TIMEOUT` (default 60000).
- Test data (card owns it): Event "QA ETM-7343" (id aed0546c-1400-456a-9527-1903ba68bab8, 07-19 Jul 2026, created by hand by the user), Plan "QA ETM-7343 Colors" (id aff23820-..., created by hand, ramp 09 Jul 06:00 - 13 Jul 18:00), Daily Report fd22be61-... (24 rows, made by `tests/fe/setup/setupEtm7343Report.spec.ts`). `reset --apply` was committed on 23 Nov ~16:59: `node scripts/seed/card-data.cjs ETM-7343 check` says READY; `output/seed/ETM-7343.json` has the new ids. Data file: `scripts/seed/cards/ETM-7343.data.cjs`; plan: `.claude/team/work/ETM-7343/test-data-plan.md`.
- LEFTOVER on QA: an old Plan "QA ETM-7343 Colors" (id 8839b1c5-faee-4988-b96a-c12a0403bffb) on the SHARED event ART PSD (id 6580f57b-4bc6-43d2-a4c3-a7b20952f851), made by the first setup attempt (Duplicate of "Plan ART For PSD"), with a Daily Report and DB-seeded values. Delete it through the UI (Delete Plan) when the user says so; our tools cannot delete.

## Still to do (in order)
1. Run the main spec on the new data (the run of 23 Nov 16:59 was cut off, no result recorded): `PW_LAYOUT_TIMEOUT=120000 JOB_OWNER_USER= JOB_OWNER_PASS= node tools/run-card.mjs ETM-7343 tests/fe/e2e/dailyReport/etm7343/verifyDailyReportActualColor.spec.ts -g "ETM-7343" --workers 1` (needs the user's go-ahead, VPN). The last recorded run (13:10) used the old data.
2. Run the Job Owner tests separately (TC-002 ETM-8678, TC-003 ETM-8681, Security S1/S2) with the JO credentials in `.env`; JO login is often slow (35-120+ s).
3. Phase 7 for each failure: ask script bug / wrong test wording / real app bug. ETM-8700 (TC-013): the user said "wrong test" then "let me check first": undecided. Known fact from stms-fe: `>` only works from a frozen day and the page opens on the first unfrozen day.
4. Update Xray (user approval first): TC-002/003 summary + description to match the draft; ETM-8697/8699 and any new passes via `xray_import_results` (push guard blocks skipped ones; a skipped test is never PASSED).
5. ETM-8726 FAILED: defect ETM-8891 already exists (no new defect needed).
6. Cannot be done: TC-016 (ETM-8724, empty value: DB columns NOT NULL). TC-015/018 (PDF) are manual. Labels (POS/NEG/Exotic) of the 18 Tests read back empty: ask the user if expected.
7. Phase 8 closeout (push results, resolve linked Tests, finish the Execution, move the Story): only on the user's "ปิดงานได้เลย".

## Facts to remember
- Only 2 roles: TM (View All, does everything) and JO (View Active, sees Active plans only). Only one Plan can be Active per event; never turn a plan on in a shared event ("Change Active Plan" would switch off the other plan and its items).
- QA is slow and unstable (page opens > 120 s, login 35-120+ s, JS chunk 404, one DNS drop): such failures are environment, not locator bugs; do not run the heal loop on them.
- In the Daily Report grid Enter commits an Actual (%) edit and opens the editor of the next row (store value is the proof); an Actual cannot go below the row's `minPercent` (previous day's actual); Plan (%) is locked.
- The QA event overlap rule rejected 29 Oct - 30 Nov and 14-26 Oct for an event holding all 4 ART equipment; 07-19 Jul 2026 was accepted.
- ETM-8007's assignee was changed from Dechathon to the user by the logger (skill rule); its description lists 18 cases.

## Update 24 Nov 2026 evening (session ETM-7343)
- Xray ETM-8703: ETM-8698 set back to TO DO (was PASSED, latest run skipped). Live now: PASSED 8676, 8683, 8685, 8689, 8696, 8701, 8702, 8726; rest TO DO. 8702/8726 were set by someone else (manual PDF); 8726 step defect link to ETM-8891 was dropped by an import (steps all PASSED).
- ETM-8891 retest was already done 11:09 (comment + image, ETM-8912 Done, Ready for UAT). Nothing left.
- Card data reset --apply twice (dry run showed 0 changes; READY).
- JO run 2026-11-24_220243: 8681 PASSED, Security S1/S2 PASSED, 8678 FAILED: Job Owner gets "Access Denied" on the card's own Event (its Plan is Active, check READY). Not a locator: heal-proposals row 1 (needs-live) is NOT healed. Asked BA as Q5 in questions-for-BA.md (must JO be a member of the Event?). Defect decision is the user's.
- Main run 2026-11-24_220453: 6 passed, same 8 skipped (8687, 8691, 8697, 8698, 8699, 8700, 8724, 8725), all "precondition: no fitting row" in the data. Fresh data does not help: the data plan has no rows of those shapes. 8687 note: Plan (%) of "For Test Electrical 1" changed 20% -> 100% after typing Actual: check whether that is expected before any defect. Next: redesign the data plan (scripts/seed/cards/ETM-7343.data.cjs) for these shapes, UI-reachable only; 8724 stays impossible (NOT NULL).

## Update 25 Nov 2026 (session ETM-7343): real Plan (%) data, plan "QA ETM-7343 Ramp"
- Found: the BE calculates Plan (%) and the page re-reads it after an Actual is typed. The seeded Plans of plan "main" (1, 33.4, 50 on one-day 12 h tasks whose real Plan is only 0 or 100) were not UI-reachable. Formula proven on 2 rows of "QA 8392 Snap A" (exact): Plan(D) = (D 22:00 Bangkok - task start) / (task end - task start), wall clock, 0..100.
- Built through the UI (setup spec, SETUP_PLAN=ramp) in the card's own Event: Plan "QA ETM-7343 Ramp" (NOT Active; Active stays "QA ETM-7343 Colors"), 7 Works with multi-day breakdowns, Shutdown Logic, Daily Report bfd08ff7-5ac6-4277-853b-79cbd070db19. Data file: plans.ramp + dailyReports.ramp (Plan = formula on the scheduler's real task times; Actuals typeable). Dates: 08 Jul frozen, 09 Jul frozen, 10 Jul open.
- Code changed (not committed, PW_REPO): scripts/seed/cards/ETM-7343.data.cjs and .import.cjs (duration per breakdown), tests/fe/setup/setupEtm7343Report.spec.ts (SETUP_PLAN, never turns a plan with active:false Active), pages/dailyReportPage/actualColorPage.ts (ETM7343_REPORT=ramp, reportId()), spec 8725 (stored decimal read from the DB for the open date; steps 2/4 checks were the wrong way round, fixed).
- Run on ramp: ETM7343_REPORT=ramp PW_LAYOUT_TIMEOUT=180000 JOB_OWNER_USER= JOB_OWNER_PASS= node tools/run-card.mjs ETM-7343 tests/fe/e2e/dailyReport/etm7343/verifyDailyReportActualColor.spec.ts -g "ETM-7343" --workers 1
- Results (runs 2026-11-25_111606 + 113452): PASSED 8676, 8683, 8685, 8689, 8696, 8697, 8698, 8699, 8701, 8725 (10, on real data). Skipped: 8687 (steps 2-3 pass; step 4 0/0 cannot be shown: a task with Plan 0 has not started and is not on screen that day), 8691 (no task gives exact Plan 50 or 1; stand-in pairs 49/48 etc. pass), 8724 (NOT NULL). FAILED 8700: after quick > then <, the ASSET row shows the 2nd date's numbers (50/54) instead of the 1st (19/10): possible app bug = exactly what TC-013 checks; user decides (defect or test). Page-title timeouts on QA (120-180 s) were environment, not healed.
- Not done: Xray push (needs the push-plan question), 8678 waits on BA Q5, 8700 decision, 8687/8691 wording decision (accept "not reachable" or change the TC).
- 8700 (TC-013): lead's verdict 25 Nov "test ผิด". The quick `<` click is ignored while the 2nd date loads, so the page may rightly end on either date. Spec step 2 now checks: the whole table equals ONE date's numbers (no mix) and the font color follows the numbers shown. PASSED on ramp (run after 11:35). Xray ETM-8700 step 2 still says "the table shows the first date": update its wording (Xray write, needs the user's yes).
- Now: PASSED 11 of 14 on real data (8676, 8683, 8685, 8689, 8696, 8697, 8698, 8699, 8700, 8701, 8725); skipped 8687, 8691, 8724 (data not reachable from UI); JO: 8681, S1, S2 passed, 8678 waits on BA Q5.

## 25 Nov: Xray push
- Pushed PASSED with evidence: 8681, 8697, 8698, 8699, 8700, 8725. ETM-8703 now 14 PASSED, 4 TO DO (8678 BA Q5; 8687/8691/8724 data not reachable from UI).
- ETM-8700 steps 2-3 reworded (one whole date, no mix; > again only if on first date). Old text: xray-backup-8700-steps-before-fix.json.

## 25 Nov: 8678 solved
- Cause: the Daily Report row switch of the Plan was Inactive (JO needs Plan Active + Daily Report row Active). Setup spec has a new step that turns it Active via the UI. 8678 PASSED as JO. Xray 8678 still TO DO: push waits for the user.

## 25 Nov 2026 late: the last 3 TO DO (session etm-7343 clear)
Xray ETM-8703 live: 15 PASSED, TO DO = ETM-8687, ETM-8691, ETM-8724. All 3 skipped in run-results.json (never PASSED).
- ETM-8724 (TC-016, empty Plan/Actual): BLOCKER = not applicable by BA (24 Nov, DB columns NOT NULL). Stays TO DO; the user decides whether to remove it from ETM-8703 (Jira write) or leave it.
- ETM-8691 (TC-008 edge pairs): pairs 0/0, 1/0, 0/1 are NOT reachable from the UI (a task is on screen only once started, so Plan 0 is never shown; Plan 1 needs a task of 1000+ h). Pairs 50/49, 50/50, 50/51 CAN be made: the colour rule uses the shown numbers (8725), and a Day-shift task of 41 h starting 09 Jul 07:00 ends 12 Jul ~13:30 (scheduler: 07:00-11:00, 1.5 h break, then to 22:00; read from Half A/B/C) -> Plan on 10 Jul = 39/78.5 = 49.7, shown 50. Pairs 100/99, 100/100 exist (Ramp Mixed#1 on 10 Jul, minPercent 40).
- ETM-8687 (TC-006): steps 2-3 pass (Half A 49/49); step 4 (0/0 row) not reachable, same reason.
- Proposal (asked on the board, job ETM-7343): add Work "Ramp Fifty" (41 h, plan ramp, card's own Event, plan NOT Active) through setup, reword 8691 without 0/0, 1/0, 0/1 and 8687 without step 4-5 (Xray write, backup first), re-run, push PASSED. Waits for the user's yes (setup and Xray writes are always asked).

## 25 Nov evening: lead chose "เพิ่มงาน 41h + แก้ TC"
- Xray reworded (backup: xray-backup-8687-8691-before-fix.json): ETM-8687 steps 4-5 (0/0) removed, summary without "including 0% and 0%", description updated; ETM-8691 pairs 0/0, 1/0, 0/1 removed from steps 1 and 3 data and from the description. Spec updated the same way (PW_REPO verifyDailyReportActualColor.spec.ts).
- Plan "QA ETM-7343 Fifty" (41 h + 24 h) built by setup: scheduler ended the 41 h task on 12 Jul 12:00 (wall 77 h), Plan on 10 Jul = 50.6, shown 51: NOT usable, kept (card's Event, not Active, no seed).
- Plan "QA ETM-7343 Fifty 65h" built by setup (SETUP_PLAN=fifty65): Fifty Long 1 = 09 Jul 07:00 - 14 Jul 12:00 (wall 125 h) -> Plan on 11 Jul = 50.4, shown 50; Fifty Full B 1 ends 10 Jul 22:00 -> Plan 100. Data file: plans.fifty65 + dailyReports.fifty65 (08-10 Jul frozen, 11 Jul open; Actuals Long 30 min 10, Full B 60 min 40).
- `reset --apply` for report fifty65 (24 progress rows, 4 freeze rows; other reports 0 changes) was blocked by the permission check: asked on the board. After yes: reset --apply, then run 8691 with ETM7343_REPORT=fifty65 and 8687 with ETM7343_REPORT=ramp.
- ETM-8724: stays TO DO, BLOCKER = N/A by BA (Actual/Plan NOT NULL); remove from ETM-8703 only on the user's yes.
- 25 Nov 19:30: reset --apply (user "apply ได้"), READY. ETM-8687 PASSED on ramp (run 2026-11-25_193022), ETM-8691 PASSED on fifty65 (run 2026-11-25_193112, all 5 exact pairs: 50/49 red, 50/50 black, 50/51 green, 100/99 red, 100/100 black). Push of these 2 asked on the board (gate push). ETM-8724 BLOCKER: N/A by BA, stays TO DO.
- 25 Nov ~19:40: pushed (user "push ได้") ETM-8687 and ETM-8691 PASSED with evidence (work/ETM-7343/xray-evidence-push-20261125/). Read back ETM-8703: 17 PASSED, 1 TO DO.
- LEFT: ETM-8724 TO DO, named BLOCKER = not applicable by BA 24 Nov (Plan/Actual columns NOT NULL, an empty saved value cannot exist). Next only on the user's word: remove it from ETM-8703, or leave it TO DO. Phase 8 closeout only on "ปิดงานได้เลย".
- Unused card data on QA: plan "QA ETM-7343 Fifty" (card's own Event, not Active). Code changes in PW_REPO not committed (data file, spec).

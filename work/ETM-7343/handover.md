# ETM-7343 handover (written 24 Nov 2026, for a new chat)

Card: ETM-7343 Daily Report, Actual (%) font color from Plan (%). Story status on 23 Nov: In Testing. BA answered all questions on 18 Nov (see `.claude/team/work/ETM-7343/story.md`). Test Execution ETM-8703 (env QA), Test Plan ETM-8636.

## State
- Draft v2: `.claude/team/work/ETM-7343/draft-tc.md` (18 cases, G3 passes). TC-002 and TC-003 were reworded on 23 Nov for the 2 real roles (TM, JO): TC-002 = Job Owner on an Active plan; TC-003 = Job Owner on a plan that is NOT Active (heading changed to "Verify a Job Owner cannot see the Daily Report table of a Plan that is not Active (NEG)").
- Xray: 18 Tests (ETM-8676..8702 = TC-001..015, ETM-8724..8726 = TC-016..018), descriptions rewritten to the template. Xray still holds the OLD text of TC-002 (ETM-8678) and TC-003 (ETM-8681): `node tools/qa-check.mjs diff ETM-7343 work/ETM-7343/xray-readback.json` fails on TC-003 until Xray is updated (needs the user's yes).
- Xray results in ETM-8703 when last read (23 Nov): PASSED 7 = ETM-8676, 8683, 8685, 8689, 8698, 8701 (pushed by us) and ETM-8702 (set by someone else); FAILED 1 = ETM-8726 (TC-018, Total row of the PDF Progress Summary; set by someone else, reason unknown); TO DO 10. Re-read it before acting (`xray_get_execution_tests ETM-8703`).
- Scripts (PW_REPO = ep-etm-fe-qa): `tests/fe/e2e/dailyReport/etm7343/` (main, permission, security specs), `pages/dailyReportPage/actualColorPage.ts`, `actualColor.helpers.ts`. Not committed. `appConfig/config.ts` has one uncommitted line: `WAIT_FOR_LAYOUT_MFE` reads env `PW_LAYOUT_TIMEOUT` (default 60000).
- Test data (card owns it): Event "QA ETM-7343" (id aed0546c-1400-456a-9527-1903ba68bab8, 07-19 Jul 2026, created by hand by the user), Plan "QA ETM-7343 Colors" (id aff23820-..., created by hand, ramp 09 Jul 06:00 - 13 Jul 18:00), Daily Report fd22be61-... (24 rows, made by `tests/fe/setup/setupEtm7343Report.spec.ts`). `reset --apply` was committed on 23 Nov ~16:59: `node scripts/seed/card-data.cjs ETM-7343 check` says READY; `output/seed/ETM-7343.json` has the new ids. Data file: `scripts/seed/cards/ETM-7343.data.cjs`; plan: `.claude/team/work/ETM-7343/test-data-plan.md`.
- LEFTOVER on QA: an old Plan "QA ETM-7343 Colors" (id 8839b1c5-faee-4988-b96a-c12a0403bffb) on the SHARED event ART PSD (id 6580f57b-4bc6-43d2-a4c3-a7b20952f851), made by the first setup attempt (Duplicate of "Plan ART For PSD"), with a Daily Report and DB-seeded values. Delete it through the UI (Delete Plan) when the user says so; our tools cannot delete.

## Still to do (in order)
1. Run the main spec on the new data (the run of 23 Nov 16:59 was cut off, no result recorded): `PW_LAYOUT_TIMEOUT=120000 JOB_OWNER_USER= JOB_OWNER_PASS= node tools/run-card.mjs ETM-7343 tests/fe/e2e/dailyReport/etm7343/verifyDailyReportActualColor.spec.ts -g "ETM-7343" --workers 1` (needs the user's go-ahead, VPN). The last recorded run (13:10) used the old data.
2. Run the Job Owner tests separately (TC-002 ETM-8678, TC-003 ETM-8681, Security S1/S2) with the JO credentials in `.env`; JO login is often slow (35-120+ s).
3. Phase 7 for each failure: ask script bug / wrong test wording / real app bug. ETM-8700 (TC-013): the user said "wrong test" then "let me check first": undecided. Known fact from stms-fe: `>` only works from a frozen day and the page opens on the first unfrozen day.
4. Update Xray (user approval first): TC-002/003 summary + description to match the draft; ETM-8697/8699 and any new passes via `xray_import_results` (push guard blocks skipped ones; a skipped test is never PASSED).
5. ETM-8726 FAILED (someone else): find out why; a defect only with the user's explicit go-ahead (`log-defect-jira-etm`).
6. Cannot be done: TC-016 (ETM-8724, empty value: DB columns NOT NULL). TC-015/018 (PDF) are manual. Labels (POS/NEG/Exotic) of the 18 Tests read back empty: ask the user if expected.
7. Phase 8 closeout (push results, resolve linked Tests, finish the Execution, move the Story): only on the user's "ปิดงานได้เลย".

## Facts to remember
- Only 2 roles: TM (View All, does everything) and JO (View Active, sees Active plans only). Only one Plan can be Active per event; never turn a plan on in a shared event ("Change Active Plan" would switch off the other plan and its items).
- QA is slow and unstable (page opens > 120 s, login 35-120+ s, JS chunk 404, one DNS drop): such failures are environment, not locator bugs; do not run the heal loop on them.
- In the Daily Report grid Enter commits an Actual (%) edit and opens the editor of the next row (store value is the proof); an Actual cannot go below the row's `minPercent` (previous day's actual); Plan (%) is locked.
- The QA event overlap rule rejected 29 Oct - 30 Nov and 14-26 Oct for an event holding all 4 ART equipment; 07-19 Jul 2026 was accepted.
- ETM-8007's assignee was changed from Dechathon to the user by the logger (skill rule); its description lists 18 cases.

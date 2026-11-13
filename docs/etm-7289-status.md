# ETM-7289 – SIMOP On-Demand Button – status (20 Oct 2026, update 4)

Story: ETM-7289 (Sprint 24). Test as Turnaround Manager only (Bkk41).

## Xray (done)
- 19 Tests ETM-7542..7559 + ETM-7564. Test Plan ETM-7560. Test Execution ETM-7561 (env QA). Subtask ETM-7398 filled.
- 20 Oct: ETM-7542, 7550, 7551, 7552 set PASSED in ETM-7561 with evidence (full run, 4 pass / 15 fail in report evidence-report-2026-10-20_0317).
- 20 Oct: Xray steps edited to match new script (rule: SIMOP checks unsaved state, no Save before first SIMOP; Save afterwards stores result). Source: STMS/Claude outputs/ETM-7289_xray-step-changes_2026-10-20.md
  * Removed Save step(s) before first SIMOP in ETM-7543..7555 (13 Tests). Step counts now: 7543=24, 7544=17, 7545=32, 7546=28, 7547=29, 7548=25, 7549=16, 7550=15, 7551=25, 7552=17, 7553=15, 7554=17, 7555=25.
  * ETM-7555 step 15 (was Save) is now "Click the SIMOP button -> both bars red" so "Edit SIMOP" menu exists (it only shows on a task that already has conflict alerts).
  * Rewrote step 15+ of ETM-7556 (17 steps), 7558 (25), 7559 (25), 7564 (25).
  * ETM-7542, 7557 not changed. Test descriptions have no Save-before-SIMOP wording.
- Edit method: xray_graphql removeTestStep / updateTestStep / addTestStep (addTestStep only appends at the end).
- Parked by Chunin (not done yet): ETM-7544 step 18 "and a message shows" (app shows no message); ETM-7545..7547 "Edit SIMOP window opens" -> window title is "SIMOP".

## Playwright (stms-fe v1.24.1 locators verified)
Repo ep-etm-fe-qa, tests/fe/e2e/shutdownLogic/. Run: PLAYWRIGHT_JSON_OUTPUT_NAME=test-results/results.json npx playwright test verifyShutdownLogicSimop -g "ETM-xxxx" --workers=1 --reporter=list,json
- Claude does not run tests. After "รันเสร็จแล้ว" -> evidence report. Push to Xray only on her go.
- stms-fe read-only: never push.

## TC vs app mismatches
a) page load calls /systems/conflict/color; b) no success toast after SIMOP; c) Edit SIMOP menu only with conflict alerts; d) window title "SIMOP"; e) BE re-checks only new/changed pairs, writes nothing; Save persists.

## QA test data (moved here from skill etm-simop-rules, 20 Oct 2026)
- Plan "Shutdown Logic: Worklist Active": stms-qa.apps.pttep.com/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/366a32bb-d700-4e85-883f-f7cb5a1966f1/logics/637b05bf-5f12-44d1-89f2-d6005325918b
- ASSET rows 7-11 (TD6843B W0229 Breakdown 0001-0005) and 14-18 (Preparation for Power system..., Electrical Isolation and LOTO, Bus Bar Inspection and Test, ACB and Protection Device Inspection..., Electrical De-Isolation) and BS rows 68-72 (TD6843B W0400 Breakdown 0001-0005) all start at Event Start 18:00, so they overlap.
- Avoid rows 63-65 (other times) and 75-77 (row 77 is already red). Mix tasks across ASSET and BS when picking pairs.
- Many tasks have every Deck/X/Y value selected: steps must say "Set ... to only <value>" and the data must say to remove all old values first.
- Use a different Deck per TC within a platform so leftovers from one TC never conflict with the next.
- Deck options: Cooler, Upper, Lower, Weather, Main, Cellar, Mezzanine, Sub Cellar, Sea Deck, Flare Tip/Tower/Tripod/Bridge, SWGR, Control Building, CCR, Onshore, N/A; X 0-9, Y A-J (avoid N/A).
- Put the chosen task rows and Deck/X/Y in the Data column of the "pick tasks" step.

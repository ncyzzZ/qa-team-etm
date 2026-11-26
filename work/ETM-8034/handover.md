# ETM-8034 handover (2026-11-25 19:45)

Test Execution ETM-8875 (Test Plan ETM-8636). Xray now: 8 PASSED, 3 FAILED (8854, 8859, 8868), 8 TO DO.
Nothing pushed to Xray, nothing written to Jira in this session.

## Main blocker: FE regression since stms-fe 075acc98 (25 Nov 14:55)
Double-click No. (whole row) + right-click shows **Highlight Cell**, never **Highlight Row** (duplicate `name` column in `gantt.columns.leaves`, see `verdict-table.md` "Lead check").
Still there at 19:18: re-run of ETM-8856 (run `2026-11-25_191816_ETM-8034`) fails waiting for the `Highlight Row` menu item; 8856 passed at 13:26 on the old build.
Every Test that opens Highlight Row from a selected row is blocked by it. **Defect: ETM-10077** (already open, In Progress, assignee thanawich, created 25 Nov 17:00). User verdict 25 Nov 19:3x: 8861/8862/8865/8867/8871 = app (`verdicts.json`). No new defect logged (would be a duplicate; draft kept as `defect-draft-highlight-row-regression.md`).
Note: 8856 is PASSED in Xray but fails on today's build. Do not change that pushed status without asking.

## Per Test

| Test | Xray | Blocker / next step |
|---|---|---|
| ETM-8854 | FAILED | ETM-10077 (menu shows Highlight Cell). Passed 24 Nov. Re-run after the fix. |
| ETM-8859 | FAILED | Verdict = script (manual steps 15-20 passed, `manual-8859-step15-20/`). Script step 20 (reload after Undo/Redo + Save) to fix; re-run blocked by ETM-10077. |
| ETM-8860 | TO DO | Data: plan needs two Platforms and a Platform with two Work Headers (card-owned event "QA ETM-8034", `setupEtm8034.spec.ts`). Add after ETM-10077 is fixed, then run. |
| ETM-8861 | TO DO | ETM-10077 first. Then step 2 paste does not reach target row: known FE defect "SL-CP-38 / SL-QA-046 D4" (stms-fe RULES.md); needs a human to try Ctrl/Cmd+C/V once on Mac/Windows. |
| ETM-8862 | TO DO | ETM-10077 first. Step 8 toast: BA question `questions-for-BA-round5.en.md` Q1 (not sent yet). |
| ETM-8865 | TO DO | ETM-10077 first. Step 24: Undo of a Work Details edit drops highlight FFD7E7 on 3 cells (finding F-33). Likely defect, prove again on the fixed build before logging. |
| ETM-8867 | TO DO | ETM-10077 first. Step 8: No Color on the copied plan's Platform also clears the original's colour (row id `platform:ASSET#0`, Platform is event level). Likely defect, confirm before logging. |
| ETM-8868 | FAILED | Manual: 9 pass, 6 needs-human (`manual-run-8868/`): colour mix of red condition vs highlight (steps 4, 6, 11), steps 14-15 need a way to make a dependency conflict. Needs human. |
| ETM-8869 | TO DO | Manual: 3 pass, 5 needs-human (`manual-run-8869/`): hover / select / focus / disabled over a highlight. Needs human. |
| ETM-8870 | TO DO | Manual by hand (Export PDF), steps in `manual-by-hand-8870.md`. Needs human. |
| ETM-8871 | TO DO | ETM-10077 (run 185600). Was flaky before; re-run after the fix. |

## Next
1. Wait for ETM-10077 fix on QA.
2. After the dev fix (retest of ETM-10077 with it): `node tools/run-card.mjs ETM-8034 tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.spec.ts` (run-policy auto), then `verdicts.mjs table` + `push-plan.mjs`.
3. Send `questions-for-BA-round5.en.md` to BA.
4. A person does the manual parts of 8868 / 8869 / 8870 and the clipboard check of 8861.

## Update 25 Nov 22:30 (after ETM-10077 was fixed)
- ETM-10077: Retest Passed 22:02 (comment on the defect, sub-task ETM-10090), Ready for UAT. Xray 8854 PASSED.
- Run 211646 (other session): 8865 PASSED, 8871 PASSED, 8854 PASSED; 8861 fails (paste text does not reach target row), 8862 fails (no toast after Work Details Save = BA round5 Q1), 8867 fails (No Color on duplicated plan Platform clears original; draft `defect-draft-dup-plan-platform-colour.md`, not logged).
- Run 221445 (this session): 8856 flaky (histogram did not collapse on first try, passed on retry: not a clean pass); 8860 skipped (precondition data); 8859 passes steps 1-21 (old step 20 problem gone) and fails at step 22: the Change Text Color submenu from step 21 is already closed. Healer proposal: use `choose()` in steps 22 and 26. Guard refused it (flow change, not a locator), so it waits for the user's yes (board question).
- The old "app" verdicts of 8861/8862/8867 were for ETM-10077. Their current failures have other causes (see above), so `push-plan.mjs` must not mark them FAILED as "app bug" until each is decided again.
- Xray changes possible now: 8865 TO DO->PASSED, 8871 TO DO->PASSED (one push question, batch with 8859/8856 after their re-run).

## Update 25 Nov 22:40
- 8859 script fix applied (user yes in chat): steps 22/26 use `choose()`. Run `2026-11-25_223101_ETM-8034`: 8859 PASSED, 8856 PASSED (clean, no retry). Heal logged.
- Waiting for the user's yes to push to Xray ETM-8875: 8859 FAILED->PASSED, 8865 TO DO->PASSED, 8871 TO DO->PASSED (push-guard OK).
- Still open: 8860 (data precondition), 8861 (paste), 8862 (BA round5 Q1 toast), 8867 (draft defect dup-plan Platform colour), 8868/8869/8870 (manual, needs human).

## Update 25 Nov 22:50 - Xray pushed (user "push ได้" in chat)
ETM-8875 read back: 12 PASSED, 1 FAILED (8868), 6 TO DO. Pushed with run pictures: 8859 FAILED->PASSED (run 223101), 8865 and 8871 TO DO->PASSED (run 211646).
Left, each with its blocker:
| Test | Xray | Blocker |
|---|---|---|
| 8860 | TO DO | data: plan needs two Platforms and a Platform with two Work Headers (card-owned event "QA ETM-8034") |
| 8861 | TO DO | paste text does not reach target row (known FE "SL-CP-38 / D4"); needs a person to try Ctrl/Cmd+C/V once, then verdict |
| 8862 | TO DO | BA question round5 Q1 (toast after Work Details Save), `questions-for-BA-round5.en.md`, not sent yet |
| 8867 | TO DO | likely defect: No Color on duplicated plan's Platform clears the original; draft `defect-draft-dup-plan-platform-colour.md`, needs the user's yes to log |
| 8868 | FAILED | manual, needs human (6 steps) |
| 8869 | TO DO | manual, needs human (5 steps) |
| 8870 | TO DO | manual by hand (Export PDF) |
Spec change for 8859 (steps 22/26) is in ep-etm-fe-qa, not committed.

## Update 25 Nov 23:30 (peer asked: too many TO DO)
- 8856, 8859: done, PASSED in Xray. `push-plan.md` regenerated (the 22:27 copy was stale).
- "ETM-10077 awaiting-confirmation" in run-results is a defect key, not a Test of ETM-8875; its retest passed 22:02 (Jira comment). Not a TO DO.
- 8867: NOT an app defect as drafted. Step 8 `openPlan()` runs `clearLeftoverColours()` on the original plan and saves, so the script itself wiped the original's colours (checker: all colours gone, not only Platform). Fix proposed in `fix-8867-step8.md`; waits for the user's yes (board question). Draft `defect-draft-dup-plan-platform-colour.md` is not to be logged.
- 8860: blocked by data. The card event "QA ETM-8034" has one Work Header under ASSET; setup must add a Work with a second Work Header (setup + import change). Waits for the user's yes (same question).
- 8862: BA round5 Q1 (toast) to be sent; waits for the user's yes (same question).
- 8861: needs a person to try copy/paste once (D4 known FE issue), then verdict.
- 8868, 8869, 8870: manual, need a person (colour judgement, PDF).

## Update 25 Nov 23:45 - manual-runner on today's build (nothing saved)
- 8868 (`manual-run-8868-20261125b/`): 11/15 pass, 0 fail, needs a person: step 4 (red cell stays plain red next to FFFB8F, no longer mixed), step 6 (likely FAIL: on FFCCC6 the red cell is the same colour as the row, cannot be told apart), steps 14-15 (no on-screen way to make a dependency conflict).
- 8869 (`manual-run-8869-20261125b/`): 2/8 pass (5, 8), 0 fail, needs a person: steps 1-4, 7 (hover / selected / focus / read-only layers over FFFB8F: picture judgement; step 4 the Description cell stays selected+focused after clicking an empty area). Step 6: the local steps file said B9E0FF (old build value); the palette is BAE0FF (Figma, after ETM-10034). Fixed in `manual-steps-8868-8869.md`; with that, step 6 matches.
- 8870 (PDF) and 8861 (clipboard) still need a person.
- 23:34 the user answered "ยังก่อน" on the board to (1) 8867 script fix + re-run, (2) 8860 setup extension, (3) sending BA round5 Q1. All three on hold; nothing changed.

## Update 26 Nov 00:20 - user "ทำทั้ง 3" (chat)
1. 8867 script fixed: `openPlan(..., { keepColours: true })` in step 8 (rowColour.helpers.ts + spec), step 8 now also checks the original's Work and Work Breakdown before the Platform. Not committed.
   - Run 2026-11-25_235746 attempt 1: steps 1-7 pass, step 8 FAILS: original Platform lost FFCCC7 (F2F8FA) after No Color + Save on the copy's Platform, with no cleanup in between. So the app symptom is real (the earlier run also had the script wipe, which hid it).
   - Attempt 2 and run 2026-11-26_000654 (both attempts): step 5 fails, the copy does not get the colours (Work text 1677FF / Platform FFCCC7 missing in the copy).
   - Result is not stable: the Platform colour seems to be shared by plans of the same event (row id `platform:ASSET#0`, Platform is event level). Next: a person reproduces once by hand (Duplicate Plan, clear the copy's Platform, Save, open the original), then log from `defect-draft-dup-plan-platform-colour.md` (update Actual: only the Platform, and the copy sometimes gets no colours), evidence check again, user's yes.
2. BA round5 Q1 (toast, 8862) file sent to the user to forward to the BA (Q2 removed: ETM-10077 fixed).
3. 8860: NOT done. The Gantt rows of a Shutdown Logic are made when it is created (tables `gantt*` keyed by sdl_id), so a Work imported later into the card plan's worklist may not show up. Needs either a new card-owned Plan (setup change: 4 works, one with Work Header `MECH_CM` under ASSET, then Create Shutdown Logic) or a dev answer on worklist -> Shutdown Logic sync. Blocker: setup design, ask the user which way.

## Update 26 Nov 00:40 - 8860 (user "สร้างแผนใหม่"), stopped for the night
- New card plan made by setup (`ETM8034_SETUP_PLAN=tm npx playwright test tests/fe/setup/setupEtm8034.spec.ts`): "QA ETM-8034 Row Colour TM" in event "QA ETM-8034", not Active, 4 Works (8034-T3 has Work Header MECH_CM under ASSET), Shutdown Logic made. `.env` ETM8034_TM_PATH set; config `ETM8034_TM_PATH`; 8860 opens it; import rows take `header` (default Mechanical (PM)). Not committed.
- 8860 now runs (no skip). Steps 1-19 pass when step 6 selects Work A by double-click on No. (one click on a data cell no longer selects a row in this build). Step 20 (drag Work A below Work B) fails: the drag does not move the row. Healer (app source): row drag starts only on the No. cell; changing the drag start to the No. cell did NOT move the row either (run 2026-11-26_003240). Next: a person tries the drag once by hand on the TM plan; then fix `dragRowBelow` (maybe slower moves / hold).
- The two script edits for 8860 (step 6 double-click, drag start on No.) were tried and REVERTED (not approved; drag still fails). Kept: 8859 fix (approved), 8867 keepColours + extra step 8 checks (approved "ทำทั้ง 3").

## Update 26 Nov 09:35 - lead decisions applied (see ba-answers.md)
- 8862 step 8 script: no toast; modal closes and the row shows the new Priority. 8867 unchanged (keepColours + Work/WB/Platform checks of the original).
- Run 2026-11-26_092144: 8862 PASSED (21 steps), 8867 PASSED (precondition + 8 steps), both first attempt. The 25 Nov "original Platform lost FFCCC7" is not seen again; no defect (user's hand check agrees).
- Waiting for the user's yes: Xray ETM-8875 8862 TO DO->PASSED and 8867 TO DO->PASSED with run pictures; Xray ETM-8862 step 8 expected result text -> "The Work Details modal closes and the row shows the new value (no toast)".
- 09:45 user "ทำได้ทั้งหมด" (chat): Xray ETM-8862 step 8 expected result changed (backup `xray-steps-before-8862-step8-2026-11-26.json`), and ETM-8875 8862 + 8867 pushed PASSED with run pictures. Read back: 14 PASSED, 1 FAILED (8868), 4 TO DO (8860, 8861, 8869, 8870).

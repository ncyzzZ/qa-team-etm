# Retest plan: Defect ETM-9227 (Story ETM-8521)

Defect: paste (Ctrl+V) while a Gantt cell is in edit mode goes into the cell's text box; the grid paste does not run.
Xray: Test ETM-8741, Test Execution ETM-8773 (steps 1-2 PASSED, step 3 FAILED linked to ETM-9227, step 4 TO DO).
Spec rule: ETM-2615 AC 1.3 (paste in edit mode replaces the target range, including the edited cell); ETM-8521 AC 2 (paste works the same as before).
Found: diagnostic run 2026-11-24_211515, reproduced 2026-11-24_212055.

## Start the retest when
- ETM-9227 is moved to Ready for Retest / Resolved by Dev (assignee Suphakiat Kiatkunya), and the QA FE build is newer than main-BIPLUAIT.js.

## A. Automated (preferred)
Run policy: `RUN-POLICY: auto` (re-run of a test that ran before), no question needed.

```bash
node tools/run-policy.mjs ETM-8521 tests/fe/e2e/shutdownLogic/verifyShutdownLogicFasterPaste.spec.ts -g "ETM-8741"
```

```bash
node tools/run-card.mjs ETM-8521 tests/fe/e2e/shutdownLogic/verifyShutdownLogicFasterPaste.spec.ts -g "ETM-8741"
```

Pass = the edited row shows `Pump overhaul A`, the next row shows `Pump overhaul B`, the editor is closed.

## B. By hand (as a TM user, Turnaround Manager)
1. Log in to QA as TM and open the Shutdown Logic page:
   https://stms-qa.apps.pttep.com/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/6b5550e3-34c1-476d-b9f2-ded3d9f3a0a5/logics/d878739c-b7e0-4df7-921e-14543e944c1f
2. **Collapse the Manpower Resource histogram first** (hover the splitter, click `Hide histogram`). Do it again after every reload.
3. In Excel copy two cells of one column: `Pump overhaul A` / `Pump overhaul B`.
4. Double-click the Description cell of a Work Breakdown (Lv4) row: the cell opens in edit mode. Note the Description of this row and the next row.
5. Select all text in the cell and type `abc` (stay in the cell).
6. Press Ctrl+V.
7. Take a full-screen picture after step 4, 5 and 6 (before / after).

Expected (pass):
- The editor closes; the edited row shows `Pump overhaul A`, the next row shows `Pump overhaul B`.
- The editor text box does NOT show `abcPump overhaul A Pump overhaul B`.

Extra checks (regression, same session):
- Paste of one value in edit mode: only the edited cell changes.
- Paste in normal mode (cell selected, not editing) still works (ETM-8736 / ETM-8760 pass before).
- Ctrl+Z after the paste brings the old values back.
- Do not Save on shared data unless the row belongs to this card's data; otherwise reload to drop the change.

## After the retest (needs the user's yes each)
- Passed: comment "Retest: Passed" on ETM-9227 with the step pictures embedded (rule: retest evidence in the Defect itself); Xray ETM-8773 / ETM-8741 to PASSED only if the Playwright result is `passed` (never from skipped).
- Failed: comment "Retest: Failed" with new pictures and the build name, defect back to Dev.

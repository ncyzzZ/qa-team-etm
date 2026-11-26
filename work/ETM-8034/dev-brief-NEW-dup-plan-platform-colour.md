# Dev brief: NEW (Story ETM-8034) - Platform highlight is shared between a plan and its duplicate

## 1. What is wrong
After `Duplicate Plan`, removing the Platform row highlight in the new plan (No Color + Save) also removes the highlight of the Platform row in the original plan.

## 2. Where
- Page: Shutdown Logic (Gantt), environment QA, role Turnaround Manager.
- Event `NN TEST QA` (id 9885b03f-...), original plan `S26 Row Colour` (logic 7dec49e5-...), copy `QA Colour Copy` (a new logic id, new row ids).
- Collapse the Manpower Resource histogram first (`Hide histogram` on the splitter `data-testid="sl-splitter-horizontal"`), again after every reload.

## 3. Steps to reproduce
See the Defect steps 1-6: colour a Platform row `FFCCC7` in the original and save, Duplicate Plan, set the Platform row of the copy to `No Color` and save, open the original again.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Original plan, Platform row after editing the copy | default background `F2F8FA` | still `FFCCC7` |

## 5. Rule source
Xray Test ETM-8867 step 8; BA R3-3 / DEC-055 (Duplicate, ETM-2696, copies Highlight and Text Color into the new plan).

## 6. Hints for the fix (guess)
The copy gets new logic and row ids, yet the original Platform row changed. A guess: the Platform-level highlight may be stored on a record shared by both plans (per platform / per event), not per plan row, so a save in the copy overwrites it. Work and Work Breakdown colours were not checked.

## 7. How QA will retest
Re-run Playwright Test ETM-8867 (`tests/fe/e2e/shutdownLogic/verifyShutdownLogicRowColour.spec.ts`): step 8 must find the original Platform row still `FFCCC7`. Also check the Work and Work Breakdown colours of the original by hand.

## 8. Out of scope / do not change
Duplicate of a Work Breakdown row, Copy & Paste colour rules (DEC-055), the palette colours (ETM-10034).

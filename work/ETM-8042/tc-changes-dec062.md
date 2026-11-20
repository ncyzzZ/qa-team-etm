# ETM-8042: test changes for DEC-062 (AC 8.2 Extension, Jira edited 2026-11-20)

New AC 8.2 text (Jira): when the last execution day is frozen with tasks below 100% and the user extends, execution days are added after the last execution day. The Plan's Ramp Down/Up Date, the Daily Report's snapshot Ramp Down/Up Date and the Shutdown Event's Planned Date are **not** changed. Deleting extended days does not change them either. The last execution day and the end of the Planned S-Curve use the snapshot Ramp Up Date plus any extended days.

Checked every 8042 case and spec that mentions Extension or snapshot:

| Case | Spec test | Expects a moving line/date? | Change |
|---|---|---|---|
| TC-014 / ETM-8842 | `verifyPlanRampDownUp.partial.spec.ts` "ETM-8842" | YES: Plan End moves to the new last day, badge moves | **rewrite (below)** |
| TC-012 / ETM-8840 | "ETM-8840" | no (Plan edit does not change the report) | none |
| TC-013 / ETM-8841 | "ETM-8841" (18:00 rule on snapshot Ramp Down) | no | none |
| TC-010 / ETM-8838 | manual (PDF from snapshot) | no | none |
| TC-021 / ETM-8849 | "ETM-8849" (old Daily Report) | no | none (see the before-release decision) |
| draft-tc.md header note "Dev: the Extension updates Plan Ramp Up and snapshot both or neither" | - | old rule | remove the note |

## ETM-8842 (TC-014): rewrite, expected result was wrong (DEC-062)

Title: [FE][BE][MT] Verify Extend Daily Report adds days after the last execution day and does not change the Plan Ramp Down/Up Date, the snapshot or the event Planned Date, also after a second Extension and after deleting the extended days (POS/NEG)
Precondition: `Plan Scenario Ext` has `20 Feb 2026 18:00 - 22 Feb 2026 07:00`, its Daily Report is at its last execution day with a Work Breakdown task below 100%; event Planned Date `08 Feb 2026 08:00 - 22 Feb 2026 08:00`.
Priority: High
Trace: AC-8.2
1. Freeze the last execution day of the Daily Report. -> The confirmation `Extend Daily Report` appears with `Confirm` and `Cancel`.
2. Click `Cancel`. -> The confirmation closes and no day is added.
3. Freeze the last execution day again and click `Confirm`. -> One or more execution days are added after the old last execution day.
4. Read the last execution day. -> It is later than `22 Feb 2026`.
5. Open `Edit Plan` of `Plan Scenario Ext` and read the dates. -> They are still `20 Feb 2026 18:00 - 22 Feb 2026 07:00`.
6. Read the badge on the Plan Card. -> `Ramp Down/Up Date: 20 Feb 2026 18:00 - 22 Feb 2026 07:00`.
7. Open the Daily Report Gantt and look at the `Ramp Down` and `Ramp Up` lines. -> One `Ramp Down` line on the snapshot Ramp Down date and one `Ramp Up` line on `22 Feb 2026`; the added days are after the `Ramp Up` line.
8. Look at the end of the Planned S-Curve. -> It ends on the new last execution day (snapshot Ramp Up plus the added days).
9. Open Edit Shutdown Event and read the Planned Date. -> Still `08 Feb 2026 08:00 - 22 Feb 2026 08:00`.
10. Freeze the new last execution day and click `Confirm` (second Extension). -> More days are added after the last one.
11. Read the badge and the `Ramp Up` line again. -> Badge unchanged; still exactly one `Ramp Up` line on `22 Feb 2026`.
12. Delete the extended days. -> The extended days are removed.
13. Read the badge, `Edit Plan` and the `Ramp Down` / `Ramp Up` lines. -> All unchanged: `20 Feb 2026 18:00 - 22 Feb 2026 07:00`, one line each on the snapshot dates.

Automation: Partial. Script checks steps 1-7, 9-13 (DOM, Bryntum time ranges via `readLines`); step 8 (S-Curve end) by eye. Delete extended days: selector is a GUESS until the first headed run. Clean up: none needed (Plan dates never change); re-arming the report for the next run is a manual reset (see SETUP TODO).

Spec change (after you approve): rewrite test "ETM-8842" in `verifyPlanRampDownUp.partial.spec.ts` to these steps, assert `badge` / `pickerValue` / `readLines` equal the starting values instead of "later than", and drop the cleanup `editPlanDates(... PA ...)` (it wrote Plan A's dates onto the Ext plan).

## Decisions 2026-11-20 (user, chat)
- TC-014 / ETM-8842 rewrite approved. Spec rewritten (partial.spec.ts "ETM-8842"); runs only when `ETM8042_EXT_PLAN` is set (Daily Report of Plan Scenario Ext prepared at its last day).
- Old event: Mar S1 FSD SE 2027, plans `Mar S1 FSD SE 2027|MobPlan QA Empty|Eq-Del` (all made 9 Sep - 27 Oct 2026; 8042 first Deployed to QA 2026-11-18 13:29). ETM-8835 edits that event's Planned Date and restores it in `finally`.
- Before-release part dropped:
  - ETM-8837 (TC-009): no baseline cell format check; asserts labels, no old labels, Plan A values 15 Feb / 25 Feb 2026, not the Planned 08 Feb; Day1 = 15 Feb. (The spec expected Plan C March dates, but the paths are Plan A: fixed.)
  - ETM-8846 (TC-018): no baseline; the long Plan now gets its own Shutdown Logic (a Daily Report needs one) and the Excel is exported from it (was Plan A's Logic, which could never show 2029); asserts 15 Feb 2026 and 15 Feb 2029.
  - ETM-8849 (TC-021): no before-release record; opens a Daily Report made before 8042 (default `ETM8392_OLD_REPORT_PATH`, Export 5000, no snapshot) and checks First Execution Date / last execution day against that event's Planned Date (18:00 rule), and again after reload. The Plan-edit step was removed (it edited Plan A of another event, which proves nothing for the old report).
- Xray step text of ETM-8842, 8837, 8846, 8849 still has the old wording: updating Xray is a separate Jira write (ask first).

# ETM-8042 manual steps: ETM-8836 step 1 on a new QA-only Plan

Why: on Plan Scenario A the Shutdown Logic already exists, so "the Logic Start Date is set from the Plan Ramp Down at creation" was never proven. Deleting Plan A's Logic would affect others, so the user chose a new Plan (lead chat, 2026-11-24). Steps 2-10 of ETM-8836 already passed on Plan A in the 24 Nov run; only step 1 (+ the Start Date read) is done here.

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager.

## Data
- Event `ETM8042_EVENT_ID` (18bf0408-c725-4e84-b419-22e9a9eef29b) "QA S26 Ramp", Planned Date **08 Feb 2026 08:00 → 22 Feb 2026 08:00**.
- Planning tab: `/shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning`
- New Plan: name **QA ETM-8042 8836**, Ramp Down/Up Date **15 Feb 2026 09:00 → 25 Feb 2026 18:00** (picked in the picker, not typed). Leave it **Inactive** (never switch the Active toggle of any Plan).

## Before you start
- If a Plan named `QA ETM-8042 8836` already exists, do not create another: use it. If it already has a Shutdown Logic, stop: needs-human.
- Do not touch Plan Scenario A, B, Ext, C, or the 3-year Plan.

## ETM-8836 - Shutdown Logic Start Date from the Plan Ramp Down at creation, on a new Plan (4 steps)
writes data: yes
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b?tab=planning
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | On the Planning tab click Create Plan, Plan Name `QA ETM-8042 8836`, pick Ramp Down/Up Date `15 Feb 2026 09:00` → `25 Feb 2026 18:00`, Save | Toast Create Plan success; new Plan Card shows badge `Ramp Down/Up Date: 15 Feb 2026 09:00 - 25 Feb 2026 18:00`, Inactive | New Plan Card with badge |
| 2 | On the new Plan Card press Create on the Shutdown Logic row (if it needs a Worklist first, report what the card says and stop: needs-human) | Toast `Create Shutdown Logic Successfully` | Toast + card row |
| 3 | Open the Shutdown Logic page of the new Plan; collapse the histogram (Hide histogram, in `sl-splitter-horizontal`); read the schedule Start Date | Start Date is **15 Feb 2026** (the Plan Ramp Down), NOT 08 Feb 2026 (event Planned Date) | Gantt start / project Start Date |
| 4 | Look at the Ramp Down and Ramp Up lines and their badges | Ramp Down line `15 Feb 2026 09:00`, Ramp Up line `25 Feb 2026 18:00` | Both lines |

After: keep the Plan (Inactive) for a later re-run. Write its URLs (plan id, logic path) into the report.

# ETM-8392 manual steps: ETM-8679 (line style, header badge and label equal the Shutdown Logic lines)

Test Execution: ETM-8825. Environment: QA only (https://stms-qa.apps.pttep.com). One screenshot per step (Xray needs a picture per step).
Why manual: the automated run (2026-11-20_122553) compared colour, width and label text only; line style and badge shape are visual, so it ended `skipped` (Not proven) and stays TO DO until a person checks the whole case.
Log in as Turnaround Manager.

## Data (`ep-etm-fe-qa/.env` `ETM8392_CMP_*`): Plan **Plan ART For PSD**, event **ART PSD** (Ramp 08 Jun 2026 18:00 → 16 Jun 2026 07:00, same on both pages)
- Shutdown Logic: `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/9938a273-6679-4732-bf2f-b9774000cdce/shutdown-logic/b6ea65da-a81f-4141-981b-9590d7997e7c`
- Daily Report: `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/9938a273-6679-4732-bf2f-b9774000cdce/daily-report/bbdb46c4-e89b-4a21-b372-d7ee2de75746`
(The Shutdown Logic URL above opens the event list on QA (24 Nov 2026: the route is now `/logics/`); use Planning tab → Plan Card "Plan ART For PSD" → Shutdown Logic / Daily Report ⋮ → View.)

## What to look at (both pages, both lines)
| Part | Shutdown Logic (reference, ETM-7897) |
|---|---|
| Line | vertical, **solid** (not dashed), colour **#009FDA** (light blue), thin (same thickness on both pages) |
| Badge | blue chip in the Gantt header at the top of the line, same width (about 92 px) and same rounded shape |
| Label | text `Ramp Down` / `Ramp Up` inside the badge, white, same font size |
Tip: take both screenshots at the same browser zoom (100%) so thickness and badge size can be compared side by side.

## ETM-8679 - line style, badge and label equal the Shutdown Logic lines (4 steps)
writes data: no
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the **Shutdown Logic** Gantt of Plan ART For PSD. Scroll to 08 Jun 2026 and look at the `Ramp Down` line, its badge and label; then scroll to 16 Jun 2026 and do the same for `Ramp Up` | each line is solid, colour #009FDA; badge is a blue chip with white text `Ramp Down` / `Ramp Up` | Shutdown Logic: Ramp Down line + badge; Ramp Up line + badge |
| 2 | Open the **Daily Report** Gantt of the same Plan | the Gantt chart is shown with a `Ramp Down` and a `Ramp Up` line | Daily Report Gantt |
| 3 | Compare the Daily Report `Ramp Down` line, badge and label with step 1 | same colour (#009FDA), same thickness, solid (not dashed), same badge shape and size, label text exactly `Ramp Down` | Daily Report Ramp Down, next to the step 1 picture |
| 4 | Compare the Daily Report `Ramp Up` line, badge and label with the Shutdown Logic `Ramp Up` | same colour, thickness, solid style, badge shape and size, label text exactly `Ramp Up` | Daily Report Ramp Up, next to the step 1 picture |

Pass: every part in steps 3 and 4 is the same as on Shutdown Logic. Fail: any difference (dashed line, other colour, thicker/thinner, other badge shape or size, other label text); write which part differs.
Note: when the two badges are close together they overlap with a shadow and Ramp Down stays on top; that is the same rule on both pages (ETM-7897), not a difference.

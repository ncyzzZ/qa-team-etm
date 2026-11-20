# ETM-8392 manual steps: ETM-8677 (lines do not follow later changes of the Plan Ramp dates)

Test Execution: ETM-8825. Environment: QA only (https://stms-qa.apps.pttep.com). One screenshot per step (Xray needs a picture per step).
Log in as Turnaround Manager (needs Edit Plan and View Daily Report).

## Data (made 20 Nov 2026, `ep-etm-fe-qa/.env` `ETM8392_SNAP_A_*`)
- Event **ART PSD**, Planned Date **08 Jun 2026 18:00 → 16 Jun 2026 07:00**.
- Plan **QA 8392 Snap A**, Daily Report snapshot **Ramp Down 10 Jun 2026 06:00**, **Ramp Up 14 Jun 2026 18:00** (different from the Event, so a line at 08 Jun or 16 Jun means the app used the Event, not the snapshot).
- Daily Report URL: `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/c35cfa2d-4121-409c-bed3-cdf4d88729a9/daily-report/75187c25-7887-4d2c-ac12-080aef10bd6f`
- New Ramp dates for step 2: **12 Jun 2026 09:00 → 18 Jun 2026 15:00** (different from the snapshot and from the Event).

## How to read a line's position
- Hover the `Ramp Down` / `Ramp Up` badge in the Gantt header: the tooltip shows `Ramp Down: DD Mmm YYYY` (date only).
- The time is the place inside the day column (one column = 1 day): 06:00 = 1/4 into the column, 18:00 = 3/4 into the column.

## Note on the test wording
Step 2 of the Test says "Change the Plan Ramp Down Date and Ramp Up Date in Shutdown Logic". On QA the Plan's Ramp dates are changed with **Planning tab → Plan Card ⋮ → Edit Plan → field `Ramp Down/Up Date`** (ETM-8042). The steps below use Edit Plan. If you agree, the Xray step wording can be fixed after the run (Xray write, ask first).

## ETM-8677 - lines do not follow later changes of the Plan Ramp dates (6 steps)
writes data: yes
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report of **QA 8392 Snap A** (URL above, or Plan Card → Daily Report ⋮ → View Daily Report). Hover the `Ramp Down` badge, then the `Ramp Up` badge, and write down the date and the place in the column | `Ramp Down: 10 Jun 2026`, line 1/4 into the 10 Jun column. `Ramp Up: 14 Jun 2026`, line 3/4 into the 14 Jun column. No line at 08 Jun or 16 Jun | Gantt with both lines + each tooltip |
| 2 | Event ART PSD → Planning tab → Plan Card **QA 8392 Snap A** ⋮ → **Edit Plan**. Set `Ramp Down/Up Date` to **12 Jun 2026 09:00 → 18 Jun 2026 15:00**, Save | toast success; the Plan Card badge shows `Ramp Down/Up Date: 12 Jun 2026 09:00 - 18 Jun 2026 15:00` | Plan Card badge after Save |
| 3 | Open the Daily Report of Snap A again and reload the page (F5 / Cmd+R) | the Gantt loads | Gantt |
| 4 | Hover `Ramp Down`, compare with step 1 | still `Ramp Down: 10 Jun 2026`, 1/4 into the 10 Jun column; no line at 12 Jun | Gantt + tooltip |
| 5 | Hover `Ramp Up`, compare with step 1 | still `Ramp Up: 14 Jun 2026`, 3/4 into the 14 Jun column; no line at 18 Jun | Gantt + tooltip |
| 6 | Edit Plan of Snap A again: `Ramp Down/Up Date` back to **10 Jun 2026 06:00 → 14 Jun 2026 18:00**, Save | the badge shows `10 Jun 2026 06:00 - 14 Jun 2026 18:00` again | Plan Card badge |

Pass: steps 4 and 5 show the lines where step 1 showed them. Fail: a line moved to 12 Jun / 18 Jun (follows the Plan) or sits at 08 Jun / 16 Jun (follows the Event).
Steps 2 and 6 change QA data on Snap A only (approved data set, 20 Nov 2026).

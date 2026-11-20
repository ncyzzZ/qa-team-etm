# ETM-8392 manual steps: ETM-8688 and ETM-8797 (Extension)

Test Execution: ETM-8825. Environment: QA only (https://stms-qa.apps.pttep.com). One screenshot per step (Xray needs a picture per step).
Log in as Turnaround Manager (needs Update Progress / Freeze on the Daily Report).
Expected rule (BA DEC-062, 20 Nov 2026): an Extension adds execution days **after** the end and does **not** move either Ramp line; deleting extended days does not move them either. Exactly one `Ramp Up` line at all times.

## Data (made 20 Nov 2026, `ep-etm-fe-qa/.env` `ETM8392_SNAP_B_*`, `ETM8392_SNAP_C_*`)
Event **ART PSD**, Planned Date 08 Jun 2026 18:00 → 16 Jun 2026 07:00. 12 tasks, 01 Jun 00:00 → 18 Jun 07:00, so tasks are still open on the last execution day (needed for the Extend modal).

| Test | Plan | Snapshot Ramp Down | Snapshot Ramp Up | Daily Report URL |
|---|---|---|---|---|
| 8688 | QA 8392 Snap B | 09 Jun 2026 12:00 (1/2 into the column) | 15 Jun 2026 09:00 (3/8 into the column) | `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/d7f9a402-2489-4a0f-ac50-1bf9bd9bdc14/daily-report/15964726-38f5-48fe-8f0d-7aca3c7b0a78` |
| 8797 | QA 8392 Snap C | 11 Jun 2026 08:00 (1/3 into the column) | 13 Jun 2026 20:00 (5/6 into the column) | `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/13f241c8-6159-400b-8901-79a04a1e3f5a/daily-report/635e0869-76d0-440c-a869-55e46aa06e86` |

How to read a line: hover the `Ramp Down` / `Ramp Up` badge in the Gantt header (tooltip `Ramp Up: DD Mmm YYYY`, date only); the time is the place inside the day column.
A line at 08 Jun / 16 Jun = the Event date (wrong); a line at another plan's date = wrong report.

## Preparation: DONE 20 Nov 2026 (`tests/fe/setup/setupEtm8392FreezeDays.spec.ts`)
| Plan | Report range (API) | Frozen | Last execution day (not frozen) |
|---|---|---|---|
| Snap B | 08 Jun → 18 Jun 2026 | 08-17 Jun (10 days) | **18 Jun 2026** |
| Snap C | 10 Jun → 18 Jun 2026 | 10-17 Jun (8 days) | **18 Jun 2026** |
Open the Daily Report and use the right arrow to reach 18 Jun (the arrow opens only after a day is frozen). The first extended day will be **19 Jun 2026** (E1), the second **20 Jun 2026** (E2).

## ETM-8688 - Ramp lines do not move after the last execution day is extended (Snap B) (5 steps)
writes data: yes
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report of Snap B on the last execution day. Hover both badges, write down date and place | `Ramp Down: 09 Jun 2026` at 1/2 of the column; `Ramp Up: 15 Jun 2026` at 3/8 of the column | Gantt + both tooltips |
| 2 | Leave at least one task below 100% Actual, click `Freeze` | modal `Extend Daily Report` ("To freeze this daily report with incomplete tasks, the system must extend the report period..."); click `Confirm`; toast `Freeze Success`; one new execution day after the old last day (right arrow works again) | modal + toast |
| 3 | Reload the Daily Report (F5 / Cmd+R) | Gantt shown | Gantt |
| 4 | Hover both badges, compare with step 1 | `Ramp Down` still 09 Jun 2026 at 1/2; `Ramp Up` still 15 Jun 2026 at 3/8; one line each | Gantt + tooltips |
| 5 | Go to the new extended day (right arrow) and look at its column on the Gantt | the extended day is to the right of the `Ramp Up` line | Gantt with the extended day |

## ETM-8797 - repeated Extensions and deleting extended days (Snap C) (7 steps)
writes data: yes
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report of Snap C on the last execution day. Hover both badges, write down date and place | `Ramp Down: 11 Jun 2026` at 1/3; `Ramp Up: 13 Jun 2026` at 5/6 | Gantt + tooltips |
| 2 | With a task below 100%, click `Freeze` → `Extend Daily Report` → `Confirm`; reload | toast `Freeze Success`; one extended day (E1) added; Gantt shown | modal + Gantt |
| 3 | Count the `Ramp Up` badges | exactly one `Ramp Up`, at 13 Jun 2026, 5/6 of the column | Gantt header |
| 4 | Go to E1 (right arrow). With a task below 100%, `Freeze` → `Extend Daily Report` → `Confirm`; reload | second extended day (E2) added; Gantt shown | modal + Gantt |
| 5 | Count the `Ramp Up` badges, hover both | exactly one `Ramp Up` (13 Jun, 5/6); `Ramp Down` 11 Jun, 1/3 | Gantt + tooltips |
| 6 | Delete the extended days (now E1 is frozen, E2 is open): go to E1 and click `Unfreeze`. On E1 set Actual 100% on every task (12 tasks), `Save`, then `Freeze` | modal `Delete Extended Days` ("Freezing this daily report will make all tasks complete. The system will remove the extended report days that are no longer needed..."); `Confirm`; toast `Freeze Success`; E2 is gone (right arrow stops at E1); reload | modal + header after reload |
| 7 | Hover both badges, compare with step 1 | `Ramp Down` 11 Jun 2026 at 1/3; `Ramp Up` 13 Jun 2026 at 5/6; one line each | Gantt + tooltips |

Step 6 is my reading of `Daily Report Validation&Result.xlsx` CR-28 (Delete Extended Days appears when a Freeze makes all tasks complete while later extended days exist). If the modal does not appear, stop and tell me; do not try other ways on the data.

Pass: every compare step shows the lines where step 1 showed them, one line each. Fail: a line moved (to an extended day, to 08/16 Jun, or to another date), or two `Ramp Up` lines.

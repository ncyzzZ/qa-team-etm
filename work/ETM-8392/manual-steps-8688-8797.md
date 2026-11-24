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
| Snap C | 10 Jun → 19 Jun 2026 | 10-18 Jun (9 days; 18 Jun frozen by the user 24 Nov 2026, which extended the report by 19 Jun) | **19 Jun 2026** |
Open the Daily Report and use the right arrow to reach 18 Jun (the arrow opens only after a day is frozen). The first extended day will be **19 Jun 2026** (E1), the second **20 Jun 2026** (E2).
Snap C only (since 24 Nov 2026): last day 19 Jun, so for ETM-8797 the first extended day will be **20 Jun 2026** (E1), the second **21 Jun 2026** (E2). The 8797 steps below use these dates.

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
| 6 | Delete the extended days: do **6a-6i** below | E2 (21 Jun) is removed | pictures listed in 6a-6i |
| 7 | Hover both badges, compare with step 1 | `Ramp Down` 11 Jun 2026 at 1/3; `Ramp Up` 13 Jun 2026 at 5/6; one line each | Gantt + tooltips |

### Step 6 in detail - Delete Extended Days
When the modal appears (stms-fe develop, 24 Nov 2026, `daily-report-gantt.component.ts` `freezeConfirmCaseFor`): `Delete Extended Days` is asked only when ALL of these are true at the moment you click `Freeze`:
1. the report has been extended (true after steps 2 and 4),
2. the day you freeze is **before** the last day (so freeze **E1 = 20 Jun**, not E2 = 21 Jun; on the last day the modal never shows, and with a task below 100% you get `Extend Daily Report` again),
3. **every Breakdown row** (the lowest level, the only level where `Actual (%)` can be typed; Work / Activity rows are averages) reads 100%,
4. there is no unsaved change (Freeze stays disabled until you `Save`).

State before 6a (after step 4): 10-19 Jun and 20 Jun (E1) frozen, 21 Jun (E2) open and the last day.

| # | Do | Expected | Picture |
|---|---|---|---|
| 6a | Use the right arrow to go to **20 Jun 2026** (E1) | header `20 Jun 2026`, button `Unfreeze` | header |
| 6b | Click `Unfreeze` | toast of Unfreeze success; button now `Freeze`; the grid can be edited. If a modal such as "has been unfreeze/freeze" appears instead, stop and tell me | header + toast |
| 6c | Expand every row down to the Breakdown level (the expand arrows in the task column) | all Breakdown rows are shown | grid |
| 6d | On each Breakdown row, double-click the `Actual (%)` cell, type `100`, press Enter | each cell shows 100; Work / Activity rows above show 100 too (average) | grid with all 100 |
| 6e | Click `Save` | toast of save success; `Freeze` becomes enabled | toast |
| 6f | Check there is no row below 100 in `Actual (%)` (scroll the whole grid). If one is left, fix it and Save again | every row 100 | grid |
| 6g | Click `Freeze` | modal **`Delete Extended Days`**: "Freezing this daily report will make all tasks complete. The system will remove the extended report days that are no longer needed. Are you sure you want to freeze this report?" | modal |
| 6h | Click `Confirm` | toast `Freeze Success`; button `Unfreeze` | toast + header |
| 6i | Reload (F5 / Cmd+R), go to 20 Jun and try the right arrow | 21 Jun (E2) is gone: the right arrow stays disabled on 20 Jun (or goes no further than the new last day) | header after reload |

Stop and tell me (do not try other ways on the data) when:
- 6g shows no modal and the day just freezes, or shows `Extend Daily Report` (a Breakdown row is still below 100, or you are on the last day);
- after 6h the report still has 21 Jun, or 20 Jun is gone too (write which days are left; the AC only needs the lines, but the day list goes into the result comment).

After step 6 Snap C is all 100% and cannot be extended again without new data. Do ETM-8690 / ETM-8692 (which use Snap C 11-17 Jun PDFs) before this test.

Pass: every compare step shows the lines where step 1 showed them, one line each. Fail: a line moved (to an extended day, to 08/16 Jun, or to another date), or two `Ramp Up` lines.

# ETM-8392 QA data plan: Ramp snapshot different from the Event (ETM-8677, ETM-8688, ETM-8797)

Decision D-1 (chat 2026-11-20): new data set for 8392, do not use the ETM-8042 plans (event "QA S26 Ramp").
Dev answer (`ETM-8392-answers-ramp-source.md`): the lines read `daily_report.sdr_ramp_down_date / sdr_ramp_up_date`, written once when the Daily Report is created from the Plan's Ramp dates. To tell the snapshot apart from the Event, the Plan's Ramp dates must differ from the Event BEFORE the Daily Report is created.

## Where
- Event "ART PSD" (`DAILY_REPORT_EVENT_ID` 6580f57b-...), Planned Date **08 Jun 2026 18:00 → 16 Jun 2026 07:00** (every plan there now has Ramp = Event, read from the QA DB 2026-11-20).
- Source plan: "Plan ART For PSD" (tasks 1-20 Jun 2026, has Shutdown Logic). Duplicate copies the source's Ramp dates (FE `modal-plan.component.ts`: Ramp field disabled on duplicate), so the Ramp dates are changed with Edit Plan right after.

## Writes (QA only, through the UI as Turnaround Manager)
| # | Write | Plan | Ramp Down → Ramp Up after the write | For |
|---|---|---|---|---|
| W1 | Duplicate Plan "Plan ART For PSD" | QA 8392 Snap A | (copy) | 8677 + AC-1.1 check |
| W2 | Duplicate Plan "Plan ART For PSD" | QA 8392 Snap B | (copy) | 8688 |
| W3 | Duplicate Plan "Plan ART For PSD" | QA 8392 Snap C | (copy) | 8797 |
| W4 | Edit Plan, Ramp Down/Up Date | Snap A | **10 Jun 2026 06:00 → 14 Jun 2026 18:00** | |
| W5 | Edit Plan, Ramp Down/Up Date | Snap B | **09 Jun 2026 12:00 → 15 Jun 2026 09:00** | |
| W6 | Edit Plan, Ramp Down/Up Date | Snap C | **11 Jun 2026 08:00 → 13 Jun 2026 20:00** | |
| W7 | Create Daily Report (Plan Card → Daily Report → Create) | Snap A, B, C | snapshot = the dates above | |

Each date differs from the Event and from the other two plans, so a line at the Event date or at another plan's date is caught.

## Check after the writes (read-only)
- DB: `sdr_ramp_down_date / sdr_ramp_up_date` of the 3 new Daily Reports = the dates above, and ≠ Event dates.
- Daily Report Gantt of each plan: lines at the plan's own dates (also proves AC-1.1 for real: the 12 passed tests ran on data where snapshot = Event).
- New ids go to `ep-etm-fe-qa/.env` as `ETM8392_SNAP_A/B/C_PLAN_ID` and `_REPORT_ID` (backup `.env.bak-*` first).

## Not part of the prep (done inside the tests, asked again then)
- 8677 step 2: change Snap A's Ramp dates again, step 6: change them back.
- 8688 / 8797: freeze the days up to the last execution day, Extend (twice for 8797), Delete Extended Days. These are the test actions themselves.

## How
A setup spec in `ep-etm-fe-qa`: `tests/fe/setup/setupEtm8392SnapshotData.spec.ts` (new file, QA-only guard, a plan that already exists is left as it is, safe to run again). It reuses the Duplicate / Plan Card helpers (`duplicatePlan.helpers.ts`) and reads the Create Plan modal selectors; no ETM-8042 file is changed.

## Undo
Delete the 3 plans (Plan Card → Delete Plan; a Daily Report that is Active cannot be deleted, so none of them is set Active).

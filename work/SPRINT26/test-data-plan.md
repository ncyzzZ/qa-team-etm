# Sprint 26 – test data plan (QA, 2026-11-19)

Source: read-only queries on the QA database (every query in a READ ONLY transaction; nothing written). Scripts: scratchpad `db.cjs`, `inv.cjs`, `cand*.cjs`.
QA today: 23 events with plans, 239 plans, 200 Shutdown Logic, 133 Daily Reports (130 with the Ramp snapshot, 3 without), worklist status I 142 / F 76 / C 21.
Paths use `/shutdown-event-list/events/<event>/planning/<plan>/<page>/<id>`. Times below are Bangkok (+07:00); the DB stores UTC.

## 0. Found a broken value (fix first)

`DAILY_REPORT_ID` in `.env` does not exist in the QA DB any more (the event and plan still exist). Every Daily Report test (ETM-7343, ETM-8003, ETM-8392, ETM-5994 ...) opens a missing report.
Replace with the report in group A (`QA EMP Dup B`, ART PSD) or another one you choose.

## A. Use existing data: only `.env` values to set (no data change)

| Variable | Value | Why this one |
|---|---|---|
| `DAILY_REPORT_EVENT_ID` | `6580f57b-4bc6-43d2-a4c3-a7b20952f851` (ART PSD) | report with snapshot, frozen and open days |
| `DAILY_REPORT_PLAN_ID` | `f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e` (QA EMP Dup B) | |
| `DAILY_REPORT_ID` | `806c2fac-3d8d-4481-853a-fcbaa2d5d0db` | |
| `ETM8392_RAMP_DOWN` | `2026-06-08T18:00:00+07:00` | snapshot of that report |
| `ETM8392_RAMP_UP` | `2026-06-16T07:00:00+07:00` | |
| `ETM8392_FROZEN_DATE` / `ETM8003_FROZEN_DATE` | `03 Jun 2026` | first frozen day of that report |
| `ETM8392_NOT_FROZEN_DATE` / `ETM8003_NOT_FROZEN_DATE` | `05 Jun 2026` | first open day |
| `ETM8392_OLD_REPORT_PATH` | `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/75ee62f6-1954-41b4-954d-ab2ca1d183c8/daily-report/31885cb6-33f4-4b5f-94d8-ee1ea1216b77` | Export 5000, a report with no snapshot |
| `ETM8392_OLD_PLANNED_START` / `_END` | `2026-06-17T10:00:00+07:00` / `2026-07-15T06:00:00+07:00` | Planned dates of Export 5000 |
| `ETM8034_BIG_PATH` | `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/d584b6ce-458e-4d87-b74f-77d2e4a42794/logics/97600d7c-39c9-4279-bddc-a5a1a9b482fc` | largest plan (New Plan 20,000 Work, 22,442 rows) |
| `ETM8034_OLD_PATH` | `/shutdown-event-list/events/1315862e-6220-4c76-81be-a349cee53802/planning/a36d7f7c-af9e-4a7b-b7de-7a30d37e722e/logics/f05a7be0-2fa8-4795-a2cd-44ad2203e980` | Mar S1 FSD SE 2027 / Eq-Del (952 rows), made before ETM-8034 |
| `WLOC_EXPORT_PATH` | `/shutdown-event-list/events/8615c7fb-a8c5-4a33-8868-456bca141118/planning/5bed9f3c-e424-4f08-be03-45bd2f25c4b2/worklist/27fc9831-7daa-4ba3-837d-5ce15e411957` | ZZ BA Claude Test / BA Plan B, holds BATEST8049A |
| `FROZEN_EVENT_ID` / `FROZEN_PLAN_ID` | `afdb376f-12cf-48f4-8e6e-a81288b9f864` / `eaae8977-a7ce-48ec-a911-5c997ca026dd` | Export 5000, frozen worklist |
| `FROZEN_WORKLIST_ID` | `6e54d223-f190-40da-bc56-2042abcd3596` | status F |
| `FROZEN_WORK_NUMBER` | `500556225` | Work at New with breakdown at Breakdown Updated |
| `ETM8521_EQUIPMENT` / `ETM8521_FUNC_LOC` | `PL-CPP2-XV7445` / `PL-CPP2-PRO-WI` | most used pair in QA works (165 works). BA Q6 still open: confirm they are master data |
| `ETM8042_TL_EVENT_ID` | `6580f57b-4bc6-43d2-a4c3-a7b20952f851` (ART PSD) | has a Shutdown Timeline (MAJOR) |

Note: ART PSD and Export 5000 are shared by many tests. Group A only reads them, except ETM-8394 TC frozen (Import is blocked on a frozen worklist, nothing saved).

## B. Data to create on QA (writes data: needs your OK, one card at a time)

Recommended way: a setup spec per card (`tests/fe/e2e/<module>/setup<Card>Data.spec.ts`) that creates the data through the UI or API, prints the `.env` lines and can run again next Sprint (same pattern as `setupDuplicatePlanEvent.spec.ts`). Each on its own event so tests that write data do not touch shared plans.

| Order | Card | What | Variables it fills | Effort |
|---|---|---|---|---|
| 1 | ETM-8042 | event "QA S26 Ramp" with Plans "Plan Scenario A", "B", "F" (Planned Date ~Feb 2026, the helpers expect it), Shutdown Logic, Manpower and Equipment Mob Plan with a blank date field | `ETM8042_EVENT_ID`, `_PLAN_A/B/F`, `_LOGIC_PATH_A/B`, `_MOB_PATH`, `_EQ_PATH`, `_EXT_PLAN` (plan with a Daily Report on its last day) | medium |
| 2 | ETM-8034 | duplicate a mid-size plan (e.g. ART PSD / QA EMP Dup A, 817 rows) into the 8042 event or its own event, so colour saves do not disturb others | `ETM8034_PATH`, `ETM8034_PLAN_NAME` | small |
| 3 | ETM-8049 | worklist(s) with seeded works WK-1..WK-27 and Deck / X / Y values as the helper header says (none exist today); one empty worklist | `WLOC_SCRATCH/CELLS/TIP/SORT/DECK/ANY/EMPTY/CASE/OLD/XY_PATH` | large (Import file is the fastest way) |
| 4 | ETM-8391 | worklists with the Remark set W01..W22, Blank variants (empty, 3 spaces, `-`), HTML Remarks, 60+ works `Remark 001..060` (none exist today) | `WL_REMARK_*_PATH`, `WL_REMARK_PLANNING_PATH`, `WL_REMARK_PLAN_NAME` | large (Import file) |
| 5 | ETM-8405 | save one Actual (%) with Update Progress on the spare timeline event (it has 0 actuals now) | `TL_WEEKLY_ACTUAL_SEEDED=1` | small |
| 6 | ETM-8388 | run once with `TL_PASTE_SEED=1` to build the common plan on the spare event (the spec does it) | `TL_PASTE_SEED` back to empty after | small |

Steps 3 and 4 can share one event and one Import file per card (Import Work template); the file goes in `STMS/Test Data/ETM-8049` and `ETM-8391`.

## C. Cannot be done from the data, needs a person or a decision

| Variable | Why | Who |
|---|---|---|
| `ETM8003_OLD_GANTT_FILLS` / `_OLD_ACTUAL_FONTS` | colours from BEFORE ETM-8003. It is still In Development, so QA still shows the old colours: record them NOW (read-only script, before the deploy) | me, with your OK, soon |
| `ETM8042_OLD_EVENT_ID` / `_OLD_PLANS` | an event whose plans were made before ETM-8042 reached QA: candidates Mar S1 FSD SE 2027 (plans from Oct). Check the deploy date in Jira | me + you confirm |
| `ETM8042_BASELINE_XLSX`, `ETM8042_OLD_DR_SAMPLE`, `ETM8042_OLD_DR_PATH` | must be captured before the release; ETM-8042 is already on QA, so it is too late. Keep these 3 TCs manual or drop the "before" part | you decide |
| `ETM8392_VIEW_ACTIVE_STATE`, `ETM8003_VIEW_ACTIVE_STATE` | needs a QA account with View Active Daily Report Item only, then a saved login file | admin creates the account |
| `WL_REMARK_NOPERM_USER` / `_PASS` | QA account without View Worklist permission | admin creates it, you type the password |

## D. Base event chosen by the user: NN TEST QA (checked 2026-11-19, read-only)

Event `9885b03f-17ab-4ff5-a725-6d841259ff1a`, FSD, Initiation, Planned 13 Sep 2026 16:15 - 30 Sep 2026 16:15. Not used by any `.env` value today (only as a fallback id in `verifyImportWorkStatus.spec.ts`).
- 1 live plan "Wide Plan B - NN" (`808363e9-...`): worklist Initial, 37 works (36 with Deck/X/Y, 1 with a Remark), Shutdown Logic 211 rows, Manpower and Equipment Mob Plan, Daily Report with snapshot (Ramp 13 Sep - 30 Sep 2026) and 3 days, all frozen.
- 27 deleted plans (ignore).
- Timeline: MAJOR, 23 activities, 0 Actual values.

What it can serve as is: ETM-8405 / ETM-8388 timeline event (needs one Actual saved for `TL_WEEKLY_ACTUAL_SEEDED`), ETM-8034 (a duplicate of Wide Plan B, 211 rows).
What it cannot serve as is: ETM-8042 helpers expect Plans around Feb 2026 (would need the dates in `rampDownUp.helpers.ts` changed or a Feb event); the Daily Report has no open day (8003/8392 need one frozen and one open day).

## E. Can test data be made straight in the DB? (checked, nothing written)

- Technically yes: the QA DB user may INSERT / UPDATE / DELETE every table, there are no triggers, ids default to `gen_random_uuid()`.
- Safe only for flat data the UI also makes the same way: works, Deck/X/Y and Remarks inside an existing worklist (`shutdown_work`, `shutdown_working_location`), weekly Actual values (`shutdown_timeline_actual`). Enough for ETM-8049, ETM-8391 and ETM-8405.
- Not safe for plans, Shutdown Logic, Daily Report, Mob Plans: the app builds many linked rows (Gantt rows, periods, filters, snapshot; `shutdown_map` alone has 7 foreign keys). Make those with the UI or API (Create Plan, Duplicate Plan).
- Risks of DB inserts: they skip the app's validation, so a row the UI could never make can look like a bug; audit columns (`created_by`) must be filled by hand. Every insert script runs in one transaction, prints what it adds, and has a matching delete script.

## Next steps
1. Fix group A in `.env` (I can write these lines into `.env`, it is git-ignored).
2. Record the old ETM-8003 colours now (C, first row), before the card is deployed.
3. Pick the order of group B; I write the setup spec of each card and show it before it runs on QA.
4. Ask admin for the 2 accounts in group C.

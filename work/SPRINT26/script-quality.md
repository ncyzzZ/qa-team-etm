# Sprint 26 – do the scripts prove the cards? (2026-11-19, read-only review)

Scope: the 13 Stories with scripts (not ETM-8415). Each AC was compared with what the scripts assert.
Rating: strong = a running test asserts the AC's expected result; weak = runs but checks a proxy or can pass with "not checked"; blocked = fixme / skip / `.env` empty; none = no script.
Nothing was run against the app. Key claims were spot-checked in the code (8034 `openPlan` skip, 8049/8391 file-level skip, 8394 `.catch` at line 811, 7343 `Run.done()`).

## Verdict per card

| Card | Verdict | Why | Most important fix |
|---|---|---|---|
| ETM-8388 Timeline copy/paste | **Ready** | almost every AC strong | script or hand-run 8711 (Cmd+C), 8729/8730 (real Excel) |
| ETM-8394 Import status | **Ready** (1 false pass) | AC 1-8 strong (DB + message) | remove `.catch` at `verifyImportWorkStatus.spec.ts:811`; set `FROZEN_*` for 8768 |
| ETM-8521 Faster paste | Partly | function strong; "faster" not measured | timed big paste vs baseline; set `ETM8521_EQUIPMENT/FUNC_LOC`; un-fixme 8764 |
| ETM-8449 Faster collapse/expand | Partly | regression strong; "faster" = fixed 20 s limit, no baseline | baseline from old build; fail when a level click is skipped |
| ETM-8405 Weekly Plan % | Partly | AC 1-13 mostly strong | script 8643 (AC-14 Save/Main Timeline), 8644 (AC-15/16); split 8642 so it runs past the open defects |
| ETM-8003 S-Curve colours | Partly | screen colours strong | labels/dates hard-coded to one plan; set `ETM8003_OLD_*`; PDF manual |
| ETM-7343 Actual % colour | Partly | colour checks strong when data exists | test passes when only 1 check ran (`actualColor.helpers.ts:36-46`): seed a plan with every case and fail on "not checked"; selectors never run |
| ETM-8034 Row highlight | Not ready | well designed, but all skip (`ETM8034_*` empty) | fill `.env`; script AC-4 (8868/8869) and Copy & Paste part of 8861 |
| ETM-8042 Ramp Down/Up date | Not ready | all skip (`ETM8042_EVENT_ID` empty); dates hard-coded to Feb 2026 | fill `ETM8042_*`; make 8833 check unconditional |
| ETM-8049 Working Location | Not ready | whole files skip (`WLOC_*` not in `.env` or `.env.example`) | seed worklists + env; script 8786/8787 |
| ETM-8391 Remark filter | Not ready | whole file skips (`WL_REMARK_*`); locators never run live | env + seed; one probe run |
| ETM-8392 Ramp lines | Not ready | only AC-1.3/1.4 proven; rest env-skip or fixme | fill `ETM8392_*` |
| ETM-8393 Histogram tooltip | Not ready | tooltip (ETM-8534) not in build, all fixme (honest) | add selector when it ships |

## Patterns across cards
1. Empty `.env` is the biggest blocker: 6 cards cannot run at all today (8034, 8042, 8049, 8391, 8392, partly 8003/8405). Several keys (`WLOC_*`, `WL_REMARK_*`, `FROZEN_*`, `TL_WEEKLY_ACTUAL_SEEDED`) are missing from `.env.example` too.
2. False pass risk: steps that only add a "not checked" / "notScripted" / "skipped-step" note and the test still passes (7343, 8034, 8392, 8405, 8449). The evidence report shows them green.
3. Hard-coded data for one plan (8003, 8042, 8049, 8391, 8521): breaks when the QA data changes.
4. "Faster" stories (8449, 8521) have no baseline, so the scripts cannot prove "faster".
5. PDF / Excel export checks are manual on every card that has them (7343, 8003, 8034, 8042, 8392).
6. Specs of 7343, 8003, 8391, 8405 say "NOT RUN against the app yet": selectors are unproven.

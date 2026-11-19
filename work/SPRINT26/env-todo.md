# Sprint 26 – `.env` values to fill (ep-etm-fe-qa, 2026-11-19)

Checked against `ep-etm-fe-qa/.env` (names only, no values read out). "ex" = listed in `.env.example`.
Paths are page paths without host, copied from the address bar on QA. QA only, never UAT/PROD.
Already set and fine: `DAILY_REPORT_*`, `SHUTDOWN_LOGIC_*`, `ETM8449_PATH`, `TL_SPARE_EVENT_ID`, `TL_MAJOR_EVENT_ID`.

## Priority 1 – the whole card skips today

### ETM-8042 Plan Ramp Down/Up Date (all 23 TC skip)
| Variable | ex | What to put |
|---|---|---|
| `ETM8042_EVENT_ID` | ex | **key**: event id of the test event (Plans A, B, F) |
| `ETM8042_PLAN_A` / `_PLAN_B` / `_PLAN_F` | ex | Plan names (default "Plan Scenario A/B/F" if empty) |
| `ETM8042_LOGIC_PATH_A` / `_B` | ex | Shutdown Logic page path of Plan A / Plan B |
| `ETM8042_MOB_PATH` | ex | Manpower Mob Plan page with a blank date field |
| `ETM8042_EQ_PATH` | ex | Equipment Mob Plan page with a blank date field |
| `ETM8042_TL_EVENT_ID` | ex | event for the Shutdown Timeline tab check (8844) |
| `ETM8042_OLD_EVENT_ID` | ex | event with Plans made before the release (8835) |
| `ETM8042_OLD_PLANS` | ex | names of those old Plans, separated by `|` |
| `ETM8042_BASELINE_XLSX` | ex | export file saved before the release (8837, 8846) |
| `ETM8042_OLD_DR_PATH` | ex | Daily Report made before the release (8849) |
| `ETM8042_OLD_DR_SAMPLE` | ex | JSON of values recorded before the release (8849) |
| `ETM8042_EXT_PLAN` | ex | Plan whose Daily Report is on its last execution day (8842) |

### ETM-8034 Row highlight (all 19 TC skip)
| Variable | ex | What to put |
|---|---|---|
| `ETM8034_PATH` | ex | **key**: Shutdown Logic page of the QA colour-test plan |
| `ETM8034_PLAN_NAME` | ex | exact Plan name on its Plan Card (Duplicate Plan, TC-022) |
| `ETM8034_OLD_PATH` | ex | Shutdown Logic page of a plan made before the feature (TC-004) |
| `ETM8034_BIG_PATH` | ex | Shutdown Logic page of the largest QA plan |

### ETM-8049 Working Location (whole files skip) – none of these are in `.env.example`
Data: worklists with the test works WK-* seeded by the team (see `worklist/workingLocation.helpers.ts`).
| Variable | What to put |
|---|---|
| `WLOC_SCRATCH_PATH` | **key**: worklist the spec may add/delete works in (TC-001..004, 012, 015, 017-019) |
| `WLOC_CELLS_PATH` | TC-005: WK-1, 2, 5, 6, 7, 8, 9 (WK-6 with case variants) |
| `WLOC_TIP_PATH` | TC-006: WK-10 (six Deck values), WK-10b (X 0..9, Y A..J) |
| `WLOC_SORT_PATH` | TC-007: WK-1, 2, 3, 7 with different values |
| `WLOC_DECK_PATH` | TC-008: WK-1, 2, 3, 7 and a Job Description to filter on |
| `WLOC_ANY_PATH` | TC-009: WK-1, 2, 3 |
| `WLOC_EMPTY_PATH` | TC-009: a worklist with no work |
| `WLOC_CASE_PATH` | TC-010: WK-6a (Main Deck), WK-6b (main deck) |
| `WLOC_EXPORT_PATH` | TC-011: worklist of event "ZZ BA Claude Test - FSD 8 days", BA Plan B (work BATEST8049A) |
| `WLOC_OLD_PATH` | TC-020: WK-18 with Deck `main deck` and `HELIPAD`, Remark `old` |
| `WLOC_XY_PATH` | TC-021: WK-27a..WK-27d |

### ETM-8391 Remark filter (whole file skips) – none in `.env.example`
Data: Remark set seeded by the team (see `worklist/remarkFilter.helpers.ts`).
| Variable | What to put |
|---|---|
| `WL_REMARK_SET_PATH` | **key**: worklist with Remark set W01..W19, W21, W22 (no W20) |
| `WL_REMARK_PLANNING_PATH` + `WL_REMARK_PLAN_NAME` | Planning tab of the event + the Plan Card holding that worklist (TC-002) |
| `WL_REMARK_A_PATH` / `_B_PATH` / `_C_PATH` | normal Remarks + one Blank work: A empty, B three spaces, C literal `-` (TC-004) |
| `WL_REMARK_EDIT_PATH` | W05 "Note 1", W06 "Note 2", W11 empty (TC-006) |
| `WL_REMARK_HTML_PATH` | Remarks `<b>x</b>` and `<script>alert(1)</script>` (TC-013) |
| `WL_REMARK_EMPTY_PATH` | worklist with no works (TC-014) |
| `WL_REMARK_MANY_PATH` | 60+ works, Remark 001..060, W17 with a 200-character Remark (TC-007) |
| `WL_REMARK_NOPERM_USER` / `_PASS` | QA login WITHOUT View Worklist permission (TC-001); fill it yourself |

### ETM-8392 Ramp lines (most TC skip)
| Variable | ex | What to put |
|---|---|---|
| `ETM8392_RAMP_DOWN` / `_RAMP_UP` | ex | expected snapshot dates with time, ISO with offset, e.g. `2025-02-18T08:00:00+07:00` |
| `ETM8392_FROZEN_DATE` / `_NOT_FROZEN_DATE` | ex | execution dates as on the page, e.g. `19 Feb 2025` |
| `ETM8392_OLD_REPORT_PATH` | ex | old Daily Report without a snapshot |
| `ETM8392_OLD_PLANNED_START` / `_END` | ex | its Event Planned Start / End (ISO with offset) |
| `ETM8392_VIEW_ACTIVE_STATE` | ex | saved login file of a View Active Daily Report Item user |

## Priority 2 – only some steps or TC skip

| Card | Variable | ex | What to put |
|---|---|---|---|
| ETM-8003 | `ETM8003_FROZEN_DATE` / `_NOT_FROZEN_DATE` | -- | dates as on the page, e.g. `19 Feb 2025` (8804) |
| ETM-8003 | `ETM8003_OLD_GANTT_FILLS` / `_OLD_ACTUAL_FONTS` | -- | comma-separated hex recorded before the change (8806) |
| ETM-8003 | `ETM8003_VIEW_ACTIVE_STATE` | -- | saved login file of a View Active user (8807); can be the same file as ETM8392's |
| ETM-8394 | `FROZEN_WORKLIST_ID` + `FROZEN_WORK_NUMBER` | -- | a frozen Worklist + a Work at New with a breakdown at Breakdown Updated (8768) |
| ETM-8394 | `FROZEN_EVENT_ID` / `FROZEN_PLAN_ID` | -- | its event and plan (falls back to a hard-coded id if empty) |
| ETM-8405 | `TL_WEEKLY_ACTUAL_SEEDED=1` | -- | set to 1 only when `TL_SPARE_EVENT_ID` has a saved Actual (%) value |
| ETM-8521 | `ETM8521_EQUIPMENT` / `ETM8521_FUNC_LOC` | -- | real master data values on QA (8760); BA Q6 still open |
| ETM-8388 | `TL_PASTE_SEED=1` | -- | once only, if the common plan is not yet on the spare event (the first test builds and SAVES it) |
| ETM-8388 | `TL_PASTE_GRID_ORIGIN` | -- | optional, default `25 May 2026` |

## Not needed
ETM-7343 (uses `DAILY_REPORT_*`, set), ETM-8393 (blocked by ETM-8534, not by `.env`), ETM-8449 (set).
ETM-7343 still needs a Daily Report plan that has every colour case (see `script-quality.md`): data, not `.env`.

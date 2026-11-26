# Must regression - stms-fe 99817c2 - summary (26 Nov 2026)

Run 09:46-12:51 (log: `2026-11-26_must-run2.log`). Earlier the same night: ETM-7343 and ETM-8003 passed (25 Nov).
ETM-8391 was not re-run here: its card session ran the whole RemarkFilter spec on the new build and closed the card at 15 PASSED.

| Card | Ran | Passed | Failed | Skipped | Main cause |
|---|---|---|---|---|---|
| ETM-8034 | 13 | 11 | 2 | 0 | 8861: test (copy whole row gives an empty clipboard, card session is asking the user); 8857: needs a look |
| ETM-8042 | 25 | 14 | 9 (+1 flaky) | 1 | data clash: the 8042 card session was changing Plan "QA ETM-8042 8836" dates (8838 manual retest) during this run |
| ETM-8049 | 20 | 14 | 0 | 6 | skipped = manual tests |
| ETM-8393 | 15 | 15 | 0 | 0 | - |
| ETM-8394 | 18 | 17 | 0 | 1 | - |
| ETM-8905 | 55 | 40 | 1 | 14 | data: 7552 found no usable L4 tasks in the SIMOP plan (`SIMOP_LOGIC_PATH`) |
| No card (7901, Equipment Mob Plan, Import Work) | ~80 | 4 | 69 | 7 | setup and data, see below |

## Failures by kind

**Setup (fixed):** about 55 Import Work tests looked for their files in `/Users/np/...` (another computer).
`ETM_6843_DATA_DIR` is now set in the git-ignored `.env` of ep-etm-fe-qa to `STMS/Test Data/ETM-6843` on this Mac (80 files there). Re-run needed.

**Data:**
- Equipment Mob Plan delete (13): "plan should show the Operation header" and plans "Del-EQ" / "QA EMP Del WH Main" not found as expected: the plans these tests need are missing or changed on QA.
- ETM-8042 (9): clash with the card session's manual retest on the same plan. Re-run when no 8042 run is going.
- ETM-8905 / 7552 (1): the SIMOP plan has no pair of L4 tasks that fits.

**Script / to check:**
- ETM-8034 / 8857: "no cell should have a frame on an old row".
- 7901 (2): one test opened as a user who got "Access Denied", one `toBeTruthy` on reset-per-mode.

**App:** none proven in this run.

## Next

Re-run: Import Work (after the `.env` fix), ETM-8042 Must specs, Equipment Mob Plan after its plans are checked.

## Re-run 12:59-13:54 (log: `2026-11-26_rerun-import-8042.log`)

- **ETM-8042 (no clash this time):** 18 passed, 5 failed, 1 flaky (8832). Failures: 8837 Manpower and Equipment Mob Plan Excel export (click timeout), 8842 Extend Daily Report (click timeout), 8831 Edit Shutdown Event Save stays disabled, 8839 Optimization Setting does not open. Sent to the 8042 card session for the heal loop (Phase 7) and a script / data / app call. Xray stays 24/24 PASSED.
- **Import Work (after the `.env` fix):** 52 passed, 3 failed, 5 did not run. All 3 failures are data: the fixed test files 7107, 7122 and 7114 c hold Work UUIDs that no longer exist on QA ("The UUID you entered is not exist in the system"). The files need fresh UUIDs from the current plan.

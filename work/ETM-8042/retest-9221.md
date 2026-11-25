# Retest plan: ETM-9221 (Planned S-Curve end on an old Daily Report)

Defect: ETM-9221 (Open, assignee thanawich klongsard). Story ETM-8042. Xray Test ETM-8849 step 5 (Test Execution ETM-8873).
Rule: BA 24 Nov 2026 (Q9 / DEC-048): the Planned S-Curve ends on the **last execution day = snapshot Ramp Up Date + extended days**. An old report (made before ETM-8042, no snapshot) uses the Event Planned end as its snapshot. Last task end (12 Apr 2027) is wrong.

## When to start
Only after Dev moves ETM-9221 to a fixed / ready-for-retest status and the QA build has the fix. Before that, step 5 stays skipped (never PASSED).

## Data (read only, shared: do not edit, do not freeze days)
- Daily Report "Export 5000" (made before the release, no snapshot), event Planned Date `17 Jun 2026 10:00 - 15 Jul 2026 06:00`.
- URL: `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/75ee62f6-1954-41b4-954d-ab2ca1d183c8/daily-report/31885cb6-33f4-4b5f-94d8-ee1ea1216b77`
- Check first whether the event has extended days. None known today, so the expected end is `15 Jul 2026`. If there are extended days, the expected end moves by that many days.

## Steps (Turnaround Manager, QA)
| # | Action | Expected |
|---|---|---|
| 1 | Open the old Daily Report "Export 5000". | Page opens with no error. |
| 2 | Read the Ramp Up line of the Gantt (last execution day). | `15 Jul 2026` (unchanged from before). |
| 3 | Look at the S-Curve chart: where does the **Planned** line end? Hover the last point. | Ends on `15 Jul 2026` (+ extended days). Not `12 Apr 2027`. |
| 4 | Export the Daily Report to PDF and look at the S-Curve in the PDF. | Same end as on screen (`15 Jul 2026`). |
| 5 | Regression: open a Daily Report made after the release (with a snapshot, e.g. a Plan Scenario A report, Ramp Up `25 Feb 2026 18:00`). | Planned line ends on its snapshot Ramp Up date (+ extended days), not the last task end. |
| 6 | Reload the old report. | Same end date; First Execution Date `16 Jun 2026` unchanged. |

Pictures: full screen, S-Curve end visible with the hover tooltip, before (defect build) is already on ETM-9221; take the after picture per step 3, 4, 5.

## Automation
- Spec: `tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.partial.spec.ts` -g "ETM-8849"
- `run-policy` = **auto** (re-run of a test that ran before).
- Command: `node tools/run-card.mjs ETM-8042 tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.partial.spec.ts -g "ETM-8849"`
- Step 5 in the spec is a note + picture only (`sCurveNote`), step 6 (PDF) is by eye, so the test ends **skipped (partial)**. The S-Curve end must be judged by a person from the picture; skipped is never PASSED in Xray.

## If passed
- Comment "Retest: Passed" on ETM-9221 with the after pictures embedded (check not blank) — needs the user's yes (Jira write).
- Xray ETM-8849 step 5 status only after the user's yes and the person check.

## If still failing
- Comment on ETM-9221 with the new picture and build — needs the user's yes.

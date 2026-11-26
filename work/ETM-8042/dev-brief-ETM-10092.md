# Dev brief: ETM-10092 - Shutdown Logic Excel export fails for a range longer than 1095 days

## 1. What is wrong
The Excel export of the Shutdown Logic fails for a Plan whose Ramp Down/Up range is longer than 1095 days. The API returns 400 `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` and the FE shows a generic "Server Error - An unexpected error occurred. Please try again." No file.

## 2. Where
- Page: Shutdown Logic of a Plan, Export > Excel File.
- QA: stms-qa.apps.pttep.com, event "QA S26 Ramp" (18bf0408-c725-4e84-b419-22e9a9eef29b).
- Role: Turnaround Manager.
- Data: Plan with Ramp Down/Up `15 Feb 2026 08:00 - 15 Feb 2029 20:15` (made in the UI), one work, Logic saved once.

## 3. Steps to reproduce
1. Create Plan with Ramp Down/Up `15 Feb 2026 08:00` - `15 Feb 2029 20:15`.
2. Create its Shutdown Logic, add one work.
3. Open the Shutdown Logic, Save, Confirm.
4. Export > Excel File > Export.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| API | `GET /stms/v1/shutdown-events/{eventId}/logics/{logicId}/gantts/export-gantts` -> 400 `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` ("1097 days exceeds the exportable maximum of 1095 days") | 200 with the Excel file |
| Screen | "Server Error - An unexpected error occurred. Please try again." | File downloaded (or, if the limit is intended, a clear message) |

## 5. Rule source
- ETM-8042 BA answer Q6: no upper limit on the Ramp Down/Up range (format `DD Mmm YYYY HH:mm`).
- Xray: Test Execution ETM-8873, Test ETM-8846 step 4 (Excel shows Ramp Down Date `15 Feb 2026 08:00`, Ramp Up Date `15 Feb 2029 20:15`).
- BA question 14 (25 Nov 2026): is the 1095-day limit intended, and what should the user see.

## 6. Hints for the fix (guess)
BE export use case has a maximum of 1095 days (error text). Either raise/remove it for the Plan range, or (if intended) map `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` to a readable message in the FE (stms-fe `response-message.constant.ts` holds the other export messages). Guess only.

## 7. How QA will retest
`node tools/run-card.mjs ETM-8042 tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.partial.spec.ts -g "ETM-8846"` (creates and deletes the long Plan) and read the Excel file.

## 8. Out of scope / do not change
Excel disabled while the Logic is initial or unsaved (by design, RULES.md 24). Ranges of 1095 days or less export fine (ETM-8837 passes).

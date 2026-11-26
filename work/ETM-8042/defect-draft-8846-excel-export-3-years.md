# Defect draft (not logged): [ETM-8042] Shutdown Logic Excel export fails with "Server Error" for a Plan range longer than 1095 days

**Summary:** [ETM-8042] Shutdown Logic Excel export fails with "Server Error" when the Plan Ramp Down/Up range is longer than 1095 days
**Work type:** Defect (QA) | **Labels:** FE, UI (BE limit, see below) | **Relates:** ETM-8042 | **Xray:** ETM-8873 / ETM-8846 step 4
**Finding:** F-10 (Excel on the 3-year Plan), BA Q6: no upper limit on the Ramp Down/Up range. User decision 25 Nov 2026: log as a defect.

**Environment:** QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Playwright run 2026-11-25_234831_ETM-8042 (25 Nov 2026 23:48).

A Plan can be saved with a long Ramp Down/Up range (BA: no upper limit), but the Excel export of its Shutdown Logic fails. The API answers 400 `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` and the user only sees a generic "Server Error".

### Step to Reproduce
1. Event "QA S26 Ramp" > Planning tab > Create Plan, Plan Name `Plan Scenario Long Name Plan Scenario Long Name 12`, Ramp Down/Up Date `15 Feb 2026 08:00` - `15 Feb 2029 20:15`, Save.
2. On the new Plan Card press Create on the Shutdown Logic row; add one work to its worklist.
3. Open the Shutdown Logic page of that Plan and click Save, Confirm (the Excel option is disabled until the Logic is saved once).
4. Click Export, choose Excel File, click Export.

### Actual Result
- No file is downloaded.
- The screen shows "Server Error - An unexpected error occurred. Please try again."
- API `GET .../logics/<id>/gantts/export-gantts` -> 400 `{"subCode":"GANTT_EXPORT_DATE_RANGE_TOO_LARGE","message":"gantt date range of 1097 days exceeds the exportable maximum of 1095 days"}`.
- Pictures: work/ETM-8042/defect-8846-pics/ETM-8846-01.png (Plan badge with the 3-year range), work/ETM-8042/defect-8846-pics/ETM-8846-04.png (1.5 s after Export: Server Error message).

### Expected Result
- The Excel export of the Shutdown Logic works for the Plan range (BA Q6: no upper limit; ETM-8846 step 4: the Excel file shows Ramp Down Date `15 Feb 2026 08:00` and Ramp Up Date `15 Feb 2029 20:15`).
- If a 1095-day export limit is intended, the BA must state it, and the user must see a clear message instead of "Server Error" (BA question 14 sent).

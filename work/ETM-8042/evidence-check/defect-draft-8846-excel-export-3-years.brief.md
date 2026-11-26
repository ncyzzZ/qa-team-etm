# Evidence check defect-draft-8846-excel-export-3-years (ETM-8042, defect)

sourceHash: e534476cb5fd

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Playwright run 2026-11-25_234831_ETM-8042 (25 Nov 2026 23:48).

A Plan can be saved with a long Ramp Down/Up range (BA: no upper limit), but the Excel export of its Shutdown Logic fails. The API answers 400 `GANTT_EXPORT_DATE_RANGE_TOO_LARGE` and the user only sees a generic "Server Error".

## Steps
1. Event "QA S26 Ramp" > Planning tab > Create Plan, Plan Name `Plan Scenario Long Name Plan Scenario Long Name 12`, Ramp Down/Up Date `15 Feb 2026 08:00` - `15 Feb 2029 20:15`, Save.
2. On the new Plan Card press Create on the Shutdown Logic row; add one work to its worklist.
3. Open the Shutdown Logic page of that Plan and click Save, Confirm (the Excel option is disabled until the Logic is saved once).
4. Click Export, choose Excel File, click Export.

## Expected Result (as the draft states it: check it has a source)
- The Excel export of the Shutdown Logic works for the Plan range (BA Q6: no upper limit; ETM-8846 step 4: the Excel file shows Ramp Down Date `15 Feb 2026 08:00` and Ramp Up Date `15 Feb 2029 20:15`).
- If a 1095-day export limit is intended, the BA must state it, and the user must see a clear message instead of "Server Error" (BA question 14 sent).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8846-excel-export-3-years.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8846-excel-export-3-years.pics/pic-2.png

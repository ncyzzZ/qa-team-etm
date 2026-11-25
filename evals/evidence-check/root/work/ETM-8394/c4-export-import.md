# Defect draft
**Summary:** Exported Worklist cannot be imported back unchanged
**Environment:**
- Environment: QA, `https://stms-qa.apps.pttep.com`.
- Page: Worklist. URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`.
- Import page: Worklist > Create Work > Import Excel ("Import Work and Work Breakdown").
- Role: Turnaround Manager (only a TM can import).
- Test data: event `NN TEST QA`, Worklist `Wide Plan B - NN` (84 Works, 222 Work Breakdowns). Any Worklist with Works shows the same result.

### Step to Reproduce
1. Log in as a Turnaround Manager and open the Worklist `Wide Plan B - NN`.
2. Click the Export icon (tooltip "Export Worklist"). The file `NN TEST QA_Wide Plan B - NN_Worklist_<YYYYMMDD>.xlsx` downloads.
3. Open Create Work > Import Excel and upload the downloaded file. Do not change anything in it.

### Actual Result
- Upload result: "Data Validation Failed. 308 data validation errors were found in the file."
- Rows: Every data row shows "This field is mandatory." on `Action`. First error: Row 5, Cell C5.
- Confirm: Disabled
- Exported file, sheet `Worklist_Data`: Column C `Action` is blank on all 306 data rows. Column `UUID` is filled.
- After Confirm: (not reachable)

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/evidence/ETM-9233/1_worklist_before_export.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/evidence/ETM-9233/2_import_errors_action_mandatory.png

### Expected Result
- Upload result: No error.
- Rows: Every row is valid.
- Confirm: Enabled; the import completes.
- Exported file, sheet `Worklist_Data`: The file can be imported as it is (see open question Q1 for how).
- After Confirm: Every Work Status and Breakdown Status is the same as before. `Change Requested` stays `Change Requested`. `Reviewed` stays `Reviewed`.

Rule source:
- ETM-8394 AC 4: "export then import again keeps each Work's status", including `Change Requested`.
- ETM-8394 AC 3.3: a row counts as edited only when a value differs. An unchanged row is not an edit.
- BA answers, round 3 (DEC-076): both status columns belong to the `Work` row. A status value on a `Work Breakdown` row is ignored and shows no message.

Open BA questions (round 5, `work/ETM-8394/questions-for-BA-round5.md`, not answered yet):
- **Q1. How should `Action` be handled?** Pick one:
  - (a) The export fills `Action = Revise` on every row.
  - (b) The import treats a blank `Action` on a row that has a UUID as `Revise`. A row without a UUID still needs `Action`.
  - (c) The user fills `Action` by hand. In this case this is not a defect.
- **Q2. Should the export follow the Worklist search box and column filters?** Today it always holds the whole Worklist. QA treats that as correct until the BA answers.
- **Q3.** If (b): an unchanged row imports with no change, and `Updated By` / `Updated Date` stay the same.

Please wait for the Q1 answer before you choose the fix.

**Fields:**
- Labels: FE
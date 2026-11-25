# Dev brief: ETM-9233 (Story ETM-8394)

## 1. What is wrong
An exported Worklist cannot be imported back unchanged. The export leaves the `Action` column blank on every row, so the import rejects every row with "This field is mandatory." and `Confirm` stays disabled. ETM-8394 AC 4 needs "export, then import again" to work and keep each Work's status.

## 2. Where
- Environment: QA, `https://stms-qa.apps.pttep.com`.
- Page: Worklist. URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`.
- Import page: Worklist > Create Work > Import Excel ("Import Work and Work Breakdown").
- Role: Turnaround Manager (only a TM can import).
- Test data: event `NN TEST QA`, Worklist `Wide Plan B - NN` (84 Works, 222 Work Breakdowns). Any Worklist with Works shows the same result.

## 3. Steps to reproduce
1. Log in as a Turnaround Manager and open the Worklist `Wide Plan B - NN`.
2. Click the Export icon (tooltip "Export Worklist"). The file `NN TEST QA_Wide Plan B - NN_Worklist_<YYYYMMDD>.xlsx` downloads.
3. Open Create Work > Import Excel and upload the downloaded file. Do not change anything in it.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Upload result | "Data Validation Failed. 308 data validation errors were found in the file." | No error. |
| Rows | Every data row shows "This field is mandatory." on `Action`. First error: Row 5, Cell C5. | Every row is valid. |
| Confirm | Disabled | Enabled; the import completes. |
| Exported file, sheet `Worklist_Data` | Column C `Action` is blank on all 306 data rows. Column `UUID` is filled. | The file can be imported as it is (see open question Q1 for how). |
| After Confirm | (not reachable) | Every Work Status and Breakdown Status is the same as before. `Change Requested` stays `Change Requested`. `Reviewed` stays `Reviewed`. |

## 5. Rule source
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

## 6. Hints for the fix (guesses)
- Seen in the FE source: the export icon calls `GET {baseUrl}/shutdown-events/{eventId}/worklists/{worklistId}/works/export-works` and saves the blob as it is. See `worklist-export.component.ts` `apiExportWorklist()` and `worklist-table.service.ts` `exportWorklist()`.
- The FE sends no search or filter parameters, so the file is built entirely by the backend. *Guess:* for fix (a), the change goes in the backend export builder that writes sheet `Worklist_Data`, Column C `Action`.
- *Guess:* for fix (b), the change goes in the import validation: the rule that makes `Action` mandatory would not apply when `UUID` is filled.
- Seen in the run: the `UUID` column is filled in the exported file, so the rows can be matched to existing Works.

## 7. How QA will retest
- Xray Test **ETM-8755** (Test Execution ETM-8774). The failing step is step 3: "Upload the exported file unchanged".
- Pass criteria:
  - The unchanged export uploads with no error and `Confirm` is enabled.
  - The import completes.
  - All Work Status and Breakdown Status values are the same as before the export.
  - Uploading the same file again as a second TM also gives no error and no change.
- Regression: a row with no UUID and a blank `Action` still gives "This field is mandatory."
- If the BA answers Q2 with "follow the filter", QA will also check that a search-filtered export holds only the filtered Works.

## 8. Out of scope / do not change
- The rule that new rows (no UUID) must have `Action`.
- The status rules of ETM-8394 (AC 3.x, AC 4 row rule, AC 6 master data, AC 7 Delete ignores status).
- The existing error messages and banner wording, including the singular "1 data validation error" for one error.
- The export file name and template layout (sheet names, column order), except the `Action` column itself.
- Export filtering: leave it as it is until the BA answers Q2.

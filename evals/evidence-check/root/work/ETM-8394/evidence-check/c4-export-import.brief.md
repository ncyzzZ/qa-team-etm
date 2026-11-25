# Evidence check c4-export-import (ETM-8394, defect)

sourceHash: 313a12c5445b

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
- Environment: QA, `https://stms-qa.apps.pttep.com`.
- Page: Worklist. URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`.
- Import page: Worklist > Create Work > Import Excel ("Import Work and Work Breakdown").
- Role: Turnaround Manager (only a TM can import).
- Test data: event `NN TEST QA`, Worklist `Wide Plan B - NN` (84 Works, 222 Work Breakdowns). Any Worklist with Works shows the same result.

## Steps
1. Log in as a Turnaround Manager and open the Worklist `Wide Plan B - NN`.
2. Click the Export icon (tooltip "Export Worklist"). The file `NN TEST QA_Wide Plan B - NN_Worklist_<YYYYMMDD>.xlsx` downloads.
3. Open Create Work > Import Excel and upload the downloaded file. Do not change anything in it.

## Expected Result (as the draft states it: check it has a source)
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

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8394/evidence-check/c4-export-import.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8394/evidence-check/c4-export-import.pics/pic-2.png

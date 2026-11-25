# ETM-8394 Questions for BA, round 5 (Defect ETM-9233, 24 Nov 2026)

> **2026-11-25 update:** Q1 and Q3 are closed (QA lead: blank `Action` in the export is correct, the user fills it before import; Defect ETM-9233 withdrawn). Only Q2 is still open.

**Story:** [Improvement] Import Work and Work Breakdown - Import Work Status and Breakdown Status
**Defect:** ETM-9233 "Exported Worklist cannot be imported back unchanged" (found by Xray Test ETM-8755, Test Execution ETM-8774).
⭐ = affects an Expected Result directly. Each question says what QA assumes until you answer.

**What QA saw on QA (Worklist "Wide Plan B - NN", Turnaround Manager):**
- `Export Worklist` downloads a file whose sheet `Worklist_Data` has the `Action` column (Column C) blank on all 306 data rows (84 Work, 222 Work Breakdown). The `UUID` column is filled.
- Uploading that file unchanged gives "Data Validation Failed. 308 data validation errors were found in the file." Every row shows "This field is mandatory." on `Action`. `Confirm` is disabled.
- The file holds the whole Worklist, even when the list on screen was filtered with the search box.

1. ⭐ **What should `Action` be in an exported file?**
   AC 4 says "export then import again keeps each Work's status" (including `Change Requested`). Today this is not possible without editing the file.
   Options:
   - (a) The export fills `Action = Revise` on every row (all rows already have a UUID).
   - (b) The export leaves `Action` blank, and the import treats a blank `Action` on a row **with a UUID** as `Revise` (a row without a UUID still needs `Action`).
   - (c) Blank is correct and the user must fill `Action` before importing. Then AC 4 needs a note that the file must be edited first.

   **QA assumes:** (a) or (b), both make AC 4 true, so ETM-9233 stays a defect. If you choose (c), QA will close ETM-9233 as "not a defect", change ETM-8755 step 3 to "fill `Action = Revise` on every row, then upload", and run it again.

2. ⭐ **Should the export follow the Worklist search / column filters?**
   Today the export ignores the search box and the column filters and always holds every Work of the Worklist.
   Test ETM-8755 step 1 says "Export the Worklist with the seven Works", i.e. QA expected the export to follow the filtered list.

   **QA assumes:** the export holds the whole Worklist (no filter), which is the behaviour today, and this part is **not** a defect. If the export must follow the filter, please say which filters count (search box only, or the column filters too), and QA will add it to ETM-9233 or log it separately.

3. **Rows with errors in a re-imported export (only if 1 is (b)).**
   If a blank `Action` on a UUID row means `Revise`, an unchanged row is "not edited" (AC 3.3), so it should import with no error and no change. QA will check that the whole file imports, the statuses stay the same, and `Updated By` / `Updated Date` do not change for unchanged rows. Please confirm this is the expected result.

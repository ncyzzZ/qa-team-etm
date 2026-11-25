# Dev brief: ETM-9223

Story: ETM-8049 (Worklist: Working Location columns). Defect: ETM-9223.

## 1. What is wrong

Import Excel rejects a Working Location (Deck) cell whose values differ only by letter case (`Helipad,helipad`). The error is "The values entered in this multi-value cell contain duplicates. Each value must be unique." The BA says values that differ only by letter case are separate values, so the import must accept both.

## 2. Where

- Page: Worklist > Create Work > Import Excel.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Scratch`. File `work/ETM-8049/F27-import-Helipad-helipad.xlsx`, made from `[Template] Import Worklist.xlsx` (V2): 1 Work `WK-F27-1` and 1 Work Breakdown, Deck cells R5 and R6 = `Helipad,helipad`, all other fields valid.

## 3. Steps to reproduce

1. Open the Worklist of Plan `QA ETM-8049 Scratch`.
2. Click Create Work > Import Excel.
3. Select the file above.

## 4. Actual vs Expected

- Actual: "Data Validation Failed. 2 data validation errors were found in the file." Row 5 Cell R5 and Row 6 Cell R6, field "Working Location (Deck)": "The values entered in this multi-value cell contain duplicates. Each value must be unique." Import stays disabled; nothing is created.
- Expected: the file passes validation. The Work and the Work Breakdown are created with Deck `Helipad` and `helipad` as two separate values.

## 5. Rule source

- ETM-8049 AC 6.2: "A value that does not match Master Data is saved exactly as entered. ... Values that differ only by letter case are stored and shown as separate values (AC 2.1, AC 3.6)."
- ETM-8049 AC 6.1 lists Excel import as an entry point: "Create Multiple Work via Excel Import (ETM-1008, ETM-1106) and Import Work and Work Breakdown from Excel (ETM-6843)".
- BA answer Q27 (24 Nov 2026): "Import accepts both `Helipad` and `helipad` (DEC-046)." This replaces an earlier reading of ETM-1106 AC 4.5 / ETM-1230 AC 3.1 (two case variants in one cell are duplicates).
- BA answer Q32 (24 Nov 2026): "Create Work and Edit Work Breakdown both accept several Deck values in one cell."

## 6. Hints for the fix (guesses, not checked in code)

- Guess: the duplicate check of multi-value cells in the import validation compares values ignoring case. For Deck it should compare exactly (same spelling = duplicate, case variant = not a duplicate).
- Guess: if this check is shared with other multi-value fields, check with BA before changing the others.
- Only `Helipad` / `helipad` were tried. Neither matches Master Data in a way that would convert it, as far as we know. If one of them is a Master Data value, AC 6.1 converts it first and then the two may become equal; ask BA how to handle that case.
- We did not read the FE source or the network log for this defect. We do not know if this check runs in FE or BE.

## 7. How QA will retest

- Manual: Xray ETM-8786 step 2 (Excel import of Deck values), with the same file.
- Pass: no validation error on R5/R6, Import is enabled, `WK-F27-1` and its breakdown show Deck `Helipad` and `helipad` as two values. Control: `Helipad,Helipad` (same spelling) is still rejected as a duplicate.
- Related, same rule, no defect yet: TC-015 (ETM-8788), the Create Work form will not add `DOCK AREA` after `Dock Area` in one cell (question Q34 to BA). QA will re-run it after the fix.

## 8. Out of scope / do not change

- Exact duplicates (same spelling) must still be rejected.
- Do not change the Master Data conversion of AC 6.1 for values that match Master Data.
- Do not change other import fields or other import errors.

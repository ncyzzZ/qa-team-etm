# Defect draft
**Summary:** Import rejects Helipad,helipad in one Deck cell
**Environment:**
- Page: Worklist > Create Work > Import Excel.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Scratch`. File `work/ETM-8049/F27-import-Helipad-helipad.xlsx`, made from `[Template] Import Worklist.xlsx` (V2): 1 Work `WK-F27-1` and 1 Work Breakdown, Deck cells R5 and R6 = `Helipad,helipad`, all other fields valid.

### Step to Reproduce
1. Open the Worklist of Plan `QA ETM-8049 Scratch`.
2. Click Create Work > Import Excel.
3. Select the file above.

### Actual Result
- Actual: "Data Validation Failed. 2 data validation errors were found in the file." Row 5 Cell R5 and Row 6 Cell R6, field "Working Location (Deck)": "The values entered in this multi-value cell contain duplicates. Each value must be unique." Import stays disabled; nothing is created.

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/F27-import-rejected-2026-11-24.jpg

### Expected Result
- Expected: the file passes validation. The Work and the Work Breakdown are created with Deck `Helipad` and `helipad` as two separate values.

Rule source:
- ETM-8049 AC 6.2: "A value that does not match Master Data is saved exactly as entered. ... Values that differ only by letter case are stored and shown as separate values (AC 2.1, AC 3.6)."
- ETM-8049 AC 6.1 lists Excel import as an entry point: "Create Multiple Work via Excel Import (ETM-1008, ETM-1106) and Import Work and Work Breakdown from Excel (ETM-6843)".
- BA answer Q27 (24 Nov 2026): "Import accepts both `Helipad` and `helipad` (DEC-046)." This replaces an earlier reading of ETM-1106 AC 4.5 / ETM-1230 AC 3.1 (two case variants in one cell are duplicates).
- BA answer Q32 (24 Nov 2026): "Create Work and Edit Work Breakdown both accept several Deck values in one cell."

**Fields:**
- Labels: FE
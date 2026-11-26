# ETM-8034 manual steps: ETM-8861 (copy / paste and Duplicate with row colours)

Test Execution: ETM-8875. Environment: QA only. Plan: the ETM-8034 plan (`ep-etm-fe-qa/.env` `ETM8034_PATH`, Shutdown Logic page). Log in as Turnaround Manager.
Before testing, collapse the Manpower Resource histogram (button `Hide histogram` inside `sl-splitter-horizontal`, shown on hover). Collapse it again after every reload.
Steps 1-2 follow the Xray text changed on 2026-11-26 (cell-range copy, user chose "เปลี่ยนวิธี copy"). The row copy by double-click on No. copies nothing (FE known D4); do not use it.
In the script run of 26 Nov, Ctrl+V of step 2 threw `TypeError ... reading 'rowIndex'` in the console and nothing was pasted. If that happens here, write the console error, take the picture and mark step 2 `fail` (do not retry more than twice).
"Right-click the row" for colours = double-click the No. cell of the row, then right-click it (menu shows `Highlight Row`).

## ETM-8861 - Copy / paste copies only values, Duplicate copies both colours (11 steps)

writes data: yes (step 10 saves a duplicated Work Breakdown row with text colour 722ED1 and the source colours D9F7BE / 722ED1 on the card plan; cleanup after step 11 deletes the duplicated row, sets the source row to No Color and saves)
start: ETM8034_PATH
Precondition for steps 1-4 (on screen, not saved): pick two Work rows under one Work Header. Source Work row: `Highlight Row` FFE58F and `Change Text Color` D48806. Target Work row: `Highlight Row` B5F5EC. Write down both Description texts.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the Description cell of the coloured (source) Work row, Shift+click its Remark cell and press Ctrl+C | The selected cells (Description to Remark) are copied | source row with the cell range selected |
| 2 | Click the Description cell of the target Work row and press Ctrl+V | The pasted Description text appears in the target row (Duration to Remark are copied blank by design and leave the target unchanged) | target row |
| 3 | Check the target row | The target row still has its own `B5F5EC` background and the default text colour; it does not get `FFE58F` or `D48806` | target row |
| 4 | Check the original row | The original row still has `FFE58F` and `D48806` | source row |
| 5 | First reload without Save (throws away the paste and Work colours) and collapse the histogram again; on a Work with two Work Breakdown rows set `Highlight Row` D9F7BE and `Change Text Color` 722ED1 on Work Breakdown 1 (on screen; Work Breakdown 2 has no colour). Then right-click the coloured Work Breakdown row and choose `Duplicate` | A new Work Breakdown row appears | Work and its Work Breakdown rows, before and after |
| 6 | Check the new row | The new row has the background `D9F7BE` and the text `722ED1` in all columns | new row |
| 7 | Check the source row | The source row still has `D9F7BE` and `722ED1` | source row |
| 8 | Check the other Work Breakdown row | It has no colour | other row |
| 9 | Right-click the new row, open `Highlight Row` and choose `No Color` | The new row returns to the default background; the source row keeps `D9F7BE` | new and source rows |
| 10 | Click `Save`, then confirm `Save Shutdown Logic and Update Worklist` | The toast `Save Success` appears | page with the toast |
| 11 | Reload the page (collapse the histogram again) | The source row has `D9F7BE` and `722ED1`; the new row has no highlight and the text `722ED1` | Work and its Work Breakdown rows |
Cleanup (after step 11, always, even after a fail): right-click the new row, `Delete Work Breakdown` (confirm), set `Highlight Row` and `Change Text Color` of the source row to `No Color`, then Save.

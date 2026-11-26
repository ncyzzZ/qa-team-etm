# ETM-8034 manual steps: ETM-8860 (colour only on the right-clicked row; kept after collapse, expand, move and Save)

Test Execution: ETM-8875. Environment: QA only. Plan: the card-owned TM plan (`ep-etm-fe-qa/.env` `ETM8034_TM_PATH`, event "QA ETM-8034", Shutdown Logic page). Log in as Turnaround Manager.
Before testing, collapse the Manpower Resource histogram (button `Hide histogram` inside `sl-splitter-horizontal`, shown on hover). Collapse it again after every reload.
"Right-click the row" for colours = double-click the No. cell of the row, then right-click it (menu shows `Highlight Row`). On this build one click on a data cell does not select a row; for step 6 use a click on the No. cell (or double-click it) and write which one worked.
Row drag: in the script the drag did not move the row (from a data cell or from the No. cell). Try the drag handle on the No. cell with slow mouse moves (mouse down, several small moves, mouse up). Try at most 3 ways; if the row never moves, write each way tried, take the picture and mark the step `fail`, then go on (steps 21+ still judged where possible).
Rows: Platform 1 has Work Header 1 and Work Header 2; Work Header 1 has Work A and Work B (Work A above Work B) and Work A has at least one Work Breakdown; Platform 2 is another Platform. Write down the names.

## ETM-8860 - Colour only on the right-clicked row, kept after collapse, expand, move and Save (27 steps)

writes data: yes (step 22 saves the colours of Platform 1 / Work Header 1 / Work A and the new order Work A below Work B on the card-owned TM plan; steps 24-27 moves are NOT saved; cleanup puts Work A back above Work B, sets those rows to No Color and saves)
start: ETM8034_TM_PATH
Precondition (on screen, not saved): Work A `Highlight Row` B5F5EC; every other row has no colour.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Right-click the Platform 1 row, open `Highlight Row` and choose `FFCCC7` | The Platform 1 row has the background `FFCCC7` in all columns | Platform 1 row, before and after |
| 2 | Right-click the Platform 1 row, open `Change Text Color` and choose `F5222D` | The Platform 1 row text is `F5222D` in all columns | Platform 1 row |
| 3 | Check the Work Header, Work and Work Breakdown rows under it | They show no `FFCCC7` and no `F5222D` | rows under Platform 1 |
| 4 | Check Work A with its own colour | Work A still has `B5F5EC` as background | Work A |
| 5 | Right-click the Work Header 1 row, open `Highlight Row` and choose `FFFB8F` | Only the Work Header 1 row changes; the Work and Work Breakdown rows stay as before | Work Header 1 and its rows |
| 6 | Click the Work A row once | Work A is selected | Work A |
| 7 | Right-click the Work B row, open `Highlight Row` and choose `FFE58F` | Work B has the background `FFE58F` in all columns | Work B |
| 8 | Check Work A | Work A still has `B5F5EC` as background | Work A |
| 9 | Right-click the Work B row, open `Change Text Color` and choose `FA541C` | Work B has the text `FA541C`; Work A has the default text colour | Work A and Work B |
| 10 | Right-click the Work B row, open `Highlight Row` and choose `No Color` | The Work B background returns to the default | Work B |
| 11 | Right-click the Work B row, open `Change Text Color` and choose `No Color` | The Work B text returns to the default | Work B |
| 12 | Right-click the Work A row, open `Highlight Row` and choose `BAE0FF` | The Work A background is `BAE0FF` (it replaces `B5F5EC`) | Work A |
| 13 | Right-click the Work A row, open `Change Text Color` and choose `08979C` | The Work A text is `08979C` | Work A |
| 14 | Right-click the Work Header 1 row, open `Highlight Row` and choose `BAE0FF` | The Work Header 1 background is `BAE0FF` (it replaces `FFFB8F`) | Work Header 1 |
| 15 | Right-click the Work Header 1 row, open `Change Text Color` and choose `08979C` | The Work Header 1 text is `08979C` | Work Header 1 |
| 16 | Right-click the Platform 1 row, open `Highlight Row` and choose `BAE0FF` | The Platform 1 background is `BAE0FF` (it replaces `FFCCC7`) | Platform 1 |
| 17 | Right-click the Platform 1 row, open `Change Text Color` and choose `08979C` | The Platform 1 text is `08979C` | Platform 1 |
| 18 | Collapse Work Header 1 | The Work rows are hidden | Work Header 1 |
| 19 | Expand Work Header 1 again | Work A is shown with the background `BAE0FF` and the text `08979C` | Work A |
| 20 | Drag Work A below Work B inside Work Header 1 | Work A is below Work B and keeps `BAE0FF` and `08979C` | Work Header 1 rows, before and after |
| 21 | Check Work B | Work B has no colour (it did not receive the colour of the position) | Work B |
| 22 | Click `Save`, then confirm `Save Shutdown Logic and Update Worklist` | The toast `Save Success` appears | page with the toast |
| 23 | Reload the page (collapse the histogram again) | Work A is still below Work B and keeps `BAE0FF` and `08979C` | Work Header 1 rows |
| 24 | Drag Work Header 1 below Work Header 2 (do not Save) | Work Header 1 keeps `BAE0FF` and `08979C` after the move | Platform 1 rows |
| 25 | Check Work Header 2 | Work Header 2 has no colour | Work Header 2 |
| 26 | Drag Platform 1 below Platform 2 (do not Save) | Platform 1 keeps `BAE0FF` and `08979C` after the move | Platform rows |
| 27 | Check Platform 2 | Platform 2 has no colour | Platform 2 |
Cleanup (always, even after a fail): reload without Save (drops the moves of steps 24-26); if Work A is saved below Work B, drag it back above Work B; set `Highlight Row` and `Change Text Color` to `No Color` on Work A, Work B, Work Header 1 and Platform 1; Save; reload and check.

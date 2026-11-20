# ETM-8388 manual steps: ETM-8729, ETM-8730 (real Excel)

Test Execution: ETM-8732. Environment: QA only. Take one screenshot per step (every step needs a picture in Xray).
On a Mac use Cmd instead of Ctrl. Use Excel (desktop), not Google Sheets.

## Before you start (both tests)
- Log in as a user with Update Progress and Edit Plan on the spare event (`TL_SPARE_EVENT_ID` in `ep-etm-fe-qa/.env`).
- The plan has `Maintenance Group` with `Piping Inspection`, `Valve Overhaul`, `Pump Check` (Status `Open`), each covering weeks 01 Jun, 08 Jun, 15 Jun 2026 with empty Actual (%).
- If the automated runs left other values, reload the Timeline first and check the three Status cells show `Open`.

## ETM-8729 - Timeline (6 steps)
needs: excel
Excel sheet: A1 `close`, A2 `OPEN`, A3 `Close`; C1 `10`, D1 `20.5`, E1 `30` (plain numbers, General format).

| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | In Excel select A1:A3, press Ctrl+C | Excel shows the moving border around A1:A3 | Excel with the copied range |
| 2 | Timeline: click the Status cell of `Piping Inspection`, press Ctrl+V | Status: `Piping Inspection` Close, `Valve Overhaul` Open, `Pump Check` Close (official spelling, Open red, Close green); no modal | the three Status cells |
| 3 | In Excel select C1:E1, press Ctrl+C | moving border around C1:E1 | Excel with the copied range |
| 4 | Timeline: click the weekly Actual (%) cell of week 01 Jun 2026 of `Piping Inspection`, press Ctrl+V | weeks 01 Jun, 08 Jun, 15 Jun show `10.0`, `20.5`, `30.0`; no modal | the Actual (%) row |
| 5 | Timeline: click the Status cell of `Piping Inspection`, Shift+click the Status cell of `Pump Check`, press Ctrl+C | the three Status cells stay selected | the selection |
| 6 | In Excel click G1, press Ctrl+V | G1 `Close`, G2 `Open`, G3 `Close` (three rows, one column, no extra empty row of text) | Excel after paste |

After: do NOT click Update Progress; reload the page (or leave without saving) so the data stays clean.

## ETM-8730 - Edit Plan (4 steps)
needs: excel
Excel sheet, one row: A1 `Pipe Test`, B1 `Team A`, C1 `Anan`, D1 date 05/06/2026, E1 date 12/06/2026. Format D1:E1 as custom `dd mmm yyyy`, so the cells show `05 Jun 2026` and `12 Jun 2026`.

| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | In Excel select A1:E1, press Ctrl+C | moving border around A1:E1 | Excel with the copied range |
| 2 | Edit Plan: click the Activity cell of `Piping Inspection`, press Ctrl+V | Activity `Pipe Test`, Action By `Team A`, Focal Point `Anan`, Start Date `05 Jun 2026`, End Date `12 Jun 2026`; weekly Plan (%) recalculated for the new dates; no modal | the `Piping Inspection` row |
| 3 | Select the Activity cell, Shift+click the End Date cell of that row, press Ctrl+C | the five cells stay selected | the selection |
| 4 | In Excel click A3, press Ctrl+V | A3:E3 show `Pipe Test`, `Team A`, `Anan`, `05 Jun 2026`, `12 Jun 2026` in five cells of one row | Excel after paste |

After: click `Back` > `Discard Change` (do not Save).

## Record also (not pass/fail, for BA)
- Step 2 of 8730: if Excel puts the date as a number (e.g. `46178`) or another format in the clipboard, note what the cell shows.
- Any extra empty row, quote marks or trailing tab after the paste back into Excel.

## If a step fails
Note the step number and send the picture; the lead asks you script bug / wrong test / real app bug before any defect.

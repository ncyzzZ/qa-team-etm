# ETM-8722 step 4 – data for a hand test (24 Nov 2026)

Page (QA, spare event): https://stms-qa.apps.pttep.com/shutdown-event-list/events/804025e1-0eb2-48cc-8f56-57179fdacab8/timeline/edit-plan

## Before
1. If the page still has the earlier test changes: click `Back` -> `Discard Change`, open the link again.
2. `Maintenance Group` must show `Piping Inspection`, `Valve Overhaul`, `Pump Check` (3 rows). If not, tell the lead before going on.

## Excel data (2 columns, 3 rows, NO dates)
Type in a new sheet, one value per cell:

| | A (Activity) | B (Action By) |
|---|---|---|
| 1 | Task 1 | Team A |
| 2 | Task 2 | Team B |
| 3 | Task 3 | Team C |

Select A1:B3 and copy (Cmd+C).

## Steps
| # | Do | Expected (AC 3.1) | Picture |
|---|---|---|---|
| 1 | Click once on the Activity cell of `Pump Check` (last row of the group), press Cmd+V | `Pump Check` -> `Task 1` / `Team A`; two new rows `Task 2` / `Team B` and `Task 3` / `Team C` at the bottom of `Maintenance Group`; no modal | the group |
| 2 | Look at the Start Date and End Date cells of the two new rows (do not click them) | empty and **red** `#FFCCC7`; `Save` disabled | the two new rows with the date columns |

Write down for each new row: Start Date red or white, End Date red or white.

## After
`Back` -> `Discard Change`. Do not Save.

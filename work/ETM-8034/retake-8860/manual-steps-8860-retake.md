# ETM-8034 manual steps: ETM-8860 picture re-take (steps 6 and 27), nothing saved

Test Execution: ETM-8875. Environment: QA only. Plan: card-owned TM plan (`ETM8034_TM_PATH`). Log in as Turnaround Manager.
Collapse the Manpower Resource histogram after every load and reload (button `Hide histogram` inside `sl-splitter-horizontal`; a dispatched click works when an overlay blocks a normal click). Keep it collapsed in every picture.
Only new pictures for Xray steps 6 and 27 of ETM-8860 (run of 26 Nov 16:48 passed; the blind check could not see step 6 selection and step 27 Platform 2 was off screen). Nothing is saved: reload without Save at the end.
Drag that works: mouse down on the No. cell, about 12 small moves with short pauses, mouse up in the lower third of the target row.

## ETM-8860 - picture re-take (2 steps)

writes data: no (colours and moves are on screen only; reload without Save at the end)
start: ETM8034_TM_PATH
Precondition (on screen, not saved): Platform 1 `Highlight Row` BAE0FF and `Change Text Color` 08979C.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | (Xray step 6) Click the No. cell of the Work A row once | Work A is selected: the picture shows the selected look (focused No. cell and selected Gantt bar of Work A), with Work A and its Gantt bar both in view | full viewport, Work A row and its Gantt bar in view |
| 2 | (Xray step 27) Drag Platform 1 below Platform 2 (do not Save), scroll so the Platform 2 row itself is in view, then check Platform 2 | Platform 2 has no colour; Platform 1 keeps BAE0FF and 08979C | full viewport with the Platform 2 row and the Platform 1 row in view |

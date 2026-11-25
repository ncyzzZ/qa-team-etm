# ETM-8391 manual steps: retest of Defect ETM-8902 (blank page after the breadcrumb with the Remark Blank filter)

Test Execution: ETM-8874 (no Test step covers this flow; closest Test ETM-8662). Environment: QA only (https://stms-qa.apps.pttep.com). One picture per step.
Log in as Turnaround Manager.

## Data (`ep-etm-fe-qa/.env`, block ETM-8391)
- Worklist `S26 Remark Set`: `WL_REMARK_SET_PATH`.

## Before you start
- The worklist page opens and shows the table with the Remark column.
- The Remark filter has the option `-` (Blank). If it does not, every step needs-human.

## ETM-8902 - Return to the worklist through the breadcrumb with the Remark Blank (-) filter (5 steps)
writes data: no
role: turnaroundManager
start: WL_REMARK_SET_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the worklist `S26 Remark Set` | The worklist page shows the table with the Remark column | Worklist table |
| 2 | Open the Remark column filter, untick `Select All`, tick `-`, click `Apply` | Only works with a blank Remark are listed and the filter is shown as applied | Table after the filter |
| 3 | Open the edit page from a row (row menu → `Edit Work Details`, or the nearest edit action of the row). Do not change or save anything | The edit page opens and the breadcrumb at the top shows a link back to the worklist | Edit page with breadcrumb |
| 4 | Click the worklist link in the breadcrumb (e.g. `S26 Remark Set` / `Worklist`) | The worklist page opens again with the table and the filter bar shown, not an empty page | Worklist page after the breadcrumb |
| 5 | Look at the Remark filter and the address | The Remark filter is either kept (only `-` ticked) or cleared; the page is never empty and shows no error | Remark filter state |

Pass: steps 4 and 5 match (the page is never empty). If step 3 cannot find an edit action from the row, steps 3-5 are needs-human. Nothing is saved: leave the edit page only by the breadcrumb.

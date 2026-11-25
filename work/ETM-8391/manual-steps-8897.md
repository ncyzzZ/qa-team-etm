# ETM-8391 manual steps: retest of Defect ETM-8897 (Remark Blank (-) selection kept in the address and after reload)

Test Execution: ETM-8874 (automated Tests ETM-8662 / ETM-8655 are blocked by an unknown extra work `34124` in `S26 Remark Set`; the user said not to delete it, so this retest uses worklist A). Environment: QA only (https://stms-qa.apps.pttep.com). One picture per step.
Log in as Turnaround Manager.

## Data (`ep-etm-fe-qa/.env`, block ETM-8391)
- Worklist A: `WL_REMARK_A_PATH` (normal Remarks plus ONE Blank work with an empty Remark).

## Before you start
- The worklist page opens and shows the table with the Remark column.
- The Remark filter has the option `-` (Blank). If it does not, every step needs-human.

## ETM-8897 - Blank (-) selection is kept in the address and after reload (5 steps)
writes data: no
role: turnaroundManager
start: WL_REMARK_A_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open worklist A | The worklist page shows the table with the Remark column | Worklist table |
| 2 | Open the Remark column filter, untick `Select All`, tick only `-`, click `Apply` | Only the work with a blank Remark is listed | Table after the filter |
| 3 | Read the page address | The Remark filter part of the address carries the Blank selection; it does not read `null` (e.g. no `wsRemarks=null`) | Address bar text (write the URL in the note) |
| 4 | Reload the page | The table still lists only the work with a blank Remark | Table after reload |
| 5 | Open the Remark filter again | Only `-` is ticked; `Select All` is not ticked | Open filter after reload |

Pass: steps 3, 4 and 5 match. Nothing is saved.

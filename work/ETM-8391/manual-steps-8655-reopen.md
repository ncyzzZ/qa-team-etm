# ETM-8391 manual steps: check for ETM-8655 step "Untick Note 1" (is the Blank `-` tick kept when the Remark filter is opened again?)

Test Execution: ETM-8874. Environment: QA only (https://stms-qa.apps.pttep.com). One picture per step. This is a diagnosis check, not a full run of ETM-8655: its verdict is never pushed to Xray.
Why: run 2026-11-24_215445 read the reopened panel from the top and found only `Note 10` ticked; `-` (first option) was not ticked although the table was still filtered to Note 1, Note 10 and the Blank works.
Log in as Turnaround Manager.

## Data (`ep-etm-fe-qa/.env`, block ETM-8391)
- Worklist `S26 Remark Set`: `WL_REMARK_SET_PATH` plus `?assetName=ART&field=ART` (on 25 Nov the address without it showed Page Not Found) (W05 `Note 1`, W07 `Note 10`, W11 empty Remark, W13 Remark `-`). Work `34124` (not ours, do not delete) may also show as Blank.

## Before you start
- The worklist page opens with the Remark column and no filter on (Reset Table Filter if one is on).

## ETM-8655 - Blank tick is kept when the Remark filter is opened again (7 steps)
writes data: no
role: turnaroundManager
start: WL_REMARK_SET_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Remark column filter, untick `Select All`, tick `Note 1` and `Note 10`, click `Apply` | Only W05 and W07 are listed | Table after the filter |
| 2 | Open the Remark filter again, tick `-`, click `Apply` | W05, W07 and the Blank works are listed | Table after the filter |
| 3 | Open the Remark filter again. Change nothing. Scroll the list to the top | `-`, `Note 1` and `Note 10` are ticked | Open Remark filter, top of the list |
| 4 | Untick `Note 1` (do not click Apply yet) | `-` and `Note 10` stay ticked | Open Remark filter after the untick |
| 5 | Click `Apply` | W07 and the Blank works are listed | Table after Apply |
| 6 | Open the Remark filter again and untick `Note 10` (do not click Apply yet). Scroll the list to the top | Only `-` stays ticked | Open Remark filter after the untick, top of the list |
| 7 | Click `Apply` | Only the Blank works are listed (W14 `--` is not shown) | Table after Apply |

Pass: steps 3 to 7 match. Steps 6-7 added 25 Nov: the script (run 09:51) read `-` as unticked right after unticking Note 10, while the step before read it ticked. If step 3 shows `-` unticked, write down the page address (`wsRemarks=...`). Nothing is saved.

# ETM-8391 manual steps: check for ETM-8658 step 7 (does Apply on a reopened Remark filter clear the Job Owner filter?)

Test Execution: ETM-8874. Environment: QA only (https://stms-qa.apps.pttep.com). One picture per step. This is a diagnosis check, not a full run of ETM-8658: its verdict is never pushed to Xray.
Log in as Turnaround Manager.

## Data (`ep-etm-fe-qa/.env`, block ETM-8391)
- Worklist `S26 Remark Set`: `WL_REMARK_SET_PATH` (W05 Remark `Note 1`, Job Owner `Somchai Test`; W06 Remark `Note 2`).

## Before you start
- The worklist page opens with the Remark and Job Owner columns and no filter on (Reset Table Filter if one is on).

## ETM-8658 - Apply on a reopened Remark filter keeps the Job Owner filter (6 steps)
writes data: no
role: turnaroundManager
start: WL_REMARK_SET_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Remark column filter, untick `Select All`, tick `Note 1` and `Note 2`, click `Apply` | Only W05 and W06 are listed | Table after the Remark filter |
| 2 | Open the Job Owner column filter, untick `Select All`, tick only `Somchai Test`, click `Apply` | Only W05 is listed | Table after the Job Owner filter |
| 3 | Open the Remark column filter again. Change nothing. Write down which options are ticked | Only `Note 1` and `Note 2` are ticked | Open Remark filter |
| 4 | Click `Apply` | Only W05 is still listed (Total Results 1) | Table after Apply |
| 5 | Type `W05` in the search box `Search work number and job description` and press Enter | Only W05 is listed | Table after the search |
| 6 | Click `Reset Table Filter` and clear the search box | All works are listed again | Table after reset |

Pass: steps 3, 4 and 5 match. If step 4 lists all works, note whether the Job Owner filter icon still shows as active and which options its panel shows ticked. Nothing is saved.

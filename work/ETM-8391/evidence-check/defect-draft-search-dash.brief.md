# Evidence check defect-draft-search-dash (ETM-8391, defect)

sourceHash: 6266bbf434eb

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), role Turnaround Manager, Worklists of two Plans on event NN TEST QA. Found 25 Nov 2026 by Playwright ETM-8656 step 14, re-proved by hand on 25 Nov with data that can be entered on the screen.

In the Worklist, the Remark column filter shows works with a Blank Remark as the option `-`. Typing `-` in the Search box of that filter finds nothing ("No matches."), although `-` is in the option list. This happens both when the Remark is empty and when the Remark is exactly `-` typed by the user.

Data (both can be entered on the screen):
- Plan A: W01 Remark `Test`, W05 Remark `Note 1`, W11 Remark empty.
- Plan C: W01 Remark `Test`, W05 Remark `Note 1`, W13 Remark `-`.

## Steps
1. Log in as Turnaround Manager and open the Worklist of Plan A (or Plan C).
2. Open the filter on the Remark column. The options are `-`, `Note 1`, `Test`.
3. Type `-` in the Search box of the filter.

## Expected Result (as the draft states it: check it has a source)
The option `-` is listed after typing `-`, so the user can tick it from the search (Xray ETM-8656 steps 14 and 15: typing `-` lists the hyphen options including `-`; tick only `-` shows only the Blank works).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8391/evidence-check/defect-draft-search-dash.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8391/evidence-check/defect-draft-search-dash.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8391/evidence-check/defect-draft-search-dash.pics/pic-3.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8391/evidence-check/defect-draft-search-dash.pics/pic-4.png

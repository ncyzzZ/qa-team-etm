# [ETM-8391] Remark filter: searching "-" does not find the Blank option "-" (No matches.)

**Environment:** QA (https://stms-qa.apps.pttep.com), role Turnaround Manager, Worklists of two Plans on event NN TEST QA. Found 25 Nov 2026 by Playwright ETM-8656 step 14, re-proved by hand on 25 Nov with data that can be entered on the screen.

In the Worklist, the Remark column filter shows works with a Blank Remark as the option `-`. Typing `-` in the Search box of that filter finds nothing ("No matches."), although `-` is in the option list. This happens both when the Remark is empty and when the Remark is exactly `-` typed by the user.

Data (both can be entered on the screen):
- Plan A: W01 Remark `Test`, W05 Remark `Note 1`, W11 Remark empty.
- Plan C: W01 Remark `Test`, W05 Remark `Note 1`, W13 Remark `-`.

### Step to Reproduce
1. Log in as Turnaround Manager and open the Worklist of Plan A (or Plan C).
2. Open the filter on the Remark column. The options are `-`, `Note 1`, `Test`.
3. Type `-` in the Search box of the filter.

### Actual Result
The filter shows "No matches." The option `-` is not found, in Plan A (empty Remark) and in Plan C (Remark `-`).

Pictures:
- work/ETM-8391/defect5-pics/plan-a-1-options-before-search.png (Plan A, options `-`, `Note 1`, `Test`)
- work/ETM-8391/defect5-pics/plan-a-2-after-typing-dash.png (Plan A, after typing `-`: No matches.)
- work/ETM-8391/defect5-pics/plan-c-1-options-before-search.png (Plan C, options `-`, `Note 1`, `Test`)
- work/ETM-8391/defect5-pics/plan-c-2-after-typing-dash.png (Plan C, after typing `-`: No matches.)

### Expected Result
The option `-` is listed after typing `-`, so the user can tick it from the search (Xray ETM-8656 steps 14 and 15: typing `-` lists the hyphen options including `-`; tick only `-` shows only the Blank works).

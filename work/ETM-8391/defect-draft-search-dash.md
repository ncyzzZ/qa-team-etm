# [ETM-8391] Remark filter: searching "-" does not list the Blank option "-"

**Environment:** QA (https://stms-qa.apps.pttep.com), role Turnaround Manager, Worklist of a Plan on event NN TEST QA. Found 25 Nov 2026 by Playwright ETM-8656 step 14 (runs 2026-11-25 14:00 and 14:55) and checked by hand on the live page.

In the Worklist, the Remark column filter shows works with an empty Remark as the Blank option `-` (first under Select All). When `-` is typed into the Search box of that filter, the Blank option `-` is not listed, so it cannot be found or ticked through the search. Other options that contain a hyphen are listed.

Data (made through the screen): works with Remark empty (W11), `-` (W13), `--` (W14), `- a` (W15), `- ` (W21), ` - ` (W22).

### Step to Reproduce
1. Log in as Turnaround Manager and open the Worklist of the Plan.
2. Open the filter on the Remark column. The list shows `-` (Blank) first under Select All.
3. Type `-` in the Search box of the filter.

### Actual Result
Only `--`, `- a`, `- ` and ` - ` are listed. The Blank option `-` is not in the list.

Pictures:
- work/ETM-8391/defect5-pics/1-before-full-list-has-dash.png (full list, Blank `-` shown first)
- work/ETM-8391/defect5-pics/2-search-dash-no-blank-option.png (after typing `-`: no Blank option)

### Expected Result
The Blank option `-` is listed together with `--`, `- a`, `- ` and ` - ` (Xray ETM-8656 step 14), so the user can tick only `-` from the search (step 15).

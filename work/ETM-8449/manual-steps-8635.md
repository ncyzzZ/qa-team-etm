# ETM-8449 manual steps: ETM-8635 (rapid clicks and scroll position, 20,000 Work plan)

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager. One picture per step.
Steps copied from Xray (read 25 Nov 2026). Nothing is saved: collapse / expand only changes the view; leave without Save.

## Plan
`PLAN-20K` = "Shutdown Logic: New Plan 20,000 Work" (22,442 rows), path `ETM8449_PATH` in `ep-etm-fe-qa/.env`:
`/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/d584b6ce-458e-4d87-b74f-77d2e4a42794/logics/97600d7c-39c9-4279-bddc-a5a1a9b482fc?years=2026,2027&tab=planning`
A Turnaround Manager opens PLAN-20K while it is Inactive, so no plan is switched Active.

## Before every Test
1. Open the plan; wait until the spinner is gone.
2. **Collapse the Manpower Resource histogram** (team rule): hover the splitter `data-testid="sl-splitter-horizontal"` and click `aria-label="Hide histogram"`. Do it again after every load or reload.
3. Make sure every row is expanded (Custom View panel: every level box shows `-`).

Counts from the run of 25 Nov 2026: P=18, H=149, W=5000, B=17275, N0=22442.
Steps 9-10 ("near the same place", "does not freeze") are the reason this Test is manual: record the screen position of the collapsed row before and after (row's top in px inside the Gantt body and the scroll position), and take a picture before and after. A move of less than one screen height and no jump to the top = near the same place.

## ETM-8635 - Rapid repeated clicks and scroll position (10 steps)
writes data: no
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open PLAN-20K, collapse the histogram, record the row count | Count written down as N0 | Gantt |
| 2 | Click the arrow of the first Platform row 5 times quickly (collapse, expand, collapse, expand, collapse) | After the last click the Platform is collapsed; no row is half shown | Gantt after |
| 3 | Click the same arrow once more | The Platform expands and the row count equals N0 | Gantt after |
| 4 | Open the Custom View panel, click the `-` box of `Work Header` | Work Header rows hidden; only Platform rows (count P) | Gantt + panel |
| 5 | Click the `+` box of `Work Header` within about 1 second | Platform and Work Header rows shown (count P+H); Work and Work Breakdown rows stay hidden, their boxes `+` | Gantt + panel |
| 6 | Click the `-` box of `Work Header` within about 1 second | Only Platform rows (count P); no leftover rows, no error message | Gantt + panel |
| 7 | Click `+` of `Work Header` once, then `+` of `Work Breakdown` | After `+` Work Header: count P+H, first Platform row expanded. After `+` Work Breakdown: all rows (count N0), same order as step 1 | Gantt + panel |
| 8 | Close the panel, scroll the Gantt table down to the middle | A row in the middle of the table is on screen | Gantt |
| 9 | Collapse a Work Header row that is on screen (write down its name, its top in px and the scroll position) | The row stays near the same place; the page does not jump to the top | Gantt before + after |
| 10 | Expand the same row | The row and its children are shown near the same place; the page does not freeze | Gantt after |

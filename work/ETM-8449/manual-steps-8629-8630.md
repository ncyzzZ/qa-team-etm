# ETM-8449 manual steps: ETM-8629 and ETM-8630 (timing, 20,000 Work plan)

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager. One picture per step.
Steps copied from Xray (read 25 Nov 2026). Nothing is saved: collapse / expand only changes the view; leave without Save.

## Plan
`PLAN-20K` = "Shutdown Logic: New Plan 20,000 Work" (22,442 rows), path `ETM8449_PATH` in `ep-etm-fe-qa/.env`:
`/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/d584b6ce-458e-4d87-b74f-77d2e4a42794/logics/97600d7c-39c9-4279-bddc-a5a1a9b482fc?years=2026,2027&tab=planning`
Why not the event "QA ETM-8449": these two Tests measure speed on the 20,000 Work plan; the 3-Work plan there says nothing about speed. A Turnaround Manager opens PLAN-20K while it is Inactive, so no plan is switched Active.

## Before every Test
1. Open the plan; wait until the spinner is gone.
2. **Collapse the Manpower Resource histogram** (team rule): hover the splitter `data-testid="sl-splitter-horizontal"` and click `aria-label="Hide histogram"`. Do it again after every load or reload.
3. Make sure every row is expanded (Custom View panel: every level box shows `-`).

Timing: from the click to the moment the spinner is gone and the row count stops changing. Pass rule (user, 24 Nov 2026): every time 20 s or less; times are written down as data.
Freeze, flicker or lag can only be judged by a person watching: those steps are `needs-human`.

## ETM-8629 - Time of manual collapse and expand of one row (7 steps)
writes data: no
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open PLAN-20K, collapse the histogram, get the timer ready | Gantt shows the Platform rows; row count N0 written down | Gantt |
| 2 | Start the timer, click the collapse arrow of the Platform row with the most rows under it | Child rows disappear, row count falls, spinner (if any) gone; time = T1 | Gantt after |
| 3 | Click the expand arrow of the same Platform row | Child rows back, row count = N0; time = T2 | Gantt after |
| 4 | Click the collapse arrow of a Work Header row with many Work rows | Its Work rows disappear; time = T3 | Gantt after |
| 5 | Click the expand arrow of the same Work Header row | Its Work rows back; time = T4 | Gantt after |
| 6 | Compare T1-T4 with the limit | Every time <= 20 s (Pass), > 20 s Fail; times written down | Gantt + times in the note |
| 7 | Note whether the page froze, flickered or lagged in steps 2-5 | Note "no visible lag" or describes the lag (needs-human) | Gantt |

## ETM-8630 - Time of Expand/Collapse by Data Level (9 steps)
writes data: no
P / H / W = rows of Platform / Work Header / Work level, N0 = all rows (count them in step 1).
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open PLAN-20K, collapse the histogram, open the Custom View panel (icon next to the filter icon), get the timer ready | Panel shows `Customize Gantt & Histogram` and `Expand/Collapse by Data Level` with Platform, Work Header, Work, Work Breakdown; every box `-` | Panel |
| 2 | Start the timer, click `-` of `Work Breakdown` | Spinner shows and ends; Work Breakdown rows hidden; count = P+H+W; box `+`; time = A1 | Gantt + panel |
| 3 | Click `-` of `Work` | Work rows hidden; count = P+H; box `+`; time = A2 | Gantt + panel |
| 4 | Click `-` of `Work Header` | Only Platform rows (count P); box `+`; time = A3 | Gantt + panel |
| 5 | Click `+` of `Work Header` | Work Header rows back; Work rows stay hidden (Work box `+`); count = P+H; time = A4 | Gantt + panel |
| 6 | Click `+` of `Work` | Work rows back; count = P+H+W; time = A5 | Gantt + panel |
| 7 | Click `+` of `Work Breakdown` | All rows (count N0); time = A6 | Gantt + panel |
| 8 | Compare A1-A6 with the limit | Every time <= 20 s (Pass), > 20 s Fail; times written down | Gantt + times in the note |
| 9 | Note whether the page froze or lagged after the spinner ended | Note "no visible lag" or describes the lag (needs-human) | Gantt |

Known app defects that may show here (do not log again): ETM-9177 (`+` of Work Header brings back only Work Header rows) touches step 5-7 of 8630 only when the lower boxes show `-`; in 8630 the Work box is `+` at step 5, so P+H is the expected count.

## Manual run 2026-11-25 (manual-runner, run folder output/runs/2026-11-25_100441_ETM-8449_manual) - awaiting confirmation
- 8629: steps 1-6 pass. T1 4.64 s (Platform NTWA, 2108 rows), T2 4.43, T3 4.01 (Work Header with 8 Works), T4 4.22; no spinner; page blocked ~4 s per click (one long task, no repaint). Step 7 needs-human.
- 8630: steps 1-8 pass. Counts 22442 -> 5167 -> 167 -> 18 -> 167 -> 5167 -> 22442 as expected (ETM-9177 not hit). A1-A6 1.36 / 1.21 / 1.25 / 1.35 / 1.63 / 1.50 s, spinner shown. Step 9 needs-human.
- Both stay skipped (not PASSED) until a person judges the lag.
- User 2026-11-25 (chat): "ไม่นับ (ผ่าน)" = the ~4 s freeze of 8629 is not lag. 8629 manual result: PASS (7/7, user-confirmed). 8630 (1.2-1.6 s with spinner, milder) taken as the same verdict: PASS (9/9). Xray not pushed yet (needs the push-plan question).

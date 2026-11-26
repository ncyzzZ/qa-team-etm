# ETM-8042 manual steps: ETM-8836 re-check on Plan "QA ETM-8042 8836" (round 2, 26 Nov 2026)

Why: round 1 (manual-8836-lines-recheck/) could not be judged by the blind check: no Start Date column was visible, the Gantt axis starts at 14/02 22:00, the line times were measured from pixels, and the step box covered the Gantt header. This round reads the values from the screen itself. Read only: change nothing, never press Save.

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager.
Plan "QA ETM-8042 8836": Ramp Down/Up Date `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, the Logic has tasks (two works).
Shutdown Logic page: collapse the Manpower Resource histogram first (button `aria-label="Hide histogram"` inside `data-testid="sl-splitter-horizontal"`, shown on hover), after every load.
Pictures: full screen; put the step note box at the BOTTOM of the picture (never over the Gantt header, the date columns or the grid header).

## ETM-8836 - Shutdown Logic Start Date and Ramp lines of Plan "QA ETM-8042 8836" (3 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/384db0ce-b08c-419e-8aec-b83b62baca23/logics/81460f63-12e8-47c5-8a10-87553b0a7d39?tab=planning
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Shutdown Logic page (start URL), collapse the histogram. In the grid, open (expand) the column group that holds the schedule dates (for example "Scheduled") so the `Start Date` column shows. Read the `Start Date` of the first (earliest) task row | The earliest Start Date is `15 Feb 2026` (the Plan Ramp Down), not `08 Feb 2026` (event Planned Date) | Grid with the Start Date column and the first rows readable |
| 2 | Set the Gantt zoom to day level (dates readable in the header). Hover the `Ramp Down` line and read its tooltip / label | Ramp Down line `15 Feb 2026 09:00` | Gantt header + tooltip of the Ramp Down line |
| 3 | Scroll the Gantt to 25 Feb 2026. Hover the `Ramp Up` line and read its tooltip / label | Ramp Up line `25 Feb 2026 18:00` | Gantt header + tooltip of the Ramp Up line |

If a line has no tooltip or label, write down exactly what the screen shows (column of the line in the day header) and mark the step needs-human. Do not press Save. If a "leave page" dialog appears, leave without saving.

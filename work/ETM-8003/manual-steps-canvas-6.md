# ETM-8003 manual steps: the canvas parts the script cannot read (ETM-8800, 8802, 8803, 8804, 8808, 8809)

Test Execution: ETM-8816. Environment: QA only (https://stms-qa.apps.pttep.com). One full-screen framed picture per step (Xray needs a picture per step), plus a zoom of the S-Curve card when the step is about a line, dot or label.
Why manual: the S-Curve is one `<canvas>`. The script (run `2026-11-24_221700_ETM-8003`) proved the four hex colors are present on the chart; it cannot read label text, label positions, which dot is which, or dash vs solid for sure. These steps are checked by eye on pictures.
Log in as **Turnaround Manager** only. The Job Owner has the S-Curve filter button disabled (BA round 3 is open), so Filter Panel steps are done with TM.
Read only: the Filter Panel only changes the view and is not saved. Do not Save, Freeze, Unfreeze or change any data. Click `Reset` in the Filter Panel at the end of each Test.

## Data
- Daily Report (`.env` DAILY_REPORT_*): `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db`
- Frozen date `ETM8003_FROZEN_DATE` = **03 Jun 2026**. Not-frozen date `ETM8003_NOT_FROZEN_DATE` = **05 Jun 2026**.
- Colors: Plan line and dots `#1677FF` (blue, dashed); Plan labels `#1D39C4` (dark blue). Actual line and dots `#FA8C16` (orange, solid); Actual labels `#D46B08` (dark orange). Old colors: Plan yellow, Actual green.
- Default Filter Panel (BA DEC-077): Scale Day, Show Plan(%) Show Only Today, Show Actual(%) Show Only Today. Show Only Today / Show All change only the LABELS; the full lines always stay drawn.
- Label values: compare with Total Plan (%) / Total Actual (%) of the Progress Summary of the same day (whole numbers).
- How to measure a color on the canvas: read pixels with `getContext('2d').getImageData` at the point you look at, and give the RGB in `why`. A label or dot color is pass when each channel is within 10 of the hex.

## Before you start
- The page opens and the card `S-Curve - Cumulative Progress` shows a chart (a canvas with lines). If not, every step is needs-human.
- The S-Curve filter button on the card is enabled for TM. If not, the Filter Panel steps are needs-human.

## ETM-8800 - Plan line is blue #1677FF and still dashed (4 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Look at the card `S-Curve - Cumulative Progress` | The card shows a line chart with the X axis dates, the Y axis 0% to 100% in steps of 20%, a Plan line and an Actual line, and the legend `Plan` and `Actual` below | Full screen with the card |
| 2 | Check the color of the Plan line | The Plan line color is `#1677FF` (blue) | Zoom of the Plan line, RGB in why |
| 3 | Look at the Plan line along its whole length | The Plan line is dashed from its first point to its last point, with no solid part | Zoom of the whole Plan line |
| 4 | Check the Plan line for the old color | No yellow is seen in the Plan line | Zoom of the Plan line |

## ETM-8802 - Dots and legend use the line color, labels the darker shade (9 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the filter icon on the card `S-Curve - Cumulative Progress` | The Filter Panel opens in its default state: Scale Day, Show Plan(%) Show Only Today, Show Actual(%) Show Only Today | Full screen with the open Filter Panel |
| 2 | Select Show Plan(%) `Show All` | A label is shown on every Plan point | Zoom of the chart |
| 3 | Select Show Actual(%) `Show All` | A label is shown on every Actual point | Zoom of the chart |
| 4 | Check the dots on the Plan line | Every Plan dot is `#1677FF`, the same as the Plan line | Zoom of Plan dots, RGB in why |
| 5 | Check the data labels of the Plan line | Every Plan label is written in `#1D39C4` (darker blue than the line) | Zoom of Plan labels, RGB in why |
| 6 | Check the dots on the Actual line | Every Actual dot is `#FA8C16`, the same as the Actual line | Zoom of Actual dots, RGB in why |
| 7 | Check the data labels of the Actual line | Every Actual label is written in `#D46B08` (darker orange than the line) | Zoom of Actual labels, RGB in why |
| 8 | Check the legend below the chart | The legend shows `Plan` with a dashed line and a dot in `#1677FF`, and `Actual` with a solid line and a dot in `#FA8C16` | Zoom of the legend |
| 9 | Compare the label of the active execution date with the Progress Summary table of the same day, then click `Reset` | The Plan label value equals Total Plan (%) and the Actual label value equals Total Actual (%) of that day in the Progress Summary | Chart labels and Progress Summary in one full-screen picture |

## ETM-8803 - Plan and Actual labels can be told apart where they meet (3 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Filter Panel, select Show Plan(%) `Show All` and Show Actual(%) `Show All`, and look at a place where a Plan point and an Actual point meet (for example the early days where both are 0%) | The two labels are stacked at the same place | Zoom of that place |
| 2 | Zoom in on the two stacked labels | One label is dark orange `#D46B08` and one label is dark blue `#1D39C4`; both can still be read | Close zoom of the two labels, RGB in why |
| 3 | Look at the two dots at that place, then click `Reset` | The orange dot and the blue dot can both be seen (neither hides the other completely) | Close zoom of the two dots |

## ETM-8804 - Plan-only days and other days opened with < and > show the same colors (9 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Look at the part of the Plan line after the execution date (Show Plan(%) `Show All` to see its labels) | Only the Plan line continues there; its dots are `#1677FF` and its labels are `#1D39C4`; there is no orange dot or label after the execution date | Zoom of the right part of the chart |
| 2 | Click `Reset`, then click the `<` button next to the execution date | The Daily Report of the earlier day opens and the execution date shows the earlier day | Full screen with the new date |
| 3 | Look at the S-Curve of that day | The Plan line is blue dashed, the Actual line is orange solid, dots and legend have the line colors, and labels are dark blue (Plan) and dark orange (Actual) | Zoom of the chart |
| 4 | Use `<` and `>` to open **03 Jun 2026** (frozen) | The frozen Daily Report of 03 Jun 2026 opens (button reads `Unfreeze`) | Full screen with the date |
| 5 | Look at the S-Curve of the frozen day | The Plan line is blue dashed and the Actual line is orange solid, with the same dot, label and legend colors as in step 3 | Zoom of the chart |
| 6 | Use `<` and `>` to open **05 Jun 2026** (not frozen) | The not-frozen Daily Report of 05 Jun 2026 opens | Full screen with the date |
| 7 | Look at the S-Curve of that day | The Plan line is blue dashed and the Actual line is orange solid, with the dots, labels and legend in the colors of step 3 | Zoom of the chart |
| 8 | Check the S-Curves of steps 3, 5 and 7 for the old colors | No yellow Plan and no green Actual is seen on any of these days | The three zooms named in why |
| 9 | Reload the page with the browser Refresh | The S-Curve of the day shows the same colors again | Zoom of the chart after reload |

## ETM-8808 - Colors stay the same for every Scale and Show option (10 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the filter icon on the card `S-Curve - Cumulative Progress` | The Filter Panel opens with Scale (Day, Week, Month), Show Plan(%) and Show Actual(%), in the default state Day, Show Only Today, Show Only Today | Full screen with the open Filter Panel |
| 2 | Check the S-Curve in the default state | Full Plan and Actual lines drawn; Plan line and dots `#1677FF` (dashed), Actual line and dots `#FA8C16` (solid); a label only on the active execution date: Plan `#1D39C4`, Actual `#D46B08`; legend Plan `#1677FF`, Actual `#FA8C16` | Zoom of the chart |
| 3 | Select Show Plan(%) `Show All` | Plan labels on every Plan point, all `#1D39C4`; the Plan line and dots stay `#1677FF`; the Actual line is unchanged | Zoom of the chart |
| 4 | Select Show Actual(%) `Show All` | Actual labels on every Actual point, all `#D46B08`; the Actual line and dots stay `#FA8C16`; legend unchanged | Zoom of the chart |
| 5 | Select Scale `Week` | Weekly points; lines and dots keep `#1677FF` (dashed) and `#FA8C16` (solid); labels keep `#1D39C4` and `#D46B08`; legend unchanged | Zoom of the chart |
| 6 | Select Scale `Month` | Monthly points; same colors and styles as step 5 | Zoom of the chart |
| 7 | Select Scale `Day` again | Daily points; the colors are the same as in step 4 | Zoom of the chart |
| 8 | Select Show Plan(%) `Show Only Today` | Plan labels only on the active execution date, in `#1D39C4`; the full Plan line stays drawn in `#1677FF` dashed | Zoom of the chart |
| 9 | Select Show Actual(%) `Show Only Today` | The Actual label only on the active execution date, in `#D46B08`; the full Actual line stays drawn in `#FA8C16` solid | Zoom of the chart |
| 10 | Click `Reset` | The Filter Panel returns to Day, Show Only Today, Show Only Today, and the colors are the same as in step 2 | Full screen with the Filter Panel |

## ETM-8809 - Labels shown only on the active date keep their darker colors (7 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/f0792b80-fbe0-4e02-bf9e-85c5c2c1ad6e/daily-report/806c2fac-3d8d-4481-853a-fcbaa2d5d0db
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the filter icon on the card `S-Curve - Cumulative Progress` | The Filter Panel opens in its default state: Scale Day, Show Plan(%) Show Only Today, Show Actual(%) Show Only Today | Full screen with the open Filter Panel |
| 2 | Look at the Plan line and the Actual line | Both full lines are drawn; they are not reduced to one point | Zoom of the chart |
| 3 | Look at the labels on the chart | One Plan label and one Actual label are shown, on the point of the active execution date; the labels of the other points are hidden | Zoom of the chart |
| 4 | Check the color of the Plan label | The Plan label is `#1D39C4` | Close zoom of the Plan label, RGB in why |
| 5 | Check the color of the Actual label | The Actual label is `#D46B08` | Close zoom of the Actual label, RGB in why |
| 6 | Check the color of the lines, the dots and the legend | Plan line, dots and legend are `#1677FF`; Actual line, dots and legend are `#FA8C16` | Zoom of the chart with the legend |
| 7 | Compare the two labels with the Progress Summary table of the active date | The Plan label value equals Total Plan (%) and the Actual label value equals Total Actual (%) of that day | Chart labels and Progress Summary in one full-screen picture |

Pass: every step matches. A step about a drawing is pass only when the picture or the measured pixels clearly show it; otherwise needs-human with what was seen.

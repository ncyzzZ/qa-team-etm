# ETM-8392 manual steps: ETM-8690, ETM-8692, ETM-8693 (Export PDF)

Test Execution: ETM-8825. Environment: QA only (https://stms-qa.apps.pttep.com). One screenshot per step (Xray needs a picture per step). For the PDF steps, screenshot the PDF page with the Gantt.

## Before you start (all three)
- Daily Report used by the automated tests: event `DAILY_REPORT_EVENT_ID`, plan "QA EMP Del A" (`ETM8392_ACTIVE_PLAN_ID` / `ETM8392_ACTIVE_REPORT_ID` in `ep-etm-fe-qa/.env`). Plan "Plan ART For PSD" (`ETM8392_CMP_*`) has the same Ramp dates and can be used instead.
- Snapshot Ramp dates (from `.env`, check them on the Plan Card badge on the Planning tab first):
  - Ramp Down = **08 Jun 2026 18:00**
  - Ramp Up = **16 Jun 2026 07:00**
- Focus Timeframe of report day D = `D-1 00:00` to `D+2 23:59` (inclusive; a line exactly on the edge day is inside, DEC-061).
- Export is offered only on a frozen day: the header button reads `Unfreeze` on a frozen day, `Freeze` on a day that is not frozen. Known frozen day: **03 Jun 2026**. The other days below must be checked first. If a day is not frozen, do not freeze it before we agree (freezing is a QA data change).
- Export settings for every PDF below: Export Mode `Daily Plan`, Timeframe `Focus Timeframe`.

### Days to use (with the Ramp dates above)
| Need | Day D | Focus window | Ramp Down 08 Jun 18:00 | Ramp Up 16 Jun 07:00 |
|---|---|---|---|---|
| both after D+2 (8692) | 03 Jun (frozen) | 02-05 Jun | outside | outside |
| only Ramp Down inside (8693) | 06, 07, 08 or 09 Jun | e.g. 07 Jun: 06-09 Jun | inside | outside |
| Ramp Down on the first day (8690 edge) | 09 Jun | 08-11 Jun | inside (D-1) | outside |
| Ramp Up on the last day (8690 edge) | 14 Jun | 13-16 Jun | outside | inside (D+2) |
| both before D-1 (8692) | 18 Jun or later | 17-20 Jun | outside | outside |
| both inside (8690 steps 1-5) | none | - | - | - |

**8690 steps 1-5 cannot be done with this data:** the Ramp dates are 8 days apart and the Focus window is 4 days. It needs a Plan whose Ramp Down and Ramp Up are at most 3 days apart (a new or edited Plan + Daily Report = QA data change; ask first), or mark steps 1-5 blocked and do steps 6-8 only.

## ETM-8690 - both lines inside, and the edge day (8 steps)
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report on a frozen day D where both Ramp dates are between D-1 and D+2 (needs the data above) | Daily Report of day D opens, button reads `Unfreeze` | header with date |
| 2 | Click Export, `Daily Plan`, `Focus Timeframe`, export | a PDF is downloaded | export drawer / download |
| 3 | Open the PDF, find the Gantt | Gantt is shown | PDF Gantt page |
| 4 | Look for `Ramp Down` | one `Ramp Down` line at the snapshot Ramp Down date-time | zoom on the line |
| 5 | Look for `Ramp Up` | one `Ramp Up` line at the snapshot Ramp Up date-time | zoom on the line |
| 6 | Open the Daily Report on frozen day **09 Jun 2026** (Ramp Down on D-1) or **14 Jun 2026** (Ramp Up on D+2) | Daily Report of that day opens, `Unfreeze` | header with date |
| 7 | Export again, `Daily Plan`, `Focus Timeframe` | a PDF is downloaded | download |
| 8 | Open the PDF, look at the edge day | 09 Jun: `Ramp Down` line on 08 Jun at 18:00 (first day). 14 Jun: `Ramp Up` line on 16 Jun at 07:00 (last day). The line is shown | zoom on the line |

## ETM-8692 - no line when both are outside (6 steps)
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report on frozen day **18 Jun 2026** (or a later frozen day) | Daily Report opens, `Unfreeze` | header with date |
| 2 | Export, `Daily Plan`, `Focus Timeframe` | a PDF is downloaded | download |
| 3 | Open the PDF, find the Gantt | Gantt is shown (17-20 Jun) | PDF Gantt page |
| 4 | Look for `Ramp Down` and `Ramp Up` | no `Ramp Down` and no `Ramp Up` line | whole Gantt page |
| 5 | Open the Daily Report on frozen day **03 Jun 2026**, export the same way | a PDF is downloaded (02-05 Jun) | header + download |
| 6 | Look for `Ramp Down` and `Ramp Up` in this PDF | no `Ramp Down` and no `Ramp Up` line | whole Gantt page |

## ETM-8693 - only the line inside is shown (4 steps)
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report on a frozen day among **06-09 Jun 2026** (e.g. 07 Jun: window 06-09 Jun) | Daily Report opens, `Unfreeze` | header with date |
| 2 | Export, `Daily Plan`, `Focus Timeframe` | a PDF is downloaded | download |
| 3 | Open the PDF, look for `Ramp Down` | one `Ramp Down` line on 08 Jun 2026 at 18:00 | zoom on the line |
| 4 | Look for `Ramp Up` | no `Ramp Up` line | whole Gantt page |

## Note from the FE code (stms-fe develop, 20 Nov 2026)
The Daily Report Gantt draws the lines at `event.startDate` / `event.endDate` of the Daily Report API (`daily-report-gantt.component.ts`, `highlightSelectedDateColumn`), not at the Plan's `rampDownDate` / `rampUpDate`. If a PDF line is at the Event's Planned Start/End and not at the Plan Card's Ramp dates, write both dates in the result (same open point as ETM-8677).

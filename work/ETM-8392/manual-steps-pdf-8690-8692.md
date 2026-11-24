# ETM-8392 manual steps: ETM-8690, ETM-8692 (Export PDF, Focus Timeframe)

Test Execution: ETM-8825. Environment: QA only (https://stms-qa.apps.pttep.com). One screenshot per step (Xray needs a picture per step); for a PDF step, screenshot the PDF page with the Gantt.
Replaces the 8690 / 8692 part of `manual-steps-pdf-8690-8692-8693.md` (that file had no data where both lines fit in one Focus window).
Log in as Turnaround Manager. Checked on QA in Chrome 24 Nov 2026 (export panel opened and cancelled, nothing exported).

## What the app does (checked)
- Export is enabled only on a frozen day (header shows `Unfreeze`).
- Export panel `Export Daily Report`: File Type `PDF File`; Export Mode `Only Current Date` / `Daily Plan` ("Export the currently displayed tasks, grouped by day"); Timeframe (shown after choosing Daily Plan) `Full Shutdown Timeframe` / `Focus Timeframe` ("Timeline scale spans from day-1 to day+2 of the report date"); buttons `Cancel`, `Export`.
- **Daily Plan downloads ONE ZIP with one PDF per frozen execution day** (stms-fe `daily-report.component.ts`: "one file per frozen execution date, zipped"). Each PDF has its own Focus window `D-1 00:00` to `D+2 23:59` around its own day D. So one export gives every day you need; open the PDF of the day named in the step.
- A line exactly on the first or last day of the window counts as inside (BA DEC-061).
- Open a day directly: add `?date=YYYY-MM-DD` to the Daily Report URL.

## Data
| Plan | Snapshot Ramp Down | Snapshot Ramp Up | Frozen days | Daily Report URL |
|---|---|---|---|---|
| QA 8392 Snap C | 11 Jun 2026 08:00 (1/3 into the day) | 13 Jun 2026 20:00 (5/6 into the day) | 10-17 Jun 2026 | `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/13f241c8-6159-400b-8901-79a04a1e3f5a/daily-report/635e0869-76d0-440c-a869-55e46aa06e86?date=2026-06-12` |
| Plan ART For PSD | 08 Jun 2026 18:00 | 16 Jun 2026 07:00 | 03-05 Jun 2026 | `/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/9938a273-6679-4732-bf2f-b9774000cdce/daily-report/bbdb46c4-e89b-4a21-b372-d7ee2de75746?date=2026-06-05` |

Do 8690 before 8797: 8797 changes Snap C (Extend, Delete Extended Days). Exporting itself changes no data.

| Day D (PDF) | Focus window | Ramp Down | Ramp Up | Used in |
|---|---|---|---|---|
| Snap C 12 Jun | 11-14 Jun | inside (11 Jun, first day = edge) | inside (13 Jun) | 8690 steps 1-5 |
| Snap C 14 Jun | 13-16 Jun | outside | inside, on the first day (D-1 edge) | 8690 steps 6-8 |
| Snap C 11 Jun | 10-13 Jun | inside | inside, on the last day (D+2 edge) | 8690 steps 6-8 (second edge) |
| Snap C 17 Jun | 16-19 Jun | outside (before D-1) | outside (before D-1) | 8692 steps 1-4 |
| ART For PSD 05 Jun | 04-07 Jun | outside (after D+2) | outside (after D+2) | 8692 steps 5-6 |

## ETM-8690 - both lines inside, and the edge day (8 steps)
writes data: no
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Snap C Daily Report on **12 Jun 2026** (URL above) | header `12 Jun 2026`, button `Unfreeze`, `Export` enabled | header |
| 2 | Click `Export` → `Daily Plan` → `Focus Timeframe` → `Export` | a ZIP is downloaded with one PDF per frozen day (10-17 Jun) | export panel + downloaded file |
| 3 | Open the PDF of **12 Jun 2026**, find the Gantt | Gantt shown, scale 11 Jun → 14 Jun | PDF Gantt page |
| 4 | Look for `Ramp Down` | one `Ramp Down` line on 11 Jun 2026, about 1/3 into the day | zoom on the line |
| 5 | Look for `Ramp Up` | one `Ramp Up` line on 13 Jun 2026, about 5/6 into the day | zoom on the line |
| 6 | Use the same ZIP (or export again): open the PDF of **14 Jun 2026** | PDF Gantt, scale 13 Jun → 16 Jun | PDF Gantt page |
| 7 | Look for `Ramp Up` on the first day of the scale | one `Ramp Up` line on 13 Jun 2026 (first day of the window = inside); no `Ramp Down` line | zoom on the line |
| 8 | Open the PDF of **11 Jun 2026** (scale 10 Jun → 13 Jun) | `Ramp Up` line on 13 Jun 2026 (last day of the window = inside) and `Ramp Down` on 11 Jun | zoom on both lines |

## ETM-8692 - no line when both dates are outside (6 steps)
writes data: no
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Use the Snap C ZIP from 8690 (or open Snap C on 17 Jun 2026 and export `Daily Plan` + `Focus Timeframe`) | ZIP with the PDF of 17 Jun 2026 | download |
| 2 | Open the PDF of **17 Jun 2026** | Gantt shown, scale 16 Jun → 19 Jun | PDF Gantt page |
| 3 | Find the Gantt | Gantt chart is shown | PDF Gantt page |
| 4 | Look for `Ramp Down` and `Ramp Up` | no `Ramp Down` and no `Ramp Up` line (both dates are before 16 Jun) | whole Gantt page |
| 5 | Open Plan ART For PSD on **05 Jun 2026** (URL above), `Export` → `Daily Plan` → `Focus Timeframe` → `Export`, open the PDF of 05 Jun 2026 | PDF Gantt, scale 04 Jun → 07 Jun | header + PDF page |
| 6 | Look for `Ramp Down` and `Ramp Up` in this PDF | no `Ramp Down` and no `Ramp Up` line (both dates are after 07 Jun) | whole Gantt page |

## Note on the test wording
The Xray steps say "A PDF file is downloaded". With `Daily Plan` the app downloads a ZIP of PDFs (one per frozen day). If you agree, the expected results can be changed to "a ZIP with one PDF per frozen day is downloaded" after the run (Xray write, ask first).

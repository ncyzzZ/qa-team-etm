# Dev brief: D2 (Story ETM-8392) - PDF Focus Timeframe: the D+2 day column and its Ramp badge are cut by the page edge

## 1. What is wrong
In the Daily Report PDF export (Daily Plan + Focus Timeframe), the last day of the window (D+2) is cut by the right page edge, so a Ramp badge on that day is cut too (only "R" of "Ramp Up" shows).

## 2. Where
- Page: Daily Report > Export > Daily Plan > Focus Timeframe (ZIP, one PDF per frozen day, Gantt on page 2).
- URL: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/13f241c8-6159-400b-8901-79a04a1e3f5a/daily-report/635e0869-76d0-440c-a869-55e46aa06e86?date=2026-06-11`
- Environment: QA. Role: Turnaround Manager. Data: Plan QA 8392 Snap C (Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).

## 3. Steps to reproduce
1. Open the Daily Report of QA 8392 Snap C on a frozen day, Export > Daily Plan > Focus Timeframe > Export.
2. Open `..._Day1_20260611.pdf` (window 10-13 Jun), page 2: look at the 13 Jun column and the Ramp Up badge.
3. Open `..._Day2_20260612.pdf` (window 11-14 Jun) and `..._Day0_20260610.pdf` (window 09-12 Jun): look at the last column.

## 4. Actual vs Expected
| PDF | Actual | Expected |
|---|---|---|
| 11 Jun | 13 Jun column cut; Ramp Up line drawn but its badge shows only "R" | whole 13 Jun column and the full "Ramp Up" badge inside the page |
| 12 Jun | 14 Jun column cut by the page edge | whole D+2 column visible |
| 10 Jun | 12 Jun column cut by the page edge | whole D+2 column visible |

## 5. Rule source
- ETM-8392 AC 4, BA DEC-061 (Focus = D-1 00:00 to D+2 23:59, the edge day counts inside).
- BA answer 25 Nov 2026 (R3-Q2): not acceptable, the D+2 column and its badge must not be cut.
- Xray: ETM-8690 steps 3 and 8, ETM-8693 step 2 (Test Execution ETM-8825).

## 6. Hints for the fix (guess)
FE source not checked. The Gantt width for the PDF probably does not fit the 4-day range to the printable page width; scale the timeline (or the column width) so D-1..D+2 fits, with room for a badge on the last day.

## 7. How QA will retest
Export Snap C again: in every Focus PDF the 4 day columns and any badge on D+2 are fully inside the page. Re-run ETM-8690 (steps 3, 8) and ETM-8693 (step 2).

## 8. Out of scope / do not change
- Which lines are shown (D1 / DEC-061), Full Shutdown Timeframe export, other PDF pages.

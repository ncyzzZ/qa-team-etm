# Dev brief: ETM-10055 (Story ETM-8392) - PDF Focus Timeframe cuts the Ramp badge of a line late on the last day (D+2)

## 1. What is wrong
In the Daily Report PDF export (Daily Plan + Focus Timeframe), a Ramp line late on the last day of the window (D+2) is drawn, but its badge, which is drawn to the right of the line, runs past the end of the Gantt timeline and is cut: only "R" of "Ramp Up" can be read. The four day columns themselves fit on the page.

## 2. Where
- Page: Daily Report > Export (frozen day) > Daily Plan > Focus Timeframe > Export (ZIP, one PDF per frozen day, Gantt on page 2).
- URL: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/13f241c8-6159-400b-8901-79a04a1e3f5a/daily-report/635e0869-76d0-440c-a869-55e46aa06e86?date=2026-06-11`
- Environment: QA. Role: Turnaround Manager.
- Data: Event ART PSD, Plan QA 8392 Snap C, snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00.

## 3. Steps to reproduce
1. Open the Daily Report of QA 8392 Snap C on 11 Jun 2026 (frozen).
2. Export > Daily Plan > Focus Timeframe > Export.
3. Open `..._Day1_20260611.pdf` (window 10-13 Jun), page 2: look at the Ramp Up line on 13 Jun and its badge at the right end of the Gantt.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Ramp Up line | drawn on 13 Jun at about 20:00 | same |
| Ramp Up badge | cut at the end of the timeline, only "R" visible | full "Ramp Up" text readable |
| Day columns 10-13 Jun | fit on the page | same |

## 5. Rule source
- ETM-8392 AC 4, BA DEC-061: the edge day D+2 counts as inside, so the line and its badge are shown.
- BA answer 25 Nov 2026 (R3-Q2): a badge on D+2 must not be cut.
- Xray: ETM-8690 step 8 (Test Execution ETM-8825).

## 6. Hints for the fix (guess)
FE source not checked. The badge is anchored at the line and drawn to the right; near the end of the range it could be drawn to the left of the line (or the timeline end padded) so the whole text stays inside the Gantt.

## 7. How QA will retest
Export Snap C again; in the 11 Jun PDF the Ramp Up badge on 13 Jun reads "Ramp Up" in full. Also check a Ramp Down badge late on D+2 if data allows. Re-run ETM-8690.

## 8. Out of scope / do not change
- Which lines are shown (DEC-061) and D1 (badge text of lines outside the window).
- On-screen Gantt badges and their overlap rule (ETM-7897).
- Full Shutdown Timeframe export.

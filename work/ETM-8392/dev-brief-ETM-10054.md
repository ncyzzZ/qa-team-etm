# Dev brief: ETM-10054 (Story ETM-8392) - PDF Focus Timeframe shows badge text of a Ramp line that is outside the window

## 1. What is wrong
In the Daily Report PDF export (Daily Plan + Focus Timeframe), when a Ramp Down / Ramp Up line is outside the Focus window (D-1 00:00 to D+2 23:59), the line is correctly not drawn, but part of its badge text is still drawn in the Gantt header ("Down", "p Up").

## 2. Where
- Page: Daily Report, button Export (enabled on a frozen day) > Export Mode `Daily Plan` > Timeframe `Focus Timeframe` > Export (ZIP with one PDF per frozen day; Gantt on page 2).
- URL: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/6580f57b-4bc6-43d2-a4c3-a7b20952f851/planning/13f241c8-6159-400b-8901-79a04a1e3f5a/daily-report/635e0869-76d0-440c-a869-55e46aa06e86?date=2026-06-14`
- Environment: QA. Role: Turnaround Manager.
- Data: Event ART PSD, Plan **QA 8392 Snap C**, Daily Report snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00. Frozen days 10-20 Jun 2026.

## 3. Steps to reproduce
1. Open the Daily Report of Plan QA 8392 Snap C on 14 Jun 2026 (frozen).
2. Export > Daily Plan > Focus Timeframe > Export.
3. Open `..._Day4_20260614.pdf` (window 13-16 Jun), page 2, look at the Gantt header left of "13".
4. Open `..._Day7_20260617.pdf` (window 16-19 Jun), page 2, look at the header at the left edge of "16".

## 4. Actual vs Expected
| PDF | Actual | Expected |
|---|---|---|
| 14 Jun (window 13-16) | Ramp Up line on 13 Jun OK; faint white text "Down" left of "13" (also in the PDF text layer) | Ramp Up line and badge only; nothing of Ramp Down (11 Jun is outside) |
| 17 Jun (window 16-19) | no line; faint white text "p Up" at the left edge of "16" | nothing of Ramp Down or Ramp Up (both outside) |

## 5. Rule source
- ETM-8392 AC 4 (PDF) and BA DEC-061: lines are shown only when inside D-1..D+2 (edge day counts inside).
- BA answer 25 Nov 2026 (R3-Q1): a line outside the Focus window must show nothing in the PDF, no badge text either.
- Xray: ETM-8690 step 7, ETM-8692 step 4 (Test Execution ETM-8825).

## 6. Hints for the fix (guess)
FE source not checked. Likely the badge (header chip) is positioned from the line time and only clipped by the header width, not hidden when the line is outside the export range; hide the badge whenever its line is hidden.

## 7. How QA will retest
Same Snap C ZIP: PDFs of 14 Jun and 17 Jun show no Ramp text outside the window (picture + PDF text layer check); PDFs of 10, 11, 12 Jun still show the lines/badges that are inside. Re-run ETM-8690 and ETM-8692.

## 8. Out of scope / do not change
- On-screen Gantt badges (overlap rule of ETM-7897: Ramp Down on top).
- Lines inside the window and the edge-day rule (DEC-061).
- Full Shutdown Timeframe export (shows both lines correctly).

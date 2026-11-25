# [Daily Report] Export PDF (Focus Timeframe) shows badge text of a Ramp line that is outside the timeframe

In the Daily Report PDF export with Export Mode Daily Plan and Timeframe Focus Timeframe (window D-1 00:00 to D+2 23:59), a Ramp Down / Ramp Up line that is outside the window is not drawn, but part of its badge text is still drawn in the Gantt header.

**Environment:** QA (https://stms-qa.apps.pttep.com), Chrome, role Turnaround Manager. Event ART PSD, Plan QA 8392 Snap C (Daily Report snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).

### Step to Reproduce
1. Open the Daily Report of Plan QA 8392 Snap C on 14 Jun 2026 (frozen day).
2. Click Export, choose Daily Plan and Focus Timeframe, click Export (a ZIP with one PDF per frozen day is downloaded).
3. Open the PDF of 14 Jun 2026 (Gantt scale 13 Jun to 16 Jun) and look at the Gantt header.
4. Open the PDF of 17 Jun 2026 (Gantt scale 16 Jun to 19 Jun) and look at the Gantt header.

### Actual Result
- 14 Jun PDF: a faint white text "Down" is drawn left of the "13" column header, although the Ramp Down date (11 Jun) is outside the window.
- 17 Jun PDF: a faint white text "p Up" is drawn at the left edge of the "16" column header, although both Ramp dates are outside the window.

### Expected Result
A Ramp line whose date is outside the Focus window shows nothing in the PDF: no line and no badge text (BA answer 25 Nov 2026; AC 4, DEC-061).

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-7-fullpage.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-7.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8692/step-4.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8692/step-4-zoom.png

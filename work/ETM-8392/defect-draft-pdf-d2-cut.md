# [Daily Report] Export PDF (Focus Timeframe) cuts the Ramp Up badge when the line is late on the last day (D+2)

In the Daily Report PDF export with Daily Plan and Focus Timeframe (window D-1 00:00 to D+2 23:59), a Ramp line on the last day of the window is drawn, but its badge (drawn to the right of the line) runs past the end of the Gantt timeline and is cut, so only "R" of "Ramp Up" can be read.

**Environment:** QA (https://stms-qa.apps.pttep.com), Chrome, role Turnaround Manager. Event ART PSD, Plan QA 8392 Snap C (Daily Report snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).

### Step to Reproduce
1. Open the Daily Report of Plan QA 8392 Snap C on 11 Jun 2026 (frozen day).
2. Click Export, choose Daily Plan and Focus Timeframe, click Export (a ZIP with one PDF per frozen day is downloaded).
3. Open the PDF of 11 Jun 2026 (Gantt scale 10 Jun to 13 Jun), page 2, and look at the Ramp Up line on 13 Jun and its badge at the right end of the Gantt.

### Actual Result
The Ramp Up line is drawn on 13 Jun 2026 at about 20:00 (5/6 into the day), inside the window, but its badge is cut at the right end of the Gantt: only "R" is visible. The four day columns themselves fit on the page.

### Expected Result
A Ramp line on the last day of the Focus window (D+2, counts as inside per DEC-061) is shown with its full badge text "Ramp Up" readable, not cut (BA answer 25 Nov 2026).

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-8-fullpage.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-8.png

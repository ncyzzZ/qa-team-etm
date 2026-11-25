# Evidence check defect-draft-pdf-d2-cut (ETM-8392, defect)

sourceHash: 4f74023011e3

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), Chrome, role Turnaround Manager. Event ART PSD, Plan QA 8392 Snap C (Daily Report snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).

## Steps
1. Open the Daily Report of Plan QA 8392 Snap C on 11 Jun 2026 (frozen day).
2. Click Export, choose Daily Plan and Focus Timeframe, click Export (a ZIP with one PDF per frozen day is downloaded).
3. Open the PDF of 11 Jun 2026 (Gantt scale 10 Jun to 13 Jun), page 2, and look at the Ramp Up line on 13 Jun and its badge at the right end of the Gantt.

## Expected Result (as the draft states it: check it has a source)
A Ramp line on the last day of the Focus window (D+2, counts as inside per DEC-061) is shown with its full badge text "Ramp Up" readable, not cut (BA answer 25 Nov 2026).

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-8-fullpage.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-8.png

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-d2-cut.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-d2-cut.pics/pic-2.png

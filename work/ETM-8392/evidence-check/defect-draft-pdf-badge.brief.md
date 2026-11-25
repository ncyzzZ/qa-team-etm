# Evidence check defect-draft-pdf-badge (ETM-8392, defect)

sourceHash: b306e78c6346

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), Chrome, role Turnaround Manager. Event ART PSD, Plan QA 8392 Snap C (Daily Report snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).

## Steps
1. Open the Daily Report of Plan QA 8392 Snap C on 14 Jun 2026 (frozen day).
2. Click Export, choose Daily Plan and Focus Timeframe, click Export (a ZIP with one PDF per frozen day is downloaded).
3. Open the PDF of 14 Jun 2026 (Gantt scale 13 Jun to 16 Jun) and look at the Gantt header.
4. Open the PDF of 17 Jun 2026 (Gantt scale 16 Jun to 19 Jun) and look at the Gantt header.

## Expected Result (as the draft states it: check it has a source)
A Ramp line whose date is outside the Focus window shows nothing in the PDF: no line and no badge text (BA answer 25 Nov 2026; AC 4, DEC-061).

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-7-fullpage.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8690/step-7.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8692/step-4.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_215422_ETM-8392_manual/evidence/ETM-8692/step-4-zoom.png

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-badge.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-badge.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-badge.pics/pic-3.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8392/evidence-check/defect-draft-pdf-badge.pics/pic-4.png

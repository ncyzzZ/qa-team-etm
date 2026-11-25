# ETM-8003 manual steps: ETM-8805 (Export PDF S-Curve colors: blue Plan, orange Actual)

Test Execution: ETM-8816. Environment: QA only (https://stms-qa.apps.pttep.com). One full-screen framed picture per step (Xray needs a picture per step).
Log in as Turnaround Manager (Export Daily Report). Read only: Export only downloads a file, nothing is saved.

## Data
- Event **NN TEST QA** (`9885b03f-17ab-4ff5-a725-6d841259ff1a`), Plan **Wide Plan B - NN** (`808363e9-0b5e-4a4a-baa5-fa870dd576f5`).
- Daily Report: `ETM7901_FROZEN_PATH` = `/shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/808363e9-0b5e-4a4a-baa5-fa870dd576f5/daily-report/17a26644-36c6-4e01-a741-8f5034690f9f?years=2026,2027&tab=planning`
- Day: **14 Sep 2026** (frozen). If the header shows another day, add `&date=2026-09-14` to the URL, or use the `<` / `>` arrows next to the date.
- Baseline PDF (the same Plan and day, made before the color change): `qa-team-etm/work/ETM-8003/baseline-before-change.pdf`. Its first page starts with `Daily Report: Wide Plan B - NN 14 Sep 2026`.
- Colors: Plan line `#1677FF` (blue), Actual line `#FA8C16` (orange). Old colors: Plan yellow, Actual green.

## Before you start
- The Daily Report header reads `Daily Report: Wide Plan B - NN` and the day is **14 Sep 2026**. If that day cannot be reached, every step is needs-human (do not freeze or unfreeze anything).
- The day is frozen (the button reads `Unfreeze`). Export needs a frozen day (ETM-5277 AC 2.1). If it is not frozen, every step is needs-human (do not freeze).
- The S-Curve - Cumulative Progress card shows a chart on the page.
- Read the PDF with `node <PW_REPO>/scripts/manual/pdf-shot.mjs --text <pdf>` (text) and `node <PW_REPO>/scripts/manual/pdf-shot.mjs <pdf> <page> <out.png> --scale 2` (picture of a page; `--clip` to zoom on the S-Curve). Do the same for the baseline PDF to compare.

## ETM-8805 - Export PDF S-Curve changes only its colors (10 steps)
writes data: no
role: turnaroundManager
start: ETM7901_FROZEN_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | On the Daily Report of 14 Sep 2026, in the `Export Daily Report` block choose File Type `PDF File` and click Export | The PDF file is downloaded (a .pdf, or a .zip with the per-day PDFs: unzip with `pdf-shot.mjs --unzip`) | Export block with PDF File chosen, full screen |
| 2 | Open the PDF of 14 Sep 2026 and go to the S-Curve section | The PDF shows the S-Curve chart (text `S-Curve` on the page and a drawn chart) | PDF page with the S-Curve |
| 3 | Look at the Plan line in the PDF (zoom on the S-Curve with `--clip`) | The Plan line is blue | Zoomed S-Curve of the PDF |
| 4 | Look at the Actual line in the PDF | The Actual line is orange | Zoomed S-Curve of the PDF |
| 5 | Look at the legend of the S-Curve in the PDF | The legend shows `Plan` in blue and `Actual` in orange | Zoomed legend of the PDF |
| 6 | Sample the color of a Plan data dot or the Plan legend swatch (pixel of the `--scale 2` picture) | Each RGB channel is within 10 of `#1677FF` (R 22, G 119, B 255) | Zoomed Plan dot or swatch, with the sampled RGB in the verdict |
| 7 | Sample the color of an Actual data dot or the Actual legend swatch | Each RGB channel is within 10 of `#FA8C16` (R 250, G 140, B 22) | Zoomed Actual dot or swatch, with the sampled RGB in the verdict |
| 8 | Compare the S-Curve of the new PDF with the S-Curve of the baseline PDF (same page, same clip) | Only the colors are different; the line style (Plan dashed, Actual solid), the points, the labels, the axes and the numbers are the same as in the baseline | New and baseline S-Curve side by side |
| 9 | Compare the rest of the PDF with the baseline (text of every page) | The other sections (Key Activities, Activities Plan for Tomorrow, Area of Concern, Remark, Activity Group table, Gantt rows) are the same as in the baseline | Text diff summary and one page of each PDF |
| 10 | Look for the old colors on the S-Curve of the new PDF (secondary check) | No yellow in the Plan line and no green in the Actual line | Zoomed S-Curve of the PDF |

Pass: every step matches. Steps 3, 4, 5, 8 and 10 are a look at a drawing: give the measured facts (pixel colors, counts), and say needs-human if the measurement does not clearly answer.
Step 9: text that changes by itself (export time, a link with a token) is not a difference; list any other difference.

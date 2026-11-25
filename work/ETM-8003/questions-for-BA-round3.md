# ETM-8003 - Questions for BA (round 3, 24 Nov 2026)

Story: ETM-8003 Daily Report - S-Curve Colors (Blue Plan, Orange Actual). Environment: QA.

## Q1. S-Curve filter button is disabled for the Job Owner

> **WITHDRAWN 25 Nov 2026: QA mistake, do not answer.** Checked again: the S-Curve filter button is enabled for the Job Owner on Active plans ("eND50", "QA EMP Del A"). The disabled button QA saw was on an Inactive plan for a moment, before the page changed to "Access Denied" (correct behavior).

**What we see**
- The user is the Job Owner (permission "View Active Daily Report Item").
- They open the Daily Report of an Active plan: Event ART PSD, Plan "QA EMP Del A", status Active.
- The S-Curve - Cumulative Progress card shows the chart. The colors are correct: Plan blue #1677FF and Actual orange #FA8C16, the same as for the Turnaround Manager.
- The filter button at the top of the S-Curve card is **disabled**. The Job Owner cannot open the Filter Panel, so they cannot change:
  - Scale: Day / Week / Month
  - Show Plan(%): Show All / Show Only Today
  - Show Actual(%): Show All / Show Only Today
- The Turnaround Manager ("View All Daily Report Item") has the same button enabled on the same page.

**Question**
Is the S-Curve filter meant to be disabled for a view-only user (Job Owner)?
- If **yes**: we keep this as expected behavior. ETM-8808 / ETM-8809 (Filter Panel options) will be tested with the Turnaround Manager only.
- If **no**: the Job Owner should be able to use the Filter Panel, because it only changes the view and saves nothing. We will log a defect against the Story that owns the S-Curve filter (ETM-4127?). Please confirm which Story that is.

Evidence: `ep-etm-fe-qa/output/evidence/ETM-8807/step3_colors_active.png` (Job Owner view). Run `2026-11-24_221700_ETM-8003`.

## Q2. Export PDF: a "Ramp Down" marker on the Gantt that the baseline PDF does not have

**What we see** (ETM-8805 step 9, manual run `2026-11-25_100450_ETM-8003_manual`)
- Plan "Wide Plan B - NN" (Event NN TEST QA), Daily Report of 14 Sep 2026 (frozen), exported as PDF by the Turnaround Manager.
- The S-Curve in the PDF has the new colors (Plan #1677FF dashed, Actual #FA8C16 solid). Page 1 text and the Activity Group table are the same as in the baseline PDF (the same plan and day, exported before the color change).
- On pages 2 to 4 (the Gantt) the new PDF has an extra blue **"R Ramp Down"** marker at 14 Sep 2026 and a vertical line at the right edge. The baseline PDF does not have them.
- The Daily Report page on QA also shows the Ramp Down marker, so the PDF follows the page.

**Question**
ETM-8003 should change only the S-Curve colors. Is this Ramp Down marker in the PDF Gantt expected from another Story (which one?), so it is not a difference caused by ETM-8003?
- If **yes**: ETM-8805 step 9 passes (the rest of the PDF is unchanged apart from that other Story's change).
- If **no**: please tell us whether the marker should not be in the PDF.

Evidence: `ep-etm-fe-qa/output/runs/2026-11-25_100450_ETM-8003_manual/evidence/ETM-8805/step-9.png` (new PDF) and `base-p2.png` (baseline).

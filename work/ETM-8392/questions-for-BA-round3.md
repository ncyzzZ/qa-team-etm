# ETM-8392 - Questions for BA (round 3, 24 Nov 2026)

Story: ETM-8392 Daily Report - Ramp Down / Ramp Up vertical lines on the Gantt chart (AC-4: Export PDF).
Data: Event ART PSD, Plan **QA 8392 Snap C** (snapshot Ramp Down 11 Jun 2026 08:00, Ramp Up 13 Jun 2026 20:00).
Export: `Daily Plan` + `Focus Timeframe` (window D-1 00:00 to D+2 23:59, DEC-061).

## Q1. Part of a Ramp badge shows in the PDF when its line is outside the Focus window

The lines themselves are correct in every PDF we checked. But in two PDFs where a line is **outside** the window, a small piece of that line's badge text is still drawn in the Gantt header:

| PDF (day D) | Window | Line outside | What shows | Picture |
|---|---|---|---|---|
| 14 Jun 2026 | 13-16 Jun | Ramp Down (11 Jun) | faint white text "Down" left of the "13" column | `ba-round3/pdf-14jun-down-fragment.png` |
| 17 Jun 2026 | 16-19 Jun | Ramp Up (13 Jun) and Ramp Down | faint white text "p Up" at the left edge of the "16" column | `ba-round3/pdf-17jun-pup-fragment.png` |

The text is also in the PDF text layer (so it is not an image artefact). On screen (Daily Report and Shutdown Logic) the badges look correct; when the two lines are close, the badges overlap and Ramp Down stays on top (ETM-7897 rule).

**Question:** When a Ramp line is outside the Focus window, should the PDF show **nothing** of that line (no line and no badge text)? If yes, we will log this as a defect. If a cut badge at the edge is acceptable, we will pass these steps.

## Q2 (minor, same PDFs). Last column and edge badge cut by the page edge

- In the Focus PDFs, the last day column (D+2) is cut by the right page edge.
- In the 11 Jun PDF (window 10-13 Jun) the Ramp Up line on 13 Jun (last day, inside per DEC-061) is drawn, but its badge shows only "R".

**Question:** Is it acceptable that the D+2 column and a badge on that day are partly cut, or should the whole D+2 day and its badge fit on the page?

Thank you.

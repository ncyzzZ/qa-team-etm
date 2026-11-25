# ETM-8521 manual steps: ETM-8736 (NxN block from Excel anchors at the focused cell and replaces the range)

Environment: QA only (https://stms-qa.apps.pttep.com). One framed full-screen picture per step (Xray needs a picture per step).
Log in as Turnaround Manager. Why manual: the script failed 3 fix rounds (24–25 Nov). Every time the whole paste was undone, and the script cannot see why. A person, or the browser agent, can watch what the page shows right after Ctrl+V.

## Data
- Plan: the Shutdown Logic the specs use (`SHUTDOWN_LOGIC_*` in `ep-etm-fe-qa/.env`): `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/6b5550e3-34c1-476d-b9f2-ded3d9f3a0a5/logics/d878739c-b7e0-4df7-921e-14543e944c1f`. Nothing is saved: the paste stays a draft and the page is reloaded without Save at the end.
- Rows: 6 Lv4 rows right under each other in ONE Work (no Work / Work Header row between them). Row 1 = "row above", rows 2–6 = the 5 target rows. The 2nd of them is the anchor.
- "Excel block": no Excel on the runner, so the clipboard is filled with tab-separated text (`navigator.clipboard.writeText`). 5 rows x 3 columns (Description, Duration, Start):
  `Pump overhaul A` / `8` / S2, `Pump overhaul B` / `12` / S3, `Valve check A` / `4` / S4, `Valve check B` / `6` / S5, `Gauge test` / `2` / S6. Sn = that target row's own Start date + 1 day, written as the grid shows a date (`DD Mon YYYY`, e.g. `05 Jun 2026`). A fixed date like `05 Jun 2026` fails the plan schedule check and the app undoes the whole paste (run 2026-11-24_105124), so step 4 expects S2, not `05 Jun 2026`.

## Before you start
- Open the plan. **Collapse the Manpower Resource histogram**: hover the splitter `data-testid="sl-splitter-horizontal"` and click `aria-label="Hide histogram"`. Do it again after every reload.
- Collapse the Details column group (only Description shows) and open the Scheduled group, so Description, Duration and Start are next to each other.
- Click a cell once only. A second click on a selected cell un-selects it.

## ETM-8736 - NxN block anchors at the focused cell and replaces the existing range (7 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/6b5550e3-34c1-476d-b9f2-ded3d9f3a0a5/logics/d878739c-b7e0-4df7-921e-14543e944c1f
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the Description cell of the 2nd of the 6 rows (see Data) | The cell is focused (selected) | Grid with the focused cell |
| 2 | Write down Description, Duration, Start of the 5 target rows, the row above, and the cell left of the focused cell | The old values are written down | Grid with the range |
| 3 | Put the 5 x 3 block (see Data) on the clipboard and read it back | The clipboard holds 5 lines of 3 tab-separated values | Grid, clipboard text in the caption |
| 4 | Press Ctrl+V. Right after it, write down any toast, message, red cell or pop-up ("No Working Time Available": click OK and write it down, BA R2-5) | The focused row shows `Pump overhaul A`, Duration `8`, Start S2 (date part). If the cells go back to the old values, write down exactly what the page showed and when | Grid right after Ctrl+V, and a second picture about 3 s later |
| 5 | Check the other 4 target rows | They show the other 4 block rows (Description, Duration, Start date part); none of the 15 old values is left | Grid with the range |
| 6 | Check the row above and the cell left of the focused cell | Same values as written down in step 2 | Grid with the row above |
| 7 | Press Ctrl+V twice more without clicking. Then reload the page without Save and collapse the histogram again (clean-up) | After the two pastes, the same range shows the block, nothing outside it changed, no doubled value and no error. After the reload, the 6 rows show the step 2 values again | Grid after the 2 pastes, and grid after the reload |

Pass (proposal): steps 4–7 match. If step 4 is undone again, record what the page showed: that is the input for a BA question or a defect (user decides).

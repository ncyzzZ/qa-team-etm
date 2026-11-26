# ETM-8521 manual steps: ETM-8738 (large paste finishes; result equals the old behaviour)

Environment: QA only (https://stms-qa.apps.pttep.com). One framed full-screen picture per step (Xray needs a picture per step).
Log in as Turnaround Manager.

## Data
- Plan: the largest Shutdown Logic on QA = `ETM8449_PATH` (`ep-etm-fe-qa/.env`, shared with ETM-8449). **Step 7 saves** (user yes in chat 25 Nov 2026: "Run with Save"). Clean-up after step 8 puts the old values back and saves again, so the plan ends as it started.
- "Excel block" (no Excel on the runner): the clipboard is filled with tab-separated text, as Excel puts it there. Block = **50 rows x 2 columns (Description, Duration)**: row n = `Large paste n` / `4`.
  - Only Description and Duration: Start / End values from another plan fail the schedule check and the app reverts the whole paste (run 2026-11-24_105124), and Working Location / Manpower Resource are not next to Duration in the grid. So step 7 checks 2 of the 6 TC columns.
- No previous build and no saved ETM-2615 results (BA R2-7 "b", 25 Nov): the compare steps were removed from the Xray Test (8 steps now).

## Before you start
- Open the plan, then **collapse the Manpower Resource histogram** (hover the splitter `data-testid="sl-splitter-horizontal"`, click `aria-label="Hide histogram"`). Do it again after every reload.
- Collapse the Details column group (only Description shows) and open the Scheduled group, so Description and Duration are next to each other.
- Write down the Description and Duration of the 50 GRID rows from the first Lv4 row (block row n = grid row n, Work / Work Header rows included: the paste writes their Description too, BA R3-3), for step 6 and the clean-up.

## ETM-8738 - large paste finishes and the result equals the old behaviour (8 steps)
writes data: yes (step 7 Save on the ETM8449_PATH plan, then clean-up Save with the old values)
role: turnaroundManager
start: ETM8449_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the Description cell of the first Lv4 row (one click; a second click on a selected cell un-selects it) | The cell is focused (selected) | Grid with the focused cell |
| 2 | Put the 50 x 2 block (see Data) on the clipboard with `navigator.clipboard.writeText` (stands in for Ctrl+C in Excel) | The clipboard holds 50 lines, 2 tab-separated values each (read it back) | Grid, clipboard line count in the caption |
| 3 | Note the time, press Ctrl+V. If "No Working Time Available" opens, click OK and write it down (existing behaviour, BA R2-5) | The paste starts | Grid right after Ctrl+V |
| 4 | Note the time when the table is steady: no more cell or bar change, and the page answers a click | The time from Ctrl+V to steady table is written down (information only, no limit, DEC-049) | Grid when steady, time in the caption |
| 5 | Scroll the grid down and up, click a cell | No freeze and no error message; scrolling and clicking work | Grid after scrolling |
| 6 | Compare the pasted cells with the block (Description and Duration of the 50 rows) | Every Lv4 row of the range shows `Large paste n` / `4.00`. Work / Work Header rows in between: Description `Large paste n` (BA R3-3), Duration unchanged (read-only, R2-3) | Grid with the pasted range (a few pictures if it is long) |
| 7 | Click Save, then Confirm | The confirm modal appears, then the toast `Save Success`; no error and the page stays usable | Toast `Save Success` |
| 8 | Reload the page, collapse the histogram again | The 50 rows show the pasted values again (Lv4 `Large paste n` / `4.00`) | Grid after reload |

Clean-up (not a Test step, required): put the old Description / Duration of the 50 grid rows (written down before) back with one paste of the old block at the same first row, Save + Confirm, reload and check the 50 rows equal the written-down values. Write the result in the verdict file.

Pass (proposal): all 8 steps can be proposed pass or fail from the run; nothing needs a baseline any more.

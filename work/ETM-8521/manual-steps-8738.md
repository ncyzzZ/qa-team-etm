# ETM-8521 manual steps: ETM-8738 (large paste finishes; result equals the old behaviour)

Environment: QA only (https://stms-qa.apps.pttep.com). One framed full-screen picture per step (Xray needs a picture per step).
Log in as Turnaround Manager.

## Data
- Plan: the largest Shutdown Logic on QA = `ETM8449_PATH` (`ep-etm-fe-qa/.env`, shared with ETM-8449). Nothing is saved: the paste stays a draft and the page is reloaded without Save at the end, so no QA data changes.
- "Excel block" (no Excel on the runner): the clipboard is filled with tab-separated text, as Excel puts it there. Block = **50 rows x 2 columns (Description, Duration)**: row n = `Large paste n` / `4`.
  - Only Description and Duration: Start / End values from another plan fail the schedule check and the app reverts the whole paste (run 2026-11-24_105124), and Working Location / Manpower Resource are not next to Duration in the grid. So step 7 checks 2 of the 6 TC columns.
- No previous build exists (BA R2-7): "compare with the previous build" = the saved results of the ETM-2615 Tests. None were found in the QA folders on 25 Nov, so steps 5, 8, 9, 10 are needs-human.

## Before you start
- Open the plan, then **collapse the Manpower Resource histogram** (hover the splitter `data-testid="sl-splitter-horizontal"`, click `aria-label="Hide histogram"`). Do it again after every reload.
- Collapse the Details column group (only Description shows) and open the Scheduled group, so Description and Duration are next to each other.
- Write down the Description and Duration of the first 50 Lv4 rows from the first Lv4 row (picture), for step 7 and the clean-up.

## ETM-8738 - large paste finishes and the result equals the old behaviour (12 steps)
writes data: no
role: turnaroundManager
start: ETM8449_PATH
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Click the Description cell of the first Lv4 row (one click; a second click on a selected cell un-selects it) | The cell is focused (selected) | Grid with the focused cell |
| 2 | Put the 50 x 2 block (see Data) on the clipboard with `navigator.clipboard.writeText` (stands in for Ctrl+C in Excel) | The clipboard holds 50 lines, 2 tab-separated values each (read it back) | Grid, clipboard line count in the caption |
| 3 | Note the time, press Ctrl+V. If "No Working Time Available" opens, click OK and write it down (BA R2-5, not in the TC) | The paste starts | Grid right after Ctrl+V |
| 4 | Note the time when the table is steady: no more cell or bar change, and the page answers a click | The time from Ctrl+V to steady table is written down (information only, no limit, DEC-049) | Grid when steady, time in the caption |
| 5 | Do the same paste on the previous build and write down its time | needs-human: no previous build (R2-7) and no saved ETM-2615 time found | (none) |
| 6 | Scroll the grid down and up, click a cell | No freeze and no error message; scrolling and clicking work | Grid after scrolling |
| 7 | Compare the pasted cells with the block (Description and Duration of the 50 rows) | Every Lv4 row of the range shows `Large paste n` / `4.00`. Work / Work Header / Platform rows in between: Duration read-only (R2-3), write down what the Description shows | Grid with the pasted range (a few pictures if it is long) |
| 8 | Compare bars, POB / Man-hrs and the Manpower Histogram with the previous build | needs-human: no previous-build result to compare (R2-7) | (none) |
| 9 | Compare the dependency lines of the pasted rows with the previous build | needs-human: no previous-build result (R2-7) | (none) |
| 10 | Compare POB, Man-hrs, Start, End of the Work, Work Header and Platform rows with the previous build | needs-human: no previous-build result (R2-7) | (none) |
| 11 | On the new build only, click Save and Confirm | needs-human: Save writes to a plan other testers use (ETM-8449); not approved. Do NOT click Save | (none) |
| 12 | Reload the page (no Save), collapse the histogram again | needs-human for the TC check (nothing was saved). Clean-up: the first 50 Lv4 rows show the values written down in "Before you start" again | Grid after reload |

Pass (proposal): steps 1-4, 6, 7 can be proposed pass; 5, 8, 9, 10, 11, 12 stay needs-human until a baseline (ETM-2615 results or a Dev recording) and a card-owned plan exist.

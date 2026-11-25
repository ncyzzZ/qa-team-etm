# ETM-8034 Xray step edits proposed (2026-11-24), not applied

Old step text is saved in this file (below each change). Apply only after the user's yes.

## ETM-8863 (actor lost) — APPLIED 2026-11-24 (user yes in chat), read back OK
- Step 2 action: "reload the plan." -> "In browser 2 reload the plan."
- Step 4 action: "reload the plan." -> "In browser 2 reload the plan."
- Step 5 action: "open the plan in a new tab." -> "In browser 2 open the plan in a new tab."
- Step 9 action: "Open the plan in browser 2 as the second user." -> "In browser 2 (a second Turnaround Manager session) reload the plan."  (QA has one manager login; the script uses a second session of it)

## ETM-8861 (copy / paste action named; BA R3-3 DEC-055) — APPLIED 2026-11-24 (chat "แก้ 8861 ได้เลย")
- Step 1 action: "Copy the cell values of the coloured Work row (ETM-2615)." -> "Double-click the No. cell of the coloured Work row and press Ctrl+C (ETM-2615)."
- Step 2 action: "Paste it with the paste action the Gantt table offers." -> "Double-click the No. cell of the target Work row and press Ctrl+V."

## ETM-8871 (no Work-level filter exists in the Filter Panel)
- Step 8 action: "Apply a filter (Filter Panel or a column filter) that shows only Work A." -> "In the Filter Panel tick only the Work Header of Work A (Work B is under another Work Header)."  expected: "Work A is shown with `B5F5EC`; Work B is not shown."
- Step 10 action: "Apply a filter that shows only Work B." -> "In the Filter Panel tick only the Work Header of Work B."  expected: "Work B is shown with `FFE58F`; Work A is not shown."

## ETM-8862 s7-8 and ETM-8865 s22-23 (wording, from ETM-2703; spec titles change with it) — APPLIED 2026-11-24 (chat "แก้คำได้เลย"), read back OK; old text in xray-steps-before-work-details-2026-11-24.json; spec titles + helper message updated, tsc + qa-check spec pass
- "Work Setting modal (Edit Work)" -> "Work Details modal (Edit Work)"; "Save in the Work Setting modal" -> "Save in the Work Details modal". No change to Expected Results.

## All ETM-8034 Tests: "right-click the row" (behaviour table 2026-11-24, F-35) — PROPOSED, needs the user's yes
About 80 steps in 16 Tests say "Right-click the row, open `Highlight Row` ...". On the build a right-click on a cell gives `Highlight Cell`.
Option A (lean): no step edits; add one line at the top of each Test's Description / Precondition:
  "Right-click a row = double-click its No. cell to select the whole row, then right-click it; the menu then shows `Highlight Row`. A right-click on one cell without a selected row shows `Highlight Cell` (that cell only)."
Option B: rewrite each step (about 80 updateTestStep calls).
New coverage still missing (after BA adds the AC): Highlight Cell on one cell / several cells (Shift + Click), and the No. column Click / Shift + Click.

## Palette hex -> build values (user 2026-11-24 "เอาสีตาม dev", F-36) — ON HOLD (board 15:25 "ยังก่อน")
65 steps in 14 Tests (8856, 8858-8869, 8871) still use the old hex. Old text saved: xray-steps-before-palette-2026-11-24.json.
Map: D6E4FF→D7E3FF, BAE0FF→B9E0FF, B5F5EC→B4F5EC, FFD8BF→FFD9BF, FFCCC7→FFCCC6, FFD6E7→FFD7E7; 1D39C4→1E39C5, 1677FF→1777FF, 08979C→04979C, 52C41A→53C31B, 81A827→81A828, D4B106→D4B108, FA8C16→FA8B16, F5222D→F5212D, EB2F96→EB2E97.
Also check the "Test Data" colour tables in the Test descriptions (ETM-8858, 8863) — not in the steps.

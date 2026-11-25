# ETM-8034 questions for BA, round 4 (2026-11-24) — ON HOLD (user 2026-11-24: Highlight Cell is intended, wait; do not send)

AC 1.2 (edited 24 Nov 14:23) now says No Color + 12 colours (13 options): this matches ETM-8856 and the script. Thank you.

1. **Highlight Cell is not in the AC.** The build of 24 Nov (stms-fe 73dfde33) and the behaviour table the team shared say: a right-click on a cell (no row selected) shows **Highlight Cell** and colours only the selected cell(s); **Highlight Row** shows only after a double-click on the No. cell selects the whole row (Select Row + Right Click). Shift + Click / Shift + Double Click select several cells / rows. AC 1.1 still says "Right-clicking a row ... Highlight Row", and AC 2 / AC 3 speak of the whole row only.
   Please add to AC 1.1, AC 2 and AC 3: (a) how to select a row (double-click No.), (b) Highlight Cell / Change Text Color on one or several cells, (c) whether a cell colour is saved, undone, duplicated, copied and exported like a row colour, (d) the Delete option in this menu (is it the existing Delete Work / Delete Work Breakdown?).
   Until then QA tests Highlight Row through a selected row, and has no Test for Highlight Cell.

# ETM-8861 copy / paste probe - 2026-11-26 (QA, Turnaround Manager, plan S26 Row Colour, nothing saved)

Source Work row 33 "44443 : Maimai" (FFE58F + D48806), target Work row 68 "TC7125-risnw : QA test work 1 for ETM-7125" (B5F5EC).

A. Xray steps 1-2 (double-click No. of the source, Ctrl+C; double-click No. of the target, Ctrl+V):
- The double-click selects the row's 6 data cells plus one Gantt timeline cell (`_timeAxis3`).
- After Ctrl+C the clipboard is EMPTY; after Ctrl+V the target row is unchanged. Nothing is copied (matches FE known defect D4 "Row copy / paste moves only the No.", no Jira defect found).

B. Cell range (click Description, Shift+click Remark of the source, Ctrl+C; click Description of the target, Ctrl+V):
- Clipboard: `Maimai` + 5 empty values (Duration, Predecessor, Equipment, Manpower, Remark are blank on copy by design: `formatCellForClipboard`).
- Target Description becomes "TC7125-risnw : Maimai"; target keeps B5F5EC and default text 595959 (no FFE58F / D48806).
Pictures: step2_paste_A.png, step2_paste_B.png; raw values probe.json.

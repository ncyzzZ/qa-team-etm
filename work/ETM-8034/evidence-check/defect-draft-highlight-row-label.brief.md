# Evidence check defect-draft-highlight-row-label (ETM-8034, defect)

sourceHash: 0bd79ba3f4ac

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), FE build after stms-fe merge 170f4070 (25 Nov 14:55), Turnaround Manager, Chrome desktop 1920x1080. Event NN TEST QA, Shutdown Logic `S26 Row Colour`, a Work Breakdown row with no colour.

On the Shutdown Logic page, selecting a whole row (double-click its No. cell) and right-clicking it should offer `Highlight Row`. The menu now always offers `Highlight Cell`, even though the whole row is selected. Picking a colour from it still colours every cell of the row, so only the option name is wrong.

## Steps
1. Log in as a Turnaround Manager and open the Shutdown Logic `S26 Row Colour` (event NN TEST QA). Collapse the Manpower Resource histogram (hover the splitter, click `Hide histogram`).
2. Double-click the No. cell of a Work Breakdown row. The whole row is selected.
3. Right-click the No. cell of the same row.
4. Read the first option of the context menu.
5. Open it and pick the second colour (D6E4FF).

## Expected Result (as the draft states it: check it has a source)
- With the whole row selected (double-click on No.), the first option of the context menu is `Highlight Row` (AC 1.1: "Two new options above the existing ones: Highlight Row and Change Text Color"; F-35 behaviour table: Highlight Row after Select Row + right-click, Highlight Cell only when one cell is right-clicked).
- Xray ETM-8854 step 8: "Right-click a Work Breakdown row. -> The menu shows `Highlight Row` and `Change Text Color`."

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8034/evidence-check/defect-draft-highlight-row-label.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8034/evidence-check/defect-draft-highlight-row-label.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8034/evidence-check/defect-draft-highlight-row-label.pics/pic-3.png

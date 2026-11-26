# Evidence check defect-draft-highlight-row-regression (ETM-8034, defect)

sourceHash: 8f04a2a2c696

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA, Turnaround Manager, Shutdown Logic of plan "S26 Row Colour" (event NN TEST QA), Chrome. Seen 25 Nov 2026 18:56 and 19:18.

## Steps
1. Log in as Turnaround Manager and open the Shutdown Logic page of a plan.
2. Double-click the No. cell of a Work row (the whole row turns blue = selected).
3. Right-click the selected row.
4. Read the first option of the context menu.

## Expected Result (as the draft states it: check it has a source)
The first option is **Highlight Row**, as before this build (ETM-8034 AC 2 and the confirmed behaviour: a whole selected row gives Highlight Row; one selected cell gives Highlight Cell). Xray ETM-8854 step 2: "First option is Highlight Row".

---

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8034/evidence-check/defect-draft-highlight-row-regression.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8034/evidence-check/defect-draft-highlight-row-regression.pics/pic-2.png

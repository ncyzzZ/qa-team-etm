# Evidence check defect-draft-create-work-case-variant (ETM-8049, defect)

sourceHash: 6adc10507fb6

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), 25 Nov 2026, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch". Playwright runs 2026-11-25_153747 (pictures below) and 2026-11-25_164740 (after the ETM-9223 fix was deployed, same result), Xray ETM-8788.

## Steps
1. Open the Worklist of Plan "QA ETM-8049 Scratch" and click `Create Work` > `Manual Create`.
2. In the Deck cell of the work row, type `main deck` and press Enter (it becomes `Main Deck`).
3. Type `Cellar deck` and press Enter (it becomes `Cellar Deck`).
4. Type `Dock Area` and press Enter.
5. Type `DOCK AREA` and press Enter.
6. Fill in the other required fields and click `Save`. Read the Deck cell of the new work in the Worklist.

## Expected Result (as the draft states it: check it has a source)
- Step 5 adds a fourth tag `DOCK AREA`, exactly as typed. It is not merged with `Dock Area` and not changed to `Dock Area`.
- After Save the Deck cell of the new work shows `Main Deck, Cellar Deck, Dock Area, DOCK AREA`.
- Rule: BA answer to Q34 (25 Nov 2026): one cell may hold `Dock Area` and `DOCK AREA` together. AC 6.2: "A value that does not match Master Data is saved exactly as entered ... Values that differ only by letter case are stored and shown as separate values." BA Q32: Create Work and Edit Work Breakdown accept several Deck values in one cell.
- Xray ETM-8788 (TC-015), step 8, expects "A fourth tag shows DOCK AREA exactly as typed".
- Note: Edit Work Breakdown uses the same Deck cell; it was not checked for this case.

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-create-work-case-variant.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-create-work-case-variant.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-create-work-case-variant.pics/pic-3.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-create-work-case-variant.pics/pic-4.png

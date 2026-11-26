# Evidence check defect-draft-filter-option-case-match (ETM-8049, defect)

sourceHash: 408d35a0603a

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (https://stms-qa.apps.pttep.com), 25 Nov 2026 evening, FE build `main-A7CDL4M2.js`, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch" (data made in the UI). Playwright run 2026-11-25_200103 (UI-made data, pictures below; same result in runs 195128 and 195537); Xray ETM-8783 TC-010 failed the same way in run 2026-11-25_192944 and passed in run 2026-11-25_155213 (afternoon build).

## Steps
1. Open the Worklist of Plan "QA ETM-8049 Scratch". Click `Create Work` > `Manual Create` and create work `WK-P1` with Working Location (Deck) `Dock Area` (free text, not in Master Data), X `1`, Y `A`.
2. Create a second work `WK-P2` the same way with Deck `DOCK AREA`.
3. In the search box above the table type the number part the two works share and press Enter, so only `WK-P1` and `WK-P2` are shown.
4. Open the filter of the Working Location (Deck) column, untick `Select All`, and type `dock` in the filter search box. Both `Dock Area` and `DOCK AREA` are listed, both unticked.
5. Click the checkbox of `Dock Area` only.
6. Click `Apply`.

## Expected Result (as the draft states it: check it has a source)
- Step 5: only `Dock Area` is ticked; `DOCK AREA` stays unticked.
- Step 6: only `WK-P1` is shown. Each spelling is its own option and selecting one matches that exact spelling (ETM-8049 AC 3.6; Xray ETM-8783 TC-010 step 3).
- The search box inside the filter popup still ignores case (ETM-9231): typing `dock` lists both options. That part is fine.

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-2.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-3.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-4.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-5.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-6.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/evidence-check/defect-draft-filter-option-case-match.pics/pic-7.png

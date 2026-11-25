# Evidence check c1-filter-case (ETM-8049, defect)

sourceHash: fed81e63cf1f

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA, 24 Nov 2026, FE build main-BIPLUAIT.js, user TM. Event NN TEST QA, Plans "QA ETM-8049 Any" and "QA ETM-8049 Case".

## Steps
1. Open the Worklist of Plan "QA ETM-8049 Any".
2. Open the Job Description filter.
3. Type `wk-2` in the search box of the filter popup.
4. Delete the text and type `WK-2`.

## Expected Result (as the draft states it: check it has a source)
- The filter search ignores letter case: `wk-2` finds `QA ETM-8049 WK-2-A`, `deck` finds every value that contains "deck", and `main` finds both `Main Deck` and `main deck`.
- This is how the search worked before this build.
- The Xray steps of ETM-8781 and ETM-8783 expect case-insensitive search.
- Note: the ETM-8049 AC does not state the case rule in words. AC 3.1 says the filter is "the same as other columns" (ETM-434 AC 5).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8049/evidence-check/c1-filter-case.pics/pic-1.jpg
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8049/evidence-check/c1-filter-case.pics/pic-2.jpg

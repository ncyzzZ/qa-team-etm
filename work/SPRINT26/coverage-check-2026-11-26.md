# Sprint 26 (Test Plan ETM-8636) - AC coverage check, 26 Nov 2026

Source: each card's `work/<KEY>/ac-strength.json` (AC to Test map) against the live Xray status of its Test Execution (read 26 Nov).
A Test counts only when it is PASSED in the card's Test Execution (manual or script). Skipped is never PASSED.

| Card | Test Execution | Xray | AC | Result |
|---|---|---|---|---|
| ETM-7343 | ETM-8703 | 17 PASSED | 10 | All covered. AC-7 (PDF colours) by manual 8702, 8726 PASSED. AC-10 (empty value = default) is N/A by BA (Plan/Actual are NOT NULL), 8724 removed from the TE. |
| ETM-8003 | ETM-8816 | 10 PASSED | 5 | All covered. AC-4 (PDF) by manual 8805 PASSED. |
| ETM-8034 | ETM-8875 | 18 PASSED, 1 TO DO | 7 | AC-4 by 8868, 8869 PASSED; AC-7 (Export PDF) by 8870 PASSED. Open: 8860 TO DO (manual pass 27/27, waiting on the picture decision for steps 6 and 27). |
| ETM-8042 | ETM-8873 | 24 PASSED | 12 | All covered. |
| ETM-8049 | ETM-8822 | 21 PASSED | 18 | All covered. BA Q36 open (free-text Deck in the Gantt cell editor); 8787 passed through Edit by Modal. |
| ETM-8388 | ETM-8732 | 23 PASSED | 10 | All covered. |
| ETM-8391 | ETM-8874 | 15 PASSED | 11 | All covered. 8648 (no View Worklist user) N/A, removed from the TE. |
| ETM-8392 | ETM-8825 | 18 PASSED | 7 | All covered. |
| ETM-8393 | ETM-8828 | 15 PASSED | 4 | All covered. |
| ETM-8394 | ETM-8774 | 19 PASSED | 14 | All covered. Deleting a Work with its breakdowns moved to an improvement Story (no key yet, no TC yet). |
| ETM-8405 | ETM-8647 | 9 PASSED | 9 | All covered. AC-14 by manual 8643, AC-15 by manual 8644 PASSED. |
| ETM-8449 | ETM-8637 | 7 PASSED | 4 | All covered. |
| ETM-8521 | ETM-8773 | 19 PASSED | 7 | All covered. AC-1 (faster) by manual 8738 PASSED. |

## Not fully closed

1. ETM-8034 / 8860: TO DO until the user decides on the step 6 and 27 pictures.
2. ETM-8049 / BA Q36: answer may turn into a defect on the Gantt cell editor.
3. ETM-8394: the improvement Story for Work + breakdown delete has no key, so no TC yet.

## Housekeeping (does not change coverage)

- `ac-strength.json` files are from 19-24 Nov. Tests added later are not in their AC lists (for example 8838, 8846 in ETM-8042; 8857-8872 in ETM-8034), and many AC are still rated weak / blocked although all their tests passed (`qa-check strength` warns "re-rate it"). Ratings need a reviewer pass.
- This check uses the AC lists in those files. It does not re-read each Story for AC added after the file date.

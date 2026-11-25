# Dev brief: (new defect) Create Work Deck cell refuses a case variant

Story: ETM-8049 (Worklist: Working Location columns). Related defect: ETM-9223 (the same rule in Import Excel).

## 1. What is wrong

In Create Work > Manual Create, the Deck cell's tag input treats two free-text values that differ only by letter case as the same value. Example: after the tag `Dock Area` is in the cell, typing `DOCK AREA` + Enter adds nothing. The suggestion list shows `Dock Area` with a tick (already selected). The BA says one cell may hold both values (Q34 = a, 25 Nov 2026).

## 2. Where

- Page: Worklist > Create Work > Manual Create, Deck (Working Location) cell of a work row. Edit Work Breakdown uses the same Deck cell editor, so it may have the same problem (not checked separately).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`, then Create Work.
- Environment: QA, 24 Nov 2026. Role: Turnaround Manager.
- Data: event `NN TEST QA`, Plan `QA ETM-8049 Scratch`. No special data is needed; any new work row reproduces it.

## 3. Steps to reproduce

1. Open the Worklist, click `Create Work`, then `Manual Create`.
2. In the Deck cell type `Dock Area` and press Enter: the tag `Dock Area` is added.
3. Type `DOCK AREA` and press Enter.

## 4. Actual vs Expected

| | Actual | Expected |
|---|---|---|
| After step 3 | One tag `Dock Area`. The list ticks `Dock Area`, and `DOCK AREA` is dropped. | Two tags: `Dock Area` and `DOCK AREA`, each exactly as typed. |
| After Save, Worklist Deck cell | `Dock Area` | `Dock Area, DOCK AREA`. Free text is sorted by text comparison, with lower case first. |

Master Data values are different: typing `MAIN DECK` must still become `Main Deck`, and a second `main deck` is a real duplicate of `Main Deck`. Only free text that is not in Master Data keeps each case variant.

## 5. Rule source

- BA Q34 (25 Nov 2026): answer "a", one cell may hold `Dock Area` and `DOCK AREA` together.
- BA Q33 (25 Nov 2026): a value that matches Master Data (any case) takes the Master Data spelling; free text stays as typed.
- ETM-8049 AC 6.2: free text (not Master Data) is saved exactly as entered.
- BA Q32 (24 Nov 2026): Create Work and Edit Work Breakdown accept several Deck values in one cell.
- Xray ETM-8788 (TC-015) step 8: "A fourth tag shows `DOCK AREA` exactly as typed, not `Dock Area` and not merged with the tag `Dock Area`." Step 11: the cell shows `Main Deck, Cellar Deck, Dock Area, DOCK AREA`.

## 6. Hints for the fix (guess)

These are guesses, not checked in the source:
- The tag input (select in tags mode) probably compares the typed value with the selected values without regard to case. This is either the option filter or a duplicate check that uses `toLowerCase()`.
- For values that are not in Master Data, the duplicate check should compare the exact text. The case-insensitive match should stay only for converting Master Data values.

## 7. How QA will retest

- Run `verifyWorklistWorkingLocationEntry.spec.ts -g "ETM-8788"` (Plan "QA ETM-8049 Scratch"). Steps 8 and 11 must pass.
- Check by hand in Edit Work Breakdown: a breakdown with `Dock Area` takes `DOCK AREA` as a second tag.
- Make sure `MAIN DECK` still becomes `Main Deck`.

## 8. Out of scope / do not change

- Master Data conversion (Main Deck, Cellar Deck, ...) stays as it is.
- Import Excel is ETM-9223.
- ETM-9225 (an old stored `main deck` is not converted) is a separate defect.

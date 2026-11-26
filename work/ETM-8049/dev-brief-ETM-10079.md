# Dev brief: ETM-10079 (Create Work Deck cell drops a case variant)

Story: ETM-8049 (Worklist: Working Location columns). Split out of ETM-9223 (Import Excel part, fixed).

## 1. What is wrong

On Create Work > Manual Create, one Working Location (Deck) cell cannot hold two free-text values that differ only by letter case. With `Dock Area` already in the cell, typing `DOCK AREA` + Enter adds nothing, and after Save only `Dock Area` is stored. The Import Excel fix of ETM-9223 does not cover this screen.

## 2. Where

- Page: Worklist > Create Work > Manual Create, Deck cell of the work row.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, 25 Nov 2026 (after the ETM-9223 fix was deployed).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Scratch`. `Dock Area` is free text (not in Master Data).

## 3. Steps to reproduce

1. Open the Worklist of Plan `QA ETM-8049 Scratch`, click `Create Work` > `Manual Create`.
2. In the Deck cell type `main deck` + Enter, `Cellar deck` + Enter, `Dock Area` + Enter.
3. Type `DOCK AREA` + Enter.
4. Fill in the other required fields, Save, read the Deck cell of the new work.

## 4. Actual vs Expected

| Step | Actual | Expected |
|---|---|---|
| 3, suggestion list | only `Dock Area`, ticked | `DOCK AREA` can be added as a new value |
| 3, after Enter | 3 tags: `Main Deck`, `Cellar Deck`, `Dock Area` | 4 tags, the 4th is `DOCK AREA` exactly as typed |
| 4, saved row | `Main Deck, Cellar Deck, Dock Area` | `Main Deck, Cellar Deck, Dock Area, DOCK AREA` |

## 5. Rule source

- ETM-8049 AC 6.2: "A value that does not match Master Data is saved exactly as entered. It is not converted to match other works or other Work Breakdowns. Values that differ only by letter case are stored and shown as separate values (AC 2.1, AC 3.6)."
- BA answer Q34 (25 Nov 2026, "a"): one Create Work / Edit Work Breakdown cell may hold `Dock Area` and `DOCK AREA` together.
- BA answer Q32 (24 Nov 2026): Create Work and Edit Work Breakdown both accept several Deck values in one cell.
- BA answer Q27 / DEC-046: import accepts both `Helipad` and `helipad` (same rule, fixed in ETM-9223).
- Xray ETM-8788 (TC-015) step 8: "A fourth tag shows DOCK AREA exactly as typed".

## 6. Hints for the fix (guesses, not checked in code)

- Guess: the Deck tag input finds an existing tag or option by comparing text without letter case, so `DOCK AREA` matches `Dock Area` and is treated as already selected. For free text it should compare exactly; only the Master Data match (AC 6.1) should ignore case.
- Guess: the ETM-9223 fix changed the import validation only; the same compare in the form's tag input may be a separate piece of code.
- Check Edit Work Breakdown too: it uses the same kind of Deck cell (not tested for this case).
- We did not read the FE source or the network log for this.

## 7. How QA will retest

- Automated: Xray ETM-8788 (TC-015), step 8 and the saved-row step.
- Pass: `DOCK AREA` is added as a 4th tag, the saved row shows `Main Deck, Cellar Deck, Dock Area, DOCK AREA`. Control: typing `Dock Area` again (same spelling) still adds nothing. `main deck` still becomes `Main Deck` (Master Data, AC 6.1).

## 8. Out of scope / do not change

- Exact duplicates (same spelling) in one cell must still be refused.
- Master Data values keep converting to the Master Data spelling (AC 6.1, 6.3).
- Do not change the Import Excel check fixed in ETM-9223.

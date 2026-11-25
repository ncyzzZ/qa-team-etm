# Evidence check c3-main-deck (ETM-8049, defect)

sourceHash: 91bb35efcf60

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
- Page: Worklist > row menu > View Work Details > Edit Breakdown (Edit Work Breakdown).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Old`, work `WK-18-O`, Work Breakdown `WK-18-O-BD1` with Deck `HELIPAD, main deck`. The value `main deck` was set in the DB to stand for data saved before ETM-8049 (not made on the screen).

## Steps
1. Open the Worklist of Plan `QA ETM-8049 Old`.
2. On work `WK-18-O`, open the row menu > View Work Details > Edit Breakdown.
3. Double-click the Working Location (Deck) cell of `WK-18-O-BD1` and remove the tag `main deck` with its x.
4. Type `main deck`. The suggestion list shows `Main Deck`.
5. Press Enter.

## Expected Result (as the draft states it: check it has a source)
- Expected: the tag becomes `Main Deck` as soon as Enter is pressed, and `Main Deck` is saved. Stored values that are not changed keep their spelling.

Rule source:
- ETM-8049 AC 6.1: "When a Working Location (Deck) value is saved through any entry point, a value that matches a Master Data value (ignoring letter case) is converted to the Master Data spelling." Entry points include "Work Breakdown edit (Edit Work Breakdown), by typing or pasting."
- ETM-8049 AC 6.3: "On screens where the user types or pastes, the converted spelling is shown in the field as soon as the value is entered, before saving."
- ETM-8049 AC 6.4: "Only Deck values added or changed in the save are converted. Values already stored and not changed keep their stored spelling. There is no data migration."
- BA answer Q26 (24 Nov 2026): AC 6.1 reads "Edit Work Breakdown" only.
- Not yet answered: Q33 / `questions-for-BA-ETM-9225.en.md` (see the note at the top).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8049/evidence-check/c3-main-deck.pics/pic-1.jpg
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8049/evidence-check/c3-main-deck.pics/pic-2.jpg

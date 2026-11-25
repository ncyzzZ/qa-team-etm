# Defect draft
**Summary:** Edit Work Breakdown keeps main deck instead of Main Deck
**Environment:**
- Page: Worklist > row menu > View Work Details > Edit Breakdown (Edit Work Breakdown).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Old`, work `WK-18-O`, Work Breakdown `WK-18-O-BD1` with Deck `HELIPAD, main deck`. The value `main deck` was set in the DB to stand for data saved before ETM-8049 (not made on the screen).

### Step to Reproduce
1. Open the Worklist of Plan `QA ETM-8049 Old`.
2. On work `WK-18-O`, open the row menu > View Work Details > Edit Breakdown.
3. Double-click the Working Location (Deck) cell of `WK-18-O-BD1` and remove the tag `main deck` with its x.
4. Type `main deck`. The suggestion list shows `Main Deck`.
5. Press Enter.

### Actual Result
- Actual: the cell gets the tag `main deck` (not converted). Save stays disabled. With `mAiN dEcK` the tag becomes `Main Deck`.

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/TC020-1-typed-main-deck-suggestion.jpg
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8049/TC020-2-after-enter-main-deck-not-converted.jpg

### Expected Result
- Expected: the tag becomes `Main Deck` as soon as Enter is pressed, and `Main Deck` is saved. Stored values that are not changed keep their spelling.

Rule source:
- ETM-8049 AC 6.1: "When a Working Location (Deck) value is saved through any entry point, a value that matches a Master Data value (ignoring letter case) is converted to the Master Data spelling." Entry points include "Work Breakdown edit (Edit Work Breakdown), by typing or pasting."
- ETM-8049 AC 6.3: "On screens where the user types or pastes, the converted spelling is shown in the field as soon as the value is entered, before saving."
- ETM-8049 AC 6.4: "Only Deck values added or changed in the save are converted. Values already stored and not changed keep their stored spelling. There is no data migration."
- BA answer Q26 (24 Nov 2026): AC 6.1 reads "Edit Work Breakdown" only.
- Not yet answered: Q33 / `questions-for-BA-ETM-9225.en.md` (see the note at the top).

**Fields:**
- Labels: FE
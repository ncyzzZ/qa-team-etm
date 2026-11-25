# Dev brief: ETM-9225

Story: ETM-8049 (Worklist: Working Location columns). Defect: ETM-9225.

**Read first:** the old value `main deck` used in this test was set directly in the QA database, because the screen now converts every new entry and cannot make it.
**BA answer (Q33, 25 Nov 2026):** "แปลงค่าตาม master กรณีที่ค่าเป็นแบบเดียวกับ master แต่ถ้า free text ก็ยึดตามนั้น" = a value that matches Master Data in any letter case is converted to the Master Data spelling; free text stays as typed. So a new entry `main deck` must become `Main Deck`, even when the event already holds the old `main deck`. The defect stands. (The BA did not say whether such old lower-case data exists in production.)

## 1. What is wrong

In Edit Work Breakdown, a Deck value typed in a different letter case from Master Data must be converted to the Master Data spelling. Typing `main deck` keeps `main deck` when the event already holds the old free-text value `main deck`. The suggestion list shows `Main Deck`, but after Enter the tag is `main deck`. Typing `mAiN dEcK` on the same cell correctly gives `Main Deck`.

## 2. Where

- Page: Worklist > row menu > View Work Details > Edit Breakdown (Edit Work Breakdown).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Old`, work `WK-18-O`, Work Breakdown `WK-18-O-BD1` with Deck `HELIPAD, main deck`. The value `main deck` was set in the DB to stand for data saved before ETM-8049 (not made on the screen).

## 3. Steps to reproduce

1. Open the Worklist of Plan `QA ETM-8049 Old`.
2. On work `WK-18-O`, open the row menu > View Work Details > Edit Breakdown.
3. Double-click the Working Location (Deck) cell of `WK-18-O-BD1` and remove the tag `main deck` with its x.
4. Type `main deck`. The suggestion list shows `Main Deck`.
5. Press Enter.

## 4. Actual vs Expected

- Actual: the cell gets the tag `main deck` (not converted). Save stays disabled. With `mAiN dEcK` the tag becomes `Main Deck`.
- Expected: the tag becomes `Main Deck` as soon as Enter is pressed, and `Main Deck` is saved. Stored values that are not changed keep their spelling.

## 5. Rule source

- ETM-8049 AC 6.1: "When a Working Location (Deck) value is saved through any entry point, a value that matches a Master Data value (ignoring letter case) is converted to the Master Data spelling." Entry points include "Work Breakdown edit (Edit Work Breakdown), by typing or pasting."
- ETM-8049 AC 6.3: "On screens where the user types or pastes, the converted spelling is shown in the field as soon as the value is entered, before saving."
- ETM-8049 AC 6.4: "Only Deck values added or changed in the save are converted. Values already stored and not changed keep their stored spelling. There is no data migration."
- BA answer Q26 (24 Nov 2026): AC 6.1 reads "Edit Work Breakdown" only.
- BA answer Q33 (25 Nov 2026): a value that matches Master Data (any letter case) is converted to the Master Data spelling; free text stays as typed (see the note at the top).

## 6. Hints for the fix (guesses, not checked in code)

- Guess: when the typed text matches an existing option of the event exactly (`main deck`), the editor picks that existing free-text option before it checks Master Data. With `mAiN dEcK` there is no exact match, so the Master Data check runs. If so, the Master Data match (ignoring case) should be checked first.
- Guess: the "Save stays disabled" part may come from the cell thinking nothing changed (the same value was removed and added again).
- We did not read the FE source or the network log for this defect.

## 7. How QA will retest

- Automated: Xray ETM-8793 (TC-020), the step that types `main deck` on `WK-18-O-BD1`. QA first checks that `WK-18-O` still holds the old value `main deck`.
- By hand: steps in section 3, then Save and reopen.
- Pass: the tag is `Main Deck` right after Enter, Save is enabled, `Main Deck` is stored after reopen; `mAiN dEcK` still gives `Main Deck`; another work that still holds `main deck` and is not edited keeps `main deck`.

## 8. Out of scope / do not change

- Do not migrate or convert stored values that are not edited (AC 6.4).
- Free text that does not match Master Data is saved exactly as typed (AC 6.2).
- Do not change the suggestion list.

# ETM-8049: question for BA about defect ETM-9225 (2026-11-24)

Story: ETM-8049 [Improvement] View Worklist Table - Working Location Columns (status: In Testing)
Defect: ETM-9225 "Edit Work Breakdown: typing "main deck" keeps "main deck" instead of converting to Master Data "Main Deck" when the event already has the old free-text value "main deck""
Earlier question: Q33 in questions-for-BA.en.md (not answered yet). The defect is now logged, so we need your answer to keep it open or close it.

## What QA saw

- Event NN TEST QA, Plan "QA ETM-8049 Old", work `WK-18-O`, Work Breakdown `WK-18-O-BD1` (Deck = `HELIPAD, main deck`).
- Edit Breakdown, remove the tag `main deck`, type `main deck`, press Enter: the tag stays `main deck` (lower case), although the suggestion list shows `Main Deck`.
- Typing `mAiN dEcK` on the same cell gives `Main Deck`. So only the spelling that is already stored on the event is not converted.
- Pictures: `TC020-1-typed-main-deck-suggestion.jpg`, `TC020-2-after-enter-main-deck-not-converted.jpg`.

## How the data was made (please read)

The screen now converts every new entry to the Master Data spelling, so it cannot make a lower-case `main deck` any more. QA set `main deck` directly in the QA database to stand for data saved before this change (AC 6.4: existing values are not converted, no migration). Our team rule is that test data must be reachable from the screen, so we need you to confirm this case is real.

## Questions

1. ⭐ Do values that differ from Master Data only by letter case (for example `main deck` for `Main Deck`) really exist in production data saved before this change? (yes / no)
2. ⭐ If yes: must a new entry `main deck` still convert to `Main Deck`, even when the event already holds the old value `main deck`? (AC 6.1 and 6.3 say a new entry takes the Master Data spelling; AC 6.4 says only stored values are left as they are.)

## What QA will do with your answer

- 1 = yes and 2 = yes: ETM-9225 stays open for dev.
- 1 = no (old data like this cannot exist): QA will close ETM-9225 as "data not reachable from UI" and remove that step from TC-020 (ETM-8793).
- 2 = no (keeping the old spelling is correct): QA will close ETM-9225 and change the expected result of TC-020.

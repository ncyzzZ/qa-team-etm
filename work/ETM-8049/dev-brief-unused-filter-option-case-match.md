# Dev brief: NEW (Worklist Deck filter ticks both letter-case spellings)

Story: ETM-8049 (Worklist: Working Location columns). Rename this file to `dev-brief-<DEFECT>.md` when the defect is opened.

## 1. What is wrong

In the Worklist column filter of Working Location (Deck), values that differ only by letter case (`Dock Area`, `DOCK AREA`) are listed as two options, but clicking one checkbox ticks both. Apply then filters on both values and the table shows the works of both spellings.

## 2. Where

- Page: Worklist table, column filter popup of `Working Location (Deck)`.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`; after Apply the hash holds `wsWorkingLocationDecks=Dock Area,DOCK AREA`.
- Role: Turnaround Manager.
- Environment: QA, 25 Nov 2026 evening, FE build `main-A7CDL4M2.js`. Worked on the afternoon build of the same day.
- Test data: event `NN TEST QA`, Plan `QA ETM-8049 Scratch`; two works made in Create Work with Deck `Dock Area` and `DOCK AREA` (free text).

## 3. Steps to reproduce

1. Create two works in the Worklist (Create Work > Manual Create): one with Deck `Dock Area`, one with Deck `DOCK AREA`.
2. Open the Deck column filter, untick `Select All`, type `dock` in the filter search box.
3. Click the checkbox of `Dock Area` only.
4. Click `Apply`.

## 4. Actual vs Expected

| Step | Actual | Expected |
|---|---|---|
| 3 | `Dock Area` and `DOCK AREA` both become ticked | only `Dock Area` is ticked |
| 4 | filter sent with `Dock Area,DOCK AREA`; both works shown | filter sent with `Dock Area`; only that work shown |

The search box itself may keep ignoring case (ETM-9231): typing `dock` must still list both options.

## 5. Rule source

- ETM-8049 AC 3.6: values that differ only by letter case are separate filter options.
- Xray ETM-8783 (TC-010) step 3: selecting one spelling shows only that exact spelling. This test passed on the afternoon build of 25 Nov 2026 and fails on the evening build.

## 6. Hints for the fix (guesses, not checked in code)

- The evening build contains the fix for ETM-9231 (filter search ignores case). If that fix set the AG Grid set filter to case-insensitive (`caseSensitive: false`) for the whole filter, AG Grid also merges the option keys, so ticking one spelling ticks the other. A case-insensitive mini-filter (search box) with case-sensitive keys would satisfy both ETM-9231 and AC 3.6, e.g. a custom `textMatcher` / `textFormatter` for the search only.
- Check other columns with the same filter setup (Job Description, Remark) for the same effect.

## 7. How QA will retest

- Automated: Xray ETM-8783 (TC-010) and ETM-8781 (TC-008, search ignores case) in the ETM-8049 card run: `node tools/run-card.mjs ETM-8049 tests/fe/e2e/worklist/verifyWorklistWorkingLocationCells.spec.ts -g "ETM-8781|ETM-8783"`.
- By hand: the steps above with two UI-made works; only the clicked spelling is ticked and filtered; the search `dock` still lists both.

## 8. Out of scope / do not change

- The filter search box ignoring case (ETM-9231, retest passed) must stay.
- The option list order and the "(Select All Search Results)" / disabled-Apply behaviour of the evening build (accepted, TC-008 rewritten).

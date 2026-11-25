# Dev brief: ETM-9231

Story: ETM-8049 (Worklist: Working Location columns). Defect: ETM-9231.

## 1. What is wrong

On the Worklist page, the search box inside a column filter popup now matches letter case. `deck` does not find `Main Deck`, `wk-2` does not find `WK-2-A`. It happens on every column we tried (Working Location (Deck), Job Description).
This is a regression: at 14:30 on 24 Nov 2026 the same search ignored case. It broke after the new QA FE build `main-BIPLUAIT.js`.

## 2. Where

- Page: View Worklist (Planning tab > Plan card > Worklist item).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`
- Role: Turnaround Manager.
- Environment: QA, FE build `main-BIPLUAIT.js` (24 Nov 2026).
- Test data: event `NN TEST QA`, Plans `QA ETM-8049 Any` and `QA ETM-8049 Case`. The Deck column must be turned on in Column Customization (it is hidden by default).

## 3. Steps to reproduce

1. Open the Worklist of Plan `QA ETM-8049 Any`.
2. Open the Job Description column filter.
3. Type `wk-2` in the search box of the filter popup.
4. Delete the text and type `WK-2`.
5. Open the Working Location (Deck) filter. Type `deck`, then `main`.

## 4. Actual vs Expected

| Search | Actual | Expected |
|---|---|---|
| Job Description `wk-2` | "No matches." | `QA ETM-8049 WK-2-A` |
| Job Description `WK-2` | `QA ETM-8049 WK-2-A` | same |
| Deck `deck` | only `Helideck` | `Helideck`, `Main Deck`, `Cellar Deck`, `Deck 2`, `Deck 10` |
| Deck `main` | only `main deck` | `Main Deck` and `main deck` (two separate options) |

## 5. Rule source

- ETM-8049 AC 3.1: "Each of the three columns must include a column filter as a checkbox list with a search box and Select All, the same as other columns. (Aligned with ETM-434 AC 5)"
- ETM-8049 AC 3.6: "Filter options are listed exactly as stored. If the data contains Deck values that differ only by letter case (e.g., older data), each spelling is shown as a separate option." This is about the option list, not about how the search box matches.
- The AC does not state the case rule of the search box in words. The expected result is the behaviour before this build (search ignored case on all columns) and the Xray steps of ETM-8781 and ETM-8783.

## 6. Hints for the fix (guesses, not checked in code)

- Guess: it shows on more than one column, so the change is likely in the shared column filter (search inside the checkbox list), not in the Deck column only.
- Guess: compare the filter search between the previous QA build and `main-BIPLUAIT.js`. A case-insensitive compare (for example lower-casing both sides) may have been removed or replaced by an exact `includes`.
- We did not read the FE source or the network log for this defect. The search in the popup happens on the screen; we did not see a request for it.

## 7. How QA will retest

- Automated: Xray ETM-8781 (TC-008, the "search ignoring case" step) and ETM-8783 (TC-010, case variants as separate options).
- By hand: the 4 searches in section 4, plus one more column (for example Remark or Job Owner) with a lower-case search.
- Pass: every lower-case or mixed-case search finds the same options as the exact-case search, and `Main Deck` / `main deck` are still two separate options.

## 8. Out of scope / do not change

- Keep case variants as separate options in the list (AC 3.6). Only the search box should ignore case.
- Do not change the matching rule of the filter itself (AC 3.3: a work shows if any one of its values matches a selected option).
- Do not change the top search box of the Worklist (`Search work number and job description`).

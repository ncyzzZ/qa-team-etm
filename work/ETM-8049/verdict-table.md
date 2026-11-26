# ETM-8049 - failures to decide (runs 25 Nov 2026 evening, QA FE build of 25 Nov evening)

AI suggestion only. Answer all rows in one reply, e.g. `1=tc 2=app` (script / tc / app / env / flaky).
Rows 3-4 are already decided (open defects) and are listed only so the table is complete.

| # | Test | Failed with | Run | AI suggests | Why |
|---|---|---|---|---|---|
| 1 | ETM-8781 TC-008 step 11 | Deck filter, search `deck`, click "(Select All Search Results)": the 5 listed values are unticked and Apply is DISABLED, so the hidden `Zone B` is no longer counted as ticked. Steps 9-10 (Job Description reference A/B) cannot be done as written either: with nothing ticked Apply is disabled in every column (new in this build). Steps 1-8 passed (search ignores case again, ETM-9231 fix holds). | 2026-11-25_193341 | tc? (or app) | The FE build of 25 Nov evening changed Select All with a search ("Select All Search Results") and disabled Apply with nothing ticked. Both look like intended AG Grid behaviour, so the TC steps 9-12 need new wording. If the BA says a hidden ticked value (`Zone B`) must stay ticked, it is app. |
| 2 | ETM-8783 TC-010 | Deck filter: select only the option `main deck` → table shows `WK-6b-K` AND `WK-6a-K` (`WK-6a-K` has only `Main Deck`). | 2026-11-25_192944 (passed at 2026-11-25_155213 on the afternoon build) | app (regression) | AC 3.6: selecting one spelling shows only that exact spelling. It passed this afternoon, failed on the evening build: probably a side effect of the ETM-9231 fix (case-insensitive match moved from the search box to the filter value). New defect, or a reopen comment on ETM-9231: needs its own yes and the evidence check. |
| 3 | ETM-8788 TC-015 | `DOCK AREA` not added after `Dock Area` | 2026-11-25_164740 | app: ETM-10079 (Open) | decided, defect logged 25 Nov |
| 4 | ETM-8793 TC-020 | new `main deck` stays `main deck` | 2026-11-24_220623 | app: ETM-9225 (In Progress) | decided, defect logged 24 Nov |

## Update 25 Nov 2026 20:15 (after the user's answer "1=tc 2=app")
- Row 1 (ETM-8781) = tc: script rewritten to the new wording (`xray-fix-8781-tc008-select-all.md`), PASSED in run 2026-11-25_201353. The Xray step change still needs the user's yes (Jira write).
- Row 2 (ETM-8783): the "app" suggestion was WRONG. Read-only probe (run 2026-11-25_201250, Plan Case): ticking only `main deck` with no search text sends `main deck` and shows only WK-6b-K (correct). The helper `onlyTick` typed the value in the filter search box, and in the evening build typing there changes the ticks. Helper fixed (no typing); ETM-8783 PASSED in run 2026-11-25_201353. Proposed new verdict: script (needs the user's ok). No defect.

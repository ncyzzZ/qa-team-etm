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

## Decide 26 Nov 2026 14:20 (manual runner run 2026-11-26_133539, Plan "QA ETM-8049 Logic")
| # | Test | Seen | AI suggests | Why |
|---|---|---|---|---|
| 1 | ETM-8787 step 5 | Shutdown Logic Deck input (Gantt cell and Breakdown Setting modal) accepts all 31 characters while typing; on Enter the modal tag is cut to 30, the Gantt cell adds no tag; nothing over 30 is saved. Create Work input stops at 30 (maxlength). | tc (or app) | The limit holds for what is saved. If the BA wants the same block while typing as in Create Work (AC "31st not accepted"), it is app. |
| 2 | ETM-8789 step 6 | Gantt rows alternate Work / BD1 and Deck is editable on BD1 only, so a 4-line paste into a range also hits the read-only Work rows: lines 2 and 4 lost. Not saved. | tc | Reword: paste into each BD1 Deck cell (one value each), Save, then read the Worklist; re-run steps 6-9. |
| 3 | ETM-8791 steps 11-14 row B | Only one Import page (ETM-6843): no ETM-1008/1106 template, no `Next`; Download Template = SharePoint Access Denied. Row A passed (error R7/R8, Import disabled, nothing made). Button is `Import`, not `Confirm`. | N/A + tc | Row B no longer exists in the app; Xray wording `Confirm` -> `Import`. |
| 4 | Pictures | 8787 steps 3, 5-8, 10-11 and 8791 steps 7, 14 cannot be proven by the pictures (toast gone, values cut with "...", no Work No / Y column, empty paste field). | re-take | Re-run those steps for pictures only (same card-owned data writes, reset before). |
Answer (user, chat 26 Nov 2026): "1=tc 2=tc 3=na 4=retake". Steps file reworded (8787 s5, 8789 s6, 8791 row B N/A + `Import`); Xray wording change waits for its own yes at push time.

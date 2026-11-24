# Sprint 26 – fix plan and impact check (2026-11-24)

Source: the per-card files in this folder (read-only audit, same day). Nothing is changed yet.

## Impact found before any change

| # | Impact | Where | What it means |
|---|---|---|---|
| I-1 | **Other sessions are working on the same cards now** | "QA ETM-8388 Sprint 26" (busy, run 10:18 today), "ETM-8049 QA Lead handoff" (busy, edited `workingLocation.helpers.ts` 10:19 today); idle sessions for 8042 (x2), 8391, 8003, 7343, 8392 | Editing the same specs from here can overwrite their work or be overwritten. Fixes for a card should go through the session that owns it, one writer per card. |
| I-2 | **Playwright repo has 28 uncommitted files (+2318 / -838)** on branch `fix/login-timeout` | 7343, 8003, 8042, 8049, 8391, 8392, 8521 specs, `sCurvePage.ts`, seed scripts | New fixes would mix into work nobody has committed. Commit (or stash) the current work per card first, then fix on top. |
| I-3 | **Xray step edits change Tests that already have runs** | 9 cards have 11-31 past runs each; 8405 Tests are Closed (Ready for UAT) | Old Test Executions keep the old step copy; evidence pictures are matched by step number, so changing the step count moves pictures to the wrong step. Save the steps before each edit (`xray-steps-before-*.json`, as done for 8042) and re-run after. Closed Tests may need reopening. |
| I-4 | **Shared "not proven" list** `fixtures/pageFixtures.ts:19` is used by 101 test files | adding `ba-confirm` changes 4 files (8049 x3, 8521 `paste.helpers.ts`) | Tests that were PASSED become "skipped / not proven". Correct by rule (skipped is never PASSED) but the proven rate of 8049/8521 drops. `note` must NOT be added globally (10 files use it for plain info); change the false-pass calls one by one to `not-checked`. |
| I-5 | **Shared data / setup** | `rampDownUp.helpers.ts` is used by 7 setup specs (8042, 7343, 8392, Sprint26 plans); `sCurvePage.ts` only by 8003 | A change to the 8042 helper can break 7343 / 8392 setup. Fix the 8840 clean-up (Plan A left inactive) first: it already breaks 8844 / 8847. |
| I-6 | **Many "fixes" depend on BA, not on QA** | see list C | Changing a TC before BA answers just swaps one guess for another. Those wait. |
| I-7 | **Running tests needs a yes per card** (TEAM.md hard stop) | 8394, 8449 never run; 8392 needs a re-run on Snap A; 8521 15 failures not triaged | Script fixes are only "correct" after a run proves them. |

## A. Script-only fixes (Playwright repo, no Jira/Xray write)

| Card | Fix |
|---|---|
| 8394 | rewrite Status columns for new AC 4 (Work row only) after BA example (C); remove `.catch` at spec:813; 8746 "twenty" vs 16 rows; ETM-8768 hard-coded ids |
| 8049 | stop `ba-confirm` false pass (I-4); 8781 compare reference A; 8793 exact order check |
| 8042 | 8836 compare Start Date = 15 Feb 2026, prove "set at creation"; 8840 clean-up restores Plan A Active; step numbers aligned with Xray (8829, 8848); 8839 open Feedback Panel; `note` false passes -> `not-checked` |
| 8003 | dash check must be able to fail (`dashNote`); label needs more than 1 pixel; assert hidden labels (8808/8809); 8802 select Show All; step counts = Xray |
| 7343 | 8681 fail when "plan inactive" cannot be proven; menu check that can fail |
| 8391 | remove `.catch` at spec:367; 8663 old-filter keys; stale `partial` on 8651/8653 |
| 8388 | assert modal on empty/space cells (8721 s20-23, BA Q18); wait-for-stable on negative checks; 8721 title + OK button |
| 8521 | timed paste (needs target, C); stronger asserts 8736/8737/8743/8748/8749/8761/8762/8763; triage 15 failures |
| 8449 | `level()` must fail when a click is skipped; dependency lines counted; Work Header row finder |
| 8392 | 8688/8797 scripts for new AC 3 (DEC-062); open Snap A report, not `DAILY_REPORT_ID`; 8690/8692/8693 steps = Xray |
| 8393 | remove "tooltip not in build" fixme (ETM-8534 Done) and write the asserts; 8821 role (TM/JO only) |
| 8034 | 8872 match the colour-save request exactly; 8863/8864 real second user if one exists |
| 8405 | 8645 values (Xray 7.5/15.5 vs script 5.0/10.0, decide which is right); `skipNoSeed` must not pass; script 8643/8644/8646 |

## B. Xray Test step edits (Jira/Xray write, needs a yes)

| Card | Tests | Change |
|---|---|---|
| 8394 | 8735, 8742, 8746, 8747, 8754-8757, 8765, 8768, 8769 + new Tests | AC 4 (Work row), AC 1.3 JO frozen, AC 3.3.1-3.3.3, AC 3.4 |
| 8049 | 8785, 8791, 8793, 8788 | Deck field page (after Q26), 8788 flow the app has |
| 8391 | 8649, 8655, 8656, 8658, 8662, 8650 | start from Select All (AC 5); one rule for "nothing ticked" (Q6); 8650 s8 order |
| 8042 | 8840 | Plan S-Curve blue, not yellow (ETM-8003) |
| 8392 | 8677 | change Ramp dates in Edit Plan, not Shutdown Logic |
| 8034 | 8863 | add the actor to steps 2, 4, 5 |
| 7343 | 8681, 8678 | role that exists (JO on a not-Active plan) |
| 8405 | 8645 | Actual values = the ones decided in A |
| 8449 | 8632 / 8633 / 8635 | one answer for `+ Work Header` |

## C. Needs BA (or the user) first — send as questions, do not change TCs yet

| Card | Question |
|---|---|
| 8394 | AC 4 example: does a Breakdown Status on the Work row set every breakdown? |
| 8049 | Q26 (Deck on Edit Work Details), Q27, Q28; Y `a`->`A` not in AC 6 |
| 8042 | Q9 (S-Curve end date), Q10 (Excel on 3-year plan); 8851 user decision vs BA S1 |
| 8405 | R3-1 (blank Plan week with Actual > 0); 8640 vs AC 2.2 (user decision vs AC) |
| 8449 | 15 s / 20 s limit has no BA source; `+ Work Header` expected rows |
| 8521 | speed target (DEC-049 says none); Q5 read-only columns; S-4 no-permission user |
| 8393 | AC label "Consumption" vs "Used Resource"; 8826 Capacity inside one section |
| 8034 | AC 1.2 says 13 colours, BA says No Color + 12 |
| 8388 | AC 3.1 date formats (ETM-7902); S-5 weekly cells; S-2 line break |
| 7343 | ETM-8724 empty value cannot exist (NOT NULL): not applicable? |
| all | write each answer to `work/<KEY>/ba-answers.md` (missing on 8049, 8391, 8394, 8521) |

## Suggested order

1. Commit or stash the current Playwright work per card (I-2), agree one writer per card (I-1).
2. Send list C to BA (English .md per card).
3. A (scripts) for items that do not wait on C, card by card, `tsc` + `qa-check spec` gate.
4. B (Xray) per card after a yes, steps saved before each edit.
5. Run per card after a yes; then `qa-check strength`.

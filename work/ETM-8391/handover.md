# ETM-8391 handover (25 Nov 2026, evening)

Test Execution ETM-8874 (Test Plan ETM-8636). Xray at start of this session: 7 PASSED, 3 FAILED (8650, 8656, 8658), 6 TO DO. Nothing pushed to Xray or written to Jira in this session.

## What happened today (evening)
- A new FE build reached QA in the evening. The column filters now behave like the Excel filter: typing a search ticks the options found; `Apply` with nothing ticked is **disabled**; a selection made inside a search is dropped when the search is cleared; the search ignores letter case; during a search the row reads `(Select All Search Results)`; the button `Clear` is now `Reset`.
- Script fixes (ep-etm-fe-qa, NOT committed): `tests/fe/e2e/worklist/remarkFilter.helpers.ts` (Select All regex incl. search results, `applyEnabled`, `applyNothingTicked`, `closeWithoutApply`, Select All drawn before use, untick of a partly ticked Select All), `verifyWorklistRemarkFilter.spec.ts` (8649 / 8655 compare "nothing ticked" with the Job Description filter as Apply disabled or Total Results; 8654 waits for rows). Read-only probe: `tests/fe/explore/etm8391FilterProbe.spec.ts`.
- Runs: `2026-11-25_191825`, `192950` (full spec), `195104` (8649/8654/8655/8656), probe `195830` (search `-`).
- Defects: ETM-8896, 8897, 8898, 8902 are "Ready for UAT". ETM-10065 (search `-`) is "Deployed to QA" and is **fixed on QA**: searching `-` lists Select All, `-` (Blank), ` - `, `- `, `- a`, `--` (probe picture `ep-etm-fe-qa/output/runs/2026-11-25_195830_ETM-8391/.../probe-dash.png`). Retest comment not written yet (needs the user's yes).

## Status per test
| Test | Xray now | Latest run | Next step / blocker |
|---|---|---|---|
| ETM-8648 | TO DO | skipped (precondition) | **Blocker:** needs a QA user without View Worklist. ETM has only TM and JO; BA/user to decide "not applicable" or give a user. |
| ETM-8649 | PASSED | passed 195104 | none |
| ETM-8650 | FAILED (ETM-8896) | skipped, partial (all measured checks passed, 192950) | ETM-8896 fixed (order now correct). **Blocker:** a person confirms the hover look in the pictures, then PASSED. |
| ETM-8651 | TO DO | skipped, not-checked | **Blocker:** Create Work form has no Remark cell, so step "keep Remark empty" cannot be read; user confirms by hand or Xray step reworded (Jira write). |
| ETM-8652 | PASSED | passed | none |
| ETM-8653 | PASSED | passed | none |
| ETM-8654 | TO DO | skipped, partial (all measured passed 195104) | **Blocker:** a person confirms the hover look in the pictures. |
| ETM-8655 | PASSED | passed 195104 | Done (pushed). Passes with "Apply disabled, same as Job Description"; if the BA says B (bug) this changes. |
| ETM-8656 | FAILED | failed 195104, step 6 | ETM-10065 part fixed. New failure: step 6/7 (ticks made inside a search are dropped when the search is cleared). **Blocker:** BA answer, `questions-for-BA-8656-search-select.md` (A = reword Xray steps 6-7, B = new defect). Verdict table: `verdict-table.md`. Note: push-plan still shows the old verdict `app` (ETM-10065); keep FAILED until the BA answers. |
| ETM-8657 | TO DO | skipped, partial | **Blocker:** a person compares the two filter panels in the pictures. |
| ETM-8658 | PASSED | passed 192950 | Done (pushed). |
| ETM-8659-8662 | PASSED | passed | none |
| ETM-8663 | TO DO | skipped, partial | **Blocker:** the real pre-release saved state cannot be made; user accepts the rebuilt old address as proof (then PASSED) or marks manual. |

Push plan (`push-plan.md`): 10 PASSED + 8656 FAILED. ETM-8897 / ETM-8902 in the plan are defect retests, not Tests of ETM-8874: leave them out of the push.

## Waiting for the user (one batch question, queued with `ask --later`)
1. Xray push per `push-plan.md` (8655, 8658 to PASSED; others unchanged).
2. "Retest: Passed" comment with the picture on ETM-10065.
3. Send `questions-for-BA-8656-search-select.md` to the BA.
4. The partial tests (8650, 8651, 8654, 8657, 8663): confirm from the pictures, and 8648 not applicable?
5. Commit the script fixes in ep-etm-fe-qa.

## Update 25 Nov 23:30
- Xray ETM-8874 now: 9 PASSED, 2 FAILED (8650, 8656), 5 TO DO (8648, 8651, 8654, 8657, 8663). 8655 and 8658 were pushed from another session.
- The five not-proven tests and 8648 are in ONE question: `partial-confirm.md` (per test: what the script proved, what a person must look at, which pictures). Answer like `8650=pass 8651=pass 8654=pass 8657=pass 8663=pass 8648=na`.
- ETM-8897 and ETM-8902 removed from `run-results.json` / push plan: they are Defects, not Tests of ETM-8874. ETM-8902 manual retest (10:14) could not follow the defect flow: the edit page has no breadcrumb in this build (step 3 fail, steps 4-5 needs-human). The Defect is already "Ready for UAT"; no QA action left unless the BA says the flow still exists.
- ETM-10065 "Retest: Passed" comment: still waiting for the user's own yes in this chat (the board question was closed without an answer).
- stms-fe pulled to develop 1.26.36 (user asked, 26 Nov). The filter change is deliberate: commit 6fba9abf (ETM-10065 fix) set `excelMode: 'mac'`, `applyMiniFilterWhileTyping: false`; c6ac6044 (ETM-9231) made the search ignore case. Added to the BA question for 8656: likely answer A (reword Xray steps 6-7).
- 25 Nov 23:34: user answered "ยังก่อน" on the board to the partial-confirm question. Nothing pushed; 8650/8651/8654/8657/8663/8648 stay as they are until the user answers again.

## Update 26 Nov 09:55 - decision A applied
- QA lead decision A (Excel-mode filter by design) recorded in `ba-answers.md`. Script: 8656 steps 6-7 rewritten (Apply while the search text is there; reopen shows only the Note ticks), pickOnly unticks the auto-ticked search results, 8656 step 9 and 8655 step 16 no longer depend on Total Results (other works exist: 22).
- Runs 26 Nov: full spec `093547` (9 passed), `093308` 8656 passed (incl. steps 14-15 = ETM-10065 fixed), `095214` 8655 passed. All automated tests pass; 5 partial + 8648 unchanged (user: "ยังก่อน").
- Waiting for the user's yes in this chat: Xray rewording `xray-reword-excel-mode.md` (8656 steps 6-7, 8655 steps 3/11/16/18/21/22, 8649 step 12; backup saved), then push 8656 FAILED -> PASSED, and the "Retest: Passed" comment on ETM-10065.

## Done 26 Nov 10:05 (user yes in chat: "ได้ทำเลย")
- Xray steps reworded (9 steps): 8656 steps 6-7, 8655 steps 3/11/16/18/21/22, 8649 step 12 (`xray-reword-excel-mode.md`, backup `xray-steps-before-8649-8655-8656-2026-11-26.json`).
- ETM-8656 pushed PASSED in ETM-8874 with 15 step pictures (`xray-evidence-20261126/ETM-8656`).
- ETM-10065: a "Retest: Passed" comment (with picture, [QA] Retest ETM-10088, status Ready for UAT) was already there from 25 Nov 21:30. Added a second comment (26 Nov) with steps 14-15 and two pictures, dev mentioned.
- Xray ETM-8874 now: 10 PASSED, 1 FAILED (8650), 5 TO DO. Left: 8650/8651/8654/8657/8663 person check (partial-confirm.md, user said "ยังก่อน"), 8648 N/A question. Script fixes in ep-etm-fe-qa still not committed.

## 26 Nov 11:10 - picture check of the partial tests (lead read the pictures)
- 8650: step 13 hover shows the full Long remark; step 16 no tooltip on Note 1. Matches Xray.
- 8651: the Create Work form DOES have a Remark field (General Information, 0/500); the script looked in the Work Details grid. Fixed (textarea/input placeholder "Remark"); run 2026-11-26 8651 now **passed (proven)**. Earlier note "form has no Remark field" was wrong.
- 8654: step 6 picture does not show the hover box (only the cell); the script read the hover text = full 200 characters. Look not proven by the picture.
- 8657: Job Description and Remark panels look the same (search, Select All, checkboxes, Reset/Apply). Matches.
- 8663: step 8-9 pictures were taken from the first tab (all works). Script fixed to take them from the new tab; re-run 11:04: step 9 shows only W05 (Somchai Test) and every Remark option ticked. Matches Xray; still partial because the pre-release state is rebuilt.
- 26 Nov 11:20: user "push ได้เลย" for 8650/8651/8657/8663. Pushed **ETM-8651 PASSED** (11 pictures). push-guard refused 8650, 8657, 8663 (latest result skipped/partial: team rule "skipped is never PASSED"). Way to PASSED: manual runner (read-only) for 8650, 8657, 8663 (and 8654), the person confirms, then xray-step-push.
- Xray ETM-8874 now: 11 PASSED, 1 FAILED (8650), 4 TO DO (8648, 8654, 8657, 8663).
- 26 Nov 11:40: manual runner (read only) on 8657 (3/3), 8654 (7/7), 8650 (15/16), 8663 (8/9, after new card data with W05 owner Somchai Test). Blind checks: 8657 pass, 8654 step 3 cannot tell, 8650 six steps cannot tell. One question: `manual-confirm-2026-11-26.md`.

## Done 26 Nov 11:55 - user "ยืนยันตามนี้"
- Manual results confirmed (8650 step 3, 8654 step 3, 8663 step 1 decided pass by the user; 8657 confirmed as proposed). Pushed with pictures per step: 8650, 8654, 8657 (xray-step-push); 8663 via import (step 1 has no picture: cannot be done on this build).
- **Xray ETM-8874: 15 PASSED, 1 TO DO.** ETM-8648 stays TO DO: not applicable (QA has only TM and JO, no login without View Worklist; user answer "na").
- Card data of 11:33 is kept (`--keep-data`); the next run-card of ETM-8391 deletes it. Script fixes of 26 Nov (8651 Remark box, 8663 new-tab pictures) are not committed.

## Closeout 26 Nov 2026 (user: "ปิดงานได้เลย")
- 16 linked Tests ETM-8648..8663: Resolved -> Closed, resolution Done, assignee QA (JQL count 16/16). ETM-8648 closed as not applicable (no user without View Worklist on QA).
- Test Execution ETM-8874 -> Done. [QA] Execute Test Case ETM-8576 -> Done, worklog 2h (= its Original Estimate, logged 26 Nov 12:14). Story ETM-8391 -> Ready for UAT.
- Not touched: dev sub-tasks ETM-8553/8554/8555 (In Progress), defects ETM-8896/8897/8898/8902/10065 (Ready for UAT).

## 26 Nov 2026 - ETM-8648 removed from ETM-8874
User decision (main chat): "งั้นลบออกได้เลย". ETM-8648 (user without View Worklist) is N/A: QA has only TM and JO, both with View Worklist. Removed from Test Execution ETM-8874 (the Test card itself is kept, already Closed). Read back: ETM-8874 = 15/15 PASSED.

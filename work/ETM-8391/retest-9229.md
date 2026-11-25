# Retest plan: Defect ETM-9229 (card ETM-8391)

> **25 Nov 2026: NOT NEEDED.** The user checked with dev: clearing or changing the search text resets the column filters **by design** (code: `worklist-container.component.ts` `onSearchChange` sends only the keyword and sets Reset Table Filter disabled). ETM-9229 is not a bug. Next: close ETM-9229 as not a defect and reword Xray ETM-8658 step 4 (both need the user's yes).
>
> **Status 25 Nov 2026 (stopped here by the user):** Xray ETM-8658 step 4 reworded (backup `xray-steps-before-8658-step4-2026-11-25.json`). Spec: step 4 checks the reset (passed), step 3 is `notChecked` (manual: card data has one Job Owner). ETM-8658 is still failed: step 7 (search `W05` after the reset) shows all works; last `POST works/search` had `keyword: null`. Not known yet if it is an app bug or script timing; check by hand before any defect. Nothing committed, no Xray result pushed.

Defect: clearing the Worklist search box and pressing Enter also clears the Remark and Job Owner column filters.
Xray Test: ETM-8658 (step 4 is the step that fails). Test Execution: ETM-8874.
Latest Playwright result of ETM-8658: failed (run `2026-11-24_230517_ETM-8391`).
Start the retest only after dev moves ETM-9229 to "Ready for Retest" (or says the fix is on QA).

## Data
- QA, Turnaround Manager.
- Worklist `S26 Remark Set` (`WL_REMARK_SET_PATH` in `ep-etm-fe-qa/.env`, block ETM-8391).
  W05: Remark `Note 1`, Job Owner `Somchai Test`. W06: Remark `Note 2`.
- Nothing is saved: the test only reads (no data written).

## Steps (one full-screen picture per step, before and after)
| # | Do | Expected |
|---|---|---|
| 0 | Open the worklist. If a filter is on, click `Reset Table Filter` and clear the search box | All works listed |
| 1 | Type `W0` in `Search work number and job description`, press Enter | Only W01 to W09 |
| 2 | Remark filter: untick `Select All`, tick `Note 1`, `Note 2`, `Apply` | Only W05 and W06 |
| 3 | Job Owner filter: untick `Select All`, tick only `Somchai Test`, `Apply` | Only W05 |
| 4 | Note the page address (ends with `#wsKeyword=W0&wsJobOwners=...&wsRemarks=...`) | - |
| 5 | Delete all text in the search box, press Enter | **Only W05**, Total Results 1 (the fix) |
| 6 | Check the page address | still has `wsJobOwners` and `wsRemarks`, no `wsKeyword` |
| 7 | Check both filter icons | Remark and Job Owner still show as active |
| 8 | Optional (network): the `POST works/search` after step 5 | has `remarks` and `jobOwners` |
| 9 | Also clear the search with the clear button (x), if the box has one | Only W05 |
| 10 | Reload the page (F5) | Only W05 (filters kept from the address) |
| 11 | Clean up: `Reset Table Filter` | All works listed |

Pass: steps 5, 6, 7 (and 9, 10) match. Then run Xray ETM-8658 in full (steps 5-8 check the Remark options list).

## Run
- Script: `node tools/run-policy.mjs ETM-8391 <spec> -g "ETM-8658"` first. The test is read-only and ran before, so it should print `RUN-POLICY: auto`; if it prints `ask`, ask the user.
- Then `node tools/run-card.mjs ETM-8391 -g "ETM-8658"` (`--reporter=line`).

## After the retest
- Passed: "Retest: Passed" comment on ETM-9229 with the step pictures embedded (CLAUDE.md rule), ETM-8658 result to Xray only after the push-plan question. Check pictures are not blank.
- Still failing: comment "Retest: Failed" with the new pictures; keep ETM-9229 open.
- All Jira/Xray writes need the user's yes.

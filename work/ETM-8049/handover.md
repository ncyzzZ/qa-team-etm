# ETM-8049 handover (25 Nov 2026, Test Execution ETM-8822)

Xray at start: 6 PASSED, 5 FAILED, 10 TO DO (21 tests). **Xray at 09:40, 26 Nov: 16 PASSED, 0 FAILED, 5 TO DO (8784, 8787, 8789, 8791, 8792).** Defects: ETM-9223 Ready for UAT (retest passed), ETM-9231 Ready for UAT (retest passed), ETM-9225 In Progress, ETM-10079 Open.

## Script fixes made 25 Nov (PW_REPO, not committed)
- `verifyWorklistWorkingLocationEntry.spec.ts`: removed the stale "Q26 open" notChecked notes (BA Q26 answered 24 Nov, Xray TC-012/018/020 now say Edit Work Breakdown). TC-012 (ETM-8785) now runs both data rows of Xray (WK-1a `MAIN DECK`, WK-1b `mAiN dEcK`).
- `verifyWorklistWorkingLocationCells.spec.ts` (ETM-8781): Job Description steps 9-10 used `.check()` / `.uncheck()` (no click when already ticked), the Deck steps a real click. Xray says "Click Select All" for both, so both now use a real click. The old failure ("Deck ticked [] vs reference A visible-only") came from this mismatch.

- `verifyWorklistWorkingLocationCells.spec.ts` + `workingLocation.helpers.ts`: use `SELECT_ALL_RE` (label "(Select All Search Results)" in the evening build) and read the table without Apply when Apply is disabled.

## Per test

| Test | TC | Xray now | Latest run | Next step / blocker |
|---|---|---|---|---|
| ETM-8781 | TC-008 | **PASSED** | passed 201353 | Done 25 Nov: Xray steps 9-12 rewritten (backup `xray-steps-8781-before-2026-11-25.json`), pushed PASSED with pictures. |
| ETM-8783 | TC-010 | **PASSED** | passed 201353 | Done 25 Nov: verdict script (user), helper `onlyTick` fixed, pushed PASSED. Defect draft dropped. |
| ETM-8786 | TC-013 | **PASSED** | passed 192524 | Done 25 Nov: pushed PASSED (FAILED→PASSED, user yes). |
| ETM-8788 | TC-015 | **PASSED** | passed 221439 | Done 25 Nov: ETM-10079 fixed (Ready for UAT), pushed PASSED with pictures. |
| ETM-8793 | TC-020 | **PASSED** | passed 221439 | Done 25 Nov: ETM-9225 fixed; pushed PASSED; Retest: Passed comment with 2 pictures and @mention on ETM-9225 (comment 600679). ETM-9225 moved to Ready for UAT (user yes, 25 Nov). |
| ETM-8785 | TC-012 | **PASSED** | passed 191937 | Done 25 Nov: pushed PASSED. |
| ETM-8775 | TC-002 | **PASSED** | manual runner 2026-11-25_205139: 6/6 | Done 25 Nov: user confirmed, pushed step by step with 6 pictures (read back OK). Xray steps 5-6 reworded (backup xray-steps-8775-before-2026-11-25.json). |
| ETM-8776 | TC-003 | **PASSED** | passed 2026-11-26_093206 | Done 26 Nov: row (b) passed, row (a) N/A (user decision; reason in the Xray comment and ba-answers.md). |
| ETM-8777 | TC-004 | **PASSED** | passed 2026-11-26_092309 | Done 26 Nov: two TM sessions (user decision), JO read only on the Active Plan worklist. |
| ETM-8779 | TC-006 | **PASSED** | manual runner 2026-11-26_092607: 6/6 | Done 26 Nov: Xray steps 5-6 reworded per Q35 (backup xray-steps-8779-before-2026-11-26.json), confirmed by the user, pushed step by step with 6 pictures. |
| ETM-8784 | TC-011 | TO DO | not proven | Check by eye: a person opens the exported file in Excel (file content is checked by script). |
| ETM-8787 | TC-014 | TO DO | not run | Not runnable yet: needs a card plan with a Shutdown Logic and works WK-1a, WK-1b, WK-18g (card data has none) → card data setup (needs a yes), then manual runner. Collapse the histogram first. |
| ETM-8789 | TC-016 | TO DO | not proven | Steps 1-4 scripted and pass; steps 5-9 (Gantt paste into WK-20a..d) need a card plan with a Shutdown Logic and those works (not in card data) → setup first, then manual runner. |
| ETM-8791 | TC-018 | TO DO | not proven 191937 | Steps 1-10 pass (step 10 now proven in Edit Work Breakdown). Steps 11-14: Excel import with a 31-character Deck in two templates (ETM-1008/1106 `Next`, ETM-6843 `Confirm`): manual, or script it (importFileBuilder makes only the ETM-6843 file). |
| ETM-8792 | TC-019 | TO DO | not proven | Steps 6-7 (paste from Word and Excel) manual; the rest is scripted. |


## Open items for the user (one batch)
- Done (user "ทำทั้ง 3", 25 Nov): 8783 verdict script, Xray 8781 steps 9-12 rewritten, 8781/8783/8785/8786 pushed PASSED. The queued `--later` push question in the inbox is now out of date (already done).
- Seen but not proven (not a defect): on Plan Scratch (many options) unticking Select All left `Dock Area` + `DOCK AREA` ticked; typing in the filter search re-ticked them. Worth a hand check in Chrome if it shows up again.
- Manual by a person: 8779, 8784 (look), 8787, 8789 s5-9, 8791 s11-14, 8792 s6-7, 8775 s1.
- Lead/BA: 8776 row (a) data not reachable; 8777 second editing user does not exist.
- PW_REPO changes not committed: verifyWorklistWorkingLocationEntry.spec.ts, verifyWorklistWorkingLocationCells.spec.ts, workingLocation.helpers.ts (SELECT_ALL_RE re-export; onlyTick no longer types in the filter search). remarkFilter.helpers.ts is changed by the ETM-8391 session, not by this card.

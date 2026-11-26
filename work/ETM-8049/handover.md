# ETM-8049 handover (25 Nov 2026, Test Execution ETM-8822)

Xray at start: 6 PASSED, 5 FAILED, 10 TO DO (21 tests). **Xray at 15:20, 26 Nov: 21 PASSED, 0 FAILED, 0 TO DO.** Defects: ETM-9223 Ready for UAT (retest passed), ETM-9231 Ready for UAT (retest passed), ETM-9225 Ready for UAT (retest passed), ETM-10079 Ready for UAT. Open: BA Q36 (Shutdown Logic Gantt cell editor and free text; Deck max 30 vs 50).

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
| ETM-8784 | TC-011 | **PASSED** | manual runner 2026-11-26_125018: 5/5 | Done 26 Nov: file content read by script, step 2 opened in Excel by the user ("Opens fine"), pushed step by step with 5 pictures; the exported .xlsx is attached to step 1 (user, 26 Nov). |
| ETM-8787 | TC-014 | **PASSED** | manual runner 2026-11-26_133539: 11/11 | Done 26 Nov: Plan "QA ETM-8049 Logic" with Shutdown Logic made (user yes). Step 5 reworded ("1=tc"); Gantt cell editor makes no tag for free text -> BA Q36 (user "Pass, BA question, push"). Test run reset to the 11 current steps, pushed with 11 pictures. |
| ETM-8789 | TC-016 | **PASSED** | manual runner 2026-11-26_133539: 9/9 | Done 26 Nov: step 6 reworded to paste one value per Breakdown row ("2=tc"); pushed with 9 pictures. |
| ETM-8791 | TC-018 | **PASSED** | manual runner 2026-11-26_133539: 14/14 | Done 26 Nov: row B (ETM-1008/1106 template, `Next`) N/A ("3=na"), step 13 button `Import`; step 14 passed on the searches (user "Pass and push"); pushed with 14 pictures + step-14b/c + the import file. |
| ETM-8792 | TC-019 | **PASSED** | manual runner 2026-11-26_125018: 14/14 | Done 26 Nov: steps 6-7 by simulated paste (Word html / Excel text+CRLF), accepted by the user; works WK-19m1/m2-1304, WK-19m3-1307 made and deleted; pushed step by step with 14 pictures. |


## Open items for the user (one batch)
- Done (user "ทำทั้ง 3", 25 Nov): 8783 verdict script, Xray 8781 steps 9-12 rewritten, 8781/8783/8785/8786 pushed PASSED. The queued `--later` push question in the inbox is now out of date (already done).
- Seen but not proven (not a defect): on Plan Scratch (many options) unticking Select All left `Dock Area` + `DOCK AREA` ticked; typing in the filter search re-ticked them. Worth a hand check in Chrome if it shows up again.
- Manual by a person: 8779, 8784 (look), 8787, 8789 s5-9, 8791 s11-14, 8792 s6-7, 8775 s1.
- Lead/BA: 8776 row (a) data not reachable; 8777 second editing user does not exist.
- PW_REPO changes not committed: verifyWorklistWorkingLocationEntry.spec.ts, verifyWorklistWorkingLocationCells.spec.ts, workingLocation.helpers.ts (SELECT_ALL_RE re-export; onlyTick no longer types in the filter search). remarkFilter.helpers.ts is changed by the ETM-8391 session, not by this card.

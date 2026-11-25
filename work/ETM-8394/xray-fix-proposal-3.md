# ETM-8394: Jira/Xray changes after BA rounds 4 and 5 (2026-11-25), PROPOSAL, nothing written

## Defects to log (each needs its own yes; dev brief .md attached to each)
- **D1, from ETM-8766 (step "Upload the file", second file):** Revise on a `Work Breakdown` row with the UUID of a breakdown under a deleted Work shows "The work breakdown with the entered UUID is already associated with another work in the system." instead of "The UUID you entered is not exist in the system." (AC 3.4, BA 2026-11-25 R4-1). The row is still rejected; only the message is wrong.
- **D2, from ETM-8767 (step "Read Z2 and its breakdown"):** Import `Action = Delete` soft-deletes the Work (`sdw_is_delete = 'Y'`), but its breakdowns stay in `shutdown_activity_breakdown` with no delete flag (BA 2026-11-25 R4-2: they must be flagged deleted). Likely the cause of D1 too.
- Before logging, re-run 8766 and 8767 (card-owned data, run-policy auto) for fresh evidence. Data is UI-made through Import.

## ETM-9233
- Not a defect (BA R5-1 (c)). Close or delete it in Jira (the lead said they delete it by hand; confirm who does it).
- Xray ETM-8755: remove the defect link on step 3.

## Xray steps of ETM-8755 (backup: `xray-steps-8755-before-2026-11-25.json`)
- **Step 1** Action → "Export the Worklist. The file holds every Work of the Worklist (search and column filters are not applied)."
- **Step 3** Action → "Keep only the rows of the seven Works and their breakdowns, fill `Action = Revise` on every row, change nothing else, and upload the file as the Turnaround Manager." Expected → "No error; `Import` (`Confirm`) is enabled."
- Then push ETM-8755 PASSED from run 2026-11-25_140423 (passed, not skipped).

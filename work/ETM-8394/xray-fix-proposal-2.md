# ETM-8394: Xray/Jira changes after the BA answers of 2026-11-24 (PROPOSAL, nothing written)

BA answered R3-1 to R3-5 (`ba-answers.md`).
- R3-1, R3-2, R3-3 and R3-5 match what the Tests and the script already assume: no step changes.
- R3-4 adds one rule: a direct link to the Import page shows Access Denied.

## Xray steps
### ETM-8919 (3 → 4 steps)
- **Step 3** (`updateTestStep`, same id). Action → "Open the Import page link of the frozen Worklist directly." Expected → "The Access Denied page shows; there is no `Import` (`Confirm`) button, so no file can be imported."
- **Step 4** (`addTestStep`, new). This is the old step 3, unchanged: "Open a Worklist that is not frozen and open `Create Work` > `Import Excel`." -> "The Import Work page opens for the same Job Owner."

The script already has these 4 steps.

## Jira descriptions (remove the "Open question for BA" sentences, cite the answer)
- **ETM-8919** Trace → "ETM-8394 AC 1.3; BA 24 Nov 2026 (DEC-076 (4)): Create Work / Import Excel hidden with no message, and a direct link to the Import page shows Access Denied."
- **ETM-8920** Trace → "ETM-8394 AC 3.3.1-3.3.3; BA 24 Nov 2026 (DEC-076 (1)): case is ignored only for master data and duplicate/unique-check values (Work Header, Working Location (Deck)); Job Description and Remark are compared exactly."
- **ETM-8921** Trace → "ETM-8394 AC 4; BA 24 Nov 2026 (DEC-076 (3)): AC 4 wins, and the master data check (AC 6) runs only on the Work row."
- **ETM-8564** (the [QA] subtask) DoD: tick the line "BA round 3 still open" and change it to "BA round 3 answered 24 Nov 2026 (DEC-076)".

## Not changed (optional, not asked)
- BA says case is also ignored for duplicate/unique-check values. That would cover `Work Number`, and no Test checks it. A row could be added to ETM-8920 table 13 if you want.

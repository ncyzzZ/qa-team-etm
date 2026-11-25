# ETM-8394 Questions for BA, round 3 (after the AC update of 23 Nov 2026)

**Story:** [Improvement] Import Work and Work Breakdown - Import Work Status and Breakdown Status
**Status:** Deployed to QA. QA is rewriting the tests for the new AC 1.3, AC 3.3.1-3.3.3, AC 3.4 and AC 4.
⭐ = affects an Expected Result directly. Each question says what QA assumes until you answer.

**Update 2026-11-24:** Q1 and Q3 are already answered by the Story (AC 4, AC 3.4 with ETM-6843 AC 7.1); no need to answer them. Q2, Q4 (the direct link only) and Q5 (Work Number only) are still open. Q2 is the most important: AC 4 and AC 6 point in different directions.

1. **Breakdown Status is one value per Work (please confirm).** The new AC 4 says both status columns belong to the `Work` row. QA found the same in three places:
   - the database keeps one Breakdown Status per Work (`shutdown_work.sdw_breakdown_status`), not one per breakdown;
   - the template sheet `Examples` fills `Work Status` = `New` and `Breakdown Status` = `Breakdown Required` on the Work row only;
   - the app has one Breakdown Status for the Work.

   Example: Work `W-1` has three breakdowns. The Work row has `Breakdown Status` = `Breakdown Required`. Result: `W-1` shows `Breakdown Required`, and the values typed on the three breakdown rows are ignored.
   **QA assumes:** yes, exactly this.

2. ⭐ **AC 4 together with AC 6: an invalid value on a breakdown row.** A Turnaround Manager types `Approved` in `Work Status` and `Deleted` in `Breakdown Status` on a `Work Breakdown` row (the Work row has no status). Is this ignored with no message (AC 4), or is it the master data Error (AC 6)?
   **QA assumes:** ignored, no Error, `Confirm` enabled (AC 4: "ignored without any message").

3. ⭐ **AC 3.4: the error count when several rows are flagged.** The file has `Action = Revise` for a deleted Work and its two breakdown rows (3 rows). The banner today says "Data Validation Failed. N data validation errors were found in the file."
   **QA assumes:** N = 3 (one error per flagged row), and the error table lists the three rows, each with "The UUID you entered is not exist in the system."

4. ⭐ **AC 1.3: what a Job Owner sees on a frozen Worklist.** In the current front-end code, on a frozen Worklist the Job Owner has neither create nor import rights, so the `Create Work` button (the only way to `Import Excel`) is not shown.
   **QA assumes:** on a frozen Worklist the Job Owner does not see `Create Work` / `Import Excel`; on a Worklist that is not frozen, the same user sees them. Is there also a message, or is a direct link to the Import page blocked in another way? (ETM-916 AC 5 covers only the edit URL.)

5. ⭐ **AC 3.3.2: which values count as master data.** Case is ignored "only for values that must match master data or a duplicate check (e.g. `Working Location`, `Manpower Resource`)". QA plans to use:
   - `Work Header` (a dropdown column), lower case on the Work row: not an edit, so Work Status stays;
   - `Working Location (Deck)` (dropdown), lower case on a breakdown row: not an edit, so Breakdown Status stays;
   - `Job Description` (free text), on the Work row and on a breakdown row, with only the letter case changed: an edit, so the status triggers run.

   **QA assumes:** every dropdown column in the template is master data. `Job Description` and `Remark` are free text.
   Also: the duplicate check uses `Work Header` + `Work Number` (ETM-6843 AC 8.3.1). Is a case-only change in `Work Number` an edit, or not?

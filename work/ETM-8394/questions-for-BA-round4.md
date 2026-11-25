# ETM-8394 Questions for BA, round 4 (after the QA run of 24 Nov 2026)

**Story:** [Improvement] Import Work and Work Breakdown - Import Work Status and Breakdown Status
**Status:** Deployed to QA. 19 Tests: 13 passed, 4 failed, 2 not run (they need a frozen Worklist).
Two of the failures depend on your answer: is it an app defect, or should QA change the Test?
⭐ = affects an Expected Result directly. Each question says what QA assumes until you answer.

1. ⭐ **ETM-8766: a breakdown UUID from a deleted Work, used under another Work.**
   Setup: Work `Y1` (2 breakdowns) and Work `Y2` (1 breakdown). `Y1` is deleted through import (`Action = Delete`).
   File: `Y2` Work row with `Action = Revise`, plus one `Work Breakdown` row under `Y2` with `Action = Revise` and the UUID of a breakdown of the deleted `Y1`.
   - **The app shows:** "The work breakdown with the entered UUID is already associated with another work in the system." `Import` is disabled.
   - **The Test expects:** "The UUID you entered is not exist in the system." (AC 3.4: Revise on a breakdown under a deleted Work), because the breakdown was deleted with `Y1`.

   Which message is correct here? The row is rejected in both cases; only the message is different.
   **QA assumes:** AC 3.4 wins, because the breakdown belongs to a deleted Work, so it does not exist. If the "already associated" message is accepted, QA will change the Expected Result of ETM-8766 and not log a defect.

2. ⭐ **ETM-8767: Delete a Work and its breakdowns in one file.**
   File: `Z2` Work row with `Action = Delete` and one `Work Breakdown` row of `Z2` with `Action = Delete` (status columns filled with invalid values, which are ignored as expected). Import is accepted and confirmed.
   - **Result:** the Work `Z2` is soft deleted (`sdw_is_delete = Y`, it is gone from the Worklist). Its breakdown row is still in the database (`shutdown_activity_breakdown`) with no delete flag.
   - **The template rules say:** deleting a Work is a soft delete together with its breakdowns.

   Should the breakdowns of a deleted Work also be marked deleted, or is it enough that the parent Work is deleted (the breakdown is no longer shown because its Work is gone)?
   **QA assumes:** the breakdowns must be marked deleted too, as the template says. If yes, QA will log a defect. If not, QA will change ETM-8767 to check only that the Work is Deleted and that its breakdowns no longer show on screen.

3. **Related (no answer needed if 2 is "defect"):** with the breakdown still in the database, a later Revise with its UUID could give the "already associated with another work" message of question 1 instead of "not exist". QA thinks questions 1 and 2 may have the same cause.

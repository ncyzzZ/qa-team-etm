# ETM-8405 Questions for BA, round 2 (still open after the 17 Nov answers)

**Story:** [Improvement] Shutdown Timeline - Editable Weekly Plan (%) in Edit Plan
**Status:** In Development. These items block test cases that are not written yet.
⭐ = affects an Expected Result directly.

## Save and validation

1. ⭐ **`[ Save ]` disabled conditions.** Your draft says Save is disabled only when Total Progress → Plan (%) is not 100.0, a mandatory cell is empty, or nothing changed (isDirty = false), and that a blank weekly cell never disables Save.
   - The Data Source table still says `Weekly Plan (%)` Required = `Yes (within the activity's date range)`, which conflicts with AC 1.5 (a cleared cell stays blank).
   - Please confirm the draft answer and change the Data Source row to `No - blank is counted as 0.0`.
   - Test impact: today we only assume Save works with a blank weekly cell.

2. ⭐ **Blank Plan with Actual above zero.** A weekly Plan (%) is blank (counts as 0.0 in the sum) and that week has an Actual (%) above 0.0. What do the cumulative Red/Green Actual bars show on Main Timeline for that week: compare against 0.0, or no bar?

## Paste

3. ⭐ **Paste Validation Failed modal.** You confirmed a modal appears when an invalid value is pasted into a weekly Plan (%) cell. Please send:
   - the exact title, message text and button labels;
   - whether the modal also appears for values above 100.0 (clamped) and for more than 1 decimal (truncated), or only for negative / non-numeric values (your draft: only negative / non-numeric);
   - for a multi-cell paste with one invalid value: are the valid cells still filled, or is the whole paste rejected?

4. ⭐ **Multi-row clipboard.** ETM-8388 limits copy to one row. If the clipboard holds several rows (for example 2 rows copied from Excel) and the user pastes into a weekly Plan (%) cell, what happens?
   - Option A (your draft): only the first row is used, the other rows are dropped.
   - Option B: each row flows to the weekly Plan (%) row of the next activity in the same group.

## Date change

5. ⭐ **Calculated Plan (%) above 100.0 and then a date change.** Plan (%) is 130.0 (calculated from weekly values, AC 2.4). The user changes Start Date or End Date so that the new range has only one week. The engine would put 130.0 in that single week, which is above the weekly limit of 100.0. Which rule applies?
   - A: keep the calculated value (no clamp).
   - B: clamp Plan (%) to 100.0 before distributing (your recommendation).
   - C: clamp each week to 100.0 (the sum then differs from Plan (%)).

## Shutdown Size modal

6. **Modal body text.** The title is `Change Shutdown Size?`. The validation file still has the body text for the old title: `Are you sure you want to change the shutdown type? This action will update some data.` Is the body text also changed (for example "shutdown size")? Please send the final text and button labels.

## Design

7. **Mockup for editable and read-only weekly cells.** Still "To be provided". When will it be ready, or should QA test behaviour only (editable or not) and skip colour and cursor?

# ETM-8405 Questions for BA, round 3 (last open items)

**Story:** [Improvement] Shutdown Timeline - Editable Weekly Plan (%) in Edit Plan
**Status:** In Development. All earlier answers (17 Nov, DEC-041 to DEC-044) are used in the test cases. These 2 items are the only ones still open and have no test case yet.
⭐ = affects an Expected Result directly.

1. ⭐ **Blank weekly Plan with Actual above 0.0 (Main Timeline bars).**
   A weekly Plan (%) is blank (counted as 0.0 in the sum) and the same week has an Actual (%) above 0.0 (for example Plan blank, Actual 5.0).
   - What do the cumulative Red/Green Actual bars show on Main Timeline for that week?
   - ETM-7349 AC 3 only says "Blank Actual with no planned percentage gives no bar", which does not cover Actual above 0.0 with blank Plan.
   - Options: A) compare against cumulative Plan, where a blank week adds 0.0, so a bar is shown; B) no bar for that week.
   - Does the answer change when earlier weeks have Plan values (cumulative Plan above 0.0)?

2. **Body text of the `Change Shutdown Size?` modal.**
   The title is `Change Shutdown Size?` with buttons `Confirm` and `Cancel`. The validation file still has the body text written for the old title: `Are you sure you want to change the shutdown type? This action will update some data.`
   - Is the body text changed too (for example "shutdown size")? Please send the final body text.
   - Please also update row 16 of the Excel `Confirmation&Result` sheet (the title there is still `Change Shutdown Type?`).

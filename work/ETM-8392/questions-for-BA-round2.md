# ETM-8392 Questions for BA (round 2: open questions only)

**Story:** [Improvement] Daily Report - Ramp Down and Ramp Up Vertical Lines on Gantt Chart
**Status:** Deployed to QA.
18 test cases are written in Xray. Round 1 is answered. Only the two points below are still waiting; each one blocks test steps that have no Expected Result yet.
⭐ = affects an Expected Result directly, please answer first.

## Open questions

1. ⭐ Export PDF (AC 4): which control sets the exported timeframe (for example a date range picker, a Day filter, or the whole report), and what is the default timeframe when the user does not change it? We need this to test "line inside / outside the exported timeframe" (and a date exactly on the edge, which we assume counts as inside).
2. How does a user see that an execution day is frozen on the Daily Report page (an icon, a label, a disabled state)? AC 2 says the lines are shown "whether the day is frozen or not", so we need to pick one frozen day and one day that is not frozen.
3. Can the last execution day be extended more than once (AC 3)? If yes, after the second Extension is there still only one `Ramp Up` line, at the newest Ramp Up Date, with no line at the earlier Ramp Up positions?

## Please confirm (written by the QA team lead, not yet by you)

- A Ramp date exactly on the edge of the exported timeframe counts as inside, so its line is shown in the PDF.
- The tester reads the Ramp Down/Up Date from the Plan Card badge (`Ramp Down/Up Date: DD Mmm YYYY HH:mm - DD Mmm YYYY HH:mm`, Planning tab) before the Daily Report is created. After the Plan is edited later, the badge shows the new dates but the Daily Report lines stay on the snapshot.

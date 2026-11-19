# ETM-7343 Questions for BA: Daily Report - Actual (%) Font Color Based on Plan Progress

Test cases (15) are written from AC 1 to 5 and are already in Xray. The three questions below change the Expected Result of cases that are not written yet, so we need answers before adding them.

## Q1. Which value is compared: shown or stored?
Plan (%) and Actual (%) can be shown rounded (the PDF template shows whole numbers, the Shutdown Logic schedule shows 1 decimal).
Example: stored Actual 33.4% and stored Plan 33.0%, both shown as `33%`.
- Option A: compare the shown values -> 33 = 33 -> green.
- Option B: compare the stored values -> 33.4 > 33.0 -> green. (Reverse example: Actual 32.6 and Plan 33.0 both shown as `33%`: A gives green, B gives red.)
Which one is correct for AC 1.1 and 1.2?

## Q2. Empty or `-` value
If Plan (%) or Actual (%) has no value (empty or `-`), which font color should the Actual (%) cell show: red, green, black, or no rule?

## Q3. PDF export: background and Total row
The Daily Report export template (Activity Group Progress table) shows a green cell background when a value is 100% and no color on the Total row. AC 5 says the PDF shows the same Actual (%) font colors as the screen.
- Is the green cell background at 100% still wanted in the PDF, or only the font colors in AC 1?
- Does the Total row follow the font color rules, or stay in the default color?

## Q4 (for the team, not BA). Execution date control
Which control on the Daily Report page changes the execution date (dropdown, date picker, arrows)? A screenshot is enough. Needed to write the exact steps of the date-switching cases.

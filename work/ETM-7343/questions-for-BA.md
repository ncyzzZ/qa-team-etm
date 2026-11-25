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

## Q5 (24 Nov 2026). Job Owner on a new Event's Active Plan
On QA, the Job Owner test account opens the Daily Report of the Active Plan "QA ETM-7343 Colors" (Event "QA ETM-7343", the only Plan, Active) and gets "Access Denied: If you need access to the Application, please send a request with your details." The TA Manager opens the same page fine.
- Must a Job Owner be added to the Event (organization / member) or be the Job Owner of a work in the Plan before they can see its Active Daily Report?
- If yes, how is that done on the screen, so QA can set it up?
- If no, the Job Owner should see the table, and this is a defect.

## Q6 (25 Nov 2026). What decides which Active Plans a Job Owner can open? (ANSWERED 25 Nov: the Daily Report row of the Plan must be Active too; see ba-answers.md)
Your answer to Q5: "the Plan must be Active, then the Job Owner sees it". On QA the Job Owner test account opens the Daily Report of only 2 of 8 Active Plans we tried: "ART PSD" (FREEZE) and "PLCPP2 FSD (QA)" (OPTIMIZATION). It gets "Access Denied" on the other 6, among them "QA ETM-7343 Colors" (Event "QA ETM-7343", the only Active Plan of that Event). The TA Manager opens all of them.
In the database the Job Owner is not a member of any Event organization and is not the Job Owner of any work in any of these Plans, and the Event status, asset and platform do not separate the two groups.
- Besides the Plan being Active, what must be true for a Job Owner to open a Plan's Daily Report (access granted per Event or asset somewhere else, a role on the Event, something else)?
- How does QA set that up on the screen for the Event "QA ETM-7343"?
- If nothing else is needed, the Access Denied on the other 6 is a defect and we will log it.

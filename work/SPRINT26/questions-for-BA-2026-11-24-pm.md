# Sprint 26 – new questions for BA (24 Nov 2026, afternoon)

These come from the story updates in Jira at 14:23. Earlier answers are in `work/SPRINT26/ba-answers-all-2026-11-24.md`.

## ETM-8388 Paste into Activity Progress table

**Q1. Empty mandatory cell in a row created by paste (AC 3.1).**
On 20 Nov the BA chat said a row created by paste shows nothing when a mandatory cell is empty. ETM-8722 step 4 was written that way, and the app shows nothing.
AC 3.1, as updated on 24 Nov at 14:23, says an empty mandatory cell is shown red and gives no exception for rows created by paste. QA now follows AC 3.1 and expects red.
Please confirm: should an empty mandatory cell in a row created by paste be red?
- If yes, the app is a defect, because today it shows no red.
- If no, AC 3.1 needs an exception for rows created by paste.

**Q2. Truly empty clipboard cell pasted into a weekly cell.**
AC 1.5 names only negative and non-numeric values, which are cleared and show `Paste Validation Failed`. It does not say what happens when the clipboard cell is empty.
AC 2.2 points to ETM-7349 AC 2.4, which says "invalid input leaves the cell blank".
Today the app leaves the weekly cell blank, with no red and no modal. QA tests ETM-8716, ETM-8723 and ETM-8727 expect the same.
Please confirm this is correct.

## On hold (not to send yet)

- ETM-8034 R4-1 (Highlight Cell by right-click on Description): intended new feature, confirmed by the user; on hold.

## Answers (user, 24 Nov 2026)

- Q1: Yes. An empty mandatory cell in a row created by paste is red (AC 3.1). The app shows no red, so this is a defect candidate (ETM-8722 step 4).
- Q2: Yes. A truly empty clipboard cell leaves the weekly cell blank, with no red and no modal (ETM-8716 / 8723 / 8727 stay).

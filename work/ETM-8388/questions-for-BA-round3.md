# ETM-8388 Questions for BA (round 3, Sprint 26 test case check, 2026-11-24)

**Story:** [Improvement] Shutdown Timeline - Table Copy and Paste Support
**Status:** In Testing. Both defects (ETM-8881, ETM-8877) passed retest on QA on 24 Nov 2026.
⭐ = changes an Expected Result in a test case, please answer first.

## A. AC text to update (answers we already have, but only in chat)

1. ⭐ **AC 3.1 date formats.** AC 3.1 still says a pasted Start Date / End Date "must be a valid date in `D Mon YYYY` or `DD Mon YYYY`; otherwise it is not applied".
   We were told (20 Nov) that ETM-7902 "Flexible Date and Time Input Auto-Conversion" overrides this: day-first formats such as `03/06/2026`, `5-6-26` and `05062026` are converted to `DD Mon YYYY`, and invalid ones (`31/02/2026`, text, dot delimiter, 5 or 7 digit numbers) leave the cell blank and red, with Save disabled.
   Test ETM-8720 already follows ETM-7902. Could you update AC 3.1 (or add a Jira comment on ETM-8388) so the test case has a written source?

2. **AC 3.1 new activities created by a paste.** We were told (20 Nov) that new activities added by a paste stay quiet on their empty Start Date / End Date (not red) until the user touches a date, like `Add Activity` (ETM-7310 pattern), and Save stays disabled.
   AC 3.1 still reads as "an empty mandatory cell is red". Could you add this to AC 3.1 (or as a Jira comment)? (Test ETM-8722, step 4.)

## B. Empty clipboard cell in a weekly cell (Suggestion S-5, not covered by the AC)

3. ⭐ When the clipboard holds one empty cell (copied from an empty Excel cell) and it is pasted into a weekly cell:
   - Timeline, weekly Actual (%) (test ETM-8716, step 18)
   - Edit Plan, weekly Plan (%) (test ETM-8723, step 16)

   What the app does on QA (runs of 20 and 24 Nov 2026): the cell becomes blank and the modal `Paste Validation Failed` is **not** shown.
   For the Activity column (mandatory) the same empty cell clears the cell, makes it red and **shows** the modal (your answer Q18: spaces only = empty). Weekly cells are not mandatory, so we think blank and no modal is right. Is that correct?
   - Yes: QA changes the two "record only" steps into checks: blank, not red, no modal.
   - No: please tell us whether the modal should be shown.

## C. Line break inside an Excel cell (Suggestion S-2, not covered by the AC)

4. An Excel cell whose text has a line break (Alt+Enter in Excel, for example `Pipe` + line break + `Test`) is pasted into the Activity cell on Edit Plan (test ETM-8719, row 13).
   What the app does on QA (20 Nov 2026): the Activity shows `Pipe` and `Test` on two lines in the same cell; no new activity is created; no modal.
   Should the Activity keep the line break, or should it be replaced by a space (as Action By / Focal Point do, they are single-line)?
   Our reading: keep it. ETM-7348 AC 3.3 says the Activity cell supports line breaks (Alt+Enter) and multiline display; it is written for typing, so please confirm paste is the same.

## Note (24 Nov 2026, QA check against existing Stories)
- Q1 and Q2: the rule itself is already settled (Q1 by ETM-7902 AC 2, 4, 5; Q2 by your chat answer of 20 Nov). We only ask you to update the AC text.
- Q3: blank and not red are written (ETM-7349 AC 2.4 and AC 6, ETM-8405 AC 1.5). Only the modal is open.

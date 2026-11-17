# ETM-8388 Questions for BA (before writing test cases)

**Story:** [Improvement] Shutdown Timeline - Table Copy and Paste Support
**Status:** In Development. No comments. Mockup "To be provided".
⭐ = affects an Expected Result directly, please answer first.

## Paste Validation Failed modal (AC 1.5)

1. ⭐ What does the `Paste Validation Failed` modal show (title, message, listed cells or counts, buttons, how it closes)? Is it the same modal on Timeline and Edit Plan?
2. ⭐ Is paste partial (valid cells applied, invalid cells cleared) or all-or-nothing?
3. ⭐ Does the modal also appear when values are only truncated, clamped, cut off (future week, outside Start-End range) or ignored (extra rows on Timeline)?
4. For a date pasted in another Excel format (e.g. `2025-11-03`, `03/11/2025`): is it "not applied", cleared, and shown in the modal?

## Copy across Activity Groups (AC 1.3, 1.4)

5. ⭐ When the copied block spans two Activity Groups and is pasted into one, what happens to the rows from the second group: appended to the anchor's group (so new activities are created on Edit Plan), dropped, or the user gets a message? Same on Timeline?

## Weekly cells (AC 2.2, 3.2)

6. ⭐ When the user selects weekly cells from two rows (Plan and Actual together, or two activities), is selection blocked, copy blocked, or paste blocked? Any message?
7. Can a copied Plan (%) row be pasted into the Actual (%) row on Timeline, or an Actual (%) row into the Plan (%) row on Edit Plan? If not, is the paste ignored silently or shown in the modal?

## Status column (AC 2.1)

8. Can Status be pasted into an activity that is Close or locked? What happens with a blank clipboard cell?

## Columns outside paste (AC 3.1)

9. If a copied block spans `Plan (%)` on Edit Plan or other columns (Actual Status, Remark), is that column skipped, the cell ignored, or the paste blocked?

## Conflicting rules between cards

10. ⭐ The Story only refers to rules in ETM-7351, ETM-7348, ETM-7349 and ETM-8405. If they differ from this Story's wording, is this Story the latest? Also, the module notes record "Excel paste, keyboard-only not wanted" (ETM-7348): is that replaced by this Story?

## Keyboard navigation (ETM-8550) and other behaviour

11. ⭐ ETM-8550 "implement keyboard navigation" has no AC in this Story. Which keys are in scope (arrows, Tab, Enter, Esc, Shift+arrow, Ctrl+A, Delete), on which screens and columns, and how does it switch between Focus Mode and Edit Mode? Should it be tested under this Story?
12. Is Ctrl+Z (undo) of a paste expected? Does Delete / Backspace on a selected range clear cells with the same validation as paste?
13. Is there a maximum number of pasted rows or columns? Is large Excel data (100+ rows) in scope?

## Added by test design

14. On Timeline, when a mandatory cell is cleared by an invalid paste (red `#FFCCC7`), which button is disabled? The AC says `[ Save ]`; is it `[ Update Progress ]` on this screen?
15. On Edit Plan, when a pasted `Start Date` is later than the `End Date`, which cell is not applied (Start, End, or both)?
16. What happens when the paste anchor is a read-only cell (weekly `Plan (%)` row on Timeline, or a week outside the Start-End range on Edit Plan): paste ignored, shifted to the first editable cell, or shown in the modal?
17. On Timeline, when a pasted `Status` value has spaces around it (e.g. ` Open `), is it trimmed and accepted, or treated as invalid?
18. On Edit Plan, for the `Activity` column: is text with spaces inside a word (e.g. `Pipe  Test`, two spaces) kept as pasted? Is a value made only of spaces treated as empty (cleared, red `#FFCCC7` as a mandatory cell) or kept?
19. On Edit Plan, a pasted `Start Date` / `End Date` of `3 Jun 2026` (one-digit day): is it kept and shown as `3 Jun 2026`, or converted and shown as `03 Jun 2026`?

# ETM-8042 Questions for BA (round 2: open questions only)

**Story:** [Improvement] Planning - Individual Ramp Down & Up Date
**Status:** In Development. No comments. Description matches the BA file (synced 2026-11-15).
⭐ = affects an Expected Result directly, please answer first.
Test cases are drafted (23). Only the points below are still waiting.

## Open questions

1. ⭐ Daily Reports created before this release have no snapshot of the Plan's Ramp Down/Up Date (AC 8.2). What do they use: the Plan's current dates, the Shutdown Event's Planned Date, or are they not supported / left unchanged?
2. ⭐ Daily Report PDF (ETM-5277): is Day 1 the Ramp Down date (for example 15 Feb) or the First Execution Date after the 18:00 rule (for example 14 Feb)?
3. Exported Excel and PDF: are the Ramp Down/Up values shown as `DD Mmm YYYY HH:mm` (as on the Plan Card badge) or as date only?
4. ⭐ Create/Edit Plan: if only a Start date or only an End date is picked in the Ramp Down/Up Date range, is `[ Save ]` enabled or disabled, and what happens when it is clicked?
5. ⭐ When Ramp Up is picked earlier than Ramp Down, the picker adjusts the value by itself and shows no error. What exactly is the adjusted value (End set equal to Start, Start set equal to End, or something else), and for the same day with an earlier time?
6. Plan Card badge (AC 4): how does it look on a narrow card or with a long Plan Name (truncate, wrap)?

## Please confirm (answered by the QA team lead from the Story and Figma, not yet by you)

- Every Shutdown Event has a Planned Date, so existing Plans always get it as their Ramp Down/Up Date (AC 6).
- The Create Plan field is pre-filled with the Planned Date (AC 1.3). Figma shows only the empty state.
- `[ Save ]` is disabled until Plan Name and Ramp Down/Up Date are filled.
- No upper limit on the range length, only the format must stay `DD Mmm YYYY HH:mm`.
- The Extension moves the Plan's Ramp Up Date to the date the user chooses.
- No confirmation or warning when editing the dates, even when Shutdown Logic or Daily Reports exist.
- The Plan Card badge is always shown, with date and time.
- Only a Turnaround Manager can create or edit a Plan; other roles cannot.
- The Optimization Module receives date and time of the Plan's Ramp Down/Up.

## Suggestions (not in the Story, answer only if useful)

- S1: Can a date be typed or pasted into the picker (for example `31 Feb 2026 08:00`)?
- S2: Do other roles (for example Job Owner) still see the badge on the Plan Card?
- S3: If the Extension updates the Plan but the Daily Report snapshot update fails (or the other way round), what does the user see and what is stored?
- S4: If two users save different Ramp Down/Up values for the same Plan at the same moment, which one wins, and does the other user get a message?

## Raised during the QA run, 2026-11-20 (answered by BA through the user the same day)
7. (AC-8.2) A Daily Report created while the Plan's worklist has no work opens on the Ramp Down date itself (Ramp Down 15 Feb 2026 09:00 -> first day 15 Feb), not by the 18:00 rule (14 Feb). Is that intended? — BA: yes, correct behaviour.
8. (AC-8.2) In the same case the Daily Report Gantt shows Jan 2026 instead of the snapshot Ramp Down/Up range. Is that intended? — BA: not an issue while there is no work from the worklist.

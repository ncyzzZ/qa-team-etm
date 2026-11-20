# ETM-8388 Questions for BA (round 2, from the QA run on 2026-11-20)

**Story:** [Improvement] Shutdown Timeline - Table Copy and Paste Support
**Status:** Deployed to QA. Found in the automated run on QA, 20 Nov 2026 (spare Shutdown Event, Edit Plan screen).
⭐ = decides whether QA logs a defect, please answer first.

In the cases below, the app does something different from the AC as we read it. Please confirm which one is right: the AC (then QA logs a defect) or the app (then QA updates the test case).

## Weekly Plan (%) paste with more than one row (AC 3.2, your comment of 17 Nov, bullet a)

1. ⭐ AC 3.2 (a) says: when the pasted data has more than one row, only the first row goes into the anchor's weekly Plan (%) row, and the other rows are ignored.
   What we did on Edit Plan: put two lines on the clipboard, `10.0<TAB>20.0` and `70.0<TAB>80.0`, clicked the weekly Plan (%) cell of week 01 Jun 2026 of `Piping Inspection` (the first activity of `Maintenance Group`) and pressed Ctrl+V.
   What happened:
   - `Piping Inspection`: week 01 Jun shows `10.0` and week 08 Jun shows `20.0`. This matches the AC.
   - `Valve Overhaul` (the next activity, Start 08 Jun 2026, End 15 Jun 2026): week 08 Jun changed from `17.5` to `80.0`. `70.0` was not applied, because week 01 Jun is outside its Start-End range.
   So the second row was pasted into the next activity instead of being ignored.
   Is the AC still right, so the second row must be ignored? Or was the rule changed so that the next rows go into the next activities, like the table columns in AC 3.1?
   (Test ETM-8723, step 8 and step 9.)
   Reproduced by hand on QA the same day: copied the 2x2 block `10 20` / `70 80` from Excel, clicked `Piping Inspection` Jun W1 and pressed Cmd+V. Same result: `Valve Overhaul` Jun W2 changed from `17.5` to `80.0` (its Plan (%) became `82.5`, Total Progress `166.8`). Screenshot: `ETM-8723-manual-after-paste.png`.

   **BA answered 20 Nov 2026:** the AC is right, only the first row is pasted. Logged as defect ETM-8877.

## New activities created by a paste: empty dates red at once or not (AC 3.1)

2. AC 3.1 says: when pasted rows are more than the remaining activities, new activities are added at the bottom of the group; fields not covered by the paste stay empty. The same AC also says: an empty mandatory cell shows a red background and disables Save (ETM-7348 AC 4.2).
   What we did on Edit Plan: clicked the Activity cell of `Pump Check` (last of three in `Maintenance Group`) and pasted three rows `Task 1<TAB>Team A`, `Task 2<TAB>Team B`, `Task 3<TAB>Team C`.
   What happened: two new activities `Task 2` and `Task 3` were added. Their Start Date and End Date are empty but **not red**. Save is disabled, so the rows cannot be saved without dates.
   The app treats these rows like a row added with `Add Activity`: it stays quiet until the user picks one of its dates (the same pattern as Equipment Mob Plan, ETM-7310).
   Which is right for rows created by a paste: red at once (as AC 3.1 / ETM-7348 AC 4.2 read), or quiet until the user touches a date (as Add Activity)?
   (Test ETM-8722, step 4.)

   **BA answered 20 Nov 2026:** not red until the user touches the date (same as Add Activity). ETM-8722 step 4 updated.

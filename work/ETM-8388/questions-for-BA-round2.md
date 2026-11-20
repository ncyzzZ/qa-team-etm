# ETM-8388 Questions for BA (round 2, from the QA run on 2026-11-20)

**Story:** [Improvement] Shutdown Timeline - Table Copy and Paste Support
**Status:** Deployed to QA. Found in the automated run on QA, 20 Nov 2026 (spare Shutdown Event, Edit Plan screen).
⭐ = decides whether QA logs a defect, please answer first.

In the case below, the app does something different from the AC as we read it. Please confirm which one is right: the AC (then QA logs a defect) or the app (then QA updates the test case).

## Weekly Plan (%) paste with more than one row (AC 3.2, your comment of 17 Nov, bullet a)

1. ⭐ AC 3.2 (a) says: when the pasted data has more than one row, only the first row goes into the anchor's weekly Plan (%) row, and the other rows are ignored.
   What we did on Edit Plan: put two lines on the clipboard, `10.0<TAB>20.0` and `70.0<TAB>80.0`, clicked the weekly Plan (%) cell of week 01 Jun 2026 of `Piping Inspection` (the first activity of `Maintenance Group`) and pressed Ctrl+V.
   What happened:
   - `Piping Inspection`: week 01 Jun shows `10.0` and week 08 Jun shows `20.0`. This matches the AC.
   - `Valve Overhaul` (the next activity, Start 08 Jun 2026, End 15 Jun 2026): week 08 Jun changed from `17.5` to `80.0`. `70.0` was not applied, because week 01 Jun is outside its Start-End range.
   So the second row was pasted into the next activity instead of being ignored.
   Is the AC still right, so the second row must be ignored? Or was the rule changed so that the next rows go into the next activities, like the table columns in AC 3.1?
   (Test ETM-8723, step 8 and step 9.)


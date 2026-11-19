# ETM-8392 Questions for BA (round 1, updated)

**Story:** [Improvement] Daily Report - Ramp Down and Ramp Up Vertical Lines on Gantt Chart
**Status:** Deployed to QA. No comments.
13 test cases are written in Xray (ETM-8675 to ETM-8695). Only the points below are still waiting; each one blocks a test case that has no Expected Result yet.
⭐ = affects an Expected Result directly, please answer first.

## Open questions

1. ⭐ On screen, when a Ramp Down or Ramp Up date is outside the visible Gantt timeframe, is the line not shown, shown at the edge, or reachable by scrolling? (The PDF case is in AC 4; the screen case is not.)
2. The line is placed at a date and time. Is it drawn at the exact time inside the day column (for example 08:00 is one third into the day), or at the start of the day?
3. ⭐ Daily Reports created before ETM-8042 have no snapshot of the Ramp Down/Up Date. What does their Gantt show: no lines, lines from the Plan's current dates, or lines from the Shutdown Event's Planned Date?
4. ⭐ After an Extension (AC 3), is the old `Ramp Up` line removed so that only one remains (AC 1.3), and does the `Ramp Down` line stay where it was?
5. Does hovering a line or its badge show a tooltip, as on the Shutdown Logic lines (ETM-7897)? If yes, what does it say?
6. Export PDF (AC 4): is a line whose date is exactly on the edge of the exported timeframe "inside" the timeframe, so it is shown?
7. Where can a tester read the snapshot Ramp Down and Ramp Up Date of a Daily Report (a screen, an API, or only the values noted when the Daily Report is created)?
8. Which control sets the exported timeframe in Export PDF, and how does a tester see that an execution day is frozen?

## Please confirm (written by the QA team lead from the Story, not yet by you)

- The lines use the Daily Report snapshot only. If the Plan's Ramp Down/Up Date is changed later, the lines on an existing Daily Report do not move (except by Extension, AC 3). Test case ETM-8677 is written on this assumption.
- A user with neither View All Daily Report Item nor View Active Daily Report Item cannot open the Daily Report page, so no line is shown to them.

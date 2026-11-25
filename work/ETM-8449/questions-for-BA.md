# ETM-8449 Questions for BA - Shutdown Logic: Faster Collapse/Expand of Row Hierarchy

Story status today: Deployed to QA (2026-11-24). Tests: ETM-8629 .. ETM-8635. Raised by QA after the Sprint 26 AC audit.
Items marked ⭐ change an Expected Result; please answer them before the first run.

1. ⭐ **Speed target (AC 1.1, AC 1.2).** The Story says only "faster". Our tests ETM-8629 step 6 and ETM-8630 step 8 use: table ready in 15 s or less = Pass, 15-20 s = Pass with a note, over 20 s = Fail (plan "Shutdown Logic: New Plan 20,000 Work"). This limit came from QA, not from the Story, and there is no old build to compare with. For the sibling card ETM-8521 BA decided "no time target" (DEC-049). Which rule applies here: (a) the 15 s / 20 s limit, (b) another number, or (c) no target, only "no freeze, correct result"?
2. ⭐ **`+` box of Work Header (AC 2, Custom View states).** Starting from Platform and Work Header rows only, what does clicking the `+` box of `Work Header` show?
   (a) Platform, Work Header and Work rows (Work Breakdown stays hidden), or
   (b) every row of the plan (all levels)?
   Our TCs disagree: ETM-8632 step 5 expects (a); ETM-8633 step 5 and ETM-8635 step 7 expect (b). Please confirm the intended behaviour (same as before the change, ETM-2431).
3. **Lighter `Work Header` box (Custom View panel).** In the design the `Work Header` box looks lighter (greyed) than the `Platform` box. What does it mean: disabled, partly expanded, or only styling? Can the `Platform` box ever be disabled?
4. **Dependency lines after collapse (AC 2).** When a Work Header is collapsed and one end of a dependency line is now hidden, should the line (a) be hidden, or (b) be drawn to the collapsed Work Header row?
5. **Job Owner check (pre-condition, ETM-8631).** A Job Owner sees Active plans only. Can the 20,000 Work test plan be set to Active in QA for this test, or should the Job Owner half use another Active plan?

## Round 2 (2026-11-24, after the QA run)

6. ⭐ **`-` box of a level in the Custom View panel (AC 2, "works as before").** On QA (run 2026-11-24 13:11, plan "New Plan 20,000 Work", all rows expanded):
   - Clicking `-` of `Work Header` leaves **only Platform rows** (18 rows; Work Header rows are hidden too). With a Platform filter: 1 row.
   - After `-` of `Platform` and then `+` of `Platform`, the table shows Platform + Work Header rows, but the `Work Header` box still shows `-`.
   ETM-2431 AC 3.1 / 3.3 says `[-]` runs "Collapse All" on the rows of that level and cascades **down** only; so `-` of `Work Header` should leave **Platform + Work Header rows** (Work rows hidden), and `-` of `Platform` should also set the lower boxes to `+`.
   Which is the intended behaviour "as before": (a) ETM-2431 as written (then the app is wrong: we log a defect), or (b) the current app (`-` of a level hides that level's own rows; the box shows `-` while that level's rows are visible; then we change ETM-8632, 8633, 8635 and ETM-2431 needs an update)?

# ETM lessons (project-only part of `.claude/team/knowledge/lessons-learned.md`)

Read with the shared checklist `.claude/team/knowledge/lessons-learned.md` (designer and reviewer, every ETM Story). New ETM-only lessons go here, same format (section 10 of the shared file). L-3 of this sprint holds for every project and is in the shared file.

### Turnaround (ETM) lessons, Sprint 26 (added 24 Nov 2026 from real defects)

**L-1 Text sort with numbers (ETM-8391, draft defect).**
- What happened: Remark filter options sorted as plain text: "Note 10" before "Note 2".
- Why it slipped through: test data had only one-digit numbers.
- What to check from now on: every sorted list gets values like `x 2`, `x 10`, upper/lower case and Blank, and the order is compared with the rule in the AC.
- Project: Turnaround

**L-2 Filter choice not kept (ETM-8391, draft defect).**
- What happened: choosing Blank (`-`) in a column filter showed `null` in the page address and was lost after reload and re-open.
- What to check from now on: each special option (Blank, Select All, none) survives reload, re-open of the panel, and going to another page and back.
- Project: Turnaround

**L-4 Multi-row paste (ETM-8388, defect ETM-8877).**
- What happened: pasting several rows of weekly Plan % changed more than the AC allows (BA: first row only).
- What to check from now on: for every paste, test one cell, one row, several rows, and a paste larger than the target; check which rows changed and which did not.
- Project: Turnaround

**L-5 Collapse / expand per level (ETM-8449, defects ETM-9175, ETM-9177).**
- What happened: `-` on Work Header hid the wrong rows, and the Platform box toggled when it should not.
- What to check from now on: for each level (Platform, Work Header, Work, Breakdown) press `-` and `+`, then check which rows show and the state of every level's box; compare with the old Story (ETM-2431) for regressions.
- Project: Turnaround

**L-6 Same value, different case (ETM-8049, defect ETM-9223).**
- What happened: Import rejected `Helipad` and `helipad` as duplicates while the rule keeps case variants apart.
- What to check from now on: test case variants and spaces in every path that saves the value (Import Excel, Manual Create, Edit); the paths must agree.
- Project: Turnaround

**L-7 "Selected" state is not "hover" (ETM-8034, defect ETM-9219).**
- What happened: the colour palette framed a swatch only on hover, not the colour in use.
- What to check from now on: for a picker, check the current value is marked with the mouse away from it, after reopening, and after reload.
- Project: Turnaround

**L-8 Story text changed during the sprint (ETM-7343, defect ETM-8891).**
- What happened: the Progress Summary Total row colour rule was changed in the Story description; the build did not follow.
- What to check from now on: before a run, compare `story.md` with the Jira changelog; a changed rule gets its own check.
- Project: Turnaround

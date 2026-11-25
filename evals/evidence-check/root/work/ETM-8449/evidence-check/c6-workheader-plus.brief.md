# Evidence check c6-workheader-plus (ETM-8449, defect)

sourceHash: 7efecfb89680

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
- Page: Shutdown Logic, Gantt toolbar, Custom View panel, "Expand/Collapse by Data Level".
- URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA (stms-qa.apps.pttep.com), 24 Nov 2026. Role: Turnaround Manager.
- Data: plan "Shutdown Logic: New Plan 20,000 Work" (22,442 rows). Optional: Filter Panel Platform "CBWA" (708 rows).

## Steps
1. Open the plan. All rows are expanded and every box shows `-`. Optional: filter Platform "CBWA".
2. Custom View panel: click `-` of Work Header. Only the Platform rows stay (correct).
3. Click `+` of Work Header.

## Expected Result (as the draft states it: check it has a source)
- Expected (defect, from the user's rule F-6): every row whose level box shows `-` comes back, so all 708 rows with the filter and all 22,442 without it.


Rule source:
- Current code and ETM-2431, the "as before" reference: collapse at a level also collapses every level below it, and expand at a level expands only that level and the levels above it. Code comment in `shutdown-gantt-level-toggle.service.ts`: "Collapse at level `b` collapses every parent at `childLevel >= b`"; "Expand at level `b` expands every parent at `childLevel <= b`".
- BA, 24 Nov 2026 (F-2): `+` of Work Header "shows Platform, Work Header and Work rows. Work Breakdown stays hidden."
- User, 24 Nov 2026 (F-6): "Clicking a level's box from `-` to `+` HIDES that level's rows; `+` to `-` shows them again." Lower levels keep their own box state.
- BA, F-1: ETM-8449 is performance only, and all behaviour stays exactly as before.

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8449/evidence-check/c6-workheader-plus.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/evals/evidence-check/root/work/ETM-8449/evidence-check/c6-workheader-plus.pics/pic-2.png

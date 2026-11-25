# Defect draft
**Summary:** + of Work Header brings back only the Work Header rows
**Environment:**
- Page: Shutdown Logic, Gantt toolbar, Custom View panel, "Expand/Collapse by Data Level".
- URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA (stms-qa.apps.pttep.com), 24 Nov 2026. Role: Turnaround Manager.
- Data: plan "Shutdown Logic: New Plan 20,000 Work" (22,442 rows). Optional: Filter Panel Platform "CBWA" (708 rows).

### Step to Reproduce
1. Open the plan. All rows are expanded and every box shows `-`. Optional: filter Platform "CBWA".
2. Custom View panel: click `-` of Work Header. Only the Platform rows stay (correct).
3. Click `+` of Work Header.

### Actual Result
- Actual: only the Platform and Work Header rows come back (with CBWA: 8 of 708 rows, by level P/H/W/B 1/7/0/0). Automated runs: ETM-8633 step 5 and ETM-8635 step 5, run 2026-11-24_162751.

Pictures:
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-1506c-e-shows-only-the-right-rows-chromium/test-failed-1.png
- /Users/ncy/Downloads/NN/DocforAi/PTTEP_Auto/ep-etm-fe-qa/output/runs/2026-11-24_162751_ETM-8449/fe-e2e-shutdownLogic-verif-02613-ion-holds-on-the-large-plan-chromium/test-failed-1.png

### Expected Result
- Expected (defect, from the user's rule F-6): every row whose level box shows `-` comes back, so all 708 rows with the filter and all 22,442 without it.


Rule source:
- Current code and ETM-2431, the "as before" reference: collapse at a level also collapses every level below it, and expand at a level expands only that level and the levels above it. Code comment in `shutdown-gantt-level-toggle.service.ts`: "Collapse at level `b` collapses every parent at `childLevel >= b`"; "Expand at level `b` expands every parent at `childLevel <= b`".
- BA, 24 Nov 2026 (F-2): `+` of Work Header "shows Platform, Work Header and Work rows. Work Breakdown stays hidden."
- User, 24 Nov 2026 (F-6): "Clicking a level's box from `-` to `+` HIDES that level's rows; `+` to `-` shows them again." Lower levels keep their own box state.
- BA, F-1: ETM-8449 is performance only, and all behaviour stays exactly as before.

**Fields:**
- Labels: FE
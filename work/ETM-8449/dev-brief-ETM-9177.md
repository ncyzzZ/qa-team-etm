> **ETM-9177 deleted 25 Nov 2026: not a bug, system correct per user.** No dev action.
>
> **Not a bug, system correct per user 25 Nov 2026.** The cascade of ETM-2431 is the expected behaviour; ETM-8449 changes nothing here. BA answer F-2 is corrected. QA check on QA 25 Nov (`work/ETM-8449/manual-9177-icons/`): after `-` Work Header the Work and Work Breakdown boxes show `+`, so the icons match the rows. No dev action.

# Dev brief: ETM-9177 (Custom View: `+` of Work Header brings back only the Work Header rows)

> **HOLD: this needs a BA decision before any fix.** The behaviour is the same as before ETM-8449. The cascade code is unchanged from `88d76e46^`, and ETM-8449 is a performance-only Story ("all behaviour stays exactly as before", BA, F-1). The Expected result below follows a rule the user gave on 24 Nov 2026. That rule conflicts with the current ETM-2431 cascade design. QA is asking the BA which rule wins.

## 1) What is wrong (as reported)
After `-` and then `+` on the Work Header box, only the Platform and Work Header rows come back. The Work and Work Breakdown rows stay hidden, although nobody clicked those two levels.

## 2) Where
- Page: Shutdown Logic, Gantt toolbar, Custom View panel, "Expand/Collapse by Data Level".
- URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA (stms-qa.apps.pttep.com), 24 Nov 2026. Role: Turnaround Manager.
- Data: plan "Shutdown Logic: New Plan 20,000 Work" (22,442 rows). Optional: Filter Panel Platform "CBWA" (708 rows).

## 3) Steps to reproduce
1. Open the plan. All rows are expanded and every box shows `-`. Optional: filter Platform "CBWA".
2. Custom View panel: click `-` of Work Header. Only the Platform rows stay (correct).
3. Click `+` of Work Header.

## 4) Actual vs Expected
- Actual: only the Platform and Work Header rows come back (with CBWA: 8 of 708 rows, by level P/H/W/B 1/7/0/0). Automated runs: ETM-8633 step 5 and ETM-8635 step 5, run 2026-11-24_162751.
- Expected (defect, from the user's rule F-6): every row whose level box shows `-` comes back, so all 708 rows with the filter and all 22,442 without it.
- Not checked: the defect says the Work and Work Breakdown boxes still show `-` after step 2. Reading the code, step 2 should turn them to `+` (see 6). Please check this on QA. If the icons stay `-` while the rows are hidden, the panel and the table disagree, and that part is a bug under either rule.

## 5) Rule sources (they conflict)
- Current code and ETM-2431, the "as before" reference: collapse at a level also collapses every level below it, and expand at a level expands only that level and the levels above it. Code comment in `shutdown-gantt-level-toggle.service.ts`: "Collapse at level `b` collapses every parent at `childLevel >= b`"; "Expand at level `b` expands every parent at `childLevel <= b`".
- BA, 24 Nov 2026 (F-2): `+` of Work Header "shows Platform, Work Header and Work rows. Work Breakdown stays hidden."
- User, 24 Nov 2026 (F-6): "Clicking a level's box from `-` to `+` HIDES that level's rows; `+` to `-` shows them again." Lower levels keep their own box state.
- BA, F-1: ETM-8449 is performance only, and all behaviour stays exactly as before.

## 6) Hints for the fix (guess, from stms-fe develop source)
- Panel: `shutdown-custom-view-panel.component.ts`, `onToggleLevel(index)`. A collapse sets the buttons `i >= index` to collapsed. An expand sets only the buttons `i <= index` to expanded. The button drives `targetLevel = index - 1`.
- Tree: `shutdown-gantt-level-toggle.service.ts`, `toggleLevelAll(level, expand)` and `requestLevelToggles`. Expanding `childLevel 0` (the Work Header button) re-expands only the Platform nodes. The Work Header nodes were collapsed by the cascade, so they stay collapsed.
- If the BA picks F-6: collapse should stop cascading the lower button states. Expand at a level should restore the lower levels whose button still shows `-`. If the BA picks F-2: expand Work Header should also expand `childLevel 1`.

## 7) How QA will retest (after the BA decision)
- Xray Test ETM-8633 step 5 and ETM-8635 step 5 (Test Execution ETM-8637). Box-model checks: ETM-8632 steps 4-9.
- Pass (if F-6 wins): after `-` then `+` on Work Header, the row count is back to N0 (708 filtered / 22,442), in the same order, and every box shows `-`.
- QA will update the Xray steps to the rule the BA picks.

## 8) Out of scope / do not change
- The Platform box: it is locked, see ETM-9175.
- The manual row arrow (it does not change the panel boxes).
- The loading veil, `suspendRefresh` batching and the other performance work from ETM-8449.
- Saving: the expand state is part of the save payload, so do not change the save format.

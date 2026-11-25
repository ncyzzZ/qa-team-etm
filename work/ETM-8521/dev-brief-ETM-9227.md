# Dev brief: ETM-9227 — paste in cell edit mode goes into the editor, not the grid

Defect: ETM-9227 · Story: ETM-8521 (Faster Copy & Paste) · Base rule: ETM-2615 · Env: QA

## 1. What is wrong
On the Shutdown Logic Gantt table, when a cell is in edit mode (double-clicked) and the user presses Ctrl+V with a multi-row block on the clipboard, the block is pasted as one line of plain text into the cell editor's text box. The grid paste does not run, so the edited cell and the rows below keep their old values.

## 2. Where
- Page: Shutdown Event > Planning > Shutdown Logic > **View Shutdown Logic** (Gantt table).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- QA example: `.../events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/6b5550e3-34c1-476d-b9f2-ded3d9f3a0a5/logics/d878739c-b7e0-4df7-921e-14543e944c1f`
- Role: Turnaround Manager (has "Edit Shutdown Logic Table and Visualization").
- Data: any Work Breakdown (Lv4) row, Description column.
- **Before testing, collapse the Manpower Resource histogram** (hover the splitter `data-testid="sl-splitter-horizontal"`, click `aria-label="Hide histogram"`). It is not remembered; do it after every load.
- Seen on FE build `main-BIPLUAIT.js`, 24 Nov 2026. Browser: Chromium (Playwright), Latin keyboard layout.

## 3. Steps to reproduce
1. Open the Shutdown Logic page above as Turnaround Manager; collapse the histogram.
2. Copy two cells of one column from Excel: `Pump overhaul A` / `Pump overhaul B` (clipboard = `Pump overhaul A\nPump overhaul B`).
3. Double-click the Description cell of a Lv4 row: the cell opens in edit mode.
4. Select all text in the cell and type `abc` (stay in the cell).
5. Press Ctrl+V.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Editor | stays open, text box shows `abcPump overhaul A Pump overhaul B` | closes |
| Edited row (Description) | unchanged (old value) | `Pump overhaul A` |
| Next row (Description) | unchanged | `Pump overhaul B` |

Reproduced twice (Playwright runs 2026-11-24_211515 and 2026-11-24_212055): right after Ctrl+V, focus is on the editor `INPUT`, and the store values of both rows are unchanged.

## 5. Rule source (exact words)
- **ETM-2615 AC 1.3:** "Double-clicking a cell enables manual text editing mode; pasting an array while in edit mode will replace the existing data within the target range, including the cell currently being edited."
- **ETM-2615 AC 1.4:** "Pasting must target the focused cell as the starting anchor point (top-left) of the incoming array data."
- **ETM-8521 AC 2:** "No Functional Regression: Paste results, validation and partial-success rules, and Draft State persistence work the same as before (Aligned with ETM-7609 AC 8)."

## 6. Hints for the fix (guess, from reading stms-fe `develop` 2f6d352a; not proven)
- `shutdown-gantt-chart/paste/shutdown-gantt-paste.service.ts`, `wireCopyPasteKeyboardFallback()`: the keydown fallback returns early when the target is inside `input, textarea, [contenteditable="true"]` ("Leave focused text inputs / editors to the browser's native clipboard"). The rest of the paste goes through Bryntum `CellCopyPaste` (`beforePaste` / `paste` in the same service), which seems not to fire while the cell editor has focus. So no code path sends an edit-mode paste to the grid.
- Possible direction: when the focused input belongs to the Gantt **cell editor** and the clipboard text has more than one cell (a tab or a newline), cancel the editor (or end the edit) and run the grid paste anchored on that cell, through the existing `beforePaste` → `paste` flow, so validation, roll-up, undo and Draft State stay the same. A single-value paste inside the editor can stay native text paste (to be confirmed with BA if needed).
- Keep the Thai-layout fallback (`event.code`) working for this path too.

## 7. How QA will retest
- Xray Test **ETM-8741**, Test Execution ETM-8773, **step 3** (currently FAILED, linked to ETM-9227); step 4 after it.
- Automated: `tests/fe/e2e/shutdownLogic/verifyShutdownLogicFasterPaste.spec.ts`, test ETM-8741 (repo ep-etm-fe-qa).
- Pass when: after Ctrl+V in edit mode the editor is closed, the edited row shows `Pump overhaul A`, the next row shows `Pump overhaul B`, and the editor text never shows `abcPump overhaul A Pump overhaul B`.
- QA also re-checks (regression): paste in normal mode (cell selected, not editing; ETM-8736 / ETM-8760), one-value paste, Ctrl+Z after the paste, Save enabled with valid data.

## 8. Out of scope / do not change
- Paste in normal (non-edit) mode, validation rules, rejected-value behaviour (ETM-8521 AC 2.1: invalid mandatory field cleared + red; Manpower `[0]/[100]/[1.5]` → `[1]`), truncation, roll-up and Draft State: must work as today.
- Typing and native paste in other text boxes (filter, search, modals) stay native.
- No UI change (ETM-8521: "No UI change").
- Other open ETM-8521 items (Description 100-character limit, fill handle) are separate.

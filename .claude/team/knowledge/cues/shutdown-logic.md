# Cues: Shutdown Logic (draft 2026-11-26, not wired to a hook yet)

Sources (the handoff is kept as is in `docs/modules/sources/shutdown-logic-handoff-benz-2026-11-26.md`):
- **[H]** = "Shutdown Logic — Knowledge Handoff (QA)" by Benz, 26 Nov 2026 (section number). Rules Benz confirmed count as rules, even where they differ from the Jira card.
- **[M]** = `docs/modules/shutdown-logic.md`.
- **M-n** = AI miss (`ai-misses.jsonl`).
- **[L]** = QA lead rule in CLAUDE.md.

Each rule is short; the source holds the detail. A cue fires on a path, a word in the code / step / message, or a command.
Conflicts with older sources were ruled by the user on 2026-11-26 (chat: "C5 ใช้ของฉัน นอกนั้นตามเบนซ์"); the table at the end keeps the record.

## Layer 1: page cue (always, whenever the work touches this page)

Cue: path `shutdownLogic` / `shutdown-logic`, URL `/logics/`, words `Shutdown Logic`, `bryntum.query('gantt')`.

1. Collapse the Manpower Resource histogram after every load and reload: button `aria-label="Hide histogram"` inside `data-testid="sl-splitter-horizontal"`, shown on hover. Open it only for steps that need it [L]. This lead rule wins over "no data-testid" [H13] (C5).
2. Read and check through the Bryntum store (`window.bryntum.query('gantt')`, histogram `timelinehistogram`), not the DOM. `records` = rows that pass the filter, `allRecords` = all rows [H13].
3. Every edit is a draft until the page `Save`. Save writes back to the Worklist and takes over 30 s (`saveWithConfirm()`, 180 s timeout). On shared plans finish with `Discard Change` [H7, H13].
4. Roles TM and JO only. A button without permission is removed from the DOM (it is not disabled). JO has no Edit, Export, Optimize or Unsaved modal [H2, L].
5. Specs on the same plan run with `--workers 1`. Optimize takes about 20 min; never run two at once [H13].
6. Before writing a defect, look at the action cue "defect check".
7. Evidence: a picture for every step with a red frame (`evidence()` in `utils/xrayEvidence.ts`). Our upload tool is `tools/xray-step-push.mjs`; [H13] names `tools/xrayStepEvidence.mjs`, which is in Benz's repo, not ours (C7).

## Layer 2: action cues (only the matching block)

### edit-cell
Cue: `dblclick`, `pressSequentially`, `fill(`, Description / Remark / Deck / Start / End / Duration, a step "edit", "type".
- 1 click = select (blue background). Double-click = edit. Tab moves only while editing. Enter = save and open the same cell in the next row. Esc once = undo the value, still editing; Esc twice = leave [H3].
- Type with `pressSequentially`, never `fill()` (fill skips maxlength). Limits: Description ≤ 200, Activity Group ≤ 200, Remark ≤ 500 [H3, H13].
- Dates: many formats; shown as `DD Mmm YYYY, HH:mm`, day first, rounded to 15 min. A wrong value = blank red cell + bar does not move + `Save` disabled [H3].
- Parents (Platform, Work Header, Work) get their dates from their children and cannot be edited [H3]. The table of what each level can edit is in [H3].
- End ≤ Start: only Manual Adjust allows Duration 0.00. Resource / Custom Calendar = popup `Unable to Apply Scheduled Time` [H3].
- Duration is fitted to the working calendar: read the value shown and use it as expected (M-4).

### paste-copy
Cue: `Ctrl+V`, `Ctrl+C`, `clipboard`, "paste", "copy".
- The grid has `deselectOnClick`: before Ctrl+V check the cell is in `gantt.selectedCells` (M-8).
- A bad date in a paste = blank red cell, no popup [H8] (C1, replaces M-3's "whole paste reverted"). Still derive pasted dates from the target row's own dates, never a fixed date (M-3).
- Paste overwrites the target rows (no new rows), only into leaf rows. Collapsed column groups are not copied. Cut does not exist. A whole row = click the No. cell, then Ctrl+C / V [H8].
- Skipped cells keep their old values; a parent's Duration is recomputed (M-15, M-16).
- In automation the clipboard needs `clipboard-read/write`, otherwise test by hand [H13].
- 1 paste = 1 undo [H7].

### dependency
Cue: Predecessor, Successor, `b-sch-dependency`, `9SS`, FS / SS / FF / SF, Hard / Soft, lag.
- Typing in the cell REWRITES the whole list: lines not typed again are deleted [H4].
- Silent rejection (no popup): a duplicate line, a bad format (`9XX`), a row number that does not exist, a repeated number (the first one wins), a line to Platform [H4].
- Soft / Normal / Hard can be set only in the Setting modal tab. Dragging always makes Normal. Soft behaves like Normal on the page [H4].
- Popup messages of `Unable to Apply Dependency`: the table in [H4]. While dragging, a link to a parent / child or a loop shows only a tooltip [H4].
- Count lines with `.b-sch-dependency:not(.b-click-area)` (M-10). Store `type`: 0 SS, 1 SF, 2 FS, 3 FF [H13].
- A line is drawn only when both ends pass the filter and are not collapsed [H4].

### cascade-constraint-calendar
Cue: constraint, `Must start on`, `Start no earlier than`, Working Calendar, Resource Calendar, Manual Adjust, split, drag bar, cascade.
- A change of date pushes the tasks at the end of a line. It pulls back only along Hard lines or lines that were exactly tight [H5].
- Against a constraint or a Hard line, the whole action is cancelled: typing = popup; dragging = tooltip, then the bar jumps back, no popup [H5].
- 6 constraint types + None (only the first word has a capital). A Hard line and a constraint cannot exist together [H4, H5].
- New tasks get Resource Calendar. D/N Shift of a Work Breakdown has no effect [H5].
- Bar length ≠ Duration (it spans non-working time): compare with the row's Start / End (M-7).
- Opening the page does not check lines (tasks can overlap until someone moves them) [H5].

### manpower-histogram
Cue: Manpower, Histogram, Capacity, Shift, Organic Crew, `Add Resource`, `Delete Resource`, `View Only Used Resource`.
- Matching with Organic Crew decides Shift / Capacity (table in [H6]). A resource added in the Worklist later = Default / 1, **not a defect** [H6, H12].
- Renaming a row resets the Shift / Capacity set by hand [H6].
- Bar red = over capacity or outside the shift. Capacity cell yellow = ONE task's people > capacity. Several overlapping tasks over capacity = red bar, cell NOT yellow [H6].
- Clicking a row or bar shows only that task's people; click again = all [H6].
- Counts only Work Breakdowns that pass the filter (collapsed ones still count). `View Only Used Resource` is in Custom View (not the toolbar), default OFF [H6, H8] (C6).
- Edits here do not change Organic Crew or master data [H6].

### filter-search
Cue: Filter Panel, `app-shutdown-filter-panel`, search, Select All, "filter".
- 13 sections (Platform, Work Header, Description, Activity Group, Priority, Duration, Date, Predecessor, Successor, SIMOP, Working Location (Deck), Functional Location, Manpower Resource); open a section only with its chevron. Several filters = AND. A row shown = all its parents shown [H8] (C2).
- Clear the search, untick Select All to none, then tick the exact labels; search needs Enter (M-2).
- Close the panel (Apply) before typing in the table search (M-6). Nothing ticked = empty table (M-5). Wait for the search response before reading rows (M-9).
- No rows pass the filter = the header stays, no text [H8]. A plan with no work = `No work available to display.` on both Gantt and Histogram [H2] (C3).
- TM can save a filter. JO can use it, but it is not kept. A filter change alone enables Save [H7, H8].

### levels-view
Cue: Expand / Collapse, Custom View, level button, `aria-label`, Focus Critical Path, Focus Dropped Task.
- Find each level button by its own aria-label only (M-11). '-' hides that level and all below (M-12). Platform cannot be collapsed [H8].
- Focus filters only Work Breakdowns (parents still shown), is not saved, and is disabled without an Optimize result [H8].
- Collapse / expand does not change the histogram [M].

### save-undo
Cue: `Save`, Undo, Redo, `Unsaved Change`, `Discard Change`, Ctrl+Z.
- Undo max 10. Undo still works after Save. SIMOP, accepting an Optimize result, and reloading clear the history. Filter / custom view / focus cannot be undone. Ctrl+Z ≥ 250 ms apart [H7].
- Save toasts and failure cases: table in [H7]. Last write wins (no conflict check) [H7].
- Rule messages are modals with one OK button, not toasts [H7].

### export
Cue: Export, `.xlsx`, `.pdf`, `ant-drawer`, Daily Plan.
- Excel Overall = SAVED data, filter has no effect, disabled while there are unsaved edits. PDF = what is on screen, unsaved edits included, filter applies [H8].
- A closed drawer stays in the DOM: check `.ant-drawer.ant-drawer-open` [H13]. File names: [H8].

### worklist-effects
Cue: Worklist, Edit Breakdown, Duplicate Plan, Ramp Down/Up, Create Work.
- The page rebuilds its tree on every open: Worklist edits appear only after open / refresh [H9].
- A line whose end is not found disappears silently, and for good on the next Save [H9]. The table of Worklist action → effect is in [H9].
- Duration changed in the Worklist does not reach this page yet = next-sprint work, not a defect [H9, H12].

### sorting
Cue: sort, A-Z, order, dropdown order.
- Rule A = English dictionary, case-insensitive, numbers read as numbers (`localeCompare('en',{numeric:true})`), not Unicode: `abc` before `ABC` before `abd` [H11] (C4). Which rule applies where: the table in [H11]. Test data that splits the rules: `abc ABC Abd abd a2 a10 2a 10a _x -x ไทย` + empty, plus one run on a Thai browser [H11].

### defect check
Cue: writing a defect / `dev-brief` / `log-defect` for this page.
- Known defects (link, do not log again): DF-1..DF-4, ETM-10094, 10096, 10098, 10148, 8513 [H12].
- Not defects (never log): the list in [H12] (Worklist Duration sync, Default / 1 resource, local time zone, Esc behaviour, End ≤ Start popup, Soft = Normal).

## Conflicts: the user's ruling (2026-11-26, chat: "C5 ใช้ของฉัน นอกนั้นตามเบนซ์")

| # | Older source | Handoff (Benz) | Ruling |
|---|---|---|---|
| C1 | M-3: a bad paste date reverts the whole paste | bad date = blank red cell | Benz |
| C2 | [M] Filter Panel 9 sections (AC) | 13 sections | Benz |
| C3 | [M] histogram blank state: no text | plan with no work = `No work available to display.`; filtered to nothing = no text | Benz |
| C4 | [M] open point 4: upper case first (draft) | rule A, case-insensitive | Benz |
| C5 | [L] histogram button in `data-testid="sl-splitter-horizontal"` | "no data-testid in the system" | **QA lead (keep [L])** |
| C6 | [M] 4 Nov: Used Resource toggle not found | `View Only Used Resource` in Custom View, default OFF | Benz |
| C7 | our `tools/xray-step-push.mjs` | `tools/xrayStepEvidence.mjs` | Benz's rule (picture per step, red frame); the tool name is from Benz's repo, ours stays |

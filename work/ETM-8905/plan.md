# ETM-8905 Shutdown Logic refactor (no behavior change): QA plan draft

Story: In Testing. Subtasks: ETM-8909 [FE] Done, ETM-8934 [QA] Create TC (In Progress), ETM-8935 [QA] Execute TC (In Progress). No linked Tests, no comments.
AC 5.1: Round 1 (Gantt split) is on `develop`; Round 2 (page controller: Optimize / Undo-Redo / load-save) not merged yet. Both rounds must pass AC 4.

## AC 4 vs existing specs (ep-etm-fe-qa/tests/fe/e2e/shutdownLogic)

| AC 4 | Existing spec | Gap |
|---|---|---|
| 4.1 page loads Gantt + Histogram | every spec (page-ready), HistogramTooltip, Scrollbar | covered |
| 4.2 drag/resize bar, dependencies move | none | NEW |
| 4.3 cell edit, invalid red | DateInput (17), RowColour (25) | partly (date only; duration/manpower/deck missing) |
| 4.4 copy/paste | FasterPaste (23) | covered |
| 4.5 delete/duplicate rows | none | NEW |
| 4.6 edit modal (double-click) + save | none | NEW |
| 4.7 dependency create/edit/delete | probe/cleanupPredecessor only | NEW |
| 4.8 split bar, shift change (Gantt + Histogram) | UsedResource (45 + manual 18) partly | check |
| 4.9 Filter, Custom View, collapse/expand | CollapseExpand (13) | Filter/Custom View NEW |
| 4.10 Export PDF Overall/Daily | none | NEW (manual likely) |
| 4.11 Optimize both modes | none | NEW (Round 2, manual first) |
| 4.12 Undo/Redo | none | NEW (Round 2) |
| 4.13 Check Conflict (SIMOP) | Simop (20) | covered |
| 4.14 unsaved indicator / Save button | none explicit | NEW |
| Priority | Priority (14) | regression bonus |

## Proposed approach
1. Regression run now (Round 1): all verifyShutdownLogic*.spec.ts (~200 tests) on QA. Any diff vs. earlier green = defect candidate.
2. Small new Xray Test set for the gaps (about 10 TCs, one per AC 4 gap), manual-first; automate drag/dependency/undo later.
3. Round 2 items (4.11, 4.12, load/save) wait until dev confirms Round 2 is on QA, then re-run the full set.

Open question for dev/BA: is Round 2 deployed on QA yet, and which build is the `develop` baseline?

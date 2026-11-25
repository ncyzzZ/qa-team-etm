# Bug-check: ETM-7350 (exam, no analyst.md)

## 1. High cases: would the case fail on the most likely bug?
| Case | Most likely bug in this flow | Fails on it? | Why |
|---|---|---|---|
| TC-003 | + stays visible after mouse leaves, or shows in two cells | yes | steps 1 and 3 check it leaves |
| TC-004 | view-only user gets + or a modal | yes | steps 2-4 hover, click, double-click |
| TC-005 | wrong colour on cell | yes | step 1, value checked in script |
| TC-006 | tooltip empty for view-only user | yes | step 3 |
| TC-007 | view-only double-click opens modal | yes | step 3 |
| TC-010 | wrong default icon or swatch | yes | steps 3, 5 |
| TC-013 | 51st character accepted, counter wrong | yes | step 3 |
| TC-017 | modal keeps old typed or edited values; after Cancel, the next Add Note opens with Star and `Temp` | no | the case never re-opens Add Note after Cancel (steps 1-3 stop at reload) |
| TC-018 | after a save, the next Add Note opens with the last used icon, colour or text instead of Calendar, `#184C99`, empty | no | steps stop after the tooltip; no second Add Note is opened |
| TC-020 | edit saves but cell keeps old icon | yes | steps 3-5 |
| TC-022 | note comes back after reload | yes | step 4 |
| TC-023 | Cancel in confirmation deletes note | yes | step 3 |
| TC-025 | fail toast but the cell shows a note | yes | step 2, step 3 |
| TC-026 | fail toast but cell shows new values | yes | steps 2-3 |
| TC-027 | fail toast but note vanishes | yes | steps 1-2 |
| TC-028 | note lost after tab switch | yes | steps 3-4 |
| TC-030 | note save enables Update Progress | yes | steps 1-3 |
| TC-031 | after a note save, reverting the typed Actual (%) by hand leaves Update Progress enabled (or the note save moved the "unchanged" baseline) | no | step 2 only checks "stays enabled"; the typed value is never put back by hand before Update Progress |
| TC-033 | note outside grid stays, or in-grid note deleted | yes | step 3 checks both notes |
| TC-034 | edge note deleted though week is inside | yes | step 2 |
| TC-039 | note shows in Shutdown Logic | yes | steps 3-4 |
| TC-040 | duplicate note on double click | yes | step 2-3 |

## 2. Unsaved changes and leaving
| Action or state | Item | Covered by |
|---|---|---|
| Typed Actual (%) pending, note saved | undo by hand, then Update Progress button disabled again | MISSING |
| Note saved, no pending progress | leave by breadcrumb and browser Back (User A) | TC-032 steps 2-3 |
| Note saved | leave as the role that cannot save (User B) after viewing notes: no alert | MISSING |
| Note saved | reload | TC-028 step 2 |
| Note saved | in-app tab Planning and back, event list and back | TC-028 steps 3-4 |
| Note saved, Edit Plan | open Edit Plan and return without saving (Cancel / Back): notes unchanged, row shown again | MISSING (TC-033 saves; no cancel route) |
| Add/Edit Note modal open with typed text | leave by reload, breadcrumb or Back: no unsaved alert, no note saved | MISSING |
| Pending progress change, then a note saved | leaving still shows the unsaved alert for the progress (the note must not clear it) | MISSING (TC-031 step 3 reloads only) |
| Related screens | Shutdown Logic, Equipment Mob Plan ignore notes | TC-039 |

## 3. Assumed Open questions
| Open question | Step that checks it |
|---|---|
| 2: note allowed in every visible week incl. past weeks | MISSING (TC-019 uses first and last week only) |
| 3: one note per week, + not shown on a filled cell | MISSING (TC-040 checks double click only; no step hovers a filled cell) |
| 4: spaces only behaves as empty | TC-015 table rows 4-5 |
| 5: Esc | TC-042 step 3 |
| 6: modal stays open on save failure | TC-025 step 2 |
| 8: confirmation Cancel keeps Edit Note open | TC-023 step 2 |

## 4. Grid and input habits
| Habit | Covered by |
|---|---|
| Numbers format | not applicable (no number field) |
| Lists and dropdowns, last rows | not applicable (no list; icon and colour pickers are fixed) |
| Date pickers | not applicable (no date field) |
| Paste in the middle or at the end of existing Note text, paste over a selection, with the 50 limit | MISSING (TC-014 pastes into an empty input only) |
| Two panels, frozen columns: horizontal scroll keeps Key Milestones cells aligned with week headers, + and tooltip work after scrolling and on the last week (not cut off) | MISSING |
| Someone else deletes or changes the note while it is open | TC-041 step 3 |

Open: 12

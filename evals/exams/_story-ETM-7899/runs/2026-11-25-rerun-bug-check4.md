# Bug-check ETM-7899 (exam)

## 1. High cases: would the case fail on the most likely bug?
| Case | Most likely bug | Fails on it? | Why |
|---|---|---|---|
| TC-001 | Wrong section order | yes | Step 2 lists the exact order |
| TC-003 | Dot stays after re-check, or toolbar dot clears while another section is filtered | yes | Steps 4 and 6 check disappearance; the two-section mix is in TC-004 |
| TC-005 | Plan list shows Master Data values not in the plan | yes | Compares with plan data (manual) |
| TC-007 | List in row order, not Master Data order | yes | Checks the sequence |
| TC-008 | Work Header list in row-appearance order | yes | Explicitly canonical vs row order |
| TC-009 | Select All uncheck leaves some options checked | yes | Checks all/none |
| TC-011 | Select only search results touches hidden options | yes | Step 4 checks non-matching stay checked |
| TC-012 | Hidden options reset on clearing search | yes | Dedicated case |
| TC-017 | Platform hides only its own row, descendants stay; or hiding the Platform removes its Work Headers from the Work Header list | partly: first yes, second no | Steps 2 and 3 never open the Work Header list (Open question 1 assumed) |
| TC-018 | Same-named Work Header under other Platforms handled wrongly | no | Step 3 only records, Open question 2 has no answer |
| TC-019 | Platform row stays with zero children | yes | Step checks parent hidden |
| TC-020 | Empty table shows a message | yes | Checks header and no message |
| TC-022 | OR instead of AND | yes | Table with a combination that gives empty |
| TC-025 | Histogram keeps hidden tasks | yes | Compared by hand |
| TC-027 | New value added at the end of the list, or unchecked while others are unchecked | partly | Step 3 runs with no filter active; "new value checked while another option is unchecked" is not run (Open question 6) |
| TC-028 | Obsolete value stays | yes | Steps 3 and 4 |
| TC-029 | Reset leaves one thing behind (for example Select All uncheck state, or a Save-enabled state) | partly | Never checks the Save button after Reset, nor Reset after only Select All was unchecked |
| TC-030 | Saved filter not restored; or Save enabled/disabled wrongly | partly | Step 2 only "no error"; never checks the Save button state before any change and after undoing a change |
| TC-031 | JO state leaks to TM; JO filter kept after leaving by another route | partly | Only reload is used; no Back, breadcrumb or tab route |
| TC-033 | View-only user cannot use filters | yes | Manual, checks use |

## 2. Unsaved changes and leaving
| Action or state | Item | Covered by or MISSING |
|---|---|---|
| TM unchecks an option then checks it again by hand | page back to "not changed", Save disabled again | MISSING (TC-003/004 check dots only, never the Save button) |
| TM changes a filter then presses Reset | Save/changed state afterwards | MISSING |
| TM changes a filter, leaves the page | warning only when there is something to save | MISSING (TC-036 step 3 "record" only, with no warning check) |
| JO changes a filter, leaves the page | JO never gets a leave warning | MISSING |
| TM, filter changed: reload | state lost / kept | MISSING (TC-036 title says reload, no reload step; Open question 5 assumed) |
| JO: reload | state lost | TC-031 step 3 |
| TM/JO: browser Back | filter state | MISSING |
| TM/JO: breadcrumb | filter state | MISSING |
| TM/JO: in-app link or tab and return | filter state | TC-036 step 3 only ("another page", not named, result "record") |
| Open a task detail or edit page and return | filter state and dynamic option sync | MISSING |
| Saved filter on plan A, open plan B or another Shutdown Logic page | filter must not carry over | MISSING |
| View-only action (open/close the panel, expand/collapse a section) must not mark page changed | Save stays disabled | MISSING (TC-036 steps 1-2 close and open the panel but do not check Save) |

## 3. Assumed Open questions
| Open question | Step that checks it |
|---|---|
| 1 Work Header list stays complete when a Platform is unchecked | MISSING |
| 3 Unchecking Select All (zero options) shows the dot | MISSING (TC-003 unchecks one option only) |
| 4 Toolbar dot for Platform/Work Header only | TC-003 step 3 |
| 5 TM unsaved filter lost on reload; JO lost on reload | JO: TC-031 step 3. TM: MISSING (TC-036 has no reload step) |
| 6 New value appears checked while others are unchecked | MISSING (TC-027 runs with no filter) |
| 8 Search is case-insensitive "contains" | MISSING (TC-011 types matching text, no upper/lower or middle-of-name case) |

## 4. Grid and input habits
| Habit | Covered by or reason |
|---|---|
| Numbers | not applicable: no number input (names only), though TC-008 covers numbers in names |
| Lists and dropdowns: typing filters the list; list at the bottom rows or after scrolling | typing: TC-011. Long list scroll (option list taller than the panel, last options clickable): MISSING |
| Date pickers | not applicable: no date field in these sections |
| Editing inside a cell: paste in the search box (middle/end, replaces selected text) | MISSING (TC-016 only strange text typed) |
| Two panels or frozen columns: rows stay aligned between the table and the chart after filtering, scrolling and expanding | MISSING (TC-017/019 check rows only in the table; TC-024 arrows manual) |
| Someone else changes or deletes the object while it is open | TC-035 (Manual) |

Open: 25

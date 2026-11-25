# Bug check (checks 10, 11, 12) for ETM-8391 draft-tc.md

## Table 1 - High cases: would it fail on the likely bug?

| Case | Most likely bug | Fails on it? | Why |
|---|---|---|---|
| TC-001 | Old Contains/Blank/Not blank still shown beside the list | yes | Step 3: "None of them appears; no text input" |
| TC-003 | Case/space variants merged into one option | yes | Step 2: "Four separate options exist"; steps 3-4 select each |
| TC-005 | `-` sorted among others, or above Select All | yes | Step 2: "order is Select All, then -"; step 3 |
| TC-006 | `-` always shown | yes | Step 2: "There is no `-` option" |
| TC-007 | `- `, ` - `, `--` trimmed into `-` / counted Blank | yes | Step 2 "exactly the works marked Blank"; step 3 "own option, not trimmed" |
| TC-008 | Three `-` options (empty, spaces, literal) | yes | Step 2: "Exactly one `-` option"; step 3 all three shown |
| TC-009 | Plain string sort (`Note 10` before `Note 2`) | yes | Step 2: "`Note 1`, `Note 2`, `Note 10`" |
| TC-012 | No ellipsis, no tooltip, or tooltip on short text | yes | Steps 2-4 |
| TC-015 | Selecting one option still shows all rows | yes | Step 2: only `Note 2`, Total Results equals count |
| TC-016 | `-` shows only empty works, not spaces/literal `-`; or shows `--` | yes | Step 2 reads each shown cell |
| TC-018 | No-permission user or JO gets the filter data / cannot open it | yes | Steps 1-2. |
| TC-020 | Old URL param applied, or old saved (stored) text filter not cleared | no | Only the URL address is tested (Precondition, step 1). Story AC-11 also says the old saved text filter is cleared; a stored saved filter (subtask ETM-8553 "Save Filter") is never set up, so a bug there passes. |
| TC-021 | Clearing old Remark param also clears other columns' filters | yes | Step 2: Work Status "still ticked and the table follows it" |
| TC-022 | Options shrink after other filter; Reset leaves Remark filter on | yes | Step 3 "still holds every option"; step 5 "back at Select All" |
| TC-023 | `-` choice lost on reload or stored as `null` | yes | Step 1 address not `null`; step 2 reload; step 4 Back |

"no" rows in Table 1: 1

## Table 2 - Check 11: states that must survive/reset x routes

Dirty state (Save/Update, unsaved warning): not applicable, the filter has no Save button and the Story gives none (stated reason).

| State x route | Covered by / MISSING |
|---|---|
| `-` selected x reload | TC-023 step 2 |
| `-` selected x browser Back (after another plan page) | TC-023 step 4 |
| `-` selected x in-app link to another plan page | TC-023 step 4 |
| `-` selected x breadcrumb and return | MISSING |
| `-` selected x open a work's edit page and come back | MISSING |
| one text option (e.g. `Test`) x reload | MISSING (TC-022 step 1 sets it, never reloads) |
| one text option x browser Back | MISSING |
| one text option x breadcrumb / in-app tab / edit page and back | MISSING |
| several options (`-` + `Test`) x reload / Back | MISSING (TC-017 does not leave) |
| nothing ticked x reload / Back | MISSING (TC-024 does not leave) |
| Remark filter + another column filter x reload | MISSING (TC-021 loads from URL only) |
| Remark on, then change quick search | TC-022 step 2 |
| Remark on, then clear the quick search | MISSING |
| quick search on, then change/clear the Remark filter | MISSING |
| Remark on + other filter + sort | TC-022 step 4 |
| Remark on, then Reset Table Filter | TC-022 step 5 |
| search text typed in the panel x close and reopen the panel | MISSING (TC-025 step 4 only clears it) |
| Remark of a work edited (edit page) then return: options updated | MISSING (TC-026 uses reload by another user only) |

MISSING rows in Table 2: 12

## Table 3 - Check 12: assumed Open questions

| Open question | Case step that checks it |
|---|---|
| Q3 tooltip threshold (assumed: 200 characters vs short text) | TC-012 steps 3-4 |
| Q4 (TC-026 assumes reload is needed to see changed options) | MISSING: TC-026 only checks after reload; no step proves the open page does not update before reload |
| Q7 (assumed: searching `-` also lists `--`, `- `) | MISSING: TC-025 step 2 only expects `-` to be listed; `--` and `- ` are not checked |

MISSING rows in Table 3: 2

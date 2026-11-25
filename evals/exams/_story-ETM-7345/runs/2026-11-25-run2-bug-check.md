# Bug check ETM-7345 (checks 10, 11, 12 only)

Note: draft header says "High 15", but 23 cases are marked High (TC-004, 006, 007, 009, 010, 011, 012, 013, 016, 017, 019, 020, 022, 023, 024, 026, 027, 029, 033, 034, 036, 037, 039). All 23 are checked.

## Table 1 - check 10, would the case fail on the most likely bug

| Case | Most likely bug | Fails on it? | Why |
|---|---|---|---|
| TC-004 | Dates shift one day in a non-UTC+7 browser | yes | Step 2 expects `01 Dec 2026`, not 30 Nov. |
| TC-006 | Minor badge keeps old colours or wrong text | yes | Step 4 and the table give exact hex values. |
| TC-007 | Badge opens a dropdown on click | yes | Step 1 "no dropdown or modal shows". |
| TC-009 | Wrong date format or tooltip text | yes | Step 1 and 3 give exact text. |
| TC-010 | Plan recalculated when the event dates change | yes | Step 4 compares the six dates with step 1. |
| TC-011 | Edit Plan opens the wrong page or leaves the page dirty | yes | Step 2 page name, step 3 "no `Unsaved Change` modal". |
| TC-012 | Button stays enabled after a successful save | yes | Step 4 "disabled again". |
| TC-013 | Limit is off by one (>= 100.0 disables) | yes | Step 1 `100.0` enabled, step 3 `100.1` disabled. |
| TC-016 | TM is missing a control | yes | Step 1-4 check each control. |
| TC-017 | JO can still edit Status, Actual or notes | yes | Step 3-5 "disabled". |
| TC-019 | Tab hidden but direct URL or API still works | yes | Step 2 and 3. |
| TC-020 | Wrong column order, width or alignment | yes | Step 1-4 and table. |
| TC-022 | Status or Progress wrong width or alignment | yes | Step 1-5 give px values. |
| TC-023 | Week column can be resized | yes | Step 3 "width stays 50px". |
| TC-024 | Status or Progress min width not enforced | yes | Table lists min for each column. |
| TC-026 | Status and weeks do not move with the splitter | yes | Step 3 "moved right by the same distance". |
| TC-027 | Columns hidden in the wrong order | yes | Step 1-3 give the order, step 6 reverse order. |
| TC-029 | Left and Right buttons hide the wrong section | yes | Step 1 and 3 name the hidden section. |
| TC-033 | Groups collapsed at load or plan empty | yes | Step 2 "all chevrons `v`". |
| TC-034 | Collapse then expand by hand leaves the page "changed" (undo by hand does not clear dirty) | no | Step 4 says the button "is still enabled (it does not go back to disabled)". That is the buggy behaviour the case calls expected. It sets the risky state (collapse, expand back) but it never checks the Update Progress button as clean after undo, and the Story is silent, so it should be an open question. |
| TC-036 | Collapse state kept in the browser (localStorage) or per user, not in the database | no | Steps 3-4 reload in the same browser and pass on a local-only bug. Step 5 (other TM, other login) only says "Note the state shown (record ...)", with no expected value, and is done by a person. |
| TC-037 | Warning only on the tab route; browser Back, breadcrumb or reload keeps or loses the state, or gives no warning | no | Step 3 leaves by one route only (tab `Planning`). The case passes if breadcrumb or browser Back skips the modal. Step 2 refresh does not check the browser leave prompt either. |
| TC-039 | Stale session B shows the `Plan has Been Changed` conflict modal (Story: no conflict dialogs) | no | Step 2 accepts "(or the modal `Plan has Been Changed` ... record which)", so the bug passes. |

"no" rows in table 1: 4 (TC-034, TC-036, TC-037, TC-039).

## Table 2 - check 11, unsaved changes and leaving

Actions that the Story says mark the page changed or must survive / reset:
A = collapse / expand an Activity Group on Timeline (isDirty, Update Progress); B = collapse / expand on Edit Plan (Save); C = splitter position and column widths (volatile, reset on refresh, must never count as a change); D = Update Progress commit.

| # | Action x item | Covered by | 
|---|---|---|
| 1 | A x undo by hand (collapse then expand) then the button | MISSING (TC-034 s4 asserts "still enabled", opposite of the checklist) |
| 2 | A x leave as TM, in-app tab | TC-037 s3-5 |
| 3 | A x leave as JO (role that cannot save), any route; no warning | MISSING (TC-018 s3-4 only refreshes, never leaves) |
| 4 | A x reload | TC-037 s2 (TM), TC-018 s4 (JO) |
| 5 | A x browser Back | MISSING |
| 6 | A x breadcrumb | MISSING |
| 7 | A x `Edit Plan` button with an unsaved collapse, then Back | MISSING (TC-011 s3 has no change) |
| 8a | A x related screens that must ignore it (Worklist, Shutdown Logic, Mob Plan) | TC-041 s2-4 |
| 8b | A x Edit Plan after a saved or unsaved collapse (open state) | MISSING |
| 9 | B x undo by hand then `Save` | MISSING |
| 10 | B x leave by `Back` | TC-035 s4 |
| 11 | B x leave by tab, breadcrumb, browser Back, reload | MISSING |
| 12 | B x role that cannot save | n/a (JO has no Edit Plan), not stated in draft |
| 13 | C x splitter drag / column resize must not enable Update Progress or show `Unsaved Change` when leaving | MISSING (TC-026, TC-031 never look at the button or modal) |
| 14 | C x reload | TC-031 s3 |
| 15 | C x in-app tab | TC-031 s2 |
| 16 | C x browser Back and breadcrumb | MISSING |
| 17 | C x Edit Plan and back (widths, splitter, related screen) | MISSING (TC-025 only checks it exists) |
| 18 | D x leave after a successful save: no modal | MISSING (TC-036 s3 opens another tab but asserts no modal) |

MISSING rows in table 2: 12 (rows 1, 3, 5, 6, 7, 8b, 9, 11, 13, 16, 17, 18).

## Table 3 - check 12, assumed answers

| Open question | Case step that checks it |
|---|---|
| Q4 Update Progress returns to disabled after success (assumed yes) | TC-012 s4 |
| Q8 UTC+7 proved by the subtitle dates (assumed) | TC-004 s2 |
| Q9 `<` from the middle goes to the far-left edge (assumed yes) | TC-029 s1 |
| Q10 JO group toggle shows no "unsaved" warning on leaving (assumed no) | MISSING (TC-018 has no leave step) |

MISSING rows in table 3: 1 (Q10).

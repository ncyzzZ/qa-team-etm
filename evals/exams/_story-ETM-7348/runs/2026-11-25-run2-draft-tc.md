# Draft test cases ETM-7348 Shutdown Timeline - Edit Plan Screen & Task Planning Specifications

Story: ETM-7348 (frozen copy, description before 2026-11-11, comments of 5 Nov and 9 Nov)
Source: story.md (no analyst.md; AC ids below are the Story numbers, e.g. AC-2.1 = Acceptance Criteria 2, item 1), docs/modules/shutdown-timeline.md, shutdown-timeline-validation.md, knowledge/.
Existing [QA] subtasks: not read (out of scope for this exam).
Common precondition: Environment QA. User is logged in as a Turnaround Manager (TM) with View Timeline and Edit Plan permissions. A spare Shutdown Event with a seeded Timeline plan (5 Activity Groups, 23 activities, Total Plan `100.0`) exists and may be changed and restored. The user is on the Timeline tab. Edit Plan opens from the `Edit Plan` button.
Notation: `text` = exact on-screen text. TM = Turnaround Manager, JO = Job Owner (view only). "Draft" = the unsaved working copy on the Edit Plan screen.
Priority source: the Story has no priority, so priority is set by damage if it breaks.

## Think like the user
- Who: the Turnaround Manager prepares the baseline plan of a shutdown a few times per event, usually before it starts; later edits happen while the job owners already enter progress.
- Wants: fix names, dates and percentages, add or remove groups, change order, press Save once and see the Timeline updated.
- Tired or careless person: types a long name, leaves a date empty, makes the total 99.9, deletes a group by a slip (no confirmation), presses Back with changes, keeps the page open while a colleague updates progress on the Timeline, double-clicks Save.

## Coverage map
| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1.1 open Edit Plan, scroll at left edge | State, leaving and coming back | Grid opens scrolled to the middle or keeps old scroll | TC-003, TC-004 |
| AC-1.2 heading, subtitle, (i) tooltip | Page display | Wrong text, size or date format | TC-003 |
| AC-1.2 Add Activity Group modal (title, placeholder, counter, Cancel, Save) | Input groups, state | Wrong modal content, group not appended | TC-007, TC-008 |
| AC-1.2 Add group name boundaries (empty, spaces only, 100, 101) | Edge values | Empty or oversized name saved | TC-009 (NEG), TC-010 (BND) |
| AC-1.2 Shutdown Size dropdown and criteria (i) | Page display | Control missing or opens nothing (behaviour belongs to ETM-7984) | TC-005 |
| AC-1.3 Back without changes / with changes, dialog texts, Continue Editing, Discard Change | Unsaved changes | Data loss, wrong dialog, dialog for no reason | TC-040, TC-041, TC-042 |
| AC-1.3 Save disabled with no changes, enabled after a change | Unsaved changes | Save active with nothing to save | TC-043 |
| AC-1.3 / 6.1 side menu leave with changes | Leaving and coming back | Silent loss of changes | TC-041 |
| AC-2.1 groups always expanded on entry, collapse not persisted | Leaving and coming back | Old collapse state restored | TC-011, TC-012 |
| AC-2.1 group drag reorder (group with children) | State changes | Children left behind, order lost after Save | TC-017 |
| AC-2.1 Add Activity (default row 0.0 / Open) | Page display, state | Wrong defaults, row in wrong place | TC-013 |
| AC-2.1 Edit Activity Group modal, counter, Cancel, 100 chars | Edge values | Name not updated or wrong counter | TC-014, TC-015 |
| AC-2.1 Delete Activity Group without confirm, with children | State, error guessing | Wrong rows deleted, total not updated | TC-016 |
| AC-2.2 activity drag only inside same group | State changes, negative | Activity dropped into another group | TC-018, TC-019 |
| AC-2.2 trash icon always visible, deletes at once | Page display | Icon only on hover, wrong row deleted | TC-020 |
| AC-2.3 / 8.2 empty group placeholder | Screen state (empty) | Placeholder missing after last activity removed | TC-021 |
| AC-3.1 / 7 limits Activity 500, Action By 50, Focal Point 50 | Edge values | Over-length saved or truncated silently | TC-022, TC-023 |
| AC-3.1 / 4.1 Activity mandatory, empty cell | Input groups | Empty activity saved | TC-026 |
| AC-3.2 Status and Actual (%) read-only; weekly cells read-only | Page display, negative | Editable fields that must not change | TC-024 |
| AC-3.3 multiline with Alt+Enter / Option+Enter; others single-line | Strange input | Line break lost or enters single-line field | TC-025 |
| AC-4.1 red asterisks only on Activity, Start Date, End Date, Plan (%) | Page display | Wrong columns marked | TC-027 |
| AC-4.2 empty mandatory cell red `#FFCCC7` and Save disabled; Minor SD optional dates | Decision table | Save enabled with empty mandatory data | TC-026, TC-028 |
| AC-4.3 date picker disables invalid dates (Start after End, End before Start) | Edge values | Start later than End saved | TC-029, TC-030 |
| AC-4.4 Total Plan != 100.0 red and Save disabled, matrix of totals | Condition table, edge values | Wrong total saved, plan integrity lost | TC-031, TC-032, TC-033 |
| AC-4.4 / 8.1 first-time state with template total != 100 | Screen state | Error not shown on entry | TC-034 (Manual) |
| AC-3.1 / 7 Plan (%) range, 1 decimal, above 100.0, negative, text | Edge values, strange input | Wrong format or out-of-range value | TC-035, TC-036 |
| AC-4.5 over-plan yellow warning, Save stays enabled | State | Warning blocks Save or wrong colour | TC-037 |
| AC-5.1 weekly progress bars hidden | Page display | Bars still drawn | TC-006 |
| AC-5.2 Key Milestones row hidden | Page display | Row still shown | TC-006 |
| AC-5.3 Ramp Down / Ramp Up lines, badges, tooltip, stacking | Page display | Lines missing | TC-038 |
| AC-6.1 Save persists, toast, return to Timeline, isDirty reset, order persisted, collapse not persisted | State, leaving and coming back | Data not saved, wrong toast | TC-044, TC-045, TC-046 |
| AC-6.1 Save failure toast | Error guessing | No feedback on failure | TC-047 (Manual) |
| AC-6.1 double click on Save | Error guessing | Two saves, duplicate rows | TC-048 |
| AC-6.2 two TMs Save, last write wins | Two people at once | Mixed or lost data | TC-049 |
| AC-6.3 key mapping: Timeline edits kept after Save from Edit Plan | Two people at once, linked data | Status and Actual lost, matched by row index | TC-050 |
| AC-6.3 activity deleted in Edit Plan removed with Status and Actual | Linked data | Actual stays in totals | TC-051 |
| AC-6.3 conflict modal and OK reload | Two people at once | Wrong title, no reload, silent overwrite | TC-052 |
| AC-7 default group name `New Activity Group`, defaults 0.0 | Page display | Default conflicts with empty Add modal | Open question Q3 |
| AC-8.1 first-time state seeded from template | Screen state | Wrong seed | TC-001 (seed total), TC-034 |
| AC-8.3 all groups removed: placeholder, Save disabled | Screen state (empty) | Save active with 0.0 total | TC-021, TC-033 |
| AC-9.1 TM with Edit Plan can open and edit | Roles | Main flow blocked | TC-001, TC-002 |
| AC-9.2 no Edit Plan right: no button, direct URL blocked | Roles, negative | Permission leak | TC-002 (NEG) |
| AC-10.1 Worklist and Shutdown Logic not changed by Save | Linked data | Cross-module damage | TC-053 |
| Screen state: very many rows / very long names | Screen state | Layout break, no scroll | TC-054 |
| Screen state: loading / slow network | Screen state | Double Save, blank screen | TC-048 |

Categories of lessons-learned.md:
1 Two people at once: relevant (TC-049, TC-050, TC-052).
2 Filter + Sort + Search: not relevant, Edit Plan has no filter, sort or search.
3 Old data after migrations: not relevant, no migration in this Story (seed template covered by TC-001, TC-034).
4 Strange input: relevant (TC-009, TC-010, TC-022, TC-025, TC-036).
5 Reordering changes calculations: relevant (TC-017, TC-018, TC-045: totals must stay the same after reorder).
6 Linked data (add, edit, delete): relevant (TC-016, TC-020, TC-051, TC-053).
7 Charts that depend on each other: not relevant, no charts; weekly cells follow ETM-7346 and are only displayed.
8 Same data shown on many pages: relevant (TC-044, TC-050, Timeline shows the saved plan).
9 Matrix calculations: relevant (TC-032 matrix of totals).
Lessons L-1 to L-8: L-1 text sort with numbers not relevant (no sorted list); L-2 filter not kept not relevant; L-3 search read too early: applied as "wait for the save response before reading" in TC-044; L-4 multi-row paste not relevant here, the Story has no paste rule (Open question Q9); L-5 collapse per level: relevant (TC-011, TC-012); L-6 same value different case: relevant for group names (TC-015 allows same name; Open question Q8); L-7 selected state is not hover: not relevant, no picker with a selected swatch (the date picker current value is checked in TC-029); L-8 Story text changed during the sprint: relevant, the conflict modal title changed between comments (Open question Q1).

Skipped on purpose: zoom, keyboard-only, browser timezone, session expiry (module notes list them as not wanted; no AC asks for them).

## Counts
High 26 / Medium 22 / Low 6 (54 cases). Auto 41 / Partial 10 / Manual 3.

## Open questions
Q1. Conflict modal title: AC 6.3 says `Progress has been updated` (Excel row 14: `Progress has Been Updated`, capital B and U); the 5 Nov comment says `Plan has Been Changed` and "Row 16"; the Excel row for this modal is 14 (row 16 is Change Shutdown Size). Which exact title is correct? TC-052 uses the AC text.
Q2. Save failure text: AC says `Save Failed` / `Save Shutdown Timeline Plan Failed.`; the Excel row has two spaces between `Plan` and `Failed.`. Which spelling is expected?
Q3. Default Activity Group name `New Activity Group` (field table) conflicts with the Add Activity Group modal that starts empty with placeholder `Activity Group Name`. Where does the default apply?
Q4. Is Total Plan `99.9` or `100.1` savable? AC says only exactly `100.0` is allowed. How is the total rounded when activities have 1 decimal?
Q5. Does drag and drop reorder alone enable Save and show the Unsaved Change dialog (isDirty)? Does an edit that is typed back to the original value count as a change?
Q6. What is the on-screen text/tooltip on the red Total Progress Plan (%) cell? The Story gives only the colour.
Q7. How can Actual (%) be greater than Plan (%) when Actual is read-only (AC 4.5)? Assumed: by lowering a Plan (%) of an activity that already has Actual. Please confirm.
Q8. Are duplicate Activity Group names or duplicate Activity names allowed, and are names with different case or leading/trailing spaces treated as the same?
Q9. What happens to Plan (%), Start Date and End Date when text, negative values, or a pasted value is entered? AC says a field has range [0.0, 100.0] but not what happens above 100.0 (typing stops? clamps to 100.0? error?).
Q10. Are Start Date and End Date limited to Ramp Down to Ramp Up? The Story does not say; the module notes say outside dates cannot be entered.
Q11. Does deleting the last activity of a group leave the group with `No activity added.`, and does Delete Activity Group also remove Actual of its activities (same as TC-051)?
Q12. Is Save available while the Shutdown Size dropdown value was changed only (ETM-7984)? Not tested here.
Q13. Where is the Not found / forbidden result when a user without Edit Plan opens the URL (page `Not found`, redirect, or 403)?
Q14. Is the subtitle date format `DD Mmm YYYY` in UTC+7 for events whose dates cross midnight UTC?
Suggestion (not in Story): a confirmation before Delete Activity Group (deleting a whole group and all its activities in one click without confirmation is risky); Undo for delete.
Suggestion (not in Story): a visible error text under the Add Activity Group field when the limit of 100 is reached.

## Test cases (54 flows)

### TC-001 [FE][MT] Verify the Edit Plan screen opens for a Turnaround Manager with the seeded plan (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.1, AC-8.1, AC-9.1
1. Open the Timeline tab of the spare event. -> The Timeline tab shows the plan table and the `Edit Plan` button.
2. Click `Edit Plan`. -> The page `Edit Shutdown Timeline Plan` opens in the same tab.
3. Check the rows of the table. -> 5 Activity Group banner rows and 23 activity rows are shown, in the same order as on the Timeline.
4. Check the `Total Progress` row, `Plan (%)` cell. -> The cell shows `100.0` without a red background.
5. Check the footer. -> `Back` is on the bottom-left and `Save` on the bottom-right; `Save` is disabled because nothing changed.
Automate: reason = fixed seeded data, simple checks. Starting data: spare event with seeded plan. Check: counts, total, button states. Data set: one event. Clean up: none (nothing saved).

### TC-002 [FE][BE][MT] Verify a user without Edit Plan cannot see the button or open the screen (NEG) [Auto]
Precondition: A Job Owner (view only, View Timeline without Edit Plan) is logged in. The TM knows the direct address of the Edit Plan page of the spare event.
Priority: High
Trace: AC-9.2
1. Open the Timeline tab of the spare event as the Job Owner. -> The Timeline shows; the `Edit Plan` button is not on the page.
2. Paste the direct address of the Edit Plan page in the browser. -> The Edit Plan screen does not open; the user sees no table of the plan (the exact result is Open question Q13).
3. Log in again as the TM and open the same address. -> The `Edit Shutdown Timeline Plan` page opens.
Automate: reason = two roles, deterministic. Starting data: JO and TM accounts. Check: button absent, no editable table. Clean up: none.

### TC-003 [FE][MT] Verify heading, subtitle and info tooltip of the Edit Plan screen (POS) [Auto]
Precondition: common. The event has Ramp Down and Ramp Up dates.
Priority: Medium
Trace: AC-1.1, AC-1.2
1. Click `Edit Plan` on the Timeline. -> The heading `Edit Shutdown Timeline Plan` shows in 30px bold.
2. Read the subtitle. -> The subtitle reads `Ramp down date: DD Mmm YYYY | Ramp up date: DD Mmm YYYY` with the real dates of the event (for example `18 Jun 2025` and `10 Jul 2025`), 14px regular grey `#595959`.
3. Hover the `(i)` icon next to the subtitle. -> A tooltip shows `Data from Shutdown Event`.
4. Click into the subtitle text. -> The subtitle cannot be edited (read-only).
Automate: reason = text, colour and size can be read from the page. Starting data: event with known dates. Check: text, computed font-size and colour. Clean up: none.

### TC-004 [FE][MT] Verify the timeframe grid starts at the left edge on entry, also after returning (POS) [Auto]
Precondition: common. The grid is wider than the screen (Major SD event, 58 weeks).
Priority: Medium
Trace: AC-1.1
1. Click `Edit Plan`. -> The Edit Plan screen opens and the horizontal scroll position of the grid is the leftmost edge (scrollLeft = 0); the first week of the timeframe is at the left.
2. Scroll the weekly grid to the far right. -> The last weeks show.
3. Click `Back`. -> The Timeline screen opens (no dialog, nothing changed).
4. Click `Edit Plan` again. -> The grid is at the leftmost edge again, not at the earlier right position.
5. Reload the page with F5. -> The grid is at the leftmost edge.
Automate: reason = scrollLeft value is readable. Starting data: Major SD event. Check: scrollLeft = 0 in steps 1, 4, 5. Clean up: none.

### TC-005 [FE][MT] Verify the Shutdown Size dropdown and criteria icon are shown in the header (POS) [Partial: dropdown behaviour belongs to ETM-7984]
Precondition: common
Priority: Low
Trace: AC-1.2
1. Open the Edit Plan screen. -> A dropdown with the current shutdown size (for example `Major SD`) shows at the top right, with an `(i)` icon next to it.
2. Click the `(i)` icon. -> A popover with the classification criteria opens.
3. Click outside the popover. -> The popover closes and the plan is unchanged; `Save` stays disabled.
Automate: only the presence; the content of the popover and the change of the size are checked in ETM-7984.

### TC-006 [FE][MT] Verify weekly bars and Key Milestones are hidden on Edit Plan (POS) [Auto]
Precondition: common. The plan has weekly percentages and the Timeline shows weekly progress bars and a `Key Milestones` row.
Priority: Medium
Trace: AC-5.1, AC-5.2
1. Open the Timeline tab. -> The weekly grid shows coloured progress bars and the `Key Milestones` row.
2. Click `Edit Plan`. -> The Edit Plan screen opens.
3. Look at the weekly cells. -> The cells show percentage numbers only; no coloured progress bars are drawn.
4. Look above and below the grid for the `Key Milestones` row and milestone notes. -> The `Key Milestones` row and the notes are not shown.
Automate: reason = element absent checks. Check: no bar elements, no `Key Milestones` text. Clean up: none.

### TC-007 [FE][MT] Verify the Add Activity Group modal content and Cancel (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Click `+ Add Activity Group` (top right). -> The modal `Add Activity Group` opens.
2. Read the form. -> The field `* Activity Group Name` is empty with the placeholder `Activity Group Name` and the counter `(0/100)` at the top right of the field.
3. Check the buttons. -> `Cancel` (left, outlined) is enabled; `Save` (right, blue) is disabled.
4. Type `Pre-shutdown Review`. -> The counter shows `(19/100)` and `Save` becomes enabled.
5. Click `Cancel`. -> The modal closes and no new group is added; the number of groups is the same as before; the footer `Save` stays disabled.
Automate: reason = deterministic UI. Check: texts, counter, button states, group count. Clean up: none.

### TC-008 [FE][MT] Verify Save in the Add Activity Group modal appends an expanded group with the empty row (POS) [Auto]
Precondition: common. The number of groups is recorded (5 in the seed).
Priority: High
Trace: AC-1.2, AC-2.3, AC-8.2
1. Click `+ Add Activity Group`. -> The modal `Add Activity Group` opens.
2. Type `Pre-shutdown Review`. -> The field shows `Pre-shutdown Review`.
3. Click `Save` in the modal. -> The modal closes.
4. Look at the bottom of the table. -> A new group banner `Pre-shutdown Review` is the last group, expanded, with the row `No activity added.` in 14px grey.
5. Check the footer `Save`. -> The footer `Save` is enabled (a change exists).
6. Check the `Total Progress` `Plan (%)`. -> The value is unchanged (the new group has no activities).
Automate: reason = deterministic. Check: last group title, placeholder row, footer state. Clean up: leave the page with `Back` then `Discard Change` (nothing saved).

### TC-009 [FE][MT] Verify Save in the Add Activity Group modal stays disabled for empty or whitespace-only names (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2
1. Click `+ Add Activity Group`. -> The modal opens and `Save` is disabled.
2. Type 3 spaces in the field. -> The counter may show `(3/100)`; `Save` stays disabled.
3. Clear the field and type `A`. -> `Save` is enabled.
4. Delete the letter. -> `Save` is disabled again.
5. Press `Cancel`. -> The modal closes and no group is added.
Automate: reason = deterministic. Data set: empty, 3 spaces, 1 letter. Clean up: none.

### TC-010 [FE][MT] Verify the 100 character limit of the Activity Group name in the Add modal (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2, AC-7
1. Click `+ Add Activity Group`. -> The modal opens.
2. Type 99 characters. -> The counter shows `(99/100)`; `Save` is enabled.
3. Type 1 more character. -> The counter shows `(100/100)`.
4. Type 1 more character (the 101st). -> The 101st character does not appear and the counter stays `(100/100)`.
5. Paste a text of 150 characters. -> The field holds only 100 characters; the counter shows `(100/100)`.
6. Click `Save`. -> The group is added with the full 100-character title; the banner shows it without breaking the layout.
Automate: reason = loop over lengths 99/100/101/150. Clean up: `Back` then `Discard Change`.

### TC-011 [FE][MT] Verify all groups are expanded on entry (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Click `Edit Plan`. -> The Edit Plan screen shows all 5 Activity Groups expanded with their activity rows visible.
2. Click the chevron of the first group. -> The group collapses and its activities hide.
3. Check the footer `Save`. -> `Save` stays disabled (collapse is not a change).
Automate: reason = deterministic. Check: expanded state of every group. Clean up: none.

### TC-012 [FE][MT] Verify collapse state is not remembered after leaving and returning, and is not saved (POS) [Auto]
Precondition: common. On the Timeline tab one group is collapsed.
Priority: Medium
Trace: AC-2.1, AC-6.1
1. Open the Edit Plan screen. -> All groups are expanded even though one is collapsed on the Timeline.
2. Collapse groups 1 and 3. -> Both groups collapse; `Save` stays disabled.
3. Click `Back`. -> The Timeline opens without any dialog.
4. Click `Edit Plan` again. -> All groups are expanded again.
5. Collapse group 2, then reload the page with F5. -> After the reload all groups are expanded.
6. Change a Plan (%) of an activity and back (two edits) then collapse group 4. Click `Save`. -> The Timeline opens; collapse of group 4 was not saved and the Edit Plan opened later shows all groups expanded.
Automate: reason = deterministic. Clean up: restore the plan if step 6 changed it (use a spare plan).

### TC-013 [FE][MT] Verify `+ Add Activity` adds a blank row at the bottom of the group with defaults (POS) [Auto]
Precondition: common. Group 1 has several activities.
Priority: High
Trace: AC-2.1, AC-7
1. Click `+ Add Activity` on the banner row of group 1. -> A new blank Activity row appears at the bottom of group 1 (below the last activity).
2. Check the defaults. -> `Plan (%)` shows `0.0` and `Status` shows `Open`; `Activity`, `Start Date`, `End Date` are empty and shown red `#FFCCC7`; `Action By` and `Focal Point` are empty and not red.
3. Check the footer `Save`. -> `Save` is disabled (empty mandatory cells).
4. Check the `Total Progress` `Plan (%)`. -> The total is unchanged (the row adds `0.0`).
5. Check the other groups. -> No row was added to another group.
Automate: reason = deterministic. Clean up: `Back` then `Discard Change`.

### TC-014 [FE][MT] Verify Edit Activity Group modal shows the current name and Cancel keeps it (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1
1. Click the `⋮` menu on group 1. -> The menu shows `Edit Activity Group` and `Delete Activity Group`.
2. Click `Edit Activity Group`. -> The modal `Edit Activity Group` opens; `* Activity Group Name` holds the current name and the counter shows `(X/100)` where X is the real length of the name.
3. Type 3 more characters. -> The counter increases by 3.
4. Click `Cancel`. -> The modal closes and the banner still shows the old name; `Save` in the footer stays disabled.
Automate: reason = deterministic. Check: pre-filled name, counter equals length. Clean up: none.

### TC-015 [FE][MT] Verify Save in the Edit Activity Group modal updates the title, with limits (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.1, AC-7
1. Open `Edit Activity Group` on group 1. -> The modal opens with the current name.
2. Replace the name with `Preparation Phase 1`. -> The field shows the new name and `(19/100)`.
3. Click `Save` in the modal. -> The modal closes and the banner shows `Preparation Phase 1`; the footer `Save` becomes enabled.
4. Open `Edit Activity Group` again and replace the name with 101 characters. -> Only 100 characters stay and the counter shows `(100/100)`.
5. Delete all text. -> The modal `Save` is disabled (the name is mandatory).
Automate: reason = deterministic. Clean up: `Back` then `Discard Change`.

### TC-016 [FE][MT] Verify Delete Activity Group removes the group with its activities at once and updates the total (POS) [Auto]
Precondition: common. Group 2 has several activities. The `Total Progress` `Plan (%)` (`100.0`) and the group subtotal are recorded.
Priority: High
Trace: AC-2.1, AC-4.4
1. Click `⋮` on group 2, then `Delete Activity Group`. -> The group banner and all its activities disappear at once; no confirmation modal appears.
2. Check the other groups. -> The other groups and their rows are unchanged.
3. Check the `Total Progress` `Plan (%)`. -> The total is reduced by the deleted group subtotal, is no longer `100.0`, and the cell turns red `#FFCCC7`.
4. Check the footer `Save`. -> `Save` is disabled.
5. Click `Back`, then `Discard Change`. -> The Timeline opens; reopening Edit Plan shows the deleted group again (nothing was saved).
Automate: reason = deterministic. Clean up: none (discarded).

### TC-017 [FE][MT] Verify dragging an Activity Group moves it together with its activities, and the order is saved (POS) [Partial: drag and drop may need manual check]
Precondition: common. The order of groups, and the `Total Progress` `Plan (%)` `100.0`, are recorded.
Priority: High
Trace: AC-2.1, AC-6.1
1. Hover the banner row of group 3. -> A vertical drag handle shows.
2. Drag group 3 above group 1. -> Group 3 is the first group and all its activities moved with it; group 1 and 2 follow.
3. Check the totals. -> `Total Progress` `Plan (%)` is still `100.0`, no red cell.
4. Check the footer `Save`. -> `Save` is enabled (the order is a change unless Open question Q5 says otherwise).
5. Click `Save`. -> The Timeline opens with the toast `Save Success`; the groups appear in the new order with their activities.
6. Open `Edit Plan` again. -> The new order is shown (not the old one); drag group back to restore the plan.
Automate: drag with mouse events; if unstable the step is done manually. Clean up: restore the order.

### TC-018 [FE][MT] Verify dragging an activity inside its group changes the order, and the order is saved (POS) [Partial: drag and drop may need manual check]
Precondition: common. Group 1 has at least 3 activities; their order is recorded.
Priority: High
Trace: AC-2.2, AC-6.1
1. Hover the first activity row of group 1. -> A vertical grab handle shows.
2. Drag the first activity below the third. -> The activity is third; the other two moved up; the group subtotal and the total are unchanged.
3. Click `Save`. -> The Timeline opens with the toast `Save Success`; the activities show in the new order.
4. Open `Edit Plan`. -> The new order is shown after reload; drag the activity back and `Save` to restore.
Automate: as TC-017. Clean up: restore the order.

### TC-019 [FE][MT] Verify an activity cannot be dragged into another Activity Group (NEG) [Partial: drag and drop may need manual check]
Precondition: common
Priority: Medium
Trace: AC-2.2
1. Drag an activity of group 1 over the rows of group 2. -> The drop into group 2 is not allowed (no insertion indicator inside group 2).
2. Release the mouse over group 2. -> The activity returns to group 1 at its original or the same-group position; group 2 has the same rows as before.
3. Check the group subtotals. -> Every subtotal is unchanged.
Automate: as TC-017.

### TC-020 [FE][MT] Verify the trash icon is always visible and deletes the activity at once (POS) [Auto]
Precondition: common. Mouse is away from the table.
Priority: High
Trace: AC-2.2, AC-4.4
1. Look at the `Activity` cells without hovering any row. -> Every activity row shows the trash icon inside the `Activity` cell.
2. Click the trash icon of the third activity of group 1. -> That row disappears at once; no confirmation modal appears; the other rows are unchanged.
3. Check the group subtotal and the `Total Progress` `Plan (%)`. -> Both are reduced by the plan of the deleted activity; the total cell turns red `#FFCCC7` unless the plan of the activity was `0.0`.
4. Check the footer `Save`. -> `Save` is enabled when the total is `100.0`, disabled when it is not.
Automate: reason = deterministic. Data set: one activity with plan `0.0` (total stays 100.0) and one with plan above 0. Clean up: `Back` then `Discard Change`.

### TC-021 [FE][MT] Verify the empty group row and the no-group state (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3, AC-8.2, AC-8.3
1. Delete every activity of group 5 with the trash icons. -> Group 5 shows one row `No activity added.` in 14px regular grey.
2. Delete groups 1 to 4 and 5 with `Delete Activity Group`. -> The table has no group; under the header `No activity added.` shows.
3. Check `Total Progress` `Plan (%)`. -> The value is `0.0` and the cell is red `#FFCCC7`.
4. Check the footer `Save`. -> `Save` is disabled.
5. Click `+ Add Activity Group`, name it `Recovery Group` and click `Save` in the modal. -> The group shows with `No activity added.`; footer `Save` stays disabled (total is `0.0`).
Automate: reason = deterministic. Clean up: `Back` then `Discard Change`.

### TC-022 [FE][MT] Verify the length limit of Activity (500) (BND) [Auto]
Precondition: common. An activity row with a name exists.
Priority: Medium
Trace: AC-3.1, AC-7
1. Double-click the `Activity` cell of the first activity and select all text. -> The cell is in edit mode with the text selected.
2. Type 500 characters. -> The cell holds 500 characters.
3. Type 1 more character. -> The 501st character is not accepted; the cell still holds 500 characters.
4. Paste 600 characters. -> The cell holds 500 characters.
5. Press `Enter`. -> The cell shows the text; the row height or the layout does not break the table.
6. Click `Save`. -> The Timeline opens with `Save Success`; the activity shows the saved 500-character text and Edit Plan reopens with the same text.
Automate: reason = loop over 499/500/501/600. Clean up: restore the original name.

### TC-023 [FE][MT] Verify the length limit of Action By and Focal Point (50) and that they are optional (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.1, AC-4.1, AC-7
1. Edit the `Action By` cell of an activity and type 50 characters. -> The cell holds 50 characters.
2. Type 1 more character. -> It is not accepted.
3. Edit the `Focal Point` cell and type 51 characters. -> Only 50 characters stay.
4. Delete all text of `Action By` and `Focal Point`. -> Both cells are empty with no red background; no asterisk is on their headers.
5. Check the footer `Save`. -> `Save` is enabled (the change is valid, the fields are optional).
Automate: reason = loop over 49/50/51. Clean up: `Back` then `Discard Change`.

### TC-024 [FE][MT] Verify Status, Actual (%) and weekly cells are read-only (NEG) [Auto]
Precondition: common. An activity has Actual (%) above 0 and Status `Close` (set on the Timeline before).
Priority: High
Trace: AC-3.2
1. Open the Edit Plan screen. -> The activity shows its Status and its Actual (%) value for reference.
2. Double-click the `Status` cell. -> No editor or dropdown opens; the value stays.
3. Double-click the `Actual (%)` cell. -> No editor opens; the value stays.
4. Double-click a weekly cell. -> No editor opens; the percentage stays.
5. Check the footer `Save`. -> `Save` stays disabled (nothing changed).
Automate: reason = deterministic. Starting data: activity with Actual and Close set by TM on the Timeline. Clean up: none.

### TC-025 [FE][MT] Verify line break with Alt+Enter in Activity and single-line fields (POS) [Partial: Option+Enter on macOS is checked by hand]
Precondition: common
Priority: Medium
Trace: AC-3.3
1. Double-click the `Activity` cell and type `Install scaffold`. -> The cell shows the text.
2. Press `Alt + Enter` (macOS: `Option + Enter`) and type `Level 2`. -> The text continues on a second line inside the same cell.
3. Press `Enter` to finish. -> The cell shows two lines: `Install scaffold` and `Level 2`.
4. Click `Save`, then open `Edit Plan` again. -> The activity still shows two lines.
5. In `Action By` press `Alt + Enter`. -> No line break is inserted; the cell stays single-line.
6. Do the same in `Focal Point` and in the group title modal. -> No line break in any of them.
Automate: Alt+Enter on Windows/Linux only. Clean up: restore the activity name.

### TC-026 [FE][MT] Verify an empty Activity name is red and disables Save (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-4.1, AC-4.2, AC-3.1
1. Double-click the `Activity` cell of an activity, delete all text and press `Enter`. -> The cell is empty with the red background `#FFCCC7`.
2. Check the footer `Save`. -> `Save` is disabled.
3. Type `Check welding` in the cell. -> The red background goes away.
4. Check the footer `Save`. -> `Save` is enabled (total still `100.0`).
5. Delete the text again and type 3 spaces. -> The result is as in Open question Q8 (spaces only treated as empty or not); the case records what is shown.
Automate: steps 1-4. Clean up: `Back` then `Discard Change`.

### TC-027 [FE][MT] Verify the red asterisks in the column headers (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-4.1
1. Open the Edit Plan screen and read the column headers. -> `Activity`, `Start Date`, `End Date` and `Plan (%)` each show a red `*`.
2. Read `Action By` and `Focal Point`. -> No asterisk.
Automate: reason = static check.

### TC-028 [FE][MT] Verify an empty Start Date or End Date (also on Minor SD optional tasks) is red and blocks Save (NEG) [Auto]
Precondition: common. One event with a Minor SD size whose optional tasks have empty dates (for example t6 in the seed), one Major SD event.
Priority: High
Trace: AC-4.2
1. Open the Edit Plan screen of the Major SD event and clear the `Start Date` of an activity. -> The cell turns red `#FFCCC7`; `Save` is disabled.
2. Set the date again. -> The red background goes away; `Save` is enabled.
3. Clear the `End Date`. -> The cell turns red `#FFCCC7`; `Save` is disabled.
4. Open the Edit Plan screen of the Minor SD event. -> The optional tasks with empty `Start Date` and `End Date` show red `#FFCCC7` cells and `Save` is disabled.
5. Fill every empty date. -> No red cell remains; if the total is `100.0` `Save` is enabled.
Automate: reason = deterministic. Starting data: Minor SD event with optional tasks. Clean up: discard.

### TC-029 [FE][MT] Verify the date picker disables dates after End Date when picking Start Date (BND) [Auto]
Precondition: common. An activity has Start `10 Jun 2025` and End `20 Jun 2025` (set the dates if needed).
Priority: High
Trace: AC-4.3
1. Open the date picker of `Start Date`. -> The calendar opens and the current date `10 Jun 2025` is marked.
2. Look at 20 Jun and 21 Jun 2025. -> `20 Jun 2025` (equal to End Date) can be clicked; `21 Jun 2025` is disabled and cannot be clicked.
3. Click `21 Jun 2025`. -> Nothing happens; the Start Date stays `10 Jun 2025`.
4. Click `20 Jun 2025`. -> The `Start Date` shows `20 Jun 2025` (Start = End is allowed).
Automate: reason = deterministic dates. Data set: End Date boundary (before, on, after). Clean up: discard.

### TC-030 [FE][MT] Verify the date picker disables dates before Start Date when picking End Date (BND) [Auto]
Precondition: common. An activity has Start `10 Jun 2025` and End `20 Jun 2025`.
Priority: High
Trace: AC-4.3
1. Open the date picker of `End Date`. -> The calendar opens.
2. Look at 9 Jun and 10 Jun 2025. -> `9 Jun 2025` is disabled and cannot be clicked; `10 Jun 2025` can be clicked.
3. Click `9 Jun 2025`. -> Nothing happens; the End Date stays `20 Jun 2025`.
4. Click `10 Jun 2025`. -> The `End Date` shows `10 Jun 2025` and no red cell shows.
5. Open the picker of `Start Date` again. -> Dates after `10 Jun 2025` are disabled.
Automate: as TC-029. Clean up: discard.

### TC-031 [FE][MT] Verify Total Plan different from 100.0 turns the total red and disables Save (NEG) [Auto]
Precondition: common. Total is `100.0`. The `Total Progress` `Plan (%)` cell has no red background.
Priority: High
Trace: AC-4.4
1. Change the `Plan (%)` of one activity so the total becomes `105.0` (for example `Frozen Work Lists` from `2.0` to `7.0`). -> The `Total Progress` `Plan (%)` shows `105.0` with the red background `#FFCCC7`; the group subtotal also changes.
2. Check the footer `Save`. -> `Save` is disabled.
3. Change another activity (`Peer Review and Work Readiness Review` from `5.0` to `0.0`). -> The total shows `100.0`; the red background is gone.
4. Check the footer `Save`. -> `Save` is enabled.
Automate: reason = deterministic seed values. Starting data: seeded plan. Clean up: discard.

### TC-032 [FE][MT] Verify the total matrix: only exactly 100.0 allows Save (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-4.4
1. For each row of the table below, set the `Plan (%)` of one activity so that the total gets the value, then read the red state of the total cell and the state of `Save`. -> Every row gives the result of the table.

| Total after the edit | Total cell red `#FFCCC7` | Footer `Save` |
|---|---|---|
| `100.0` | no | enabled |
| `99.9` | yes | disabled |
| `100.1` | yes | disabled |
| `90.0` | yes | disabled |
| `0.0` | yes | disabled |
(`99.9` and `100.1` are as the AC says "exactly 100.0", see Open question Q4.)
Automate: loop over the table. Starting data: seeded plan with one activity plan changed to reach each total. Clean up: discard.

### TC-033 [FE][MT] Verify Save is blocked by the total after deleting everything and restored by adding a plan (NEG) [Partial: the exact data to reach 100.0 depends on the plan]
Precondition: common
Priority: Medium
Trace: AC-4.4, AC-8.3
1. Delete all groups. -> The total is `0.0`, red; `Save` disabled.
2. Add one group and one activity with `Start Date`, `End Date` and name filled and `Plan (%)` `100.0`. -> The total is `100.0`; the red background is gone.
3. Check the footer `Save`. -> `Save` is enabled.
Automate: only step 1; the rest by hand because of the data set.

### TC-034 [FE][BE][MT] Verify the first-time state shows red total when the master template total is not 100.0 (NEG) [Manual: no QA template with a total other than 100.0 exists]
Precondition: A Shutdown Event is created from a master plan template whose planned progress total is not `100.0` (dev prepares the file; not available on QA now).
Priority: High
Trace: AC-4.4, AC-8.1
1. Create the event so the default plan is seeded. -> The event is created with a Timeline plan.
2. Click `Edit Plan`. -> The `Total Progress` `Plan (%)` shows the template total (not `100.0`) with the red background `#FFCCC7`.
3. Check the footer `Save`. -> `Save` is disabled.
4. Adjust a `Plan (%)` so the total becomes `100.0`. -> The red background goes away and `Save` is enabled.

### TC-035 [FE][MT] Verify Plan (%) accepts values in 0.0 to 100.0 and shows one decimal (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1, AC-7
1. Type `5` in `Plan (%)` of an activity and press `Enter`. -> The cell shows `5.0`.
2. Type `0` and press `Enter`. -> The cell shows `0.0`.
3. Type `2.55` and press `Enter`. -> The cell shows a value with one decimal place (the rounded value; see Open question Q9).
4. Type `100` in one cell and press `Enter`. -> The cell shows `100.0`.
5. Type `100.1`. -> The value is not kept as `100.1` (the exact behaviour is Open question Q9).
Automate: loop over the values 0, 5, 2.55, 100, 100.1; expected list from the answer to Q9. Clean up: discard.

### TC-036 [FE][MT] Verify Plan (%) rejects negative values and text (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.1, AC-7
1. Type `-5` in `Plan (%)` and press `Enter`. -> A negative value is not kept; the cell never shows `-5.0`.
2. Type `abc` and press `Enter`. -> No text stays in the cell; the cell is empty (red) or shows the previous value.
3. Type `1e2` and `5,5`. -> No invalid value is stored; the total is calculated only from valid numbers.
4. Check the footer `Save`. -> `Save` is disabled when a mandatory cell is empty or the total is not `100.0`.
Automate: data set -5, abc, 1e2, 5,5, 0..0. Clean up: discard.

### TC-037 [FE][MT] Verify the yellow over-plan warning and that Save stays enabled (POS) [Auto]
Precondition: common. An activity has Actual (%) above 0 (for example `3.0`) set on the Timeline.
Priority: Medium
Trace: AC-4.5
1. Open the Edit Plan screen. -> The activity shows its Actual (%) of `3.0` and Plan (%) above `3.0`; the Actual cell has no warning colour.
2. Lower its `Plan (%)` below the Actual (for example `2.0`) and raise another activity so the total is `100.0`. -> The `Actual (%)` cell of the activity turns yellow `#FFE7BA`.
3. Hover the yellow cell. -> A tooltip shows `The actual progress is over the planned progress.`.
4. Check the footer `Save`. -> `Save` is enabled (the warning does not block).
5. Raise the plan again above the actual. -> The yellow background goes away.
Automate: reason = deterministic with the prepared Actual. Starting data: activity with Actual `3.0`. Clean up: discard.

### TC-038 [FE][MT] Verify Ramp Down and Ramp Up lines and tooltips on Edit Plan (POS) [Partial: stacking order is checked by eye]
Precondition: common. Ramp Down `18 Jun 2025`, Ramp Up `10 Jul 2025`.
Priority: Low
Trace: AC-5.3
1. Open the Edit Plan screen. -> Two full-height vertical lines show across the weekly grid, each with a badge (`Ramp Down` and `Ramp Up`) to the right of the line.
2. Hover the `Ramp Down` line. -> A tooltip shows `Ramp Down: 18 Jun 2025`.
3. Hover the `Ramp Up` line. -> A tooltip shows `Ramp Up: 10 Jul 2025` and the `Ramp Up` line comes to the front.
4. Move the mouse away. -> `Ramp Down` is on top again.
Automate: lines and tooltip text; stacking by eye.

### TC-039 [FE][MT] Verify drag handles show on hover for groups and activities (POS) [Auto]
Precondition: common. Mouse is away from the table.
Priority: Low
Trace: AC-2.1, AC-2.2
1. Look at a group banner row and an activity row without hovering. -> No drag handle is shown (only the trash icon is permanently visible in the activity row).
2. Hover the group banner row. -> A vertical grab handle shows on the banner row.
3. Hover an activity row. -> A vertical grab handle shows on the activity row.
Automate: reason = hover state check.

### TC-040 [FE][MT] Verify Back without changes leaves the page without a dialog (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.3
1. Open the Edit Plan screen and do not change anything. -> `Save` is disabled.
2. Click `Back`. -> The main Timeline screen opens at once; no `Unsaved Change` dialog appears.
3. Open `Edit Plan` again, collapse a group and click `Back`. -> The Timeline opens without a dialog (collapse is not a change).
Automate: reason = deterministic.

### TC-041 [FE][MT] Verify the Unsaved Change dialog with Back and the side menu, Continue Editing and Discard Change (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1.3, AC-6.1
1. Change the `Activity` name of one activity to `Edited name`. -> The cell shows the new name; `Save` is enabled.
2. Click `Back`. -> A modal appears with the title `Unsaved Change` and the message `Are you sure you want to leave this page? Changes you made will not be saved.` and the buttons `Continue Editing` and `Discard Change`.
3. Click `Continue Editing`. -> The modal closes, the page stays on Edit Plan and the cell still shows `Edited name`.
4. Click an item of the side menu. -> The same `Unsaved Change` modal appears.
5. Click `Discard Change`. -> The user goes to the chosen page; the change is not saved.
6. Open the Timeline and Edit Plan again. -> The old activity name shows.
Automate: reason = deterministic. Check: texts of title, message and both buttons. Clean up: none.

### TC-042 [FE][MT] Verify leaving with the browser tab close or reload while changes exist (Exotic: browser) [Manual: the browser dialog is outside the page]
Precondition: common
Priority: Low
Trace: AC-1.3
1. Change a `Plan (%)` value. -> `Save` is enabled.
2. Reload the page with F5. -> The page reloads; the draft change is not kept and the plan shows saved values with all groups expanded (reload is not a change; the browser may show its own leave warning).
3. Press the browser Back button. -> The user leaves without the `Unsaved Change` dialog or with it (result is noted as a finding for the BA; the Story names only the `Back` button and the side menu).

### TC-043 [FE][MT] Verify Save is disabled when nothing changed and after an edit that is typed back (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.3, AC-4.4
1. Open the Edit Plan screen. -> `Save` is disabled.
2. Change the `Action By` of an activity to `Planner A`. -> `Save` becomes enabled.
3. Type the original value back. -> Record whether `Save` becomes disabled again (Open question Q5); the state shown is noted.
4. Change `Action By` to `Planner A` and click `Save`. -> The toast `Save Success` shows and the Timeline opens.
5. Open `Edit Plan` again. -> `Save` is disabled (isDirty is reset).
Automate: steps 1, 2, 4, 5.

### TC-044 [FE][BE][MT] Verify Save stores edits, shows the toast and returns to the Timeline (POS) [Auto]
Precondition: common. A spare plan; its values are recorded to restore afterwards.
Priority: High
Trace: AC-6.1, AC-8.1
1. Rename the first activity to `Check scaffold permit`. -> The cell shows the new name.
2. Change its `End Date` to a later valid date. -> The date shows and no red cell.
3. Add the group `Pre-shutdown Review` with the Add Activity Group modal. -> The group shows at the bottom.
4. Delete the last activity of group 5 with the trash icon and adjust a `Plan (%)` so the total is `100.0`. -> The total is `100.0` and `Save` is enabled.
5. Click `Save` and wait for the response. -> The Timeline screen opens and a toast with the title `Save Success` and the message `Save Shutdown Timeline Plan Successfully.` shows.
6. Check the Timeline table. -> The new name, the end date, the new group and the removed activity show; weekly percentages follow the new dates.
7. Open `Edit Plan` again. -> The same data is shown and `Save` is disabled.
Automate: reason = main flow. Check after the response (not before). Clean up: restore the plan with a second Save or recreate the spare event.

### TC-045 [FE][BE][MT] Verify the saved order of groups and activities and totals after reload (POS) [Partial: uses drag and drop, which may need manual check]
Precondition: common
Priority: High
Trace: AC-6.1
1. Change the order of two groups and of two activities inside one group. -> The new order shows; the totals are unchanged.
2. Click `Save`. -> The Timeline opens with the toast `Save Success`.
3. Reload the browser with F5. -> The Timeline shows the new order.
4. Open `Edit Plan`. -> The same order shows; all groups are expanded.
Automate: with drag; else by hand. Clean up: restore the order.

### TC-046 [FE][MT] Verify the Timeline totals and group subtotals match after Save (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-6.1, AC-4.4
1. Change two `Plan (%)` values in one group so that the total stays `100.0` (for example `2.0` to `4.0` and another `5.0` to `3.0`). -> The group subtotal stays the same; the total is `100.0`.
2. Click `Save`. -> The Timeline opens.
3. Read the group subtotal and the `Total Progress` `Plan (%)` on the Timeline. -> They show the same numbers as on Edit Plan before Save.
Automate: reason = number comparison. Clean up: restore values.

### TC-047 [FE][BE][MT] Verify the failure toast when Save fails (NEG) [Manual: needs the server to fail or a blocked network]
Precondition: common. The network or the save request can be blocked.
Priority: Medium
Trace: AC-6.1
1. Change an `Activity` name. -> `Save` is enabled.
2. Block the network (or the save request) and click `Save`. -> A toast with the title `Save Failed` and the message `Save Shutdown Timeline Plan Failed.` shows (the spelling is Open question Q2); the user stays on Edit Plan.
3. Restore the network. -> The page still shows the edited name and `Save` is still enabled.
4. Click `Save`. -> The toast `Save Success` shows and the Timeline opens.

### TC-048 [FE][BE][MT] Verify a double click on Save saves only once (Exotic: double click) [Auto]
Precondition: common. The number of groups and activities is recorded.
Priority: Medium
Trace: AC-6.1
1. Add a group `Pre-shutdown Review` and an activity with all mandatory values and total `100.0`. -> `Save` is enabled.
2. Double-click `Save` quickly with a slow network (throttled). -> One toast `Save Success` shows and the Timeline opens; no error toast appears.
3. Open the Timeline and Edit Plan. -> The group `Pre-shutdown Review` exists exactly once, the number of rows is as expected.
Automate: reason = two clicks in one test. Clean up: restore the plan.

### TC-049 [FE][BE][MT] Verify two Turnaround Managers saving the same plan: the last save wins (Exotic: two users) [Auto]
Precondition: common. Two TM sessions (two browser contexts) on the same spare event.
Priority: High
Trace: AC-6.2
1. TM-A and TM-B both open `Edit Plan`. -> Both show the same plan.
2. TM-A renames `Activity 1` to `Name from A` and clicks `Save`. -> TM-A sees `Save Success` and the Timeline.
3. TM-B renames `Activity 1` to `Name from B` and clicks `Save`. -> TM-B sees `Save Success` (last write wins) and no data is lost or duplicated.
4. Open the Timeline as TM-A. -> The activity shows `Name from B`; there is one row for the activity.
Automate: two contexts. Clean up: restore the name. If a conflict modal titled `Progress has been updated` shows instead, click `OK`; the page reloads and the result is noted.

### TC-050 [FE][BE][MT] Verify Timeline edits are kept by activity key after Save from Edit Plan (Exotic: two tabs) [Auto]
Precondition: common. Two browser tabs of the same TM. An activity `Weld inspection` has Status `Open` and Actual `0.0`.
Priority: High
Trace: AC-6.3
1. In tab 1 open `Edit Plan` and rename `Weld inspection` to `Weld inspection v2` and move another group above it (the order changes). -> `Save` is enabled; the order differs from the Timeline.
2. In tab 2 on the Timeline set the Status of `Weld inspection` to `Close`, enter Actual `2.0` and click `Update Progress`. -> The toast `Update Success` shows.
3. In tab 1 click `Save`. -> One of two results: the conflict modal with the title `Progress has been updated` and the button `OK`, or the toast `Save Success`. Record which one.
4. After the result (OK of the modal if shown and repeating the edit) open the Timeline. -> The row shows the new name `Weld inspection v2` in the new position and keeps Status `Close` and Actual `2.0` (matched by activity key, not by row position or title).
Automate: two pages in one context. Clean up: restore the plan.

### TC-051 [FE][BE][MT] Verify an activity deleted in Edit Plan is removed with its Status and Actual (POS) [Auto]
Precondition: common. The activity `Weld inspection` has Actual `2.0` and Status `Close`.
Priority: High
Trace: AC-6.3, AC-4.4
1. Open `Edit Plan` and delete `Weld inspection` with the trash icon. -> The row disappears and the total is changed.
2. Move another activity plan so the total is `100.0`. -> `Save` is enabled.
3. Click `Save`. -> `Save Success` and the Timeline opens.
4. Look for `Weld inspection` on the Timeline. -> The activity is not shown anywhere; the total Actual no longer includes the `2.0`.
5. Create a new activity with the same name `Weld inspection` and Save. -> The new activity has Status `Open` and Actual `0.0`; the old Status and Actual do not come back.
Automate: reason = deterministic. Clean up: restore.

### TC-052 [FE][BE][MT] Verify the conflict modal when progress was updated during editing (Exotic: two users) [Auto]
Precondition: common. TM-A on Edit Plan, TM-B on the Timeline of the same event.
Priority: High
Trace: AC-6.3
1. TM-A changes the `Activity` name of an activity. -> `Save` is enabled.
2. TM-B updates the Actual (%) of any activity on the Timeline and clicks `Update Progress`. -> TM-B sees `Update Success`.
3. TM-A clicks `Save`. -> A modal opens with the title `Progress has been updated` and the message `The shutdown timeline has already been updated. This action will reload the page and update some data.` and the button `OK` (title is Open question Q1).
4. Click `OK`. -> The page reloads and shows the data with TM-B's progress; the other edits are reconciled by activity key.
5. Check the activity of TM-B. -> Its Actual shows the value of TM-B.
Automate: two contexts. Check the modal text exactly. Clean up: restore.

### TC-053 [FE][BE][MT] Verify Save in Edit Plan does not change Worklist or Shutdown Logic (POS) [Partial: needs a before and after look at two other modules]
Precondition: common. The Worklist and the Shutdown Logic of the event have data; a screenshot or count of work items is noted.
Priority: Medium
Trace: AC-10.1
1. Record the number of work items in `Worklist` and in `Shutdown Logic` of the event. -> The counts are written down for later comparison.
2. Edit Plan: rename an activity, delete an activity and add a group; click `Save`. -> `Save Success` shows.
3. Open `Worklist` and `Shutdown Logic`. -> The counts and the names of the work items are the same as recorded.
Automate: counts of rows can be compared; the rest by eye.

### TC-054 [FE][MT] Verify very long names and many rows keep the layout usable (Exotic: volume) [Partial: layout by eye]
Precondition: common
Priority: Low
Trace: none (screen state: very long content and very many rows)
1. Add a group with a 100-character name and an activity with a 500-character name without spaces. -> The names are shown (cut or wrapped) and the table does not break horizontally.
2. Add 30 activities to one group with `+ Add Activity`. -> The page scrolls vertically; the footer `Back` and `Save` stay reachable.
3. Open `Edit Plan` again after `Back` and `Discard Change`. -> The saved plan is shown without the added rows.
Automate: counts only; layout by eye.

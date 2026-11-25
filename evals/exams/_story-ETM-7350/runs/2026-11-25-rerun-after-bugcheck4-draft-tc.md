# Draft TC: ETM-7350 Shutdown Timeline - Key Milestones Operational Notes & Modal Management

Story: ETM-7350. Source: story.md (frozen exam copy, no analyst.md, no inspector.md), docs/modules/shutdown-timeline.md, shutdown-timeline-validation.md, knowledge/. Existing [QA] subtasks: not known (not read).
AC ids used (no analyst.md, numbered as in the Story): AC-1.1 row placement; AC-1.2 empty cell (+); AC-1.3 existing note cell (icon, tooltip, double-click); AC-2.1 modal title; AC-2.2 fields; AC-2.3 buttons (Cancel, Delete, Save, toasts); AC-3.1 immediate DB commit; AC-3.2 separate from Update Progress; AC-3.3 no dirty; AC-3.4 no leave guard; AC-3.5 out-of-timeframe auto delete; AC-4 field table; AC-5 empty states; AC-6 roles; AC-7 cross-module isolation.

Common precondition: Environment QA. User A is a Turnaround Manager (View Timeline, Update Progress and Note). User B is a Job Owner (View Timeline only). Active Shutdown Event, Timeline tab open, Key Milestones row shows no notes unless the case says otherwise. Hide-histogram rule is for Shutdown Logic only, not needed here.
Notation: POS positive, NEG negative, BND boundary. Priority comes from damage (the Story has none).
Sample data: note texts `Permit review`, `Crane arrives`; weeks are "the first week", "the last week" of the grid.

## Think like the user (3 lines)
- Turnaround Manager, several times a week, marks permits, mobilisation and meetings on week cells while watching the plan.
- Wants a fast add and edit that is saved at once, without pressing Update Progress.
- A rushed person double-clicks the + , types more than 50 characters, deletes by mistake, edits the plan and does not know notes vanish.

## Coverage map
| Requirement / state | Technique | Risk | Cases |
|---|---|---|---|
| AC-1.1 row below header, hidden in Edit Plan | screen state | wrong place, shows in Edit Plan | TC-001, TC-002 |
| AC-1.2 + on hover, permission | roles, state | + shown to view-only (permission leak) | TC-003, TC-004 |
| AC-1.3 icon and colour, tooltip, No details., double-click | screen state, roles | wrong icon, tooltip empty, view-only edits | TC-005, TC-006, TC-007, TC-008 |
| AC-2.1 title Add Note / Edit Note | state | wrong title | TC-009 |
| AC-2.2 Icon 10 icons, default, Color 20, default, checkmark | equivalence, defaults | wrong default, selected not marked (L-7) | TC-010, TC-011, TC-012 |
| AC-2.2 Note placeholder, counter, max 50 | boundary | 51st char accepted, counter wrong | TC-013, TC-014 |
| AC-2.2 strange input (emoji, Thai, spaces, paste) | error guessing, lesson 4 | saved wrong, page breaks | TC-015, TC-016 |
| AC-2.3 Cancel | state | change applied | TC-017 |
| AC-2.3 Save Add, toast, cell | POS | not saved, wrong toast | TC-018, TC-019 |
| AC-2.3 Save Edit, toast, cell | POS | old value stays | TC-020, TC-021 |
| AC-2.3 Delete confirmation, success, cancel, toast | state | data loss without confirm | TC-022, TC-023, TC-024 |
| AC-2.3 fail toasts (Save, Edit, Delete Failed) | error guessing | silent failure, cell changes though API failed | TC-025, TC-026, TC-027 |
| AC-3.1 immediate DB commit (reload, other user) | linked data | saved only on screen | TC-028, TC-029 |
| AC-3.2, AC-3.3 independent of Update Progress | dirty state | Update Progress enabled by a note, progress saved by a note | TC-030, TC-031 |
| AC-3.4 no leave guard | leaving and coming back | unsaved alert for notes | TC-032 |
| AC-3.5 auto delete: Edit Plan dates, Shutdown Type, delete Actual, no confirm | linked data, boundary | note stays outside grid, or deleted inside grid | TC-033, TC-034, TC-035, TC-036 |
| AC-4 field table (types, required, default) | equivalence | default or empty Note stored wrong | TC-010, TC-011, TC-021 |
| AC-5 first time, empty note, all deleted, all out of range | screen state | wrong empty state | TC-037, TC-008, TC-024, TC-036 |
| AC-6 roles | roles | permission leak | TC-004, TC-007, TC-038 |
| AC-7 isolation Shutdown Logic, Equipment Mob Plan | linked data | note shows elsewhere | TC-039 |
| Double click on Save, two tabs, two users | lesson 1, error guessing | duplicate note, lost update | TC-040, TC-041 |
| Past and middle weeks, filled cell hover, no + on filled cell | boundary, state | note blocked in some weeks, second + on filled cell | TC-046, TC-047 |
| Leave with modal open, view-only leave, Edit Plan cancel, pending progress undone by hand | leaving and coming back | alert for notes, notes lost, button stays enabled | TC-043, TC-044, TC-045, TC-031 |
| Paste into existing text with the 50 limit, horizontal scroll | input habits, layout | limit broken, cells misaligned | TC-048, TC-049 |
| Keyboard Tab, Enter, Esc in modal | real-user view | keyboard user stuck | TC-042 |

Categories (lessons-learned): 1 two users: relevant (TC-041). 2 filter+sort+search: not relevant, Key Milestones has none. 3 old migrated data: not relevant, new feature, no migration in Story. 4 strange input: relevant (TC-015, TC-016). 5 reordering: not relevant, weeks are fixed by date. 6 linked data: relevant (TC-033..036, TC-039). 7 dependent charts: not relevant. 8 same data on many pages: relevant (TC-039, TC-029). 9 matrix: relevant, icon x colour list (TC-012). L-1 text sort: not relevant. L-2 option kept after reload: relevant (TC-028). L-3 read too early: relevant for Auto cases (wait for the save response, then check). L-4 multi-row paste: relevant (TC-016, one line only). L-5 collapse: not relevant. L-6 same value different case: not relevant (notes are not unique). L-7 selected is not hover: relevant (TC-011, TC-012). L-8 Story changed during sprint: relevant, see open question 1.

Counts: High 22 / Medium 22 / Low 5. Auto 37 / Partial 5 / Manual 7 (49 cases in total; see the Automation tag of each case).

## Open questions
1. Story text is a frozen copy; one later edit exists in Jira. Re-check the final text before the run (L-8).
2. Is a note allowed in every visible week, including past weeks and weeks before Ramp Down? Story says "any week of the grid", assumed yes.
3. Can two notes exist in one week? Story shows one icon per cell; assumed one note per week (the + is not shown on a filled cell).
4. Does a Note made of spaces only save as typed, trimmed, or as empty (tooltip `No details.`)? Not in Story. Case TC-015 expects what a user would call correct: spaces only behaves like empty.
5. Does the Add Note / Edit Note modal close on Esc and on a click outside? Not in Story. TC-042 only checks Esc and records the result.
6. When Save fails, does the modal stay open with the typed values? Story says only the toast. TC-025 expects the modal stays open so the user does not lose the text.
7. Does the tooltip for a long (50 character) note wrap or cut the text?
8. Delete in the confirmation modal: the second Cancel, does it return to the Edit Note modal or close both? Story silent. TC-023 expects the confirmation closes and the Edit Note modal stays.
9. Where does the note go when an event's Ramp Down or Ramp Up date is edited in Event Details (grid bounds move)? Story names only Edit Plan, Shutdown Type and Actual (%) as triggers.
10. Suggestion (not in Story): mobile or phone width for the modal and hover (hover does not exist on touch).
11. Suggestion (not in Story): audit trail / who created or last edited a note.
12. How is the Key Milestones row shown for a plan with no timeframe weeks (no dates)? Not in Story.

## Test cases (49 flows)

### TC-001 [FE][MT] Verify the Key Milestones row sits right below the header on the Timeline screen (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Open the Timeline tab of the active event. -> The Timeline grid shows with its table header rows.
2. Look at the row directly under the header rows. -> A row named `Key Milestones` is shown immediately below the table header row, above the first activity group.
3. Check the weekly cells of that row. -> One cell per week of the grid is shown, all empty.
Automation: Starting data: event with no notes. What to check: row order (header, Key Milestones, first group), cell count equals week count. Clean up: none.

### TC-002 [FE][MT] Verify the Key Milestones row is not shown on the Edit Plan screen (NEG) [Auto]
Precondition: common, User A has Edit Plan permission
Priority: Medium
Trace: AC-1.1
1. Click `Edit Plan` on the Timeline tab. -> The page `Edit Shutdown Timeline Plan` opens.
2. Look under the table header rows. -> No `Key Milestones` row is shown; the first row is the first activity group.
3. Hover over a weekly cell of the first row. -> No `+` button appears.
Automation: What to check: no element of the Key Milestones row on the Edit Plan page. Clean up: none.

### TC-003 [FE][MT] Verify the + button appears on hover over an empty cell for a user with Update Progress and Note (POS) [Auto]
Precondition: common, User A logged in
Priority: High
Trace: AC-1.2
1. Move the mouse away from the Key Milestones row. -> No `+` button is shown in any cell.
2. Hover over an empty weekly cell of the Key Milestones row. -> A `+` button appears in the centre of that cell.
3. Move the mouse to another empty cell. -> The `+` button leaves the first cell and appears in the second cell.
4. Single-click the `+` button. -> The `Add Note` modal opens.
Automation: What to check: + visible only under hover, one at a time, modal title `Add Note`. Clean up: close the modal.

### TC-004 [FE][MT] Verify a view-only user does not get the + button or the Add Note modal (NEG) [Auto]
Precondition: common, User B (Job Owner, View Timeline only) logged in
Priority: High
Trace: AC-1.2, AC-6
1. Open the Timeline tab. -> The Key Milestones row is shown.
2. Hover over an empty weekly cell of the Key Milestones row. -> No `+` button appears.
3. Click in the centre of the empty cell. -> No modal opens.
4. Double-click in the centre of the empty cell. -> No modal opens.
Automation: What to check: no + element, no dialog. Test data set: roles table (TM, JO). Clean up: none.

### TC-005 [FE][MT] Verify a saved note shows the chosen icon in the chosen colour (POS) [Auto]
Precondition: common, a note with icon Flag, colour 5th swatch exists in the first week
Priority: High
Trace: AC-1.3
1. Look at the first week cell of the Key Milestones row. -> The Flag icon is shown, in the colour that was chosen.
2. Look at the cell next to it. -> The cell is empty.
Automation: Starting data: note created by the test through the modal. What to check: icon name and colour value. Clean up: delete the note.

### TC-006 [FE][MT] Verify hovering an existing note shows its text in a tooltip, for every user (POS) [Auto]
Precondition: common, a note with text `Permit review` exists; test with User A, then User B
Priority: High
Trace: AC-1.3, AC-6
1. Hover over the note icon. -> A floating tooltip shows `Permit review`.
2. Move the mouse away. -> The tooltip closes.
3. Log in as User B and hover over the same icon. -> The tooltip shows `Permit review`.
Automation: Test data set: roles (TM, JO). Clean up: delete the note.

### TC-007 [FE][MT] Verify double-click on a note opens Edit Note for a user with permission, and does nothing for a view-only user (NEG) [Auto]
Precondition: common, a note exists
Priority: High
Trace: AC-1.3, AC-6
1. As User A, double-click the note icon. -> The `Edit Note` modal opens.
2. Click `Cancel`. -> The modal closes.
3. Log in as User B and double-click the same note icon. -> No modal opens; the cell stays as it was.
4. Hover over the icon as User B. -> The tooltip still shows the note text.
Automation: What to check: dialog count 1 for TM, 0 for JO. Clean up: delete the note.

### TC-008 [FE][MT] Verify a note saved without text shows `No details.` in grey (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.3, AC-5
1. Hover over an empty cell and click `+`. -> The `Add Note` modal opens.
2. Leave `Note` empty and click `Save`. -> The modal closes; the cell shows the Calendar icon; toast `Save Success`.
3. Hover over the new icon. -> The tooltip shows `No details.` in grey text.
Automation: What to check: tooltip text and grey colour. Clean up: delete the note.

### TC-009 [FE][MT] Verify the modal title is `Add Note` for a new note and `Edit Note` for an existing one (POS) [Auto]
Precondition: common, one note exists, one empty cell exists
Priority: Medium
Trace: AC-2.1
1. Open the modal from an empty cell with `+`. -> The title is `Add Note`; the `Delete` button is not shown.
2. Click `Cancel`. -> The modal closes.
3. Double-click the existing note. -> The title is `Edit Note`; the `Delete` button is shown.
Automation: Clean up: delete the note.

### TC-010 [FE][MT] Verify the Add Note modal fields, default values and mandatory marks (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2, AC-4
1. Open `Add Note` from an empty cell. -> The modal shows `Icon *`, `Color *` with a red asterisk and `Note` without an asterisk.
2. Count the icons. -> 10 icons in one horizontal row: Calendar, Clock, Megaphone, People, Document, Flag, Star, Pin, Flame, Heart.
3. Check which icon is selected. -> Calendar (the first) is selected.
4. Count the colour swatches. -> 20 swatches in two rows.
5. Check which swatch is selected. -> The first swatch `#184C99` (dark blue) shows a white checkmark; no other swatch has one.
6. Check the Note input. -> Empty, placeholder `Note`, counter `0/50` at the top-right of the input.
Automation: What to check: icon order, 20 swatches, default selections, placeholder, counter text.

### TC-011 [FE][MT] Verify the selected icon and selected colour stay marked when the mouse is away (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.2
1. Open `Add Note`, click the Star icon. -> Star is marked as selected; Calendar is no longer marked.
2. Move the mouse outside the icon row. -> Star stays marked.
3. Click the 7th colour swatch and move the mouse away. -> The white checkmark stays on the 7th swatch only.
4. Click `Save`, then double-click the new note. -> The `Edit Note` modal shows Star marked and the 7th swatch with the checkmark, with the mouse away.
Automation: Clean up: delete the note.

### TC-012 [FE][MT] Verify every icon and every colour can be saved and shown on the cell (POS) [Auto]
Precondition: common, empty cells available
Priority: Medium
Trace: AC-2.2, AC-1.3
1. For each row of the expected-values table below, open `Add Note` on an empty cell, pick the icon and the colour, click `Save`. -> The cell shows that icon in that colour.
2. Delete the note after the check. -> The cell is empty again.

Expected-values table (the test loops over it; the full 10 icons are each paired with a different swatch, then the 20 swatches are each tried with the Calendar icon):
| Row | Icon | Colour swatch (position) | Expected on the cell |
|---|---|---|---|
| 1-10 | Calendar, Clock, Megaphone, People, Document, Flag, Star, Pin, Flame, Heart | swatch 1-10 in order | the chosen icon in the chosen colour |
| 11-30 | Calendar | swatch 1-20 | Calendar in the chosen colour |
Automation: Test data set: the table above. Clean up: delete each note. A manual look checks only that icons look right.

### TC-013 [FE][MT] Verify the Note counter and the 50 character limit (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2, AC-4
1. Open `Add Note` and type 49 characters. -> The counter shows `49/50`; all 49 characters are in the input.
2. Type the 50th character. -> The counter shows `50/50`.
3. Try to type a 51st character. -> Nothing is added; the counter stays `50/50`.
4. Delete 1 character. -> The counter shows `49/50`.
5. Click `Save`. -> The note is saved with 49 characters; the tooltip shows the same 49 characters.
Automation: Test data set: lengths 0, 1, 49, 50, 51. Clean up: delete the note.

### TC-014 [FE][MT] Verify the Note limit when pasting more than 50 characters (BND) [Auto]
Precondition: common, a text of 80 characters in the clipboard
Priority: Medium
Trace: AC-2.2
1. Open `Add Note` and paste the 80 character text. -> The input holds the first 50 characters; the counter shows `50/50`.
2. Click `Save` and hover over the note. -> The tooltip shows the same 50 characters.
Automation: Clean up: delete the note.

### TC-015 [FE][MT] Verify strange text in Note is saved and shown back as typed (Exotic: strange input) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2.2, AC-1.3
1. For each row of the table, open `Add Note`, type the value, click `Save`, hover over the icon. -> The tooltip shows the expected result and the page does not break.
2. Delete the note. -> The cell is empty.

| Value | Expected tooltip |
|---|---|
| `ตรวจใบอนุญาต` (Thai) | `ตรวจใบอนุญาต` |
| `<b>x</b> & "q" 100%` | exactly that text, not formatted |
| three emoji in a row | the same three emoji (counter counts them as the typed length) |
| `   ` (spaces only) | `No details.` (open question 4) |
| `  Permit  ` (spaces around) | `Permit` with the spaces not visible at the edges (open question 4) |
Automation: Test data set: the table. Clean up: delete each note. Spaces rows are Manual until question 4 is answered.

### TC-016 [FE][MT] Verify pasting multi-line text into Note keeps one line (Exotic: paste) [Manual: needs the real clipboard from Word or Excel]
Precondition: common, text with 2 lines copied from a document
Priority: Low
Trace: AC-2.2
1. Open `Add Note` and paste the 2 line text. -> The input shows one line only; no new line is created; counter matches the visible text.
2. Click `Save`. -> The note is saved; the tooltip shows one line.

### TC-017 [FE][MT] Verify Cancel closes the modal without changing the cell (NEG) [Auto]
Precondition: common, one note (Flag, text `Permit review`) exists
Priority: High
Trace: AC-2.3
1. Open `Add Note` on an empty cell, pick Star, type `Temp`, click `Cancel`. -> The modal closes; the cell stays empty; no toast.
2. Double-click the existing note, change the icon to Heart and the text to `Changed`, click `Cancel`. -> The modal closes; the cell still shows Flag; the tooltip still shows `Permit review`.
3. Reload the page. -> The same state: first cell empty, note unchanged.
4. Hover over the empty cell, click `+`. -> `Add Note` opens with the defaults: Calendar, the first swatch `#184C99`, empty Note with counter `0/50` (not Star and `Temp`).
5. Click `Cancel`, double-click the existing note. -> `Edit Note` opens with Flag and `Permit review` (not Heart and `Changed`).
Automation: Clean up: delete the note.

### TC-018 [FE][BE][MT] Verify Save in Add Note stores the note, closes the modal and shows a success toast (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3, AC-3.1
1. Hover over an empty cell, click `+`, choose Megaphone, the 3rd swatch, type `Crane arrives`. -> The modal shows the chosen values and counter `13/50`.
2. Click `Save`. -> The modal closes; the cell shows the Megaphone icon in the 3rd swatch colour; toast: title `Save Success`, message `Save Note Successfully.`
3. Hover over the icon. -> The tooltip shows `Crane arrives`.
4. Hover over another empty cell, click `+`. -> `Add Note` opens with the defaults: Calendar, the first swatch `#184C99`, empty Note with counter `0/50` (not Megaphone, the 3rd swatch or `Crane arrives`).
5. Click `Cancel`. -> The modal closes; the cell stays empty.
Automation: What to check: wait for the save response, then check the cell, toast and tooltip; API returns the same week, icon, colour, note. Clean up: delete the note.

### TC-019 [FE][MT] Verify Add Note on the first and the last week of the grid (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.2, AC-2.3
1. Add a note in the first week cell. -> The note shows in the first week; toast `Save Success`.
2. Add a note in the last week cell. -> The note shows in the last week; toast `Save Success`.
3. Reload the page. -> Both notes are still in their own weeks.
Automation: Clean up: delete both notes.

### TC-020 [FE][BE][MT] Verify Save in Edit Note updates icon, colour and text (POS) [Auto]
Precondition: common, a note (Calendar, `#184C99`, `Permit review`) exists
Priority: High
Trace: AC-2.3, AC-3.1
1. Double-click the note. -> `Edit Note` opens with Calendar, the first swatch and `Permit review` filled in; counter `13/50`.
2. Change the icon to Flame, the colour to the 12th swatch, the text to `Permit approved`. -> The modal shows the new values.
3. Click `Save`. -> The modal closes; the cell shows Flame in the 12th swatch colour; toast: title `Edit Success`, message `Edit Note Successfully.`
4. Hover over the icon. -> The tooltip shows `Permit approved`.
5. Reload the page. -> The cell and the tooltip still show the edited values.
Automation: What to check: response then UI; API values. Clean up: delete the note.

### TC-021 [FE][MT] Verify Edit Note can clear the text and the tooltip becomes `No details.` (POS) [Auto]
Precondition: common, a note with text `Permit review` exists
Priority: Medium
Trace: AC-2.3, AC-4, AC-1.3
1. Double-click the note, delete all the text. -> The counter shows `0/50`.
2. Click `Save`. -> Toast `Edit Success`; the icon stays.
3. Hover over the icon. -> The tooltip shows `No details.` in grey.
Automation: Clean up: delete the note.

### TC-022 [FE][MT] Verify Delete in Edit Note shows the confirmation, and Delete removes the note (POS) [Auto]
Precondition: common, a note exists
Priority: High
Trace: AC-2.3, AC-3.1, AC-5
1. Double-click the note, click `Delete`. -> A confirmation modal shows: title `Delete Note`, message `Are you sure you want to delete the selected note?`, buttons `Delete` and `Cancel`.
2. Click `Delete` in the confirmation. -> Both modals close; the cell is empty; toast: title `Delete Success`, message `Delete Note Successfully.`
3. Hover over the empty cell. -> The `+` button appears.
4. Reload the page. -> The cell is still empty.
Automation: What to check: API shows the record is gone. Clean up: none.

### TC-023 [FE][MT] Verify Cancel in the delete confirmation keeps the note (NEG) [Auto]
Precondition: common, a note exists
Priority: High
Trace: AC-2.3
1. Double-click the note, click `Delete`. -> The confirmation modal shows.
2. Click `Cancel` in the confirmation. -> The confirmation closes; no toast; the `Edit Note` modal is still open (open question 8).
3. Click `Cancel` in the Edit Note modal. -> The modal closes; the note is still in the cell and the tooltip is unchanged.
Automation: Clean up: delete the note.

### TC-024 [FE][MT] Verify deleting the last remaining note returns the whole row to the empty + state (POS) [Auto]
Precondition: common, exactly two notes exist
Priority: Medium
Trace: AC-5, AC-2.3
1. Delete the first note through Edit Note and confirm. -> Its cell is empty; the second note stays.
2. Delete the second note the same way. -> All cells of the row are empty.
3. Hover over each of two former note cells. -> The `+` button appears in each.
Automation: Clean up: none.

### TC-025 [FE][BE][MT] Verify a failed Save in Add Note shows the Save Failed toast and no note appears (NEG) [Partial: needs a forced API failure (network block)]
Precondition: common, the save request can be blocked (offline or blocked URL)
Priority: High
Trace: AC-2.3
1. Open `Add Note`, type `Offline test`. -> The modal shows the text.
2. Block the network, click `Save`. -> Toast: title `Save Failed`, message `Save Note Failed.`; the cell stays empty; the modal stays open with the typed text (open question 6).
3. Restore the network and reload. -> No note exists in that week.

### TC-026 [FE][BE][MT] Verify a failed Save in Edit Note shows the Edit Failed toast and keeps the old values (NEG) [Partial: needs a forced API failure]
Precondition: common, a note (Flag, `Permit review`) exists, the save request can be blocked
Priority: High
Trace: AC-2.3
1. Double-click the note, change the text to `Changed`. -> The modal shows `Changed`.
2. Block the network, click `Save`. -> Toast: title `Edit Failed`, message `Edit Note Failed.`; the cell still shows the Flag icon.
3. Restore the network, reload and hover. -> The tooltip shows `Permit review`.

### TC-027 [FE][BE][MT] Verify a failed Delete shows the Delete Failed toast and keeps the note (NEG) [Partial: needs a forced API failure]
Precondition: common, a note exists, the delete request can be blocked
Priority: High
Trace: AC-2.3
1. Double-click the note, click `Delete`, block the network, click `Delete` in the confirmation. -> Toast: title `Delete Failed`, message `Delete Note Failed.`; the note icon is still in the cell.
2. Restore the network and reload. -> The note is still there with the same text.

### TC-028 [FE][BE][MT] Verify a saved note survives reload, leaving the tab and coming back (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1
1. Add a note (Pin, 8th swatch, `Crane arrives`). -> The note shows on the cell.
2. Reload the page. -> The same icon, colour and tooltip text.
3. Go to the tab `Planning`, then back to `Timeline`. -> The note is still the same.
4. Open the Shutdown Event List, open the same event again. -> The note is still the same.
Automation: Clean up: delete the note.

### TC-029 [FE][MT] Verify a note saved by one user is visible to another user at once after reload (POS) [Auto]
Precondition: common, two sessions (User A and User B) on the same event
Priority: Medium
Trace: AC-3.1, AC-6
1. User A adds a note `Crane arrives`. -> Toast `Save Success` for User A.
2. User B reloads the Timeline tab. -> User B sees the icon and the tooltip `Crane arrives`, without anyone pressing `Update Progress`.
Automation: two browser contexts. Clean up: delete the note.

### TC-030 [FE][MT] Verify notes do not enable Update Progress and do not mark the page changed (NEG) [Auto]
Precondition: common, `Update Progress` is disabled (no unsaved change)
Priority: High
Trace: AC-3.2, AC-3.3
1. Add a note and save. -> Toast `Save Success`; `Update Progress` stays disabled.
2. Edit the note and save. -> Toast `Edit Success`; `Update Progress` stays disabled.
3. Delete the note and confirm. -> Toast `Delete Success`; `Update Progress` stays disabled.
Automation: What to check: button disabled after each step. Clean up: none.

### TC-031 [FE][BE][MT] Verify saving a note does not save a pending progress change, and Update Progress does not undo notes (POS) [Auto]
Precondition: common, event with an editable Actual (%) cell
Priority: High
Trace: AC-3.2, AC-3.3
1. Type a new Actual (%) value in a cell, do not click `Update Progress`. -> `Update Progress` becomes enabled.
2. Add a note and click `Save`. -> Toast `Save Success`; `Update Progress` stays enabled; the typed Actual (%) is still shown.
3. Type the old Actual (%) value back into the same cell by hand. -> The cell shows the old value; `Update Progress` becomes disabled again (nothing left to save).
4. Type the new Actual (%) value again, save a second note in another week. -> Toast `Save Success`; `Update Progress` is enabled and the typed value is still shown.
5. Click the breadcrumb `Shutdown Event List`. -> The unsaved-changes alert for the progress still appears (the note save did not clear it); choose to stay on the page.
6. Reload the page without saving. -> Both notes are still there; the Actual (%) is back to its old value (the progress was not saved by the note).
7. Type the Actual (%) again and click `Update Progress`. -> The progress is saved; both notes stay in their cells.
Automation: Starting data: card-owned event. Clean up: restore Actual (%), delete the note.

### TC-032 [FE][MT] Verify leaving the Timeline page after saving a note shows no unsaved-changes alert (NEG) [Auto]
Precondition: common, no pending progress change
Priority: Medium
Trace: AC-3.4
1. Add a note and save it. -> Toast `Save Success`.
2. Click the breadcrumb `Shutdown Event List`. -> The list opens at once; no unsaved-changes alert.
3. Open the event and Timeline again, delete the note, then press the browser Back. -> No alert; the previous page opens.
Automation: Clean up: delete the note if left.

### TC-033 [FE][BE][MT] Verify a note is deleted without warning when Edit Plan dates shrink the grid so its week is outside (POS) [Partial: grid size depends on plan dates, needs card-owned event]
Precondition: common, User A with Edit Plan, own event; the last week of the grid exists only because of the last activity End Date; a note exists in that last week; another note exists in a middle week
Priority: High
Trace: AC-3.5
1. Record the Grid End week and the notes' weeks. -> The values are written down for comparison.
2. Edit Plan, move the End Date of the last activity to a date inside an earlier week, click `Save`. -> Edit Plan saves; no modal or warning about notes appears.
3. Open the Timeline. -> The grid ends at an earlier week; the note of the removed last week is gone; the middle note is still there.
4. Reload. -> Same result.
5. (Check) Go back and extend the dates to the old End Date. -> The deleted note does not come back; the week cell is empty.

### TC-034 [FE][BE][MT] Verify a note on the edge week that stays inside the new grid is kept (BND) [Partial: grid size depends on plan dates]
Precondition: common, own event; a note in the last week of the grid
Priority: High
Trace: AC-3.5
1. In Edit Plan, change the last End Date by a few days inside the same week, click `Save`. -> Save completes; no warning.
2. Open the Timeline. -> The grid End week is the same; the note in that week is still there.

### TC-035 [FE][BE][MT] Verify a note is deleted when Shutdown Type change moves the grid bounds (POS) [Manual: result depends on the type seed dates of the event]
Precondition: common, own event, a note in the week that only exists in the current type's grid
Priority: Medium
Trace: AC-3.5
1. Record Grid Start week, Grid End week and the note's week. -> The values are written down.
2. In Edit Plan change the Shutdown Type, click `Confirm` in `Change Shutdown Size?`, then click `Save`. -> The plan saves; no modal about notes.
3. Open the Timeline and compare with the recorded weeks. -> If the note's week is outside the new grid, the note is gone; if it is inside, it is still there.

### TC-036 [FE][BE][MT] Verify deleting Actual (%) of outer weeks and clicking Update Progress deletes notes that fall outside, and all out-of-range notes leave the row empty (POS) [Manual: needs careful card-owned data; shrink depends on Actual weeks]
Precondition: common, own event; an outer week exists in the grid only because of an Actual (%) value; a note exists in that outer week and in no other week
Priority: Medium
Trace: AC-3.5, AC-5
1. Record the grid weeks and the note's week. -> The values are written down.
2. Delete the Actual (%) of that outer week and click `Update Progress`. -> The progress saves; no modal about notes.
3. Look at the Key Milestones row. -> The grid is shorter; the note is gone; every cell of the row is empty.
4. Hover over a cell. -> The `+` button appears.
5. Before step 2, try the same with a note inside the remaining weeks (another event). -> That note stays.

### TC-037 [FE][MT] Verify first-time state: an event that never had notes shows an empty row (POS) [Auto]
Precondition: common, event with no notes ever saved
Priority: Low
Trace: AC-5
1. Open the Timeline tab. -> All cells of the Key Milestones row are empty, with no icons.
2. Hover over any cell. -> The `+` button appears (User A).
Automation: Clean up: none.

### TC-038 [FE][MT] Verify a user without View Timeline permission cannot see the row or notes by direct link (NEG) [Manual: needs an account without View Timeline, the team has only TM and JO; see open question]
Precondition: an account without View Timeline (not available on QA)
Priority: Low
Trace: AC-6
1. Open the Timeline link of the event with that account. -> The Timeline is not shown (access denied); no notes are visible.

### TC-039 [FE][MT] Verify notes do not appear or change in Shutdown Logic and Equipment Mob Plan (NEG) [Auto]
Precondition: common, one note exists
Priority: High
Trace: AC-7
1. Record what Shutdown Logic shows for the event (annotations). -> The values are written down.
2. Add, edit and delete a note on the Timeline. -> Each action shows its success toast.
3. Open `Shutdown Logic`. -> It shows exactly what was recorded; no milestone icon or note.
4. Open `Equipment Mob Plan` (Manpower Resource tab). -> No milestone icon or note; its annotations are unchanged.
Automation: Clean up: none.

### TC-040 [FE][BE][MT] Verify double-clicking Save or + does not make two notes (Exotic: double click) [Auto]
Precondition: common
Priority: High
Trace: AC-2.3, AC-1.2
1. Double-click the `+` button. -> One `Add Note` modal opens, not two.
2. Type `Once`, double-click `Save` quickly. -> The modal closes; one note is in the cell; one success toast.
3. Reload. -> Exactly one note in that week.
Automation: What to check: API returns one record for the week. Clean up: delete the note.

### TC-041 [FE][BE][MT] Verify two users on the same week: add, edit and delete at the same time (Exotic: two users) [Manual: two people needed, outcome not defined in Story]
Precondition: common, User A and User B both TM, same event, same empty week
Priority: Medium
Trace: AC-3.1
1. Both open `Add Note` in the same empty week; User A saves `From A`. -> User A sees the note and `Save Success`.
2. User B clicks `Save` with `From B`. -> One clear result: either one note shows (last write) or a clear failure toast; never two notes in the week. Record the actual behaviour as a question to the BA.
3. User A deletes the note while User B has Edit Note open, User B clicks `Save`. -> User B gets `Edit Failed` or a clear message; no ghost note appears after reload.

### TC-042 [FE][MT] Verify the modal can be used with the keyboard (Tab, Enter, Esc) (Exotic: keyboard) [Manual: focus order judged by a person]
Precondition: common
Priority: Low
Trace: AC-2.2, AC-2.3
1. Open `Add Note`, press Tab repeatedly. -> The focus moves through icons, colours, Note, `Cancel`, `Save` in a logical order and never leaves the modal.
2. Type `Key test` in Note and press Enter. -> The note is saved (or Enter does nothing); record the result.
3. Open the modal again and press Esc. -> The modal closes without a change, or stays open; record the result (open question 5).

### TC-043 [FE][MT] Verify a view-only user leaving the Timeline after viewing notes gets no alert (NEG) [Auto]
Precondition: common, one note exists, logged in as User B (Job Owner)
Priority: Medium
Trace: AC-3.4, AC-6
1. Hover over the note icon. -> The tooltip shows the note text.
2. Click the breadcrumb `Shutdown Event List`. -> The list opens at once; no unsaved-changes alert.
3. Open the event and the Timeline again, press the browser Back. -> No alert; the previous page opens.
Automation: Clean up: none.

### TC-044 [FE][BE][MT] Verify opening Edit Plan and returning without saving keeps the notes (POS) [Auto]
Precondition: common, User A with Edit Plan, two notes exist
Priority: Medium
Trace: AC-1.1, AC-3.5
1. Click `Edit Plan`. -> The page `Edit Shutdown Timeline Plan` opens without the Key Milestones row.
2. Change an activity End Date, then leave without saving (`Cancel` or the browser Back). -> The Timeline opens (an unsaved-changes alert for the plan may appear: choose to leave).
3. Check the Key Milestones row. -> The Key Milestones row is shown again; both notes are in the same weeks with the same icons.
4. Reload the page. -> Both notes are still there.
Automation: Clean up: delete both notes.

### TC-045 [FE][MT] Verify leaving the page with the Add or Edit Note modal open and text typed saves nothing and shows no alert (NEG) [Auto]
Precondition: common, one note (`Permit review`) exists
Priority: Medium
Trace: AC-3.4, AC-2.3
1. Open `Add Note` on an empty cell, type `Not saved`, reload the page. -> The page reloads without an unsaved-changes alert; the cell is empty.
2. Open `Add Note` again, type `Not saved`, click the breadcrumb `Shutdown Event List`. -> The list opens; no alert.
3. Open the event and Timeline, double-click the existing note, change the text to `Changed`, press the browser Back. -> No alert; the previous page opens.
4. Open the Timeline again and hover over the existing note. -> The tooltip still shows `Permit review`; no note `Not saved` exists.
Automation: Clean up: delete the note.

### TC-046 [FE][MT] Verify a note can be added in a past week and in a middle week (BND) [Auto]
Precondition: common, the grid has at least one week before the current week (as the plan dates allow)
Priority: Medium
Trace: AC-1.2, AC-2.3
1. Hover over a week before the current week, click `+`, click `Save`. -> `Add Note` opens; toast `Save Success`; the icon shows in that week.
2. Add a note in a week in the middle of the grid. -> Toast `Save Success`; the icon shows in that week.
3. Reload the page. -> Both notes are in their own weeks.
Automation: Clean up: delete both notes.

### TC-047 [FE][MT] Verify hovering a week that already has a note does not show a second `+` (NEG) [Auto]
Precondition: common, one note exists
Priority: Medium
Trace: AC-1.2, AC-1.3
1. Hover over the cell with the note icon. -> The tooltip with the note text shows; no `+` button appears in that cell.
2. Hover over an empty cell next to it. -> The `+` button appears there only.
Automation: Clean up: delete the note.

### TC-048 [FE][MT] Verify pasting in the middle, at the end and over a selection of existing Note text keeps the 50 limit (BND) [Auto]
Precondition: common, a note with the text `Permit review` (13 characters) exists
Priority: Medium
Trace: AC-2.2
1. Open `Edit Note`, put the cursor after `Permit`, paste a 45-character text. -> The input keeps only 50 characters in total; counter `50/50`; no error.
2. Clear the input, type 40 characters, paste a 20-character text at the end. -> The input shows 50 characters; counter `50/50`.
3. Select 10 characters of the text, paste a 5-character text over the selection. -> The selection is replaced; counter shows the new length (45/50 when 50 were there before).
Automation: What to check: input value length and counter after each paste. Clean up: click `Cancel`, delete the note.

### TC-049 [FE][MT] Verify the Key Milestones cells stay aligned with the week headers after horizontal scroll (NEG) [Manual: alignment judged by a person on screen]
Precondition: common, a grid wider than the screen, a note in the last week
Priority: Low
Trace: AC-1.1, AC-1.2
1. Scroll the Timeline to the right until the last week shows. -> The Key Milestones cells line up with the week headers; the last week cell is not cut off.
2. Hover over an empty cell in the last weeks, click `+`. -> The `+` button shows in the centre of the cell; `Add Note` opens.
3. Hover over the note icon in the last week. -> The tooltip shows the note text and is not cut off.

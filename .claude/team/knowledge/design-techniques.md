# Design techniques

Use these in Step 4 (Coverage Map). Write the technique name next to each
row so the Reviewer can see why a case exists.

## Edge values (boundary)
For any limit (length, amount, count, date range, percent):
- exactly on the limit
- one step below
- one step above
- the smallest and the largest allowed
- zero, empty, and negative where they make sense

## Input groups (equivalence)
Split inputs into groups that should behave the same: valid, invalid,
empty, wrong type. Test one or two from each group, not every value.

## Condition table (decision table)
When the result depends on several conditions:
1. List every condition and every possible result.
2. Make a table of all combinations.
3. Remove combinations that cannot happen (write why).
4. Every remaining row is one expected result.

## State changes
When something moves through statuses (draft, submitted, approved, closed):
- every allowed change
- every change that must be blocked
- going back, and repeating the same change twice
- what each status allows the user to do (edit, delete, view only)

## Unsaved changes (dirty state)
When an action can make the page "changed" (enables Save or Update, or shows an
"unsaved" warning on leaving), follow it to the end for every role:
- the action, then undo it by hand (type then delete, tick then untick, drag then
  drag back): is the page back to "not changed" (button disabled again)?
- the action, then leave the page (breadcrumb, menu, tab, Back): is the warning
  shown only when there is something to save? A role that cannot save must
  never get it.
- a view-only action (collapse, sort, scroll, splitter) on a page that keeps no
  view state must never count as a change.

## Leaving and coming back
When a state must survive (filter, selection, scroll, collapse) or must be reset
(a screen that always opens fresh), test each way the user really leaves and
returns, not only one: reload, browser Back, the breadcrumb, in-app links or
tabs, opening a detail or edit page and returning from it. Also set the state on
one screen and open the related screen that must ignore it.

## Roles and permission
For every role: can open, can see, can change, can delete, cannot do. Also
test a role that has no access trying a direct link.

## Error guessing (experience)
Think where it usually breaks: first and last item, empty list, one item only,
very long text, duplicate data, double click, Back and Refresh, slow
connection, expired login, two tabs, two users. Use `lessons-learned.md`.

## Real-user view
Pick a real user type (new, in a hurry, careless, on a phone, uses the
keyboard only). Write at least one case for how that person would really use
it, not how it was designed to be used.
Keyboard use is implied by every screen with inputs: write a case for Tab and
Enter order between the fields the user fills in one go (for example the cells of one row). It is not a "Suggestion (not in Story)", unless the module notes say keyboard
use is not wanted for that screen.

## Screen states
For every screen: normal, empty, loading, error, disabled, read-only, no
permission, too much data, too little data.

## Combinations
When many options can be chosen together, do not test every combination.
Pick: each option alone, all together, and the pairs most likely to clash.

## Field interaction
For every field the Story adds or changes (text, number, date, dropdown, grid
cell), walk this list. Write a case for each group that applies, or one line
in the Coverage Map saying why the group does not apply to this field.
- Typing: replace the whole value; edit in the middle (delete one character,
  the cursor stays where it was); select part of the text and type over it;
  type a value in the wrong format.
- Deleting: Backspace and Delete at the start, middle and end; delete
  everything; the clear (×) button, if the field has one.
- Pasting: a value in the right format, a value in the wrong format, a value
  with spaces before and after it.
- Date picker: open it (click or double-click, as the screen does), pick a
  date, close it without picking (the old value stays).
- Keyboard: Tab to the next field, Enter, Esc (cancels the edit), Ctrl+Z.
- After entry: click somewhere else, Save, then Refresh: the saved value is
  still right.

## Grid and input habits (not written in the Story)
Users expect these from every editable table or input screen even when the
Story is silent. For each one, write a case or one short reason it does not
apply. The expected result is what the rest of the product does (check a
similar screen in the module docs); if unknown, write the user's view and add a
question.
- Numbers: how a large value is shown (thousands separator, decimals) after
  leaving the cell; the same as other number columns of the product.
- Lists and dropdowns: typing in a long list filters it, like other dropdowns
  of the product; a list opens in every row, also the last rows near the bottom
  of the screen and after scrolling.
- Date pickers: the month it opens on when the cell is empty (the date that
  matters here, such as the event or plan start, not today) and when it has a
  date (that date).
- Editing inside a cell: paste with the cursor in the middle or at the end
  inserts there and keeps the rest; paste on a selected cell replaces it.
- Two panels or frozen columns: scrolling, adding a row (auto-scroll) and
  resizing keep both sides on the same rows; a widened column keeps its
  alignment rule.
- Someone else changes or deletes the object while it is open (second tab or
  user): the next Save, Export or edit shows the proper message.
- Strange input in EVERY free-text field the Story adds or shows (names,
  codes and numbers such as WIN#, not only Remark): special characters
  (\ / : * ? " < > | & # % '), leading and trailing spaces, a very long
  value, Thai and emoji, a value that looks like HTML. Check the field, the
  saved value after reload, and every place it is shown or exported. One
  field tested does not prove the others (defect exam ETM-7860, 2026-11-25:
  special characters were tried in Remark and Department only, the bug was in
  WIN#). Use only values the screen lets the user type.

## Effects and their reverse (finish the flow)
A case often sets up the effect and stops: the note is gone, the new value is
listed, the filter result looks right. Bugs live in the second half. For each
rule of the Story:
- "When Y happens, X is removed / hidden / deleted / reset": for EACH trigger
  Y the Story names (not only the first), do Y, then undo Y (extend back,
  re-check, change the value back, restore the range) and check X stays as the
  rule says. "X is not shown" right after Y passes even when X was only hidden.
- "The list shows values that exist / new values appear": create or change the
  value from every place that can make it (this page, other pages such as the
  Worklist or Event Details, import), then check this list.
- "Filters / conditions combine (AND)": the control under test with each other
  kind of control at least once (list, text, number, date range, toggles), and
  a combination that leaves nothing under a parent row.
- Save on an edit page: after Save and reload, every value the user did not
  touch is unchanged, dates and times included (no day shift).
- A value shown on more than one screen (a status, name, date, count or total
  that also appears on a list, an edit or detail page, a header, a popup, a
  report or an export): after each change of that value, open EVERY screen
  that shows it and check the exact text there, not only the screen where it
  was changed. A rule tested on one screen does not prove the others (defect
  exam ETM-8370, 2026-11-25: the Status was right on the list but wrong on
  Edit Plan, and no case opened Edit Plan to read it).
- A column or field with a fixed list of values (Yes/No, a status, a type, a
  priority) that is shown somewhere else (an export, a report, a detail page):
  set it to each value of the list, or at least to every non-default value,
  then read it in every place it is shown. A row that is empty or left at the
  default does not prove the mapping (defect exam ETM-6890, 2026-11-25: Hot
  Bed was read only on an empty row; the export wrote `N` instead of `No`).
- A case that checks an error or validation message for one cell or field
  also says that no other message is shown for that cell (the number of
  messages, or "only this message"). "The message is shown" passes when two
  or three messages pile up on the same cell (defect exam ETM-7450 / ETM-7456,
  2026-11-25: a blank mandatory cell and text in a number field each got
  extra messages).
- An export, a PDF, a report or a second screen built from a source screen:
  check it holds the same rows as the source (every row, none extra, none
  empty) in the same order as the source shows them, with data large enough
  to cross any page or batch size (several pages of a PDF, thousands of
  rows in a file). Checking one row, or the hierarchy only, passes when rows
  are missing, empty or re-ordered (defect exams ETM-7272 / ETM-7352 /
  ETM-7281, 2026-11-25: Work order differed from the page; a PDF page had no
  task rows; dropdowns stopped after row 3,000).
- A control or behaviour shared by several pages (the selected cell of an
  editable table, a date picker, a filter panel, a toolbar button): put the
  same action on each page in one case and check it looks and acts the same
  on each (defect exam ETM-7294, 2026-11-25: the selected-cell style differed
  on four pages).

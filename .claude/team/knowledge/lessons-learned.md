# Lessons learned (experience checklist)

Go through all 9 categories, and every lesson added in section 10, for every Story. For each one write: relevant,
or not relevant with one short reason. Never skip silently.

Contents:
1. Two people use the same thing at once
2. Filter + Sort + Search together
3. Old data after many migrations
4. Strange input
5. Reordering a list changes calculations
6. Linked data (add, edit, delete)
7. Charts that depend on each other
8. Same data shown on many pages
9. Matrix calculations with special conditions
10. Add new lessons here

---

## 1. Two people use the same thing at once

Real problem: two users press the same button or edit the same record at the
same time.

Check:
- Who gets it? The result must be one clear winner.
- The other person sees a message they can understand.
- No duplicate data. Nothing overwritten without warning.
- A page left open on another screen updates, or warns the user, when the
  data has changed.

Test ideas: same record edited by two users; both press Save at the same
moment; one deletes while the other edits; one approves while the other
rejects.

Automation: use two browser contexts (two separate users) in one test.

## 2. Filter + Sort + Search together

Real problem: each works alone, but they break when used together.

Check:
- Use all three together, in different orders (search then filter, filter then
  sort, sort then search).
- Results are correct, the count is correct, and the list is not empty
  without a reason.
- Changing page, clearing one condition, or reloading: the other conditions
  stay or reset exactly as designed.
- Sort order stays correct after a filter changes the list.
- Search works with filter on, and with strange text (see category 4).

Automation: data-driven test over combinations. Compare shown results with
the expected list from a known data set.

## 3. Old data after many migrations

Real problem: the data still exists, but it is in the wrong place.

Check:
- Old records still open and can be used.
- Data is in the correct field and the correct relationship, not only
  "still there".
- Compare what the screen shows with the value in the database, for both old
  and new records.
- Old records work in every feature that new records work in (edit, search,
  filter, export, charts).
- Empty or missing values in old records show properly and do not crash
  anything.

Test ideas: pick records from each migration round (oldest, middle, newest)
and run the same checks on each.

## 4. Strange input

Real problem: people paste and type things nobody planned for.

Try in every text field:
- Emoji, and several emoji in a row
- Letters from other languages (Thai, English, Chinese, Arabic)
- Special characters: quotes, slashes, angle brackets, percent, ampersand
- Very long text (past the limit by one, and far past it)
- Spaces only, spaces before and after, new lines
- Pasting content copied from Word, Excel or a web page
- Pasting a picture or file into a text field

Check: it saves or shows a clear message, it shows back exactly as typed, it
does not break the page, and search can find it.

Automation: one data set of strange values, looped through every field.

## 5. Reordering a list changes calculations

Real problem: changing the order of rows changes a total, a chart, or a graph.

Check:
- Move rows up and down, then check totals, calculated values, and charts.
- The result is the same when the rule says order does not matter, and
  different only when the rule says it does.
- Charts and graphs follow the right row after a move (no wrong row, no
  wrong order).
- Move the first row, the last row, and a middle row.

## 6. Linked data (add, edit, delete)

Real problem: data linked to other data changes, or fails to change, on other
pages.

Check:
- After add, edit or delete at the source, open every page that uses it.
  Values change where they should and stay the same where they should not.
- No leftover data and no link that points to something deleted.
- Delete something that is still used elsewhere: the system blocks it or
  handles it exactly as designed, with a clear message.
- Condition-based links: test when the condition is true, false, and just at
  the edge.

## 7. Charts that depend on each other

Real problem: a change in one chart does not reach the others, or reaches the
wrong ones.

Check:
- Change data or a filter in one chart. Related charts change correctly.
  Unrelated charts do not change.
- Totals and details match (a total in one chart equals the sum in another).
- No data, very little data, and very much data all show correctly.
- Change the time range or switch filters many times in a row: the final
  result does not hold old values.

## 8. Same data shown on many pages

Real problem: one piece of data appears on many pages, and the pages
disagree.

Check:
- Compare the same value on every page that shows it (name, amount, status,
  date).
- Change it on one page, then open the others: do they update, or show the
  old value?
- Keep several pages open at the same time, change one, go back to the first.
- Pages with different data sources show the same format (date, number,
  decimal places).
- Slow or failed loading: the page does not show half-finished or mixed
  values.

## 9. Matrix calculations with special conditions

Real problem: many conditions lead to many results, and some combinations are
wrong.

Check:
- Make the condition table first: what should every cell be? Then compare
  every cell.
- Edge values: exactly on the border, just above, just below.
- Several conditions at once: which one wins, and does it match the design?
- No condition matches: what result appears?
- Change one source value at a time: only the cells that should change, change.
- Rounding and units are the same everywhere the result is shown.

Automation: keep the expected table as separate data. One test loops over
every row of the table.

## 10. Add new lessons here

Format for each new lesson:

- **What happened:**
- **Why it slipped through:**
- **What to check from now on:**
- **Project (if only for one):** the project name, or all

A lesson that holds for one project only goes to `profiles/<name>/knowledge/lessons-learned.md` (listed under "Knowledge" in the active project rules); designer and reviewer read that file with this one.

### Lessons for every project

**L-3 Search result read too early (a real defect, Nov 2026).**
- What happened: a test passed by reading the old rows before the search response came back, which hid a real search bug.
- What to check from now on: after a search or filter, wait for the response, then check the rows AND `Total Results`; also search with a filter on, and a filter with a search on.
- Project: all

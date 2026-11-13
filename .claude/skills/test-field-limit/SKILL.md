---
name: test-field-limit
description: Use when the user asks to test a text field's character limit on a web page, e.g. "ลอง remark หน่อยว่าใส่ได้กี่ตัว", "test max length of this field", "ใส่เกิน 500 แล้วเป็นยังไง", or asks to check a limit that was just increased.
---

# Test a field's character limit

Test a text input, textarea or editable grid cell on the page the user is looking at: confirm it accepts the stated limit, and find out what happens past it. Report as a QA finding, in Thai, with plain everyday words.

This drives the user's browser (Claude in Chrome). The user asking for it is the permission to open the page; never save anything (step 10).

## Before you start

- **List the fields.** The user often names more than one (e.g. "Description 100→200 and Activity Group 30→200"). Test them one at a time, in the order given, and report each separately. Say which row or record you used.
- **Screenshot every step.** Take a full-page screenshot after each action: opening the editor, at the limit, over the limit, after paste. The user usually wants the visual trail, not just the numbers.

## Steps

1. **Find the field.** Use `find` with the field label (e.g. "Remark input"). Take a screenshot to see the surrounding form: the page title, section headings and nearby fields tell you what the system is about. You need that context for step 4.
2. **Open the editor if the field is a grid cell.** In a data grid (Bryntum `b-grid-cell`, AG Grid, etc.) there is **no** `input` in the DOM until the cell is in edit mode; a single click only selects it. Double-click the cell, then re-check for the input. Look for an empty or flagged row (a pink/invalid row is usually the safe one to type into). If a cell will not open, it may be read-only: say so instead of forcing it.
3. **Check the attributes first.** Run a small script over the visible inputs to read `maxLength`, tag name, `readOnly`, `required` and any pattern. This tells you up front whether the limit is enforced in the browser or not. Do not tell the user the answer yet; still test it for real.
4. **Write test text that fits the system.** Do not use `aaaa...` or lorem ipsum unless the user asks for filler. Write realistic content in the domain of the form (a shutdown work order, a leave request, a customer note: whatever the page is), then trim or pad it to exactly the limit. **Count it with a script, never by eye.** End it with a short marker like `END200X` so you can tell from a screenshot whether the tail survived.
5. **Type the text at exactly the limit.** Type it in **chunks of about 50 characters**: one very long `type` action can make the browser tool error out and lose the editor. Screenshot. Check any character counter reads N/N and the text was not cut.
6. **Try to go over.** Type about 20-30 more characters and screenshot. Note whether they go in, whether the counter changes, and whether any warning shows.
7. **Try pasting over the limit too.** Typing and pasting can behave differently, and two cases are worth separating: pasting **at the end** of a full field, and pasting a whole over-length value **over the entire field** (select all, then insert about 30 extra characters). Read the length back after each. Report if paste silently cuts the ending off.
8. **Read the value back** to confirm the real length and the last characters, so you are not trusting the screenshot alone.
9. **Restore the real test text** after a destructive paste probe, so what is left on screen is the meaningful text and not a row of `ZZZZ`.
10. **Stop before saving.** Never click Save, Submit, Confirm or Freeze. For a grid cell, press `Escape` to close the editor without committing; that is the clean way to move on to the next field. Tell the user which text is still in which field and that nothing was saved, and offer to clear it.

## Gotchas

- **Losing the row.** Scrolling the page can scroll the grid's own virtual list instead and jump hundreds of rows away, closing the editor. To get back, set `scrollTop = 0` on the grid's scroller element rather than scrolling by mouse ticks, then find the row again.
- **A failed browser action can leave focus somewhere else.** After any tool error, screenshot first and confirm the editor is still open before typing more.
- Batch clicks, typing and screenshots together where possible, but keep each typing chunk short.

## What to report

Per field:

- The `maxlength` found on the field, and the old limit it replaced
- The text used, and its exact length
- What happened at the limit (counter value, text kept or cut)
- What happened over the limit, for typing and for pasting separately
- Whether any error message or warning showed at all
- Why it behaves that way (e.g. the field has `maxlength`, so the browser blocks it before anything reaches the server)
- QA notes worth raising: a silent cut with no warning is a real UX finding, because a user pasting a long note will not know the ending was dropped. A missing character counter on a 200-character single-line field is worth raising too.
- What was not covered: the browser limit says nothing about the server. Mention that sending a longer value straight to the API is a separate test.

Close by saying which fields still hold test text and that nothing was saved.

## Style

Plain everyday words, the same as QA test case wording: "shows", "does not change", "nothing gets added" instead of "is rendered", "is persisted", "is rejected by the validator".

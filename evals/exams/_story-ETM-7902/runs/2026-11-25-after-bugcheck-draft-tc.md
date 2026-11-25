# Draft test cases - ETM-7902 Cross-Module Flexible Date and Time Input Auto-Conversion

Story: ETM-7902 [Improvement] Cross-Module - Flexible Date and Time Input Auto-Conversion
Source: story.md (description version of 2026-11-05 + the Sprint 25 grooming comment). No analyst.md, no inspector.md: AC ids below are numbered by the designer from the Story's own numbering (AC-1 = Trigger Lifecycle, AC-2 = Date-Only syntaxes, AC-3 = Date + Time syntaxes, AC-4 = Copy and Paste, AC-5 = Validation and fallback).
Existing [QA] subtasks: not read (no Jira in this exam).
Priority: the Story has none, so priority comes from damage if it breaks (wrong date saved = High).

## Common precondition
- Logged in as Turnaround Manager (TM) on QA.
- An Active plan with an editable table that has date fields (Shutdown Logic Task Start / End Date Time is the default test place; other modules are in the module cases).
- Browser language and Thai or English UI do not matter; server timezone is Asia/Bangkok (UTC+7).
- The page `Save` button is enabled only when something valid has changed (current rule in the Story: disabled while any cell is red).

## Notation
- `Auto` cases that loop use the expected-values tables at the end of the file; the test loops over every row.
- Cell = one date or date-time input in an editable table. "Commit" = move focus away (click outside or Tab) or press Enter.
- Canonical date-only: `DD Mmm YYYY` (example `05 Jun 2026`). Canonical date-time: `DD Mmm YYYY HH:mm` (example `05 Jun 2026 14:30`).

## Think like the user (3 lines)
1. TM and JO plan every day, type many dates quickly, often copy from Excel; they trust the result without re-reading it.
2. They want to type `5626` and get `05 Jun 2026`; they never want a wrong day or month saved silently.
3. A tired person types `31/02/2026`, `5.6.26`, 5 digits, 12:30 PM, clears the cell, pastes 20 rows, clicks twice, tabs instead of clicking.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1.1 Blur and Enter trigger | State change, error guessing | Conversion only on one trigger; Enter also submits/moves row | TC-001, TC-002 |
| AC-1.2 Trim spaces | Input groups | Leading/trailing spaces make a valid date invalid | TC-003 |
| AC-1.3 Converted value replaces raw input, marked dirty | Dirty state | Save stays disabled; or dirty when nothing changed | TC-004, TC-005 |
| AC-2.1 Day-first precedence | Edge values | Day and month swapped (6 May instead of 5 Jun) | TC-006, TC-007 |
| AC-2.2 Slash, hyphen, space delimiters, mixed digits | Input groups, data table | One delimiter family missed | TC-007 |
| AC-2.2 Compact formats 4, 6, 8 digits | Data table | Wrong split of digits | TC-008 |
| AC-2.3 Compact 6-digit precedence | Decision table | DMYYYY wins over DDMMYY when both valid | TC-009 |
| AC-2.4 Canonical output | Data table | Wrong month name or padding | TC-006, TC-007, TC-008 |
| AC-2.5 2-digit year 00..69 -> 2000..2069 | Edge values | 69 / 70 / 00 border | TC-010 |
| AC-3.1 24-hour formats (4 forms, comma or space separator) | Data table | A separator or time form missed | TC-011 |
| AC-3.2 12-hour AM / PM, case-insensitive, single-digit hour | Data table, edge values | 12 AM / 12 PM wrong; PM not added | TC-012, TC-013 |
| AC-3.3 Canonical date-time | Data table | Seconds, wrong padding | TC-011, TC-012 |
| AC-3.4 Date-only on date+time field -> 00:00 | State change | Time left blank or current time | TC-014 |
| AC-3 invalid time values | Edge values, input groups | 24:00, 25:00, 14:60, 13:00 PM accepted | TC-015 (NEG) |
| AC-4.1 Paste converts | Paste lesson L-4 | Pasted text not converted | TC-024, TC-025 |
| AC-4.2 Partial success | Paste lesson L-4 | All rows rejected, or invalid cell keeps old value | TC-026 |
| AC-5.1 Invalid -> blank + red | Input groups | Invalid date saved or kept | TC-016, TC-017, TC-018 |
| AC-5.2 Gantt bar unchanged | State change | Bar jumps to wrong date on invalid input | TC-019 |
| AC-5.3 Double-click pre-fills prior valid date | State change | Empty field or the invalid text shown | TC-020 |
| AC-5.4 Save guard | State change, dirty state | Save enabled with a red cell | TC-021 |
| AC-5.5 Clearing the cell | State change | Cleared cell saved as empty | TC-022 |
| Module coverage (Shutdown Logic, Daily Report, Manpower Mob, Equipment Mob, Shutdown Timeline) | Condition table | Feature works in one module only | TC-027 to TC-031 |
| Roles TM and JO | Roles and permission | JO can edit a view-only table | TC-032, TC-033 |
| Screen state: read-only / disabled cell | Roles | Conversion on a cell that cannot be edited | TC-033 |
| Screen state: many rows | Real-user view | Slow or wrong on a big paste | TC-025 |
| Strange input (lesson 4) | Error guessing | Emoji, Thai, newline, very long text break the cell | TC-023 |
| Save, reload, other pages show same date (lessons 6, 8) | Linked data | Stored value differs from shown value | TC-034 |
| Two users at once (lesson 1) | Error guessing | Other user sees old or raw text | TC-035 |
| Double click, Tab, Escape, Back midway | Error guessing | Value lost or half-converted | TC-036, TC-037 |
| Existing scheduling rules after conversion (dependency, date order) | Error guessing | Converted date bypasses existing rule | TC-038 |
| Timezone | Error guessing | Date shifts one day when browser is not UTC+7 | TC-039 |

### Categories (lessons-learned 1 to 9 and section 10)
- 1 Two people at once: relevant, TC-035.
- 2 Filter + Sort + Search: not relevant, the Story has no filter, sort or search change.
- 3 Old data after migrations: not relevant, no data migration in the Story.
- 4 Strange input: relevant, TC-023.
- 5 Reordering a list: not relevant, no reorder.
- 6 Linked data: relevant, TC-034, TC-038.
- 7 Charts depending on each other: relevant for the Gantt only, TC-019, TC-027.
- 8 Same data on many pages: relevant, TC-034.
- 9 Matrix with special conditions: relevant, expected-values tables (TC-007, TC-008, TC-009, TC-011, TC-012).
- Section 10: L-1 text sort and L-2 filter choice not relevant (no sort or filter); L-3 wait for response: applied in TC-034 (wait for save before reading); L-4 multi-row paste: TC-024, TC-025, TC-026; L-5 collapse levels: not relevant; L-6 same value different case: AM / am / Pm in TC-012; L-7 selected vs hover: not relevant; L-8 Story text changed in the sprint: applied, 2026-11-05 comment says AC 2 hyphen and space formats were corrected to `DD-MM-YY` and `DD MM YY`, covered by TC-007.
- Dirty state and leaving rules (design-techniques): TC-005, TC-021, TC-036, TC-037, TC-040 to TC-047.

## Counts
- High 21, Medium 21, Low 5 (47 cases).
- Auto 29, Partial 8, Manual 10.

## Open questions (return to lead, none answered)
Q1. 2-digit year 70..99: the Story only maps 00..69 to 2000..2069. What does `5/6/70` give: invalid (red), or 1970? (TC-010 expects what a user would call correct only for 00..69 and marks 70 as open.)
Q2. Date-only fields (Manpower Mob, Equipment Mob, Shutdown Timeline): if the user types a date with time (`5/6/26 14:30`), is it accepted with the time dropped, or invalid? The Story only lists date+time fields for Shutdown Logic and Daily Report. Which fields are date-only and which are date+time in each module?
Q3. Daily Report: AC-3 says Start/End Date accept time, but the pre-condition says "Daily Progress & Schedule Dates". Which Daily Report fields take time?
Q4. 4-digit compact `DMYY`: for input like `1212` is it `1 Feb 2012`? Any other split rule? How is a 4-digit input that is also a plain year or time treated?
Q5. 24-hour time with a single-digit hour and no AM/PM (`5/6/26 8:00`): accepted as 08:00 or invalid? The Story gives single-digit hours only for AM/PM.
Q6. 12-hour edge values: is `12:00 AM` = `00:00` and `12:30 PM` = `12:30`? Is `0:30 AM`, `13:00 PM` invalid (red)?
Q7. AM/PM with no space (`2:30pm`) or with dots (`p.m.`): supported or invalid?
Q8. Date with space delimiter followed by time with space (`5 6 26 14 30`): the string is ambiguous; supported, or invalid?
Q9. Comma without a space (`5/6/26,14:30`) or two spaces: supported?
Q10. Year range: is a 4-digit year such as `1999` or `2100` or `0000` accepted? Is there a minimum or maximum? Buddhist year (`2569`)?
Q11. Spaces only in a cell: is this "emptying" (red, blank) or ignored?
Q12. Does Escape cancel the edit and restore the previous value without conversion?
Q13. After conversion, existing rules still run (dependency or constraint conflict modals in Shutdown Logic, date order in Equipment Mob Plan, copy-paste popup `Paste Validation Failed`)? In which order, and does the paste popup still appear for invalid cells in AC-4.2?
Q14. When the typed value equals the current value after conversion (`5/6/26` typed over `05 Jun 2026 00:00`), is the page marked changed?
Q15. Is the red state removed when the user types a valid value, and does it also clear when the user presses Escape or reloads without saving?
Q16. Does the converted value also update the Gantt bar and the Duration in Shutdown Logic immediately (before Save)?
Q17. Pasting an Excel real date cell (not text): the pasted clipboard text depends on the Excel cell format; are only text strings in the supported formats expected?
Q18. JO role: can JO edit date cells in any of the five modules? The Pre-Condition says JO edits, the project rule says JO is view only on a plan.
Q19. Leaving (breadcrumb, browser Back, reload, other module, detail page) with an unsaved or red change: is a warning shown, and is the red state reset on return? Assumed: warning shown for any unsaved or red change, none after Save or for a view-only user (TC-037, TC-041 to TC-044).
Q20. Ctrl+Z / Q21: after a conversion, does Ctrl+Z restore the previous value? Assumed yes (TC-047).
Q22. Date picker: does a date cell have a calendar picker (month it opens on, closing without a pick)? The Story does not mention one, so no case is written; it is not done for that reason.
Suggestion (not in Story): none.

## Test cases (47 flows)

### TC-001 [FE][MT] Verify the date converts when focus leaves the cell by clicking outside (POS) [Auto]
Precondition: common. A row in Shutdown Logic with a Task Start Date Time cell.
Priority: High
Trace: AC-1.1, AC-1.3, AC-2.1
1. Double-click the Task Start Date Time cell of a row. -> The cell goes into edit mode and shows the current value.
2. Select all text in the cell and type `5/6/26`. -> The cell shows `5/6/26` as typed.
3. Click on an empty area outside the table. -> The cell shows `05 Jun 2026 00:00`.
4. Look at the page `Save` button. -> The `Save` button is enabled.
Automation: Starting data: one Shutdown Logic row owned by the card. Check: cell text equals `05 Jun 2026 00:00`; Save enabled. Data set: none. Clean up: reload without saving.

### TC-002 [FE][MT] Verify the date converts when Enter is pressed and when Tab moves to the next cell (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.1
1. Double-click the Task Start Date Time cell. -> The cell goes into edit mode.
2. Type `5/6/26 14:30`. -> The cell shows `5/6/26 14:30`.
3. Press `Enter`. -> The cell shows `05 Jun 2026 14:30`.
4. Double-click the Task End Date Time cell of the same row. -> The cell goes into edit mode.
5. Type `6/6/26 08:00`. -> The cell shows `6/6/26 08:00`.
6. Press `Tab`. -> The End cell shows `06 Jun 2026 08:00`; focus moves to the next cell.
Automation: same starting data as TC-001; check both cell texts; clean up: reload without saving.

### TC-003 [FE][MT] Verify leading and trailing spaces are trimmed before conversion (POS) [Auto]
Precondition: common.
Priority: Medium
Trace: AC-1.2
1. Double-click a date cell and type `   5/6/26   ` with three spaces before and after. -> The cell shows the text with the spaces.
2. Press `Enter`. -> The cell shows `05 Jun 2026 00:00` (date-time field) and is not red.
3. Double-click the cell again and type `  5626  `. -> The cell shows the text with the spaces.
4. Press `Enter`. -> The cell shows `05 Jun 2026 00:00` and is not red.
Automation: data set: values `   5/6/26   `, `  5626  `, tab-padded `\t5/6/26`; check canonical result, no red.

### TC-004 [FE][MT] Verify the raw text is replaced by the canonical text and not kept anywhere (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-1.3
1. Double-click a date cell and type `5-6-26`. -> The cell shows `5-6-26`.
2. Press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
3. Double-click the cell again. -> The edit field shows `05 Jun 2026 00:00`, not `5-6-26`.
Automation: check edit field value after the second double-click.

### TC-005 [FE][MT] Verify the converted change is marked as unsaved and undoing it by hand leaves nothing to save (POS) [Auto]
Precondition: common. Record the current value of one date cell (value A) and whether `Save` is enabled.
Priority: High
Trace: AC-1.3
1. Record the current value of the cell and the state of `Save`. -> The value and the Save state are written down for comparison.
2. Type a different valid date such as `7/6/26` into the cell and press `Enter`. -> The cell shows `07 Jun 2026 00:00`; `Save` is enabled.
3. Type the recorded value A back into the same cell in a flexible form (for a recorded `05 Jun 2026 00:00` type `5/6/26`) and press `Enter`. -> The cell shows value A again.
4. Look at `Save`. -> `Save` is back in the state written down in step 1 (nothing left to save).
Note: expected value in step 4 is what a user would call correct; see Q14.

### TC-006 [FE][MT] Verify day-first parsing: 5/6/2026 is 5 June, never 6 May (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.1, AC-2.4
1. Type `05/06/2026` into a date-only cell and press `Enter`. -> The cell shows `05 Jun 2026`.
2. Type `06/05/2026` into the same cell and press `Enter`. -> The cell shows `06 May 2026`.
3. Type `12/11/2026` and press `Enter`. -> The cell shows `12 Nov 2026`.
4. Type `13/11/2026` and press `Enter`. -> The cell shows `13 Nov 2026` (day 13 cannot be a month).
Automation: loop over the table "Day-first" below.

### TC-007 [FE][MT] Verify every delimiter family and mixed-digit date converts (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.2, AC-2.4
1. Pick a date-only cell. -> The cell is ready for input.
2. For each input row of the table "Delimiter and digit formats", type the input and press `Enter`. -> The cell shows the expected canonical value of that row and is not red.
The test loops over every row of the table.

### TC-008 [FE][MT] Verify compact numeric dates with 4, 6 and 8 digits convert (POS) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.2, AC-2.4
1. Pick a date-only cell. -> The cell is ready for input.
2. For each input row of the table "Compact formats", type the input and press `Enter`. -> The cell shows the expected value of that row.
The test loops over every row of the table.

### TC-009 [FE][MT] Verify the 6-digit precedence: DDMMYY wins when both readings are valid, DMYYYY is used when DDMMYY is not a real date (BND) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.3
1. Pick a date-only cell. -> The cell is ready for input.
2. For each input row of the table "6-digit precedence", type the input and press `Enter`. -> The cell shows the expected value of that row.
The test loops over every row of the table.

### TC-010 [FE][MT] Verify 2-digit years 00 to 69 map to 2000 to 2069 (BND) [Auto]
Precondition: common.
Priority: High
Trace: AC-2.5
1. Type `1/1/00` and press `Enter`. -> The cell shows `01 Jan 2000`.
2. Type `1/1/69` and press `Enter`. -> The cell shows `01 Jan 2069`.
3. Type `1/1/26` and press `Enter`. -> The cell shows `01 Jan 2026`.
4. Type `1/1/70` and press `Enter`. -> The cell is blank with a red background and `Save` is disabled (assumed: the Story maps only 00 to 69, so 70 is not a valid year; see Q1).
Automation: loop the four rows; the step 4 result follows the answer to Q1.

### TC-011 [FE][MT] Verify 24-hour date-time formats with comma and space separators (POS) [Auto]
Precondition: common. A date-time cell (Shutdown Logic Task Start Date Time).
Priority: High
Trace: AC-3.1, AC-3.3
1. Pick a date-time cell. -> The cell is ready for input.
2. For each input row of the table "24-hour formats", type the input and press `Enter`. -> The cell shows the expected canonical date-time of that row.
The test loops over every row of the table.

### TC-012 [FE][MT] Verify 12-hour AM and PM formats, any letter case, convert to 24-hour (POS) [Auto]
Precondition: common. A date-time cell.
Priority: High
Trace: AC-3.2, AC-3.3
1. Pick a date-time cell. -> The cell is ready for input.
2. For each input row of the table "12-hour formats", type the input and press `Enter`. -> The cell shows the expected canonical date-time of that row.
The test loops over every row of the table.

### TC-013 [FE][MT] Verify 12 AM and 12 PM edge hours (BND) [Auto]
Precondition: common. A date-time cell.
Priority: High
Trace: AC-3.2
1. Type `5/6/26 12:00 AM` and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
2. Type `5/6/26 12:30 PM` and press `Enter`. -> The cell shows `05 Jun 2026 12:30`.
3. Type `5/6/26 11:59 PM` and press `Enter`. -> The cell shows `05 Jun 2026 23:59`.
4. Type `5/6/26 1:00 AM` and press `Enter`. -> The cell shows `05 Jun 2026 01:00`.
Note: 12 AM / 12 PM results are what a user would call correct; see Q6.

### TC-014 [FE][MT] Verify a date-only input in a date-time cell gets 00:00 (POS) [Auto]
Precondition: common. A date-time cell.
Priority: High
Trace: AC-3.4, AC-2.2
1. Type `5/6/26` into a date-time cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
2. Type `5626` and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
3. Type `05-06-2026` and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
Automation: loop one input of each of the 16 date formats from the date tables; each result is `<date> 00:00`.

### TC-015 [FE][MT] Verify impossible times are rejected (NEG) [Auto]
Precondition: common. A date-time cell.
Priority: High
Trace: AC-3.1, AC-5.1
1. For each input row of the table "Invalid times", type the input and press `Enter`. -> The cell is blank with a red background.
2. Look at `Save`. -> `Save` is disabled.
Automation: loop over the table; clean up by reloading without saving.

### TC-016 [FE][MT] Verify an impossible calendar date gives a blank red cell (NEG) [Auto]
Precondition: common. A date cell with a known valid value (record it).
Priority: High
Trace: AC-5.1
1. Record the current valid value of the cell. -> The value is written down.
2. Double-click the cell, type `31/02/2026` and press `Enter`. -> The cell text is blank and the cell background is red.
3. Look at the `Save` button. -> `Save` is disabled.
Automation: loop the table "Invalid dates" (31/02/2026, 29/02/2026, 31/04/2026, 00/06/2026, 05/00/2026, 32/01/2026, 05/13/2026).

### TC-017 [FE][MT] Verify unsupported delimiters, text and wrong digit counts are rejected (NEG) [Auto]
Precondition: common.
Priority: High
Trace: AC-5.1
1. For each input row of the table "Unsupported text", type the input into a date cell and press `Enter`. -> The cell is blank with a red background.
The test loops over every row of the table (dot delimiter, 5 digits, 7 digits, letters, mixed delimiters).

### TC-018 [FE][MT] Verify the cell fallback works the same on blur as on Enter (NEG) [Auto]
Precondition: common.
Priority: Medium
Trace: AC-5.1, AC-1.1
1. Double-click a date cell and type `5.6.26`. -> The cell shows `5.6.26`.
2. Click outside the table. -> The cell is blank with a red background.
3. Double-click the cell and type `abc`. -> The edit field shows `abc`.
4. Press `Tab`. -> The cell is blank with a red background.

### TC-019 [FE][MT] Verify the Gantt bar does not move when an invalid date is typed (NEG) [Partial: bar position is read from the chart]
Precondition: common. Shutdown Logic with a task that has a bar on the Gantt chart.
Priority: High
Trace: AC-5.2
1. Record the position and length of the bar of the task (start date and end date under the bar). -> The values are written down.
2. Type `31/02/2026` into the Task Start Date Time cell of that task and press `Enter`. -> The cell is blank with a red background.
3. Look at the same bar. -> The bar has the same position and length as written down in step 1.
4. Type `abc` in the End cell and press `Enter`. -> The End cell is red and the bar position and length are the same as in step 1.

### TC-020 [FE][MT] Verify double-click on a red cell pre-fills the prior valid date (NEG) [Auto]
Precondition: common. A cell with a valid value (record it as value A).
Priority: High
Trace: AC-5.3
1. Record value A of the cell. -> The value is written down.
2. Type `31/02/2026` and press `Enter`. -> The cell is blank and red.
3. Double-click the red cell. -> The edit field shows value A, not blank and not `31/02/2026`.
4. Press `Enter` without changing it. -> The cell shows value A and is not red.
5. Look at `Save`. -> `Save` is in the state it had before step 2 when nothing else was changed.
Note: step 4 and 5 result is what a user would call correct; see Q15.

### TC-021 [FE][MT] Verify Save is disabled while any cell is red and enabled again when all are valid (NEG) [Auto]
Precondition: common. Two date cells in different rows.
Priority: High
Trace: AC-5.4, AC-1.3
1. Type a valid date such as `7/6/26` in the first cell and press `Enter`. -> The first cell shows `07 Jun 2026 00:00`; `Save` is enabled.
2. Type `32/01/2026` in the second cell and press `Enter`. -> The second cell is blank and red; `Save` is disabled.
3. Click the disabled `Save`. -> Nothing happens; no confirmation window appears.
4. Type `8/6/26` in the second cell and press `Enter`. -> The second cell shows `08 Jun 2026 00:00` and is not red; `Save` is enabled.
5. Click `Save`. -> The save is accepted (the page shows its normal success message).
6. Type `33/01/2026` in the first cell and `34/01/2026` in the second cell, pressing `Enter` after each. -> Both cells are blank and red; `Save` is disabled.
7. Type `9/6/26` in the first cell and press `Enter`. -> The first cell shows `09 Jun 2026 00:00` and is not red; the second cell is still blank and red; `Save` stays disabled.
8. Type `10/6/26` in the second cell and press `Enter`. -> The second cell shows `10 Jun 2026 00:00`; no cell is red; `Save` is enabled.
Clean up: restore original values.

### TC-022 [FE][MT] Verify clearing a cell gives blank red and disables Save (NEG) [Auto]
Precondition: common. A cell with a valid value.
Priority: High
Trace: AC-5.5
1. Double-click the cell, select all text and press `Delete`. -> The edit field is empty.
2. Press `Enter`. -> The cell is blank with a red background.
3. Look at `Save`. -> `Save` is disabled.
4. Type `5/6/26` in the cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`, is not red; `Save` is enabled.
5. Double-click the cell, select all text, type three spaces only and press `Enter`. -> The cell is blank with a red background and `Save` is disabled (assumed: spaces only count as emptying, same as step 2; see Q11).

### TC-023 [FE][MT] Verify strange text does not break the cell (Exotic: strange input) [Auto]
Precondition: common.
Priority: Medium
Trace: AC-5.1
1. For each input row of the table "Strange input", type or paste the value into a date cell and press `Enter`. -> The cell is blank with a red background; the page still works and no error window or blank page appears.
2. After the last row, type `5/6/26` and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
Data: emoji `5/6/26 😀`, Thai text `วันที่ห้า`, `<script>alert(1)</script>`, `5/6/26'; DROP TABLE`, 300 characters of `1`, text with a new line `5/6/26` + new line + `14:30`.

### TC-024 [FE][MT] Verify pasting one cell converts a flexible date (POS) [Auto]
Precondition: common. A spreadsheet cell containing text `5/6/26` (made-up value) copied to the clipboard; a table that supports paste (ETM-2615 / ETM-7351).
Priority: High
Trace: AC-4.1, AC-2.4
1. Click a date cell. -> The cell is selected.
2. Paste with `Ctrl+V`. -> The cell shows `05 Jun 2026` (or `05 Jun 2026 00:00` in a date-time cell).
3. Look at `Save`. -> `Save` is enabled.
Automation: loop one value per format family (slash, hyphen, space, compact 4, 6 and 8 digits, 24-hour, AM / PM).

### TC-025 [FE][MT] Verify pasting several rows and columns of mixed formats converts every cell (POS) [Partial: Excel clipboard is made by script]
Precondition: common. Spreadsheet range of 2 columns and 5 rows, each cell in a different supported format (table "Paste block"); a 40-row range for the second part.
Priority: High
Trace: AC-4.1
1. Copy the 5-row range from the spreadsheet. -> The clipboard holds the range.
2. Click the first cell of the Start column and paste. -> Every pasted cell shows its canonical value from the table "Paste block".
3. Copy a 40-row range of valid dates and paste it into the table. -> The rows that the paste rules allow are filled; each one shows a canonical value; the page stays usable.
Note: how many rows the paste fills follows ETM-2615 / ETM-7351 (lesson L-4); record which rows changed.

### TC-026 [FE][MT] Verify paste with valid and invalid cells gives partial success (NEG) [Auto]
Precondition: common. Spreadsheet range with these 5 values in one column: `5/6/26`, `31/02/2026`, `050626`, `5.6.26`, `7-6-2026`.
Priority: High
Trace: AC-4.2, AC-5.1
1. Copy the 5-cell range. -> The clipboard holds the range.
2. Paste it into 5 date cells of one column. -> Cells 1, 3, 5 show `05 Jun 2026`, `05 Jun 2026`, `07 Jun 2026`; cells 2 and 4 are blank with a red background.
3. Look at `Save`. -> `Save` is disabled.
4. Fix cell 2 with `1/6/26` and cell 4 with `2/6/26`. -> Both show their canonical value and are not red; `Save` is enabled.
Note: a paste popup may also appear (see Q13); record it.

### TC-027 [FE][MT] Verify Shutdown Logic Task Start / End Date Time convert and the Gantt updates (POS) [Partial: Gantt result read by eye]
Precondition: common. Shutdown Logic page; collapse the Manpower Resource histogram first (button `Hide histogram`) after every load.
Priority: High
Trace: AC-1.1, AC-3.1, AC-3.4
1. Record the Start, End and Duration of one task and the bar position. -> The values are written down.
2. Type `10/6/26 08:00` in the Start cell and press `Enter`. -> The Start cell shows `10 Jun 2026 08:00`.
3. Type `12/6/26 5 PM` in the End cell and press `Enter`. -> The End cell shows `12 Jun 2026 17:00`.
4. Look at the Gantt bar and Duration of the task. -> The bar and the Duration match the new Start and End; they differ from step 1.
Note: 5 PM with no minutes: see Q7; replace with `12/6/26 5:00 PM` if not supported.

### TC-028 [FE][MT] Verify Daily Report date fields convert (POS) [Auto]
Precondition: common. Daily Report editable table with Start and End date fields.
Priority: High
Trace: AC-1.1, AC-2.2, AC-3.1
1. Type `5/6/26 14:30` into a Daily Report Start date cell and press `Enter`. -> The cell shows `05 Jun 2026 14:30`.
2. Type `050626` into a date-only Daily Report schedule date cell and press `Enter`. -> The cell shows `05 Jun 2026`.
Note: which cells are date-only is Q3.

### TC-029 [FE][MT] Verify Manpower Mob Plan Mobilization and Demobilization dates convert (POS) [Auto]
Precondition: common. A Manpower Mob Plan table.
Priority: High
Trace: AC-1.1, AC-2.2
1. Type `5/6/26` into a Mobilization Date cell and press `Enter`. -> The cell shows `05 Jun 2026`.
2. Type `20-06-2026` into the Demobilization Date cell and press `Enter`. -> The cell shows `20 Jun 2026`.
3. Type `31/02/2026` into a Mobilization Date cell and press `Enter`. -> The cell is blank with a red background; `Save` is disabled.

### TC-030 [FE][MT] Verify Equipment Mob Plan date fields convert (POS) [Auto]
Precondition: common. An Equipment Mob Plan table with Material Ready at SKL, Require at Offshore and Backload to SKL.
Priority: High
Trace: AC-1.1, AC-2.2
1. Type `5/6/26` in Material Ready at SKL and press `Enter`. -> The cell shows `05 Jun 2026`.
2. Type `6 6 2026` in Require at Offshore and press `Enter`. -> The cell shows `06 Jun 2026`.
3. Type `07062026` in Backload to SKL and press `Enter`. -> The cell shows `07 Jun 2026`.
4. Type `5.6.26` in Backload to SKL and press `Enter`. -> The cell is blank with a red background.

### TC-031 [FE][MT] Verify Shutdown Timeline Preparation Task Start and End dates convert (POS) [Auto]
Precondition: common. Shutdown Timeline Preparation Task table.
Priority: High
Trace: AC-1.1, AC-2.2
1. Type `5/6/26` in a Preparation Task Start cell and press `Enter`. -> The cell shows `05 Jun 2026`.
2. Type `15-06-26` in the End cell and press `Enter`. -> The cell shows `15 Jun 2026`.
3. Type `abc` in the End cell and press `Enter`. -> The cell is blank with a red background.

### TC-032 [FE][MT] Verify a Job Owner who can edit gets the same conversion (POS) [Manual: depends on Q18, role set-up]
Precondition: logged in as Job Owner on a plan the JO may edit (see Q18).
Priority: Medium
Trace: AC-1.1
1. Open a table with a date cell. -> The table opens.
2. Type `5/6/26` in a date cell and press `Enter`. -> The cell shows `05 Jun 2026` (or with `00:00`), same as for TM.

### TC-033 [FE][MT] Verify a cell the user cannot edit shows no editing and converts nothing (NEG) [Manual: depends on Q18]
Precondition: logged in as Job Owner on a view-only plan (Active plan, view permission only).
Priority: High
Trace: AC-1.1
1. Double-click a date cell. -> The cell does not enter edit mode.
2. Press `Enter` on the selected cell. -> The value stays the same.
3. Look at `Save`. -> `Save` is disabled or not shown.

### TC-034 [FE][BE][MT] Verify the converted date is saved and shown the same after reload and on other pages (POS) [Partial: second page compare is by eye]
Precondition: common. A row owned by the card.
Priority: High
Trace: AC-1.3, AC-2.4, AC-3.3
1. Type `5/6/26 2:30 PM` in a date-time cell and press `Enter`. -> The cell shows `05 Jun 2026 14:30`.
2. Click `Save` and confirm if a confirmation window appears. -> The save success message appears.
3. Reload the page and wait until the table is loaded. -> The cell shows `05 Jun 2026 14:30`.
4. Open another page that shows the same date (Daily Report or Gantt). -> The same date and time are shown, in the same format.
Clean up: restore the original value and save.

### TC-035 [FE][BE][MT] Verify two users converting dates in the same table do not lose each other's change (Exotic: two users) [Manual: two sessions, costly set-up]
Precondition: two TM sessions open on the same table.
Priority: Medium
Trace: none (lesson 1, two people at once)
1. In session A type `5/6/26` in cell 1 and save. -> Session A shows `05 Jun 2026 00:00` and the save message.
2. In session B, without reloading, type `6/6/26` in cell 2 and save. -> Session B shows a clear result: either the save succeeds and cell 1 is not changed back, or a clear message explains the conflict.
3. Reload session A. -> Cell 1 is `05 Jun 2026 00:00` and cell 2 follows the result of step 2.

### TC-036 [FE][MT] Verify double click, Tab and Escape midway do not leave a half-converted value (Exotic: careless user) [Partial: Escape rule depends on Q12]
Precondition: common.
Priority: Medium
Trace: AC-1.1
1. Double-click a cell and type `5/6/26`. -> The cell shows `5/6/26`.
2. Press `Enter` twice quickly. -> The cell shows `05 Jun 2026 00:00` once, not red, and no second edit opens with the raw text.
3. Double-click the cell and type `7/6/26`. -> The cell shows `7/6/26`.
4. Press `Escape`. -> The edit is cancelled and the cell shows `05 Jun 2026 00:00`, the value before the edit (assumed, see Q12); it never shows raw `7/6/26` or `07 Jun 2026 00:00`.

### TC-037 [FE][MT] Verify leaving the page with a converted but unsaved value (Exotic: leave midway) [Manual: browser dialog]
Precondition: common.
Priority: Medium
Trace: AC-1.3
1. Type `5/6/26` in a cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`; `Save` is enabled.
2. Click a breadcrumb or menu item to leave the page. -> The unsaved-changes warning of the page appears.
3. Choose to stay on the page. -> The page and the converted value are still there.
4. Reload the page without saving. -> The unsaved-changes warning of the browser or page appears (assumed same rule as step 2, see Q19).
5. Confirm leaving. -> The page reloads and the cell shows its old saved value.

### TC-038 [FE][BE][MT] Verify a converted date still follows the existing date rules (NEG) [Partial: depends on Q13]
Precondition: common. Equipment Mob Plan row with Material Ready at SKL `05 Jun 2026`, Require at Offshore `10 Jun 2026`.
Priority: Medium
Trace: AC-1.3
1. Type `3/6/26` in Require at Offshore and press `Enter`. -> The cell shows the result the date-order rule gives for an earlier date (red or the page's message), not a silent acceptance.
2. Type `10/6/26` in Require at Offshore and press `Enter`. -> The cell shows `10 Jun 2026` and is not red.
3. Open a Shutdown Logic task with a dependency and type a Start date that breaks the dependency. -> The existing message `Unable to Apply Scheduled Time` with `The selected scheduled time conflicts with the dependency or constraint.` appears.

### TC-039 [FE][MT] Verify the converted date does not shift by one day when the browser timezone is not UTC+7 (Exotic: timezone) [Manual: needs OS timezone change]
Precondition: common. Computer timezone set to another zone, such as UTC-5.
Priority: Medium
Trace: none (Data Source: server timezone Asia/Bangkok)
1. Type `5/6/26 00:00` in a date-time cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`.
2. Click `Save`, reload the page. -> The cell still shows `05 Jun 2026 00:00`, not `04 Jun 2026`.

### TC-040 [FE][MT] Verify undoing a pasted conversion by hand leaves nothing to save (POS) [Auto]
Precondition: common. Record the current value of one date cell (value A) and whether `Save` is enabled. A spreadsheet cell with a different valid date text `7/6/26` copied.
Priority: High
Trace: AC-4.1, AC-1.3
1. Record the current value of the cell and the state of `Save`. -> The value and the Save state are written down.
2. Click the cell and paste with `Ctrl+V`. -> The cell shows `07 Jun 2026` (or with `00:00`); `Save` is enabled.
3. Type the recorded value A back into the cell in a flexible form and press `Enter`. -> The cell shows value A again.
4. Look at `Save`. -> `Save` is back in the state written down in step 1.
Automation: starting data a row owned by the card; clean up: reload without saving.

### TC-041 [FE][MT] Verify leaving by browser Back with a converted unsaved value warns the user (Exotic: leave midway) [Manual: browser dialog]
Precondition: common. The page was opened from another page so Back has a target.
Priority: Medium
Trace: AC-1.3
1. Type `5/6/26` in a cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`; `Save` is enabled.
2. Click the browser Back button. -> The unsaved-changes warning appears (assumed same rule as breadcrumb, see Q19).
3. Choose to stay. -> The page and the converted value are still there.
4. Click the browser Back button again and confirm leaving. -> The previous page opens.

### TC-042 [FE][MT] Verify the unsaved state is not carried to another tab, module or detail page and back (Exotic: leave midway) [Manual: several pages, record what is shown]
Precondition: common. A Shutdown Logic row with a detail or edit page opened from the row, and a second tab or module in the menu.
Priority: Medium
Trace: AC-1.3
1. Type `5/6/26` in a cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`; `Save` is enabled.
2. Click another in-app tab or module in the menu and confirm leaving if asked. -> The other page opens and its own `Save` and values are not changed by step 1.
3. Return to the first page. -> The cell shows its old saved value and is not red (the unsaved change is gone).
4. Type `31/02/2026` in a cell and press `Enter`. -> The cell is blank and red; `Save` is disabled.
5. Open the detail or edit page of the same row and come back. -> The cell shows its old saved value and is not red (assumed the red state is reset, see Q19).

### TC-043 [FE][MT] Verify a user who cannot save gets no unsaved-changes warning on leaving (NEG) [Manual: depends on Q18]
Precondition: logged in as Job Owner on a view-only plan.
Priority: Medium
Trace: AC-1.1
1. Double-click a date cell and press `Escape`. -> No edit mode opens and nothing changes.
2. Click a breadcrumb or menu item to leave the page. -> The page opens the target with no unsaved-changes warning.
3. Click the browser Back button on the new page. -> The previous page opens with no warning and shows the original values.

### TC-044 [FE][MT] Verify leaving while a cell is red, and leaving right after Save (NEG) [Manual: browser dialog]
Precondition: common. A row owned by the card.
Priority: Medium
Trace: AC-5.4
1. Type `31/02/2026` in a cell and press `Enter`. -> The cell is blank and red; `Save` is disabled.
2. Click a breadcrumb or menu item to leave the page. -> The unsaved-changes warning appears (assumed: the typed change would be lost, see Q19).
3. Choose to stay and type `5/6/26` in the cell and press `Enter`. -> The cell shows `05 Jun 2026 00:00`; `Save` is enabled.
4. Click `Save` and confirm if asked. -> The save success message appears and `Save` is disabled.
5. Click a breadcrumb or menu item to leave the page. -> The target page opens with no warning.
Clean up: restore the original value and save.

### TC-045 [FE][MT] Verify a red cell is cleared by Escape and by reload without saving (NEG) [Auto]
Precondition: common. A cell with a valid value (record it as value A).
Priority: Medium
Trace: AC-5.3, AC-5.4
1. Record value A of the cell. -> The value is written down.
2. Type `31/02/2026` and press `Enter`. -> The cell is blank and red; `Save` is disabled.
3. Double-click the red cell and press `Escape`. -> The cell shows value A and is not red (assumed, see Q15); `Save` is in the state it had before step 2.
4. Type `31/02/2026` again and press `Enter`. -> The cell is blank and red.
5. Reload the page. -> The cell shows value A and is not red; `Save` is disabled.

### TC-046 [FE][MT] Verify paste into the middle or end of text already in the edit field keeps the rest (POS) [Partial: cursor position set by keys]
Precondition: common. A spreadsheet cell with text `26` copied.
Priority: Medium
Trace: AC-4.1, AC-1.1
1. Double-click a date cell, select all and type `5/6/`. -> The edit field shows `5/6/`.
2. Paste with `Ctrl+V` with the cursor at the end. -> The edit field shows `5/6/26`.
3. Press `Enter`. -> The cell shows `05 Jun 2026` (or with `00:00`).
4. Double-click the cell, select all and type `5/6/`, move the cursor between `5/` and `6/`, paste `26`. -> The edit field shows `5/26/6/`.
5. Press `Enter`. -> The cell is blank with a red background.

### TC-047 [FE][MT] Verify typing over a selected part of the text and Ctrl+Z after conversion (POS) [Partial: Ctrl+Z rule depends on Q21]
Precondition: common. Record the current value of one date cell (value A) and the state of `Save`.
Priority: Medium
Trace: AC-1.1, AC-1.3
1. Double-click the cell, select all and type `5/6/26`. -> The edit field shows `5/6/26`.
2. Select only the last two characters and type `27`. -> The edit field shows `5/6/27`.
3. Press `Enter`. -> The cell shows `05 Jun 2027` (or with `00:00`); `Save` is enabled.
4. Press `Ctrl+Z`. -> The cell shows value A again and `Save` is back in the state written down (assumed, see Q21); it never shows the raw `5/6/27`.

## Expected-values tables (the test loops over every row)

### Day-first (TC-006)
| Input | Expected |
|---|---|
| 05/06/2026 | 05 Jun 2026 |
| 06/05/2026 | 06 May 2026 |
| 12/11/2026 | 12 Nov 2026 |
| 13/11/2026 | 13 Nov 2026 |
| 1/2/26 | 01 Feb 2026 |

### Delimiter and digit formats (TC-007)
| Input | Expected |
|---|---|
| 5/6/26 | 05 Jun 2026 |
| 05/06/26 | 05 Jun 2026 |
| 5/6/2026 | 05 Jun 2026 |
| 05/06/2026 | 05 Jun 2026 |
| 5/06/2026 | 05 Jun 2026 |
| 05/6/2026 | 05 Jun 2026 |
| 5-6-26 | 05 Jun 2026 |
| 05-06-26 | 05 Jun 2026 |
| 5-6-2026 | 05 Jun 2026 |
| 05-06-2026 | 05 Jun 2026 |
| 5-06-2026 | 05 Jun 2026 |
| 5 6 26 | 05 Jun 2026 |
| 05 06 26 | 05 Jun 2026 |
| 5 6 2026 | 05 Jun 2026 |
| 05 06 2026 | 05 Jun 2026 |
| 29/02/2028 | 29 Feb 2028 |
| 31/12/2026 | 31 Dec 2026 |
| 1/1/2026 | 01 Jan 2026 |

### Compact formats (TC-008)
| Input | Format | Expected |
|---|---|---|
| 5626 | DMYY | 05 Jun 2026 |
| 050626 | DDMMYY | 05 Jun 2026 |
| 562026 | DMYYYY | 05 Jun 2026 |
| 05062026 | DDMMYYYY | 05 Jun 2026 |
| 31122026 | DDMMYYYY | 31 Dec 2026 |
| 1226 | DMYY (1 Feb 2026 or 12/2/26, see Q4) | record result |

### 6-digit precedence (TC-009)
| Input | Reading as DDMMYY | Reading as DMYYYY | Expected |
|---|---|---|---|
| 050626 | 05 Jun 2026 valid | 0/5/0626 not valid | 05 Jun 2026 |
| 562026 | 56/20/26 not valid | 5 Jun 2026 valid | 05 Jun 2026 |
| 111212 | 11 Dec 2012 valid | 1 Jan 1212 (year not in a sensible range, Q10) | 11 Dec 2012 (DDMMYY wins) |
| 010101 | 01 Jan 2001 valid | 0/1/0101 not valid | 01 Jan 2001 |
| 311226 | 31 Dec 2026 valid | 3 Jan 1226 (Q10) | 31 Dec 2026 (DDMMYY wins) |
| 320126 | 32 Jan 2026 not valid | 3/2/0126 or 3/20/126 not valid | blank, red (neither valid) |

### 24-hour formats (TC-011)
| Input | Expected |
|---|---|
| 5/6/26, 14:30 | 05 Jun 2026 14:30 |
| 5/6/26 14:30 | 05 Jun 2026 14:30 |
| 5/6/26, 08,00 | 05 Jun 2026 08:00 |
| 5/6/26 08,00 | 05 Jun 2026 08:00 |
| 5/6/26, 08 00 | 05 Jun 2026 08:00 |
| 5/6/26 08 00 | 05 Jun 2026 08:00 |
| 5/6/26, 0800 | 05 Jun 2026 08:00 |
| 5/6/26 0800 | 05 Jun 2026 08:00 |
| 05-06-2026 23:59 | 05 Jun 2026 23:59 |
| 05062026 0000 | 05 Jun 2026 00:00 |
| 5-6-26, 09:05 | 05 Jun 2026 09:05 |

### 12-hour formats (TC-012)
| Input | Expected |
|---|---|
| 5/6/26 2:30 PM | 05 Jun 2026 14:30 |
| 5/6/26, 02:30 pm | 05 Jun 2026 14:30 |
| 5/6/26 2,30 PM | 05 Jun 2026 14:30 |
| 5/6/26 2 30 PM | 05 Jun 2026 14:30 |
| 5/6/26 0230 PM | 05 Jun 2026 14:30 |
| 5/6/26 230 PM | 05 Jun 2026 14:30 |
| 5/6/26 8:00 AM | 05 Jun 2026 08:00 |
| 5/6/26 08:00 am | 05 Jun 2026 08:00 |
| 5/6/26 8,00 Am | 05 Jun 2026 08:00 |
| 5/6/26 8 00 aM | 05 Jun 2026 08:00 |
| 5/6/26 0800 AM | 05 Jun 2026 08:00 |
| 5/6/26 11:15 pM | 05 Jun 2026 23:15 |

### Invalid times (TC-015)
| Input | Expected |
|---|---|
| 5/6/26 24:00 | blank, red |
| 5/6/26 25:00 | blank, red |
| 5/6/26 14:60 | blank, red |
| 5/6/26 13:00 PM | blank, red |
| 5/6/26 0:30 AM | blank, red |
| 5/6/26 2:75 PM | blank, red |
| 5/6/26 14:3 | blank, red |

### Invalid dates (TC-016)
| Input | Expected |
|---|---|
| 31/02/2026 | blank, red |
| 29/02/2026 | blank, red |
| 31/04/2026 | blank, red |
| 00/06/2026 | blank, red |
| 05/00/2026 | blank, red |
| 32/01/2026 | blank, red |
| 05/13/2026 | blank, red |

### Unsupported text (TC-017)
| Input | Expected |
|---|---|
| 5.6.26 | blank, red |
| 05.06.2026 | blank, red |
| 56262 (5 digits) | blank, red |
| 5062026 (7 digits) | blank, red |
| 5/6-26 (mixed delimiters) | blank, red |
| abc | blank, red |
| 5/6/26 abc | blank, red |
| 5//6/26 | blank, red |
| 5/6 | blank, red |

### Strange input (TC-023)
See the data list in the case; every row expects blank and red, page still works.

### Paste block (TC-025)
| Start column text | End column text | Expected Start | Expected End |
|---|---|---|---|
| 5/6/26 08:00 | 5/6/26 17:00 | 05 Jun 2026 08:00 | 05 Jun 2026 17:00 |
| 6-6-2026 | 07-06-2026 | 06 Jun 2026 00:00 | 07 Jun 2026 00:00 |
| 7 6 26 9 AM | 8 6 26 5:30 PM | see Q7 | 08 Jun 2026 17:30 |
| 080626 | 090626 | 08 Jun 2026 00:00 | 09 Jun 2026 00:00 |
| 09062026 1000 | 10062026 1100 | 09 Jun 2026 10:00 | 10 Jun 2026 11:00 |

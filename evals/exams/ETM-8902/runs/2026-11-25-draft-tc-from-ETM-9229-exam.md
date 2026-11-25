# ETM-8391 Draft test cases - View Worklist Table, Remark column filter

Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter (Ready For Development).
Source: story.md (Story, Jira AC, BA answers 2026-11-17 DEC-040), analyst.md (AC-1 to AC-11), module doc `docs/modules/core-navigation-worklist.md`, knowledge files. No Figma and no mockup (BA: use the existing filter look).
Existing [QA] subtasks: ETM-8575 (Create Test Case Manual Test), ETM-8576 (Execute Test Case Manual Test): reuse.
Priority: the Story gives none, so priority is set by damage if it breaks (stated here).

Common precondition: logged in on QA as a Turnaround Manager (TM) with View Worklist permission; the Worklist page is opened from a Worklist item in a Plan Card on the Planning tab of a Shutdown Event, on a worklist that holds the data set `RM-SET` below. Other columns' filters are at Select All and `Reset Table Filter` was pressed.

Notation: `->` separates action and expected result. Quoted `-` is the Blank option. "Total Results" is the counter under the table.

Test data `RM-SET` (Remark of each work; made-up work numbers W-01 to W-18; one work per row unless said):
- W-01 empty Remark; W-02 spaces only (3 spaces); W-03 `-`; W-04 `Test`; W-05 `test`; W-06 ` Test` (one leading space); W-07 `Test ` (one trailing space); W-08 `Note 1`; W-09 `Note 2`; W-10 `Note 10`; W-11 `_check`; W-12 `(urgent)`; W-13 `[ref]`; W-14 `12 pumps`; W-15 `main deck`; W-16 `Main Deck`; W-17 Thai text `สำรอง`; W-18 `Replace the seal on the main cooling pump and re-test the line pressure before handover to the operations team on the production deck` (long text, more than the filter width). Two more works share `Note 2` (W-19, W-20) to prove one option for many works.
- Lookalikes of Blank, kept in a second small set `RM-LOOK`: `- ` (dash + trailing space), ` - ` (dash with spaces both sides), `--`.
Data note: the values with leading/trailing spaces and spaces only must be made through a way the screen or a real Import allows (see Open question 1); if the Remark field trims spaces on screen, these works come from Import Excel as the BA confirms.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 checklist filter with search and Select All, old text filter gone | Screen state, regression | Old Contains/Blank/Not blank still shown | TC-003, TC-004 |
| AC-2 distinct values, case and space variants separate | Equivalence, error guessing | Variants merged into one option, wrong works shown | TC-005, TC-016, TC-021, TC-028 |
| AC-3 `-` first, only when a Blank work exists, Blank = empty / spaces / `-` | Decision table, state | Duplicate `-`, `-` in the wrong place, lookalikes treated as Blank | TC-006, TC-007, TC-008, TC-014 |
| AC-4 sort localeCompare en numeric | Data table, boundary (numbers) | Text sort (Note 10 before Note 2), lesson L-1 | TC-009 |
| AC-5 scroll in filter, long option ellipsis + hover | Screen state (many rows, long content), boundary 200 chars | Cut off text, no scroll, no tooltip | TC-010, TC-011, TC-027 |
| AC-6 table cells keep ellipsis and hover | Regression | New filter changes cell display | TC-012 |
| AC-7 only matching works shown; `-` shows Blank works | Equivalence, combination | Wrong rows or count | TC-013, TC-014, TC-015, TC-016, TC-017, TC-018, TC-022, TC-026 |
| AC-8 Nualta Design System look | Visual | Different look from other columns | TC-003 (compare with Job Description filter) |
| AC-9 permission and entry path | Roles | Permission leak, role cannot use filter | TC-001, TC-002 |
| AC-10 Remark free text, not mandatory | Strange input (lesson cat. 4) | Special characters break the list | TC-006, TC-020 |
| AC-11 start at Select All, old saved text filter / URL ignored, other columns unaffected | State change, old data (lesson cat. 3) | Error page, old filter still applied | TC-004, TC-024, TC-025 |
| Filter state kept (lesson L-2) | Error guessing | `null` in the address, `-` lost on reload | TC-023 |
| Search read too early (lesson L-3), filter + search + other filter (cat. 2) | Combination | Old rows read, wrong Total Results | TC-019, TC-022 |
| Data changes, two users (cat. 1, 6, 8) | Linked data | Options stale after Remark edit | TC-028 |
| Large worklist, screen state | Too much data | Slow or frozen filter | TC-027 |
| Nothing ticked (screen state: empty) | Screen state | Wrong result | TC-017 |

Categories (lessons-learned 1 to 9 and L-1 to L-8):
- 1 two people at once: relevant, TC-028 (partial; one user edits, the other reloads).
- 2 filter + sort + search: relevant, TC-019, TC-022. 3 old data: relevant, TC-024 and works with empty Remark in TC-006. 4 strange input: relevant, TC-020.
- 6 linked data: relevant, TC-028. 8 same data on many pages: relevant, TC-012 (table cell and option show the same text).
- 5 reordering changes calculations: not relevant, no calculation. 7 dependent charts: not relevant, no chart on this page. 9 matrix: relevant, TC-009 uses an expected-values table.
- L-1 TC-009; L-2 TC-023; L-3 TC-019, TC-022; L-4 paste: not relevant, no paste is added by the Story; L-5 collapse levels: not relevant; L-6 case variants: TC-005, TC-016; L-7 selected state is not hover: TC-013 checks the ticked options with the mouse away; L-8 Story text changed: TC-006/TC-007 follow the updated AC 2.2 (comment of 11 Nov 2026) and the BA answers.

Skipped with reason:
- Access without View Worklist permission: only two QA accounts exist (TM and JO, both can view); no third account, so not testable. The Story adds nothing to access.
- Multi-line Remark, Esc / click outside without Apply, deleted works (Status D) in options: behaviour not defined, see Open questions.

Counts: 28 cases. Priority: High 15, Medium 12, Low 1. Automation: Auto 24, Partial 3, Manual 1.

## Open questions

1. Test data reach: can a Remark with leading/trailing spaces or spaces only be created on the screen (Create Work, Edit Work Details), or only by Import Excel? (Missing - ask; we must not seed values the UI cannot make.)
2. Old Remark URL parameter: exact name and format of the old parameter (needed for TC-024). Missing - ask FE.
3. Are deleted works (grid Status `D`) counted when building options? Missing - ask.
4. Remark with a new line: is it possible, and how does the option show it? Missing - ask.
5. Closing the filter panel without pressing Apply (Esc, click outside): is the selection kept or dropped? Missing - ask.
6. Does the Remark option list refresh without a page reload after a Remark is edited in the same session? Assumption: only after reload (TC-028 reloads).
7. Suggestion (not in Story): a Not blank shortcut, since the old text filter had it; the new list has no such option. Not written as a case.

## Test cases (28 flows)

### TC-001 [FE][MT] Verify TM can open and use the Remark filter (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-9
1. Open the Worklist page from the Worklist item in the Plan Card on the Planning tab. -> The Worklist table opens with the column `Remark` in the header.
2. Move the mouse over the `Remark` header and click its filter icon. -> The Remark filter panel opens.
3. Tick only the option `Test`. -> Only the option `Test` is ticked.
4. Close the panel with Apply. -> The table shows only work W-04 and Total Results shows 1.
Automate - permission check that runs every release, result always the same.
Starting data: worklist with `RM-SET`. What to check: panel opens, 1 row, Total Results 1. Data set: none. Clean up: press `Reset Table Filter`. Independent: yes.

### TC-002 [FE][MT] Verify JO (view only) can open and use the Remark filter on an Active plan (POS) [Auto]
Precondition: common, but logged in as Job Owner (JO) with View Active Daily Report Item rights; the plan of the worklist is Active (a JO cannot open an Inactive plan).
Priority: High
Trace: AC-9
1. Open the Worklist page from the Plan Card of the Active plan. -> The Worklist table opens with the column `Remark`.
2. Open the Remark filter. -> The checklist with search box and `Select All` appears, the same as for TM.
3. Untick `Select All`, then tick only `main deck`. -> Only `main deck` is ticked.
4. Close the panel with Apply. -> The table shows only work W-15.
Automate - role check, repeats every release.
Starting data: `RM-SET` in an Active plan (do not switch a plan Active/Inactive without asking: affects other testers). What to check: 1 row W-15. Clean up: Reset Table Filter. Independent: yes.

### TC-003 [FE][MT] Verify the Remark filter is a checkbox list, not the old text filter (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-8
1. Open the filter of the `Remark` column. -> A checklist opens with a search box, `Select All` and one checkbox per option.
2. Look for the old items `Contains`, `Blank` and `Not blank` in the panel. -> None of them is shown.
3. Open the filter of the `Job Description` column. -> The panel has the same layout (search box, `Select All`, checkbox list, same spacing and fonts) as the Remark panel.
Automate for items 1-2 (texts); the look compare in step 3 is checked by a person: [Partial: visual match with Job Description needs a person].
Starting data: `RM-SET`. What to check: absence of the three old labels; presence of search box and Select All. Clean up: none. Independent: yes.

### TC-004 [FE][MT] Verify the Remark filter starts at Select All with all works shown (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-11
1. Open the Worklist page. -> The table shows all works and Total Results shows the number of works in the worklist (written down as N).
2. Open the Remark filter. -> `Select All` and every option are ticked.
3. Close the panel with Apply. -> Total Results still shows N.
Automate - repeats every release.
Starting data: `RM-SET` (N = 20 works). What to check: all boxes ticked, N rows. Clean up: none. Independent: yes.

### TC-005 [FE][MT] Verify each distinct Remark is one option and case and space variants are separate (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2
1. Open the Remark filter. -> The options list is shown.
2. Find the options `Test`, `test`, ` Test` (leading space) and `Test ` (trailing space). -> Four different options are listed, none is merged with another.
3. Find the option `Note 2`. -> It is listed once although three works (W-09, W-19, W-20) have it.
4. Count the options. -> The count equals the number of distinct Remark values in `RM-SET` after Blank values are joined into one `-` option.
Automate - same data, same result.
Starting data: `RM-SET`. What to check: option texts exactly as stored (spaces kept), one `Note 2`. Clean up: none. Independent: yes.

### TC-006 [FE][MT] Verify the Blank option `-` joins empty, spaces-only and `-` Remarks and appears once (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3, AC-10
1. Open the Remark filter. -> The list is shown.
2. Count the options with the text `-`. -> Exactly one option `-` is shown although W-01 (empty), W-02 (spaces only) and W-03 (`-`) exist.
3. Check its position. -> `-` is the first option, directly under `Select All`.
Automate - key business rule.
Starting data: `RM-SET`. What to check: one `-`, index 1 under Select All. Clean up: none. Independent: yes.

### TC-007 [FE][MT] Verify Remarks that only look like Blank are their own options (NEG) [Auto]
Precondition: common, and the works of `RM-LOOK` are in the worklist
Priority: High
Trace: AC-3
1. Open the Remark filter. -> The list is shown.
2. Find the options `- ` (dash + trailing space), ` - ` (dash with a space each side) and `--`. -> Each of the three is its own option, not trimmed, and ` - ` is a different option from `- `.
3. Tick only the option `--`, close with Apply. -> Only the work with Remark `--` is shown.
4. Open the filter, untick all, tick only `-`, close with Apply. -> The works with empty, spaces-only and `-` Remarks are shown, and the works of `--`, `- ` and ` - ` are not.
Automate - repeats, same result. Data note: if `- ` and ` - ` cannot be made, mark Partial (Open question 1).
Starting data: `RM-SET` + `RM-LOOK`. What to check: 3 extra options, row sets. Clean up: Reset Table Filter. Independent: yes.

### TC-008 [FE][MT] Verify no `-` option appears when no work has a Blank Remark (NEG) [Auto]
Precondition: common, but a worklist where every work has a non-blank Remark (for example only W-04, W-08, W-09)
Priority: Medium
Trace: AC-3
1. Open the Remark filter. -> The list shows only `Note 1`, `Note 2`, `Test` (sorted) and `Select All`.
2. Look for the option `-`. -> No `-` option is shown.
Automate - simple check.
Starting data: separate small worklist. What to check: absence of `-`. Clean up: remove the extra worklist if created by the test. Independent: yes.

### TC-009 [FE][MT] Verify option order follows localeCompare en with numeric (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-4
1. Open the Remark filter. -> The options list is shown.
2. Read all option texts from top to bottom, leaving out the space variants of `Test` and the `RM-LOOK` values. -> The order equals the expected table below.
3. Compare `Note 2` and `Note 10`. -> `Note 2` is above `Note 10` (numbers compared as numbers).
4. Compare `main deck` and `Main Deck`. -> `main deck` is above `Main Deck` (same letters: lowercase first).
5. Compare the order with the options of the `Job Description` filter built from similar values (if the same rule shows there). -> The order rule is the same.
Expected order (the test loops over this list and also computes it with localeCompare('en', {numeric: true}) from the Remarks of the data):
| Position | Option |
|---|---|
| 1 | `-` (Blank, outside the sort) |
| 2 | `_check` |
| 3 | `(urgent)` |
| 4 | `[ref]` |
| 5 | `12 pumps` |
| 6 | `main deck` |
| 7 | `Main Deck` |
| 8 | `Note 1` |
| 9 | `Note 2` |
| 10 | `Note 10` |
| 11 | `test` |
| 12 | `Test` |
| 13 | the long Remark of W-18 (starts with `Replace`; placed by the same rule, after `Note 10` and before `test`; the test uses the computed order) |
| 14 | `สำรอง` (Thai after English letters) |
Note: position 13 is only an example of "computed order": the test must use the computed order, not a hard number. If Remark sorts differently from this rule, report a bug (BA answer 3, open item C-10).
Automate - matrix over one data table, result always the same.
Starting data: `RM-SET`. Data set: the expected order list. Clean up: none. Independent: yes.

### TC-010 [FE][MT] Verify a long option list scrolls inside the filter (BND) [Auto]
Precondition: common, with a worklist that has many distinct Remarks (more than fit in the panel, for example 60 works with Remarks `Item 1` to `Item 60`)
Priority: Medium
Trace: AC-5
1. Open the Remark filter. -> The panel opens and shows the first options only; the page does not grow.
2. Scroll down inside the panel with the mouse wheel. -> The list scrolls inside the panel and the last option `Item 60` can be reached.
3. Tick the last option while all others are unticked, close with Apply. -> The table shows only the work with `Item 60`.
Automate - same result each time.
Starting data: 60 works with distinct Remarks, created by the test. Clean up: delete the created works or the worklist. Independent: yes.

### TC-011 [FE][MT] Verify a long option ends with an ellipsis and hover shows the full text, a short option has no tooltip (POS) [Partial: ellipsis and tooltip look need a person]
Precondition: common
Priority: Medium
Trace: AC-5
1. Open the Remark filter. -> The list is shown.
2. Find the option of W-18 (long text). -> The text is cut at the filter width and ends with an ellipsis (…).
3. Move the mouse over this option. -> A tooltip appears with the full text `Replace the seal on the main cooling pump and re-test the line pressure before handover to the operations team on the production deck`, in the style of the existing checkbox-list tooltip.
4. Move the mouse over the short option `Test`. -> No tooltip appears.
Starting data: `RM-SET`. What to check: ellipsis by CSS check (text overflow), tooltip text, no tooltip for the short text. Clean up: none. Independent: yes.

### TC-012 [FE][MT] Verify table cells of Remark keep ellipsis and hover text (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-6
1. Scroll the table to the `Remark` column and find W-18. -> The Remark cell shows the text cut with an ellipsis.
2. Hover over the cell. -> The full text is shown on hover, as before this change.
3. Open the Remark filter and find the same Remark. -> The option text starts with the same words as the cell and the hover text is the same full text.
Automate - regression check.
Starting data: `RM-SET`. Clean up: none. Independent: yes.

### TC-013 [FE][MT] Verify ticking one option shows only the works with that Remark (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7
1. Open the Remark filter, untick `Select All`. -> No option is ticked.
2. Tick only `Note 2`. -> Only `Note 2` is ticked.
3. Move the mouse away from the option and close the panel with Apply. -> The table shows only W-09, W-19 and W-20 and Total Results shows 3.
4. Open the filter again. -> Only `Note 2` is still ticked (the ticked state shows without hover).
Automate - core rule.
Starting data: `RM-SET`. What to check: row numbers, Total Results 3, ticked state. Clean up: Reset Table Filter. Independent: yes.

### TC-014 [FE][MT] Verify selecting `-` shows all works with a Blank Remark (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3, AC-7
1. Open the Remark filter, untick `Select All`, tick only `-`. -> Only `-` is ticked.
2. Close the panel with Apply. -> The table shows W-01 (empty), W-02 (spaces only) and W-03 (`-`) and Total Results shows 3.
3. Check that no other work is shown. -> No work with text in Remark is in the table.
Automate - core rule.
Starting data: `RM-SET`. What to check: exactly W-01, W-02, W-03. Clean up: Reset Table Filter. Independent: yes.

### TC-015 [FE][MT] Verify ticking several options shows the works of all of them (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Open the Remark filter, untick `Select All`. -> No option is ticked.
2. Tick `-`, `Note 1` and `สำรอง`. -> The three options are ticked.
3. Close with Apply. -> The table shows W-01, W-02, W-03, W-08 and W-17 and Total Results shows 5.
Automate - combination of a few values.
Starting data: `RM-SET`. Clean up: Reset Table Filter. Independent: yes.

### TC-016 [FE][MT] Verify case and space variants select only their own works (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-2, AC-7
1. Open the Remark filter, untick `Select All`. -> No option is ticked.
2. Tick only `test` (lowercase), close with Apply. -> Only W-05 is shown.
3. Open the filter, untick `test`, tick only ` Test` (leading space), close with Apply. -> Only W-06 is shown.
4. Open the filter, untick ` Test`, tick only `Test ` (trailing space), close with Apply. -> Only W-07 is shown.
5. Open the filter, untick `Test `, tick only `Test`, close with Apply. -> Only W-04 is shown.
Automate - lesson L-6: case variants must stay apart. Data note: Open question 1.
Starting data: `RM-SET`. Data set: the four variants and their expected work. Clean up: Reset Table Filter. Independent: yes.

### TC-017 [FE][MT] Verify nothing ticked shows an empty table (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Open the Remark filter and untick `Select All`. -> No option is ticked.
2. Close the panel with Apply. -> The table shows no rows, `No results found` and Total Results shows 0 (same as every other column).
3. Press `Reset Table Filter`. -> The table shows all works again and the Remark filter is back at Select All.
Automate - repeats. Module doc says nothing ticked means empty table for every column.
Starting data: `RM-SET`. Clean up: none. Independent: yes.

### TC-018 [FE][MT] Verify Select All and unticking one option (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1, AC-7
1. Open the Remark filter (all ticked) and untick `Note 2`. -> `Note 2` is unticked and `Select All` is no longer fully ticked.
2. Close with Apply. -> The table shows all works except W-09, W-19 and W-20 (Total Results is N minus 3).
3. Open the filter and tick `Select All`. -> Every option is ticked again.
4. Close with Apply. -> All N works are shown.
Automate.
Starting data: `RM-SET` (N = 20). Clean up: Reset Table Filter. Independent: yes.

### TC-019 [FE][MT] Verify the search box in the Remark filter finds options, also `-` (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-3
1. Open the Remark filter and type `note` in its search box. -> Only `Note 1`, `Note 2` and `Note 10` stay in the list, in the same order, the same as the Job Description filter does for a text typed in lower case.
2. Clear the search text and type `-`. -> The option `-` stays in the list (together with other options that contain a dash, such as `--`, `_check` is not shown).
3. Clear the search text and type `zzz`. -> The list shows the same empty-result state as the Job Description filter.
4. Clear the search text, untick `Select All`, type `Note` and tick `Select All`. -> Only the three Note options are ticked.
5. Wait for the table response, then read the rows and Total Results. -> Total Results shows 5 works (W-08, W-09, W-10, W-19, W-20); the rows were read after the response arrived (lesson L-3).
Automate. Wait for the response (or changed Total Results) before reading rows.
Starting data: `RM-SET`. Clean up: Reset Table Filter. Independent: yes.

### TC-020 [FE][MT] Verify strange Remark values show in the list exactly as stored (Exotic: special characters) [Auto]
Precondition: common, with extra works whose Remarks are made on screen: `<script>alert(1)</script>`, `50% & "quoted" it's`, `C:\temp\file`, a smiley emoji `😀`, Chinese `维修`, and a pasted 200-character text
Priority: Medium
Trace: AC-10, AC-2
1. Open the Remark filter. -> The list opens with no script run and no broken layout.
2. Find each strange value. -> Each is shown exactly as typed (tags shown as text, quotes and `%` kept, emoji and Chinese shown).
3. Tick only `<script>alert(1)</script>`, close with Apply. -> Only its work is shown.
4. Type `%` in the filter search box. -> The option with `%` stays in the list.
Automate with a data table of strange values.
Starting data: extra works created by the test (200-char Remark is the field limit, shown as 200/200). Data set: the strange values. Clean up: delete the extra works. Independent: yes.

### TC-021 [FE][MT] Verify other filters and quick search do not shrink the Remark options (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2
1. Open the Remark filter and count the options (written down as M). -> M options are shown.
2. Close the panel, type `W-04` in the table search box ("Search work number and job description") and press Enter. -> After the response arrives the table shows only W-04.
3. Open the Remark filter. -> The same M options are shown (not only `Test`).
4. Close the panel, set a filter of another column to a single value, then open the Remark filter. -> The same M options are still shown.
Automate - wait for the search response before reading.
Starting data: `RM-SET`. Clean up: clear the search, Reset Table Filter. Independent: yes.

### TC-022 [FE][MT] Verify the Remark filter together with quick search and another column filter (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7
1. Open the Remark filter, untick `Select All`, tick `Test` and `test`, close with Apply. -> The table shows W-04 and W-05 and Total Results shows 2.
2. Click in the table search box, type `W-04` and press Enter. -> After the response arrives (Total Results checked, not only the rows) the table shows only W-04 and Total Results shows 1.
3. Clear the search text and press Enter. -> The table shows W-04 and W-05 again with the Remark filter kept.
4. Set a filter of another column that excludes W-05. -> The table shows only W-04.
5. Press `Reset Table Filter`. -> All works are shown and the Remark filter is back at Select All.
Automate - lesson L-3 and category 2: wait for the response, check rows AND Total Results.
Starting data: `RM-SET`. Clean up: Reset Table Filter. Independent: yes.

### TC-023 [FE][MT] Verify the chosen option, also `-`, is kept after reload, re-open and going to another page and back (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3, AC-7
1. Open the Remark filter, untick `Select All`, tick only `-`, close with Apply. -> The table shows 3 works (W-01, W-02, W-03).
2. Read the page address. -> The address holds the Remark filter value and does not contain the text `null`.
3. Reload the page. -> The table shows the same 3 works and the Remark filter still has only `-` ticked.
4. Open the filter panel and close it again. -> The selection and the rows stay the same.
5. Open another page of the plan (for example the Shutdown Logic of the same plan) and go back with the browser Back button. -> The Worklist shows the same 3 works with `-` ticked.
Automate - lesson L-2 (defect seen in the draft).
Starting data: `RM-SET`. Clean up: Reset Table Filter. Independent: yes.

### TC-024 [FE][MT] Verify an old saved Remark text filter in the address is ignored (NEG) [Manual: the old address must be copied from before the release (Open question 2)]
Precondition: common, plus a saved link made before this release that holds a Remark text filter (Contains, Blank or Not blank)
Priority: High
Trace: AC-11
1. Paste the old link in the browser and press Enter. -> The Worklist opens normally with no error message and no blank page.
2. Look at all works in the table. -> All works are shown and Total Results shows N.
3. Open the Remark filter. -> It is a checklist and `Select All` with every option is ticked.
4. Look at the filters of the other columns that were in the old link. -> Their saved values are still applied.

### TC-025 [FE][MT] Verify other columns' filters are not affected by the Remark change (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-11
1. Set the filter of the `Job Owner` column to a single value. -> The table shows only that Job Owner's works.
2. Open the Remark filter and tick only `Test`, close with Apply. -> Both filters apply; the table shows the works that match both.
3. Reload the page. -> The Job Owner filter is still set and the Remark filter is still `Test`.
4. Press `Reset Table Filter`. -> All filters are back at Select All and all works are shown.
Automate.
Starting data: `RM-SET` with at least two Job Owners. Clean up: Reset Table Filter. Independent: yes.

### TC-026 [FE][MT] Verify `Reset Table Filter` returns the Remark filter to Select All (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7, AC-1
1. Tick only `Test` in the Remark filter and apply. -> Only W-04 is shown.
2. Press `Reset Table Filter`. -> All N works are shown.
3. Open the Remark filter. -> `Select All` and all options are ticked.
Automate.
Starting data: `RM-SET`. Clean up: none. Independent: yes.

### TC-027 [FE][MT] Verify the filter opens and scrolls with a very large worklist (BND) [Partial: speed is judged by a person]
Precondition: common, with a worklist of several thousand works (about 5,000) and many different Remarks
Priority: Medium
Trace: AC-5
1. Open the Worklist page of the big worklist. -> The table loads.
2. Open the Remark filter. -> The panel opens within a few seconds, without a frozen page.
3. Scroll the list to the bottom. -> The list scrolls and the last option is reached without a blank area.
4. Tick one option and apply. -> The table shows the matching works and Total Results matches.
Automate the functional part; a person judges "within a few seconds".
Starting data: a big worklist from the QA team data (not created by the test). Clean up: Reset Table Filter. Independent: yes.

### TC-028 [FE][MT] Verify options follow the saved Remark data after an edit by another user (POS) [Partial: needs two sessions]
Precondition: common, W-03 is the only work with Remark `-` and W-01, W-02 are changed to have text (so `-` exists only because of W-03)
Priority: Medium
Trace: AC-2, AC-3
1. In browser A open the Worklist and the Remark filter. -> The option `-` is listed first.
2. In browser B (another user) open Edit Work Details of W-03 and change its Remark to `Replaced`, then press Save. -> The work is saved.
3. In browser A reload the page and open the Remark filter. -> The option `-` is no longer listed and the option `Replaced` is listed in its sorted place.
4. In browser B change the Remark of W-03 back to empty and save. -> The work is saved.
5. In browser A reload and open the filter. -> The option `-` is listed first again.
Starting data: own works. Clean up: restore Remarks. Independent: yes.

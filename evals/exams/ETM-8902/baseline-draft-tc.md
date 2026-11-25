# ETM-8391 Draft test cases - View Worklist Table: Remark Column Filter

Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter (Ready For Development; relates to ETM-8049, ETM-8050, ref ETM-434). No Figma, no inspector notes: wording comes from the Story and `docs/modules/core-navigation-worklist.md`.
Existing [QA] subtasks: ETM-8575 Create Test Case Manual Test (Open), ETM-8576 Execute Test Case Manual Test (Open). Reuse both.
Component tags: `[FE]` screen behaviour, `[BE]` data returned by the API, `[MT]` manual test tag (the sibling Story ETM-8049 has no draft yet, so tags follow the agent file).
Priority: the Story has none, so priority is set by damage if it breaks (wrong rows shown = High).

## Common precondition

- Logged in as a Turnaround Manager (or Job Owner) with View Worklist permission.
- Worklist page opened from the Worklist item of a Plan Card on the Planning tab of a Shutdown Event. The page header reads `Worklist: [Plan Name]`.
- Common data set "Remark set": a worklist whose works carry these Remark values (made-up work data):
  W01 `Test` | W02 `test` | W03 ` Test` (one leading space) | W04 `Test ` (one trailing space) | W05 `Note 1` | W06 `Note 2` | W07 `Note 10` | W08 `#Urgent` | W09 `(Hold)` | W10 `ซ่อมด่วน` | W11 empty Remark | W12 `   ` (three spaces only) | W13 `-` | W14 `--` | W15 `- a` | W16 `Check valve 🔧` | W17 a 200-character Remark (letters and spaces, starts with `Long remark `) | W18 `Valve A, B` | W19 `100% <b>ok</b> "x" & y` | W21 `- ` (dash then one space) | W22 ` - ` (space, dash, space). W21 and W22 are not Blank (BA answer 2026-11-17).
- Column header `Remark` has a filter icon; the other columns have the same checkbox-list filters.

## Notation

Steps are one action each, `->` separates action and expected result. `[Auto]` = Playwright candidate; `[Partial]` = script captures evidence, a person judges; `[Manual]` = person only. All Q1-Q7 are answered by the BA (BA answer 2026-11-17, DEC-040); the answers are used as facts. Other `Assumption` labels are about screen details nobody has stated.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 checkbox list + search + Select All replaces the text filter | Screen states, error guessing | Old text filter still shown, or checkbox list missing parts | TC-002, TC-008, TC-009, TC-016 |
| AC-2 distinct values exactly as stored; case/space variants separate | Input groups, error guessing | Variants merged or duplicates listed; wrong rows per option | TC-002, TC-006 |
| AC-3 `-` Blank option: only if a Blank exists, first under Select All, empty/spaces/literal `-` merge, `--` not Blank | Decision table, boundary | Blank missing, duplicated, wrong position, wrong merge | TC-003, TC-004, TC-005, TC-006 |
| AC-4 A-Z numeric sort after `-` | Boundary, decision table | Note 10 before Note 2; `-` sorted into the list | TC-003 |
| AC-5 scroll inside the filter, ellipsis + hover in the filter | Screen states (very many rows, very long content) | Long option breaks layout; no full text on hover | TC-003, TC-007 |
| AC-6 table cells keep ellipsis and hover | Regression | Cell behaviour changed by the new filter | TC-007 |
| AC-7 filter result; `-` shows Blank works; several options | Equivalence, combinations | Wrong or missing rows | TC-004, TC-008, TC-009 |
| AC-8 Nualta Design System components | Real-user view | Looks different from other column filters | TC-010 |
| AC-9 permission and path | Roles and permission | Page or filter data reachable without View Worklist | TC-001, TC-002 |
| AC-10 Remark free text, not mandatory | Boundary, lesson 3 | Works with no Remark (old rows, null) not under `-` | TC-004, TC-006 |
| AC-11 old saved Remark text filter and old URL parameter cleared; other columns unaffected | State changes, error guessing | Error or old filter still applied after release | TC-016 |
| Lesson 2 filter + sort + search together | Combinations | Results wrong when combined | TC-011 |
| Lesson 4 strange input (emoji, Thai, special chars, 200 chars) | Data-driven | Option text altered or filter broken | TC-012, TC-013 |
| Lesson 8 same data on many pages (Remark edited on Work Registration) | State changes | Filter list shows old values | TC-006 |
| Screen state: empty worklist | Screen states | Crash or stray options | TC-014 |
| Screen state: very many rows / large worklist | Screen states | Slow or frozen filter | TC-007 (60 options, inner scroll); 5,000-row performance dropped in Trim 2 (no time target) |
| Filter kept in the page address (module doc: table filters are in the URL) | Error guessing | A Remark with `,` `&` `%` `-` or a leading space splits or breaks the saved selection | TC-015 |
| Lesson 1 two users | State changes | Options differ from saved data | Dropped in Trim 2 (no AC item depends on it; the Story is silent on live refresh) |

Categories not covered as own cases:
- Lesson 3 old data after migrations: covered for empty/null Remark (TC-004) and for old saved Remark filters (TC-016); other migration checks not relevant (no data change in this Story).
- Lesson 5 reordering, 7 charts, 9 matrix calculations: not relevant, no row order change, charts or calculations in this Story.
- Lesson 6 linked data: Remark is not linked to other data; the change from Work Registration is covered by lesson 8 in TC-006.
- Removed in the trim (user approved): close without applying, fast repeated ticking, Reset Table Filter. Not covered as own cases any more.
- Removed in Trim 2 (user asked for fewer cases): large worklist of 5,000 works (no response time target, person-only) and two users editing at once (Story silent on live refresh).
- Old saved filters (BA answer, AC-11): TC-016. Label of `-`: closed, the label is `-`.

## Counts

High 12 | Medium 2 | Low 2 (total 16). Auto 11 | Partial 3 | Manual 2. NEG cases (label): TC-001, TC-005, TC-013. NEG checks that moved into other cases as steps: old text filter gone and Job Owner has no condition dropdown (TC-002), no `-` option when no Blank (TC-006), unticking the only ticked option (TC-008), search with no match and search `-` (TC-009).
Automate: filter lists and results are deterministic from known seed data and run every release. Manual only: look-and-feel, no-permission role without a login.

## Open questions

- Q1-Q7: closed by the BA (BA answer 2026-11-17, DEC-040); see story.md and analyst.md.
- Jira AC 5 (migration of old saved filters) is not in Jira yet: the BA will add it after approval; TC-016 follows the BA answer.
- Suggestion (not in Story): none.

## Test cases (16 flows)
### TC-001 [FE][MT] Verify a user without View Worklist permission cannot open the Worklist page (NEG) [Manual: a test user without View Worklist permission is to be confirmed with the team; if one exists this can become Auto]
Precondition: Assumption: a test user without View Worklist permission exists (confirm with the team). Copy the Worklist page address from a user who has the permission.
Priority: High
1. Log in with the user that has no View Worklist permission. -> The user is logged in and sees only the pages the role allows.
2. Open the copied Worklist page address in the browser. -> The Shutdown Event List page is shown and the Worklist table is not shown (existing behaviour: a path the user cannot use redirects to the Shutdown Event List without an error page).
3. Look at the page. -> No Remark values appear anywhere on the page.

### TC-002 [FE][BE][MT] Verify the Remark filter opens from the Plan Card as a checkbox list with no old text filter, and lists each distinct value once with case and space variants separate (POS) [Auto]
Covers: path from the Plan Card, old text filter (Contains / Blank / Not blank) gone (NEG), same parts as the Job Owner filter, one option per distinct value, case and leading/trailing space variants.
Precondition: common (Remark set): W01 `Test`, W02 `test`, W03 ` Test`, W04 `Test `, W05 `Note 1`. Add a second work with Remark `Note 1` (W20) so one value is used by two works. The Job Description of each work is its id (`W01` to `W05`, `W20`) so the row can be told apart even when the spaces cannot be seen. To see a space, open `Edit Work Details` and click inside the `Remark` field: the cursor stands one space away from the first or last letter.
Priority: High
1. Open the Planning tab of the Shutdown Event. -> The Plan Cards are shown.
2. Click the Worklist row of a Plan Card. -> The Worklist page opens (in a new tab, as Plan Card rows do today) with the header `Worklist: [Plan Name]` and the work table.
3. Click the filter icon on the `Remark` column header. -> A filter panel opens under the header.
4. Look at the panel. -> The panel shows a search box, a `Select All` checkbox and a list of checkboxes with Remark values.
5. Look for a condition dropdown. -> No dropdown with `Contains`, `Blank` or `Not blank` is shown.
6. Look for a free text input used as the filter value. -> The only text input is the search box of the checkbox list.
7. Click the filter icon on the `Job Owner` column header. -> The Remark panel closes and a checkbox list opens with a search box and `Select All`; no condition dropdown is shown.
8. Compare the Job Owner panel with the Remark panel seen in step 4. -> Both panels have a search box, a `Select All` checkbox and a scrollable list of checkboxes.
9. Click the filter icon on the `Remark` column header. -> The Remark list opens.
10. Count the options named `Note 1`. -> Exactly one option `Note 1` is shown, even though two works use it.
11. Tick only `Note 1`. -> The table shows exactly the two works W05 and W20.
12. Untick `Note 1`. -> All works are shown again.
13. Look for the options that read `Test` or `test`. -> Four separate options are listed: `Test`, `test`, one with one space before `Test` and one with one space after `Test`.
14. Tick only the option `test`. -> The table shows only W02.
15. Untick `test` and tick only the option with one space before `Test`. -> The table shows only W03.
16. Untick it and tick only the option with one space after `Test`. -> The table shows only W04.
17. Untick it and tick only `Test`. -> The table shows only W01.
Starting data: Remark set plus W20, made by the test through Work Registration. What to check: panel parts, absence of the three old option names and of a condition dropdown, one `Note 1` option with two rows, four Test options with one row each. Test data set: table (option, expected work) for W01-W04 looped over. Clean up: delete W20, clear the filter. Independent: yes.

### TC-003 [FE][BE][MT] Verify the option list: `-` first and outside the order, numeric order, A to Z order, long and short options (POS) [Partial: ellipsis is measured by a script, a person confirms how the hover text looks]
Covers: `-` position and only one `-`, Note 1/2/10 numeric order, whole-list A to Z order, ellipsis and hover of a long option, no ellipsis on a short option.
Precondition: common (Remark set): W11 has an empty Remark; W05 `Note 1`, W06 `Note 2`, W07 `Note 10`; W17 has 200 characters. Sort rule (BA answer 2026-11-17): symbols, then digits, then English letters (case-insensitive; same letters: lowercase first, `test` before `Test`), then Thai; `-` stays first outside the sort. If the order disagrees (as seen once in the Job Description filter, open item C-10) report a bug.
Priority: High
Note for the tester: if a step fails, write down the step number and continue from the next part (the next group of steps that starts with `Reset Table Filter` or a clean filter).
1. Open the filter on the `Remark` column. -> The list opens.
2. Look at the row directly under `Select All`. -> The first option is `-`.
3. Look at the option after `-`. -> The next option is a normal value (not `-`).
4. Search the whole list for a second `-` option. -> Only one option reads `-`.
5. Scroll to the end of the list. -> No `-` option is found in the middle or at the end; `-` is not part of the A to Z block (`#Urgent`, `(Hold)` and digits exist).
6. Scroll back to the top of the list. -> The first option under `Select All` is `-` again.
7. Read the positions of `Note 1`, `Note 2` and `Note 10`. -> The order is `Note 1`, `Note 2`, `Note 10`; `Note 10` is not before `Note 2`.
8. Read all options after `-` in order. -> The options appear in four groups in this order: values that start with a symbol or space (one space before Test, ` - `, `- `, `- a`, `--`, `(Hold)`, `#Urgent`), then the value that starts with a digit (`100% <b>ok</b> "x" & y`), then English-letter values, then Thai (`ซ่อมด่วน`).
9. Look at the English-letter group. -> The order is `Check valve 🔧`, `Long remark ...` (the 200-character one), `Note 1`, `Note 2`, `Note 10`, `test`, `Test`, `Test ` (one space after Test), `Valve A, B`; `test` is before `Test` (lowercase first).
10. Look at the position of `ซ่อมด่วน`. -> It is listed last, after `Valve A, B`.
11. Look at the options that start with a symbol or a space. -> They come before `100% <b>ok</b> "x" & y` and before all letters, in the order localeCompare('en', { numeric: true }) gives (values starting with a space or `-` before values starting with `(` or `#`); none is listed before `-`.
12. Find the option that starts with `Long remark `. -> The option text ends with an ellipsis (…) and stays on one line inside the panel width.
13. Move the mouse over this option. -> A hover text shows the full 200-character Remark.
14. Move the mouse away. -> The hover text disappears.
15. Look at the option `Note 1`. -> The full text `Note 1` is shown with no ellipsis.
16. Move the mouse over the option `Note 1`. -> No tooltip appears for this short option.
Starting data: Remark set (W11 empty; works created without a Remark also count). What to check: index 0 under Select All is `-` and the only `-`; index(Note 1) < index(Note 2) < index(Note 10); automation builds the expected list by sorting the stored values with localeCompare('en', { numeric: true }) and compares it with the option list, and the fixed group order above must also hold; text overflow, hover text equals the stored value, short option has no `…` and no tooltip. Clean up: none. Independent: yes.

### TC-004 [FE][BE][MT] Verify empty, spaces-only, literal `-` and not-entered Remarks merge into one `-` option and select the same works, also when only one kind exists (POS) [Auto]
Precondition: common (Remark set): W11 empty, W12 three spaces (looks empty on screen, told apart by Job Description `W12`), W13 `-`. Blank = empty, spaces only or exactly `-` (BA answer 2026-11-17).
Priority: High
1. Open the filter on the `Remark` column. -> The list opens with one `-` option.
2. Tick only `-`. -> The table shows exactly W11, W12 and W13.
3. Look at the `Job Description` and `Remark` cells of the three rows. -> The Job Descriptions are `W11`, `W12`, `W13`; the Remark cells are empty, empty-looking (three spaces) and `-`.
4. On the Work Registration form `Create Work` > `Manual Create`, keep `Remark` empty with the required fields filled. -> The `Save` button is enabled.
5. Click `Save`. -> The work is saved and appears in the worklist.
6. Open the filter on the `Remark` column and tick only `-`. -> The table shows W11, W12, W13 and the new work; still one `-` option.
7. Click `Reset Table Filter`. -> The filter is cleared and all works are shown.
8. Open worklist A (normal Remarks plus only one work with an empty Remark) and open the `Remark` filter. -> A single `-` option is shown first.
9. Tick `-`. -> Only the work with the empty Remark is shown.
10. Open worklist B (normal Remarks plus only one work with a spaces-only Remark), open the `Remark` filter and tick `-`. -> A single `-` option is first and only the spaces-only work is shown.
11. Open worklist C (normal Remarks plus only one work with the Remark `-`), open the `Remark` filter and tick `-`. -> A single `-` option is first and only the work with `-` is shown.
Starting data: Remark set plus worklists A, B, C made by the test; the new work of step 4 is made by the test. What to check: row set in step 2 = {W11, W12, W13}, step 6 adds the new work, one `-` option each time. Test data set: table (worklist, Blank kind, expected rows) looped over A, B, C. Clean up: delete the new work and worklists A, B, C, clear the filter. Independent: yes.

### TC-005 [FE][BE][MT] Verify `--`, `- a`, `- ` and ` - ` are not Blank and each has its own option (NEG) [Auto]
Precondition: common (Remark set): W14 `--`, W15 `- a`, W21 `- ` (dash and one space), W22 ` - ` (space, dash, space); told apart by Job Description `W14`, `W15`, `W21`, `W22`. (BA answer 2026-11-17: `--` and `- a` are not Blank, each is its own option.)
Priority: High
1. Open the filter on the `Remark` column. -> The list opens.
2. Look for the options `--`, `- a`, `- ` and ` - `. -> All four are listed as separate options after `-`, none merged into `-`, none trimmed; `- ` and ` - ` are two different options.
3. Tick only `-`. -> The table does not show W14, W15, W21 or W22.
4. Untick `-` and tick only `--`. -> The table shows only W14.
5. Untick `--` and tick only `- `. -> The table shows only W21.
6. Untick `- ` and tick only ` - `. -> The table shows only W22.
Starting data: Remark set. What to check: W14, W15, W21 and W22 absent under `-`, one row for each own option. Clean up: clear the filter. Independent: yes.

### TC-006 [FE][BE][MT] Verify the `-` option disappears after the last Blank Remark is filled, and the list follows Remark edits on Work Registration (POS) [Auto]
Covers: no `-` option when no work has a Blank Remark (NEG), `-` disappears after the last Blank is filled, changed Remark replaces the old option, a case variant becomes its own option.
Precondition: a worklist made by the test with three works: W05 `Note 1`, W06 `Note 2` and W11 with an empty Remark. Assumption: the list is rebuilt when the page is opened again.
Priority: High
1. Open the filter on the `Remark` column. -> The first option under `Select All` is `-`; `Note 1` and `Note 2` are listed.
2. Open the menu `⋮` of W11 and click `Edit Work Details`. -> The page `Edit Work Details` opens.
3. Type `Filled now` in `Remark` and click `Save`. -> The work is saved without an error message.
4. Open the Worklist page again from the Plan Card and open the filter on the `Remark` column. -> The list contains `Filled now`, `Note 1` and `Note 2`.
5. Look under `Select All` and search the list for `-`. -> The first option is `Filled now`; no option reads `-` because no work has a Blank Remark.
6. Open `Edit Work Details` of W05, change `Remark` to `Changed note` and click `Save`. -> The work is saved.
7. Return to the Worklist table and open the filter on the `Remark` column. -> `Changed note` is listed; `Note 1` is no longer listed.
8. Tick `Changed note`. -> Only W05 is shown.
9. Untick it, open `Edit Work Details` of W06, change `Remark` to `note 1` (different case from another option) and click `Save`. -> The work is saved.
10. Return to the Worklist table and open the filter on the `Remark` column. -> `Changed note`, `Filled now` and `note 1` are listed, and `Note 2` is no longer listed.
11. Tick `note 1`. -> Only W06 is shown.
Starting data: worklist made by the test. What to check: `-` present before and absent after step 3, option list after each edit, rows of W05 and W06. Clean up: delete the worklist. Independent: yes.

### TC-007 [FE][MT] Verify a long list scrolls inside the filter and table cells with long Remarks keep the ellipsis and hover behaviour (POS) [Partial: ellipsis measured by a script, hover look checked by a person]
Covers: inner scroll of a long list, table cell ellipsis and hover unchanged by the new filter.
Precondition: a worklist made by the test with at least 60 works, each with a different Remark (`Remark 001` to `Remark 060`), plus one work W17 with a 200-character Remark that starts with `Long remark `. The `Remark` column is visible.
Priority: Medium
1. Open the filter on the `Remark` column. -> The list opens and shows only the first part of the options.
2. Scroll down inside the filter list. -> The list moves inside the panel; the page behind does not scroll.
3. Scroll to the end. -> `Remark 060` is shown last and can be ticked.
4. Close the filter without ticking an option. -> The filter closes and the table is unchanged.
5. Look at the `Remark` cell of W17 in the table. -> The text is cut with an ellipsis (…).
6. Move the mouse over the cell. -> A hover text shows the full 200-character Remark.
7. Open the filter on the `Remark` column and close it without ticking. -> The cell of W17 still shows the ellipsis, nothing changed.
Starting data: made by the test. What to check: inner scroll, last option reachable, cell overflow and hover text. Clean up: delete the works. Independent: yes.

### TC-008 [FE][BE][MT] Verify selecting one option, several options, `-`, Select All and unticking, including unticking the only ticked option (POS) [Auto]
Covers: one option, several options, `-` alone and with others, Select All, unticking one, unticking everything, unticking the only ticked option (NEG), all compared with Job Description.
Precondition: common (Remark set). Baseline (BA answer 2026-11-17): another column, the `Job Description` filter.
Priority: High
Note for the tester: if a step fails, write down the step number and continue from the next part (the next group of steps that starts with `Reset Table Filter` or a clean filter).
1. Open the filter on the `Remark` column and tick `Note 2`. -> The option is ticked.
2. Look at the table. -> Only W06 is shown and `Total Results` equals 1.
3. Untick `Note 2`. -> All works are shown again.
4. Tick `Note 1` and `Note 10`. -> Both options are ticked.
5. Look at the table. -> Only W05 and W07 are shown.
6. Also tick `-`. -> The table shows W05, W07, W11, W12 and W13.
7. Untick `Note 1`. -> `Note 10` and `-` stay ticked; the table shows W07, W11, W12 and W13.
8. Untick `Note 10`. -> Only `-` stays ticked; the table shows exactly W11, W12 and W13 (W14 `--` is not shown) and `Total Results` shows 3, equal to the number of rows.
9. Click `Reset Table Filter`. -> All works are shown.
10. Open the filter on the `Job Description` column and tick `Select All`. -> Every option is ticked.
11. Untick `Select All` in the `Job Description` filter. -> Every option is unticked; the number of rows shown by the table is written down as the Job Description reference.
12. Click `Reset Table Filter`. -> All works are shown.
13. Open the filter on the `Remark` column and tick `Select All`. -> Every option is ticked and the table shows all works.
14. Untick `Note 1`. -> The table shows all works except W05; `Select All` shows the same partly ticked state as the `Job Description` filter does in the same situation.
15. Untick `Select All`. -> Every option is unticked.
16. Look at the table. -> The table shows the same number of rows as the Job Description reference from step 11.
17. Click `Reset Table Filter`. -> All works are shown.
18. Tick one option in the `Job Description` filter and untick it again. -> No option is ticked and the number of rows shown is written down as the single-untick reference.
19. Click `Reset Table Filter`. -> All works are shown.
20. Open the filter on the `Remark` column and tick only `Note 1`. -> Only W05 is shown.
21. Untick `Note 1`. -> No option is ticked.
22. Look at the table. -> The table shows the same number of rows as the single-untick reference from step 18.
Starting data: Remark set. What to check: row set and total after each step, row counts compared with the Job Description references, no ticked option after unticking the only one. Clean up: click `Reset Table Filter`. Independent: yes.

### TC-009 [FE][MT] Verify the search box narrows the options, ignores letter case, works with Select All, and handles a text with no match and the text `-` (POS) [Auto]
Covers: search narrowing, letter case, clearing the search, Select All while a search is active, search text that matches nothing (NEG), typing `-` (NEG).
Precondition: common (Remark set): W13 `-`, W14 `--`, W15 `- a`, W21 `- `, W22 ` - `. Baseline (BA answer 2026-11-17): the search box and Select All behave exactly like the `Job Description` filter; searching `-` finds the Blank option `-`.
Priority: Medium
1. Open the filter on the `Remark` column and type `note` in the search box. -> The list shows only `Note 1`, `Note 2` and `Note 10`, the same way the `Job Description` filter lists options such as `W01` when `w0` is typed in lowercase.
2. Type `NOTE 1` instead. -> The list shows `Note 1` and `Note 10`; letter case is ignored exactly as in the `Job Description` filter with `W0`.
3. Clear the search box. -> The full list is shown again.
4. Type `Note` in the search box. -> Three options are listed.
5. Tick `Select All`. -> The three Note options are ticked.
6. Clear the search box. -> The other options are not ticked.
7. Look at the table. -> Only W05, W06 and W07 are shown.
8. Click `Reset Table Filter`. -> All works are shown.
9. Open the filter on the `Remark` column and note the number of rows in the table. -> The row count is written down.
10. Type `zzzz` in the search box. -> No value option is listed under `Select All` and no `-` option is listed.
11. Tick `Select All`. -> No row is added to or removed from the table; the row count is the same as the count written down in step 9.
12. Clear the search box. -> The full list of options is shown again.
13. Click `Reset Table Filter`. -> All works are shown.
14. Open the filter on the `Remark` column and type `-` in the search box. -> The options `-`, `--`, `- a`, `- ` and ` - ` are listed; options without a hyphen (for example `Note 1`) are not listed.
15. Tick only the option `-`. -> The table shows W11, W12 and W13, not W14, W15, W21 or W22.
Starting data: Remark set. What to check: option list after each text, ticked set and rows, row count unchanged after the no-match search, option list for the text `-`. Clean up: clear the filter. Independent: yes.

### TC-010 [FE][MT] Verify the Remark filter looks like the other column filters (POS) [Manual: a person judges look and spacing]
Precondition: common (Remark set)
Priority: Low
1. Open the filter on the `Job Description` column. -> The panel is shown; its look is noted.
2. Open the filter on the `Remark` column. -> The panel is shown.
3. Compare fonts, checkbox style, spacing and search box. -> Both panels use the same components and look the same.

### TC-011 [FE][BE][MT] Verify the Remark filter works together with the search box, another column filter and sorting, and its options come from all works (POS) [Auto]
Covers: search + Remark filter + Job Owner filter + sort together, and the option source (all works of the worklist).
Precondition: common (Remark set). Job Owner of W05 is `Somchai Test` and of W06 is `Malee Test` (made-up names). Fact (BA answer 2026-11-17): options come from all works of the worklist; other filters and the quick search do not shrink them.
Priority: High
1. Type `W0` in the search box `Search work number and job description`. -> Only W01 to W09 are shown (Job Descriptions `W01` to `W09`).
2. Open the filter on the `Remark` column and tick `Note 1` and `Note 2`. -> Only W05 and W06 are shown.
3. Sort the `Job Description` column ascending. -> W05 is shown above W06.
4. Sort it descending. -> W06 is shown above W05.
5. Open the filter on the `Job Owner` column and tick `Somchai Test`. -> Only W05 is shown.
6. Clear the search box. -> Only W05 is shown (the Remark and Job Owner filters stay).
7. Open the filter on the `Remark` column. -> The list opens.
8. Look at the options. -> `-`, `Note 1`, `Note 2`, `Note 10`, `Test` and all other Remark values of the worklist are listed, not only `Note 1` and `Note 2`.
9. Type `W05` in the search box `Search work number and job description`. -> Only W05 is shown.
10. Look at the options of the `Remark` filter again. -> The same options as in step 8 are listed.
Starting data: Remark set with the owners above. What to check: expected rows at each step; option list equals the list of all stored Remarks (Blank merged into `-`). Test data set: table (search text, Remark options, owner, sort, expected rows) looped over the rows. Clean up: click `Reset Table Filter`. Independent: yes.

### TC-012 [FE][BE][MT] Verify strange Remark values are listed exactly as stored, can be searched and filtered (Exotic: strange input) [Auto]
Precondition: common (Remark set): W10 Thai, W16 emoji, W17 200 chars, W18 comma, W19 special characters.
Priority: High
1. Open the filter on the `Remark` column. -> The list opens.
2. Read the options for W10, W16, W17, W18 and W19. -> Each is shown exactly as stored: `ซ่อมด่วน`, `Check valve 🔧`, the 200-character text, `Valve A, B`, `100% <b>ok</b> "x" & y` (no bold text, no cut characters).
3. Type the stored value of one strange Remark into the search box. -> Only that option is listed.
4. Tick that option. -> Only its work is shown.
5. Repeat steps 3 and 4 for each strange value. -> Each time only the matching work is shown and the page stays usable.
Starting data: Remark set. Test data set: table (value, expected work) from W10, W16, W17, W18, W19, looped over each row. Clean up: clear the filter. Independent: yes.

### TC-013 [FE][BE][MT] Verify Remark text with HTML or script is shown as plain text and nothing runs (NEG) [Auto]
Precondition: a worklist with two works made by the test: one with Remark `<b>x</b>` and one with Remark `<script>alert(1)</script>`.
Priority: High
1. Open the filter on the `Remark` column. -> The list opens and no alert dialog appears.
2. Read the two options. -> They read exactly `<b>x</b>` and `<script>alert(1)</script>` as plain text; the first is not shown in bold.
3. Tick the option `<script>alert(1)</script>`. -> Only its work is shown, its Remark cell shows the same plain text and no alert dialog appears.
4. Type `<b>` in the search box. -> The option `<b>x</b>` is listed as plain text.
Starting data: two works made by the test. What to check: option text, no dialog, no console error about a script. Clean up: delete the works. Independent: yes.

### TC-014 [FE][MT] Verify the filter of a worklist with no works (Exotic: empty worklist) [Auto]
Precondition: a worklist with no works (`No results found`, `Total Results: 0`). Assumption: the panel lists no values; the exact text is not designed.
Priority: Low
1. Open the filter on the `Remark` column. -> The panel opens without an error.
2. Look at the list. -> No `-` option and no value options are listed.
3. Close the panel. -> The table still shows `No results found`.
Starting data: new empty worklist. What to check: no error, no options. Clean up: delete the worklist. Independent: yes.

### TC-015 [FE][BE][MT] Verify filter selections with comma, ampersand, percent, `-` and a leading space survive a page reload (Exotic: special characters in the page address) [Auto]
Precondition: common (Remark set): W18 `Valve A, B`, W19 `100% <b>ok</b> "x" & y`, W11-W13 Blank, W03 ` Test` (one space before Test). Assumption: table filters are kept in the page address (module doc) and a reload restores them.
Priority: High
1. Open the filter on the `Remark` column and tick `Valve A, B`. -> Only W18 is shown.
2. Reload the page. -> Only W18 is shown and `Valve A, B` is ticked as one option; no other option is ticked.
3. Untick it and tick `100% <b>ok</b> "x" & y`. -> Only W19 is shown.
4. Reload the page. -> Only W19 is shown and that option is ticked; no other option is ticked.
5. Untick it and tick `-`. -> W11, W12 and W13 are shown.
6. Reload the page. -> W11, W12 and W13 are shown and `-` is ticked; no other option is ticked.
7. Untick it and tick the option with one space before `Test`. -> Only W03 is shown.
8. Reload the page. -> Only W03 is shown and that option is ticked; the option `Test` is not ticked.
Starting data: Remark set. What to check: row set and ticked options after each reload. Test data set: table (option, expected works) looped over the four rows. Clean up: click `Reset Table Filter`. Independent: yes.

### TC-016 [FE][BE][MT] Verify an old saved Remark text filter and the old Remark page address parameter are cleared after the release (POS) [Partial: the saved state must be created before the release; the old-address part can be automated]
Precondition: BA answer 2026-11-17: after release the Remark filter starts at Select All; the old text filter and the old Remark parameter are ignored without conversion or error; other columns' saved filters are unaffected. A test user who, BEFORE the release, saved a Remark text filter `Contains` `Note` and a `Job Owner` filter `Somchai Test` (made-up name) on the Remark set worklist. If the system keeps no filter state, run only steps 2, 8 and 9 with the old address (steps 5 and 6 then do not apply).
Priority: High
1. Before the release, as the test user, set the Remark text filter `Contains` `Note` and the `Job Owner` filter `Somchai Test`. -> The table shows only works that match both filters.
2. Copy the page address that holds the old Remark parameter and the Job Owner parameter. -> The old address is saved for later.
3. After the release, log in with the same user and open the Worklist from the Plan Card. -> The page opens normally with no error message.
4. Open the filter on the `Remark` column. -> The checkbox list opens with `Select All` and every option ticked; no `Contains`, `Blank` or `Not blank` condition is left.
5. Look at the table. -> The Remark filter does not narrow the rows: the table shows all works of `Somchai Test`.
6. Open the filter on the `Job Owner` column. -> Only `Somchai Test` is still ticked (the saved Job Owner filter is unaffected).
7. Click `Reset Table Filter`. -> All works are shown and the Job Owner filter is cleared.
8. Open the old address from step 2 in a new tab. -> The Worklist page opens normally without an error message and without a redirect to the Shutdown Event List page.
9. Look at the table and open the filter on the `Remark` column. -> The table shows only the works of `Somchai Test` (the Job Owner parameter is still applied) and every Remark option is ticked, so the old Remark parameter is ignored.
Starting data: a pre-release saved state of the test user, made by hand or from a pre-release snapshot. What to check: no error, Remark at Select All, Job Owner filter kept, old address ignored. Clean up: click `Reset Table Filter`. Independent: yes.

## Trim log

### Trim 2: 27 -> 16
Requested by the user (too many cases). Old numbers = the 27-case file; new numbers = this 16-case file. Every step and expected result was kept inside the surviving case; only duplicated set-up steps were added between merged parts (a `Reset Table Filter` or an untick) so each part starts clean. Priority is the highest of the merged cases.
- Old TC-002 (filter opens from the Plan Card) + old TC-003 (old text filter gone, NEG) + old TC-004 (each value listed once) + old TC-005 (case and space variants) -> new TC-002 (steps 1-8 path and panel parts, no condition dropdown, Job Owner panel compared; steps 9-12 one `Note 1` option; steps 13-17 four Test options).
- Old TC-009 (no `-` option when no Blank, NEG) + old TC-010 (`-` disappears after the last Blank is filled) + old TC-022 (edit Remark updates the list) -> new TC-006 (the NEG check is step 5; the edit steps are 6-11).
- Old TC-011 (long list scrolls) + old TC-012 (table cells keep ellipsis and hover) -> new TC-007 (the two parts share one worklist with 60 works and one 200-character Remark).
- Old TC-013 (select and untick) + old TC-014 (untick the only ticked option, NEG) -> new TC-008 (steps 17-22).
- Old TC-015 (search) + old TC-016 (search no match, NEG) + old TC-017 (search `-`, NEG) -> new TC-009 (steps 9-13 no match; steps 14-15 text `-`).
- Dropped: old TC-024 (large worklist of 5,000 works, manual): no response time target exists, so a person had nothing to judge against; the BA question about speed was removed from Open questions. Old TC-026 (two users): the Story does not ask for live refresh and no AC item depends on it.
- Kept, old -> new: 001 -> 001; 006 -> 003; 007 -> 004; 008 -> 005; 018 -> 010; 019 -> 011; 020 -> 012; 021 -> 013; 023 -> 014; 025 -> 015; 027 -> 016.

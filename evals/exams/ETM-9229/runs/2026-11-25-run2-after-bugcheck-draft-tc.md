# ETM-8391 Draft test cases: Worklist Remark column filter

Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter (Ready For Development).
Source: story.md (Story, BA comment 11 Nov 2026, BA answers DEC-040), analyst.md, docs/modules/core-navigation-worklist.md, knowledge/. No Figma (BA: use the existing filter look).
Existing [QA] subtasks: ETM-8575 Create Test Case Manual Test, ETM-8576 Execute Test Case Manual Test (reuse).
Roles: TM (can do everything) and JO (view only). Only these two exist on QA.

Common precondition: logged in as TM with View Worklist permission. A Worklist is open from a Worklist Item in a Plan Card on the Planning tab of a Shutdown Event. The Worklist holds works with these Remark values (data set R): `Test`, `test`, ` Test` (leading space), `Test ` (trailing space), `Note 1`, `Note 2`, `Note 10`, `main deck`, `Main Deck`, `_start`, `(a)`, `[b]`, `7 days`, `ซ่อมบำรุง`, `-` (literal), `--`, `- `, ` - `, spaces only, empty. Data owned by the card; use own test Worklist only.

Notation: `Select All` = the first option of the filter panel; `-` = the Blank option; "Apply" closes the panel.
Test-data note: before seeding, check each value can be made on screen (Create Work Remark field, Edit Work, Import Excel). Leading/trailing/only spaces may be trimmed by the form (see Open question 1).

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 checklist replaces text filter | Screen states | Old Contains/Blank/Not blank still shown | TC-001, TC-002 |
| AC-2 distinct values, case and spaces separate | Input groups, Error guessing | Variants merged or trimmed | TC-003, TC-004 |
| AC-3 `-` first, only when Blank exists, literal `-`, `--`, `- ` rules | Decision table, Boundary | Duplicate `-`, wrong Blank, `-` missing/always shown | TC-005, TC-006, TC-007, TC-008 |
| AC-4 order localeCompare en numeric | Decision table | `Note 10` before `Note 2`; case, Thai, symbols | TC-009, TC-010 |
| AC-5 long list scroll, ellipsis and hover | Screen states (very many rows, very long) | Cut off, no tooltip, tooltip on short | TC-011, TC-012, TC-013 |
| AC-6 table cell ellipsis/hover unchanged | Regression | Cell behaviour changed | TC-014 |
| AC-7 result of selection, `-` shows Blank works | Condition table | Wrong rows, wrong count | TC-015, TC-016, TC-017 |
| AC-8 Nualta layout look | Screen states | Panel looks different from other columns | TC-001 |
| AC-9 precondition, permission | Roles | JO or no-permission leak | TC-018 |
| AC-10 Remark free text, not mandatory | Strange input | Special characters break filter | TC-019 |
| AC-11 start at Select All, old URL param, other columns | Leaving and coming back | Error on old URL, other filters reset | TC-020, TC-021 |
| Filter + Sort + Search together (lesson 2, L-3) | Combinations | Options shrink, stale rows | TC-022 |
| Special option survives (L-2) | Leaving and coming back | `null` in URL, lost on reload | TC-023 |
| Nothing ticked | Screen states (empty) | Table not empty | TC-024 |
| Search box in the panel | Field interaction | Search of `-`, Select All on results | TC-025 |
| Two users / fresh data (lesson 1) | Two users | Options stale after edit | TC-026 |
| Keyboard use of the panel | Real-user view | Cannot use without mouse | TC-027 |
| Leave and return routes (reload, Back, breadcrumb, edit page) x `-`, one option, several, nothing ticked | Leaving and coming back | Selection lost or stale | TC-028, TC-029, TC-030 |
| Remark + other column filter, quick search set/clear, panel search reopen, edit-page refresh | Combinations | Filters reset each other, stale options | TC-031, TC-032, TC-033, TC-034 |
| Dirty state (unsaved warning) | n/a | The filter has no Save button, the Story gives none | not applicable |

Lessons and categories: 1 relevant (TC-026). 2 relevant (TC-022). 3 relevant, old works with empty Remark (TC-005, TC-020). 4 relevant (TC-019). 5 not relevant, no reorder of rows in this Story. 6 not relevant, filter only reads data (the edit refresh is TC-026). 7 not relevant, no charts on this page. 8 not relevant, Remark filter exists on the Worklist table only (Open question 6). 9 relevant as one decision table (TC-007). L-1 TC-009. L-2 TC-023. L-3 TC-022. L-4 to L-8 not relevant (no paste, no collapse, no picker, no Import duplicate rule; Story text compared in L-8 is the lead's pre-run step).
Screen states: normal TC-001; empty (no Remark at all) TC-006; loading, see TC-022 (wait for response); error, not designed (Open question 5); disabled, none in Story; read-only (JO) TC-018; no permission TC-018; very long TC-012; very many rows TC-011.

Counts: High 15 / Medium 16 / Low 3. Auto 30 / Partial 0 / Manual 4.

## Open questions

1. Can the screen create Remark values with leading/trailing spaces, spaces only, and `-` (Create Work, Edit Work, Import Excel)? If a path trims them, TC-004, TC-005, TC-008 need another way to seed. Missing - ask.
2. Does the Remark option list ignore multi-line Remark (new line inside a Remark)? One option or cut at the new line? Missing - ask.
3. Exact tooltip width threshold for "longer than filter width" is not given; cases use a Remark of 200 characters and a short one. Assumption.
4. After a Remark is edited and saved, does an open Worklist page update its options without reload? TC-026 assumes reload is needed. Missing - ask.
5. Is there an error or loading state for the filter list (request fails)? Not in Story. Suggestion (not in Story): ask the BA for the message.
6. Suggestion (not in Story): does a Remark filter exist on other pages (Daily Report, Work Repository)? Only the Worklist table is in the Story.
7. Searching `-` finds the Blank option `-`; does it also list every option containing `-` (`--`, `- `)? Assumed yes (same as Job Description filter).
8. How is an old saved filter (Save Filter, ETM-8553) with a Remark text condition handled after release: ignored on load, or the whole saved filter dropped? TC-020 step 4 assumes only the Remark part is cleared. Missing - ask.
9. After leaving the page by breadcrumb or edit page and returning, does the Worklist keep column filters or start fresh? Not in the Story; cases TC-028 to TC-030, TC-033 expect the same as the Job Description filter. Missing - ask.

## Test cases (34 flows)

### TC-001 [FE][MT] Verify the Remark filter is a checkbox list with search box and Select All (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-8
1. Open the Worklist page. -> The table shows the column `Remark` with a filter icon in its header.
2. Open the Remark filter. -> A panel opens with a search box, the option `Select All` and a checkbox list of the Remark values.
3. Look for the old options `Contains`, `Blank`, `Not blank`. -> None of them appears; there is no text input for a condition.
4. Open the filter of the column `Job Description`. -> The Job Description panel has the same layout (search box, Select All, checkbox list) as the Remark panel.
Starting data: data set R. Check: panel parts. Data set: none. Clean up: none.

### TC-002 [FE][MT] Verify Select All ticks and unticks every Remark option (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1
1. Open the Remark filter. -> All options and `Select All` are ticked; the table shows all works.
2. Untick `Select All`. -> Every option becomes unticked.
3. Tick `Select All`. -> Every option becomes ticked again.
4. Untick one option. -> `Select All` becomes unticked (or partly ticked as in the Job Description filter); the other options stay ticked.
Starting data: data set R. Check: states against the same steps in the Job Description filter. Clean up: tick Select All.

### TC-003 [FE][MT] Verify each distinct Remark appears once and case or space variants are separate options (POS) [Auto]
Precondition: common; works with Remark `Test`, `test`, ` Test`, `Test ` (two works have `Test`)
Priority: High
Trace: AC-2
1. Open the Remark filter. -> The list is shown.
2. Count the options that look like `Test` (any case, with or without a space). -> Four separate options exist: `Test`, `test`, ` Test`, `Test `; `Test` appears once although two works have it.
3. Untick `Select All`, then tick only `Test`. -> Only works whose Remark is exactly `Test` are shown; works with `test`, ` Test` and `Test ` are not shown.
4. Untick `Test`, then tick only `test`. -> Only works whose Remark is exactly `test` are shown.
Starting data: as in precondition. Data set (loop): the four values; expected = count of works holding that exact value. Clean up: tick Select All.

### TC-004 [FE][MT] Verify options show Remark exactly as stored without trimming (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2
1. Open the Remark filter. -> The list is shown.
2. Read the option made from the Remark ` Test`. -> The option text keeps the leading space and is a separate option from `Test`.
3. Read the option made from `Test `. -> The option keeps the trailing space and is a separate option from `Test`.
4. Tick only ` Test`. -> Only the works with ` Test` are shown.
Starting data: depends on Open question 1. Check: exact option text (DOM text, not trimmed). Clean up: tick Select All.

### TC-005 [FE][MT] Verify the `-` option is first, directly under Select All (POS) [Auto]
Precondition: common (empty Remark and spaces-only Remark exist)
Priority: High
Trace: AC-3
1. Open the Remark filter. -> The list is shown.
2. Read the options from the top. -> The order is `Select All`, then `-`, then all other options.
3. Compare `-` with the alphabetical order of the others. -> `-` is not placed by the sort; it stays first even though other options start with symbols or digits.
Starting data: data set R. Clean up: none.

### TC-006 [FE][MT] Verify no `-` option appears when no work has a Blank Remark (NEG) [Auto]
Precondition: common, but every work has a Remark of real text (no empty, no spaces only, no literal `-`)
Priority: High
Trace: AC-3
1. Open the Remark filter. -> The list is shown.
2. Look for the option `-`. -> There is no `-` option; the first option under `Select All` is the first sorted Remark.
Starting data: own worklist with only filled Remarks. Clean up: none.

### TC-007 [FE][MT] Verify which Remark values count as Blank (BND) [Auto]
Precondition: common; one work per value in the table below
Priority: High
Trace: AC-3
1. Open the Remark filter. -> The list is shown; exactly one option `-` exists (no duplicate).
2. Untick `Select All`, tick only `-`. -> The table shows exactly the works marked "Blank" in the table below.
3. Read the other options. -> Every value marked "own option" is listed as its own option, not trimmed.

| Remark stored | Result |
|---|---|
| empty | Blank (under `-`) |
| spaces only (3 spaces) | Blank |
| `-` | Blank |
| `--` | own option |
| `- ` (dash and trailing space) | own option |
| ` - ` (spaces around) | own option, different from `- ` |
| `- a` | own option |

Starting data: one work per row. Data set: the table; the test loops over it. Clean up: tick Select All.

### TC-008 [FE][MT] Verify empty, spaces-only and literal `-` Remarks give one `-` option, not three (POS) [Auto]
Precondition: common; three works: Remark empty, Remark 3 spaces, Remark `-`
Priority: High
Trace: AC-3
1. Open the Remark filter. -> The list is shown.
2. Count the options named `-`. -> Exactly one `-` option exists.
3. Tick only `-`. -> All three works are shown.
Starting data: three works. Clean up: tick Select All.

### TC-009 [FE][MT] Verify numbers in text sort as numbers (BND) [Auto]
Precondition: common; Remarks `Note 10`, `Note 2`, `Note 1`, `Item 9`, `Item 10`
Priority: High
Trace: AC-4
1. Open the Remark filter. -> The list is shown.
2. Read the order of the `Note` options. -> `Note 1`, `Note 2`, `Note 10`.
3. Read the order of the `Item` options. -> `Item 9` comes before `Item 10`.
Starting data: as in precondition. Expected-values table: the options in the order of localeCompare('en', {numeric: true}) computed in the test from the same list; the shown order must equal it. Clean up: none.

### TC-010 [FE][MT] Verify the full sort order of symbols, digits, letters, case and Thai (POS) [Auto]
Precondition: common (data set R)
Priority: Medium
Trace: AC-4
1. Open the Remark filter. -> The list is shown with `-` first.
2. Read all options after `-`. -> Order is symbols (`_start`, `(a)`, `[b]`), then digits (`7 days`), then English letters ignoring case, then Thai (`ซ่อมบำรุง`) last.
3. Read `main deck` and `Main Deck`. -> `main deck` comes before `Main Deck` (same letters: lowercase first).
Starting data: data set R. Expected-values table: the order from localeCompare('en', {numeric: true}) over the stored values. Clean up: none. Note: if this order differs from the same rule in the Job Description filter, record a bug (known open item C-10).

### TC-011 [FE][MT] Verify a very long option list scrolls inside the filter (BND) [Auto]
Precondition: common; at least 200 distinct Remark values (large worklist)
Priority: Medium
Trace: AC-5
1. Open the Remark filter. -> The panel opens at a fixed height with its own scroll bar; the page does not grow.
2. Scroll to the bottom of the list. -> The last option (sorted last) is reachable and ticked.
3. Scroll back to the top. -> `-` and `Select All` show first.
Starting data: 200+ distinct Remarks (generated by Import Excel). Clean up: delete the generated works the card owns.

### TC-012 [FE][MT] Verify a long option ends with an ellipsis and hover shows the full text (BND) [Auto]
Precondition: common; one work with a 200-character Remark, one with `Short`
Priority: High
Trace: AC-5
1. Open the Remark filter. -> The list is shown.
2. Look at the 200-character option. -> It is cut at the filter width and ends with `…`.
3. Hover over that option. -> A tooltip shows the full 200-character text.
4. Hover over the option `Short`. -> No tooltip appears.
Starting data: as in precondition. Clean up: none.

### TC-013 [FE][MT] Verify the full-text tooltip of a long option matches the stored Remark (POS) [Manual: visual check of tooltip position]
Precondition: common; one work with a 200-character Remark
Priority: Low
Trace: AC-5
1. Open the Remark filter and hover over the long option. -> The tooltip uses the same look as the tooltip of the Job Description filter and shows the whole text without cutting.
2. Move the mouse away. -> The tooltip closes.

### TC-014 [FE][MT] Verify table cells keep ellipsis and hover text for a long Remark (POS) [Auto]
Precondition: common; one work with a 200-character Remark
Priority: Medium
Trace: AC-6
1. Find the work in the table. -> The Remark cell ends with an ellipsis.
2. Hover over the cell. -> The full Remark shows on hover, as before this Story.
Starting data: as in precondition. Clean up: none.

### TC-015 [FE][MT] Verify selecting one option shows only works with that Remark (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7
1. Record `Total Results` with Select All ticked. -> The value is written down.
2. Untick `Select All`, then tick only `Note 2`. -> The table shows only works whose Remark is `Note 2`; `Total Results` equals the number of such works.
3. Tick `Note 10` as well. -> Works with `Note 2` or `Note 10` are shown; the count is the sum.
4. Tick `Select All`. -> The count returns to the value from step 1.
Starting data: data set R. Wait for the search response before reading rows (L-3). Clean up: none.

### TC-016 [FE][MT] Verify selecting `-` shows the works with Blank Remark (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7, AC-3
1. Untick `Select All`, then tick only `-`. -> The table shows only works whose Remark is empty, spaces only or `-`; `Total Results` equals their count.
2. Read the Remark cells of the shown works. -> Each is empty, spaces or `-`; no `--`, `- ` or ` - ` work is shown.
Starting data: data set R. Clean up: tick Select All.

### TC-017 [FE][MT] Verify `-` together with a text option (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Untick `Select All`, tick `-` and `Test`. -> The table shows Blank works and works with Remark `Test`; works with other Remarks are hidden.
2. Untick `-`. -> Only works with `Test` stay.
Starting data: data set R. Clean up: tick Select All.

### TC-018 [FE][MT] Verify access and role limits for the Remark filter (POS) [Manual: needs second account and a direct-link check]
Precondition: JO account; a user without View Worklist permission
Priority: High
Trace: AC-9
1. Log in as JO and open the Worklist from the Active plan. -> The page opens; the Remark filter opens and can be used (filtering is a view action).
2. Log in as a user without View Worklist permission and open the Worklist direct link. -> The page does not open (existing behaviour: redirect to the Shutdown Event List); no Remark data shows.
3. As TM open the Worklist from a Plan Card. -> The page opens with the Remark filter.
Note: JO cannot open a plan that is not Active (existing rule).

### TC-019 [FE][MT] Verify strange Remark values show exactly as stored and can be filtered (Exotic: strange input) [Auto]
Precondition: common; Remarks: `<script>alert(1)</script>`, `50% & "quote"`, `a/b\c`, `😀😀`, Thai `ทดสอบ`, `Line1` plus a new line plus `Line2`
Priority: Medium
Trace: AC-10
1. Open the Remark filter. -> Each value is an option; text is shown as typed, no script runs, no layout break.
2. Tick only one such option at a time. -> Only works with that exact Remark are shown.
3. Type part of one value in the filter search box. -> The matching option is listed.
Starting data: as in precondition (see Open questions 1 and 2). Data set (loop): the six values. Clean up: tick Select All.

### TC-020 [FE][MT] Verify the filter starts at Select All after release and an old Remark URL parameter is ignored (NEG) [Auto]
Precondition: common; an old page address that holds a Remark text filter (Contains `Test`, or Blank, or Not blank); a saved filter (Save Filter, subtask ETM-8553) made before the release that holds a Remark text filter Contains `Test` (see Open question 8)
Priority: High
Trace: AC-11
1. Open the Worklist with the old Remark parameter in the address. -> The page opens normally with no error message.
2. Open the Remark filter. -> All options and `Select All` are ticked; the table shows all works.
3. Read the address. -> The old Remark parameter is not applied.
4. Open the saved filter list and apply the old saved filter. -> The page opens without error; the old Remark text condition is cleared; the Remark filter is at Select All and the table shows all works.
5. Reload the page. -> The Remark filter is still at Select All; no stored Remark text condition comes back.
Starting data: the old-format address and the old saved filter as in precondition. Clean up: delete the saved filter the card made, Reset Table Filter.

### TC-021 [FE][MT] Verify other columns' saved filters stay when the old Remark parameter is cleared (POS) [Auto]
Precondition: common; an address with a Work Status filter and an old Remark parameter
Priority: High
Trace: AC-11
1. Open the address. -> The page opens without error.
2. Open the Work Status filter. -> The saved Work Status selection is still ticked and the table follows it.
3. Open the Remark filter. -> Starts at Select All.
Starting data: as in precondition. Clean up: Reset Table Filter.

### TC-022 [FE][MT] Verify Remark filter together with search, other filters and Reset (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-7, AC-2
1. Tick only `Test` in the Remark filter and apply. -> The table shows works with Remark `Test`; the count is written down.
2. Type a work number of one of those works in `Search work number and job description` and press Enter. -> After the response arrives, only that work shows; `Total Results` is 1.
3. Open the Remark filter again. -> The list still holds every option of the worklist (other filters and the quick search do not shrink it).
4. Filter a second column (Status) and sort a column. -> Rows match both filters; order follows the sort.
5. Press `Reset Table Filter`. -> All works are shown and the Remark filter is back at Select All.
Starting data: data set R. Rule: close the panel with Apply before typing in the search box; wait for the response. Clean up: Reset Table Filter.

### TC-023 [FE][MT] Verify the `-` choice survives reload, re-open and leaving the page (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-7, AC-3
1. Tick only `-` and apply. -> The Blank works show; the page address holds a normal Remark value, not `null`.
2. Reload the page. -> The Remark filter still has only `-` ticked and the same works show.
3. Open the Remark filter again. -> `-` is ticked, the others are not.
4. Open another page of the plan and press browser Back. -> The same selection and rows show.
Starting data: data set R. Clean up: tick Select All.

### TC-024 [FE][MT] Verify nothing ticked shows an empty table (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Untick `Select All`. -> No option is ticked.
2. Apply. -> The table shows `No results found` and `Total Results: 0` (same as every other column).
3. Tick `Select All`. -> All works come back.
Starting data: data set R. Clean up: none.

### TC-025 [FE][MT] Verify the filter search box finds options, including `-` (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1, AC-3
1. Type `note` in the panel search box. -> Only options containing `note` (any case) are listed, same as the Job Description filter.
2. Clear the box, then type `-`. -> The Blank option `-` is listed; the options `--` and `- ` (dash and trailing space) are listed too, as they contain `-` (Open question 7).
3. Type `zzzz`. -> The list shows an empty state as in the Job Description filter.
4. Clear the search text and keep the panel open. -> The full list returns.
Starting data: data set R. Clean up: none.

### TC-026 [FE][MT] Verify options follow data changed by another user (Exotic: two users) [Manual: needs two accounts]
Precondition: common; user A and user B open the same Worklist
Priority: Medium
Trace: AC-2, AC-3
1. User B edits the only Blank work and saves Remark `Fresh note`. -> The save succeeds.
2. User A, without reloading, opens the Remark filter. -> The list is the same as before: `-` is still there and `Fresh note` is not (Open question 4: this is the assumed behaviour; if the BA says the page updates by itself, this expectation changes).
3. User A reloads the page and opens the Remark filter. -> `Fresh note` is an option and `-` is gone.
4. User B clears that Remark again. -> The save succeeds.
5. User A reloads and opens the Remark filter. -> `-` is back, first; `Fresh note` is gone.

### TC-027 [FE][MT] Verify the filter can be used with the keyboard only (Exotic: keyboard) [Manual: focus order check]
Precondition: common
Priority: Low
Trace: none (real-user view, keyboard)
1. Tab to the Remark filter icon and press Enter. -> The panel opens and focus goes into it.
2. Tab through search box, `Select All` and options, press Space on one option. -> The option is ticked or unticked; the focus order follows the screen order.
3. Press Esc. -> The panel closes and the table keeps the selection.

### TC-028 [FE][MT] Verify the `-` choice survives the breadcrumb and an edit page round trip (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7, AC-3
1. Tick only `-` and apply. -> The Blank works show; `Total Results` is written down.
2. Click a breadcrumb link to the Shutdown Event, then return to the Worklist from the Plan Card. -> The Remark filter has only `-` ticked and the same works show, or (if the page starts fresh for a new visit) it is at Select All as the other column filters behave (Open question 9).
3. Open the edit page of one shown work, then return with the in-app link. -> The Remark filter and the rows are as in step 2.
Starting data: data set R. Check against what the Job Description filter does on the same route. Clean up: tick Select All.

### TC-029 [FE][MT] Verify one text option stays ticked across reload, Back, breadcrumb and edit page (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Tick only `Test` and apply. -> Works with Remark `Test` show.
2. Reload the page. -> Only `Test` is ticked; the same works show.
3. Open another page of the plan, then press browser Back. -> Only `Test` is ticked; the same works show.
4. Click a breadcrumb link and return to the Worklist. -> The selection is the same as the Job Description filter keeps on the same route (Open question 9).
5. Open the edit page of one shown work and return. -> The selection and rows are as in step 4.
Starting data: data set R. Clean up: tick Select All.

### TC-030 [FE][MT] Verify several ticked options and nothing ticked survive reload and Back (BND) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Tick only `-` and `Test` and apply. -> Blank works and `Test` works show.
2. Reload the page. -> Only `-` and `Test` are ticked; the same rows show.
3. Open another page of the plan, then press browser Back. -> Only `-` and `Test` are ticked; the same rows show.
4. Untick `Select All` so nothing is ticked and apply. -> `No results found` and `Total Results: 0` show.
5. Reload the page. -> The table shows the same state as the Job Description filter shows with nothing ticked after reload (Open question 9).
6. Press browser Back after another plan page. -> Same state as in step 5.
Starting data: data set R. Clean up: Reset Table Filter.

### TC-031 [FE][MT] Verify the Remark filter together with another column filter after reload (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7, AC-11
1. Tick only `Test` in the Remark filter and apply. -> Works with `Test` show.
2. Tick one value in the Work Status filter and apply. -> Rows match both filters; count written down.
3. Reload the page. -> Both filters keep their selection; the same rows and count show.
Starting data: data set R. Clean up: Reset Table Filter.

### TC-032 [FE][MT] Verify the Remark filter and the quick search change and clear each other without side effects (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-7
1. Tick only `Test` and apply. -> Works with `Test` show.
2. Type a work number of one of them in `Search work number and job description` and press Enter. -> Only that work shows.
3. Clear the quick search. -> The works with `Test` show again; the Remark filter still has only `Test` ticked.
4. Type the work number again and press Enter, then change the Remark filter to `Note 2` and apply. -> The table follows both: the work number must also have Remark `Note 2` to show; otherwise `No results found`.
5. Clear the Remark filter by ticking `Select All`. -> Rows follow the quick search only.
Starting data: data set R. Rule: wait for the response before reading rows. Clean up: clear the quick search.

### TC-033 [FE][MT] Verify the search text in the panel is handled when the panel is closed and reopened (BND) [Auto]
Precondition: common
Priority: Low
Trace: AC-1
1. Type `note` in the panel search box. -> Only options containing `note` are listed.
2. Close the panel by clicking outside it. -> The panel closes; the table is unchanged.
3. Open the Remark filter again. -> The search box is empty and the full list shows, or it keeps `note` as the Job Description filter does on the same steps (Open question 9).
Starting data: data set R. Clean up: none.

### TC-034 [FE][MT] Verify options update after a work's Remark is edited on its edit page and the user returns (POS) [Auto]
Precondition: common; one work whose Remark is `Draft note` that no other work has
Priority: Medium
Trace: AC-2, AC-3
1. Open the Remark filter. -> `Draft note` is an option.
2. Open the edit page of that work and change the Remark to `Final note`, then save. -> The save succeeds.
3. Return to the Worklist. -> The Remark filter shows `Final note` as an option and `Draft note` is gone.
4. Open the edit page again and clear the Remark, then save and return. -> The `-` option is first under `Select All` and `Final note` is gone.
Starting data: own work with a unique Remark. Clean up: restore the original Remark.

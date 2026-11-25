# ETM-8391 Analyst notes (Worklist Remark column filter) - LEAD ทำเอง

Source: story.md only (no Figma; Story status Ready For Development). Labels: Fact / Assumption / Missing - ask.

## AC items

- AC-1: Remark filter is a checkbox list with search box and Select All, like other columns; it replaces the old text filter (Contains / Blank / Not blank). (Fact, AC 1)
- AC-2: Options = each distinct Remark value in the worklist, exactly as stored; values differing in letter case or leading/trailing spaces are separate options. (Fact, AC 2.1)
- AC-3: A `-` option (Blank) appears only if some work has a Blank Remark; always first, directly under Select All, outside the sort. Blank = empty, spaces only, or literally `-`. (Fact, AC 2.2)
- AC-4: All other options sorted A to Z with localeCompare('en', { numeric: true }). (Fact, AC 2.3)
- AC-5: Long list scrolls inside the filter; options wider than the filter end with an ellipsis and hover shows the full text. (Fact, AC 3)
- AC-6: Table cells keep existing behavior: ellipsis, full text on hover. (Fact, AC 3)
- AC-7: Only works whose Remark matches a selected option are shown; selecting `-` shows works with Blank Remark (per AC-3). (Fact, AC 4)
- AC-8: Page is built with Nualta Design System components. (Fact, UI Design; no mockup yet)
- AC-9: Pre-conditions: logged in with View Worklist permission; page opened from the Worklist Item in a Plan Card on the Planning tab. (Fact, Pre-Conditions)
- AC-10: Data rule: Remark is free text, not mandatory. (Fact, Data Source)
- AC-11: After release the Remark filter starts at Select All; an old saved text filter and the old Remark URL parameter are cleared/ignored (no error, no conversion, page opens normally, all works shown); other columns' saved filters are unaffected. (Fact, BA answer 2026-11-17 DEC-040; not yet in the Jira AC, BA will add it as AC 5)

## Could still break

- Remark values `Test`, `test`, ` Test` and `Test ` all in one worklist: four separate options, each selects only its own works. (Fact, AC-2)
- A Remark of spaces only and a Remark of `-` both land in the `-` option; a Remark such as `--` or `- ` with other text is NOT Blank. (Missing - ask: is `-` with a trailing space or `- a` Blank? see Q2)
- Filter option with a Remark that is literally `-` plus empty works: only ONE `-` option must appear (no duplicates). (Fact, AC-3)
- No work has Blank Remark: no `-` option at all. After the user edits the last Blank Remark (or fills it), is the list updated without page reload?
- Numeric sort: `Note 2`, `Note 10`, `Note 1` order as 1, 2, 10; digits-first and symbol-first values (`#`, `(`, Thai text) order by localeCompare. (Fact, AC-4; exact placement of Thai/symbols = Missing - ask, Q3)
- Remark up to 200 characters (Create Work shows Remark 0/200): very long option wraps or cuts; hover text full. Multi-line Remark (new lines) shown in one option?
- Special characters, emoji, Thai, `<script>`, `%`, quotes in Remark: option text shows exactly as stored; no broken filter.
- Search box inside the filter: case-insensitive? does Select All apply to searched results only? (Missing - ask, Q4; other columns' behavior should be followed)
- Combined with other column filters, quick search box ("Search work number and job description"), sorting, and "Reset Table Filter": Remark options reflect all works or only works left by other filters? (Missing - ask, Q5)
- Filter stored in the URL / saved filter (subtask ETM-8553 "Update Save Filter Worklist Remark Column"): old saved filters that used Contains / Blank / Not blank for Remark after release. (Missing - ask, Q1)
- Select All then un-tick one; un-tick all (nothing selected): what the table shows (empty table or all). (Missing - ask, Q6)
- Large worklist (thousands of works, e.g. 5,000+ rows): the filter list opens fast and scrolls.
- User without View Worklist permission cannot reach the page (existing behavior, check only that the new filter adds no leak).
- Two users edit Remark at the same time: options shown after reload match the saved data.

## Open questions

1. Saved filter: a user who saved the Remark filter as text (Contains / Blank / Not blank) before this release: what happens to that saved filter and to the URL parameter? Reset, converted, or error? (Missing - ask; changes Expected Result)
2. Blank rule: is a Remark with spaces plus `-` (`- `, ` - `) treated as Blank? Is `--` Blank? Assumption: only empty, whitespace-only and exactly `-` are Blank.
3. Sort position of Thai text, symbols and emoji relative to English letters (localeCompare('en') puts them by Unicode/ICU rules): confirm we only assert that order matches the system-wide sort used by other columns. (Assumption: compare against the same sort in another column.)
4. Filter search box: case-insensitive "contains"? Does Select All act only on the searched results? Same as other columns (Assumption: yes).
5. Do Remark options come from all works in the worklist, or only from works left after other column filters / quick search? (Assumption: all works in the worklist, as AC 2 says "found in the worklist".)
6. When no option is ticked: does the table show no rows or all rows (as in other columns)? (Assumption: same as other columns.)
7. Reference mockup is "to be provided": exact label of the `-` option and tooltip/hover form are not designed. (Missing - ask UX)

## [QA] subtasks

- ETM-8575 [QA] Create Test Case Manual Test (Open) - existing, reuse. Proposed Original Estimate: 4h
- ETM-8576 [QA] Execute Test Case Manual Test (Open) - existing, reuse. Proposed Original Estimate: 4h

## BA answers 2026-11-17

Q1-Q7 are all answered (see story.md, section BA answers). Assumptions Q2-Q6 are confirmed as Facts. Q1 became AC-11. Q3: order is symbols, digits, English letters (case-insensitive, lowercase first), Thai. Q4: baseline = Job Description filter; searching `-` finds the `-` option. Q7: label is `-`, no mockup needed.

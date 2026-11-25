# ETM-8391 [Improvement] View Worklist Table - Remark Column Filter
Status: Ready For Development. Links: relates to ETM-8049, ETM-8050 (Done), ref ETM-434. No Tests linked yet. No Figma (mockup "to be provided").
Subtasks: ETM-8553 [BE] Update Save Filter Worklist Remark Column; ETM-8554 [FE] Intregate API; ETM-8555 [FE] Update UI; ETM-8575 [QA] Create Test Case Manual Test; ETM-8576 [QA] Execute Test Case Manual Test (all Open).

As a Turnaround Manager or Job Owner I want to filter the Remark column by selecting values from a checklist, so I can filter Remark the same way as every other column in the worklist.

Pre-conditions: logged in with View Worklist permission; Worklist page opened from a Worklist Item in a Plan Card on the Planning tab of a Shutdown Event (ETM-5265).
Data: Remark, Text, free-text, not mandatory (from Work Repository, filtered by Worklist).

## Acceptance Criteria
1. Filter Type: Remark filter = checkbox list with search box and Select All, same as other columns. Replaces the current text filter (Contains / Blank / Not blank). (ETM-434 AC 5)
2. Filter Options:
   2.1 List shows each distinct Remark value in the worklist. Values listed exactly as stored; values differing in letter case or leading/trailing spaces are separate options. (ETM-8049 AC 3.6)
   2.2 Blank: if any work has an empty Remark, list shows a `-` option for Blank. `-` is always first, directly under Select All, not in the alphabetical sort. Blank = empty Remark, Remark of only spaces, and Remark that is literally `-`.
   2.3 Option order: after `-`, all others sorted A to Z with localeCompare('en', { numeric: true }).
3. Long Text: list may be long; user scrolls inside the filter. Options longer than filter width end with an ellipsis (…); hover shows full text. Table cells keep existing behavior: ellipsis, full text on hover. (ETM-434 AC 6)
4. Filter Result: only works whose Remark matches a selected option are shown; selecting `-` shows works whose Remark is Blank (per AC 2.2).

UI: Nualta Design System layout components. Mockup: to be provided.

## Comment (BA, 11 Nov 2026 - Story updated)
AC 2.1, 2.2, 4 clarified (case/space variants separate; Blank includes spaces-only and literal `-`; selecting `-` shows Blank works).

## BA answers (file 2026-11-17_ETM-8391_qa-questions.md, BA 2026-11-17, DEC-040) - not yet written into the Jira AC
1. Saved text filter / URL parameter of Remark (Contains / Blank / Not blank): cleared. After release the Remark filter starts at Select All (all options ticked, all works shown). No conversion, no error; old Remark URL parameter is ignored, the page opens normally at Select All. Other columns' saved filters are not affected. (If the system keeps no filter state, test only the old URL parameter.) Jira AC 5 (migration) will be added after BA approves.
2. Blank = empty, spaces only, or exactly `-`. `- `, ` - `, `--` are NOT Blank; each is its own option, not trimmed; ` - ` differs from `- `.
3. Sort = localeCompare('en', {numeric:true}). Confirmed order: symbols (`_` `-` `(` `[`) -> digits -> English letters (case-insensitive; same letters: lowercase first, e.g. `main deck` < `Main Deck`) -> Thai. `Item 9` < `Item 10`. Emoji: whatever localeCompare gives. `-` (Blank) stays first, outside the sort. Known issue: Job Description filter once sorted against this rule (open item C-10); if Remark does the same, report a bug.
4. Search box: same as other columns in every way (baseline = Job Description filter). Searching `-` should find the Blank option `-` too.
5. Options come from ALL works in the worklist; other column filters and quick search do not shrink them. `-` shows only when a Blank work exists.
6. Nothing ticked: same as other columns (baseline = current behaviour of another column).
7. Label of Blank option = `-`. Long options end with `…`, hover shows full text with the existing checkbox-list tooltip; short options have no tooltip. No mockup needed: use the existing filter look.

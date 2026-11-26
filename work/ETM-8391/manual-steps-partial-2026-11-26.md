# ETM-8391 manual steps: the look-and-feel Tests the script cannot prove (26 Nov 2026)

Test Execution: ETM-8874. Environment: QA only (https://stms-qa.apps.pttep.com). One full-screen picture per step; for every hover step the picture must be taken WHILE the hover box is shown.
Log in as Turnaround Manager. Nothing is saved in any Test.
Filter build: Excel-mode column filter (stms-fe 6fba9abf). Ticks take effect only after `Apply`; with nothing ticked `Apply` is disabled. To close a panel without changes, click `Apply` while everything is ticked, or click outside the panel.

## Data (card data, made 26 Nov 11:33 (W05 Job Owner set to Somchai Test through Edit Work Details) with `--keep-data`, ledger `ep-etm-fe-qa/output/seed/ETM-8391.ledger.json`)
- Set worklist `QA-AUTO ETM-8391 set 20261126-1118`: W01 `Test`, W02 `test`, W03 ` Test`, W04 `Test `, W05 `Note 1` (Job Owner `Somchai Test`), W06 `Note 2`, W07 `Note 10`, W08 `#Urgent`, W09 `(Hold)`, W10 `ซ่อมด่วน`, W11 empty, W12 spaces, W13 `-`, W14 `--`, W15 `- a`, W16 `Check valve 🔧`, W17 200-character `Long remark ...`, W18 `Valve A, B`, W19 `100% <b>ok</b> "x" & y`, W21 `- `, W22 ` - `.
- Many worklist `QA-AUTO ETM-8391 many 20261126-1118`: M001-M060 `Remark 001`..`Remark 060`, W17 200-character `Long remark ...`.

## Before you start
- The worklist page opens with the Remark column. If `Reset Table Filter` is enabled, click it.
- The Remark column is far to the right: scroll the table sideways to reach it.

## ETM-8650 - Option list order, long and short options (16 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/327e964a-6fc3-4835-a83c-78735c0407af/worklist/0ef411e2-8ec6-4fee-93f1-70836a812468
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the filter on the `Remark` column | The list opens | Open Remark filter |
| 2 | Look at the row directly under `Select All` | The first option is `-` | Top of the list |
| 3 | Look at the option after `-` | The next option is a normal value (not `-`) | Top of the list |
| 4 | Read the whole list (scroll inside the list) | Only one option reads exactly `-` | List while scrolling |
| 5 | Scroll to the end of the list | No `-` option in the middle or at the end; `#Urgent`, `(Hold)` and a digit value exist | End of the list |
| 6 | Scroll back to the top of the list | The first option under `Select All` is `-` again | Top of the list |
| 7 | Read the positions of `Note 1`, `Note 2`, `Note 10` | Order is `Note 1`, `Note 2`, `Note 10` | The Note options |
| 8 | Read all options after `-` in order | Four groups: symbol/space values (` - `, ` Test`, `- `, `- a`, `--`, `(Hold)`, `#Urgent`), then `100% <b>ok</b> "x" & y`, then English-letter values, then `ซ่อมด่วน` | List in parts |
| 9 | Look at the English-letter group | `Check valve 🔧`, `Long remark ...`, `Note 1`, `Note 2`, `Note 10`, `test`, `Test`, `Test `, `Valve A, B` (`test` before `Test`) | English group |
| 10 | Look at the position of `ซ่อมด่วน` | Listed last, after `Valve A, B` | End of the list |
| 11 | Look at the options that start with a symbol or a space | They come before the digit value and all letters; none before `-` | Symbol group |
| 12 | Find the option that starts with `Long remark ` | Its text ends with an ellipsis (…) and stays on one line inside the panel | The Long remark option |
| 13 | Move the mouse over this option and keep it there | A hover box shows the full 200-character Remark | Hover box shown |
| 14 | Move the mouse away | The hover box disappears | After moving away |
| 15 | Look at the option `Note 1` | Full text `Note 1`, no ellipsis | The Note 1 option |
| 16 | Move the mouse over `Note 1` and keep it there | No tooltip appears for this short option | Mouse on Note 1 |

## ETM-8654 - Long list scrolls inside the filter; long Remark keeps ellipsis and hover (7 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/e959801e-fc5c-4564-a554-543e8091e086/worklist/5ff4ff85-5791-42b2-9822-23c7b607de21
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the filter on the `Remark` column | The list opens and shows only the first part of the options | Open Remark filter |
| 2 | Scroll down inside the filter list (mouse on the list) | The list moves inside the panel; the page and table behind do not scroll | After scrolling |
| 3 | Scroll to the end of the list | `Remark 060` is shown last and its checkbox can be ticked (untick it again) | End of the list |
| 4 | Close the filter without changing the ticks (everything ticked, `Apply`) | The filter closes and the table is unchanged (61 works) | Table after closing |
| 5 | Look at the `Remark` cell of W17 (last row) | The text is cut with an ellipsis (…) | W17 Remark cell |
| 6 | Move the mouse over that cell and keep it there | A hover box shows the full 200-character Remark | Hover box shown |
| 7 | Move the mouse away, open the Remark filter and close it again without ticking | The W17 cell still shows the ellipsis; nothing changed | W17 cell after |

## ETM-8657 - The Remark filter looks like the other column filters (3 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/327e964a-6fc3-4835-a83c-78735c0407af/worklist/0ef411e2-8ec6-4fee-93f1-70836a812468
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the filter on the `Job Description` column | The panel is shown; note its look (search box, `Select All`, checkboxes, `Reset` / `Apply`) | Job Description panel |
| 2 | Close it, then open the filter on the `Remark` column | The panel is shown | Remark panel |
| 3 | Compare the two pictures: fonts, checkbox style, spacing, search box, buttons | Both panels use the same parts and look the same | Both pictures |

## ETM-8663 - An old Remark text filter and the old Remark address parameter are cleared (9 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/327e964a-6fc3-4835-a83c-78735c0407af/worklist/0ef411e2-8ec6-4fee-93f1-70836a812468
Old address (the state saved before the release cannot be made any more, so it is written by hand): the start address followed by `#wsRemarkType=contain&wsRemarkValue=ZZZ+old+remark+text&wsJobOwners=Somchai+Test`. Old query form: the start address followed by `?wsRemarkType=contain&wsRemarkValue=ZZZ+old+remark+text&wsJobOwners=Somchai+Test`.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Before the release: set the Remark text filter `Contains` `Note` and the Job Owner filter `Somchai Test` | Cannot be done on this build (no text filter any more): mark needs-human with this reason | - |
| 2 | Keep the old address given above | The old address is written in the note | - |
| 3 | Open the old address (the `#` form) | The page opens normally with no error message | Page after opening |
| 4 | Open the filter on the `Remark` column | `Select All` and every option ticked; no `Contains`, `Blank` or `Not blank` condition | Open Remark filter |
| 5 | Close the filter (Apply with everything ticked) and look at the table | The table shows all works of `Somchai Test` (only W05) | Table |
| 6 | Open the filter on the `Job Owner` column | Only `Somchai Test` is ticked | Open Job Owner filter |
| 7 | Close it and click `Reset Table Filter` | All works are shown and the Job Owner filter is cleared | Table after reset |
| 8 | Open the old query-form address in a new tab | The Worklist opens normally, no error, no redirect to the Shutdown Event List | New tab |
| 9 | In that tab look at the table and open the filter on the `Remark` column | Only W05 (`Somchai Test`) is shown and every Remark option is ticked | New tab, table and open filter |

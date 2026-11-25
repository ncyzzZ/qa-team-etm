# Dev brief - [ETM-8391] Remark filter: searching "-" does not list the Blank option "-"

## 1. What is wrong
In the Worklist Remark column filter, works with a Blank Remark (empty) are grouped under the option `-`. Typing `-` in the filter's Search box lists the other hyphen values (`--`, `- a`, `- `, ` - `) but not the Blank option `-`. The Blank option cannot be found through the search.

## 2. Where
- Page: Worklist of a Plan (`/shutdown-event-list/events/<event>/planning/<plan>/worklist/<worklist>`), Remark column filter (AG Grid set filter with the Search box "Search filter values").
- Environment: QA (https://stms-qa.apps.pttep.com), 25 Nov 2026.
- Role: Turnaround Manager.
- Data: works with Remark empty, `-`, `--`, `- a`, `- `, ` - ` (all can be entered on the screen).

## 3. Steps to reproduce
1. Open the Worklist of the Plan.
2. Open the filter on the Remark column: `-` (Blank) is the first option under Select All.
3. Type `-` in the filter's Search box.

## 4. Actual vs Expected
| | Result |
|---|---|
| Actual | Only `--`, `- a`, `- `, ` - ` are listed. No Blank option `-`. |
| Expected | `-` (Blank) is listed too, with `--`, `- a`, `- `, ` - `, and can be ticked alone from the search. |

## 5. Rule source
- Story ETM-8391: Blank Remarks (empty, spaces only, exactly `-`) are shown as one option `-`.
- Xray Test ETM-8656 (Test Execution ETM-8874), step 14: type `-` in the search box -> the five hyphen options `-`, `--`, `- a`, `- `, ` - ` are listed; step 15: tick only `-` -> only the Blank works.

## 6. Hints for the fix (guess)
Guess only: the Search box of the set filter seems to match the stored key of the Blank option (empty or null) instead of its shown label `-`. A text formatter for the filter values (AG Grid `textFormatter` / the value used for the mini filter) that returns `-` for the Blank key would let the search find it. Not checked in the FE source.

## 7. How QA will retest
Run Playwright ETM-8656 (steps 14-15) on QA and check by hand: open the Remark filter, type `-`, confirm `-` (Blank) is listed with the other four, tick only `-`, Apply, and only the Blank works are shown.

## 8. Out of scope / do not change
- Letter-case matching of the search (all column filters match case exactly; the BA rule is "like the other columns").
- The order of the options and the merging of Blank values (other tickets).

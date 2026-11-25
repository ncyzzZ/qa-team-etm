# Dev brief: ETM-9229 (Story ETM-8391)

> **25 Nov 2026: withdrawn.** Checked with dev: a search change resets the column filters by design. Do not fix. QA will reword Xray ETM-8658 step 4.

## 1. What is wrong
On the View Worklist table, when the user has column filters on (Remark and Job Owner) and a search text, clearing the search box and pressing Enter also removes the column filters. All works come back, and the filter part of the page address is gone. Only the search text should be cleared.

## 2. Where
- Page: View Worklist (Shutdown Event > Planning tab > Plan card > Worklist).
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/worklist/<worklistId>`; filter state is in the `#...` fragment (`wsKeyword`, `wsRemarks`, `wsJobOwners`, ...).
- Environment: QA. Role: Turnaround Manager.
- Worklist: `S26 Remark Set`. Data: W05 has Remark `Note 1` and Job Owner `Somchai Test`; W06 has Remark `Note 2`; W01 to W09 have Job Descriptions `W01` to `W09`.

## 3. Steps to reproduce
1. Open the worklist `S26 Remark Set` as Turnaround Manager.
2. Type `W0` in the search box `Search work number and job description`, press Enter. Only W01 to W09 are listed.
3. Remark column filter: untick `Select All`, tick `Note 1` and `Note 2`, click `Apply`. Only W05 and W06 are listed.
4. Job Owner column filter: untick `Select All`, tick only `Somchai Test`, click `Apply`. Only W05 is listed.
5. Delete all text in the search box, press Enter.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Table after step 5 | All works of the worklist (W01 to W22 and others) | Only W05 (Total Results 1) |
| Filter icons | Remark and Job Owner no longer active | Both still active, same options ticked |
| URL before step 5 | ends with `#wsKeyword=W0&wsJobOwners=Somchai+Test&wsRemarks=Note%2525201%252CNote%2525202` | - |
| URL after step 5 | ends with `?assetName=ART&field=ART`, no `#...` part | keeps `wsJobOwners` and `wsRemarks`; only `wsKeyword` is removed |
| `POST works/search` body after step 5 | no `remarks`, no `jobOwners` (same as first page load) | `remarks` = [`Note 1`, `Note 2`], `jobOwners` = [`Somchai Test`], no keyword |

Seen by hand on QA (24 Nov 2026) and in the automated run of Xray Test ETM-8658 (run `2026-11-24_230517_ETM-8391`, failed).

## 5. Rule source
- Xray Test ETM-8658, step 4: action "Clear the search box." Expected: "Only W05 is shown (the Remark and Job Owner filters stay)."
- ETM-8391 AC 1: the Remark filter must work "the same as other columns" (Aligned with ETM-434 AC 5).
- ETM-8391 AC 4: "Only works whose Remark matches a selected option are displayed".
- Note: no AC sentence says in words that a search change keeps the column filters. If the current behaviour is on purpose, please tell QA/BA and we will reword the test.

## 6. Hints for the fix (guess, from the local stms-fe source; QA build may differ)
- `pages/worklist/components/worklist-container/worklist-container.component.ts`, `onSearchChange(text)`: it calls `sharedData.setSearchQuery({ keyword: text, reloadType: 'all' })` with **only** the keyword, then `setIsResetFilterTableDisableValue(true)`.
- `worklist-table-grid.component.ts`, the `currentSearchQuery$` subscription, sets every filter to `search.<field> ?? null`, then `updateQueryParams()` writes the URL fragment. So every missing field becomes null: filters and fragment are cleared.
- Likely fix: keep the current filters when only the keyword changes, e.g. `setSearchQuery({ ...sharedData.getSearchQuery(), keyword: text, reloadType: 'all' })`, and do not set the Reset Table Filter button to disabled when filters are still on.
- From the code, this probably happens on **any** search change (typing a new word too), not only when the box is cleared. Please check both.

## 7. How QA will retest
- Xray Test ETM-8658 (Test Execution ETM-8874), step 4, then the full test (steps 1 to 8).
- Pass: after clearing the search and pressing Enter, only W05 is listed; the URL fragment still has `wsJobOwners` and `wsRemarks`; both filter icons are active. Also checked: clearing with the x button, typing a new search text with filters on, and reload (F5) keep the filters.

## 8. Out of scope / do not change
- `Reset Table Filter` must still clear all column filters (and keep the search text, as today).
- The Remark filter options list (all Remark values of the worklist, `-` first, A to Z) and the legacy `wsRemarkType` / `wsRemarkValue` clean-up from ETM-8391 AC 5 stay as they are.
- Other column filters and the URL fragment format (ETM-7578) stay as they are.

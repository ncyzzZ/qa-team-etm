# ETM-8391 - Questions for Dev (Remark filter options on QA)

**Story:** ETM-8391 - [Improvement] View Worklist Table - Remark Column Filter
**Related subtasks:** ETM-8553 [BE] Update Save Filter Worklist Remark Column, ETM-8554 [FE] Integrate API, ETM-8555 [FE] Update UI
**Environment:** QA (`stms-qa.apps.pttep.com`), story status "Deployed to QA"
**Date:** 2026-11-23

## What we see

On the QA worklist `S26 Remark Set` (21 works, `Total Results: 21`), the Remark column filter is a checkbox list (good), but it lists only two rows: **Select All** and **-**. No other Remark value is listed.

The Remark values are stored. Reading the same worklist through the works search API returns every Remark exactly as stored (examples: `Test`, `test`, `Note 1`, `Note 2`, `Note 10`, `--`, `- a`, and one work with an empty Remark).

The filter options come from this call, which returns the Remark list with **one empty entry only**:

```
GET /stms/v1/shutdown-events/{eventId}/worklists/{worklistId}/works/filters
-> data.remark = [{"text":"","value":""}]
```

In the same response the other columns are filled correctly, for example `jobDescription` (W01 ... W22) and `jobOwner` (Malee Test, QA Tester One, Somchai Test). The grid turns the empty text into the `-` label, so the user sees only `-`.

## Expected (from the Story)

- AC 2.1: the list shows each distinct Remark value found in the worklist, exactly as stored; values that differ in letter case or in leading/trailing spaces are separate options.
- AC 2.2: `-` represents Blank (empty, spaces only, or exactly `-`) and is the first option under Select All.
- AC 2.3: the other options are sorted A to Z with `localeCompare('en', { numeric: true })`.

## Questions

1. Is `data.remark` in `/works/filters` supposed to return the distinct Remark values after this Story? If yes, is the BE change (ETM-8553) already deployed on QA? If not, which build or date should we wait for?
2. Does the BE return the values already merged for Blank (empty, spaces only, `-` as one entry), or must the FE merge them? Today both would show as one `-` row, but we need to know where the rule lives so we test the right layer.
3. Does the BE return the values exactly as stored (case and leading/trailing spaces kept, no trim)? AC 2.1 requires separate options for `Test`, `test`, ` Test` and `Test `.
4. Does the BE sort the list, or does the FE sort it (`localeCompare('en', { numeric: true })`)? We need this to know where to look if the order is wrong.
5. How is the test data built when the BE reads the Remark filter values? The works on this worklist were created by a QA seed script that wrote rows directly to the QA database (the works also needed Manpower Resource rows to appear in the grid). Could the filter query skip or ignore these works for a reason in the data (for example a table, flag or status the seed script did not set)? If so, which fields must a work have?

## What we will do next

Until we hear back, the Remark filter tests stay not run (not marked pass). We have not logged a defect, because we do not yet know whether this is a BE gap in the current QA build or a data issue.

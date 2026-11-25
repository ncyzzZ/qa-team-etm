# ETM-8415 linked Tests check (2026-11-24, read-only)

Source: Jira JQL `issue in linkedIssues("ETM-8415") AND issuetype = Test`, full list in `linked-tests.tsv` (key, status, created, reporter, label, summary).

- 263 Tests, ETM-8945..ETM-9217, all Open, link type "is tested by", each linked only to ETM-8415 (checked ETM-8945).
- All created 2026-11-24 16:07-17:01 by Dechathon Thanasutthiphat (bulk import).
- Summaries: 263 unique, no exact duplicates. POS 183 / NEG 80. Roles: TM 219, JO 43, no-permission 1. 13 cite "Known defect".
- Content is a whole-page Shutdown Logic regression suite (load, URL, JO view-only, cell edit, Start Date, drag/resize, Manual Adjust, Hard link drag, red cells, save blocking...).
- None of the 263 titles is about the Story's subject (Work Header / Work as Predecessor/Successor, block move, Block Start/End, nested blocks, constraint on a block). Story AC 1-12 have no dedicated Test.
- Fits ETM-8905 AC 4 (refactor, no behavior change: full regression) better than ETM-8415. ETM-8905 has no linked Tests.
- PW_REPO: no spec references ETM-8415 or any of these keys; no title match. Not scripted.
- Defect ETM-8917 Ready for UAT, needs retest (not touched).

Nothing was changed in Jira/Xray.

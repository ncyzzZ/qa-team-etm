# ETM-8391 Question for BA / Dev: Remark filter options after a search

Story: ETM-8391 [Improvement] View Worklist Table - Remark Column Filter
Xray Test: ETM-8658, step 8. Seen on QA, 25 Nov 2026 (automated run `2026-11-25_153246_ETM-8391`), Turnaround Manager.

## What we see
1. Open a worklist where works have many different Remarks (19 distinct values).
2. Open the `Remark` column filter: all 19 values are listed (`-`, `Note 1`, `Note 2`, `Note 10`, `Test`, ...).
3. Type `W05` in the search box `Search work number and job description` and press Enter: only W05 is shown (Remark `Note 1`).
4. Open the `Remark` column filter again: only `Select All` and `Note 1` are listed.

So after a search, the Remark filter lists only the Remarks of the works the search found.

## Question
Earlier answer (DEC-040): "Options come from all works of the worklist." Does this still hold when a search text is active?

- **A.** Yes: the list must always show the Remarks of all works, even after a search. Then step 4 above is a bug.
- **B.** No: after a search the list shows only the Remarks of the works found (same as the other column filters, e.g. Job Description and Job Owner). Then this is by design and QA will reword Xray ETM-8658 step 8.

Please also confirm: is the same behaviour expected after another column filter is applied (for example a Job Owner filter), or only after a search?

# ETM-8838 retest after ETM-10140 (QA, TM, read only, 26 Nov 2026)
| # | Verdict | Read from page | Picture |
|---|---|---|---|
| 1 | pass | prev arrow disabled; date 14 Feb 2026; button text Unfreeze | step-1.png |
| 2 | pass | Export disabled=false, no disabled/aria-disabled attribute; Day0 grid has 0 task rows, 0 taskbars (no tasks) | step-2.png |
| 3 | pass (note) | 15 Feb 2026 (Day 1), Unfreeze; Export disabled=false; 12 grid rows (has tasks) | step-3.png |
Defect ETM-10140 fixed: Export enabled on Day0 with no tasks.

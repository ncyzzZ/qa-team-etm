# Team metrics: before and after the standing approvals (5aee0ca, 24 Nov 2026 22:45)

Made with `node tools/team-metrics.mjs` from `.claude/team/events.jsonl` on 25 Nov 2026 10:07. A run = an evidence report posted on the board.

Before: 2026-11-16 09:00 to 2026-11-24 22:45 (Thai time)   After: 2026-11-24 22:45 to 2026-11-25 10:07
| Measure | Before | After |
|---|---|---|
| active hours | 39 | 5 |
| cards worked | 17 | 11 |
| questions (ask) | 108 | 15 |
|   of them approvals | 101 | 15 |
| questions per active hour | 2.77 | 3 |
| questions per card | 5.94 | 1.27 |
| wait, median (min) | 1.7 | 1.9 |
| wait, 75% (min) | 5.1 | 5.5 |
| runs (evidence reports) | 153 | 30 |
| runs per card | 10.93 | 5 |
| runs per active hour | 3.92 | 6 |
| how questions ended | board 22, chat 52, cleared 27, replaced 7, open 0 | board 1, chat 14, cleared 0, replaced 0, open 0 |
| questions by topic | run 29, push 20, decide 17, heal 11, defect 10, delete 7, other 6, active-plan 6, jira 2 | push 4, delete 4, run 3, defect 2, active-plan 2 |
| most runs | ETM-8003 36, ETM-8391 18, ETM-8388 17, ETM-8392 14, ETM-8393 14 | ETM-8391 11, ETM-8034 8, ETM-8449 5, ETM-8392 4, ETM-8393 1 |
| most questions | ETM-8449 14, ETM-8393 14, ETM-8391 12, ETM-8034 11, ETM-8388 10 | ETM-8391 5, ETM-8034 3, ETM-8392 2, ETM-8393 1, ETM-8394 1 |

## Reading it

- The "after" window is 5 active hours (one night and one morning), the "before" window 39 hours over 9 days. Per-card numbers are not comparable: "before" holds whole card cycles, "after" only their tail. Use the per-hour rows and the topics.
- Questions per active hour did not drop (2.8 -> 3.0). What changed is the topic: questions to run or heal were 40 of 108 (37%) before and 3 of 15 (20%) after. The questions left after are the ones the rules keep: delete, Active plan, push, defect.
- The 3 "run" questions after the change were read-only manual-runner checks and one re-run on shared data; `run-policy` marks read-only runs `auto`, so the manual-runner path should go through it too.
- Runs per active hour went up (3.9 -> 6.0), as expected from `auto-next` re-running env/flaky failures by itself. Whether that is useful (more proven tests) or noise (ETM-8391 ran 7 times in one hour with 0-2 passes) is not visible here.
- The wait for an answer did not change (median about 2 minutes): the user answers fast once asked; the cost is the interruption, not the wait.
- `ask --later` / `inbox --send` was never used (no inbox file): the "questions that can wait" path is not used by the lead.
- The topic sort is by keywords, first match wins; a question that quotes a menu called "Delete" counts as delete. Treat topic counts as rough.

Measure again after a full sprint day with the new rules before drawing a conclusion.

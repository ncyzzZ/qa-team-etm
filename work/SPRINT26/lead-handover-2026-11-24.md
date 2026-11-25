# Sprint 26 lead handover (24 Nov 2026, evening)

The lead session "Sprint 26 AC check" checked 13 cards against AC and BA, sent fixes and BA answers to each card's own chat, and logged defects. This file is enough to continue.

## Rules that held all day
- One writer per card: fixes, runs and Xray edits go through the card's own chat. The lead only relays and summarises.
- A yes relayed from another chat does not count. The user answers in the card's chat or on the board (http://localhost:4777).
- Nothing in the Playwright repo (`ep-etm-fe-qa`, branch `fix/login-timeout`) is committed.
- Xray status snapshot script: `node <scratchpad>/execstat.mjs <out.json> ETM-8875 ETM-8874 ETM-8873 ETM-8828 ETM-8825 ETM-8822 ETM-8816 ETM-8774 ETM-8773 ETM-8732 ETM-8703 ETM-8647 ETM-8637` (scratchpad may be cleared; it is one GraphQL call on getTestExecutions → testRuns status).

## Files
- Audit per card: `work/SPRINT26/ac-check-2026-11-24/ETM-<n>.md`, plan `fix-plan.md`
- BA answers (all cards + corrections after 13:30): `work/SPRINT26/ba-answers-all-2026-11-24.md`
- Afternoon questions (answered by the user): `work/SPRINT26/questions-for-BA-2026-11-24-pm.md`
- Hand-check sheet with QA links and test data: `work/SPRINT26/defect-handcheck-2026-11-24.md`

## Card chats (session ids)
| Card | Execution | Chat |
|---|---|---|
| 8034 | ETM-8875 | local_ae1fcb53-6dc8-450e-8994-7465a50cbbe8 |
| 8391 | ETM-8874 | local_1995b4c3-8570-4abd-97da-123f81414dee |
| 8042 | ETM-8873 | local_484719dc-c6d3-4173-8302-ce82b7b325b0 |
| 8393 | ETM-8828 | local_9dd77397-d171-4482-b397-67b5e4a0bee0 |
| 8392 | ETM-8825 | local_76d10063-9e03-416b-bdb7-df980436c583 |
| 8049 | ETM-8822 | local_1aa1e375-bf9e-4bb4-b1f4-4ad5eb2f296c |
| 8003 | ETM-8816 | local_85af2035-3174-43fa-904c-54a652a239bc |
| 8394 | ETM-8774 | local_61b3baf1-b991-4244-a97e-9c8fbe1664ca (asked for a new chat: `work/ETM-8394/handover.md`) |
| 8521 | ETM-8773 | local_e6a8abc0-dd10-4a11-a548-625281c163b3 |
| 8388 | ETM-8732 | local_47f21ad3-63da-4331-9c87-02835ebc68fd (closed) |
| 7343 | ETM-8703 | local_4b691584-1c97-4d44-9a39-73f96f933f2a |
| 8405 | ETM-8647 | local_03c88b41-d754-42b0-9983-bdcb29b8697a (closed) |
| 8449 | ETM-8637 | local_1243fab5-cab1-4ba0-ba4b-946b61e2171e |

## Status at hand-over (Xray: 218 Tests, 82 PASSED, 10 FAILED, 1 EXECUTING, 125 TO DO)
| Card | Xray pass | Waiting on |
|---|---|---|
| 8405 | 9/9 | done (closed) |
| 8388 | 23/23 | done (closed; board tab removed) |
| 8392 | 12/18 | user yes to run; Xray 8677 s2 and 8690/8692 PDF → ZIP |
| 8042 | 11/24 | Xray 8838 s3 (Day 1 = 15 Feb 2026) needs yes; F-10 waits on Dev; user said "ยังก่อน" to running |
| 7343 | 9/18 | yes to run; 8724 → N/A (never PASSED) |
| 8393 | 8/15 | 6 Tests need red / gap / off-shift bars added to plan ETM7898; 8820 by hand |
| 8391 | 4/16 | no report to the lead yet; board question open |
| 8049 | 4/21 | board question: edit 8782 s9-15; add a Helipad,helipad row to 8786; 3 manual (8786/8787/8789) |
| 8003 | 2/10 | no report yet; manual 8805 |
| 8034 | 0/19 | re-run going; F-36 palette hex; Highlight Cell on hold (intended, right-click on Description) |
| 8394 | 0/19 | run of 14:09 stopped, all failed; new chat from `work/ETM-8394/handover.md` |
| 8449 | 0/7 | re-capture a picture for ETM-9175 (it has none); 4 Tests not proven |
| 8521 | 0/19 | user to rule on 8737 (Duration 12 shows 10.00) and 8739 (no fill handle); Q5/Q8 wait on Dev; 8752 stuck EXECUTING; 8738 by hand |

## Defects for the 13 cards
- Open (6): ETM-9225 (8049 main deck), ETM-9223 (8049 Helipad), ETM-9221 (8042 S-Curve end), ETM-9219 (8034 palette frame), ETM-9177 and ETM-9175 (8449).
- Ready for UAT (11): 8896, 8897, 8898, 8902 (8391) · 8879, 8886 (8042) · 8877, 8881 (8388) · 8671, 8672 (8405) · 8891 (7343).
- Not logged: 8042 F-10 (Excel disabled on 3-year plan, ask Dev); 8521 8739 (fill handle, user to decide).
- Not defects (decided): 8388 8719 and 8722 s4; 8521 8759 / 8762 (BA corrected Q4); 8034 Highlight Cell.

## Other
- Atlassian MCP uses the deprecated V1 endpoint (removed 2027-03-01); the user was told.

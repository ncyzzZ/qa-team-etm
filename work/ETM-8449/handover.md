# ETM-8449 handover (2026-11-25)

Test Execution ETM-8637 (Test Plan ETM-8636), Xray read back 2026-11-25: **7/7 PASSED** (2026-11-26).

| Test | Xray | Source |
|---|---|---|
| ETM-8629 | PASSED | manual run 2026-11-25_100441_ETM-8449_manual, user confirmed in chat ("ยืนยัน push 3 เคส") |
| ETM-8630 | PASSED | same manual run, user confirmed |
| ETM-8631 | PASSED | run 2026-11-26_100054_ETM-8449 (real Log Out), user confirmed push |
| ETM-8632 | PASSED | run 2026-11-25_185156_ETM-8449 |
| ETM-8633 | PASSED | run 2026-11-25_185156_ETM-8449 |
| ETM-8634 | PASSED | run 2026-11-25_185156_ETM-8449 |
| ETM-8635 | PASSED | manual run 2026-11-25_190738_ETM-8449_manual, user confirmed |

Lag note (user via lead chat 2026-11-25, "ได้ทุกข้อ"): 8629 about 4 s per click with no spinner and 8630 1.2-1.6 s with spinner count as lag. Both are still within the 20 s limit, so 8629/8630 stay PASSED in Xray; the lag is a finding only. No defect and no Xray change without the user's own yes.

Defects ETM-9175 (script error) and ETM-9177 (not a bug) are deleted: no retest left.

## ETM-8631: passed 2026-11-26 (run 2026-11-26_100054_ETM-8449, proven 1/1)
- Step 11 now does a real Log Out (user 2026-11-25: "ให้ script logout จริง"): avatar -> Log Out -> Microsoft popup "Which account do you want to sign out of?" -> TM account -> app on /login with the Login button. Then the saved TM login is put back for the next tests.
- Fix round 1 in work/ETM-8449/script-fixes.md (popup account pick; COOP window.closed console line from the popup ignored).
- The shared TM saved login (.auth/turnaroundManager.json) was checked after each logout: still works.
- Pushed 2026-11-26 (user chat "push 8631 PASSED"): ETM-8631 PASSED in ETM-8637 with 18 step pictures. Card done: 7/7 PASSED.

## Closeout 2026-11-26 (user chat: "ย้ายการ์ด user story และ ปิดงานได้เลย")
- Tests ETM-8629..8635: Closed, resolution Done, assignee me (JQL count 7/7).
- Test Execution ETM-8637: Done. [QA] Execute ETM-8567: Done ([QA] Create ETM-8566 was already Done).
- Story ETM-8449: In Testing -> Ready for UAT.

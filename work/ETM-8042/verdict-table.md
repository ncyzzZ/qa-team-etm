# ETM-8042 - failures to decide (run 2026-11-25_221517_ETM-8042)

AI suggestion only. Answer all rows in one reply, e.g. `1=script 2=app 3=tc` (script / tc / app / env / flaky).

| # | Test | Failed with | Cause | AI suggests | Why | Since last pass |
|---|---|---|---|---|---|---|
| 1 | ETM-8851 | Error: End is not earlier than Start | assertion | app | finding F-11 names this test | failed differently in 2026-11-25_145426_ETM-8042; 4 stms-fe merge(s) since; the spec changed too: c8f16be0 fix/defect, 437b9a9e feature/defect-all, 18eb03c1 features/improve-shutdown-logic (+1) |

# ETM-8394 script fixes

| test | round | cause | what changed |
|---|---|---|---|
| ETM-8768 | 1 | card-owned frozen Worklist was empty; waitGridLoaded needs Total Results > 0 | card data plan `frozen` now imports one Work (8394F-1) |
| ETM-8919 | 1 | Job Owner page slow; grid-or-Access-Denied wait 60 s timed out with no app call | wait for "Total Results: n" or Access Denied, 180 s |

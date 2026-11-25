# Sprint 26: cards In Testing, test results (2026-11-24)

Source: Jira status + `work/<KEY>/run-results.json` (latest Playwright result per Test). "Not run" = linked Test with no Playwright result (manual or not started).

| Card | Topic | Tests | Passed | Failed | Skipped | Not run | Open defects |
|---|---|---|---|---|---|---|---|
| ETM-7343 | Daily Report: Actual % font color | 18 | 6 | 0 | 8 | 4 | - (8891 Ready for UAT) |
| ETM-8003 | Daily Report: S-Curve colors | 10 | 0 | 1 | 8 | 1 | - |
| ETM-8034 | Shutdown Logic: highlight / text color | 19 | 2 | 13 | 1 | 3 | 9219 |
| ETM-8042 | Planning: Ramp Down & Up date | 24 | 12 | 7 | 4 | 1 | 9221 (8879, 8886 Ready for UAT) |
| ETM-8049 | Worklist: Working Location columns | 21 | 6 | 6 | 6 | 3 | 9223, 9225, 9231 |
| ETM-8391 | Worklist: Remark column filter | 16 | 4 | 10 | 4 | 0 | 9229 (8896-8898, 8902 Ready for UAT) |
| ETM-8392 | Daily Report: Ramp lines on Gantt | 18 | 11 | 0 | 7 | 0 | - |
| ETM-8393 | Shutdown Logic: histogram tooltip | 15 | 8 | 0 | 7 | 0 | - |
| ETM-8394 | Import Work status | 19 | 13 | 4 | 2 | 0 | 9233 |
| ETM-8415 | Shutdown Logic: move as a block | 263 | 0 | 0 | 0 | 263 | - (8917 Ready for UAT) |
| ETM-8449 | Shutdown Logic: faster collapse/expand | 7 | 0 | 4 | 3 | 0 | 9175, 9177 |
| ETM-8521 | Shutdown Logic: faster copy & paste | 19 | 1 | 13 | 4 | 1 | 9227 |
| ETM-8905 | Shutdown Logic: refactor, no behavior change | 0 | - | - | - | - | - |

## Test keys per card (ETM- prefix omitted)

- **7343** passed 8676,8683,8685,8689,8696,8701 · skipped 8687,8691,8697,8698,8699,8700,8724,8725 · not run 8678,8681,8702,8726
- **8003** failed 8800 · skipped 8801-8804,8806-8809 · not run 8805
- **8034** passed 8854,8857 · failed 8855,8856,8858,8859,8861-8867,8871,8872 · skipped 8860 · not run 8868,8869,8870
- **8042** passed 8829-8832,8835-8837,8841,8843-8845,8850 · failed 8833,8839,8840,8842,8846,8848,8851 · skipped 8834,8838,8847,8849 · not run 8883
- **8049** passed 8770,8778,8780,8782,8790,8794 · failed 8777,8779,8781,8783,8788,8793 · skipped 8775,8776,8784,8785,8791,8792 · not run 8786,8787,8789
- **8391** passed 8653,8659,8660,8661 · failed 8649-8652,8654-8656,8658,8662,8663 · skipped 8648,8657,8897,8902
- **8392** passed 8675,8680,8682,8684,8686,8694,8695,8795,8796,8798,8799 · skipped 8677,8679,8688,8690,8692,8693,8797
- **8393** passed 8810-8812,8815,8817-8819,8821 · skipped 8813,8814,8820,8823,8824,8826,8827
- **8394** passed 8735,8742,8744-8747,8754,8756-8758,8769,8920,8921 · failed 8755,8765-8767 · skipped 8768,8919
- **8415** 263 Tests in Jira (8945-9217), none run, no `work/ETM-8415` folder yet
- **8449** failed 8632-8635 · skipped 8629-8631
- **8521** passed 8760 · failed 8736,8737,8739-8741,8743,8748,8751-8753,8759,8762,8763 · skipped 8749,8750,8761,8764 · not run 8738
- **8905** no Tests linked yet, no folder

Reminder: skipped is never PASSED in Xray.

# Sprint 26 – TC and script coverage (2026-11-19)

Scope: Scrum Sprint 26 (id 17237), Jira live. Excluded: board columns "Ready for UAT" and "Done" (status Ready for UAT / Deployed to UAT), Design Tasks, Defects.
Source: "is tested by" links in Jira; Playwright repo `ep-etm-fe-qa/tests` (Test key in a spec/helper).
"Scripted TC" = the Test key appears in a script. It does not mean the test passed or is free of `fixme`.

## Summary

| | Items | With TC | TC | Scripted TC | % |
|---|---|---|---|---|---|
| Stories | 14 | 13 | 214 | 203 | 95% |
| Tasks (Awaiting implementation) | 4 | 0 | 0 | 0 | – |

## Stories

| Story | Status | TC | Scripted | Note |
|---|---|---|---|---|
| ETM-7343 Actual % font color | In Development | 18 | 16 | |
| ETM-8003 S-Curve colors | In Development | 10 | 10 | |
| ETM-8034 Row highlight | Ready For Development | 19 | 19 | |
| ETM-8042 Ramp Down/Up date | Deployed to QA | 23 | 23 | ready to run |
| ETM-8049 Working Location | In Development | 21 | 18 | |
| ETM-8388 Timeline copy/paste | Deployed to QA | 23 | 20 | ready to run |
| ETM-8391 Remark filter | In Development | 16 | 16 | |
| ETM-8392 Daily Report ramp lines | Deployed to QA | 18 | 18 | 10 real, rest skip until `.env` filled |
| ETM-8393 Histogram tooltip | Ready For Development | 15 | 15 | 11 fixme (ETM-8534 not pushed) |
| ETM-8394 Import status | Ready For Development | 16 | 16 | |
| ETM-8405 Editable weekly Plan % | In Testing | 9 | 6 | defects ETM-8671/8672 wait retest |
| ETM-8415 Fix Work Header | In Development | 0 | 0 | no description, no TC |
| ETM-8449 Faster collapse/expand | In Development | 7 | 7 | |
| ETM-8521 Faster paste | In Development | 19 | 19 | |

## Tasks with no TC yet (Awaiting implementation)

ETM-8548 Dynamic Duration Unit; ETM-8590 / 8591 / 8592 Shutdown Organization (default preset, specific Turnaround Manager, generate organization).

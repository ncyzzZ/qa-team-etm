# Dev brief: (defect key after logging) - pasted Ramp Up earlier than Ramp Down is kept

## 1. What is wrong
In the Ramp Down/Up Date range picker (Create Plan / Edit Plan), pasting an End (Ramp Up) that is earlier than the Start (Ramp Down) keeps that value. No error. Picking the same date in the calendar is blocked (OK disabled, value goes back).

## 2. Where
- Page: Shutdown Event > Planning tab > Create Plan modal, field "Ramp Down/Up Date".
- QA: stms-qa.apps.pttep.com, event "QA S26 Ramp".
- Role: Turnaround Manager.
- Data: any; no saved data needed.

## 3. Steps to reproduce
1. Create Plan, Plan Name `Plan Scenario Paste`.
2. Start input: paste `15 Feb 2026 09:00`, Enter.
3. End input: paste `25 Feb 2026 18:00`, Enter.
4. End input: clear, paste `14 Feb 2026 09:00`, Enter.

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| End after step 4 | `14 Feb 2026 09:00` (earlier than Start) | Not earlier than Start (Ramp Up >= Ramp Down) |
| Error message | none | none |

## 5. Rule source
- ETM-8042 AC 1.2 and BA answers: Q5 (no error, value adjusted, Ramp Up >= Ramp Down), S1 (pasting is in scope; Ramp Up >= Ramp Down still applies).
- Xray: Test Execution ETM-8873, Test ETM-8851 step 10. Same rule by calendar: ETM-8833 (passes).

## 6. Hints for the fix (guess)
The calendar path disables OK for an earlier End; the typed/pasted text path of the range picker (Enter / blur) seems to accept any valid date without comparing it with the Start. A check on the parsed value (compare with the other part) in the same place that rejects invalid dates (BA Q12 = b, previous value put back) would cover it. Guess only, not checked in code.

## 7. How QA will retest
Run `node tools/run-card.mjs ETM-8042 tests/fe/e2e/planning/etm8042/verifyPlanRampDownUp.spec.ts -g "ETM-8851"` and check step 10 by hand in Create Plan and Edit Plan (paste and type).

## 8. Out of scope / do not change
Calendar pick behaviour (ETM-8833 passes), invalid date handling (Q12 = b, previous value put back), equal Start = End is allowed.

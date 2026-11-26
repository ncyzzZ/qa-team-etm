# Dev brief: ETM-10140 - Daily Report Export disabled on Day0 with no tasks

## 1. What is wrong
On Day0 of a Daily Report (the First Execution Date, one day before the Ramp Down when the Ramp Down is before 18:00) the Export button stays disabled even when the day is frozen, because that day has no tasks. So the Day0 PDF of this report cannot be exported.

## 2. Where
- Page: Daily Report of a Plan, header Export button.
- QA: stms-qa.apps.pttep.com, event "QA S26 Ramp" (18bf0408-c725-4e84-b419-22e9a9eef29b), Plan "QA ETM-8042 8836" (384db0ce-b08c-419e-8aec-b83b62baca23), Daily Report 9eb382d9-85eb-4725-9d30-2f6bc2daae89 (`?date=2026-02-14` opens Day0).
- Role: Turnaround Manager.
- Data (made on the screen): Ramp Down/Up `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, two works, days 14-24 Feb frozen.

## 3. Steps to reproduce
1. Open the Daily Report, go to `14 Feb 2026` (previous-day arrow until disabled).
2. Day is frozen (Unfreeze shown). Look at Export.
3. Next day `15 Feb 2026`: look at Export.

## 4. Actual vs Expected
| Day | Actual | Expected |
|---|---|---|
| 14 Feb 2026 (Day0, frozen, no tasks) | Export disabled | Export enabled, Day0 PDF can be exported |
| 15 Feb 2026 (Day 1, frozen, tasks) | Export enabled | Export enabled |

## 5. Rule source
- QA lead decision 26 Nov 2026 (answer b to BA question 13; not yet confirmed by the BA): Day0 must be exportable; Export enabled on Day0 even with no tasks.
- BA Q2 (ETM-8042): Day 1 = snapshot Ramp Down; First Execution Date = Ramp Down - 1 is Day0. ETM-5277 AC 5.1 (Day0 in the PDF name).
- Xray: Test Execution ETM-8873, Test ETM-8838 step 8.

## 6. Hints for the fix (guess)
stms-fe daily report: `isExportDisabled` is `!isFreeze() || !hasVisibleTasks()`. The `hasVisibleTasks()` part blocks Day0. Allowing Export on a frozen Day0 (or on any frozen day) without visible tasks would fix it; the PDF should then show the timeline with Day0. Guess only.

## 7. How QA will retest
Manual steps `work/ETM-8042/manual-steps-8838-day0.md` (read only), then export the Day0 PDF and check its file name has `Day0` and the date `20260214`.

## 8. Out of scope / do not change
Export disabled on a day that is not frozen (by design). Day 1 = Ramp Down date (BA Q2). The 18:00 rule for the First Execution Date.

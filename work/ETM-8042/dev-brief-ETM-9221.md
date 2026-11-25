# Dev brief: ETM-9221 — Planned S-Curve on an old Daily Report ends on the last task end

Story: ETM-8042 ([Improvement] Planning - Individual Ramp Down & Up Date). Found by Xray Test ETM-8849 step 5 (Test Execution ETM-8873), QA, 24 Nov 2026.

## 1. What is wrong
On a Daily Report created before ETM-8042 (no snapshot Ramp Down/Up Date), the yellow dashed **Planned S-Curve** runs to the end date of the last task in the Plan (about 12 Apr 2027).
It must end on the last execution day of the report: snapshot Ramp Up Date + extended days. For an old report the snapshot is the Shutdown Event's Planned end (15 Jul 2026).

## 2. Where
- Environment: QA (`https://stms-qa.apps.pttep.com`).
- Role: Turnaround Manager (any user with View All Daily Report Item).
- Page: Daily Report > S-Curve section (on screen; the same chart is in the Daily Report PDF export).
- URL pattern: `/shutdown-event-list/events/{eventId}/planning/{planId}/daily-report/{dailyReportId}`
- Test data: Daily Report **"Export 5000"** (created before the ETM-8042 release, no snapshot):
  `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/75ee62f6-1954-41b4-954d-ab2ca1d183c8/daily-report/31885cb6-33f4-4b5f-94d8-ee1ea1216b77`
- Event Planned Date: `17 Jun 2026 10:00 - 15 Jul 2026 06:00`. No extended days known on this report.
- This report is shared test data: read only, please do not freeze days or extend it.

## 3. Steps to reproduce
1. Log in to QA as Turnaround Manager.
2. Open the Daily Report "Export 5000" (URL above).
3. Scroll to the S-Curve chart. Hover the last point of the Planned (yellow dashed) line and read its date.
4. Optional: export the Daily Report to PDF and look at the S-Curve there.

## 4. Actual vs Expected
| | End of the Planned S-Curve |
|---|---|
| Actual | about **12 Apr 2027** (end date of the last task in the Plan), on screen and in the PDF |
| Expected | **15 Jul 2026** (Event Planned end = snapshot Ramp Up of an old report) + extended days, if any |

The rest of the report is already right: the Ramp Up line on the Gantt shows 15 Jul 2026 and the First Execution Date is 16 Jun 2026 (17 Jun 10:00 is before 18:00). Only the S-Curve end is wrong.

## 5. Rule source (exact words)
- **ETM-8042 AC 8.2** (Daily Report): "The last execution day (ETM-4125 AC 8) and the end of the Planned S-Curve (ETM-4127 AC 3) use the snapshot Ramp Up Date plus any extended days. The S-Curve does not end on the last task end date or on the Shutdown Event's Planned end. For a Daily Report created before this release, the snapshot is the Event's Planned end."
- **ETM-8042 AC 6**: "Existing Daily Reports: keep the Shutdown Event's Planned Date they use today as their snapshot Ramp Down/Up Date. There is no visible change to existing Daily Reports."
- **ETM-4127 AC 3**: "Planned S-Curve: A yellow dashed line plotting cumulative planned progress from the first execution day until the event end day."
- **ETM-4127 AC 7**: "If an execution date is extended, the timeline scale (x-axis) and the Planned S-Curve plot must automatically extend to include the new days."
- **ETM-4125 AC 8**: "When freezing the report on the current last execution day (Event End Date), the system checks the Actual (%) of all Work Breakdown tasks. ..." (the last execution day = Event End Date).
- **DEC-048 / BA answer 24 Nov 2026 (QA question 9)**: "The Planned S-Curve ends on the last execution day = snapshot Ramp Up Date + extended days, NOT the last task end and not the Event Planned end. Old Daily Report: snapshot = Event Planned end (DEC-048). Ending on 12 Apr 2027 (last task end) is a defect."

## 6. Hints for the fix (GUESS — QA did not read the FE/BE source or the S-Curve API response)
- GUESS: when the Daily Report has no snapshot Ramp Up Date, the S-Curve end falls back to the max task end date of the Plan. It should fall back to the Event Planned end (or the migrated snapshot) + extended days, the same value the Gantt Ramp Up line already uses on this report.
- GUESS: check whether the ETM-8042 migration filled the snapshot for old Daily Reports (AC 6). If the snapshot is empty for "Export 5000", the fallback path is the one in use.
- Unknown to QA: whether the old app (before ETM-8042) already ended the S-Curve on the last task end. Either way, the rule above is the expected result now.

## 7. How QA will retest
- Xray Test **ETM-8849**, step 5 ("Look at the end of the Planned S-Curve"), on the same report "Export 5000".
- Pass when:
  1. The Planned S-Curve ends on **15 Jul 2026** (+ extended days, if the report has any) on screen and in the PDF.
  2. Regression: a Daily Report created after the release (with a snapshot) still ends on its snapshot Ramp Up date + extended days.
  3. First Execution Date (16 Jun 2026) and the Ramp Up line (15 Jul 2026) of the old report are unchanged.
- Step 5 is checked by a person from a full-screen picture with the hover tooltip on the last point.

## 8. Out of scope / do not change
- The Actual S-Curve (ETM-4127 AC 4) and the Day / Week / Month scale rules (AC 5).
- The First Execution Date rule (18:00) and the Gantt scale of the Daily Report.
- Plan Ramp Down/Up Date, the Daily Report snapshot and the event Planned Date: the fix must not write to them (the Extension also does not change them, ETM-8042 AC 8.2).
- Shutdown Timeline tab (keeps the event Planned Date, ETM-8042 AC 9).
- Test data on QA ("Export 5000" and other shared reports): no freeze, no extension, no edit.

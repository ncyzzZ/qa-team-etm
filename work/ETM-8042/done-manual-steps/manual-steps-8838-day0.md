# ETM-8042 manual steps: ETM-8838 step 8 re-proof, Export on Day0 (read only)

Why: QA lead decision 26 Nov 2026 (BA Q13 = b): Day0 must be exportable, Export enabled on Day0 even when the day has no tasks. Re-prove on UI-made data before a defect is written. Read only: do not freeze, unfreeze or save anything.

Data (made on the screen: Plan created with the picker, work added in the worklist, Daily Report created and days frozen with the Freeze button): Plan "QA ETM-8042 8836" of event "QA S26 Ramp", Ramp Down 15 Feb 2026 09:00, First Execution Date 14 Feb 2026 (= Day0, 18:00 rule), days 14-24 Feb frozen, 25 Feb open.

Environment: QA only (https://stms-qa.apps.pttep.com). Turnaround Manager.

## ETM-8838 - Export button on Day0 and on a later frozen day (3 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/18bf0408-c725-4e84-b419-22e9a9eef29b/planning/384db0ce-b08c-419e-8aec-b83b62baca23/daily-report/9eb382d9-85eb-4725-9d30-2f6bc2daae89
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report (start URL), wait until the date shows. Press the previous-day arrow until it is disabled. Read the date and the Freeze/Unfreeze button | Date `14 Feb 2026` (Day0), the button shows `Unfreeze` (day is frozen) | Full screen, header with date and buttons |
| 2 | On 14 Feb 2026 look at the `Export` button in the header (is it enabled or disabled?) and at the Gantt (are there task bars on that day?) | Export is ENABLED (QA lead 26 Nov: Day0 must be exportable even with no tasks). Note down whether the day has tasks | Full screen with the Export button |
| 3 | Press the next-day arrow once (15 Feb 2026, Day 1) and look at the `Export` button | Note down: enabled or disabled (comparison) | Full screen |

Do not click Export, Freeze or Unfreeze.

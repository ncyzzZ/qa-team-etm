# Defect draft (not logged): [ETM-8042] Daily Report: Export is disabled on Day0 (First Execution Date) when the day has no tasks

**Summary:** [ETM-8042] Daily Report: Export button is disabled on Day0 (First Execution Date before the Ramp Down) when the day has no tasks, so the Day0 PDF of this report cannot be exported
**Work type:** Defect (QA) | **Labels:** FE, UI | **Relates:** ETM-8042 | **Xray:** ETM-8873 / ETM-8838 step 8
**Rule:** QA lead decision 26 Nov 2026 (answer b to BA question 13; not yet confirmed by the BA): Day0 must be exportable; Export must be enabled on Day0 even when that day has no tasks. BA Q2: Day 1 = snapshot Ramp Down date; when the First Execution Date is Ramp Down - 1 (Ramp Down before 18:00), that date is Day0.

**Environment:** QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Plan "QA ETM-8042 8836", manual run 26 Nov 2026 09:34 (work/ETM-8042/manual-8838-day0/).

The Daily Report of a Plan whose Ramp Down is before 18:00 starts on Day0 (the day before the Ramp Down). On that day the Export button stays disabled even when the day is frozen, because the day has no tasks. So the Day0 PDF of this report cannot be exported.

### Step to Reproduce
1. Event "QA S26 Ramp" > Planning tab, Plan "QA ETM-8042 8836" (Ramp Down/Up Date `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, two works in its worklist, Daily Report created).
2. Open the Daily Report and press the previous-day arrow until it is disabled: the date is `14 Feb 2026` (Day0, First Execution Date). The day is frozen (button shows `Unfreeze`).
3. Look at the `Export` button in the header.
4. Press the next-day arrow once (`15 Feb 2026`, Day 1) and look at the `Export` button.

### Actual Result
- On `14 Feb 2026` (Day0, frozen, no task bars in the Gantt) the `Export` button is disabled.
- On `15 Feb 2026` (Day 1, frozen, 12 task rows) the `Export` button is enabled.
- The previous-day arrow is disabled on 14 Feb 2026 (it is the first day of the report).
- Pictures (full screen, no overlay, 26 Nov 2026 09:35): work/ETM-8042/manual-8838-day0/clean/day0-14feb.png (Day0, Unfreeze shown, Export disabled), work/ETM-8042/manual-8838-day0/clean/day1-15feb.png (Day 1, Export enabled).
- Read from the page at the same time: 14 Feb: Export disabled, previous-day arrow disabled, button Unfreeze; 15 Feb: Export enabled.

### Expected Result
> QA lead 2026-11-26: "Export should be enabled on Day0 even when that day has no tasks"
- On Day0 (`14 Feb 2026`, frozen) the `Export` button is enabled even when the day has no tasks, and the PDF of that day can be exported (QA lead decision 26 Nov 2026, BA Q13 = b).

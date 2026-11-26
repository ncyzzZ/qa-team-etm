# Evidence check defect-draft-8838-day0-export (ETM-8042, defect)

sourceHash: 0647be7447c3

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Plan "QA ETM-8042 8836", manual run 26 Nov 2026 09:34 (work/ETM-8042/manual-8838-day0/).

The Daily Report of a Plan whose Ramp Down is before 18:00 starts on Day0 (the day before the Ramp Down). On that day the Export button stays disabled even when the day is frozen, because the day has no tasks. So the Day0 PDF of this report cannot be exported.

## Steps
1. Event "QA S26 Ramp" > Planning tab, Plan "QA ETM-8042 8836" (Ramp Down/Up Date `15 Feb 2026 09:00 - 25 Feb 2026 18:00`, two works in its worklist, Daily Report created).
2. Open the Daily Report and press the previous-day arrow until it is disabled: the date is `14 Feb 2026` (Day0, First Execution Date). The day is frozen (button shows `Unfreeze`).
3. Look at the `Export` button in the header.
4. Press the next-day arrow once (`15 Feb 2026`, Day 1) and look at the `Export` button.

## Expected Result (as the draft states it: check it has a source)
> QA lead 2026-11-26: "Export should be enabled on Day0 even when that day has no tasks"
- On Day0 (`14 Feb 2026`, frozen) the `Export` button is enabled even when the day has no tasks, and the PDF of that day can be exported (QA lead decision 26 Nov 2026, BA Q13 = b).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8838-day0-export.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8838-day0-export.pics/pic-2.png

# ETM-8042 — TC and script changes from the BA answers of 2026-11-24 (Q9-Q11)

Proposal only. No Xray write until the user says yes. Before writing: save the current steps (xray-steps-before-<date>.json), as done on 20 Nov.

## Xray step edits (need a yes)

| Test | Step | Now | Change to | Source |
|---|---|---|---|---|
| ETM-8840 | 7 action | Look at the end of the yellow dashed Planned S-Curve (ETM-4127). | Look at the end of the Planned S-Curve (dashed Plan line, ETM-4127). | ETM-8003 AC1 (Plan line blue #1677FF), audit 24 Nov |
| ETM-8840 | 7 expected | The curve ends on `25 Feb 2026`, not on `22 Feb 2026`. | The curve ends on the last execution day `25 Feb 2026` (snapshot Ramp Up, no extended days), not on `22 Feb 2026` and not on the last task end. | BA Q9 24 Nov |
| ETM-8840 | 15 expected | The curve ends on `25 Feb 2026`. | The curve still ends on the last execution day `25 Feb 2026` (the snapshot), not on `20 Feb 2026`. | BA Q9 24 Nov |
| ETM-8849 | 5 expected | It ends on `15 Jul 2026`. | It ends on the last execution day: `15 Jul 2026` (the snapshot = event Planned end, DEC-048) plus any extended days. Not on the last task end (12 Apr 2027 on QA = defect). | BA Q9 24 Nov |
| ETM-8851 | — | — | No change: the 20 Nov version (invalid paste clears the part, Save disabled) is right. | BA Q11 24 Nov |

## Defect candidates (need a yes, one at a time)
1. ETM-8849 step 5: Planned S-Curve of the old Daily Report (Export 5000) ends about 12 Apr 2027, the last task end, not 15 Jul 2026 (+ extended days). First check whether Export 5000 has extended days (then the expected end moves by that many days).
2. ETM-8846 step 5: Excel File disabled in Export Shutdown Logic on the 3-year Plan. BA: QA asks Dev first. Check the page had no unsaved draft.

## Script changes
- Done 24 Nov: 8851 comment now cites BA Q11 (was "user decision"). No logic change.
- 8840 / 8849 / 8842: the S-Curve end is still compared by a person (sCurveNote -> `partial`, so the test is never PASSED by the script alone). The scripts already name the right expected (last execution day). An automatic check needs the S-Curve chart data (selector unknown): later, after a look at the FE source.
- 8840: Xray has 21 steps, the script 12 (step numbers not aligned, like 8829 / 8848). Align after the Xray edits above.

## Done 2026-11-24
Xray updated after the user said yes in chat ("ใช่ แก้ Xray"): 8840 step 7 (action + expected) and step 15 (expected), 8849 step 5 (expected). Read back OK; step counts unchanged (8840 = 21, 8849 = 7). Before copy: xray-steps-before-ba-2026-11-24.json.

## Re-check after the BA Story edit (Jira updated 2026-11-24 14:23)
Story text read again (AC 1.2, AC 8.1, AC 8.2):
- AC 1.2 now says an invalid typed/pasted value clears that part and Save stays disabled -> ETM-8851 and its script match. No change.
- AC 8.2 S-Curve: "uses the snapshot Ramp Up Date plus any extended days ... does not end on the last task end date or on the Shutdown Event's Planned end. For a Daily Report created before this release, the snapshot is the Event's Planned end." -> the edits already made to 8840 s7/s15 and 8849 s5 match. No change.
- AC 8.2 Gantt scale: duration snapshot Ramp Down..Ramp Up + extended days, "scale rule itself is unchanged" -> 8840 s3/s4 stay "write down" (no exact value in the Story). No change.
- AC 8.1 PDF: "the Full Shutdown Timeframe and the Day-1 rule use the Plan's Ramp Down / Ramp Up Date"; Export Day numbering "Day1 = the Plan's Ramp Down Date" -> ETM-8838 step 3 can now have an expected result.

Proposed (Xray write, needs a yes):
| Test | Step | Now | Change to |
|---|---|---|---|
| ETM-8838 | 3 expected | The Day 1 date shown is written down. Pending: the Day 1 of the Shutdown Logic PDF is not confirmed. | Day 1 is `15 Feb 2026`, the Plan's Ramp Down date, not `08 Feb 2026` (ETM-8042 AC 8.1, ETM-7900). |
The manual run of 24 Nov read the first timeline column of the Logic PDF as 15 Feb 2026 (no "Day 1" text in the PDF): after this edit a person confirms step 3 from evidence/ETM-8838/step-3.png.

Done 2026-11-24: ETM-8838 step 3 expected changed after the user said yes in chat ("ใช่ แก้ Xray"). Read back OK, 9 steps. Before copy: xray-steps-before-8838-2026-11-24.json.

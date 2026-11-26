# Defect draft (not logged): [ETM-8042] Ramp Down/Up Date picker keeps a pasted Ramp Up that is earlier than Ramp Down, no error

**Summary:** [ETM-8042] Ramp Down/Up Date picker accepts a pasted End (Ramp Up) earlier than Start (Ramp Down) with no error
**Work type:** Defect (QA) | **Labels:** FE, UI | **Relates:** ETM-8042 | **Xray:** ETM-8873 / ETM-8851 step 10
**Finding:** F-11 / S1 (BA: pasting is in scope; Ramp Up >= Ramp Down still applies). Same rule as ETM-8833 (calendar pick), which passes.

**Environment:** QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Playwright run 2026-11-25_221517_ETM-8042 (25 Nov 2026 22:15).

In the Create Plan modal, the Ramp Down/Up Date range picker keeps a Ramp Up (End) that was pasted earlier than the Ramp Down (Start). Picking the same earlier End from the calendar is not accepted (ETM-8833 passes), but pasting the text bypasses that rule.

### Step to Reproduce
1. Event "QA S26 Ramp" > Planning tab > Create Plan, type Plan Name `Plan Scenario Paste`.
2. Click the Start input, paste `15 Feb 2026 09:00` (Ctrl/Cmd+V), press Enter.
3. Click the End input, paste `25 Feb 2026 18:00`, press Enter.
4. Click the End input, clear it, paste `14 Feb 2026 09:00` (one day earlier than Start), press Enter.

### Actual Result
- End shows `14 Feb 2026 09:00`, earlier than Start `15 Feb 2026 09:00`.
- No error message.
- Pictures: work/ETM-8042/defect-8851-pics/ETM-8851-07.png (before: End 25 Feb 2026 18:00), work/ETM-8042/defect-8851-pics/ETM-8851-08.png (after paste: End 14 Feb 2026 09:00).

### Expected Result
- The saved range is always Ramp Up >= Ramp Down, no error message (BA Q5 / S1, AC 1.2). A pasted End earlier than Start is not kept: like the calendar pick, the End does not end up earlier than the Start.
- Note: the exact adjusted value is not stated by the BA (user said Ramp Up = Ramp Down); Dev question in ETM-8833 comment 600585 is unanswered.

Not checked: whether Save then saves the Plan with End < Start (the run stops at this step).

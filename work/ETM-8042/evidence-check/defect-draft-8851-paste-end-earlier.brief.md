# Evidence check defect-draft-8851-paste-end-earlier (ETM-8042, defect)

sourceHash: cba05d44ef3a

You read this BLIND: the first agent's result is not here on purpose. Do not open the source file, the run log,
findings.json, verdict-table.md or any file that states a result for this check. Read the pictures yourself.

## Environment
QA (stms-qa.apps.pttep.com), Turnaround Manager, event "QA S26 Ramp", Playwright run 2026-11-25_221517_ETM-8042 (25 Nov 2026 22:15).

In the Create Plan modal, the Ramp Down/Up Date range picker keeps a Ramp Up (End) that was pasted earlier than the Ramp Down (Start). Picking the same earlier End from the calendar is not accepted (ETM-8833 passes), but pasting the text bypasses that rule.

## Steps
1. Event "QA S26 Ramp" > Planning tab > Create Plan, type Plan Name `Plan Scenario Paste`.
2. Click the Start input, paste `15 Feb 2026 09:00` (Ctrl/Cmd+V), press Enter.
3. Click the End input, paste `25 Feb 2026 18:00`, press Enter.
4. Click the End input, clear it, paste `14 Feb 2026 09:00` (one day earlier than Start), press Enter.

## Expected Result (as the draft states it: check it has a source)
- The saved range is always Ramp Up >= Ramp Down, no error message (BA Q5 / S1, AC 1.2). A pasted End earlier than Start is not kept: like the calendar pick, the End does not end up earlier than the Start.
- Note: the exact adjusted value is not stated by the BA (user said Ramp Up = Ramp Down); Dev question in ETM-8833 comment 600585 is unanswered.

Not checked: whether Save then saves the Plan with End < Start (the run stops at this step).

## Pictures
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8851-paste-end-earlier.pics/pic-1.png
- /Users/ncy/Downloads/NN/DocforAi/STMS/qa-team-etm/work/ETM-8042/evidence-check/defect-draft-8851-paste-end-earlier.pics/pic-2.png

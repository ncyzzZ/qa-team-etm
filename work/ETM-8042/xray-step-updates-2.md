# ETM-8042: Xray step updates, round 2 (approved by the user in chat 2026-11-20: "แก้ step ใน Xray ทั้งหมดได้เลย")

Edit the existing steps in place (keep step ids where possible). Change only the text described; keep every other step as it is.
Before writing, save the current steps of every Test below to work/ETM-8042/xray-steps-before-round2-2026-11-20.json.

## 1. ETM-8829 (TC-001) — placeholders
In the step about the clear (x) icon of the Ramp Down/Up Date field (draft step 12), Expected Result:
`The field is empty with the placeholders 'Start date' and 'End date'.` -> `The field is empty with the placeholders 'Ramp Down Date' and 'Ramp Up Date'.`
Any other `Start date` / `End date` placeholder text in this Test: same change.

## 2. ETM-8848 (TC-020) — placeholders
Same change in the clear (x) step (draft step 4) and in any step that names the placeholders.

## 3. ETM-8851 (TC-023) — invalid pasted date
Every step that pastes an invalid date (`31 Feb 2026 08:00`, `2026-02-08 08:00`) into Start or End: Expected Result becomes
`The pasted text is not accepted: after the focus leaves the field, that part (Start / End) is empty and 'Save' is disabled.`
(was: the part keeps the old value). If the Test has no step to put the valid value back before the next check, add after the invalid-paste steps: `Paste the valid value again (Start 15 Feb 2026 09:00 / End 25 Feb 2026 18:00). -> The field shows the valid value.`

## 4. ETM-8835 (TC-007) — read only on the old event
Remove the steps that change the event Planned Date and the step that reads the old Plan badge again after that change, and the restore step if any. Keep: open Edit Shutdown Event and note the Planned Date; read the badge of the oldest old Plan; open Edit Plan of the oldest old Plan; read the badges of the middle and newest old Plans. Add to the precondition (step 1 Data if there is no precondition field): `Read only: the old event is shared, its Planned Date is not changed in this test (ETM-8831 covers a Planned Date change).`

## 5. ETM-8840, ETM-8841, ETM-8846, ETM-8849 — "First Execution Date" / "last execution day"
The Daily Report screen has no label "First Execution Date". In every step that reads it, change the action to:
`Open the Daily Report and press the previous-day arrow next to the date until it is disabled; read the date shown.` (Expected Result keeps its date.)
In every step that reads the "last execution day", change the action to:
`Press the next-day arrow next to the date until it is disabled; read the date shown.` (Expected Result keeps its date.)
Add to the precondition of ETM-8840, ETM-8841, ETM-8846: `The Plan's worklist has at least one work before its Daily Report is created (BA 2026-11-20: a report made without a work opens on the Ramp Down date and is not on the snapshot range).`
ETM-8849 only: summary already changed; keep its expected dates (First 16 Jun 2026, last 15 Jul 2026).

## 6. NEW Test — Daily Report of a Plan without works (F-7)
Create one new Test only after the file .claude/team/work/ETM-8042/new-tc-no-work.md exists (the automator writes it); use its summary and steps. Link it to ETM-8042 ("is tested by", as the other Tests), put it in the same Xray folder / Test Plan as the other ETM-8042 Tests, add it to Test Execution ETM-8873. Follow the etm-nn-fullqa rules for new Tests. If the file is not there yet, skip this part and say so.

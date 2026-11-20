# ETM-8844 (TC-016): Xray step update (user approved in chat 2026-11-20: "แก้แล้ว push")
Reason: the Shutdown Timeline tab has no Shutdown Size control (only a read-only Major/Medium/Minor tag); the user dropped the size-change steps.
Replace ALL steps with:
1. Open the Shutdown Timeline tab of the event and read the `Ramp down date` in the header. -> It shows the event Planned Date `08 Feb 2026`, not the Plan Ramp Down `15 Feb 2026`.
2. Open the Planning tab and read the badge of `Plan Scenario A`. -> It shows `Ramp Down/Up Date: 15 Feb 2026 09:00 - 25 Feb 2026 18:00` (the Plan keeps its own dates; the Timeline does not use them).
Precondition (step 1 Data if there is no precondition field): event Planned Date `08 Feb 2026 08:00 - 22 Feb 2026 08:00`; `Plan Scenario A` has `15 Feb 2026 09:00 - 25 Feb 2026 18:00`.

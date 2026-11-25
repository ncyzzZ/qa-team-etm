# ETM-8042 BA answers (given by the user in chat)

- 2026-11-17, analyst Q4 = questions-for-BA.md Q7 (Optimization: does the module receive the time too, or date only?): answer "ส่ง" = the Optimization Module receives date AND time (Plan Ramp Down Date/Time, Ramp Up Date/Time). Source: user's chat message "Q4 -> ส่ง".

- 2026-11-17, questions-for-BA.md Q1 (Shutdown Event has no Planned Date: is the Ramp Down/Up field empty and still mandatory?): answer "ต้องกรอก" = the field is still mandatory (the user must fill it). Source: user's chat message. Whether it is empty or pre-filled with something else is still covered by Q12.
- 2026-11-17, Q3 (Daily Reports created before the release): the earlier answer "ปล่อยตามเดิม" is WITHDRAWN by the user ("3. ไม่ได้นะ"). Q3 is OPEN again; do not write an Expected Result for old Daily Reports.
- 2026-11-17, round 2 answers from the USER in chat (not confirmed by the BA):
  - Q2: every Shutdown Event has a Planned Date ("ทุกอันมี"). So old Plans always get the Planned Date (AC-6); the empty-Planned-Date migration case is not needed.
  - Q4: user says the picker adjusts the time by itself, "ตามข้างหน้า" (following the front/start value), and sent a screenshot of the picker. Interpretation (to confirm in the app): when Ramp Up is earlier than Ramp Down the picker auto-corrects instead of rejecting (End follows Start). Equal Start/End is shown in the screenshot (both `21 May 2026 08:00`).
  - Q5: no error message ("ไม่มี") - consistent with Q4 (no error is shown, the value is adjusted).
  - Q6: no upper limit on the range, but the format must stay correct (`DD Mmm YYYY HH:mm`).
  - Q8: the Extension moves Ramp Up as the user chooses ("ตามที่ user เลือก").
  - Q9: no confirmation or warning when editing the dates.
  - Q10: the badge is always shown.
  - Q11: only the Turnaround Manager (TM) can use it; other roles cannot.
- Picker facts from the user's screenshot (Fact, user-pasted 2026-11-17, page not named): range picker `Start -> End` with a clear (x) icon; calendar on the left; time column on the right with hours and minutes in steps of 15 (00, 15, 30, 45); `OK` button; default time 08:00; values shown as `21 May 2026 08:00`.

- 2026-11-17, round 3 answers from the USER in chat (not confirmed by the BA):
  - Q12: Create Plan field is PRE-FILLED with the Shutdown Event's Planned Date (AC-1.3 is right; the Figma frame shows only the empty state).
  - Q13: yes, the badge always shows date and time (`DD Mmm YYYY HH:mm - DD Mmm YYYY HH:mm`).
  - Q14: yes, Save is disabled until the mandatory fields (Plan Name and Ramp Down/Up Date) are filled. The second part (invalid range: disabled or error) is covered by Q4/Q5: the picker adjusts the value, no error. Reply was just "ใช่", so the second part is an interpretation.

Still open: questions-for-BA.md Q3, Q15, Q16 (the user said "ข้ออื่นรอก่อน"). Answered by the user: Q1, Q2, Q4-Q14 (see above), Q7.

Note: docs/modules/planning-confirmation-result.md is only the Confirmation&Result sheet (toasts for Create/Duplicate/Edit/Delete Plan, no message text for a Ramp Up earlier than Ramp Down). The Planning Validation&Result.xlsx itself is not in the repo, so Q5 stays open.

## Round 4 (2026-11-18), answers from the USER in chat to the open list (not confirmed by the BA)
- Old Daily Report (created before the release, questions-for-BA open Q1 / old Q3): the snapshot is left BLANK ("ตัวนี้ว่างไว้"). To use the new rule the user goes back and picks the dates again, or triggers it again ("กลับมาเลือก หรือ trigger ให้มันอีกที"). Exact screen/button for "pick again / trigger" not stated -> note down in the app.
- Day 1 in the Daily Report PDF (old Q15): Day 1 = the Ramp Down date (not the First Execution Date after the 18:00 rule).
- Date format in Excel and PDF (old Q16): shown WITH time (`DD Mmm YYYY HH:mm`).
- Only Start or only End picked (open Q4): "ตามรูป" = like the user's screenshot of a Daily Report where the invalid cell is highlighted pink and Export/Freeze/Save are greyed. Interpretation (confirm in the app): `[ Save ]` stays disabled while the range is incomplete.
- Ramp Up picked earlier than Ramp Down (open Q5): the picker sets the value to the Ramp Down value (Ramp Up = Ramp Down, same date and time). This confirms the earlier "ตามข้างหน้า".
- Plan Card badge on a narrow card / long Plan Name (open Q6): it is shown normally; the length is limited by the field limits already set (Plan Name max 50, Description max 200).
All open questions are now answered by the user. Only suggestions S1-S4 remain unanswered.

- 2026-11-18, Save rule from the USER in chat (not confirmed by the BA): when something is changed Save must be possible; when a mandatory field is not filled Save is always disabled. Applied to Create/Edit Plan and to only Start / only End picked (interpretation: incomplete range = mandatory not filled = Save disabled). TC-020 now expects disabled.

## Round 5 (2026-11-18): BA answer file brought by the user (/Users/ncy/Downloads/2026-11-18_ETM-8042_qa-questions.md)
Fact (BA answer file given by the user, 2026-11-18; Dev still to confirm items marked Dev). These replace earlier user interpretations where they differ.
- Q1 old Daily Reports: keep the Shutdown Event Planned Date stored for that report (or migration fills the snapshot with the migrated Plan date). Expected: NO visible change for existing Daily Reports (same First Execution Date, last day, Gantt, Day numbering, S-Curve end). This REPLACES the earlier "blank snapshot" answer. Dev to confirm which of the two applies. In story AC 6.
- Q2 Daily Report PDF: Day 1 = snapshot Ramp Down date; if First Execution Date is Ramp Down - 1 (Ramp Down before 18:00) that date is Day0 (rule unchanged).
- Q3 Excel/PDF: only label (`Ramp Down Date` / `Ramp Up Date`) and value source change; cell format stays what the export uses today (take current export as baseline; date only stays date only). This REPLACES "shown with time".
- Q4 Save: disabled until Plan Name and both Ramp Down and Ramp Up (date and time) are filled; half-filled range = empty = Save disabled (AC 3.4, Create and Edit). Picker: after OK on Start focus moves to End; OK stays disabled until an End time is picked.
- Q5 Ramp Up earlier than Ramp Down: OPEN (Dev). Expected: saved range always Ramp Up >= Ramp Down, no error shown, equal date+time can be saved. The exact adjusted value is not stated by BA (user said Ramp Up = Ramp Down).
- Q6 badge: always one line, full text; Plan Name truncated with ellipsis when no space, hover shows full name (AC 4). Replaces "shown normally".
- C5 CORRECTION: the user does NOT choose a date in the Extension. Freezing the last day with tasks < 100% shows the `Extend Daily Report` confirmation (Confirm / Cancel). On Confirm the system extends as today (ETM-4125 AC 8) and moves the Plan Ramp Up Date and the Daily Report snapshot Ramp Up Date together; Event Planned Date unchanged. This REPLACES "Q8 as the user chooses".
- C6 no confirmation when editing; C8 only TM (Job Owner no); C9 Optimization gets date and time (Dev to confirm payload format).
- S1: pasting into the picker is IN SCOPE: valid `DD Mmm YYYY HH:mm` accepted; invalid (`31 Feb 2026 08:00`, `2026-02-08 08:00`) not accepted, field keeps previous value; Ramp Up >= Ramp Down and Save disabled while a side is empty still apply.
- S2: other roles with access to the Plan Card (Job Owner) see the badge.
- S3: Extension updates Plan Ramp Up and snapshot in one save, both or neither (Dev to confirm). S4: last save wins, no extra message.

- 2026-11-19, Fact (Figma screenshot pasted by the user, file "EMI - Turnaround (Planning)", frame "Create Plan" > "Update 29082026"): Create Plan starts from the Planning tab of a Shutdown Event. Path: Shutdown Event List -> open an event (tabs: Details, Manpower Resource, Planning, Timeline, Shutdown Organization) -> Planning tab. With no Plan the tab shows "No plan available" and a [Create Plan] button. Use this for the Navigation Path of the Create Plan cases.

- 2026-11-19, Fact (Figma screenshot pasted by the user, same file, frame "Create Plan" > "Update 29082026"): Edit Plan starts from the Planning tab too. When Plans exist, the tab shows a [Create Plan] button at the top right and one green Plan Card per Plan (example "AWP03 FSD Plan A", badge `Ramp Down/Up Date: 08 Feb 2025 08:00 - 10 Apr 2025 20:15`, Active toggle, three-dot menu). The three-dot menu lists Edit Plan, Duplicate Plan, Delete Plan. The card holds rows: Worklist (Initial), Shutdown Logic [Create], Manpower Mob Plan, Equipment Mob Plan, Daily Report (the last three say "A shutdown logic is required for creating this item." until Shutdown Logic exists). Use for the Navigation Path of the Edit/Duplicate cases.

## Round 6 — BA answers 2026-11-24 (via the Sprint 26 audit session; full text: work/SPRINT26/ba-answers-all-2026-11-24.md, section ETM-8042)
- Q9 (S-Curve end): the Planned S-Curve ends on the **last execution day = snapshot Ramp Up Date + extended days** (ETM-8042 AC 8.1, ETM-4125 AC 8, ETM-4127 AC 3). It is NOT the last task end and NOT the Event Planned end as such. Old Daily Report: snapshot = Event Planned end (DEC-048). An S-Curve ending on 12 Apr 2027 (last task end) is a **defect**.
- Q10 (Excel disabled on a 3-year range): QA asks Dev why Excel is disabled. Still open; defect candidate (no maximum timeframe in ETM-5492; ETM-3461 AC 1.2 disables Excel only with unsaved edits).
- Q11 (invalid pasted date): the picker **clears that part and disables Save**. The app is correct; S1 / DEC-052 are updated. ETM-8851 as changed on 20 Nov is right.

## Round 7 — BA answer 2026-11-25 (user typed in the lead chat, answering as BA)
- Q12 (invalid typed/pasted date, ETM-8851, AC 1.2) = **(b)**: the picker puts back the previous valid value. Not a defect. This REPLACES Q11 ("clears that part and disables Save"). AC 1.2 / S1 wording and the ETM-8851 Xray expected result should say "previous value is put back".
- Q12 second part (Start puts the value back on the next click, End already on Tab): not answered. QA treats both as acceptable and only checks the value after leaving the field.

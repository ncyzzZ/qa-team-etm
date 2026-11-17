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

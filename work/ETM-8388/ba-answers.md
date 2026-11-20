---
key: ETM-8388
title: "[Improvement] Shutdown Timeline - Table Copy and Paste Support"
source: "qa/ETM-8388 questions-for-BA.md (received 2026-11-18)"
jira_status: Deployed to QA (Jira updated 2026-11-17 15:18; description = local v4, pushed 2026-11-17 14:50)
status: draft-answers (waiting for BA)
---

# ETM-8388 Questions for BA: draft answers

⚠️ **QA's file says "In Development. No comments."** The story was updated on **17 Nov 14:50** (AC 3.2: 3 new bullets, Jira comment 596181) and is now **Deployed to QA**. Please re-read AC 3.2 before writing the test cases. Q3 and Q7 are partly answered by that update.

**Drafted 2026-11-18** from ETM-8388 (v4), DEC-009/011/036/041/042/043, OQ-030–034, ETM-7348, ETM-7349, ETM-7351 (the reference for the paste rules), ETM-8405, ETM-6928, ETM-8550 (sub-task of ETM-8388, Dev comment 2026-11-17), `Shutdown Timeline Validation&Result.xlsx › Confirmation&Result R14, R20` (modified 2026-11-17, = mirror).

Legend: ✅ answered · 🟡 proposed, BA must confirm · ❓ open

| Status | Items |
|---|---|
| ✅ | 1, 2, 4, 5, 6, 7, 8, 12, 13, 14, 19, 3, 9, 10, 11, 15, 16, 17, 18 (BA confirmed 2026-11-18) |

## Paste Validation Failed modal (AC 1.5)

1. ⭐ Modal content.
   **✅ Answer:** Title `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, one button `[ OK ]` (primary). It does not list cells or counts. `[ OK ]` closes it; invalid cells stay cleared and mandatory ones stay red. Same modal on Timeline and Edit Plan (`Shutdown Timeline Validation&Result.xlsx › Confirmation&Result R14, R20`; AC 1.5 aligned with ETM-7351 AC 3.1).

2. ⭐ Partial or all-or-nothing?
   **✅ Answer: Partial.** Valid cells are applied; each invalid cell is cleared (AC 1.5 is per value; DEC-011; same as ETM-7351 AC 3.4.3 "Partial Paste Preservation").

3. ⭐ Modal for truncated / clamped / cut-off / ignored values?
   **✅ Confirmed (BA 2026-11-18): No modal for any of these.** The modal is only for values that are **invalid and cleared**.
   - Weekly `Plan (%)` on Edit Plan: written in AC 3.2 since 17 Nov (DEC-043): truncated or set to `100.0` → no modal; negative / not a number → cleared + modal. ✅
   - Text longer than the max (Activity 500, Action By 50, Focal Point 50): truncated "without error" (AC 3.1, aligned with ETM-7351 AC 3.2.1). ✅
   - Weekly `Actual (%)` on Timeline: same idea as Plan (%): truncated / clamped → no modal; invalid (blank by ETM-7349 AC 2.4) → modal.
   - Values cut off (future week on Timeline, outside Start–End on Edit Plan) and extra Status rows ignored on Timeline: no modal.

4. Date in another Excel format (`2025-11-03`, `03/11/2025`).
   **✅ Answer:** not a valid `D Mon YYYY` / `DD Mon YYYY` date → not applied, cell **cleared**, modal shown (AC 3.1 + AC 1.5). Start / End Date are mandatory, so the cell turns red and `[ Save ]` is disabled.

## Copy across Activity Groups (AC 1.3, 1.4)

5. ⭐ Rows from the second group pasted into one group.
   **✅ Answer:** the copied data has activity rows only (header rows skipped, AC 1.4), and **all rows are pasted into the anchor's group** (AC 1.3, DEC-011).
   - Edit Plan: rows beyond the group's remaining activities → **new activities are added** at the bottom of the anchor's group (AC 3.1 Automatic Activity Creation).
   - Timeline: rows beyond the group's remaining activities → **ignored** (AC 2.1).
   No message in either case.

## Weekly cells (AC 2.2, 3.2)

6. ⭐ Selecting weekly cells from two rows.
   **✅ Answer: selection is blocked.** AC 2.2: selecting two rows at once is not allowed. Dev (ETM-8550, 17 Nov): "a block of weeks stays on one activity and one Plan/Actual line". No message is defined.

7. Plan (%) row copied into Actual (%) row, or the reverse.
   **✅ Answer: Yes.** The clipboard holds values only. Copy is allowed from either row (AC 2.2, 3.2); what matters is the target: Timeline accepts paste into weekly `Actual (%)` only, Edit Plan into weekly `Plan (%)` only. A paste anchored on the read-only row: see Q16.

## Status column (AC 2.1)

8. Paste Status into a Close / locked activity; blank clipboard cell.
   - Close activity: **✅** Status can be changed on any activity row on the Timeline (ETM-7349 AC 1.3), so a pasted `Open` / `Close` is applied to a Close activity too.
   - Blank (or any value other than `Open` / `Close`): **✅ Answer (BA 2026-11-18, confirmed 13:27, DEC-050): the activity keeps its current Status.** The cell is not cleared and does not turn red, and `[ Update Progress ]` is not disabled by it. The `Paste Validation Failed` modal is shown once per paste (the value was not applied). This is an exception to AC 1.5 for the Status column, because a Status can never be empty (ETM-7349). Now in the story: **ETM-8388 AC 2.1** (updated in Jira 18 Nov 2026 15:32).

## Columns outside paste (AC 3.1)

9. Copied block spans `Plan (%)` on Edit Plan, or Actual Status / Remark.
   **✅ Confirmed (BA 2026-11-18):** the data for that column is **ignored** and the rest of the block is **not shifted** (same as ETM-7351 AC 2.2 for read-only columns). The paste is not blocked and no modal is shown. On the Timeline only Status and weekly Actual (%) take values; every other column in the block is ignored.

## Conflicting rules between cards

10. ⭐ Which story wins; "keyboard-only, Excel paste not wanted" note.
    **✅ Confirmed (BA 2026-11-18):** ETM-8388 is the latest requirement for copy & paste on Shutdown Timeline (created 11 Nov from BA, updated 17 Nov). Where its wording differs from ETM-7348 / 7349 / 7351 / 8405 for copy & paste, **ETM-8388 wins**; the other stories still define the field rules it refers to. Copy & paste from Excel **is** in scope (Story "So that": "from Excel or from other rows"). The "keyboard-only" note is not in the workspace; if it is in an older ETM-7348 note, ETM-8388 replaces it.

## Keyboard navigation (ETM-8550) and other behaviour

11. ⭐ ETM-8550 scope.
    **✅ Confirmed (BA 2026-11-18)** ETM-8550 is a Dev **sub-task of ETM-8388**, not a separate story; it has no AC. What Dev built (comment 17 Nov): block selection by Shift+click, Shift+arrow or drag; a block of weeks stays on one activity and one Plan/Actual line; ↑/↓ move between the Plan and Actual lines in week columns; read-only cells can be selected but not opened; Tab/Enter from a weekly Plan (%) edit opens the next editable cell.
   

12. Undo (Ctrl+Z) of a paste; Delete / Backspace on a range.
    **✅ Answer (BA 2026-11-18, DEC-054): no Undo.** The Shutdown Timeline (Timeline and Edit Plan) has **no Undo / Redo function**, and ETM-8388 does not add one (Undo/Redo exists only on Shutdown Logic, ETM-2703). Expected result: `Ctrl+Z` / `Cmd+Z` after a paste does **not** revert the pasted cells. To get rid of a paste, the user fixes the cells again, or leaves without saving (the existing unsaved-changes guard; a paste marks the screen as unsaved, AC 1.6).
    **Delete / Backspace on a range:** not in the story; out of scope for ETM-8388. QA records what happens as information only.

13. Maximum rows / columns; 100+ rows.
    **✅ Answer (BA 2026-11-18, DEC-054): no limit.** One test with a large Excel block (100+ rows) is enough to show the paste completes with the correct result.

## Added by test design

14. Which button is disabled on the Timeline?
    **✅ Answer:** `[ Update Progress ]`. It is the commit button on the Timeline (ETM-7349 AC 5); `[ Save ]` is on Edit Plan. AC 1.5 says `[ Save ]` for both screens; read it as the screen's commit button. (On the Timeline no pasted value makes a mandatory cell empty: an invalid Status keeps the old value (Q8, DEC-050), and weekly Actual (%) may be blank. So `[ Update Progress ]` is not disabled by a paste, except by the existing Total Actual > 100.0 rule in ETM-7349 AC 4.2.)

15. Edit Plan: pasted Start Date later than End Date.
    **✅ Confirmed (BA 2026-11-18):** evaluate left to right, as ETM-7351 AC 3.3.2: Start Date is applied; End Date is checked against it. If both are pasted, **End Date** is cleared (red, mandatory) + modal. If only Start Date is pasted and it is later than the existing End Date, **Start Date** is not applied (cleared, red) + modal. `[ Save ]` disabled until fixed.

16. Paste anchor on a read-only cell.
    **✅ Confirmed (BA 2026-11-18):**
    - Timeline, anchor on a weekly `Plan (%)` cell: nothing is pasted, no shift to another row, no modal.
    - Edit Plan, anchor on a week outside Start–End: values that land outside the range are cut off (AC 3.2); values that land inside the range in the same row **are** applied (the block is not shifted). No modal.

17. Status ` Open ` with spaces.
    **✅ Confirmed (BA 2026-11-18):** trimmed, then matched case-insensitively → `Open`.

18. Activity with double spaces / spaces only.
    **✅ Confirmed (BA 2026-11-18):** text is kept exactly as pasted (`Pipe  Test` stays). A value of spaces only counts as **empty**: cleared, red (mandatory, ETM-7348 AC 4.2), `[ Save ]` disabled, modal shown.

19. `3 Jun 2026` (one-digit day).
    **✅ Answer:** accepted (AC 3.1 allows `D Mon YYYY`) and **shown as `03 Jun 2026`** (ETM-7348 field table: Start/End Date format `DD Mmm YYYY`).

# BA answer round 2 (2026-11-20, via the user in chat)
- Q1 (multi-row weekly Plan (%) paste, AC 3.2 a): only the first row is pasted; the other rows must be ignored. The app pastes row 2 into the next activity (Valve Overhaul W2 17.5 -> 80.0): defect. ETM-8723 test case stays as is.

# Date format on paste: ETM-7902 overrides (2026-11-20)
- ETM-7902 (Done) "Cross-Module - Flexible Date and Time Input Auto-Conversion" covers Shutdown Timeline Preparation Task Start/End Date, typed and pasted (AC 4). 16 day-first formats (D/M/YY, DD/MM/YYYY, hyphen, space, compact 4/6/8 digits) convert to DD Mmm YYYY.
- So `03/06/2026` -> `03 Jun 2026` is correct. Invalid (31/02/2026, text, dot delimiter, 5/7-digit numbers) -> cell blank + red, Save disabled (AC 5).
- ETM-8388 AC 3.1 and round 1 Q4 ("only D Mon YYYY") are outdated. ETM-8720 TC must be rewritten; not a defect.
- Q2 (8722, round 2): new activities created by a paste stay quiet (no red) on their empty Start/End Date until the user touches a date, same as Add Activity (ETM-7310 pattern); Save stays disabled. TC ETM-8722 step 4 must change; not a defect.

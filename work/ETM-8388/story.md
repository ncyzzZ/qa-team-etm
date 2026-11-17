# ETM-8388 [Improvement] Shutdown Timeline - Table Copy and Paste Support
Status: In Development (not yet Ready for QA). Parent epic: ETM-6971 Shutdown Timeline. Comments: none. Linked Tests: none.
Subtasks: ETM-8549 [FE] implement copy paste logic; ETM-8550 [FE] implement keyboard navigation; ETM-8551 [FE] unit test; ETM-8570 [QA] Create Test Case Manual Test (In Progress); ETM-8572 [QA] Execute Test Case Manual Test (Open).
Relates to: ETM-8524 (Done). Refs: ETM-7345, ETM-7348, ETM-7349, ETM-8405 (ETM-7351 referenced for aligned rules).

**As a** Turnaround Manager **I want to** copy and paste data in the Shutdown Timeline table on the Timeline screen and the Edit Plan screen **So that** I can fill in status, weekly progress and the preparation plan quickly from Excel or from other rows, instead of typing every cell.

## Pre-Conditions
* Timeline screen: user logged in with **View Timeline** and **Update Progress and Note** permissions.
* Edit Plan screen: user logged in with **View Timeline** and **Edit Plan** permissions, opened **Edit Shutdown Timeline Plan** via `[ Edit Plan ]`.
Data source: Shutdown Timeline Validation&Result.xlsx (sheets `Update Progress`, `Edit Shutdown Timeline Plan`).

## Acceptance Criteria
1. Common Copy & Paste Rules (both screens)
   1.1 Copy: Ctrl+C / Cmd+C copies selected cells to clipboard as tab-separated values pasteable into Excel.
   1.2 Paste Modes: pasting while a cell is focused (Focus Mode) or in edit mode (Edit Mode) behaves the same: clipboard data is mapped across the grid starting from the active cell as top-left anchor. (ETM-7351 AC 2.1)
   1.3 Activity Group Scope: paste applies only within the Activity Group containing the anchor cell. Never flows into another Activity Group. (ETM-7351 AC 4.1)
   1.4 Copy Across Activity Groups: user can select and copy cells spanning more than one Activity Group. Copied data skips Activity Group header rows, activity rows only. Paste still applies within the anchor's Activity Group (AC 1.3).
   1.5 Invalid Values: a pasted value that fails validation is not applied and the cell is cleared. If the field is mandatory, the cleared cell shows red background (#FFCCC7) and [ Save ] is disabled until fixed. The `Paste Validation Failed` modal is shown once per paste action. (ETM-7351 AC 3.1)
   1.6 Unsaved Changes: a paste marks the screen as having unsaved changes (isDirty = true), same as manual editing.
2. Timeline Screen
   2.1 Status Column:
     - Copy: single Status cell or several Status cells down the column.
     - Paste: into Status column only. Each value must be `Open` or `Close` (case-insensitive), converted to official spelling.
     - If pasted data has more rows than remaining activities in the anchor's Activity Group, extra rows are ignored (activities cannot be added on Timeline screen).
   2.2 Weekly Cells:
     - Copy: single weekly cell, or a range of weekly cells within ONE row, from weekly Plan (%) row or weekly Actual (%) row. Selecting cells from two rows at once (Plan and Actual together, or two activities) is not allowed.
     - Paste: into weekly Actual (%) cells only. Weekly Plan (%) cells on Timeline are read-only.
     - Pasted values follow weekly Actual (%) input rules in ETM-7349 AC 2.4 (truncate to 1 decimal place, clamp above 100.0, invalid input leaves the cell blank).
     - Pasted values that would land in a future week (after the Current Week, locked per ETM-7349 AC 2.3) are cut off and not applied.
3. Edit Plan Screen
   3.1 Table Columns (Activity to End Date):
     - Copy & Paste NxN across Activity, Action By, Focal Point, Start Date, End Date.
     - Plan (%) is NOT included in copy & paste. Can be changed by typing, or recalculated from weekly Plan (%) (ETM-8405 AC 2).
     - Field rules: Activity (max 500), Action By (max 50), Focal Point (max 50): longer values truncated to max length (ETM-7348 AC 3.1). Start Date / End Date: valid date in `D Mon YYYY` or `DD Mon YYYY`, otherwise value not applied. Start Date <= End Date applies (ETM-7348 AC 4.3). Empty mandatory cell shows red background and disables [ Save ] (ETM-7348 AC 4.2). Pasting Start/End Date recalculates the activity's weekly Plan (%) (ETM-8405 AC 3).
     - Automatic Activity Creation: if pasted data has more rows than remaining activities in anchor's Activity Group, system adds new activities at the bottom of that group for extra rows. New activities use defaults from ETM-7348 AC 2.1 (Plan (%) = 0.0, Status = Open); fields not covered by paste stay empty. (ETM-7351 AC 4.2)
   3.2 Weekly Cells:
     - Copy: single weekly cell or range within ONE row, from weekly Plan (%) row or Actual (%) row.
     - Paste: into weekly Plan (%) cells only, following input rules in ETM-8405 AC 1.5.
     - Editable Range Only: only weeks within the activity's Start Date - End Date are editable (ETM-8405 AC 1.1). Pasted values outside this range are cut off and not applied.
     - After paste, activity's Plan (%) is recalculated as sum of its weekly values (ETM-8405 AC 2).

## UI Design
Reference Mockup: To be provided. Design System: PTTEP Nualta Data Grid edit components.

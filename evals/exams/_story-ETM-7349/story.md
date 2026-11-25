# ETM-7349 Shutdown Timeline - Weekly Actual Progress Tracking, Cumulative Variance Bars & Progress Commit
Frozen for a defect exam: description as it was before 2026-11-09T13:41 (Jira changelog version of 2026-11-04T23:50, Jira wiki markup; 4 later edits not included), comments written before 2026-11-09T13:41 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* update activity Open/Close status, input weekly actual progress up to the current week on the main Timeline screen, view cumulative Red/Green progress bars, and commit progress updates
*So that* actual preparation performance is accurately recorded against the planned schedule with instant variance visibility, protective over-limit blocking, and persistent audit integrity.

----

*Pre-Conditions*

* The user is logged in as a *Turnaround Manager* with *View Timeline* and *Update Progress and Note* permissions in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Timeline* tab of an active Shutdown Event.

----

*Data Source*

* Weekly {{Actual (%)}} inputs, task {{Plan (%)}}, {{Total Progress}} rollups, and Server Time strictly in {{UTC+7}} *(*{{Asia/Bangkok}}*)*.
* *Validation & Result Reference*: [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result & Sheet: Update Progress|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU].

----

*Acceptance Criteria*

# *Activity* {{Status}} *Dropdown Management (*{{Open}} */* {{Close}}*)*:
## Rendered in the pinned {{Status}} column (immediately to the right of the vertical gray splitter bar) on *every Activity row* (Activity Group header rows and the {{Total Progress}} row do not display a {{Status}} dropdown).
## *Dropdown Options & Visual Styling*:
##* {{Open}} (Default): Light red pill badge with Background {{#FFF1F0}}, Border {{#FFA39E}}, Text {{#F5222D}}.
##* {{Close}}: Light green pill badge with Background {{#F6FFED}}, Border {{#B7EB8F}}, Text {{#52C41A}}.
## *Timeline Screen Direct Editing*: On the main *Timeline* screen, users with *Update Progress and Note* permission can directly click and select {{Open}} or {{Close}} on any Activity row, immediately updating the pill styling and marking the Timeline draft dirty ({{isDirty = true}}, enabling {{[ Update Progress ]}} unless blocked by {{Total Actual (%) > 100.0}}). Users without this permission cannot update status (the dropdown is disabled / read-only).
## *Edit Plan Screen & View-Only Restriction*: In the *Edit Plan* screen ([ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]), {{Status}} is strictly read-only across all rows. Users without *Update Progress and Note* permission view disabled {{Status}} dropdowns across all screens.
# *Weekly* {{Actual (%)}} *Entry Rules & Current Week Cutoff (*{{UTC+7}}*)*:
## Each Activity row renders two sub-rows across the {{Progress}} and Weekly Timeframe columns: top sub-row for {{Plan (%)}} and bottom sub-row for {{Actual (%)}}.
## *Past & Current Weeks (*{{Week Index <= Current Week}} *in* {{UTC+7}}*)*:
##* On the main *Timeline* screen, Turnaround Managers can directly input or edit numeric {{Actual (%)}} values in any week from the earliest displayed week up through the *Current Week*.
##* *Independent of Planned Weeks*: Entering {{Actual (%)}} does *not* require that week to have a planned percentage; users can record actual progress in any past or current week regardless of the task's planned duration.
## *Future Weeks (*{{Week Index > Current Week}} *in* {{UTC+7}}*)*:
##* Strictly disabled / non-editable (displayed empty); users cannot enter {{Actual (%)}} in any future week.
## *Formatting, Decimal Rules, Paste Auto-Rounding & 100% Upper Clamping*:
##* *Typing Keystroke Blocking (Max 1 Decimal Digit)*: The system strictly *blocks typing more than 1 decimal digit* (keystrokes attempting to enter a second decimal digit after the decimal point are immediately suppressed / prevented).
##* *Pasted Value Auto-Rounding*: If a value with more than 1 decimal place is pasted into a cell, the system *automatically rounds the value to 1 decimal digit* (e.g., pasting {{12.36}} automatically rounds to {{12.4}}, {{12.34}} rounds to {{12.3}}).
##* *Weekly Actual Clamping (> 100.0% Rounddown to 100.0%)*: If a value greater than {{100%}} (e.g., {{105%}}, {{120.5%}}) is entered or pasted into any weekly {{Actual (%)}} cell, the system *automatically rounds down / clamps the weekly cell value to exactly* {{100.0%}}.
##* *Bottom Row Total Actual Progress Non-Rounding / Unclamped*: The bottom {{Total Progress}} summary row (both weekly timeframe columns and the pinned {{Progress}} summary column) does *NOT* round down or clamp to {{100.0%}}—it calculates and displays the true mathematical sum of actuals across all activities even when exceeding {{100.0%}} (e.g., {{102.0%}} in a weekly column, {{107.0%}} in the overall progress cell per [Figma node-id: 200-494301|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=200-494301&t=qHFQNlxqjM3JG8XR-4]), which triggers the blocking error per AC 4.2.
##* *Zero Value Grid Anchoring*: A recorded value of {{0}} or {{0.0}} is treated as a valid non-blank actual entry that anchors the dynamic auto-bounding timeframe grid per [ETM-7346|https://pttep.atlassian.net/browse/ETM-7346].
##* Clearing the cell or entering negative/invalid input resets the cell to blank/empty.
## *Screen Editability*: Weekly {{Actual (%)}} cells are directly editable *exclusively on the main Timeline screen* by users with *Update Progress and Note* permission. In the *Edit Plan* screen ([ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]) and for users without this permission, all weekly {{Actual (%)}} cells are strictly read-only.
## *Calculated Totals (Non-Editable / Read-Only)*:
##* *Task Total* {{Actual (%)}}: In the pinned {{Progress}} column on each Activity row, the {{Actual (%)}} cell displays the calculated sum of that task's weekly actual entries. This cell is strictly *read-only / non-editable*.
##* *Weekly Total* {{Plan (%)}}: In the bottom {{Total Progress}} summary row, each weekly timeframe column displays the calculated sum of {{Plan (%)}} across all activities for that specific week. *Rendered as blank if and only if all tasks in that week have blank* {{Plan (%)}}. If at least one task has a planned percentage, the sum is displayed (e.g., {{12.5}}).
##* *Weekly Total* {{Actual (%)}}: In the bottom {{Total Progress}} summary row, each weekly timeframe column displays the calculated sum of {{Actual (%)}} across all activities for that specific week. *Rendered as blank if and only if all tasks in that week have blank* {{Actual (%)}}. Entering {{0}} or {{0.0}} is treated as a numeric entry (not blank); if any task in that week contains {{0}} or {{0.0}}, the total actual cell calculates and displays the numeric sum (e.g., {{0.0}}). These cells are strictly *read-only / non-editable*.
##* *Overall Total* {{Actual (%)}}: In the bottom {{Total Progress}} summary row -> {{Progress}} column, the cell displays the cumulative grand total of {{Actual (%)}} across all tasks and weeks. This cell is strictly *read-only / non-editable*.
# *Weekly* {{Actual (%)}} *Bar Colors — Cumulative Red / Green Evaluation*:
## On the main *Timeline* screen (bars are hidden in Edit Plan per [ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]), weekly {{Actual (%)}} progress bars are colored *Red* or *Green* based on cumulative comparison from task start up through the evaluated week {{W}}:
##* *Strict Evaluation Scope*: Cumulative Red/Green progress bars are evaluated and rendered strictly at two levels: (1) *Individual Activity Rows* and (2) *Bottom* {{Total Progress}} *Row*. Activity Group header rows strictly render dark navy summary brackets without Red/Green progress bars per [ETM-7346|https://pttep.atlassian.net/browse/ETM-7346].
##* *Bar Presence Rules (Both Task Rows and Total Progress Row)*:
##** *Numeric Entry Present*: Any week where {{Actual (%)}} has a recorded numeric value (including {{0}} or {{0.0}}), a colored progress bar is *always displayed*.
##** *Blank Actual with Plan in Past/Current Week*: Any week where {{Actual (%)}} is blank, but that week has a planned percentage ({{Plan (%)}} is not blank) *and* {{Week Index <= Current Week}} in {{UTC+7}}, a colored progress bar is *always displayed* (even though the cell text remains blank).
##** If {{Actual (%)}} is blank and the week has no planned percentage (or is a future week {{Week Index > Current Week}}), no progress bar is rendered (cell remains blank without a bar).
##* *Cumulative Calculation with Blanks (Blank Treated as 0.0)*:
##** The bar color formula compares cumulative actual progress against cumulative planned progress from task start up to week {{W}}:
##*** *Green Bar*: {{CumActual_W >= CumPlan_W}} (Green {{#95DE64}}).
##*** *Red Bar*: {{CumActual_W < CumPlan_W}} (Red {{#F5222D}}).
##** In accumulating {{CumActual_W}}, any blank week is treated mathematically as {{0.0}}. (For example, if a past week has a plan of {{3.0}} and actual is left blank, {{CumActual}} adds {{0.0}}, resulting in {{CumActual < CumPlan}}, rendering a *Red Bar* on that blank cell).
##* *Tasks without Start Date & End Date (Optional Tasks)*: For any task that has no {{Start Date}} and {{End Date}} (e.g., Minor SD optional tasks seeded without dates per [ETM-7347|https://pttep.atlassian.net/browse/ETM-7347]), no planned percentage is distributed across any week ({{CumPlan_W = 0.0}}). Whenever an {{Actual (%)}} value is recorded in a week for such a task, the cumulative comparison {{CumActual_W >= CumPlan_W}} ({{CumActual_W >= 0.0}}) strictly evaluates as ahead/on-track; weekly {{Actual (%)}} bars on undated/optional tasks *always render in Green* ({{#95DE64}}).
##* *For the Bottom* {{Total Progress}} *Row*: Accumulate weekly {{Actual (%)}} across all tasks from the first timeline week up to week {{W}} ({{CumTotalActual_W}}, treating blank weeks as {{0.0}}) and compare against cumulative weekly {{Plan (%)}} across all tasks up to week {{W}} ({{CumTotalPlan_W}}):
##** *Green Bar*: {{CumTotalActual_W >= CumTotalPlan_W}} (Green {{#95DE64}}).
##** *Red Bar*: {{CumTotalActual_W < CumTotalPlan_W}} (Red {{#F5222D}}).
# *Progress Validations: Over-Plan Warning & Total Progress Blocking Errors*:
## *Task Over-Plan Warning (Yellow — Non-Blocking)*:
##* When an individual task's total {{Actual (%)}} exceeds that task's total {{Plan (%)}} ({{Task Actual > Task Plan}}):
##** The task's total {{Actual (%)}} cell in the {{Progress}} column displays a *yellow warning* background highlight ({{#FFE7BA}}).
##** Hovering over the yellow warning cell displays a tooltip with warning text ({{#FA8C16}}): {{"The actual progress is over the planned progress."}}.
##* Displayed on *both the main Timeline screen and the Edit Plan screen*.
##* This warning is informational and *does not disable* the {{[ Update Progress ]}} button or the {{[ Save ]}} button.
## *Total* {{Actual (%)}} *Error (*{{Total Actual (%) > 100.0}} *— Blocking)*:
##* Total {{Actual (%)}} across all tasks must not exceed {{100.0}}.
##* Whenever {{Total Actual > 100.0}} (as illustrated in [Figma node-id: 200-494301|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=200-494301&t=qHFQNlxqjM3JG8XR-4]):
##** The {{Total Progress}} -> {{Actual (%)}} summary cell displays a *red background* ({{#FFCCC7}}).
##** Hovering over the red summary cell displays a tooltip with red text ({{#F5222D}}): {{"The overall progress must not exceed 100%."}}.
##** The {{[ Update Progress ]}} button on the Timeline toolbar is *strictly disabled*.
# *Commit Action (*{{[ Update Progress ]}}*), Concurrency & Unsaved Guard*:
## *Button States*:
##* Disabled when no unsaved modifications exist ({{isDirty == false}}).
##* Disabled whenever {{Total Actual > 100.0}}.
##* Enabled when valid unsaved modifications exist ({{isDirty == true}} and {{Total Actual <= 100.0}}).
## *Commit Execution*: Clicking {{[ Update Progress ]}}:
##* Persists all weekly {{Actual (%)}} entries, {{Status}} selections, and Activity Group collapse/expand states to the database. (Note: {{Key Milestones}} notes are created, edited, and deleted directly in the database upon modal action per [ETM-7350|https://pttep.atlassian.net/browse/ETM-7350], completely independent of this button).
##* If any out-of-range {{Actual (%)}} values were cleared (left blank/empty), the weekly timeframe grid *automatically recalculates (contracts)* to remove obsolete outer week columns ([ETM-7346|https://pttep.atlassian.net/browse/ETM-7346]); any operational milestone note residing in an obsolete week column outside the recalculated timeframe is *automatically deleted from the database without any confirmation modal or warning prompt* ([ETM-7350|https://pttep.atlassian.net/browse/ETM-7350]).
##* Displays a success toast notification per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 3–4|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU]:
##** *Title*: {{Update Success}}
##** *Message*: {{Update Progress Successfully.}}
_(If commit fails, displays toast fail: Title:_ {{Update Failed}}_, Message:_ {{Update Progress Failed.}}_)_
##* Resets {{isDirty = false}}.
## *Concurrent Plan Modification Reload Modal*:
##* If the timeline baseline plan has been updated by another user or background job ({{Plan has Been Changed}}), attempting to commit progress (or refreshing) triggers a reload confirmation modal per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 5|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU]:
##** *Modal Type*: {{Confirmation Modal - Style 1}}
##** *Title*: {{Plan has Been Changed}}
##** *Message*: {{The shutdown timeline has already been updated. This action will reload the page and update some data.}}
##** *Button*: {{[ OK ]}} (reloads the page to reflect the latest baseline plan and resets dirty state).
## *Unsaved Changes Guard on Navigation & Leave Page*:
##* If a user modifies weekly actuals or status dropdowns ({{isDirty == true}}) and attempts any of the following navigation actions without clicking {{[ Update Progress ]}}, the system intercepts navigation and triggers an unsaved confirmation modal per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 6|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU]:
##** *Navigation Triggers*:
##**# *Changing Tabs*: Switching to any other tab within the Shutdown Event (e.g., *Planning*, *Manpower Resource*, *Details*, *Shutdown Organization*, *Shutdown Logic*, *Worklist*, *Daily Report*).
##**# *Going to Edit Plan Page*: Clicking the {{[ Edit Plan ]}} button in the Timeline toolbar to navigate to the Edit Plan screen ([ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]).
##**# *Leaving the Page*: Navigating away via the side navigation menu, breadcrumbs, or browser navigation/refresh.
##** *Modal Specifications*:
##*** *Modal Type*: {{Confirmation Modal - Style 1}}
##*** *Title*: {{Unsaved Change}}
##*** *Message*: {{Are you sure you want to leave this page? Changes you made will not be saved.}}
##*** *Buttons*: {{[ Continue Editing ]}} (stays on the page, keeping uncommitted draft edits) / {{[ Discard Change ]}} (discards uncommitted draft edits and proceeds with the requested navigation).
# *Field Specification Table (Progress Tracking & Commit)*:

||Field Name||Data Type||Required?||Nullable?||Default Value||Max Length / Range / Enum||Notes||
|Status|Dropdown|Yes|No|{{Open}}|Enum: {{Open}}, {{Close}}|Pinned column; direct edit on Timeline by users with {{Update Progress and Note}}.|
|Weekly Actual (%) (Activity)|Decimal|No|Yes|Empty|[0.0, 100.0]|Formatted to 1 decimal place; keystroke blocks > 1 decimal digit; paste auto-rounds to 1 decimal digit; values > 100% round down to exact 100.0%; editable up to Current Week.|
|Task Total Actual (%) (Activity)|Decimal|Yes|No|0.0|>= 0.0|Pinned {{Progress}} column; calculated sum of task weekly actuals; read-only (not editable); not clamped.|
|Weekly Total Plan (%) (Total Progress)|Decimal|No|Yes|Empty|[0.0, 100.0]|{{Total Progress}} row per week; calculated sum of {{Plan (%)}} across all activities; read-only (not editable); rendered as null/blank if all tasks in this week have blank {{Plan (%)}}.|
|Weekly Total Actual (%) (Total Progress)|Decimal|No|Yes|Empty|>= 0.0|{{Total Progress}} row per week; calculated sum of {{Actual (%)}} across all activities; read-only (not editable); *can be null/empty if all actuals in this week are null/empty*.|
|Overall Total Actual (%) (Total Progress)|Decimal|Yes|No|0.0|>= 0.0|{{Total Progress}} row {{Progress}} column; calculated grand total; read-only (not editable); not clamped (true sum); blocking error if > 100.0.|

# *Empty State Specifications*:
## *First-Time State*: All weekly {{Actual (%)}} cells initialize empty (displayed as an empty blank cell, not a hyphen {{"-"}} or dash {{"–"}}) with total {{Actual (%) = 0.0}}.
## *Sectional Empty State*: An Activity Group with {{No activity added.}} displays no progress inputs.
# *Role & Permission Visibility Matrix*:
## *View Access*: Users with *View Timeline* view {{Status}}, weekly actuals, cumulative progress bars, and {{Total Progress}} in read-only mode.
## *Update Access (Permission-Driven)*: Users with *Update Progress and Note* permission see the {{[ Update Progress ]}} button (enabled when modifications exist and total <= 100.0%, disabled when clean or total > 100.0%) and can modify {{Status}} dropdowns and weekly {{Actual (%)}} cells up to the current week.
## *No Update Permission Restriction (Hidden Button & Read-Only Cells)*:
##* *Button Visibility*: The {{[ Update Progress ]}} button is *strictly hidden* for any user without *Update Progress and Note* permission.
##* *Strictly Permission-Driven*: This behavior strictly depends on the user's granular *permission* ({{Update Progress and Note}}), *not* on their assigned role (regardless of whether the user is a Job Owner, Planner, or any other role).
##* *Cell & Dropdown Editability*: All {{Status}} dropdowns and weekly {{Actual (%)}} input cells are strictly *disabled / read-only* for users without *Update Progress and Note* permission.
# *Strict Cross-Module Isolation Rule*:
## Progress tracking operates strictly within the Shutdown Timeline dataset and does not modify task progress or status in *Worklist* or *Shutdown Logic*.

----

*UI Design*

* *Reference Mockups*:
** [Task Over-Plan Warning (Figma node-id: 188-344446)|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=188-344446&t=qHFQNlxqjM3JG8XR-4]
** [Bottom Row Total Actual Unclamped & Over-100% Error (Figma node-id: 200-494301)|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=200-494301&t=qHFQNlxqjM3JG8XR-4]
* *Design System*: Built using PTTEP Nualta Data Grid progress components.

----

## Comments (before 2026-11-09T13:41)

### Thanawat Chongphipatmongkol, 2026-11-04T23:50

\[BA Specification Update - Sprint 25 Grooming Alignment\]

Summary of Acceptance Criteria (AC) refinements for ETM-7349:

1\. AC 2.4 (Decimal Rules, Keystroke Blocking & Paste Auto-Rounding):  
\- Keystroke Blocking: The system strictly blocks typing more than 1 decimal digit; keystrokes attempting to enter a second decimal place are immediately suppressed.  
\- Pasted Value Auto-Rounding: If a value with more than 1 decimal place is pasted into a cell, the system automatically rounds the value to 1 decimal digit (e.g., 12.36 -> 12.4, 12.34 -> 12.3).

2\. AC 2.4 & AC 4.2 (Weekly Actual Clamping vs. Bottom Row Unclamped Total):  
\- Weekly Actual Clamping: Entering or pasting a value > 100% into any weekly Actual (%) cell automatically rounds down / clamps the cell value to exactly 100.0%.  
\- Bottom Row Total Actual Unclamped: The bottom Total Progress summary row (both weekly timeframe columns and the pinned Progress column) does NOT round down or clamp to 100.0%—it calculates and displays the true mathematical sum of actuals across all activities even when exceeding 100.0% (e.g., 102.0% in a weekly column, 107.0% overall grand total per Figma node-id: 200-494301).  
\- Blocking Error: When overall Total Actual > 100.0%, the summary cell turns red (#FFCCC7), displays hover tooltip ("The overall progress must not exceed 100%."), and strictly disables the \[ Update Progress \] button.

3\. AC 4.1 (Task Over-Plan Warning - Icon Removed):  
\- Aligned with Figma mockup (node-id: 188-344446): Removed the warning icon. The task total Actual (%) cell displays the yellow warning background highlight (#FFE7BA) with hover tooltip ("The actual progress is over the planned progress.") without an icon.

4\. AC 5.4 (Unsaved Changes Guard Navigation Triggers):  
\- Intercepts navigation when isDirty == true upon:  
  1\. Changing Tabs: Switching to Planning, Manpower Resource, Details, Shutdown Organization, Shutdown Logic, Worklist, or Daily Report.  
  2\. Going to Edit Plan: Clicking \[ Edit Plan \] on the Timeline toolbar.  
  3\. Leaving Page: Breadcrumb, side navigation menu, or browser navigation/refresh.

5\. AC 6 (Field Specification Table Alignment):  
\- Weekly Total Actual (%) (Total Progress): Defined as Required: No, Nullable: Yes, Default: Empty, Range: >= 0.0, rendered as null/blank if all tasks in that week have blank actuals.  
\- Added Weekly Total Plan (%) (Total Progress) definition.

6\. AC 8.1 - 8.3 (Strictly Permission-Driven Button Visibility):  
\- The \[ Update Progress \] button is strictly hidden for any user without "Update Progress and Note" permission.  
\- Clarified that this visibility behavior strictly depends on granular permission, not solely on assigned role.

7\. UI Design Mockup References:  
\- Added references to both Figma mockups:  
  - Task Over-Plan Warning: node-id: 188-344446  
  - Bottom Row Total Actual Unclamped & Over-100% Error: node-id: 200-494301

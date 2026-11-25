# ETM-7348 Shutdown Timeline - Edit Plan Screen & Task Planning Specifications
Frozen for a defect exam: description as of before 2026-11-11T11:42 (last description change 2026-11-11), comments written before 2026-11-11T11:42 only. Images removed.

## Description

**As a** Turnaround Manager  
**I want to** access a dedicated Edit Plan screen to create, edit, reorder (both Activity Groups and activities), and delete Activity Groups and preparation activities with mandatory field checks and Date Picker boundary rules  
**So that** I can configure and fine-tune the baseline preparation schedule with total plan percentage integrity before committing changes to the timeline.

---

**Pre-Conditions**

* The user is logged in as a **Turnaround Manager** with **View Timeline** and **Edit Plan** permissions in [Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC).
* The user is on the **Timeline** tab and clicks the `[ Edit Plan ]` button.

---

**Data Source**

* **Master Default Plan Spreadsheet**: [Shutdown Timeline Default Plan.xlsx — Sheet: Initial Timeline & Sheet: Shutdown Date](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci).
* **Validation & Result Reference**: [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result & Sheet: Edit Shutdown Timeline Plan](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=eLCZ9N).
* **System Timezone**: Always evaluated strictly in `UTC+7` **(**`Asia/Bangkok`**)**.

---

**Acceptance Criteria**

1. **Edit Plan Screen Navigation & Header Controls (**`Edit Shutdown Timeline Plan`**)**:

    1. **Access Point & Grid Initial Scroll**:
    
        * Clicking `[ Edit Plan ]` in the Timeline toolbar navigates the user to the dedicated **Edit Plan** screen (`Edit Shutdown Timeline Plan`).
        * Upon opening the Edit Plan screen, the horizontal scroll position of the timeframe grid defaults to the **leftmost edge** (`scrollLeft = 0`), aligning the start of the timeframe to the left.
        
    2. **Header Controls**:
    
        * **Screen Heading**: `Edit Shutdown Timeline Plan` (**30px bold** per [Figma Shutdown Timeline - Edit Plan](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=198-643505&t=eqJRrcAUvl2Rlz7M-4)).
        * **Subtitle**: Read-only subtitle `Ramp down date: DD Mmm YYYY | Ramp up date: DD Mmm YYYY` (14px regular grey `#595959`) with adjacent `(i)` tooltip icon displaying: `"Data from Shutdown Event"`.
        * `[ + Add Activity Group ]` **Button**: Positioned at top-right; single-clicking opens the `Add Activity Group` modal dialog per [Figma Flow: Add Activity Group](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=305-1037925&t=eqJRrcAUvl2Rlz7M-4):
        
            * **Modal Title**: `Add Activity Group`
            * **Form Field (**`* Activity Group Name`**)**: Mandatory free-text input (placeholder: `Activity Group Name`, max 100 characters per [Shutdown Timeline Validation&Result.xlsx — Sheet: Edit Shutdown Timeline Plan, Row 2](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU)) displaying a live character counter `(0/100)` at the top-right of the input field.
            * **Modal Action Buttons**:
            
                * `[ Cancel ]` **Button** (left, secondary outlined): Closes the modal without adding any group.
                * `[ Save ]` **Button** (right, primary blue): Disabled when the input is empty or whitespace only. Clicking commits the group name, closes the modal, and appends a new Activity Group section with the entered title at the bottom of the table in expanded state with an empty state row: `No activity added.` (14px regular grey text).
                
            
        * **Shutdown Size Selector**: Editable dropdown positioned in the top-right header enabling manual classification override per [ETM-7984](https://pttep.atlassian.net/browse/ETM-7984).
        * **Criteria Info Icon (**`(i)`**)**: Positioned next to the dropdown; opens classification criteria popover.
        
    3. **Footer Action Buttons**:
    
        * `[ Back ]` **Button** (bottom-left, secondary outlined): Navigates back to the main Timeline screen. If unsaved modifications exist (`isDirty == true`), clicking `[ Back ]` (or attempting to navigate away using the side menu) triggers the Unsaved Changes confirmation dialog per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 17](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU):
        
            * **Modal Type**: `Confirmation Modal - Style 1`
            * **Title**: `Unsaved Change`
            * **Message**: `Are you sure you want to leave this page? Changes you made will not be saved.`
            * **Buttons**: `[ Continue Editing ]` (stays on the page, keeping changes) / `[ Discard Change ]` (discards working draft changes and navigates away).
            
        * `[ Save ]` **Button** (bottom-right, primary blue): Commits all baseline plan changes and custom row order (both Activity Groups and child activities) to the database (collapse/expand states are not persisted in Edit Plan). Disabled when validations fail (such as empty mandatory cells or `Total Plan != 100.0` from manual edits or Excel template data discrepancy) or when no unsaved modifications exist.
        
    
2. **Activity Group & Activity Row Action Controls**:

    1. **Activity Group Header Controls & Expanded Initial State**:
    
        * **Default Expanded State on Entry (No State Persistence)**: Every time the user navigates to the Edit Plan screen, all Activity Groups are **always expanded by default** (`expanded = true`). The Edit Plan screen does not save, persist, or restore collapse/expand states (any collapse/expand action performed by the user is temporary for the active editing session only and is not persisted).
        * **Group Drag Handle & Vertical Reordering**: Displays a vertical grab handle on hover, enabling vertical drag-and-drop reordering of the entire Activity Group (moving the group banner row along with all its nested child activities) to reposition groups anywhere within the table.
        * `+ Add Activity` **Button**: Inline action button on each Activity Group banner row. Clicking inserts a new blank Activity row at the bottom of that Activity Group with default fields (`Plan (%) = 0.0`, `Status = Open`).
        * **More Options Menu (**`⋮`**)**: Positioned on the right side of the Activity Group header row with options:
        
            1. `Edit Activity Group`: Opens the `Edit Activity Group` modal dialog with title `Edit Activity Group`, input field `* Activity Group Name` pre-filled with the current group name, live character counter `(X/100)` (max 100 characters per [Shutdown Timeline Validation&Result.xlsx — Sheet: Edit Shutdown Timeline Plan, Row 2](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU)), and `[ Cancel ]` / `[ Save ]` buttons. Clicking `[ Save ]` updates the Activity Group title on the banner row and closes the modal.
            2. `Delete Activity Group`: Directly deletes the Activity Group and all nested child activities in the working draft without a confirmation modal.
            
        
    2. **Activity Row Controls**:
    
        * **Task Row Drag Handle**: Displays vertical grab handle on hover, enabling vertical drag-and-drop reordering **strictly within the same parent Activity Group** (dragging across into another Activity Group is prohibited).
        * **Delete Trash Icon (**`🗑️`**)**: Displays a delete trash icon inside the `Activity` cell that is **always visible** (permanently shown, not on hover); clicking immediately removes that Activity row from the working draft.
        
    3. **Empty Activity Group Row**: Whenever an Activity Group has zero activities, it displays a single placeholder row: `No activity added.` (14px regular grey text).
    
3. **Field Editability & Multiline Input**:

    1. **Editable Fields**:
    
        * `Group Activity` (Activity Group title: free-text, mandatory, max 100 chars)
        * `Activity` (free-text, mandatory, max 500 chars)
        * `Action By` (free-text, optional, max 50 chars)
        * `Focal Point` (free-text, optional, max 50 chars)
        * `Start Date` (date picker, mandatory)
        * `End Date` (date picker, mandatory)
        * `Plan (%)` (`Total Plan Progress`: free-text, mandatory, max 100.0, formatted to 1 decimal place; grand total must equal 100.0)
        
    2. **Non-Editable (Read-Only) Fields**:
    
        * `Status`: Read-only in Edit Plan; defaults to `Open`.
        * `Actual (%)`: Read-only in Edit Plan; existing actual values are displayed for reference. No Actual validation is evaluated in Edit Plan.
        * **Weekly Timeframe Cells**: All weekly cells in the timeframe grid are read-only (percentages are distributed automatically per [ETM-7346](https://pttep.atlassian.net/browse/ETM-7346)).
        
    3. **Multiline Text Entry**: The `Activity` description cell supports inserting line breaks via `Alt + Enter` (Windows) / `Option + Enter` (macOS) and preserves multiline rendering. Other editable fields (`Group Activity`, `Action By`, `Focal Point`) are single-line text and do not support line breaks.
    
4. **Mandatory Fields & Date Picker Validation Rules**:

    1. **Mandatory Column Asterisks (**`*`**)**: In the Edit Plan screen specifically, `Activity`, `Start Date`, `End Date`, and `Plan (%)` are mandatory and display a red asterisk (`*`) in their column headers. `Action By` and `Focal Point` are optional (no asterisk).
    2. **Empty Mandatory Cell Error (Red Background)**: Any empty mandatory cell (including empty `Start Date` and `End Date` on `"Optional"` tasks under `Minor SD`) displays a **red cell background** (`#FFCCC7`) and **disables the** `[ Save ]` **button**.
    3. **Date Picker Chronological Validation (Disabled Invalid Dates)**:
    
        * The system strictly enforces `Start Date <= End Date`.
        * In the Date Picker modal, any dates that would violate this order are **disabled / unclickable** (dates after `End Date` are disabled when picking `Start Date`; dates before `Start Date` are disabled when picking `End Date`).
        
    4. **Total** `Plan (%) == 100.0` **Validation (Blocking)**:
    
        * The grand total in `Total Progress` -> `Plan (%)` **must always equal** `100.0`.
        * Whenever `Total Plan != 100.0`—including when the master Excel file ([Shutdown Timeline Default Plan.xlsx](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci)) has total planned progress not equal to 100.0% upon initial seeding or Shutdown Size recalculation, or when user edits result in `Total Plan != 100.0`:
        
            * The `Total Progress` -> `Plan (%)` summary cell displays a **red cell background** (`#FFCCC7`) and **disables the** `[ Save ]` **button**.
            * This follows the exact same blocking error behavior as empty mandatory `Start Date` and `End Date` on `"Optional"` tasks under `Minor SD` (the Turnaround Manager cannot save the baseline plan until task percentages are adjusted in the table to reach exactly `100.0%`).
            
        
    5. **Task Over-Plan Warning (Yellow — Non-Blocking)**:
    
        * When an individual task has `Task Actual > Task Plan`, that task's total `Actual (%)` cell displays a **yellow warning** background highlight (`#FFE7BA`) with tooltip: `"The actual progress is over the planned progress."`.
        * This warning does **not** disable the `[ Save ]` button.
        
    
5. **Visual Suppressions in Edit Plan**:

    1. **Weekly Progress Bars Hidden**: In the Edit Plan screen, weekly timeframe cells render percentage values only; **weekly progress bars (colored progress bars in the weekly grid section) are strictly hidden / not displayed**.
    2. **Key Milestones Row Hidden**: The `Key Milestones` row and operational milestone notes are strictly hidden / not displayed in the Edit Plan screen.
    3. **Ramp Demarcation Lines**: Full-height vertical demarcation lines for `Ramp Down` and `Ramp Up` remain visible across the weekly grid, adhering strictly to the positioning, badge alignment (to the right of each line), stacking order (`Ramp Down` on top by default, `Ramp Up` to front on hover), and tooltip specifications (`[Ramp Down / Ramp Up]: DD Mmm YYYY`) defined in [ETM-7346](https://pttep.atlassian.net/browse/ETM-7346).
    
6. **Save Action & Concurrency Resolution**:

    1. `[ Save ]` **Button Execution**:
    
        * Clicking `[ Save ]` persists all baseline plan changes, new/deleted groups and activities, and custom row order (both Activity Groups and child activities) to the database (collapse/expand states are not persisted in Edit Plan).
        * Updates baseline schedule, navigates back to the main Timeline screen, and displays a success toast notification per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 14–15](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=eLCZ9N):
        
            * **Title**: `Save Success`
            * **Message**: `Save Shutdown Timeline Plan Successfully.`
              _(If save fails, displays toast fail: Title:_ `Save Failed`_, Message:_ `Save Shutdown Timeline Plan Failed.`_)_
            
        * Resets `isDirty = false`.
        
    2. **Concurrency Strategy for Baseline Plan (Same Screen)**: Enforces **Last-Write-Wins (LWW)** across concurrent Turnaround Managers saving the plan in the Edit Plan screen.
    3. **Cross-Screen Concurrency & Key-Mapped Data Persistence (**`Progress has been updated`**)**:
    
        * **Entity Key Mapping (**`activity_id`**)**: Data persistence and synchronization between the **Edit Plan** screen and the main **Timeline** screen are strictly mapped by each activity's unique primary key (`activity_id`), not by row index or activity title.
        * **Saving Plan with Concurrent Timeline Edits**: When saving the plan in the Edit Plan screen while modifications occurred on the Timeline screen:
        
            * All edits made in the Edit Plan screen (e.g., changed `Activity` name, adjusted dates, plan %) are saved and persisted.
            * Edits made on the Timeline screen (such as changed `Status` or updated `Actual (%)` progress) are preserved and applied to the corresponding activity via its unique key.
            * **Activity Deletion Exception**: If an Activity is deleted in the Edit Plan screen, that activity is permanently deleted from the database along with its status and actual progress, and will not be visible on the timeline at all.
            
        * **Conflict Reload Modal (Row 16)**: If a progress conflict is detected upon clicking `[ Save ]` (`Progress has been updated`), the system triggers the confirmation modal per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 16](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=5Kt9GY&nav=MTVfezc5QzYzMzZDLUQ3RkEtNDhFMi05QTE5LUE5NUQ3MzIwMjE4NX0):
        
            * **Modal Type**: `Confirmation Modal - Style 1`
            * **Title**: `Progress has been updated`
            * **Message**: `The shutdown timeline has already been updated. This action will reload the page and update some data.`
            * **Button**: `[ OK ]` (reloads the page to update data, reconciling changes mapped by activity key).
            
        * **Reverse Case (Handled in ETM-7349)**: Conversely, committing progress on the main Timeline screen while baseline plan updates came from Edit Plan beforehand persists progress updates together with the baseline plan updates mapped by key per [ETM-7349](https://pttep.atlassian.net/browse/ETM-7349).
        
    
7. **Field Specification Table (Edit Plan Screen)**:

| Field Name | Data Type | Required? | Nullable? | Default Value | Max Length / Range / Enum | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Group Activity | Free-text | Yes | No | "New Activity Group" | Max 100 chars | Activity Group section header; mandatory. |
| Activity | Free-text | Yes | No | Empty | Max 500 chars | Supports multiline; mandatory. |
| Action By | Free-text | No | Yes | Empty | Max 50 chars | Optional free-text; single-line. |
| Focal Point | Free-text | No | Yes | Empty | Max 50 chars | Optional free-text; single-line. |
| Start Date | Date | Yes | No | Empty | DD Mmm YYYY (`UTC+7`) | Mandatory; Date Picker disables invalid dates. |
| End Date | Date | Yes | No | Empty | DD Mmm YYYY (`UTC+7`) | Mandatory; Date Picker disables invalid dates. |
| Plan (%) | Decimal | Yes | No | 0.0 | \[0.0, 100.0\] | Formatted to 1 decimal place; grand total must equal 100.0. If Excel template or user edits total != 100.0%, displays red background error (`#FFCCC7`) and blocks `[ Save ]` same as mandatory date errors. |

8. **Empty State Specifications**:

    1. **First-Time State**: Populated with the default Activity Groups and Activities seeded dynamically from the master default plan Excel template upon creation ([ETM-7347](https://pttep.atlassian.net/browse/ETM-7347)). If the master Excel template has total `Plan (%) != 100.0%`, the screen displays the red error state (`#FFCCC7`) on `Total Progress` -> `Plan (%)` and disables `[ Save ]` until corrected.
    2. **Empty Group State**: Renders `No activity added.`.
    3. **No Activity Group State**: If all activity groups are removed, renders `No activity added.` under the header and disables `[ Save ]` (Total Plan = 0.0 != 100.0). _(On the main Timeline screen, this placeholder displays directly under the_ `Key Milestones` _row per_ [_ETM-7345_](https://pttep.atlassian.net/browse/ETM-7345)_)_.
    
9. **Role & Permission Visibility Matrix**:

    1. **Edit Access**: Users with **Edit Plan** can access `Edit Shutdown Timeline Plan`, edit fields, reorder rows, and click `[ Save ]`.
    2. **Without Permission**: Users without `Edit Plan` cannot view the `[ Edit Plan ]` button or access this screen URL.
    
10. **Strict Cross-Module Isolation Rule**:

    1. Baseline editing operates strictly within the Shutdown Timeline dataset and does not modify work breakdown items in **Worklist** or **Shutdown Logic**.
    

---

**UI Design**

* **Reference Mockup**: [Figma Shutdown Timeline - Edit Plan (node-id: 198-643505)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=198-643505&t=eqJRrcAUvl2Rlz7M-4).
* **Add Activity Group Flow**: [Figma Shutdown Timeline - Add Activity Group Flow (node-id: 305-1037925)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=305-1037925&t=eqJRrcAUvl2Rlz7M-4).
* **Design System**: Built using PTTEP Nualta Data Grid edit components.

---

## Comments (before 2026-11-11T11:42)

### Thanawat Chongphipatmongkol, 2026-11-05T01:27

\[BA Specification Update - Sprint 25 Grooming & Figma Flow Alignment\]

Summary of Acceptance Criteria (AC) refinements for ETM-7348:

1\. AC 1.1 (Grid Initial Scroll Behavior):  
\- Grid defaults to the leftmost edge (scrollLeft = 0) upon opening the Edit Plan screen, aligning the start of the timeframe to the left.

2\. AC 1.2 (Screen Heading & Subtitle Typography):  
\- Corrected Screen Heading font size to 30px bold matching Figma layer specifications (node-id: 198-643505).  
\- Specified Subtitle typography as 14px regular grey (#595959).

3\. AC 1.2 & AC 2.1 (Add / Edit Activity Group Modal Dialog Flows):  
\- Aligned with Figma Flow (node-id: 305-1037925): Single-clicking \[ + Add Activity Group \] opens the dedicated "Add Activity Group" modal dialog with mandatory field "\* Activity Group Name" (placeholder "Activity Group Name", max 100 chars, live counter "(0/100)"), \[ Cancel \], and \[ Save \] buttons. Appends new group section in expanded state with empty placeholder row "No activity added.".  
\- Selecting "Edit Activity Group" from the three-dot menu (⋮) opens the "Edit Activity Group" modal dialog pre-filled with the current group name, live counter "(X/100)", and \[ Cancel \] / \[ Save \] buttons.

4\. AC 1.3, AC 2.1 & AC 6.1 (Activity Groups Always Expanded on Entry):  
\- All Activity Groups default to expanded state (expanded = true) whenever the user navigates to Edit Plan.  
\- The Edit Plan screen does NOT save, persist, or restore collapse/expand states (user collapse/expand actions are session-only and volatile).

5\. AC 5.1 & AC 5.2 (Visual Suppressions & Ramp Line Specifications):  
\- Weekly Progress Bars: Suppressed in the weekly grid section; weekly cells render numeric percentages only without colored bars.  
\- Key Milestones row: Strictly hidden in Edit Plan.  
\- Demarcation Lines: Ramp Down and Ramp Up lines remain visible across the full table height with badges to the right of lines, hover tooltips, and default stacking order (Ramp Down on top by default, Ramp Up to front on hover) per ETM-7346.

6\. AC 6.2 & AC 6.3 (Concurrency Architecture & Conflict Resolution):  
\- Same-Screen Concurrency (AC 6.2): Enforces Last-Write-Wins (LWW) across concurrent Turnaround Managers saving baseline plan modifications in Edit Plan.  
\- Cross-Screen Concurrency Conflict Guard (AC 6.3 - Row 16): If timeline progress was updated on the main Timeline screen while editing the plan, clicking \[ Save \] triggers the conflict confirmation modal dialog per Confirmation&Result Row 16 (Title: "Plan has Been Changed", Message: "The shutdown timeline has already been updated. This action will reload the page and update some data.", Button: \[ OK \] to reload). Cross-referenced Row 5 for counterpart behavior in ETM-7349.  
\- Completely removed legacy "Plan Deleted" condition.

7\. UI Design Mockup References:  
\- Updated Edit Plan Reference Mockup link to active node-id: 198-643505.  
\- Added Add Activity Group Flow Reference link to node-id: 305-1037925.  
\- Aligned SharePoint reference links to latest token (e=eLCZ9N).

### Thanawat Chongphipatmongkol, 2026-11-09T15:55

\[BA Specification Update - Sprint 25 Grooming Alignment\]

Summary of Acceptance Criteria (AC) updates for ETM-7348 (Criterion 6.3):

1\. AC 6.3 (Cross-Screen Concurrency & Key-Mapped Data Persistence):  
\- Entity Key Mapping (activity_id): Data persistence and synchronization between the Edit Plan screen and the main Timeline screen are strictly mapped by each activity's unique primary key (activity_id), not by row index or activity title.  
\- Saving Plan with Concurrent Timeline Edits: When saving the plan in Edit Plan while modifications occurred on the Timeline screen:  
  \* All baseline edits made in Edit Plan (e.g., changed Activity name, adjusted dates, plan %) are saved and persisted.  
  \* Timeline edits (such as updated Status or Actual (%) progress) are preserved and applied to the corresponding activity via its unique key.  
  \* Deletion Exception: If an activity is deleted in Edit Plan, that activity is permanently deleted from the database along with its status and actual progress, and will not be visible on the timeline at all.  
\- Concurrency Conflict Modal (Row 16): Aligned with Shutdown Timeline Validation&Result.xlsx (Row 16):  
  \* Trigger: Detected progress conflict upon clicking \[ Save \]  
  \* Condition / Title: "Progress has been updated" (Modal Style 1)  
  \* Message: "The shutdown timeline has already been updated. This action will reload the page and update some data."  
  \* Button: \[ OK \] (reloads the page to update data, reconciling changes mapped by activity key).  
\- Reverse Case Cross-Reference: Addressed counterpart workflow with ETM-7349 when committing progress on Timeline after plan updates occurred.


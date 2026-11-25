# ETM-7345 Shutdown Timeline - Dashboard Frame Layout, Navigation & Split-Pane Architecture
Frozen for a defect exam: description as of before 2026-11-17T15:37 (last description change 2026-11-11), comments written before 2026-11-17T15:37 only. Images removed.

## Description

**As a** Turnaround Manager or Job Owner  
**I want to** access a dedicated Shutdown Timeline tab featuring an adjustable two-pane split table layout with a draggable vertical gray splitter, synchronized event dates, collapsible Activity Groups, and role-based action controls  
**So that** I can flexibly navigate the preparation schedule, adjust column visibility between task metadata and weekly progress, and initiate timeline management workflows without visual clutter.

---

**Pre-Conditions**

* The user is logged into the STMS application.
* The user possesses the **View Timeline** permission in [Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC).
* A parent Shutdown Event exists with valid **Shutdown Date** (`Start Date` and `End Date`) and **SD Type** (`FSD`, `PSD`, or `MRU C/O`) per [ETM-89](https://pttep.atlassian.net/browse/ETM-89).
* The user has navigated to `Shutdown Event List` -> selected an event -> clicked the `Timeline` tab.

---

**Data Source**

* **Parent Shutdown Event**: Event Name, Shutdown Date (`Start Date` mapped to `Ramp Down Date`, `End Date` mapped to `Ramp Up Date`), Event `SD Type` (`FSD`, `PSD`, `MRU C/O`).
* **Role & Permission**: [Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC) — Sheet: Permissions.
* **Validation & Result Reference**: [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU).
* **System Timezone**: Always evaluated strictly in `UTC+7` **(**`Asia/Bangkok`**)**.

---

**Acceptance Criteria**

1. **Tab Navigation & Container Frame Architecture**:

    1. The `Timeline` tab is positioned in the horizontal event tab bar between `Planning` and `Shutdown Organization` (`Details` | `Worklist` | `Manpower Resource` | `Shutdown Logic` | `Planning` | `Timeline` | `Shutdown Organization`).
    2. Page breadcrumb displays standard navigation: `Shutdown Event List / {Shutdown Event Name}`.
    3. The entire Shutdown Timeline page is rendered completely within the main content frame under the tab bar, matching the container style of the Planning tab.
    4. **Timezone Enforcement**: All dates, durations, milestone markers, and week evaluations across the Shutdown Timeline strictly use `UTC+7` **(**`Asia/Bangkok`**)**.
    
2. **Frame Toolbar Controls & Role-Based Access Control (RBAC)**:

    1. **Tab Title**: Left-aligned heading text: `Timeline` (**24px bold** per [Figma Shutdown Timeline](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=1-70)).
    2. **Shutdown Size Badge Display**: Read-only / disabled badge indicator positioned next to the `Timeline` heading displaying the active SD classification with exact color codes per [Figma SD Type Badges](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=270-502714&t=XoiP0U6ja05P9yIA-4):
    
        * `Major SD`: Background `#FFF1F0`, Border `#FFA39E`, Text `#F5222D`.
        * `Medium SD`: Background `#FFFBE6`, Border `#FFE58F`, Text `#FAAD14`.
        * `Minor SD`: Background `#F6FFED`, Border `#B7EB8F`, Text `#52C41A`.
          _(Manual modification of the Shutdown Size is restricted exclusively to the dedicated **Edit Plan** screen per_ [_ETM-7348_](https://pttep.atlassian.net/browse/ETM-7348) _and_ [_ETM-7984_](https://pttep.atlassian.net/browse/ETM-7984)_)._
        
    3. **Criteria Info Icon (**`(i)`**)**: Positioned adjacent to the Shutdown Size badge. Hovering over the icon displays a floating popover showing the classification criteria cards per [Figma Criteria Info Popover](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=154-45477&t=XoiP0U6ja05P9yIA-4) and [Shutdown Timeline Default Plan.xlsx](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci); dismisses when mouse leaves.
    4. **Ramp Down Date & Ramp Up Date Subtitle Line**: Read-only subtitle line below the `Timeline` title displaying `Ramp down date: DD Mmm YYYY | Ramp up date: DD Mmm YYYY` with an adjacent `(i)` tooltip icon, synchronized from the parent Event's `Shutdown Date` (`Start Date` and `End Date`). Hovering the `(i)` icon displays the exact tooltip: `"Data from Shutdown Event"`.
    5. **Toolbar Action Buttons**:
    
        * `[ Edit Plan ]` **Button**: Action button with edit pencil icon positioned in the top-right toolbar. Clicking navigates the user to the dedicated **Edit Plan** screen (`Edit Shutdown Timeline Plan`, [ETM-7348](https://pttep.atlassian.net/browse/ETM-7348)). Visible only to users with the **Edit Plan** permission.
        * `[ Update Progress ]` **Button**: Primary commit button positioned on the far right of the Timeline toolbar. Commits weekly `Actual (%)` entries, `Status` updates, and Activity Group collapse/expand states to the database ([ETM-7349](https://pttep.atlassian.net/browse/ETM-7349)). Toggling any Activity Group between collapse and expand immediately marks the timeline draft dirty (`isDirty = true`) and enables this button so that the user's customized accordion layout is persisted to the database for subsequent visits. (Note: `Key Milestones` notes are saved and deleted directly in the database upon modal action per [ETM-7350](https://pttep.atlassian.net/browse/ETM-7350), completely separate from this button). Disabled when no unsaved changes exist (`isDirty == false`) or when `Total Actual (%) > 100.0`. Visible only to users with the **Update Progress and Note** permission.
        
    6. **RBAC Guardrails** (per [Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC)):
    
        * **Turnaround Manager (**`View Timeline`**,** `Update Progress and Note`**,** `Edit Plan`**)**: Both `[ Edit Plan ]` and `[ Update Progress ]` buttons are visible. Can adjust the vertical splitter, collapse/expand groups, directly update `Status` (`Open` / `Close`), input weekly `Actual (%)`, manage `Key Milestones` notes, and navigate to Edit Plan.
        * **Job Owner (**`View Timeline` **Only)**: Toolbar `[ Edit Plan ]` and `[ Update Progress ]` buttons are strictly hidden; all inputs, dropdowns, and note creation/editing triggers are disabled. Adjusting the splitter, viewing note tooltips, and collapsing/expanding groups in-memory remain functional.
        
    
3. **Two-Pane Split Table Architecture, Draggable Gray Splitter, Column Resizing & Scrollbar Rules**:

    1. On **both the main Timeline screen and the Edit Plan screen**, the table is divided into **2 sections** separated by a full-height **vertical gray splitter bar** positioned between `End Date` and `Status`. Table data alignment and column dimensions strictly adhere to [Figma Table Layout](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=287-520717&t=XoiP0U6ja05P9yIA-4), and **column resizing is supported exclusively on metadata columns** (users can drag column header boundary handles to adjust widths):
    
        * **Left Section (5 Columns — ordered left to right, all headers and cell data left-aligned)**:
        
            * **Column 1 —** `Activity`: Default width and minimum width `360px`; supports text wrapping; left-aligned.
            * **Column 2 —** `Action By`: Default width and minimum width `100px`; left-aligned.
            * **Column 3 —** `Focal Point`: Default width and minimum width `120px`; left-aligned.
            * **Column 4 —** `Start Date`: Default width and minimum width `120px`; left-aligned (`DD Mmm YYYY`).
            * **Column 5 —** `End Date`: Default width and minimum width `120px`; left-aligned (`DD Mmm YYYY`).
            
        * **Right Section (Pinned** `Status` **+** `Progress` **\[3 Columns\] + Weekly Timeframe Grid)**:
        
            * `Status` **(Col 1 of Right Section)**: Default width and minimum width `100px`; header and dropdown badge (`Open` / `Close`) left-aligned; always docked immediately to the right of the vertical gray splitter bar.
            * `Progress` **(Cols 2 & 3 of Right Section)**: Merged header `Progress` spanning 2 sub-columns docked immediately to the right of `Status` (default and minimum total width `160px`) — Sub-column 1 displays row labels `Plan (%)` (top sub-row) and `Actual (%)` (bottom sub-row) with width `70px`, left-aligned; Sub-column 2 displays numeric total `Plan (%)` (top sub-row) and total `Actual (%)` (bottom sub-row) with width `90px`, formatted to 1 decimal place (e.g., `6.0`, `0.0`), left-aligned per Figma.
            * **Weekly Timeframe (**`W1`**,** `W2`**, ...)**: Horizontally scrollable week columns rendering two sub-rows per Activity — fixed width `50px` per week column (strictly non-resizable; cannot be resized); month headers (`Mmm YYYY`), week column headers (`W1`, `W2`, ...), weekly percentage labels (`Plan (%)`, `Actual (%)`), and horizontal progress bars inside the 50px week cells are strictly **center-aligned** per Figma. In the bottom `Total Progress` summary row, weekly totals are center-aligned under their respective week columns.
            
        * **Column Resizing Scope & Minimum Width Boundaries**: Draggable resize boundary handles are supported on all metadata column headers in the Left Section (`Activity` \[min 360px\], `Action By` \[min 100px\], `Focal Point` \[min 120px\], `Start Date` \[min 120px\], `End Date` \[min 120px\]) and Pinned Right Section (`Status` \[min 100px\], `Progress` \[min 160px\]). Columns cannot be shrunk below their specified minimum widths via header resize handles. **Weekly Timeframe columns (**`W1`**,** `W2`**, ...) have a fixed width of** `50px` **and strictly do not support column resizing (resize handles are disabled / not present on week headers).**
        
    2. **Draggable Vertical Gray Splitter Mechanics**:
    
        * Dragging the gray splitter bar **to the right** expands the width of the `Activity` column, shifting `Status`, `Progress`, and the Weekly Timeframe rightward.
        * Dragging the gray splitter bar **to the left** narrows the Left Section viewport and progressively occludes (covers) Left Section columns right-to-left (`End Date` -> `Start Date` -> `Focal Point` -> `Action By`), while `Status` and `Progress` move leftward flush with the splitter bar to reveal more Weekly Timeframe columns. If dragged further left, the `Activity` column narrows down to the splitter position (can be narrower than 360px within the viewport).
        
    3. **Hover Quick-Collapse Arrow Buttons (**`<` **/** `>`**) & Layout Volatility**:
    
        * Left and Right quick-collapse buttons on the vertical gray splitter bar are **hidden by default** and **appear when hovering** over the gray splitter bar.
        * Clicking the **Left** button pushes the gray splitter bar all the way to the far-left edge, completely hiding the entire Left Section.
        * Clicking the **Right** button pushes the gray splitter bar all the way to the far-right edge, completely hiding the entire Right Section (both the Weekly Timeframe section and the 3 `Status` / `Progress` columns).
        * When the splitter bar is collapsed all the way to one edge, clicking the opposite arrow button pushes the splitter bar all the way to the other opposite edge. To restore the splitter bar to a divided middle position, the user must click and drag the vertical gray splitter bar manually.
        * **Volatile Layout State**: The splitter bar position and custom column widths are session-only and volatile; they reset to default values upon page refresh.
        
    4. **Horizontal & Vertical Scrollbar Placement**:
    
        * Dedicated independent horizontal scrollbars appear **exclusively** on:
        
            1. The **Left Section** (`Activity` through `End Date`), and
            2. The **Weekly Timeframe Section** (`W1`, `W2`, ...).
            
        * There is **no horizontal scrollbar** under the `Status` and `Progress` columns.
        * A single unified vertical scrollbar scrolls both Left and Right sections synchronously.
        
    
4. **Collapsible Activity Group Behavior, Default Expanded State & Empty Group Handling**:

    1. **Default State**: Every Activity Group defaults to **Expanded** (`v` chevron) upon initial creation and page load so all child Activities are immediately visible.
    2. **Collapse / Expand Toggle**: Clicking an Activity Group header (or its chevron icon) toggles that group between **Expanded** (showing all child Activity rows or empty placeholder row) and **Collapsed** (`>` chevron, hiding its child rows while keeping the Activity Group header row visible). Toggling collapse/expand immediately marks the timeline draft dirty (`isDirty = true`), enabling the `[ Update Progress ]` button on the Timeline screen (or `[ Save ]` on Edit Plan).
    3. **Persistence on Commit**: Active collapse/expand states are tracked in memory and persisted to the database when the user clicks `[ Update Progress ]` (on the Timeline screen per [ETM-7349](https://pttep.atlassian.net/browse/ETM-7349)) or `[ Save ]` (on the Edit Plan screen per [ETM-7348](https://pttep.atlassian.net/browse/ETM-7348)) so that the user's customized accordion layout is retained when reopening the timeline.
    4. **Empty Activity Group Row**: Whenever an Expanded Activity Group contains zero activities (created via `+ Add Activity Group` in Edit Plan or when all activities within that group are deleted), the system renders a single read-only placeholder sub-row beneath that Activity Group header displaying the exact text: `No activity added.` (14px regular font, left-aligned per [Figma Empty Activity Group Row (node-id: 243-396833)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=243-396833&t=XoiP0U6ja05P9yIA-4)).
    
5. **Concurrency Strategy & Multi-User Editing**:

    1. The system enforces a **Last-Write-Wins (LWW)** concurrency resolution policy across all timeline mutations.
    2. When multiple Turnaround Managers view or edit the Shutdown Timeline simultaneously, the changes committed by the last user clicking `[ Update Progress ]` (or `[ Save ]` in Edit Plan) overwrite preceding changes without row-level locking or merge conflict dialogs.
    
6. **Empty State Specifications**:

    1. **First-Time State**: Never empty upon event creation because the Shutdown Timeline is automatically generated and seeded with default Activity Groups and Activities dynamically derived from the master default plan template ([ETM-7347](https://pttep.atlassian.net/browse/ETM-7347)).
    2. **No Activity Group State (Global Table Empty State)**: If no Activity Group exists in the timeline (or all groups are removed), the system displays the placeholder row `No activity added.` directly under the `Key Milestones` row (14px regular font, left-aligned).
    
7. **Role & Permission Visibility Matrix**:

    1. **View Access**: Users possessing **View Timeline** can view the frame, adjust the splitter, view tooltips, and collapse/expand groups in-memory.
    2. **Update Access**: Users possessing **Update Progress and Note** see the `[ Update Progress ]` button, can update weekly actual progress (`Actual (%)`) in the timeframe grid, edit `Status` (`Open` / `Close`), and manage `Key Milestones` notes.
    3. **Edit Plan Access**: Users possessing **Edit Plan** see the `[ Edit Plan ]` button and can navigate to the Edit Plan screen.
    4. **Without Permission**: Users without `View Timeline` cannot see the `Timeline` tab (navigation denied).
    
8. **Strict Cross-Module Isolation Rule**:

    1. Adjusting layout, collapsing groups, or resizing panes operates strictly within the client-side Timeline component and does not mutate records in **Worklist**, **Shutdown Logic**, or **Equipment Mob Plan**.
    

---

**UI Design**

* **Reference Mockup**: [Figma Shutdown Timeline (node-id: 130-187955)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=130-187955&t=XoiP0U6ja05P9yIA-4).
* **Figma Deep-Links**: [Figma Shutdown Timeline (node-id: 130-187955)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=130-187955&t=XoiP0U6ja05P9yIA-4) | [Figma SD Type Badges (node-id: 270-502714)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=270-502714&t=XoiP0U6ja05P9yIA-4) | [Figma Criteria Info Popover (node-id: 154-45477)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=154-45477&t=XoiP0U6ja05P9yIA-4) | [Figma Table Layout (node-id: 287-520717)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=287-520717&t=XoiP0U6ja05P9yIA-4) | [Figma Empty Activity Group Row (node-id: 243-396833)](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=243-396833&t=XoiP0U6ja05P9yIA-4).
* **Design System**: Built using PTTEP Nualta Design System table and splitter components.

---

## Comments (before 2026-11-17T15:37)

### Thanawat Chongphipatmongkol, 2026-11-04T10:10

\[Change Log - Story Refinements & Acceptance Criteria Alignment\]

1\. AC 2.1 (Tab Title Typography - Card Standard A11):  
   - Updated heading text size and style from legacy "20px semi-bold" to "24px bold" to align with PTTEP Nualta Design System standards and Figma mockups.

2\. AC 2.2 (Minor SD Badge Exact Colors):  
   - Corrected Minor SD Badge color tokens to match the standard Ant Design Green Tag component in Figma: Background #F6FFED, Border #B7EB8F, Text #52C41A (aligning with the Status "Close" badge in ETM-7349 and superseding the Popover card lime green token).

3\. AC 2.5 & AC 4.2–4.3 (Update Progress Trigger & Collapse/Expand Persistence):  
   - Clarified that toggling an Activity Group between Collapse and Expand immediately marks the timeline working draft dirty (isDirty = true) and enables the \[ Update Progress \] button so that users can persist their preferred accordion view state to the database for subsequent visits.

4\. AC 3.1 (Table Alignment Breakdown):  
   - Clarified alignment differences across sections:  
     \* Left Section (Activity, Action By, Focal Point, Start Date, End Date): Column headers and cell data are strictly left-aligned.  
     \* Right Section - Pinned (Status, Progress): Column headers, labels, and cell values are strictly left-aligned.  
     \* Right Section - Weekly Timeframe Grid (Month, W1..W5, weekly Plan/Actual % labels and bars): Column headers and weekly grid cells/bars are strictly center-aligned within the 50px week columns per Figma. Weekly totals in the Total Progress row are center-aligned under each week column.

5\. AC 3.2 & AC 3.3 (Splitter Mechanics, Arrow Collapsing & Volatile Layout):  
   - Clarified that column minimum widths (including Activity min 360px) apply to manual column resizing via header handles. Dragging the splitter bar to the left progressively occludes columns right-to-left and can narrow the Activity column according to the splitter position.  
   - Clarified that when the splitter bar is collapsed all the way to one edge (< or >), clicking the opposite arrow button pushes the splitter bar to the other far edge. Restoring the splitter bar to a divided middle position requires manually dragging the splitter bar handle.  
   - Codified that the splitter bar position and custom column widths are session-only / volatile and reset to default values upon page refresh.

### Thanawat Chongphipatmongkol, 2026-11-06T15:17

\[Change Log - Story Refinements & Acceptance Criteria Alignment\]

1\. AC 3.1 (Weekly Timeframe Columns Non-Resizable Constraint):  
   - Clarified that the Weekly Timeframe columns (W1, W2, ...) have a fixed width of 50px and strictly do not support column resizing (column resize handles are disabled / not present on week headers).  
   - Confirmed that column resizing via header resize handles applies exclusively to metadata columns in the Left Section (Activity \[min 360px\], Action By \[min 100px\], Focal Point \[min 120px\], Start Date \[min 120px\], End Date \[min 120px\]) and Pinned Right Section (Status \[min 100px\], Progress \[min 160px\]).

### Automation for Jira, 2026-11-09T09:01

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8293#icft=ETM-8293</custom> has been resolved

### Automation for Jira, 2026-11-09T13:47

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8320#icft=ETM-8320</custom> has been resolved

### Automation for Jira, 2026-11-09T15:58

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8365#icft=ETM-8365</custom> has been resolved

### Automation for Jira, 2026-11-09T16:15

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8367#icft=ETM-8367</custom> has been resolved

### Thanawat Chongphipatmongkol, 2026-11-11T14:08

**Story updated on 11 Nov 2026: Timeline "SD Type / Shutdown Type" renamed to "Shutdown Size"**

The Timeline classification (`Major SD` / `Medium SD` / `Minor SD`) is now called **Shutdown Size**. There is no change in behavior.

* AC 2.2: **SD Type Badge Display** → **Shutdown Size Badge Display**; "Manual modification of the Shutdown Type…" → "…Shutdown Size…"
* AC 2.3: "adjacent to the SD Type badge" → "adjacent to the Shutdown Size badge"

**Not changed:** the Event's **SD Type** (`FSD` / `PSD` / `MRU C/O`) in Pre-Conditions and Data Source, and the Figma frame name "SD Type Badges". If the badge shows a label or tooltip, it should read "Shutdown Size".

See [ETM-7984](https://pttep.atlassian.net/browse/ETM-7984) for the full rename.

### Automation for Jira, 2026-11-11T15:01

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8377#icft=ETM-8377</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8165#icft=ETM-8165</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8167#icft=ETM-8167</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8168#icft=ETM-8168</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8169#icft=ETM-8169</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8170#icft=ETM-8170</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8173#icft=ETM-8173</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8175#icft=ETM-8175</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8178#icft=ETM-8178</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8186#icft=ETM-8186</custom> has been resolved

### Automation for Jira, 2026-11-12T08:18

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8190#icft=ETM-8190</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8165#icft=ETM-8165</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8167#icft=ETM-8167</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8168#icft=ETM-8168</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8169#icft=ETM-8169</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8170#icft=ETM-8170</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8173#icft=ETM-8173</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8175#icft=ETM-8175</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8178#icft=ETM-8178</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8186#icft=ETM-8186</custom> has been resolved

### Automation for Jira, 2026-11-12T08:19

The linked issue - <custom data-type="smartlink" data-id="id-0">https://jira-prod-ap-3-2.prod.atl-paas.net/browse/ETM-8190#icft=ETM-8190</custom> has been resolved


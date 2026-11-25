# ETM-6394 Manpower Mob Plan - POB Chart Edit Data Graph
Frozen for a defect exam: description as it was before 2026-09-28T09:43 (Jira changelog version of 2026-09-24T15:57, Jira wiki markup; 0 later edits not included), comments written before 2026-09-28T09:43 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* edit existing data graph configurations via an Edit Data side panel
*So that* I can adjust calculation parameters, update line styles, and refine data definitions.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit POB Chart* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.
* At least one data graph exists on the POB Chart Data Table.

----

*Data Source*

* *Validation & Result*: [Manpower Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Manpower%20Mob%20Plan%20Validation%26Result.xlsx?d=wa614d8e359a845d3a28d7c3b21d49130&csf=1&web=1&e=zRZRVH] — Sheet: Form Validation, Row: 1
* *Field Specification Table (Edit Data Side Panel)*:

||Field Name||Component Type||Required?||Nullable?||Default Value||Max Length / Value Range / Enum||Notes||
|Name|Text Input|Yes|No|—|Max 50 chars, no duplicate check|Placeholder "Name"|
|Line|Radio Group|Yes|No|Solid|Solid, Dash|Single selection|
|Line Color|Color Palette Picker|Yes|No|Dark Blue (#1D2A4B)|20 preset color swatches|White checkmark on selected swatch|
|Data Type|Radio Group|Yes|No|Summary|Summary, Constant|Switches panel between Summary filters and Constant value|
|Value|Number Input|Yes (if Constant)|No|0|[-999, 999] (integer)|Rendered only when Data Type is Constant; if previously unset, default value is none|
|Summary Type|Radio Group|Yes (if Summary)|No|POB Movement|POB Movement, POB Onboard, Manpower Mobilization, Manpower Demobilization|Single selection|
|Resource Type|Radio Group|Yes (if Summary)|No|All|All, Organic Crew, Extra Turnaround|Single selection|
|Accommodation|Radio Group|Yes (if Summary)|No|All|All, LQ, Barge, FSO|Single selection|
|D/N Shift|Radio Group|Yes (if Summary)|No|All|All, Day, Night|Single selection|
|Hot Bed|Radio Group|Yes (if Summary)|No|All|All, Yes, No|Single selection|
|Transportation (Mob)|Radio Group|Yes (if Summary)|No|All|All, Helicopter, MSB, Vessel|Single selection|
|Transportation (Demob)|Radio Group|Yes (if Summary)|No|All|All, Helicopter, MSB, Vessel|Single selection|

----

*Acceptance Criteria*

# *Edit Data Trigger & Side Panel State*:
## *Trigger Action*: Right-clicking on any Data Group row in the Data Table must display a context menu with an *Edit* option.
## *Panel Opening & Title*: Selecting *Edit* must open the configuration side panel with the title *Edit Data* on the right side of the screen.
## *Data Prefill*: The panel must prefill with all current saved properties and parameters of the selected graph (including Name, Line style, Line Color, Data Type, and corresponding Summary filters or Constant value).
## *Full Field Modifiability*: Every prefilled field in the side panel must be fully editable.
## *Permission Guard*: The *Edit* context menu option and side panel access must be strictly restricted to users possessing the {{Edit POB Chart}} permission (for all other users, no context menu is produced; hidden).
# *Property Modification & Filter Update*:
## *Visual Properties Modification*: The user can modify the *Name* (max 50 characters; names do not have to be unique), *Line* style, and *Line Color*.
## *Type Switching & Mode Switching In-Memory State Retention*: The user can switch the *Data Type* between *Summary* and *Constant*, re-rendering the relevant input controls accordingly. When switching between *Summary* and *Constant* modes within the panel, the system must retain and remember the entered values and filter selections of both modes in temporary panel state throughout the active session until saved or discarded.
## *Multi-Dimension Filter Update*: If Summary is selected, the user can modify any of the 7 filtering dimensions: Summary Type, Resource Type, Accommodation, D/N Shift, Hot Bed, Transportation (Mob), and Transportation (Demob).
# *Panel Footer Actions & Concurrency Lifecycle*:
## *Footer Buttons*:
* *Back button*: Positioned on the bottom-left; clicking *Back* closes and dismisses the side panel without saving, discarding any modifications.
* *Save button*: Positioned on the bottom-right; disabled if the mandatory *Name* field is blank, or if Data Type is Constant and the *Value* field is empty. Clicking *Save* commits changes immediately to the database.
## *Immediate Commit*: Upon confirming changes within the *Edit Data* panel, the system must immediately commit the updated configuration to the database.
## *Chart & Table Refresh & Checkbox Selection Preservation*: The chart line, legend entry, and Data Table row values must immediately re-render to reflect the updated configuration. If the edited graph was unchecked prior to editing, it remains unchecked after saving (its line remains hidden and scale does not plot it until manually checked). If the edited graph was checked, it remains checked and its line and scale immediately recalculate with the updated parameters.
## *Decoupling*: Modifying chart configurations must function entirely independently from the primary page-level *[ Save ]* button.
## *Concurrent Edit Operations (Last Write Wins)*: Graph configurations are global data. If multiple users edit the same or different graphs concurrently, the system applies a *Last Write Wins* conflict resolution strategy (the most recent commit saved to the database overwrites previous changes, and subsequent reloads reflect the latest saved configuration).

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=1108-291217&t=mAn5PM0DP0MhFRi7-4]
* *Design System*: Side panel components must adhere to standard PTTEP sliding panel mechanics.

----

## Comments (before 2026-09-28T09:43)

(none)

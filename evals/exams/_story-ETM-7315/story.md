# ETM-7315 Equipment Mob Plan - Export Plan to Excel
Frozen for a defect exam: description as it was before 2026-10-27T11:35 (Jira changelog version of 2026-10-26T15:49, Jira wiki markup; 3 later edits not included), comments written before 2026-10-27T11:35 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* export the active Equipment Mob Plan into a structured Excel spreadsheet (.xlsx)
*So that* I can share equipment logistics manifests, dimensions, weights, and transport schedules offline with offshore logistics coordinators, deck supervisors, and contractors.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Export Equipment Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Equipment Mob Plan* dashboard page.
* The active Equipment Mob Plan contains at least one saved work header or equipment record.

----

*Data Source*

* *Plan & Event Metadata*: Active Shutdown Event ({{Shutdown Event Name}}, {{Start Event Date}}, {{End Event Date}}) and Turnaround Plan Card ({{Plan Name}}).
* *Equipment Dataset*: Active Equipment Mob Plan equipment rows across 24 fixed attributes: {{No.}}, {{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Department}}, {{Premob Inspection}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Area (m2)}}, {{Gross Wt. (Tons)}}, {{Platform}}, {{Deck}}, {{Item No. in Plot Plan}}, {{Transportation}}, {{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Priority}}, {{Status}}, {{MMR No.}}, {{Vessel Name}}, {{Loading at PSB}}, and {{Remark}}.
* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions
* *Export Specification & Canonical Template*: [Equipment_Mob_Plan_Export_Template.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Equipment%20Mob%20Plan/Equipment_Mob_Plan_Export_Template.xlsx?d=w40af14711937431c85f0bf5b2b28b96f&csf=1&web=1&e=nikk90] ([local template|file:///Users/thanawat.c/Project/STMS/Docs/Shared%20Documents/03%20Development/Equipment%20Mob%20Plan/Equipment_Mob_Plan_Export_Template.xlsx]).
* *File Naming*: {{[ShutdownEventName]_[PlanName]_EquipmentMobPlan_[YYYYMMDD].xlsx}}

----

*Acceptance Criteria*

# *Export Action Trigger & Permission Enforcement*:
## *Header Button Placement*: The system must provide an *[ ⤓ Export ]* outlined button on the top page-level header bar, positioned on the right side of the title line directly adjacent (to the left) of the *[ 💾 Save ]* button per [ETM-7305|#etm-7305].
## *Permission Guard*: The *[ ⤓ Export ]* button is strictly visible and actionable only for users possessing the *Export Equipment Mob Plan* permission (possessed by Turnaround Manager and Job Owner). For users without this permission, the button must be strictly hidden.
## *Empty State Handling*: If the Equipment Mob Plan contains no saved work headers or equipment items (empty state), the *[ ⤓ Export ]* button must be disabled (greyed out and unclickable).
## *Persisted Data Scope*: The export engine must export only persisted (saved) database records; unsaved draft edits on screen must not be included.
## *Filter Independence*: The export engine must strictly ignore any active Grid Filters (from Filter Panel [ETM-7314|#etm-7314]) and always export the full dataset of the active plan (strictly aligned with Manpower Mob Plan export behavior).
# *File Naming Convention & Worksheet Structure*:
## *Dynamic File Naming*: The exported workbook must download directly to the user's browser with the filename formatted as:
{{"[ShutdownEventName]_[PlanName]_EquipmentMobPlan_[YYYYMMDD].xlsx"}}
where {{YYYYMMDD}} is the local export generation date.
## *Prohibited Character Sanitization*: Any invalid filename characters ({{\}}, {{/}}, {{:}}, {{*}}, {{?}}, {{"}}, {{<}}, {{>}}, {{|}}) present in {{[ShutdownEventName]}} or {{[PlanName]}} must be automatically completely removed (deleted / blank) from the filename, without leaving any replacement spaces.
## *Worksheet Tab Name*: The primary worksheet tab inside the exported {{.xlsx}} workbook must be named {{Equipment Mob Plan}} (matching the canonical template).
# *Template Layout & Header Styling (Aligned with Canonical Template)*:
## *Plan Title Banner (Row 1)*:
### Merged banner row across columns A through X ({{A1:X1}}) showing {{Equipment Mob Plan: [Plan Name]}}.
### Styled with a *dark navy blue* background ({{#35455C}}) and *bold white* text ({{#FFFFFF}}).
## *Column Headers (Row 2)*:
### Fixed 24 columns across columns A through X, styled with a *steel blue* background ({{#526493}}) and *bold white* text ({{#FFFFFF}}).
### Exact column sequence:
{{No.}}, {{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Department}}, {{Premob Inspection}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Area (m2)}}, {{Gross Wt. (Tons)}}, {{Platform}}, {{Deck}}, {{Item No. in Plot Plan}}, {{Transportation}}, {{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Priority}}, {{Status}}, {{MMR No.}}, {{Vessel Name}}, {{Loading at PSB}}, {{Remark}}.
# *Work Header Category Banner Rows*:
## *Work Header Category Banners*: Each Work Header category (e.g., {{Operation}}, {{Electrical and Instrument (PM)}}, {{Mechanical (CM)}}, {{Electrical and Instrument (CM)}}):
##* Merged banner row across columns A through X ({{A{row}:X{row}}}).
##* Styled with a *steel blue* background ({{#526493}}) and *bold white* text ({{#FFFFFF}}).
##* Preserves the exact case-sensitive Work Header Name as configured/displayed in the application (no forced uppercase conversion).
##* Work Headers are rendered in the exact order as displayed in the table (sorted by Master Data sequence from Data Storage / Worklist, followed by manually added headers).
##* *Strict Work Header Assignment*: Every equipment record in the Equipment Mob Plan strictly belongs under a parent Work Header (no orphan records exist, and no {{NON WORK HEADER}} banner is rendered).
## *Empty Category (No Equipment Assigned)*: If a Work Header has no equipment assigned to it within the plan:
##* A single placeholder row must be rendered directly beneath that Work Header category banner row.
##* *Columns A–X Merged*: Displays the text {{No equipment assigned.}} styled in *italic light gray* font ({{#8C8C8C}}) on a *white* background ({{#FFFFFF}}) (mirroring Manpower Mob Plan {{No people assigned.}}).
# *Equipment Data Rows & Column Formatting*:
## *Child Data Rows*: Equipment records are rendered as child rows beneath their corresponding Work Header banner, ordered matching the table view.
## *Column Sequence & Formatting*:
### *No.*: Sequential integer ({{1}}, {{2}}, {{3}}... {{N}}) numbered continuously across all equipment records in the export (skipping Work Header banner rows and empty placeholder rows), *center-aligned* (horizontal: {{center}}, vertical: {{center}}), number format {{@}}.
### *Material Description*: Text, left-aligned.
### *WIN# No. (CCU No.)*: Text, left-aligned.
### *Contact Person*: Text, left-aligned.
### *Department*: Text, left-aligned.
### *Premob Inspection*: Text ({{Yes}} / {{No}}), center-aligned.
### *Width (m)*: Decimal number formatted to 2 decimal places ({{#,##0.00}}), right-aligned.
### *Length (m)*: Decimal number formatted to 2 decimal places ({{#,##0.00}}), right-aligned.
### *Height (m)*: Decimal number formatted to 2 decimal places ({{#,##0.00}}), right-aligned.
### *Area (m2)*: Excel formula {{=G{row}*H{row}}} ({{Width * Length}}), formatted to 2 decimal places ({{#,##0.00}}), right-aligned.
### *Gross Wt. (Tons)*: Decimal number formatted to 2 decimal places ({{#,##0.00}}), right-aligned.
### *Platform*: Text, left-aligned.
### *Deck*: Text, left-aligned.
### *Item No. in Plot Plan*: Text, left-aligned.
### *Transportation*: Text, left-aligned.
### *Material Ready at SKL*: Date formatted as {{d mmm yyyy}}, left-aligned.
### *Require at Offshore*: Date formatted as {{d mmm yyyy}}, left-aligned.
### *Backload to SKL*: Date formatted as {{d mmm yyyy}}, left-aligned.
### *Priority*: Text/Number ({{1}}, {{2}}, {{3}}), left-aligned.
### *Status*: Text lifecycle status, left-aligned.
### *MMR No.*: Text, left-aligned.
### *Vessel Name*: Text, left-aligned.
### *Loading at PSB*: Date formatted as {{d mmm yyyy}}, left-aligned.
### *Remark*: Text, left-aligned.
## *Blank Value Handling*: Any optional field without data in the database must be rendered as an empty blank cell (never output {{null}} or {{undefined}}).
# *Performance & Notification*:
## During export generation, the button displays a loading spinner and label {{Exporting...}}.
## On file generation completion, browser prompts standard file download and displays a toast notification: {{Equipment Mob Plan exported successfully.}}.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105877|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

----

## Comments (before 2026-10-27T11:35)

### Nuchanart Pantarath (Ninuchz), 2026-10-21T15:04

รอคำตอบจาก BA เพราะ AC ยังคลุมเครือ

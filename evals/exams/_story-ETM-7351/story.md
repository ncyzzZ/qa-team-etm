# ETM-7351 [Improvement] Equipment Mob Plan - Table Copy and Paste Support
Frozen for a defect exam: description as it was before 2026-10-28T14:16 (Jira changelog version of 2026-10-28T11:19, Jira wiki markup; 6 later edits not included), comments written before 2026-10-28T14:16 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* copy and paste {{NxN}} tabular data into the Equipment Mob Plan table
*So that* I can rapidly register and update multiple equipment and machinery records in bulk while safely preserving disabled or calculated fields

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Equipment Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Equipment Mob Plan* dashboard page.
* At least one Work Header exists in the Equipment Mob Plan grid.

----

*Data Source*

* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions
* *User Clipboard (Tabular Data)* mapping to:
** *Editable Fields (Grid Cells)*: {{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Department}}, {{Premob Inspection}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}, {{Platform}}, {{Deck}}, {{Item No. in Plot Plan}}, {{Transportation}}, {{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Priority}}, {{Status}}, {{MMR No.}}, {{Vessel Name}}, {{Loading at PSB}}, {{Remark}}.
** *View-Only System-Calculated / Auto-Numbered Fields (Skipped on Paste)*: {{No.}}, {{Area (m2)}}.
* *Validation & Result Reference*: [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=PRK3BK].
* *Core Data Schema & Validation Alignment*: Data validation rules, mandatory field constraints, character limits, dropdown options, and date sequence logic align strictly with [ETM-7306|https://pttep.atlassian.net/browse/ETM-7306], [ETM-7310|https://pttep.atlassian.net/browse/ETM-7310], and [ETM-7311|https://pttep.atlassian.net/browse/ETM-7311].

----

*Field Specification*

||Field Name||Data Type||Required?||Nullable?||Default Value||Max Length / Value Range / Enum||Notes||
|No.|Text|Yes|No|—|Sequential integer ({{1}}, {{2}}...)|Auto-generated continuous running number across all equipment rows (1..N), skipping Work Header banner rows; read-only; skipped on paste|
|Material Description|Text|Yes|No|—|Max 250 chars|Free-text item description|
|WIN# No. (CCU No.)|Text|Yes|No|—|Max 100 chars|Free-text input; truncated to 100 characters|
|Contact Person|Text|Yes|No|—|Max 150 chars|Contact assignee name|
|Department|Text|No|Yes|—|Max 100 chars|Free-text division or department|
|Premob Inspection|Enum|No|Yes|—|{{Yes}}, {{No}}|Single-select dropdown: {{Yes}}, {{No}}; optional|
|Width (m)|Number|Yes|No|—|Decimal > 0, up to 2 decimal places|Dimension width; values with >2 decimal places rounded to 2 decimal places|
|Length (m)|Number|Yes|No|—|Decimal > 0, up to 2 decimal places|Dimension length; values with >2 decimal places rounded to 2 decimal places|
|Height (m)|Number|Yes|No|—|Decimal > 0, up to 2 decimal places|Dimension height; values with >2 decimal places rounded to 2 decimal places|
|Area (m2)|Number|Yes|No|—|Calculated: {{Width * Length}}|Read-only; automatically computed to 2 decimal places; skipped on paste|
|Gross Wt. (Tons)|Number|Yes|No|—|Decimal > 0, up to 2 decimal places|Weight in metric tons; values with >2 decimal places rounded to 2 decimal places|
|Platform|Enum|No|Yes|—|Platform catalog under asset|Dropdown matching active shutdown asset platforms|
|Deck|Text / Enum|No|Yes|—|Max 100 chars|Combo-box: standard Working Location (Deck) dropdown + custom free-text|
|Item No. in Plot Plan|Text|No|Yes|—|Max 100 chars|Free-text plot plan item identifier|
|Transportation|Enum|No|Yes|—|{{Supply Vessel}}, {{Crew Boat}}, {{MSB}}, {{Helicopter}}|Optional transport mode dropdown|
|Material Ready at SKL|Date|No|Yes|—|{{DD Mon YYYY}}|Base readiness date|
|Require at Offshore|Date|No|Yes|—|{{DD Mon YYYY}}|Required date at offshore location (>= Material Ready at SKL)|
|Backload to SKL|Date|No|Yes|—|{{DD Mon YYYY}}|Return shipment date (>= Require at Offshore)|
|Priority|Enum|No|Yes|—|{{1}}, {{2}}, {{3}}|Priority tier dropdown|
|Status|Enum|No|Yes|—|{{Inspected}}, {{Delivered at PSB}}, {{MMR Issued}}, {{Vessel Assigned}}, {{In Transit}}, {{Received}}, {{Ready for Backload}}, {{Backloaded}}, {{Delay}}, {{Cancel}}|Lifecycle status dropdown|
|MMR No.|Text|No|Yes|—|Max 30 chars|Material Movement Request identifier (strictly enforced max 30 chars)|
|Vessel Name|Text|No|Yes|—|Max 100 chars|Free-text vessel name|
|Loading at PSB|Date|No|Yes|—|{{DD Mon YYYY}}|Loading date at PSB|
|Remark|Text|No|Yes|—|Max 500 chars|Free-text notes|

----

*Acceptance Criteria*

# *Selection & Copying Data from Equipment Mob Table*
## *Selection Methods*: The user MUST be able to highlight and select an {{NxN}} dimension of cells from the Equipment Mob Plan table using the following interaction methods:
##* Clicking a single cell to focus.
##* Dragging across multiple cells to highlight a contiguous rectangular range.
##* Using {{Shift}} + click (contiguous range) or {{Ctrl}} / {{Command}} + click keyboard shortcuts.
##* *Non-Contiguous Cell Copying*: When selecting discrete/non-adjacent cells using {{Ctrl}} / {{Command}} + click, copying ({{Ctrl+C}} / {{Cmd+C}}) preserves the relative spatial coordinates of the selected cells by including blank spacing for unselected cells within the bounded rectangle. When subsequently pasted, the copied values map directly onto their exact relative original positions.
## *Include Disabled & Calculated Cells in Copy Payload*: When the user copies the selection to their clipboard ({{Ctrl+C}} / {{Cmd+C}}), the copied payload MUST include the text values from any read-only or calculated cells ({{No.}}, {{Area (m2)}}) that fall within the selection footprint.
# *Pasting Data into Equipment Mob Table*
## *Paste Targets & Modes*: The user MUST be able to paste {{NxN}} tabular data from their clipboard ({{Ctrl+V}} / {{Cmd+V}}) directly into the Equipment Mob Plan table. The system must support two paste modes resulting in the exact same deterministic behavior:
##* *Focus Mode*: Pasting while a cell is focused (selected).
##* *Edit Mode*: Pasting while double-clicking a cell to enter inline edit mode. This MUST NOT paste the entire clipboard string into that single cell; it MUST behave identically to Focus Mode, mapping the {{NxN}} clipboard data across the corresponding {{NxN}} table grid cells starting from the active cell as the top-left anchor.
## *Disabled & Calculated Field Skipping Strategy*: When the pasted data footprint intersects with a disabled, read-only, or system-calculated cell ({{No.}}, {{Area (m2)}}):
##* {{No.}}: The data intended for this column MUST be ignored (preserves sequential continuous numbering).
##* {{Area (m2)}}: The data intended for this column MUST be ignored (dynamically recalculates from pasted {{Width}} and {{Length}}).
##* The system MUST NOT shift the remaining clipboard data to the next available editable cell (the clipboard data structure is maintained rigidly against the table grid coordinates).
# *Data Validation, Error Feedback & Cell Skipping (Aligned with* [*ETM-7310*|https://pttep.atlassian.net/browse/ETM-7310] *and* [*ETM-7311*|https://pttep.atlassian.net/browse/ETM-7311]*)*:
## *Paste Validation Error Modal Contract*:
### *Modal Trigger*: When one or more cells (mandatory or optional) fail validation during a paste operation (invalid type, format violation, enum mismatch, non-numeric value, or empty mandatory input), the system displays the validation error modal dialog, once per paste action (single batch notification).
### *Modal Specifications*:
###* *Modal Title*: {{Paste Validation Failed}}
###* *Message*: {{Some pasted values do not meet the validation rules and were not applied.}}
###* *Button*: {{[ OK ]}} (primary solid blue button).
### *Action on Dismissal*: Clicking {{[ OK ]}} closes the dialog and returns the user to the active table view; failing mandatory cells retain red error indicators and invalid cells remain cleared to blank.
## *Field-Specific Validation Rules upon Paste*:
### *Text Length Constraints & Sanitization*: Pasted free-text values exceeding the defined maximum character limits are automatically truncated to their defined upper bounds without error:
###* {{Material Description}}: Truncated to 250 characters.
###* {{WIN# No. (CCU No.)}}: Truncated to 100 characters.
###* {{Contact Person}}: Truncated to 150 characters.
###* {{Department}}: Truncated to 100 characters.
###* {{Deck}}: Truncated to 100 characters.
###* {{Item No. in Plot Plan}}: Truncated to 100 characters.
###* {{MMR No.}}: Truncated strictly to 30 characters.
###* {{Vessel Name}}: Truncated to 100 characters.
###* {{Remark}}: Truncated to 500 characters.
### *Dropdown Enum Validation*: Pasted values targeting dropdown columns ({{Premob Inspection}}, {{Transportation}}, {{Priority}}, {{Status}}, {{Platform}}) must exactly match one of the valid allowed enum options (case-insensitive). If a pasted value does not match any valid enum option, that individual cell paste is rejected, clearing the target field to blank and triggering the {{Paste Validation Failed}} modal.
### *Numeric Decimal Validation*: Pasted values for {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, and {{Gross Wt. (Tons)}} must be valid positive numeric decimal values (> 0, up to 2 decimal places). Non-numeric strings, negative signs ({{-}}), or values <= 0 are rejected, clearing the cell to blank and triggering the {{Paste Validation Failed}} modal. Values pasted with >2 decimal places are automatically rounded to 2 decimal places (standard rounding half-up).
### *Date Format Validation*: Pasted values for date columns ({{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Loading at PSB}}) must conform to the standard date format ({{D Mon YYYY}} or {{DD Mon YYYY}}). Any non-conforming, unparsable, or invalid date string is rejected and skipped, clearing the cell to blank and triggering the {{Paste Validation Failed}} modal.
## *Date Chronological Sequence Enforcement & Evaluation upon Paste*:
### Pasting dates triggers chronological sequence validation across the row:
###* {{Material Ready at SKL <= Require at Offshore <= Backload to SKL}}.
###* Dates are permitted to be equal ({{Material Ready at SKL = Require at Offshore = Backload to SKL}}).
###* {{Loading at PSB}} operates independently without chronological sequencing constraints against other milestones.
### *Left-to-Right Sequential Evaluation & Cell Clearing (No Red Background)*:
###* When multiple date milestones are pasted simultaneously (or pasted into a row with existing dates), evaluation proceeds strictly from left to right:
###*# {{Material Ready at SKL}} is evaluated first.
###*# {{Require at Offshore}} is evaluated against {{Material Ready at SKL}}.
###*# {{Backload to SKL}} is evaluated against {{Require at Offshore}}.
###* *Cell Rejection & Modal Trigger*: If any pasted date value violates the chronological sequence, that conflicting date cell is *cleared to blank (rejected and not applied)* and triggers the {{Paste Validation Failed}} modal.
###* *No Red Background*: Conflicting date cells are *NOT* styled with a red background.
## *Mandatory vs. Optional Field Validation Error Behavior*:
### *Mandatory Fields* ({{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}): Pasting an invalid value (invalid type, format violation, or empty input) displays the {{Paste Validation Failed}} modal, clears the field to blank, and turns the target cell background to *red* (red background only, no red border). The page-level {{[ 💾 Save ]}} button is disabled until valid data is provided.
### *Optional Fields* ({{Department}}, {{Premob Inspection}}, {{Platform}}, {{Deck}}, {{Item No. in Plot Plan}}, {{Transportation}}, {{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Priority}}, {{Status}}, {{MMR No.}}, {{Vessel Name}}, {{Loading at PSB}}, {{Remark}}): Pasting an invalid value (including date sequence conflicts) displays the {{Paste Validation Failed}} modal and clears the field to blank, but does *NOT* turn the cell background to red (normal neutral cell background is maintained).
### *Partial Paste Preservation*: In multi-cell paste operations containing a mix of valid and invalid cells, all valid cells are populated successfully into the grid.
### *Save Button Guard*: The page-level {{[ 💾 Save ]}} button is immediately *Disabled* while any mandatory cell across the table remains highlighted in a validation error state (red background).
### *Error Clearance Trigger*: A highlighted red error cell is cleared immediately when the user enters a valid value (via keyboard input or valid paste) or when the row is deleted.
## *System Auto-Derivation Rules upon Paste*:
### *Area Auto-Calculation*: Whenever valid numeric values exist for {{Width (m)}} and {{Length (m)}} following a paste, {{Area (m2)}} immediately computes and renders {{Width * Length}} (rounded to 2 decimal places). If either {{Width}} or {{Length}} is invalid, zero, or blank, {{Area}} displays {{-}}.
# *Work Header Scope, Empty States & Overflow Behavior*
## *Target Work Header Scope*: A paste operation executes strictly within the context of the Work Header containing the anchor (top-left) cell of the paste action. Pasted data does not overflow into adjacent sibling Work Headers.
## *Automatic Overflow Row Generation*: If the pasted {{NxN}} data footprint exceeds the currently available number of equipment rows under that specific Work Header:
##* The system MUST automatically generate and append new equipment rows under that specific target Work Header to accommodate the overflow data.
##* The automatically added rows are assigned continuous running {{No.}} indices across all Work Headers (and all subsequent equipment rows in subsequent Work Headers automatically re-index).
##* Unpasted fields on newly created overflow rows remain blank (empty).
## *Sectional Empty State Handling*: When pasting into a Work Header that currently contains 0 equipment (displaying {{No equipment added.}} in 14px regular grey text {{#8C8C8C}}):
##* Clicking {{[ + Add Equipment ]}} or focusing the placeholder row allows pasting clipboard data.
##* The placeholder row is immediately replaced by the newly pasted equipment rows.
## *Global Empty State Limitation*: When the table is completely empty (0 Work Headers), the canvas displays {{No results found}} with an open box illustration and regular 14px grey text ({{#8C8C8C}}). Direct paste is disallowed. The user MUST first create at least one Work Header via {{[ + Add Work Header ]}} before pasting.
## *Filter / Search Not Found*: When active search/filter criteria in the Filter Panel return zero results, the table displays {{No results found}}. Pasting into filtered results applies strictly to visible rows.
# *Data Persistence & Save Synchronization*
## *Draft State Commitment*: Pasting data ONLY updates the local client-side draft cache and marks the plan draft as dirty (activating the header {{[ 💾 Save ]}} button).
## *Permanent Database Persistence*: Permanent persistence is triggered strictly when the user clicks the global {{[ 💾 Save ]}} button in the page header:
##* Validates all modified rows across the entire grid against required fields, dimension minimums, and date sequence ordering.
##* If all rows pass validation: persists changes to backend, displays a success toast notification per [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=PRK3BK], updates {{Last update on [DD Mon YYYY]}}, and disables the *Save* button.
##* If any row contains unresolved validation errors, the *Save* button remains disabled.
## *Unsaved Changes Navigation Guard (Aligned with* [*ETM-7306*|https://pttep.atlassian.net/browse/ETM-7306] *and* [*ETM-7311*|https://pttep.atlassian.net/browse/ETM-7311]*)*:
##* Navigating away from the page (including clicking browser Back, sidebar menu links, or breadcrumb links) while unsaved pasted changes exist triggers the confirmation modal:
##** *Modal Specifications & Copy Reference*: Modal title, warning message copy, and layout strictly follow the specifications defined in [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=PRK3BK].
##** *Continue Editing*: Closes the modal and remains on the page with modified draft changes intact.
##** *Discard Change*: Discards all unsaved cell edits and navigates away from the page.
# *Role & Permission Visibility Matrix*
## *Base Access (View-Only)*: Users possessing the *View All Equipment Mob Plan Item* or *View Active Equipment Mob Plan Item* permission can access the page, view the Equipment Mob Plan table, and select/copy ({{Ctrl+C}}) cells.
## *Edit Access*: Users possessing the additional *Edit Equipment Mob Plan* permission can paste ({{Ctrl+V}}) {{NxN}} data into the table, edit cells inline, and persist changes via the page header *Save* button.
## *Without Permission*: Users lacking the *Edit Equipment Mob Plan* permission have table cells rendered strictly in read-only mode; pasting ({{Ctrl+V}}) is *Disabled* / blocked, and the header *Save* button is *Disabled*. Users lacking both *View All Equipment Mob Plan Item* and *View Active Equipment Mob Plan Item* permissions will see the Equipment Mob Plan row strictly *Hidden* within the Plan Card.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105877|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

## Comments (before 2026-10-28T14:16)

(none)

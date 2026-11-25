# ETM-6928 [Improvement] Keyboard Shortcuts for Editable Tables
Frozen for a defect exam: description as it was before 2026-10-14T13:53 (Jira changelog version of 2026-10-12T13:33, Jira wiki markup; 2 later edits not included), comments written before 2026-10-14T13:53 only. Images removed.

## Description

*As a* Turnaround Manager and Job Owner
*I want to* navigate and edit table cells using keyboard shortcuts
*So that* I can quickly enter and update data across tables without switching between keyboard and mouse.

----

*Pre-Conditions*

* The user must be successfully *logged into the system* and possess the appropriate edit permission defined in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC]:
** *Create Work* for the *Create Work* and *Duplicate Work* pages (*Work Details* section table).
** *Edit Work Breakdown* for the *Edit Work Breakdown* page table.
** *Edit Manpower Mob Plan* for the *Manpower Mob Plan: Worklist Active* page personnel table.
** *Edit Organic Crew* for the *Edit Organic Crew* page table.
* The user must have navigated to one of the four target editable table interfaces.
* The table must contain at least one row, and the user must have activated or focused an editable cell or input field.

----

*Data Source*

# *Keyboard Shortcut Navigation Matrix*:

||Shortcut Key||Direction / Action||Horizontal Row Wrap Behavior||Vertical Boundary Behavior||Notes||
|{{Tab}}|Move Right|On the last editable field of row {{N}}, moves to the first editable field of row {{N+1}}.|N/A|Bypasses non-editable cells and action icons (e.g., Delete trash icon). Focus remains on current cell if on the last cell of the last row.|
|{{Shift + Tab}}|Move Left|On the first editable field of row {{N}}, moves to the last editable field of row {{N-1}}.|N/A|Focus remains on current cell if on the first cell of the first row.|
|{{Enter}}|Move Down|N/A|Moves to the same column/field in row {{N+1}}.|Focus remains on current cell if on the bottom row. Commits active dropdown/autocomplete selection before navigation.|
|{{Shift + Enter}}|Move Up|N/A|Moves to the same column/field in row {{N-1}}.|Focus remains on current cell if on the top row.|

# *Target Tables & Editable Field Sequences*:

||Destination Screen||Target Table Section||Editable Column Sequence (Left to Right)||Excluded Non-Data / Action Columns||
|*1. Create / Duplicate Work*|*Work Details* Table|1. {{Work Type}} (Dropdown)2. {{Work Number}} (Text Input)3. {{Job Description}} (Text Input)4. {{Platform}} (Dropdown)5. {{Working Location (Deck)}} (Dropdown)6. {{Working Location (X)}} (Dropdown)7. {{Working Location (Y)}} (Dropdown)|Delete (trash icon button)|
|*2. Edit Work Breakdown*|Work Breakdown Table|1. {{Task Description}} (Text / Textarea)2. {{Priority}} (Dropdown)3. {{Working Location (Deck)}} (Multi-Select Chips)4. {{Working Location (X)}} (Multi-Select Chips)5. {{Working Location (Y)}} (Multi-Select Chips)6. {{Manpower Resource}} (Multi-Select Chips with Quantities)|Reorder drag handle ({{:::}}), Delete (trash icon button)|
|*3. Manpower Mob Plan*|Personnel Rows (under Resource Group)|1. {{Name}} (Text Input)2. {{Mob Date}} (Date Picker)3. {{Demob Date}} (Date Picker)|{{Onboard Date}} (System-calculated read-only), Delete (trash icon button), Daily schedule cells|
|*4. Edit Organic Crew*|Organic Crew Table|1. {{Resource Name}} (Text Input / Autocomplete)2. {{Working Schedule}} (Dropdown)3. {{Quantity}} (Number Input)|Delete (trash icon button)|

----

*Acceptance Criteria*

# *General Keyboard Shortcut Navigation Rules*:
## *Horizontal Forward (*{{Tab}}*)*:
### Pressing {{Tab}} while focused on an editable field moves focus to the immediately adjacent editable field to the right within the same row.
### If focus is on the last editable field of row {{N}}, pressing {{Tab}} wraps focus to the first editable field of the subsequent row ({{row N+1}}).
### If focus is on the last editable field of the last row in the table, pressing {{Tab}} maintains focus on the current cell (does not escape the table or cycle out of bounds).
## *Horizontal Backward (*{{Shift + Tab}}*)*:
### Pressing {{Shift + Tab}} while focused on an editable field moves focus to the immediately adjacent editable field to the left within the same row.
### If focus is on the first editable field of row {{N}} (where {{N > 1}}), pressing {{Shift + Tab}} wraps focus to the last editable field of the preceding row ({{row N-1}}).
### If focus is on the first editable field of the first row ({{row 1}}) in the table, pressing {{Shift + Tab}} maintains focus on the current cell (does not escape the table or jump to header controls).
## *Vertical Downward (*{{Enter}}*)*:
### Pressing {{Enter}} while focused on an editable field moves focus down to the exact same column/field in the row below ({{row N+1, col M}}).
### If focus is on any field in the bottom-most row of the table, pressing {{Enter}} maintains focus on the current cell.
## *Vertical Upward (*{{Shift + Enter}}*)*:
### Pressing {{Shift + Enter}} while focused on an editable field moves focus up to the exact same column/field in the row above ({{row N-1, col M}}).
### If focus is on any field in the top-most row ({{row 1}}) of the table, pressing {{Shift + Enter}} maintains focus on the current cell.
## *Action Column & Read-Only Field Bypass*:
### The keyboard shortcut navigation chain strictly targets interactive data entry fields.
### Action controls (such as the row *Delete* trash icon and the reorder drag handle {{:::}}) and system-calculated read-only cells (such as {{Onboard Date}} in Manpower Mob Plan) are automatically bypassed during shortcut navigation.
# *Cell State, Auto-Commit, and Focus Transitions*:
## *Automatic Value Commit*: Navigating away from an active cell using {{Tab}}, {{Shift + Tab}}, {{Enter}}, or {{Shift + Enter}} immediately commits the edited text or selected option to the client-side working draft model.
## *Text Field Immediate Focus & Selection*: When focus lands on a text input cell via shortcut navigation, the input is immediately active for editing with all existing text highlighted/selected, allowing the user to immediately type to overwrite or use arrow keys to edit.
## *Dropdown, Autocomplete, and Multi-Select Tag Cells*:
### When focus moves into a dropdown, autocomplete, or multi-select chip input cell via shortcut, the element receives focus in a closed/ready state with a visible focus outline.
### If a dropdown menu or autocomplete option list is currently open:
#### Pressing {{Tab}} or {{Shift + Tab}} selects the currently highlighted option, closes the menu, and completes the horizontal cell navigation.
#### Pressing {{Enter}} confirms and selects the highlighted option and closes the dropdown list; a subsequent press of {{Enter}} (or pressing {{Enter}} when the dropdown is closed) navigates down to the cell below.
## *Date Picker Cells*:
### When focus moves into a date picker cell via shortcut, the input is focused in a closed state.
### Pressing {{Tab}}, {{Shift + Tab}}, {{Enter}}, or {{Shift + Enter}} navigates to the target adjacent cell without opening the calendar modal.
# *Destination 1: Create and Duplicate Work - Work Details Section Table*:
## On the *Create Work* and *Duplicate Work* pages within the *Work Details* table, the navigation order is strictly:
{{Work Type}} → {{Work Number}} → {{Job Description}} → {{Platform}} → {{Working Location (Deck)}} → {{Working Location (X)}} → {{Working Location (Y)}}.
## Pressing {{Tab}} on {{Working Location (Y)}} moves focus directly to {{Work Type}} in the next row, bypassing the *Delete* icon.
## Pressing {{Shift + Tab}} on {{Work Type}} moves focus to {{Working Location (Y)}} in the previous row.
## Pressing {{Enter}} or {{Shift + Enter}} navigates vertically between corresponding fields in adjacent rows.
# *Destination 2: Edit Work Breakdown Page Table*:
## On the *Edit Work Breakdown* page table, the navigation order is strictly:
{{Task Description}} → {{Priority}} → {{Working Location (Deck)}} → {{Working Location (X)}} → {{Working Location (Y)}} → {{Manpower Resource}}.
## The reorder drag handle ({{:::}}) preceding {{Task Description}} and the *Delete* icon following {{Manpower Resource}} are bypassed.
## Pressing {{Tab}} on {{Manpower Resource}} moves focus directly to {{Task Description}} in the next breakdown task row.
## Pressing {{Shift + Tab}} on {{Task Description}} moves focus to {{Manpower Resource}} in the preceding breakdown task row.
## Pressing {{Enter}} or {{Shift + Enter}} navigates vertically between corresponding fields in adjacent breakdown task rows.
# *Destination 3: Manpower Mob Plan (Worklist Active) - Personnel Table*:
## On the *Manpower Mob Plan: Worklist Active* page within the personnel sub-rows under each Resource group, the navigation order is strictly:
{{Name}} → {{Mob Date}} → {{Demob Date}}.
## The system-calculated read-only {{Onboard Date}} column is bypassed; pressing {{Tab}} on {{Mob Date}} moves focus directly to {{Demob Date}}, and pressing {{Shift + Tab}} on {{Demob Date}} moves focus directly to {{Mob Date}}.
## Pressing {{Tab}} on {{Demob Date}} of personnel row {{P}} moves focus to {{Name}} in the next personnel row {{P+1}}. If row {{P}} is the last personnel row under Resource group {{A}}, pressing {{Tab}} advances to {{Name}} in the first personnel row of subsequent Resource group {{B}}.
## Pressing {{Enter}} or {{Shift + Enter}} moves vertically between adjacent personnel rows within the same column ({{Name}}, {{Mob Date}}, or {{Demob Date}}).
## Timeline schedule grid cells, category summary rows, and row *Delete* icons are excluded from the personnel table shortcut sequence.
# *Destination 4: Edit Organic Crew Page Table*:
## On the *Edit Organic Crew* page table, the navigation order is strictly:
{{Resource Name}} → {{Working Schedule}} → {{Quantity}}.
## Pressing {{Tab}} on {{Quantity}} moves focus directly to {{Resource Name}} in the next row, bypassing the *Delete* icon.
## Pressing {{Shift + Tab}} on {{Resource Name}} moves focus to {{Quantity}} in the previous row.
## Pressing {{Enter}} or {{Shift + Enter}} navigates vertically between corresponding fields in adjacent rows.

----

*UI Design*

* *Reference Mockups*:
** [Create / Duplicate Work at Work Detail|https://www.figma.com/design/xXx8RG78Q5MGsNnhF1rrWh/EMI---Turnaround--Worklist-?node-id=1-19985&t=7ZaIHzm6f2CGHscm-4]
** [Edit Work Breakdown|https://www.figma.com/design/xXx8RG78Q5MGsNnhF1rrWh/EMI---Turnaround--Worklist-?node-id=1-21301&t=Ot2LfvQKLCSGZL9w-4]
** [Manpower Mob Plan|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Manpower-Mob-Demob-Plan-?node-id=1351-315089&t=ZrHIuhuXu9KeRf26-4]
** [Edit Organic Crew|https://www.figma.com/design/nk72RA4HUZbIbxXFN42PlB/EMI---Turnaround--Manpower-Resource-?node-id=2-11436&t=OkZRGPh36DWaqyWN-4]
* *Design System*: PTTEP Digital Workspace Design System (focus ring indicator with standard 2px primary blue outline on active table cell input).

----

## Comments (before 2026-10-14T13:53)

(none)

# ETM-7310 Equipment Mob Plan - Add Equipment
Frozen for a defect exam: description as it was before 2026-10-26T15:34 (Jira changelog version of 2026-10-26T15:33, Jira wiki markup; 4 later edits not included), comments written before 2026-10-26T15:34 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* add a new equipment item under a specific Work Header via an inline table row
*So that* I can register tools, containers, and machinery required for turnaround execution.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Equipment Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Equipment Mob Plan* dashboard page.
* The target Work Header exists in the Equipment Mob Plan.

----

*Data Source*

* Equipment catalog, active Asset platforms master, Working Location (Deck) master, and Work Headers (initialized from Worklist or custom added; sorted by Master Data sequence from [Data Storage.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Data%20Storage.xlsx?d=wd5bd986545a447f68b1244e525804f6f&csf=1&web=1&e=GczUV8&nav=MTVfezRGNDg2M0IyLUQ3NTYtNENBMi05MjAxLUY1QjAxQTU0MzVBQ30]).
* *Validation & Result*: [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW].
* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions

----

*Acceptance Criteria*

# *Triggering Add Equipment (Aligned with* [*ETM-5836*|https://pttep.atlassian.net/browse/ETM-5836]*)*:
## Each Work Header row contains an inline {{[ + Add Equipment ]}} text button.
## Clicking {{[ + Add Equipment ]}} automatically expands the Work Header (if collapsed) and immediately inserts an empty editable row directly below the header (or below the last equipment item in that header) without opening a modal.
## *No Toast Notification*: Adding an equipment row does not display any toast notification (row is inserted directly into the client-side working draft).
## If the Work Header previously displayed {{No equipment added.}}, that placeholder is replaced by the new editable row.
# *Work Header Grouping & Equipment Row Ordering (Aligned with* [*ETM-7306*|https://pttep.atlassian.net/browse/ETM-7306]*)*:
## *Work Header Hierarchy & Ordering Context*: Equipment items are strictly categorized and nested under their respective parent Work Header banner row. Parent Work Headers across the data grid maintain their established ordering: baseline Work Headers initialized from the Worklist are sorted strictly by Master Data sequence from [Data Storage.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Data%20Storage.xlsx?d=wd5bd986545a447f68b1244e525804f6f&csf=1&web=1&e=GczUV8&nav=MTVfezRGNDg2M0IyLUQ3NTYtNENBMi05MjAxLUY1QjAxQTU0MzVBQ30], and manually added Work Headers appended below existing headers at the bottom of the table.
## *Equipment Row Placement & Sequential Ordering*: Newly added equipment rows are always appended below existing equipment rows under that specific Work Header (positioned at the bottom of the target work discipline section), preserving the sequential order of addition.
## *Auto-Generated Continuous Running Numbering (Skipping Work Header Rows)*: The {{No.}} column displays a continuous running number from top to bottom across all equipment rows (1, 2, 3, ... N), rather than restarting at 1 under each Work Header. Parent Work Header banner rows and empty state placeholder rows ({{No equipment added.}}) do not receive a number and are skipped from the numbering sequence. Numbering increments strictly on actual equipment rows:
##* Work Header 1 (e.g. {{Operation}}): _(Row skipped, no number)_
##** {{1}} Pump
##** {{2}} Crane
##* Work Header 2 (e.g. {{Scaffolding}}): _(Row skipped, no number)_
##** {{3}} Tube set
##** {{4}} Clamp box
##* When an equipment row is added, it is assigned the continuous sequential number corresponding to its position in the overall table, and all subsequent equipment rows across all Work Headers automatically re-index to maintain continuous sequential order.
# *Inline Editable Fields & Rules*:

||Field Name||Type||Mandatory||Validation & Format||
|{{No.}}|Text|Yes|Auto-generated continuous running number across all equipment rows (1..N), skipping Work Header banner rows; read-only.|
|{{Material Description}}|Text Input|Yes|Max 250 characters. Cannot be blank.|
|{{WIN# No. (CCU No.)}}|Text Input|Yes|Free-text input. Max 100 characters. Cannot be blank.|
|{{Contact Person}}|Free-text Input|Yes|Free-text input. Max 150 characters. Cannot be blank.|
|{{Department}}|Free-text Input|No|Optional free-text input. Max 100 characters.|
|{{Premob Inspection}}|Dropdown|No|Dropdown list: {{Yes}}, {{No}}. Optional.|
|{{Width (m)}}|Numeric Input|Yes|Decimal number > 0, up to 2 decimal places (e.g. {{2.50}}). Typing negative signs ({{-}}) or beyond 2 decimal places is strictly blocked; pasting values with >2 decimal places automatically rounds them to 2 decimal places. Entering <= 0 or empty highlights the input border in red (no popover notification).|
|{{Length (m)}}|Numeric Input|Yes|Decimal number > 0, up to 2 decimal places (e.g. {{4.00}}). Typing negative signs ({{-}}) or beyond 2 decimal places is strictly blocked; pasting values with >2 decimal places automatically rounds them to 2 decimal places. Entering <= 0 or empty highlights the input border in red (no popover notification).|
|{{Height (m)}}|Numeric Input|Yes|Decimal number > 0, up to 2 decimal places (e.g. {{2.80}}). Typing negative signs ({{-}}) or beyond 2 decimal places is strictly blocked; pasting values with >2 decimal places automatically rounds them to 2 decimal places. Entering <= 0 or empty highlights the input border in red (no popover notification).|
|{{Area (m2)}}|Calculated (Read-only)|-|*Disabled / Non-editable*. Automatically calculated as {{Width * Length}} (e.g. 1.25 * 3.10 = 3.88 m²; standard rounding half-up), displayed to 2 decimal places.|
|{{Gross Wt. (Tons)}}|Numeric Input|Yes|Decimal number > 0, up to 2 decimal places (e.g. {{5.20}}). Typing negative signs ({{-}}) or beyond 2 decimal places is strictly blocked; pasting values with >2 decimal places automatically rounds them to 2 decimal places. Entering <= 0 or empty highlights the input border in red (no popover notification).|
|{{Platform}}|Dropdown|No|Dropdown list populated with every platform under the current shutdown asset.|
|{{Deck}}|Dropdown with Free-text|No|Combo-box; dropdown selections are identical to the standard _Working Location (Deck)_ master list, with support for typing custom free-text.|
|{{Item No. in Plot Plan}}|Text Input|No|Free-text input. Max 100 characters.|
|{{Transportation}}|Dropdown|No|Dropdown list containing strictly: {{Supply Vessel}}, {{Crew Boat}}, {{MSB}}, {{Helicopter}}.|
|{{Material Ready at SKL}}|Date Picker|No|Format: {{DD Mon YYYY}} (e.g. {{10 Jan 2026}}).|
|{{Require at Offshore}}|Date Picker|No|Format: {{DD Mon YYYY}}. Must be >= {{Material Ready at SKL}}.|
|{{Backload to SKL}}|Date Picker|No|Format: {{DD Mon YYYY}}. Must be >= {{Require at Offshore}}.|
|{{Priority}}|Dropdown|No|Dropdown list containing options: {{1}}, {{2}}, {{3}}.|
|{{Status}}|Dropdown|No|Dropdown list containing 10 lifecycle options: {{Inspected}}, {{Delivered at PSB}}, {{MMR Issued}}, {{Vessel Assigned}}, {{In Transit}}, {{Received}}, {{Ready for Backload}}, {{Backloaded}}, {{Delay}}, {{Cancel}}.|
|{{MMR No.}}|Text Input|No|Free-text input. Max 30 characters. Input strictly blocks or truncates typing beyond 30 characters.|
|{{Vessel Name}}|Text Input|No|Free-text input. Max 100 characters.|
|{{Loading at PSB}}|Date Picker|No|Format: {{DD Mon YYYY}} (e.g. {{12 Jan 2026}}).|
|{{Remark}}|Text Input|No|Free-text input. Max 500 characters.|
|{{Action}}|Icon Button|-|Displays Delete trash icon ({{🗑️}}).|

# *Draft Validation & Sequential Date Rules*:
## When user clicks outside the row or presses {{Enter}}:
##* If all mandatory fields ({{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}) are filled and valid: the row transitions to saved draft state.
##* If any mandatory field is missing: the missing input borders highlight in red and focus remains on the first invalid field.
## *Chronological Date Sequence Constraint & Date Picker Blocking*:
##* The date milestone sequence must strictly satisfy: {{Material Ready at SKL <= Require at Offshore <= Backload to SKL}}.
##* Dates are permitted to be equal ({{Material Ready at SKL = Require at Offshore = Backload to SKL}}).
##* {{Loading at PSB}} operates independently without chronological sequencing constraints against other milestones.
##* *Date Picker Selection Blocking (No Red Background)*: The interactive Date Picker popover calendar strictly *blocks and disables* selecting any date that violates this sequence:
##** When selecting {{Require at Offshore}}, calendar dates prior to {{Material Ready at SKL}} are disabled/unselectable.
##** When selecting {{Backload to SKL}}, calendar dates prior to {{Require at Offshore}} are disabled/unselectable.
##** If modifying {{Material Ready at SKL}}, calendar dates subsequent to {{Require at Offshore}} are disabled/unselectable.
##** Because violating dates are strictly blocked from selection within the Date Picker popover, conflicting dates cannot be selected and no red background styling is displayed.
##* *Pasting Date Data*: When date values are pasted from clipboard, chronological sequence is evaluated strictly left-to-right; conflicting dates are rejected, cleared to blank, trigger the {{Paste Validation Failed}} modal, and do NOT show a red background (governed by [ETM-7351|https://pttep.atlassian.net/browse/ETM-7351]).
# *Multiple Row Addition*:
## Clicking {{[ + Add Equipment ]}} again allows adding subsequent equipment rows under the same Work Header, appending each new row at the bottom of that section with the appropriate continuous running {{No.}}, and automatically re-indexing subsequent rows across all Work Headers.
## Marks the plan draft as dirty (enabling header {{[ 💾 Save ]}} button).
# *Strict Cross-Module Isolation Rule*:
## Adding equipment in the Equipment Mob Plan is strictly isolated to the Equipment Mob Plan dataset and does not alter records in *Worklist* or *Shutdown Logic*.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105875|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

## Comments (before 2026-10-26T15:34)

(none)

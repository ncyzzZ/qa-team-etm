# ETM-7306 Equipment Mob Plan - Table Columns, Work Header Grouping & Empty States
Frozen for a defect exam: description as it was before 2026-10-26T07:14 (Jira changelog version of 2026-10-22T15:11, Jira wiki markup), comments written before 2026-10-26T07:14 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* view equipment items categorized under collapsible Work Header groups in a structured data grid with explicit empty states, and persist the row layout globally
*So that* I can easily scan and inspect equipment allocations across all work disciplines and maintain a consistent view for the planning team.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Equipment Mob Plan Item* or *View Active Equipment Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC]. (Note: Persisting table row collapse/expand states globally requires the *Edit Equipment Mob Plan* permission).
* The user is on the *Equipment Mob Plan* dashboard page.

----

*Data Source*

* {{Equipment Mob Plan}}: Work Headers (initialized from Worklist or custom added; sorted by Master Data sequence from [Data Storage.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Data%20Storage.xlsx?d=wd5bd986545a447f68b1244e525804f6f&csf=1&web=1&e=GczUV8&nav=MTVfezRGNDg2M0IyLUQ3NTYtNENBMi05MjAxLUY1QjAxQTU0MzVBQ30]) and child Equipment records.
* *View State*: Client-side UI state controlling row expansion/collapse and global table layout persistence.
* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions

----

*Acceptance Criteria*

# *Grid Column Structure*:
## The data grid renders the following default columns from left to right:
##* {{No.}} (Center aligned, width: 60px; auto-generated continuous running number across all equipment rows, skipping Work Header banner rows)
##* {{Material Description}} (Left aligned, min-width: 200px)
##* {{WIN# No. (CCU No.)}} (Left aligned, min-width: 180px)
##* {{Contact Person}} (Left aligned, min-width: 150px)
##* {{Department}} (Left aligned, min-width: 120px)
##* {{Premob Inspection}} (Center aligned, min-width: 130px; dropdown: {{Yes}}, {{No}})
##* {{Width (m)}} (Right aligned, min-width: 90px; numeric decimal)
##* {{Length (m)}} (Right aligned, min-width: 90px; numeric decimal)
##* {{Height (m)}} (Right aligned, min-width: 90px; numeric decimal)
##* {{Area (m2)}} (Right aligned, min-width: 90px; disabled/read-only calculated field: {{Width * Length}})
##* {{Gross Wt. (Tons)}} (Right aligned, min-width: 110px; numeric decimal)
##* {{Platform}} (Left aligned, min-width: 130px; dropdown populated with every platform under the current asset)
##* {{Deck}} (Left aligned, min-width: 140px; dropdown with free-text input, selections identical to Working Location (Deck))
##* {{Item No. in Plot Plan}} (Left aligned, min-width: 140px; text input)
##* {{Transportation}} (Left aligned, min-width: 150px; dropdown: Supply Vessel, Crew Boat, MSB, Helicopter)
##* {{Material Ready at SKL}} (Center aligned, min-width: 140px; datepicker {{DD Mon YYYY}})
##* {{Require at Offshore}} (Center aligned, min-width: 140px; datepicker {{DD Mon YYYY}})
##* {{Backload to SKL}} (Center aligned, min-width: 140px; datepicker {{DD Mon YYYY}})
##* {{Priority}} (Center aligned, min-width: 80px; dropdown: 1, 2, 3)
##* {{Status}} (Center aligned, min-width: 160px; dropdown: Inspected, Delivered at PSB, MMR Issued, Vessel Assigned, In Transit, Received, Ready for Backload, Backloaded, Delay, Cancel)
##* {{MMR No.}} (Left aligned, min-width: 120px; text input, max 30 characters)
##* {{Vessel Name}} (Left aligned, min-width: 140px; free-text input)
##* {{Loading at PSB}} (Center aligned, min-width: 140px; datepicker {{DD Mon YYYY}})
##* {{Remark}} (Left aligned, min-width: 180px; text input)
##* {{Action}} (Right aligned, width: 60px; contains delete icon {{🗑️}})
## Required column headers display a red asterisk ({{*}}) prefix ({{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}).
## *Date Milestone Sequencing*: The date milestone columns enforce chronological progression: {{Material Ready at SKL <= Require at Offshore <= Backload to SKL}}.
# *Work Header Section Grouping & Ordering*:
## *Work Header Initialization & Ordering*: Work Headers span across the full width of the table as parent category banner rows with light grey background ({{#F5F7FA}}). Work Headers are initialized from the Worklist (or custom added by the user). Baseline Work Headers populated from the Worklist are automatically sorted strictly in accordance with Master Data sequence from [Data Storage.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Data%20Storage.xlsx?d=wd5bd986545a447f68b1244e525804f6f&csf=1&web=1&e=GczUV8&nav=MTVfezRGNDg2M0IyLUQ3NTYtNENBMi05MjAxLUY1QjAxQTU0MzVBQ30].
## *Manually Added Headers Position*: Any manually added Work Header created via the {{[ + Add Work Header ]}} toolbar button is always appended below existing Work Headers at the bottom of the table.
## *Work Header Row Components*: Each Work Header row contains:
##* Expand/Collapse chevron icon (expanded by default).
##* Work Header Name in bold text (e.g., {{Operation}}, {{Electrical and Instrument (PM)}}, {{Mechanical (CM)}}).
##* {{[ + Add Equipment ]}} text button with plus icon.
##* Three-dot action menu icon ({{⋮}}) on the far right.
## *Chevron Icon Toggle Only*: Toggling the expansion/collapse of nested equipment child rows is strictly triggered by clicking the *chevron icon* on the Work Header row. Clicking anywhere else on the Work Header banner row (including whitespace, Work Header Name, {{[ + Add Equipment ]}}, or {{⋮}}) does not trigger collapse or expansion. Toggling the chevron modifies table layout state and enables the *Save* button per Criterion 5.2.
# *Global Page Empty State (0 Work Headers)*:
## When an Equipment Mob Plan contains zero Work Headers (e.g. Worklist was empty upon initialization and no headers have been added, or all headers were deleted):
##* The table body displays a centralized empty state container with an open box illustration and centered text: {{No results found}} in regular 14px grey text ({{#8C8C8C}}).
##* There is no sub-text or prompt message below {{No results found}}.
##* The top toolbar button *[ + Add Work Header ]* remains fully active and clickable above the empty canvas.
# *Sectional Empty State (Work Header with 0 Equipment)*:
## When a Work Header exists but has no equipment records assigned to it:
##* The child row directly below the Work Header displays: {{No equipment added.}} in 14px regular italic grey text ({{#8C8C8C}}).
##* The placeholder row spans across all table columns.
# *State Persistence & Session Restore (Aligned with* [*ETM-6317*|https://pttep.atlassian.net/browse/ETM-6317]*)*:
## *Save Action Commit*: The active collapse/expand states of individual Work Header rows are saved and committed to the database when the primary page-level *Save* button is clicked.
## *Save Button Trigger Behavior*: Executing any expand/collapse action via individual Work Header row chevrons (or via the Custom View panel per [ETM-7313|https://pttep.atlassian.net/browse/ETM-7313]) *enables* the page-level *Save* button (for authorized users).
## *Discard on Page Exit & Unsaved Changes Guard*: If a user attempts to leave or navigate away from the Equipment Mob Plan page with unsaved modified row collapse/expand states, the system displays the *Unsaved Change* confirmation modal with *Continue Editing* and *Discard Change* buttons:
##* *Continue Editing*: Closes the modal and remains on the page with modified row collapse/expand states intact.
##* *Discard Change*: Discards all unsaved collapse/expand changes and navigates away from the page.
_(Warning body copy referenced in_ [_Equipment Mob Plan Validation&Result.xlsx_|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW]_)_.
## *Persistence Rights*: Only users possessing the *Edit Equipment Mob Plan* permission are authorized to save the table row collapse/expand state to the database. Users with only View permissions (*View All Equipment Mob Plan Item* or *View Active Equipment Mob Plan Item*) can toggle row chevrons locally during their active session, but the *Save* button is *Disabled*, preventing global persistence.
## *Global Shared State & Session Restore*:
##* *Saved Table Row State*: When saved by an authorized editor, the collapse/expand states of the Work Header rows are persisted globally for the specific Equipment Mob Plan instance. The saved row view configuration automatically applies to *all users* upon logging in, refreshing, or viewing the page.
##* *Default Unsaved State (First Login)*: If no saved layout state exists in the database, the table defaults to a fully expanded view where *all Work Header rows are expanded*.
## *Integration with Filter Panel*:
##* *Cumulative Filter Logic (AND Relationship)*: The Work Header expansion state and the active criteria applied in the *Filter Panel* ([ETM-7314|https://pttep.atlassian.net/browse/ETM-7314]) operate in a cumulative {{AND}} logical relationship.
##* *Row Visibility Rule*: An equipment row is visible on screen *if and only if* its parent Work Header is expanded (either manually or via Custom View) AND the equipment row satisfies all active criteria in the Filter Panel simultaneously. If a Work Header is collapsed and all its nested equipment are filtered out by the active filter, the Work Header row itself is hidden.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105877 & Empty State Frame|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

## Comments (before 2026-10-26T07:14)

### Automation for Jira, 2026-10-26T04:13

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7621#icft=ETM-7621</custom> has been resolved


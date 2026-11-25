# ETM-5614 Manpower Mob Plan - View Table Columns & Category Hierarchy
Frozen for a defect exam: description as it was before 2026-09-16T16:16 (Jira changelog version of 2026-09-11T16:30, Jira wiki markup; 1 later edits not included), comments written before 2026-09-16T16:16 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* view structured columns, Resource hierarchies, and expand/collapse column groups in the table pane
*So that* I can inspect personnel identity, travel logistics, and bed reservations without horizontal clutter.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Manpower Mob Plan Item* or *View Active Manpower Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.

----

*Data Source*

* *Utilized Manpower Resource*: Sourced from the parent Turnaround Plan's Shutdown Logic, including Resource Name and Daily Utilized Resource.
* *Resource Group*: {{* Name}} (Text, Mandatory {{*}}, Max 256), {{Company}} (Text, Max 256), {{Department}} (Text, Max 64), {{* Accommodation}} ({{LQ}}, {{Barge}}, {{FSO}}, Mandatory {{*}}), {{* D/N Shift}} ({{Day}}, {{Night}}, Mandatory {{*}}), {{* Hot Bed}} ({{Yes}}, {{No}}, Mandatory {{*}}).
* *Mob Group*: {{Transportation}} ({{Helicopter}}, {{MSB}}, {{Vessel}}), {{Mob Date}} ({{DD Mon YYYY}}), {{Route No.}} (Text, Max 30).
* *Standalone Column*: {{Onboard Date}} ({{DD Mon YYYY}}, view-only system-calculated: {{Mob Date}} for Helicopter/MSB, {{Mob Date + 1}} for Vessel).
* *Demob Group*: {{Transportation}} ({{Helicopter}}, {{MSB}}, {{Vessel}}), {{Demob Date}} ({{DD Mon YYYY}}), {{Route No.}} (Text, Max 30).
* *Reservation Group*: {{Dlog Status}} (Text, Max 20), {{Booking No.}} (Text, Max 30).

----

*Acceptance Criteria*

# *Dual Resource Type Classification & Shutdown Logic Histogram Snapshot*:
## *Resource Type Classification*: The Manpower Mob Plan differentiates resources into two distinct operational types:
### *Snapshotted Resources (from Shutdown Logic)*: Baseline craft disciplines derived from the parent Plan's Shutdown Logic Histogram Table.
### *Manually Added Resources*: Ad-hoc Resources added by planners directly within the Manpower Mob Plan (governed by [ETM-5835|https://pttep.atlassian.net/browse/ETM-5835]).
## *Snapshotted Resource Baseline & Information Icon `(i)`*:
### *Required Manpower Info Tooltip*: In the nested *Required Manpower* sub-row directly beneath each snapshotted Resource, an information icon {{(i)}} is displayed immediately following the *`Required Manpower`* label. Hovering over {{(i)}} displays a tooltip: *"Required manpower sourced from shutdown logic schedule."*
### *Dedicated Required Manpower Sub-Row*: Each snapshotted Resource contains a dedicated, nested *Required Manpower* sub-row directly beneath the category header.
### *Peak Hour Headcount Calculation*: For each date column {{d}}, the {{Required Manpower}} value is automatically prefilled with the maximum headcount utilized across all hours: {{Required Manpower(R, d) = MAX(Utilized Headcount across 0:00-24:00 on date d)}} where {{R}} is the specific Resource.
### *Editable Headcount Values*: Headcount numbers in the *Required Manpower* row are prefilled from the snapshot and can be edited inline by double-clicking the cell per [ETM-5616|https://pttep.atlassian.net/browse/ETM-5616].
### *Deficit Highlighting (Red Text Warning)*: On any calendar date {{d}}, if the daily category total onboard count (POB) is strictly less than the Required Manpower ({{POB(R, d) < Required Manpower(R, d)}}), the *Required Manpower number for date d must be displayed in Red font* to flag an under-manned deficit.
### *Non-Deletable Lock*: Snapshotted Resource categories are permanent baseline records and do not display a delete action.
## *Manually Added Resource Structure*:
### Contains *no Required Manpower sub-row* (only displays category header with POB sum and nested personnel rows, and omits the {{(i)}} info icon).
### Does not display an {{(i)}} snapshot info icon.
### Supports renaming via the action menu and deletion per [ETM-5835|https://pttep.atlassian.net/browse/ETM-5835].
# *Table Hierarchy & Row Grouping*:
## *Resource Category Rows & Sorting*: Highlighted in dark blue. *All Resource categories (both snapshotted and manually added) are automatically sorted in alphabetical ascending order (A to Z)* by resource name.
### *Daily Category POB Summation*: In each calendar date column on the schedule timeline, the dark blue category header row displays the dynamic total POB summation of all workers nested within that Resource whose physical presence is active on date {{d}} (where {{Onboard Date <= d < Demob Date}}).
### *Automatic Recalculation*: This daily POB summation is strictly read-only and automatically recalculates whenever a worker is added, deleted, or their {{Mob Date}}, {{Onboard Date}}, or {{Demob Date}} is modified.
## *Category Collapse / Expand & Required Manpower Persistence*:
### *Chevron Toggle*: Each category header features a chevron toggle ({{v}} / {{>}}) to expand or collapse its constituent personnel rows.
### *Persistent Required Manpower Display*: When a snapshotted Resource category is in the *collapsed* state ({{>}}), all nested individual personnel rows are hidden, but the *Required Manpower row must remain permanently visible directly beneath the category header*.
## *Personnel Rows*: Individual personnel rows nested cleanly under their designated Resource. Sorted by Created time Old to New.
## *No Personnel Assigned State*: If a Resource currently has zero personnel rows nested underneath it, a placeholder row displaying *"No personnel assigned"* is rendered directly beneath the category header (or beneath the Required Manpower row, if applicable).
# *Column Structure & Collapsible Column Groups*:
## *Group Headers with Expand/Collapse*:
### *Resource Group (`Resource >`)*: Displays {{* Name}}, {{Company}}, {{Department}}.
### *Mob Group (`Mob >`)*: Displays {{Transportation}}, {{Mob Date}}, {{Vessel No.}}.
### *Standalone Column*: {{Onboard Date}} (always visible between Mob and Demob groups; view-only system-calculated).
### *Demob Group (`Demob >`)*: Displays {{Transportation}}, {{Demob Date}}, {{Vessel No.}}.
### *Reservation Group (`Reservation >`)*: Displays {{Dlog Status}}, {{Booking No.}}, {{* Hot Bed}}.
## *Collapse / Expand Toggle Behavior & Single-Field Collapsed Display*:
### *Toggle Interaction*: Clicking the group toggle chevron (*>*) in a column group header toggles that group between the *Expanded* and *Collapsed* states.
### *Single-Field Collapsed Display Rule*: When a column group is collapsed, exactly *one primary field* remains displayed while all other child columns within that group are hidden:
1. *`Resource` group*: Displays only *`Name`* (hiding {{Company}}, {{Department}}, {{Accommodation}}, {{D/N Shift}}, and {{Hot Bed}}).
2. *`Mob` group*: Displays only *`Mob Date`* (hiding {{Transportation}} and {{Route No.}}).
3. *`Demob` group*: Displays only *`Demob Date`* (hiding {{Transportation}} and {{Route No.}}).
4. *`Reservation` group*: Displays only *`Dlog Status`* (hiding {{Booking No.}}).
### *Standalone Column Persistence*: The standalone *`Onboard Date`* column does not belong to a group and remains permanently visible regardless of the collapse states of adjacent groups.
### *Re-Expand Behavior*: Clicking the chevron toggle on a collapsed column header restores all child columns of that group to full visibility.
## *Default State*: All column groups and category hierarchies initialize in the *Expanded* state on first load.
# *Empty State Display*:
## *No Snapshot Data Available*: If there is no data in Shutdown Logic when creating the Manpower Mob Item, the page must show "No resource available to display." when logging in.

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=240-87386&t=vOquosWpB8aG4rpN-4]
* *Design System*: Built using PTTEP Nualta Tree Grid multi-level header components.

----

## Comments (before 2026-09-16T16:16)

(none; only Jira Automation notices)

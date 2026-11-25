# ETM-6379 Manpower Mob Plan - POB Chart Data Table & Visibility
Frozen for a defect exam: description as it was before 2026-09-29T10:59 (Jira changelog version of 2026-09-24T09:01, Jira wiki markup; 0 later edits not included), comments written before 2026-09-29T10:59 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* toggle the Data Table view of the POB Chart, hide/show specific graph lines, and inspect row data
*So that* I can examine detailed daily numeric values, focus on specific trends, and manage graph entries.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Manpower Mob Plan Item* or *View Active Manpower Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.

----

*Data Source*

* *Data Table Rows*: Sourced dynamically from configured graph definitions and daily timeline series values, displaying row attributes: checkbox state, line style indicator, graph Name, and day-by-day integer values across the shutdown schedule date range.

----

*Acceptance Criteria*

# *Hide Table Toggle & Layout*:
## *Chart Header Controls & Order*: The chart header must display three controls, right-aligned, in this left-to-right order: the *Hide Table* toggle (toggle switch placed to the left of its label), the *Export Chart* button (outlined style), and the *Add Data* button (solid primary style with a ⊕ icon).
## *Default Display State (Show Table)*: The default state of the *Hide Table* toggle must be *OFF*, meaning the Data Table is displayed directly beneath the chart by default (Show Table). Activating the toggle (*ON*) must collapse and hide the Data Table.
## *Empty State Guardrail*: When no graphs have been configured for the plan (empty state), the *Hide Table* toggle must be strictly *disabled* (greyed out), and the Data Table is not rendered.
## *Legend Visibility*: The chart legend is shown *only while the Data Table is hidden*. When *Hide Table* is OFF and the table is visible, no legend is drawn below the chart. When *Hide Table* is ON, the legend appears below the chart and lists every currently checked Data Group.
## *Non-Persistent Toggle State*: The *Hide Table* toggle state is strictly non-persistent and must not be saved to the database. Whenever a user logs into the system, reloads, or accesses the page, the chart must always initialize in its default state with the Data Table shown (*Hide Table* toggle set to *OFF*).
## *Data Table Layout & Synchronized Horizontal Scroll*: The table must render each configured Data Group as a row, with columns representing the shutdown schedule dates and cells displaying their corresponding daily numeric values. The date columns of the Data Table must align one-to-one with the dates along the chart's X-axis, located directly beneath each matching data point. When the timeline date range exceeds the visible container width, the chart canvas and the Data Table must support bidirectional horizontal scrolling synchronized in lockstep (scrolling horizontally on either the chart or the table simultaneously scrolls both), while the chart's Y-axis labels and the table's left-side "Data" column remain sticky / pinned.
# *Checkbox Visibility & Dynamic Recalculation*:
## *Row Checkbox Control*: Each Data Group row in the Data Table must include a checkbox next to the data group name. All row checkboxes are checked when the page is opened. The table header must not contain a master "Select All" checkbox — rows are checked and unchecked individually only.
## *Dynamic Chart Removal*: Unchecking a row's checkbox must immediately remove that specific graph line from the POB Chart.
## *Dynamic Y-Axis Scaling*: When a line is hidden via unchecking, the chart's Y-axis scale must automatically and immediately recalculate to fit only the remaining visible graph lines.
## *Legend Synchronization*: Unchecking a row must remove that data group's item from the chart legend; rechecking the checkbox restores the line, recalculates the scale, and restores the legend item.
## *Non-Destructive Action & Non-Persistent Selection State*: Unchecking a line only affects visibility on the screen during the active user session and must not delete or modify the saved database configuration of the graph. The checked/unchecked selection state is strictly non-persistent and must not be saved to the database; whenever a user logs into the system, reloads, or accesses the page, the system must always restore all row checkboxes to the checked state.
## *Default State of a Newly Added Data Group*: When a Data Group is added, its row checkbox must default to checked, and its line must appear on the chart straight away. The new row is placed at the bottom of the table.
## *Deselect All Behavior*: When all row checkboxes are unchecked:
### The chart area above displays only the default coordinate axes (X-axis timeline date range, Y-axis default scale {{0–100}}) with no plotted lines and no legend entries.
### The Data Table remains visible beneath the chart with all rows displayed and checkboxes unchecked.
### The header *Export Chart* button is disabled due to zero data displaying, while the *Hide Table* toggle remains enabled.
# *Row Hover, Selection & Context Menu*:
## *Row Hover Highlight*: Hovering the mouse cursor over any row in the Data Table must temporarily highlight that row.
## *Row Click Selection (Persistent Highlight)*: Clicking a row must permanently highlight that row until the user clicks the same row again (to toggle off selection) or clicks another row (to shift the persistent highlight).
## *Right-Click Context Menu*: For users holding the *Edit POB Chart* permission, right-clicking any row in the Data Table must display a context menu providing *Edit* and *Delete* options. For users without this permission, right-clicking produces no context menu at all (hidden per AC 4.2).
# *Role & Permission Access Guardrails*:
## *View-Only Access*: Users possessing {{View All Manpower Mob Plan Item}} or {{View Active Manpower Mob Plan Item}} permissions can view the Data Table, toggle *Hide Table*, check and uncheck row checkboxes, and use *Export Chart*. They cannot see the *Add Data* button and get no right-click context menu.
## *Modification Restriction*: Right-clicking a Data Table row must open the context menu *only* for users holding the *Edit POB Chart* permission. For all other users, right-clicking a row must produce *no context menu at all* (hidden).
# *Transaction Lifecycle & Concurrency*:
## *Immediate Commit*: Adding, editing, or deleting a Data Group writes to the database immediately and independently of the page-level *Save* button. Toggling *Hide Table* and checking or unchecking rows likewise store nothing and must not affect the *Save* button.
## *Concurrent Users*: Changes made by one user are not pushed live. A user sees the new state after a reload or when they perform their own Add, Edit, or Delete. When two users modify the same Data Group, the later write is kept.

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=1136-308198&t=mAn5PM0DP0MhFRi7-4]
* *Design System*: Standard PTTEP toggles and data grid styling.

----

## Comments (before 2026-09-29T10:59)

(none)

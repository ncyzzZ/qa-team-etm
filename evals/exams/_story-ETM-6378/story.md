# ETM-6378 Manpower Mob Plan - POB Chart Visualization
Frozen for a defect exam: description as it was before 2026-09-25T17:14 (Jira changelog version of 2026-09-24T09:04, Jira wiki markup; 2 later edits not included), comments written before 2026-09-25T17:14 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* view a dynamic POB Chart below the manpower schedule
*So that* I can visualize personnel movement, onboard totals, and capacity constraints over the shutdown timeline.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Manpower Mob Plan Item* or *View Active Manpower Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.

----

*Data Source*

* *POB Chart Data*: Sourced from configured graph metrics saved for the active Manpower Mob Plan in the database, plotting daily time-series values across the shutdown schedule timeline (Constant values, POB Movement, POB Onboard, Manpower Mobilization, and Manpower Demobilization totals).

----

*Acceptance Criteria*

# *Chart Component Placement & Header*:
## *Chart Location*: The system must render the POB Chart component directly beneath the main Schedule Grid and Table section within the Manpower Mob Plan tab.
## *Global Visibility*: The chart and its configured graphs must be visible to all users accessing the specific Manpower Mob Plan, acting as a shared project view.
## *Chart Header Controls & Order*: The chart header must display the title *POB Chart* on the left, and three action controls right-aligned in this exact left-to-right order: the *Hide Table* toggle (toggle switch placed to the left of its label), the *Export Chart* button (outlined style), and the *Add Data* button (solid primary style with a ⊕ icon). Individual button interactions and states are defined in [ETM-6379|https://pttep.atlassian.net/browse/ETM-6379] (Hide Table), [ETM-6380|https://pttep.atlassian.net/browse/ETM-6380] (Export Chart), and [ETM-6381|https://pttep.atlassian.net/browse/ETM-6381] (Add Data).
# *Graph Rendering & Scalability*:
## *Graph Overlay Limit*: The chart must support rendering up to a maximum of 10 individual graphs simultaneously.
## *Dynamic Legend Synchronization*: The chart must display a legend at the bottom mapping each active (checked) data group's name, line style, and color to the corresponding graph. When a data group is unchecked in the Data Table, its corresponding legend entry must disappear.
## *Dynamic Y-Axis Scaling*: The Y-axis of the chart must automatically and dynamically scale its range to accommodate the highest and lowest values present across currently visible (checked) graphs.
## *Negative Value Support*: The chart scale and rendering logic must explicitly support plotting negative integers.
## *Horizontal Timeline & Synchronized Scroll*: When the timeline date range exceeds the visible container width, the chart canvas supports horizontal scrolling. The chart canvas and the Data Table beneath must scroll horizontally in lockstep, keeping X-axis date points and table date columns strictly aligned, while the Y-axis remains sticky on the left.
# *Data Source Integration (Read-Only View) & Display States*:
## *Graph Presentation*: The chart must accurately plot values across the schedule timeline based on the configurations saved in the database (e.g., Constants, POB Movement, POB Onboard).
## *Empty State (No Data Configured)*: When no graphs have been configured for the active plan (or all graphs have been deleted), the POB Chart component must render in an empty state displaying centered placeholder text: *No data available.* (no axes, no chart grid lines, and no Data Table rendered beneath). In this state, the header *Hide Table* toggle and *Export Chart* button must be strictly *disabled* (greyed out).
## *Deselect All State (All Graphs Unchecked)*: When graphs exist in the Data Table but all row checkboxes are unchecked (0 lines visible):
### *Chart Axes Rendering*: The chart area must render only the coordinate axes and grid lines with default scaling:
* *Horizontal X-Axis*: Fixed timeline date range ({{Earliest Task Start Date - 7 days}} to {{Latest Task End Date + 7 days}}).
* *Vertical Y-Axis*: Fixed default scale ranging from *`0` to `100`* (step 10).
### *Legend State*: The chart legend must be hidden / empty (no legend entries displayed).
### *Data Table State*: The Data Table remains rendered directly beneath the chart with all rows visible and unchecked.
### *Header Control States*: The *Hide Table* toggle remains *enabled* (functional), while the *Export Chart* button is strictly *disabled* (as no graph data is displaying).

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=1114-301219&t=mAn5PM0DP0MhFRi7-4]
* *Design System*: Follow PTTEP standard charting components and color palettes.

----

## Comments (before 2026-09-25T17:14)

- 2026-09-25T10:09 (QA): Cannot test yet; waiting for dev to plug the parts together.

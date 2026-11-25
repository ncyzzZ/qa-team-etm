# ETM-5615 Manpower Mob Plan - Multi-Criteria Grid Filtering
Frozen for a defect exam: description as it was before 2026-09-23T13:24 (Jira changelog version of 2026-09-22T22:01, Jira wiki markup; 6 later edits not included), comments written before 2026-09-23T13:24 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* filter the Manpower Mob Plan grid using a dedicated Filter Panel side panel across all personnel attributes and travel logistics
*So that* I can isolate specific workers, contracting companies, transportation routes, shift assignments, and travel dates in both table and schedule panes.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Manpower Mob Plan Item* or *View Active Manpower Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.

----

*Data Source*

* *Filter Fields*: Sourced dynamically from personnel records across 16 criteria matching the table columns: {{Name}}, {{Company}}, {{Department}}, {{Resource Type}}, {{Accommodation}}, {{D/N Shift}}, {{Hot Bed}}, {{Mob Date}}, {{Onboard Date}}, {{Demob Date}}, {{Transportation (Mob)}}, {{Route No. (Mob)}}, {{Transportation (Demob)}}, {{Route No. (Demob)}}, {{Dlog Status}}, and {{Booking No.}}.

----

*Acceptance Criteria*

*0. User Review Updates*:

* No specific permission for filter, If a user has permission to see the page, he sees the filter. However, only users with *Edit Manpower Mob Plan* permission will see the save button and able to save filter globally.

* Dropdowns Sort A-Z (Dictionary Style).

* Empty State: If all applied filters result in zero matching records, the grid must display the empty state message: *No data available*.

* Date boundary is same as schedule section. See detail in ETM-5837 (Earliest Task Start - 7 days to Latest Task End + 7 days).

# *Filter Panel Side Panel Structure & Toolbar Trigger*:
## *Panel Trigger & Placement*: Clicking the *Filter* icon (*🝖*) (located on the right side of the inner grid toolbar, adjacent to the Custom View icon) toggles the right-side *Filter Panel* open or closed.
## *Mutually Exclusive Panels*: The right-side panels (Filter, Custom View, Set Route) are mutually exclusive. Opening one will automatically close any currently active panel.
## *Header Controls*: The panel header displays the title *Filter Panel* on the left and a *Reset* action link on the right.
## *Accordion Section Layout*: Each of the 16 filterable fields is organized inside a dedicated collapsible accordion section with an expand/collapse toggle chevron ({{^}} / {{v}}).
## *Default Section State*: Upon initial panel open, the *Name* section is expanded by default while all other 15 filter sections are collapsed.
# *Categorical & Text Filter Field Behaviors (Searchable Multi-Select Lists)*:
## *State Persistence*: The filter state is *Global* and shared across all users for the active Manpower Mob Plan (similar to Custom View).
## *Common Multi-Select Structure*: Each categorical and text filter accordion contains an inline search input with a magnifying glass ({{Search}}), a *Select All* checkbox (with an indeterminate {{-}} state when partially selected), and individual value checkboxes:
### *Data Source & Dynamic Options*:
##* *Dropdown / Enum Fields*: Even for dropdown/enum fields (e.g., {{Resource Type}}, {{Accommodation}}, {{D/N Shift}}, {{Hot Bed}}, {{Transportation}}), the filter options must display only distinct values present in the active plan's existing personnel data (not unutilized system options), sorted according to their predefined dropdown selection order.
##* *Free-Text Fields*: Text fields dynamically display distinct values found in the active plan's existing personnel data, sorted A-Z (Dictionary Style).
##* *Blank Handling*: For all filter fields (categorical, text, and enum), a *(Blank)* option checkbox must be included directly below *Select All* if and only if there is blank/null data in any personnel row for that field. If no rows contain blank data for that field, the *(Blank)* option must not be displayed.
### *Refresh Behavior*: The available options list in each filter section refreshes to reflect current data whenever the Filter Panel is closed and reopened.
### *Name*: Checkboxes of distinct personnel names. Sort A-Z (Dictionary Style). Includes a *(Blank)* checkbox if there is blank data in any row.
### *Company*: Checkboxes of distinct contracting companies (sorted A-Z) including a *(Blank)* checkbox.
### *Department*: Checkboxes of distinct departments (sorted A-Z) including a *(Blank)* checkbox.
### *Resource Type*: Checkboxes for distinct Resource Types present in the active plan ({{Organic Crew}}, {{Extra Turnaround}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *Accommodation*: Checkboxes for distinct accommodations present in the active plan ({{LQ}}, {{Barge}}, {{FSO}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *D/N Shift*: Checkboxes for distinct shift assignments present in the active plan ({{Day}}, {{Night}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *Hot Bed*: Checkboxes for distinct bed sharing options present in the active plan ({{Yes}}, {{No}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *Transportation (Mob)*: Checkboxes for distinct mobilization transport modes present in the active plan ({{Helicopter}}, {{MSB}}, {{Vessel}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *Route No. (Mob)*: Checkboxes for distinct mobilization route numbers including a *(Blank)* checkbox. This list is independent of Route No. (Demob).
### *Transportation (Demob)*: Checkboxes for distinct demobilization transport modes present in the active plan ({{Helicopter}}, {{MSB}}, {{Vessel}}), sorted by predefined dropdown selection order. Includes a *(Blank)* checkbox if there is blank data in any row.
### *Route No. (Demob)*: Checkboxes for distinct demobilization route numbers including a *(Blank)* checkbox.
### *Dlog Status*: Checkboxes for distinct digital logistics statuses including a *(Blank)* checkbox.
### *Booking No.*: Checkboxes for distinct booking numbers including a *(Blank)* checkbox.
## *Default Selection*: By default, all checkboxes are checked. If a user unchecks all boxes (0 selected), it means no rows will be displayed for that criteria (0 rows).
## *In-Filter Search Filtering*: Entering text in the *Search* input dynamically filters the visible checkboxes within that specific accordion section. The search is case-insensitive, uses substring matching, and trims leading/trailing spaces.
## *Select All Toggle*: Checking or unchecking *Select All* toggles all checkboxes in that section simultaneously, including those currently hidden by the in-filter search.
# *Date Filter Field Behaviors (Single Date & Date Range Pickers)*:
## *Mob Date*: Contains a single calendar date picker input labeled *Date* ({{DD Mon YYYY}}) with a calendar search icon; filters personnel whose {{Mob Date}} matches the selected date.
## *Onboard Date (Date Range)*: Contains two calendar date picker inputs labeled *From* and *To* ({{DD Mon YYYY}}); filters personnel whose active offshore stay overlaps the selected date window.
### *Overlap Definition*: The offshore stay period is strictly defined as {{[Onboard Date, Demob Date - 1 day]}} (the demob day is not counted as being on the platform).
### *Range Logic*:
* Providing both dates filters overlapping records.
* Providing only *From* filters records active from that date onwards.
* Providing only *To* filters records active up to that date.
* If *From* is chronologically after *To*, a red validation error border is displayed only, with no text message.
* If both are empty, no filtering is applied.
## *Demob Date*: Contains a single calendar date picker input labeled *Date* ({{DD Mon YYYY}}) with a calendar search icon; filters personnel whose {{Demob Date}} matches the selected date.
# *Real-Time Grid Filtering & Reset Action*:
## *Instant Real-Time Filtering*: Toggling any checkbox, clearing an option, or selecting a date immediately filters matching personnel rows across both the Left Table Pane and the Right Schedule Pane simultaneously without requiring an explicit "Apply" button.
## *Row Visibility & Empty States*:
### If filtering results in zero personnel inside a Resource Category, the empty Resource Category header row is automatically hidden.
### However, empty Mob Route and Demob Route timeline rows remain visible on the schedule even if no personnel are displayed.
### If the grid returns zero total results across all categories, the empty state behavior is pending UI design.
## *Static POB & Dependencies*:
### Grid filtering exclusively affects individual personnel rows.
### The daily category total POB summation in category headers, the snapshotted *Required Manpower* headcount rows, and the main *POB Chart* at the bottom of the page remain static and are not affected by grid filters.
### *Saving Data*: When a user saves the plan while a filter is active, the system saves the entire grid dataset (including all hidden rows), preventing data loss.
## *Reset Action*: Clicking *Reset* in the panel header clears all search inputs, checks all checkboxes (Select All active across all sections), clears all date picker inputs, and immediately restores full visibility of all rows locally. The user must click the page-level Save button to publish this cleared state to the team.
## *Active Filter Indicator*: When one or more filter fields deviate from their default state, the *Filter* icon (*🝖*) on the grid toolbar displays a *Blue Dot* as an active visual indicator. If a saved global filter is active upon opening the page, the Blue Dot is displayed immediately. When filters are cleared, the dot disappears.

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=230-490779&t=vOquosWpB8aG4rpN-4]
* *Design System*: Built using PTTEP Nualta Side Panel, Accordion, and Multi-Select Checkbox components.

----

## Comments (before 2026-09-23T13:24)

(none; only Jira Automation notices)

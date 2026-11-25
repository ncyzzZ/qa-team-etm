# ETM-6396 Manpower Mob Plan - Export Plan to Excel
Frozen for a defect exam: description as it was before 2026-09-30T10:30 (Jira changelog version of 2026-09-24T10:00, Jira wiki markup; 4 later edits not included), comments written before 2026-09-30T10:30 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* export the active Manpower Mob Plan into a structured Excel spreadsheet (.xlsx)
*So that* I can share personnel logistics, transport schedules, and daily onboard counts offline with offshore logistics teams, operations, and contractors.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Export Manpower Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.
* The active Manpower Mob Plan contains at least one saved resource or personnel record.

----

*Data Source*

* *Plan & Event Metadata*: Active Shutdown Event ({{Shutdown Event Name}}, {{Start Event Date}}, {{End Event Date}}) and Turnaround Plan Card ({{Plan Name}}).
* *Personnel Dataset*: Active Manpower Mob Plan personnel rows across 16 fixed attributes: {{Name}}, {{Company}}, {{Department}}, {{Resource Type}}, {{Accommodation}}, {{D/N Shift}}, {{Hot Bed}}, {{Transportation}} (Mob), {{Mob Date}}, {{Route No.}} (Mob), {{Onboard Date}}, {{Transportation}} (Demob), {{Demob Date}}, {{Route No.}} (Demob), {{Dlog Status}}, and {{Booking No.}}.
* *Transport Route Records*: Scheduled route capacities grouped by mode ({{Helicopter}}, {{MSB}}, {{Vessel}}) for Mobilization and Demobilization.
* *Export Specification & Canonical Template*: [Manpower_Mob_Plan_Export_Template_V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Manpower%20Mob%20Plan/Manpower_Mob_Plan_Export_Template_V2.xlsx?d=w0b90109739d14939bfbfa4a4b7f01c13&csf=1&web=1&e=vP9D99].
* *File Naming*: {{[ShutdownEventName]_[PlanName]_ManpowerMobPlan_[YYYYMMDD].xlsx}}

----

*Acceptance Criteria*

# *Export Action Trigger & Permission Enforcement*:
## *Toolbar Button Placement*: The system must provide an *[ Export ]* button on the top-right toolbar of the Manpower Mob Plan page (adjacent to the *Table / Split View* and *Filter* icons).
## *Permission Guard*: The *[ Export ]* button is strictly visible and actionable only for users possessing the *Export Manpower Mob Plan* permission (possessed by Turnaround Manager and Job Owner). For users without this permission, the button must be strictly hidden.
## *Empty State Handling*: If the Manpower Mob Plan contains no saved resources (empty state), the *[ Export ]* button must be disabled (greyed out and unclickable).
## *Persisted Data Scope*: The export engine must export only persisted (saved) database records; unsaved draft edits on screen must not be included.
## *Filter Independence*: The export engine must strictly ignore any active Grid Filters and always export the full dataset of the active plan.
# *File Naming Convention & Worksheet Structure*:
## *Dynamic File Naming*: The exported workbook must download directly to the user's browser with the filename formatted as:
{{"[ShutdownEventName]_[PlanName]_ManpowerMobPlan_[YYYYMMDD].xlsx"}}
where {{YYYYMMDD}} is the local export generation date.
## *Prohibited Character Sanitization*: Any invalid filename characters ({{\}}, {{/}}, {{:}}, {{*}}, {{?}}, {{"}}, {{<}}, {{>}}, {{|}}) present in {{[ShutdownEventName]}} or {{[PlanName]}} must be automatically replaced with a single space ({{' '}}).
## *Worksheet Tab Name*: The primary worksheet tab inside the exported {{.xlsx}} workbook must be named {{Manpower Mob Plan}} (matching the template).
# *Timeline Boundary & Date Period Range*:
## *Timeline Boundary*: The horizontal date columns in Excel must cover the exact timeline window displayed in the application:
* *Start Date*: Calculated as {{Earliest Task Start Date - 7 days}}.
* *End Date*: Calculated as {{Latest Task End Date + 7 days}}.
## *Date Header Hierarchy*:
### *Month/Year Row*: Merged banner header showing Month and 4-digit Year (e.g., {{Mar 2025}}, {{Apr 2025}}) styled with a *steel blue* background and *bold white* text.
### *Daily Date Row*: Sequential columns showing day number only (e.g., {{3}}, {{4}}, {{5}}, ..., {{31}}, {{1}}, {{2}}, {{3}}), representing the day of the month as an integer/number matching the UI timeline layout, styled with a *steel blue* background and *bold white* text.
## *Weekend Highlighting*: Saturday and Sunday columns must render with a *soft gray-blue* background shading across all timeline date rows to visually segment weeks. Non-weekend timeline cells in header route rows render with a *light gray-blue* background.
# *Left-Side Column Structure (16 Fixed Columns)*:
## *Sorting*: The export must sort all rows exactly as they are currently displayed and sorted in the application UI grid.
## *Header Styling*:
### *Plan Title Banner*: Merged banner row across columns A through P and all date columns showing {{Manpower Mob Plan: [Plan Name]}}, styled with a *dark navy blue* background and *bold white* text.
### *Column Headers*: Left column headers across Rows 2 and 3 are styled with a *steel blue* background and *bold white* text.
## *Column Sequence & Format*:
### *Name*: Text
### *Company*: Text
### *Department*: Text
### *Resource Type*: Text
### *Accommodation*: Text
### *D/N Shift*: Text
### *Hot Bed*: Text
### *Transportation*: Text
### *Mob Date*: Date (DD-Mon-YYYY)
### *Route No.*: Text
### *Onboard Date*: Date (DD-Mon-YYYY)
### *Transportation*: Text
### *Demob Date*: Date (DD-Mon-YYYY)
### *Route No.*: Text
### *Dlog Status*: Text
### *Booking No.*: Text
## *Blank Value Handling*: Any optional field without data in the database must be rendered as an empty blank cell (not {{null}} or {{undefined}}).
# *Transport Route & Category Header Rows (Aligned with UI Layout)*:
## *`Mob Route` Header & Mode Rows (UI Sticky Rows)*: Positioned directly beneath the calendar date headers:
### *Header Row*: Left columns A–P merged into a single label cell showing {{MOB ROUTE (Capacity per Day)}} styled with a *dark green* background and *bold white* text.
### *Transport Mode Rows*: Three dedicated sub-rows for {{Helicopter}}, {{MSB}}, and {{Vessel}} (each with left columns A–P merged), styled with a *mint green* background and regular *black* text. In each date column, populate the cell with the scheduled mobilization route capacity for that transport mode (blank if no route is scheduled).
## *`Demob Route` Header & Mode Rows (UI Sticky Rows)*:
### *Header Row*: Left columns A–P merged into a single label cell showing {{DEMOB ROUTE (Capacity per Day)}} styled with a *warm orange* background and *bold white* text.
### *Transport Mode Rows*: Three dedicated sub-rows for {{Helicopter}}, {{MSB}}, and {{Vessel}} (each with left columns A–P merged), styled with a *light cream* background and regular *black* text. In each date column, populate the cell with the scheduled demobilization route capacity for that transport mode (blank if no route is scheduled).
## *Trade Discipline Category Rows*: Each trade category header row (e.g., {{MECHANICAL}}, {{ELECTRICAL}}, {{INSTRUMENT}}) mirrors the UI category header:
### *Left Columns (A–P Merged)*: Displays the category trade discipline name in *bold white* text on a *steel blue* background.
### *Timeline Date Columns*: Displays the dynamic *Category POB Sum* (total headcount of active personnel in this category onboard on that date: {{Onboard Date <= Date < Demob Date}}), styled with *bold white* text on the *steel blue* background. Cells with zero headcount are left completely blank.
## *Required Manpower Sub-Row*: Directly beneath each snapshotted Resource category header, a dedicated sub-row mirrors the UI Required Manpower display:
### *Left Columns (A–P Merged)*: Displays the label {{  Required Manpower}} on a *light gray* background with *bold white* text.
### *Timeline Date Columns*: Populated with the peak utilized headcount sourced from the Shutdown Logic schedule on a *light gray* background with *bold white* text. If on any date {{d}} the category POB is in deficit ({{POB < Required Manpower}}), the required headcount number must render in *red font* to visually flag an under-manned condition (matching UI behavior).
# *Personnel Schedule Timeline Mapping (Active Onboard Presence)*:
## *Active Stay Value (`1`)*: For each personnel row, on all consecutive days starting from their designated *Onboard Date* through the day before Demob Date (*Demob Date - 1*), the timeline cell displays the numeric integer value *`1`* styled with *dark green font* on a *mint green* background.
## *Demob Date & Departure Day*: On the designated *Demob Date*, the timeline cell is left blank (not counted in offshore presence, as demobilization departs offshore).
## *Mob Date & Travel Day*: On the designated *Mob Date* (if prior to Onboard Date), the timeline cell is left blank (as personnel are in transit and not yet arrived offshore).
## *No Text Badges*: The timeline cells strictly contain no text markers or letter badges (no {{M}}, {{O}}, or {{D}} characters).
## *Non-Active Days Blanking*: All calendar date cells outside the active onboard period ({{[Onboard Date, Demob Date - 1]}}) must be rendered completely blank with standard grid lines (with *soft gray-blue* background shading on weekend columns).
# *POB Chart Graph Data Rows (Appended at Bottom)*:
## *Placement*: Following the last personnel data row, the export engine must append a *POB Chart Data* section at the very bottom of the worksheet, mirroring the Data Table of the application's POB Chart component (per [ETM-6378|https://pttep.atlassian.net/browse/ETM-6378] and [ETM-6379|https://pttep.atlassian.net/browse/ETM-6379]).
## *Empty POB Chart Omission*: If no POB Chart graphs have been configured for the active plan, this entire section (spacer + header + graph rows) must be *omitted entirely* from the export output.
## *Section Header Row*:
### *Label*: {{POB CHART DATA}}
### *Span*: The header must span the full sheet width — left columns A–P merged into a single cell, continuing across all timeline date columns.
### *Styling*: *Dark navy blue* background with *bold white* text.
## *Graph Data Rows* (one row per configured POB Chart graph, in Data Table order):
### *Left-Column Label (A–P merged)*: Displays the graph {{Name}} in regular *black* text on a *white* background.
### *Timeline Date Columns*: Each date cell contains the computed integer value for that graph on that date in *black* text on a *white* background. *Cells with a zero value or no applicable value must be left blank* (never write {{0}}).
### *Row Order*: Graphs are written in the same order as they appear in the application's POB Chart Data Table.
## *Graph Value Calculation Rules*:
### *Constant*: The graph's configured integer {{Value}} is written to every date column across the full timeline (flat line).
### *POB Onboard* (Summary): For each date, count all personnel where {{Onboard Date ≤ Date < Demob Date}}, filtered by the graph's {{Resource Type}}, {{Accom.}}, {{D/N Shift}}, and {{Hot Bed}} criteria.
### *POB Movement* (Summary): For each date, compute {{(count of Mob Dates = Date) − (count of Demob Dates = Date)}}, filtered by graph criteria. Write blank if the net result is {{0}}.
### *Manpower Mobilization* (Summary): For each date, count all personnel where {{Mob Date = Date}}, filtered by graph criteria. Write blank if the count is {{0}}.
### *Manpower Demobilization* (Summary): For each date, count all personnel where {{Demob Date = Date}} (plotted as positive), filtered by graph criteria. Write blank if the count is {{0}}.
## *Export Scope*: Graph rows are always exported based on the full persisted dataset, regardless of the checked/unchecked visibility state of rows in the UI's Data Table.

----

*UI Design*

* *Reference Mockup*: [Link to Figma - Mob Demob Plan|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=230-490779&t=vOquosWpB8aG4rpN-4]
* *Design System*: PTTEP standard toolbar export icon button and file download response handling.

## Comments (before 2026-09-30T10:30)

(none)

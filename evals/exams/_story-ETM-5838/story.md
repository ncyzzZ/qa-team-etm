# ETM-5838 Manpower Mob Plan - Add Routine & Non-Routine Transport Routes
Frozen for a defect exam: description as it was before 2026-09-14T16:56 (Jira changelog version of 2026-09-09T17:24, Jira wiki markup; 3 later edits not included), comments written before 2026-09-14T16:56 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* add routine weekly and non-routine ad-hoc transport routes in the Set Route side panel
*So that* logistics transport vehicles and passenger seat quotas are registered for mobilization and demobilization.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Manpower Mob Plan* or *Edit Route* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page.

----

*Data Source*

* *Transport Modes*: {{Helicopter}} (Default Capacity = 12), {{MSB}} (Default Capacity = 30), {{Vessel}} (Default Capacity = 70).
* *Locations*: Ordered alphabetically in ascending sequence: {{AC}} (shortened from Accommodation), {{Field of Asset}} (dynamically derived from active Shutdown Event), {{SKL}}.

----

*Acceptance Criteria*

# *Set Route Side Panel Trigger*:
## Clicking *[ 📅 Set Route ]* on the header toolbar opens the *Set Route* side panel on the right.
## Contains two configuration tables: *Routine Route* and *Non-Routine Route*, each with an independent *+ Add Route* button.
# *Adding Routine Route (Weekly Cadence)*:
## Clicking *+ Add Route* in Routine Route appends a new blank row.
## *Recurrence Cadence*: Weekly cadence only by Day of Week ({{Monday}} through {{Sunday}}).
## *Maximum Limit*: Maximum of 10 routes per day for routine routes.
## *Field Input Types*:
* {{* Transportation Type}}: Dropdown list {{[Helicopter, MSB, Vessel]}}.
* {{* Day}}: Dropdown list {{[Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]}}.
* {{* Mob/Demob}}: Dropdown list {{[Mob, Demob]}}.
* {{* Origin}} & {{* Destination}}: Dropdown list sorted in *alphabetical ascending order*: {{[Accommodation, [Field of Asset], SKL]}}. In the route panel display, Accommodation is displayed as "AC" (except within these specific Origin/Destination dropdown selections).
* {{* Capacity}}: Numeric input field (Integer >= 0).
* {{Route No.}}: Optional free-text input (Max 50 characters).
## *Default Capacity Autofill*: Selecting a transportation type autofills its standard capacity ({{12}} for Helicopter, {{30}} for MSB, {{70}} for Vessel; editable).
# *Adding Non-Routine Route (Ad-Hoc Dates)*:
## Clicking *+ Add Route* in Non-Routine Route appends a new blank row with a specific calendar Date picker ({{DD Mon YYYY}}).
## *Maximum Limit*: Maximum of 30 routes per date for non-routine routes.
## *Field Input Types*:
* {{* Transportation Type}}: Dropdown list {{[Helicopter, MSB, Vessel]}}.
* {{* Date}}: Calendar date picker ({{DD Mon YYYY}}).
* {{* Mob/Demob}}: Dropdown list {{[Mob, Demob]}}.
* {{* Origin}} & {{* Destination}}: Dropdown list sorted in *alphabetical ascending order*: {{[Accommodation, [Field of Asset], SKL]}}. In the route panel display, Accommodation is displayed as "AC" (except within these specific Origin/Destination dropdown selections).
* {{* Capacity}}: Numeric input field (Integer >= 0).
* {{Route No.}}: Optional free-text input (Max 50 characters).
# *Mob/Demob Classification Independence Rule*:
## *Strict Direction Independence*: Route classification as Mobilization or Demobilization is strictly governed by the *Mob/Demob* dropdown. *Origin* and *Destination* are independent location descriptors and have no bearing on {{Mob/Demob}}.
# *Direct Database Persistence & Decoupled Save Lifecycle*:
## *Direct DB Commit on Side Panel Save*: Clicking *Save* within the Set Route side panel immediately persists all newly added or modified route configurations directly to the database.
## *Independence from Primary Save*: Route additions do not stage into volatile draft memory and operate independently of the primary page-level *Save* button (which exclusively governs personnel roster, travel date, and bed reservation edits in the grid).
## *Immediate Timeline Recalculation*: Upon database commit, the schedule timeline immediately recalculates and updates the aggregated capacity pill badges in the sticky *Mob Route* and *Demob Route* header rows.

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=250-108105&t=vOquosWpB8aG4rpN-4]
* *Design System*: Built using PTTEP Nualta Side Panel and Form components.

----

## Comments (before 2026-09-14T16:56)

(none)

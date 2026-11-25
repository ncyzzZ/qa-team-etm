# ETM-5836 Manpower Mob Plan - Add & Delete Personnel (Personnel Roster)
Frozen for a defect exam: description as it was before 2026-09-16T08:46 (Jira changelog version of 2026-09-15T13:39, Jira wiki markup; 2 later edits not included), comments written before 2026-09-16T08:46 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* add and delete individual personnel under a specific Resource category
*So that* I can roster named workers with mandatory field assignments and configure their logistics attributes.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Manpower Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Manpower Mob Plan* dashboard page with at least one resource category row available.

----

*Data Source*

* *Personnel Dataset*: Client-side draft entries and manual field inputs adhering to [ETM-5616|https://pttep.atlassian.net/browse/ETM-5616] data schema ({{Name}}, {{Company}}, {{Department}}, {{Accommodation}}, {{D/N Shift}}, {{Hot Bed}}, {{Mob Transportation}}, {{Mob Date}}, {{Mob Route No.}}, {{Demob Transportation}}, {{Demob Date}}, {{Demob Route No.}}, {{Dlog Status}}, {{Booking No.}}).

----

*Acceptance Criteria*

# *Adding Personnel Under a Specific Resource Category*:
## *Inline Add Personnel Trigger*: An inline *+ Add Personnel* button is displayed directly in the Resource category row.
## *Immediate Row Insertion*: Clicking *+ Add Personnel* immediately inserts a new blank personnel row directly under that specific category without opening a modal.
# *Personnel Fields & Mandatory Validation*:
## *Personnel Name (Mandatory `*`)*:
### *Manual Entry*: Manual text entry up to 256 characters with no auto-complete suggestions.
### *Mandatory Validation*: The row cannot be saved if *Name* is blank.
## *Mandatory Dropdown Fields*:
### *Accommodation (Mandatory `*`)*: Dropdown list with options {{[LQ, Barge, FSO]}}. Cannot be saved empty.
### *D/N Shift (Mandatory `*`)*: Dropdown list with options {{[Day, Night]}}. Cannot be saved empty.
### *Hot Bed (Mandatory `*`)*: Dropdown list with options {{[Yes, No]}}. Defaults to {{No}} (permanent dedicated bed). Cannot be saved empty.
## *Optional Logistics & Detail Fields (per [ETM-5616](https://pttep.atlassian.net/browse/ETM-5616))*:
### *Free-Text Fields*: {{Company}} (Max 256), {{Department}} (Max 64), {{Mob Route No.}} (Max 30), {{Demob Route No.}} (Max 30), {{Booking No.}} (Max 30), and {{Dlog Status}} (Max 20).
### *Transportation Dropdowns*: {{Mob Transportation}} and {{Demob Transportation}} dropdown lists with options {{[Helicopter, MSB, Vessel]}}.
### *Date Pickers & Autofill*: {{Mob Date}} and {{Demob Date}} use a calendar date picker ({{DD Mon YYYY}}). When selecting {{Mob Transportation}} under a snapshotted Shutdown Logic resource, {{Mob Date}} and {{Demob Date}} are automatically autofilled if and only if both dates are currently blank (derived from the first and last Required Manpower dates per [ETM-5616|https://pttep.atlassian.net/browse/ETM-5616]).
### *Onboard Date*: Strictly view-only and automatically derived from {{Mob Transportation}} and {{Mob Date}} per [ETM-5616|https://pttep.atlassian.net/browse/ETM-5616].
# *Deleting Personnel*:
## *Delete Icon*: Hovering over any personnel row reveals a delete icon (*🗑️*).
## *Removal Behavior*: Clicking the delete icon immediately removes that worker row from the table and clears their presence bar from the schedule timeline in the working draft.
## *No Confirmation Needed*: Deleting personnel requires no confirmation modal, as changes do not apply to the database until clicking the primary *Save* button.

----

*UI Design*

* *Reference Mockup*: [Link to Figma|https://www.figma.com/design/hpClrd0OTljCF8w5pCI4ep/EMI---Turnaround--Mob-Demob-Plan-?node-id=230-491491&t=vOquosWpB8aG4rpN-4]
* *Design System*: Built using PTTEP Nualta Data Grid row action and inline editor components.

----

## Comments (before 2026-09-16T08:46)

(none)

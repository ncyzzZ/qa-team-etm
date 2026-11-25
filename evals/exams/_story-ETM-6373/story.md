# ETM-6373 Optimization Feedback Display Panel
Frozen for a defect exam: description as it was before 2026-10-09T09:53 (Jira changelog version of 2026-10-05T19:15, Jira wiki markup; 2 later edits not included), comments written before 2026-10-09T09:53 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* access a dedicated Optimization Feedback panel showing optimization success or failure states and initiate an export of error blocks
*So that* I can continuously monitor optimization results, diagnose data or capacity blockers preventing a successful schedule, and trigger error reporting.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Execute Optimization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *View Shutdown Logic* page (Gantt Chart view).
* An optimization run has been executed for the active Turnaround Plan.

----

*Data Source*

* *Optimizer Feedback Payload*: Optimizer JSON response containing success metrics ({{result.summary.status}}) or refusal/issue arrays ({{detail.errors[]}}, {{detail.blockers[]}}, or {{result.summary.infeasibility_hints[]}}).
* *Gantt Task Mapping*: Local Gantt chart table dataset used to map task UUIDs ({{task_id}}, {{task_ids}}, {{dropped_task_ids}}) to *No.* and *Job Description* columns.

----

*Acceptance Criteria*

# *Permanent Feedback Panel Access & Dual Outcome States*:
## *Toolbar Presence & Access Trigger*:
### *Initial State (Before First Run)*: Before running the first optimization on the page, there is no toolbar.
### *Appearance & Persistence*: After running an optimization, the toolbar appears containing the *"View Detail"* / *"View Diagnosis"* link (to open the right-side panel) and the *Save* button. This toolbar remains available until the user runs a new optimization.
### *Failed Optimization Behavior*: When optimization fails, the *Save* button is triggered to enable (normally, the user must save before running optimization, so the result is unchanged when optimization fails).
### *Cancelled Optimization Behavior*: If a user cancels optimization, whether it returns a result or not (as it is not the last completed result), the system must *not update the toolbar* (the toolbar state and results remain unchanged).
## *Automatic Open on Completion*: The panel does not open automatically.
## *Success State Display*: When optimization succeeds without blocking errors or infeasibility, the panel displays the *Summary* section (Duration, Gap, Schedule/Event dates) and the sent settings (*Optimization Setting*).
## *Failure State Display*: When optimization fails or encounters issues, the panel displays without a banner, presenting *Diagnosis* and *Optimization Setting* tabs, and renders the vertically stacked Feedback Blocks under the Diagnosis tab.
# *Feedback Block Header (Severity)*:
## *Severity Indicator*: The block must display the severity type as a coloured tag based on the severity field (e.g., *Error* in red, *Blocker* in orange).
## *Validation Error Default*: If the issue originates from the {{validate_input}} stage (which lacks a {{severity}} field), the system must default to displaying *error* as the severity.
## *Vertical Stacking*: The panel must iterate through the response arrays ({{detail.errors}}, {{detail.blockers}}, or {{result.summary.infeasibility_hints}}) and stack individual Feedback Blocks vertically.
## *Excluded Fields*: The system must intentionally ignore {{disclosures[]}}, critical-path drops, and NOT display the {{details}}, {{evidence}}, {{loc}}, or {{input}} fields from the JSON payload.
# *Main Message & Layout*:
## *Block Format*: Each feedback block must follow this exact display format and field mapping:
# *Affected Tasks Reference*:
## *UUID Mapping*: If {{task_ids}}, {{task_id}}, or {{dropped_task_ids}} are present, the system must map the raw UUIDs to the corresponding tasks in the local Gantt data.
## *Display Format*: The mapped tasks must be displayed at the bottom of the block as plain comma-separated text formatted exactly as {{"([No.]) [Job Description]"}}.
## *Full Label Display*: The displayed string ({{"([No.]) [Job Description]"}}) must display the full label without length truncation or ellipsis.
## *Navigation*: We do not have navigation feature.
# *Export Error Blocks Action Trigger*:
## *Export Button Presence*: The panel header contains an *Export* button.
## *Button State & Permissions*:
### *Permission Lock*: The button is strictly available to users possessing the *Execute Optimization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
### *Failure State (Errors Present)*: When optimization fails or contains error blocks, the *Export* button is enabled. Clicking *Export* triggers generation and download of the Excel spreadsheet per [ETM-6506|https://pttep.atlassian.net/browse/ETM-6506].
### *Success State (Zero Errors)*: When optimization succeeds with zero error blocks, the *Export* button is disabled and greyed out (or hidden).

----

*UI Design*

* *Reference Mockup*: [Link to Figma - Optimization Feedback|https://www.figma.com/design/4kxDnzxVKdxkaV56cj840w/EMI---Turnaround--Shutdown-Logic-?node-id=1719-1287417&t=imtBCMxgNsQKqrLy-4]
* *Design System*: Standard right-side panel drawer.

----

## Comments (before 2026-10-09T09:53)

(none)

# ETM-6506 Optimization Feedback Excel Export
Frozen for a defect exam: description as it was before 2026-10-15T21:02 (Jira changelog version of 2026-10-12T17:02, Jira wiki markup; 1 later edits not included), comments written before 2026-10-15T21:02 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* export optimization feedback error blocks into a structured Excel spreadsheet
*So that* I can share detailed blocker reports offline, conduct technical root-cause analyses, and archive optimization failure logs.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Execute Optimization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is inside the *Optimization Feedback* panel on the *View Shutdown Logic* page per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373].
* The latest optimization run has returned issues or error blocks ({{detail.errors[]}}, {{detail.blockers[]}}, or {{result.summary.infeasibility_hints[]}}).

----

*Data Source*

* *Export Master Template*: [Export Optimization Feedback.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20Logic/Export%20Optimization%20Feedback.xlsx?d=wcf143d9a65664dc0b48c4512f2d099cd&csf=1&web=1&e=20VLko] — Sheet: {{Optimization Feedback}}.
* *Optimizer Feedback Payload*: Error arrays from optimizer response ({{detail.errors[]}}, {{detail.blockers[]}}, or {{result.summary.infeasibility_hints[]}}) per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373].
* *Gantt Task Mapping*: Local Gantt chart table dataset mapping task UUIDs ({{task_id}}, {{task_ids}}, {{dropped_task_ids}}) to *No.* and *Job Description*.
* *Validation & Result Reference*: Export error handling patterns per [Planning Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Planning%20Validation%26Result.xlsx?d=wb8d523616eb64d788e04b08d4889c09c&csf=1&web=1&e=3w36vY].
* *Field Specification Table (Spreadsheet Columns A through F)*:

||Field Name||Column||Data Type||Required?||Nullable?||Default Value||Max Length / Value Range / Enum||Notes||
|Header|A|Text|Yes|No|—|Max 255 chars|Sourced from {{{detail.errors[i].headline}}}, {{{detail.blockers[i].headline}}}, or {{{result.summary.infeasibility_hints[i].headline}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]|
|Severity|B|Enum|Yes|No|{{error}}|{{error}}, {{blocker}}, {{suspect}}|Severity level in plain text ({{error}} for {{validate_input}} stage, or {{{detail.blockers[i].severity}}} / {{{result.summary.infeasibility_hints[i].severity}}})|
|Message|C|Text|Yes|No|—|—|Full descriptive error/blocker/hint explanation text sourced from {{{detail.errors[i].message}}}, {{{detail.blockers[i].message}}}, or {{{result.summary.infeasibility_hints[i].message}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]|
|Details|D|Text|No|Yes|{{-}}|—|Detailed technical condition or relation traces sourced from {{{detail.errors[i].details[]}}}, {{{detail.blockers[i].details[]}}}, or {{{result.summary.infeasibility_hints[i].details[]}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]. Multiple items formatted on separate lines. Displays {{-}} if empty|
|How to fix|E|Text|No|Yes|{{-}}|—|Actionable resolution guidance sourced from {{{detail.errors[i].remedies[]}}}, {{{detail.blockers[i].remedies[]}}}, or {{{result.summary.infeasibility_hints[i].remedies[]}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]. Multiple items formatted on separate lines. Displays {{-}} if empty|
|Affected|F|Text|No|Yes|{{-}}|—|Comma-separated list of mapped Gantt tasks formatted as {{"([No.]) [Job Description]"}} (e.g., {{"(12) Replace valve, (15) Weld joint"}}). Displays {{-}} if no task is associated|

----

*Acceptance Criteria*

# *Export Generation & File Format*:
## *Trigger Action*: Clicking the *Export* button in the Optimization Feedback panel (per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]) initiates immediate client-side generation and download of the Excel workbook.
## *File Format*: The exported report must be formatted as a standard Microsoft Excel spreadsheet ({{.xlsx}}).
## *Non-Blocking Operation*: The export process runs asynchronously in the browser without freezing the UI or triggering a full page refresh.
# *Spreadsheet Structure & Column Schema*:
## *Worksheet Definition*: The workbook must contain a single worksheet named {{Optimization Feedback}}.
## *Header Row*: The first row must display frozen, bold table headers with light grey background fill ({{#D9D9D9}}), solid cell borders, and auto-filter enabled.
## *Column Definitions & Mapping*:
### {{Header}} *(Column A)*: Originating block headline title sourced from {{{detail.errors[i].headline}}}, {{{detail.blockers[i].headline}}}, or {{{result.summary.infeasibility_hints[i].headline}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373].
### {{Severity}} *(Column B)*: Severity classification in plain text ({{error}}, {{blocker}}, {{suspect}}). Defaults to {{error}} if originating from the {{validate_input}} stage.
### {{Message}} *(Column C)*: Full human-readable error, blocker, or hint description text sourced from {{{detail.errors[i].message}}}, {{{detail.blockers[i].message}}}, or {{{result.summary.infeasibility_hints[i].message}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373].
### {{Details}} *(Column D)*: Detailed error conditions or relation traces sourced from {{{detail.errors[i].details[]}}}, {{{detail.blockers[i].details[]}}}, or {{{result.summary.infeasibility_hints[i].details[]}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]. If multiple details are present, formatted on separate lines. If empty ({{[]}}), displays a dash ({{-}}).
### {{How to fix}} *(Column E)*: Actionable resolution guidance sourced from {{{detail.errors[i].remedies[]}}}, {{{detail.blockers[i].remedies[]}}}, or {{{result.summary.infeasibility_hints[i].remedies[]}}} per [ETM-6373|https://pttep.atlassian.net/browse/ETM-6373]. If multiple remedies are present, formatted on separate lines. If empty ({{[]}}), displays a dash ({{-}}).
### {{Affected}} *(Column F)*: Comma-separated list of mapped Gantt tasks formatted as {{"([No.]) [Job Description]"}} (e.g., {{"(12) Replace valve, (15) Weld joint"}}). If no task is associated, displays a dash ({{-}}).
# *File Naming Convention*:
## *Dynamic Filename*: The exported Excel file must be dynamically named using the parent Plan Name and timestamp:
{{Optimization_Errors_[Plan_Name]_[YYYYMMDD_HHmm].xlsx}}
## *Sanitization*: Special characters or spaces in the plan name are replaced with underscores ({{_}}).

----

*UI Design*

* *Reference Mockup*: [Link to Figma - Optimization Feedback|https://www.figma.com/design/4kxDnzxVKdxkaV56cj840w/EMI---Turnaround--Shutdown-Logic-?node-id=1719-1287417&t=imtBCMxgNsQKqrLy-4]
* *Design System*: Built using PTTEP Nualta Data Grid Excel export utilities.

----

## Comments (before 2026-10-15T21:02)

### Automation for Jira, 2026-10-15T11:12

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7166#icft=ETM-7166</custom> has been resolved

### Automation for Jira, 2026-10-15T20:23

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7167#icft=ETM-7167</custom> has been resolved

### Automation for Jira, 2026-10-15T20:28

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7168#icft=ETM-7168</custom> has been resolved

### Automation for Jira, 2026-10-15T20:55

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7169#icft=ETM-7169</custom> has been resolved

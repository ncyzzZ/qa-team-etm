# ETM-7900 [Improvement] Export Shutdown Logic - PDF Timeframe Selection (Full Shutdown Timeframe vs Focus Timeframe)
Frozen for a defect exam: description as it was before 2026-11-10T11:12 (Jira changelog version of 2026-11-06T10:38, Jira wiki markup; 0 later edits not included), comments written before 2026-11-10T11:12 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* select between Full Shutdown Timeframe and Focus Timeframe (Day-1 to Day+2) as a radio option under the Timeframe section in the Export drawer when exporting Shutdown Logic to PDF in Daily Plan mode
*So that* I can produce either a full-timeframe schedule or a targeted 4-day operational briefing document for each execution day in Daily Plan PDF exports.

----

*Pre-Conditions*

* The user is logged into the STMS application as a *Turnaround Manager* or *Job Owner*.
* The user possesses the *Edit Shutdown Logic Table and Visualization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] (aligned with [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461]).
* The user is on the *Shutdown Logic* page and has clicked the *Export* button to open the *Export Shutdown Logic* drawer.

----

*Data Source*

* *Active Gantt Dataset*: Scheduled task dates, durations, dependencies, active column filters, and Custom View hierarchy state.
* *Export PDF Specifications*: [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461] (Export Gantt Table into PDF) and [ETM-5492|https://pttep.atlassian.net/browse/ETM-5492] (Export File Naming Alignment).

----

*Acceptance Criteria*

# *Export Drawer Timeframe Controls & Mode Behavior*:
## *Section Placement*: In the *Export Shutdown Logic* drawer, the *Timeframe* section is positioned directly beneath the *Export Mode* section.
## *Section Display & Mode Rules*:
##* *Excel File & PDF Overall Mode*: When *Excel File* is selected under *File Type*, or when *PDF File* is selected with *Overall* mode, the *Timeframe* section displays only a single radio option: *Full Shutdown Timeframe* (selected and locked by default per Figma frame {{Export - Add}}).
##* *PDF Daily Plan Mode*: When *PDF File* is selected with *Daily Plan* mode, the *Timeframe* section dynamically presents two mutually exclusive radio options:
##** *Full Shutdown Timeframe* (Default, pre-selected): Accompanied by subtext _"Timeline scale spans from the earliest start date to the latest end date of the currently displayed tasks."_
##** *Focus Timeframe*: Accompanied by subtext _"Timeline scale spans from day-1 to day+2 of each plan date."_
# *Daily Plan Mode + Full Shutdown Timeframe Rendering (Default)*:
## *Task Inclusion in Daily PDF*: For each generated daily PDF ({{Day[N]}}), the document includes only the tasks active on that execution date {{D}} ({{Task End >= Date D 00:00:00}} and {{Task Start < Date D+1 00:00:00}}):
##* A task that completes exactly at {{Date D 00:00:00}} is included and visible in {{Day[N]}}.
##* A task that begins exactly at {{Date D+1 00:00:00}} is excluded from {{Day[N]}} and not visible (belongs to {{Date D+1}}).
## *Timeline Scale*: The exported PDF Gantt chart timeline scale spans from the earliest Start Date to the latest End Date among the displayed tasks of that specific day, respecting active column filters and toolbar filters per [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461].
## *Empty Day Inclusion*: If a calendar day within the active date range has no active tasks, the individual daily PDF file for that day ({{Day[N]}}) is still generated, rendering the complete Gantt table headers and a 24-hour single-day timeline scale ({{[Date D 00:00:00, Date D 23:59:59]}}) without task rows (an empty table body displaying only table headers).
## *Dependency Lines in Full Mode*: Dependency arrows are rendered between any two tasks that are visible in that day's PDF per [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461] AC 4.3.
# *Daily Plan Mode + Focus Timeframe Rendering (*{{Day-1}} *to* {{Day+2}}*)*:
## *Anchor Date Definition*: For each generated daily PDF ({{Day[N]}}), reference date {{D}} is strictly defined as the execution date of that specific daily plan in {{UTC+7 (Asia/Bangkok)}}.
## *Task Row Scope in Table*:
##* The left-side table lists only tasks that have operational activity on date {{D}} ({{Task End >= Date D 00:00:00}} and {{Task Start < Date D+1 00:00:00}}), identical to standard Daily Plan mode:
##** A task concluding at {{Date D 00:00:00}} is visible on date {{D}}.
##** A task starting at {{Date D+1 00:00:00}} is omitted from date {{D}} (belongs to {{Date D+1}}).
##* Tasks that begin after date {{D}} or complete before date {{D}} are omitted from that day's PDF table and Gantt timeline.
##* If date {{D}} contains no active tasks, the daily PDF file for {{Day[N]}} is still generated, rendering the complete table headers and the 4-day Gantt timeline grid {{[D-1, D+2]}} with an empty table body (only table headers displayed, no task rows or bars).
## *WBS Parent Summary Row Visibility*:
##* A parent WBS / Work Header row is displayed in the daily PDF if and only if at least one of its child tasks is active on date {{D}}.
##* If all child tasks under a WBS parent have no activity on date {{D}}, the parent row is completely hidden.
## *Timeline Grid Scope & Dynamic Zoom-Level Preservation*:
##* The exported PDF Gantt chart preserves the on-screen zoom level currently active in the Shutdown Logic workspace, expanding grid units to fully encompass the operational window {{[Day-1, Day+2]}}:
##** *Day / Hour Zoom Level*: Displays the 4-calendar-day operational window {{[Timeline Start = D - 1 day (00:00:00), Timeline End = D + 2 days (23:59:59)]}}.
##** *Week Zoom Level*: The timeline scale renders in week units, expanding to cover all complete week units containing the {{[Day-1, Day+2]}} range. On the Shutdown Logic page, weeks strictly start on *Sunday* ({{Sunday 00:00:00}} to {{Saturday 23:59:59}}).
##*** _Example_: If date {{D}} is a Sunday, {{Day-1}} is Saturday (previous week) and {{Day+2}} is Tuesday (current week). The exported PDF timeline must span *2 full weeks* to cover both Saturday of the prior week and Tuesday of the current week.
##** *Month Zoom Level*: The timeline scale renders in month units, expanding to cover all complete calendar month units containing the {{[Day-1, Day+2]}} range (e.g. if {{[Day-1, Day+2]}} crosses a month boundary from 30 June to 3 July, both full months June and July are rendered).
## *Edge Days Rule (Start & End of Shutdown)*:
##* For the first execution day of the shutdown (where {{D-1}} precedes the event start date) and the final execution day (where {{D+2}} exceeds the event end date), the timeline grid strictly retains the complete 4-day span {{[D-1, D+2]}}. Columns outside the event timeframe render as empty grid columns.
## *Task Bar Boundary Clipping*:
##* For tasks active on date {{D}} whose total duration extends prior to {{D-1}} or beyond {{D+2}}, their Gantt task bars are clipped cleanly at the left boundary ({{D-1 00:00:00}}) and right boundary ({{D+2 23:59:59}}).
##* The true scheduled Start and End dates in the table columns remain unclipped and display the actual scheduled dates.
## *Milestones (0-Duration Tasks)*:
##* Milestones occurring on date {{D}} are rendered as diamond markers at their scheduled date and time within the 4-day window.
## *Dependency Lines in Focus Mode*:
##* Dependency arrows connecting to tasks outside that daily plan OR extending outside the 4-day viewport window are hidden.
# *Drawer Interaction, Session State & File Naming*:
## *Immediate Radio Selection*: While the drawer remains open under *PDF File* -> *Daily Plan*, clicking either radio option updates the selection immediately.
## *In-Drawer State Persistence*: If the user selects *Focus Timeframe*, switches *Export Mode* from *Daily Plan* to *Overall* (or switches *File Type* to *Excel File*), and then switches back to *Daily Plan*, the timeframe selection retains *Focus Timeframe* until the drawer is closed.
## *Drawer Dismissal & Reset*: Clicking *Cancel*, clicking the dimmed background overlay, or clicking *Export* dismisses the drawer right at the process start. Reopening the drawer restores the default selection (*Full Shutdown Timeframe*).
## *Active Filter Range Scope*: The batch export generates one daily PDF for each consecutive calendar day between the earliest Start Date and the latest End Date among the currently filtered and visible tasks on screen ({{[Earliest Filtered Date, Latest Filtered Date]}}). If active filters reduce the schedule span, only the days within that narrowed range are exported per [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461].
## *Export Trigger & Background Execution*: Clicking *Export* immediately closes the drawer right at the process start, returning the user to the active workspace while the file generation process initiates in the background. If the export fails, an error toast notification is displayed per [ETM-3461|https://pttep.atlassian.net/browse/ETM-3461].
## *File Naming & Packaging*: Export filenames and monthly {{.zip}} packaging strictly follow [ETM-5492|https://pttep.atlassian.net/browse/ETM-5492] without adding any timeframe suffix (e.g. no {{_Focus}} tag):
##* Individual daily PDF: {{"[ShutdownEventName]_[PlanName]_ShutdownLogic_Day[N]_[YYYYMMDD].pdf"}} (where {{Day[N]}} is the continuous sequential calendar index {{Day1, Day2, Day3...}} of the active range).
##* Monthly ZIP archive: {{"[ShutdownEventName]_[PlanName]_ShutdownLogic_DailyPlan_[YYYYMM].zip"}} (where {{YYYYMM}} represents the respective calendar month; split into separate {{.zip}} files if dates span multiple months per [ETM-5492|https://pttep.atlassian.net/browse/ETM-5492]).

----

*UI Design*

* *Reference Mockup*: [Export Shutdown Logic Figma|https://www.figma.com/design/TWffJOBdk9XphbGQOQbNlh/EMI---Turnaround--Shutdown-Logic-2-?node-id=35-724506&t=u89o58AR2pBeyjAt-4] (Frame: {{Export - Add}})
* *Design System*: Built using PTTEP Nualta Design System components (Drawer, Radio Group, File Cards, and Loading Spinner).

----

## Comments (before 2026-11-10T11:12)

### Thanawat Chongphipatmongkol, 2026-11-05T09:57

h3. Acceptance Criteria Refinement & QA Clarification Summary (Sprint 25)

The acceptance criteria for \[ETM-7900\] have been updated based on the confirmed Figma design (Frame: Export - Add) and resolution of all 11 QA questions:

1\. \*Persona & Access Alignment:\*  
\* Updated persona to \*Turnaround Manager or Job Owner\* (aligned with ETM-3461 and Role & Permission V.2). Both roles can access Shutdown Logic and export Daily Plan PDFs with timeframe selection.

2\. \*UI Layout & Placement (AC 1):\*  
\* Added section heading \*Export Timeframe\* positioned directly beneath \*Export Mode\* in the Export drawer.  
\* The section renders \*if and only if\* \*PDF File\* is selected under File Type AND \*Daily Plan\* is selected under Export Mode. (Hidden when Overall mode or Excel File is selected).  
\* Radio options with subtexts:  
\*\* \*Full Shutdown Timeframe\* (Default): "Export the full timeframe of tasks for each daily plan."  
\*\* \*Focus Timeframe\*: "Export tasks within Day -1 to Day +2 for each daily plan."

3\. \*Full Shutdown Timeframe Scope (AC 2):\*  
\* Each daily PDF (Day\[N\]) includes only tasks active on that date D (Task Start <= D 23:59:59 and Task End >= D 00:00:00).  
\* Timeline scale dynamically spans earliest Start Date to latest End Date among that day's visible tasks (respecting active filters).  
\* \*Empty Day Inclusion:\* If a calendar day within the active plan range has no active tasks, a daily PDF for Day\[N\] is still generated, displaying complete table headers and timeline grid with an empty table body (no task rows or bars).

4\. \*Focus Timeframe (Day-1 to Day+2) Logic (AC 3):\*  
\* Reference date D is anchored to that specific daily plan's execution date in UTC+7 (Asia/Bangkok).  
\* Left table lists only tasks active on date D (tasks starting after D or ending before D are omitted).  
\* WBS parent rows are hidden if all child tasks under that parent have no activity on date D.  
\* Timeline grid is strictly clipped to the 4-day window: \[Start of Day-1 (00:00:00), End of Day+2 (23:59:59)\] in UTC+7.  
\* \*Edge Days:\* For Day 1 (D-1 before event start) and final day (D+2 after event end), the full 4-day span is preserved.  
\* Task bars active on date D extending outside the 4-day window are cleanly cut/clipped at the window boundaries.  
\* Milestones (0-duration tasks) occurring on date D render as diamond markers within the 4-day window.  
\* Dependency lines connecting to tasks outside the daily plan or outside the 4-day window are hidden.  
\* Empty days still generate a Day\[N\] PDF showing table headers and the 4-day timeline grid without task rows.

5\. \*Drawer State & File Naming (AC 4):\*  
\* In-drawer state persistence: Toggling between Daily Plan <-> Overall or PDF <-> Excel preserves the selected timeframe until drawer is dismissed. Reopening restores default (Full Shutdown Timeframe).  
\* File naming conventions strictly follow ETM-3461 and ETM-5492 without any \_Focus suffix:  
\*\* Daily PDF: \[Event\]\_\[Logic\]\_Day\[N\]\_\[YYYYMMDD\].pdf  
\*\* ZIP Archive: \[Event\]\_\[Logic\]\_DailyPlan\_\[YYYYMMDD\].zip

### Thanawat Chongphipatmongkol, 2026-11-05T16:55

\[BA Update - 2026-11-05\] Acceptance Criteria Updated & QA Questions Resolved

The User Story description has been updated to align with the latest Figma design (Frame: Export - Add, node-id=35-724506) and address all QA blocker questions (Rounds 1 & 2):

1\. Export Drawer Timeframe Controls (AC 1):  
\- Section Header: Updated to 'Timeframe' (positioned directly beneath Export Mode).  
\- Non-Daily Plan Modes (Excel File & PDF Overall): 'Timeframe' section remains visible, displaying 'Full Shutdown Timeframe' as selected and locked/disabled.  
\- Daily Plan Mode: Displays two mutually exclusive options with Figma subtext:  
  \* Full Shutdown Timeframe (Default): "Timeline scale spans from the earliest start date to the latest end date of the currently displayed tasks."  
  \* Focus Timeframe: "Timeline scale spans from day-1 to day+2 of each plan date."

2\. Daily Plan PDF Rendering Scope & Boundary Logic (AC 2 & AC 3):  
\- Task Inclusion in Day D: Filtered by active duration (Task End >= Date D 00:00:00 and Task Start < Date D+1 00:00:00). Tasks ending exactly at 00:00:00 of Day D are visible; tasks starting at Date D+1 00:00:00 belong to Day D+1. Tasks outside Day D are omitted entirely (no empty rows).  
\- Empty Day Handling: Calendar days without active tasks generate a PDF with complete headers and a blank grid (Full = 24-hr scale; Focus = 4-day \[D-1, D+2\] scale).  
\- WBS Parent Rows: Hidden if all child tasks have no operational activity on Day D.  
\- Milestones (0-duration): Rendered as diamond markers at their scheduled time.  
\- Task Bar Clipping: In Focus mode, bars extending outside \[D-1 00:00:00, D+2 23:59:59\] are clipped at grid boundaries, while table start/end date columns display true scheduled dates.  
\- Edge Days: Event start (D-1) and event end (D+2) retain the full 4-day span, rendering empty grid columns for days outside the event window.  
\- Dynamic Zoom Scale Preservation: Preserves active on-screen zoom level. In Week view (weeks start Sunday), spans 2 full weeks if Day D is Sunday. In Month view, spans all overlapping full calendar months.  
\- Dependency Arrows: In Focus mode, hidden if connecting to tasks outside that daily plan or extending outside the 4-day viewport; in Full mode, rendered between visible tasks per ETM-3461.

3\. Drawer State, Loading State & File Naming (AC 4):  
\- Session Memory: Drawer retains 'Focus Timeframe' selection when toggling modes/file types during an active drawer session; resets to 'Full' when dismissed or reopened.  
\- Loading Feedback: Export button transitions to a disabled loading spinner state with backdrop overlay until completion.  
\- File & ZIP Naming: Adheres strictly to ETM-5492 without '\_Focus' suffix:  
  \* Daily PDF: \[ShutdownEventName\]\_\[PlanName\]\_ShutdownLogic_Day\[N\]\_\[YYYYMMDD\].pdf  
  \* Monthly ZIP Archive: \[ShutdownEventName\]\_\[PlanName\]\_ShutdownLogic_DailyPlan\_\[YYYYMM\].zip (split by calendar month YYYYMM).

All 23 QA questions in question-ba 2.md are closed.

### Thanawat Chongphipatmongkol, 2026-11-06T10:39

\[BA Update - 2026-11-06\] Drawer Export Dismissal Behavior Clarification (AC 4.3 & AC 4.5)

Updated Acceptance Criteria regarding Export Drawer closing interaction:  
\- AC 4.3 (Drawer Dismissal & Reset) & AC 4.5 (Export Trigger & Background Execution): Clarified that clicking 'Export' immediately dismisses/closes the drawer right at the process start (rather than waiting for generation to complete). The user is returned to the active workspace immediately while the PDF/ZIP generation runs in the background. If an error occurs, an error toast notification is displayed on screen per ETM-3461.

### Automation for Jira, 2026-11-10T09:34

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8304#icft=ETM-8304</custom> has been resolved

### Automation for Jira, 2026-11-10T10:33

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-8305#icft=ETM-8305</custom> has been resolved

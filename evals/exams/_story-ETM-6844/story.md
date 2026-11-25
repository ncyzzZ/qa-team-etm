# ETM-6844 Export Work and Work Breakdown to Excel
Frozen for a defect exam: description as it was before 2026-10-09T17:07 (Jira changelog version of 2026-10-07T09:34, Jira wiki markup; 0 later edits not included), comments written before 2026-10-09T17:07 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* export Work and Work Breakdown records into an Excel file
*So that* I can review the data offline or easily modify multiple records in Excel and re-upload them using the Import Work feature.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Export Work* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is viewing a list of Works on the View Worklist Table page (or Gantt Table / Planning Tab) and triggers the *Export Worklist* action.

----

*Data Source*

* *Affected Feature:* Export Work
* *Target Data Entities:* Work, Work Breakdown
* *Export Template:* [Import_Work_and_Work_Breakdown_Template_V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Worklist/Import%20Work%20and%20Work%20Breakdown/Import_Work_and_Work_Breakdown_Template_V2.xlsx?d=w7a6d212938144468b37374051eb8ccd6&csf=1&web=1&e=Fo1evt] (Worksheet: {{Worklist_Data}})
* *Action Column:* {{Action *}} (Column C in {{Worklist_Data}}; left blank on export)
* *Matching Key:* {{UUID}} (Column B in {{Worklist_Data}}; populated with database UUIDs)
* *Disabled / System-Managed Columns:* {{Functional Location}}, {{Equipment Number}}, {{System Condition}}, {{POB}}, {{Man-hrs.}}, {{Work Status}}, {{Breakdown Status}} (system-managed columns)
* *File Naming Pattern:* {{[Shutdown_Event_Name]_[Plan_Name]_Worklist_[YYYYMMDD].xlsx}} (per [ETM-5492|https://pttep.atlassian.net/browse/ETM-5492])

----

*Acceptance Criteria*

# *Export File Format & Template Match*:
## The system must generate and download an Excel file ({{.xlsx}}).
## *Base Template Re-use*: The backend must use the official [Import_Work_and_Work_Breakdown_Template_V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Worklist/Import%20Work%20and%20Work%20Breakdown/Import_Work_and_Work_Breakdown_Template_V2.xlsx?d=w7a6d212938144468b37374051eb8ccd6&csf=1&web=1&e=Fo1evt] as the base file for generation. By injecting data directly into the {{Worklist_Data}} tab of this template, the system ensures that all Data Validation (dropdowns with advisory warning styles), conditional formatting, and helper tabs ({{Instructions}}, {{Examples}}, {{Dropdown Options}}, {{Library - Platform}}) are automatically preserved in the downloaded file.
## The generated file name should follow the dynamic pattern {{[Shutdown_Event_Name]_[Plan_Name]_Worklist_[YYYYMMDD].xlsx}} containing a date for traceability.
# *Data Structure & Hierarchy*:
## The export must include the selected {{Work}} records and all of their currently associated {{Work Breakdown}} records.
## The data must be structured hierarchically, matching the import expectations:
##* A {{Work}} row ({{Data Level}} = Work).
##* Followed immediately by its associated {{Work Breakdown}} rows ({{Data Level}} = Work Breakdown).
## *UUID Population*: The {{UUID}} column (Column B) must be populated with the actual system UUIDs for every exported Work and Work Breakdown. This ensures the file can be modified and re-imported to update existing records seamlessly. The {{UUID}} column must be formatted as an active editable field (not disabled or read-only).
# *Data Formatting & Blank Cell Handling*:
## *Action Column Blank Export (Mandatory Blank)*: In the generated export file, all cells in the *Action* column (Column C) must be exported as *blank* (empty cells) for both {{Work}} and {{Work Breakdown}} rows. The system must not pre-populate any default action (e.g., do not export {{Revise}} or {{Add}}). This allows users to download existing records and explicitly decide which rows to edit ({{Revise}}), delete ({{Delete}}), or add ({{Add}}) before re-importing.
## *Work Breakdown Type Masking*: The {{Work Breakdown Type}} field at the {{Work}} level must always be exported as a *blank* cell, regardless of its original value in the database. This ensures users do not accidentally re-trigger preset injections upon re-import.
## *Master Data Dropdowns & Advisory Warnings*: Because the export uses the V2 Import template as a base, dropdown data validation rules (configured with warning-style prompts allowing data flexibility) are preserved across all dropdown columns.
## *Empty Data Handling*: Any optional fields that contain no data or null in the database must be exported as empty cells without null placeholder text (never output {{"null"}} or {{"-"}}).
## *Conditional Formatting Independence*: The export process must populate system data into all corresponding worksheet cells regardless of Excel conditional formatting rules. If data exists in the system for a field, it must be written directly into the cell even if that cell is styled or formatted as inactive by conditional formatting (e.g., non-applicable fields based on {{Data Level}}). Visual conditional formatting rules must never suppress, omit, or block data from being populated into the worksheet.
# *Scope of Export*:
## *Complete Dataset Export (Filter-Independent)*: The export action must process and download *all Work and Work Breakdown records* associated with the current event/plan in the database.
## *Filter Exemption*: Any active filters, search criteria, column visibility toggles, or custom views currently applied to the UI table must have *zero effect* on the export; the system always extracts the full, unfiltered dataset.

----

*UI Design*

* *Reference Mockup*: Utilizes existing Worklist and Gantt Table toolbar export trigger.
* *Design System*: Nualta Design System.

----

----

## Comments (before 2026-10-09T17:07)

### Automation for Jira, 2026-10-09T10:41

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7096#icft=ETM-7096</custom> has been resolved

### Automation for Jira, 2026-10-09T11:42

The linked issue - <custom data-type="smartlink" data-id="id-0">https://pttep.atlassian.net/browse/ETM-7223#icft=ETM-7223</custom> has been resolved

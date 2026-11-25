# ETM-6843 Import Work and Work Breakdown from Excel
Frozen for a defect exam: description as it was before 2026-10-15T19:58 (Jira changelog version of 2026-10-08T11:05, Jira wiki markup; 5 later edits not included), comments written before 2026-10-15T19:58 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* import Work and Work Breakdown records from an Excel file
*So that* I can seamlessly create new records, update existing ones, delete unwanted records, and keep work breakdowns synchronized in a single operation.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Import Work* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is performing the *Create Multiple Work via Excel Import* workflow from the View Worklist Table page.
* The user must have an Excel file formatted according to the system's official import template ([Import_Work_and_Work_Breakdown_Template_V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Worklist/Import%20Work%20and%20Work%20Breakdown/Import_Work_and_Work_Breakdown_Template_V2.xlsx?d=w7a6d212938144468b37374051eb8ccd6&csf=1&web=1&e=Fo1evt]).
* The imported Excel file contains an *Action* column ({{Add}}, {{Revise}}, {{Delete}}) and may contain a mix of new data (without UUIDs) and existing data (with UUIDs).

----

*Data Source*

* *Affected Feature:* Create/Update Multiple Work via Excel Import
* *Target Data Entities:* Work, Work Breakdown
* *Import Template:* [Import_Work_and_Work_Breakdown_Template_V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Worklist/Import%20Work%20and%20Work%20Breakdown/Import_Work_and_Work_Breakdown_Template_V2.xlsx?d=w7a6d212938144468b37374051eb8ccd6&csf=1&web=1&e=Fo1evt] (Worksheet: {{Worklist_Data}})
* *Action Column:* {{Action *}} (Column C in {{Worklist_Data}}; mandatory dropdown: {{Add}}, {{Revise}}, {{Delete}})
* *Matching Key:* {{UUID}} (Column B in {{Worklist_Data}}; active editable column; required for {{Revise}} and {{Delete}}, must be blank for {{Add}})
* *Disabled / System-Managed Columns:* {{Functional Location}}, {{Equipment Number}}, {{System Condition}}, {{POB}}, {{Man-hrs.}}, {{Work Status}}, {{Breakdown Status}} (system-managed columns; ignored on import except Work Status, Breakdown Status imported by Turnaround Manager)
* *Work Breakdown Type Preset Reference:* [Work Breakdown Type.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Work%20Breakdown%20Type.xlsx?d=wb8bdee5c3fc947ef83e6cf53ba1fa051&csf=1&web=1&e=omQeH0]

----

*Acceptance Criteria*

# *Action Column Definition & Operation Classification*:
## *Active Mandatory Column*: Column C in {{Worklist_Data}} is an active mandatory field ({{Action *}}) providing dropdown selections: {{Add}}, {{Revise}}, {{Delete}}. (In the Excel template, dropdown validation is configured with Warning style allowing free-text editing with advisory alerts, but the import engine strictly enforces acceptable values).
## *Add Operation (*{{Action = Add}}*)*:
### *New Work Record*: When {{Data Level}} = {{Work}} and {{Action}} = {{Add}}, the system creates a new {{Work}} record in the database. The {{UUID}} column must be left blank.
### *New Breakdown Record*: When {{Data Level}} = {{Work Breakdown}} and {{Action}} = {{Add}}, the system creates a new {{Work Breakdown}} record associated with its parent {{Work}}. The {{UUID}} column must be left blank.
## *Revise Operation (*{{Action = Revise}}*)*:
### *Work Record Update*: When {{Data Level}} = {{Work}} and {{Action}} = {{Revise}}, the system updates the existing {{Work}} record identified by the provided {{UUID}} with the imported row data.
### *Breakdown Record Update*: When {{Data Level}} = {{Work Breakdown}} and {{Action}} = {{Revise}}, the system updates the existing {{Work Breakdown}} record identified by the provided {{UUID}} with the imported row data.
## *Delete Operation (*{{Action = Delete}}*)*:
### *Work Record Deletion (Soft Delete)*: When {{Data Level}} = {{Work}} and {{Action}} = {{Delete}}, the system marks the specified {{Work}} record and all of its associated child {{Work Breakdowns}} for *soft delete* upon import confirmation. A valid existing {{UUID}} is mandatory.
### *Breakdown Record Deletion (Permanent Delete)*: When {{Data Level}} = {{Work Breakdown}} and {{Action}} = {{Delete}}, the system marks the specified {{Work Breakdown}} record for *permanent deletion* from its parent {{Work}} upon import confirmation. A valid existing {{UUID}} is mandatory.
## *Mandatory Action Validation*: If the {{Action}} cell is left blank, the system flags a validation *Error* (_"This field is mandatory."_).
# *Work and Work Breakdown Action & UUID Hierarchy Rules*:
## *Work is Add (without UUID)*:
### *At Least One Breakdown or Preset Required*: When a {{Work}} row has {{Action = Add}}, it must either contain at least one child {{Work Breakdown}} row underneath it or specify a valid {{Work Breakdown Type}} (Preset). If neither is provided, the system must flag a validation *Error* (_"The work must contain at least one work breakdown or work breakdown type."_).
### *All Breakdowns Must Be Add without UUID*: All child {{Work Breakdown}} rows located underneath an {{Add}} Work must have {{Action = Add}} and a blank {{UUID}}.
### *Inconsistency Error*: If any child {{Work Breakdown}} under an {{Add}} Work has {{Action = Revise}} or {{Action = Delete}}, or contains a {{UUID}}, the system must flag a validation *Error* (_"All Work Breakdowns under a newly added Work must be Add without UUID."_).
## *Work is Delete (with UUID)*:
### *Zero Breakdown Rows Allowed*: When a {{Work}} row has {{Action = Delete}}, it is allowed to have no child {{Work Breakdown}} rows in the import file, which indicates soft deleting the {{Work}} and all of its associated child {{Work Breakdowns}} in the database.
### *Breakdowns Can Only Be Delete*: If child {{Work Breakdown}} rows are explicitly included underneath a {{Delete}} Work in the import file, they cannot be {{Add}} or {{Revise}}; they must strictly have {{Action = Delete}} and a valid existing {{UUID}}.
### *Inconsistency Error*: If any child {{Work Breakdown}} under a {{Delete}} Work has {{Action = Add}} or {{Action = Revise}}, or has a blank {{UUID}}, the system must flag a validation *Error* (_"All Work Breakdowns under a deleted Work must be Delete with a valid UUID."_).
## *Work is Revise (with UUID)*:
### *Zero Breakdown Rows Allowed*: When a {{Work}} row has {{Action = Revise}}, it can have no child {{Work Breakdown}} rows in the import file, which indicates editing only the parent {{Work}} details while retaining all existing breakdowns in the database untouched.
### *Breakdowns Can Be Add, Revise, or Delete*: If child {{Work Breakdown}} rows are provided underneath a {{Revise}} Work, they can independently have any of the three actions:
#### *Add*: Must have a *blank UUID* (creates a new child {{Work Breakdown}} record under this existing Work).
#### *Revise*: Must have a *valid existing UUID* (updates that specific existing child {{Work Breakdown}} record).
#### *Delete*: Must have a *valid existing UUID* (marks that specific existing child {{Work Breakdown}} record for permanent deletion).
### *Add with UUID Error*: If a breakdown under a {{Revise}} Work has {{Action = Add}} but provides a {{UUID}}, the system must flag a validation *Error* (_"UUID must be empty when Action is Add."_).
### *Revise/Delete without UUID Error*: If a breakdown under a {{Revise}} Work has {{Action = Revise}} or {{Action = Delete}} but leaves the {{UUID}} blank, the system must flag a validation *Error* (_"UUID is mandatory when Action is Revise or Delete."_).
# *UUID Field Rules & Action Constraints*:
## *Active Editable Field (Not Disabled)*: The {{UUID}} column (Column B) is an active editable field and is *not* a disabled or system-managed field.
## *Mandatory UUID on Revise and Delete*: If {{Action}} is set to {{Revise}} or {{Delete}} and the {{UUID}} cell is left blank, the system must flag a validation *Error* (_"UUID is mandatory when Action is Revise or Delete."_).
## *UUID Existence Check (No Data Level Cross-Check)*: If a {{UUID}} is provided for {{Revise}} or {{Delete}} but does not exist in the database for that record's entity type, the system must flag a validation *Error* (_"The UUID you entered is not exist in the system."_). The system does not differentiate whether the UUID exists under a different Data Level; if the UUID is not matched to an existing record of that level, it simply returns that the UUID does not exist.
## *Empty UUID on Add*: If {{Action}} is set to {{Add}} and a {{UUID}} value is entered, the system must flag a validation *Error* (_"UUID must be empty when Action is Add."_).
## *Duplicate UUID in File*: If the same {{UUID}} appears more than once across rows in the import file, the system must flag a validation *Error* (_"The UUID you entered is duplicated within the import file."_).
## *System-Managed Disabled Fields Ignored*: Values entered into disabled system-managed columns ({{Functional Location}}, {{Equipment Number}}, {{System Condition}}, {{POB}}, {{Man-hrs.}}, {{Work Status}}, {{Breakdown Status}} — indicated by "Disable" input hints) must be completely ignored by the import processor (except {{Work Status}} and {{Breakdown Status}} when imported by a *Turnaround Manager*), as these values are system-calculated or synchronized from SAP.
# *Work Breakdown Type Preset Injection & Inheritance*:
## *Blank Value Behavior*: If the {{Work Breakdown Type}} field at the {{Work}} level is left blank in the import file, the system relies entirely on the explicit {{Work Breakdown}} rows provided underneath it.
## *Missing Breakdowns or Preset Error*: If {{Action = Add}} and {{Work Breakdown Type}} is left blank, and there are zero explicit child {{Work Breakdown}} rows provided underneath that {{Work}}, the system must flag a validation *Error* (_"The work must contain at least one work breakdown or work breakdown type."_). (For {{Revise}} and {{Delete}} Work records, omitting breakdown rows is permitted as specified in AC 2).
## *Preset Injection & Data Inheritance Logic*: When the user specifies a valid Master Data preset in the {{Work Breakdown Type}} field at the {{Work}} level (for {{Action = Add}} or {{Revise}}):
### *Preset Generation*: The system automatically generates the predefined child {{Work Breakdown}} rows defined in that preset from [Work Breakdown Type.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Work%20Breakdown%20Type.xlsx?d=wb8bdee5c3fc947ef83e6cf53ba1fa051&csf=1&web=1&e=omQeH0].
### *Single Task Inheritance*: The inherit type is strictly and exclusively *“Single Task (Inherit from Work)”*. When this type is generated, its attributes (*Priority*, *Manpower Resource*, *POB*, *Duration*, *Man-hrs.*, and *D/N Shift*) must automatically inherit and populate using the corresponding values defined at the parent {{Work}} row level.
### *Non-Inherit Types*: For all other preset types (non-inherit), values are populated directly from the Master Data preset definition in [Work Breakdown Type.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Work%20Breakdown%20Type.xlsx?d=wb8bdee5c3fc947ef83e6cf53ba1fa051&csf=1&web=1&e=omQeH0].
### *Sequence Positioning*: In the final Work Breakdown sequence, all injected preset breakdowns are positioned last (after unmentioned original breakdowns and file-imported rows), sorted according to their order in the preset master ([Work Breakdown Type.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Work%20Breakdown%20Type.xlsx?d=wb8bdee5c3fc947ef83e6cf53ba1fa051&csf=1&web=1&e=omQeH0]).
# *Rollup Recalculation*:
## *Summary Metrics*: Upon successful import confirmation, the system must automatically recalculate the parent {{Work}}'s summary metrics ({{Manpower Resource}}, {{Duration}}, {{POB}}, {{Man-hrs}}, {{D/N Shift}}) based on the final, combined list of active {{Work Breakdowns}} (excluding deleted breakdowns).
# *Work Breakdown Retention, Deletion & Ordering Hierarchy*:
## *Work Context Identification*: When updating an existing {{Work}} (via {{Action = Revise}} and its {{UUID}}), the system retrieves all existing {{Work Breakdown}} records currently associated with that {{Work}} in the database.
## *Breakdown Retention for Omitted UUIDs*: Any existing {{Work Breakdown}} currently associated with that {{Work}} in the database whose {{UUID}} is *not mentioned* in the importing file is *retained* in the system (not deleted). Deletion occurs strictly and exclusively when a record is explicitly provided in the file with {{Action = Delete}} and its valid existing {{UUID}}.
## *Explicit Action Operations*:
### *Work Deletion (Soft Delete)*: If a parent {{Work}} is marked with {{Action = Delete}}, that {{Work}} and all of its associated child {{Work Breakdowns}} are *soft deleted* in the database upon import confirmation.
### *Work Breakdown Deletion (Permanent Delete)*: If an individual {{Work Breakdown}} is marked with {{Action = Delete}}, that specific breakdown record is *permanently deleted* from the database upon import confirmation.
### *Work / Breakdown Update (*{{Action = Revise}}*)*: Updated with the values provided in the import file.
### *Work / Breakdown Creation (*{{Action = Add}}*)*: Created as a new record under the Worklist.
## *Sequential Ordering Hierarchy of Work Breakdowns*: When composing the final ordered list of {{Work Breakdowns}} under a parent {{Work}}, the system must strictly apply the following 3-tier ordering:
### *1st - Original Breakdowns (Unmentioned UUIDs)*: Existing child {{Work Breakdown}} records whose UUID is not mentioned in the importing file remain at the very beginning (first), preserving their exact original ordering in the database.
### *2nd - Import File Rows (Add / Revise)*: Child {{Work Breakdown}} rows specified in the importing file under this {{Work}} (whether {{Action = Add}} or {{Action = Revise}}) are positioned second, strictly preserving the exact sequential order as they appear in the file.
### *3rd - Preset of Work Breakdown Type*: Child {{Work Breakdown}} records generated from the {{Work Breakdown Type}} preset are positioned last. Their order must strictly match the sequence defined in the preset master ([Work Breakdown Type.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Work%20Breakdown%20Type.xlsx?d=wb8bdee5c3fc947ef83e6cf53ba1fa051&csf=1&web=1&e=omQeH0]). The inherit type is strictly and exclusively *“Single Task (Inherit from Work)”*, which derives its field data (*Priority*, *Manpower Resource*, *POB*, *Duration*, *Man-hrs.*, and *D/N Shift*) from the parent {{Work}} row level.
# *Import Validation & Warning Alerts*:
## *Pre-Import Validation Review*: The system must validate every row containing data in the uploaded file and present an error/warning report within an in-app data preview grid before committing any changes. *Data validation error checking is executed first before duplicate checking.* If the file contains errors, the system must display a global error banner (e.g., "Data Validation Failed. [Count] data validation errors were found in the file.") and render a table listing the specific *Row*, *Cell*, *Field*, and *Invalid Detail* for each error. If a cell has multiple errors, display each one as a separate row in the grid. If any *Error* is present, the *Confirm* button must be disabled and the import process cannot proceed to duplicate resolution until validation errors are resolved.
## *Empty File Handling*: If the uploaded file contains no records, the system must block the import process and display an inline error message below the upload area stating: *"Cannot upload the selected file - The file contains no records"*.
## *Bulk Upload Limit*: To ensure system stability, the uploaded file must not exceed a maximum of *1,000 rows (excluding the header)*. If this limit is exceeded, the system must block the import process and display an inline error message below the upload area stating: *"Cannot upload the selected file - The file exceeds the maximum limit of 1,000 rows"*.
## *Sheet Name Validation*: The system must only recognize and process data from a worksheet named *Worklist_Data*. If the uploaded file uses a different sheet name, the system must block the import process and display an inline error message below the upload area stating: *"Cannot upload the selected file - The uploaded file must contain a worksheet named 'Worklist_Data'"*.
## *Case Sensitivity*: For Master Data validation, *case sensitivity must be ignored*. Any input that matches an existing record or Master Data must be automatically converted to the existing format.
## *Dropdown Validation Advisory*: For dropdown columns, the Excel template provides in-cell warning prompts allowing data entry flexibility. However, upon import upload, the system validates values against allowable options according to the matrix below.
## *Validation Cases Matrix*: The system must evaluate the data according to the table below. If any *Error* is present, the *Confirm* button must be disabled. If only *Warnings* are present, the user may still proceed.

||*Validation Case*||*Severity*||*Invalid Detail / Message*||
|Mandatory field is blank|*Error*|_"This field is mandatory."_|
|UUID missing for Revise or Delete|*Error*|_"UUID is mandatory when Action is Revise or Delete."_|
|UUID provided for Add|*Error*|_"UUID must be empty when Action is Add."_|
|UUID not found|*Error*|_"The UUID you entered is not exist in the system."_|
|Duplicate UUID within the import file|*Error*|_"The UUID you entered is duplicated within the import file."_|
|Work is Add with non-Add or UUID breakdown|*Error*|_"All Work Breakdowns under a newly added Work must be Add without UUID."_|
|Work is Delete with non-Delete or blank UUID breakdown|*Error*|_"All Work Breakdowns under a deleted Work must be Delete with a valid UUID."_|
|Work has no Breakdown or Preset|*Error*|_"The work must contain at least one work breakdown or work breakdown type."_|
|Breakdown without Work|*Error*|_"The work breakdown must belong to a work"_|
|Field is not in Master Data|*Error*|_"The value you entered does not match with Master Data. Please check the sheet name “Dropdown Options”."_|
|Platform is not under Asset|*Error*|_"The value you entered does not match with data under the Asset/Field in SAP."_|
|Functional Location is not under Platform|*Error*|_"The value you entered does not match with data under the Platform in SAP."_|
|Equipment Number is not under Functional Location|*Error*|_"The value you entered does not match with data under the Functional Location in SAP."_|
|Exceeds max length|*Error*|_"The text you entered exceeds the maximum character limit. Please refer to the sheet name “Dropdown Options” for the maximum limit."_|
|Field is not the correct data type|*Error*|_"The input format does not match requirements. Please refer to the sheet name “Dropdown Options” for the allowable format."_|
|Value is not within the boundary|*Error*|_"The value you entered exceeds the allowed boundary. Please refer to the sheet name “Dropdown Options” for the limits."_|
|Exceeds Manpower Resource|*Error*|_"The total allocation of Manpower Resources exceeds the maximum limit of 5 resources."_|
|Duplicate Manpower Resource|*Error*|_"The values entered in Manpower Resource contain duplicates. Each resource name must be unique."_|

# *Duplicate Work Detection & Alert*:
## *Execution Sequence (Validation Before Duplicates)*: The system strictly checks data validation errors before duplicate checking. Duplicate checking is only executed after the uploaded file passes data validation with zero blocking errors.
## *Scope of Duplication Check (Work Without UUID Only)*:
### Duplication checking applies strictly and exclusively to {{Work}} records ({{Data Level = Work}}). It does *not* apply to {{Work Breakdown}} records.
### Duplication checking applies strictly to *Work records without UUID* ({{Action = Add}} and blank {{UUID}}). (Existing Works with UUID are tracked by unique UUID matching and do not trigger this alert).
## *Duplication Matching Rules*:
### A Work without UUID is identified as a duplicate if both *Work Header* and *Work Number* match another Work record.
### The system evaluates {{Work Number}} only if it contains at least *8 characters*.
## *Comparison Targets*:
### The system evaluates every new Work row (without UUID) in the import file against:
#### *Existing Work in System*: Any active Work record in the current Worklist Table (excluding soft-deleted works).
#### *Work within Import File*: Any other Work row within the import file (including existing Works being revised with UUID, or other newly added Works without UUID).
## *Duplicate Alert Banner & User Options*:
### *Warning Banner*: When duplicate works are detected, the system displays an alert section above the import table with:
###* *Banner Message*: _"[Number of duplicate work] duplicate works were found in the file."_ (Yellow background)
###* *Prompt Copy*: _"Do you want to import all works or skip the duplicates?"_
### *Resolution Options (Radio Buttons)*:
###* *"Import without duplicate works"* (Default active): Excludes the flagged duplicate new Work rows (and all associated child {{Work Breakdowns}}) from being imported, while proceeding with the non-duplicate records.
###* *"Import all works"*: Confirms and imports all records, including the duplicate Work rows and their breakdowns.
## *Duplicate Details Table*:
### Below the prompt, the system renders a dedicated duplicate summary table with columns: *Row* (specifying the duplicate row number in the import file) and *Duplicate Detail*.
### Soft-deleted records in the system are excluded from duplicate checking and are not displayed.
### If a row duplicates both an existing record in the system and another row in the file, the system presents them separately.
### Messages rendered in the *Duplicate Detail* column must follow the matrix below:

||*Duplication Case*||*Duplicate Context*||*Duplicate Detail Message*||
|Work Header + Work Number matches active Work in database|Duplicate in System|_"The values in fields Work Header and Work Number already exists in the system"_|
|Work Header + Work Number matches another Work row in uploaded file|Duplicate in File|_"The values in fields Work Header and Work Number are duplicated in the file."_|

# *Concurrency & Execution Scope*:
## *Conflict Strategy*: Last Write Wins. The import file payload serves as the absolute source of truth at the time of import execution.
## *Commit Trigger & Buttons*:
##* *Confirm*: Commits all transactions (creation, update, soft deletion for Work and its breakdowns, permanent deletion for individual Work Breakdowns) directly to the database.
##* *Cancel*: Discards the import payload, closes the modal, and returns to the previous screen with no database changes.
## *Empty State Exemption*: Empty state specification is not applicable as this feature modifies backend import logic without introducing new list or table UI components.

----

*UI Design*

* *Reference Mockup:* [Link to Figma|https://www.figma.com/design/xXx8RG78Q5MGsNnhF1rrWh/EMI---Turnaround--Worklist-?node-id=1-23254&t=YiSPMdgeJfCsB3oT-4]
* *Design System*: Nualta Design System.

----

## Comments (before 2026-10-15T19:58)

(none)

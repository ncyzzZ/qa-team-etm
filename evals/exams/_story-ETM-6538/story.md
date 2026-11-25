# ETM-6538 [Improvement] Export Gantt Table into Excel File
Frozen for a defect exam: description as it was before 2026-10-01T10:51 (Jira changelog version of 2026-09-30T11:27, Jira wiki markup; 2 later edits not included), comments written before 2026-10-01T10:51 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* export the complete structural schedule and task attributes from the Gantt view into a formatted Excel spreadsheet (.xlsx)
*So that* I can conduct offline schedule audits, analyze comprehensive multi-dimensional task parameters and constraints, and share execution schedules with operations and contractors.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Shutdown Logic Table and Visualization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *View Shutdown Logic* page (Bryntum Gantt view) of the active Shutdown Logic item.
* The active Shutdown Logic item contains at least one saved task or structural work record (Gantt chart has been generated and saved).

----

*Data Source*

* *Active Event & Plan Metadata*: Active Shutdown Event ({{Shutdown Event Name}}, {{Start Event Date}}, {{End Event Date}}) and Turnaround Plan Card ({{Plan Name}}, {{Shutdown Logic Name}}).
* *Shutdown Logic Dataset*: Live relational task hierarchy mirroring the 4-level scheduling tree: Level 1 ({{Platform}}), Level 2 ({{Work Header}}), Level 3 ({{Work}}), and Level 4 ({{Work Breakdown}}).
* *Export Specification & Canonical Master Template*: [Export Template V2.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20Logic/Export%20Shutdown%20Logic/Export%20Template%20V2.xlsx?d=w9c73f78135ec47a9ba9661080c7642e0&csf=1&web=1&e=es2Zzf] — Sheet: {{SD Logic_Master}}.
* *Field Specification Table (Spreadsheet Columns A through BQ)*:

||*Field Name*||*Column*||*Data Type*||*Required?*||*Nullable?*||*Default Value*||*Max Length / Value Range / Enum*||*Notes*||
|No.|A|Integer|Yes|No|—|Positive integer (`1, 2, 3...`)|Sequential row index starting from 1|
|Data Level|B|Enum|Yes|No|—|`Platform`, `Work Header`, `Work`, `Work Breakdown`|Hierarchical outline level (renamed from Type)|
|Description|C|Text|Yes|No|—|Max 255 chars|Item name or task job description|
|Work Type|D|Enum|Yes (for Work / Work Breakdown)|Yes|—|`Work Order`, `Notification`, `MOD`, `Simple MOD`, `Other`|Sourced from Worklist; blank for Platform / Work Header|
|Work Number|E|Text|No|Yes|—|Max 50 chars|SAP Work Order or Notification No.|
|Activity Group|F|Text|No|Yes|—|Max 100 chars|Activity group classification|
|Priority|G|Enum|No|Yes|—|`P1`, `P2`, `P3`, `Pre SD`, `Post SD`|Priority code|
|System Condition|H|Enum|No|Yes|—|`1`, `2`, `3`, `4`|System operating condition; blank if unset|
|Job Owner|I|Text|No|Yes|—|Max 100 chars|Assigned Job Owner name|
|Department|J|Text|No|Yes|—|Max 100 chars|Assigned department|
|Accommodation|K|Enum|No|Yes|—|`LQ`, `Barge`, `FSO`|Designated accommodation facility|
|Hot Bed|L|Enum|No|Yes|—|`Yes`, `No`|Hot bed utilization flag|
|Duration|M|Float|Yes|No|—|Float (hours)|Task duration in decimal hours|
|Start Date|N|DateTime|Yes|No|—|`dd Mmm yyyy, hh:mm`|Scheduled start timestamp (e.g., `02 Jan 2025, 15:30`)|
|End Date|O|DateTime|Yes|No|—|`dd Mmm yyyy, hh:mm`|Scheduled end timestamp (e.g., `02 Jan 2025, 15:30`)|
|Predecessor|P|Text|No|Yes|—|Comma-separated `No.` integers (e.g., `"4, 14, 56"`)|References `No.` column of predecessor tasks; blank if none|
|Successor|Q|Text|No|Yes|—|Comma-separated `No.` integers (e.g., `"4, 14, 56"`)|References `No.` column of successor tasks; blank if none|
|SIMOP|R|Enum|No|Yes|—|`Allow`, `Restriction`, `Prohibit`|Font color in Excel matches UI: Allow (`#00B050` Green), Restriction (`#FA8C16` Orange), Prohibit (`#FF0000` Red)|
|Platform|S|Text|Yes|No|—|Max 100 chars|Platform name; populated with identical value across all child levels within the same platform|
|Equipment Number|T|Text|No|Yes|—|Max 50 chars|Equipment tag identifier|
|Functional Location|U|Text|No|Yes|—|Max 100 chars|Functional location code|
|Working Location (Deck)|V|Text|No|Yes|—|Max 100 chars|Deck location|
|Working Location (X)|W|Text|No|Yes|—|Text with comma (e.g., `"12.5, 14.0"`)|Coordinate X string|
|Working Location (Y)|X|Text|No|Yes|—|Text with comma (e.g., `"30.2, 45.1"`)|Coordinate Y string|
|Work Header|Y|Text|Yes|No|—|Max 100 chars|Parent Work Header name copied down to child levels; static `"Overall"` for Platform rows (renamed from Work Group)|
|Manpower Resource|Z|Text|No|Yes|—|Max 100 chars|Assigned trade discipline / resource crew name|
|POB|AA|Integer|No|Yes|—|Integer (≥ 0)|Required headcount count on board|
|Man-hrs.|AB|Float|No|Yes|—|Float (hours)|Planned man-hours; retrieved from underlying Worklist for Work Breakdown level; blank for higher levels|
|D/N Shift|AC|Enum|No|Yes|—|`Day`, `Night`, `D/N`|Shift assignment (renamed from Shift)|
|Remark|AD|Text|No|Yes|—|Max 500 chars|Free-text remarks|
|Specific Requirements (15 cols)|AE–AS|Enum|Yes|No|`No`|`Yes`, `No`|15 columns for specific equipment/permit flags (`P/L Pressure Bleeding` through `Crew Boat`)|
|Work Conflicted (20 cols)|AT–BM|Enum|Yes|No|`No`|`Yes`, `No`|20 columns for SIMOP conflict flags (`Confined Space Entry` through `Run Diesel Engine`)|
|Constraint Type|BN|Enum|Yes|No|`None`|`None`, `Start no earlier than`, `Start no later than`, `Finish no earlier than`, `Finish no later than`, `Must start on`, `Must finish on`|Scheduling constraint logic type|
|Constraint Date|BO|DateTime|Yes (if Constraint Type ≠ None)|Yes|—|`dd Mmm yyyy, hh:mm`|Constraint date and time (e.g., `02 Jan 2025, 15:30`); blank if Constraint Type is `None`|
|Working Calendar Type|BP|Enum|Yes|No|`Resource Calendar`|`Resource Calendar`, `Custom Calendar`, `Manual Adjust`|Calendar mode driving task working hours|
|Working Calendar|BQ|Text|Yes (if not Manual Adjust)|Yes|—|Formatted text per Working Calendar Type|If Resource Calendar: comma-separated Shift Names. If Custom Calendar: multi-line string of day abbreviation and time intervals. If Manual Adjust: null (blank empty cell).|

----

*Acceptance Criteria*

# *Export Action Trigger & Permission Enforcement*:
## *Toolbar Button Placement*: The system must provide an *[ Export ]* button on the top toolbar of the View Shutdown Logic page (Gantt view), positioned adjacent to the visualization tools.
## *Permission Guard*: The *[ Export ]* button is strictly visible and actionable only for users possessing the *Edit Shutdown Logic Table and Visualization* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] (possessed by Turnaround Manager). For users without this permission, the button must be strictly *Hidden*.
## *Page Access Guard*: Users possessing {{View All Shutdown Logic Item}} or {{View Active Shutdown Logic Item}} can access the View Shutdown Logic page and view the Gantt schedule in read-only mode without export capability. Users without view permission cannot access the Shutdown Logic module.
## *Empty State Guardrail*: If the active Shutdown Logic contains no saved tasks (empty state where the visual Gantt displays {{No data available.}}), the *[ Export ]* button must be strictly *disabled* (greyed out and unclickable).
## *Persisted Data Scope*: The export engine must export only persisted (saved) database records. Unsaved draft edits or newly created items in the client session that have not been committed via *Save* must not be included.
## *Filter & Visibility Independence (Zero Truncation Rule)*: The export engine must strictly ignore any active column filters, text search queries, or collapsed tree nodes on the visual Gantt grid. All hierarchical branches must be fully expanded, and all rows and columns belonging to the active plan dataset must be exported.
# *File Naming Convention & Worksheet Tab Structure*:
## *Dynamic File Naming*: The exported workbook must download directly to the user's browser with the filename formatted as: {{"[ShutdownEventName]_[ShutdownLogicName]_[YYYYMMDD].xlsx"}} where YYYYMMDD is the export generation date, determined using the user's local device timezone.
## *Prohibited Character Sanitization*: Any invalid filename characters (\, /, :, *, ?, ", <, >, |) present in [ShutdownEventName] or [ShutdownLogicName] must be automatically completely removed (deleted) from the filename, without leaving any replacement spaces.
## *Worksheet Tab Name*: The primary worksheet tab inside the exported .xlsx workbook must be named {{SD Logic_Master}} (matching the canonical template).
# *Spreadsheet Header Hierarchy & Merged Cell Structure*:
## *Merged Group Header Banners (Rows 1–3)*: The header rows must strictly adhere to the structural layout of Export Template V2.xlsx Sheet SD Logic_Master:
### *Row 1 to Row 3 Merged Columns*: No. (A1:A3), Data Level (B1:B3), Work Header (Y1:Y3), Manpower Resource (Z1:Z3), POB (AA1:AA3), Man-hrs. (AB1:AB3), D/N Shift (AC1:AC3), Remark (AD1:AD3), Constraint Type (BN1:BN3), Constraint Date (BO1:BO3), Working Calendar Type (BP1:BP3), Working Calendar (BQ1:BQ3).
### *Multi-Column Category Group Headers (Rows 1–2 Merged with Row 3 Sub-Headers)*:
• *Details*: Columns C1:L2 merged displaying label Details. Row 3 displays individual headers: Description (C), Work Type (D), Work Number (E), Activity Group (F), Priority (G), System Condition (H), Job Owner (I), Department (J), Accommodation (K), Hot Bed (L).
• *Scheduled*: Columns M1:O2 merged displaying label Scheduled. Row 3 displays individual headers: Duration (M), Start Date (N), End Date (O).
• *Dependencies*: Columns P1:R2 merged displaying label Dependencies. Row 3 displays individual headers: Predecessor (P), Successor (Q), SIMOP (R).
• *Location*: Columns S1:X2 merged displaying label Location. Row 3 displays individual headers: Platform (S), Equipment Number (T), Functional Location (U), Working Location (Deck) (V), Working Location (X) (W), Working Location (Y) (X).
• *Specific Requirement*: Columns AE1:AS2 merged displaying label Specific Requirement. Row 3 displays individual sub-headers for all 15 specific requirement parameters.
• *Work Conflicted*: Columns AT1:BM2 merged displaying label Work Conflicted. Row 3 displays individual sub-headers for all 20 SIMOP conflict parameters.
# *Hierarchical Tree Levels & Data Inheritance Rules*:
## *Hierarchical Outline Levels*: Every row in the spreadsheet corresponds to a node in the 4-level scheduling tree, explicitly classified in Column B (*Data Level*): Level 1 (Platform), Level 2 (Work Header), Level 3 (Work), and Level 4 (Work Breakdown).
## *Platform Column Propagation (Same Data for Every Level)*: For every row belonging to a given platform group (including child Work Header, Work, and Work Breakdown rows), Column S (*Platform*) must be populated with the platform name (identical platform text across all descendant rows).
## *Work Header Column Inheritance*: For rows at Work Header, Work, and Work Breakdown levels, Column Y (*Work Header*) must display the parent Work Header name. For rows at Platform level, Column Y must display the static text "Overall".
## *Row Sorting & Tree Structure*: The export must sort and index all rows preserving the exact hierarchical sequence and visual tree layout currently displayed in the Gantt grid (Platform → Work Header → Work → Work Breakdown).
# *Column Field Specifications & Data Formatting Rules*:
## *Updated Column Names*: Column B is Data Level (updated from Type), Column Y is Work Header (updated from Work Group), and Column AC is D/N Shift (updated from Shift).
## *Predecessor & Successor Dependency Formatting*: Columns P (Predecessor) and Q (Successor) must be formatted as a comma-separated list of the referenced items' row numbers in Column A (No.), formatted with a space following each comma (e.g., "4, 14, 56"). If an item has no predecessors or successors, the respective cell must remain blank.
## *SIMOP Status & UI Font Color Matching*: Column R (SIMOP) strictly displays Allow, Restriction, or Prohibit. Each option must render in font color matching the application UI: Allow (*Green font #00B050*), Restriction (*Orange/Amber font #FA8C16*), and Prohibit (*Red font #FF0000*). If an item has no SIMOP classification, the cell must remain blank.
## *Working Location Coordinates*: Column W (Working Location (X)) and Column X (Working Location (Y)) must be formatted as text containing comma-separated numeric coordinates (e.g., "12.5, 14.0").
## *POB Headcount*: Column AA (POB) must strictly display a non-negative integer representing the headcount required on board. If unset, the cell must remain blank.
## *Specific Requirement & Work Conflicted Flags (Columns AE through BM)*: For all 15 Specific Requirement columns (AE through AS) and all 20 Work Conflicted columns (AT through BM), the cell value must strictly display either Yes (if active/required) or No (if inactive/not required).
## *Constraint Specifications*: Column BN (Constraint Type) strictly accepts one of the following exact string values: None, Start no earlier than, Start no later than, Finish no earlier than, Finish no later than, Must start on, Must finish on (default is None). Column BO (Constraint Date) must be formatted as dd Mmm yyyy, hh:mm (e.g., 02 Jan 2025, 15:30); blank if Constraint Type is None.
## *Working Calendar Specifications*: Column BP (Working Calendar Type) strictly accepts Resource Calendar, Custom Calendar, or Manual Adjust (default is Resource Calendar). Column BQ (Working Calendar) formats text as follows:
• *Resource Calendar*: Sourced shift names separated by comma (e.g., "Dayshift, Nightshift").
• *Custom Calendar*: Formatted period intervals per active weekday separated by comma and line break (\n), e.g.:
{{"SUN 00:00-18:00, 20:00-24:00\nWED 08:00-16:00\nFRI 07:00-24:00"}}
• *Manual Adjust*: Cell must strictly remain blank (null).
# *Timeline Schedule Grid Columns (Hourly Timescale Columns BR+)*:
## *Timescale Columns Alignment*: Beginning at Column BR (Column index 70), the sheet renders horizontal timeline columns partitioned into 2-hour increments (01:00, 03:00, 05:00, 07:00, 09:00, 11:00, 13:00, 15:00, 17:00, 19:00, 21:00, 23:00), grouped under merged daily date headers in Row 1 (TPSD, Day(1), TPSD, Day(2), etc.) and Row 2.
## *Duration Bar Plotting*: For each task row, active time slots between scheduled Start Date and End Date plot continuous duration indicator values/shading corresponding to the task's schedule. Time slots outside the active scheduled window remain blank.
# *Blank Value Handling & Formatting Polish*:
## *Blank Cell Standards*: Any optional text, numeric, or enum field that contains no data in the database must be rendered as an empty blank cell (never output string "null" or "undefined").
## *Gridlines & Alignment*: Text and date columns must be left-aligned; integer columns must be center-aligned; numeric floats (Duration, Man-hrs.) must be right-aligned. Excel gridlines must remain visible throughout the worksheet.

----

*UI Design*

* *Reference Mockup*: [Link to Figma - View Shutdown Logic|https://www.figma.com/design/DiPcr6PVSLRxsy1VJOebUB/Turnaround?node-id=5446-359340&t=Dg0edI5ahWh6NMHK-4]
* *Design System*: Standard PTTEP Nualta Design System export toolbar component and file download response handling.

----

## Comments (before 2026-10-01T10:51)

(none)

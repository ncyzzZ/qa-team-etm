> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Team-provided spec file; texts are verbatim from the source, and any 'not checked on the real app' remark inside the file still applies.

# Shutdown Logic - Validation & Result (converted from `Shutdown Logic Validation&Result.xlsx`)

> Converted by script: merged cells are filled down, line breaks inside a cell are shown as `<br>`, blank cells as `-`. Text is verbatim. Read the notes of each sheet; rows that look wrong in the source are NOT corrected here.


---

## Sheet: Confirmation&Result

| View UI in Figma | Figma Link | - | - | - | - | - | - | - | - |
|---|---|---|---|---|---|---|---|---|---|
| Page | Action | Trigger | Condition | Confirmation & Result Type | Title | Message 1 | Button 1 | Button 2 | Button 3 |
| View Shutdown Logic Item | Create Shutdown Logic | Click Create Shutdown Logic Button | No Worklist Available to Link | Confirmation Modal - Style 1 | Unable to Create Shutdown Logic | There is no worklist available to link with the shutdown logic. | OK | - | - |
| View Shutdown Logic Item | Create Shutdown Logic | Click Save Button in Create Shutdown Logic Modal | Save Success | Toast - Success | Create Success | Create Shutdown Logic Item Successfully | - | - | - |
| View Shutdown Logic Item | Create Shutdown Logic | Click Save Button in Create Shutdown Logic Modal | Save Fail  | Toast - Fail | Create Failed | Create Shutdown Logic Item Failed | - | - | - |
| View Shutdown Logic Item | Edit Shutdown Logic | Click Save Button in Edit Shutdown Logic Modal | Save Success | Toast - Success | Edit Success | Edit Shutdown Logic Item Successfully | - | - | - |
| View Shutdown Logic Item | Edit Shutdown Logic | Click Save Button in Edit Shutdown Logic Modal | Save Fail  | Toast - Fail | Edit Failed | Edit Shutdown Logic Item Failed | - | - | - |
| View Shutdown Logic Item | Delete Shutdown Logic | Click Delete Shutdown Logic | Inactive Shutdown Logic | Confirmation Modal - Style 2 | Delete Shutdown Logic | Are you sure you want to delete the selected shutdown logic? | Delete | Cancel | - |
| View Shutdown Logic Item | Delete Shutdown Logic | Click Delete Shutdown Logic | Active Shutdown Logic | Confirmation Modal - Style 1 | Unable to Delete Shutdown Logic | The active shutdown logic cannot be deleted. | OK | - | - |
| View Shutdown Logic Item | Confirm Delete | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Shutdown Logic Successfully | - | - | - |
| View Shutdown Logic Item | Confirm Delete | Click Delete Button | Delete Fail  | Toast - Fail | Delete Failed | Delete Shutdown Logic Failed | - | - | - |
| View Gantt & Histogram | Optimize | Click Optimize Button | Unsaved Shutdown Logic | Confirmation Modal - Style 1 | Unsaved Shutdown Logic | The shutdown logic has unsaved changes. Do you want to save the changes before running the optimization? | Save and Optimize | Optimize Without Saving | Cancel |
| View Gantt & Histogram | Running Optimize Completed | System Stop the Optimize | Optimize Success | Confirmation Modal - Style 1 | Optimization Complete | The optimization has completed with the following result:<br>Duration            [XXXXX]<br>Optimal Gap     [XXXXX] | OK | - | - |
| View Gantt & Histogram | Running Optimize Completed | System Stop the Optimize | Optimize Fail <br>(Invalid constraints) | Confirmation Modal - Style 1 | Unable to Run Optimization | The optimization could not be completed with the current conditions and constraints. | OK | - | - |
| View Gantt & Histogram | Running Optimize Completed | System Stop the Optimize | Optimize Fail <br>(Result = Infeasible) | Confirmation Modal - Style 1 | Optimization Failed | The optimization could not be completed due to an infeasible result. | OK | - | - |
| View Gantt & Histogram | Running Optimize Completed | System Stop the Optimize | Optimize Fail <br>(Result = Exceed Ram) | Confirmation Modal - Style 1 | Optimization Failed | The optimization could not be completed because the memory limit was exceeded. | OK | - | - |
| View Gantt & Histogram | Running Optimize Completed | System Stop the Optimize | Optimize Fail <br>(Result = Unknown) | Confirmation Modal - Style 1 | Optimization Failed | The optimization could not be completed due to an unexpected error. | OK | - | - |
| View Gantt & Histogram | Running Optimize Completed | Click the Stop Optimize Button | - | Confirmation Modal - Style 1 | Stop Optimization? | Are you sure you want to stop the optimization and use the following result?<br>Duration            [XXXXX]<br>Optimal Gap     [XXXXX] | Confirm | Cancel | - |
| View Gantt & Histogram | Cancel Optimize | Click Cancel Button | - | Confirmation Modal - Style 1 | Cancel Optimization? | Are you sure you want to cancel the optimization? | Confirm | Cancel | - |
| View Gantt & Histogram | Save Shutdown Logic | Click Save Button  | - | Confirmation Modal - Style 1 | Save Shutdown Logic and Update Worklist | Are you sure you want to save this shutdown logic and update all changes to the linked worklist? | Confirm | Cancel | - |
| View Gantt & Histogram | Confirm Save Shutdown Logic | Click Confirm Button in Confirm Save Shutdown Logic Modal | Save Success | Toast - Success | Save Success | Save Shutdown Logic Successfully | - | - | - |
| View Gantt & Histogram | Confirm Save Shutdown Logic | Click Confirm Button in Confirm Save Shutdown Logic Modal | Save Fail  | Toast - Fail | Save Failed | Save Shutdown Logic Failed | - | - | - |
| View Gantt & Histogram | Edit Work Header | Click Save Button in Work Header Setting Modal | Save Success | Toast - Success | Save Success | Save Work Header Successfully | - | - | - |
| View Gantt & Histogram | Edit Work Header | Click Save Button in Work Header Setting Modal | Save Fail  | Toast - Fail | Save Failed | Save Work Header Failed | - | - | - |
| View Gantt & Histogram | Edit Work  | Click Save Button in Work Setting Modal | Save Success | Toast - Success | Save Success | Save Work Successfully | - | - | - |
| View Gantt & Histogram | Edit Work  | Click Save Button in Work Setting Modal | Save Fail  | Toast - Fail | Save Failed | Save Work Failed | - | - | - |
| View Gantt & Histogram | Edit Work Breakdown | Click Save Button in Work Breakdown Setting Modal | Save Success | Toast - Success | Save Success | Save Work Breakdown Successfully | - | - | - |
| View Gantt & Histogram | - | - | Save Fail  | Toast - Fail | Save Failed | Save Work Breakdown Failed | - | - | - |
| View Gantt & Histogram | Edit Resource | Add, Remove Resource<br>or Edit Shift | No Overlap Working Time | Confirmation Modal - Style 1 | No Working Time Available | Changing the manpower resource or shift makes some tasks have no overlapping working time. | OK | - | - |
| View Gantt & Histogram | Edit Dependency | Change Dependency in Table or Gantt | Self Dependency | Confirmation Modal - Style 1 | Unable to Apply Dependency | Task cannot be its own dependency. | OK | - | - |
| View Gantt & Histogram | Edit Dependency | Change Dependency in Table or Gantt | Invalid Dependency Level (Platform) | Confirmation Modal - Style 1 | Unable to Apply Dependency | Platform cannot be assigned as dependency. | OK | - | - |
| View Gantt & Histogram | Edit Dependency | Change Dependency in Table or Gantt | Circular Dependency | Confirmation Modal - Style 1 | Unable to Apply Dependency | The selected dependency creates a circular relationship. | OK | - | - |
| View Gantt & Histogram | Edit Dependency | Change Dependency in Table or Gantt | Constraint Conflict | Confirmation Modal - Style 1 | Unable to Apply Dependency | The selected dependency conflicts with the constraint. | OK | - | - |
| View Gantt & Histogram | Edit Constraint | Change Constraint Type or Date in Setting Modal | Dependency Conflict | Confirmation Modal - Style 1 | Unable to Apply Constraint | The selected constraint conflicts with the dependency. | OK | - | - |
| View Gantt & Histogram | Edit Constraint | Change Constraint Type or Date in Setting Modal | Dependency Conflict | Confirmation Modal - Style 1 | Unable to Apply Constraint | The selected constraint conflicts with constraint in parent or child tasks. | OK | - | - |
| View Gantt & Histogram | Edit Constraint | Change Constraint Type or Date in Setting Modal of Work Header or Work<br> | Conflict with current Start Date and End Date | Confirmation Modal - Style 1 | Unable to Apply Constraint | The selected constraint conflicts with the current scheduled dates. | OK | - | - |
| View Gantt & Histogram | Edit Dependency and Constraint | Change Dependency or Constraint Type or Date in Setting Modal | Dependency and Constraint Conflict | Confirmation Modal - Style 1 | Unable to Apply Dependency and Constraint | The selected dependency and constraint conflict with each other. | OK | - | - |
| View Gantt & Histogram | Edit Working Calendar | Change Shift or Working Time | Cannot Render Gantt | Confirmation Modal - Style 1 | Unable to Apply Working Calendar | The selected working calendar cannot be rendered due to a conflict with a dependency or constraint. | OK | - | - |
| View Gantt & Histogram | Edit Scheduled Time | Change Start/End Date or Duration | Dependency or Constraint Conflict | Confirmation Modal - Style 1 | Unable to Apply Scheduled Time | The selected scheduled time conflicts with the dependency or constraint. | OK | - | - |
| View Gantt & Histogram | Split Task | Split Task | Dependency or Constraint Conflict | Confirmation Modal - Style 1 | Unable to Split Task | The end time of the split task conflicts with the constraint. | OK | - | - |
| View Gantt & Histogram | Delete Task | Delete Task | Constraint Conflict | Confirmation Modal - Style 1 | Unable to Delete Task | Deleting this task makes the parent task conflict with its constraint. | OK | - | - |


---

## Sheet: Create&Edit Shutdown Logic Vali

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Shutdown Logic Name  | Free Text  | Yes  | - | [String] 50 | - | Unique | Inline Error | This shutdown logic name is already exist in this event. | - |
| Active Status | Toggle | Yes  | - Inactive<br>- Active (Default) | - | - | (3.1)<br>Active shutdown logic with inactive worklist | Confirmation Modal - Style 1 | Title: Active Worklist and Shutdown Logic<br>Message 1: worklist ‘[Worklist Name]’ must be active to activate shutdown logic ‘[Shutdown Logic Name]’. Do you want to make ‘[Worklist Name]’ active?<br>Button 1: Confirm<br>Button 2: Continue Editing | Disable in Create Page |
| Active Status | Toggle | Yes  | - Inactive<br>- Active (Default) | - | - | (3.2)<br>Active shutdown logic with inactive worklist | Confirmation Modal - Style 1 | Title: Change Active Shutdown Logic and Worklist<br>Message 1: Do you want to make shutdown logic ‘[Active Shutdown Logic Name]' and worklist ‘[Active Worklist Name]’ active, and set shutdown logic ‘[Inactive Shutdown Logic Name]’ and worklist ‘[Inactive Worklsit Name]’ to inactive?<br>Button 1: Confirm<br>Button 2: Continue Editing | Disable in Create Page |
| Active Status | Toggle | Yes  | - Inactive<br>- Active (Default) | - | - | (3.3)<br>Active shutdown logic with inactive worklist | Confirmation Modal - Style 1 | Title: Change Active Shutdown Logic and Worklist<br>Message 1: Do you want to make shutdown logic ‘[Active Shutdown Logic Name]' and worklist ‘[Active Worklist Name]’ active, and set worklist ‘[Inactive Worklsit Name]’ to inactive?<br>Button 1: Confirm<br>Button 2: Continue Editing | Disable in Create Page |
| Description | Free Text  | No  | - | [String] 200 | - | - | - | - | - |
| Linked Worklist | Radio Button | Yes  | Worklist in the same shutdown event | - | - | - | - | - | Disable and display only linked worklist in Edit Page |
| Last Update | - | Yes | - | - | - | - | - | - | - |


---

## Sheet: Edit Work Header (Gantt) Valida

| - | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Tab - Predecessor  | Tab - Predecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Sucecessor  | Tab - Sucecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Advanced  | Tab - Advanced  | - | - | - | - | - | - | - | - |
| Constraint Type | Dropdown | Yes | - Must start on<br>- Must finish on<br>- Start no earlier than (Default)<br>- Start no later than<br>- Finish no earlier than<br>- Finish no later than | - | - | - | - | - | - |
| Constraint Date | Date Picker | Yes | - | - | - | - | - | - | Default = Event Start Date |


---

## Sheet: Edit Work (Gantt) Validatio

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Tab - Work Details | Tab - Work Details | - | - | - | - | - | - | - | - |
| Work Type | Dropdown | Yes | - Work Order<br>- Notification<br>- MOD<br>- Simple MOD<br>- Other | - | - | - | - | - | - |
| Work Number | Free Text | Yes | - | [String] 20 | - | - | - | - | - |
| Job Description | Auto-filled, Free Text | Yes | - | [String] 100 | ถ้าเลือก Ref Type เป็น WO หรือ Noti ให้เอา Desc มาจาก SAP | - | - | - | - |
| Activity Group | Free Text | - | - | [String] 30 | - | - | - | - | - |
| Platform | Auto-filled, Free Text | Yes | Master from SAP | - | ถ้าเลือก Ref Type เป็น WO หรือ Noti ให้เอา Desc มาจาก SAP | - | - | - | - |
| Functional Location | Auto-filled, Free Text | - | - | [String] 20 | ถ้าเลือก Ref Type เป็น WO หรือ Noti ให้เอา Desc มาจาก SAP | - | - | - | - |
| Equipment Number | Auto-filled, Free Text | - | - | [String] 20 | ถ้าเลือก Ref Type เป็น WO หรือ Noti ให้เอา Desc มาจาก SAP | - | - | - | - |
| System Condition | Auto-filled | - | - | - | ถ้าเลือก Ref Type เป็น WO หรือ Noti ให้เอา Desc มาจาก SAP | - | - | - | - |
| Work Header | Dropdown | Yes | - Mechanical (PM)<br>- Mechanical (CM)<br>- Valve and Actuator Replacement<br>- Valve Greasing<br>- Stud bolt and Gasket Replacement<br>- Electrical and Instrument (PM)<br>- Instrument Function Test<br>- Electrical and Instrument (CM)<br>- SWGR and MCC PM/CM<br>- Overhead Line Campaign<br>- CONCOR PM<br>- Inspection - PVI<br>- Inspection - GVI<br>- Inspection - CUI/CUS<br>- Inspection - CVI<br>- Inspection - PSV<br>- Anomaly Repair (ECM)<br>- Simple Modification<br>- Modification<br>- Operation<br>- WHP (PM)<br>- WHP (CM)<br>- MFL<br>- Other | - | - | - | - | - | - |
| Priority | Dropdown | - | - P1<br>- P2 (Default)<br>- P3<br>- Pre SD<br>- Post SD<br>- LowNom<br>- N/A | - | - | - | - | - | - |
| Job Owner | Free Text with Suggestion | Yes | From Azure | [String] 30 | - | - | - | - | - |
| Department | Auto-filled, Free Text | Yes | - | - | เมื่อเลือก Job Owner จาก Azure ให้เอา Department มาด้วย | - | - | - | - |
| Accommodation | Dropdown | - | - LQ<br>- Barge<br>- FSO | - | - | - | - | - | - |
| Hot Bed | Dropdown | - | - Yes<br>- No | - | - | - | - | - | - |
| Remark | Free Text | - | - | [String] 200 | - | - | - | - | - |
| Tab - Predecessor  | Tab - Predecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Sucecessor  | Tab - Sucecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Advanced  | Tab - Advanced  | - | - | - | - | - | - | - | - |
| Section - Constraint | - | - | - | - | - | - | - | - | - |
| Constraint Type | Dropdown | Yes | - Must start on<br>- Must finish on<br>- Start no earlier than (Default)<br>- Start no later than<br>- Finish no earlier than<br>- Finish no later than | - | - | - | - | - | - |
| Constraint Date | Date Picker | Yes | - | - | - | - | - | - | Default = Event Start Date |
| Section - Working Calendar | - | - | - | - | - | - | - | - | - |
| Working Valendar | Radio | Yes | - Resource Calendar (Default)<br>- Custom Calendar<br>- Manual Adjust | - | - | - | - | - | - |
| [Resource Calendar]<br>Shift | Dropdown | Yes | - | - | - | - | - | - | - |


---

## Sheet: Edit Work Breakdown (Gantt) Val

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Tab - Work Details | Tab - Work Details | - | - | - | - | - | - | - | - |
| Task Description | Free Text | Yes | - | [String] 100 | - | - | - | - | - |
| Priority | Dropdown | Yes | "- P1<br>- P2 (Default)<br>- P3<br>- Pre SD<br>- Post SD<br>- LowNom<br>- N/A" | - | - | - | - | - | - |
| Working Location (Deck) | Free Text | Yes | Suggestion:<br>- Upper Deck<br>- Lower Deck<br>- Cooler Deck<br>- Main Deck<br>- Cellar Deck<br>- Mezzanine Deck<br>- Sub Cellar Deck<br>- Sea Deck<br>- Flare Tip<br>- Flare Tower<br>- Flare Tripod<br>- Flare Bridge<br>- SWGR<br>- Control Building<br>- CCR<br>- Onshore<br>- N/A | [String] 50 | - | - | - | - | - |
| Working Location (X) | Dropdown | Yes | - 0<br>- 1<br>- 2<br>- 3<br>- 4<br>- 5<br>- 6<br>- 7<br>- 8<br>- 9<br>- N/A | - | - | - | - | - | - |
| Working Location (Y) | Dropdown | Yes | - A<br>- B<br>- C<br>- D<br>- E<br>- F<br>- G<br>- H<br>- I<br>- J<br>- N/A | - | - | - | - | - | - |
| POB  | Auto-filled | Yes | - | - | - รวมจาก Manpower Resource | - | - | - | - |
| Duration <br>(hrs, 16 hrs per day) | Free Text | Yes | - | [Float] 999.99 | - | - | - | - | - |
| Man-hrs. | Auto-filled | Yes | - | - | - POB*Duration | - | - | - | - |
| D/N Shift | Dropdown | Yes | - Day (Default)<br>- Night<br>- D/N | - | - | - | - | - | - |
| Work conflicted | Dropdown (Multi-select) | - | - | [String] 200 | - | - | - | - | - |
| Remark | Free Text | - | - Confined Space Entry <br>- Crane lifting operation <br>- Vehicle entry to process area <br>- Naked flame hot work (Welding gridding or any work that generate ignition source)<br>- Cold work activities (pipe fitting, installation, mechanical work)<br>- Erection, remove and modify scaffold that cause of unavailable of scaffold <br>- DCS / SIS / FGS Software modification _Offline download <br>- High pressure test (N2 leakage test , Service leakage test, Hydro test)<br>- Radiographic Test (RT)<br>- Non destructive testing (MT, PT, UT)<br>- Painting/Coating<br>- PM Switch gear / UPS /LV /HV  (period of switching to generator)<br>- Breaking Containment <br>- Bolt Tightening (High pressure hydraulic)<br>- EX Inspection and overhaul explosion proof junction boxes<br>- PM Overhead line<br>- Calibration, overhaul and function test control valve/UZV/Orbit valve at site by N2/Instrument air <br>- Cleaning exchanger with high pressure water jet<br>- Inspection of insulation (CUI)<br>- Run diesel engine  | - | - | - | - | - | - |
| Tab - Predecessor  | Tab - Predecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Sucecessor  | Tab - Sucecessor  | - | - | - | - | - | - | - | - |
| Description | Free Text with Suggestion | Yes | From Task List<br>(Still display non-selectable tasks but make it disable) | - | - | - | - | - | - |
| Type | Dropdown | Yes | - Start-to-Start<br>- Start-to-Finish<br>- Finish-to-Start (Default)<br>- Finish-to-Finish | - | - | - | - | - | - |
| Lag | Free Text | Yes | - | - | - | - | - | - | Default = 0h |
| Priority | Dropdown | Yes | - Hard<br>- Normal (Default)<br>- Soft | - | - | - | - | - | - |
| Tab - Advanced  | Tab - Advanced  | - | - | - | - | - | - | - | - |
| Section - Constraint | - | - | - | - | - | - | - | - | - |
| Constraint Type | Dropdown | Yes | - Must start on<br>- Must finish on<br>- Start no earlier than (Default)<br>- Start no later than<br>- Finish no earlier than<br>- Finish no later than | - | - | - | - | - | - |
| Constraint Date | Date Picker | Yes | - | - | - | - | - | - | Default = Event Start Date |
| Section - Working Calendar | - | - | - | - | - | - | - | - | - |
| Working Calendar | Radio | Yes | - Resource Calendar (Default)<br>- Custom Calendar<br>- Manual Adjust | - | - | - | - | - | - |
| [Resource Calendar]<br>Shift | Dropdown (Multi-select) | Yes | From Resource's Shift | - | - | No Selected Shift | Inline Error | This field is required. | - |
| [Resource Calendar]<br>Shift | Dropdown (Multi-select) | Yes | From Resource's Shift | - | - | No Overlap Working Time | Inline Error | The selected shift has no overlaping working time. | - |
| [Custom Calendar]<br>Working Time | Time Picker | Yes | - | - | - | Overlap Working Time | Inline Error | Working time must not overlap within the same day. | - |

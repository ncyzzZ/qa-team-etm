# ETM-7350 Shutdown Timeline - Key Milestones Operational Notes & Modal Management
Frozen for a defect exam: description as it was before 2026-11-06T08:35 (Jira changelog version of 2026-11-05T01:52, Jira wiki markup; 1 later edits not included), comments written before 2026-11-06T08:35 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* annotate specific timeline weeks with custom operational milestone icons, colors, and notes (up to 50 characters) via a dedicated Key Milestones row and modal dialogs that persist directly to the database upon saving
*So that* key operational events, milestones, and critical preparation context are immediately saved and accessible without depending on the progress commit workflow.

----

*Pre-Conditions*

* The user is logged in with *View Timeline* and *Update Progress and Note* permissions in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the main *Timeline* tab of an active Shutdown Event.

----

*Data Source*

* {{Key Milestones}} dataset ({{week_id}}, {{icon}}, {{color}}, {{note}}), client-side draft cache, and modal lifecycle events.
* *Validation & Result Reference*: [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result & Sheet: Add&Edit Note|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=eLCZ9N].

----

*Acceptance Criteria*

# {{Key Milestones}} *Row Placement & Week Cell Interactions*:
## A dedicated {{Key Milestones}} row is positioned immediately below the table header row on the main *Timeline* screen. _(Strictly_ *_hidden_* _in the_ *_Edit Plan_* _screen per_ [_ETM-7348_|https://pttep.atlassian.net/browse/ETM-7348]_)._
## *Empty Week Cell Interaction*:
##* For users with *Update Progress and Note* permission, hovering over an empty weekly cell in the {{Key Milestones}} row reveals a {{+}} button in the center of the cell. (For users without this permission, hovering does not reveal the {{+}} button).
##* Single-clicking the {{+}} button opens the {{Add Note}} modal dialog.
## *Existing Note Cell Interaction*:
##* Cells containing a saved note render the selected milestone icon styled in the selected color.
##* *Hover Trigger (All Users)*: Hovering over an existing note icon displays a floating tooltip popover showing the note's text. If the note was saved without text ({{Note}} field left empty), the tooltip displays {{No details.}} in grey text.
##* *Double-Click Trigger (Permission-Driven)*: Double-clicking an existing note icon opens the {{Edit Note}} modal dialog exclusively for users with *Update Progress and Note* permission. For users without *Update Progress and Note* permission (view-only), double-clicking is disabled and does not open the modal dialog (they can only hover to view the tooltip popover).
# {{Add Note}} */* {{Edit Note}} *Modal Dialog Specifications*:
## *Modal Title*: Displays {{Add Note}} when creating a new note, and {{Edit Note}} when editing an existing note.
## *Modal Form Fields*:
##* {{Icon}} *(Mandatory — red asterisk* {{*}}*)*: Horizontal icon selector offering 10 milestone icons: Calendar, Clock, Megaphone, People, Document, Flag, Star, Pin, Flame, Heart. Defaults to the first icon (Calendar) in {{Add Note}}.
##* {{Color}} *(Mandatory — red asterisk* {{*}}*)*: Two-row color palette offering 20 color swatches with a white checkmark on the selected swatch. Defaults to the first swatch ({{#184C99}}, dark blue) in {{Add Note}}.
##* {{Note}} *(Optional — no asterisk)*: Single-line text input ({{placeholder="Note"}}) with a *maximum length of 50 characters* ({{maxlength="50"}}). Displays a live character counter {{(0/50)}} up to {{(50/50)}} at the top-right of the input and blocks typing beyond 50 characters.
## *Modal Action Buttons & Direct DB Persistence*:
##* {{[ Cancel ]}} *Button* (left, secondary outlined): Closes the modal without applying changes to the week cell.
##* {{[ Delete ]}} *Button* (red text button, visible *only* in the {{Edit Note}} modal):
##** Clicking {{[ Delete ]}} triggers the delete confirmation modal per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 11–13|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=eLCZ9N]:
##*** *Modal Type*: {{Confirmation Modal - Style 2}}
##*** *Title*: {{Delete Note}}
##*** *Message*: {{Are you sure you want to delete the selected note?}}
##*** *Buttons*: {{[ Delete ]}} (primary destructive) / {{[ Cancel ]}} (secondary outlined)
##** Clicking {{[ Delete ]}} in the confirmation modal deletes the note record from the database immediately via API, removes the note and icon from that week cell, reverts the cell to its empty state, closes both modals, and displays a success toast notification:
##*** *Title*: {{Delete Success}}
##*** *Message*: {{Delete Note Successfully.}}
_(If deletion fails, displays toast fail: Title:_ {{Delete Failed}}_, Message:_ {{Delete Note Failed.}}_)_
##* {{[ Save ]}} *Button* (right, primary blue):
##** *Add Note Modal*: Persists the new note record to the database immediately via API, renders the selected Icon, Color, and updated Note tooltip on the week cell, closes the modal, and displays a success toast notification:
##*** *Title*: {{Save Success}}
##*** *Message*: {{Save Note Successfully.}}
_(If save fails, displays toast fail: Title:_ {{Save Failed}}_, Message:_ {{Save Note Failed.}}_)_
##** *Edit Note Modal*: Persists the updated note record to the database immediately via API, renders the updated Icon, Color, and Note tooltip on the week cell, closes the modal, and displays a success toast notification:
##*** *Title*: {{Edit Success}}
##*** *Message*: {{Edit Note Successfully.}}
_(If edit fails, displays toast fail: Title:_ {{Edit Failed}}_, Message:_ {{Edit Note Failed.}}_)_
# *Direct Database Persistence & Independence from* {{[ Update Progress ]}}:
## *Immediate DB Commit*: Note creation and editing operations directly update to the database immediately upon clicking {{[ Save ]}}; note deletion prompts the Style 2 confirmation dialog and directly deletes from the database upon clicking {{[ Delete ]}}.
## *Strict Separation from Progress Commit*: Note mutations operate completely independently from the {{[ Update Progress ]}} button on the Timeline toolbar ([ETM-7349|https://pttep.atlassian.net/browse/ETM-7349]).
## *Draft Independence*: Successfully saving or deleting a note in the modal dialog does not mark the Timeline progress draft dirty ({{isDirty}} for progress tracking remains unaffected).
## *No Page-Level Unsaved Guard for Notes*: Because note updates are persisted directly to the database upon modal confirmation, navigating away from the Timeline page does not trigger an unsaved changes alert for notes.
## *Automatic Out-of-Timeframe Note Deletion*:
##* Notes strictly exist within the visible weekly timeframe grid.
##* The active weekly timeframe range can change or contract through two primary triggers per [ETM-7346|https://pttep.atlassian.net/browse/ETM-7346]:
##*# *Changes from Edit Plan (*[*ETM-7348*|https://pttep.atlassian.net/browse/ETM-7348]*)*: Modifying task {{Start Date}} / {{End Date}}, adding or deleting activities, or changing {{Shutdown Type}} ([ETM-7984|https://pttep.atlassian.net/browse/ETM-7984]) recalculates timeframe bounds upon clicking {{[ Save ]}}.
##*# *Deleting* {{Actual (%)}} *of Some Week (*[*ETM-7349*|https://pttep.atlassian.net/browse/ETM-7349]*)*: Clearing/deleting recorded {{Actual (%)}} entries in outer weeks that lie outside task dates and operational buffers contracts timeframe bounds upon clicking {{[ Update Progress ]}}.
##* If any such timeframe recalculation causes the active timeframe grid to contract or shift such that an existing note's week falls outside the recalculated timeframe range ({{week < Grid Start Week}} or {{week > Grid End Week}} per [ETM-7346|https://pttep.atlassian.net/browse/ETM-7346]):
##** The note is *automatically deleted from the database without any confirmation modal or warning prompt*.
##** Operational milestone notes do not artificially expand, anchor, or preserve weeks in the timeframe grid; when a week falls out of the timeframe bounds, its corresponding note is permanently deleted.
# *Field Specification Table (Milestones & Notes)*:

||Field Name||Data Type||Required?||Nullable?||Default Value||Max Length / Range / Enum||Notes||
|Icon|String|Yes|No|{{Calendar}}|10 Enum options|Selected from milestone icon list.|
|Color|String|Yes|No|{{#184C99}}|20 Hex color swatches|Selected from 20-swatch palette; default is {{#184C99}}.|
|Note|Text|No|Yes|Empty|Max 50 characters|Single-line operational note; optional.|

# *Empty State Specifications*:
## *First-Time State*: All weekly cells in the {{Key Milestones}} row initialize empty without icons.
## *Empty Note Content*: Hovering over an icon saved with empty text displays tooltip: {{No details.}}.
## *All Notes Deleted*: Deleting all notes reverts all cells to empty {{+}} hover state.
## *Out-of-Timeframe Recalculation State*: If all weeks containing notes fall outside the recalculated timeframe bounds, those notes are automatically deleted, returning the visible {{Key Milestones}} row to its empty state.
# *Role & Permission Visibility Matrix*:
## *View Access*: Users with *View Timeline* permission view note icons and hover tooltips.
## *Manage Access (Permission-Driven)*: Users with *Update Progress and Note* permission can click {{+}} to add notes and double-click to edit/delete notes directly in the modal dialog.
## *Without Permission*: Users without *Update Progress and Note* permission cannot open {{Add Note}} or {{Edit Note}} modals (the {{+}} hover button is hidden, and double-clicking is disabled).
# *Strict Cross-Module Isolation Rule*:
## Operational milestone notes operate strictly within the Shutdown Timeline dataset and do not modify annotations in *Shutdown Logic* or *Equipment Mob Plan*.

----

*UI Design*

* *Reference Mockup*: [Figma Shutdown Timeline - Key Milestones Modal & Notes (node-id: 184-148082)|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=184-148082&t=XoiP0U6ja05P9yIA-4].
* *Design System*: Built using PTTEP Nualta modal and icon components.

----

----

## Comments (before 2026-11-06T08:35)

### Thanawat Chongphipatmongkol, 2026-11-05T01:53

\[BA Specification Update - Sprint 25 Grooming Alignment\]

Summary of Acceptance Criteria (AC) refinements for ETM-7350:

1\. AC 1.2 & AC 1.3 (Permission-Driven Cell Interactions):  
   - Decoupled note management triggers from hardcoded roles (Turnaround Manager / Job Owner).  
   - Empty Cell Hover: The "+" button is revealed exclusively for users with "Update Progress and Note" permission. Users without this permission cannot view or interact with the "+" button.  
   - Double-Click Trigger: Double-clicking an existing milestone icon opens the "Edit Note" modal dialog exclusively for users with "Update Progress and Note" permission. View-only users without this permission cannot open the modal (double-click is inactive; hover tooltip remains active).

2\. AC 3.5 (Timeframe Grid Contraction Triggers & Concrete Examples):  
   - Aligned the operational triggers and examples that contract/shift the weekly timeframe grid directly with ETM-7346:  
     1\. Changes from Edit Plan (ETM-7348): Modifying task Start Date / End Date, adding/deleting activities, or changing Shutdown Type (ETM-7984) upon clicking \[ Save \].  
     2\. Deleting Actual (%) of Some Week (ETM-7349): Clearing/deleting recorded actual progress in outer weeks outside task dates and operational buffers upon clicking \[ Update Progress \].  
   - Clarified that when any such recalculation causes an existing note's week to fall outside the active timeframe range, the note is automatically deleted from the database without any confirmation modal or warning prompt.

3\. Section 6 (Role & Permission Visibility Matrix):  
   - Standardized all access rows to reference granular permissions ("View Timeline" and "Update Progress and Note") rather than specific personas.

4\. Reference Links:  
   - Updated SharePoint reference URL token for "Shutdown Timeline Validation&Result.xlsx" to the latest version (e=eLCZ9N).

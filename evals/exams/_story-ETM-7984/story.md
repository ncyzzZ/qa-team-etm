# ETM-7984 Shutdown Timeline - Shutdown Size Change, Plan Recalculation & Historical Progress Preservation
Frozen for a defect exam: description as it was before 2026-11-12T16:57 (Jira changelog version of 2026-11-12T16:07, Jira wiki markup; 0 later edits not included), comments written before 2026-11-12T16:57 only. Images removed.

## Description

*As a* Turnaround Manager  
*I want to* switch the active Shutdown Size classification from the Edit Plan screen, automatically recalculating task dates and weekly planned distributions while strictly preserving recorded actual progress and custom user edits  
*So that* I can adjust the preparation schedule to match updated event severity without losing historical tracking data or customized task descriptions.

----

*Pre-Conditions*

* The user is logged in as a *Turnaround Manager* with *View Timeline* and *Edit Plan* permissions in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Edit Plan* screen ({{Edit Shutdown Timeline Plan}}) of an active Shutdown Event ([ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]).

----

*Data Source*

* *Master Default Plan Spreadsheet*: [Shutdown Timeline Default Plan.xlsx — Sheet: Initial Timeline & Sheet: Shutdown Date|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci] (Columns A–B for {{ID}} and {{Type}}; Columns C–F for {{Activity}}, {{Action By}}, {{Focal Point}}, and {{Plan (%)}}; Columns G–I for {{Major SD}}, Columns J–L for {{Medium SD}}, Columns M–O for {{Minor SD}}).
* *Validation & Result Reference*: [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU].
* *Parent Shutdown Event*: {{Ramp Down Date}} ({{Start Date}}) and {{Ramp Up Date}} ({{End Date}}) in {{UTC+7}}.

----

*Acceptance Criteria*

# *Shutdown Size Selector & Placement*:
## The *Shutdown Size* selector is rendered as a dropdown selector on the top-right header of the *Edit Plan* screen ({{Edit Shutdown Timeline Plan}}, [ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]). _(On the main Timeline screen, the Shutdown Size badge is strictly read-only per_ [_ETM-7345_|https://pttep.atlassian.net/browse/ETM-7345]_)_.
## *Dropdown Options Order*: Options are displayed vertically in strict fixed order:
##* {{Major SD}} (Top)
##* {{Medium SD}} (Middle)
##* {{Minor SD}} (Bottom)
## *Classification Popover (*{{(i)}}*)*: Positioned immediately adjacent to the dropdown; hovering or clicking opens the criteria matrix popover ([ETM-7345|https://pttep.atlassian.net/browse/ETM-7345]).
## *Confirmation Modal on Changing Shutdown Size*:
##* Selecting a new Shutdown Size in the dropdown triggers a confirmation modal per [Shutdown Timeline Validation&Result.xlsx — Sheet: Confirmation&Result, Row 18|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Shutdown%20Timeline%20Validation%26Result.xlsx?d=w8ab8489cece34cf886c39401e4db5169&csf=1&web=1&e=jzysBU]:
##** Selecting the currently active Shutdown Size does not trigger the modal (the dropdown menu closes with no action).
##** Selecting a different Shutdown Size opens the confirmation modal:
##*** *Modal Type*: {{Confirmation Modal - Style 1}} (no top-right 'X' button; backdrop click is disabled).
##*** *Title*: {{Change Shutdown Size?}}
##*** *Message*: {{Are you sure you want to change the shutdown size? This action will update some data.}}
##*** *Buttons*:
##**** {{[ Cancel ]}} *Button* (left, secondary outlined): Closes the modal and reverts dropdown selection to previous classification without modifying any data or recalculating dates.
##**** {{[ Confirm ]}} *Button* (right, primary blue): Commits the classification change in the active working draft, updates the dropdown selector badge styling, and proceeds with deterministic task date and planned percentage recalculation.
# *Deterministic Task Date Recalculation Anchored to Ramp Down Date*:
## Upon confirming the change in the confirmation modal, the planned timeline for all default template tasks (identified by their permanent {{Template ID}} from Column A {{ID}}) is immediately recomputed:
##* Every default task's {{Start Date}} and {{End Date}} are recalculated anchored to the parent event's current {{Ramp Down Date}} ({{UTC+7}}) using the duration ({{days}}) and predecessor offset formulas of the newly selected classification from [Shutdown Timeline Default Plan.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci]:
##** Selecting {{Major SD}}: Applies Columns G, H, I.
##** Selecting {{Medium SD}}: Applies Columns J, K, L.
##** Selecting {{Minor SD}}: Applies Columns M, N, O.
## *Weekly Planned Distribution*: Weekly {{Plan (%)}} allocations across the active weeks of each task are automatically redistributed using the Day-Weighted Cumulative Pro-Rata Algorithm (Cumulative Difference) per [ETM-7346|https://pttep.atlassian.net/browse/ETM-7346].
# *Preservation of User Text Edits & Custom Row Sequence*:
## *Preserving Text Modifications via* {{Template ID}} *Matching*: Default tasks are matched by their immutable {{Template ID}} ({{ID}}), ensuring that if a user previously modified the text of {{Activity}}, {{Action By}}, or {{Focal Point}} on any default task, those custom text descriptions are *strictly preserved* (they are not overwritten by template spreadsheet text).
## *Preserving Custom Display Order*: If a user previously reordered Activity Groups or tasks within an Activity Group via vertical drag-and-drop, that custom display order is *strictly preserved*.
## *Resetting Planned Boundaries*: The task's total {{Plan (%)}} resets to the template Column F percentage, and its {{Start Date}} and {{End Date}} update to the recalculated dates of the selected Shutdown Size.
# *Addition of Missing Template Items at Bottom (*{{At Last}}*)*:
## *Adding Missing Activities via* {{Template ID}}: The system checks active tasks against the template IDs from [Shutdown Timeline Default Plan.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci]. If any template {{Template ID}} is missing from the active plan—whether it was previously deleted by the user or is a new task in the template spreadsheet—changing the Shutdown Size automatically adds that task into its parent Activity Group (matched by group {{Template ID}}):
##* The missing task is placed at the *bottom (*{{at last}}*)* of its matching Activity Group.
##* If there are multiple missing tasks within the group, they are appended at the bottom *following their sequential order in the template spreadsheet*.
##* Its {{Activity}}, {{Action By}}, and {{Focal Point}} descriptions are populated from the template spreadsheet.
##* Its {{Plan (%)}}, {{Start Date}}, and {{End Date}} are populated from the selected Shutdown Size formulas.
##* Its {{Status}} defaults to {{Open}}.
## *Adding Missing Activity Groups*: If any Activity Group from the template is missing from the active plan—whether previously deleted by the user or new in the template spreadsheet—changing the Shutdown Size automatically adds that Activity Group at the *bottom (*{{at last}}*)* of the table:
##* If there are multiple missing Activity Groups, they are appended at the bottom *following their sequential order in the template spreadsheet*.
##* Each restored or newly added Activity Group is populated with all its corresponding template child tasks following the template order.
# *Strict Preservation of Actual Progress & Custom Items*:
## *Preserving All Recorded Actual Progress*:
##* The system *strictly keeps all recorded weekly* {{Actual (%)}} *entries and total* {{Actual (%)}} *across all tasks* unchanged.
##* Existing actuals are never erased, truncated, or reset by changing the Shutdown Size.
## *Preserving Custom User-Added Items*:
##* Any custom Activity Groups added via {{+ Add Activity Group}} (carrying no template ID) remain intact.
##* Any custom Activities added via {{+ Add Activity}} (carrying no template ID) remain intact with their existing attributes and planned dates.
## *Preserving Operational Notes & Status*:
##* All {{Key Milestones}} notes and existing Activity {{Status}} values ({{Open}} / {{Close}}) remain intact.
# *Minor SD "Optional" Tasks Transition & Template Plan (%) Validation*:
## When the user switches to {{Minor SD}}:
##* The 11 tasks designated as {{"Optional"}} in Columns M–O of the spreadsheet reset their {{Plan (%)}} to the template Column F percentage, while their {{Start Date}} and {{End Date}} are cleared (set to empty).
##* Because {{Start Date}} and {{End Date}} are mandatory in Edit Plan ([ETM-7348|https://pttep.atlassian.net/browse/ETM-7348]), their empty cells display a *red background* ({{#FFCCC7}}) and *disable the* {{[ Save ]}} *button*.
##* The Turnaround Manager must either enter valid {{Start Date}} and {{End Date}} values for each optional task or click the trash icon ({{🗑️}}) to delete unwanted optional tasks before saving.
## When switching away from {{Minor SD}} to {{Major SD}} or {{Medium SD}}, all default tasks have concrete dates populated by template formulas, clearing the empty date validation errors.
## *Excel Template Total Plan (%) != 100% Validation*:
##* If the master Excel spreadsheet ([Shutdown Timeline Default Plan.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Shutdown%20TImeline/Shutdown%20Timeline%20Default%20Plan.xlsx?d=wba9fed7760c24143b992c5b58540a89c&csf=1&web=1&e=vmAWci]) has a total {{Plan (%)}} not equal to 100.0% (sum of Column F != 100.0%), or if custom user-added activities remain in the draft resulting in {{Total Plan (%) != 100.0%}}, switching Shutdown Size resets task planned percentages to the template values, resulting in {{Total Plan (%) != 100.0%}}.
##* The Edit Plan screen immediately displays the validation error on the {{Total Progress}} -> {{Plan (%)}} summary cell with a *red background* ({{#FFCCC7}}), displays tooltip: {{"Overall planned progress must equal 100%."}} per [Figma node-id: 301-975600|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=301-975600&t=eqJRrcAUvl2Rlz7M-4], and *disables the* {{[ Save ]}} *button*—in the exact same manner as the empty mandatory {{Start Date}} and {{End Date}} error for Minor SD optional tasks.
##* The Turnaround Manager cannot save the recalculated plan until task planned percentages are adjusted in the table to reach exactly {{100.0%}}.
# *Field Specification Table (Shutdown Size Transition)*:

||Field Name||Data Type||Required?||Nullable?||Default Value||Max Length / Range / Enum||Notes||
|Shutdown Size|Dropdown|Yes|No|Sourced from event|{{Major SD}}, {{Medium SD}}, {{Minor SD}}|Selectable on Edit Plan header.|
|Recalculate Dates|Boolean|Yes|No|True|Triggered on select|Re-anchors default tasks to Ramp Down Date.|
|Keep Actuals|Boolean|Yes|No|True|Hard invariant|Preserves all recorded weekly actuals.|

# *Empty State Specifications*:
## Recalculation applies to the active working draft; never produces an empty state.
# *Role & Permission Visibility Matrix*:
## *Access Guard*: Only users with *Edit Plan* can access the dropdown and trigger recalculation.
## *Job Owner*: View-only; cannot modify Shutdown Size.
# *Strict Cross-Module Isolation Rule*:
## Recalculating the timeline schedule updates the working draft within the Shutdown Timeline module and does not alter dates, logic, or resources in *Shutdown Logic*, *Worklist*, or *POB Management*.

----

*UI Design*

* *Reference Mockup*: [Figma Shutdown Timeline - Shutdown Type Dropdown & Validation (node-id: 301-975600)|https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=301-975600&t=eqJRrcAUvl2Rlz7M-4].
* *Design System*: Built using PTTEP Nualta dropdown and calculation feedback components.

----

## Comments (before 2026-11-12T16:57)

### Thanawat Chongphipatmongkol, 2026-11-05T02:26

\[QA Alignment & AC Refinement Summary\]  
This ticket has been updated to align with Figma frame (node-id: 301-975600) and QA clarifications:

1\. AC 1.4 (Confirmation Modal Specification):  
\- Refined Confirmation Modal - Style 1 details: Title: 'Change Shutdown Type?', Message: 'Are you sure you want to change the shutdown type? This action will update some data.'  
\- Button Inventory: '\[ Cancel \]' (secondary outlined, left) and '\[ Confirm \]' (primary blue, right).  
\- Interaction rules: Zero 'X' close button, backdrop click is disabled (preventing accidental dismissal), and selecting the currently active Shutdown Type closes the dropdown without triggering the modal.

2\. AC 6.3 (Validation & Feedback):  
\- Formally added validation tooltip: "Overall planned progress must equal 100%." when Total Plan (%) != 100.0% (red cell background #FFCCC7 and \[ Save \] button disabled), exactly matching Figma node 301-975600.

3\. UI Design:  
\- Updated Reference Mockup to deep-link directly to Figma frame node-id: 301-975600.

4\. QA Clarifications Confirmed:  
\- Start Date & End Date: Are mandatory columns in the Left Section (Cols 4 & 5) of Edit Plan per ETM-7348 AC 3.1 & ETM-7984 AC 6.1.  
\- Classification Popover Criteria: Uses Excel/ETM-7347 specification (Medium SD: TPSD 6-10 days, Train SD 12-20 days).  
\- Dropdown Colors: Follows ETM-7345 badge colors (Major = red, Medium = orange/amber, Minor = green); updates upon clicking \[ Confirm \].  
\- In-memory Draft: Type change recalculation is in-memory draft until \[ Save \] is clicked; navigating away triggers the standard 'Unsaved Change' modal.  
\- Custom Activities: Included in Total Plan calculation; grand total must equal 100.0% before saving.  
\- Actuals Preservation: Out-of-timeframe actuals remain visible in the grid (weeks do not contract while actuals exist) and preserve historical entries.  
\- Excel Master Formulas: Respective column sets (Major: G-I, Medium: J-L, Minor: M-O) and predecessor offsets (e.g. Row 27 formulas) are strictly followed as intended by business.  
\- Cross-Module Isolation: Changing Shutdown Type in Timeline strictly updates Timeline planning classification and does NOT alter parent Event Details SD Type (FSD/PSD/MRU C/O).

### Thanawat Chongphipatmongkol, 2026-11-11T13:50

**Story updated on 11 Nov 2026: "Shutdown Type" renamed to "Shutdown Size"**

The Shutdown Timeline classification (`Major SD` / `Medium SD` / `Minor SD`) is now called **Shutdown Size**. This avoids confusion with the Shutdown Event's SD Type (FSD / PSD / MRU C/O), which keeps its name. There is no change in behavior.

**User-facing text that changes (UI):**

* Dropdown label on the Edit Plan header and the read-only badge on the Timeline screen: **Shutdown Size**
* Confirmation modal (AC 1.4):

    * Title: `Change Shutdown Type?` → `Change Shutdown Size?`
    * Message: `Are you sure you want to change the shutdown type? …` → `Are you sure you want to change the shutdown size? This action will update some data.`
    
* Field Specification Table (AC 7): field name **Shutdown Size**

**Wording only:** story title, I Want To, and AC 1, 3.3, 4.1, 4.2, 5.1, 6.3, 8.2 now say "Shutdown Size".

**Not changed:** the `Type` column (Column B) in Shutdown Timeline Default Plan.xlsx, and the Figma frame name "Shutdown Type Dropdown & Validation".

**Follow-ups:**

* Shutdown Timeline Validation&Result.xlsx, Confirmation&Result sheet, Row 18 must be updated to the new modal text.
* The Figma labels need updating.
* QA: please update test cases that check the modal text.

The same rename applies to [ETM-8405](https://pttep.atlassian.net/browse/ETM-8405) AC 5. The other Timeline stories will follow.

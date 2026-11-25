# ETM-7311 Equipment Mob Plan - Edit Equipment & Data Validation
Frozen for a defect exam: description as it was before 2026-10-28T14:53 (Jira changelog version of 2026-10-27T17:01, Jira wiki markup), comments written before 2026-10-28T14:53 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* edit existing equipment records directly in the grid cells with data validation
*So that* I can adjust dimensions, contact persons, platforms, transportation methods, or mobilization dates as requirements evolve.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *Edit Equipment Mob Plan* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Equipment Mob Plan* dashboard page.
* At least one equipment record exists in the table.

----

*Data Source*

* Equipment records catalog, active Asset platforms master, and Working Location (Deck) master.
* *Validation & Result*: [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW].
* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions

----

*Acceptance Criteria*

# *Inline Cell Editing Controls*:
## Clicking any editable cell within an equipment row activates inline edit mode for that cell:
##* {{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Department}}, {{Item No. in Plot Plan}}, {{MMR No.}} (Max 30 characters), {{Vessel Name}}, {{Remark}}: Text inputs.
##* {{Premob Inspection}}: Single-select dropdown ({{Yes}}, {{No}}).
##* {{Material Ready at SKL}}, {{Require at Offshore}}, {{Backload to SKL}}, {{Loading at PSB}}: Date picker popovers ({{DD Mon YYYY}}).
##* {{Platform}}: Single-select dropdown populated with all platforms under the current shutdown asset.
##* {{Deck}}: Combo-box dropdown pre-populated with standard _Working Location (Deck)_ options, while permitting custom free-text entry.
##* {{Transportation}}: Dropdown containing {{Supply Vessel}}, {{Crew Boat}}, {{MSB}}, {{Helicopter}}.
##* {{Priority}}: Dropdown containing {{1}}, {{2}}, {{3}}.
##* {{Status}}: Dropdown containing 10 lifecycle statuses: {{Inspected}}, {{Delivered at PSB}}, {{MMR Issued}}, {{Vessel Assigned}}, {{In Transit}}, {{Received}}, {{Ready for Backload}}, {{Backloaded}}, {{Delay}}, {{Cancel}}.
##* {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}: Numeric decimal inputs.
##* {{Area (m2)}}: *Disabled / Read-only*. Direct typing is disallowed.
# *Real-Time Calculation & Data Constraints (Aligned with* [*Equipment Mob Plan Validation&Result.xlsx*|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW]*)*:
## *Area Auto-Calculation*:
##* As soon as valid numeric values exist for {{Width}} and {{Length}}, {{Area (m2)}} immediately computes and renders {{Width * Length}} (rounded to 2 decimal places using standard rounding half-up).
##* If either {{Width}} or {{Length}} is empty or invalid (0 or negative), {{Area}} displays {{-}}.
## *Dimensions & Weight Constraints*:
##* {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, and {{Gross Wt. (Tons)}}: Entering <= 0 or clearing existing value to leave blank highlights the cell with a red background only (no red border; no red background in initial state upon row addition; no popover notification is displayed). Typing negative signs ({{-}}) is strictly blocked.
##* *Decimal Precision*: Typing beyond 2 decimal places is strictly blocked. Pasting numeric values with >2 decimal places automatically rounds them to 2 decimal places.
## *Date Chronological Sequence Validation & Date Picker Blocking*:
##* The date milestone sequence must strictly satisfy: {{Material Ready at SKL <= Require at Offshore <= Backload to SKL}}.
##* Dates are permitted to be equal ({{Material Ready at SKL = Require at Offshore = Backload to SKL}}).
##* {{Loading at PSB}} operates independently without sequential chronological constraints against other milestones.
##* *Date Picker Selection Blocking (No Red Background)*: The interactive Date Picker popover calendar strictly *blocks and disables* selecting any date that violates this sequence:
##** When selecting {{Require at Offshore}}, calendar dates prior to {{Material Ready at SKL}} are disabled/unselectable.
##** When selecting {{Backload to SKL}}, calendar dates prior to {{Require at Offshore}} are disabled/unselectable.
##** If modifying {{Material Ready at SKL}}, calendar dates subsequent to {{Require at Offshore}} are disabled/unselectable.
##** Because violating dates are strictly blocked from selection within the Date Picker popover, conflicting dates cannot be selected and no red background styling is displayed.
##* *Pasting Date Data*: When date values are pasted from clipboard, chronological sequence is evaluated strictly left-to-right; conflicting dates are rejected, cleared to blank, trigger the {{Paste Validation Failed}} modal, and do NOT show a red background (governed by [ETM-7351|https://pttep.atlassian.net/browse/ETM-7351]).
## *Mandatory Fields & Cell Error Highlighting (7 Columns Matching Header Asterisks* {{*}}*)*:
##* *Initial State vs. Deleted Data Rule (Aligned with* [*ETM-7310*|https://pttep.atlassian.net/browse/ETM-7310]*)*:
##** In the first state when an equipment row is newly added ({{just add equipment}}), blank mandatory cells do *NOT* display a red background (normal neutral cell background is maintained).
##** If a mandatory cell ({{Material Description}}, {{WIN# No. (CCU No.)}}, {{Contact Person}}, {{Width (m)}}, {{Length (m)}}, {{Height (m)}}, {{Gross Wt. (Tons)}}) has data and is subsequently deleted/cleared to leave it blank, the cell background turns *red* (red background only, no red border) and displays the inline warning: {{This field is required.}} (referenced in [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW]).
##* *Error Clearance*: Entering a valid value immediately clears the red background and error state.
##* *Save Button Guard*: While any mandatory cell across the grid remains highlighted with a red background, the header {{[ 💾 Save ]}} button blocks saving.
## *MMR No. Constraint*:
##* Entering or editing text in {{MMR No.}} strictly enforces a maximum length of 30 characters. Any input exceeding 30 characters is automatically truncated/blocked.
# *Persisting Changes & Concurrency Guard*:
## Clicking {{[ 💾 Save ]}} in the page header:
##* Validates all modified rows across the entire grid against required fields, dimension minimums, and date sequence ordering.
##* If all rows pass validation: persists changes to backend, displays a success toast notification: Title {{Save Success}}, Message {{Save Equipment Mob Plan Successfully}} (referenced in [Equipment Mob Plan Validation&Result.xlsx|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW]), updates {{Last update on [DD Mon YYYY]}}, and disables the Save button.
##* If any row contains validation errors: blocks saving, scrolls to the first invalid row, and displays a toast: {{Please correct the highlighted errors before saving.}}
## *Concurrency Guard (Plan Deleted in Another Session)*: If the active plan has been deleted by another user or session, attempting to click {{[ 💾 Save ]}} or {{[ ⤓ Export ]}} displays the confirmation modal: Title {{Unable to Save Equipment Mob Plan}}, Message {{The equipment mob plan has already been deleted.}} Clicking {{[ OK ]}} automatically redirects the user back to the Planning Tab.
# *Unsaved Changes Navigation Guard (Aligned with* [*ETM-5616*|https://pttep.atlassian.net/browse/ETM-5616]*)*:
## If user attempts to leave or navigate away from the Equipment Mob Plan page (including clicking browser Back, sidebar menu links, or breadcrumb links) while unsaved modified equipment changes exist, the system displays the *Unsaved Change* confirmation modal with *Continue Editing* and *Discard Change* buttons:
##* *Continue Editing*: Closes the modal and remains on the page with modified draft changes intact.
##* *Discard Change*: Discards all unsaved cell edits and navigates away from the page.
_(Warning body copy referenced in_ [_Equipment Mob Plan Validation&Result.xlsx_|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Form%20Validation%20%26%20Result/Equipment%20Mob%20Plan%20Validation%26Result.xlsx?d=w487bb1713867413e825c182286028918&csf=1&web=1&e=9kjkhW]_)_.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105875 & Frame 1010105877|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

## Comments (before 2026-10-28T14:53)


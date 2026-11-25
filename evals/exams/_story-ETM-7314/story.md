# ETM-7314 Equipment Mob Plan - Multi-Criteria Filter Panel
Frozen for a defect exam: description as it was before 2026-10-29T13:23 (Jira changelog version of 2026-10-22T15:38, Jira wiki markup; 1 later edits not included), comments written before 2026-10-29T13:23 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* filter equipment records using a multi-criteria filter panel
*So that* I can quickly locate specific containers, equipment types, or department allocations across all work headers.

----

*Pre-Conditions*

* A user must be successfully *logged into the system* and possess the *View All Equipment Mob Plan Item* or *View Active Equipment Mob Plan Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user is on the *Equipment Mob Plan* dashboard page.
* No specific permission for filter; if a user has permission to see the page, they see the filter.

----

*Data Source*

* Equipment Mob Plan data records and active filter state.
* *Role & Permission*: [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC] — Sheet: Permissions

----

*Acceptance Criteria*

# *Triggering Filter Panel & Layout Architecture*:
## Clicking the *Filter* icon ({{🝖}}) in the top-right toolbar opens a sliding drawer from the right side of the screen (*Filter Panel*).
## The panel header displays the title *Filter Panel* on the left and a single *Reset* action on the right.
## The panel does *not* feature an "Apply" button; all filtering actions execute *real-time* across the data grid.
## The drawer remains open after adjusting filters; the user manually closes the panel by clicking the toolbar Filter icon again.
# *Filter Panel Default Collapsed Section State*:
## Upon opening the Filter Panel drawer, all filter accordion sections render in a *collapsed* state by default.
## Clicking any section header or its chevron icon expands that individual section, displaying its search field and selection options.
## *State Preservation during Session*: If the user expands specific sections, closes the Filter Panel, and reopens it within the same active browser session without a page reload, the user's manual section expansion states and any typed search queries are preserved. A browser reload resets all sections to the default collapsed state.
# *Filter Criteria Fields & Dynamic Sourcing (All 23 Column Fields Matching Design)*:
## *Material Description*: Searchable multi-select / text input with auto-trim; substring contains match, case-insensitive, supports Thai and special characters.
## *WIN# No. (CCU No.)*: Searchable multi-select / text input; substring contains match, case-insensitive.
## *Contact Person*: Multi-select of distinct assignees present in the active plan.
## *Department*: Multi-select of distinct departments present in the active plan.
## *Premob Inspection*: Multi-select dropdown ({{Yes}}, {{No}}).
## *Width (m)*: Numeric range inputs ({{From}} and {{To}}) / number filter.
## *Length (m)*: Numeric range inputs ({{From}} and {{To}}) / number filter.
## *Height (m)*: Numeric range inputs ({{From}} and {{To}}) / number filter _(re-added per specification)_.
## *Area (m2)*: Numeric range inputs ({{From}} and {{To}}) / number filter.
## *Gross Wt. (Tons)*: Numeric range inputs ({{From}} and {{To}}) / number filter.
## *Platform*: Multi-select of distinct platforms under the current asset.
## *Deck*: Multi-select of distinct deck locations present in the active plan.
## *Item No. in Plot Plan*: Searchable multi-select / text input.
## *Transportation*: Multi-select ({{Supply Vessel}}, {{Crew Boat}}, {{MSB}}, {{Helicopter}}).
## *Material Ready at SKL*: Date range pickers ({{From}} and {{To}}).
## *Require at Offshore*: Date range pickers ({{From}} and {{To}}).
## *Backload to SKL*: Date range pickers ({{From}} and {{To}}).
## *Status*: Multi-select containing the 10 lifecycle statuses in order: {{Inspected}}, {{Delivered at PSB}}, {{MMR Issued}}, {{Vessel Assigned}}, {{In Transit}}, {{Received}}, {{Ready for Backload}}, {{Backloaded}}, {{Delay}}, {{Cancel}}.
## *Priority*: Multi-select ({{1}}, {{2}}, {{3}}).
## *MMR No.*: Searchable multi-select / text input (max 30 characters; typing > 30 is blocked, pasting > 30 is auto-truncated).
## *Vessel Name*: Searchable multi-select / text input with auto-trim; substring contains match, case-insensitive.
## *Loading at PSB*: Date range pickers ({{From}} and {{To}}).
## *Remark*: Searchable multi-select / free-text input.
#* *Date & Numeric Range Rules*:
#** Entering only {{From}} filters records with value >= From. Entering only {{To}} filters records with value <= To. Entering both filters the inclusive range {{[From, To]}}.
#** Records with blank/null values in date or numeric fields are hidden when that specific filter is active.
#** If {{From}} is greater than {{To}}, the input prevents invalid selection and displays a red border.
# *"Select Only Search Results" Mechanics*:
## In each expanded multi-select section, when the in-section {{Search}} field is blank, only the standard *Select All* checkbox is shown.
## When typing a query matching one or more items, the *Select only search results* checkbox appears directly below *Select All*.
## Checking *Select only search results* checks all currently matching items while preserving the state of non-matching (hidden) items.
## If a search query yields zero matches, the list displays {{"No option"}} and hides selection checkboxes.
# *Real-Time Grid Filtering & Work Header Visibility Rules*:
## *Cross-Field Logic*: Multiple filter criteria operate in a cumulative {{AND}} relationship (records must satisfy all active filters).
## *In-Field Multi-Select Logic*: Multiple selected values within the same criteria operate in an {{OR}} relationship.
## *Strict Work Header Visibility Rule*:
##* If all equipment items under a Work Header are filtered out (0 matching items), the *Work Header row itself is completely hidden*.
##* There is *no state* that displays {{No results found for the selected filter criteria.}} or {{No equipment matches the selected filters.}}
##* If every equipment item across all Work Headers is filtered out, all Work Header rows are hidden, leaving an empty table body with only table headers and the toolbar.
# *Reset Behavior & Persistence Lifecycle*:
## *Single Reset Action (Header)*: Clicking *Reset* in the Filter Panel header resets all filter criteria, search fields, and checkbox selections across all accordion sections to default (all checkboxes checked, date pickers cleared), immediately restoring all table rows in real time.
## *Session Persistence*: Active filter selections persist across drawer close/reopen within the same active page session.
## *Reload / Unsaved Reset*: Active filter criteria are local view states; if the user refreshes the page or logs out without saving, filters reset to the default view. Authorized users with {{Edit Equipment Mob Plan}} can persist the view via the page-level *Save* button.

----

*UI Design*

* *Reference Mockup*: [Figma - Equipment Mob Plan: Frame 1010105878|https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70&t=yRIkYATbDRSj04bG-1]
* *Design System*: Built using PTTEP Nualta Design System tokens.

----

## Comments (before 2026-10-29T13:23)


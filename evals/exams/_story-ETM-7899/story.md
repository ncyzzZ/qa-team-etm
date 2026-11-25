# ETM-7899 [Improvement] Shutdown Logic - Dedicated Platform and Work Header Filters in Filter Panel
Frozen for a defect exam: description as it was before 2026-11-12T05:23 (Jira changelog version of 2026-11-04T00:05, Jira wiki markup; 0 later edits not included), comments written before 2026-11-12T05:23 only. Images removed.

## Description

*As a* Turnaround Manager or Job Owner
*I want to* filter tasks in the Shutdown Logic Gantt table using dedicated Platform and Work Header filters in the global Filter Panel
*So that* I can isolate work scopes, schedules, and resource demands for a specific offshore platform or work header without visual interference from other platforms or scopes.

----

*Pre-Conditions*

* The user is logged into the STMS application as a *Turnaround Manager* or *Job Owner*.
* The user possesses the *View Active Shutdown Logic Item* or *View All Shutdown Logic Item* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The user has navigated to the *Shutdown Logic* detail page of an active Turnaround Plan.

----

*Data Source*

* *Worklist Hierarchy Level 1*: Platform name ({{platform_name}}) sourced from the active Turnaround Plan dataset.
* *Worklist Hierarchy Level 2*: Work Header name ({{work_header_name}}) sourced from the active Turnaround Plan dataset.
* *Filter Architecture Reference*: [ETM-11|https://pttep.atlassian.net/browse/ETM-11] (View Gantt Table — Multi-Level Data Sorting Hierarchy and Master Data Sequence), [ETM-12|https://pttep.atlassian.net/browse/ETM-12] (Gantt Table Column Filter), [ETM-6778|https://pttep.atlassian.net/browse/ETM-6778] (Priority Column Filter in Gantt Table), and [ETM-7287|https://pttep.atlassian.net/browse/ETM-7287] (Multi-Criteria Filter - Select Only Search Results Option and Collapsed Default State).

----

*Acceptance Criteria*

# *Filter Panel Placement, Section Ordering & Active Indicators*:
## *Filter Panel Top Placement*: In the right-side global *Filter Panel* drawer (opened via the filter toolbar button {{🝖}} per [ETM-12|https://pttep.atlassian.net/browse/ETM-12]), the system renders dedicated filter accordion sections for:
### *Platform* (Level 1) — positioned as the first accordion section at the top of the Filter Panel.
### *Work Header* (Level 2) — positioned directly below *Platform* as the second accordion section at the top of the Filter Panel.
### All other existing filter criteria sections (starting with *Description*, followed by *Activity Group*, *Priority* per [ETM-6778|https://pttep.atlassian.net/browse/ETM-6778], *Duration*, *Date*, *Predecessor*, *Successor*, *SIMOP*, *Location*, and *Manpower Resource*) render below *Work Header*.
## *Default Collapsed State*: Per [ETM-7287|https://pttep.atlassian.net/browse/ETM-7287], upon opening the *Filter Panel* drawer, both the *Platform* and *Work Header* accordion sections render in a *collapsed* state by default. Clicking an accordion header or its chevron expands that section.
## *Active Filter Indicator (Blue Dot)*:
##* When one or more options within the *Platform* section are unchecked, a *blue dot* indicator appears next to the *Platform* accordion section label in the Filter Panel.
##* When one or more options within the *Work Header* section are unchecked, a *blue dot* indicator appears next to the *Work Header* accordion section label in the Filter Panel.
##* A corresponding *blue dot* indicator appears on the global filter toolbar icon ({{🝖}}) when any filter is actively applied.
##* When all options in a section are checked (or reset), the corresponding section blue dot indicator disappears.
# *Filter Options, Sorting & Search Mechanics*:
## *Categorical Multi-Select Option Lists & Existing Data Scope*:
##* The *Platform* filter section displays a multi-select checkbox list of unique Platform values present in the current plan dataset.
##* The *Work Header* filter section displays a multi-select checkbox list of unique Work Header values present in the current plan dataset.
##* *Existing Data Scope Only (Not All Master Data)*: Filter selection lists strictly display only values currently existing and active in the schedule dataset, not all entries from the Master Data catalog. Master Data is referenced exclusively to establish the sequential sorting order among these existing items.
##* *No Blank Option*: Platform and Work Header cannot be blank in the plan schedule, so the filter option lists strictly contain only valid, non-blank values (no blank or null option is displayed in the filter).
## *Sorting Order (Master Data Sequence Cross-Reference)*:
##* *Platform Sort*: Options in the *Platform* filter checkbox list are sorted strictly according to the sequence defined in the *Master Data* per [ETM-11|https://pttep.atlassian.net/browse/ETM-11] (matching the Level 1 order in the Gantt table).
##* *Work Header Sort*: Options in the *Work Header* filter checkbox list are sorted strictly according to the canonical sequence defined in the *Master Data* per [ETM-11|https://pttep.atlassian.net/browse/ETM-11].
##* *Cross-Reference Note on Work Header Sequence*: Because individual platforms do not all contain the identical set of Work Headers, sorting Work Headers strictly by their visual appearance order across rows in the Gantt table would cause confusion (e.g. Work Headers present only on later platforms appearing at the bottom of the list regardless of their standard sequence). Therefore, the Work Header filter list must strictly follow the canonical Master Data sequence rather than row appearance order.
## *Master "Select All" Option*:
##* Each section provides a master {{Select All}} checkbox at the top of its option list.
##* *Default State*: {{Select All}} is *Checked*, with all individual option checkboxes checked.
##* Checking {{Select All}} checks all options in that section.
##* Unchecking {{Select All}} unchecks all options in that section.
##* When a subset of options is checked, {{Select All}} displays an indeterminate state ({{[-]}}).
## *"Select only search results" Search Mechanics* (aligned with [ETM-7287|https://pttep.atlassian.net/browse/ETM-7287]):
##* *Search Input Field*: Each section includes an inline *Search* text input above the option list.
##* *Empty Search Field*: When the search field is blank ({{""}}), the conditional *Select only search results* checkbox is *Hidden*.
##* *Populated Search Field (Matches ≥ 1 Option)*: When the user types search text that matches one or more options:
##** The matching options are displayed in the list.
##** The *Select only search results* checkbox becomes *Visible* directly below {{Select All}}.
##** Checking *Select only search results* checks all currently matching search results; non-matching (hidden) options retain their prior checked/unchecked state.
##** Unchecking *Select only search results* unchecks all currently matching search results; non-matching (hidden) options retain their prior checked/unchecked state.
##** The parent {{Select All}} checkbox updates its display state accordingly (*Checked* if all options in the section are selected, *Indeterminate* if a subset is selected, *Unchecked* if none are selected).
##* *Search Query Clearing*:
##** When the search field is cleared (manually via keyboard or by triggering the single *Reset* button in the Filter Panel), the full option list is restored and the *Select only search results* checkbox is immediately *Hidden*.
##* *Empty Search Query in Filter Section ("No option")*: If a search query matches zero options in that section, both {{Select All}} and {{Select only search results}} are *Hidden*, and the section list area displays the exact text message: {{"No option"}}.
# *Hierarchy Filtering Rules & Empty Space Behavior*:
## *Platform Hierarchy Hiding Rule*:
##* Filtering by Platform evaluates the Level 1 root node:
##* If a Platform is unchecked in the Platform filter, that Platform (Level 1) row and ALL of its descendant Work Headers (Level 2), Works (Level 3), and Work Breakdowns (Level 4) MUST be completely hidden from the Gantt table.
## *Work Header Hierarchy Hiding Rule & Parent Auto-Hiding*:
##* Filtering by Work Header evaluates the Level 2 node:
##* If a Work Header is unchecked in the Work Header filter, that Work Header (Level 2) row and ALL of its descendant Works (Level 3) and Work Breakdowns (Level 4) MUST be hidden from the Gantt table.
##* Its parent Platform (Level 1) row remains visible if at least one other child Work Header under that Platform remains checked and visible.
##* *Parent Platform Auto-Hiding*: If all child Work Headers under a given Platform are unchecked or filtered out (resulting in zero visible child tasks for that Platform), the parent Platform (Level 1) row MUST also be automatically hidden from the Gantt table.
## *Empty Table State (No Search / Filter Results)*:
##* If the active filter selections (Platform, Work Header, or cumulative combination with other filters) match zero tasks/rows in the plan:
##** The Gantt table header row (with all column titles) remains fully displayed.
##** Directly underneath the table header, the system displays *empty space* (all rows are hidden, and no text message or placeholder banner is displayed), leaving an empty table body under the table header.
# *Cumulative Filtering, Dependency Arrows & Dynamic Histogram Impact*:
## *Cumulative Logic (AND Relationship)*: The Platform and Work Header filters operate in a cumulative {{AND}} logical relationship with all other active filters (Activity Group, Priority per [ETM-6778|https://pttep.atlassian.net/browse/ETM-6778], Duration, Date, Predecessor, Successor, SIMOP, Location, Manpower Resource per [ETM-12|https://pttep.atlassian.net/browse/ETM-12]), the Custom View expansion state, and the Focus Critical Path ([ETM-5408|https://pttep.atlassian.net/browse/ETM-5408]) and Focus Dropped Task ([ETM-5406|https://pttep.atlassian.net/browse/ETM-5406]) toggles. A row renders if and only if all active filter conditions are simultaneously met.
## *Dependency Arrow Filtering*: Dependency lines/arrows on the Gantt chart render if and only if both predecessor and successor tasks remain visible. If either task belongs to a filtered-out Platform or Work Header (or is excluded by any other active filter), its dependency line is not drawn.
## *Dynamic Resource Histogram Impact*:
##* Filtering out a Platform or Work Header, or toggling Focus Critical Path / Focus Dropped Task, immediately excludes non-matching tasks from the lower Manpower Resource Histogram calculation; when the *Used Resource* toggle is ON, resources whose demand drops to zero across the visible schedule are automatically hidden per [ETM-7898|https://pttep.atlassian.net/browse/ETM-7898].
##* If all resources drop to zero demand such that there is no resource to display, the histogram renders blank space under the header without displaying any placeholder message.
# *Dynamic Option Synchronization, Reset Action & Persistence Lifecycle*:
## *Dynamic Option Synchronization on Data Mutations*:
##* When a new task is added or an existing task's Platform or Work Header is edited, any newly introduced value immediately registers in the respective filter list, positioned in accordance with the canonical Master Data sequence per [ETM-11|https://pttep.atlassian.net/browse/ETM-11].
##* When a task is deleted (or its value changed), if no remaining active tasks in the Gantt grid possess that Platform or Work Header value, the obsolete option is automatically purged from the filter list.
## *Filter Reset Action* (aligned with [ETM-7287|https://pttep.atlassian.net/browse/ETM-7287]):
##* Clicking the single *Reset* button at the top-right of the Filter Panel drawer simultaneously resets all filters:
##** Restores {{Select All}} to *Checked* and checks all options across Platform, Work Header, and all other criteria.
##** Clears all search inputs across all sections to empty string ({{""}}), reverting placeholder text to {{"Search"}}.
##** Hides all conditional {{Select only search results}} checkboxes.
##** Clears all blue dot indicators from section headers and the toolbar filter button.
## *Save Configuration & Persistence Scope*:
##* *Turnaround Managers*: Clicking the page-level *[ Save ]* button commits the active filter configuration to the database to be restored upon subsequent sessions.
##* *Job Owners*: Job Owners can use the filters in real-time to explore the schedule, but their filter state is transient and not committed to the shared database.
## *Permission Visibility*:
##* *Base Access*: Users with *View All Shutdown Logic Item* or *View Active Shutdown Logic Item* permission can access the Shutdown Logic dashboard, view the Gantt Table, and use the filters in real-time.
##* *Additional Permission*: Users with *Edit Shutdown Logic Table and Visualization* permission can save filter configurations.

----

*UI Design*

* *Reference Mockup*: Pending ([Link to Figma|https://www.figma.com/design/4kxDnzxVKdxkaV56cj840w/EMI---Turnaround--Shutdown-Logic-1-?node-id=72-1079263&t=IXyiJbIeEaJiAOIw-4])
* *Design System*: Built using PTTEP Nualta Design System tokens and components (Drawer, Accordion, Checkbox, Search Input, and Table components).

----

----

## Comments (before 2026-11-12T05:23)

### Thanawat Chongphipatmongkol, 2026-11-04T00:06

\[Change Log - Story Refinements & Acceptance Criteria Alignment\]

1\. AC 1.1.3 (Filter Section Ordering):  
   - Corrected the existing filter criteria order below Work Header to explicitly start with Description (Description, Activity Group, Priority per ETM-6778, Duration, Date, Predecessor, Successor, SIMOP, Location, Manpower Resource).

2\. AC 1.3 (Column Header Filter Absence):  
   - Removed redundant subsection regarding absence of table column filters. Renumbered Active Filter Indicator (Blue Dot) as AC 1.3.

3\. AC 2.1 & AC 2.2 (Data Scope & Master Data Sorting):  
   - Clarified that filter option lists display only unique values currently existing in the active schedule dataset (not the entire Master Data catalog).  
   - Added explicit cross-reference note confirming that Platform and Work Header filter selections follow the canonical Master Data sequence from ETM-11 (preventing confusion since individual platforms do not contain the identical set of Work Headers).

4\. AC 3.2 (Parent Platform Auto-Hiding):  
   - Updated hierarchy hiding behavior: if all child Work Headers under a given Platform are unchecked or filtered out, the parent Platform (Level 1) row is also automatically hidden from the Gantt table.

5\. AC 3.4 (Consolidated into AC 4.3):  
   - Removed redundant AC 3.4. Dynamic resource histogram behavior is consolidated authoritatively under AC 4.3.

6\. AC 5.4 (Permission Visibility Clean-up):  
   - Removed unneeded "Without Permission" bullet point.

7\. UI Design:  
   - Updated reference mockup status to Pending with the latest Figma node link (node-id=72-1079263).

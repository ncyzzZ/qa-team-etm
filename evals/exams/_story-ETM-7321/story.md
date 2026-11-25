# ETM-7321 [Improvement] Daily Report - Update Export PDF Template Table Header Color
Frozen for a defect exam: description as it was before 2026-10-15T14:06 (Jira changelog version of 2026-10-15T10:49, Jira wiki markup; 0 later edits not included), comments written before 2026-10-15T14:06 only. Images removed.

## Description

*As a* Turnaround Manager
*I want to* export the Daily Report PDF using updated soft ice-blue table header background styling
*So that* all summary cards, progress tables, and image sections in the exported report display a modern, visually cohesive palette aligned with executive reporting guidelines.

----

*Pre-Conditions*

* The user must be logged in as a *Turnaround Manager* on the *Daily Report* screen.
* The user possesses the *Export Daily Report* permission in [Role & Permission|https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC].
* The target Daily Report execution date is in a *Frozen* state.

----

*Data Source*

* *Export Template Specification*: [Export Template.docx|https://pttep.sharepoint.com/:w:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Daily%20Report/Export%20Template.docx?d=w64e2ec64a2af454fbac1be02a602641b&csf=1&web=1&e=0QPPoQ].
* *Daily Report Dataset*: Progress Summary table, Executive Note blocks, Attached Images, and Gantt chart per [ETM-5277|https://pttep.atlassian.net/browse/ETM-5277].

----

*Acceptance Criteria*

# *Table Header Background Shading Update (*{{#E3EFF3}}*)*:
## *Global Header Color Specification*: All table header rows across the exported PDF document must be formatted with solid background fill color {{#E3EFF3}} (Soft Pale Blue / Ice Blue tint).
## *Table 1: Executive Notes Table*:
##* *Row 1 Headers*: The header cells for {{Key Activities}} (Column 1) and {{Activities Plan for Tomorrow}} (Column 2) must have background fill {{#E3EFF3}}, Bold font, and Font Color Black ({{#000000}}).
##* *Row 3 Headers*: The header cells for {{Area of Concern}} (Column 1) and {{Remark}} (Column 2) must have background fill {{#E3EFF3}}, Bold font, and Font Color Black ({{#000000}}).
## *Table 2: Progress Summary Table*:
##* *Header Row*: The header cells for {{Activity Group}}, {{Weight (%)}}, {{Plan (%)}}, {{Actual (%)}}, and {{Note}} must have background fill {{#E3EFF3}}, Bold font, and Font Color Black ({{#000000}}).
## *Table 3: Attached Image Table*:
##* *Header Row*: The header cell for {{Attached Image}} must have background fill {{#E3EFF3}}, Bold font, and Font Color Black ({{#000000}}).
# *Data Row Cell Styling & Highlight Preservation*:
## *Data Cell Background*: Data rows underneath each header row remain white/unshaded by default.
## *Plan (%) and Actual (%) Progress Styling Preservation*: The conditional highlight colors defined in [ETM-5277|https://pttep.atlassian.net/browse/ETM-5277] must remain strictly preserved:
##* *100% Completion*: When *Plan (%)* or *Actual (%)* equals {{100%}}, cell background must be Green ({{#D9F7BE}}) with Black font ({{#000000}}).
##* *Actual (%) < Plan (%)*: When *Actual (%)* is less than *Plan (%)*, cell background is White with Red font ({{#A8071A}}).
##* *Actual (%) > Plan (%) (and < 100%)*: When *Actual (%)* is greater than *Plan (%)*, cell background is White with Green font ({{#389E0D}}).
##* *Actual (%) = Plan (%) (and < 100%)*: When *Actual (%)* is equal to *Plan (%)*, cell background is White with Black font ({{#000000}}).
## *Executive Note Body Preservation*: Formatted rich-text notes in Table 1 rows 2 and 4 must retain their saved content and formatting without styling distortion.
# *Export Modes & Functional Consistency*:
## *Mode Compatibility*: Both *Current Execution Date* export mode (single daily PDF) and *Daily Plan* export mode (batch daily PDFs packaged in monthly ZIP archives) must render with the updated {{#E3EFF3}} table header shading.
## *Regression Protection*: Filename conventions, freeze status validation rules, Gantt day-scale rendering, and interactive fallback hyperlinks defined in [ETM-5277|https://pttep.atlassian.net/browse/ETM-5277] must remain fully intact.

----

*UI Design*

* *Reference Mockup*: [Export Template.docx|https://pttep.sharepoint.com/:w:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Daily%20Report/Export%20Template.docx?d=w64e2ec64a2af454fbac1be02a602641b&csf=1&web=1&e=0QPPoQ].
* *Design System*: PTTEP Nualta PDF export styling — Table header tint {{#E3EFF3}}.

## Comments (before 2026-10-15T14:06)

(none)

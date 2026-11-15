> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Team-provided spec file; texts are verbatim from the source, and any 'not checked on the real app' remark inside the file still applies.

# Equipment Mob Plan - what the screen should look like (from Figma)

Made 21 Oct 2026 for QA, from ETM-6845 (Planning Tab - Equipment Mob Plan Item View & Activation).
Written from the Figma pictures only. Nothing here was checked on the real app.

Figma files:

- Planning tab (5-row Plan Card): https://www.figma.com/design/Uj51FRpEdgdANZGnyHEEOH/EMI---Turnaround--Planning-?node-id=170-10566
- Equipment Mob Plan page: https://www.figma.com/design/ORj4HtKxFcd4i9Re3wBSLm/EMI---Turnaround--Equipment-Mob-Demob-Plan-?node-id=1-70 (one frame is labelled "Update 14102026")

Related cards: ETM-6845 (this one), ETM-6947 (row redirection, Done), ETM-4865 (Epic: Planning).

---

## 1. Planning tab - Plan Card

Page: Shutdown Event > Planning tab. Title of the event with a status tag (example "Pre-Execution"). Tabs: Details, Manpower Resource, Planning, Timeline, Shutdown Organization. A "Create Plan" button sits at the top right of the Planning area.

**Plan Card header** (example: "AWP03 FSD Plan A")

- Green header when the plan is Active.
- Plan name on the left, plan description under it.
- On the right: an "Active" toggle (blue when on), a three-dot menu and a collapse/expand arrow.
- The header does NOT show a "last update" date.

**Rows inside the card** (fixed order, top to bottom, with a green bar on the left side of the card)

| # | Row | Icon (from picture) | Note |
| --- | --- | --- | --- |
| 1 | Worklist | document | has a small "Initial" tag |
| 2 | Shutdown Logic | gantt/chart | |
| 3 | Manpower Mob Plan | person | |
| 4 | Equipment Mob Plan | tool / wrench | the row of this story |
| 5 | Daily Report | calendar | always last; shows a grey note starting "A shutdown logic is required f..." and no toggle in the picture |

**A created row** (rows 1-4 in the picture)

- Icon + row name on the left.
- Grey text in the middle/right: `Last update on 25 Dec 2025` (day, short month, year).
- A toggle with a text label next to it: "Active" or "Inactive". In the picture the rows are Inactive: a grey toggle with the grey text "Inactive".
- A three-dot menu at the far right.

**Three-dot menu of the Equipment Mob Plan row** has 2 items:

1. View Equipment Mob Plan
2. Delete Equipment Mob Plan

**A row that is not created yet** (from the story, not in the Figma pictures): same icon and name, and a "Create" button on the right. No date text, no toggle, no three-dot menu.

---

## 2. Equipment Mob Plan page (opens from "View Equipment Mob Plan")

- Breadcrumb: Shutdown Event List / event name / Equipment Mob Plan: plan name.
- Title: `Equipment Mob Plan: <plan name>`.
- Top right: **Export** and **Save**. Save is grey until something is changed, then it turns blue.
- Toolbar above the table: **Add Work Header** button on the left, **Custom View** icon and **Filter Panel** icon on the right.

**Table**

- Work headers are group rows, for example: Operation, Electrical and Instrument (PM), Mechanical (CM), Electrical and Instrument (CM).
- Each work header row has an **Add Equipment** button and a three-dot menu.
- A work header with no equipment shows the grey text "No equipment added."
- Equipment rows have a number in the "No." column and a **bin icon** next to Material Description.
- Required columns have a red star: Material Description, WIN# No. (CCU No.), Contact Person, Width (m), Length (m).
- Other columns seen: Department, Premob Inspection, Area (m2), Gross Wt. (Tons), Platform, Deck, Item No. in Plot Plan, Transportation, Material Ready at SKL, Require at Offshore, Backload to SKL, Priority, Status, MMR No., Vessel Name, Loading at PSB, Remark.

**Empty state** (no work headers): the table shows an empty box icon and "No results found". Export and Save are grey. Add Work Header still works.

**Add Work Header** (pop-up)

- Title "Add Work Header". One field "Work Header Name" (red star), with a counter such as 0/200.
- Buttons: Cancel and Save. Save is grey while the name is empty and blue after typing (example "New Work Header", 15/200).
- After Save, the new work header shows at the bottom of the table with "No equipment added."

**Edit Work Header** (pop-up): same pop-up with the title "Edit Work Header" and the old name already filled in (example 15/200). The work header three-dot menu has "Edit Work Header" and "Delete Work Header".

**Add Equipment:** clicking "Add Equipment" adds an empty row under that work header (No. 1, grey placeholders such as "Material Description", "Contact Person", "Width (m)") with a bin icon. Clicking the bin icon removes the row.

**Custom View** (side panel): title "Custom View", then "Expand/Collapse by Data Level" with two items: Work Header and Equipment. Choosing a level expands or collapses the rows at that level.

**Filter Panel** (side panel): title "Filter Panel" and a "Reset" link. One section per column, each can open and close.

| Column type | Filter shown |
| --- | --- |
| Text columns (Material Description, WIN# No., Contact Person, Department, Platform, Deck, Item No. in Plot Plan, MMR No., Vessel Name, Remark) | Search box + "Select All Results" + a tick list (some have "(Blank)") |
| Premob Inspection | Select All, (Blank), Yes, No |
| Width, Length, Area, Gross Wt. | "Between" with From and To boxes |
| Transportation | Select All, (Blank), Supply Vessel, Crew Boat, MSB, Helicopter |
| Material Ready at SKL, Require at Offshore, Backload to SKL, Loading at PSB | Date From and To |
| Priority | Select All, (Blank), 1, 2, 3 |
| Status | Select All, (Blank), Inspected, Delivered at PSB, MMR Issued, Vessel Assigned, In Transit, Received, Ready for Backload, Backloaded, Delay, Cancel |

Typing in a search box (example "SNU") narrows the list and changes the first tick to "Select All Search Results".

**Equipment Status tags** (colours as seen in the picture, approximate)

| Status | Colour |
| --- | --- |
| Inspected, Delivered at PSB, MMR Issued, Vessel Assigned | yellow/orange |
| In Transit, Received, Ready for Backload | green |
| Backloaded, Cancel | grey |
| Delay | red |

---

## 3. What the Figma does NOT show (needs the team or the real app)

- A toggle that is greyed out (plan Inactive, or the user has no Active/Inactive permission).
- A row that is hidden (user without view permission, or Job Owner when the Equipment Mob Plan is Inactive).
- A row that is not created yet (the "Create" button).
- A confirm message when deleting the Equipment Mob Plan, a work header or an equipment row.
- A success or error message after Save.
- Where the Plan Card's own "last update" is shown (it is not in the header).
- Possible Figma typo: in the frame named "Delete Work Header", the three-dot menu on the work header reads "Edit Equipment / Delete Equipment", while the "Edit Work Header" frame reads "Edit Work Header / Delete Work Header". Please confirm which words the app should use.

## 4. Rules from PO / Dev (21 Oct 2026) that go with these pictures

- Turnaround Manager sees every plan, Active or Inactive, and is the only role that can add, create, edit and delete.
- Job Owner sees only the Active plan, and does not see the Equipment Mob Plan row when it is Inactive. Job Owner cannot use the toggle.
- Turning the toggle on or off changes "Last update on" to the current time. Any save in the Equipment Mob Plan page does the same, and the Plan Card's last update follows the newest change from any row.
- "Last update on" uses Thai time (UTC+7) and shows the date only.
- When the Equipment Mob Plan is Inactive, Turnaround Manager can still open, edit, delete and press everything.
- When a Plan Card is turned off and on again, the row keeps the value it had.
- Two users on the same toggle: the last change stays. The other user sees it after a refresh. No automatic refresh.

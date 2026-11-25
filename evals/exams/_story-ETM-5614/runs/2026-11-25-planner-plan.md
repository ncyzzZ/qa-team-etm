# ETM-5614 Manpower Mob Plan: table columns and category hierarchy (planner plan, read-only walk on QA, 2026-11-25)

## What I saw on QA

Role TM (seed `seed.turnaroundManager`), plus JO at the end. Nothing was saved. The QA site was slow, and the first loads came back blank because the shared layout script `epdigital-qa .../mfe-ep-layout.js` hung. A reload fixed it.

Plans used:
- **A. Event "Export 5000", plan "For Critical Path (Joe)"**: `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/4f24d106-daa3-488e-ad9a-8eba85bcca8e/manpower-mob/7fe3d550-8c34-43bf-a79d-c54cd43da4b7`. It has 26 Resources, all with a Required Manpower row. 22 of them have no personnel. 4 personnel have no dates. The schedule runs Jun 10 to Jul 22 2026 (43 days, 64 px each), so it is not in the current month (Nov 2026).
- **B. Event "แผนหยุดซ่อม", plan "eND50"**: `/shutdown-event-list/events/b69b19e4-b56e-4b1d-9e49-74ec40c06a3c/planning/812889f6-d90d-4614-ac0a-341c26b9c20f/manpower-mob/93272d08-c116-4a36-8885-36d7326c4331`. It has 5 Resources: Blaster and EI, which have a Required Manpower row (snapshot), and Empty Resource, Insulator and Zulu QA, which have no Required row (manual). There are 11 personnel with dates and the schedule starts May 14 2026. This plan shows a red deficit.
- **C. Event "NN TEST QA", plan "Wide Plan B - NN"** (the Active plan; its Manpower Mob Plan item shows Inactive on the Planning card). It has 1 Resource, "Production", with 2 people.

Exact texts and facts:
- Page title: `Manpower Mob Plan: <plan name>`. Breadcrumb: `Shutdown Event List / <event> / Manpower Mob Plan: <plan>`. Header buttons: `Export`, `Save` (disabled until something changes). Toolbar: `Add Resource`, `Set Route`, and two icon buttons (Custom View, and Filter with tooltip "Filter Panel").
- **Column groups load COLLAPSED on every plan I opened** (A, B, C). Buttons are named `Expand Resource` / `Expand Mob` / `Expand Demob` / `Expand Reservation`, and `Collapse …` once expanded (aria-expanded true).
  - Collapsed header: `No. | Resource: Name | Mob: Mob Date | Onboard Date | Demob: Demob Date | Reservation: Dlog Status`.
  - Expanded header: `No. | Resource: Name, Company, Department, * Resource Type, * Accommodation, * D/N Shift, * Hot Bed | Mob: Transportation, Mob Date, Route No. | Onboard Date | Demob: Transportation, Demob Date, Route No. | Reservation: Dlog Status, Booking No.`
  - "Name" has no `*` in the header. Resource Type, Accommodation, D/N Shift and Hot Bed do.
- There is a `No.` column. The numbers run on across Resources (1, 2, 3, 4 …), not from 1 in each Resource.
- Above the Resources there are two pinned rows: `Mob Route` and `Demob Route` (32 px high).
- Resource (category) row: 48 px. Background is white (rgb 255,255,255), not dark blue. The name is grey (rgba 0,0,0,0.65). The chevron button is named `Toggle <Resource>` (aria-expanded) and uses the arrow-down.svg icon. Then `Add Personnel` and a "…" menu with `Edit Resource` and `Delete Resource`. **The menu is the same, with Delete enabled, for snapshot Resources (Blaster, EI, all 26 in plan A) and manual ones.**
- Required Manpower row: 32 px, grey background (rgb 245,245,245), label `Required Manpower` and an info-circle icon. Hover tooltip: **"Required manpower sourced from shutdown logic schedule."** Manual Resources (Insulator, Zulu QA, Empty Resource) have no Required row and no icon.
- Empty Resource placeholder: **"No personnel assigned."** (with a full stop; the Story text has none). It sits under the Required row for snapshot Resources and under the header for manual ones.
- Empty cells show the column name as grey placeholder text (rgba 0,0,0,0.25), e.g. "Company", "Mob Date", "Dlog Status". Onboard Date and Demob Date cells are marked read-only (class `--readonly`). Demob Date is read-only too, but the Story makes only Onboard Date view-only.
- Dates show as `17 May 2026`. Vessel: Mob 17 May gives Onboard 18 May (+1).
- Resource sort: case-insensitive A to Z. In plan A: ACDC, AT, AT Sort Order, Automatic, Buck Sort, CONCOR, CR3 D/N, DEXON, DRT, ECM Fitter, ECM Welder, EI, Electrician, Function Sort, Mechanic, Mechanical Team A, New ManPower, OPT, Production, RA, Scaffolder, Schneider, SSHE, SSHE test, Yokogawa, Zebra. In plan B: Blaster, EI, Empty Resource, Insulator, Zulu QA.
- Category POB per date (plan B, Blaster, May 14 to …): `0 0 0 0 1 2 3 3 2 1 0 …`. This matches Onboard ≤ d < Demob (Blaster 1: 18 to 22, Blaster 2: 19 to 23, Blaster 3: 20 to 24).
- Red deficit (plan B, EI): Required `0 0 0 0 0 2 3 4 3 2 0…` against POB `0 0 0 0 1 2 3 3 2 1…`. Red (rgb 168,7,26) shows on May 21 (4>3), May 22 (3>2) and May 23 (2>1). It does not show on May 19/20, where the values are equal.
- Collapsing a Resource with `Toggle` hides the personnel rows and keeps the Required Manpower row, in the left and right panes alike (right pane rows went 4→2).
- Left and right row tops match row by row (checked by pixel: 309, 341, 373, 421, 453 …).
- Personnel rows show `Delete row` (bin) next to the name.
- JO on the Active eND50 item sees the same columns and also the `Add Resource`, `Add Personnel`, `Delete row` and Edit/Delete Resource menu, all enabled. JO opening an Inactive item (Wide Plan B MMP) gets "Access Denied / If you need access to the Application, please send a request with your details."
- A deleted Mob Plan link shows the dialog **"Unable to View Manpower Mob Plan" / "The manpower mob plan has already been deleted."** with `OK`, which goes back to the Planning tab.

Not seen:
- "No resource available to display.": I found no Mob Plan item made from an empty Shutdown Logic. The path in .env for the empty plan points to a deleted item.
- Which Resources are really snapshot and which are manual: I could only tell by the Required row.
- Hover or other visual states of the chevrons.
- Whether expand state is remembered after a reload: I did not reload after expanding.

## Scenarios

### 1. Column groups: default state on first load (differs from Story)
Steps: 1) Open plan A (or B) fresh. 2) Read the left header.
Expected (Story): all groups Expanded on first load.
Seen on QA: all four groups Collapsed (`Expand Resource/Mob/Demob/Reservation`). Header `No. | Name | Mob Date | Onboard Date | Demob Date | Dlog Status`. **Differs from Story.**

### 2. Expand each column group: child columns and order
Steps: click `Expand Resource`, `Expand Mob`, `Expand Demob`, `Expand Reservation` one at a time.
Expected: each click adds only that group's children, in this order:
- Resource: Name, Company, Department, * Resource Type, * Accommodation, * D/N Shift, * Hot Bed (differs from Story: the Story's AC lists Name/Company/Department and puts Hot Bed under Reservation; the Data Source puts Accommodation, D/N Shift and Hot Bed in Resource; Resource Type is not in the Story's Resource group).
- Mob: Transportation, Mob Date, Route No. (differs from Story: the AC says "Vessel No."; the Data Source and collapsed rule say "Route No.").
- Demob: Transportation, Demob Date, Route No. (same difference).
- Reservation: Dlog Status, Booking No. (differs from Story: the AC adds "* Hot Bed").
Check also: the button label changes to `Collapse <group>`, aria-expanded is true, and the chevron icon turns.

### 3. Collapse each group: the single field that stays
Steps: from fully expanded, collapse each group.
Expected: Resource keeps only Name; Mob keeps only Mob Date; Demob keeps only Demob Date; Reservation keeps only Dlog Status. Onboard Date stays visible in every combination (try all collapsed, all expanded and mixed). Re-expand brings back all children in the same order.

### 4. Mandatory marks in the header
Expected: `*` before Resource Type, Accommodation, D/N Shift and Hot Bed.
Seen: no `*` before Name. The Story says "* Name" (mandatory). **Differs from Story.**

### 5. No. column
Expected: numbers run 1..n across all Resources in display order (plan A: TEST=1, test organic crew=2, ssssss=3, ioiojoyohoouihoih=4). Placeholder and Required rows get no number. The Story does not mention this column.

### 6. Resource row look (differs from Story)
Expected (Story): category rows highlighted dark blue.
Seen: white background with grey name text. **Differs from Story.**

### 7. Resource sort A to Z, case-insensitive
Steps: open plan A and read the Resource names top to bottom.
Expected: the exact order listed above. Mixed-case and same-prefix names sort case-insensitively: "AT" < "AT Sort Order" < "Automatic"; "Schneider" < "SSHE" < "SSHE test"; "EI" < "Electrician"; "EI" < "Empty Resource". Snapshot and manual Resources are sorted together (plan B: Blaster, EI, Empty Resource, Insulator, Zulu QA).
Extra check: add a Resource whose name differs only in case from an existing one (needs a TM data card, not done here) and confirm where it lands and that the order is stable after reload.

### 8. Personnel order inside a Resource
Expected: by created time, old to new (plan B: QA Blaster 1, 2, 3). Confirm with a newly added person, who must go last, not sort by name.

### 9. Required Manpower row and (i) tooltip on snapshot Resources
Steps: hover the info icon next to `Required Manpower` under Blaster.
Expected: tooltip exactly "Required manpower sourced from shutdown logic schedule." The row is grey and 32 px high, directly under the Resource row, and the icon sits right after the label.

### 10. Manual Resources have no Required row and no (i)
Expected: Insulator, Zulu QA and Empty Resource show only the Resource row and the people (or the placeholder).

### 11. Peak-hour value of Required Manpower
Steps: for Blaster/EI, compare each date's Required value with the Shutdown Logic histogram for that Resource (max over 0:00 to 24:00).
Expected: equal on every date in the range (EI: May 19=2, 20=3, 21=4, 22=3, 23=2). Also check a date where the peak is in one hour only.

### 12. Red deficit only when POB < Required
Steps: plan B, EI row, dates May 19 to 23.
Expected: red (rgb 168,7,26) on May 21/22/23 only. Black where equal (May 19/20) and where Required = 0. Blaster has no red cells. After filtering (ETM-5615), POB and red stay as they were.

### 13. Category POB per date
Expected: Resource row value on date d = number of people with Onboard ≤ d < Demob. The demob day is not counted (Blaster: 18 May=1 … 23 May=1, 24 May=0). People without dates count 0 (plan A: all zero).

### 14. POB recalculates after a change (needs a write, TM data card)
Steps: change a person's Mob/Demob date or add/delete a person (do not save, or use a card-owned plan).
Expected: Resource row numbers update at once; the Required row stays the same; red follows the new POB.

### 15. Collapse/expand a Resource; Required row stays
Steps: click `Toggle EI`.
Expected: the 3 people hide in both panes; the Required row and the Resource row stay; aria-expanded is false; clicking again shows them. For a manual Resource only the Resource row stays. For "Empty Resource", check whether the "No personnel assigned." row hides.

### 16. No personnel placeholder
Expected: text exactly "No personnel assigned." (with a full stop; the Story text has none, so compare the punctuation). It sits under the Required row for snapshot Resources (plan A, 22 Resources) and right under the Resource row for a manual one (plan B "Empty Resource"). No number in No.

### 17. Snapshot Resource cannot be deleted (differs from Story)
Steps: open "…" on Blaster/EI (snapshot) and on Insulator (manual).
Expected (Story): no delete action on snapshot Resources.
Seen: both show `Edit Resource` and `Delete Resource`, enabled. **Differs from Story.** Do not click Delete on shared data.

### 18. Empty cells and read-only cells
Expected: empty values show the column name as grey placeholder text. Onboard Date cannot be edited (double-click does nothing). Seen: Demob Date also has the read-only class; check whether it opens an editor.

### 19. Date format and Onboard rule
Expected: `DD Mon YYYY` everywhere (e.g. 17 May 2026). Onboard = Mob for Helicopter/MSB, Mob+1 for Vessel. Plan B (Vessel) shows 17→18 May; Helicopter and MSB need data.

### 20. Left and right panes stay lined up
Steps: expand/collapse groups and Resources, then scroll vertically.
Expected: each left row has the same top and height as its right row (route 32, Resource 48, Required 32, person 48). The timeline is not in the current month (Jun to Jul 2026 for plan A), and the first date column matches the plan range.

### 21. Empty plan: "No resource available to display." (not seen on QA)
Steps: create a Mob Plan item from a plan whose Shutdown Logic has no data (TM data card).
Expected: "No resource available to display." Not found on QA, so it still needs to be checked.

### 22. Deleted Mob Plan link
Steps: open a URL of a deleted Mob Plan item.
Expected: dialog "Unable to View Manpower Mob Plan" / "The manpower mob plan has already been deleted." with `OK`, which goes to the event's Planning tab. Not in the Story.

### 23. JO view
Steps: as JO open an Active Mob Plan item (eND50) and an Inactive one (Wide Plan B).
Expected: Active shows the same columns and hierarchy. Inactive shows "Access Denied" and "If you need access to the Application, please send a request with your details." Seen: JO also has Add Resource / Add Personnel / Delete row / Edit and Delete Resource enabled; compare with the JO permission (view only).

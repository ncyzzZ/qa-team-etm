# ETM-5615 Manpower Mob Plan: filter panel (planner plan, read-only walk on QA, 2026-11-25)

## What I saw on QA

Role TM, plus JO at the end. All filter changes were local, and Reset was pressed each time. Nothing was saved.

Plans used:
- **A. Event "Export 5000", plan "For Critical Path (Joe)"**: `/shutdown-event-list/events/afdb376f-12cf-48f4-8e6e-a81288b9f864/planning/4f24d106-daa3-488e-ad9a-8eba85bcca8e/manpower-mob/7fe3d550-8c34-43bf-a79d-c54cd43da4b7`. It has 26 Resources and 4 people: "ioiojoyohoouihoih", "ssssss", "TEST" and "test organic crew" (the last two differ in case). The schedule is Jun 10 to Jul 22 2026.
- **B. Event "แผนหยุดซ่อม", plan "eND50"**: `/shutdown-event-list/events/b69b19e4-b56e-4b1d-9e49-74ec40c06a3c/planning/812889f6-d90d-4614-ac0a-341c26b9c20f/manpower-mob/93272d08-c116-4a36-8885-36d7326c4331`. It has 5 Resources and 11 people with dates (Mob 17/18/19 May, Onboard 18/19/20, Demob 22/23/24) and Transportation (Mob) = Vessel.

Exact texts and facts:
- Toolbar right side: two icon buttons with no aria-label. The first opens **Custom View** (panel title "Custom View"; content "Expand/Collapse by Data Level", "Resource", "Personnel"). The second opens the filter (hover tooltip "Filter Panel"). The filter icon is `filter-blue.svg` normally and **`filter-dot-blue.svg` when a filter is active**. The button also gets class `panel-toggle-button--active` while open.
- The panel is 250 px wide on the right of the grid. Title `Filter Panel`, with `Reset` on the right. **Reset is disabled while all filters are at default** and enabled after any change.
- Section order (16): Name, Company, Department, Resource Type, Accommodation, D/N Shift, Hot Bed, Mob Date, Onboard Date, Demob Date, Transportation (Mob), Route No. (Mob), Transportation (Demob), Route No. (Demob), Dlog Status, Booking No. Each has a button `Expand <name>` / `Collapse <name>` with a down-arrow icon.
- **On first open every section is collapsed, Name included.**
- A list section has a `Search` input, `Select All`, then the values. While the search box has text, an extra checkbox **"Select only search results"** appears under Select All. When nothing matches: **"No option"**.
- Values on plan A: Name: ioiojoyohoouihoih, ssssss, TEST, test organic crew (A to Z, case-insensitive; no (Blank) because every row has a name). Company: (Blank), test organic crew comp. Department: (Blank) only. Resource Type: Organic Crew, Extra Turnaround (dropdown order). Accommodation: LQ. D/N Shift: Day. Hot Bed: No. Transportation (Mob) / Route No. (Mob) / Transportation (Demob) / Route No. (Demob) / Dlog Status / Booking No.: (Blank) only.
- Values on plan B: Name: QA Blaster 1..3, QA EI 1..3, QA Insulator 1..3, QA Zulu 1, QA Zulu 2. Transportation (Mob): Vessel (no Blank). Transportation (Demob): (Blank).
- Search: "test" and "  TEST  " both give TEST and test organic crew (case-insensitive, trimmed). "ORG" gives test organic crew (substring). "zzz" gives "No option". **Typing in the search does not filter the grid** (still 4 people).
- Untick TEST: the grid shows 3 people. **Resources with no people left disappear, including Resources that never had people** (26 Resources became 3). Select All turns indeterminate. Reset is enabled. The icon gets the blue dot. **Page `Save` becomes enabled** (TM).
- Untick Select All (0 selected): no people and no Resource rows, only the column header and the `Mob Route` / `Demob Route` rows. **No empty-state message at all.**
- Select All while the search shows only "ssssss" unticks every name, the hidden ones too (grid shows 0 rows after the search is cleared). "Select only search results" ticks only the matches (grid shows 1).
- Reset: every box is ticked again, dates are cleared, 26 Resources and 4 people come back, the icon has no dot, Reset is disabled again, and **Save is disabled again** (TM).
- Date sections: Mob Date has one input with placeholder `Date`. Onboard Date has `From` and `To`. Demob Date has `Date`. The pickers use **format `dd/MM/yyyy`**, and a picked date shows as `15/06/2026`. Typing "1 Jun 2026" was not taken as a filter. The calendar opens on the plan's month (Jun 2026 for A, May 2026 for B), not the current month. **No dates are disabled outside the schedule range** (Jun 1 to 9 can be picked in plan A, whose schedule starts Jun 10). In `To`, **all dates before `From` are disabled**, so From > To cannot be picked with the mouse. There is a clear (x) icon on hover.
- Onboard range on plan B (stay = Onboard to Demob − 1):
  - From 22/05 gives Blaster 2, Blaster 3, EI 2, EI 3, Insulator 2, Insulator 3, Zulu 2 (people whose stay ends on 21 May drop out).
  - From 23/05 gives only the "3" people (stay to 23 May).
  - To 18/05 gives Blaster 1, EI 1, Insulator 1, Zulu 1.
  - To 17/05 gives nobody.
- Demob Date 23/05 gives the "2" people only, with Resource rows Blaster, EI, Insulator, Zulu QA.
- Category POB, Required Manpower and the POB Chart data row stayed the same when "QA Blaster 1" was filtered out (Blaster POB `0 0 0 0 1 2 3 3 2 1…`, chart `…4 4 3…`).
- The route rows `Mob Route` / `Demob Route` stay while filtering.
- `Set Route` does not open a side panel. It opens a 400 px drawer "Route" (Add Route, Transportation: Helicopter / MSB / Vessel, Mob/Demob: Mob / Demob, "No route available.", `Back`) **over** the Filter Panel, which stays open. Custom View and Filter do close each other.
- JO (eND50, Active): the same Filter Panel. After a change, **`Save` becomes enabled for JO too**. The route button is `View Route` (no Add Route).

Not seen:
- A saved global filter (it would need Save). So: the dot on page open from a saved filter, sharing across users, Refresh on reopen after a data change, and Save while a filter is active (all rows kept).
- (Blank) in Name, Resource Type, Accommodation, D/N Shift or Hot Bed: no such data.
- Transportation values Helicopter/MSB in the filter.

## Scenarios

### 1. Open and close the Filter Panel
Steps: click the filter icon (tooltip "Filter Panel"), then click it again.
Expected: the panel opens on the right with title "Filter Panel" and "Reset" (disabled), and closes on the second click. The grid keeps its data.

### 2. Right panels close each other
Steps: open Custom View, then Filter; then Filter, then Custom View; then Filter, then `Set Route`.
Expected (Story): Filter, Custom View and Set Route are mutually exclusive.
Seen: Custom View and Filter close each other. `Set Route` opens a "Route" drawer over the screen while the Filter Panel stays open behind it. **Differs from Story.**

### 3. Sections and default state
Expected (Story): 16 sections; Name expanded on first open, the other 15 collapsed.
Seen: the 16 sections in the order listed above, **all collapsed, Name included**. **Differs from Story.** Check each chevron toggles open/closed (`Expand X` / `Collapse X`).

### 4. Name list: sort, case, Blank
Expected: distinct names A to Z, case-insensitive (ioiojoyohoouihoih, ssssss, TEST, test organic crew). No (Blank) when every row has a name. When a row has no name, (Blank) shows directly under Select All (needs data). Names that differ only in case (TEST / test …) are two separate options. Check also two people with exactly the same name: one option.

### 5. Free-text sections (Company, Department, Route No. Mob/Demob, Dlog Status, Booking No.)
Expected: distinct values A to Z plus (Blank) only when some row is blank (plan A Company: (Blank), test organic crew comp). Route No. (Mob) and Route No. (Demob) have their own lists.

### 6. Enum sections (Resource Type, Accommodation, D/N Shift, Hot Bed, Transportation Mob/Demob)
Expected: only values used in the plan, in dropdown order, not A to Z. Plan A Resource Type: "Organic Crew, Extra Turnaround" (not alphabetical). Unused values (Barge, FSO, Night, Yes, Helicopter, MSB) are not shown. (Blank) appears only if some row is blank (plan B Transportation (Demob): (Blank); Transportation (Mob): Vessel only).

### 7. In-filter search
Steps: in Name type "test", "  TEST  ", "ORG", "zzz".
Expected: case-insensitive, trimmed substring matches. "zzz" shows "No option". The search alone does not change the grid. Seen: an extra "Select only search results" checkbox appears while searching (not in the Story).

### 8. Select All with hidden options
Steps: search "ss", untick Select All, clear the search.
Expected: every name is unticked (hidden ones too) and the grid has 0 people. Then search "ss" and tick "Select only search results": only ssssss is ticked, Select All is indeterminate, and the grid shows 1 person.

### 9. Untick one value: grid filters at once
Steps: untick TEST.
Expected: with no Apply button, the left and right panes drop that row at once. Select All shows "-". Resources with no people left disappear (plan A: 26→3, including Resources that had no people at all). The route rows stay.

### 10. Zero results (differs from Story)
Steps: untick Select All in Name.
Expected (Story, User Review): message "No data available".
Seen: no message, just the empty grid with header and route rows. **Differs from Story.**

### 11. Active filter blue dot
Expected: after any change the icon changes to filter-dot-blue (dot). After Reset (or putting everything back) the dot goes. Also check a change that puts the same state back by hand (tick TEST again): the dot should go.

### 12. Reset
Steps: change a list, a search and a date, then press Reset.
Expected: searches cleared, all boxes ticked, dates cleared, every row back, no dot, Reset disabled again. Seen (TM): the page Save goes back to disabled. The Story says Save is needed to publish the cleared state; check this when a saved filter exists.

### 13. Save button and permissions
Expected (Story): only users with Edit Manpower Mob Plan see Save and can save the filter globally.
Seen: TM Save turns enabled after a filter change. **JO also has Save enabled after a filter change.** Compare with JO's permission. Do not press Save on shared data. Needs a card-owned plan: save a filter, reopen, see the dot at once, and check another user sees the same filter (global).

### 14. Mob Date filter
Steps: pick 15/06/2026 on plan A; on plan B pick 17/05/2026.
Expected: only people whose Mob Date equals the date. Plan B: Blaster 1, EI 1, Insulator 1, Zulu 1.
Seen: the picker format is `dd/MM/yyyy` (value "15/06/2026"). The Story says `DD Mon YYYY`. **Differs from Story.** Typed "1 Jun 2026" is not used.

### 15. Onboard Date range (overlap; demob day not counted)
Plan B:
- From 22/05: Blaster 2/3, EI 2/3, Insulator 2/3, Zulu 2.
- From 23/05: only the "3" people.
- To 18/05: the "1" people.
- To 17/05: nobody.
- Both From and To: overlap.
- Both empty: no filter.

### 16. From after To (differs from Story)
Expected (Story): red border, no text.
Seen: in `To` every date before `From` is disabled, so it cannot be picked. Also try typing a To date before From by keyboard and see whether the red border shows. **Differs from Story (prevented instead of red border).**

### 17. Demob Date filter
Steps: pick 23/05/2026 on plan B.
Expected: only people with Demob 23 May (Blaster 2, EI 2, Insulator 2, Zulu 2). Resources with none left hide.

### 18. Date boundary (differs from Story)
Expected (Story): pickable dates limited to Earliest Task Start − 7 days … Latest Task End + 7 days (same as the schedule).
Seen: the calendar opens on the plan's first month, but no date is disabled (plan A: Jun 1 to 9 can be picked though the schedule starts Jun 10). **Differs from Story.** Check also months before and after.

### 19. POB, Required and POB Chart are not filtered
Steps: untick "QA Blaster 1" on plan B.
Expected: Blaster POB per date stays `0 0 0 0 1 2 3 3 2 1…`, the Required rows stay, red cells stay, and the POB Chart table stays `…4 4 3…`.

### 20. Filters combine (AND)
Steps: untick a name and pick a Demob Date together.
Expected: a row shows only if it passes every section.

### 21. Options refresh on reopen (needs a data change)
Steps: add a person with a new Company (unsaved draft), close and reopen the panel.
Expected: the new Company is in the list. Also check a value that no longer exists disappears.

### 22. Save while filtered keeps hidden rows (needs a card-owned plan)
Steps: filter, edit a visible row, Save, Reset.
Expected: hidden rows are still there.

### 23. JO
Expected: JO sees the same panel and can filter. Seen: Save is enabled for JO after a change; route button is "View Route". Check whether JO can actually save a global filter.

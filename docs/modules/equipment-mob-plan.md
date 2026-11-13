# Equipment Mob Plan

Per-plan page in ETM (PTTEP EP-Turnaround Management), opened from the Planning tab of a Shutdown Event: Work Headers with equipment rows (Epic ETM-6, Sprint 24, env QA). Roles: Turnaround Manager (TM) and Job Owner (JO) only.

| Card | Feature | Last status |
|---|---|---|
| ETM-7305 | Dashboard layout, breadcrumbs, header controls | 26 Oct 2026 |
| ETM-7307 | Add Work Header | 29 Oct |
| ETM-7308 | Edit Work Header | 29 Oct |
| ETM-7309 | Delete Work Header | 29 Oct |
| ETM-7310 | Add Equipment | 27 Oct |
| ETM-7311 | Edit Equipment, data validation | 22 Oct (no run) |
| ETM-7312 | Delete Equipment | 22 Oct (no run) |
| ETM-7314 | Multi-Criteria Filter Panel | 22 Oct (no run) |
| ETM-7315 | Export to Excel | 22 Oct (draft) |
| ETM-7351 | Table Copy and Paste | 29 Oct |

Every line ends with its source `(ETM-nnnn, date, tag)`. Tag = confirmed by `user`, `BA`, or `QA` (checked on the real QA system). Newest date wins; conflicts are in section 5. ETM-7340 is Manpower Mob Plan, not covered.

## Navigation and screen facts
- Path: Shutdown Event List > event `NN TEST QA` > Planning tab > Equipment Mob Plan row of the plan (`Create` button if none; plan header ⋮ menu has `Edit Plan`). (ETM-7305, 22 Oct, QA)
- Breadcrumb `Shutdown Event List / NN TEST QA / Equipment Mob Plan: Wide Plan B - NN`; last segment is plain text; event name opens the Planning tab; `Shutdown Event List` opens the list. (ETM-7305, 22 Oct, QA)
- Title `Equipment Mob Plan: <plan name>`, bold 24px; a 50-character plan name shows in full. (ETM-7305, 26 Oct, QA)
- Header right: `Export` (outlined) and `Save` (solid blue, dimmed when no change). JO sees Export and Save; Save hidden only for users without Edit. (ETM-7305, 26 Oct, user)
- JO sees Active plans only; TM sees all; JO has the same rights as TM here. (ETM-7305, 22 Oct, BA)
- Left above the grid: `+ Add Work Header`. Toolbar: Filter Panel icon, Custom View, Export. (ETM-7307, 21 Oct, BA)
- 24 columns in order: `No.`, `Material Description`, `WIN# No. (CCU No.)`, `Contact Person`, `Department`, `Premob Inspection`, `Width (m)`, `Length (m)`, `Height (m)`, `Area (m2)`, `Gross Wt. (Tons)`, `Platform`, `Deck`, `Item No. in Plot Plan`, `Transportation`, `Material Ready at SKL`, `Require at Offshore`, `Backload to SKL`, `Priority`, `Status`, `MMR No.`, `Vessel Name`, `Loading at PSB`, `Remark`. (ETM-7315, 21 Oct, user)
- Grid has a left pane (`No.`, Material Description, WIN#, Contact Person) and a right pane (rest); row n = left row n + right row n. Left rows lost `data-item-key` after a dev change. (ETM-7351, 28 Oct, QA; ETM-7308, 29 Oct, QA)
- `No.` is a read-only running number across all Work Headers. (ETM-7310, 26 Oct, user)
- Work Header row: caret, ⋮ menu (`Edit Work Header`, `Delete Work Header`), `+ Add Equipment` text button; equipment row has a bin icon. (ETM-7308, 21 Oct, user; ETM-7310, 22 Oct, BA)
- Empty header shows `No equipment added.`; plan with no Work Header shows an open-box icon and `No results found`, Export and plan Save grey. (ETM-7307, 29 Oct, QA)

## Confirmed rules
**Add Work Header**
- Modal: title `Add Work Header` bold 16px; label `Work Header Name` red star; counter `(0/200)`; `Cancel` outlined left, `Save` primary right, disabled until a non-space character. (ETM-7307, 28 Oct, QA)
- Free text, no suggestions; max 200 (paste of 201 keeps 200); spaces around are trimmed. (ETM-7307, 28 Oct, QA)
- Thai and `A&B <C> 'D' "E" 100%` accepted; emoji and `;` blocked. (ETM-7307, 28 Oct, user)
- Modal Save: NO toast; header goes to the bottom, expanded, with empty-state row; plan Save turns blue; duplicate names allowed; no re-sort. (ETM-7307, 28 Oct, user)
- Existing headers follow Master Data order. Adding does not change Worklist or Shutdown Logic. (ETM-7307, 29 Oct, QA)
- Double-click Save cannot be reproduced by hand: not a defect, tests use a single Save. (ETM-7307, 29 Oct, user)

**Edit Work Header**
- Modal title `Edit Work Header`; `* Work Header Name` pre-filled, counter e.g. `(9/200)`, max 200, free text. (ETM-7308, 21 Oct, user)
- Modal Save: NO toast; Save DISABLED when name equals the original; `Delete Work Header` is NOT red. (ETM-7308, 27 Oct, user)
- Same name as another header allowed; rename works on an Inactive plan; JO CAN edit. (ETM-7308, 28 Oct, QA)

**Delete Work Header**
- Removes header and its equipment at once, NO modal, NO toast. (ETM-7309, 28 Oct, BA)
- `No.` re-indexes without gaps; no effect on Worklist and Shutdown Logic. (ETM-7309, 28 Oct, BA)
- Last header deleted gives `No results found`; Save turns blue and persists after refresh. (ETM-7309, 29 Oct, QA)

**Add / Edit / Delete Equipment**
- `+ Add Equipment`: no modal; header expands; one empty row below the last row. (ETM-7310, 22 Oct, BA)
- 7 mandatory fields (red star): `Material Description`, `WIN# No. (CCU No.)`, `Contact Person`, `Width (m)`, `Length (m)`, `Height (m)`, `Gross Wt. (Tons)`. (ETM-7310, 22 Oct, BA)
- Enter or click outside makes a saved draft; Save turns blue; draft is lost on refresh. (ETM-7310, 26 Oct, QA)
- `Area (m2)` read-only = Width x Length, 2 decimals, standard rounding (1.25 x 3.10 = `3.88`). (ETM-7311, 22 Oct, BA)
- Number fields: max 2 decimals, paste rounds (`2.556` to `2.56`), `0.01` accepted, 0 or empty = red only, no popover. Letters, minus, 3rd decimal can be typed but are rejected (red, cleared). (ETM-7310, 26 Oct, user)
- Bin removes a row from the draft at once, no confirm. (ETM-7310, 22 Oct, BA)
- No confirm before Save; unsaved state = Save button only (no dirty dot); leaving by side menu, breadcrumb or browser Back shows the Unsaved Change pop-up. (ETM-7311, 22 Oct, BA)
- Dropdowns: `Premob Inspection` Yes, No; `Transportation` Supply Vessel, Crew Boat, MSB, Helicopter; `Priority` 1, 2, 3; `Platform` = platforms of the event asset; `Deck` 18 values incl. `N/A`, free text also accepted; Department and Contact Person free text. (ETM-7310, 26 Oct, QA)
- `Status` 10 values: Inspected, Delivered at PSB, MMR Issued, Vessel Assigned, In Transit, Received, Ready for Backload, Backloaded, Delay, Cancel; colours: first 4 yellow/orange, next 3 green, Backloaded and Cancel grey, Delay red. (ETM-7310, 26 Oct, QA)
- Dates `10 Jan 2026`; order Material Ready at SKL <= Require at Offshore <= Backload to SKL, equal allowed; Premob Inspection and Loading at PSB have no order rule. (ETM-7310, 22 Oct, BA)
- Dates can be typed; a wrong typed date clears the whole value; calendar greys out out-of-order days (app is right). (ETM-7310, 27 Oct, user)
- JO adds equipment like TM. (ETM-7310, 22 Oct, BA)

**Data validation and limits (newest)**
- Max length, extra text cut: Material Description 200, WIN# 30, Contact Person 256, Department 64, Deck 30, Item No. in Plot Plan 50, MMR No. 30, Vessel Name 30, Remark 500. (ETM-7351, 29 Oct, BA)
- Deck cut at 30 passes retest (ETM-7910). (ETM-7351, 29 Oct, QA)
- WIN# keeps special characters and spaces as typed or pasted. (ETM-7351, 28 Oct, user)
- Date order after paste: only the LATER date cell is red. (ETM-7351, 26 Oct, BA)

**Filter Panel (ETM-7314, nothing run)**
- Per column, real time; no Apply, no Clear All, no badge, no Work Header filter; `Reset` link only. 22 sections: all columns except `No.` and `Height (m)`. (ETM-7314, 22 Oct, BA)
- Columns AND, values in a column OR; text search contains, case-insensitive, auto-trim. (ETM-7314, 22 Oct, BA)
- Numeric Between and date From/To inclusive, one side allowed; To picker disables earlier dates; typed wrong value = red frame; blank dates hidden. (ETM-7314, 22 Oct, BA)
- Header with 0 matches is hidden; no match = plain white table, no text. (ETM-7314, 22 Oct, BA; ETM-7351, 29 Oct, user)
- Filter counts as a change (Save blue, pop-up); saved filter persists after refresh, unsaved is cleared; JO same as TM. (ETM-7314, 22 Oct, BA)

**Export to Excel (ETM-7315, nothing run)**
- Every user can export; file has ALL plan records, ignoring filter, Custom View, unsaved changes; layout = Template. (ETM-7315, 21 Oct, user)
- File name `[ShutdownEventName]_[PlanName]_EquipmentMobPlan_[YYYYMMDD].xlsx`, sheet `Equipment Mob Plan`; invalid name characters become a space. (ETM-7315, 22 Oct, BA)
- Row 1 merged A1:X1 `Equipment Mob Plan: <plan>` `#35455C`; row 2 the 24 headers `#526493`; banners UPPERCASE; no-header items under `NON WORK HEADER`; empty header `No equipment assigned.`; dates `5 Jan 2026`; Area `=G{row}*H{row}`. (ETM-7315, 22 Oct, BA)
- Export disabled when plan has no Work Header and no equipment. (ETM-7315, 22 Oct, BA; ETM-7307, 29 Oct, QA)

**Table copy and paste (ETM-7351)**
- ONE popup per paste with any invalid cell; every invalid cell is cleared; rounding is silent. (ETM-7351, 27 Oct, BA)
- Only invalid MANDATORY cells are red (background only); invalid OPTIONAL cells cleared, not red; any red cell disables Save. (ETM-7351, 28 Oct, user)
- Accepted dates only `D Mon YYYY` / `DD Mon YYYY`; invalid Premob rejected. (ETM-7351, 28 Oct, user)
- Filtered table: hidden rows skipped, new rows added at end of the header when rows run out. (ETM-7351, 26 Oct, BA)
- No View-only role exists; that step was removed. (ETM-7351, 29 Oct, user)

## Messages and texts confirmed
- Save success toast `Save Success` / `Save Equipment Mob Plan Successfully.` (ETM-7310, 27 Oct, user)
- Edit Plan toast `Edit Success` / `Edit Plan Successfully`. (ETM-7305, 22 Oct, QA)
- Offline Save `Network Error` / `No internet connection. Please check your network.` (ETM-7310, 27 Oct, user)
- Unsaved pop-up: title `Unsaved Change`, text `Are you sure you want to leave this page? Changes you made will not be saved.`, buttons `Continue Editing`, `Discard Change`. (ETM-7351, 29 Oct, user)
- Plan deleted by another user: modal `Unable to Save Equipment Mob Plan` (Export: `Unable to Export Equipment Mob Plan`), text `The equipment mob plan has already been deleted.`, `OK`; OK goes back to the event page. (ETM-7308, 29 Oct, QA)
- Deleted plan URL: `Page Not Found`, `The requested page is no longer available. It may have been deleted. Please return to the previous page.`, `Back`. (ETM-7305, 22 Oct, QA)
- Paste popup: `Paste Validation Failed`, `Some pasted values do not meet the validation rules and were not applied.`, `OK`. (ETM-7351, 27 Oct, BA)
- `Backload to SKL cannot be earlier than Require at Offshore.` (ETM-7310, 22 Oct, BA)
- `Last update on` is on the Equipment Mob Plan row of the Plan Card (Planning tab), `DD Mon YYYY`, Thai time. (ETM-7351, 29 Oct, user)
- Export: `Exporting...` with spinner, then `Equipment Mob Plan exported successfully.` (ETM-7315, 22 Oct, BA)

## Where the card text and the real system differ
- ETM-7307 AC 2.1 title 18px; real bold 16px, BA to fix; ETM-7918 deleted. AC 4.3 empty-state italic `#8C8C8C`; Figma/real regular `#000000` 25%; the italic in the ETM-7312 draft is older. (ETM-7307, 29 Oct)
- ETM-7308 AC: Delete red, Save enabled on same name, toast; real: none of these. System kept, ETM-7882 withdrawn. (ETM-7308, 27 Oct)
- ETM-7305 draft "JO has no Save" vs AC 3.1/3.2; AC wins. (ETM-7305, 26 Oct)
- Limits: AC Deck 100, BA 30 (ETM-7910 passed). WIN# AC alphanumeric + hyphen, rule is free text; ETM-7310 limits (WIN# 100, others 250/150/100) superseded by the 29 Oct list. (ETM-7351, 29 Oct)
- AC/ETM-7311 say typing is blocked; newer user rule: typed then rejected. Red: ETM-7311 border `#FF4D4F` vs ETM-7351 background only; newer wins. (ETM-7310, 27 Oct)
- Pop-up wording `Change you made` / `Unsaved Changes` (older) vs `Changes you made` / `Unsaved Change`; 29 Oct wins. (ETM-7351, 29 Oct)
- OK after plan-deleted pop-up: stays (ETM-7305 draft), Planning tab (ETM-7310), event page (ETM-7308, newest). (ETM-7308, 29 Oct)
- ETM-7309: defect ETM-7903 (delete showed a pop-up) looked fixed 29 Oct, retest pending. (ETM-7309, 29 Oct)
- ETM-7351 AC 3.3.2 date-order: cleared + popup + no red; TC red, no popup (user); defect ETM-7951 Deployed, not re-run. (ETM-7351, 29 Oct)
- ETM-7311 AC outdated (dirty dot, save message, Premob type); ETM-7314 follows Figma; ETM-7315 AC 2.1 "filtered" vs user "all records". (ETM-7311, 22 Oct)
- Open defects: ETM-7936 mandatory cell not red (red works for abc/0/-5, Jira retest not done); ETM-7933 (source: WIN# accepts `;` and emoji) Deployed, retest pending; ETM-7965 empty filter shows picture + `No data available`, expected plain white. (ETM-7351, 29 Oct)

## QA test data
- Event `NN TEST QA` (older runs also `ART PSD`). Plans: `Wide Plan B - NN` (Active; Header A `Mechanical (PM)` 20+ saved rows; empty `Header B Empty`; old `A1` has 2 saved rows, ignore); `Man-Dup` (Inactive, no Equipment Mob Plan, throwaway); `eND50` (JO plan, header `Mechanical (CM)`, holds `Hot Work QA` x3 and `Isolation QA` x1). (ETM-7305/7307/7310, 29 Oct)
- `QA EMP Edit A`/`B`/`C`: Operation 3 items, `Mechanical (CM)` 2, `Spare Header` 0; B and C are deleted by tests, recreate. (ETM-7308, 29 Oct)
- `QA EMP Del WH Main` and `QA EMP Del WH Save` (single-use): Operation 3, `Mechanical (CM)` 1, `Electrical (PM)` 0, `Spare Parts` 2. `Probe - Run` same plus `rrrr` x2, `Work Header Name`. `QA EMP Del A` (ART PSD, 7 empty headers) for ETM-7315. (ETM-7309/7351/7315, 29 Oct)
- Reset rule: each case starts from base data, rename back or use a fresh plan; saved rows cannot be removed from the page. Row data: `Sample Container 01`, `CCU-001`, Width 2.50, Length 4.00, Height 2.80, Gross Wt 5.20, Area `10.00`. (ETM-7308, 21 Oct; ETM-7310, 22 Oct)

## Open points
- Planning tab of `NN TEST QA` gave 500 / `No plan available` on 29 Oct; not confirmed fixed. (ETM-7309, 29 Oct)
- Area with Width/Length empty or 0: `-` (ETM-7311, AC 3.5.1) vs blank (ETM-7310); app shows placeholder `Area (m2)`; candidate defect not created. Empty paste into mandatory cell: cleared, no popup, not red; not created. (ETM-7351, 29 Oct)
- Enter on an empty new row shows no red (D5); WIN# special chars stripped (D6): seen 27 Oct, never logged. (ETM-7310, 27 Oct)
- Date-order message `must be on or after` (draft) vs `cannot be earlier than Material Ready at SKL.` (ETM-7311). (ETM-7311, 22 Oct)
- Asked BA, unanswered: required text-field message, Save grey after change-back, MMR paste over 30, `No.` after bin delete, Area `0.0001`. (ETM-7311, 22 Oct)
- Bin on a saved row: persisted or not; editing a saved draft row. (ETM-7310, 26 Oct)
- Toast after Work Header delete (ETM-7903 says yes). (ETM-7309, 28 Oct)
- Real Master Data header sequence (`Electrical (PM)`, `Spare Parts` not in the 4-name list). (ETM-7307, 29 Oct)
- Export with an unsaved draft: blocked (ETM-7305 review) vs works (ETM-7315). (ETM-7305, 22 Oct)
- ETM-7312 rules are AC/sheet only, never checked on the app. ETM-7315 layout/colours are AC/Template only. Figma never read for 7305. (ETM-7312, 22 Oct)
- Not tested: JO on Inactive plan by URL, TM Save on Inactive plan, Edit-permission role, @security specs, role with no view permission. (ETM-7305, 22 Oct)

## Sources
etm-7305, 7307, 7308, 7309, 7310, 7311, 7312, 7314, 7315, 7351 (status.md and tc-draft.md each); etm-7310-defect-draft.md; etm-7310-tc-draft_v2_33cases.md (checked only); etm-7340-status.md (Manpower, excluded); handoff-2026-10-29.md. Folder D:\mac\DocforAi\STMS\claude.

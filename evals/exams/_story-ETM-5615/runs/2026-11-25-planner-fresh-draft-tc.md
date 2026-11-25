# ETM-5615 Manpower Mob Plan: Filter Panel (draft test cases, revised with planner plan)

Story: ETM-5615 Manpower Mob Plan - Multi-Criteria Grid Filtering (frozen exam copy). Source: story.md plus the planner walk on QA (planner-plan.md, 2026-11-25). No analyst.md exists for this exam: AC ids below are numbered by me from the Story text (see the AC key).
Existing [QA] subtasks: none known.
Common precondition: user is logged in as TM (Turnaround Manager) with View All Manpower Mob Plan Item and Edit Manpower Mob Plan, and is on the Manpower Mob Plan page of an Active plan that has several Resources and several people with different Name, Company, Resource Type and dates. Sample plan P1: event "Export 5000", plan "For Critical Path (Joe)" (26 Resources, 4 people: ioiojoyohoouihoih, ssssss, TEST, test organic crew; schedule 10 Jun to 22 Jul 2026). Sample plan P2: event "แผนหยุดซ่อม", plan "eND50" (5 Resources, 11 people: QA Blaster 1-3, QA EI 1-3, QA Insulator 1-3, QA Zulu 1-2; Mob 17/18/19 May, Onboard 18/19/20 May, Demob 22/23/24 May 2026).
Notation: POS = positive, NEG = negative, BND = boundary. "Right panels" = Filter Panel, Custom View, Set Route.
Data safety: filter changes are local until Save. Do not press Save on shared data; saving cases need a card-owned plan.

## AC key (numbered from the Story)

AC-0.1 Save button and global save only with Edit Manpower Mob Plan; filter visible to every viewer | AC-0.2 dropdown lists sort A-Z | AC-0.3 zero result shows "No data available" | AC-0.4 date boundary same as schedule (Earliest Task Start - 7 days to Latest Task End + 7 days) | AC-1 Filter icon toggles panel | AC-2 right panels mutually exclusive | AC-3 header: title Filter Panel, Reset link | AC-4 16 accordion sections with chevron | AC-5 default: Name expanded, other 15 collapsed | AC-6 global state shared by all users | AC-7 multi-select structure (Search, Select All with indeterminate, value checkboxes) | AC-7.1 enum fields show only used values in dropdown order | AC-7.2 free-text fields distinct values A-Z | AC-7.3 (Blank) only when blank data exists | AC-8 options refresh on close and reopen | AC-9 Name list | AC-10 Company, Department, Route No. (Mob), Route No. (Demob), Dlog Status, Booking No. lists | AC-11 Resource Type, Accommodation, D/N Shift, Hot Bed, Transportation (Mob/Demob) lists | AC-12 default all checked, 0 selected = 0 rows | AC-13 in-filter search (case-insensitive, substring, trimmed) | AC-14 Select All includes hidden options | AC-15 Mob Date single picker | AC-16 Onboard Date From/To, overlap [Onboard, Demob - 1 day] | AC-16.1 range logic (both, From only, To only, both empty) | AC-16.2 From after To shows red border, no text | AC-17 Demob Date single picker | AC-18 instant filtering of left table and right schedule, no Apply | AC-19 empty Resource Category header hidden, Mob Route / Demob Route rows stay | AC-20 POB totals, Required Manpower and POB Chart not filtered | AC-21 Save while filtered keeps all hidden rows | AC-22 Reset | AC-23 blue dot indicator, also on page open with saved filter

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1 toggle | State transition | Panel does not open/close; grid loses data | TC-002 |
| AC-2 mutual exclusion | State transition | Two panels open, overlap | TC-003, TC-004 |
| AC-3 header, Reset disabled at default | Display | Reset enabled with nothing to reset | TC-002, TC-024 |
| AC-4, AC-5 sections, order, default | Display | Wrong count, order or default state | TC-005, TC-006 |
| AC-0.1 permission | Permission | Viewer can save global filter | TC-001, TC-033 |
| AC-6 global | Two users | Filter not shared | TC-034 |
| AC-7, AC-9, AC-0.2 Name | Equivalence, sort | Wrong order, case merge | TC-007, TC-008 |
| AC-7.2, AC-10 free-text lists | Equivalence | Missing (Blank), wrong sort | TC-009 |
| AC-7.1, AC-11 enum lists | Equivalence | A-Z instead of dropdown order, unused values shown | TC-010 |
| AC-7.3 Blank | Decision | (Blank) shown or hidden wrongly | TC-009, TC-010, TC-011 |
| AC-13 search | Equivalence, BND | Case, trim, substring, "No option" | TC-012, TC-013 |
| AC-14 select all hidden | Decision | Hidden options not toggled | TC-014 |
| AC-12, AC-18 untick / instant | State | Grid does not update, Save state | TC-015, TC-016 |
| AC-0.3 zero result | Empty state | No message shown | TC-017 |
| AC-15 Mob Date | Equivalence | Wrong people, wrong format | TC-018 |
| AC-16, AC-16.1 Onboard range | BND | Demob day counted, ranges wrong | TC-019, TC-020 |
| AC-16.2 From after To | NEG | No red border | TC-021 |
| AC-17 Demob Date | Equivalence | Wrong people | TC-022 |
| AC-0.4 date boundary | BND | Dates outside schedule pickable | TC-023 |
| AC-22 Reset | State | Not cleared | TC-024 |
| AC-23 dot | State | Dot stays or missing | TC-025, TC-026 |
| AC-19 rows | Decision | Empty category shown, route rows lost | TC-016, TC-027 |
| AC-20 static totals | Regression | POB changes with filter | TC-028 |
| Combine filters | Pairwise | OR instead of AND | TC-029 |
| AC-8 refresh | State | Stale options | TC-030 |
| AC-21 save keeps hidden rows | Data loss | Hidden rows deleted on Save | TC-031 |
| Save button after filter, Reset | Permission/state | Save enabled for viewer | TC-032, TC-033 |
| AC-23 saved filter at page open | State | Dot missing on open | TC-035 |
| Close without save / back / refresh | Exotic | Filter lost or kept wrongly | TC-036 |
| Double click / fast clicks | Exotic | Panel flicker, wrong state | TC-037 |

Categories skipped: Permission for filter-only (Story says no specific permission, covered by TC-033). Mobile/phone: not relevant, desktop planning grid. Very many rows: covered by P1 (26 Resources).

## Counts

High 14, Medium 18, Low 5. Auto 28, Partial 3, Manual 6.

## Open questions

1. Differs from Story (AC-5): on QA every section including Name is collapsed on first open; Story says Name is expanded and 15 others collapsed. TC-006 keeps the Story's expectation.
2. Differs from Story (AC-0.3): zero rows shows no message on QA; Story says "No data available". TC-017 keeps the Story's expectation.
3. Differs from Story (AC-2): Set Route opens a 400 px "Route" drawer over the screen while the Filter Panel stays open; Story says mutually exclusive. TC-004 keeps the Story.
4. Differs from Story (AC-15/16/17): pickers show `dd/MM/yyyy` (15/06/2026); Story says `DD Mon YYYY` (15 Jun 2026). TC-018 keeps the Story.
5. Differs from Story (AC-16.2): in `To` all dates before `From` are disabled so the red border cannot be reached by mouse. TC-021 keeps the Story; also needs the answer for keyboard typing.
6. Differs from Story (AC-0.4): no date is disabled outside Earliest Task Start - 7 days to Latest Task End + 7 days (plan P1: 1 to 9 Jun can be picked). TC-023 keeps the Story.
7. Job Owner (view only) sees the Save button enabled after a filter change on QA. Story says only Edit Manpower Mob Plan sees Save. TC-033 keeps the Story. What should JO see?
8. Is the "Select only search results" checkbox (appears under Select All while the search has text) intended? Not in Story. TC-013 notes it.
9. Does Resources that never had people disappearing when any filter is active (26 Resources became 3) match AC-19 ("zero personnel inside a category")? TC-016 keeps the Story wording; please confirm.
10. After Reset, does the page Save stay disabled? Story says user must click Save to publish the cleared state; QA shows Save disabled again when no saved filter exists. TC-024 checks the case with a saved filter on a card-owned plan.
11. Suggestion (not in Story): typing a date by keyboard into the date pickers (format, invalid text).
12. Suggestion (not in Story): does the "Filter Panel" tooltip on hover count as required text?

## Test cases (37 flows)

### TC-001 [FE][MT] Verify TM sees the Filter icon and the Save button on the Manpower Mob Plan page (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-0.1
1. Open the Manpower Mob Plan page of plan P2. -> The grid toolbar shows the Custom View icon and the Filter icon on its right side; the Save button is visible
2. Hover the Filter icon. -> A tooltip shows `Filter Panel`
Automation: data P2, read only, no clean up.

### TC-002 [FE][MT] Verify the Filter icon opens and closes the Filter Panel (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-1, AC-3
1. Click the Filter icon. -> The Filter Panel opens on the right of the grid with the title `Filter Panel` on the left and `Reset` on the right; Reset is disabled
2. Record the number of people rows in the grid. -> The count is written down for comparison
3. Click the Filter icon again. -> The Filter Panel closes
4. Count the people rows again. -> The count is the same as the recorded one

### TC-003 [FE][MT] Verify Filter Panel and Custom View close each other (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2
1. Click the Custom View icon. -> The Custom View panel opens with the title `Custom View`
2. Click the Filter icon. -> The Filter Panel opens; the Custom View panel closes
3. Click the Custom View icon. -> The Custom View panel opens; the Filter Panel closes

### TC-004 [FE][MT] Verify Set Route closes the Filter Panel (NEG) [Auto]
Precondition: common
Priority: Medium
Trace: AC-2
1. Click the Filter icon. -> The Filter Panel opens
2. Click `Set Route` on a Resource row. -> The route panel opens and the Filter Panel is closed (the Story says right panels are mutually exclusive)
Note: on QA the "Route" drawer opens over the screen and the Filter Panel stays open; see Open question 3.

### TC-005 [FE][MT] Verify the Filter Panel has the 16 sections in the right order, each with a chevron (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-4
1. Open the Filter Panel. -> The sections show in this order: Name, Company, Department, Resource Type, Accommodation, D/N Shift, Hot Bed, Mob Date, Onboard Date, Demob Date, Transportation (Mob), Route No. (Mob), Transportation (Demob), Route No. (Demob), Dlog Status, Booking No.; every section has a chevron
2. Click the chevron of `Company`. -> The Company section opens; its button changes from `Expand Company` to `Collapse Company`
3. Click the chevron of `Company` again. -> The Company section closes
Data set: loop all 16 sections for expand and collapse.

### TC-006 [FE][MT] Verify only the Name section is expanded when the panel opens (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-5
1. Open the Filter Panel for the first time on this page load. -> The Name section is expanded and shows Search, Select All and the names; the other 15 sections are collapsed
Note: on QA all 16 are collapsed (Open question 1).

### TC-007 [FE][MT] Verify the Name list sort and the list structure (POS) [Auto]
Precondition: common, plan P1
Priority: High
Trace: AC-7, AC-9, AC-0.2
1. Expand `Name`. -> The section shows a Search input, a `Select All` checkbox, then the names; all boxes are ticked
2. Read the names. -> The order is ioiojoyohoouihoih, ssssss, TEST, test organic crew (A to Z, case-insensitive)
3. Check there is no (Blank) option. -> No (Blank) is shown because every row has a name

### TC-008 [FE][MT] Verify names that differ only in case, and identical names, in the Name list (BND) [Auto]
Precondition: common, plan P1 (TEST and test organic crew), and a plan or draft row where two people have exactly the same name
Priority: Medium
Trace: AC-9
1. Expand `Name` on plan P1. -> `TEST` and `test organic crew` are two separate options
2. Add two people with exactly the same name in a draft (do not save), close and reopen the panel, expand `Name`. -> The name shows as one option only

### TC-009 [FE][MT] Verify free-text sections list distinct values A to Z, (Blank) only when a row is blank (POS) [Auto]
Precondition: common, plan P1
Priority: Medium
Trace: AC-7.2, AC-7.3, AC-10
1. Expand `Company`. -> The options are (Blank), test organic crew comp, directly after Select All
2. Expand `Department`. -> The only option is (Blank)
3. Expand `Route No. (Mob)` and `Route No. (Demob)`. -> Each shows its own list; both show only (Blank)
4. Expand `Dlog Status` and `Booking No.`. -> Each shows only (Blank)
Data set: table of section and expected options on P1, test loops over it.

### TC-010 [FE][MT] Verify enum sections show only used values in dropdown order, not A to Z (POS) [Auto]
Precondition: common, plan P1 and plan P2
Priority: High
Trace: AC-7.1, AC-7.3, AC-11
1. On plan P1 expand `Resource Type`. -> The options are Organic Crew, then Extra Turnaround (dropdown order, not A to Z)
2. Expand `Accommodation`, `D/N Shift`, `Hot Bed` on plan P1. -> Accommodation shows LQ only; D/N Shift shows Day only; Hot Bed shows No only; unused values (Barge, FSO, Night, Yes) are not shown
3. On plan P2 expand `Transportation (Mob)`. -> The only option is Vessel and no (Blank)
4. On plan P2 expand `Transportation (Demob)`. -> The only option is (Blank); Helicopter and MSB are not shown
Data set: table of plan, section, expected options.

### TC-011 [FE][MT] Verify (Blank) shows directly under Select All when a row has no value, and is not shown when all rows have a value (POS) [Partial: needs a plan with a blank Name or Resource Type row]
Precondition: common, a card-owned plan where one person has a blank Name and another has a blank Hot Bed
Priority: Medium
Trace: AC-7.3, AC-9, AC-11
1. Expand `Name`. -> (Blank) shows directly under Select All
2. Fill the blank name in the draft, close and reopen the panel, expand `Name`. -> (Blank) is no longer shown
3. Expand `Hot Bed`. -> (Blank) shows directly under Select All

### TC-012 [FE][MT] Verify in-filter search is case-insensitive, trimmed and substring (POS) [Auto]
Precondition: common, plan P1
Priority: High
Trace: AC-13
1. Expand `Name` and type `test` in Search. -> Only TEST and test organic crew show
2. Replace the text with `  TEST  `. -> The same two options show (spaces trimmed, case ignored)
3. Replace the text with `ORG`. -> Only test organic crew shows (substring)
4. Record the number of people in the grid. -> The grid still shows all 4 people; the search alone does not filter the grid
Data set: search text and expected options.

### TC-013 [FE][MT] Verify a search with no match shows "No option" and the search helper checkbox (NEG) [Auto]
Precondition: common, plan P1
Priority: Medium
Trace: AC-13
1. In `Name` Search type `zzz`. -> The list shows `No option`
2. Clear the Search and type `test`. -> The matches show; an extra checkbox `Select only search results` shows under Select All (not described in the Story, Open question 8)

### TC-014 [FE][MT] Verify Select All also toggles the options hidden by the search (POS) [Auto]
Precondition: common, plan P1
Priority: High
Trace: AC-14
1. In `Name` Search type `ss`. -> Only ssssss shows
2. Untick `Select All`. -> Every name is unticked, the hidden ones too
3. Clear the Search. -> All four names show unticked; the grid shows 0 people
4. Type `ss` again and tick `Select only search results`. -> Only ssssss is ticked; Select All shows the indeterminate `-` state; the grid shows 1 person

### TC-015 [FE][MT] Verify unticking one value filters the grid at once and sets Select All to indeterminate (POS) [Auto]
Precondition: common, plan P1
Priority: High
Trace: AC-12, AC-18, AC-7
1. Record the Resources and people counts. -> The counts are written down (26 Resources, 4 people)
2. Expand `Name` and untick `TEST`. -> The grid shows 3 people at once without an Apply button, in the left table and the right schedule; Select All shows the indeterminate `-` state
3. Tick `TEST` again. -> The 4 people return; Select All is ticked

### TC-016 [FE][MT] Verify Resource Category rows with no people are hidden and the route rows stay (POS) [Auto]
Precondition: common, plan P1
Priority: High
Trace: AC-19, AC-18
1. Untick `TEST` in `Name`. -> Resource Category rows that now have no people are hidden (Resources go from 26 to a smaller number)
2. Look at the schedule. -> The `Mob Route` and `Demob Route` rows are still shown
Note: on QA Resources that never had people also disappear (Open question 9).

### TC-017 [FE][MT] Verify zero results shows the empty state message (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-0.3, AC-12, AC-19
1. In `Name` untick `Select All` (0 selected). -> The grid shows no people and no Resource rows; the message `No data available` shows
2. Tick `Select All`. -> The grid shows all rows again and the message is gone
Note: on QA no message shows (Open question 2).

### TC-018 [FE][MT] Verify Mob Date filter shows only people with that Mob Date and the date format (POS) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-15
1. Expand `Mob Date`. -> One input with the placeholder `Date` and a calendar icon shows
2. Open the calendar. -> It opens on the month of the plan (May 2026), not the current month
3. Pick 17 May 2026. -> The input shows `17 May 2026` (Story format DD Mon YYYY); the grid shows only QA Blaster 1, QA EI 1, QA Insulator 1, QA Zulu 1
4. Hover the input and click the clear (x) icon. -> The date is cleared and all 11 people show
Note: QA shows `17/05/2026` (Open question 4).

### TC-019 [FE][MT] Verify Onboard Date range uses overlap with demob day not counted (BND) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-16, AC-16.1
1. Expand `Onboard Date`. -> Two inputs `From` and `To` show
2. Pick From 22 May 2026 only. -> The grid shows QA Blaster 2, 3, QA EI 2, 3, QA Insulator 2, 3, QA Zulu 2 (people whose stay ends on 21 May drop out)
3. Change From to 23 May 2026. -> Only the "3" people show (stay to 23 May)
4. Clear From and pick To 18 May 2026 only. -> Only the "1" people show (QA Blaster 1, QA EI 1, QA Insulator 1, QA Zulu 1)
5. Change To to 17 May 2026. -> The grid shows no people
Data set: table of From, To and expected people, test loops over it.

### TC-020 [FE][MT] Verify Onboard Date with both dates and with both empty (POS) [Auto]
Precondition: common, plan P2
Priority: Medium
Trace: AC-16.1
1. Pick From 19 May 2026 and To 20 May 2026. -> The grid shows people whose stay overlaps 19 to 20 May
2. Clear both dates. -> No filter applies and all 11 people show

### TC-021 [FE][MT] Verify From after To shows a red border and no text (NEG) [Partial: depends on how the date can be entered]
Precondition: common, plan P2
Priority: Medium
Trace: AC-16.2
1. Pick From 23 May 2026. -> The From input shows the date
2. Try to set To 20 May 2026 (before From). -> The From and To inputs show a red border and no error text
Note: on QA dates before From are disabled in To, so the mouse cannot reach this state (Open question 5); also try typing the date.

### TC-022 [FE][MT] Verify Demob Date filter shows only people with that Demob Date (POS) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-17
1. Expand `Demob Date`. -> One input with the placeholder `Date` shows
2. Pick 23 May 2026. -> The grid shows only QA Blaster 2, QA EI 2, QA Insulator 2, QA Zulu 2; Resource rows with no people are hidden

### TC-023 [FE][MT] Verify the date picker limits follow the schedule boundary (BND) [Auto]
Precondition: common, plan P1 (schedule starts 10 Jun 2026, ends 22 Jul 2026)
Priority: Medium
Trace: AC-0.4
1. Open the `Mob Date` calendar. -> The calendar opens on June 2026
2. Look at dates before Earliest Task Start - 7 days (before 3 Jun 2026). -> They are disabled
3. Look at dates after Latest Task End + 7 days (after 29 Jul 2026). -> They are disabled
4. Check 3 Jun and 29 Jul. -> Both can be picked
Note: on QA no date is disabled, 1 to 9 Jun can be picked (Open question 6). Check months before and after.

### TC-024 [FE][MT] Verify Reset clears every filter and Reset is disabled at default (POS) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-22, AC-3
1. Open the Filter Panel. -> Reset is disabled
2. Untick one name, type text in the Company Search and pick Demob Date 23 May 2026. -> The grid is filtered; Reset is enabled
3. Click `Reset`. -> The Search texts are cleared; all boxes are ticked; the date is cleared; all 11 people and 5 Resources show; Reset is disabled again
4. Look at the page Save button. -> Save is disabled again (no saved filter exists)
Note: with a saved filter on a card-owned plan, Reset then Save must publish the cleared state (Open question 10).

### TC-025 [FE][MT] Verify the blue dot shows when a filter is active and goes after Reset (POS) [Auto]
Precondition: common, plan P1
Priority: Medium
Trace: AC-23
1. Look at the Filter icon. -> It shows without a dot
2. Untick `TEST` in `Name`. -> The icon shows a blue dot
3. Click `Reset`. -> The dot is gone

### TC-026 [FE][MT] Verify the dot goes when the user puts the filter back by hand (BND) [Auto]
Precondition: common, plan P1
Priority: Medium
Trace: AC-23
1. Untick `TEST`. -> The blue dot shows
2. Tick `TEST` again. -> All boxes are ticked and the dot is gone (nothing deviates from default); Reset is disabled

### TC-027 [FE][MT] Verify filtering by a date and a name keeps only matching Resource Categories (POS) [Auto]
Precondition: common, plan P2
Priority: Medium
Trace: AC-19, AC-17
1. Pick Demob Date 23 May 2026. -> Resource rows Blaster, EI, Insulator, Zulu QA show with only the "2" people
2. Look at the schedule. -> `Mob Route` and `Demob Route` rows are still shown

### TC-028 [FE][MT] Verify POB totals, Required Manpower and POB Chart do not change with the filter (POS) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-20
1. Record the Blaster category POB row, the Required Manpower rows and the POB Chart row. -> The values are written down (Blaster POB `0 0 0 0 1 2 3 3 2 1...`, chart `...4 4 3...`)
2. Untick `QA Blaster 1` in `Name`. -> The QA Blaster 1 row is hidden
3. Compare the same rows. -> The Blaster POB, Required Manpower, red cells and the POB Chart are the same as recorded

### TC-029 [FE][MT] Verify different sections combine with AND (POS) [Auto]
Precondition: common, plan P2
Priority: High
Trace: AC-18
1. Untick `QA Blaster 2` in `Name`. -> QA Blaster 2 is hidden
2. Pick Demob Date 23 May 2026. -> The grid shows only QA EI 2, QA Insulator 2, QA Zulu 2 (QA Blaster 2 stays hidden)

### TC-030 [FE][MT] Verify the option lists refresh when the panel is closed and reopened (POS) [Partial: needs a draft data change]
Precondition: common, plan P2, unsaved draft
Priority: Medium
Trace: AC-8
1. Expand `Company` and note the options. -> The options are written down
2. Add a person with a new Company `Test Co Alpha` in the draft. -> The person shows in the grid
3. Close and reopen the Filter Panel, expand `Company`. -> `Test Co Alpha` is now in the list
4. Remove that person, close and reopen the panel. -> `Test Co Alpha` is no longer in the list

### TC-031 [FE][MT] Verify Save with an active filter keeps the hidden rows (POS) [Manual: needs a card-owned plan, Save writes shared data]
Precondition: common, card-owned plan with 4 people
Priority: High
Trace: AC-21
1. Untick one name in `Name`. -> That person is hidden
2. Edit a value of a visible person and click Save. -> The page saves and a success message shows
3. Click `Reset`. -> All 4 people show, including the hidden one with its old values

### TC-032 [FE][MT] Verify the Save button turns enabled after a filter change and a saved filter is global (POS) [Manual: needs a card-owned plan]
Precondition: common, card-owned plan
Priority: High
Trace: AC-0.1, AC-6
1. Untick one name. -> The grid is filtered; Save is enabled
2. Click Save. -> The filter is saved
3. Reload the page. -> The Filter icon shows the blue dot at once and the same name is unticked

### TC-033 [FE][MT] Verify a Job Owner sees the Filter Panel but not the Save button (NEG) [Auto]
Precondition: login as JO (View Active Manpower Mob Plan Item only), plan P2 (Active)
Priority: High
Trace: AC-0.1
1. Open the Manpower Mob Plan page. -> The Filter icon shows; the route button is `View Route`
2. Open the Filter Panel and untick one name. -> The grid is filtered
3. Look at the page toolbar. -> No Save button shows, or it is disabled (Story: only Edit Manpower Mob Plan sees Save)
Note: on QA Save becomes enabled for JO after a filter change (Open question 7). Do not press Save.

### TC-034 [FE][MT] Verify a saved filter is shown to another user (POS) [Manual: two users, card-owned plan]
Precondition: common, card-owned plan with a saved filter (from TC-032 data)
Priority: Medium
Trace: AC-6
1. Log in as JO and open the same plan. -> The Filter icon shows the blue dot; the grid shows the filtered people

### TC-035 [FE][MT] Verify the blue dot shows on page open when a saved filter exists (POS) [Manual: needs a saved filter on a card-owned plan]
Precondition: common, card-owned plan with a saved filter
Priority: Medium
Trace: AC-23
1. Open the page. -> The Filter icon shows the blue dot before the panel is opened
2. Click Reset and Save. -> The dot is gone after reopening the page

### TC-036 [FE][MT] Verify leaving the page without Save does not keep a local filter (Exotic: refresh) [Auto]
Precondition: common, plan P2
Priority: Low
Trace: none (state after refresh, risk from Reset/Save rules)
1. Untick one name. -> The grid is filtered and the dot shows
2. Reload the page. -> The page opens with all 11 people and no dot (the filter was not saved)

### TC-037 [FE][MT] Verify fast double click on the Filter icon and on Select All (Exotic: double click) [Auto]
Precondition: common, plan P1
Priority: Low
Trace: none (double click risk on AC-1 and AC-14)
1. Double click the Filter icon quickly. -> The panel ends closed after two toggles and the page shows no error
2. Open the panel and double click `Select All` in `Name`. -> All names end ticked and the grid shows 4 people

Test data in steps: Automation cases clean up by pressing Reset and not saving.

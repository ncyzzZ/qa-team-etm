# Draft test cases ETM-7345 Shutdown Timeline - Dashboard Frame Layout, Navigation & Split-Pane Architecture

Story: ETM-7345. Source: `story.md` (Description AC 1-8 and comments up to 2026-11-11), `docs/modules/shutdown-timeline*.md`, `knowledge/`. No analyst.md and no inspector.md: AC ids below are the Story's own numbers (AC-2.5 = AC 2, item 5). Priority comes from damage (the Story has none).
Existing [QA] subtasks: not read (exam run). Component tags: [FE] for screen, [BE] where the saved value is read back.
Common precondition ("common"): QA environment; the tester is logged in as Turnaround Manager (TM: View Timeline, Update Progress and Note, Edit Plan) unless a case says Job Owner (JO: View Timeline only); a Shutdown Event exists (own test event, Ramp down date and Ramp up date set, Shutdown Type FSD, PSD or MRU C/O); the event was opened from `Shutdown Event List` and the tab `Timeline` is shown; the Timeline has the seeded plan (several Activity Groups, all expanded). Browser timezone is not changed unless a case says so.
Think-like-the-user (3 lines): TM prepares the plan every week and rearranges the table to read dates or weekly bars; JO only reads. A tired user drags the splitter, collapses groups, then refreshes or leaves without saving. A careless user clicks `<` and `>` repeatedly, tries to resize week columns, opens the page with two tabs.

## Coverage map

| Requirement / screen state | Technique | Risk | Planned case(s) |
|---|---|---|---|
| AC-1.1 tab order | Visual / list | wrong tab position | TC-001 |
| AC-1.2 breadcrumb | Visual | wrong event name | TC-002 |
| AC-1.3 frame like Planning | Visual | layout outside frame | TC-003 |
| AC-1.4 UTC+7 | Error guessing (timezone) | date shifted a day | TC-004 |
| AC-2.1 title | Visual | wrong size | TC-005 |
| AC-2.2 badge Major/Medium/Minor, read-only | Decision table | wrong colour, editable badge | TC-006, TC-007 |
| AC-2.3 criteria popover | Hover state | no popover / stays open | TC-008 |
| AC-2.4 subtitle + tooltip | Data shown, event date change | wrong date format, not synced | TC-009, TC-010 |
| AC-2.5 Edit Plan button | RBAC, navigation | button shown to wrong role | TC-011 |
| AC-2.5 Update Progress button states | State change, dirty | wrong enable/disable, save fail | TC-012, TC-013, TC-014, TC-015 |
| AC-2.6 / AC-7.1-7.4 RBAC TM / JO / no permission | Roles | permission leak | TC-016, TC-017, TC-018, TC-019 |
| AC-3.1 left section columns, widths, alignment | Visual, boundary | wrong order / width | TC-020, TC-021 |
| AC-3.1 right section Status / Progress | Visual, boundary | wrong width, format | TC-022 |
| AC-3.1 weekly columns fixed, centre aligned | Negative (resize) | week resizable | TC-023 |
| AC-3.1 min widths on resize | Boundary matrix | shrink below min | TC-024 |
| AC-3.1 split table also on Edit Plan | Cross-screen | missing on Edit Plan | TC-025 |
| AC-3.2 drag right / left, occlusion order | State, boundary | wrong column order hidden | TC-026, TC-027 |
| AC-3.3 hover arrows, collapse, opposite jump | State changes | stuck splitter | TC-028, TC-029, TC-030 |
| AC-3.3 volatile layout | Leaving and coming back | layout remembered or lost wrongly | TC-031 |
| AC-3.4 scrollbars | Visual / sync | extra scrollbar, no sync | TC-032 |
| AC-4.1 default expanded | Default state | collapsed at load | TC-033 |
| AC-4.2 toggle + dirty | Dirty state | button not enabled | TC-034, TC-035 |
| AC-4.3 persistence on commit | Leaving and coming back | state lost / saved without commit | TC-036, TC-037 |
| AC-4.4 empty group row | Empty state | wrong text/font | TC-038 |
| AC-5 LWW two users | Two users | wrong overwrite / error shown | TC-039 |
| AC-6.1 first-time never empty | Default seed | empty plan | TC-033 |
| AC-6.2 no Activity Group state | Empty state | placeholder in wrong place | TC-040 |
| AC-8 module isolation | Same data on many pages | layout action changes other modules | TC-041 |
| Screen state: very long Activity text | Edge | text cut, row height | TC-042 |
| Screen state: very many rows / weeks | Edge | scroll breaks | TC-032 |
| Screen state: error on save | Error | silent failure | TC-014 |
| Screen state: loading / slow network | Error guessing | double submit | TC-015 |

Lessons (section 10): L-1 sort - not relevant, no sorted list in this Story. L-2 filter choice - not relevant, no filter. L-3 search read too early - relevant to waits only (automation waits for the save response before checking, in TC-012, TC-036). L-4 multi-row paste - not relevant, no paste on this frame. L-5 collapse per level - TC-034, TC-035, TC-036 (group level only; Story has one level). L-6 case variants - not relevant. L-7 selected vs hover - TC-028 (arrow buttons appear on hover only; the splitter collapsed state stays visible after mouse leaves). L-8 Story text changed - TC-006 (Shutdown Size rename, Minor colours changed 4 Nov), TC-005 (24px not 20px), TC-023 (week columns non-resizable added 6 Nov).
Categories 1-9 of lessons-learned: 1 two people - TC-039; 2 filter/sort/search - not relevant (none on frame); 3 old data after migration - not relevant (new Story); 4 strange input - TC-042 long text, TC-013 (Actual > 100); 5 reorder - not relevant (no reorder on this frame); 6 linked data - TC-010, TC-041; 7 charts depend on each other - not relevant (bars belong to ETM-7346); 8 same data on many pages - TC-009, TC-010, TC-041; 9 matrix - TC-006 (badge), TC-024 (min widths).
Skipped on purpose: weekly Plan/Actual values and bars (ETM-7346), seed values and badge calculation (ETM-7347), Edit Plan editing (ETM-7348), Key Milestones notes (ETM-7350), Shutdown Size change (ETM-7984).

Added for unsaved-changes and leaving: AC-4.2 / AC-2.6 JO leave no warning TC-043; Edit Plan after an unsaved collapse TC-044; Edit Plan undo by hand and leave routes TC-045, TC-047; layout changes never count as a change TC-046.

Counts: High 25, Medium 18, Low 4 (total 47). Auto 27, Partial 7, Manual 13.

## Open questions (return to lead)
1. Edit Plan `Save` and collapse: AC-4.3 says `[ Save ]` persists collapse and enables Save on collapse; module notes say Edit Plan always opens expanded and collapse does not enable Save. Which is right? (TC-035 asserts the Story text; marked Partial.)
2. AC-3.2 says dragging left makes `Activity` narrower than 360px; AC-3.1 says Activity minimum 360px. Confirmed only for the header handle; what is the smallest Activity width at the far-left drag (0px)? 
3. AC-2.5: Update Progress is disabled when `Total Actual (%) > 100.0`. Can Total Actual exceed 100 on this screen (inputs belong to ETM-7349)? What does the user see (tooltip or message)?
4. AC-2.5: after Update Progress succeeds, does the button return to disabled? Expected assumed yes (toast `Update Progress Successfully.`). 
5. AC-2.3: how long until the popover closes, and does it also open by keyboard focus? Not specified.
6. AC-2.2: badge label or tooltip "should read Shutdown Size" (comment 11 Nov): is there a visible label or tooltip text on the badge? Exact wording not given.
7. AC-7.4: without `View Timeline` the tab is hidden; what is shown for a direct link to the Timeline URL (Not found, 403 page)?
8. AC-1.4: which screen text proves UTC+7 for a user whose browser is in another timezone? Assumed the Ramp down and Ramp up date in the subtitle.
9. AC-3.3: when the splitter is in the middle and the user clicks `<`, does the splitter go to the far-left edge only (assumed yes)? What happens to the vertical scrollbar when the Left Section is hidden?
10. AC-4.2: does clicking a Job Owner's group toggle show any "unsaved" warning on leaving? Assumed no (no save right).
11. Suggestion (not in Story): keyboard operation of the splitter and arrow buttons; touch/phone layout; 200% zoom.
12. Suggestion (not in Story): a Timeline with 500+ weeks or 100+ activities (performance).
13. AC-4.2: if the TM collapses a group and expands it again by hand, is the page still "changed"? Expected written as disabled (nothing to save); TC-034 step 4 and TC-045 step 3 assume this.
14. AC-4.3: does the `Unsaved Change` modal also show for breadcrumb and browser Back (TC-037, TC-047), and does the browser itself ask before reload/close? Expected written as the modal on breadcrumb and Back; reload and tab close are not asserted.
15. Not done, reason: Edit Plan for a role that cannot save (table 2 row 12): JO has no Edit Plan button (AC-7.1), so there is nothing to test.
16. Q10 (JO leave warning) is now checked in TC-043 with the assumed answer "no warning"; the answer is still open.

## Test cases (47 flows)

### TC-001 [FE][MT] Verify the Timeline tab sits between Planning and Shutdown Organization (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-1.1
1. Open the event page. -> The tab bar shows 7 tabs in this order: `Details`, `Worklist`, `Manpower Resource`, `Shutdown Logic`, `Planning`, `Timeline`, `Shutdown Organization`.
2. Click the tab `Timeline`. -> The `Timeline` tab is highlighted as the active tab and the Timeline page shows.
3. Click the tab `Planning`. -> The Planning page shows and `Timeline` is no longer highlighted.
Automation: Automate, runs every release, result is always the same. Starting data: any event. What to check: tab names and order. Data set: none. Clean up: none.

### TC-002 [FE][MT] Verify the breadcrumb shows the event name (POS) [Auto]
Precondition: common; event named `7345 Breadcrumb Test A`
Priority: Medium
Trace: AC-1.2
1. Look at the top of the Timeline page. -> The breadcrumb shows `Shutdown Event List / 7345 Breadcrumb Test A`.
2. Click `Shutdown Event List` in the breadcrumb. -> The Shutdown Event List page shows.
Automation: Automate, fixed text. Starting data: event with a known name. Clean up: none.

### TC-003 [FE][MT] Verify the Timeline page is drawn inside the main content frame like the Planning tab (POS) [Manual: needs a person to compare the look of two pages]
Precondition: common
Priority: Low
Trace: AC-1.3
1. Open the tab `Planning`. -> The Planning page shows inside the main content frame under the tab bar; the frame border, margin and background are noted.
2. Open the tab `Timeline`. -> The Timeline page shows inside the main content frame under the tab bar with the same frame border, margin and background as noted for Planning; nothing is drawn outside the frame.
3. Resize the browser window narrower. -> The frame stays under the tab bar; the page does not show a horizontal scrollbar for the whole page.

### TC-004 [FE][MT] Verify dates follow UTC+7 when the browser timezone is different (Exotic: timezone) [Partial: browser timezone must be set by the test runner]
Precondition: common; event with Ramp down date `01 Dec 2026` and Ramp up date `20 Dec 2026`
Priority: High
Trace: AC-1.4
1. Set the computer or browser timezone to `UTC-8` (America/Los_Angeles) and reload the Timeline page. -> The page reloads.
2. Read the subtitle. -> The subtitle shows `Ramp down date: 01 Dec 2026 | Ramp up date: 20 Dec 2026` (not 30 Nov 2026 or 19 Dec 2026).
3. Read the Start Date and End Date of the first Activity. -> The dates show the same values as with a UTC+7 browser.
4. Set the browser timezone to `UTC+7` (Asia/Bangkok) and reload. -> Every date from step 2 and step 3 is the same as before.
Automation: Playwright `timezoneId` option, loop over `America/Los_Angeles`, `Asia/Bangkok`, `Pacific/Kiritimati`. Check subtitle and first row dates equal.

### TC-005 [FE][MT] Verify the page title is `Timeline`, left-aligned, 24px bold (POS) [Auto]
Precondition: common
Priority: Low
Trace: AC-2.1
1. Look at the heading under the breadcrumb. -> The heading text is `Timeline` and it is on the left side.
2. Check its font. -> The font size is 24px and the weight is bold.
Automation: Automate, computed style check. Clean up: none.

### TC-006 [FE][MT] Verify the Shutdown Size badge text and colours for Major, Medium and Minor (POS) [Auto]
Precondition: common; three events whose plan shows Major SD, Medium SD and Minor SD (own events, from the team's test data)
Priority: High
Trace: AC-2.2
1. Open the Timeline of the Major event. -> A badge next to the heading shows `Major SD`.
2. Check the badge colours. -> Background `#FFF1F0`, border `#FFA39E`, text `#F5222D`.
3. Open the Timeline of the Medium event. -> The badge shows `Medium SD` with background `#FFFBE6`, border `#FFE58F`, text `#FAAD14`.
4. Open the Timeline of the Minor event. -> The badge shows `Minor SD` with background `#F6FFED`, border `#B7EB8F`, text `#52C41A` (not the old `#F4F9E6` / `#A6CE39`).
Expected values table the test loops over:

| Event | Text | Background | Border | Text colour |
|---|---|---|---|---|
| Major | Major SD | #FFF1F0 | #FFA39E | #F5222D |
| Medium | Medium SD | #FFFBE6 | #FFE58F | #FAAD14 |
| Minor | Minor SD | #F6FFED | #B7EB8F | #52C41A |
Automation: Automate, matrix as one test over the table. Starting data: three events with the three sizes. Clean up: none.

### TC-007 [FE][MT] Verify the Shutdown Size badge cannot be changed on the Timeline page (NEG) [Auto]
Precondition: common
Priority: High
Trace: AC-2.2
1. Click the badge. -> Nothing opens; no dropdown or modal shows.
2. Hover the badge. -> The badge looks read-only or disabled; no edit control shows.
3. Check the badge size text. -> The badge text is the same as before the clicks.
Automation: Automate, fixed behaviour.

### TC-008 [FE][MT] Verify the criteria popover opens on hover of (i) and closes when the mouse leaves (POS) [Partial: popover card content is compared by a person]
Precondition: common
Priority: Medium
Trace: AC-2.3
1. Look next to the Shutdown Size badge. -> An `(i)` icon is shown right next to the badge.
2. Hover the mouse over the `(i)` icon. -> A floating popover opens showing the classification criteria cards (Major, Medium, Minor).
3. Read the cards. -> Major shows `> 2%`, `> 10 days`, `> 20 days`; Medium shows `0.3-2%`, `6-10 days`, `12-20 days`; Minor shows `< 0.3%`, `< 6 days`, `< 12 days` (as in the criteria table of the Default Plan file).
4. Move the mouse away from the icon and the popover. -> The popover closes.
5. Hover the icon, then move the mouse onto the popover. -> The popover stays open while the mouse is on it (record the behaviour if it closes).
Automation: popover open/close is automated; card text is checked by a person (source file not final).

### TC-009 [FE][MT] Verify the Ramp down / Ramp up subtitle and its (i) tooltip (POS) [Auto]
Precondition: common; event with Shutdown Date Start `18 Jun 2025` and End `10 Jul 2025`
Priority: High
Trace: AC-2.4
1. Read the line under the `Timeline` heading. -> It shows `Ramp down date: 18 Jun 2025 | Ramp up date: 10 Jul 2025`.
2. Count the `(i)` icons on that line. -> There is one `(i)` icon next to the line.
3. Hover the `(i)` icon. -> The tooltip shows exactly `Data from Shutdown Event`.
4. Click on the date text. -> Nothing editable opens; the line is read-only.
Automation: Automate. Starting data: event with the dates above. Clean up: none.

### TC-010 [FE][MT] Verify the subtitle follows a changed Shutdown Date and the seeded Start/End dates do not move (POS) [Partial: needs an event whose dates can be edited]
Precondition: own event, Shutdown Date `18 Jun 2025` to `10 Jul 2025`, Timeline already opened once
Priority: High
Trace: AC-2.4, AC-8
1. Open the Timeline and write down the Start Date and End Date of the first three Activities. -> The six dates are written down.
2. Open the tab `Details`, change the Shutdown Date to `25 Jun 2025` to `17 Jul 2025` and save. -> The save succeeds and the Details show the new dates.
3. Open the tab `Timeline`. -> The subtitle shows `Ramp down date: 25 Jun 2025 | Ramp up date: 17 Jul 2025`.
4. Compare the Start Date and End Date of the first three Activities. -> They are the same as written down in step 1 (the plan is not recalculated).
5. Look at the badge. -> The badge shows the same size as before.
Clean up: restore the event dates.

### TC-011 [FE][MT] Verify `Edit Plan` button is shown to Turnaround Manager and opens the Edit Plan screen (POS) [Auto]
Precondition: common (TM)
Priority: High
Trace: AC-2.5, AC-7.3
1. Look at the top-right toolbar. -> A button `Edit Plan` with a pencil icon shows (text button, no border).
2. Click `Edit Plan`. -> The page `Edit Shutdown Timeline Plan` opens in the same tab.
3. Click `Back` at the bottom. -> The Timeline page shows again (no `Unsaved Change` modal, nothing was changed).
Automation: Automate.

### TC-012 [FE][BE][MT] Verify `Update Progress` is disabled at first, and enabled/disabled follows unsaved changes (POS) [Auto]
Precondition: common (TM); Timeline just opened, nothing changed
Priority: High
Trace: AC-2.5
1. Look at the far right of the toolbar. -> A primary button `Update Progress` shows and it is disabled.
2. Collapse one Activity Group. -> `Update Progress` becomes enabled.
3. Click `Update Progress`. -> The toast `Update Progress Successfully.` shows (title `Update Success`).
4. Wait until the save response is back and look at the button. -> `Update Progress` is disabled again (no unsaved change).
Automation: Automate; wait for the update response before step 4. Clean up: expand the group again and Update Progress to restore.

### TC-013 [FE][MT] Verify `Update Progress` is disabled when Total Actual (%) is above 100.0 (NEG) [Manual: needs Actual input from ETM-7349 and Open question 3]
Precondition: common (TM); a plan whose weekly Actual (%) can be typed
Priority: High
Trace: AC-2.5
1. Type weekly Actual (%) values so that Total Actual (%) is `100.0`. -> `Total Actual (%)` shows `100.0` and `Update Progress` is enabled.
2. Raise one Actual (%) by `0.1`. -> `Total Actual (%)` shows `100.1`.
3. Look at `Update Progress`. -> The button is disabled.
4. Lower the value back by `0.1`. -> `Total Actual (%)` shows `100.0` and the button is enabled again.

### TC-014 [FE][BE][MT] Verify a failed `Update Progress` shows the fail toast and keeps the changes (NEG) [Partial: server error must be forced]
Precondition: common (TM); the update request is made to fail (network offline for the call)
Priority: Medium
Trace: AC-2.5
1. Collapse one Activity Group. -> `Update Progress` is enabled.
2. Block the network and click `Update Progress`. -> The toast `Update Progress Failed.` (title `Update Failed`) shows.
3. Look at the group and the button. -> The group stays collapsed and `Update Progress` stays enabled so the user can try again.
4. Restore the network and click `Update Progress`. -> The toast `Update Progress Successfully.` shows.
Automation: route abort for the update call.

### TC-015 [FE][MT] Verify double click on `Update Progress` saves once (Exotic: double click) [Partial: count of requests is checked by the runner]
Precondition: common (TM); one group collapsed so the button is enabled; network slowed
Priority: Medium
Trace: AC-2.5
1. Double-click `Update Progress` quickly. -> Only one toast `Update Progress Successfully.` shows.
2. Check the requests sent. -> One update request is sent, not two.
3. Look at the button. -> `Update Progress` is disabled after the save.

### TC-016 [FE][MT] Verify Turnaround Manager sees both buttons and all editing controls (POS) [Auto]
Precondition: common (TM)
Priority: High
Trace: AC-2.6, AC-7.2, AC-7.3
1. Look at the toolbar. -> Both `Edit Plan` and `Update Progress` are visible.
2. Drag the vertical splitter. -> The splitter moves.
3. Collapse and expand a group. -> The group collapses and expands.
4. Open the `Status` dropdown of one Activity. -> The options `Open` and `Close` show.
Automation: Automate.

### TC-017 [FE][MT] Verify Job Owner does not see `Edit Plan` or `Update Progress` and inputs are disabled (NEG) [Auto]
Precondition: common, logged in as Job Owner (View Timeline only)
Priority: High
Trace: AC-2.6, AC-7.1, AC-7.2, AC-7.3
1. Open the tab `Timeline`. -> The page shows with the title, badge and subtitle.
2. Look at the toolbar. -> There is no `Edit Plan` button and no `Update Progress` button.
3. Click the `Status` badge of an Activity. -> No dropdown opens (disabled).
4. Double-click a weekly Actual (%) cell. -> No input opens (disabled).
5. Try to open note creation or editing. -> Nothing opens (disabled).
Automation: Automate, role fixture for JO.

### TC-018 [FE][MT] Verify Job Owner can still drag the splitter, hover tooltips and collapse groups, and nothing is saved (POS) [Auto]
Precondition: common, logged in as Job Owner
Priority: Medium
Trace: AC-2.6, AC-7.1
1. Drag the vertical splitter to the right. -> The splitter moves and the Activity column widens.
2. Hover the `(i)` next to the subtitle. -> The tooltip `Data from Shutdown Event` shows.
3. Collapse an Activity Group. -> The group collapses; no `Update Progress` button appears.
4. Refresh the page. -> The group is expanded again (collapse was not saved) and the splitter is back at its default place.
Automation: Automate.

### TC-019 [FE][BE][MT] Verify a user without View Timeline cannot reach the Timeline (NEG) [Partial: needs an account without View Timeline; none known on QA, see Open question 7]
Precondition: a user without `View Timeline` (Administrator profile with the right removed, if such a login exists)
Priority: High
Trace: AC-7.4
1. Open an event as this user. -> The tab bar does not show the `Timeline` tab.
2. Open the Timeline address of the event directly. -> Navigation is denied; the Timeline data is not shown.
3. Call the timeline data API for the event as this user. -> The call is refused (no timeline data in the response).

### TC-020 [FE][MT] Verify the five Left Section columns, order, default widths and alignment (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1
1. Read the table headers left to right in the Left Section. -> The headers are `Activity`, `Action By`, `Focal Point`, `Start Date`, `End Date`, all left-aligned.
2. Read the default widths. -> Activity `360px`, Action By `100px`, Focal Point `120px`, Start Date `120px`, End Date `120px`.
3. Read a Start Date and an End Date cell. -> Dates show as `DD Mmm YYYY` (for example `18 Jun 2025`) and are left-aligned.
4. Read the cell data of Activity, Action By and Focal Point. -> The cell data is left-aligned.
Expected values table:

| Column | Default width | Alignment |
|---|---|---|
| Activity | 360px | left |
| Action By | 100px | left |
| Focal Point | 120px | left |
| Start Date | 120px | left |
| End Date | 120px | left |
Automation: Automate, loop over the table (bounding box width).

### TC-021 [FE][MT] Verify long Activity text wraps and does not break the row layout (Exotic: very long content) [Auto]
Precondition: common; an Activity with a long name (for example `Peer Review and Work Readiness Review` or a name near the field limit, set on Edit Plan on a spare plan)
Priority: Low
Trace: AC-3.1
1. Look at the row with the long Activity name. -> The text wraps to more lines inside the Activity column (width stays `360px`).
2. Look at the cells of Action By, Start Date, End Date and the weekly grid in the same row. -> They stay aligned with the row and the row grows in height for both sections.
3. Compare with the neighbour row. -> The neighbour rows are not shifted between the Left and the Right sections.

### TC-022 [FE][MT] Verify the pinned Status and Progress columns (POS) [Auto]
Precondition: common; plan with Activities and a Total Progress row
Priority: High
Trace: AC-3.1
1. Look at the column right of the gray splitter. -> `Status` is the first column, docked right next to the splitter, width `100px`, header and badge left-aligned.
2. Read a Status badge. -> It shows `Open` or `Close`.
3. Look at the merged header `Progress`. -> `Progress` spans 2 sub-columns with total width `160px`.
4. Read the first sub-column of an Activity. -> The top sub-row shows `Plan (%)` and the bottom sub-row shows `Actual (%)`, width `70px`, left-aligned.
5. Read the second sub-column. -> The top sub-row shows the total Plan (%) and the bottom shows the total Actual (%) with 1 decimal (for example `6.0`, `0.0`), width `90px`, left-aligned.
Automation: Automate; widths and text.

### TC-023 [FE][MT] Verify week columns are 50px, centre-aligned and cannot be resized (NEG) [Auto]
Precondition: common; weekly grid shows at least `W1` to `W5`
Priority: High
Trace: AC-3.1
1. Read the width of the `W1` header. -> The width is `50px`.
2. Hover the border between `W1` and `W2` headers. -> No resize cursor shows and no resize handle is present.
3. Try to drag that border 40px to the right. -> The width of `W1` and `W2` stay `50px`.
4. Read the month header, week headers and weekly labels. -> The month header (`Mmm YYYY`), `W1`, `W2`, weekly `Plan (%)` / `Actual (%)` labels and bars are centre-aligned in the 50px cell.
5. Look at the bottom `Total Progress` row. -> Weekly totals are centre-aligned under their week columns.
Automation: Automate; drag and read widths.

### TC-024 [FE][MT] Verify metadata columns cannot be resized below their minimum width (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-3.1
1. Drag the right border of the `Activity` header 50px to the right. -> The Activity column grows by about 50px.
2. Drag the same border to the left, far past `360px`. -> The Activity column stops at `360px` (it does not get narrower).
3. Repeat for the other columns of the table below. -> Each column stops at its minimum width.
Expected values table:

| Column | Minimum width |
|---|---|
| Activity | 360px |
| Action By | 100px |
| Focal Point | 120px |
| Start Date | 120px |
| End Date | 120px |
| Status | 100px |
| Progress | 160px |
Automation: Automate, loop over the table: drag by -200px and read width equals the minimum; also drag to minimum +1px and minimum -1px.

### TC-025 [FE][MT] Verify the Edit Plan screen has the same two-section table and splitter (POS) [Partial: Edit Plan columns differ, compared by a person]
Precondition: common (TM)
Priority: Medium
Trace: AC-3.1
1. Click `Edit Plan`. -> The page `Edit Shutdown Timeline Plan` opens.
2. Look at the table. -> The table is divided into a Left Section and a Right Section by a full-height vertical gray splitter.
3. Drag the splitter to the right. -> The splitter moves and the Start Date and End Date columns can be seen.
4. Try to resize a week column. -> The week column stays `50px`.

### TC-026 [FE][MT] Verify dragging the splitter to the right widens Activity and pushes Status, Progress and the weeks right (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2
1. Write down the width of `Activity` and the x position of `Status`. -> The values are written down.
2. Drag the gray splitter 100px to the right. -> The `Activity` column width grows.
3. Look at `Status`, `Progress` and the weekly grid. -> They moved right by the same distance and are still in the same order.
4. Drag the splitter back to the left by 100px. -> The Activity width is the same as written down in step 1.
Automation: Automate, compare bounding boxes.

### TC-027 [FE][MT] Verify dragging the splitter to the left hides columns right to left and keeps Status and Progress next to the splitter (BND) [Auto]
Precondition: common
Priority: High
Trace: AC-3.2
1. Drag the splitter left until `End Date` is hidden. -> `End Date` is hidden first; `Start Date`, `Focal Point`, `Action By`, `Activity` are still visible.
2. Drag further left until `Start Date` is hidden. -> `Start Date` is hidden next.
3. Drag further left until `Focal Point` is hidden. -> `Focal Point` is hidden, then `Action By` after more dragging.
4. Check `Status` and `Progress` at each step. -> They stay flush with the splitter and more week columns are shown.
5. Drag the splitter further left into the Activity column. -> `Activity` becomes narrower than `360px`, down to the splitter position.
6. Drag the splitter back right. -> The hidden columns come back in the reverse order (Action By, Focal Point, Start Date, End Date) with their previous widths.
Automation: Automate.

### TC-028 [FE][MT] Verify the arrow buttons are hidden by default and appear on hover of the splitter (POS) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.3
1. Look at the splitter with the mouse away from it. -> The `<` and `>` buttons are not shown.
2. Hover the mouse over the gray splitter. -> The `<` and `>` buttons appear on the splitter.
3. Move the mouse away. -> The buttons are hidden again.

### TC-029 [FE][MT] Verify the Left button hides the Left Section and the Right button hides the Right Section (POS) [Auto]
Precondition: common
Priority: High
Trace: AC-3.3
1. Hover the splitter and click the Left button `<`. -> The splitter moves to the far-left edge and the whole Left Section is hidden; `Status`, `Progress` and the weeks fill the table.
2. Drag the splitter to the middle. -> The table is divided in two sections again.
3. Hover the splitter and click the Right button `>`. -> The splitter moves to the far-right edge and the whole Right Section is hidden (weekly timeframe and `Status` / `Progress`).
Automation: Automate.

### TC-030 [FE][MT] Verify from a collapsed edge the opposite arrow jumps to the other edge and only a drag restores the middle (BND) [Auto]
Precondition: common; splitter in the middle
Priority: Medium
Trace: AC-3.3
1. Click `<` so the splitter is at the far-left edge. -> The Left Section is hidden.
2. Click `>` on the splitter. -> The splitter jumps to the far-right edge (not to the middle) and the Right Section is hidden.
3. Click `<` on the splitter. -> The splitter jumps back to the far-left edge.
4. Drag the splitter from the edge to the middle. -> The table is divided in two sections.
Automation: Automate.

### TC-031 [FE][MT] Verify splitter position and column widths reset on refresh (Exotic: leaving and coming back) [Auto]
Precondition: common
Priority: Medium
Trace: AC-3.3
1. Write down the default Activity width, then widen `Action By` by 40px and drag the splitter 120px right. -> The new layout shows.
2. Open the tab `Details` and then the tab `Timeline`. -> The layout is back to the default (session-only, record the actual result).
3. Change the layout again and refresh the page (F5). -> The splitter and all widths are the default values written down in step 1.
Automation: Automate.

### TC-032 [FE][MT] Verify scrollbars: two horizontal, one shared vertical, none under Status and Progress (POS) [Partial: very many rows and weeks need a big plan]
Precondition: common; plan with many Activities and a grid wider than the screen
Priority: Medium
Trace: AC-3.4
1. Look under the table. -> A horizontal scrollbar shows under the Left Section and another under the Weekly Timeframe section.
2. Look under `Status` and `Progress`. -> There is no horizontal scrollbar under them.
3. Scroll the Weekly Timeframe scrollbar to the right. -> Only the weekly grid moves; the Left Section and `Status` / `Progress` stay.
4. Scroll the Left Section scrollbar. -> Only the Left Section moves.
5. Scroll down with the single vertical scrollbar. -> The Left Section, `Status` / `Progress` and the weekly grid scroll down together and rows stay aligned.

### TC-033 [FE][BE][MT] Verify a new plan opens with every Activity Group expanded and is never empty (POS) [Auto]
Precondition: a newly created event (own event), Timeline opened for the first time
Priority: High
Trace: AC-4.1, AC-6.1
1. Open the Timeline of the new event. -> The table shows the seeded Activity Groups and their Activities (not empty and no `No activity added.` text for the whole table).
2. Look at every Activity Group chevron. -> All chevrons show `v` (expanded) and all child Activity rows show.
3. Refresh the page. -> All groups are still expanded.

### TC-034 [FE][MT] Verify clicking an Activity Group header or chevron toggles it and enables `Update Progress` (POS) [Auto]
Precondition: common (TM); `Update Progress` disabled
Priority: High
Trace: AC-4.2, AC-2.5
1. Click the header text of Activity Group 1. -> The group collapses, the chevron changes to `>`, its child rows hide and the group header row stays.
2. Look at `Update Progress`. -> The button is enabled.
3. Click the chevron icon of the same group. -> The group expands, the chevron shows `v` and the child rows show again.
4. Look at `Update Progress`. -> The button is disabled again (the group is back in its saved state, so there is nothing to save; see Open question 13).
5. Collapse a second group. -> Only the second group collapses; the other groups stay as they are.
Automation: Automate.

### TC-035 [FE][MT] Verify collapse on the Edit Plan screen marks it changed and enables `Save` (POS) [Manual: Story text and module notes disagree, see Open question 1]
Precondition: common (TM); Edit Plan opened, nothing changed
Priority: Medium
Trace: AC-4.2, AC-4.3
1. Look at `Save`. -> `Save` is disabled.
2. Collapse an Activity Group. -> The group collapses (chevron `>`).
3. Look at `Save`. -> `Save` is enabled according to the Story (record the actual result).
4. Click `Back`. -> The modal `Unsaved Change` shows according to the Story (record the actual result).

### TC-036 [FE][BE][MT] Verify collapse state is saved by `Update Progress` and kept after reopening (POS) [Auto]
Precondition: common (TM); own event
Priority: High
Trace: AC-4.3, AC-2.5
1. Collapse Activity Group 2 and Activity Group 4. -> Both groups are collapsed.
2. Click `Update Progress` and wait for the toast `Update Progress Successfully.`. -> The save succeeds and `Update Progress` is disabled.
3. Click the tab `Planning`. -> The Planning page shows at once; no `Unsaved Change` modal shows (the changes were saved).
4. Click the tab `Timeline`. -> Groups 2 and 4 are collapsed, the others are expanded.
5. Refresh the page. -> Groups 2 and 4 are still collapsed.
6. Open the same Timeline in a new private window (no stored browser data) as another Turnaround Manager. -> Groups 2 and 4 are collapsed and the others are expanded, the same as in step 4 (the state comes from the saved plan, not from the browser).
7. Expand groups 2 and 4 and click `Update Progress`. -> The groups are expanded and saved (clean up).
Automation: Automate, second browser context for step 6 (fresh storage, other TM login); wait for the update response in step 2.

### TC-037 [FE][MT] Verify an unsaved collapse is lost on refresh and on leaving the page (NEG) [Auto]
Precondition: common (TM); all groups saved as expanded
Priority: High
Trace: AC-4.3
1. Collapse Activity Group 1 and do not click `Update Progress`. -> The group is collapsed.
2. Refresh the page. -> All groups are expanded again.
3. Collapse Activity Group 1 again and click another tab (`Planning`). -> The modal `Unsaved Change` shows with `Are you sure you want to leave this page? Changes you made will not be saved.` and buttons `Continue Editing`, `Discard Change`.
4. Click `Discard Change`. -> The Planning page shows.
5. Come back to `Timeline`. -> All groups are expanded.
6. Collapse Activity Group 1 again and click `Shutdown Event List` in the breadcrumb. -> The modal `Unsaved Change` shows with `Continue Editing` and `Discard Change` (see Open question 14).
7. Click `Continue Editing`. -> The modal closes; the Timeline stays and Group 1 is still collapsed.
8. Click the browser Back button. -> The modal `Unsaved Change` shows and the user is not taken away silently (see Open question 14).
9. Click `Discard Change`. -> The previous page shows; coming back to `Timeline` shows all groups expanded.
Automation: Automate.

### TC-038 [FE][MT] Verify an expanded empty Activity Group shows `No activity added.` (POS) [Partial: font size is read from computed style; plan is prepared on Edit Plan]
Precondition: common; a spare plan where Edit Plan has `+ Add Activity Group` and saved a new empty group (own event)
Priority: Medium
Trace: AC-4.4
1. Open the Timeline. -> The new group header shows with the chevron `v`.
2. Look under the group header. -> A single read-only row shows the text `No activity added.`, left-aligned, font 14px regular.
3. Click the group header. -> The group collapses and the placeholder row is hidden.
4. Click the group header again. -> The group expands and the placeholder row shows again.
5. Click on the placeholder row. -> Nothing editable opens.
Clean up: delete the empty group on Edit Plan and save, or use a spare event.

### TC-039 [FE][BE][MT] Verify two Turnaround Managers: the last `Update Progress` overwrites with no error (Exotic: two users) [Partial: needs two sessions]
Precondition: two TM sessions (A and B) open on the same Timeline, both loaded before any change
Priority: High
Trace: AC-5
1. In session A collapse Group 1 and click `Update Progress`. -> The toast `Update Progress Successfully.` shows in A.
2. In session B (stale page) collapse Group 3 and click `Update Progress`. -> No error and no conflict dialog show in B (the Story has no conflict dialog; no `Plan has Been Changed` modal); the toast `Update Progress Successfully.` shows.
3. Refresh session A. -> The saved state is that of the last save (session B); the result is the same in B after refresh.
4. Repeat with the same group collapsed in A and expanded in B. -> The state of the last saver wins.
Clean up: restore all groups expanded and save.

### TC-040 [FE][MT] Verify the placeholder when no Activity Group exists appears under the `Key Milestones` row (NEG) [Partial: needs a plan with all groups removed on Edit Plan]
Precondition: spare event; on Edit Plan all Activity Groups deleted and saved
Priority: Medium
Trace: AC-6.2
1. Open the Timeline. -> The table shows the `Key Milestones` row.
2. Look directly under `Key Milestones`. -> A placeholder row `No activity added.` shows, 14px regular, left-aligned.
3. Look at the toolbar. -> `Update Progress` is disabled (nothing changed).
Clean up: restore the groups (Back / re-seed spare event).

### TC-041 [FE][BE][MT] Verify layout actions do not change Worklist, Shutdown Logic or Equipment Mob Plan data (POS) [Partial: data compared before and after by a person]
Precondition: common (TM); own event with Worklist and Shutdown Logic data
Priority: Medium
Trace: AC-8
1. Write down the row counts and one Start Date / End Date of the Worklist and Shutdown Logic pages. -> The values are written down.
2. On the Timeline drag the splitter, resize `Activity`, collapse and expand groups, then refresh. -> No error shows.
3. Open the Worklist and Shutdown Logic pages. -> The row counts and dates are the same as written down.
4. Open the Equipment Mob Plan. -> The data is the same as before the layout actions.

### TC-042 [FE][MT] Verify Timeline layout on a small window and with the browser window resized while the splitter is collapsed (Exotic: strange conditions) [Manual: needs a person to judge the look]
Precondition: common
Priority: Low
Trace: none (screen state: window size, splitter collapsed)
1. Click `<` so the Left Section is hidden, then make the browser window narrower. -> The table and toolbar stay inside the frame; no content is cut.
2. Make the window wider again. -> The table fills the frame and the splitter stays at the left edge.
3. Click `>`. -> The Right Section is hidden and the Left Section fills the frame.

### TC-043 [FE][MT] Verify Job Owner leaves the Timeline after collapsing a group with no unsaved warning (NEG) [Auto]
Precondition: common, logged in as Job Owner
Priority: Medium
Trace: AC-2.6, AC-4.2, AC-7.1
1. Collapse an Activity Group. -> The group collapses; no `Update Progress` button appears.
2. Click the tab `Planning`. -> The Planning page shows at once; no `Unsaved Change` modal shows.
3. Click the tab `Timeline`, collapse a group again and click `Shutdown Event List` in the breadcrumb. -> The Shutdown Event List shows at once; no modal.
4. Open the Timeline again, collapse a group and click the browser Back button. -> The previous page shows at once; no modal.
Automation: Automate, role fixture for JO.

### TC-044 [FE][MT] Verify Edit Plan opened with an unsaved collapse on the Timeline and then Back (POS) [Auto]
Precondition: common (TM); all groups saved as expanded
Priority: High
Trace: AC-4.2, AC-4.3
1. Collapse Activity Group 1 and do not save. -> The group is collapsed and `Update Progress` is enabled.
2. Click `Edit Plan`. -> The modal `Unsaved Change` shows (the Timeline has an unsaved change); click `Discard Change`.
3. Look at the Edit Plan page. -> The page `Edit Shutdown Timeline Plan` shows with Activity Group 1 expanded (the unsaved collapse did not carry over).
4. Click `Back`. -> The Timeline shows with Group 1 expanded and `Update Progress` disabled.
Automation: Automate.

### TC-045 [FE][MT] Verify Edit Plan: collapse then expand by hand leaves nothing to save (NEG) [Manual: depends on Open questions 1 and 13]
Precondition: common (TM); Edit Plan opened, nothing changed
Priority: Medium
Trace: AC-4.2, AC-4.3
1. Collapse an Activity Group. -> The group collapses.
2. Expand the same group. -> The group is expanded again as at the start.
3. Look at `Save`. -> `Save` is disabled (nothing to save; see Open questions 1 and 13).
4. Click `Back`. -> The Timeline shows at once; no `Unsaved Change` modal.

### TC-046 [FE][MT] Verify splitter and column width changes are not an unsaved change (NEG) [Auto]
Precondition: common (TM); all groups saved, `Update Progress` disabled
Priority: High
Trace: AC-3.2, AC-3.3, AC-4.2
1. Drag the splitter 120px to the right and widen `Action By` by 40px. -> The layout changes.
2. Look at `Update Progress`. -> The button is still disabled.
3. Click the tab `Planning`. -> The Planning page shows at once; no `Unsaved Change` modal.
4. Click the tab `Timeline`, drag the splitter again and click `Shutdown Event List` in the breadcrumb. -> The Shutdown Event List shows at once; no modal.
5. Open the Timeline, drag the splitter again and click the browser Back button. -> The previous page shows at once; no modal.
6. Open the Timeline, drag the splitter 120px right, click `Edit Plan`, then `Back`. -> The Edit Plan page opens without a modal; after `Back` the Timeline shows with the default splitter position and default widths.
7. Click `Edit Plan` and look at the table. -> The Edit Plan table shows the splitter and columns in the default position.
Automation: Automate.

### TC-047 [FE][MT] Verify Edit Plan: leaving through the tab, breadcrumb, browser Back and refresh after a change (NEG) [Partial: refresh prompt is the browser's own; depends on Open questions 1 and 14]
Precondition: common (TM); Edit Plan opened, one Activity Group collapsed or another change made
Priority: Medium
Trace: AC-4.2, AC-4.3
1. Click the tab `Planning`. -> The modal `Unsaved Change` shows; click `Continue Editing` and the Edit Plan page stays with the change kept.
2. Click `Shutdown Event List` in the breadcrumb. -> The modal `Unsaved Change` shows; click `Continue Editing` and the change is kept.
3. Click the browser Back button. -> The modal `Unsaved Change` shows; the user is not taken away silently.
4. Refresh the page. -> The page reloads with the change gone (not saved).

# Shutdown Timeline

`Timeline` tab of an ETM Shutdown Event: plan of groups/activities, weekly Plan/Actual grid, Edit Plan screen. All 6 stories are In Development, nothing run on the app yet (sources = TC drafts and notes). Newest date wins on conflict. Every line ends with its source: (ETM-nnnn, date), dates 2026.
Also read `shutdown-timeline-validation.md` (toast/modal texts, field limits) and `shutdown-timeline-default-plan.md` (plan, durations, start rules); not repeated here.

| Card | Feature | Last status |
|---|---|---|
| ETM-7345 | Frame layout, navigation, split pane | 4 Nov |
| ETM-7346 | Calendar engine, auto-bounding grid, weekly Plan (%) | 4 Nov (v3) |
| ETM-7347 | Event auto-creation, SD type estimation, default plan seeding | 4 Nov |
| ETM-7348 | Edit Plan screen, task planning | 3 Nov (+ 4 Nov rule) |
| ETM-7984 | Shutdown type change, recalculation, historical progress | 3 Nov (no answers yet) |
| ETM-8405 | Editable weekly Plan (%) in Edit Plan (also reads ETM-8388 paste, ETM-7349 input rules) | 17 Nov (AC + comment 15 Nov, all 12 BA answers 17 Nov; Jira text not yet updated) |

## Navigation and screen facts
- Open event, tab `Timeline` (7 tabs per AC: Details, Worklist, Manpower Resource, Shutdown Logic, Planning, Timeline, Shutdown Organization; Figma shows 5). (ETM-7345, 4 Nov)
- Breadcrumb `Shutdown Event List / {Event Name}`; heading `Timeline` + badge + (i); subtitle `Ramp down date: DD Mmm YYYY | Ramp up date: DD Mmm YYYY` with one (i), tooltip `Data from Shutdown Event`. (ETM-7345, 3-4 Nov)
- Top-right: `Edit Plan` (pencil, text button, no border) and `Update Progress` (disabled until a change). (ETM-7345, 4 Nov)
- Columns: Activity 360, Action By 100, Focal Point 120, Start Date 120, End Date 120 (`DD Mmm YYYY`), 4px gray splitter, Status 100 (`Open` red / `Close` green), Progress 160 (`Plan (%)` / `Actual (%)`, 1 decimal), week column 50. (ETM-7345, 4 Nov)
- Group header chevron `v` expanded / `>` collapsed; empty group shows grey `No activity added.` (ETM-7345, 4 Nov)
- Badge `Major SD` / `Medium SD` / `Minor SD`; popover on hover of (i). Criteria: Major >2% / TPSD >10 days / Train SD >20 days; Medium 0.3-2% / 6-10 / 12-20; Minor <0.3% / <6 / <12 days (Partial). (ETM-7345, 3 Nov)
- `Edit Plan` opens page `Edit Shutdown Timeline Plan` in the same tab; no breadcrumb, event name, tab bar or the two Timeline buttons; side menu keeps `Shutdown Event List` highlighted. (ETM-7348, 3 Nov, confirmed by: user)
- Edit Plan layout (user screenshot): columns Activity (`*`), Action By, Focal Point, Status (`*`), Progress (`*`), weekly grid; trash icon per activity; group row `Add Activity` + `...` (`Edit Activity Group`, `Delete Activity Group`); top `Add Activity Group`, Shutdown Type dropdown (`Major SD`, `Medium SD`, `Minor SD`), (i); footer `Back` (left, outlined), `Save` (right, primary). Start/End Date show after dragging the splitter right. (ETM-7348, 3 Nov, confirmed by: user)
- Edit page: Status, Actual, Note not editable; everything else editable. (ETM-7345, 3 Nov, dev checklist, not checked on QA)
- Roles (matrix): Turnaround Manager = View Timeline, Update Progress and Note, Edit Plan; Job Owner = View Timeline only. (ETM-7345/7346/7348, 3 Nov, confirmed by: user)
- QA event field label is `Shutdown Type` (FSD / PSD / MRU C/O); dates label `Shutdown Date`. (ETM-7347, 4 Nov, checked on QA)
- Create Shutdown Event: Administrator and Turnaround Manager granted, Job Owner denied (no `Create`). (ETM-7347, 4 Nov, confirmed by: BA)

## Confirmed rules

### Frame layout and split pane (ETM-7345)
- AC is authority except BA picked Figma for: Minor badge colours, title 24px bold, Edit Plan button without border. (ETM-7345, 4 Nov, confirmed by: BA)
- Badge colours bg/border/text: Major `#FFF1F0`/`#FFA39E`/`#F5222D`; Medium `#FFFBE6`/`#FFE58F`/`#FAAD14`; Minor `#F6FFED`/`#B7EB8F`/`#52C41A`. (ETM-7347, 4 Nov, confirmed by: BA)
- Scope: Frame, Splitter, Navigation, RBAC, group toggle only; seeds/formulas/badge calc = ETM-7347; weekly values/bars = ETM-7346. (ETM-7345, 4 Nov, confirmed by: BA)
- Splitter position and widths are not remembered; refresh resets. (ETM-7345, 4 Nov, confirmed by: BA)
- `<` `>` (shown on hover) move the splitter to the opposite extreme; only a drag returns it to the middle. (ETM-7345, 4 Nov, confirmed by: BA)
- Activity 360px minimum applies to the header resize handle only; dragging left hides End Date, Start Date, Focal Point, Action By in that order; Status/Progress stay flush to the splitter. (ETM-7345, 4 Nov, confirmed by: BA)
- Collapse/expand enables `Update Progress` (isDirty) and stays enabled after expanding back; Update Progress saves collapse; unsaved collapse is lost on refresh. (ETM-7345, 4 Nov, confirmed by: BA)
- Changing event dates keeps seeded Start/End, moves only subtitle and Ramp line; badge is not recalculated. (ETM-7345, 4 Nov, confirmed by: BA)
- Job Owner: no buttons, inputs disabled, update API returns 403. (ETM-7345, 4 Nov, confirmed by: user, role matrix)
- Two users with stale data: no error, last write wins. (ETM-7345, 4 Nov, confirmed by: user)

### Calendar engine, grid, weekly Plan (ETM-7346; expected values calculated from AC, not seen in app)
- Follow the AC: D = End - Start + 1, calendar days, round half up to 1 decimal, last week = remainder with no clamp; AC-silent behaviour is observed and reported. (ETM-7346, 3 Nov, confirmed by: user)
- Week starts Monday; week belongs to the month holding at least 4 of its days; month row `Mmm YYYY` `#E6E6E6`, week row `#E3EFF3`, column at least 50px. (ETM-7346, 3 Nov, AC)
- Grid start = min(earliest task Start week, earliest Actual week, Ramp Down week - 2 weeks); end = max(latest task End week, latest Actual week, Ramp Up week + 2 weeks). (ETM-7347, 4 Nov, confirmed by: user)
- Ramp Down/Up lines `#009FDA` with top badges, also on Edit Plan (no weekly bars there). Current Week header `#007DB3`, tint `#E6FCFF`, flips Mon 00:00 UTC+7. (ETM-7346, 3 Nov, AC)
- Dates are UTC+7 only; browser timezone must not change results. (ETM-7347, 4 Nov, confirmed by: user)
- Bottom Total row: week blank only when every task is blank in that week; Plan and Actual separate; 0 is NOT blank (`0.0`). BA to add to Story. (ETM-7346, 4 Nov, confirmed by: user)
- Minor optional tasks: Plan (%) shown, weekly cells blank (not `0.0`), no bar; Minor weekly total 55.0% until dates set, Total Plan 100.0. (ETM-7347, 4 Nov, confirmed by: BA)
- Actual only up to Current Week; Actual > 0 widens the grid, 0 does not; grid contracts only after `Update Progress`; out-of-range notes deleted silently. (ETM-7346, 3 Nov, confirmed by: user "follow the AC")
- Actual bar Green `#95DE64` when CumActual >= CumPlan (equal = green), Red `#F5222D` below, per task row. (ETM-7346, 3 Nov, confirmed by: user "follow the AC")

### Edit plan and task planning (ETM-7348; user: "follow the AC first")
- Add/Edit group is inline (no modal): title `New Activity Group`, row `No activity added.`; new activity Plan (%) `0.0`, Status `Open`. (ETM-7348, 3 Nov, confirmed by: user, "it is a new page")
- Duplicate names allowed; delete group/activity has no confirm and becomes real only on `Save` (`Back` + `Discard Change` restores). Trash always visible. (ETM-7348, 3 Nov, confirmed by: user)
- Over a field limit typing stops; a typed Plan (%) above 100.0 becomes 100.0 (ETM-8405 AC 3.3 replaces "cannot be entered"); Plan (%) editable only on Edit Plan; weekly cells are no longer read-only, see the ETM-8405 section. (ETM-7348, 3 Nov, confirmed by: user; updated by ETM-8405, 17 Nov)
- Dates outside Ramp down - Ramp up cannot be entered (conflicts with seed, see Open points). (ETM-7348, 3 Nov, confirmed by: user)
- Total != 100.0: red `#FFCCC7` on Total Progress Plan (%), `Save` disabled, hover `The overall planned progress must equal 100%.` (ETM-7348, 3 Nov, confirmed by: user; wording changed by ETM-8403, seen on QA 18 Nov)
- Actual > Plan: yellow `#FFE7BA`, tooltip `The actual progress is over the planned progress.`, reached by lowering Plan, `Save` stays enabled. (ETM-7348, 3 Nov, confirmed by: user)
- Dirty: only an edit followed by Save counts; no compare-back; F5 and browser Back are not changes. (ETM-7348, 3 Nov, confirmed by: user)
- Edit Plan always opens with all groups expanded; collapse is not saved by `Save` and does not enable it. (ETM-7348, 3 Nov, confirmed by: user)
- Deleting an activity with Actual > 0 lowers Total Actual and Total Plan. (ETM-7348, 3 Nov, confirmed by: user)
- No Edit Plan right (URL/API) or plan already deleted: `Not found`. (ETM-7348, 3 Nov, confirmed by: user)
- Not wanted: zoom 200%, keyboard-only, browser timezone, Excel paste, session expiry cases. (ETM-7348, 3 Nov, confirmed by: user)

### Seeding and type estimation (ETM-7347)
- Excel `Shutdown Timeline Default Plan.xlsx` is master; BA updates AC3.1; spelling corrected; Template ID = Excel column A (string). If the app shows card values, report as possible defect, never bend the TC. (ETM-7347, 4 Nov, confirmed by: BA and user)
- Badge from Duration and event Shutdown Type only (no Impact %); Start = End (1 day) allowed, Minor. FSD: 11 days Major, 6-10 Medium, 5 or less Minor. (ETM-7347, 4 Nov, confirmed by: BA)
- Seed = 28 rows (5 Group + 23 Activity), all `Open`, expanded, group subtotals 10.0 / 30.0 / 24.0 / 26.0 / 10.0, Total 100.0; Focal Point one line (`Offshore, Job Owners`); Minor optional: t6,t7,t8,t10,t11,t12,t13,t15,t18,t19,t23. (ETM-7347, 4 Nov, confirmed by: user)
- Anchor is Ramp Down only; later event-date changes do not recalculate Start/End. (ETM-7347, 4 Nov, confirmed by: BA)
- Create failure text `Fail` (confirm wording/placement on first run). (ETM-7347, 4 Nov, confirmed by: user)
- ETM-7984 out of scope for ETM-7347 (isolation only); ETM-7995 migration excluded. (ETM-7347, 4 Nov, confirmed by: BA and user)

### Shutdown type change and historical progress (ETM-7984)
- Nothing confirmed by user, BA or QA; modal texts are in the validation file. (ETM-7984, 3 Nov)
- Modal title when the dropdown changes to a different Shutdown Type is `Change Shutdown Size?` (body `Are you sure you want to change the shutdown size? This action will update some data.`, buttons `Confirm` / `Cancel`; confirmed in the Excel Confirmation&Result row 18, 17 Nov). Same type again: no modal. `Cancel` keeps everything incl. unsaved weekly edits; `Confirm` recalculates the working draft, saved only by `Save`. (ETM-8405, 17 Nov, confirmed by: user for the title; BA answer Q10)

### Editable weekly Plan (%) in Edit Plan (ETM-8405; replaces "weekly cells read-only" of ETM-7348 AC 3.2)
- Weekly Plan (%) cells are editable (double-click enters edit mode) only for weeks inside the activity Start Date - End Date (incl. weeks showing `0.0`); outside the range, and for activities without Start or End Date, cells stay read-only and empty; weekly Actual (%) cells stay read-only; double-click on a read-only cell does not enter edit mode. Look = same as the current Edit Plan weekly cells, no new mockup. (ETM-8405 AC 1.1-1.4, 17 Nov, AC; confirmed by: BA, Q12)
- Input: `0.0` valid; typing a second decimal is blocked; paste keeps the first decimal, no rounding (`12.36` and `12.34` give `12.3`, `99.99` gives `99.9`); above `100.0` typed or pasted becomes `100.0` (`100.9`, `100.95`, `250` give `100.0`); clear / negative / non-number leaves the cell blank. Clamp and truncate are silent (no message or tooltip). (ETM-8405 AC 1.5, 17 Nov, confirmed by: BA, Q4 and Q6)
- Blank is stored and shown as blank everywhere (Edit Plan after Save and reload, Main Timeline), counted as `0.0` in sums; a typed `0.0` stays `0.0`. All weeks blank: activity Plan (%) shows `0.0`. (ETM-8405 AC 2.1, 17 Nov, confirmed by: BA, Q1)
- All values are stored with 1 decimal before any sum, so `33.3 + 33.3 + 33.4` = `100.0` (Save allowed) and `0.1 + 0.2` = `0.3`. (ETM-8405, 17 Nov, confirmed by: BA, Q3)
- Editing a weekly cell: activity Plan (%) = sum of its weeks; Activity Group and Total Progress Plan (%) follow; Total not `100.0` gives red `#FFCCC7` and `Save` disabled; a calculated Plan (%) above `100.0` (`60.0` + `70.0` = `130.0`) is kept, no error on the activity row or group, only Total shows the error. (ETM-8405 AC 2.1-2.4, 17 Nov, AC + comment 15 Nov)
- Save is disabled only by: Total Progress Plan (%) not 100.0, an empty mandatory cell (Activity, Start Date, End Date, activity Plan (%)), or no change; a blank weekly cell does not disable it and is not red (the Excel Data Source row Weekly Plan (%) now has Required = No). (ETM-8405, 17 Nov, confirmed by: BA, Q2)
- Editing Start Date, End Date or Plan (%) recalculates ALL weeks of that activity (Day-Weighted Cumulative Pro-Rata), overwriting manual weekly edits, immediately, no modal. Typing the same Plan (%) value as now still overwrites. Weeks that fall out of the new range become empty and read-only; the activity Plan (%) stays and the weekly sum equals it; if the calculated Plan (%) was above 100.0 (e.g. 130.0) it is set to 100.0 first and then distributed (one remaining week = 100.0).  An activity without a date: weeks cleared, Plan (%) kept and counted in Group/Total; dates are mandatory so the cell is red `#FFCCC7` and `Save` is disabled. (ETM-8405 AC 3, 17 Nov, confirmed by: BA, Q7, Q8, Q9)
- Editing a weekly cell sets dirty, so `Back` shows `Unsaved Change`. `Save` stores the weeks as edited (not re-derived); Main Timeline and the cumulative Red/Green bars use them. (ETM-8405 AC 4, 17 Nov, AC)
- Size change: activities matched by Template ID are overwritten (incl. manual weeks); custom activities keep their weeks even when unsaved and even when their dates fall outside the new size (Total may then not be `100.0`). (ETM-8405 AC 5, 17 Nov, confirmed by: BA, Q10 and Q11)
- Multi-cell paste (ETM-8388 AC 3.2): starts at the active cell, only the weekly Plan (%) row is written, values after the End Date are dropped, per-cell rules above apply, Plan (%) = new sum, screen becomes dirty; copying from the Actual row into the Plan row works. Modal `Paste Validation Failed`, message `Some pasted values do not meet the validation rules and were not applied.`, button `OK`, appears ONLY for negative / non-number pasted values (they become blank); values above 100.0 (clamped) and extra decimals (truncated) show no modal. Clipboard with several rows: only the first row is pasted, the rest is dropped. (ETM-8405, 17 Nov, confirmed by: BA, Q5, DEC-042/043)

## Where the card text and the real system differ
- ETM-7345 Minor badge AC `#F4F9E6/#B7EB8F/#A6CE39` vs Figma `#f6ffed/#b7eb8f/#52c41a`; title AC 20px vs Figma 24px bold; tabs AC 7 vs Figma 5. Decision: Figma for badge/title, 7 tabs (BA). (ETM-7345, 4 Nov)
- ETM-7347 AC3.1 vs Excel (Action By/Focal Point of 11 tasks, 28 Template IDs numeric vs GUID, 6 typos). Decision: Excel master, spelling corrected. (ETM-7347, 4 Nov)
- ETM-7346 seed End = Start + Duration vs AC D = End - Start + 1; Medium and Minor "Material Management" last week gives `-1.0` / `-0.1`, expected per AC, report to BA as gap. (ETM-7346, 3 Nov)
- ETM-7348 Figma: no Start/End columns, no date picker, `*` on Status/Progress, modal for groups. Decision: AC; tag TC8 BLOCKED if Start/End absent. (ETM-7348, 3 Nov)
- ETM-7348 checklist "Actual < Plan" and "over 100% cannot Save" vs AC. Decision: Actual > Plan (user); below-100 unresolved. (ETM-7348, 3 Nov)
- ETM-7984 has no Figma frame for the size change modal (title now `Change Shutdown Size?`, see ETM-8405); popover `> 6-10 days` vs AC `6-10 days`; AC text used. (ETM-7984, 3 Nov)
- Sources conflict, newest wins: FSD = Major 1:1 (7345 notes) vs badge by duration (ETM-7347, 4 Nov); original typos (seed notes) vs corrected (ETM-7347 v2, 4 Nov); Total row out of scope (7346 v2) vs in scope (v3, 4 Nov).
- Known defects with a Jira key: none in the sources.

## QA test data
- Environment QA, roles Turnaround Manager, Job Owner, second TM session; Administrator only if a login exists. No logins in sources. (ETM-7345/7347, 4 Nov)
- ETM-7347: events `7347_<TC>_<value>`, each TC makes its own, about 30 stay on QA, nothing deleted; 2025 dates as is. Boundaries: FSD 5, 6, 10, 11 days; PSD/MRU C/O 11, 12, 20, 21 days. Seed checks on two events per type: Ramp Down 18 Jun 2025 and 28 Feb 2025. (ETM-7347, 4 Nov)
- ETM-7346: Ramp Down 18 Jun 2025 / Ramp Up 10 Jul 2025, one own event per data-changing flow (E-Major-R, E-Medium-R, E-Minor-R, E-Major-A, E-Minor-A, E-Major-B, E-Medium-A; E-Medium-Now Ramp Down 25 Nov 2026 / Ramp Up 17 Dec 2026). Grids: Major Mon 17 Jun 2024 to Mon 21 Jul 2025 (58 weeks), Medium from Mon 21 Oct 2024 (40), Minor from Mon 13 Jan 2025 (28). (ETM-7346, 4 Nov)
- ETM-7345: user supplies events showing Major, Medium, Minor plus a spare event before testing. (ETM-7345, 4 Nov)
- ETM-7348: Save is real, use a spare plan and restore; seed names e.g. `Frozen Work Lists` 2.0 to 7.0 gives total 105.0, `Peer Review and Work Readiness Review` 5.0 to 0.0 gives 100.0. No QA template with total != 100 exists; use a custom activity. (ETM-7348, 3 Nov; ETM-7347, 4 Nov, user)
- Run order: ETM-7346 before ETM-7345 TC4; ETM-7348 before ETM-7345 TC5 and ETM-7347 TC10. (ETM-7345, 4 Nov)

## Open points
- ETM-7347: which column (TPSD or Train SD) applies to PSD/MRU C/O; draft expects 11 Minor, 12 and 20 Medium, 21 Major; observe. Status says badge colour dropped, draft v2 added a colour step. (ETM-7347, 4 Nov)
- Does Edit Plan `Save` keep a group collapsed? ETM-7345 TC5 expects yes, ETM-7348 says no. (ETM-7345, 4 Nov)
- ETM-7348 Q22: seed dates before Ramp down vs the date-range rule; ETM-7346 TC-05 sets an End Date after Ramp Up. (ETM-7348, 3 Nov)
- ETM-7348: is Total 99.9 or 90.0 savable (Q24/Q18); does drag reorder count as a change (Q23a); Minor Optional rows listed red or omitted (Q6); Q8, Q9, Q19 unanswered. (ETM-7348, 3 Nov)
- ETM-7346 BA questions B1-B15 unanswered (negative week, `0.0` or blank, half rounding, one-sided dates, empty/same-week Ramp, W numbering, grid cap, bracket without dated child, Actual limits); Ramp dates editable after creation unknown. (ETM-7346, 3 Nov)
- ETM-7984 Q1-Q11 unanswered: modal design, same type again, Esc, draft until Save, Actual outside new dates, custom Plan (%) vs total, typo text, Event Details type, empty Ramp Down, restored Plan (%), Medium row 27 start. (ETM-7984, 3 Nov)
- ETM-7345: event badge `Pre-Execution`, `Ramp` column, Total Progress row owner; badge hex not read from screenshots. (ETM-7345, 3 Nov)
- ETM-7347 TC10 blocked until ETM-7348 is on QA. Not tested: ETM-7995 migration, role without View Timeline, time-of-day dates, Impact %. (ETM-7347, 4 Nov)

- ETM-8405 still open (17 Nov): BA has not yet pushed the new text (AC 2.1, 3.1, 1.6, Data Source, ETM-8388 AC 3.2) to Jira. (ETM-8405, 17 Nov)

## Sources
etm-7345-status.md, etm-7345-tc-draft.md, etm-7345-figma-notes.md, etm-7346-tc-draft.md, etm-7346-tc-draft-v2-steps.md, etm-7346-tc-draft-v3-grouped.md, etm-7347-status.md, etm-7347-tc-draft.md, etm-7347-seed-tc-notes.md, etm-7348-tc-draft.md, etm-7348-tc-review.md, etm-7984-tc-draft.md, etm-7984-figma-notes.md; headings of the two existing module files.

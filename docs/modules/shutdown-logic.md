# Shutdown Logic

Module of ETM (PTTEP EP-Turnaround Management): the Shutdown Logic detail page of a plan, a Gantt (task table + timeline) with a Manpower Resource histogram below it (table left, chart right).
Rule: every line ends with its source: (ETM-nnnn, date). Newest date wins when sources disagree; same-day conflicts are listed in section 4.
Also read, not repeated here: skill `etm-simop-rules` (SIMOP / Work Conflict Matrix), `docs/etm-7289-status.md`, `docs/modules/shutdown-logic-validation.md` (toast/modal messages, field limits of Create/Edit Shutdown Logic and Gantt Edit Work Header / Work / Work Breakdown).

| Card | Feature | Last status date |
|---|---|---|
| ETM-7898 | `Used Resource` toggle in the Manpower Resource histogram | 4 Nov 2026 (Story: Deployed to QA, Sprint 25) |
| ETM-7899 | Filter Panel: Platform and Work Header filters | no status file; named only as "Related" (ETM-7898, 4 Nov 2026) |

## Navigation and screen facts
- Open the plan's Shutdown Logic detail page from Shutdown Event List, then the plan (ETM-7898, 4 Nov 2026).
- Histogram: table on the left, chart on the right; a row = Resource + Shift + Capacity; PTTEP crew and Contractor resources are both listed (ETM-7898, 4 Nov 2026).
- Filter Panel sections named in the AC: Platform, Work Header, Activity Group, Duration, Date, Predecessor, Successor, SIMOP, Location; it has a `Reset` (ETM-7898, 4 Nov 2026).
- Toolbar toggles `Focus Critical Path` (ETM-5408) and `Focus Dropped Task` (ETM-5406); toolbar checkboxes `Expand Work Header`, `Expand Work`, `Expand Breakdown` (ETM-7898, 4 Nov 2026).
- Roles: Turnaround Manager (View All Shutdown Logic Item) and Job Owner; the QA `.env` has one user of each, so Job Owner View Active vs View All cannot both be tested (ETM-7898, 4 Nov 2026).
- Manpower is changed in the Manpower Resource tab of Breakdown Setting; POB and Man-hrs there are calculated and greyed (ETM-7898, 4 Nov 2026).
- Checked on QA, plan `eND50`, 4 Nov 15:48: histogram header = [blank, `Manpower Resource`, `Shift`, `Capacity`]; the only switches on the page are `Focus Critical Path` and `Focus Dropped Task`, both disabled; 5 resources: ECM Fitter, EI, Inspection, SSHE, test (ETM-7898, 4 Nov 2026).

## Confirmed rules
Used Resource toggle (resource hiding)
- Hide a row only when its allocated demand is 0 at every time point of the plan, for the tasks that pass the filters (ETM-7898, 4 Nov 2026, confirmed by: BA).
- The whole schedule of the filtered tasks counts; zoom and horizontal scroll are only a view (ETM-7898, 4 Nov 2026, confirmed by: BA).
- Rows are evaluated per Resource + Shift (ETM-7898, 4 Nov 2026, confirmed by: BA); but see Open point 1.
- Toggle ON hides rows at 0 demand; OFF always shows all rows, but values still follow the filters (ETM-7898, 4 Nov 2026, confirmed by: BA).
- Chart values count only tasks that pass the Filter Panel, Focus Critical Path and Focus Dropped Task (ETM-7898, 4 Nov 2026, confirmed by: BA).

Filter Panel / Focus toggles
- Only the Filter Panel, Focus Critical Path and Focus Dropped Task exclude tasks; column filters are not in scope (ETM-7898, 4 Nov 2026, confirmed by: BA + AC 2.2).
- Focus Critical Path and Focus Dropped Task come from ETM-5408 and ETM-5406 (ETM-7898, 4 Nov 2026, confirmed by: BA).

Blank state
- When no resource qualifies: blank space under the histogram header, no text (ETM-7898, 4 Nov 2026, confirmed by: BA).

Collapse / expand
- Collapse/expand (row arrows or toolbar Expand checkboxes) does not change the histogram (ETM-7898, 4 Nov 2026, confirmed by: BA + AC 2.3).

Roles
- Job Owner cannot edit tasks at all (ETM-7898, 4 Nov 2026, confirmed by: BA).

## Where the card text and the real system differ
- ETM-7898 status "Deployed to QA" (4 Nov) vs probe on QA plan `eND50` (4 Nov 15:48): no `Used Resource` toggle on the page. Probe is later, so the toggle is treated as NOT seen on QA. Wrong build/URL or defect is undecided; the user was asked, no answer in the sources (ETM-7898, 4 Nov 2026).
- AC 1.4 "active filtered timeline" vs BA "whole schedule": decision taken, BA (TC-006 follows BA) (ETM-7898, 4 Nov 2026).
- Figma 6481-787434 and 6:19708 do not show the toggle, blank state, Filter Panel, Reset or toolbar toggles; the toggle UI follows the AC text (ETM-7898, 4 Nov 2026).
- No defect logged for this module in the sources.

## QA test data
- Plan `eND50` (path in PW_REPO `.env` as ETM7898_PATH) is the plan the 4 Nov probe ran on (ETM-7898, 4 Nov 2026).
- Not yet named from QA: the plan, resources A/B/E/F/G/H, Work Headers H1/H2, task T, Platform and Activity Group; Test Preconditions use these placeholders (ETM-7898, 4 Nov 2026).
- Required data shape: an Active plan with resources of 0 demand and with demand, a resource used by one task and by several, critical-path and non-critical tasks, dropped tasks, parent nodes with children.
- Reset rule: no source gives one. Tests that change data must not Save, except the saved-state Test (ETM-7898, 4 Nov 2026).
- If data is missing the script says "skipped, no data" and never bends the Test (ETM-7898, 4 Nov 2026).

## Open points
1. BA says one resource has one shift but also gave a two-shift example (CR3 / Default and CR3 / Nightshift, only the 0-demand shift row hides). Test it only if the QA data has a resource with two shifts.
2. Where the toggle is on QA (see section 4).
3. From the AC only, not confirmed by BA or checked on QA: toggle default OFF, back to OFF after F5 or leaving the plan, client-only (no save request), no confirmation pop-up; Reset does not change the toggle.
4. Sort order of remaining rows (dictionary A-Z, upper-case before lower-case) is a draft expectation; source not stated.
5. After F5, whether the Filter Panel selection is kept is not fixed by the AC; record what the page does.
6. Largest allowed number of people on a task is unknown.
7. Vertical scrollbar behaviour after hiding rows relies on ETM-6862; not confirmed.
8. AC 6.3 (no permission, dashboard hidden) was removed from the AC; not tested.
9. Browser zoom 200% can only be simulated (TC-024).
10. ETM-7899 (Platform and Work Header filters): no rules, no status; nothing to rely on.

## Sources
- `D:\mac\DocforAi\STMS\claude\etm-7898-status.md` (4 Nov 2026)
- `D:\mac\DocforAi\STMS\claude\etm-7898-tc-draft.md` (v4, 4 Nov 2026; holds BA answers)
- Headings only: `.claude\skills\etm-simop-rules\SKILL.md`, `docs\etm-7289-status.md`, `docs\modules\shutdown-logic-validation.md`; no contradictions found.

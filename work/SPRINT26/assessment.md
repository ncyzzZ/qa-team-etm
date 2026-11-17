# Sprint 26 – User Story assessment (QA lead, 2026-11-16)

Source: Jira description + comments read 2026-11-16 (14 Stories, no Sub-task/Task). TC and hour counts are the lead's estimate (design + execute, one tester), not from Xray.
Not read in full: ETM-8042 AC 8 sub-items, ETM-8388 / ETM-8405 AC detail beyond the headings.

| Story | Status | Readiness | Risk | ~TC | ~Hours | Main open points |
|---|---|---|---|---|---|---|
| ETM-7343 Actual % font color | Open | Ready | Low-Med | 10 | 3 | Red/green hex not in AC (Figma); compare on rounded or raw value? |
| ETM-8003 S-Curve colors | Open | Ready | Low | 5 | 1.5 | Hex of blue/orange only in Figma |
| ETM-8034 Row highlight / text color | Open | Ready | High | 25 | 8 | Condition-color mix not specified numerically; do colors follow copy/paste, row move, delete? multi-row select? |
| ETM-8042 Plan Ramp Down/Up Date | Open | Ready | High | 30 | 10 | Edit after Daily Report exists (snapshot rule only on create); 4 pages + migration + duplicate |
| ETM-8392 Daily Report Ramp lines | Open | Ready after 8042 | Med | 10 | 3 | Depends on 8042 snapshot; no [QA] subtask |
| ETM-8393 Histogram tooltip | Open | Ready | Low-Med | 8 | 2.5 | Hover on empty area / capacity line only; hard to automate |
| ETM-8394 Import Work/Breakdown status | Open | Ready, needs test files | High | 22 | 7 | Role x Action x blank/filled x status combos; case/space of status text; no [QA] subtask |
| ETM-8405 Editable weekly Plan % | Open | Re-read (AC changed 15 Nov) | High | 28 | 9 | Decimal/rounding of sum; negative input; Input Rules live in ETM-7349 AC 2.4 |
| ETM-8388 Timeline copy & paste | Refinement | Not ready | Med-High | 25 | 8 | Still Refinement; two screens, Activity Group scope |
| ETM-8049 Working Location columns | Refinement | Not ready | High | 28 | 9 | AC changed 11 and 12 Nov; AC 6 letter-case rule across 7 entry points |
| ETM-8391 Remark column filter | Refinement | Not ready | Low-Med | 12 | 3.5 | Mockup "To be provided"; Blank rule (spaces-only, literal `-`) |
| ETM-8415 Fix Work Header | Open | Cannot assess | Unknown | 0 | 0 | Description is empty; only FE subtask ETM-8426 (Done) |
| ETM-8449 Faster collapse/expand | Open | Partly | Med | 6 | 3 | No measurable target for "faster"; regression only |
| ETM-8521 Faster paste in Gantt | Open | Partly | Med | 8 | 4 | No measurable target; needs large NxN dataset |
| **Total** | | | | **~217** | **~72 (~9 person-days)** | |

Suggested order: 8003, 7343, 8393 (quick) -> 8042 then 8392 -> 8034, 8394, 8405 -> performance pair 8449/8521 -> Refinement three after BA confirms.

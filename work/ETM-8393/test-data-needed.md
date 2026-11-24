# ETM-8393: test data for the 7 skipped Tests (2026-11-24)

Why they are skipped: the spec finds no bar of the right shape in the QA plan and ends with `notChecked` (not-proven). The checks themselves are already in
`tests/fe/e2e/shutdownLogic/verifyShutdownLogicHistogramTooltip.spec.ts`. Once the bars below are on screen, a re-run should prove them without changing the spec.

Every step below uses the UI as a TM. No DB, no API (rule: test data must be reachable from the UI).
Sources: `docs/modules/core-architecture.md` (Manpower Resource, Working Calendar).

## 0. Before you start (needs the user's yes)

- **Plan:** use a plan of the QA event that is **not Active**. The TM can open it, and other testers who use the Active plan are not affected. Do not switch which plan is Active.
- **Own resource:** on the Shutdown Logic histogram table, right-click and choose Add Resource. Name it `QA8393 Crew`.
  - Shift: a day shift with a clear Working Time, e.g. 08:00-17:00. Write the real shift name and hours here after you set it.
  - Capacity: **3**.
  - Changes here do not touch the master Manpower Resource tab.
- **Tasks:** use Level 4 Breakdown Tasks of this plan that have no other job. Add the resource through ≡, then Breakdown Setting Modal, then the Manpower Resource tab, and set Qty.
- **Histogram rule:** collapse the histogram for the Gantt and Breakdown Setting steps. Open it only to read the bars. Collapse it again after every reload.
- **Zoom:** use a time scale where each section is at least 12 px wide; the spec needs that.

## 1. Data per Test (one resource, days D1 to D8 in a row)

Shift = Day shift, Capacity = 3. "Resource cal." means the task's Working Calendar is Resource Calendar, so it works in shift hours only. "24h cal." means Custom Calendar with all 24 hours, so the task also works outside the shift.

| Task | Days | Qty | Calendar | Gives the bar |
|---|---|---|---|---|
| T1 | D1-D2 | 1 | Resource cal. | Used 1 < Cap 3: **green below** (8814) |
| T2 | D3 | 3 | Resource cal. | Used 3 = Cap 3: **green equal** (8814) |
| T3 + T4 | D4 (both) | 2 + 2 | Resource cal. | Used 4 > Cap 3: **red** (8813, and 8814 step "a green and a red bar") |
| (none) | D5 | - | - | Used 0: **gap** (8824) |
| T5 | D6 | 3 | Resource cal. | Same height as D3 after the gap, so two same-height sections split by a gap (8824). D4 is the section of another height |
| T6 | D7-D8 | 1 | **24h cal.** | Night hours: Used 1, Cap 0, **outside Working Time** (8823). At the shift edge Cap goes 3 to 0 while Used stays 1, so **Capacity changes, height stays the same** (8826) |
| T7 | D8 | 1 | Resource cal. | On D8 at the shift end: Used 2 to 1 and Cap 3 to 0, so **both change** (8827) |

Check before the run: open the histogram and hover every day once. Write the real Capacity / Used Resource numbers next to each row in this table.

**Not sure yet (probe before you seed):** does a 24h-calendar task really draw Used Resource outside the resource's shift, with Capacity 0? This needs ETM-15 AC 5.2. If the screen does not show it, 8823, 8826 and 8827 cannot be made from the UI. Then they get "data not reachable from UI" and go to the BA, not to a defect.

## 1a. Probe result, 2026-11-24 (read-only; nothing saved)

Plan the spec opens: `ETM7898_PATH` = event "แผนหยุดซ่อม", Shutdown Logic "eND50", not "For Critical Path". This plan is shared with the ETM-7898, ETM-8034 (row colour) and collapse/expand specs, so seeding here can break other cards' runs.

Whole timeline read from the Bryntum histogram data (`histogramData.subBars`: value = Used Resource, capacity), 21 May to 2 Jun, hourly:

| Shape | In the plan? | Where |
|---|---|---|
| Red (Used > Cap) | **no** | - |
| Green below | yes | ECM Fitter (heights 1, 2, 10, 11 / cap 12), EI, SSHE |
| Green equal | yes | AT 1/1, Inspection 1/1, test 1/1 |
| Used > 0 with Cap 0 (off-shift) | **no**, not even for the Dayshift-OT rows | - |
| Same-height sections split by a gap | yes, 1 h gaps (shift break) | EI, Inspection, SSHE, test (height 1 only; no other height in the same row) |
| Cap changes, same height | **no** | - |
| Cap and height both change | **no** | - |

What this means:
- The spec looks only at bars that are **on screen** on the first day. Green-equal and gap sections exist later in the plan but are never scrolled to. If the spec searched the whole timeline and scrolled to the bar (`bringIntoView` exists), it would find them. But 8814 also has a step that needs a red bar, so it still ends not-proven without red data.
- The Dayshift-OT rows drop to Used 0 in the shift break and off shift. With the Resource Calendar, Used Resource never shows outside Working Time. So 8823, 8826 and 8827 need a task on a 24h Custom Calendar (still to probe, this needs a write) or they are "data not reachable from UI".
- Red needs only more Qty than Capacity on overlapping tasks (Qty 1-99), so it can be made from the UI.

Choice for the seed (user): (a) seed in eND50 (the spec does not change, but other cards' specs share this plan), or (b) seed in a separate non-Active plan and point this spec at a new `ETM8393_PATH` (falls back to `ETM7898_PATH`).

## 2. ETM-8820 (steps 4-9, manual for now)

- BA R3-3: the histogram updates when the change is confirmed in the modal. Leaving without Save saves nothing.
- Missing: selectors for the Qty field and Save in Breakdown Setting, Manpower Resource tab. This needs one live probe (playwright-healer / browser_snapshot) to map them, then the spec can do steps 4-9.
- Data: T1 above works. Change Qty 1 to 2, check the bar and the card, then change it back to 1.
- Step 1 (filter): the filtered row must keep a bar inside Working Time. `QA8393 Crew` with T1 does that.

## 3. After the run

- Each Test that passes on this data: compare with `run-results.json`. Push to Xray only after the user's yes. Skipped is never PASSED.
- Clean up: remove the resource from T1-T7 and delete `QA8393 Crew`. Ask the user first; Delete Resource also removes it from the linked tasks.

## Order

1. User's yes for the plan and the resource.
2. Probe the 24h calendar (section 1, "Not sure yet").
3. Seed T1-T7, hover-check, fill in the real numbers.
4. User's yes, then re-run the 7 Tests (`--reporter=line`).
5. Evidence report, then ask about the Xray push.

## 4. Seed done so far (2026-11-24)

- Plan: duplicated eND50 into **"QA ETM-8393 Tooltip"** (Inactive; eND50 itself is the Active plan and was not changed).
  Path in the PW repo's `.env` as `ETM8393_PATH` (logic 325cbda3-2ea2-45a4-8042-47f7f4fa4de5, plan 471ed330-1f1e-46e6-9bc5-69eaa64747c7).
- Spec: `openTipPage(sl, true)` for 8813/8814/8820/8823/8824/8826/8827 opens `ETM8393_PATH` (falls back to `ETM7898_PATH`). ETM-8821 (JO) keeps the Active plan. Not committed.
- UI change in the copy: histogram table, ECM Fitter Capacity 12 → **10** (double-click the cell, Save, then Confirm "Save Shutdown Logic and Update Worklist"). Checked after reload: Cap 10, Used 11 = **red** at 21 May 09:00-11:00 (+07), Used 10 = **green equal** at 21 May 08:00, plus green below. This is enough data for 8813 and 8814.
- Still to do: 24h Custom Calendar probe (8823/8826/8827), a second height next to a gap (8824), and the Manpower tab selectors (8820).
- Clean up later (ask first): Delete Plan "QA ETM-8393 Tooltip" from the plan menu (it must stay Inactive).

## 5. 24h probe and seed, part 2 (2026-11-24)

- Probe answer: **yes, a task on a 24h Custom Calendar draws Used Resource outside the resource's shift with Capacity 0.** So 8823/8826 data can be made from the UI.
- UI change in the copy: task "=SUM(1+1)" (ECM Fitter[1], Custom Calendar 24h). Breakdown Setting, Advanced tab: Constraint Type **Must start on**, Constraint Date **21 May 2026 16:00**; then Save, page Save, Confirm. It runs 16:00-20:00.
- Moving that task took 1 off the morning, so ECM Fitter Capacity went 10 → **9** to keep the red bar.
- ECM Fitter on 21 May (+07) after reload: 08=9/9 (equal), 09-11=10/9 (**red**), 13-17 below, 18=1/9 then 1/0 (**Cap changes, same height**: 8826), 19=1/0 (**off-shift**: 8823).
- 8813 + 8814 re-run on this data: **2 passed, proven 2/2** (run 2026-11-24_221146_ETM-8393).
- Still missing: 8824 (two same-height sections split by a gap + another height in one row), 8827 (Used and Cap change at the same point; needs a Resource-Calendar ECM Fitter task that ends exactly at the shift end while the 24h task runs), 8820 (Manpower tab selectors).
- 8823 + 8826 run: 2 passed, proven 2/2 (run 2026-11-24_221856_ETM-8393).

## 6. Seed for 8824 + 8827 (2026-11-24, UI, saved, checked after reload)

- Task "Valve A2" (09:00-14:30): Breakdown Setting, Manpower Resource tab (AG Grid: `.ag-row[row-id="1"] [col-id="resourceType"]`, a double-click opens an autocomplete; `[col-id="quantity"]`, a double-click opens an input). Added **EI, Qty 2**.
- Task "=SUM(1+1)" (was 2 Jun, ECM Fitter[1], Resource Calendar): Advanced tab, **Must start on 21 May 2026 15:00**. It now runs 15:00-20:30 and stops at the shift end.
- 21 May (+07) after reload:
  - EI: 09-11 = 2, gap at 12, 13:30-15 = 2 (**same height split by a gap**), 17:30-19 = 1, gap, 20-22 = 1, so there is another height in the same row (8824).
  - ECM Fitter: 08 = 9/9, 09-11 = 10/9 (red), 18 = 2/9 then **1/0 (both change: 8827)**, 19 = 1/0 (off-shift), 20 = 1/9 (same height 1, Cap 0 to 9: 8826 pair at 19→20).
- The selectors of the Manpower tab above are also what ETM-8820 steps 4-9 need.

## 7. Run of the 6 seeded Tests (2026-11-24)

- 8813, 8814, 8823, 8826, 8827: passed, proven (run 2026-11-24_222554).
- 8824 failed first. **Script bug, not an app defect:** the spec took two ECM Fitter sections of height 2 with a height-1 bar between them as a "gap". Spec fixed: (1) the second section must be the very next section, with empty chart between; (2) hover the last bar of the first section, so the gap stays inside the narrow visible chart. Re-run: passed, proven 1/1 (run 2026-11-24_222853).
- Card now: 14 passed, 1 skipped (ETM-8820, Manpower tab steps 4-9 still manual).

## 8. ETM-8820 automated (2026-11-24)

- Steps 4-9 are now in the spec: Breakdown Setting, Manpower Resource tab, Qty +1, confirmed in the modal only (BA R3-3). The page is never saved; step 9 puts the Qty back. The row is the first one that still has a task in the drawn chart after the Work Header filter (AT, the step-1 row, gets filtered away).
- Run 2026-11-24_224600: passed, proven 1/1, no not-checked steps.
- **Card: 15/15 passed (run-results.json).** Not pushed to Xray, not committed.

## 9. Xray push (2026-11-24, user's yes in chat)

- Pushed 7 Tests (8813, 8814, 8820, 8823, 8824, 8826, 8827) PASSED to Test Execution **ETM-8828** with their step pictures (output/evidence/ETM-xxxx, none blank) and a comment naming the run. push-guard OK first.
- Read back: ETM-8828 is 15/15 PASSED.
- Left: commit the spec change (PW repo) on request; delete the plan copy "QA ETM-8393 Tooltip" only after a yes (delete needs its own approval).
- 2026-11-24: user said keep the plan copy "QA ETM-8393 Tooltip" for retests (do not delete).

## 10. Closeout (2026-11-24, user: "ปิดงาน ย้ายการ์ดได้เลย")

- 15 linked Tests: Resolved, then Closed, Resolution Done (checked with JQL).
- Test Execution ETM-8828: Done. [QA] subtasks ETM-8562 and ETM-8563: Done.
- Story ETM-8393: In Testing → **Ready for UAT**.

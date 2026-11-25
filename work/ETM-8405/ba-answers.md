---
ticket: ETM-8405
title: "[Improvement] Shutdown Timeline - Editable Weekly Plan (%) in Edit Plan"
written: 2026-11-24
sources: docs/modules/shutdown-timeline.md (ETM-8405 section, BA answers 17 Nov, DEC-041..044), .claude/team/work/ETM-8405/ba-answers.md (Thai, full text), ETM-7346 AC 3 and AC 4.1 (Jira, read 2026-11-24)
status: rounds 1-2 answered by BA (17 Nov); R3-1 settled by ETM-7346 AC 4.1 (user, 24 Nov); D-1 (user decision) differs from the AC 2.2 text
---

# ETM-8405 BA answers (summary for the TCs and scripts)

Each line: the answer, then where it comes from. Findings ids are in `findings.json`.

## Round 1 (12 questions, BA 17 Nov)

| Q | Answer | Source |
|---|---|---|
| 1 | A cleared / negative / invalid weekly cell is blank everywhere (Edit Plan after Save and reload, Main Timeline); counted as `0.0` in sums; a typed `0.0` stays `0.0`. All weeks blank: activity Plan (%) shows `0.0`. | BA Q1, AC 2.1 |
| 2 | Save is disabled only by: Total Progress Plan (%) not 100.0, an empty mandatory cell (Activity, Start Date, End Date, activity Plan (%)), or no change. A blank weekly cell does not disable Save and is not red (Data Source: Weekly Plan Required = No). | BA Q2 |
| 3 | Every value is kept with 1 decimal before summing: `33.3 + 33.3 + 33.4` = `100.0`, `0.1 + 0.2` = `0.3`. | BA Q3, AC 2.1 |
| 4 | Paste truncates to 1 decimal, no rounding (`12.36` -> `12.3`, `99.99` -> `99.9`); above 100.0 becomes `100.0` (`100.9`, `100.95`, `250`). | BA Q4, AC 1.5 |
| 5 | Multi-cell paste follows ETM-8388 AC 3.2: starts at the active cell, Plan row only, values after End Date dropped, per-cell rules apply, Plan (%) = new sum, dirty. Modal `Paste Validation Failed` / `Some pasted values do not meet the validation rules and were not applied.` / `OK` only for negative or non-number values. Several clipboard rows: only the first row is pasted. | BA Q5, DEC-042/043 |
| 6 | Clamp and truncate are silent (no message, no tooltip). | BA Q6 |
| 7 | Typing a Plan (%) redistributes even when it equals the current value; a typed value above 100 becomes 100.0 and is distributed. | BA Q7, DEC-041 |
| 8 | Weeks that leave the new date range become empty and read-only; Plan (%) stays and the weekly sum equals it. A calculated Plan above 100.0 (e.g. 130.0) is first set to 100.0, then distributed. | BA Q8, R2-5 |
| 9 | An activity loses a date: weeks cleared, Plan (%) kept and counted in Group / Total; empty date cell red `#FFCCC7`, Save disabled. | BA Q9 |
| 10 | Size change to a different type shows `Change Shutdown Size?` (`Are you sure you want to change the shutdown size? This action will update some data.`, `Confirm` / `Cancel`). Cancel keeps everything incl. unsaved weekly edits; Confirm recalculates the draft, saved only by Save. | BA Q10, Excel Confirmation&Result row 18 |
| 11 | Custom activities keep their weeks on a size change, even unsaved and even when their dates fall outside the new size (Total may then not be 100.0). Template activities (matched by Template ID) are overwritten. | BA Q11, AC 5 |
| 12 | No new mockup: editable and read-only cells look like the current Edit Plan cells; double-click enters edit mode, a read-only cell does nothing. | BA Q12, AC 1.6 |

## Round 2 (7 questions)

| Q | Answer | Source |
|---|---|---|
| R2-1 | Same as Q2 (Data Source Required = No). | Story 17 Nov |
| R2-2 | Same question as R3-1: **not answered**, see below. | - |
| R2-3 | Same as Q5 (modal only for negative / non-number). | DEC-042 |
| R2-4 | Same as Q5 (only the first clipboard row). | DEC-043 |
| R2-5 | Calculated Plan above 100.0, then a date change: set to 100.0 first, then distributed (one week left = 100.0). | Story 17 Nov |
| R2-6 | Modal body says "shutdown size" (see Q10). | Excel row 18, 17 Nov |
| R2-7 | Mockup not required. | Story 17 Nov |

## Round 3

| Q | Answer | Source |
|---|---|---|
| R3-1 | **No BA reply recorded.** ETM-8643 steps 18 and 21 still say "not yet confirmed by BA". ETM-7349 AC 3.1 ("Numeric Entry Present") and ETM-7346 AC 4.1 already cover it: a week with a recorded Actual always shows a bar; colour = Green when CumActual >= CumPlan, Red when below, blank Plan counted as `0.0` (option A of the question). **Accepted by the user 2026-11-24 (chat: "ใช้ AC 4.1").** | ETM-7346 AC 4.1 (F-8 confirmed) |
| R3-2 | Modal body text: `Are you sure you want to change the shutdown size? This action will update some data.` The Story points to Excel row 18 (not 16); the Excel fix is for BA (round 4 Q2). | ETM-7984 AC 1.4 |

## Engine for AC 3.1 (ETM-7346 AC 3.2, Cumulative Difference)

`CumPlan_k = round(P * CumDays_k / D, 1)` (half up), `CumPlan_N = P`, `Plan_k = CumPlan_k - CumPlan_(k-1)`.
Piping Inspection (03 Jun - 16 Jun 2026 = 5 + 7 + 2 days), P 50.0: `17.9, 25.0, 7.1`. 01 Jun - 16 Jun: `21.9, 21.9, 6.2`. 01 Jun - 09 Jun: `38.9, 11.1`. Used by `proRata()` in `verifyWeeklyPlanEdit.helpers.ts`.

## Differs from the AC (decision, not a BA answer)

- **D-1 (user, 18 Nov, chat 20 Nov):** the Edit Plan group row shows no Plan (%) summary; the total is only in Total Progress. AC 2.2 still says "Activity Group summary ... update accordingly". ETM-8640 steps 6 and 17 and the script (`verifyWeeklyPlanEdit.spec.ts`, `groupSummaryValue(GROUP)` is `null`) follow D-1. **Confirmed again by the user, 2026-11-24 (chat): no summary, keep D-1.** TC and script stay as they are. Left for BA: every BA-side source says the Group summary updates (AC 2.2, AC 2.4, BA Q9 "counted in Group / Total", ETM-7347 AC 3.1 subtotals); no BA source backs D-1. Asked in `questions-for-BA-round4.md` Q1 (F-22). ETM-8640 is final only after BA answers.

## Round 4 (BA answer file 2026-11-24, `work/SPRINT26/ba-answers-all-2026-11-24.md`, "Audit items")

| Q | Answer | Source |
|---|---|---|
| R4-1 | BA proposes to change AC 2.2 to "`Total Progress` → `Plan (%)` must update accordingly" and remove the Group summary, which matches D-1. BA asked QA to confirm D-1; the Story edit still waits for BA approval. Check 24 Nov: ETM-8640 steps 6/17 and the script (group row has no summary and no error colour; Total Progress updates) already match the proposed text, so no TC or script change is needed. **BA changed the Story 2026-11-24 14:23: AC 2.2 = Total Progress only, "The Activity Group row does not show a summary"; AC 2.4 no longer names the Group.** | Jira ETM-8405 AC 2.2/2.4 (F-22 ac-changed) |
| R4-2 | Not in the BA file; still open (Excel row 18 for `Change Shutdown Size?`). | open |

# ETM-8394 BA answers

## Round 1 (questions-for-BA.md, answered 2026-11-18)
Full text: `.claude/team/work/ETM-8394/ba-answers.md` (Q1-Q16, all answered). Story v4 (18 Nov 17:09) took them in: AC 1.1 role, AC 3.3 "edited" = value differs, AC 3.4 deleted Work = UUID Error, AC 4 `Change Requested` importable, AC 6 trim + case, AC 7 Delete ignores status.

## Round 2 (questions-for-BA-round2.md)
The answer text was not saved; the user said on 2026-11-19 that all questions were answered. BA's AC update of **2026-11-23** (Jira comment) answers R2-3:
- R2-3 (status on the wrong Data Level row): **AC 4**: `Work Status` and `Breakdown Status` belong to the `Work` row. Values on a `Work Breakdown` row are ignored without any message.
- R2-1 (preset breakdowns) and R2-4 (delete a breakdown inside a Revise): with one Breakdown Status per Work (see R3-1), the generated or remaining breakdowns have no status of their own. The Work row's value (or the default) applies.

The same AC update also added:
- AC 1.3 (frozen Worklist);
- AC 3.2 (explicit trigger list);
- AC 3.3.1-3.3.3 (trim; case ignored only for master data or duplicate-check values; everything else compared exactly);
- AC 3.4 (Error on every flagged row);
- no history entry on import.

## Round 3 (questions-for-BA-round3.md): BA answered all on 2026-11-24
Source: `work/SPRINT26/ba-answers-all-2026-11-24.md` (DEC-076, DEC-059).

1. ✅ **Breakdown Status is one value per Work.** Both status columns belong to the Work row. Values on breakdown rows are ignored without a message (DEC-076 (3), AC 4).
2. ✅ **Invalid value on a breakdown row.** It is ignored: no Error, and Confirm stays enabled. AC 4 wins, because the master data check (AC 6) runs only on the Work row (DEC-076 (3)).
3. ✅ **Error count.** N = 3. Every row whose UUID does not exist gets its own Error line, with the message "The UUID you entered is not exist in the system.": the Work row and both breakdown rows (DEC-076 (2), DEC-059 (2)).
4. ✅ **Job Owner on a frozen Worklist.** The JO cannot import, the TM can (DEC-076 (4)).
   - `Create Work` / `Import Excel` are hidden, with no message.
   - A **direct link to the Import page shows the Access Denied page** (existing access rules, `Condition Screen Access Denied, Page Not Found.xlsx`).
   - If the Import page opens by direct link and the file can be confirmed, that is a defect.
5. ✅ **Which values are master data.** Case is ignored only for master data and duplicate/unique-check values; every other value is compared exactly after trim.
   - `Work Header` and `Working Location (Deck)` in lower case: not an edit.
   - `Job Description` and `Remark`: an edit.
   - The master data list is the template sheet `Dropdown Options` (DEC-076 (1)).

Earlier the same day, Q1 and Q3 had been matched to the Story (`work/SPRINT26/ba-self-answers-2026-11-24.md`). The BA reply confirms them.

## Facts checked by QA on 2026-11-24 (read only)
- Work Status codes (FE `work-status.model.ts`, QA DB):
  - `N` New, `I` Information Required, `U` Updated, `R` Reviewed, `C` Change Requested, `RDY` Ready.
  - A deleted Work keeps its status and gets `sdw_is_delete = 'Y'`. The DB has no `D` status.
- Breakdown Status codes: `UPDATED`, `REVIEWED`, `REQUIRED`.
- A frozen Worklist has `shutdown_worklist.swl_status = 'F'`. Event, plan and Worklist come from `shutdown_map` (`sde_id`, `spl_id`, `swl_id`).

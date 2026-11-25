---
keys: [ETM-8394, ETM-8049, ETM-8521, ETM-8042, ETM-8393, ETM-8449, ETM-8034, ETM-8392, ETM-8405, ETM-8388, ETM-8391, ETM-7343]
source: "qa/questions-for-BA-all-2026-11-24.md (Sprint 26, all cards, received 2026-11-24)"
status: answered by BA 2026-11-24 (DEC-082, DEC-083, DEC-084) · ready to send; story edits pending BA approval
---

# Sprint 26 – draft answers for all cards (24 Nov 2026)

Legend: ✅ answered (earlier decision or BA 2026-11-24)
⭐ = changes an Expected Result.

All questions answered by BA on 2026-11-24 (DEC-082, DEC-083, DEC-084). Remaining follow-ups:
- ETM-8521 Q5 (pop-up after paste): keep the existing behaviour; Dev confirms what it is (BA 2026-11-24 13:29).
- ETM-8042 Q10 (Excel export range): QA asks Dev.
- ETM-8521 Q8 (Description 100): valid if the field limit is 100 (checking `Data Storage.xlsx`).
- Story edits pending BA approval: ETM-8049 AC 6.1 (+ X/Y conversion), ETM-8034 AC 1.2, ETM-8405 AC 2.2, ETM-8388 AC 3.1, ETM-8521 AC 1.3 wording, ETM-8042 AC 8.1 (S-Curve end), ETM-8042 S1.

---|---|---|---|
| ETM-8394 | 1, 2, 3, 5 | 4 | |
| ETM-8049 | | 26, 27, 28, 29, 30, 31, 32 | |
| ETM-8521 | 1, 9 | 2, 3, 4, 5, 6, 7, 8 | |
| ETM-8042 | | 9, 10, 11 | |
| ETM-8393 | | 1, 2, 3, 4 | |
| ETM-8449 | | 1, 3, 4, 5 | |
| ETM-8034 | | 1, 2, 3 | |
| ETM-8392 | 1, 2, 3 (confirm only) | | |
| Audit | | ETM-8405 AC 2.2, ETM-8388 AC 3.1, ETM-8388 S-5, S-2, ETM-8391 Q6, ETM-7343 AC 1.6 | |

---

## ETM-8394 Import Work Status / Breakdown Status

1. ✅ **Breakdown Status is one value per Work.** Yes, exactly as QA assumes. Both status columns belong to the Work row; values on breakdown rows are ignored without a message. (DEC-076 (3), ETM-8394 AC 4)
2. ⭐ ✅ **Invalid value on a breakdown row.** Ignored, no Error, Confirm stays enabled. AC 4 wins: the master-data check (AC 6) only runs on the Work row. (DEC-076 (3))
3. ⭐ ✅ **Error count.** N = 3. Every row whose UUID does not exist in the system (deleted ones excluded) gets its own Error line: the Work row and both breakdown rows. Message: "The UUID you entered is not exist in the system." (DEC-076 (2), DEC-059 (2))
4. ⭐ ✅ **Job Owner on a frozen Worklist.** Rule is decided: Job Owner cannot import into a frozen Worklist, Turnaround Manager can (DEC-076 (4)). Proposal for the open part:
   - Hidden `Create Work` / `Import Excel` is the intended behaviour; no extra message.
   - A direct link to the Import page follows the existing access rules (`Condition Screen Access Denied, Page Not Found.xlsx`): Access Denied page.
   - If QA finds the Import page opens by direct link and the file can be confirmed, that is a defect.
5. ⭐ ✅ **Which values are master data.** Case-insensitive match only for values that must match master data or a duplicate/unique check; everything else compares exactly after trim. QA's plan fits: `Work Header` and `Working Location (Deck)` dropdowns lower case = not an edit; `Job Description` and `Remark` free text = an edit. The dropdown list is the template's `Dropdown Options` sheet. (DEC-076 (1))

---

## ETM-8049 Worklist – Working Location

26. ⭐ ✅ **AC 6.1 "Edit Work".** Propose: AC 6.1 should name **Edit Work Breakdown** (row menu > View Work Details > Edit Breakdown), because Edit Work Details has no Deck / X / Y field. Deck entry points are: Create Work (row), Work Breakdown edit, Excel import, Shutdown Logic (Gantt table, modal, paste). There is no other screen. I update AC 6.1 wording once you confirm.
   **BA 2026-11-24: AC 6.1 reads "Edit Work Breakdown" only (no "Edit Work").**
27. ⭐ ✅ **Import `Helipad,helipad`.** Per DEC-046 and AC 6.2, free-text values that differ only by letter case are stored separately, so they are not duplicates. Proposal: Excel import accepts both (same as typing in the form). The "duplicate" rejection QA sees is a defect unless Dev has a reason (e.g. a duplicate check inside one cell of ETM-1106). Please confirm; I will ask Dev if you want.
   **BA 2026-11-24: Import accepts both `Helipad` and `helipad` (DEC-046).**
28. ✅ **Deck typed without Enter.** Proposal: same as every other multi-value input in the form: an uncommitted text is **discarded** on save (no message). Please confirm or tell me the current behaviour.
29. ⭐ ✅ **Y value `a` becomes `A`.** X / Y are "From list" (master data). Proposal: a value that matches the list ignoring case is **converted to the list spelling** (`a` → `A`), the same rule as other master-data fields; values not in the list are rejected. AC 6 only names Deck, so I add one line "X / Y follow the same conversion" if you agree.
   **BA 2026-11-24: `a` is converted to `A` per the master list.**
30. ✅ **Reset in Column Customization.** Proposal: the table changes only after **Apply**, as the tests assume (ETM-564 AC 6).
31. ✅ **Two users save at the same time.** Proposal: last save wins for that Work (no merge, no error); each spelling is kept as typed (DEC-046).
32. ⭐ ✅ **Several Deck values for one work.** Proposal: Create Work has one row per work, so several breakdown rows with different Deck values are entered only in **Edit Work Breakdown** (or Excel import / Shutdown Logic). TC-015 should test the single-row case in Create Work and move the multi-value case to Edit Work Breakdown.
   **BA 2026-11-24 (differs from the proposal): both Create Work and Edit Work Breakdown accept several Deck values in one cell. TC-015 must be rewritten for several values in a Create Work cell.**

---

## ETM-8521 Faster Copy & Paste in Gantt Table

1. ⭐ ✅ **Speed target (AC 1).** No target: DEC-049 (18 Nov). AC 1 is information only; the pass criterion is AC 2 (no regression). QA records times before/after as data.
2. ⭐ ✅ **Where POB and Man-hrs are checked (AC 1.3).** Proposal: check them in the **Edit modal of the Work Breakdown row** and in the **Manpower Histogram**; for roll-up check the Start / End span and the Manpower sum on the Work row. Work Header / Platform show "-" (nothing to check). I will correct the story wording of AC 1.3 ("POB / Man-hours") if you agree.
3. ⭐ ✅ **Read-only cells for paste.** QA's list matches the app: Duration, Start, End, Working Location, Manpower Resource on Work Breakdown rows (Lv4); Equipment Number, Functional Location on Work rows (Lv3); Predecessor / Successor on Lv2–Lv4. Proposal: confirm. ETM-8761 (paste into "POB") has no cell to paste into: remove it or change it to the Edit modal.
4. ⭐ ✅ **What "rejected" looks like.** ETM-2615 AC says the cell keeps its old value. The app behaves differently on `ECM Fitter[0]`, `[100]`, `[1.5]` (ETM-8759, ETM-8762) and shows an empty red cell for other invalid values. Options: (a) old value stays (follow ETM-2615; the app is a defect), (b) quantity becomes `[1]` and a repeated type is dropped, (c) cell cleared and red. My proposal is **(a)**, because ETM-8521 says "no change of behaviour", so the reference is ETM-2615. The limit of 5 resources per cell: not stated in either story; I need Dev to confirm if it exists. ✅ Add decides (a/b/c), and whether I ask Dev about the limit.
   **BA 2026-11-24: (c) cell cleared and red.**
5. ✅ **"No Working Time Available" pop-up.** **BA 2026-11-24: keep the existing behaviour. Dev confirms what the current (pre-ETM-8521) behaviour is; ETM-8521 must not change it.** The only spec is `Shutdown Logic Validation&Result.xlsx` R30 (shown after Add/Remove Resource or Edit Shift: "Changing the manpower resource or shift makes some tasks have no overlapping working time.", button OK); a paste case is not written there. QA: report what you see after OK (is the pasted value kept?) and compare with the old build; no Expected Result is written until Dev confirms.
6. ✅ **User without `Edit Shutdown Logic Table and Visualization`.** Proposal: the table is read-only, Ctrl+V does nothing and no message (same as typing). Job Owner is the right test account if the permission matrix (Role & Permission V.2.xlsx) gives it no edit right on that plan; QA should check the permission row first.
7. ✅ **Previous build for comparison.** I do not have an environment with the old paste logic. Proposal: Dev provides one (or a recorded result for the same clipboard); otherwise AC 2 is checked against the saved results of ETM-2615 test cases.
8. ✅ **Description limit 100.** Not written in ETM-8521 or ETM-2615 AC 3. Proposal: confirm 100 characters only if the Work Breakdown Description field already has max 100 (Data Source). I will check the field table (`Data Storage.xlsx`) before confirming.
9. ✅ **Large paste result identical to old behaviour.** Yes, cell by cell (AC 2), as answered in round 1.

---

## ETM-8042 Planning – Individual Ramp Down & Up Date

9. ✅ **Old Daily Report without a snapshot (S-Curve end).** DEC-048: old Daily Reports use the Event Planned Date stored at creation, or a migrated snapshot = Event Planned Date at release. Expected: the S-Curve end = **Event Planned end (15 Jul 2026)**, not the last task end. If it ends on the last task end today, ask Dev whether this was already so before ETM-8042 (ETM-4127 AC 3). Please confirm the expected end.
   **BA 2026-11-24: the Planned S-Curve ends on the last execution day = snapshot Ramp Up Date + extended days (ETM-8042 AC 8.1, ETM-4125 AC 8, ETM-4127 AC 3), NOT the last task end and not the Event Planned end. Old Daily Report: snapshot = Event Planned end (DEC-048). Ending on 12 Apr 2027 (last task end) is a defect.**
10. ✅ **Excel export on a 3-year range.** The stories have no maximum timeframe (ETM-5492 AC 6 says no upper limit). Options: (a) Excel works for any range (disabled button = defect), (b) there is a maximum (Dev gives the number) and the user sees a reason. I propose **(a)** and ask Dev why it is disabled.
   **BA 2026-11-24: QA asks Dev (why Excel is disabled for a 3-year range).**
11. ✅ **Invalid pasted date.** DEC-052 / S1 says invalid → keep the previous value. QA sees the picker clear that part and disable Save. Options: (a) keep the previous value (app = defect), (b) clear and disable Save (S1 updated). **Please decide**; this is the only item where QA already changed a test on its own.
   **BA 2026-11-24: clear that part and disable Save (the app is correct; S1 / DEC-052 updated).**

---

## ETM-8393 Capacity and Consumption Tooltip on Manpower Histogram

1. ✅ **AC 2 label.** Done 2026-11-24: Title, I want to and AC 2 now say **Used Resource** (Jira updated 11:37). Figma, build and your chat answer say **Used Resource**. Proposal: update ETM-8393 AC 2 and the story title to "Used Resource" (the title currently says "Consumption"). I do this once you confirm.
2. ✅ **Capacity change inside one same-height section.** Confirmed (BA 2026-11-24, DEC-083): the card shows the Capacity of the point under the pointer, as the build does. ETM-8826 stays as it is.
3. ✅ **Changing and rolling back manpower for a test.** Confirmed (BA 2026-11-24, DEC-083): the histogram updates when the change is confirmed in the modal; leaving without `Save` does not save the change.
4. ✅ **Card near the chart edge.** Confirmed (BA 2026-11-24, DEC-083): the card stays inside the histogram (stops at the right edge, stays at the top). No story change.

---

## ETM-8449 Faster Collapse/Expand of Row Hierarchy

1. ⭐ ✅ **Speed target (AC 1.1, AC 1.2).** Proposal: **(c) no time target**, only "no freeze, correct result", the same as ETM-8521 (DEC-049). QA still records the time as information. If you want a number, tell me which.
   **BA 2026-11-24: no speed target (DEC-049). ETM-8449 is performance only; all behaviour must stay exactly as before.**
3. ✅ **Lighter `Work Header` box.** Proposal: it is only styling (the box is always enabled) unless Figma says otherwise; I will check the Figma frame. `Platform` box is never disabled.
   **BA 2026-11-24: everything works as before the change; only performance changes (no new design for the box).**
4. ✅ **Dependency lines after collapse.** Proposal: **(b)** draw the line to the collapsed Work Header row, as the Gantt does for other collapsed parents. Needs a check of ETM-8449 AC 2 and current behaviour; please confirm.
   **BA 2026-11-24: dependency lines behave as before the change.**
5. ✅ **Job Owner check (ETM-8631).** Proposal: yes, QA sets the 20,000-Work plan to Active for this test (Job Owner sees Active plans only); set it back to Inactive afterwards.
   **BA 2026-11-24: confirmed as proposed.**

---

## ETM-8034 Row Highlight and Text Color

1. ✅ **AC 1.2 colours.** The story says "No Color, followed by 13 colors" (DEC-028). Figma and the palette table give No Color + 12 colours (13 cells). Proposal: correct AC 1.2 to "No Color (⊘) followed by 12 colors (13 options in total)" and keep DEC-028 as is for the palette Figma links. ETM-8856 tests stay.
   **BA 2026-11-24: confirmed as proposed.**
2. ✅ **Undo after Edit Work.** Proposal: yes, the change from the Work Setting modal is in the Undo history in order with colour changes (ETM-2703). If the build does not, report it as a defect.
3. ✅ **Copy & Paste AC 8.2.** DEC-055: Copy & Paste (ETM-2615) copies **text only, no colour**; Duplicate (ETM-2696) copies Highlight and Text Color. The double-click No. cell + Ctrl+C / Ctrl+V is the ETM-2615 mechanism, so it is the one AC 8.2 means. No other menu copy action.

---

## ETM-8392 Daily Report Ramp lines (confirm only)

All three were answered on 20 Nov (qa/_archive/2026-11-20_ETM-8392_qa-questions-round2.md).

1. ⭐ ✅ **Export PDF timeframe.** Set by the Export Daily Report drawer: `Only Current Date` = Full Shutdown Timeframe (locked); `Daily Plan` = Full Shutdown Timeframe (default) or Focus Timeframe. A date exactly on the edge counts as inside (DEC-061).
2. ✅ **Frozen day.** Read-only Actual (%) cells, `Unfreeze` instead of `Freeze`, `>` and `Export` enabled; there is no extra label or icon.
3. ✅ **Several Extensions.** Yes, more than once; an Extension never moves the Ramp lines, so there is still one `Ramp Up` line at the snapshot date (DEC-062).

---

## Audit items

- **ETM-8405 AC 2.2 (Group summary).** ✅ I cannot find D-1 (18 Nov) in my files; QA says the team decided the Group row shows no summary (ETM-8640). AC 2.2 still says "The Activity Group summary ... must update accordingly" and AC 2.3 says the Group row shows no error. Proposal: change AC 2.2 to "`Total Progress` → `Plan (%)` must update accordingly" and remove the Group summary. Please confirm D-1.
- **ETM-8388 AC 3.1 (date formats).** ✅ Proposal: add "or any format accepted by [ETM-7902](https://pttep.atlassian.net/browse/ETM-7902) (day-first), shown as `DD Mmm YYYY`" to AC 3.1, as in the round-2 answer (`03 Jun 2026`).
- **ETM-8388 S-5 (paste into weekly cells).** ✅ Proposal: same as the weekly Plan (%) rules: valid numbers accepted (more than 1 decimal truncated, DEC-008), above 100.0 set to 100.0 (DEC-036/042), negative / non-numeric cleared with `Paste Validation Failed` (DEC-043); weekly Actual past the Current Week truncated (DEC-011). Please confirm that weekly Actual follows the same.
- **ETM-8388 S-2 (line break in a clipboard cell).** ✅ **BA 2026-11-24: replace the line break by a space.** No rule exists. Options: (a) take the cell text before the line break, (b) replace the line break by a space, (c) treat as invalid and clear with the modal. Proposal **(b)** for text fields; please decide.
- **ETM-8391 Q6 (nothing ticked in Remark filter).** ✅ The filter follows the other checkbox columns (ETM-434 AC 5, BR-WL-007): with nothing ticked the result is **no works** (Select All unticked = empty list), the same as Job Description. QA scripts that expect "all works" need updating. Please confirm.
- **ETM-7343 AC 1.6 (empty Actual).** ✅ If the database column is NOT NULL, an empty Actual cannot exist. Proposal: AC 1.6 stays for display of `-` (no data row yet) and is "not applicable" as a test of an empty saved value; QA marks ETM-8724 as N/A.

---

---

## Corrections from BA (2026-11-24, after 13:30) and story updates (Jira 14:23)

1. **ETM-8521 Q4 (replaces the earlier answer "(c)")**: keep the current behaviour. A mandatory field with an invalid pasted value (e.g. Duration) is cleared and red, and Export / Optimize / Save are disabled until fixed. Manpower Resource `[0]`, `[100]`, `[1.5]` becomes `[1]`. ETM-8759 and ETM-8762 are not defects.
2. **ETM-8049 Q29**: X and Y can only be selected, not typed, so there is no `a` → `A` case. Drop that part of TC-013 / TC-014.

Stories updated in Jira at 14:23 (re-read): ETM-8049 AC 6.1, ETM-8034 AC 1.2, ETM-8405 AC 2.2 / 2.4, ETM-8388 AC 3.1 / 1.5, ETM-8521 AC 1.3 / 2.1, ETM-8042 Daily Report and AC 1.2.

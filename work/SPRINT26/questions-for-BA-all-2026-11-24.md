# Sprint 26 – Open questions for BA, all cards (24 Nov 2026)

One list of every question still waiting for BA, collected from each card's `work/ETM-<n>/questions-for-BA*.md` and `findings.json` (outcome `open`) on 24 Nov 2026.
⭐ = changes an Expected Result, please answer first. "QA assumes" = what the tests use until you answer.
Please answer per card and number (for example "8394-Q2: ignored"). Cards with no open question: ETM-7343, ETM-8003, ETM-8388, ETM-8391 (but see the last section).

**Update 24 Nov (later):** these were answered from existing Stories / earlier BA answers and are closed in the card files. Do not send them: 8394 Q1, Q3 · 8049 Q27, Q29 · 8521 Q1, Q3, Q8, Q9 · 8042 Q10 · 8392 all · 8405 R3-1, R3-2 · 8449 Q4 · 8034 Q1, Q2 · 8393 Q1 (BA only edits AC 2 text) · 8388 Q1, Q2 (BA only edits AC 3.1 text). Source per item: `ba-self-answers-2026-11-24.md`. New: 8405 round 4 (AC 2.2 vs D-1), 8394 Work Number duplicate check — see the card files.

| Card | Open | ⭐ |
|---|---|---|
| ETM-8394 Import Work / Breakdown Status | 5 | 4 |
| ETM-8049 Working Location | 7 | 4 |
| ETM-8521 Faster Copy & Paste | 9 | 4 |
| ETM-8042 Ramp Down/Up per Plan | 3 | 0 |
| ETM-8393 Histogram tooltip | 4 | 0 |
| ETM-8449 Faster Collapse/Expand | 4 | 1 |
| ETM-8034 Row Highlight / Text Color | 3 | 0 |
| ETM-8392 Daily Report Ramp lines | 3 | 1 |
| ETM-8405 Editable Weekly Plan % | 2 | 1 |
| Not yet in the card files (audit) | 6 | – |

---

## ETM-8394 Import Work and Work Breakdown – Import Work Status and Breakdown Status (Deployed to QA)
After the AC update of 23 Nov. QA is rewriting the tests for AC 1.3, AC 3.3.1-3.3.3, AC 3.4 and AC 4.

(Q1 and Q3 closed 24 Nov from ETM-8394 AC 4 / AC 3.4 and ETM-6843 AC 7.1. Do not send. The card's round-3 file adds a Work Number duplicate-check question.)

1. **Breakdown Status is one value per Work (please confirm).** The new AC 4 says both status columns belong to the Work row. The database keeps one Breakdown Status per Work (`sdw_breakdown_status`), the template `Examples` sheet fills both statuses on the Work row only, and the app has one Breakdown Status per Work. Example: Work `W-1` has three breakdowns; the Work row has `Breakdown Required`; `W-1` shows `Breakdown Required` and values typed on the breakdown rows are ignored. **QA assumes:** yes, exactly this.
2. ⭐ **AC 4 vs AC 6: invalid value on a breakdown row.** A Turnaround Manager types `Approved` in Work Status and `Deleted` in Breakdown Status on a Work Breakdown row (Work row has no status). Ignored with no message (AC 4), or master-data Error (AC 6)? **QA assumes:** ignored, no Error, Confirm enabled.
3. ⭐ **AC 3.4: error count.** File has `Action = Revise` for a deleted Work and its two breakdown rows (3 rows). Banner: "N data validation errors were found in the file." **QA assumes:** N = 3, the table lists the three rows, each with "The UUID you entered is not exist in the system."
4. ⭐ **AC 1.3: Job Owner on a frozen Worklist.** In the front-end code a Job Owner on a frozen Worklist has no create/import rights, so `Create Work` (the only way to `Import Excel`) is hidden. **QA assumes:** hidden on a frozen Worklist, shown on one that is not frozen. Is there also a message, or is a direct link to the Import page blocked another way?
5. ⭐ **AC 3.3.2: which values are master data.** QA plans: `Work Header` (dropdown) lower case on the Work row = not an edit; `Working Location (Deck)` (dropdown) lower case on a breakdown row = not an edit; `Job Description` (free text) case change = an edit. **QA assumes:** every dropdown column in the template is master data; `Job Description` and `Remark` are free text.

## ETM-8049 Worklist – Working Location (In Testing)

26. ⭐ AC 6.1 says "Edit Work", but the Edit Work Details form has no Working Location (Deck / X / Y) field. Should AC 6.1 read "Edit Work Breakdown" (row menu > View Work Details > Edit Breakdown)? Is there another screen where Deck can be changed?
27. **Closed 24 Nov from ETM-1106 AC 4.5 / ETM-1230 AC 3.1. Do not send.** ⭐ Import Excel rejects `Helipad,helipad` as "duplicates", but AC 6.2 says values that differ only by letter case are stored separately. Which is correct for Excel import?
28. Create Work: the user types a Deck value and clicks away without Enter. Is the text added, discarded, or is a message shown?
29. **Closed 24 Nov from ETM-6843 AC 7.5 / ETM-1106 AC 7. Do not send.** ⭐ Y value `a` becomes `A` (TC-013 Excel import, TC-014 Shutdown Logic): AC 6 covers Deck only and X / Y are "From list". Should `a` be converted to `A`, rejected, or is it impossible to enter?
30. Reset in Column Customization (TC-002): does the table change at once on Reset, or only after Apply? Tests use "after Apply" (your proposal for Q3); please confirm.
31. Two users save the same work with different Deck spellings at the same time (TC-004 steps 6-10): last save wins, both kept, or an error?
32. ⭐ Create Work (TC-015) has one row per work, so several Work Breakdown rows of one work cannot be entered there. Where can a user enter several Deck values for one work in one session (Edit Work Breakdown only)? TC-015 will be rewritten after your answer.

## ETM-8521 Shutdown Logic – Faster Copy & Paste in Gantt Table (Deployed to QA)

1. ⭐ **Speed target for AC 1.** DEC-049 (18 Nov) says no time target, so nothing can fail on "faster". Choose: (a) a target, e.g. "a paste of N rows x M columns on plan X finishes within Y seconds", or (b) AC 1 is information only and the Story rests on AC 2 (no regression).
2. ⭐ **Where POB and Man-hrs are checked (AC 1.3).** The table has no POB, Man-hrs or Work Conflicted column; POB / Man-hrs are only in the Edit modal of a Work Breakdown row; the Work row shows the Manpower sum; Work Header and Platform show "-". Check them in the Edit modal, in the Manpower Histogram, or is the roll-up only the Start / End span and the Work row's Manpower sum?
3. ⭐ **Read-only cells for paste.** QA sees Duration, Start, End, Working Location, Manpower Resource editable only on Work Breakdown rows (Lv4), Equipment Number and Functional Location only on Work rows (Lv3), Predecessor / Successor on Lv2-Lv4. Please confirm. ETM-8761 pastes into a "POB" cell that does not exist.
4. ⭐ **What "rejected" looks like.** Tests expect a rejected cell to keep its old value (ETM-2615). On 20 Nov `ECM Fitter[0]`, `[100]` and `[1.5]` did not keep the old value (ETM-8759, ETM-8762); other invalid values show an empty red cell. Intended: (a) old value stays, (b) quantity becomes `[1]` and a repeated type is dropped, or (c) cell cleared and red? Is the limit of 5 resources per cell still a rule?
5. **"No Working Time Available" pop-up** after some Manpower Resource pastes. Expected after a paste? Should the pasted value stay after OK?
6. **User without `Edit Shutdown Logic Table and Visualization`** (ETM-8764): on Ctrl+V nothing happens, or a message? Is Job Owner the right account on QA?
7. **Previous build for comparison** (ETM-8738): AC 2 compares with the behaviour before ETM-8533; QA has only the new build. Is there an environment with the old paste logic, or compare with saved results?
8. **Description limit.** ETM-8751 expects a pasted Description cut to 100 characters. Please confirm 100 (not in this Story or ETM-2615 AC 3).
9. (round 1, Q5) Is the result of a large paste expected to be identical, cell by cell, to what the old behaviour produced for the same clipboard (AC 2)?

## ETM-8042 Planning – Individual Ramp Down & Up Date (In Development)

9. (AC 8.2, ETM-4127 AC 3) Old Daily Report without a snapshot (QA: Export 5000 / "Optimize Pass", event Planned Date 17 Jun 2026 10:00 – 15 Jul 2026 06:00): the Planned S-Curve on screen and in the PDF ends around 12 Apr 2027 (last task end), not on the event Planned end. Should it end on 15 Jul 2026 or on the last task end? Was this already the behaviour before ETM-8042?
10. **Closed 24 Nov from ETM-5492 + ETM-3461 AC 1.2 (no maximum; possible defect). Do not send.** (AC 8.1, ETM-5492, AC 6 "no upper limit") On a Plan with a 3-year Ramp Down/Up range (15 Feb 2026 – 15 Feb 2029) the Shutdown Logic Export dialog has `Excel File` disabled; on a 10-day Plan it is enabled. Is there a maximum timeframe for Excel export (what is it, should the user see a reason), or should Excel work for any range?
11. (AC 3, ETM-8851, your answer S1 of 18 Nov) You said an invalid pasted date (`31 Feb 2026 08:00`, `2026-02-08 08:00`) keeps the previous value. On QA the picker clears that part and disables Save. QA changed ETM-8851 to follow the app on 20 Nov, but that was QA's decision. Which is correct: (a) keep the previous value (current app = defect), or (b) clear and disable Save (S1 updated)?

## ETM-8393 Shutdown Logic – Capacity and Consumption Tooltip on Manpower Histogram (Deployed to QA)

1. **AC 2 label.** AC 2 says "Consumption"; your chat answer, Figma and the build say "Used Resource", and all Tests expect "Used Resource". Please update AC 2 (and the Story title), or tell us "Consumption" is right.
2. **Capacity change inside one same-height section (AC 3, ETM-8826).** You confirmed it stays ONE section when Capacity changes but Used Resource keeps its height. The build shows the Capacity of the point under the pointer (e.g. 3 before the shift ends, 0 after). ETM-8826 expects exactly this; please confirm. If the section must show one Capacity, which (first point, highest, ...)?
3. **Changing and rolling back manpower for a test (ETM-8820 steps 4-9).** In Breakdown Setting > Manpower Resource: does the histogram update at once or only after Save? How do we leave without saving or undo, so the QA plan stays as it was?
4. **Card near the chart edge.** The build keeps the card inside the histogram (stops at the right edge, stays at the top). QA thinks this is fine; tell us only if not.

## ETM-8449 Shutdown Logic – Faster Collapse/Expand of Row Hierarchy (Deployed to QA)
(Q2 `+ Work Header` was answered today: Platform, Work Header and Work rows.)

1. ⭐ **Speed target (AC 1.1, AC 1.2).** ETM-8629 s6 and ETM-8630 s8 use: ready in ≤ 15 s = Pass, 15-20 s = Pass with a note, > 20 s = Fail (plan "New Plan 20,000 Work"). This limit is QA's; there is no old build to compare. ETM-8521 got "no time target" (DEC-049). Which applies: (a) 15 s / 20 s, (b) another number, (c) no target, only "no freeze, correct result"?
3. **Lighter `Work Header` box** in the Custom View panel (design): disabled, partly expanded, or only styling? Can the `Platform` box ever be disabled?
4. **Dependency lines after collapse (AC 2).** When a Work Header is collapsed and one end of a line is hidden: (a) hide the line, or (b) draw it to the collapsed Work Header row?
5. **Job Owner check (ETM-8631).** A Job Owner sees Active plans only. Can the 20,000 Work plan be set Active in QA for this test, or should the Job Owner half use another Active plan?

## ETM-8034 Shutdown Logic – Row Highlight and Text Color in Gantt Table (In Development)

1. AC 1.2 says "No Color (⊘), followed by 13 colors". Your earlier answer, Figma and the palette table give No Color + 12 (13 cells). Please correct AC 1.2, or give the 13th colour and its hex. (ETM-8856 s2/4/6/8 test No Color + 12.)
2. Undo history: after saving a change in the Work Setting modal (Edit Work), does Undo revert that change, in order with the colour changes? (ETM-8865 step 24 expects yes; if no, the step is removed.)
3. AC 8.2 Copy & Paste: the build copies a row by double-clicking its No. cell + Ctrl+C and pastes with a double-click on the target No. cell + Ctrl+V. Is this the Copy & Paste AC 8.2 means (cell values only, no colour), or is there another copy action, e.g. a menu item? (ETM-8861 steps 1-4.)

## ETM-8392 Daily Report – Ramp Down and Ramp Up Vertical Lines on Gantt Chart (Deployed to QA)
**Closed 24 Nov: already answered by BA on 20 Nov (round 2); findings F-9..F-11 updated. Do not send.**

1. ⭐ **Export PDF (AC 4):** which control sets the exported timeframe, and what is the default when the user does not change it? (A date exactly on the edge is assumed inside.)
2. How does a user see that an execution day is frozen on the Daily Report page (icon, label, disabled state)?
3. Can the last execution day be extended more than once (AC 3)? If yes, after the second Extension is there still only one `Ramp Up` line, at the newest date?

## ETM-8405 Shutdown Timeline – Editable Weekly Plan (%) in Edit Plan (Ready for UAT)

1. ⭐ **Blank weekly Plan with Actual above 0.0 (Main Timeline bars).** Plan (%) blank (counted 0.0), Actual 5.0 the same week. What do the cumulative Red/Green Actual bars show? ETM-7349 AC 3 covers only blank Actual with no Plan. Options: A) compare against cumulative Plan (blank adds 0.0), so a bar is shown; B) no bar. Does it change when earlier weeks have Plan values? (QA is asking the user whether ETM-7346 AC 4.1 already answers this.)
2. **Body text of the `Change Shutdown Size?` modal.** The validation file still has the old text ("...change the shutdown type?..."). Please send the final body text and update row 16 of the Excel `Confirmation&Result` sheet (title still `Change Shutdown Type?`).

---

## Not yet in the card files (raised by the Sprint 26 audit; the card sessions will add them)

- **ETM-8405 AC 2.2:** says the Activity Group summary "must update accordingly", but the team decided (D-1, 18 Nov) the Group row shows no summary (ETM-8640). Please update the AC text to match, or tell us the AC is right.
- ETM-8388 (now written in `work/ETM-8388/questions-for-BA-round3.md`, findings F-20..F-25; that file is the full text):
- **ETM-8388 AC 3.1:** still lists only "D Mon YYYY / DD Mon YYYY"; the tests follow ETM-7902 (16 day-first formats) and your round-2 answer. Please update AC 3.1 or add a comment.
- **ETM-8388 S-5:** pasting into weekly cells (ETM-8716 s18, ETM-8723 s16): expected result?
- **ETM-8388 S-2:** clipboard cell with a line break (ETM-8719): expected result?
- **ETM-8391 Q6:** when nothing is ticked in the Remark filter, is the result all works, or the same as the Job Description filter? Tests and scripts disagree.
- **ETM-7343 AC 1.6 (ETM-8724):** an empty Actual value cannot exist (database columns are NOT NULL). Is AC 1.6 not applicable, or is there a case where it is empty?


---

## Answered by BA 2026-11-24 (DEC-082..084)

All questions in this file were answered. Answers: `work/SPRINT26/ba-answers-all-2026-11-24.md`. Still open: 8521 Q5 (Dev confirms old behaviour), 8521 Q8 (Data Storage.xlsx), 8042 Q10 (QA asks Dev), story edits pending BA approval.

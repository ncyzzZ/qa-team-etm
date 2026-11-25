# Defect draft: Create Work Deck cell refuses a second free-text value that differs only by letter case (ETM-8049, TC-015)

**Summary:** [ETM-8049] Create Work: one Working Location (Deck) cell cannot hold two free-text values that differ only by letter case ("DOCK AREA" is not added after "Dock Area")

**Opening:**
On Create Work > Manual Create, the Deck cell of a work row already holds the free-text tag `Dock Area`. When the user types `DOCK AREA` and presses Enter, no new tag is added. The suggestion list shows the existing `Dock Area` as already selected (a tick). So one cell can never hold `Dock Area` and `DOCK AREA` together. The BA confirmed on 25 Nov 2026 (Q34, answer "a") that one cell may hold both values. Free text is saved exactly as typed (AC 6.2), and Create Work accepts several Deck values in one cell (Q32). Import Excel has the same rule problem; it is logged as ETM-9223.

**Environment:** QA (https://stms-qa.apps.pttep.com), 24 Nov 2026, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch". Found by Playwright run 2026-11-24_213619 (ETM-8788).

### Step to Reproduce
1. Open the Worklist of Plan "QA ETM-8049 Scratch" and click `Create Work` > `Manual Create`.
2. In the Deck cell of the work row, type `Main Deck` and press Enter.
3. Type `Cellar deck` and press Enter.
4. Type `Dock Area` and press Enter.
5. Type `DOCK AREA` and press Enter.

### Actual Result
- After step 4 the cell shows three tags: `Main Deck`, `Cellar Deck`, `Dock Area`.
- In step 5, the suggestion list shows `Dock Area` with a tick, as if it were already chosen. Pressing Enter adds nothing. The cell still shows three tags and `DOCK AREA` is lost.
- The same happens the other way round (`DOCK AREA` first, then `Dock Area` or `dock area`).

Pictures:
- work/ETM-8049/TC015-case-variant-not-added-2026-11-24.jpg
- work/ETM-8049/TC015-run-213619-test-failed.png

### Expected Result
- Step 5 adds a fourth tag `DOCK AREA`, exactly as typed. It is not merged with `Dock Area` and not changed to `Dock Area`.
- After Save, the Deck cell of the new work shows `Main Deck, Cellar Deck, Dock Area, DOCK AREA`.
- Rule: BA answer to Q34 (25 Nov 2026): one cell may hold `Dock Area` and `DOCK AREA` together. AC 6.2 says free text is saved exactly as entered. BA Q32 says Create Work and Edit Work Breakdown accept several Deck values in one cell.
- Xray ETM-8788 (TC-015), step 8, expects "A fourth tag shows DOCK AREA exactly as typed".

**Fields:**
- Type: Defect, environment QA.
- Sprint: Scrum Sprint 26 (17237). Epic: ETM-2.
- Labels: FE, UI.
- Relates to ETM-8049.
- Assignee: Peeranat Nivesvieat, from the [FE] sub-task ETM-8583 "Update UI table worklist".

**Xray:** Test Execution ETM-8822, Test ETM-8788, step 8. Set the step FAILED and link the defect.

**[QA] sub-task:** worklog 20m. Reason: script run plus a check by hand in Chrome, and a BA question with the answer.

# LOGGED as ETM-10079 (25 Nov 2026). Split out of ETM-9223: ETM-9223 is the Import Excel part (retest passed), this is the Create Work part (ETM-8788 still fails after the ETM-9223 fix).

**Summary:** [ETM-8049] Create Work: one Working Location (Deck) cell cannot hold two free-text values that differ only by letter case ("DOCK AREA" is not added after "Dock Area")

**Opening:**
On Create Work > Manual Create, the Deck cell of a work row already holds the free-text tag `Dock Area`. When the user types `DOCK AREA` and presses Enter, no new tag is added. The suggestion list shows the existing `Dock Area` as already selected (a tick). After Save the work keeps only `Dock Area`; `DOCK AREA` is lost with no message. The BA confirmed on 25 Nov 2026 (Q34, answer "a") that one cell may hold both values. Free text is saved exactly as typed (AC 6.2), and Create Work accepts several Deck values in one cell (Q32). The same rule on Import Excel was ETM-9223; that part is fixed (retest passed 25 Nov 2026), this screen is not.

**Environment:** QA (https://stms-qa.apps.pttep.com), 25 Nov 2026, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch". Playwright runs 2026-11-25_153747 (pictures below) and 2026-11-25_164740 (after the ETM-9223 fix was deployed, same result), Xray ETM-8788.

### Step to Reproduce
1. Open the Worklist of Plan "QA ETM-8049 Scratch" and click `Create Work` > `Manual Create`.
2. In the Deck cell of the work row, type `main deck` and press Enter (it becomes `Main Deck`).
3. Type `Cellar deck` and press Enter (it becomes `Cellar Deck`).
4. Type `Dock Area` and press Enter.
5. Type `DOCK AREA` and press Enter.
6. Fill in the other required fields and click `Save`. Read the Deck cell of the new work in the Worklist.

### Actual Result
- After step 4 the cell shows three tags: `Main Deck`, `Cellar Deck`, `Dock Area`.
- In step 5 the suggestion list shows only `Dock Area`, with a tick, as if it were already chosen. Pressing Enter adds nothing: the cell still shows three tags.
- After Save the Deck cell of the new work is `Main Deck, Cellar Deck, Dock Area`. `DOCK AREA` is lost, with no message.

Pictures (run 2026-11-25_153747, full viewport):
- work/ETM-8049/TC015-run-153747-step7.png (after step 4: three tags)
- work/ETM-8049/TC015-run-153747-step8a.png (step 5: DOCK AREA typed, the list ticks Dock Area)
- work/ETM-8049/TC015-run-153747-step8b.png (step 5 after Enter: still three tags)
- work/ETM-8049/TC015-run-153747-step11.png (step 6: the saved Worklist row, Deck without DOCK AREA)

### Expected Result
- Step 5 adds a fourth tag `DOCK AREA`, exactly as typed. It is not merged with `Dock Area` and not changed to `Dock Area`.
- After Save the Deck cell of the new work shows `Main Deck, Cellar Deck, Dock Area, DOCK AREA`.
- Rule: BA answer to Q34 (25 Nov 2026): one cell may hold `Dock Area` and `DOCK AREA` together. AC 6.2: "A value that does not match Master Data is saved exactly as entered ... Values that differ only by letter case are stored and shown as separate values." BA Q32: Create Work and Edit Work Breakdown accept several Deck values in one cell.
- Xray ETM-8788 (TC-015), step 8, expects "A fourth tag shows DOCK AREA exactly as typed".
- Note: Edit Work Breakdown uses the same Deck cell; it was not checked for this case.

**Fields:**
- Type: Defect, environment QA.
- Sprint: Scrum Sprint 26 (17237). Epic: ETM-2.
- Labels: FE, UI.
- Relates to ETM-8049 and ETM-9223.
- Assignee: thanawich klongsard (same developer as ETM-9223; lead instruction 25 Nov 2026).

**Xray:** Test Execution ETM-8822, Test ETM-8788, step 8. Set the step FAILED and link the defect.

**[QA] sub-task:** worklog 20m. Reason: several script runs, a BA question with the answer, and splitting it out of ETM-9223.

**Also on ETM-9223 (after this is logged):** a short comment that the Create Work part asked for in comment 600593 now lives in this new defect.

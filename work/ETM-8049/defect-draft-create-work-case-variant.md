# Defect draft: Create Work Deck cell refuses a second free-text value that differs only by letter case (ETM-8049, TC-015)

**Summary:** [ETM-8049] Create Work: one Working Location (Deck) cell cannot hold two free-text values that differ only by letter case ("DOCK AREA" is not added after "Dock Area")

**Opening:**
On Create Work > Manual Create, the Deck cell of a work row already holds the free-text tag `Dock Area`. When the user types `DOCK AREA` and presses Enter, no new tag is added. The suggestion list shows the existing `Dock Area` as already selected (a tick). So one cell can never hold `Dock Area` and `DOCK AREA` together. The BA confirmed on 25 Nov 2026 (Q34, answer "a") that one cell may hold both values. Free text is saved exactly as typed (AC 6.2), and Create Work accepts several Deck values in one cell (Q32). Import Excel has the same rule problem; it is logged as ETM-9223.

**Environment:** QA (https://stms-qa.apps.pttep.com), 24 Nov 2026, user Turnaround Manager. Event NN TEST QA, Plan "QA ETM-8049 Scratch". Found by Playwright run 2026-11-24_213619 and seen again in run 2026-11-25_150630 (ETM-8788).

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

Pictures (run 2026-11-25_150630, full viewport):
- work/ETM-8049/TC015-run-150630-step7.png (after step 4: three tags Main Deck, Cellar Deck, Dock Area)
- work/ETM-8049/TC015-run-150630-step8a-before-typing.jpg (the same cell just before DOCK AREA is typed)
- work/ETM-8049/TC015-run-150630-step8c-after-enter.jpg (after DOCK AREA + Enter: still three tags)

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
- Assignee: thanawich klongsard ("jif"; lead instruction 25 Nov 2026, same as ETM-9223).

**Xray:** Test Execution ETM-8822, Test ETM-8788, step 8. Set the step FAILED and link the defect.

**[QA] sub-task:** worklog 20m. Reason: script run plus a check by hand in Chrome, and a BA question with the answer.

---
**Note for the session re-running 8788 (25 Nov 2026):** the blind evidence check of run `2026-11-25_150630` pictures says **not-proven**: the Deck cell is too narrow, only `Main Deck` and `Cellar Deck` are visible, `Dock Area` is not seen in any picture, and there is no picture after Save. The script itself read 3 tags and no `DOCK AREA` (BA Q34 expects 4).
Before asking to log: widen the Deck cell (or hover / open the cell so every tag shows), or read the saved value after Save (worklist Deck cell or Edit Work Breakdown), take full-screen pictures, then run the blind check again (`node tools/evidence-check.mjs brief ETM-8049 --defect work/ETM-8049/defect-draft-create-work-case-variant.md`, evidence-checker agent, `compare`).
Check result: `work/ETM-8049/evidence-check/defect-draft-create-work-case-variant.compare.json`

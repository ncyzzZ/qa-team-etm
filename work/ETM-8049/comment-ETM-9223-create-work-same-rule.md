# Draft comment for ETM-9223 (not posted yet)

**Same behaviour on the Create Work screen (found by ETM-8788 / TC-015, QA, 25 Nov 2026)**

The rule behind this defect also breaks Manual Create. Values that differ only by letter case must be accepted (BA Q27, and Q34 answer "a" on 25 Nov 2026).

Steps (Plan "QA ETM-8049 Scratch", user Turnaround Manager):
1. Worklist > `Create Work` > `Manual Create`.
2. In the Deck cell of the work row, type `main deck` and press Enter. Then type `Cellar deck` and press Enter. Then type `Dock Area` and press Enter. The cell shows three tags.
3. Type `DOCK AREA`. The suggestion list shows only `Dock Area`, already ticked. Press Enter: no fourth tag is added.
4. Fill in the other fields and Save.

Actual: the saved work's Deck cell is `Main Deck, Cellar Deck, Dock Area`. `DOCK AREA` is lost, with no message.
Expected: `Main Deck, Cellar Deck, Dock Area, DOCK AREA`. Free text is kept exactly as typed (AC 6.2), and one cell may hold both case variants (BA Q34).

Evidence: Playwright run 2026-11-25_153747 (ETM-8788, steps 8 and 11), Test Execution ETM-8822.
Pictures to embed:
- work/ETM-8049/TC015-run-153747-step8a.png (DOCK AREA typed, list ticks Dock Area)
- work/ETM-8049/TC015-run-153747-step11.png (saved Worklist row; the cell is cut, the full value read from the page is above)

Please fix both places (Import Excel and the Create Work / Edit Work Breakdown Deck cell) under this defect.

Xray: after posting, link ETM-9223 to ETM-8788 step 8 in ETM-8822 and set that step FAILED.

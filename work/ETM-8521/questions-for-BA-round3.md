# ETM-8521 – Questions for BA (round 3, 24 Nov 2026)

Story: ETM-8521 Shutdown Logic – faster copy & paste in the Gantt table. QA build of 24 Nov 2026, Turnaround Manager account.

## R3-1 Copy of two cells that are not next to each other (Test ETM-8737, step 6–7)

**What QA did**
1. Selected the Description cell of row 1, then Ctrl+click on the Duration cell of row 2 (the cells are not next to each other; both show as selected).
2. Pressed Ctrl+C.
3. Clicked the Description cell of another row and pressed Ctrl+V.

**What the app did**
- The clipboard after Ctrl+C holds the two values in **one column**: `Pump overhaul A` (line 1) and `12` (line 2).
- After Ctrl+V the target row 1 Description = `Pump overhaul A` (OK), but `12` goes to the **Description of target row 2**. The Duration of target row 2 is not changed.

**What the Test expects**: the layout is kept. Target row 1 Description = `Pump overhaul A`, target row 2 Duration = `12`, and the two skipped cells (row 1 Duration, row 2 Description) stay blank.

**Question**: Which is correct?
- (a) The layout must be kept (Test is right, the current behaviour is a defect), or
- (b) Copying cells that are not next to each other packs them into one column (current behaviour is right; QA will change step 7 of ETM-8737), or
- (c) Copying cells that are not next to each other is not supported (QA will remove step 6–7).

## R3-2 Finish-to-Start after pasting a new Start date (Test ETM-8743, step 6)

**What QA did**: Task B depends on task A (Finish to Start, no lag), same Work. Pasted a new Start date (A's Start + 1 day) into the Start cell of A.

**What the app did**
- Before (step 5, after pasting Duration): A ends `02 Jun 2026, 20:15`, B starts `02 Jun 2026, 20:15` (same time, as expected).
- After (step 6): A ends `03 Jun 2026, 19:45`, B starts `03 Jun 2026, 20:00`.
- B's working calendar has working time between 19:45 and 20:00 (the gap is 15 working minutes), so B could start at 19:45.

**Question**: Should B start exactly when A ends (19:45)?
- (a) Yes: B must start at the first working time at or after A's end (the 15-minute gap is a defect), or
- (b) No: the 15-minute gap is expected (please tell us the rule, e.g. a rounding to the hour, a constraint kept on B, or a shift start), and QA will change the Expected Result of step 6.

## R3-3 A large paste also writes into Work Header and Work rows (Test ETM-8738, step 7)

**What QA did**: Pasted 50 rows x 2 columns (Description, Duration) at the first Lv4 row of a large Shutdown Logic. Draft only, not saved.

**What the app did**: The 25 Lv4 rows in the range took `Large paste n` / `4`. The 25 Work Header and Work rows between them also took the pasted **Description**. Their Duration stayed computed, which is correct: Duration is read-only on parent rows (R2-3).

**Question**: When a pasted block covers Work Header or Work rows, should their Description change?
- (a) Yes, Description is editable on those rows (current behaviour is correct), or
- (b) No, parent rows should be skipped and the block should go only to Lv4 rows.

## R3-4 A pasted Predecessor that would make a cycle is dropped silently (Test ETM-8763, steps 2–3)

**What QA did**: In one Work, task A depends on task B (Finish to Start, made by a draft paste). Then QA pasted A's sequence number (`<seqA>FS`) into the Predecessor cell of task B. This would make a cycle (A after B, B after A).

**What the app did**: B's Predecessor cell shows `-`. The cell is not red, the dependency store still holds only B→A (no cycle was created), and **Save stays enabled**. No message is shown.

**What the Test expects**: the cycle is pasted and flagged, and Save is disabled until the user fixes it.

**Question**: Which is correct?
- (a) The app must keep the pasted value, mark the cell red and disable Save (the current behaviour is a defect), or
- (b) Dropping the cyclic dependency without a message is correct (QA will change ETM-8763 steps 2–5), or
- (c) Dropping it is correct, but the user must see a message (which text?).

## R3-5 Which Start date may a paste set? (Test ETM-8736, step 4)

**What QA did**: Pasted a 5 x 3 block (Description, Duration, Start) on 5 Work Breakdown rows of one Work. Each Start = that row's own Start + 1 day, date only (`DD Mon YYYY`).

**What the app did**: The pop-up "Unable to Apply Scheduled Time. The selected scheduled time conflicts with the dependency or constraint." opens, and the WHOLE paste is undone (Description and Duration too). This happens on rows that are a Predecessor chain, and also on rows with no Predecessor and no Successor (run 2026-11-25_105457). The same block without the Start column is applied.

**Questions**
1. Which constraint applies to a task with no dependencies? For example the Work's dates, the Plan's Ramp Down/Up Date, or the working calendar.
2. Is it intended that one conflicting Start undoes the whole block, including the valid Description and Duration cells? AC 2 says valid cells proceed.

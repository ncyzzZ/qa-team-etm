# ETM-8521 - Xray step wording, plan for one yes (25 Nov 2026, evening)

From `xray-fix-proposal.md` (section "After the BA reply of 24 Nov") + BA R2-2 / R2-4 / AC 2.1 + user choice R4-1 (a).
Step counts stay the same (evidence keeps its step numbers). Backup before the edit: `xray-steps-before-2026-11-25-eve.json`.
Statuses in ETM-8773 are NOT changed by this plan (all 6 stay TO DO: they are still not proven because of R2-5).

## ETM-8748 (POB / Man-hrs in the Edit modal, BA R2-2)
| Step | Field | Now | New |
|---|---|---|---|
| 1 | action | Record POB, Man-hrs of the row and the `ECM Fitter` and `EI` rows of the Manpower Histogram. | Open the row's Edit modal (double-click the bar) and record POB and Man-hrs, then Cancel. Record the `ECM Fitter` and `EI` rows of the Manpower Histogram. |
| 3 | action | Check POB. | Open the row's Edit modal and check POB. |
| 3 | expected | POB shows 5 (2 + 3). | POB shows 5 (2 + 3) in the Edit modal. |
| 4 | expected | Man-hrs shows 50 (POB x Duration = 5 x 10). | Man-hrs shows 50 (POB x Duration = 5 x 10) in the Edit modal. |

## ETM-8749 (two blocks; R2-2; R4-1 (a) = peak concurrent, BA not confirmed yet)
| Step | Field | Now | New |
|---|---|---|---|
| 1 | action | Record POB, Man-hrs, Start and End of the Lv3 Work, Lv2 Work Header and Lv1 Platform rows. | Record Start, End and Manpower Resource of the Lv3 Work, Lv2 Work Header and Lv1 Platform rows. |
| 2 | action | Paste the Excel block starting at the Duration cell of the first Lv4 row. | Paste `16` / `20` at the Duration cell of the first Lv4 row, then `ECM Fitter[2]` / `ECM Fitter[3]` at its Manpower Resource cell (two blocks: the columns are not next to each other). |
| 3 | expected | POB and Man-hrs equal the totals of the two Lv4 rows; Start and End cover both rows. | Edit modal of the two Lv4 rows: POB 2 / 3, Man-hrs 32 / 60. Work Manpower Resource = peak concurrent demand per type of its Lv4 rows (overlapping rows add up, sequential rows count once). Work Start / End cover its rows. |
| 4 | expected | Its values equal the totals of its Work rows. | Start / End cover its Work rows; Manpower Resource shows "-". |
| 5 | expected | Its values equal the totals of its Work Header rows. | Start / End cover its Work Header rows; Manpower Resource shows "-". |

## ETM-8750 (BA R2-2)
| Step | Field | Now | New |
|---|---|---|---|
| 4 | action | Check POB of the row from step 2. | Open the Edit modal of the row from step 2 and check POB. |
| 4 | expected | POB shows 2. | POB shows 2 in the Edit modal. |

## ETM-8753 (AC 2.1: repeat kept once; no Work Conflicted column; valid cell = Remark)
Summary: "Verify a duplicate inside a multi-value cell rejects that cell only" -> **"Verify a duplicate inside a multi-value cell is kept once and the other cells proceed"**
| Step | Field | Now | New |
|---|---|---|---|
| 1 | action | ... Working Location, Manpower Resource and Work Conflicted cells. | Write down the current values of the Working Location, Manpower Resource and Remark cells. |
| 2 | action | Paste the block starting at the Working Location cell of an Lv4 row. | Paste the block (`<Deck A>,<Deck A>` / `ECM Fitter[1],ECM Fitter[2]` / `Gauge test`) starting at the Working Location cell of an Lv4 row. |
| 3 | expected | It keeps the old value (the whole cell is rejected, not only the duplicate). | It shows `<Deck A>` once (the repeated Deck is dropped). |
| 4 | expected | It keeps the old value. | It shows `ECM Fitter[n]` once (the repeated type is kept once). |
| 5 | action / expected | Check the Work Conflicted cell. / It keeps the old value. | Check that no error message is shown. / No message; the other cells of the row are unchanged. |
| 6 | action | Check the valid Description cell. | Check the Remark cell. |
| 6 | expected | It shows `Gauge test` (valid cell proceeds). | It shows `Gauge test` (valid cell proceeds). |
| 7 | action | ... Work Conflicted with two different task names from the plan. | Paste a block with valid values: Working Location with two different Decks from master data, Manpower Resource `ECM Fitter[1],EI[2]`. |
| 7 | expected | All three cells accept ... | Both cells accept the values (Decks shown as `A, B`; casing as in master data). |

## ETM-8759 (AC 2.1: [0] / [100] / [1.5] -> [1]; repeat kept once; 5-resource limit not in the Story)
Summary: "Verify Manpower Resource limits reject the cell" -> **"Verify invalid Manpower Resource quantities become [1] and a repeated type is kept once"**
| Step | Field | Now | New |
|---|---|---|---|
| 1 | expected | The cell keeps the old value `ECM Fitter[1]`. | The result is recorded (limit of 5 resources per cell not in the Story; Dev to confirm). |
| 2 | expected | The cell shows the result in the Expected cell result column for that line. | `[0]`, `[100]`, `[1.5]` become `ECM Fitter[1]`; `ECM Fitter[1],ECM Fitter[2]` is kept once; `ECM Fitter[99]` and 5 resources are accepted. |
| 3 | action | After each rejected line check POB and Man-hrs. | After pasting `ECM Fitter[0]`, open the row's Edit modal and check POB and Man-hrs. |
| 3 | expected | They did not change. | POB = 1 (the corrected quantity); Man-hrs = 1 x Duration. |
Description table "Expected cell result" column: same values as the new step 2 (Description edit).

## ETM-8762 (block columns next to each other; [0] -> [1]; R2-7 no previous build)
| Step | Field | Now | New |
|---|---|---|---|
| 2 | action | Paste the block at the first Lv4 row. | Paste the block (Manpower Resource + Remark, every 10th row `ECM Fitter[0]`) at the Manpower Resource cell of the first Lv4 row. |
| 3 | expected | The Manpower Resource cell of each keeps its old value. | The Manpower Resource cell of each shows `ECM Fitter[1]` ([0] becomes [1], AC 2.1). |
| 6 | expected | They count only the accepted values, and equal the result of the same paste on the previous build. | They count the pasted values and equal the saved results of the ETM-2615 Tests (no previous build, BA R2-7). |
Description: Excel block = Manpower Resource + Remark (was Description, Duration, Manpower Resource).

## Not in this plan
- ETM-8761 (POB cell does not exist): waits on your choice, remove or rewrite on the Edit modal.
- ETM-8764 (JO permission row): waits on the permission check.
- ETM-8740: passed with the current wording; a later note on parent rows is optional.

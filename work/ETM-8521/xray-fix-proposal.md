# ETM-8521 Xray step changes proposed (NOT applied; needs the user's yes and, where marked, BA)

Save each Test's steps to `work/ETM-8521/xray-steps-before-<KEY>.json` before an edit. Step counts stay the same, so evidence pictures keep their step numbers.

| Test | Step | Now | Proposed | Waits on |
|---|---|---|---|---|
| ETM-8749 | 2 | one block Duration + Manpower Resource | paste Duration (`16`, `20`) and then Manpower Resource (`ECM Fitter[2]`, `ECM Fitter[3]`) as two blocks: the columns are not next to each other | - |
| ETM-8749 | 3-5 | POB / Man-hrs totals | Work row Manpower Resource = `ECM Fitter[5]`; Start / End of Work, Work Header, Platform cover their rows | R2-2 |
| ETM-8753 | 2, 5-7 | block WL, Manpower, Work Conflicted, Description | block WL, Manpower, Remark (`Gauge test`); drop the Work Conflicted parts | R2-2 |
| ETM-8762 | precondition, 2-4 | block Description, Duration, Manpower | block Manpower Resource, Remark (next to each other in the grid) | R2-4 |
| ETM-8762 | 5 | equal the previous build | per R2-7 | R2-7 |
| ETM-8748 | 1, 3-4 | POB / Man-hrs of the row | per R2-2 (Edit modal or remove) | R2-2 |
| ETM-8750 | 4 | POB of the row | per R2-2 | R2-2 |
| ETM-8759 | table, 3 | "rejected, old value stays"; POB / Man-hrs | per R2-4 and R2-2 | R2-4, R2-2 |
| ETM-8761 | 1-5 | paste into POB | rewrite on the read-only list from R2-3 | R2-2, R2-3 |
| ETM-8764 | 1-3 | assumption S-4 | per R2-6 | R2-6 |
| ETM-8736 | precondition | "visible" | add: Scheduled group open, so Description, Duration, Start are next to each other | - |

## After the BA reply of 24 Nov (R2-4 rows corrected after 13:30: current behaviour, Story AC 2.1) (replaces the "Waits on" column above where answered; still NOT applied)

| Test | Xray change | Script change |
|---|---|---|
| ETM-8748 | s1, s3-4: POB / Man-hrs read in the Work Breakdown Edit modal; s5 Manpower Histogram | replace `notChecked(NO_POB_COL)` with an Edit-modal read (`tab-breakdown-details`) |
| ETM-8749 | s3-5: Work row Manpower sum + Start / End span; Work Header / Platform show "-" | totals `notChecked` -> Edit modal POB/Man-hrs of the 2 leafs + Work row sum |
| ETM-8750 | s4: POB in the Edit modal | same helper as 8748 |
| ETM-8753 | dup inside a cell -> kept once (current behaviour, AC 2.1; BA correction); drop Work Conflicted; title "rejects" -> "keeps the value once" | assert dedup (done) |
| ETM-8759 | table + s3: `[0]`, `[100]`, `[1.5]` -> `[1]`, repeated type kept once (AC 2.1); s3 POB = 1 in the Edit modal; 6-resource line: limit not in the Story | assert [1] (done); 6-resource line recorded + `notChecked` |
| ETM-8762 | `ECM Fitter[0]` -> `ECM Fitter[1]` (AC 2.1); s5 compare with saved ETM-2615 results | assert [1] (done); s5 by hand |
| ETM-8761 | user picks: remove the Test, or rewrite on the Edit modal | none until picked |
| ETM-8764 | Ctrl+V does nothing, no message; precondition: permission row checked | drop `fixme` after the permission row is checked |
| ETM-8738 | s5, s8-10: compare with saved ETM-2615 results; POB / Man-hrs in the Edit modal | manual |
| ETM-8751 | none (R2-8 open) | none |
| closeNoWorkingTime | none (R2-5 open) | stays `notChecked` |

## Applied
- 2026-11-24 ETM-8739: step 5 (drag the lower-right corner) removed (user: wrong test, option b). Backup: `xray-steps-before-ETM-8739.json`. Now 4 steps.
- APPLIED 2026-11-24 (user "แก้ Xray"; backup xray-steps-before-ETM-8763.json): ETM-8763 step 4 "Paste the old Predecessor value back into task B" -> "Fix the cycle: paste a Predecessor of task B that makes no cycle (another row C of the same Work)"; expected "B shows C as Predecessor, the cell is not red". Precondition: add row C (no dependencies). Script already does this.
- PROPOSED: ETM-8763 step 2 says "Paste the name of task A"; the app takes the sequence number (stms-fe parseDependencyToken), as the script does -> "Paste the sequence number of task A". Precondition text (row C) is in the Test description, not changed.

# ETM-8049 BA answers (what is known, 2026-11-24)

The BA answered Q1-Q25 on 2026-11-19 (the user said so); the answer text was not recorded, so only answers that became AC changes are known.

| Q | Answer | Source |
|---|---|---|
| Q14 | "Earliest-created work" spelling rule removed; free text (not Master Data) is saved exactly as entered and not matched to other works. | Story description changed 2026-11-18 (AC 6.2) |
| Q15 | "Topmost / first entered" rule removed; case variants are stored and shown as separate values. | Story description changed 2026-11-18 |
| Q18 | Only Deck values added or changed in the save are converted; stored values keep their spelling; no data migration. | Story description changed 2026-11-18 (AC 6.4) |
| Q1-Q13, Q16, Q17, Q19-Q25 | Answered, text not recorded. Q3 and Q16 stay BA proposals in the TCs (see Q30, Q28). | user, 2026-11-19 |
| Q26-Q32 | Open. | questions-for-BA.md |

Observed on QA (not a BA answer, for reference): Select All in a filter acts only on the listed (searched) values; table search applies on Enter; deleted works stay in the worklist with Status "D". (Lead, Chrome, 2026-11-24)

## Answers found in other Stories (not new BA replies, 2026-11-24, source: work/SPRINT26/ba-self-answers-2026-11-24.md)

| Q | Status | Answer | Source |
|---|---|---|---|
| Q27 | Answered | Two values in ONE cell that differ only by case are duplicates; import rejects them. AC 6.2 "stored separately" is across works/breakdowns. | ETM-1106 AC 4.5, ETM-1230 AC 3.1 |
| Q29 | Answered | Excel import converts Y `a` to `A`. Shutdown Logic: no Y column in the Gantt table, Y is a dropdown in the modal, so a typed `a` is impossible there (TC-014 Y step has no spec basis). | ETM-6843 AC 7.5, ETM-1106 AC 7, ETM-2310 |
| Q26 | Partly (open) | Edit Work has no Working Location field; Deck is edited in Create Work, Edit Work Breakdown, Gantt Lv4, Breakdown modal, imports. | ETM-769, ETM-7288, ETM-2310 |
| Q28 | Partly (open) | Blur commits an edit in the Create Work / Edit WB tables -> points to "added on blur". | ETM-7288 AC 4.2 |
| Q30 | Partly (open) | Changes do not take effect until Apply -> table changes after Apply. | ETM-564 AC 3 |
| Q31 | Open | Only import has a rule (Last Write Wins). | ETM-6843 AC 9.1 |
| Q32 | Partly (open) | Create Work: one Deck per work row; several Deck values per breakdown only via Edit WB, Gantt Lv4 or import. | ETM-686 AC 7.1 |

Side note: Deck max length is 30 in ETM-8049/686/1230/1106 but `[String] 50` in docs/modules/shutdown-logic-validation.md (to check).

## BA answers 2026-11-24 (replace the "found in other Stories" rows above where they differ; source: work/SPRINT26/ba-answers-all-2026-11-24.md)

| Q | BA answer |
|---|---|
| Q26 | AC 6.1 reads "Edit Work Breakdown" only (no "Edit Work"). |
| Q27 | Import accepts both `Helipad` and `helipad` (DEC-046). The "duplicates" rejection QA saw is a defect candidate. (Overrides the earlier ETM-1106 reading.) |
| Q28 | Deck text typed without Enter is discarded on save, with no message. |
| Q29 | `a` is converted to `A` per the master list (X / Y follow the same conversion). |
| Q30 | Column Customization Reset changes the table only after Apply. |
| Q31 | Two users save the same Work: the last save wins; each spelling is kept as typed. |
| Q32 | Create Work and Edit Work Breakdown both accept several Deck values in one cell. TC-015 must be rewritten for several values in a Create Work cell. |

## BA correction 2026-11-24 (overrides Q29 above)

| Q | BA answer |
|---|---|
| Q29 | X and Y can only be selected, not typed, so there is no `a` → `A` case. Drop that part of TC-013 and TC-014. |

BA also updated ETM-8049 AC 6.1 in Jira at 14:23.

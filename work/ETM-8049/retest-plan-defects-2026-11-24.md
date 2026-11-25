# ETM-8049: retest plan for the defects opened 24 Nov 2026

Run from the qa-team-etm repo. Retest only after dev moves the defect to Ready for Retest and a new QA FE build is up (the current one is main-BIPLUAIT.js).
RUN-POLICY was checked on 24 Nov 2026: the two automated runs below are `auto` (card-owned data, reset before the run).

## ETM-9231: column filter search matches letter case (regression in build main-BIPLUAIT.js)

Automated (Xray ETM-8781 TC-008, ETM-8783 TC-010):

```bash
node tools/run-card.mjs ETM-8049 tests/fe/e2e/worklist/verifyWorklistWorkingLocationCells.spec.ts -g "ETM-8781|ETM-8783"
```

Check by hand (Plan "QA ETM-8049 Any" / "QA ETM-8049 Case", event NN TEST QA, TM):
1. Job Description filter: `wk-2` finds `QA ETM-8049 WK-2-A` (same as `WK-2`).
2. Deck filter: `deck` finds Helideck, Main Deck, Cellar Deck, Deck 2, Deck 10.
3. Deck filter: `main` finds both `Main Deck` and `main deck`.
4. One more column (e.g. Remark or Job Owner): lower-case search still finds the value, so the fix covers every column.

Pass = all four. Note the new FE build name in the retest comment.

## ETM-9225: Edit Work Breakdown, "main deck" not converted to "Main Deck"

Automated (Xray ETM-8793 TC-020):

```bash
node tools/run-card.mjs ETM-8049 tests/fe/e2e/worklist/verifyWorklistWorkingLocationEntry.spec.ts -g "ETM-8793"
```

Precondition: work `WK-18-O` (Plan "QA ETM-8049 Old") still has the old value `main deck` on `WK-18-O-BD1`. This value was set in the DB (pre-change data, not UI-reachable). Check it is still there before the run; if the plan was reset, seed it again the same way.

Check by hand:
1. Edit Breakdown of WK-18-O, Deck cell of WK-18-O-BD1, remove `main deck`, type `main deck`, Enter: tag becomes `Main Deck`.
2. Save is enabled; save, reopen: `Main Deck` is stored.
3. Control: `mAiN dEcK` still gives `Main Deck`.
4. Another work that still holds `main deck` and is not edited keeps `main deck` (AC 6.4, no migration).

## ETM-9223: Import Excel rejects "Helipad,helipad" as duplicate

Manual (Xray ETM-8786 step 2, see `manual-checklist-8786-8787-8789.md`). File: `work/ETM-8049/F27-import-Helipad-helipad.xlsx`.
1. Plan "QA ETM-8049 Scratch", Create Work > Import Excel, upload the file.
2. No validation error on R5/R6; Import enabled; import.
3. `WK-F27-1` and its breakdown show Deck `Helipad` and `helipad` as two values.
4. Control: `Helipad,Helipad` (exact same spelling) is still rejected as duplicate.
5. Clean up `WK-F27-1` afterwards (`delete-scratch-leftovers.cjs`).

Related, same rule: TC-015 (ETM-8788) Create Work form will not add `DOCK AREA` after `Dock Area` in one cell. BA Q34 (25 Nov 2026, "3a"): the cell may hold both, so this is a defect of the same kind (draft `defect-draft-create-work-case-variant.md`, not logged yet). When ETM-9223 is fixed, re-run ETM-8788 too.

BA Q33 (25 Nov 2026): ETM-9225 stands; a new `main deck` must become `Main Deck`. TC-020 expected result unchanged.

## After the retest

- Failed: comment on the defect with the picture, keep it open.
- Passed: "Retest: Passed" comment on the defect with the evidence pictures embedded (team rule), then Xray. Both need the user's yes (Jira write).

# Defect draft: worklist column filter search matches letter case (ETM-8049, TC-008 / TC-010)

**Summary:** [ETM-8049] Worklist column filter: the search box in the filter popup matches letter case (`deck` does not find `Main Deck`) on every column

**Opening:**
- On the Worklist page, the search box inside a column filter popup now matches letter case.
- Seen on the Working Location (Deck) filter and the Job Description filter, so it affects every column.
- In the run at 14:30 on 24 Nov 2026, TC-010 found both `Main Deck` and `main deck` with the search `main`. After the new QA FE build (main-BIPLUAIT.js) the same search finds only `main deck`.
- Found by ETM-8781 (TC-008) and ETM-8783 (TC-010).

**Environment:** QA, 24 Nov 2026, FE build main-BIPLUAIT.js, user TM. Event NN TEST QA, Plans "QA ETM-8049 Any" and "QA ETM-8049 Case".

### Step to Reproduce
1. Open the Worklist of Plan "QA ETM-8049 Any".
2. Open the Job Description filter.
3. Type `wk-2` in the search box of the filter popup.
4. Delete the text and type `WK-2`.

### Actual Result
- Step 3: "No matches."
- Step 4: `QA ETM-8049 WK-2-A` is listed.
- The Deck filter does the same. Search `deck` lists only `Helideck`, not `Main Deck`, `Cellar Deck`, `Deck 2` or `Deck 10`. Search `main` lists only `main deck`, not `Main Deck`.

Pictures:
- work/ETM-8049/filter-search-lowercase-no-match-2026-11-24.jpg
- work/ETM-8049/filter-search-exact-case-match-2026-11-24.jpg

### Expected Result
- The filter search ignores letter case: `wk-2` finds `QA ETM-8049 WK-2-A`, `deck` finds every value that contains "deck", and `main` finds both `Main Deck` and `main deck`.
- This is how the search worked before this build.
- The Xray steps of ETM-8781 and ETM-8783 expect case-insensitive search.
- Note: the ETM-8049 AC does not state the case rule in words. AC 3.1 says the filter is "the same as other columns" (ETM-434 AC 5).

**Fields:**
- Type: Defect, environment QA, Sprint 26, Epic ETM-2.
- Labels: FE, UI.
- Relates to ETM-8049.
- Assignee: Peeranat Nivesvieat (the [FE] sub-tasks ETM-8581 / ETM-8583).

**Xray (ETM-8822):**
- ETM-8781: the step "Type deck in the search box".
- ETM-8783: step 2 "Type main in the search box".
- Set both FAILED and link the defect.

**[QA] sub-task:** worklog 20m (Chrome check on 2 columns, compare with the 14:30 run).

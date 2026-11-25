# ETM-8049 Xray steps fixed per BA answers (2026-11-24)

Method: xray_graphql updateTestStep (one removeTestStep, one addTestStep). Backups: work/ETM-8049/xray-steps-<KEY>-before-2026-11-24.json. No status, run, Jira field or description was changed.

## ETM-8775 (TC-002)
- Step 4 result: "...until Apply is clicked (ASSUMPTION Q3: BA proposal; ...)" -> "The table still shows the three Working Location columns. It changes only after `Apply` is clicked."
- Not changed: Jira summary still ends "(ASSUMPTION Q3 for the moment the table changes)". Proposal: drop that bracket (summary is not a step).

## ETM-8777 (TC-004)
- Step 6 (changed so Q31 can apply): two Work Breakdowns, one per user -> one Work Breakdown, both users open the same Edit Work Breakdown page. Result: "...of the same Work Breakdown".
- Step 9 action: "Both users click Save at the same time" -> "User A clicks Save, then User B clicks Save." Result: "Both saves finish without an error." (assumption text removed)
- Step 10 result: "Main Deck, helipad, Helipad ... (ASSUMPTION)" -> "Main Deck, Helipad: the value saved last (User B) is what the table shows, as typed. The helipad of User A is gone and no error shows."
- Not changed: Jira summary ("...at the same time keep both") and description ("two Work Breakdowns") are now out of date. Proposal: summary "...two users saving the same Work: the last save wins"; description "one Work Breakdown".

## ETM-8785 (TC-012)
- The steps had no "Edit Work Details" text (data row only). Step 1 made specific: "Open the page of the data row below." -> "Open the Edit Work Breakdown page of the work of the data row (row menu, View Work Details, Edit Breakdown) and double-click the Deck cell." Result: "The Edit Work Breakdown page opens and the Deck cell editor is open." Step 2: "Deck field" -> "Deck cell editor".
- Not changed (description, no ASSUMPTION text): precondition row `Edit Work Details of WK-1a, MAIN DECK`, and "Edit Work Details" in scenario and navigation path, and in the summary. Proposal: both rows use Edit Work Breakdown (WK-1a `MAIN DECK`, WK-1b `mAiN dEcK`); remove "Edit Work Details" from summary, scenario and path.

## ETM-8786 (TC-013)
- Step 3: "Read the Deck and Y cells ... Deck shows Main Deck and Y shows A" -> "Read the Deck cell of work WK-X1 ... Deck shows `Main Deck`."
- Step 2 and its defect link are untouched. No step tests a case-variant cell, so Q27 needed no wording change.
- Not changed: summary ends "and Y `a` becomes `A`"; description has Y `a` and the Y wording. Proposal: remove Y from summary and description.
- PROPOSAL (needs user yes, not done): add an import row with Deck `Helipad` and a second with `helipad` and a step saying the import accepts both (Q27).
- Link check: ETM-8822 run of ETM-8786, step 2 is still FAILED with defect 2301592 (ETM-9223).

## ETM-8787 (TC-014)
- Removed old step 10 "Select the Y cell of work WK-18g and paste the text `a`" (result `A`). Steps now 11.
- Old step 12 (now 11): "Read the Deck and Y cells of WK-18g ... Y shows A" -> "Read the Deck cell of `WK-18g`" / "Deck shows `Main Deck`."
- Not changed: summary ends "and Y `a` becomes `A`"; description mentions `{{a}}` ready to copy and Y `B` of WK-18g. Proposal: remove those.

## ETM-8788 (TC-015), now 11 steps
Flow is one work, one Deck cell with four tags. Order rule (AC 2.2): Master Data values in Master Data order first (Main Deck, Cellar Deck), then free text by text comparison; the lower case spelling sorts first, so `Dock Area` before `DOCK AREA`.
- 1 result: adds "with one work row".
- 2 action: "first Work Breakdown row" -> "the work row" (Deck cell).
- 6: was NEG `DOCK AREA` -> now `Cellar deck` + Enter, tag `Cellar Deck` next to `Main Deck`.
- 7: was `Dock Area` in second row -> same cell, third tag `Dock Area` as typed.
- 8: was blur step with ASSUMPTION Q16 -> NEG check `DOCK AREA` + Enter, fourth tag exactly as typed, not merged.
- 9: was Save -> NEG check: type `Pier Side` in the same cell and click away without Enter. Result: no tag, no message, text discarded on save. (`Pier Side` is the non-Master-Data value already named in the description.)
- 10: Save. Result: one work saved with one Deck cell of four tags, no message about `Pier Side`.
- 11 (NEW step, needed to keep Save and Read apart): read the cell: `Main Deck, Cellar Deck, Dock Area, DOCK AREA`, no `Pier Side`.
- Steps 3-5 unchanged.
- Not changed: description says "three Work Breakdown rows" and "Create Work page has three Work Breakdown rows"; summary says "several free-text spellings are all stored" (fine). Proposal: description "one work row; its Deck cell takes several values".

## ETM-8791 (TC-018)
- Step 10: "Open `Edit Work Details` ... type the 31-character value in the Deck field" -> "Open Edit Work Breakdown of the work saved in step 4 (row menu, View Work Details, Edit Breakdown), double-click the Deck cell and type the 31-character value." Result: "The cell editor keeps 30 characters, ..." (Not proven that the Edit Work Breakdown editor limits to 30; the result stays as before and is checked at run time.)
- Not changed: description navigation path "Manual Create, Edit Work Details, and Import Excel". Proposal: "Edit Work Breakdown".

# Round 2 (user yes to all three points)
- ETM-8777 step 6 change kept (both users open the same Work Breakdown).
- ETM-8786: added steps 7 and 8 (step 2 untouched). 7: import File 3 (row `WK-X4`, Deck `Helipad,helipad`), expected "accepts both values ... (fails until ETM-9223 is fixed)". 8: Deck cell of `WK-X4` shows `helipad, Helipad` (free text, lower case first), same "(fails until ETM-9223 is fixed)". Total 8 steps. Run link check: ETM-8822 step 2 still FAILED with defect 2301592.
- Summaries and descriptions edited in Jira (Markdown, via editJiraIssue). Backups: jira-text-<KEY>-before-2026-11-24.json (original text in Jira wiki form; 8791 backup keeps only the changed line, the rest of its description was not changed).
  - 8775: summary, ASSUMPTION bracket removed.
  - 8777: summary "when two users save the same Work Breakdown the last save wins"; description scenario, precondition (one Work Breakdown), path.
  - 8785: summary and description now Edit Work Breakdown only (rows WK-1a `MAIN DECK` and WK-1b `mAiN dEcK` both Edit Breakdown).
  - 8786: summary "accepts both Helipad and helipad" (Y removed); description: Y `A`, Y `a` removed, File 3 added.
  - 8787: summary and description: Y removed.
  - 8788: summary (shortened to fit 255 characters) and description: one work row, one Deck cell.
  - 8791: description path now Edit Work Breakdown. Summary unchanged.

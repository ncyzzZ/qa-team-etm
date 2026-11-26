# ETM-8049 Questions for BA (before writing test cases)

Story: [Improvement] View Worklist Table - Working Location Columns
Source: analyst.md (22 questions). Items marked ⭐ change an Expected Result directly and should be answered first.

## Master Data and sort order

1. ⭐ What are the Master Data values for Deck? (The Story only gives X = 0-9, N/A and Y = A-J, N/A as "e.g.".) Is the sort order the sheet row order or alphabetical? Is "N/A" always last?
2. Is the X and Y order 0-9 / A-J followed by N/A, or the order in the Master Data sheet? Does the same rule apply to the filter option order (AC 3.4)?

## Column Customization

3. ⭐ What is "Reset"? Which button, and where in Column Customization? Does it ask for confirmation? Does it restore both order and visibility, so Deck, X and Y go back to hidden and between Department and Manpower Resource?
4. If a saved layout has Department hidden (unchecked), where do Deck, X and Y go? Are they still placed next to the hidden Department position?

## Filter and cell display

5. ⭐ `Main Deck` and `main deck` are separate options (AC 3.6). If the user selects only `main deck`, should a work that has only `Main Deck` stay hidden (case-sensitive matching)? Is the filter search box case-insensitive?
6. A work holds both `Main Deck` and `main deck` (from different Work Breakdowns). In what order are they shown in the cell (how does localeCompare 'en' numeric treat letter case)?
7. Is a Deck value that itself contains ", " allowed? If yes, how are the cell and the filter options split? Is there any comma validation?
8. Does the ellipsis depend only on column width, or is there a minimum column width? Is the hover tooltip the standard grid tooltip showing the full ", "-joined text?

## Length and validation

9. ⭐ Where is the 30-character limit per value validated (input field, Excel import, Gantt paste, Shutdown Logic edit)? What message or behaviour appears at 31 characters? What happens if the Master Data spelling is longer than 30 after case conversion?
10. Where do users open Excel import and Shutdown Logic from (menu or button names)? Do the templates of ETM-1008 / 1106 / 6843 already have Working Location (Deck/X/Y) columns?
11. How are X/Y values that are not in Master Data handled (Excel, Gantt paste, forms): rejected or ignored? What is the error message?
12. Excel import with a mix of valid and invalid rows (e.g. a Deck over 30 characters): is the whole file rejected or only that row?
13. Are leading and trailing spaces trimmed before the case-insensitive match (AC 6.1 / 6.2)? Does `Main  Deck` (two spaces) match `Main Deck`?

## Letter-case normalization (AC 6)

14. "Earliest-created work": is it the Work's creation timestamp, even if the work was edited later or moved from another worklist? What spelling is used if the earliest work was deleted?
15. "Topmost Work Breakdown": topmost as shown on screen at save time, or by sequence number? In Gantt Copy & Paste, which row counts as first?
16. AC 6.3 while typing: is the converted spelling shown on every keystroke, on blur, on Enter, or only on paste? Does partial text convert while the user is still typing?
17. Does the normalization also apply to X and Y? (Analyst assumed No, because the Story says free-text applies to Deck only.)
18. Is there a data fix (migration) for existing works with case variants, or do they stay as stored until edited? If a work is edited without touching the Deck field, is the old variant converted?

## Export and value source

19. Export (AC 5): does a multi-value Deck use the same ", " separator and the same order as the cell? (The Story says "no change"; we need the existing format to write the Expected Result.)
20. If a work has no Work Breakdown (or all were deleted), does the cell show the value from the Work itself or stay empty? Is the cell source the Work or its Work Breakdowns?

## Other

21. (Suggestion, not in the Story) Please confirm the default column width of Deck / X / Y so the ellipsis case can be tested with predictable data.
22. Do ETM-8391 (Remark filter) and ETM-686 change the shared filter behaviour (Select All, search) that AC 3.1 refers to?

## New questions (raised while designing test cases)

23. What does a user without View Worklist permission see when opening a worklist by direct link (silent redirect or a message)?
24. Does Select All, while a search text is typed in a filter, select only the options currently listed (same as other columns)?
25. If Deck / X / Y is left empty on save, how does the system show it (Save button disabled or an error message)?


## Round 2 questions (raised after test runs, 2026-11-24, Story status: Deployed to QA)

26. ⭐ AC 6.1 says "Edit Work", but the Edit Work Details form has no Working Location (Deck / X / Y) field. Should AC 6.1 read "Edit Work Breakdown" (worklist row menu > View Work Details > Edit Breakdown)? Is there any other edit screen where Deck can be changed?
27. ⭐ Import Excel rejects a cell with `Helipad,helipad` with a "duplicates" error, but AC 6.2 says values that differ only by letter case are stored as separate values. Which is correct for Excel import: reject as duplicate, or store `Helipad` and `helipad` as two values?
28. Create Work: the user types a Deck value and clicks away without pressing Enter. What should happen: the typed text is added as a value, the text is discarded, or a message is shown? (follow-up to Q16)


## Round 3 questions (from the Sprint 26 audit, 2026-11-24, Story status: In Testing)

29. ⭐ Y value `a` becomes `A` (TC-013 Excel import, TC-014 Shutdown Logic): AC 6 speaks only about Deck, and X / Y are "From list". Should a lower-case Y such as `a` be converted to `A`, rejected, or is it impossible to enter? (follow-up to Q17)
30. Reset in Column Customization (TC-002): does the table change at once when Reset is clicked, or only after Apply? The test still uses the BA proposal "after Apply" (Q3); please confirm.
31. Two users save the same work with different Deck spellings at the same time (TC-004 steps 6-10): what is the expected result (last save wins, both kept, or an error)? This was never answered.
32. ⭐ Create Work (TC-015): the screen has one Work Details row per work, so several Work Breakdown rows of ONE work cannot be entered there. Where can a user enter several Deck values for one work in one session (Edit Work Breakdown only)? We will rewrite TC-015 to the real flow after your answer.

## Round 4 question (TC-020 result, 2026-11-24, Story status: In Testing)

33. ⭐ Edit Work Breakdown on work `WK-18-O` (event NN TEST QA): typing `main deck` + Enter keeps `main deck` (not converted), although the suggestion list shows `Main Deck`. Typing `mAiN dEcK` gives `Main Deck`. The event already has the free-text value `main deck` on other works; QA set that existing value directly in the database to stand for data saved before this change (AC 6.4: existing values are not converted, no migration), because new entries are converted and the screen can no longer make it. Please confirm: (a) such lower-case Master Data values really exist in production data from before this change, so this case is reachable for users; and (b) a new entry `main deck` must still convert to `Main Deck` even when the event already holds the old value `main deck`. If both are yes, QA will log it as a defect.
    Update 2026-11-24: logged as defect ETM-9225 before this answer (QA lead's choice). Sent again on its own: questions-for-BA-ETM-9225.en.md.

## Round 5 question (TC-015 result, 2026-11-24, Story status: In Testing)

34. ⭐ Create Work, one Deck cell: after the tag `Dock Area` (or `DOCK AREA`) is in the cell, typing `DOCK AREA` (or `dock area`) shows the existing tag as already selected (a tick in the list), and pressing Enter adds nothing. So one cell cannot hold two free-text values that differ only by letter case. Your answer to Q32 says Create Work accepts several Deck values in one cell, and AC 6.2 says free text is saved exactly as entered. TC-015 (ETM-8788) expects the cell `Main Deck, Cellar Deck, Dock Area, DOCK AREA`. Import shows the same rule (`Helipad,helipad` is rejected, defect ETM-9223). Which is correct for Create Work and Edit Work Breakdown: (a) the cell may hold `Dock Area` and `DOCK AREA` together, so this is a defect like ETM-9223, or (b) values that differ only by letter case are duplicates inside one cell, and TC-015 must change? Picture: TC015-case-variant-not-added-2026-11-24.jpg.

## Round 6 question (TC-006 manual run, 2026-11-25, Story status: In Testing)

35. Tooltip on X and Y cells (TC-006, ETM-8779 steps 5-6, AC 5 "ellipsis and hover shows the full text"): on work `WK-10b-T` the X cell `0, 1, 2, 3, 4, 5, 6, 7, 8, 9` and the Y cell `A, B, ... J` fit the column (no `…`), and hovering shows no tooltip. The columns cannot be made narrower than 200 px, so these values can never be cut. The Deck cell, which is cut, does show the full text on hover. Is the tooltip meant (a) only when the text is cut (then steps 5-6 change and pass), or (b) on every hover, even when the full text already shows (then this is a defect)? Pictures: run 2026-11-25_203819_ETM-8049_manual, evidence/ETM-8779/step-5.png and step-6.png.

## Round 7 question (TC-014 manual run, 2026-11-26, Story status: In Testing)

36. Shutdown Logic, Deck in the Gantt table (TC-014, ETM-8787 step 5; Plan "QA ETM-8049 Logic", work `WK-1a-L`, Breakdown row `WK-1a-L-BD1`): in the inline Gantt cell editor, typing a value that is not in the suggestion list (for example `Zed`, or the 31-character `Deck-0123456789-0123456789-ABCD`) shows "No results", and Enter adds no tag, so the value is not entered. In Edit by Modal (Breakdown Setting) and in Create Work the same text becomes a tag (cut to 30 characters), and pasting into the Gantt cell also works. AC 6.2 says Deck is free text with suggestions. Is the inline Gantt cell editor (a) meant to allow free text like the modal (then this is a defect), or (b) meant to pick only listed values (then QA keeps TC-014 as passed by Edit by Modal and paste)? QA passed TC-014 on 26 Nov through the modal round and the paste. Pictures: run 2026-11-26_133539_ETM-8049_manual, evidence/ETM-8787/r1-step-5.png and r1-step-5a.png.
Also please confirm the Deck maximum: this Story says 30 characters; the Shutdown Logic validation sheet says `[String] 50`.

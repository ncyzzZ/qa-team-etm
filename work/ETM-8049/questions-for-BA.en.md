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

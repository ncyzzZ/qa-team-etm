# ETM-8034 Questions for BA (before writing test cases)

Story: [Improvement] Shutdown Logic - Row Highlight and Text Color in Gantt Table
Status: Ready For Development · No comments · ⭐ = directly affects an Expected Result, please answer first

## Context menu and palette

1. (Closed: 13 cells = No Color + 12 colors, confirmed by the tester; order as in the table at the end.) One small point left: do the color cells show a tooltip or a name on hover? If yes, please give the text.
2. ⭐ If several rows are selected (multi-select) and the user right-clicks, is the color applied to all selected rows or only to the right-clicked row?
3. In Figma, some cells have a blue outline (e.g. No Color and the pink one in Change Text Color). Is that hover or "current color" (selected)? Does the submenu show the row's current color? What happens when the user picks the color the row already has?
4. ⭐ Users without permission (AC 1.5): do the existing menu options still appear as usual? If there are no other options, what happens on right-click (empty menu, no menu)?

## Coloring scope (AC 2, 3)

5. ⭐ Which columns does "whole table row" cover (including frozen/fixed columns, the Gantt bar area on the right, the expand/collapse button, icons in cells)? Does Text Color also change icons and links in the row?
6. ⭐ If a color is applied on a Platform or Work Header row, do the child rows (Work, Work Breakdown) inherit it, or only the selected row? If a child already has its own color, which one wins?
7. Does the color follow the row when it is collapsed, expanded, moved, or copy-pasted? (Copy & Paste is covered in ETM-8035.)
8. Does a new row added or inserted from a colored row get the source row's color or the default?

## Condition colors (AC 4)

9. ⭐ What exactly is the "layer that mixes with the highlight color" (opacity value, which color is on top)? We need the values from Figma node 163-807247 to write Expected Results for a disabled cell and a validation error.
10. When Text Color conflicts with a condition text color (e.g. red error text), which one wins? Is there a rule to prevent low contrast (e.g. yellow text on a yellow background)?
11. How do hover / selected / focus states of a row layer over the highlight color?

## Saving (AC 5)

12. ⭐ If the user changes a color and leaves the page without clicking Save, is there an unsaved-changes warning? If not, the change is lost, correct?
13. If two users change the color of the same row at the same time, does the last Save win? Is there a conflict message?
14. Does changing only a color (no other edit) enable the Save button and the "has unsaved changes" indicator, the same as a normal edit?
15. Which Shutdown Logic version/plan are the colors tied to? If a version or copy of the Shutdown Logic is created, are the colors copied too?

## Undo / Redo (AC 6)

16. ⭐ When several rows are colored at once, is that one Undo step or one per row? Is it in the same history as other edits? After Save, can Undo still revert the color?

## Export PDF (AC 7)

17. ⭐ Does the PDF show the same highlight and text colors as the screen, including the mixed condition colors? If the user changed a color but did not Save, does the PDF use the saved color or the one on screen? (Black-and-white printing is out of scope unless you say otherwise.)

## Other

18. Is existing data without colors treated as "No Color" (default)? Does the BE store the fields `Highlight Color` and `Text Color` as named in Data Source? How is "No Color" stored (null or a value)?
19. ETM-8035 (Done, "Gantt Table Enhancements (Row Highlight, ...)") is linked as "relates to" this Story. Did it already deliver the same feature? What is the difference in scope, and does ETM-8034 replace or extend it?

## Palettes received (from the Color Code images)

| # | Highlight Row (light) | Change Text Color (strong) |
|---|---|---|
| 1 | #D6E4FF | #1D39C4 |
| 2 | #BAE0FF | #1677FF |
| 3 | #B5F5EC | #08979C |
| 4 | #D9F7BE | #52C41A |
| 5 | #EBF5BA | #81A827 |
| 6 | #FFFB8F | #D4B106 |
| 7 | #FFE58F | #D48806 |
| 8 | #FFE7BA | #FA8C16 |
| 9 | #FFD8BF | #FA541C |
| 10 | #FFCCC7 | #F5222D |
| 11 | #FFD6E7 | #EB2F96 |
| 12 | #EFDBFF | #722ED1 |

Note: confirmed from the Figma menu screenshots: Change Text Color opens the strong palette, Highlight Row opens the light palette. Both options sit above "Delete Work" (matches AC 1.1). Each submenu has No Color (the 13th cell) + 12 colors = 13 cells. The AC 1.2 wording "No Color followed by 13 colors" is treated as loose wording (read as 13 cells including No Color).

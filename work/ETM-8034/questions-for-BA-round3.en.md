# ETM-8034 Questions for BA, round 3 (2026-11-24)

Story: [Improvement] Shutdown Logic - Row Highlight and Text Color in Gantt Table (status In Development).
Found in the Sprint 26 check of the test cases against the live AC. Each question says which test case waits on it.

1. AC 1.2 says the submenu shows "No Color (⊘), followed by 13 colors". Your earlier answer, the Figma menu and the palette table give No Color + 12 colours (13 cells in all). Please correct AC 1.2 to "No Color followed by 12 colors", or tell us the 13th colour and its hex. (ETM-8856 steps 2, 4, 6, 8 test No Color + 12.)
2. Undo history: after a user saves a change in the Work Setting modal (Edit Work) on the Shutdown Logic page, does Undo on the page revert that modal change, in order with the colour changes? Neither the AC nor an earlier answer says so. (ETM-8865 step 24 expects yes; if no, we remove that step.)
3. AC 8.2 Copy & Paste: the build copies a row by double-clicking its No. cell and pressing Ctrl+C, and pastes with a double-click on the No. cell of the target row and Ctrl+V. Is this the Copy & Paste AC 8.2 means (cell values only, no colour), or is there another copy action, for example a menu item? (ETM-8861 steps 1-4.)

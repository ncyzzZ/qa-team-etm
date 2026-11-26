# ETM-8779 (TC-006): Xray steps 5-6 to match the QA lead decision on Q35 (draft, NOT written yet)

Decision 26 Nov 2026 (main chat): the tooltip shows only when the cell text is cut off. Data: X `0, 1, ... 9` and Y `A, B, ... J` of `WK-10b` fit the default column width (200 px minimum), so they are never cut.
Steps 1-4 unchanged.

| # | Action (new) | Expected Result (new) |
|---|---|---|
| 5 | Look at the X cell of `WK-10b` and hover over it. | The cell shows the full text `0, 1, 2, 3, 4, 5, 6, 7, 8, 9` without `…`; because the text is not cut, no tooltip opens. |
| 6 | Look at the Y cell of `WK-10b` and hover over it. | The cell shows the full text `A, B, C, D, E, F, G, H, I, J` without `…`; because the text is not cut, no tooltip opens. |

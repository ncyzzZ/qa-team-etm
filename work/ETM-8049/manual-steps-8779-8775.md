# ETM-8049 manual steps: ETM-8779 (TC-006) and ETM-8775 (TC-002) for the manual runner

Why: both Tests are "Not proven" in the Playwright runs because a part needs a person's eye (ellipsis and tooltip look) or a drag inside the Column Customization menu (Department moved after Equipment Number). User, chat 25 Nov 2026: "ใช้ manual runner เข้าไปทำ".

Environment: QA only (https://stms-qa.apps.pttep.com). Log in as Turnaround Manager. Event `NN TEST QA`. Card data of ETM-8049 (reset before the run).
Work numbers on screen carry the plan letter: on Plan "QA ETM-8049 Tip" `WK-10` is `WK-10-T` and `WK-10b` is `WK-10b-T`.
Column Customization is the button at the top right of the table (icon left of nothing, next to `Reset Table Filter`). Deck, X and Y are hidden by default.

## ETM-8779 - Long text in Deck, X and Y ends with an ellipsis and hover shows the full text (6 steps)
writes data: no
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/b2c838e8-beaa-4df6-b868-685f22bd11ae/worklist/f2f7517f-969f-48a1-81c9-4f06ac9dac8f
Before step 1: open Column Customization, check `Working Location (Deck)`, `Working Location (X)` and `Working Location (Y)`, click `Apply` (default width). This only changes the view of this user. At the end open Column Customization, click `Reset`, `Apply`.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Look at the Deck cell of `WK-10-T` | The cell shows the joined values; if the text is cut it ends with `…` | Row WK-10-T with the Deck cell |
| 2 | Drag the right border of the Deck column header to the left (make the column narrower) until the text is cut | The text is cut at the cell edge and ends with `…` | Narrow Deck column, cell of WK-10-T |
| 3 | Hover over the Deck cell of `WK-10-T` | The grid tooltip shows the full text `Weather Deck, Upper Deck, Lower Deck, Cooler Deck, Main Deck, Cellar Deck` | Tooltip with the full text |
| 4 | Drag the right border of the Deck column header to the right (make the column wider) until the whole text fits | The `…` disappears and the full text shows in the cell | Wide Deck column, cell of WK-10-T |
| 5 | Look at the X cell of `WK-10b-T` and hover over it (keep the mouse on it about 2 s) | The cell shows the full text `0, 1, 2, 3, 4, 5, 6, 7, 8, 9` without `…`; because the text is not cut, no tooltip opens (decision Q35, 26 Nov) | X cell while hovered, whole text visible, no tooltip |
| 6 | Look at the Y cell of `WK-10b-T` and hover over it (keep the mouse on it about 2 s) | The cell shows the full text `A, B, C, D, E, F, G, H, I, J` without `…`; because the text is not cut, no tooltip opens (decision Q35, 26 Nov) | Y cell while hovered, whole text visible, no tooltip |

Xray steps 5-6 reworded 25 Nov 2026 (user: "แก้แล้วรันซ้ำ"; backup xray-steps-8775-before-2026-11-25.json).

## ETM-8775 - Reset link in Column Customization restores the default layout with the three columns hidden (6 steps)
writes data: yes
writes: the column layout of the Turnaround Manager user (Column Customization, Apply) on Plan "QA ETM-8049 Cells" only; it is put back to the default by the Test itself (Reset, Apply). No work, plan or other data changes.
role: turnaroundManager
start: /shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/d7bf0f85-4590-4d08-83e6-9d085d28ea6c/worklist/6bef14ed-4be1-4ecc-a8ad-79f265f9ff5a
Precondition (do it first, picture it): open Column Customization, check `Department` (hidden by default), Deck, X and Y, DRAG `Department` in the list so it sits right after `Equipment Number`, click `Apply`. Reload the page and confirm the table shows Department after Equipment Number and the three Working Location columns (this is the "saved custom layout"). If the drag cannot be done in the menu, stop: needs-human.
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Column Customization menu | The popover shows Deck, X and Y checked | Popover |
| 2 | Look at the footer of the popover | The footer shows the `Apply` button and a `Reset` link next to it | Popover footer |
| 3 | Click the `Reset` link | No confirmation window opens; the list returns to the default order and Deck, X and Y are unchecked, listed directly after `Department` and before `Manpower Resource` | Popover after Reset |
| 4 | Look at the table behind the popover | The table still shows the three Working Location columns. It changes only after `Apply` is clicked | Table behind the open popover |
| 5 | Click `Apply` | The popover closes and the table shows the default layout: the three Working Location columns are hidden, and `Department` is hidden again and is no longer after `Equipment Number` (the default) | Table header after Apply |
| 6 | Open the Column Customization menu, check `Department`, Deck, X, Y and `Manpower Resource`, and click `Apply` | In the table the columns follow the default order with Deck, X and Y directly after `Department` and before `Manpower Resource`, in the order Deck, X, Y | Table header showing Department, Deck, X, Y, Manpower Resource side by side (scroll so all five are in one picture) |

After 8775: open Column Customization, click `Reset`, `Apply` (default layout again).

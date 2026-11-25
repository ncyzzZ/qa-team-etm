# Dev brief: ETM-9219 (Story ETM-8034)

## 1. What is wrong
On the Shutdown Logic page, the `Highlight Row` and `Change Text Color` palettes do not mark the colour the row already has.
The blue frame appears only on the swatch under the mouse (hover / keyboard focus), so the user cannot see the current colour.

## 2. Where
- Page: Shutdown Logic (Gantt), environment QA.
- URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Role: Turnaround Manager (Job Owner cannot open the colour menus).
- Test data: event `NN TEST QA`, Shutdown Logic `S26 Row Colour`. Any Work row works.
- Before you start: collapse the Manpower Resource histogram. Hover the splitter (`data-testid="sl-splitter-horizontal"`) and click `Hide histogram`. Do this again after every reload.

## 3. Steps to reproduce
1. Open the Shutdown Logic above as a Turnaround Manager. Collapse the histogram.
2. Double-click the No. cell of a Work row. This selects the whole row.
3. Right-click the No. cell, open `Highlight Row`, choose the light blue swatch `B9E0FF`. The row background changes.
4. Select the same row again (double-click No.), right-click it, open `Highlight Row`.
5. Look at the palette. Do not move the mouse over the swatches.
6. Repeat steps 3-5 with `Change Text Color` (e.g. `FA8B16`).

## 4. Actual vs Expected
| | Actual | Expected |
|---|---|---|
| Row has a colour | No swatch has a blue frame. A frame shows only on hover / focus. | The swatch of the row's current colour has the blue frame as soon as the palette opens. The other 12 swatches have no frame. |
| Row has no colour | No swatch has a frame. | `No Color` has the frame, no colour swatch has one. |
| Both palettes | Same issue in `Highlight Row` and `Change Text Color`. | Each palette frames its own current value (background colour / text colour). |

Hover and focus may keep their own frame as today. The "current colour" frame must show without hover.

## 5. Rule source
BA answer, ETM-8034 QA questions round 1, Q3.
- Question (sent): "In Figma, some cells have a blue outline (e.g. No Color and the pink one in Change Text Color). Is that hover or "current color" (selected)? Does the submenu show the row's current color?"
- Answer (exact words, Thai): "กรอบสีฟ้า = สีที่เลือกอยู่ (selected)"
- In English: "Blue frame = the colour that is currently selected."

## 6. Hints for the fix (a guess, from reading `stms-fe` develop; please confirm)
- File: `src/app/features/shutdown-event-list/pages/shutdown-logic/components/shutdown-gantt-chart/row-color/shutdown-gantt-row-color.service.ts`
  - `buildSwatch(color, weight, onItem)` builds each swatch, and it does not know the row's current colour. No "selected" class is set.
  - The menu builder already has `targets` (from `groupSelectionByRow`), and `applyColor` reads the current value with `normalizeCellColors(record.get('cellColors'))`. The same value could be passed to `buildSwatch` to add a class such as `shutdown-color-menu-item--current`.
- File: `row-color/_shutdown-gantt-row-color.scss` (around lines 108-115)
  - The blue border `#009fda` is set only for `:hover`, `.b-focused` and `.b-active`. A rule for the new "current" class is needed.
- Open point (guess): when the selection covers cells or rows with different colours, which swatch gets the frame? Our suggestion is none. Please check with the BA if this case can happen.

## 7. How QA will retest
Automated (Playwright, `verifyShutdownLogicRowColour.spec`), Test Execution ETM-8875:
- ETM-8856 step 12: after choosing `B9E0FF`, the `B9E0FF` swatch has a blue frame.
- ETM-8856 step 13: no other swatch has a frame.
- ETM-8856 step 16: on a row with no colour, no colour swatch has a frame.
- ETM-8859 step 14: after the background changes to `FFE7BA`, only `FFE7BA` is framed when `Highlight Row` opens again.

Manual check with screenshots: steps 3-6 above, plus a row with no colour (`No Color` framed).
Pass = all of the above, in both palettes, and after a page reload too (the frame follows the saved colour).

## 8. Out of scope / do not change
- The palette contents: `No Color` plus 12 colours, their order and hex values.
- Applying, replacing and clearing colours, saving, and reload behaviour (all passed).
- Hover / focus look of the swatches (keep it).
- `Highlight Cell` (a right-click on a single cell). It has no Test yet and is waiting for the BA (round 4).
- Row colour inheritance (none, by BA rule) and copy-paste (colour is not copied).

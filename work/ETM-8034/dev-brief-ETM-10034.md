# Dev brief: ETM-10034 (Story ETM-8034)

## 1. What is wrong
On the Shutdown Logic page, the colours in the `Highlight Row` and `Change Text Color` submenus are not the hex values written in the Figma design. 15 of the 24 colours are off by 1-4 in one or more RGB channels. The wrong hex is shown on screen and sent to the backend as is, so the saved colour codes do not match the design.

## 2. Where
- Page: Shutdown Event > Planning > Plan card > Shutdown Logic (Gantt table, left side). Context menu of a selected row.
- URL pattern: `https://stms-qa.apps.pttep.com/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA, build containing stms-fe commit `73dfde33`. Role: Turnaround Manager.
- Data: any plan with rows (seen on plan `S26 Row Colour` and plan `QA ETM-8034 Row Colour JO`).
- Design: Figma file "EMI - Turnaround (Shutdown Logic 2)", node `174-811357`, frames "Color Code" (highlight palette) and "Frame 1010105847" (text palette).

## 3. Steps to reproduce
1. Open the Shutdown Logic page of a plan as Turnaround Manager.
2. Double-click the No. cell of a Work row (selects the row), right-click it, open `Highlight Row`, choose a colour, for example the 1st swatch.
3. In DevTools, read the `background-color` of the row cells, or read the colour in the Save request body after `Save`.
4. Do the same with `Change Text Color` (3rd swatch, for example) and read the text `color`.
5. Compare with the hex written in the Figma "Color Code" frames.

## 4. Actual vs Expected
| Palette (swatch no.) | Expected (Figma Color Code) | Actual (build) | Difference |
|---|---|---|---|
| Highlight 1 | `#D6E4FF` | `#D7E3FF` | R+1 G-1 |
| Highlight 2 | `#BAE0FF` | `#B9E0FF` | R-1 |
| Highlight 3 | `#B5F5EC` | `#B4F5EC` | R-1 |
| Highlight 9 | `#FFD8BF` | `#FFD9BF` | G+1 |
| Highlight 10 | `#FFCCC7` | `#FFCCC6` | B-1 |
| Highlight 11 | `#FFD6E7` | `#FFD7E7` | G+1 |
| Text 1 | `#1D39C4` | `#1E39C5` | R+1 B+1 |
| Text 2 | `#1677FF` | `#1777FF` | R+1 |
| Text 3 | `#08979C` | `#04979C` | R-4 |
| Text 4 | `#52C41A` | `#53C31B` | R+1 G-1 B+1 |
| Text 5 | `#81A827` | `#81A828` | B+1 |
| Text 6 | `#D4B106` | `#D4B108` | B+2 |
| Text 8 | `#FA8C16` | `#FA8B16` | G-1 |
| Text 10 | `#F5222D` | `#F5212D` | G-1 |
| Text 11 | `#EB2F96` | `#EB2E97` | G-1 B+1 |

Correct already (9): highlight 4-8 and 12 (`#D9F7BE`, `#EBF5BA`, `#FFFB8F`, `#FFE58F`, `#FFE7BA`, `#EFDBFF`); text 7, 9, 12 (`#D48806`, `#FA541C`, `#722ED1`).

Seen in the automated run of Xray Test ETM-8858 (run `2026-11-24_150208_ETM-8034`). The values on screen are the same as in the source file below.

## 5. Rule source
- Figma "Color Code" frames (node `174-811357`): each swatch has its hex written next to it. The 24 values in the Expected column are those labels. They are also the Ant Design colour tokens (blue-2, geekblue-7, cyan-7, ...).
- ETM-8034 AC 1.2: the submenu shows No Color followed by 12 colours (the Figma palette).
- Xray Test ETM-8858 (Test Execution ETM-8875), steps 4 and 9: the Test Data lists the Figma values.

## 6. Hints for the fix (guess, from the local stms-fe source; QA build may differ)
- `src/app/features/shutdown-event-list/pages/shutdown-logic/components/shutdown-gantt-chart/row-color/shutdown-gantt-row-color.constant.ts`
  - Lines 5-7 say: "Values are taken pixel-for-pixel from the Figma design — do not normalise them to Ant Design tokens."
  - A colour picked from rendered pixels (screenshot or eyedropper, colour-managed display) drifts by 1-4 from the real fill. That matches every difference above.
  - Likely fix: replace the values in `ROW_HIGHLIGHT_COLORS` and `ROW_TEXT_COLORS` with the hex labels from the Figma Color Code (the Expected column), keep the order, and update the comment.
- `shutdown-gantt-row-color.service.spec.ts` reads from the constant, so it should need no change.
- Open point for dev/BA: rows already saved on QA with the old hex (for example `#D7E3FF`) will not match any swatch after the fix. Do they need a data update, or is QA data enough? This also matters for the current-colour frame of ETM-9219.

## 7. How QA will retest
- Xray Test ETM-8858 (Test Execution ETM-8875): steps 4 and 9 for all 12 highlight and 12 text colours, on every level (Platform, Work Header, Work, Work Breakdown).
- Pass: every swatch puts exactly the Figma hex on the row (background / text) and in the Save request; after Save and reload the same hex comes back.
- QA will also re-run ETM-8856 and ETM-8859 (submenu swatches and current colour) with the Figma values.

## 8. Out of scope / do not change
- The order of the swatches, the No Color option, and the 5-per-row grid stay as they are.
- The 9 colours that are already correct stay as they are.
- The current-colour blue frame is a separate defect (ETM-9219).

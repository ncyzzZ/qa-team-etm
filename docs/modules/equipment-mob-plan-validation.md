> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Team-provided spec file; texts are verbatim from the source, and any 'not checked on the real app' remark inside the file still applies.

# Equipment Mob Plan page - Validation & Result messages

Written 21 Oct 2026 for QA, copied from a screenshot of the Validation & Result sheet (page: "View Equipment Mob Page").
Nothing here was checked on the real app. The "Figma Link" cell is a link in the sheet, so its address is not in this file.
The screenshot stops at the "Button 3" column, so any columns after it (and any rows below row 5) are not included.

Page: **View Equipment Mob Page** (opens from "View Equipment Mob Plan" on the Planning tab, see ETM-6848 / ETM-6845)

## 1. Messages

| # | Action | Trigger | Condition | Type | Title | Message | Button 1 | Button 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Save Plan | Click Save button | Save success | Toast - Success | Save Success | Save Equipment Mob Plan Successfully. | - | - |
| 2 | Save Plan | Click Save button | Save fail | Toast - Fail | Save Failed | Save Equipment Mob Plan Failed | - | - |
| 3 | Save Plan | Click Save button | Equipment Mob Plan has been deleted | Confirmation Modal - Style 1 | Unable to Save Equipment Mob Plan | The equipment mob plan has already been deleted. | OK | - |
| 4 | Export Equipment Mob Plan | Click Export | Equipment Mob Plan has been deleted | Confirmation Modal - Style 1 | Unable to Export Equipment Mob Plan | The equipment mob plan has already been deleted. | OK | - |
| 5 | Leave Page | Click Back button, or change page using the side menu | (none) | Confirmation Modal - Style 1 | Unsaved Change | Are you sure you want to leave this page? Change you made will not be saved. | Continue Editing | Discard Change |

"-" means the cell is empty in the sheet (no button).

## 2. What each message needs to be tested

| # | How to get the condition | What should happen |
| --- | --- | --- |
| 1 | Change something on the page, then click Save | A success toast shows with the title and message above. Save goes back to grey. |
| 2 | Click Save while the save call fails (for example, set the network to Offline in DevTools) | A fail toast shows with the title and message above. The changes stay on the page. |
| 3 | Open the page in tab A. Delete the Equipment Mob Plan from the Planning tab in tab B. Change something in tab A, then click Save | A pop-up shows with the title and message above and one OK button. |
| 4 | Same set-up as 3, but click Export in tab A | A pop-up shows with the title and message above and one OK button. |
| 5 | Change something on the page, then click the browser Back button, or click another item in the side menu | A pop-up shows with the title and message above, with Continue Editing and Discard Change. Continue Editing stays on the page with the changes kept. Discard Change leaves the page and the changes are not saved. |

Notes (from the sheet and the app notes, not from the screenshot alone):

- The "Unsaved Change" pop-up only shows when something was changed. A page with no changes leaves with no pop-up.
- Rows 3 and 4 give the same message text but a different title. Check the title as well as the message.

## 3. Open questions for BA / Design

1. What happens after the user clicks OK in rows 3 and 4 (stay on the page, or go back to the Planning tab)? The sheet does not say.
2. Does "Change page using side menu" also cover the breadcrumb links? The sheet only names the Back button and the side menu.
3. The two screenshots sent were the same picture. If there are more rows (for example Add Work Header, Delete Equipment), please send them and this file will be extended.

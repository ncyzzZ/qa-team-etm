# ETM-8034: proposed new Descriptions for ETM-8854 to ETM-8872 (not written yet)

Template: Scenario, Precondition (with the Role & Permission link, real values), Navigation Path. Nothing else. Markdown. Summary, labels, steps, type, environment are not touched.

Shared lines used in every Precondition (written out in full in each Test, never "common"):

- A. Logged in to STMS as a Turnaround Manager who has the permission Edit Shutdown Logic Table and Visualization ([Role & Permission](https://pttep.sharepoint.com/:x:/r/sites/TurnaroundManagement/Shared%20Documents/03%20Development/Role%20%26%20Permission%20V.2.xlsx?d=wa5e5a9a2071b4ed7b3ef83c4cf0dffd9&csf=1&web=1&e=3stFwC), Shutdown Logic section, row R67).
- B. A Shutdown Logic plan is open. The Gantt table shows one Platform row with a Work Header, a Work and a Work Breakdown under it, all expanded. No row has a highlight or a text colour.

Shared Navigation Path N1: Shutdown Event -> Planning tab -> Plan card -> Shutdown Logic page (Gantt table). The page URL is not fixed yet because the QA plan for this Story is not chosen.

## ETM-8854 (TC-001)
Scenario: Right-click a row on each level and check that Highlight Row and Change Text Color are the first two options, above the existing ones.
Precondition: A and B. Job Owner is not used here.
Navigation Path: N1

## ETM-8855 (TC-002)
Scenario: A user without the permission sees the saved colours but no colour option on any level.
Precondition: A, then a Turnaround Manager has saved the highlight FFFB8F and the text colour D48806 on one Work row, and one row of each other level exists. A Job Owner account (no Edit Shutdown Logic Table and Visualization permission, row R67) opens the same plan.
Navigation Path: N1

## ETM-8856 (TC-003)
Scenario: Open the Highlight Row and Change Text Color submenus and check the No Color cell, the 12 colours of each palette and the blue frame on the current colour.
Precondition: A and B. Two Work rows without colour (Work A and Work B).
Navigation Path: N1

## ETM-8857 (TC-004)
Scenario: A plan created before this feature shows no highlight and no text colour.
Precondition: A. A plan that was created before this feature is released (old data).
Navigation Path: N1, using the old plan.

## ETM-8858 (TC-005)
Scenario: Apply each of the 12 highlight colours and each of the 12 text colours and check that the whole row changes, on every level.
Precondition: A and B. One row of each level (Platform, Work Header, Work, Work Breakdown) without colour.
Navigation Path: N1

## ETM-8859 (TC-006)
Scenario: Closing the menu or choosing No Color on a clean row changes nothing. Highlight and text colour work together, a new colour replaces the old one, and No Color removes each colour on its own.
Precondition: A and B. One Work row with no highlight and no text colour, on a page where nothing was changed since it was opened. The same row is used for the whole case.
Navigation Path: N1

## ETM-8860 (TC-007)
Scenario: A colour goes only to the row that was right-clicked, never to the rows under it, and stays on the row after collapse, expand, move and Save.
Precondition: A. A plan with two Platforms (Platform 1 above Platform 2). Platform 1 has two Work Headers (Work Header 1 above Work Header 2). Work Header 1 has two Work rows (Work A above Work B) and a Work Breakdown under Work A, all expanded. Work A has the highlight B5F5EC. Work B and all other rows have no colour.
Navigation Path: N1

## ETM-8861 (TC-008)
Scenario: Copy and Paste carries only the cell values, not the colours. Duplicate of a Work Breakdown row copies both colours.
Precondition: A. A source Work row has the highlight FFE58F and the text colour D48806. A target Work row has the highlight B5F5EC and no text colour. A Work Breakdown row has the highlight D9F7BE and the text colour 722ED1, and the Work Breakdown row below it has no colour.
Navigation Path: N1

## ETM-8862 (TC-009)
Scenario: A colour-only change turns Save on, leaving the page shows the unsaved-changes modal, and a saved, replaced or removed colour is kept after reload.
Precondition: A and B. One Work row without colour, used for the whole case.
Navigation Path: N1

## ETM-8863 (TC-010)
Scenario: A second user does not see an unsaved colour, sees the saved colours, and sees them on all four levels.
Precondition: A. A second Turnaround Manager session (browser 2) has the same plan open. One row of each level (Platform, Work Header, Work, Work Breakdown) without colour.
Navigation Path: N1, in both browsers.

## ETM-8864 (TC-011)
Scenario: When two users colour the same row, the user who saves last wins and no message is shown.
Precondition: A. Two Turnaround Manager sessions (browser 1 and browser 2) have the same plan open. One Work row without colour.
Navigation Path: N1, in both browsers.

## ETM-8865 (TC-012)
Scenario: Undo and Redo keep a saved colour when nothing was changed, and step through colours, No Color and a mixed edit in the right order, with the buttons and with Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z.
Precondition: A. Work A has the saved highlight D9F7BE. Work B has no colour. The page was just opened and nothing was changed.
Navigation Path: N1

## ETM-8866 (TC-013)
Scenario: Undo reverts a colour that was already saved, and Undo of a deleted coloured row brings the row back with its colours.
Precondition: A and B. One Work row and one Work Breakdown row without colour.
Navigation Path: N1

## ETM-8867 (TC-014)
Scenario: Duplicate Plan copies the row colours into the new plan and leaves the original plan unchanged.
Precondition: A. A saved plan in a Shutdown Event. In it a Platform row has the highlight FFCCC7, a Work row has the text colour 1677FF, and a Work Breakdown row has the highlight D9F7BE and the text colour 722ED1. Only the Turnaround Manager role has Duplicate Plan.
Navigation Path: Shutdown Event -> Planning tab -> three-dot menu of the plan -> Duplicate Plan; then the new plan card -> Shutdown Logic page.

## ETM-8868 (TC-015)
Scenario: A condition colour (red resource cell, dependency red border) stays visible on a highlighted row, whether the error appears before or after the highlight is chosen.
Precondition: A and B. A task with only one Manpower Resource, with no error. The same task is used for the whole case. Coverage note: the dependency border part needs the steps from Dev to make a dependency conflict; until then it cannot be run.
Navigation Path: N1, then the Manpower Resource histogram below the Gantt table (right-click the resource -> Delete Resource).

## ETM-8869 (TC-016)
Scenario: Hover, selected and focus layers show over a highlight without hiding it, and a disabled cell keeps its disabled look on a highlighted row.
Precondition: A. A Work row has the highlight FFFB8F. A Platform row (or Work Header row) has a read-only roll-up cell (a column that cannot be edited at that level) and no highlight.
Navigation Path: N1

## ETM-8870 (TC-017)
Scenario: Export PDF shows the same row highlight and text colours as the screen.
Precondition: A. Saved colours: Platform highlight D6E4FF, Work Header text colour 1D39C4, a Work row with highlight FFE58F and text colour D48806, a Work Breakdown row with highlight FFD6E7. One row has no colour.
Navigation Path: N1, then Export PDF on the Shutdown Logic page.

## ETM-8871 (TC-018)
Scenario: Many coloured rows are all saved and shown after reload, and filters do not change or remove the colours.
Precondition: A. The largest QA plan available (write down its row count). Two Work rows, Work A with the highlight B5F5EC and Work B with the highlight FFE58F, are among the 20 rows coloured in the case. Coverage note: the exact Filter Panel path is not confirmed yet.
Navigation Path: N1, then the Filter Panel and the column filters.

## ETM-8872 (TC-019)
Scenario: The backend refuses a colour save sent by a user without the permission, and nothing is stored.
Precondition: A Job Owner account without the permission Edit Shutdown Logic Table and Visualization (Role & Permission, row R67). A Work row without colour. Dev confirms the permission check exists in the backend.
Navigation Path: No page. The call is the Shutdown Logic Save request, replayed with the Job Owner token (the plan page is N1).

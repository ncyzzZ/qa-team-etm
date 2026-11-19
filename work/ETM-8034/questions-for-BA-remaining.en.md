# ETM-8034 Remaining questions for BA / ux (after the first round of answers)

Story: [Improvement] Shutdown Logic - Row Highlight and Text Color in Gantt Table
Already answered and used in the test cases: see ba-answers.md. These are only the points that are still open. Each one says which test case is affected.

## Blocks an exact Expected Result

1. Permission name: which permission decides whether the two options show? The Story says "Edit Shutdown Logic Table and Visualization"; the Roles & Permissions picture shows "Edit Plan" under Shutdown Timeline (Turnaround Manager yes, Job Owner no). (No-permission cases)
2. Hover, selected and focus look of a highlighted row: how do they layer over the highlight color? (waiting for the ux picture; no test case yet)
3. Condition color mix (disabled cell, validation error over a highlighted row): opacity and which color is on top. (waiting for the ux picture; the condition-color cases only check that the color is still visible)
4. Unsaved-changes modal: exact text and button names, and what each button does to the unsaved color.
5. After a color-only change and Save: which success message appears (same as other Saves)?

## Blocks the way to run a step

6. Gantt table: how does a user move a row (drag, buttons, other)? (color stays after move)
7. Gantt table: how does a user copy and paste a row (action, which level can be pasted where)? (copy/paste does not carry the color)
8. Names of the existing options in the row context menu of the other levels (Platform, Work Header, Work Breakdown). Figma shows only the Work row menu: Highlight Row, Change Text Color, a line, then `Delete Work`.
9. How to produce a disabled cell and a validation error cell in the Gantt table (which field, which action)? Today only the red resource cell from "Delete Resource" is known.
10. Keyboard shortcut for Undo and Redo on this page (the buttons are at the top left of the Gantt toolbar).

## Minor

11. Does a color cell in the submenu show a tooltip or a name on hover?
12. Does choosing the same color again create an extra Undo step?

## Suggestions (not in the Story, no test case unless you say yes)

- S1: a role without the permission calls the save API with a color: should it be rejected?
- S2: a colored row is deleted and Undo restores it: is the color restored?
- S3: colors while Filter Panel or column filters are active.
- S4: when another user saves later and replaces a color, should the first user be told? (answer today: last Save wins, no message)

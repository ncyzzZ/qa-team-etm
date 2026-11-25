# ETM-8388 analyst notes (Table Copy and Paste Support)

Source: story.md only (no comments, no Figma, mockup "To be provided"). Status In Development. Fact = stated in story.md. Rules referenced from other cards are not stated here.

## AC items
- AC-1 (1.1): Ctrl+C / Cmd+C copies selected cells as tab-separated values, pasteable into Excel.
- AC-2 (1.2): Paste in Focus Mode or Edit Mode behaves the same; clipboard mapped across the grid from the active cell as top-left anchor (rule from ETM-7351 AC 2.1).
- AC-3 (1.3): Paste applies only inside the Activity Group of the anchor cell, never into another group (ETM-7351 AC 4.1).
- AC-4 (1.4): User can select and copy cells across more than one Activity Group; group header rows are skipped (activity rows only); paste still stays in the anchor's group (AC-3).
- AC-5 (1.5): Pasted value failing validation is not applied and the cell is cleared; mandatory cell then shows red #FFCCC7 and [ Save ] disabled until fixed; `Paste Validation Failed` modal shown once per paste action (ETM-7351 AC 3.1).
- AC-6 (1.6): A paste sets isDirty = true, same as manual editing.
- AC-7 (2.1, Timeline Status): Copy one or several Status cells down the column; paste into Status column only; value must be Open or Close (case-insensitive) and is converted to official spelling.
- AC-8 (2.1): On Timeline, paste rows beyond the remaining activities in the anchor's group are ignored (no activity added).
- AC-9 (2.2, Timeline weekly copy): Copy a single weekly cell or a range within ONE row, from Plan (%) row or Actual (%) row; selecting two rows at once (Plan+Actual or two activities) is not allowed.
- AC-10 (2.2): Paste only into weekly Actual (%) cells; weekly Plan (%) cells on Timeline are read-only.
- AC-11 (2.2): Pasted values follow weekly Actual (%) rules of ETM-7349 AC 2.4 (truncate to 1 decimal, clamp above 100.0, invalid leaves blank).
- AC-12 (2.2): Values landing in a future week (after Current Week, locked per ETM-7349 AC 2.3) are cut off and not applied.
- AC-13 (3.1, Edit Plan columns): Copy and paste NxN across Activity, Action By, Focal Point, Start Date, End Date; Plan (%) is not part of copy/paste.
- AC-14 (3.1): Activity max 500, Action By max 50, Focal Point max 50: longer values truncated (ETM-7348 AC 3.1).
- AC-15 (3.1): Start/End Date accept `D Mon YYYY` or `DD Mon YYYY`, otherwise not applied; Start <= End applies (ETM-7348 AC 4.3); empty mandatory cell red and [ Save ] disabled (ETM-7348 AC 4.2).
- AC-16 (3.1): Pasting Start/End Date recalculates that activity's weekly Plan (%) (ETM-8405 AC 3).
- AC-17 (3.1): Automatic Activity Creation: extra pasted rows add new activities at the bottom of the anchor's group; defaults Plan (%) 0.0, Status Open (ETM-7348 AC 2.1); unpasted fields stay empty (ETM-7351 AC 4.2).
- AC-18 (3.2, Edit Plan weekly): Copy a single weekly cell or range within ONE row, from Plan (%) or Actual (%) row.
- AC-19 (3.2): Paste only into weekly Plan (%) cells, per ETM-8405 AC 1.5 input rules.
- AC-20 (3.2): Only weeks within the activity's Start-End Date are editable (ETM-8405 AC 1.1); pasted values outside the range are cut off, not applied.
- AC-21 (3.2): After paste, activity Plan (%) = sum of its weekly values (ETM-8405 AC 2).
- Pre-conditions (not numbered AC): Timeline needs View Timeline + Update Progress and Note; Edit Plan needs View Timeline + Edit Plan.

## Could still break
- Fact gap: AC-2 says Focus Mode and Edit Mode paste "behave the same", but the exact way a paste in Edit Mode (text inside a cell) differs from grid paste is not described. Risk: a one-value paste into an open text cell vs a grid paste.
- AC-5 modal is shown "once per paste action" but one paste can mix valid and invalid cells; which cells are applied (partial apply or all-or-nothing)?
- AC-5 "cell is cleared" overwrites the old value: user loses the previous value of a non-mandatory cell on a failed paste.
- AC-4 copy across groups drops header rows, so the pasted block is shorter than the visual selection; with AC-17 extra rows then create new activities; mix of group order and different row counts per group.
- AC-3 + AC-17: paste larger than the group on Edit Plan adds activities; on Timeline (AC-8) extra rows are silently ignored. No message stated for the ignored rows.
- AC-12 / AC-20 "cut off": paste block partly crossing a boundary (week locked, week outside range, last column): the rest is applied? Is a modal shown for cut-off values or only for invalid ones?
- AC-9 / AC-18: selecting two rows is "not allowed", but the behaviour is not stated (blocked selection, blocked copy, silent?).
- AC-10: user copies from Plan (%) row on Timeline and pastes into Actual (%) row: allowed (values go to Actual) or only Actual-to-Actual? Same for Edit Plan with Actual row copied into Plan row.
- AC-7: Status values with spaces, Thai, "OPEN ", empty cell, a Status already Close (is Close locked on Timeline?).
- AC-13 NxN: paste spanning a mix of text and date columns; date text from Excel (serial numbers, `2025-11-03`, Thai calendar year), Start Date after End Date after paste (not applied which one?).
- AC-14: truncation vs the AC-5 "not applied and cleared" rule: truncate is applied, not cleared; check the modal does not appear for truncation.
- AC-16 + AC-21: paste of dates and of weekly cells in the same block: order of recalculation, one overwrites the other; AC-21 sum may exceed 100.0 per ETM-8405 and Total Progress then blocks Save.
- AC-17: new rows created by paste when Start/End dates are pasted too; new activities missing mandatory fields are red and block Save; new activity Plan (%) 0.0 changes group totals.
- AC-6: paste identical to current value still marks dirty; undo (Ctrl+Z) not described.
- Large paste (hundreds of rows from Excel), Excel cells with line breaks or quotes, Windows vs Mac shortcuts (Cmd), browsers without clipboard permission.
- Permissions: user without Update Progress or Edit Plan pastes; read-only users still able to copy (AC-1).
- ETM-8550 keyboard navigation: no AC in this Story covers keyboard navigation (arrow, Tab, Shift+arrow range select, Enter, Esc); the Focus Mode vs Edit Mode in AC-2 depends on it.
- Project note (docs/modules/shutdown-timeline.md line 64): earlier decision "Excel paste, keyboard-only not wanted" (ETM-7348, 3 Nov); now this Story brings both in scope. Check it is still valid.

## Open questions
1. Missing - ask: Which rules are only referenced and not stated? ETM-7351 AC 2.1, 3.1, 4.1, 4.2; ETM-7348 AC 2.1, 3.1, 4.2, 4.3; ETM-7349 AC 2.3, 2.4; ETM-8405 AC 1.1, 1.5, 2, 3. Should the test cases follow the current text of each, and is the Story's AC the latest where they differ?
2. Missing - ask: Content of the `Paste Validation Failed` modal (title, message, which cells or counts listed, buttons, close behaviour) and whether Timeline and Edit Plan use the same modal. Figma is "To be provided".
3. Missing - ask: Is paste partial (valid cells applied, invalid cleared) or all-or-nothing? Does the modal appear when values are only truncated, clamped, cut off (future week, out of range) or ignored (extra rows on Timeline)?
4. Missing - ask: Copy Across Activity Groups (AC-4): when pasted into one group, are the rows from the second group appended to the anchor's group (so activities are created on Edit Plan), ignored, or does the user get a message? Is it the same on Timeline?
5. Missing - ask: Is a paste into the weekly Actual row from a copied Plan row allowed (and Plan row to Actual row on Edit Plan)?
6. Missing - ask: ETM-8550 keyboard navigation scope: which keys (arrows, Tab, Enter, Esc, Shift+arrow, Ctrl+A, Delete), where it applies (both screens, all columns incl. weekly), and how it moves between Focus Mode and Edit Mode. No AC lists it; should it be tested under this Story?
7. Missing - ask: What happens when the user tries to select two rows together in weekly cells (AC-9, AC-18): selection blocked, copy blocked, or paste blocked, and any message?
8. Missing - ask: On Timeline, can Status paste be applied to a Close/locked activity, and what is "official spelling" for a blank clipboard cell?
9. Missing - ask: Is Ctrl+Z / undo of a paste expected? And does Delete/Backspace on a selected range clear cells (same validation as paste)?
10. Missing - ask: Edit Plan paste with an Excel date in another format (e.g. 2025-11-03, 03/11/2025): is it "not applied" and cleared, with the modal?
11. Missing - ask: Is there a maximum number of pasted rows or columns, and is large Excel data (100+ rows) in scope?
12. Missing - ask: Are Plan (%) on Edit Plan and Actual Status/Remark columns outside paste (cell ignored, column skipped, or the paste blocked when the block spans them)?
13. Suggestion (not in Story): Confirm the earlier "Excel paste and keyboard-only not wanted" note (ETM-7348) is replaced by this Story.

## [QA] subtasks
- ETM-8570 [QA] Create Test Case Manual Test (In Progress): exists, reuse. Proposed Original Estimate: 8h (21 AC items, two screens, many cross-card rules, no Figma).
- ETM-8572 [QA] Execute Test Case Manual Test (Open): exists, reuse. Proposed Original Estimate: 6h (depends on case count, about 40-60 cases; needs clipboard data prepared in Excel).
- No duplicates found. ETM-8549, ETM-8550, ETM-8551 are [FE] subtasks, not QA.

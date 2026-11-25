# Draft test cases: ETM-6373 Optimization Feedback Display Panel

Story: ETM-6373 Optimization Feedback Display Panel (frozen exam copy, no analyst.md / inspector.md, so AC ids below are numbered by me from the Story outline: AC-1.1.1 = section 1, item 1, sub-item 1, and so on).
Source: story.md, docs/modules/shutdown-logic.md, knowledge/.
Existing [QA] subtasks: none known.
Common precondition: user TM (can do everything, has Execute Optimization) is logged in; the active Turnaround Plan is open on the View Shutdown Logic page (Gantt Chart view); the Manpower Resource histogram is collapsed (button `Hide histogram`, again after every reload). Role JO is view only and has no Execute Optimization.
Notation: `->` separates action and expected result. Priority is by damage (the Story gives none).

## Think like the user (3 lines)
- Who: the Turnaround Manager runs optimization many times a day and reads the result to find out why a schedule failed.
- Wants: see success or failure at once, read the errors, send them out as Excel.
- Careless user: runs again before reading, cancels a run, opens the panel with no run done, clicks Export twice, a colleague without the permission opens the same page.

## Coverage map
| Requirement / screen state | Technique | Risk | Cases |
|---|---|---|---|
| AC-1.1.1 No toolbar before first run | State | Toolbar shown with nothing to show | TC-001 |
| AC-1.1.2 Toolbar appears after a run, stays until next run | State transition | Toolbar missing or lost after reload/leaving page | TC-002, TC-003 |
| AC-1.1.3 Failed run enables Save | State | Failed result cannot be saved, or Save stays off | TC-004 |
| AC-1.1.4 Cancelled run changes nothing [NEG] | State, negative | Toolbar or results replaced by a cancelled run | TC-005, TC-006 |
| AC-1.2 Panel does not open by itself | State | Panel covers the Gantt after a run | TC-007 |
| AC-1.3 Success display (Summary: Duration, Gap, Schedule/Event dates; Optimization Setting) | Equivalence | Wrong or missing summary values | TC-008 |
| AC-1.4 Failure display (no banner, tabs Diagnosis and Optimization Setting, stacked blocks) | Equivalence | Banner shown, wrong tab, blocks missing | TC-009 |
| AC-2.1 Severity tag colours | Decision table | Wrong colour or text | TC-010 |
| AC-2.2 validate_input defaults to `error` | Boundary of data (field missing) | Empty tag | TC-011 |
| AC-2.3 One block per item of errors, blockers, infeasibility_hints, in order | Data table, count | Block lost, mixed up, wrong order | TC-012, TC-013 |
| AC-2.4 Excluded fields not shown [NEG] | Negative | Technical data leaks to the user | TC-014 |
| AC-3.1 Block format and field mapping | Field mapping | Wrong text in wrong place | TC-015 (open question Q1) |
| AC-4.1, AC-4.2 Task UUID mapped to `(No.) Job Description`, comma separated | Mapping | Raw UUID shown, wrong task, wrong separator | TC-016, TC-017 |
| AC-4.1 Unknown UUID (not in Gantt) [NEG] | Boundary | Blank or crash | TC-018 |
| AC-4.3 Full label, no truncation | Boundary, long text | Ellipsis hides the task | TC-019 |
| AC-4.4 No navigation | Negative | Click on task jumps or errors | TC-020 |
| AC-5.1 Export button in panel header | Presence | Button missing | TC-021 |
| AC-5.2.1 Permission lock [NEG] | Permission | User without Execute Optimization can export or see panel | TC-022 |
| AC-5.2.2 Export enabled with errors, Excel downloads | Positive, double click | No file, wrong file, two files | TC-023, TC-024 |
| AC-5.2.3 Export disabled with zero errors | State | Empty Excel created | TC-025 |
| Precondition: run done for the active plan; permission to view toolbar | Permission | Toolbar visible without permission | TC-022 |
| Screen state: very many blocks | Volume | Panel cannot scroll, slow | TC-026 |
| Screen state: loading (run in progress) | State | Old result shown as new | TC-027 |
| Screen state: close panel | Close | Panel cannot be closed, state lost | TC-028 |
| Next run replaces old result | State | Old blocks stay | TC-029 |
| Strange text inside messages (Thai, long, symbols) | Lesson 4 | Layout broken | TC-030 |
| Two users, same plan | Lesson 1 | See question Q6 | TC-031, TC-040 |
| AC-1.1.2 Toolbar and Save after success; leaving and returning, other plan | State | Stale or lost toolbar | TC-002, TC-035, TC-036 |
| AC-1.1.3 Save after failed run: Save, reload, undo, leave warning | Unsaved changes | Data change or silent loss | TC-004, TC-033, TC-034 |
| AC-1.1.4 First run cancelled, cancel then normal run | State | Toolbar after first cancel; next run blocked | TC-037, TC-005 |
| Export kinds of blocks and fail/success sequence | Decision table, state | Stale Export state | TC-025, TC-032 |
| Q9 empty arrays, task renamed or deleted after run | Boundary, linked data | Crash or raw UUID | TC-039, TC-038 |

## Lessons and categories
1 Two people at once: relevant, TC-031. 2 Filter+Sort+Search: not relevant, the panel has none. 3 Old data after migrations: not relevant, the payload is created by each run. 4 Strange input: relevant, TC-030 (messages and Job Descriptions are text from the optimizer and the plan). 5 Reordering: not relevant, order is the order of the response arrays (TC-013). 6 Linked data: relevant, TC-016 and TC-018 (Gantt tasks renamed or deleted after the run). 7 Dependent charts: not relevant, no chart in the panel. 8 Same data on many pages: relevant, TC-017 (No. and Job Description must equal the Gantt table). 9 Matrix: relevant, severity and state tables in TC-010 and TC-025. L-1 text sort: not relevant, no sorted list. L-2 choice not kept: relevant, TC-003. L-3 read too early: relevant, wait for the run to finish (TC-027). L-4 paste, L-5 collapse levels, L-6 case variants: not relevant. L-7 selected state: relevant, the active tab (TC-009). L-8 Story text changed: note, the frozen description is used; compare with Jira changelog before a real run.

## Counts
High 21, Medium 13, Low 6 (40 cases). Auto 26, Partial 11, Manual 3.

## Open questions
- Q1 (Missing - ask): the Story says "follow this exact display format and field mapping" but the table is not in the text (image removed). Which fields (for example message, code, stage) appear in which line of the block? TC-015 uses placeholders and cannot be finished without it.
- Q2 (Missing - ask): which `severity` values exist besides `Error` (red) and `Blocker` (orange)? Colour for infeasibility hints and any other value?
- Q3 (Missing - ask): how does a user cancel an optimization and is there a cancel button state? TC-005 and TC-006 assume it exists on the page.
- Q4 (Missing - ask): "Save button is triggered to enable" when the run fails: does Save stay enabled after the user saves, and what does Save save when the run failed (the old result)?
- Q5 (Missing - ask): "disabled and greyed out (or hidden)" for Export with zero errors: which one? TC-025 accepts either until answered.
- Q6 (Missing - ask): is the optimization result shared between users of the same plan, or only on the screen of the person who ran it? Decides TC-031.
- Q7 (Missing - ask): is the toolbar still shown after reload or after leaving and returning to the page? The Story says "until the user runs a new optimization" only.
- Q8 (Missing - ask): is a failed run that has only blockers (no errors) counted as "error blocks" for Export? TC-023 uses errors only.
- Q9 (Missing - ask): what does the panel show when a run fails with no items in any array?
- Q10 (Missing - ask): what is shown for a task id that is not in the Gantt data (deleted or unknown)? TC-018 and TC-038 assume skipped or marked as unknown, never a raw UUID.
- Q11 (Missing - ask): is the toolbar hidden for a user without Execute Optimization, or only Export locked? TC-022 assumes no toolbar and no Save for JO.
- Q12 (Missing - ask): after a successful run is `Save` enabled? The Story only says Save is enabled after a failed run. TC-002 assumes enabled because the schedule changed.
- Q13 (Missing - ask): number format of Duration and Gap, and which Optimization Setting fields accept free text (TC-008, TC-030).
- Assumed answers are written in the steps of TC-002, TC-003, TC-004, TC-022, TC-025, TC-031 and TC-035 with the question number, so they can be corrected after the BA answers.
- Suggestion (not in Story): a close (X) behaviour and keyboard Esc for the panel; copy of block text. Not written as cases.

## Test cases (40 flows)

### TC-001 [FE][MT] Verify no toolbar appears before the first optimization run (POS) [Auto]
Precondition: common; the page was just opened and no optimization has been run since opening
Priority: High
Trace: AC-1.1.1
1. Open the View Shutdown Logic page of the active plan. -> The Gantt Chart view opens.
2. Look at the area where the toolbar with `Save` and `View Detail` would be. -> No such toolbar is shown; the links `View Detail` and `View Diagnosis` and the `Save` button do not exist on the page.
Automation: Starting data: active plan with no run in the session. Check: the toolbar element count is 0. Clean up: none.

### TC-002 [FE][MT] Verify the toolbar appears after a successful run (POS) [Auto]
Precondition: common; a plan that optimizes successfully
Priority: High
Trace: AC-1.1.2, AC-1.3
1. Run the optimization. -> The run finishes.
2. Look at the toolbar. -> A toolbar appears with the link `View Detail` and the `Save` button.
3. Look at the right side of the page. -> The right-side panel is not open.
4. Look at the `Save` button. -> `Save` is enabled, because the run changed the schedule and there is something to save (assumed, question Q12).
Automation: Starting data: plan that gives success. Check: link and button visible, Save enabled, panel hidden. Clean up: none.

### TC-003 [FE][MT] Verify the toolbar stays until a new run and is not lost on page actions (POS) [Auto]
Precondition: common; one run has finished
Priority: Medium
Trace: AC-1.1.2
1. Run the optimization. -> The toolbar with `View Detail` and `Save` appears.
2. Click `View Detail`, then close the panel. -> The toolbar is still shown.
3. Switch to another tab of the page and back. -> The toolbar is still shown.
4. Run the optimization again. -> The toolbar is shown again and now shows the result of the new run.
5. Reload the page. -> The page opens like the first time: no toolbar, no `Save` from the old run and the panel is closed (assumed, question Q7).

### TC-004 [FE][MT] Verify a failed run shows `View Diagnosis` and enables Save (POS) [Auto]
Precondition: common; a plan that fails optimization (for example a task with a capacity blocker); the plan was saved before the run, so Save is disabled
Priority: High
Trace: AC-1.1.2, AC-1.1.3
1. Check the `Save` button before the run. -> `Save` is disabled.
2. Run the optimization. -> The run finishes with a failure.
3. Look at the toolbar. -> The toolbar shows the link `View Diagnosis` and the `Save` button.
4. Look at the `Save` button. -> `Save` is enabled.
5. Look at the Gantt Chart. -> The schedule is unchanged from before the run.
6. Click `Save`. -> The plan is saved with the values it had before the run; no failed result is written into it (assumed, question Q4).
7. Reload the page. -> The plan shows the same task dates and times as before the run, with no day shift; `Save` is disabled because nothing is left to save.
Automation: Starting data: card-owned plan that always fails. Check: Save enabled, Gantt rows unchanged after run, after Save and after reload. Clean up: none.

### TC-005 [FE][MT] Verify cancelling a run that returns no result leaves the toolbar unchanged (NEG) [Partial: depends on timing of cancel]
Precondition: common; a previous run finished, so the toolbar shows `View Detail` and `Save`
Priority: High
Trace: AC-1.1.4
1. Open the panel and write down the Summary values (Duration, Gap). -> The values are written down for comparison.
2. Close the panel. -> The panel closes.
3. Start a new optimization and cancel it before it finishes. -> The run stops.
4. Look at the toolbar. -> The toolbar is the same as before, with the same link text and the same `Save` state.
5. Open the panel. -> The Summary values are the same as the ones written down.
6. Close the panel and compare the Gantt rows (dates of the tasks) with the state before the cancelled run. -> The Gantt schedule is unchanged.
7. Run the optimization again and let it finish. -> The toolbar and the panel now show the result of this new run, so a cancelled run did not block the next normal run.

### TC-006 [FE][MT] Verify cancelling a run that still returns a result does not update the toolbar (NEG) [Partial: depends on timing of cancel]
Precondition: common; a previous run failed, so the toolbar shows `View Diagnosis`
Priority: High
Trace: AC-1.1.4
1. Open the panel and write down the number of blocks under Diagnosis. -> The number is written down.
2. Close the panel, start a new optimization that would succeed, and cancel it just before it ends. -> The run stops.
3. Look at the toolbar. -> The toolbar still shows `View Diagnosis`, not `View Detail`.
4. Open the panel. -> The Diagnosis tab shows the same number of blocks as written down.

### TC-007 [FE][MT] Verify the panel does not open by itself after a run (POS) [Auto]
Precondition: common; a plan with a failing run and a plan with a successful run
Priority: Medium
Trace: AC-1.2
1. Run the optimization on the failing plan. -> The run finishes.
2. Look at the right side of the page. -> The panel is not open.
3. Run the optimization on the successful plan. -> The run finishes.
4. Look at the right side of the page. -> The panel is not open.
Automation: Data set: two plans (fail, success). Check: panel not in the page. Clean up: none.

### TC-008 [FE][MT] Verify the panel content after a successful run (POS) [Partial: values need the optimizer payload for comparison]
Precondition: common; a plan that optimizes successfully
Priority: High
Trace: AC-1.3
1. Run the optimization. -> The toolbar appears.
2. Click `View Detail`. -> The right-side panel opens.
3. Look at the panel. -> The Summary section shows Duration, Gap and the Schedule/Event dates; the sent settings are shown as `Optimization Setting`.
4. Compare Duration, Gap and dates with the values of the optimizer response. -> Each value equals the response value.
5. Look for any error block. -> No Feedback Block is shown.
6. Close the panel, change one value in the optimization setting on the page, open the panel again and click `Optimization Setting`. -> The tab still shows the settings that were sent with the run, not the changed value.
7. Compare Duration and Gap with the number format of other number columns on the page. -> They use the same thousand separator and decimal places (question Q13 if the format is not agreed).
8. Compare Schedule start and end dates with the Gantt Chart and the Event Details page. -> The dates are the same, with no day shift.
9. Check the Gantt Chart after this successful run. -> The Gantt schedule shows the new dates from the run.

### TC-009 [FE][MT] Verify the panel content after a failed run (POS) [Auto]
Precondition: common; a plan that fails with at least one error and one blocker
Priority: High
Trace: AC-1.4, AC-2.3
1. Run the optimization. -> The run finishes with a failure.
2. Click `View Diagnosis`. -> The right-side panel opens.
3. Look at the top of the panel. -> No banner is shown; the tabs `Diagnosis` and `Optimization Setting` are shown.
4. Look at the selected tab. -> `Diagnosis` is selected and shows Feedback Blocks stacked one under another; the number of blocks equals the number of items of `detail.errors`, `detail.blockers` and `result.summary.infeasibility_hints` of the payload.
5. Click `Optimization Setting`. -> The sent settings are shown and the tab is marked as selected.
6. Close the panel and open it again. -> The panel opens on the `Diagnosis` tab; record the answer for the question about remembering the tab.
Automation: Starting data: card-owned failing plan. Check: tab names, no banner element, block count equals payload. Clean up: none.

### TC-010 [FE][MT] Verify the severity tag text and colour for each severity (POS) [Auto]
Precondition: common; failing runs that return an error, a blocker and an infeasibility hint
Priority: High
Trace: AC-2.1
1. Open the panel of a run with one block of each type. -> Three blocks are stacked.
2. Check each block tag against the table. -> Each tag shows the text and colour of its row; no tag is empty and no tag shows `undefined`.

| Source item | Tag text | Colour |
|---|---|---|
| severity Error | Error | red |
| severity Blocker | Blocker | orange |
| infeasibility hint | a non-empty tag text (exact text per Q2) | a colour that differs from the red of Error and the orange of Blocker (exact colour per Q2) |

The test loops over every row of the table.
Automation: Starting data: mocked or card-owned payloads. Clean up: none.

### TC-011 [FE][MT] Verify a block from the validate_input stage shows severity `error` (BND) [Auto]
Precondition: common; a run that fails at the validate_input stage, so the payload has no `severity` field
Priority: High
Trace: AC-2.2
1. Run the optimization. -> The run fails.
2. Click `View Diagnosis`. -> The panel opens.
3. Look at the tag of each block. -> Each tag shows `error` in the error style; no tag is empty or shows `undefined`.
Automation: Starting data: payload without severity. Check: tag text. Clean up: none.

### TC-012 [FE][MT] Verify one block is shown for every item of the three response arrays (POS) [Auto]
Precondition: common; runs with 1 item in `detail.errors`, 2 in `detail.blockers`, 3 in `result.summary.infeasibility_hints`
Priority: High
Trace: AC-2.3
1. Open the panel of the run with only errors. -> 1 block is shown.
2. Open the panel of the run with only blockers. -> 2 blocks are shown.
3. Open the panel of the run with only infeasibility hints. -> 3 blocks are shown.
4. Open the panel of a run with all three arrays. -> 6 blocks are shown, stacked vertically, none missing and none repeated.
Automation: Data set: the four payloads. Check: block count equals the sum of the array lengths. Clean up: none.

### TC-013 [FE][MT] Verify the order of stacked blocks follows the response (POS) [Partial: order rule across arrays is not written]
Precondition: common; a run with errors, blockers and hints
Priority: Low
Trace: AC-2.3
1. Open the panel. -> The blocks are stacked vertically.
2. Compare the order of the blocks with the order in the response. -> The order is the same; record the order between arrays for question Q2.

### TC-014 [FE][MT] Verify excluded fields and items are not shown (NEG) [Auto]
Precondition: common; a payload that contains `disclosures[]`, critical-path drops, `details`, `evidence`, `loc` and `input`, each with a unique text
Priority: High
Trace: AC-2.4
1. Run the optimization and click `View Diagnosis`. -> The panel opens.
2. Search the panel text for each unique text of `details`, `evidence`, `loc` and `input`. -> None of them is found.
3. Search the panel text for the unique text of `disclosures` and of the critical-path drops. -> None of them is found, and no block exists for them.
4. Check the block count. -> It equals the count of the three arrays only.
5. Click `Export` and open the file. -> None of the unique texts of `details`, `evidence`, `loc`, `input`, `disclosures` or the critical-path drops is in the file.
Automation: Data set: payload with marker texts. Check: marker texts absent. Clean up: none.

### TC-015 [FE][MT] Verify the block layout and field mapping (POS) [Partial: the exact format is missing from the Story, question Q1]
Precondition: common; a failing run with one error that has a message and affected tasks
Priority: High
Trace: AC-3.1
1. Open the panel. -> One block is shown.
2. Compare the block, line by line, with the format given by the BA. -> Tag at the top, main message in the middle, affected tasks at the bottom; the main message equals the `message` text of the payload character for character; no JSON key name, brace or `undefined` is shown. The mapping of any further line is finished when Q1 is answered.

### TC-016 [FE][MT] Verify task UUIDs are shown as `(No.) Job Description` separated by commas (POS) [Auto]
Precondition: common; a failing run whose block has `task_ids` with 3 UUIDs; the Gantt table has these tasks with known No. and Job Description
Priority: High
Trace: AC-4.1, AC-4.2
1. Open the panel and look at the bottom of the block. -> The tasks are shown as plain text in one line, in the form `(No.) Job Description`, separated by commas; no raw UUID is shown.
2. Compare each entry with the Gantt table row of that task. -> The No. and the Job Description are the same as in the table.
3. Click one of the entries. -> Nothing happens; it is plain text, not a link.
Automation: Starting data: payload with 3 known task ids. Check: text equals expected string. Clean up: none.

### TC-017 [FE][MT] Verify each of the three id fields is mapped (POS) [Auto]
Precondition: common; payloads with `task_id` (1 value), `task_ids` (2 values) and `dropped_task_ids` (2 values)
Priority: High
Trace: AC-4.1, AC-4.2
1. Open the panel of each payload. -> The block of each field shows its tasks at the bottom.

| Field | Number of ids | Expected text |
|---|---|---|
| task_id | 1 | one entry `(No.) Job Description` |
| task_ids | 2 | two entries separated by a comma |
| dropped_task_ids | 2 | two entries separated by a comma |

The test loops over every row of the table.
Automation: Clean up: none.

### TC-018 [FE][MT] Verify a task id that is not in the Gantt data (NEG) [Partial: expected text is not defined, question Q10]
Precondition: common; a failing run with one id that is not in the Gantt table and one that is; case B: a task shown in the block is deleted from the Gantt after the run
Priority: Medium
Trace: AC-4.1
1. Open the panel. -> The block is shown and the page does not break.
2. Look at the affected tasks. -> The known task shows `(No.) Job Description`; the unknown id shows no raw UUID, no `undefined` and no empty comma; it is skipped or marked as unknown (exact text per question Q10).

### TC-019 [FE][MT] Verify a very long Job Description is shown in full (BND) [Auto]
Precondition: common; a task with a Job Description at the maximum length allowed in the plan, in a failing run
Priority: Medium
Trace: AC-4.3
1. Open the panel. -> The block shows the task.
2. Read the entry. -> The full text is shown, ending with the last character of the Job Description; there are no `...` and no cut-off.
3. Look at the panel width. -> The text wraps to the next line; there is no horizontal scroll bar for the label.
Automation: Starting data: card-owned task with long description. Check: text equals the full string. Clean up: restore description.

### TC-020 [FE][MT] Verify there is no navigation from a task entry (NEG) [Auto]
Precondition: common; a failing run with affected tasks
Priority: Low
Trace: AC-4.4
1. Click a task entry in the block. -> Nothing happens; the Gantt does not scroll or select a row.
2. Hover over the entry. -> The pointer does not change to a link pointer and no link style is shown.

### TC-021 [FE][MT] Verify the Export button is in the panel header (POS) [Auto]
Precondition: common; a failing run
Priority: Medium
Trace: AC-5.1
1. Open the panel. -> The panel opens.
2. Look at the header. -> The `Export` button is shown in the header, outside the tab content.
3. Switch between the two tabs. -> The `Export` button stays in the header.

### TC-022 [FE][MT] Verify a user without Execute Optimization cannot use the feature (NEG) [Auto]
Precondition: user JO (view only, no Execute Optimization) logged in; a run exists for the plan
Priority: High
Trace: AC-5.2.1
1. Open the View Shutdown Logic page. -> The page opens.
2. Look for the optimization button and the toolbar. -> JO has no optimization button and sees no toolbar of a run made by someone else (assumed, question Q11).
3. Look for the `Save` button and the `Export` button. -> `Save` is absent or disabled and no leave warning appears when JO leaves the page; `Export` is not enabled and no file can be downloaded.
4. Log in as TM and open the same page. -> `Export` is available for the failed result.

### TC-023 [FE][BE][MT] Verify Export downloads an Excel file when the run has errors (POS) [Auto]
Precondition: common; a failing run with 2 error blocks
Priority: High
Trace: AC-5.2.2
1. Open the panel. -> The `Export` button is enabled.
2. Click `Export`. -> An Excel file (.xlsx) is downloaded.
3. Open the file. -> It follows the layout of ETM-6506 and holds one row for each error block; the count equals the number of blocks.
4. Compare the task text of each row with the Gantt table. -> The task text is `(No.) Job Description` as in the Gantt table; no raw UUID.
Automation: Starting data: card-owned failing plan. Check: download event, file extension, row count, task text. Clean up: delete downloaded file.

### TC-024 [FE][MT] Verify a double click on Export gives one file (NEG) [Partial: the browser may ask before the second download]
Precondition: common; a failing run
Priority: Medium
Trace: AC-5.2.2
1. Open the panel. -> `Export` is enabled.
2. Double click `Export`. -> Only one file is downloaded; no error message appears and the page still works.

### TC-025 [FE][MT] Verify Export state for success, error-only, blocker-only and mixed runs (BND) [Auto]
Precondition: common; four payloads: success with zero blocks, one error, one blocker only, one error plus one blocker
Priority: High
Trace: AC-5.2.2, AC-5.2.3
1. For each row of the table, run the optimization and open the panel. -> The panel opens.
2. Check `Export` against the table. -> `Export` has the state of its row; when it is not enabled, a click does nothing and no file is downloaded.

| Payload | Export | File rows |
|---|---|---|
| success, zero blocks | disabled and greyed out, or hidden (question Q5) | no file |
| one error | enabled | 1 row |
| blocker only | disabled (blockers are not error blocks, question Q8) | no file |
| one error plus one blocker | enabled | 1 row, for the error only |

The test loops over every row of the table.
Automation: Data set: four payloads. Check: Export state, download and row count. Clean up: delete downloaded files.

### TC-032 [FE][MT] Verify Export state follows the latest run, failed to success and success to failed (NEG) [Auto]
Precondition: common; one plan that can give a failing run and a successful run
Priority: High
Trace: AC-5.2.2, AC-5.2.3, AC-1.1.2
1. Run a failing optimization and open the panel. -> `Export` is enabled.
2. Close the panel, fix the data and run a successful optimization, then open the panel. -> `Export` is disabled or hidden; the old errors are not shown.
3. Close the panel, break the data and run a failing optimization again, then open the panel. -> `Export` is enabled again and shows the new errors.
Automation: Data set: fail then success then fail. Check: Export state after each run. Clean up: restore the data.

### TC-026 [FE][MT] Verify the panel with a very large number of blocks (BND) [Manual: judging speed and scroll by eye]
Precondition: common; a payload with 200 blocks
Priority: Low
Trace: none (screen state: very many rows)
1. Open the panel. -> The panel opens without freezing the page.
2. Scroll to the last block. -> The last block is reachable and every block shows tag, message and tasks.
3. Click `Export`. -> The file holds 200 rows.

### TC-027 [FE][MT] Verify the panel while a new run is in progress (POS) [Partial: needs a slow run]
Precondition: common; a previous run finished
Priority: Medium
Trace: AC-1.1.2
1. Start a new optimization. -> The run is in progress.
2. Open the panel while it runs. -> The panel shows either a loading state or the previous result, never a mix of both.
3. Wait for the run to finish. -> The panel shows only the new result.

### TC-028 [FE][MT] Verify closing the panel (POS) [Auto]
Precondition: common; a failing run
Priority: Low
Trace: none (close behaviour of the panel)
1. Open the panel and close it with its close control. -> The panel closes and the Gantt is fully visible.
2. Click `View Diagnosis` again. -> The panel opens with the same blocks.

### TC-029 [FE][MT] Verify a new run replaces the old blocks (POS) [Auto]
Precondition: common; a failing run with 3 blocks was done, then data was fixed so that the next run fails with 1 block
Priority: High
Trace: AC-1.1.2, AC-1.4
1. Open the panel and record the block count. -> The count is 3.
2. Close the panel and run the optimization again. -> The run finishes with a failure.
3. Open the panel. -> Only 1 block is shown; none of the old 3 blocks stays.

### TC-030 [FE][MT] Verify strange text in messages and Job Descriptions (Exotic: strange input) [Auto]
Precondition: common; failing run whose message and task Job Description use the data set below
Priority: Medium
Trace: none (strange input in text from the optimizer and the plan)
1. Put each row of the data set in the `message` of a block, in a Job Description of an affected task and in each free-text field of the Optimization Setting, if any (question Q13), run and open the panel. -> The text is shown as it is in the main message, in the affected tasks and in the `Optimization Setting` tab, without cut-off, the layout is not broken and nothing runs as code.
2. Click `Export` and open the file. -> The same text is in the file unchanged, with no broken characters.

| Value | Example |
|---|---|
| Thai text | ตรวจสอบงานซ่อมบำรุง |
| Special characters | `<b>A&B</b> "x" 50%` |
| Emoji | two emoji in a row |
| Very long word without spaces | 200 characters |
| New line | text with a line break |

The test loops over every row of the table.

### TC-031 [FE][MT] Verify two users on the same plan (Exotic: two users) [Manual: needs two real sessions and the answer to Q6]
Precondition: two TM users on the same active plan
Priority: Low
Trace: none (lesson 1, two people at once)
1. User A runs the optimization. -> The toolbar appears for user A.
2. Look at the page of user B without reloading. -> No toolbar of user A's run appears for B, because the result belongs to the screen of the person who ran it (assumed, question Q6).
3. User B runs the optimization at the same time. -> Each user sees a clear result; no error message with technical text.

### TC-033 [FE][MT] Verify undoing a change by hand after a failed run (Exotic: undo by hand) [Auto]
Precondition: common; a failing run was done and `Save` is enabled
Priority: Medium
Trace: AC-1.1.3
1. Change a task date by hand, then set it back to the original value. -> The task shows its original date.
2. Look at the `Save` button. -> `Save` is disabled when nothing differs from the saved plan; if it stays enabled, the answer to question Q4 decides.
3. Click `Save` if it is enabled. -> No change is written and a message does not claim that something was saved with new values.

### TC-034 [FE][MT] Verify a warning when leaving with Save enabled (NEG) [Auto]
Precondition: common; a failing run was done and `Save` is enabled
Priority: High
Trace: AC-1.1.3
1. Click a breadcrumb item or a menu item to leave the page. -> A warning about unsaved changes is shown; staying keeps the page and the toolbar.
2. Use the browser Back button. -> The same warning is shown.
3. Open the same page in a view where `Save` is disabled and leave it. -> No warning is shown.
4. Open the panel, switch tabs and close it, then look at `Save`. -> The `Save` state is the same as before opening the panel.

### TC-035 [FE][MT] Verify the toolbar and panel after leaving and coming back (POS) [Partial: Back and forward behaviour depends on question Q7]
Precondition: common; one run finished and the panel is open
Priority: Medium
Trace: AC-1.1.2, AC-1.2
1. Open a task detail or edit page from the Gantt and return with the browser Back button. -> The toolbar of the last run is still shown (assumed from "until a new run", question Q7) and the panel is closed.
2. Go to another menu item through the breadcrumb and come back. -> The page opens in its normal state: the panel is closed and no stale result of another visit is shown as new.
3. Press the browser forward button. -> The page works and shows the same state as in step 2.
4. Reload the page while the panel is open. -> The panel is closed after the reload.

### TC-036 [FE][MT] Verify a result of one plan or event is not shown on another (NEG) [Auto]
Precondition: common; a run finished on plan A; a second plan B exists
Priority: High
Trace: AC-1.1.2
1. Switch to plan B of the same event, or open the View Shutdown Logic page of another event. -> The page of plan B or of the other event shows no toolbar and no `View Detail` or `View Diagnosis` link from plan A.
2. Switch back to plan A. -> The toolbar of plan A is shown again with its own link and `Save` state (assumed from "until a new run", question Q7); no result of plan B is mixed in.

### TC-037 [FE][MT] Verify the first run cancelled shows no toolbar (NEG) [Partial: depends on timing of cancel]
Precondition: common; the page was just opened and no run was done
Priority: Medium
Trace: AC-1.1.1, AC-1.1.4
1. Start the first optimization and cancel it before it finishes. -> The run stops.
2. Look at the toolbar area. -> No toolbar, no `Save` and no panel link are shown, the same as before the first run.

### TC-038 [FE][MT] Verify the task label follows a rename, renumber or delete after the run (NEG) [Auto]
Precondition: common; a failing run with a block whose affected tasks are known; the run is not repeated
Priority: Medium
Trace: AC-4.1
1. Rename the Job Description of one affected task in the Gantt, open the panel. -> The block shows the new Job Description for that task.
2. Change the No. of that task (renumber), open the panel. -> The block shows `(No.)` with the new number.
3. Delete that task from the Gantt, open the panel. -> The entry for it is skipped or marked as unknown (question Q10); no raw UUID and no `undefined` is shown.
Automation: Starting data: card-owned plan. Check: label text after each change. Clean up: restore the task.

### TC-039 [FE][MT] Verify a failed run with empty arrays (BND) [Partial: expected text is not defined, question Q9]
Precondition: common; a payload that marks the run as failed but has no item in `detail.errors`, `detail.blockers` or `result.summary.infeasibility_hints`
Priority: Medium
Trace: AC-1.4
1. Run the optimization and click `View Diagnosis`. -> The panel opens with the tabs `Diagnosis` and `Optimization Setting`; no JSON text, no `undefined`, no error page.
2. Look at the Diagnosis tab and at `Export`. -> No block is shown (empty state text per Q9) and `Export` is not enabled, as there are zero error blocks.

### TC-040 [FE][MT] Verify Export after the plan changed while the panel is open (Exotic: changed by someone else) [Manual: needs a second session]
Precondition: common; a failing run; the panel is open; a second user can edit the same plan
Priority: Low
Trace: AC-5.2.2
1. In the second session, delete or rename a task listed in a block. -> The change is saved in the second session.
2. In the first session, click `Export` without reloading. -> One file is downloaded or a clear message is shown; the page does not break and the file has no raw UUID or `undefined`.

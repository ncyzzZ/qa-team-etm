# Backup before Jira edit 25 Nov 2026 evening (summary + description, markdown as read)
## ETM-8753
Summary: [FE][MT] Verify a duplicate inside a multi-value cell rejects that cell only
Scenario: Paste cells that contain a duplicate inside a multi-value cell. Check only those cells are rejected and the valid cell next to them is accepted.
Precondition 3: Excel row with these cells: Working Location `Upper Deck,Upper Deck`; Manpower Resource `ECM Fitter[1],ECM Fitter[2]`; Work Conflicted with the same task name twice (a task name from the plan); Description `Gauge test`.
## ETM-8759
Summary: [FE][MT] Verify Manpower Resource limits reject the cell
Scenario: Paste Manpower Resource values at and beyond the limits. Check the values over the limits are rejected and the values within the limits are accepted.
Table "Expected cell result": 6 resources / [0] / [100] / [1.5] / same type twice = "Rejected, old value stays"; [99] = "Accepted, cell shows `ECM Fitter[99]`"; 5 resources = "Accepted".
## ETM-8762
Scenario: Paste a large block where some cells are invalid. Check the valid cells are accepted and the invalid cells are rejected.
Precondition 3: Excel block taken from the largest Shutdown Logic available on QA, in the columns Description, Duration and Manpower Resource.
## ETM-8751 (before 250/200 edit, 25 Nov ~20:40)
Scenario: Paste a Description that is longer than the limit. Check it is cut to 100 characters and the cell is not rejected.
Precondition 3: The Description limit is 100 characters.
Precondition 4: Excel cell with 150 characters: the text `Replace pressure transmitter` followed by one space, repeated until it is 150 characters long.

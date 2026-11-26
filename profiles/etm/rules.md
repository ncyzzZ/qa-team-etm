# ETM project rules

Rules that hold only for ETM (EP-Turnaround Management). They reach Claude through `.claude/active-profile.md` (the SessionStart hook prints it) and the end of every exported account skill (`tools/export-skills.mjs`). The generic process is in `CLAUDE.md` and `TEAM.md`; a new rule from the lead that is about ETM's pages, roles or data goes here.

## Roles

- **Only two roles on QA: TM and JO.** TM (Turnaround Manager) can do everything and has "View All Daily Report Item"; JO (Job Owner) is view only, has "View Active Daily Report Item", and cannot open a plan that is not Active. There is no third account: do not ask for one. Only one Plan per event can be Active; turning one on sets the old one Inactive and affects other testers, so ask first.

## Data rules

- **Always asked, whatever the run policy** (TEAM.md "Standing approvals" 1, the list "Still always asked"): turning a Plan Active.
- **`@shared-data` reason a card cannot own the data** (TEAM.md "Standing approvals" 5): e.g. the Active plan of an event.
- **Deletes a card may need** (TEAM.md "Standing approvals" 6, `tools/delete-plan.mjs`): leftover works or reports in a plan, a stray Test Execution, a Daily Report to make again ...
- **Jira automation quirk (`log-defect-jira-etm` Step 5):** A known ETM project automation has been seen to silently flip a newly created QA Defect's Work type / Found-in Environment (`customfield_15852`) shortly after creation. This is parked pending the user's own decision.
- **Sprint field example (`log-defect-jira-etm` Step 4):** `"customfield_10020": 17028`.

## Page rules

- **Shutdown Logic: collapse the histogram first.** Before testing the Shutdown Logic page (scripts and manual runs) collapse the Manpower Resource histogram (button `aria-label="Hide histogram"` inside `data-testid="sl-splitter-horizontal"`, shown on hover). It is not remembered: collapse it after every load or reload. Open it only for steps that need it. In specs put it in the page-ready helper; in manual-steps files write it in the intro.
- **SIMOP / Work Conflict Matrix Stories only** (SIMOP button, Work Conflict Matrix and conflict bar colours on the Shutdown Logic page): load the project skill `etm-simop-rules` (the lead with `etm-nn-fullqa`, and the analyst, `ba-analyst` step 4). Settled rules are not questions.
- **Daily Report on a given day** (manual runner, `manual-runner` step 4). The page opens on the report's own day (the first day not frozen yet), not the day the step needs. Go straight to a day with the query `?date=YYYY-MM-DD` on the page URL: `/shutdown-event-list/events/<eventId>/planning/<planId>/daily-report/<dailyReportId>?date=2026-06-04` (keep the other query params; stms-fe `EXECUTION_DATE_QUERY_PARAM`, ETM-5277, the same link the exported PDF's "Link to STMS" uses). The page honours it only for a day you could reach with the arrows: from the event start minus 1 day up to the report's own day (the first unfrozen day). Any other day is silently dropped from the URL and the page shows its own day. So always read the date in the header after loading; if it is not the day asked for, the day is out of reach (a day after the first unfrozen day needs every earlier day frozen) or QA does not have ETM-5277 yet: then use the `<` / `>` arrows next to the date (`>` moves only off a frozen day, both are disabled while the table loads: wait for it after each click) and read the header again. A day you cannot reach = every step `needs-human` with that reason; never freeze a day to get there unless the Test says so and writes are approved.
- **Daily Report Export** (`manual-runner` step 7): the Daily Report Export gives a **zip of per-day PDFs**: unzip it with `pdf-shot.mjs --unzip` and pick the day the step asks for.

## Settings

Jira site, key, id, board, repo folders, UI map, templates and Jira field ids come from `profile.json` (printed above this file in `.claude/active-profile.md`); only what `profile.json` does not hold is here.

- Workflow doc: `docs/etm-qa-workflow.md`.
- Xray Test Repository Bin folder (default folder of `etm-xray-delete-test-executions` Mode 2): `/Manual Test/Bin`, folder id `69a8ed78018e9874f5130640`.

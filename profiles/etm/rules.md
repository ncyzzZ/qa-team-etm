# ETM project rules

Rules that hold only for ETM (EP-Turnaround Management). They reach Claude through `.claude/active-profile.md` (CLAUDE.md imports it). The generic process is in `CLAUDE.md` and `TEAM.md`; a new rule from the lead that is about ETM's pages, roles or data goes here.

## Roles

- **Only two roles on QA: TM and JO.** TM (Turnaround Manager) can do everything and has "View All Daily Report Item"; JO (Job Owner) is view only, has "View Active Daily Report Item", and cannot open a plan that is not Active. There is no third account: do not ask for one. Only one Plan per event can be Active; turning one on sets the old one Inactive and affects other testers, so ask first.

## Data rules

- **Always asked, whatever the run policy** (TEAM.md "Standing approvals" 1, the list "Still always asked"): turning a Plan Active.
- **`@shared-data` reason a card cannot own the data** (TEAM.md "Standing approvals" 5): e.g. the Active plan of an event.
- **Deletes a card may need** (TEAM.md "Standing approvals" 6, `tools/delete-plan.mjs`): leftover works or reports in a plan, a stray Test Execution, a Daily Report to make again ...

## Page rules

- **Shutdown Logic: collapse the histogram first.** Before testing the Shutdown Logic page (scripts and manual runs) collapse the Manpower Resource histogram (button `aria-label="Hide histogram"` inside `data-testid="sl-splitter-horizontal"`, shown on hover). It is not remembered: collapse it after every load or reload. Open it only for steps that need it. In specs put it in the page-ready helper; in manual-steps files write it in the intro.
- **SIMOP / Work Conflict Matrix Stories only** (SIMOP button, Work Conflict Matrix and conflict bar colours on the Shutdown Logic page): load the project skill `etm-simop-rules`.

## Settings

- `JIRA_SITE`: pttep.atlassian.net. `PROJECT_KEY`: ETM (project id 14436). `BOARD_ID`: 4014.
- `PW_REPO`: folder of the Playwright repo `ep-etm-fe-qa` (default `../ep-etm-fe-qa` next to this repo). FE repo: `stms-fe` (branch `develop`).
- Workflow doc: `docs/etm-qa-workflow.md`. UI facts: `docs/UI_Map_ETM.md`. Templates: `docs/ETM_Templates/`.
- Xray Test Repository Bin folder (default folder of `etm-xray-delete-test-executions` Mode 2): `/Manual Test/Bin`, folder id `69a8ed78018e9874f5130640`.

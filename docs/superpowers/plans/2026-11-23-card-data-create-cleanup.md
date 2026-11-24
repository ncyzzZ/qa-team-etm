# Card data: create by script, delete after the run - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** For a card whose data file says `create: true`, `run-card` makes the card's Plans (and Event when asked) through the app's API, fills their content through the DB, runs the tests, and deletes what it made, always.

**Architecture:** API calls run as two Playwright setup specs in `ep-etm-fe-qa` (`cardCreate.spec.ts`, `cardCleanup.spec.ts`), because the Playwright global setup already signs in and puts the bearer token in `TURNAROUND_MANAGER_TOKEN`, and `buildImportFile` / `queryDb` / `config` are TS helpers there. A CJS ledger (`scripts/seed/card/ledger.cjs`) records every id the moment it is made; `card-data.cjs reset` reads it to target the new Plans. `tools/run-card.mjs` (qa-team-etm) runs sweep → create → reset → tests → cleanup.

**Tech Stack:** Node 20, Playwright Test `request` API, `pg`, `node:test` for CJS units.

**Spec:** `docs/superpowers/specs/2026-11-23-card-data-create-cleanup-design.md` (and `2026-11-20-card-test-data-design.md` for the content step).

## Global Constraints

- QA only: refuse when `BASE_URL`, `API_BASE_URL` or `DB_HOST` matches `/uat|prod/i`.
- Names of made things: `QA-AUTO <KEY> <yyyyMMdd-HHmm>` (Event) and `QA-AUTO <KEY> <plan key> <yyyyMMdd-HHmm>` (Plan).
- Delete only ids in the card's ledger `output/seed/<KEY>.ledger.json`; never by name search.
- Every QA write (create, cleanup, sweep) runs only after one user yes per run: `state.mjs approve --kind data-reset`.
- Windows and Mac; never print the token or passwords.

## Review Focus

1. Create fails halfway (Plan 2 of 3): the ids already made are in the ledger and cleanup deletes them; tests do not run.
2. Playwright run is killed (Ctrl+C): run-card still runs cleanup (`finally` + signal handler), and if not, the next run's sweep deletes the leftovers.
3. A ledger id that is already gone (someone deleted it): cleanup treats 404 as deleted and clears it, no error.
4. Cleanup refuses a ledger whose host differs from the current `API_BASE_URL` (ledger made on another env).
5. `--keep-data`: no cleanup, report and console say "data kept: <ids>", next run's sweep still deletes it.

---

### Task 1: Request bodies and ledger

**Files:**
- Create: `ep-etm-fe-qa/scripts/seed/card/ledger.cjs`, `ledger.test.cjs`
- Create: `ep-etm-fe-qa/scripts/seed/card/payloads.cjs`, `payloads.test.cjs`

**Interfaces (Produces):**
- `ledger.read(root, key) -> { key, host, event: {id, made:boolean}|null, plans: { [k]: { id, name, needs: string[] } } }` (empty shape when no file)
- `ledger.addEvent(root, key, host, id)`, `ledger.addPlan(root, key, host, k, { id, name })`, `ledger.addNeed(root, key, k, need)`, `ledger.drop(root, key, what)` (`what` = `'event'` or `'plan:<k>'`), `ledger.isEmpty(l)`
- `payloads.eventBody(create, name) -> SaveForm`, `payloads.planBody(ramp, name) -> ShutdownPlanningPayload`, `payloads.duplicateBody(name, ramp) -> ShutdownPlanningDuplicatePayload`, `payloads.stamp(date) -> 'yyyyMMdd-HHmm'`

- [ ] Step 1: Read the body types in `stms-fe` (`form-event/models/form.model.ts` SaveForm; `planning` models: `ShutdownPlanningPayload`, `ShutdownPlanningDuplicatePayload`, and how `planning.service.ts` builds them) and copy the field names into `payloads.cjs`. Dates in the format the FE sends (read the component that calls `createPlan`).
- [ ] Step 2: Tests: `ledger` writes the file after every add (read back equals), `drop('plan:main')` removes only that plan, `host` mismatch is kept as written; `payloads.planBody({start:'10 Jun 2026 06:00', end:'14 Jun 2026 18:00'}, 'X')` has the FE field names and both dates; `stamp(new Date(2026,10,23,9,5))` = `'20261123-0905'`.
- [ ] Step 3: Run `node --test scripts/seed/card/ledger.test.cjs scripts/seed/card/payloads.test.cjs` → FAIL, implement, → PASS.
- [ ] Step 4: Commit in `ep-etm-fe-qa`.

### Task 2: Create and cleanup specs (API)

**Files:**
- Create: `ep-etm-fe-qa/utils/stmsApi.ts` (thin client: `api(request).post/del(path, body)` with `Authorization` = `process.env.TURNAROUND_MANAGER_TOKEN`, base `config.API_BASE_URL`, throws on non-2xx except 404 in `del`)
- Create: `ep-etm-fe-qa/tests/fe/setup/cardCreate.spec.ts`, `cardCleanup.spec.ts`

**Interfaces:**
- Consumes: Task 1 `ledger`, `payloads`; existing `buildImportFile`, `importRows`, `queryDb`, `config`.
- Produces: env `CARD=<KEY>`; create exits non-zero on any failure; after success `ledger.plans[k].id` set for every plan of the data file.

- [ ] Step 1: `cardCreate.spec.ts` (one `test`, steps): refuse non-QA; if `data.event.create` → `POST /shutdown-events` then `ledger.addEvent`; for each plan: `source` → `POST .../planning/{sourceId}/duplicate` + poll `.../duplicate/status` (max 5 min) else `POST .../planning`; find the new `spl_id` (response, else DB by name) → `ledger.addPlan`; each `needs` → `POST .../planning/{id}/<logics|daily-report|manpower-mob|equipment-mob>` → `ledger.addNeed`; `contentBy:'import'` → `buildImportFile(importRows(works))` → `POST .../worklists/{swl}/works/import-works` (form-data `asset`, `field`, `file`, `all=true`).
- [ ] Step 2: `cardCleanup.spec.ts`: read ledger; refuse host mismatch; per plan: delete needs in reverse (`DELETE .../daily-report|manpower-mob|equipment-mob`), then `DELETE .../planning/{id}`, `ledger.drop`; then the Event when `made`; prints `CLEANUP done: n plans, event yes/no`.
- [ ] Step 3: `npx tsc --noEmit -p .` → 0 errors. (Real calls are Task 5.)
- [ ] Step 4: Commit.

### Task 3: Reset targets the made Plans

**Files:** Modify `ep-etm-fe-qa/scripts/seed/card/run.cjs` (`main`), `run.test.cjs`

- [ ] Step 1: Test in `run.test.cjs`: a data file with `create: true`, a ledger with `event.id='E1'`, `plans.main={id:'P1',name:'QA-AUTO ETM-1 main 20261123-0905'}` → `main(['ETM-1','check'])` queries with event `E1` and that name; with `create: true` and an empty ledger → exit 11 and log `run cardCreate first`.
- [ ] Step 2: Implement: after `loadData`, if `data.create`, overlay `data.event` / `plans[k].name` from the ledger. Run `node --test scripts/seed/card/*.test.cjs` → PASS.
- [ ] Step 3: Commit.

### Task 4: run-card flow

**Files:** Modify `qa-team-etm/tools/run-card.mjs`; Create `qa-team-etm/tools/card-data-flow.mjs`, `card-data-flow.test.mjs`

**Interfaces:** `planFlow({ hasCreate, ledgerEmpty, keepData }) -> string[]` of steps from `['sweep','create','reset','run','cleanup']`.

- [ ] Step 1: Tests: `{hasCreate:true, ledgerEmpty:false}` → `['sweep','create','reset','run','cleanup']`; `ledgerEmpty:true` → no `sweep`; `keepData:true` → no `cleanup`; `hasCreate:false` → `['run']` (old flow, data gate unchanged).
- [ ] Step 2: Implement; in `run-card.mjs` run sweep/create via `npx playwright test tests/fe/setup/cardCleanup.spec.ts|cardCreate.spec.ts --workers=1 --reporter=line` with `CARD=<KEY>`, reset via `node scripts/seed/card-data.cjs <KEY> reset --apply`; create or reset fails → cleanup, exit 2, no tests; tests run inside `try/finally` that runs cleanup; SIGINT/SIGTERM also run cleanup once. Print `[card-data] made ...` / `[card-data] deleted ...` / `[card-data] data kept: ...`.
- [ ] Step 3: `node --test tools/*.test.mjs tools/heal/*.test.mjs` → PASS. Commit.

### Task 5: Rules, first card, real run

**Files:** Modify `qa-team-etm/TEAM.md` ("Card test data"), `.claude/agents/automation-engineer.md`, `docs/etm-qa-workflow.md` (Addition 23 Nov); `ep-etm-fe-qa/scripts/seed/cards/ETM-8049.data.cjs` (`create: true`)

- [ ] Step 1: TEAM.md: cards with `create: true` use one question `"สร้าง data → รัน → ลบ|ยังก่อน"`; automator writes new cards' data files with `create: true`; old cards unchanged.
- [ ] Step 2: Set `create: true` on ETM-8049.
- [ ] Step 3: With the user's yes only: `node tools/run-card.mjs ETM-8049 <one spec> -g "<one test>"` on QA; confirm the ledger empties, the Plans are gone (DB `spl_is_delete='Y'` or row gone), the test ran on the made data.
- [ ] Step 4: Commit both repos.

# Card test data (seed and reset before each run) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One command per card brings its QA data to a known state before every run, and `run-card.mjs` refuses to run on data that was not reset.

**Architecture:** A pure diff module (data file vs DB snapshot -> actions) and a DB module (snapshot, apply) under `ep-etm-fe-qa/scripts/seed/card/`, driven by a CLI `scripts/seed/card-data.cjs`. A generic UI setup spec makes the one-time structure. In qa-team-etm, a small gate module used by `run-card.mjs` checks the result file, the lock and `check` before Playwright starts.

**Tech Stack:** Node 20 (CommonJS in `scripts/seed/`, ESM in qa-team-etm `tools/`), `pg`, `node:test`, Playwright (setup spec, TypeScript).

**Spec:** `docs/superpowers/specs/2026-11-20-card-test-data-design.md`

## Global Constraints

- QA only: refuse when `/uat|prod/i` matches `${DB_HOST} ${BASE_URL}` (same check as `seedSprint26.cjs`), before connecting.
- `created_by` / `updated_by` = `TURNAROUND_MANAGER_USER`; refuse when unset.
- Every write in one transaction; dry run (ROLLBACK) unless `--apply`; after `--apply`, `check` must say `READY` or the command exits 1.
- Owned Plan / Event name must contain the card key (`QA ETM-8405 ...`); a name carrying another `ETM-<n>` key is refused.
- Shared data: UPDATE of named columns by a stable key, or insert / change / delete of rows whose ids the tool recorded itself. Nothing else.
- Soft delete of works like the app: `sdw_is_delete = 'Y'`.
- `check` exit codes: 0 `READY`, 10 `NEEDS RESET`, 11 `NEEDS SETUP`, 12 `NEEDS MANUAL`; 2 usage / refused.
- Result file `ep-etm-fe-qa/output/seed/ETM-<n>.json`: `{ key, resetAt, dbHost, ids }`. Lock `ep-etm-fe-qa/output/seed/ETM-<n>.lock`; stale after 2 hours (reported, never taken over silently).
- Old way untouched: `seedSprint26.cjs`, `sprint26.data.cjs`, `.env` keys, ETM-8042 files.
- Windows and Mac: paths with `path.join`, no shell-only syntax.
- A real `reset --apply` or `setup` on QA is a data write: only after the user's yes (chat or `team.mjs wait` ANSWER). The plan's own verification uses dry runs and `check` only.

## Review Focus

1. A data file whose Plan or Event name lacks the card key (or carries another key): refused with a message naming the file and the Plan, nothing written. Test in Task 1.
2. A recorded own shared row was deleted by someone else: the reset inserts it again instead of failing. Test in Task 1.
3. Duplicate work ids in one Plan of the data file: refused before any DB call. Test in Task 1.
4. Lock older than 2 hours: `reset` and `run-card` stop and print the lock owner and age; a fresh lock of another process: stop. Test in Task 3 and Task 5.
5. `run-card` on a card with a data file whose last reset is older than its last run folder: stops with the exact `card-data.cjs <KEY> reset` command. Test in Task 5.

---

### Task 1: Diff and guards (pure)

**Files:**
- Create: `ep-etm-fe-qa/scripts/seed/card/diff.cjs`
- Create: `ep-etm-fe-qa/scripts/seed/card/data-helpers.cjs` (move-free copy of `work()` / `bd()` / Deck code map from `sprint26.data.cjs`; `sprint26.data.cjs` keeps its own)
- Test: `ep-etm-fe-qa/scripts/seed/card/diff.test.cjs`

**Interfaces:**
- Produces:
  - `validate(data) -> string[]` (errors; empty = ok): card key format, owned names carry `data.key` and no other key, duplicate work ids per Plan, shared item has `table` + (`where`+`set`) or `own: true`.
  - `diffWorks(desired: Work[], actual: DbWork[]) -> { update: {work, sdw_id}[], insert: Work[], remove: string[] /* sdw_id */ }`, matching by `sdw_work_number === work.id`. `update` only when a column the file sets or a child (breakdowns, locations) differs.
  - `diffShared(item, actualRows, recordedIds) -> { update: Row[], insert: Row[], remove: string[] }`; own rows whose recorded id is missing go to `insert`.
  - `status({ missingStructure: string[], manualMissing: string[], diffs }) -> 'READY'|'NEEDS RESET'|'NEEDS SETUP'|'NEEDS MANUAL'` (order: SETUP, then MANUAL, then RESET).
  - Types (JSDoc): `Work = { id, description?, remark?, owner?, breakdowns: { deck: string[], x: string[], y: string[] }[] }`, `DbWork = { sdw_id, sdw_work_number, sdw_job_description, sdw_remark, sdw_job_owner, breakdowns: same shape }`.

- [ ] **Step 1: Write the failing tests** (`node:test`):
  - `validate`: name `QA ETM-8405 Weekly` with key ETM-8405 -> `[]`; name `S26 Remark Set` -> 1 error containing `card key`; name `QA ETM-8405 copy of ETM-8391` -> 1 error containing `ETM-8391`; two works `WK-1` in one Plan -> 1 error containing `WK-1`.
  - `diffWorks`: same work same values -> all empty; remark changed -> 1 update; work only in file -> 1 insert; work only in DB -> its `sdw_id` in `remove`; breakdown Deck order changed -> 1 update.
  - `diffShared`: own item, recorded id not in actual rows -> 1 insert; recorded id present, value differs -> 1 update; update-only item never yields insert / remove.
  - `status`: missing structure + diffs -> `NEEDS SETUP`; only diffs -> `NEEDS RESET`; nothing -> `READY`.
- [ ] **Step 2: Run** `node --test scripts/seed/card/` in `ep-etm-fe-qa`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `diff.cjs` and `data-helpers.cjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** (ep-etm-fe-qa) `feat(seed): card data diff and guards`.

### Task 2: DB layer

**Files:**
- Create: `ep-etm-fe-qa/scripts/seed/card/db.cjs`
- Test: `ep-etm-fe-qa/scripts/seed/card/db.test.cjs` (fake client: records `[sql, params]`, answers canned rows)

**Interfaces:**
- Consumes: Task 1 `diffWorks`, `diffShared`, types.
- Produces:
  - `snapshot(c, data) -> { plans: { [name]: { spl_id, swl_id, works: DbWork[] } | null }, events: { [name]: sde_id|null }, shared: { [i]: Row[] }, manual: { [i]: boolean } }`. Plan lookup as `seedSprint26.cjs` (`shutdown_map` + `shutdown_plan`, `spl_is_delete = 'N'`, exactly one row else `null`). Manual items: run the item's read-only `check` SQL, true when it returns a row.
  - `applyWorks(c, plan, actions, by) -> { updated, inserted, removed }`: insert copies a template work like `seedSprint26.cjs` `seedWorks` (template from the same event); update sets `sdw_job_description`, `sdw_remark`, `sdw_job_owner`, `sdw_updated_by/date`, deletes and re-inserts that work's `shutdown_activity_breakdown` + `shutdown_working_location` rows (and the work-level roll-up); remove = soft delete.
  - `applyShared(c, item, actions, by) -> { updated, inserted, removed, ids: string[] }`: every UPDATE / DELETE has `where <pk> = any($ids)` (own rows) or the item's `where` (update-only).
- [ ] **Step 1: Write the failing tests:** `applyWorks` with 1 update + 1 insert + 1 remove issues one `update shutdown_work ... sdw_is_delete = 'Y'` for exactly the removed id; the update path never issues `delete from shutdown_work`; `applyShared` for an own item issues no UPDATE / DELETE whose params lack the recorded ids; `snapshot` returns `null` for a Plan with 0 or 2 map rows.
- [ ] **Step 2: Run** `node --test scripts/seed/card/`. Expected: new tests FAIL.
- [ ] **Step 3: Implement** `db.cjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(seed): card data snapshot and apply`.

### Task 3: CLI `card-data.cjs` (check / reset / setup), result file, lock

**Files:**
- Create: `ep-etm-fe-qa/scripts/seed/card-data.cjs` (thin: argv, env, pool, `main`)
- Create: `ep-etm-fe-qa/scripts/seed/card/run.cjs` (`main(args, { pool, root, now })`, testable)
- Create: `ep-etm-fe-qa/scripts/seed/card/lock.cjs`
- Test: `ep-etm-fe-qa/scripts/seed/card/run.test.cjs`, `lock.test.cjs`

**Interfaces:**
- Consumes: Tasks 1-2.
- Produces:
  - CLI: `node scripts/seed/card-data.cjs <KEY> check|reset|setup [--apply]`; data file `scripts/seed/cards/<KEY>.data.cjs`; no data file -> prints `no data file for <KEY>` and exits 0 for `check` (old way), 2 for `reset` / `setup`.
  - `lock.take(root, key, owner) -> { ok: true } | { ok: false, reason, owner, ageMin }`, `lock.release(root, key)`; stale = older than 120 minutes -> `ok: false, reason: 'stale'`.
  - Result file written only after a committed `reset --apply` whose follow-up `check` is `READY`; `ids` holds `plans.<name>.id`, `plans.<name>.worklistId`, `events.<name>.id`, `shared.<i>.ids`.
  - `setup` prints the Playwright command `npx playwright test tests/fe/setup/setupCard.spec.ts --workers=1 --reporter=line` with `CARD=<KEY>` and the manual TODO list; it does not run it itself.
- [ ] **Step 1: Write the failing tests** (fake pool from Task 2's fake client): `check` READY -> exit 0, no writes; `reset` without `--apply` -> ends with `ROLLBACK`, no result file; `reset --apply` -> `COMMIT`, result file with `resetAt`; `reset --apply` whose re-check is not READY -> exit 1, message `not READY after reset`; QA guard with `DB_HOST=uat-db` -> exit 2 before any query; lock held by a fresh other owner -> exit 2; lock 121 minutes old -> exit 2 with `stale`.
- [ ] **Step 2: Run** `node --test scripts/seed/card/`. Expected: new tests FAIL.
- [ ] **Step 3: Implement** `run.cjs`, `lock.cjs`, `card-data.cjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(seed): card-data CLI check, reset, setup`.

### Task 4: Generic UI setup spec and `cardData()` for specs

**Files:**
- Create: `ep-etm-fe-qa/tests/fe/setup/setupCard.spec.ts`
- Create: `ep-etm-fe-qa/utils/cardData.ts`
- Test: `ep-etm-fe-qa/scripts/seed/card/cardData.test.cjs` is not possible for TS; instead `utils/cardData.ts` is checked by `npx tsc --noEmit` and a `--list` of the setup spec.

**Interfaces:**
- Consumes: data file shape (Task 1), result file (Task 3).
- Produces:
  - `cardData(key: string): { ids: Record<string, string>; resetAt: string }` reads `output/seed/<key>.json`; missing -> throws `Error("No test data for <key>: run node scripts/seed/card-data.cjs <key> reset (then --apply after the user's yes)")`.
  - `setupCard.spec.ts`: reads `CARD`, loads `scripts/seed/cards/<CARD>.data.cjs`, QA guard, for each owned Plan missing on its event: `createPlan` (from `rampDownUp.helpers.ts`) with the file's `ramp`; for each `needs` step with a helper (`shutdownLogic` -> Create on the Shutdown Logic row, as `setupEtm8042RampData.spec.ts`), do it if not done; a step without a helper is printed as `SETUP TODO`. Safe to run again.
- [ ] **Step 1: Implement** `utils/cardData.ts` and `setupCard.spec.ts`.
- [ ] **Step 2: Run** `npx tsc --noEmit -p .` (no errors in the two files) and `CARD=ETM-8405 npx playwright test tests/fe/setup/setupCard.spec.ts --list`. Expected: 1 test listed. Delete the run folder that `--list` creates under `output/runs/`.
- [ ] **Step 3: Commit** `feat(seed): generic card setup spec and cardData()`.

### Task 5: Gate in `run-card.mjs` and the `data-reset` approval

**Files:**
- Create: `qa-team-etm/tools/data-gate.mjs`
- Test: `qa-team-etm/tools/data-gate.test.mjs`
- Modify: `qa-team-etm/tools/run-card.mjs` (before the Playwright `spawn` at line ~169; release the lock in the exit handler)
- Modify: `qa-team-etm/tools/state/core.mjs:11` (add `'data-reset'` to `APPROVAL_KINDS`), its tests
- Modify: `qa-team-etm/tools/heal/triage.mjs` (when `data-check.json` in the run folder says `READY`, a `data` cause keeps its cause but its reason ends with `(data was reset and READY before the run: check the test, not the setup)`)

**Interfaces:**
- Consumes: CLI and result / lock files of Task 3 (through `PW_REPO`).
- Produces: `dataGate({ pwRepo, key, lastRunDir, runCheck, now, skip }) -> { ok: boolean, message: string, check?: object }`. `runCheck` defaults to spawning `node scripts/seed/card-data.cjs <KEY> check` in `pwRepo`. No data file -> `ok: true` (old way). `skip` (`--no-data-check`) -> `ok: true`, message `data not reset (--no-data-check)`, written into `data-check.json`.
- [ ] **Step 1: Write the failing tests:** no data file -> ok; result file `resetAt` older than the last run folder time -> not ok, message contains `card-data.cjs ETM-8405 reset`; check exit 10 -> not ok; check exit 0 + newer reset -> ok; stale lock -> not ok with `stale`; `skip` -> ok with the skip message; `state.mjs approve --kind data-reset` accepted by `core.validate`.
- [ ] **Step 2: Run** `node --test tools/data-gate.test.mjs tools/state/ tools/heal/`. Expected: new tests FAIL.
- [ ] **Step 3: Implement** `data-gate.mjs`, wire `run-card.mjs` (exit 2 with the message when not ok; take the card lock (same file format as Task 3 `lock.cjs`: JSON `{ owner, pid, at }`) for the whole run and remove it in the exit handler; write `data-check.json` into the run folder; pass `--no-data-check` through as `skip` and strip it from the Playwright args), add the approval kind, triage reason.
- [ ] **Step 4: Run** `node --test tools/` and `node tools/qa-check.mjs selftest`. Expected: PASS.
- [ ] **Step 5: Commit** (qa-team-etm) `feat(data): run-card refuses data that was not reset`.

### Task 6: ETM-8405 data file, real read-only check, team docs

**Files:**
- Create: `ep-etm-fe-qa/scripts/seed/cards/ETM-8405.data.cjs` (shared: `TL_SPARE_EVENT_ID` event; own row: one weekly Actual (%) 0.5 on the first Timeline activity, as `seedActual` in `seedSprint26.cjs`)
- Modify: `qa-team-etm/TEAM.md` (Phase 6 run: `card-data.cjs <KEY> check`; reset dry-run summary inside the run question with options `รีเซ็ตแล้วรัน|ยังก่อน`; `state.mjs approve --kind data-reset`), `qa-team-etm/.claude/agents/automation-engineer.md` (new cards: data file + `cardData()` instead of new `.env` keys), `qa-team-etm/docs/etm-qa-workflow.md` (one paragraph)
- [ ] **Step 1: Write** the data file.
- [ ] **Step 2: Run** `node scripts/seed/card-data.cjs ETM-8405 check` (read only) and `node scripts/seed/card-data.cjs ETM-8405 reset` (dry run, ROLLBACK). Expected: a status line and a summary such as `shared: 1 inserted`, `Rolled back (dry run)`. No `--apply` in this task.
- [ ] **Step 3: Edit** the three docs.
- [ ] **Step 4: Run** `node --test tools/` (qa-team-etm), `node --test scripts/seed/card/` (ep-etm-fe-qa), `node tools/setup.mjs`. Expected: PASS / all good.
- [ ] **Step 5: Commit** both repos: `feat(seed): ETM-8405 card data` and `docs(data): card data reset before each run`.

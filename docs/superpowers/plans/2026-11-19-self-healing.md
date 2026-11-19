# Self-healing for the ETM Playwright suite: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-flight warnings from `stms-fe` changes, failure triage after each run, and approved locator heals (FE source first, live page second), with a heal log that gives a self-healing rate.

**Architecture:** Small Node ESM modules in `qa-team-etm/tools/heal/`, each one job, each with a `node:test` file and fixtures under `evals/heal/`. `run-card.mjs` gains retries, triage and baseline writing. The live step uses Playwright's own `healer` agent through the Playwright test MCP server, started from the Playwright repo by a small wrapper. All git work on `stms-fe` goes through one allow-listed wrapper.

**Tech Stack:** Node 26 (ESM, `node:test`, `node:child_process`), git CLI, Playwright 1.58 (`init-agents`, `run-test-mcp-server`), existing `team.mjs` board, existing Xray / Atlassian MCP.

**Spec:** `docs/superpowers/specs/2026-11-19-self-healing-design.md`

## Global Constraints

- Never edit anything in `stms-fe`: no file edits, `checkout`, `reset`, `merge`, `stash`, commit or push. Only `git pull --ff-only` on a clean `develop`, else `git fetch`, plus read commands.
- A heal may only change how an element is found, never what is checked: no added `.first()` / `.nth()` / `force: true` / timeout change, no removed or changed `expect`.
- Every heal diff is applied only after `team.mjs ask --approve` + `team.mjs wait` (`ANSWER:` line) or a chat yes.
- At most 2 heal rounds per test, then offer manual testing.
- Source heals count only after the re-run passes; a failed source heal sends the next round to the live step.
- `@dailyreport` specs: 0 retries, never re-run automatically.
- No new npm dependency in `qa-team-etm`; Mac and Windows (use `path`, no shell strings, spawn with arg arrays).
- `FE_REPO`: env, else `FE_REPO=` in `.env`, else `<PW_REPO>/../stms-fe`.
- Output paths: `<PW_REPO>/output/heal/fe-baseline.json`, `<PW_REPO>/output/heal/heal-log.jsonl`, `<PW_REPO>/output/heal/preflight-<YYYY-MM-DD>.md`, `<PW_REPO>/output/runs/<run>/triage.json|.md`.

## Review Focus

1. `stms-fe` checked out on a feature branch, or with local edits: no pull, fetch only, and the output says why (test in Task 3).
2. GitLab unreachable (no VPN): no crash, uses the existing `origin/develop`, prints its date (test in Task 3).
3. Every spec imports `@fixtures/pageFixtures`, so import-following would mark every page as used and wrongly move all baselines: page use must come from `pages.<getter>` usage and direct `@pages/` imports (test in Task 6).
4. A failure whose error mentions a locator but the element was found and the value differed must be `assertion`, not `locator` (else an app bug gets "healed") (test in Task 2).
5. A token that appears in many places in `stms-fe` (e.g. `active`, `btn`) must not produce a confident replacement: no candidate when the removing commit gives none, and generic tokens are skipped in pre-flight (test in Task 4).

---

### Task 1: Settings and token extraction

**Files:**
- Create: `tools/heal/config.mjs`, `tools/heal/selectors.mjs`
- Create: `tools/heal/selectors.test.mjs`, `evals/heal/pages-sample.ts`
- Modify: `tools/setup.mjs` (add an `FE_REPO` check after the PW_REPO block, line ~50)

**Interfaces:**
- Produces: `resolveRepos(): { pwRepo: string, feRepo: string, sources: { pw: string, fe: string } }` (same lookup order as `run-card.mjs` `envFileValue`).
- Produces: `extractTokens(source: string, file: string): Token[]` where `Token = { file: string, line: number, kind: 'class'|'id'|'attr'|'text'|'role-name'|'placeholder'|'label'|'tag', value: string }`.
- Produces: `isLibraryToken(value: string): boolean` (true for classes starting `b-` (Bryntum) or `ag-` (AG Grid)).
- Produces: `GENERIC_TOKENS: Set<string>` (at least `active`, `disabled`, `btn`, `button`, `row`, `cell`, `icon`, `title`, `container`, `content`, `header`, `label`, `text`).

- [ ] **Step 1: Write the failing tests** in `tools/heal/selectors.test.mjs` against `evals/heal/pages-sample.ts` (a fixture with one of each: `.locator('.b-grid-row')`, `.locator('#saveBtn')`, `.locator('[data-column="name"]')`, `:text-is("Scheduled")`, `getByRole('button', { name: 'Save Plan' })`, `getByText('Weekly Plan')`, `getByPlaceholder('Search')`, `getByLabel('Remark')`, `.locator('app-shutdown-gantt-chart')`):
  - `extractTokens` returns kinds `class:b-grid-row`, `id:saveBtn`, `attr:name`, `text:Scheduled`, `role-name:Save Plan`, `text:Weekly Plan`, `placeholder:Search`, `label:Remark`, `tag:app-shutdown-gantt-chart`, each with the right 1-based line.
  - `isLibraryToken('b-grid-row') === true`, `isLibraryToken('ag-row') === true`, `isLibraryToken('mob-plan-table') === false`.
  - `resolveRepos()` with `PW_REPO=/x/qa` and no `FE_REPO` gives `feRepo === path.resolve('/x/stms-fe')`.
- [ ] **Step 2: Run** `node --test tools/heal/selectors.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `config.mjs` and `selectors.mjs` (regex per kind over each line; template literals with `${}` are skipped, not guessed). Add to `setup.mjs`: info line `FE_REPO = ...` and `need(fs.existsSync(path.join(feRepo, '.git')), 'FE repo (stms-fe) found', 'set FE_REPO=<folder of stms-fe> in .env')` as a warning, not a hard fail.
- [ ] **Step 4: Run** `node --test tools/heal/selectors.test.mjs` and `node tools/setup.mjs`. Expected: tests PASS; setup prints the FE_REPO line.
- [ ] **Step 5: Commit** `feat(heal): settings and locator token extraction`.

### Task 2: Failure triage

**Files:**
- Create: `tools/heal/triage.mjs`, `tools/heal/triage.test.mjs`, `evals/heal/results-mixed.json`

**Interfaces:**
- Consumes: `extractTokens` (Task 1) to name the failing locator token.
- Produces: `classify(test: { status: string, results: PwResult[] }): Triage` where `Triage = { cause: 'locator'|'flaky'|'data'|'env'|'assertion'|'unknown', locator: string|null, pageRef: string|null, firstLine: string }`. `pageRef` = first stack frame under `pages/` as `pages/...ts:LINE`.
- Produces: `triageRun(runDir: string): Triage & { key: string, title: string, file: string }[]`; CLI `node tools/heal/triage.mjs <runDir>` writes `triage.json`, `triage.md`, prints one line per cause, exits 0.

- [ ] **Step 1: Write the failing tests** with `evals/heal/results-mixed.json` (Playwright JSON shape: `suites[].specs[].tests[].results[]`, ANSI codes kept in messages), one test per case:
  - `TimeoutError: locator.click: Timeout 30000ms exceeded. Call log: - waiting for locator('.save-btn')` → `locator`, `locator === "locator('.save-btn')"`, `pageRef` from stack `pages/timelinePage/editPlanPage.ts:42`.
  - `Error: strict mode violation: locator('.row') resolved to 2 elements` → `locator`.
  - `expect(locator).toBeVisible() failed ... Received: <element(s) not found>` → `locator`.
  - `expect(locator).toHaveText(expected) failed ... Expected string: "Draft" Received string: "Submitted"` → `assertion` (Review Focus 4).
  - first result failed, retry passed → `flaky`.
  - `page.goto: net::ERR_CONNECTION_REFUSED` and `login.microsoftonline.com` timeouts and HTTP `500` → `env`.
  - message containing `No test data` or `precondition` → `data`.
  - anything else → `unknown`.
  - a `skipped` test is not in the output.
- [ ] **Step 2: Run** `node --test tools/heal/triage.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement.** Order of checks: flaky (any later result passed), env, data, assertion (`Expected` + `Received` with a value, not `element(s) not found`), locator, unknown. Patterns as constants at the top of the file.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(heal): failure triage`.

### Task 3: Safe git wrapper for stms-fe

**Files:**
- Create: `tools/heal/fe-git.mjs`, `tools/heal/fe-git.test.mjs`

**Interfaces:**
- Produces: `git(feRepo: string, args: string[]): string` that throws `Error('git <sub> not allowed on stms-fe')` unless `args[0]` is one of `fetch`, `pull` (only with `--ff-only`), `log`, `diff`, `show`, `grep`, `rev-parse`, `status` (only with `--porcelain`), `symbolic-ref`, `for-each-ref`.
- Produces: `updateFe(feRepo: string): { mode: 'pull'|'fetch'|'offline', reason: string, newest: { commit: string, date: string } }`. Pull only when `symbolic-ref --short HEAD` is `develop` and `status --porcelain` is empty.

- [ ] **Step 1: Write the failing tests.** Build throwaway repos in `os.tmpdir()` (a bare "origin" plus a clone; the tests' own repos, never `stms-fe`):
  - `git(repo, ['checkout', 'x'])`, `['reset']`, `['pull']` (no `--ff-only`), `['commit']`, `['push']` each throw.
  - clean clone on `develop` with a new commit on origin → `mode: 'pull'`, clone HEAD moved.
  - clone on branch `feature/x` → `mode: 'fetch'`, `reason` mentions the branch, HEAD unchanged (Review Focus 1).
  - clone on `develop` with an edited tracked file → `mode: 'fetch'`, file content unchanged (Review Focus 1).
  - origin URL pointing to a missing path → `mode: 'offline'`, `newest.date` is the existing `origin/develop` date, no throw (Review Focus 2).
- [ ] **Step 2: Run** `node --test tools/heal/fe-git.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** with `spawnSync('git', ['-C', feRepo, ...args])`, `GIT_TERMINAL_PROMPT=0`, 60 s timeout for fetch/pull.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(heal): allow-listed git access to stms-fe`.

### Task 4: Source lookup

**Files:**
- Create: `tools/heal/source-lookup.mjs`, `tools/heal/source-lookup.test.mjs`

**Interfaces:**
- Consumes: `git` (Task 3), `Token`, `isLibraryToken`, `GENERIC_TOKENS` (Task 1).
- Produces: `lookup(feRepo: string, token: Token, ref = 'origin/develop'): { present: boolean, library: boolean, removedIn: { commit: string, author: string, date: string, file: string }|null, candidates: string[] }`.
- CLI: `node tools/heal/source-lookup.mjs "<selector>" [--kind class]` prints the result as JSON.

- [ ] **Step 1: Write the failing tests** with a temp repo holding `src/app/plan.component.html`; commit 1 has `<button class="save-btn">Save</button>`, commit 2 changes it to `<button class="plan-save-button">Save Plan</button>`:
  - class `save-btn` → `present: false`, `removedIn.commit` = commit 2, `candidates` = `['plan-save-button']`.
  - text `Save` (text kind) → candidates include `Save Plan`.
  - class `plan-save-button` → `present: true`, `candidates: []`.
  - class `b-grid-row` → `library: true`, no git call made (spy on `git`).
  - class `active` removed in a commit that adds no class on that element → `candidates: []` (Review Focus 5).
- [ ] **Step 2: Run** `node --test tools/heal/source-lookup.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement.** `git grep -F` at `ref` for presence; `git log -S<value> --format=... -- src` for the removing commit; candidates = tokens of the same kind on `+` lines of that commit's hunk that contained the `-` line, minus tokens already on the `-` line.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(heal): FE source lookup for broken locators`.

### Task 5: Heal-diff guard and heal log

**Files:**
- Create: `tools/heal/guard.mjs`, `tools/heal/guard.test.mjs`, `tools/heal/heal-log.mjs`, `tools/heal/heal-log.test.mjs`

**Interfaces:**
- Produces: `checkHealDiff(unifiedDiff: string): { ok: boolean, errors: string[] }`. CLI `node tools/heal/guard.mjs <diff-file>` prints `[heal-guard] N error(s)` (same style as `qa-check`) and exits 1 on errors.
- Produces: `appendHeal(pwRepo: string, entry: HealEntry): void` and `summarize(pwRepo: string, { from?: string, to?: string }): { locatorFailures: number, healed: number, bySource: { fe: number, live: number }, rate: number|null }`. `HealEntry = { date, card, test, page, old, new, source: 'fe'|'live', approved: boolean, rerunPassed: boolean }`. Healed = `approved && rerunPassed`.
- CLI `node tools/heal/heal-log.mjs add '<json>'` (used by the agent after each heal).

- [ ] **Step 1: Write the failing tests:**
  - diff changing only a `.locator('.save-btn')` to `.locator('.plan-save-button')` in `pages/timelinePage/editPlanPage.ts` → ok.
  - diff touching `tests/fe/...spec.ts` → error "only pages/".
  - diff adding `.first()`, `.nth(0)`, `force: true`, `timeout:` → one error each.
  - diff removing a line with `expect(` or changing a line with `expect(` → error.
  - `summarize` over 3 entries (fe approved+passed, live approved+failed, fe not approved) with 3 locator failures → `healed: 1`, `bySource.fe: 1`, `rate: 1/3`; no entries → `rate: null`.
- [ ] **Step 2: Run** `node --test tools/heal/guard.test.mjs tools/heal/heal-log.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** both modules (heal log = one JSON per line; `locatorFailures` counted from `triage.json` files in `output/runs/*` within the date range).
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(heal): diff guard and heal log`.

### Task 6: Pre-flight and per-page baselines

**Files:**
- Create: `tools/heal/preflight.mjs`, `tools/heal/baseline.mjs`, `tools/heal/preflight.test.mjs`, `evals/heal/specs-sample/` (a fake `pages.ts` and two specs)

**Interfaces:**
- Consumes: `updateFe`, `git` (Task 3), `extractTokens`, `GENERIC_TOKENS`, `isLibraryToken` (Task 1), `lookup` (Task 4).
- Produces: `pageUnit(file: string): string` = first path segment under `pages/` (`pages/shutdownLogicPage/locators/locators.ts` → `shutdownLogicPage`, `pages/loginPage.ts` → `loginPage`, `pages/sharedComponent/x.ts` → `sharedComponent`).
- Produces: `pagesUsedBy(pwRepo: string, specFiles: string[]): string[]` (page units) from: `pages.<getter>` usages mapped through the getters/imports in `pages/pages.ts`; direct `@pages/` and `@components/` imports; the same, recursively, for relative `./*.helpers` imports. `@fixtures/pageFixtures` is NOT followed (Review Focus 3).
- Produces: `readBaseline(pwRepo): Record<string, string>` and `advanceBaseline(pwRepo, units: string[], commit: string): void`.
- Produces: `preflight(pwRepo, feRepo, { card?: string, specs?: string[] }): { fe: UpdateResult, atRisk: { page: string, line: number, token: Token, candidates: string[], commit: string, author: string }[], noBaseline: string[] }`. CLI `node tools/heal/preflight.mjs [--card ETM-1234 <spec>...]` prints a table, writes `output/heal/preflight-<date>.md`, says "probably broken" per row.

- [ ] **Step 1: Write the failing tests:**
  - `pageUnit` on the three example paths above.
  - spec using `pages.shutdownLogicPage.actions` and importing `@fixtures/pageFixtures` → `['shutdownLogicPage']` only (Review Focus 3).
  - spec importing `./timeline.helpers` which imports `@pages/timelinePage/editPlanPage` → includes `timelinePage`.
  - with a temp FE repo where the baseline commit has `class="save-btn"` and `origin/develop` renamed it, and a temp pages folder using `.locator('.save-btn')` → one `atRisk` row with candidate `plan-save-button`; a page using `.locator('.active')` → no row (generic); a Bryntum class → no row.
  - unit with no baseline → listed in `noBaseline`, baseline recorded at current `origin/develop`.
- [ ] **Step 2: Run** `node --test tools/heal/preflight.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** both modules.
- [ ] **Step 4: Run** the tests, then the real thing once: `node tools/heal/preflight.mjs` (first run only records baselines). Expected: PASS; real run prints the FE mode and "no baseline yet" for each page unit.
- [ ] **Step 5: Commit** `feat(heal): pre-flight from stms-fe changes with per-page baselines`.

### Task 7: run-card integration (retries, triage, baseline, report)

**Files:**
- Modify: `tools/run-card.mjs` (args at line ~105, `child.on('exit')` at line ~117, `summarise` at line ~63)
- Modify: `tools/evidence-report-v4.mjs` (accept `--triage <file>`, show the cause next to each failed test)
- Create: `tools/heal/run-card.test.mjs` (tests the pure helpers exported from a new `tools/heal/run-plan.mjs`)

**Interfaces:**
- Consumes: `triageRun` (Task 2), `pagesUsedBy`, `advanceBaseline`, `pageUnit` (Task 6), `git` (Task 3).
- Produces: `retriesFor(args: string[]): string[]` → adds `--retries=1` unless the args already have `--retries` or a `-g`/`--grep` containing `@dailyreport`, then `--retries=0`.
- Produces: `specFilesFrom(args: string[], pwRepo: string): string[]` (spec paths in the run-card args, resolved under `tests/fe/`).

- [ ] **Step 1: Write the failing tests** for `retriesFor` (`[]` → `--retries=1`; `['--retries=0']` unchanged; `['-g', '@dailyreport']` → `--retries=0`) and `specFilesFrom`.
- [ ] **Step 2: Run** `node --test tools/heal/run-card.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `run-plan.mjs`, then wire `run-card.mjs`: add retries; on exit run `triageRun`, write `triage.json/md`, print counts per cause (`flaky` shown, never folded into pass); if every test passed, `advanceBaseline(pagesUsedBy(specs), <origin/develop commit>)`; pass `--triage` to the report builder. `summarise` counts a test as passed only from its last result, and lists flaky ones separately.
- [ ] **Step 4: Run** the tests, then `node tools/run-card.mjs ETM-8405 <a short passing spec>` and check `triage.json` exists, the report shows causes, and `output/heal/fe-baseline.json` moved only the used page units. Expected: PASS.
- [ ] **Step 5: Commit** `feat(heal): run-card retries, triage and baselines`.

### Task 8: Live step (Playwright healer + test MCP)

**Files:**
- In `ep-etm-fe-qa` (our Playwright repo, not `stms-fe`): run `npx playwright init-agents --loop=claude`, keep the generated healer agent and its MCP config.
- Create: `tools/heal/pw-mcp.mjs` (starts `node <PW_REPO>/node_modules/@playwright/test/cli.js run-test-mcp-server` with `cwd: pwRepo`, stdio passed through)
- Modify: `.mcp.json` (add server `playwright-test`: `node tools/heal/pw-mcp.mjs`)
- Create: `.claude/agents/playwright-healer.md` here, adapted from the generated healer: proposal only, never keeps its own edits; returns old locator, new locator, page file:line; reads no screenshots.

**Interfaces:**
- Consumes: `resolveRepos` (Task 1).
- Produces: MCP server name `playwright-test`; agent name `playwright-healer`.

- [ ] **Step 1: Run** `npx playwright init-agents --loop=claude` in `PW_REPO`; read what it generated (agent file names, MCP command) before copying anything.
- [ ] **Step 2: Write** `pw-mcp.mjs` and the `.mcp.json` entry; check `node tools/heal/pw-mcp.mjs` starts and waits on stdio (Ctrl-C to stop).
- [ ] **Step 3: Write** `.claude/agents/playwright-healer.md` with the limits above and the guard rule ("your diff must pass `node tools/heal/guard.mjs`").
- [ ] **Step 4: Verify** in a fresh session that `playwright-test` tools are listed, then on a test with a deliberately wrong locator in a scratch copy of a page object, the healer returns a proposal. Restore the page object. Expected: proposal with old/new locator, page file untouched after restore.
- [ ] **Step 5: Commit** both repos separately: `feat(heal): Playwright healer live step` (qa-team-etm) and `chore: add Playwright test agents` (ep-etm-fe-qa).

### Task 9: Team flow, metrics and docs

**Files:**
- Modify: `TEAM.md` (cycle section ~line 67, run command ~line 91, quality gates table): pre-flight before "พร้อมรันไหม"; after the run: triage, heal loop for `locator`, existing failure questions for the rest; new gate G-heal = `node tools/heal/guard.mjs` 0 errors before any heal is offered.
- Modify: `.claude/agents/automation-engineer.md`: heal steps (source lookup → live via `playwright-healer` only when source has no candidate, the token is a library token, or a source heal failed its re-run) → guard → `team.mjs ask --approve --options "Apply,Skip,Manual"` → `team.mjs wait` → apply → re-run with `run-card.mjs -g` (healed tests + same-card specs using the page; other cards' specs listed, `@dailyreport` never) → `heal-log.mjs add`. 2 rounds max.
- Modify: `tools/sprint-metrics.mjs`: section "Self-healing" from `summarize()` per sprint (locator failures, healed, fe/live, rate).
- Modify: `evals/expected.json` + `evals/heal/`: one entry for `guard.mjs` on a bad diff (errors 4) and one on a good diff (errors 0), so `qa-check selftest` covers the guard. (`qa-check` selftest picks the script by `t.cmd`; add `cmd: 'heal-guard'` → `tools/heal/guard.mjs`.)
- Modify: `tools/setup.mjs` (already done in Task 1) and `README.md` (one short "Self-healing" section with the three commands).

- [ ] **Step 1: Write the failing check:** add the two `expected.json` entries and run `node tools/qa-check.mjs selftest`. Expected: FAIL (unknown cmd).
- [ ] **Step 2: Implement** the `cmd: 'heal-guard'` branch in `qa-check.mjs` selftest and the sprint-metrics section.
- [ ] **Step 3: Run** `node tools/qa-check.mjs selftest`, `node --test tools/heal/`, `node tools/sprint-metrics.mjs`. Expected: all fixtures PASS, all tests PASS, metrics prints a "Self-healing" line (rate `-` while the log is empty).
- [ ] **Step 4: Edit** `TEAM.md`, `automation-engineer.md`, `README.md` as listed.
- [ ] **Step 5: Commit** `docs(heal): team flow, gate and metrics for self-healing`.

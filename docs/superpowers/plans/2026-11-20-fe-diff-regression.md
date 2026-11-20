# FE diff -> regression specs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `node tools/regress.mjs` lists the Playwright specs worth re-running for the stms-fe merges since the last regression, ranked Must / Should / Warn with reasons and run commands.

**Architecture:** Four focused modules under `qa-team-etm/tools/regress/`: pure rules (`core.mjs`), read-only git (`git.mjs`), spec index (`specs.mjs`), report (`report.mjs`); `tools/regress.mjs` is the thin CLI. Reuses `tools/heal/fe-git.mjs` (git, updateFe), `selectors.mjs` (extractTokens, GENERIC_TOKENS, isLibraryToken), `source-lookup.mjs` (APP_FILES), `config.mjs` (resolveRepos).

**Tech Stack:** Node 20 ESM, `node:test`, git CLI. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-20-fe-diff-regression-design.md`

## Global Constraints

- Read only: never runs tests, never writes Jira / Xray, never edits stms-fe (git only through `fe-git.mjs`; `updateFe` = fetch / ff-only on clean develop).
- Listable specs: only `tests/fe/e2e/**/*.spec.ts`; never names starting `setup`, `cleanup`, `probe`; never under `setup/`, `manual/`, `explore/`.
- Card keys: every `ETM-\d+` in the merged branch name; a bare number after a key keeps the prefix (`feature/ETM-8666,8664` -> ETM-8666, ETM-8664).
- Skip a direct (non-merge) commit that touches only `package.json` / `package-lock.json`; any other direct commit is its own "no card" group.
- Token rule: token length >= 4, not in `GENERIC_TOKENS`, not `isLibraryToken`; a token used by more than 5 specs does not count; in a big merge (more than 20 changed app files) a token hit is Should with note `big merge` unless the spec hits >= 2 distinct tokens.
- Shared (Warn): `src/app/shared/**`, `src/app/core/**`, `src/app/*.ts`, `src/app/features/<f>/{components,models,utils,services}/**`, `**/*.routes.ts`, except a path a map prefix names (e.g. `components/planning-list`). More than 5 page folders hit -> one line `wide change: consider the full regression` instead of the spec list.
- Each spec appears once in the report (all groups), in its highest tier (Must > Should > Warn), with every reason.
- Run commands: grouped by the card that owns the spec (Story whose Test keys are in the spec's test titles); `node tools/run-card.mjs <OWNER> <files>` for Must, a second for Should; no owner -> `npx playwright test <files> --workers=1 --reporter=line` labelled `results not recorded per card`.
- Range: `--since` else `<PW_REPO>/output/regression/last.json` commit, else oldest commit in `<PW_REPO>/output/heal/fe-baseline.json`, else `--since=14.days.ago` by date; end `--to` default `origin/develop`. The report says which start was used and that QA's deployed commit is unknown.
- Output: `work/REGRESSION/<YYYY-MM-DD>_<since7>..<to7>.md` and `.json`.
- Windows and Mac: `path.join`, git through `execFileSync` (no shell).

## Review Focus

1. A merge whose branch has no card key and only touches a shared util: appears as a "no card" group with Warn lines, not dropped. Test in Task 1 (`tier`) and Task 4 (report).
2. The same spec hit by three merges: one line, three reasons, one run command. Test in Task 1 (`dedupe`).
3. A changed app file no prefix maps: listed under "not mapped", not silently ignored. Test in Task 1.
4. `last.json` missing and no baseline: falls back to 14 days and says so in the report. Test in Task 4.
5. A spec whose Test keys belong to no known Story: goes to the plain playwright command, not to a wrong card's run-card. Test in Task 1 (`commands`).

---

### Task 1: Rules (pure) and the folder map

**Files:**
- Create: `tools/regress/core.mjs`, `tools/regress-map.json`
- Test: `tools/regress/core.test.mjs`

**Interfaces:**
- Produces:
  - `cardKeys(branch: string) -> string[]`
  - `mapPath(map: {prefix: string, specs: string[]}[], fePath: string) -> string[]|null` (spec folders, longest prefix wins; `null` = not mapped). Prefixes are relative to `src/app/features/shutdown-event-list/` unless they start with `src/`.
  - `isShared(map, fePath) -> boolean`
  - `isListable(specPath: string) -> boolean` (path relative to PW repo, `/` separators)
  - `tier({ specs: Spec[], merges: Merge[], map, importers: (fePath) => string[] }) -> { rows: Row[], notMapped: string[], wide: {merge, file}[] }` where `Spec = { file, folder, keys: string[], tokens: Set<string>, owner: string|null }`, `Merge = { commit, branch, keys: string[], files: { path, lines: string[] }[] }`, `Row = { file, tier: 'Must'|'Should'|'Warn', reasons: string[], owner: string|null }` (already deduped across merges).
  - `commands(rows: Row[]) -> string[]`
- `tools/regress-map.json`: `[{ "prefix": "pages/shutdown-logic", "specs": ["shutdownLogic"] }, ...]` with the pages named in the spec (check each spec folder exists under `ep-etm-fe-qa/tests/fe/e2e/`; drop or fix any that does not, and say so in the commit message).

- [ ] **Step 1: Write the failing tests:**
  - `cardKeys('feature/ETM-8666,8664')` -> `['ETM-8666','ETM-8664']`; `cardKeys('features/improve-shutdown-logic')` -> `[]`; `cardKeys('feature/ETM-7343_actual-equal-plan-default')` -> `['ETM-7343']`.
  - `mapPath`: `src/app/features/shutdown-event-list/pages/shutdown-logic/page/x.ts` -> `['shutdownLogic']`; `src/app/features/login/x.ts` -> `null`.
  - `isShared`: `.../components/status-tag/x.ts` true; `.../components/planning-list/x.ts` false (mapped prefix); `src/app/core/a.ts` true; `src/app/app.routes.ts` true.
  - `isListable`: `tests/fe/e2e/shutdownLogic/verifyX.spec.ts` true; `tests/fe/e2e/planning/setupDuplicatePlanEvent.spec.ts` false; `tests/fe/e2e/x/probeY.spec.ts` false; `tests/fe/setup/setupCard.spec.ts` false.
  - `tier`: card merge ETM-8405 + a spec with key of ETM-8405's Tests (owner ETM-8405) -> Must with reason containing `ETM-8405`; token `timeline-grid__cell--activity` in a changed line of a mapped file -> Must with reason naming the token; same folder no token -> Should; token used by 6 specs -> no Must from it; merge with 21 changed app files and one token -> Should with `big merge`; shared file imported by `pages/daily-report/...` -> Warn for dailyReport specs; shared file imported by 6 page folders -> `wide` entry, no Warn rows; one spec hit by 3 merges -> one row with 3 reasons; unmapped app file -> in `notMapped`.
  - `commands`: rows owned by ETM-8405 (Must and Should) -> two `run-card.mjs ETM-8405` lines, Must first; a row with owner null -> one line starting `npx playwright test` and containing `--workers=1 --reporter=line`.
- [ ] **Step 2: Run** `node --test tools/regress/core.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `core.mjs` and the map.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(regress): rules and folder map`.

### Task 2: Read-only git

**Files:**
- Create: `tools/regress/git.mjs`
- Test: `tools/regress/git.test.mjs` (builds a throwaway git repo in `os.tmpdir()` with `git init`, a develop branch and two `--no-ff` merges)

**Interfaces:**
- Consumes: `git(feRepo, args)` from `tools/heal/fe-git.mjs`.
- Produces:
  - `merges(feRepo, since: string, to: string) -> Merge[]` (Task 1 shape): `git log --first-parent --format=%H%x09%P%x09%s <since>..<to>`; a merge's branch is parsed from the subject `Merge branch '<b>' into ...`; files from `git diff --find-renames --unified=0 <parent1> <commit> -- <APP_FILES>`, `lines` = added and removed lines without the `+`/`-`; direct commits as in Global Constraints; `.spec.ts` files dropped.
  - `importers(feRepo, fePath, to) -> string[]`: app files at `<to>` whose import strings end with the changed file's path without extension (`git grep -l` on the file's base name, then filter by the import path).
- [ ] **Step 1: Write the failing tests:** fixture with merges `feature/ETM-1` (changes `src/app/features/shutdown-event-list/pages/worklist/a.ts`) and `fix/no-card` (changes `src/app/shared/u.ts`, imported by `pages/worklist/a.ts`), plus a direct commit touching only `package.json`: `merges` returns 2 entries with branches and `lines`; the package-only commit is absent; `importers(..., 'src/app/shared/u.ts', 'develop')` returns the worklist file.
- [ ] **Step 2: Run** `node --test tools/regress/git.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `git.mjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(regress): read-only merges and importers from stms-fe`.

### Task 3: Spec index

**Files:**
- Create: `tools/regress/specs.mjs`
- Test: `tools/regress/specs.test.mjs` (temp PW repo with two specs, a local helper, one page file, and a temp qa-team root with `work/ETM-9/run-results.json`)

**Interfaces:**
- Consumes: `extractTokens`, `GENERIC_TOKENS`, `isLibraryToken`; `pagesUsedBy` from `tools/heal/baseline.mjs`; `isListable` (Task 1).
- Produces: `specIndex(pwRepo, teamRoot) -> Spec[]` (Task 1 shape): `keys` = `ETM-\d+` in `test(` titles; `tokens` = token values from the spec, its relative imports (recursive) and the files of the page units `pagesUsedBy` returns, filtered by the token rule (without the "more than 5 specs" rule, which `tier` applies); `owner` = the Story whose `work/<KEY>/run-results.json` `tests` (else `.claude/team/work/<KEY>/tests.md`) contains one of `keys`, first match.
- [ ] **Step 1: Write the failing tests:** helper with `locator('.timeline-grid__cell--activity')` -> that spec's tokens include `timeline-grid__cell--activity`; a `.ant-btn` class is absent (library); `probeX.spec.ts` not indexed; the spec titled `ETM-11 - ...` gets owner `ETM-9` when `work/ETM-9/run-results.json` lists `ETM-11`; a spec with an unknown key gets owner `null`.
- [ ] **Step 2: Run** `node --test tools/regress/specs.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `specs.mjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(regress): spec index with tokens and owner card`.

### Task 4: CLI, report, mark, docs

**Files:**
- Create: `tools/regress.mjs` (thin), `tools/regress/report.mjs` (`main(args, deps)` testable)
- Test: `tools/regress/report.test.mjs`
- Modify: `TEAM.md` (one paragraph near "Pre-flight"), `docs/etm-qa-workflow.md` (one addition)

**Interfaces:**
- Consumes: Tasks 1-3; `updateFe`, `resolveRepos`.
- Produces:
  - `node tools/regress.mjs [--since <commit> | --since-days <n>] [--to <ref>] [--card ETM-1234] [--no-update]` (`--since-days n` = last commit of `<to>` before n days ago; the 14-day fallback uses the same rule) and `node tools/regress.mjs mark [<commit>]`.
  - `main(args, { feRepo, pwRepo, teamRoot, now, git?, log }) -> exitCode` (0 ok, 2 usage / repo missing).
  - `startOf(pwRepo, since) -> { ref: string, how: 'given'|'last regression'|'heal baseline'|'14 days' }`.
  - Report `.md`: header (range, how the start was chosen, `QA's deployed commit is unknown: this compares develop`), one section per merge group (card keys or `no card`, branch, changed app files count), a table `Tier | Spec | Reasons`, then `Not mapped`, `Wide changes`, `Run commands`. `.json` holds `{ range, how, groups, rows, notMapped, wide, commands }`. `--card` keeps only merges carrying that key.
  - `mark [<commit>]` writes `<pwRepo>/output/regression/last.json` `{ commit, date, by: 'regress.mjs mark' }`; default commit = `range.to` of the newest `.json` in `work/REGRESSION/`; none -> exit 2.
- [ ] **Step 1: Write the failing tests** (fake merges / specs injected through deps): report file written under `teamRoot/work/REGRESSION/` with the name `<date>_<since7>..<to7>.md`; it contains `no card` for a merge without keys and the Warn row; no `last.json` and no baseline -> header says `14 days`; `mark` with no saved report -> exit 2; `mark` after a report -> `last.json.commit` equals the report's `to`; `--card ETM-1` keeps only that group.
- [ ] **Step 2: Run** `node --test tools/regress/report.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `report.mjs`, `regress.mjs`; edit the two docs.
- [ ] **Step 4: Run** `node --test tools/` (all green), then a real read-only run `node tools/regress.mjs --since-days 7`. Expected: a report file with at least one card group, sensible tiers when read by eye (look at the ETM-8405 merge: its specs under Must).
- [ ] **Step 5: Commit** `feat(regress): regress.mjs report and mark` and `docs(regress): when the lead runs regress.mjs`.

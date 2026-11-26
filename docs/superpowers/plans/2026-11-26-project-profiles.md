# Project Profiles (hand the QA team to other projects) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the QA team repo work for any Jira + Xray + Playwright project by moving everything ETM-specific into a profile (`profiles/etm/`), and give other teams a clean starter copy with no ETM/PTTEP data in it.

**Architecture:** One module, `tools/profile.mjs`, reads the active profile (`QA_PROFILE` env, else `.env`, else `etm`) from `profiles/<name>/profile.json` and gives every tool the card-key regex, Jira URL and repo folder names. ETM-only rules leave CLAUDE.md, TEAM.md, agents and skills and go to `profiles/<name>/rules.md`, which reaches Claude through a generated `.claude/active-profile.md` imported by CLAUDE.md. `tools/export-starter.mjs` copies the repo without client data and refuses to finish if any ETM/PTTEP trace is left.

**Tech Stack:** Node 18+ ES modules, `node:test`, no npm dependencies (the repo has no package.json).

**Spec:** chat decision 2026-11-26 (no separate spec): other team uses the same stack (Jira Cloud + Xray + Playwright); ETM stays a profile in this repo; the user approved "เริ่มเขียนแผน". Coupling measured the same day: 33 tool files hard-code `ETM-\d+`, `pttep.atlassian.net`, `ep-etm-fe-qa`, `stms-fe`; 10 agents, 7 skills, TEAM.md and CLAUDE.md carry ETM rules; `work/` (client card data) is tracked in git.

## Global Constraints

- ETM must keep working exactly as today: same commands, same output files, same board. `node --test tools/` passes the same tests before and after every task (record the baseline count in Task 0).
- Never touch `work/`, `.claude/team/work/`, `.claude/team/*.jsonl` content, or the open board questions (ETM-8034, ETM-8049).
- Work on branch `feat/project-profiles` in its own worktree, cut from the current `feat/ac-proven` HEAD (133 commits ahead of `main`). The main checkout keeps the uncommitted ETM card files.
- No new npm dependencies. Node 18 built-ins only. Paths with `path.join` (team uses Windows and Mac).
- Profile keys: `projectKey` matches `^[A-Z][A-Z0-9_]{1,9}$`; card keys are `<projectKey>-<digits>`.
- Skill names do NOT change in this plan (account copies and CLAUDE.md 3b depend on them). Only their text becomes profile-driven.
- No secret in a profile: credentials stay in env / `.env` (`XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET`, `FIGMA_TOKEN`).
- Comments in code may keep ETM history (e.g. "ETM-8034 (25 Nov): ..."); only executable code and printed strings must be profile-driven. The exporter strips nothing from comments, so its leak scan decides what must still be reworded (Task 8).

## Review Focus

1. A key from another project inside a title (`XETM-12`, `AETM-1`) must not count as an ETM card: `keysIn` uses word boundaries. Test in Task 1.
2. `QA_PROFILE=acme` with no `profiles/acme/` must stop with `profile "acme" not found (profiles/acme/profile.json)`, never fall back to ETM silently. Test in Task 1.
3. A project key with digits/underscore (`AB2`, `QA_X`) must work in every regex. Test in Task 1 and Task 3.
4. After `git pull` changes `profiles/etm/rules.md`, the next `team.mjs start` refreshes `.claude/active-profile.md`; `setup.mjs` reports it stale. Test in Task 6.
5. The export must not leak client data hidden in binary files (PNG screenshots under `docs/`, `evals/`) or in names from `people.local.md`. Test in Task 8.

---

### Task 0: Worktree and baseline

- [ ] **Step 1:** Create worktree `../qa-team-etm-profiles` on new branch `feat/project-profiles` from `feat/ac-proven` HEAD (superpowers:using-git-worktrees).
- [ ] **Step 2:** Run `node --test tools/ 2>&1 | grep -E "^# (tests|pass|fail)"` in the worktree; write the three numbers into `docs/superpowers/plans/2026-11-26-project-profiles.baseline.txt`. Expected: `fail 0` (if not 0, list the failing tests in that file; those are known failures, not regressions).
- [ ] **Step 3:** Commit `chore(profiles): baseline test counts`.

### Task 1: Profile module and the ETM profile

**Files:**
- Create: `profiles/etm/profile.json`, `profiles/_template/profile.json`, `profiles/_template/rules.md`, `tools/profile.mjs`
- Test: `tools/profile.test.mjs`

**Interfaces:**
- Produces (all exported from `tools/profile.mjs`):
  - `loadProfile({ root = ROOT, envFile = path.join(root, '.env'), name } = {}) -> Profile` (name order: `name` arg, `process.env.QA_PROFILE`, `QA_PROFILE=` in envFile, `'etm'`). Throws `Error` with the exact messages below.
  - `profile() -> Profile` cached `loadProfile()` for scripts.
  - `keyRe(p, { anchored = false, global = false } = {}) -> RegExp`: anchored → `^KEY-\d+$`; else `\bKEY-\d+\b`.
  - `isKey(s, p = profile()) -> boolean`, `keysIn(text, p = profile()) -> string[]` (unique, first-seen order), `firstKey(text, p = profile()) -> string` (`''` when none), `browseUrl(key, p = profile()) -> string`.
  - CLI: `node tools/profile.mjs show` prints the active profile JSON; `node tools/profile.mjs key` prints the project key.
- `Profile` shape (= `profile.json` plus `name` and `dir`):

```json
{
  "title": "ETM (EP-Turnaround Management)",
  "jira": { "site": "pttep.atlassian.net", "projectKey": "ETM", "projectId": 14436, "boardId": 4014 },
  "repos": { "pwRepoDir": "ep-etm-fe-qa", "feRepoDir": "stms-fe", "feBranch": "develop" },
  "ui": { "libraryTokenRe": "^(b|ag|ant|nz|ql)-" },
  "docs": { "rules": "rules.md", "uiMap": "docs/UI_Map_ETM.md", "templates": "docs/ETM_Templates" }
}
```

`profiles/_template/profile.json` is the same shape with `"ACME"`, `"acme.atlassian.net"`, `0`, `"acme-fe-qa"`, `"acme-fe"`, `"develop"`, `"^$"` (no library tokens), `null` docs except `rules`. `profiles/_template/rules.md` holds the headings Task 6 fills for ETM (Roles, Data rules, Page rules, Settings) with one-line "write your project's ... here" under each.

- [ ] **Step 1: Write the failing tests** in `tools/profile.test.mjs` (use a temp dir as `root`):
  - `loadProfile({root})` with only `profiles/etm` → `p.name === 'etm'`, `p.jira.projectKey === 'ETM'`.
  - `.env` with `QA_PROFILE=acme` and `profiles/acme` present → `p.name === 'acme'`; env var `QA_PROFILE` beats `.env`.
  - missing profile → throws `profile "acme" not found (profiles/acme/profile.json)`.
  - `projectKey: "etm"` → throws `profile "x": jira.projectKey must match ^[A-Z][A-Z0-9_]{1,9}$`; missing `jira.site` → throws `profile "x": jira.site missing`.
  - `keysIn('[ETM-12] see ETM-7 and XETM-9, ETM-12', etm)` deep-equals `['ETM-12', 'ETM-7']`.
  - `isKey('ETM-1', etm) === true`, `isKey('ETM-1 ', etm) === false`, `isKey('AB2-5', ab2) === true`, `isKey('QA_X-3', qax) === true`.
  - `firstKey('no key', etm) === ''`; `browseUrl('ETM-5', etm) === 'https://pttep.atlassian.net/browse/ETM-5'`.
- [ ] **Step 2:** Run `node --test tools/profile.test.mjs` → FAIL (module not found).
- [ ] **Step 3:** Implement `tools/profile.mjs` and the three profile files. Validate required fields: `jira.site`, `jira.projectKey`, `repos.pwRepoDir`, `repos.feRepoDir`; `repos.feBranch` defaults to `develop`.
- [ ] **Step 4:** Run `node --test tools/profile.test.mjs` → PASS; `node tools/profile.mjs key` prints `ETM`.
- [ ] **Step 5:** Commit `feat(profiles): profile module and ETM profile`.

### Task 2: One place for repo folders

**Files:**
- Modify: `tools/heal/config.mjs` (`resolveRepos`), `tools/run-card.mjs:36,231`, `tools/run-policy.mjs:29`, `tools/figma-spec.mjs:38`, `tools/verdicts.mjs:26`, `tools/setup.mjs:43-57`, `tools/heal/fe-git.mjs` (branch `'develop'` checks at :84, :115)
- Test: `tools/heal/config.test.mjs` (create if missing)

**Interfaces:**
- Consumes: `profile()` from Task 1.
- Produces: `resolveRepos({ envFile, profile: p = profile() }) -> { pwRepo, feRepo, feBranch, sources }` — defaults become `path.resolve(ROOT, '..', p.repos.pwRepoDir)` and `path.resolve(pwRepo, '..', p.repos.feRepoDir)`; `sources.fe` default text `default: <feRepoDir> next to PW_REPO`.

- [ ] **Step 1: Failing test:** with no env and a fake profile `{repos:{pwRepoDir:'acme-qa', feRepoDir:'acme-fe', feBranch:'main'}}`, `resolveRepos` returns paths ending `acme-qa` and `acme-fe`, `feBranch === 'main'`; `PW_REPO` env still wins.
- [ ] **Step 2:** Run `node --test tools/heal/` → the new test FAILS.
- [ ] **Step 3:** Change `resolveRepos`; replace the four private `pwRepo()` helpers and setup.mjs's lookup with `resolveRepos().pwRepo` / `.feRepo`; fe-git takes the branch from `resolveRepos().feBranch`; setup.mjs messages print `p.repos.pwRepoDir` / `feRepoDir` instead of the literal names.
- [ ] **Step 4:** Run `node --test tools/` → baseline counts + the new test, `fail 0`; `node tools/setup.mjs` output unchanged except wording.
- [ ] **Step 5:** Commit `refactor(profiles): repo folders from the profile`.

### Task 3: Card keys from the profile (validation)

**Files:** every `/^ETM-\d+$/.test(...)` usage: `tools/state.mjs:24`, `tools/state/core.mjs:36`, `tools/qa-check.mjs` (114, 125, 310, 339, 343, 402, 416, 430, 472, 525, 562), `tools/run-card.mjs:47`, `tools/run-policy.mjs:120,122`, `tools/push-guard.mjs:56`, `tools/push-plan.mjs:34`, `tools/verdicts.mjs:87,105`, `tools/delete-plan.mjs:108`, `tools/evidence-check.mjs:197`, `tools/expected-source.mjs:149`, `tools/figma-spec.mjs:130`, `tools/auto-next.mjs:81`, `tools/build-change.mjs:149`, `tools/rerun-guard.mjs:157`, `tools/ai-miss.mjs:54`, `tools/xray-step-push.mjs:119`, `tools/sprint-metrics.mjs:36`, `tools/team-metrics.mjs:50,59`, `tools/manual/gate.mjs:39`, `tools/manual/results.mjs:105,124,128`, `tools/regress/specs.mjs:56`
- Test: existing `*.test.mjs` next to each file, plus one new case per CLI in `tools/profile-keys.test.mjs`

**Interfaces:**
- Consumes: `isKey` from Task 1. Usage messages use `${profile().jira.projectKey}-1234` instead of `ETM-1234`; `state/core.mjs` message becomes `card must be <KEY>-<n>, got ...`.

- [ ] **Step 1: Failing test** `tools/profile-keys.test.mjs`: spawn `node tools/state.mjs show AB2-5` (with `STATE_ROOT=<temp>`) and `node tools/push-plan.mjs AB2-5` with `QA_PROFILE=ab2` and a temp `profiles/ab2`; add env `QA_PROFILE_ROOT` (folder that holds `profiles/`) to `loadProfile`'s root lookup in this task so tests never write into the repo's `profiles/`; expect exit code ≠ 2 (key accepted) and no `Usage:` line. Same commands with `ETM-5` under `ab2` → exit 2.
- [ ] **Step 2:** Run it → FAIL.
- [ ] **Step 3:** Replace each `/^ETM-\d+$/.test(x)` with `isKey(x)`; `sprint-metrics`/`team-metrics`/`regress/specs` directory filters too.
- [ ] **Step 4:** `node --test tools/` → baseline + new, `fail 0`.
- [ ] **Step 5:** Commit `refactor(profiles): card key checks from the profile`.

### Task 4: Card keys from the profile (extraction) and Jira links

**Files:** `tools/qa-check.mjs:208,211,266,268`, `tools/evidence-report-v4.mjs:21,139,140,162,188,194,255`, `tools/run-results.mjs:41`, `tools/live-check.mjs:48`, `tools/run-policy.mjs:60,79,98`, `tools/rerun-guard.mjs:35`, `tools/heal/triage.mjs:55`, `tools/manual/steps.mjs:11,62`, `tools/manual/results.mjs:96`, `tools/regress/specs.mjs:62,79`, `tools/sprint-report.mjs:30`, `tools/verdicts.mjs:75`, `.claude/team/team.mjs:60,111`, `tools/heal/selectors.mjs` (`isLibraryToken`), `xray-toolkit/xray-import.mjs:20`
- Test: existing tests of those files

**Interfaces:**
- Consumes: `keyRe`, `keysIn`, `firstKey`, `browseUrl`, `profile().ui.libraryTokenRe`.
- Regexes that embed the key in a bigger pattern (e.g. `^\[(ETM-\d+)\]\[Security\]`, `^##\s+(ETM-\d+)\s+-`, `^verdict-ETM-\d+\.json$`, `^(ETM-\d+)=(\w+)(?::(ETM-\d+))?$`) are built once at module top from `const K = escapeKey(profile().jira.projectKey)` with `new RegExp(String.raw`...${K}-\d+...`)`. Export `escapeKey(key) -> string` from `tools/profile.mjs` (Task 1 file; add its test: `escapeKey('QA_X') === 'QA_X'`).
- `team.mjs` default job (`|| 'ETM'`) becomes `|| profile().jira.projectKey`.
- `evidence-report-v4.mjs` `JIRA` const becomes `browseUrl('')`-prefix; TC link check uses `isKey`.

- [ ] **Step 1: Failing test** in `tools/evidence-report-v4` test (or new `tools/profile-report.test.mjs`): building a report under profile `ab2` from fixture `evals/metrics`-style results titled `AB2-7 TC-01 ...` gives a link `https://ab2.atlassian.net/browse/AB2-7`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Replace the extraction regexes and the constants listed above.
- [ ] **Step 4:** `node --test tools/` → baseline + new, `fail 0`. Then a real ETM smoke: `node tools/evidence-report-v4.mjs` on the newest ETM run folder in `$PW_REPO`, output to the scratchpad → `diff` against that run's existing report, ignoring the generated-time line: no other difference.
- [ ] **Step 5:** Commit `refactor(profiles): key extraction and Jira links from the profile`.

### Task 5: Guard that keeps the code generic

**Files:**
- Create: `tools/profile-lint.mjs`, `tools/profile-lint.test.mjs`

**Interfaces:**
- Produces: `findHardcoded(files: string[], p: Profile) -> Array<{file, line, text}>` — scans non-comment lines (skip lines whose trimmed start is `//`, `*`, `/*`) of `*.mjs` (not `*.test.mjs`) for: `<projectKey>-\d`, `'<projectKey>'`, `"<projectKey>"`, `jira.site`, `repos.pwRepoDir`, `repos.feRepoDir`, `String(jira.projectId)`. CLI `node tools/profile-lint.mjs` scans `tools/`, `.claude/team/*.mjs`, `xray-toolkit/*.mjs` against the ETM profile; exit 1 with `file:line text` per hit.

- [ ] **Step 1: Failing test:** a temp file with `const x = /^ETM-\d+$/;` gives 1 hit; `// ETM-8034 broke` gives 0; `const y = "stms-fe not found"` gives 1.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `node tools/profile-lint.mjs` → exit 0 (fix any leftover the earlier tasks missed, e.g. printed `stms-fe` strings in `heal/*.mjs`, `regress/*.mjs`, `build-change.mjs`, `verdicts.mjs:58`, `run-card.mjs:149,236` → use `p.repos.feRepoDir` / `pwRepoDir`). Add `tools/profile-lint.test.mjs` case that runs the CLI on the real repo and expects exit 0, so `node --test tools/` keeps it.
- [ ] **Step 5:** Commit `test(profiles): lint against hard-coded project values`.

### Task 6: Rules out of CLAUDE.md, TEAM.md, agents and skills

**Files:**
- Create: `profiles/etm/rules.md`
- Modify: `CLAUDE.md`, `TEAM.md`, `.claude/agents/*.md` (10), `.claude/skills/*/SKILL.md` (7), `.claude/team/team.mjs` (`start`), `tools/setup.mjs`, `.gitignore`
- Test: `tools/profile-rules.test.mjs`

**Interfaces:**
- Produces: `syncActiveProfile({ root, p }) -> { path, changed: boolean }` exported from `tools/profile.mjs`: writes `.claude/active-profile.md` = header line `<!-- generated from profiles/<name>/rules.md; edit that file -->` + `# Active project: <title>` + the settings block (site, key, id, board, repos) + rules.md content. `team.mjs start` calls it; `setup.mjs` check prints `OK active profile <name>` or `WARN .claude/active-profile.md is stale: run node tools/setup.mjs --sync-profile`.
- `.gitignore` gets `.claude/active-profile.md`. CLAUDE.md first line under the title: `@.claude/active-profile.md`.

What moves to `profiles/etm/rules.md` (cut, not copy): CLAUDE.md "Settings" block; team rules "Only two roles on QA: TM and JO", "Shutdown Logic: collapse the histogram first"; TEAM.md lines that name ETM modules/pages (Shutdown Logic, SIMOP, Daily Report, Plan Active rule), the sprint JQL `project = ETM` (becomes `project = <KEY>` in TEAM.md), `docs/UI_Map_ETM.md`/`docs/ETM_Templates/` paths (TEAM.md says "the UI map and templates named in the active profile"). Generic rules stay where they are (Skipped never PASSED, test data must be UI-reachable, BA questions in English, dev brief, retest pictures, standing approvals). Agents: description "for the ETM QA team" → "for the QA team"; ETM examples (`ETM-1234`) → `<KEY>-1234`. Skills: `pttep.atlassian.net`, `ETM`, `14436`, `4014` → "the Jira site / project key / id / board of the active profile (`node tools/profile.mjs show`)". `etm-simop-rules` content stays (it is ETM-only); Task 8 excludes it from exports.

- [ ] **Step 1: Failing test:** `syncActiveProfile` on a temp root writes the file with the header, `changed: true`; second call `changed: false`; after editing `rules.md`, `changed: true`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement `syncActiveProfile`, hook it into `team.mjs start` and `setup.mjs` (`--sync-profile` flag + check), move the text.
- [ ] **Step 4:** `node --test tools/` → `fail 0`. `grep -rnE "pttep|14436|ETM-[0-9]|Shutdown Logic|TM and JO" CLAUDE.md TEAM.md .claude/agents .claude/skills --exclude-dir=etm-simop-rules` → only lines that are examples of the profile itself or none. Open a fresh `claude` session in the worktree, ask "project key ของเราคืออะไร และ role บน QA มีอะไรบ้าง" → answers ETM and TM/JO (proves the import works). Run `node tools/export-skills.mjs`; check `dist/account-skills/*/SKILL.md` for ETM values: none except `etm-simop-rules`.
- [ ] **Step 5:** Commit `refactor(profiles): ETM rules move to profiles/etm/rules.md` (do not commit `dist/` zips here; that happens when this branch merges, per CLAUDE.md 3b).

### Task 7: New-profile command

**Files:**
- Modify: `tools/setup.mjs`
- Test: `tools/setup.test.mjs` (create if missing)

**Interfaces:**
- CLI: `node tools/setup.mjs --new-profile <name> --key <KEY> --site <host> --project-id <n> --board <n> --pw-repo-dir <dir> --fe-repo-dir <dir> [--fe-branch <b>]` → copies `profiles/_template/` to `profiles/<name>/`, fills `profile.json`, writes `QA_PROFILE=<name>` to `.env` (replace the line if present, keep other lines), runs `syncActiveProfile`, then the normal check.
- Errors (exit 2): name not `^[a-z][a-z0-9-]{1,30}$`; profile exists; key fails the Task 1 rule; any flag missing (list all missing in one message).

- [ ] **Step 1: Failing tests:** temp root → after the command, `loadProfile({root}).jira.projectKey === 'ACME'`, `.env` has `QA_PROFILE=acme` and still has an existing `PW_REPO=` line; running again → exit 2 `profile "acme" already exists`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** `node --test tools/` → `fail 0`. **Step 5:** Commit `feat(profiles): setup --new-profile`.

### Task 8: Clean starter export

**Files:**
- Create: `tools/export-starter.mjs`, `tools/export-starter.test.mjs`, `docs/new-team-setup.md`

**Interfaces:**
- Produces: `planExport(trackedFiles: string[]) -> { copy: string[], skip: Array<{file, why}> }` and `leakScan(dir, patterns: RegExp[]) -> Array<{file, line, match}>`. CLI: `node tools/export-starter.mjs <outDir>` (outDir must not exist or be empty).
- Copy = `git ls-files` minus: `work/`, `evals/exams/`, `evals/evidence-check/` data files (keep the runner `.mjs`), `docs/modules/`, `docs/UI_Map_ETM.md`, `docs/ETM_Templates/`, `docs/etm-*`, `docs/superpowers/`, `profiles/etm/`, `.claude/skills/etm-simop-rules/`, `dist/`, `.claude/team/*.jsonl`, `.claude/team/knowledge/ai-misses.jsonl`, `.claude/team/people.local.md`, `.claude/settings.local.json`, every binary file (png, jpg, gif, zip, pdf, xlsx, docx, webm) outside `.claude/team/assets/` UI icons.
- After copy: writes `profiles/example/` from `_template` and `.env.example` with `QA_PROFILE=example`; then `leakScan` with patterns `/ETM-\d/`, `/pttep/i`, `/\bstms\b|stms-fe/i`, `/ep-etm/`, `/14436/`, and each person name from `people.local.md` (read at export time, never written out). Any hit → exit 1, print `file:line match`, leave the folder for inspection. No hit → print next steps (`git init`, `node tools/setup.mjs --new-profile ...`).
- `docs/new-team-setup.md`: short English guide for the receiving team (what the team does, how to make their profile, fill `rules.md`, UI map, `.env`, Xray env vars, the run-policy/standing approvals are theirs to decide, the board at localhost:4777). Linked from README of the export.

- [ ] **Step 1: Failing tests:** `planExport(['work/ETM-1/a.md','tools/x.mjs','docs/modules/m.md','.claude/team/assets/logo.png','evals/exams/q.png'])` → copy `['tools/x.mjs','.claude/team/assets/logo.png']`; `leakScan` on a temp dir with `see ETM-12` → 1 hit; with a name from a fake `people.local.md` → 1 hit.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement.
- [ ] **Step 4:** Real dry run: `node tools/export-starter.mjs <scratchpad>/starter`. Expected first time: leak hits in generic files (knowledge `*.md`, comments, README, ONBOARDING). Reword or move each hit to `profiles/etm/` until the export prints no hits. Comments with ETM history in tools may be shortened to a neutral reason (keep the rule, drop the card key).
- [ ] **Step 5:** Commit `feat(profiles): clean starter export`.

### Task 9: End-to-end proof as a new team

- [ ] **Step 1:** In `<scratchpad>/starter`: `git init`, `node tools/setup.mjs --new-profile acme --key ACME --site acme.atlassian.net --project-id 1 --board 1 --pw-repo-dir acme-fe-qa --fe-repo-dir acme-fe`. Expected: profile written, check prints WARN for the missing Playwright repo only.
- [ ] **Step 2:** `node --test tools/` in the starter → `fail 0` (tests that need ETM fixtures must use temp profiles, not `profiles/etm`; fix any that do not).
- [ ] **Step 3:** `node .claude/team/team.mjs start ACME-1` with `TEAM_PORT=4799` → board shows ACME-1; `node tools/qa-check.mjs state ACME-1` accepts the key; stop the board.
- [ ] **Step 4:** Back in the worktree: `node --test tools/` equals baseline + new tests, `node tools/profile-lint.mjs` exit 0, `node tools/setup.mjs` all OK for ETM.
- [ ] **Step 5:** Commit `docs(profiles): new-team guide and e2e notes`; then superpowers:finishing-a-development-branch (merge into `feat/ac-proven` or PR, user decides), run `node tools/export-skills.mjs` and remind the user to re-upload the zips.

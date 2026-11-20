# FE diff -> regression specs (design)

Date: 2026-11-20. Status: draft for the user's approval.

## Why

stms-fe gets about 19 merges into `develop` a week. Most carry a card key in the branch (`feature/ETM-8049`, `feature/ETM-8671-8672`); some do not (`features/improve-shutdown-logic`, `fix/validate-shutdown-timeline`), and those are the real regression risk because nobody writes test cases for them. Today the team either re-runs one card's spec or nothing; there are 100 specs. The user wants a list of the specs worth running for what changed, to pick regression cases now and to feed CI later (CI itself waits until the cases are picked).

## Goals

1. One read-only command lists every stms-fe merge between the last regression and `origin/develop`, grouped by card (or "no card"), and for each the specs to run, ranked:
   - **Must**: specs of the merged card itself, and specs whose locators appear in the changed lines.
   - **Should**: other specs of the same app page (folder map).
   - **Warn**: changes in shared code (`src/app/shared`, `src/app/core`, app root), with the app pages that import the changed file and their specs.
2. Every listed spec carries its reason (which merge, which file, which token or page).
3. The output ends with ready `run-card` commands (one per card group) and is saved as a file the user can read and share.
4. "Last regression" is a recorded stms-fe commit, moved forward only by an explicit command after a regression run.

## Non-goals

- No CI, no scheduler (item 1 waits).
- Never runs tests, never writes Jira / Xray, never edits stms-fe (read-only git through `tools/heal/fe-git.mjs`).
- Not a coverage tool: it does not say which AC is covered.
- No knowledge of the backend: BE changes are not in stms-fe.

## Anti-goals

- A list so long it does not help pick cases (the reason folder-map-only was rejected).
- Silently missing a logic change (the reason locator-only was rejected).
- Claiming QA runs a commit it may not run: QA's deployed commit is unknown, so the range is about `develop`, and the output says so.

## Approaches considered

1. **Folder map only** (stms-fe page folder -> spec folder): simple, catches logic changes, but one changed file selects a whole folder (10+ specs). Rejected alone.
2. **Locator tokens only** (self-healing `extractTokens` on specs vs the diff): precise for UI changes, misses pure logic changes (a formula in a service). Rejected alone.
3. **Both, ranked** (chosen by the user): card key -> its specs and token hits are Must, folder map is Should, shared code is Warn.

## Design

### Inputs

- `FE_REPO` (stms-fe) and `PW_REPO` (ep-etm-fe-qa), resolved like `tools/heal/config.mjs`.
- Range: `--since <commit>` or, by default, the commit in `<PW_REPO>/output/regression/last.json` (`{ commit, date, by }`); none recorded -> the oldest commit of `<PW_REPO>/output/heal/fe-baseline.json`, else 14 days back, and the output says which start was used. End: `--to <ref>`, default `origin/develop` after `updateFe` (fetch / ff-only, never edits).
- Merges: `git log --merges --first-parent <since>..<to>`; for each merge the files changed against its first parent. Direct commits on develop that are not merges (version bumps `[skip ci] up version`) are skipped when they touch only `package.json` / version files; any other direct commit becomes its own "no card" group.
- Card key: every `ETM-\d+` in the merged branch name (`feature/ETM-8666,8664` -> ETM-8666, ETM-8664; a bare number after a key keeps the prefix).

### Which specs can be listed

Only `tests/fe/e2e/**/*.spec.ts`, and never `setup*`, `cleanup*`, `probe*` specs or anything under `setup/`, `manual/`, `explore/` (they change shared QA data or prove nothing). *(Builder's call, after review.)*

### Mapping

- **Card -> specs (Must):** the Test keys of that Story (`work/<KEY>/run-results.json` keys, else `.claude/team/work/<KEY>/tests.md`), then every spec file whose test titles contain one of those keys. A Story with no known Tests is listed as "card has no scripts".
- **Token hits (Must):** for each spec, the tokens its code uses: `extractTokens` over the spec and the local helpers / page objects it imports (same walk as `pagesUsedBy`), without `GENERIC_TOKENS` and library classes (`isLibraryToken`), length >= 4. A spec is a hit when one of its tokens appears in a changed line (added or removed) of an app file of the merge (`APP_FILES`, no `.spec.ts`). Reason names the token and the file. To keep the list short *(builder's call, after review)*: a token used by more than 5 specs does not count (too common); and in a big merge (more than 20 changed app files) a token hit is only **Should**, with the note "big merge", unless the spec also hits 2 or more distinct tokens.
- **Folder map (Should):** `tools/regress-map.json` maps stms-fe path prefixes to spec folders under `tests/fe/e2e/`. Shipped with the known pages (`pages/shutdown-logic` -> `shutdownLogic`, `pages/daily-report` -> `dailyReport`, `pages/timeline` and `pages/shutdown-timeline` -> `shutdownTimeline`, `pages/manpower-mob-plan` and `pages/mob-plan` -> `manpowerMobPlan`, `pages/equipment-mob-plan` -> `equipmentMobPlan`, `pages/worklist-import` -> `importWork`, `pages/worklist` -> `worklist`, `pages/details` / `components/planning-list` -> `planning`, `pages/landing` / `pages/form-event` -> `shutdownEventList`; the builder checks each against the real folders). A changed app file under no prefix is listed as "not mapped" so the map can grow.
- **Shared code (Warn):** a changed file under `src/app/shared`, `src/app/core`, `src/app/*.ts`, or a non-page part of a feature folder (`src/app/features/<feature>/{components,models,utils,services}/**` and `*.routes.ts`, except a component that the folder map names itself, such as `components/planning-list`) *(builder's call, after review: most of stms-fe sits under `features/shutdown-event-list/`, and its shared components and utils are where logic regressions come from)*: find the app files that import it (`git grep` of its import path at `<to>`), map those through the folder map, list those spec folders as Warn. If more than 5 page folders are hit, say "wide change: consider the full regression" instead of listing every spec.
- A spec is shown once across the whole report (all card groups), in its highest tier, with every reason (each merge, file and token).

### Commands (in qa-team-etm)

- `node tools/regress.mjs [--since <commit>] [--to <ref>] [--card ETM-1234]` (read only): prints the groups and writes `work/REGRESSION/<YYYY-MM-DD>_<since7>..<to7>.md` (table per group: tier, spec, reasons; then the run commands) and the same as `.json`.
- `node tools/regress.mjs mark [<commit>]`: records `<commit>` (default: the `--to` commit of the newest saved report) as the last regression in `output/regression/last.json`. The lead runs it only after the user said the regression run is done; it is a local file, no approval kind needed.
- Run commands *(builder's call, after review: `run-card` only takes an `ETM-<n>` key and writes that card's results file and data lock, so specs must run under the card that owns them)*: after dedupe, specs are grouped by the card that **owns** them (the Story whose Test keys are in the spec's titles, from `work/*/run-results.json` / tests.md): one `node tools/run-card.mjs <OWNER> <spec files...>` per owner, Must specs first, then a second command for Should. Specs with no known owner get one plain `npx playwright test <files> --workers=1 --reporter=line` command, labelled "results not recorded per card". `run-card` itself is unchanged.

### Team flow

The lead may run `regress.mjs` at the start of a card's run question ("what else to re-run"), and on request ("ช่วยดู regression จาก dev"). The result goes to the user as the report file link plus a short count per tier; running anything still needs the usual "พร้อมรันไหม".

## Constraints

- Node, no new dependencies, Windows and Mac (`git` through `fe-git.mjs`).
- Must run in seconds to a minute on a week of merges (100 specs, a few hundred changed files).
- QA team rules unchanged (Thai replies, board, approvals).

## Left to the builder

- Exact parsing of `git log` / `git diff` output, rename handling (use `--find-renames`).
- Report layout details.
- Tests: pure functions (branch -> keys, map lookup, tiering, dedupe) with fixtures; one fixture repo test for the git part if cheap; one real read-only run on the user's stms-fe for the last 7 days, checked by eye.

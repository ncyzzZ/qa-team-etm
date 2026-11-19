# Self-healing for the ETM Playwright suite: design

Date: 2026-11-19. Status: draft for approval.

## Why

The ETM QA team (this repo, agents + `tools/`) runs the Playwright suite in `ep-etm-fe-qa` (91 specs).
Today the team is roughly 30-35% "self-healing" (our own estimate, not a measurement): it has safe retries,
quality gates with at most 2 fix rounds, and a lessons log, but a broken locator always stops the run and a
person has to find the new selector by hand.

The app has no test ids (1 `data-testid` in 276 templates). The page objects use 1,410 CSS `.locator(...)`
calls against 446 `getByRole`, so most failures after a front-end release are locators, not bugs.
The user already takes locators from the developers' front-end repo (`stms-fe`, Angular 20, GitLab,
branch `develop`, local clone at `PTTEP_Auto/stms-fe`). The healing should work the same way the user does,
and fall back to the live page only when the source cannot answer.

Success: after a front-end release, the suite tells us which locators are at risk before we run, and a
locator that does break comes back as a ready diff the user approves on the board, then the test re-runs.

## Goals

1. **Pre-flight**: before a run, list the locators in `ep-etm-fe-qa/pages/` that the latest `stms-fe` changes
   probably broke, each with a proposed replacement.
2. **Triage**: after a run, sort every failure into one cause: `locator`, `flaky`, `data`, `env`, `assertion`
   (possible app bug).
3. **Heal** (`locator` failures only): source first (FE repo), then the live page (Playwright healer agent
   through Playwright MCP) when the source cannot answer. Output is a diff, applied only after approval,
   then only the healed tests re-run.
4. **Flaky**: one local retry in `run-card.mjs`, and a test that passes only on retry is reported as `flaky`,
   never shown as a clean pass.
5. **Measure**: a heal log, so "how self-healing are we" becomes a number per sprint.

## Non-goals

- Healing assertions, expected texts or test data. Those are TC questions (playwright-script-rules item 14)
  or app bugs, and stay with the user.
- Adding test ids to the app, or any write to `stms-fe`.
- Running unattended on CI. This works inside the existing lead-driven cycle.

## Anti-goals (a failure even if it "works")

- A heal that makes a test pass by weakening it: adding `.first()` / `.nth()` to dodge a strict-mode error
  without knowing it is the right element, removing an `expect`, widening a text match, raising timeouts.
  The heal may only change how an element is found, never what is checked.
- A real app bug hidden as a "healed locator".
- Editing anything in `stms-fe`: no file edits, `checkout`, `reset`, `merge`, `stash`, commit or push.
  Only bringing code down (`git pull --ff-only` on a clean `develop`, else `git fetch`) and reading.
- Code edits applied without the user's approval.

## Constraints

- Approval rule from `CLAUDE.md`: an approval is a chat reply or the `ANSWER:` line of `team.mjs wait`.
  Every heal diff goes through `team.mjs ask --approve`.
- Existing limits in `agent-protocol.md`: at most 2 fix rounds per test, then offer manual testing.
- Token rules: no screenshots read, `--reporter=line`, evidence built from files.
- The Gantt pages (Bryntum) use library classes such as `.b-grid-row`; these are not in `stms-fe`
  templates, so the source step cannot heal them.
- Works on Mac and Windows (the team uses both), Node only, no new runtime dependency in this repo.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| A | Source only: diff `stms-fe` since the last green run, map changed classes/ids/texts to our locators | Cheap, no browser, deterministic, matches the user's habit. Cannot heal Bryntum or API-driven text. |
| B | Live page only: Playwright `healer` agent + Playwright MCP | Covers everything, but slower, more tokens, and more likely to pick a wrong element. |
| **C** | **A first, B as fallback, plus triage and flaky handling** | **Picked by the user.** Most heals stay cheap and source-backed; B only for what A cannot answer. |

## Design

### Locations

- Tools in this repo: `tools/heal/` (`preflight.mjs`, `triage.mjs`, `source-lookup.mjs`, shared `selectors.mjs`).
- State and output in the Playwright repo, next to the runs:
  `<PW_REPO>/output/heal/fe-baseline.json`, `<PW_REPO>/output/runs/<run>/triage.json|.md`,
  `<PW_REPO>/output/heal/heal-log.jsonl`.
- `FE_REPO` setting, same pattern as `PW_REPO`: env variable, else `FE_REPO=` in `.env`, else
  `<PW_REPO>/../stms-fe`. `node tools/setup.mjs` checks it.

### 1. Pre-flight (`node tools/heal/preflight.mjs [--card ETM-1234]`)

1. **Never edit anything in `stms-fe`** (user's rule): no file edits, `checkout`, `reset`, `merge`, `stash`,
   commit or push. Allowed: bring the latest code down. `git pull --ff-only` only when the clone is on
   `develop` and has no local changes (so it can only fast-forward, never conflict); otherwise just
   `git fetch origin`. Plus read commands (`git log`, `git diff`, `git show`, `git grep`) and plain file
   reads. If GitLab cannot be reached (offline, no VPN), use the `origin/develop` already there and print
   how old it is.
   Diff `<baseline commit>..origin/develop` for `src/**/*.html` and `src/**/*.ts`. `stms-fe` has no translation
   files: visible text is inline in templates and TS; text that comes from the API is left to the live step.
2. Baseline is **per page object** (*our call*): `fe-baseline.json` maps each `pages/**` file to the
   `stms-fe` commit of the last run where every test that used that page passed (`run-card.mjs` writes it).
   A green run of one card moves only the baselines of the pages it touched, so changes to other pages stay
   in later diffs. No baseline yet for a page: the tool records the current commit and says so.
3. Extract locator tokens from `pages/**/*.ts`: CSS classes, ids, attribute values, `:text-is(...)`,
   `getByText`, `getByRole(..., { name })`, `getByPlaceholder`, `getByLabel`.
4. A token that the diff removed and that our pages use = at risk. For each, propose a replacement from
   the lines added in the same hunk (same element, new class/text/id). If none, mark "needs live check".
5. Output: a short table (page file:line, old token, proposed token, FE commit + author) to stdout and
   `output/heal/preflight-<date>.md`. With `--card`, only the page objects that card's specs import.

### 2. Triage (`node tools/heal/triage.mjs <run folder>`)

Reads `results.json` and sorts each failed or retried test:

- `locator`: timeout waiting for a locator, `strict mode violation`, element not found / not visible,
  and the locator is from `pages/`.
- `flaky`: failed, then passed on the retry.
- `data`: known test-data messages (missing record, precondition not met), list kept in the tool.
- `env`: login/SSO failure, network error, HTTP 5xx, page did not load.
- `assertion`: an `expect` on value/text/count failed while the element was found: possible app bug.
- `unknown`: anything else, shown to the user as is.

Output `triage.json` (test key, cause, failing locator and page file:line when known, error first line)
and `triage.md`. The evidence report shows the cause next to each failure.

### 3. Heal (the automation-engineer agent, one failure at a time)

1. **Source step** (`node tools/heal/source-lookup.mjs "<selector>"`): search `stms-fe` at
   `origin/develop` for the token, and `git log -S` to find the commit that removed or renamed it and what
   replaced it. Found: build the diff for the page object.
2. **Live step**, only when the source step finds nothing or the selector is a Bryntum/library class:
   run Playwright's built-in `healer` agent (set up once with `npx playwright init-agents --loop=claude` in
   `ep-etm-fe-qa`; it uses the Playwright test MCP server to run the test to the failing step and read the
   page). The agent's output is used as a proposal only; its own edits are not kept without step 3.
3. **Approve**: show the diff (page file, old vs new locator, source: FE commit or live page) with
   `team.mjs ask --approve --options "Apply,Skip,Manual"`, then `team.mjs wait`.
4. **Apply and re-run** the healed tests through `run-card.mjs ... -g "<keys>"`, plus (*our call*) the
   other specs of the same card that import the healed page. Specs of other cards that import it are listed
   for the user, not run; `@dailyreport` specs are never re-run automatically. Still failing after
   2 heal rounds: stop and offer manual testing (existing rule).
5. Each heal appends one line to `heal-log.jsonl` (date, card, test key, page file, old, new, source
   `fe`/`live`, approved yes/no, re-run pass yes/no).

Guard on every proposed diff (checked by a tool, not by trust): the diff touches only `pages/**` locator
code, adds no `.first()`/`.nth()`/`force: true`/timeout change, and removes no `expect`. A diff that fails
the guard is not offered.

### 4. Flaky

`run-card.mjs` passes `--retries=1` by default (`--retries=0` to turn off). Specs tagged `@dailyreport`
keep 0 retries because they change shared data that is restored only by a separate spec.

### 5. After triage, the non-locator causes

- `assertion`: goes to the existing defect flow (`log-defect-jira-etm` skill, Atlassian MCP), still with
  the user's approval. Never healed.
- `data` / `env`: reported, no heal; the user decides.
- After any re-run, step results go to Xray through the Xray MCP exactly as today.

### 6. Measuring

`tools/sprint-metrics.mjs` gains one section from `heal-log.jsonl`: locator failures, healed (approved and
re-run passed), by source (`fe` / `live`), and pre-flight warnings that were later confirmed.
Self-healing rate = healed / locator failures.

### MCP servers

- **Playwright test MCP** (new, comes with `init-agents`): live step only.
- **Xray MCP** (existing): step results after re-runs.
- **Atlassian MCP** (existing): defects for `assertion` failures, through the existing skill.
- Not used: Claude in Chrome (user's own browser, wrong for headless runs), Datadog, Figma.

### Team integration

- `TEAM.md` cycle: run, then triage, then heal for `locator` failures, then the existing failure questions
  for the rest. Pre-flight runs before "พร้อมรันไหม".
- `automation-engineer.md`: heal steps and the guard.
- `evals/`: fixtures for triage (one per cause) and for pre-flight (a small fake diff), checked by
  `tools/agent-eval.mjs`.
- `lessons-learned.md`: a healed locator that hid a bug, if it ever happens, becomes a lesson.

## Deployed commit is unknown

Which `stms-fe` commit the QA environment (`BASE_URL`) runs is not known and not tied to one branch.
So the source is a hint, never proof: a source heal counts only after its re-run passes against the real
app. If the source proposal fails its re-run, the next round goes straight to the live step (still within
the 2-round limit). Pre-flight warnings say "probably broken", not "broken".

## Left to the builder

- Exact regexes for token extraction and error classification, as long as the eval fixtures pass.
- How the live step is wired: the `init-agents` MCP config lives in `ep-etm-fe-qa`; the builder decides
  whether this repo's `.mcp.json` points at it or the lead runs the healer from that folder.
- Report wording and table layout.

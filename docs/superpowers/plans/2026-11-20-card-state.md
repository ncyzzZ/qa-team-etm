# Card state object (state.json): Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One `state.json` per card that only the lead writes (through `tools/state.mjs`), every agent reads first, gate G0 checks, and the board shows.

**Architecture:** A core module (`tools/state/core.mjs`) owns the schema, validation, checksum, atomic save and path resolution. `tools/state.mjs` is the CLI on top of it. `tools/qa-check.mjs state <KEY>` calls the same validator plus file checks. The board server reads `state.json` read-only. All tests are `node:test` under `tools/state/`.

**Tech Stack:** Node 26 ESM, `node:test`, `node:crypto` (sha256), existing `qa-check.mjs`, `serve.mjs`, `board.html`.

**Spec:** `docs/superpowers/specs/2026-11-20-card-state-design.md`

## Global Constraints

- Location: `.claude/team/work/<KEY>/state.json` (`ROOT` = repo root of qa-team-etm). `schemaVersion: 1`.
- Phases: `start, read, quick-scan, design, review, tc-review, xray-approval, push, scripts, run, failures, heal, closeout, done`. Order not enforced.
- Approval kinds: `run-tests, xray-push, defect, jira-write, delete, heal-apply`. Sources: `chat, board`; `board` evidence must contain `ANSWER:`.
- Guarded moves only: `phase push` needs an `xray-push` approval; `phase closeout`/`done` need a `jira-write` approval.
- Single file kinds: `story, analyst, inspector, draft, review, tests, findings, lastRun`; list kinds: `questions, answers, specs`; plus `extra` map.
- Paths: repo-relative under `.claude/team/work/<KEY>/` or `work/<KEY>/`, or `pw:<path>` under `PW_REPO` (resolve with `tools/heal/config.mjs` `resolveRepos`). `lastRun` exists when `<run>/results.json` exists.
- AC ids: `/AC-\d+(?:\.\d+)*/`; AC lines read with the same regex `qa-check.mjs` uses at line 82.
- `checksum` = sha256 hex of the JSON (2-space indent) of the object without `checksum`. Only `core.save` writes it.
- `history` capped at the last 50 entries. `show` prints at most 25 lines.
- A record in `state.json` is never an approval. Node only, no new dependency, Mac and Windows.

## Review Focus

1. A hand edit (by an agent or a person) that changes any field must fail G0 via the checksum (test in Task 1 and Task 3).
2. A card with no `analyst.md` or no numbered AC (the 13 older cards) must get a state file and a G0 warning, never a crash or an error (test in Task 2 and Task 3).
3. Two quick writes in a row (lead runs `file` then `phase`) must both land; a crash mid-write must not leave a half file (atomic rename; test in Task 1).
4. `pw:` paths when `PW_REPO` is missing or moved: G0 reports the path as missing with the resolved location, no crash (test in Task 3).
5. A Windows path with backslashes given to `state.mjs file` is stored with forward slashes and still checked under the card folders (test in Task 2).

---

### Task 1: Core module

**Files:**
- Create: `tools/state/core.mjs`, `tools/state/core.test.mjs`

**Interfaces:**
- Produces: `PHASES: string[]`, `APPROVAL_KINDS: string[]`, `SINGLE_KINDS: string[]`, `LIST_KINDS: string[]`.
- Produces: `statePath(key: string, root = ROOT): string`.
- Produces: `emptyState(key: string): State` (all fields present, empty lists, `phase: 'start'`).
- Produces: `validate(obj: unknown, key?: string): string[]` (error messages; [] when valid): types of every field, enums, AC id pattern, approval kind/source/evidence rules.
- Produces: `computeChecksum(obj): string`, `load(key, root = ROOT): { state: State|null, errors: string[] }` (errors include "checksum mismatch: edited outside state.mjs").
- Produces: `save(key, state, change: string, root = ROOT): State` (validates, appends `{ at, by: 'lead', change }` to history capped at 50, sets `updated`, writes temp file + rename, writes checksum; throws on invalid).
- Produces: `resolveFile(key, p: string, { root, pwRepo }): { abs: string, allowed: boolean }` (normalises `\` to `/`; `pw:` under pwRepo; else must be under `.claude/team/work/<KEY>/` or `work/<KEY>/`).

- [ ] **Step 1: Write the failing tests** in `core.test.mjs` (temp `root` per test):
  - `save` then `load` round-trips; `load` of a file whose `phase` was changed by `fs.writeFileSync` returns an error matching `/checksum mismatch/` (Review Focus 1).
  - `validate` rejects: unknown phase, approval kind `push`, approval with `source: 'board'` and evidence without `ANSWER:`, approval missing evidence, AC id `AC-x`; accepts `AC-3.1`.
  - `save` 60 times keeps 50 history entries; every entry has `by: 'lead'`.
  - after `save`, no `*.tmp` file is left in the card folder; a save that throws (invalid state) leaves the previous file unchanged (Review Focus 3).
  - `resolveFile`: `'.claude\\team\\work\\ETM-1\\a.md'` → allowed, stored form uses `/` (Review Focus 5); `'pw:tests/x.spec.ts'` → under pwRepo; `'../../etc/passwd'` and `'work/ETM-2/a.md'` (another card) → not allowed.
- [ ] **Step 2: Run** `node --test tools/state/core.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `core.mjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(state): core schema, checksum and atomic save`.

### Task 2: CLI `tools/state.mjs`

**Files:**
- Create: `tools/state.mjs`, `tools/state/cli.test.mjs`, `tools/state/commands.mjs`

**Interfaces:**
- Consumes: everything from Task 1.
- Produces (in `commands.mjs`, each takes `(key, args, { root, pwRepo })` and returns the saved `State` or, for `show`, a string): `init`, `phase`, `file`, `acSync`, `acChanged`, `decide`, `openQ`, `closeQ`, `approve`, `gate`, `show`.
- CLI: `node tools/state.mjs <cmd> <KEY> ...` exactly as in the spec "Writer" block; prints one line `[state] <KEY>: <what changed>` (or the `show` text); exit 1 with the message on any refusal.

- [ ] **Step 1: Write the failing tests** (temp root with a fake card folder, called through `commands.mjs`, plus one spawn test for the CLI):
  - `init` on a card with `story.md`, `analyst.md` (`AC-1`, `AC-2`, `AC-2.1`), `draft-tc.md`, `draft-tc.7cases.bak.md`, `work/<KEY>/questions-for-BA.md` and `-round2.md` → `ac` has 3 active ids; `files.draft` is `draft-tc.md` (not the .bak); `files.questions` lists both rounds in order.
  - `init` on a card with only `story.md` → `ac: []`, no throw (Review Focus 2).
  - `init` twice keeps decisions/approvals from the first run (only fills what is missing).
  - `phase push` without an `xray-push` approval → throws `/xray-push approval/`; with one → saved. `phase closeout` needs `jira-write`. `phase heal` after `phase failures` and back again → allowed (no order).
  - `file` with a missing path → throws `/not found/`; with a path in another card's folder → throws `/outside/`; `file specs pw:...` appends to the list without duplicates.
  - `acSync` after `AC-3` is added and `AC-1` removed from `analyst.md` → `AC-3` active, `AC-1` `dropped` (still present).
  - `approve --source board --evidence "user said yes"` → throws `/ANSWER:/`; `approve --kind xray-push --source chat --evidence "ใช่ push"` → saved.
  - `show` returns at most 25 lines and includes phase, next, active AC count, open questions, last 3 approvals.
  - CLI spawn: `node tools/state.mjs phase ETM-1 bogus "x"` exits 1 with `/unknown phase/`.
- [ ] **Step 2: Run** `node --test tools/state/cli.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `commands.mjs` (AC lines via the qa-check line-82 regex on the `analyst.md` section) and the thin `state.mjs` CLI.
- [ ] **Step 4: Run** the tests, then `node tools/state.mjs init ETM-8405` and `node tools/state.mjs show ETM-8405` on the real card. Expected: tests PASS; real `show` lists 4 question rounds and `draft-tc.md` as current draft.
- [ ] **Step 5: Commit** `feat(state): lead-only CLI for card state`.

### Task 3: Gate G0 in qa-check

**Files:**
- Modify: `tools/qa-check.mjs` (new `checkState()`; add `state: checkState` to the `run` map near line 387; usage text)
- Create: `evals/state/` fixtures (one root per case: `good/`, `edited/`, `missing-file/`, `ac-gap/`, `no-approval/`, `legacy/`), lines in `evals/expected.json`
- Modify: `tools/qa-check.mjs` selftest so a fixture can pass a root: `"args": ["state", "ETM-0001", "--root", "evals/state/good"]`

**Interfaces:**
- Consumes: `load`, `validate`, `resolveFile` (Task 1).
- Produces: `qa-check state <KEY> [--root <dir>]` printing `[qa-check state] N error(s)` like the other gates.

- [ ] **Step 1: Write the failing fixtures** (each a mini repo root with `.claude/team/work/ETM-0001/` and a state.json written by `core.save` through a small `evals/state/make.mjs` so checksums are real), with expected errors: `good` 0; `edited` 1 (`checksum`); `missing-file` 1 (path, shows resolved location; one entry is `pw:` with `PW_REPO` pointing nowhere, Review Focus 4); `ac-gap` 1 (`AC-3` in analyst.md not in state); `no-approval` 1 (`phase: push`, no `xray-push`); `legacy` 0 errors and a warning (`no numbered AC`, Review Focus 2).
- [ ] **Step 2: Run** `node tools/qa-check.mjs selftest`. Expected: the 6 new lines FAIL (unknown command).
- [ ] **Step 3: Implement** `checkState()` (errors and warnings exactly as the spec "Gate" section) and the `--root` option.
- [ ] **Step 4: Run** `node tools/qa-check.mjs selftest` and `node tools/qa-check.mjs state ETM-8405`. Expected: all fixtures PASS; real card 0 errors (warning for the `.bak` drafts).
- [ ] **Step 5: Commit** `feat(state): gate G0 qa-check state`.

### Task 4: Board shows phase

**Files:**
- Modify: `.claude/team/serve.mjs` (`reduce()` job list, line ~95: add `phase`, `next` from `state.json`, read-only, ignore a missing or invalid file)
- Modify: `.claude/team/board.html` (tab button: `<small>` shows the phase when present; card header shows `next`)
- Create: `tools/state/board.test.mjs`

**Interfaces:**
- Consumes: `load` (Task 1). Produces: `phaseOf(key, root): { phase: string|null, next: string|null }` exported from `core.mjs` (never throws).

- [ ] **Step 1: Write the failing test** for `phaseOf`: valid file → phase/next; missing file → nulls; invalid JSON → nulls.
- [ ] **Step 2: Run** `node --test tools/state/board.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `phaseOf`, wire `serve.mjs` and `board.html`.
- [ ] **Step 4: Run** the test; then with the board running, `curl -s localhost:4777/state | node -e "..."` shows `phase` for ETM-8405. Expected: PASS; phase visible on the tab (check with read_page on the board, no screenshot).
- [ ] **Step 5: Commit** `feat(state): board shows card phase`.

### Task 5: Team flow and docs

**Files:**
- Modify: `.claude/team/agent-protocol.md` rule 2 (read state.json first, use its paths and only `active` AC, never write it).
- Modify: `TEAM.md`: Phase 0 (`state.mjs init` after `team.mjs start`); every phase/checkpoint (`state.mjs phase`); after each approval (`state.mjs approve`); after each gate (`state.mjs gate`); before each agent call (`qa-check state`); after a conversation summary (`state.mjs show` first); quality-gates table row G0; note that `work/<KEY>/` and `.claude/team/work/<KEY>/` are two folders and `state.json` lists both.
- Modify: `README.md` short section.

- [ ] **Step 1: Edit** the three files as listed.
- [ ] **Step 2: Run** `node --test tools/state/ tools/heal/`, `node tools/qa-check.mjs selftest`, `node tools/setup.mjs`. Expected: all PASS / all good.
- [ ] **Step 3: Commit** `docs(state): lead and agents use state.json, gate G0`.

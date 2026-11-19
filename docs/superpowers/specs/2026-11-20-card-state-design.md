# Card state object (state.json): design

Date: 2026-11-20. Status: draft for approval. Approach A, picked by the user.

## Why

The ETM QA team is one lead plus 8 agents (analyst, inspector, designer, reviewer, automator, reporter, logger,
playwright-healer). They hand work to each other through files, which is right, but nothing says which file is
current, what was decided, or where the card stands:

- ETM-8405 has four drafts (`draft-tc.7cases.bak.md` ... `draft-tc.31cases.bak.md`) and three rounds of BA questions;
  only habit tells an agent that `draft-tc.md` is current and which BA answer overrode which AC.
- One card lives in two folders: `.claude/team/work/<KEY>/` (agent outputs, git-ignored) and `work/<KEY>/`
  (findings, BA questions, committed for the sprint metrics). `TEAM.md` writes both as `work/<KEY>/`.
- Where the card stands (phase, who is waiting on what) exists only as free text in the board's `events.jsonl`.
- After the conversation is summarised, the lead rebuilds its picture from memory and many files.

Goal: one small machine-readable index per card that the lead keeps current, every agent reads first, and a gate
checks, so agents share one picture of the card and the lead can resume from one file.

## Goals

1. `state.json` per card: phase, AC list, current file of each kind, decisions, open questions, approvals with their
   source, gate results, next step.
2. One writer: the lead, only through `node tools/state.mjs` (never by hand, never by an agent).
3. A gate `node tools/qa-check.mjs state <KEY>` that checks the index against the files.
4. Agents read `state.json` first and use the paths in it, instead of guessing file names.
5. The board shows each card's phase from `state.json`.

## Non-goals

- Moving content into JSON. Content stays in the `.md` / `.json` files it is in today; `state.json` points at them.
- Merging the two card folders (a separate clean-up; `state.json` records full paths so both are reachable).
- Replacing the board's events, the approval flow, or any existing gate.

## Anti-goals

- `state.json` counted as an approval. It only records one. An approval is still only a chat reply or the
  `ANSWER:` line of `team.mjs wait` (CLAUDE.md rule 3). The tool refuses to record an approval without that source.
- A big object copied into every agent prompt (token cost, stale copies). Agents read the file; the lead passes only
  the path.
- Two writers. An agent that edits `state.json` is a gate error.

## Constraints

- Node only, no new dependency, Mac and Windows.
- Lives at `.claude/team/work/<KEY>/state.json` (git-ignored, next to the agent outputs; `qa-check` already uses
  this folder as `WORK(key)`).
- `team.mjs start <KEY>` resets the board for that card; it must not delete `state.json` (resume after restart).
- Token rule: `state.mjs show <KEY>` prints a short summary (under 25 lines), not the JSON.

## Design

### File shape (`schemaVersion: 1`)

```json
{
  "schemaVersion": 1,
  "card": "ETM-8405",
  "phase": "scripts",
  "next": "user runs the specs with VPN on",
  "updated": "2026-11-20T09:12:00+07:00",
  "ac": [{ "id": "AC-1", "text": "first line of the AC", "status": "active|changed|dropped", "source": "story.md" }],
  "files": {
    "story": ".claude/team/work/ETM-8405/story.md",
    "analyst": ".claude/team/work/ETM-8405/analyst.md",
    "draft": ".claude/team/work/ETM-8405/draft-tc.md",
    "review": ".claude/team/work/ETM-8405/review.md",
    "tests": ".claude/team/work/ETM-8405/tests.md",
    "findings": "work/ETM-8405/findings.json",
    "questions": ["work/ETM-8405/questions-for-BA.md", "work/ETM-8405/questions-for-BA-round2.md"],
    "answers": [".claude/team/work/ETM-8405/ba-answers.md"],
    "specs": ["pw:tests/fe/e2e/shutdownTimeline/verifyWeeklyPlanEdit.spec.ts"],
    "lastRun": "pw:output/runs/2026-11-18_132407_ETM-8405",
    "extra": { "automationTable": ".claude/team/work/ETM-8405/automation-table.md" }
  },
  "decisions": [{ "id": "D-1", "text": "Weekly value keeps 1 decimal", "source": "BA answer round 2, F-7", "ac": ["AC-3"], "at": "..." }],
  "open": [{ "id": "Q-1", "text": "...", "owner": "BA", "since": "..." }],
  "approvals": [{ "kind": "xray-push", "what": "push 18 Tests to Xray", "answer": "ใช่ push", "source": "board", "evidence": "ANSWER: ใช่ push (21:26:25)", "at": "..." }],
  "gates": { "G1": { "result": "pass", "at": "..." }, "G3": { "result": "fail", "errors": 2, "at": "..." } },
  "history": [{ "at": "...", "by": "lead", "change": "phase design -> review" }],
  "checksum": "sha256 of the file without this field, written only by state.mjs"
}
```

- `phase` is one of: `start`, `read`, `quick-scan`, `design`, `review`, `tc-review`, `xray-approval`, `push`,
  `scripts`, `run`, `failures`, `heal`, `closeout`, `done` (the TEAM.md cycle plus the heal loop).
- `files` paths: repo-relative (`.claude/team/work/<KEY>/...` or `work/<KEY>/...`), or `pw:<path>` for files in the
  Playwright repo (resolved under `PW_REPO`). `lastRun` is a run folder; it exists when its `results.json` exists.
- Single kinds (`story`, `analyst`, `inspector`, `draft`, `review`, `tests`, `findings`, `lastRun`) hold the current file
  only; old drafts stay on disk but are not listed. List kinds (`questions`, `answers`, `specs`) keep every round in
  order, newest last. `extra` maps any other card file by a short name (automation table, defect drafts...).
- `approvals[].kind` is one of `run-tests`, `xray-push`, `defect`, `jira-write`, `delete`, `heal-apply` (the actions
  CLAUDE.md says need the user's yes).
- `ac[].id` may have a sub-number (`AC-3.1`), the same pattern `qa-check` accepts.
- `checksum` (*our call*): written by `state.mjs` on every save; a hand edit by anyone breaks it and the gate fails.
- `history` keeps the last 50 changes (older ones dropped) so the file stays small.

### Writer: `tools/state.mjs` (lead only)

```
node tools/state.mjs init <KEY>                         create from what is on disk (story.md, analyst.md AC list, files found)
node tools/state.mjs phase <KEY> <phase> "<next step>"
node tools/state.mjs file <KEY> <kind> <path>           set the current file of a kind (checks the file exists)
node tools/state.mjs ac <KEY> sync                      re-read AC-n from analyst.md; new ones active, missing ones "dropped" (never deleted)
node tools/state.mjs ac <KEY> <AC-n> changed "<why>"    mark an AC changed (BA answer, comment)
node tools/state.mjs decide <KEY> "<text>" --source "<where>" [--ac AC-1,AC-2]
node tools/state.mjs open <KEY> "<question>" --owner BA|dev|user   /   close <KEY> <Q-n> "<answer>"
node tools/state.mjs approve <KEY> "<what>" --answer "<text>" --source chat|board --evidence "<chat quote or ANSWER line>"
node tools/state.mjs gate <KEY> <G-id> pass|fail [--errors N]
node tools/state.mjs show <KEY>                         short summary for the lead and for agents
```

- Every write: validates the whole object, writes to a temp file and renames (no half-written file), appends to
  `history`, bumps `updated`.
- `approve` takes `--kind` (list above) and refuses without `--source` and `--evidence`; `--source board` requires the
  evidence to contain `ANSWER:`. A `chat` quote cannot be verified by a tool; it is recorded as the lead's quote of the
  user's reply (accepted, *our call*), and like every entry it is a record, never the approval itself.
- Phase order is NOT enforced (*our call*): cards skip phases (user already has scripts, CLAUDE.md rule 4) and loop
  (failures, heal). Only two moves are guarded: `phase push` needs an `xray-push` approval, `phase closeout` needs a
  `jira-write` approval.
- `init` runs when the lead starts or resumes a card (*our call*); the 13 existing cards get a state file the next time
  they are worked on, not in one batch.
- `file` refuses a path that does not exist or is outside `.claude/team/work/<KEY>/`, `work/<KEY>/` or `PW_REPO`.

### Gate: `node tools/qa-check.mjs state <KEY>` (G0, runs at every phase change)

Errors:
- `state.json` missing, invalid JSON, wrong `schemaVersion` / `card`, or `checksum` does not match (edited outside `state.mjs`).
- A path in `files` that does not exist.
- An `AC-n` in `analyst.md` not in `ac` (run `ac sync`), or an `active` AC that `analyst.md` no longer has.
  No `analyst.md` or no numbered AC (older cards): a warning, not an error.
- An approval without `source` + `evidence`, or a board approval whose evidence has no `ANSWER:`.
- `phase` is `push` with no `xray-push` approval, or `closeout` / `done` with no `jira-write` approval.

Warnings:
- `draft-tc*.bak.md` files in the card folder (old drafts; fine, but they are not current).
- An open question older than 7 days.
(No "files newer than state.json" warning, *our call*: every agent return would trigger it. The lead records each
returned file with `state.mjs file`, which keeps the index current.)

Fixtures in `evals/state/` and lines in `evals/expected.json`, so `qa-check selftest` covers the gate.

### Readers

- `agent-protocol.md` rule 2 gains: "First read `.claude/team/work/<KEY>/state.json` (or run `state.mjs show <KEY>`).
  Use its `files` paths; use only `active` AC; treat `decisions` as facts with their source. Never write it; put what
  should change in your return."
- Lead (`TEAM.md`): `state.mjs init` at Phase 0 (after `team.mjs start`), a `phase` call at each phase and checkpoint,
  `approve` right after each approval, `gate` after each gate run, and `qa-check state` before each agent call.
  After a summary of the conversation: `state.mjs show <KEY>` first.
- Board: `serve.mjs` reads `state.json` of each job and shows `phase` and `next` on the card tab (read only).

## Left to the builder

- Exact summary wording of `show`, the board label style.
- How `init` reads the AC list (reuse the `AC-n` regex `qa-check` already uses).
- Whether `state.mjs` and the gate share one validator module (recommended).

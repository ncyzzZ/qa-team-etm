# Early findings and defect trend per sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record every finding the team raises while reading a card, and build a per-sprint HTML report (Sprints 23-27) that shows the manager defects per Story going down and problems stopped before code.

**Architecture:** Per card `work/<KEY>/findings.json` (written by the lead), per sprint `work/SPRINT<N>/jira.json` (saved by the lead from narrow JQL through the Atlassian MCP), and a zero-dependency Node script `tools/sprint-metrics.mjs` that reads both and writes `work/SPRINT<N>/metrics.html`. Checks live in `tools/qa-check.mjs` and are pinned by fixtures in `evals/` run by `qa-check selftest`.

**Tech Stack:** Node.js ESM, no dependencies, inline SVG charts. Jira through the Atlassian MCP (lead only).

**Spec:** `docs/superpowers/specs/2026-11-19-early-findings-metrics-design.md`

## Global Constraints

- No Jira writes for this feature. Scripts never call Jira; the lead saves JSON.
- Zero dependencies; the report is one self-contained HTML file, no network.
- Found in QA = issue type `Defect`; escaped = `Bug`. Do not use `customfield_15852`.
- A defect counts in its own sprint; denominator = Stories in that sprint.
- Sprints 23, 24, 25 = Jira-only baseline, frozen once saved. 26 = baseline with findings (mostly raised after dev started). 27 = first measured sprint. Marker between 26 and 27.
- Outcome values exactly: `open`, `ac-changed`, `dev-fixed`, `confirmed`, `no-issue`, `ignored`. Kind: `gap`, `conflict`, `risk`, `question`. Impact: `high`, `medium`, `low`.
- "Stopped before code" = `ac-changed` + `dev-fixed` only.
- Backfilled findings carry `"backfilled": true` and are shown as their own line.
- The report names no person.

## Review Focus

- A sprint with 0 Stories in `jira.json`: report shows `-`, never `NaN` or `Infinity`. (Task 2 test `zero stories`.)
- A sprint with no `findings.json` for any card (23-25): finding columns show `-`, not `0`. (Task 2 test `baseline sprint`.)
- A finding whose card belongs to no saved sprint: counted under "unassigned" in the text summary, not silently dropped. (Task 2 test `orphan finding`.)
- `questions-for-BA.md` numbered `1.` vs `Q1` vs `**1.**`: `findings` check finds every number. (Task 1 fixture.)
- `jira.json` with a Story listed in two sprints (carried over): counted in both. (Task 2 test `carry over`.)

---

### Task 1: findings.json format and `qa-check findings`

**Files:**
- Modify: `tools/qa-check.mjs` (new `checkFindings`, add to `run` map and usage line)
- Create: `evals/findings-good/findings.json`, `evals/findings-good/questions-for-BA.md`, `evals/findings-bad/findings.json`, `evals/findings-bad/questions-for-BA.md`
- Modify: `evals/expected.json`

**Interfaces:**
- Produces: `node tools/qa-check.mjs findings <KEY | folder>`; folder holds `findings.json` and `questions-for-BA.md`. `<KEY>` resolves to `work/<KEY>/`. Exit 1 on any ERR.
- Entry shape: `{ id: "F-n", q: number, ac: string|null, kind, impact, raised: "YYYY-MM-DD", story_status: string, outcome, outcome_date: string|null, note: string, later_defect: string|null, backfilled?: boolean }`

- [ ] **Step 1: Write fixtures.** `findings-good`: 3 questions (`1.`, `**2.**`, `Q3`), 3 valid entries. `findings-bad`: 3 questions, entries with: duplicate id `F-1`, outcome `fixed`, missing entry for question 3 → 3 errors.
- [ ] **Step 2: Add to `evals/expected.json`:** `{"name":"findings file matches the questions","args":["findings","evals/findings-good"],"errors":0}` and `{"name":"findings with a duplicate id, a bad outcome and a missing question","args":["findings","evals/findings-bad"],"errors":3,"contains":"question 3"}`.
- [ ] **Step 3: Run `node tools/qa-check.mjs selftest`.** Expected: the two new lines FAIL.
- [ ] **Step 4: Implement `checkFindings()`.** ERR: file missing / not JSON array; id not `F-\d+` or duplicate; kind/impact/outcome not in the allowed lists; `raised` not a date; a question number in `questions-for-BA.md` (regex `^\s*(?:\*\*)?Q?(\d+)[.)]`) with no entry; `outcome != open` and no `outcome_date`. WARN: `later_defect` not `ETM-\d+`; no `story_status`.
- [ ] **Step 5: Run selftest.** Expected: `[selftest] all fixtures behave as expected`.
- [ ] **Step 6: Commit** `qa-check: findings check for findings.json`.

### Task 2: `tools/sprint-metrics.mjs`

**Files:**
- Create: `tools/sprint-metrics.mjs`
- Create: `evals/metrics/work/SPRINT25/jira.json`, `.../SPRINT26/jira.json`, `.../SPRINT27/jira.json`, `.../ETM-9001/findings.json`, `.../ETM-9002/findings.json`
- Modify: `evals/expected.json`, `tools/qa-check.mjs` (selftest accepts a fixture with `"cmd": "metrics"` that runs `sprint-metrics.mjs` instead of itself)

**Interfaces:**
- Consumes: `findings.json` (Task 1 shape).
- `jira.json` shape: `{ "sprint": 26, "sprintId": 17028, "name": "...", "fetched": "ISO", "frozen": false, "stories": ["ETM-1"], "defects": [{ "key", "type": "Defect|Bug", "created", "story": "ETM-1"|null, "status" }] }`
- Produces: `node tools/sprint-metrics.mjs [--work <dir>] [--out <file>] [--marker 27]`. Default work dir `work/`, out `work/SPRINT<latest>/metrics.html`. Prints a text summary whose first line is `[sprint-metrics] sprints <a>-<b>, <n> stories, <d> defects, <b> bugs, <s> stopped before code`. Exported `computeMetrics(sprints, findings) -> [{ sprint, stories, defectsPerStory: number|null, bugs, raised: number|null, before: number|null, after: number|null, stopped: number|null, confirmed, ignored, laterDefect, backfilled }]`.
- A finding belongs to the sprint whose `stories` contains its card key (latest such sprint if carried over).
- "before dev" = `story_status` in `Open`, `Refinement`, `Ready`, `To Do`; anything else = after.

- [ ] **Step 1: Write the mock fixture.** SPRINT24: 0 stories, 0 defects (zero-stories case). SPRINT25: 4 stories, 2 Defects, 1 Bug, no findings. SPRINT26: 2 stories (ETM-9001, ETM-9002), 3 Defects, 0 Bugs; ETM-9001 findings: 2 `ac-changed` (one `backfilled`), 1 `confirmed`, `story_status` `In Development`. SPRINT27: 1 story, ETM-9002 (carry over), 0 defects.
- [ ] **Step 2: Add selftest lines** (`"cmd":"metrics"`, args `["--work","evals/metrics/work","--out","<tmp>"]`) expecting the summary text `sprints 24-27, 7 stories, 5 defects, 1 bugs, 2 stopped before code`, and a second line expecting `unassigned: 0`.
- [ ] **Step 3: Run selftest.** Expected: FAIL (script missing).
- [ ] **Step 4: Implement** loading, `computeMetrics`, text summary, HTML: two inline-SVG line charts (defects per Story; Bugs), a table per sprint (columns from `computeMetrics`, `null` → `-`), a dashed marker before the `--marker` sprint, the "how to read this" box with the definitions from the spec section 5.5 and 7. Thai headings, English ids.
- [ ] **Step 5: Run selftest.** Expected: all pass. Open the HTML once in the browser pane to check it renders (light and dark).
- [ ] **Step 6: Commit** `sprint-metrics: per-sprint defect and findings report`.

### Task 3: Wire it into the team

**Files:**
- Modify: `TEAM.md` (Phase 1, Checkpoint 1, Phase 6, Phase 7, new section "Sprint report"), `.claude/agents/ba-analyst.md` (each open question: `kind`, `impact`, `AC-n`), `.claude/agents/jira-xray-logger.md` (`later_defect` suggestion in the Phase 7 go-ahead), `.claude/skills/log-defect-jira-etm/SKILL.md` (one read-only line pointing to the same).

**Interfaces:**
- Consumes: Task 1 command, Task 2 command.

- [ ] **Step 1:** Phase 1: the lead writes `findings.json` next to `questions-for-BA.md` (with `story_status` from `story.md`) and gate G1 also runs `qa-check findings <KEY>`. Checkpoint 1 shows one line `N findings: a AC changed, b confirmed, c open`. When `ba-answers.md` arrives the lead sets outcomes. Phase 6: every `open` becomes `ignored`. Phase 7: logger suggests a `later_defect` link inside the defect go-ahead question; saved only if the user did not reject it.
- [ ] **Step 2:** "Sprint report" section: the JQL from spec section 4 (narrow fields: key, issuetype, created, status, issuelinks), save to `work/SPRINT<N>/jira.json`, re-fetch current and previous sprint, older ones `frozen: true`; then `node tools/sprint-metrics.mjs`.
- [ ] **Step 3:** Run `node tools/qa-check.mjs selftest`. Expected: all pass.
- [ ] **Step 4: Commit** `TEAM: findings log and sprint report in the cycle`.

### Task 4: Real data and preview

**Files:**
- Create: `work/SPRINT23/jira.json` … `work/SPRINT26/jira.json`, `work/<KEY>/findings.json` for every Sprint 26 card that has `questions-for-BA.md`.

- [ ] **Step 1:** Find the sprint ids of Sprints 23-26 on board 4014 (one JQL on a known Sprint 26 Story, `fields: customfield_10020`, then the same for older sprints). Run the two JQL per sprint with `maxResults` ≤ 100 and narrow fields; save. 23-25 `frozen: true`.
- [ ] **Step 2:** Backfill `findings.json` for Sprint 26 cards from `questions-for-BA*.md` and `ba-answers.md`: `backfilled: true`, `story_status` = status on the date the questions were written (from the file header, else `In Development`). Run `qa-check findings <KEY>` for each: 0 errors.
- [ ] **Step 3:** Run `node tools/sprint-metrics.mjs --marker 27`. Expected: summary line, `work/SPRINT26/metrics.html` written.
- [ ] **Step 4:** Show the user the summary and the report; publish as a private Artifact only if they say so.
- [ ] **Step 5: Commit** `work: Sprint 23-26 Jira data and Sprint 26 findings`.

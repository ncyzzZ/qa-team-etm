# Early findings and defect trend per sprint (design)

Date: 2026-11-19. Status: draft for the user's approval.

## Intent

The QA team (the AI team in this repo) reads every Story before development and sends what would become a defect to BA/dev (`questions-for-BA.md`). The user wants to show their manager, with numbers per sprint, that this lowers the defects of the system. The user only decides; the team records everything itself.

## Goals

1. Every finding raised while reading a card is recorded with an id and an outcome, so it can be counted.
2. One report per sprint for the manager: defects going down over sprints, and how many problems were stopped before code was written.
3. A fair baseline: the sprints before the AI team, read back from Jira.
4. No extra work for the user beyond decisions; almost no extra tokens (scripts, not agents, do the counting).

## Non-goals

- Measuring individual developers or BAs. The report names no person.
- A Jira dashboard or any new Jira field, label or comment (that was approach C; it can come later).
- Changing how defects are logged (`log-defect-jira-etm` stays as is, apart from one read-only lookup).

## Anti-goals (a failure even if it works)

- A number that misleads the manager. Every figure in the report has its definition next to it, and the report says what it does not prove.
- Counting a finding as a "prevented defect" when nothing changed because of it.

## Constraints

- Jira and Xray are reached only through MCP tools from the lead; scripts cannot call Jira. So the lead saves Jira results to JSON and a script builds the report (same pattern as `xray-readback.json`).
- No Jira writes for this feature at all, so no approvals are needed.
- Token rule of `TEAM.md`: counting and the report are done by a script; the lead only runs narrow JQL.
- Reply language Thai; files and report text in English for ids and fields, Thai headings allowed in the report.

## Approaches considered

- A. Jira only (defects per sprint from JQL). Cheap, but cannot show the AI caused the drop.
- **B. Jira plus a findings log per card (chosen by the user).** Proves which drop came from findings; needs 2-3 sprints of data, the baseline comes from Jira at once.
- C. B with every finding written to Jira. Visible in Jira but needs an approval per write, against the "user only decides" goal.

## Design

### 1. Findings log per card: `work/<KEY>/findings.json`

Written by the lead when it writes `questions-for-BA.md` (one entry per question; the question number is the link):

```json
[{ "id": "F-1", "q": 1, "ac": "AC-1.5", "kind": "gap|conflict|risk|question",
   "impact": "high|medium|low", "raised": "2026-11-18",
   "outcome": "open", "outcome_date": null, "note": "",
   "later_defect": null }]
```

- `kind`: gap = rule missing; conflict = AC vs design/other AC; risk = could break; question = wording only.
- `impact`: would the wrong guess change an Expected Result (the existing ⭐) = high.
- `outcome` values:
  - `ac-changed`: BA added or changed a rule because of it (the main "prevented" count).
  - `dev-fixed`: dev changed the build before QA because of it.
  - `confirmed`: BA confirmed the behaviour already intended, nothing changed (a clarification, not a prevented defect).
  - `no-issue`: not a problem.
  - `ignored`: no answer by the time QA starts executing.
  - `open`: still waiting.
- `later_defect`: Jira key of a defect that this finding had predicted (see 3).

### 2. Setting the outcome (the team, not the user)

When `ba-answers.md` arrives or the Story/AC changes, the lead sets each outcome from the answer and the Story diff, and shows a one-line count at Checkpoint 1 ("8 findings: 3 AC changed, 4 confirmed, 1 open"). The user corrects it only if they disagree (chat or board text box). When execution starts (Phase 6), every `open` becomes `ignored`.

A check `node tools/qa-check.mjs findings <KEY>` validates the file (ids, allowed values, every question number of `questions-for-BA.md` has an entry). It runs as part of gate G1.

### 3. Link a later defect to a finding

When the logger creates a defect for a Story (Phase 7), it reads `work/<KEY>/findings.json` and, if one finding describes the same rule, writes the defect key into `later_defect`. Local file only, no Jira write. This gives the third number: "defects the team warned about but nobody fixed".

### 4. Jira data saved by the lead: `work/SPRINT<N>/jira.json`

At sprint end (or when the user asks for the report) the lead runs, with narrow fields:
- Stories of the sprint: `project = ETM AND issuetype = Story AND sprint = <id>` (key, status).
- Defects of the sprint: `project = ETM AND issuetype in (Defect, Bug) AND sprint = <id>` (key, issuetype, created, the "Relates" Story link, Found-in Environment `customfield_15852`, status, resolution).
- Baseline: the same two queries for the earlier sprints (once; saved as `work/SPRINT<N>/jira.json` per past sprint, never fetched again).

### 5. Report: `node tools/sprint-metrics.mjs [--from <sprint>]`

Reads every `work/SPRINT*/jira.json` and every `work/*/findings.json` and writes `work/SPRINT<N>/metrics.html` (self-contained, no network) plus a short text summary for the chat. Contents:

1. Line chart: defects found in QA per Story, per sprint, with a marker at the first sprint with the AI team.
2. Line chart: Bugs found in UAT/PROD per sprint (defects that escaped QA).
3. Per sprint: findings raised, `ac-changed` + `dev-fixed` ("problems stopped before code"), `confirmed`, `ignored`, and `later_defect` count.
4. Top finding kinds and AC areas.
5. A "how to read this" box: definitions, and what the numbers do not prove (sprint size and difficulty differ; better tests can raise QA defects while lowering UAT bugs, so both lines are shown).

Per Story, so a sprint with more cards is not punished. The lead can publish the HTML as a private Artifact for the manager when the user says so.

### 6. Changes to existing files

- `TEAM.md`: Phase 1 writes `findings.json` with the questions; Checkpoint 1 shows the outcome count; Phase 6 turns `open` into `ignored`; new "Sprint report" section with the command.
- `ba-analyst.md`: each open question gets `kind`, `impact` and the `AC-n` it concerns, so the lead can fill `findings.json` without re-reading.
- `jira-xray-logger.md` / `log-defect-jira-etm`: the read-only `later_defect` lookup.
- `tools/qa-check.mjs`: `findings` check plus an `evals/` fixture.
- New `tools/sprint-metrics.mjs`, zero dependencies, with a fixture in `evals/`.

### 7. Counting rules (settled after the builder check)

- **Found in QA vs escaped:** by issue type, as `log-defect-jira-etm` sets it: `Defect` = found in QA, `Bug` = found in UAT or PROD. `customfield_15852` is not used (a project automation is known to flip it).
- **Which sprint a defect counts in:** its own Sprint field (the logger copies the Story's active sprint into it). Denominator = Stories in that sprint; a Story carried over counts in every sprint it is in.
- **Freshness:** every report run re-fetches the current and the previous sprint (late defects land there); older sprints are frozen once saved.
- **`later_defect` link (lead's call):** the logger only suggests a finding; the suggestion is shown in the defect go-ahead question the user already answers in Phase 7, so no extra step. Only a link the user did not reject is saved.
- **Backfill (lead's call):** findings of cards already in `work/` are filled from `questions-for-BA.md` and `ba-answers.md` with `"backfilled": true`; the report shows backfilled numbers as their own line so the manager sees they were set after the fact.
- **Test data:** a mock `jira.json` set in `evals/` lets the report be built and checked before real data exists.

## Left to the builder

- Chart drawing in plain inline SVG (no library), colours and layout of the HTML.
- Exact JQL field ids beyond those named above (read the Jira field list once).
- How to fill `findings.json` for cards already in `work/` (backfill from the existing `questions-for-BA.md` and `ba-answers.md`; Sprint 26 is the first sprint with findings).

## Decided by the user (2026-11-19)

- **Sprint 26 is the baseline, Sprint 27 is the first measured sprint.** In Sprint 26 dev had already started when the team read the cards, so findings came too late to prevent much. From Sprint 27 the team reads every card before dev starts.
- So each finding also records the Story status when it was raised (`"story_status": "Open|Refinement|In Development|..."`), and the report splits findings into "raised before dev" and "raised after dev started". This shows the manager why timing matters, not only that the numbers changed.
- **Sprints 23, 24 and 25 are read too** (user, 2026-11-19), as earlier baseline: Jira counts only (no findings exist for them), saved once and frozen. The chart line runs 23 to 27, with the marker between 26 and 27.
- No deadline for the manager report was given; the report is built after Sprint 27 closes, with a first preview at the end of Sprint 26.

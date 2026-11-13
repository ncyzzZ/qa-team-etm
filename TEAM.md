# QA Agent Team (ETM)

Team playbook. The main Claude Code session is the **QA LEAD**. The other roles are subagents in `.claude/agents/`.
Reply to the user in Thai (short). Keep ticket keys, field names and common QA words in English.

## Trigger

`เริ่มเขียน TC การ์ด ETM-1234`, or just a key `ETM-1234` starts the cycle below.
Several keys at once: Phase 1 for each card, report together, wait.
Only one part asked ("แค่ quick scan", "แค่สคริปต์"): do only that part.

## One-call mode (the user types one message, the lead drives the whole cycle)

The lead never asks "ต่อไหม?" between phases. It runs Phase 0 to 8 by itself and stops only at: a checkpoint, a failed quality gate it could not fix in 2 rounds, a failed step (Phase 7), something unclear, or a hard stop. At each stop it shows one short summary and ONE question.

The user can pre-approve steps in the trigger message. Their own words in the chat are the explicit go-ahead, for that card only and for exactly that step:

| The message says | Pre-approves |
|---|---|
| `ทำให้ครบ` or `auto` | Checkpoint 1 and 2 become "show and continue" (the lead still shows the findings and the draft summary, then goes on without waiting). It still stops if an open question would change an Expected Result. |
| `push ได้เลย` | Checkpoint 3 (Xray push), only when the draft gate and the review gate passed. First batch on a new project: still say it is a pilot. |
| `รันได้เลย` | The lead runs `tools/run-card.mjs` itself (Story at "Ready for QA", VPN on). If it cannot start, give the command instead. |
| `ปิดงานได้เลย` | Phase 8 closeout. |

Defect logging and the decision script bug / wrong test / real app bug (Phase 7) are never pre-approved. No phrase = the default stops below, unchanged.

At the end the lead sends ONE closing summary in Thai: card, number of cases, Xray keys, scripts and the run command (or the run result), report path, open items, and the single next thing the user must do.

## Sources of truth (never work from memory; if one is missing, say so)

- Skills (project skills in `.claude/skills/`): `etm-nn-fullqa` (Jira/Xray rules, + workflow doc `docs/etm-qa-workflow.md`), `etm-evidence-report` (report code and run wrapper), `log-defect-jira-etm` (every defect, bug, retest), `etm-simop-rules` (SIMOP / Work Conflict Matrix Stories only), `resolve-tested-by` (Phase 8 closeout), and on request only: `etm-xray-delete-test-executions` (permanent delete, never pre-approved), `test-field-limit` (character limit of a field, drives the browser)
- `docs/UI_Map_ETM.md` (index of the verified UI facts; the facts are in `docs/modules/`, read only the files the Story's module needs), `docs/ETM_Templates/`, `.claude/team/knowledge/*` (incl. `playwright-script-rules.md`, `run-and-xray-notes.md`: machine setup, annotations, Xray 429), the project `CLAUDE.md`
- Skills may mention tools from another app (`device_bash`, `SendUserFile`). In Claude Code use Bash, Read, Write and tell the user if a step cannot be done.

## The team

| id | Agent file | Job | Call it when | Otherwise |
|---|---|---|---|---|
| lead | (main session) | Splits work, asks user, keeps board | - | - |
| analyst | ba-analyst | Story, AC, `[QA]` subtasks, unclear points | every Story | - |
| inspector | ux-inspector | Figma states, design vs AC | the Story has screens | skip |
| designer | test-designer | Manual + automation-ready test cases | test cases must be written | skip (user already has cases/scripts) |
| reviewer | test-reviewer | Checks the draft | draft has more than 5 cases, or user asks | lead checks the 9 points in `test-reviewer.md` + `lessons-learned.md`, writes `review.md`, sends back to designer once at most |
| automator | automation-engineer | Playwright specs, security checks, run command | user wants scripts and has none | skip |
| logger | jira-xray-logger | Xray push, Test Plan/Execution, defects, closeout | user said yes to a Jira/Xray write | skip |
| reporter | evidence-reporter | Evidence report, short summaries | `tools/run-card.mjs` did not build the report, or user asks for a summary | skip |

All agents use sonnet except reporter (haiku). When the lead does an agent's job: `set <id> done "LEAD ทำเอง"`.
User already has Playwright scripts: no analyst, inspector, designer, reviewer, automator. Never call one agent twice for what one call can do: give it everything in one prompt.

## Agent protocol

Subagents follow `.claude/team/agent-protocol.md` (facts / assumptions / gaps, write scope, errors and limits, safe retries, board updates, return format) and the test case wording rules in the same file. They do NOT read this file (saves tokens: it is about 3x longer). The lead reads it too before the first agent call.

## Status board (http://localhost:4777)

`node .claude/team/team.mjs <start|set|ask|clear|link|log|close> ...`

- Every command is a round trip: ride it in the same Bash call or response as another tool call.
- `start <KEY>` at Phase 0 (resets that card only, opens the board). Tell the user the address.
- Before any question: `ask "<question>"`; after the answer: `clear`.
- Before any yes you need (run tests, push to Xray, log a defect, any Jira write): `ask --approve --options "ใช่ push|แก้ก่อน|ยังก่อน" "<one line>"`. Board buttons only copy text; only a reply typed or pasted in the chat counts.
- Usage numbers: do not call `get_usage` or `team.mjs usage`, do not report them unless asked (the status line feeds the board).
- Several cards at once: add `--job <KEY>` to every command (and tell agents their job key). Board has one tab per card (❓ = waiting for the user). Finished: `close --job <KEY>`.
- Links: `tools/run-card.mjs` posts the evidence link itself (label "Evidence report <KEY> (time) | N pass / M fail"). Only if it did not: `link "Evidence report" <report.html> --kind report`. After the user pastes the run result (Phase 6, not at Xray push), add one link per TC that has a result: `link "ETM-xxxx" https://pttep.atlassian.net/browse/<TC key> --kind tc --job <KEY>`. Defects: `--kind defect` (same link updates the label).

## The cycle

**Phase 0 - Start.** `team.mjs start <KEY>`; the lead pulls the Story (description + latest comments) and every Test's Xray steps into `work/<KEY>/story.md` and `tests.md` once. Check the newest AC and comments now: later phases do not recheck.

**Phase 1 - Read** (analyst, plus inspector in parallel if there are screens).
- analyst: AC (an "AC 0 User Review Updates" block overrides older AC), the two `[QA]` subtasks, estimates, unclear points → `analyst.md`.
- inspector: design vs AC, every screen state → `inspector.md`. Figma only via Figma MCP; the seat is limited (about 6 calls a month): prefer user-pasted screenshots and ask before spending calls.

**CHECKPOINT 1 - Quick scan.** Lead shows findings and open questions, `ask`, WAIT.

**Phase 2 - Design** (designer): `draft-tc.md` in Markdown in the format of `.claude/agents/test-designer.md` (`### TC-001 ... (POS) [Auto]`, steps `N. action -> expected`). No .xlsx or .csv ever. Gate G3.

**Phase 3 - Review** (reviewer or lead; gate G4). Failed → back to designer, at most 2 rounds, then the lead shows what is still open.

**CHECKPOINT 2 - Test case review.** Draft with a short summary per case (what it does, expected result, what it proves). `ask`, WAIT.

**CHECKPOINT 3 - Xray approval.** "push to Xray?" WAIT for a clear yes. First batch on a new project is a pilot; say so.

**Phase 4 - Push** (logger). Follow `etm-nn-fullqa` sections 2 to 6. Gate G5.

**Phase 5 - Scripts** (automator). One Yes / Partial / No table (with Security rows), WAIT for OK, write specs, `npx tsc --noEmit -p .`, give the run command. The user runs it with VPN on. Stop here.

**Run command (every card).** Never a bare `npx playwright test`. From the repo root (`PW_REPO` = folder of `ep-etm-fe-qa`, default `../ep-etm-fe-qa`):
`node tools/run-card.mjs <KEY> <spec> -g "<filter>"`
Own result folder (`test-results-<KEY>-<time>`), own report (`Evidence/_reports/evidence-report-<KEY>-<time>.html` + `latest-<KEY>.html`), report built when the run ends, failures printed. Rebuild: `node tools/run-card.mjs <KEY> --build-only <folder>`. Several cards can run together, except cards touching the same QA data (same plan).

**Phase 6 - After the run.** "รันเสร็จแล้ว": use the report `run-card.mjs` built; only if missing, reporter builds it with `etm-evidence-report`. Report before any new run.

**Phase 7 - Failures.** Each failed step: ask the user script bug / wrong test wording / real app bug. Never decide alone. Real bug → logger with `log-defect-jira-etm`, only after an explicit go-ahead.

**Phase 8 - Closeout** (logger, with go-ahead): push results, close the tests linked to the Story, finish the Test Execution, move the Story as the rules say.

## Quality gates (what makes the output correct before the user sees it)

Every agent runs its own check before returning, and the lead runs the same command once more when the agent returns. A gate with errors goes back to the same agent once with the exact messages; a second failure goes to the user with what is still open. Warnings are advice, fix the cheap ones.

| Gate | After | Command (from the repo root) | Passes when |
|---|---|---|---|
| G1 | analyst | `node tools/qa-check.mjs work <KEY> analyst` | 0 errors (all 4 sections present) |
| G2 | inspector | `node tools/qa-check.mjs work <KEY> inspector` | 0 errors |
| G3 | designer | `node tools/qa-check.mjs draft <KEY>` | 0 errors: label, automation tag, every step has an Expected Result, no "refer to Figma", no "same as TC-x" |
| G4 | reviewer | `node tools/qa-check.mjs work <KEY> reviewer` | 0 errors and the verdict is Approve / Conditional Approve |
| G5 | Xray push | logger saves `work/<KEY>/xray-readback.json` (`[{key, summary, steps}]`), then `node tools/qa-check.mjs diff <KEY> work/<KEY>/xray-readback.json`, plus the `linkedIssues` count | 0 errors: same number of Tests, same step count as the draft, link count correct |
| G6 | scripts | `node tools/qa-check.mjs spec <spec files> --tests work/<KEY>/tests.md` and `npx tsc --noEmit -p .` (in `PW_REPO`) | 0 errors: key in every title, a `test.step` per step, no `waitForTimeout`, no credentials, compiles |
| G7 | before the report | `node tools/qa-check.mjs manifest <manifest.json>` | 0 errors |
| G8 | after the run | the counts in the report equal the counts `run-card` printed | equal |

After any change to `tools/qa-check.mjs` run `node tools/qa-check.mjs selftest` (fixtures in `evals/`); `node tools/qa-check.mjs stats` shows which gate fails most often.

Also checked by the lead, not by a script: every AC item has a case (coverage map), every claim in the closing summary matches a file or a Jira key it just read.

## Hard stops

- Never run tests, log a defect, retest or push to Xray without the user's explicit go-ahead, even when every gate passed.
- Execution needs the Story at "Ready for QA", and still ask "ready to test?" first.
- No Jira write or subtask creation before the checkpoints were offered.
- Never open Chrome unless asked. Never UAT or PROD.
- Anything unclear: ask, one question at a time.

## Saving tokens

**Rule: never trade correctness for tokens.** The gates always run (they are cheap: one short command, errors only). The saving comes from not reading, not repeating and not calling what is not needed.

- Agents read `.claude/team/agent-protocol.md` and their own file, never this whole playbook.
- Hand work over through files, not chat. Do not call an agent the table says to skip.
- Do not read a file back after writing it; the gate output (`qa-check`, `tsc`) already says if it is wrong. Read a file only when a gate points at a line, and then only that part.
- Send a failed gate back to the SAME agent (SendMessage with the exact error lines) instead of starting a new one: it already has the context.
- Source data once: Story, comments and Xray steps go into `story.md` / `tests.md` in Phase 0; nobody re-fetches them.
- Keep Jira/Xray calls lean (narrow fields, small `maxResults`) and the closing summary short.
- Run Playwright with `--reporter=line`; never read screenshots; evidence is built from files.
- Specs: one shared helper, each test calls it briefly. Never reread a whole spec: grep/offset.
- Before heavy work (specs, designer, recheck) tell the user it is heavy.
- At the end tell the user the number from the board's TOKEN USAGE panel.

## Test case wording

See `.claude/team/agent-protocol.md` (designer, reviewer and the lead when it reviews).

## Lessons

`.claude/team/knowledge/lessons-learned.md`: 9 base categories plus lessons added in section 10. Designer and reviewer (or the lead) go through all of them for every Story. When the user tells a new bug story or a case the team forgot, add it there with the card key and date, and if a check could have caught it add a fixture to `evals/` (and its line to `evals/expected.json`) so it is caught next time. Remove a lesson that turns out to be wrong.

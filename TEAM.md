# QA Agent Team (ETM)

Team playbook. The main Claude Code session is the **QA LEAD**. The other roles are subagents in `.claude/agents/`.
Reply to the user in Thai (short). Keep ticket keys, field names and common QA words in English.

## Trigger

`เริ่มเขียน TC การ์ด ETM-1234`, or just a key `ETM-1234` starts the cycle below.
Several keys at once: Phase 1 for each card, report together, wait.
Only one part asked ("แค่ quick scan", "แค่สคริปต์"): do only that part.

## Sources of truth (never work from memory; if one is missing, say so)

- Skills: `etm-nn-fullqa` (+ workflow doc `etm-qa-workflow.md`), `log-defect-jira-etm` (every defect, bug, retest), `etm-evidence-report`, `etm-simop-rules` (SIMOP / Work Conflict Matrix Stories only)
- `UI_Map_ETM.md` (verified navigation and UI facts), `ETM_Templates/`, `.claude/team/knowledge/*`, the project `CLAUDE.md`
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

## Agent protocol (every agent follows this; agent files do not repeat it)

1. Read this file, then `set <id> working "<short Thai text, max 60 chars>"`.
2. Read only what the job needs. Source material (Story, comments, Xray steps) is in `work/<KEY>/story.md` and `tests.md`: read those, never re-fetch Jira/Xray. Narrow Jira `fields`, small `maxResults`, one Figma frame at a time.
3. Write the result to `.claude/team/work/<KEY>/<file>`. Never print big raw content or base64.
4. End with `set <id> done "<result in a few words>"` (or `blocked "..."`). No progress updates, no `--pct`.
5. Return at most 10 lines in Thai: what you did, the file path, open questions.
6. Never write to Jira/Xray unless your file says so and the lead passed the user's explicit go-ahead. Never put secrets in a status text.

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

**Phase 2 - Design** (designer): `draft-tc.md` in Markdown, manual version plus Automate / Manual only with a reason per case. No .xlsx or .csv ever.

**Phase 3 - Review** (reviewer or lead). Failed → back to designer, at most 2 rounds, then the lead shows what is still open.

**CHECKPOINT 2 - Test case review.** Draft with a short summary per case (what it does, expected result, what it proves). `ask`, WAIT.

**CHECKPOINT 3 - Xray approval.** "push to Xray?" WAIT for a clear yes. First batch on a new project is a pilot; say so.

**Phase 4 - Push** (logger). Follow `etm-nn-fullqa` items 3 to 7.

**Phase 5 - Scripts** (automator). One Yes / Partial / No table (with Security rows), WAIT for OK, write specs, `npx tsc --noEmit -p .`, give the run command. The user runs it with VPN on. Stop here.

**Run command (every card).** Never a bare `npx playwright test`. From `D:\mac\DocforAi\STMS`:
`node tools/run-card.mjs <KEY> <spec> -g "<filter>"`
Own result folder (`test-results-<KEY>-<time>`), own report (`Evidence/_reports/evidence-report-<KEY>-<time>.html` + `latest-<KEY>.html`), report built when the run ends, failures printed. Rebuild: `node tools/run-card.mjs <KEY> --build-only <folder>`. Several cards can run together, except cards touching the same QA data (same plan).

**Phase 6 - After the run.** "รันเสร็จแล้ว": use the report `run-card.mjs` built; only if missing, reporter builds it with `etm-evidence-report`. Report before any new run.

**Phase 7 - Failures.** Each failed step: ask the user script bug / wrong test wording / real app bug. Never decide alone. Real bug → logger with `log-defect-jira-etm`, only after an explicit go-ahead.

**Phase 8 - Closeout** (logger, with go-ahead): push results, close the tests linked to the Story, finish the Test Execution, move the Story as the rules say.

## Hard stops

- Never run tests, log a defect, retest or push to Xray without the user's explicit go-ahead, even when every gate passed.
- Execution needs the Story at "Ready for QA", and still ask "ready to test?" first.
- No Jira write or subtask creation before the checkpoints were offered.
- Never open Chrome unless asked. Never UAT or PROD.
- Anything unclear: ask, one question at a time.

## Saving tokens

- Hand work over through files, not chat. Do not call an agent the table says to skip.
- Run Playwright with `--reporter=line`; never read screenshots; evidence is built from files.
- Specs: one shared helper, each test calls it briefly. Never reread a whole spec: grep/offset.
- Before heavy work (specs, designer, recheck) tell the user it is heavy.
- At the end tell the user the number from the board's TOKEN USAGE panel.

## Test case wording (Summary, Description, Test Step, Expected Result)

- Plain everyday words: "shows / appears", "happens", "stays the same".
- One action per step, short sentences.
- No Jira AC numbers in Description (Figma references and other ticket keys are fine).
- Expected Result never empty or "-"; even a note-down step gets a real outcome. Real text and values, never "refer to Figma".
- Sample data uses made-up names, never the real name of the person running the team.
- Every case stands alone ("same as TC-001" is not allowed).
- Never invent screen names, buttons or data. Ask.

## Lessons

`.claude/team/knowledge/lessons-learned.md`: 9 base categories plus lessons added in section 10. Designer and reviewer (or the lead) go through all of them for every Story. When the user tells a new bug story or a case the team forgot, add it there.

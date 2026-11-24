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
| manual | manual-runner | Does ONE manual Test from its `manual-steps` table in a headless browser on QA, picture per step, proposed verdict per step | Phase 6, a manual Test with a steps file and no `needs: excel` | skip |
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
- Before any yes you need (run tests, push to Xray, log a defect, any Jira write): `ask --approve --options "ใช่ push|แก้ก่อน|ยังก่อน" "<one line>"`. The user answers on the board (buttons or the text box) or in the chat. Right after `ask`, run `team.mjs wait [--job <KEY>]` in the background: exit 0 prints `ANSWER: <text>` (given on the board), it has no time limit by default, so run it once per question and leave it running (exit 3 only with an explicit `--timeout`), exit 4 = the question was closed another way. Only a reply typed in the chat or that `ANSWER:` line counts. A board answer given while no `wait` was running (for example after the chat was restarted) is shown on the next chat message by the UserPromptSubmit hook (`team.mjs answers`, "BOARD ANSWERS NOT READ YET"): then run `team.mjs wait --job <KEY>`, which prints it at once; that `ANSWER:` line is the approval, not the hook text. A permanent delete can be approved on the board too: the question says what is deleted, how many, and that it cannot be undone. When the user answers in the chat instead, run `team.mjs answered --job <KEY> "<their answer>"`: it closes the question on the board, shows the chat answer in the board log and ends the background `wait` (exit 4, CLOSED). The hook also lists questions still open on the board on every chat message ("BOARD QUESTIONS STILL OPEN"), so a chat answer is never left unlinked.
- Usage numbers: do not call `get_usage` and do not report them unless asked (the board no longer shows them).
- Several cards at once: add `--job <KEY>` to every command (and tell agents their job key). Board has one tab per card (❓ = waiting for the user). Finished: `close --job <KEY>`.
- Links: `tools/run-card.mjs` posts the evidence link itself (label "Evidence report <KEY> (time) | N pass / M fail"). Only if it did not: `link "Evidence report" <report.html> --kind report`. After the user pastes the run result (Phase 6, not at Xray push), add one link per TC that has a result: `link "ETM-xxxx" https://pttep.atlassian.net/browse/<TC key> --kind tc --job <KEY>`. Defects: `--kind defect` (same link updates the label).

## The cycle

**Card state (`state.json`, every card, lead only).** One index per card at `.claude/team/work/<KEY>/state.json`: phase, AC list, current file of each kind (both card folders: agent outputs in `.claude/team/work/<KEY>/`, findings and BA questions in `work/<KEY>/`), decisions, open questions, approvals with evidence, gate results. Only the lead writes it, only with `node tools/state.mjs`:
- Phase 0, right after `team.mjs start`: `state.mjs init <KEY>` (also when resuming a card; keeps what is there).
- Each phase or checkpoint: `state.mjs phase <KEY> <phase> "<next step>"`. Each file an agent returns: `state.mjs file <KEY> <kind> <path>`. After the analyst or a BA answer: `state.mjs ac <KEY> sync` / `ac <KEY> <AC-n> changed "<why>"`, `decide`, `open`/`close`.
- Right after each approval (chat reply or `ANSWER:` line): `state.mjs approve <KEY> "<what>" --kind <run-tests|xray-push|defect|jira-write|delete|heal-apply> --answer "..." --source chat|board --evidence "..."`. The record is not the approval; `phase push` and `phase closeout` refuse without the matching record.
- After each gate: `state.mjs gate <KEY> <G-id> pass|fail`. Before each agent call: gate G0 `node tools/qa-check.mjs state <KEY>`; give the agent only the card key and the path of `state.json`.
- After a summary of the conversation, or when unsure where the card stands: `state.mjs show <KEY>` first.
- `state.json` and G0 keep the team consistent; they are not a security gate. A board approval is checked against the board's own record; a chat approval is the lead's quote, marked "not verified" and listed by G0 so the user can see it.

**Phase 0 - Start.** `team.mjs start <KEY>`; the lead pulls the Story (description + latest comments) and every Test's Xray steps into `work/<KEY>/story.md` and `tests.md` once. Check the newest AC and comments now: later phases do not recheck.

**Phase 1 - Read** (analyst, plus inspector in parallel if there are screens).
- analyst: AC (an "AC 0 User Review Updates" block overrides older AC), the two `[QA]` subtasks, estimates, unclear points → `analyst.md`.
- inspector: design vs AC, every screen state → `inspector.md`. Figma only via Figma MCP; the seat is limited (about 6 calls a month): prefer user-pasted screenshots and ask before spending calls.

**Findings log (every card, done by the lead, no user step).** From the analyst's (and inspector's) open questions the lead writes `work/<KEY>/questions-for-BA.md` (English, for BA/dev) and `work/<KEY>/findings.json`, one entry per question: `{id: "F-n", q, ac, kind, impact, raised, story_status, outcome: "open", outcome_date: null, note, later_defect: null}` (`story_status` = the Story status in `story.md` today). Check: `node tools/qa-check.mjs findings <KEY>` (part of G1). When `ba-answers.md` arrives or the AC changes, the lead sets each outcome: `ac-changed` (BA added or changed a rule because of it), `dev-fixed` (dev changed the build before QA), `confirmed` (already intended, nothing changed), `no-issue`. Phase 6 turns every `open` into `ignored`. Phase 7 links a defect to the finding that warned about it (`log-defect-jira-etm`). Values and rules: `docs/superpowers/specs/2026-11-19-early-findings-metrics-design.md`.

**CHECKPOINT 1 - Quick scan.** Lead shows findings and open questions, plus one line `N findings: a AC changed, b confirmed, c open` when outcomes exist, `ask`, WAIT.

**Phase 2 - Design** (designer): `draft-tc.md` in Markdown in the format of `.claude/agents/test-designer.md` (`### TC-001 ... (POS) [Auto]`, steps `N. action -> expected`). No .xlsx or .csv ever. Gate G3.

**Phase 3 - Review** (reviewer or lead; gate G4). Failed → back to designer, at most 2 rounds, then the lead shows what is still open.

**CHECKPOINT 2 - Test case review.** First the AC to case table from `node tools/qa-check.mjs coverage <KEY>` (pasted as is, no tokens spent writing it), then a short summary per case (what it does, expected result, what it proves). `ask`, WAIT.

**CHECKPOINT 3 - Xray approval.** "push to Xray?" WAIT for a clear yes. First batch on a new project is a pilot; say so.

**Phase 4 - Push** (logger). Follow `etm-nn-fullqa` sections 2 to 6. Gate G5.

**Phase 5 - Scripts** (automator). One Yes / Partial / No table (with Security rows), WAIT for OK, write specs, `npx tsc --noEmit -p .`, give the run command. The user runs it with VPN on. Stop here.

**Script review (every card with scripts, once, after G6, before "พร้อมรันไหม").** The reviewer in script-review mode (`.claude/agents/test-reviewer.md`) rates each AC: does a running test assert it (`strong`), only a proxy or can pass without checking (`weak`), only fixme / skip / empty `.env` (`blocked`), no script (`none`). Output `work/<KEY>/ac-strength.json`, gate G6b. Show the table with the run question. Weak or none on an AC the user did not mark manual goes back to the automator (at most 2 rounds). Costs about 30-40k tokens: run it once per card, not after every edit. A `strong` rating is read from the code, so it is a claim, not proof: an AC counts as **proven** only when it is `strong` AND every one of its tests passed in the latest run (`work/<KEY>/run-results.json`, written by `run-card`).

**Regression from dev changes (on request, or with a card's run question).** `node tools/regress.mjs` (read only) lists the stms-fe merges since the last regression (`--since-days 7` or `--since <commit>` to choose; `--card <KEY>` for one card) and ranks the specs to re-run: Must (the card's own tests, a locator that dev changed), Should (same page), Warn (shared code). It writes `work/REGRESSION/<date>_<since7>..<to7>.md` with the reasons and the `run-card` commands. Show the counts and the report link; running anything still needs "พร้อมรันไหม". After the user says the regression run is done: `node tools/regress.mjs mark`. QA's deployed commit is unknown, so the list is about `develop`. Design: `docs/superpowers/specs/2026-11-20-fe-diff-regression-design.md`.

**Pre-flight (before "พร้อมรันไหม", every card with scripts).** `node tools/heal/preflight.mjs --card <KEY> <spec>`: brings `stms-fe` down (pull --ff-only on a clean `develop`, else fetch; never edits it) and lists locators of the card's pages that the latest `stms-fe` changes probably broke, with a proposed replacement. Show the rows in the same message as the run question. Skipped quietly when `FE_REPO` is not found.

**Card test data (every card with `scripts/seed/cards/<KEY>.data.cjs` in `PW_REPO`).** Before "พร้อมรันไหม": `node scripts/seed/card-data.cjs <KEY> check` (read only) and `node scripts/seed/card-data.cjs <KEY> reset` (dry run) in `PW_REPO`. `NEEDS SETUP` / `NEEDS MANUAL`: show what is missing and ask (`setup` writes QA data through the UI, so it needs a yes). Otherwise the data is reset before EVERY run: put the dry-run summary in the run question, `ask --approve --options "รีเซ็ตแล้วรัน|ยังก่อน" "<KEY>: reset data (<summary>) then run <N> tests?"`. One yes covers that reset and that run only: `reset --apply`, then `run-card`. Record it with `state.mjs approve <KEY> "reset + run" --kind data-reset ...`. `run-card` refuses (exit 2) a card whose data was not reset after its last run or is not `READY`, and keeps the card locked while it runs; `--no-data-check` only when the user asked for a run on unreset data (the report says so). New specs read ids with `cardData('<KEY>')` (`utils/cardData.ts`), not new `.env` keys. Cards without a data file: unchanged. Design: `docs/superpowers/specs/2026-11-20-card-test-data-design.md`.

**Card data made by script (data file with `create: true`, the rule for every NEW card data file).** No UI setup and no reset before the run: `run-card` itself sweeps leftovers of an earlier run, makes the card's Plans (and its own Event when the file says `event: { create }`) through the STMS API (`tests/fe/setup/cardCreate.spec.ts`), fills the content through the DB (`card-data.cjs reset --apply`), runs the tests, then deletes everything it made (`cardCleanup.spec.ts`), also when tests fail. Only ids in `<PW_REPO>/output/seed/<KEY>.ledger.json` are ever deleted. One question covers the whole run: `ask --approve --options "สร้าง data → รัน → ลบ|ยังก่อน" "<KEY>: create data (<plans / needs / works>), run <N> tests, delete after?"`, recorded with `state.mjs approve <KEY> "create + run + delete" --kind data-reset`. `--keep-data` (only when the user asks to look at the data afterwards) skips the delete; the next run's sweep deletes it. A cleanup that fails is said in the report message with the ledger path. Design: `docs/superpowers/specs/2026-11-23-card-data-create-cleanup-design.md`.

**Run command (every card).** Never a bare `npx playwright test`. From the repo root (`PW_REPO` = folder of `ep-etm-fe-qa`, default `../ep-etm-fe-qa`):
`node tools/run-card.mjs <KEY> <spec> -g "<filter>"`
Own result folder (`output/runs/<date_time>_<KEY>` in the Playwright repo), own report (`output/runs/<date_time>_<KEY>/evidence-report-<KEY>-<time>.html`, shortcuts `output/runs/latest-<KEY>.html` and `latest.html`), report built when the run ends, failures printed. Rebuild: `node tools/run-card.mjs <KEY> --build-only <folder>`. Several cards can run together, except cards touching the same QA data (same plan).

**Phase 6 - After the run.** "รันเสร็จแล้ว": use the report `run-card.mjs` built; only if missing, reporter builds it with `etm-evidence-report`. Report before any new run. Say the proven rate `run-card` printed (passed / ran) and the not-proven tests with their reasons: a skipped "Not proven" test is not a pass. `run-card` writes it to `.claude/team/quality.jsonl`; `node tools/sprint-metrics.mjs` shows it per Sprint with the AC strength. Then run `node tools/qa-check.mjs strength <KEY>` again: it prints `AC proven n/total` and names each strong AC a run did not prove and each blocked/weak AC whose tests now pass (send those back to the reviewer to re-rate). **Coverage is always reported as AC proven / total AC**, never as "TC with a script" (a key in a spec file proves nothing).

**Phase 6b - Manual Tests by the browser agent (manual runner).** After the automated run, offer the manual Tests that have a `work/<KEY>/manual-steps-*.md` section and no `needs: excel` (`node tools/qa-check.mjs manual <KEY>` must show 0 errors first). Ask "พร้อมรันไหม" (`ask --approve` + `wait`, recorded with `state.mjs approve --kind run-tests`); a Test with `writes data: yes` needs its own yes naming the step that writes and what. Make one run folder `<PW_REPO>/output/runs/<YYYY-MM-DD_HHMMSS>_<KEY>_manual/`, then call `manual-runner` once per Test, one at a time (they share QA data and the browser), passing KEY, TEST, the run folder and the recorded yes for data writes. It takes the card lock / data gate itself (`tools/manual/gate.mjs`), writes `verdict-<TEST>.json`, `results.json` (`tools/manual/results.mjs`) and the report (`run-card --build-only`).
- **The person's check.** Show the report link and one line per Test (`8692: 6/6 pass`, `8693: 5 pass, step 4 needs-human: line 12 px left of 18:00`). List every `needs-human` step by itself (Test, step, reason, picture path); the person answers each `pass` / `fail` (several in one reply is fine). Nothing turns a `needs-human` step into `pass` in bulk. `ask --approve --options "ยืนยันผลทั้งหมด|แก้บางข้อ|ยังก่อน"`, the first option only when no step is `needs-human`. Write the answers with `node tools/manual/results.mjs <run> --decide <TEST> <n>=pass|fail[:answer] ...`, and for each Test the person confirmed as proposed `--confirm <TEST>` (until then a Test counts as `skipped: awaiting-confirmation` in `run-results.json` and the push leaves it out), then `node tools/run-card.mjs <KEY> --build-only <run>` again, so `run-results.json` (`source: "manual-agent"`) and `qa-check strength` see the confirmed result.
- **Push, per step.** `node tools/xray-step-push.mjs <run> --exec <Test Execution>` (dry run: shows the plan and every Test left out with why), then with `--apply` only after the user's yes (`state.mjs approve --kind xray-push`). It sends a status and the picture of every step, then the Test status (all pass → PASSED, any fail → FAILED), and reads back what Xray shows. A Test with a step still undecided is never pushed (stays TO DO).

**Phase 7 - Failures.** `run-card` writes `triage.json` / `triage.md` (cause per failed test: `locator`, `flaky`, `data`, `env`, `assertion`, `unknown`) and one retry per test (none for `@dailyreport`); a test that passed only on retry is `flaky`, never a pass.
- `locator` → **heal loop, started by the lead on its own** (never wait for the user to ask or to name the healer). `run-card` already ran `tools/heal/auto-heal.mjs propose`: `heal-proposals.md` in the run folder lists each failure as `ready` (stms-fe source answered, diff passed G-heal), `needs-live` or `manual` (with the reason). The hook `tools/heal/hook.mjs` reminds the lead once per run. The lead then: calls `playwright-healer` for each `needs-live` row (one at a time) and runs `node tools/heal/guard.mjs` on its diff; asks ONE question for all ready heals, `ask --approve --options "Apply,Skip,Manual"` + `wait`; on Apply only, `node tools/heal/auto-heal.mjs apply <run> <ids|all>` (a healer diff is applied the same way after the same Apply), re-runs only the healed tests, logs each with `node tools/heal/heal-log.mjs add`. `manual` rows go to the user with their reason. At most 2 rounds per test, then offer manual.
- **First run and fix rounds** (cards reran 30-46 times before this rule). (1) First run of a card: run ONE short test first (`run-card ... -g "<one key>"`); env / login / data failures are fixed before the full run. (2) After a run, re-run only the tests that failed, never the whole card, until the user asks. (3) Every "script bug" fix is a round: the lead adds a line to `work/<KEY>/script-fixes.md` (`| test | round | cause | what changed |`) and an AI miss (below). (4) A test still failing after 2 script-fix rounds stops: offer it as manual (manual-steps file for `manual-runner`), do not try a third fix unless the user asks. (5) Before a fix, check the page fact in `docs/modules/`; a fix that guesses page behaviour again is not allowed (automator step 1b).
- every other cause, and a healer answer `not-a-locator`: ask the user script bug / wrong test wording / real app bug. Never decide alone. Real bug → logger with `log-defect-jira-etm`, only after an explicit go-ahead.

**Phase 8 - Closeout** (logger, with go-ahead): push results, close the tests linked to the Story, finish the Test Execution, move the Story as the rules say.

## Quality gates (what makes the output correct before the user sees it)

Every agent runs its own check before returning, and the lead runs the same command once more when the agent returns. A gate with errors goes back to the same agent once with the exact messages; a second failure goes to the user with what is still open. Warnings are advice, fix the cheap ones.

| Gate | After | Command (from the repo root) | Passes when |
|---|---|---|---|
| G0 | before each agent call and at each phase change | `node tools/qa-check.mjs state <KEY>` | 0 errors: `state.json` valid and written only by `state.mjs` (checksum), every recorded file exists, AC list matches `analyst.md`, phase `push`/`closeout` has its approval record |
| G1 | analyst | `node tools/qa-check.mjs work <KEY> analyst`, then (lead, after writing the findings log) `node tools/qa-check.mjs findings <KEY>` | 0 errors (all 4 sections present; every question of `questions-for-BA.md` has a valid entry in `findings.json`) |
| G2 | inspector | `node tools/qa-check.mjs work <KEY> inspector` | 0 errors |
| G3 | designer | `node tools/qa-check.mjs draft <KEY>` | 0 errors: label, automation tag, every step has an Expected Result, no "refer to Figma", no "same as TC-x", every case has a `Trace:` line, every `AC-n` of `analyst.md` is in a `Trace:` line, every `[NEG]` AC has a NEG/BND case |
| G4 | reviewer | `node tools/qa-check.mjs work <KEY> reviewer` | 0 errors and the verdict is Approve / Conditional Approve |
| G5 | Xray push | logger saves `work/<KEY>/xray-readback.json` (`[{key, summary, steps}]`), then `node tools/qa-check.mjs diff <KEY> work/<KEY>/xray-readback.json`, plus the `linkedIssues` count | 0 errors: same number of Tests, same step count as the draft, link count correct |
| G6 | scripts | `node tools/qa-check.mjs spec <spec files> --tests work/<KEY>/tests.md` and `npx tsc --noEmit -p .` (in `PW_REPO`) | 0 errors: key in every title, a `test.step` per step, no `waitForTimeout`, no credentials, no false pass (no swallowed action before an absence check, no `if (...) expect` without `else notChecked`, no early `return` without `notChecked`), compiles |
| G6b | script review | `node tools/qa-check.mjs strength <KEY>` | 0 errors: every AC rated strong / weak / blocked / none with tests and a reason; verdict `ready` only when no AC is blocked or none. Also prints `AC proven n/total` (strong + every test passed in `run-results.json`); before the first run it is 0 |
| G7 | before the report | `node tools/qa-check.mjs manifest <manifest.json>` | 0 errors |
| G-heal | before a heal is offered | the proposal saved as a diff, then `node tools/heal/guard.mjs <diff>` | 0 errors: only locator strings in existing `pages/*.ts` or `tests/**/*.ts` lines change; no added `.first()`/`.nth()`/`force`/timeouts, no changed or removed `expect`, no widening selector. A refused heal goes to the user as a manual fix |
| G8 | after the run | the counts in the report equal the counts `run-card` printed | equal |

After any change to `tools/qa-check.mjs` run `node tools/qa-check.mjs selftest` (fixtures in `evals/`); `node tools/qa-check.mjs stats` shows which gate fails most often.

G1 also warns when the Story has more numbered AC items than `analyst.md` lists, or an AC line looks like more than one rule: send it back to the analyst to split. Also checked by the lead, not by a script: each traced case really proves its AC (the Expected Result states the AC's outcome), every claim in the closing summary matches a file or a Jira key it just read.

## Sprint report (for the manager: defects per sprint, problems stopped before code)

On request, or when a sprint ends. Read-only Jira, no approval needed.
1. For the current and the previous sprint (older ones are saved with `"frozen": true` and never fetched again), run with narrow fields (`key`, `issuetype`, `created`, `status`, `issuelinks`), `maxResults` 100:
   `project = ETM AND issuetype = Story AND sprint = <id>` and `project = ETM AND issuetype in (Defect, Bug) AND sprint = <id>`.
2. Save `work/SPRINT<N>/jira.json`: `{sprint, sprintId, name, fetched, frozen, stories: [keys], defects: [{key, type: "Defect"|"Bug", created, story: <Relates Story key or null>, status}]}`.
3. `node tools/sprint-metrics.mjs --marker 27` writes `work/SPRINT<latest>/metrics.html` and prints the summary. Show the summary; publish the HTML as a private Artifact only when the user says so.
Baseline: Sprints 23-26 (26 = findings raised after dev had started). Sprint 27 = first sprint where every card is read before dev.

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

## Test case wording

See `.claude/team/agent-protocol.md` (designer, reviewer and the lead when it reviews).

## Lessons

`.claude/team/knowledge/lessons-learned.md`: 9 base categories plus lessons added in section 10. Designer and reviewer (or the lead) go through all of them for every Story. When the user tells a new bug story or a case the team forgot, add it there with the card key and date, and if a check could have caught it add a fixture to `evals/` (and its line to `evals/expected.json`) so it is caught next time. Remove a lesson that turns out to be wrong.

## AI misses (when the user catches an agent being wrong)

Lessons are about the product (bugs that slipped). AI misses are about the team itself: an agent invented a step, gave a wrong verdict, missed a case, used a wrong fact or locator. Log: `.claude/team/knowledge/ai-misses.jsonl`, written only by the lead with `node tools/ai-miss.mjs`. Every agent reads its own rules at start (`show <id>`, agent protocol rule 1); the lead runs `show lead` at the start of a card.

- **When to add:** the user corrects an agent's output (in chat or on the board), answers a failure with "script bug" or "wrong test wording", rejects a verdict, or says "AI got this wrong". Add it in the same turn, before going on:
  `node tools/ai-miss.mjs add --agent <id|all> --kind <verdict|invented|missed-case|wrong-fact|locator|wording|data|process|other> --card <KEY> --wrong "<what the AI did>" --right "<what is correct>" --caught "<how the user saw it>" --rule "<one line: what to do from now on>"`
  Write the rule as an instruction an agent can follow, not a story. Use `all` only when every agent needs it. Tell the user in one line: the id and the rule. If a gate could have caught it, also add an eval fixture (see Lessons).
- **Not a miss:** the app's own bug, a Story that changed, a choice the user made differently with no rule behind it.
- **In code, not only words:** `team.mjs start` prints the lead's rules. M-1 is enforced by `tools/push-guard.mjs`: the Xray MCP tool `xray_import_results` and `xray-toolkit/xray-import.mjs` refuse a PASSED whose latest result in any `work/*/run-results.json` is not passed (nothing is sent); check a plan first with `node tools/push-guard.mjs ETM-1=PASSED ...`. A Test with no run result at all may go PASSED only as a manual check the user confirmed, and the reply says so. Set Test statuses only with `xray_import_results` or `xray-step-push.mjs`, never with an `xray_graphql` mutation (the guard cannot see it). When a new miss can be caught by a check, add the check, not only the rule.
- **Review:** `node tools/ai-miss.mjs stats` and `list` when the user asks what the AI gets wrong, or at the end of a sprint. A rule that is wrong or no longer needed: `retire <M-n> "<why>"`, never delete lines.

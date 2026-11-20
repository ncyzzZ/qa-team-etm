# Browser agent for manual test cases (manual runner) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An agent runs a manual Xray Test from its `manual-steps` table in a headless browser on QA, takes a framed picture per step, proposes a verdict per step, and after the person confirms, the result goes to Xray step by step.

**Architecture:** Pure helpers in qa-team-etm (`tools/manual/`): parse the steps file, turn the agent's `verdict.json` into a Playwright-JSON `results.json`, a per-step Xray push, a lock/gate CLI. In ep-etm-fe-qa: one seed spec per role for the `playwright-test` MCP server and a PDF-to-PNG script. The agent itself is `.claude/agents/manual-runner.md`.

**Tech Stack:** Node 20 ESM (`node:test`), Playwright (seed specs, Chromium for the PDF render), `pdfjs-dist`, Xray Cloud GraphQL.

**Spec:** `docs/superpowers/specs/2026-11-20-manual-runner-design.md`

## Global Constraints

- QA only: seeds and scripts refuse a `BASE_URL` matching `/uat|prod/i`.
- Logins only from `ep-etm-fe-qa/.auth/turnaroundManager.json` and `.auth/jobOwner.json`; no password typed.
- Verdicts: `pass` | `fail` | `needs-human`; a Test is PASSED only when every step is `pass` (agent or person); any `fail` → FAILED; any undecided `needs-human` → not pushed.
- Run folder: `ep-etm-fe-qa/output/runs/<YYYY-MM-DD_HHMMSS>_<KEY>_manual/`; pictures `evidence/<TEST>/step-<n>.png` inside it; the push uses only pictures inside that folder.
- Picture style: red frame around the checked element(s) + caption box (step number, what was done, what should be seen), as `ep-etm-fe-qa/utils/xrayEvidence.ts`.
- Xray writes: dry run by default, `--apply` only after the person's yes (`state.mjs approve --kind xray-push`).
- Card data rules: hold `ep-etm-fe-qa/output/seed/ETM-<n>.lock` for the whole Test; when `scripts/seed/cards/ETM-<n>.data.cjs` exists, `dataGate` must pass first (`tools/data-gate.mjs`).
- Excel cases (`needs: excel`) are skipped with that reason.
- Windows and Mac: no shell-only syntax, `path.join` everywhere.

## Review Focus

1. A steps table whose row count differs from the Test's Xray steps: `qa-check manual` errors with the Test key and both counts. Test in Task 2.
2. A `verdict.json` picture path outside the run folder (or missing file): the push refuses that Test, nothing written. Test in Task 4.
3. A Test with one `needs-human` step still undecided: `results.json` marks it skipped `needs-manual`, the push leaves it out and prints why. Tests in Task 3 and Task 4.
4. `needs: excel`: `results.json` has the Test skipped with reason `needs Excel (desktop), stays manual`. Test in Task 3.
5. The card lock held by a running `run-card`: `tools/manual/gate.mjs take` exits 2 with the owner. Test in Task 5.

---

### Task 1: Seeds per role and the PDF picture script (ep-etm-fe-qa)

**Files:**
- Create: `ep-etm-fe-qa/tests/fe/manual/seed.turnaroundManager.spec.ts`, `ep-etm-fe-qa/tests/fe/manual/seed.jobOwner.spec.ts`
- Create: `ep-etm-fe-qa/scripts/manual/pdf-shot.mjs`
- Test: `ep-etm-fe-qa/scripts/manual/pdf-shot.test.mjs`
- Modify: `ep-etm-fe-qa/package.json` (devDependency `pdfjs-dist`)

**Interfaces:**
- Produces: `node scripts/manual/pdf-shot.mjs <file.pdf> <page> <out.png> [--clip x,y,w,h] [--scale 2]` → writes the PNG, prints `{ pages, width, height }` JSON; exit 2 on a missing file or a page out of range. Exported `renderPdfPage(file, page, out, { clip, scale }) -> Promise<{ pages, width, height }>`.
- Seeds: each a single test `SEED <role>` that uses the role's storage state, refuses UAT/PROD, opens `config.url('/shutdown-event-list')` and waits for the page to load; nothing else (the MCP setup tool hands this page to the agent).

- [ ] **Step 1: Write the failing test** `pdf-shot.test.mjs`: make a 2-page PDF with Playwright `page.pdf()` from HTML (`<h1>Page one</h1>`, page break, `<h1>Page two</h1>`) into a temp folder; `renderPdfPage(pdf, 2, out)` → file exists, PNG signature, `pages === 2`; page 3 → rejects with `out of range`; `--clip 0,0,100,50` → `width === 100*scale`.
- [ ] **Step 2: Run** `node --test scripts/manual/pdf-shot.test.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Install** `npm i -D pdfjs-dist` (exact version pinned by npm) and **implement** `pdf-shot.mjs`: launch Chromium, load the pdf.js legacy build from `node_modules/pdfjs-dist` through `page.route` (no network), render the page to a canvas, screenshot the canvas (clip when given).
- [ ] **Step 4: Run** the test. Expected: PASS. Then `npx playwright test tests/fe/manual --list`. Expected: 2 tests listed; delete the run folder `--list` creates under `output/runs/`.
- [ ] **Step 5: Commit** (ep-etm-fe-qa) `feat(manual): role seeds and PDF page pictures`.

### Task 2: Steps file parser and `qa-check manual`

**Files:**
- Create: `qa-team-etm/tools/manual/steps.mjs`, `tools/manual/steps.test.mjs`
- Modify: `qa-team-etm/tools/qa-check.mjs` (command `manual <KEY>`, selftest fixtures under `evals/manual/`)

**Interfaces:**
- Produces: `parseManualSteps(md: string) -> ManualTest[]`, `ManualTest = { key, title, role: 'turnaroundManager'|'jobOwner', writesData: boolean, needs: string[], start: string|null, steps: { n, do, expected, picture }[] }`. Heading `## ETM-<n> - <title> (<N> steps)`; option lines `role:`, `writes data: yes`, `needs: excel`, `start:` between the heading and the table; first table with header `| # | Do | Expected | Picture |`.
- `qa-check manual <KEY>`: reads every `work/<KEY>/manual-steps-*.md`; errors: heading step count ≠ table rows; table rows ≠ Xray steps of that Test in `.claude/team/work/<KEY>/tests.md` (when the Test is there); a row with empty Do or Expected; unknown role.
- [ ] **Step 1: Write the failing tests:** parse a two-Test sample (one with `role: jobOwner`, `writes data: yes`) → keys, roles, step counts, step 2 `expected` text; `needs: excel` → `needs: ['excel']`; heading says 6 steps but table has 5 → `parseManualSteps` keeps 5 and `checkManual` returns an error naming the key and `6 vs 5`; selftest fixtures `manual-good` (0 errors), `manual-count` (1), `manual-xray-mismatch` (1).
- [ ] **Step 2: Run** `node --test tools/manual/steps.test.mjs` and `node tools/qa-check.mjs selftest`. Expected: FAIL.
- [ ] **Step 3: Implement** `steps.mjs` (`parseManualSteps`, `checkManual(tests, xraySteps) -> string[]`) and the qa-check command (reuse its existing tests.md step reader).
- [ ] **Step 4: Run** both. Expected: PASS. Then `node tools/qa-check.mjs manual ETM-8392` on the real card: it lists the shape errors of the current files (they predate the shape; fixed in Task 5).
- [ ] **Step 5: Commit** `feat(manual): steps file parser and qa-check manual`.

### Task 3: verdict.json → results.json, person's decisions, run results

**Files:**
- Create: `qa-team-etm/tools/manual/results.mjs`, `tools/manual/results.test.mjs`
- Modify: `qa-team-etm/tools/run-card.mjs` (`recordRunResults`: `source: 'manual-agent'` when the run folder name ends with `_manual`), `qa-team-etm/tools/sprint-metrics.mjs` (`scriptQuality`: count `ac.provenManual` = proven ACs whose tests' latest result has `source: 'manual-agent'`; show it in the coverage table as its own column "พิสูจน์ด้วย browser agent / proven by browser agent")

**Interfaces:**
- Consumes: `ManualTest` (Task 2).
- Produces:
  - `Verdict = { key, test, title, role, skipped?: string, steps: { n, do, expected, verdict: 'pass'|'fail'|'needs-human', why, picture, decidedBy?: 'agent'|'user', answer? }[], actions: object[] }` (file `<run>/verdict-<TEST>.json`).
  - `testStatus(v: Verdict) -> 'passed'|'failed'|'skipped'`.
  - `toResults(verdicts: Verdict[], runDir) -> object` (Playwright JSON reporter shape: one suite, one spec per Test titled `<TEST> - <title>`, `tests[0].results[0]` with `status`, top-level `steps` titled `<n>. <do>`, a failed step carries `error.message = why`, attachments `{ name: 'Step <n>: <picture>', contentType: 'image/png', path }`, skipped Tests carry annotation `{ type: 'needs-manual', description }`).
  - `applyDecisions(v: Verdict, answers: { n, verdict, answer }[]) -> Verdict` (sets `decidedBy: 'user'`; refuses an `n` that does not exist).
  - CLI `node tools/manual/results.mjs <runDir> [--decide <TEST> <n>=pass|fail ...]` writes `results.json` (after applying decisions to the verdict file).
- [ ] **Step 1: Write the failing tests:** all `pass` → `passed`; one `fail` → `failed` and that step's `error.message`; one `needs-human` → `skipped` with annotation `needs-manual`; `skipped: 'needs Excel (desktop), stays manual'` → skipped with that description; attachment names match `/^Step \d+:/`; `applyDecisions` on step 4 `pass` → `testStatus` becomes `passed` and step 4 `decidedBy === 'user'`; a decision for step 9 of a 6-step Test throws; `recordRunResults` writes `source: 'manual-agent'` for a `_manual` folder (test through the exported helper, add the export if missing).
- [ ] **Step 2: Run** `node --test tools/manual/results.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `results.mjs`, the run-card change and the sprint-metrics column.
- [ ] **Step 4: Run** `node --test tools/manual/ tools/` and `node tools/qa-check.mjs selftest`; then build a report from a fixture run folder with `node tools/run-card.mjs ETM-0001 --build-only <fixture>`. Expected: PASS; the report shows the per-step pictures and the needs-manual Test as skipped.
- [ ] **Step 5: Commit** `feat(manual): verdicts to results.json, person's decisions`.

### Task 4: Per-step Xray push

**Files:**
- Create: `qa-team-etm/tools/xray-step-push.mjs`, `tools/xray-step-push.test.mjs`

**Interfaces:**
- Consumes: `Verdict`, `testStatus` (Task 3).
- Produces: `node tools/xray-step-push.mjs <runDir> --exec ETM-<n> [--only ETM-a,ETM-b] [--apply]`; exported `planPush(verdicts, runDir) -> { push: { test, status, steps: { n, status, picture }[] }[], skip: { test, why }[] }` and `pushOne(gql, execKey, item) -> Promise<{ test, readback }>` where `gql(query, variables)` is injected (default: Xray Cloud GraphQL with `XRAY_CLIENT_ID` / `XRAY_CLIENT_SECRET`, same auth as `xray-toolkit/index.mjs`). Per Test: find the Test Run (`getTestRuns` by Test Execution + Test issue), per step `updateTestRunStepStatus` (PASSED / FAILED) and `addEvidenceToTestRunStep` (the PNG base64), then `updateTestRunStatus`, then read the run back and print step statuses and evidence counts. Without `--apply`: print the plan, no calls.
- [ ] **Step 1: Write the failing tests** (fake `gql` recording calls): a Test with an undecided `needs-human` → in `skip` with `undecided step 4`; a picture path outside `runDir` → in `skip` with `picture outside the run folder`; a missing picture file → skip; a passed 6-step Test → `pushOne` calls 6 step-status + 6 evidence mutations then one run-status `PASSED`; without `--apply` the CLI makes no `gql` call.
- [ ] **Step 2: Run** `node --test tools/xray-step-push.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** it. The step ids come from the Test Run's `steps { id }` in order; a count different from the verdict's steps → skip that Test with `Xray has N steps, verdict has M`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(xray): per-step push with pictures, dry run by default`.

### Task 5: Gate CLI, the agent, team docs, steps files in shape

**Files:**
- Create: `qa-team-etm/tools/manual/gate.mjs`, `tools/manual/gate.test.mjs`
- Create: `qa-team-etm/tools/manual/overlay.js` (the frame + caption helper as one function string the agent passes to the MCP code tool; look copied from `xrayEvidence.ts`; draws, screenshots to a given path, removes)
- Create: `qa-team-etm/.claude/agents/manual-runner.md`
- Modify: `qa-team-etm/TEAM.md` (Phase 6: offer manual Tests with a steps file, one agent call per Test, one at a time; the person's check in section 6 of the spec; push with `xray-step-push.mjs`), `qa-team-etm/.claude/agents/automation-engineer.md` (steps file shape), `qa-team-etm/work/ETM-8392/manual-steps-*.md`, `work/ETM-8388/manual-steps-8729-8730.md` (add `needs: excel`), the 8405 steps if any (shape only, no content change)

**Interfaces:**
- Consumes: `takeLock`, `releaseLock`, `dataGate` from `tools/data-gate.mjs`; Tasks 1-4.
- Produces: `node tools/manual/gate.mjs <KEY> take|release` (take: data gate when the card has a data file, then the lock with owner `manual-runner`; exit 2 with the reason when refused).
- Agent `manual-runner.md`: frontmatter `name: manual-runner`, description one line, tools `Read, Write, Bash, mcp__playwright-test__*` browser and setup tools. Body: inputs (KEY, TEST, run folder), the steps (gate take → seed of the role → for each row: do, check by reading the page, overlay picture, verdict with measured facts → PDF via `pdf-shot.mjs` → write `verdict-<TEST>.json` → `results.mjs` → `run-card --build-only` → gate release, also on error), the rules (QA only, never a pass from a guess, stop before a data-writing step without the lead's recorded yes, never push), board updates at start and end.
- [ ] **Step 1: Write the failing test** `gate.test.mjs`: lock held by `run-card` → exit 2, message contains `run-card`; free → lock file with owner `manual-runner`; `release` removes it.
- [ ] **Step 2: Run** `node --test tools/manual/gate.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** `gate.mjs`, write `overlay.js`, the agent file, the doc edits, and put the steps files in shape.
- [ ] **Step 4: Run** `node --test tools/ tools/manual/`, `node tools/qa-check.mjs selftest`, `node tools/qa-check.mjs manual ETM-8392`, `node tools/qa-check.mjs manual ETM-8388`. Expected: all PASS, 0 errors.
- [ ] **Step 5: Commit** `feat(manual): manual-runner agent, gate, team flow`.

After Task 5 (not a plan step): the first real run (ETM-8392 8692, 8693, read-only) needs the user's "พร้อมรันไหม" yes; the push needs a second yes.

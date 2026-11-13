---
name: etm-nn-fullqa
description: Jira and Xray rules for the ETM QA cycle. Use when the user's message is just an ETM Story link or key (e.g. ETM-1234 or the Jira URL), and whenever Tests, Test Plans, Test Executions or [QA] subtasks are created or closed.
---

# ETM Jira / Xray rules (full QA cycle)

The cycle itself (who does what, checkpoints, board, agents) is in `TEAM.md`; the lead follows it. This skill holds only the Jira/Xray specifics the cycle needs. Script rules are in `.claude/team/knowledge/playwright-script-rules.md`, test case wording in `TEAM.md`.

## Trigger and scope

The user's whole message is one or more Jira Story links/keys. That runs the cycle in `TEAM.md`.
- **Several cards**: quick scan, then (after the quick-scan review) create the two `[QA]` subtasks and propose Original Estimates, for each card. Report all together and wait. If a card fails to load, say which and continue.
- **Only one part asked** ("just quick scan", "just the scripts"): do only that part.
- Any defect, bug or retest: load skill `log-defect-jira-etm` fresh and follow it (section 8). SIMOP / Work Conflict Matrix Stories: also `etm-simop-rules` (settled rules are not BA questions). If either skill is not available, say so plainly; never work from memory.

## Settings

Settings (`JIRA_SITE`, `PROJECT_KEY`, `BOARD_ID`, `PW_REPO`) are in `CLAUDE.md`. `ME_ID` / `ME_NAME`: call `atlassianUserInfo` once per session; `ME_ID` is "self" below. If a value is missing, ask once. Read the workflow doc `docs/etm-qa-workflow.md` fresh once per task (the user edits it); if unreachable, stop and say so.

## Tool rules

- Never open Chrome unless the user asks. Use Atlassian Rovo, Xray MCP, Figma MCP and Playwright scripts. Images inside Jira are the only thing MCP cannot do: by default the user attaches them, so just say which images and where; only on the user's go follow the embed steps in `log-defect-jira-etm`.
- Figma only through Figma MCP (details in `.claude/agents/ux-inspector.md`).
- Lean Jira/Xray calls: narrow `fields` (never `"*all"` unless needed), small `maxResults` (10-20), specific JQL, `searchResultMode: "count"` for counts, at most one or two retries then surface the blocker. Never dump raw content or base64 into chat.

## 1. Planning data

An "AC 0 User Review Updates" block overrides older AC. The two `[QA]` subtasks (`[QA] Create Test Case Manual Test`, `[QA] Execute Test Case Manual Test`) often already exist with slightly different names and estimates: reuse, never duplicate; otherwise create them. Only these two get Original Estimates; a Defect/Bug never does. Every Test traces to the Story (core rule in the workflow doc). Test cases are Markdown in the draft and go to Xray at full detail: never `.xlsx` or `.csv`.

## 2. Xray push (only after the user's explicit go-ahead; first batch on a new project is a pilot, say so)

Create Tests with GraphQL `createTest` (needs `jira.fields.project: {key: "ETM"}`; max 25 operations per GraphQL document). File each Test into the Test Repository folder `Manual Test / Sprint {N} / {STORY-KEY}` (check `getFolder`, create with `createFolder(projectId, path)`, file with `addTestsToFolder`).
- **Link direction**: `createIssueLink(inwardIssue: <Test key>, outwardIssue: <Story key>, type: "Test")`. The reverse leaves Test Coverage UNCOVERED (happened on ETM-6380 and ETM-6395).
- **Check right after**: JQL `issue in linkedIssues("<STORY>","is tested by")` must return exactly the number of Tests created. Fix before reporting done. Remove wrong-direction links through Jira MCP where possible; Chrome `DELETE /rest/api/3/issueLink/<id>` only if the user asks.

## 3. Sprint Test Plan and Test Execution (same flow, not deferred)

One Test Plan per sprint named exactly `Test Plan for Sprint {N}` (search JQL first, never duplicate); add every Test with `addTestsToTestPlan`; per-story folder in the plan (`createFolder(testPlanId, path: "/{STORY-KEY}")`, `addTestsToFolder(testPlanId, ...)`). Create `Test Execution for {STORY-KEY}`, link with `addTestExecutionsToTestPlan`, load Tests with `addTestsToTestExecution`. Every Test Execution has Test Environment `QA` (`testEnvironments: ["QA"]` on create, or `addTestEnvironmentsToTestExecution`; verify with `getTestExecution(issueId) { testEnvironments }`).

## 4. Fill the `[QA] Create Test Case Manual Test` description (mandatory closing step of the push; missed once on ETM-6524/ETM-6380; verify every time)

Markdown: header naming the Story and what was pushed (Test key range, link); **Where everything lives** table (Test Repository folder | Sprint Test Plan | Test Execution); **Definition of Done** checklist reflecting what was truly done (never claim a review that did not happen); **Test case summary** table (Test key | Type POS/NEG | What it checks | What it proves), one row per test; **Next step** line pointing to the Test Execution, ready once the Story is on QA.

## 5. Assignee rule

Any issue created or touched here (`[QA]` subtasks, Tests, Test Plan, Test Execution) gets assignee `ME_ID` right after create/edit: `editJiraIssue(fields: {"assignee": {"accountId": "<ME_ID>"}})`. Defects/Bugs are the exception (dev assignee from the Story, see `log-defect-jira-etm`).

## 6. Jira descriptions are Markdown on this instance

Never wiki markup: `**bold**`, `### Heading` (never `h2.` or a bold pseudo-heading), `| a | b |` tables with `| --- | --- |`, `- [x]` / `- [ ]` checklists (never `(/)`), triple-backtick code.

## 7. Execution

Needs the Story at "Ready for QA" on the board (`BOARD_ID`); even then ask "ready to test?" first. Run Tests with Playwright through `tools/run-card.mjs` (see `TEAM.md`; browser only if the user asks), compare actual vs Expected, evidence for every step (BEFORE and AFTER for every data-changing Test), write results to Xray. On a FAILED step follow section 8, do not continue silently. Manual Tests are left to the user; import their results when the user sends them.

## 8. Defects, bugs and retests

Use skill `log-defect-jira-etm`; it is the single source of truth. Never use field values, subtask titles, estimates, statuses or retest steps from memory or older copies. From this flow only: stop and tell the user first with evidence before creating anything, and never log a defect or retest without the user's explicit go-ahead.

## 9. Regression

If a Story that reached "In Testing" moves back to "In Development" or "For Planning", wait until it returns to "Ready for QA", re-read/diff the AC, write any new TCs the changed AC requires, but do not start execution until the user says go.

## 10. Closeout

Run `anthropic-skills:resolve-tested-by` on the Story, transition the Test Execution itself to Done, then move the Story to "Ready for UAT" once only the `[QA]` subtasks are Done (non-QA subtasks do not block).

## 11. Correct a Test, then retest

Whenever live behaviour contradicts a Test's wording and the user confirms the real rule (e.g. ETM-6559/6560/6563), or the user points at a Test and says the expected result is wrong, apply ALL of it, not just the Jira/Xray edit:
1. Verify actual behaviour first with Playwright (Chrome only if asked), reproducing the exact condition.
2. Fetch ids: `getTests(jql: "key = ETM-XXXX", limit: 1) { results { issueId steps { id action data result } } }`.
3. Fix the step with `updateTestStep(stepId, step) { warnings }` (expect `{warnings: []}`).
4. Fix the Jira Summary via `editJiraIssue`.
5. Fix the Description with `contentFormat: "markdown"` in the standard shape plus a short "(corrected DD Mon YYYY - what and why.)" note.
6. Rerun the script for fresh evidence (the `evidence()` helper frames and labels each picture; move old images to `evidence/_old/` first).
7. Check the pictures are in `evidence/<TEST-KEY>/`.
8. `xray_import_results(executionKey, tests:[{testKey, status:"PASSED", comment:"<what was corrected and why>", evidenceDir:"<evidence folder path>"}])`.
9. Verify with `getTestRunById(id) { status{name} evidence{id filename size} }`.
10. If old invalid evidence remains, `removeEvidenceFromTestRun(id, evidenceIds)`.
11. Report in one short message in the user's language (Thai for the usual user): new status, fresh evidence attached, old evidence cleared (e.g. "รีเทส ETM-XXXX เสร็จแล้วค่ะ ผล PASSED พร้อม evidence ใหม่ ... เคลียร์รูปเก่า(ถ้ามี)ออกจาก Xray Test Run แล้ว"). Here Claude delivers the new evidence, the user does not attach it.

## Standing rules

- Ask the user whenever anything is unclear.
- Never execute, log a defect, retest, or push to Xray without the user's explicit go-ahead, even when every gate has passed.
- Never create Jira subtasks or write anything before the workflow checkpoints (quick-scan review, TC-detail review, Xray approval) were offered.
- Never create `.xlsx` or `.csv` test case files.
- Every Jira description is Markdown. Every Test Execution has Test Environment = QA. Every Test-to-Story link has Test as inward and Story as outward and is verified with `linkedIssues(...)`.
- The `[QA] Create Test Case Manual Test` description is always filled (section 4).
- A Defect/Bug never gets an Original Estimate; only its `[QA]` subtask does.

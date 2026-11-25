---
name: log-defect-jira-etm
description: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Use instead of log-defect-jira for the PTTEP ETM (EP-Turnaround Management) Jira project. Runs the full ETM-specific defect-logging procedure end-to-end - correct fields, environment-based Work type, auto-resolved FE/BE assignee from the originating Story, mandatory embedded evidence images, FE/UI labels, QA sub-task, and Xray step-level linking.
---

# Log a Defect/Bug in the ETM Jira project

The project-specific process built up over real defect-logging sessions. This skill is the single source of truth for defects, bugs and retests (`etm-nn-fullqa` section 8 and `TEAM.md` point here). When the user states a new correction, change this file, not just the chat.

**Gate (TEAM.md Phase 7):** never create or change anything in Jira until the user said, in the chat, to log this defect. Show the evidence and the Step 1 draft first. The decision "script bug / wrong test / real app bug" is the user's; a defect is never pre-approved.

**Independent evidence check (user rule, 25 Nov 2026).** Before asking to log: save the Step 1 draft as `work/<KEY>/defect-draft-<short>.md` (sections `**Environment:**`, `### Step to Reproduce`, `### Actual Result`, `### Expected Result`, picture paths), run `node tools/evidence-check.mjs brief <KEY> --defect <draft>`, call the `evidence-checker` agent with only KEY and the brief path, then `compare`. Ask with the decision card: `team.mjs ask --approve --gate defect --propose "log <summary>" --why ... --if-wrong "dev time on a non-bug / a wrong rule in Jira" --undo partial --evidence <picture> --check work/<KEY>/evidence-check/<ID>.compare.json`. Right before Step 4 run `node tools/evidence-check.mjs gate <KEY> <ID>`: BLOCKED (no check, or the draft or a picture changed after it) means check again, never log. When the checker disagrees, tell the user its reading in one line; the user decides.

## Token economy (read first, apply throughout)

- Pass a narrow `fields` list on every `getJiraIssue` / `searchJiraIssuesUsingJql` call (never `"*all"` unless a specific field is needed).
- Never dump large raw content into the conversation to "check" it. In particular never run a `base64` (or similar) encode of an image/file and let its output return into context: one ~37KB screenshot is ~49,600 characters of waste (it has happened once).
- Confirm results with a small, targeted read (`get_page_text`, a narrow GraphQL field selection) instead of a screenshot or a full-page dump.
- Don't retry a failed call more than once or twice; surface the blocker to the user.
- Report back in a few lines, not a restated dump of every field.

## Who is running this skill

Nothing personal is hard-coded: get the running user's own accountId (`ME_ID`) and display name with `atlassianUserInfo` once per session and use it wherever this skill says "self". Jira settings (`JIRA_SITE`, `PROJECT_KEY`, board) are in the project `CLAUDE.md` (team default `pttep.atlassian.net` / `ETM`). Local evidence paths: the `evidence/` folder of `PW_REPO`.

## Response language

Thai for the conversational parts (confirming details, reporting the created ticket). Keep proper nouns, field names, ticket keys and IDs as they are. The ticket fields themselves (Summary, Description, Steps to Reproduce) stay in English, like the rest of the project's Jira tickets.

## Step 1 - Draft the bilingual report first

Before touching Jira, write a bilingual (English + Thai) defect report: title, description/context, steps to reproduce, actual result, expected result. Never fabricate a step, environment or build number: ask. If the user says to draft anyway without more info, mark inferred parts clearly as an assumption to confirm.

In this repo, also read `work/<Story key>/findings.json` (read-only, if it exists): if one finding describes the same rule as this defect, name it in the go-ahead question ("ทีมเคยเตือนไว้ใน F-3: ..."). After the defect is created, write its key into that finding's `later_defect`, unless the user rejected the match. Local file only, nothing goes to Jira.

The Jira Description follows the format confirmed against reference ticket ETM-6358 (this Jira renders Markdown, not wiki markup):
- A plain opening narrative paragraph (no "Description:" label).
- `### Step to Reproduce` (numbered steps)
- `### Actual Result`
- `### Expected Result`

Never use bold text as a pseudo-heading; always the `###` heading; never omit Expected Result. Order: Actual Result comes before Expected Result (corrected 25 Sep 2026).

If the Test Case / AC behind the defect conflicts with what the user describes as the expected behaviour (e.g. an Xray step's `expectedResult` says one thing and the user another), don't pick silently: flag it with `AskUserQuestion` and ask which to follow before writing the Expected Result. Once confirmed, note the conflict in the ticket's Expected Result (e.g. "Note: Xray test X step N currently states ... - this test step's expected result should be updated to match").

## Step 2 - Determine the fields

- **Work type**: `Defect` if Found-in Environment is QA; `Bug` if UAT or PROD. Ask if the environment isn't stated.
- **Found-in Environment** (`customfield_15852`, radio, required for Defect/Bug): DEV=`16335`, QA=`16336`, UAT=`16337`, PROD=`16338`.
- **Summary**: prefix with the originating Story's key, e.g. `[ETM-6317] Save button stays disabled after collapsing rows...`. If a follow-up defect does not repeat the Story key but the context (same feature, file, session) clearly continues the previous defect's Story, reuse that key.
- **Epic**: read the originating Story's parent Epic and set it on both `parent` and `customfield_10014`.
- **Labels**: for a UI or Frontend (FE) issue set **both** `FE` and `UI`, never just one.
- **Issue link**: link to the originating Story with the standard "Relates" type. Never the Tests / is-tested-by type (reserved for Test issues).
- **Sprint**: set the Defect/Bug's Sprint to the originating Story's active sprint (read the Story's `customfield_10020`, copy the sprint id). Easy to forget: do it in this same step.
- **Original Estimate / time tracking**: NEVER set an Original Estimate on the Defect/Bug or on its `[QA]` sub-task (Step 8). Leave `timetracking.originalEstimate` empty everywhere in this flow. Do not set a Remaining estimate either (changed 18 Nov 2026, user: "no Original Estimate, take it out of raising a defect"): setting one through `editJiraIssue` makes Jira copy it into Original Estimate and the MCP tool cannot clear it again. The only time tracking in this flow is the worklog on the sub-task (Step 8, estimated per defect).

## Step 3 - Resolve the assignee automatically (do not ask, do not guess)

The Defect/Bug goes to the developer who built the affected part of the originating Story, resolved fresh from that Story every time:
1. Fetch the originating Story (`getJiraIssue`) and its sub-tasks.
2. Find the sub-task prefixed `[FE]` or `[BE]` matching the defect's nature (UI/Frontend defect: the `[FE]` sub-task's assignee; backend/API defect: the `[BE]` sub-task's assignee). If the Story has no such sub-tasks, use the Story's own Assignee.
3. Assign the new Defect/Bug to that person's accountId.
4. If the user names the assignee explicitly in the message (a nickname or "ให้ <name>"), that overrides the auto-resolution. Jira search does NOT understand Thai nicknames (`lookupJiraAccountId` with `ก๊อต` returns 0 users), so resolve it like this:
   - Look the nickname up in `.claude/team/people.local.md` (a local, git-ignored list `nickname = name as in Jira`, ignoring upper/lower case; template `.claude/team/people.example.md`). `ฉัน` / `me` means the running user: use `ME_ID`, no lookup.
   - Then `lookupJiraAccountId` (param `searchString`, a plain string, not a JSON object) with that English name, and use the accountId only when exactly 1 user comes back.
   - Nickname not in the file, or the lookup returns 0 or 2+ users: do not guess. Ask the user once for the name as it is in Jira (or choose between the candidates), then offer to add the line to `people.local.md`.
   - If two ids for the same nickname ever disagree, trust the fresh lookup, not a remembered id.

Always confirm against the actual Story or `lookupJiraAccountId`; other developers work ETM tickets too. (The original skill also listed a few team accountIds for quick recognition; they are left out of this shared repo on purpose. Look them up.)

## Step 4 - Create the issue

First search for an existing defect (`project = ETM AND issuetype in (Defect, Bug) AND summary ~ "<Story key>"`, narrow `fields`) with the same symptom; if one exists, tell the user instead of creating a duplicate. After an error from `createJiraIssue`, search again before retrying. Create via `createJiraIssue` with the fields above and `contentFormat: "markdown"`. Do not pass `timetracking` / Original Estimate. `customfield_10020` (Sprint) takes a plain number (the sprint id), not an array: `"customfield_10020": 17028`.

When creating an issue link (`createIssueLink`) pass `type`, `inwardIssue` and `outwardIssue` as plain strings (`type: "Relates"`, `inwardIssue: "ETM-6857"`, `outwardIssue: "ETM-6538"`), not JSON objects. Use `getIssueLinkTypes` first if the exact link type name is in doubt.

## Step 5 - Known automation quirk (parked, do not attempt to fix)

A known ETM project automation has been seen to silently flip a newly created QA Defect's Work type / Found-in Environment (`customfield_15852`) shortly after creation. This is parked pending the user's own decision: do not re-fetch-and-correct it. If you notice it happened, mention it to the user in passing and do not change the field back.

## Step 6 - Embed evidence images the token-lean way (hard rule, one exception)

Every Defect/Bug that has images must have them embedded inline in the Description under the matching Actual Result heading; never left as a bare attachment, never skipped silently. The one exception: if the user says, for that specific ticket, that they will attach/embed the image(s) themselves, skip this step for that ticket and do not ask again. (`editJiraIssue` with a markdown image reference does NOT embed a real file; only a real file upload does, so this goes through the browser, which needs the user's go-ahead to open Chrome.) Keep it lean, this is the expensive part:

1. Invoke the `claude-in-chrome` skill first, before any `mcp__claude-in-chrome__*` tool.
2. Call `tabs_context_mcp` once. Reuse an existing Jira tab on this ticket, otherwise `tabs_create_mcp` one new tab and `navigate` straight to the ticket URL. If opening a tab is rejected, don't retry: stop and ask the user whether to try again or embed the image(s) themselves, and carry on with the rest (sub-task, Xray linking).
3. Open the Description editor first (its "Edit" control); the page-level "Add Attachment" input only attaches plain files. Then `find` (not a screenshot) the editor toolbar's "Add image, video, or file" button, click it, `find` the file input in the media-picker dialog and get its `ref`.
4. Call `file_upload` with that `ref` and the local image path(s): all images for this defect in one call when possible.
5. Click the editor's own "Save" so the embedded images persist.
6. Confirm with `read_page` or `get_page_text` (text only): the saved Description should show image placeholders after the Actual Result text, separate from the Attachments count. Take a `computer` screenshot only if the text check leaves real doubt.
7. If step 2 or 3 lands on an Atlassian login screen, stop and ask the user to log in in that tab, then resume from step 3; no retry loop.

No extra screenshots, hovers or zooms "just to check": every `computer` screenshot is the costliest part.

## Step 6b - Attach the dev brief (.md) when the Defect/Bug is opened (user rule, 25 Nov 2026)

Every Defect or Bug gets a dev brief, attached as a file at the time it is opened, not later.

1. Before creating the issue, write `work/<Story KEY>/dev-brief-<placeholder>.md` in English with these 8 sections (same as the existing briefs, e.g. `work/ETM-8391/dev-brief-ETM-9229.md`): `## 1. What is wrong`, `## 2. Where` (page, URL pattern, environment, role, data), `## 3. Steps to reproduce`, `## 4. Actual vs Expected` (table), `## 5. Rule source` (exact AC / BA words, Xray Test and step), `## 6. Hints for the fix (guess)` (only from the local FE source or the network, marked as a guess), `## 7. How QA will retest`, `## 8. Out of scope / do not change`. It holds no password, token or personal data.
2. Show it with the bilingual draft (Step 1); the user's yes to log the defect covers attaching it.
3. After Step 4 created the key, rename the file to `dev-brief-<DEFECT KEY>.md` and put the key in its title line.
4. Attach it as a plain file in the same browser visit as Step 6: the page-level "Add Attachment" (paperclip) input of the issue, `file_upload` with the `.md` path. It is an attachment, not embedded in the Description.
5. Check the Attachments list shows `dev-brief-<DEFECT KEY>.md` (text check). In the Step 9 summary say it was attached; if the browser step failed, say so and give the path so the user can attach it.

## Step 7 - Xray step-level linking (mandatory on every defect)

Do this every time, right after the Defect/Bug is created and linked to its Story, not only when the user mentions a Test Execution (corrected 1 Oct 2026 on ETM-6871). A defect with no TC link is incomplete.

- If the user gave a Test Execution key, use it.
- If not, find it from the originating Story: `project = <PROJECT_KEY> AND issuetype = "Test Execution" AND summary ~ "<Story key>"` (named "Test Execution for <Story key>"), with a narrow `fields` list.
- If no Test Execution exists for the Story yet, say so in the Step 9 summary instead of skipping silently.
- A step whose expected result does not spell out the exact rule broken is NOT a reason to skip: link to the step that checks the same column/field/behaviour, then in Step 9 point out that this step's expected result should be updated to state the rule.
- Ask the user only if two or more steps remain equally plausible, or the matched step's expected result contradicts the defect (see Step 1).

Then:

0. **Resolve the Test and step automatically when only a Test Execution key is given:**
   a. `xray_get_execution_tests` on the Test Execution key lists every Test (key, summary, status).
   b. Narrow by nature (match the summary's `[FE]` / `[BE]` tag to the defect) and by topical relevance of the summary wording.
   c. `xray_get_test_steps` on each remaining candidate and compare the defect's actual/expected text against each step's `expectedResult`; the step whose expected result states exactly the behaviour the defect violates is the match (e.g. "Start Date and End Date are on the left" matches a left-alignment defect; `Priority shows "Pre SD"` matches a defect where the raw value `PRE_SD` shows).
   d. Continue with steps 1-4 with that Test/step. Ask the user only if two or more candidates stay equally plausible, or the matched step's `expectedResult` conflicts with what the user says the expected behaviour is (Step 1): linking a defect to a step whose own text contradicts it would be confusing evidence in Xray.
1. Get the `testRunId` (`xray_get_execution_tests`) and the failing step's id (match the step number from `xray_get_test_steps` against `getTestRunById(id: testRunId) { steps { id } }`, which returns steps in the same order as the test's step numbers).
2. Link the defect at the exact failing step, never the whole test run, via `xray_graphql`: `addDefectsToTestRunStep(testRunId: String!, stepId: String!, issues: [String])` (issues = the defect's Jira **issue id**, e.g. `"2282863"`, not its key), then `updateTestRunStepStatus(testRunId: String!, stepId: String!, status: String!)` with `status: "FAILED"`. Both mutations need an explicit subfield selection (e.g. `{ warnings }`) or they are rejected.
3. **Always verify it persisted**: a clean `{warnings: []}` does NOT guarantee the link took effect (seen on ETM-6626: no warnings but the step stayed `TODO` with an empty `defects` array). Re-query `getTestRunById(id: testRunId) { steps { id status { name } defects } }` and confirm the step shows `FAILED` and the defect's issue id in `defects`. If not, retry the two mutations once before reporting success.
4. **Order matters:** `xray_import_results` on a Test Run resets every step to TODO and drops the step defect links (seen 23 Nov 2026 on ETM-8726 / ETM-8891). So import the evidence FIRST, then run the step mutations of item 2, then verify (item 3). If the import came last, run item 2 and 3 again.
   Also attach the same evidence screenshots as Xray evidence on the Test Run with `xray_import_results` (`evidenceDir`): cheap (no browser) and gives run-level evidence independent of the Description embed. `evidenceDir` must be a real path on the user's machine (e.g. `evidence/<TC key>` in `PW_REPO`). It attaches at the Test Run level only, not per step. Per-step evidence (`addEvidenceToTestRunStep`) needs the file inlined as base64 in the tool call: **never do this** (~49,600 characters of waste for one screenshot). Default to run-level evidence; reconsider per-step only if a token-lean device-side path exists (a script that uploads from the user's machine without routing the bytes through the conversation) and the user agrees.

## Step 8 - Mandatory [QA] sub-task

Create a sub-task under the new Defect/Bug every time, right after the Defect/Bug and its evidence are in place (easy to skip because the Defect/Bug feels "done"):
- Title: `[QA] Fix and verify <short description of the fix needed>`
- Assignee: self (`ME_ID`)
- Worklog: **estimate it per defect, do not always use 10m** (corrected 20 Nov 2026; before that a fixed 10m, and 15m was too high). Estimate the QA time actually spent on this defect, rounded to 5m:
  - 10m: simple UI defect on one screen, repro in a few clicks, test data already there.
  - 15-20m: needs test data set up first, several screens or roles, a GIF/screen recording, or checking against the AC/Xray steps.
  - 30m+: hard to reproduce (intermittent, several tries), cross-module, or needed investigation of the API/network.
  Put the estimate and a few words of why in the go-ahead question (e.g. "worklog 15m: repro + GIF"), so the user can change it before it is logged.
- **No Original Estimate and no Remaining estimate on the sub-task, ever** (corrected 16 Nov 2026, and again 18 Nov 2026 when the user dropped the 15m Remaining estimate: Jira copies any estimate set by `editJiraIssue` into Original Estimate, and the MCP tool cannot clear it; on ETM-8673 and ETM-8674 the user had to remove it by hand). So: create the sub-task with NO `timetracking` field at all; add only the worklog with `addWorklogToJiraIssue` (the tool has no remaining-estimate parameter; Remaining then shows `0m`, that is accepted); never call `editJiraIssue` on `timetracking`. Then re-read the sub-task (`getJiraIssue`, `fields: ["timetracking"]`) and confirm `originalEstimate` is empty; if it is set, tell the user in Step 9 (do not try to clear it). The parent Defect/Bug never gets any estimate (Step 2).
- A sub-task cannot be given a Sprint directly (the API rejects `customfield_10020` on a sub-task); it inherits the parent's sprint (Step 2), so leave that field out.
- **When the parent is a Defect or Bug, mark the sub-task Done immediately at creation** (confirmed 25 Sep 2026; on ETM-6767 Jira's own automation had already set it to Done). Transition Open -> "Start implementation" (In Progress) -> "Finished" (Done); if the transition list comes back empty, check the status again: automation may already have moved it to Done, then nothing more is needed.

## Step 9 - Confirm

Report back, short: the created ticket key/link (and that no Original Estimate is set on the Defect/Bug or the `[QA]` sub-task, verified), the Test/step it was linked to in Xray (or why none exists), the resolved assignee and which Story sub-task that came from, and explicit confirmation that images are embedded inline (not just attached) and that any Xray step linking was verified to have persisted.

## Notes

- Never fabricate reproduction steps, environment or build info: ask.
- This Jira renders Markdown, not Confluence wiki markup.
- For anything that overlaps a skill the user already set up (browser automation via `claude-in-chrome`, Thai response style), use that skill rather than reinventing its steps.
- When a new correction changes a number/value already applied to tickets created earlier in the same session, go back and fix those tickets too (e.g. `editJiraIssue` on `labels`; never on `timetracking`, see Step 8) rather than only applying it going forward, and say plainly which part could not be corrected (e.g. an already-logged worklog entry if no edit/delete tool exists).

## Retest result (corrected 19 Nov 2026)

When a retest of a defect passes, always add a comment on the Defect itself: "Retest: Passed" with the date, the environment, which test steps or repro steps were followed (and the Test Execution key), what was observed, and the `[QA] Retest` sub-task key. Also @mention the developer who fixed it (the assignee of the Defect, or of its `[FE]`/`[BE]` fix sub-task) in the same comment or a follow-up comment. A real mention needs `contentFormat: "adf"` with a `mention` node (`attrs: {id: <accountId>, text: "@Name", accessLevel: ""}`); the wiki form `[~accountid:...]` in markdown is NOT a mention (it is escaped as plain text). Comments can be edited with `commentId`. Do this together with the sub-task and the status change, never skip it. **Embed the retest evidence images in that comment, always** (corrected 23 Nov 2026, user: the images must be in the defect to prove the retest): real file upload through the comment editor as in Step 6 (Edit the comment, cmd+End, "Add image, video, or file", `file_upload` all images in one call, wait ~4 s, Save). Token-lean: one `find` per control, no screenshot to check, and confirm with ONE `getJiraIssue` `fields: ["comment"]` (markdown) looking only at the comment's `updated` time and the image count; never re-read it as ADF, never list transitions twice. Also attach the same images to the Test Run with `xray_import_results` `evidenceDir`. Skip the Jira embed only if the user says they will attach the images themselves. **Status after a passed retest: move the Defect to `Ready for UAT`** (transition "Ready for UAT"; the user did this by hand on ETM-8886, 23 Nov 2026). Read the transitions once and use the one whose target is `Ready for UAT`. ### Retest failed (corrected 20 Nov 2026)

1. Change nothing in Jira yet. Tell the user why it failed (what was done, what was seen, what was expected) and ask for the go-ahead (`team.mjs ask --approve` + `wait`, or a chat reply). Wait.
2. Only after the user's yes, do all of these together:
   - **Comment on the Defect**, same shape as a pass: "Retest: Failed" with the date, the environment, the test steps or repro steps followed (and the Test Execution key), what was observed (actual vs expected), and the `[QA] Reopen Defect` sub-task key. @mention the developer with a real ADF `mention` node (as above).
   - **Embed the failure image(s)** in that comment (real file upload through the browser, as in Step 6, but into the comment editor). If the user says they will attach the image themselves, skip it.
   - **Create the sub-task** `[QA] Reopen Defect - <why it is reopened, one short phrase>` (e.g. `[QA] Reopen Defect - status still not saved on an Inactive Plan`): assignee self, worklog estimated as in Step 8 (retest time), no estimate, mark it Done (same rules as Step 8).
   - **Move the Defect back to `Open`** (the workflow allows "Any" status -> Open). Read the transitions first (`getTransitionsForJiraIssue`) and use the one whose target is `Open`; if none, tell the user instead of picking another status.
   - In Xray, set the linked step back to `FAILED` with the defect still linked, and verify it persisted (Step 7).

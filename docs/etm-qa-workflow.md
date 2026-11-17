# ETM QA workflow — working reference

How to handle any test-case card sent for PTTEP EP-Turnaround Management (ETM / the STMS app), end to end.
Card-agnostic. Specific cards appear only as worked examples.

Last updated 17 Sep 2026.

---

## 1. The core rule

**A test case is never the authority on what correct behaviour is. The Story it hangs off is.**

Whatever a test case's Description claims — including a rule copied into it, a formula, or a condition — treat it as a secondhand summary. Go and read the Story. If the two disagree, the Story wins, and the test case is what needs fixing.

Test cases drift because:

- the Story's AC gets rewritten after the test case was authored
- whoever wrote the test case paraphrased the AC and lost a condition
- the test data named in the test case never existed, or was cleaned up

All three were seen in a single card in one afternoon.

---

## 2. Tracing a test case to its Story

Given any test case key, before running or judging anything:

1. **Read the test case itself.** Jira fields hold Description; the steps live in Xray and must be fetched separately.
2. **Find the Story.** In order of reliability:
   - issue links on the card (`is tested by`, `relates to`, `tests`)
   - a card key mentioned in the test case Description
   - the summary prefix convention — defects use `[ETM-nnnn] ...`, and test cases often name the area the same way
   - the Test Plan or Test Execution the test belongs to, which usually sits under the Story or its Epic
   - failing all that, JQL on the feature name
3. **Read the Story's full AC**, not just the clause the test case quotes. Neighbouring AC usually decide half the verdicts — a rule about when a field auto-fills is useless without the rule about when that field is enabled.
4. **Check for a second Story.** Features commonly split across two: one for the editing/validation behaviour, one for the display/visual behaviour. A verdict often needs both.
5. **Note the AC numbers used for each verdict** in your own working notes. Do not put AC numbers in test case Descriptions (see §6).

**Worked example.** ETM-6291 (Test) quoted a default-date rule and attributed it to ETM-5616. The parent Story that *looked* relevant, ETM-5837, turned out to cover only timeline badges and POB counting — no autofill rule at all. The real authority was ETM-5616 AC 1.2.7, and its wording was stricter than the test case's paraphrase, which flipped one observation from "card is ambiguous" to "this is a defect".

---

## 3. The end-to-end pipeline

Target flow. Steps marked **not built yet** still need a decision or a first run.

| # | Stage | Handled by | Status |
|---|---|---|---|
| 1 | Receive a card — Story, or an existing Test to review | — | working |
| 2 | Trace to the Story, read AC (§2) | — | working |
| 3 | Write test cases against the AC and Figma | **`create-test-case` skill** (§6) | working |
| 4 | Review existing test cases instead of drafting | **`review-test-case` skill** | working |
| 5 | Export `.xlsx` + CSV in the standard column format | `create-test-case` Task 4 | working | **[Superseded 20 Oct 2026 — no .xlsx/.csv any more; see the Correction at the end of this doc.]**
| 6 | Import the CSV into Xray as Tests | — | **not built yet** |
| 7 | Build the Test Execution, attach to the right Test Plan | — | **not built yet** |
| 8 | Link the cards — Test ↔ Story, Execution ↔ Plan, Execution ↔ Story | Jira API | partly available |
| 9 | Execute on QA, capture evidence per step | browser automation | working |
| 10 | Push results back — pass the passing cases, attach evidence | Xray API (§4) | statuses, defect links, and evidence attach (`xray_import_results`, device-side) all working |
| 11 | For failures, open a Defect and link it to the failing step | **`create-defect` / `log-defect-jira` skills** + §5 | working |

Stages 3, 4 and 11 already have skills. Do not hand-roll them — invoke the skill so the house format and the review passes are applied.

**Open questions, stages 6–8**

- does the CSV import go through the Xray UI or the API, and does the standard column set (§6) map straight onto Xray's importer or need remapping
- are Test Plans per sprint, per Story, or per feature area
- who creates the Test Execution, and may QA create it directly
- naming convention for Executions

Answer once, write the answers here, stop deciding them again.

---

## 4. Writing results back to Xray

**Exercised and working** — `updateTestRunStepStatus` (PASSED / FAILED per step) and `addDefectsToTestRunStep`. The run status rolls up on its own: failing one step flipped the whole run to FAILED without being told to.

Find the run first — a test has no run until it sits in a Test Execution:

```graphql
query { getTestRuns(testIssueIds: ["<issueId>"], limit: 20) {
  results { id status { name } testExecution { jira(fields: ["key"]) }
            steps { id action status { name } defects } } } }
```

**Evidence attach — working, confirmed 25 Sep 2026.** The `addEvidenceToTestRun`/`addEvidenceToTestRunStep` base64-inline path is still impractical from Claude's own **code execution** (blocked by that environment's domain allowlist, and a screenshot's base64 is too long for a tool call anyway) — but that was never the only path. The dedicated **`xray_import_results` tool runs on the user's own device**, not in code execution, so it was never subject to that allowlist. Once the user also enabled the domain in their own org's allowlist, it was confirmed working end to end:

```
xray_import_results(executionKey: "ETM-xxxx", tests: [{
  testKey: "ETM-yyyy", status: "PASSED",
  comment: "...", evidenceDir: "<PW_REPO>/output/evidence/<TEST-KEY>"
}])
```

`evidenceDir` must be a real absolute path on the user's device inside a connected folder (from `get_device_info.connectedFolders`, not a `$HOME/mnt/...` device_bash spelling) — attaches every file in that folder as evidence and sets the test's status in one call.

**Standard flow per test, going forward:** capture full-page + highlight-frame screenshots during execution into `/mnt/user-data/outputs/` → `SendUserFile` them (delivers to chat + gives a `file_uuid`) → `device_commit_files` into `<PW_REPO>/output/evidence/<TEST-KEY>/` on the user's machine → call `xray_import_results` with that folder as `evidenceDir` plus the final status/comment. This replaces the old "evidence goes up by hand" fallback — don't stop at saving files locally and asking the user to attach them, that was the pre-25-Sep workaround for before this tool path had been tried. Per-step status still goes through `updateTestRunStepStatus` as before; `xray_import_results` is for the test-level status + evidence bundle.

---

## 5. Defect rules

Two skills cover this: `create-defect` produces the bilingual report only, `log-defect-jira` actually files the ticket. Use them; the rules below are what the ETM project adds on top.

**When a defect is found mid-execution**

A failing step is not just marked failed and left. The sequence is fixed:

1. Stop and raise the defect through the normal process — `create-defect` for the report, confirm Work type / assignee / related Story, then `log-defect-jira`, then the post-creation checks below.
2. Take the resulting defect key and **link it back to the exact step of the test case where it was found** — not to the run as a whole. `addDefectsToTestRunStep(testRunId, stepId, issues)` does this; `addDefectsToTestRun` only covers the whole run and loses which step broke.
3. Set that step's status to failed, and leave the other steps judged on their own merits.
4. Carry on executing the remaining steps where they still make sense.

Linking at step level is what lets anyone later open the execution and see which action produced which defect, without reading the whole report.

**Before creating**

- Write the bilingual EN + TH defect report first and show it.
- Confirm Work type (Defect or Bug), assignee, and the related User Story if not already given.

**Fields**

- Summary is prefixed with the related User Story key: `[ETM-nnnn] ...`
- Epic comes from that Story's parent; set on both `parent` and `customfield_10014`
- Found-in Environment `customfield_15852` — DEV `16335`, QA `16336`, UAT `16337`, PROD `16338`. Defect → always QA. Bug → UAT or PROD, ask if not stated.
- Any UI or FE issue gets **both** labels `FE` and `UI`

**After creating**

- **Re-fetch the issue shortly after creation.** A project automation has been seen silently flipping Found-in Environment QA → UAT and Work type Defect → Bug. Correct it back before attaching any media.
- Create the mandatory `[QA]` sub-task: assigned to the user (`ME_ID`), worklog logged, remaining estimate 0m, transitioned Open → Start implementation → In Progress → Finished → Done.

**Evidence — hard rule**

Any image sent with a defect report **must** be embedded inline in the Description, under the matching Actual/Expected Result heading, using the description editor's hidden file input (`ref type="file"`, under the toolbar's "Add image, video, or file"). Not left as a bare attachment. No exceptions, Defect or Bug.

---

## 6. Writing test cases — use the existing skill

`create-test-case` is the authoring process. Invoke it rather than improvising; `review-test-case` covers the review-only case.

**Required input** — Jira link or requirement text, Figma link, and Sprint/Card info. Ask for anything missing before starting.

**Its five tasks**

1. Analysis — compare the Jira requirement against the Figma canvas, raise every mismatch as a confirmation question, translate content to concise professional English, tune steps for a human tester, add the standard edge cases from `analysis-checklist.md`
2. QA Lead review pass over the full drafted set
3. **Mandatory** `qa-manager` full-team review, which fans out to the relevant specialists. Present findings grouped by specialist with the overall verdict, and get an explicit decision on each — add a case, record it in the Known Gap Log, or no action. Never silently add or drop one.
4. Export in the standard column format
5. Write in this order: Permission/Access Control → Page Display → Interactive Element → Popup/Modal → Edge Cases → Close/Cancel

**Hard restrictions**

- Figma **comments** are never a requirement source — only the canvas
- Never write "Refer to Figma" or similar in Expected Result; transcribe the actual text and outcome
- Never include anything marked "Not Developed Yet" or out of scope

**Column set** (from `excel-csv-format.md`)

TCID · Summary · Description · Labels · Test Type · Priority · Test Step (Action) · Test Data · Expected Result · Environment · Assignee · Linked Test Story · Repository Path · Jira Key

- TCID `TC-XXX`; Summary starts `[FE][MT]` or `[BE][MT]` then `Verify [subject] [action/condition]`
- Labels `POS` or `NEG`; Test Type always `Manual`; Environment always `QA`; Jira Key blank
- Description carries the scenario, then Precondition (including the Role & Permission link), then Navigation Path
- Repository Path `Manual Test/Sprint XX/{CARD}-XXXX`
- Merge TCID/Summary/Description/Labels across rows of the same E2E case; combine cases that can run together
- Export one sheet only, named Test Cases — no helper or lookup sheets
- File `{CARD}-XXXX_TestCases.xlsx` in the TC folder, plus the matching CSV **[Superseded 20 Oct 2026 — no .xlsx/.csv any more; see the Correction at the end of this doc.]**

**Wording, as applied in practice**

- One action per step, short sentences, no "Step x:" prefix
- Plain words over system language: *shows* not *is rendered*, *stays empty* not *remains null*, *are filled in for you* not *are auto-populated*, *changes from greyed out to selectable* not *becomes enabled*, *the whole rule is skipped* not *the mechanism is bypassed*
- Expected Result is never blank or "-" — a look-and-note step still gets a real outcome: "Every day in the row shows 0. Write this down to compare in the next step."
- **No AC numbers** in the Description; keep other traceability (Figma links, card keys)
- Invented sample names for test data
- State derived constants explicitly (e.g. F and L, and the defaults from them) so nobody recomputes
- If a scenario cannot be built on the environment, write a coverage note instead of an unrunnable step

**Two caveats**

The skill and its references are written around the **EAPM** project — key prefix, the Role & Permission workbook, the folder paths. For ETM, the equivalents in §7–§8 apply, and the ETM TC folder's `CLAUDE.md` is the fuller ruleset, with `UI_Map_ETM.md` for verified navigation facts and `ETM_Templates/` for deliverable templates. `CLAUDE.md` wins where they differ.

If the Figma MCP hits its limit, switch to browser automation and carry on — no need to ask per page.

---

## 7. Tooling playbook

### Xray Cloud GraphQL

Auth and write access verified against ETM.

```graphql
query { getTests(jql: "key = ETM-6291", limit: 1) {
  results { issueId steps { id action data result } } } }
```

- `updateTestStep(stepId, step)` — **stepId only, no issueId**. Passing issueId returns 400 "Unknown argument".
- `addTestStep(issueId, step)` — appends to the end.
- `removeTestStep(stepId)` / `removeAllTestSteps(issueId)` — destructive, no undo. Prefer updating in place and appending, so the old content survives a mid-way failure.
- Batch several mutations in one document with aliases (`u1:`, `u2:` …).
- No "who am I / what may I do" endpoint exists. Write permission can only be proven by writing. **Safe probe:** `updateTestStep` sending a step's existing content back unchanged — success returns `warnings: []`, and the only side effect is the issue's updated timestamp.

### Jira

- cloudId accepts the site URL: `https://pttep.atlassian.net` (cloud `e94e9701-d426-48b7-b23a-d2786dadffc4`)
- Project ETM id 14436, board 4014
- Own account: get the user's accountId and name once per session with `atlassianUserInfo` (`ME_ID`, `ME_NAME`); they are not stored in this repo

### Browser automation

- Log in to the STMS QA site beforehand; passwords cannot be entered on the user's behalf.
- Screenshot filenames are set by the Chrome extension (`screenshot-<timestamp>-<n>`) and cannot be chosen at capture time — rename afterwards with a shell script.
- They land in a macOS temp folder that gets cleared periodically. Copy them out before relying on them.
- Figma MCP is capped at 6 calls per month on a View seat — use a browser for design sweeps.

---

## 8. Area knowledge — Manpower Mob Plan

One feature area, recorded because it was tested in depth. Other areas get their own section as they come up.

**Story ownership**

| Card | Owns |
|---|---|
| ETM-5836 | Adding and deleting personnel rows, mandatory fields, the row the user actually types into. Its AC 2.3.3 and 2.3.4 restate autofill and Onboard derivation but hand the formula to ETM-5616. **Defects from this page are filed under this key.** |
| ETM-5616 | In-cell editing, field types and limits, Onboard auto-derivation, Demob enablement, the autofill rule, date sequence validation, mandatory fields, save lifecycle |
| ETM-5837 | Timeline grid, M/O/D badges, presence bar, POB counting, Required Manpower row, read-only enforcement on the schedule pane |

Three Stories, one page. A defect goes under the Story that owns the screen the user was on (5836); the rule that decides whether it *is* a defect usually lives in 5616.

**The autofill rule (ETM-5616 AC 1.2.7)** — triggers if and only if **both** Mob Date and Demob Date are blank when Mob Transportation is picked. If either holds a value, the mechanism is bypassed entirely, Demob included.

| Field | Helicopter / MSB | Vessel |
|---|---|---|
| Mob Date | F − 1 | F − 2 |
| Onboard Date | F − 1 | F − 1 |
| Demob Date | L + 1 | L + 1 |

F = earliest date with Required Manpower > 0, L = latest. Evaluated when Transportation is selected, so manual edits to the row count. If Required Manpower is 0 on every date there is no F or L and nothing fires.

**Neighbouring AC that decide verdicts** — 1.2.2 Onboard derives from **Transportation** being set, not from Mob Date alone · 1.2.5 Demob stays disabled until Onboard exists, which needs Mob Date *and* Transportation · 1.2.6 Demob must be strictly after Onboard · 1.3.1 manually added resources have no Required Manpower row (ETM-5837 AC 3.2.2 agrees).

**QA test data**

```
https://stms-qa.apps.pttep.com/shutdown-event-list/events/9885b03f-17ab-4ff5-a725-6d841259ff1a/planning/808363e9-0b5e-4a4a-baa5-fa870dd576f5/manpower-mob/5932287a-b995-422b-8782-d54855f63cd7?years=2026,2027&tab=planning
```

Shutdown Event **NN TEST QA**, Plan Card **Manpower Mob Plan - NN** (Active). Grid covers **6–22 Sep 2026** only, despite the `years=2026,2027` parameter.

| Group | Required Manpower | Use |
|---|---|---|
| CONCOR | > 0 on 13 and 14 Sep | Snapshot resource. **F = 13 Sep, L = 14 Sep** |
| OMO | > 0 on 13 and 14 Sep | Second snapshot resource, rows already filled |
| QA Custom Trade / QA environment / Set Transportation | 0 every day | Empty Resource Exception |

Defaults for CONCOR + Helicopter/MSB: Mob 12 Sep, Onboard 12 Sep, Demob 15 Sep. Vessel: Mob 11 Sep, Onboard 12 Sep, Demob 15 Sep.

**Environment gap** — no resource exists *without* a Required Manpower row, so "no row" and "row that is 0 every day" cannot be told apart. Any case needing them as separate scenarios will not run as written.

**UI behaviour**

- Cells edit on **double-click**; single click does nothing
- Mob Date is locked until Name is filled (Name is mandatory)
- Columns are grouped Resource / Mob / Demob / Reservation; **Transportation lives inside the Mob group** and hides when collapsed
- The left pane scrolls horizontally with a scroll-right gesture over the rows
- Transportation: Helicopter, MSB, Vessel · Accommodation: LQ, Barge, FSO · D/N Shift: Day, Night · Hot Bed: Yes, No
- Edits are client-side draft until Save; refreshing loses everything, so capture evidence before leaving the page
- Onboard Date is greyed because it is view-only, not disabled

---

## 9. Findings from the Manpower Mob Plan run

**ETM-6354 — Onboard Date is displayed immediately after entering Mob Date although Transportation is not selected.** Medium, violates ETM-5616 AC 1.2.2. Setting Mob Date with Transportation empty makes Onboard mirror it at once; it should stay empty. The system assumes Helicopter/MSB, so a Vessel row would show a wrong value until Transportation is chosen. Filed under ETM-5836, status Deployed to QA — worth re-running the step to confirm the fix.

**ETM-6358 — Demob Date is filled automatically after selecting Transportation and can be earlier than the Mob Date.** Violates AC 1.2.7. With Mob Date already set, picking Transportation leaves Mob alone but fills Demob with L + 1. The whole rule should have been skipped. The planner's intended end of trip is overwritten, and it is easy to miss because the field they typed is untouched. The report also covers a sharper case: when Mob Date sits on the last date with Required Manpower, the filled Demob lands *before* the Mob Date. Filed under ETM-5836, status In Progress.

Probably one root cause: the guard reads as "is Mob Date blank" rather than "are both blank", and Onboard is computed without waiting for Transportation.

**Cleared, not a defect** — the Required Manpower row appearing on every resource group was checked and dropped. The environment gap it causes (§8) still stands for test-writing purposes.

**Verified working** — non-date fields do not affect autofill · Empty Resource Exception holds · setting Mob Date by hand on a resource with no F/L works normally, Onboard follows and Demob unlocks.

---

## 10. Session log

**17 Sep 2026 — ETM-6291.** Ran the card on QA and found its test data did not exist there. Traced the rule past ETM-5837 to ETM-5616 AC 1.2.7, whose stricter wording turned one observation from "the card is ambiguous" into "this is a defect". Rewrote the Description and replaced 7 steps with 8 based on real data, splitting a multi-action step; the originals were overwritten and cannot be recovered from the API. Assignee moved to the user, reporter and status untouched.

Executed against Test Execution **ETM-6300**. Steps 1 and 2 FAILED with **ETM-6354** and **ETM-6358** linked at step level; steps 3, 4, 6, 7, 8 PASSED; step 5 left TODO. Evidence not attached — see §4. Both defects were filed under ETM-5836.

---

## 11. Single-shot end-to-end flow — Story link only (confirmed 18 Sep 2026)

Trigger: user pastes a Jira **Story** link (Figma link optional — pull it from the Story if not given) and nothing else. Runs all 5 steps below in one pass, no stopping in between unless something is missing or ambiguous.

1. **Analyze AC vs Figma.** Same method as `create-test-case` Task 1 / `compare-jira-figma`: read the Story's full AC (§2), walk the Figma canvas, and work out the complete list of test cases needed — POS/NEG, all the standard edge cases from `analysis-checklist.md`. Output at this stage is the full test case list **with full Test Step / Expected Result detail already written** (not just scenario titles) — same wording rules as §6 (plain words, one action per step, no blank Expected Result, no AC numbers, invented sample names).
2. **Create two subtasks under the Story:**
   - `[QA] Create Test Case Manual Test`
   - `[QA] Execute Test Case Manual Test`
   - Parent = the Story itself. **No assignee set by default** — leave unassigned unless the user names one.
3. **Subtask 1 description** = the full test case list from step 1, written out in full (Test Step + Expected Result per case, not summarized).
4. **Original Estimate for subtask 1** — Claude proposes a reasonable figure based on the number and complexity of test cases just written, and states it to the user (does not set it silently).
5. **Original Estimate for subtask 2** — after subtask 2 is created, Claude proposes a reasonable figure for executing the test cases from step 3, based on their count and complexity, and states it to the user.

Open for later additions — user said more steps are coming after this base flow is validated.

**Step 6 (added 18 Sep 2026).** After subtask 1's description holds the full TC detail (step 3 above), build the actual Test Case deliverable from that same content by invoking the `qam-ninuch:create-test-case` skill — its rules apply in full (5 tasks, column format, wording rules, export format in §6). Do not reinterpret or shortcut it.

**Standing rule for this whole flow:** at any step, if anything is unclear or a decision is needed, stop and ask the user first — never assume and proceed.

**Step 7 (added 18 Sep 2026).** Immediately after step 6 produces the TC deliverable, run it through `qam-ninuch:review-test-case` — approve/reject verdict against the Story's AC and the Figma design, same as that skill's normal use. Any finding or requested change goes back to the user for a decision before the TC file is treated as final (per the standing "ask first" rule above).

**Reminder on step 6's output (18 Sep 2026):** the TC deliverable from `create-test-case` must always be produced as both an `.xlsx` file and the matching `.csv` (per §6's export rule) — never skip the CSV. Future addition planned: once produced, import the CSV straight into Xray (pipeline stage 6 in §3) instead of stopping at the file. Not built yet — flag it when reached rather than assuming it's ready. **[Superseded 20 Oct 2026 — no .xlsx/.csv any more; see the Correction at the end of this doc.]**

**Addition to step 7 (18 Sep 2026) — per-case summary.** Alongside the approve/reject verdict, produce a plain summary for every TC in the set: what the case does, what its expected result is, and what it is actually measuring/validating on that card (which AC or behaviour it proves). One short entry per TC, so the user can see at a glance why each case exists, not just whether the suite passed review.

**Addition to step 1 (18 Sep 2026) — creative/out-of-the-box TC types.** Beyond the standard checklist and 6 edge cases in `analysis-checklist.md` (Permission/read-only, Auto-save/draft, Delete confirmation, Action count/row order, Duplicate prevention, UI layout consistency), also consider broader angles per feature: boundary/limit values, data validation/format, state/session persistence, concurrency/race condition, error handling/API failure, cross-feature impact, usability/accessibility, environment/browser compatibility, time-sensitive logic (timezone/DST/date rollover). These are not added automatically — **always ask the user first** whether they want any of these "outside the box" types included for that specific card, before adding a TC for them.

**Decision (18 Sep 2026) — who creates Tests in Xray.** User will not upload the CSV manually through the Xray UI. Claude creates the Tests directly instead, via the Xray GraphQL `createTest` mutation (same access already verified working for `updateTestStep`/`addTestStep`/`addDefectsToTestRunStep` in §4) — one Test issue per TC, steps (action/data/result) added the same way. This bypasses the blocked path entirely (that block was Claude calling the Xray REST/import API from **code execution**, which the domain allowlist stops; GraphQL through the dedicated Xray tool is a different, already-working channel).

The `.xlsx`/`.csv` export (§6, reminder above) is still always produced as the record/deliverable — it just isn't the mechanism used to get Tests into Xray anymore. Column mapping confirmed 1:1 against the user's `importConfig_Xray.json` (see this session), so the same content used for the file is also what gets pushed via GraphQL — no reformatting needed between the two. **[Superseded 20 Oct 2026 — no .xlsx/.csv any more; see the Correction at the end of this doc.]**

**Not yet verified:** `createTest` itself has never been run against ETM (only step-level mutations on existing Tests have). First real run should create one Test, confirm it lands correctly (repository folder, labels, link to Story via link type `10007`, testtype), before creating a full batch.

Still waiting on: Test Plan/Test Execution examples from the user, to close the remaining two open questions in §3 (Test Plan structure, Execution naming/ownership).

**Approval gate (18 Sep 2026) — before pushing anything to Xray.** After step 7's review (`review-test-case` verdict + per-case summary), stop and wait for the user's explicit go-ahead on the TC set. `createTest` (or any other write into Xray) never runs until the user has reviewed the TCs and confirmed they're good — a passed `review-test-case` verdict is not itself the approval. This applies every time, not just the first run.

**Confirmed from screenshots (18 Sep 2026) — Story ↔ Test link and Test Coverage panel.**

- The link between a Story and its Tests shows on the Story page under the heading **"is tested by"** — this is link type id `10007` seen in `importConfig_Xray.json`. Confirms which direction/label to use when linking a Test back to its Story.
- The **Test Coverage panel** on the Story (Test Cases / Add Tests / Execute, with a PASSED/FAILED/TO DO rollup and an overall OK/NOK verdict) is a **native Jira/Xray feature** — it reads off the "is tested by" issue links plus each linked Test's status. It is not something to build or maintain separately.

**Unverified assumption — check during the pilot.** The panel should populate the same way regardless of whether the "is tested by" link was created by hand in the UI or via the Xray GraphQL/Jira API, since the panel is driven by the issue link itself, not by how it was created. This has **not been tested** through our actual automation path yet (only defect-link mutations are verified in §4). During the first pilot run (single Test, single link), open the Story page afterward and confirm the Test Coverage panel picks it up automatically before assuming this holds for the full batch. If it doesn't populate, check the link direction (inward vs outward) on id `10007` first.

**Gate (18 Sep 2026) — execution waits on board status.** Writing the TCs (steps 1–7 in §11) never has to wait — it can run as soon as the Story and Figma exist, regardless of dev progress. But the actual **execute** stage — the `[QA] Execute Test Case Manual Test` subtask, and creating/running a Test Execution in Xray — cannot start until the Story card has reached **"Ready for QA"** on the ETM Scrum board (board 4014). If the card is still in To Do / Requirements Elaboration / For Planning / In Development, testing is blocked on dev, not on QA — say so plainly and don't attempt to execute. Check the card's current column before starting the execute stage every time; don't assume it's ready just because the TC-writing stage finished.

---

## 12. Test execution — how a run is actually done (18 Sep 2026)

1. Check the gate first (§9 above) — the Story card must already be at "Ready for QA" on the board.
2. Trace to the real Story per §2, read the full AC, not just what the TC quotes.
3. Open browser automation (Claude in Chrome) on the STMS QA site per the test data in the TC. User logs in beforehand — Claude never enters the password.
4. Follow each Test Step exactly as written, compare the actual result against Expected Result.
5. **Take a full-page screenshot for every step, no exceptions** — not just the ones that seem to need it. Capture before leaving the page, since draft edits are lost on refresh (§8). Rename each screenshot immediately (the Chrome extension auto-names them `screenshot-<timestamp>-<n>`) and copy them out of the macOS temp folder before it gets cleared.
6. Write the result back to Xray per step as you go (`updateTestRunStepStatus`), not batched at the end. The run status rolls up on its own.
7. On a FAILED step: stop, raise the defect per §5 (bilingual report → confirm fields → log to Jira → `addDefectsToTestRunStep` at the exact step, not the whole run), set that step failed, then continue with the remaining steps that still make sense.
8. Evidence attachment to the Xray Test Run works via `xray_import_results` (device-side tool, §4) — bundle the screenshots for that test into `<PW_REPO>/output/evidence/<TEST-KEY>/` and pass that folder as `evidenceDir` along with the final status/comment.

**Rule added to §6 (18 Sep 2026) — Navigation Path needs the real URL.** When writing a TC's Description, the Navigation Path must include the actual URL of the page under test whenever that URL is known (e.g. test data already exists on QA, like the Manpower Mob Plan link in §8) — not just a page name. This is what lets execution (§12) open the right page directly via browser automation instead of guessing the click-path. If no URL exists yet (no test data ready), say so explicitly in the Navigation Path instead of leaving it vague.

**Approval gate added to §5 (18 Sep 2026) — wait before acting on a defect.** The moment a step fails and looks like a defect, stop immediately and tell the user first — describe what was found and why it looks like a defect. Do not draft the bilingual report, confirm fields, or call `log-defect-jira` until the user says to proceed. This applies every time a defect is found, not just once.

**Assignee rule added to §5 (18 Sep 2026) — assign the defect to the Story's dev.** Once the user confirms it's a defect (per the approval gate above), look up the Story card's own assignee — that's the dev who built it — and set the defect's assignee to that same person directly. Which dev it is is already marked on the card via the `[FE]`/`[BE]` prefix (or similar), so no need to guess between front-end/back-end owners; just read who's assigned on the Story and carry it over to the defect.

**§5 adjustments (18 Sep 2026):**

- **Work type defaults to Defect.** When not told otherwise, assume **Defect** — don't stop to ask which one. Only ask if there's a real signal it might be a Bug instead (e.g. found in UAT/PROD, not QA).
- **Re-fetch-after-creation fix — parked, not decided.** The "automation silently flips QA→UAT / Defect→Bug" problem is real but the fix is unclear and possibly hard. User wants to think it over before deciding an approach. Leave the re-fetch-and-correct step as-is for now; don't change this until revisited.
- **`[QA]` sub-task remaining estimate — no longer fixed at 0m.** Give a reasonable estimate based on the fix/verification work involved, same reasoning approach as the Original Estimate calls elsewhere in this flow (§11 steps 4–5) — not a flat default.
- **Screenshot evidence is mandatory when reporting a defect to the user.** When telling the user a step failed and looks like a defect (the approval-gate moment in §5 above), always include the screenshot(s) that show it — this is the evidence that proves it's a real defect, not just a claim. Never describe a failure in words alone without the image backing it up.

**Scope note (18 Sep 2026) — §5 applies outside the flow too.** All of §5's rules (wait for user confirmation, default Work type to Defect, assignee = the Story's dev, mandatory screenshot evidence, step-level linking, etc.) apply the same way even when the user asks Claude to log a defect directly, standalone, outside of running the full test-execution loop (§11/§12). Same rules either way — nothing here is specific to being mid-run.

**Clarification (18 Sep 2026) — evidence source for standalone defects.** For a standalone defect (not from a Claude-run execution), the mandatory screenshot evidence can be whatever image the user attaches when asking for the defect — it doesn't have to be one Claude captured itself. Same embed-inline rule applies either way (§5's evidence rule): the user's attached image goes inline in the Description under the matching Actual/Expected Result heading, not left as a bare attachment.

**Gate refinement (18 Sep 2026) — always ask before executing, even when the board says ready.** Checking the board status is necessary but not sufficient. Even when the Story card is already at "Ready for QA", Claude still asks the user "ready to test?" before starting execution — only proceeds once the user explicitly says go ahead. If the board isn't at "Ready for QA" yet, say so plainly and don't ask to proceed (nothing to confirm — it's blocked on dev either way).

**Post-execution step added to §12 (18 Sep 2026) — close everything out.** Once execution is fully finished (all steps run, all results written back to Xray, all defects raised per §5), two closing actions follow — do not leave the run "done" without them:

1. **Resolve the "is tested by" linked Tests on the Story.** Run the `anthropic-skills:resolve-tested-by` skill against the Story key: it finds every Test linked via "is tested by", assigns each to the current user, transitions Resolved (Resolution = Done), then Closed, and verifies via JQL. Use this skill rather than doing it by hand — it already has the transition-id quirks worked out.
2. **Transition the Test Execution card itself to Done.** This is separate from step 1 — closing the individual Test issues does not automatically close the Test Execution issue that ran them. Confirm the transition path with `getTransitionsForJiraIssue` on that Execution (don't assume the same ids as other issue types) and move it to Done, matching the pattern shown for ETM-6300 (Test Execution for ETM-5837).

Both steps apply after every full execution run, not just the first one.

**Final step added to §12 (18 Sep 2026) — move the Story to Ready for UAT.** After execution, defect handling, and the post-execution closeout (resolve-tested-by + Test Execution → Done) are all finished, move the **Story card itself** to **"Ready for UAT"** on the ETM Scrum board (board 4014) — matching the column highlighted in this session's screenshot.

**Condition before moving:** only the **`[QA]` subtasks** on the Story need to be Done first (`[QA] Create Test Case Manual Test`, `[QA] Execute Test Case Manual Test`, and any `[QA]` defect sub-tasks per §5). Non-QA subtasks (e.g. dev's own) are not Claude's concern and don't block this move — check QA-side subtasks only before transitioning the Story.

**Retest gate added to §5 (18 Sep 2026).** Before retesting a defect to confirm a fix, check the **Defect ticket's own status** (not the Story's) — it must be **"Deployed to QA"** first. That status means dev has fixed and deployed it, so it's ready to retest. If it's not there yet, don't attempt the retest — say plainly it's still waiting on dev, same spirit as the Story-side "Ready for QA" gate in §9/§11.

**Retest execution rules added to §5 (18 Sep 2026):**

- **Create a `[QA] Retest` sub-task** under the Defect ticket before retesting — description states what will be retested and how (based on the defect's original repro steps), mirroring the mandatory `[QA]` sub-task already required when the defect was first created.
- **Retest by following the defect's original repro steps** exactly, step by step, comparing against what the fix should now produce.
- **Capture screenshot evidence during retest**, same as normal execution (§12 step 5 — full page, every step).
- **Save the evidence locally in the user's connected folder** (under the Playwright repo's `output/evidence/`, in a clearly named subfolder per Defect key, e.g. `<PW_REPO>/output/evidence/<Defect Key>/`) rather than attempting to attach it to Jira/Xray directly — the user attaches it themselves. Tell the user where the files landed.

**Regression trigger added to §11 (18 Sep 2026) — Story moves backward on the board.** If a Story card that had already reached "In Testing" (or later) moves **back** to "In Development" or "For Planning", treat that as a signal the requirements changed mid-flight. When it happens:

1. **Wait until the card reaches "Ready for QA" again** before acting — same gate as §9/§11's execution gate. A card sitting in "In Development"/"For Planning" isn't ready to be rechecked yet, same reasoning as not being ready to execute.
2. **Once it's back at "Ready for QA", re-read the AC in full** and diff it against what was used before, to see what actually changed.
3. **Recheck everything, especially the TC set** — if the AC gained new conditions/behaviour, write new TC(s) to cover them (same wording rules, same "ask first" standing rule for anything unclear). Don't assume the old TC set still covers the feature.
4. **Once the recheck/new-TC work is done, re-enter the normal loop at the execute stage** (§12) — but **do not start executing yet**. Wait for the user's explicit go-ahead first, same as the existing "ready to test?" gate.

**Addition to §11 step 6 (18 Sep 2026) — the real TC file must be just as detailed.** The full Test Step / Expected Result detail written into subtask 1's description (step 3) is not a draft that gets summarized down when it becomes the actual TC deliverable. When `create-test-case` builds the real `.xlsx`/`.csv` file, every case keeps the same level of detail — full step-by-step Test Step (Action) and a real Expected Result per step, nothing condensed into a shorter summary version. The subtask description and the TC file should read at the same level of detail; only the format changes (free text vs. the standard column layout).

**Correction to §11 step 3 and the addition above (18 Sep 2026) — subtask 1 description is a summary, not the full detail.** Revised: subtask 1 (`[QA] Create Test Case Manual Test`)'s description only needs to summarize each TC — what it does, in a line or two per case — not the full Test Step / Expected Result breakdown. The full step-by-step detail (Test Step (Action) + Expected Result per step, same wording rules as §6) is written only once, when building the actual TC deliverable in step 6 via `create-test-case`. That real TC file (`.xlsx`/`.csv`) is where the detail must be complete — nothing condensed there. This replaces the "subtask 1 description = full TC list with full detail" instruction earlier in §11 step 3.

**Addition to §11 (18 Sep 2026) — user reviews the detailed TC content before it goes into the real file.** Before invoking `create-test-case` to produce the actual `.xlsx`/`.csv` deliverable (step 6), Claude first drafts the full step-by-step TC content (Test Step + Expected Result per case, same wording rules as §6) and shows it to the user for review. Only after the user confirms the detail is correct does Claude proceed to build the real file. This sits in addition to — not instead of — the existing `review-test-case` pass (step 7) and the Xray approval gate: there are now two checkpoints before anything is final — (1) user review of the drafted detail before the file is built, (2) `review-test-case` + user approval before pushing to Xray. **[Superseded 20 Oct 2026 — no .xlsx/.csv any more; see the Correction at the end of this doc.]**

**Reorder of §11 steps 1-5 (18 Sep 2026) — quick scan and planning first, full detail after.** Reason: the user needs subtasks and estimates in hand for sprint planning before committing time to a full detailed analysis. Revised order:

1. **Quick scan first** — a rough pass over the Story's AC and the Figma design, just enough to gauge scope (roughly how many test cases, how complex, any obvious extra areas). Not the full detailed AC-vs-Figma comparison from `create-test-case` Task 1 / `compare-jira-figma` — that full analysis is deferred to later (see below). No mismatch-hunting or edge-case enumeration yet.
2. **Create the two subtasks** under the Story — `[QA] Create Test Case Manual Test` and `[QA] Execute Test Case Manual Test` — same as before (parent = Story, unassigned by default).
3. **Propose Original Estimate for both subtasks**, based on the quick scan's rough sense of scope, and state the figures to the user (does not set silently) — same reasoning approach as before, just earlier and based on a lighter read.
4. **Only after** the subtasks and estimates are done — the planning need is satisfied — does the **full detailed AC-vs-Figma analysis** run (the original step 1: full method from `create-test-case` Task 1 / `compare-jira-figma`, complete test case list with full Test Step / Expected Result detail, all standard edge cases from `analysis-checklist.md`).
5. Subtask 1's description then gets the **summary** of that full analysis (per the earlier correction — one or two lines per TC, not the full detail).
6. From there the flow continues as before: draft the full step-by-step TC content → **user reviews it** → build the real file via `create-test-case` → `review-test-case` → user approval → (eventually) push to Xray.

This replaces the previous step order in §11, where the full AC-vs-Figma analysis happened before the subtasks were created.

**Correction to the quick scan step (18 Sep 2026) — AC only, no Figma yet.** The quick scan in the reordered §11 step 1 reads only the Story's AC, not Figma. Figma is not opened until the full detailed AC-vs-Figma analysis (the later step). This keeps the quick scan fast and planning-focused — scope and estimates come from AC alone.

**Addition to §11 (18 Sep 2026) — multiple cards in one message.** The user may paste several ETM Story links/keys in a single message (e.g. separated by commas, spaces, or newlines), with no other text. Treat this the same as the single-card trigger, but run only the quick-scan-and-plan stage (§11 steps 1-3: AC-only quick scan → create the two `[QA]` subtasks → propose Original Estimates) for **every** card listed, one after another, before moving any of them on to the full detailed AC-vs-Figma analysis. Report all cards' quick-scan summaries and proposed subtasks/estimates together in one reply, then wait for the user's go-ahead — per-card or all-at-once — before creating anything or proceeding further on any of them. Do not silently skip a card that fails to load (e.g. wrong key, no access) — report which one failed and continue with the rest.

**Ad-hoc query pattern (18 Sep 2026) — sprint backlog filtered by issue type Story.** When the user asks to look at a sprint's backlog and only see Story-type issues (e.g. "ไปดู backlog ของ Sprint {N} ดูแค่ type Story"), this is a direct Jira lookup, not the bare-card `etm-nn-fullqa` trigger — run it via `searchJiraIssuesUsingJql` with:

```
jql: 'project = ETM AND sprint = "Sprint {N}" AND issuetype = Story ORDER BY key ASC'
fields: ["summary", "status", "issuetype", "assignee"]
```

Report back key, summary, status, and assignee for each. If any of the returned cards already have a quick-scan/estimate/subtask status from earlier in the session, note that alongside the listing rather than re-stating it as new.

**Addition to §11 (18 Sep 2026) — always check for existing [QA] subtasks before creating new ones.** Before creating the two `[QA]` subtasks (`[QA] Create Test Case Manual Test`, `[QA] Execute Test Case Manual Test`) under a Story, first check whether they already exist under that Story (they may have been created by hand or by an earlier run). If they do, use the existing ones — never create duplicates. Add/append the quick-scan summary, estimates, and later the full TC detail into the existing subtask's description rather than creating a fresh one. This applies every time, not just when picked up mid-flow.

**Addition to §11 (18 Sep 2026) — skip the estimate step if the subtask already has one.** When checking for existing `[QA]` subtasks (per the addition above), if a found subtask already has an Original Estimate set, skip proposing/asking about an estimate for it — use the existing value as-is and move straight on. Only propose an Original Estimate for a subtask that doesn't have one yet.

**Addition to §11 (18 Sep 2026) — file Xray Tests into the right Sprint folder in the Test Repository, creating it if missing.** When pushing test cases into Xray as Test issues (the final `createTest`/link step), do not leave them unfiled at the Test Repository root. The project's real folder convention is `/Manual Test/Sprint {N}/{STORY-KEY}` (e.g. `/Manual Test/Sprint 22/ETM-6378`) — confirmed from the existing folder tree, which nests every past sprint's story folders under a single top-level `/Manual Test` folder. After creating and linking the Test issues, always:
1. Check whether `/Manual Test/Sprint {N}/{STORY-KEY}` already exists (via `getFolder` on `/Manual Test/Sprint {N}`).
2. If it doesn't exist, create it with `createFolder` (this also creates the parent `Sprint {N}` folder automatically if that's missing too).
3. Move all the newly created Test issues into that folder with `addTestsToFolder`, passing their Xray `issueId`s (not the Jira keys).
Never create a bare `/Sprint {N}` folder at the Test Repository root — it must sit under `/Manual Test/`, matching every other sprint folder in the repository.

**Addition to §11 (18 Sep 2026) — every sprint has one Test Plan issue aggregating all its Tests, create it if missing.** Separate from the Test Repository folder structure (which organizes Tests by story for browsing), the project also keeps one Xray Test Plan issue per sprint — summary exactly `Test Plan for Sprint {N}` (e.g. ETM-6078 "Test Plan for Sprint 21", confirmed pattern going back through every past sprint) — that aggregates every Test created that sprint regardless of story, via `addTestsToTestPlan`. After creating and folder-filing a Story's Test issues in Xray:
1. Check whether `Test Plan for Sprint {N}` already exists for the current sprint (JQL: `project = ETM AND issuetype = "Test Plan" AND summary ~ "Test Plan for Sprint {N}"`).
2. If it doesn't exist yet (e.g. first card of a new sprint), create it (`createJiraIssue`, issue type "Test Plan", project ETM, no other fields required).
3. Add the newly created Test issues to it with `addTestsToTestPlan` (issueId of the Test Plan, testIssueIds = the Xray issueIds of the new Tests).
Do this every time Tests are pushed to Xray, not just once per sprint — later cards in the same sprint add their Tests to the existing Test Plan rather than creating a new one.

**Addition to §11 (18 Sep 2026) — the sprint Test Plan also needs a per-story folder, and Test Executions must be created scoped to that folder.** The sprint's aggregate Test Plan (see the addition above) is not just a flat list — like the Test Repository, it needs its own folder per story so different cards' tests inside the same sprint's Test Plan stay separated. After adding a Story's new Tests to the sprint's Test Plan with `addTestsToTestPlan`:
1. Check whether a `/{STORY-KEY}` folder already exists inside that Test Plan (via `getFolder(testPlanId: ..., path: "/")`).
2. If not, create it with `createFolder(testPlanId: ..., path: "/{STORY-KEY}")`.
3. File the Story's Tests into it with `addTestsToFolder(testPlanId: ..., path: "/{STORY-KEY}", testIssueIds: [...])`.
Xray's GraphQL schema does NOT support folders inside a Test Execution issue itself (`createFolder` only accepts `projectId` or `testPlanId`, never a Test Execution id) — a Test Execution is always a flat list of tests. So the per-story separation for execution is achieved differently: when it's time to execute (the ETM-6521 stage), create the Test Execution FROM that story's folder in the Test Plan board (right-click the `/{STORY-KEY}` folder → "Create Test Execution", or the equivalent GraphQL call scoped to that folder's tests) rather than from the whole Test Plan board — this way the resulting Test Execution naturally contains only that story's tests, giving the same per-story separation Test Executions can't do with folders directly.

**Correction to the Test Execution addition above (18 Sep 2026) — create it right away, don't wait for deployment, and use the confirmed naming convention.** The user corrected this: creating the story's Test Execution does not need to wait until the ETM-6521/execution stage or deployment to QA — do it as part of the same push-to-Xray flow that creates the Tests, right after filing the Story's per-story folders into both the Test Repository and the sprint Test Plan. Confirmed naming convention from existing examples (e.g. ETM-6300 "Test Execution for ETM-5837", ETM-6297 "Test Execution for ETM-5616"): summary is exactly `Test Execution for {STORY-KEY}`. Steps, every time Tests are pushed to Xray for a Story:
1. Create the Test Execution issue: `createJiraIssue`, issue type "Test Execution", project ETM, summary `Test Execution for {STORY-KEY}`.
2. Associate it with the sprint's Test Plan: `addTestExecutionsToTestPlan(issueId: <TestPlan issueId>, testExecIssueIds: [<new Test Execution issueId>])`.
3. Load it with the Story's Tests: `addTestsToTestExecution(issueId: <new Test Execution issueId>, testIssueIds: [<all the Story's new Test issueIds>])`.
The Test Execution stays empty/not-run (status TODO) until the actual execute stage — creating and pre-loading it early just keeps it scoped to the one story, matching the per-story folder separation in the Test Repository and Test Plan. Update the `[QA] Execute Test Case Manual Test` subtask's description to reference the created Test Execution key once this is done.

## Addition to §11 (18 Sep 2026) — always set Assignee to the user's own account

Whenever any issue created or touched in this ETM QA workflow needs an "Assignee" field set
(subtasks like [QA] Create/Execute Test Case, Xray Test issues, Test Plan, Test Execution, and
any future Defect issues), always set it to the user's own Jira account automatically, without
asking:

- accountId and displayName: get them once per session with `atlassianUserInfo` (`ME_ID`, `ME_NAME`); they are not stored in this repo

Apply via `editJiraIssue(fields: {"assignee": {"accountId": "<ME_ID>"}})`
right after creating/editing the issue, as part of the same flow — not as a separate follow-up step
the user has to request.

## Correction to §11 (18 Sep 2026) — this Jira instance renders Markdown, not wiki markup, in issue descriptions

Confirmed by inspecting AIS-20's raw description: this PTTEP Jira instance's description field
(via editJiraIssue) must be written in standard Markdown, NOT old Jira wiki markup. Using wiki
markup (`h2.`, `h3.`, `||header||` tables, `_italic_`/`*bold*` wiki-style) renders as literal odd
text instead of formatting.

Use Markdown syntax instead:
- Bold headers: `**Heading**` (not `h2. Heading`)
- Tables: `| Col1 | Col2 |` header row + `| --- | --- |` separator row + `| ... |` data rows
  (not `||Col1||Col2||` wiki tables)
- Checklists: `- [x] done item` / `- [ ] pending item` (not `(/)`  wiki checkmarks)
- Code blocks: triple backticks ``` (this part was already correct)

Always write/rewrite any Jira description (this project or others on this instance) using this
Markdown syntax going forward.

## Addition to §11 (18 Sep 2026) — always set Test Environment = QA on every Test Execution

Every Xray Test Execution issue created in this workflow must always have its Test Environment
field set to "QA", automatically, without asking:

- When creating: pass `testEnvironments: ["QA"]` to the `createTestExecution` GraphQL mutation.
- If a Test Execution already exists without it: use `addTestEnvironmentsToTestExecution(issueId, testEnvironments: ["QA"])`.
- Verify with `getTestExecution(issueId) { testEnvironments }`.

Confirmed on ETM-6565 ("Test Execution for ETM-6378") — already has testEnvironments: ["QA"].

## Addition to §11 (21 Sep 2026) — createTest verified, pilot-then-batch confirmed working end to end

First real `createTest` run against ETM, done for ETM-6380 (16 Tests, ETM-6566 to ETM-6581). Confirmed:

- `createTest(testType: {name: "Manual"}, steps: [...], jira: {fields: {...}})` works directly against
  ETM. `jira.fields` accepts `assignee: {accountId: "..."}` and `environment: "QA"` right on create —
  no separate `editJiraIssue` follow-up call needed for those two fields.
- Repository folder placement (`xray_test_repository_folder` in the CSV importConfig) is **not**
  auto-created by `addTestsToFolder` despite `config.create.test.repository.folders: true` in
  `importConfig_Xray.json` — that flag is CSV-importer-specific. Via GraphQL, call
  `createFolder(projectId, path)` first (safe to call once per new folder), then `addTestsToFolder`.
  `projectId` is the Jira numeric project id (ETM = "14436"), not the project key.
- Issue link to the Story: `createIssueLink(inwardIssue: <Test>, outwardIssue: <Story>, type: "Test")`
  — **corrected 24 Sep 2026.** The earlier note had it reversed (inward = Story), which made the Story
  show "tests <Test>" and left the Test Coverage panel UNCOVERED on ETM-6380 and ETM-6395. Both were
  fixed (correct links created, reversed links deleted). Verify after linking with JQL
  `issue in linkedIssues("<STORY>","is tested by")` — the count must equal the number of Tests.
- GraphQL has a max-operations-per-request cap: a single mutation document errors past **25
  operations** total (not 25 aliases — each `createTest` counts as more than 1). Batch at 5
  `createTest` aliases per request to stay well under the cap.
- Description field via `createTest`'s `jira.fields.description` does **not** cleanly accept Markdown
  bold markers (`**text**`) — it rendered as literal escaped asterisks (`\***text**\*`). Send plain
  text with `- ` bullet lines and no bold/heading markup; Jira still renders `- ` as a proper bullet
  list and auto-linkifies URLs/issue keys on its own.
- Pilot-then-batch worked as intended: created ETM-6566 alone first, verified summary/description/
  priority/labels/environment/assignee/folder/link all landed correctly, then batch-created the
  remaining 15 with the same recipe and no warnings on any call.

**Still not verified:** whether the Story's Test Coverage panel visually reflects these links without
a manual page reload/check — assumed yes per the 18 Sep note (the panel reads off the issue link
itself), but not visually confirmed via screenshot this run either.

## Addition to §11 (21 Sep 2026) — always fill in the "[QA] Create Test Case" subtask description after Test Execution is created

After finishing the push-to-Xray flow for a Story (Tests created, filed into the Test Repository
folder, added to the sprint Test Plan and its per-story folder, and the Test Execution created),
always circle back and write/update the "[QA] Create Test Case Manual Test" subtask's description
with the standard summary template. Do not leave it blank even if every other step (Xray push,
folders, Test Plan, Test Execution) is already done — this description write is its own mandatory
closing step, not automatically covered by the Xray work.

Template (Markdown syntax per the formatting rule above):
- Header line naming the Story and what was pushed (Test key range, "Tests" link)
- "Where everything lives" table: Test Repository folder, Sprint Test Plan, Test Execution, deliverable files
- "Definition of Done" checklist reflecting what was actually confirmed done
- "Test case summary" table: Test key | Type (POS/NEG) | What it checks | What it proves, for every test
- "Next step" line pointing to the Test Execution, ready once the Story is deployed to QA

Confirmed missed once on ETM-6380 (subtask ETM-6524 was left with an empty description even though
all 16 Tests, the Test Plan folder, and Test Execution ETM-6582 were already correctly set up) —
caught and fixed after the fact. Treat this as a checklist item to verify every time, not just when
prompted.

## Addition (23 Sep 2026) — keep Jira/Xray MCP calls token-lean

The user is running heavy POC usage on this project and wants token usage kept down. Apply these whenever this doc's steps call Atlassian_Rovo or Xray GraphQL tools:

- Always pass a narrow `fields` list on `searchJiraIssuesUsingJql` / `getJiraIssue` (e.g. `["summary","status","assignee"]`) — never omit fields or use `"*all"` unless a specific extra field is actually needed for that step.
- Cap `maxResults` to what the step actually needs (10-20 for a status check, not 50-100) instead of pulling a large page and filtering client-side.
- Prefer a specific JQL filter (status, issuetype, key) over a broad "all issues" query that risks exceeding the token cap and getting dumped to a file for a follow-up read.
- Use `searchResultMode: "count"` when only a count is needed, not full issue objects.
- Don't re-run a failed connector/tool call more than once or twice with variations — surface the blocker to the user instead of trial-and-error.
- When reporting results back to the user, summarize instead of pasting raw dumps; show full detail only on request.

## Addition (23 Sep 2026) — evidence screenshot standard: full page + highlight frame

Confirmed standard for every evidence screenshot captured during execution (§9) or attached to a defect (§10): capture the **full page** (not a tight crop), then add a **highlight frame/box** drawn around the specific element or area the step is actually validating. Never send a bare full-page screenshot with no frame, and never send only a cropped close-up with no page context — both lose information the reviewer needs. This replaces the earlier back-and-forth (full image only -> cropped-only) with the final standard: full image + frame, every time.

## Addition (23 Sep 2026) — xray-import.mjs rewrite (TC_KEY_OFFSET removed)

Replaced the old `xray-import.mjs`, which guessed each TC id's real Xray key with `TC_KEY_OFFSET` arithmetic (baseKey + N) — proven wrong from TC-010 onward on a real run, since Xray keys aren't guaranteed sequential per Story. New version lives at `STMS/scripts/xray-import.mjs` (see `STMS/scripts/README.md`):

- No more guessing: it only imports a TC id that has a real, previously-recorded mapping in `scripts/tc-maps/<EXECUTION>.json`.
- The authoritative mapping should be recorded **at Test-creation time**: right after each `createTest` GraphQL call returns its new key, call the script's exported `recordTcMapping()` to persist TC id -> real key immediately, rather than reconstructing it later by arithmetic. Add this call to step 3 (Xray creation approach) of this doc's push-to-Xray flow going forward.
- `EXECUTION_KEY` is no longer hardcoded in the script — it's always passed as `--execution=<KEY>` on the command line.
- Before any write, it runs 4 safety layers (recorded mapping exists -> no key collisions -> live re-check against Xray that the key is still on this execution and its summary hasn't drifted -> dry-run by default, real write needs `--yes` + a typed confirmation). Any failure blocks the whole import instead of writing partial/wrong results.
- Not yet run against real Xray from this script (GraphQL field names are written against Xray Cloud's documented schema but unverified end-to-end here) — run `--build-map` first (read-only) on the next real card to confirm before trusting `--yes`.

## Addition to §11 (24 Sep 2026) — lessons from ETM-6395

**Test ↔ Story link — mandatory check.** Link with `createIssueLink(inwardIssue: <Test>, outwardIssue: <Story>, type: "Test")`. Right after linking, run JQL `issue in linkedIssues("<STORY>","is tested by")` and confirm the count equals the number of Tests created. If it is 0 or short, Test Coverage on the Story shows UNCOVERED — fix before reporting done. Wrong-direction links show up under `linkedIssues("<STORY>","tests")`.

**Removing wrong links.** The Rovo Jira tools cannot delete an issue link. Workaround that worked: open any `https://pttep.atlassian.net/rest/...` page in Claude in Chrome and run `fetch("/rest/api/3/issueLink/<id>", {method:"DELETE", headers:{"X-Atlassian-Token":"no-check"}})` via the JavaScript tool (read link ids from `/rest/api/3/issue/<KEY>?fields=issuelinks`). Deleting is permanent — get the user's go-ahead first.

**Figma file key.** The ETM Mob/Demob Plan file key is `hpClrd0OTljCF8w5pCI4ep` — capital **I** before `4ep`, not lowercase l. The wrong key gives "file not found" in both Figma MCP and Chrome. Figma MCP View seat still hits its cap after ~2 calls; Chrome screenshots of Figma often time out (page too heavy) — ask the user for screenshots instead of retrying.

**Modal wording source.** When the Story says the modal text is in `Manpower Mob Plan Validation&Result.xlsx`, look in sheet **Confirmation&Result** and scroll past the first screen — the POB Chart rows (Add / Edit / Delete Data (Chart), Export Chart) start around row 20. Excel Online sheet tabs do not respond to Chrome automation clicks — ask the user to switch tabs and screenshot.

**AC 0 "User Review Updates".** Newer Stories can gain an AC 0 block after refinement that overrides older AC (ETM-6395: "dismissal by explicit button only" overrode "click outside dismisses"). Always re-read the Story right before writing the final TC file and follow AC 0 where they conflict.

**Test Execution creation.** `createTestExecution(testIssueIds:[...], testEnvironments:["QA"], jira:{fields:{summary, project:{key:"ETM"}, assignee:{accountId}}})` works in one call and loads the Tests at the same time; then `addTestExecutionsToTestPlan`.

## Addition (25 Sep 2026) — session log: ETM-6378 execution begins, ETM-6555 lesson

**ETM-6378 execution started.** Story reached status "In Testing"; user confirmed "ready to test" per the gate in §12. Test Execution ETM-6565 (19 Tests) picked up. Precondition data ("Sample Plan A", "Sample Plan E", etc named in the TCs) does not exist as such on QA — the real environment only has "Manpower Mob Plan - NN" under Shutdown Event "NN TEST QA" (§8's existing test data). Ran ETM-6555 against that plan instead, adding/removing a throwaway Data Group ("Group Echo") as needed rather than waiting for named sample plans to be created.

**ETM-6555 finding — not a defect, a TC authoring error.** Step 3 ("uncheck the only checked Data Group") was written expecting the chart to show "No data available." again, same as the zero-Data-Group case. Actual behaviour: unchecking shows a blank axis (0–100) with **no** "No data available." text — reproduced 3 times, including after a full page reload to rule out an unsaved-state artifact. This looked like a defect until the user supplied the Figma "Empty State" frame, which shows exactly this blank-axis-no-text state for the all-unchecked case. **Lesson: the two empty conditions (zero Data Groups vs. all unchecked) are deliberately different visual states in Figma, not the same "No data available." message.** Corrected the TC's step 3 expected result in Xray (`updateTestStep`) to match Figma, marked the step PASSED, and this should also be corrected in the `.xlsx`/`.csv` deliverable (not yet done as of this session) and in the Known Gap Log if one covers this area.

**Process lesson — check this doc's existing tool notes before improvising a workaround.** When it came time to attach evidence, this doc's own §4 (at the time) still said evidence attach was blocked and had to go up by hand. Rather than checking whether that specific blocker still applied to the tool actually available (`xray_import_results`, a **device-side** tool, never subject to the **code-execution** allowlist that §4 was describing), evidence was initially handled by saving screenshots locally and asking the user to attach them by hand — the pre-fix workaround. The user pointed out this doc/skill should have been consulted properly first. It turned out the user had also just enabled the allowlist domains for good measure, and `xray_import_results` worked immediately. §4 is now corrected — see there for the confirmed working flow. General rule: before treating an old "blocked" note as still true, check which specific tool/environment it was about, since a newer tool may not share the same limitation.


## Addition (25 Sep 2026) - decision: step-level Xray evidence

Confirmed via GraphQL that xray_import_results' evidenceDir attaches evidence at the TEST RUN level only (getTestRunById.evidence), not per individual step (steps[].evidence stays empty). Attaching evidence per-step requires the addEvidenceToTestRunStep GraphQL mutation, which needs the file content inlined as base64 in the tool call - for a ~37KB screenshot that is ~49,600 base64 characters dumped straight into the chat context. This conflicts hard with the token-lean rule.

Decision (user, 25 Sep 2026): use test-run-level evidence only, going forward, for all tests in this project. Do not attempt per-step base64 evidence attachment via chat. If a token-lean device-side path (a script authenticating to Xray directly from device_bash, never passing base64 through the conversation) becomes available/verified later, it can be reconsidered - but do not default to inlining base64 in chat again.

---

## Correction (20 Oct 2026) — no .xlsx / .csv test case files any more

Per the user: from now on **do not create `.xlsx` or `.csv` test case files**. This replaces every earlier mention of the `.xlsx`/`.csv` export in §3 (stage 5), §6 (file naming and export rule) and §11 (step 6 reminder, the Decision paragraph, and the "user reviews the detailed TC content" addition).

New flow for step 6 / 7:
1. Draft the full step-by-step TC content and show it to the user for review (a `.md` review file or the chat — never a spreadsheet).
2. After the user confirms, apply `create-test-case`'s wording and column rules to that confirmed content — but produce no file.
3. Run `review-test-case` on the draft text (verdict + per-case summary).
4. After the user's explicit go-ahead, push the Tests straight to Xray with GraphQL `createTest` (§11 Decision paragraph still holds for this part).

The `etm-nn-fullqa` skill carries the same rule.

**Correction (16 Nov 2026) — defect `[QA]` sub-task gets no Original Estimate.** Lines above about estimates on the defect's `[QA]` sub-task are superseded by `log-defect-jira-etm` Step 8: no Original Estimate, only a Remaining estimate of 15m set through the worklog, and verify `originalEstimate` is empty afterwards. (The Story's two `[QA]` subtasks in §11 still get Original Estimates.)

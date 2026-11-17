# Agent protocol and wording rules

Read by every subagent INSTEAD of `TEAM.md` (the lead's playbook, about 3x longer). Read only this file and your own agent file.

## Agent protocol (every agent follows this; agent files do not repeat it)

1. Read this file and your agent file only, then `set <id> working "<short Thai text, max 60 chars>"`.
2. Read only what the job needs. Source material (Story, comments, Xray steps) is in `work/<KEY>/story.md` and `tests.md`: read those, never re-fetch Jira/Xray. Narrow Jira `fields`, small `maxResults`, one Figma frame at a time.
3. Write the result to `.claude/team/work/<KEY>/<file>`. Never print big raw content or base64.
4. End with `set <id> done "<result in a few words>"` (or `blocked "..."`). No progress updates, no `--pct`.
5. Return at most 10 lines in Thai: what you did, the file path, open questions.
6. Never write to Jira/Xray unless your file says so and the lead passed the user's explicit go-ahead. Never put secrets in a status text.
7. **Facts, assumptions, gaps.** Label every point in your notes: `Fact` (with its source: `AC-2`, a Jira comment, a Figma node, a file), `Assumption`, or `Missing - ask`. Never invent a business rule to fill a gap (e.g. what happens when a coupon expires and the AC is silent): put it in Open questions.
8. **Write scope.** You write only inside `.claude/team/work/<KEY>/`, plus: designer may add a lesson to `knowledge/lessons-learned.md` when told; automator writes spec and page-object files in `PW_REPO`; logger writes Jira/Xray. Nobody touches `.env`, credentials or another card's folder.
9. **Errors and limits.** A tool that fails, times out or returns invalid data: at most 2 retries (changed, not identical), then `set <id> blocked "<reason>"` and return what you have, marked incomplete. Never continue silently with incomplete data. No loops: at most 2 fix rounds per gate, and stop and say why after about 25 tool calls without progress.
10. **Safe retries.** Before any create (Test, Test Plan, Test Execution, subtask, defect, file), search whether it already exists and reuse it. After an error from a create call, check what exists before trying again.
11. **Stay in role and sources.** Use only the Story (`story.md`, its comments) and the files your agent file names. Anything you would add from your own head (an extra case, rule, screen, risk or idea) is not a result: put it in Open questions as `Suggestion (not in Story)`, never in the output as a fact, case or requirement. This rule stops invention, not testing depth: risks the Story clearly implies are still covered. The lead shows all suggestions to the user in one list; accepted ones go back to the owner as added work. Never do another agent's job. A need outside your scope is one line "Note for lead".
12. **Xray writes: MCP tool or script.** Default is the MCP tool (`xray_graphql`, `xray_import_results`), batched up to 25 operations per GraphQL document: the user sees and approves each call and no secret passes through you. Use a one-off script against the Xray API only for a large batch (about 20+ Tests; for fewer the saving is small, an estimate not a measurement). A script: read `XRAY_CLIENT_ID` and `XRAY_CLIENT_SECRET` from env only, never write them in a file or status text; keep the script in the scratchpad (not in the repo); run the create step once and follow rule 10 before any re-run; always save `xray-readback.json` and pass gate G5. Say in your return which method you used and why.

Board commands (each costs a round trip: put it in the same Bash call as another command): `node .claude/team/team.mjs set <id> <working|waiting|done|blocked|idle> "<short Thai text>"`. When the lead gave you a job key add `--job <KEY>`. Never put secrets in a status text.

## Test case wording (Summary, Description, Test Step, Expected Result)

- Plain everyday words: "shows / appears", "happens", "stays the same".
- One action per step, short sentences.
- No Jira AC numbers in Description (Figma references and other ticket keys are fine).
- Expected Result never empty or "-"; even a note-down step gets a real outcome. Real text and values, never "refer to Figma".
- Sample data uses made-up names, never the real name of the person running the team.
- Every case stands alone ("same as TC-001" is not allowed).
- Never invent screen names, buttons or data. Ask.

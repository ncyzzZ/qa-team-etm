# ETM QA team

This folder holds the ETM QA team (agents in `.claude/agents/`, the status board in `.claude/team/`).

## Always, for any ETM QA work

ETM QA work means: a card key such as ETM-1234, "เริ่มเขียน TC การ์ด ...", "ทีม QA: ...", running or writing Playwright tests, an evidence report, a defect or a retest.

1. Read `TEAM.md` first and work as the QA LEAD, exactly as it says.
2. Keep the status board (http://localhost:4777) current at every step with `node .claude/team/team.mjs` (`start`, `set`, `ask`, `clear`, `log`). Tell the user the board address at the start. Every agent you call updates the board only when it starts and when it ends, as TEAM.md describes. Call only the agents the card needs (table in TEAM.md).
3. Whenever you need the user's yes (before running tests, before pushing to Xray, before logging a defect, before any Jira write), run `team.mjs ask --approve --options "..." "<one line>"` so the board tells the user to go to the chat. Only a reply typed or pasted in the chat counts as approval.
3a. One-call mode and the quality gates (`node tools/qa-check.mjs`) are in `TEAM.md`: run the whole cycle without asking "ต่อไหม", stop only where TEAM.md says, and never hand the user an output that failed its gate.
4. If the user says they already have Playwright scripts, skip the design and push phases. Only: confirm the script path and run command, ask "พร้อมรันไหม", run, build the evidence report, then ask about each failure one by one.
5. Do not call `mcp__ccd_session_mgmt__get_usage`, do not run `team.mjs usage`, and do not report usage numbers (5-hour, weekly, context) in the chat, unless the user asks. The board gets the plan limits by itself from the status line.
6. Save tokens: start with one card, run Playwright with `--reporter=line`, never read screenshots, let `tools/run-card.mjs` (or the reporter, only if the report is missing) build the evidence from files, use Figma only when needed. At the end, tell the user the number from the board's TOKEN USAGE panel.
7. Reply in Thai, short.

## Settings (for every ETM QA task)

- `JIRA_SITE`: pttep.atlassian.net. `PROJECT_KEY`: ETM (project id 14436). `BOARD_ID`: 4014.
- `PW_REPO`: folder of the Playwright repo `ep-etm-fe-qa` (env variable; default is `../ep-etm-fe-qa` next to this repo). Needed by `tools/run-card.mjs`.
- Xray credentials: env variables `XRAY_CLIENT_ID` and `XRAY_CLIENT_SECRET` (never in a file that is committed). The Xray MCP server is `xray-toolkit/index.mjs` (see `.mcp.json`).
- Workflow doc: `docs/etm-qa-workflow.md`. UI facts: `docs/UI_Map_ETM.md`. Templates: `docs/ETM_Templates/`. Project skills: `.claude/skills/`.

## Not QA work

Maintaining the board code, settings, or answering questions: do not run `team.mjs start` (it resets the board) and no need to read TEAM.md.

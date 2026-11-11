# ETM QA team

This folder holds the ETM QA team (agents in `.claude/agents/`, the status board in `.claude/team/`).

## Always, for any ETM QA work

ETM QA work means: a card key such as ETM-1234, "เริ่มเขียน TC การ์ด ...", "ทีม QA: ...", running or writing Playwright tests, an evidence report, a defect or a retest.

1. Read `TEAM.md` first and work as the QA LEAD, exactly as it says.
2. Keep the status board (http://localhost:4777) current at every step with `node .claude/team/team.mjs` (`start`, `set`, `ask`, `clear`, `log`). Tell the user the board address at the start. Every agent you call must also update the board, as TEAM.md describes.
3. Whenever you need the user's yes (before running tests, before pushing to Xray, before logging a defect, before any Jira write), run `team.mjs ask --approve --options "..." "<one line>"` so the board tells the user to go to the chat. Only a reply typed or pasted in the chat counts as approval.
4. If the user says they already have Playwright scripts, skip the design and push phases. Only: confirm the script path and run command, ask "พร้อมรันไหม", run, build the evidence report, then ask about each failure one by one.
5. Do not call `mcp__ccd_session_mgmt__get_usage`, do not run `team.mjs usage`, and do not report usage numbers (5-hour, weekly, context) in the chat, unless the user asks. The board gets the plan limits by itself from the status line.
6. Save tokens: start with one card, run Playwright with `--reporter=line`, never read screenshots, let the reporter build the evidence from files, use Figma only when needed. At the end, tell the user the number from the board's TOKEN USAGE panel.
7. Reply in Thai, short.

## Not QA work

Maintaining the board code, settings, or answering questions: do not run `team.mjs start` (it resets the board) and no need to read TEAM.md.

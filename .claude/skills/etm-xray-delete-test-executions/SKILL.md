---
name: etm-xray-delete-test-executions
description: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Bulk-delete Jira/Xray cards of the active profile's project. Test Executions from a JQL/key list, or the Tests in an Xray Test Repository folder (e.g. Manual Test/Bin). Use for ลบ test execution / ลบการ์ด / ลบ Bin requests.
---

# Bulk delete Xray cards (API first)

Jira site, project key (`<KEY>` below) and project id: the active profile (`node tools/profile.mjs show`). **Deletion is permanent.** It is outside the normal QA cycle: only when the user asks for it, and always through the safety gate in section 3 (a yes in the chat, never pre-approved by a card trigger).

Tools used:
- **Atlassian Rovo MCP**: read/verify (`searchJiraIssuesUsingJql`). It has no delete tool.
- **Jira REST API** (email + API token): `DELETE /rest/api/3/issue/{key}`.
- **Xray Cloud GraphQL** (Client ID + Client Secret): list the issues in a Test Repository folder.
- Browser (Claude in Chrome) only as the fallback if the API path fails.

## What each mode deletes (the team's rule)

- **Mode 1 (JQL / keys)**: deletes **Test Execution** only.
- **Mode 2 (Xray folder, e.g. Bin)**: deletes the **Test** cards in that folder (folder items are Tests; deleting them is intended).
- Any other type (Story, Defect, Bug, Test Plan, Sub-task...) is never deleted: report it as excluded.

## 0. Credentials (never in chat, never printed)

Set these as environment variables on the user's machine (the same `XRAY_CLIENT_ID` / `XRAY_CLIENT_SECRET` as in the README), or load them from a local file that is NOT in git (e.g. `.secrets/<project>-api.env`; the active project rules name it):
```
JIRA_EMAIL=<your Jira login email>   <- the Jira login email (another address gives 401)
JIRA_API_TOKEN=...
XRAY_CLIENT_ID=...
XRAY_CLIENT_SECRET=...
```
1. If a variable is missing, stop and tell the user which one to set. Never ask them to paste secrets into the chat.
2. The helper is `etm_xray_del.py` in this skill's folder (needs Python 3; the command is `python3` on Mac, `python` on Windows). Run it from the repo root; if the secrets are in a file, load it without printing it (the file may have CRLF line ends, strip `\r`):
   `set -a; . <(tr -d '\r' < path/to/<project>-api.env); set +a; python .claude/skills/etm-xray-delete-test-executions/etm_xray_del.py <cmd> ...`
   Never `cat` or echo the file.
3. First run `whoami`: it must print `Jira OK` and `Xray OK`. Jira 401: check JIRA_EMAIL is the Jira login email (Rovo `atlassianUserInfo` shows it) and the token is not expired; tell the user which line to fix.

## 1. Pick the mode

- **Mode 1 - JQL / keys**: the message has a JQL (e.g. `key in (<KEY>-7075, ...)`) or a list of `<KEY>` keys: normalise to `key in (...)`.
- **Mode 2 - Xray folder**: the message mentions Bin / Test Repository / a folder, or pastes a test-repository URL. Default folder path = `/Manual Test/Bin` (URL: `https://<Jira site>/projects/<KEY>?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.xpandit.plugins.xray__testing-board#!page=test-repository&selectedFolder=<Bin folder id>`; the Bin folder id is in the active profile's Settings).

## 2. Mode 2 - collect keys from the folder

1. `folder "/Manual Test/Bin"` prints `TOTAL n` and the key list (direct items only; no sub-folders unless the user asks).
2. If the path errors or a different URL/folder id was given, run `tree` to find the folder's path (match by name/id), then rerun `folder`.
3. Build `key in (<keys>)` and continue with section 3 using allowed type `Test`.
4. If GraphQL fails, fall back to Chrome: open the folder URL (Xray renders in an iframe), confirm the breadcrumb is the intended folder, read keys via get_page_text/read_page or screenshots, page until the count matches the folder's item count.

## 3. Verify, confirm, delete

1. **Verify** with `check "(<JQL>) AND project = <KEY>"` (or Rovo `searchJiraIssuesUsingJql`). Split into allowed type (Mode 1: Test Execution, Mode 2: Test) vs excluded (other types / not found).
2. **Safety gate**: show count + key - summary list and ask yes/no (`AskUserQuestion`). Inside a card cycle (a stray Test Execution of a card, not a request from the user to delete): do not ask on its own; queue it with `node tools/delete-plan.mjs add <KEY> "stray Test Execution" --where "Jira <KEY>" --ids <keys> --permanent` and it is asked with the card's other deletes (TEAM.md Standing approvals 6); delete only items `delete-plan.mjs ok` approves. Skip only if the user's request already says "ยืนยันลบ" / "confirm delete"; the type filter still applies.
3. **Delete** (batches of up to 100 keys per call):
   - Mode 1: `delete KEY1 KEY2 ...` (default = Test Execution only)
   - Mode 2: `delete --types "Test" KEY1 KEY2 ...`
   The helper re-checks each issue's type, deletes with `deleteSubtasks=true`, and prints DELETED / SKIP / FAILED.
4. **Re-check**: rerun `check` on the original key list: expect 0 of the allowed type left. Mode 2: rerun `folder`, expect `TOTAL 0`.
5. DELETE 403: the account lacks "Delete work items" permission; report, do not retry.
6. Browser fallback (API unavailable): `https://<Jira site>/jira/software/c/projects/<KEY>/list?jql=<encoded JQL>`, select-all checkbox, bulk action Delete, confirm; or `/issues/?jql=<encoded JQL>`, then ... > Bulk change all > select all > Delete > untick send mail > Next > Confirm, wait for 100%.

## 4. Report (short, Thai)

Deleted N (keys), excluded keys + reason, failures. No time logging or sub-tasks for this housekeeping unless asked.

## Stop and ask when

- The JQL/folder matches 0 items, or counts disagree between sources.
- The folder cannot be read fully, or is not the expected one.
- Credentials fail or delete permission is missing.

---
name: resolve-tested-by
description: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Use when the user gives a Jira Story/issue key and asks to change the status of its "is tested by" linked Test issues, e.g. "resolve test cases for <KEY>-1234", "เปลี่ยน status is tested by ในการ์ด", "ปิด test case ทั้งหมดของ story นี้", "close out the linked tests for this ticket". Assigns every linked Test issue to the current user, transitions to Resolved (Resolution = Done), then to Closed, and verifies with JQL. Needs the Atlassian Rovo (Jira) MCP connector.
---

# Resolve "is tested by" linked Test issues

**Gate (TEAM.md Phase 8):** in this repo this skill runs only when the user asked for it (closeout) or said `ปิดงานได้เลย` in the trigger message. A bare Story key is NOT a trigger for it here: a bare `<KEY>-nnnn` starts the QA cycle (`etm-nn-fullqa`). Show the summary table in step 3 and wait for the user's yes unless they pre-approved the whole batch ("ทำแบบเดิมได้เลย", "ทุกตัวเลย", `ปิดงานได้เลย`).

## Purpose

Given a Jira Story (or any issue) key, find every issue linked to it via the **"is tested by"** relationship (Jira link type "Test", inward = "is tested by", outward = "tests"; almost always Xray Test issues), then bulk-update each one to this final state:

- **Assignee**: the current authenticated user (unless the user names someone else)
- **Resolution**: **Done** (unless the user specifies a different resolution)
- **Status**: **Closed** (standing default since 2026-08-19; apply without asking each time)

Getting to Closed is a **two-step transition**: first "Resolve Issue" (status Resolved, Resolution = Done), then "Close Issue" (status Closed). Do not skip the Resolved step; the workflow requires passing through it.

Works for any Jira Cloud project reachable through the connected Atlassian Rovo MCP server (first used on EAPM-6459..6462 in EP-APM, on the same Jira site as the active profile).

## Prerequisites

- Atlassian Rovo MCP tools: `getJiraIssue`, `getTransitionsForJiraIssue`, `editJiraIssue`, `transitionJiraIssue`, `searchJiraIssuesUsingJql`, `getVisibleJiraProjects`, `atlassianUserInfo`, `getAccessibleAtlassianResources` (load them via ToolSearch if deferred).
- If the cloudId is not known in this session, call `getAccessibleAtlassianResources` once and reuse it.

## Steps

1. **Resolve the current user** (once per session): `atlassianUserInfo` gives `account_id`, the assignee unless the user names someone else.
2. **Fetch the source issue** with `getJiraIssue`, fields `["summary","status","issuelinks","project"]`. From `fields.issuelinks` collect every link where `type.name == "Test"` (the linked key is in `inwardIssue.key`). If the list is empty, tell the user no "is tested by" links were found and stop.
3. **Show the user a summary table** before changing anything: key, summary, current status. The target (Closed, resolution Done, assignee current user) is a standing preference, so do not ask about the target itself.
4. **Check the transition path once** on the first linked issue with `getTransitionsForJiraIssue`: the transition whose `to.name` is "Resolved", and (from Resolved) the one whose `to.name` is "Closed". Different issue types / workflows can have different ids, so do this per distinct issue type. Observed for Xray Test issues in EP-APM: id `"5"` = Resolve Issue, id `"701"` = Close Issue (NOT id "2", which failed). Use these only as a starting guess; re-verify for any other project/issue type, including the active profile's project.
5. **For every linked issue**, in this order:
   - `editJiraIssue` with `fields: { assignee: { accountId: "<id>" } }`
   - `transitionJiraIssue` with `transition: { id: "<Resolve id>" }` and `fields: { resolution: { name: "Done" } }` (or the requested resolution)
   - `transitionJiraIssue` with `transition: { id: "<Close id>" }`
   Batch independent calls together where the tool allows it.
6. **Verify** with one JQL search across all touched keys: `key in (KEY1,KEY2,...) AND status = Closed AND resolution = Done AND assignee = currentUser()` with `searchResultMode: "count"`; the count must equal the number found in step 2. The search index can lag after a bulk transition (under-report by 1-2): re-run the same query once before assuming a failure.
7. **Report**: how many found, how many transitioned, before/after status, and the verification JQL link. Do not touch the original Story's status or assignee unless asked (the Story move to "Ready for UAT" belongs to `etm-nn-fullqa` section 10).

## Notes / edge cases

- "is tested by" is a Jira **issue link type**, not a status.
- Some linked issues may already be Resolved/Closed or lack the transition: skip them gracefully and list them in the report instead of failing the batch.
- If the user asks for a different terminal status, use the equivalent transition/resolution; the assignee-then-transition order stays.
- Always confirm bulk changes first unless the user pre-approved the whole batch (see the gate at the top).

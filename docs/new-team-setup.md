# New team setup

For the QA lead of a team that received this starter. About 30 minutes.

## What the team is

- **Agents** (`.claude/agents/`): analyst, UX inspector, test designer, reviewer, automation engineer,
  manual runner, evidence reporter, evidence checker, Jira/Xray logger, Playwright healers.
  Claude Code acts as the QA lead and calls them per card, as `TEAM.md` describes.
- **Board** (`.claude/team/`): a local status page at http://localhost:4777. It shows each card's step,
  and asks your yes/no questions with buttons. Start it with `node .claude/team/team.mjs start <KEY>-1`.
- **Gates** (`node tools/qa-check.mjs`): every output (draft cases, specs, evidence, defects) must pass
  its gate before it reaches you. `tools/` also holds the run wrapper, self-healing and Xray helpers.
- **Rules**: `CLAUDE.md` and `TEAM.md` are the shared process. Your project's own facts live in
  `profiles/<name>/` and reach Claude at session start (SessionStart hook, `.claude/active-profile.md`).

## 1. Make your profile

```sh
cd /path/to/qa-team-starter      # always run inside the starter folder
git init && git add -A && git commit -m "starter"
node tools/setup.mjs --new-profile <name> --key <KEY> --site <you>.atlassian.net \
  --project-id <id> --board <id> --pw-repo-dir <playwright-repo-folder> --fe-repo-dir <fe-repo-folder>
node tools/setup.mjs            # checks the whole setup; fix what it reports
```

This writes `profiles/<name>/profile.json` from `profiles/_template/` and selects it in `.env`.
Then fill in by hand in `profile.json`: `jira.fields` (custom field ids for environment, epic, sprint),
`roles` (the login roles your Playwright repo has seeds for, and the default one),
`ui.libraryTokenRe` (class prefixes of your UI library, for self-healing), `ui.noTestIds` (warn on
`data-testid` when your app has none), `heal.serialTags` (test tags on shared data that must not retry),
`regress.featureDir` and `regress-map.json` (FE folder -> spec folders for `tools/regress.mjs`),
`board.title`. `profiles/example/` is only a placeholder; delete it once your profile works.

## 2. Write rules.md

`profiles/<name>/rules.md` holds what is true only for your project: roles and what each may do on QA,
shared data no card may touch, pages that need a first step (close a panel, pick a day), Jira quirks,
folder ids. Keep it short; every session reads it. Project-only lessons and script notes go in
`profiles/<name>/knowledge/` and are listed under a "Knowledge" heading in `rules.md`.

## 3. UI map and templates

Optional but worth it: a UI map (index of verified page facts, one file per module under `docs/modules/`)
and test case templates. Point to them with `docs.uiMap` and `docs.templates` in `profile.json`.

## 4. .env and secrets

Copy `.env.example` to `.env` (git-ignored, never commit it): `QA_PROFILE`, `PW_REPO`, `FE_REPO`,
`XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET` (Xray Cloud API key, used by `xray-toolkit/index.mjs`, see
`.mcp.json`), optional `FIGMA_TOKEN`. Connect Jira through the Atlassian connector in Claude.

## 5. Decide your own approvals

`TEAM.md` "Standing approvals" and `tools/run-policy.mjs` hold one team's choices: which test runs
start without asking, when results go to Xray, how failures are decided, what heals apply by themselves.
They are yours to decide with your team. Read them, change what does not fit, and write down who agreed
and when. Logging defects, deletes and Jira writes should keep asking.

## 6. Check it

```sh
node --test tools/profile-rules.test.mjs tools/export-starter.test.mjs
node tools/profile-lint.mjs     # no project values hard-coded in tools/
node tools/profile.mjs show     # your settings as Claude sees them
```

Open Claude Code in this folder and give it one card key of yours. Watch the board.

## Keeping up to date

The starter has no history. When you get a newer starter, copy it over a branch of your repo, keep your
`profiles/<name>/`, `.env` and `work/`, and review the diff before you merge. Put your own process
changes in `CLAUDE.md`, `TEAM.md` or a skill and commit them, so your whole team gets them on `git pull`.

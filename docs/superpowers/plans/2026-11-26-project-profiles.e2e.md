# Project profiles: end-to-end notes (2026-11-26)

New-team proof (starter exported with `tools/export-starter.mjs --people <file>`):

- Export: leak scan reports no hits. 199 files copied. The renamed defect skill is `qa-log-defect`.
- `git init` then `setup.mjs --new-profile acme ...` writes `profiles/acme/` and sets `QA_PROFILE=acme`. The setup check then reports only the missing Playwright repo (FIX) and the missing FE repo (info).
- Tests in the starter: 7 test files, 55 pass, 0 fail. The other test files name the project and are left out of the export on purpose.
- `TEAM_PORT=4799 team.mjs start ACME-1` starts the board (`serve.mjs`, `server.pid`); the card shows on the board. `state.mjs init ACME-1` then `qa-check.mjs state ACME-1` gives 0 errors (1 warning: no numbered AC yet). Stop the board with `kill $(cat .claude/team/server.pid)`; nothing listens on 4799 after.
- `team.mjs` has no stop command. A new team stops the board by killing the pid in `server.pid`.

Original repo (profile `etm`): 49 test files, 515 pass, 0 fail (team-board test excluded); `profile-lint` ok; `setup.mjs` shows the two expected FIX lines when the Playwright repo is absent (a worktree).

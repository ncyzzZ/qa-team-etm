# ETM script notes (project-only part of `.claude/team/knowledge/playwright-script-rules.md`)

Read with the shared script rules `.claude/team/knowledge/playwright-script-rules.md` before writing or changing any ETM spec (Playwright repo: `repos.pwRepoDir` of `profiles/etm/profile.json`).

- **Spec layout example**: `tests/fe/e2e/shutdownLogic/verifyShutdownLogicDateInput.spec.ts`, security checks in `verifyShutdownLogicDateInput.security.spec.ts`. Role fixtures: `turnaroundManagerPages` / `jobOwnerPages` (TM and JO, the only two roles on QA).
- **Locators**: the app has no `data-testid` (except a few such as `sl-splitter-horizontal`). Use `data-id`, `data-column`, roles and text.
- **Bryntum rows**: bring rows into view with `showRow` before reading, else `innerText` waits until timeout (seen on ETM-7053).
- **Hand-made rather than scripted**: the Filter Panel date range picker kept timing out (ETM-7044); offer manual testing after at most two fixes.
- **Known STMS/Bryntum quirks**: `page.goto` with `waitUntil: 'domcontentloaded'` (full load is slow on VPN); expand collapsed column groups (e.g. `Scheduled`) before reading date cells; Save opens a confirm dialog before the toast; if the header intercepts a breadcrumb click, click the inner `<button>` via `evaluate`; the grid is virtualized, use `window.bryntum.query('gantt')` to scroll to or read tasks; `ERR_NAME_NOT_RESOLVED` / `ERR_NETWORK_CHANGED` mean VPN is off or dropped.

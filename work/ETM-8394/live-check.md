# ETM-8394 live check (Import Work, Worklist search, Manpower Mob Plan after a Work delete)

Facts for the steps of tests/fe/e2e/importWork/verifyMobPlanAfterWorkDelete.spec.ts (ETM-8394-MOB). Read only; nothing saved while checking.

| Test | Action | Fact | Source | Module |
|---|---|---|---|---|
| ETM-8394 | filter | Worklist search box "Search work number and job description" + Enter narrows the table to Works whose number or description holds the text; `Total Results` follows | docs/modules/core-navigation-worklist.md | core-navigation-worklist.md |
| ETM-8394 | delete | Import Work with Action Delete on a Work (and Delete on its breakdown rows) is a soft delete: shutdown_work.sdw_is_delete = 'Y', sdw_status kept, the Work stays in the Worklist grid with Status D; breakdown rows stay in shutdown_activity_breakdown (seen in the ETM-8394 runs, dev answer ETM-10051) | live 2026-11-24 | core-navigation-worklist.md |

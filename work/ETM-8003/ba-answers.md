# ETM-8003 BA answers (copied from .claude/team/work/ETM-8003/story.md, 2026-11-24)

Round 1: work/ETM-8003 (BA file 2026-11-19_ETM-8003_qa-questions.md). Round 2: DEC-077 (2026-11-23), not yet recorded in Jira.

rmission: cannot open page (existing behavior, BR-CMN-015). No S-Curve case needed.
- Earlier days: `<` `>` buttons next to the execution date; every date, frozen or not, shows new colors.

## UPDATE 2026-11-23 (BA round 2, DEC-077; overrides round 1 on the Filter Panel)
- `Show Only Today` / `Show All` control the DATA LABELS only, not the line. The full S-Curve line always stays drawn. Show All = percentage labels on every point; Show Only Today = label only on the point of the current active execution date (other labels hidden). Seeing the line unchanged when toggling is EXPECTED. ETM-4127 AC 6 wording "reduces the line to one point" was wrong.
- Default on page load AND after Reset: Scale Day, Show Plan(%) Show Only Today, Show Actual(%) Show Only Today (not Show All). Full lines drawn, only the active date's labels shown. To check label colors on several points, switch to Show All.
- Test data: the Figma numbers (Plan 0%, 0%, 39.21%, 77.44%, 100%, 100%; Actual 0%, 0%, 42.66%) are mockup samples, not STMS values. Check COLORS only. Label values = Total Plan (%) / Total Actual (%) of the Progress Summary of the plan under test; Progress Summary shows whole numbers (ETM-4126 AC 6.1). Label colors: Plan #1D39C4, Actual #D46B08.
- View Active Daily Report Item: a plan with no S-Curve data shows the card header with no chart (expected, no empty state). QA must find an Active Plan with an Active Daily Report item that has S-Curve data (ETM-5266 AC 1-2, Role & Permission R35-R36). In ETM the user with this permission is the Job Owner (memory: JO sees Active plans only).

## Round 3 (25 Nov 2026, user answered in chat as BA)
- Q2 (Ramp Down marker in the PDF Gantt): yes, it comes from another Story, not ETM-8003. ETM-8805 step 9 = pass.
- Q1 (S-Curve filter disabled for the Job Owner): withdrawn, QA mistake. The filter is enabled for the Job Owner (user screenshot and recheck 25 Nov).

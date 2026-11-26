#!/usr/bin/env node
// regress.mjs - which Playwright specs to re-run for what dev merged into stms-fe (read only: no test run, no Jira, no stms-fe edit).
//   node tools/regress.mjs                         since the last regression (output/regression/last.json in PW_REPO)
//   node tools/regress.mjs --since-days 7          or --since <commit>; --to <ref> (default origin/develop); --card ETM-1234; --no-update; --no-high (skip the @high base, also skipped with --card)
//   node tools/regress.mjs mark [<commit>]         after a regression run is done: record where it ended
// Report: work/REGRESSION/<date>_<since7>..<to7>.md (+ .json). Design: docs/superpowers/specs/2026-11-20-fe-diff-regression-design.md
import { ROOT, resolveRepos } from './heal/config.mjs';
import { git, updateFe } from './heal/fe-git.mjs';
import { merges, importers, commitBefore } from './regress/git.mjs';
import { specIndex } from './regress/specs.mjs';
import { main } from './regress/report.mjs';

const { pwRepo, feRepo } = resolveRepos();
const code = await main(process.argv.slice(2), {
  feRepo, pwRepo, teamRoot: ROOT, log: console.log,
  update: updateFe,
  resolve: (fe, ref) => git(fe, ['rev-parse', '--verify', '-q', ref]),
  commitBefore: (fe, ref, date) => commitBefore(fe, ref, date),
  gitDate: (fe, c) => { try { return git(fe, ['log', '-1', '--format=%cI', c]); } catch { return null; } },
  merges: (fe, since, to) => merges(fe, since, to),
  specIndex,
  importers: (fe, p, to) => importers(fe, p, to),
});
process.exit(code);

#!/usr/bin/env node
// build-change.mjs - "it passed before, then dev merged something": put that fact next to each failure in the verdict table.
// Why: on one card 5 tests broke at the same step after one FE merge; the table said "script, heal first" for all 5 and
// the lead found the build change by hand. Read only: reads run folders in PW_REPO and git history of the FE repo (fe-git allow-list).
//
//   node tools/build-change.mjs <KEY> [<run folder>]     print what changed since each failing test last passed
//
// tools/verdicts.mjs table calls annotate() and buildSuggest() itself; this CLI is for a quick look.
import { isKey, profile } from './profile.mjs';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rowsFromResults } from './run-results.mjs';

const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

/** Start and end (ISO) of a run folder, from its results.json. */
export function runTimes(runDir) {
  const s = readJson(path.join(runDir, 'results.json'), null)?.stats;
  if (!s?.startTime) return null;
  const start = new Date(s.startTime);
  return { start: start.toISOString(), end: new Date(start.getTime() + (s.duration || 0)).toISOString() };
}

const sameError = (a, b) => (a || '').slice(0, 60) === (b || '').slice(0, 60);
/**
 * Newest earlier run of the card where the test behaved differently: it passed (or was flaky), or it failed with another
 * error (it got past the step that breaks now, or broke elsewhere). { run, end, how: 'passed'|'failed differently', msg } or null.
 * `nowError` is the first line of the current failure; without it only passes count.
 */
export function lastPassBefore(runsDir, card, testKey, failRun, nowError = '') {
  const runs = (fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : []).filter((d) => d.endsWith(`_${card}`) && d < failRun).sort().reverse();
  for (const run of runs) {
    const r = readJson(path.join(runsDir, run, 'results.json'), null);
    if (!r) continue;
    const row = rowsFromResults(r, () => '').find((x) => x.title.startsWith(testKey + ' ') || x.title === testKey);
    if (!row) continue;
    const end = runTimes(path.join(runsDir, run))?.end ?? null;
    if (row.status === 'passed' || row.status === 'flaky') return { run, end, how: 'passed' };
    if (nowError && (row.status === 'failed' || row.status === 'timedOut') && !sameError(row.msg, nowError)) return { run, end, how: 'failed differently', msg: row.msg };
  }
  return null;
}

/**
 * Adds `since` to each triage row: { lastPass, merges: [{commit, branch, keys}] , note }.
 * @param rows triage rows [{key,...}]
 * @param o.lastPass (testKey, nowError) => {run,end,how}|null
 * @param o.feMerges (sinceIso, untilIso) => [{commit, branch, keys}]  (throws when the FE repo cannot be read)
 * @param o.failStart ISO start of the failing run
 * @param o.scriptChanged (spec file from triage, sinceIso) => true when the spec was edited after that time (commit or uncommitted)
 */
export function annotate(rows, { lastPass, feMerges, failStart, scriptChanged = () => false }) {
  const cache = new Map();
  return rows.map((r) => {
    const lp = lastPass(r.key, r.firstLine);
    const was = lp ? `${lp.how ?? 'passed'} in ${lp.run}` : '';
    if (!lp) return { ...r, since: { lastPass: null, merges: [], note: 'failed the same way in every earlier run' } };
    if (!lp.end || !failStart) return { ...r, since: { lastPass: lp, merges: [], note: was } };
    const k = lp.end;
    if (!cache.has(k)) { try { cache.set(k, { merges: feMerges(lp.end, failStart) }); } catch (e) { cache.set(k, { error: e.message.split('\n')[0].slice(0, 120) }); } }
    const c = cache.get(k);
    if (c.error) return { ...r, since: { lastPass: lp, merges: [], note: `${was}; ${profile().repos.feRepoDir} not read (${c.error})` } };
    const sc = !!lp.end && scriptChanged(r.file, lp.end);
    return { ...r, since: { lastPass: lp, merges: c.merges, scriptChanged: sc, note: `${was}; ${c.merges.length} ${profile().repos.feRepoDir} merge(s) since${sc ? '; the spec changed too' : ''}` } };
  });
}

const short = (m) => `${m.commit.slice(0, 8)} ${String(m.branch).slice(0, 60)}`;

/**
 * Overrides the cause-based suggestion with `app?` when the failure looks like a build change:
 * the test passed (or failed differently) before, the FE repo changed since, no ready heal, and either 2+ tests broke the same
 * way or a merge since names this card. When the spec itself changed since and no merge names the card, nothing is upgraded. Returns rows with suggest/why (and buildChange: true) updated.
 */
export function buildSuggest(rows, { card, readyHeals = new Set() } = {}) {
  const sig = (r) => `${r.cause}|${r.locator || (r.firstLine || '').slice(0, 60)}`;
  const groups = new Map();
  for (const r of rows) if (r.since?.lastPass && r.since.merges.length) groups.set(sig(r), [...(groups.get(sig(r)) || []), r.key]);
  return rows.map((r) => {
    const s = r.since;
    if (r.suggest === 'app' || !s?.lastPass || !s.merges.length || readyHeals.has(r.key) || ['env', 'flaky'].includes(r.cause)) return r; // a finding / defect naming the test wins
    const same = groups.get(sig(r)) || [];
    const named = s.merges.filter((m) => (m.keys || []).includes(card));
    s.named = named;
    if (same.length < 2 && !named.length) return r;
    if (s.scriptChanged && !named.length) return r; // our own script edit can explain it as well: keep the cause-based suggestion
    const lead = named[0] || s.merges.at(-1);
    const why = [
      `build change? ${s.lastPass.how ?? 'passed'} in ${s.lastPass.run.slice(0, 17)}, then ${profile().repos.feRepoDir} ${short(lead)}${named.length ? ` (names ${card})` : ''}`,
      same.length >= 2 ? `${same.length} tests broke the same way (${same.join(', ')})` : '',
      r.cause === 'locator' ? 'no ready heal' : '',
      'check that merge first, then 1 defect for the group',
    ].filter(Boolean).join('; ');
    return { ...r, suggest: 'app?', why, buildChange: true };
  });
}

/** Test keys with a `ready` row in the run's heal-proposals.json. */
export function readyHealsOf(runDir) {
  const j = readJson(path.join(runDir, 'heal-proposals.json'), {});
  return new Set((j.proposals || []).filter((p) => p.status === 'ready' || p.state === 'ready').map((p) => p.test));
}

/** Everything verdicts.mjs needs, wired to the real repos. Never throws: returns rows unchanged when it cannot read. */
export async function withBuildInfo(card, runDir, rows) {
  try {
    const { resolveRepos } = await import('./heal/config.mjs');
    const { git } = await import('./heal/fe-git.mjs');
    const { merges, commitBefore } = await import('./regress/git.mjs');
    const { feRepo, pwRepo } = resolveRepos();
    const { spawnSync } = await import('node:child_process');
    const pwGit = (args) => { const r = spawnSync('git', args, { cwd: pwRepo, encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : ''; };
    const scriptChanged = (file, since) => {
      if (!file) return false;
      const f = path.join('tests', file);
      return !!(pwGit(['log', `--since=${since}`, '--format=%h', '--', f]) || pwGit(['status', '--porcelain', '--', f]));
    };
    const runsDir = path.dirname(runDir);
    const failStart = runTimes(runDir)?.start;
    const haveFe = fs.existsSync(path.join(feRepo, '.git'));
    if (haveFe) { try { git(feRepo, ['fetch', '--quiet', 'origin']); } catch { /* offline: use what is there */ } }
    const ref = `origin/${profile().repos.feBranch}`;
    const feMerges = (since, until) => {
      if (!haveFe) throw new Error(`${profile().repos.feRepoDir} not found (FE_REPO)`);
      const a = commitBefore(feRepo, ref, since), b = commitBefore(feRepo, ref, until);
      if (!a || !b || a === b) return [];
      return merges(feRepo, a, b).map(({ commit, branch, keys }) => ({ commit, branch, keys }));
    };
    const ann = annotate(rows, { lastPass: (k, err) => lastPassBefore(runsDir, card, k, path.basename(runDir), err), feMerges, failStart, scriptChanged });
    return buildSuggest(ann, { card, readyHeals: readyHealsOf(runDir) });
  } catch (e) {
    return rows.map((r) => ({ ...r, since: { lastPass: null, merges: [], note: `build check skipped: ${e.message.slice(0, 80)}` } }));
  }
}

/** Text for the "Since last pass" column. */
export function sinceCell(r) {
  const s = r.since;
  if (!s) return '';
  const m = s.merges || [];
  const named = s.named || [];
  const list = [...named, ...m.filter((x) => !named.includes(x)).reverse()].slice(0, 3).map(short).join(', ');
  return (s.note + (m.length ? `: ${list}${m.length > 3 ? ` (+${m.length - 3})` : ''}` : '')).replace(/\|/g, '/');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [card, runArg] = process.argv.slice(2);
  if (!isKey(card ?? '')) { console.error('Usage: node tools/build-change.mjs <KEY> [<run folder>]'); process.exit(2); }
  const { resolveRepos } = await import('./heal/config.mjs');
  const runs = path.join(resolveRepos().pwRepo, 'output', 'runs');
  const dir = runArg || path.join(runs, (fs.readdirSync(runs).filter((d) => d.endsWith(`_${card}`) && fs.existsSync(path.join(runs, d, 'triage.json'))).sort().at(-1) || ''));
  const rows = await withBuildInfo(card, dir, readJson(path.join(dir, 'triage.json'), []));
  if (!rows.length) { console.log(`${card}: no failures in ${dir}`); process.exit(0); }
  for (const r of rows) console.log(`${r.key}  ${r.buildChange ? 'BUILD CHANGE? ' : ''}${sinceCell(r)}`);
}

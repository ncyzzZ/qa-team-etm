// fe-git.mjs - the ONLY way tools/heal/ talks to git in stms-fe (the developers' front-end repo).
// User rule: never edit anything in stms-fe. Allowed: bring code down (pull --ff-only on a clean develop,
// else fetch) and read. Every command is checked against an exact allow-list before git runs, the repo's
// own hooks / fsmonitor / pagers / external diff programs are switched off, and git never prompts.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveRepos } from './config.mjs';
import { profile } from '../profile.mjs';

// per subcommand: allowed flags. "=" suffix = prefix match (--format=...), "+" suffix = takes the next arg as its value
const FLAGS = {
  grep: ['-F', '-l', '-n', '-i', '-e+'],
  log: ['-1', '--format=', '-G+', '-S+', '--no-color', '--reverse', '--first-parent', '--before='],
  show: ['--format=', '--unified=', '--no-color', '--name-only'],
  diff: ['--unified=', '--no-color', '--name-only', '--name-status', '--find-renames'],
  'rev-parse': ['--show-toplevel', '--verify', '-q', '--short'],
  'symbolic-ref': ['--short', '-q'],
  status: ['--porcelain', '--untracked-files=no'],
};
const EXACT = {
  fetch: [['--quiet', 'origin'], ['origin']],
};
const NO_HOOKS = path.join(os.tmpdir(), 'qa-heal-no-hooks-dir-that-does-not-exist');
const SAFE_CONFIG = [
  'core.fsmonitor=false', `core.hooksPath=${NO_HOOKS}`, 'core.pager=cat', 'gc.auto=0', 'maintenance.auto=false',
  'fetch.prune=false', 'fetch.recurseSubmodules=false', 'submodule.recurse=false', 'diff.external=', 'credential.interactive=false',
].flatMap((c) => ['-c', c]);
const EXTRA = { diff: ['--no-ext-diff', '--no-textconv'], show: ['--no-ext-diff', '--no-textconv'], log: ['--no-ext-diff', '--no-textconv'], fetch: ['--no-recurse-submodules'], pull: ['--no-recurse-submodules'] };

// The branch that may be pulled: the profile's FE branch (repos.feBranch), unless a caller passes one.
const defaultBranch = () => resolveRepos().feBranch;
const feName = () => profile().repos.feRepoDir; // for messages only

function flagsOk(sub, rest, branch) {
  if (sub === 'pull') return rest.length === 4 && ['--ff-only', '--quiet', 'origin', branch].every((a, i) => a === rest[i]);
  if (EXACT[sub]) return EXACT[sub].some((e) => e.length === rest.length && e.every((a, i) => a === rest[i]));
  const spec = FLAGS[sub];
  if (!spec) return false;
  if (sub === 'status' && !rest.includes('--porcelain')) return false; // plain status may refresh the index
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--') return true; // the rest are paths
    if (!a.startsWith('-')) continue; // a ref or a value
    const hit = spec.find((f) => (f.endsWith('=') ? a.startsWith(f) : f.replace(/\+$/, '') === a));
    if (!hit) return false;
    if (hit.endsWith('+')) i++; // skip its value
  }
  return true;
}

function cleanEnv(feRepo) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_/.test(k)));
  return {
    ...env, GIT_TERMINAL_PROMPT: '0', GIT_PAGER: 'cat', GIT_OPTIONAL_LOCKS: '0', GIT_ASKPASS: 'echo', SSH_ASKPASS: 'echo',
    GIT_SSH_COMMAND: 'ssh -o BatchMode=yes', GIT_CEILING_DIRECTORIES: path.dirname(feRepo),
  };
}

function raw(feRepo, args, timeout) {
  const r = spawnSync('git', ['-C', feRepo, ...SAFE_CONFIG, ...args], {
    encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], env: cleanEnv(feRepo),
  });
  if (r.error || r.status !== 0) {
    const e = new Error(`git ${args.join(' ')} failed: ${(r.error?.message || r.stderr || '').trim().split('\n')[0]}`);
    e.stderr = r.stderr || '';
    throw e;
  }
  return r.stdout.trim();
}

function assertRepoRoot(feRepo) {
  let real;
  try { real = fs.realpathSync(feRepo); } catch { throw new Error(`${feRepo} is not the root of a git repo (folder not found)`); }
  let top = '';
  try { top = fs.realpathSync(raw(real, ['rev-parse', '--show-toplevel'], 10_000)); } catch { /* not a repo */ }
  if (top !== real) throw new Error(`${feRepo} is not the root of a git repo`);
  return real;
}

/** Run one allowed git command in feRepo; returns stdout (trimmed). Throws on a refused command or a git error. */
export function git(feRepo, args, { timeout = 30_000, branch: feBranch = defaultBranch() } = {}) {
  const [sub, ...rest] = args;
  if (!flagsOk(sub, rest, feBranch)) throw new Error(`git ${sub} not allowed on ${feName()} (${args.join(' ')})`);
  const repo = assertRepoRoot(feRepo);
  if (sub === 'pull') {
    let branch = '';
    try { branch = raw(repo, ['symbolic-ref', '--short', '-q', 'HEAD'], 10_000); } catch { branch = '(detached)'; }
    if (branch !== feBranch) throw new Error(`git pull refused: ${feName()} is on ${branch}, not ${feBranch}`);
    if (raw(repo, ['status', '--porcelain', '--untracked-files=no'], 30_000) !== '') throw new Error(`git pull refused: ${feName()} has local changes`);
  }
  return raw(repo, [sub, ...(EXTRA[sub] || []), ...rest], timeout);
}

function newest(feRepo, branch) {
  try {
    const [commit, date] = git(feRepo, ['log', '-1', '--format=%H %cI', `origin/${branch}`], { branch }).split(' ');
    return { commit, date };
  } catch { return null; }
}
const why = (e) => (e.stderr || e.message).trim().split('\n').filter(Boolean).pop()?.slice(0, 160) || 'unknown error';

/**
 * Bring the latest stms-fe code down without editing anything.
 * @returns {{ mode: 'pull'|'fetch'|'offline', reason: string, newest: { commit: string, date: string }|null }}
 */
export function updateFe(feRepo, { branch: feBranch = defaultBranch() } = {}) {
  const opt = { branch: feBranch };
  const name = feName();
  let branch = '';
  try { branch = git(feRepo, ['symbolic-ref', '--short', '-q', 'HEAD'], opt); } catch { branch = '(detached)'; }
  const dirty = git(feRepo, ['status', '--porcelain', '--untracked-files=no'], opt) !== '';
  let reason;
  if (branch === feBranch && !dirty) {
    try {
      git(feRepo, ['pull', '--ff-only', '--quiet', 'origin', feBranch], { timeout: 60_000, branch: feBranch });
      return { mode: 'pull', reason: `clean ${feBranch}, fast-forwarded`, newest: newest(feRepo, feBranch) };
    } catch (e) {
      reason = `pull --ff-only failed (${why(e)}), trying fetch`;
    }
  } else {
    reason = branch !== feBranch ? `${name} is on branch ${branch}, not ${feBranch}: fetch only` : `${name} has local changes: fetch only`;
  }
  try {
    git(feRepo, ['fetch', '--quiet', 'origin'], { timeout: 60_000, branch: feBranch });
    return { mode: 'fetch', reason, newest: newest(feRepo, feBranch) };
  } catch (e) {
    return { mode: 'offline', reason: `GitLab not reachable (${why(e)}): using the origin/${feBranch} already in the clone`, newest: newest(feRepo, feBranch) };
  }
}

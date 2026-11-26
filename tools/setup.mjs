#!/usr/bin/env node
// setup.mjs - one-time local setup and health check, the same on Windows and Mac. Zero dependencies.
//
//   node tools/setup.mjs                          show the current setup (changes nothing)
//   node tools/setup.mjs <folder of ep-etm-fe-qa>  check that folder, then save it as PW_REPO in the git-ignored .env
//   node tools/setup.mjs --sync-profile           write .claude/active-profile.md (project rules CLAUDE.md imports) from profiles/<name>/
//   node tools/setup.mjs --new-profile <name> --key <KEY> --site <host> --project-id <n> --board <n> --pw-repo-dir <dir> --fe-repo-dir <dir> [--fe-branch <b>]
//                                                 make profiles/<name>/ from the template, select it in .env, then run the check
//
// Windows example:  node tools/setup.mjs "D:\mac\DocforAi\PTTEP_Auto\ep-etm-fe-qa"
// Mac example:      node tools/setup.mjs ~/Documents/PTTEP_Auto/ep-etm-fe-qa
// Secrets are never printed: only "set" or "missing".
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { resolveRepos } from './heal/config.mjs';
import { loadProfile, profile, syncActiveProfile } from './profile.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = process.env.QA_ENV_FILE || path.join(ROOT, '.env');
const PROFILES_ROOT = process.env.QA_PROFILE_ROOT || ROOT;
const ok = (m) => console.log(`  OK    ${m}`);
const bad = (m) => console.log(`  FIX   ${m}`);
const info = (m) => console.log(`  info  ${m}`);
let problems = 0;
const need = (cond, good, fix) => { if (cond) ok(good); else { bad(fix); problems++; } return cond; };

const readEnvFile = () => { try { return fs.readFileSync(ENV_FILE, 'utf8').replace(/\r\n/g, '\n'); } catch { return ''; } };
const fromEnvFile = (name) => { const m = readEnvFile().match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm')); return m ? m[1].replace(/^["']|["']$/g, '') : ''; };
const expand = (p) => (p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p);

// --new-profile: copy profiles/_template to profiles/<name>, fill profile.json, select it in .env.
function newProfile(argv) {
  const fail = (m) => { console.error(`[setup] ${m}`); process.exit(2); };
  const flags = {};
  const names = { '--key': 'key', '--site': 'site', '--project-id': 'projectId', '--board': 'board', '--pw-repo-dir': 'pwRepoDir', '--fe-repo-dir': 'feRepoDir', '--fe-branch': 'feBranch' };
  const [name, ...rest] = argv;
  for (let i = 0; i < rest.length; i += 2) {
    if (!names[rest[i]]) fail(`unknown flag ${rest[i]}`);
    flags[names[rest[i]]] = rest[i + 1];
  }
  const missing = Object.entries(names).filter(([f, k]) => k !== 'feBranch' && !flags[k]).map(([f]) => f);
  if (!name || name.startsWith('--')) fail('usage: node tools/setup.mjs --new-profile <name> ' + Object.keys(names).map((f) => (f === '--fe-branch' ? `[${f} <b>]` : `${f} <v>`)).join(' '));
  if (!/^[a-z][a-z0-9-]{1,30}$/.test(name)) fail(`profile name "${name}" is not allowed: use ^[a-z][a-z0-9-]{1,30}$`);
  if (missing.length) fail(`missing flags: ${missing.join(', ')}`);
  if (!/^[A-Z][A-Z0-9_]{1,9}$/.test(flags.key)) fail(`jira.projectKey "${flags.key}" must match ^[A-Z][A-Z0-9_]{1,9}$`);
  for (const k of ['projectId', 'board']) if (!/^\d+$/.test(flags[k])) fail(`--${k === 'board' ? 'board' : 'project-id'} must be a number`);
  const dir = path.join(PROFILES_ROOT, 'profiles', name);
  if (fs.existsSync(dir)) fail(`profile "${name}" already exists (profiles/${name})`);
  const tpl = path.join(PROFILES_ROOT, 'profiles', '_template');
  if (!fs.existsSync(tpl)) fail('profiles/_template not found');
  fs.cpSync(tpl, dir, { recursive: true });
  const file = path.join(dir, 'profile.json');
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  j.title = flags.key;
  Object.assign(j.jira, { site: flags.site, projectKey: flags.key, projectId: Number(flags.projectId), boardId: Number(flags.board) });
  Object.assign(j.repos, { pwRepoDir: flags.pwRepoDir, feRepoDir: flags.feRepoDir, feBranch: flags.feBranch || 'develop' });
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + '\n');
  let lines = [];
  try { lines = fs.readFileSync(ENV_FILE, 'utf8').replace(/\r\n/g, '\n').split('\n'); } catch {}
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  const at = lines.findIndex((l) => /^\s*QA_PROFILE\s*=/.test(l));
  if (at >= 0) lines[at] = `QA_PROFILE=${name}`; else lines.push(`QA_PROFILE=${name}`);
  fs.writeFileSync(ENV_FILE, lines.join('\n') + '\n');
  process.env.QA_PROFILE = name; // the check below reads the new profile
  console.log(`[setup] profile "${name}" created in profiles/${name}/ and selected (QA_PROFILE=${name} in ${path.basename(ENV_FILE)})`);
  console.log(`  info  next: edit profiles/${name}/rules.md and the jira.fields ids in profile.json`);
  syncActiveProfile({ root: PROFILES_ROOT, p: loadProfile({ root: PROFILES_ROOT, envFile: ENV_FILE, name }) });
}

const isNew = process.argv[2] === '--new-profile';
const arg = isNew ? undefined : process.argv[2];
if (isNew) newProfile(process.argv.slice(3));
if (arg === '--sync-profile') {
  const s = syncActiveProfile();
  console.log(`[setup] ${path.relative(ROOT, s.path)} ${s.changed ? 'written' : 'already up to date'} (profile ${profile().name}, from profiles/${profile().name}/rules.md)`);
  process.exit(0);
}
console.log(`[setup] ${process.platform}, repo ${ROOT}`);

// 1) PW_REPO
let repo;
if (arg) {
  repo = path.resolve(expand(arg));
  const found = fs.existsSync(path.join(repo, 'node_modules', '@playwright', 'test', 'cli.js'));
  if (!fs.existsSync(repo)) { console.log(`  FIX   folder not found: ${repo}`); process.exit(1); }
  if (!found) { console.log(`  FIX   ${repo} has no Playwright (node_modules/@playwright/test). Run "npm install" there, or check the path.`); process.exit(1); }
  const lines = readEnvFile().split('\n').filter((l) => !/^\s*PW_REPO\s*=/.test(l) && l.trim() !== '');
  lines.push(`PW_REPO=${repo}`);
  fs.writeFileSync(ENV_FILE, lines.join('\n') + '\n');
  ok(`saved PW_REPO=${repo} in .env (this file is not committed)`);
} else {
  const R = resolveRepos();
  repo = R.pwRepo;
  info(`PW_REPO = ${repo}  (${{ environment: 'from the environment', '.env': 'from .env' }[R.sources.pw] || R.sources.pw})`);
}

// 2) checks
const major = Number(process.versions.node.split('.')[0]);
need(major >= 18, `Node ${process.versions.node}`, `Node ${process.versions.node} is too old: install Node 18 or newer`);
need(fs.existsSync(repo), 'Playwright repo folder exists', `PW_REPO folder not found: run  node tools/setup.mjs <folder of ${profile().repos.pwRepoDir}>`);
need(fs.existsSync(path.join(repo, 'node_modules', '@playwright', 'test', 'cli.js')), 'Playwright is installed there', 'run "npm install" inside the Playwright repo');
if (fs.existsSync(repo)) info(`Playwright repo has its own .env (logins): ${fs.existsSync(path.join(repo, '.env')) ? 'yes' : 'NO, create it before running tests'}`);
{ // FE repo (stms-fe), used read-only by tools/heal/ (self-healing). A warning, not a hard fail.
  const feDir = profile().repos.feRepoDir;
  const R2 = resolveRepos();
  const fe = R2.sources.fe.startsWith('default') ? path.resolve(repo, '..', feDir) : R2.feRepo; // repo may be the folder just given as an argument
  info(`FE_REPO = ${fe}  (${{ environment: 'from the environment', '.env': 'from .env' }[R2.sources.fe] || R2.sources.fe})`);
  if (fs.existsSync(path.join(fe, '.git'))) ok(`FE repo (${feDir}) found, self-healing can read it`);
  else info(`WARN  FE repo (${feDir}) not found: self-healing pre-flight is off. Add FE_REPO=<folder of ${feDir}> to .env`);
}
need(!!(process.env.XRAY_CLIENT_ID && process.env.XRAY_CLIENT_SECRET), 'XRAY_CLIENT_ID and XRAY_CLIENT_SECRET are set', 'set XRAY_CLIENT_ID and XRAY_CLIENT_SECRET as environment variables (never in a committed file)');
const py = ['python3', 'python'].map((c) => ({ c, r: spawnSync(c, ['--version'], { encoding: 'utf8' }) })).find((x) => x.r.status === 0);
info(py ? `${py.c} found (only the delete-test-executions skill needs it; on Mac the command is python3)` : 'Python not found (only the delete-test-executions skill needs it)');
{ // .claude/active-profile.md: the project's rules for Claude (imported by CLAUDE.md, git-ignored, made by team.mjs start)
  const s = syncActiveProfile({ check: true });
  if (!s.changed) ok(`active profile ${profile().name}`);
  else console.log(`  WARN  .claude/active-profile.md is ${fs.existsSync(s.path) ? 'stale' : 'missing'}: run node tools/setup.mjs --sync-profile`);
}
const hasBoard = fs.existsSync(path.join(ROOT, '.claude', 'team', 'team.mjs'));
need(hasBoard, 'status board script found', 'the .claude/team folder is missing: re-clone the repo');

console.log(problems ? `[setup] ${problems} thing(s) to fix` : '[setup] all good');
process.exit(problems && !isNew ? 1 : 0);

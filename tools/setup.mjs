#!/usr/bin/env node
// setup.mjs - one-time local setup and health check, the same on Windows and Mac. Zero dependencies.
//
//   node tools/setup.mjs                          show the current setup (changes nothing)
//   node tools/setup.mjs <folder of ep-etm-fe-qa>  check that folder, then save it as PW_REPO in the git-ignored .env
//
// Windows example:  node tools/setup.mjs "D:\mac\DocforAi\PTTEP_Auto\ep-etm-fe-qa"
// Mac example:      node tools/setup.mjs ~/Documents/PTTEP_Auto/ep-etm-fe-qa
// Secrets are never printed: only "set" or "missing".
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT, '.env');
const ok = (m) => console.log(`  OK    ${m}`);
const bad = (m) => console.log(`  FIX   ${m}`);
const info = (m) => console.log(`  info  ${m}`);
let problems = 0;
const need = (cond, good, fix) => { if (cond) ok(good); else { bad(fix); problems++; } return cond; };

const readEnvFile = () => { try { return fs.readFileSync(ENV_FILE, 'utf8').replace(/\r\n/g, '\n'); } catch { return ''; } };
const fromEnvFile = (name) => { const m = readEnvFile().match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm')); return m ? m[1].replace(/^["']|["']$/g, '') : ''; };
const expand = (p) => (p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p);

const arg = process.argv[2];
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
  repo = process.env.PW_REPO || fromEnvFile('PW_REPO') || path.resolve(ROOT, '..', 'ep-etm-fe-qa');
  info(`PW_REPO = ${repo}  (${process.env.PW_REPO ? 'from the environment' : fromEnvFile('PW_REPO') ? 'from .env' : 'default: next to this repo'})`);
}

// 2) checks
const major = Number(process.versions.node.split('.')[0]);
need(major >= 18, `Node ${process.versions.node}`, `Node ${process.versions.node} is too old: install Node 18 or newer`);
need(fs.existsSync(repo), 'Playwright repo folder exists', `PW_REPO folder not found: run  node tools/setup.mjs <folder of ep-etm-fe-qa>`);
need(fs.existsSync(path.join(repo, 'node_modules', '@playwright', 'test', 'cli.js')), 'Playwright is installed there', 'run "npm install" inside the Playwright repo');
if (fs.existsSync(repo)) info(`Playwright repo has its own .env (logins): ${fs.existsSync(path.join(repo, '.env')) ? 'yes' : 'NO, create it before running tests'}`);
{ // FE repo (stms-fe), used read-only by tools/heal/ (self-healing). A warning, not a hard fail.
  const fe = process.env.FE_REPO || fromEnvFile('FE_REPO') || path.resolve(repo, '..', 'stms-fe');
  info(`FE_REPO = ${fe}  (${process.env.FE_REPO ? 'from the environment' : fromEnvFile('FE_REPO') ? 'from .env' : 'default: stms-fe next to PW_REPO'})`);
  if (fs.existsSync(path.join(fe, '.git'))) ok('FE repo (stms-fe) found, self-healing can read it');
  else info('WARN  FE repo (stms-fe) not found: self-healing pre-flight is off. Add FE_REPO=<folder of stms-fe> to .env');
}
need(!!(process.env.XRAY_CLIENT_ID && process.env.XRAY_CLIENT_SECRET), 'XRAY_CLIENT_ID and XRAY_CLIENT_SECRET are set', 'set XRAY_CLIENT_ID and XRAY_CLIENT_SECRET as environment variables (never in a committed file)');
const py = ['python3', 'python'].map((c) => ({ c, r: spawnSync(c, ['--version'], { encoding: 'utf8' }) })).find((x) => x.r.status === 0);
info(py ? `${py.c} found (only the delete-test-executions skill needs it; on Mac the command is python3)` : 'Python not found (only the delete-test-executions skill needs it)');
const hasBoard = fs.existsSync(path.join(ROOT, '.claude', 'team', 'team.mjs'));
need(hasBoard, 'status board script found', 'the .claude/team folder is missing: re-clone the repo');

console.log(problems ? `[setup] ${problems} thing(s) to fix` : '[setup] all good');
process.exit(problems ? 1 : 0);

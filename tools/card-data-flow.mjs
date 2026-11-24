// card-data-flow.mjs - cards whose data file says `create: true` get their data made by script for every run:
// sweep leftovers -> create (API) -> reset (DB content) -> run -> cleanup (always). Used by run-card.mjs.
// Design: docs/superpowers/specs/2026-11-23-card-data-create-cleanup-design.md
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const dataFile = (pwRepo, key) => path.join(pwRepo, 'scripts', 'seed', 'cards', `${key}.data.cjs`);
const ledgerFile = (pwRepo, key) => path.join(pwRepo, 'output', 'seed', `${key}.ledger.json`);

/** The card lock (output/seed/<KEY>.lock, same file as data-gate.mjs and lock.cjs) when held, else null. */
export function lockHeld(pwRepo, key) {
  try { return JSON.parse(fs.readFileSync(path.join(pwRepo, 'output', 'seed', `${key}.lock`), 'utf8')); } catch { return null; }
}

/** The data file has a `create: true` line (read as text: loading it needs the Playwright repo's .env). */
export function hasCreate(pwRepo, key) {
  try { return /^\s*create:\s*true\s*,?\s*$/m.test(fs.readFileSync(dataFile(pwRepo, key), 'utf8')); } catch { return false; }
}

/** Nothing made by an earlier run is left (same rule as ep-etm-fe-qa scripts/seed/card/ledger.cjs isEmpty). */
export function ledgerEmpty(pwRepo, key) {
  try {
    const l = JSON.parse(fs.readFileSync(ledgerFile(pwRepo, key), 'utf8'));
    return !Object.keys(l.plans || {}).length && !(l.event && l.event.made);
  } catch { return true; }
}

export function planFlow({ hasCreate: c, ledgerEmpty: empty, keepData = false }) {
  if (!c) return ['run'];
  return [...(empty ? [] : ['sweep']), 'create', 'reset', 'run', ...(keepData ? [] : ['cleanup'])];
}

const SPEC = { sweep: 'cardCleanup', cleanup: 'cardCleanup', create: 'cardCreate' };
/** @returns {{ args: string[], env: object }} run with process.execPath, cwd = pwRepo */
export function stepCommand(pwRepo, key, step) {
  if (step === 'reset') return { args: [path.join('scripts', 'seed', 'card-data.cjs'), key, 'reset', '--apply'], env: { ...process.env } };
  if (!SPEC[step]) throw new Error(`${step} is not a data step`);
  return {
    args: [path.join(pwRepo, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', `tests/fe/setup/${SPEC[step]}.spec.ts`, '--workers=1', '--reporter=line', '--retries=0'],
    env: { ...process.env, CARD: key },
  };
}

/** Run one data step in the foreground; returns its exit code. */
export function runStep(pwRepo, key, step) {
  const c = stepCommand(pwRepo, key, step);
  console.log(`[card-data] ${step} ${key}`);
  const r = spawnSync(process.execPath, c.args, { cwd: pwRepo, env: c.env, stdio: 'inherit' });
  return r.status ?? 1;
}

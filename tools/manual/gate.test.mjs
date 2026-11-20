import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gate } from './gate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KEY = 'ETM-8392';
function pw({ dataFile = false, lock = null, resetAt = null } = {}) {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'mgate-'));
  fs.mkdirSync(path.join(r, 'scripts', 'seed', 'cards'), { recursive: true });
  fs.mkdirSync(path.join(r, 'output', 'seed'), { recursive: true });
  if (dataFile) fs.writeFileSync(path.join(r, 'scripts', 'seed', 'cards', `${KEY}.data.cjs`), 'module.exports = {}');
  if (resetAt) fs.writeFileSync(path.join(r, 'output', 'seed', `${KEY}.json`), JSON.stringify({ key: KEY, resetAt }));
  if (lock) fs.writeFileSync(path.join(r, 'output', 'seed', `${KEY}.lock`), JSON.stringify(lock));
  return r;
}
const lockOf = (r) => path.join(r, 'output', 'seed', `${KEY}.lock`);
const cli = (r, ...args) => spawnSync(process.execPath, [path.join(HERE, 'gate.mjs'), KEY, ...args], { encoding: 'utf8', env: { ...process.env, PW_REPO: r } });
const fresh = () => ({ owner: 'run-card', pid: 1, at: new Date().toISOString() });

test('take: lock held by run-card -> exit 2 naming run-card', () => {
  const r = pw({ lock: fresh() });
  const x = cli(r, 'take');
  assert.equal(x.status, 2);
  assert.match(x.stdout + x.stderr, /run-card/);
  assert.equal(JSON.parse(fs.readFileSync(lockOf(r), 'utf8')).owner, 'run-card', 'the other lock is left alone');
});

test('take: lock held by run-card on a card with a data file -> exit 2 naming run-card', () => {
  const r = pw({ dataFile: true, lock: fresh(), resetAt: new Date().toISOString() });
  const x = cli(r, 'take');
  assert.equal(x.status, 2);
  assert.match(x.stdout + x.stderr, /run-card/);
});

test('take: free card -> lock file owned by manual-runner; release removes it', () => {
  const r = pw();
  const x = cli(r, 'take');
  assert.equal(x.status, 0, x.stdout + x.stderr);
  assert.equal(JSON.parse(fs.readFileSync(lockOf(r), 'utf8')).owner, 'manual-runner');
  const y = cli(r, 'release');
  assert.equal(y.status, 0);
  assert.equal(fs.existsSync(lockOf(r)), false);
});

test('release does not remove a lock of another owner', () => {
  const r = pw({ lock: fresh() });
  const y = cli(r, 'release');
  assert.equal(y.status, 2);
  assert.match(y.stdout + y.stderr, /run-card/);
  assert.equal(fs.existsSync(lockOf(r)), true);
});

test('take on a card with a data file: the data gate must pass first (never reset -> refused, no lock)', async () => {
  const r = pw({ dataFile: true });
  const g = await gate({ pwRepo: r, key: KEY, action: 'take', runCheck: async () => ({ code: 0, out: 'READY' }) });
  assert.equal(g.code, 2);
  assert.match(g.message, /never reset/);
  assert.equal(fs.existsSync(lockOf(r)), false);
});

test('take on a card with a data file, reset and READY: lock taken', async () => {
  const r = pw({ dataFile: true, resetAt: new Date().toISOString() });
  const g = await gate({ pwRepo: r, key: KEY, action: 'take', runCheck: async () => ({ code: 0, out: 'READY' }) });
  assert.equal(g.code, 0, g.message);
  assert.equal(JSON.parse(fs.readFileSync(lockOf(r), 'utf8')).owner, 'manual-runner');
});

test('take with --run: the current manual run folder does not count as a run after the reset', async () => {
  const r = pw({ dataFile: true, resetAt: '2026-11-20T00:00:00Z' });
  const run = '2099-01-01_000000_ETM-8392_manual';
  fs.mkdirSync(path.join(r, 'output', 'runs', run), { recursive: true });
  const ready = async () => ({ code: 0, out: 'READY' });
  const without = await gate({ pwRepo: r, key: KEY, action: 'take', runCheck: ready });
  assert.equal(without.code, 2, 'a run folder newer than the reset closes the gate');
  const g = await gate({ pwRepo: r, key: KEY, action: 'take', run: path.join(r, 'output', 'runs', run), runCheck: ready });
  assert.equal(g.code, 0, g.message);
});

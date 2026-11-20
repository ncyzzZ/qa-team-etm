import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { dataGate, lastRunTime, takeLock, releaseLock, holdLock } from './data-gate.mjs';

const NOW = new Date('2026-11-20T10:00:00Z');
const KEY = 'ETM-8405';
function pw({ dataFile = true, resetAt = null, runs = [], lock = null } = {}) {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'datagate-'));
  fs.mkdirSync(path.join(r, 'scripts', 'seed', 'cards'), { recursive: true });
  fs.mkdirSync(path.join(r, 'output', 'seed'), { recursive: true });
  if (dataFile) fs.writeFileSync(path.join(r, 'scripts', 'seed', 'cards', `${KEY}.data.cjs`), 'module.exports = {}');
  if (resetAt) fs.writeFileSync(path.join(r, 'output', 'seed', `${KEY}.json`), JSON.stringify({ key: KEY, resetAt, ids: {} }));
  for (const d of runs) fs.mkdirSync(path.join(r, 'output', 'runs', d), { recursive: true });
  if (lock) fs.writeFileSync(path.join(r, 'output', 'seed', `${KEY}.lock`), JSON.stringify(lock));
  return r;
}
const ready = async () => ({ code: 0, out: 'READY' });

test('no data file: the card uses the old way, gate open', async () => {
  const g = await dataGate({ pwRepo: pw({ dataFile: false }), key: KEY, now: NOW, runCheck: ready });
  assert.equal(g.ok, true);
});

test('reset older than the last run of the card: closed, with the reset command', async () => {
  // run folders carry local time; 2026-11-20_090000 local is after a reset at 2000-01-01
  const g = await dataGate({ pwRepo: pw({ resetAt: '2000-01-01T00:00:00Z', runs: ['2026-11-20_090000_ETM-8405'] }), key: KEY, now: NOW, runCheck: ready });
  assert.equal(g.ok, false);
  assert.match(g.message, /card-data\.cjs ETM-8405 reset/);
});

test('no result file at all: closed', async () => {
  const g = await dataGate({ pwRepo: pw(), key: KEY, now: NOW, runCheck: ready });
  assert.equal(g.ok, false);
  assert.match(g.message, /card-data\.cjs ETM-8405 reset/);
});

test('reset newer than the last run but check says NEEDS RESET: closed', async () => {
  const g = await dataGate({ pwRepo: pw({ resetAt: NOW.toISOString() }), key: KEY, now: NOW, runCheck: async () => ({ code: 10, out: 'NEEDS RESET' }) });
  assert.equal(g.ok, false);
  assert.match(g.message, /NEEDS RESET/);
});

test('reset newer than the last run and READY: open, check result kept', async () => {
  const g = await dataGate({ pwRepo: pw({ resetAt: NOW.toISOString(), runs: ['2000-01-01_000000_ETM-8405'] }), key: KEY, now: NOW, runCheck: ready });
  assert.equal(g.ok, true);
  assert.equal(g.check.status, 'READY');
});

test('a run folder of another card does not count as the last run', () => {
  const r = pw({ runs: ['2026-11-20_090000_ETM-8391', '2026-11-19_080000_ETM-8405'] });
  assert.equal(lastRunTime(r, KEY).getDate(), 19);
});

test('a stale lock closes the gate and says stale', async () => {
  const g = await dataGate({ pwRepo: pw({ resetAt: NOW.toISOString(), lock: { owner: 'reset', pid: 1, at: '2026-11-20T07:00:00Z' } }), key: KEY, now: NOW, runCheck: ready });
  assert.equal(g.ok, false);
  assert.match(g.message, /stale/);
});

test('--no-data-check: open, and the message says the data was not reset', async () => {
  const g = await dataGate({ pwRepo: pw(), key: KEY, now: NOW, runCheck: ready, skip: true });
  assert.equal(g.ok, true);
  assert.match(g.message, /data not reset \(--no-data-check\)/);
});

test('takeLock / releaseLock use the same file as card-data.cjs', () => {
  const r = pw();
  assert.equal(takeLock(r, KEY, 'run-card', NOW).ok, true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(r, 'output', 'seed', `${KEY}.lock`), 'utf8')).owner, 'run-card');
  assert.equal(takeLock(r, KEY, 'run-card', NOW).ok, false);
  releaseLock(r, KEY);
  assert.equal(fs.existsSync(path.join(r, 'output', 'seed', `${KEY}.lock`)), false);
});

test('holdLock: the run lock is freed on exit, SIGTERM, SIGHUP and a spawn error (review: lock left behind)', async () => {
  const { EventEmitter } = await import('node:events');
  for (const ev of ['exit', 'SIGTERM', 'SIGHUP', 'SIGINT', 'child-error']) {
    const r = pw();
    const proc = new EventEmitter(); proc.exit = () => {};
    const child = new EventEmitter();
    assert.equal(holdLock(r, KEY, { proc, child, now: NOW }).ok, true);
    assert.equal(fs.existsSync(path.join(r, 'output', 'seed', `${KEY}.lock`)), true);
    if (ev === 'child-error') child.emit('error', new Error('spawn ENOENT')); else proc.emit(ev);
    assert.equal(fs.existsSync(path.join(r, 'output', 'seed', `${KEY}.lock`)), false, `lock freed on ${ev}`);
  }
});

test('a manual runner run folder (_<KEY>_manual) counts as the last run of the card', () => {
  const r = pw({ runs: ['2026-11-19_080000_ETM-8405', '2026-11-20_090000_ETM-8405_manual'] });
  assert.equal(lastRunTime(r, KEY).getDate(), 20);
});

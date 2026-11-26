#!/usr/bin/env node
// triage.mjs - sort every failed (or retried) test of one Playwright run into one cause:
//   locator | flaky | data | env | assertion (possible app bug) | unknown
//   node tools/heal/triage.mjs <run folder with results.json>     writes triage.json + triage.md there
import fs from 'node:fs';
import path from 'node:path';
import { firstKey } from '../profile.mjs';
import { fileURLToPath } from 'node:url';

/** @typedef {{ cause: 'locator'|'flaky'|'data'|'env'|'assertion'|'unknown', locator: string|null, pageRef: string|null, firstLine: string }} Triage */

const ENV = [/net::ERR_/, /ECONNREFUSED|ECONNRESET|ENOTFOUND/, /login\.microsoftonline\.com/, /\b5\d\d (Internal Server Error|Bad Gateway|Service Unavailable|Gateway Timeout)/i, /status(?: code)?:? 5\d\d\b/i, /page\.goto: Timeout/];
const DATA = [/no test data/i, /test data (is )?(missing|not found)/i, /precondition/i];
const ASSERT_EXPECTED = /\bExpected(?: string| value| pattern)?:/;
const ASSERT_RECEIVED = /\bReceived(?: string| value)?:/;
const NOT_FOUND = /element\(s\) not found/;
const LOCATOR = [/waiting for (locator|getBy)/, /strict mode violation/, NOT_FOUND, /locator\.\w+: Timeout/];
// found but blocked (disabled, covered, hidden, moving): the locator works, the app state is the question
const BLOCKED = /element is not (enabled|visible|stable|editable)|intercepts pointer events|outside of the viewport/;
const LOCATOR_TEXT = /(locator\((['"]).*?\2\)|getBy\w+\([^)]*\))/;

const clean = (s) => String(s || '').replace(/\x1b\[[0-9;]*m/g, '');

/** @returns {Triage} */
export function classify(test) {
  const results = test.results || [];
  const failed = results.find((r) => r.status === 'failed' || r.status === 'timedOut');
  const msg = clean(failed?.error?.message);
  const stack = clean(failed?.error?.stack);
  const firstLine = msg.split('\n')[0].slice(0, 200);
  const locator = (msg.match(LOCATOR_TEXT) || [])[1] || null;
  const pm = stack.match(/(pages\/[^\s:()]+\.ts):(\d+)/);
  const pageRef = pm ? `${pm[1]}:${pm[2]}` : null;
  const base = { locator, pageRef, firstLine };
  if (failed && results.some((r) => r.status === 'passed')) return { cause: 'flaky', ...base };
  if (ENV.some((re) => re.test(msg))) return { cause: 'env', ...base };
  if (DATA.some((re) => re.test(msg))) return { cause: 'data', ...base };
  if (ASSERT_EXPECTED.test(msg) && ASSERT_RECEIVED.test(msg) && !NOT_FOUND.test(msg)) return { cause: 'assertion', ...base };
  if (BLOCKED.test(msg)) return { cause: 'unknown', ...base };
  if (LOCATOR.some((re) => re.test(msg))) return { cause: 'locator', ...base };
  return { cause: 'unknown', ...base };
}

/** Every failed or retried test of the run, classified. Skipped and clean passes are left out. */
export function triageRun(runDir, { write = true } = {}) {
  const r = JSON.parse(fs.readFileSync(path.join(runDir, 'results.json'), 'utf8'));
  const rows = [];
  // card test data (tools/data-gate.mjs): reset and READY before the run, so a data failure is not missing setup data
  let dataReady = false;
  try { dataReady = JSON.parse(fs.readFileSync(path.join(runDir, 'data-check.json'), 'utf8')).status === 'READY'; } catch { /* no data gate */ }
  (function walk(s) {
    for (const sp of s.specs || []) for (const t of sp.tests || []) {
      const res = t.results || [];
      const bad = res.some((x) => x.status === 'failed' || x.status === 'timedOut');
      if (!bad) continue;
      const key = firstKey(sp.title) || sp.title.slice(0, 40); // same rule as the evidence report's tcKey
      const c = classify(t);
      if (dataReady && c.cause === 'data') c.firstLine = `${c.firstLine} (data was reset and READY before the run: check the test, not the setup)`;
      rows.push({ key, title: sp.title, file: sp.file, ...c });
    }
    (s.suites || []).forEach(walk);
  })(r);
  if (write) {
    fs.writeFileSync(path.join(runDir, 'triage.json'), JSON.stringify(rows, null, 2));
    const md = ['| Test | Cause | Locator | Page | Error |', '|---|---|---|---|---|',
      ...rows.map((x) => `| ${x.key} | ${x.cause} | ${x.locator ?? ''} | ${x.pageRef ?? ''} | ${x.firstLine.replace(/\|/g, '\\|')} |`)];
    fs.writeFileSync(path.join(runDir, 'triage.md'), `# Triage\n\n${md.join('\n')}\n`);
  }
  return rows;
}

export function countByCause(rows) {
  return rows.reduce((o, x) => ((o[x.cause] = (o[x.cause] || 0) + 1), o), {});
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir || !fs.existsSync(path.join(dir, 'results.json'))) { console.error('Usage: node tools/heal/triage.mjs <run folder with results.json>'); process.exit(2); }
  const rows = triageRun(dir);
  const c = countByCause(rows);
  console.log(`[triage] ${rows.length} failed/retried test(s): ${Object.entries(c).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
  for (const x of rows) console.log(`  ${x.cause.padEnd(9)} ${x.key}  ${x.locator ?? ''} ${x.pageRef ?? ''}`);
}

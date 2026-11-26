#!/usr/bin/env node
/**
 * Import Playwright results + evidence screenshots into an Xray Cloud Test Execution.
 *
 * Usage:
 *   XRAY_CLIENT_ID=xxx XRAY_CLIENT_SECRET=yyy node xray-import.mjs
 *
 * Or put XRAY_CLIENT_ID / XRAY_CLIENT_SECRET in .env next to this file.
 *
 * Config below: EXECUTION_KEY, EVIDENCE_DIR, TC_KEY_OFFSET
 */

import fs from 'node:fs';
import { profile } from '../tools/profile.mjs';
import path from 'node:path';

// ---------- config ----------
const XRAY_BASE      = 'https://xray.cloud.getxray.app/api/v2';
const TC_KEY_PREFIX  = `${profile().jira.projectKey}-`;
const EXECUTION_KEY  = `${TC_KEY_PREFIX}8201`;   // the Test Execution issue key
const EVIDENCE_DIR   = path.resolve('evidence');   // folder holding "<KEY>-5994 TC-0xx - ..." subfolders
const TC_KEY_OFFSET  = 6033;                       // TC-002 -> <KEY>-6035  (6033 + 2)
const DEFAULT_STATUS = 'PASSED';                   // PASSED | FAILED | TODO | EXECUTING
const MAX_EVIDENCE_PER_TEST = 0;                   // 0 = all screenshots; e.g. 3 = only first 3
const DRY_RUN        = process.argv.includes('--dry-run');
// ----------------------------

// minimal .env loader
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const CLIENT_ID = process.env.XRAY_CLIENT_ID;
const CLIENT_SECRET = process.env.XRAY_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing XRAY_CLIENT_ID / XRAY_CLIENT_SECRET');
  process.exit(1);
}

function collectTests() {
  const tests = [];
  const dirs = fs.readdirSync(EVIDENCE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  for (const dir of dirs) {
    const m = dir.match(/TC-(\d+)/i);
    if (!m) { console.warn(`skip (no TC number): ${dir}`); continue; }
    const tcNum = parseInt(m[1], 10);
    const testKey = `${TC_KEY_PREFIX}${TC_KEY_OFFSET + tcNum}`;

    const full = path.join(EVIDENCE_DIR, dir);
    let pngs = fs.readdirSync(full).filter(f => /\.(png|jpe?g)$/i.test(f)).sort();
    if (MAX_EVIDENCE_PER_TEST > 0) pngs = pngs.slice(0, MAX_EVIDENCE_PER_TEST);

    const evidence = pngs.map(f => ({
      filename: f,
      contentType: f.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
      data: fs.readFileSync(path.join(full, f)).toString('base64'),
    }));

    const bytes = evidence.reduce((s, e) => s + e.data.length, 0);
    console.log(`TC-${m[1]} -> ${testKey}  (${evidence.length} files, ${(bytes / 1048576).toFixed(1)} MB b64)`);

    tests.push({ testKey, status: DEFAULT_STATUS, comment: `Automated run - evidence: ${dir}`, evidence });
  }
  return tests;
}

async function authenticate() {
  const res = await fetch(`${XRAY_BASE}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });
  if (!res.ok) throw new Error(`auth failed ${res.status}: ${await res.text()}`);
  return (await res.text()).replace(/^"|"$/g, '');
}

async function main() {
  const tests = collectTests();
  if (!tests.length) { console.error('no tests found'); process.exit(1); }

  // AI-miss M-1: never PASSED when the latest run result says otherwise (tools/push-guard.mjs in the QA repo)
  const guardFile = new URL('../tools/push-guard.mjs', import.meta.url);
  if (fs.existsSync(guardFile)) {
    const { checkPush, blockMessage } = await import(guardFile.href);
    const { blocked } = checkPush(tests);
    if (blocked.length) { console.error(blockMessage(blocked)); process.exit(1); }
  }

  const payload = { testExecutionKey: EXECUTION_KEY, tests };
  const size = Buffer.byteLength(JSON.stringify(payload));
  console.log(`\npayload: ${tests.length} tests, ${(size / 1048576).toFixed(1)} MB`);

  if (DRY_RUN) {
    fs.writeFileSync('xray-payload.json', JSON.stringify(payload, null, 2));
    console.log('dry run - wrote xray-payload.json, nothing sent');
    return;
  }

  const token = await authenticate();
  const res = await fetch(`${XRAY_BASE}/import/execution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`import failed ${res.status}: ${body}`);
  console.log('OK:', body);
}

main().catch(e => { console.error(e.message); process.exit(1); });

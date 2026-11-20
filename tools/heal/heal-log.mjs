#!/usr/bin/env node
// heal-log.mjs - one JSON line per heal in <PW_REPO>/output/heal/heal-log.jsonl, and the self-healing rate.
//   node tools/heal/heal-log.mjs add '<json>'          append one heal (the automation agent does this after each heal)
//   node tools/heal/heal-log.mjs summary [from] [to]   locator failures, healed, by source, rate
// Healed = approved by the user AND the re-run passed (deduped by date+card+test+page).
// Rate = healed / locator failures of tests that passed before (once per locator until the test passes again);
// failures of scripts that never passed are new-script work, shown apart, not in the rate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRepos } from './config.mjs';

const FIELDS = ['date', 'card', 'test', 'page', 'old', 'new', 'source', 'approved', 'rerunPassed'];
const logFile = (pwRepo) => path.join(pwRepo, 'output', 'heal', 'heal-log.jsonl');
const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

/** @param {{ date: string, card: string, test: string, page: string, old: string, new: string, source: 'fe'|'live', approved: boolean, rerunPassed: boolean }} entry */
export function appendHeal(pwRepo, entry) {
  const missing = FIELDS.filter((f) => entry[f] === undefined);
  if (missing.length) throw new Error(`heal entry missing: ${missing.join(', ')}`);
  if (!['fe', 'live'].includes(entry.source)) throw new Error(`heal entry source must be fe or live, got ${entry.source}`);
  for (const f of ['approved', 'rerunPassed']) if (typeof entry[f] !== 'boolean') throw new Error(`heal entry ${f} must be a boolean (true/false), got ${JSON.stringify(entry[f])}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) throw new Error(`heal entry date must be YYYY-MM-DD, got ${entry.date}`);
  fs.mkdirSync(path.dirname(logFile(pwRepo)), { recursive: true });
  fs.appendFileSync(logFile(pwRepo), JSON.stringify(entry) + '\n');
}

export function readHeals(pwRepo) {
  let text = '';
  try { text = fs.readFileSync(logFile(pwRepo), 'utf8'); } catch { return []; }
  const out = [];
  for (const l of text.split('\n').filter(Boolean)) { try { out.push(JSON.parse(l)); } catch { console.error(`[heal-log] skipped a bad line: ${l.slice(0, 80)}`); } }
  return out;
}

const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const testId = (file, title) => `${file}|${title}`;

/** ids (file|title) of the tests that passed at least once in a run's results.json (a flaky pass counts) */
function passedIn(results) {
  const ids = [];
  (function walk(s) {
    if (!s) return;
    for (const sp of s.specs || []) for (const t of sp.tests || []) if ((t.results || []).some((r) => r.status === 'passed')) ids.push(testId(sp.file, sp.title));
    (s.suites || []).forEach(walk);
  })(results);
  return ids;
}

/**
 * Locator failures from the run folders <YYYY-MM-DD>_..., oldest first.
 * A heal case is a test that passed in an earlier run and now fails on a locator (the page changed under a working
 * script). It counts once per locator until the test passes again. A test that never passed is a new script being
 * written: counted apart (newScript), not in the rate. Passes before the date range still count as "passed before".
 */
function locatorFailures(pwRepo, from, to) {
  const runs = path.join(pwRepo, 'output', 'runs');
  let dirs = [];
  try { dirs = fs.readdirSync(runs).filter((d) => /^\d{4}-\d{2}-\d{2}/.test(d)).sort(); } catch { return { breaks: 0, newScript: 0 }; }
  const passed = new Set();
  const open = new Map(); // test id -> locators already counted in its current break
  const seenNew = new Set();
  let breaks = 0, newScript = 0;
  for (const d of dirs) {
    const counts = inRange(d.slice(0, 10), from, to);
    const rows = readJson(path.join(runs, d, 'triage.json'));
    for (const r of Array.isArray(rows) ? rows : []) {
      if (!r || r.cause !== 'locator') continue;
      const id = testId(r.file, r.title ?? r.key), loc = String(r.locator ?? '');
      if (passed.has(id)) {
        const done = open.get(id) || new Set();
        if (!done.has(loc)) { done.add(loc); open.set(id, done); if (counts) breaks++; }
      } else if (!seenNew.has(`${id}|${loc}`)) { seenNew.add(`${id}|${loc}`); if (counts) newScript++; }
    }
    for (const id of passedIn(readJson(path.join(runs, d, 'results.json')))) { passed.add(id); open.delete(id); }
  }
  return { breaks, newScript };
}

/** @returns {{ locatorFailures: number, newScriptFailures: number, healed: number, bySource: { fe: number, live: number }, rate: number|null }} */
export function summarize(pwRepo, { from, to } = {}) {
  const seen = new Set();
  const heals = readHeals(pwRepo).filter((h) => {
    if (!(h && inRange(h.date, from, to) && h.approved === true && h.rerunPassed === true)) return false;
    const k = [h.date, h.card, h.test, h.page].join('|'); // the same heal logged twice counts once
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const { breaks: lf, newScript } = locatorFailures(pwRepo, from, to);
  const bySource = { fe: heals.filter((h) => h.source === 'fe').length, live: heals.filter((h) => h.source === 'live').length };
  return { locatorFailures: lf, newScriptFailures: newScript, healed: heals.length, bySource, rate: lf ? Math.min(1, heals.length / lf) : null };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, a, b] = process.argv.slice(2);
  const { pwRepo } = resolveRepos();
  if (cmd === 'add') { appendHeal(pwRepo, JSON.parse(a)); console.log(`[heal-log] added to ${logFile(pwRepo)}`); }
  else if (cmd === 'summary') {
    const s = summarize(pwRepo, { from: a, to: b });
    console.log(`[heal-log] locator failures ${s.locatorFailures} (new scripts ${s.newScriptFailures}, not counted), healed ${s.healed} (fe ${s.bySource.fe}, live ${s.bySource.live}), rate ${s.rate == null ? '-' : `${Math.round(s.rate * 100)}%`}`);
  } else { console.error("Usage: node tools/heal/heal-log.mjs add '<json>' | summary [from] [to]"); process.exit(2); }
}

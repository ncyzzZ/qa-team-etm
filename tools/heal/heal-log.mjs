#!/usr/bin/env node
// heal-log.mjs - one JSON line per heal in <PW_REPO>/output/heal/heal-log.jsonl, and the self-healing rate.
//   node tools/heal/heal-log.mjs add '<json>'          append one heal (the automation agent does this after each heal)
//   node tools/heal/heal-log.mjs summary [from] [to]   locator failures, healed, by source, rate
// Healed = approved by the user AND the re-run passed (deduped by date+card+test+page).
// Rate = healed / locator failures (from triage.json of each run folder; a test failing in several runs counts each time).
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

/** Locator failures counted from triage.json of run folders named <YYYY-MM-DD>_... */
function locatorFailures(pwRepo, from, to) {
  const runs = path.join(pwRepo, 'output', 'runs');
  let n = 0;
  let dirs = [];
  try { dirs = fs.readdirSync(runs); } catch { return 0; }
  for (const d of dirs) {
    const date = (d.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
    if (!date || !inRange(date, from, to)) continue;
    try {
      const rows = JSON.parse(fs.readFileSync(path.join(runs, d, 'triage.json'), 'utf8'));
      if (Array.isArray(rows)) n += rows.filter((r) => r && r.cause === 'locator').length;
    } catch { /* no triage for this run */ }
  }
  return n;
}

/** @returns {{ locatorFailures: number, healed: number, bySource: { fe: number, live: number }, rate: number|null }} */
export function summarize(pwRepo, { from, to } = {}) {
  const seen = new Set();
  const heals = readHeals(pwRepo).filter((h) => {
    if (!(h && inRange(h.date, from, to) && h.approved === true && h.rerunPassed === true)) return false;
    const k = [h.date, h.card, h.test, h.page].join('|'); // the same heal logged twice counts once
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const lf = locatorFailures(pwRepo, from, to);
  const bySource = { fe: heals.filter((h) => h.source === 'fe').length, live: heals.filter((h) => h.source === 'live').length };
  return { locatorFailures: lf, healed: heals.length, bySource, rate: lf ? heals.length / lf : null };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, a, b] = process.argv.slice(2);
  const { pwRepo } = resolveRepos();
  if (cmd === 'add') { appendHeal(pwRepo, JSON.parse(a)); console.log(`[heal-log] added to ${logFile(pwRepo)}`); }
  else if (cmd === 'summary') {
    const s = summarize(pwRepo, { from: a, to: b });
    console.log(`[heal-log] locator failures ${s.locatorFailures}, healed ${s.healed} (fe ${s.bySource.fe}, live ${s.bySource.live}), rate ${s.rate == null ? '-' : `${Math.round(s.rate * 100)}%`}`);
  } else { console.error("Usage: node tools/heal/heal-log.mjs add '<json>' | summary [from] [to]"); process.exit(2); }
}

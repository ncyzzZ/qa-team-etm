#!/usr/bin/env node
// Claude Code status line hook. Claude Code runs this after every update and sends
// session info as JSON on stdin (rate limits and context size included).
// We copy the numbers into usage.json, which the status board reads. No tokens used.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(raw); } catch { process.exit(0); }
  try { fs.writeFileSync(path.join(dir, 'usage-raw.json'), JSON.stringify(j)); } catch {}

  const rl = j.rate_limits || {};
  const iso = (v) => {
    if (v === undefined || v === null) return null;
    const ms = typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : Date.parse(v);
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  };
  const pick = (o) => o && (o.used_percentage ?? o.utilization) !== undefined
    ? { pct: Math.round(o.used_percentage ?? o.utilization), resetsAt: iso(o.resets_at ?? o.resetsAt) }
    : null;
  const five = pick(rl.five_hour);
  const week = pick(rl.seven_day);
  const cw = j.context_window || {};
  const ctx = cw.used_percentage !== undefined ? Math.round(cw.used_percentage) : null;

  if (five || week) {
    // keep the old value for a window the payload did not include
    let old = {};
    try { old = JSON.parse(fs.readFileSync(path.join(dir, 'usage.json'), 'utf8')); } catch {}
    const out = { t: Date.now(), five: five || old.five, week: week || old.week, ctx: ctx ?? old.ctx ?? null };
    if (out.five && out.week) fs.writeFileSync(path.join(dir, 'usage.json'), JSON.stringify(out));
  }
  // status line text (shown in the terminal UI if it has one)
  const f = five ? `5h ${five.pct}%` : '';
  const w = week ? `wk ${week.pct}%` : '';
  process.stdout.write([f, w].filter(Boolean).join(' · '));
});

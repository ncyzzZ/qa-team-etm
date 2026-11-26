// sprint-report.mjs - extra numbers for the sprint report (tools/sprint-metrics.mjs): defect change vs the previous
// sprint, manual-effort estimate vs measured AI time per card, and what the AI team can do. Pure functions + readers.
//
// Effort, method A (user's choice, 2026-11-20):
//   manual = the lead's own estimate in work/SPRINT<N>/assessment.md (~Hours = design + execute by one tester, no AI);
//   AI     = time the board (.claude/team/events.jsonl) shows an agent "working" on the card. A segment left "working"
//            longer than capMin is cut to capMin (a status not updated overnight is not work). Overlapping agents count once.
//            Only cards with a full cycle on the board (>= 2 agent hand-backs) are measured; the others show "-".
//   saved  = manual - AI, over cards that have both. The person is assumed to supervise while the AI works, so AI time is
//            also counted as the person's time: the saving is on the conservative side.
// Method B (Jira worklog of the [QA] subtasks) can be added later as a second column.
import fs from 'node:fs';
import path from 'node:path';
import { profile, escapeKey } from './profile.mjs';

/** % change of defects/story and bugs vs the previous CLOSED sprint. An active sprint is provisional. */
export function defectChange(rows) {
  const pct = (now, before) => (now == null || before == null || before === 0 ? null : ((now - before) / before) * 100);
  return rows.map((r, i) => {
    const prev = [...rows.slice(0, i)].reverse().find((x) => !x.active);
    return { sprint: r.sprint, provisional: !!r.active, prevSprint: prev?.sprint ?? null,
      defectPct: prev ? pct(r.defectsPerStory, prev.defectsPerStory) : null, bugPct: prev ? pct(r.bugs, prev.bugs) : null };
  });
}

/** Rows of the lead's assessment table: `| ETM-1234 title | ... | ~TC | ~Hours | ... |` (TC and Hours = 5th and 6th cells). */
export function parseAssessment(md) {
  const out = [];
  for (const line of String(md).split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    const key = (cells[0] || '').match(new RegExp(String.raw`^(${escapeKey(profile().jira.projectKey)}-\d+)\b`))?.[1];
    if (!key || cells.length < 6) continue;
    const tc = Number(cells[4]), hours = Number(cells[5]);
    if (Number.isFinite(tc) && Number.isFinite(hours)) out.push({ key, tc, hours });
  }
  return out;
}

/** Minutes an agent was "working" per card (union of agents, each segment capped) and questions asked to the user. */
export function boardTime(events, { capMin = 45 } = {}) {
  const cap = capMin * 60_000, segs = {}, asks = {}, open = {}, done = {};
  const sorted = [...events].filter((e) => e.job).sort((a, b) => a.t - b.t);
  for (const e of sorted) {
    if (e.type === 'ask') asks[e.job] = (asks[e.job] || 0) + 1;
    if (e.type !== 'set' || !e.agent) continue;
    if (e.state === 'done' && e.agent !== 'lead') done[e.job] = (done[e.job] || 0) + 1;
    const k = `${e.job}|${e.agent}`;
    if (open[k] != null) { (segs[e.job] ||= []).push([open[k], Math.min(e.t, open[k] + cap)]); delete open[k]; }
    if (e.state === 'working') open[k] = e.t;
  }
  for (const [k, start] of Object.entries(open)) (segs[k.split('|')[0]] ||= []).push([start, start]); // still open: unknown end, counts 0
  const out = {};
  for (const job of new Set([...Object.keys(segs), ...Object.keys(asks)])) {
    const s = (segs[job] || []).sort((a, b) => a[0] - b[0]);
    let total = 0, end = -Infinity;
    for (const [a, b] of s) { if (b > end) { total += b - Math.max(a, end); end = b; } }
    out[job] = { aiMin: Math.round(total / 60_000), asks: asks[job] || 0, done: done[job] || 0 };
  }
  return out;
}

/** A card is measured only when the board shows a full cycle: at least this many agent hand-backs (non-lead "done"). */
export const MIN_HANDBACKS = 2;

/** Per card of the sprint: manual hours (estimate) vs AI hours (board). Totals only over cards with both. */
export function effort(cards, assessment, board) {
  const est = new Map(assessment.map((a) => [a.key, a]));
  const rows = cards.map((key) => {
    const a = est.get(key), raw = board[key];
    const b = raw && raw.done >= MIN_HANDBACKS ? raw : null; // a card worked in a chat that did not update the board is not measured
    return { key, tc: a?.tc ?? null, manualH: a ? a.hours : null, aiH: b ? Math.round((b.aiMin / 60) * 10) / 10 : null, asks: b ? b.asks : null, partial: !!raw && !b };
  });
  const listed = rows.filter((r) => r.manualH != null || r.aiH != null || r.partial); // carry-overs with no data are left out
  const both = listed.filter((r) => r.manualH != null && r.aiH != null);
  const sum = (k) => Math.round(both.reduce((s, r) => s + r[k], 0) * 10) / 10;
  return { cards: listed, total: { cards: both.length, manualH: sum('manualH'), aiH: sum('aiH'), savedH: Math.round((sum('manualH') - sum('aiH')) * 10) / 10, asks: both.reduce((s, r) => s + r.asks, 0) } };
}

/** One line per agent: { name, what } from the frontmatter of .claude/agents/*.md ({ fileName: text }). */
export function capabilities(files) {
  const out = [];
  for (const text of Object.values(files)) {
    const fm = String(text).match(/^---\n([\s\S]*?)\n---/)?.[1] || '';
    const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim(), what = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (name && what) out.push({ name, what });
  }
  return out;
}

// ---- readers (used by sprint-metrics.mjs)
const readText = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
export const readAssessment = (work, sprint) => parseAssessment(readText(path.join(work, `SPRINT${sprint}`, 'assessment.md')) || '');
export function readEvents(file) {
  const out = [];
  for (const l of (readText(file) || '').split('\n')) { if (!l.trim()) continue; try { out.push(JSON.parse(l)); } catch { /* skip a broken line */ } }
  return out;
}
export function readAgents(dir) {
  const files = {};
  try { for (const f of fs.readdirSync(dir)) if (f.endsWith('.md')) files[f] = readText(path.join(dir, f)); } catch { /* no agents dir */ }
  return capabilities(files);
}

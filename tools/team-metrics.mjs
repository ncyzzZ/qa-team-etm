// team-metrics.mjs - questions to the user, wait for answers and run rounds, before and after a change. Reads .claude/team/events.jsonl only.
//   node tools/team-metrics.mjs [--cutoff 2026-11-24T22:45:49+07:00] [--events <file>] [--json]
// Default cutoff: commit 5aee0ca (standing approvals). A run = an evidence-report link on the board (run-card posts one per run).
// An ask is answered by the first board answer or chat answer (`team.mjs answered`) of the same card after it; `clear` closes it unanswered.
import { isKey } from './profile.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_CUTOFF = '2026-11-24T22:45:49+07:00';
const IGNORE = /^ZZ-/;

export function readEvents(file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(e => e && e.t && !IGNORE.test(e.job || ''));
}
// what a question is about (first match wins); 'run' and 'heal' are the ones standing approvals 1 and 4 meant to remove
export const TOPICS = [
  ['delete', /ลบ|delete|reset .*ข้อมูล|reset --apply/i],
  ['active-plan', /active/i],
  ['defect', /log defect|defect/i],
  ['push', /push|xray|test run|ใส่ผล/i],
  ['heal', /heal|แก้ script|แก้ selector|locator/i],
  ['run', /รัน|run|manual-runner/i],
  ['decide', /ตัดสิน|จะถือ|ทำอย่างไร|ทำยังไง|ยึดค่าไหน|ที่ไหน/i],
  ['jira', /jira|แนบ|comment/i],
];
export const topic = text => (TOPICS.find(([, re]) => re.test(text || '')) || ['other'])[0];
const median = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

// one record per ask: how it ended and after how many minutes
export function asks(events) {
  const out = [];
  events.forEach((e, i) => {
    if (e.type !== 'ask') return;
    let end = { how: 'open', t: null };
    for (let j = i + 1; j < events.length; j++) {
      const f = events[j]; if (f.job !== e.job) continue;
      if (f.type === 'answer' && (!f.askAt || f.askAt === e.t)) { end = { how: 'board', t: f.t }; break; }
      if (f.type === 'chat') { end = { how: 'chat', t: f.t }; break; }
      if (f.type === 'clear' || f.type === 'close') { end = { how: 'cleared', t: f.t }; break; }
      if (f.type === 'ask') { end = { how: 'replaced', t: f.t }; break; }
    }
    out.push({ t: e.t, job: e.job, kind: e.kind, topic: topic(e.text), how: end.how, waitMin: end.t && (end.how === 'board' || end.how === 'chat') ? (end.t - e.t) / 60000 : null });
  });
  return out;
}

export function summary(events, from, to) {
  const ev = events.filter(e => e.t >= from && e.t < to);
  const a = asks(events).filter(x => x.t >= from && x.t < to);
  const runs = ev.filter(e => e.type === 'link' && e.kind === 'report');
  const cards = new Set(ev.filter(e => isKey(e.job || '')).map(e => e.job));
  const hours = new Set(ev.map(e => Math.floor(e.t / 3600000))).size;
  const waits = a.map(x => x.waitMin).filter(x => x != null);
  const runsBy = {}; for (const r of runs) runsBy[r.job] = (runsBy[r.job] || 0) + 1;
  const asksBy = {}; for (const x of a) asksBy[x.job] = (asksBy[x.job] || 0) + 1;
  return {
    events: ev.length, activeHours: hours, cards: cards.size,
    asks: a.length, approveAsks: a.filter(x => x.kind === 'approve').length,
    asksPerActiveHour: hours ? +(a.length / hours).toFixed(2) : null,
    asksPerCard: cards.size ? +(a.filter(x => isKey(x.job)).length / cards.size).toFixed(2) : null,
    answered: { board: a.filter(x => x.how === 'board').length, chat: a.filter(x => x.how === 'chat').length, cleared: a.filter(x => x.how === 'cleared').length, replaced: a.filter(x => x.how === 'replaced').length, open: a.filter(x => x.how === 'open').length },
    waitMedianMin: waits.length ? +median(waits).toFixed(1) : null, waitP75Min: waits.length ? +pct(waits, 0.75).toFixed(1) : null,
    runs: runs.length, runsPerCard: Object.keys(runsBy).length ? +(runs.length / Object.keys(runsBy).length).toFixed(2) : null,
    runsPerActiveHour: hours ? +(runs.length / hours).toFixed(2) : null,
    topics: a.reduce((m, x) => ((m[x.topic] = (m[x.topic] || 0) + 1), m), {}),
    topRunCards: Object.entries(runsBy).sort((x, y) => y[1] - x[1]).slice(0, 5),
    topAskCards: Object.entries(asksBy).sort((x, y) => y[1] - x[1]).slice(0, 5),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const opt = k => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
  const cutoff = Date.parse(opt('--cutoff') || DEFAULT_CUTOFF);
  const events = readEvents(opt('--events') || path.join(ROOT, '.claude', 'team', 'events.jsonl'));
  if (!events.length || isNaN(cutoff)) { console.error('No events or a bad --cutoff'); process.exit(2); }
  const first = events[0].t, last = events[events.length - 1].t + 1;
  const before = summary(events, first, cutoff), after = summary(events, cutoff, last);
  if (args.includes('--json')) { console.log(JSON.stringify({ cutoff: new Date(cutoff).toISOString(), before, after }, null, 2)); process.exit(0); }
  const d = t => new Date(t + 7 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
  console.log(`Before: ${d(first)} to ${d(cutoff)} (Thai time)   After: ${d(cutoff)} to ${d(last)}`);
  const rows = [['active hours', 'activeHours'], ['cards worked', 'cards'], ['questions (ask)', 'asks'], ['  of them approvals', 'approveAsks'], ['questions per active hour', 'asksPerActiveHour'], ['questions per card', 'asksPerCard'], ['wait, median (min)', 'waitMedianMin'], ['wait, 75% (min)', 'waitP75Min'], ['runs (evidence reports)', 'runs'], ['runs per card', 'runsPerCard'], ['runs per active hour', 'runsPerActiveHour']];
  console.log('| Measure | Before | After |\n|---|---|---|');
  for (const [l, k] of rows) console.log(`| ${l} | ${before[k] ?? '-'} | ${after[k] ?? '-'} |`);
  const how = s => Object.entries(s.answered).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`| how questions ended | ${how(before)} | ${how(after)} |`);
  const tp = s => Object.entries(s.topics).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`| questions by topic | ${tp(before)} | ${tp(after)} |`);
  console.log(`| most runs | ${before.topRunCards.map(x => x.join(' ')).join(', ')} | ${after.topRunCards.map(x => x.join(' ')).join(', ')} |`);
  console.log(`| most questions | ${before.topAskCards.map(x => x.join(' ')).join(', ')} | ${after.topAskCards.map(x => x.join(' ')).join(', ')} |`);
}

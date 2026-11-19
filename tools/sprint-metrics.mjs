#!/usr/bin/env node
// sprint-metrics.mjs - per-sprint defect trend and early findings, for the manager. Zero dependencies, no network.
//
//   node tools/sprint-metrics.mjs [--work <dir>] [--out <file.html>] [--marker <first measured sprint>]
//
// Reads <work>/SPRINT<N>/jira.json (saved by the lead from JQL) and <work>/<KEY>/findings.json (one per card).
// Writes one self-contained HTML report (default <work>/SPRINT<latest>/metrics.html) and prints a short summary.
// Found in QA = issue type Defect; escaped to UAT/PROD = Bug. "Stopped before code" = ac-changed + dev-fixed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BEFORE_DEV = ['open', 'refinement', 'ready', 'ready for development', 'to do', 'backlog'];
const STOPPED = ['ac-changed', 'dev-fixed'];

export function loadSprints(work, errors = []) {
  const out = [];
  for (const d of fs.existsSync(work) ? fs.readdirSync(work) : []) {
    const m = d.match(/^SPRINT(\d+)$/i); if (!m) continue;
    const f = path.join(work, d, 'jira.json'); if (!fs.existsSync(f)) continue;
    try {
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      out.push({ sprint: Number(j.sprint ?? m[1]), name: j.name || `Sprint ${m[1]}`, stories: [...new Set(j.stories || [])], defects: j.defects || [], frozen: !!j.frozen, fetched: j.fetched || '', active: j.state === 'active' });
    } catch (e) { errors.push(`${f}: ${e.message}`); }
  }
  return out.sort((a, b) => a.sprint - b.sprint);
}

export function loadFindings(work, errors = []) {
  const out = {};
  for (const d of fs.existsSync(work) ? fs.readdirSync(work) : []) {
    if (!/^ETM-\d+$/.test(d)) continue;
    const f = path.join(work, d, 'findings.json'); if (!fs.existsSync(f)) continue;
    try { out[d] = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { errors.push(`${f}: ${e.message}`); }
  }
  return out;
}

// a card's findings belong to the first sprint that lists the card (where it was read), so a carry-over
// does not move baseline findings into a later, measured sprint
export function assignFindings(sprints, findings) {
  const by = new Map(sprints.map((s) => [s.sprint, []])), unassigned = [];
  for (const [key, list] of Object.entries(findings)) {
    const s = sprints.find((x) => x.stories.includes(key));
    if (s) by.get(s.sprint).push(...list.map((f) => ({ ...f, card: key }))); else unassigned.push(key);
  }
  return { by, unassigned };
}

export function computeMetrics(sprints, findings) {
  const { by, unassigned } = assignFindings(sprints, findings);
  const rows = sprints.map((s) => {
    const list = by.get(s.sprint), has = list.length > 0;
    const n = (fn) => (has ? list.filter(fn).length : null);
    const defects = s.defects.filter((d) => d.type === 'Defect').length;
    return {
      sprint: s.sprint, name: s.name, active: s.active, stories: s.stories.length,
      defects, defectsPerStory: s.stories.length ? defects / s.stories.length : null,
      bugs: s.defects.filter((d) => d.type === 'Bug').length,
      raised: has ? list.length : null,
      before: n((f) => BEFORE_DEV.includes(String(f.story_status || '').toLowerCase())),
      after: n((f) => !BEFORE_DEV.includes(String(f.story_status || '').toLowerCase())),
      stopped: n((f) => STOPPED.includes(f.outcome)),
      confirmed: n((f) => f.outcome === 'confirmed'),
      ignored: n((f) => f.outcome === 'ignored'),
      open: n((f) => f.outcome === 'open'),
      laterDefect: n((f) => !!f.later_defect),
      backfilled: n((f) => !!f.backfilled),
      kinds: has ? count(list.map((f) => f.kind)) : {},
    };
  });
  return { rows, unassigned };
}

const count = (a) => a.reduce((o, k) => ((o[k] = (o[k] || 0) + 1), o), {});
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (v, d = 0) => (v == null ? '-' : Number(v).toFixed(d));

function lineChart(rows, key, title, marker, digits) {
  const W = 640, H = 220, L = 44, R = 16, T = 16, B = 34;
  const pts = rows.map((r, i) => ({ x: L + (rows.length > 1 ? (i * (W - L - R)) / (rows.length - 1) : (W - L - R) / 2), v: r[key], s: r.sprint, a: r.active }));
  const max = Math.max(1, ...pts.filter((p) => p.v != null).map((p) => p.v)) * 1.15;
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, max / 2, max].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" class="tick" text-anchor="end">${v.toFixed(digits)}</text>`).join('');
  const segs = []; let cur = [];
  for (const p of pts) { if (p.v == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(p); }
  if (cur.length) segs.push(cur);
  const lines = segs.map((s) => `<polyline class="line" points="${s.map((p) => `${p.x},${y(p.v)}`).join(' ')}"/>`).join('');
  const dots = pts.filter((p) => p.v != null).map((p) => `<circle cx="${p.x}" cy="${y(p.v)}" r="4" class="dot"><title>Sprint ${p.s}: ${p.v.toFixed(digits)}</title></circle><text x="${p.x}" y="${y(p.v) - 9}" class="val" text-anchor="middle">${p.v.toFixed(digits)}</text>`).join('');
  const xl = pts.map((p) => `<text x="${p.x}" y="${H - 10}" class="tick" text-anchor="middle">S${p.s}${p.a ? "*" : ""}</text>`).join('');
  const mi = pts.findIndex((p) => p.s === marker);
  const mk = mi > 0 ? (() => { const mx = (pts[mi - 1].x + pts[mi].x) / 2; return `<line x1="${mx}" x2="${mx}" y1="${T}" y2="${H - B}" class="marker"/><text x="${mx + 4}" y="${T + 10}" class="mtext">AI อ่านก่อน dev</text>`; })() : '';
  return `<figure><figcaption>${esc(title)}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">${ticks}${mk}${lines}${dots}${xl}</svg></figure>`;
}

// headline tiles: the last finished sprint (an active sprint's numbers are not complete yet)
export const headline = (rows) => [...rows].reverse().find((r) => !r.active) || rows[rows.length - 1] || {};

function html(rows, marker, unassigned) {
  const last = headline(rows);
  const body = rows.map((r) => `<tr${r.sprint === marker ? ' class="first"' : ''}><td>Sprint ${r.sprint}${r.active ? ' *' : ''}</td><td>${r.stories}</td><td>${r.defects}</td><td>${fmt(r.defectsPerStory, 2)}</td><td>${r.bugs}</td><td>${fmt(r.raised)}</td><td>${fmt(r.before)} / ${fmt(r.after)}</td><td><b>${fmt(r.stopped)}</b></td><td>${fmt(r.confirmed)}</td><td>${fmt(r.ignored)}</td><td>${fmt(r.laterDefect)}</td><td>${fmt(r.backfilled)}</td></tr>`).join('');
  const kinds = count(rows.flatMap((r) => Object.entries(r.kinds).flatMap(([k, n]) => Array(n).fill(k))));
  const kindTxt = Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ') || '-';
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ETM QA Sprint Report</title><style>
:root{--bg:#fff;--fg:#1f2328;--mut:#656d76;--line:#0b6bcb;--grid:#e5e7eb;--mark:#c2410c;--card:#f6f8fa;--hi:#fff7ed}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--line:#4c9aff;--grid:#30363d;--mark:#fb923c;--card:#161b22;--hi:#2a1d10}}
:root[data-theme="dark"]{--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--line:#4c9aff;--grid:#30363d;--mark:#fb923c;--card:#161b22;--hi:#2a1d10}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Noto Sans Thai",sans-serif}
main{max-width:960px;margin:0 auto;padding:24px 16px}h1{font-size:22px;margin:0 0 4px}.sub{color:var(--mut);margin:0 0 20px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:20px}
.kpi{background:var(--card);border-radius:8px;padding:12px}.kpi b{display:block;font-size:24px}.kpi span{color:var(--mut);font-size:13px}
.charts{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}figure{margin:0;background:var(--card);border-radius:8px;padding:12px}
figcaption{font-weight:600;margin-bottom:6px}svg{width:100%;height:auto}.grid{stroke:var(--grid)}.tick{fill:var(--mut);font-size:11px}
.line{fill:none;stroke:var(--line);stroke-width:2.5}.dot{fill:var(--line)}.val{fill:var(--fg);font-size:11px}
.marker{stroke:var(--mark);stroke-dasharray:4 4;stroke-width:1.5}.mtext{fill:var(--mark);font-size:11px}
.tw{overflow-x:auto;margin-top:20px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{padding:6px 8px;border-bottom:1px solid var(--grid);text-align:right;white-space:nowrap}
th:first-child,td:first-child{text-align:left}tr.first td{background:var(--hi)}.note{background:var(--card);border-radius:8px;padding:12px 16px;margin-top:20px;font-size:14px}.note li{margin:4px 0}
</style></head><body><main>
<h1>ETM QA: defect ต่อ sprint และปัญหาที่กันได้ก่อนเขียนโค้ด</h1>
<p class="sub">Sprint ${rows[0]?.sprint ?? '-'} ถึง ${last.sprint ?? '-'} · ทีม AI อ่านการ์ดก่อน dev เริ่มตั้งแต่ Sprint ${marker} · สร้างเมื่อ ${new Date().toISOString().slice(0, 10)}</p>
<div class="kpis">
<div class="kpi"><b>${fmt(last.defectsPerStory, 2)}</b><span>Defect (QA) ต่อ Story · Sprint ${last.sprint ?? '-'}</span></div>
<div class="kpi"><b>${last.bugs ?? '-'}</b><span>Bug ที่หลุดถึง UAT/PROD · Sprint ${last.sprint ?? '-'}</span></div>
<div class="kpi"><b>${fmt(rows.reduce((s, r) => s + (r.stopped || 0), 0))}</b><span>ปัญหาที่กันได้ก่อนเขียนโค้ด (รวม)</span></div>
<div class="kpi"><b>${fmt(rows.reduce((s, r) => s + (r.raised || 0), 0))}</b><span>ข้อที่ทีมยกขึ้นตอนอ่านการ์ด (รวม)</span></div>
</div>
<div class="charts">${lineChart(rows, 'defectsPerStory', 'Defect ที่เจอใน QA ต่อ Story', marker, 2)}${lineChart(rows, 'bugs', 'Bug ที่หลุดไป UAT/PROD', marker, 0)}</div>
<div class="tw"><table><thead><tr><th>Sprint</th><th>Story</th><th>Defect</th><th>Defect/Story</th><th>Bug</th><th>ข้อที่ยก</th><th>ก่อน / หลัง dev</th><th>กันได้</th><th>ยืนยันเดิม</th><th>ไม่มีคนตอบ</th><th>เตือนแล้วยังเกิด</th><th>เติมย้อนหลัง</th></tr></thead><tbody>${body}</tbody></table></div>
<p class="sub" style="margin-top:8px">ประเภทข้อที่ยก: ${esc(kindTxt)}${unassigned.length ? ` · การ์ดที่ไม่อยู่ใน sprint ใด: ${esc(unassigned.join(', '))}` : ''}</p>
<div class="note"><b>วิธีอ่าน</b><ul>
<li><b>Defect</b> = issue type Defect (เจอใน QA) · <b>Bug</b> = issue type Bug (หลุดไป UAT/PROD) · นับตาม Sprint ของ defect เอง หารด้วยจำนวน Story ใน sprint นั้น (Story ที่ยกข้าม sprint นับทุก sprint)</li>
<li><b>กันได้</b> = BA แก้/เพิ่ม AC หรือ dev แก้ก่อนส่ง QA เพราะข้อที่ทีมยก · <b>ยืนยันเดิม</b> = BA ยืนยันพฤติกรรมเดิม ไม่นับว่ากันได้</li>
<li><b>ก่อน / หลัง dev</b> = สถานะ Story ตอนที่ยกข้อนั้น · <b>เตือนแล้วยังเกิด</b> = defect ที่ทีมเคยเตือนไว้แต่ไม่ได้แก้</li>
<li><b>เติมย้อนหลัง</b> = ข้อของการ์ดที่บันทึกหลังเหตุการณ์ (Sprint 26)</li>
${rows.some((r) => r.active) ? `<li><b>*</b> = sprint ที่ยังไม่จบ ตัวเลข defect ยังไม่ครบ ห้ามเทียบกับ sprint ที่จบแล้ว</li>` : ''}
<li><b>สิ่งที่ตัวเลขนี้ไม่ได้พิสูจน์</b>: ความยากและขนาดงานแต่ละ sprint ต่างกัน · การเทสที่ดีขึ้นอาจทำให้ Defect ใน QA เพิ่มขึ้นในขณะที่ Bug ที่หลุดลดลง จึงแสดงทั้งสองเส้น · "-" คือไม่มีข้อมูล ไม่ใช่ศูนย์</li>
</ul></div></main></body></html>`;
}

function main() {
  const argv = process.argv.slice(2), opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
  const work = path.resolve(opt('--work', path.join(ROOT, 'work')));
  const errors = [], sprints = loadSprints(work, errors), findings = loadFindings(work, errors);
  if (!sprints.length) errors.push(`no SPRINT<N>/jira.json found in ${work}`);
  const { rows, unassigned } = computeMetrics(sprints, findings);
  const marker = Number(opt('--marker', 27));
  const last = sprints[sprints.length - 1];
  const out = path.resolve(opt('--out', last ? path.join(work, `SPRINT${last.sprint}`, 'metrics.html') : path.join(work, 'metrics.html')));
  if (sprints.length) fs.writeFileSync(out, html(rows, marker, unassigned));
  const sum = (k) => rows.reduce((s, r) => s + (r[k] || 0), 0);
  console.log(`[sprint-metrics] sprints ${sprints[0]?.sprint ?? '-'}-${last?.sprint ?? '-'}, ${sum('stories')} stories, ${sum('defects')} defects, ${sum('bugs')} bugs, ${sum('stopped')} stopped before code`);
  for (const r of rows) console.log(`  S${r.sprint}${r.active ? ' (in progress)' : ''}: ${r.stories} stories, defect/story ${fmt(r.defectsPerStory, 2)}, bugs ${r.bugs}, findings ${fmt(r.raised)} (stopped ${fmt(r.stopped)}, before dev ${fmt(r.before)})`);
  console.log(`  headline sprint: S${headline(rows).sprint ?? '-'}`);
  console.log(`  unassigned: ${unassigned.length}${unassigned.length ? ` (${unassigned.join(', ')})` : ''}`);
  if (sprints.length) console.log(`  report: ${path.relative(process.cwd(), out)}`);
  for (const e of errors) console.log(`  ERR  ${e}`);
  console.log(`[sprint-metrics check] ${errors.length} error(s)`);
  process.exit(errors.length ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

#!/usr/bin/env node
// sprint-metrics.mjs - per-sprint defect trend and early findings, for the manager. Zero dependencies, no network.
//
//   node tools/sprint-metrics.mjs [--work <dir>] [--out <file.html>] [--marker <first measured sprint>]
//
// Reads <work>/SPRINT<N>/jira.json (saved by the lead from JQL) and <work>/<KEY>/findings.json (one per card).
// Writes one self-contained HTML report (default <work>/SPRINT<latest>/metrics.html) and prints a short summary.
// Found in QA = issue type Defect; escaped to UAT/PROD = Bug. "Stopped before code" = ac-changed + dev-fixed.
import { isKey } from './profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarize as healSummary } from './heal/heal-log.mjs';
import { resolveRepos } from './heal/config.mjs';
import { defectChange, readAssessment, readEvents, boardTime, effort, readAgents } from './sprint-report.mjs';

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
    if (!isKey(d)) continue;
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
  const mk = mi > 0 ? (() => { const mx = (pts[mi - 1].x + pts[mi].x) / 2; return `<line x1="${mx}" x2="${mx}" y1="${T}" y2="${H - B}" class="marker"/><text x="${mx + 4}" y="${T + 10}" class="mtext"><tspan class="th">AI อ่านก่อน dev</tspan><tspan class="en">AI reads before dev</tspan></text>`; })() : '';
  return `<figure><figcaption>${tx(esc(title.th), esc(title.en))}</figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title.en)}">${ticks}${mk}${lines}${dots}${xl}</svg></figure>`;
}

// headline tiles: the last finished sprint (an active sprint's numbers are not complete yet)
// ---- quality of the AI agent's scripts: proven rate (tools/run-card.mjs -> .claude/team/quality.jsonl, latest run per card)
// and AC strength (work/<KEY>/ac-strength.json, written by the test-reviewer at card close) ----
export function scriptQuality(sprints, work, qualityFile) {
  const latest = new Map();
  try {
    for (const l of fs.readFileSync(qualityFile, 'utf8').split('\n').filter(Boolean)) {
      const q = JSON.parse(l); if (q.source === 'manual-agent') continue; // manual runner runs are counted apart (provenManual), not as the card's script run
      if (!latest.has(q.card) || latest.get(q.card).t < q.t) latest.set(q.card, q);
    }
  } catch { /* no runs yet */ }
  return sprints.map((s) => {
    const runs = s.stories.map((k) => latest.get(k)).filter(Boolean);
    const sum = (f) => runs.reduce((n, q) => n + (q[f] || 0), 0);
    const ac = { total: 0, proven: 0, provenManual: 0, strong: 0, weak: 0, blocked: 0, none: 0, cards: 0 };
    for (const k of s.stories) {
      try {
        const j = JSON.parse(fs.readFileSync(path.join(work, k, 'ac-strength.json'), 'utf8')); ac.cards++;
        let rr = null; try { rr = JSON.parse(fs.readFileSync(path.join(work, k, 'run-results.json'), 'utf8')).tests || null; } catch { /* never run */ }
        for (const a of j.ac || []) {
          ac.total++; if (a.rating in ac) ac[a.rating]++;
          // proven = strong AND every test passed in the latest run (same rule as qa-check strength)
          if (a.rating === 'strong' && rr && (a.tests || []).length && a.tests.every((t) => rr[t]?.status === 'passed')) {
            ac.proven++;
            // proven with a run of the manual runner (browser agent, every step confirmed by a person): shown apart
            if (a.tests.some((t) => rr[t]?.source === 'manual-agent')) ac.provenManual++;
          }
        }
      } catch { /* not reviewed */ }
    }
    const ran = sum('ran');
    return { sprint: s.sprint, active: s.active, cardsRun: runs.length, ran, passed: sum('passed'), failed: sum('failed') + sum('flaky'), notProven: sum('notProven'), fixme: sum('fixme'), precondition: sum('precondition'), provenRate: ran ? sum('passed') / ran : null, ac };
  });
}

export const headline = (rows) => [...rows].reverse().find((r) => !r.active) || rows[rows.length - 1] || {};

/** Text in both languages; the page shows one (button TH / EN at the top). */
const tx = (th, en) => `<span class="th">${th}</span><span class="en">${en}</span>`;
const AGENT_TH = {
  'ba-analyst': 'อ่าน Story, AC และ [QA] subtask ก่อนทุกการ์ด แล้วลิสต์จุดที่ไม่ชัดให้ BA',
  'ux-inspector': 'อ่าน Figma ทุกสถานะของหน้าจอ หาจุดที่ design กับ AC ไม่ตรงกัน',
  'test-designer': 'ออกแบบและเขียน test case ทั้ง manual และพร้อมทำ automation จาก Story และข้อที่พบ',
  'test-reviewer': 'ตรวจ draft TC ว่าครอบคลุมและชัด ส่งกลับถ้ายังไม่ดีพอ',
  'automation-engineer': 'คัด TC ที่ทำ Playwright ได้ เขียน spec, security check และคำสั่งรัน',
  'evidence-reporter': 'สร้าง evidence report HTML จากผลรัน และสรุปผลสั้น ๆ',
  'jira-xray-logger': 'push test ขึ้น Xray, ตั้ง Test Plan / Execution, log defect และปิดงาน หลังคนอนุมัติเท่านั้น',
  'playwright-healer': 'เปิดหน้าจริงหา locator ใหม่เมื่อหาจากโค้ด FE ไม่เจอ เสนอเท่านั้น ไม่แก้ไฟล์เอง',
};

const sign = (v) => (v == null ? '-' : `${v > 0 ? '+' : ''}${Math.round(v)}%`);

/** AI value section: AC coverage, defect change, effort (method A), what the AI team does. */
function valueHtml({ rows, quality, change, eff, effSprint, agents }) {
  const q = [...quality].reverse().find((x) => x.ac.total) || null;
  const cov = q ? { total: q.ac.total, covered: q.ac.total - q.ac.none, strong: q.ac.strong, proven: q.ac.proven, sprint: q.sprint } : null;
  const pc = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '-');
  const ch = change.map((c) => `<tr><td>Sprint ${c.sprint}${c.provisional ? ' *' : ''}</td><td>${c.prevSprint ? `Sprint ${c.prevSprint}` : '-'}</td><td><b>${sign(c.defectPct)}</b></td><td><b>${sign(c.bugPct)}</b></td></tr>`).join('');
  const effRows = eff ? eff.cards.map((c) => `<tr><td>${esc(c.key)}</td><td>${fmt(c.tc)}</td><td>${fmt(c.manualH, 1)}</td><td>${c.partial ? tx('board ไม่ครบ', 'not on board') : fmt(c.aiH, 1)}</td><td>${c.manualH != null && c.aiH != null ? fmt(c.manualH - c.aiH, 1) : '-'}</td><td>${fmt(c.asks)}</td></tr>`).join('') : '';
  return `<h2 style="font-size:17px;margin:28px 0 4px">${tx(`AI ช่วยได้แค่ไหน`, `What the AI team delivers`)}</h2>
<div class="kpis" style="margin-top:8px">
<div class="kpi"><b>${cov ? pc(cov.covered, cov.total) : '-'}</b><span>${tx(`AC ที่มี TC ครอบคลุม`, `AC covered by a test case`)} · Sprint ${cov?.sprint ?? '-'} (${cov ? `${cov.covered}/${cov.total}` : '-'})</span></div>
<div class="kpi"><b>${cov ? pc(cov.proven, cov.total) : '-'}</b><span>${tx(`AC ที่พิสูจน์แล้วด้วยการรันจริง`, `AC proven by a real run`)} (${cov ? `${cov.proven}/${cov.total}` : '-'})</span></div>
<div class="kpi"><b>${eff && eff.total.cards ? `${fmt(eff.total.savedH, 1)} ${tx('ชม.', 'h')}` : '-'}</b><span>${tx(`เวลาที่ลดได้ (ประมาณ)`, `Time saved (estimate)`)} · ${eff ? `${eff.total.cards} ${tx('การ์ด', 'cards')}, Sprint ${effSprint}` : '-'}</span></div>
<div class="kpi"><b>${eff && eff.total.manualH ? pc(eff.total.savedH, eff.total.manualH) : '-'}</b><span>${tx(`งานทำมือที่ลดลง เทียบกับประมาณการทำมือ`, `Manual effort removed, vs the manual estimate`)}</span></div>
</div>
<h3 style="font-size:15px;margin:16px 0 4px">${tx(`1. Coverage: TC ของ AI ครอบคลุม AC เท่าไร`, `1. Coverage: how much of the AC the AI's test cases cover`)}</h3>
<p class="sub" style="margin:0">${tx(`ครอบคลุม = AC ที่มี TC อย่างน้อย 1 ข้อ (จาก ac-strength.json ของแต่ละการ์ด) · strong = TC ตรวจสิ่งที่ AC บอกครบ (อ่านจากโค้ด) · พิสูจน์แล้ว = strong และ test ผ่านในการรันล่าสุด`, `Covered = AC with at least one test case (ac-strength.json of each card) · strong = the test checks everything the AC says (read from the code) · proven = strong and its tests passed in the latest run`)}</p>
<div class="tw" style="margin-top:8px"><table><thead><tr><th>Sprint</th><th>${tx(`AC ทั้งหมด`, `AC total`)}</th><th>${tx(`มี TC`, `With TC`)}</th><th>strong</th><th>${tx(`พิสูจน์แล้ว`, `Proven`)}</th><th>${tx(`% มี TC`, `% with TC`)}</th><th>${tx(`% พิสูจน์แล้ว`, `% proven`)}</th></tr></thead><tbody>
${quality.filter((x) => x.ac.total).map((x) => `<tr><td>Sprint ${x.sprint}${x.active ? ' *' : ''}</td><td>${x.ac.total}</td><td>${x.ac.total - x.ac.none}</td><td>${x.ac.strong}</td><td>${x.ac.proven}</td><td><b>${pc(x.ac.total - x.ac.none, x.ac.total)}</b></td><td><b>${pc(x.ac.proven, x.ac.total)}</b></td></tr>`).join('') || `<tr><td colspan="7">${tx('ยังไม่มี ac-strength.json', 'no ac-strength.json yet')}</td></tr>`}
</tbody></table></div>
<h3 style="font-size:15px;margin:16px 0 4px">${tx(`2. Defect เทียบ sprint ก่อน`, `2. Defects vs the previous sprint`)}</h3>
<p class="sub" style="margin:0">${tx(`เทียบกับ sprint ก่อนหน้าที่ปิดแล้ว · ติดลบ = ลดลง · Defect = เจอตอน QA test · Bug = หลุดไป UAT/Prod`, `Compared with the previous closed sprint · negative = fewer · Defect = found in QA testing · Bug = escaped to UAT/Prod`)}</p>
<div class="tw" style="margin-top:8px"><table><thead><tr><th>Sprint</th><th>${tx(`เทียบกับ`, `Compared with`)}</th><th>Defect/Story</th><th>Bug UAT/Prod</th></tr></thead><tbody>${ch}</tbody></table></div>
<h3 style="font-size:15px;margin:16px 0 4px">${tx(`3. เวลาและงานทำมือ`, `3. Time and manual effort`)} (Sprint ${effSprint ?? '-'})</h3>
<p class="sub" style="margin:0">${tx(`ทำมือ = ชั่วโมงที่ lead ประมาณไว้ใน assessment.md (ออกแบบ + รัน โดยคนเดียว ไม่ใช้ AI) · AI = เวลาที่ board แสดงว่า agent กำลังทำงานกับการ์ดนั้น (ช่วงที่ค้างสถานะนานเกิน 45 นาทีตัดเหลือ 45) · ลดได้ = ทำมือ - AI โดยนับว่าคนคุมงานตลอดเวลาที่ AI ทำ จึงเป็นตัวเลขฝั่งระวัง · ถามคน = จำนวนครั้งที่ต้องให้คนตัดสินใจ · <b>board ไม่ครบ</b> = การ์ดที่ทำในแชทที่ไม่ได้อัปเดต board จึงไม่นับรวม (นับเฉพาะการ์ดที่มี agent ส่งงานคืนอย่างน้อย 2 ครั้ง)`, `Manual = hours the lead estimated in assessment.md (design + run by one tester, no AI) · AI = time the board shows an agent working on the card (a status left longer than 45 min is cut to 45) · Saved = manual - AI, counting the person as supervising all the AI time, so the number is on the safe side · Asked user = decisions a person had to make · <b>not on board</b> = cards worked in a chat that did not update the board, left out (only cards with at least 2 agent hand-backs count)`)}</p>
${eff ? `<div class="tw" style="margin-top:8px"><table><thead><tr><th>${tx(`การ์ด`, `Card`)}</th><th>~TC</th><th>${tx(`ทำมือ (ชม.)`, `Manual (h)`)}</th><th>${tx(`AI (ชม.)`, `AI (h)`)}</th><th>${tx(`ลดได้ (ชม.)`, `Saved (h)`)}</th><th>${tx(`ถามคน`, `Asked user`)}</th></tr></thead><tbody>${effRows}
<tr><td><b>${tx(`รวม (การ์ดที่มีครบ ${eff.total.cards})`, `Total (${eff.total.cards} cards with both)`)}</b></td><td></td><td><b>${fmt(eff.total.manualH, 1)}</b></td><td><b>${fmt(eff.total.aiH, 1)}</b></td><td><b>${fmt(eff.total.savedH, 1)}</b></td><td><b>${eff.total.asks}</b></td></tr></tbody></table></div>` : `<p class="sub">${tx('ยังไม่มี assessment.md ของ sprint นี้', 'no assessment.md for this sprint')}</p>`}
<h3 style="font-size:15px;margin:16px 0 4px">${tx(`4. AI team ทำอะไรได้บ้าง`, `4. What the AI team can do`)}</h3>
<div class="note" style="margin-top:8px"><ul>
${agents.map((a) => `<li><b>${esc(a.name)}</b>: ${tx(esc(AGENT_TH[a.name] || a.what), esc(a.what.split('. ').slice(0, 2).join('. ')))}</li>`).join('')}
<li><b>Quality gates</b> (tools/qa-check.mjs): ${tx(`ตรวจ draft TC, spec, coverage, AC strength, state.json ทุก phase · กัน test ที่ขึ้นเขียวโดยไม่ได้ตรวจ (false pass) · push ขึ้น Xray เฉพาะผลที่ผ่านในการรันจริงพร้อมรูปทุก step`, `checks the draft TC, spec, coverage, AC strength and state.json at every phase · blocks tests that turn green without checking (false pass) · pushes to Xray only results that passed in a real run, with a picture for every step`)}</li>
<li><b>Self-healing</b> (tools/heal/): ${tx(`อ่านโค้ด FE ของ dev หา locator ที่เปลี่ยน ก่อนรันและหลัง fail · คนอนุมัติทุกครั้งก่อนแก้`, `reads the developers' FE code to find changed locators, before a run and after a failure · a person approves every fix`)}</li>
<li><b>Evidence report</b> (tools/run-card.mjs): ${tx(`สร้าง report พร้อมรูปทุก step อัตโนมัติหลังรัน · แยกสาเหตุ fail (locator / data / env / assertion / flaky)`, `builds the report with a picture of every step after each run · sorts each failure by cause (locator / data / env / assertion / flaky)`)}</li>
<li><b>Human in the loop</b>: ${tx(`ทุกการเขียนลง Jira / Xray / ข้อมูล QA ต้องมีคนอนุมัติบน board หรือในแชท และบันทึกไว้ใน state.json`, `every write to Jira / Xray / QA data needs a person's approval on the board or in the chat, recorded in state.json`)}</li>
</ul></div>`;
}

function html(rows, marker, unassigned, quality = [], value = null) {
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
:root:not([data-lang="en"]) .en,:root[data-lang="en"] .th{display:none}
.lang{position:fixed;top:12px;right:16px;display:flex;gap:4px}.lang button{font:inherit;font-size:13px;padding:4px 10px;border:1px solid var(--grid);border-radius:6px;background:var(--card);color:var(--fg);cursor:pointer}.lang button[aria-pressed="true"]{border-color:var(--line);color:var(--line);font-weight:600}
</style></head><body><div class="lang"><button type="button" data-set="th">TH</button><button type="button" data-set="en">EN</button></div><main>
<h1>${tx(`ETM QA: defect ต่อ sprint และปัญหาที่กันได้ก่อนเขียนโค้ด`, `ETM QA: defects per sprint and problems stopped before code`)}</h1>
<p class="sub">Sprint ${rows[0]?.sprint ?? '-'} ${tx('ถึง', 'to')} ${last.sprint ?? '-'} · ${tx(`ทีม AI อ่านการ์ดก่อน dev เริ่มตั้งแต่`, `AI team reads cards before dev from`)} Sprint ${marker} · ${tx(`สร้างเมื่อ`, `generated`)} ${new Date().toISOString().slice(0, 10)}</p>
<div class="kpis">
<div class="kpi"><b>${fmt(last.defectsPerStory, 2)}</b><span>${tx(`Defect (QA) ต่อ Story`, `Defects (QA) per Story`)} · Sprint ${last.sprint ?? '-'}</span></div>
<div class="kpi"><b>${last.bugs ?? '-'}</b><span>${tx(`Bug ที่หลุดถึง UAT/PROD`, `Bugs escaped to UAT/PROD`)} · Sprint ${last.sprint ?? '-'}</span></div>
<div class="kpi"><b>${fmt(rows.reduce((s, r) => s + (r.stopped || 0), 0))}</b><span>${tx(`ปัญหาที่กันได้ก่อนเขียนโค้ด (รวม)`, `Problems stopped before code (total)`)}</span></div>
<div class="kpi"><b>${fmt(rows.reduce((s, r) => s + (r.raised || 0), 0))}</b><span>${tx(`ข้อที่ทีมยกขึ้นตอนอ่านการ์ด (รวม)`, `Points raised when reading cards (total)`)}</span></div>
</div>
<div class="charts">${lineChart(rows, 'defectsPerStory', { th: 'Defect ที่เจอใน QA ต่อ Story', en: 'Defects found in QA per Story' }, marker, 2)}${lineChart(rows, 'bugs', { th: 'Bug ที่หลุดไป UAT/PROD', en: 'Bugs escaped to UAT/PROD' }, marker, 0)}</div>
<div class="tw"><table><thead><tr><th>Sprint</th><th>Story</th><th>Defect</th><th>Defect/Story</th><th>Bug</th><th>${tx(`ข้อที่ยก`, `Raised`)}</th><th>${tx(`ก่อน / หลัง dev`, `Before / after dev`)}</th><th>${tx(`กันได้`, `Stopped`)}</th><th>${tx(`ยืนยันเดิม`, `Confirmed as is`)}</th><th>${tx(`ไม่มีคนตอบ`, `No answer`)}</th><th>${tx(`เตือนแล้วยังเกิด`, `Warned, still happened`)}</th><th>${tx(`เติมย้อนหลัง`, `Backfilled`)}</th></tr></thead><tbody>${body}</tbody></table></div>
<p class="sub" style="margin-top:8px">${tx(`ประเภทข้อที่ยก`, `Kinds raised`)}: ${esc(kindTxt)}${unassigned.length ? ` · ${tx('การ์ดที่ไม่อยู่ใน sprint ใด', 'cards in no sprint')}: ${esc(unassigned.join(', '))}` : ''}</p>
${value ? valueHtml({ rows, quality, ...value }) : ''}
${quality.some((q) => q.ran || q.ac.total) ? `<h2 style="font-size:17px;margin:24px 0 4px">${tx(`คุณภาพ script ของ AI agent`, `Quality of the AI agent's scripts`)}</h2>
<p class="sub" style="margin:0">${tx(`Proven = test ที่ผ่านจริงทุก step หารด้วย test ที่รัน (รอบล่าสุดของแต่ละการ์ด) · AC proven = AC ที่ strong และ test ของมันผ่านในการรันล่าสุด (ตัวเลข coverage หลัก) · strong = อ่านจากโค้ดเท่านั้น ยังไม่ใช่หลักฐาน`, `Proven = tests that really passed every step, over tests run (latest run of each card) · AC proven = AC that is strong and whose tests passed in the latest run (the main coverage number) · strong = read from the code only, not yet evidence`)}</p>
<div class="tw" style="margin-top:8px"><table><thead><tr><th>Sprint</th><th>${tx(`การ์ดที่รัน`, `Cards run`)}</th><th>Test</th><th>${tx(`ผ่าน`, `Passed`)}</th><th>Fail</th><th>${tx(`ไม่ได้พิสูจน์`, `Not proven`)}</th><th>Fixme</th><th>${tx(`ขาด .env/data`, `Missing .env/data`)}</th><th>Proven</th><th>${tx(`AC proven / ทั้งหมด`, `AC proven / total`)}</th><th>${tx(`พิสูจน์ด้วย browser agent`, `proven by browser agent`)}</th><th>${tx(`strong (อ่านโค้ด)`, `strong (read from code)`)}</th><th>weak / blocked / none</th></tr></thead><tbody>
${quality.map((q) => `<tr><td>Sprint ${q.sprint}${q.active ? ' *' : ''}</td><td>${q.cardsRun}</td><td>${q.ran}</td><td>${q.passed}</td><td>${q.failed}</td><td>${q.notProven}</td><td>${q.fixme}</td><td>${q.precondition}</td><td><b>${q.provenRate == null ? '-' : Math.round(q.provenRate * 100) + '%'}</b></td><td><b>${q.ac.total ? `${q.ac.proven} / ${q.ac.total}` : '-'}</b></td><td>${q.ac.total ? q.ac.provenManual : '-'}</td><td>${q.ac.total ? q.ac.strong : '-'}</td><td>${q.ac.total ? `${q.ac.weak} / ${q.ac.blocked} / ${q.ac.none}` : '-'}</td></tr>`).join('')}
</tbody></table></div>` : ''}
<div class="note"><b>${tx(`วิธีอ่าน`, `How to read`)}</b><ul>
<li>${tx(`<b>Defect</b> = issue type Defect (เจอใน QA) · <b>Bug</b> = issue type Bug (หลุดไป UAT/PROD) · นับตาม Sprint ของ defect เอง หารด้วยจำนวน Story ใน sprint นั้น (Story ที่ยกข้าม sprint นับทุก sprint)`, `<b>Defect</b> = issue type Defect (found in QA) · <b>Bug</b> = issue type Bug (escaped to UAT/PROD) · counted by the defect's own sprint, divided by the Stories of that sprint (a carried-over Story counts in every sprint)`)}</li>
<li>${tx(`<b>กันได้</b> = BA แก้/เพิ่ม AC หรือ dev แก้ก่อนส่ง QA เพราะข้อที่ทีมยก · <b>ยืนยันเดิม</b> = BA ยืนยันพฤติกรรมเดิม ไม่นับว่ากันได้`, `<b>Stopped</b> = BA changed/added AC or dev fixed before QA because of a point the team raised · <b>Confirmed as is</b> = BA kept the behaviour, not counted as stopped`)}</li>
<li>${tx(`<b>ก่อน / หลัง dev</b> = สถานะ Story ตอนที่ยกข้อนั้น · <b>เตือนแล้วยังเกิด</b> = defect ที่ทีมเคยเตือนไว้แต่ไม่ได้แก้`, `<b>Before / after dev</b> = the Story status when the point was raised · <b>Warned, still happened</b> = a defect the team had warned about that was not fixed`)}</li>
<li>${tx(`<b>เติมย้อนหลัง</b> = ข้อของการ์ดที่บันทึกหลังเหตุการณ์ (Sprint 26)`, `<b>Backfilled</b> = points recorded after the fact (Sprint 26)`)}</li>
${rows.some((r) => r.active) ? `<li>${tx(`<b>*</b> = sprint ที่ยังไม่จบ ตัวเลข defect ยังไม่ครบ ห้ามเทียบกับ sprint ที่จบแล้ว`, `<b>*</b> = sprint not finished: defect numbers are incomplete, do not compare with finished sprints`)}</li>` : ''}
<li>${tx(`<b>สิ่งที่ตัวเลขนี้ไม่ได้พิสูจน์</b>: ความยากและขนาดงานแต่ละ sprint ต่างกัน · การเทสที่ดีขึ้นอาจทำให้ Defect ใน QA เพิ่มขึ้นในขณะที่ Bug ที่หลุดลดลง จึงแสดงทั้งสองเส้น · "-" คือไม่มีข้อมูล ไม่ใช่ศูนย์`, `<b>What these numbers do not prove</b>: sprints differ in size and difficulty · better testing can raise QA defects while escaped bugs fall, so both lines are shown · "-" means no data, not zero`)}</li>
</ul></div></main><script>
(function () {
  var root = document.documentElement, btns = document.querySelectorAll('.lang button');
  function set(l) {
    root.setAttribute('data-lang', l); root.lang = l;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === l)); });
    try { localStorage.setItem('etm-report-lang', l); } catch (e) {}
  }
  var saved = 'th'; try { saved = localStorage.getItem('etm-report-lang') || 'th'; } catch (e) {}
  btns.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-set')); }); });
  set(saved);
})();
</script></body></html>`;
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
  const quality = scriptQuality(sprints, work, path.resolve(opt('--quality', path.join(ROOT, '.claude', 'team', 'quality.jsonl'))));
  const effSprint = [...sprints].reverse().find((s) => readAssessment(work, s.sprint).length)?.sprint ?? null;
  const eff = effSprint == null ? null : effort(sprints.find((s) => s.sprint === effSprint).stories, readAssessment(work, effSprint),
    boardTime(readEvents(path.resolve(opt('--events', path.join(ROOT, '.claude', 'team', 'events.jsonl')))), { capMin: 45 }));
  const value = { change: defectChange(rows), eff, effSprint, agents: readAgents(path.join(ROOT, '.claude', 'agents')) };
  if (sprints.length) fs.writeFileSync(out, html(rows, marker, unassigned, quality, value));
  const sum = (k) => rows.reduce((s, r) => s + (r[k] || 0), 0);
  console.log(`[sprint-metrics] sprints ${sprints[0]?.sprint ?? '-'}-${last?.sprint ?? '-'}, ${sum('stories')} stories, ${sum('defects')} defects, ${sum('bugs')} bugs, ${sum('stopped')} stopped before code`);
  for (const r of rows) console.log(`  S${r.sprint}${r.active ? ' (in progress)' : ''}: ${r.stories} stories, defect/story ${fmt(r.defectsPerStory, 2)}, bugs ${r.bugs}, findings ${fmt(r.raised)} (stopped ${fmt(r.stopped)}, before dev ${fmt(r.before)})`);
  console.log(`  headline sprint: S${headline(rows).sprint ?? '-'}`);
  try { // self-healing rate (tools/heal/heal-log.mjs): healed = approved + re-run passed, over locator failures of tests that passed before
    const h = healSummary(resolveRepos().pwRepo, {});
    console.log(`  self-healing: locator failures ${h.locatorFailures} (new scripts ${h.newScriptFailures}, not counted), healed ${h.healed} (fe ${h.bySource.fe}, live ${h.bySource.live}), rate ${h.rate == null ? '-' : `${Math.round(h.rate * 100)}%`}`);
  } catch (e) { console.log(`  self-healing: - (${e.message})`); }
  for (const q of quality) if (q.ran || q.ac.total) console.log(`  script quality S${q.sprint}: proven ${q.provenRate == null ? '-' : Math.round(q.provenRate * 100) + '%'} (${q.passed}/${q.ran}, not proven ${q.notProven}, fixme ${q.fixme}, precondition ${q.precondition}) | AC proven ${q.ac.total ? `${q.ac.proven}/${q.ac.total}` : '-'} (strong on paper ${q.ac.strong})`);
  for (const c of value.change) if (c.prevSprint) console.log(`  S${c.sprint}${c.provisional ? ' (in progress)' : ''} vs S${c.prevSprint}: defect/story ${sign(c.defectPct)}, bugs ${sign(c.bugPct)}`);
  if (eff) console.log(`  effort S${effSprint} (method A): ${eff.total.cards} cards, manual ~${eff.total.manualH} h, AI ${eff.total.aiH} h, saved ~${eff.total.savedH} h, ${eff.total.asks} questions to the user`);
  console.log(`  unassigned: ${unassigned.length}${unassigned.length ? ` (${unassigned.join(', ')})` : ''}`);
  if (sprints.length) console.log(`  report: ${path.relative(process.cwd(), out)}`);
  for (const e of errors) console.log(`  ERR  ${e}`);
  console.log(`[sprint-metrics check] ${errors.length} error(s)`);
  process.exit(errors.length ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

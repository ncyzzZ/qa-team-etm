// v5.3 (tabs work without JavaScript, so they also work in static previews) / v5.2 (second tab: failures grouped by cause + copy-all text for dev/BA) / v5.1 (red failure box and the forward text can be collapsed) / v5.0 (Test Data column when the manifest steps have data) / v4.9 (simpler: one totals line, short list of failed cases, passed cases collapsed, no filter buttons) / v4.8 (red failure box sits under the step that broke) / v4.7 (failure box a non-tester can forward: step done / TC expected / actual result / copy-ready question for dev or BA) / v4.6 (table per test: # | Step (Action) | Expected Result | ผล | รูป; Action/Expected come from manifest steps) / v4.5 (adds: spec annotations shown per test, optional per-step review verdicts via --review) / v4.4 (verdict box on top, failed tests first, short failure box, script details folded) - After a Playwright run: build ONE self-contained HTML page to check the evidence.
// For every test (pass or fail): which Jira card, each step, the picture taken at that step,
// and - when it failed - which step broke and why. Pictures are embedded in the file.
//
//   node evidence-report.mjs --input <results.json> [<results2.json> ...]  (several runs -> ONE report; a test run twice keeps the last one) --out <folder> --manifest <tc-manifest.json> --title "..." --story ETM-1234 [--review <review.json>]
//   review.json: {"ETM-8339": {"steps": {"10": {"verdict": "script|defect|tc-update|ba-pending|accepted", "note": "..."}}}}  (accepted = not counted as a fail)
import { isKey, profile, escapeKey, keysIn, firstKey, browseUrl } from './profile.mjs';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (n, d = '') => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
// --input takes one or more files (space or comma separated) - each run saved in its own folder
const INPUTS = (args.includes('--input')
  ? args.slice(args.indexOf('--input') + 1).filter(function (a, i, all) { return !all.slice(0, i + 1).some((x) => x.startsWith('--')); })
  : ['test-results/results.json']).flatMap((x) => x.split(',')).filter(Boolean);
const INPUT = INPUTS.join(', ');
let CUR_DIR = '';
const OUT_DIR = arg('--out', 'evidence-reports');
const STORY_ARG = arg('--story');
const TITLE = arg('--title');
const JIRA = browseUrl('');
const K = () => escapeKey(profile().jira.projectKey);
// --triage <triage.json> (tools/heal/triage.mjs): cause per failed test key, shown next to FAIL
const TRIAGE = (() => { try { return args.includes('--triage') ? Object.fromEntries(JSON.parse(fs.readFileSync(arg('--triage'), 'utf8')).map((x) => [x.key, x.cause])) : {}; } catch (e) { console.error('Cannot read --triage file: ' + e.message); return {}; } })();
const CAUSE_TXT = { locator: 'locator พัง', flaky: 'ไม่เสถียร (ผ่านตอนรันซ้ำ)', data: 'ข้อมูลเทส', env: 'สภาพแวดล้อม', assertion: 'ค่าไม่ตรง (อาจเป็นบั๊ก)', unknown: 'ไม่ทราบสาเหตุ' };
const REVIEW = (() => { try { return args.includes('--review') ? JSON.parse(fs.readFileSync(arg('--review'), 'utf8')) : {}; } catch (e) { console.error('Cannot read --review file: ' + e.message); return {}; } })();
const VERDICT = { accepted: 'ยอมรับ (ไม่ถือว่าไม่ผ่าน)', defect: 'เป็น defect', 'tc-update': 'ต้องแก้ TC', script: 'สคริปต์ผิด', 'ba-pending': 'รอ BA ยืนยัน' };
const NOTE = { 'app-finding': 'ระบบไม่ตรง AC (น่าจะเป็น defect)', 'tc-vs-ac': 'TC กับ AC/โค้ดไม่ตรงกัน', 'ba-confirm': 'ต้องถาม BA', partial: 'สคริปต์ตรวจได้ไม่ครบ - ดูรูปด้วยตา', 'check-by-eye': 'ต้องดูรูปด้วยตา', 'design-look': 'เทียบหน้าตากับ Figma ด้วยตา (รูปแอปคู่ Figma ใต้ step)', env: 'ปัญหาสภาพแวดล้อม (เช่น ไม่มีสิทธิ์)' };

const missing = INPUTS.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error(`Cannot find ${missing.join(', ')} - run the tests first (the JSON reporter writes it).`);
  process.exit(1);
}
const runs = INPUTS.map((p) => ({ dir: path.dirname(path.resolve(p)), data: JSON.parse(fs.readFileSync(p, 'utf8')) }));
const data = { errors: runs.flatMap((r) => r.data.errors ?? []) };

const strip = (s) => String(s ?? '').replace(/\u001b\[[0-9;]*m/g, '');
const esc = (s) => strip(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} วิ` : `${Math.round(ms)} ms`);

function imageUri(att) {
  try {
    let p = att.path;
    // look FIRST under the folder next to the results file, then the original path
    if (p && p.includes('test-results/')) {
      const mapped = path.join(CUR_DIR, p.slice(p.indexOf('test-results/') + 'test-results/'.length));
      if (fs.existsSync(mapped)) p = mapped;
    }
    if (p && fs.existsSync(p)) return `data:${att.contentType};base64,${fs.readFileSync(p).toString('base64')}`;
    if (att.body) return `data:${att.contentType};base64,${att.body}`;
  } catch { /* ignore */ }
  return null;
}

// plain-words reason for a failure
function explain(msg) {
  const m = strip(msg);
  const lines = m.split('\n').map((l) => l.trim()).filter(Boolean);
  let why = 'เกิดข้อผิดพลาดระหว่างรันสคริปต์';
  if (/ERR_NAME_NOT_RESOLVED|ERR_NETWORK_CHANGED|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/.test(m)) why = 'เข้าเว็บไม่ได้ - VPN อาจปิดอยู่หรือหลุด';
  else if (/Timeout \d+ms exceeded.*(waiting for|locator)|waiting for (locator|getBy)/is.test(m) && !/Expected|Received/.test(m)) why = 'หาปุ่มหรือช่องบนหน้าจอไม่เจอภายในเวลาที่กำหนด';
  else if (/Expected|Received/.test(m)) why = 'ค่าที่เห็นบนหน้าจอไม่ตรงกับที่คาดไว้';
  else if (/Timeout \d+ms exceeded/.test(m)) why = 'รอนานเกินเวลาที่กำหนด';
  else if (/\b(4\d\d|5\d\d)\b.*(status|response)|status.*\b(4\d\d|5\d\d)\b/i.test(m)) why = 'ระบบตอบกลับด้วย error';
  const exp = lines.find((l) => /^Expected/.test(l));
  const rec = lines.find((l) => /^Received/.test(l));
  const first = lines.slice(0, 3).join(' ');
  let fix = 'เปิดภาพตอนพังและข้อความ error เต็ม แล้วดูว่าหน้าจอเป็นอย่างไรตอนนั้น';
  if (/ERR_NAME_NOT_RESOLVED|ERR_NETWORK_CHANGED|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/.test(m)) fix = 'เปิด VPN ให้ติด แล้วรันเคสนี้ใหม่';
  else if (/Timeout \d+ms exceeded.*(waiting for|locator)|waiting for (locator|getBy)/is.test(m) && !/Expected|Received/.test(m)) fix = 'ดูภาพตอนพัง: ถ้าหน้าว่างหรือยังโหลดไม่เสร็จ ให้รันใหม่ (เว็บอาจช้า) / ถ้าหน้าขึ้นครบแต่ปุ่มหรือชื่อบนจอเปลี่ยน ให้แก้ตัวหาปุ่มในสคริปต์ / ถ้าหน้าผิดจากที่ควรเป็น อาจเป็น bug ให้ log defect';
  else if (/Expected|Received/.test(m)) fix = (/Received:\s*0\b/.test(m) && /(move|scroll|down|up)/i.test(m))
    ? 'ค่าเป็น 0 คือไม่มีอะไรขยับ: ดูภาพตอนพังก่อน ถ้าแผนที่ใช้มีแถวหรือคอลัมน์ไม่พอให้เลื่อน ให้เปลี่ยนไปใช้แผนที่ใหญ่กว่า (ปัญหาข้อมูลเทส) / ถ้าแผนใหญ่พอแล้วยังไม่ขยับ น่าจะเป็น bug ให้ log defect'
    : 'เทียบ Expected กับ Received: ถ้าหน้าจอผิดจริง ให้ log defect / ถ้าข้อมูลทดสอบไม่ตรงกับที่สคริปต์คาดไว้ ให้แก้ข้อมูลหรือค่าที่คาดในสคริปต์';
  else if (/Timeout \d+ms exceeded/.test(m)) fix = 'รันใหม่ 1 ครั้ง ถ้ายังช้าซ้ำ ให้เช็กว่าเว็บช้าหรือเพิ่มเวลารอในสคริปต์';
  else if (/\b(4\d\d|5\d\d)\b.*(status|response)|status.*\b(4\d\d|5\d\d)\b/i.test(m)) fix = 'เช็กว่าล็อกอินด้วยผู้ใช้ที่มีสิทธิ์ และระบบฝั่งหลังบ้านทำงานปกติ แล้วรันใหม่';
  // --- plain-words parts (easy to read) ---
  const val = (l) => (l ?? '').replace(/^(Expected|Received)[^:]*:\s*/, '').trim();
  const unq = (x) => { const y = x.replace(/^"(.*)"$/s, '$1').replace(/^'(.*)'$/s, '$1'); return y === '' && x !== '' ? '(ว่าง)' : y; };
  const ev = unq(val(exp)), rv = unq(val(rec));
  const first1 = (lines[0] ?? '').replace(/^Error:\s*/, '');
  const check = /^(expect\(|Timeout|Call Log|locator\.|page\.|Error:?$|Expected|Received|Locator:)/.test(first1) ? '' : first1;
  const codeLine = (m.split('\n').find((l) => /^\s*>\s*\d+\s*\|/.test(l)) ?? '').replace(/^\s*>\s*\d+\s*\|\s*/, '').trim();
  const waited = (m.match(/Timeout (\d+)ms exceeded/) ?? [])[1];
  const loc = (m.match(/waiting for ((?:getBy\w*|locator)\([^\n]*)/) ?? [])[1];
  const ROLE = { button: 'ปุ่ม', textbox: 'ช่องกรอก', link: 'ลิงก์', checkbox: 'ช่องติ๊ก', tab: 'แท็บ', dialog: 'หน้าต่างป๊อปอัป', combobox: 'ช่องเลือก', row: 'แถว', cell: 'ช่องในตาราง', heading: 'หัวข้อ', menuitem: 'เมนู', option: 'ตัวเลือก' };
  const human = (l) => {
    const q = (x) => `"${x}"`;
    let r = l.match(/getByRole\(\s*'([^']+)'(?:\s*,\s*\{[^}]*?name:\s*(?:'([^']*)'|\/([^/]*)\/))?/);
    if (r) return `${ROLE[r[1]] ?? r[1]}${r[2] || r[3] ? ' ' + q(r[2] || r[3]) : ''}`;
    r = l.match(/getByText\(\s*'([^']*)'/); if (r) return `ข้อความ ${q(r[1])}`;
    r = l.match(/getBy(?:Label|Placeholder|Title)\(\s*'([^']*)'/); if (r) return `ช่อง ${q(r[1])}`;
    r = l.match(/locator\(\s*'([^']*)'/); if (r) return `องค์ประกอบ ${r[1]}`;
    return l.replace(/\s+/g, ' ').slice(0, 100);
  };
  const nE = Number(ev), nR = Number(rv);
  const numeric = ev !== '' && rv !== '' && !isNaN(nE) && !isNaN(nR);
  let plain = '';
  if (exp && rec) {
    plain = `ระบบให้ค่า "${rv}" แต่ที่ควรได้คือ "${ev}"` + (numeric ? (nR < nE ? ` (น้อยกว่าที่ควร ${nE - nR})` : nR > nE ? ` (มากกว่าที่ควร ${nR - nE})` : '') : '');
  } else if (loc) plain = `ไม่พบ${human(loc)} บนหน้าจอ${waited ? ` ภายใน ${Math.round(waited / 1000)} วินาที` : ''}`;
  else if (waited) plain = `รอ ${Math.round(waited / 1000)} วินาทีแล้วระบบยังไม่ตอบสนองตามที่คาด`;
  const kind = /ERR_NAME_NOT_RESOLVED|ERR_NETWORK_CHANGED|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/.test(m) ? 'env' : (exp && rec) ? 'value' : loc ? 'missing' : 'other';
  if (kind === 'env') plain = 'เปิดเว็บไม่ได้ (VPN หรือเครือข่ายหลุด) - ไม่เกี่ยวกับการทำงานของระบบที่ทดสอบ';
  if (exp && rec && /Expected|Received/.test(m) && !/ERR_|status/.test(m)) fix = `ดูภาพตอนพัง: ถ้าหน้าจอเป็น "${rv}" จริงและ requirement ต้องเป็น "${ev}" = bug (log defect) / ถ้าหน้าจอถูกแต่สคริปต์คาดผิด = แก้สคริปต์`;
  return { why, fix, exp, rec, first, check, plain, kind, codeLine, full: m };
}

// failure box a non-tester can read and forward: what was done / what the TC expects / what the test got / a ready question
const failBox = (t) => {
  const e = t.err, n = t.failedStep?.n;
  const x = n ? MTC[t.tcKey]?.steps?.[n - 1] : null;
  const action = x?.action ?? (t.failedStep ? t.failedStep.title.replace(/^\s*\d+[.)]\s*/, '') : '');
  const expectedTC = x?.result ?? '';
  const actual = (e.check ? e.check + ' - ' : '') + (e.plain || e.why);
  const name = MTC[t.tcKey]?.summary ? `${t.tcKey} ${MTC[t.tcKey].summary}` : t.title;
  const ask = e.kind === 'env' ? '' :
    `เทส ${name}\nขั้นที่ ${n ?? '-'}: ${action || '-'}\n${x?.data && String(x.data).trim() ? 'ข้อมูลที่ใช้: ' + String(x.data).trim().replace(/\n+/g, ' / ') + '\n' : ''}ผลที่ TC คาดหวัง: ${expectedTC || '(ดูใน TC)'}\nผลที่ได้จากการเทส: ${actual}\nภาพหน้าจอประกอบอยู่ในรายงานขั้นที่ ${n ?? '-'}\nรบกวนช่วยยืนยันว่าพฤติกรรมนี้ถูกต้องตาม requirement หรือไม่`;
  const next = e.kind === 'env' ? e.fix : 'ยังไม่ใช่คำตัดสิน: ดูภาพหน้าจอตอนไม่ผ่าน แล้วให้เจ้าของงานตัดสินว่าเป็นข้อบกพร่องของระบบ ข้อมูลทดสอบ หรือ TC ที่เขียนไว้';
  return `<details class="why" open>
  <summary class="rhead">ไม่ผ่านที่ <b>${n ? 'Step ' + n : 'ก่อนเริ่มเทส'}</b> - ${esc(actual)}</summary>
  <dl class="fb">
    <dt>ขั้นตอนที่ทำ</dt><dd>${esc(action || '-')}</dd>
    <dt>ผลที่ TC คาดหวัง</dt><dd>${esc(expectedTC || '(ไม่มีข้อมูลใน manifest - ดูใน Xray)')}</dd>
    <dt>ผลที่ได้จากการเทส</dt><dd><b>${esc(actual)}</b></dd>
    ${e.kind === 'env' ? `<dt>ขั้นต่อไป</dt><dd>${esc(next)}</dd>` : ''}
  </dl>
  ${ask ? `<details class="ask"><summary><b>ข้อความส่งต่อให้ dev / BA</b> <button class="cp" data-t="${esc(ask)}">คัดลอก</button></summary><pre>${esc(ask)}</pre></details>` : ''}
  ${techHtml(e, t.file)}</details>`;
};
const techHtml = (e, file) => `<details class="tech"><summary>รายละเอียดสำหรับคนเขียนสคริปต์</summary>
  <div><b>แนวทางสำหรับ tester:</b> ${esc(e.fix)}</div>
  ${e.check ? `<div><b>สคริปต์กำลังเช็ก:</b> ${esc(e.check)}</div>` : ''}
  ${e.codeLine ? `<div><b>คำสั่งที่พัง:</b> <code>${esc(e.codeLine)}</code></div>` : ''}
  <div><b>ไฟล์:</b> ${esc(file)}</div>
  <pre class="err">${esc(e.full)}</pre></details>`;

const cards = new Map(); // story key -> tests[]
const cardOf = (chain, title) => {
  for (const t of [...chain].reverse()) { const x = t.match(new RegExp(String.raw`\((${K()}-\d+)\)`)); if (x) return x[1]; }
  const y = title.match(new RegExp(String.raw`^(${K()}-\d+)\s+TC-`)); if (y) return y[1];
  return STORY_ARG || 'ไม่ทราบการ์ด';
};

function topSteps(steps, out = []) {
  // the JSON reporter gives plain {title, duration, error, steps}; keep only the first level (the numbered test.step blocks)
  for (const s of steps ?? []) {
    if (!s.category || s.category === 'test.step') out.push(s);
    else topSteps(s.steps, out);
  }
  return out;
}

function walk(suite, chain) {
  const nextChain = suite.title && !/\.(spec|test)\.[tj]s$/.test(suite.title) ? [...chain, suite.title] : chain;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const last = t.results?.[t.results.length - 1];
      if (!last) continue;
      // flaky (failed, then passed on retry): show the failed attempt, its error and its step, not the clean retry
      const firstFail = last.status === 'passed' ? t.results.find((x) => x.status === 'failed' || x.status === 'timedOut') : null;
      const r = firstFail ?? last;
      const testKey = (spec.title.match(new RegExp(String.raw`(?<![A-Za-z0-9])${K()}-\d+(?!\d)(\s+TC-\d+)?`)) ?? [''])[0];
      const story = cardOf(nextChain, spec.title);
      const expectedFail = t.status === 'expected' && r.status === 'failed';
      let status = t.status === 'skipped' || r.status === 'skipped' ? 'skipped'
        : t.status === 'unexpected' || (t.status === 'flaky') ? 'failed'
        : r.status === 'passed' || expectedFail ? 'passed' : 'failed';
      const errMsg = strip((r.errors?.[0]?.message ?? r.error?.message) ?? '');
      const steps = topSteps(r.steps).map((s, i) => {
        const n = (s.title.match(/^\s*(\d+)[.)]/) ?? [])[1];
        return { n: n ? Number(n) : i + 1, title: s.title, ms: s.duration, err: s.error?.message ? strip(s.error.message) : '', images: [], manual: s.manualVerdict, why: s.why };
      });
      steps.sort((a, b) => a.n - b.n);
      const loose = [];
      for (const a of r.attachments ?? []) {
        if (!a.contentType?.startsWith('image/')) continue;
        const uri = imageUri(a); if (!uri) continue;
        const num = (a.name.match(/^Step\s*(\d+)/i) ?? [])[1];
        const failShot = a.name === 'screenshot';
        const target = num ? steps.find((s) => s.n === Number(num)) : failShot ? steps.find((s) => s.err) : null;
        const item = { name: failShot ? 'ภาพหน้าจอตอนพัง' : a.name.replace(/^Step\s*\d+:\s*/i, ''), uri, fail: failShot, no: failShot ? (target?.n ?? '') : (num ?? '') };
        (target ?? { images: loose }).images.push(item);
      }
      const failedIdx = steps.findIndex((s) => s.err);
      steps.forEach((s, i) => { s.state = s.err ? 'failed' : failedIdx >= 0 && i > failedIdx ? 'notrun' : 'passed'; });
      // manual runner (tools/manual/results.mjs): every step was done and has its own verdict; no "not run after the first fail"
      steps.forEach((s) => { if (s.manual) s.state = s.manual === 'fail' ? 'failed' : s.manual === 'needs-human' ? 'needshuman' : 'passed'; });
      const tcKey0 = firstKey(spec.title);
      steps.forEach((s) => { const v = REVIEW[tcKey0]?.steps?.[s.n]; if (v?.verdict) s.review = v; });
      let accepted = false;
      if (status === 'failed' && failedIdx >= 0 && steps[failedIdx].review?.verdict === 'accepted') { status = 'passed'; accepted = true; steps[failedIdx].state = 'accepted'; }
      const notes = (t.annotations ?? []).filter((a) => NOTE[a.type]).map((a) => ({ type: a.type, text: a.description ?? '' }));
      const list = cards.get(story) ?? []; cards.set(story, list);
      list.push({ title: spec.title, testKey, tcKey: tcKey0, story, status, expectedFail, accepted, notes, ms: r.duration, file: `${spec.file}:${spec.line}`, steps, loose, err: errMsg ? explain(errMsg) : null, failedStep: steps[failedIdx] });
    }
  }
  for (const s of suite.suites ?? []) walk(s, nextChain);
}
for (const r of runs) { CUR_DIR = r.dir; for (const s of r.data.suites ?? []) walk(s, []); }
// the same test run more than once (re-run): keep only the LAST one
for (const [k, list] of cards) { const last = new Map(); list.forEach((t) => last.set(t.title, t)); cards.set(k, [...last.values()]); }
data.suites = [];


// ---- TC totals per card (needs a manifest: every Xray Test of each Story) ----
const MANIFEST = (() => {
  try { return JSON.parse(fs.readFileSync(arg('--manifest', 'tc-manifest.json'), 'utf8')).stories ?? {}; } catch { return {}; }
})();
// every Test of the manifest by key: {summary, steps:[{action, result}]} (steps optional)
const MTC = {};
for (const list of Object.values(MANIFEST)) for (const x of list ?? []) MTC[x.key] = x;
function statsFor(story, tests) {
  const list = MANIFEST[story];
  const ranKeys = new Set(tests.map((t) => t.tcKey));
  const c = (st) => tests.filter((t) => t.status === st).length;
  const manual = (list ?? []).filter((x) => !x.automated && !ranKeys.has(x.key));
  const notRun = (list ?? []).filter((x) => x.automated && !ranKeys.has(x.key));
  const extra = tests.filter((t) => !(list ?? []).some((x) => x.key === t.tcKey)).length;
  return { known: !!list, total: (list ? list.length : 0) + extra, pass: c('passed'), fail: c('failed'), skip: c('skipped'), manual, notRun };
}

// ---- HTML ----
const all = [...cards.values()].flat();
const count = (st) => all.filter((t) => t.status === st).length;
const allStats = [...cards.entries()].map(([k, v]) => statsFor(k, v));
const sum = (f) => allStats.reduce((a, x) => a + f(x), 0);
const T = { total: sum((x) => x.total), manual: sum((x) => x.manual.length), notRun: sum((x) => x.notRun.length) };
const now = new Date();
const stamp = now.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });

const STATE_TXT = { passed: 'ผ่าน', failed: 'ไม่ผ่าน', accepted: 'ยอมรับแล้ว', notrun: 'ไม่ได้รัน', none: 'ไม่ได้ตรวจ', needshuman: 'รอคนตัดสิน' };
const imgHtml = (i) => `<figure class="${i.fail ? 'fail' : ''}" data-cap="${esc((i.no ? 'Step ' + i.no + ': ' : '') + i.name)}"><div class="wrap"><img loading="lazy" src="${i.uri}" alt="${esc(i.name)}"></div><figcaption>${esc(i.name)}</figcaption></figure>`;
const hasData = (t) => (MTC[t.tcKey]?.steps ?? []).some((x) => x.data && String(x.data).trim());
function rowsHtml(t) {
  const xs = MTC[t.tcKey]?.steps ?? [];
  const hd = hasData(t);
  const byN = new Map(t.steps.map((s) => [s.n, s]));
  const nums = [...new Set([...xs.map((_, i) => i + 1), ...t.steps.map((s) => s.n)])].sort((a, b) => a - b);
  return nums.map((n) => {
    const s = byN.get(n), x = xs[n - 1];
    const action = x?.action ?? (s ? s.title.replace(/^\s*\d+[.)]\s*/, '') : '');
    const state = s ? s.state : 'none';
    return `<tr class="r-${state}"><td>${n}</td><td class="tx">${esc(action)}</td>${hd ? `<td class="tx">${esc(x?.data ?? '')}</td>` : ''}<td class="tx">${esc(x?.result ?? '-')}</td>
      <td><span class="badge ${state}">${STATE_TXT[state]}</span>${s?.manual === 'needs-human' && s.why ? `<div class="rv">${esc(s.why)}</div>` : ''}${s?.err ? `<div class="rf">${state === 'accepted' ? 'ไม่ผ่านแต่ทีมยอมรับแล้ว' : 'ไม่ผ่านที่ขั้นนี้ (สาเหตุในกล่องแดงด้านล่าง)'}</div>` : ''}${s?.review ? `<div class="rv ${s.review.verdict}"><b>ผลตัดสิน:</b> ${esc(VERDICT[s.review.verdict] ?? s.review.verdict)}${s.review.note ? ' - ' + esc(s.review.note) : ''}</div>` : ''}</td>
      <td class="im">${(s?.images ?? []).map(imgHtml).join('') || '<span class="mut">ไม่มีรูป</span>'}</td></tr>`
      + (s && s === t.failedStep && t.err ? `<tr class="fbrow"><td></td><td colspan="${hd ? 5 : 4}">${failBox(t)}</td></tr>` : '');
  }).join('');
}

const testHtml = (t) => `
<details class="test ${t.status}" id="t-${esc(t.tcKey)}" data-status="${t.status}" ${t.status === 'failed' ? 'open' : ''}>
  <summary><span class="badge ${t.status}">${t.status === 'passed' ? (t.expectedFail ? 'PASS (คาดว่าจะพัง)' : t.accepted ? 'PASS (ยอมรับ)' : 'PASS') : t.status === 'failed' ? 'FAIL' : 'SKIP'}</span>${t.status === 'failed' && TRIAGE[t.tcKey] ? `<span class="cause cause-${esc(TRIAGE[t.tcKey])}">${esc(CAUSE_TXT[TRIAGE[t.tcKey]] || TRIAGE[t.tcKey])}</span>` : ''}
    <b>${esc(MTC[t.tcKey]?.summary ? t.tcKey + ' ' + MTC[t.tcKey].summary : t.title)}</b><span class="mut">${fmtMs(t.ms)}</span></summary>
  <div class="body">
    <div class="links">${isKey(t.tcKey) ? `TC: <a href="${JIRA}${t.tcKey}" target="_blank">${t.tcKey}</a>` : ''}
      ${isKey(t.story) ? `การ์ด: <a href="${JIRA}${t.story}" target="_blank">${esc(t.story)}</a>` : ''}
    </div>
    ${t.notes.length ? `<div class="notes">${t.notes.map((n) => `<div><b>หมายเหตุจากสคริปต์:</b> ${esc(NOTE[n.type])}${n.text ? ' - ' + esc(n.text) : ''}</div>`).join('')}</div>` : ''}
    ${t.err && !t.failedStep ? failBox(t) : ''}
    ${rowsHtml(t) ? `<table class="st"><thead><tr><th>#</th><th>Step (Action)</th>${hasData(t) ? '<th>Test Data</th>' : ''}<th>Expected Result</th><th>ผล</th><th>รูป</th></tr></thead><tbody>${rowsHtml(t)}</tbody></table>` : '<div class="mut">ไม่มี test.step ในเคสนี้</div>'}
    ${t.loose.length ? `<div class="imgs">${t.loose.map((i) => `<figure><img loading="lazy" src="${i.uri}"><figcaption>${esc(i.name)}</figcaption></figure>`).join('')}</div>` : ''}
  </div>
</details>`;

const tcLink = (k) => `<a href="${JIRA}${k}" target="_blank">${esc(k)}</a>`;
const cardHtml = ([key, tests]) => {
  const st = statsFor(key, tests);
  const f = st.fail;
  return `<section class="card" data-card="${esc(key)}">
  <h2>${isKey(key) ? `<a href="${JIRA}${key}" target="_blank">${esc(key)}</a>` : esc(key)}
    <span class="badge ${f ? 'failed' : 'passed'}">ผ่าน ${st.pass} จาก ${tests.length} เคสที่รัน</span></h2>
  <div class="stats"><span class="ok"><b>${st.pass}</b> ผ่าน</span><span class="bad"><b>${st.fail}</b> ไม่ผ่าน</span>${st.skip ? `<span class="sk"><b>${st.skip}</b> ข้าม</span>` : ''}${st.manual.length ? `<span class="mn"><b>${st.manual.length}</b> ต้องเทสเอง</span>` : ''}${st.known ? '' : '<span class="mut">(ไม่มี manifest - นับเฉพาะที่รัน)</span>'}</div>
  ${[...tests].sort((a, b) => (b.status === 'failed') - (a.status === 'failed')).map(testHtml).join('')}
  ${st.manual.length ? `<details class="manual" open><summary><b>ต้องเทสเอง ${st.manual.length} เคส</b> (ทำด้วย automation ไม่ได้ / ยังไม่มีสคริปต์)</summary>
    <ul>${st.manual.map((x) => `<li>${tcLink(x.key)} - ${esc(x.summary)}<div class="mut">${esc(x.reason ?? '')}</div></li>`).join('')}</ul></details>` : ''}
  ${st.notRun.length ? `<details class="manual"><summary>มีสคริปต์แต่ไม่ได้รันรอบนี้ ${st.notRun.length} เคส</summary>
    <ul>${st.notRun.map((x) => `<li>${tcLink(x.key)} - ${esc(x.summary)}</li>`).join('')}</ul></details>` : ''}
  </section>`;
};

const runErrors = (data.errors ?? []).map((e) => strip(e.message ?? e.stack ?? '')).filter(Boolean);
const noCases = `<div class="why"><b>ไม่มีเคสไหนได้รันในรอบนี้</b>${runErrors.length
  ? `<div>รอบนี้หยุดก่อนเริ่มเทส สาเหตุที่ Playwright รายงาน (มักเป็นขั้น login / setup):</div><pre class="err">${esc(runErrors.join('\n\n'))}</pre>`
  : '<div>ไม่มี error ในไฟล์ผลรัน อาจเพราะชื่อเคสที่ใส่ใน -g / ชื่อไฟล์ไม่ตรงกับเคสใดเลย</div>'}</div>`;

const ctxOf = (t) => {
  const n = t.failedStep?.n, x = n ? MTC[t.tcKey]?.steps?.[n - 1] : null;
  return { n, action: x?.action ?? (t.failedStep ? t.failedStep.title.replace(/^\s*\d+[.)]\s*/, '') : ''), exp: x?.result ?? '',
    data: x?.data && String(x.data).trim() ? String(x.data).trim().replace(/\n+/g, ' / ') : '',
    name: MTC[t.tcKey]?.summary ? `${t.tcKey} ${MTC[t.tcKey].summary}` : t.title, actual: (t.err.check ? t.err.check + ' - ' : '') + (t.err.plain || t.err.why) };
};
const GROUPS = (() => {
  const m = new Map();
  for (const t of all.filter((x) => x.status === 'failed' && x.err)) {
    const c = ctxOf(t), k = t.err.kind + '|' + c.actual;
    if (!m.has(k)) m.set(k, { kind: t.err.kind, actual: c.actual, items: [] });
    m.get(k).items.push({ t, c });
  }
  return [...m.values()];
})();
const ASKEND = 'รบกวนช่วยยืนยันว่าพฤติกรรมนี้ถูกต้องตาม requirement หรือไม่';
const groupText = (g) => `ปัญหา: ${g.actual}${g.items.length > 1 ? ` (${g.items.length} เคส)` : ''}\n` + g.items.map(({ c }) => `- ${c.name} | ขั้นที่ ${c.n ?? '-'}: ${c.action || '-'}${c.data ? ' | ข้อมูลที่ใช้: ' + c.data : ''} | TC คาดหวัง: ${c.exp || '(ดูใน TC)'}`).join('\n');
const sendable = GROUPS.filter((g) => g.kind !== 'env');
const ALLTXT = `สรุปผลเทส ${TITLE || ''}\n\n` + sendable.map(groupText).join('\n\n') + `\n\n${ASKEND}`;
const fwdHtml = GROUPS.length ? `
  ${sendable.length ? `<div style="margin:10px 0"><button class="cp" data-t="${esc(ALLTXT)}">คัดลอกสรุปทั้งรอบ (${sendable.length} ปัญหา)</button> <span class="mut">วางในแชท / Jira ได้เลย</span><details class="ask" style="margin-top:8px"><summary>ดูข้อความรวม (ลากคลุมแล้วคัดลอกเองได้)</summary><pre>${esc(ALLTXT)}</pre></details></div>` : ''}
  ${GROUPS.map((g) => `<section class="card"><h2>${g.kind === 'env' ? 'สภาพแวดล้อม (ไม่ต้องส่ง dev)' : 'ปัญหา'}: ${esc(g.actual)} <span class="badge failed">${g.items.length} เคส</span></h2>
    <ul>${g.items.map(({ t, c }) => `<li><a href="#t-${esc(t.tcKey)}" data-goto="t-${esc(t.tcKey)}"><b>${esc(t.tcKey)}</b></a> ${esc(c.name)}<div class="mut">ขั้นที่ ${c.n ?? '-'}: ${esc(c.action || '-')}${c.data ? ' · ข้อมูล: ' + esc(c.data) : ''} · TC คาดหวัง: ${esc(c.exp || '(ดูใน TC)')}</div></li>`).join('')}</ul>
    ${g.kind !== 'env' ? `<details class="ask"><summary><b>ข้อความส่งต่อ</b> <button class="cp" data-t="${esc(groupText(g) + '\n\n' + ASKEND)}">คัดลอก</button></summary><pre>${esc(groupText(g) + '\n\n' + ASKEND)}</pre></details>` : ''}</section>`).join('')}`
  : '<div class="verdict ok"><b>ไม่มีเคสที่ไม่ผ่าน</b></div>';

const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TITLE || 'Evidence report')}</title>
<style>
:root{--bg:#f6f7f9;--fg:#1c2230;--mut:#6b7385;--card:#fff;--line:#e2e5eb;--ok:#1a7f4b;--okbg:#e3f5ec;--bad:#c0262d;--badbg:#fde8e9;--skip:#8a6d00;--skipbg:#fff4cc}
@media(prefers-color-scheme:dark){:root{--bg:#14171d;--fg:#e8ebf1;--mut:#98a1b3;--card:#1c2029;--line:#2c3240;--ok:#5fd29a;--okbg:#14352a;--bad:#ff8087;--badbg:#3a1c1f;--skip:#e8c55a;--skipbg:#3a3114}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,"Noto Sans Thai",sans-serif}
main{max-width:1100px;margin:0 auto;padding:20px 16px 60px}h1{margin:0 0 4px;font-size:22px}h2{font-size:18px;margin:0 0 10px}a{color:inherit}
.stats{display:flex;gap:16px;flex-wrap:wrap;margin:0 0 10px;font-size:13px}.stats b{font-size:16px}.stats .ok b{color:var(--ok)}.stats .bad b{color:var(--bad)}.stats .sk b,.stats .mn b{color:var(--skip)}.manual{background:var(--skipbg);border-radius:8px;padding:8px 12px;margin:10px 0}.manual summary{cursor:pointer}.manual ul{margin:8px 0 0;padding-left:20px}.manual li{margin:4px 0}.no{background:var(--fg);color:var(--bg);font-size:11px;font-weight:700;padding:1px 8px;border-radius:99px;flex:none}.links{margin:2px 0 6px}.links a{font-weight:700;margin:0 12px 0 4px}.mut{color:var(--mut);font-size:12px;margin-left:8px}.sum{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}
.pill{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 14px;cursor:pointer;font:inherit;color:inherit}
.pill b{font-size:20px;display:block}.pill.on{outline:2px solid var(--fg)}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:16px 0}
.test{border:1px solid var(--line);border-radius:8px;margin:8px 0;border-left-width:5px}.test.passed{border-left-color:var(--ok)}.test.failed{border-left-color:var(--bad)}.test.skipped{border-left-color:var(--skip)}
.test>summary{cursor:pointer;padding:8px 10px;list-style:none}.body{padding:4px 12px 12px}
.badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;margin-right:8px}
.badge.passed{background:var(--okbg);color:var(--ok)}.badge.failed{background:var(--badbg);color:var(--bad)}.badge.skipped{background:var(--skipbg);color:var(--skip)}
.cause{font-size:12px;margin-left:6px;padding:1px 6px;border-radius:8px;border:1px solid currentColor;opacity:.85}
.fb{display:grid;grid-template-columns:150px 1fr;gap:6px 12px;margin:8px 0}.fb dt{font-weight:700;color:var(--mut)}.fb dd{margin:0;white-space:pre-line}.ask{background:var(--card);border:1px dashed var(--line);border-radius:8px;padding:8px 10px;margin-top:8px}.ask pre{white-space:pre-wrap;font:13px/1.5 inherit;margin:6px 0 0}.cp{font:inherit;font-size:12px;padding:2px 10px;margin-left:8px;cursor:pointer}.tabs{display:flex;gap:8px;margin:12px 0}.tabbtn{font:inherit;padding:6px 16px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:inherit;cursor:pointer}input[name=tab]{position:absolute;opacity:0;pointer-events:none}#tb-run:checked~.tabs label[for=tb-run],#tb-fwd:checked~.tabs label[for=tb-fwd]{background:var(--fg);color:var(--bg)}#tb-run:checked~#tab-fwd,#tb-fwd:checked~#tab-run{display:none}.why>summary{cursor:pointer;list-style:none}.why>summary::-webkit-details-marker{display:none}.why>summary::before{content:'▼ ';color:var(--mut)}.why:not([open])>summary::before{content:'▶ '}.ask>summary{cursor:pointer}.fbrow td{border-top:0!important;padding-top:0!important}.fbrow .why{margin:0 0 4px}.st{width:100%;border-collapse:collapse;margin:8px 0}.st th{background:#1f4e79;color:#fff;text-align:left;padding:8px;font-size:13px}.st th:nth-child(1){width:36px}.st th:nth-last-child(2){width:130px}.st th:last-child{width:230px}.st td{border-top:1px solid var(--line);padding:8px;vertical-align:top}.st td.tx{white-space:pre-line}.st td.im figure{max-width:220px;margin:0 0 8px}.st td.im figcaption{font-size:11px;font-weight:400;color:var(--mut)}.badge.accepted{background:#fff4cc;color:#8a6d00}.badge.needshuman{background:#fff4cc;color:#8a6d00}.badge.notrun,.badge.none{background:var(--line);color:var(--mut)}.rf{font-size:12px;color:var(--bad);margin-top:4px}.tot{margin:6px 0 0;font-size:14px}.tot span{margin-left:12px;font-weight:700}.notes{background:#fff8e1;border-radius:8px;padding:8px 12px;margin:8px 0;font-size:14px}.step.accepted .dot{color:#b7791f}.rv{background:#fff8e1;border-radius:6px;padding:4px 10px;margin:4px 0;font-size:14px}.why{background:var(--badbg);border-radius:8px;padding:10px 12px;margin:8px 0}.why div{margin-top:4px}.rhead{font-size:15px}.tech{margin-top:8px}.tech summary{cursor:pointer;color:var(--mut)}.verdict{border-radius:10px;padding:10px 14px;margin:14px 0;font-size:15px}.verdict.ok{background:var(--okbg)}.verdict.bad{background:var(--badbg)}.verdict ul{margin:6px 0 0;padding-left:20px;font-size:14px}
pre.err{white-space:pre-wrap;word-break:break-word;font:12px/1.4 ui-monospace,Menlo,monospace;margin:6px 0 0;max-height:260px;overflow:auto}
.stepfail{background:var(--badbg);border-left:4px solid var(--bad);border-radius:6px;padding:8px 12px;margin:6px 0 0 28px}.stepfail div{margin-top:3px}.tag{font-weight:700;color:var(--bad)}.step.failed{background:var(--badbg);border-radius:6px;padding:8px}
.steps{list-style:none;padding:0;margin:10px 0}.step{border-top:1px dashed var(--line);padding:8px 0}
.sh{display:flex;align-items:center;gap:8px}.dot{width:20px;height:20px;border-radius:50%;display:inline-grid;place-items:center;font-size:12px;font-weight:700;flex:none}
.passed>.sh .dot{background:var(--okbg);color:var(--ok)}.failed>.sh .dot{background:var(--badbg);color:var(--bad)}.notrun>.sh .dot{background:var(--skipbg);color:var(--skip)}
.imgs{display:flex;gap:12px;flex-wrap:wrap;margin:8px 0 0 28px}figure{margin:0;max-width:340px}figure img{width:100%;border:1px solid var(--line);border-radius:6px;cursor:zoom-in;display:block}
figure.fail img{border-color:var(--bad)}figcaption{font-size:13px;color:var(--fg,inherit);margin-top:4px;font-weight:600}.wrap{position:relative}.cap{position:absolute;left:0;right:0;top:0;background:rgba(200,0,0,.88);color:#fff;font:600 12px/1.3 sans-serif;padding:3px 6px;border-radius:6px 6px 0 0;pointer-events:none}#lb .capbig{position:fixed;left:0;right:0;top:0;background:rgba(200,0,0,.92);color:#fff;font:700 16px/1.3 sans-serif;padding:8px 14px;z-index:10}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;overflow:auto;z-index:9;cursor:zoom-out}#lb img{display:block;margin:20px auto;max-width:96vw}
</style></head><body><main>
<h1>${esc(TITLE || 'ผลตรวจ evidence หลังรัน Playwright')}</h1>
<div class="mut" style="margin:0">สร้างเมื่อ ${esc(stamp)} · อ่านจาก ${esc(INPUT)}</div>
<div class="tot"><b>ทั้งหมด ${all.length} เคส</b> <span style="color:var(--ok)">ผ่าน ${all.filter((t) => t.status === 'passed' && !t.accepted).length}</span> <span style="color:var(--bad)">ไม่ผ่าน ${count('failed')}</span> <span style="color:var(--skip)">ยอมรับแล้ว ${all.filter((t) => t.accepted).length}</span>${count('skipped') ? ` <span class="mut">ข้าม ${count('skipped')}</span>` : ''}${T.notRun ? ` <span class="mut">ไม่ได้รันรอบนี้ ${T.notRun}</span>` : ''}${T.manual ? ` <span class="mut">ต้องเทสเอง ${T.manual}</span>` : ''}</div>
<input type="radio" name="tab" id="tb-run" checked><input type="radio" name="tab" id="tb-fwd">
<div class="tabs"><label for="tb-run" class="tabbtn">ผลรายขั้น</label><label for="tb-fwd" class="tabbtn">สรุปส่งต่อ dev / BA${GROUPS.length ? ` (${GROUPS.length} ปัญหา)` : ''}</label></div>
<div id="tab-run">
${count('failed') ? `<div class="verdict bad"><b>ไม่ผ่าน ${count('failed')} เคส</b><ul>${all.filter((t) => t.status === 'failed').map((t) => `<li><a href="#t-${esc(t.tcKey)}"><b>${esc(t.tcKey)}</b></a> ${t.failedStep ? 'Step ' + t.failedStep.n : 'ก่อนเริ่มเทส'} - ${esc(t.err?.plain || t.err?.why || '')}</li>`).join('')}</ul></div>` : all.length ? '<div class="verdict ok"><b>ผ่านทุกเคสที่รัน</b></div>' : ''}
${[...cards.entries()].map(cardHtml).join('') || noCases}
</div>
<div id="tab-fwd">${fwdHtml}</div>
</main><div id="lb"><div class="capbig"></div><img alt="" style="margin-top:44px"></div>
<script>
const lb=document.getElementById('lb');
document.addEventListener('click',e=>{const i=e.target.closest('figure img');if(i){lb.querySelector('img').src=i.src;lb.querySelector('.capbig').textContent=i.closest('figure').dataset.cap||'';lb.style.display='block';return}
 if(e.target.closest('#lb')){lb.style.display='none';return}
 const p=e.target.closest('.pill');if(!p)return;document.querySelectorAll('.pill').forEach(x=>x.classList.toggle('on',x===p));
 const f=p.dataset.f;document.querySelectorAll('.test').forEach(t=>t.style.display=f==='all'||t.dataset.status===f?'':'none');
 document.querySelectorAll('.card').forEach(c=>c.style.display=[...c.querySelectorAll('.test')].some(t=>t.style.display!=='none')?'':'none')});
document.addEventListener('click',e=>{const b=e.target.closest('.cp');if(!b)return;e.preventDefault();e.stopPropagation();const t=b.dataset.t;const done=()=>{b.textContent='คัดลอกแล้ว'};
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(done,()=>{});else{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(x){}a.remove()}});
function showTab(n){document.getElementById('tb-'+n).checked=true}
document.addEventListener('click',e=>{
 const g=e.target.closest('a[data-goto]');if(g){e.preventDefault();showTab('run');const el=document.getElementById(g.dataset.goto);if(el){el.open=true;el.scrollIntoView()}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.style.display='none'});
</script></body></html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
const name = `evidence-report-${now.toISOString().slice(0, 16).replace(/[:T]/g, '').replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3_')}`.replace(/_?(\d{4})$/, '_$1') + '.html';
fs.writeFileSync(path.join(OUT_DIR, name), html);
fs.writeFileSync(path.join(OUT_DIR, 'latest.html'), html);
console.log(`Evidence report: ${path.join(OUT_DIR, name)}  (${all.length} tests: ${count('passed')} pass, ${count('failed')} fail, ${count('skipped')} skip)`);

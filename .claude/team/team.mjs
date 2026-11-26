#!/usr/bin/env node
// Status board commands. Usage:
//   node .claude/team/team.mjs start ETM-1234
//   node .claude/team/team.mjs set <agent> <working|waiting|done|blocked|idle> "text" [--pct 0-100]
//   node .claude/team/team.mjs ask "question for the user"
//   node .claude/team/team.mjs ask --approve --options "ใช่ push|แก้ก่อน|ยังก่อน" "needs the user's yes (board or chat)"
//   node .claude/team/team.mjs ask --approve --gate defect --propose "log ETM-x" --why "..." --if-wrong "..." --undo no --evidence pic.jpg --check work/K/evidence-check/ID.compare.json "question"
//        (decision card; --gate defect|confirm|push makes it mandatory, defect/confirm need a fresh evidence check)
//   node .claude/team/team.mjs ask --later "a question that can wait"   (queued, not shown; urgent asks also pop a macOS notification)
//   node .claude/team/team.mjs inbox [--send]   (list the queued questions; --send asks them all as ONE question)
//   node .claude/team/team.mjs wait [--timeout <seconds>]   (waits for the answer given ON THE BOARD to the open question; prints ANSWER: <text>;
//        no time limit by default: run it once in the background right after `ask`)
//   node .claude/team/team.mjs answers   (board answers nobody has read yet and questions still open, all jobs; silent when none; used by the UserPromptSubmit hook)
//   node .claude/team/team.mjs answered --job ETM-1234 "the user's chat answer"   (the user answered in the chat: closes the question on the board)
//   node .claude/team/team.mjs clear
//   node .claude/team/team.mjs log "text"
//   node .claude/team/team.mjs link "Evidence report" <path or https url> --kind report   (shows in the board's LINKS panel)
//   node .claude/team/team.mjs close --job ETM-1234     (remove a finished job's tab)
//   node .claude/team/team.mjs open | stop | status
// Several cards at once: add --job ETM-1234 to start/set/ask/clear/log so each card has its own tab.
import fs from 'node:fs';
import { profile, escapeKey, syncActiveProfile } from '../../tools/profile.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const EVENTS = path.join(dir, 'events.jsonl');
const PIDFILE = path.join(dir, 'server.pid');
const PORT = Number(process.env.TEAM_PORT || 4777);
const URL_BASE = 'http://localhost:' + PORT;
const AGENTS = ['lead', 'analyst', 'inspector', 'designer', 'reviewer', 'automator', 'reporter', 'logger', 'manual', 'healer'];
const STATES = ['idle', 'working', 'waiting', 'done', 'blocked'];

const cmd = process.argv[2];
let args = process.argv.slice(3);
// --job <KEY> (or env TEAM_JOB) picks which card's board tab a command writes to; without it, the most recently started job
let JOB = process.env.TEAM_JOB || '';
{ const i = args.indexOf('--job'); if (i >= 0) { JOB = String(args[i + 1] || ''); args = args.filter((_, j) => j !== i && j !== i + 1); } }
const text = (a) => a.join(' ').replace(/\s+/g, ' ').trim().slice(0, 300);

const GATES = { defect: 'log a defect', confirm: 'confirm a manual Test as proposed', push: 'push results to Xray' };
/** Build and check the decision card of an ask. Throws with the missing parts. */
async function decisionCard(card, gateKind) {
  if (!gateKind && !Object.keys(card).length) return null;
  if (gateKind && !GATES[gateKind]) throw new Error(`--gate must be ${Object.keys(GATES).join(' | ')}`);
  const miss = [];
  if (gateKind) for (const f of ['propose', 'why', 'undo', 'ifWrong']) if (!card[f]) miss.push('--' + f.replace('ifWrong', 'if-wrong'));
  if (card.undo && !['yes', 'no', 'partial'].includes(card.undo)) miss.push('--undo yes|no|partial');
  if (['defect', 'confirm'].includes(gateKind) && !card.check) miss.push('--check work/<KEY>/evidence-check/<ID>.compare.json (tools/evidence-check.mjs)');
  if (gateKind === 'defect' && !card.evidence) miss.push('--evidence <one picture>');
  if (miss.length) throw new Error(`a --gate ${gateKind} question (${GATES[gateKind]}) needs: ${miss.join(', ')}`);
  const out = { ...card, gate: gateKind || null };
  if (card.evidence) {
    out.evidence = path.resolve(card.evidence);
    if (!fs.existsSync(out.evidence) || !/\.(png|jpe?g|webp|gif)$/i.test(out.evidence)) throw new Error(`--evidence ${card.evidence}: not a picture file`);
  }
  if (card.check) {
    const f = path.resolve(card.check);
    const id = path.basename(f).replace(/\.compare\.json$/, '');
    const key = (f.match(new RegExp(String.raw`work[\\/](${escapeKey(profile().jira.projectKey)}-\d+)[\\/]evidence-check`)) || [])[1];
    if (!key) throw new Error(`--check ${card.check}: expected work/<KEY>/evidence-check/<ID>.compare.json`);
    const ec = await import(new URL('../../tools/evidence-check.mjs', import.meta.url));
    const g = ec.gate(key, id, path.resolve(dir, '..', '..'));
    if (!g.ok) throw new Error(g.why);
    out.check = { result: g.cmp.result, line: ec.checkLine(g.cmp).slice(0, 400) };
  }
  return out;
}
const add = (ev) => fs.appendFileSync(EVENTS, JSON.stringify({ t: Date.now(), ...(JOB ? { job: JOB } : {}), ...ev }) + '\n');
const INBOX = path.join(dir, 'inbox.jsonl');
const readInbox = () => { try { return fs.readFileSync(INBOX, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; } };
// Desktop notification for an urgent question (macOS only, local, nothing leaves the machine). TEAM_NOTIFY=0 turns it off.
function notify(msg) {
  if (process.platform !== 'darwin' || process.env.TEAM_NOTIFY === '0') return;
  const esc = (v) => String(v).replace(/[\\"]/g, ' ').slice(0, 180);
  try { spawnSync('osascript', ['-e', `display notification "${esc(msg)}" with title "QA board: คำถามรอคำตอบ" sound name "Glass"`], { timeout: 3000 }); } catch {}
}

async function serverUp() {
  try {
    const r = await fetch(URL_BASE + '/state', { signal: AbortSignal.timeout(800) });
    return r.ok;
  } catch { return false; }
}

function openBrowser(url) {
  const p = process.platform;
  const c = p === 'win32' ? ['cmd', ['/c', 'start', '', url]] : p === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(c[0], c[1], { detached: true, stdio: 'ignore' }).unref(); } catch {}
}

async function ensureServer(openIt) {
  if (await serverUp()) return false;
  if (process.platform === 'win32') {
    // A plain detached child dies when the Claude Code shell that started it is closed. Creating it through WMI puts it outside that process tree.
    const q = (v) => String(v).replace(/'/g, "''");
    const ps = `Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{CommandLine='"${q(process.execPath)}" "${q(path.join(dir, 'serve.mjs'))}"'; CurrentDirectory='${q(dir)}'} | Out-Null`;
    try { spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(ps, 'utf16le').toString('base64')], { stdio: 'ignore', windowsHide: true, timeout: 15000 }); } catch {}   // wait for it: the shell may be closed right after this command
  } else {
    spawn(process.execPath, [path.join(dir, 'serve.mjs')], { detached: true, stdio: 'ignore' }).unref();
  }
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 150));
    if (await serverUp()) break;
  }
  if (openIt) openBrowser(URL_BASE);
  return true;
}

if (cmd === 'start') {
  const key = text(args) || profile().jira.projectKey;
  JOB = JOB || key;
  // restart only this job: drop its old events, keep the other jobs running
  let old = [];
  try { old = fs.readFileSync(EVENTS, 'utf8').split('\n').filter(Boolean); } catch {}
  const keep = old.filter((l) => { try { const e = JSON.parse(l); return e.job && e.job !== JOB; } catch { return false; } });
  fs.writeFileSync(EVENTS, keep.map((l) => l + '\n').join(''));
  add({ type: 'start', text: key });
  const started = await ensureServer(true);
  add({ type: 'set', agent: 'lead', state: 'working', text: 'เริ่มงาน ' + key });
  console.log('Board: ' + URL_BASE + (started ? ' (opened)' : ' (already running)'));
  // project rules for Claude: .claude/active-profile.md from profiles/<name>/rules.md (CLAUDE.md imports it); never stops start
  try {
    const s = syncActiveProfile();
    if (s.changed) console.log('project rules changed: re-read .claude/active-profile.md (from profiles/' + profile().name + '/rules.md)');
  } catch (e) { console.log('WARN active profile not written: ' + e.message + ' (run node tools/setup.mjs --sync-profile)'); }
  // the lead's AI-miss rules, printed at every card start so they cannot be skipped (TEAM.md "AI misses")
  try {
    const { show } = await import(new URL('../../tools/ai-miss.mjs', import.meta.url).href);
    console.log(show('lead'));
  } catch (e) { console.log('AI-miss rules not read: ' + e.message + ' (run node tools/ai-miss.mjs show lead)'); }
} else if (cmd === 'set') {
  const [agent, state, ...rest] = args;
  if (!AGENTS.includes(agent) || !STATES.includes(state)) {
    console.error('Usage: set <' + AGENTS.join('|') + '> <' + STATES.join('|') + '> "text"');
    process.exit(1);
  }
  let pct = null;
  const words = [];
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--pct') { const n = Number(rest[++i]); if (Number.isFinite(n)) pct = Math.max(0, Math.min(100, Math.round(n))); }
    else words.push(rest[i]);
  }
  add({ type: 'set', agent, state, text: text(words), pct });
} else if (cmd === 'ask') {
  let kind = 'info', options = [], later = false, gateKind = '';
  const rest = [], card = {};
  const CARD_FLAGS = { '--propose': 'propose', '--why': 'why', '--if-wrong': 'ifWrong', '--undo': 'undo', '--evidence': 'evidence', '--check': 'check' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--approve') kind = 'approve';
    else if (args[i] === '--later') later = true;
    else if (args[i] === '--gate') gateKind = String(args[++i] || '');
    else if (CARD_FLAGS[args[i]]) card[CARD_FLAGS[args[i]]] = String(args[++i] || '').replace(/\s+/g, ' ').trim().slice(0, 400);
    else if (args[i] === '--options') { const raw = String(args[++i] || ''); options = raw.split(raw.includes('|') ? '|' : ',').map((s) => s.trim().slice(0, 40)).filter(Boolean).slice(0, 4); }   // "a|b|c", or "a,b,c" when no | is used
    else rest.push(args[i]);
  }
  // Decision card (user, chat 2026-11-25, item 2): what the AI proposes, why, one picture, the cost of a wrong answer, undo.
  // --gate defect|confirm|push makes the card mandatory; defect and confirm also need a fresh independent evidence check.
  let cardOut = null;
  try { cardOut = await decisionCard(card, gateKind); } catch (e) { console.error('DECISION CARD: ' + e.message); process.exit(1); }
  if (later) {   // not urgent: queue it; `inbox --send` asks all queued questions in one go (TEAM.md "Questions to the user")
    fs.appendFileSync(INBOX, JSON.stringify({ t: Date.now(), job: JOB || '', text: text(rest) }) + '\n');
    console.log(`INBOX: queued (${readInbox().length} waiting). Send them together with: team.mjs inbox --send`);
  } else {
    if (cardOut?.evidence) add({ type: 'link', label: 'หลักฐานของคำถาม', kind: 'evidence', target: cardOut.evidence });
    add({ type: 'ask', text: text(rest), kind, options, ...(cardOut ? { card: cardOut } : {}) });
    add({ type: 'set', agent: 'lead', state: 'waiting', text: kind === 'approve' ? 'รออนุมัติ (บอร์ดหรือแชท)' : 'รอคำตอบจากคุณ' });
    notify(`${JOB ? JOB + ': ' : ''}${text(rest)}`);
  }
} else if (cmd === 'inbox') {
  const items = readInbox();
  if (!args.includes('--send')) {
    console.log(items.length ? items.map((x, i) => `${i + 1}. [${x.job || '-'}] ${x.text}`).join('\n') : 'INBOX: empty');
  } else if (!items.length) console.log('INBOX: empty, nothing sent');
  else {
    JOB = JOB || items[0].job;
    const q = `คำถามที่ไม่ด่วน ${items.length} ข้อ (ตอบทีเดียว เช่น 1=... 2=...): ` + items.map((x, i) => `${i + 1}) [${x.job || '-'}] ${x.text}`).join(' ');
    add({ type: 'ask', text: q.slice(0, 2000), kind: 'info', options: [] });
    add({ type: 'set', agent: 'lead', state: 'waiting', text: 'รอคำตอบชุดคำถาม' });
    fs.writeFileSync(INBOX, '');
    fs.appendFileSync(path.join(dir, 'inbox-sent.jsonl'), JSON.stringify({ t: Date.now(), job: JOB, items }) + '\n');
    notify(`${items.length} คำถามรอคำตอบบนบอร์ด`);
    console.log(`INBOX: sent ${items.length} questions as one question on ${JOB}`);
  }
} else if (cmd === 'wait') {
  // The answer is read from the board server, which only reports answers it received from the board page itself.
  // Exit 0 = answered (ANSWER: <text>), 3 = no answer in time, 4 = the question was closed another way (e.g. answered in chat).
  // No time limit by default: a wait that gave up after 9 minutes lost every board answer given later (nobody re-ran it).
  const num = (f, d) => { const i = args.indexOf(f); const v = i >= 0 ? Number(args[i + 1]) : NaN; return Number.isFinite(v) && v > 0 ? v : d; };
  const limit = num('--timeout', 0) * 1000, poll = num('--poll', 1.5) * 1000, t0 = Date.now(); let seen = false;
  if (!JOB) {   // no --job: lock onto the card whose question is open now, or the answer would be lost when another card becomes the default
    try { const s0 = await (await fetch(URL_BASE + '/state', { signal: AbortSignal.timeout(3000) })).json(); if (s0 && (s0.ask || s0.answer) && s0.job) JOB = s0.job; else { const j = (s0?.jobs || []).find((x) => x.answered) || (s0?.jobs || []).find((x) => x.ask); if (j) JOB = j.key; } } catch {}
  }
  console.log(limit ? `WAITING: up to ${limit / 1000} s for the board answer${JOB ? ' (' + JOB + ')' : ''}` : `WAITING: no time limit, until the board answers or the question is closed${JOB ? ' (' + JOB + ')' : ''}`);
  for (;;) {
    let s = null; try { s = await (await fetch(URL_BASE + '/state' + (JOB ? '?job=' + encodeURIComponent(JOB) : ''), { signal: AbortSignal.timeout(3000) })).json(); } catch {}
    if (s && s.ask) seen = true;
    if (s && s.answer) {
      console.log('QUESTION: ' + s.answer.question + '\nANSWER: ' + s.answer.text + '\n(answered on the board at ' + new Date(s.answer.at).toLocaleTimeString() + ', job ' + s.job + ')');
      if (!s.answer.read) { JOB = s.job; add({ type: 'read', askAt: s.answer.askAt }); }   // read: the hook stops reminding about it
      process.exit(0);
    }
    if (s && !s.ask && !s.answer) { console.log(seen ? 'CLOSED: the question was closed without a board answer (answered in the chat, or cleared)' : 'NO QUESTION: nothing is open on the board'); process.exit(4); }
    if (limit && Date.now() - t0 > limit) { console.log('TIMEOUT: no answer on the board yet'); process.exit(3); }
    await new Promise((r) => setTimeout(r, poll));
  }
} else if (cmd === 'answers') {
  // Runs on every chat message (UserPromptSubmit hook; the hook passes the message as JSON on stdin). Silent when there is nothing, or the board is down.
  // 1. board answers nobody has read yet: not an approval by itself, it tells the lead to run `wait --job <KEY>`, whose ANSWER: line is the approval.
  // 2. a chat message that is one of the answer buttons of the one open question that has it: the question is closed on the board at once
  //    (the chat message itself is the user's answer; this only keeps the board in step).
  // 3. other questions still open: the lead is told to close them with `answered` if the message answers one.
  const get = async (q) => { try { return await (await fetch(URL_BASE + '/state' + q, { signal: AbortSignal.timeout(1500) })).json(); } catch { return null; } };
  let prompt = '';
  if (!process.stdin.isTTY) {
    prompt = await new Promise((res) => { let d = ''; const t = setTimeout(() => res(d), 700); process.stdin.on('data', (c) => { d += c; }); process.stdin.on('end', () => { clearTimeout(t); res(d); }); process.stdin.on('error', () => res('')); });
    try { prompt = String(JSON.parse(prompt).prompt || ''); } catch { prompt = ''; }
  }
  const norm = (v) => String(v).replace(/\s+/g, ' ').trim().toLowerCase();
  const msg = norm(prompt);
  const all = await get('');
  const jobs = all?.jobs || [], lines = [], open = [];
  for (const j of jobs.filter((x) => x.answered || x.ask)) {
    const k = j.key || j.ticket, s = await get('?job=' + encodeURIComponent(k));
    if (s?.answer && !s.answer.read) lines.push(`${k}: the user answered on the board "${String(s.answer.text).slice(0, 200)}" to "${String(s.answer.question || '').slice(0, 120)}". Read it with: node .claude/team/team.mjs wait --job ${k}`);
    else if (s?.ask) open.push({ k, ask: s.ask, hit: msg.length >= 2 && (s.ask.options || []).some((o) => { const n = norm(o); return n && (msg === n || msg.startsWith(n) || (n.startsWith(msg) && msg.length >= 4)); }) });
  }
  const hits = open.filter((o) => o.hit), closed = [];
  if (hits.length === 1) {   // only when it is clear which question the message answers
    JOB = hits[0].k; add({ type: 'chat', text: prompt.replace(/\s+/g, ' ').trim().slice(0, 300) }); add({ type: 'set', agent: 'lead', state: 'working', text: 'ได้คำตอบจากแชท' });
    closed.push(hits[0].k);
  }
  const rest = open.filter((o) => !closed.includes(o.k));
  if (lines.length) console.log('BOARD ANSWERS NOT READ YET:\n' + lines.join('\n'));
  if (closed.length) console.log(`BOARD QUESTION CLOSED: the user's message matches an answer button of ${closed[0]}, so the board question was closed (chat answer logged). Nothing more to do on the board for it.`);
  if (rest.length) console.log('ACTION NEEDED - BOARD QUESTIONS STILL OPEN. If the user\'s message answers one of these, run the command shown for it right away, or the board keeps showing the question:\n'
    + rest.map((o) => `${o.k}: "${String(o.ask.text || '').slice(0, 160)}"${o.ask.options?.length ? ' (buttons: ' + o.ask.options.join(' | ') + ')' : ''}\n  -> node .claude/team/team.mjs answered --job ${o.k} "<the user's answer>"`).join('\n'));
} else if (cmd === 'answered') {
  // The user answered the open question in the chat: close it on the board, show the answer in the log, and end the background `wait` (CLOSED).
  const t = text(args);
  if (!t) { console.error('Usage: answered --job <KEY> "the user\'s answer from the chat"'); process.exit(1); }
  add({ type: 'chat', text: t });
  add({ type: 'set', agent: 'lead', state: 'working', text: 'ได้คำตอบจากแชท' });
} else if (cmd === 'clear') {
  add({ type: 'clear' });
  add({ type: 'set', agent: 'lead', state: 'working', text: 'ทำงานต่อ' });
} else if (cmd === 'log') {
  add({ type: 'log', text: text(args) });
} else if (cmd === 'link') {
  // link "<label>" <https://url | local file path> [--kind report|tc|defect|other]
  let kind = 'other'; const rest = [];
  for (let i = 0; i < args.length; i++) { if (args[i] === '--kind') kind = String(args[++i] || 'other'); else rest.push(args[i]); }
  const target = rest.pop(), label = text(rest);
  if (!target || !label) { console.error('Usage: link "<label>" <url or file path> [--kind report|tc|defect|other]'); process.exit(1); }
  add({ type: 'link', label, kind, target: /^https?:\/\//i.test(target) ? target : path.resolve(target) });
} else if (cmd === 'close') {
  add({ type: 'close' });   // remove a finished job's tab: close --job ETM-1234
} else if (cmd === 'open') {
  await ensureServer(false);
  openBrowser(URL_BASE);
} else if (cmd === 'stop') {
  try { process.kill(Number(fs.readFileSync(PIDFILE, 'utf8'))); console.log('stopped'); } catch { console.log('not running'); }
} else if (cmd === 'status') {
  try { console.log(JSON.stringify(await (await fetch(URL_BASE + '/state')).json(), null, 2)); } catch { console.log('board not running'); }
} else {
  console.log('Commands: start <KEY> | set <agent> <state> "text" | ask "text" | wait | answers | answered "text" | clear | log "text" | open | stop | status');
}

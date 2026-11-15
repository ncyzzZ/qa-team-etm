#!/usr/bin/env node
// Status board commands. Usage:
//   node .claude/team/team.mjs start ETM-1234
//   node .claude/team/team.mjs set <agent> <working|waiting|done|blocked|idle> "text" [--pct 0-100]
//   node .claude/team/team.mjs ask "question for the user"
//   node .claude/team/team.mjs ask --approve --options "ใช่ push|แก้ก่อน|ยังก่อน" "needs the user's yes (board or chat)"
//   node .claude/team/team.mjs wait [--timeout 540]   (waits for the answer given ON THE BOARD to the open question; prints ANSWER: <text>)
//   node .claude/team/team.mjs clear
//   node .claude/team/team.mjs log "text"
//   node .claude/team/team.mjs link "Evidence report" <path or https url> --kind report   (shows in the board's LINKS panel)
//   node .claude/team/team.mjs close --job ETM-1234     (remove a finished job's tab)
//   node .claude/team/team.mjs open | stop | status
// Several cards at once: add --job ETM-1234 to start/set/ask/clear/log so each card has its own tab.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const dir = path.dirname(fileURLToPath(import.meta.url));
const EVENTS = path.join(dir, 'events.jsonl');
const PIDFILE = path.join(dir, 'server.pid');
const PORT = Number(process.env.TEAM_PORT || 4777);
const URL_BASE = 'http://localhost:' + PORT;
const AGENTS = ['lead', 'analyst', 'inspector', 'designer', 'reviewer', 'automator', 'reporter', 'logger'];
const STATES = ['idle', 'working', 'waiting', 'done', 'blocked'];

const cmd = process.argv[2];
let args = process.argv.slice(3);
// --job <KEY> (or env TEAM_JOB) picks which card's board tab a command writes to; without it, the most recently started job
let JOB = process.env.TEAM_JOB || '';
{ const i = args.indexOf('--job'); if (i >= 0) { JOB = String(args[i + 1] || ''); args = args.filter((_, j) => j !== i && j !== i + 1); } }
const text = (a) => a.join(' ').replace(/\s+/g, ' ').trim().slice(0, 300);
const add = (ev) => fs.appendFileSync(EVENTS, JSON.stringify({ t: Date.now(), ...(JOB ? { job: JOB } : {}), ...ev }) + '\n');

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
  const key = text(args) || 'ETM';
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
  let kind = 'info', options = [];
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--approve') kind = 'approve';
    else if (args[i] === '--options') options = String(args[++i] || '').split('|').map((s) => s.trim().slice(0, 40)).filter(Boolean).slice(0, 4);
    else rest.push(args[i]);
  }
  add({ type: 'ask', text: text(rest), kind, options });
  add({ type: 'set', agent: 'lead', state: 'waiting', text: kind === 'approve' ? 'รออนุมัติ (บอร์ดหรือแชท)' : 'รอคำตอบจากคุณ' });
} else if (cmd === 'wait') {
  // The answer is read from the board server, which only reports answers it received from the board page itself.
  // Exit 0 = answered (ANSWER: <text>), 3 = no answer in time, 4 = the question was closed another way (e.g. answered in chat).
  const i = args.indexOf('--timeout'); const limit = (i >= 0 ? Number(args[i + 1]) : 540) * 1000; const t0 = Date.now(); let seen = false;
  for (;;) {
    let s = null; try { s = await (await fetch(URL_BASE + '/state' + (JOB ? '?job=' + encodeURIComponent(JOB) : ''), { signal: AbortSignal.timeout(3000) })).json(); } catch {}
    if (s && s.ask) seen = true;
    if (s && s.answer) { console.log('QUESTION: ' + s.answer.question + '\nANSWER: ' + s.answer.text + '\n(answered on the board at ' + new Date(s.answer.at).toLocaleTimeString() + ', job ' + s.job + ')'); process.exit(0); }
    if (s && !s.ask && !s.answer) { console.log(seen ? 'CLOSED: the question was cleared without a board answer' : 'NO QUESTION: nothing is open on the board'); process.exit(4); }
    if (Date.now() - t0 > limit) { console.log('TIMEOUT: no answer on the board yet'); process.exit(3); }
    await new Promise((r) => setTimeout(r, 1500));
  }
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
  console.log('Commands: start <KEY> | set <agent> <state> "text" | ask "text" | clear | log "text" | open | stop | status');
}

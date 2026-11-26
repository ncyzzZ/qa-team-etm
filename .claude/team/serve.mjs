// Tiny local server for the status board. Listens on this computer only (127.0.0.1).
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { phaseOf } from '../../tools/state/core.mjs';
import { profile } from '../../tools/profile.mjs';

/** Board heading: profile board.title, else "QA team (<KEY>)"; plain text (HTML-escaped). */
function boardTitle() {
  let t = 'QA team';
  try { const p = profile(); t = p.board?.title || `QA team (${p.jira.projectKey})`; } catch {}
  return t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
const ROOT_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const dir = path.dirname(fileURLToPath(import.meta.url));
const EVENTS = path.join(dir, 'events.jsonl');
const PORT = Number(process.env.TEAM_PORT || 4777);
const AGENTS = ['lead', 'analyst', 'inspector', 'designer', 'reviewer', 'automator', 'reporter', 'logger', 'manual', 'healer'];

// Answers typed on the board. TOKEN is put into the board page only (other web sites cannot read it), SECRET never leaves
// this process: an "answer" line in events.jsonl counts only when this server signed it, so nothing else can write a yes.
const TOKEN = crypto.randomBytes(16).toString('hex');
// SECRET is kept in a git-ignored file readable only by this user, so a server restart (reboot, git pull) keeps every board answer valid.
const SECRET_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '.board-secret');
const SECRET = (() => {
  try { const b = Buffer.from(fs.readFileSync(SECRET_FILE, 'utf8').trim(), 'hex'); if (b.length === 32) return b; } catch {}
  const b = crypto.randomBytes(32);
  try { fs.writeFileSync(SECRET_FILE, b.toString('hex') + '\n', { mode: 0o600 }); } catch {}
  return b;
})();
const sign = (job, askAt, text) => crypto.createHmac('sha256', SECRET).update(`${job}\n${askAt}\n${text}`).digest('hex');
const HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);

function blank(t) {
  const agents = {};
  for (const a of AGENTS) agents[a] = { state: 'idle', task: '', at: t };
  return agents;
}

// Links: https URLs open directly. Local files (e.g. the HTML evidence report) are served by this board from the
// folder of each file registered with `team.mjs link`, because the browser blocks file:// links from http pages.
const OK_EXT = new Set(['.html', '.htm', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.webm', '.mp4', '.pdf', '.txt', '.csv']);
const dirKey = (d) => crypto.createHash('sha1').update(d).digest('hex').slice(0, 8);
function linkHref(target) {
  if (/^https?:\/\//i.test(target)) return target;
  return '/f/' + dirKey(path.dirname(target)) + '/' + encodeURIComponent(path.basename(target));
}
function linkDirs() {
  const m = new Map();
  let lines = [];
  try { lines = fs.readFileSync(EVENTS, 'utf8').split('\n').filter(Boolean); } catch {}
  for (const l of lines) {
    try { const e = JSON.parse(l); if (e.type === 'link' && !/^https?:\/\//i.test(e.target)) m.set(dirKey(path.dirname(e.target)), path.dirname(e.target)); } catch {}
  }
  return m;
}

function newJob(key, t) { return { ticket: key, startedAt: t, agents: blank(t), ask: null, log: [], links: [] }; }

function jobState(j) {
  const v = Object.values(j.agents).map((a) => a.state);
  if (j.ask) return 'waiting';
  if (v.includes('blocked')) return 'blocked';
  if (v.includes('working')) return 'working';
  if (v.includes('waiting')) return 'waiting';
  if (v.includes('done')) return 'done';
  return 'idle';
}

// Many jobs (cards) can run at once. Events carry an optional "job"; without one they go to the most recently started job.
function reduce(want) {
  const jobs = new Map();
  let cur = null;
  let lines = [];
  try { lines = fs.readFileSync(EVENTS, 'utf8').split('\n').filter(Boolean); } catch {}
  for (const l of lines) {
    let e;
    try { e = JSON.parse(l); } catch { continue; }
    if (e.type === 'start') {
      const k = e.job || e.text; jobs.set(k, newJob(e.text, e.t)); cur = k; continue;
    }
    const k = e.job || cur;
    if (e.type === 'close') { jobs.delete(k); if (cur === k) cur = [...jobs.keys()].pop() || null; continue; }
    if (!k) continue;
    if (!jobs.has(k)) jobs.set(k, newJob(k, e.t));
    const s = jobs.get(k);
    if (e.type === 'set' && s.agents[e.agent]) {
      s.agents[e.agent] = { state: e.state, task: e.text, at: e.t, pct: e.pct == null ? null : e.pct };
      s.log.push({ t: e.t, agent: e.agent, state: e.state, text: e.text });
    } else if (e.type === 'ask') {
      s.ask = { text: e.text, at: e.t, kind: e.kind || 'info', options: e.options || [], ...(e.card ? { card: e.card } : {}) };
      s.answer = null;
    } else if (e.type === 'answer') {
      if (s.ask && s.ask.at === e.askAt && e.sig === sign(k, e.askAt, e.text)) {
        s.answer = { text: e.text, at: e.t, askAt: e.askAt, question: s.ask.text, kind: s.ask.kind, read: false };
        s.ask = null;
        s.log.push({ t: e.t, agent: 'lead', state: 'info', text: 'ตอบจากบอร์ด: ' + e.text.replace(/\s+/g, ' ').slice(0, 120) });
      }
    } else if (e.type === 'read') {
      // `team.mjs wait` printed this board answer to the chat: the hook stops reminding about it
      if (s.answer && s.answer.askAt === e.askAt) s.answer.read = true;
    } else if (e.type === 'chat') {
      // the user answered in the chat (`team.mjs answered`): close the open question on the board and show the answer in the log
      if (s.ask) s.log.push({ t: e.t, agent: 'lead', state: 'info', text: 'ตอบในแชท: ' + String(e.text || '').replace(/\s+/g, ' ').slice(0, 120) });
      s.ask = null; s.answer = null;
    } else if (e.type === 'link') {
      const i = s.links.findIndex((x) => x.target === e.target);
      const L = { label: e.label, kind: e.kind || 'other', target: e.target, t: e.t };
      if (i >= 0) s.links[i] = L; else s.links.push(L);
    } else if (e.type === 'clear') {
      s.ask = null; s.answer = null;
    } else if (e.type === 'log') {
      s.log.push({ t: e.t, agent: 'lead', state: 'info', text: e.text });
    }
  }
  const list = [...jobs.entries()].map(([key, j]) => ({
    key, ticket: j.ticket, startedAt: j.startedAt, ask: !!j.ask, answered: !!(j.answer && !j.answer.read),
    active: Object.values(j.agents).filter((a) => a.state !== 'idle').length,
    state: jobState(j),
    ...phaseOf(key, ROOT_REPO), // card phase from .claude/team/work/<KEY>/state.json (read only)
  }));
  let k = want && jobs.has(want) ? want : (list.find((j) => j.ask) || list[list.length - 1] || {}).key;
  const s = jobs.get(k) || { ticket: '', startedAt: Date.now(), agents: blank(Date.now()), ask: null, answer: null, log: [], links: [] };
  const out = { ...s, job: k || null, jobs: list };
  out.log = s.log.slice(-150);
  out.links = s.links.map((l) => ({ label: l.label, kind: l.kind, href: linkHref(l.target) }));
  if (s.ask?.card) out.ask = { ...s.ask, card: { ...s.ask.card, evidence: undefined, evidenceHref: s.ask.card.evidence ? linkHref(s.ask.card.evidence) : null } };
  out.now = Date.now();
  return out;
}

const MIME = { '.png': 'image/png', '.json': 'application/json', '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.startsWith('/assets/') || urlPath === '/sheet.html') {
    const file = path.resolve(dir, '.' + urlPath);
    const ok = file.startsWith(path.join(dir, 'assets') + path.sep) || file === path.join(dir, 'sheet.html');
    try {
      if (!ok) throw new Error('outside');
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(fs.readFileSync(file));
    } catch { res.writeHead(404); res.end('not found'); }
  } else if (urlPath.startsWith('/f/')) {
    const [, , key, ...rel] = urlPath.split('/');
    try {
      const base = linkDirs().get(key); if (!base) throw new Error('unknown');
      const file = path.resolve(base, rel.join('/'));
      const ext = path.extname(file).toLowerCase();
      if (!file.startsWith(base + path.sep) || !OK_EXT.has(ext)) throw new Error('outside');
      const TY = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webm': 'video/webm', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8' };
      res.writeHead(200, { 'content-type': TY[ext] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(fs.readFileSync(file));
    } catch { res.writeHead(404); res.end('not found'); }
  } else if (urlPath === '/answer') {
    // The user's answer to the open question, sent by the board page. Refused unless it comes from this board page
    // (same host, same origin, the page's token) and matches the question that is open right now.
    const deny = (code, msg) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: msg })); };
    const origin = req.headers.origin;
    if (req.method !== 'POST') return deny(405, 'POST only');
    if (!HOSTS.has(req.headers.host || '') || (origin && !HOSTS.has(origin.replace(/^http:\/\//, '')))) return deny(403, 'wrong host');
    if (req.headers['x-board-token'] !== TOKEN) return deny(403, 'reload the board');
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 40000) req.destroy(); });
    req.on('end', () => {
      let b; try { b = JSON.parse(body); } catch { return deny(400, 'bad json'); }
      // long, many-line answers (e.g. pasted from the BA) are kept as typed
      const text = String(b.text || '').replace(/\r\n?/g, '\n').trim().slice(0, 4000);
      const s = reduce(b.job);
      if (!text) return deny(400, 'empty answer');
      if (!s.job || s.job !== b.job || !s.ask || s.ask.at !== b.askAt) return deny(409, 'that question is no longer open');
      const t = Date.now();
      fs.appendFileSync(EVENTS, JSON.stringify({ t, job: s.job, type: 'answer', askAt: b.askAt, text, sig: sign(s.job, b.askAt, text) }) + '\n'
        + JSON.stringify({ t, job: s.job, type: 'set', agent: 'lead', state: 'working', text: 'ได้คำตอบจากบอร์ด' }) + '\n');
      res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true }));
    });
  } else if (urlPath === '/close') {
    // Close one card's tab from the board (same checks as /answer). Writes the same "close" event as `team.mjs close`.
    const deny = (code, msg) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: msg })); };
    const origin = req.headers.origin;
    if (req.method !== 'POST') return deny(405, 'POST only');
    if (!HOSTS.has(req.headers.host || '') || (origin && !HOSTS.has(origin.replace(/^http:\/\//, '')))) return deny(403, 'wrong host');
    if (req.headers['x-board-token'] !== TOKEN) return deny(403, 'reload the board');
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 2000) req.destroy(); });
    req.on('end', () => {
      let b; try { b = JSON.parse(body); } catch { return deny(400, 'bad json'); }
      const s = reduce(b.job);
      if (!s.job || s.job !== b.job) return deny(404, 'no such card');
      fs.appendFileSync(EVENTS, JSON.stringify({ t: Date.now(), job: s.job, type: 'close' }) + '\n');
      res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true }));
    });
  } else if (req.url.startsWith('/state')) {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify(reduce(new URL(req.url, 'http://x').searchParams.get('job'))));
  } else {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(fs.readFileSync(path.join(dir, 'board.html'), 'utf8').replace('{{BOARD_TITLE}}', boardTitle()).replace('<script>', `<script>window.BOARD_TOKEN=${JSON.stringify(TOKEN)};</script>\n<script>`));
  }
});
server.on('error', () => process.exit(0));
server.listen(PORT, '127.0.0.1', () => {
  fs.writeFileSync(path.join(dir, 'server.pid'), String(process.pid));
});

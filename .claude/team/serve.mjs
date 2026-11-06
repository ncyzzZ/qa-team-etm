// Tiny local server for the status board. Listens on this computer only (127.0.0.1).
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const EVENTS = path.join(dir, 'events.jsonl');
const PORT = Number(process.env.TEAM_PORT || 4777);
const AGENTS = ['lead', 'analyst', 'inspector', 'designer', 'reviewer', 'automator', 'reporter', 'logger'];

// Token usage comes from the Claude Code transcripts of this project (read-only, local files).
const PROJ = process.env.TEAM_TRANSCRIPTS ||
  path.join(os.homedir(), '.claude', 'projects', path.resolve(dir, '..', '..').replace(/[^A-Za-z0-9]/g, '-'));
const fileCache = new Map();
let tokCache = { at: 0, since: 0, val: null };

function walk(d, out = []) {
  let ents = [];
  try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'tool-results' && e.name !== 'memory') walk(p, out); }
    else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}

function fileMessages(p, st) {
  const c = fileCache.get(p);
  if (c && c.size === st.size && c.mtime === st.mtimeMs) return c.msgs;
  const msgs = new Map();
  const side = p.includes(path.sep + 'subagents' + path.sep);
  for (const l of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!l.includes('"usage"')) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    const u = e.message && e.message.usage;
    if (!u) continue;
    msgs.set(e.message.id || e.uuid, { t: Date.parse(e.timestamp), side: side || !!e.isSidechain,
      i: u.input_tokens || 0, o: u.output_tokens || 0, cw: u.cache_creation_input_tokens || 0, cr: u.cache_read_input_tokens || 0 });
  }
  fileCache.set(p, { size: st.size, mtime: st.mtimeMs, msgs });
  return msgs;
}

function tokens(since) {
  const now = Date.now();
  if (tokCache.val && tokCache.since === since && now - tokCache.at < 2000) return tokCache.val;
  const r = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, calls: 0, mainTotal: 0, subTotal: 0, total: 0 };
  try {
    for (const p of walk(PROJ)) {
      const st = fs.statSync(p);
      if (st.mtimeMs < since) continue;
      for (const m of fileMessages(p, st).values()) {
        if (!(m.t >= since)) continue;
        const sum = m.i + m.o + m.cw + m.cr;
        r.input += m.i; r.output += m.o; r.cacheWrite += m.cw; r.cacheRead += m.cr; r.calls++;
        r.total += sum; if (m.side) r.subTotal += sum; else r.mainTotal += sum;
      }
    }
  } catch {}
  tokCache = { at: now, since, val: r };
  return r;
}

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
      s.ask = { text: e.text, at: e.t, kind: e.kind || 'info', options: e.options || [] };
    } else if (e.type === 'link') {
      const i = s.links.findIndex((x) => x.target === e.target);
      const L = { label: e.label, kind: e.kind || 'other', target: e.target, t: e.t };
      if (i >= 0) s.links[i] = L; else s.links.push(L);
    } else if (e.type === 'clear') {
      s.ask = null;
    } else if (e.type === 'log') {
      s.log.push({ t: e.t, agent: 'lead', state: 'info', text: e.text });
    }
  }
  const list = [...jobs.entries()].map(([key, j]) => ({
    key, ticket: j.ticket, startedAt: j.startedAt, ask: !!j.ask,
    active: Object.values(j.agents).filter((a) => a.state !== 'idle').length,
    state: jobState(j),
  }));
  let k = want && jobs.has(want) ? want : (list.find((j) => j.ask) || list[list.length - 1] || {}).key;
  const s = jobs.get(k) || { ticket: '', startedAt: Date.now(), agents: blank(Date.now()), ask: null, log: [], links: [] };
  const out = { ...s, job: k || null, jobs: list };
  out.log = s.log.slice(-40);
  out.links = s.links.map((l) => ({ label: l.label, kind: l.kind, href: linkHref(l.target) }));
  out.tokens = tokens(s.startedAt);
  try { out.usage = JSON.parse(fs.readFileSync(path.join(dir, 'usage.json'), 'utf8')); } catch { out.usage = null; }
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
  } else if (req.url.startsWith('/state')) {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify(reduce(new URL(req.url, 'http://x').searchParams.get('job'))));
  } else {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(fs.readFileSync(path.join(dir, 'board.html')));
  }
});
server.on('error', () => process.exit(0));
server.listen(PORT, '127.0.0.1', () => {
  fs.writeFileSync(path.join(dir, 'server.pid'), String(process.pid));
});

#!/usr/bin/env node
// cue-recall.mjs - give the AI the rule it needs at the moment it needs it (cued recall), instead of a long file it
// must remember (user, chat 2026-11-26: "cue and recall", Shutdown Logic first).
//
// Rules live in .claude/team/knowledge/cues/<page>.md (written once, with sources); <page>.cues.json maps cues to sections:
//   pageCue   regex; when the work touches the page (a path, a URL, a word), the "## Layer 1" rules are given once
//   blocks[]  regex per action (paste, filter, dependency ...); a block is given once, and only while the page is active
// Hook (PostToolUse on Read/Edit/Write/Bash/Agent, and UserPromptSubmit): reads the event from stdin, prints
// additionalContext with the new blocks (at most 3 per event). Each block is given again only after 3 hours (or a new session).
// Every give is logged in .claude/team/work/cue-fired.jsonl (local) to measure whether the misses go down.
//
//   node tools/cue-recall.mjs test "<text>" [--path <file>]   print what would be given (no state)
//   node tools/cue-recall.mjs stats                            how often each block was given
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CUES = path.join(ROOT, '.claude', 'team', 'knowledge', 'cues');
const LOG = process.env.CUE_LOG || path.join(ROOT, '.claude', 'team', 'work', 'cue-fired.jsonl');
export const AGAIN_MS = 3 * 3600e3;
export const MAX_BLOCKS = 3;

/** All pages: [{page, pageRe, pageText, blocks:[{id, re, text}]}] */
export function loadPages(dir = CUES) {
  const out = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.cues.json')) : []) {
    try {
      const c = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const md = fs.readFileSync(path.join(dir, c.rules), 'utf8');
      out.push({
        page: c.page,
        pageRe: new RegExp(c.pageCue, 'i'),
        pageText: section(md, c.pageSection),
        blocks: c.blocks.map((b) => ({ id: b.id, re: new RegExp(b.cue, 'i'), text: section(md, b.section) })).filter((b) => b.text),
      });
    } catch { /* a broken cue file never blocks the session */ }
  }
  return out;
}

/** Text of a markdown section from its heading to the next heading of the same or a higher level (without "Cue:" lines). */
export function section(md, heading) {
  const lines = md.split('\n');
  const i = lines.findIndex((l) => l.startsWith(heading));
  if (i < 0) return '';
  const level = heading.match(/^#+/)[0].length;
  const body = [];
  for (const l of lines.slice(i + 1)) { const h = l.match(/^(#+)\s/); if (h && h[1].length <= level) break; if (/^Cue:/.test(l)) continue; body.push(l); }
  return body.join('\n').trim();
}

/** What the event is about: paths, commands, written text, prompts. A Read gives only its path (its content would fire every block). */
export function eventText(e) {
  const i = e.tool_input || {};
  if (e.hook_event_name === 'UserPromptSubmit') return { path: '', text: String(e.prompt || '') };
  const p = String(i.file_path || i.path || i.notebook_path || '');
  if (e.tool_name === 'Read') return { path: p, text: '' };
  const text = [i.command, i.content, i.new_string, i.old_string, i.prompt, i.description].filter(Boolean).join('\n');
  return { path: p, text };
}

/**
 * Pure decision. @param state {pages:{[page]:t}, blocks:{[page/id]:t}} last give times; @returns {give:[{page,id,text}], state}
 * The page rules come when the page cue matches; action blocks only when the page is active (cue now, or given in the last 3 h).
 */
export function decide(pages, { path: p, text }, state = { pages: {}, blocks: {} }, now = Date.now()) {
  const give = [];
  const st = { pages: { ...state.pages }, blocks: { ...state.blocks } };
  const all = `${p}\n${text}`;
  for (const pg of pages) {
    const hit = pg.pageRe.test(all);
    const active = hit || (st.pages[pg.page] && now - st.pages[pg.page] < AGAIN_MS);
    if (!active) continue;
    if (hit && !(st.pages[pg.page] && now - st.pages[pg.page] < AGAIN_MS)) {
      give.push({ page: pg.page, id: 'page', text: `${pg.pageText}\n\nAction rules come by themselves when you work on: ${pg.blocks.map((b) => b.id).join(', ')}.` });
    }
    if (hit) st.pages[pg.page] = now;
    let n = 0;
    for (const b of pg.blocks) {
      const k = `${pg.page}/${b.id}`;
      if (n >= MAX_BLOCKS || !b.re.test(text) || (st.blocks[k] && now - st.blocks[k] < AGAIN_MS)) continue;
      give.push({ page: pg.page, id: b.id, text: b.text }); st.blocks[k] = now; n++;
    }
  }
  return { give, state: st };
}

export const render = (give) => give.map((g) => `[cue: ${g.page} / ${g.id}] Rules for what you are doing now (source: .claude/team/knowledge/cues/):\n${g.text}`).join('\n\n');

const stateFile = (session) => path.join(os.tmpdir(), `cue-recall-${String(session || 'none').replace(/[^\w-]/g, '')}.json`);

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'test') {
    const pi = rest.indexOf('--path');
    const r = decide(loadPages(), { path: pi >= 0 ? rest[pi + 1] : '', text: rest.filter((x, i) => x !== '--path' && rest[i - 1] !== '--path').join(' ') });
    console.log(r.give.length ? render(r.give) : '(nothing would be given)');
  } else if (cmd === 'stats') {
    const c = {};
    for (const l of (fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '').split('\n').filter(Boolean)) { try { const x = JSON.parse(l); c[`${x.page}/${x.id}`] = (c[`${x.page}/${x.id}`] || 0) + 1; } catch { /* skip */ } }
    for (const [k, v] of Object.entries(c).sort((a, b) => b[1] - a[1])) console.log(`${String(v).padStart(4)}  ${k}`);
    if (!Object.keys(c).length) console.log('no cue given yet');
  } else {
    // hook mode
    try {
      const e = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
      const sf = stateFile(e.session_id);
      let state; try { state = JSON.parse(fs.readFileSync(sf, 'utf8')); } catch { state = { pages: {}, blocks: {} }; }
      const r = decide(loadPages(), eventText(e), state);
      fs.writeFileSync(sf, JSON.stringify(r.state));
      if (r.give.length) {
        try { fs.mkdirSync(path.dirname(LOG), { recursive: true }); for (const g of r.give) fs.appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), session: e.session_id, page: g.page, id: g.id, tool: e.tool_name || e.hook_event_name }) + '\n'); } catch { /* log is optional */ }
        console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: e.hook_event_name || 'PostToolUse', additionalContext: render(r.give) } }));
      }
    } catch { /* a hook never blocks the session */ }
  }
}

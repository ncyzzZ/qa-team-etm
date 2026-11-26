#!/usr/bin/env node
// ai-miss.mjs - the log of times the user caught an AI agent being wrong, and the rule that stops it next time.
// Lives in .claude/team/knowledge/ai-misses.jsonl (one JSON line per miss). The lead writes it when the user corrects
// an agent; every agent reads only its own rules at start (`show <id>`). A line here is never an approval.
//
//   node tools/ai-miss.mjs add --agent <id|all> --kind <kind> --wrong "<what the AI did>" --right "<what is correct>"
//                              --rule "<what to do from now on>" [--card <KEY>-1234] [--caught "<how the user saw it>"]
//   node tools/ai-miss.mjs show <agent-id>     active rules for that agent (plus "all"), one line each
//   node tools/ai-miss.mjs list [--all]        every active miss, readable (with --all also retired ones)
//   node tools/ai-miss.mjs stats               count per agent and kind
//   node tools/ai-miss.mjs retire <M-n> "<why>"   a rule that turned out wrong or no longer needed
import { isKey, profile } from './profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const AGENTS = ['all', 'lead', 'analyst', 'inspector', 'designer', 'reviewer', 'automator', 'logger', 'manual', 'reporter', 'healer'];
export const KINDS = ['verdict', 'invented', 'missed-case', 'wrong-fact', 'locator', 'wording', 'data', 'process', 'other'];

export function file() {
  return process.env.AI_MISS_FILE || path.join(ROOT, '.claude/team/knowledge/ai-misses.jsonl');
}

export function load(f = file()) {
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim()).map((l, i) => {
    try { return JSON.parse(l); } catch { throw new Error(`${f} line ${i + 1} is not valid JSON`); }
  });
}

function save(list, f = file()) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, list.map((m) => JSON.stringify(m)).join('\n') + (list.length ? '\n' : ''));
}

function flags(args) {
  const o = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const k = args[i].slice(2);
      const v = args[i + 1];
      if (v === undefined || v.startsWith('--')) o[k] = true; else { o[k] = v; i++; }
    } else o._.push(args[i]);
  }
  return o;
}

export function add(o, f = file()) {
  const miss = [];
  for (const k of ['agent', 'kind', 'wrong', 'right', 'rule']) if (!o[k] || o[k] === true) miss.push(`--${k}`);
  if (miss.length) throw new Error(`missing ${miss.join(', ')}`);
  if (!AGENTS.includes(o.agent)) throw new Error(`--agent must be one of: ${AGENTS.join(', ')}`);
  if (!KINDS.includes(o.kind)) throw new Error(`--kind must be one of: ${KINDS.join(', ')}`);
  if (o.card && !isKey(o.card)) throw new Error(`--card must look like ${profile().jira.projectKey}-1234`);
  const list = load(f);
  const n = list.reduce((m, x) => Math.max(m, Number(String(x.id).slice(2)) || 0), 0) + 1;
  const entry = {
    id: `M-${n}`, date: new Date().toISOString().slice(0, 10), card: o.card || null, agent: o.agent, kind: o.kind,
    wrong: o.wrong, right: o.right, caught: o.caught && o.caught !== true ? o.caught : null, rule: o.rule, status: 'active',
  };
  list.push(entry);
  save(list, f);
  return entry;
}

export function show(agent, f = file()) {
  if (!AGENTS.includes(agent)) throw new Error(`agent must be one of: ${AGENTS.join(', ')}`);
  const rows = load(f).filter((m) => m.status === 'active' && (m.agent === agent || m.agent === 'all'));
  if (!rows.length) return `No AI-miss rules for ${agent}.`;
  return [`AI-miss rules for ${agent} (the user caught these before; follow every one):`,
    ...rows.map((m) => `- ${m.id}${m.card ? ` [${m.card}]` : ''} ${m.rule} (was wrong: ${m.wrong})`)].join('\n');
}

export function list(all = false, f = file()) {
  const rows = load(f).filter((m) => all || m.status === 'active');
  if (!rows.length) return 'No AI misses logged yet.';
  return rows.map((m) => [
    `${m.id}  ${m.date}  ${m.agent}/${m.kind}${m.card ? `  ${m.card}` : ''}${m.status !== 'active' ? `  (retired: ${m.retiredWhy})` : ''}`,
    `  AI did:   ${m.wrong}`,
    `  Correct:  ${m.right}`,
    ...(m.caught ? [`  Caught:   ${m.caught}`] : []),
    `  Rule:     ${m.rule}`,
  ].join('\n')).join('\n\n');
}

export function stats(f = file()) {
  const rows = load(f).filter((m) => m.status === 'active');
  if (!rows.length) return 'No AI misses logged yet.';
  const count = (k) => Object.entries(rows.reduce((a, m) => ((a[m[k]] = (a[m[k]] || 0) + 1), a), {}))
    .sort((a, b) => b[1] - a[1]).map(([x, c]) => `${x} ${c}`).join(', ');
  return `Active misses: ${rows.length}\nBy agent: ${count('agent')}\nBy kind:  ${count('kind')}`;
}

export function retire(id, why, f = file()) {
  if (!why) throw new Error('give a reason: retire <M-n> "<why>"');
  const list = load(f);
  const m = list.find((x) => x.id === id);
  if (!m) throw new Error(`${id} not found`);
  m.status = 'retired';
  m.retiredWhy = why;
  m.retiredDate = new Date().toISOString().slice(0, 10);
  save(list, f);
  return `${id} retired.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const o = flags(rest);
  try {
    if (cmd === 'add') { const e = add(o); console.log(`${e.id} saved: ${e.rule}`); }
    else if (cmd === 'show') console.log(show(o._[0]));
    else if (cmd === 'list') console.log(list(o.all === true));
    else if (cmd === 'stats') console.log(stats());
    else if (cmd === 'retire') console.log(retire(o._[0], o._[1]));
    else { console.error('Usage: node tools/ai-miss.mjs <add|show|list|stats|retire> ... (see the top of the file)'); process.exit(2); }
  } catch (e) { console.error(`ai-miss: ${e.message}`); process.exit(1); }
}

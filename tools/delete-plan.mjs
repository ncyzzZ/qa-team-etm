#!/usr/bin/env node
// delete-plan.mjs - one delete question per card (user, chat 2026-11-26: "รวมคำถาม delete").
// ETM-8049 asked 7 separate delete questions in 2 days (leftover works in its Scratch plan, one or two at a time).
// Now every delete the card needs goes into a queue; the user answers ONE question that lists them all.
//
//   node tools/delete-plan.mjs add <KEY> "<what>" --where "<place>" [--ids a,b] [--permanent] [--shared] [--blocks]
//        queue one item. --permanent: cannot be undone (Jira/Xray delete, hard delete). --shared: data other testers use.
//        --blocks: the work stops until it is deleted -> ask now (the question still lists every queued item).
//   node tools/delete-plan.mjs plan <KEY>       write work/<KEY>/delete-plan.md, print the one-line question + the ask command
//   node tools/delete-plan.mjs approve <KEY> --answer "<text>" --source chat|board --evidence "<reply or ANSWER: line>" [--only D-1,D-3]
//        the items of the last plan become approved (the rest of --only: declined) and state.mjs records ONE delete approval.
//        Refused when the queue changed after the plan (a new item needs a new plan and a new question).
//   node tools/delete-plan.mjs ok <KEY> <D-n>   exit 0 only when that item is approved (check right before deleting)
//   node tools/delete-plan.mjs done <KEY> <D-n> [--failed "<why>"]
//   node tools/delete-plan.mjs list <KEY>
// Not in the queue: the card data cleanup of run-card (ledger ids, standing approval) - it never asks.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT0 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qFile = (root, key) => path.join(root, 'work', key, 'delete-queue.json');
const load = (root, key) => { try { return JSON.parse(fs.readFileSync(qFile(root, key), 'utf8')); } catch { return { items: [], plan: null }; } };
const save = (root, key, q) => { fs.mkdirSync(path.dirname(qFile(root, key)), { recursive: true }); fs.writeFileSync(qFile(root, key), JSON.stringify(q, null, 2) + '\n'); };
const flag = (a, n) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
const has = (a, n) => a.includes(n);
const VALUE_FLAGS = ['--where', '--ids', '--answer', '--source', '--evidence', '--only', '--failed'];
const positional = (a) => a.filter((x, i) => !x.startsWith('--') && !VALUE_FLAGS.includes(a[i - 1]));

export function add(root, key, { what, where, ids = [], permanent = false, shared = false, blocks = false }) {
  if (!what || what.length < 5) throw new Error('add needs "<what>" (what is deleted, in words)');
  if (!where) throw new Error('add needs --where "<env / event / plan / Jira>"');
  const q = load(root, key);
  const dup = q.items.find((x) => x.status === 'queued' && x.what === what && x.where === where);
  if (dup) return { item: dup, q, dup: true };
  const n = q.items.reduce((m, x) => Math.max(m, Number(x.id.slice(2))), 0) + 1;
  const item = { id: `D-${n}`, what, where, ids, permanent, shared, blocks, status: 'queued', added: new Date().toISOString() };
  q.items.push(item); save(root, key, q);
  return { item, q, dup: false };
}

const queued = (q) => q.items.filter((x) => x.status === 'queued');

/** The one question for every queued item; null when nothing waits. Writes the plan snapshot into the queue. */
export function plan(root, key) {
  const q = load(root, key);
  const items = queued(q);
  if (!items.length) return null;
  const count = (f) => items.filter(f).reduce((s, x) => s + Math.max(1, x.ids.length), 0);
  const total = count(() => true), perm = count((x) => x.permanent), shared = count((x) => x.shared);
  const parts = [`${total} รายการ`];
  if (perm) parts.push(`ถาวร ${perm} (กู้คืนไม่ได้)`);
  if (total - perm) parts.push(`soft ${total - perm}`);
  if (shared) parts.push(`ข้อมูลที่คนอื่นใช้ ${shared}`);
  const urgent = items.some((x) => x.blocks);
  const line = `${key} ลบ ${parts.join(', ')}: ${items.map((x) => `${x.id} ${x.what}`).join('; ').slice(0, 220)} (ดู work/${key}/delete-plan.md)`;
  const md = [
    `# ${key} - delete plan (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`, '',
    `${total} item(s): ${perm} permanent (cannot be undone), ${total - perm} soft, ${shared} in data other testers use.`, '',
    '| # | What | Where | Ids | Undo | Shared | Blocks work |', '|---|---|---|---|---|---|---|',
    ...items.map((x) => `| ${x.id} | ${x.what} | ${x.where} | ${x.ids.join(', ') || '-'} | ${x.permanent ? '**no, permanent**' : 'soft delete'} | ${x.shared ? '**yes**' : 'no'} | ${x.blocks ? 'yes' : 'no'} |`),
    '', 'Answer: "ลบทั้งหมด", "ลบเฉพาะ D-1,D-3", or "ยังก่อน". Nothing is deleted before the answer.', '',
  ].join('\n');
  fs.mkdirSync(path.join(root, 'work', key), { recursive: true });
  fs.writeFileSync(path.join(root, 'work', key, 'delete-plan.md'), md);
  q.plan = { at: new Date().toISOString(), ids: items.map((x) => x.id), line };
  save(root, key, q);
  const opts = 'ลบทั้งหมด|ลบเฉพาะบางข้อ|ยังก่อน';
  const ask = urgent
    ? `node .claude/team/team.mjs ask --approve --job ${key} --options "${opts}" "${line}"`
    : `node .claude/team/team.mjs ask --later --job ${key} "${line}"`;
  return { items, line, md, urgent, ask };
}

/** Mark the planned items approved (or declined outside --only). Throws when the queue changed after the plan. */
export function approve(root, key, { answer, only = null, record = null }) {
  const q = load(root, key);
  if (!q.plan) throw new Error(`no delete plan for ${key}: run "delete-plan.mjs plan ${key}" and ask first`);
  const now = queued(q).map((x) => x.id);
  if (now.join(',') !== q.plan.ids.join(',')) throw new Error(`the queue changed after the plan (planned ${q.plan.ids.join(',')}, now ${now.join(',')}): plan again and ask again`);
  if (only) for (const id of only) if (!q.plan.ids.includes(id)) throw new Error(`${id} is not in the plan`);
  const batch = `B-${q.items.filter((x) => x.batch).reduce((s, x) => Math.max(s, Number(x.batch.slice(2))), 0) + 1}`;
  for (const x of q.items) if (q.plan.ids.includes(x.id)) {
    x.batch = batch; x.answer = answer;
    x.status = !only || only.includes(x.id) ? 'approved' : 'declined';
  }
  const approved = q.items.filter((x) => x.batch === batch && x.status === 'approved');
  if (record && approved.length) record(batch, approved);   // state.mjs approve; when it throws nothing is saved
  q.plan = null; save(root, key, q);
  return { batch, approved, declined: q.items.filter((x) => x.batch === batch && x.status === 'declined') };
}

export function isApproved(root, key, id) { return load(root, key).items.find((x) => x.id === id)?.status === 'approved'; }

export function done(root, key, id, failed = null) {
  const q = load(root, key); const x = q.items.find((i) => i.id === id);
  if (!x) throw new Error(`${id} not found`);
  if (x.status !== 'approved') throw new Error(`${id} is ${x.status}, not approved: it must not be deleted`);
  x.status = failed ? 'failed' : 'deleted'; x.doneAt = new Date().toISOString(); if (failed) x.error = failed;
  save(root, key, q); return x;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, key, ...a] = process.argv.slice(2);
  const root = process.env.DELETE_PLAN_ROOT || ROOT0;
  if (!/^ETM-\d+$/.test(key || '')) { console.error('Usage: node tools/delete-plan.mjs <add|plan|approve|ok|done|list> <KEY> ...'); process.exit(2); }
  try {
    if (cmd === 'add') {
      const r = add(root, key, { what: positional(a)[0], where: flag(a, '--where'), ids: (flag(a, '--ids') || '').split(',').filter(Boolean), permanent: has(a, '--permanent'), shared: has(a, '--shared'), blocks: has(a, '--blocks') });
      const n = queued(r.q).length;
      console.log(`${r.dup ? 'already queued' : 'queued'} ${r.item.id}: ${r.item.what} (${n} waiting)`);
      console.log(r.item.blocks
        ? `BLOCKS WORK: ask now for all ${n}: node tools/delete-plan.mjs plan ${key}`
        : `Not urgent: asked once with the card's other questions (plan ${key} before inbox --send / the push question).`);
    } else if (cmd === 'plan') {
      const p = plan(root, key);
      if (!p) { console.log(`${key}: nothing waits to be deleted`); process.exit(0); }
      console.log(p.md); console.log(`QUESTION: ${p.line}`); console.log(`${p.urgent ? 'URGENT (an item blocks work)' : 'Can wait'}: ${p.ask}`);
    } else if (cmd === 'approve') {
      const answer = flag(a, '--answer'), source = flag(a, '--source'), evidence = flag(a, '--evidence');
      if (!answer || !source || !evidence) throw new Error('approve needs --answer, --source chat|board and --evidence');
      const only = flag(a, '--only') ? flag(a, '--only').split(',').map((s) => s.trim()) : null;
      const record = has(a, '--no-state') ? null : (batch, items) => execFileSync(process.execPath, [path.join(ROOT0, 'tools', 'state.mjs'), 'approve', key,
        `${batch}: delete ${items.map((x) => `${x.id} ${x.what}${x.permanent ? ' (permanent)' : ''}`).join('; ')}`, '--kind', 'delete', '--answer', answer, '--source', source, '--evidence', evidence], { stdio: 'inherit' });
      const r = approve(root, key, { answer, only, record });
      console.log(`APPROVED ${r.approved.map((x) => x.id).join(', ') || '(none)'}${r.declined.length ? `; declined ${r.declined.map((x) => x.id).join(', ')}` : ''}`);
    } else if (cmd === 'ok') {
      const ok = isApproved(root, key, a[0]); console.log(ok ? `OK ${a[0]} approved` : `NO ${a[0]} is not approved: do not delete`); process.exit(ok ? 0 : 1);
    } else if (cmd === 'done') {
      const x = done(root, key, a[0], flag(a, '--failed')); console.log(`${x.id} ${x.status}`);
    } else if (cmd === 'list') {
      for (const x of load(root, key).items) console.log(`${x.id}  ${x.status.padEnd(8)} ${x.permanent ? 'PERM ' : 'soft '}${x.shared ? 'SHARED ' : ''}${x.what} @ ${x.where}${x.ids.length ? ` [${x.ids.join(',')}]` : ''}`);
    } else throw new Error(`unknown command ${cmd}`);
  } catch (e) { console.error(`[delete-plan] ${e.message}`); process.exit(1); }
}

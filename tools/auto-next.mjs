#!/usr/bin/env node
// What the lead does by itself after a run, without asking (user, chat 2026-11-24: item 2 of "1 2 4 ทำได้เลย").
//
//   node tools/auto-next.mjs <KEY> <run folder> [--apply-heals]
//       sorts the run's failures (triage.json, heal-proposals.json):
//       RERUN  env / flaky failures, once per test per day (work/<KEY>/auto-actions.json stops loops)
//       HEAL   `ready` heals (the FE repo answered, guard passed): with --apply-heals they are applied now and re-run
//       LIVE   `needs-live` heals: the lead calls playwright-healer (TEAM.md Phase 7)
//       ASK    everything else: one table from tools/verdicts.mjs
//       prints the run-card command for RERUN + HEAL (a re-run: run-policy says auto, reason C)
//   node tools/auto-next.mjs <KEY> <new run folder> --check-heals <old run folder>
//       after that re-run: a healed test that still fails gets its heal reverted; a healed test that passes is kept
//       and listed in work/<KEY>/auto-actions.json "toConfirm" (the user keeps or reverts them all at the end, one question).
// Never: change an assertion, retry an assertion / unknown / data failure, or re-run a test a second time the same day.
import { isKey } from './profile.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apply as applyHeals, revert as revertHeals } from './heal/auto-heal.mjs';
import { rowsFromResults } from './run-results.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const today = () => new Date().toISOString().slice(0, 10);

export function ledgerPath(key, root = ROOT) { return path.join(root, 'work', key, 'auto-actions.json'); }
function loadLedger(key, root) { return readJson(ledgerPath(key, root), { reruns: {}, heals: [], toConfirm: [] }); }
function saveLedger(key, root, l) { fs.mkdirSync(path.dirname(ledgerPath(key, root)), { recursive: true }); fs.writeFileSync(ledgerPath(key, root), JSON.stringify(l, null, 2) + '\n'); }

/** @returns {{rerun:string[], heal:object[], live:object[], ask:object[], specs:string[]}} */
export function sort(key, runDir, { root = ROOT } = {}) {
  const triage = readJson(path.join(runDir, 'triage.json'), []);
  const heals = readJson(path.join(runDir, 'heal-proposals.json'), { proposals: [] }).proposals;
  const ledger = loadLedger(key, root);
  const out = { rerun: [], heal: [], live: [], ask: [], specs: new Set() };
  for (const r of triage) {
    const spec = r.file ? `tests/${r.file}` : null;
    if (r.cause === 'env' || r.cause === 'flaky') {
      if (ledger.reruns[r.key] === today()) out.ask.push({ ...r, why: `${r.cause} again after today's automatic re-run` });
      else { out.rerun.push(r.key); if (spec) out.specs.add(spec); }
    } else if (r.cause === 'locator') {
      const p = heals.find((h) => h.test === r.key);
      if (p?.status === 'ready') { out.heal.push(p); if (spec) out.specs.add(spec); }
      else if (p?.status === 'needs-live') out.live.push(p);
      else out.ask.push({ ...r, why: p ? `heal ${p.status}: ${p.reason ?? ''}` : 'locator failure without a heal proposal' });
    } else out.ask.push({ ...r, why: r.cause });
  }
  return { ...out, specs: [...out.specs] };
}

export function act(key, runDir, plan, { applyNow = false, root = ROOT, pwRepo } = {}) {
  const ledger = loadLedger(key, root);
  for (const k of plan.rerun) ledger.reruns[k] = today();
  let applied = [];
  if (applyNow && plan.heal.length) {
    applied = applyHeals(runDir, plan.heal.map((p) => p.id).join(','), pwRepo ? { pwRepo } : undefined);
    for (const p of applied) { ledger.heals.push({ run: runDir, id: p.id, test: p.test, page: p.page, old: p.old, new: p.new, at: new Date().toISOString() }); ledger.reruns[p.test] = today(); }
  }
  saveLedger(key, root, ledger);
  return applied;
}

export function checkHeals(key, newRun, oldRun, { root = ROOT, pwRepo } = {}) {
  const rows = rowsFromResults(readJson(path.join(newRun, 'results.json'), { suites: [] }), () => '');
  const statusOf = (k) => rows.find((r) => r.title.startsWith(k))?.status;
  const ledger = loadLedger(key, root);
  const mine = ledger.heals.filter((h) => path.resolve(h.run) === path.resolve(oldRun) && !h.result);
  const kept = [], reverted = [];
  for (const h of mine) {
    const st = statusOf(h.test);
    if (st === 'passed') { h.result = 'kept'; kept.push(h); ledger.toConfirm.push({ test: h.test, page: h.page, old: h.old, new: h.new, run: h.run, id: h.id }); }
    else if (st) { revertHeals(oldRun, String(h.id), pwRepo ? { pwRepo } : undefined); h.result = `reverted (${st})`; reverted.push(h); }
  }
  saveLedger(key, root, ledger);
  return { kept, reverted };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [key, dir, ...rest] = process.argv.slice(2);
  if (!isKey(key ?? '') || !dir || !fs.existsSync(dir)) { console.error('Usage: node tools/auto-next.mjs <KEY> <run folder> [--apply-heals] | <KEY> <new run> --check-heals <old run>'); process.exit(2); }
  const ci = rest.indexOf('--check-heals');
  if (ci >= 0) {
    const { kept, reverted } = checkHeals(key, dir, rest[ci + 1]);
    console.log(`[auto-next] heals kept ${kept.length}: ${kept.map((h) => h.test).join(', ') || '-'} | reverted ${reverted.length}: ${reverted.map((h) => `${h.test} ${h.result}`).join(', ') || '-'}`);
    if (kept.length) console.log('[auto-next] kept heals wait in work/' + key + '/auto-actions.json toConfirm: ask the user once at the end (keep all / revert some)');
    process.exit(0);
  }
  const plan = sort(key, dir);
  const applied = act(key, dir, plan, { applyNow: rest.includes('--apply-heals') });
  const again = [...plan.rerun, ...applied.map((p) => p.test)];
  console.log(`[auto-next] ${key}: rerun ${plan.rerun.length} (env/flaky) | heal ready ${plan.heal.length}${applied.length ? `, applied ${applied.length}` : ''} | live ${plan.live.length} | ask ${plan.ask.length}`);
  if (again.length) console.log(`RERUN: node tools/run-card.mjs ${key} ${plan.specs.join(' ')} -g "${again.join('|')}"`);
  if (applied.length) console.log(`THEN: node tools/auto-next.mjs ${key} <new run folder> --check-heals ${dir}`);
  if (plan.live.length) console.log(`LIVE: call playwright-healer for ${plan.live.map((p) => `#${p.id} ${p.test}`).join(', ')}`);
  if (plan.ask.length) console.log(`ASK: node tools/verdicts.mjs table ${key} ${dir}   (${plan.ask.map((a) => `${a.key} ${a.why}`).join('; ')})`);
}

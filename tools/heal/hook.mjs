#!/usr/bin/env node
// hook.mjs - Claude Code hook (PostToolUse on Bash, and UserPromptSubmit). When a run in the last 24 hours left
// heal proposals nobody has dealt with yet, it tells the lead to start the heal loop now, so the user never has to
// name the healer. It tells once per run (sets `notified`). Read only apart from that flag; never applies a heal.
import fs from 'node:fs';
import path from 'node:path';
import { resolveRepos } from './config.mjs';
import { summaryLine } from './auto-heal.mjs';

let event = 'UserPromptSubmit';
try { event = JSON.parse(fs.readFileSync(0, 'utf8') || '{}').hook_event_name || event; } catch { /* no stdin */ }

try {
  const runs = path.join(resolveRepos().pwRepo, 'output', 'runs');
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const open = [];
  for (const d of fs.existsSync(runs) ? fs.readdirSync(runs) : []) {
    const f = path.join(runs, d, 'heal-proposals.json');
    if (!fs.existsSync(f) || fs.statSync(f).mtimeMs < dayAgo) continue;
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (data.notified || !data.proposals.some((p) => ['ready', 'needs-live'].includes(p.status))) continue;
    open.push({ dir: path.join(runs, d), data, f });
  }
  if (open.length) {
    const lines = open.map((o) => `- ${o.dir}: ${summaryLine(o.data)} (heal-proposals.md)`);
    const text = [
      'Self-healing: a Playwright run left locator failures with heal proposals. Start the heal loop now, without waiting to be asked (TEAM.md Phase 7):',
      ...lines,
      'TEAM.md Phase 7. First, for each needs-live row (no question): call playwright-healer, save its answer as <run>/healer-<id>.md, run node tools/heal/auto-heal.mjs live <run> <id> <run>/healer-<id>.md. Then once: node tools/auto-next.mjs <KEY> <run> --apply-heals (applies stms-fe heals only). Live heals go in the ONE verdicts.mjs table question; on the user\'s Apply only: auto-heal.mjs live-ok <run> <ids>, then auto-next <KEY> <run> --apply-heals --heals-only. Re-run only healed tests, then auto-next <KEY> <new run> --check-heals <run> (a heal that still fails is reverted). Log with heal-log.mjs add. Manual rows: tell the user the reason.',
    ].join('\n');
    for (const o of open) { o.data.notified = true; fs.writeFileSync(o.f, JSON.stringify(o.data, null, 2)); }
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: text } }));
  }
} catch { /* a hook never blocks the session */ }
process.exit(0);

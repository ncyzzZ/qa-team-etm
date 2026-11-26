#!/usr/bin/env node
// state.mjs - the lead's only way to write a card's state (.claude/team/work/<KEY>/state.json). Agents never run the
// write commands; they read the file (or `show`). A record here is never an approval (CLAUDE.md rule 3).
//
//   node tools/state.mjs init <KEY> [--rebuild]
//   node tools/state.mjs phase <KEY> <phase> "<next step>"
//   node tools/state.mjs file <KEY> <kind> <path>                (pw:<path> for files in the Playwright repo)
//   node tools/state.mjs ac <KEY> sync   |   ac <KEY> <AC-n> changed "<why>"
//   node tools/state.mjs decide <KEY> "<text>" --source "<where>" [--ac AC-1,AC-2]
//   node tools/state.mjs open <KEY> "<question>" --owner BA|dev|user   |   close <KEY> <Q-n> "<answer>"
//   node tools/state.mjs approve <KEY> "<what>" --kind <kind> --answer "<text>" --source chat|board --evidence "<quote or ANSWER: line>"
//   node tools/state.mjs gate <KEY> <G-id> pass|fail [--errors N]
//   node tools/state.mjs show <KEY>
import { isKey, profile } from './profile.mjs';
import { ROOT } from './state/core.mjs';
import * as C from './state/commands.mjs';
import { resolveRepos } from './heal/config.mjs';

const [cmd, key, ...args] = process.argv.slice(2);
const opt = { root: process.env.STATE_ROOT || ROOT, pwRepo: resolveRepos().pwRepo };
const table = {
  init: C.init, phase: C.phase, file: C.file, decide: C.decide, open: C.openQ, close: C.closeQ, approve: C.approve, gate: C.gate, show: C.show,
  ac: (k, a, o) => (a[0] === 'sync' ? C.acSync(k, a.slice(1), o) : a[1] === 'changed' ? C.acChanged(k, [a[0], ...a.slice(2)], o) : (() => { throw new Error('use: ac <KEY> sync | ac <KEY> <AC-n> changed "<why>"'); })()),
};
if (!table[cmd] || !isKey(key || '')) {
  console.error(`Usage: node tools/state.mjs <init|phase|file|ac|decide|open|close|approve|gate|show> <${profile().jira.projectKey}-KEY> ...`);
  process.exit(2);
}
try {
  const r = table[cmd](key, args, opt);
  if (typeof r === 'string') console.log(r);
  else console.log(`[state] ${key}: ${r.history.at(-1).change}`);
} catch (e) {
  console.error(`[state] ${key}: ${e.message}`);
  process.exit(1);
}

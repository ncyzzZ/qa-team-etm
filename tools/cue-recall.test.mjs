import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPages, decide, eventText, section, AGAIN_MS, MAX_BLOCKS } from './cue-recall.mjs';

const pages = loadPages();
const SL = 'tests/fe/e2e/shutdownLogic/verifyPaste.spec.ts';

test('the Shutdown Logic cue file loads with its page rules and every block', () => {
  const sl = pages.find((p) => p.page === 'Shutdown Logic');
  assert.ok(sl, 'shutdown-logic.cues.json loads');
  assert.match(sl.pageText, /Collapse the Manpower Resource histogram/);
  assert.equal(sl.blocks.length, 12, 'every block finds its section');
  assert.ok(sl.blocks.every((b) => !/^Cue:/m.test(b.text)));
});

test('page rules come once when the page is touched; action blocks only for what is being done', () => {
  const a = decide(pages, { path: SL, text: '' });
  assert.deepEqual(a.give.map((g) => g.id), ['page']);
  const b = decide(pages, { path: '', text: "await page.keyboard.press('Control+V')" }, a.state);
  assert.deepEqual(b.give.map((g) => g.id), ['paste-copy']);                       // page active, page rules not again
  const c = decide(pages, { path: '', text: "await page.keyboard.press('Control+V')" }, b.state);
  assert.equal(c.give.length, 0);                                                   // given once
});

test('no page cue = nothing, even for a word like filter (other pages have filters too)', () => {
  assert.equal(decide(pages, { path: 'tests/fe/e2e/worklist/a.spec.ts', text: 'apply the filter' }).give.length, 0);
});

test('given again after 3 hours; at most MAX_BLOCKS blocks per event', () => {
  const now = Date.now();
  const a = decide(pages, { path: SL, text: 'paste, filter, export, save, sort, predecessor' }, undefined, now);
  assert.equal(a.give.filter((g) => g.id !== 'page').length, MAX_BLOCKS);
  const later = decide(pages, { path: SL, text: '' }, a.state, now + AGAIN_MS + 1);
  assert.deepEqual(later.give.map((g) => g.id), ['page']);
});

test('a Read gives only the page rules (its content would fire every block); prompts count', () => {
  assert.deepEqual(eventText({ tool_name: 'Read', tool_input: { file_path: SL } }), { path: SL, text: '' });
  assert.equal(eventText({ hook_event_name: 'UserPromptSubmit', prompt: 'แก้ shutdown logic paste' }).text, 'แก้ shutdown logic paste');
  assert.equal(section('## A\nCue: x\none\n## B\ntwo', '## A'), 'one');
});

test('hook mode prints additionalContext JSON and never fails on bad input', () => {
  const cli = fileURLToPath(new URL('./cue-recall.mjs', import.meta.url));
  const ev = { hook_event_name: 'PostToolUse', session_id: `t${Date.now()}`, tool_name: 'Edit', tool_input: { file_path: SL, new_string: "await page.keyboard.press('Control+V');" } };
  const r = spawnSync(process.execPath, [cli], { input: JSON.stringify(ev), encoding: 'utf8', env: { ...process.env, CUE_LOG: '/dev/null' } });
  const out = JSON.parse(r.stdout);
  assert.match(out.hookSpecificOutput.additionalContext, /\[cue: Shutdown Logic \/ page\][\s\S]*\[cue: Shutdown Logic \/ paste-copy\]/);
  const bad = spawnSync(process.execPath, [cli], { input: 'not json', encoding: 'utf8' });
  assert.equal(bad.status, 0); assert.equal(bad.stdout, '');
});

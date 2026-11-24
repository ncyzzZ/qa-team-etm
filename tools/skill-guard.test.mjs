import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { decide } from './skill-guard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = ['log-defect-jira-etm', 'etm-nn-fullqa', 'test-field-limit'];

test('decide: an anthropic-skills: copy of a project skill is denied, with the project name to use', () => {
  const d = decide('anthropic-skills:log-defect-jira-etm', PROJECT);
  assert.equal(d.deny, true);
  assert.match(d.reason, /log-defect-jira-etm/);
  assert.match(d.reason, /\.claude\/skills/);
});

test('decide: the project skill itself and unrelated account skills are allowed', () => {
  assert.equal(decide('log-defect-jira-etm', PROJECT).deny, false);
  assert.equal(decide('anthropic-skills:docx', PROJECT).deny, false);
  assert.equal(decide('superpowers:brainstorming', PROJECT).deny, false);
});

test('hook: prints a PreToolUse deny for the account copy and nothing for the project skill', () => {
  const run = (skill) => spawnSync(process.execPath, [path.join(ROOT, 'tools', 'skill-guard.mjs')], {
    input: JSON.stringify({ tool_name: 'Skill', tool_input: { skill } }), encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: ROOT },
  });
  const bad = run('anthropic-skills:log-defect-jira-etm');
  assert.equal(bad.status, 0);
  const out = JSON.parse(bad.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
  const ok = run('log-defect-jira-etm');
  assert.equal(ok.status, 0);
  assert.equal(ok.stdout.trim(), '');
});

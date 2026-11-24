#!/usr/bin/env node
// skill-guard.mjs - PreToolUse hook (matcher Skill) of this repo: refuses the shared account's older copy of a project skill.
// The account keeps old copies as `anthropic-skills:<name>`; in this repo only `.claude/skills/<name>` (no prefix) is current.
// Reads the hook JSON on stdin; prints a deny decision for an `anthropic-skills:` copy of a project skill, nothing otherwise.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @returns {{ deny: boolean, reason?: string }} */
export function decide(skill, projectSkills) {
  const m = String(skill || '').match(/^anthropic-skills:(.+)$/);
  if (!m || !projectSkills.includes(m[1])) return { deny: false };
  return {
    deny: true,
    reason: `"${skill}" is the shared account's OLD copy. In this repo use the project skill "${m[1]}" (.claude/skills/${m[1]}/SKILL.md, no prefix): it has the current team rules. Call the Skill tool again with skill "${m[1]}".`,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  const root = process.env.CLAUDE_PROJECT_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let names = [];
  try { names = fs.readdirSync(path.join(root, '.claude', 'skills')).filter((n) => fs.existsSync(path.join(root, '.claude', 'skills', n, 'SKILL.md'))); } catch { process.exit(0); }
  const d = decide(input.tool_input?.skill, names);
  if (d.deny) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: d.reason } }));
  process.exit(0);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { accountDescription, exportSkills } from './export-skills.mjs';

test('accountDescription: the "Repo version ... prefer it over the account skill" line becomes a synced-on note', () => {
  const md = "---\nname: x\ndescription: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:&lt;same name&gt;`). Use when ...\n---\nbody\n";
  const out = accountDescription(md, '2026-11-24');
  assert.match(out, /^description: Synced from the qa-team-etm repo on 2026-11-24\. Use when \.\.\.$/m);
  assert.match(out, /body/);
  const quoted = '---\nname: q\ndescription: "Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Use q"\n---\n';
  assert.match(accountDescription(quoted, '2026-11-24'), /description: "Synced from the qa-team-etm repo on 2026-11-24\. Use q"/);
  const plain = "---\nname: y\ndescription: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). Do y\n---\n";
  assert.match(accountDescription(plain, '2026-11-24'), /description: Synced from the qa-team-etm repo on 2026-11-24\. Do y/);
});

test('exportSkills: one zip per skill folder with every file of the skill, in a fresh out folder', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'export-skills-'));
  const w = (p, t) => { fs.mkdirSync(path.join(root, path.dirname(p)), { recursive: true }); fs.writeFileSync(path.join(root, p), t); };
  w('.claude/skills/a-skill/SKILL.md', "---\nname: a-skill\ndescription: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). A\n---\n");
  w('.claude/skills/a-skill/helper.py', 'print(1)\n');
  w('.claude/skills/b-skill/SKILL.md', '---\nname: b-skill\ndescription: B\n---\n');
  const out = path.join(root, 'dist', 'account-skills');
  const made = exportSkills({ root, out, date: '2026-11-24' });
  assert.deepEqual(made.map((m) => path.basename(m)).sort(), ['a-skill.zip', 'b-skill.zip']);
  assert.ok(fs.statSync(path.join(out, 'a-skill.zip')).size > 0);
  assert.match(fs.readFileSync(path.join(out, 'a-skill', 'SKILL.md'), 'utf8'), /Synced from the qa-team-etm repo on 2026-11-24\. A/);
  assert.ok(fs.existsSync(path.join(out, 'a-skill', 'helper.py')));
});

test('exportSkills: appends the profile settings block (site, key, id, board, fields) and leaves the rest as is', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'export-skills-p-'));
  const body = "---\nname: c-skill\ndescription: Repo version (project skill, no prefix; always prefer it over the account skill `anthropic-skills:<same name>`). C\n---\n# C\nUse <KEY>.\n";
  fs.mkdirSync(path.join(root, '.claude/skills/c-skill'), { recursive: true });
  fs.writeFileSync(path.join(root, '.claude/skills/c-skill/SKILL.md'), body);
  const p = { name: 'acme', jira: { site: 'acme.atlassian.net', projectKey: 'ACME', projectId: 77, boardId: 88,
    fields: { foundInEnvironment: { id: 'customfield_1', options: { QA: '501' } }, sprint: { id: 'customfield_2' } } } };
  const out = path.join(root, 'out');
  exportSkills({ root, out, date: '2026-11-26', p });
  const md = fs.readFileSync(path.join(out, 'c-skill', 'SKILL.md'), 'utf8');
  const head = accountDescription(body, '2026-11-26');
  assert.ok(md.startsWith(head), 'original text kept');
  const block = md.slice(head.length);
  assert.match(block, /^\n## Project settings \(synced from profiles\/acme\)\n/);
  for (const v of ['acme.atlassian.net', 'ACME', '77', '88', 'foundInEnvironment', 'customfield_1', 'QA=501', 'sprint', 'customfield_2']) assert.ok(block.includes(v), v);
});

test('exportSkills: appends the project rules (rules.md without its title line) after the settings block', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'export-skills-r-'));
  fs.mkdirSync(path.join(root, '.claude/skills/d-skill'), { recursive: true });
  fs.writeFileSync(path.join(root, '.claude/skills/d-skill/SKILL.md'), '---\nname: d-skill\ndescription: D\n---\n# D\n');
  const dir = path.join(root, 'profiles', 'acme');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'rules.md'), '# ACME project rules\n\n## Roles\n\n- Only ADMIN on QA.\n');
  const p = { name: 'acme', dir, docs: { rules: 'rules.md' }, jira: { site: 'acme.atlassian.net', projectKey: 'ACME' } };
  const out = path.join(root, 'out');
  exportSkills({ root, out, date: '2026-11-26', p });
  const md = fs.readFileSync(path.join(out, 'd-skill', 'SKILL.md'), 'utf8');
  const iS = md.indexOf('## Project settings (synced from profiles/acme)');
  const iR = md.indexOf('## Project rules (synced from profiles/acme/rules.md)');
  assert.ok(iS > 0 && iR > iS, 'rules section after settings');
  assert.match(md.slice(iR), /## Roles\n\n- Only ADMIN on QA\.\n$/);
  assert.ok(!md.includes('# ACME project rules'), 'title line stripped');
});

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

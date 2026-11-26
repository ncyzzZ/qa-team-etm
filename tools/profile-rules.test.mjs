import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadProfile, syncActiveProfile } from './profile.mjs';

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prof-rules-'));
  const dir = path.join(root, 'profiles', 'acme');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'profile.json'), JSON.stringify({
    title: 'ACME Portal',
    jira: { site: 'acme.atlassian.net', projectKey: 'ACME', projectId: 77, boardId: 88 },
    repos: { pwRepoDir: 'acme-fe-qa', feRepoDir: 'acme-fe', feBranch: 'main' },
    docs: { rules: 'rules.md', uiMap: 'docs/UI_Map_ACME.md', templates: 'docs/ACME_Templates' },
  }));
  fs.writeFileSync(path.join(dir, 'rules.md'), '# ACME rules\n\n## Roles\n- Only ADMIN on QA.\n');
  const p = loadProfile({ root, name: 'acme', envFile: path.join(root, 'no-such.env') });
  return { root, dir, p };
}

test('syncActiveProfile writes the header, settings and rules; second call is unchanged', () => {
  const { root, p } = setup();
  const r1 = syncActiveProfile({ root, p });
  assert.equal(r1.path, path.join(root, '.claude', 'active-profile.md'));
  assert.equal(r1.changed, true);
  const text = fs.readFileSync(r1.path, 'utf8');
  const lines = text.split('\n');
  assert.equal(lines[0], '<!-- generated from profiles/acme/rules.md; edit that file -->');
  assert.match(text, /^# Active project: ACME Portal$/m);
  for (const v of ['acme.atlassian.net', 'ACME', '77', '88', 'acme-fe-qa', 'acme-fe', 'main', 'docs/UI_Map_ACME.md', 'docs/ACME_Templates']) assert.ok(text.includes(v), v);
  assert.match(text, /Only ADMIN on QA\./);
  const r2 = syncActiveProfile({ root, p });
  assert.equal(r2.changed, false);
});

test('syncActiveProfile sees an edited rules.md', () => {
  const { root, dir, p } = setup();
  syncActiveProfile({ root, p });
  fs.appendFileSync(path.join(dir, 'rules.md'), '- New rule from the lead.\n');
  const r = syncActiveProfile({ root, p });
  assert.equal(r.changed, true);
  assert.match(fs.readFileSync(r.path, 'utf8'), /New rule from the lead\./);
});

test('syncActiveProfile check mode reports stale without writing', () => {
  const { root, p } = setup();
  const r = syncActiveProfile({ root, p, check: true });
  assert.equal(r.changed, true);
  assert.equal(fs.existsSync(r.path), false);
});

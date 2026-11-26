import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { findHardcoded } from './profile-lint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = { jira: { site: 'pttep.atlassian.net', projectKey: 'ETM', projectId: 14436 }, repos: { pwRepoDir: 'ep-etm-fe-qa', feRepoDir: 'stms-fe', feBranch: 'develop' } };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
const hits = (src) => { const f = path.join(tmp, 'x.mjs'); fs.writeFileSync(f, src); return findHardcoded([f], P); };

test('a hard-coded key pattern is a hit', () => { const h = hits('const x = /^ETM-\\d+$/;\n'); assert.equal(h.length, 1); assert.equal(h[0].line, 1); });
test('comment lines are skipped', () => { assert.equal(hits('// ETM-8034 broke\n/* ETM-1 */\n * ETM-2\n').length, 0); });
test('trailing comments are skipped', () => { assert.equal(hits('const a = 1; // ETM-8034 broke\n').length, 0); });
test('printed repo folder is a hit', () => { assert.equal(hits('const y = "stms-fe not found"\n').length, 1); });
test('quoted key, site, pw repo, project id, origin/<feBranch> are hits', () => {
  assert.equal(hits("const k = 'ETM';\n").length, 1);
  assert.equal(hits('const k = "ETM";\n').length, 1);
  assert.equal(hits("const s = 'pttep.atlassian.net';\n").length, 1);
  assert.equal(hits("const r = 'ep-etm-fe-qa';\n").length, 1);
  assert.equal(hits('const id = 14436;\n').length, 1);
  assert.equal(hits("const ref = 'origin/develop';\n").length, 1);
});
test('profile reads are not hits', () => {
  assert.equal(hits('const k = profile().jira.projectKey; const ref = `origin/${profile().repos.feBranch}`;\n').length, 0);
});
test('another profile: its own values are the hits', () => {
  const f = path.join(tmp, 'y.mjs'); fs.writeFileSync(f, 'const a = /ETM-\\d/; const b = "ABC-12";\n');
  const q = { jira: { site: 'x.example', projectKey: 'ABC' }, repos: { pwRepoDir: 'pw', feRepoDir: 'fe' } };
  assert.equal(findHardcoded([f], q).length, 1);
});

test('key prefixes in regex groups, templates and quoted prefixes are hits', () => {
  assert.equal(hits('const r = /ETM-(\\d+)/g;\n').length, 1);
  assert.equal(hits('const k = `ETM-${m[1]}`;\n').length, 1);
  assert.equal(hits("const a = 'ETM-';\n").length, 1);
  assert.equal(hits('const b = "ETM-";\n').length, 1);
  assert.equal(hits('const c = `ETM-`;\n').length, 1);
});

test('the real repo is clean (CLI, ETM profile, repos forced missing)', () => {
  const none = path.join(tmp, 'nonexistent');
  const env = { ...process.env, PW_REPO: none, FE_REPO: none };
  delete env.QA_PROFILE_ROOT; delete env.QA_PROFILE;
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'profile-lint.mjs')], { cwd: ROOT, env, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

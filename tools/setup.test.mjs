import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadProfile } from './profile.mjs';

const SETUP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'setup.mjs');
const REPO = path.resolve(path.dirname(SETUP), '..');

function tmpRoot(envText) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-np-'));
  fs.cpSync(path.join(REPO, 'profiles', '_template'), path.join(root, 'profiles', '_template'), { recursive: true });
  const envFile = path.join(root, 'test.env');
  if (envText !== undefined) fs.writeFileSync(envFile, envText);
  return { root, envFile };
}
const FLAGS = ['--new-profile', 'acme', '--key', 'ACME', '--site', 'acme.atlassian.net', '--project-id', '123', '--board', '45', '--pw-repo-dir', 'acme-fe-qa', '--fe-repo-dir', 'acme-fe'];
function run(root, envFile, args) {
  return spawnSync(process.execPath, [SETUP, ...args], {
    encoding: 'utf8',
    env: { ...process.env, QA_PROFILE_ROOT: root, QA_ENV_FILE: envFile, QA_PROFILE: '', PW_REPO: '' },
  });
}

test('--new-profile creates the profile, writes QA_PROFILE, keeps other .env lines', () => {
  const { root, envFile } = tmpRoot('PW_REPO=/x/y\nXRAY_CLIENT_ID=secret\nQA_PROFILE=etm\n');
  const r = run(root, envFile, FLAGS);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const p = loadProfile({ root, envFile, name: 'acme' });
  assert.equal(p.jira.projectKey, 'ACME');
  assert.equal(p.jira.site, 'acme.atlassian.net');
  assert.equal(p.jira.projectId, 123);
  assert.equal(p.jira.boardId, 45);
  assert.equal(p.repos.pwRepoDir, 'acme-fe-qa');
  assert.equal(p.repos.feRepoDir, 'acme-fe');
  assert.equal(p.repos.feBranch, 'develop');
  assert.ok(p.jira.fields.foundInEnvironment);
  const env = fs.readFileSync(envFile, 'utf8');
  assert.equal(env, 'PW_REPO=/x/y\nXRAY_CLIENT_ID=secret\nQA_PROFILE=acme\n');
  assert.ok(fs.existsSync(path.join(root, 'profiles', 'acme', 'rules.md')));
  assert.ok(fs.existsSync(path.join(root, '.claude', 'active-profile.md')));
  assert.ok(!r.stdout.includes('secret'));
});

test('--new-profile creates .env when missing and honours --fe-branch', () => {
  const { root, envFile } = tmpRoot();
  const r = run(root, envFile, [...FLAGS, '--fe-branch', 'main']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(fs.readFileSync(envFile, 'utf8'), 'QA_PROFILE=acme\n');
  assert.equal(loadProfile({ root, envFile, name: 'acme' }).repos.feBranch, 'main');
});

test('--new-profile twice: exit 2 profile exists', () => {
  const { root, envFile } = tmpRoot('');
  assert.equal(run(root, envFile, FLAGS).status, 0);
  const r = run(root, envFile, FLAGS);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /profile "acme" already exists/);
});

test('--new-profile lists all missing flags at once', () => {
  const { root, envFile } = tmpRoot('');
  const r = run(root, envFile, ['--new-profile', 'acme', '--key', 'ACME']);
  assert.equal(r.status, 2);
  const out = r.stdout + r.stderr;
  for (const f of ['--site', '--project-id', '--board', '--pw-repo-dir', '--fe-repo-dir']) assert.ok(out.includes(f), f);
  assert.ok(!fs.existsSync(path.join(root, 'profiles', 'acme')));
});

test('--new-profile rejects a bad name and a bad key', () => {
  const { root, envFile } = tmpRoot('');
  for (const bad of ['Acme', 'a', '1acme', 'ac_me']) {
    const a = [...FLAGS]; a[1] = bad;
    assert.equal(run(root, envFile, a).status, 2, bad);
  }
  const k = [...FLAGS]; k[3] = 'acme';
  const r = run(root, envFile, k);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /\^\[A-Z\]\[A-Z0-9_\]\{1,9\}\$/);
  assert.ok(!fs.existsSync(path.join(root, 'profiles', 'acme')));
});

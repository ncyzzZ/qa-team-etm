import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadProfile, keyRe, isKey, keysIn, firstKey, browseUrl, escapeKey } from './profile.mjs';

const mk = (key = 'ETM', over = {}) => ({
  title: key,
  jira: { site: 'pttep.atlassian.net', projectKey: key, projectId: 1, boardId: 2 },
  repos: { pwRepoDir: 'pw', feRepoDir: 'fe', feBranch: 'develop' },
  ui: { libraryTokenRe: '^$' },
  docs: { rules: 'rules.md', uiMap: null, templates: null },
  ...over,
});

function root(profiles = { etm: mk() }, env) {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'prof-'));
  for (const [n, p] of Object.entries(profiles)) {
    fs.mkdirSync(path.join(r, 'profiles', n), { recursive: true });
    fs.writeFileSync(path.join(r, 'profiles', n, 'profile.json'), JSON.stringify(p));
  }
  if (env !== undefined) fs.writeFileSync(path.join(r, '.env'), env);
  return r;
}

function withEnv(vars, fn) {
  const old = {};
  for (const k of Object.keys(vars)) { old[k] = process.env[k]; if (vars[k] === undefined) delete process.env[k]; else process.env[k] = vars[k]; }
  try { return fn(); } finally { for (const k of Object.keys(old)) { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; } }
}

const load = (opts = {}) => withEnv({ QA_PROFILE: undefined, QA_PROFILE_ROOT: undefined }, () => loadProfile({ envFile: path.join(opts.root || os.tmpdir(), 'no-such.env'), ...opts }));
const etm = load({ root: root() });

test('loads etm by default', () => {
  assert.equal(etm.name, 'etm');
  assert.equal(etm.jira.projectKey, 'ETM');
});

test('with nothing selected, the only profile folder is the default', () => {
  const r = root({ acme: mk('ACME') });
  fs.mkdirSync(path.join(r, 'profiles', '_template'), { recursive: true });
  assert.equal(load({ root: r }).name, 'acme');
});

test('several profile folders and none selected is a clear error', () => {
  assert.throws(() => load({ root: root({ etm: mk(), acme: mk('ACME') }) }), /no profile selected: set QA_PROFILE/);
});

test('.env QA_PROFILE selects profile; env var beats .env', () => {
  const r = root({ etm: mk(), acme: mk('ACME') }, 'QA_PROFILE=acme\n');
  assert.equal(load({ root: r, envFile: path.join(r, '.env') }).name, 'acme');
  assert.equal(withEnv({ QA_PROFILE: 'etm', QA_PROFILE_ROOT: undefined }, () => loadProfile({ root: r, envFile: path.join(r, '.env') })).name, 'etm');
});

test('missing profile throws', () => {
  assert.throws(() => load({ root: root(), name: 'acme' }), { message: 'profile "acme" not found (profiles/acme/profile.json)' });
});

test('validation', () => {
  assert.throws(() => load({ root: root({ x: mk('etm') }), name: 'x' }), { message: 'profile "x": jira.projectKey must match ^[A-Z][A-Z0-9_]{1,9}$' });
  const p = mk(); delete p.jira.site;
  assert.throws(() => load({ root: root({ x: p }), name: 'x' }), { message: 'profile "x": jira.site missing' });
  const q = mk(); delete q.repos.feRepoDir;
  assert.throws(() => load({ root: root({ x: q }), name: 'x' }), { message: 'profile "x": repos.feRepoDir missing' });
});

test('feBranch defaults to develop', () => {
  const p = mk(); delete p.repos.feBranch;
  assert.equal(load({ root: root({ x: p }), name: 'x' }).repos.feBranch, 'develop');
});

test('keysIn', () => {
  assert.deepEqual(keysIn('[ETM-12] see ETM-7 and XETM-9, ETM-12', etm), ['ETM-12', 'ETM-7']);
});

test('keysIn: underscore separators match, letters and digits before do not', () => {
  assert.deepEqual(keysIn('2026-11-20_122105_ETM-8392', etm), ['ETM-8392']);
  assert.deepEqual(keysIn('draft_ETM-12.md', etm), ['ETM-12']);
  assert.deepEqual(keysIn('XETM-12 2ETM-3', etm), []);
  assert.equal(firstKey('ETM-12abc', etm), 'ETM-12');
});

test('isKey', () => {
  const ab2 = load({ root: root({ x: mk('AB2') }), name: 'x' });
  const qax = load({ root: root({ x: mk('QA_X') }), name: 'x' });
  assert.equal(isKey('ETM-1', etm), true);
  assert.equal(isKey('ETM-1 ', etm), false);
  assert.equal(isKey('AB2-5', ab2), true);
  assert.equal(isKey('QA_X-3', qax), true);
});

test('firstKey, browseUrl, keyRe flags', () => {
  assert.equal(firstKey('no key', etm), '');
  assert.equal(firstKey('a ETM-3 ETM-4', etm), 'ETM-3');
  assert.equal(browseUrl('ETM-5', etm), 'https://pttep.atlassian.net/browse/ETM-5');
  assert.equal(keyRe(etm, { global: true }).flags, 'g');
  assert.equal(keyRe(etm, { anchored: true }).source, '^ETM-\\d+$');
});

test('escapeKey', () => {
  assert.equal(escapeKey('QA_X'), 'QA_X');
  assert.equal(escapeKey('A.B'), 'A\\.B');
  assert.ok(new RegExp(`^${escapeKey('QA_X')}-\\d+$`).test('QA_X-1'));
});

test('QA_PROFILE_ROOT is the default root', () => {
  const r = root({ etm: mk(), zed: mk('ZED') });
  const p = withEnv({ QA_PROFILE: 'zed', QA_PROFILE_ROOT: r }, () => loadProfile());
  assert.equal(p.name, 'zed');
  assert.equal(p.dir, path.join(r, 'profiles', 'zed'));
});

test('rejects unsafe profile names', () => {
  assert.throws(() => load({ root: root(), name: '../x' }), { message: 'profile name "../x" is not allowed' });
  assert.throws(() => withEnv({ QA_PROFILE: '../x', QA_PROFILE_ROOT: undefined }, () => loadProfile({ root: root() })), { message: 'profile name "../x" is not allowed' });
});

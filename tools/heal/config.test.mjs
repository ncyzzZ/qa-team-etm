import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveRepos } from './config.mjs';

const fake = { repos: { pwRepoDir: 'acme-qa', feRepoDir: 'acme-fe', feBranch: 'main' } };
const noEnv = path.join(os.tmpdir(), 'no-such-env-file-for-config-test');

function withoutEnv(fn) {
  const saved = { PW_REPO: process.env.PW_REPO, FE_REPO: process.env.FE_REPO };
  delete process.env.PW_REPO; delete process.env.FE_REPO;
  try { return fn(); } finally {
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
}

test('defaults come from the profile', () => withoutEnv(() => {
  const r = resolveRepos({ envFile: noEnv, profile: fake });
  assert.equal(path.basename(r.pwRepo), 'acme-qa');
  assert.equal(path.basename(r.feRepo), 'acme-fe');
  assert.equal(path.dirname(r.feRepo), path.dirname(r.pwRepo));
  assert.equal(r.feBranch, 'main');
  assert.match(r.sources.fe, /default: acme-fe next to PW_REPO/);
}));

test('PW_REPO env still wins, FE default follows it', () => withoutEnv(() => {
  process.env.PW_REPO = path.join(os.tmpdir(), 'x', 'my-pw');
  const r = resolveRepos({ envFile: noEnv, profile: fake });
  assert.equal(r.pwRepo, process.env.PW_REPO);
  assert.equal(r.feRepo, path.join(os.tmpdir(), 'x', 'acme-fe'));
  assert.equal(r.sources.pw, 'environment');
}));

test('.env value beats the default', () => withoutEnv(() => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cfg-')), '.env');
  fs.writeFileSync(f, 'PW_REPO=/a/pw\nFE_REPO=/b/fe\n');
  const r = resolveRepos({ envFile: f, profile: fake });
  assert.equal(r.pwRepo, '/a/pw'); assert.equal(r.feRepo, '/b/fe'); assert.equal(r.sources.fe, '.env');
}));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pk-'));
fs.mkdirSync(path.join(tmp, 'profiles', 'ab2'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'profiles', 'ab2', 'profile.json'), JSON.stringify({
  jira: { site: 'x.atlassian.net', projectKey: 'AB2' },
  repos: { pwRepoDir: 'pw', feRepoDir: 'fe' },
}));
const stateRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pk-state-'));

function run(script, args) {
  return spawnSync('node', [path.join(ROOT, 'tools', script), ...args], {
    cwd: ROOT, encoding: 'utf8', timeout: 60000,
    env: { ...process.env, QA_PROFILE_ROOT: tmp, QA_PROFILE: 'ab2', STATE_ROOT: stateRoot },
  });
}

const CLIS = [
  ['state.mjs', ['show']],
  ['push-plan.mjs', []],
  ['run-card.mjs', []],
  ['verdicts.mjs', ['table']],
  ['delete-plan.mjs', ['list']],
  ['evidence-check.mjs', ['compare']],
  ['rerun-guard.mjs', []],
  ['build-change.mjs', []],
  ['figma-spec.mjs', ['check']],
  ['auto-next.mjs', []],
];

for (const [script, pre] of CLIS) {
  test(`${script}: profile key AB2 is accepted, ETM is refused`, () => {
    const tail = script === 'auto-next.mjs' ? [stateRoot] : [];
    if (script !== 'auto-next.mjs') { // auto-next would write work/AB2-5 into the repo; its refusal is still checked below
      const ok = run(script, [...pre, 'AB2-5', ...tail]);
      assert.doesNotMatch(ok.stderr, /usage/i, `${script} AB2-5: ${ok.stderr}`);
    }
    const bad = run(script, [...pre, 'ETM-5', ...tail]);
    assert.equal(bad.status, 2, `${script} ETM-5: ${bad.stderr}`);
    assert.match(bad.stderr, /usage/i, `${script} ETM-5: ${bad.stderr}`);
  });
}

test('state.mjs usage message names the profile key', () => {
  const r = run('state.mjs', ['show', 'ETM-5']);
  assert.match(r.stderr, /<AB2-KEY>|AB2/);
});

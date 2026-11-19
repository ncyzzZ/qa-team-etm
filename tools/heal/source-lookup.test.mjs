// Uses a throwaway repo in the OS temp folder only, never stms-fe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { lookup } from './source-lookup.mjs';

const ENV = { ...process.env, GIT_AUTHOR_NAME: 'Dev A', GIT_AUTHOR_EMAIL: 'a@x', GIT_COMMITTER_NAME: 'Dev A', GIT_COMMITTER_EMAIL: 'a@x' };
const sh = (cwd, ...a) => spawnSync('git', a, { cwd, encoding: 'utf8', env: ENV }).stdout.trim();

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'srclookup-'));
const repo = path.join(tmp, 'fe');
fs.mkdirSync(path.join(repo, 'src', 'app'), { recursive: true });
const file = path.join(repo, 'src', 'app', 'plan.component.html');
sh(tmp, 'init', '-q', '-b', 'develop', repo);
fs.writeFileSync(file, '<div class="toolbar">\n  <button class="save-btn">Save</button>\n  <span class="active">x</span>\n</div>\n');
sh(repo, 'add', '.'); sh(repo, 'commit', '-qm', 'c1');
fs.writeFileSync(file, '<div class="toolbar">\n  <button class="plan-save-button">Save Plan</button>\n  <span>x</span>\n</div>\n');
sh(repo, 'commit', '-qam', 'rename save button');
const c2 = sh(repo, 'rev-parse', 'HEAD');
const tok = (kind, value) => ({ file: 'pages/x.ts', line: 1, kind, value });

test('a renamed class is found as removed, with the new class as candidate', () => {
  const r = lookup(repo, tok('class', 'save-btn'), 'HEAD');
  assert.equal(r.present, false);
  assert.equal(r.removedIn.commit, c2);
  assert.equal(r.removedIn.author, 'Dev A');
  assert.deepEqual(r.candidates, ['plan-save-button']);
});

test('a changed text gets the new text as candidate', () => {
  const r = lookup(repo, tok('text', 'Save'), 'HEAD');
  assert.ok(r.candidates.includes('Save Plan'), JSON.stringify(r));
});

test('a class that still exists is present with no candidates', () => {
  const r = lookup(repo, tok('class', 'plan-save-button'), 'HEAD');
  assert.equal(r.present, true);
  assert.deepEqual(r.candidates, []);
});

test('a library class is not looked up in git', () => {
  const r = lookup('/definitely/not/a/repo', tok('class', 'b-grid-row'), 'HEAD');
  assert.equal(r.library, true);
  assert.equal(r.removedIn, null);
});

test('a removed class whose element got no new class gives no candidate', () => {
  const r = lookup(repo, tok('class', 'active'), 'HEAD');
  assert.equal(r.present, false);
  assert.deepEqual(r.candidates, []);
});

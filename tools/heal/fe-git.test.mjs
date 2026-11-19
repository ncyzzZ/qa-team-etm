// Uses throwaway repos in the OS temp folder only, never stms-fe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { git, updateFe } from './fe-git.mjs';

const sh = (cwd, ...args) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
};

/** origin (with a work copy to push from) + a clone on develop */
function makeRepos() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fegit-'));
  const work = path.join(tmp, 'work'), bare = path.join(tmp, 'origin.git'), clone = path.join(tmp, 'clone');
  fs.mkdirSync(work);
  sh(work, 'init', '-q', '-b', 'develop');
  fs.writeFileSync(path.join(work, 'a.html'), '<b class="one"></b>\n');
  sh(work, 'add', '.'); sh(work, 'commit', '-qm', 'c1');
  sh(tmp, 'clone', '-q', '--bare', work, bare);
  sh(tmp, 'clone', '-q', bare, clone);
  sh(work, 'remote', 'add', 'origin', bare);
  const pushNew = () => { fs.appendFileSync(path.join(work, 'a.html'), '<i class="two"></i>\n'); sh(work, 'commit', '-qam', 'c2'); sh(work, 'push', '-q', 'origin', 'develop'); return sh(work, 'rev-parse', 'HEAD'); };
  return { tmp, clone, bare, pushNew };
}

test('commands that could change stms-fe are refused', () => {
  const { clone } = makeRepos();
  for (const args of [['checkout', 'x'], ['reset', '--hard'], ['pull'], ['commit', '-m', 'x'], ['push'], ['merge', 'x'], ['stash'], ['status'], ['clean', '-fd']]) {
    assert.throws(() => git(clone, args), /not allowed on stms-fe/, args.join(' '));
  }
});

test('a short-option cluster hiding -O (pager program) is refused', () => {
  const { clone, tmp } = makeRepos();
  const marker = path.join(tmp, 'ran');
  const script = path.join(tmp, 'p.sh');
  fs.writeFileSync(script, `#!/bin/sh\ntouch "${marker}"\n`, { mode: 0o755 });
  assert.throws(() => git(clone, ['grep', `-nO${script}`, 'one']), /not allowed/);
  assert.equal(fs.existsSync(marker), false);
});

test('unknown flags on read commands are refused', () => {
  const { clone } = makeRepos();
  for (const args of [['diff', '--output=x'], ['log', '--ext-diff'], ['show', '--textconv', 'HEAD'], ['grep', '--open-files-in-pager=x', 'a']]) {
    assert.throws(() => git(clone, args), /not allowed/, args.join(' '));
  }
});

test('pull through git() is refused on a feature branch even with --ff-only', () => {
  const { clone, pushNew } = makeRepos();
  sh(clone, 'switch', '-q', '-c', 'feature/x');
  pushNew();
  const before = sh(clone, 'rev-parse', 'HEAD');
  assert.throws(() => git(clone, ['pull', '--ff-only', '--quiet', 'origin', 'develop']), /develop/);
  assert.equal(sh(clone, 'rev-parse', 'HEAD'), before);
});

test('a folder that is not the root of a git repo is refused (no walking up to a parent repo)', () => {
  const { clone } = makeRepos();
  const sub = path.join(clone, 'sub');
  fs.mkdirSync(sub);
  assert.throws(() => git(sub, ['log', '-1']), /not the root of a git repo/);
});

test('repo hooks and fsmonitor never run', () => {
  const { clone, tmp, pushNew } = makeRepos();
  const marker = path.join(tmp, 'hook-ran');
  for (const h of ['post-merge', 'post-checkout', 'reference-transaction']) {
    fs.writeFileSync(path.join(clone, '.git', 'hooks', h), `#!/bin/sh\ntouch "${marker}"\n`, { mode: 0o755 });
  }
  const mon = path.join(tmp, 'mon.sh');
  fs.writeFileSync(mon, `#!/bin/sh\ntouch "${marker}"\n`, { mode: 0o755 });
  sh(clone, 'config', 'core.fsmonitor', mon);
  pushNew();
  assert.equal(updateFe(clone).mode, 'pull');
  assert.equal(fs.existsSync(marker), false);
});

test('read commands are allowed', () => {
  const { clone } = makeRepos();
  assert.match(git(clone, ['log', '-1', '--format=%s']), /c1/);
});

test('clean clone on develop is pulled fast-forward', () => {
  const { clone, pushNew } = makeRepos();
  const head = pushNew();
  const r = updateFe(clone);
  assert.equal(r.mode, 'pull');
  assert.equal(sh(clone, 'rev-parse', 'HEAD'), head);
  assert.equal(r.newest.commit, head);
});

test('clone on another branch is only fetched, HEAD unchanged', () => {
  const { clone, pushNew } = makeRepos();
  sh(clone, 'switch', '-q', '-c', 'feature/x');
  const before = sh(clone, 'rev-parse', 'HEAD');
  const head = pushNew();
  const r = updateFe(clone);
  assert.equal(r.mode, 'fetch');
  assert.match(r.reason, /feature\/x/);
  assert.equal(sh(clone, 'rev-parse', 'HEAD'), before);
  assert.equal(r.newest.commit, head);
});

test('clone with local edits is only fetched, the edit is kept', () => {
  const { clone, pushNew } = makeRepos();
  // edit a file upstream does NOT touch, so only our own guard (not git's overwrite check) can keep HEAD still
  const { tmp } = { tmp: path.dirname(clone) };
  const work = path.join(tmp, 'work');
  fs.writeFileSync(path.join(work, 'b.txt'), 'b\n'); sh(work, 'add', '.'); sh(work, 'commit', '-qm', 'b'); sh(work, 'push', '-q', 'origin', 'develop');
  sh(clone, 'pull', '-q', '--ff-only');
  fs.writeFileSync(path.join(clone, 'b.txt'), 'MY EDIT\n');
  const before = sh(clone, 'rev-parse', 'HEAD');
  pushNew();
  const r = updateFe(clone);
  assert.equal(r.mode, 'fetch');
  assert.match(r.reason, /local changes/);
  assert.equal(sh(clone, 'rev-parse', 'HEAD'), before);
  assert.equal(fs.readFileSync(path.join(clone, 'b.txt'), 'utf8'), 'MY EDIT\n');
});

test('unreachable origin falls back to the existing origin/develop without throwing', () => {
  const { clone, bare } = makeRepos();
  const known = sh(clone, 'rev-parse', 'origin/develop');
  fs.rmSync(bare, { recursive: true, force: true });
  const r = updateFe(clone);
  assert.equal(r.mode, 'offline');
  assert.equal(r.newest.commit, known);
  assert.match(r.newest.date, /^\d{4}-\d{2}-\d{2}/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { merges, importers, commitBefore } from './git.mjs';

const F = 'src/app/features/shutdown-event-list/';
/** throwaway repo: base, then 2 --no-ff merges into develop and one direct package.json commit */
function fixture() {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'regress-git-'));
  const g = (...a) => execFileSync('git', a, { cwd: r, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: '2026-11-10T10:00:00Z', GIT_COMMITTER_DATE: '2026-11-10T10:00:00Z' } }).trim();
  const w = (p, t) => { fs.mkdirSync(path.join(r, path.dirname(p)), { recursive: true }); fs.writeFileSync(path.join(r, p), t); };
  g('init', '-q', '-b', 'develop'); g('config', 'user.email', 't@t'); g('config', 'user.name', 't');
  w(`${F}pages/worklist/a.ts`, "import { u } from '../../../../shared/u';\nexport const a = 1;\n");
  w('src/app/shared/u.ts', 'export const u = 1;\n');
  w('package.json', '{"version":"1.0.0"}\n');
  g('add', '-A'); g('commit', '-qm', 'base');
  const base = g('rev-parse', 'HEAD');
  g('checkout', '-qb', 'feature/ETM-1');
  w(`${F}pages/worklist/a.ts`, "import { u } from '../../../../shared/u';\nexport const a = 2; // work-row-x\n");
  w(`${F}pages/worklist/a.spec.ts`, 'spec\n');
  g('add', '-A'); g('commit', '-qm', 'one');
  g('checkout', '-q', 'develop'); g('merge', '-q', '--no-ff', 'feature/ETM-1', '-m', "Merge branch 'feature/ETM-1' into 'develop'");
  g('checkout', '-qb', 'fix/no-card');
  w('src/app/shared/u.ts', 'export const u = 2;\n');
  g('add', '-A'); g('commit', '-qm', 'two');
  g('checkout', '-q', 'develop'); g('merge', '-q', '--no-ff', 'fix/no-card', '-m', "Merge branch 'fix/no-card' into 'develop'");
  w('package.json', '{"version":"1.0.1"}\n');
  g('add', '-A'); g('commit', '-qm', '[skip ci] up version');
  return { r, base };
}

test('merges: two merges with branch, keys and changed lines; package-only commit and .spec.ts skipped', () => {
  const { r, base } = fixture();
  const m = merges(r, base, 'develop');
  assert.deepEqual(m.map((x) => x.branch), ['feature/ETM-1', 'fix/no-card']);
  assert.deepEqual(m[0].keys, ['ETM-1']);
  assert.deepEqual(m[0].files.map((f) => f.path), [`${F}pages/worklist/a.ts`]);
  assert.ok(m[0].files[0].lines.some((l) => l.includes('work-row-x')));
  assert.ok(m[0].files[0].lines.some((l) => l.includes('export const a = 1')), 'removed lines are kept too');
  assert.deepEqual(m[1].files.map((f) => f.path), ['src/app/shared/u.ts']);
});

test('importers: the app files that import a shared file', () => {
  const { r } = fixture();
  assert.deepEqual(importers(r, 'src/app/shared/u.ts', 'develop'), [`${F}pages/worklist/a.ts`]);
});

test('commitBefore: last commit of a ref before a date', () => {
  const { r, base } = fixture();
  assert.equal(commitBefore(r, 'develop', '2026-11-11T00:00:00Z').length, 40);
  assert.equal(commitBefore(r, 'develop', '2020-01-01T00:00:00Z'), null);
  void base;
});

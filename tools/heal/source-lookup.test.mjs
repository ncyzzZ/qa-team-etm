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

// Real stms-fe shapes the first version missed (found by the back-test on 2026-11-19)
const repo2 = path.join(tmp, 'fe2');
fs.mkdirSync(path.join(repo2, 'src', 'app'), { recursive: true });
sh(tmp, 'init', '-q', '-b', 'develop', repo2);
const put2 = (f, t) => fs.writeFileSync(path.join(repo2, 'src', 'app', f), t);
put2('menu.component.html', '<nz-dropdown-menu nzOverlayClassName="shared-popover-menu">\n  <span>\n    Save Shutdown Logic\n  </span>\n</nz-dropdown-menu>\n');
put2('no-data.component.ts', "@Component({ selector: 'app-no-data', template: '' })\nexport class NoData {}\n");
put2('modal.component.scss', '.shared-modal {\n  padding: 0;\n}\n');
sh(repo2, 'add', '.'); sh(repo2, 'commit', '-qm', 'c1');

test('a class set through an Angular/ng-zorro ...ClassName attribute is present', () => {
  assert.equal(lookup(repo2, tok('class', 'shared-popover-menu'), 'HEAD').present, true);
});
test('a component selector in a .ts decorator is present as a tag', () => {
  assert.equal(lookup(repo2, tok('tag', 'app-no-data'), 'HEAD').present, true);
});
test('a class defined only in .scss is present', () => {
  assert.equal(lookup(repo2, tok('class', 'shared-modal'), 'HEAD').present, true);
});
test('text on its own line between tags is present', () => {
  assert.equal(lookup(repo2, tok('text', 'Save Shutdown Logic'), 'HEAD').present, true);
});
test('a renamed ...ClassName value is found as removed with its replacement', () => {
  put2('menu.component.html', '<nz-dropdown-menu nzOverlayClassName="status-popover-menu">\n  <span>\n    Save Shutdown Logic\n  </span>\n</nz-dropdown-menu>\n');
  sh(repo2, 'commit', '-qam', 'rename menu class');
  const r = lookup(repo2, tok('class', 'shared-popover-menu'), 'HEAD');
  assert.equal(r.present, false);
  assert.deepEqual(r.candidates, ['status-popover-menu']);
});

test('a name only in a comment, an import path, a .spec.ts or a .md file does not count as present', () => {
  const r3 = path.join(tmp, 'fe3');
  fs.mkdirSync(path.join(r3, 'src', 'app', 'filter'), { recursive: true });
  sh(tmp, 'init', '-q', '-b', 'develop', r3);
  const p3 = (f, t) => fs.writeFileSync(path.join(r3, 'src', 'app', f), t);
  p3('filter/a.component.ts', "/**\n * `shutdown-filter-panel`: a header with a Reset action\n */\nimport { X } from './shutdown-filter-panel.component';\n// old .shutdown-filter-panel removed\n");
  p3('filter/a.component.spec.ts', "it('shows .shutdown-filter-panel', () => { el.querySelector('.shutdown-filter-panel'); });\n");
  p3('CLAUDE.md', 'The shutdown-filter-panel composes sections.\n');
  sh(r3, 'add', '.'); sh(r3, 'commit', '-qm', 'c');
  assert.equal(lookup(r3, tok('class', 'shutdown-filter-panel'), 'HEAD').present, false);
});

test('text in a title-like attribute (pageTitle="...") is present', () => {
  const r4 = path.join(tmp, 'fe4');
  fs.mkdirSync(path.join(r4, 'src', 'app'), { recursive: true });
  sh(tmp, 'init', '-q', '-b', 'develop', r4);
  fs.writeFileSync(path.join(r4, 'src', 'app', 'p.component.html'), '<app-page-container pageTitle="Edit Shutdown Timeline Plan" [extra]="x">\n');
  sh(r4, 'add', '.'); sh(r4, 'commit', '-qm', 'c');
  assert.equal(lookup(r4, tok('text', 'Edit Shutdown Timeline Plan'), 'HEAD').present, true);
});

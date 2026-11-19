// Builds a fake Playwright repo and fake FE repos in the OS temp folder only, never stms-fe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pageUnit, pagesUsedBy, readBaseline, advanceBaseline } from './baseline.mjs';
import { preflight } from './preflight.mjs';

const ENV = { ...process.env, GIT_AUTHOR_NAME: 'Dev A', GIT_AUTHOR_EMAIL: 'a@x', GIT_COMMITTER_NAME: 'Dev A', GIT_COMMITTER_EMAIL: 'a@x' };
const sh = (cwd, ...a) => { const r = spawnSync('git', a, { cwd, encoding: 'utf8', env: ENV }); if (r.status) throw new Error(r.stderr); return r.stdout.trim(); };
const put = (root, rel, text) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), text); };

function pwRepo() {
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-pw-'));
  put(pw, 'pages/pages.ts', [
    "import { LoginPage } from '@pages/loginPage';",
    "import { SharedComponents } from '@components/sharedComponents';",
    "import { ShutdownLogicPage } from '@pages/shutdownLogicPage/shutdownLogicPage';",
    'export class Pages {',
    '  get loginPage(): LoginPage { return new LoginPage(this.page); }',
    '  get sharedComponents(): SharedComponents { return new SharedComponents(this.page); }',
    '  get shutdownLogicPage(): ShutdownLogicPage { return new ShutdownLogicPage(this.page); }',
    '}',
  ].join('\n'));
  put(pw, 'pages/loginPage.ts', "export class LoginPage { get u() { return this.page.locator('#username'); } }\n");
  put(pw, 'pages/sharedComponent/sharedComponents.ts', "export class SharedComponents { get toast() { return this.page.locator('.toast-msg'); } }\n");
  put(pw, 'pages/shutdownLogicPage/locators/locators.ts', [
    'export class Locators {',
    "  get save() { return this.page.locator('.save-btn'); }",
    "  get on() { return this.page.locator('.active'); }",
    "  get row() { return this.page.locator('.b-grid-row'); }",
    '}',
  ].join('\n'));
  put(pw, 'pages/timelinePage/editPlanPage.ts', "export class EditPlanPage { get t() { return this.page.getByText('Edit Plan'); } }\n");
  put(pw, 'tests/fe/e2e/a.spec.ts', [
    "import { test } from '@fixtures/pageFixtures';",
    "test('[ETM-1] a', async ({ turnaroundManagerPages }) => { await turnaroundManagerPages.shutdownLogicPage.actions.go(); });",
  ].join('\n'));
  put(pw, 'tests/fe/e2e/b.spec.ts', [
    "import { test } from '@fixtures/pageFixtures';",
    "import { openPlan } from './timeline.helpers';",
    "test('[ETM-2] b', async ({ turnaroundManagerPages: p }) => { await openPlan(p); });",
  ].join('\n'));
  put(pw, 'tests/fe/e2e/timeline.helpers.ts', "import { EditPlanPage } from '@pages/timelinePage/editPlanPage';\nexport const openPlan = () => {};\n");
  return pw;
}

function feRepos() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-fe-'));
  const work = path.join(tmp, 'work'), bare = path.join(tmp, 'origin.git'), clone = path.join(tmp, 'stms-fe');
  fs.mkdirSync(work);
  sh(work, 'init', '-q', '-b', 'develop');
  put(work, 'src/app/plan.component.html', '<div class="toolbar">\n  <button class="save-btn">Save</button>\n  <span class="active">x</span>\n</div>\n');
  sh(work, 'add', '.'); sh(work, 'commit', '-qm', 'c1');
  const c1 = sh(work, 'rev-parse', 'HEAD');
  sh(tmp, 'clone', '-q', '--bare', work, bare);
  sh(work, 'remote', 'add', 'origin', bare);
  sh(tmp, 'clone', '-q', bare, clone);
  const rename = () => {
    put(work, 'src/app/plan.component.html', '<div class="toolbar">\n  <button class="plan-save-button">Save</button>\n  <span>x</span>\n</div>\n');
    sh(work, 'commit', '-qam', 'rename save button'); sh(work, 'push', '-q', 'origin', 'develop');
    return sh(work, 'rev-parse', 'HEAD');
  };
  return { clone, c1, rename };
}

test('pageUnit is the first folder (or file) under pages/', () => {
  assert.equal(pageUnit('pages/shutdownLogicPage/locators/locators.ts'), 'shutdownLogicPage');
  assert.equal(pageUnit('pages/loginPage.ts'), 'loginPage');
  assert.equal(pageUnit('pages/sharedComponent/x.ts'), 'sharedComponent');
  assert.equal(pageUnit('pages\\timelinePage\\editPlanPage.ts'), 'timelinePage');
});

test('page use comes from getters, not from the pageFixtures import (which reaches every page)', () => {
  const pw = pwRepo();
  assert.deepEqual(pagesUsedBy(pw, ['tests/fe/e2e/a.spec.ts']), ['shutdownLogicPage']);
});

test('page use follows local helper imports to direct @pages imports', () => {
  const pw = pwRepo();
  assert.deepEqual(pagesUsedBy(pw, ['tests/fe/e2e/b.spec.ts']), ['timelinePage']);
});

test('advanceBaseline moves only the given units', () => {
  const pw = pwRepo();
  advanceBaseline(pw, ['loginPage', 'timelinePage'], 'aaa');
  advanceBaseline(pw, ['timelinePage'], 'bbb');
  assert.deepEqual(readBaseline(pw), { loginPage: 'aaa', timelinePage: 'bbb' });
});

test('first pre-flight records baselines and warns about nothing', () => {
  const pw = pwRepo(); const fe = feRepos();
  const r = preflight(pw, fe.clone);
  assert.equal(r.atRisk.length, 0);
  assert.ok(r.noBaseline.includes('shutdownLogicPage'));
  assert.equal(readBaseline(pw).shutdownLogicPage, fe.c1);
});

test('a class renamed in stms-fe since the baseline is flagged with its candidate; generic and library classes are not', () => {
  const pw = pwRepo(); const fe = feRepos();
  preflight(pw, fe.clone);
  const c2 = fe.rename();
  const r = preflight(pw, fe.clone);
  assert.equal(r.fe.mode, 'pull');
  assert.equal(r.atRisk.length, 1, JSON.stringify(r.atRisk));
  const row = r.atRisk[0];
  assert.equal(row.page, 'pages/shutdownLogicPage/locators/locators.ts');
  assert.equal(row.line, 2);
  assert.equal(row.token.value, 'save-btn');
  assert.deepEqual(row.candidates, ['plan-save-button']);
  assert.equal(row.commit, c2);
  assert.equal(row.author, 'Dev A');
  assert.equal(readBaseline(pw).shutdownLogicPage, fe.c1, 'pre-flight never moves a baseline that has a warning');
  assert.ok(fs.readFileSync(r.reportFile, 'utf8').includes('probably broken'));
});

test('--card limits pre-flight to the pages its specs use', () => {
  const pw = pwRepo(); const fe = feRepos();
  preflight(pw, fe.clone);
  fe.rename();
  const r = preflight(pw, fe.clone, { specs: ['tests/fe/e2e/b.spec.ts'] });
  assert.equal(r.atRisk.length, 0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractTokens, isLibraryToken, GENERIC_TOKENS } from './selectors.mjs';
import { resolveRepos } from './config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SAMPLE = path.join(ROOT, 'evals', 'heal', 'pages-sample.ts');

test('extractTokens finds one token of each kind with its line', () => {
  const got = extractTokens(fs.readFileSync(SAMPLE, 'utf8'), 'pages/sample.ts').map((t) => `${t.line} ${t.kind}:${t.value}`);
  for (const want of [
    '3 class:b-grid-row', '4 id:saveBtn', '5 attr:name', '6 class:b-grid-header-text-content', '6 text:Scheduled',
    '7 role-name:Save Plan', '8 text:Weekly Plan', '9 placeholder:Search', '10 label:Remark', '11 tag:app-shutdown-gantt-chart',
  ]) assert.ok(got.includes(want), `missing ${want} in ${JSON.stringify(got)}`);
});

test('extractTokens skips template literals instead of guessing', () => {
  const got = extractTokens(fs.readFileSync(SAMPLE, 'utf8'), 'pages/sample.ts');
  assert.equal(got.filter((t) => t.line === 12).length, 0);
});

test('extractTokens keeps the file name on every token', () => {
  const got = extractTokens("this.page.locator('.x-y')", 'pages/a.ts');
  assert.deepEqual(got, [{ file: 'pages/a.ts', line: 1, kind: 'class', value: 'x-y' }]);
});

test('isLibraryToken is true for Bryntum and AG Grid classes only', () => {
  assert.equal(isLibraryToken('b-grid-row'), true);
  assert.equal(isLibraryToken('ag-row'), true);
  assert.equal(isLibraryToken('mob-plan-table'), false);
});

test('GENERIC_TOKENS holds the common words', () => {
  for (const w of ['active', 'disabled', 'btn', 'row', 'cell']) assert.ok(GENERIC_TOKENS.has(w));
});

test('resolveRepos defaults FE_REPO to stms-fe next to PW_REPO', () => {
  const old = { pw: process.env.PW_REPO, fe: process.env.FE_REPO };
  process.env.PW_REPO = '/x/qa'; delete process.env.FE_REPO;
  try {
    const r = resolveRepos({ envFile: '/nonexistent/.env' });
    assert.equal(r.pwRepo, '/x/qa');
    assert.equal(r.feRepo, path.resolve('/x/stms-fe'));
  } finally {
    if (old.pw === undefined) delete process.env.PW_REPO; else process.env.PW_REPO = old.pw;
    if (old.fe !== undefined) process.env.FE_REPO = old.fe;
  }
});

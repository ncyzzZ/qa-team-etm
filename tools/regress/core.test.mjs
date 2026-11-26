import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cardKeys, mapPath, isShared, isListable, tier, commands } from './core.mjs';

const MAP = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'regress-map.json'), 'utf8'));
const F = 'src/app/features/shutdown-event-list/';
const spec = (file, folder, { keys = [], tokens = [], owner = null } = {}) => ({ file, folder, keys, tokens: new Set(tokens), owner });
const merge = (branch, files) => ({ commit: `c-${branch}`, branch, keys: cardKeys(branch), files: files.map(([p, lines = []]) => ({ path: p, lines })) });
const run = (specs, merges, importers = () => []) => tier({ specs, merges, map: MAP, importers });

test('cardKeys: keys from the branch name, a bare number keeps the prefix', () => {
  assert.deepEqual(cardKeys('feature/ETM-8666,8664'), ['ETM-8666', 'ETM-8664']);
  assert.deepEqual(cardKeys('features/improve-shutdown-logic'), []);
  assert.deepEqual(cardKeys('feature/ETM-7343_actual-equal-plan-default'), ['ETM-7343']);
  assert.deepEqual(cardKeys('feature/ETM-8671-8672'), ['ETM-8671', 'ETM-8672']);
});

test('mapPath: a page folder maps to its spec folder, an unknown path is null', () => {
  assert.deepEqual(mapPath(MAP, `${F}pages/shutdown-logic/page/x.ts`), ['shutdownLogic']);
  assert.deepEqual(mapPath(MAP, `${F}pages/worklist-import/a.html`), ['importWork']);
  assert.equal(mapPath(MAP, 'src/app/features/login/x.ts'), null);
});

test('isShared: shared, core, app root, feature components / utils / routes; not a mapped component', () => {
  assert.equal(isShared(MAP, `${F}components/status-tag/x.ts`), true);
  assert.equal(isShared(MAP, `${F}components/planning-list/x.ts`), false);
  assert.equal(isShared(MAP, 'src/app/core/a.ts'), true);
  assert.equal(isShared(MAP, 'src/app/app.routes.ts'), true);
  assert.equal(isShared(MAP, `${F}shutdown-event-list.routes.ts`), true);
  assert.equal(isShared(MAP, `${F}utils/date.ts`), true);
  assert.equal(isShared(MAP, `${F}pages/worklist/page/a.ts`), false);
});

test('isListable: e2e specs only, no setup / cleanup / probe', () => {
  assert.equal(isListable('tests/fe/e2e/shutdownLogic/verifyX.spec.ts'), true);
  assert.equal(isListable('tests/fe/e2e/planning/setupDuplicatePlanEvent.spec.ts'), false);
  assert.equal(isListable('tests/fe/e2e/x/probeY.spec.ts'), false);
  assert.equal(isListable('tests/fe/e2e/x/cleanupZ.spec.ts'), false);
  assert.equal(isListable('tests/fe/setup/setupCard.spec.ts'), false);
  assert.equal(isListable('tests/fe/e2e/manual/a.spec.ts'), false);
});

test('tier: the merged card own specs are Must', () => {
  const r = run([spec('a.spec.ts', 'shutdownTimeline', { keys: ['ETM-8638'], owner: 'ETM-8405' })],
    [merge('feature/ETM-8405', [[`${F}pages/login-x/a.ts`]])]);
  assert.equal(r.rows[0].tier, 'Must');
  assert.match(r.rows[0].reasons.join(' '), /ETM-8405/);
});

test('tier: a token in a changed line of a mapped file is Must, the same folder without it is Should', () => {
  const r = run([
    spec('hit.spec.ts', 'shutdownTimeline', { tokens: ['timeline-grid__cell--activity'] }),
    spec('same.spec.ts', 'shutdownTimeline', { tokens: ['other-token'] }),
  ], [merge('fix/x', [[`${F}pages/timeline/grid.html`, ['<div class="timeline-grid__cell--activity">']]])]);
  const by = Object.fromEntries(r.rows.map((x) => [x.file, x]));
  assert.equal(by['hit.spec.ts'].tier, 'Must');
  assert.match(by['hit.spec.ts'].reasons.join(' '), /timeline-grid__cell--activity/);
  assert.equal(by['same.spec.ts'].tier, 'Should');
});

test('tier: a token used by more than 5 specs does not make a Must', () => {
  const specs = Array.from({ length: 6 }, (_, i) => spec(`s${i}.spec.ts`, 'dailyReport', { tokens: ['common-token'] }));
  const r = run(specs, [merge('fix/x', [[`${F}pages/worklist/a.ts`, ['common-token here']]])]);
  assert.equal(r.rows.filter((x) => x.tier === 'Must').length, 0);
});

test('tier: in a big merge one token hit is only Should with "big merge"; two distinct tokens stay Must', () => {
  const files = Array.from({ length: 21 }, (_, i) => [`${F}pages/worklist/f${i}.ts`, i === 0 ? ['tok-one tok-two'] : ['x']]);
  const r = run([
    spec('one.spec.ts', 'dailyReport', { tokens: ['tok-one'] }),
    spec('two.spec.ts', 'dailyReport', { tokens: ['tok-one', 'tok-two'] }),
  ], [merge('features/big', files)]);
  const by = Object.fromEntries(r.rows.map((x) => [x.file, x]));
  assert.equal(by['one.spec.ts'].tier, 'Should');
  assert.match(by['one.spec.ts'].reasons.join(' '), /big merge/);
  assert.equal(by['two.spec.ts'].tier, 'Must');
});

test('tier: a shared file is Warn for the specs of the pages that import it; more than 5 pages is a wide change', () => {
  const dr = spec('dr.spec.ts', 'dailyReport');
  const r = run([dr], [merge('fix/no-card', [['src/app/shared/u.ts']])], () => [`${F}pages/daily-report/page/a.ts`]);
  assert.equal(r.rows[0].tier, 'Warn');
  assert.equal(r.rows[0].file, 'dr.spec.ts');
  const six = ['shutdown-logic', 'daily-report', 'timeline', 'mob-plan', 'equipment-mob-plan', 'worklist'].map((p) => `${F}pages/${p}/a.ts`);
  const w = run([dr], [merge('fix/no-card', [['src/app/shared/u.ts']])], () => six);
  assert.equal(w.rows.length, 0);
  assert.equal(w.wide.length, 1);
});

test('tier: one spec hit by three merges is one row with three reasons', () => {
  const s = spec('a.spec.ts', 'worklist', { tokens: ['work-row-x'] });
  const m = (b) => merge(b, [[`${F}pages/worklist/a.ts`, ['work-row-x']]]);
  const r = run([s], [m('fix/a'), m('fix/b'), m('fix/c')]);
  assert.equal(r.rows.length, 1);
  for (const b of ['fix/a', 'fix/b', 'fix/c']) assert.ok(r.rows[0].reasons.some((x) => x.startsWith(b)), `a reason for ${b}`);
});

test('tier: an app file no prefix maps is listed as not mapped', () => {
  const r = run([], [merge('fix/x', [[`${F}pages/edit-organic-crew/a.ts`]])]);
  assert.deepEqual(r.notMapped, [`${F}pages/edit-organic-crew/a.ts`]);
});

test('commands: one run-card per owner (Must files first, the data gate allows one run per reset); no owner goes to plain playwright from PW_REPO', () => {
  const c = commands([
    { file: 'tests/fe/e2e/b.spec.ts', tier: 'Should', reasons: [], owner: 'ETM-8405' },
    { file: 'tests/fe/e2e/a.spec.ts', tier: 'Must', reasons: [], owner: 'ETM-8405' },
    { file: 'tests/fe/e2e/c.spec.ts', tier: 'Must', reasons: [], owner: null },
  ], { pwRepo: '/pw repo' });
  const rc = c.filter((x) => x.includes('run-card.mjs ETM-8405'));
  assert.equal(rc.length, 1);
  assert.ok(rc[0].indexOf('a.spec.ts') < rc[0].indexOf('b.spec.ts'), 'Must files first');
  const plain = c.filter((x) => x.includes('npx playwright test'));
  assert.equal(plain.length, 1);
  assert.ok(plain[0].startsWith('cd "/pw repo" && npx playwright test'));
  assert.match(plain[0], /--workers=1 --reporter=line/);
});

test('tier: a token matches as a whole word only (weekly-cell inside weekly-cells is not a hit)', () => {
  const r = run([spec('a.spec.ts', 'dailyReport', { tokens: ['weekly-cell'] })], [merge('fix/x', [[`${F}pages/worklist/a.ts`, ['<td class="weekly-cells">']]])]);
  assert.equal(r.rows.filter((x) => x.file === 'a.spec.ts' && x.tier === 'Must').length, 0);
  const h = run([spec('a.spec.ts', 'dailyReport', { tokens: ['weekly-cell'] })], [merge('fix/x', [[`${F}pages/worklist/a.ts`, ['<td class="x weekly-cell">']]])]);
  assert.equal(h.rows.find((x) => x.file === 'a.spec.ts').tier, 'Must');
});

test('tier: reasons and tier are kept per merge group (ETM-1 does not get the reasons of ETM-12)', () => {
  const a = spec('a.spec.ts', 'worklist', { tokens: ['work-row-x'] });
  const b = spec('b.spec.ts', 'dailyReport');
  const r = run([a, b], [
    merge('feature/ETM-1', [[`${F}pages/worklist/a.ts`, ['work-row-x']]]),
    merge('feature/ETM-12', [[`${F}pages/daily-report/b.ts`]]),
    merge('fix/sonar', [[`${F}pages/worklist/c.ts`]]),
  ]);
  const ra = r.rows.find((x) => x.file === 'a.spec.ts'), rb = r.rows.find((x) => x.file === 'b.spec.ts');
  assert.equal(ra.byGroup['c-feature/ETM-1'].tier, 'Must');
  assert.equal(ra.byGroup['c-fix/sonar'].tier, 'Should', 'the group tier, not the overall Must');
  assert.equal(rb.byGroup['c-feature/ETM-1'], undefined);
  assert.equal(rb.byGroup['c-feature/ETM-12'].tier, 'Should');
});

test('isListable: *.manual.spec.ts specs are not run unattended', () => {
  assert.equal(isListable('tests/fe/e2e/shutdownLogic/verifyX.manual.spec.ts'), false);
});

test('tier: the @high base is in every run; a merge-ranked spec keeps its tier; commands run only @high for base specs', () => {
  const s1 = { ...spec('tests/fe/e2e/a.spec.ts', 'worklist', { owner: 'ETM-1' }), high: ['ETM-2'] };
  const s2 = { ...spec('tests/fe/e2e/b.spec.ts', 'dailyReport', { owner: 'ETM-1' }), high: ['ETM-3'] };
  const r = run([s1, s2], [merge('fix/x', [[`${F}pages/worklist/a.ts`]])]);
  const by = Object.fromEntries(r.rows.map((x) => [x.file, x]));
  assert.equal(by['tests/fe/e2e/a.spec.ts'].tier, 'Should');                  // touched by the merge: whole spec
  assert.equal(by['tests/fe/e2e/b.spec.ts'].tier, 'High');                    // untouched: @high base
  const c = commands(r.rows);
  assert.ok(c.some((x) => x === 'node tools/run-card.mjs ETM-1 tests/fe/e2e/a.spec.ts'));
  assert.ok(c.some((x) => x === 'node tools/run-card.mjs ETM-1 tests/fe/e2e/b.spec.ts -g "@high"'));
  assert.equal(tier({ specs: [s2], merges: [], map: MAP, importers: () => [], high: false }).rows.length, 0);   // --card / --no-high
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { main } from './report.mjs';

const F = 'src/app/features/shutdown-event-list/';
const SINCE = 'a'.repeat(40), TO = 'b'.repeat(40);
const spec = (file, folder, owner = null, tokens = []) => ({ file, folder, keys: [], tokens: new Set(tokens), owner });

function deps(extra = {}) {
  const pwRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'regress-rep-pw-'));
  const teamRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'regress-rep-team-'));
  const out = [];
  return {
    feRepo: '/fe', pwRepo, teamRoot, out,
    now: () => new Date('2026-11-20T10:00:00Z'),
    log: (s) => out.push(s),
    update: () => ({ mode: 'fetch' }),
    resolve: (_fe, ref) => (ref === 'origin/develop' ? TO : ref),
    commitBefore: () => SINCE,
    gitDate: () => '2026-11-01T00:00:00Z',
    merges: () => [
      { commit: 'm1', branch: 'feature/ETM-1', keys: ['ETM-1'], files: [{ path: `${F}pages/worklist/a.ts`, lines: ['work-row-x'] }] },
      { commit: 'm2', branch: 'fix/no-card', keys: [], files: [{ path: 'src/app/shared/u.ts', lines: ['x'] }] },
    ],
    specIndex: () => [spec('tests/fe/e2e/worklist/a.spec.ts', 'worklist', 'ETM-1', ['work-row-x']), spec('tests/fe/e2e/dailyReport/d.spec.ts', 'dailyReport')],
    importers: () => [`${F}pages/daily-report/page/x.ts`],
    ...extra,
  };
}
const reports = (d) => { try { return fs.readdirSync(path.join(d.teamRoot, 'work', 'REGRESSION')); } catch { return []; } };

test('report: written as <date>_<since7>..<to7>.md and .json, with a no-card group and a Warn row', async () => {
  const d = deps();
  assert.equal(await main([], d), 0);
  const name = `2026-11-20_${SINCE.slice(0, 7)}..${TO.slice(0, 7)}`;
  assert.deepEqual(reports(d).sort(), [`${name}.json`, `${name}.md`]);
  const md = fs.readFileSync(path.join(d.teamRoot, 'work', 'REGRESSION', `${name}.md`), 'utf8');
  assert.match(md, /no card/);
  assert.match(md, /\| Warn \| tests\/fe\/e2e\/dailyReport\/d\.spec\.ts/);
  assert.match(md, /deployed commit is unknown/);
  assert.match(md, /run-card\.mjs ETM-1/);
});

test('start: no last.json and no heal baseline -> 14 days, said in the report', async () => {
  const d = deps();
  await main([], d);
  const json = JSON.parse(fs.readFileSync(path.join(d.teamRoot, 'work', 'REGRESSION', reports(d).find((f) => f.endsWith('.json'))), 'utf8'));
  assert.equal(json.how, '14 days');
});

test('start: last.json wins over the heal baseline', async () => {
  const d = deps();
  fs.mkdirSync(path.join(d.pwRepo, 'output', 'regression'), { recursive: true });
  fs.writeFileSync(path.join(d.pwRepo, 'output', 'regression', 'last.json'), JSON.stringify({ commit: 'c'.repeat(40) }));
  await main([], d);
  const json = JSON.parse(fs.readFileSync(path.join(d.teamRoot, 'work', 'REGRESSION', reports(d).find((f) => f.endsWith('.json'))), 'utf8'));
  assert.equal(json.how, 'last regression');
  assert.equal(json.range.since, 'c'.repeat(40));
});

test('mark: no saved report -> exit 2; after a report -> last.json holds its "to" commit', async () => {
  const d = deps();
  assert.equal(await main(['mark'], d), 2);
  await main([], d);
  assert.equal(await main(['mark'], d), 0);
  assert.equal(JSON.parse(fs.readFileSync(path.join(d.pwRepo, 'output', 'regression', 'last.json'), 'utf8')).commit, TO);
});

test('--card ETM-1 keeps only the merges of that card', async () => {
  const d = deps();
  await main(['--card', 'ETM-1'], d);
  const json = JSON.parse(fs.readFileSync(path.join(d.teamRoot, 'work', 'REGRESSION', reports(d).find((f) => f.endsWith('.json'))), 'utf8'));
  assert.deepEqual(json.groups.map((g) => g.branch), ['feature/ETM-1']);
  assert.ok(!json.rows.some((r) => r.tier === 'Warn'));
});

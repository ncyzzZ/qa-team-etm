import test from 'node:test';
import assert from 'node:assert/strict';
import { defectChange, parseAssessment, boardTime, effort, capabilities } from './sprint-report.mjs';

test('defectChange: % change vs the previous closed sprint; an active sprint is marked, not compared as final', () => {
  const rows = [
    { sprint: 24, active: false, defectsPerStory: 1.05, bugs: 4 },
    { sprint: 25, active: false, defectsPerStory: 1.0, bugs: 3 },
    { sprint: 26, active: true, defectsPerStory: 0.5, bugs: 0 },
  ];
  const c = defectChange(rows);
  assert.equal(c[0].defectPct, null);
  assert.equal(Math.round(c[1].defectPct), -5);
  assert.equal(Math.round(c[1].bugPct), -25);
  assert.equal(c[2].provisional, true);
  assert.equal(Math.round(c[2].defectPct), -50);
});

test('defectChange: previous sprint with 0 bugs gives no % (not Infinity)', () => {
  const c = defectChange([{ sprint: 1, active: false, defectsPerStory: 1, bugs: 0 }, { sprint: 2, active: false, defectsPerStory: 1, bugs: 2 }]);
  assert.equal(c[1].bugPct, null);
});

test('parseAssessment: reads key, ~TC and ~Hours from the lead table', () => {
  const md = `| Story | Status | Readiness | Risk | ~TC | ~Hours | Main open points |
|---|---|---|---|---|---|---|
| ETM-7343 Actual % font color | Open | Ready | Low-Med | 10 | 3 | x |
| ETM-8034 Row highlight | Open | Ready | High | 25 | 8 | y |
| ETM-8415 Fix Work Header | Open | Cannot assess | Unknown | 0 | 0 | z |`;
  assert.deepEqual(parseAssessment(md), [
    { key: 'ETM-7343', tc: 10, hours: 3 },
    { key: 'ETM-8034', tc: 25, hours: 8 },
    { key: 'ETM-8415', tc: 0, hours: 0 },
  ]);
});

test('boardTime: sums working time per card, each segment capped, and counts the questions to the user', () => {
  const m = 60_000;
  const ev = [
    { t: 0, job: 'ETM-1', type: 'set', agent: 'lead', state: 'working' },
    { t: 10 * m, job: 'ETM-1', type: 'set', agent: 'lead', state: 'waiting' },
    { t: 11 * m, job: 'ETM-1', type: 'ask', text: 'q' },
    { t: 20 * m, job: 'ETM-1', type: 'set', agent: 'lead', state: 'working' },
    { t: 500 * m, job: 'ETM-1', type: 'set', agent: 'lead', state: 'done' }, // left "working" for hours: capped
    { t: 0, job: 'ETM-2', type: 'set', agent: 'designer', state: 'working' },
    { t: 5 * m, job: 'ETM-2', type: 'set', agent: 'designer', state: 'done' },
  ];
  const r = boardTime(ev, { capMin: 45 });
  assert.deepEqual(r['ETM-1'], { aiMin: 55, asks: 1, done: 0 });
  assert.deepEqual(r['ETM-2'], { aiMin: 5, asks: 0, done: 1 });
});

test('boardTime: two agents working at once count the overlap once', () => {
  const m = 60_000;
  const ev = [
    { t: 0, job: 'ETM-1', type: 'set', agent: 'lead', state: 'working' },
    { t: 0, job: 'ETM-1', type: 'set', agent: 'designer', state: 'working' },
    { t: 10 * m, job: 'ETM-1', type: 'set', agent: 'designer', state: 'done' },
    { t: 10 * m, job: 'ETM-1', type: 'set', agent: 'lead', state: 'done' },
  ];
  assert.equal(boardTime(ev, { capMin: 45 })['ETM-1'].aiMin, 10);
});

test('effort: manual estimate vs AI time per card of the sprint; cards without data are "-" and left out of totals', () => {
  const r = effort(['ETM-1', 'ETM-2', 'ETM-3'], [{ key: 'ETM-1', tc: 10, hours: 3 }, { key: 'ETM-2', tc: 5, hours: 2 }], { 'ETM-1': { aiMin: 60, asks: 2, done: 3 } });
  assert.deepEqual(r.cards.map((c) => [c.key, c.manualH, c.aiH, c.asks]), [['ETM-1', 3, 1, 2], ['ETM-2', 2, null, null]]); // ETM-3: no estimate, no board: not listed
  assert.deepEqual(r.total, { cards: 1, manualH: 3, aiH: 1, savedH: 2, asks: 2 });
});

test('effort: a card whose board record is not a full cycle (fewer than 2 agent hand-backs) is not measured', () => {
  const r = effort(['ETM-1'], [{ key: 'ETM-1', tc: 10, hours: 9 }], { 'ETM-1': { aiMin: 6, asks: 0, done: 1 } });
  assert.equal(r.cards[0].aiH, null);
  assert.equal(r.cards[0].partial, true);
  assert.equal(r.total.cards, 0);
});

test('capabilities: one line per agent from its frontmatter', () => {
  const files = { 'ba-analyst.md': '---\nname: ba-analyst\ndescription: BA Analyst. Use first on every Story.\n---\nbody' };
  assert.deepEqual(capabilities(files), [{ name: 'ba-analyst', what: 'BA Analyst. Use first on every Story.' }]);
});

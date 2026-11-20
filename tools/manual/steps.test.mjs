import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseManualSteps, checkManual, xrayStepCounts } from './steps.mjs';

const SAMPLE = `# ETM-1 manual steps

## Before you start
- free text, ignored

## ETM-11 - lines in the PDF (3 steps)
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Open the Daily Report | It opens, \`Unfreeze\` | header |
| 2 | Export, \`Daily Plan\` | a PDF is downloaded | download |
| 3 | Open the PDF | Gantt is shown | PDF page |

## ETM-12 - extend the last day (2 steps)
role: jobOwner
writes data: yes
start: /shutdown-event-list

Some note before the table.

| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Add an Extension | one more day | grid |
| 2 | Look at Ramp Up | line on the same date | zoom |

## ETM-13 - real Excel (1 steps)
needs: excel
| # | Do | Expected | Picture |
|---|---|---|---|
| 1 | Paste from Excel | rows are added | grid |
`;

test('parses keys, titles, roles, options and steps', () => {
  const t = parseManualSteps(SAMPLE);
  assert.deepEqual(t.map((x) => x.key), ['ETM-11', 'ETM-12', 'ETM-13']);
  assert.equal(t[0].title, 'lines in the PDF');
  assert.equal(t[0].role, 'turnaroundManager');
  assert.equal(t[0].writesData, false);
  assert.equal(t[1].role, 'jobOwner');
  assert.equal(t[1].writesData, true);
  assert.equal(t[1].start, '/shutdown-event-list');
  assert.equal(t[0].start, null);
  assert.deepEqual(t.map((x) => x.steps.length), [3, 2, 1]);
  assert.equal(t[0].steps[1].expected, 'a PDF is downloaded');
  assert.equal(t[0].steps[1].do, 'Export, `Daily Plan`');
  assert.equal(t[0].steps[1].picture, 'download');
  assert.equal(t[0].steps[1].n, 2);
});

test('needs: excel becomes needs [excel]', () => {
  const t = parseManualSteps(SAMPLE);
  assert.deepEqual(t[2].needs, ['excel']);
  assert.deepEqual(t[0].needs, []);
});

test('heading count different from the table: parser keeps the rows, checker names key and both counts', () => {
  const md = SAMPLE.replace('(3 steps)', '(6 steps)').replace('| 3 | Open the PDF | Gantt is shown | PDF page |\n', '').replace('(6 steps)', '(6 steps)');
  const t = parseManualSteps(md.replace('(6 steps)', '(6 steps)'));
  assert.equal(t[0].steps.length, 2);
  const md2 = SAMPLE.replace('(3 steps)', '(6 steps)').replace('| 3 | Open the PDF | Gantt is shown | PDF page |\n', '| 3 | Open the PDF | Gantt is shown | PDF page |\n| 4 | a | b | c |\n| 5 | a | b | c |\n');
  const t2 = parseManualSteps(md2);
  assert.equal(t2[0].steps.length, 5);
  const e = checkManual(t2, {});
  assert.equal(e.length, 1);
  assert.match(e[0], /ETM-11/);
  assert.match(e[0], /6 vs 5/);
});

test('table rows different from the Xray steps: error with key and both counts', () => {
  const e = checkManual(parseManualSteps(SAMPLE), { 'ETM-11': 4, 'ETM-12': 2 });
  assert.equal(e.length, 1);
  assert.match(e[0], /ETM-11/);
  assert.match(e[0], /Xray has 4 step\(s\), the table has 3/);
});

test('empty Do or Expected and an unknown role are errors', () => {
  const md = SAMPLE.replace('| 2 | Look at Ramp Up | line on the same date | zoom |', '| 2 | Look at Ramp Up |  | zoom |').replace('role: jobOwner', 'role: admin');
  const e = checkManual(parseManualSteps(md), {});
  assert.equal(e.length, 2, e.join('\n'));
  assert.ok(e.some((x) => /ETM-12 step 2: empty Expected/.test(x)));
  assert.ok(e.some((x) => /ETM-12: unknown role "admin"/.test(x)));
});

test('a section without a step table is an error', () => {
  const e = checkManual(parseManualSteps('## ETM-5 - x (2 steps)\nno table here\n'), {});
  assert.equal(e.length, 1);
  assert.match(e[0], /ETM-5: no step table/);
});

test('xrayStepCounts reads the numbered steps of each ## ETM-n section of tests.md', () => {
  const md = '# T\n| Key | Case |\n|---|---|\n| ETM-1 | TC-001 |\n\n## ETM-1 (TC-001)\n1. a -> b\n2. c -> d\n\n## ETM-2 (TC-002)\n1. a -> b\n';
  assert.deepEqual(xrayStepCounts(md), { 'ETM-1': 2, 'ETM-2': 1 });
});

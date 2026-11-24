import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkSpec } from './figma-spec.mjs';

const TOOL = path.join(path.dirname(fileURLToPath(import.meta.url)), 'figma-spec.mjs');

function tmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-spec-'));
  fs.mkdirSync(path.join(dir, 'figma'));
  fs.writeFileSync(path.join(dir, 'figma', 'F1.png'), 'png');
  return dir;
}
const good = () => ({
  key: 'ETM-1', fileKey: 'abc', taken: '2026-11-24', source: 'figma-mcp',
  frames: [{ id: 'F1', nodeId: '1:2', name: 'Filter open', image: 'figma/F1.png',
    elements: [
      { id: 'E1', what: 'Apply button', text: 'Apply', css: { 'background-color': '#1677FF', 'font-size': '14px', 'font-weight': '600' } },
      { id: 'E2', what: 'Total label', text: 'Total Results: 12', sample: true },
    ] }],
});

test('a good spec has no errors', () => {
  const r = checkSpec(good(), tmp(), 'ETM-1');
  assert.deepEqual(r.errors, []);
});

test('missing picture, bad colour, px and layout keys are errors', () => {
  const s = good();
  s.frames[0].image = 'figma/F9.png';
  s.frames[0].elements[0].css = { 'background-color': 'blue', 'font-size': '14', width: '80px' };
  const r = checkSpec(s, tmp(), 'ETM-1');
  assert.ok(r.errors.some((e) => e.includes('F9.png not found')));
  assert.ok(r.errors.some((e) => e.includes('background-color "blue"')));
  assert.ok(r.errors.some((e) => e.includes('font-size "14" must be in px')));
  assert.ok(r.errors.some((e) => e.includes('css "width" not allowed')));
});

test('an element with nothing to check, duplicate ids and wrong key fail', () => {
  const s = good();
  s.frames[0].elements.push({ id: 'E1', what: 'x' });
  const r = checkSpec(s, tmp(), 'ETM-2');
  assert.ok(r.errors.some((e) => e.includes('key is "ETM-1"')));
  assert.ok(r.errors.some((e) => e.includes('used twice')));
  assert.ok(r.errors.some((e) => e.includes('nothing to check')));
});

test('a frame without picture is only a warning', () => {
  const s = good();
  delete s.frames[0].image;
  const r = checkSpec(s, tmp(), 'ETM-1');
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 1);
});

test('check and copy commands', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-work-'));
  const pw = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-pw-'));
  const dir = path.join(work, 'ETM-1');
  fs.mkdirSync(path.join(dir, 'figma'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'figma', 'F1.png'), 'png');
  fs.writeFileSync(path.join(dir, 'figma-spec.json'), JSON.stringify(good()));
  const env = { ...process.env, FIGMA_SPEC_WORK: work, PW_REPO: pw };
  const out = execFileSync('node', [TOOL, 'check', 'ETM-1'], { env, encoding: 'utf8' });
  assert.match(out, /1 frames, 2 elements, 0 errors/);
  execFileSync('node', [TOOL, 'copy', 'ETM-1'], { env, encoding: 'utf8' });
  assert.ok(fs.existsSync(path.join(pw, 'dataTests', 'design', 'ETM-1', 'figma', 'F1.png')));
  assert.ok(fs.existsSync(path.join(pw, 'dataTests', 'design', 'ETM-1', 'figma-spec.json')));
});

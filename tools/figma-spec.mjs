#!/usr/bin/env node
// Figma design snapshot of a card: read Figma once, check the app against it on every run.
//
//   node tools/figma-spec.mjs check  <KEY>   gate G2f: figma-spec.json is valid and its pictures exist (exit 1 on errors)
//   node tools/figma-spec.mjs images <KEY>   download the frame PNGs with the Figma REST API (env FIGMA_TOKEN; 1 call for all frames)
//   node tools/figma-spec.mjs copy   <KEY>   copy spec + pictures to <PW_REPO>/dataTests/design/<KEY>/ (read by utils/designCheck.ts)
//
// File: .claude/team/work/<KEY>/figma-spec.json, pictures in .claude/team/work/<KEY>/figma/<frame id>.png
// {
//   "key": "ETM-1234", "fileKey": "abc", "taken": "2026-11-24", "source": "figma-mcp" | "user-export",
//   "frames": [{ "id": "F1", "nodeId": "1:2", "name": "Remark filter open", "state": "normal", "image": "figma/F1.png",
//     "elements": [{ "id": "E1", "what": "Apply button", "text": "Apply", "sample": false,
//                    "css": { "background-color": "#1677FF", "font-size": "14px" } }] }]
// }
// "sample": true = the text is a mockup sample (numbers, names): the text is not checked, the css still is.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

export const CSS_KEYS = new Set([
  'color', 'background-color', 'border-color', 'border-width', 'border-radius', 'border-style',
  'font-size', 'font-weight', 'font-family', 'font-style', 'line-height', 'letter-spacing', 'text-transform',
  'text-decoration-line', 'opacity',
]);
const COLOR_KEYS = new Set(['color', 'background-color', 'border-color']);
const PX_KEYS = new Set(['border-width', 'border-radius', 'font-size', 'line-height', 'letter-spacing']);
const COLOR_RE = /^(#[0-9a-f]{6}([0-9a-f]{2})?|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\))$/i;

function envFileValue(name) {
  try {
    const m = fs.readFileSync(path.join(ROOT, '.env'), 'utf8').match(new RegExp('^\\s*' + name + '\\s*=\\s*(.+?)\\s*$', 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}
const pwRepo = () => process.env.PW_REPO || envFileValue('PW_REPO') || path.resolve(ROOT, '..', 'ep-etm-fe-qa');
export const workDir = (key) => path.join(process.env.FIGMA_SPEC_WORK || path.join(ROOT, '.claude', 'team', 'work'), key);

/** Returns { errors: string[], warnings: string[] } for a parsed spec; dir = folder the image paths are relative to. */
export function checkSpec(spec, dir, key) {
  const errors = [], warnings = [];
  if (!spec || typeof spec !== 'object') return { errors: ['not a JSON object'], warnings };
  if (key && spec.key !== key) errors.push(`key is "${spec.key}", expected "${key}"`);
  if (!spec.fileKey) errors.push('fileKey missing (from the Figma link)');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(spec.taken ?? '')) errors.push('taken must be the date the design was read (YYYY-MM-DD)');
  if (!['figma-mcp', 'figma-api', 'user-export'].includes(spec.source)) errors.push('source must be figma-mcp, figma-api or user-export');
  if (!Array.isArray(spec.frames) || !spec.frames.length) { errors.push('frames is empty'); return { errors, warnings }; }
  const frameIds = new Set();
  for (const f of spec.frames) {
    const where = `frame ${f.id ?? '?'}`;
    if (!f.id || !/^F\d+$/.test(f.id)) errors.push(`${where}: id must be F<n>`);
    if (frameIds.has(f.id)) errors.push(`${where}: id used twice`);
    frameIds.add(f.id);
    if (!f.nodeId || !/^\d+[:-]\d+$/.test(f.nodeId)) errors.push(`${where}: nodeId must look like 123:456`);
    if (!f.name) errors.push(`${where}: name missing`);
    if (!f.image) warnings.push(`${where}: no picture; the run cannot show app and Figma side by side`);
    else if (!fs.existsSync(path.join(dir, f.image))) errors.push(`${where}: picture ${f.image} not found (export the frame as PNG, or run "images")`);
    const ids = new Set();
    if (!Array.isArray(f.elements) || !f.elements.length) { warnings.push(`${where}: no elements, only the picture is compared`); continue; }
    for (const e of f.elements) {
      const w = `${where} ${e.id ?? '?'}`;
      if (!e.id || !/^E\d+$/.test(e.id)) errors.push(`${w}: id must be E<n>`);
      if (ids.has(e.id)) errors.push(`${w}: id used twice in the frame`);
      ids.add(e.id);
      if (!e.what) errors.push(`${w}: "what" missing (plain name of the element, e.g. "Apply button")`);
      const css = e.css ?? {};
      if (e.text === undefined && !Object.keys(css).length) errors.push(`${w}: nothing to check (no text, no css)`);
      if (e.text !== undefined && typeof e.text !== 'string') errors.push(`${w}: text must be a string`);
      if (e.sample !== undefined && typeof e.sample !== 'boolean') errors.push(`${w}: sample must be true or false`);
      for (const [k, v] of Object.entries(css)) {
        if (!CSS_KEYS.has(k)) { errors.push(`${w}: css "${k}" not allowed (layout sizes depend on data; compare them by the picture)`); continue; }
        const s = String(v).trim();
        if (COLOR_KEYS.has(k) && !COLOR_RE.test(s)) errors.push(`${w}: ${k} "${s}" must be #RRGGBB, #RRGGBBAA or rgb(...)`);
        if (PX_KEYS.has(k) && !(k === 'line-height' && s === 'normal') && !/^-?\d+(\.\d+)?px$/.test(s)) errors.push(`${w}: ${k} "${s}" must be in px, e.g. 14px`);
        if (k === 'font-weight' && !/^\d{3}$/.test(s)) errors.push(`${w}: font-weight "${s}" must be 100..900`);
      }
    }
  }
  return { errors, warnings };
}

function load(key) {
  const dir = workDir(key);
  const file = path.join(dir, 'figma-spec.json');
  if (!fs.existsSync(file)) { console.error(`No ${file}. The inspector writes it (Phase 1).`); process.exit(1); }
  try { return { dir, file, spec: JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch (e) { console.error(`${file}: bad JSON: ${e.message}`); process.exit(1); }
}

async function images(key) {
  const { dir, spec } = load(key);
  const token = process.env.FIGMA_TOKEN;
  if (!token) { console.error('FIGMA_TOKEN is not set. Ask the user to export each frame as PNG (Figma: select frame, Export, PNG 1x) into ' + path.join(dir, 'figma')); process.exit(2); }
  const ids = spec.frames.map((f) => f.nodeId.replace('-', ':'));
  const url = `https://api.figma.com/v1/images/${encodeURIComponent(spec.fileKey)}?format=png&scale=1&ids=${encodeURIComponent(ids.join(','))}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) { console.error(`Figma API ${res.status}: ${(await res.text()).slice(0, 200)}`); process.exit(1); }
  const body = await res.json();
  fs.mkdirSync(path.join(dir, 'figma'), { recursive: true });
  for (const f of spec.frames) {
    const src = body.images?.[f.nodeId.replace('-', ':')];
    if (!src) { console.error(`${f.id}: Figma returned no picture for ${f.nodeId}`); continue; }
    const png = Buffer.from(await (await fetch(src)).arrayBuffer());
    f.image = `figma/${f.id}.png`;
    fs.writeFileSync(path.join(dir, f.image), png);
    console.log(`${f.id} -> ${f.image} (${png.length} bytes)`);
  }
  if (spec.source === 'user-export') spec.source = 'figma-api';
  fs.writeFileSync(path.join(dir, 'figma-spec.json'), JSON.stringify(spec, null, 2) + '\n');
}

function copy(key) {
  const { dir, spec } = load(key);
  const { errors } = checkSpec(spec, dir, key);
  if (errors.length) { console.error('Fix figma-spec.json first:\n- ' + errors.join('\n- ')); process.exit(1); }
  const out = path.join(pwRepo(), 'dataTests', 'design', key);
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(dir, 'figma-spec.json'), path.join(out, 'figma-spec.json'));
  for (const f of spec.frames) if (f.image) {
    fs.mkdirSync(path.dirname(path.join(out, f.image)), { recursive: true });
    fs.copyFileSync(path.join(dir, f.image), path.join(out, f.image));
  }
  console.log(`copied to ${out}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, key] = process.argv.slice(2);
  if (!['check', 'images', 'copy'].includes(cmd) || !/^ETM-\d+$/.test(key ?? '')) {
    console.error('Usage: node tools/figma-spec.mjs <check|images|copy> <ETM-KEY>'); process.exit(2);
  }
  if (cmd === 'check') {
    const { dir, spec } = load(key);
    const { errors, warnings } = checkSpec(spec, dir, key);
    warnings.forEach((w) => console.log(`warn  ${w}`));
    errors.forEach((e) => console.log(`ERROR ${e}`));
    const els = spec.frames?.reduce((n, f) => n + (f.elements?.length ?? 0), 0) ?? 0;
    console.log(`figma-spec ${key}: ${spec.frames?.length ?? 0} frames, ${els} elements, ${errors.length} errors`);
    process.exit(errors.length ? 1 : 0);
  }
  if (cmd === 'images') await images(key);
  if (cmd === 'copy') copy(key);
}

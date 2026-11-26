// baseline.mjs - per page unit, the FE repo commit of the last run where every test using that page passed.
// File: <PW_REPO>/output/heal/fe-baseline.json  { "units": { "<unit>": "<commit>" }, "updated": "<ISO date>" }
// A page unit = the first folder (or file) under pages/: pages/mainGridPage/** -> mainGridPage.
import fs from 'node:fs';
import path from 'node:path';

const file = (pwRepo) => path.join(pwRepo, 'output', 'heal', 'fe-baseline.json');

export function pageUnit(f) {
  const parts = String(f).replace(/\\/g, '/').split('/');
  const i = parts.indexOf('pages');
  const seg = i >= 0 ? parts[i + 1] : parts[0];
  return (seg || '').replace(/\.ts$/, '');
}

export function readBaseline(pwRepo) {
  try { return JSON.parse(fs.readFileSync(file(pwRepo), 'utf8')).units || {}; } catch { return {}; }
}

export function advanceBaseline(pwRepo, units, commit) {
  if (!commit || !units.length) return;
  const all = readBaseline(pwRepo);
  for (const u of units) all[u] = commit;
  fs.mkdirSync(path.dirname(file(pwRepo)), { recursive: true });
  fs.writeFileSync(file(pwRepo), JSON.stringify({ units: all, updated: new Date().toISOString() }, null, 2));
}

/** getter name in pages/pages.ts -> page unit, through the getter's return type and its import. */
function getterUnits(pwRepo) {
  let src = '';
  try { src = fs.readFileSync(path.join(pwRepo, 'pages', 'pages.ts'), 'utf8'); } catch { return {}; }
  const typeToUnit = {};
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@(pages|components)\/([^']+)'/g)) {
    const unit = m[2] === 'components' ? 'sharedComponent' : pageUnit(`pages/${m[3]}`);
    for (const t of m[1].split(',').map((s) => s.trim().replace(/^type\s+/, '')).filter(Boolean)) typeToUnit[t] = unit;
  }
  const out = {};
  for (const m of src.matchAll(/get\s+(\w+)\s*\(\)\s*:\s*(\w+)/g)) if (typeToUnit[m[2]]) out[m[1]] = typeToUnit[m[2]];
  return out;
}

/**
 * Page units a set of spec files really use: getters of pages.ts named in the spec (or its local helpers),
 * plus direct @pages/ and @components/ imports. @fixtures/pageFixtures is NOT followed: it reaches every page.
 */
export function pagesUsedBy(pwRepo, specFiles) {
  const getters = getterUnits(pwRepo);
  const units = new Set();
  const seen = new Set();
  const visit = (abs) => {
    if (seen.has(abs) || !fs.existsSync(abs)) return;
    seen.add(abs);
    const src = fs.readFileSync(abs, 'utf8');
    for (const [g, u] of Object.entries(getters)) if (new RegExp(`\\b${g}\\b`).test(src)) units.add(u);
    for (const m of src.matchAll(/from\s*'@pages\/([^']+)'/g)) if (m[1] !== 'pages') units.add(pageUnit(`pages/${m[1]}`));
    for (const m of src.matchAll(/from\s*'@components\/[^']+'/g)) units.add('sharedComponent');
    for (const m of src.matchAll(/from\s*'(\.\.?\/[^']+)'/g)) {
      const base = path.resolve(path.dirname(abs), m[1]);
      visit(base.endsWith('.ts') ? base : `${base}.ts`);
    }
  };
  for (const s of specFiles) visit(path.isAbsolute(s) ? s : path.join(pwRepo, s));
  return [...units].sort();
}

/** Every page unit that exists under pages/ (pages.ts itself excluded). */
export function allUnits(pwRepo) {
  try {
    return fs.readdirSync(path.join(pwRepo, 'pages')).filter((n) => n !== 'pages.ts' && (n.endsWith('.ts') || !n.includes('.'))).map((n) => pageUnit(`pages/${n}`)).sort();
  } catch { return []; }
}

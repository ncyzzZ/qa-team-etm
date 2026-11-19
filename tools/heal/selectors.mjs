// selectors.mjs - pull the locator "tokens" (classes, ids, attribute values, texts, accessible names) out of
// page-object source, so they can be looked up in the front-end repo. Template literals with ${} are skipped.

/** @typedef {{ file: string, line: number, kind: 'class'|'id'|'attr'|'text'|'role-name'|'placeholder'|'label'|'tag', value: string }} Token */

export const GENERIC_TOKENS = new Set([
  'active', 'disabled', 'btn', 'button', 'row', 'cell', 'icon', 'title', 'container', 'content', 'header', 'label',
  'text', 'selected', 'hidden', 'show', 'open', 'item', 'input', 'form', 'modal', 'body', 'footer', 'wrapper',
  // ARIA role values: the UI library (ng-zorro) sets them at runtime, they are not in stms-fe source
  'dialog', 'alert', 'alertdialog', 'tooltip', 'menu', 'menuitem', 'listbox', 'option', 'tab', 'tablist', 'tabpanel',
  'status', 'grid', 'gridcell', 'columnheader', 'combobox', 'checkbox', 'radio', 'switch', 'toast', 'close', 'navigation',
]);

/** Classes/tags from a UI library (Bryntum b-, AG Grid ag-, ng-zorro ant-/nz-, Quill ql-), not from stms-fe templates. */
export const isLibraryToken = (value) => /^(b|ag|ant|nz|ql)-/.test(value);

const STR = String.raw`(['"])((?:\\.|(?!\1).)*)\1`; // a '...' or "..." literal, group 2 = content
const CALLS = [
  { re: new RegExp(String.raw`getByText\(\s*${STR}`, 'g'), kind: 'text' },
  { re: new RegExp(String.raw`getByPlaceholder\(\s*${STR}`, 'g'), kind: 'placeholder' },
  { re: new RegExp(String.raw`getByLabel\(\s*${STR}`, 'g'), kind: 'label' },
  { re: new RegExp(String.raw`getByRole\([^)]*?name:\s*${STR}`, 'g'), kind: 'role-name' },
  { re: new RegExp(String.raw`hasText:\s*${STR}`, 'g'), kind: 'text' },
];
const LOCATOR = new RegExp(String.raw`locator\(\s*${STR}`, 'g');

/** Tokens inside one CSS/Playwright selector string. */
function selectorTokens(sel) {
  const out = [];
  for (const m of sel.matchAll(/:(?:text-is|has-text|text)\(\s*(['"])(.*?)\1\s*\)/g)) out.push(['text', m[2]]);
  for (const m of sel.matchAll(/(?:^|>>\s*)text=["']?([^"'>]+?)["']?\s*(?:$|>>)/g)) out.push(['text', m[1]]);
  for (const m of sel.matchAll(/\[\s*[\w-]+\s*[~|^$*]?=\s*(['"]?)([^'"\]]+)\1\s*\]/g)) out.push(['attr', m[2].trim()]);
  const bare = sel.replace(/(['"]).*?\1/g, '""').replace(/\[[^\]]*\]/g, '').replace(/:[\w-]+\([^)]*\)/g, '');
  if (/^(xpath=|\/\/)/.test(sel.trim())) return out;
  for (const m of bare.matchAll(/(?:^|[\s>+~,(])([a-z][a-z0-9]*-[a-z0-9-]+)(?=$|[\s.#:[>+~,)])/g)) out.push(['tag', m[1]]);
  for (const m of bare.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) out.push(['class', m[1]]);
  for (const m of bare.matchAll(/#([A-Za-z][\w-]*)/g)) out.push(['id', m[1]]);
  return out;
}

/** @returns {Token[]} */
export function extractTokens(source, file) {
  const tokens = [];
  source.split(/\r?\n/).forEach((raw, i) => {
    const text = raw.replace(/`(?:\\.|[^`])*\$\{(?:\\.|[^`])*`/g, '``'); // drop template literals with ${}
    const add = (kind, value) => { if (value) tokens.push({ file, line: i + 1, kind, value }); };
    for (const m of text.matchAll(LOCATOR)) for (const [k, v] of selectorTokens(m[2])) add(k, v);
    for (const { re, kind } of CALLS) for (const m of text.matchAll(re)) add(kind, m[2]);
  });
  return tokens;
}

// commands.mjs - what `node tools/state.mjs <cmd> <KEY> ...` does. Each command loads, changes, saves (core.save)
// and returns the saved state (show returns text). Every refusal throws with a plain reason.
import fs from 'node:fs';
import path from 'node:path';
import { emptyState, load, save, resolveFile, parseAc, PHASES, APPROVAL_KINDS, SINGLE_KINDS, LIST_KINDS } from './core.mjs';

const flag = (args, name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const positional = (args) => args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const now = () => new Date().toISOString();

function current(key, { root }) {
  const { state, errors } = load(key, root);
  if (!state) throw new Error(errors[0]);
  if (errors.some((e) => e.startsWith('checksum mismatch'))) throw new Error(`${errors[0]} - look at the file, then run: node tools/state.mjs init ${key} --rebuild`);
  return state;
}

const cardDirs = (key, root) => ({ team: path.join(root, '.claude', 'team', 'work', key), shared: path.join(root, 'work', key) });
const rel = (root, abs) => path.relative(root, abs).replace(/\\/g, '/');
const roundOf = (f) => { const m = f.match(/round(\d+)/i); return m ? Number(m[1]) : /partial/i.test(f) ? 0.5 : 1; };

/** Files of a card found on disk: single kinds by fixed name, rounds of questions/answers in order. */
function discover(key, root) {
  const { team, shared } = cardDirs(key, root);
  const ls = (d) => (fs.existsSync(d) ? fs.readdirSync(d) : []);
  const found = { extra: {} };
  const single = { story: 'story.md', analyst: 'analyst.md', inspector: 'inspector.md', draft: 'draft-tc.md', review: 'review.md', tests: 'tests.md' };
  for (const [k, f] of Object.entries(single)) if (fs.existsSync(path.join(team, f))) found[k] = rel(root, path.join(team, f));
  if (fs.existsSync(path.join(shared, 'findings.json'))) found.findings = rel(root, path.join(shared, 'findings.json'));
  // one entry per round: a round saved in both folders keeps the newer copy
  const rounds = (re) => {
    const best = new Map();
    for (const p of [...ls(shared).map((f) => path.join(shared, f)), ...ls(team).map((f) => path.join(team, f))]) {
      const b = path.basename(p);
      if (!re.test(b)) continue;
      const prev = best.get(b);
      if (!prev || fs.statSync(p).mtimeMs > fs.statSync(prev).mtimeMs) best.set(b, p);
    }
    return [...best.values()].sort((a, b) => roundOf(path.basename(a)) - roundOf(path.basename(b))).map((p) => rel(root, p));
  };
  found.questions = [...new Set(rounds(/^questions-for-BA(-round\d+)?\.md$/i))];
  found.answers = [...new Set(rounds(/^ba-answers.*\.md$/i))];
  for (const [name, f] of [['automationTable', 'automation-table.md'], ['defectDrafts', 'defect-drafts.md'], ['loggerNotes', 'logger-notes.md'], ['xrayReadback', 'xray-readback.json']]) {
    if (fs.existsSync(path.join(team, f))) found.extra[name] = rel(root, path.join(team, f));
  }
  return found;
}

export function init(key, args, opt) {
  const { root } = opt;
  const existing = load(key, root);
  if (existing.state && existing.errors.some((e) => e.startsWith('checksum mismatch')) && !args.includes('--rebuild')) throw new Error(existing.errors[0]);
  const s = existing.state && !existing.errors.length ? existing.state : (existing.state && args.includes('--rebuild') ? { ...emptyState(key), ...existing.state } : emptyState(key));
  const f = discover(key, root);
  for (const k of SINGLE_KINDS) if (!s.files[k] && f[k]) s.files[k] = f[k];
  for (const k of LIST_KINDS) s.files[k] = [...new Set([...(s.files[k] || []), ...(f[k] || [])])];
  s.files.extra = { ...f.extra, ...(s.files.extra || {}) };
  if (!s.ac.length && s.files.analyst) {
    const text = fs.readFileSync(path.join(root, s.files.analyst), 'utf8');
    s.ac = parseAc(text).map((a) => ({ id: a.id, text: a.text.slice(0, 160), status: 'active', source: 'analyst.md' }));
  }
  return save(key, s, existing.state ? 'init (refresh from disk)' : 'init', root);
}

export function phase(key, args, opt) {
  const [ph, ...nextWords] = positional(args);
  if (!PHASES.includes(ph)) throw new Error(`unknown phase "${ph}" (one of: ${PHASES.join(', ')})`);
  const s = current(key, opt);
  const has = (kind) => s.approvals.some((a) => a.kind === kind);
  if (ph === 'push' && !has('xray-push')) throw new Error('phase push needs an xray-push approval first (state.mjs approve ... --kind xray-push)');
  if ((ph === 'closeout' || ph === 'done') && !has('jira-write')) throw new Error(`phase ${ph} needs a jira-write approval first (state.mjs approve ... --kind jira-write)`);
  const was = s.phase;
  s.phase = ph;
  s.next = nextWords.join(' ');
  return save(key, s, `phase ${was} -> ${ph}`, opt.root);
}

export function file(key, args, opt) {
  const [kind, p] = positional(args);
  if (![...SINGLE_KINDS, ...LIST_KINDS].includes(kind) && !(kind || '').startsWith('extra.')) throw new Error(`unknown file kind "${kind}" (${[...SINGLE_KINDS, ...LIST_KINDS].join(', ')}, or extra.<name>)`);
  const r = resolveFile(key, p || '', opt);
  if (!r.allowed) throw new Error(`${p} is outside this card's folders (.claude/team/work/${key}/, work/${key}/, or pw:<path> in the Playwright repo)`);
  const exists = kind === 'lastRun' ? fs.existsSync(path.join(r.abs, 'results.json')) : fs.existsSync(r.abs);
  if (!exists) throw new Error(`${p} not found (${r.abs})`);
  const s = current(key, opt);
  if (LIST_KINDS.includes(kind)) { if (!s.files[kind].includes(r.stored)) s.files[kind].push(r.stored); }
  else if (kind.startsWith('extra.')) s.files.extra[kind.slice(6)] = r.stored;
  else s.files[kind] = r.stored;
  return save(key, s, `file ${kind} = ${r.stored}`, opt.root);
}

export function acSync(key, args, opt) {
  const s = current(key, opt);
  if (!s.files.analyst) throw new Error('no analyst file recorded (state.mjs file <KEY> analyst <path>)');
  const fresh = parseAc(fs.readFileSync(path.join(opt.root, s.files.analyst), 'utf8'));
  const ids = new Set(fresh.map((a) => a.id));
  for (const a of s.ac) if (!ids.has(a.id) && a.status !== 'dropped') a.status = 'dropped';
  for (const a of fresh) {
    const old = s.ac.find((x) => x.id === a.id);
    if (!old) s.ac.push({ id: a.id, text: a.text.slice(0, 160), status: 'active', source: 'analyst.md' });
    else if (old.status === 'dropped') old.status = 'active';
  }
  return save(key, s, `ac sync (${fresh.length} in analyst.md)`, opt.root);
}

export function acChanged(key, args, opt) {
  const [id, ...why] = positional(args);
  const s = current(key, opt);
  const a = s.ac.find((x) => x.id === id);
  if (!a) throw new Error(`${id} is not in this card's AC list`);
  a.status = 'changed';
  a.why = why.join(' ');
  return save(key, s, `${id} changed: ${a.why}`, opt.root);
}

export function decide(key, args, opt) {
  const text = positional(args).join(' ');
  const source = flag(args, '--source');
  if (!text || !source) throw new Error('decide needs the decision text and --source "<where it was decided>"');
  const s = current(key, opt);
  const ac = (flag(args, '--ac') || '').split(',').map((x) => x.trim()).filter(Boolean);
  s.decisions.push({ id: `D-${s.decisions.length + 1}`, text, source, ac, at: now() });
  return save(key, s, `decision D-${s.decisions.length}`, opt.root);
}

export function openQ(key, args, opt) {
  const text = positional(args).join(' ');
  if (!text) throw new Error('open needs the question text');
  const s = current(key, opt);
  const n = s.open.length + s.decisions.filter((d) => /^answer to Q-/.test(d.source)).length + 1;
  s.open.push({ id: `Q-${n}`, text, owner: flag(args, '--owner') || 'BA', since: now() });
  return save(key, s, `open Q-${n}`, opt.root);
}

export function closeQ(key, args, opt) {
  const [id, ...answer] = positional(args);
  const s = current(key, opt);
  const q = s.open.find((x) => x.id === id);
  if (!q) throw new Error(`${id} is not an open question`);
  s.open = s.open.filter((x) => x.id !== id);
  s.decisions.push({ id: `D-${s.decisions.length + 1}`, text: `${q.text} -> ${answer.join(' ')}`, source: `answer to ${id}`, ac: [], at: now() });
  return save(key, s, `close ${id}`, opt.root);
}

export function approve(key, args, opt) {
  const what = positional(args).join(' ');
  const a = { kind: flag(args, '--kind'), what, answer: flag(args, '--answer') || '', source: flag(args, '--source'), evidence: flag(args, '--evidence') || '', at: now() };
  if (!APPROVAL_KINDS.includes(a.kind)) throw new Error(`approve needs --kind (${APPROVAL_KINDS.join(', ')})`);
  if (!['chat', 'board'].includes(a.source)) throw new Error('approve needs --source chat|board');
  if (!a.evidence.trim()) throw new Error('approve needs --evidence (the user\'s chat reply, or the ANSWER: line of team.mjs wait)');
  if (a.source === 'board' && !a.evidence.includes('ANSWER:')) throw new Error('a board approval needs the ANSWER: line printed by team.mjs wait as --evidence');
  const s = current(key, opt);
  s.approvals.push(a);
  return save(key, s, `approval ${a.kind}: ${what}`, opt.root);
}

export function gate(key, args, opt) {
  const [id, result] = positional(args);
  if (!id || !['pass', 'fail'].includes(result)) throw new Error('gate needs <G-id> pass|fail');
  const s = current(key, opt);
  s.gates[id] = { result, ...(flag(args, '--errors') ? { errors: Number(flag(args, '--errors')) } : {}), at: now() };
  return save(key, s, `gate ${id} ${result}`, opt.root);
}

export function show(key, args, opt) {
  const s = current(key, opt);
  const act = s.ac.filter((a) => a.status !== 'dropped');
  const lines = [
    `${s.card}  phase: ${s.phase}${s.next ? `  next: ${s.next}` : ''}  (updated ${s.updated.slice(0, 16).replace('T', ' ')})`,
    `AC: ${act.length} in use (${act.map((a) => a.id + (a.status === 'changed' ? '*' : '')).join(', ') || '-'})${s.ac.length > act.length ? `, ${s.ac.length - act.length} dropped` : ''}`,
    ...['story', 'analyst', 'draft', 'review', 'tests', 'lastRun'].filter((k) => s.files[k]).map((k) => `  ${k}: ${s.files[k]}`),
    ...LIST_KINDS.filter((k) => s.files[k].length).map((k) => `  ${k}: ${s.files[k].length} (latest ${s.files[k].at(-1)})`),
    `Decisions: ${s.decisions.length}${s.decisions.length ? ` (latest: ${s.decisions.at(-1).text.slice(0, 70)})` : ''}`,
    `Open: ${s.open.length ? s.open.slice(0, 4).map((q) => `${q.id} ${q.text.slice(0, 50)}`).join(' | ') : 'none'}`,
    `Approvals: ${s.approvals.length ? s.approvals.slice(-3).map((a) => `${a.kind} (${a.source})`).join(', ') : 'none'}`,
    `Gates: ${Object.entries(s.gates).map(([k, g]) => `${k} ${g.result}`).join(', ') || 'none'}`,
  ];
  return lines.slice(0, 25).join('\n');
}

// make.mjs - rebuilds the G0 (qa-check state) fixtures with real checksums: node evals/state/make.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emptyState, save, statePath } from '../../tools/state/core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const K = 'ETM-0001';
const ANALYST = '# Analyst\n\n## AC items\n- AC-1: Plan shows\n- AC-2: Weekly cells keep 1 decimal\n\n## Open questions\n';
function make(name, { analyst = ANALYST, mutate = () => {}, after = () => {} } = {}) {
  const root = path.join(HERE, name);
  fs.rmSync(root, { recursive: true, force: true });
  const team = path.join(root, '.claude', 'team', 'work', K);
  fs.mkdirSync(team, { recursive: true });
  fs.writeFileSync(path.join(team, 'story.md'), '# story\n');
  if (analyst) fs.writeFileSync(path.join(team, 'analyst.md'), analyst);
  const s = emptyState(K);
  s.files.story = `.claude/team/work/${K}/story.md`;
  if (analyst) s.files.analyst = `.claude/team/work/${K}/analyst.md`;
  if (analyst) s.ac = [{ id: 'AC-1', text: 'Plan shows', status: 'active', source: 'analyst.md' }, { id: 'AC-2', text: 'Weekly cells', status: 'active', source: 'analyst.md' }];
  mutate(s, root, team);
  save(K, s, 'fixture', root);
  after(statePath(K, root), team);
}
make('good');
make('edited', { after: (f) => { const j = JSON.parse(fs.readFileSync(f, 'utf8')); j.phase = 'done'; fs.writeFileSync(f, JSON.stringify(j, null, 2)); } });
make('missing-file', { mutate: (s) => { s.files.review = `.claude/team/work/${K}/review.md`; } });
make('ac-gap', { after: (f, team) => fs.appendFileSync(path.join(team, 'analyst.md'), '') , analyst: ANALYST.replace('## Open', '- AC-3: new rule\n\n## Open') });
make('no-approval', { mutate: (s) => { s.phase = 'push'; } });
make('legacy', { analyst: null });
console.log('fixtures rebuilt in', HERE);

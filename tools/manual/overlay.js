// overlay.js - the picture of one manual step, same look as the Playwright repo's utils/xrayEvidence.ts: a red frame around the
// checked element(s), a caption box ("<TEST> - Step <n>", What we did, What should be seen), a full-page PNG, then the
// overlay is removed. The manual runner passes the printed code to the playwright-test MCP code tool (browser_run_code_unsafe).
//
//   node tools/manual/overlay.js --test <KEY>-8692 --n 4 --did "..." --see "..." [--sel "<selector>" ...] --out <run>/evidence/<KEY>-8692/step-4.png [--failed]
//
// --sel takes any Playwright selector: CSS, text=..., or aria-ref=<ref> from the MCP snapshot. Prints the code; the code
// returns { framed, out } (framed 0 = nothing was framed: say so in the step's reason).

/* eslint-disable no-undef -- the two functions below run in the browser page */
function drawCaption([k, n, didText, seeText, isFail, red]) {
  const box = document.createElement('div');
  box.id = 'qa-evidence-label';
  const row = (head, text, color) => {
    const d = document.createElement('div');
    const b = document.createElement('b'); b.textContent = head; d.appendChild(b);
    d.appendChild(document.createTextNode(` ${text}`)); d.style.color = color; box.appendChild(d);
  };
  const t = document.createElement('div'); t.textContent = `${k} - Step ${n}`; t.style.fontWeight = 'bold'; box.appendChild(t);
  if (didText) row('What we did:', didText, '#000');
  if (seeText) row(isFail ? 'Result:' : 'What should be seen (red frame):', seeText, isFail ? red : '#000');
  Object.assign(box.style, { position: 'fixed', left: '8px', top: '8px', maxWidth: `${Math.min(window.innerWidth - 16, 560)}px`, background: '#fffbe6', border: `3px solid ${red}`, borderRadius: '4px', padding: '6px 10px', font: '15px/1.35 sans-serif', zIndex: '2147483647', boxShadow: '0 2px 8px rgba(0,0,0,.3)' });
  document.body.appendChild(box);
  // next to the red frames, never on top of them (same order of tries as xrayEvidence.ts)
  const W = window.innerWidth, H = window.innerHeight, gap = 12;
  const rects = Array.from(document.querySelectorAll('[data-qa-hl]')).map((e) => e.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H);
  const { width: bw, height: bh } = box.getBoundingClientRect();
  const clampX = (x) => Math.max(8, Math.min(x, W - bw - 8));
  const clampY = (y) => Math.max(8, Math.min(y, H - bh - 8));
  let pos = { left: 8, top: 8 };
  if (rects.length) {
    const u = rects.reduce((a, r) => ({ l: Math.min(a.l, r.left), t: Math.min(a.t, r.top), r: Math.max(a.r, r.right), b: Math.max(a.b, r.bottom) }), { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity });
    const hits = (x, y) => rects.some((r) => x < r.right && x + bw > r.left && y < r.bottom && y + bh > r.top);
    const tries = [
      { left: clampX(u.l), top: u.b + gap }, { left: clampX(u.l), top: u.t - bh - gap },
      { left: u.r + gap, top: clampY(u.t) }, { left: u.l - bw - gap, top: clampY(u.t) },
      { left: 8, top: H - bh - 8 }, { left: W - bw - 8, top: H - bh - 8 }, { left: W - bw - 8, top: 8 }, { left: 8, top: 8 },
    ];
    pos = tries.find((p) => p.left >= 8 && p.top >= 8 && p.left + bw <= W - 8 && p.top + bh <= H - 8 && !hits(p.left, p.top)) || { left: 8, top: H - bh - 8 };
  }
  Object.assign(box.style, { left: `${pos.left}px`, top: `${pos.top}px` });
}

function removeOverlay() {
  document.getElementById('qa-evidence-label')?.remove();
  document.querySelectorAll('[data-qa-hl]').forEach((el) => {
    const [o, off] = (el.dataset.qaHl || '|').split('|');
    el.style.outline = o; el.style.outlineOffset = off; delete el.dataset.qaHl;
  });
}

function frame(el, red) {
  if (el.dataset.qaHl === undefined) el.dataset.qaHl = `${el.style.outline}|${el.style.outlineOffset}`;
  el.style.outline = `4px solid ${red}`; el.style.outlineOffset = '2px';
}

/**
 * @param {{ test: string, n: number, did: string, see: string, selectors?: string[], out: string, failed?: boolean }} o
 * @returns {string} `async (page) => { ... }` for the MCP code tool
 */
function overlayCode(o) {
  const opts = JSON.stringify({ test: o.test, n: Number(o.n), did: o.did || '', see: o.see || '', selectors: o.selectors || [], out: o.out, failed: !!o.failed })
    .replace(/</g, '\\u003c'); // a "</script>" in the text cannot end anything
  return `async (page) => {
  const o = ${opts};
  const RED = '#e00000';
  const frame = ${frame.toString()};
  let framed = 0;
  for (const sel of o.selectors) {
    const hs = (await page.locator(sel).elementHandles()).slice(0, 20);
    for (const h of hs) { await h.evaluate(frame, RED); framed++; }
  }
  await page.evaluate(${drawCaption.toString()}, [o.test, o.n, o.did, o.see, o.failed, RED]);
  try {
    await page.screenshot({ path: o.out, fullPage: true });
  } finally {
    await page.evaluate(${removeOverlay.toString()});
  }
  return { framed, out: o.out };
}`;
}

module.exports = { overlayCode };

if (require.main === module) {
  const a = process.argv.slice(2), opt = (n) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
  const selectors = a.flatMap((x, i) => (x === '--sel' ? [a[i + 1]] : []));
  if (!opt('--test') || !opt('--n') || !opt('--out')) {
    console.error('usage: node tools/manual/overlay.js --test <KEY>-1 --n 2 --did "..." --see "..." [--sel "<selector>" ...] --out <png> [--failed]');
    process.exit(2);
  }
  process.stdout.write(overlayCode({ test: opt('--test'), n: opt('--n'), did: opt('--did'), see: opt('--see'), selectors, out: opt('--out'), failed: a.includes('--failed') }) + '\n');
}

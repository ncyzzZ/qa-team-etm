# Provenance: who built the QA team toolkit

This folder is the author's record. It is **not** exported to the starter (`tools/export-starter.mjs` skips `docs/provenance/`).

## Author and history

- Built by **Nuchanart** (git authors in this repo: `Nuchanart <nuchanart.p@extosoft.com>`, `Nuchchanart Pantarath`, `Nuchanart Panatarth`; Claude co-authored some commits on request).
- First commit: `4c63ff8` on **2026-11-06**, "Initial commit: ETM QA team (agents, playbook, knowledge, board)".
- Remote: `https://github.com/ncyzzZ/qa-team-etm` (history on `origin` since 2026-11-06).
- 246 commits on `feat/project-profiles` by 2026-11-26.

## Starter v1.0 handed to another team

- Exported: **2026-11-26** with `node tools/export-starter.mjs`, from branch `feat/project-profiles`, git tag `starter-v1.0`.
- 204 files. Per-file SHA-256: [`starter-v1.0.sha256`](starter-v1.0.sha256).
- SHA-256 of that manifest file: `de6169c19a78c4a9309d9b770cfae2e7ef15d9a240e3fe53860a1e25f35bd49b`.
- Check a copy: `cd <their folder> && find . -type f | LC_ALL=C sort | xargs shasum -a 256 | diff - <this repo>/docs/provenance/starter-v1.0.sha256` (files they changed show up; unchanged files match byte for byte).

## Fingerprints (things that trace back to this work)

Distinctive names and structures that are unlikely to appear by chance in someone else's toolkit:

- **Gate ids** in `TEAM.md` / `tools/qa-check.mjs`: `G0 G1 G2 G2f G3 G4 G5 G6 G6b G7 G8 G-exp G-heal G-id`.
- **AI-miss ids** `M-1`, `M-14`, `M-15`, `M-16`; lesson ids `L-1` … `L-8`.
- **TEAM.md headings** in this order: Trigger, One-call mode, Standing approvals, Questions to the user, Decision cards and the independent evidence check, Sources of truth, The team, Agent protocol, Status board, The cycle (Phase 0-7), Quality gates, Sprint report, Hard stops, Saving tokens, Test case wording, Lessons, AI misses.
- **Tool names**: `run-card.mjs`, `run-policy.mjs` (`RUN-POLICY: auto|ask`), `verdicts.mjs table`, `auto-next.mjs`, `push-guard.mjs`, `push-plan.mjs`, `rerun-guard.mjs`, `data-gate.mjs`, `delete-plan.mjs`, `build-change.mjs`, `defect-exam.mjs`, `ai-miss.mjs`, `evidence-check.mjs`.
- **Board commands**: `team.mjs start|set|ask --approve --options|ask --later|inbox --send|wait --job|answered --job`.
- **Agent set** of ten: ba-analyst, ux-inspector, test-designer, test-reviewer, automation-engineer, manual-runner, evidence-reporter, evidence-checker, jira-xray-logger, playwright-healer.
- **Rules worded this way**: "Skipped is never PASSED", "Test data must be reachable from the UI", "The suggestion is never the verdict".
- Board brand **"Ninas Agent"** and localStorage keys `ninas-*`.

## Keep

Do not delete this repo or rewrite its history. Push `feat/project-profiles` and the tag `starter-v1.0` to `origin` so the dates are also on GitHub.

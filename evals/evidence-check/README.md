# Evidence-checker eval (blind second reading before a defect is logged)

Six past defects of Sprint 26 whose outcome is known, each with its real pictures. The first agent had proposed all six as
defects (all six were logged). `truth.json` holds the outcome; `root/` is an `EVIDENCE_CHECK_ROOT` with the drafts, the blind
briefs and the checker's files. Score: `node evals/evidence-check/score.mjs`.

## Run 2026-11-25 (evidence-checker, opus, one call per case)

| Case | Defect | Outcome | Checker | Caught |
|---|---|---|---|---|
| c1 filter search case | ETM-9231 | real regression | not-proven: Expected has no written source (AC 3.1 "same as other columns"; Xray step backups never saved) | no (false alarm, yellow/red card) |
| c2 Helipad import | ETM-9223 | real | defect-proven, with BA Q27 as source | yes |
| c3 main deck | ETM-9225 | test data made in the DB, not on screen | uiReachable no, not-proven | yes |
| c4 export/import | ETM-9233 | not a defect (lead, 25 Nov), deleted | not-proven: Expected waits on open BA Q1 option (c) | yes |
| c5 Platform box | ETM-9175 | the only picture is the page still loading (spinner) | not-proven | yes |
| c6 + of Work Header | ETM-9177 | not a bug (user ruling 25 Nov), deleted | not-a-defect: rule sources conflict | yes |

**5/6.** Without the checker the user got all six as "defect" proposals: 2 right, 4 wrong. With it, 4 of the 4 wrong ones
come with a red card, and 1 of the 2 real ones does too (c1, a thin rule source: worth a BA line anyway).

Fairness notes:
- c5 and c6 first ran with `work/ETM-8449/ba-answers.md`, which holds the 25 Nov ruling made after the defects were logged.
  Those two checks are kept in `root/leaked/` and not scored; the scored run read only `root/sources/ETM-8449/ba-answers-as-of-2026-11-24.md`.
- c5 truth was first written as defect-proven (it was logged); reading its picture showed a loading page, so it is not-proven.
- Each card showed 5-9 warnings; the card now shows the first 3 and keeps the rest in `compare.json`.

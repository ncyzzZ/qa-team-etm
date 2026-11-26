# ETM-8391 - manual runner results to confirm (26 Nov 2026)

Run folder: `ep-etm-fe-qa/output/runs/2026-11-26_112027_ETM-8391_manual` (pictures `evidence/<TEST>/step-<n>.png`, report `evidence-report-ETM-8391-20261126-113722.html`).
Blind evidence check: `work/ETM-8391/evidence-check/<TEST>.check.json`.

| Test | Runner | Blind check | What the person decides |
|---|---|---|---|
| ETM-8657 | 3/3 pass | pass | Confirm as proposed |
| ETM-8654 | 7/7 pass | steps 1-2, 4-7 pass; step 3 cannot tell (the picture shows only the end state, Remark 060 last and ticked; the red line marks 059) | Step 3: pass / fail |
| ETM-8650 | 15 pass, step 3 needs-human | 10 pass; cannot tell 3, 4, 5, 8, 11, 13 (three rows read "-" on screen: `-`, ` - `, `- `; no picture shows `#Urgent` or `100% ...`; the step label hides half of the hover box in step 13) | Step 3 (the option after `-` is ` - `, a symbol value: is that "not `-`"?) and steps 4, 5, 8, 11, 13: pass / fail, or ask for new pictures |
| ETM-8663 | 8 pass, step 1 needs-human (new data: W05 owner Somchai Test) | not run yet | Step 1 "set the old text filter before the release" cannot be done on this build: pass (accepted as not reachable) / fail |
| ETM-8648 | not run | - | Not applicable (no user without View Worklist; only TM and JO) |

Answer format: `8657=confirm 8654=3:pass 8650=3:pass,4:pass,5:pass,8:pass,11:pass,13:pass 8663=1:pass 8648=na` (or `retake 8650` for new pictures).
After the answer: `tools/manual/results.mjs <run> --decide ... --confirm ...`, `run-card --build-only`, then `xray-step-push.mjs <run> --exec ETM-8874` (dry run first, then `--apply`).

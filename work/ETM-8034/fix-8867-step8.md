# ETM-8867 step 8: script cause (proposed fix, not applied)

Step 8 opens the original plan with `openPlan(sl)`. For `ETM8034_PATH`, `openPlan` runs `clearLeftoverColours()`, which sets No Color on every coloured row of the original **and saves**. So the run itself removed the original's colours before the check (the checker saw that ALL colours were gone in picture 5, not only the Platform). Not proven as an app defect.

Fix (rowColour.helpers.ts + spec step 8):
- `openPlan(sl, path = config.ETM8034_PATH, opts: { keepColours?: boolean } = {})`: skip `clearLeftoverColours` when `opts.keepColours`.
- Step 8: `await openPlan(sl, config.ETM8034_PATH, { keepColours: true });`
Then re-run ETM-8867 (run-policy: re-run of a test that ran before).

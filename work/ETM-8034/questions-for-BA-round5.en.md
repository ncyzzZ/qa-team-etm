# ETM-8034 - Questions for BA (round 5, 2026-11-25)

## Q1. Toast after Save in the Work Details modal (Xray ETM-8862 step 8)

ETM-8862 step 8 expects a toast **"Save Work Successfully"** after clicking `Save` in the Work Details modal (Shutdown Logic, row right-click > Work Details).
The current build shows no toast there: the modal closes and the row is updated, but no message appears. The text "Save Work Successfully" is not in the FE code at all; our expectation came from `docs/modules/shutdown-logic-validation.md`, not from the ETM-8034 Story.

Question: should a toast appear after Save in the Work Details modal?
- If **yes**: what is the exact text? We will log a defect.
- If **no**: we will change ETM-8862 step 8 to "the modal closes and the row shows the new values" (no toast).

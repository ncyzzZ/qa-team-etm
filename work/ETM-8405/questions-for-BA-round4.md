# ETM-8405 Questions for BA, round 4 (2026-11-24)

**Story:** [Improvement] Shutdown Timeline - Editable Weekly Plan (%) in Edit Plan
**Status:** Ready for UAT. ⭐ = affects an Expected Result directly.

1. ⭐ **Activity Group summary on Edit Plan (AC 2.2).**
   AC 2.2 says "Activity Group summary and Total Progress → Plan (%) must update accordingly", AC 2.4 says the Activity Group summary shows no error above 100.0, and your Q9 answer (17 Nov) says a kept Plan (%) is "counted in Group / Total". ETM-7347 AC 3.1 also shows group subtotals.
   The build and the tests (ETM-8640 steps 6 and 17) follow a project decision from 18 Nov: the Edit Plan group row shows **no** Plan (%) summary; the total is shown only in Total Progress.
   - Which one is right for Edit Plan: a Plan (%) summary on the Activity Group row, or no summary (Total Progress only)?
   - If no summary is right, please update AC 2.2 and AC 2.4 so they no longer mention the Activity Group summary.

2. **Validation file row for `Change Shutdown Size?`.** ETM-7984 AC 1.4 points to Confirmation&Result row 18; earlier notes said row 16. Please make sure the SharePoint Excel row the Story points to has the title `Change Shutdown Size?` and the body `Are you sure you want to change the shutdown size? This action will update some data.`

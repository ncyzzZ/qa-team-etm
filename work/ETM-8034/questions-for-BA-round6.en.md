# ETM-8034 - Questions for BA (round 6, 2026-11-25)

## Q1. Are row colours of a duplicated plan independent from the original plan? (Xray ETM-8867 step 8)

Context: `Duplicate Plan` (ETM-2696) copies Highlight and Text Color into the new plan (your answer R3-3 / DEC-055). ETM-8867 then changes a colour in the **new** plan and checks the **original** plan.

What we saw on QA (25 Nov 2026, plan `S26 Row Colour`, event `NN TEST QA`), twice in a row:
1. In the original plan a Platform row has the highlight `FFCCC7` (saved).
2. Duplicate Plan -> `QA Colour Copy`. The copy shows the same colours (OK).
3. In the copy, the Platform row highlight is set to `No Color` and saved.
4. The original plan is opened again: its Platform row no longer has `FFCCC7`.

We have not yet proven this with clean pictures, and we did not check whether Work / Work Breakdown colours of the original change too.

Questions:
- a) After Duplicate Plan, are the row colours of the new plan fully separate from the original (a change in one plan never changes the other)? Or
- b) is the highlight of a **Platform** row (or Work Header row) shared by all plans of the same event, so changing it in one plan changes it in every plan?
- c) If (b): does the same apply to Text Color, and to Work / Work Breakdown rows?

If the answer is (a), we will re-prove the case with pictures and log a defect. If (b), we will change ETM-8867 step 8 to match.

# ETM-8521 Faster Copy & Paste - questions for BA, round 4 (25 Nov 2026)

## R4-1. Please confirm: Work row Manpower Resource = peak concurrent demand, not a plain sum (Test ETM-8749, AC 1.3)

**AC 1.3 today (from R2-2):** the Work row shows the "Manpower **sum**" of its Work Breakdown rows.

**What the app does (QA env, run 2026-11-25_190145):** a Work with 5 Work Breakdown rows that together hold ECM Fitter 13 and DRT 2. The Work row shows **ECM Fitter[4], DRT[2]**.

For each manpower type the app takes the **peak concurrent demand**: rows that overlap in time add up, rows that run one after another count once (the highest). Example with the TC data, ECM Fitter[2] and ECM Fitter[3]:
- the two rows overlap -> Work shows ECM Fitter[5]
- the two rows run one after the other -> Work shows ECM Fitter[3]

The same rule gives the Work POB in the Edit modal. Work Man-hrs is still a plain sum of the rows (hours do add up).

**QA proposal:** this is the right rule. Manpower is headcount: the same crew can do sequential rows, so a plain sum would count people twice and overstate POB. We think "sum" in AC 1.3 is loose wording.

**Please confirm one:**
- **(a) Peak concurrent is correct** (QA proposal). Please update AC 1.3 wording; QA updates ETM-8749 step 3.
- (b) A plain sum is required. Then the current behaviour is a defect.

Checked and matching the AC already: Work Breakdown POB / Man-hrs in the Edit modal, Work Start / End span, Work Header and Platform Manpower "-".

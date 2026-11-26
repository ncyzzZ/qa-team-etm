# ETM-8521 Faster Copy & Paste - open questions for BA (round 5, 25 Nov 2026)

Status: Test Execution ETM-8773 has 11 PASSED, 0 FAILED, 8 TO DO. The 8 open Tests wait only on the 4 questions below. Every script check of these Tests already passes on QA.

## Q1 (R2-5, still open) "No Working Time Available" pop-up after a paste
**Tests:** ETM-8748, ETM-8749, ETM-8750, ETM-8753, ETM-8759, ETM-8762

**What happens on QA (runs of 25 Nov):** after a paste that changes Manpower Resource (or Working Location), the page sometimes opens the pop-up **"No Working Time Available"**. QA clicks OK. After OK the pasted values stay and every Expected Result of these Tests is met. The pop-up is not in the Story or in the Tests.

**Please confirm one:**
- (a) The pop-up is expected after such a paste and the pasted values stay after OK. QA then marks the 6 Tests PASSED.
- (b) The pop-up should not appear after a paste. Then it is a defect (QA logs it with evidence).

## Q2 (R4-1, sent 25 Nov) Work row Manpower Resource = peak concurrent demand, not a plain sum
**Test:** ETM-8749 (AC 1.3)

AC 1.3 says the Work row shows the Manpower **sum** of its Work Breakdown rows. The app shows the **peak concurrent demand** per type: rows that overlap in time add up, rows one after another count once. Example on QA: 5 rows holding ECM Fitter 13 in total, the Work row shows ECM Fitter[4]. QA thinks the peak is the correct rule (the same crew does sequential rows) and has already written Xray step 3 that way.

**Please confirm one:**
- (a) Peak concurrent is correct. Please update the AC 1.3 wording. QA marks ETM-8749 PASSED.
- (b) A plain sum is required. Then the current behaviour is a defect.

## Q3 (R2-8, still open) Description limit for a paste: 100 or 50 characters?
**Test:** ETM-8751

ETM-2615 AC 6.2 says 100 characters. ETM-769 says 50 for Edit Work. On QA a pasted Description of 150 characters is **kept in full** (not cut). Data Storage.xlsx was to be checked.

**Please confirm:**
- The limit for Description (100 or 50).
- Is a longer pasted value **cut to the limit**, as ETM-8751 expects? If yes, keeping 150 characters is a defect and QA logs it.

## Q4 (R2-7 follow-up) Where are the saved ETM-2615 results to compare with?
**Tests:** ETM-8738 (steps 5, 8-10), ETM-8762 (step 6)

BA said on 24 Nov that there is no previous build, and that QA should compare with the saved results of the ETM-2615 Tests or a result recorded by Dev. QA could not find a saved paste time or saved roll-up / histogram values for the same paste in ETM-2615.

**Please give one:**
- (a) The location of the saved ETM-2615 results (Test Execution key or file), or a result recorded by Dev for the same paste. Or:
- (b) Agreement that these comparison steps are not possible. QA then removes them from ETM-8738 and ETM-8762, and the Tests are judged on the current build only (AC 2 is checked cell by cell in ETM-8762 steps 3-5).

ETM-8738 step 11 (Save after a large paste) writes to a plan that other testers use. QA will run it on its own plan once Q4 is settled.

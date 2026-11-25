# ETM-8521 BA answers

## 2026-11-20 (via the user in chat)
- Q6 (master data on QA for TC-015 / ETM-8760): confirmed, Equipment Number `PL-CPP2-XV7445`, Functional Location `PL-CPP2-PRO-WI` (already in .env as ETM8521_EQUIPMENT / ETM8521_FUNC_LOC).

## 2026-11-18 (BA, DEC-049; first recorded in `.claude/team/work/ETM-8521/draft-tc.md`, copied here 2026-11-24)
- Q1 (speed target): no time target. Pass = no regression (AC 2). QA records the before/after time as information only (ETM-8738).
- Q2 (size of a large paste): no size defined. Use the largest Shutdown Logic on QA, same clipboard before and after.
- Q3 (loading indicator): no new indicator, no UI change.
- Q4 (environment / build) and Q5 (identical results): no answer recorded. Draft-tc Q5 (read-only columns) and S-4 (user without Edit permission) are also open: asked again in `questions-for-BA-round2.md` (R2-3, R2-6, R2-7).

## 2026-11-24 (from existing specs, not a new BA reply; see work/SPRINT26/ba-self-answers-2026-11-24.md)
- R2-1: option (b), DEC-049. R2-3: ETM-2310 column table matches QA; no POB column. R2-8: 100 characters, cut (ETM-2615 AC 6.2; ETM-769 says 50 for Edit Work). Old Q5: identical results (AC 2, ETM-7609 AC 8.2).
- Still open for BA: R2-2 (partly: Manpower Histogram), R2-4 (sources disagree: ETM-2615 AC 4.2 says reject, app converts to [1], no source says old value stays), R2-5, R2-6 (JO is the account), R2-7.

## 2026-11-24 (BA reply, full text in work/SPRINT26/ba-answers-all-2026-11-24.md, section ETM-8521)
- R2-1 (speed): no target (DEC-049). AC 1 is information only; pass = AC 2 (no regression). Times are recorded as data.
- R2-2 (POB / Man-hrs): check them in the Work Breakdown **Edit modal** and in the **Manpower Histogram**. Roll-up = Start / End span + Manpower sum on the Work row; Work Header / Platform show "-". BA will fix the AC 1.3 wording.
- R2-3 (read-only list): confirmed as QA listed. ETM-8761 (paste into POB): remove it, or change it to the Edit modal.
- R2-4 (rejected cell): **(c) the cell is cleared and shown red** (changes the Expected Result of 8759, 8762, 8753). Limit of 5 resources: not in either Story, BA asks Dev.
- R2-5 (No Working Time pop-up): **open**. Keep the existing behaviour; Dev confirms what it is. No Expected Result yet; QA reports what it sees after OK.
- R2-6 (no Edit permission): read-only table, Ctrl+V does nothing, no message. Check the permission row (Role & Permission V.2.xlsx) before using Job Owner.
- R2-7 (previous build): none. Compare with the saved results of the ETM-2615 Tests (or a recorded result from Dev).
- R2-8 (Description limit 100): **open**. BA checks Data Storage.xlsx first.
- Old Q5 / Q9 (large paste identical): yes, cell by cell (AC 2).

## 2026-11-24 after 13:30 (BA correction; Story updated in Jira 14:23)
- **R2-4 replaced** (was "(c) cleared and red"): keep the current behaviour. A field that must have a value (e.g. Duration) with an invalid pasted value is cleared and red, and Export / Optimize / Save are disabled until fixed. Manpower Resource `[0]`, `[100]`, `[1.5]` becomes `[1]`. ETM-8759 and ETM-8762 are not defects. Now in Story AC 2.1.
- **AC 1.3 updated** with R2-2: roll-up to the Work row = Start / End span + Manpower sum; POB / Man-hours checked in the Work Breakdown Edit modal; Work Header and Platform show "-".

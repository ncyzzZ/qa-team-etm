# ETM-8449 / ETM-8631: PLAN-20K Active switch (2026-11-24)

User yes in chat ("ตั้ง Active แล้วรัน"). Event afdb376f (main Shutdown Logic event, QA).
- Before: Active = "jeep test 3,000,000 row" (9ccca4a4-617f-4e2a-b677-a8bc25b7e7b8). All other plans Inactive.
- Switch: "New Plan 20,000 Work" (d584b6ce) ON via Planning tab toggle + "Change Active Plan" Confirm.
- Restore after 8631: turn "jeep test 3,000,000 row" ON again (Confirm) -> PLAN-20K Inactive.

## Run 2026-11-24_220427 (8631)
- Plan switch done and restored: "jeep test 3,000,000 row" Active again (DB checked), PLAN-20K Inactive.
- TM steps 1-11 passed (retry 1). Try 0 failed at step 1: hideHistogram hovered while the loading overlay was on -> openPlan now waits for the table first.
- Step 12 JO: Access Denied. BE POST /shutdown/validate 500 {"code":"40301","subCode":"SHUTDOWN_RECORD_ACCESS_DENIED","message":"shutdown logic record is inactive."}. Plan was Active; the Shutdown Logic ITEM of PLAN-20K is still Inactive. JO also needs the item ON (another data write, ask the user).

## Option without touching others (2026-11-24, lead relayed user: "ถ้ากระทบ รอก่อน ไม่งั้นทำ data test ตัวใหม่")
PLAN-20K Active affects the main event (jeep plan) -> not done again.
Own-event option: new event "QA ETM-8449" (only plan -> Active with no "Change Active Plan"), plan with Shutdown Logic ON and Works imported:
>= 2 Platforms, a Work Header with 2 Works, a Work with Work Breakdown rows (8631 step 1 needs these). Clone of tests/fe/setup/setupEtm7343Report.spec.ts (minus Daily Report).
Existing own events do not fit: QA ETM-7343 has 1 Work per Work Header; QA S26 Ramp belongs to ETM-8042.
Risk: unknown whether the Job Owner account sees a new event (7343 notes the same open point).
Not created: waits for the user's yes on the board.

## Own event made (user yes in chat "สร้าง event ใหม่", 2026-11-24)
- tests/fe/setup/setupEtm8449.spec.ts (ep-etm-fe-qa, not committed): event "QA ETM-8449" (ART, PSD, 01-13 Mar 2026; the only free ART window without overlap), plan "QA ETM-8449 Collapse" (ramp 03-07 Mar 2026), 3 Works imported (ASSET: 8449-1 + 8449-2 under Mechanical (PM); PL: 8449-3; 7 Work Breakdowns), Shutdown Logic created, plan Active (no other plan in the event), Shutdown Logic item ON.
- Path in ep-etm-fe-qa .env: ETM8631_PATH (event abefe3bb..., plan 8b498383..., logic 3d8677b5...). 8631 now opens this plan (openPlan(sl, PLAN_8631_PATH)); other Tests keep PLAN-20K.
- Run 2026-11-24_223623: 8631 steps 1-18 all ok (TM and JO). Result "Not proven" only because step 11 Log out is partial (the Job Owner uses its own saved login browser). Not PASSED: needs a person to confirm the log out step, or the user accepts it.
- Note: 8631 now runs on a 3-Work plan, not the 20,000 Work plan.

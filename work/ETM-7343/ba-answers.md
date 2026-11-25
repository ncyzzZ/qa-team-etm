# ETM-7343 BA answers

## 24 Nov 2026 (Sprint 26 audit; source: work/SPRINT26/ba-answers-all-2026-11-24.md, section "Audit items")
AC 1.6 (Plan (%) or Actual (%) without a value):
- The Actual column in the database is NOT NULL, so an empty saved Actual cannot exist.
- AC 1.6 stays only for the display of `-` when no data row exists yet.
- As a test of an empty SAVED value it is "not applicable": ETM-8724 (TC-016) is N/A.
- Note: the source file words this as "Proposal"; the Sprint 26 session reports BA answered it on 24 Nov (DEC-082/083/084).

## Earlier
18 Nov 2026: all other questions answered, see .claude/team/work/ETM-7343/story.md.

## 25 Nov 2026: Q5 (Job Owner on the card's Active Plan)
- Answer (user, answering as BA, in the lead chat): "ไปเปิดให้ plan นั้น active ก่อน JO ถึงจะเห็น" = the Plan must be Active, then the Job Owner sees it. No Event membership is needed.
- Check: DB `shutdown_plan` "QA ETM-7343 Colors" `spl_is_active = true` (since 23 Nov), not deleted. The JO account is a member of no organization on any Event, and the card Event has no organization.
- Rerun ETM-8678 as JO, run 2026-11-25_144805_ETM-7343 after a reset: the page still shows "Access Denied: If you need access to the Application, please send a request with your details." (the first try, 144447, timed out on page load).
- Result: by the BA answer this is a likely defect (JO cannot open the Daily Report of an Active Plan). Not logged: it waits for the user's yes. Xray ETM-8678 stays TO DO.
- 25 Nov, check on other Active plans (user chose "check other plans first"). Same saved logins, open each Daily Report URL directly:

| Event (status, asset) | Active Plan | Job Owner | TA Manager |
|---|---|---|---|
| QA ETM-7343 (INITIAL, ART) | QA ETM-7343 Colors | Access Denied | table shown |
| QA S26 Ramp (INITIAL, ART) | Plan Scenario A | Access Denied | table shown |
| (event 9885b03f) | Wide Plan B - NN | Access Denied | table shown |
| DEMO-TM Walkthrough FSD 2027 (COLLECTING, ART) | (Active) | Access Denied | not checked |
| Erawan FSD 2027 (FREEZE, G1/61) | (Active) | Access Denied | not checked |
| ERPB FSD (PREP_COMPLETED, G1/61) | (Active) | Access Denied | not checked |
| ART PSD (FREEZE, ART) | QA EMP Del A | table shown | not checked |
| PLCPP2 FSD (QA) (OPTIMIZATION, G1/61) | (Active) | table shown | not checked |

- The Job Owner opens only 2 of 8 Active plans. In the DB, neither Event status, asset, platform, organization membership (JO is in none) nor being Job Owner of a work (0 works in all of them) explains which ones. The rule must come from somewhere QA cannot see (e.g. the access service). So "Active Plan" alone is not enough today; asked as Q6 before any defect.
- 25 Nov: the user said "7343 รอก่อนขอเช็คเพิ่ม" (in the lead chat). No defect is logged; 8678 stays TO DO until the user finishes checking.
- 25 Nov, Q6 answered by the user (screenshot of the Planning tab): the Plan has its own Active switch AND each item row (Worklist, Shutdown Logic, Manpower Mob Plan, Equipment Mob Plan, Daily Report) has its own Active switch. A Job Owner sees the Daily Report only when the Plan is Active and its Daily Report row is Active. DB check matches all 8 plans above: JO opened exactly the 2 with `daily_report.sdr_active_status = true`.
- Not a defect. Setup now turns the Daily Report row Active through the UI (TA Manager); ETM-8678 rerun as JO: PASSED (run after reset, 25 Nov).

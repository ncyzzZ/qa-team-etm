# Retest ETM-9221 round 2, 25 Nov 2026 (status in Jira: Deployed to QA, updated 15:42)

QA, Turnaround Manager. Nothing written to Jira or Xray.

## Result: FIXED (screen + API). PDF still not checked.
| Check | Result |
|---|---|
| Freeze first day 14 Feb, Plan "QA ETM-8042 8836" (card-owned) | **No "Extend Daily Report" dialog**; the day froze (Unfreeze shown). Pictures `round2/freeze-01..03` |
| API daily-report range, Plan 8836 | `startDate 2026-02-14`, **`endDate 2026-02-25`** (was 2026-02-14) |
| API daily-report range, "Export 5000" | **`endDate 2026-07-15`** (was 2027-04-12), hasExtendedDays false. Read only, nothing changed |
| S-Curve "Export 5000" | Plan line ends **15 Jul 2026**. `round2/scurve-export5000.png` |
| S-Curve Plan 8836 report | Plan line ends **25 Feb 2026**. `round2/scurve-8836.png` |
| PDF of the S-Curve | Not checked (Export disabled on "Export 5000"). |

## Unblocked: ETM-8840
- Step 5 (by a person): days 14-24 Feb of the Plan 8836 Daily Report frozen one by one, no dialog on any day. Stopped on 25 Feb (last execution day, not frozen). Picture `round2/freeze-loop-stop-25Feb2026.png`.
- Run `2026-11-25_163311_ETM-8042` (run-policy auto): steps 1-7 OK, **step 6 last execution day = 25 Feb 2026 passed**. Step 7 S-Curve picture taken (by eye).
- Fails at step 8 on both tries: "badge shows the edit" expected `18 Feb 2026 09:00 - 20 Feb 2026 09:00`, read `15 Feb 2026 09:00 - 25 Feb 2026 18:00`.
  Trace: `PUT .../planning/384db0ce` body 18-20 Feb -> 200 "Planning updated successfully", and the next `GET .../planning` already returns 18-20 Feb. So the edit was saved: **script timing** (badge read once, before the card redrew), not a product bug. Fix proposal: `expectBadge` in `rampDownUp.helpers.ts` should poll (`expect.poll` / `toHaveText`). Not edited (out of this session's scope).
- finally block put Plan 8836 back to 15-25 Feb (second PUT 200) and kept Plan A Active.
- Steps 9-12 not reached. Xray ETM-8840: no push (failed run, needs the script fix and a re-run).

## ETM-8838 steps 5-8
Waiting for the user on the board: run on Plan 8836 (card-owned, has frozen days) or freeze 14 Feb on Plan Scenario A (shared with 8844/8847).

### ETM-8838 steps 4-9 on Plan 8836 (user on the board 16:43: "ใช้ Plan 8836")
Done on the card-owned Plan "QA ETM-8042 8836" instead of Plan Scenario A (same dates 15 Feb 09:00 - 25 Feb 18:00). Plan dates changed with the same PUT the Edit Plan dialog sends (UI edit itself proven in the 8840 trace), always put back.
| Step | Result |
|---|---|
| 4 Edit Plan 18 Feb 09:00 - 20 Feb 09:00 | PUT 200, planning list returns 18-20 Feb |
| 5 Daily Report Export PDF | Export is enabled only on a frozen day that has tasks (FE `isExportDisabled`: `!isFreeze() || !hasVisibleTasks()`). On 24 Feb (frozen): drawer PDF, Full Shutdown Timeframe -> `8838/QA S26 Ramp_QA ETM-8042 8836_DailyReport_Day10_20260224.pdf` |
| 6 Timeframe in PDF | Timeline `Feb 2026 15 ... 25` = snapshot, **not 18-20**: OK |
| 7 Day 1 | File name: 24 Feb = `Day10` -> Day 1 = 15 Feb: OK (by count; the PDF has no "Day 1" text) |
| 8 Day0 = 14 Feb | **Not proven**: the PDF timeline starts 15 Feb; Export is disabled on 14 Feb (no visible tasks on that day). Needs a person / BA |
| 9 Put back | PUT 200, plan 15 Feb 09:00 - 25 Feb 18:00 |
Xray ETM-8838: no push (run on Plan 8836 instead of Plan A, step 8 not proven).
Plan 8836 Daily Report state now: days 14-24 Feb frozen, 25 Feb open.

## Jira (user in chat 25 Nov: "จัดการเรื่อง defect")
- Comment 600639 "Retest: Passed" + @mention dev + 3 images (freeze-02-after-click, scurve-export5000, scurve-8836).
- Sub-task ETM-10076 "[QA] Retest - S-Curve end and Daily Report range on the last execution day": self, worklog 30m, Done, no Original Estimate.
- ETM-9221 -> Ready for UAT.
- Xray: no change (ETM-8849 run is skipped/by eye; ETM-8840 failed on a script step; ETM-8838 run on Plan 8836 with step 8 not proven).

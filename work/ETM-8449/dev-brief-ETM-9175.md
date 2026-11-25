> **Deleted 24 Nov 2026: script error, not reproduced by hand (manual-9175/). No dev action.**

# Dev brief: ETM-9175 (Custom View: Platform level box switches to + and hides Work Header rows)

> **Manual check on QA, 24 Nov 2026 23:30 (TM, PLAN-20K): NOT reproduced.** The Platform button is disabled (label `Platform (always expanded)`). After a click, all boxes stay `-` and the rows stay 22,442 (18/149/5000/17275). Evidence: `work/ETM-8449/manual-9175/`. Recommendation: close as a test-script error.
>
> **HOLD: QA is re-checking. This is probably a test (locator) error, not an app bug. Please do not fix yet.**
> In stms-fe (develop and before ETM-8449) the Platform button is `isLocked: true`, `[disabled]`, and `onToggleLevel` returns early for it. The QA script found the Platform box by the label pattern `^(Expand|Collapse) all platform`. The locked button's label is `Platform (always expanded)`, so it did not match. The script then fell back to "the first `Expand all / Collapse all` button", which is **Work Header**. The run logged the "Platform" box as enabled (no `(locked)` mark), which agrees. QA will check it by hand and close or confirm this defect.

## 1) What is wrong (as reported)
In the Custom View panel, clicking the Platform box in "Expand/Collapse by Data Level" turned it to `+`, and only the Platform rows stayed visible. Platform rows can never be hidden, so this box must not react.

## 2) Where
- Page: Shutdown Logic (View Shutdown Logic), Gantt toolbar, Custom View panel.
- URL pattern: `/shutdown-event-list/events/<eventId>/planning/<planId>/logics/<logicId>`
- Environment: QA (stms-qa.apps.pttep.com). FE build: the QA build of 24 Nov 2026.
- Role: Turnaround Manager.
- Data: plan "Shutdown Logic: New Plan 20,000 Work" (22,442 rows, 18 Platforms).

## 3) Steps to reproduce
1. Open the Shutdown Logic page of the plan above. All rows are expanded and every level box shows `-`.
2. Open the Custom View panel.
3. Click the box of Platform.

## 4) Actual vs Expected
- Actual (automated run 2026-11-24_162751, ETM-8632 step 3): a box turned `+` and only the 18 Platform rows stayed visible.
- Expected: nothing changes. The Platform box stays `-` and is not clickable, and all 22,442 rows stay visible.

## 5) Rule source
- User / BA rule, 24 Nov 2026 (F-6): "Platform box cannot switch +/- (Platform rows can never be hidden)."
- stms-fe `shutdown-custom-view-panel.component.ts` already implements this: `{ index: 0, label: 'Platform', isLocked: true }`, with the comment "Platform is locked (its rows are always visible) — ignore any toggle."

## 6) Hints for the fix (guess)
- Probably no app change is needed (see HOLD).
- If the manual check does reproduce it, look at the QA build. Is `isLocked` / `[disabled]` present on the Platform button in `shutdown-custom-view-panel.component.html`, and is the guard at the top of `onToggleLevel` there?

## 7) How QA will retest
- Xray Test ETM-8632, step 3 (Test Execution ETM-8637).
- First QA fixes the script so it finds the Platform box by its own label (`Platform (always expanded)`), then re-runs step 3 and also checks it by hand.
- Pass: the Platform box is disabled and stays `-`, and the row count stays 22,442.

## 8) Out of scope / do not change
- The Work Header, Work and Work Breakdown boxes, and the expand/collapse cascade (see ETM-9177).
- The Platform button's aria-label: the QA script will adapt to it.
- Performance work done in ETM-8449.

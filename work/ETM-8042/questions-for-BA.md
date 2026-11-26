# ETM-8042 Questions for BA (round 2: open questions only)

**Story:** [Improvement] Planning - Individual Ramp Down & Up Date
**Status:** In Development. No comments. Description matches the BA file (synced 2026-11-15).
⭐ = affects an Expected Result directly, please answer first.
Test cases are drafted (23). Only the points below are still waiting.

## Open questions

1. ⭐ Daily Reports created before this release have no snapshot of the Plan's Ramp Down/Up Date (AC 8.2). What do they use: the Plan's current dates, the Shutdown Event's Planned Date, or are they not supported / left unchanged?
2. ⭐ Daily Report PDF (ETM-5277): is Day 1 the Ramp Down date (for example 15 Feb) or the First Execution Date after the 18:00 rule (for example 14 Feb)?
3. Exported Excel and PDF: are the Ramp Down/Up values shown as `DD Mmm YYYY HH:mm` (as on the Plan Card badge) or as date only?
4. ⭐ Create/Edit Plan: if only a Start date or only an End date is picked in the Ramp Down/Up Date range, is `[ Save ]` enabled or disabled, and what happens when it is clicked?
5. ⭐ When Ramp Up is picked earlier than Ramp Down, the picker adjusts the value by itself and shows no error. What exactly is the adjusted value (End set equal to Start, Start set equal to End, or something else), and for the same day with an earlier time?
6. Plan Card badge (AC 4): how does it look on a narrow card or with a long Plan Name (truncate, wrap)?

## Please confirm (answered by the QA team lead from the Story and Figma, not yet by you)

- Every Shutdown Event has a Planned Date, so existing Plans always get it as their Ramp Down/Up Date (AC 6).
- The Create Plan field is pre-filled with the Planned Date (AC 1.3). Figma shows only the empty state.
- `[ Save ]` is disabled until Plan Name and Ramp Down/Up Date are filled.
- No upper limit on the range length, only the format must stay `DD Mmm YYYY HH:mm`.
- The Extension moves the Plan's Ramp Up Date to the date the user chooses.
- No confirmation or warning when editing the dates, even when Shutdown Logic or Daily Reports exist.
- The Plan Card badge is always shown, with date and time.
- Only a Turnaround Manager can create or edit a Plan; other roles cannot.
- The Optimization Module receives date and time of the Plan's Ramp Down/Up.

## Suggestions (not in the Story, answer only if useful)

- S1: Can a date be typed or pasted into the picker (for example `31 Feb 2026 08:00`)?
- S2: Do other roles (for example Job Owner) still see the badge on the Plan Card?
- S3: If the Extension updates the Plan but the Daily Report snapshot update fails (or the other way round), what does the user see and what is stored?
- S4: If two users save different Ramp Down/Up values for the same Plan at the same moment, which one wins, and does the other user get a message?

## Raised during the QA run, 2026-11-20 (answered by BA through the user the same day)
7. (AC-8.2) A Daily Report created while the Plan's worklist has no work opens on the Ramp Down date itself (Ramp Down 15 Feb 2026 09:00 -> first day 15 Feb), not by the 18:00 rule (14 Feb). Is that intended? — BA: yes, correct behaviour.
8. (AC-8.2) In the same case the Daily Report Gantt shows Jan 2026 instead of the snapshot Ramp Down/Up range. Is that intended? — BA: not an issue while there is no work from the worklist.

9. (AC-8.2, ETM-4127 AC 3) Old Daily Report without a snapshot (QA: Export 5000 / "Optimize Pass", event Planned Date 17 Jun 2026 10:00 - 15 Jul 2026 06:00): the Planned S-Curve on screen and in the PDF ends around 12 Apr 2027, the end of the last task, not on the event Planned end 15 Jul 2026. For a report made before ETM-8042, should the Planned S-Curve end on the event Planned end (15 Jul 2026) or on the last task end? Was this already the behaviour before the ETM-8042 release? — open (ETM-4127 AC 3 and ETM-8042 AC 8.2 say the event end day plus extended days; only the before-release behaviour is still unknown) — BA 24 Nov: ends on the last execution day = snapshot Ramp Up + extended days; old report snapshot = Event Planned end; last task end (12 Apr 2027) is a defect.

## Raised during the QA run, 2026-11-23
10. (AC-8.1, ETM-5492, AC 6 "no upper limit on the range") On a Plan with a 3-year Ramp Down/Up Date (15 Feb 2026 08:00 - 15 Feb 2029 20:15, QA event "QA S26 Ramp", Plan "Plan Scenario Long Name Plan Scenario Long Name 12"), the Shutdown Logic `Export` dialog shows `Excel File` disabled; only `PDF File` can be chosen. On a 10-day Plan (Plan Scenario A, 15 - 25 Feb 2026) `Excel File` is enabled. Is there a maximum timeframe for the Excel export (if yes, what is it, and should the user see a reason)? Or should Excel be available for any Ramp Down/Up range? — answered from existing Stories 24 Nov: no maximum timeframe (ETM-5492), Excel is disabled only while the page has unsaved edits (ETM-3461 AC 1.2). QA treats the disabled card as a defect candidate; no need to send unless the BA disagrees. BA 24 Nov: QA asks Dev why Excel is disabled.

## Raised by the Sprint 26 TC/script audit, 2026-11-24
11. (AC-3, ETM-8851, your answer S1 of 18 Nov) You wrote that after pasting an invalid date (`31 Feb 2026 08:00`, `2026-02-08 08:00`) the field keeps its previous value. On QA the picker clears that part instead, and Save becomes disabled until a valid date is entered. On 20 Nov the QA team changed ETM-8851 to follow the app, but that was a QA decision, not yours. Which is correct: (a) keep the previous value, which would make the current app a defect, or (b) clear the part and disable Save, which means S1 is updated? — BA 24 Nov: (b), the app is correct, S1 / DEC-052 updated.

## Raised 2026-11-24 night (ETM-8851 re-check by hand)
12. (AC 1.2, ETM-8851, your answer to Q11) An invalid date typed or pasted into the Ramp Down/Up Date picker.
    Where: QA, event "QA S26 Ramp" > Planning tab > Plan Card "Plan Scenario A" > three-dot > Edit Plan. Current value `15 Feb 2026 09:00 -> 25 Feb 2026 18:00`. Checked 24 Nov 2026, Turnaround Manager, nothing saved.

    | Case | Input | Your Q11 answer / AC 1.2 (expected) | QA app now (actual) |
    |---|---|---|---|
    | 1 | Paste `31 Feb 2026 08:00` into Start | Start is cleared, Save disabled | While typing: invalid text shown, no red border, no message, Save disabled. After leaving the field: Start goes back to `15 Feb 2026 09:00` (on the next click, not on Tab) |
    | 2 | Paste `31 Feb 2026 08:00` into End | End is cleared, Save disabled | Same; End goes back to `25 Feb 2026 18:00` on Tab |
    | 3 | Paste `2026-02-08 08:00` into End | End is cleared, Save disabled | Same as case 2 |
    | 4 | Type `31 Feb 2026 08:00` into End | End is cleared, Save disabled | Same as case 2 |

    In every case nothing invalid is saved; the difference is only "cleared" vs "previous value put back".
    Pictures (full screen, 8 files): case1-a-before-leave … case4-b-after-leave (a = right after the input, b = after leaving the field). Save is disabled in all of them; no red border or message.

    Which is correct?
    (a) Clear the part and disable Save (Q11, AC 1.2): the current app is a **defect**.
    (b) Put back the previous valid value: AC 1.2 and ETM-8851 are updated, no defect.
    Also: should Start and End behave the same (Start puts the value back only on the next click, End already on Tab)?
    — BA 25 Nov: (b), previous value put back, no defect. Start/End timing not answered (both accepted).

## Q15 - ETM-8837: Ramp Down/Up Date in the Manpower and Equipment Mob Plan Excel (26 Nov 2026)
ETM-8042 AC 8.3 (Manpower Mob Plan) and AC 8.4 (Equipment Mob Plan) say: "Export Excel (ETM-6396 / ETM-7315): `Start Event Date` / `End Event Date` are replaced by `Ramp Down Date` / `Ramp Up Date`."
On QA (26 Nov 2026, Plan "QA ETM-8042 8836", one person and one equipment added on the screen) both exported files show only the title row (`Manpower Mob Plan: <Plan>` / `Equipment Mob Plan: <Plan>`), the column headers and the data. There is no `Ramp Down Date` / `Ramp Up Date` label, and no `Start Event Date` / `End Event Date` label either. In ETM-6396 and ETM-7315, `Start Event Date` / `End Event Date` appear only under "Data Source", and the AC layout of the sheet has no row for them.
Question: should the Mob Plan Excel files show the Plan's `Ramp Down Date` and `Ramp Up Date` (if yes: in which cells, and what format)? Or does AC 8.3 / 8.4 only mean the export uses the Plan dates internally (for example for the timeline window), with no visible label?
Evidence: work/ETM-8042/manual-8837-mobplan/ (step-1..6.png, both .xlsx files and their cell dumps).
    — QA lead 26 Nov (user, main chat): the Mob Plan Excel files do NOT need to show Ramp Down/Up Date. Closed, no defect.

# ETM-8392 - Questions for Dev: where do the Daily Report Ramp lines get their dates?

**Story:** ETM-8392 [Improvement] Daily Report - Ramp Down and Ramp Up Vertical Lines on Gantt Chart
**Related:** ETM-8042 (individual Ramp Down/Up Date per Plan, Daily Report snapshot)
**Test Execution:** ETM-8825 (blocked: ETM-8677, ETM-8688, ETM-8797)
**Checked:** stms-fe `develop` at a9c56271 (v1.26.12, 20 Nov 2026)

## What we see in the FE code
`daily-report-gantt.component.ts` (`highlightSelectedDateColumn`) draws the lines from the Daily Report API response:

```ts
const event = this.loadedGantt?.event;
store.add?.(rampMarkerRecords(new Date(event.startDate), new Date(event.endDate)));
```

The comment there says "Ramp Down / Ramp Up = the event's own start / end". The Daily Report Gantt does not read the Plan's `rampDownDate` / `rampUpDate` (added by ETM-8042, 474b5fb5), and the FE has no Daily Report snapshot field for the Ramp dates.

## Expected (BA answers)
- AC 1.1 + ETM-8042 AC 4 / AC 8.2: the lines are at the **Daily Report snapshot** of the **Plan's** Ramp Down / Ramp Up Date. Editing the Plan later does not move them.
- DEC-048: a Daily Report created before ETM-8042 (no snapshot) uses the Event's Planned Start / End.
- DEC-062: an Extension (and deleting extended days) does not move either line.

## Questions
1. In the Daily Report Gantt API response, what are `event.startDate` / `event.endDate`: the Event's Planned Start / End, or the Daily Report's snapshot of the Plan's Ramp Down / Ramp Up Date?
2. If they are the Event's dates: when two Plans in the same Event have different Ramp dates, both Daily Reports show the lines at the same place. Is a change planned (BE sends the snapshot, FE reads it)? Which card or branch?
3. When the Plan's Ramp Down / Ramp Up Date is edited after the Daily Report was created, do `event.startDate` / `event.endDate` in the Daily Report response stay the same?
4. When the last execution day is extended (or extended days are deleted), do `event.startDate` / `event.endDate` change?
5. Is the BE part deployed on QA (`stms-qa`) now, and in which version?

## Why we ask
Our QA data has the same Ramp dates on every Plan of the event (and they match the Event's dates), so the passed tests cannot tell the snapshot apart from the Event's dates. ETM-8677, ETM-8688 and ETM-8797 need data changes on QA; we want the answers before changing any data.

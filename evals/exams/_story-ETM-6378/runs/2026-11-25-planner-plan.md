# ETM-6378 Manpower Mob Plan: POB Chart (planner plan, read-only walk on QA, 2026-11-25)

## What I saw on QA

Role TM, plus JO at the end. I unticked and re-ticked a graph and used the Hide Table toggle only, locally. Nothing was saved and no data was added.

Plans used:
- **B. Event "แผนหยุดซ่อม", plan "eND50"**: `/shutdown-event-list/events/b69b19e4-b56e-4b1d-9e49-74ec40c06a3c/planning/812889f6-d90d-4614-ac0a-341c26b9c20f/manpower-mob/93272d08-c116-4a36-8885-36d7326c4331`. It has one graph, "test1". This is the only plan I found with POB data; I did not find one with many graphs.
- **A. Event "Export 5000", plan "For Critical Path (Joe)"**, and **C. "NN TEST QA" / "Wide Plan B - NN"**, plus "Plan Scenario A/C": no graphs, so the chart shows the empty state.

Exact texts and facts:
- The chart section sits under the schedule grid. Header: `POB Chart` (h3) on the left. On the right, in this order: a small switch, then the label `Hide Table`, `Export Chart` (outlined), `Add Data` (primary with an icon).
- **Empty state** (plans A, C, Scenario A/C): body text **"No data available."** The switch and `Hide Table` are disabled, `Export Chart` is disabled, and `Add Data` is enabled. No axes, no data table.
- **With graphs** (plan B): a chart canvas (Chart.js) about 315 px high, with a separate 48 px Y-axis canvas on the left that does not scroll. Under it is an AG Grid "Data" table: column `Data` (200 px) with a checkbox and the graph name, then a month header `May` over day columns `12 … 30` (60 px each). Row: `test1`, values `0 0 0 0 0 0 0 0 0 0 4 4 3 0 0 0 0 0 0`.
- Hovering a date shows an HTML tooltip `22 May` / `test1:` / `4`. The point lines up with table column 22.
- **Chart dates differ from the schedule above.** The chart and table run May 12 to May 30 (19 days, 60 px). The schedule grid runs from May 14 (27 days, 64 px each). The chart does not scroll with the schedule.
- The chart and data table scroll together sideways, both ways (mouse wheel on the chart: chart 152 / table 150; wheel on the table: chart 52 / table 50). There is a **2 px offset** (chart scrollLeft 2 at rest), and the visible widths differ (chart 936 px, table 954 px).
- Untick test1: `Export Chart` becomes disabled, the switch and `Hide Table` stay enabled, the table stays with the row unticked, and **page `Save` stays disabled**.
- Hide Table switch on: the table is removed and the chart grows (315 → 450 px). Off again: the table comes back.
- The legend and the Y-axis numbers are drawn inside the canvas and cannot be read from the DOM. There is text at the bottom of the main canvas (x-axis labels and/or legend) and grid lines about every 21 px. I did not read screenshots, so legend content, Y range and colours are **not verified**.
- JO (eND50, Active item, shows an "Active" tag): the chart header has the switch, `Hide Table` and `Export Chart`, but **no `Add Data`**.

Not seen:
- More than 1 graph (the 10-graph limit), negative values, Constant / POB Movement / POB Onboard / Mob / Demob graph types.
- The legend text and line style.
- The 0–100 Y-axis when all graphs are unticked (canvas content not read).

## Scenarios

### 1. Section place and header order
Steps: open plan B and scroll below the schedule grid.
Expected: "POB Chart" title on the left. On the right, in order: switch + "Hide Table" (switch left of the label), "Export Chart" (outlined), "Add Data" (solid primary with ⊕). The section is directly under the schedule grid.

### 2. Empty state: no graphs configured
Steps: open plan A (or Wide Plan B).
Expected: centred "No data available." (with full stop). No axes, grid lines or data table. Hide Table toggle and Export Chart disabled (greyed). Add Data enabled. Also check after deleting the last graph (needs a card-owned plan).

### 3. Chart with data: values plotted on the right dates
Steps: plan B, hover each date of test1.
Expected: the tooltip shows "<d> May" / "test1:" / value equal to the table cell (22 May = 4, 23 May = 4, 24 May = 3, others 0). The point sits over the table column of the same date.

### 4. Date range of the chart against the schedule (differs from Story / other screens)
Expected (Story): fixed X range Earliest Task Start − 7 days to Latest Task End + 7 days, same as the schedule.
Seen: the chart and table run May 12 to 30, while the schedule grid above starts May 14 and runs 27 days. **Differs:** first and last dates and column widths (60 px against 64 px) do not match the schedule. Check each place a date range shows (schedule header, chart X axis, data table header, filter picker months).

### 5. Chart and data table scroll together
Steps: wheel sideways on the chart, then on the table.
Expected: both move by the same amount, and the date points stay over the same table columns at both ends. Seen: in step but 2 px apart, and the visible widths differ by 18 px (936 against 954). Check alignment at the far right end. The Y axis must stay put.

### 6. Y axis sticky
Steps: scroll the chart sideways.
Expected: the Y-axis canvas (48 px, left) does not move.

### 7. Dynamic Y-axis scaling (needs graphs; canvas)
Steps: with several graphs, untick the one with the highest value.
Expected: the Y range shrinks to the highest and lowest of the ticked graphs. Read the axis labels on screen (a picture is needed; it is a canvas).

### 8. Negative values (needs data)
Steps: add a Constant graph with a negative value (card-owned plan).
Expected: the axis goes below 0 and the line is drawn below 0. The table shows the minus sign.

### 9. Legend follows ticked graphs (canvas, not verified)
Expected: a legend at the bottom with name, line style and colour for each ticked graph. Unticking a graph removes its legend entry, and ticking it brings it back. With 0 ticked the legend is empty. Check the colours match the lines.

### 10. All graphs unticked
Steps: plan B, untick test1.
Expected: only the axes and grid show, X = schedule range ±7, Y 0 to 100 step 10 (needs a picture). The legend is empty. The table stays with every row unticked. Hide Table stays enabled. Export Chart is disabled (seen). Seen: page Save stays disabled; confirm whether tick state is meant to be saved per plan.

### 11. Hide Table toggle
Steps: switch on, then off.
Expected: the table hides and the chart takes the space (315 → 450 px seen). Off brings back the same rows and tick states. Disabled in the empty state.

### 12. Export Chart state
Expected: enabled with at least 1 ticked graph; disabled with 0 ticked or no graphs. (Export content is ETM-6380.)

### 13. Ten graphs at once (needs data)
Steps: plan with 10 graphs, all ticked.
Expected: all 10 lines, 10 legend entries, distinct colours, readable layout. Try an 11th through Add Data to see the limit (ETM-6381; not done here).

### 14. Same chart for every user
Steps: compare TM and JO on the same Active plan (eND50).
Expected: same graphs and values. Seen: JO has no "Add Data" button; Hide Table and Export Chart are there. Compare with the Story header order for a view-only user. JO cannot open an Inactive Mob Plan item ("Access Denied").

### 15. Chart not touched by grid filters
Steps: filter the grid (ETM-5615), e.g. untick QA Blaster 1.
Expected: chart and table values stay the same (seen: `…4 4 3…`).

### 16. Plan not in the current month
Expected: the chart opens on the plan's dates (May 2026), not today (Nov 2026), with no empty months before.

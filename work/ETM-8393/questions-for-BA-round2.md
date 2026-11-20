# ETM-8393 – Questions for BA (round 2)

Story: [Improvement] Shutdown Logic - Capacity and Consumption Tooltip on Manpower Histogram

Already decided (thank you): the tooltip label is "Used Resource"; a green bar works like the red one, only the colour changes; where there is no bar there is no hover and no tooltip.

Red/green rule is closed (read from ETM-15 AC 5.3: red when above Capacity, green when equal or lower).

Still open, because each one changes an Expected Result:

## Q1. Number format
Figma shows whole numbers without a unit (Capacity 1, Used Resource 10). Can Capacity or Used Resource ever be a decimal (e.g. 2.5)? If yes, how many decimals does the tooltip show?

## Q2. Tooltip segment (AC-3)
- If two neighbouring sections have the same height but a gap (no bar) between them, are they two separate tooltip sections?
- When the mouse moves from one section to the next section of a different height, does the tooltip update straight away to the new values?

## Q3. Capacity line value
Capacity changes over time (it drops to zero outside the shift Working Time, ETM-15 AC 5.2). Please also confirm the tooltip shows Capacity 0 where a bar exists outside Working Time. If Capacity changes but Used Resource stays the same height, is that still one section, or does it start a new tooltip section?

## Q4. Tooltip position
Figma shows the card above the cursor. What happens near the right edge of the chart or the top of the histogram area: does the card move so it stays fully visible?

## Q5. Build availability
[FE] Implement UI (ETM-8534) is still Open and the Story is "Ready For Development". Which environment and plan will have this change when QA starts, and which resource rows have both a red and a green bar for testing?

## 2026-11-20 status (via the user in chat)
- ETM-8534 ([FE] Implement UI) is not on QA yet: ETM-8393 runs stay on hold.

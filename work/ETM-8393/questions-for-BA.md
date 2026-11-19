# ETM-8393 – Questions for BA

Story: [Improvement] Shutdown Logic - Capacity and Consumption Tooltip on Manpower Histogram

Test cases are blocked on the points below, because each one changes an Expected Result.

## Q1. Hover where there is no bar
AC-1 says "hovering over a histogram bar shows a tooltip". What should happen when the user hovers over:
- a day where the resource has no consumption (consumption = 0, so there is no bar), but the capacity line is still drawn?
- the capacity line only, above a bar?
- the empty chart area?

Expected: (a) no tooltip, or (b) tooltip with Capacity = X and Consumption = 0?

## Q2. "Point in time" and tooltip labels
AC-2 says the tooltip shows two values "for the hovered point in time". The Figma frame (node 83-858533) shows only two lines and no date.
- Please confirm the tooltip shows no date or period.
- AC-2 calls the second value "Consumption", but Figma shows the label "Used Resource". Which text must the tooltip show?

## Q3. Number format
Figma shows whole numbers without a unit (Capacity 1, Used Resource 10). Can either value ever be a decimal (e.g. 2.5)? If yes, how many decimals are shown?

## Q4. Bar colour rule
AC-2 refers to ETM-15 AC 5.3 for the bar colour (red or green). Figma only shows a red bar (Used Resource 10, Capacity 1), no green example. Please confirm the exact condition (for example: red when Consumption is greater than Capacity, green otherwise) and what colour is used when Consumption equals Capacity.

## Q5. Tooltip segment (AC-3)
"One tooltip covers a continuous section of the bar with the same height."
- If two neighbouring sections have the same height but are separated by a gap (zero days), are they two sections?
- When the mouse moves from one section to the next, does the tooltip move or update to the new values immediately?

## Q6. Build availability
[FE] Implement UI (ETM-8534) is still Open and the Story is "Ready For Development". Which environment and plan will have this change when QA starts, and which resource rows have both a red and a green bar for testing?

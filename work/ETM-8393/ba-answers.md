# ETM-8393 – BA answers (round 3, 24 Nov 2026, DEC-083)

Source: work/SPRINT26/ba-answers-all-2026-11-24.md, section "ETM-8393" (BA 2026-11-24). Questions: questions-for-BA-round3.md.

| Q | Answer | Effect on Tests / scripts |
|---|---|---|
| R3-1 AC 2 label | The title, the "I want to" line and AC 2 now say **Used Resource** (Jira updated 2026-11-24 11:37, checked live). | None: every Test and the spec already say "Used Resource". No Test says "Consumption" (JQL text ~ "Consumption" on the linked Tests: 0). |
| R3-2 Capacity inside one same-height section | The card shows the Capacity of the point under the pointer, as the build does. | ETM-8826 stays as it is; the script checks the card Capacity against the sub-bar under the pointer. |
| R3-3 Manpower change / roll back (Q10) | The histogram updates when the change is confirmed in the modal; leaving without `Save` saves nothing. | ETM-8820 steps 4-9 no longer wait on BA. They stay manual for now because the Manpower Resource tab fields have no mapped selectors yet (live probe needed). |
| R3-4 Card near the chart edge | The card stays inside the histogram (stops at the right edge, stays at the top). No story change. | No Test checks it; the script's position check already allows the top-edge case. |

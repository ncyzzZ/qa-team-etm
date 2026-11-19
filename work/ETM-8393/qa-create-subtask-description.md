## Test cases for ETM-8393 (Capacity and Consumption Tooltip on Manpower Histogram)

15 manual Tests were created in Xray: ETM-8810 to ETM-8827 (without ETM-8816, ETM-8822, ETM-8825, which belong to other cards). Every Test is linked to the Story ETM-8393 ("is tested by").

### Where everything lives

| Item | Where |
| --- | --- |
| Test Repository folder | Manual Test / Sprint 26 / ETM-8393 |
| Sprint Test Plan | ETM-8636 Test Plan for Sprint 26 (folder ETM-8393) |
| Test Execution | ETM-8828 Test Execution for ETM-8393 (Test Environment: QA) |

### Definition of Done

- [x] 15 Tests created in Xray with full steps and Expected Results
- [x] Description of every Test written in the standard shape (Scenario, Precondition, Navigation Path)
- [x] Every Test linked to ETM-8393 ("is tested by"), checked with JQL: 15 of 15
- [x] Tests filed in the Test Repository folder, the Sprint 26 Test Plan and its folder
- [x] Test Execution created, 15 Tests loaded, Test Environment QA
- [x] Test Reviewer: Conditional Approve; the review points were fixed and the TC set was approved by the user before the push
- [x] Readback of the steps from Xray compared with the draft: 15 of 15 Tests match, 82 steps, G5 passed
- [ ] Execution (waits for the QA build; ETM-8534 is not ready yet)

### Test case summary

| Test | Type | What it checks | What it proves |
| --- | --- | --- | --- |
| ETM-8810 | POS | Hover on a bar shows the tooltip card, moving away hides it | The tooltip opens on hover and closes when the mouse leaves, one card at a time |
| ETM-8811 | POS | Labels, icons, whole numbers, no Works list | The card shows Capacity and Used Resource with the right icons and no Works list |
| ETM-8812 | POS | Capacity and Used Resource match the table and the bar | The numbers in the card are the real data, for a PTTEP crew row and a Contractor row |
| ETM-8813 | POS | Box icon is red when Used Resource is above Capacity | The icon colour follows the bar colour for over-allocation |
| ETM-8814 | POS | Box icon is green when Used Resource is equal to or below Capacity | The icon colour is green for below and for equal, same layout as red |
| ETM-8815 | POS | Points inside one same-height section show the same values | One tooltip per continuous same-height section |
| ETM-8817 | POS | The next section after a height change shows its own values | The card changes when the bar height changes |
| ETM-8818 | NEG | No tooltip where there is no bar | An empty area gives no card |
| ETM-8819 | NEG | The card does not get stuck or double after fast moves, scroll, toolbar change | The tooltip stays correct under careless use |
| ETM-8820 | POS | Values follow the Work Header filter, a manpower change and the Used Resource toggle | The tooltip stays in step with the chart (manpower change is a manual step) |
| ETM-8821 | POS | Tooltip is shown for a View All user and a View Active user | The tooltip works for both permissions |
| ETM-8823 | POS | Capacity shows 0 for a bar outside the shift Working Time | Capacity follows the capacity line, 0 outside Working Time |
| ETM-8824 | POS | Two same-height sections with a gap are two sections | A gap splits sections and the card updates at once |
| ETM-8826 | POS | A Capacity change with the same Used Resource height stays one section | Only a height change makes a new section |
| ETM-8827 | POS | Both Capacity and height change: a new section with its own values | A new section shows its own two numbers |

### Next step

Run Test Execution ETM-8828 once the Story is on QA (Ready For QA). Test ETM-8820 needs a manual step and ETM-8821 needs the role mapping confirmed.

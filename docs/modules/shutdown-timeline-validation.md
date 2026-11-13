> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Provided by the team as the validated spec; texts are verbatim from the source workbook/document, so use them as Expected Results without rewording.

# Shutdown Timeline – Validation & Result

> Source: `Shutdown Timeline Validation&Result.xlsx` (4 sheets)
> หมายเหตุการแปลง: ช่องที่ถูก merge ใน Excel (Page / Action / Trigger) ถูกเติมค่าซ้ำในทุกแถวเพื่อให้อ่านแต่ละแถวได้ครบในตัวเอง ข้อความทั้งหมดคัดลอกตามต้นฉบับทุกตัวอักษร (รวมถึงช่องว่าง/ตัวพิมพ์) ช่องว่างแสดงเป็น `-`

---

## 1. Confirmation & Result

**View UI in Figma:** [Figma Link](https://www.figma.com/design/DiPcr6PVSLRxsy1VJOebUB/Turnaround?node-id=4847-214565&t=qNr3D85CHQMNzKhn-1)

| # | Page | Action | Trigger | Condition | Confirmation & Result Type | Title | Message 1 | Button 1 | Button 2 | Button 3 |
|---|------|--------|---------|-----------|----------------------------|-------|-----------|----------|----------|----------|
| 1 | View Shutdown Timeline | Update Progress | Click Update Progress Button | Update Success | Toast - Success | Update Success | Update Progress Successfully. | - | - | - |
| 2 | View Shutdown Timeline | Update Progress | Click Update Progress Button | Update Fail | Toast - Fail | Update Failed | Update Progress Failed. | - | - | - |
| 3 | View Shutdown Timeline | Update Progress | Click Update Progress Button | Plan has Been Changed | Confirmation Modal - Style 1 | Plan has Been Changed | The shutdown timeline has already been updated. This action will reload the page and update some data. | OK | - | - |
| 4 | View Shutdown Timeline | Leave Page | Change Page Using Side Menu or Tab | - | Confirmation Modal - Style 1 | Unsaved Change | Are you sure you want to leave this page? Changes you made will not be saved. | Continue Editing | Discard Change | - |
| 5 | View Shutdown Timeline | Add Note | Click Save Button in Add Note Modal | Save Success | Toast - Success | Save Success | Save Note Successfully. | - | - | - |
| 6 | View Shutdown Timeline | Add Note | Click Save Button in Add Note Modal | Save Fail | Toast - Fail | Save Failed | Save Note Failed. | - | - | - |
| 7 | View Shutdown Timeline | Edit Note | Click Save Button in Edit Note Modal | Edit Success | Toast - Success | Edit Success | Edit Note Successfully. | - | - | - |
| 8 | View Shutdown Timeline | Edit Note | Click Save Button in Edit Note Modal | Edit Fail | Toast - Fail | Edit Failed | Edit Note Failed. | - | - | - |
| 9 | View Shutdown Timeline | Delete Note | Click Delete Button in Edit Note Modal | - | Confirmation Modal - Style 2 | Delete Note | Are you sure you want to delete the selected note? | Delete | Cancel | - |
| 10 | View Shutdown Timeline | Confirm Delete Note | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Note Successfully. | - | - | - |
| 11 | View Shutdown Timeline | Confirm Delete Note | Click Delete Button | Delete Fail | Toast - Fail | Delete Failed | Delete Note Failed. | - | - | - |
| 12 | Edit Shutdown Timeline | Save Plan | Click Save | Save Success | Toast - Success | Save Success | Save Shutdown Timeline Plan Successfully. | - | - | - |
| 13 | Edit Shutdown Timeline | Save Plan | Click Save | Save Fail | Toast - Fail | Save Failed | Save Shutdown Timeline Plan  Failed. | - | - | - |
| 14 | Edit Shutdown Timeline | Save Plan | Click Save | Progress has Been Updated | Confirmation Modal - Style 1 | Progress has Been Updated | The shutdown timeline has already been updated. This action will reload the page and update some data. | OK | - | - |
| 15 | Edit Shutdown Timeline | Leave Page | Click Back Button<br>or Change Page Using Side Menu | - | Confirmation Modal - Style 1 | Unsaved Change | Are you sure you want to leave this page? Changes you made will not be saved. | Continue Editing | Discard Change | - |
| 16 | Edit Shutdown Timeline | Change Shutdown Type | Select New Shutdown Type in Dropdown | - | Confirmation Modal - Style 1 | Change Shutdown Type? | Are you sure you want to change the shutdown type? This action will update some data. | Confirm | Cancel | - |

> ⚠️ ข้อสังเกตจากต้นฉบับ: แถว 13 ข้อความ "Save Shutdown Timeline Plan  Failed." มีช่องว่าง 2 ช่องระหว่าง "Plan" กับ "Failed" (คงไว้ตามต้นฉบับ อาจเป็น typo)

---

## 2. Update Progress (Field Validation)

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Activity | - | - | - | - | - | - | - | - | View Only |
| Action By | - | - | - | - | - | - | - | - | View Only |
| Focal Point | - | - | - | - | - | - | - | - | View Only |
| Start Date | - | - | - | - | - | - | - | - | View Only |
| End Date | - | - | - | - | - | - | - | - | View Only |
| Status | Dropdown | Yes | - Open (Default)<br>- Close | - | - | - | - | - | - |
| Total Plan Progress | - | - | - | - | - | - | - | - | View Only |
| Weekly Plan Progress | - | - | - | - | - | - | - | - | View Only |
| Total Actual Progress | Auto Field | Yes | - | - | Sum from Weekly Actual | - | - | - | View Only |
| Weekly Actual Progress | Free Text | No | - | [Float] 100 | - | - | - | - | - |

---

## 3. Add & Edit Note (Field Validation)

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Icon | Tile Selector | Yes | Refer to UI [Figma](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=197-420151&t=HDzzwhScXtruM5KV-4) | - | - | - | - | - | - |
| Color | Tile Selector | Yes | Refer to UI [Figma](https://www.figma.com/design/Sm4NuksQu4IWB4fYvwx97o/EMI---Turnaround--Shutdown-Timeline-?node-id=197-420151&t=HDzzwhScXtruM5KV-4) | - | - | - | - | - | - |
| Note | Free Text | No | - | [String] 50 | - | - | - | - | - |

---

## 4. Edit Shutdown Timeline Plan (Field Validation)

| Data/Field Name | Data Input Type | Required? | Data Options | Max Character | Auto-fill Condition | Validation | Error Style | Message | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Group Activity | Free Text | Yes | - | [String] 100 | - | - | - | - | - |
| Activity | Free Text | Yes | - | [String] 500 | - | - | - | - | - |
| Action By | Free Text | No | - | [String] 50 | - | - | - | - | - |
| Focal Point | Free Text | No | - | [String] 50 | - | - | - | - | - |
| Start Date | Date Picker | Yes | - | - | - | - | - | - | - |
| End Date | Date Picker | Yes | - | - | - | - | - | - | - |
| Status | - | - | - | - | - | - | - | - | View Only |
| Total Plan Progress | Free Text | Yes | - | [Float] 100 | - | - | - | - | - |
| Weekly Plan Progress | Auto Field | Yes | - | - | Divide from Total Plan Progress | - | - | - | - |
| Total Actual Progress | - | - | - | - | - | - | - | - | View Only |
| Weekly Actual Progress | - | - | - | - | - | - | - | - | View Only |

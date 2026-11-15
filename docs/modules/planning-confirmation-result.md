> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Team-provided spec file; texts are verbatim from the source, and any 'not checked on the real app' remark inside the file still applies.

# Planning – Confirmation & Result

**View UI in Figma:** [Figma Link](https://www.figma.com/design/DiPcr6PVSLRxsy1VJOebUB/Turnaround?node-id=52-6849&t=AFVE907soVGO28Kc-1)

## Page: View Planning Item

| Action | Trigger | Condition | Confirmation & Result Type | Title | Message 1 | Button 1 | Button 2 | Button 3 | Remark |
|---|---|---|---|---|---|---|---|---|---|
| Create Plan | Click Save Button in Create Plan Modal | Create Success | Toast - Success | Create Success | Create Plan Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Plan Failed |  |  |  |  |
| Duplicate Plan | Click Save Button in Create Plan Modal | Duplicate Success | Toast - Success | Duplicate Success | Duplicate Plan Successfully |  |  |  |  |
|  |  | Duplicate Fail | Toast - Fail | Duplicate Failed | Duplicate Plan Failed |  |  |  |  |
| Edit Plan | Click Edit Plan | Edit Success | Toast - Success | Edit Success | Edit Plan Successfully |  |  |  |  |
|  |  | Edit Fail | Toast - Fail | Edit Failed | Edit Plan Failed |  |  |  |  |
| Delete Plan | Click Delete Plan | Inactive Plan | Confirmation Modal - Style 2 | Delete Plan | Are you sure you want to delete the selected plan and all its sub-items? | Delete | Cancel |  |  |
|  |  | Active Plan | Confirmation Modal - Style 1 | Unable to Delete Plan | The active plan cannot be deleted. | OK |  |  |  |
| Confirm Delete Plan | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Plan Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Plan Failed |  |  |  |  |
|  |  | Plan Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Plan | The plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Plan | Click Toggle Active/Inactive Plan | Another Active Plan Detected | Confirmation Modal - Style 1 | Change Active Plan | Do you want to make plan '[Plan Name]' active and set plan '[Plan Name]' to inactive? | Confirm | Cancel |  |  |
|  |  | Plan Has Been Deleted | Confirmation Modal - Style 1 | Unable to Active Plan | The plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Inactive Plan | Click Toggle Active/Inactive Plan |  | Confirmation Modal - Style 1 | Inactive Plan | Inactive this plan will automatically inactive all items within the plan. Are you sure you want to continue? | Confirm | Cancel |  |  |
| Create Worklist | Click Create Button | Create Success | Toast - Success | Create Success | Create Worklist Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Worklist Failed |  |  |  |  |
|  |  | Worklist Has Been Created | Confirmation Modal - Style 1 | Unable to Create Worklist | The worklist has already been created. | OK |  |  |  |
| Delete Worklist | Click Delete Worklist | Inactive Worklist | Confirmation Modal - Style 2 | Delete Worklist | Are you sure you want to delete the selected worklist? | Delete | Cancel |  |  |
|  |  | Active Worklist | Confirmation Modal - Style 1 | Unable to Delete Worklist | The active worklist cannot be deleted. | OK |  |  |  |
| Confirm Delete Worklist | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Worklist Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Worklist Failed |  |  |  |  |
|  |  | Worklist Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Worklist | The worklist has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Worklist | Click Toggle Active/Inactive Worklist | Worklist Has Been Deleted | Confirmation Modal - Style 1 | Unable to Active Worklist | The worklist has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Create Shutdown Logic | Click Create Button | Create Success | Toast - Success | Create Success | Create Shutdown Logic Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Shutdown Logic Failed |  |  |  |  |
|  |  | Shutdown Logic Has Been Created | Confirmation Modal - Style 1 | Unable to Create Shutdown Logic | The shutdown logic has already been created. | OK |  |  |  |
| Delete Shutdown Logic | Click Delete Shutdown Logic | Inactive Shutdown Logic | Confirmation Modal - Style 2 | Delete Shutdown Logic | Are you sure you want to delete the selected shutdown logic? | Delete | Cancel |  |  |
|  |  | Active Shutdown Logic | Confirmation Modal - Style 1 | Unable to Delete Shutdown Logic | The active shutdown logic cannot be deleted. | OK |  |  |  |
| Confirm Delete Shutdown Logic | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Shutdown Logic Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Shutdown Logic Failed |  |  |  |  |
|  |  | Shutdown Logic Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Shutdown Logic | The shutdown logic has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Shutdown Logic | Click Toggle Active/Inactive Shutdown Logic | Shutdown Logic Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Shutdown Logic | The shutdown logic has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Create Manpower Mob Plan | Click Create Button | Create Success | Toast - Success | Create Success | Create Manpower Mob Plan Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Manpower Mob Plan Failed |  |  |  |  |
|  |  | Manpower Mob Plant Has Been Created | Confirmation Modal - Style 1 | Unable to Create Manpower Mob Plan | The manpower mob plan has already been created. | OK |  |  |  |
| Delete Manpower Mob Plan | Click Delete Manpower Mob Plan | Inactive Manpower Mob Plan | Confirmation Modal - Style 2 | Delete Manpower Mob Plan | Are you sure you want to delete the selected manpower mob plan? | Delete | Cancel |  |  |
|  |  | Active Manpower Mob Plan | Confirmation Modal - Style 1 | Unable to Delete Manpower Mob Plan | The active manpower mob plan cannot be deleted. | OK |  |  |  |
| Confirm Delete Manpower Mob Plan | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Manpower Mob Plan Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Manpower Mob Plant Failed |  |  |  |  |
|  |  | Manpower Mob Plan Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Manpower Mob Plan | The manpower mob plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Manpower Mob Plan | Click Toggle Active/Inactive Manpower Mob Plan | Manpower Mob Plant Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Manpower Mob Plan | The manpower mob plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Create Equipment Mob Plan | Click Create Button | Create Success | Toast - Success | Create Success | Create Equipment Mob Plan Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Equipment Mob Plan Failed |  |  |  |  |
|  |  | Equipment Mob Plant Has Been Created | Confirmation Modal - Style 1 | Unable to Create Equipment Mob Plan | The equipment mob plan has already been created. | OK |  |  |  |
| Delete Equipment Mob Plan | Click Delete Equipment Mob Plan | Inactive Equipment Mob Plan | Confirmation Modal - Style 2 | Delete Equipment Mob Plan | Are you sure you want to delete the selected equipment mob plan? | Delete | Cancel |  |  |
|  |  | Active Equipment Mob Plan | Confirmation Modal - Style 1 | Unable to Delete Equipment Mob Plan | The active equipment mob plan cannot be deleted. | OK |  |  |  |
| Confirm Delete Equipment Mob Plan | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Equipment Mob Plan Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Equipment Mob Plant Failed |  |  |  |  |
|  |  | Equipment Mob Plan Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Equipment Mob Plan | The equipment mob plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Equipment Mob Plan | Click Toggle Active/Inactive Equipment Mob Plan | Equipment Mob Plant Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Equipment Mob Plan | The equipment mob plan has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Create Daily Report | Click Create Button | Create Success | Toast - Success | Create Success | Create Daily Report Successfully |  |  |  |  |
|  |  | Create Fail | Toast - Fail | Create Failed | Create Daily Report Failed |  |  |  |  |
|  |  | Daily Report Has Been Created | Confirmation Modal - Style 1 | Unable to Create Daily Report | The daily report has already been created. | OK |  |  |  |
| Delete Daily Report | Click Delete Daily Report | Inactive Daily Report | Confirmation Modal - Style 2 | Delete Daily Report | Are you sure you want to delete the selected daily report? | Delete | Cancel |  |  |
|  |  | Active Daily Report | Confirmation Modal - Style 1 | Unable to Delete Daily Report | The active daily report cannot be deleted. | OK |  |  |  |
| Confirm Delete Daily Report | Click Delete Button | Delete Success | Toast - Success | Delete Success | Delete Daily Report Successfully |  |  |  |  |
|  |  | Delete Fail | Toast - Fail | Delete Failed | Delete Daily Report Failed |  |  |  |  |
|  |  | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Daily Report | The daily report has already been deleted. | OK |  |  | กด OK แล้ว Refresh |
| Active Daily Report | Click Toggle Active/Inactive Daily Report | Daily Report Has Been Deleted | Confirmation Modal - Style 1 | Unable to Delete Daily Report | The daily report has already been deleted. | OK |  |  | กด OK แล้ว Refresh |

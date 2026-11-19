# ETM-1111 Edit window - TC draft (fixture)

Source: Story AC. Priority: High 1, Medium 1, Low 1. Auto 2, Manual 1.

## Coverage map
- AC-1 (Save enabled after change) -> TC-001, TC-002
- AC-2 (Cancel closes without saving) -> TC-003
- Category "Permission": not relevant, the Story has one role only.

## Test cases (3 flows)

### TC-001 [FE][MT] Verify Save stays disabled until a field changes (POS) [Auto]
Precondition: open the Edit window of any row.
Priority: High
Trace: AC-1
1. Look at the Save button. -> Save is greyed out.
2. Type `A` in the Name field. -> Save turns blue and can be clicked.

### TC-002 [FE][MT] Verify Save turns off again when the change is undone (NEG) [Auto]
Precondition: open the Edit window of any row.
Priority: Medium
Trace: AC-1
1. Type `A` in the Name field. -> Save turns blue.
2. Delete the `A`. -> Save is greyed out again.

### TC-003 [FE][MT] Verify Cancel closes the window and keeps the old value (POS) [Manual: needs a person to judge the pop-up wording]
Precondition: open the Edit window of any row.
Priority: Low
Trace: AC-2
1. Type `A` in the Name field. -> The field shows `A`.
2. Click Cancel. -> The window closes and a pop-up asks `Discard changes?`.

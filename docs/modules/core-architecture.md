# Core - system architecture (hierarchy, roles, worklist, gantt engine, constraint, calendar, manpower)

Part of the ETM UI map (index: `docs/UI_Map_ETM.md`). Text below is moved verbatim from the old single file; keep the rule there: every fact has a check date, never guess, update here BEFORE writing test cases.

## System Architecture

### Hierarchy
Level 1: Platform → Level 2: Work Header → Level 3: Work → Level 4: Breakdown Task

### Roles
- **Turnaround Manager**: Full access (edit, create, delete, change status)
- **Job Owner**: Limited access (view only in most cases; cannot change Work/Breakdown status, Copy to, or edit Constraint Date)

### Worklist
- **Worklist Status**: Initial / Collecting / Freeze
- **Active Status**: Active / Inactive — only 1 Worklist can be Active at a time
- **1 Worklist : 1 Shutdown Logic** (1:1 relationship)
- Shutdown Logic can only be Active if its Worklist is also Active

### Gantt Engine
- **Bryntum Gantt**: auto-repositions bars based on constraints and dependencies
- **Dependency Types**: FS (Finish-to-Start), SS, FF, SF
- **Dependency Priority**: Soft / Normal / Hard (Hard = bar cannot be dragged manually)
- **FCFS Rule**: First-Come, First-Served — existing saved constraints/dependencies take priority over new inputs

### Constraint Date (ETM-2616)
- Located in **Advanced tab** (last tab, after Successor) in all 3 Setting modals (Lv.2, Lv.3, Lv.4)
- Fields: Constraint Type (7 options + None) and Constraint Date (Date + Time; minutes: 00/15/30/45 only)
- Constraint Date field is disabled when Type = None; auto-clears when Type reverts to None

### Working Calendar (ETM-2698 / ETM-3059)
- Located in **Advanced tab**, but only visible for **Level 4 (Breakdown Task)** — other levels only see Constraint Date section
- 3 radio options: Resource Calendar / Custom Calendar / Manual Adjust
- **Resource Calendar**: uses shifts from assigned Manpower Resources; multi-select dropdown auto-populated
- **Custom Calendar**: weekly grid (7 days), time intervals, preset options (ETM-3059)

### Manpower Resource
- **Shutdown Logic page — bottom section**: Manpower Resource table with columns: Resource Name, Shift, Capacity + Histogram
  - Double-click Resource name to rename (uses Organic Crew name → auto-fills Shift + Capacity; new name → Default / 1); sorts A-Z immediately on lost focus / Enter
  - Double-click Shift → dropdown from Working Schedule
  - Double-click Capacity → edit number
  - Changes here do NOT affect master Manpower Resource tab data
  - Right-click → Add Resource (no effect on tasks) / Delete Resource (removes from linked tasks; if task had only that resource → cell turns red; bar loses resource label) / Edit name (propagates to linked tasks)
  - Yellow Capacity cell = capacity insufficient → tooltip shows required amount → Optimize will fail if not fixed
- **Edit Working Schedule** (master data): Manpower Resource tab → "Edit Working Schedule" button → Edit Working Schedule page

### Add/Remove Resource to a Task
1. **Worklist**: View Work Details → Edit Breakdown → Edit Work Breakdown page → Manpower Resource column or "Setting Resource" button (modal; Qty 1–99; can add new resource not in master)
2. **Shutdown Logic Gantt table**: Manpower Resource column (inline) or ≡ button → Breakdown Setting Modal → Manpower Resource tab
3. **Shutdown Logic Histogram**: right-click → Add / Delete Resource

---

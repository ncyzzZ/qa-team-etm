> Part of the ETM module knowledge (index: `docs/UI_Map_ETM.md`). Provided by the team as the validated spec; texts are verbatim from the source workbook/document, so use them as Expected Results without rewording.

# Shutdown Timeline Default Plan

Source: `Shutdown Timeline Default Plan.xlsx` (2 sheets: **Initial Timeline**, **Shutdown Date**)
Exported from the workbook on 2026-11-05. All values below were read directly from the cells (displayed values + formulas).

---

## 1. Sheet "Shutdown Date" (inputs)

| Cell | Field | Value | Serial | Named range |
|---|---|---|---|---|
| B1 | Ramp Down Date | 18 Jun 2025 | 45826 | `ramp_down` |
| B2 | Ramp Up Date | 10 Jul 2025 | 45848 | `ramp_up` |

- Every Start date in **Initial Timeline** is derived (directly or via chain) from `ramp_down`.
- `ramp_up` is **not referenced by any formula** in the workbook.

---

## 2. Sheet "Initial Timeline" — structure

| Column | Header | Content |
|---|---|---|
| A | ID | GUID of the row |
| B | Type | `Group` (section header) or `Activity` |
| C | Activity | Activity name |
| D | Action By | Who performs it |
| E | Focal Point | Responsible focal point |
| F | Plan (%) | Weight of the activity (sum = 100%) |
| G / H / I | Major SD | Duration (days) / Start / Finish |
| J / K / L | Medium SD | Duration (days) / Start / Finish |
| M / N / O | Minor SD | Duration (days) / Start / Finish |

Row 1 = headers, Row 2 = SD category definitions, Rows 3–30 = data (5 Group rows, 23 Activity rows).

### SD category definitions (row 2)

| Category | Definition |
|---|---|
| **Major SD** | >2% Impact to Annual Prod.; TPSD >10 days or Train SD >20 days |
| **Medium SD** | 0.3–2% Impact to Annual Prod.; TPSD 6–10 days or Train SD 12–20 days |
| **Minor SD** | <0.3% Impact to Annual Prod.; TPSD < 6 days or 1 train (Partial) < 12 days |

### Calculation rules (same for all three categories)

- **Duration** = hard-coded number of days (displayed as `N day`), or the text `Optional`.
- **Start** = `=IF(Duration="Optional","Optional", <start rule>)` — the start rule is listed per row in section 4.
- **Finish** = `=IFERROR(Start + Duration, "Optional")`
- Dates are displayed in format `dd mmm yyyy`.
- Group rows (3, 7, 14, 21, 28) have no Action By / Focal Point / Plan % / dates.

---

## 3. Activity master list

| Row | ID | Type | Activity | Action By | Focal Point | Plan (%) |
|---|---|---|---|---|---|---|
| 3 | 0feb7ff0-08b7-4490-9e62-5c22fede7f29 | Group | **Phase 1 : Initiation** |  |  |  |
| 4 | a03fc32d-7067-4345-9b8b-23af8583ef29 | Activity | Conduct Kick off meeting and Plan for Routine SD Meeting (S/D Preparation Plan, Initial Worklist) | Meeting | PFO1/O, EMX | 6.0% |
| 5 | 85db2bbc-6517-4aff-9b12-a54672f872de | Activity | Prelim SD Schedule (ramp up/ramp down date) & Production Profile Update | Meeting | Offshore, Job Owners | 2.0% |
| 6 | a9143e23-8cfe-4830-9b79-646f0c08979a | Activity | Identify Turnaround Organization for Roles and Responsibilities & List of Stakeholders | TA | Key stakeholders and Job Owners | 2.0% |
| 7 | 44fe5a8b-ebf3-441a-9d41-03c26dd59a09 | Group | **Phase 2 : Planning** |  |  |  |
| 8 | e55bc0db-c49a-493d-bb38-e36ef549de70 | Activity | Gathering of all SD work lists & details (Work Order, PR/PO, SoW, Drawings, etc.) | All | Job Owners | 15.0% |
| 9 | cdab31e3-3d1a-442e-b739-ee0cae7b3aaa | Activity | Material Management<br>- Long Lead Materials Identification & Special resources<br>- Reserve material, stock item (under Unloading Point "Priority - 3")<br>- Prepare material, service, procurement process (PR/PO) and awarded contractor, vendor<br>- Material Delivery Tracking | All | Job Owners | 5.0% |
| 10 | a7466e6b-25ab-4883-837e-1438bc7fd585 | Activity | High level POB estimation (e.g. additional accommodation barge/vessel requirement) | All | Job Owners | 2.0% |
| 11 | c7048918-3f19-4504-8c39-c3a1a2829651 | Activity | Lesson Learnt Review (from the previous S/D) with all parties | All | Offshore, Job Owners | 3.0% |
| 12 | 194ebb2d-8840-4055-9fbf-20f10a2f2fbb | Activity | SSHE Plan, High Level Risk Assessment & Mitigation | Offshore, T/A | SSHE Supv, T/A | 3.0% |
| 13 | 09f74cb7-d412-44df-bb2a-a809d37e545c | Activity | Frozen Work Lists | TA | TA | 2.0% |
| 14 | 0e841a45-ff3d-4264-9e7e-14e1aec6eda2 | Group | **Detail Work Preparation** |  |  |  |
| 15 | d0896553-9c66-4d56-9117-c9b02a0208ea | Activity | - Breakdown activities, Work pack, drawing and relevant document | All | Job Owners | 5.0% |
| 16 | 85100e7d-f8ab-4374-b45b-1661cc73b65a | Activity | - Markup Plot Plan for working location and equipment laydown | All | Job Owners | 5.0% |
| 17 | a7642f82-3347-4d27-9841-36c8edad35fa | Activity | - Estimate Manpower and POB Planning | All | Job Owners | 5.0% |
| 18 | 27c180b0-b015-4095-bc17-07e0ef6cfb9b | Activity | Estimate N2 consumption | Offshore | Production | 2.0% |
| 19 | 1ed8113c-969e-4d63-8954-f804794c3eb1 | Activity | S/D Milestone Schedule (High-level relationship across each SD preparation activities) | T/A | T/A | 2.0% |
| 20 | 90004914-368d-452b-9e39-24693ea42028 | Activity | Schedule Optimization Review (Lean sigma workshop) | Workshop | Offshore, Job Owners | 5.0% |
| 21 | aa78f2c2-62f0-46aa-a5c1-33e2aec6d662 | Group | **Final Execution Preparation** |  |  |  |
| 22 | efa077a0-55ba-44f4-9e8c-ad254dae1213 | Activity | - POB Management Plan/Mob-DeMob Plan for Material and Manpower/Deck Layout Plan for work location and Equipment Laydown | T/A | Logistic Supv, Job Owners | 3.0% |
| 23 | da004454-7cd2-4e91-b5c0-47c38175df16 | Activity | - Detailed Isolation Plan, Lifting Plan | All | Job Owners | 3.0% |
| 24 | a046266c-6384-4974-a654-5da1aa1eec7f | Activity | - Final S/D work sequence (S/D logic) | All | Job Owners | 5.0% |
| 25 | c32fa9d7-c578-408e-84b6-752340d2e3ab | Activity | Special Turnaround Preparation ie. Scaffolding/Additional Lighting / Radio / Rental generator | All | Job Owners | 5.0% |
| 26 | 67a28167-9abb-4a7a-befc-260beff4ffd5 | Activity | Equipment pre-mob inspection submitted to SKL and reservation for Mobilization | All | Job Owners | 5.0% |
| 27 | 3f7c443e-94e4-49c7-bb89-7a8966b9b8be | Activity | Peer Review and Work Readiness Review | All | Job Owners | 5.0% |
| 28 | 46fbace0-bdac-4288-922b-fe92f96bbd22 | Group | **Phase 3 : Execution** |  |  |  |
| 29 | e0a627ee-8112-4a57-b74b-a1cc4d16cf95 | Activity | PTW, JSA and IHE Review and submission | Offshore | SSHE Supv | 5.0% |
| 30 | e5db1b87-949a-4e4e-83b8-64edd27e7730 | Activity | Safety Stand-up Meeting / Emergency Response Plan and Drill | Safety Drill | SSHE Supv | 5.0% |

**Plan (%) total = 100%** (Phase 1 = 10%, Phase 2 = 30%, Detail Work Preparation = 24%, Final Execution Preparation = 26%, Phase 3 = 10%).

Note: Rows 15–20 are listed under the "Detail Work Preparation" group in the sheet (rows 18–20 have no leading "-").

---

## 4. Timeline per SD category

`Start rule` notation: `ramp_down − N` = N days before Ramp Down Date; `Start(Rx)` / `Finish(Rx)` = Start / Finish of row x in the same category.

### 4.1 Major SD (columns G / H / I)

| Row | Activity | Duration (days) | Start | Finish | Start rule |
|---|---|---|---|---|---|
| 3 | **Phase 1 : Initiation** | | | | |
| 4 | Conduct Kick off meeting and Plan for Routine SD Meeting | 21 | 18 Jun 2024 | 09 Jul 2024 | ramp_down − 365 |
| 5 | Prelim SD Schedule & Production Profile Update | 7 | 25 Jun 2024 | 02 Jul 2024 | Start(R4) + 7 |
| 6 | Identify Turnaround Organization & List of Stakeholders | 7 | 25 Jun 2024 | 02 Jul 2024 | Start(R4) + 7 |
| 7 | **Phase 2 : Planning** | | | | |
| 8 | Gathering of all SD work lists & details | 240 | 09 Jul 2024 | 06 Mar 2025 | Finish(R4) |
| 9 | Material Management | 300 | 09 Jul 2024 | 05 May 2025 | Finish(R4) |
| 10 | High level POB estimation | 56 | 07 Sep 2024 | 02 Nov 2024 | Start(R8) + 60 |
| 11 | Lesson Learnt Review | 28 | 06 Dec 2024 | 03 Jan 2025 | Start(R8) + 150 |
| 12 | SSHE Plan, High Level Risk Assessment & Mitigation | 56 | 06 Dec 2024 | 31 Jan 2025 | Start(R8) + 150 |
| 13 | Frozen Work Lists | 14 | 27 Feb 2025 | 13 Mar 2025 | ramp_down − 111 |
| 14 | **Detail Work Preparation** | | | | |
| 15 | - Breakdown activities, Work pack, drawing and relevant document | 84 | 06 Dec 2024 | 28 Feb 2025 | Start(R11) |
| 16 | - Markup Plot Plan for working location and equipment laydown | 84 | 06 Dec 2024 | 28 Feb 2025 | Start(R11) |
| 17 | - Estimate Manpower and POB Planning | 84 | 06 Dec 2024 | 28 Feb 2025 | Start(R11) |
| 18 | Estimate N2 consumption | 28 | 05 Jan 2025 | 02 Feb 2025 | Start(R15) + 30 |
| 19 | S/D Milestone Schedule | 35 | 04 Feb 2025 | 11 Mar 2025 | Start(R18) + 30 |
| 20 | Schedule Optimization Review (Lean sigma workshop) | 14 | 20 Mar 2025 | 03 Apr 2025 | ramp_down − 90 |
| 21 | **Final Execution Preparation** | | | | |
| 22 | - POB Management Plan/Mob-DeMob Plan/Deck Layout Plan | 35 | 03 Apr 2025 | 08 May 2025 | Finish(R20) |
| 23 | - Detailed Isolation Plan, Lifting Plan | 14 | 03 Apr 2025 | 17 Apr 2025 | Finish(R20) |
| 24 | - Final S/D work sequence (S/D logic) | 28 | 10 Apr 2025 | 08 May 2025 | Finish(R20) + 7 |
| 25 | Special Turnaround Preparation | 56 | 10 Apr 2025 | 05 Jun 2025 | Finish(R20) + 7 |
| 26 | Equipment pre-mob inspection & reservation for Mobilization | 28 | 10 Apr 2025 | 08 May 2025 | Finish(R20) + 7 |
| 27 | Peer Review and Work Readiness Review | 35 | 08 May 2025 | 12 Jun 2025 | Finish(R26) |
| 28 | **Phase 3 : Execution** | | | | |
| 29 | PTW, JSA and IHE Review and submission | 35 | 08 May 2025 | 12 Jun 2025 | Finish(R24) |
| 30 | Safety Stand-up Meeting / Emergency Response Plan and Drill | 7 | 11 Jun 2025 | 18 Jun 2025 | ramp_down − 7 |

### 4.2 Medium SD (columns J / K / L)

| Row | Activity | Duration (days) | Start | Finish | Start rule |
|---|---|---|---|---|---|
| 3 | **Phase 1 : Initiation** | | | | |
| 4 | Conduct Kick off meeting and Plan for Routine SD Meeting | 14 | 21 Oct 2024 | 04 Nov 2024 | ramp_down − 240 |
| 5 | Prelim SD Schedule & Production Profile Update | 7 | 28 Oct 2024 | 04 Nov 2024 | Start(R4) + 7 |
| 6 | Identify Turnaround Organization & List of Stakeholders | 7 | 28 Oct 2024 | 04 Nov 2024 | Start(R4) + 7 |
| 7 | **Phase 2 : Planning** | | | | |
| 8 | Gathering of all SD work lists & details | 150 | 04 Nov 2024 | 03 Apr 2025 | Finish(R4) |
| 9 | Material Management | 210 | 04 Nov 2024 | 02 Jun 2025 | Finish(R4) |
| 10 | High level POB estimation | 30 | 03 Jan 2025 | 02 Feb 2025 | Start(R8) + 60 |
| 11 | Lesson Learnt Review | 21 | 02 Feb 2025 | 23 Feb 2025 | Start(R8) + 90 |
| 12 | SSHE Plan, High Level Risk Assessment & Mitigation | 30 | 02 Feb 2025 | 04 Mar 2025 | Start(R8) + 90 |
| 13 | Frozen Work Lists | 7 | 02 Apr 2025 | 09 Apr 2025 | ramp_down − 77 |
| 14 | **Detail Work Preparation** | | | | |
| 15 | - Breakdown activities, Work pack, drawing and relevant document | 56 | 02 Feb 2025 | 30 Mar 2025 | Start(R11) |
| 16 | - Markup Plot Plan for working location and equipment laydown | 56 | 02 Feb 2025 | 30 Mar 2025 | Start(R11) |
| 17 | - Estimate Manpower and POB Planning | 56 | 02 Feb 2025 | 30 Mar 2025 | Start(R11) |
| 18 | Estimate N2 consumption | 21 | 04 Mar 2025 | 25 Mar 2025 | Start(R15) + 30 |
| 19 | S/D Milestone Schedule | 28 | 03 Apr 2025 | 01 May 2025 | Start(R18) + 30 |
| 20 | Schedule Optimization Review (Lean sigma workshop) | 7 | 19 Apr 2025 | 26 Apr 2025 | ramp_down − 60 |
| 21 | **Final Execution Preparation** | | | | |
| 22 | - POB Management Plan/Mob-DeMob Plan/Deck Layout Plan | 21 | 26 Apr 2025 | 17 May 2025 | Finish(R20) |
| 23 | - Detailed Isolation Plan, Lifting Plan | 14 | 26 Apr 2025 | 10 May 2025 | Finish(R20) |
| 24 | - Final S/D work sequence (S/D logic) | 14 | 03 May 2025 | 17 May 2025 | Finish(R20) + 7 |
| 25 | Special Turnaround Preparation | 30 | 03 May 2025 | 02 Jun 2025 | Finish(R20) + 7 |
| 26 | Equipment pre-mob inspection & reservation for Mobilization | 21 | 03 May 2025 | 24 May 2025 | Finish(R20) + 7 |
| 27 | Peer Review and Work Readiness Review | 21 | 17 May 2025 | 07 Jun 2025 | Finish(R24) |
| 28 | **Phase 3 : Execution** | | | | |
| 29 | PTW, JSA and IHE Review and submission | 21 | 17 May 2025 | 07 Jun 2025 | Finish(R24) |
| 30 | Safety Stand-up Meeting / Emergency Response Plan and Drill | 7 | 11 Jun 2025 | 18 Jun 2025 | ramp_down − 7 |

### 4.3 Minor SD (columns M / N / O)

| Row | Activity | Duration (days) | Start | Finish | Start rule |
|---|---|---|---|---|---|
| 3 | **Phase 1 : Initiation** | | | | |
| 4 | Conduct Kick off meeting and Plan for Routine SD Meeting | 14 | 19 Jan 2025 | 02 Feb 2025 | ramp_down − 150 |
| 5 | Prelim SD Schedule & Production Profile Update | 7 | 26 Jan 2025 | 02 Feb 2025 | Start(R4) + 7 |
| 6 | Identify Turnaround Organization & List of Stakeholders | 7 | 26 Jan 2025 | 02 Feb 2025 | Start(R4) + 7 |
| 7 | **Phase 2 : Planning** | | | | |
| 8 | Gathering of all SD work lists & details | 90 | 02 Feb 2025 | 03 May 2025 | Finish(R4) |
| 9 | Material Management | 120 | 02 Feb 2025 | 02 Jun 2025 | Finish(R4) |
| 10 | High level POB estimation | Optional | Optional | Optional | (Start(R8) + 60) |
| 11 | Lesson Learnt Review | Optional | Optional | Optional | (Start(R8) + 150) |
| 12 | SSHE Plan, High Level Risk Assessment & Mitigation | Optional | Optional | Optional | (Start(R8) + 150) |
| 13 | Frozen Work Lists | 7 | 19 Apr 2025 | 26 Apr 2025 | ramp_down − 60 |
| 14 | **Detail Work Preparation** | | | | |
| 15 | - Breakdown activities, Work pack, drawing and relevant document | Optional | Optional | Optional | (Start(R11)) |
| 16 | - Markup Plot Plan for working location and equipment laydown | Optional | Optional | Optional | (Start(R11)) |
| 17 | - Estimate Manpower and POB Planning | Optional | Optional | Optional | (Start(R11)) |
| 18 | Estimate N2 consumption | Optional | Optional | Optional | (Start(R15) + 30) |
| 19 | S/D Milestone Schedule | 14 | 26 Apr 2025 | 10 May 2025 | Finish(R13) |
| 20 | Schedule Optimization Review (Lean sigma workshop) | Optional | Optional | Optional | (ramp_down − 70) |
| 21 | **Final Execution Preparation** | | | | |
| 22 | - POB Management Plan/Mob-DeMob Plan/Deck Layout Plan | 14 | 10 May 2025 | 24 May 2025 | Finish(R19) |
| 23 | - Detailed Isolation Plan, Lifting Plan | 7 | 10 May 2025 | 17 May 2025 | Finish(R19) |
| 24 | - Final S/D work sequence (S/D logic) | Optional | Optional | Optional | (Finish(R20) − 7) |
| 25 | Special Turnaround Preparation | Optional | Optional | Optional | (Finish(R20) − 7) |
| 26 | Equipment pre-mob inspection & reservation for Mobilization | 14 | 17 May 2025 | 31 May 2025 | Finish(R19) + 7 |
| 27 | Peer Review and Work Readiness Review | 14 | 24 May 2025 | 07 Jun 2025 | Start(R26) + 7 |
| 28 | **Phase 3 : Execution** | | | | |
| 29 | PTW, JSA and IHE Review and submission | 14 | 31 May 2025 | 14 Jun 2025 | Finish(R26) |
| 30 | Safety Stand-up Meeting / Emergency Response Plan and Drill | Optional | Optional | Optional | (ramp_down − 7) |

Rules in parentheses are the formulas present in the cell but not used, because Duration = `Optional` (the cell shows `Optional`).

---

## 5. Observations

1. **Minor SD rows 24–25**: start rule is `Finish(R20) − 7` (`O20-7`), but R20 is `Optional` in Minor. If R24/R25 are ever given a duration, Start will still show `Optional` unless R20 also has a duration. Major/Medium use `Finish(R20) + 7` instead.
2. **Minor SD rows 11–12**: start rule `Start(R8) + 150` (same offset as Major); Medium uses `+ 90`. Currently `Optional`, so no effect.
3. **Minor SD row 20**: start rule `ramp_down − 70`, while Medium uses `− 60` and Major `− 90`. Currently `Optional`.
4. **Medium row 27** starts at `Finish(R24)`, whereas Major row 27 starts at `Finish(R26)` (both give consistent dates in the current data).
5. **Ramp Up Date** (10 Jul 2025) is not used in any calculation.
6. Spelling corrected in both the workbook and this file: "Responsibilities" (C6), "stakeholders" (E6), "procurement" (C9), "Emergency Response Plan" (C30).
7. The workbook contains a broken leftover defined name `_xlfn.IFERROR` (`=#NAME?`); it does not affect any cell result.

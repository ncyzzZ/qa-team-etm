# ETM-8394: Xray step fixes for the AC update of 23 Nov 2026 (PROPOSAL, nothing written)

Needs the user's yes (`team.mjs ask --approve`).
- Current steps are saved in `work/ETM-8394/xray-steps-before-2026-11-24.json`.
- The full target steps are in `xray-steps-proposed.json`.
- Changing a step's text keeps its step id, so evidence pictures do not move.
- ETM-8768 grows from 4 to 9 steps. No other Test changes its step count.

**Why:**
- New AC 4: `Work Status` and `Breakdown Status` belong to the Work row. There is one Breakdown Status per Work (QA DB `shutdown_work.sdw_breakdown_status`, template `Examples` sheet).
- Values typed on breakdown rows are ignored without a message.
- New AC 1.3, AC 3.3.1-3.3.3 and AC 3.4 (every row) also need steps.

**Waits on BA round 3** (assumptions in `ba-answers.md`):
- R3-2: TC-019;
- R3-3: ETM-8766 steps 2-3;
- R3-4: TC-017;
- R3-5: TC-018.

## Changed steps of existing Tests

### ETM-8735 (9 steps)
- **Step 1**
  - Action: ~~Build an import file with Action `Add`, UUID blank, Work Header `Header Alpha`: six Works `W-8394-A1` to `W-8394-A6` with the Work Status of table 1, each with one breakdown (Action `Add`) with the Breakdown Status of table 1.~~ → Build an import file with Action `Add`, UUID blank, Work Header `Header Alpha`: six Works `W-8394-A1` to `W-8394-A6`, each with one breakdown (Action `Add`). Type the Work Status and Breakdown Status of table 1 on the Work row; leave both status cells blank on the breakdown rows.
- **Step 2**
  - Action: ~~Add Work `W-8394-B1` with Work Status blank and three breakdown rows (Action `Add`) with Breakdown Status `Breakdown Updated`, `Breakdown Reviewed`, `Breakdown Required`.~~ → Add Work `W-8394-B1` with both status cells blank on its Work row, and three breakdown rows (Action `Add`) with statuses typed on the breakdown rows: `Ready` / `Breakdown Reviewed`, blank / `Breakdown Required`, `Reviewed` / `Breakdown Reviewed`.
- **Step 4**
  - Expected: ~~The preview grid shows sixteen rows with no error and no banner, and `Confirm` is enabled.~~ → The preview grid shows sixteen rows with no error, no message about the breakdown-row statuses and no banner, and `Confirm` is enabled.
- **Step 7**
  - Action: ~~Read the Breakdown Status of the breakdown of each of those Works.~~ → Read the Breakdown Status of each of those Works.
  - Expected: ~~Each shows the Breakdown Status of table 1.~~ → Each shows the Breakdown Status of table 1.
- **Step 8**
  - Action: ~~Open `W-8394-B1` and read its three breakdowns.~~ → Open `W-8394-B1` and read its Breakdown Status and its breakdowns.
  - Expected: ~~The Breakdown Status values are `Breakdown Updated`, `Breakdown Reviewed` and `Breakdown Required`, in the order of the file.~~ → `W-8394-B1` has three breakdowns and its Breakdown Status is `Breakdown Updated` (default): the values typed on the breakdown rows were ignored.

### ETM-8742 (5 steps)
- **Step 1**
  - Action: ~~Build an import file with three Works (Action `Add`, each with one breakdown, Action `Add`) with the status cells of table 2.~~ → Build an import file with three Works (Action `Add`, each with one breakdown, Action `Add`). Type the status cells of table 2 on the Work row; leave the breakdown rows' status cells blank.
- **Step 5**
  - Action: ~~Read the Breakdown Status of the three breakdowns.~~ → Read the Breakdown Status of the three Works.
  - Expected: ~~Each shows the Breakdown Status expected of table 2.~~ → Each shows the Breakdown Status expected of table 2.

### ETM-8744 (13 steps)
- **Step 1**
  - Action: ~~Build an import file with Work `W-8394-E1` (Action `Add`, Work Status `Ready`) with one breakdown (Action `Add`, Breakdown Status `Breakdown Reviewed`) and Work `W-8394-E2` (Work Status `Reviewed`) with one breakdown (Breakdown Status `Breakdown Required`).~~ → Build an import file with Work `W-8394-E1` (Action `Add`, Work Status `Ready`, Breakdown Status `Breakdown Reviewed` on the Work row) with one breakdown (Action `Add`), and Work `W-8394-E2` (Work Status `Reviewed`, Breakdown Status `Breakdown Required`) with one breakdown.
  - Expected: ~~The file is saved with four rows, all status cells filled.~~ → The file is saved with four rows; both status cells are filled on each Work row.
- **Step 5**
  - Action: ~~Read the Breakdown Status of both breakdowns.~~ → Read the Breakdown Status of `W-8394-E1` and `W-8394-E2`.
- **Step 6**
  - Action: ~~Build a second file that adds `W-8394-AE1` (Work Status `Deleted`) with one breakdown (Breakdown Status `Approved`) and `W-8394-AE2` (Work Status `Breakdown Required`) with one breakdown (Breakdown Status `Ready`).~~ → Build a second file that adds `W-8394-AE1` (Work Status `Deleted`, Breakdown Status `Approved` on the Work row) and `W-8394-AE2` (Work Status `Breakdown Required`, Breakdown Status `Ready`), each with one breakdown.
- **Step 9**
  - Action: ~~Read the statuses of `W-8394-AE1`, `W-8394-AE2` and their breakdowns.~~ → Read the Work Status and Breakdown Status of `W-8394-AE1` and `W-8394-AE2`.
  - Expected: ~~Both Works are `New` and both breakdowns are `Breakdown Updated`.~~ → Both Works are `New` and `Breakdown Updated`.
- **Step 10**
  - Action: ~~Build a third file with one Work row `W-8394-AE3` with the Action cell blank and Work Status `Approved`, and one breakdown row (Action `Add`) with Breakdown Status `Deleted`.~~ → Build a third file with one Work row `W-8394-AE3` with the Action cell blank, Work Status `Approved` and Breakdown Status `Deleted`, and one breakdown row (Action `Add`).

### ETM-8745 (16 steps)
- **Step 5**
  - Action: ~~Enter Breakdown Status `Breakdown Required` on its breakdown row.~~ → Enter Breakdown Status `Breakdown Required` on the Work row of `W-8394-F1`.
- **Step 9**
  - Action: ~~Read the statuses of `W-8394-F1` and its breakdown.~~ → Read the Work Status and Breakdown Status of `W-8394-F1`.
- **Step 10**
  - Action: ~~Read the statuses of `W-8394-F2` and its breakdown.~~ → Read the Work Status and Breakdown Status of `W-8394-F2`.
- **Step 11**
  - Action: ~~Build a second file with Action `Revise` rows for `W-8394-G1` and its breakdown, one changed `Work Header`, Work Status `Deleted` and Breakdown Status `Approved`.~~ → Build a second file with Action `Revise` rows for `W-8394-G1` and its breakdown, one changed `Work Header`, Work Status `Deleted` and Breakdown Status `Approved` on the Work row.
- **Step 13**
  - Action: ~~Change Work Status to `Breakdown Required` and Breakdown Status to `Ready` in the file.~~ → Change Work Status to `Breakdown Required` and Breakdown Status to `Ready` on the Work row of `W-8394-G1`.
- **Step 16**
  - Action: ~~Read the statuses of `W-8394-G1` and its breakdown.~~ → Read the Work Status and Breakdown Status of `W-8394-G1`.

### ETM-8746 (8 steps)
- **Step 1**
  - Action: ~~Export the Worklist and build an import file with Action `Revise`, the UUIDs of the six Works, their breakdowns, `W-8394-J1` and its three breakdowns, all data values copied unchanged.~~ → Export the Worklist and build an import file with Action `Revise`, the UUIDs of the six Works, their breakdowns, `W-8394-J1` and its three breakdowns, all data values copied unchanged.
  - Expected: ~~The file is saved with twenty rows.~~ → The file is saved with sixteen rows.
- **Step 3**
  - Action: ~~Enter Breakdown Status `Breakdown Required`, `Breakdown Updated`, `Breakdown Reviewed` on the three breakdown rows of `W-8394-J1` in order, leave its Work Status blank.~~ → Enter Breakdown Status `Breakdown Required` on the Work row of `W-8394-J1` and leave its Work Status blank.
  - Expected: ~~The Breakdown Status cells are filled.~~ → The Breakdown Status cell of `W-8394-J1` is filled.
- **Step 4**
  - Expected: ~~The preview grid shows twenty rows with no error and `Confirm` is enabled.~~ → The preview grid shows sixteen rows with no error and `Confirm` is enabled.
- **Step 7**
  - Action: ~~Read the breakdowns of `W-8394-H1` to `W-8394-H6`.~~ → Read the Breakdown Status of `W-8394-H1` to `W-8394-H6`.
- **Step 8**
  - Action: ~~Read the three Breakdown Status values of `W-8394-J1`.~~ → Read the Work Status and Breakdown Status of `W-8394-J1`.
  - Expected: ~~They show `Breakdown Required`, `Breakdown Updated`, `Breakdown Reviewed` in order.~~ → Breakdown Status is `Breakdown Required`; Work Status stays `New`.

### ETM-8747 (12 steps)
- **Step 1**
  - Action: ~~Export the Worklist and build an import file with Action `Revise` for `W-8394-L1` to `W-8394-L6`, `W-8394-P1`, `W-8394-P2`, `W-8394-M1` and their breakdowns (for `W-8394-M1` only `M1-1` to `M1-4`), all status cells blank.~~ → Export the Worklist and build an import file with Action `Revise` for `W-8394-L1` to `W-8394-L6`, `W-8394-P1` to `W-8394-P3`, `W-8394-M1` and their breakdowns (for `W-8394-M1` only `M1-1` to `M1-4`), all status cells blank.
  - Expected: ~~The file is saved with twenty-one rows.~~ → The file is saved with twenty-three rows.
- **Step 4**
  - Action: ~~Keep the `W-8394-P2` Work row unchanged and change one value on its breakdown row.~~ → Keep the `W-8394-P2` and `W-8394-P3` Work rows unchanged and change one value on each of their breakdown rows.
  - Expected: ~~One breakdown value differs on `W-8394-P2`.~~ → One breakdown value differs on `W-8394-P2` and one on `W-8394-P3`.
- **Step 7**
  - Expected: ~~The file holds twenty-two rows.~~ → The file holds twenty-four rows.
- **Step 8**
  - Expected: ~~The preview grid shows twenty-two rows with no error and `Confirm` is enabled.~~ → The preview grid shows twenty-four rows with no error and `Confirm` is enabled.
- **Step 10**
  - Action: ~~Read the Work Status of `W-8394-L1` to `W-8394-L6`, `W-8394-P1` and `W-8394-P2`.~~ → Read the Work Status of `W-8394-L1` to `W-8394-L6`, `W-8394-P1` to `W-8394-P3` and `W-8394-M1`.
  - Data: → Table 6a (Work Status) / | Work | Current | Expected | / | W-8394-L1 | New | New | / | W-8394-L2 | Reviewed | Updated | / | W-8394-L3 | Updated | Updated | / | W-8394-L4 | Change Requested | Change Requested | / | W-8394-L5 | Information Required | Updated | / | W-8394-L6 | Ready | Ready | / | W-8394-P1 | Reviewed | Updated | / | W-8394-P2 | Reviewed | Reviewed | / | W-8394-P3 | Reviewed | Reviewed | / | W-8394-M1 | Reviewed | Reviewed |
- **Step 11**
  - Action: ~~Read the Breakdown Status of every breakdown of table 6b.~~ → Read the Breakdown Status of every Work of table 6b.
  - Data: → Table 6b (Breakdown Status, one per Work) / | Work | Current | Breakdown value changed | Expected | / | W-8394-L1 to L6 | Breakdown Reviewed | no | Breakdown Reviewed | / | W-8394-P1 | Breakdown Reviewed | no | Breakdown Reviewed | / | W-8394-P2 | Breakdown Reviewed | yes | Breakdown Updated | / | W-8394-P3 | Breakdown Updated | yes | Breakdown Updated | / | W-8394-M1 | Breakdown Required | yes (M1-1 to M1-3) | Breakdown Updated |

### ETM-8754 (13 steps)
- **Step 4**
  - Action: ~~Enter Work Status `Reviewed` and Breakdown Status `Breakdown Reviewed` on the `W-8394-K1` rows, and Work Status `Information Required` and Breakdown Status `Breakdown Required` on the `W-8394-K2` rows.~~ → Enter Work Status `Reviewed` and Breakdown Status `Breakdown Reviewed` on the `W-8394-K1` Work row, and Work Status `Information Required` and Breakdown Status `Breakdown Required` on the `W-8394-K2` Work row.
- **Step 7**
  - Action: ~~Enter Breakdown Status `Breakdown Required` on the breakdown of `W-8394-Q2` and leave its Work Status blank.~~ → Enter Breakdown Status `Breakdown Required` on the Work row of `W-8394-Q2` and leave its Work Status blank.
- **Step 10**
  - Action: ~~Read the statuses of `W-8394-K1` and `W-8394-K2` with their breakdowns.~~ → Read the Work Status and Breakdown Status of `W-8394-K1` and `W-8394-K2`.

### ETM-8755 (12 steps)
- **Step 2**
  - Action: ~~Record the Work Status and Breakdown Status of every row.~~ → Record the Work Status and Breakdown Status of every Work.
- **Step 9**
  - Action: ~~Build a file with Action `Revise` for `W-8394-R1` and its breakdown, data unchanged, Work Status `Ready` and Breakdown Status `Breakdown Reviewed`.~~ → Build a file with Action `Revise` for `W-8394-R1` and its breakdown, data unchanged, Work Status `Ready` and Breakdown Status `Breakdown Reviewed` on the Work row.

### ETM-8756 (7 steps)
- **Step 1**
  - Action: ~~Build an import file that adds six Works, each with one breakdown, with the pairs of table 9.~~ → Build an import file that adds six Works, each with one breakdown, with the pairs of table 9 typed on the Work rows.
- **Step 4**
  - Action: ~~Read the statuses of the six Works and their breakdowns.~~ → Read the Work Status and Breakdown Status of the six Works.
- **Step 7**
  - Action: ~~Open the Breakdown Status dropdown of the breakdown.~~ → Open the Breakdown Status dropdown of the Work.

### ETM-8757 (7 steps)
- **Step 1**
  - Action: ~~Build an import file with Action `Revise` for `W-8394-V1` and its breakdown, with the value of table 10 in the column of table 10, the other status cell blank.~~ → Build an import file with Action `Revise` for `W-8394-V1` and its breakdown, with the value of table 10 in the column of table 10 on the Work row, the other status cell blank.

### ETM-8758 (11 steps)
- **Step 8**
  - Action: ~~Build a file with Action `Revise` for `W-8394-AC1` and its breakdown, Work Status `Ready` and Breakdown Status `Breakdown Required`.~~ → Build a file with Action `Revise` for `W-8394-AC1` and its breakdown, Work Status `Ready` and Breakdown Status `Breakdown Required` on the Work row.
- **Step 11**
  - Action: ~~Read the statuses of `W-8394-AC1` and its breakdown.~~ → Read the Work Status and Breakdown Status of `W-8394-AC1`.

### ETM-8765 (7 steps)
- **Step 4**
  - Action: ~~Build an import file that adds four Works, each with one breakdown, using the cell texts of table 12.~~ → Build an import file that adds four Works, each with one breakdown, using the cell texts of table 12 on the Work rows.
- **Step 7**
  - Action: ~~Read the statuses of the four Works and breakdowns.~~ → Read the Work Status and Breakdown Status of the four Works.

### ETM-8766 (8 steps)
- **Step 1**
  - Action: ~~Build an import file with Action `Revise` and the UUID of the Deleted Work `W-8394-Y1`, Work Status `Ready`.~~ → Build an import file with Action `Revise`: the UUID of the Deleted Work `W-8394-Y1` (Work Status `Ready`) and the UUIDs of its two breakdowns.
  - Expected: ~~The file is saved with one row.~~ → The file is saved with three rows.
- **Step 2**
  - Expected: ~~The error banner shows `Data Validation Failed. 1 data validation errors were found in the file.`~~ → The error banner shows `Data Validation Failed. 3 data validation errors were found in the file.`
- **Step 3**
  - Expected: ~~The row shows the Invalid Detail `The UUID you entered is not exist in the system.` and no master data message.~~ → Three rows (the Work row and each breakdown row) show the Invalid Detail `The UUID you entered is not exist in the system.`; no master data message.
- **Step 6**
  - Expected: ~~The breakdown row shows the Invalid Detail `The UUID you entered is not exist in the system.` and `Confirm` is disabled.~~ → Only the breakdown row shows the Invalid Detail `The UUID you entered is not exist in the system.` (`1 data validation errors`) and `Confirm` is disabled.

### ETM-8767 (13 steps)
- **Step 1**
  - Action: ~~Build an import file with Action `Delete` rows for `W-8394-Z1` (Work Status `Ready`) and its two breakdowns (Breakdown Status `Breakdown Required`).~~ → Build an import file with Action `Delete` rows for `W-8394-Z1` (Work Status `Ready`, Breakdown Status `Breakdown Required` on the Work row) and its two breakdowns.
- **Step 5**
  - Action: ~~Build a file with an Action `Delete` row for `W-8394-Z2` with Work Status `Approved`.~~ → Build a file with an Action `Delete` row for `W-8394-Z2` with Work Status `Approved` and Breakdown Status `Deleted`.
  - Expected: ~~The file has one row with an invalid Work Status.~~ → The file has one row with invalid status values.
- **Step 6**
  - Action: ~~Add an Action `Delete` row for its breakdown with Breakdown Status `Deleted`.~~ → Add an Action `Delete` row for its breakdown.
  - Expected: ~~The file is saved with two rows holding invalid values.~~ → The file is saved with two rows.
- **Step 10**
  - Action: ~~Build a file with Action `Delete` rows for `W-8394-Z3` (Work Status `Approved`) and its breakdown (Breakdown Status `Ready`).~~ → Build a file with Action `Delete` rows for `W-8394-Z3` (Work Status `Approved`, Breakdown Status `Ready`) and its breakdown.
  - Expected: ~~The file is saved with two rows holding invalid values.~~ → The file is saved with two rows; the Work row holds invalid values.

### ETM-8769 (7 steps)
- **Step 1**
  - Action: ~~Build one import file with Action `Revise` for both Works and breakdowns, data unchanged, Work Status `Ready` and Breakdown Status `Breakdown Required`.~~ → Build one import file with Action `Revise` for both Works and breakdowns, data unchanged, Work Status `Ready` and Breakdown Status `Breakdown Required` on the Work rows.
- **Step 4**
  - Action: ~~Read the statuses of `W-8394-AB1` and `W-8394-AB2`.~~ → Read the Work Status and Breakdown Status of `W-8394-AB1` and `W-8394-AB2`.
  - Expected: ~~Both Works stay `New` and both breakdowns stay `Breakdown Updated`.~~ → Both Works stay `New` and `Breakdown Updated`.
- **Step 7**
  - Action: ~~Read the statuses of `W-8394-AB1` and `W-8394-AB2`.~~ → Read the Work Status and Breakdown Status of `W-8394-AB1` and `W-8394-AB2`.
  - Expected: ~~Both Works are `Ready` and both breakdowns are `Breakdown Required`.~~ → Both Works are `Ready` and `Breakdown Required`.

## ETM-8768: all steps replaced (4 → 9 steps)

- Summary: [FE][BE] Verify a Turnaround Manager can import into a frozen Worklist and the imported status is applied
- Precondition: A frozen Worklist exists (the script finds one in the QA database). Logged in as `Somchai Tester` (Turnaround Manager).
- Why: AC 1.3 says a TM can import into a frozen Worklist. The old Test needed a hand-made Work, hard-coded ids and `FROZEN_*` in `.env`, and the Work stayed changed after a run. Now the test makes its own Work on a frozen Worklist found in the DB, then deletes it.
1. Open the frozen Worklist as `Somchai Tester`. -> The Worklist opens and `Create Work` (with `Import Excel`) is offered.
2. Build an import file with Action `Add` for Work `W-8394-FZ1` with one breakdown, Work Status `Reviewed` and Breakdown Status `Breakdown Reviewed` on the Work row. -> The file is saved with two rows.
3. Upload the file on the frozen Worklist. -> The preview shows no Error and `Confirm` is enabled.
4. Click `Confirm`. -> The import completes and `W-8394-FZ1` is created.
5. Read the Work Status and Breakdown Status of `W-8394-FZ1`. -> Work Status is `Reviewed` and Breakdown Status is `Breakdown Reviewed`.
6. Build a file with Action `Revise` for `W-8394-FZ1` and its breakdown, data unchanged, Work Status `Information Required` and Breakdown Status `Breakdown Required` on the Work row. -> The file is saved with two rows.
7. Upload the file on the frozen Worklist. -> The preview shows no Error and `Confirm` is enabled.
8. Click `Confirm`. -> The import completes.
9. Read the Work Status and Breakdown Status of `W-8394-FZ1`. -> Work Status is `Information Required` and Breakdown Status is `Breakdown Required`; the Freeze rule did not change them.

## New Tests (create in Xray, link `is tested by` ETM-8394, folder as the others)

### TC-017 [FE] Verify a Job Owner cannot import into a frozen Worklist but can on a Worklist that is not frozen (AC 1.3, 3 steps)
Precondition: A frozen Worklist exists. Logged in as `Malee Tester` (Job Owner).
1. Open the frozen Worklist as `Malee Tester`. -> The Worklist opens.
2. Look for `Create Work` and `Import Excel`. -> Neither `Create Work` nor `Import Excel` is shown, so the Job Owner cannot import into the frozen Worklist.
3. Open a Worklist that is not frozen and open `Create Work` > `Import Excel`. -> The Import Work page opens for the same Job Owner.

### TC-018 [FE][BE] Verify trimmed spaces and a case change in a master data value are not edits, and a case change in free text is an edit (AC 3.3.1, 3.3.2, 3.3.3, 5 steps)
Precondition: Works `W-8394-T1` to `W-8394-T6`, each with one breakdown, at `Reviewed` / `Breakdown Reviewed`. Logged in as `Somchai Tester`.
1. Export the Worklist and build an import file with Action `Revise` for `W-8394-T1` to `W-8394-T6` and their breakdowns, all status cells blank, with only the changes of table 13. -> The file is saved with twelve rows.
   Data: Table 13 / | Work | Change on the row | Expected Work Status | Expected Breakdown Status | / | W-8394-T1 | Work row: two spaces after the `Job Description` | Reviewed | Breakdown Reviewed | / | W-8394-T2 | Work row: `Work Header` in lower case | Reviewed | Breakdown Reviewed | / | W-8394-T3 | Work row: `Job Description` in upper case | Updated | Breakdown Reviewed | / | W-8394-T4 | Breakdown row: a space before the `Job Description` | Reviewed | Breakdown Reviewed | / | W-8394-T5 | Breakdown row: `Working Location (Deck)` in lower case | Reviewed | Breakdown Reviewed | / | W-8394-T6 | Breakdown row: `Job Description` in lower case | Reviewed | Breakdown Updated |
2. Upload the file as `Somchai Tester`. -> The preview shows no Error and `Confirm` is enabled.
3. Click `Confirm`. -> The import completes.
4. Read the Work Status of `W-8394-T1` to `W-8394-T6`. -> Each shows the expected Work Status of table 13.
5. Read the Breakdown Status of `W-8394-T1` to `W-8394-T6`. -> Each shows the expected Breakdown Status of table 13.

### TC-019 [FE][BE] Verify statuses typed on Work Breakdown rows are ignored without a message, valid or invalid (AC 4 (row level), 4 steps)
Precondition: Works `W-8394-U1` and `W-8394-U2`, each with one breakdown, at `Reviewed` / `Breakdown Reviewed`. Logged in as `Somchai Tester`.
1. Build an import file with Action `Revise` for `W-8394-U1`, `W-8394-U2` and their breakdowns, data unchanged, status cells blank on the Work rows; on the breakdown row of `W-8394-U1` type Work Status `Ready` and Breakdown Status `Breakdown Required`, on the breakdown row of `W-8394-U2` type Work Status `Approved` and Breakdown Status `Deleted`. -> The file is saved with four rows.
2. Upload the file as `Somchai Tester`. -> The preview shows no Error, no master data message and no banner, and `Confirm` is enabled.
3. Click `Confirm`. -> The import completes.
4. Read the Work Status and Breakdown Status of `W-8394-U1` and `W-8394-U2`. -> Both stay `Reviewed` and `Breakdown Reviewed`.

Scripts: TC-017, TC-018 and TC-019 are in the spec as `test.fixme('ETM-8394 TC-0xx ...')`. When their Xray keys exist, the key goes into the title and the `fixme` comes off.

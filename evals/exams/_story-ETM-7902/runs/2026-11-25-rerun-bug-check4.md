# Bug-check ETM-7902 (exam)

## 1. High cases: would the case fail on the most likely bug?
| Case | Most likely bug in this flow | Fails on it? | Why |
|---|---|---|---|
| TC-001 | Converts text but Save stays disabled | yes | step 4 checks Save enabled |
| TC-002 | Enter or Tab commits raw text | yes | steps 3 and 6 check canonical text |
| TC-004 | Raw text kept in edit field | yes | step 3 checks edit field |
| TC-005 | Typed back to old value but Save stays enabled | yes | step 4 compares Save with step 1 |
| TC-006 | Day and month swapped | yes | steps 1-2 05/06 vs 06/05 |
| TC-007 | One delimiter or mixed-digit form missed | yes | loops the whole table |
| TC-008 | Wrong digit split | yes | loops table |
| TC-009 | DMYYYY wins over DDMMYY | yes | table rows 111212, 311226 |
| TC-010 | 69/70 border | yes | steps 2 and 4 |
| TC-011 | One time form or separator missed | yes | loops table |
| TC-012 | PM not added | yes | loops table |
| TC-013 | 12 AM / 12 PM wrong | yes | steps 1-2 |
| TC-014 | Date-only gets blank or current time | yes | steps 1-3 |
| TC-015 | 24:00 or 14:60 accepted | yes | loops table, Save check |
| TC-016 | Invalid date kept or saved | yes | steps 2-3 |
| TC-017 | Dot delimiter accepted | yes | loops table |
| TC-019 | Bar jumps on invalid | yes | step 3 compares bar |
| TC-020 | Edit field blank or shows invalid text | yes | step 3 |
| TC-021 | Save enabled with red cell | yes | step 2-3 |
| TC-022 | Cleared cell saved empty | yes | steps 2-3 |
| TC-024 | Pasted text not converted | yes | step 2 |
| TC-025 | Block paste converts only first cell | yes | step 2 table |
| TC-026 | Paste rejects all or keeps old value | yes | step 2 |
| TC-027 | Gantt not updated | yes | step 4 |
| TC-028 | Module converts on Enter but not on blur or paste | no | only Enter is used; blur path of this grid never run |
| TC-029 | Same, blur not converted in this module | no | only Enter used |
| TC-030 | Same | no | only Enter used; time typed in a date-only cell not tried (Q2) |
| TC-031 | Same | no | only Enter used |
| TC-033 | JO enters edit mode | yes | step 1 |
| TC-034 | Raw text stored, shown canonical only until reload | yes | step 3 reload |

## 2. Unsaved changes and leaving
| Action or state x item | Covered by | 
|---|---|
| Convert then undo by hand then Save state | TC-005 step 4 |
| Red cell fixed back to prior value, Save state | TC-020 steps 4-5 |
| Converted change, undo by hand, then leave page: no warning | MISSING |
| Leave with a converted unsaved value, TM, breadcrumb | TC-037 step 2 |
| Leave page as JO (cannot save): no warning | MISSING |
| Leave with a red cell (Save disabled) | MISSING |
| Reload without saving | TC-037 step 4 |
| Browser Back | MISSING |
| In-app tab or menu link (not breadcrumb) in each module | MISSING |
| Detail or edit page and back with unsaved converted value | MISSING |
| Related screen that must ignore the state | not applicable: Story keeps no view state |

## 3. Assumed Open questions
| Question | Step that checks it |
|---|---|
| None says "assumed"; Q1, Q6, Q14, Q15 have the user-view result in TC-010 step 4, TC-013, TC-005 step 4, TC-020 step 5 | covered |

## 4. Grid and input habits
| Habit | Covered by |
|---|---|
| Numbers | not applicable: date cells only |
| Lists and dropdowns | not applicable: no list in Story |
| Date pickers | not applicable: Story has typed input, no picker |
| Paste with cursor in middle or end of text in edit mode | MISSING |
| Paste on selected cell replaces it | TC-024 step 2 |
| Two panels, Gantt same rows | TC-019, TC-027 |
| Someone else changes object while open | TC-035 |

Open: 11

# ETM-8392 - BA answers, round 3 (2026-11-25)

Source: relayed by the lead session (Sprint 26 overview) on 2026-11-25 as the user's answers given as BA in the lead chat. Not yet confirmed in this card's chat.

| Q | Answer (as relayed) | Meaning | Outcome |
|---|---|---|---|
| R3-Q1 (F-12) | "4a" | A Ramp line outside the Focus window must show **nothing** in the PDF (no line, no badge text). The "Down" / "p Up" fragments are wrong. | defect |
| R3-Q2 (F-13) | "รับไม่ได้ เพราะไม่อยากให้ตัด" | The D+2 column and a badge on that day must **not** be cut by the page edge. | defect |

Effect on Tests (pending the user's confirmation here):
- Q1: 8690 step 7 and 8692 step 4 -> fail.
- Q2: 8690 step 3 (14 Jun column cut) and step 8 (Ramp Up badge shows only "R") -> fail; 8693 step 2 (12 Jun column cut) is already PASSED in Xray: changing it needs the user's yes.

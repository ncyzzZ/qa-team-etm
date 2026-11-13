# ETM-XXXX — Potential Defect & Risk Analysis

> **ใช้เมื่อ**: การ์ดมี Calculation / Sorting / Concurrency (Task 1.7)
> ทุกข้อที่เข้าเงื่อนไข ต้องมี TC คุม หรือระบุเหตุผลที่ไม่ต้องมี

| หมวด | เข้าเงื่อนไขไหม | ความเสี่ยงจริงในการ์ดนี้ | TC ที่คุม | ถ้าไม่เขียน เพราะอะไร |
|---|---|---|---|---|
| Rounding / Off-by-one | | | | |
| Rounding tie-break (.5) | | | | |
| Empty value ≠ skip | | | | |
| Zero-division guard | | | | |
| Locale-aware sorting | | | | |
| Concurrency (2 user แก้พร้อมกัน) | | | | |
| Calculation scope (filter มีผลต่อค่าจริงไหม) | | | | |

## ตัวเลขที่ verify ด้วยสคริปต์แล้ว

| สูตร | input | ผลจากสคริปต์ | ค่าที่คาดว่าระบบแสดง |
|---|---|---|---|
| | | | |

## ความเสี่ยงที่เป็นสเปก ไม่ใช่ defect — แต่ควรแจ้ง User

| # | พฤติกรรม | ทำไมน่ากังวล | ใครควรรู้ |
|---|---|---|---|
| 1 | | | |

## ต้อง confirm กับ BA ก่อนเขียน Expected Result

| # | business rule ที่ยังไม่ชัด | บล็อก TC ข้อไหน |
|---|---|---|
| 1 | | |

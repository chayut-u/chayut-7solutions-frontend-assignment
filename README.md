# frontend-coding-test

โปรเจกต์เดียว 2 หน้า สำหรับ 7solutions Frontend Challenge เขียนด้วย Next.js + TypeScript

## ลิงก์ทดสอบ

| ข้อ | ลิงก์ |
|-----|------|
| **ข้อ 1** (required) — Auto Delete Todo List | https://frontend-coding-test-ebon.vercel.app/todo |
| **ข้อ 2** (optional bonus) — Department Summary | https://frontend-coding-test-ebon.vercel.app/department-summary |

หน้าแรก (`/`) มี nav ลิงก์ไปทั้งสองหน้าให้เช่นกัน: https://frontend-coding-test-ebon.vercel.app

---

## รันเครื่อง local

```bash
npm install
npm run dev       # http://localhost:3000
```

## รัน test

```bash
npm test
```

## Build

```bash
npm run build
npm start
```

---

## ข้อ 1: Auto Delete Todo List

คลิกปุ่ม item ในลิสต์หลัก มันจะย้ายไปคอลัมน์ตามประเภท (Fruit / Vegetable) แล้วอยู่บนหน้าจอ 5 วินาที ก่อนย้ายกลับไปท้ายลิสต์หลักอัตโนมัติ ถ้ากดปุ่มนั้นซ้ำตอนอยู่ในคอลัมน์ขวา จะย้ายกลับลิสต์หลักทันทีโดยไม่ต้องรอครบ 5 วิ

**จุดที่ตั้งใจออกแบบเป็นพิเศษ:** ตัวจับเวลา (timer) เก็บไว้ใน `useRef` ไม่ใช่ React state เพราะ timer เป็นแค่ side effect ไม่ใช่ข้อมูลที่ต้องใช้ render หน้าจอ ถ้าเอาไปเก็บใน state จะทำให้ re-render เกินจำเป็นทุกครั้งที่ timer ทำงาน

## ข้อ 2: Department Summary (Bonus)

หน้านี้เรียก API ภายใน (`/api/departments`) ซึ่งไปดึงข้อมูล user จาก `dummyjson.com/users` มา group ตาม department แล้วสรุปเป็นจำนวนชาย/หญิง, ช่วงอายุ, สีผม, และที่อยู่ ตามรูปแบบที่โจทย์กำหนด

**เรื่อง performance ที่ทำไว้:**
- ฟังก์ชัน transform วน loop ข้อมูลแค่รอบเดียว (single-pass) ไม่ใช่ groupBy ก่อนแล้ววนซ้ำทีหลัง
- cache ผลลัพธ์จาก dummyjson ไว้ 60 วินาทีใน memory เพราะข้อมูลแทบไม่เปลี่ยน ไม่ต้องยิง API ใหม่ทุก request
- ดึงข้อมูลครั้งเดียวด้วย `?limit=0` แทนการแบ่งหน้าดึงหลายรอบ

## ไฟล์ไหนอยู่ตรงไหนบ้าง

### ข้อ 1 — Auto Delete Todo List

| ไฟล์ | หน้าที่ |
|------|--------|
| `src/pages/todo.tsx` | หน้าเพจ ประกอบ MainList + CategoryColumn เข้าด้วยกัน |
| `src/hooks/useTodoList.ts` | logic ทั้งหมด — ย้าย item, ตั้ง timer 5 วิ, ยกเลิก/คืนกลับ |
| `src/components/todo/MainList.tsx` | คอลัมน์ซ้าย (ลิสต์หลัก) |
| `src/components/todo/CategoryColumn.tsx` | คอลัมน์ขวา (Fruit / Vegetable) |
| `src/components/todo/ItemButton.tsx` | ปุ่ม item ตัวเดียว ใช้ร่วมกันทั้งสองฝั่ง |
| `src/constants/items.ts` | ข้อมูลตั้งต้น 11 อย่าง + ค่าเวลา 5 วิ |
| `src/types/todo.ts` | type `TodoItem`, `ItemType` |

### ข้อ 2 — Department Summary (Bonus)

| ไฟล์ | หน้าที่ |
|------|--------|
| `src/pages/department-summary.tsx` | หน้าเพจ เรียก API แล้วโชว์ผลสรุปเป็นการ์ดต่อแผนก |
| `src/pages/api/departments.ts` | HTTP endpoint (`GET /api/departments`) — เรียก fetch + transform แล้วส่ง JSON กลับ |
| `src/lib/fetchUsers.ts` | ไปดึงข้อมูลจาก `dummyjson.com/users` (มี timeout + cache 60 วิ) |
| `src/lib/transform.ts` | ฟังก์ชัน `transformUsers` — group ข้อมูลตาม department (pure function ไม่ยุ่งกับ HTTP) |
| `src/types/user.ts` | type `SourceUser`, `DepartmentSummary` |
| `tests/transform.test.ts` | unit test ของ `transformUsers` ทั้ง 7 เคส |

### ใช้ร่วมกันทั้งสองข้อ

| ไฟล์ | หน้าที่ |
|------|--------|
| `src/pages/index.tsx` | หน้าแรก มี nav ลิงก์ไปทั้งสองข้อ |
| `src/pages/_app.tsx` | จุดเริ่มของ Next.js, import CSS กลาง |
| `src/styles/globals.css` | style ทั้งหมดของทั้งแอป |

## Deploy เอง

```bash
npx vercel --prod
```

# frontend-coding-test

โปรเจกต์เดียว 2 หน้า สำหรับ 7solutions Frontend Challenge เขียนด้วย Next.js + TypeScript

**Deploy:** https://frontend-coding-test-ebon.vercel.app

- หน้าแรก (`/`) — nav ลิงก์ไปสองหน้าด้านล่าง
- **[`/todo`](https://frontend-coding-test-ebon.vercel.app/todo)** — ข้อ 1 (required): Auto Delete Todo List
- **[`/department-summary`](https://frontend-coding-test-ebon.vercel.app/department-summary)** — ข้อ 2 (optional bonus): Department Summary จาก dummyjson

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

## โครงสร้างโปรเจกต์

```
src/
├── pages/
│   ├── index.tsx                 # หน้าแรก มี nav
│   ├── todo.tsx                  # ข้อ 1
│   ├── department-summary.tsx    # ข้อ 2
│   └── api/departments.ts        # API route: ดึงข้อมูล + transform
├── components/todo/               # MainList, CategoryColumn, ItemButton
├── hooks/useTodoList.ts           # logic ของ Todo List ทั้งหมด
├── lib/
│   ├── fetchUsers.ts              # เรียก dummyjson + cache
│   └── transform.ts               # groupBy department (pure function)
├── types/
└── styles/globals.css
tests/
└── transform.test.ts              # unit test 7 เคส
```

## Deploy เอง

```bash
npx vercel --prod
```

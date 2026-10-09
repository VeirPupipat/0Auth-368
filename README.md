# Product Explorer + Google OAuth

รวมโปรเจกต์ใบงานที่ผ่านมา (React Hook Form, Zod, External API, Tailwind)
เข้ากับใบงานการยืนยันตัวตนด้วย Google OAuth (Auth.js)

## วิธีรัน

1. ติดตั้งแพ็กเกจ

   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env.local` (คัดลอกจาก `.env.example`) แล้วใส่ค่า

   ```
   AUTH_SECRET=...        # สุ่มด้วย: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   AUTH_GOOGLE_ID=...     # Client ID จาก Google Cloud Console
   AUTH_GOOGLE_SECRET=... # Client Secret
   ```

3. รัน

   ```bash
   npm run dev
   ```

   เปิด http://localhost:3000 (ต้องใช้พอร์ต 3000 ให้ตรงกับ redirect URI)

## ตั้งค่าใน Google Cloud Console

- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (ต้องตรงทุกตัวอักษร)
- ถ้า OAuth consent screen อยู่สถานะ **Testing** ต้องเพิ่มอีเมลที่จะใช้ล็อกอินใน **Test users** ไม่เช่นนั้น Google จะขึ้น access_denied
- ห้าม commit `.env.local` และห้ามนำ Client Secret ไปใส่ใน Client Component

## โครงสร้างและการทำงาน

```
src/
├── auth.ts                      Auth.js + Google provider + callback authorized
├── proxy.ts                     ปกป้อง /products/:id/edit และ /delete (Next 16)
├── app/
│   ├── page.tsx                 Server Component: อ่าน session + เงื่อนไขค้นหาจาก URL
│   ├── auth-buttons.tsx         ปุ่ม Login / Logout (Server Action)
│   ├── actions.ts               create / update / delete พร้อม requireUser และตรวจ Schema ซ้ำ
│   ├── loading.tsx, error.tsx   สถานะกำลังโหลด และเกิดข้อผิดพลาด
│   ├── api/auth/[...nextauth]/route.ts
│   └── products/[id]/{edit,delete}/page.tsx
├── components/
│   ├── ProductSearchForm.tsx    RHF + Zod ส่งเงื่อนไขขึ้น URL
│   ├── ProductForm.tsx          RHF + Zod ใช้ทั้งเพิ่มและแก้ไข เรียก Server Action
│   └── ProductTable.tsx         ตารางสินค้า แสดงลิงก์ตาม session
└── lib/
    ├── products.ts              Zod Schema, Type, URLSearchParams, fetch + safeParse
    ├── product-store.ts         ที่เก็บสินค้าใน memory (server-only)
    └── ui.ts                    คลาส Tailwind ที่ใช้ซ้ำ
```

### ลำดับการป้องกันสิทธิ์ (สามชั้น)

1. UI: ซ่อนลิงก์แก้ไข/ลบและฟอร์มเพิ่มสินค้าเมื่อยังไม่ล็อกอิน (เป็นแค่ UX)
2. `proxy.ts` + `authorized`: redirect ผู้ที่ยังไม่ล็อกอินออกจากหน้าแก้ไข/ลบ
3. `requireUser()` ใน Server Action: ด่านจริง ปฏิเสธทุกคำขอที่ไม่มี session แม้เรียกตรง

### ข้อมูลสินค้า

- ครั้งแรกที่มีคนเปิดหน้า server จะดึงสินค้า 30 รายการจาก dummyjson.com เก็บใน memory
  (ตรวจด้วย `safeParse` เหมือนเดิม) ถ้าเรียกไม่ได้จะใช้ `src/data/products-fallback.json`
- เพิ่ม แก้ไข ลบ มีผลกับข้อมูลใน memory เท่านั้น หาย เมื่อ restart server
- ตั้ง `NEXT_PUBLIC_USE_FALLBACK=true` ใน `.env.local` เพื่อบังคับใช้ข้อมูลสำรอง

## สิ่งที่เปลี่ยนจากโปรเจกต์เดิม

- `ProductExplorer` (Client Component ที่ใช้ useState/useEffect โหลดข้อมูล) ถูกแทนที่ด้วย
  Server Component ที่หน้าแรก เพราะต้องอ่าน session และข้อมูลฝั่ง server
  สถานะโหลด/ผิดพลาดย้ายไปอยู่ที่ `loading.tsx` และ `error.tsx`
- โหมดแก้ไขย้ายจากในหน้าเดียวไปเป็นหน้า `/products/[id]/edit` ตามใบงานใหม่
- ฟอร์มยังใช้ React Hook Form + Zod ตรวจฝั่ง client เพื่อ UX และตรวจซ้ำใน Server Action
- ใช้ `next-auth@beta` (v5) เพราะ `npm install next-auth` เฉย ๆ จะได้ v4 ซึ่ง API ไม่ตรงกับใบงาน

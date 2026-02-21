# 📅 วันที่ 2 — Features + Deploy

เป้าหมายวันนี้: Register API, Login API, Editor, Profile, และ Deploy

> 📖 [กลับไปหน้าหลัก](LEARNING_GUIDE.md)

---

## Step 2.1 — Register API และเชื่อมต่อ Form

### ทำอะไร

- สร้าง API `POST /api/auth/register` สำหรับสมัครสมาชิก
- Hash รหัสผ่านด้วย bcrypt ก่อนเก็บในฐานข้อมูล
- เชื่อม RegisterForm กับ API
- แสดง error และ loading state

### อธิบาย

- **Register API** — รับ `name`, `email`, `password`, `username` (optional) — ถ้าไม่ส่ง username จะสร้างจากส่วนก่อน @ ของ email
- **Validation** — ตรวจสอบ email format, ความยาวรหัสผ่าน (อย่างน้อย 8 ตัวอักษร), username format (a-z, 0-9, _ เท่านั้น)
- **bcrypt** — ใช้ `bcryptjs` hash รหัสผ่านก่อน `prisma.user.create`
- **Form** — เรียก `axios.post("/api/auth/register", { ... })` เมื่อกด Create account, redirect ไป `/login?registered=1` เมื่อสำเร็จ

### Backend

1. ติดตั้ง `bcryptjs` และ `@types/bcryptjs`
2. สร้าง `app/api/auth/register/route.ts` — POST handler
3. Validate input, ตรวจสอบ email/username ซ้ำ, hash password, สร้าง user
4. Return `{ user: { id, name, email, username, createdAt } }` (ไม่ส่ง password)

### Frontend

1. อัปเดต `RegisterForm.tsx` — เพิ่มช่อง Username (optional), ใช้ axios สำหรับเรียก API
2. `handleSubmit` — เรียก `axios.post`, แสดง error จาก `err.response.data.error` ถ้า fail, redirect ไป login ถ้าสำเร็จ
3. แสดง loading state บนปุ่ม Create account

### Code

`**app/api/auth/register/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function slugFromUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, username: rawUsername } = body;
    // ... validation, check duplicate, hash, create user
    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    const user = await prisma.user.create({ ... });
    return NextResponse.json({ user: { id, name, email, username, createdAt } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
```

`**app/(auth)/register/RegisterForm.tsx`** — เชื่อม API (ใช้ axios)

```tsx
import axios from "axios";

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  const formData = new FormData(e.currentTarget);
  const name = (formData.get("name") as string)?.trim() ?? "";
  const username = (formData.get("username") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";

  setIsSubmitting(true);
  try {
    await axios.post("/api/auth/register", {
      name,
      username: username || undefined,
      email,
      password,
    });
    router.push("/login?registered=1");
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      setError(err.response.data.error);
    } else {
      setError("Something went wrong. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
}
```

### คำสั่งที่ต้องรัน

| ลำดับ | คำสั่ง | ทำอะไร |
| ----- | ------ | ------ |
| 1 | `npm install bcryptjs axios` | ติดตั้ง bcrypt สำหรับ hash รหัสผ่าน และ axios สำหรับเรียก API |
| 2 | `npm install -D @types/bcryptjs` | TypeScript types สำหรับ bcryptjs |

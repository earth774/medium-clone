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
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, username: rawUsername } = body;

    const nameStr = typeof name === "string" ? name.trim() : "";
    const emailStr = typeof email === "string" ? email.trim().toLowerCase() : "";
    const passwordStr = typeof password === "string" ? password : "";
    let username = rawUsername
      ? slugFromUsername(String(rawUsername))
      : slugFromUsername(emailStr.split("@")[0] || "user");
    if (!username) username = "user" + Date.now().toString(36);

    if (!nameStr) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!emailStr) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!passwordStr || passwordStr.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!USERNAME_PATTERN.test(username) || username.length < 2) {
      return NextResponse.json(
        { error: "Username must be 2+ characters, letters, numbers, underscores only" },
        { status: 400 }
      );
    }

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email: emailStr } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(passwordStr, 10);

    const user = await prisma.user.create({
      data: {
        name: nameStr,
        email: emailStr,
        username,
        password: hashedPassword,
        statusId: 1,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

```

`**app/(auth)/register/RegisterForm.tsx`** — เชื่อม API (ใช้ axios)

```tsx
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() ?? "";
    const username = (formData.get("username") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const password = (formData.get("password") as string) ?? "";

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-[13px] font-medium text-text-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          className="h-10 w-full px-3 border border-border rounded text-[15px] text-text-1 placeholder:text-text-3 bg-white focus:outline-none focus:border-primary"
          autoComplete="name"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-[13px] font-medium text-text-1">
          Username <span className="text-text-3 font-normal">(optional)</span>
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="johndoe"
          className="h-10 w-full px-3 border border-border rounded text-[15px] text-text-1 placeholder:text-text-3 bg-white focus:outline-none focus:border-primary"
          autoComplete="username"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-[13px] font-medium text-text-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          className="h-10 w-full px-3 border border-border rounded text-[15px] text-text-1 placeholder:text-text-3 bg-white focus:outline-none focus:border-primary"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[13px] font-medium text-text-1">
          Password
        </label>
        <div className="flex h-10 w-full items-center justify-between gap-2 rounded border border-border bg-white px-3 focus-within:border-primary focus-within:outline-none focus-within:ring-1 focus-within:ring-primary">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className="flex-1 min-w-0 bg-transparent text-[15px] text-text-1 placeholder:text-text-3 focus:outline-none"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-[13px] text-text-2 hover:text-text-1 shrink-0"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-full bg-primary text-white font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-text-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

```

### คำสั่งที่ต้องรัน


| ลำดับ | คำสั่ง                           | ทำอะไร                                                        |
| ----- | -------------------------------- | ------------------------------------------------------------- |
| 1     | `npm install bcryptjs axios`     | ติดตั้ง bcrypt สำหรับ hash รหัสผ่าน และ axios สำหรับเรียก API |
| 2     | `npm install -D @types/bcryptjs` | TypeScript types สำหรับ bcryptjs                              |


---

## Step 2.2 — Login API และเชื่อมต่อ Form

### ทำอะไร

- สร้าง API `POST /api/auth/login` สำหรับเข้าสู่ระบบ
- ตรวจสอบรหัสผ่านด้วย bcrypt และสร้าง session (JWT ใน cookie)
- เชื่อม LoginForm กับ API
- แสดง error และ loading state
- เชื่อม Header ให้แสดงสถานะ login (Write, Profile, Log out) เมื่อเข้าสู่ระบบแล้ว

### อธิบาย

- **Login API** — รับ `email`, `password` — ตรวจสอบกับฐานข้อมูล ถ้าถูกต้องสร้าง session และ set cookie
- **Session** — ใช้ `jose` สร้าง JWT เก็บใน httpOnly cookie ชื่อ `session` อายุ 7 วัน
- **Validation** — ตรวจสอบ email และ password ไม่ว่าง, ถ้า email/password ไม่ถูกต้อง return 401 พร้อม `{ error: "Invalid email or password" }`
- **Form** — เรียก `axios.post("/api/auth/login", { email, password })` เมื่อกด Sign in, redirect ไป `/` เมื่อสำเร็จ
- **Header** — Layout ดึง session จาก cookie ส่งให้ Header แสดง Write, Profile avatar (ตัวอักษรแรกของชื่อ), Log out เมื่อ login แล้ว

### Backend

1. ติดตั้ง `jose` สำหรับ JWT
2. สร้าง `lib/auth.ts` — ฟังก์ชัน `createSession`, `getSession`, `setSessionCookie`, `clearSessionCookie`
3. สร้าง `app/api/auth/login/route.ts` — POST handler รับ email/password, ตรวจสอบด้วย bcrypt.compare, สร้าง session, set cookie, return `{ user: { id, name, email, username } }`
4. สร้าง `app/api/auth/session/route.ts` — GET handler อ่าน session จาก cookie return `{ user }` หรือ `{ user: null }`
5. สร้าง `app/api/auth/logout/route.ts` — POST handler ลบ session cookie

### Frontend

1. อัปเดต `LoginForm.tsx` — ใช้ axios เรียก `POST /api/auth/login`, แสดง error จาก `err.response.data.error`, แสดง loading state บนปุ่ม Sign in, redirect ไป `/` และ `router.refresh()` เมื่อสำเร็จ
2. อัปเดต `app/layout.tsx` — เรียก `getSession()` ส่ง `user` ให้ Header
3. อัปเดต `Header.tsx` — รับ prop `user`, แสดง Write + Profile avatar + Log out เมื่อ `user` มีค่า, ปุ่ม Log out เรียก `POST /api/auth/logout` แล้ว `router.refresh()`

### Code

`**lib/auth.ts`** — Session helpers (JWT + cookie)

```ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.CRYPTO_SECRET || "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  username: string;
  exp: number;
};

export async function createSession(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return new SignJWT({ ...payload, exp: expires })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

```

`**app/api/auth/login/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const emailStr = typeof email === "string" ? email.trim().toLowerCase() : "";
    const passwordStr = typeof password === "string" ? password : "";

    if (!emailStr) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!passwordStr) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: emailStr, statusId: 1 },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(passwordStr, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
```

`**app/(auth)/login/LoginForm.tsx`** — เชื่อม API

```tsx
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim() ?? "";
    const password = (formData.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/login", { email, password });
      router.push("/");
      router.refresh();
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-[13px] font-medium text-text-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          className="h-10 w-full px-3 border border-border rounded text-[15px] text-text-1 placeholder:text-text-3 bg-white focus:outline-none focus:border-primary"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[13px] font-medium text-text-1">
          Password
        </label>
        <div className="flex h-10 w-full items-center justify-between gap-2 rounded border border-border bg-white px-3 focus-within:border-primary focus-within:outline-none focus-within:ring-1 focus-within:ring-primary">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className="flex-1 min-w-0 bg-transparent text-[15px] text-text-1 placeholder:text-text-3 focus:outline-none"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-[13px] text-text-2 hover:text-text-1 shrink-0"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-full bg-primary text-white font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-text-2">
        No account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
```

`**app/components/Header.tsx`** — เชื่อม API

```tsx
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type HeaderProps = {
  user: { id: string; name: string } | null;
};

export default function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;

  const router = useRouter();

  async function handleLogout() {
    try {
      await axios.post("/api/auth/logout");
      router.push("/");
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  return (
    <header className="relative h-[57px] flex items-center justify-between px-4 sm:px-6 lg:px-11 border-b border-border bg-bg">
      <Link
        href="/"
        className="font-logo text-2xl font-bold text-text-1 hover:text-primary transition-colors"
      >
        Medium
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              href="/write"
              className="text-text-2 hover:text-text-1 text-sm"
            >
              Write
            </Link>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm"
              aria-label="Profile"
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-text-2 hover:text-text-1 text-sm"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-text-2 hover:text-text-1 text-sm"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-text-2 hover:text-text-1 text-sm"
            >
              Register
            </Link>
          </>
        )}
      </nav>

      {/* Mobile: hamburger + condensed nav */}
      <div className="flex md:hidden items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="p-2 -mr-2 text-text-1"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className="absolute top-[57px] left-0 right-0 bg-bg border-b border-border shadow-md md:hidden z-10"
          role="dialog"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col p-4 gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/write"
                  className="py-2 text-text-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Write
                </Link>
                <Link
                  href="/profile"
                  className="py-2 text-text-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="py-2 text-text-1 text-left w-full"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 text-text-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="py-2 text-text-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```

### คำสั่งที่ต้องรัน


| ลำดับ | คำสั่ง             | ทำอะไร                          |
| ----- | ------------------ | ------------------------------- |
| 1     | `npm install jose` | ติดตั้ง jose สำหรับ JWT session |


### ตัวแปร environment (แนะนำ)

- `AUTH_SECRET` หรือ `CRYPTO_SECRET` — ใช้สำหรับ sign JWT (production ควรตั้งค่าให้ปลอดภัย)


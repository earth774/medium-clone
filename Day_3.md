# 📅 วันที่ 3 — Git พื้นฐาน

เป้าหมายวันนี้: เรียนรู้ Git และการใช้งานพื้นฐาน รวมถึงการสร้าง repository บน GitHub

> 📖 [กลับไปหน้าหลัก](LEARNING_GUIDE.md)

---

## 3.1 Git คืออะไร

**Git** คือระบบควบคุมเวอร์ชัน (Version Control System) ที่ใช้ติดตามการเปลี่ยนแปลงของไฟล์ในโปรเจกต์ ช่วยให้สามารถ:

- บันทึกประวัติการแก้ไข (history)
- ทำงานร่วมกับคนอื่นได้ง่าย
- ย้อนกลับไปเวอร์ชันก่อนหน้าได้
- สร้าง branch เพื่อทดลองฟีเจอร์ใหม่โดยไม่กระทบโค้ดหลัก

---

### Clone โปรเจกต์

```bash
# Clone โปรเจกต์จาก GitHub
git clone [url github]

# เข้าไปในโฟลเดอร์โปรเจกต์
cd medium_clone

# เข้าไปในโฟลเดอร์ web (Next.js app)
cd web

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env จาก .env.example และแก้ไข DATABASE_URL ตามที่ใช้
cp .env.example .env

# สร้างฐานข้อมูลและรัน migration
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# รัน dev server
npm run dev
```

**หมายเหตุ:** แทนที่ `[url github]` ด้วย URL ของ repository จริง เช่น `https://github.com/username/medium_clone.git`

---

## ขั้นตอนการสร้าง Repository บน GitHub

1. **เข้าสู่ GitHub** — ไปที่ [github.com](https://github.com) และล็อกอิน
2. **สร้าง Repo ใหม่** — กดปุ่ม **"+"** มุมขวาบน → เลือก **"New repository"**
3. **ตั้งค่า**
  - ตั้งชื่อ repository (เช่น `my-project`)
  - เลือก Public หรือ Private
  - เลือก **"Add a README file"** ถ้าต้องการไฟล์เริ่มต้น (หรือเว้นว่างถ้าจะ push โปรเจกต์ที่มีอยู่แล้ว)
4. **กด "Create repository"**
5. **เชื่อมกับโปรเจกต์ท้องถิ่น** — ใช้คำสั่งที่ GitHub แสดง เช่น:
  ```bash
   git remote add origin https://github.com/username/my-project.git
   git branch -M main
   git push -u origin main
  ```

---

## ตัวอย่าง: สร้างไฟล์ txt ง่ายๆ และใช้ Git

### ขั้นตอนที่ 1 — สร้างโฟลเดอร์และไฟล์

```bash
# สร้างโฟลเดอร์โปรเจกต์
mkdir my-first-git-project
cd my-first-git-project

# สร้างไฟล์ txt
echo "Hello, Git!" > hello.txt
```

หรือสร้างไฟล์ด้วย editor:

```bash
# macOS / Linux
nano hello.txt
# พิมพ์ข้อความ แล้วกด Ctrl+X, Y, Enter เพื่อบันทึก
```

### ขั้นตอนที่ 2 — ใช้ Git จัดการไฟล์

```bash
# สร้าง repository ในโฟลเดอร์นี้
git init

# ดูสถานะไฟล์
git status

# เตรียมไฟล์ก่อน commit
git add .

# บันทึก (commit)
git commit -m "Add hello.txt"
```

---

## Setup & Staging


| คำสั่ง                    | ความหมาย                                                   |
| ------------------------- | ---------------------------------------------------------- |
| `git init`                | สร้าง repository ในโฟลเดอร์ปัจจุบัน (สร้างโฟลเดอร์ `.git`) |
| `git add .`               | เตรียมไฟล์ทั้งหมดก่อน commit (staging)                     |
| `git add ไฟล์.txt`        | เตรียมเฉพาะไฟล์ที่ระบุ                                     |
| `git status`              | ดูสถานะไฟล์ (modified, staged, untracked)                  |
| `git commit -m "ข้อความ"` | บันทึกการเปลี่ยนแปลงพร้อมข้อความอธิบาย                     |


### ตัวอย่างการใช้งาน

```bash
# สร้าง repo
git init

# แก้ไข hello.txt แล้วดูสถานะ
git status

# เตรียมไฟล์
git add .

# บันทึก
git commit -m "Add hello.txt with greeting"
```

---

## Commit & Sync


| คำสั่ง              | ความหมาย                                  |
| ------------------- | ----------------------------------------- |
| `git log`           | ดูประวัติ commit (กด q เพื่อออก)          |
| `git log --oneline` | ดูประวัติแบบย่อ                           |
| `git push`          | ส่ง commit ขึ้น remote (เช่น GitHub)      |
| `git pull`          | ดึงการเปลี่ยนแปลงจาก remote มา merge      |
| `git branch`        | ดู branch ทั้งหมด                         |
| `git branch ชื่อ`   | สร้าง branch ใหม่                         |
| `git diff`          | ดูการเปลี่ยนแปลงที่ยังไม่ commit          |
| `git diff --staged` | ดูการเปลี่ยนแปลงที่เตรียมไว้แล้ว (staged) |


### ตัวอย่างการใช้งาน

```bash
# ดูประวัติ
git log
git log --oneline

# ส่งขึ้น GitHub (หลัง add remote แล้ว)
git push

# ดึงจาก remote
git pull

# ดู branch
git branch

# ดูการเปลี่ยนแปลง
git diff
```

---

## สรุปลำดับการทำงานพื้นฐาน

```
1. git init              → สร้าง repo
2. แก้ไข/สร้างไฟล์
3. git add .             → เตรียมไฟล์
4. git status            → ตรวจสอบ (optional)
5. git commit -m "..."   → บันทึก
6. git push              → ส่งขึ้น remote (ถ้ามี)
```

---

## เคล็ดลับ

- **Commit บ่อยๆ** — แบ่ง commit เป็นหน่วยงานเล็กๆ ที่มีความหมาย
- **ข้อความ commit ชัดเจน** — ใช้ present tense เช่น "Add login form" ไม่ใช่ "Added login form"
- **git status ก่อน commit** — ตรวจสอบว่า stage ถูกไฟล์ที่ต้องการ
- **git pull ก่อน push** — ดึงการเปลี่ยนแปลงจาก remote ก่อนส่งของตัวเองขึ้นไป

---

## 3.2 Project Setup (ต่อจาก week แรก)

สำหรับผู้ที่เริ่มตามในสัปดาห์ที่ 2 หรือต้องการ clone โปรเจกต์จาก GitHub มาใช้งาน ให้ทำตามขั้นตอนด้านล่าง

---

## 3.3 หน้า Write (Editor UI)

หน้า Write สำหรับเขียนบทความ ตาม design จาก Pencil (`design/design.pen` — Page 7 Editor, node Lw4br) รองรับ responsive

### ติดตั้ง dependency

```bash
cd web
npm install @uiw/react-md-editor
```

### ไฟล์ที่เกี่ยวข้อง

- `web/app/write/page.tsx` — หน้า Write หลัก
- `web/app/write/MarkdownEditor.tsx` — Rich text Markdown editor (ใช้ @uiw/react-md-editor)

### MarkdownEditor.tsx

```tsx
"use client";

import dynamic from "next/dynamic";

import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

type MarkdownEditorProps = {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  return (
    <div
      data-color-mode="light"
      className="[&_.w-md-editor]:min-h-[350px] [&_.w-md-editor]:border-0 [&_.w-md-editor]:rounded-none [&_.w-md-editor-toolbar]:bg-surface [&_.w-md-editor-toolbar]:border-b-border"
    >
      <MDEditor
        value={value}
        onChange={onChange}
        height={350}
        preview="live"
        visibleDragbar={false}
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
```

### page.tsx

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import MarkdownEditor from "./MarkdownEditor";

const TOPICS = [
  { id: "tech", label: "Technology" },
  { id: "design", label: "Design" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
  { id: "culture", label: "Culture" },
  { id: "more", label: "+ More" },
];

const MARKDOWN_PLACEHOLDER = `# Write your article in Markdown

**Bold** *Italic* ~~Strikethrough~~ \`inline code\`

## Headings: # H1 ## H2 ### H3

## Lists: - bullet 1. ordered

> Blockquotes | \`\`\` Code blocks \`\`\``;

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>("business");
  const [draftStatus, setDraftStatus] = useState<string | null>("Draft saved 2:34 PM");

  return (
    <div className="flex flex-col w-full min-h-0">
      {/* Editor Top Bar - full width, flush with navbar */}
      <div
        className="flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-11 border-b border-border bg-bg flex-wrap sm:flex-nowrap -mx-4 sm:-mx-6 lg:-mx-11 -mt-8"
      >
        <div className="flex items-center gap-4 order-1 sm:order-1 min-w-0">
          <Link
            href="/"
            className="text-text-2 hover:text-text-1 text-sm sm:text-[15px] whitespace-nowrap"
          >
            ← Back
          </Link>
          {draftStatus && (
            <span className="text-text-3 text-xs sm:text-[13px] truncate">
              {draftStatus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 order-2 sm:order-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            className="px-4 py-2 text-text-2 hover:text-text-1 text-sm"
          >
            Save draft
          </button>
          <button
            type="button"
            className="rounded-full bg-primary text-white px-5 py-2.5 text-[15px] font-medium hover:opacity-90 transition-opacity"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex justify-center w-full py-8 sm:py-12">
        <div className="w-full max-w-[740px] flex flex-col gap-6 px-0">
          {/* Title */}
          <div className="border-b border-border pb-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-logo text-2xl sm:text-[42px] font-bold leading-tight text-text-1 placeholder:text-text-3 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          {/* Subtitle */}
          <div className="border-b border-border pb-2">
            <input
              type="text"
              placeholder="Tell your story..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full font-logo text-xl sm:text-2xl leading-snug text-text-1 placeholder:text-text-3 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          {/* Add a topic */}
          <div className="flex flex-col gap-2.5">
            <span className="text-text-2 text-[13px] font-semibold">
              Add a topic
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
              {TOPICS.map((topic) => {
                const isActive = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() =>
                      setSelectedTopic(topic.id === "more" ? null : topic.id)
                    }
                    className={`
                      shrink-0 rounded-full px-3.5 py-1.5 text-[13px] border
                      transition-colors
                      ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-text-1 border-border hover:border-text-3"
                      }
                      ${topic.id === "more" ? "text-text-2" : ""}
                    `}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body (Markdown) - Rich text editor */}
          <div className="border border-border rounded-sm min-h-[400px] flex flex-col overflow-hidden">
            <span className="text-text-3 text-xs font-medium px-3 pt-4 pb-2">
              Markdown
            </span>
            <MarkdownEditor
              value={body}
              onChange={(v) => setBody(v ?? "")}
              placeholder={MARKDOWN_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### สรุปการเปลี่ยนแปลง (จาก git diff)

| ส่วน | รายละเอียด |
|------|------------|
| **Dependency** | เพิ่ม `@uiw/react-md-editor` สำหรับ rich text Markdown |
| **Editor Top Bar** | `-mx-4 sm:-mx-6 lg:-mx-11 -mt-8` — แสดงเต็มความกว้างและชิด navbar |
| **Body** | เปลี่ยนจาก `<textarea>` เป็น `<MarkdownEditor>` พร้อม live preview |
| **MarkdownEditor** | ใช้ `dynamic` import + `ssr: false` สำหรับ Next.js |

### Responsive

- **Top bar:** แสดงเต็มความกว้าง main, ชิด navbar (`-mt-8`), `flex-wrap` บน mobile
- **Title/Subtitle:** `text-2xl` → `sm:text-[42px]` และ `text-xl` → `sm:text-2xl`
- **Topic chips:** `overflow-x-auto` สำหรับเลื่อนแนวนอนบน mobile
- **Body:** `max-w-[740px]` ตรงกลาง, MarkdownEditor มี toolbar + live preview

---

## 3.4 API Create Article และการเชื่อมต่อ

สร้าง API สำหรับสร้างบทความ (POST `/api/articles`) และเชื่อมต่อกับหน้า Write

### ติดตั้ง dependency

```bash
cd web
npm install marked
```

### Schema (Prisma)

เพิ่มฟิลด์ `subtitle` และ `@db.Text` ให้ `content` ใน `Article`:

```prisma
model Article {
  id        String        @id @default(cuid())
  title     String
  subtitle  String?       @db.Text
  content   String        @db.Text
  authorId  String        @map("user_id")
  ...
}
```

รัน migration:

```bash
npx prisma generate
npx prisma migrate dev --name add-article-subtitle-and-text
```

### API Route: GET /api/categories

ไฟล์: `web/app/api/categories/route.ts`

- **Public:** ไม่ต้องล็อกอิน
- **Response:** `{ items: [{ id, name }, ...] }`
- ดึง categories ที่ `statusId: 1` (Active) จาก DB
- เรียงตาม `id` ascending

### API Route: POST /api/articles

ไฟล์: `web/app/api/articles/route.ts`

- **Auth:** ต้องล็อกอิน (ใช้ `getSession`)
- **Body:** `{ title, subtitle?, content, categoryId?, publish }`
- **Validation:** `title` และ `content` จำเป็น
- **Markdown → HTML:** ใช้ `marked` แปลง Markdown เป็น HTML ก่อนบันทึก
- **Status:** `publish: true` → statusId 1 (Active), `false` → statusId 2 (Draft)
- **categoryId:** รับ number (id ของ Category) ถ้ามีจะผูก ArticleCategory

### การเชื่อมต่อหน้า Write

ไฟล์: `web/app/write/page.tsx`

- **Top bar:** `relative z-10 -mt-8` — ชิด navbar และ z-index สูงกว่า header เพื่อไม่ให้คลิกไปโดน Profile
- **ดึง categories:** `useEffect` เรียก `GET /api/categories` ตอนโหลด → แสดง topic chips จาก API
- **เลือก topic:** คลิกเลือก/ยกเลิก (toggle) → เก็บ `selectedCategoryId` (number | null)
- ใช้ `axios.post("/api/articles", { title, subtitle, content, categoryId, publish })`
- **Save draft:** `handleSave(false)` → บันทึกเป็น Draft (statusId: 2)
- **Publish:** `handleSave(true)` → redirect ไป `/articles/[id]` (statusId: 1)
- แสดง error จาก API (เช่น "Unauthorized", "Title is required")
- ปุ่ม disabled ขณะ `isSubmitting`

### Categories (จาก seed)

| ID | Name        |
|----|-------------|
| 1  | Programming |
| 2  | Data Science|
| 3  | UX          |
| 4  | Startup     |
| 5  | Writing     |
| 6  | Psychology  |

### สรุปการเปลี่ยนแปลง

| ส่วน | รายละเอียด |
|------|------------|
| **Schema** | เพิ่ม `subtitle`, `content` ใช้ `@db.Text` |
| **API categories** | GET `/api/categories` — ดึง categories จาก DB |
| **API articles** | GET/POST `/api/articles` — รวม draft support, auth, validate, markdown→HTML |
| **Write page** | Top bar ชิด navbar, fetch categories, Save draft + Publish ทำงาน |
| **Article page** | แสดง `subtitle` ถ้ามี, draft banner สำหรับเจ้าของ |

### โค้ดที่แก้ไข (ทั้งไฟล์)

#### prisma/schema.prisma (ส่วน Article)

```prisma
model Article {
  id        String        @id @default(cuid())
  title     String
  subtitle  String?       @db.Text
  content   String        @db.Text
  authorId  String        @map("user_id")
  author    User          @relation(fields: [authorId], references: [id])
  statusId  Int           @default(1) @map("status_id")
  status    Status        @relation(fields: [statusId], references: [id])
  createdAt DateTime      @default(now()) @map("created_at")
  updatedAt DateTime      @default(now()) @updatedAt @map("updated_at")
  likes     ArticleLike[]
  categories ArticleCategory[]

  @@map("article")
}
```

#### web/app/api/categories/route.ts (ไฟล์ใหม่)

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { statusId: 1 },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json({
      items: categories.map((c) => ({ id: c.id, name: c.name })),
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
```

#### web/app/api/articles/route.ts (ไฟล์ทั้งหมด — รวม draft support)

```ts
import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function excerptFromContent(content: string, maxLength = 150): string {
  const plain = content.replace(/<[^>]+>/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "…";
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE), 10))
    );
    const skip = (page - 1) * limit;

    const session = await getSession();
    const currentUserId = session?.userId;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          OR: [
            { statusId: 1 },
            ...(currentUserId ? [{ statusId: 2, authorId: currentUserId }] : []),
          ],
        },
        include: {
          author: { select: { id: true, name: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          OR: [
            { statusId: 1 },
            ...(currentUserId ? [{ statusId: 2, authorId: currentUserId }] : []),
          ],
        },
      }),
    ]);

    const items = articles.map((a) => ({
      id: a.id,
      title: a.title,
      excerpt: excerptFromContent(a.content),
      author: { id: a.author.id, name: a.author.name },
      publishedAt: a.createdAt,
      readTimeMinutes: estimateReadTime(a.content),
      likeCount: a._count?.likes ?? 0,
      statusId: a.statusId,
    }));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, content, categoryId, publish } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const statusId = publish ? 1 : 2;
    const validCategoryId =
      typeof categoryId === "number" && Number.isInteger(categoryId) && categoryId > 0
        ? categoryId
        : null;

    const rawContent = content.trim();
    const htmlContent = marked.parse(rawContent, { async: false }) as string;

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        subtitle: subtitle && typeof subtitle === "string" ? subtitle.trim() || null : null,
        content: htmlContent,
        authorId: session.userId,
        statusId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    if (validCategoryId) {
      const maxAc = await prisma.articleCategory.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
      });
      await prisma.articleCategory.create({
        data: {
          id: (maxAc?.id ?? 0) + 1,
          articleId: article.id,
          categoryId: validCategoryId,
          statusId: 1,
        },
      });
    }

    return NextResponse.json({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      statusId: article.statusId,
      author: article.author,
    });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
```

#### web/app/write/page.tsx (ไฟล์ทั้งหมด)

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

import MarkdownEditor from "./MarkdownEditor";

type Category = { id: number; name: string };

const MARKDOWN_PLACEHOLDER = `# Write your article in Markdown

**Bold** *Italic* ~~Strikethrough~~ \`inline code\`

## Headings: # H1 ## H2 ### H3

## Lists: - bullet 1. ordered

> Blockquotes | \`\`\` Code blocks \`\`\``;

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ items: Category[] }>("/api/categories")
      .then((res) => setCategories(res.data.items))
      .catch(() => setCategories([]));
  }, []);

  async function handleSave(publish: boolean) {
    setError(null);
    if (!title.trim()) {
      setError("กรุณากรอกหัวข้อ");
      return;
    }
    if (!body.trim()) {
      setError("กรุณากรอกเนื้อหา");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/articles", {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        content: body.trim(),
        categoryId: selectedCategoryId ?? undefined,
        publish,
      });
      router.push(`/articles/${data.id}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full min-h-0">
      {/* Editor Top Bar - full width, flush with navbar */}
      <div
        className="relative z-10 flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-11 border-b border-border bg-bg flex-wrap sm:flex-nowrap -mx-4 sm:-mx-6 lg:-mx-11 -mt-8"
      >
        <div className="flex items-center gap-4 order-1 sm:order-1 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-text-2 hover:text-text-1 text-sm sm:text-[15px] whitespace-nowrap"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back
          </Link>
        </div>
        <div className="flex items-center gap-3 order-2 sm:order-2 w-full sm:w-auto justify-end">
          {error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
            className="px-4 py-2 text-text-2 hover:text-text-1 text-sm disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
            className="rounded-full bg-primary text-white px-5 py-2.5 text-[15px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex justify-center w-full py-8 sm:py-12">
        <div className="w-full max-w-[740px] flex flex-col gap-6 px-0">
          {/* Title */}
          <div className="border-b border-border pb-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-logo text-2xl sm:text-[42px] font-bold leading-tight text-text-1 placeholder:text-text-3 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          {/* Subtitle */}
          <div className="border-b border-border pb-2">
            <input
              type="text"
              placeholder="Tell your story..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full font-logo text-xl sm:text-2xl leading-snug text-text-1 placeholder:text-text-3 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          {/* Add a topic */}
          <div className="flex flex-col gap-2.5">
            <span className="text-text-2 text-[13px] font-semibold">
              Add a topic
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1">
              {categories.map((cat) => {
                const isActive = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategoryId((prev) =>
                        prev === cat.id ? null : cat.id
                      )
                    }
                    className={`
                      shrink-0 rounded-full px-3.5 py-1.5 text-[13px] border
                      transition-colors
                      ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-text-1 border-border hover:border-text-3"
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body (Markdown) - Rich text editor */}
          <div className="border border-border rounded-sm min-h-[400px] flex flex-col overflow-hidden">
            <span className="text-text-3 text-xs font-medium px-3 pt-4 pb-2">
              Markdown
            </span>
            <MarkdownEditor
              value={body}
              onChange={(v) => setBody(v ?? "")}
              placeholder={MARKDOWN_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### web/app/articles/[id]/page.tsx (ไฟล์ทั้งหมด — รวม draft support)

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Share2, FilePen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentSection } from "./CommentSection";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const words = text.trim().split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  const currentUserId = session?.userId;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      categories: {
        where: { statusId: 1 },
        include: { category: { select: { id: true, name: true } } },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!article) notFound();

  const isDraft = article.statusId === 2;
  const isOwner = currentUserId === article.author.id;

  // Draft articles are only accessible by the owner
  if (isDraft && !isOwner) {
    notFound();
  }

  const readTime = getReadTime(article.content);
  const initials = getInitials(article.author.name);
  const plainContent = article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const excerpt = plainContent.slice(0, 200);
  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(article.createdAt);

  return (
    <article className={`max-w-[680px] mx-auto pt-12 pb-12 flex flex-col gap-6 ${isDraft ? "relative" : ""}`}>
      {isDraft && (
        <div className="absolute -top-2 left-0 right-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
            <FilePen className="w-4 h-4" />
            Draft — Only visible to you
          </span>
        </div>
      )}
      {/* Title */}
      <h1 className="font-logo text-[42px] font-bold leading-[1.2] text-text-1">
        {article.title}
      </h1>

      {/* Subtitle - from article or excerpt from content */}
      {(article.subtitle || excerpt) && (
        <p className="font-logo text-2xl font-semibold leading-[1.4] text-text-2">
          {article.subtitle ?? `${excerpt}${plainContent.length > 200 ? "…" : ""}`}
        </p>
      )}

      {/* Category chips */}
      {article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.categories.map((ac) => (
            <span
              key={ac.category.id}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-medium text-text-1 bg-surface border border-border"
            >
              {ac.category.name}
            </span>
          ))}
        </div>
      )}

      {/* Author bar */}
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${article.author.id}`}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[15px] shrink-0"
        >
          {initials}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${article.author.id}`}
            className="text-base font-semibold text-text-1 hover:text-primary transition-colors block"
          >
            {article.author.name}
          </Link>
          <p className="text-[13px] text-text-2">
            {dateStr} · {readTime} min read
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          Follow
        </button>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-5 py-3 border-y border-border">
        <span className={`flex items-center gap-1.5 text-[15px] ${article._count.likes > 0 ? "text-like" : "text-text-2"}`}>
          <Heart
            className="size-[15px]"
            strokeWidth={2}
            fill={article._count.likes > 0 ? "currentColor" : "none"}
          />
          {article._count.likes}
        </span>
        <div className="flex-1" />
        <span className="flex items-center gap-1.5 text-sm text-text-2">
          <Share2 className="size-[14px]" strokeWidth={2} />
          Share
        </span>
      </div>

      {/* Body content */}
      <div
        className="prose prose-neutral max-w-none text-text-1 text-lg leading-[1.8] [&_blockquote]:border-l-4 [&_blockquote]:border-text-1 [&_blockquote]:pl-4 [&_blockquote]:font-logo [&_blockquote]:text-xl [&_blockquote]:font-semibold [&_blockquote]:leading-normal [&_blockquote]:not-italic"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Bottom author card */}
      <div className="flex gap-6 pt-6">
        <Link
          href={`/profile/${article.author.id}`}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[28px] shrink-0"
        >
          {initials}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${article.author.id}`}
            className="text-xl font-semibold text-text-1 hover:text-primary transition-colors block"
          >
            {article.author.name}
          </Link>
          <p className="text-[15px] text-text-2 leading-[1.6] mt-2">
            Staff writer. Writing about technology and human experience.
          </p>
          <button
            type="button"
            className="mt-2 px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            Follow
          </button>
        </div>
      </div>

      <CommentSection />
    </article>
  );
}
```

#### web/package.json (dependencies — เพิ่ม marked)

```json
"dependencies": {
  "@prisma/client": "^6.19.2",
  "@uiw/react-md-editor": "^4.0.11",
  "axios": "^1.13.5",
  "bcryptjs": "^3.0.3",
  "jose": "^6.1.3",
  "lucide-react": "^0.575.0",
  "marked": "^17.0.3",
  "next": "16.1.6",
  "prisma": "^6.19.2",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

---

## 3.5 Save Draft Feature

ฟีเจอร์ Save Draft ช่วยให้ผู้ใช้สามารถบันทึกบทความที่ยังไม่เสร็จและกลับมาแก้ไขภายหลังได้

### Requirements

1. **หน้า Write** — สามารถ Save draft ได้ (ปุ่ม "Save draft" ทำงานแล้ว)
2. **หน้า Feed** — แสดงสถานะ Draft เฉพาะเจ้าของบทความ (ผู้อื่นไม่เห็น)
3. **Article Detail** — ถ้าเป็น Draft เจ้าของเข้าดูได้เท่านั้น (ผู้อื่นได้ 404)

### Status IDs

| ID | Name | Description |
|----|------|-------------|
| 1 | Active | Published articles (visible to everyone) |
| 2 | Draft | Unpublished articles (owner only) |

### Implementation Details

#### 1. Write Page (`web/app/write/page.tsx`)

- เปิดใช้งานปุ่ม "Save draft" ( uncomment ที่ซ่อนไว้ )
- `handleSave(false)` → บันทึกเป็น Draft (statusId: 2)
- `handleSave(true)` → Publish (statusId: 1)
- แสดง `draftStatus` ใน top bar เมื่อบันทึกสำเร็จ

#### 2. API — GET /api/articles (Feed)

แก้ไข query ให้ดึงบทความที่:
- `statusId: 1` (Active) — ทุกคนเห็น
- `statusId: 2` (Draft) + `authorId: currentUserId` — เฉพาะเจ้าของเห็น

```ts
const session = await getSession();
const currentUserId = session?.userId;

const where = {
  OR: [
    { statusId: 1 },
    ...(currentUserId ? [{ statusId: 2, authorId: currentUserId }] : []),
  ],
};
```

Response เพิ่ม `statusId` ใน items:
```ts
items: articles.map((a) => ({
  ...,
  statusId: a.statusId,
})),
```

#### 3. ArticleCard — Draft Badge

เพิ่ม props:
```ts
type ArticleCardProps = {
  ...,
  authorId: string;
  currentUserId?: string;
  statusId?: number;
};
```

แสดง Draft badge เฉพาะเจ้าของ:
```tsx
const isDraft = statusId === 2;
const isOwner = currentUserId === authorId;

{isDraft && isOwner && (
  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
    <FilePen className="w-3 h-3" />
    Draft
  </span>
)}
```

Border สีส้มสำหรับ Draft:
```tsx
<article className={`border rounded-lg py-6 px-6 ${isDraft ? "border-orange-300 bg-orange-50/30" : "border-border"}`}>
```

#### 4. Article Detail Page — Owner-only Access

- ดึง session และ check ว่าเป็น owner หรือไม่
- Draft articles: ถ้าไม่ใช่ owner → `notFound()`
- แสดง Draft badge ที่ด้านบนของบทความ

```tsx
const session = await getSession();
const currentUserId = session?.userId;
const isDraft = article.statusId === 2;
const isOwner = currentUserId === article.author.id;

if (isDraft && !isOwner) {
  notFound();
}
```

### Files Changed

| File | Changes |
|------|---------|
| `web/app/write/page.tsx` | Uncomment Save draft button |
| `web/app/api/articles/route.ts` | Include user's drafts in GET, add statusId to response |
| `web/app/components/ArticleCard.tsx` | Add draft badge, authorId, statusId props |
| `web/app/page.tsx` | Fetch current user, pass props to ArticleCard |
| `web/app/articles/[id]/page.tsx` | Check ownership for drafts, add draft banner |

### Testing Checklist

- [ ] Save draft button works → creates article with statusId 2
- [ ] Draft appears in Feed only for owner (orange border + badge)
- [ ] Others don't see draft in Feed
- [ ] Owner can view draft article detail (with banner)
- [ ] Others get 404 when accessing draft directly
- [ ] Published articles work as before

---

## 3.7 Popular Articles Sidebar

แสดง 3 บทความยอดนิยมใน Sidebar โดยเรียงตามจำนวน likes (หัวใจ) มากที่สุด แบบ dynamic จากฐานข้อมูล

### Requirements

1. **Sidebar** — แสดง 3 บทความที่มี likes มากที่สุด
2. **API** — รองรับ `sort=popular` parameter สำหรับเรียงตาม likes
3. **Dynamic** — ข้อมูลอัปเดตอัตโนมัติเมื่อมีการเปลี่ยนแปลง likes

### Implementation Details

#### 1. API Route — GET /api/articles (เพิ่ม sort parameter)

เพิ่ม query parameter `sort` รองรับ 2 ค่า:
- `sort=newest` (default) — เรียงตามเวลาสร้างล่าสุด
- `sort=popular` — เรียงตามจำนวน likes มากสุด

```ts
const sort = searchParams.get("sort") ?? "newest";

// Determine orderBy based on sort parameter
const orderBy =
  sort === "popular"
    ? { likes: { _count: "desc" as const } }
    : { createdAt: "desc" as const };

const [articles, total] = await Promise.all([
  prisma.article.findMany({
    where,
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { likes: true } },
    },
    orderBy,
    skip,
    take: limit,
  }),
  prisma.article.count({ where }),
]);
```

#### 2. Sidebar Component (`web/app/components/Sidebar.tsx`)

แปลงเป็น Client Component และดึงข้อมูลแบบ dynamic:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type PopularArticle = {
  id: string;
  title: string;
  author: { id: string; name: string };
  likeCount: number;
};

export default function Sidebar() {
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopularArticles() {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/articles", {
          params: { sort: "popular", limit: 3 },
        });
        setPopularArticles(data.items);
      } catch (err) {
        console.error("Failed to fetch popular articles:", err);
        setPopularArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularArticles();
  }, []);

  return (
    <aside className="w-full lg:w-[296px] shrink-0">
      <div className="lg:sticky lg:top-24 space-y-8">
        {/* Popular Articles — dynamically sorted by like count */}
        <section>
          <h3 className="text-[13px] font-bold text-text-1 mb-4">
            Popular Articles
          </h3>
          {loading ? (
            <div className="text-sm text-text-3">Loading...</div>
          ) : popularArticles.length === 0 ? (
            <div className="text-sm text-text-3">No articles yet</div>
          ) : (
            <ul className="flex flex-col gap-4">
              {popularArticles.map((item) => (
                <li key={item.id}>
                  <Link href={`/articles/${item.id}`} className="block group">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-5 h-5 rounded-full bg-primary shrink-0 flex items-center justify-center text-white text-[10px] font-medium"
                        aria-hidden
                      >
                        {getInitials(item.author.name)}
                      </span>
                      <span className="text-xs font-medium text-text-1">
                        {item.author.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-text-1 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* ... rest of sidebar */}
      </div>
    </aside>
  );
}
```

### Files Changed

| File | Changes |
|------|---------|
| `web/app/api/articles/route.ts` | Add `sort` query parameter support with `popular` option |
| `web/app/components/Sidebar.tsx` | Convert to Client Component, fetch popular articles dynamically |

### Testing Checklist

- [ ] Sidebar displays 3 articles with most likes
- [ ] API returns articles sorted by likes when `sort=popular`
- [ ] API returns articles sorted by date when `sort=newest` or no sort param
- [ ] Loading state shows while fetching data
- [ ] "No articles yet" shows when database is empty
- [ ] Clicking article title navigates to article detail page

---

## 3.8 Recommended Topics from API

ปรับ Sidebar ให้ดึงหมวดหมู่ (Categories) จาก API แทนการใช้ static array เดิมที่ hardcoded ไว้ในไฟล์

### Requirements

1. **Dynamic Categories** — ดึง categories จากฐานข้อมูลผ่าน `/api/categories`
2. **Loading State** — แสดง loading ขณะดึงข้อมูล
3. **Empty State** — แสดง "No topics yet" เมื่อไม่มี categories
4. **Error Handling** — หากดึงข้อมูลล้มเหลว ให้แสดง empty array

### Implementation

#### Sidebar Component (`web/app/components/Sidebar.tsx`)

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const FOOTER_LINKS = [
  { label: "Help", href: "#" },
  { label: "About", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type PopularArticle = {
  id: string;
  title: string;
  author: { id: string; name: string };
  likeCount: number;
};

type Category = {
  id: number;
  name: string;
};

export default function Sidebar() {
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchPopularArticles() {
      try {
        setLoadingArticles(true);
        const { data } = await axios.get("/api/articles", {
          params: { sort: "popular", limit: 3 },
        });
        setPopularArticles(data.items);
      } catch (err) {
        console.error("Failed to fetch popular articles:", err);
        setPopularArticles([]);
      } finally {
        setLoadingArticles(false);
      }
    }

    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const { data } = await axios.get<{ items: Category[] }>("/api/categories");
        setCategories(data.items);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchPopularArticles();
    fetchCategories();
  }, []);

  return (
    <aside className="w-full lg:w-[296px] shrink-0">
      <div className="lg:sticky lg:top-24 space-y-8">
        {/* Popular Articles — dynamically sorted by like count */}
        <section>
          <h3 className="text-[13px] font-bold text-text-1 mb-4">
            Popular Articles
          </h3>
          {loadingArticles ? (
            <div className="text-sm text-text-3">Loading...</div>
          ) : popularArticles.length === 0 ? (
            <div className="text-sm text-text-3">No articles yet</div>
          ) : (
            <ul className="flex flex-col gap-4">
              {popularArticles.map((item) => (
                <li key={item.id}>
                  <Link href={`/articles/${item.id}`} className="block group">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-5 h-5 rounded-full bg-primary shrink-0 flex items-center justify-center text-white text-[10px] font-medium"
                        aria-hidden
                      >
                        {getInitials(item.author.name)}
                      </span>
                      <span className="text-xs font-medium text-text-1">
                        {item.author.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-text-1 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="h-px bg-border" />

        {/* Recommended topics */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-3 mb-4">
            Recommended topics
          </h3>
          {loadingCategories ? (
            <div className="text-sm text-text-3">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-text-3">No topics yet</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/topics/${category.name.toLowerCase()}`}
                  className="rounded-full bg-surface px-4 py-2 text-sm text-text-2 hover:bg-border hover:text-text-1 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="h-px bg-border" />

        {/* Footer links */}
        <footer className="flex flex-wrap gap-2 text-sm text-text-3">
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-2">
              <Link
                href={link.href}
                className="hover:text-text-2 transition-colors"
              >
                {link.label}
              </Link>
              {i < FOOTER_LINKS.length - 1 && <span>·</span>}
            </span>
          ))}
        </footer>
      </div>
    </aside>
  );
}
```

### API Endpoint (`web/app/api/categories/route.ts`)

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { statusId: 1 },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json({
      items: categories.map((c) => ({ id: c.id, name: c.name })),
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
```

### Files Changed

| File | Changes |
|------|---------|
| `web/app/components/Sidebar.tsx` | ดึง categories จาก API, แยก loading state |
| `web/app/api/categories/route.ts` | (มีอยู่แล้ว) ส่งรายการ categories จาก database |

### Testing Checklist

- [ ] Sidebar แสดง categories จาก database (ไม่ใช่ static array)
- [ ] Loading... แสดงขณะดึงข้อมูล categories
- [ ] "No topics yet" แสดงเมื่อไม่มี categories ใน database
- [ ] Categories เรียงตาม id จากน้อยไปมาก
- [ ] คลิกที่ topic แล้วนำไปยัง `/topics/{name}`
- [ ] หาก API ล้มเหลว ไม่มี error แสดงบน UI (graceful fallback)

---
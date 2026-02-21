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
- **Save draft:** ปุ่มถูก comment out ซ่อนไว้ก่อน
- **Publish:** `publish: true` → redirect ไป `/articles/[id]`
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
| **API articles** | POST `/api/articles` — auth, validate, markdown→HTML, สร้าง Article + ArticleCategory |
| **Write page** | Top bar ชิด navbar (`relative z-10 -mt-8`), fetch categories จาก API, Save draft ซ่อนไว้, Publish → redirect |
| **Article page** | แสดง `subtitle` ถ้ามี แทน excerpt |

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

#### web/app/api/articles/route.ts

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

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { statusId: 1 },
        include: {
          author: { select: { id: true, name: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where: { statusId: 1 } }),
    ]);

    const items = articles.map((a) => ({
      id: a.id,
      title: a.title,
      excerpt: excerptFromContent(a.content),
      author: { id: a.author.id, name: a.author.name },
      publishedAt: a.createdAt,
      readTimeMinutes: estimateReadTime(a.content),
      likeCount: a._count?.likes ?? 0,
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

#### web/app/write/page.tsx

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
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
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
      if (publish) {
        router.push(`/articles/${data.id}`);
      } else {
        setDraftStatus(`Draft saved ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`);
      }
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
          {draftStatus && (
            <span className="text-text-3 text-xs sm:text-[13px] truncate">
              {draftStatus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 order-2 sm:order-2 w-full sm:w-auto justify-end">
          {error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}
          {/* Save draft - ซ่อนไว้ก่อน
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
            className="px-4 py-2 text-text-2 hover:text-text-1 text-sm disabled:opacity-50"
          >
            Save draft
          </button>
          */}
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

#### web/app/articles/[id]/page.tsx

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
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
  const article = await prisma.article.findUnique({
    where: { id, statusId: 1 },
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
    <article className="max-w-[680px] mx-auto pt-12 pb-12 flex flex-col gap-6">
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
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
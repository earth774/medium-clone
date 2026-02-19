---
name: project-stack
description: Conventions and workflows for Next.js 16+, Pencil design (.pen), DBML/dbdiagram, Prisma, and Tailwind UI in this Medium clone. Use when implementing features, editing database schema, updating designs, or styling components.
---

# Project Stack — Next.js 16+, Pencil, DBML, Prisma, Tailwind

This project uses App Router (Next.js 16), Pencil for UI design, DBML for schema docs, Prisma with SQLite, and Tailwind v4. Follow these conventions when working in the repo.

---

## Next.js 16+ (App Router)

- **Routes**: Under `web/app/`. Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`. Prefer Server Components; add `'use client'` only for hooks, browser APIs, or event handlers.
- **Data**: Fetch in Server Components or route handlers. Never import Prisma in client components.
- **Details**: See `.cursor/rules/nextjs-core.mdc` for full conventions (always applied in this project).

---

## Pencil (design files)

- **Location**: `design/design.pen`, `design/slide.pen`. Contents are encrypted; **do not** read or edit `.pen` files with `Read` or `Grep`. Use **Pencil MCP tools only**.
- **When to use**: Reading or changing designs, validating layouts, applying style guides.
- **Workflow**:
  1. Start with `get_editor_state()` to see active file and selection.
  2. Discover content: `batch_get(patterns, nodeIds)` or `snapshot_layout` for layout.
  3. Edit: `batch_design(operations)` for insert/copy/update/replace/move/delete/image. Max ~25 operations per call.
  4. Guidelines: `get_guidelines(topic)` (code | table | tailwind | landing-page), then `get_style_guide(tags, name)` if needed.
- **Operations**: `I("parent", {...})`, `C("nodeId", "parent", {...})`, `R("nodeId", {...})`, `U("nodeId", {...})`, `D("nodeId")`, `M("nodeId", "parent", index)`, `G("nodeId", "ai", "description")` for AI image.

---

## DBML / dbdiagram

- **Source of truth**: `schema.dbml` at repo root. Describes tables, columns, refs, indexes, and notes (Thai/English).
- **Conventions**:
  - Tables: `status`, `user`, `article`, `category`, `article_category`, `article_like`. Use `ref: >` for FKs. Add `note` for field meaning.
  - Keep **in sync** with `web/prisma/schema.prisma`: when changing the database, update DBML first (or together), then Prisma schema, then migrate.
- **dbdiagram.io**: DBML can be imported/exported there for visual editing; export back to `schema.dbml` to keep repo current.

---

## Prisma

- **Schema**: `web/prisma/schema.prisma`. SQLite provider; `DATABASE_URL` in `web/.env` (e.g. `file:./dev.db`).
- **Client**: Generated to `web/app/generated/prisma`. Use **singleton** from `web/lib/prisma.ts` in server code; never `new PrismaClient()` in route handlers or components.
- **After schema change** (in order):
  1. `npx prisma generate` (from `web/`)
  2. `npx prisma migrate dev --name <name>`
  3. `npx prisma db seed` if seed data changed
- **Seed**: `web/prisma/seed.ts` (run via `npx prisma db seed`). Uses `tsx`; import client from project path if `output` is custom (e.g. `../app/generated/prisma/client`).
- **Models**: Match `schema.dbml` (Status, User, Article, Category, ArticleCategory, ArticleLike). Use `@@map("table_name")` for snake_case tables; `@map("column_name")` for snake_case columns.

---

## Tailwind UI (v4)

- **Setup**: `web/app/globals.css` uses `@import "tailwindcss"` and `@theme inline` for CSS variables (e.g. `--color-background`, `--font-sans`). Fonts from `next/font` (e.g. Inter) are applied via `className`.
- **Layout**: Constrained width, centered: `max-w-2xl mx-auto px-4 py-8`. Editorial, minimal look per PRD.
- **Patterns**: Utility-first; use design tokens from `:root`/`@theme` where needed. Prefer existing layout and typography patterns in `app/layout.tsx` and `app/components/Header.tsx`.
- **Pencil + Tailwind**: When implementing from Pencil, use `get_guidelines(topic: "tailwind")` and project Tailwind conventions for consistent UI.

---

## Quick reference

| Area      | Key files / tools |
|----------|--------------------|
| Next.js  | `web/app/`, `.cursor/rules/nextjs-core.mdc` |
| Pencil   | Pencil MCP only; `design/*.pen` |
| DBML     | `schema.dbml` (root) |
| Prisma   | `web/prisma/schema.prisma`, `web/lib/prisma.ts`, `web/app/generated/prisma` |
| Tailwind | `web/app/globals.css`, utility classes, `@theme` |

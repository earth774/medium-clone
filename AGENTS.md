## Learned User Preferences

- Communicate in Thai language (except code/technical terms)
- Always provide full file code (code ทั้งไฟล์), never diffs or partial snippets
- Use "@filename" or "@path/to/file" format when referencing files
- Update relevant .md files (e.g., Day_3.md) with complete code after each implementation
- Expect immediate documentation updates with numbered sections (3.x format)
- Prefer complete implementations (API + UI + documentation) in one go
- Prefer concise documentation, avoid verbose explanations
- Consolidate all content under a single section (e.g., 4.1 only)

## Learned Workspace Facts

- Next.js 16+ with App Router, Prisma ORM, PostgreSQL, Tailwind CSS, TypeScript
- Project structure uses `app/` directory, API routes in `app/api/`, components in `app/components/`
- Database models: Article (statusId: 1=published, 2=draft, 3=deleted), Category, User, ArticleLike - No Follow model exists
- API endpoints support pagination (page/limit) and sorting (newest, popular)
- Session-based auth via `getSession()` from `@/lib/auth`
- UI patterns use `max-w-[1024px]`, responsive breakpoints with `lg:`, `md:`
- Draft articles use orange styling (`bg-orange-100`, `text-orange-700`)
- Documentation format uses numbered sections (3.x) with requirements, implementation, files changed tables, and testing checklists
- Uses Pencil MCP tools for .pen design files with node IDs like `p3K9Q`, `FYiSq`
- Main pages: Home at `web/app/page.tsx`, Write at `web/app/write/page.tsx`, Article detail at `web/app/articles/[id]/page.tsx`, Profile at `web/app/profile/page.tsx`
- React Hooks must be called before any early returns to maintain consistent hook order

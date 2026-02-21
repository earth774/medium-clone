# Day 4: Soft Delete Article

## 4.1 Implementation

### API - DELETE /api/articles/[id]

**File:** `web/app/api/articles/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * DELETE /api/articles/[id]
 * Soft delete article by changing statusId from 1 (published) to 3 (deleted)
 * Only the article owner can delete their own article
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find article and verify ownership
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Verify the current user is the author
    if (article.authorId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own articles" },
        { status: 403 }
      );
    }

    // Check if article is already deleted
    if (article.statusId === 3) {
      return NextResponse.json(
        { error: "Article is already deleted" },
        { status: 400 }
      );
    }

    // Soft delete: update statusId to 3 (deleted)
    await prisma.article.update({
      where: { id },
      data: { statusId: 3 },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
      articleId: id,
    });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

```

### UI - DeleteArticleButton

**File:** `web/app/articles/[id]/DeleteArticleButton.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteArticleButtonProps {
  articleId: string;
}

export function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete article");
      }

      // Redirect to home page after successful deletion
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert(error instanceof Error ? error.message : "Failed to delete article");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 font-medium">
          Delete this article?
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Deleting...
            </>
          ) : (
            "Yes, Delete"
          )}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1.5 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  );
}

```

### Article Detail Page

**File:** `web/app/articles/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Share2, FilePen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentSection } from "./CommentSection";
import { DeleteArticleButton } from "./DeleteArticleButton";

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
        {/* Delete button - only visible to article owner */}
        {isOwner && (
          <DeleteArticleButton articleId={article.id} />
        )}
        <span className="flex items-center gap-1.5 text-sm text-text-2">
          <Share2 className="size-[14px]" strokeWidth={2} />
          Share
        </span>
      </div>

      {/* Body content */}
      <div
        className="prose prose-neutral max-w-none text-text-1
          /* Headings */
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
          /* Paragraphs */
          [&_p]:text-lg [&_p]:leading-[1.8] [&_p]:mb-4
          /* Lists */
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
          [&_li]:mb-1
          /* Code */
          [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0
          /* Blockquotes */
          [&_blockquote]:border-l-4 [&_blockquote]:border-text-1 [&_blockquote]:pl-4 [&_blockquote]:font-logo [&_blockquote]:text-xl [&_blockquote]:font-semibold [&_blockquote]:leading-normal [&_blockquote]:not-italic [&_blockquote]:mb-4
          /* Links */
          [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80
          /* Images */
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
          /* Horizontal rule */
          [&_hr]:my-8 [&_hr]:border-border
          /* Bold and Italic */
          [&_strong]:font-bold
          [&_em]:italic"
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

### Profile Page - ProfileArticleCard

**File:** `web/app/profile/ProfileArticleCard.tsx`

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Pencil, Trash2, Loader2 } from "lucide-react";

type ProfileArticleCardProps = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTimeMinutes: number;
  likeCount: number;
  onDelete?: (id: string) => Promise<void>;
};

export default function ProfileArticleCard({
  id,
  title,
  excerpt,
  publishedAt,
  readTimeMinutes,
  likeCount,
  onDelete,
}: ProfileArticleCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <article className="border-b border-border py-6">
      <div className="flex flex-col gap-3">
        <Link href={`/articles/${id}`} className="block group">
          <h2 className="text-xl font-semibold text-text-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>
        <p className="text-sm text-text-2 line-clamp-2">{excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-text-2">
          <span>{publishedAt}</span>
          <span>{readTimeMinutes} min read</span>
          <span
            className={`flex items-center gap-1 ${likeCount > 0 ? "text-like" : ""}`}
          >
            <Heart
              className="w-3.5 h-3.5"
              strokeWidth={2}
              fill={likeCount > 0 ? "currentColor" : "none"}
            />
            {likeCount}
          </span>
          <span className="flex-1" />
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-sm text-text-1 hover:bg-surface transition-colors flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
            Edit
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    ...
                  </>
                ) : (
                  "Yes"
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded border border-border px-3 py-1.5 text-sm text-text-1 hover:bg-surface transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

```

### Profile Page

**File:** `web/app/profile/page.tsx`

```typescript
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileArticleCard from "./ProfileArticleCard";
import { FilePen } from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTimeMinutes: number;
  likeCount: number;
  statusId: number;
};

type ProfileData = {
  user: {
    id: string;
    name: string;
    username: string | null;
    bio: string;
    followersCount: string;
    followingCount: string;
    isOwnProfile: boolean;
  };
  articles: Article[];
};

async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`/api/articles/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete article");
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"home" | "about">("home");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        // First, get current user session
        const sessionRes = await axios.get("/api/profile");
        const userId = sessionRes.data.user.id;

        // Then, fetch public profile data
        const profileRes = await axios.get<ProfileData>(`/api/users/${userId}`);
        setProfile(profileRes.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/profile");
          return;
        }
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  // All hooks must be before early returns
  const handleDelete = useCallback(async (id: string) => {
    await deleteArticle(id);
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        articles: prev.articles.filter((a) => a.id !== id),
      };
    });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-[728px] mx-auto pt-12 pb-12">
        <p className="text-text-2">Loading profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-[728px] mx-auto pt-12 pb-12">
        <p className="text-red-600">{error || "Failed to load profile"}</p>
      </div>
    );
  }

  const { user, articles } = profile;

  return (
    <div className="w-full max-w-[728px] mx-auto pt-12 pb-12 flex flex-col gap-8">
      <ProfileHeader
        name={user.name}
        bio={user.bio}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "home" && (
        <div className="flex flex-col">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-text-2">No articles yet.</p>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="relative">
                {article.statusId === 2 && (
                  <div className="absolute -top-2 left-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                      <FilePen className="w-3 h-3" />
                      Draft
                    </span>
                  </div>
                )}
                <div className={article.statusId === 2 ? "pt-4" : ""}>
                  <ProfileArticleCard
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    publishedAt={article.publishedAt}
                    readTimeMinutes={article.readTimeMinutes}
                    likeCount={article.likeCount}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "about" && (
        <div className="py-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-text-1">About</h2>
            <p className="text-text-2">
              {user.bio || "No bio yet."}
            </p>
            {user.username && (
              <p className="text-text-2">
                <span className="font-medium">Username:</span> @{user.username}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

```

### Files Changed


| File                                            | Type     |
| ----------------------------------------------- | -------- |
| `web/app/api/articles/[id]/route.ts`            | New      |
| `web/app/articles/[id]/DeleteArticleButton.tsx` | New      |
| `web/app/articles/[id]/page.tsx`                | Modified |
| `web/app/profile/ProfileArticleCard.tsx`        | Modified |
| `web/app/profile/page.tsx`                      | Modified |


## 4.2 Update Article

### Libraries Installed


| Package           | Version | Purpose                                                       |
| ----------------- | ------- | ------------------------------------------------------------- |
| `turndown`        | ^7.2.0  | Convert HTML content from database to Markdown for the editor |
| `@types/turndown` | ^7.2.0  | TypeScript type definitions for turndown                      |


**Why we need these:**

- `**turndown`**: Article content is stored as HTML in the database (converted from Markdown via `marked` when writing). To edit existing articles, we need to convert HTML back to Markdown so the MarkdownEditor can display and edit it properly.
- `**marked`**: Already installed (from POST /api/articles), used in PATCH to convert updated Markdown content back to HTML before saving.

```bash
npm install turndown
npm install -D @types/turndown
```

### API - PATCH /api/articles/[id]

**File:** `web/app/api/articles/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/articles/[id]
 * Get article by ID
 * - Owner can see all statuses (published, draft, deleted)
 * - Others can only see published articles
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

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

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const isOwner = session?.userId === article.authorId;

    // Non-owners can only see published articles
    if (!isOwner && article.statusId !== 1) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/articles/[id]
 * Update article (title, subtitle, content, statusId)
 * Only the article owner can update their own article
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find article and verify ownership
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Verify the current user is the author
    if (article.authorId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own articles" },
        { status: 403 }
      );
    }

    // Check if article is deleted
    if (article.statusId === 3) {
      return NextResponse.json(
        { error: "Cannot edit deleted article" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, subtitle, content, statusId } = body;

    // Validate required fields if provided
    if (title !== undefined && (!title || title.trim() === "")) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (content !== undefined && (!content || content.trim() === "")) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Validate statusId if provided
    if (statusId !== undefined && ![1, 2].includes(statusId)) {
      return NextResponse.json(
        { error: "Invalid status. Only 1 (published) or 2 (draft) allowed" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: {
      title?: string;
      subtitle?: string | null;
      content?: string;
      statusId?: number;
    } = {};

    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle.trim() || null;
    if (content !== undefined) {
      // Convert Markdown to HTML before saving
      const htmlContent = marked.parse(content.trim(), { async: false }) as string;
      updateData.content = htmlContent;
    }
    if (statusId !== undefined) updateData.statusId = statusId;

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true } },
        categories: {
          where: { statusId: 1 },
          include: { category: { select: { id: true, name: true } } },
        },
        _count: { select: { likes: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("PATCH /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles/[id]
 * Soft delete article by changing statusId from 1 (published) to 3 (deleted)
 * Only the article owner can delete their own article
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find article and verify ownership
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Verify the current user is the author
    if (article.authorId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own articles" },
        { status: 403 }
      );
    }

    // Check if article is already deleted
    if (article.statusId === 3) {
      return NextResponse.json(
        { error: "Article is already deleted" },
        { status: 400 }
      );
    }

    // Soft delete: update statusId to 3 (deleted)
    await prisma.article.update({
      where: { id },
      data: { statusId: 3 },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
      articleId: id,
    });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

```

### UI - Edit Article Page

**File:** `web/app/articles/[id]/edit/page.tsx`

```typescript
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const BIO_MAX = 160;

const inputBase =
  "h-10 w-full rounded border border-border bg-white px-3 text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[15px]";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-medium text-text-1">
        {label}
      </label>
      <div className="flex h-10 w-full items-center justify-between gap-2 rounded border border-border bg-white px-3 text-text-1 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-text-3 focus:outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 text-text-3 hover:text-text-2 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="w-5 h-5" aria-hidden />
          ) : (
            <Eye className="w-5 h-5" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/profile");
        const { user } = res.data;
        setName(user.name ?? "");
        setUsername(user.username ?? "");
        setBio(user.bio ?? "");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/profile/edit");
          return;
        }
        setProfileError("Failed to load profile");
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [router]);

  async function handleSaveProfile() {
    setProfileError(null);
    setProfileSuccess(false);
    if (!name.trim()) {
      setProfileError("Name is required");
      return;
    }
    setIsSavingProfile(true);
    try {
      await axios.patch("/api/profile", {
        name: name.trim(),
        username: username.trim() || undefined,
        bio: bio.trim(),
      });
      setProfileSuccess(true);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setProfileError(err.response.data.error);
      } else {
        setProfileError("Failed to update profile");
      }
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleUpdatePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await axios.patch("/api/profile/password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setPasswordError(err.response.data.error);
      } else {
        setPasswordError("Failed to update password");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  const bioCount = bio.length;
  const bioOverLimit = bioCount > BIO_MAX;

  if (isLoadingProfile) {
    return (
      <div className="w-full max-w-[500px] mx-auto pt-8 sm:pt-12 pb-12 flex justify-center">
        <p className="text-text-2">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto pt-8 sm:pt-12 pb-12 flex flex-col gap-6">
      {/* Profile card — matches epProfileCard */}
      <section
        className="rounded-lg border border-border bg-white px-10 py-12 flex flex-col gap-6"
        aria-labelledby="edit-profile-title"
      >
        <h1
          id="edit-profile-title"
          className="font-logo text-2xl font-semibold text-text-1"
        >
          Edit profile
        </h1>

        {profileError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" role="alert">
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded" role="status">
            Profile updated successfully.
          </p>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[28px] shrink-0"
            aria-hidden
          >
            {getInitials(name)}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-name" className="text-[13px] font-medium text-text-1">
            Name
          </label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputBase}
            placeholder="Your name"
          />
        </div>

        {/* Username — with @ prefix like design */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="edit-username"
            className="text-[13px] font-medium text-text-1"
          >
            Username
          </label>
          <div className="flex h-10 w-full items-center gap-0.5 rounded border border-border bg-white px-3 text-text-1 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
            <span className="text-[15px] text-text-3 shrink-0">@</span>
            <input
              id="edit-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-text-3 focus:outline-none"
              placeholder="username"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-bio" className="text-[13px] font-medium text-text-1">
            Bio
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={BIO_MAX}
            rows={4}
            className="min-h-[80px] w-full rounded border border-border bg-white px-3 py-2 text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y text-[14px]"
            placeholder="Tell readers about yourself"
          />
          <p
            className={`text-xs ${bioOverLimit ? "text-like" : "text-text-3"}`}
          >
            {bioCount} / {BIO_MAX}
          </p>
        </div>

        {/* Buttons — gap-3, h-11 → h-[44px] to match design */}
        <div className="flex flex-row gap-3">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="h-[44px] rounded-full bg-primary px-6 text-white font-medium text-[15px] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSavingProfile ? "Saving…" : "Save changes"}
          </button>
          <Link
            href="/profile"
            className="h-[44px] rounded-full flex items-center justify-center px-6 text-text-2 text-[15px] hover:text-text-1 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </section>

      {/* Password card — matches epPasswordCard */}
      <section
        className="rounded-lg border border-border bg-white px-10 py-12 flex flex-col gap-6"
        aria-labelledby="change-password-title"
      >
        <h2
          id="change-password-title"
          className="text-sm font-semibold text-text-1"
        >
          Change password
        </h2>

        {passwordError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded" role="alert">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded" role="status">
            Password updated successfully.
          </p>
        )}

        <div className="flex flex-col gap-6">
          <PasswordInput
            id="edit-current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordInput
            id="edit-new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordInput
            id="edit-confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={isUpdatingPassword}
          className="h-[44px] w-fit rounded-full bg-primary px-6 text-white font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUpdatingPassword ? "Updating…" : "Update password"}
        </button>
      </section>
    </div>
  );
}

```

### UI - Article Detail Page (Add Edit Button)

**File:** `web/app/articles/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Share2, FilePen, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentSection } from "./CommentSection";
import { DeleteArticleButton } from "./DeleteArticleButton";

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
        {/* Edit & Delete buttons - only visible to article owner */}
        {isOwner && (
          <>
            <Link
              href={`/articles/${article.id}/edit`}
              className="flex items-center gap-1.5 text-text-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <DeleteArticleButton articleId={article.id} />
          </>
        )}
        <span className="flex items-center gap-1.5 text-sm text-text-2">
          <Share2 className="size-[14px]" strokeWidth={2} />
          Share
        </span>
      </div>

      {/* Body content */}
      <div
        className="prose prose-neutral max-w-none text-text-1
          /* Headings */
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
          /* Paragraphs */
          [&_p]:text-lg [&_p]:leading-[1.8] [&_p]:mb-4
          /* Lists */
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
          [&_li]:mb-1
          /* Code */
          [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0
          /* Blockquotes */
          [&_blockquote]:border-l-4 [&_blockquote]:border-text-1 [&_blockquote]:pl-4 [&_blockquote]:font-logo [&_blockquote]:text-xl [&_blockquote]:font-semibold [&_blockquote]:leading-normal [&_blockquote]:not-italic [&_blockquote]:mb-4
          /* Links */
          [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80
          /* Images */
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
          /* Horizontal rule */
          [&_hr]:my-8 [&_hr]:border-border
          /* Bold and Italic */
          [&_strong]:font-bold
          [&_em]:italic"
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

### UI - ProfileArticleCard (Add Edit Link)

**File:** `web/app/profile/ProfileArticleCard.tsx`

```typescript
// Change Edit button to Link
<Link
  href={`/articles/${id}/edit`}
  className="rounded border border-border px-3 py-1.5 text-sm text-text-1 hover:bg-surface transition-colors flex items-center gap-1.5"
>
  <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
  Edit
</Link>
```

### Files Changed


| File                                     | Type     |
| ---------------------------------------- | -------- |
| `web/app/api/articles/[id]/route.ts`     | Modified |
| `web/app/articles/[id]/edit/page.tsx`    | New      |
| `web/app/articles/[id]/page.tsx`         | Modified |
| `web/app/profile/ProfileArticleCard.tsx` | Modified |


## 4.3 Like Article

### API - POST/GET /api/articles/[id]/like

**File:** `web/app/api/articles/[id]/like/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/articles/[id]/like
 * Toggle like on an article
 * - If user hasn't liked the article yet, create a new like
 * - If user has already liked, soft delete the like (statusId = 3)
 * - Only authenticated users can like articles
 */
export async function POST(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the article
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Cannot like deleted articles
    if (article.statusId === 3) {
      return NextResponse.json(
        { error: "Cannot like deleted article" },
        { status: 400 }
      );
    }

    // Check if user has already liked this article
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId: session.userId,
          articleId: id,
        },
      },
    });

    let isLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Toggle like status
      if (existingLike.statusId === 1) {
        // Unlike: soft delete by setting statusId to 3
        await prisma.articleLike.update({
          where: { id: existingLike.id },
          data: { statusId: 3 },
        });
        isLiked = false;
      } else {
        // Re-like: restore by setting statusId to 1
        await prisma.articleLike.update({
          where: { id: existingLike.id },
          data: { statusId: 1 },
        });
        isLiked = true;
      }
    } else {
      // Create new like
      await prisma.articleLike.create({
        data: {
          userId: session.userId,
          articleId: id,
          statusId: 1,
        },
      });
      isLiked = true;
    }

    // Get updated like count
    const countResult = await prisma.articleLike.count({
      where: {
        articleId: id,
        statusId: 1,
      },
    });
    likeCount = countResult;

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("POST /api/articles/[id]/like error:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/articles/[id]/like
 * Get like status for current user and total like count
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const session = await getSession();

    // Find the article
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Get total like count
    const likeCount = await prisma.articleLike.count({
      where: {
        articleId: id,
        statusId: 1,
      },
    });

    // Check if current user has liked (only if authenticated)
    let isLiked = false;
    if (session) {
      const existingLike = await prisma.articleLike.findUnique({
        where: {
          userId_articleId: {
            userId: session.userId,
            articleId: id,
          },
        },
      });
      isLiked = existingLike?.statusId === 1;
    }

    return NextResponse.json({
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("GET /api/articles/[id]/like error:", error);
    return NextResponse.json(
      { error: "Failed to fetch like status" },
      { status: 500 }
    );
  }
}

```

### UI - LikeButton Component

**File:** `web/app/articles/[id]/LikeButton.tsx`

```typescript
"use client";

import { useState, useCallback } from "react";
import { Heart, Loader2 } from "lucide-react";

interface LikeButtonProps {
  articleId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isAuthenticated: boolean;
}

export function LikeButton({
  articleId,
  initialLikeCount,
  initialIsLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/articles/${articleId}`;
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/articles/${articleId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to toggle like");
      }

      const data = await response.json();
      setIsLiked(data.isLiked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle like");
    } finally {
      setIsLoading(false);
    }
  }, [articleId, isAuthenticated, isLoading]);

  const hasLikes = likeCount > 0;

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1.5 text-[15px] transition-colors ${
        isLiked ? "text-like" : hasLikes ? "text-like" : "text-text-2"
      } hover:text-like disabled:opacity-50`}
      title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Sign in to like"}
    >
      {isLoading ? (
        <Loader2 className="w-[15px] h-[15px] animate-spin" />
      ) : (
        <Heart
          className="w-[15px] h-[15px]"
          strokeWidth={2}
          fill={isLiked || hasLikes ? "currentColor" : "none"}
        />
      )}
      {likeCount}
    </button>
  );
}

```

### UI - Article Detail Page (Add LikeButton)

**File:** `web/app/articles/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { Share2, FilePen, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentSection } from "./CommentSection";
import { DeleteArticleButton } from "./DeleteArticleButton";
import { LikeButton } from "./LikeButton";

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
      _count: {
        select: {
          likes: {
            where: { statusId: 1 },
          },
        },
      },
    },
  });

  if (!article) notFound();

  const isDraft = article.statusId === 2;
  const isOwner = currentUserId === article.author.id;
  const isAuthenticated = !!session;

  // Check if current user has liked this article
  let userLike = null;
  if (currentUserId) {
    userLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId: currentUserId,
          articleId: id,
        },
      },
    });
  }
  const isLiked = userLike?.statusId === 1;

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
        <LikeButton
          articleId={article.id}
          initialLikeCount={article._count.likes}
          initialIsLiked={isLiked}
          isAuthenticated={isAuthenticated}
        />
        <div className="flex-1" />
        {/* Edit & Delete buttons - only visible to article owner */}
        {isOwner && (
          <>
            <Link
              href={`/articles/${article.id}/edit`}
              className="flex items-center gap-1.5 text-text-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <DeleteArticleButton articleId={article.id} />
          </>
        )}
        <span className="flex items-center gap-1.5 text-sm text-text-2">
          <Share2 className="size-[14px]" strokeWidth={2} />
          Share
        </span>
      </div>

      {/* Body content */}
      <div
        className="prose prose-neutral max-w-none text-text-1
          /* Headings */
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
          /* Paragraphs */
          [&_p]:text-lg [&_p]:leading-[1.8] [&_p]:mb-4
          /* Lists */
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
          [&_li]:mb-1
          /* Code */
          [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0
          /* Blockquotes */
          [&_blockquote]:border-l-4 [&_blockquote]:border-text-1 [&_blockquote]:pl-4 [&_blockquote]:font-logo [&_blockquote]:text-xl [&_blockquote]:font-semibold [&_blockquote]:leading-normal [&_blockquote]:not-italic [&_blockquote]:mb-4
          /* Links */
          [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80
          /* Images */
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
          /* Horizontal rule */
          [&_hr]:my-8 [&_hr]:border-border
          /* Bold and Italic */
          [&_strong]:font-bold
          [&_em]:italic"
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

### Files Changed


| File                                      | Type     |
| ----------------------------------------- | -------- |
| `web/app/api/articles/[id]/like/route.ts` | New      |
| `web/app/articles/[id]/LikeButton.tsx`    | New      |
| `web/app/articles/[id]/page.tsx`          | Modified |



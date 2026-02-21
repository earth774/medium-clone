# Day 4: Soft Delete Article

## 4.1 Implementation

### API - DELETE /api/articles/[id]

**File:** `web/app/api/articles/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
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



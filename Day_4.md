# Day 4: Soft Delete Article

## 4.1 Implementation

### API - DELETE /api/articles/[id]

**File:** `web/app/api/articles/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, statusId: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (article.authorId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own articles" },
        { status: 403 }
      );
    }

    if (article.statusId === 3) {
      return NextResponse.json(
        { error: "Article is already deleted" },
        { status: 400 }
      );
    }

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
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete article");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete article");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 font-medium">Delete this article?</span>
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

### Page Integration

**File:** `web/app/articles/[id]/page.tsx`

```typescript
import { DeleteArticleButton } from "./DeleteArticleButton";

// In Action Bar:
{isOwner && <DeleteArticleButton articleId={article.id} />}
```

### Files Changed

| File | Type |
|------|------|
| `web/app/api/articles/[id]/route.ts` | New |
| `web/app/articles/[id]/DeleteArticleButton.tsx` | New |
| `web/app/articles/[id]/page.tsx` | Modified |

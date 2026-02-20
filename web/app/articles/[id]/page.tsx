import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id, statusId: 1 },
    include: { author: { select: { id: true, name: true } } },
  });

  if (!article) notFound();

  return (
    <article className="max-w-[680px] mx-auto py-8">
      <h1 className="text-3xl font-bold text-text-1 mb-4">{article.title}</h1>
      <div className="flex items-center gap-2 text-sm text-text-2 mb-8">
        <Link
          href={`/profile/${article.author.id}`}
          className="hover:text-primary transition-colors"
        >
          {article.author.name}
        </Link>
        <span>·</span>
        <time dateTime={article.createdAt.toISOString()}>
          {new Intl.DateTimeFormat("th-TH", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(article.createdAt)}
        </time>
      </div>
      <div
        className="prose prose-neutral max-w-none text-text-1"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

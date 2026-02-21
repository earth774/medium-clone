"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "./components/ArticleCard";
import Sidebar from "./components/Sidebar";

const PAGE_SIZE = 5;

type ArticleItem = {
  id: string;
  title: string;
  excerpt: string;
  author: { id: string; name: string };
  publishedAt: string;
  readTimeMinutes: number;
  likeCount?: number;
  statusId?: number;
};

type ApiResponse = {
  items: ArticleItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [pagination, setPagination] = useState<ApiResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const { data } = await axios.get<{ user: User | null }>("/api/auth/session");
        setCurrentUser(data.user);
      } catch {
        setCurrentUser(null);
      }
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get<ApiResponse>("/api/articles", {
          params: { page: currentPage, limit: PAGE_SIZE },
        });
        setArticles(data.items);
        setPagination(data.pagination);
      } catch (err) {
        setError("Failed to load articles");
        console.error("Fetch articles error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0 lg:max-w-[728px]">
          <div className="py-12 text-center text-text-2">Loading...</div>
        </div>
        <Sidebar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0 lg:max-w-[728px]">
          <div className="py-12 text-center text-text-2">{error}</div>
        </div>
        <Sidebar />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Left: Article Feed */}
      <div className="flex-1 min-w-0 lg:max-w-[728px]">
        <div className="flex flex-col gap-4">
          {articles.length === 0 ? (
            <div className="py-12 text-center text-text-2">
              <p>No articles yet. Check back soon!</p>
            </div>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                authorName={article.author.name}
                authorId={article.author.id}
                publishedAt={new Date(article.publishedAt)}
                readTimeMinutes={article.readTimeMinutes}
                likeCount={article.likeCount ?? 0}
                isLoggedIn={!!currentUser}
                currentUserId={currentUser?.id}
                statusId={article.statusId}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-text-2 hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-sm text-text-3">
              Page {currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm text-text-2 hover:text-text-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>

      {/* Right: Sidebar */}
      <Sidebar />
    </div>
  );
}

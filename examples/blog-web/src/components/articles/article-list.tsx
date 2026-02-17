"use client";

import { useState, useMemo, useEffect } from "react";
import { FileText, LayoutGrid, List } from "lucide-react";
import { useArticles } from "@/hooks/queries/use-articles";
import { ArticleCard } from "./article-card";
import { ArticleGridCard } from "./article-grid-card";
import { ArticleSearch } from "./article-search";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleListSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, ALL_CATEGORIES_OPTION, ITEMS_PER_PAGE } from "@/lib/constants";
import { stripHtml } from "@/lib/utils";
import type { ArticleFilters } from "@/application/dto/article.dto";

type ViewMode = "list" | "grid";

const VIEW_STORAGE_KEY = "blog-article-view";

export function ArticleList() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>(ALL_CATEGORIES_OPTION.value);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Restore view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "list" || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  const filters: ArticleFilters = {};
  if (category && category !== ALL_CATEGORIES_OPTION.value) {
    filters.category = category;
  }

  const { data, isLoading, isError, error, refetch } = useArticles({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: "createdAt",
    sortDirection: "desc",
    filters,
  });

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    if (!data?.items || !search.trim()) return data?.items || [];
    const query = search.toLowerCase();
    return data.items.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        stripHtml(article.content).toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [data?.items, search]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-4">
      {/* Search + Filters + View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ArticleSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_OPTION.value}>
                {ALL_CATEGORIES_OPTION.label}
              </SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handleViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<ArticleListSkeleton />}
        onRetry={() => refetch()}
      >
        {filteredItems.length > 0 ? (
          <>
            {search && (
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
              </p>
            )}

            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((article, index) => (
                  <ArticleGridCard
                    key={article.id}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            )}

            {!search && data && data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
                className="pt-4"
              />
            )}
          </>
        ) : search ? (
          <EmptyState
            icon={FileText}
            title="No results found"
            description={`No articles matching "${search}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="No articles yet"
            description="Write your first article to get started."
          />
        )}
      </QueryBoundary>
    </div>
  );
}

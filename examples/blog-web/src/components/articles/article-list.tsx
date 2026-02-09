"use client";

import { useState } from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useArticles } from "@/hooks/queries/use-articles";
import { ArticleCard } from "./article-card";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleListSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ArticleFilters } from "@/application/dto/article.dto";

const CATEGORIES = [
  { value: "__all__", label: "All Categories" },
  { value: "Technology", label: "Technology" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Travel", label: "Travel" },
  { value: "Food", label: "Food" },
];

export function ArticleList() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("__all__");
  const limit = 10;

  const filters: ArticleFilters = {};
  if (category && category !== "__all__") {
    filters.category = category;
  }

  const { data, isLoading, isError, error, refetch } = useArticles({
    page,
    limit,
    sortBy: "createdAt",
    sortDirection: "desc",
    filters,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<ArticleListSkeleton />}
        onRetry={() => refetch()}
      >
        {data && data.items.length > 0 ? (
          <>
            <div className="space-y-3">
              {data.items.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  {data.pagination.page} / {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
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

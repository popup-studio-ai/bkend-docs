"use client";

import { useState } from "react";
import { Bookmark as BookmarkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useBookmarks } from "@/hooks/queries/use-bookmarks";
import { useArticle } from "@/hooks/queries/use-articles";
import { ArticleCard } from "@/components/articles/article-card";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Bookmark } from "@/application/dto/bookmark.dto";

function BookmarkItem({
  bookmark,
  index,
}: {
  bookmark: Bookmark;
  index: number;
}) {
  const { data: article, isLoading } = useArticle(bookmark.articleId);

  if (isLoading) {
    return (
      <div className="flex gap-4 rounded-lg border p-4">
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  return <ArticleCard article={article} index={index} />;
}

export function BookmarkList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useBookmarks(page, 10);

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border p-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      }
      onRetry={() => refetch()}
    >
      {data && data.items.length > 0 ? (
        <>
          <div className="space-y-3">
            {data.items.map((bookmark, index) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
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
          icon={BookmarkIcon}
          title="No bookmarked articles"
          description="Bookmark articles you like to save them here."
        />
      )}
    </QueryBoundary>
  );
}

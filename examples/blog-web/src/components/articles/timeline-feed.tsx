"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { usePublishedArticles } from "@/hooks/queries/use-articles";
import { TimelineCard } from "./timeline-card";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleListSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { TIMELINE_PAGE_SIZE } from "@/lib/constants";

export function TimelineFeed() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = usePublishedArticles({
    page,
    limit: TIMELINE_PAGE_SIZE,
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-6">
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<ArticleListSkeleton />}
        onRetry={() => refetch()}
      >
        {data && data.items.length > 0 ? (
          <>
            <div className="space-y-5">
              {data.items.map((article, index) => (
                <TimelineCard
                  key={article.id}
                  article={article}
                  index={index}
                />
              ))}
            </div>

            {data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
                className="pt-4"
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="No articles yet"
            description="Check back later for new articles."
          />
        )}
      </QueryBoundary>
    </div>
  );
}

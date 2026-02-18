"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticles } from "@/hooks/queries/use-articles";
import { useMe } from "@/hooks/queries/use-auth";
import { ArticleCard } from "./article-card";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleListSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export function MyArticleList() {
  const [tab, setTab] = useState<"published" | "drafts">("published");
  const [page, setPage] = useState(1);
  const { data: currentUser } = useMe();

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const isPublished = tab === "published";

  const { data, isLoading, isError, error, refetch } = useArticles({
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: "createdAt",
    sortDirection: "desc",
    filters: {
      createdBy: currentUser?.id,
      isPublished,
    },
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "published" | "drafts")}>
        <TabsList>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <QueryBoundary
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingFallback={<ArticleListSkeleton />}
            onRetry={() => refetch()}
          >
            {data && data.items.length > 0 ? (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  {data.pagination.total} {isPublished ? "published" : "draft"} article{data.pagination.total !== 1 ? "s" : ""}
                </p>

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
                title={isPublished ? "No published articles" : "No drafts"}
                description={
                  isPublished
                    ? "Publish your articles to see them here."
                    : "Your draft articles will appear here."
                }
              />
            )}
          </QueryBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

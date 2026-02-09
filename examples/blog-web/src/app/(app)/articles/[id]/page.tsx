"use client";

import { use } from "react";
import { useArticle } from "@/hooks/queries/use-articles";
import { ArticleDetail } from "@/components/articles/article-detail";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleDetailSkeleton } from "@/components/shared/loading-skeleton";
import { PageTransition } from "@/components/motion/page-transition";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  const { data: article, isLoading, isError, error, refetch } = useArticle(id);

  return (
    <PageTransition>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<ArticleDetailSkeleton />}
        onRetry={() => refetch()}
      >
        {article && <ArticleDetail article={article} />}
      </QueryBoundary>
    </PageTransition>
  );
}

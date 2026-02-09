"use client";

import { use } from "react";
import { useArticle } from "@/hooks/queries/use-articles";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleForm } from "@/components/articles/article-form";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { PageTransition } from "@/components/motion/page-transition";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = use(params);
  const { data: article, isLoading, isError, error, refetch } = useArticle(id);

  return (
    <PageTransition className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Edit Article"
        description="Edit your blog article"
      />
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<FormSkeleton />}
        onRetry={() => refetch()}
      >
        {article && <ArticleForm article={article} />}
      </QueryBoundary>
    </PageTransition>
  );
}

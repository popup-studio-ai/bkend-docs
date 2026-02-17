"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArticle } from "@/hooks/queries/use-articles";
import { useMe } from "@/hooks/queries/use-auth";
import { ArticleDetail } from "@/components/articles/article-detail";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleDetailSkeleton } from "@/components/shared/loading-skeleton";
import { PageTransition } from "@/components/motion/page-transition";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: article, isLoading, isError, error, refetch } = useArticle(id);
  const { data: currentUser } = useMe();

  // Access control: unpublished articles are only visible to the author
  useEffect(() => {
    if (article && !article.isPublished && currentUser?.id !== article.createdBy) {
      router.push("/articles");
    }
  }, [article, currentUser, router]);

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

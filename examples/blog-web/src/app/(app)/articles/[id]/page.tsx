"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArticle, usePublishedArticle } from "@/hooks/queries/use-articles";
import { useMe } from "@/hooks/queries/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { ArticleDetail } from "@/components/articles/article-detail";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ArticleDetailSkeleton } from "@/components/shared/loading-skeleton";
import { PageTransition } from "@/components/motion/page-transition";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

/** Authenticated article detail: author can edit/delete */
function AuthenticatedArticleDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: article, isLoading, isError, error, refetch } = useArticle(id);
  const { data: currentUser } = useMe();

  // Access control: unpublished articles are only visible to the author
  useEffect(() => {
    if (article && !article.isPublished && currentUser?.id !== article.createdBy) {
      router.push("/articles");
    }
  }, [article, currentUser, router]);

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={<ArticleDetailSkeleton />}
      onRetry={() => refetch()}
    >
      {article && <ArticleDetail article={article} />}
    </QueryBoundary>
  );
}

/** Public article detail: read-only, published articles only */
function PublicArticleDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: article, isLoading, isError, error, refetch } =
    usePublishedArticle(id);

  // If the article is not published, redirect to home
  useEffect(() => {
    if (article && !article.isPublished) {
      router.push("/");
    }
  }, [article, router]);

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={<ArticleDetailSkeleton />}
      onRetry={() => refetch()}
    >
      {article && article.isPublished && (
        <ArticleDetail article={article} readOnly />
      )}
    </QueryBoundary>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <PageTransition>
      {isAuthenticated ? (
        <AuthenticatedArticleDetail id={id} />
      ) : (
        <PublicArticleDetail id={id} />
      )}
    </PageTransition>
  );
}

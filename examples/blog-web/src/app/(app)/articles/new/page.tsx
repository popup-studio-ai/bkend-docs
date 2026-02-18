"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ArticleForm } from "@/components/articles/article-form";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useDemoGuard } from "@/hooks/use-demo-guard";

export default function NewArticlePage() {
  const { isDemoAccount } = useDemoGuard();

  return (
    <AuthGuard>
      <PageTransition className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="New Article"
          description="Write a new blog article"
        />
        <ArticleForm disabled={isDemoAccount} />
      </PageTransition>
    </AuthGuard>
  );
}

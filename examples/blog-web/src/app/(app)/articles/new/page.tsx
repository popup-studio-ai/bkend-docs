"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ArticleForm } from "@/components/articles/article-form";
import { PageTransition } from "@/components/motion/page-transition";

export default function NewArticlePage() {
  return (
    <PageTransition className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New Article"
        description="Write a new blog article"
      />
      <ArticleForm />
    </PageTransition>
  );
}

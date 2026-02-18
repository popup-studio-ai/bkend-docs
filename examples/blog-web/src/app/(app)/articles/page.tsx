"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleList } from "@/components/articles/article-list";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useDemoGuard } from "@/hooks/use-demo-guard";

export default function ArticlesPage() {
  const { isDemoAccount } = useDemoGuard();

  return (
    <AuthGuard>
      <PageTransition className="space-y-6">
        <PageHeader
          title="Articles"
          description="Browse your blog articles"
          actions={
            isDemoAccount ? (
              <Button disabled>
                <PenSquare className="mr-2 h-4 w-4" />
                New Article
              </Button>
            ) : (
              <Button asChild>
                <Link href="/articles/new">
                  <PenSquare className="mr-2 h-4 w-4" />
                  New Article
                </Link>
              </Button>
            )
          }
        />
        <ArticleList />
      </PageTransition>
    </AuthGuard>
  );
}

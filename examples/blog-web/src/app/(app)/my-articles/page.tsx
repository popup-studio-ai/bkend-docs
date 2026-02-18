"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { MyArticleList } from "@/components/articles/my-article-list";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useDemoGuard } from "@/hooks/use-demo-guard";

export default function MyArticlesPage() {
  const { isDemoAccount } = useDemoGuard();

  return (
    <AuthGuard>
      <PageTransition className="space-y-6">
        <PageHeader
          title="My Posts"
          description="Manage your published and draft articles"
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
        <MyArticleList />
      </PageTransition>
    </AuthGuard>
  );
}

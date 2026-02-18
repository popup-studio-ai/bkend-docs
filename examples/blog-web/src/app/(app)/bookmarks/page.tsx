"use client";

import { PageHeader } from "@/components/shared/page-header";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { PageTransition } from "@/components/motion/page-transition";
import { AuthGuard } from "@/components/shared/auth-guard";

export default function BookmarksPage() {
  return (
    <AuthGuard>
      <PageTransition className="space-y-6">
        <PageHeader
          title="Bookmarks"
          description="View your saved articles"
        />
        <BookmarkList />
      </PageTransition>
    </AuthGuard>
  );
}

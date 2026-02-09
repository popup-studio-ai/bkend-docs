"use client";

import { PageHeader } from "@/components/shared/page-header";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { PageTransition } from "@/components/motion/page-transition";

export default function BookmarksPage() {
  return (
    <PageTransition className="space-y-6">
      <PageHeader
        title="Bookmarks"
        description="View your saved articles"
      />
      <BookmarkList />
    </PageTransition>
  );
}

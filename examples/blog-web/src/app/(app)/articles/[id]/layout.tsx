import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article",
  description: "Read the full article with related content and bookmarks.",
};

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

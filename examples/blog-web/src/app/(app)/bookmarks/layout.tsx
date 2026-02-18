import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "View and manage your saved articles.",
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Browse and discover blog articles on backend development, AI-native tools, and modern app building.",
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

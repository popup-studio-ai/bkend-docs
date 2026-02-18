import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Article",
  description: "Write and publish a new blog article.",
};

export default function NewArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

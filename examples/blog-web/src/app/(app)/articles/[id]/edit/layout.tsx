import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Article",
  description: "Edit and update your blog article.",
};

export default function EditArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

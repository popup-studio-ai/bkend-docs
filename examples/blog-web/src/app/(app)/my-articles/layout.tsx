import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Posts",
  description: "Manage your published and draft blog articles.",
};

export default function MyArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

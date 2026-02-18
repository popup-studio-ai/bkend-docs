import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reviews | bkend Mall",
  description: "Manage your product reviews",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

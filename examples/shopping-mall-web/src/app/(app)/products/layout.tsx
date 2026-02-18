import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | bkend Mall",
  description: "Browse all products in the bkend Mall",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

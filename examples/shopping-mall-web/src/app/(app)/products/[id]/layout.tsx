import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Detail | bkend Mall",
  description: "View product details",
};

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail | bkend Mall",
  description: "View order details",
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

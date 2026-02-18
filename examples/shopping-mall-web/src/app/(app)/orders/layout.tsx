import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | bkend Mall",
  description: "Track your orders",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Settings | bkend Mall",
  description: "Manage your account",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

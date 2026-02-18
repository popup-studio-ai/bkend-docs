import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Management",
  description: "Manage your account settings and data.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

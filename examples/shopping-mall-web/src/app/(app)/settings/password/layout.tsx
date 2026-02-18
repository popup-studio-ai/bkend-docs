import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password | Settings | bkend Mall",
  description: "Change your password",
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your password to keep your account secure.",
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

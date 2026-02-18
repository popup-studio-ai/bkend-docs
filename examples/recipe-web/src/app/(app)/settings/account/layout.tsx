import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account.",
};

export default function AccountSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

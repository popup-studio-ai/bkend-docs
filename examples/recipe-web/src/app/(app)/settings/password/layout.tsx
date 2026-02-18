import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your password.",
};

export default function PasswordSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

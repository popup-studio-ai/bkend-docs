import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | bkend Blog",
  },
  description: "Your personalized blog dashboard with stats, recent articles, and quick actions.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

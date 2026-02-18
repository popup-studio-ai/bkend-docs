import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";

export const metadata: Metadata = {
  title: "Shopping Lists",
  description: "Manage your shopping lists.",
};

export default function ShoppingListsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

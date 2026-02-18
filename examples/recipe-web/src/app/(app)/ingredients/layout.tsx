import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Manage recipe ingredients.",
};

export default function IngredientsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

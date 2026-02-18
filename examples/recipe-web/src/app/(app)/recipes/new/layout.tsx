import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";

export const metadata: Metadata = {
  title: "New Recipe",
  description: "Create a new recipe.",
};

export default function NewRecipeLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

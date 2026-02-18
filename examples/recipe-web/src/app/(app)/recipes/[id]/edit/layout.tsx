import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";

export const metadata: Metadata = {
  title: "Edit Recipe",
  description: "Edit your recipe.",
};

export default function EditRecipeLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

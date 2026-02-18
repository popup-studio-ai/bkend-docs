import type { Metadata } from "next";
import { AuthGuard } from "@/components/shared/auth-guard";

export const metadata: Metadata = {
  title: "Meal Plans",
  description: "Plan your weekly meals.",
};

export default function MealPlansLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Detail",
  description: "View recipe details, ingredients, and cooking logs.",
};

export default function RecipeDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

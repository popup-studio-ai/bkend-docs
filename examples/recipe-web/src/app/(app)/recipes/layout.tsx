import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Browse and discover recipes.",
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

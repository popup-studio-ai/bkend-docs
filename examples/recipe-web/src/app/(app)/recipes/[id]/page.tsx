"use client";

import { use } from "react";
import { RecipeDetail } from "@/components/recipes/recipe-detail";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}

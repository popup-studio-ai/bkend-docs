"use client";

import { use } from "react";
import { IngredientForm } from "@/components/ingredients/ingredient-form";

export default function IngredientsByRecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = use(params);
  return <IngredientForm recipeId={recipeId} />;
}

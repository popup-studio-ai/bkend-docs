"use client";

import { use } from "react";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { useRecipe } from "@/hooks/queries/use-recipes";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: recipe, isLoading, isError, error, refetch } = useRecipe(id);

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={<DetailSkeleton />}
      onRetry={() => refetch()}
    >
      {recipe && <RecipeForm recipe={recipe} />}
    </QueryBoundary>
  );
}

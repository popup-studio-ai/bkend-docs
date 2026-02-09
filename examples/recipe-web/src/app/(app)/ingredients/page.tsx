"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RecipeListSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageTransition } from "@/components/motion/page-transition";
import { useRecipes } from "@/hooks/queries/use-recipes";
import { DIFFICULTY_LABELS } from "@/application/dto/recipe.dto";
import { formatTime } from "@/lib/format";
import { motion } from "framer-motion";

export default function IngredientsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useRecipes(page, 20);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Ingredients"
          description="Select a recipe to manage its ingredients"
        />

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<RecipeListSkeleton count={6} />}
          onRetry={() => refetch()}
        >
          {data && data.items.length > 0 ? (
            <div className="space-y-3">
              {data.items.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/ingredients/${recipe.id}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-stone-700">
                          <UtensilsCrossed className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                            {recipe.title}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {recipe.category} | {formatTime(recipe.cookingTime)}{" "}
                            | {recipe.servings} servings
                          </p>
                        </div>
                        <Badge variant="outline">
                          {DIFFICULTY_LABELS[recipe.difficulty]}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}

              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    className="text-sm text-orange-600 hover:underline disabled:opacity-50 dark:text-orange-400"
                    disabled={!data.pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-stone-500">
                    {data.pagination.page} / {data.pagination.totalPages}
                  </span>
                  <button
                    className="text-sm text-orange-600 hover:underline disabled:opacity-50 dark:text-orange-400"
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={ChefHat}
              title="No recipes yet"
              description="Add a recipe first to manage its ingredients"
            />
          )}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}

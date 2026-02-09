"use client";

import { UtensilsCrossed } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { useIngredients } from "@/hooks/queries/use-ingredients";
import { convertAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IngredientListProps {
  recipeId: string;
  originalServings: number;
  targetServings: number;
}

export function IngredientList({
  recipeId,
  originalServings,
  targetServings,
}: IngredientListProps) {
  const { data, isLoading, isError, error, refetch } =
    useIngredients(recipeId);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingFallback={<TableSkeleton />}
      onRetry={() => refetch()}
    >
      {data && data.items.length > 0 ? (
        <ul className="space-y-2">
          {data.items.map((ingredient) => {
            const isChecked = checkedIds.has(ingredient.id);
            const adjustedAmount = convertAmount(
              ingredient.amount,
              originalServings,
              targetServings
            );

            return (
              <li
                key={ingredient.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-orange-50 dark:hover:bg-stone-800"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleCheck(ingredient.id)}
                />
                <span
                  className={cn(
                    "flex-1 text-sm text-stone-700 dark:text-stone-300",
                    isChecked && "line-through text-stone-400 dark:text-stone-500"
                  )}
                >
                  {ingredient.name}
                  {ingredient.isOptional && (
                    <span className="ml-1 text-xs text-stone-400">(optional)</span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium text-stone-600 dark:text-stone-400",
                    isChecked && "line-through text-stone-400 dark:text-stone-500"
                  )}
                >
                  {adjustedAmount} {ingredient.unit}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={UtensilsCrossed}
          title="No ingredients yet"
          description="Add ingredients from the ingredients management page"
        />
      )}
    </QueryBoundary>
  );
}

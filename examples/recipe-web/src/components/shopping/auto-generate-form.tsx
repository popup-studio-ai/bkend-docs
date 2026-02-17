"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2, ShoppingCart, ChefHat, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { RecipeListSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/shared/empty-state";
import { useRecipes } from "@/hooks/queries/use-recipes";
import { useCreateShoppingList } from "@/hooks/queries/use-shopping-lists";
import { getIngredientsByRecipe } from "@/lib/api/ingredients";
import type { ShoppingItem } from "@/application/dto/shopping-list.dto";

const formSchema = z.object({
  name: z.string().min(1, "Please enter a list name"),
});

type FormData = z.infer<typeof formSchema>;

export function AutoGenerateForm() {
  const router = useRouter();
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<string>>(
    new Set()
  );
  const { data: recipesData, isLoading, isError, error, refetch } =
    useRecipes(1, 50);
  const createList = useCreateShoppingList();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `Shopping ${format(new Date(), "M/d")}`,
    },
  });

  const toggleRecipe = (id: string) => {
    setSelectedRecipeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onSubmit = async (data: FormData) => {
    // Fetch ingredients for each selected recipe
    const allIngredients: ShoppingItem[] = [];

    for (const recipeId of selectedRecipeIds) {
      try {
        const result = await getIngredientsByRecipe(recipeId);
        for (const ing of result.items) {
          allIngredients.push({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            checked: false,
            recipeId,
          });
        }
      } catch {
        // Skip this recipe on error
      }
    }

    // Merge ingredients with same name+unit
    const merged = mergeIngredients(allIngredients);

    const created = await createList.mutateAsync({
      name: data.name,
      date: format(new Date(), "yyyy-MM-dd"),
      items: merged,
      totalItems: merged.length,
      checkedItems: 0,
    });

    router.push(`/shopping-lists/${created.id}`);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Generate Shopping List"
          description="Select recipes to auto-generate a shopping list"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* List name */}
          <Card>
            <CardHeader>
              <CardTitle>List Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  placeholder="Shopping list name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recipe selection */}
          <Card>
            <CardHeader>
              <CardTitle>
                Select Recipes{" "}
                <span className="text-sm font-normal text-stone-500">
                  ({selectedRecipeIds.size} selected)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QueryBoundary
                isLoading={isLoading}
                isError={isError}
                error={error}
                loadingFallback={<RecipeListSkeleton count={3} />}
                onRetry={() => refetch()}
              >
                {recipesData && recipesData.items.length > 0 ? (
                  <div className="space-y-2">
                    {recipesData.items.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="flex items-center gap-3 rounded-lg border border-orange-100 p-3 transition-colors hover:bg-orange-50 dark:border-stone-700 dark:hover:bg-stone-800 cursor-pointer"
                        onClick={() => toggleRecipe(recipe.id)}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border shadow-sm transition-colors",
                            selectedRecipeIds.has(recipe.id)
                              ? "bg-orange-500 border-orange-500 text-white"
                              : "border-orange-300 dark:border-stone-600"
                          )}
                        >
                          {selectedRecipeIds.has(recipe.id) && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                            {recipe.title}
                          </p>
                          <p className="text-xs text-stone-400">
                            {recipe.category} | {recipe.servings} servings
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ChefHat}
                    title="No recipes yet"
                    description="Please add recipes first"
                  />
                )}
              </QueryBoundary>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                selectedRecipeIds.size === 0 || createList.isPending
              }
            >
              {createList.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              Create List
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

/**
 * Merges ingredients with the same name + unit.
 * Adds numeric amounts; keeps the first value for non-numeric amounts.
 */
function mergeIngredients(items: ShoppingItem[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const item of items) {
    const key = `${item.name}||${item.unit}`;
    const existing = map.get(key);

    if (existing) {
      const existingNum = parseFloat(existing.amount);
      const currentNum = parseFloat(item.amount);

      if (!isNaN(existingNum) && !isNaN(currentNum)) {
        existing.amount = String(existingNum + currentNum);
      }
      // Keep first value for non-numeric amounts
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values());
}

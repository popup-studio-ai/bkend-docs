"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/shared/page-header";
import {
  useIngredients,
  useCreateIngredient,
  useDeleteIngredient,
} from "@/hooks/queries/use-ingredients";
import { useRecipe } from "@/hooks/queries/use-recipes";
import { UNIT_OPTIONS } from "@/application/dto/ingredient.dto";
import { cn } from "@/lib/utils";

const ingredientSchema = z.object({
  name: z.string().min(1, "Please enter ingredient name"),
  amount: z.string().min(1, "Please enter amount"),
  unit: z.string().min(1, "Please select a unit"),
  isOptional: z.boolean().default(false),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  recipeId: string;
}

export function IngredientForm({ recipeId }: IngredientFormProps) {
  const { data: recipe } = useRecipe(recipeId);
  const {
    data: ingredients,
    isLoading,
    isError,
    error,
    refetch,
  } = useIngredients(recipeId);
  const createIngredient = useCreateIngredient();
  const deleteIngredient = useDeleteIngredient(recipeId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      isOptional: false,
    },
  });

  const onSubmit = async (data: IngredientFormData) => {
    const nextIndex = ingredients?.items.length ?? 0;
    await createIngredient.mutateAsync({
      recipeId,
      name: data.name,
      amount: data.amount,
      unit: data.unit,
      orderIndex: nextIndex,
      isOptional: data.isOptional,
    });
    reset();
  };

  const handleDelete = async (id: string) => {
    await deleteIngredient.mutateAsync(id);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title={recipe ? `${recipe.title} - Ingredients` : "Ingredients"}
          description="Add and manage ingredients for this recipe"
        />

        {/* Add ingredient form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Onion"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="w-full sm:w-24 space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="1"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-xs text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-32 space-y-1">
                <Label>Unit</Label>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center gap-2 pt-1 sm:pt-0">
                <Controller
                  name="isOptional"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label className="text-xs whitespace-nowrap">Optional</Label>
              </div>

              <Button
                type="submit"
                disabled={createIngredient.isPending}
                className="sm:w-auto"
              >
                {createIngredient.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Ingredient list */}
        <Card>
          <CardHeader>
            <CardTitle>
              Ingredient List{" "}
              {ingredients && (
                <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
                  ({ingredients.items.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QueryBoundary
              isLoading={isLoading}
              isError={isError}
              error={error}
              loadingFallback={<TableSkeleton />}
              onRetry={() => refetch()}
            >
              {ingredients && ingredients.items.length > 0 ? (
                <ul className="space-y-1">
                  {ingredients.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-orange-50 dark:hover:bg-stone-800"
                    >
                      <GripVertical className="h-4 w-4 text-stone-400 cursor-grab" />
                      <span className="flex-1 text-sm text-stone-700 dark:text-stone-300">
                        {item.name}
                        {item.isOptional && (
                          <span className="ml-1.5 text-xs text-stone-400">
                            (optional)
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                        {item.amount} {item.unit}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-400 hover:text-red-500"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteIngredient.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={Plus}
                  title="No ingredients yet"
                  description="Add ingredients using the form above"
                />
              )}
            </QueryBoundary>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}

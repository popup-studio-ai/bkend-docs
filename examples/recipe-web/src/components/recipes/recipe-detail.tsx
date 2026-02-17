"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Users,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { IngredientList } from "@/components/ingredients/ingredient-list";
import { ServingConverter } from "@/components/ingredients/serving-converter";
import { CookingLogForm } from "@/components/cooking-logs/cooking-log-form";
import { CookingLogList } from "@/components/cooking-logs/cooking-log-list";
import { PageTransition } from "@/components/motion/page-transition";
import { useRecipe, useDeleteRecipe } from "@/hooks/queries/use-recipes";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from "@/application/dto/recipe.dto";
import { formatTime, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RecipeDetailProps {
  recipeId: string;
}

export function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const router = useRouter();
  const { data: recipe, isLoading, isError, error, refetch } = useRecipe(recipeId);
  const deleteRecipe = useDeleteRecipe();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetServings, setTargetServings] = useState<number | null>(null);

  const handleDelete = async () => {
    await deleteRecipe.mutateAsync(recipeId);
    router.push("/recipes");
  };

  return (
    <PageTransition>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<DetailSkeleton />}
        onRetry={() => refetch()}
      >
        {recipe && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push("/recipes")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Button>
              <div className="flex gap-2">
                <Link href={`/recipes/${recipe.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Recipe</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete &quot;{recipe.title}&quot;?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteRecipe.isPending}
                      >
                        {deleteRecipe.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Image (Parallax-like) */}
            <div className="relative h-64 overflow-hidden rounded-xl bg-orange-100 sm:h-80 lg:h-96 dark:bg-stone-700">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Badge
                  className={cn(
                    "mb-2",
                    DIFFICULTY_COLORS[recipe.difficulty]
                  )}
                >
                  {DIFFICULTY_LABELS[recipe.difficulty]}
                </Badge>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {recipe.title}
                </h1>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4">
              <Card className="flex-1 min-w-[120px]">
                <CardContent className="flex items-center gap-3 p-4">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Cooking Time
                    </p>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {formatTime(recipe.cookingTime)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 min-w-[120px]">
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Servings
                    </p>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {recipe.servings} servings
                    </p>
                  </div>
                </CardContent>
              </Card>
              {recipe.category && (
                <Card className="flex-1 min-w-[120px]">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="text-xl">🏷️</span>
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Category
                      </p>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">
                        {recipe.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-700 leading-relaxed dark:text-stone-300">
                  {recipe.description}
                </p>
                <Separator className="my-4" />
                <p className="text-xs text-stone-400">
                  Created: {formatDate(recipe.createdAt, "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <ServingConverter
                  originalServings={recipe.servings}
                  targetServings={targetServings ?? recipe.servings}
                  onServingsChange={setTargetServings}
                />
              </CardHeader>
              <CardContent>
                <IngredientList
                  recipeId={recipe.id}
                  originalServings={recipe.servings}
                  targetServings={targetServings ?? recipe.servings}
                />
              </CardContent>
            </Card>

            {/* Cooking Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Cooking Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CookingLogForm recipeId={recipe.id} />
                <Separator />
                <CookingLogList recipeId={recipe.id} />
              </CardContent>
            </Card>
          </div>
        )}
      </QueryBoundary>
    </PageTransition>
  );
}

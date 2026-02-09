"use client";

import { useState } from "react";
import { ChefHat, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RecipeListSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { RecipeCard } from "./recipe-card";
import { PageTransition } from "@/components/motion/page-transition";
import { useRecipes } from "@/hooks/queries/use-recipes";
import type { Difficulty, RecipeFilters } from "@/application/dto/recipe.dto";
import { RECIPE_CATEGORIES, DIFFICULTY_LABELS } from "@/application/dto/recipe.dto";

export function RecipeList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RecipeFilters>({});

  const { data, isLoading, isError, error, refetch } = useRecipes(
    page,
    12,
    filters
  );

  const handleDifficultyChange = (value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      difficulty: value === "all" ? undefined : (value as Difficulty),
    }));
  };

  const handleCategoryChange = (value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      category: value === "all" ? undefined : value,
    }));
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Recipes" description="Manage your own recipes">
          <Link href="/recipes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Recipe
            </Button>
          </Link>
        </PageHeader>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {RECIPE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipe grid */}
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<RecipeListSkeleton />}
          onRetry={() => refetch()}
        >
          {data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    {data.pagination.page} / {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={ChefHat}
              title="No recipes yet"
              description="Add your first recipe to get started!"
            >
              <Link href="/recipes/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
                </Button>
              </Link>
            </EmptyState>
          )}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { ChefHat, Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { RecipeGridCard } from "./recipe-grid-card";
import { RecipeSearch } from "./recipe-search";
import { Pagination } from "@/components/shared/pagination";
import { PageTransition } from "@/components/motion/page-transition";
import { useRecipes } from "@/hooks/queries/use-recipes";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Difficulty, RecipeFilters } from "@/application/dto/recipe.dto";
import { RECIPE_CATEGORIES, DIFFICULTY_LABELS } from "@/application/dto/recipe.dto";

type ViewMode = "list" | "grid";

const VIEW_STORAGE_KEY = "recipe-view-mode";

export function RecipeList() {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Restore view preference
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "list" || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  const filters: RecipeFilters = {};
  if (difficulty !== "all") {
    filters.difficulty = difficulty as Difficulty;
  }
  if (category !== "all") {
    filters.category = category;
  }

  const { data, isLoading, isError, error, refetch } = useRecipes(
    page,
    ITEMS_PER_PAGE,
    Object.keys(filters).length > 0 ? filters : undefined
  );

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    if (!data?.items || !search.trim()) return data?.items || [];
    const query = search.toLowerCase();
    return data.items.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.category?.toLowerCase().includes(query)
    );
  }, [data?.items, search]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Recipes" description="Manage your own recipes">
          <Link href="/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Recipe
            </Button>
          </Link>
        </PageHeader>

        {/* Search + Filters + View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <RecipeSearch
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Select
              value={difficulty}
              onValueChange={(v) => {
                setDifficulty(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
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

            <div className="flex rounded-xl border border-orange-200 p-0.5 dark:border-stone-700">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleViewChange("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleViewChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recipe grid/list */}
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<RecipeListSkeleton />}
          onRetry={() => refetch()}
        >
          {filteredItems.length > 0 ? (
            <>
              {search && (
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
                </p>
              )}

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((recipe, index) => (
                    <RecipeGridCard
                      key={recipe.id}
                      recipe={recipe}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {!search && data && data.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={setPage}
                  className="pt-4"
                />
              )}
            </>
          ) : search ? (
            <EmptyState
              icon={ChefHat}
              title="No results found"
              description={`No recipes matching "${search}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon={ChefHat}
              title="No recipes yet"
              description="Add your first recipe to get started!"
            >
              <Link href="/recipes/new">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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

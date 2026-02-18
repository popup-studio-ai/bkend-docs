"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, LayoutGrid, List } from "lucide-react";
import { useProducts } from "@/hooks/queries/use-products";
import { ProductCard } from "./product-card";
import { ProductGridCard } from "./product-grid-card";
import { ProductSearch } from "./product-search";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES, ALL_CATEGORIES_OPTION, ITEMS_PER_PAGE } from "@/lib/constants";
import type { ProductListParams } from "@/lib/api/products";

type ViewMode = "list" | "grid";

const VIEW_STORAGE_KEY = "shopping-mall-view";

interface ProductListProps {
  initialCategory?: string;
  initialSearch?: string;
}

export function ProductList({ initialCategory, initialSearch }: ProductListProps) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>(
    initialCategory ?? ALL_CATEGORIES_OPTION.value
  );
  const [search, setSearch] = useState(initialSearch ?? "");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
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

  const params: ProductListParams = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortDirection,
    isActive: true,
  };

  if (category && category !== ALL_CATEGORIES_OPTION.value) {
    params.category = category;
  }

  const { data, isLoading, isError, error, refetch } = useProducts(params);

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    if (!data?.items || !search.trim()) return data?.items || [];
    const query = search.toLowerCase();
    return data.items.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [data?.items, search]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="space-y-4">
      {/* Search + Filters + View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ProductSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_OPTION.value}>
                {ALL_CATEGORIES_OPTION.label}
              </SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${sortBy}:${sortDirection}`}
            onValueChange={(v) => {
              const [field, dir] = v.split(":");
              setSortBy(field);
              setSortDirection(dir as "asc" | "desc");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="createdAt:asc">Oldest</SelectItem>
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="name:asc">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border p-0.5">
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

      {/* Results */}
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadingFallback={<ProductGridSkeleton />}
        onRetry={() => refetch()}
      >
        {filteredItems.length > 0 ? (
          <>
            {search && (
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
              </p>
            )}

            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((product, index) => (
                  <ProductGridCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
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
            icon={ShoppingBag}
            title="No results found"
            description={`No products matching "${search}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="No products yet"
            description="No products have been listed in this category."
          />
        )}
      </QueryBoundary>
    </div>
  );
}

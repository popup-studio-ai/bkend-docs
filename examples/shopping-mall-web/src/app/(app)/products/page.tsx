"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductForm } from "@/components/products/product-form";
import { PageTransition } from "@/components/motion/page-transition";
import { useProducts } from "@/hooks/queries/use-products";
import { PRODUCT_CATEGORIES } from "@/application/dto/product.dto";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? undefined;

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categoryFromUrl
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useProducts({
    category: selectedCategory,
    isActive: true,
    sortBy,
    sortDirection,
    limit: 50,
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Products"
          description="Discover a wide range of products"
        >
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </PageHeader>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(v) =>
              setSelectedCategory(v === "all" ? undefined : v)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
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
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="createdAt:asc">Oldest</SelectItem>
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="name:asc">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<ProductGridSkeleton />}
          onRetry={() => refetch()}
        >
          <ProductGrid products={data?.items ?? []} />
        </QueryBoundary>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Register a new product
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

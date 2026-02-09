"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { ProductDetailSkeleton } from "@/components/shared/loading-skeleton";
import { ProductDetail } from "@/components/products/product-detail";
import { PageTransition } from "@/components/motion/page-transition";
import { useProduct } from "@/hooks/queries/use-products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  return (
    <PageTransition>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Products
          </Link>
        </Button>

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<ProductDetailSkeleton />}
          onRetry={() => refetch()}
        >
          {product && <ProductDetail product={product} />}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}

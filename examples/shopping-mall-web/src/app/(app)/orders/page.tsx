"use client";

import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { OrderListSkeleton } from "@/components/shared/loading-skeleton";
import { OrderList } from "@/components/orders/order-list";
import { PageTransition } from "@/components/motion/page-transition";
import { useOrders } from "@/hooks/queries/use-orders";

export default function OrdersPage() {
  const { data, isLoading, isError, error, refetch } = useOrders({ limit: 50 });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="space-y-6">
        <PageHeader
          title="Orders"
          description="Track the delivery status of your orders"
        />

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<OrderListSkeleton />}
          onRetry={() => refetch()}
        >
          <OrderList orders={data?.items ?? []} />
        </QueryBoundary>
      </div>
    </div>
  );
}

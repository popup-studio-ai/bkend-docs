"use client";

import { use, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { OrderListSkeleton } from "@/components/shared/loading-skeleton";
import { OrderDetail } from "@/components/orders/order-detail";
import { ReviewForm } from "@/components/reviews/review-form";
import { PageTransition } from "@/components/motion/page-transition";
import { useOrder } from "@/hooks/queries/use-orders";
import { parseOrderItems } from "@/application/dto/order.dto";
import { formatDate } from "@/lib/format";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const items = order ? parseOrderItems(order.items) : [];
  const canReview = order?.status === "delivered";

  const handleWriteReview = (productId: string) => {
    setSelectedProductId(productId);
    setReviewDialogOpen(true);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orders
          </Link>
        </Button>

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<OrderListSkeleton />}
          onRetry={() => refetch()}
        >
          {order && (
            <>
              <PageHeader
                title="Order Details"
                description={`Ordered on ${formatDate(order.createdAt)}`}
              >
                {canReview && (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Button
                        key={item.productId}
                        variant="outline"
                        size="sm"
                        onClick={() => handleWriteReview(item.productId)}
                      >
                        <Pencil className="mr-1 h-3 w-3" />
                        Review {item.name}
                      </Button>
                    ))}
                  </div>
                )}
              </PageHeader>

              <OrderDetail order={order} />

              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your honest review about this product
                    </DialogDescription>
                  </DialogHeader>
                  <ReviewForm
                    productId={selectedProductId}
                    orderId={order.id}
                    onSuccess={() => setReviewDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </QueryBoundary>
      </div>
    </PageTransition>
  );
}

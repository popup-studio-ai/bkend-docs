"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./star-rating";
import { RatingDistribution } from "./rating-distribution";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { useProductReviews } from "@/hooks/queries/use-reviews";
import { formatDate } from "@/lib/format";

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const { data, isLoading, isError, error, refetch } = useProductReviews(productId);
  const reviews = data?.items ?? [];

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
    >
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Be the first to review this product."
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <RatingDistribution reviews={reviews} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <StarRating value={review.rating} readonly size="sm" />
                          </div>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </QueryBoundary>
  );
}

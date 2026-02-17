"use client";

import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/reviews/star-rating";
import { PageTransition } from "@/components/motion/page-transition";
import { useMyReviews, useDeleteReview } from "@/hooks/queries/use-reviews";
import { formatDate } from "@/lib/format";

export default function ReviewsPage() {
  const { data, isLoading, isError, error, refetch } = useMyReviews();
  const deleteReview = useDeleteReview();

  const reviews = data?.items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="space-y-6">
        <PageHeader
          title="My Reviews"
          description={`${reviews.length} review(s) written`}
        />

        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
        >
          {reviews.length === 0 ? (
            <EmptyState
              icon={<Star className="h-12 w-12" />}
              title="No reviews yet"
              description="Leave a review on your delivered orders."
              action={
                <Button asChild variant="outline">
                  <a href="/orders">View Orders</a>
                </Button>
              }
            />
          ) : (
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Star className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <StarRating value={review.rating} readonly size="sm" />
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                              {review.content}
                            </p>
                            <span className="mt-2 block text-xs text-slate-400">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                          onClick={() =>
                            deleteReview.mutate({
                              id: review.id,
                              productId: review.productId,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </QueryBoundary>
      </div>
    </div>
  );
}

"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateAverageRating, calculateRatingDistribution, type ReviewDto } from "@/application/dto/review.dto";

interface RatingDistributionProps {
  reviews: ReviewDto[];
}

export function RatingDistribution({ reviews }: RatingDistributionProps) {
  const average = calculateAverageRating(reviews);
  const distribution = calculateRatingDistribution(reviews);

  return (
    <div className="flex gap-8">
      <div className="flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-foreground">
          {average.toFixed(1)}
        </span>
        <div className="mt-1 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-4 w-4",
                star <= Math.round(average)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <span className="mt-1 text-xs text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="flex-1 space-y-1.5">
        {distribution.map(({ star, count, percentage }) => (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-right text-muted-foreground">
              {star}
            </span>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="w-8 text-right text-xs text-muted-foreground">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

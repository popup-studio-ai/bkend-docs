import { z } from "zod";

export interface ReviewDto {
  id: string;
  productId: string;
  orderId: string;
  rating: number;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewFormSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  orderId: z.string().min(1, "Please select an order"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be 5 or less"),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be 1000 characters or less"),
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;

export interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

export function calculateAverageRating(reviews: ReviewDto[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function calculateRatingDistribution(reviews: ReviewDto[]): RatingDistribution[] {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      counts[review.rating - 1]++;
    }
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star - 1],
    percentage: Math.round((counts[star - 1] / total) * 100),
  }));
}

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { useCreateReview } from "@/hooks/queries/use-reviews";
import { useDemoGuard } from "@/hooks/use-demo-guard";
import { reviewFormSchema, type ReviewFormInput } from "@/application/dto/review.dto";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const createReview = useCreateReview();
  const { isDemoAccount } = useDemoGuard();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      productId,
      orderId,
      rating: 0,
      content: "",
    },
  });

  const onSubmit = async (data: ReviewFormInput) => {
    await createReview.mutateAsync(data);
    reset();
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRating value={field.value} onChange={field.onChange} size="lg" />
              )}
            />
            {errors.rating && (
              <p className="text-xs text-red-500">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Review</Label>
            <Textarea
              id="content"
              placeholder="Share your honest review of this product (min. 10 characters)"
              rows={4}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-red-500">{errors.content.message}</p>
            )}
          </div>

          {createReview.isError && (
            <div className="rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {createReview.error?.message || "Failed to submit review."}
            </div>
          )}

          <Button type="submit" disabled={createReview.isPending || isDemoAccount}>
            {createReview.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

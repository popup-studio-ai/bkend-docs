import type { ReviewDto } from "@/application/dto/review.dto";

const baseDate = new Date();

function daysAgo(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

let reviews: ReviewDto[] = [
  {
    id: "review-1",
    productId: "prod-2",
    orderId: "order-1",
    rating: 5,
    content: "The sound quality is truly outstanding and the noise cancellation is flawless. Battery life is great too, very useful for my daily commute.",
    createdBy: "user-1",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: "review-2",
    productId: "prod-5",
    orderId: "order-2",
    rating: 4,
    content: "Works well on my sensitive skin with no irritation. Great moisturizing effect. The scent might not be for everyone though.",
    createdBy: "user-1",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "review-3",
    productId: "prod-3",
    orderId: "order-3",
    rating: 5,
    content: "The wood grain looks even better than in the photos. Easy to assemble and very sturdy. Highly recommend!",
    createdBy: "user-1",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "review-4",
    productId: "prod-11",
    orderId: "order-4",
    rating: 4,
    content: "The oversized fit is super comfortable for lounging. The fabric is thick enough to keep warm even in winter.",
    createdBy: "user-1",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "review-5",
    productId: "prod-15",
    orderId: "order-5",
    rating: 5,
    content: "Applies smoothly without any white cast and lasts all day. Definitely a summer essential, will repurchase.",
    createdBy: "user-1",
    createdAt: daysAgo(17),
    updatedAt: daysAgo(17),
  },
  {
    id: "review-6",
    productId: "prod-4",
    orderId: "order-5",
    rating: 3,
    content: "Taste is decent but the portion feels a bit small. Average value for the price.",
    createdBy: "user-1",
    createdAt: daysAgo(16),
    updatedAt: daysAgo(16),
  },
  {
    id: "review-7",
    productId: "prod-12",
    orderId: "order-1",
    rating: 4,
    content: "Fits my MacBook Pro perfectly and connection is stable. HDMI output supports 4K which is a nice bonus.",
    createdBy: "user-1",
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
  {
    id: "review-8",
    productId: "prod-8",
    orderId: "order-3",
    rating: 4,
    content: "My back feels much better after long hours of sitting. Love the adjustable armrest height.",
    createdBy: "user-1",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "review-9",
    productId: "prod-10",
    orderId: "order-5",
    rating: 3,
    content: "Good moisturizing power but feels a bit sticky. Probably better suited for dry skin types.",
    createdBy: "user-1",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
  },
  {
    id: "review-10",
    productId: "prod-6",
    orderId: "order-4",
    rating: 2,
    content: "Runs smaller than the listed size. I'd recommend sizing up.",
    createdBy: "user-1",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

let nextId = 11;

export function getReviews() {
  return reviews;
}

export function resetReviews() {
  nextId = 11;
}

export function createReview(body: Record<string, unknown>): ReviewDto {
  const review: ReviewDto = {
    id: `review-${nextId++}`,
    productId: (body.productId as string) || "",
    orderId: (body.orderId as string) || "",
    rating: (body.rating as number) || 5,
    content: (body.content as string) || "",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  reviews.push(review);
  return review;
}

export function deleteReview(id: string): boolean {
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  reviews.splice(idx, 1);
  return true;
}

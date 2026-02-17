export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params: object) =>
      [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  carts: {
    all: ["carts"] as const,
    list: () => [...queryKeys.carts.all, "list"] as const,
  },
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (params: object) =>
      [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    byProduct: (productId: string) =>
      [...queryKeys.reviews.all, "product", productId] as const,
    byUser: () => [...queryKeys.reviews.all, "user"] as const,
  },
} as const;

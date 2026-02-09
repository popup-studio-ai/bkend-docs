import type { CartDto } from "@/application/dto/cart.dto";

const now = new Date().toISOString();

let carts: CartDto[] = [
  {
    id: "cart-1",
    productId: "prod-2",
    quantity: 1,
    createdBy: "user-1",
    createdAt: now,
  },
  {
    id: "cart-2",
    productId: "prod-5",
    quantity: 2,
    createdBy: "user-1",
    createdAt: now,
  },
  {
    id: "cart-3",
    productId: "prod-11",
    quantity: 1,
    createdBy: "user-1",
    createdAt: now,
  },
];

let nextId = 4;

export function getCarts() {
  return carts;
}

export function resetCarts() {
  carts = [
    {
      id: "cart-1",
      productId: "prod-2",
      quantity: 1,
      createdBy: "user-1",
      createdAt: now,
    },
    {
      id: "cart-2",
      productId: "prod-5",
      quantity: 2,
      createdBy: "user-1",
      createdAt: now,
    },
    {
      id: "cart-3",
      productId: "prod-11",
      quantity: 1,
      createdBy: "user-1",
      createdAt: now,
    },
  ];
  nextId = 4;
}

export function addCartItem(body: Record<string, unknown>): CartDto {
  const productId = body.productId as string;
  const quantity = (body.quantity as number) || 1;

  // If the same product exists, add to quantity
  const existing = carts.find((c) => c.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    return existing;
  }

  const item: CartDto = {
    id: `cart-${nextId++}`,
    productId,
    quantity,
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  };
  carts.push(item);
  return item;
}

export function updateCartItem(id: string, body: Record<string, unknown>): CartDto | null {
  const idx = carts.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  carts[idx] = {
    ...carts[idx],
    quantity: (body.quantity as number) ?? carts[idx].quantity,
  };
  return carts[idx];
}

export function removeCartItem(id: string): boolean {
  const idx = carts.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  carts.splice(idx, 1);
  return true;
}

import { z } from "zod";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered";

export interface OrderItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDto {
  id: string;
  items: string;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const checkoutFormSchema = z.object({
  recipientName: z.string().min(1, "Please enter the recipient name"),
  recipientPhone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number"),
  shippingAddress: z.string().min(1, "Please enter a shipping address"),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export function parseOrderItems(itemsJson: string): OrderItemDto[] {
  try {
    return JSON.parse(itemsJson);
  } catch {
    return [];
  }
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed"],
  confirmed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
};

export function getStatusDisplay(status: OrderStatus): {
  label: string;
  color: string;
} {
  const map: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Order Placed", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
    confirmed: { label: "Payment Confirmed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    shipped: { label: "Shipping", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  };
  return map[status] || { label: status, color: "bg-gray-100 text-gray-800" };
}

export const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order Placed" },
  { status: "confirmed", label: "Payment Confirmed" },
  { status: "shipped", label: "Shipping" },
  { status: "delivered", label: "Delivered" },
];

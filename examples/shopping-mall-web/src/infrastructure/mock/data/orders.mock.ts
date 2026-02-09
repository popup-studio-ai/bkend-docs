import type { OrderDto, OrderStatus } from "@/application/dto/order.dto";
import { VALID_TRANSITIONS } from "@/application/dto/order.dto";

const baseDate = new Date();

function daysAgo(days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

let orders: OrderDto[] = [
  {
    id: "order-1",
    items: JSON.stringify([
      { productId: "prod-2", name: "Wireless Bluetooth Earbuds Pro", price: 158.00, quantity: 1 },
      { productId: "prod-12", name: "USB-C Multi Hub 7-in-1", price: 45.00, quantity: 1 },
    ]),
    totalPrice: 203.00,
    status: "delivered",
    shippingAddress: "123 Main St, New York, NY 10001",
    recipientName: "John Smith",
    recipientPhone: "2125551234",
    createdBy: "user-1",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(10),
  },
  {
    id: "order-2",
    items: JSON.stringify([
      { productId: "prod-5", name: "Cica Repair Serum 50ml", price: 32.00, quantity: 2 },
    ]),
    totalPrice: 64.00,
    status: "shipped",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    recipientName: "Emily Johnson",
    recipientPhone: "3105559876",
    createdBy: "user-1",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
  },
  {
    id: "order-3",
    items: JSON.stringify([
      { productId: "prod-3", name: "Solid Wood Desk 48\"", price: 345.00, quantity: 1 },
      { productId: "prod-8", name: "Ergonomic Office Chair", price: 420.00, quantity: 1 },
    ]),
    totalPrice: 765.00,
    status: "confirmed",
    shippingAddress: "789 Pine Rd, San Francisco, CA 94102",
    recipientName: "Sarah Williams",
    recipientPhone: "4155555678",
    createdBy: "user-1",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "order-4",
    items: JSON.stringify([
      { productId: "prod-11", name: "Oversized Crewneck Sweatshirt", price: 39.00, quantity: 3 },
      { productId: "prod-6", name: "Slim Fit Jeans", price: 59.00, quantity: 1 },
    ]),
    totalPrice: 176.00,
    status: "pending",
    shippingAddress: "321 Elm St, Chicago, IL 60601",
    recipientName: "Michael Brown",
    recipientPhone: "3125557890",
    createdBy: "user-1",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "order-5",
    items: JSON.stringify([
      { productId: "prod-15", name: "Sunscreen SPF50+ PA++++", price: 22.00, quantity: 1 },
      { productId: "prod-10", name: "Hyaluronic Acid Moisturizer 100ml", price: 28.00, quantity: 1 },
      { productId: "prod-4", name: "Organic Granola 500g", price: 12.90, quantity: 2 },
    ]),
    totalPrice: 75.80,
    status: "delivered",
    shippingAddress: "55 University Blvd, Austin, TX 73301",
    recipientName: "David Lee",
    recipientPhone: "5125554321",
    createdBy: "user-1",
    createdAt: daysAgo(21),
    updatedAt: daysAgo(17),
  },
];

let nextId = 6;

export function getOrders() {
  return orders;
}

export function resetOrders() {
  // Keep current data instead of resetting to initial (implement if needed)
  nextId = 6;
}

export function findOrder(id: string): OrderDto | undefined {
  return orders.find((o) => o.id === id);
}

export function createOrder(body: Record<string, unknown>): OrderDto {
  const order: OrderDto = {
    id: `order-${nextId++}`,
    items: (body.items as string) || "[]",
    totalPrice: (body.totalPrice as number) || 0,
    status: (body.status as OrderStatus) || "pending",
    shippingAddress: (body.shippingAddress as string) || "",
    recipientName: (body.recipientName as string) || "",
    recipientPhone: (body.recipientPhone as string) || "",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

export function updateOrderStatus(id: string, body: Record<string, unknown>): OrderDto | null {
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const currentStatus = orders[idx].status;
  const newStatus = body.status as OrderStatus;

  if (newStatus && !VALID_TRANSITIONS[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} -> ${newStatus}`
    );
  }

  orders[idx] = {
    ...orders[idx],
    ...(newStatus ? { status: newStatus } : {}),
    updatedAt: new Date().toISOString(),
  };
  return orders[idx];
}

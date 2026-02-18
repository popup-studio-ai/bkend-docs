"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderProgress } from "./order-progress";
import { formatPrice, formatDate } from "@/lib/format";
import { getStatusDisplay, parseOrderItems, type OrderDto } from "@/application/dto/order.dto";

interface OrderListProps {
  orders: OrderDto[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="You haven't placed any orders yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const items = parseOrderItems(order.items);
        const { label, color } = getStatusDisplay(order.status);
        const firstItem = items[0];
        const itemSummary =
          items.length > 1
            ? `${firstItem?.name} + ${items.length - 1} more`
            : firstItem?.name ?? "Product info unavailable";

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/orders/${order.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {itemSummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={color}>{label}</Badge>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <OrderProgress currentStatus={order.status} />

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

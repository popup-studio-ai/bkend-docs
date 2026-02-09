"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderProgress } from "./order-progress";
import { formatPrice, formatDateTime, formatPhoneNumber } from "@/lib/format";
import {
  getStatusDisplay,
  parseOrderItems,
  type OrderDto,
} from "@/application/dto/order.dto";

interface OrderDetailProps {
  order: OrderDto;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const items = parseOrderItems(order.items);
  const { label, color } = getStatusDisplay(order.status);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Status</CardTitle>
            <Badge className={color}>{label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <OrderProgress currentStatus={order.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
                {index < items.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Recipient</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-50">
                {order.recipientName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Phone</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-50">
                {formatPhoneNumber(order.recipientPhone)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Address</dt>
              <dd className="font-medium text-right text-slate-900 dark:text-slate-50 max-w-[60%]">
                {order.shippingAddress}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Order ID</dt>
              <dd className="font-mono text-xs font-medium text-slate-900 dark:text-slate-50">
                {order.id}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Order Date</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-50">
                {formatDateTime(order.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

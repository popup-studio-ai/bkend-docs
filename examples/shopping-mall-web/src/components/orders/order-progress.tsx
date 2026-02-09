"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STEPS, type OrderStatus } from "@/application/dto/order.dto";

interface OrderProgressProps {
  currentStatus: OrderStatus;
}

export function OrderProgress({ currentStatus }: OrderProgressProps) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="flex items-center justify-between">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500",
                  isCurrent && "ring-2 ring-green-200 dark:ring-green-800"
                )}
              >
                {isCompleted && index < currentIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium",
                  isCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < ORDER_STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  index < currentIndex
                    ? "bg-green-500"
                    : "bg-slate-200 dark:bg-slate-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

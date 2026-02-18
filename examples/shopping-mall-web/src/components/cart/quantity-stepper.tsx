"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  disabled = false,
}: QuantityStepperProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("inline-flex items-center rounded-md border border-border", disabled && "opacity-50")}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-none rounded-l-md",
          size === "sm" ? "h-7 w-7" : "h-9 w-9"
        )}
        onClick={handleDecrease}
        disabled={value <= min || disabled}
      >
        <Minus className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
      <span
        className={cn(
          "flex items-center justify-center border-x border-border font-medium text-foreground",
          size === "sm" ? "h-7 w-8 text-xs" : "h-9 w-12 text-sm"
        )}
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-none rounded-r-md",
          size === "sm" ? "h-7 w-7" : "h-9 w-9"
        )}
        onClick={handleIncrease}
        disabled={value >= max || disabled}
      >
        <Plus className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
    </div>
  );
}

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingItem as ShoppingItemType } from "@/application/dto/shopping-list.dto";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShoppingItemProps {
  item: ShoppingItemType;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingItem({ item, index, onToggle }: ShoppingItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-orange-50 dark:hover:bg-stone-800"
    >
      <Checkbox
        checked={item.checked}
        onCheckedChange={() => onToggle(index)}
      />
      <span
        className={cn(
          "flex-1 text-sm text-stone-700 dark:text-stone-300",
          item.checked && "line-through text-stone-400 dark:text-stone-500"
        )}
      >
        {item.name}
      </span>
      <span
        className={cn(
          "text-sm font-medium text-stone-600 dark:text-stone-400",
          item.checked && "line-through text-stone-400 dark:text-stone-500"
        )}
      >
        {item.amount} {item.unit}
      </span>
    </motion.div>
  );
}

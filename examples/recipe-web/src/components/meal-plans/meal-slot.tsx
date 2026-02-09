"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MealPlan, MealType } from "@/application/dto/meal-plan.dto";
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from "@/application/dto/meal-plan.dto";
import { cn } from "@/lib/utils";

interface MealSlotProps {
  mealType: MealType;
  plan?: MealPlan;
  recipeTitle?: string;
  onAdd: () => void;
  onDelete?: (id: string) => void;
}

export function MealSlot({
  mealType,
  plan,
  recipeTitle,
  onAdd,
  onDelete,
}: MealSlotProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2 text-xs transition-colors",
        plan
          ? "border-orange-200 bg-orange-50 dark:border-stone-600 dark:bg-stone-800"
          : "border-dashed border-stone-300 dark:border-stone-600"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-stone-500 dark:text-stone-400">
          {MEAL_TYPE_ICONS[mealType]} {MEAL_TYPE_LABELS[mealType]}
        </span>
        {plan && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-stone-400 hover:text-red-500"
            onClick={() => onDelete(plan.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      {plan ? (
        <div>
          <p className="font-medium text-stone-700 line-clamp-1 dark:text-stone-300">
            {recipeTitle || "Recipe"}
          </p>
          {plan.notes && (
            <p className="text-stone-400 line-clamp-1 mt-0.5">{plan.notes}</p>
          )}
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="w-full text-center text-stone-400 hover:text-orange-500 transition-colors py-1 dark:hover:text-orange-400"
        >
          + Add
        </button>
      )}
    </div>
  );
}

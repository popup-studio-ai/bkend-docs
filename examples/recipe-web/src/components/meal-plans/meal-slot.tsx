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
  disabled?: boolean;
}

export function MealSlot({
  mealType,
  plan,
  recipeTitle,
  onAdd,
  onDelete,
  disabled,
}: MealSlotProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2 text-xs transition-colors",
        plan
          ? "border-border bg-accent"
          : "border-dashed border-border"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted-foreground">
          {MEAL_TYPE_ICONS[mealType]} {MEAL_TYPE_LABELS[mealType]}
        </span>
        {plan && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-red-500"
            onClick={() => onDelete(plan.id)}
            disabled={disabled}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      {plan ? (
        <div>
          <p className="font-medium text-foreground line-clamp-1">
            {recipeTitle || "Recipe"}
          </p>
          {plan.notes && (
            <p className="text-muted-foreground line-clamp-1 mt-0.5">{plan.notes}</p>
          )}
        </div>
      ) : (
        <button
          onClick={disabled ? undefined : onAdd}
          disabled={disabled}
          className={cn(
            "w-full text-center transition-colors py-1",
            disabled
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-muted-foreground hover:text-orange-500 dark:hover:text-orange-400"
          )}
        >
          + Add
        </button>
      )}
    </div>
  );
}

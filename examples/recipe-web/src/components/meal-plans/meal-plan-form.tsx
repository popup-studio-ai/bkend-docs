"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateMealPlan } from "@/hooks/queries/use-meal-plans";
import { useRecipes } from "@/hooks/queries/use-recipes";
import type { MealType } from "@/application/dto/meal-plan.dto";
import { MEAL_TYPE_LABELS } from "@/application/dto/meal-plan.dto";

const mealPlanSchema = z.object({
  recipeId: z.string().min(1, "Please select a recipe"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  servings: z.coerce.number().min(1),
  notes: z.string().optional(),
});

type MealPlanFormData = z.infer<typeof mealPlanSchema>;

interface MealPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  defaultMealType?: MealType;
}

export function MealPlanForm({
  open,
  onOpenChange,
  date,
  defaultMealType = "lunch",
}: MealPlanFormProps) {
  const createMealPlan = useCreateMealPlan();
  const { data: recipesData } = useRecipes(1, 50);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      mealType: defaultMealType,
      servings: 1,
    },
  });

  const onSubmit = async (data: MealPlanFormData) => {
    await createMealPlan.mutateAsync({
      date,
      mealType: data.mealType,
      recipeId: data.recipeId,
      servings: data.servings,
      notes: data.notes,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Meal ({date})</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Meal type */}
          <div className="space-y-2">
            <Label>Meal Type</Label>
            <Controller
              name="mealType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Recipe selection */}
          <div className="space-y-2">
            <Label>Recipe</Label>
            <Controller
              name="recipeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipesData?.items.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.recipeId && (
              <p className="text-xs text-red-500">
                {errors.recipeId.message}
              </p>
            )}
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              min={1}
              {...register("servings")}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes"
              rows={2}
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMealPlan.isPending}>
              {createMealPlan.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

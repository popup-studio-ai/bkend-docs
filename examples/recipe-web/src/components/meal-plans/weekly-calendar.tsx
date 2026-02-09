"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { RecipeListSkeleton } from "@/components/shared/loading-skeleton";
import { QueryBoundary } from "@/components/shared/query-boundary";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { MealSlot } from "./meal-slot";
import { MealPlanForm } from "./meal-plan-form";
import {
  useWeeklyMealPlans,
  useDeleteMealPlan,
} from "@/hooks/queries/use-meal-plans";
import { useRecipes } from "@/hooks/queries/use-recipes";
import type { MealType } from "@/application/dto/meal-plan.dto";
import { getShortDayName } from "@/lib/format";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] =
    useState<MealType>("lunch");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const startStr = format(weekStart, "yyyy-MM-dd");
  const endStr = format(weekEnd, "yyyy-MM-dd");

  const { data: weekPlans, isLoading, isError, error, refetch } =
    useWeeklyMealPlans(startStr, endStr);
  const { data: recipesData } = useRecipes(1, 100);
  const deleteMealPlan = useDeleteMealPlan();

  const recipeMap = useMemo(() => {
    const map = new Map<string, string>();
    recipesData?.items.forEach((r) => map.set(r.id, r.title));
    return map;
  }, [recipesData]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date: format(date, "yyyy-MM-dd"),
        dayName: getShortDayName(format(date, "yyyy-MM-dd")),
        dayNum: format(date, "d"),
        isToday:
          format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      };
    });
  }, [weekStart]);

  const handleAddMeal = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setFormOpen(true);
  };

  const handleDeleteMeal = async (id: string) => {
    await deleteMealPlan.mutateAsync(id);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Meal Plans"
          description="Plan your weekly meals"
        />

        {/* Weekly navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev Week
          </Button>
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {format(weekStart, "MMMM yyyy", { locale: enUS })}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {format(weekStart, "M/d")} - {format(weekEnd, "M/d")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            Next Week
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Weekly calendar grid */}
        <QueryBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          loadingFallback={<RecipeListSkeleton count={7} />}
          onRetry={() => refetch()}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {weekDays.map((day) => {
              const dayPlan = weekPlans?.find((dp) => dp.date === day.date);
              return (
                <Card
                  key={day.date}
                  className={
                    day.isToday
                      ? "ring-2 ring-orange-400 dark:ring-orange-500"
                      : ""
                  }
                >
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="text-stone-500 dark:text-stone-400">
                        {day.dayName}
                      </span>
                      <span
                        className={
                          day.isToday
                            ? "text-orange-600 font-bold dark:text-orange-400"
                            : "text-stone-700 dark:text-stone-300"
                        }
                      >
                        {day.dayNum}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-2">
                    {MEAL_TYPES.map((mealType) => {
                      const plan = dayPlan?.meals.find(
                        (m) => m.mealType === mealType
                      );
                      return (
                        <MealSlot
                          key={mealType}
                          mealType={mealType}
                          plan={plan}
                          recipeTitle={
                            plan ? recipeMap.get(plan.recipeId) : undefined
                          }
                          onAdd={() => handleAddMeal(day.date, mealType)}
                          onDelete={handleDeleteMeal}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </QueryBoundary>

        <MealPlanForm
          open={formOpen}
          onOpenChange={setFormOpen}
          date={selectedDate}
          defaultMealType={selectedMealType}
        />
      </div>
    </PageTransition>
  );
}

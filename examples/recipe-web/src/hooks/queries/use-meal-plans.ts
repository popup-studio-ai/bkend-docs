"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMealPlansByDateRange,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "@/lib/api/meal-plans";
import { queryKeys } from "./keys";
import type {
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
  DayPlan,
} from "@/application/dto/meal-plan.dto";

export function useWeeklyMealPlans(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.mealPlans.week(startDate, endDate),
    queryFn: async () => {
      const response = await getMealPlansByDateRange(startDate, endDate);
      return groupByDate(response.items, startDate, endDate);
    },
    enabled: !!startDate && !!endDate,
  });
}

function groupByDate(
  plans: MealPlan[],
  startDate: string,
  endDate: string
): DayPlan[] {
  const dayMap = new Map<string, DayPlan>();

  // Initialize weekly dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    dayMap.set(dateStr, { date: dateStr, meals: [] });
    current.setDate(current.getDate() + 1);
  }

  // Assign meals to dates
  for (const plan of plans) {
    const dateStr = plan.date.split("T")[0];
    const day = dayMap.get(dateStr);
    if (day) {
      day.meals.push(plan);
    }
  }

  return Array.from(dayMap.values());
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealPlanRequest) => createMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all });
    },
  });
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMealPlanRequest;
    }) => updateMealPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all });
    },
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMealPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all });
    },
  });
}

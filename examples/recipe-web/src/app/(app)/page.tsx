"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChefHat,
  CalendarDays,
  ShoppingCart,
  Plus,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { useRecipes } from "@/hooks/queries/use-recipes";
import { useWeeklyMealPlans } from "@/hooks/queries/use-meal-plans";
import { useShoppingLists } from "@/hooks/queries/use-shopping-lists";
import { formatTime } from "@/lib/format";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/application/dto/recipe.dto";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/page-transition";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
  index,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  href: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={href}>
        <Card className="group transition-all duration-200 hover:shadow-md hover:border-orange-300 border-orange-200 dark:border-stone-700 dark:hover:border-orange-600/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
                {value !== undefined ? (
                  <p className="mt-1 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{value}</p>
                ) : (
                  <Skeleton className="mt-2 h-8 w-12" />
                )}
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: recipesData } = useRecipes(1, 1);

  const { data: recentRecipes } = useRecipes(1, 4, undefined, "createdAt", "desc");

  // Get current week date range for meal plans
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startDate = startOfWeek.toISOString().split("T")[0];
  const endDate = endOfWeek.toISOString().split("T")[0];

  const { data: mealPlanData } = useWeeklyMealPlans(startDate, endDate);

  const { data: shoppingData } = useShoppingLists(1, 1);

  const stats = [
    {
      label: "Recipes",
      value: recipesData?.pagination.total,
      icon: ChefHat,
      href: "/recipes",
      color: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
    {
      label: "This Week Plans",
      value: mealPlanData ? mealPlanData.reduce((sum, day) => sum + day.meals.length, 0) : undefined,
      icon: CalendarDays,
      href: "/meal-plans",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      label: "Shopping Lists",
      value: shoppingData?.pagination.total,
      icon: ShoppingCart,
      href: "/shopping-lists",
      color: "bg-gradient-to-br from-violet-500 to-purple-500",
    },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <PageTransition className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
          {greeting}, {user?.name || "there"}
        </h1>
        <p className="mt-1 text-stone-500 dark:text-stone-400">
          Here&apos;s an overview of your kitchen
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Recent Recipes</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recipes" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentRecipes?.items && recentRecipes.items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentRecipes.items.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              >
                <Link href={`/recipes/${recipe.id}`}>
                  <Card className="group h-full transition-all duration-200 hover:shadow-md hover:border-orange-300 border-orange-200 dark:border-stone-700 dark:hover:border-orange-600/40">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium line-clamp-1 group-hover:text-orange-600 transition-colors text-stone-900 dark:text-stone-100 dark:group-hover:text-orange-400">
                            {recipe.title}
                          </h3>
                          <p className="mt-1 text-sm text-stone-500 line-clamp-2 dark:text-stone-400">
                            {recipe.description}
                          </p>
                        </div>
                        {recipe.imageUrl && (
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                            <img
                              src={recipe.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Badge
                          className={cn(
                            "text-xs",
                            DIFFICULTY_COLORS[recipe.difficulty]
                          )}
                        >
                          {DIFFICULTY_LABELS[recipe.difficulty]}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                          <Clock className="h-3 w-3" />
                          {formatTime(recipe.cookingTime)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                          <Users className="h-3 w-3" />
                          {recipe.servings}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-orange-200 dark:border-stone-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ChefHat className="h-8 w-8 text-stone-400 dark:text-stone-500" />
              <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                No recipes yet. Create your first one!
              </p>
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm" asChild>
                <Link href="/recipes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Recipe
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-stone-900 dark:text-stone-100">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
            <Link href="/recipes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Recipe
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/meal-plans">
              <CalendarDays className="mr-2 h-4 w-4" />
              Plan Meals
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shopping-lists">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shopping Lists
            </Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}

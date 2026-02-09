"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Recipe } from "@/application/dto/recipe.dto";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/application/dto/recipe.dto";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/recipes/${recipe.id}`}>
        <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
          {/* Image (4:3 ratio) */}
          <div className="relative aspect-[4/3] overflow-hidden bg-orange-100 dark:bg-stone-700">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
            )}

            {/* Difficulty badge */}
            <div className="absolute top-3 left-3">
              <Badge
                className={cn(
                  "text-xs font-semibold",
                  DIFFICULTY_COLORS[recipe.difficulty]
                )}
              >
                {DIFFICULTY_LABELS[recipe.difficulty]}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-stone-900 line-clamp-1 group-hover:text-orange-600 dark:text-stone-100 dark:group-hover:text-orange-400">
              {recipe.title}
            </h3>
            <p className="mt-1 text-sm text-stone-500 line-clamp-2 dark:text-stone-400">
              {recipe.description}
            </p>

            {/* Meta info */}
            <div className="mt-3 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(recipe.cookingTime)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {recipe.servings} servings
              </span>
              {recipe.category && (
                <Badge variant="outline" className="text-xs">
                  {recipe.category}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

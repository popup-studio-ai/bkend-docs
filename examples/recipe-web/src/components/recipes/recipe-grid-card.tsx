"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/format";
import { formatRelativeTime } from "@/lib/utils";
import type { Recipe } from "@/application/dto/recipe.dto";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/application/dto/recipe.dto";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface RecipeGridCardProps {
  recipe: Recipe;
  index: number;
}

export function RecipeGridCard({ recipe, index }: RecipeGridCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/recipes/${recipe.id}`}>
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-200 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-600/40">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {recipe.imageUrl ? (
              <img
                src={getOptimizedImageUrl(recipe.imageUrl, IMAGE_PRESETS.thumbnail)}
                alt={recipe.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center gap-2 mb-2">
              {recipe.category && (
                <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  {recipe.category}
                </Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(recipe.cookingTime)}
              </span>
            </div>

            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-orange-600 transition-colors dark:group-hover:text-orange-400">
              {recipe.title}
            </h3>

            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1">
              {recipe.description}
            </p>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {recipe.servings} servings
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(recipe.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

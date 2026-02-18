"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatRelativeTime,
  stripHtml,
  truncate,
  calculateReadingTime,
} from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";
import { listItemVariants } from "@/components/motion/page-transition";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface TimelineCardProps {
  article: Article;
  index: number;
}

export function TimelineCard({ article, index }: TimelineCardProps) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <motion.div
      custom={index}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link href={`/articles/${article.id}`}>
        <article className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:shadow-lg hover:border-accent-color/30">
          {/* Cover Image */}
          {article.coverImage ? (
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
              <img
                src={getOptimizedImageUrl(article.coverImage, IMAGE_PRESETS.thumbnail)}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex aspect-[3/1] w-full items-center justify-center bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
            </div>
          )}

          {/* Content */}
          <div className="p-5 sm:p-6">
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {article.category && (
                <Badge variant="secondary" className="text-xs">
                  {article.category}
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeTime(article.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight line-clamp-2 group-hover:text-accent-color transition-colors sm:text-2xl">
              {article.title}
            </h2>

            {/* Preview */}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {truncate(stripHtml(article.content), 180)}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {article.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{article.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

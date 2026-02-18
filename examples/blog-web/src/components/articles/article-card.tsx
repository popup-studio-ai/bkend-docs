"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookmarkToggle } from "@/components/bookmarks/bookmark-toggle";
import {
  formatRelativeTime,
  stripHtml,
  truncate,
  calculateReadingTime,
} from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";
import { listItemVariants } from "@/components/motion/page-transition";
import { getOptimizedImageUrl, IMAGE_PRESETS } from "@/lib/image";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <motion.div
      custom={index}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link href={`/articles/${article.id}`}>
        <div className="group flex gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-accent-color/30">
          {article.coverImage && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
              <img
                src={getOptimizedImageUrl(article.coverImage, IMAGE_PRESETS.thumbnail)}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 font-semibold group-hover:text-accent-color transition-colors">
                  {article.title}
                </h3>
                <div className="flex shrink-0 items-center gap-1">
                  {article.isPublished ? (
                    <Eye className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {truncate(stripHtml(article.content), 120)}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {article.category && (
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                )}
                {article.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags?.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {readingTime} min
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatRelativeTime(article.createdAt)}
                </span>
                <div onClick={(e) => e.preventDefault()}>
                  <BookmarkToggle articleId={article.id} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

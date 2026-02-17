"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ImageIcon } from "lucide-react";
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

interface ArticleGridCardProps {
  article: Article;
  index: number;
}

export function ArticleGridCard({ article, index }: ArticleGridCardProps) {
  const readingTime = calculateReadingTime(article.content);

  return (
    <motion.div
      custom={index}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link href={`/articles/${article.id}`}>
        <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:shadow-lg hover:border-accent-color/30">
          {/* Cover Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            {/* Bookmark overlay */}
            <div
              className="absolute right-2 top-2"
              onClick={(e) => e.preventDefault()}
            >
              <BookmarkToggle articleId={article.id} size="sm" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center gap-2 mb-2">
              {article.category && (
                <Badge variant="secondary" className="text-xs">
                  {article.category}
                </Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
            </div>

            <h3 className="font-semibold line-clamp-2 group-hover:text-accent-color transition-colors">
              {article.title}
            </h3>

            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1">
              {truncate(stripHtml(article.content), 120)}
            </p>

            <div className="mt-3 flex items-center justify-between pt-3 border-t">
              <div className="flex flex-wrap gap-1">
                {article.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
                {article.tags?.length > 2 && (
                  <span className="text-[11px] text-muted-foreground">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(article.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

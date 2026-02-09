"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookmarkToggle } from "@/components/bookmarks/bookmark-toggle";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";
import { listItemVariants } from "@/components/motion/page-transition";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      custom={index}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/articles/${article.id}`}>
        <div className="group flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
          {article.coverImage && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="96px"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 font-semibold group-hover:text-accent-color">
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
                {truncate(article.content.replace(/<[^>]*>/g, ""), 120)}
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

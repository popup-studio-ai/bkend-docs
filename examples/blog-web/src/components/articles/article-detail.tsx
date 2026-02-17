"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Clock,
  Link2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookmarkToggle } from "@/components/bookmarks/bookmark-toggle";
import { useArticles, useDeleteArticle } from "@/hooks/queries/use-articles";
import { useToast } from "@/components/ui/toast";
import {
  formatDate,
  calculateReadingTime,
  stripHtml,
  truncate,
} from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";
import { useMe } from "@/hooks/queries/use-auth";

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const deleteArticle = useDeleteArticle();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: currentUser } = useMe();

  const isAuthor = currentUser?.id === article.createdBy;
  const readingTime = calculateReadingTime(article.content);

  // Related articles (same category, exclude current)
  const { data: relatedData } = useArticles({
    page: 1,
    limit: 3,
    sortBy: "createdAt",
    sortDirection: "desc",
    filters: {
      isPublished: true,
      ...(article.category ? { category: article.category } : {}),
    },
  });

  const relatedArticles = relatedData?.items.filter(
    (a) => a.id !== article.id
  )?.slice(0, 3);

  const handleDelete = async () => {
    try {
      await deleteArticle.mutateAsync(article.id);
      addToast({ title: "Article deleted", variant: "success" });
      router.push("/articles");
    } catch (err) {
      addToast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast({ title: "Link copied", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl"
    >
      {/* Top actions */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Link2 className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copied" : "Share"}
          </Button>
          <BookmarkToggle articleId={article.id} />
          {isAuthor && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/articles/${article.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Article header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {article.isPublished ? (
            <span className="flex items-center gap-1 text-green-600">
              <Eye className="h-3.5 w-3.5" />
              Published
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <EyeOff className="h-3.5 w-3.5" />
              Draft
            </span>
          )}
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.createdAt)}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {article.title}
        </h1>

        <div className="flex flex-wrap gap-2">
          {article.category && (
            <Badge variant="secondary">{article.category}</Badge>
          )}
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Cover image */}
      {article.coverImage && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <Separator className="my-8" />

      {/* Content */}
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <div
          className="whitespace-pre-wrap text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Related articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <>
          <Separator className="my-10" />
          <div>
            <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/articles/${related.id}`}>
                  <Card className="group h-full transition-all duration-200 hover:shadow-md hover:border-accent-color/30">
                    <CardContent className="p-4">
                      {related.coverImage && (
                        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md">
                          <img
                            src={related.coverImage}
                            alt={related.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="font-medium line-clamp-2 text-sm group-hover:text-accent-color transition-colors">
                        {related.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {truncate(stripHtml(related.content), 80)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {calculateReadingTime(related.content)} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{article.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteArticle.isPending}
            >
              {deleteArticle.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}

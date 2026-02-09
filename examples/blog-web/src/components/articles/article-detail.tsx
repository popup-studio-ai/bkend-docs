"use client";

import { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookmarkToggle } from "@/components/bookmarks/bookmark-toggle";
import { useDeleteArticle } from "@/hooks/queries/use-articles";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const deleteArticle = useDeleteArticle();
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <BookmarkToggle articleId={article.id} />
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
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <span>|</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.createdAt)}
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

      {article.coverImage && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <Separator className="my-8" />

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <div
          className="whitespace-pre-wrap text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

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

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/files/image-upload";
import { TagSelect } from "@/components/tags/tag-select";
import { useToast } from "@/components/ui/toast";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/hooks/queries/use-articles";
import { CATEGORIES } from "@/lib/constants";
import { calculateReadingTime, formatDate } from "@/lib/utils";
import type { Article } from "@/application/dto/article.dto";

const articleSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  content: z.string().min(1, "Please enter content"),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
  tags: z.array(z.string()),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const [activeTab, setActiveTab] = useState("write");

  const isEditing = !!article;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      category: article?.category || "",
      coverImage: article?.coverImage || "",
      isPublished: article?.isPublished ?? false,
      tags: article?.tags || [],
    },
  });

  const coverImage = watch("coverImage");
  const tags = watch("tags");
  const category = watch("category");
  const title = watch("title");
  const content = watch("content");

  const readingTime = calculateReadingTime(content || "");

  const onSubmit = async (data: ArticleFormData) => {
    try {
      if (isEditing && article) {
        await updateArticle.mutateAsync({ id: article.id, data });
        addToast({ title: "Article updated", variant: "success" });
        router.push(`/articles/${article.id}`);
      } else {
        const created = await createArticle.mutateAsync(data);
        addToast({ title: "Article created", variant: "success" });
        router.push(`/articles/${created.id}`);
      }
    } catch (err) {
      addToast({
        title: isEditing ? "Failed to update article" : "Failed to create article",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const isPending = createArticle.isPending || updateArticle.isPending;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>
        {content && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {readingTime} min read
          </span>
        )}
      </div>

      <TabsContent value="write" className="mt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUpload
              value={coverImage}
              onChange={(url) => {
                setValue("coverImage", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
            {coverImage && (
              <p className="text-xs text-muted-foreground">
                Current: {coverImage.substring(0, 50)}...
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category || ""}
                onValueChange={(v) => setValue("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Publish Status</Label>
              <Select
                value={watch("isPublished") ? "published" : "draft"}
                onValueChange={(v) => setValue("isPublished", v === "published")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelect
              selected={tags}
              onChange={(newTags) => setValue("tags", newTags)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your article content..."
              className="min-h-[300px] font-mono text-sm"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Publish"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="preview" className="mt-0">
        <div className="rounded-xl border bg-card p-6">
          {title || content ? (
            <article className="mx-auto max-w-3xl">
              <header className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime} min read
                  </span>
                  <span className="text-border">|</span>
                  <span>{formatDate(new Date().toISOString())}</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  {title || "Untitled Article"}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="secondary">{category}</Badge>
                  )}
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </header>

              {coverImage && (
                <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src={coverImage}
                    alt={title || "Cover"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <Separator className="my-8" />

              <div className="prose prose-zinc max-w-none dark:prose-invert">
                <div
                  className="whitespace-pre-wrap text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content || "<em>No content yet...</em>" }}
                />
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">
                Start writing to see a preview of your article
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

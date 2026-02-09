"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

const CATEGORIES = [
  { value: "Technology", label: "Technology" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Travel", label: "Travel" },
  { value: "Food", label: "Food" },
];

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

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
          onChange={(url) => setValue("coverImage", url)}
        />
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
          className="min-h-[300px]"
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
  );
}

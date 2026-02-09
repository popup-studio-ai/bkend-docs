"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/files/image-upload";
import { PageTransition } from "@/components/motion/page-transition";
import {
  useCreateRecipe,
  useUpdateRecipe,
} from "@/hooks/queries/use-recipes";
import type { Recipe, Difficulty } from "@/application/dto/recipe.dto";
import {
  RECIPE_CATEGORIES,
  DIFFICULTY_LABELS,
} from "@/application/dto/recipe.dto";

const recipeSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  cookingTime: z.coerce.number().min(1, "Please enter cooking time"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  servings: z.coerce.number().min(1, "Please enter number of servings"),
  category: z.string().min(1, "Please select a category"),
  imageUrl: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  recipe?: Recipe;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const isEditing = !!recipe;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe
      ? {
          title: recipe.title,
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          category: recipe.category,
          imageUrl: recipe.imageUrl,
        }
      : {
          difficulty: "easy",
          servings: 2,
          cookingTime: 30,
        },
  });

  const onSubmit = async (data: RecipeFormData) => {
    if (isEditing) {
      await updateRecipe.mutateAsync({ id: recipe.id, data });
      router.push(`/recipes/${recipe.id}`);
    } else {
      const created = await createRecipe.mutateAsync(data);
      router.push(`/recipes/${created.id}`);
    }
  };

  const isPending = createRecipe.isPending || updateRecipe.isPending;

  return (
    <PageTransition>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Recipe" : "New Recipe"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Recipe Image</Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    className="max-w-md"
                  />
                )}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter recipe name"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the recipe"
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category, Difficulty */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECIPE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as Difficulty)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DIFFICULTY_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Cooking time, Servings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cookingTime">Cooking Time (min)</Label>
                <Input
                  id="cookingTime"
                  type="number"
                  min={1}
                  placeholder="30"
                  {...register("cookingTime")}
                />
                {errors.cookingTime && (
                  <p className="text-xs text-red-500">
                    {errors.cookingTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min={1}
                  placeholder="2"
                  {...register("servings")}
                />
                {errors.servings && (
                  <p className="text-xs text-red-500">
                    {errors.servings.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Add Recipe"}
          </Button>
        </div>
      </form>
    </PageTransition>
  );
}

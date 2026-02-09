"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/files/image-upload";
import { useCreateProduct, useUpdateProduct } from "@/hooks/queries/use-products";
import {
  productFormSchema,
  type ProductFormInput,
  type ProductDto,
  PRODUCT_CATEGORIES,
} from "@/application/dto/product.dto";

interface ProductFormProps {
  product?: ProductDto;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl,
          isActive: product.isActive,
        }
      : {
          isActive: true,
          stock: 0,
          price: 0,
          imageUrl: "",
        },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: ProductFormInput) => {
    if (isEditing && product) {
      await updateProduct.mutateAsync({ id: product.id, input: data });
    } else {
      await createProduct.mutateAsync(data);
    }
    onSuccess?.();
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" placeholder="Enter product name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            placeholder="0"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            placeholder="0"
            {...register("stock")}
          />
          {errors.stock && (
            <p className="text-xs text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          defaultValue={product?.category}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImageUpload
          currentUrl={imageUrl}
          onUpload={(url) => setValue("imageUrl", url)}
        />
        {errors.imageUrl && (
          <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}

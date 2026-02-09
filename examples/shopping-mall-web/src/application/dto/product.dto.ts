import { z } from "zod";

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const productFormSchema = z.object({
  name: z.string().min(1, "Please enter a product name").max(200, "Product name must be 200 characters or less"),
  description: z.string().min(1, "Please enter a product description"),
  price: z.coerce.number().min(0, "Price must be $0 or more"),
  category: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  imageUrl: z.string().url("Please enter a valid image URL").or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Furniture",
  "Books",
  "Sports",
  "Beauty",
  "Other",
] as const;

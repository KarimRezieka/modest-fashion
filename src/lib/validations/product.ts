import { z } from "zod";

export const productVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().or(z.literal("")),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Name required").max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category required"),
  inStock: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
  images: z.array(z.object({
    url: z.string().url("Invalid URL"),
    alt: z.string().optional(),
    position: z.number(),
  })),
  variants: z.array(productVariantSchema),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  image: z.string().url().optional(),
  sortOrder: z.number().int(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/product";

interface ProductFormProps {
  categories: Category[];
  loading?: boolean;
  onSubmit: (data: CreateProductInput) => Promise<void>;
}

export function ProductForm({ categories, loading, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { images: [], variants: [], inStock: true, featured: false, published: true },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({ control, name: "images" });
  const { fields: variantFields, append: addVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" error={errors.name?.message} {...register("name")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="product-name" error={errors.slug?.message} {...register("slug")} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-transparent border border-[#F5F1EB]/15 p-3 text-sm text-[#F5F1EB] placeholder:text-[#F5F1EB]/25 outline-none focus:border-[#F5F1EB]/40 resize-none transition-colors"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="price">Price (EGP)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="comparePrice">Compare Price</Label>
          <Input
            id="comparePrice"
            type="number"
            step="0.01"
            {...register("comparePrice", { valueAsNumber: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            className="w-full bg-transparent border-b border-[#F5F1EB]/20 py-3 text-sm text-[#F5F1EB] outline-none focus:border-[#F5F1EB]/70 transition-colors"
            {...register("categoryId")}
          >
            <option value="" className="bg-black">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {[
          { name: "inStock" as const, label: "In Stock" },
          { name: "featured" as const, label: "Featured" },
          { name: "published" as const, label: "Published" },
        ].map((f) => (
          <label key={f.name} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-[#7A8471]" {...register(f.name)} />
            <span className="text-xs tracking-wide text-[#F5F1EB]/60">{f.label}</span>
          </label>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/40">Images</p>
          <button
            type="button"
            onClick={() => addImage({ url: "", alt: "", position: imageFields.length })}
            className="flex items-center gap-1 text-xs text-[#7A8471] hover:text-[#7A8471]/70"
          >
            <Plus size={12} /> Add Image
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {imageFields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <Input placeholder="Image URL" {...register(`images.${i}.url`)} />
              <Input placeholder="Alt text" className="max-w-[200px]" {...register(`images.${i}.alt`)} />
              <button type="button" onClick={() => removeImage(i)} className="text-[#F5F1EB]/30 hover:text-red-400 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/40">Variants</p>
          <button
            type="button"
            onClick={() => addVariant({ size: "", color: "", colorHex: "", stock: 0, sku: "" })}
            className="flex items-center gap-1 text-xs text-[#7A8471] hover:text-[#7A8471]/70"
          >
            <Plus size={12} /> Add Variant
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {variantFields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-5 gap-3 items-end">
              <div><Label>Size</Label><Input placeholder="XS/S/M…" {...register(`variants.${i}.size`)} /></div>
              <div><Label>Color</Label><Input placeholder="Black" {...register(`variants.${i}.color`)} /></div>
              <div><Label>Hex</Label><Input placeholder="#0B0B0B" {...register(`variants.${i}.colorHex`)} /></div>
              <div><Label>Stock</Label><Input type="number" {...register(`variants.${i}.stock`, { valueAsNumber: true })} /></div>
              <button type="button" onClick={() => removeVariant(i)} className="text-[#F5F1EB]/30 hover:text-red-400 h-9 flex items-center">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <Button type="submit" loading={loading}>Save Product</Button>
      </div>
    </form>
  );
}

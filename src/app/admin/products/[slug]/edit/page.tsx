"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { ProductForm } from "@/components/products/product-form";
import type { CreateProductInput } from "@/lib/validations/product";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { categories } = useCategories();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    productService.getProduct(slug)
      .then(setProduct)
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (data: CreateProductInput) => {
    if (!accessToken) return;
    setSaving(true);
    setError("");
    try {
      const updated = await productService.updateProduct(slug, data, accessToken);
      setProduct(updated);
      if (updated.slug !== slug) router.push(`/admin/products/${updated.slug}/edit`);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !confirm("Delete this product? This cannot be undone.")) return;
    await productService.deleteProduct(slug, accessToken);
    router.push("/admin/products");
  };

  if (loading) {
    return <div className="p-8 animate-pulse"><div className="h-8 w-48 bg-[#F5F1EB]/5 rounded" /></div>;
  }

  if (!product) {
    return (
      <div className="p-8">
        <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">Product not found</p>
      </div>
    );
  }

  const formDefaults: CreateProductInput = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: parseFloat(product.price),
    comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : undefined,
    categoryId: product.categoryId,
    inStock: product.inStock,
    featured: product.featured,
    published: product.published,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt ?? undefined,
      position: img.position,
    })),
    variants: product.variants.map((v) => ({
      size: v.size ?? undefined,
      color: v.color ?? undefined,
      colorHex: v.colorHex ?? undefined,
      stock: v.stock,
      sku: v.sku ?? undefined,
    })),
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors">
          <ArrowLeft size={12} /> Products
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/product/${slug}`} target="_blank" className="flex items-center gap-1.5 text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors">
            <Eye size={13} /> Preview
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-[#F5F1EB]/30 hover:text-red-400 transition-colors">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">{product.name}</h1>
      <p className="text-xs text-[#F5F1EB]/25 font-mono mb-10">{product.slug}</p>

      {error && <p className="text-xs text-red-400 mb-6 bg-red-400/5 border border-red-400/20 px-4 py-3">{error}</p>}

      <ProductForm
        key={product.slug}
        categories={categories}
        loading={saving}
        onSubmit={handleSubmit}
        defaultValues={formDefaults}
      />
    </div>
  );
}

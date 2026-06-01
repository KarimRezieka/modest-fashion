"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { ProductForm } from "@/components/products/product-form";
import type { CreateProductInput } from "@/lib/validations/product";

export default function NewProductPage() {
  const router = useRouter();
  const { categories } = useCategories();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: CreateProductInput) => {
    if (!accessToken) return;
    setSaving(true);
    setError("");
    try {
      const product = await productService.createProduct(data, accessToken);
      router.push(`/admin/products/${product.slug}/edit`);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors mb-8">
        <ArrowLeft size={12} /> Products
      </Link>

      <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-10">New Product</h1>

      {error && <p className="text-xs text-red-400 mb-6 bg-red-400/5 border border-red-400/20 px-4 py-3">{error}</p>}

      <ProductForm categories={categories} loading={saving} onSubmit={handleSubmit} />
    </div>
  );
}

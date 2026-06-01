"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import type { CreateProductInput } from "@/lib/validations/product";

export default function AdminProductsPage() {
  const { products, loading, refetch } = useProducts({ limit: 48 });
  const { categories } = useCategories();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateProductInput) => {
    if (!accessToken) return;
    setSaving(true);
    setError("");
    try {
      await productService.createProduct(data, accessToken);
      setShowForm(false);
      await refetch();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!accessToken || !confirm("Delete this product?")) return;
    try {
      await productService.deleteProduct(slug, accessToken);
      await refetch();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/30 mb-1">Admin</p>
          <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide">Products</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"} size="sm">
          {showForm ? "Cancel" : <><Plus size={14} /> New Product</>}
        </Button>
      </div>

      {showForm && (
        <div className="border border-[#F5F1EB]/10 p-8 mb-10">
          <h2 className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 mb-8">New Product</h2>
          {error && <p className="text-xs text-red-400 mb-6">{error}</p>}
          <ProductForm categories={categories} loading={saving} onSubmit={handleCreate} />
        </div>
      )}

      {loading ? (
        <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">Loading…</p>
      ) : (
        <div className="border border-[#F5F1EB]/10">
          <div className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-6 py-3 border-b border-[#F5F1EB]/10 text-[10px] tracking-widest uppercase text-[#F5F1EB]/30">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span className="text-right">Actions</span>
          </div>

          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-4 px-6 py-4 border-b border-[#F5F1EB]/5 hover:bg-[#F5F1EB]/2 transition-colors items-center"
            >
              <div>
                <p className="text-sm text-[#F5F1EB]/80">{p.name}</p>
                <p className="text-xs text-[#F5F1EB]/30 font-mono mt-0.5">{p.slug}</p>
              </div>
              <span className="text-xs text-[#F5F1EB]/40">{p.category.name}</span>
              <span className="text-xs text-[#F5F1EB]/70">EGP {parseFloat(p.price).toLocaleString()}</span>
              <span className={`text-xs ${p.inStock ? "text-[#7A8471]" : "text-red-400/70"}`}>
                {p.inStock ? "In Stock" : "Out"}
              </span>
              <div className="flex items-center gap-3 justify-end">
                <Link href={`/product/${p.slug}`} className="text-[#F5F1EB]/30 hover:text-[#F5F1EB]/70 transition-colors">
                  <Eye size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(p.slug)}
                  className="text-[#F5F1EB]/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-xs text-[#F5F1EB]/20 tracking-widest uppercase">No products yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
